import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { setCancelAtPeriodEnd } from '@/lib/billing/service';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({ cancelAtPeriodEnd: z.boolean() });

/**
 * Cancel at the end of the paid period, or resume. Only the owner's own
 * subscriptions can be changed; anyone else's looks like one that does not exist.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const db = getDb();
    const { id } = await params;
    if (!/^sub_[A-Za-z0-9]+$/.test(id)) return fail('unknown-subscription', 'That subscription was not found.', 404);

    const limit = await checkRateLimit(db, 'billingRequest', callerKey(request, user.id));
    if (!limit.allowed) {
      return fail('rate-limited', 'Too many tries. Please wait a few minutes.', 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }

    const body = await readJson(request, bodySchema);
    const row = await setCancelAtPeriodEnd(db, user.id, id, body.cancelAtPeriodEnd);
    return ok({
      subscriptionId: row.stripe_subscription_id,
      status: row.status,
      cancelAtPeriodEnd: row.cancel_at_period_end === 1,
      currentPeriodEnd: row.current_period_end,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
