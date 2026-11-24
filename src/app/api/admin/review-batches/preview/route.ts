import { ok, readJson, toErrorResponse } from '@/lib/api/http';
import { batchReviewGuard } from '@/lib/api/admin-batch';
import { batchPreviewSchema, previewBatch } from '@/lib/content/review-batches';

/**
 * The dry run of a batch (administrators only): what recording these rows for
 * this reviewer would approve, what is already approved, what changed since it
 * was sent, and why every other row would be refused. Writes nothing but the
 * rate-limit counter.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const { db, admin } = await batchReviewGuard(request);
    const body = await readJson(request, batchPreviewSchema);
    return ok({ plan: await previewBatch(db, admin, body) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
