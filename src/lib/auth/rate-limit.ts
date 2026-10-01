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
  // Bursts only; the daily AI allowance is counted separately from real model calls.
  tutorRequest: { windowSeconds: 60, max: 12 },
  // Email codes (migration 009): per caller, and per address so nobody can
  // flood one inbox. Guessing is also capped per code (MAX_CODE_ATTEMPTS).
  emailCodeRequest: { windowSeconds: 3600, max: 10 },
  emailCodeAddress: { windowSeconds: 3600, max: 5 },
  emailCodeVerify: { windowSeconds: 900, max: 20 },
} as const satisfies Record<string, RateLimitRule>;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

function bucketKey(name: string, identifier: string): string {
  return `${name}:${createHash('sha256').update(identifier).digest('hex').slice(0, 32)}`;
}

export async function checkRateLimit(
  db: Db,
  name: keyof typeof RATE_LIMITS,
  identifier: string,
  now = new Date(),
): Promise<RateLimitResult> {
  const rule = RATE_LIMITS[name];
  const windowStart = Math.floor(now.getTime() / 1000 / rule.windowSeconds) * rule.windowSeconds;
  const bucket = bucketKey(name, identifier);

  const run = db.transaction(async () => {
    (await db.prepare(
      `INSERT INTO rate_limits (bucket, window_start, count) VALUES (?, ?, 1)
       ON CONFLICT(bucket, window_start) DO UPDATE SET count = count + 1`,
    ).run(bucket, windowStart));
    return (await db.prepare('SELECT count FROM rate_limits WHERE bucket = ? AND window_start = ?').get(
      bucket,
      windowStart,
    )) as { count: number };
  });

  const { count } = (await run());
  const resetAt = (windowStart + rule.windowSeconds) * 1000;

  return {
    allowed: count <= rule.max,
    remaining: Math.max(0, rule.max - count),
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now.getTime()) / 1000)),
  };
}

/** Housekeeping: drop windows that can no longer be current. */
export async function purgeRateLimits(db: Db, now = new Date()): Promise<number> {
  const cutoff = Math.floor(now.getTime() / 1000) - 24 * 60 * 60;
  return (await db.prepare('DELETE FROM rate_limits WHERE window_start < ?').run(cutoff)).changes;
}

/**
 * A stable-but-not-identifying key for an unauthenticated caller.
 * Prefers the authenticated user id when there is one.
 */
export function callerKey(request: Request, userId?: string | null): string {
  if (userId) return `user:${userId}`;
  return `ip:${clientAddress(request.headers)}`;
}

/**
 * The caller's address, as reported by the proxy in front of us.
 *
 * X-Forwarded-For is a list that every hop APPENDS to, so its first entry is
 * whatever the client chose to send - trusting it lets anyone dodge a per-IP
 * limit by inventing a new address per request. The trustworthy entry is the
 * one added by our own nearest proxy: the last one, or, behind N proxies we
 * operate, the Nth from the end (TRUSTED_PROXY_HOPS, default 1).
 *
 * Next.js fills the header with the socket address only when the client sent
 * none, so a deployment that exposes `next start` directly, with no proxy in
 * front, cannot tell a forged header from a real one. Deploy behind a proxy
 * that sets or appends X-Forwarded-For; see docs/HANDOFF.md.
 */
export function clientAddress(headers: Headers, env: Record<string, string | undefined> = process.env): string {
  const hops = Math.max(1, Number.parseInt(env.TRUSTED_PROXY_HOPS ?? '1', 10) || 1);
  const chain = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (chain.length > 0) return chain[Math.max(0, chain.length - hops)];
  return headers.get('x-real-ip')?.trim() || 'unknown';
}
