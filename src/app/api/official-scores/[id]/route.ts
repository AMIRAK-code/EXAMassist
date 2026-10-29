import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { deleteOfficialScore, officialScoreInputSchema, updateOfficialScore } from '@/lib/learning/official-scores';

/**
 * Edit or delete one of the acting learner's own results. Another learner's
 * id is answered exactly like an id that does not exist (404).
 */

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const body = await readJson(request, officialScoreInputSchema);
    return ok({ result: await updateOfficialScore(getDb(), user.id, id, body) });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    await deleteOfficialScore(getDb(), user.id, id);
    return ok({ deleted: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
