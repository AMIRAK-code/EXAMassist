import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Db } from '@/lib/db';
import type { AttemptItemRow } from '@/lib/db/rows';
import {
  AttemptError,
  getAttemptState,
  persistResponse,
  recordResponse,
  startAttempt,
  submitAttempt,
} from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * Immediate feedback in untimed practice, and the lock that follows it.
 *
 * A learner may change an answer freely until they ask to check it. Checking
 * persists the answer and releases the key in one write; from then on the
 * server refuses any change, whichever tab or request it comes from. Without
 * this a learner could read the key, change the answer, and have the miss
 * recorded as correct.
 */

const SAT = requireExamConfig('digital-sat');
const pick = (optionId: string) => ({ type: 'single_select' as const, optionId });

function codeOf(fn: () => unknown): string | null {
  try {
    fn();
    return null;
  } catch (error) {
    if (error instanceof AttemptError) return error.code;
    throw error;
  }
}

function itemRow(db: Db, attemptId: string, position = 0): AttemptItemRow {
  return db
    .prepare('SELECT * FROM attempt_items WHERE attempt_id = ? AND part_index = 0 AND position = ?')
    .get(attemptId, position) as AttemptItemRow;
}

function eventCount(db: Db, attemptId: string, type: string): number {
  return (
    db.prepare('SELECT COUNT(*) AS n FROM attempt_events WHERE attempt_id = ? AND type = ?').get(attemptId, type) as {
      n: number;
    }
  ).n;
}

let db: Db;
let learner: string;
let attemptId: string;

function answer(response: ReturnType<typeof pick> | null, reveal?: boolean, conn: Db = db) {
  return recordResponse(conn, { attemptId, userId: learner, partIndex: 0, position: 0, response, reveal });
}

beforeEach(() => {
  db = createTestDb();
  learner = createUser(db);
  seedQuestions(db, SAT, { perDomain: 6 }); // every key is option "a"
  attemptId = startAttempt(db, { userId: learner, examKey: SAT.examKey, blueprintId: 'practice' }).attemptId;
});

describe('before feedback is requested', () => {
  it('lets the learner change a draft answer as often as they like', () => {
    answer(pick('b'));
    answer(pick('c'));
    const result = answer(pick('d'));

    expect(result.locked).toBe(false);
    expect(result.feedback).toBeNull();
    expect(JSON.parse(itemRow(db, attemptId).response_json!)).toEqual(pick('d'));
  });

  it('releases nothing for a draft: no key, no explanation', () => {
    answer(pick('b'));
    const item = getAttemptState(db, attemptId, learner).parts[0].items[0];

    expect(item.answered).toBe(true);
    expect(item.feedbackReleased).toBe(false);
    expect(item.review).toBeNull();
    expect(itemRow(db, attemptId).feedback_released_at).toBeNull();
  });

  it('refuses to check an empty answer', () => {
    expect(codeOf(() => answer(null, true))).toBe('answer-required');
    expect(itemRow(db, attemptId).feedback_released_at).toBeNull();
  });
});

