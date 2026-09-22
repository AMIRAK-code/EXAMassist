import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { setFlag } from '@/lib/attempts/service';

const bodySchema = z.object({
  partIndex: z.number().int().min(0).max(50),
  position: z.number().int().min(0).max(500),
  flagged: z.boolean(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const body = await readJson(request, bodySchema);
    setFlag(getDb(), { attemptId: id, userId: user.id, ...body });
    return ok({ flagged: body.flagged });
  } catch (error) {
    return toErrorResponse(error);
  }
}
