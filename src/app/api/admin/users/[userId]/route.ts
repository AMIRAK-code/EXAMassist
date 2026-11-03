import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireRole } from '@/lib/auth/session';
import { setRole, setRoleSchema } from '@/lib/admin/users';

/**
 * Change an account's role (administrators only): learner, editor or admin.
 * Written to the audit log with the reason given.
 */

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    assertSameOrigin(request);
    const admin = await requireRole('admin');
    const { userId } = await params;
    const body = await readJson(request, setRoleSchema);
    await setRole(getDb(), admin, userId, body.role, body.reason);
    return ok({ role: body.role });
  } catch (error) {
    return toErrorResponse(error);
  }
}
