'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Response } from '@/lib/assessment/types';
import {
  PendingStore,
  classifyReply,
  deviceStorage,
  purgePending,
  reconcile,
  retryDelay,
  type PendingAnswer,
  type Reconciled,
  type SaveReply,
  type ServerItem,
} from '@/lib/player/pending';

/**
 * Saving for the player: every answer and move is written to the device
 * first (src/lib/player/pending.ts), then sent, one request at a time, oldest
 * first. A change stays on the device until the server confirms it, so a
 * reload, a dropped connection or a closed tab loses nothing that the server
 * would still accept, and the player can say exactly what is saved.
 *
 * The server decides everything: a reply that the section has closed, that
 * an answer is locked, or that the attempt is not this account's ends that
 * change for good. Nothing here pauses a clock.
 */

export type SaveState = 'idle' | 'saving' | 'saved' | 'offline' | 'failed';

export interface SaveStatus {
  state: SaveState;
  /** Answers in the open section changed here that the server has not confirmed. */
  unsaved: number;
  unsavedPositions: ReadonlySet<number>;
  /** Unconfirmed changes survive a reload (device storage), or only this page. */
  durable: boolean;
  /** Saving has stopped for good on this page (section closed, signed out, another account). */
  halted: boolean;
}

export interface SaveEvents {
  /** The server holds a newer answer (another tab or device); it is now the one shown, and may be locked. */
  onReplaced(position: number, current: Response | null, locked: boolean): void;
  /** The question's answer was checked elsewhere and is locked. */
  onLocked(position: number, message: string): void;
  /** The section or attempt has closed; `lost` answers made here could not be saved. */
  onClosed(lost: number, message: string): void;
  /** One change was refused for a reason another try would not change. */
  onRefused(position: number | null, message: string): void;
  onSignedOut(): void;
  onNotFound(): void;
}

export type FlushResult = 'saved' | 'offline' | 'failed' | 'halted';

interface Options {
  attemptId: string;
  owner: string;
  partIndex: number;
  /** The server's clock when the page was rendered: moves and answers are ordered on it. */
  serverNowMs: number;
  events: SaveEvents;
}

type Work = { kind: 'answer'; answer: PendingAnswer } | { kind: 'move'; position: number; clock: number };

const questionKey = (partIndex: number, position: number) => `${partIndex}:${position}`;
const MAX_ELAPSED_MS = 30 * 60 * 1000;

export async function postJson(
  url: string,
  body: unknown,
  options: { keepalive?: boolean } = {},
): Promise<{ status: number; data: any }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify(body),
      keepalive: options.keepalive,
    });
    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      /* an empty or non-JSON body is fine */
    }
    return { status: response.status, data };
  } catch {
    return { status: 0, data: null };
  }
}

