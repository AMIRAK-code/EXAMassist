import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { emailCodesMailer, prepareCodeForAddress, prepareVerificationEmail } from '@/lib/auth/email-codes';
import { callerKey, checkRateLimit, type RateLimitResult } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { deliverAfterResponse } from '@/lib/email/deliver';

/**
 * Sends a one-time code by email.
 *
 *   { purpose: 'sign-in' | 'reset-password', email }  - anyone; the answer is
 *       the same whether or not an account uses the address, so this cannot be
 *       used to find out who has an account.
 *   { purpose: 'verify-email' }  - the signed-in account's own address.
 */

const addressRequest = z.object({
  purpose: z.enum(['sign-in', 'reset-password']),
  email: z.string().trim().toLowerCase().email().max(254),
});
const verifyRequest = z.object({ purpose: z.literal('verify-email') });
const bodySchema = z.union([addressRequest, verifyRequest]);

function tooMany(limit: RateLimitResult) {
  return fail('rate-limited', 'Too many codes requested. Please try again later.', 429, {
    retryAfterSeconds: limit.retryAfterSeconds,
  });
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const mailer = emailCodesMailer();
    if (!mailer) {
      return fail('email-unavailable', 'Email codes are not available on this site yet.', 503);
    }

    const db = getDb();
    const byCaller = (await checkRateLimit(db, 'emailCodeRequest', callerKey(request)));
    if (!byCaller.allowed) return tooMany(byCaller);

    const body = await readJson(request, bodySchema);

    if (body.purpose === 'verify-email') {
      const user = await requireUser();
      if (user.isGuest || !user.email) {
        return fail('account-required', 'Create an account first: guest sessions have no email address.', 403);
      }
      if (user.emailVerifiedAt) return ok({ sent: false, alreadyVerified: true });

      const byAccount = (await checkRateLimit(db, 'emailCodeAddress', `user:${user.id}`));
      if (!byAccount.allowed) return tooMany(byAccount);

      // Sent before answering: the learner is waiting for this one, and a
      // failure should say so rather than leave them watching an empty inbox.
      const message = await prepareVerificationEmail(db, { id: user.id, email: user.email });
      await mailer(message);
      return ok({ sent: true });
    }

    const byAddress = (await checkRateLimit(db, 'emailCodeAddress', `address:${body.email}`));
    if (!byAddress.allowed) return tooMany(byAddress);

    const message = await prepareCodeForAddress(db, body);
    if (message) deliverAfterResponse(mailer, message);

    return ok({ sent: true }, { status: 202 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
