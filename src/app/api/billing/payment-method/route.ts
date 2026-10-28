import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { BILLING_COPY, finishCardUpdate } from '@/lib/billing/service';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({ setupIntentId: z.string().regex(/^seti_[A-Za-z0-9]+$/) });

/**
 * Makes a card just confirmed in the browser the default for every live
 * subscription. The server re-reads the SetupIntent from Stripe and checks it
 * belongs to this account's customer; nothing the browser says is trusted.
 */
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

    const body = await readJson(request, bodySchema);
    return ok(await finishCardUpdate(db, user.id, body.setupIntentId));
  } catch (error) {
    return toErrorResponse(error);
  }
}
