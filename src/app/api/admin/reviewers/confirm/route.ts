import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { confirmReviewer } from '@/lib/content/human-review';

/**
 * A reviewer confirms, on their own account, that the public wording of their
 * credentials is accurate and may be shown next to their approvals.
 */

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const reviewer = await confirmReviewer(getDb(), user);
    return ok({ reviewer });
  } catch (error) {
    return toErrorResponse(error);
  }
}
