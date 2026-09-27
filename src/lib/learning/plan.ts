import { createHash, randomUUID } from 'node:crypto';
import type { Db } from '@/lib/db';
import type { ExamConfig } from '@/lib/assessment/types';
import { getBlueprint, labelsFor, requireExamConfig } from '@/lib/exams/registry';
import { facetsFromPool, practiceFacets } from '@/lib/attempts/availability';
import { eligibleCount, type PracticeFacet } from '@/lib/attempts/facets';
import { getPool } from '@/lib/content/repository';
import { retryCandidates } from '@/lib/attempts/service';
import { MAX_RETRY_QUESTIONS } from '@/lib/attempts/retry';
import { skillPerformance, WEAK_ACCURACY, type SkillPerformance } from './recommend';

/**
 * Stored study plans (migration 007, docs/REDESIGN.md §18.5).
 *
 * A plan is created, and later adjusted, only when the learner asks. A visit
 * never reschedules anything: it records which planned sessions a finished
 * practice session has satisfied, and shows the sessions whose day is over
 * as missed. Every session is built from reviewed questions that are
 * actually available, and says whether it uses questions the learner has
 * never been shown (new) or may repeat them (revision).
 *
 * Session states:
 * - planned: scheduled, not yet satisfied, and its day not over;
 * - completed: satisfied by a finished session (see `satisfies`);
 * - missed: a planned session whose day is over everywhere, from 12:00 UTC
 *   the day after its date (the learner's time zone is not known). Until the
 *   learner adjusts the plan it is still stored as planned, so a late session
 *   can still complete it; adjusting records it as missed, for good, and
 *   carries its topic forward;
 * - skipped: the learner chose to skip it; nothing satisfies it.
 *
 * Completed, skipped and recorded-missed sessions are history: nothing
 * changes them afterwards.
 */

export const SESSION_MINUTES = 25;
export const SESSION_QUESTIONS = 10;
/** A finished session counts only with at least this many answers (or the planned number, if smaller). */
export const MIN_ANSWERS_TO_COUNT = 5;
/** A skill with fewer reviewed questions than this is planned as its topic. */
export const THIN_SKILL_BELOW = 5;
const MAX_PLAN_WEEKS = 8;
const DEFAULT_PLAN_WEEKS = 6;
const DAY_MS = 24 * 60 * 60 * 1000;

export type SessionKind = 'new' | 'revision' | 'review' | 'mixed';
export type StoredStatus = 'planned' | 'completed' | 'missed' | 'skipped';
export type SessionState = StoredStatus;

export interface PlannedSession {
  scheduledOn: string;
  sequence: number;
  kind: SessionKind;
  domainSlug: string | null;
  skillSlug: string | null;
  questionCount: number;
  minutes: number;
  reason: string;
}

export interface PlanSessionRow {
  id: string;
  planId: string;
  scheduledOn: string;
  sequence: number;
  kind: SessionKind;
  domainSlug: string | null;
  skillSlug: string | null;
  questionCount: number;
  minutes: number;
  reason: string;
  status: StoredStatus;
  attemptId: string | null;
  statusAt: string | null;
}

export interface PlanRow {
  id: string;
  userId: string;
  examKey: string;
  status: 'active' | 'ended';
  weeklyMinutes: number;
  sessionMinutes: number;
  startsOn: string;
  endsOn: string;
  examDate: string | null;
  createdAt: string;
  adjustedAt: string | null;
  version: number;
}

// ---------------------------------------------------------------------------
// Dates (UTC calendar dates)
// ---------------------------------------------------------------------------

export function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(day: string, days: number): string {
  return isoDay(new Date(Date.parse(`${day}T00:00:00Z`) + days * DAY_MS));
}

/** From 12:00 UTC the day after its date, a day is over everywhere on Earth. */
export function dayIsOver(day: string, now: Date): boolean {
  return now.getTime() >= Date.parse(`${day}T12:00:00Z`) + DAY_MS;
}

/** A session's state as shown: planned sessions whose day is over read as missed. */
export function stateOf(session: Pick<PlanSessionRow, 'status' | 'scheduledOn'>, now: Date): SessionState {
  if (session.status === 'planned' && dayIsOver(session.scheduledOn, now)) return 'missed';
  return session.status;
}

// ---------------------------------------------------------------------------
// Building sessions from evidence and availability
// ---------------------------------------------------------------------------

interface Focus {
  domainSlug: string | null;
  skillSlug: string | null;
  label: string;
  reason: string;
}

