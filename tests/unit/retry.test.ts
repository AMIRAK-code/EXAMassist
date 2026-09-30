import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import {
  AttemptError,
  getResult,
  recordResponse,
  startAttempt,
  startRetry,
  submitAttempt,
} from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { skillPerformance } from '@/lib/learning/recommend';
import { domainPerformance, recentAttemptAccuracies } from '@/lib/learning/queries';
import { buildDashboard } from '@/lib/learning/dashboard';
import { getResultsSummary } from '@/lib/learning/results';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * Retries and new-question practice (Phase 4). A retry is its own attempt: it
 * never touches the session it came from, uses only the current reviewed
 * version of each question, offers nothing withdrawn, and stays out of every
 * progress figure. "New questions only" is enforced when the session is built.
 */

const SAT = requireExamConfig('digital-sat');

let db: Db;
let alice: string;
let bob: string;

beforeEach(async () => {
  db = (await createTestDb());
  alice = (await createUser(db));
  bob = (await createUser(db));
  (await seedQuestions(db, SAT, { perDomain: 6 }));
});

/** A finished practice session; `wrong` positions are answered "b" (keys are "a"), the rest "a". */
async function finish(userId: string, wrong: number[], overrides: Record<string, unknown> = {}) {
  const { attemptId } = (await startAttempt(db, { userId, examKey: SAT.examKey, blueprintId: 'practice', overrides }));
  const items = (await db.prepare('SELECT position FROM attempt_items WHERE attempt_id = ? ORDER BY position').all(attemptId)) as Array<{ position: number }>;
  for (const { position } of items) {
    (await recordResponse(db, { attemptId, userId, partIndex: 0, position, response: { type: 'single_select', optionId: wrong.includes(position) ? 'b' : 'a' } }));
  }
  (await submitAttempt(db, { attemptId, userId }));
  return attemptId;
}

const questionsOf = async (attemptId: string) =>
  ((await db.prepare('SELECT question_id AS q, question_version_id AS v FROM attempt_items WHERE attempt_id = ? ORDER BY position').all(attemptId)) as Array<{ q: string; v: string }>);

/** Publishes a corrected version 2 of a question and makes it current. */
async function publishCorrection(questionId: string): Promise<string> {
  const current = (await db.prepare('SELECT * FROM question_versions WHERE question_id = ? ORDER BY version DESC LIMIT 1').get(questionId)) as Record<string, unknown>;
  const id = randomUUID();
  const columns = Object.keys(current);
  const values = columns.map((column) => (column === 'id' ? id : column === 'version' ? Number(current.version) + 1 : current[column]));
  (await db.prepare(`INSERT INTO question_versions (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`).run(...values));
  (await db.prepare('UPDATE questions SET current_version = current_version + 1 WHERE id = ?').run(questionId));
  return id;
}

