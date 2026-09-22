import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { submitPart } from '@/lib/attempts/service';

const bodySchema = z.object({ partIndex: z.number().int().min(0).max(50) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const body = await readJson(request, bodySchema);
    return ok(submitPart(getDb(), { attemptId: id, userId: user.id, partIndex: body.partIndex }));
  } catch (error) {
    return toErrorResponse(error);
  }
}
