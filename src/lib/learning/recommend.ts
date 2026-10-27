import type { Db } from '@/lib/db';
import { requireExamConfig, labelsFor } from '@/lib/exams/registry';
import { msg, type Msg } from './text';

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

/** A skill with signal and a smaller share correct than this is suggested for drilling. */
export const WEAK_ACCURACY = 0.6;

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

export async function skillPerformance(db: Db, userId: string, examKey: string): Promise<SkillPerformance[]> {
  const config = requireExamConfig(examKey);
  const labels = labelsFor(config);

  const rows = (await db
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
         -- Retries ask questions already answered: practice, not new evidence (attempts/retry.ts).
         AND a.mode <> 'review'
       GROUP BY qv.skill_slug, qv.domain_slug`,
    )
    .all(userId, examKey)) as Array<{
    skillSlug: string;
    domainSlug: string;
    presented: number;
    answered: number;
    correct: number;
    omitted: number;
    lastSeenAt: string | null;
  }>;

  // Median time is computed separately: SQLite has no median aggregate.
  const times = (await db
    .prepare(
      `SELECT qv.skill_slug AS skillSlug, ai.time_ms AS timeMs
       FROM attempt_items ai
       JOIN attempts a           ON a.id = ai.attempt_id
       JOIN question_versions qv ON qv.id = ai.question_version_id
       WHERE a.user_id = ? AND a.exam_key = ? AND a.status IN ('submitted', 'expired') AND a.mode <> 'review'
         AND ai.time_ms > 0`,
    )
    .all(userId, examKey)) as Array<{ skillSlug: string; timeMs: number }>;

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
  title: Msg;
  /** Stated plainly so the learner can judge whether they agree. */
  because: Msg;
  href: string;
  actionLabel: Msg;
  priority: number;
  /** The skill or topic a drill targets, so callers need not parse the link. */
  skillSlug?: string;
  domainSlug?: string;
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
        title: msg('steps.getStarted.title'),
        because: msg('steps.getStarted.because'),
        href: `/practice/${examKey}`,
        actionLabel: msg('steps.getStarted.action'),
        priority: 0,
      },
    ];
  }

  if (input.dueReviewCount > 0) {
    recommendations.push({
      kind: 'due_review',
      title: msg('steps.dueReview.title', { count: input.dueReviewCount }),
      because: msg('steps.dueReview.because'),
      href: '/review',
      actionLabel: msg('steps.dueReview.action'),
      priority: 1,
    });
  }

  // Weakest skills that actually carry signal.
  const weak = input.performance
    .filter((skill) => skill.hasSignal && skill.accuracy < WEAK_ACCURACY)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  for (const [index, skill] of weak.entries()) {
    recommendations.push({
      kind: 'weak_skill',
      title: msg('steps.weakSkill.title', { skill: skill.skillLabel }),
      because: msg('steps.weakSkill.because', {
        count: skill.answered + skill.omitted,
        correct: skill.correct,
        accuracy: Math.round(skill.accuracy * 100) / 100,
      }),
      href: `/practice/${examKey}?skill=${encodeURIComponent(skill.skillSlug)}`,
      actionLabel: msg('steps.weakSkill.action'),
      priority: 2 + index,
      skillSlug: skill.skillSlug,
      domainSlug: skill.domainSlug,
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
      title: msg('steps.slowSkill.title', { skill: skill.skillLabel }),
      because: msg('steps.slowSkill.because', {
        accuracy: Math.round(skill.accuracy * 100) / 100,
        seconds: Math.round(skill.medianTimeMs / 1000),
      }),
      href: `/practice/${examKey}?skill=${encodeURIComponent(skill.skillSlug)}`,
      actionLabel: msg('steps.slowSkill.action'),
      priority: 6,
      skillSlug: skill.skillSlug,
      domainSlug: skill.domainSlug,
    });
  }

  // Domains never attempted.
  for (const [index, domain] of input.untouchedDomains.slice(0, 2).entries()) {
    recommendations.push({
      kind: 'untouched_domain',
      title: msg('steps.untouchedDomain.title', { topic: domain.name }),
      because: msg('steps.untouchedDomain.because'),
      href: `/practice/${examKey}?domain=${encodeURIComponent(domain.slug)}`,
      actionLabel: msg('steps.untouchedDomain.action'),
      priority: 7 + index,
      domainSlug: domain.slug,
    });
  }

  const noSignal = input.performance.filter((skill) => !skill.hasSignal).length;
  if (weak.length === 0 && noSignal > 0) {
    recommendations.push({
      kind: 'needs_more_data',
      title: msg('steps.needsMoreData.title'),
      because: msg('steps.needsMoreData.because', { count: noSignal, min: MIN_ATTEMPTS_FOR_SIGNAL }),
      href: `/practice/${examKey}`,
      actionLabel: msg('steps.needsMoreData.action'),
      priority: 9,
    });
  }

  return recommendations.sort((a, b) => a.priority - b.priority);
}
