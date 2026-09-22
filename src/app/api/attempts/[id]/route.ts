import { getDb } from '@/lib/db';
import { ok, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { getAttemptState } from '@/lib/attempts/service';

/** Full attempt state. Answer keys are included only where the learner may see them. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    return ok(getAttemptState(getDb(), id, user.id));
  } catch (error) {
    return toErrorResponse(error);
  }
}