export interface PlanInputs {
  config: ExamConfig;
  startsOn: string;
  examDate: string | null;
  weeklyMinutes: number;
  performance: SkillPerformance[];
  /** Reviewed practice questions, grouped for counting. */
  allFacets: PracticeFacet[];
  /** The same, only questions this learner has never been shown. */
  unseenFacets: PracticeFacet[];
  /** Missed questions that can be asked again. */
  retryable: number;
  /** Topics or skills of missed sessions, scheduled first when adjusting. */
  carryForward?: Array<{ domainSlug: string | null; skillSlug: string | null }>;
}

export interface PlanShape {
  startsOn: string;
  endsOn: string;
  weeks: number;
  sessionsPerWeek: number;
}

/** How long the plan runs and how many sessions a week fit the time given. */
export function planShape(startsOn: string, examDate: string | null, weeklyMinutes: number): PlanShape {
  const sessionsPerWeek = Math.max(1, Math.round(weeklyMinutes / SESSION_MINUTES));
  let weeks = DEFAULT_PLAN_WEEKS;
  let endsOn = addDays(startsOn, weeks * 7 - 1);
  if (examDate && examDate > startsOn) {
    const daysLeft = Math.round((Date.parse(`${examDate}T00:00:00Z`) - Date.parse(`${startsOn}T00:00:00Z`)) / DAY_MS);
    weeks = Math.max(1, Math.min(MAX_PLAN_WEEKS, Math.ceil(daysLeft / 7)));
    // The last session is the day before the exam at the latest.
    const lastDay = addDays(examDate, -1);
    const horizon = addDays(startsOn, weeks * 7 - 1);
    endsOn = lastDay < horizon ? lastDay : horizon;
  }
  return { startsOn, endsOn, weeks, sessionsPerWeek };
}

function focusCount(facets: PracticeFacet[], focus: { domainSlug: string | null; skillSlug: string | null }): number {
  return eligibleCount(facets, { domain: focus.skillSlug ? null : focus.domainSlug, skill: focus.skillSlug });
}

/**
 * The order topics and skills are practised in: carried-over missed ones
 * first; then weak skills (enough answers to judge, under WEAK_ACCURACY
 * correct), weakest first; topics never attempted; topics with too few
 * answers to judge; and last the stronger skills, weakest first. Only
 * focuses with reviewed questions are used; a thin skill is planned as its
 * topic, saying so.
 */
export function focusQueue(input: PlanInputs): Focus[] {
  const labels = labelsFor(input.config);
  const queue: Focus[] = [];
  const seen = new Set<string>();
  const push = (focus: Focus) => {
    const key = `${focus.domainSlug}|${focus.skillSlug}`;
    if (seen.has(key) || focusCount(input.allFacets, focus) === 0) return;
    seen.add(key);
    queue.push(focus);
  };
  const skillFocus = (skillSlug: string, domainSlug: string, reason: string): Focus => {
    const inSkill = focusCount(input.allFacets, { domainSlug, skillSlug });
    if (inSkill < THIN_SKILL_BELOW) {
      return {
        domainSlug,
        skillSlug: null,
        label: labels.domains[domainSlug] ?? domainSlug,
        reason: `${reason}; ${labels.skills[skillSlug] ?? skillSlug} has only ${inSkill} reviewed question${inSkill === 1 ? '' : 's'}, so its topic is practised`,
      };
    }
    return { domainSlug, skillSlug, label: labels.skills[skillSlug] ?? skillSlug, reason };
  };

  for (const carried of input.carryForward ?? []) {
    if (carried.skillSlug && carried.domainSlug) push(skillFocus(carried.skillSlug, carried.domainSlug, 'carried from a missed session'));
    else if (carried.domainSlug) push({ domainSlug: carried.domainSlug, skillSlug: null, label: labels.domains[carried.domainSlug] ?? carried.domainSlug, reason: 'carried from a missed session' });
  }
  const judged = input.performance.filter((skill) => skill.hasSignal).sort((a, b) => a.accuracy - b.accuracy);
  const judgedReason = (skill: SkillPerformance) =>
    `${Math.round(skill.accuracy * 100)}% correct over ${skill.answered + skill.omitted} answers`;
  for (const skill of judged.filter((s) => s.accuracy < WEAK_ACCURACY)) {
    push(skillFocus(skill.skillSlug, skill.domainSlug, judgedReason(skill)));
  }
  const attempted = new Set(input.performance.map((skill) => skill.domainSlug));
  for (const domain of input.config.domains) {
    if (!attempted.has(domain.slug)) push({ domainSlug: domain.slug, skillSlug: null, label: domain.name, reason: 'not attempted yet' });
  }
  const judgedDomains = new Set(judged.map((skill) => skill.domainSlug));
  for (const domain of input.config.domains) {
    if (attempted.has(domain.slug) && !judgedDomains.has(domain.slug)) {
      push({ domainSlug: domain.slug, skillSlug: null, label: domain.name, reason: 'too few answers yet to judge' });
    }
  }
  for (const skill of judged.filter((s) => s.accuracy >= WEAK_ACCURACY)) {
    push(skillFocus(skill.skillSlug, skill.domainSlug, judgedReason(skill)));
  }
  return queue;
}

