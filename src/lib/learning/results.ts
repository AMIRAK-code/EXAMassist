import type { Db } from '@/lib/db';
import type { AttemptRow, QuestionVersionRow } from '@/lib/db/rows';
import { getBlueprint, getHubForConfig, labelsFor, requireExamConfig } from '@/lib/exams/registry';
import type { ExamConfig, Response } from '@/lib/assessment/types';
import { responseSchema } from '@/lib/assessment/types';
import { getPool, getQuestionVersions, toReviewable, type ReviewableQuestion } from '@/lib/content/repository';
import { facetsFromPool, practiceFacets } from '@/lib/attempts/availability';
import { eligibleCount } from '@/lib/attempts/facets';
import { getResult, retryCandidates } from '@/lib/attempts/service';
import { blueprintForAttempt, isRetryAttempt } from '@/lib/attempts/retry';
import { MIN_ATTEMPTS_FOR_SIGNAL } from './recommend';
import { labelsForItems, type MistakeLabel } from './mistakes';

/**
 * A finished session's results and its question-by-question review, as data.
 *
 * Read for the owner only (every query is scoped to the attempt after the
 * attempt is checked against the user). Nothing is scored again: outcomes are
 * the ones stored when the session was finalised, against the question
 * version the learner was shown.
 */

export type Outcome = 'correct' | 'incorrect' | 'blank' | 'not-scored';

/**
 * Where a question stands now, against the version the learner answered:
 * unchanged, corrected since (a newer reviewed version is in use), or not
 * offered at all at the moment (withdrawn, quarantined or back under review).
 */
export type Correction = 'current' | 'corrected' | 'unavailable';

export interface ResultItem {
  ordinal: number;
  attemptItemId: string;
  partIndex: number;
  partLabel: string;
  position: number;
  questionId: string;
  questionVersionId: string;
  outcome: Outcome;
  domainSlug: string;
  domainName: string;
  skillSlug: string;
  skillName: string;
  flagged: boolean;
  /** The learner had been shown this question in an earlier session. */
  seenBefore: boolean;
  correction: Correction;
  labels: MistakeLabel[];
  responseJson: string | null;
}

export interface TopicResult {
  slug: string;
  name: string;
  scored: number;
  correct: number;
  incorrect: number;
  blank: number;
  hasSignal: boolean;
  accuracy: number | null;
  skills: Array<{ slug: string; name: string; scored: number; correct: number; missed: number }>;
}

export interface PracticeSuggestion {
  basis: string;
  skill: { slug: string; name: string; unseen: number; reviewed: number };
  topic: { slug: string; name: string; unseen: number; reviewed: number };
}

export interface ResultsSummary {
  attemptId: string;
  examKey: string;
  examShortName: string;
  status: AttemptRow['status'];
  blueprintLabel: string;
  fidelityNote: string;
  finishedAt: string;
  isRetry: boolean;
  retrySourceAttemptId: string | null;
  partCount: number;
  totals: { correct: number; incorrect: number; omitted: number; pointsEarned: number; pointsPossible: number; totalTimeMs: number };
  penalties: { correct: number; incorrect: number; omitted: number } | null;
  items: ResultItem[];
  topics: TopicResult[];
  seenBeforeCount: number;
  retry: { available: string[]; unavailable: number };
  practice: PracticeSuggestion | null;
  methodology: {
    officialFacts: { scale?: { label: string; min: number; max: number } | null; pointsCorrect: number; pointsIncorrect: number; pointsOmitted: number };
    ourApproximation: { fidelityNote: string };
    notProvided: { scaledScore: string | null; percentiles: string };
    unverifiedRules: string[];
  };
  formatGuideHref: string | null;
}

