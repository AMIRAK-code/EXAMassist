import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { PLAN_KEYS, type PlanKey } from '@/lib/billing/plans';
import { createSubscription } from '@/lib/billing/service';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  plan: z.enum(PLAN_KEYS as [PlanKey, ...PlanKey[]]),
  /** The exam a single-exam plan is for. */
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
 * Creates the subscription the checkout page is about to pay for, with
 * payment_behavior 'default_incomplete', and returns the client secret the
 * browser confirms with Stripe.js. The acting user comes from the session.
 */
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

    const body = await readJson(request, bodySchema);
    const created = await createSubscription(db, user, {
      plan: body.plan,
      examKey: body.examKey ?? null,
      sourceExam: body.sourceExam ?? null,
      consent: body.consent,
      requestId: body.requestId,
      country: body.country ?? null,
    });
    return ok(created);
  } catch (error) {
    return toErrorResponse(error);
  }
}
