'use server';

import { getLocale } from 'next-intl/server';
import { redirect as localeRedirect } from '@/i18n/navigation';
import { getDb } from '@/lib/db';
import { requireUser } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { AttemptError, startAttempt, startRetry } from '@/lib/attempts/service';
import { getExamConfig } from '@/lib/exams/registry';
import { upgradeTarget } from '@/lib/billing/upgrade';
import { requireEntitlement, EntitlementError } from '@/lib/billing/entitlements';
import {
  PlanError,
  activePlan,
  applyAdjustment,
  createPlan,
  endPlan,
  examDateFor,
  linkStartedSession,
  openSession,
  resolveDateConflict,
  retryableMissed,
  setExamDate,
  skipSession,
} from '@/lib/learning/plan';
import { parsePlanDate, parseWeeklyMinutes } from '@/lib/learning/plan-inputs';

/**
 * Form actions for the study plan. Each re-authenticates, validates every
 * field it is sent, and acts only on the signed-in learner's own plan. They
 * work without JavaScript: a plain form post, then a redirect.
 *
 * Nothing here changes the plan unless the learner pressed the button that
 * says so: creating it, starting or skipping one session, applying an
 * adjustment they have previewed, or ending it.
 */

/**
 * Redirects within the site in the learner's language. Paths are the English
 * ones ("/study-plan"); notice codes in the query are shown translated by
 * PlanningNotice on the page they land on.
 */
function redirect(href: string, locale: string): never {
  return localeRedirect({ href, locale });
}

/** Only the planning views are valid places to return to, with an exam from the registry. */
function planPath(view: 'plan' | 'progress' | 'adjust', examKey: string | null, notice?: string): string {
  const base = view === 'plan' ? '/study-plan' : view === 'progress' ? '/study-plan/progress' : '/study-plan/adjust';
  const params = new URLSearchParams();
  if (examKey && getExamConfig(examKey)) params.set('exam', examKey);
  if (notice) params.set('notice', notice);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

function returnView(value: FormDataEntryValue | null): 'plan' | 'progress' {
  return value === 'progress' ? 'progress' : 'plan';
}

const field = (formData: FormData, name: string) => String(formData.get(name) ?? '');

/** Study plans are part of a paid plan for the exam: refused learners go to its pricing page. */
async function requireStudyPlan(userId: string, examKey: string, locale: string): Promise<void> {
  try {
    await requireEntitlement(getDb(), userId, 'study_plan', examKey);
  } catch (error) {
    if (error instanceof EntitlementError) redirect(error.detail.upgradeHref, locale);
    throw error;
  }
}

/** Creates the plan the learner has just previewed. */
export async function createPlanAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const locale = await getLocale();
  const db = getDb();
  const config = getExamConfig(field(formData, 'examKey'));
  if (!config) redirect('/study-plan', locale);
  await requireStudyPlan(user.id, config.examKey, locale);
  const weeklyMinutes = parseWeeklyMinutes(field(formData, 'weeklyMinutes'));
  const date = parsePlanDate(field(formData, 'examDate'));
  if (weeklyMinutes === null || date === 'invalid') redirect(planPath('plan', config.examKey, 'invalid-plan-input'), locale);

  let notice = 'plan-created';
  try {
    (await createPlan(db, { userId: user.id, examKey: config.examKey, weeklyMinutes, examDate: date }));
    // The date chosen here is the exam date, kept with the target score.
    if (date !== (await examDateFor(db, user.id, config.examKey)).examDate) (await setExamDate(db, user.id, config.examKey, date));
    // The weekly time is remembered as the default for the next plan, and
    // the old plan's unattached date, offered at setup, has now been seen.
    (await db.prepare('UPDATE users SET weekly_minutes = ?, target_date = NULL, updated_at = ? WHERE id = ?').run(
      weeklyMinutes,
      new Date().toISOString(),
      user.id,
    ));
  } catch (error) {
    if (!(error instanceof PlanError)) throw error;
    notice = error.code;
  }
  redirect(planPath('plan', config.examKey, notice), locale);
}

/**
 * Starts a planned session with exactly its settings: new questions only for
 * a new session (enforced when it is built), a retry of missed questions for
 * a review. Starting it links the attempt to the session; only finishing that
 * attempt can complete it.
 */
export async function startPlanSessionAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const locale = await getLocale();
  const db = getDb();
  const planned = (await openSession(db, user.id, field(formData, 'sessionId')));
  if (!planned) redirect(planPath('plan', field(formData, 'examKey'), 'session-closed'), locale);
  if (!(await checkRateLimit(db, 'attemptStart', `user:${user.id}`)).allowed) redirect(planPath('plan', planned.examKey, 'rate-limited'), locale);

  let attemptId: string | null = null;
  let failure = 'insufficient-content';
  try {
    if (planned.kind === 'review') {
      const questionIds = (await retryableMissed(db, user.id, planned.examKey)).slice(0, planned.questionCount);
      attemptId = (await startRetry(db, { userId: user.id, examKey: planned.examKey, questionIds, contentLocale: locale })).attemptId;
    } else {
      attemptId = (await startAttempt(db, {
        userId: user.id,
        contentLocale: locale,
        examKey: planned.examKey,
        blueprintId: 'practice',
        overrides: {
          ...(planned.skillSlug ? { skills: [planned.skillSlug] } : planned.domainSlug ? { domains: [planned.domainSlug] } : {}),
          difficulty: 'mixed',
          length: planned.questionCount,
          ...(planned.kind === 'new' || planned.kind === 'mixed' ? { unseenOnly: true } : {}),
        },
      })).attemptId;
    }
    (await linkStartedSession(db, user.id, planned.id, attemptId));
  } catch (error) {
    if (!(error instanceof AttemptError)) throw error;
    const upgrade = upgradeTarget(error);
    if (upgrade) redirect(upgrade, locale);
    failure = planned.kind === 'review' ? 'nothing-to-review' : planned.kind === 'revision' ? 'insufficient-content' : 'not-enough-new';
    attemptId = null;
  }
  redirect(attemptId ? `/attempt/${attemptId}` : planPath('plan', planned.examKey, failure), locale);
}

