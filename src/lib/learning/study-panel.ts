import type { Db } from '@/lib/db';
import type { AuthUser } from '@/lib/auth/session';
import { getExamConfig, requireExamConfig } from '@/lib/exams/registry';
import { practisableDomains } from '@/lib/attempts/availability';
import { listUnfinishedAttempts } from '@/lib/attempts/service';
import { loadEntitlements, type EntitlementDeps } from '@/lib/billing/entitlements';
import { dashboardHref, examLabel } from './dashboard';
import { labelSummary, type MistakeLabel } from './mistakes';
import { activePlan, addDays, isoDay, planSessions, recordCompletions, sessionLabel, stateOf } from './plan';
import { planningHref } from './planning';
import { answerTimes, domainPerformance, getExamTarget, recentSessionScores } from './queries';
import { assessReadiness, bandLabel, MIN_ANSWERS_FOR_SIGNAL, type Band } from './readiness';
import { MIN_ATTEMPTS_FOR_SIGNAL, WEAK_ACCURACY, buildRecommendations, skillPerformance } from './recommend';
import { msg, renderText, type LearnerText, type Translate } from './text';

/**
 * The site's "Study plan" side panel, as data.
 *
 * A digest of what the dashboard, the study plan and the mistake notebook
 * already compute, for the exams the learner is working on now. Nothing here
 * is a new measure: progress is the readiness module's band and counts, weak
 * spots are the skills and topics the dashboard would suggest drilling, and
 * the next session is the learner's own plan when they have one, else the
 * dashboard's first recommendation. Read for one learner only.
 *
 * Public pages are saved as static files (src/lib/seo/static-pages.ts), so
 * the panel asks for this from the browser (/api/study-panel) and nothing in
 * it is ever rendered into a page's HTML.
 */

/** An exam counts as current when it was practised this recently. */
export const RECENT_DAYS = 30;
/** The panel lists at most this many exams. */
export const MAX_PANEL_EXAMS = 4;
/** Weak skills and topics shown, across those exams. */
export const MAX_WEAK_SPOTS = 4;
/** Days of activity shown, ending today. */
export const ACTIVITY_DAYS = 7;
/** How far back a streak is counted; a longer one reads as "at least". */
export const STREAK_LOOKBACK_DAYS = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

export type CurrentReason = 'unfinished' | 'recent' | 'pass' | 'plan' | 'target';

export interface PanelExam<T = LearnerText> {
  examKey: string;
  label: string;
  /** Why it is listed, most telling first. */
  reasons: CurrentReason[];
  href: string;
  practiseHref: string;
  /** Scored answers (answered or left blank) in finished sessions, retries excluded. */
  scored: number;
  correct: number;
  /** Share correct, only once there are enough answers for it to mean anything. */
  accuracy: number | null;
  /** How many more answers before a share is shown. */
  answersToSignal: number;
  band: Band;
  bandLabel: T;
  topicsCovered: number;
  topicCount: number;
  dueReview: number;
  /** The learner's own exam date (study plan or goal), never one we inferred. */
  examDate: string | null;
  daysToExam: number | null;
  plan: { done: number; total: number } | null;
}

export interface PanelNext<T = LearnerText> {
  source: 'plan' | 'recommendation';
  examLabel: string;
  title: T;
  because: T | null;
  href: string;
  action: T;
}

export interface PanelWeakSpot {
  kind: 'skill' | 'topic';
  examLabel: string;
  name: string;
  scored: number;
  correct: number;
  accuracy: number;
  href: string;
}

export interface PanelActivity {
  /** The last ACTIVITY_DAYS calendar days, oldest first, in the reader's zone. */
  days: Array<{ day: string; answered: number }>;
  answeredThisWeek: number;
  /** Consecutive days with an answer, ending today (or yesterday, while today is still open). */
  streak: number;
  /** The streak reaches back past STREAK_LOOKBACK_DAYS. */
  streakAtLeast: boolean;
}

export interface StudyPanel<T = LearnerText> {
  resume: { href: string; examLabel: string; question: number; questionCount: number; others: number } | null;
  next: PanelNext<T> | null;
  exams: PanelExam<T>[];
  weakSpots: PanelWeakSpot[];
  /** When a skill or topic counts as weak, for the sentence that explains an empty list. */
  weakRule: { minAnswers: number; below: number };
  mistakeLabels: Array<{ key: MistakeLabel; count: number }>;
  review: { dueNow: number; nextDueAt: string | null };
  activity: PanelActivity;
}

/** A time-zone offset from the browser (Date#getTimezoneOffset, in minutes), or UTC. */
export function parseOffset(value: string | null | undefined): number {
  if (!value || !/^-?\d{1,4}$/.test(value)) return 0;
  const minutes = Number(value);
  return Math.abs(minutes) <= 14 * 60 ? minutes : 0;
}

