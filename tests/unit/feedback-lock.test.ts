import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { wrapSqlite, type Db } from '@/lib/db';
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

async function codeOf(fn: () => unknown): Promise<string | null> {
  try {
    (await fn());
    return null;
  } catch (error) {
    if (error instanceof AttemptError) return error.code;
    throw error;
  }
}

async function itemRow(db: Db, attemptId: string, position = 0): Promise<AttemptItemRow> {
  return (await db
    .prepare('SELECT * FROM attempt_items WHERE attempt_id = ? AND part_index = 0 AND position = ?')
    .get(attemptId, position)) as AttemptItemRow;
}

async function eventCount(db: Db, attemptId: string, type: string): Promise<number> {
  return (
    (await db.prepare('SELECT COUNT(*) AS n FROM attempt_events WHERE attempt_id = ? AND type = ?').get(attemptId, type)) as {
      n: number;
    }
  ).n;
}

let db: Db;
let learner: string;
let attemptId: string;

async function answer(response: ReturnType<typeof pick> | null, reveal?: boolean, conn: Db = db) {
  return (await recordResponse(conn, { attemptId, userId: learner, partIndex: 0, position: 0, response, reveal }));
}

beforeEach(async () => {
  db = (await createTestDb());
  learner = (await createUser(db));
  (await seedQuestions(db, SAT, { perDomain: 6 })); // every key is option "a"
  attemptId = (await startAttempt(db, { userId: learner, examKey: SAT.examKey, blueprintId: 'practice' })).attemptId;
});

describe('before feedback is requested', () => {
  it('lets the learner change a draft answer as often as they like', async () => {
    (await answer(pick('b')));
    (await answer(pick('c')));
    const result = (await answer(pick('d')));

    expect(result.locked).toBe(false);
    expect(result.feedback).toBeNull();
    expect(JSON.parse((await itemRow(db, attemptId)).response_json!)).toEqual(pick('d'));
  });

  it('releases nothing for a draft: no key, no explanation', async () => {
    (await answer(pick('b')));
    const item = (await getAttemptState(db, attemptId, learner)).parts[0].items[0];

    expect(item.answered).toBe(true);
    expect(item.feedbackReleased).toBe(false);
    expect(item.review).toBeNull();
    expect((await itemRow(db, attemptId)).feedback_released_at).toBeNull();
  });

  it('refuses to check an empty answer', async () => {
    expect((await codeOf(async () => (await answer(null, true))))).toBe('answer-required');
    expect((await itemRow(db, attemptId)).feedback_released_at).toBeNull();
  });
});

describe('checking an answer', () => {
  it('persists the answer and releases feedback in the same write', async () => {
    const result = (await answer(pick('b'), true));

    expect(result.locked).toBe(true);
    expect(result.duplicate).toBe(false);
    expect(result.feedback?.correct).toBe(false);

    const row = (await itemRow(db, attemptId));
    expect(JSON.parse(row.response_json!)).toEqual(pick('b'));
    expect(row.feedback_released_at).not.toBeNull();
    expect((await eventCount(db, attemptId, 'item.feedback_released'))).toBe(1);
  });

  it('reports a checked answer’s result correctly before the attempt is scored', async () => {
    (await answer(pick('a'), true));
    const item = (await getAttemptState(db, attemptId, learner)).parts[0].items[0];

    expect(item.feedbackReleased).toBe(true);
    expect(item.review?.correct).toBe(true);
  });

  it('refuses every later change to a checked answer', async () => {
    (await answer(pick('b'), true));

    expect((await codeOf(async () => (await answer(pick('c')))))).toBe('response-locked');
    expect((await codeOf(async () => (await answer(pick('a'), true))))).toBe('response-locked');
    expect((await codeOf(async () => (await answer(null))))).toBe('response-locked');

    expect(JSON.parse((await itemRow(db, attemptId)).response_json!)).toEqual(pick('b'));
  });

  it('answers the refusal with HTTP 409', async () => {
    (await answer(pick('b'), true));
    try {
      (await answer(pick('a')));
      expect.unreachable();
    } catch (error) {
      expect((error as AttemptError).status).toBe(409);
    }
  });

  it('treats a repeated check of the same answer as harmless', async () => {
    (await answer(pick('b'), true));
    const again = (await answer(pick('b'), true));

    expect(again.duplicate).toBe(true);
    expect(again.locked).toBe(true);
    expect(again.feedback?.correct).toBe(false);
    expect((await eventCount(db, attemptId, 'item.feedback_released'))).toBe(1);
    expect((await eventCount(db, attemptId, 'item.answer_changed'))).toBe(0);
  });

  it('leaves other items open', async () => {
    (await answer(pick('b'), true));
    const other = (await recordResponse(db, {
      attemptId,
      userId: learner,
      partIndex: 0,
      position: 1,
      response: pick('c'),
    }));
    expect(other.locked).toBe(false);
  });

  it('scores the locked answer when the attempt is submitted', async () => {
    (await answer(pick('b'), true));
    (await submitAttempt(db, { attemptId, userId: learner }));
    expect((await itemRow(db, attemptId)).is_correct).toBe(0);
  });
});

