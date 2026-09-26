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
 * Otherwise the attempt reopens at the furthest question the learner reached
 * in the open section. That is also where a learner who never moved was
 * standing: the question a section opens on is marked as reached, and so is
 * every question the learner moved to.
 */

export type ResumeReason = 'stored' | 'frontier';

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

  const frontier = Math.min(Math.max(0, state.furthestPosition), Math.max(0, state.itemCount - 1));
  return { partIndex, position: frontier, reason: 'frontier' };
}
