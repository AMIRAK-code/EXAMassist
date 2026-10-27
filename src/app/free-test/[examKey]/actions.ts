'use server';

import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { AttemptError, startAttempt } from '@/lib/attempts/service';
import { getExamConfig } from '@/lib/exams/registry';
import { freeTestPath } from '@/lib/billing/config';

/**
 * Starts the free test for one exam. The idempotency key is per learner, so
 * pressing the button twice, or again after a refresh, opens the same session
 * rather than a second one.
 */
export async function startFreeTestAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const config = getExamConfig(String(formData.get('examKey') ?? ''));
  if (!config) redirect('/exams');
  const back = freeTestPath(config.examKey);
  const db = getDb();
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
        idempotencyKey: `free-test:${user.id}`,
      })
    ).attemptId;
  } catch (error) {
    if (!(error instanceof AttemptError)) throw error;
    failure = error.code;
  }
  if (failure === 'account-required') redirect(`/sign-up?next=${encodeURIComponent(back)}`);
  if (failure === 'premium-required') redirect(`/premium?reason=free-test-used&exam=${encodeURIComponent(config.examKey)}`);
  redirect(attemptId ? `/attempt/${attemptId}` : `${back}?notice=${encodeURIComponent(failure)}`);
}
