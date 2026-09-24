import { randomUUID } from 'node:crypto';
import type { Db } from '@/lib/db';
import type { AttemptItemRow, AttemptPartRow, AttemptRow, QuestionVersionRow } from '@/lib/db/rows';
import {
  getPool,
  getQuestionVersions,
  toPresented,
  toReviewable,
  type PresentedQuestion,
} from '@/lib/content/repository';
import {
  canAnswerAt,
  canBookmark,
  canNavigateTo,
  canOpenReviewScreen,
  describePolicy,
  resolvePolicy,
  type PartState,
} from '@/lib/assessment/navigation';
import {
  ANY_SECTION,
  checkBlueprintSufficiency,
  createRng,
  selectItems,
  type PoolItem,
} from '@/lib/assessment/select';
import { scoreAttempt, scoreResponse, type ScoredItem } from '@/lib/assessment/score';
import {
  acceptsWrite,
  computeDeadline,
  effectiveDeadline,
  hasExpired,
  remainingSeconds,
  toIso,
} from '@/lib/assessment/timing';
import {
  answerKeySchema,
  responseSchema,
  type Blueprint,
  type BlueprintPart,
  type ExamConfig,
  type NavigationPolicy,
  type Response,
  type SelectionConstraint,
} from '@/lib/assessment/types';
import { getBlueprint, getExamConfig, getSection, labelsFor, requireExamConfig } from '@/lib/exams/registry';
import { eligiblePool } from './eligibility';

/**
 * Attempt lifecycle.
 *
 * Every function takes the acting `userId` and filters on it, so one learner
 * can never read or mutate another learner's attempt. Deadlines are computed
 * from timestamps the server wrote; the browser clock is advisory only.
 */

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class AttemptError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = 'AttemptError';
  }
}

export const notFound = () => new AttemptError('not-found', 'Attempt not found.', 404);

// ---------------------------------------------------------------------------
// Settings and blueprint resolution
// ---------------------------------------------------------------------------

export interface PracticeOverrides {
  domains?: string[];
  skills?: string[];
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  length?: number;
  sectionKey?: string;
}

export interface AttemptSettings {
  overrides: PracticeOverrides;
  /** Explanations shown immediately after each answer. Practice only. */
  immediateFeedback: boolean;
}

/** Immediate feedback is a study aid, never offered inside a timed simulation. */
export function allowsImmediateFeedback(blueprint: Blueprint): boolean {
  return (
    (blueprint.mode === 'practice' || blueprint.mode === 'review') && blueprint.timing === 'untimed'
  );
}

/**
 * Applies learner-chosen practice settings. Overrides are honoured only for
 * untimed practice; diagnostics and simulations always run their blueprint
 * exactly as configured.
 */
/**
 * Rewrites a part's selection to draw from the section that actually holds the
 * questions. See SectionConfig.poolSectionKey.
 */
function applyPoolSection(config: ExamConfig, part: BlueprintPart): BlueprintPart {
  const section = getSection(config, part.selection.sectionKey);
  const poolKey = section?.poolSectionKey;
  if (!poolKey || poolKey === part.selection.sectionKey) return part;
  return { ...part, selection: { ...part.selection, sectionKey: poolKey } };
}

export function resolveParts(
  blueprint: Blueprint,
  overrides: PracticeOverrides,
  config?: ExamConfig,
): BlueprintPart[] {
  const withPool = (parts: BlueprintPart[]) =>
    config ? parts.map((part) => applyPoolSection(config, part)) : parts;

  const customisable = blueprint.mode === 'practice' && blueprint.timing === 'untimed';
  if (!customisable) return withPool(blueprint.parts);

  const mapped = blueprint.parts.map((part) => {
    const selection: SelectionConstraint = {
      ...part.selection,
      // The open practice template draws from the whole exam unless the learner
      // narrows it. Configs have to name a real section to satisfy the schema,
      // so that default is widened here rather than in seven config files.
      sectionKey: overrides.sectionKey ?? ANY_SECTION,
      domains: overrides.domains?.length ? overrides.domains : part.selection.domains,
      skills: overrides.skills?.length ? overrides.skills : part.selection.skills,
      // A chosen difficulty is a filter, not a preference: a band too thin to
      // fill the session is reported as unavailable, never padded with other
      // levels behind the learner's back.
      difficulties:
        overrides.difficulty && overrides.difficulty !== 'mixed' ? [overrides.difficulty] : undefined,
      difficultyMix: null,
    };
    return { ...part, itemCount: overrides.length ?? part.itemCount, selection };
  });

  return withPool(mapped);
}

function policyFor(config: ExamConfig, part: BlueprintPart): NavigationPolicy {
  const section = getSection(config, part.sectionKey);
  if (!section) throw new AttemptError('bad-config', `Unknown section "${part.sectionKey}"`, 500);
  return resolvePolicy(section.navigation, part.navigationOverride);
}

// ---------------------------------------------------------------------------
// Adaptive routing
// ---------------------------------------------------------------------------

export interface RoutingDecision {
  route: 'lower' | 'upper';
  routeLabel: string;
  accuracy: number;
  threshold: number;
  disclosure: string;
}

/**
 * Our own transparent two-stage rule, used only where the test maker publishes
 * that a later section adapts but does not publish how. The decision and the
 * disclosure are both persisted so the results page can show exactly what
 * happened and whose rule it was.
 */
export function decideRoute(
  accuracy: number,
  adaptive: NonNullable<BlueprintPart['adaptive']>,
): RoutingDecision | null {
  if (!adaptive.enabled) return null;
  const route = accuracy >= adaptive.upperThreshold ? 'upper' : 'lower';
  return {
    route,
    routeLabel: adaptive.routesTo[route],
    accuracy,
    threshold: adaptive.upperThreshold,
    disclosure: adaptive.disclosure,
  };
}

