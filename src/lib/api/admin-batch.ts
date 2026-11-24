import { getDb, type Db } from '@/lib/db';
import { assertSameOrigin } from '@/lib/api/http';
import { requireRole, type AuthUser } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { ReviewError } from '@/lib/content/human-review';

/**
 * The checks every batch-review request passes before it touches anything,
 * in this order: same origin (CSRF), a signed-in administrator, and the
 * per-administrator rate limit. A refusal throws, and toErrorResponse turns it
 * into the usual error body.
 */
export async function batchReviewGuard(request: Request): Promise<{ db: Db; admin: AuthUser }> {
  assertSameOrigin(request);
  const admin = await requireRole('admin');
  const db = getDb();
  const limit = await checkRateLimit(db, 'adminReviewBatch', `user:${admin.id}`);
  if (!limit.allowed) {
    throw new ReviewError('rate-limited', `Too many batch requests. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`, 429);
  }
  return { db, admin };
}
