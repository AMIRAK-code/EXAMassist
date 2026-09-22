import type { Db } from '@/lib/db';
import { requireExamConfig, labelsFor } from '@/lib/exams/registry';

/**
 * Study recommendations.
 *
 * Every rule here is arithmetic a learner could do themselves, and the reason
 * is always shown next to the suggestion. We do NOT estimate ability, predict a
 * score, or claim any psychometric calibration: with the response volumes a
 * single learner produces, that would be invention dressed as analysis.
 */

/** Below this many answered questions, a skill figure is noise, and we say so. */
export const MIN_ATTEMPTS_FOR_SIGNAL = 4;

export interface SkillPerformance {
  skillSlug: string;
  skillLabel: string;
  domainSlug: string;
  domainLabel: string;
  answered: number;
  correct: number;
  omitted: number;
  accuracy: number;
  medianTimeMs: number;
  lastSeenAt: string | null;
  /** False when there are too few answers to read anything into the number. */
  hasSignal: boolean;
}

export function skillPerformance(db: Db, userId: string, examKey: string): SkillPerformance[] {
  const config = requireExamConfig(examKey);
  const labels = labelsFor(config);

  const rows = db
    .prepare(
      `SELECT
         qv.skill_slug                                            AS skillSlug,
         qv.domain_slug                                           AS domainSlug,
         COUNT(*)                                                 AS presented,
         SUM(CASE WHEN ai.response_status = 'answered' THEN 1 ELSE 0 END) AS answered,
         SUM(CASE WHEN ai.is_correct = 1 THEN 1 ELSE 0 END)       AS correct,
         SUM(CASE WHEN ai.response_status = 'unanswered' THEN 1 ELSE 0 END) AS omitted,
         MAX(ai.last_answered_at)                                 AS lastSeenAt
       FROM attempt_items ai
       JOIN attempts a          ON a.id = ai.attempt_id
       JOIN question_versions qv ON qv.id = ai.question_version_id
       WHERE a.user_id = ? AND a.exam_key = ? AND a.status IN ('submitted', 'expired')
       GROUP BY qv.skill_slug, qv.domain_slug`,
    )
    .all(userId, examKey) as Array<{
    skillSlug: string;
    domainSlug: string;
    presented: number;
    answered: number;
    correct: number;
    omitted: number;
    lastSeenAt: string | null;
  }>;

  // Median time is computed separately: SQLite has no median aggregate.
  const times = db
    .prepare(
      `SELECT qv.skill_slug AS skillSlug, ai.time_ms AS timeMs
       FROM attempt_items ai
       JOIN attempts a           ON a.id = ai.attempt_id
       JOIN question_versions qv ON qv.id = ai.question_version_id
       WHERE a.user_id = ? AND a.exam_key = ? AND ai.time_ms > 0`,
    )
    .all(userId, examKey) as Array<{ skillSlug: string; timeMs: number }>;

  const timesBySkill = new Map<string, number[]>();
  for (const row of times) {
    const bucket = timesBySkill.get(row.skillSlug);
    if (bucket) bucket.push(row.timeMs);
    else timesBySkill.set(row.skillSlug, [row.timeMs]);
  }

  return rows.map((row) => {
    const bucket = (timesBySkill.get(row.skillSlug) ?? []).sort((a, b) => a - b);
    const middle = Math.floor(bucket.length / 2);
    const medianTimeMs =
      bucket.length === 0
        ? 0
        : bucket.length % 2 === 0
          ? (bucket[middle - 1] + bucket[middle]) / 2
          : bucket[middle];

    const scored = row.answered + row.omitted;
    return {
      skillSlug: row.skillSlug,
      skillLabel: labels.skills[row.skillSlug] ?? row.skillSlug,
      domainSlug: row.domainSlug,
      domainLabel: labels.domains[row.domainSlug] ?? row.domainSlug,
      answered: row.answered,
      correct: row.correct,
      omitted: row.omitted,
      accuracy: scored > 0 ? row.correct / scored : 0,
      medianTimeMs,
      lastSeenAt: row.lastSeenAt,
      hasSignal: scored >= MIN_ATTEMPTS_FOR_SIGNAL,
    };
  });
}

// ---------------------------------------------------------------------------

