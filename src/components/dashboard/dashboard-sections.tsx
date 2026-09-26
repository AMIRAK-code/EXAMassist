import Link from 'next/link';
import type { UnfinishedAttempt } from '@/lib/attempts/service';
import { examDisplayName, type DashboardData, type ExamChoice, type ExamDashboard, type NextStep } from '@/lib/learning/dashboard';
import { MIN_ATTEMPTS_FOR_SIGNAL } from '@/lib/learning/recommend';
import { Alert, Badge, ButtonLink, Card, EmptyState, Stat, cx } from '@/components/ui';

/**
 * The dashboard's sections. Server components only: nothing here needs
 * JavaScript, and the skills under each topic use a native disclosure.
 *
 * Lines near the top are single text runs, so a line that rewraps when the web
 * font arrives cannot throw a fragment onto the next line (docs/REDESIGN.md §14).
 */

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

function percent(value: number | null): string {
  return value === null ? '' : `${Math.round(value * 100)}%`;
}

function remainingLabel(seconds: number | null): string | null {
  if (seconds === null) return null;
  if (seconds < 60) return 'under a minute left';
  return `${Math.floor(seconds / 60)} min left`;
}

export function GuestNote({ guest }: { guest: NonNullable<DashboardData['guest']> }) {
  const until = new Date(guest.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  const text = `As a guest, this browser keeps your practice until ${until}. After that, this browser can no longer open it. Create an account to keep it.`;
  return guest.expiringSoon ? (
    <Alert tone="caution" title="Your guest practice ends soon" className="mb-8" role="status">
      <p>{text}</p>
      <p className="mt-2">
        <Link href="/sign-up">Keep your progress</Link>
      </p>
    </Alert>
  ) : (
    <div className="mb-8 text-sm text-ink-muted">
      <p>{text}</p>
      <p className="mt-1">
        <Link href="/sign-up">Keep your progress</Link>
      </p>
    </div>
  );
}

export function UnfinishedList({ items }: { items: UnfinishedAttempt[] }) {
  return (
    <section aria-labelledby="unfinished-heading" className="mb-10">
      <h2 id="unfinished-heading" className="mb-4 font-heading text-2xl font-semibold">
        Pick up where you left off
      </h2>
      <ul className="space-y-3">
        {items.map((item) => {
          const where = [
            item.partCount > 1 ? `Section ${item.partNumber} of ${item.partCount}` : null,
            `Question ${item.resumeQuestion} of ${item.questionCount}`,
            `${item.answeredInPart} answered`,
            remainingLabel(item.remainingSeconds),
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
                  Continue
                </ButtonLink>
              </div>
              {item.remainingSeconds !== null ? (
                <p className="mt-3 border-t border-line pt-3 text-xs text-ink-subtle">
                  The clock keeps running while you are away, as it does in the real exam.
                </p>
              ) : null}
            </Card>
          );
        })}
      </ul>
    </section>
  );
}

export function ExamSwitcher({ choices }: { choices: ExamChoice[] }) {
  return (
    <nav aria-label="Exams on your dashboard" className="mb-8">
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
                  target
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
  return (
    <section aria-labelledby="next-heading" className="mb-10">
      <h2 id="next-heading" className="mb-4 font-heading text-2xl font-semibold">
        Your next step
      </h2>
      <Card className="border-[1.5px] border-ink" padding="lg">
        <h3 className="font-heading text-xl font-semibold">{step.title}</h3>
        <p className="mt-2 text-ink-muted">{`Why: ${step.because}`}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <ButtonLink href={step.href}>{step.actionLabel}</ButtonLink>
          {step.broader ? (
            <ButtonLink href={step.broader.href} variant="secondary">
              {step.broader.label}
            </ButtonLink>
          ) : null}
        </div>
        {step.broader ? <p className="mt-3 text-sm text-ink-muted">{step.broader.because}</p> : null}
      </Card>
    </section>
  );
}

export function OtherSteps({ steps }: { steps: NextStep[] }) {
  if (steps.length === 0) return null;
  return (
    <section aria-labelledby="other-steps-heading" className="mb-10">
      <h2 id="other-steps-heading" className="mb-3 font-heading text-lg font-semibold">
        Also worth doing
      </h2>
      <ul className="divide-y divide-line rounded-card border border-line bg-surface">
        {steps.map((step) => (
          <li key={`${step.kind}-${step.title}`} className="flex flex-wrap items-start justify-between gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{step.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{step.because}</p>
              {step.broader ? (
                <p className="mt-1 text-sm">
                  <Link href={step.broader.href}>{step.broader.label}</Link>
                </p>
              ) : null}
            </div>
            <ButtonLink href={step.href} size="sm" variant="secondary" className="shrink-0">
              {step.actionLabel}
            </ButtonLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProgressSummary({ exam }: { exam: ExamDashboard }) {
  const { review } = exam;
  const reviewHint =
    review.comingLater > 0
      ? `${plural(review.comingLater, 'more comes', 'more come')} back later${review.nextDueAt ? `, the next on ${formatDate(review.nextDueAt)}` : ''}.`
      : review.dueNow > 0
        ? 'Missed questions come back after a short interval.'
        : 'Nothing is waiting. Missed questions come back the day after you miss them.';
  return (
    <section aria-label="Your counts" className="mb-10 grid gap-4 sm:grid-cols-3">
      <Card>
        <Stat
          label="Questions scored"
          value={exam.totalScored}
          hint={`across ${plural(exam.finishedCount, 'finished session', 'finished sessions')}`}
        />
      </Card>
      <Card>
        <Stat
          label="Answered correctly"
          value={exam.totalCorrect}
          of={exam.totalScored}
          hint={
            exam.totalScored > 0
              ? `${Math.round((exam.totalCorrect / exam.totalScored) * 100)}% of everything you have been shown`
              : 'No scored questions yet'
          }
        />
      </Card>
      <Card>
        <Stat label="Mistakes due for review now" value={review.dueNow} hint={reviewHint} />
        <p className="mt-2 text-sm">
          <Link href="/review">Open the mistake notebook</Link>
        </p>
      </Card>
    </section>
  );
}

export function TopicLandscape({ exam }: { exam: ExamDashboard }) {
  return (
    <section aria-labelledby="topics-heading" className="mb-10">
      <h2 id="topics-heading" className="mb-2 font-heading text-2xl font-semibold">
        Accuracy by topic
      </h2>
      <p className="mb-4 max-w-2xl text-sm text-ink-muted">
        {`Every ${exam.shortName} topic, including the ones you have not practised. A figure needs at least ${MIN_ATTEMPTS_FOR_SIGNAL} scored questions; below that the counts are shown instead. Open a topic to see its skills.`}
      </p>
      <ul className="divide-y divide-line rounded-card border border-line bg-surface">
        {exam.topics.map((topic) => {
          const figure =
            topic.scored === 0
              ? 'Not practised yet'
              : topic.hasSignal
                ? `${percent(topic.accuracy)} · ${topic.correct} of ${topic.scored} correct`
                : `${topic.correct} of ${topic.scored} correct · not enough answers for a figure`;
          return (
            <li key={topic.slug} className="p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-medium">{topic.name}</h3>
                <p className={cx('text-sm tabular-nums', topic.scored === 0 ? 'text-ink-subtle' : 'text-ink')}>{figure}</p>
              </div>
              <details className="mt-2 text-sm">
                <summary className="cursor-pointer text-ink-muted">
                  {`${plural(topic.skills.length, 'skill', 'skills')} · ${plural(topic.reviewed, 'reviewed question', 'reviewed questions')} in the bank`}
                </summary>
                <table className="mt-3 w-full border-collapse text-sm">
                  <caption className="sr-only">{`Skills in ${topic.name}`}</caption>
                  <thead>
                    <tr className="border-b border-line text-ink-muted">
                      <th scope="col" className="py-2 pe-3 text-start font-medium">Skill</th>
                      <th scope="col" className="px-3 py-2 text-end font-medium">In the bank</th>
                      <th scope="col" className="px-3 py-2 text-end font-medium">Scored</th>
                      <th scope="col" className="py-2 ps-3 text-end font-medium">Correct</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topic.skills.map((skill) => (
                      <tr key={skill.slug} className="border-b border-line last:border-b-0">
                        <th scope="row" className="py-2 pe-3 text-start font-normal">{skill.name}</th>
                        <td className="px-3 py-2 text-end tabular-nums">{skill.reviewed}</td>
                        <td className="px-3 py-2 text-end tabular-nums">{skill.scored}</td>
                        <td className="py-2 ps-3 text-end tabular-nums">
                          {skill.hasSignal ? `${skill.correct} (${percent(skill.accuracy)})` : skill.correct}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {topic.practiseHref ? (
                  <p className="mt-3">
                    <Link href={topic.practiseHref}>{`Practise ${topic.name}`}</Link>
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

function statusLabel(status: ExamDashboard['recent'][number]['status']): string {
  if (status === 'submitted') return 'Finished';
  if (status === 'expired') return 'Time ran out';
  return 'Abandoned';
}

export function RecentSessions({ exam }: { exam: ExamDashboard }) {
  if (exam.recent.length === 0) return null;
  return (
    <section aria-labelledby="recent-heading" className="mb-10">
      <h2 id="recent-heading" className="mb-4 font-heading text-2xl font-semibold">
        Recent sessions
      </h2>
      <ul className="space-y-3">
        {exam.recent.map((session) => {
          const total = (session.correct ?? 0) + (session.incorrect ?? 0) + (session.omitted ?? 0);
          const outcome =
            session.correct === null
              ? 'No result recorded'
              : `${session.correct} correct, ${session.incorrect} wrong, ${session.omitted} blank of ${total}`;
          return (
            <Card as="li" key={session.id} padding="sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium">{session.label}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{`${formatDate(session.finishedAt)} · ${outcome}`}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone={session.status === 'expired' ? 'caution' : 'neutral'}>{statusLabel(session.status)}</Badge>
                  {session.correct !== null ? (
                    <ButtonLink href={`/attempt/${session.id}/results`} size="sm" variant="secondary">
                      See results
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
  const continuing = exam.unfinishedHere.length > 0;
  return (
    <div className="mb-10">
      <EmptyState
        title={`No finished ${exam.shortName} session yet`}
        action={
          continuing ? (
            <ButtonLink href={`/attempt/${exam.unfinishedHere[0].id}`}>Continue your session</ButtonLink>
          ) : (
            <ButtonLink href={`/practice/${exam.examKey}`}>{`Start practising ${exam.shortName}`}</ButtonLink>
          )
        }
      >
        <p>
          {continuing
            ? 'Finish the session you started and this page will show your accuracy by topic, what you missed and what is worth practising next, all counted from your own answers.'
            : 'Once you finish a session, this page shows your accuracy by topic, what you missed and what is worth practising next, all counted from your own answers.'}
        </p>
      </EmptyState>
    </div>
  );
}

export function EmptyBank({ exam }: { exam: ExamDashboard }) {
  return (
    <Alert tone="caution" title={`No reviewed ${exam.shortName} questions to practise yet`} className="mb-10">
      <p>
        Questions for this exam are still being checked, so there is nothing to start. Only questions
        that have passed review are ever served.
      </p>
      {exam.formatGuideHref ? (
        <p className="mt-2">
          <Link href={exam.formatGuideHref}>Read the format and scoring guide</Link>
        </p>
      ) : null}
    </Alert>
  );
}
