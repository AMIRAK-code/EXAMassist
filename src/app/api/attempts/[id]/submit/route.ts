import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { submitAttempt } from '@/lib/attempts/service';

/** Idempotent: submitting twice returns the same finished attempt, never a second score. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    return ok(submitAttempt(getDb(), { attemptId: id, userId: user.id }));
  } catch (error) {
    return toErrorResponse(error);
  }
}