describe('overwrites from other tabs and concurrent requests', () => {
  it('refuses a write that read the item before another tab released it', async () => {
    const stale = (await itemRow(db, attemptId));
    (await answer(pick('b'), true)); // the other tab checks first

    const late = (await persistResponse(db, {
      attemptId,
      itemId: stale.id,
      partIndex: 0,
      position: 0,
      response: pick('a'),
      wasAnswered: stale.response_status === 'answered',
      elapsedMs: 0,
      release: true,
      now: new Date(),
    }));

    expect(late.written).toBe(false);
    expect(JSON.parse((await itemRow(db, attemptId)).response_json!)).toEqual(pick('b'));
    expect((await eventCount(db, attemptId, 'item.feedback_released'))).toBe(1);
  });

  describe('across two database connections', () => {
    let dir: string;
    let first: Db;
    let second: Db;

    beforeEach(async () => {
      dir = fs.mkdtempSync(path.join(os.tmpdir(), 'examer-lock-'));
      const file = path.join(dir, 'lock.db');
      const rawFirst = new Database(file);
      rawFirst.pragma('journal_mode = WAL');
      rawFirst.pragma('foreign_keys = ON');
      first = wrapSqlite(rawFirst);
      for (const name of fs.readdirSync('db/migrations').filter((f) => f.endsWith('.sql')).sort()) {
        (await first.exec(fs.readFileSync(path.join('db/migrations', name), 'utf8')));
      }
      learner = (await createUser(first));
      (await seedQuestions(first, SAT, { perDomain: 6 }));
      attemptId = (await startAttempt(first, { userId: learner, examKey: SAT.examKey, blueprintId: 'practice' })).attemptId;

      const rawSecond = new Database(file);
      rawSecond.pragma('busy_timeout = 2000');
      second = wrapSqlite(rawSecond);
    });

    afterEach(async () => {
      (await first.close());
      (await second.close());
      fs.rmSync(dir, { recursive: true, force: true });
    });

    it('enforces a check committed on one connection against the other', async () => {
      const stale = (await itemRow(second, attemptId));
      (await answer(pick('b'), true, first));

      expect((await codeOf(async () => (await answer(pick('a'), true, second))))).toBe('response-locked');
      expect(
        (await persistResponse(second, {
          attemptId,
          itemId: stale.id,
          partIndex: 0,
          position: 0,
          response: pick('a'),
          wasAnswered: false,
          elapsedMs: 0,
          release: false,
          now: new Date(),
        })).written,
      ).toBe(false);

      expect(JSON.parse((await itemRow(first, attemptId)).response_json!)).toEqual(pick('b'));
    });

    it('lets a duplicate check from the other connection succeed without writing', async () => {
      (await answer(pick('b'), true, first));
      const again = (await answer(pick('b'), true, second));
      expect(again.duplicate).toBe(true);
      expect((await eventCount(first, attemptId, 'item.feedback_released'))).toBe(1);
    });
  });
});