describe('checking an answer', () => {
  it('persists the answer and releases feedback in the same write', () => {
    const result = answer(pick('b'), true);

    expect(result.locked).toBe(true);
    expect(result.duplicate).toBe(false);
    expect(result.feedback?.correct).toBe(false);

    const row = itemRow(db, attemptId);
    expect(JSON.parse(row.response_json!)).toEqual(pick('b'));
    expect(row.feedback_released_at).not.toBeNull();
    expect(eventCount(db, attemptId, 'item.feedback_released')).toBe(1);
  });

  it('reports a checked answer’s result correctly before the attempt is scored', () => {
    answer(pick('a'), true);
    const item = getAttemptState(db, attemptId, learner).parts[0].items[0];

    expect(item.feedbackReleased).toBe(true);
    expect(item.review?.correct).toBe(true);
  });

  it('refuses every later change to a checked answer', () => {
    answer(pick('b'), true);

    expect(codeOf(() => answer(pick('c')))).toBe('response-locked');
    expect(codeOf(() => answer(pick('a'), true))).toBe('response-locked');
    expect(codeOf(() => answer(null))).toBe('response-locked');

    expect(JSON.parse(itemRow(db, attemptId).response_json!)).toEqual(pick('b'));
  });

  it('answers the refusal with HTTP 409', () => {
    answer(pick('b'), true);
    try {
      answer(pick('a'));
      expect.unreachable();
    } catch (error) {
      expect((error as AttemptError).status).toBe(409);
    }
  });

  it('treats a repeated check of the same answer as harmless', () => {
    answer(pick('b'), true);
    const again = answer(pick('b'), true);

    expect(again.duplicate).toBe(true);
    expect(again.locked).toBe(true);
    expect(again.feedback?.correct).toBe(false);
    expect(eventCount(db, attemptId, 'item.feedback_released')).toBe(1);
    expect(eventCount(db, attemptId, 'item.answer_changed')).toBe(0);
  });

  it('leaves other items open', () => {
    answer(pick('b'), true);
    const other = recordResponse(db, {
      attemptId,
      userId: learner,
      partIndex: 0,
      position: 1,
      response: pick('c'),
    });
    expect(other.locked).toBe(false);
  });

  it('scores the locked answer when the attempt is submitted', () => {
    answer(pick('b'), true);
    submitAttempt(db, { attemptId, userId: learner });
    expect(itemRow(db, attemptId).is_correct).toBe(0);
  });
});

describe('overwrites from other tabs and concurrent requests', () => {
  it('refuses a write that read the item before another tab released it', () => {
    const stale = itemRow(db, attemptId);
    answer(pick('b'), true); // the other tab checks first

    const late = persistResponse(db, {
      attemptId,
      itemId: stale.id,
      partIndex: 0,
      position: 0,
      response: pick('a'),
      wasAnswered: stale.response_status === 'answered',
      elapsedMs: 0,
      release: true,
      now: new Date(),
    });

    expect(late.written).toBe(false);
    expect(JSON.parse(itemRow(db, attemptId).response_json!)).toEqual(pick('b'));
    expect(eventCount(db, attemptId, 'item.feedback_released')).toBe(1);
  });

  describe('across two database connections', () => {
    let dir: string;
    let first: Db;
    let second: Db;

    beforeEach(() => {
      dir = fs.mkdtempSync(path.join(os.tmpdir(), 'examer-lock-'));
      const file = path.join(dir, 'lock.db');
      first = new Database(file);
      first.pragma('journal_mode = WAL');
      first.pragma('foreign_keys = ON');
      for (const name of fs.readdirSync('db/migrations').filter((f) => f.endsWith('.sql')).sort()) {
        first.exec(fs.readFileSync(path.join('db/migrations', name), 'utf8'));
      }
      learner = createUser(first);
      seedQuestions(first, SAT, { perDomain: 6 });
      attemptId = startAttempt(first, { userId: learner, examKey: SAT.examKey, blueprintId: 'practice' }).attemptId;

      second = new Database(file);
      second.pragma('busy_timeout = 2000');
    });

    afterEach(() => {
      first.close();
      second.close();
      fs.rmSync(dir, { recursive: true, force: true });
    });

    it('enforces a check committed on one connection against the other', () => {
      const stale = itemRow(second, attemptId);
      answer(pick('b'), true, first);

      expect(codeOf(() => answer(pick('a'), true, second))).toBe('response-locked');
      expect(
        persistResponse(second, {
          attemptId,
          itemId: stale.id,
          partIndex: 0,
          position: 0,
          response: pick('a'),
          wasAnswered: false,
          elapsedMs: 0,
          release: false,
          now: new Date(),
        }).written,
      ).toBe(false);

      expect(JSON.parse(itemRow(first, attemptId).response_json!)).toEqual(pick('b'));
    });

    it('lets a duplicate check from the other connection succeed without writing', () => {
      answer(pick('b'), true, first);
      const again = answer(pick('b'), true, second);
      expect(again.duplicate).toBe(true);
      expect(eventCount(first, attemptId, 'item.feedback_released')).toBe(1);
    });
  });
});

