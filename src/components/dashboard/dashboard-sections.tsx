import { useFormatter, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { UnfinishedAttempt } from '@/lib/attempts/service';
import { examDisplayName, type DashboardData, type ExamChoice, type ExamDashboard, type NextStep } from '@/lib/learning/dashboard';
import { MIN_ATTEMPTS_FOR_SIGNAL } from '@/lib/learning/recommend';
import { renderText } from '@/lib/learning/text';
import { Alert, Badge, ButtonLink, Card, EmptyState, Stat, cx } from '@/components/ui';

/**
 * The dashboard's sections. Server components only: nothing here needs
 * JavaScript, and the skills under each topic use a native disclosure.
 *
 * Lines near the top are single text runs, so a line that rewraps when the web
 * font arrives cannot throw a fragment onto the next line (docs/REDESIGN.md §14).
 */

/** A date as "3 Oct 2026", in the reader's language; a dash when there is none. */
function useShortDate(): (iso: string | null) => string {
  const format = useFormatter();
  return (iso) => {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    return format.dateTime(date, { day: 'numeric', month: 'short', year: 'numeric' });
  };
}

/** A share as a whole percent, "68%", in the reader's language. */
function usePercent(): (value: number | null) => string {
  const format = useFormatter();
  return (value) => (value === null ? '' : format.number(Math.round(value * 100) / 100, { style: 'percent' }));
}

export function GuestNote({ guest }: { guest: NonNullable<DashboardData['guest']> }) {
  const t = useTranslations('learning.dashboard.guest');
  const format = useFormatter();
  const until = format.dateTime(new Date(guest.expiresAt), { day: 'numeric', month: 'long' });
  const text = t('text', { until });
  return guest.expiringSoon ? (
    <Alert tone="caution" title={t('endsSoon')} className="mb-8" role="status">
      <p>{text}</p>
      <p className="mt-2">
        <Link href="/sign-up">{t('keep')}</Link>
      </p>
    </Alert>
  ) : (
    <div className="mb-8 text-sm text-ink-muted">
      <p>{text}</p>
      <p className="mt-1">
        <Link href="/sign-up">{t('keep')}</Link>
      </p>
    </div>
  );
}

export function UnfinishedList({ items }: { items: UnfinishedAttempt[] }) {
  const t = useTranslations('learning.dashboard.unfinished');
  const remaining = (seconds: number | null) =>
    seconds === null ? null : seconds < 60 ? t('underAMinute') : t('minutesLeft', { minutes: Math.floor(seconds / 60) });
  return (
    <section aria-labelledby="unfinished-heading" className="mb-10">
      <h2 id="unfinished-heading" className="mb-4 font-heading text-2xl font-semibold">
        {t('title')}
      </h2>
      <ul className="space-y-3">
        {items.map((item) => {
          const where = [
            item.partCount > 1 ? t('section', { part: item.partNumber, parts: item.partCount }) : null,
            t('question', { question: item.resumeQuestion, questions: item.questionCount }),
            t('answered', { count: item.answeredInPart }),
            remaining(item.remainingSeconds),
          ]
            .filter(Boolean)
            .join(' · ');
          return (
            <Card as="li" key={item.id} className="border-s-4 border-s-accent">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">{examDisplayName(item.examKey)}</p>
                  <h3 className="mt-1 font-heading text-lg font-semibold">{item.blueprintLabel}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{where}</p>
                </div>
                <ButtonLink href={`/attempt/${item.id}`} className="shrink-0">
                  {t('continue')}
                </ButtonLink>
              </div>
              {item.remainingSeconds !== null ? (
                <p className="mt-3 border-t border-line pt-3 text-xs text-ink-subtle">{t('clockRuns')}</p>
              ) : null}
            </Card>
          );
        })}
      </ul>
    </section>
  );
}

export function ExamSwitcher({ choices }: { choices: ExamChoice[] }) {
  const t = useTranslations('learning.dashboard.switcher');
  return (
    <nav aria-label={t('label')} className="mb-8">
      <ul className="flex flex-wrap gap-2">
        {choices.map((choice) => (
          <li key={choice.examKey}>
            <Link
              href={choice.href}
              aria-current={choice.current ? 'page' : undefined}
              className={cx(
                'inline-flex min-h-10 items-center gap-2 rounded-full border-[1.5px] px-4 text-sm font-semibold no-underline',
                choice.current
                  ? 'border-ink bg-ink text-ink-inverse hover:text-ink-inverse'
                  : 'border-line-strong bg-surface text-ink hover:border-ink hover:text-ink',
              )}
            >
              {choice.label}
              {choice.target ? (
                <span className={cx('text-xs font-normal', choice.current ? 'text-ink-inverse-muted' : 'text-ink-subtle')}>
                  {t('target')}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function NextStepCard({ step }: { step: NextStep }) {
  const t = useTranslations('learning');
  return (
    <section aria-labelledby="next-heading" className="mb-10">
      <h2 id="next-heading" className="mb-4 font-heading text-2xl font-semibold">
        {t('dashboard.nextStep')}
      </h2>
      <Card className="border-[1.5px] border-ink" padding="lg">
        <h3 className="font-heading text-xl font-semibold">{renderText(t, step.title)}</h3>
        <p className="mt-2 text-ink-muted">{t('why', { reason: renderText(t, step.because) })}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <ButtonLink href={step.href}>{renderText(t, step.actionLabel)}</ButtonLink>
          {step.broader ? (
            <ButtonLink href={step.broader.href} variant="secondary">
              {renderText(t, step.broader.label)}
            </ButtonLink>
          ) : null}
        </div>
        {step.broader ? <p className="mt-3 text-sm text-ink-muted">{renderText(t, step.broader.because)}</p> : null}
      </Card>
    </section>
  );
}

export function OtherSteps({ steps }: { steps: NextStep[] }) {
  const t = useTranslations('learning');
  if (steps.length === 0) return null;
  return (
    <section aria-labelledby="other-steps-heading" className="mb-10">
      <h2 id="other-steps-heading" className="mb-3 font-heading text-lg font-semibold">
        {t('dashboard.alsoWorthDoing')}
      </h2>
      <ul className="divide-y divide-line rounded-card border border-line bg-surface">
        {steps.map((step) => (
          <li key={`${step.kind}-${step.href}`} className="flex flex-wrap items-start justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{renderText(t, step.title)}</p>
              <p className="mt-1 text-sm text-ink-muted">{renderText(t, step.because)}</p>
              {step.broader ? (
                <p className="mt-1 text-sm">
                  <Link href={step.broader.href}>{renderText(t, step.broader.label)}</Link>
                </p>
              ) : null}
            </div>
            <ButtonLink href={step.href} size="sm" variant="secondary" className="shrink-0">
              {renderText(t, step.actionLabel)}
            </ButtonLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProgressSummary({ exam }: { exam: ExamDashboard }) {
  const t = useTranslations('learning.dashboard.summary');
  const shortDate = useShortDate();
  const percent = usePercent();
  const { review } = exam;
  const reviewHint =
    review.comingLater > 0
      ? review.nextDueAt
        ? t('comingLaterOn', { count: review.comingLater, date: shortDate(review.nextDueAt) })
        : t('comingLater', { count: review.comingLater })
      : review.dueNow > 0
        ? t('dueInterval')
        : t('nothingWaiting');
  return (
    <section aria-label={t('label')} className="mb-10 grid gap-4 sm:grid-cols-3">
      <Card>
        <Stat label={t('scored')} value={exam.totalScored} hint={t('across', { count: exam.finishedCount })} />
      </Card>
      <Card>
        <Stat
          label={t('correct')}
          value={exam.totalCorrect}
          of={exam.totalScored}
          hint={
            exam.totalScored > 0
              ? t('correctShare', { percent: percent(exam.totalCorrect / exam.totalScored) })
              : t('noneScored')
          }
        />
      </Card>
      <Card>
        <Stat label={t('due')} value={review.dueNow} hint={reviewHint} />
        <p className="mt-2 text-sm">
          <Link href="/review">{t('openNotebook')}</Link>
        </p>
      </Card>
    </section>
  );
}

export function TopicLandscape({ exam }: { exam: ExamDashboard }) {
  const t = useTranslations('learning.dashboard.topics');
  const percent = usePercent();
  return (
    <section aria-labelledby="topics-heading" className="mb-10">
      <h2 id="topics-heading" className="mb-2 font-heading text-2xl font-semibold">
        {t('title')}
      </h2>
      <p className="mb-4 max-w-2xl text-sm text-ink-muted">{t('lead', { exam: exam.shortName, min: MIN_ATTEMPTS_FOR_SIGNAL })}</p>
      <ul className="divide-y divide-line rounded-card border border-line bg-surface">
        {exam.topics.map((topic) => {
          const figure =
            topic.scored === 0
              ? t('notPractised')
              : topic.hasSignal
                ? t('figure', { percent: percent(topic.accuracy), correct: topic.correct, scored: topic.scored })
                : t('figureTooFew', { correct: topic.correct, scored: topic.scored });
          return (
            <li key={topic.slug} className="p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-medium">{topic.name}</h3>
                <p className={cx('text-sm tabular-nums', topic.scored === 0 ? 'text-ink-subtle' : 'text-ink')}>{figure}</p>
              </div>
              <details className="mt-2 text-sm">
                <summary className="cursor-pointer text-ink-muted">
                  {t('summary', { skills: topic.skills.length, reviewed: topic.reviewed })}
                </summary>
                <table className="mt-3 w-full border-collapse text-sm">
                  <caption className="sr-only">{t('caption', { topic: topic.name })}</caption>
                  <thead>
                    <tr className="border-b border-line text-ink-muted">
                      <th scope="col" className="py-2 pe-2 text-start font-medium sm:pe-3">{t('skill')}</th>
                      <th scope="col" className="px-2 py-2 text-end font-medium sm:px-3">{t('inBank')}</th>
                      <th scope="col" className="px-2 py-2 text-end font-medium sm:px-3">{t('scored')}</th>
                      <th scope="col" className="py-2 ps-2 text-end font-medium sm:ps-3">{t('correct')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topic.skills.map((skill) => (
                      <tr key={skill.slug} className="border-b border-line last:border-b-0">
                        <th scope="row" className="py-2 pe-2 text-start font-normal sm:pe-3">{skill.name}</th>
                        <td className="px-2 py-2 text-end tabular-nums sm:px-3">{skill.reviewed}</td>
                        <td className="px-2 py-2 text-end tabular-nums sm:px-3">{skill.scored}</td>
                        <td className="py-2 ps-2 text-end tabular-nums sm:ps-3">
                          {skill.hasSignal ? `${skill.correct} (${percent(skill.accuracy)})` : skill.correct}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {topic.practiseHref ? (
                  <p className="mt-3">
                    <Link href={topic.practiseHref}>{t('practise', { topic: topic.name })}</Link>
                  </p>
                ) : null}
              </details>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function RecentSessions({ exam }: { exam: ExamDashboard }) {
  const t = useTranslations('learning.dashboard.recent');
  const shortDate = useShortDate();
  if (exam.recent.length === 0) return null;
  return (
    <section aria-labelledby="recent-heading" className="mb-10">
      <h2 id="recent-heading" className="mb-4 font-heading text-2xl font-semibold">
        {t('title')}
      </h2>
      <ul className="space-y-3">
        {exam.recent.map((session) => {
          const total = (session.correct ?? 0) + (session.incorrect ?? 0) + (session.omitted ?? 0);
          const outcome =
            session.correct === null
              ? t('noResult')
              : t('outcome', {
                  correct: session.correct,
                  wrong: session.incorrect ?? 0,
                  blank: session.omitted ?? 0,
                  total,
                });
          return (
            <Card as="li" key={session.id} padding="sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium">{session.label}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{`${shortDate(session.finishedAt)} · ${outcome}`}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {session.isRetry ? <Badge tone="accent">{t('retry')}</Badge> : null}
                  <Badge tone={session.status === 'expired' ? 'caution' : 'neutral'}>{t(`status.${session.status}`)}</Badge>
                  {session.correct !== null ? (
                    <ButtonLink href={`/attempt/${session.id}/results`} size="sm" variant="secondary">
                      {t('seeResults')}
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            </Card>
          );
        })}
      </ul>
    </section>
  );
}

export function NoHistoryYet({ exam }: { exam: ExamDashboard }) {
  const t = useTranslations('learning.dashboard.noHistory');
  const continuing = exam.unfinishedHere.length > 0;
  return (
    <div className="mb-10">
      <EmptyState
        title={t('title', { exam: exam.shortName })}
        action={
          continuing ? (
            <ButtonLink href={`/attempt/${exam.unfinishedHere[0].id}`}>{t('continue')}</ButtonLink>
          ) : (
            <ButtonLink href={`/practice/${exam.examKey}`}>{t('start', { exam: exam.shortName })}</ButtonLink>
          )
        }
      >
        <p>{continuing ? t('leadContinuing') : t('lead')}</p>
      </EmptyState>
    </div>
  );
}

export function EmptyBank({ exam }: { exam: ExamDashboard }) {
  const t = useTranslations('learning.dashboard.emptyBank');
  return (
    <Alert tone="caution" title={t('title', { exam: exam.shortName })} className="mb-10">
      <p>{t('lead')}</p>
      {exam.formatGuideHref ? (
        <p className="mt-2">
          <Link href={exam.formatGuideHref}>{t('guide')}</Link>
        </p>
      ) : null}
    </Alert>
  );
}
