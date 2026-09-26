import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import { startAttempt, submitAttempt, visitPosition } from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { continueStudying } from '@/lib/learning/continue';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/** The homepage's "Continue studying" line: only for a learner with something to continue. */

const SAT = requireExamConfig('digital-sat');

let db: Db;
let guest: string;
let other: string;

beforeEach(() => {
  db = createTestDb();
  guest = createUser(db, { isGuest: true });
  other = createUser(db);
  seedQuestions(db, SAT, { perDomain: 6 });
});

describe('continue studying', () => {
  it('is absent for an empty guest session, so the homepage stays the first-time one', () => {
    expect(continueStudying(db, guest)).toBeNull();
  });

  it('offers the latest unfinished attempt, at the question it reopens on', () => {
    const { attemptId } = startAttempt(db, { userId: guest, examKey: SAT.examKey, blueprintId: 'practice' });
    visitPosition(db, { attemptId, userId: guest, partIndex: 0, position: 6 });
    expect(continueStudying(db, guest)).toEqual({
      kind: 'unfinished',
      detail: 'Digital SAT, question 7 of 10',
      href: `/attempt/${attemptId}`,
      actionLabel: 'Continue',
    });
  });

  it('points to the dashboard when there is history but nothing unfinished', () => {
    const { attemptId } = startAttempt(db, { userId: guest, examKey: SAT.examKey, blueprintId: 'practice' });
    submitAttempt(db, { attemptId, userId: guest });
    expect(continueStudying(db, guest)).toMatchObject({ kind: 'history', href: '/dashboard?exam=digital-sat' });
  });

  it("never reflects another learner's attempts", () => {
    startAttempt(db, { userId: other, examKey: SAT.examKey, blueprintId: 'practice' });
    expect(continueStudying(db, guest)).toBeNull();
  });
});
