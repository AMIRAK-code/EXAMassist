import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import type { PartState } from '@/lib/assessment/navigation';
import type { NavigationPolicy } from '@/lib/assessment/types';
import { resolveResume } from '@/lib/attempts/resume';
import {
  AttemptError,
  RESUME_CLOCK_TOLERANCE_MS,
  getAttemptState,
  listUnfinishedAttempts,
  recordResponse,
  startAttempt,
  submitAttempt,
  visitPosition,
} from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * Resume position (Phase 3). The stored position is a hint: every write is
 * checked against ownership, the attempt's status, the open section and its
 * navigation rules, a late write never overwrites a newer one, and every read
 * checks the stored position again before the player may land there.
 */

const SAT = requireExamConfig('digital-sat');
const GMAT = requireExamConfig('gmat');
const BOCCONI = requireExamConfig('bocconi-undergraduate');

const FREE: NavigationPolicy = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  bookmarkLimitPerPart: null,
  reviewScreen: false,
  reviewScreenEditable: false,
  editLimitPerPart: null,
  allowReturnToPreviousPart: false,
  pageSize: null,
} as NavigationPolicy;
const SCREENS_OF_THREE: NavigationPolicy = { ...FREE, allowBackWithinPart: false, pageSize: 3 };

function partState(overrides: Partial<PartState> = {}): PartState {
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

const single = { type: 'single_select' as const, optionId: 'a' };

describe('choosing where an attempt reopens', () => {
  it('uses the stored position when the learner may stand there', () => {
    expect(resolveResume(FREE, partState({ furthestPosition: 6 }), { partIndex: 0, position: 4 })).toEqual({
      partIndex: 0,
      position: 4,
      reason: 'stored',
    });
  });

  it('ignores a position stored for a section that is no longer open', () => {
    const state = partState({ partIndex: 1, answeredPositions: new Set([0, 1]) });
    expect(resolveResume(FREE, state, { partIndex: 0, position: 7 })).toEqual({
      partIndex: 1,
      position: 2,
      reason: 'first-unanswered',
    });
  });

  it('ignores a position outside the section', () => {
    expect(resolveResume(FREE, partState(), { partIndex: 0, position: 10 }).reason).toBe('first-unanswered');
  });

  it('never reopens a committed screen on a forward-only section', () => {
    // Screens of three; the learner has reached position 7 (the third screen).
    const state = partState({ furthestPosition: 7, answeredPositions: new Set([0, 1, 2, 3, 4, 5]) });
    expect(resolveResume(SCREENS_OF_THREE, state, { partIndex: 0, position: 1 })).toEqual({
      partIndex: 0,
      position: 7,
      reason: 'frontier',
    });
    // Anywhere on the reached screen is fine.
    expect(resolveResume(SCREENS_OF_THREE, state, { partIndex: 0, position: 6 }).reason).toBe('stored');
  });

  it('lands on the frontier of a restricted section and the first gap of a free one', () => {
    const answered = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(resolveResume(FREE, partState({ furthestPosition: 9, answeredPositions: answered }), { partIndex: null, position: null })).toEqual({
      partIndex: 0,
      position: 9,
      reason: 'frontier',
    });
    expect(resolveResume(FREE, partState({ answeredPositions: new Set([0, 2]) }), { partIndex: null, position: null }).position).toBe(1);
  });
});

let db: Db;
let alice: string;
let bob: string;

beforeEach(() => {
  db = createTestDb();
  alice = createUser(db);
  bob = createUser(db);
});

function startSatPractice(userId = alice) {
  seedQuestions(db, SAT, { perDomain: 6 });
  return startAttempt(db, { userId, examKey: SAT.examKey, blueprintId: 'practice' }).attemptId;
}

describe('saving the position', () => {
  it('stores a move and reopens there', () => {
    const attemptId = startSatPractice();
    const result = visitPosition(db, { attemptId, userId: alice, partIndex: 0, position: 6, clock: Date.now() });
    expect(result).toEqual({ position: 6, recorded: true });
    expect(getAttemptState(db, attemptId, alice).resume).toEqual({ partIndex: 0, position: 6, reason: 'stored' });
  });

  it('does not let a late request overwrite a newer position', () => {
    const attemptId = startSatPractice();
    const now = Date.now();
    visitPosition(db, { attemptId, userId: alice, partIndex: 0, position: 7, clock: now });
    // An older move arriving afterwards (slow network, retry, second tab).
    const late = visitPosition(db, { attemptId, userId: alice, partIndex: 0, position: 2, clock: now - 500 });
    expect(late.recorded).toBe(false);
    // The same clock does not win either.
    expect(visitPosition(db, { attemptId, userId: alice, partIndex: 0, position: 3, clock: now }).recorded).toBe(false);
    expect(getAttemptState(db, attemptId, alice).resume?.position).toBe(7);
  });

  it('counts the move but does not store a clock running far ahead of the server', () => {
    const attemptId = startSatPractice();
    const now = new Date('2026-09-26T12:00:00.000Z');
    const ahead = visitPosition(db, {
      attemptId,
      userId: alice,
      partIndex: 0,
      position: 5,
      clock: now.getTime() + RESUME_CLOCK_TOLERANCE_MS + 1,
      now,
    });
    expect(ahead.recorded).toBe(false);
    const row = db.prepare('SELECT resume_position AS p FROM attempts WHERE id = ?').get(attemptId) as { p: number | null };
    expect(row.p).toBeNull();
    // Within tolerance is fine.
    expect(
      visitPosition(db, { attemptId, userId: alice, partIndex: 0, position: 5, clock: now.getTime() + 1000, now }).recorded,
    ).toBe(true);
  });

  it("refuses another learner's attempt as if it did not exist", () => {
    const attemptId = startSatPractice();
    try {
      visitPosition(db, { attemptId, userId: bob, partIndex: 0, position: 3, clock: Date.now() });
      expect.unreachable();
    } catch (error) {
      expect((error as AttemptError).status).toBe(404);
    }
    const row = db.prepare('SELECT resume_position AS p FROM attempts WHERE id = ?').get(attemptId) as { p: number | null };
    expect(row.p).toBeNull();
  });

  it('refuses a move in a finished attempt', () => {
    const attemptId = startSatPractice();
    submitAttempt(db, { attemptId, userId: alice });
    expect(() => visitPosition(db, { attemptId, userId: alice, partIndex: 0, position: 3 })).toThrowError(
      expect.objectContaining({ code: 'attempt-closed', status: 409 }),
    );
  });

  it('refuses a move in a section that has not opened', () => {
    seedQuestions(db, SAT, { perDomain: 6 });
    const { attemptId } = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'diagnostic' });
    expect(() => visitPosition(db, { attemptId, userId: alice, partIndex: 1, position: 0 })).toThrowError(
      expect.objectContaining({ code: 'wrong-part' }),
    );
    // Nothing in the pending section was marked as seen.
    const seen = db
      .prepare('SELECT COUNT(*) AS n FROM attempt_items WHERE attempt_id = ? AND part_index = 1 AND first_seen_at IS NOT NULL')
      .get(attemptId) as { n: number };
    expect(seen.n).toBe(0);
  });
});