/** Biases the difficulty mix for the routed stage. */
function applyRoute(constraint: SelectionConstraint, itemCount: number, route: 'lower' | 'upper'): SelectionConstraint {
  const hard = route === 'upper' ? Math.ceil(itemCount * 0.5) : Math.floor(itemCount * 0.15);
  const easy = route === 'upper' ? Math.floor(itemCount * 0.15) : Math.ceil(itemCount * 0.5);
  const medium = Math.max(0, itemCount - hard - easy);
  return { ...constraint, difficultyMix: { easy, medium, hard } };
}

// ---------------------------------------------------------------------------
// Starting an attempt
// ---------------------------------------------------------------------------

export interface StartAttemptInput {
  userId: string;
  examKey: string;
  blueprintId: string;
  overrides?: PracticeOverrides;
  idempotencyKey?: string | null;
  seed?: string;
  now?: Date;
}

export interface StartAttemptResult {
  attemptId: string;
  reused: boolean;
  notes: string[];
}

export function startAttempt(db: Db, input: StartAttemptInput): StartAttemptResult {
  const now = input.now ?? new Date();
  const config = getExamConfig(input.examKey);
  if (!config) throw new AttemptError('unknown-exam', 'That exam is not offered.', 404);
  const blueprint = getBlueprint(config, input.blueprintId);
  if (!blueprint) throw new AttemptError('unknown-blueprint', 'That practice format does not exist.', 404);

  if (blueprint.mode === 'simulation' && !config.capabilities.fullSimulation.available) {
    throw new AttemptError(
      'simulation-unavailable',
      'A full simulation is not offered for this exam.',
      409,
      { reason: (config.capabilities.fullSimulation as { reason?: string }).reason },
    );
  }

  // Idempotency: a retried or double-clicked request returns the first attempt
  // rather than creating a second one.
  if (input.idempotencyKey) {
    const existing = db
      .prepare('SELECT id FROM attempts WHERE user_id = ? AND idempotency_key = ?')
      .get(input.userId, input.idempotencyKey) as { id: string } | undefined;
    if (existing) return { attemptId: existing.id, reused: true, notes: [] };
  }

  const parts = resolveParts(blueprint, input.overrides ?? {}, config);
  // The same eligibility rule the practice screen uses to say what is open.
  const pool = eligiblePool(getPool(db, input.examKey, input.userId), blueprint);
  const sufficiency = checkBlueprintSufficiency(pool, parts);
  if (!sufficiency.sufficient) {
    throw new AttemptError(
      'insufficient-content',
      'There are not enough reviewed questions to build this session without repeating one.',
      409,
      sufficiency,
    );
  }

  const attemptId = randomUUID();
  const seed = input.seed ?? randomUUID();
  const rng = createRng(seed);
  const notes: string[] = [];

  const overallDeadline =
    blueprint.timing === 'overall' ? computeDeadline(now, blueprint.overallTimeLimitSeconds) : null;

  const settings: AttemptSettings = {
    overrides: input.overrides ?? {},
    immediateFeedback: allowsImmediateFeedback(blueprint),
  };

  const usedQuestionIds = new Set<string>();
  const plannedParts: Array<{ part: BlueprintPart; items: PoolItem[]; policy: NavigationPolicy }> = [];

  for (const part of parts) {
    const policy = policyFor(config, part);
    const selection = selectItems(pool, part.selection, part.itemCount, rng, {
      alreadyUsedQuestionIds: usedQuestionIds,
      now,
    });
    for (const chosen of selection.items) usedQuestionIds.add(chosen.questionId);
    notes.push(...selection.notes);
    plannedParts.push({ part, items: selection.items, policy });
  }

  const insert = db.transaction(() => {
    db.prepare(
      `INSERT INTO attempts (
         id, user_id, exam_key, exam_config_version, blueprint_id, mode, status, seed,
         settings_json, started_at, deadline_at, submitted_at, current_part_index,
         idempotency_key, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, 'in_progress', ?, ?, ?, ?, NULL, 0, ?, ?, ?)`,
    ).run(
      attemptId,
      input.userId,
      config.examKey,
      config.version,
      blueprint.id,
      blueprint.mode,
      seed,
      JSON.stringify(settings),
      toIso(now),
      overallDeadline,
      input.idempotencyKey ?? null,
      toIso(now),
      toIso(now),
    );

    plannedParts.forEach(({ part, items, policy }, partIndex) => {
      const isFirst = partIndex === 0;
      const partDeadline =
        isFirst && blueprint.timing === 'per_part' ? computeDeadline(now, part.timeLimitSeconds) : null;

      db.prepare(
        `INSERT INTO attempt_parts (
           id, attempt_id, part_index, part_key, section_key, label, time_limit_seconds,
           started_at, deadline_at, submitted_at, status, navigation_json, routing_json
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, NULL)`,
      ).run(
        randomUUID(),
        attemptId,
        partIndex,
        part.key,
        part.sectionKey,
        part.label,
        part.timeLimitSeconds,
        isFirst ? toIso(now) : null,
        partDeadline,
        isFirst ? 'in_progress' : 'pending',
        JSON.stringify(policy),
      );

      items.forEach((chosen, position) => {
        db.prepare(
          `INSERT INTO attempt_items (
             id, attempt_id, part_index, position, question_id, question_version_id,
             response_json, response_status, is_correct, points_earned, points_possible,
             flagged, time_ms, first_seen_at, last_answered_at
           ) VALUES (?, ?, ?, ?, ?, ?, NULL, 'unanswered', NULL, NULL, ?, 0, 0, ?, NULL)`,
        ).run(
          randomUUID(),
          attemptId,
          partIndex,
          position,
          chosen.questionId,
          chosen.questionVersionId,
          config.scoring.pointsCorrect,
          // Only the first question is "seen" at the start. Marking the whole
          // part as seen would push the navigation frontier to the last
          // question immediately, and a forward-only exam would then treat
          // every question as already committed.
          isFirst && position === 0 ? toIso(now) : null,
        );
      });
    });

    logEvent(db, attemptId, 'attempt.started', {
      blueprintId: blueprint.id,
      configVersion: config.version,
      seed,
      partCount: plannedParts.length,
      itemCount: plannedParts.reduce((n, p) => n + p.items.length, 0),
    }, now);
  });

  insert();
  return { attemptId, reused: false, notes: [...new Set(notes)] };
}

