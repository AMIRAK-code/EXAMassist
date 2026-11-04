'use client';

import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { browserStorage, readAccountHint } from '@/lib/auth/account-hint';
import type { PanelExam, RenderedStudyPanel } from '@/lib/learning/study-panel';
import { buttonClass, cx } from '@/components/ui';
import type { AccountState } from './nav-items';

/** A panel older than this is fetched again when the learner moves to another page. */
const STALE_AFTER_MS = 30_000;

export type StudyPanelState =
  | { status: 'pending' }
  | { status: 'signed-out'; account: 'visitor' | 'guest' }
  | { status: 'error'; retry: () => void }
  | { status: 'ready'; panel: RenderedStudyPanel };

/**
 * The learner's study plan for the side panel, fetched in the browser from
 * /api/study-panel: pages are saved as static files for everyone
 * (src/lib/seo/static-pages.ts), so nobody's plan may be in their HTML.
 *
 * On a page the server rendered for this visitor, `served` says who they
 * are; on a saved page (`deferred`) the browser's remembered account state
 * does, as for the header. Only an account is asked for: a visitor or guest
 * is shown the invitation without a request. It is fetched once `active`
 * (the panel can be seen), and again on a later page once it is stale.
 */
export function useStudyPanel({ served, deferred, active }: { served: AccountState; deferred: boolean; active: boolean }): StudyPanelState {
  const locale = useLocale();
  const pathname = usePathname();
  const [account, setAccount] = useState<AccountState | null>(deferred ? null : served);
  const [state, setState] = useState<StudyPanelState>({ status: 'pending' });
  const fetchedAt = useRef(0);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    setAccount(deferred ? (readAccountHint(browserStorage()) ?? 'visitor') : served);
  }, [served, deferred]);

  useEffect(() => {
    if (account === null) return;
    if (account !== 'registered') {
      setState({ status: 'signed-out', account });
      return;
    }
    if (!active || Date.now() - fetchedAt.current < STALE_AFTER_MS) return;

    const controller = new AbortController();
    const query = new URLSearchParams({ locale, tz: String(new Date().getTimezoneOffset()) });
    fetch(`/api/study-panel?${query}`, { signal: controller.signal, headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok) throw new Error(`study panel: ${response.status}`);
        const body = (await response.json()) as { account: AccountState; panel: RenderedStudyPanel | null };
        fetchedAt.current = Date.now();
        setState(
          body.panel
            ? { status: 'ready', panel: body.panel }
            : { status: 'signed-out', account: body.account === 'guest' ? 'guest' : 'visitor' },
        );
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error(error);
        setState({ status: 'error', retry });
      });
    return () => controller.abort();
  }, [account, active, locale, pathname, attempt, retry]);

  return state;
}

const SECTION = 'border-t border-line pt-5 mt-5';
const H3 = 'mb-2 text-sm font-semibold text-ink';
const SMALL = 'text-xs leading-relaxed text-ink-muted';

/** The "Study plan" panel: an invitation for anyone without an account, the learner's digest for an account. */
export function StudyPanel({ state, headingId }: { state: StudyPanelState; headingId: string }) {
  const t = useTranslations('common.panels.study');
  return (
    <section aria-labelledby={headingId} aria-busy={state.status === 'pending'}>
      <h2 id={headingId} className="eyebrow mb-3">
        {t('heading')}
      </h2>
      {state.status === 'pending' ? <p className={SMALL}>{t('loading')}</p> : null}
      {state.status === 'signed-out' ? <SignedOut account={state.account} /> : null}
      {state.status === 'error' ? (
        <div role="alert" className="text-sm text-ink-muted">
          <p>{t('error')}</p>
          <button type="button" onClick={state.retry} className={cx(buttonClass({ variant: 'secondary', size: 'sm' }), 'mt-3')}>
            {t('retry')}
          </button>
        </div>
      ) : null}
      {state.status === 'ready' ? <Digest panel={state.panel} /> : null}
    </section>
  );
}

