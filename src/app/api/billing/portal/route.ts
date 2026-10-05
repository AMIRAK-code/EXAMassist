import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { openBillingPortal } from '@/lib/billing/service';

export const dynamic = 'force-dynamic';

/** Stripe's billing portal for the signed-in learner: plan changes, card, invoices, cancelling. */
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const db = getDb();

    const limit = await checkRateLimit(db, 'billingRequest', callerKey(request, user.id));
    if (!limit.allowed) {
      return fail('rate-limited', 'Too many tries. Please wait a few minutes.', 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }

    return ok({ url: await openBillingPortal(db, user.id) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
