import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireRole } from '@/lib/auth/session';
import { revokeReviewer } from '@/lib/content/human-review';

/**
 * Withdraw a reviewer's authorisation (administrators only). Their recorded
 * decisions stay in the ledger.
 */

export const dynamic = 'force-dynamic';

const bodySchema = z.object({ reason: z.string().trim().min(5).max(500) });

export async function DELETE(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireRole('admin');
    const { userId } = await params;
    const body = await readJson(request, bodySchema);
    await revokeReviewer(getDb(), user, userId, body.reason);
    return ok({ revoked: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
