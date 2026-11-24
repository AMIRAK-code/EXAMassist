import { NextResponse } from 'next/server';
import { readJson, toErrorResponse } from '@/lib/api/http';
import { batchReviewGuard } from '@/lib/api/admin-batch';
import { exportForReview, pendingFilterSchema } from '@/lib/content/review-batches';

/**
 * The CSV sent to reviewers (administrators only): questions awaiting review
 * that match the filters, with their exact version and content fingerprint
 * and empty decision columns. A POST, not a link, because it records what was
 * sent; the returned file is checked against that record.
 */

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const { db, admin } = await batchReviewGuard(request);
    const filter = await readJson(request, pendingFilterSchema);
    const result = await exportForReview(db, admin, filter);
    return new NextResponse(result.csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${result.fileName}"`,
        'Cache-Control': 'no-store',
        'X-Export-Id': result.exportId,
        'X-Export-Count': String(result.itemCount),
        'X-Export-Truncated': result.truncated ? '1' : '0',
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
