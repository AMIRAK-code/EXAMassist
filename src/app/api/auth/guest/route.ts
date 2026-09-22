import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import {
  SESSION_COOKIE,
  createGuestUser,
  createSession,
  getCurrentUser,
  sessionCookieOptions,
} from '@/lib/auth/session';

/**
 * Starts a guest session so a visitor can practise immediately.
 *
 * A guest is a real user row with no personal data at all, so progress
 * persists and can be claimed later by signing up.
 */
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const db = getDb();

    const existing = await getCurrentUser();
    if (existing) return ok({ userId: existing.id, created: false, isGuest: existing.isGuest });

    const limit = checkRateLimit(db, 'guestStart', callerKey(request));
    if (!limit.allowed) {
      return fail('rate-limited', 'Too many sessions started. Please try again later.', 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }

    const user = createGuestUser(db);
    const session = createSession(db, user.id, true);
    const store = await cookies();
    store.set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));

    return ok({ userId: user.id, created: true, isGuest: true }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
