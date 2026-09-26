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

beforeEach(() => {
  db = createTestDb();
  alice = createUser(db);
  bob = createUser(db);
  seedQuestions(db, SAT, { perDomain: 6 });
});

/** A finished practice session; `wrong` positions are answered "b" (keys are "a"), the rest "a". */
function finish(userId: string, wrong: number[], overrides: Record<string, unknown> = {}) {
  const { attemptId } = startAttempt(db, { userId, examKey: SAT.examKey, blueprintId: 'practice', overrides });
  const items = db.prepare('SELECT position FROM attempt_items WHERE attempt_id = ? ORDER BY position').all(attemptId) as Array<{ position: number }>;
  for (const { position } of items) {
    recordResponse(db, { attemptId, userId, partIndex: 0, position, response: { type: 'single_select', optionId: wrong.includes(position) ? 'b' : 'a' } });
  }
  submitAttempt(db, { attemptId, userId });
  return attemptId;
}

const questionsOf = (attemptId: string) =>
  (db.prepare('SELECT question_id AS q, question_version_id AS v FROM attempt_items WHERE attempt_id = ? ORDER BY position').all(attemptId) as Array<{ q: string; v: string }>);

/** Publishes a corrected version 2 of a question and makes it current. */
function publishCorrection(questionId: string): string {
  const current = db.prepare('SELECT * FROM question_versions WHERE question_id = ? ORDER BY version DESC LIMIT 1').get(questionId) as Record<string, unknown>;
  const id = randomUUID();
  const columns = Object.keys(current);
  const values = columns.map((column) => (column === 'id' ? id : column === 'version' ? Number(current.version) + 1 : current[column]));
  db.prepare(`INSERT INTO question_versions (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`).run(...values);
  db.prepare('UPDATE questions SET current_version = current_version + 1 WHERE id = ?').run(questionId);
  return id;
}