/** Days of the week sessions fall on, spread out: offsets 0..6 from the week's start. */
function dayOffsets(sessionsPerWeek: number): number[] {
  if (sessionsPerWeek >= 7) return Array.from({ length: sessionsPerWeek }, (_, i) => Math.min(6, Math.floor((i * 7) / sessionsPerWeek)));
  return Array.from({ length: sessionsPerWeek }, (_, i) => Math.round((i * 7) / sessionsPerWeek));
}

/**
 * The sessions of a plan, in date order. Pure: the same inputs give the same
 * plan, so a preview is exactly what creating or adjusting would store.
 */
export function buildSessions(input: PlanInputs): PlannedSession[] {
  const shape = planShape(input.startsOn, input.examDate, input.weeklyMinutes);
  const queue = focusQueue(input);
  // Unseen questions left per focus, spent as new sessions are planned.
  const unseenLeft = new Map<string, number>();
  const unseenFor = (focus: Focus) => {
    const key = `${focus.domainSlug}|${focus.skillSlug}`;
    if (!unseenLeft.has(key)) unseenLeft.set(key, focusCount(input.unseenFacets, focus));
    return key;
  };
  let mixedUnseen = eligibleCount(input.unseenFacets, {});
  const mixedTotal = eligibleCount(input.allFacets, {});

  const sessions: PlannedSession[] = [];
  let sequence = 0;
  let turn = 0;
  let reviewLeft = input.retryable;
  const offsets = dayOffsets(shape.sessionsPerWeek);
  for (let week = 0; week < shape.weeks; week += 1) {
    for (const [index, offset] of offsets.entries()) {
      const scheduledOn = addDays(shape.startsOn, week * 7 + offset);
      if (scheduledOn > shape.endsOn) continue;
      sequence += 1;

      // Missed questions come back first in a week, one review a week, for
      // as many weeks as it takes to ask each of them once.
      if (index === 0 && reviewLeft > 0) {
        const count = Math.min(reviewLeft, MAX_RETRY_QUESTIONS, SESSION_QUESTIONS);
        reviewLeft -= count;
        sessions.push({
          scheduledOn,
          sequence,
          kind: 'review',
          domainSlug: null,
          skillSlug: null,
          questionCount: count,
          minutes: SESSION_MINUTES,
          reason: `${input.retryable} question${input.retryable === 1 ? '' : 's'} you missed can be asked again; this repeats questions on purpose`,
        });
        continue;
      }

      if (queue.length === 0) {
        if (mixedTotal === 0) continue;
        const count = Math.min(SESSION_QUESTIONS, mixedTotal);
        const fresh = mixedUnseen >= count;
        if (fresh) mixedUnseen -= count;
        sessions.push({
          scheduledOn,
          sequence,
          kind: fresh ? 'mixed' : 'revision',
          domainSlug: null,
          skillSlug: null,
          questionCount: count,
          minutes: SESSION_MINUTES,
          reason: fresh
            ? 'not enough of your own answers yet to single out a topic'
            : 'you have been shown most of these questions; this revises them',
        });
        continue;
      }

      const focus = queue[turn % queue.length];
      turn += 1;
      const available = focusCount(input.allFacets, focus);
      const count = Math.min(SESSION_QUESTIONS, available);
      const key = unseenFor(focus);
      const left = unseenLeft.get(key)!;
      const fresh = left >= count;
      if (fresh) unseenLeft.set(key, left - count);
      sessions.push({
        scheduledOn,
        sequence,
        kind: fresh ? 'new' : 'revision',
        domainSlug: focus.domainSlug,
        skillSlug: focus.skillSlug,
        questionCount: count,
        minutes: SESSION_MINUTES,
        reason: fresh ? focus.reason : `${focus.reason}; too few questions you have not seen are left, so this revises ones you have`,
      });
    }
  }
  return sessions;
}

/** A session's label, from its kind and topic. */
export function sessionLabel(config: ExamConfig, session: Pick<PlannedSession, 'kind' | 'domainSlug' | 'skillSlug'>): string {
  const labels = labelsFor(config);
  const topic = session.skillSlug
    ? (labels.skills[session.skillSlug] ?? session.skillSlug)
    : session.domainSlug
      ? (labels.domains[session.domainSlug] ?? session.domainSlug)
      : null;
  switch (session.kind) {
    case 'review':
      return 'Revisit questions you missed';
    case 'mixed':
      return 'Mixed practice, new questions';
    case 'new':
      return `${topic}, new questions`;
    case 'revision':
      return topic ? `${topic}, revision` : 'Mixed revision';
  }
}

