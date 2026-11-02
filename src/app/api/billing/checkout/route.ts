import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { PRICE_KEYS, type PriceKey } from '@/lib/billing/plans';
import { startHostedCheckout } from '@/lib/billing/checkout-sessions';
import { LOCALES } from '@/i18n/locales';
import { BILLING_COPY } from '@/lib/billing/service';

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
  returnTo: z.string().max(400).nullish(),
  /** The EU withdrawal-right acknowledgement. Must be ticked. */
  consent: z.literal(true),
  /** One per checkout page view: the idempotency key for Stripe. */
  requestId: z.string().regex(/^[A-Za-z0-9-]{8,64}$/),
  locale: z.enum(LOCALES).default('en'),
  country: z.string().regex(/^[A-Za-z]{2}$/).nullish(),
});

/**
 * Returns a hosted Checkout Session URL after server-side eligibility and
 * price validation. Payment collection is delegated to Stripe; access is
 * activated by verified webhooks only.
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
    const started = await startHostedCheckout(db, user, {
      offer: body.offer,
      examKey: body.examKey ?? null,
      sourceExam: body.sourceExam ?? null,
      returnTo: body.returnTo ?? null,
      consent: body.consent,
      requestId: body.requestId,
      country: body.country ?? null,
    }, { origin: new URL(request.url).origin, locale: body.locale });
    return ok(started);
  } catch (error) {
    return toErrorResponse(error);
  }
}