export async function skipPlanSessionAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const locale = await getLocale();
  const examKey = field(formData, 'examKey');
  let notice = 'session-skipped';
  try {
    (await skipSession(getDb(), user.id, field(formData, 'sessionId')));
  } catch (error) {
    if (!(error instanceof PlanError)) throw error;
    notice = 'session-closed';
  }
  redirect(planPath('plan', examKey, notice), locale);
}

/** Applies the adjustment the learner previewed, if it is still exactly that. */
export async function applyAdjustmentAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const locale = await getLocale();
  const db = getDb();
  const config = getExamConfig(field(formData, 'examKey'));
  if (!config) redirect('/study-plan', locale);
  await requireStudyPlan(user.id, config.examKey, locale);
  const weeklyMinutes = parseWeeklyMinutes(field(formData, 'weeklyMinutes'));
  const date = parsePlanDate(field(formData, 'examDate'));
  if (weeklyMinutes === null || date === 'invalid') redirect(planPath('adjust', config.examKey, 'invalid-plan-input'), locale);
  const plan = (await activePlan(db, user.id, config.examKey));
  if (!plan || plan.id !== field(formData, 'planId')) redirect(planPath('plan', config.examKey, 'no-plan'), locale);

  try {
    (await applyAdjustment(db, user.id, plan.id, field(formData, 'digest'), { weeklyMinutes, examDate: date }));
    if (date !== (await examDateFor(db, user.id, config.examKey)).examDate) (await setExamDate(db, user.id, config.examKey, date));
    (await db.prepare('UPDATE users SET weekly_minutes = ?, updated_at = ? WHERE id = ?').run(weeklyMinutes, new Date().toISOString(), user.id));
  } catch (error) {
    if (!(error instanceof PlanError)) throw error;
    // Show the preview again, as it is now, with the learner's inputs.
    const params = new URLSearchParams({ exam: config.examKey, minutes: String(weeklyMinutes), notice: error.code });
    params.set('date', date ?? '');
    redirect(`/study-plan/adjust?${params.toString()}`, locale);
  }
  redirect(planPath('plan', config.examKey, 'plan-adjusted'), locale);
}

export async function endPlanAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const locale = await getLocale();
  const examKey = field(formData, 'examKey');
  let notice = 'plan-ended';
  try {
    (await endPlan(getDb(), user.id, field(formData, 'planId')));
  } catch (error) {
    if (!(error instanceof PlanError)) throw error;
    notice = 'no-plan';
  }
  redirect(planPath('plan', examKey, notice), locale);
}

/** The learner chooses between the current exam date and the one kept from their earlier plan. */
export async function resolveDateConflictAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const locale = await getLocale();
  const config = getExamConfig(field(formData, 'examKey'));
  const back = returnView(formData.get('returnTo'));
  if (!config) redirect(planPath(back, null), locale);
  const keep = field(formData, 'keep');
  if (keep !== 'current' && keep !== 'earlier') redirect(planPath(back, config.examKey), locale);
  const settled = (await resolveDateConflict(getDb(), user.id, config.examKey, keep));
  redirect(planPath(back, config.examKey, settled ? 'date-chosen' : undefined), locale);
}

/**
 * Starts a suggestion from the Progress view: topic practice as new
 * questions (enforced) or as revision, or a retry of missed questions.
 */
export async function startSuggestionAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const locale = await getLocale();
  const db = getDb();
  const config = getExamConfig(field(formData, 'examKey'));
  if (!config) redirect('/study-plan/progress', locale);
  const kind = field(formData, 'kind');
  const domain = field(formData, 'domain');
  const knownDomain = config.domains.some((d) => d.slug === domain);
  const requested = Number(field(formData, 'length') || 10);
  const length = Number.isFinite(requested) ? Math.max(1, Math.min(10, Math.round(requested))) : 10;
  if (!(await checkRateLimit(db, 'attemptStart', `user:${user.id}`)).allowed) redirect(planPath('progress', config.examKey, 'rate-limited'), locale);

  let attemptId: string | null = null;
  let failure = 'insufficient-content';
  try {
    if (kind === 'review') {
      failure = 'nothing-to-review';
      const questionIds = (await retryableMissed(db, user.id, config.examKey)).slice(0, length);
      attemptId = (await startRetry(db, { userId: user.id, examKey: config.examKey, questionIds, contentLocale: locale })).attemptId;
    } else if (kind === 'new' || kind === 'revision') {
      if (kind === 'new') failure = 'not-enough-new';
      attemptId = (await startAttempt(db, {
        userId: user.id,
        contentLocale: locale,
        examKey: config.examKey,
        blueprintId: 'practice',
        overrides: {
          ...(knownDomain ? { domains: [domain] } : {}),
          difficulty: 'mixed',
          length,
          ...(kind === 'new' ? { unseenOnly: true } : {}),
        },
      })).attemptId;
    }
  } catch (error) {
    if (!(error instanceof AttemptError)) throw error;
    const upgrade = upgradeTarget(error);
    if (upgrade) redirect(upgrade, locale);
    attemptId = null;
  }
  redirect(attemptId ? `/attempt/${attemptId}` : planPath('progress', config.examKey, failure), locale);
}
