import { cookies } from 'next/headers';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import type { UserRow } from '@/lib/db/rows';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { verifyPassword } from '@/lib/auth/password';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { SESSION_COOKIE, createSession, sessionCookieOptions } from '@/lib/auth/session';

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const db = getDb();

    // Limit per caller and per account, so neither a single IP nor a single
    // target address can be hammered.
    const byCaller = checkRateLimit(db, 'signIn', callerKey(request));
    if (!byCaller.allowed) {
      return fail('rate-limited', 'Too many sign-in attempts. Please try again later.', 429, {
        retryAfterSeconds: byCaller.retryAfterSeconds,
      });
    }

    const body = await readJson(request, bodySchema);

    const byAccount = checkRateLimit(db, 'signIn', `account:${body.email}`);
    if (!byAccount.allowed) {
      return fail('rate-limited', 'Too many sign-in attempts. Please try again later.', 429, {
        retryAfterSeconds: byAccount.retryAfterSeconds,
      });
    }

    const user = db
      .prepare('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL')
      .get(body.email) as UserRow | undefined;

    // verifyPassword spends comparable time when the account is missing, so a
    // wrong address and a wrong password are not distinguishable by timing.
    const valid = await verifyPassword(body.password, user?.password_hash ?? null);
    if (!user || !valid) {
      return fail('invalid-credentials', 'That email address and password do not match.', 401);
    }

    const now = new Date();
    const session = createSession(db, user.id, false, now);
    const store = await cookies();
    store.set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));

    return ok({ userId: user.id, role: user.role });
  } catch (error) {
    return toErrorResponse(error);
  }
}