export function usePendingSaves({ attemptId, owner, partIndex, serverNowMs, events }: Options) {
  const eventsRef = useRef(events);
  eventsRef.current = events;

  const store = useRef<PendingStore | null>(null);
  const [durable, setDurable] = useState(true);
  const [version, setVersion] = useState(0);
  const touch = useCallback(() => setVersion((v) => v + 1), []);

  const [phase, setPhase] = useState<'idle' | 'saved' | 'offline' | 'failed'>('idle');
  const savedOnce = useRef(false);
  const [halted, setHalted] = useState(false);
  const haltedRef = useRef(false);
  const inFlight = useRef(new Map<string, number>());
  const notBefore = useRef(new Map<string, number>());
  const failures = useRef(0);
  const blockedUntil = useRef(0);
  const running = useRef<Promise<void> | null>(null);
  const timer = useRef<{ id: number; at: number } | null>(null);
  const [sending, setSending] = useState(false);

  // The ordering clock: the server's time at render plus the time elapsed
  // here, so writes are ordered on one timeline across tabs and devices even
  // when this device's clock is wrong. Strictly increasing within the page.
  const clockOffset = useRef<number | null>(null);
  const lastClock = useRef(0);
  const nextClock = useCallback(() => {
    clockOffset.current ??= serverNowMs - Date.now();
    lastClock.current = Math.max(Math.round(Date.now() + clockOffset.current), lastClock.current + 1);
    return lastClock.current;
  }, [serverNowMs]);

  const halt = useCallback(() => {
    haltedRef.current = true;
    setHalted(true);
  }, []);

  // --- Sending ---------------------------------------------------------------

  const schedule = useCallback((delayMs: number) => {
    const at = Date.now() + Math.max(0, delayMs);
    if (timer.current && timer.current.at <= at) return;
    if (timer.current) window.clearTimeout(timer.current.id);
    const id = window.setTimeout(() => {
      timer.current = null;
      void pumpRef.current();
    }, Math.max(0, delayMs));
    timer.current = { id, at };
  }, []);

  /** The oldest change ready to send, or the newest move once no answer is waiting. */
  const nextWork = useCallback((): Work | null | { waitMs: number } => {
    const record = store.current?.read();
    if (!record) return null;
    const now = Date.now();
    let soonest: number | null = null;
    const ready = record.answers
      .filter((a) => a.partIndex === partIndex && !inFlight.current.has(questionKey(a.partIndex, a.position)))
      .filter((a) => {
        const earliest = notBefore.current.get(questionKey(a.partIndex, a.position)) ?? 0;
        if (earliest > now) soonest = Math.min(soonest ?? Infinity, earliest - now);
        return earliest <= now;
      })
      .sort((a, b) => a.clock - b.clock);
    if (ready[0]) return { kind: 'answer', answer: ready[0] };
    if (soonest !== null) return { waitMs: soonest };
    if (record.move && record.move.partIndex === partIndex) return { kind: 'move', position: record.move.position, clock: record.move.clock };
    return null;
  }, [partIndex]);

  /** Acts on a reply. Returns false when sending should stop for now. */
  const handle = useCallback(
    (work: Work, reply: SaveReply): boolean => {
      const pending = store.current;
      if (!pending) return false;
      const position = work.kind === 'answer' ? work.answer.position : work.position;
      switch (reply.kind) {
        case 'saved': {
          failures.current = 0;
          if (work.kind === 'move') {
            pending.settleMove(work.clock);
            return true;
          }
          const removed = pending.settleAnswer(partIndex, position, work.answer.clock);
          if (reply.stale && removed) eventsRef.current.onReplaced(position, reply.current, reply.locked);
          savedOnce.current = true;
          setPhase('saved');
          return true;
        }
        case 'offline':
        case 'retry': {
          failures.current += 1;
          if (work.kind === 'answer') {
            // If a newer change replaced this one meanwhile, it carries this
            // request's unreported time too.
            const current = pending.read().answers.find((a) => a.partIndex === partIndex && a.position === position);
            if (current && current.clock !== work.answer.clock) pending.addElapsed(partIndex, position, work.answer.elapsedMs);
          }
          const wait = Math.max(reply.kind === 'retry' ? reply.afterMs : 0, retryDelay(failures.current));
          blockedUntil.current = Date.now() + wait;
          setPhase(reply.kind === 'offline' ? 'offline' : 'failed');
          schedule(wait);
          return false;
        }
        case 'closed': {
          // Nothing more is sent from this page. The record stays on the
          // device until the page the server moves on to (the next section,
          // or the results) has told the learner what could not be saved.
          const lost = pending.read().answers.filter((a) => a.partIndex === partIndex).length;
          halt();
          eventsRef.current.onClosed(lost, reply.message);
          return false;
        }
        case 'locked': {
          pending.removeAnswers((a) => a.partIndex === partIndex && a.position === position);
          eventsRef.current.onLocked(position, reply.message);
          return true;
        }
        case 'refused': {
          if (work.kind === 'move') pending.settleMove(work.clock);
          else pending.removeAnswers((a) => a.partIndex === partIndex && a.position === position && a.clock <= work.answer.clock);
          eventsRef.current.onRefused(work.kind === 'answer' ? position : null, reply.message);
          return true;
        }
        case 'signed-out':
          // Kept on the device for this account; sent again if it signs back in.
          halt();
          eventsRef.current.onSignedOut();
          return false;
        case 'not-found':
          halt();
          eventsRef.current.onNotFound();
          return false;
      }
    },
    [halt, partIndex, schedule],
  );

  const send = useCallback(
    async (work: Work, keepalive = false): Promise<SaveReply> => {
      if (work.kind === 'move') {
        const { status, data } = await postJson(
          `/api/attempts/${attemptId}/visit`,
          { partIndex, position: work.position, clock: work.clock },
          { keepalive },
        );
        return classifyReply(status, data);
      }
      const { answer } = work;
      const key = questionKey(answer.partIndex, answer.position);
      inFlight.current.set(key, answer.clock);
      try {
        const { status, data } = await postJson(
          `/api/attempts/${attemptId}/answer`,
          {
            partIndex: answer.partIndex,
            position: answer.position,
            response: answer.response,
            elapsedMs: Math.max(0, Math.min(MAX_ELAPSED_MS, Math.round(answer.elapsedMs))),
            clock: answer.clock,
          },
          { keepalive },
        );
        return classifyReply(status, data);
      } finally {
        inFlight.current.delete(key);
      }
    },
    [attemptId, partIndex],
  );

  const pump = useCallback((): Promise<void> => {
    if (running.current) return running.current;
    const run = (async () => {
      // Yield first, so this run is recorded as running before it can end:
      // with nothing to send, the body would otherwise finish (and clear the
      // record) before the assignment below, which would then stick.
      await null;
      setSending(true);
      try {
        for (;;) {
          if (haltedRef.current || !store.current) return;
          const wait = blockedUntil.current - Date.now();
          if (wait > 0) {
            schedule(wait);
            return;
          }
          const work = nextWork();
          if (!work) return;
          if ('waitMs' in work) {
            schedule(work.waitMs);
            return;
          }
          const reply = await send(work);
          touch();
          if (!handle(work, reply)) return;
        }
      } finally {
        running.current = null;
        setSending(false);
        touch();
      }
    })();
    running.current = run;
    return run;
  }, [handle, nextWork, schedule, send, touch]);

  const pumpRef = useRef(pump);
  pumpRef.current = pump;

  // --- Opening: the device's store, other accounts' records removed ----------

  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { storage, durable: isDurable } = deviceStorage();
    purgePending(storage, owner);
    store.current = new PendingStore(storage, owner, attemptId);
    setDurable(isDurable);
    setReady(true);
    if (typeof navigator !== 'undefined' && navigator.onLine === false) setPhase('offline');
  }, [attemptId, owner]);

  // Back online, or back to the page: try at once.
  useEffect(() => {
    const retry = () => {
      blockedUntil.current = 0;
      failures.current = 0;
      setPhase((current) => (current === 'offline' ? (savedOnce.current ? 'saved' : 'idle') : current));
      void pumpRef.current();
    };
    const offline = () => setPhase('offline');
    // Leaving or hiding the page: send what is waiting with keepalive, so it
    // can arrive even if the page is gone. It stays on the device until a
    // reply confirms it; a resend is recognised by the server and ignored.
    const leaving = () => {
      if (haltedRef.current) return;
      const record = store.current?.read();
      for (const answer of record?.answers ?? []) {
        if (answer.partIndex === partIndex) void send({ kind: 'answer', answer }, true);
      }
      if (record?.move && record.move.partIndex === partIndex) {
        void send({ kind: 'move', position: record.move.position, clock: record.move.clock }, true);
      }
    };
    const visibility = () => {
      if (document.visibilityState === 'hidden') leaving();
      else retry();
    };
    window.addEventListener('online', retry);
    window.addEventListener('offline', offline);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', leaving);
    return () => {
      // Leaving by a link inside the app fires no pagehide.
      leaving();
      window.removeEventListener('online', retry);
      window.removeEventListener('offline', offline);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', leaving);
      if (timer.current) window.clearTimeout(timer.current.id);
    };
  }, [partIndex, send]);

  // --- What the player calls ------------------------------------------------

  /**
   * Sorts what this device kept against the server's state, once, when the
   * player opens. Returns the answers to show as the learner's, and the
   * move to make; forgets the rest.
   */
  const open = useCallback(
    (server: { currentPartIndex: number; items: ServerItem[]; resumeClock: number | null }): Reconciled | null => {
      const pending = store.current;
      if (!pending) return null;
      const result = reconcile(pending.read(), server);
      const forget = [...result.settled, ...result.lost];
      pending.removeAnswers((a) => forget.some((f) => f.partIndex === a.partIndex && f.position === a.position && f.clock === a.clock));
      const record = pending.read();
      if (record.move && !result.move) pending.settleMove(record.move.clock);
      touch();
      void pump();
      return result;
    },
    [pump, touch],
  );

  /** Records a changed answer on the device, and sends it (after `debounceMs`, for typing). */
  const answer = useCallback(
    (position: number, response: Response | null, elapsedMs: number, debounceMs = 0): boolean => {
      const pending = store.current;
      if (!pending || haltedRef.current) return false;
      const key = questionKey(partIndex, position);
      const { durable: kept } = pending.putAnswer(
        { partIndex, position, response, clock: nextClock(), elapsedMs },
        !inFlight.current.has(key),
      );
      if (!kept) setDurable(false);
      notBefore.current.set(key, Date.now() + debounceMs);
      touch();
      if (debounceMs > 0) schedule(debounceMs);
      else void pump();
      return true;
    },
    [nextClock, partIndex, pump, schedule, touch],
  );

  /** Records a move on the device and sends it. Only the newest move is kept. */
  const move = useCallback(
    (position: number): void => {
      const pending = store.current;
      if (!pending || haltedRef.current) return;
      pending.putMove({ partIndex, position, clock: nextClock() });
      void pump();
    },
    [nextClock, partIndex, pump],
  );

  /**
   * Sends everything waiting now, typing included, and says how it went.
   * Used before anything the server must see the answers for first:
   * checking an answer, moving to a screen that commits this one, and
   * submitting.
   */
  const flush = useCallback(async (): Promise<FlushResult> => {
    notBefore.current.clear();
    blockedUntil.current = 0;
    for (let round = 0; round < 50; round += 1) {
      await pump();
      if (haltedRef.current) return 'halted';
      const waiting = (store.current?.read().answers ?? []).filter((a) => a.partIndex === partIndex);
      if (waiting.length === 0) return 'saved';
      if (blockedUntil.current > Date.now()) return phaseRef.current === 'failed' ? 'failed' : 'offline';
    }
    return 'failed';
  }, [partIndex, pump]);

  /**
   * Checks an answer (untimed practice): records it, sends it with a request
   * to release its explanation, and returns the server's reply. The answer
   * stays on the device until then, so an interrupted check keeps it.
   */
  const check = useCallback(
    async (position: number, response: Response, elapsedMs: number): Promise<SaveReply> => {
      const pending = store.current;
      if (!pending) return { kind: 'offline' };
      const clock = nextClock();
      pending.putAnswer({ partIndex, position, response, clock, elapsedMs }, true);
      const kept = pending.read().answers.find((a) => a.partIndex === partIndex && a.position === position);
      const { status, data } = await postJson(`/api/attempts/${attemptId}/answer`, {
        partIndex,
        position,
        response,
        elapsedMs: Math.max(0, Math.min(MAX_ELAPSED_MS, Math.round(kept?.elapsedMs ?? elapsedMs))),
        clock,
        reveal: true,
      });
      const reply = classifyReply(status, data);
      touch();
      if (reply.kind === 'saved') {
        pending.settleAnswer(partIndex, position, clock);
        savedOnce.current = true;
        setPhase('saved');
      } else if (reply.kind !== 'offline' && reply.kind !== 'retry') {
        handle({ kind: 'answer', answer: { partIndex, position, response, clock, elapsedMs } }, reply);
      } else {
        setPhase(reply.kind === 'offline' ? 'offline' : 'failed');
      }
      return reply;
    },
    [attemptId, handle, nextClock, partIndex, touch],
  );

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // --- Status ------------------------------------------------------------------

  const status = useMemo((): SaveStatus => {
    const waiting = ready ? (store.current?.read().answers ?? []).filter((a) => a.partIndex === partIndex) : [];
    const unsavedPositions = new Set(waiting.map((a) => a.position));
    const unsaved = waiting.length;
    let state: SaveState;
    if (halted) state = unsaved > 0 ? 'failed' : 'saved';
    else if (phase === 'offline') state = 'offline';
    else if (phase === 'failed' && unsaved > 0) state = 'failed';
    else if (sending || unsaved > 0) state = 'saving';
    else state = phase === 'saved' ? 'saved' : 'idle';
    return { state, unsaved, unsavedPositions, durable, halted };
    // `version` re-reads the device's store after every change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durable, halted, partIndex, phase, ready, sending, version]);

  /** Try now, after an offline spell or a failure. */
  const retryNow = useCallback(() => {
    blockedUntil.current = 0;
    failures.current = 0;
    if (phaseRef.current === 'failed') setPhase('idle');
    void pump();
  }, [pump]);

  return { ready, status, open, answer, move, flush, check, retryNow, nextClock };
}
