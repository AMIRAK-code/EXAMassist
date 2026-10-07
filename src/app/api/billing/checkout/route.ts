import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { PLAN_KEYS, type PlanKey } from '@/lib/billing/config';
import { startCheckout } from '@/lib/billing/service';
import { countEvent, subjectFor } from '@/lib/analytics/funnel';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  plan: z.enum(PLAN_KEYS as [PlanKey, ...PlanKey[]]),
  /** The exam the learner came from, if any. It never changes the plan or the price. */
  exam: z.string().max(64).optional(),
});

/** A Stripe Checkout page for the chosen Premium plan. The browser goes there next. */
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
    const url = await startCheckout(db, user, body.plan, {}, { examKey: body.exam });
    await countEvent(db, 'checkout_start', subjectFor(body.exam));
    return ok({ url });
  } catch (error) {
    return toErrorResponse(error);
  }
}
