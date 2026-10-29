import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireRole } from '@/lib/auth/session';
import { grantReviewer, grantReviewerSchema } from '@/lib/content/human-review';

/**
 * Authorise a person to review questions (administrators only).
 *
 * The person must already have an account. They cannot review until they
 * confirm, signed in themselves, that the public wording of their credentials
 * is accurate (POST /api/admin/reviewers/confirm).
 */

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireRole('admin');
    const body = await readJson(request, grantReviewerSchema);
    const reviewer = await grantReviewer(getDb(), user, body);
    return ok({ reviewer });
  } catch (error) {
    return toErrorResponse(error);
  }
}