interface ItemRow {
  itemId: string;
  partIndex: number;
  position: number;
  questionId: string;
  versionId: string;
  responseJson: string | null;
  responseStatus: 'answered' | 'unanswered';
  isCorrect: 0 | 1 | null;
  flagged: 0 | 1;
  partLabel: string;
  answeredVersion: number;
  domainSlug: string;
  skillSlug: string;
  currentVersion: number | null;
  questionState: string | null;
  currentVersionState: string | null;
}

function outcomeOf(row: Pick<ItemRow, 'isCorrect' | 'responseStatus'>): Outcome {
  if (row.isCorrect === 1) return 'correct';
  if (row.responseStatus === 'unanswered') return 'blank';
  if (row.isCorrect === 0) return 'incorrect';
  return 'not-scored';
}

export function isMiss(outcome: Outcome): boolean {
  return outcome === 'incorrect' || outcome === 'blank';
}

function correctionOf(row: Pick<ItemRow, 'answeredVersion' | 'currentVersion' | 'questionState' | 'currentVersionState'>): Correction {
  if (row.questionState !== 'published' || row.currentVersionState !== 'published') return 'unavailable';
  return (row.currentVersion ?? 0) > row.answeredVersion ? 'corrected' : 'current';
}

function ownedAttempt(db: Db, attemptId: string, userId: string): AttemptRow | undefined {
  return db.prepare('SELECT * FROM attempts WHERE id = ? AND user_id = ?').get(attemptId, userId) as AttemptRow | undefined;
}

function itemRows(db: Db, attemptId: string): ItemRow[] {
  return db
    .prepare(
      `SELECT ai.id AS itemId, ai.part_index AS partIndex, ai.position, ai.question_id AS questionId,
              ai.question_version_id AS versionId, ai.response_json AS responseJson,
              ai.response_status AS responseStatus, ai.is_correct AS isCorrect, ai.flagged,
              p.label AS partLabel, qv.version AS answeredVersion, qv.domain_slug AS domainSlug,
              qv.skill_slug AS skillSlug, q.current_version AS currentVersion, q.state AS questionState,
              (SELECT cv.state FROM question_versions cv
                WHERE cv.question_id = ai.question_id AND cv.version = q.current_version) AS currentVersionState
         FROM attempt_items ai
         JOIN attempt_parts p ON p.attempt_id = ai.attempt_id AND p.part_index = ai.part_index
         JOIN question_versions qv ON qv.id = ai.question_version_id
         LEFT JOIN questions q ON q.id = ai.question_id
        WHERE ai.attempt_id = ?
        ORDER BY ai.part_index, ai.position`,
    )
    .all(attemptId) as ItemRow[];
}

function seenEarlier(db: Db, attempt: AttemptRow, questionIds: string[]): Set<string> {
  if (questionIds.length === 0) return new Set();
  const placeholders = questionIds.map(() => '?').join(',');
  return new Set(
    (
      db
        .prepare(
          `SELECT DISTINCT ai.question_id AS questionId
             FROM attempt_items ai
             JOIN attempts a ON a.id = ai.attempt_id
            WHERE a.user_id = ? AND a.id <> ? AND a.created_at < ? AND ai.first_seen_at IS NOT NULL
              AND ai.question_id IN (${placeholders})`,
        )
        .all(attempt.user_id, attempt.id, attempt.created_at, ...questionIds) as Array<{ questionId: string }>
    ).map((row) => row.questionId),
  );
}

function toItems(db: Db, attempt: AttemptRow, config: ExamConfig): ResultItem[] {
  const labels = labelsFor(config);
  const rows = itemRows(db, attempt.id);
  const seen = seenEarlier(db, attempt, [...new Set(rows.map((row) => row.questionId))]);
  const itemLabels = labelsForItems(db, attempt.user_id, rows.map((row) => row.itemId));
  return rows.map((row, index) => ({
    ordinal: index + 1,
    attemptItemId: row.itemId,
    partIndex: row.partIndex,
    partLabel: row.partLabel,
    position: row.position,
    questionId: row.questionId,
    questionVersionId: row.versionId,
    outcome: outcomeOf(row),
    domainSlug: row.domainSlug,
    domainName: labels.domains[row.domainSlug] ?? row.domainSlug,
    skillSlug: row.skillSlug,
    skillName: labels.skills[row.skillSlug] ?? row.skillSlug,
    flagged: row.flagged === 1,
    seenBefore: seen.has(row.questionId),
    correction: correctionOf(row),
    labels: itemLabels.get(row.itemId) ?? [],
    responseJson: row.responseJson,
  }));
}

