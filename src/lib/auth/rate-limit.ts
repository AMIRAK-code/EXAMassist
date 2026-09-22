import { createHash } from 'node:crypto';
import type { Db } from '@/lib/db';

/**
 * Fixed-window rate limiting, stored in the database so it survives a restart
 * and works across workers.
 *
 * Buckets are hashed, so we never store a raw IP address.
 */

export interface RateLimitRule {
  /** Window length in seconds. */
  windowSeconds: number;
  /** Maximum requests allowed per window. */
  max: number;
}

export const RATE_LIMITS = {
  signIn: { windowSeconds: 900, max: 10 },
  signUp: { windowSeconds: 3600, max: 5 },
  guestStart: { windowSeconds: 3600, max: 20 },
  attemptStart: { windowSeconds: 3600, max: 60 },
  answerWrite: { windowSeconds: 60, max: 240 },
  contentFlag: { windowSeconds: 3600, max: 20 },
} as const satisfies Record<string, RateLimitRule>;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

function bucketKey(name: string, identifier: string): string {
  return `${name}:${createHash('sha256').update(identifier).digest('hex').slice(0, 32)}`;
}

export function checkRateLimit(
  db: Db,
  name: keyof typeof RATE_LIMITS,
  identifier: string,
  now = new Date(),
): RateLimitResult {
  const rule = RATE_LIMITS[name];
  const windowStart = Math.floor(now.getTime() / 1000 / rule.windowSeconds) * rule.windowSeconds;
  const bucket = bucketKey(name, identifier);

  const run = db.transaction(() => {
    db.prepare(
      `INSERT INTO rate_limits (bucket, window_start, count) VALUES (?, ?, 1)
       ON CONFLICT(bucket, window_start) DO UPDATE SET count = count + 1`,
    ).run(bucket, windowStart);
    return db.prepare('SELECT count FROM rate_limits WHERE bucket = ? AND window_start = ?').get(
      bucket,
      windowStart,
    ) as { count: number };
  });

  const { count } = run();
  const resetAt = (windowStart + rule.windowSeconds) * 1000;

  return {
    allowed: count <= rule.max,
    remaining: Math.max(0, rule.max - count),
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now.getTime()) / 1000)),
  };
}

/** Housekeeping: drop windows that can no longer be current. */
export function purgeRateLimits(db: Db, now = new Date()): number {
  const cutoff = Math.floor(now.getTime() / 1000) - 24 * 60 * 60;
  return db.prepare('DELETE FROM rate_limits WHERE window_start < ?').run(cutoff).changes;
}

/**
 * A stable-but-not-identifying key for an unauthenticated caller.
 * Prefers the authenticated user id when there is one.
 */
export function callerKey(request: Request, userId?: string | null): string {
  if (userId) return `user:${userId}`;
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}