// ---------------------------------------------------------------------------
// Loading
// ---------------------------------------------------------------------------

function logEvent(db: Db, attemptId: string, type: string, payload: unknown, now: Date): void {
  db.prepare('INSERT INTO attempt_events (attempt_id, type, payload_json, created_at) VALUES (?, ?, ?, ?)').run(
    attemptId,
    type,
    JSON.stringify(payload),
    toIso(now),
  );
}

interface LoadedAttempt {
  attempt: AttemptRow;
  parts: AttemptPartRow[];
  items: AttemptItemRow[];
  config: ExamConfig;
  blueprint: Blueprint;
  settings: AttemptSettings;
}

function load(db: Db, attemptId: string, userId: string): LoadedAttempt {
  const attempt = db
    .prepare('SELECT * FROM attempts WHERE id = ? AND user_id = ?')
    .get(attemptId, userId) as AttemptRow | undefined;
  // Filtering on user_id means another learner's attempt is indistinguishable
  // from one that does not exist.
  if (!attempt) throw notFound();

  const config = requireExamConfig(attempt.exam_key);
  const blueprint = getBlueprint(config, attempt.blueprint_id);
  if (!blueprint) throw new AttemptError('bad-config', 'Blueprint missing from configuration.', 500);

  return {
    attempt,
    parts: db
      .prepare('SELECT * FROM attempt_parts WHERE attempt_id = ? ORDER BY part_index')
      .all(attemptId) as AttemptPartRow[],
    items: db
      .prepare('SELECT * FROM attempt_items WHERE attempt_id = ? ORDER BY part_index, position')
      .all(attemptId) as AttemptItemRow[],
    config,
    blueprint,
    settings: JSON.parse(attempt.settings_json) as AttemptSettings,
  };
}

function partStateFrom(
  policy: NavigationPolicy,
  part: AttemptPartRow,
  items: AttemptItemRow[],
  editsUsed: number,
): PartState {
  const answered = new Set<number>();
  let furthest = 0;
  let bookmarks = 0;
  for (const item of items) {
    if (item.response_status === 'answered') answered.add(item.position);
    if (item.flagged) bookmarks += 1;
    if (item.first_seen_at) furthest = Math.max(furthest, item.position);
  }
  return {
    partIndex: part.part_index,
    status: part.status,
    furthestPosition: furthest,
    answeredPositions: answered,
    editsUsed,
    bookmarksUsed: bookmarks,
    itemCount: items.length,
    reviewScreenReached: answered.size === items.length && policy.reviewScreen,
  };
}

