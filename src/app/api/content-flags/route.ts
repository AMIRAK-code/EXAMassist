import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import { getCurrentUser } from '@/lib/auth/session';

/**
 * Learner reports of a wrong or unclear question.
 *
 * Anyone may report, signed in or not: a broken question is worth hearing about
 * more than an account is worth requiring. Reports are rate limited and stored
 * as plain text; they are never rendered as Markdown.
 */

const REASONS = ['wrong_answer', 'ambiguous', 'typo', 'explanation', 'missing_material', 'other'] as const;

const bodySchema = z.object({
  questionId: z.string().trim().min(1).max(120),
  reason: z.enum(REASONS),
  details: z.string().trim().max(2000).optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const db = getDb();
    const user = await getCurrentUser();

    const limit = checkRateLimit(db, 'contentFlag', callerKey(request, user?.id ?? null));
    if (!limit.allowed) {
      return fail('rate-limited', 'You have sent several reports already. Please try again later.', 429, {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }

    const body = await readJson(request, bodySchema);

    // Record the version the reporter was actually looking at, when we can.
    const version = db
      .prepare(
        `SELECT qv.id AS id
         FROM question_versions qv
         JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version
         WHERE qv.question_id = ?`,
      )
      .get(body.questionId) as { id: string } | undefined;

    if (!version) {
      return fail('unknown-question', 'We could not find that question.', 404);
    }

    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO content_flags (id, question_id, question_version_id, user_id, reason, details,
                                  status, resolution, created_at, resolved_at)
       VALUES (?, ?, ?, ?, ?, ?, 'open', NULL, ?, NULL)`,
    ).run(
      randomUUID(),
      body.questionId,
      version.id,
      user?.id ?? null,
      body.reason,
      body.details ?? null,
      now,
    );

    return ok({ received: true }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
