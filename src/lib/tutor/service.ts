import { randomUUID } from 'node:crypto';
import type { Db } from '@/lib/db';
import type { AnswerKey, Response } from '@/lib/assessment/types';
import {
  AttemptError,
  getAttemptState,
  getResult,
  type AttemptItemState,
  type AttemptState,
} from '@/lib/attempts/service';
import { getQuestionVersion, toReviewable, type ReviewableQuestion, type StimulusPayload } from '@/lib/content/repository';
import { labelsFor, requireExamConfig } from '@/lib/exams/registry';
import { renderMarkdown } from '@/lib/markdown';
import { AI_LABEL, MAX_OUTPUT_TOKENS, tutorSettings, type TutorKind } from './config';
import { anthropicTutorClient, type TutorFailure, type TutorModelClient } from './client';
import {
  debriefPrompt,
  explainPrompt,
  hintPrompt,
  type DebriefInput,
  type TutorQuestion,
  type TutorSolution,
} from './prompts';
import { checkDebriefForForecasts, checkHintForLeaks } from './safety';

/**
 * The AI tutor's server side.
 *
 * Authorisation is decided HERE, from the attempt, before anything is sent to
 * the model - never by the browser. The rules mirror the ones that already
 * govern answer keys:
 *
 *   hint     only in an untimed learning session, only for the question the
 *            learner is on, only until they check their answer
 *   explain  only once the learner is entitled to see the answer: after
 *            checking an answer in a learning session, or after the attempt is over
 *   debrief  only once the attempt is over
 *
 * So a timed section, a diagnostic or a simulation can never be assisted, and
 * the tutor can never become a way to read an answer key early.
 */

export class TutorError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
    readonly detail?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'TutorError';
  }
}

export interface TutorReply {
  responseId: string;
  kind: TutorKind;
  html: string;
  label: string;
  cached: boolean;
  truncated: boolean;
}

interface Caller {
  userId: string;
  isGuest: boolean;
}

// ---------------------------------------------------------------------------
// Limits
// ---------------------------------------------------------------------------

function startOfUtcDay(now: Date): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
}

/** Model calls actually made - cache hits are free and do not count. */
async function modelCallsToday(db: Db, now: Date, userId?: string): Promise<number> {
  const since = startOfUtcDay(now);
  const row = userId
    ? ((await db
        .prepare(
          `SELECT COUNT(*) AS n FROM tutor_usage
           WHERE user_id = ? AND created_at >= ? AND cache_hit = 0 AND outcome <> 'blocked'`,
        )
        .get(userId, since)) as { n: number })
    : ((await db
        .prepare(
          `SELECT COUNT(*) AS n FROM tutor_usage
           WHERE created_at >= ? AND cache_hit = 0 AND outcome <> 'blocked'`,
        )
        .get(since)) as { n: number });
  return row.n;
}

export interface TutorQuota {
  usedToday: number;
  dailyLimit: number;
  remaining: number;
}

export async function quotaFor(db: Db, caller: Caller, now = new Date()): Promise<TutorQuota> {
  const { limits } = tutorSettings();
  const dailyLimit = caller.isGuest ? limits.perGuestDaily : limits.perAccountDaily;
  const usedToday = (await modelCallsToday(db, now, caller.userId));
  return { usedToday, dailyLimit, remaining: Math.max(0, dailyLimit - usedToday) };
}

async function assertWithinLimits(db: Db, caller: Caller, now: Date): Promise<void> {
  const { limits } = tutorSettings();
  if ((await modelCallsToday(db, now)) >= limits.globalDaily) {
    throw new TutorError(
      'tutor-busy',
      'The AI tutor has reached its limit for today. Every question still has its full reviewed explanation.',
      429,
    );
  }
  const quota = (await quotaFor(db, caller, now));
  if (quota.remaining <= 0) {
    throw new TutorError(
      'tutor-quota',
      caller.isGuest
        ? `You have used today's ${quota.dailyLimit} AI requests for guests. Create a free account for more, or come back tomorrow.`
        : `You have used today's ${quota.dailyLimit} AI requests. They reset at midnight UTC.`,
      429,
      { dailyLimit: quota.dailyLimit },
    );
  }
}