function editsUsedIn(db: Db, attemptId: string, partIndex: number): number {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS n FROM attempt_events
       WHERE attempt_id = ? AND type = 'item.answer_changed'
         AND json_extract(payload_json, '$.partIndex') = ?`,
    )
    .get(attemptId, partIndex) as { n: number };
  return row.n;
}

// ---------------------------------------------------------------------------
// Expiry
// ---------------------------------------------------------------------------

/**
 * Closes anything whose server-side deadline has passed. Called on every read
 * and write, so a learner who closes the tab and returns an hour later sees the
 * attempt already finished rather than a live clock.
 */
export function expireIfDue(db: Db, attemptId: string, userId: string, now = new Date()): boolean {
  const loaded = load(db, attemptId, userId);
  if (loaded.attempt.status !== 'in_progress') return false;

  const activePart = loaded.parts.find((p) => p.part_index === loaded.attempt.current_part_index);
  const deadline = effectiveDeadline(loaded.attempt.deadline_at, activePart?.deadline_at ?? null);
  if (!hasExpired(deadline, now)) return false;

  // The overall clock ending finishes the whole attempt; a per-part clock
  // ending closes that part and opens the next one.
  const overallExpired = hasExpired(loaded.attempt.deadline_at, now);
  if (overallExpired || !activePart) {
    finalise(db, attemptId, userId, now, 'expired');
    return true;
  }

  const run = db.transaction(() => {
    db.prepare("UPDATE attempt_parts SET status = 'expired', submitted_at = ? WHERE attempt_id = ? AND part_index = ?").run(
      toIso(now),
      attemptId,
      activePart.part_index,
    );
    logEvent(db, attemptId, 'part.expired', { partIndex: activePart.part_index }, now);
  });
  run();

  const advanced = openNextPart(db, attemptId, userId, activePart.part_index, now);
  if (!advanced) finalise(db, attemptId, userId, now, 'expired');
  return true;
}

// ---------------------------------------------------------------------------
// Reading state
// ---------------------------------------------------------------------------

export interface AttemptItemState {
  position: number;
  questionId: string;
  questionVersionId: string;
  answered: boolean;
  flagged: boolean;
  response: Response | null;
  timeMs: number;
  /** True once immediate feedback was shown; the response can no longer change. */
  feedbackReleased: boolean;
  question: PresentedQuestion;
  /** Present only once the learner is entitled to see the answer. */
  review: {
    correct: boolean | null;
    answerKey: unknown;
    explanationMd: string;
    distractorRationale: Record<string, string>;
    difficultyBasis: string;
  } | null;
}

export interface AttemptPartState {
  partIndex: number;
  partKey: string;
  sectionKey: string;
  label: string;
  status: AttemptPartRow['status'];
  timeLimitSeconds: number | null;
  deadlineAt: string | null;
  remainingSeconds: number | null;
  navigation: NavigationPolicy;
  navigationSummary: string[];
  routing: RoutingDecision | null;
  items: AttemptItemState[];
}

export interface AttemptState {
  id: string;
  examKey: string;
  examName: string;
  configVersion: string;
  blueprintId: string;
  blueprintLabel: string;
  fidelity: Blueprint['fidelity'];
  fidelityNote: string;
  mode: AttemptRow['mode'];
  status: AttemptRow['status'];
  startedAt: string;
  submittedAt: string | null;
  deadlineAt: string | null;
  remainingSeconds: number | null;
  currentPartIndex: number;
  immediateFeedback: boolean;
  pauseBehaviour: Blueprint['pauseBehaviour'];
  parts: AttemptPartState[];
}

export function getAttemptState(
  db: Db,
  attemptId: string,
  userId: string,
  now = new Date(),
): AttemptState {
  expireIfDue(db, attemptId, userId, now);
  const { attempt, parts, items, config, blueprint, settings } = load(db, attemptId, userId);

  const versions = getQuestionVersions(db, items.map((i) => i.question_version_id));
  const finished = attempt.status !== 'in_progress';

  const partStates: AttemptPartState[] = parts.map((part) => {
    const policy = JSON.parse(part.navigation_json) as NavigationPolicy;
    const partItems = items.filter((i) => i.part_index === part.part_index);
    const visible = part.status !== 'pending' || finished;

    return {
      partIndex: part.part_index,
      partKey: part.part_key,
      sectionKey: part.section_key,
      label: part.label,
      status: part.status,
      timeLimitSeconds: part.time_limit_seconds,
      deadlineAt: part.deadline_at,
      remainingSeconds: remainingSeconds(part.deadline_at, now),
      navigation: policy,
      navigationSummary: describePolicy(policy),
      routing: part.routing_json ? (JSON.parse(part.routing_json) as RoutingDecision) : null,
      items: partItems.map((item) => {
        const version = versions.get(item.question_version_id);
        if (!version) throw new AttemptError('missing-question', 'A question in this attempt is missing.', 500);

        // Answer keys are withheld while the attempt is live, except for an
        // item whose feedback the learner has explicitly asked to see in
        // untimed practice. Merely answering (a draft) releases nothing.
        const released = settings.immediateFeedback && item.feedback_released_at !== null;
        const mayReview = finished || released;
        const response = item.response_json ? (JSON.parse(item.response_json) as Response) : null;

        return {
          position: item.position,
          questionId: item.question_id,
          questionVersionId: item.question_version_id,
          answered: item.response_status === 'answered',
          flagged: item.flagged === 1,
          response,
          timeMs: item.time_ms,
          feedbackReleased: released,
          question: visible
            ? toPresented(db, version)
            : ({} as PresentedQuestion),
          review: mayReview
            ? (() => {
                const reviewable = toReviewable(db, version);
                return {
                  // Scored items carry their stored result. A released item in
                  // a live attempt is not scored yet, so it is scored here the
                  // same way finalisation will score it.
                  correct:
                    item.is_correct !== null
                      ? item.is_correct === 1
                      : response
                        ? scoreResponse(reviewable.answerKey, response, config.scoring).status === 'correct'
                        : null,
                  answerKey: reviewable.answerKey,
                  explanationMd: reviewable.explanationMd,
                  distractorRationale: reviewable.distractorRationale,
                  difficultyBasis: reviewable.difficultyBasis,
                };
              })()
            : null,
        };
      }),
    };
  });

  const activePart = parts.find((p) => p.part_index === attempt.current_part_index);

  return {
    id: attempt.id,
    examKey: attempt.exam_key,
    examName: config.name,
    configVersion: attempt.exam_config_version,
    blueprintId: attempt.blueprint_id,
    blueprintLabel: blueprint.label,
    fidelity: blueprint.fidelity,
    fidelityNote: blueprint.fidelityNote,
    mode: attempt.mode,
    status: attempt.status,
    startedAt: attempt.started_at,
    submittedAt: attempt.submitted_at,
    deadlineAt: effectiveDeadline(attempt.deadline_at, activePart?.deadline_at ?? null),
    remainingSeconds: remainingSeconds(
      effectiveDeadline(attempt.deadline_at, activePart?.deadline_at ?? null),
      now,
    ),
    currentPartIndex: attempt.current_part_index,
    immediateFeedback: settings.immediateFeedback,
    pauseBehaviour: blueprint.pauseBehaviour,
    parts: partStates,
  };
}

// ---------------------------------------------------------------------------
// Answering
// ---------------------------------------------------------------------------

export interface RecordResponseInput {
  attemptId: string;
  userId: string;
  partIndex: number;
  position: number;
  response: Response | null;
  /** Milliseconds spent since the last save for this item. */
  elapsedMs?: number;
  /**
   * Untimed practice only: submit this answer and release its key and worked
   * explanation. The answer is locked from then on. Without it, a save is a
   * draft that can still be changed.
   */
  reveal?: boolean;
  now?: Date;
}

export interface ItemFeedback {
  correct: boolean;
  explanationMd: string;
  distractorRationale: Record<string, string>;
  answerKey: unknown;
}

export interface RecordResponseResult {
  saved: boolean;
  answered: boolean;
  /** True when feedback has been released for this item, by this call or an earlier one. */
  locked: boolean;
  /** True when the call repeated the stored, already-locked answer and changed nothing. */
  duplicate: boolean;
  feedback: ItemFeedback | null;
}

export const RESPONSE_LOCKED_MESSAGE =
  'You have already seen the explanation for this question, so its answer is locked.';

/** A stable form of a response for equality, ignoring the order of selections. */
function canonicalResponse(response: Response | null): string {
  if (!response) return 'null';
  if (response.type === 'multi_select') {
    return JSON.stringify({ ...response, optionIds: [...response.optionIds].sort() });
  }
  if (response.type === 'two_part') {
    return JSON.stringify({
      ...response,
      selections: [...response.selections].sort((a, b) => a.columnId.localeCompare(b.columnId)),
    });
  }
  return JSON.stringify(response);
}

function storedResponse(item: AttemptItemRow): Response | null {
  if (!item.response_json) return null;
  const parsed = responseSchema.safeParse(JSON.parse(item.response_json));
  return parsed.success ? parsed.data : null;
}

function buildFeedback(
  db: Db,
  config: ExamConfig,
  version: QuestionVersionRow,
  response: Response,
): ItemFeedback {
  const reviewable = toReviewable(db, version);
  const outcome = scoreResponse(reviewable.answerKey, response, config.scoring);
  return {
    correct: outcome.status === 'correct',
    explanationMd: reviewable.explanationMd,
    distractorRationale: reviewable.distractorRationale,
    answerKey: reviewable.answerKey,
  };
}

/**
 * The only outcomes for an item whose feedback is already released: repeating
 * the stored answer (a double click, a retried request, a second tab showing
 * the same thing) succeeds without changing anything; any other answer is
 * refused.
 */
function lockedOutcome(
  db: Db,
  config: ExamConfig,
  version: QuestionVersionRow,
  item: AttemptItemRow,
  attempted: Response | null,
): RecordResponseResult {
  const stored = storedResponse(item);
  if (stored && canonicalResponse(stored) === canonicalResponse(attempted)) {
    return {
      saved: true,
      answered: true,
      locked: true,
      duplicate: true,
      feedback: buildFeedback(db, config, version, stored),
    };
  }
  throw new AttemptError('response-locked', RESPONSE_LOCKED_MESSAGE, 409);
}

export interface PersistResponseInput {
  attemptId: string;
  itemId: string;
  partIndex: number;
  position: number;
  response: Response | null;
  /** Whether the item held an answer when the caller read it. */
  wasAnswered: boolean;
  elapsedMs: number;
  /** Release immediate feedback in the same write. */
  release: boolean;
  now: Date;
}

/**
 * Writes one response.
 *
 * The UPDATE itself refuses to touch an item whose feedback has been released,
 * so the lock holds even for a request that read the item before another tab
 * released it, and even across processes: the check and the write are one
 * statement inside an IMMEDIATE transaction. Returns `written: false` when the
 * guard refused.
 */
export function persistResponse(db: Db, input: PersistResponseInput): { written: boolean } {
  const iso = toIso(input.now);
  const answered = input.response !== null;

  const run = db.transaction((): boolean => {
    const info = db
      .prepare(
        `UPDATE attempt_items
           SET response_json = ?, response_status = ?, time_ms = time_ms + ?,
               last_answered_at = ?, first_seen_at = COALESCE(first_seen_at, ?),
               feedback_released_at = CASE WHEN ? = 1 THEN ? ELSE feedback_released_at END
         WHERE id = ? AND feedback_released_at IS NULL`,
      )
      .run(
        input.response ? JSON.stringify(input.response) : null,
        answered ? 'answered' : 'unanswered',
        Math.max(0, Math.min(input.elapsedMs, 30 * 60 * 1000)),
        answered ? iso : null,
        iso,
        input.release ? 1 : 0,
        iso,
        input.itemId,
      );
    if (info.changes === 0) return false;

    db.prepare('UPDATE attempts SET updated_at = ? WHERE id = ?').run(iso, input.attemptId);

    const where = { partIndex: input.partIndex, position: input.position };
    if (input.wasAnswered && answered) {
      logEvent(db, input.attemptId, 'item.answer_changed', where, input.now);
    } else {
      logEvent(db, input.attemptId, 'item.answered', { ...where, answered }, input.now);
    }
    if (input.release) logEvent(db, input.attemptId, 'item.feedback_released', where, input.now);
    return true;
  });

  return { written: run.immediate() };
}

export function recordResponse(db: Db, input: RecordResponseInput): RecordResponseResult {
  const now = input.now ?? new Date();
  expireIfDue(db, input.attemptId, input.userId, now);
  const { attempt, parts, items, config, settings } = load(db, input.attemptId, input.userId);

  if (attempt.status !== 'in_progress') {
    throw new AttemptError('attempt-closed', 'This attempt has already been submitted.', 409);
  }
  if (input.partIndex !== attempt.current_part_index) {
    throw new AttemptError('wrong-part', 'That section is not currently open.', 409);
  }

  const part = parts.find((p) => p.part_index === input.partIndex);
  if (!part) throw notFound();

  const deadline = effectiveDeadline(attempt.deadline_at, part.deadline_at);
  if (!acceptsWrite(deadline, now)) {
    throw new AttemptError('time-expired', 'Time for this section has run out.', 409);
  }

  const policy = JSON.parse(part.navigation_json) as NavigationPolicy;
  const partItems = items.filter((i) => i.part_index === input.partIndex);
  const item = partItems.find((i) => i.position === input.position);
  if (!item) throw notFound();

  const state = partStateFrom(policy, part, partItems, editsUsedIn(db, input.attemptId, input.partIndex));
  const decision = canAnswerAt(policy, state, input.position);
  if (!decision.allowed) {
    throw new AttemptError(decision.code, decision.reason, 409);
  }

  const version = getQuestionVersions(db, [item.question_version_id]).get(item.question_version_id);
  if (!version) throw new AttemptError('missing-question', 'Question not found.', 500);

  let parsed: Response | null = null;
  if (input.response !== null) {
    const result = responseSchema.safeParse(input.response);
    if (!result.success) {
      throw new AttemptError('invalid-response', 'That answer could not be understood.', 400);
    }
    if (result.data.type !== version.response_type) {
      throw new AttemptError('response-type-mismatch', 'That answer does not match the question.', 400);
    }
    parsed = result.data;
  }

  // Feedback exists only in untimed practice. Timed and diagnostic formats
  // release nothing before submission, so a request to reveal is refused
  // rather than quietly ignored.
  if (input.reveal && !settings.immediateFeedback) {
    throw new AttemptError(
      'feedback-not-available',
      'Answers and explanations for this format are shown after you submit.',
      409,
    );
  }
  if (input.reveal && parsed === null) {
    throw new AttemptError('answer-required', 'Choose an answer before checking it.', 400);
  }

  if (settings.immediateFeedback && item.feedback_released_at !== null) {
    return lockedOutcome(db, config, version, item, parsed);
  }

  const release = settings.immediateFeedback && input.reveal === true;
  const { written } = persistResponse(db, {
    attemptId: input.attemptId,
    itemId: item.id,
    partIndex: input.partIndex,
    position: input.position,
    response: parsed,
    wasAnswered: item.response_status === 'answered',
    elapsedMs: input.elapsedMs ?? 0,
    release,
    now,
  });

  if (!written) {
    // Another request - a second tab, a retry - released feedback between our
    // read and this write. Judge this request against what it did.
    const fresh = db.prepare('SELECT * FROM attempt_items WHERE id = ?').get(item.id) as AttemptItemRow;
    return lockedOutcome(db, config, version, fresh, parsed);
  }

  return {
    saved: true,
    answered: parsed !== null,
    locked: release,
    duplicate: false,
    feedback: release && parsed ? buildFeedback(db, config, version, parsed) : null,
  };
}

export function setFlag(
  db: Db,
  input: { attemptId: string; userId: string; partIndex: number; position: number; flagged: boolean; now?: Date },
): void {
  const now = input.now ?? new Date();
  const { attempt, parts, items } = load(db, input.attemptId, input.userId);
  if (attempt.status !== 'in_progress') {
    throw new AttemptError('attempt-closed', 'This attempt has already been submitted.', 409);
  }
  const part = parts.find((p) => p.part_index === input.partIndex);
  if (!part) throw notFound();

  const policy = JSON.parse(part.navigation_json) as NavigationPolicy;
  const partItems = items.filter((i) => i.part_index === input.partIndex);
  const state = partStateFrom(policy, part, partItems, 0);

  if (input.flagged) {
    const decision = canBookmark(policy, state);
    if (!decision.allowed) throw new AttemptError(decision.code, decision.reason, 409);
  }

  db.prepare('UPDATE attempt_items SET flagged = ? WHERE attempt_id = ? AND part_index = ? AND position = ?').run(
    input.flagged ? 1 : 0,
    input.attemptId,
    input.partIndex,
    input.position,
  );
  logEvent(db, input.attemptId, 'item.flagged', { ...input, now: undefined }, now);
}

/** Records that the learner moved to a question, enforcing navigation rules. */
export function visitPosition(
  db: Db,
  input: { attemptId: string; userId: string; partIndex: number; position: number; now?: Date },
): void {
  const now = input.now ?? new Date();
  expireIfDue(db, input.attemptId, input.userId, now);
  const { attempt, parts, items } = load(db, input.attemptId, input.userId);
  if (attempt.status !== 'in_progress') return;

  const part = parts.find((p) => p.part_index === input.partIndex);
  if (!part) throw notFound();
  const policy = JSON.parse(part.navigation_json) as NavigationPolicy;
  const partItems = items.filter((i) => i.part_index === input.partIndex);
  const state = partStateFrom(policy, part, partItems, 0);

  const decision = canNavigateTo(policy, state, input.position);
  if (!decision.allowed) throw new AttemptError(decision.code, decision.reason, 409);

  db.prepare(
    `UPDATE attempt_items SET first_seen_at = COALESCE(first_seen_at, ?)
     WHERE attempt_id = ? AND part_index = ? AND position <= ?`,
  ).run(toIso(now), input.attemptId, input.partIndex, input.position);
}

// ---------------------------------------------------------------------------
// Advancing and submitting
// ---------------------------------------------------------------------------

/** Opens the next part, applying adaptive routing where enabled. Returns false at the end. */
function openNextPart(db: Db, attemptId: string, userId: string, fromIndex: number, now: Date): boolean {
  const { attempt, parts, items, config, blueprint } = load(db, attemptId, userId);
  const nextIndex = fromIndex + 1;
  const next = parts.find((p) => p.part_index === nextIndex);
  if (!next) return false;

  const blueprintParts = resolveParts(
    blueprint,
    (JSON.parse(attempt.settings_json) as AttemptSettings).overrides,
    config,
  );
  const previousBlueprintPart = blueprintParts[fromIndex];
  const nextBlueprintPart = blueprintParts[nextIndex];

  // Score the completed part FIRST. Routing reads is_correct, which only exists
  // once the part has been scored, so computing the decision before this would
  // read every answer as wrong and route everyone down.
  const scoreCompletedPart = db.transaction(() => {
    scorePart(db, attemptId, fromIndex, config, now);
  });
  scoreCompletedPart();

  // Adaptive routing is declared on the routing part and applies to the part
  // that follows it.
  let routing: RoutingDecision | null = null;
  if (previousBlueprintPart?.adaptive?.enabled) {
    const scored = db
      .prepare(
        'SELECT is_correct AS isCorrect FROM attempt_items WHERE attempt_id = ? AND part_index = ?',
      )
      .all(attemptId, fromIndex) as Array<{ isCorrect: 0 | 1 | null }>;
    const correct = scored.filter((row) => row.isCorrect === 1).length;
    const accuracy = scored.length > 0 ? correct / scored.length : 0;
    routing = decideRoute(accuracy, previousBlueprintPart.adaptive);
  }

  const run = db.transaction(() => {
    if (routing && nextBlueprintPart) {
      const rerouted = applyRoute(nextBlueprintPart.selection, nextBlueprintPart.itemCount, routing.route);
      const pool = eligiblePool(getPool(db, attempt.exam_key, userId), blueprint);
      const used = new Set(items.map((i) => i.question_id));
      const rng = createRng(`${attempt.seed}:reroute:${nextIndex}`);
      const selection = selectItems(pool, rerouted, nextBlueprintPart.itemCount, rng, {
        alreadyUsedQuestionIds: used,
        now,
      });
      if (selection.items.length === nextBlueprintPart.itemCount) {
        db.prepare('DELETE FROM attempt_items WHERE attempt_id = ? AND part_index = ?').run(attemptId, nextIndex);
        selection.items.forEach((chosen, position) => {
          db.prepare(
            `INSERT INTO attempt_items (
               id, attempt_id, part_index, position, question_id, question_version_id,
               response_json, response_status, is_correct, points_earned, points_possible,
               flagged, time_ms, first_seen_at, last_answered_at
             ) VALUES (?, ?, ?, ?, ?, ?, NULL, 'unanswered', NULL, NULL, ?, 0, 0, ?, NULL)`,
          ).run(
            randomUUID(),
            attemptId,
            nextIndex,
            position,
            chosen.questionId,
            chosen.questionVersionId,
            config.scoring.pointsCorrect,
            toIso(now),
          );
        });
      } else {
        // Not enough distinct items to honour the route: keep the pre-selected
        // questions and say so, rather than repeating questions.
        routing = { ...routing, disclosure: `${routing.disclosure} (Routing could not be applied: the reviewed pool was too small, so the pre-selected questions were kept.)` };
      }
    }

    const deadline =
      blueprint.timing === 'per_part' ? computeDeadline(now, next.time_limit_seconds) : null;

    db.prepare(
      `UPDATE attempt_parts SET status = 'in_progress', started_at = ?, deadline_at = ?, routing_json = ?
       WHERE attempt_id = ? AND part_index = ?`,
    ).run(toIso(now), deadline, routing ? JSON.stringify(routing) : null, attemptId, nextIndex);

    db.prepare(
      `UPDATE attempt_items SET first_seen_at = COALESCE(first_seen_at, ?)
       WHERE attempt_id = ? AND part_index = ? AND position = 0`,
    ).run(toIso(now), attemptId, nextIndex);

    db.prepare('UPDATE attempts SET current_part_index = ?, updated_at = ? WHERE id = ?').run(
      nextIndex,
      toIso(now),
      attemptId,
    );

    logEvent(db, attemptId, 'part.started', { partIndex: nextIndex, routing }, now);
  });
  run();
  return true;
}

/** Scores every item in one part. Idempotent. */
function scorePart(db: Db, attemptId: string, partIndex: number, config: ExamConfig, now: Date): void {
  const items = db
    .prepare('SELECT * FROM attempt_items WHERE attempt_id = ? AND part_index = ?')
    .all(attemptId, partIndex) as AttemptItemRow[];
  const versions = getQuestionVersions(db, items.map((i) => i.question_version_id));

  for (const item of items) {
    const version = versions.get(item.question_version_id);
    if (!version) continue;
    const key = answerKeySchema.parse(JSON.parse(version.correct_json));
    const response = item.response_json ? (JSON.parse(item.response_json) as Response) : null;
    const outcome = scoreResponse(key, response, config.scoring);
    db.prepare('UPDATE attempt_items SET is_correct = ?, points_earned = ?, points_possible = ? WHERE id = ?').run(
      outcome.status === 'correct' ? 1 : outcome.status === 'not_auto_scored' ? null : 0,
      outcome.points,
      outcome.pointsPossible,
      item.id,
    );
  }
  logEvent(db, attemptId, 'part.scored', { partIndex, itemCount: items.length }, now);
}

export interface SubmitPartResult {
  advancedToPartIndex: number | null;
  attemptSubmitted: boolean;
}

export function submitPart(
  db: Db,
  input: { attemptId: string; userId: string; partIndex: number; now?: Date },
): SubmitPartResult {
  const now = input.now ?? new Date();
  expireIfDue(db, input.attemptId, input.userId, now);
  const { attempt, parts } = load(db, input.attemptId, input.userId);

  if (attempt.status !== 'in_progress') {
    return { advancedToPartIndex: null, attemptSubmitted: true };
  }
  if (input.partIndex !== attempt.current_part_index) {
    throw new AttemptError('wrong-part', 'That section is not currently open.', 409);
  }
  const part = parts.find((p) => p.part_index === input.partIndex);
  if (!part) throw notFound();

  db.prepare("UPDATE attempt_parts SET status = 'submitted', submitted_at = ? WHERE attempt_id = ? AND part_index = ?").run(
    toIso(now),
    input.attemptId,
    input.partIndex,
  );
  logEvent(db, input.attemptId, 'part.submitted', { partIndex: input.partIndex }, now);

  const advanced = openNextPart(db, input.attemptId, input.userId, input.partIndex, now);
  if (advanced) return { advancedToPartIndex: input.partIndex + 1, attemptSubmitted: false };

  finalise(db, input.attemptId, input.userId, now, 'submitted');
  return { advancedToPartIndex: null, attemptSubmitted: true };
}

export function openReviewScreen(
  db: Db,
  input: { attemptId: string; userId: string; partIndex: number; now?: Date },
): void {
  const { parts, items } = load(db, input.attemptId, input.userId);
  const part = parts.find((p) => p.part_index === input.partIndex);
  if (!part) throw notFound();
  const policy = JSON.parse(part.navigation_json) as NavigationPolicy;
  const partItems = items.filter((i) => i.part_index === input.partIndex);
  const state = partStateFrom(policy, part, partItems, 0);
  const decision = canOpenReviewScreen(policy, state);
  if (!decision.allowed) throw new AttemptError(decision.code, decision.reason, 409);
}

/**
 * Finalises an attempt: scores everything, writes the result row, updates the
 * review queue. Idempotent - a repeated submission returns the existing result
 * instead of scoring twice.
 */
export function finalise(
  db: Db,
  attemptId: string,
  userId: string,
  now = new Date(),
  status: 'submitted' | 'expired' = 'submitted',
): void {
  const existing = db.prepare('SELECT attempt_id FROM attempt_results WHERE attempt_id = ?').get(attemptId);
  if (existing) return;

  const { attempt, parts, items, config, blueprint } = load(db, attemptId, userId);
  if (attempt.status !== 'in_progress') return;

  const run = db.transaction(() => {
    for (const part of parts) {
      scorePart(db, attemptId, part.part_index, config, now);
      if (part.status === 'in_progress' || part.status === 'pending') {
        db.prepare('UPDATE attempt_parts SET status = ?, submitted_at = ? WHERE attempt_id = ? AND part_index = ?').run(
          status === 'expired' ? 'expired' : 'submitted',
          toIso(now),
          attemptId,
          part.part_index,
        );
      }
    }

    const scoredRows = db
      .prepare('SELECT * FROM attempt_items WHERE attempt_id = ? ORDER BY part_index, position')
      .all(attemptId) as AttemptItemRow[];
    const versions = getQuestionVersions(db, scoredRows.map((i) => i.question_version_id));

    const scored: ScoredItem[] = scoredRows.map((item) => {
      const version = versions.get(item.question_version_id);
      const key = version ? answerKeySchema.parse(JSON.parse(version.correct_json)) : null;
      const response = item.response_json ? (JSON.parse(item.response_json) as Response) : null;
      const outcome = key
        ? scoreResponse(key, response, config.scoring)
        : { status: 'omitted' as const, points: 0, pointsPossible: 0 };
      return {
        partIndex: item.part_index,
        sectionKey: version?.section_key ?? 'unknown',
        domainSlug: version?.domain_slug ?? 'unknown',
        skillSlug: version?.skill_slug ?? 'unknown',
        outcome,
        timeMs: item.time_ms,
      };
    });

    const result = scoreAttempt(scored, labelsFor(config));

    const methodology = {
      officialFacts: {
        scale: config.scoring.officialScale,
        pointsCorrect: config.scoring.pointsCorrect,
        pointsIncorrect: config.scoring.pointsIncorrect,
        pointsOmitted: config.scoring.pointsOmitted,
        notes: config.scoring.notes,
      },
      ourApproximation: {
        fidelity: blueprint.fidelity,
        fidelityNote: blueprint.fidelityNote,
        difficultyBasis: 'editorial',
      },
      notProvided: {
        scaledScore: config.scoring.scaledEstimate.enabled
          ? null
          : (config.scoring.scaledEstimate as { reason: string }).reason,
        percentiles:
          'We do not report percentiles. They require a calibrated reference population we do not have.',
      },
      unverifiedRules: config.unverified,
    };

    db.prepare(
      `INSERT INTO attempt_results (
         attempt_id, computed_at, raw_correct, raw_incorrect, raw_omitted, points_earned,
         points_possible, accuracy, total_time_ms, per_part_json, per_skill_json,
         reported_score_json, methodology_json
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
    ).run(
      attemptId,
      toIso(now),
      result.totals.correct,
      result.totals.incorrect,
      result.totals.omitted,
      result.totals.pointsEarned,
      result.totals.pointsPossible,
      result.totals.accuracy,
      result.totals.totalTimeMs,
      JSON.stringify({ byPart: result.byPart, bySection: result.bySection, byDomain: result.byDomain }),
      JSON.stringify(result.bySkill),
      JSON.stringify(methodology),
    );

    db.prepare('UPDATE attempts SET status = ?, submitted_at = ?, updated_at = ? WHERE id = ?').run(
      status,
      toIso(now),
      toIso(now),
      attemptId,
    );

    updateReviewQueue(db, attemptId, userId, now);
    logEvent(db, attemptId, 'attempt.finalised', { status, totals: result.totals }, now);
  });
  run();
}

