import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireRole } from '@/lib/auth/session';
import { revokeAccess, revokeAccessSchema } from '@/lib/admin/users';

/**
 * End access an administrator gave, now (administrators only). The grant's
 * row stays, stamped with who ended it; the reason goes to the audit log.
 */

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request, { params }: { params: Promise<{ userId: string; grantId: string }> }) {
  try {
    assertSameOrigin(request);
    const admin = await requireRole('admin');
    const { userId, grantId } = await params;
    const body = await readJson(request, revokeAccessSchema);
    await revokeAccess(getDb(), admin, userId, grantId, body.reason);
    return ok({ revoked: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
