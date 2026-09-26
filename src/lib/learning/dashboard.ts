import type { Db } from '@/lib/db';
import type { AuthUser } from '@/lib/auth/session';
import { EXAM_CONFIGS, getExamConfig, getHubForConfig, requireExamConfig } from '@/lib/exams/registry';
import { practiceFacets, practisableDomains } from '@/lib/attempts/availability';
import { eligibleCount } from '@/lib/attempts/facets';
import { listUnfinishedAttempts, type UnfinishedAttempt } from '@/lib/attempts/service';
import {
  MIN_ATTEMPTS_FOR_SIGNAL,
  buildRecommendations,
  skillPerformance,
  type Recommendation,
} from './recommend';

/**
 * The learner's dashboard, as data.
 *
 * Everything is read for one learner only: every query filters on the user id,
 * and the exam named in the address only chooses which of their own records
 * are shown. Viewing an exam never changes the learner's target.
 */

/** A drill on a skill with fewer reviewed questions than this is a short one. */
export const SHORT_DRILL_BELOW = 5;
/** A guest is warned this many days before the session that holds their practice ends. */
export const GUEST_WARNING_DAYS = 2;

export type ExamSource = 'address' | 'target' | 'recent';

export interface ExamChoice {
  examKey: string;
  name: string;
  label: string;
  href: string;
  current: boolean;
  target: boolean;
  practised: boolean;
}

export interface NextStep extends Recommendation {
  /**
   * A broader option, offered next to a skill drill the bank can fill only
   * with a few questions. The drill itself is never widened behind the
   * learner's back.
   */
  broader: { label: string; href: string; because: string } | null;
}

export interface SkillRow {
  slug: string;
  name: string;
  reviewed: number;
  scored: number;
  correct: number;
  hasSignal: boolean;
  accuracy: number | null;
}

export interface TopicRow {
  slug: string;
  name: string;
  reviewed: number;
  scored: number;
  correct: number;
  hasSignal: boolean;
  accuracy: number | null;
  practiseHref: string | null;
  skills: SkillRow[];
}

export interface FinishedSession {
  id: string;
  label: string;
  status: 'submitted' | 'expired' | 'abandoned';
  finishedAt: string;
  correct: number | null;
  incorrect: number | null;
  omitted: number | null;
}

export interface ExamDashboard {
  examKey: string;
  name: string;
  shortName: string;
  publisher: string;
  source: ExamSource;
  formatGuideHref: string | null;
  bankSize: number;
  finishedCount: number;
  totalScored: number;
  totalCorrect: number;
  review: { dueNow: number; comingLater: number; nextDueAt: string | null };
  next: NextStep | null;
  others: NextStep[];
  topics: TopicRow[];
  recent: FinishedSession[];
  unfinishedHere: UnfinishedAttempt[];
}

export interface DashboardData {
  unfinished: UnfinishedAttempt[];
  /** The address named an exam that is not offered; it is ignored, and said so. */
  unknownExam: string | null;
  choices: ExamChoice[];
  exam: ExamDashboard | null;
  guest: { expiresAt: string; expiringSoon: boolean } | null;
}

function firstValue(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : null;
}

/** Which exam the dashboard shows: the address, then the target, then the latest practice. */
export function chooseExam(
  requested: string | string[] | undefined,
  targetExamKey: string | null,
  mostRecentExamKey: string | null,
): { examKey: string | null; source: ExamSource | null; unknownExam: string | null } {
  const asked = firstValue(requested);
  if (asked && getExamConfig(asked)) return { examKey: asked, source: 'address', unknownExam: null };
  const unknownExam = asked ? asked.slice(0, 64) : null;
  if (targetExamKey && getExamConfig(targetExamKey)) return { examKey: targetExamKey, source: 'target', unknownExam };
  if (mostRecentExamKey && getExamConfig(mostRecentExamKey)) {
    return { examKey: mostRecentExamKey, source: 'recent', unknownExam };
  }
  return { examKey: null, source: null, unknownExam };
}

export function dashboardHref(examKey: string): string {
  return `/dashboard?exam=${encodeURIComponent(examKey)}`;
}

/**
 * The name a learner knows an exam by: its hub's name, with the variant where
 * one hub offers two tests. Config names are versioned and not edited for copy.
 */