/**
 * Spaced review. Intervals are a simple, transparent schedule - not a claim
 * about memory science: miss an item and it comes back tomorrow, get it right
 * repeatedly and it recedes.
 */
const REVIEW_INTERVALS = [1, 3, 7, 16, 35];

function updateReviewQueue(db: Db, attemptId: string, userId: string, now: Date): void {
  const rows = db
    .prepare(
      `SELECT ai.question_id, ai.is_correct, ai.response_status, qv.exam_key, qv.skill_slug
       FROM attempt_items ai
       JOIN question_versions qv ON qv.id = ai.question_version_id
       WHERE ai.attempt_id = ?`,
    )
    .all(attemptId) as Array<{
    question_id: string;
    is_correct: 0 | 1 | null;
    response_status: string;
    exam_key: string;
    skill_slug: string;
  }>;

  for (const row of rows) {
    const result = row.is_correct === 1 ? 'correct' : row.response_status === 'answered' ? 'incorrect' : 'omitted';
    const existing = db
      .prepare('SELECT * FROM review_queue WHERE user_id = ? AND question_id = ?')
      .get(userId, row.question_id) as
      | { miss_count: number; correct_streak: number; interval_days: number }
      | undefined;

    const missCount = (existing?.miss_count ?? 0) + (result === 'correct' ? 0 : 1);
    const streak = result === 'correct' ? (existing?.correct_streak ?? 0) + 1 : 0;
    const interval = result === 'correct' ? REVIEW_INTERVALS[Math.min(streak, REVIEW_INTERVALS.length - 1)] : 1;
    const dueAt = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

    db.prepare(
      `INSERT INTO review_queue (user_id, question_id, exam_key, skill_slug, last_result,
                                 miss_count, correct_streak, interval_days, due_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, question_id) DO UPDATE SET
         last_result = excluded.last_result,
         miss_count = excluded.miss_count,
         correct_streak = excluded.correct_streak,
         interval_days = excluded.interval_days,
         due_at = excluded.due_at,
         updated_at = excluded.updated_at`,
    ).run(
      userId,
      row.question_id,
      row.exam_key,
      row.skill_slug,
      result,
      missCount,
      streak,
      interval,
      toIso(dueAt),
      toIso(now),
    );
  }
}