/** The reader's calendar day for an instant, given their getTimezoneOffset(). */
export function localDay(at: Date | string, offsetMinutes: number): string {
  const time = typeof at === 'string' ? Date.parse(at) : at.getTime();
  return isoDay(new Date(time - offsetMinutes * 60_000));
}

/** Answers per day over the last ACTIVITY_DAYS, and the streak, from answer times. */
export function summariseActivity(answeredAt: readonly string[], now: Date, offsetMinutes: number): PanelActivity {
  const perDay = new Map<string, number>();
  for (const at of answeredAt) {
    if (Number.isNaN(Date.parse(at))) continue;
    const day = localDay(at, offsetMinutes);
    perDay.set(day, (perDay.get(day) ?? 0) + 1);
  }
  const today = localDay(now, offsetMinutes);
  const days = Array.from({ length: ACTIVITY_DAYS }, (_, index) => {
    const day = addDays(today, index - (ACTIVITY_DAYS - 1));
    return { day, answered: perDay.get(day) ?? 0 };
  });

  // Today still counts as open: a streak that ran to yesterday is not broken yet.
  let cursor = perDay.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (perDay.has(cursor) && streak < STREAK_LOOKBACK_DAYS) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return {
    days,
    answeredThisWeek: days.reduce((n, day) => n + day.answered, 0),
    streak,
    streakAtLeast: streak >= STREAK_LOOKBACK_DAYS,
  };
}

/** Whole days from today to an exam date, in the reader's zone; null once it has passed. */
export function daysUntil(examDate: string, now: Date, offsetMinutes: number): number | null {
  const today = Date.parse(`${localDay(now, offsetMinutes)}T00:00:00Z`);
  const target = Date.parse(`${examDate}T00:00:00Z`);
  if (Number.isNaN(target)) return null;
  const days = Math.round((target - today) / DAY_MS);
  return days >= 0 ? days : null;
}

interface Candidate {
  examKey: string;
  reasons: Set<CurrentReason>;
  latest: string | null;
}

const REASON_ORDER: CurrentReason[] = ['unfinished', 'recent', 'plan', 'pass', 'target'];

/** The exams the learner is working on now, most recently active first. */
async function currentExams(
  db: Db,
  user: Pick<AuthUser, 'id' | 'targetExamKey'>,
  unfinishedExams: string[],
  now: Date,
  billing: EntitlementDeps,
): Promise<Candidate[]> {
  const candidates = new Map<string, Candidate>();
  const add = (examKey: string, reason: CurrentReason, latest: string | null = null) => {
    if (!getExamConfig(examKey)) return;
    const entry = candidates.get(examKey) ?? { examKey, reasons: new Set<CurrentReason>(), latest: null };
    entry.reasons.add(reason);
    if (latest && (!entry.latest || latest > entry.latest)) entry.latest = latest;
    candidates.set(examKey, entry);
  };

  for (const examKey of unfinishedExams) add(examKey, 'unfinished');

  // Finished sessions: one still open is 'unfinished' above.
  const since = new Date(now.getTime() - RECENT_DAYS * DAY_MS).toISOString();
  const recent = (await db
    .prepare(
      `SELECT exam_key AS examKey, MAX(COALESCE(submitted_at, started_at)) AS latest
         FROM attempts
        WHERE user_id = ? AND status IN ('submitted', 'expired') AND COALESCE(submitted_at, started_at) >= ?
        GROUP BY exam_key`,
    )
    .all(user.id, since)) as Array<{ examKey: string; latest: string }>;
  for (const row of recent) add(row.examKey, 'recent', row.latest);

  const plans = (await db
    .prepare("SELECT exam_key AS examKey FROM plans WHERE user_id = ? AND status = 'active'")
    .all(user.id)) as Array<{ examKey: string }>;
  for (const row of plans) add(row.examKey, 'plan');

  // A Single Exam Pass (or any one-exam grant) names the exam it is for. The
  // panel must never fail because billing is misconfigured, so that is quiet.
  try {
    const entitlements = await loadEntitlements(db, user.id, { now, ...billing });
    for (const grant of entitlements.liveGrants) if (grant.examKey) add(grant.examKey, 'pass');
  } catch {
    // No passes shown; everything else still is.
  }

  // The learner's target exam, and any exam they set a goal or exam date for.
  if (user.targetExamKey) add(user.targetExamKey, 'target');
  const goals = (await db
    .prepare('SELECT exam_key AS examKey FROM exam_targets WHERE user_id = ?')
    .all(user.id)) as Array<{ examKey: string }>;
  for (const row of goals) add(row.examKey, 'target');

  return [...candidates.values()]
    .sort((a, b) => {
      if (a.reasons.has('unfinished') !== b.reasons.has('unfinished')) return a.reasons.has('unfinished') ? -1 : 1;
      if ((a.latest ?? '') !== (b.latest ?? '')) return (b.latest ?? '').localeCompare(a.latest ?? '');
      const rank = (c: Candidate) => Math.min(...[...c.reasons].map((r) => REASON_ORDER.indexOf(r)));
      return rank(a) - rank(b);
    })
    .slice(0, MAX_PANEL_EXAMS);
}