describe('retrying missed questions', () => {
  it('creates a separate attempt and leaves the original session untouched', async () => {
    const source = (await finish(alice, [0, 1, 2]));
    const itemsBefore = (await db.prepare('SELECT * FROM attempt_items WHERE attempt_id = ? ORDER BY position').all(source));
    const resultBefore = (await getResult(db, source, alice));
    const missed = (await questionsOf(source)).slice(0, 3).map((row) => row.q);

    const retry = (await startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: missed, sourceAttemptId: source }));
    const row = (await db.prepare('SELECT mode, blueprint_id, status FROM attempts WHERE id = ?').get(retry.attemptId));
    expect(row).toEqual({ mode: 'review', blueprint_id: 'retry', status: 'in_progress' });
    expect((await questionsOf(retry.attemptId)).map((r) => r.q)).toEqual(missed);

    // Answer them all correctly and finish.
    for (let position = 0; position < 3; position += 1) {
      (await recordResponse(db, { attemptId: retry.attemptId, userId: alice, partIndex: 0, position, response: { type: 'single_select', optionId: 'a' } }));
    }
    (await submitAttempt(db, { attemptId: retry.attemptId, userId: alice }));

    expect((await db.prepare('SELECT * FROM attempt_items WHERE attempt_id = ? ORDER BY position').all(source))).toEqual(itemsBefore);
    expect((await getResult(db, source, alice))?.totals).toEqual(resultBefore?.totals);
    expect((await getResult(db, retry.attemptId, alice))?.totals.correct).toBe(3);
  });

  it('accepts only questions the learner missed, and never another learner’s', async () => {
    const source = (await finish(alice, [0]));
    const [missed, answeredRight] = (await questionsOf(source)).map((row) => row.q);
    const retry = (await startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: [missed, answeredRight, 'no-such-question'] }));
    expect(retry.questionIds).toEqual([missed]);

    // Bob never missed Alice's question, and cannot name her session as the source.
    (await expect(async () => (await startRetry(db, { userId: bob, examKey: SAT.examKey, questionIds: [missed] }))).rejects.toThrowError(
      expect.objectContaining({ code: 'nothing-to-retry' }),
    ));
    (await expect(async () => (await startRetry(db, { userId: bob, examKey: SAT.examKey, questionIds: [missed], sourceAttemptId: source }))).rejects.toThrowError(
      expect.objectContaining({ status: 404 }),
    ));
  });

  it('asks a corrected question in its current version, keeping the old one on the original attempt', async () => {
    const source = (await finish(alice, [0]));
    const [{ q: questionId, v: answeredVersion }] = (await questionsOf(source));
    const corrected = (await publishCorrection(questionId));

    const retry = (await startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: [questionId] }));
    expect((await questionsOf(retry.attemptId))[0].v).toBe(corrected);
    expect((await questionsOf(source))[0].v).toBe(answeredVersion);

    const summary = (await getResultsSummary(db, source, alice))!;
    expect(summary.items[0].correction).toBe('corrected');
  });

  it('does not offer a question that has been withdrawn or quarantined', async () => {
    const source = (await finish(alice, [0, 1]));
    const [first, second] = (await questionsOf(source)).map((row) => row.q);
    (await db.prepare("UPDATE questions SET state = 'quarantined' WHERE id = ?").run(first));

    const retry = (await startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: [first, second] }));
    expect(retry.questionIds).toEqual([second]);
    expect(retry.unavailable).toEqual([first]);
    expect((await getResultsSummary(db, source, alice))!.items[0].correction).toBe('unavailable');

    (await db.prepare("UPDATE questions SET state = 'quarantined' WHERE id = ?").run(second));
    try {
      (await startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: [first, second] }));
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(AttemptError);
      expect((error as AttemptError).code).toBe('nothing-to-retry');
    }
  });

  it('stays out of every progress figure, while the review schedule takes it into account', async () => {
    const source = (await finish(alice, [0, 1, 2, 3, 4]));
    const skillsBefore = (await skillPerformance(db, alice, SAT.examKey));
    const domainsBefore = [...(await domainPerformance(db, alice, SAT.examKey)).entries()];
    const accuraciesBefore = (await recentAttemptAccuracies(db, alice, SAT.examKey));
    const dashboardBefore = (await buildDashboard(db, { id: alice, isGuest: false, targetExamKey: null }, 'digital-sat')).exam!;

    const missed = (await questionsOf(source)).slice(0, 5).map((row) => row.q);
    const retry = (await startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: missed }));
    for (let position = 0; position < 5; position += 1) {
      (await recordResponse(db, { attemptId: retry.attemptId, userId: alice, partIndex: 0, position, response: { type: 'single_select', optionId: 'a' } }));
    }
    (await submitAttempt(db, { attemptId: retry.attemptId, userId: alice }));

    expect((await skillPerformance(db, alice, SAT.examKey))).toEqual(skillsBefore);
    expect([...(await domainPerformance(db, alice, SAT.examKey)).entries()]).toEqual(domainsBefore);
    expect((await recentAttemptAccuracies(db, alice, SAT.examKey))).toEqual(accuraciesBefore);
    const dashboard = (await buildDashboard(db, { id: alice, isGuest: false, targetExamKey: null }, 'digital-sat')).exam!;
    expect(dashboard.finishedCount).toBe(dashboardBefore.finishedCount);
    expect(dashboard.totalScored).toBe(dashboardBefore.totalScored);
    expect(dashboard.recent[0]).toMatchObject({ id: retry.attemptId, isRetry: true });

    // The schedule is what a retry is for: answered correctly, they move out.
    const results = (await db.prepare(`SELECT last_result FROM review_queue WHERE user_id = ? AND question_id IN (${missed.map(() => '?').join(',')})`).all(alice, ...missed)) as Array<{ last_result: string }>;
    expect(results.every((row) => row.last_result === 'correct')).toBe(true);
  });
});

describe('new questions only', () => {
  it('builds a session only from questions the learner has never been shown', async () => {
    const first = (await finish(alice, []));
    const seen = new Set((await questionsOf(first)).map((row) => row.q));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
      overrides: { unseenOnly: true, length: 10 },
    }));
    expect((await questionsOf(attemptId)).some((row) => seen.has(row.q))).toBe(false);
  });

  it('refuses rather than tops up with seen questions when too few are new', async () => {
    const skill = SAT.domains[0].skills[0].slug;
    (await finish(alice, [], { skills: [skill], length: 2 }));
    (await expect(async () =>
      (await startAttempt(db, {
        userId: alice,
        examKey: SAT.examKey,
        blueprintId: 'practice',
        overrides: { skills: [skill], unseenOnly: true, length: 2 },
      })),
    ).rejects.toThrowError(expect.objectContaining({ code: 'insufficient-content' })));
  });

  it('is ignored outside open practice: timed formats keep their own rules', async () => {
    (await finish(alice, []));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'timed-math-module-1',
      overrides: { unseenOnly: true },
    }));
    expect((await questionsOf(attemptId)).length).toBeGreaterThan(0);
  });
});
