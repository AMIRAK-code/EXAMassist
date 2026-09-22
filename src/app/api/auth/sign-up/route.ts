import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { checkPasswordStrength, hashPassword } from '@/lib/auth/password';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import {
  SESSION_COOKIE,
  createSession,
  getCurrentUser,
  sessionCookieOptions,
} from '@/lib/auth/session';

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
  displayName: z.string().trim().min(1).max(60).optional(),
  /**
   * Self-declared, and used only to switch on age-appropriate handling. We do
   * not collect a date of birth.
   */
  isMinor: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const db = getDb();

    const limit = checkRateLimit(db, 'signUp', callerKey(request));
    if (!limit.allowed) {
      return fail('rate-limited', 'Too many attempts. Please try again later.', 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }

    const body = await readJson(request, bodySchema);

    const problem = checkPasswordStrength(body.password, body.email);
    if (problem) return fail(problem.code, problem.message, 400);

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(body.email) as
      | { id: string }
      | undefined;
    if (existing) {
      // Do not confirm which addresses are registered.
      return fail(
        'signup-failed',
        'That account could not be created. If you already have an account, sign in instead.',
        409,
      );
    }

    const passwordHash = await hashPassword(body.password);
    const now = new Date();
    const nowIso = now.toISOString();

    // A guest who signs up keeps the practice history they already built.
    const guest = await getCurrentUser();
    let userId: string;

    if (guest?.isGuest) {
      userId = guest.id;
      db.prepare(
        `UPDATE users SET email = ?, password_hash = ?, display_name = ?, is_guest = 0,
                          is_minor = ?, updated_at = ?
         WHERE id = ? AND is_guest = 1`,
      ).run(body.email, passwordHash, body.displayName ?? null, body.isMinor ? 1 : 0, nowIso, userId);
    } else {
      userId = randomUUID();
      db.prepare(
        `INSERT INTO users (id, email, password_hash, display_name, role, is_guest, locale,
                            is_minor, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'learner', 0, 'en', ?, ?, ?)`,
      ).run(userId, body.email, passwordHash, body.displayName ?? null, body.isMinor ? 1 : 0, nowIso, nowIso);
    }

    const session = createSession(db, userId, false, now);
    const store = await cookies();
    store.set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));

    return ok({ userId, upgradedFromGuest: Boolean(guest?.isGuest) }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