describe('forward-only sections (Bocconi, screens of three)', () => {
  function startBocconi() {
    seedQuestions(db, BOCCONI, { perDomain: 20 });
    return startAttempt(db, { userId: alice, examKey: BOCCONI.examKey, blueprintId: 'timed-online-test' }).attemptId;
  }

  it('refuses to store a move back to a committed screen', () => {
    const attemptId = startBocconi();
    for (const position of [0, 1, 2]) recordResponse(db, { attemptId, userId: alice, partIndex: 0, position, response: single });
    visitPosition(db, { attemptId, userId: alice, partIndex: 0, position: 3, clock: Date.now() });
    expect(() => visitPosition(db, { attemptId, userId: alice, partIndex: 0, position: 1, clock: Date.now() + 10 })).toThrowError(
      expect.objectContaining({ code: 'no-backward-navigation' }),
    );
    expect(getAttemptState(db, attemptId, alice).resume).toEqual({ partIndex: 0, position: 3, reason: 'stored' });
  });

  it('reopens at the reached screen even if the stored position points at a committed one', () => {
    const attemptId = startBocconi();
    for (const position of [0, 1, 2]) recordResponse(db, { attemptId, userId: alice, partIndex: 0, position, response: single });
    visitPosition(db, { attemptId, userId: alice, partIndex: 0, position: 3, clock: Date.now() });
    // A stored value that no longer matches the rules, however it got there.
    db.prepare('UPDATE attempts SET resume_position = 0 WHERE id = ?').run(attemptId);
    expect(getAttemptState(db, attemptId, alice).resume).toEqual({ partIndex: 0, position: 3, reason: 'frontier' });
  });
});

