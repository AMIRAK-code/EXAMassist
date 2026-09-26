import { describe, expect, it } from 'vitest';
import {
  MemoryStorage,
  PENDING_PREFIX,
  PENDING_TTL_MS,
  PendingStore,
  classifyReply,
  pendingKey,
  purgePending,
  reconcile,
  retryDelay,
  sameResponse,
  type PendingAnswer,
  type ServerItem,
} from '@/lib/player/pending';

/**
 * Answers and moves kept on the device until the server confirms them
 * (Phase 5): per account and attempt, the newest change winning as it does on
 * the server, and nothing replayed into a closed section or a locked answer.
 */

const pick = (optionId: string) => ({ type: 'single_select' as const, optionId });
const answer = (position: number, optionId: string | null, clock: number, extra: Partial<PendingAnswer> = {}): PendingAnswer => ({
  partIndex: 0,
  position,
  response: optionId === null ? null : pick(optionId),
  clock,
  elapsedMs: 1_000,
  ...extra,
});

describe('the store', () => {
  it('keeps the newest change to each question, and carries unreported time only when asked', () => {
    const store = new PendingStore(new MemoryStorage(), 'alice', 'attempt-1');
    store.putAnswer(answer(0, 'b', 100), true);
    store.putAnswer(answer(0, 'c', 200, { elapsedMs: 500 }), true);
    expect(store.read().answers).toEqual([answer(0, 'c', 200, { elapsedMs: 1_500 })]);

    // While the older change is on its way, its time is not added again.
    store.putAnswer(answer(0, 'd', 300, { elapsedMs: 250 }), false);
    expect(store.read().answers[0]).toMatchObject({ clock: 300, elapsedMs: 250 });

    // An older change (from another tab) never replaces a newer one.
    const { kept } = store.putAnswer(answer(0, 'e', 150), true);
    expect(kept.clock).toBe(300);
    expect(store.read().answers).toHaveLength(1);
  });

  it('forgets a change only once the server holds it or something newer', () => {
    const store = new PendingStore(new MemoryStorage(), 'alice', 'attempt-1');
    store.putAnswer(answer(0, 'b', 100), true);
    store.putAnswer(answer(0, 'c', 200), false); // changed again before the reply to 100 came back
    expect(store.settleAnswer(0, 0, 100)).toBe(false);
    expect(store.read().answers[0].clock).toBe(200);
    expect(store.settleAnswer(0, 0, 200)).toBe(true);
    expect(store.read().answers).toEqual([]);
  });

  it('keeps only the newest move', () => {
    const store = new PendingStore(new MemoryStorage(), 'alice', 'attempt-1');
    store.putMove({ partIndex: 0, position: 3, clock: 300 });
    store.putMove({ partIndex: 0, position: 2, clock: 200 });
    expect(store.read().move).toEqual({ partIndex: 0, position: 3, clock: 300 });
    store.settleMove(299);
    expect(store.read().move).not.toBeNull();
    store.settleMove(300);
    expect(store.read().move).toBeNull();
  });

  it('shares one record between two tabs of the same attempt', () => {
    const storage = new MemoryStorage();
    const tabA = new PendingStore(storage, 'alice', 'attempt-1');
    const tabB = new PendingStore(storage, 'alice', 'attempt-1');
    tabA.putAnswer(answer(0, 'b', 100), true);
    tabB.putAnswer(answer(1, 'c', 110), true);
    tabB.putAnswer(answer(0, 'd', 120), true);
    expect(tabA.read().answers.map((a) => [a.position, a.clock]).sort()).toEqual([
      [0, 120],
      [1, 110],
    ]);
  });

  it('removes the record entirely when nothing is left, and survives a record it cannot read', () => {
    const storage = new MemoryStorage();
    const store = new PendingStore(storage, 'alice', 'attempt-1');
    store.putAnswer(answer(0, 'b', 100), true);
    store.settleAnswer(0, 0, 100);
    expect(storage.length).toBe(0);
    storage.setItem(pendingKey('alice', 'attempt-1'), '{not json');
    expect(store.read()).toMatchObject({ answers: [], move: null });
  });

  it('says so when the device refuses to store a change', () => {
    const full = new MemoryStorage();
    full.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    const { durable } = new PendingStore(full, 'alice', 'attempt-1').putAnswer(answer(0, 'b', 100), true);
    expect(durable).toBe(false);
  });
});

describe('accounts on one device', () => {
  it('keeps each account’s records apart, and deletes every other account’s when a player opens', () => {
    const storage = new MemoryStorage();
    new PendingStore(storage, 'alice', 'attempt-1').putAnswer(answer(0, 'b', 100), true);
    new PendingStore(storage, 'bob', 'attempt-2').putAnswer(answer(0, 'c', 100), true);
    storage.setItem('unrelated', 'kept');

    // Bob's player cannot read Alice's attempt, even by its id.
    expect(new PendingStore(storage, 'bob', 'attempt-1').read().answers).toEqual([]);

    expect(purgePending(storage, 'bob')).toBe(1);
    expect(storage.getItem(pendingKey('alice', 'attempt-1'))).toBeNull();
    expect(storage.getItem(pendingKey('bob', 'attempt-2'))).not.toBeNull();
    expect(storage.getItem('unrelated')).toBe('kept');
  });

  it('deletes records past their age limit, and anything unreadable', () => {
    const storage = new MemoryStorage();
    const old = Date.now() - PENDING_TTL_MS - 1;
    new PendingStore(storage, 'alice', 'attempt-1', () => old).putAnswer(answer(0, 'b', 100), true);
    new PendingStore(storage, 'alice', 'attempt-2').putAnswer(answer(0, 'b', 100), true);
    storage.setItem(`${PENDING_PREFIX}alice.attempt-3`, 'garbage');
    expect(purgePending(storage, 'alice')).toBe(2);
    expect(storage.getItem(pendingKey('alice', 'attempt-2'))).not.toBeNull();
  });
});