// ---------------------------------------------------------------------------
// Satisfaction: which finished session completes which planned one
// ---------------------------------------------------------------------------

export interface FinishedAttempt {
  id: string;
  blueprintId: string;
  mode: string;
  submittedAt: string;
  answered: number;
  domains: string[];
  skills: string[];
}

/**
 * Whether a finished session satisfies a planned one:
 * - it was finished (submitted, or ended by its time limit), after the plan
 *   was made, with at least MIN_ANSWERS_TO_COUNT answers (or the planned
 *   number, if smaller). Opening a session, or leaving it unfinished or
 *   nearly blank, satisfies nothing;
 * - a review is satisfied by a retry of missed questions; anything else by
 *   a practice session (not a retry, diagnostic or simulation) of the same
 *   skill, or restricted to the same topic (a skill in it counts). Mixed
 *   practice or mixed revision is satisfied by any practice session.
 * Whether the questions were new to the learner is not checked: the plan
 * says which it intends, and the session setup lets the learner choose.
 */
export function satisfies(attempt: FinishedAttempt, session: Pick<PlanSessionRow, 'kind' | 'domainSlug' | 'skillSlug' | 'questionCount'>): boolean {
  if (attempt.answered < Math.min(MIN_ANSWERS_TO_COUNT, session.questionCount)) return false;
  const isRetry = attempt.blueprintId === 'retry' || attempt.mode === 'review';
  if (session.kind === 'review') return isRetry;
  if (isRetry || attempt.blueprintId !== 'practice') return false;
  if (session.skillSlug) return attempt.skills.includes(session.skillSlug);
  if (session.domainSlug) return attempt.domains.includes(session.domainSlug);
  return true;
}

/**
 * Matches finished sessions to open (stored as planned) ones, in finishing
 * order. A session started from the plan satisfies the one it was started
 * from, or none; any other satisfies the earliest open session it fits that
 * was not started from the plan. Each finished session satisfies at most one
 * planned session.
 */
export function matchCompletions(
  sessions: PlanSessionRow[],
  attempts: FinishedAttempt[],
): Array<{ sessionId: string; attemptId: string; at: string }> {
  const open = sessions
    .filter((s) => s.status === 'planned')
    .sort((a, b) => a.scheduledOn.localeCompare(b.scheduledOn) || a.sequence - b.sequence);
  const taken = new Set<string>();
  const used = new Set(sessions.filter((s) => s.status === 'completed' && s.attemptId).map((s) => s.attemptId!));
  const result: Array<{ sessionId: string; attemptId: string; at: string }> = [];
  for (const attempt of [...attempts].sort((a, b) => a.submittedAt.localeCompare(b.submittedAt))) {
    if (used.has(attempt.id)) continue;
    const linked = open.find((s) => s.attemptId === attempt.id && !taken.has(s.id));
    const target = linked
      ? satisfies(attempt, linked) ? linked : undefined
      : open.find((s) => !taken.has(s.id) && !s.attemptId && satisfies(attempt, s));
    if (!target) continue;
    taken.add(target.id);
    used.add(attempt.id);
    result.push({ sessionId: target.id, attemptId: attempt.id, at: attempt.submittedAt });
  }
  return result;
}

// ---------------------------------------------------------------------------
// Adjusting: a preview of what would change
// ---------------------------------------------------------------------------

export interface AdjustmentPreview {
  /** Missed sessions, recorded as missed, whose topics are carried forward. */
  missed: PlanSessionRow[];
  /** Future planned sessions that would be removed. */
  removed: PlanSessionRow[];
  /** Sessions that would be added. */
  added: PlannedSession[];
  /** Future sessions that stay as they are (same day, kind and topic). */
  kept: number;
  /** Completed and skipped sessions: history, untouched. */
  history: number;
  startsOn: string;
  endsOn: string;
}

const sameSlot = (a: Pick<PlannedSession, 'scheduledOn' | 'kind' | 'domainSlug' | 'skillSlug'>, b: typeof a) =>
  a.scheduledOn === b.scheduledOn && a.kind === b.kind && a.domainSlug === b.domainSlug && a.skillSlug === b.skillSlug;

/**
 * What "Adjust my remaining plan" would do. Completed and skipped sessions
 * are history and stay. Missed ones are recorded as missed, and their topics
 * are scheduled first. Future planned sessions not yet started are replaced
 * by a fresh schedule from today; one already started is kept.
 */