export function examDisplayName(examKey: string): string {
  const hub = getHubForConfig(examKey);
  const variant = hub?.variantLabels?.[examKey];
  if (hub && variant) return `${hub.name}: ${variant}`;
  return hub?.name ?? requireExamConfig(examKey).name;
}

/** The short name used on selectors: "SAT", "Bocconi Law". */
export function examLabel(examKey: string): string {
  const hub = getHubForConfig(examKey);
  const variant = hub?.variantLabels?.[examKey];
  if (hub && variant) return `${hub.label} ${variant}`;
  return hub?.label ?? requireExamConfig(examKey).shortName;
}

function examsPractised(db: Db, userId: string): string[] {
  return (
    db
      .prepare(
        `SELECT exam_key AS examKey, MAX(created_at) AS latest
           FROM attempts WHERE user_id = ? GROUP BY exam_key ORDER BY latest DESC`,
      )
      .all(userId) as Array<{ examKey: string }>
  ).map((row) => row.examKey);
}

function reviewCounts(db: Db, userId: string, examKey: string, now: Date) {
  const iso = now.toISOString();
  const row = db
    .prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN due_at <= ? THEN 1 ELSE 0 END), 0) AS dueNow,
         COALESCE(SUM(CASE WHEN due_at >  ? THEN 1 ELSE 0 END), 0) AS comingLater,
         MIN(CASE WHEN due_at > ? THEN due_at END)                 AS nextDueAt
       FROM review_queue
       WHERE user_id = ? AND exam_key = ? AND last_result <> 'correct'`,
    )
    .get(iso, iso, iso, userId, examKey) as { dueNow: number; comingLater: number; nextDueAt: string | null };
  return row;
}

function buildExamDashboard(
  db: Db,
  userId: string,
  examKey: string,
  source: ExamSource,
  unfinished: UnfinishedAttempt[],
  now: Date,
): ExamDashboard {
  const config = requireExamConfig(examKey);
  const hub = getHubForConfig(examKey);
  const facets = practiceFacets(db, config);
  const bankSize = eligibleCount(facets, {});

  const finishedRows = db
    .prepare(
      `SELECT a.id, a.blueprint_id AS blueprintId, a.status, a.started_at AS startedAt,
              a.submitted_at AS submittedAt, r.raw_correct AS correct, r.raw_incorrect AS incorrect,
              r.raw_omitted AS omitted
         FROM attempts a
         LEFT JOIN attempt_results r ON r.attempt_id = a.id
        WHERE a.user_id = ? AND a.exam_key = ? AND a.status <> 'in_progress'
        ORDER BY COALESCE(a.submitted_at, a.started_at) DESC`,
    )
    .all(userId, examKey) as Array<{
    id: string;
    blueprintId: string;
    status: FinishedSession['status'];
    startedAt: string;
    submittedAt: string | null;
    correct: number | null;
    incorrect: number | null;
    omitted: number | null;
  }>;

  const performance = skillPerformance(db, userId, examKey);
  const bySkill = new Map(performance.map((skill) => [skill.skillSlug, skill]));
  const totalScored = performance.reduce((n, skill) => n + skill.answered + skill.omitted, 0);
  const totalCorrect = performance.reduce((n, skill) => n + skill.correct, 0);
  const totalAnswered = performance.reduce((n, skill) => n + skill.answered, 0);

  const topics: TopicRow[] = config.domains.map((domain) => {
    const skills: SkillRow[] = domain.skills.map((skill) => {
      const seen = bySkill.get(skill.slug);
      const scored = seen ? seen.answered + seen.omitted : 0;
      return {
        slug: skill.slug,
        name: skill.name,
        reviewed: eligibleCount(facets, { skill: skill.slug }),
        scored,
        correct: seen?.correct ?? 0,
        hasSignal: scored >= MIN_ATTEMPTS_FOR_SIGNAL,
        accuracy: scored >= MIN_ATTEMPTS_FOR_SIGNAL ? (seen?.correct ?? 0) / scored : null,
      };
    });
    const scored = skills.reduce((n, skill) => n + skill.scored, 0);
    const correct = skills.reduce((n, skill) => n + skill.correct, 0);
    const reviewed = eligibleCount(facets, { domain: domain.slug });
    return {
      slug: domain.slug,
      name: domain.name,
      reviewed,
      scored,
      correct,
      hasSignal: scored >= MIN_ATTEMPTS_FOR_SIGNAL,
      accuracy: scored >= MIN_ATTEMPTS_FOR_SIGNAL ? correct / scored : null,
      practiseHref: reviewed > 0 ? `/practice/${examKey}?domain=${encodeURIComponent(domain.slug)}` : null,
      skills,
    };
  });

  const attemptedDomains = new Set(topics.filter((topic) => topic.scored > 0).map((topic) => topic.slug));
  const untouchedDomains = practisableDomains(db, config)
    .filter((domain) => !attemptedDomains.has(domain.slug))
    .map((domain) => ({ slug: domain.slug, name: domain.name, count: domain.count }));

  const review = reviewCounts(db, userId, examKey, now);
  const recommendations = bankSize === 0
    ? []
    : buildRecommendations({
        examKey,
        performance,
        untouchedDomains,
        dueReviewCount: review.dueNow,
        totalAnswered,
      });

  const steps: NextStep[] = recommendations.map((recommendation) => {
    const skillSlug = recommendation.skillSlug;
    if (!skillSlug) return { ...recommendation, broader: null };
    const skill = bySkill.get(skillSlug);
    const inSkill = eligibleCount(facets, { skill: skillSlug });
    const inTopic = skill ? eligibleCount(facets, { domain: skill.domainSlug }) : 0;
    if (!skill || inSkill >= SHORT_DRILL_BELOW || inTopic <= inSkill) return { ...recommendation, broader: null };
    return {
      ...recommendation,
      broader: {
        label: `Practise all of ${skill.domainLabel}`,
        href: `/practice/${examKey}?domain=${encodeURIComponent(skill.domainSlug)}`,
        because: `This skill has ${inSkill} reviewed question${inSkill === 1 ? '' : 's'}, so the drill is short; its topic has ${inTopic}.`,
      },
    };
  });

  const blueprintLabel = (id: string) => config.blueprints.find((b) => b.id === id)?.label ?? id;

  return {
    examKey,
    name: examDisplayName(examKey),
    shortName: config.shortName,
    publisher: config.publisher,
    source,
    formatGuideHref: hub ? `/exams/${hub.slug}/format` : null,
    bankSize,
    finishedCount: finishedRows.length,
    totalScored,
    totalCorrect,
    review,
    next: steps[0] ?? null,
    others: steps.slice(1),
    topics,
    recent: finishedRows.slice(0, 5).map((row) => ({
      id: row.id,
      label: blueprintLabel(row.blueprintId),
      status: row.status,
      finishedAt: row.submittedAt ?? row.startedAt,
      correct: row.correct,
      incorrect: row.incorrect,
      omitted: row.omitted,
    })),
    unfinishedHere: unfinished.filter((attempt) => attempt.examKey === examKey),
  };
}

export function buildDashboard(
  db: Db,
  user: Pick<AuthUser, 'id' | 'isGuest' | 'targetExamKey' | 'sessionExpiresAt'>,
  requested: string | string[] | undefined,
  now = new Date(),
): DashboardData {
  // Closes anything past its deadline before anything else is read.
  const unfinished = listUnfinishedAttempts(db, user.id, now);
  const practised = examsPractised(db, user.id);
  const { examKey, source, unknownExam } = chooseExam(requested, user.targetExamKey, practised[0] ?? null);

  const choices: ExamChoice[] = EXAM_CONFIGS.filter(
    (config) =>
      practised.includes(config.examKey) || config.examKey === user.targetExamKey || config.examKey === examKey,
  ).map((config) => ({
    examKey: config.examKey,
    name: config.name,
    label: examLabel(config.examKey),
    href: dashboardHref(config.examKey),
    current: config.examKey === examKey,
    target: config.examKey === user.targetExamKey,
    practised: practised.includes(config.examKey),
  }));

  let guest: DashboardData['guest'] = null;
  if (user.isGuest && user.sessionExpiresAt) {
    const msLeft = new Date(user.sessionExpiresAt).getTime() - now.getTime();
    guest = { expiresAt: user.sessionExpiresAt, expiringSoon: msLeft <= GUEST_WARNING_DAYS * 24 * 60 * 60 * 1000 };
  }

  return {
    unfinished,
    unknownExam,
    choices,
    exam: examKey && source ? buildExamDashboard(db, user.id, examKey, source, unfinished, now) : null,
    guest,
  };
}