export function submitAttempt(
  db: Db,
  input: { attemptId: string; userId: string; now?: Date },
): { alreadySubmitted: boolean } {
  const now = input.now ?? new Date();
  const { attempt } = load(db, input.attemptId, input.userId);
  if (attempt.status !== 'in_progress') return { alreadySubmitted: true };
  finalise(db, input.attemptId, input.userId, now, 'submitted');
  return { alreadySubmitted: false };
}

export function getResult(db: Db, attemptId: string, userId: string) {
  const { attempt } = load(db, attemptId, userId);
  const row = db.prepare('SELECT * FROM attempt_results WHERE attempt_id = ?').get(attemptId) as
    | Record<string, unknown>
    | undefined;
  if (!row) return null;
  return {
    attempt,
    totals: {
      correct: row.raw_correct as number,
      incorrect: row.raw_incorrect as number,
      omitted: row.raw_omitted as number,
      pointsEarned: row.points_earned as number,
      pointsPossible: row.points_possible as number,
      accuracy: row.accuracy as number,
      totalTimeMs: row.total_time_ms as number,
    },
    breakdown: JSON.parse(row.per_part_json as string) as Record<string, unknown>,
    bySkill: JSON.parse(row.per_skill_json as string) as unknown[],
    methodology: JSON.parse(row.methodology_json as string) as Record<string, unknown>,
    computedAt: row.computed_at as string,
  };
}