export function previewAdjustment(
  sessions: PlanSessionRow[],
  rebuilt: PlannedSession[],
  now: Date,
  startsOn: string,
  endsOn: string,
): AdjustmentPreview {
  const missed = sessions.filter((s) => stateOf(s, now) === 'missed');
  const upcoming = sessions.filter((s) => stateOf(s, now) === 'planned');
  const future = upcoming.filter((s) => !s.attemptId);
  const removed = future.filter((s) => !rebuilt.some((r) => sameSlot(r, s)));
  const added = rebuilt.filter((r) => !future.some((s) => sameSlot(r, s)));
  return {
    missed,
    removed,
    added,
    kept: upcoming.length - removed.length,
    history: sessions.filter((s) => s.status === 'completed' || s.status === 'skipped').length,
    startsOn,
    endsOn,
  };
}

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

interface RawPlan {
  id: string;
  user_id: string;
  exam_key: string;
  status: 'active' | 'ended';
  weekly_minutes: number;
  session_minutes: number;
  starts_on: string;
  ends_on: string;
  exam_date: string | null;
  created_at: string;
  adjusted_at: string | null;
  version: number;
}

const toPlan = (row: RawPlan): PlanRow => ({
  id: row.id,
  userId: row.user_id,
  examKey: row.exam_key,
  status: row.status,
  weeklyMinutes: row.weekly_minutes,
  sessionMinutes: row.session_minutes,
  startsOn: row.starts_on,
  endsOn: row.ends_on,
  examDate: row.exam_date,
  createdAt: row.created_at,
  adjustedAt: row.adjusted_at,
  version: row.version,
});

export function activePlan(db: Db, userId: string, examKey: string): PlanRow | null {
  const row = db
    .prepare("SELECT * FROM plans WHERE user_id = ? AND exam_key = ? AND status = 'active'")
    .get(userId, examKey) as RawPlan | undefined;
  return row ? toPlan(row) : null;
}

export function planSessions(db: Db, userId: string, planId: string): PlanSessionRow[] {
  return db
    .prepare(
      `SELECT id, plan_id AS planId, scheduled_on AS scheduledOn, sequence, kind, domain_slug AS domainSlug,
              skill_slug AS skillSlug, question_count AS questionCount, minutes, reason, status,
              attempt_id AS attemptId, status_at AS statusAt
         FROM plan_sessions WHERE plan_id = ? AND user_id = ?
        ORDER BY scheduled_on, sequence`,
    )
    .all(planId, userId) as PlanSessionRow[];
}

/** The canonical exam date (exam_targets), and any value the migration kept for the learner to choose. */
export function examDateFor(db: Db, userId: string, examKey: string): { examDate: string | null; conflicting: string | null } {
  const row = db
    .prepare('SELECT target_date AS examDate, legacy_plan_date AS conflicting FROM exam_targets WHERE user_id = ? AND exam_key = ?')
    .get(userId, examKey) as { examDate: string | null; conflicting: string | null } | undefined;
  return { examDate: row?.examDate ?? null, conflicting: row?.conflicting ?? null };
}

/**
 * Sets the canonical exam date, keeping any target score. As when the goal is
 * saved (queries.setExamTarget), a kept earlier date is settled only if the
 * date actually changes.
 */
export function setExamDate(db: Db, userId: string, examKey: string, examDate: string | null, now = new Date()): void {
  const iso = now.toISOString();
  db.prepare(
    `INSERT INTO exam_targets (user_id, exam_key, target_score, target_date, created_at, updated_at, legacy_plan_date)
     VALUES (?, ?, NULL, ?, ?, ?, NULL)
     ON CONFLICT (user_id, exam_key) DO UPDATE SET
       legacy_plan_date = CASE WHEN excluded.target_date IS exam_targets.target_date THEN exam_targets.legacy_plan_date ELSE NULL END,
       target_date = excluded.target_date,
       updated_at = excluded.updated_at`,
  ).run(userId, examKey, examDate, iso, iso);
}

/**
 * Settles a date conflict the migration kept: the learner keeps the current
 * date, or takes the one from their earlier study plan. Either way the other
 * is cleared, because the learner chose.
 */
export function resolveDateConflict(db: Db, userId: string, examKey: string, keep: 'current' | 'earlier', now = new Date()): boolean {
  const info = db
    .prepare(
      `UPDATE exam_targets
          SET target_date = CASE WHEN ? = 'earlier' THEN legacy_plan_date ELSE target_date END,
              legacy_plan_date = NULL, updated_at = ?
        WHERE user_id = ? AND exam_key = ? AND legacy_plan_date IS NOT NULL`,
    )
    .run(keep, now.toISOString(), userId, examKey);
  return info.changes > 0;
}

/**
 * The old study plan's date, when migration 007 could attach it to no exam
 * (users.target_date, no longer written). Offered when the learner first
 * plans, and cleared once a plan is created with or without it.
 */
