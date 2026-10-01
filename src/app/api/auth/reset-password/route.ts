import { cookies } from 'next/headers';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { CODE_FAILURE_MESSAGES, normaliseCode, resetPasswordWithCode } from '@/lib/auth/email-codes';
import { MAX_PASSWORD_LENGTH } from '@/lib/auth/password';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { SESSION_COOKIE, createSession, sessionCookieOptions } from '@/lib/auth/session';

/**
 * Sets a new password with a code from /api/auth/code. Every existing session
 * for the account ends, and this browser is signed in with a fresh one.
 */

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  code: z.string().max(20),
  password: z.string().min(1).max(MAX_PASSWORD_LENGTH),
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

    const result = await resetPasswordWithCode(db, { email: body.email, code, password: body.password });
    if (!result.ok) {
      if ('problem' in result) return fail(result.problem.code, result.problem.message, 400);
      return fail(`code-${result.failure}`, CODE_FAILURE_MESSAGES[result.failure], 400);
    }

    const session = (await createSession(db, result.user.id, false));
    const store = await cookies();
    store.set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));

    return ok({ userId: result.user.id });
  } catch (error) {
    return toErrorResponse(error);
  }
}
