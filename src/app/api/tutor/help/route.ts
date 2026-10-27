import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { questionHelp } from '@/lib/tutor/service';

/**
 * A hint or a deeper explanation for one question in one of the learner's own
 * sessions. Whether it is allowed is decided in the service from the attempt,
 * never from anything the browser claims.
 */

const bodySchema = z.object({
  attemptId: z.string().uuid(),
  partIndex: z.number().int().min(0).max(20),
  position: z.number().int().min(0).max(500),
  kind: z.enum(['hint', 'explain']),
  level: z.union([z.literal(1), z.literal(2)]).optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const db = getDb();

    const burst = (await checkRateLimit(db, 'tutorRequest', callerKey(request, user.id)));
    if (!burst.allowed) {
      return fail('rate-limited', 'That was a lot of requests in a short time. Please wait a moment.', 429, {
        retryAfterSeconds: burst.retryAfterSeconds,
      });
    }

    const body = await readJson(request, bodySchema);
    const result = await questionHelp(db, { userId: user.id, isGuest: user.isGuest }, body);
    return ok(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
