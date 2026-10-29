import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { recordReview, recordReviewSchema } from '@/lib/content/human-review';

/**
 * Record a human review decision: approve, or request changes.
 *
 * The acting reviewer is the session's account and nothing else. Whether they
 * may decide at all (an active, confirmed reviewer authorised for this exam,
 * not one of the question's authors), whether the version is current and
 * whether its content is what their page showed are all checked in
 * recordReview, so no client can talk its way past them. The decision is
 * appended to the ledger; nothing is ever edited.
 */

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const body = await readJson(request, recordReviewSchema);
    const record = await recordReview(getDb(), user, body);
    return ok({ review: record });
  } catch (error) {
    return toErrorResponse(error);
  }
}
