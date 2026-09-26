import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import type { AttemptItemRow } from '@/lib/db/rows';
import {
  AttemptError,
  RESUME_CLOCK_TOLERANCE_MS,
  getAttemptState,
  recordResponse,
  startAttempt,
  submitAttempt,
} from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * Ordered answer writes (migration 006, Phase 5). The player keeps answers it
 * has not had confirmed and sends them again after a reload or a dropped
 * connection, so the server sees resends, late arrivals and writes from other
 * tabs. Each answer carries a clock: an older one never replaces a newer one,
 * a repeat of the stored answer changes nothing (its time counted once), and
 * the lock, the section's clock and the attempt's owner still decide first.
 */

const SAT = requireExamConfig('digital-sat');
const pick = (optionId: string) => ({ type: 'single_select' as const, optionId });
const T0 = new Date('2026-09-26T10:00:00.000Z');
const at = (ms: number) => new Date(T0.getTime() + ms);

let db: Db;
let alice: string;
let bob: string;
let attemptId: string;

function row(position = 0): AttemptItemRow {
  return db.prepare('SELECT * FROM attempt_items WHERE attempt_id = ? AND position = ?').get(attemptId, position) as AttemptItemRow;
}

function answer(response: ReturnType<typeof pick> | null, clock: number | undefined, options: { reveal?: boolean; elapsedMs?: number; now?: Date; userId?: string; position?: number } = {}) {
  return recordResponse(db, {
    attemptId,
    userId: options.userId ?? alice,
    partIndex: 0,
    position: options.position ?? 0,
    response,
    clock,
    reveal: options.reveal,
    elapsedMs: options.elapsedMs,
    now: options.now ?? at(60_000),
  });
}

function codeOf(fn: () => unknown): string | null {
  try {
    fn();
    return null;
  } catch (error) {
    if (error instanceof AttemptError) return error.code;
    throw error;
  }
}

beforeEach(() => {
  db = createTestDb();
  alice = createUser(db);
  bob = createUser(db);
  seedQuestions(db, SAT, { perDomain: 6 }); // every key is option "a"
  attemptId = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'practice', now: T0 }).attemptId;
});

describe('order', () => {
  it('stores a newer answer and refuses an older one arriving after it', () => {
    expect(answer(pick('c'), T0.getTime() + 2_000)).toMatchObject({ saved: true, stale: false, clock: T0.getTime() + 2_000 });
    const late = answer(pick('b'), T0.getTime() + 1_000);
    expect(late).toMatchObject({ saved: false, stale: true, duplicate: false, current: pick('c'), clock: T0.getTime() + 2_000 });
    expect(JSON.parse(row().response_json!)).toEqual(pick('c'));
  });

  it('treats a resend of the stored answer as saved, and counts its time once', () => {
    const clock = T0.getTime() + 5_000;
    answer(pick('b'), clock, { elapsedMs: 40_000 });
    const again = answer(pick('b'), clock, { elapsedMs: 40_000 });
    expect(again).toMatchObject({ saved: true, duplicate: true, stale: false, current: pick('b') });
    expect(row().time_ms).toBe(40_000);
    const events = db.prepare("SELECT COUNT(*) AS n FROM attempt_events WHERE attempt_id = ? AND type LIKE 'item.answer%'").get(attemptId) as { n: number };
    expect(events.n).toBe(1);
  });

  it('keeps clearing an answer an ordered write like any other', () => {
    answer(pick('b'), T0.getTime() + 1_000);
    expect(answer(null, T0.getTime() + 2_000)).toMatchObject({ saved: true, current: null });
    expect(answer(pick('d'), T0.getTime() + 1_500)).toMatchObject({ stale: true, current: null });
    expect(row().response_status).toBe('unanswered');
  });

  it('lets a write without a clock through as the newest, and orders later writes after it', () => {
    answer(pick('b'), T0.getTime() + 1_000);
    expect(answer(pick('c'), undefined)).toMatchObject({ saved: true });
    const stored = row().response_clock!;
    expect(stored).toBeGreaterThan(T0.getTime() + 1_000);
    // A device's older queued answer cannot undo it.
    expect(answer(pick('d'), T0.getTime() + 2_000)).toMatchObject({ stale: true, current: pick('c') });
    // Unclocked writes in the same millisecond still apply in order.
    answer(pick('d'), undefined);
    answer(pick('e'), undefined);
    expect(JSON.parse(row().response_json!)).toEqual(pick('e'));
  });

  it('does not let a clock far ahead of the server fix the order', () => {
    const now = at(60_000);
    answer(pick('b'), now.getTime() + RESUME_CLOCK_TOLERANCE_MS + 60_000, { now });
    // Treated as the server's own time, so a sensible later clock still wins.
    expect(answer(pick('c'), now.getTime() + 1_000, { now: at(61_000) })).toMatchObject({ saved: true, stale: false });
  });

  it('orders each question separately', () => {
    answer(pick('b'), T0.getTime() + 9_000, { position: 0 });
    expect(answer(pick('c'), T0.getTime() + 1_000, { position: 1 })).toMatchObject({ saved: true });
  });

  it('reports the stored clocks in the attempt state', () => {
    answer(pick('b'), T0.getTime() + 3_000);
    const state = getAttemptState(db, attemptId, alice, at(60_000));
    expect(state.parts[0].items[0].responseClock).toBe(T0.getTime() + 3_000);
    expect(state.parts[0].items[1].responseClock).toBeNull();
    expect(state.resumeClock).toBeNull();
  });
});

