import { ok, readJson, toErrorResponse } from '@/lib/api/http';
import { batchReviewGuard } from '@/lib/api/admin-batch';
import { applyBatch, batchApplySchema } from '@/lib/content/review-batches';

/**
 * Record a batch of approvals a reviewer made outside the site (administrators
 * only): from the CSV they returned, or from a selection on the batch screen.
 *
 * The reviewer of record is the reviewer named in the body, who must be an
 * active, confirmed reviewer for each question's exam and not its author, and
 * never the administrator sending the request. Only rows the reviewer marked
 * approved, whose question is still the exact version and content that was
 * sent, are approved; everything else is reported back. The rows are written
 * in chunks, each in its own transaction.
 */

export const dynamic = 'force-dynamic';
// Thousands of rows in chunks of 200 take seconds; the ceiling is for a slow database day.
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const { db, admin } = await batchReviewGuard(request);
    const body = await readJson(request, batchApplySchema);
    const result = await applyBatch(db, admin, body);
    return ok(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
