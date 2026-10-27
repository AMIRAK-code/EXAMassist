import { cookies } from 'next/headers';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { CODE_FAILURE_MESSAGES, normaliseCode, signInWithCode } from '@/lib/auth/email-codes';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { SESSION_COOKIE, createSession, sessionCookieOptions } from '@/lib/auth/session';

/** Signs in with a code from /api/auth/code instead of a password. */

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  code: z.string().max(20),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const db = getDb();

    const limit = (await checkRateLimit(db, 'emailCodeVerify', callerKey(request)));
    if (!limit.allowed) {
      return fail('rate-limited', 'Too many attempts. Please try again later.', 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }

    const body = await readJson(request, bodySchema);
    const code = normaliseCode(body.code);
    if (!code) return fail('code-format', 'Enter the 6-digit code from the email.', 400);

    const result = await signInWithCode(db, { email: body.email, code });
    if (!result.ok) return fail(`code-${result.failure}`, CODE_FAILURE_MESSAGES[result.failure], 400);

    const session = (await createSession(db, result.user.id, false));
    const store = await cookies();
    store.set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));

    return ok({ userId: result.user.id, role: result.user.role });
  } catch (error) {
    return toErrorResponse(error);
  }
}