describe('opening the player', () => {
  const server = (items: Array<Partial<ServerItem> & { position: number }>, currentPartIndex = 0, resumeClock: number | null = null) => ({
    currentPartIndex,
    resumeClock,
    items: items.map((i) => ({ partIndex: 0, response: null, responseClock: null, locked: false, ...i })),
  });

  it('replays what the server does not have yet', () => {
    const result = reconcile({ answers: [answer(0, 'b', 200)], move: null, updatedAt: 0 }, server([{ position: 0, responseClock: 100, response: pick('c') }]));
    expect(result.replay).toHaveLength(1);
  });

  it('forgets what the server already holds, or has a newer answer for', () => {
    const record = { answers: [answer(0, 'b', 200), answer(1, 'c', 150)], move: null, updatedAt: 0 };
    const result = reconcile(record, server([{ position: 0, responseClock: 200, response: pick('b') }, { position: 1, responseClock: 300, response: pick('d') }]));
    expect(result.settled).toHaveLength(2);
    expect(result.replay).toEqual([]);
    expect(result.lost).toEqual([]);
  });

  it('never replays into a section that has closed, and counts what could not be saved', () => {
    const record = { answers: [answer(0, 'b', 200), answer(1, 'c', 210)], move: { partIndex: 0, position: 1, clock: 220 }, updatedAt: 0 };
    // The first section expired while offline; the second is now open.
    const result = reconcile(record, {
      currentPartIndex: 1,
      resumeClock: null,
      items: [
        { partIndex: 0, position: 0, response: pick('b'), responseClock: 200, locked: false },
        { partIndex: 0, position: 1, response: null, responseClock: null, locked: false },
      ],
    });
    expect(result.replay).toEqual([]);
    expect(result.settled.map((a) => a.position)).toEqual([0]);
    expect(result.lost.map((a) => a.position)).toEqual([1]);
    expect(result.move).toBeNull();
  });

  it('never replays a different answer into a question checked since', () => {
    const result = reconcile({ answers: [answer(0, 'b', 200)], move: null, updatedAt: 0 }, server([{ position: 0, locked: true, response: pick('c'), responseClock: 100 }]));
    expect(result.lost).toHaveLength(1);
    expect(result.replay).toEqual([]);
  });

  it('makes a move only if it is newer than the stored position', () => {
    const record = (clock: number) => ({ answers: [], move: { partIndex: 0, position: 4, clock }, updatedAt: 0 });
    expect(reconcile(record(500), server([], 0, 400)).move?.position).toBe(4);
    expect(reconcile(record(300), server([], 0, 400)).move).toBeNull();
    expect(reconcile(record(300), server([], 0, null)).move?.position).toBe(4);
  });
});

describe('replies', () => {
  it('sorts every reply into what it means for the change', () => {
    expect(classifyReply(0, null)).toEqual({ kind: 'offline' });
    expect(classifyReply(200, { saved: true, stale: false, current: pick('b'), clock: 5, locked: false })).toMatchObject({ kind: 'saved', stale: false, clock: 5 });
    expect(classifyReply(200, { saved: false, stale: true, current: pick('c'), clock: 9 })).toMatchObject({ kind: 'saved', stale: true, current: pick('c') });
    expect(classifyReply(409, { error: { code: 'time-expired', message: 'Time is up.' } })).toMatchObject({ kind: 'closed', code: 'time-expired' });
    expect(classifyReply(409, { error: { code: 'attempt-closed', message: '' } }).kind).toBe('closed');
    expect(classifyReply(409, { error: { code: 'wrong-part', message: '' } }).kind).toBe('closed');
    expect(classifyReply(409, { error: { code: 'response-locked', message: 'Locked.' } }).kind).toBe('locked');
    expect(classifyReply(409, { error: { code: 'edit-limit', message: 'No edits left.' } })).toMatchObject({ kind: 'refused', code: 'edit-limit' });
    expect(classifyReply(401, null).kind).toBe('signed-out');
    expect(classifyReply(404, null).kind).toBe('not-found');
    expect(classifyReply(429, { error: { code: 'rate-limited', message: '', detail: { retryAfterSeconds: 7 } } })).toMatchObject({ kind: 'retry', afterMs: 7_000 });
    expect(classifyReply(503, null)).toMatchObject({ kind: 'retry', afterMs: 0 });
  });

  it('backs off between tries, to a ceiling', () => {
    expect([1, 2, 3, 4, 5, 6, 10].map(retryDelay)).toEqual([2_000, 4_000, 8_000, 16_000, 30_000, 30_000, 30_000]);
  });

  it('compares answers as the server does', () => {
    expect(sameResponse({ type: 'multi_select', optionIds: ['a', 'b'] }, { type: 'multi_select', optionIds: ['b', 'a'] })).toBe(true);
    expect(sameResponse(pick('a'), pick('b'))).toBe(false);
    expect(sameResponse(null, null)).toBe(true);
    expect(sameResponse(null, pick('a'))).toBe(false);
  });
});