async function recordUsage(
  db: Db,
  caller: Caller,
  kind: TutorKind,
  outcome: 'ok' | 'error' | 'refused' | 'unsafe' | 'blocked',
  cacheHit: boolean,
  responseId: string | null,
  now: Date,
): Promise<void> {
  (await db.prepare(
    `INSERT INTO tutor_usage (user_id, kind, response_id, cache_hit, outcome, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(caller.userId, kind, responseId, cacheHit ? 1 : 0, outcome, now.toISOString()));
}

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

interface StoredResponse {
  id: string;
  body_md: string;
}

async function cached(db: Db, cacheKey: string, userId: string | null): Promise<StoredResponse | undefined> {
  // Debriefs are personal: only ever served back to the learner they describe.
  const sql = userId
    ? `SELECT id, body_md FROM tutor_responses
       WHERE cache_key = ? AND withdrawn_at IS NULL AND user_id = ?
       ORDER BY created_at DESC LIMIT 1`
    : `SELECT id, body_md FROM tutor_responses
       WHERE cache_key = ? AND withdrawn_at IS NULL
       ORDER BY created_at DESC LIMIT 1`;
  return (userId ? (await db.prepare(sql).get(cacheKey, userId)) : (await db.prepare(sql).get(cacheKey))) as
    | StoredResponse
    | undefined;
}

async function store(
  db: Db,
  input: {
    kind: TutorKind;
    cacheKey: string;
    questionId: string | null;
    questionVersionId: string | null;
    attemptId: string | null;
    userId: string;
    model: string;
    bodyMd: string;
    inputTokens: number;
    outputTokens: number;
  },
  now: Date,
): Promise<string> {
  const id = randomUUID();
  (await db.prepare(
    `INSERT INTO tutor_responses (id, kind, cache_key, question_id, question_version_id, attempt_id,
                                  user_id, model, body_md, input_tokens, output_tokens, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.kind,
    input.cacheKey,
    input.questionId,
    input.questionVersionId,
    input.attemptId,
    // Hints and explanations are about a question, not a person, and are
    // shared between learners; only a debrief is personal, so only a debrief
    // records whose it is.
    input.kind === 'debrief' ? input.userId : null,
    input.model,
    input.bodyMd,
    input.inputTokens,
    input.outputTokens,
    now.toISOString(),
  ));
  return id;
}

function reply(kind: TutorKind, id: string, bodyMd: string, cachedHit: boolean, truncated = false): TutorReply {
  return {
    responseId: id,
    kind,
    // Model output is untrusted: it goes through the same sanitising renderer
    // as everything else, so it cannot inject markup or scripts.
    html: renderMarkdown(bodyMd),
    label: AI_LABEL,
    cached: cachedHit,
    truncated,
  };
}

const FAILURE_MESSAGE: Record<TutorFailure, string> = {
  disabled: 'The AI tutor is not switched on for this site.',
  refused: 'The AI tutor declined to answer this one. The reviewed explanation is still complete.',
  rate_limited: 'The AI tutor is busy right now. Please try again in a minute.',
  unavailable: 'The AI tutor could not be reached. Please try again shortly - the reviewed explanation is unaffected.',
  misconfigured: 'The AI tutor is unavailable at the moment.',
  empty: 'The AI tutor did not return anything. Please try again.',
};

function failure(kind: TutorFailure): TutorError {
  const status = kind === 'rate_limited' ? 429 : kind === 'disabled' ? 404 : 503;
  return new TutorError(`tutor-${kind.replace('_', '-')}`, FAILURE_MESSAGE[kind], status);
}

// ---------------------------------------------------------------------------
// Turning stored content into prompt input
// ---------------------------------------------------------------------------

function stimulusText(stimulus: StimulusPayload | null): string | null {
  if (!stimulus) return null;
  const parts: string[] = [];
  if (stimulus.title) parts.push(`**${stimulus.title}**`);
  if (stimulus.bodyMd) parts.push(stimulus.bodyMd);
  const data = stimulus.data as
    | { columns?: Array<{ key: string; label: string }>; rows?: Array<Record<string, unknown>>; caption?: string }
    | null;
  if (data?.columns?.length && data.rows?.length) {
    const header = `| ${data.columns.map((c) => c.label).join(' | ')} |`;
    const rule = `| ${data.columns.map(() => '---').join(' | ')} |`;
    const rows = data.rows.map((row) => `| ${data.columns!.map((c) => String(row[c.key] ?? '')).join(' | ')} |`);
    parts.push([data.caption ?? '', header, rule, ...rows].filter(Boolean).join('\n'));
  }
  // Charts are described for screen readers; the same description serves here.
  if (!stimulus.bodyMd && !data?.rows?.length) parts.push(stimulus.accessibilityText);
  return parts.join('\n\n');
}

function optionText(question: ReviewableQuestion, id: string): string {
  const option = question.options.find((o) => o.id === id);
  return option ? `${option.label}: ${option.textMd}` : id;
}

function answerSummary(question: ReviewableQuestion): string {
  const key = question.answerKey as AnswerKey;
  switch (key.type) {
    case 'single_select':
      return optionText(question, key.optionId);
    case 'multi_select':
      return key.optionIds.map((id) => optionText(question, id)).join('; ');
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return `Choice ${key.choice}`;
    case 'numeric_entry':
      return key.accepted
        .map((a) =>
          a.kind === 'range' ? `any value from ${a.min} to ${a.max}` : a.kind === 'tolerance' ? `${a.value} (± ${a.tolerance})` : String(a.value),
        )
        .join(' or ');
    case 'two_part':
      return key.selections.map((s) => `${s.columnId}: ${optionText(question, s.optionId)}`).join('; ');
    case 'essay':
      return 'Essays are not scored automatically.';
    default:
      return '';
  }
}

function correctChoiceTexts(question: ReviewableQuestion): string[] {
  const key = question.answerKey as AnswerKey;
  const text = (id: string) => question.options.find((o) => o.id === id)?.textMd ?? '';
  if (key.type === 'single_select') return [text(key.optionId)];
  if (key.type === 'multi_select') return key.optionIds.map(text);
  if (key.type === 'two_part') return key.selections.map((s) => text(s.optionId));
  return [];
}

function correctValues(question: ReviewableQuestion): string[] {
  const key = question.answerKey as AnswerKey;
  if (key.type !== 'numeric_entry') return [];
  return key.accepted.flatMap((a) =>
    a.kind === 'range' ? [] : [String(a.value)],
  );
}

function responseSummary(question: ReviewableQuestion, response: Response | null): string | null {
  if (!response) return null;
  switch (response.type) {
    case 'single_select':
      return optionText(question, response.optionId);
    case 'multi_select':
      return response.optionIds.map((id) => optionText(question, id)).join('; ');
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return `Choice ${response.choice}`;
    case 'numeric_entry':
      return response.raw;
    case 'two_part':
      return response.selections.map((s) => `${s.columnId}: ${optionText(question, s.optionId)}`).join('; ');
    case 'essay':
      return 'An essay response.';
    default:
      return null;
  }
}

/** A stable identifier for what the learner chose, for the cache key. */
function responseFingerprint(response: Response | null): string {
  if (!response) return 'blank';
  switch (response.type) {
    case 'single_select':
      return response.optionId;
    case 'multi_select':
      return [...response.optionIds].sort().join('+');
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return response.choice;
    case 'numeric_entry':
      return `n:${response.raw.trim()}`;
    case 'two_part':
      return response.selections.map((s) => `${s.columnId}=${s.optionId}`).sort().join('+');
    default:
      return response.type;
  }
}

function tutorQuestion(state: AttemptState, question: ReviewableQuestion): TutorQuestion {
  const config = requireExamConfig(state.examKey);
  const labels = labelsFor(config);
  return {
    examName: config.name,
    sectionName: labels.sections[question.sectionKey] ?? question.sectionKey,
    skillName: labels.skills[question.skillSlug] ?? question.skillSlug,
    responseType: question.responseType,
    stemMd: question.stemMd,
    instructionsMd: question.instructionsMd,
    stimulusMd: stimulusText(question.stimulus),
    options: question.options,
  };
}

function tutorSolution(question: ReviewableQuestion): TutorSolution {
  return {
    answerSummary: answerSummary(question),
    explanationMd: question.explanationMd,
    distractorRationale: question.distractorRationale,
  };
}

function findItem(state: AttemptState, partIndex: number, position: number): AttemptItemState {
  const part = state.parts.find((p) => p.partIndex === partIndex);
  const item = part?.items.find((i) => i.position === position);
  if (!part || !item) throw new TutorError('unknown-item', 'That question is not part of this session.', 404);
  return item;
}

async function loadReviewable(db: Db, item: AttemptItemState): Promise<ReviewableQuestion> {
  const version = (await getQuestionVersion(db, item.questionVersionId));
  if (!version) throw new TutorError('unknown-item', 'That question could not be found.', 404);
  return (await toReviewable(db, version));
}

async function loadState(db: Db, attemptId: string, userId: string): Promise<AttemptState> {
  try {
    return (await getAttemptState(db, attemptId, userId));
  } catch (error) {
    // Someone else's attempt looks exactly like a missing one.
    if (error instanceof AttemptError && (error.status === 404 || error.status === 403)) {
      throw new TutorError('unknown-attempt', 'That session could not be found.', 404);
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// The three things the tutor does
// ---------------------------------------------------------------------------

export interface QuestionHelpInput {
  attemptId: string;
  partIndex: number;
  position: number;
  kind: 'hint' | 'explain';
  level?: 1 | 2;
}

export async function questionHelp(
  db: Db,
  caller: Caller,
  input: QuestionHelpInput,
  options: { client?: TutorModelClient; now?: Date } = {},
): Promise<TutorReply> {
  const now = options.now ?? new Date();
  const client = options.client ?? anthropicTutorClient;
  const settings = tutorSettings();
  if (!settings.enabled && !options.client) throw failure('disabled');

  const state = (await loadState(db, input.attemptId, caller.userId));
  const item = findItem(state, input.partIndex, input.position);

  if (input.kind === 'hint') {
    const live = state.status === 'in_progress';
    const onThisPart = state.currentPartIndex === input.partIndex;
    if (!live || !state.immediateFeedback || !onThisPart) {
      (await recordUsage(db, caller, 'hint', 'blocked', false, null, now));
      throw new TutorError(
        'tutor-not-allowed',
        'Hints are available only in untimed learning sessions, never in timed sections, diagnostics or simulations.',
        403,
      );
    }
    // A chosen answer can still be changed until it is checked, so a hint is
    // still useful then. Once the answer is checked the key is showing, and a
    // hint would be pointless - ask for the deeper explanation instead.
    if (item.feedbackReleased || item.review) {
      throw new TutorError(
        'tutor-already-answered',
        'You have checked this answer, so the explanation is showing - ask for a deeper explanation instead.',
        409,
      );
    }
  } else if (!item.review) {
    // Exactly the rule that withholds the answer key.
    (await recordUsage(db, caller, 'explain', 'blocked', false, null, now));
    throw new TutorError(
      'tutor-not-allowed',
      'An explanation is available once you are allowed to see the answer: after checking your answer in a learning session, or when the session is over.',
      403,
    );
  }

  const question = (await loadReviewable(db, item));
  const level = input.level ?? 1;
  const cacheKey =
    input.kind === 'hint'
      ? `hint:v2:${question.questionVersionId}:${level}`
      : `explain:v2:${question.questionVersionId}:${responseFingerprint(item.response)}`;

  const hit = (await cached(db, cacheKey, null));
  if (hit) {
    (await recordUsage(db, caller, input.kind, 'ok', true, hit.id, now));
    return reply(input.kind, hit.id, hit.body_md, true);
  }

  (await assertWithinLimits(db, caller, now));

  const promptQuestion = tutorQuestion(state, question);
  const solution = tutorSolution(question);

  if (input.kind === 'hint') {
    const visibleText = [question.stemMd, question.instructionsMd ?? '', promptQuestion.stimulusMd ?? '', ...question.options.map((o) => o.textMd)].join('\n');
    const prompt = hintPrompt(promptQuestion, solution, level);

    // One retry: a leaked hint is usually a one-off phrasing, and the second
    // attempt is told exactly what went wrong.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const result = await client.complete({
        system: prompt.system,
        user:
          attempt === 0
            ? prompt.user
            : `${prompt.user}\n\nYour previous hint gave the answer away. Write a hint that points to the method only.`,
        maxTokens: MAX_OUTPUT_TOKENS.hint,
      });
      if (!result.ok) {
        (await recordUsage(db, caller, 'hint', result.kind === 'refused' ? 'refused' : 'error', false, null, now));
        throw failure(result.kind);
      }
      const check = checkHintForLeaks({
        hint: result.text,
        correctChoiceTexts: correctChoiceTexts(question),
        correctValues: correctValues(question),
        visibleText,
      });
      if (!check.safe) {
        (await recordUsage(db, caller, 'hint', 'unsafe', false, null, now));
        continue;
      }
      const id = (await store(
        db,
        {
          kind: 'hint',
          cacheKey,
          questionId: question.questionId,
          questionVersionId: question.questionVersionId,
          attemptId: null,
          userId: caller.userId,
          model: result.model,
          bodyMd: result.text,
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens,
        },
        now,
      ));
      (await recordUsage(db, caller, 'hint', 'ok', false, id, now));
      return reply('hint', id, result.text, false, result.truncated);
    }

    throw new TutorError(
      'tutor-hint-unsafe',
      'We could not write a hint for this one without giving the answer away. Answer it and you will see the full explanation.',
      422,
    );
  }

  const chosenId = item.response?.type === 'single_select' ? item.response.optionId : null;
  const prompt = explainPrompt(promptQuestion, solution, {
    summary: responseSummary(question, item.response),
    correct: item.review?.correct ?? null,
    rationaleForChoice: chosenId ? (question.distractorRationale[chosenId] ?? null) : null,
  });
  const result = await client.complete({ system: prompt.system, user: prompt.user, maxTokens: MAX_OUTPUT_TOKENS.explain });
  if (!result.ok) {
    (await recordUsage(db, caller, 'explain', result.kind === 'refused' ? 'refused' : 'error', false, null, now));
    throw failure(result.kind);
  }
  const id = (await store(
    db,
    {
      kind: 'explain',
      cacheKey,
      questionId: question.questionId,
      questionVersionId: question.questionVersionId,
      attemptId: null,
      userId: caller.userId,
      model: result.model,
      bodyMd: result.text,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
    },
    now,
  ));
  (await recordUsage(db, caller, 'explain', 'ok', false, id, now));
  return reply('explain', id, result.text, false, result.truncated);
}

function excerpt(text: string, max = 280): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length <= max ? flat : `${flat.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

/** Builds the debrief's input from the stored result. Exported for tests. */
export async function buildDebriefInput(db: Db, state: AttemptState, userId: string): Promise<DebriefInput> {
  const result = (await getResult(db, state.id, userId));
  if (!result) throw new TutorError('tutor-no-result', 'This session has no results yet.', 409);

  const config = requireExamConfig(state.examKey);
  const labels = labelsFor(config);
  const items = state.parts.flatMap((p) => p.items);

  const typicalBySkill = new Map<string, number[]>();
  for (const item of items) {
    const skill = item.question.skillSlug;
    if (!skill) continue;
    const list = typicalBySkill.get(skill) ?? [];
    list.push(item.question.estimatedSeconds);
    typicalBySkill.set(skill, list);
  }

  const skillRows = (result.bySkill as Array<Record<string, unknown>>).map((row) => {
    const key = String(row.key);
    const typical = typicalBySkill.get(key);
    const median = typeof row.medianTimeMs === 'number' && row.medianTimeMs > 0 ? Math.round(row.medianTimeMs / 1000) : null;
    return {
      label: String(row.label ?? labels.skills[key] ?? key),
      correct: Number(row.correct ?? 0),
      incorrect: Number(row.incorrect ?? 0),
      omitted: Number(row.omitted ?? 0),
      medianSeconds: median,
      typicalSeconds: typical?.length ? Math.round(typical.reduce((a, b) => a + b, 0) / typical.length) : null,
    };
  });

  // Wrong answers first - they carry an editor's note on the specific
  // misreading - then blanks. Eight is enough to find patterns without
  // sending the whole session.
  const missed = (await Promise.all(items
    .filter((item) => item.review && item.review.correct !== true && item.question.responseType !== 'essay')
    .sort((a, b) => Number(b.answered) - Number(a.answered))
    .slice(0, 8)
    .map(async (item) => {
      const question = (await loadReviewable(db, item));
      const chosenId = item.response?.type === 'single_select' ? item.response.optionId : null;
      return {
        skill: labels.skills[question.skillSlug] ?? question.skillSlug,
        stemExcerpt: excerpt(question.stemMd),
        learnerChoice: responseSummary(question, item.response),
        correctAnswer: answerSummary(question),
        editorNote: chosenId ? (question.distractorRationale[chosenId] ?? null) : null,
      };
    })));

  const limits = state.parts.map((p) => p.timeLimitSeconds).filter((s): s is number => typeof s === 'number');
  const scoring = config.scoring;
  const examFacts = [
    `How this practice session was scored, from the exam configuration: correct ${scoring.pointsCorrect > 0 ? '+' : ''}${scoring.pointsCorrect}, wrong ${scoring.pointsIncorrect}, blank ${scoring.pointsOmitted}.`,
  ];
  if (scoring.pointsIncorrect < 0) {
    examFacts.push(
      `On ${config.shortName} a wrong answer costs ${Math.abs(scoring.pointsIncorrect)} of a point while a blank costs nothing, so a blind guess has a negative expected value unless choices can be eliminated.`,
    );
  } else if (scoring.pointsIncorrect === 0 && scoring.pointsOmitted === 0) {
    examFacts.push(`On ${config.shortName} a wrong answer scores the same as a blank.`);
  }

  return {
    examName: config.name,
    sessionLabel: state.blueprintLabel,
    timed: limits.length > 0,
    timeLimitMinutes: limits.length ? Math.round(limits.reduce((a, b) => a + b, 0) / 60) : null,
    minutesUsed: Math.round(result.totals.totalTimeMs / 60000),
    expired: state.status === 'expired',
    totals: { correct: result.totals.correct, incorrect: result.totals.incorrect, omitted: result.totals.omitted },
    examFacts,
    skills: skillRows,
    missed,
  };
}

export async function debrief(
  db: Db,
  caller: Caller,
  attemptId: string,
  options: { client?: TutorModelClient; now?: Date } = {},
): Promise<TutorReply> {
  const now = options.now ?? new Date();
  const client = options.client ?? anthropicTutorClient;
  if (!tutorSettings().enabled && !options.client) throw failure('disabled');

  const state = (await loadState(db, attemptId, caller.userId));
  if (state.status === 'in_progress') {
    (await recordUsage(db, caller, 'debrief', 'blocked', false, null, now));
    throw new TutorError('tutor-not-allowed', 'The after-test guide is available once the session is finished.', 403);
  }

  const cacheKey = `debrief:v2:${attemptId}`;
  const hit = (await cached(db, cacheKey, caller.userId));
  if (hit) {
    (await recordUsage(db, caller, 'debrief', 'ok', true, hit.id, now));
    return reply('debrief', hit.id, hit.body_md, true);
  }

  (await assertWithinLimits(db, caller, now));

  const prompt = debriefPrompt((await buildDebriefInput(db, state, caller.userId)));
  const result = await client.complete({ system: prompt.system, user: prompt.user, maxTokens: MAX_OUTPUT_TOKENS.debrief });
  if (!result.ok) {
    (await recordUsage(db, caller, 'debrief', result.kind === 'refused' ? 'refused' : 'error', false, null, now));
    throw failure(result.kind);
  }

  const check = checkDebriefForForecasts(result.text);
  if (!check.safe) {
    (await recordUsage(db, caller, 'debrief', 'unsafe', false, null, now));
    console.warn('[tutor] withheld a debrief that', check.reason);
    throw new TutorError(
      'tutor-debrief-unsafe',
      'The AI guide strayed into predicting a score, which we do not allow, so we withheld it. Please try again.',
      422,
    );
  }

  const id = (await store(
    db,
    {
      kind: 'debrief',
      cacheKey,
      questionId: null,
      questionVersionId: null,
      attemptId,
      userId: caller.userId,
      model: result.model,
      bodyMd: result.text,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
    },
    now,
  ));
  (await recordUsage(db, caller, 'debrief', 'ok', false, id, now));
  return reply('debrief', id, result.text, false, result.truncated);
}

// ---------------------------------------------------------------------------
// Reports about an AI response
// ---------------------------------------------------------------------------

export async function flagResponse(
  db: Db,
  caller: Caller,
  input: { responseId: string; details?: string },
  now = new Date(),
): Promise<void> {
  const row = (await db
    .prepare(`SELECT id, kind, question_id, question_version_id, attempt_id, user_id FROM tutor_responses WHERE id = ?`)
    .get(input.responseId)) as
    | { id: string; kind: string; question_id: string | null; question_version_id: string | null; attempt_id: string | null; user_id: string | null }
    | undefined;
  // A debrief belongs to one learner; nobody else can see it, so nobody else
  // can report it. Hints and explanations are shared across learners.
  if (!row || (row.kind === 'debrief' && row.user_id !== caller.userId)) {
    throw new TutorError('unknown-response', 'We could not find that AI response.', 404);
  }

  (await db.prepare(
    `INSERT INTO content_flags (id, question_id, question_version_id, user_id, reason, details,
                                status, resolution, created_at, resolved_at, tutor_response_id)
     VALUES (?, ?, ?, ?, 'ai_response', ?, 'open', NULL, ?, NULL, ?)`,
  ).run(
    randomUUID(),
    row.question_id ?? `attempt:${row.attempt_id ?? 'unknown'}`,
    row.question_version_id,
    caller.userId,
    input.details?.trim() || null,
    now.toISOString(),
    row.id,
  ));
}

/** Editors withdraw a response after a report; the next request makes a new one. */
export async function withdrawResponse(db: Db, responseId: string, now = new Date()): Promise<boolean> {
  return (
    (await db
      .prepare(`UPDATE tutor_responses SET withdrawn_at = ? WHERE id = ? AND withdrawn_at IS NULL`)
      .run(now.toISOString(), responseId)).changes > 0
  );
}
