import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';

/**
 * The two planning inputs a learner supplies: when they sit the exam and how
 * much time they can give it each week.
 *
 * They are stored on the learner's own user row, keyed by the session, never by
 * an id taken from the request. The plan itself is derived on read, so there is
 * nothing stale to invalidate.
 */

const MAX_YEARS_AHEAD = 3;

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD.')
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), {
    message: 'That is not a real date.',
  });

const bodySchema = z.object({
  /** null or '' clears the date. */
  targetDate: z.union([isoDateSchema, z.literal(''), z.null()]).optional(),
  /** 15 minutes to 28 hours a week: anything outside that is a typo, not a plan. */
  weeklyMinutes: z.number().int().min(15).max(1680),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const db = getDb();

    const body = await readJson(request, bodySchema);
    const targetDate = body.targetDate ? body.targetDate : null;

    if (targetDate) {
      const limit = new Date();
      limit.setFullYear(limit.getFullYear() + MAX_YEARS_AHEAD);
      if (Date.parse(`${targetDate}T00:00:00Z`) > limit.getTime()) {
        return fail(
          'invalid-request',
          `Choose a date within the next ${MAX_YEARS_AHEAD} years.`,
          400,
        );
      }
    }

    db.prepare('UPDATE users SET target_date = ?, weekly_minutes = ?, updated_at = ? WHERE id = ?').run(
      targetDate,
      body.weeklyMinutes,
      new Date().toISOString(),
      user.id,
    );

    return ok({ targetDate, weeklyMinutes: body.weeklyMinutes });
  } catch (error) {
    return toErrorResponse(error);
  }
}
