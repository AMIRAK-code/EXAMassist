import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { toPlainText } from '@/lib/markdown';

/**
 * Bookmarks: the learner's own shortlist of questions to come back to.
 *
 * Both handlers are scoped to the session's user id. A question id in the body
 * identifies a question, never a person, and is only accepted if this learner
 * has actually been shown that question in one of their own attempts.
 */

const postSchema = z.object({
  questionId: z.string().min(1).max(120),
  /** Optional: omit to toggle, or state the intended end state explicitly. */
  bookmarked: z.boolean().optional(),
});

interface BookmarkListRow {
  questionId: string;
  examKey: string;
  note: string | null;
  createdAt: string;
  stemMd: string | null;
  skillSlug: string | null;
  domainSlug: string | null;
}

export async function GET() {
  try {
    const user = await requireUser();
    const db = getDb();

    const rows = db
      .prepare(
        `SELECT
           b.question_id  AS questionId,
           b.exam_key     AS examKey,
           b.note         AS note,
           b.created_at   AS createdAt,
           qv.stem_md     AS stemMd,
           qv.skill_slug  AS skillSlug,
           qv.domain_slug AS domainSlug
         FROM bookmarks b
         LEFT JOIN questions q          ON q.id = b.question_id
         LEFT JOIN question_versions qv ON qv.question_id = q.id AND qv.version = q.current_version
         WHERE b.user_id = ?
         ORDER BY b.created_at DESC
         LIMIT 200`,
      )
      .all(user.id) as BookmarkListRow[];

    return ok({
      bookmarks: rows.map((row) => ({
        questionId: row.questionId,
        examKey: row.examKey,
        note: row.note,
        createdAt: row.createdAt,
        skillSlug: row.skillSlug,
        domainSlug: row.domainSlug,
        // A preview only: the full question and its explanation are served by
        // the review page, which checks entitlement per question.
        preview: row.stemMd ? toPlainText(row.stemMd, 160) : null,
      })),
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const db = getDb();

    const body = await readJson(request, postSchema);

    // Entitlement: the learner must have been shown this question.
    const owned = db
      .prepare(
        `SELECT a.exam_key AS examKey
           FROM attempt_items ai
           JOIN attempts a ON a.id = ai.attempt_id
          WHERE a.user_id = ? AND ai.question_id = ?
          LIMIT 1`,
      )
      .get(user.id, body.questionId) as { examKey: string } | undefined;

    if (!owned) {
      return fail(
        'not-found',
        'You can only bookmark a question you have been shown.',
        404,
      );
    }

    const existing = db
      .prepare('SELECT 1 AS present FROM bookmarks WHERE user_id = ? AND question_id = ?')
      .get(user.id, body.questionId) as { present: number } | undefined;

    const shouldBookmark = body.bookmarked ?? existing === undefined;

    if (shouldBookmark) {
      db.prepare(
        `INSERT INTO bookmarks (user_id, question_id, exam_key, note, created_at)
         VALUES (?, ?, ?, NULL, ?)
         ON CONFLICT(user_id, question_id) DO NOTHING`,
      ).run(user.id, body.questionId, owned.examKey, new Date().toISOString());
    } else {
      db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND question_id = ?').run(
        user.id,
        body.questionId,
      );
    }

    return ok({ questionId: body.questionId, examKey: owned.examKey, bookmarked: shouldBookmark });
  } catch (error) {
    return toErrorResponse(error);
  }
}