describe('formats without immediate feedback', () => {
  let timedId: string;

  beforeEach(() => {
    timedId = startAttempt(db, {
      userId: learner,
      examKey: SAT.examKey,
      blueprintId: 'timed-math-module-1',
    }).attemptId;
  });

  const timed = (response: ReturnType<typeof pick> | null, reveal?: boolean) =>
    recordResponse(db, { attemptId: timedId, userId: learner, partIndex: 0, position: 0, response, reveal });

  it('keeps their editing rules: answers can still be changed', () => {
    timed(pick('b'));
    const changed = timed(pick('c'));
    expect(changed.locked).toBe(false);
    expect(JSON.parse(itemRow(db, timedId).response_json!)).toEqual(pick('c'));
  });

  it('refuses to reveal anything before submission', () => {
    timed(pick('b'));
    expect(codeOf(() => timed(pick('b'), true))).toBe('feedback-not-available');
    expect(itemRow(db, timedId).feedback_released_at).toBeNull();
    expect(getAttemptState(db, timedId, learner).parts[0].items[0].review).toBeNull();
  });
});

describe('migration 003 on existing data', () => {
  function migrateUpTo(conn: Db, last: string): void {
    for (const name of fs.readdirSync('db/migrations').filter((f) => f.endsWith('.sql')).sort()) {
      if (name.localeCompare(last) > 0) break;
      conn.exec(fs.readFileSync(path.join('db/migrations', name), 'utf8'));
    }
  }

  it('locks answers already shown under the old rule, and touches nothing else', () => {
    const old = new Database(':memory:');
    old.pragma('foreign_keys = ON');
    migrateUpTo(old, '002_exam_targets.sql');
    const user = createUser(old);
    seedQuestions(old, SAT, { perDomain: 6 });

    const live = startAttempt(old, { userId: user, examKey: SAT.examKey, blueprintId: 'practice' }).attemptId;
    const timedLive = startAttempt(old, { userId: user, examKey: SAT.examKey, blueprintId: 'timed-math-module-1' }).attemptId;
    const finished = startAttempt(old, { userId: user, examKey: SAT.examKey, blueprintId: 'practice' }).attemptId;

    const answerDirectly = (id: string, position: number) =>
      old
        .prepare(
          `UPDATE attempt_items SET response_json = ?, response_status = 'answered', last_answered_at = ?
           WHERE attempt_id = ? AND position = ?`,
        )
        .run(JSON.stringify(pick('b')), '2026-09-20T10:00:00.000Z', id, position);
    answerDirectly(live, 0);
    answerDirectly(timedLive, 0);
    answerDirectly(finished, 0);
    old.prepare("UPDATE attempts SET status = 'submitted' WHERE id = ?").run(finished);

    const before = old.prepare('SELECT * FROM attempt_results').all();
    old.exec(fs.readFileSync('db/migrations/003_feedback_release.sql', 'utf8'));

    const released = (id: string, position: number) =>
      (
        old
          .prepare('SELECT feedback_released_at AS at FROM attempt_items WHERE attempt_id = ? AND position = ?')
          .get(id, position) as { at: string | null }
      ).at;

    expect(released(live, 0)).toBe('2026-09-20T10:00:00.000Z');
    expect(released(live, 1)).toBeNull(); // unanswered: nothing was shown
    expect(released(timedLive, 0)).toBeNull(); // timed: never showed feedback
    expect(released(finished, 0)).toBeNull(); // submitted: history untouched
    expect(old.prepare('SELECT * FROM attempt_results').all()).toEqual(before);
    old.close();
  });
});
