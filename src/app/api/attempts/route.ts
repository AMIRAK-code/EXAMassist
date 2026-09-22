import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { requireUser } from '@/lib/auth/session';
import { startAttempt } from '@/lib/attempts/service';

const bodySchema = z.object({
  examKey: z.string().min(1).max(64),
  blueprintId: z.string().min(1).max(64),
  overrides: z
    .object({
      sectionKey: z.string().max(64).optional(),
      domains: z.array(z.string().max(80)).max(40).optional(),
      skills: z.array(z.string().max(80)).max(40).optional(),
      difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']).optional(),
      length: z.number().int().min(1).max(100).optional(),
    })
    .optional(),
  /**
   * Supplied by the client so a double submit, a retry or a refresh during
   * creation yields one attempt rather than several.
   */
  idempotencyKey: z.string().min(8).max(100).optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const db = getDb();

    const limit = checkRateLimit(db, 'attemptStart', callerKey(request, user.id));
    if (!limit.allowed) {
      return fail('rate-limited', 'You have started a lot of sessions. Please wait a moment.', 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }

    const body = await readJson(request, bodySchema);

    const result = startAttempt(db, {
      userId: user.id,
      examKey: body.examKey,
      blueprintId: body.blueprintId,
      overrides: body.overrides,
      idempotencyKey: body.idempotencyKey ?? null,
    });

    return ok(result, { status: result.reused ? 200 : 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