describe('the lock after checking an answer', () => {
  it('refuses a newer, different answer to a checked question', () => {
    answer(pick('b'), T0.getTime() + 1_000, { reveal: true });
    expect(codeOf(() => answer(pick('c'), T0.getTime() + 2_000))).toBe('response-locked');
    expect(JSON.parse(row().response_json!)).toEqual(pick('b'));
  });

  it('calls an older draft arriving after the check stale, not a violation', () => {
    answer(pick('b'), T0.getTime() + 2_000, { reveal: true });
    expect(answer(pick('c'), T0.getTime() + 1_000)).toMatchObject({ saved: false, stale: true, locked: true, current: pick('b') });
  });

  it('returns the feedback again for a resent check', () => {
    const clock = T0.getTime() + 2_000;
    answer(pick('a'), clock, { reveal: true });
    const again = answer(pick('a'), clock, { reveal: true });
    expect(again).toMatchObject({ saved: true, duplicate: true, locked: true });
    expect(again.feedback?.correct).toBe(true);
  });
});

describe('refusals that come before order', () => {
  it('refuses another learner’s attempt as if it did not exist', () => {
    expect(codeOf(() => answer(pick('b'), T0.getTime() + 1_000, { userId: bob }))).toBe('not-found');
  });

  it('refuses any answer, however it is ordered, once the attempt is submitted', () => {
    submitAttempt(db, { attemptId, userId: alice, now: at(30_000) });
    expect(codeOf(() => answer(pick('b'), T0.getTime() + 1_000))).toBe('attempt-closed');
  });

  it('refuses an answer made before the deadline but delivered after it', () => {
    const timed = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'timed-math-module-1', now: T0 }).attemptId;
    const madeInTime = T0.getTime() + 60_000;
    const afterDeadline = at(36 * 60 * 1000);
    const code = codeOf(() =>
      recordResponse(db, { attemptId: timed, userId: alice, partIndex: 0, position: 0, response: pick('b'), clock: madeInTime, now: afterDeadline }),
    );
    // The device's clock is not evidence of when the answer was made.
    expect(['time-expired', 'attempt-closed']).toContain(code);
    const stored = db.prepare('SELECT response_json FROM attempt_items WHERE attempt_id = ? AND position = 0').get(timed) as { response_json: string | null };
    expect(stored.response_json).toBeNull();
  });
});