describe('formats without immediate feedback', () => {
  let timedId: string;

  beforeEach(async () => {
    timedId = (await startAttempt(db, {
      userId: learner,
      examKey: SAT.examKey,
      blueprintId: 'timed-math-module-1',
    })).attemptId;
  });

  const timed = async (response: ReturnType<typeof pick> | null, reveal?: boolean) =>
    (await recordResponse(db, { attemptId: timedId, userId: learner, partIndex: 0, position: 0, response, reveal }));

  it('keeps their editing rules: answers can still be changed', async () => {
    (await timed(pick('b')));
    const changed = (await timed(pick('c')));
    expect(changed.locked).toBe(false);
    expect(JSON.parse((await itemRow(db, timedId)).response_json!)).toEqual(pick('c'));
  });

  it('refuses to reveal anything before submission', async () => {
    (await timed(pick('b')));
    expect((await codeOf(async () => (await timed(pick('b'), true))))).toBe('feedback-not-available');
    expect((await itemRow(db, timedId)).feedback_released_at).toBeNull();
    expect((await getAttemptState(db, timedId, learner)).parts[0].items[0].review).toBeNull();
  });
});

describe('migration 003 on existing data', () => {
  async function migrateUpTo(conn: Db, last: string): Promise<void> {
    for (const name of fs.readdirSync('db/migrations').filter((f) => f.endsWith('.sql')).sort()) {
      if (name.localeCompare(last) > 0) break;
      (await conn.exec(fs.readFileSync(path.join('db/migrations', name), 'utf8')));
    }
  }

  it('locks answers already shown under the old rule, and touches nothing else', async () => {
    const rawOld = new Database(':memory:');
    rawOld.pragma('foreign_keys = ON');
    const old = wrapSqlite(rawOld);
    (await migrateUpTo(old, '002_exam_targets.sql'));
    const user = (await createUser(old));
    (await seedQuestions(old, SAT, { perDomain: 6 }));

    const live = (await startAttempt(old, { userId: user, examKey: SAT.examKey, blueprintId: 'practice' })).attemptId;
    const timedLive = (await startAttempt(old, { userId: user, examKey: SAT.examKey, blueprintId: 'timed-math-module-1' })).attemptId;
    const finished = (await startAttempt(old, { userId: user, examKey: SAT.examKey, blueprintId: 'practice' })).attemptId;

    const answerDirectly = async (id: string, position: number) =>
      (await old
        .prepare(
          `UPDATE attempt_items SET response_json = ?, response_status = 'answered', last_answered_at = ?
           WHERE attempt_id = ? AND position = ?`,
        )
        .run(JSON.stringify(pick('b')), '2026-09-20T10:00:00.000Z', id, position));
    (await answerDirectly(live, 0));
    (await answerDirectly(timedLive, 0));
    (await answerDirectly(finished, 0));
    (await old.prepare("UPDATE attempts SET status = 'submitted' WHERE id = ?").run(finished));

    const before = (await old.prepare('SELECT * FROM attempt_results').all());
    (await old.exec(fs.readFileSync('db/migrations/003_feedback_release.sql', 'utf8')));

    const released = async (id: string, position: number) =>
      (
        (await old
          .prepare('SELECT feedback_released_at AS at FROM attempt_items WHERE attempt_id = ? AND position = ?')
          .get(id, position)) as { at: string | null }
      ).at;

    expect((await released(live, 0))).toBe('2026-09-20T10:00:00.000Z');
    expect((await released(live, 1))).toBeNull(); // unanswered: nothing was shown
    expect((await released(timedLive, 0))).toBeNull(); // timed: never showed feedback
    expect((await released(finished, 0))).toBeNull(); // submitted: history untouched
    expect((await old.prepare('SELECT * FROM attempt_results').all())).toEqual(before);
    (await old.close());
  });
});