function topicsOf(config: ExamConfig, items: ResultItem[]): TopicResult[] {
  const topics: TopicResult[] = [];
  for (const domain of config.domains) {
    const inTopic = items.filter((item) => item.domainSlug === domain.slug && item.outcome !== 'not-scored');
    if (inTopic.length === 0) continue;
    const correct = inTopic.filter((item) => item.outcome === 'correct').length;
    const scored = inTopic.length;
    const skills = domain.skills
      .map((skill) => {
        const inSkill = inTopic.filter((item) => item.skillSlug === skill.slug);
        const skillCorrect = inSkill.filter((item) => item.outcome === 'correct').length;
        return { slug: skill.slug, name: skill.name, scored: inSkill.length, correct: skillCorrect, missed: inSkill.length - skillCorrect };
      })
      .filter((skill) => skill.scored > 0);
    topics.push({
      slug: domain.slug,
      name: domain.name,
      scored,
      correct,
      incorrect: inTopic.filter((item) => item.outcome === 'incorrect').length,
      blank: inTopic.filter((item) => item.outcome === 'blank').length,
      hasSignal: scored >= MIN_ATTEMPTS_FOR_SIGNAL,
      accuracy: scored >= MIN_ATTEMPTS_FOR_SIGNAL ? correct / scored : null,
      skills,
    });
  }
  // Most marks lost first; topics with no misses last.
  return topics.sort((a, b) => b.scored - b.correct - (a.scored - a.correct));
}

/**
 * New-question practice on the skill this session went worst on, with how
 * many reviewed questions the learner has never been shown there and in its
 * topic. The topic is only ever offered as a separate, explicit choice.
 */
function practiceSuggestion(db: Db, userId: string, config: ExamConfig, topics: TopicResult[]): PracticeSuggestion | null {
  const candidates = topics.flatMap((topic) => topic.skills.filter((skill) => skill.missed > 0).map((skill) => ({ topic, skill })));
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.skill.missed - a.skill.missed || a.skill.correct - b.skill.correct);
  const { topic, skill } = candidates[0];

  const practice = getBlueprint(config, 'practice');
  if (!practice) return null;
  const unseenPool = getPool(db, config.examKey, userId).filter((item) => item.lastSeenAt === null);
  const unseen = facetsFromPool(unseenPool, config, practice);
  const all = practiceFacets(db, config);
  return {
    basis: `You missed ${skill.missed} of ${skill.scored} ${skill.name} question${skill.scored === 1 ? '' : 's'} in this session.`,
    skill: {
      slug: skill.slug,
      name: skill.name,
      unseen: eligibleCount(unseen, { skill: skill.slug }),
      reviewed: eligibleCount(all, { skill: skill.slug }),
    },
    topic: {
      slug: topic.slug,
      name: topic.name,
      unseen: eligibleCount(unseen, { domain: topic.slug }),
      reviewed: eligibleCount(all, { domain: topic.slug }),
    },
  };
}

