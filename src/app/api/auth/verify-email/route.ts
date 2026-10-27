import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { CODE_FAILURE_MESSAGES, normaliseCode, verifyEmailWithCode } from '@/lib/auth/email-codes';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';

/** Confirms the signed-in account's address with a code from /api/auth/code. */

const bodySchema = z.object({ code: z.string().max(20) });

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    if (user.isGuest || !user.email) {
      return fail('account-required', 'Create an account first: guest sessions have no email address.', 403);
    }

    const db = getDb();
    const limit = (await checkRateLimit(db, 'emailCodeVerify', callerKey(request, user.id)));
    if (!limit.allowed) {
      return fail('rate-limited', 'Too many attempts. Please try again later.', 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }

    const body = await readJson(request, bodySchema);
    if (user.emailVerifiedAt) return ok({ verified: true });

    const code = normaliseCode(body.code);
    if (!code) return fail('code-format', 'Enter the 6-digit code from the email.', 400);

    const outcome = await verifyEmailWithCode(db, { id: user.id, email: user.email }, code);
    if (outcome !== 'ok') return fail(`code-${outcome}`, CODE_FAILURE_MESSAGES[outcome], 400);

    return ok({ verified: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
