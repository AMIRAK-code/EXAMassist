'use server';

import { getLocale } from 'next-intl/server';
import { redirect as localeRedirect } from '@/i18n/navigation';
import { getDb } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { AttemptError, freeTestFor, startAttempt } from '@/lib/attempts/service';
import { getExamConfig } from '@/lib/exams/registry';
import { freeTestPath } from '@/lib/billing/config';
import { upgradeTarget } from '@/lib/billing/upgrade';

/**
 * Starts the free diagnostic for one exam. One per exam per account: pressing
 * the button again, or after a refresh, opens the same session rather than a
 * second one.
 */
export async function startFreeTestAction(formData: FormData): Promise<void> {
  const locale = await getLocale();
  // Every destination stays in the learner's language.
  const redirect: (href: string) => never = (href) => localeRedirect({ href, locale });
  const user = await requireUser();
  const config = getExamConfig(String(formData.get('examKey') ?? ''));
  if (!config) redirect('/exams');
  const back = freeTestPath(config.examKey);
  const db = getDb();

  const existing = await freeTestFor(db, user.id, config.examKey);
  if (existing) redirect(existing.status === 'in_progress' ? `/attempt/${existing.id}` : `/attempt/${existing.id}/results`);
  if (!(await checkRateLimit(db, 'attemptStart', `user:${user.id}`)).allowed) redirect(`${back}?notice=rate-limited`);

  let attemptId: string | null = null;
  let failure = 'insufficient-content';
  try {
    attemptId = (
      await startAttempt(db, {
        userId: user.id,
        examKey: config.examKey,
        blueprintId: 'diagnostic',
        freeTest: true,
        contentLocale: locale,
        idempotencyKey: `free-test:${user.id}:${config.examKey}`,
      })
    ).attemptId;
  } catch (error) {
    if (!(error instanceof AttemptError)) throw error;
    if (error.code === 'account-required') redirect(`/sign-up?next=${encodeURIComponent(back)}`);
    const upgrade = upgradeTarget(error);
    if (upgrade) redirect(upgrade);
    failure = error.code;
  }
  redirect(attemptId ? `/attempt/${attemptId}` : `${back}?notice=${encodeURIComponent(failure)}`);
}
