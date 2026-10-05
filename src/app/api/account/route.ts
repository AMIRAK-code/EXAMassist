import { cookies } from 'next/headers';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import type { UserRow } from '@/lib/db/rows';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { SESSION_COOKIE, requireUser, toAuthUser } from '@/lib/auth/session';
import { getExamConfig } from '@/lib/exams/registry';
import { cancelBeforeDeletion } from '@/lib/billing/service';

/**
 * The acting learner's own account.
 *
 * Every statement here is keyed on the id resolved from the session cookie.
 * Nothing in the request body can name a different account, so there is no
 * object to fail to authorise.
 */

export const dynamic = 'force-dynamic';

/**
 * Interface languages the application actually ships. Kept as an allowlist so a
 * stored locale is always one the UI can render.
 */
const SUPPORTED_LOCALES = ['en'] as const;

const patchSchema = z.object({
  /** null or an empty string clears the name. */
  displayName: z.string().max(60).nullable().optional(),
  locale: z.enum(SUPPORTED_LOCALES).optional(),
  /** null clears the target exam. */
  targetExamKey: z.string().max(64).nullable().optional(),
  // No exam date here: each exam has one, beside its goal (exam_targets, migration 007).
});

const deleteSchema = z.object({
  confirm: z.string().max(254),
});

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const body = await readJson(request, patchSchema);

    const fields: string[] = [];
    const values: Array<string | number | null> = [];

    if ('displayName' in body) {
      const trimmed = body.displayName?.trim();
      fields.push('display_name = ?');
      values.push(trimmed ? trimmed : null);
    }

    if ('locale' in body && body.locale !== undefined) {
      fields.push('locale = ?');
      values.push(body.locale);
    }

    if ('targetExamKey' in body) {
      const key = body.targetExamKey?.trim();
      if (key) {
        if (!getExamConfig(key)) {
          return fail('unknown-exam', 'That is not an exam we cover.', 400);
        }
        fields.push('target_exam_key = ?');
        values.push(key);
      } else {
        fields.push('target_exam_key = ?');
        values.push(null);
      }
    }

    if (fields.length === 0) {
      return fail('no-changes', 'There was nothing to change.', 400);
    }

    const db = getDb();
    fields.push('updated_at = ?');
    values.push(new Date().toISOString());

    (await db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`).run(
      ...values,
      user.id,
    ));

    const updated = (await db
      .prepare('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL')
      .get(user.id)) as UserRow | undefined;
    if (!updated) {
      return fail('not-found', 'That account no longer exists.', 404);
    }

    return ok({ account: toAuthUser(updated) });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/**
 * Deletes the account for real.
 *
 * The user row goes, and ON DELETE CASCADE takes sessions, attempts, attempt
 * parts, items, events, results, bookmarks, the review queue, goals, and study
 * plans with their sessions, with it. Content reports are kept for the editorial record but are unlinked
 * from the person who filed them.
 */
export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const body = await readJson(request, deleteSchema);

    const typed = body.confirm.trim();
    const expected = user.email ? user.email.toLowerCase() : 'DELETE';
    const matches = user.email
      ? typed.toLowerCase() === expected
      : typed.toUpperCase() === expected;

    if (!matches) {
      return fail(
        'confirmation-mismatch',
        user.email
          ? 'To confirm, type the email address on this account exactly.'
          : 'To confirm, type DELETE in capital letters.',
        400,
      );
    }

    const db = getDb();
    // End any Premium subscription first: nobody is billed for an account that
    // no longer exists. If Stripe cannot confirm it, nothing is deleted.
    await cancelBeforeDeletion(db, user.id);
    const purge = db.transaction(async (userId: string) => {
      (await db.prepare('UPDATE content_flags SET user_id = NULL WHERE user_id = ?').run(userId));
      (await db.prepare('DELETE FROM users WHERE id = ?').run(userId));
    });
    (await purge(user.id));

    const store = await cookies();
    store.delete(SESSION_COOKIE);

    return ok({ deleted: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
