'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { AttemptError, startAttempt, startRetry } from '@/lib/attempts/service';
import { getExamConfig } from '@/lib/exams/registry';
import { setMistakeLabels } from '@/lib/learning/mistakes';

/**
 * Form actions for results and the mistake notebook. Each re-authenticates,
 * validates every field it is sent, and only acts on the signed-in learner's
 * own records. They work without JavaScript: a plain form post, then a
 * redirect to the next page.
 */

/** Only the learner's own results and notebook pages are valid places to return to. */
function returnPath(value: FormDataEntryValue | null, fallback: string): string {
  const path = typeof value === 'string' ? value : '';
  return /^\/(review(\?[\w=&-]*)?|attempt\/[0-9a-f-]{36}\/results(\/\d{1,3})?)$/.test(path) ? path : fallback;
}

function withNotice(path: string, notice: string): string {
  return `${path}${path.includes('?') ? '&' : '?'}notice=${encodeURIComponent(notice)}`;
}

function list(value: FormDataEntryValue | null, max: number): string[] {
  return String(value ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter((part) => /^[\w.-]{1,160}$/.test(part))
    .slice(0, max);
}

/** Asks missed questions again, as a separate retry session. */
export async function startRetryAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const db = getDb();
  const back = returnPath(formData.get('returnTo'), '/review');
  const examKey = String(formData.get('examKey') ?? '');
  const questionIds = list(formData.get('questionIds'), 50);
  const source = String(formData.get('sourceAttemptId') ?? '');
  const sourceAttemptId = /^[0-9a-f-]{36}$/.test(source) ? source : null;

  if (!checkRateLimit(db, 'attemptStart', `user:${user.id}`).allowed) redirect(withNotice(back, 'rate-limited'));

  let attemptId: string | null = null;
  let failure: string | null = null;
  try {
    attemptId = startRetry(db, { userId: user.id, examKey, questionIds, sourceAttemptId }).attemptId;
  } catch (error) {
    if (!(error instanceof AttemptError)) throw error;
    failure = error.code;
  }
  redirect(attemptId ? `/attempt/${attemptId}` : withNotice(back, failure ?? 'nothing-to-retry'));
}

/**
 * New-question practice on one skill or one topic. The server refuses to
 * build it from questions the learner has already been shown, so "new" is a
 * guarantee, not a preference.
 */
export async function practiseNewAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const db = getDb();
  const back = returnPath(formData.get('returnTo'), '/review');
  const config = getExamConfig(String(formData.get('examKey') ?? ''));
  if (!config) redirect(back);

  const skill = String(formData.get('skill') ?? '');
  const domain = String(formData.get('domain') ?? '');
  const knownSkill = config.domains.some((d) => d.skills.some((s) => s.slug === skill));
  const knownDomain = config.domains.some((d) => d.slug === domain);
  if (!knownSkill && !knownDomain) redirect(back);

  const requested = Number(formData.get('length') ?? 10);
  const length = Number.isFinite(requested) ? Math.max(1, Math.min(10, Math.round(requested))) : 10;

  if (!checkRateLimit(db, 'attemptStart', `user:${user.id}`).allowed) redirect(withNotice(back, 'rate-limited'));

  let attemptId: string | null = null;
  let failure: string | null = null;
  try {
    attemptId = startAttempt(db, {
      userId: user.id,
      examKey: config.examKey,
      blueprintId: 'practice',
      overrides: {
        ...(knownSkill ? { skills: [skill] } : { domains: [domain] }),
        difficulty: 'mixed',
        length,
        unseenOnly: true,
      },
    }).attemptId;
  } catch (error) {
    if (!(error instanceof AttemptError)) throw error;
    failure = error.code;
  }
  redirect(attemptId ? `/attempt/${attemptId}` : withNotice(back, failure ?? 'insufficient-content'));
}

/** Replaces the learner's labels on one missed question. */
export async function saveLabelsAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const back = returnPath(formData.get('returnTo'), '/review');
  const attemptItemId = String(formData.get('attemptItemId') ?? '');
  let notice = 'labels-saved';
  try {
    setMistakeLabels(getDb(), { userId: user.id, attemptItemId, labels: formData.getAll('label') });
  } catch (error) {
    if (!(error instanceof AttemptError)) throw error;
    notice = error.code;
  }
  revalidatePath('/review');
  redirect(`${withNotice(back, notice)}#labels`);
}

/**
 * Adds or removes a bookmark. The question must be one this learner has been
 * shown: an id posted from anywhere else is ignored rather than trusted.
 */
export async function toggleBookmarkAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const db = getDb();
  const back = returnPath(formData.get('returnTo'), '/review');
  const questionId = String(formData.get('questionId') ?? '');

  const owned = db
    .prepare(
      `SELECT a.exam_key AS examKey FROM attempt_items ai JOIN attempts a ON a.id = ai.attempt_id
        WHERE a.user_id = ? AND ai.question_id = ? LIMIT 1`,
    )
    .get(user.id, questionId) as { examKey: string } | undefined;
  if (owned) {
    const existing = db.prepare('SELECT 1 FROM bookmarks WHERE user_id = ? AND question_id = ?').get(user.id, questionId);
    if (existing) {
      db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND question_id = ?').run(user.id, questionId);
    } else {
      db.prepare(
        `INSERT INTO bookmarks (user_id, question_id, exam_key, note, created_at) VALUES (?, ?, ?, NULL, ?)
         ON CONFLICT(user_id, question_id) DO NOTHING`,
      ).run(user.id, questionId, owned.examKey, new Date().toISOString());
    }
  }
  revalidatePath('/review');
  redirect(back);
}
