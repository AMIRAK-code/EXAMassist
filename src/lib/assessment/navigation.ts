import type { NavigationPolicy } from './types';

/**
 * Navigation rules, enforced server-side.
 *
 * Restricted navigation is a defining feature of several of these exams (the
 * Bocconi test is strictly forward-only; the GMAT allows editing at most three
 * answers on a review screen). Enforcing it only in the UI would make the
 * simulation a lie, so every decision is made here and called from the API.
 */

export interface PartState {
  partIndex: number;
  status: 'pending' | 'in_progress' | 'submitted' | 'expired';
  /** Highest position the learner has reached in this part (0-based). */
  furthestPosition: number;
  /** Positions that already carry an answer. */
  answeredPositions: ReadonlySet<number>;
  /** How many answers have been changed after first being recorded. */
  editsUsed: number;
  /** How many questions are bookmarked/flagged in this part. */
  bookmarksUsed: number;
  itemCount: number;
  /** True once every question in the part has an answer (GMAT review gate). */
  reviewScreenReached: boolean;
}

export type Decision = { allowed: true } | { allowed: false; reason: string; code: string };

const allow: Decision = { allowed: true };
const deny = (code: string, reason: string): Decision => ({ allowed: false, code, reason });

export function resolvePolicy(
  base: NavigationPolicy,
  override: Partial<NavigationPolicy> | null | undefined,
): NavigationPolicy {
  return override ? { ...base, ...override } : base;
}

/**
 * Which screen a question sits on. With no pageSize every question is its own
 * screen, so page number equals position and all the rules below reduce to
 * per-question behaviour.
 */
export function pageOf(policy: NavigationPolicy, position: number): number {
  const size = policy.pageSize ?? 1;
  return Math.floor(position / size);
}

function positionsOnPage(policy: NavigationPolicy, page: number, itemCount: number): number[] {
  const size = policy.pageSize ?? 1;
  const start = page * size;
  const end = Math.min(start + size, itemCount);
  const positions: number[] = [];
  for (let p = start; p < end; p += 1) positions.push(p);
  return positions;
}

/** May the learner move to `targetPosition` within the current part? */
export function canNavigateTo(
  policy: NavigationPolicy,
  state: PartState,
  targetPosition: number,
): Decision {
  if (state.status === 'submitted') return deny('part-submitted', 'This part has already been submitted.');
  if (state.status === 'expired') return deny('part-expired', 'Time for this part has run out.');
  if (targetPosition < 0 || targetPosition >= state.itemCount) {
    return deny('out-of-range', 'That question is not part of this section.');
  }

  if (policy.allowBackWithinPart) return allow;

  const currentPage = pageOf(policy, state.furthestPosition);
  const targetPage = pageOf(policy, targetPosition);

  // Free movement among the questions shown together on the current screen.
  if (targetPage === currentPage) return allow;

  if (targetPage < currentPage) {
    return deny(
      'no-backward-navigation',
      policy.pageSize && policy.pageSize > 1
        ? 'Once you move on from a screen you cannot return to it.'
        : 'This exam presents questions in a fixed order and does not allow returning to an earlier question.',
    );
  }

  if (targetPage > currentPage + 1) {
    return deny('no-skip-ahead', 'You can only move forward one screen at a time on this exam.');
  }

  if (!policy.allowForwardSkip) {
    const unanswered = positionsOnPage(policy, currentPage, state.itemCount).filter(
      (p) => !state.answeredPositions.has(p),
    );
    if (unanswered.length > 0) {
      return deny('answer-required', 'Answer the current question before moving on.');
    }
  }

  return allow;
}

