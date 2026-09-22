import { describe, expect, it } from 'vitest';
import {
  canAnswerAt,
  pageOf,
  canBookmark,
  canNavigateTo,
  canOpenReviewScreen,
  canReturnToPart,
  describePolicy,
  resolvePolicy,
  type PartState,
} from '@/lib/assessment/navigation';
import type { NavigationPolicy } from '@/lib/assessment/types';

/** SAT / GRE / LSAT / ACT: free movement inside the section. */
const FREE: NavigationPolicy = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  allowReturnToPreviousPart: false,
  reviewScreen: true,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: 'https://example.invalid/free',
};

/** Verified Bocconi rule: strictly forward-only, three questions per screen. */
const FORWARD_ONLY: NavigationPolicy = {
  allowBackWithinPart: false,
  allowForwardSkip: false,
  allowChangeAnswer: false,
  allowFlagForReview: false,
  allowReturnToPreviousPart: false,
  reviewScreen: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: 'https://example.invalid/bocconi',
};

/** Verified GMAT rule: one question at a time, then edit up to three answers. */
const GMAT: NavigationPolicy = {
  allowBackWithinPart: false,
  allowForwardSkip: false,
  allowChangeAnswer: false,
  allowFlagForReview: true,
  allowReturnToPreviousPart: false,
  reviewScreen: true,
  reviewScreenEditable: true,
  bookmarkLimitPerPart: null,
  editLimitPerPart: 3,
  enforcement: 'server',
  source: 'https://example.invalid/gmat',
};

function state(overrides: Partial<PartState> = {}): PartState {
  return {
    partIndex: 0,
    status: 'in_progress',
    furthestPosition: 0,
    answeredPositions: new Set<number>(),
    editsUsed: 0,
    bookmarksUsed: 0,
    itemCount: 10,
    reviewScreenReached: false,
    ...overrides,
  };
}

describe('free navigation', () => {
  it('allows moving backward and forward', () => {
    const s = state({ furthestPosition: 5 });
    expect(canNavigateTo(FREE, s, 2).allowed).toBe(true);
    expect(canNavigateTo(FREE, s, 9).allowed).toBe(true);
  });

  it('still refuses positions outside the part', () => {
    const s = state({ furthestPosition: 5 });
    expect(canNavigateTo(FREE, s, -1)).toMatchObject({ allowed: false, code: 'out-of-range' });
    expect(canNavigateTo(FREE, s, 10)).toMatchObject({ allowed: false, code: 'out-of-range' });
  });

  it('allows changing an existing answer', () => {
    const s = state({ furthestPosition: 3, answeredPositions: new Set([0, 1, 2]) });
    expect(canAnswerAt(FREE, s, 1).allowed).toBe(true);
  });
});

describe('forward-only navigation (Bocconi)', () => {
  it('refuses to go back to an earlier question', () => {
    const s = state({ furthestPosition: 4, answeredPositions: new Set([0, 1, 2, 3]) });
    expect(canNavigateTo(FORWARD_ONLY, s, 3)).toMatchObject({
      allowed: false,
      code: 'no-backward-navigation',
    });
  });

  it('refuses to skip ahead past the next question', () => {
    const s = state({ furthestPosition: 2, answeredPositions: new Set([0, 1, 2]) });
    expect(canNavigateTo(FORWARD_ONLY, s, 5)).toMatchObject({ allowed: false, code: 'no-skip-ahead' });
  });

  it('requires the current question to be answered before advancing', () => {
    const s = state({ furthestPosition: 2, answeredPositions: new Set([0, 1]) });
    expect(canNavigateTo(FORWARD_ONLY, s, 3)).toMatchObject({ allowed: false, code: 'answer-required' });
  });

  it('allows the normal step forward once answered', () => {
    const s = state({ furthestPosition: 2, answeredPositions: new Set([0, 1, 2]) });
    expect(canNavigateTo(FORWARD_ONLY, s, 3).allowed).toBe(true);
  });

  it('locks an answer once recorded', () => {
    const s = state({ furthestPosition: 2, answeredPositions: new Set([0, 1, 2]) });
    expect(canAnswerAt(FORWARD_ONLY, s, 2)).toMatchObject({ allowed: false, code: 'answer-locked' });
  });

  it('refuses a first answer at an unanswered position already left behind', () => {
    // Position 1 was never answered, but the learner has moved past it.
    const s = state({ furthestPosition: 4, answeredPositions: new Set([0, 2, 3]) });
    expect(canAnswerAt(FORWARD_ONLY, s, 1)).toMatchObject({
      allowed: false,
      code: 'no-backward-navigation',
    });
  });

  it('refuses to change an answer on a screen already left behind', () => {
    const s = state({ furthestPosition: 4, answeredPositions: new Set([0, 1, 2, 3]) });
    expect(canAnswerAt(FORWARD_ONLY, s, 1)).toMatchObject({
      allowed: false,
      code: 'no-backward-navigation',
    });
  });

  it('offers no review screen', () => {
    expect(canOpenReviewScreen(FORWARD_ONLY, state())).toMatchObject({
      allowed: false,
      code: 'no-review-screen',
    });
  });

  it('offers no bookmarking', () => {
    expect(canBookmark(FORWARD_ONLY, state())).toMatchObject({
      allowed: false,
      code: 'bookmarks-unavailable',
    });
  });
});