export type RecommendationKind =
  | 'weak_skill'
  | 'untouched_domain'
  | 'slow_skill'
  | 'due_review'
  | 'get_started'
  | 'needs_more_data';

export interface Recommendation {
  kind: RecommendationKind;
  title: string;
  /** Stated plainly so the learner can judge whether they agree. */
  because: string;
  href: string;
  actionLabel: string;
  priority: number;
}

export interface RecommendationInput {
  examKey: string;
  performance: SkillPerformance[];
  untouchedDomains: Array<{ slug: string; name: string; count: number }>;
  dueReviewCount: number;
  totalAnswered: number;
}

export function buildRecommendations(input: RecommendationInput): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const { examKey } = input;

  if (input.totalAnswered === 0) {
    return [
      {
        kind: 'get_started',
        title: 'Take a short session to find your starting point',
        because:
          'You have not answered any questions for this exam yet, so there is nothing to base advice on.',
        href: `/practice/${examKey}`,
        actionLabel: 'Start practising',
        priority: 0,
      },
    ];
  }

  if (input.dueReviewCount > 0) {
    recommendations.push({
      kind: 'due_review',
      title: `Revisit ${input.dueReviewCount} question${input.dueReviewCount === 1 ? '' : 's'} you got wrong`,
      because:
        'Questions you missed come back after a short interval, which is when reviewing them is worth most.',
      href: '/review',
      actionLabel: 'Open mistake notebook',
      priority: 1,
    });
  }

  // Weakest skills that actually carry signal.
  const weak = input.performance
    .filter((skill) => skill.hasSignal && skill.accuracy < 0.6)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  for (const [index, skill] of weak.entries()) {
    recommendations.push({
      kind: 'weak_skill',
      title: `Drill ${skill.skillLabel}`,
      because: `You have answered ${skill.answered + skill.omitted} question${
        skill.answered + skill.omitted === 1 ? '' : 's'
      } tagged to this skill and got ${skill.correct} right (${Math.round(skill.accuracy * 100)}%).`,
      href: `/practice/${examKey}?skill=${encodeURIComponent(skill.skillSlug)}`,
      actionLabel: 'Practise this skill',
      priority: 2 + index,
    });
  }

  // Skills that are accurate but slow: a different problem with a different fix.
  const slow = input.performance
    .filter((skill) => skill.hasSignal && skill.accuracy >= 0.7 && skill.medianTimeMs > 120_000)
    .sort((a, b) => b.medianTimeMs - a.medianTimeMs)
    .slice(0, 1);

  for (const skill of slow) {
    recommendations.push({
      kind: 'slow_skill',
      title: `Work on pace in ${skill.skillLabel}`,
      because: `Your accuracy here is ${Math.round(skill.accuracy * 100)}%, but your median time is ${Math.round(
        skill.medianTimeMs / 1000,
      )} seconds a question. Accuracy is not the problem; speed is.`,
      href: `/practice/${examKey}?skill=${encodeURIComponent(skill.skillSlug)}`,
      actionLabel: 'Practise under time',
      priority: 6,
    });
  }

  // Domains never attempted.
  for (const [index, domain] of input.untouchedDomains.slice(0, 2).entries()) {
    recommendations.push({
      kind: 'untouched_domain',
      title: `Try ${domain.name}`,
      because: `You have not answered any questions in this topic yet, so there is a blind spot in your picture.`,
      href: `/practice/${examKey}?domain=${encodeURIComponent(domain.slug)}`,
      actionLabel: 'Practise this topic',
      priority: 7 + index,
    });
  }

  const noSignal = input.performance.filter((skill) => !skill.hasSignal).length;
  if (weak.length === 0 && noSignal > 0) {
    recommendations.push({
      kind: 'needs_more_data',
      title: 'Answer a few more questions before drawing conclusions',
      because: `${noSignal} of your skills have fewer than ${MIN_ATTEMPTS_FOR_SIGNAL} answers, which is too few to tell a weakness from a bad day.`,
      href: `/practice/${examKey}`,
      actionLabel: 'Practise more',
      priority: 9,
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
}

// ---------------------------------------------------------------------------
// Study plan
// ---------------------------------------------------------------------------

export interface StudyPlanInput {
  examKey: string;
  examName: string;
  targetDate: string | null;
  weeklyMinutes: number;
  performance: SkillPerformance[];
  untouchedDomains: Array<{ slug: string; name: string; count: number }>;
  now?: Date;
}

export interface StudyPlanWeek {
  weekNumber: number;
  startsOn: string;
  focusSkills: Array<{ slug: string; label: string; reason: string }>;
  sessions: Array<{ label: string; minutes: number; href: string }>;
  totalMinutes: number;
}

export interface StudyPlan {
  examKey: string;
  examName: string;
  targetDate: string | null;
  weeksAvailable: number | null;
  weeklyMinutes: number;
  weeks: StudyPlanWeek[];
  caveats: string[];
}

const SESSION_MINUTES = 25;

/**
 * Builds a plain, finite plan: how many weeks are left, what to work on each
 * week, and how many sessions that is. It does not promise a score outcome,
 * because nothing here could support that claim.
 */
export function buildStudyPlan(input: StudyPlanInput): StudyPlan {
  const now = input.now ?? new Date();
  const caveats: string[] = [];

  let weeksAvailable: number | null = null;
  if (input.targetDate) {
    const target = new Date(input.targetDate);
    const days = Math.ceil((target.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    weeksAvailable = Math.max(0, Math.ceil(days / 7));
  }

  const planWeeks = Math.min(weeksAvailable ?? 6, 8) || 1;
  const sessionsPerWeek = Math.max(1, Math.round(input.weeklyMinutes / SESSION_MINUTES));

  // Priority order: weakest with signal, then untouched, then everything else.
  const ranked = [...input.performance]
    .filter((skill) => skill.hasSignal)
    .sort((a, b) => a.accuracy - b.accuracy);

  const queue: Array<{ slug: string; label: string; reason: string }> = [
    ...ranked.map((skill) => ({
      slug: skill.skillSlug,
      label: skill.skillLabel,
      reason: `${Math.round(skill.accuracy * 100)}% correct so far`,
    })),
    ...input.untouchedDomains.map((domain) => ({
      slug: domain.slug,
      label: domain.name,
      reason: 'not attempted yet',
    })),
  ];

  if (queue.length === 0) {
    caveats.push(
      'This plan spreads practice evenly because there is not yet enough of your own answer history to prioritise.',
    );
  }

  const weeks: StudyPlanWeek[] = [];
  for (let weekIndex = 0; weekIndex < planWeeks; weekIndex += 1) {
    const startsOn = new Date(now.getTime() + weekIndex * 7 * 24 * 60 * 60 * 1000);
    const focus = queue.length > 0 ? [queue[weekIndex % queue.length], queue[(weekIndex + 1) % queue.length]] : [];
    const uniqueFocus = focus.filter(
      (item, index, all) => item && all.findIndex((other) => other?.slug === item.slug) === index,
    );

    const sessions = Array.from({ length: sessionsPerWeek }, (_, sessionIndex) => {
      const target = uniqueFocus[sessionIndex % Math.max(1, uniqueFocus.length)];
      return {
        label: target ? `Practise ${target.label}` : 'Mixed practice',
        minutes: SESSION_MINUTES,
        href: target
          ? `/practice/${input.examKey}?skill=${encodeURIComponent(target.slug)}`
          : `/practice/${input.examKey}`,
      };
    });

    weeks.push({
      weekNumber: weekIndex + 1,
      startsOn: startsOn.toISOString().slice(0, 10),
      focusSkills: uniqueFocus,
      sessions,
      totalMinutes: sessions.reduce((total, session) => total + session.minutes, 0),
    });
  }

  if (weeksAvailable !== null && weeksAvailable > 8) {
    caveats.push(
      `Your exam is ${weeksAvailable} weeks away. This plan covers the next 8 weeks and is regenerated as you practise.`,
    );
  }
  if (weeksAvailable !== null && weeksAvailable <= 1) {
    caveats.push('Your target date is within a week, so this plan is a short revision list rather than a study schedule.');
  }
  caveats.push(
    'This plan is arithmetic on your own practice history, not a prediction. It does not estimate a score or a probability of admission.',
  );

  return {
    examKey: input.examKey,
    examName: input.examName,
    targetDate: input.targetDate,
    weeksAvailable,
    weeklyMinutes: input.weeklyMinutes,
    weeks,
    caveats,
  };
}