export function unattachedPlanDate(db: Db, userId: string): string | null {
  const row = db.prepare('SELECT target_date AS date FROM users WHERE id = ?').get(userId) as { date: string | null } | undefined;
  return row?.date ?? null;
}

/**
 * Questions of this exam the learner missed and has not answered correctly
 * since (the review queue), that can be asked again, soonest due first.
 */
export function retryableMissed(db: Db, userId: string, examKey: string): string[] {
  const missed = (
    db
      .prepare(
        `SELECT question_id AS id FROM review_queue
          WHERE user_id = ? AND exam_key = ? AND last_result <> 'correct'
          ORDER BY due_at, question_id`,
      )
      .all(userId, examKey) as Array<{ id: string }>
  ).map((row) => row.id);
  return retryCandidates(db, userId, examKey, missed).available.map((item) => item.questionId);
}

/** Everything a plan is built from, read now for this learner. */
export function planInputs(
  db: Db,
  userId: string,
  config: ExamConfig,
  options: { startsOn: string; examDate: string | null; weeklyMinutes: number; carryForward?: PlanInputs['carryForward'] },
): PlanInputs {
  const practice = getBlueprint(config, 'practice');
  const unseenPool = getPool(db, config.examKey, userId).filter((item) => item.lastSeenAt === null);
  return {
    config,
    startsOn: options.startsOn,
    examDate: options.examDate,
    weeklyMinutes: options.weeklyMinutes,
    performance: skillPerformance(db, userId, config.examKey),
    allFacets: practiceFacets(db, config),
    unseenFacets: practice ? facetsFromPool(unseenPool, config, practice) : [],
    retryable: retryableMissed(db, userId, config.examKey).length,
    carryForward: options.carryForward,
  };
}

function insertSessions(db: Db, userId: string, planId: string, sessions: PlannedSession[], firstSequence: number, iso: string): void {
  const insert = db.prepare(
    `INSERT INTO plan_sessions (id, plan_id, user_id, scheduled_on, sequence, kind, domain_slug, skill_slug,
                                question_count, minutes, reason, status, attempt_id, status_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'planned', NULL, NULL, ?)`,
  );
  sessions.forEach((session, index) => {
    insert.run(
      randomUUID(), planId, userId, session.scheduledOn, firstSequence + index, session.kind,
      session.domainSlug, session.skillSlug, session.questionCount, session.minutes, session.reason, iso,
    );
  });
}

export class PlanError extends Error {
  constructor(
    readonly code: 'plan-exists' | 'no-plan' | 'plan-changed' | 'not-found' | 'not-skippable' | 'nothing-to-plan',
    message: string,
  ) {
    super(message);
  }
}

/** Creates the learner's plan for an exam. Refused if one is already active. */
export function createPlan(
  db: Db,
  input: { userId: string; examKey: string; weeklyMinutes: number; examDate: string | null; now?: Date },
): PlanRow {
  const now = input.now ?? new Date();
  const config = requireExamConfig(input.examKey);
  const startsOn = isoDay(now);
  const sessions = buildSessions(planInputs(db, input.userId, config, { startsOn, examDate: input.examDate, weeklyMinutes: input.weeklyMinutes }));
  if (sessions.length === 0) throw new PlanError('nothing-to-plan', 'There are no reviewed questions to plan for this exam yet.');
  const shape = planShape(startsOn, input.examDate, input.weeklyMinutes);
  const id = randomUUID();
  const iso = now.toISOString();
  const run = db.transaction(() => {
    if (activePlan(db, input.userId, config.examKey)) throw new PlanError('plan-exists', 'You already have a plan for this exam.');
    db.prepare(
      `INSERT INTO plans (id, user_id, exam_key, status, weekly_minutes, session_minutes, starts_on, ends_on, exam_date, created_at, adjusted_at, ended_at, version)
       VALUES (?, ?, ?, 'active', ?, ?, ?, ?, ?, ?, NULL, NULL, 1)`,
    ).run(id, input.userId, config.examKey, input.weeklyMinutes, SESSION_MINUTES, startsOn, shape.endsOn, input.examDate, iso);
    insertSessions(db, input.userId, id, sessions, 1, iso);
  });
  run.immediate();
  return activePlan(db, input.userId, config.examKey)!;
}

