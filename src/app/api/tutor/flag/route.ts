import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { flagResponse } from '@/lib/tutor/service';

/**
 * A learner reporting an AI response as wrong or unhelpful. It joins the same
 * editorial queue as question reports, linked to the exact text they saw.
 */

const bodySchema = z.object({
  responseId: z.string().uuid(),
  details: z.string().trim().max(2000).optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const db = getDb();

    const limit = checkRateLimit(db, 'contentFlag', callerKey(request, user.id));
    if (!limit.allowed) {
      return fail('rate-limited', 'You have sent several reports already. Please try again later.', 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }

    const body = await readJson(request, bodySchema);
    flagResponse(db, { userId: user.id, isGuest: user.isGuest }, body);
    return ok({ received: true }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