describe('GMAT review and edit', () => {
  it('opens the review screen only when every question has an answer', () => {
    const incomplete = state({ itemCount: 3, answeredPositions: new Set([0, 1]) });
    expect(canOpenReviewScreen(GMAT, incomplete)).toMatchObject({
      allowed: false,
      code: 'review-requires-completion',
    });

    const complete = state({ itemCount: 3, answeredPositions: new Set([0, 1, 2]) });
    expect(canOpenReviewScreen(GMAT, complete).allowed).toBe(true);
  });

  it('allows edits once the review screen is reached', () => {
    const s = state({
      itemCount: 3,
      furthestPosition: 2,
      answeredPositions: new Set([0, 1, 2]),
      reviewScreenReached: true,
    });
    expect(canAnswerAt(GMAT, s, 0).allowed).toBe(true);
  });

  it('allows exactly three edits and no more', () => {
    const base = {
      itemCount: 3,
      furthestPosition: 2,
      answeredPositions: new Set([0, 1, 2]),
      reviewScreenReached: true,
    };
    expect(canAnswerAt(GMAT, state({ ...base, editsUsed: 2 }), 0).allowed).toBe(true);
    expect(canAnswerAt(GMAT, state({ ...base, editsUsed: 3 }), 0)).toMatchObject({
      allowed: false,
      code: 'edit-limit-reached',
    });
  });

  it('bookmarking is unlimited', () => {
    expect(canBookmark(GMAT, state({ bookmarksUsed: 99 })).allowed).toBe(true);
  });
});

describe('part-level rules', () => {
  it('rejects every action on a submitted part', () => {
    const s = state({ status: 'submitted' });
    expect(canNavigateTo(FREE, s, 1)).toMatchObject({ allowed: false, code: 'part-submitted' });
    expect(canAnswerAt(FREE, s, 1)).toMatchObject({ allowed: false, code: 'part-submitted' });
  });

  it('rejects every action on an expired part', () => {
    const s = state({ status: 'expired' });
    expect(canNavigateTo(FREE, s, 1)).toMatchObject({ allowed: false, code: 'part-expired' });
    expect(canAnswerAt(FREE, s, 1)).toMatchObject({ allowed: false, code: 'part-expired' });
  });

  it('refuses to reopen a completed section and refuses to skip one', () => {
    expect(canReturnToPart(FREE, 2, 1)).toMatchObject({ allowed: false, code: 'no-return-to-part' });
    expect(canReturnToPart(FREE, 1, 3)).toMatchObject({ allowed: false, code: 'no-skip-part' });
    expect(canReturnToPart(FREE, 1, 1).allowed).toBe(true);
  });

  it('allows returning when the exam permits it', () => {
    const permissive = { ...FREE, allowReturnToPreviousPart: true };
    expect(canReturnToPart(permissive, 2, 1).allowed).toBe(true);
  });
});

