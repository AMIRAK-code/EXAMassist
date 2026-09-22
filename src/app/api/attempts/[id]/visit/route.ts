import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { visitPosition } from '@/lib/attempts/service';

const bodySchema = z.object({
  partIndex: z.number().int().min(0).max(50),
  position: z.number().int().min(0).max(500),
});

/** Records navigation, and enforces it: illegal moves are rejected server-side. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const body = await readJson(request, bodySchema);
    visitPosition(getDb(), { attemptId: id, userId: user.id, ...body });
    return ok({ position: body.position });
  } catch (error) {
    return toErrorResponse(error);
  }
}
