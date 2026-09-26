import type { Blueprint, ExamConfig } from '@/lib/assessment/types';
import { getBlueprint } from '@/lib/exams/registry';

/**
 * Retrying questions a learner has missed.
 *
 * A retry is its own attempt, in the reserved `review` mode, so it has its own
 * answers, score and result, and the session the questions came from is never
 * touched. It is repeated-question practice, not new evidence: progress
 * figures (accuracy by topic, readiness, the study plan) leave it out, and
 * only the review schedule, which exists to bring missed questions back,
 * takes its answers into account.
 *
 * Retries are untimed and use the exam's open-practice navigation, with the
 * worked explanation available after each answer, as in topic practice.
 */

export const RETRY_BLUEPRINT_ID = 'retry';
/** The most questions one retry asks. */
export const MAX_RETRY_QUESTIONS = 20;

export function isRetryAttempt(attempt: { mode: string; blueprint_id?: string; blueprintId?: string }): boolean {
  return attempt.mode === 'review' && (attempt.blueprint_id ?? attempt.blueprintId) === RETRY_BLUEPRINT_ID;
}

/** The blueprint a retry runs under, built from the exam's own practice template. */
export function retryBlueprint(config: ExamConfig): Blueprint {
  const practice = getBlueprint(config, 'practice');
  if (!practice) throw new Error(`${config.examKey} has no practice blueprint to base a retry on`);
  return {
    ...practice,
    id: RETRY_BLUEPRINT_ID,
    label: 'Retry of questions you missed',
    mode: 'review',
    description: 'The questions you missed, asked again.',
    timing: 'untimed',
    overallTimeLimitSeconds: null,
    fidelity: 'practice_only',
    fidelityNote:
      'Questions you have answered before, asked again. A retry never changes the session they came from, and it is not counted in your accuracy by topic.',
  };
}

/** The blueprint behind an attempt, including a retry. */
export function blueprintForAttempt(config: ExamConfig, blueprintId: string): Blueprint | undefined {
  return blueprintId === RETRY_BLUEPRINT_ID ? retryBlueprint(config) : getBlueprint(config, blueprintId);
}