function SignedOut({ account }: { account: 'visitor' | 'guest' }) {
  const t = useTranslations('common');
  return (
    <div>
      <p className="font-heading text-lg font-semibold leading-snug">{t('panels.study.promptTitle')}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {account === 'guest' ? t('panels.study.promptGuest') : t('panels.study.promptVisitor')}
      </p>
      {/* Side by side as equals, as in the header; they wrap rather than squeeze in a narrow panel. */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/sign-in" className={buttonClass({ variant: 'secondary', size: 'sm' })}>
          {t('nav.signIn')}
        </Link>
        <Link href="/sign-up" className={buttonClass({ variant: 'ink', size: 'sm' })}>
          {t('nav.createAccount')}
        </Link>
      </div>
    </div>
  );
}

function Digest({ panel }: { panel: RenderedStudyPanel }) {
  const t = useTranslations('common.panels.study');
  const format = useFormatter();

  if (panel.exams.length === 0 && !panel.resume) {
    return (
      <div>
        <p className="text-sm leading-relaxed text-ink-muted">{t('empty')}</p>
        <Link href="/exams" className={cx(buttonClass({ variant: 'primary', size: 'sm' }), 'mt-3')}>
          {t('chooseExam')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {panel.resume ? (
        <div className="rounded-card border border-accent-line bg-accent-soft p-3">
          <p className="text-sm font-semibold text-accent-ink">{t('resume.title')}</p>
          <p className="mt-1 text-sm text-ink">
            {t('resume.detail', { exam: panel.resume.examLabel, question: panel.resume.question, count: panel.resume.questionCount })}
            {panel.resume.others > 0 ? ` ${t('resume.others', { count: panel.resume.others })}` : null}
          </p>
          <Link href={panel.resume.href} className={cx(buttonClass({ variant: 'primary', size: 'sm' }), 'mt-2')}>
            {t('resume.action')}
          </Link>
        </div>
      ) : null}

      {panel.next ? (
        <div className={panel.resume ? 'mt-4' : undefined}>
          <h3 className={H3}>{t('next.title')}</h3>
          <p className="text-sm font-medium leading-snug">{panel.next.title}</p>
          <p className={cx(SMALL, 'mt-1')}>
            {panel.next.source === 'plan' ? t('next.fromPlan', { exam: panel.next.examLabel }) : t('next.forExam', { exam: panel.next.examLabel })}
            {panel.next.because ? ` ${panel.next.because}` : null}
          </p>
          <Link href={panel.next.href} className="mt-1.5 inline-flex min-h-9 items-center text-sm font-semibold">
            {panel.next.action}
          </Link>
        </div>
      ) : null}

      {panel.exams.length > 0 ? (
        <div className={SECTION}>
          <h3 className={H3}>{t('exams.title')}</h3>
          <ul className="space-y-4">
            {panel.exams.map((exam) => (
              <ExamProgress key={exam.examKey} exam={exam} />
            ))}
          </ul>
        </div>
      ) : null}

      <div className={SECTION}>
        <h3 className={H3}>{t('mistakes.title')}</h3>
        {panel.weakSpots.length > 0 ? (
          <ul className="space-y-1">
            {panel.weakSpots.map((spot) => (
              <li key={`${spot.kind}:${spot.href}`}>
                <Link href={spot.href} className="block rounded-control py-1 no-underline hover:bg-surface-sunken">
                  <span className="block text-sm font-medium text-ink">{spot.name}</span>
                  <span className="block text-xs text-ink-muted">
                    {t('mistakes.detail', {
                      exam: spot.examLabel,
                      kind: spot.kind,
                      correct: spot.correct,
                      scored: spot.scored,
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={SMALL}>{t('mistakes.none', { min: panel.weakRule.minAnswers, share: panel.weakRule.below })}</p>
        )}
        {panel.mistakeLabels.length > 0 ? (
          <p className={cx(SMALL, 'mt-2')}>
            {t('mistakes.labels', {
              labels: panel.mistakeLabels.map((label) => t('mistakes.label', { label: label.text, count: label.count })).join(', '),
            })}
          </p>
        ) : null}
        <p className="mt-2 text-sm">
          {panel.review.dueNow > 0
            ? t('review.due', { count: panel.review.dueNow })
            : panel.review.nextDueAt
              ? t('review.next', { date: format.dateTime(new Date(panel.review.nextDueAt), { day: 'numeric', month: 'short' }) })
              : t('review.none')}{' '}
          <Link href="/review" className="font-semibold">
            {t('review.open')}
          </Link>
        </p>
      </div>

      <Activity activity={panel.activity} />

      <p className={cx(SECTION, 'flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold')}>
        <Link href="/dashboard">{t('links.dashboard')}</Link>
        <Link href="/study-plan">{t('links.studyPlan')}</Link>
      </p>
    </div>
  );
}

function ExamProgress({ exam }: { exam: PanelExam<string> }) {
  const t = useTranslations('common.panels.study');
  const format = useFormatter();
  const coverage = exam.topicCount > 0 ? Math.round((exam.topicsCovered / exam.topicCount) * 100) : 0;
  return (
    <li>
      <div className="flex items-baseline justify-between gap-2">
        <Link href={exam.href} lang="en" className="text-sm font-semibold">
          {exam.label}
        </Link>
        <span className="shrink-0 text-2xs uppercase tracking-wide text-ink-subtle">{t(`exams.reason.${exam.reasons[0]}`)}</span>
      </div>
      <p className={SMALL}>
        {exam.accuracy === null
          ? t('exams.answered', { count: exam.scored, more: exam.answersToSignal })
          : t('exams.accuracy', { count: exam.scored, share: exam.accuracy })}
      </p>
      <p className={SMALL}>{t('exams.readiness', { band: exam.bandLabel })}</p>
      <div className="mt-1.5">
        <p className="text-2xs text-ink-subtle" id={`topics-${exam.examKey}`}>
          {t('exams.topics', { covered: exam.topicsCovered, total: exam.topicCount })}
        </p>
        <div
          role="progressbar"
          aria-labelledby={`topics-${exam.examKey}`}
          aria-valuemin={0}
          aria-valuemax={exam.topicCount}
          aria-valuenow={exam.topicsCovered}
          className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-sunken"
        >
          <div className="h-full rounded-full bg-accent" style={{ width: `${coverage}%` }} />
        </div>
      </div>
      {exam.plan ? <p className={cx(SMALL, 'mt-1')}>{t('exams.plan', { done: exam.plan.done, total: exam.plan.total })}</p> : null}
      {exam.examDate && exam.daysToExam !== null ? (
        <p className={cx(SMALL, 'mt-1')}>
          {t('exams.examDate', {
            date: format.dateTime(new Date(`${exam.examDate}T00:00:00Z`), { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }),
            days: exam.daysToExam,
          })}
        </p>
      ) : null}
      {exam.dueReview > 0 ? <p className={cx(SMALL, 'mt-1')}>{t('exams.due', { count: exam.dueReview })}</p> : null}
    </li>
  );
}

function Activity({ activity }: { activity: RenderedStudyPanel['activity'] }) {
  const t = useTranslations('common.panels.study.activity');
  const format = useFormatter();
  const most = Math.max(1, ...activity.days.map((day) => day.answered));
  return (
    <div className={SECTION}>
      <h3 className={H3}>{t('title')}</h3>
      <p className="text-sm">
        {t('answered', { count: activity.answeredThisWeek })}
        {activity.streak > 0 ? ` · ${activity.streakAtLeast ? t('streakAtLeast', { days: activity.streak }) : t('streak', { days: activity.streak })}` : null}
      </p>
      <ol className="mt-2 grid grid-cols-7 gap-1" aria-label={t('daysLabel')}>
        {activity.days.map((day) => {
          const date = new Date(`${day.day}T00:00:00Z`);
          return (
            <li key={day.day} className="flex flex-col items-center gap-1">
              <span className="flex h-8 w-full items-end overflow-hidden rounded-sm bg-surface-sunken" aria-hidden="true">
                <span
                  className="block w-full bg-accent"
                  style={{ height: day.answered > 0 ? `${Math.max(12, Math.round((day.answered / most) * 100))}%` : 0 }}
                />
              </span>
              <span className="text-2xs text-ink-subtle" aria-hidden="true">
                {format.dateTime(date, { weekday: 'narrow', timeZone: 'UTC' })}
              </span>
              <span className="sr-only">
                {t('day', { date: format.dateTime(date, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }), count: day.answered })}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
