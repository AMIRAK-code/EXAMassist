import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireRole } from '@/lib/auth/session';
import type { ContentFlagRow } from '@/lib/db/rows';
import { withdrawResponse } from '@/lib/tutor/service';

/**
 * Resolve a content report.
 *
 * Editors and administrators only; requireRole throws ForbiddenError, which
 * toErrorResponse turns into a 403, so a learner never gets a partial result.
 * The update is conditional on the flag still being open, so two editors
 * deciding at the same time cannot silently overwrite one another.
 */

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  status: z.enum(['accepted', 'rejected']),
  resolution: z.string().trim().min(5).max(500),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const user = await requireRole('admin', 'editor');
    const { id } = await params;
    const body = await readJson(request, bodySchema);

    const db = getDb();
    const flag = (await db.prepare('SELECT * FROM content_flags WHERE id = ?').get(id)) as
      | ContentFlagRow
      | undefined;

    if (!flag) {
      return fail('not-found', 'That content report does not exist.', 404);
    }
    if (flag.status !== 'open') {
      return fail(
        'already-resolved',
        `That report was already marked ${flag.status}. Reload the page to see the current decision.`,
        409,
      );
    }

    const now = new Date().toISOString();

    const applied = db.transaction(async () => {
      const info = (await db
        .prepare(
          `UPDATE content_flags
              SET status = ?, resolution = ?, resolved_at = ?
            WHERE id = ? AND status = 'open'`,
        )
        .run(body.status, body.resolution, now, id));

      if (info.changes === 0) return false;

      // An accepted report about an AI response withdraws that response, so
      // no other learner is shown the text an editor has agreed is wrong.
      const tutorResponseId = (flag as ContentFlagRow & { tutor_response_id?: string | null }).tutor_response_id ?? null;
      const withdrew = body.status === 'accepted' && tutorResponseId ? (await withdrawResponse(db, tutorResponseId, new Date(now))) : false;

      (await db.prepare(
        `INSERT INTO audit_log (actor_user_id, action, entity_type, entity_id, payload_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      ).run(
        user.id,
        `content_flag.${body.status}`,
        'content_flag',
        id,
        JSON.stringify({
          questionId: flag.question_id,
          questionVersionId: flag.question_version_id,
          reason: flag.reason,
          resolution: body.resolution,
          ...(withdrew ? { withdrewTutorResponse: tutorResponseId } : {}),
        }),
        now,
      ));

      return true;
    })();

    if (!applied) {
      return fail(
        'already-resolved',
        'Another editor resolved that report first. Reload the page to see the current decision.',
        409,
      );
    }

    return ok({ id, status: body.status, resolution: body.resolution, resolvedAt: now });
  } catch (error) {
    return toErrorResponse(error);
  }
}
