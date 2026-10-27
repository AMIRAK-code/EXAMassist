import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { BILLING_COPY, startCardUpdate } from '@/lib/billing/service';

export const dynamic = 'force-dynamic';

/** A SetupIntent for replacing the card, confirmed on the account page in Stripe's iframes. */
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const db = getDb();

    const limit = await checkRateLimit(db, 'billingRequest', callerKey(request, user.id));
    if (!limit.allowed) {
      return fail('rate-limited', BILLING_COPY.rateLimited, 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
        messageKey: 'rateLimited',
      });
    }

    return ok(await startCardUpdate(db, user.id));
  } catch (error) {
    return toErrorResponse(error);
  }
}
