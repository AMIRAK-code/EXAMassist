import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { debrief } from '@/lib/tutor/service';

/** The after-test guide for one of the learner's own finished sessions. */

const bodySchema = z.object({ attemptId: z.string().uuid() });

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
    const result = await debrief(db, { userId: user.id, isGuest: user.isGuest }, body.attemptId);
    return ok(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
