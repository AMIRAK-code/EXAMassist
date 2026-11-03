import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireRole } from '@/lib/auth/session';
import { grantAccess, grantAccessSchema } from '@/lib/admin/users';

/**
 * Give an account Plus or a one-exam pass for a number of days, without a
 * payment (administrators only). Written to the audit log with the reason.
 */

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    assertSameOrigin(request);
    const admin = await requireRole('admin');
    const { userId } = await params;
    const body = await readJson(request, grantAccessSchema);
    const grant = await grantAccess(getDb(), admin, userId, body);
    return ok({ grant }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
