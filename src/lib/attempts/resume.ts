import { pageOf, type PartState } from '@/lib/assessment/navigation';
import type { NavigationPolicy } from '@/lib/assessment/types';

/**
 * Where an unfinished attempt reopens.
 *
 * The stored position (migration 004) is a hint, never a permission. It is used
 * only when the learner may be there now:
 *
 * - it is in the section that is currently open (a section that has since been
 *   submitted, or whose clock ran out, is closed for good);
 * - it is inside that section;
 * - on a section that does not allow going back, it is on the screen the
 *   learner has reached, because every earlier screen is committed.
 *
 * Otherwise the learner lands on the nearest permitted place: the screen they
 * had reached where movement is restricted, or the first unanswered question
 * where it is free.
 */

export type ResumeReason = 'stored' | 'frontier' | 'first-unanswered';

export interface ResumeDestination {
  partIndex: number;
  position: number;
  reason: ResumeReason;
}

export interface StoredPosition {
  partIndex: number | null;
  position: number | null;
}

/** Whether a learner may stand at `position` in an open section right now. */
export function mayStandAt(policy: NavigationPolicy, state: PartState, position: number): boolean {
  if (state.status !== 'in_progress') return false;
  if (!Number.isInteger(position) || position < 0 || position >= state.itemCount) return false;
  if (policy.allowBackWithinPart) return true;
  return pageOf(policy, position) === pageOf(policy, state.furthestPosition);
}

/** `state` must describe the attempt's current section. */
export function resolveResume(
  policy: NavigationPolicy,
  state: PartState,
  stored: StoredPosition,
): ResumeDestination {
  const partIndex = state.partIndex;

  if (
    stored.partIndex === partIndex &&
    stored.position !== null &&
    mayStandAt(policy, state, stored.position)
  ) {
    return { partIndex, position: stored.position, reason: 'stored' };
  }

  if (!policy.allowBackWithinPart) {
    return { partIndex, position: Math.min(state.furthestPosition, Math.max(0, state.itemCount - 1)), reason: 'frontier' };
  }

  for (let position = 0; position < state.itemCount; position += 1) {
    if (!state.answeredPositions.has(position)) return { partIndex, position, reason: 'first-unanswered' };
  }
  return { partIndex, position: Math.min(state.furthestPosition, Math.max(0, state.itemCount - 1)), reason: 'frontier' };
}