describe('policy composition', () => {
  it('applies a per-part override on top of the section policy', () => {
    const resolved = resolvePolicy(FREE, { allowBackWithinPart: false });
    expect(resolved.allowBackWithinPart).toBe(false);
    expect(resolved.allowFlagForReview).toBe(true);
  });

  it('returns the base policy when there is no override', () => {
    expect(resolvePolicy(FREE, null)).toEqual(FREE);
  });
});

describe('describePolicy', () => {
  it('tells a Bocconi candidate the rules that actually bind them', () => {
    const lines = describePolicy(FORWARD_ONLY).join(' ');
    expect(lines).toContain('cannot go back');
    expect(lines).toContain('cannot be changed');
  });

  it('states the GMAT edit budget as a number', () => {
    expect(describePolicy(GMAT).join(' ')).toContain('up to 3 answers');
  });
});

/**
 * The verified Bocconi rule: three questions per screen, free movement within
 * the screen, no return once "Next" is clicked, and a read-only summary page.
 * Source: AY 2027/28 Instructions and Rules of Conduct, sections 3.2 and 3.3.
 */
const BOCCONI: NavigationPolicy = {
  allowBackWithinPart: false,
  pageSize: 3,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: false,
  allowReturnToPreviousPart: false,
  reviewScreen: true,
  reviewScreenEditable: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: 'https://example.invalid/bocconi-2728',
};

describe('Bocconi three-questions-per-screen navigation', () => {
  it('allows free movement among the three questions on the current screen', () => {
    const s = state({ itemCount: 50, furthestPosition: 4 });
    // Positions 3, 4 and 5 share screen 2 (0-indexed page 1).
    expect(canNavigateTo(BOCCONI, s, 3).allowed).toBe(true);
    expect(canNavigateTo(BOCCONI, s, 5).allowed).toBe(true);
  });

  it('allows editing any answer on the current screen', () => {
    const s = state({ itemCount: 50, furthestPosition: 4, answeredPositions: new Set([3, 4]) });
    expect(canAnswerAt(BOCCONI, s, 3).allowed).toBe(true);
    expect(canAnswerAt(BOCCONI, s, 4).allowed).toBe(true);
  });

  it('refuses to return to a screen that has been committed', () => {
    const s = state({ itemCount: 50, furthestPosition: 4, answeredPositions: new Set([0, 1, 2]) });
    expect(canNavigateTo(BOCCONI, s, 2)).toMatchObject({
      allowed: false,
      code: 'no-backward-navigation',
    });
    expect(canAnswerAt(BOCCONI, s, 2)).toMatchObject({
      allowed: false,
      code: 'no-backward-navigation',
    });
  });

  it('allows advancing to the next screen with questions left blank', () => {
    const s = state({ itemCount: 50, furthestPosition: 4, answeredPositions: new Set([3]) });
    expect(canNavigateTo(BOCCONI, s, 6).allowed).toBe(true);
  });

  it('refuses to jump more than one screen ahead', () => {
    const s = state({ itemCount: 50, furthestPosition: 4 });
    expect(canNavigateTo(BOCCONI, s, 9)).toMatchObject({ allowed: false, code: 'no-skip-ahead' });
  });

  it('shows the read-only summary page even with omitted questions', () => {
    const s = state({ itemCount: 50, furthestPosition: 49, answeredPositions: new Set([0, 1]) });
    expect(canOpenReviewScreen(BOCCONI, s).allowed).toBe(true);
  });

  it('does NOT let the summary page unlock editing of a committed screen', () => {
    const s = state({
      itemCount: 50,
      furthestPosition: 49,
      answeredPositions: new Set([0, 1]),
      reviewScreenReached: true,
    });
    expect(canAnswerAt(BOCCONI, s, 0)).toMatchObject({
      allowed: false,
      code: 'no-backward-navigation',
    });
  });

  it('maps positions to screens of three', () => {
    expect(pageOf(BOCCONI, 0)).toBe(0);
    expect(pageOf(BOCCONI, 2)).toBe(0);
    expect(pageOf(BOCCONI, 3)).toBe(1);
    expect(pageOf(BOCCONI, 49)).toBe(16);
  });

  it('treats a policy without pageSize as one question per screen', () => {
    expect(pageOf(FORWARD_ONLY, 7)).toBe(7);
  });
});