async function reviewByExam(db: Db, userId: string, now: Date) {
  const iso = now.toISOString();
  const rows = (await db
    .prepare(
      `SELECT exam_key AS examKey,
              COALESCE(SUM(CASE WHEN due_at <= ? THEN 1 ELSE 0 END), 0) AS dueNow,
              MIN(CASE WHEN due_at > ? THEN due_at END)                 AS nextDueAt
         FROM review_queue
        WHERE user_id = ? AND last_result <> 'correct'
        GROUP BY exam_key`,
    )
    .all(iso, iso, userId)) as Array<{ examKey: string; dueNow: number; nextDueAt: string | null }>;
  return new Map(rows.map((row) => [row.examKey, { dueNow: Number(row.dueNow), nextDueAt: row.nextDueAt }]));
}

async function answerTimesSince(db: Db, userId: string, since: Date): Promise<string[]> {
  const rows = (await db
    .prepare(
      `SELECT ai.last_answered_at AS at
         FROM attempt_items ai JOIN attempts a ON a.id = ai.attempt_id
        WHERE a.user_id = ? AND ai.response_status = 'answered' AND ai.last_answered_at >= ?`,
    )
    .all(userId, since.toISOString())) as Array<{ at: string }>;
  return rows.map((row) => row.at);
}

