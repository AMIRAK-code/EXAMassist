import type { Db } from '@/lib/db';
import type { ExamConfig } from '@/lib/assessment/types';
import { assessReadiness, type ReadinessAssessment } from './readiness';
import { skillPerformance } from './recommend';

/**
 * Database reads for the learning features.
 *
 * Every query filters on the acting user id. Nothing here takes an identifier
 * from a request and trusts it to name a person.
 */

export interface DomainRollup {
  correct: number;
  answered: number;
  omitted: number;
  medianTimeMs: number;
}

/**
 * Per-domain performance across a learner's finished attempts.
 *
 * `answered` counts questions they actually responded to and `omitted` those
 * they left blank. The distinction matters: on an exam with negative marking,
 * a blank and a wrong answer are different decisions with different costs.
 */
export function domainPerformance(db: Db, userId: string, examKey: string): Map<string, DomainRollup> {
  const rows = db
    .prepare(
      `SELECT
         qv.domain_slug                                                     AS domainSlug,
         SUM(CASE WHEN ai.is_correct = 1 THEN 1 ELSE 0 END)                 AS correct,
         SUM(CASE WHEN ai.response_status = 'answered' THEN 1 ELSE 0 END)   AS answered,
         SUM(CASE WHEN ai.response_status = 'unanswered' THEN 1 ELSE 0 END) AS omitted
       FROM attempt_items ai
       JOIN attempts a           ON a.id = ai.attempt_id
       JOIN question_versions qv ON qv.id = ai.question_version_id
       WHERE a.user_id = ? AND a.exam_key = ? AND a.status IN ('submitted', 'expired')
         -- Retries ask questions already answered: practice, not new evidence (attempts/retry.ts).
         AND a.mode <> 'review'
       GROUP BY qv.domain_slug`,
    )
    .all(userId, examKey) as Array<{
    domainSlug: string;
    correct: number;
    answered: number;
    omitted: number;
  }>;

  // Median time is computed in JS: SQLite has no median aggregate.
  const times = db
    .prepare(
      `SELECT qv.domain_slug AS domainSlug, ai.time_ms AS timeMs
       FROM attempt_items ai
       JOIN attempts a           ON a.id = ai.attempt_id
       JOIN question_versions qv ON qv.id = ai.question_version_id
       WHERE a.user_id = ? AND a.exam_key = ? AND ai.time_ms > 0
         AND a.status IN ('submitted', 'expired') AND a.mode <> 'review'`,
    )
    .all(userId, examKey) as Array<{ domainSlug: string; timeMs: number }>;

  const byDomainTimes = new Map<string, number[]>();
  for (const row of times) {
    const bucket = byDomainTimes.get(row.domainSlug);
    if (bucket) bucket.push(row.timeMs);
    else byDomainTimes.set(row.domainSlug, [row.timeMs]);
  }

  const result = new Map<string, DomainRollup>();
  for (const row of rows) {
    const bucket = (byDomainTimes.get(row.domainSlug) ?? []).sort((a, b) => a - b);
    const middle = Math.floor(bucket.length / 2);
    const medianTimeMs =
      bucket.length === 0
        ? 0
        : bucket.length % 2 === 0
          ? (bucket[middle - 1] + bucket[middle]) / 2
          : bucket[middle];

    result.set(row.domainSlug, {
      correct: row.correct,
      answered: row.answered,
      omitted: row.omitted,
      medianTimeMs,
    });
  }
  return result;
}

/** Accuracy of each finished attempt, oldest first, for the consistency signal. */
export function recentAttemptAccuracies(
  db: Db,
  userId: string,
  examKey: string,
  limit = 10,
): number[] {
  const rows = db
    .prepare(
      `SELECT r.accuracy AS accuracy
       FROM attempt_results r
       JOIN attempts a ON a.id = r.attempt_id
       WHERE a.user_id = ? AND a.exam_key = ? AND a.mode <> 'review'
       ORDER BY r.computed_at DESC
       LIMIT ?`,
    )
    .all(userId, examKey, limit) as Array<{ accuracy: number }>;
  return rows.map((row) => row.accuracy).reverse();
}

/**
 * Finished sessions, oldest first, with their accuracy and number of scored
 * answers, for the consistency signal (which uses only the longer ones).
 */
