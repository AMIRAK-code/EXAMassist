/**
 * Server-authoritative timing.
 *
 * The browser clock is never trusted. The client renders a countdown for
 * feedback only; every accept/reject decision is made here against timestamps
 * the server wrote.
 */

/**
 * Tolerance for a write that was in flight when the deadline passed. A learner
 * who clicks an answer at 00:00.4 remaining should not lose it to network
 * latency. Kept small so it cannot be used to gain meaningful extra time.
 */
export const LATE_WRITE_GRACE_MS = 3_000;

export type Clock = () => Date;

export const systemClock: Clock = () => new Date();

export function toIso(date: Date): string {
  return date.toISOString();
}

export function parseIso(value: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid timestamp: ${value}`);
  }
  return date;
}

export function addSeconds(from: Date, seconds: number): Date {
  return new Date(from.getTime() + seconds * 1000);
}

/** Deadline for a timed part or attempt. null means untimed. */
export function computeDeadline(startedAt: Date, limitSeconds: number | null): string | null {
  return limitSeconds === null ? null : toIso(addSeconds(startedAt, limitSeconds));
}

/**
 * The deadline actually in force: the earlier of the overall attempt deadline
 * and the current part deadline. Either may be absent.
 */
export function effectiveDeadline(
  attemptDeadlineIso: string | null,
  partDeadlineIso: string | null,
): string | null {
  if (attemptDeadlineIso === null) return partDeadlineIso;
  if (partDeadlineIso === null) return attemptDeadlineIso;
  return parseIso(attemptDeadlineIso) <= parseIso(partDeadlineIso) ? attemptDeadlineIso : partDeadlineIso;
}

export function remainingMs(deadlineIso: string | null, now: Date): number | null {
  if (deadlineIso === null) return null;
  return Math.max(0, parseIso(deadlineIso).getTime() - now.getTime());
}

export function remainingSeconds(deadlineIso: string | null, now: Date): number | null {
  const ms = remainingMs(deadlineIso, now);
  return ms === null ? null : Math.floor(ms / 1000);
}

/** Strict expiry: used to decide whether a part/attempt must be closed. */
export function hasExpired(deadlineIso: string | null, now: Date): boolean {
  if (deadlineIso === null) return false;
  return now.getTime() >= parseIso(deadlineIso).getTime();
}

/**
 * Whether a write (answer, flag, autosave) may still be accepted. Applies the
 * small in-flight grace on top of the strict deadline.
 */
export function acceptsWrite(deadlineIso: string | null, now: Date): boolean {
  if (deadlineIso === null) return true;
  return now.getTime() <= parseIso(deadlineIso).getTime() + LATE_WRITE_GRACE_MS;
}

/**
 * Pause semantics.
 *
 * - `clock_runs`   simulations: leaving does not stop the clock, exactly like
 *                  the real exam. Reconnecting shows the real time remaining.
 * - `clock_pauses` practice: the deadline is pushed forward by the time away.
 */
export type PauseBehaviour = 'clock_runs' | 'clock_pauses' | 'not_applicable';

export function deadlineAfterResume(
  deadlineIso: string | null,
  pausedAt: Date,
  resumedAt: Date,
  behaviour: PauseBehaviour,
): string | null {
  if (deadlineIso === null || behaviour !== 'clock_pauses') return deadlineIso;
  const awayMs = Math.max(0, resumedAt.getTime() - pausedAt.getTime());
  return toIso(new Date(parseIso(deadlineIso).getTime() + awayMs));
}

export function formatRemaining(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}
