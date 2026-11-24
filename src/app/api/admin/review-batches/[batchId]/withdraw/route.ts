import { ok, readJson, toErrorResponse } from '@/lib/api/http';
import { batchReviewGuard } from '@/lib/api/admin-batch';
import { withdrawBatch, withdrawBatchSchema } from '@/lib/content/review-batches';

/**
 * Withdraw a batch recorded in error (administrators only). Every approval in
 * it stops counting at once; the rows stay in the ledger with the reason.
 */

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: Promise<{ batchId: string }> }) {
  try {
    const { db, admin } = await batchReviewGuard(request);
    const { batchId } = await params;
    const body = await readJson(request, withdrawBatchSchema);
    return ok({ batch: await withdrawBatch(db, admin, batchId, body.reason) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