/** May the learner record or change an answer at `position`? */
export function canAnswerAt(
  policy: NavigationPolicy,
  state: PartState,
  position: number,
): Decision {
  if (state.status === 'submitted') return deny('part-submitted', 'This part has already been submitted.');
  if (state.status === 'expired') return deny('part-expired', 'Time for this part has run out.');
  if (position < 0 || position >= state.itemCount) {
    return deny('out-of-range', 'That question is not part of this section.');
  }

  const alreadyAnswered = state.answeredPositions.has(position);
  const onCommittedScreen =
    !policy.allowBackWithinPart && pageOf(policy, position) < pageOf(policy, state.furthestPosition);
  // The review screen only unlocks editing on exams whose review screen is
  // actually interactive. The Bocconi summary page is read-only.
  const reviewUnlocks = state.reviewScreenReached && policy.reviewScreenEditable === true;

  if (!alreadyAnswered) {
    // A first answer at a position behind the frontier still counts as a move
    // backwards on forward-only exams.
    if (onCommittedScreen && !reviewUnlocks) {
      return deny('no-backward-navigation', 'You cannot return to an earlier question on this exam.');
    }
    return allow;
  }

  if (onCommittedScreen && !reviewUnlocks) {
    return deny('no-backward-navigation', 'You cannot return to an earlier question on this exam.');
  }

  if (!policy.allowChangeAnswer && !reviewUnlocks) {
    return deny('answer-locked', 'Answers cannot be changed once recorded on this exam.');
  }

  // Review-screen edit budget (GMAT: at most three edits per section).
  if (policy.editLimitPerPart !== null && state.editsUsed >= policy.editLimitPerPart) {
    return deny(
      'edit-limit-reached',
      `You have used all ${policy.editLimitPerPart} answer edits available in this section.`,
    );
  }

  return allow;
}

export function canBookmark(policy: NavigationPolicy, state: PartState): Decision {
  if (!policy.allowFlagForReview) {
    return deny('bookmarks-unavailable', 'This exam does not offer marking questions for review.');
  }
  if (policy.bookmarkLimitPerPart !== null && state.bookmarksUsed >= policy.bookmarkLimitPerPart) {
    return deny(
      'bookmark-limit-reached',
      `You can mark at most ${policy.bookmarkLimitPerPart} questions in this section.`,
    );
  }
  return allow;
}

/**
 * May the learner open the end-of-part review screen? Some exams only offer it
 * once every question has an answer, and only while time remains.
 */
export function canOpenReviewScreen(policy: NavigationPolicy, state: PartState): Decision {
  if (!policy.reviewScreen) {
    return deny('no-review-screen', 'This exam does not provide a review screen.');
  }
  if (state.status !== 'in_progress') {
    return deny('part-not-active', 'This part is not currently open.');
  }
  // The GMAT only routes you to Question Review & Edit once every question in
  // the section has an answer. A read-only summary page (Bocconi) is shown
  // regardless, listing answered and omitted questions alike.
  if (policy.reviewScreenEditable === true && state.answeredPositions.size < state.itemCount) {
    return deny(
      'review-requires-completion',
      'The review screen opens once every question in this section has an answer.',
    );
  }
  return allow;
}

export function canReturnToPart(policy: NavigationPolicy, currentIndex: number, targetIndex: number): Decision {
  if (targetIndex === currentIndex) return allow;
  if (targetIndex < currentIndex && !policy.allowReturnToPreviousPart) {
    return deny('no-return-to-part', 'You cannot return to a section you have already completed.');
  }
  if (targetIndex > currentIndex) {
    return deny('no-skip-part', 'Sections must be taken in order.');
  }
  return allow;
}

/**
 * Human-readable summary of what a policy permits. Used to tell learners the
 * rules before they start, and in the results page provenance panel.
 */
export function describePolicy(policy: NavigationPolicy): string[] {
  const lines: string[] = [];
  lines.push(
    policy.allowBackWithinPart
      ? 'You can move backward and forward freely within a section.'
      : 'Questions are presented in a fixed order; you cannot go back.',
  );
  lines.push(
    policy.allowChangeAnswer
      ? 'You can change an answer before the section is submitted.'
      : 'An answer cannot be changed once recorded.',
  );
  if (policy.reviewScreen) {
    lines.push(
      policy.editLimitPerPart === null
        ? 'A review screen lists your answers at the end of the section.'
        : `A review screen at the end of the section lets you edit up to ${policy.editLimitPerPart} answers.`,
    );
  }
  if (policy.allowFlagForReview) {
    lines.push(
      policy.bookmarkLimitPerPart === null
        ? 'You can mark any question for review.'
        : `You can mark up to ${policy.bookmarkLimitPerPart} questions for review.`,
    );
  }
  lines.push(
    policy.allowReturnToPreviousPart
      ? 'You can return to earlier sections.'
      : 'Once a section is submitted it cannot be reopened.',
  );
  return lines;
}