describe('retrying missed questions', () => {
  it('creates a separate attempt and leaves the original session untouched', () => {
    const source = finish(alice, [0, 1, 2]);
    const itemsBefore = db.prepare('SELECT * FROM attempt_items WHERE attempt_id = ? ORDER BY position').all(source);
    const resultBefore = getResult(db, source, alice);
    const missed = questionsOf(source).slice(0, 3).map((row) => row.q);

    const retry = startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: missed, sourceAttemptId: source });
    const row = db.prepare('SELECT mode, blueprint_id, status FROM attempts WHERE id = ?').get(retry.attemptId);
    expect(row).toEqual({ mode: 'review', blueprint_id: 'retry', status: 'in_progress' });
    expect(questionsOf(retry.attemptId).map((r) => r.q)).toEqual(missed);

    // Answer them all correctly and finish.
    for (let position = 0; position < 3; position += 1) {
      recordResponse(db, { attemptId: retry.attemptId, userId: alice, partIndex: 0, position, response: { type: 'single_select', optionId: 'a' } });
    }
    submitAttempt(db, { attemptId: retry.attemptId, userId: alice });

    expect(db.prepare('SELECT * FROM attempt_items WHERE attempt_id = ? ORDER BY position').all(source)).toEqual(itemsBefore);
    expect(getResult(db, source, alice)?.totals).toEqual(resultBefore?.totals);
    expect(getResult(db, retry.attemptId, alice)?.totals.correct).toBe(3);
  });

  it('accepts only questions the learner missed, and never another learner’s', () => {
    const source = finish(alice, [0]);
    const [missed, answeredRight] = questionsOf(source).map((row) => row.q);
    const retry = startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: [missed, answeredRight, 'no-such-question'] });
    expect(retry.questionIds).toEqual([missed]);

    // Bob never missed Alice's question, and cannot name her session as the source.
    expect(() => startRetry(db, { userId: bob, examKey: SAT.examKey, questionIds: [missed] })).toThrowError(
      expect.objectContaining({ code: 'nothing-to-retry' }),
    );
    expect(() => startRetry(db, { userId: bob, examKey: SAT.examKey, questionIds: [missed], sourceAttemptId: source })).toThrowError(
      expect.objectContaining({ status: 404 }),
    );
  });

  it('asks a corrected question in its current version, keeping the old one on the original attempt', () => {
    const source = finish(alice, [0]);
    const [{ q: questionId, v: answeredVersion }] = questionsOf(source);
    const corrected = publishCorrection(questionId);

    const retry = startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: [questionId] });
    expect(questionsOf(retry.attemptId)[0].v).toBe(corrected);
    expect(questionsOf(source)[0].v).toBe(answeredVersion);

    const summary = getResultsSummary(db, source, alice)!;
    expect(summary.items[0].correction).toBe('corrected');
  });

  it('does not offer a question that has been withdrawn or quarantined', () => {
    const source = finish(alice, [0, 1]);
    const [first, second] = questionsOf(source).map((row) => row.q);
    db.prepare("UPDATE questions SET state = 'quarantined' WHERE id = ?").run(first);

    const retry = startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: [first, second] });
    expect(retry.questionIds).toEqual([second]);
    expect(retry.unavailable).toEqual([first]);
    expect(getResultsSummary(db, source, alice)!.items[0].correction).toBe('unavailable');

    db.prepare("UPDATE questions SET state = 'quarantined' WHERE id = ?").run(second);
    try {
      startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: [first, second] });
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(AttemptError);
      expect((error as AttemptError).code).toBe('nothing-to-retry');
    }
  });

  it('stays out of every progress figure, while the review schedule takes it into account', () => {
    const source = finish(alice, [0, 1, 2, 3, 4]);
    const skillsBefore = skillPerformance(db, alice, SAT.examKey);
    const domainsBefore = [...domainPerformance(db, alice, SAT.examKey).entries()];
    const accuraciesBefore = recentAttemptAccuracies(db, alice, SAT.examKey);
    const dashboardBefore = buildDashboard(db, { id: alice, isGuest: false, targetExamKey: null }, 'digital-sat').exam!;

    const missed = questionsOf(source).slice(0, 5).map((row) => row.q);
    const retry = startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: missed });
    for (let position = 0; position < 5; position += 1) {
      recordResponse(db, { attemptId: retry.attemptId, userId: alice, partIndex: 0, position, response: { type: 'single_select', optionId: 'a' } });
    }
    submitAttempt(db, { attemptId: retry.attemptId, userId: alice });

    expect(skillPerformance(db, alice, SAT.examKey)).toEqual(skillsBefore);
    expect([...domainPerformance(db, alice, SAT.examKey).entries()]).toEqual(domainsBefore);
    expect(recentAttemptAccuracies(db, alice, SAT.examKey)).toEqual(accuraciesBefore);
    const dashboard = buildDashboard(db, { id: alice, isGuest: false, targetExamKey: null }, 'digital-sat').exam!;
    expect(dashboard.finishedCount).toBe(dashboardBefore.finishedCount);
    expect(dashboard.totalScored).toBe(dashboardBefore.totalScored);
    expect(dashboard.recent[0]).toMatchObject({ id: retry.attemptId, isRetry: true });

    // The schedule is what a retry is for: answered correctly, they move out.
    const results = db.prepare(`SELECT last_result FROM review_queue WHERE user_id = ? AND question_id IN (${missed.map(() => '?').join(',')})`).all(alice, ...missed) as Array<{ last_result: string }>;
    expect(results.every((row) => row.last_result === 'correct')).toBe(true);
  });
});

describe('new questions only', () => {
  it('builds a session only from questions the learner has never been shown', () => {
    const first = finish(alice, []);
    const seen = new Set(questionsOf(first).map((row) => row.q));
    const { attemptId } = startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
      overrides: { unseenOnly: true, length: 10 },
    });
    expect(questionsOf(attemptId).some((row) => seen.has(row.q))).toBe(false);
  });

  it('refuses rather than tops up with seen questions when too few are new', () => {
    const skill = SAT.domains[0].skills[0].slug;
    finish(alice, [], { skills: [skill], length: 2 });
    expect(() =>
      startAttempt(db, {
        userId: alice,
        examKey: SAT.examKey,
        blueprintId: 'practice',
        overrides: { skills: [skill], unseenOnly: true, length: 2 },
      }),
    ).toThrowError(expect.objectContaining({ code: 'insufficient-content' }));
  });

  it('is ignored outside open practice: timed formats keep their own rules', () => {
    finish(alice, []);
    const { attemptId } = startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'timed-math-module-1',
      overrides: { unseenOnly: true },
    });
    expect(questionsOf(attemptId).length).toBeGreaterThan(0);
  });
});
