import type { Response } from '@/lib/assessment/types';

/**
 * Answers and moves the player has made that the server has not yet
 * confirmed, kept on the device so that a reload, a dropped connection or a
 * closed tab does not lose them. They are sent again when the player next
 * opens the attempt.
 *
 * - **Per account and per attempt.** A record's key names both. The player
 *   reads only its own account's record for its own attempt, and deletes
 *   every other account's records when it opens: a shared device must not
 *   hold one learner's answers while another is signed in. Signing out clears
 *   them too (the sign-out response sends Clear-Site-Data).
 * - **Never trusted.** Everything here is sent to the server, which checks
 *   the owner, the attempt's status, the section's clock, the lock after an
 *   answer is checked and the order of writes before it stores anything.
 *   Nothing here pauses or extends a clock.
 * - **Pure.** No React and no network, so every rule is unit-tested.
 */

export const PENDING_PREFIX = 'examer.pending.v1.';
/** A record older than this is deleted unread. */
export const PENDING_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface PendingAnswer {
  partIndex: number;
  position: number;
  response: Response | null;
  /** The server-anchored clock when the change was made; the server orders writes by it. */
  clock: number;
  /** Time on the question not yet reported to the server. */
  elapsedMs: number;
}

export interface PendingMove {
  partIndex: number;
  position: number;
  clock: number;
}

export interface PendingRecord {
  answers: PendingAnswer[];
  move: PendingMove | null;
  updatedAt: number;
}

export interface KeyValueStorage {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Storage that lasts only as long as the page: used when the device's storage cannot be written. */
export class MemoryStorage implements KeyValueStorage {
  private items = new Map<string, string>();
  get length(): number {
    return this.items.size;
  }
  key(index: number): string | null {
    return [...this.items.keys()][index] ?? null;
  }
  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }
  removeItem(key: string): void {
    this.items.delete(key);
  }
}

/**
 * The device's storage if it can be written (it cannot in some private
 * windows, or when full), otherwise storage that lasts only for the page. The
 * player says which, so it never claims answers are kept on the device when
 * they are not.
 */
export function deviceStorage(): { storage: KeyValueStorage; durable: boolean } {
  try {
    const storage = window.localStorage;
    const probe = `${PENDING_PREFIX}probe`;
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return { storage, durable: true };
  } catch {
    return { storage: new MemoryStorage(), durable: false };
  }
}

export function pendingKey(owner: string, attemptId: string): string {
  return `${PENDING_PREFIX}${owner}.${attemptId}`;
}

function parseRecord(raw: string | null): PendingRecord | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<PendingRecord>;
    if (!value || !Array.isArray(value.answers) || typeof value.updatedAt !== 'number') return null;
    const answers = value.answers.filter(
      (a): a is PendingAnswer =>
        !!a &&
        Number.isInteger(a.partIndex) &&
        Number.isInteger(a.position) &&
        Number.isSafeInteger(a.clock) &&
        Number.isFinite(a.elapsedMs) &&
        (a.response === null || (typeof a.response === 'object' && typeof (a.response as { type?: unknown }).type === 'string')),
    );
    const move =
      value.move && Number.isInteger(value.move.partIndex) && Number.isInteger(value.move.position) && Number.isSafeInteger(value.move.clock)
        ? value.move
        : null;
    return { answers, move, updatedAt: value.updatedAt };
  } catch {
    return null;
  }
}

/**
 * Deletes every record that belongs to another account, and any record past
 * its age limit. Returns how many were deleted.
 */
export function purgePending(storage: KeyValueStorage, owner: string, now = Date.now()): number {
  const doomed: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key || !key.startsWith(PENDING_PREFIX)) continue;
    const rest = key.slice(PENDING_PREFIX.length);
    const record = parseRecord(storage.getItem(key));
    if (!rest.startsWith(`${owner}.`) || !record || now - record.updatedAt > PENDING_TTL_MS) doomed.push(key);
  }
  for (const key of doomed) storage.removeItem(key);
  return doomed.length;
}

/** Deletes every pending record on the device, for every account (on signing out). */
export function clearAllPending(storage: KeyValueStorage): void {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith(PENDING_PREFIX)) keys.push(key);
  }
  for (const key of keys) storage.removeItem(key);
}

