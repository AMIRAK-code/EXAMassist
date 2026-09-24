import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { recordResponse } from '@/lib/attempts/service';
import { responseSchema } from '@/lib/assessment/types';

const bodySchema = z.object({
  partIndex: z.number().int().min(0).max(50),
  position: z.number().int().min(0).max(500),
  /** null clears the answer, which is a real action: it makes the item omitted. */
  response: responseSchema.nullable(),
  elapsedMs: z.number().int().min(0).max(30 * 60 * 1000).optional(),
  /**
   * Untimed practice: submit this answer and release its explanation. The
   * answer is locked from then on; the server refuses any later change.
   */
  reveal: z.boolean().optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const db = getDb();

    const limit = checkRateLimit(db, 'answerWrite', callerKey(request, user.id));
    if (!limit.allowed) {
      return fail('rate-limited', 'Too many updates at once.', 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }

    const body = await readJson(request, bodySchema);
    const result = recordResponse(db, {
      attemptId: id,
      userId: user.id,
      partIndex: body.partIndex,
      position: body.position,
      response: body.response,
      elapsedMs: body.elapsedMs,
      reveal: body.reveal,
    });
    return ok(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
