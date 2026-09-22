import { describe, expect, it } from 'vitest';
import {
  LATE_WRITE_GRACE_MS,
  acceptsWrite,
  addSeconds,
  computeDeadline,
  deadlineAfterResume,
  effectiveDeadline,
  formatRemaining,
  hasExpired,
  remainingSeconds,
} from '@/lib/assessment/timing';

const START = new Date('2026-09-21T10:00:00.000Z');

describe('computeDeadline', () => {
  it('adds the limit to the start time', () => {
    expect(computeDeadline(START, 35 * 60)).toBe('2026-09-21T10:35:00.000Z');
  });

  it('returns null for an untimed part', () => {
    expect(computeDeadline(START, null)).toBeNull();
  });
});

describe('effectiveDeadline', () => {
  const attempt = '2026-09-21T12:00:00.000Z';
  const part = '2026-09-21T10:35:00.000Z';

  it('takes the earlier of the attempt and part deadlines', () => {
    expect(effectiveDeadline(attempt, part)).toBe(part);
    expect(effectiveDeadline(part, attempt)).toBe(part);
  });

  it('falls back to whichever exists', () => {
    expect(effectiveDeadline(null, part)).toBe(part);
    expect(effectiveDeadline(attempt, null)).toBe(attempt);
    expect(effectiveDeadline(null, null)).toBeNull();
  });
});

describe('expiry', () => {
  const deadline = '2026-09-21T10:35:00.000Z';

  it('is not expired before the deadline', () => {
    expect(hasExpired(deadline, new Date('2026-09-21T10:34:59.999Z'))).toBe(false);
  });

  it('is expired exactly at the deadline', () => {
    expect(hasExpired(deadline, new Date('2026-09-21T10:35:00.000Z'))).toBe(true);
  });

  it('is expired after the deadline', () => {
    expect(hasExpired(deadline, new Date('2026-09-21T10:35:00.001Z'))).toBe(true);
  });

  it('never expires an untimed part', () => {
    expect(hasExpired(null, new Date('2099-01-01T00:00:00.000Z'))).toBe(false);
  });

  it('clamps remaining time at zero rather than going negative', () => {
    expect(remainingSeconds(deadline, new Date('2026-09-21T11:00:00.000Z'))).toBe(0);
    expect(remainingSeconds(deadline, new Date('2026-09-21T10:34:30.000Z'))).toBe(30);
  });
});

describe('late writes', () => {
  const deadline = '2026-09-21T10:35:00.000Z';

  it('accepts a write that lands inside the in-flight grace window', () => {
    const justAfter = new Date(new Date(deadline).getTime() + LATE_WRITE_GRACE_MS - 1);
    expect(acceptsWrite(deadline, justAfter)).toBe(true);
  });

  it('rejects a write beyond the grace window', () => {
    const tooLate = new Date(new Date(deadline).getTime() + LATE_WRITE_GRACE_MS + 1);
    expect(acceptsWrite(deadline, tooLate)).toBe(false);
  });

  it('the grace window is small enough not to be usable as extra time', () => {
    expect(LATE_WRITE_GRACE_MS).toBeLessThanOrEqual(5_000);
  });
});

describe('pause behaviour', () => {
  const deadline = '2026-09-21T10:35:00.000Z';
  const pausedAt = new Date('2026-09-21T10:10:00.000Z');
  const resumedAt = new Date('2026-09-21T10:20:00.000Z');

  it('a simulation clock keeps running while the learner is away', () => {
    expect(deadlineAfterResume(deadline, pausedAt, resumedAt, 'clock_runs')).toBe(deadline);
  });

  it('a practice clock is extended by the time away', () => {
    expect(deadlineAfterResume(deadline, pausedAt, resumedAt, 'clock_pauses')).toBe(
      '2026-09-21T10:45:00.000Z',
    );
  });

  it('never shortens the deadline if the timestamps are out of order', () => {
    expect(deadlineAfterResume(deadline, resumedAt, pausedAt, 'clock_pauses')).toBe(deadline);
  });

  it('leaves an untimed part untimed', () => {
    expect(deadlineAfterResume(null, pausedAt, resumedAt, 'clock_pauses')).toBeNull();
  });
});

describe('formatRemaining', () => {
  it('formats minutes and seconds', () => {
    expect(formatRemaining(0)).toBe('00:00');
    expect(formatRemaining(59)).toBe('00:59');
    expect(formatRemaining(95)).toBe('01:35');
    expect(formatRemaining(35 * 60)).toBe('35:00');
  });

  it('adds hours for long simulations', () => {
    expect(formatRemaining(2 * 3600 + 14 * 60)).toBe('2:14:00');
  });

  it('never renders a negative clock', () => {
    expect(formatRemaining(-30)).toBe('00:00');
  });
});

describe('addSeconds', () => {
  it('does not mutate the input date', () => {
    const before = START.getTime();
    addSeconds(START, 600);
    expect(START.getTime()).toBe(before);
  });
});