export async function buildStudyPanel(
  db: Db,
  user: Pick<AuthUser, 'id' | 'targetExamKey'>,
  options: { now?: Date; offsetMinutes?: number; billing?: EntitlementDeps } = {},
): Promise<StudyPanel> {
  const now = options.now ?? new Date();
  const offset = options.offsetMinutes ?? 0;

  // Closes anything past its deadline first, as the dashboard does.
  const unfinished = await listUnfinishedAttempts(db, user.id, now);
  const candidates = await currentExams(db, user, unfinished.map((a) => a.examKey), now, options.billing ?? {});
  const review = await reviewByExam(db, user.id, now);
  // The exam the dashboard would open (src/lib/learning/dashboard.ts chooseExam): the
  // target, then the latest practice. An unfinished session has its own card above.
  const primary =
    candidates.find((c) => c.examKey === user.targetExamKey) ??
    candidates.find((c) => c.reasons.has('recent')) ??
    candidates[0];

  const exams: PanelExam[] = [];
  const weakSpots: PanelWeakSpot[] = [];
  let next: PanelNext | null = null;

  for (const candidate of candidates) {
    const config = requireExamConfig(candidate.examKey);
    const label = examLabel(config.examKey);
    const target = await getExamTarget(db, user.id, config.examKey);
    const performance = await skillPerformance(db, user.id, config.examKey);
    const readiness = assessReadiness({
      config,
      performance,
      byDomain: await domainPerformance(db, user.id, config.examKey),
      targetScore: target?.targetScore ?? null,
      recentSessions: await recentSessionScores(db, user.id, config.examKey),
      timing: await answerTimes(db, user.id, config.examKey),
    });
    const correct = performance.reduce((n, skill) => n + skill.correct, 0);
    const due = review.get(config.examKey)?.dueNow ?? 0;

    const plan = await activePlan(db, user.id, config.examKey);
    let planSummary: PanelExam['plan'] = null;
    if (plan) {
      // The study plan page records completions on every visit; so does the panel.
      await recordCompletions(db, user.id, plan);
      const sessions = await planSessions(db, user.id, plan.id);
      const counted = sessions.filter((s) => s.status !== 'skipped');
      planSummary = { done: counted.filter((s) => s.status === 'completed').length, total: counted.length };
      const upcoming = sessions.find((s) => stateOf(s, now) === 'planned');
      if (!next && upcoming) {
        next = {
          source: 'plan',
          examLabel: label,
          title: sessionLabel(config, upcoming),
          because: upcoming.reason,
          href: planningHref('plan', config.examKey),
          action: msg('plan.openPlan'),
        };
      }
    }

    // That exam's first recommendation, exactly as its dashboard would make it.
    if (!next && candidate === primary) {
      const attempted = new Set(readiness.gaps.filter((gap) => gap.answered > 0).map((gap) => gap.domainSlug));
      const untouchedDomains = (await practisableDomains(db, config))
        .filter((domain) => !attempted.has(domain.slug))
        .map((domain) => ({ slug: domain.slug, name: domain.name, count: domain.count }));
      const first = buildRecommendations({
        examKey: config.examKey,
        performance,
        untouchedDomains,
        dueReviewCount: due,
        totalAnswered: performance.reduce((n, skill) => n + skill.answered, 0),
      })[0];
      if (first) {
        next = { source: 'recommendation', examLabel: label, title: first.title, because: first.because, href: first.href, action: first.actionLabel };
      }
    }

    for (const skill of performance) {
      if (!skill.hasSignal || skill.accuracy >= WEAK_ACCURACY) continue;
      weakSpots.push({
        kind: 'skill',
        examLabel: label,
        name: skill.skillLabel,
        scored: skill.answered + skill.omitted,
        correct: skill.correct,
        accuracy: skill.accuracy,
        href: `/practice/${config.examKey}?skill=${encodeURIComponent(skill.skillSlug)}`,
      });
    }
    for (const gap of readiness.gaps) {
      if (!gap.hasSignal || gap.accuracy >= WEAK_ACCURACY) continue;
      weakSpots.push({
        kind: 'topic',
        examLabel: label,
        name: gap.label,
        scored: gap.answered,
        correct: Math.round(gap.accuracy * gap.answered),
        accuracy: gap.accuracy,
        href: `/practice/${config.examKey}?domain=${encodeURIComponent(gap.domainSlug)}`,
      });
    }

    const examDate = target?.targetDate ?? plan?.examDate ?? null;
    exams.push({
      examKey: config.examKey,
      label,
      reasons: REASON_ORDER.filter((reason) => candidate.reasons.has(reason)),
      href: dashboardHref(config.examKey),
      practiseHref: `/practice/${config.examKey}`,
      scored: readiness.answeredTotal,
      correct,
      accuracy: readiness.answeredTotal >= MIN_ANSWERS_FOR_SIGNAL ? correct / readiness.answeredTotal : null,
      answersToSignal: Math.max(0, MIN_ANSWERS_FOR_SIGNAL - readiness.answeredTotal),
      band: readiness.overall,
      bandLabel: bandLabel(readiness.overall),
      topicsCovered: readiness.gaps.filter((gap) => gap.answered > 0).length,
      topicCount: config.domains.length,
      dueReview: due,
      examDate,
      daysToExam: examDate ? daysUntil(examDate, now, offset) : null,
      plan: planSummary,
    });
  }

  const latest = unfinished[0];
  const dueNow = [...review.values()].reduce((n, row) => n + row.dueNow, 0);
  const nextDueAt = [...review.values()].map((row) => row.nextDueAt).filter((at): at is string => !!at).sort()[0] ?? null;

  return {
    resume: latest
      ? {
          href: `/attempt/${latest.id}`,
          examLabel: examLabel(latest.examKey),
          question: latest.resumeQuestion,
          questionCount: latest.questionCount,
          others: unfinished.length - 1,
        }
      : null,
    next,
    exams,
    // Skills first where both read the same: a skill drill is the narrower fix.
    weakSpots: weakSpots
      .sort((a, b) => a.accuracy - b.accuracy || (a.kind === b.kind ? 0 : a.kind === 'skill' ? -1 : 1))
      .slice(0, MAX_WEAK_SPOTS),
    // Topics use readiness's COVERAGE_MIN_ANSWERS, the same number (tests/unit/study-panel.test.ts).
    weakRule: { minAnswers: MIN_ATTEMPTS_FOR_SIGNAL, below: WEAK_ACCURACY },
    mistakeLabels: (await labelSummary(db, user.id)).slice(0, 3).map(({ key, count }) => ({ key, count })),
    review: { dueNow, nextDueAt },
    activity: summariseActivity(
      await answerTimesSince(db, user.id, new Date(now.getTime() - (STREAK_LOOKBACK_DAYS + 1) * DAY_MS)),
      now,
      offset,
    ),
  };
}

export type RenderedStudyPanel = Omit<StudyPanel<string>, 'mistakeLabels'> & {
  mistakeLabels: Array<{ key: MistakeLabel; count: number; text: string }>;
};

/**
 * The panel with its sentences in the reader's language, for the browser:
 * `learning` renders the learning modules' messages, `results` names the
 * mistake labels as the notebook does.
 */
export function renderStudyPanel(panel: StudyPanel, t: { learning: Translate; results: Translate }): RenderedStudyPanel {
  const text = (value: LearnerText) => renderText(t.learning, value);
  return {
    ...panel,
    next: panel.next
      ? {
          ...panel.next,
          title: text(panel.next.title),
          because: panel.next.because === null ? null : text(panel.next.because),
          action: text(panel.next.action),
        }
      : null,
    exams: panel.exams.map((exam) => ({ ...exam, bandLabel: text(exam.bandLabel) })),
    mistakeLabels: panel.mistakeLabels.map((label) => ({ ...label, text: t.results(`mistakeLabels.${label.key}`) })),
  };
}