describe('expiry', () => {
  it('moves the resume point to the next section when a timed section runs out', () => {
    seedQuestions(db, SAT, { perDomain: 6 });
    const started = new Date('2026-09-26T10:00:00.000Z');
    const { attemptId } = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'diagnostic', now: started });
    visitPosition(db, { attemptId, userId: alice, partIndex: 0, position: 3, clock: started.getTime() + 1000, now: new Date(started.getTime() + 1000) });

    // Well past the first module's clock.
    const later = new Date(started.getTime() + 60 * 60 * 1000 * 0.2);
    const state = getAttemptState(db, attemptId, alice, later);
    expect(state.parts[0].status).toBe('expired');
    expect(state.resume?.partIndex).toBe(state.currentPartIndex);
    expect(state.resume?.partIndex).toBeGreaterThan(0);
    expect(state.resume?.reason).toBe('first-unanswered');
  });

  it('closes an expired attempt before listing, so it is never offered to continue', () => {
    seedQuestions(db, SAT, { perDomain: 6 });
    const started = new Date('2026-09-26T10:00:00.000Z');
    const { attemptId } = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'timed-math-module-1', now: started });
    expect(listUnfinishedAttempts(db, alice, new Date(started.getTime() + 60_000)).map((a) => a.id)).toEqual([attemptId]);

    const afterDeadline = new Date(started.getTime() + 36 * 60 * 1000);
    expect(listUnfinishedAttempts(db, alice, afterDeadline)).toEqual([]);
    const row = db.prepare('SELECT status FROM attempts WHERE id = ?').get(attemptId) as { status: string };
    expect(row.status).toBe('expired');
  });
});

describe('listing unfinished attempts', () => {
  it('lists every exam, newest activity first, and only the learner’s own', () => {
    seedQuestions(db, SAT, { perDomain: 6 });
    seedQuestions(db, GMAT, { perDomain: 6 });
    const t0 = new Date('2026-09-26T09:00:00.000Z');
    const sat = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'practice', now: t0 }).attemptId;
    const gmat = startAttempt(db, { userId: alice, examKey: GMAT.examKey, blueprintId: 'practice', now: new Date(t0.getTime() + 1000) }).attemptId;
    startAttempt(db, { userId: bob, examKey: SAT.examKey, blueprintId: 'practice', now: t0 });

    // Alice last worked in the SAT session.
    visitPosition(db, { attemptId: sat, userId: alice, partIndex: 0, position: 4, now: new Date(t0.getTime() + 5000) });

    const list = listUnfinishedAttempts(db, alice, new Date(t0.getTime() + 6000));
    expect(list.map((a) => a.id)).toEqual([sat, gmat]);
    expect(list[0]).toMatchObject({ examKey: 'digital-sat', resumeQuestion: 5, questionCount: 10, resumeReason: 'stored' });
    expect(list[1]).toMatchObject({ examKey: 'gmat', resumeQuestion: 1, resumeReason: 'first-unanswered' });
    expect(listUnfinishedAttempts(db, bob).every((a) => a.examKey === 'digital-sat')).toBe(true);
  });
});
