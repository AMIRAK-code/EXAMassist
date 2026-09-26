import Link from 'next/link';
import type { ResultItem, ResultsSummary } from '@/lib/learning/results';
import { isMiss } from '@/lib/learning/results';
import { labelText } from '@/lib/learning/mistakes';
import { MIN_ATTEMPTS_FOR_SIGNAL } from '@/lib/learning/recommend';
import { practiseNewAction, startRetryAction } from '@/app/actions/learning';
import { SubmitButton } from '@/components/submit-button';
import { Badge, ButtonLink, Card, cx } from '@/components/ui';

/**
 * The results page's sections: the outcome, where marks were lost, what to do
 * next, and the questions, each reviewed on its own page. Server components;
 * the forms work without JavaScript.
 */

export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes} min ${seconds} s` : `${seconds} s`;
}

const OUTCOME_TEXT: Record<ResultItem['outcome'], string> = {
  correct: 'Correct',
  incorrect: 'Wrong',
  blank: 'Left blank',
  'not-scored': 'Not scored',
};
const OUTCOME_TONE: Record<ResultItem['outcome'], 'positive' | 'negative' | 'neutral'> = {
  correct: 'positive',
  incorrect: 'negative',
  blank: 'neutral',
  'not-scored': 'neutral',
};

export function OutcomeBadge({ outcome }: { outcome: ResultItem['outcome'] }) {
  return <Badge tone={OUTCOME_TONE[outcome]}>{OUTCOME_TEXT[outcome]}</Badge>;
}

export function Verdict({ summary }: { summary: ResultsSummary }) {
  const { totals } = summary;
  const total = totals.correct + totals.incorrect + totals.omitted;
  const answered = totals.correct + totals.incorrect;
  const counts = [
    { label: 'Correct', value: totals.correct, dot: 'bg-positive' },
    { label: 'Wrong', value: totals.incorrect, dot: 'bg-negative' },
    { label: 'Left blank', value: totals.omitted, dot: 'bg-line-strong' },
  ];
  return (
    <Card padding="lg" className="mb-10 border-[1.5px] border-ink">
      <h2 className="sr-only">Outcome</h2>
      <p className="font-heading text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
        {totals.correct}
        <span className="text-2xl font-semibold text-ink-muted sm:text-3xl">{` of ${total} correct`}</span>
      </p>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2" aria-label="Counts">
        {counts.map((count) => (
          <li key={count.label} className="flex items-center gap-2 text-base">
            <span aria-hidden="true" className={cx('size-2.5 rounded-full', count.dot)} />
            <span className="font-semibold tabular-nums">{count.value}</span>
            <span className="text-ink-muted">{count.label.toLowerCase()}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-5 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
        <dt className="text-ink-muted">Accuracy on the questions you answered</dt>
        <dd className="tabular-nums">{answered > 0 ? `${Math.round((totals.correct / answered) * 100)}% (${totals.correct} of ${answered})` : 'You did not answer any'}</dd>
        {summary.penalties ? (
          <>
            <dt className="text-ink-muted">Raw points, with this exam’s penalties</dt>
            <dd className="tabular-nums">{`${Math.round(totals.pointsEarned * 100) / 100} of ${totals.pointsPossible} (correct ${summary.penalties.correct}, wrong ${summary.penalties.incorrect}, blank ${summary.penalties.omitted})`}</dd>
          </>
        ) : null}
        <dt className="text-ink-muted">Time spent answering</dt>
        <dd className="tabular-nums">{`${formatDuration(totals.totalTimeMs)}, counted from saved answers`}</dd>
      </dl>
      {summary.seenBeforeCount > 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          {`${summary.seenBeforeCount} of these ${total} questions you had been shown in an earlier session.`}
        </p>
      ) : null}
    </Card>
  );
}

export function WhereMarksWentLost({ summary }: { summary: ResultsSummary }) {
  const withMisses = summary.topics.filter((topic) => topic.scored > topic.correct);
  const allCorrect = summary.topics.filter((topic) => topic.scored > 0 && topic.scored === topic.correct);
  return (
    <section aria-labelledby="lost-heading" className="mb-10">
      <h2 id="lost-heading" className="mb-2 font-heading text-2xl font-semibold">
        Where you lost marks
      </h2>
      <p className="mb-4 max-w-2xl text-sm text-ink-muted">
        {`A topic needs at least ${MIN_ATTEMPTS_FOR_SIGNAL} questions in a session before its accuracy says much. Below that you see the count, not a judgement. Your dashboard combines every session.`}
      </p>
      {withMisses.length === 0 ? (
        <Card>
          <p>Nothing: every question you were asked was answered correctly.</p>
        </Card>
      ) : (
        <ul className="divide-y divide-line rounded-card border border-line bg-surface">
          {withMisses.map((topic) => {
            const missed = topic.scored - topic.correct;
            const weak = topic.hasSignal && topic.accuracy !== null && topic.accuracy < 0.6;
            return (
              <li key={topic.slug} className="p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-medium">{topic.name}</h3>
                  <p className="text-sm tabular-nums">
                    {`Missed ${missed} of ${topic.scored}`}
                    <span className="text-ink-subtle">{topic.hasSignal ? '' : ' · too few to judge'}</span>
                  </p>
                </div>
                {topic.hasSignal ? (
                  <p className={cx('mt-1 text-sm', weak ? 'font-medium text-negative' : 'text-ink-muted')}>
                    {weak
                      ? `Needs attention: ${Math.round((topic.accuracy ?? 0) * 100)}% correct across ${topic.scored} questions`
                      : `${Math.round((topic.accuracy ?? 0) * 100)}% correct across ${topic.scored} questions`}
                  </p>
                ) : null}
                <ul className="mt-2 space-y-0.5 text-sm text-ink-muted">
                  {topic.skills
                    .filter((skill) => skill.missed > 0)
                    .map((skill) => (
                      <li key={skill.slug}>{`${skill.name}: missed ${skill.missed} of ${skill.scored}`}</li>
                    ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
      {allCorrect.length > 0 ? (
        <p className="mt-3 text-sm text-ink-muted">
          {`All correct: ${allCorrect.map((topic) => `${topic.name} (${topic.scored})`).join(', ')}.`}
        </p>
      ) : null}
    </section>
  );
}

export function NextSteps({ summary }: { summary: ResultsSummary }) {
  const returnTo = `/attempt/${summary.attemptId}/results`;
  const firstMiss = summary.items.find((item) => isMiss(item.outcome));
  const { practice, retry } = summary;
  return (
    <section aria-labelledby="next-heading" className="mb-10">
      <h2 id="next-heading" className="mb-4 font-heading text-2xl font-semibold">
        What to do next
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {firstMiss ? (
          <Card>
            <h3 className="font-heading text-lg font-semibold">Understand your mistakes</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Each question opens on its own page with your answer, the correct one and the worked explanation.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ButtonLink href={`/attempt/${summary.attemptId}/results/${firstMiss.ordinal}`}>Review your first mistake</ButtonLink>
            </div>
          </Card>
        ) : null}

        {retry.available.length > 0 || retry.unavailable > 0 ? (
          <Card>
            <h3 className="font-heading text-lg font-semibold">Try the same questions again</h3>
            <p className="mt-1 text-sm text-ink-muted">
              A retry is a separate session of repeated questions. It never changes this result, and it is not
              counted in your accuracy by topic.
            </p>
            {retry.available.length > 0 ? (
              <form action={startRetryAction} className="mt-4">
                <input type="hidden" name="examKey" value={summary.examKey} />
                <input type="hidden" name="questionIds" value={retry.available.join(',')} />
                <input type="hidden" name="sourceAttemptId" value={summary.attemptId} />
                <input type="hidden" name="returnTo" value={returnTo} />
                <SubmitButton variant="secondary" pendingLabel="Starting the retry…">
                  {`Retry the ${retry.available.length} question${retry.available.length === 1 ? '' : 's'} you missed`}
                </SubmitButton>
              </form>
            ) : null}
            {retry.unavailable > 0 ? (
              <p className="mt-3 text-sm text-ink-muted">
                {`${retry.unavailable} of the questions you missed ${retry.unavailable === 1 ? 'is' : 'are'} being revised, so ${retry.unavailable === 1 ? 'it is' : 'they are'} not offered again for now.`}
              </p>
            ) : null}
          </Card>
        ) : null}

        {practice ? (
          <Card className="lg:col-span-2">
            <h3 className="font-heading text-lg font-semibold">{`Practise ${practice.skill.name} with new questions`}</h3>
            <p className="mt-1 text-sm text-ink-muted">
              {`${practice.basis} "New" means questions you have never been shown: the session is built only from them.`}
            </p>
            <div className="mt-4 flex flex-wrap items-start gap-3">
              {practice.skill.unseen > 0 ? (
                <form action={practiseNewAction}>
                  <input type="hidden" name="examKey" value={summary.examKey} />
                  <input type="hidden" name="skill" value={practice.skill.slug} />
                  <input type="hidden" name="length" value={Math.min(10, practice.skill.unseen)} />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <SubmitButton pendingLabel="Preparing your session…">
                    {`${Math.min(10, practice.skill.unseen)} new ${practice.skill.name} question${Math.min(10, practice.skill.unseen) === 1 ? '' : 's'}`}
                  </SubmitButton>
                </form>
              ) : null}
              {practice.topic.unseen > practice.skill.unseen ? (
                <form action={practiseNewAction}>
                  <input type="hidden" name="examKey" value={summary.examKey} />
                  <input type="hidden" name="domain" value={practice.topic.slug} />
                  <input type="hidden" name="length" value={Math.min(10, practice.topic.unseen)} />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <SubmitButton variant="secondary" pendingLabel="Preparing your session…">
                    {`Or all of ${practice.topic.name}: ${Math.min(10, practice.topic.unseen)} new`}
                  </SubmitButton>
                </form>
              ) : null}
            </div>
            {practice.skill.unseen === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">
                {`You have been shown all ${practice.skill.reviewed} reviewed ${practice.skill.name} question${practice.skill.reviewed === 1 ? '' : 's'}. Retry the ones you missed${practice.topic.unseen > 0 ? ', or practise the wider topic' : ''}.`}
              </p>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">
                {`${practice.skill.unseen} of the ${practice.skill.reviewed} reviewed ${practice.skill.name} questions are new to you${practice.topic.unseen > practice.skill.unseen ? `; ${practice.topic.unseen} across ${practice.topic.name}` : ''}.`}
              </p>
            )}
          </Card>
        ) : null}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <ButtonLink href={`/practice/${summary.examKey}`} variant="secondary">
          Set up another session
        </ButtonLink>
        <ButtonLink href={`/dashboard?exam=${summary.examKey}`} variant="secondary">
          Your dashboard
        </ButtonLink>
        <ButtonLink href="/review" variant="secondary">
          Mistake notebook
        </ButtonLink>
      </div>
    </section>
  );
}

export function QuestionList({ summary }: { summary: ResultsSummary }) {
  return (
    <section aria-labelledby="questions-heading" className="mb-10">
      <h2 id="questions-heading" className="mb-4 font-heading text-2xl font-semibold">
        Every question
      </h2>
      <ol className="divide-y divide-line rounded-card border border-line bg-surface">
        {summary.items.map((item) => {
          const notes = [
            item.flagged ? 'you marked it' : null,
            item.seenBefore ? 'seen before' : null,
            item.correction === 'corrected' ? 'corrected since' : null,
            item.correction === 'unavailable' ? 'being revised' : null,
          ].filter(Boolean);
          return (
            <li key={item.attemptItemId} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
              <span className="w-8 shrink-0 font-heading text-lg font-semibold tabular-nums">{item.ordinal}</span>
              <span className="w-24 shrink-0">
                <OutcomeBadge outcome={item.outcome} />
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="block">{summary.partCount > 1 ? `${item.partLabel} · ${item.skillName}` : item.skillName}</span>
                <span className="block text-ink-muted">
                  {[item.domainName, ...notes, ...item.labels.map(labelText)].join(' · ')}
                </span>
              </span>
              <Link
                href={`/attempt/${summary.attemptId}/results/${item.ordinal}`}
                className="shrink-0 text-sm"
                aria-label={`Review question ${item.ordinal}`}
              >
                Review
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function HowToRead({ summary }: { summary: ResultsSummary }) {
  const { methodology } = summary;
  const facts = methodology.officialFacts;
  return (
    <section aria-labelledby="how-heading" className="mb-8">
      <h2 id="how-heading" className="mb-3 font-heading text-xl font-semibold">
        How to read this
      </h2>
      <div className="grid gap-5 rounded-card border border-line bg-surface p-5 md:grid-cols-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">{`Official facts about the ${summary.examShortName}`}</h3>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            {facts.scale ? <li>{`The real exam reports ${facts.scale.label} from ${facts.scale.min} to ${facts.scale.max}.`}</li> : null}
            <li>{`Correct ${facts.pointsCorrect}, wrong ${facts.pointsIncorrect}, omitted ${facts.pointsOmitted}.`}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">Our approximation</h3>
          <p className="mt-2 text-sm text-ink-muted">{summary.fidelityNote || methodology.ourApproximation.fidelityNote}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">What we do not provide</h3>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            {methodology.notProvided.scaledScore ? <li>{methodology.notProvided.scaledScore}</li> : null}
            <li>{methodology.notProvided.percentiles}</li>
            <li>This page makes no readiness or admission judgement.</li>
          </ul>
        </div>
      </div>
      {methodology.unverifiedRules.length > 0 ? (
        <details className="mt-4 rounded-card border border-line bg-surface-sunken p-4 text-sm">
          <summary className="cursor-pointer font-medium">{`Rules we could not verify for this exam (${methodology.unverifiedRules.length})`}</summary>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-ink-muted">
            {methodology.unverifiedRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          {summary.formatGuideHref ? (
            <p className="mt-2">
              <Link href={summary.formatGuideHref}>See the full format guide and sources</Link>
            </p>
          ) : null}
        </details>
      ) : null}
    </section>
  );
}