export function recentSessionScores(
  db: Db,
  userId: string,
  examKey: string,
  limit = 20,
): Array<{ accuracy: number; scored: number }> {
  const rows = db
    .prepare(
      `SELECT r.accuracy AS accuracy, r.raw_correct + r.raw_incorrect + r.raw_omitted AS scored
       FROM attempt_results r
       JOIN attempts a ON a.id = r.attempt_id
       WHERE a.user_id = ? AND a.exam_key = ? AND a.mode <> 'review'
       ORDER BY r.computed_at DESC
       LIMIT ?`,
    )
    .all(userId, examKey, limit) as Array<{ accuracy: number; scored: number }>;
  return rows.reverse();
}

/**
 * The time on each answered question in finished sessions (retries
 * excluded), for the pace signal. A blank question has no answer time, and
 * an answer saved without one is counted as missing rather than as zero.
 */
export function answerTimes(db: Db, userId: string, examKey: string): { timesMs: number[]; inUntimed: number; missing: number } {
  const rows = db
    .prepare(
      `SELECT ai.time_ms AS timeMs,
              CASE WHEN a.deadline_at IS NULL AND ap.time_limit_seconds IS NULL THEN 1 ELSE 0 END AS untimed
       FROM attempt_items ai
       JOIN attempts a ON a.id = ai.attempt_id
       LEFT JOIN attempt_parts ap ON ap.attempt_id = a.id AND ap.part_index = ai.part_index
       WHERE a.user_id = ? AND a.exam_key = ? AND a.status IN ('submitted', 'expired') AND a.mode <> 'review'
         AND ai.response_status = 'answered'`,
    )
    .all(userId, examKey) as Array<{ timeMs: number | null; untimed: number }>;
  const timesMs: number[] = [];
  let inUntimed = 0;
  let missing = 0;
  for (const row of rows) {
    if (!row.timeMs || row.timeMs <= 0) {
      missing += 1;
      continue;
    }
    timesMs.push(row.timeMs);
    if (row.untimed === 1) inUntimed += 1;
  }
  return { timesMs, inUntimed, missing };
}

export interface ExamTarget {
  examKey: string;
  targetScore: number | null;
  targetDate: string | null;
}

export function getExamTarget(db: Db, userId: string, examKey: string): ExamTarget | null {
  const row = db
    .prepare('SELECT exam_key, target_score, target_date FROM exam_targets WHERE user_id = ? AND exam_key = ?')
    .get(userId, examKey) as
    | { exam_key: string; target_score: number | null; target_date: string | null }
    | undefined;
  if (!row) return null;
  return { examKey: row.exam_key, targetScore: row.target_score, targetDate: row.target_date };
}

export function listExamTargets(db: Db, userId: string): ExamTarget[] {
  const rows = db
    .prepare('SELECT exam_key, target_score, target_date FROM exam_targets WHERE user_id = ?')
    .all(userId) as Array<{ exam_key: string; target_score: number | null; target_date: string | null }>;
  return rows.map((row) => ({
    examKey: row.exam_key,
    targetScore: row.target_score,
    targetDate: row.target_date,
  }));
}

/**
 * Saves the learner's goal. The date is the one exam date (migration 007).
 * A date kept from the old study plan for the learner to choose between
 * (legacy_plan_date) is settled only by a real choice: saving a different
 * date, or the kept one. Saving the goal with the date unchanged keeps the
 * question open.
 */
export function setExamTarget(
  db: Db,
  userId: string,
  examKey: string,
  targetScore: number | null,
  targetDate: string | null,
): void {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO exam_targets (user_id, exam_key, target_score, target_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, exam_key) DO UPDATE SET
       target_score = excluded.target_score,
       legacy_plan_date = CASE WHEN excluded.target_date IS exam_targets.target_date THEN exam_targets.legacy_plan_date ELSE NULL END,
       target_date  = excluded.target_date,
       updated_at   = excluded.updated_at`,
  ).run(userId, examKey, targetScore, targetDate, now, now);
}

/** Assembles everything the readiness assessment needs for one exam. */
export function buildReadiness(
  db: Db,
  userId: string,
  config: ExamConfig,
  targetScore: number | null,
): ReadinessAssessment {
  return assessReadiness({
    config,
    performance: skillPerformance(db, userId, config.examKey),
    byDomain: domainPerformance(db, userId, config.examKey),
    targetScore,
    recentSessions: recentSessionScores(db, userId, config.examKey),
    timing: answerTimes(db, userId, config.examKey),
  });
}