/** The learner's finished sessions of this exam since the plan was created, with their filters. */
function finishedSince(db: Db, userId: string, config: ExamConfig, since: string): FinishedAttempt[] {
  const rows = db
    .prepare(
      `SELECT a.id, a.blueprint_id AS blueprintId, a.mode, a.submitted_at AS submittedAt, a.settings_json AS settings,
              (SELECT COUNT(*) FROM attempt_items ai WHERE ai.attempt_id = a.id AND ai.response_status = 'answered') AS answered
         FROM attempts a
        WHERE a.user_id = ? AND a.exam_key = ? AND a.status IN ('submitted', 'expired')
          AND a.submitted_at IS NOT NULL AND a.submitted_at >= ?`,
    )
    .all(userId, config.examKey, since) as Array<{ id: string; blueprintId: string; mode: string; submittedAt: string; settings: string; answered: number }>;
  // A session restricted to a skill practised that skill's topic too.
  const domainOfSkill = new Map(config.domains.flatMap((domain) => domain.skills.map((skill) => [skill.slug, domain.slug] as const)));
  return rows.map((row) => {
    let overrides: { domains?: string[]; skills?: string[] } = {};
    try {
      overrides = (JSON.parse(row.settings) as { overrides?: typeof overrides }).overrides ?? {};
    } catch {
      /* unreadable settings: no filters */
    }
    const skills = overrides.skills ?? [];
    const domains = new Set(overrides.domains ?? []);
    for (const skill of skills) {
      const domain = domainOfSkill.get(skill);
      if (domain) domains.add(domain);
    }
    return {
      id: row.id,
      blueprintId: row.blueprintId,
      mode: row.mode,
      submittedAt: row.submittedAt,
      answered: row.answered,
      domains: [...domains],
      skills,
    };
  });
}

/**
 * Records completions: the only write a visit makes. It never changes the
 * schedule. Returns how many sessions it completed.
 */
export function recordCompletions(db: Db, userId: string, plan: PlanRow): number {
  const config = requireExamConfig(plan.examKey);
  const run = db.transaction(() => {
    const sessions = planSessions(db, userId, plan.id);
    const matches = matchCompletions(sessions, finishedSince(db, userId, config, plan.createdAt));
    if (matches.length === 0) return 0;
    const update = db.prepare(
      "UPDATE plan_sessions SET status = 'completed', attempt_id = ?, status_at = ? WHERE id = ? AND user_id = ? AND status = 'planned'",
    );
    for (const match of matches) update.run(match.attemptId, match.at, match.sessionId, userId);
    db.prepare('UPDATE plans SET version = version + 1 WHERE id = ? AND user_id = ?').run(plan.id, userId);
    return matches.length;
  });
  return run.immediate();
}

/**
 * Skips a session still stored as planned (shown as planned or missed).
 * Completed and recorded-missed sessions are history and cannot be skipped.
 */
export function skipSession(db: Db, userId: string, sessionId: string, now = new Date()): void {
  const run = db.transaction(() => {
    const info = db
      .prepare(
        `UPDATE plan_sessions SET status = 'skipped', status_at = ?
          WHERE id = ? AND user_id = ? AND status = 'planned'
            AND plan_id IN (SELECT id FROM plans WHERE user_id = ? AND status = 'active')`,
      )
      .run(now.toISOString(), sessionId, userId, userId);
    if (info.changes === 0) throw new PlanError('not-skippable', 'That session cannot be skipped.');
    db.prepare('UPDATE plans SET version = version + 1 WHERE id = (SELECT plan_id FROM plan_sessions WHERE id = ?)').run(sessionId);
  });
  run.immediate();
}

/** A session of the learner's active plan still stored as planned, or null. */
export function openSession(db: Db, userId: string, sessionId: string): (PlanSessionRow & { examKey: string }) | null {
  const row = db
    .prepare(
      `SELECT s.id, s.plan_id AS planId, s.scheduled_on AS scheduledOn, s.sequence, s.kind, s.domain_slug AS domainSlug,
              s.skill_slug AS skillSlug, s.question_count AS questionCount, s.minutes, s.reason, s.status,
              s.attempt_id AS attemptId, s.status_at AS statusAt, p.exam_key AS examKey
         FROM plan_sessions s JOIN plans p ON p.id = s.plan_id
        WHERE s.id = ? AND s.user_id = ? AND s.status = 'planned' AND p.status = 'active'`,
    )
    .get(sessionId, userId) as (PlanSessionRow & { examKey: string }) | undefined;
  return row ?? null;
}

/**
 * Links a session started from the plan to its attempt, so that attempt (and
 * no other) can satisfy it. Starting it again moves the link to the new one.
 */
export function linkStartedSession(db: Db, userId: string, sessionId: string, attemptId: string): void {
  db.prepare("UPDATE plan_sessions SET attempt_id = ? WHERE id = ? AND user_id = ? AND status = 'planned'").run(
    attemptId,
    sessionId,
    userId,
  );
}

export interface AdjustmentPlan {
  preview: AdjustmentPreview;
  weeklyMinutes: number;
  examDate: string | null;
  /** Identifies exactly this preview; applying checks it is still what would happen. */
  digest: string;
}

