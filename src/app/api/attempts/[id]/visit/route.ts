import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { visitPosition } from '@/lib/attempts/service';

const bodySchema = z.object({
  partIndex: z.number().int().min(0).max(50),
  position: z.number().int().min(0).max(500),
  /** The player's server-anchored clock, in milliseconds; orders resume writes. */
  clock: z.number().int().nonnegative().optional(),
});

/**
 * Records navigation, and enforces it: illegal moves are rejected server-side.
 * The move is also stored as the attempt's resume position, unless a newer one
 * is already stored (`recorded: false`).
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const body = await readJson(request, bodySchema);
    const result = visitPosition(getDb(), { attemptId: id, userId: user.id, ...body });
    return ok(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
