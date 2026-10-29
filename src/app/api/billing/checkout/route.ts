import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { PRICE_KEYS, type PriceKey } from '@/lib/billing/plans';
import { BILLING_COPY, startCheckout } from '@/lib/billing/service';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  /**
   * What is being bought. Every price key parses, so the service is the one
   * place that refuses what is not on sale (Premium, earlier plans) with its
   * own message.
   */
  offer: z.enum(PRICE_KEYS as [PriceKey, ...PriceKey[]]),
  /** The exam a Single Exam Pass is for. */
  examKey: z.string().max(64).nullish(),
  /** The exam the learner came from; never changes the plan or the price. */
  sourceExam: z.string().max(64).nullish(),
  /** The EU withdrawal-right acknowledgement. Must be ticked. */
  consent: z.literal(true),
  /** One per checkout page view: the idempotency key for Stripe. */
  requestId: z.string().regex(/^[A-Za-z0-9-]{8,64}$/),
  country: z.string().regex(/^[A-Za-z]{2}$/).nullish(),
});

/**
 * Creates what the checkout page is about to pay for (a Plus subscription, or
 * the invoice of a Single Exam Pass) and returns the client secret the browser
 * confirms with Stripe.js. The acting user comes from the session; whether it
 * may be sold is decided by the server (startCheckout), never by the page.
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
    const started = await startCheckout(db, user, {
      offer: body.offer,
      examKey: body.examKey ?? null,
      sourceExam: body.sourceExam ?? null,
      consent: body.consent,
      requestId: body.requestId,
      country: body.country ?? null,
    });
    return ok(started);
  } catch (error) {
    return toErrorResponse(error);
  }
}