export function getResultsSummary(db: Db, attemptId: string, userId: string): ResultsSummary | null {
  const attempt = ownedAttempt(db, attemptId, userId);
  if (!attempt || attempt.status === 'in_progress') return null;
  const result = getResult(db, attemptId, userId);
  if (!result) return null;

  const config = requireExamConfig(attempt.exam_key);
  const blueprint = blueprintForAttempt(config, attempt.blueprint_id);
  const items = toItems(db, attempt, config);
  const topics = topicsOf(config, items);
  const missed = items.filter((item) => isMiss(item.outcome)).map((item) => item.questionId);
  const candidates = retryCandidates(db, userId, attempt.exam_key, missed);
  const settings = JSON.parse(attempt.settings_json) as { retry?: { sourceAttemptId: string | null } };
  const hub = getHubForConfig(attempt.exam_key);
  const methodology = result.methodology as ResultsSummary['methodology'];

  return {
    attemptId,
    examKey: attempt.exam_key,
    examShortName: config.shortName,
    status: attempt.status,
    blueprintLabel: blueprint?.label ?? attempt.blueprint_id,
    fidelityNote: blueprint?.fidelityNote ?? '',
    finishedAt: attempt.submitted_at ?? result.computedAt,
    isRetry: isRetryAttempt(attempt),
    retrySourceAttemptId: settings.retry?.sourceAttemptId ?? null,
    partCount: new Set(items.map((item) => item.partIndex)).size,
    totals: result.totals,
    penalties:
      config.scoring.pointsIncorrect !== 0
        ? { correct: config.scoring.pointsCorrect, incorrect: config.scoring.pointsIncorrect, omitted: config.scoring.pointsOmitted }
        : null,
    items,
    topics,
    seenBeforeCount: items.filter((item) => item.seenBefore).length,
    retry: { available: candidates.available.map((item) => item.questionId), unavailable: candidates.unavailable.length },
    practice: practiceSuggestion(db, userId, config, topics),
    methodology,
    formatGuideHref: hub ? `/exams/${hub.slug}/format` : null,
  };
}

// ---------------------------------------------------------------------------
// One question, reviewed on its own page
// ---------------------------------------------------------------------------

export interface ReviewItem {
  attemptId: string;
  examKey: string;
  examShortName: string;
  blueprintLabel: string;
  isRetry: boolean;
  total: number;
  item: ResultItem;
  question: ReviewableQuestion;
  response: Response | null;
  previous: number | null;
  next: number | null;
  nextMistake: number | null;
  retryable: boolean;
  bookmarked: boolean;
}

function parseResponse(json: string | null): Response | null {
  if (!json) return null;
  try {
    const parsed = responseSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** Question `ordinal` (1-based, across sections) of a finished attempt, for its owner. */
export function getReviewItem(db: Db, attemptId: string, userId: string, ordinal: number): ReviewItem | null {
  const attempt = ownedAttempt(db, attemptId, userId);
  if (!attempt || attempt.status === 'in_progress') return null;
  const config = requireExamConfig(attempt.exam_key);
  const items = toItems(db, attempt, config);
  const item = items[ordinal - 1];
  if (!Number.isInteger(ordinal) || !item) return null;

  const version = getQuestionVersions(db, [item.questionVersionId]).get(item.questionVersionId) as QuestionVersionRow | undefined;
  if (!version) return null;
  const blueprint = blueprintForAttempt(config, attempt.blueprint_id);
  const later = items.slice(ordinal).find((other) => isMiss(other.outcome));
  const retryable = isMiss(item.outcome) && retryCandidates(db, userId, attempt.exam_key, [item.questionId]).available.length > 0;
  const bookmarked = !!db
    .prepare('SELECT 1 FROM bookmarks WHERE user_id = ? AND question_id = ?')
    .get(userId, item.questionId);

  return {
    attemptId,
    examKey: attempt.exam_key,
    examShortName: config.shortName,
    blueprintLabel: blueprint?.label ?? attempt.blueprint_id,
    isRetry: isRetryAttempt(attempt),
    total: items.length,
    item,
    question: toReviewable(db, version),
    response: parseResponse(item.responseJson),
    previous: ordinal > 1 ? ordinal - 1 : null,
    next: ordinal < items.length ? ordinal + 1 : null,
    nextMistake: later ? later.ordinal : null,
    retryable,
    bookmarked,
  };
}