/** Works out an adjustment without storing anything. */
export function planAdjustment(
  db: Db,
  userId: string,
  plan: PlanRow,
  options: { weeklyMinutes: number; examDate: string | null; now?: Date },
): AdjustmentPlan {
  const now = options.now ?? new Date();
  const config = requireExamConfig(plan.examKey);
  const sessions = planSessions(db, userId, plan.id);
  const missed = sessions.filter((s) => stateOf(s, now) === 'missed');
  const startsOn = isoDay(now);
  const carryForward = missed
    .filter((s) => s.kind === 'new' || s.kind === 'revision')
    .map((s) => ({ domainSlug: s.domainSlug, skillSlug: s.skillSlug }));
  const started = sessions.filter((s) => s.status === 'planned' && s.attemptId && stateOf(s, now) === 'planned');
  const rebuilt = buildSessions(
    planInputs(db, userId, config, { startsOn, examDate: options.examDate, weeklyMinutes: options.weeklyMinutes, carryForward }),
  )
    // A session already started from the plan stays; the new schedule does not repeat its slot.
    .filter((r) => !started.some((s) => s.scheduledOn === r.scheduledOn && s.kind === r.kind));
  const shape = planShape(startsOn, options.examDate, options.weeklyMinutes);
  const preview = previewAdjustment(sessions, rebuilt, now, startsOn, shape.endsOn);
  const digest = createHash('sha256')
    .update(
      JSON.stringify({
        plan: plan.id,
        version: plan.version,
        weeklyMinutes: options.weeklyMinutes,
        examDate: options.examDate,
        endsOn: preview.endsOn,
        missed: preview.missed.map((s) => s.id),
        removed: preview.removed.map((s) => s.id),
        added: preview.added.map((s) => [s.scheduledOn, s.kind, s.domainSlug, s.skillSlug, s.questionCount]),
      }),
    )
    .digest('hex')
    .slice(0, 24);
  return { preview, weeklyMinutes: options.weeklyMinutes, examDate: options.examDate, digest };
}

/**
 * Applies an adjustment the learner has seen. It is worked out again inside
 * the write, and refused unless it is exactly the preview shown (same digest):
 * if the plan, the learner's practice or the day moved on meanwhile, the
 * learner is shown the new preview instead.
 */
export function applyAdjustment(
  db: Db,
  userId: string,
  planId: string,
  expectedDigest: string,
  options: { weeklyMinutes: number; examDate: string | null; now?: Date },
): void {
  const now = options.now ?? new Date();
  const iso = now.toISOString();
  const run = db.transaction(() => {
    const raw = db.prepare("SELECT * FROM plans WHERE id = ? AND user_id = ? AND status = 'active'").get(planId, userId) as RawPlan | undefined;
    if (!raw) throw new PlanError('no-plan', 'That plan is no longer active.');
    const plan = toPlan(raw);
    const { preview, digest } = planAdjustment(db, userId, plan, { ...options, now });
    if (digest !== expectedDigest) throw new PlanError('plan-changed', 'The plan changed since you looked at it. Review the changes again.');
    const markMissed = db.prepare("UPDATE plan_sessions SET status = 'missed', status_at = ? WHERE id = ? AND user_id = ? AND status = 'planned'");
    for (const session of preview.missed) markMissed.run(iso, session.id, userId);
    const remove = db.prepare("DELETE FROM plan_sessions WHERE id = ? AND user_id = ? AND status = 'planned' AND attempt_id IS NULL");
    for (const session of preview.removed) remove.run(session.id, userId);
    const maxSequence = (db.prepare('SELECT COALESCE(MAX(sequence), 0) AS n FROM plan_sessions WHERE plan_id = ?').get(plan.id) as { n: number }).n;
    insertSessions(db, userId, plan.id, preview.added, maxSequence + 1, iso);
    db.prepare(
      `UPDATE plans SET weekly_minutes = ?, exam_date = ?, ends_on = ?, adjusted_at = ?, version = version + 1
        WHERE id = ? AND user_id = ?`,
    ).run(options.weeklyMinutes, options.examDate, preview.endsOn, iso, plan.id, userId);
  });
  run.immediate();
}

/** Ends a plan. Its sessions stay as history. */
export function endPlan(db: Db, userId: string, planId: string, now = new Date()): void {
  const info = db
    .prepare("UPDATE plans SET status = 'ended', ended_at = ?, version = version + 1 WHERE id = ? AND user_id = ? AND status = 'active'")
    .run(now.toISOString(), planId, userId);
  if (info.changes === 0) throw new PlanError('no-plan', 'That plan is no longer active.');
}