const sameQuestion = (a: { partIndex: number; position: number }, b: { partIndex: number; position: number }) =>
  a.partIndex === b.partIndex && a.position === b.position;

/**
 * One attempt's pending changes for one account. Every method reads the
 * stored record, changes it and writes it back at once, so two tabs of the
 * same attempt share one record and the newest change to a question wins in
 * both, as it does on the server.
 */
export class PendingStore {
  private readonly key: string;

  constructor(
    private readonly storage: KeyValueStorage,
    owner: string,
    attemptId: string,
    private readonly now: () => number = () => Date.now(),
  ) {
    this.key = pendingKey(owner, attemptId);
  }

  read(): PendingRecord {
    return parseRecord(this.storage.getItem(this.key)) ?? { answers: [], move: null, updatedAt: this.now() };
  }

  /** False if the device refused the write (storage full): the change then lives only in the page. */
  private write(record: PendingRecord): boolean {
    try {
      if (record.answers.length === 0 && !record.move) this.storage.removeItem(this.key);
      else this.storage.setItem(this.key, JSON.stringify({ ...record, updatedAt: this.now() }));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Records a change to an answer. A newer change replaces an older one for
   * the same question. `carryElapsed` adds the older change's unreported time
   * to it; the caller passes false while the older change is on its way to
   * the server, which will count that time itself.
   */
  putAnswer(answer: PendingAnswer, carryElapsed: boolean): { kept: PendingAnswer; durable: boolean } {
    const record = this.read();
    const existing = record.answers.find((a) => sameQuestion(a, answer));
    if (existing && existing.clock >= answer.clock) return { kept: existing, durable: true };
    const kept = { ...answer, elapsedMs: answer.elapsedMs + (existing && carryElapsed ? existing.elapsedMs : 0) };
    record.answers = [...record.answers.filter((a) => !sameQuestion(a, answer)), kept];
    return { kept, durable: this.write(record) };
  }

  /** Adds unreported time back to a question's pending change, after a request carrying it failed. */
  addElapsed(partIndex: number, position: number, elapsedMs: number): void {
    const record = this.read();
    const existing = record.answers.find((a) => sameQuestion(a, { partIndex, position }));
    if (!existing || elapsedMs <= 0) return;
    existing.elapsedMs += elapsedMs;
    this.write(record);
  }

  /** Records a move; only the newest is kept. */
  putMove(move: PendingMove): boolean {
    const record = this.read();
    if (record.move && record.move.clock >= move.clock) return true;
    record.move = move;
    return this.write(record);
  }

  /**
   * Forgets a question's pending change once the server holds it or
   * something newer: only if the pending change is no newer than `clock`.
   * Returns whether it was removed.
   */
  settleAnswer(partIndex: number, position: number, clock: number): boolean {
    const record = this.read();
    const existing = record.answers.find((a) => sameQuestion(a, { partIndex, position }));
    if (!existing || existing.clock > clock) return false;
    record.answers = record.answers.filter((a) => a !== existing);
    this.write(record);
    return true;
  }

  settleMove(clock: number): void {
    const record = this.read();
    if (!record.move || record.move.clock > clock) return;
    record.move = null;
    this.write(record);
  }

  /** Removes the pending changes that match, and returns them. */
  removeAnswers(match: (answer: PendingAnswer) => boolean): PendingAnswer[] {
    const record = this.read();
    const removed = record.answers.filter(match);
    if (removed.length === 0) return [];
    record.answers = record.answers.filter((a) => !match(a));
    this.write(record);
    return removed;
  }

  clear(): PendingRecord {
    const record = this.read();
    try {
      this.storage.removeItem(this.key);
    } catch {
      /* nothing to do */
    }
    return record;
  }
}

/** Whether two answers are the same, ignoring the order of multiple selections (as the server does). */
export function sameResponse(a: Response | null, b: Response | null): boolean {
  const canonical = (response: Response | null): string => {
    if (!response) return 'null';
    if (response.type === 'multi_select') return JSON.stringify({ ...response, optionIds: [...response.optionIds].sort() });
    if (response.type === 'two_part') {
      return JSON.stringify({ ...response, selections: [...response.selections].sort((x, y) => x.columnId.localeCompare(y.columnId)) });
    }
    return JSON.stringify(response);
  };
  return canonical(a) === canonical(b);
}

export interface ServerItem {
  partIndex: number;
  position: number;
  response: Response | null;
  responseClock: number | null;
  /** The answer was checked and its explanation shown: it can no longer change. */
  locked: boolean;
}

export interface Reconciled {
  /** Newer than what the server holds, in the open section: shown as the learner's answer and sent again. */
  replay: PendingAnswer[];
  /** Already held by the server, or replaced by a newer answer: forgotten. */
  settled: PendingAnswer[];
  /** Can no longer be saved (its section has closed, or the question was checked with another answer): forgotten, and the learner told. */
  lost: PendingAnswer[];
  /** A move newer than the stored resume position, in the open section, or null. */
  move: PendingMove | null;
}

/**
 * Sorts what the device kept against the attempt as the server now has it,
 * when the player opens. Nothing is replayed into a section that is not the
 * open one, or into a question whose answer is locked.
 */
export function reconcile(
  record: PendingRecord,
  server: { currentPartIndex: number; items: ServerItem[]; resumeClock: number | null },
): Reconciled {
  const result: Reconciled = { replay: [], settled: [], lost: [], move: null };
  for (const answer of record.answers) {
    const item = server.items.find((i) => sameQuestion(i, answer));
    const held = item ? sameResponse(item.response, answer.response) : false;
    if (!item) result.settled.push(answer);
    else if (answer.partIndex !== server.currentPartIndex) (held ? result.settled : result.lost).push(answer);
    else if (item.responseClock !== null && item.responseClock >= answer.clock) result.settled.push(answer);
    else if (item.locked) (held ? result.settled : result.lost).push(answer);
    else if (held && item.responseClock === null) result.settled.push(answer);
    else result.replay.push(answer);
  }
  const move = record.move;
  if (move && move.partIndex === server.currentPartIndex && (server.resumeClock === null || move.clock > server.resumeClock)) {
    result.move = move;
  }
  return result;
}

export type SaveReply =
  | { kind: 'saved'; stale: boolean; current: Response | null; clock: number | null; locked: boolean; data: unknown }
  /** No reply at all: the connection is down, or the request was cut off. */
  | { kind: 'offline' }
  /** The server could not take it now (busy, or failing): try again later. */
  | { kind: 'retry'; afterMs: number; message: string }
  /** The section or attempt has closed (time ran out, or it was submitted): nothing more can be saved there. */
  | { kind: 'closed'; code: string; message: string }
  /** The answer was checked and its explanation shown: it can no longer change. */
  | { kind: 'locked'; message: string }
  /** No one is signed in any more. */
  | { kind: 'signed-out' }
  /** Not this account's attempt, or it no longer exists. */
  | { kind: 'not-found' }
  /** Refused for a reason that another try would not change. */
  | { kind: 'refused'; code: string; message: string };

const CLOSED = new Set(['attempt-closed', 'time-expired', 'wrong-part', 'part-expired']);

/** What a reply to an answer or move means for the pending change it carried. */
export function classifyReply(status: number, data: any): SaveReply {
  if (status === 0) return { kind: 'offline' };
  const code: string = data?.error?.code ?? '';
  const message: string = data?.error?.message ?? '';
  if (status >= 200 && status < 300) {
    return {
      kind: 'saved',
      stale: data?.stale === true,
      current: (data?.current ?? null) as Response | null,
      clock: typeof data?.clock === 'number' ? data.clock : null,
      locked: data?.locked === true,
      data,
    };
  }
  if (status === 401) return { kind: 'signed-out' };
  if (status === 404) return { kind: 'not-found' };
  if (status === 429) {
    const seconds = Number(data?.error?.detail?.retryAfterSeconds ?? 5);
    return { kind: 'retry', afterMs: Math.max(1, Math.min(60, Number.isFinite(seconds) ? seconds : 5)) * 1000, message };
  }
  if (status >= 500) return { kind: 'retry', afterMs: 0, message };
  if (CLOSED.has(code)) return { kind: 'closed', code, message };
  if (code === 'response-locked') return { kind: 'locked', message };
  return { kind: 'refused', code, message };
}

/** Waits between tries after no reply or a server failure: 2, 4, 8, 16, then every 30 seconds. */
export function retryDelay(failures: number): number {
  return Math.min(30_000, 2_000 * 2 ** Math.max(0, failures - 1));
}
