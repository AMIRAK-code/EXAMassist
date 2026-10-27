import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ResultItem, ResultsSummary } from '@/lib/learning/results';
import { isMiss } from '@/lib/learning/results';
import { MIN_ATTEMPTS_FOR_SIGNAL } from '@/lib/learning/recommend';
import { practiseNewAction, startRetryAction } from '@/app/actions/learning';
import { SubmitButton } from '@/components/submit-button';
import { Badge, ButtonLink, Card, cx } from '@/components/ui';

/**
 * The results page's sections: the outcome, where marks were lost, what to do
 * next, and the questions, each reviewed on its own page. Server components;
 * the forms work without JavaScript.
 */

type ResultsT = ReturnType<typeof useTranslations<'results'>>;

export function formatDuration(ms: number, t: ResultsT): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? t('duration.minutesSeconds', { minutes, seconds }) : t('duration.seconds', { seconds });
}

const OUTCOME_KEY = {
  correct: 'correct',
  incorrect: 'incorrect',
  blank: 'blank',
  'not-scored': 'notScored',
} as const satisfies Record<ResultItem['outcome'], string>;
const OUTCOME_TONE: Record<ResultItem['outcome'], 'positive' | 'negative' | 'neutral'> = {
  correct: 'positive',
  incorrect: 'negative',
  blank: 'neutral',
  'not-scored': 'neutral',
};

export function OutcomeBadge({ outcome }: { outcome: ResultItem['outcome'] }) {
  const t = useTranslations('results.outcome');
  return <Badge tone={OUTCOME_TONE[outcome]}>{t(OUTCOME_KEY[outcome])}</Badge>;
}

export function Verdict({ summary }: { summary: ResultsSummary }) {
  const t = useTranslations('results');
  const { totals } = summary;
  const total = totals.correct + totals.incorrect + totals.omitted;
  const answered = totals.correct + totals.incorrect;
  const counts = [
    { key: 'correct', label: t('verdict.countCorrect'), value: totals.correct, dot: 'bg-positive' },
    { key: 'incorrect', label: t('verdict.countIncorrect'), value: totals.incorrect, dot: 'bg-negative' },
    { key: 'blank', label: t('verdict.countBlank'), value: totals.omitted, dot: 'bg-line-strong' },
  ];
  return (
    <Card padding="lg" className="mb-10 border-[1.5px] border-ink">
      <h2 className="sr-only">{t('verdict.heading')}</h2>
      <p className="font-heading text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
        {totals.correct}
        <span className="text-2xl font-semibold text-ink-muted sm:text-3xl">{' '}
          {t('verdict.ofTotal', { total })}</span>
      </p>
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2" aria-label={t('verdict.countsLabel')}>
        {counts.map((count) => (
          <li key={count.key} className="flex items-center gap-2 text-base">
            <span aria-hidden="true" className={cx('size-2.5 rounded-full', count.dot)} />
            <span className="font-semibold tabular-nums">{count.value}</span>
            <span className="text-ink-muted">{count.label}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-5 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
        <dt className="text-ink-muted">{t('verdict.accuracyTerm')}</dt>
        <dd className="tabular-nums">
          {answered > 0
            ? t('verdict.accuracyValue', { accuracy: totals.correct / answered, correct: totals.correct, answered })
            : t('verdict.noneAnswered')}
        </dd>
        {summary.penalties ? (
          <>
            <dt className="text-ink-muted">{t('verdict.pointsTerm')}</dt>
            <dd className="tabular-nums">
              {t('verdict.pointsValue', {
                earned: Math.round(totals.pointsEarned * 100) / 100,
                possible: totals.pointsPossible,
                correct: summary.penalties.correct,
                incorrect: summary.penalties.incorrect,
                omitted: summary.penalties.omitted,
              })}
            </dd>
          </>
        ) : null}
        <dt className="text-ink-muted">{t('verdict.timeTerm')}</dt>
        <dd className="tabular-nums">{t('verdict.timeValue', { duration: formatDuration(totals.totalTimeMs, t) })}</dd>
      </dl>
      {summary.seenBeforeCount > 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          {t('verdict.seenBefore', { seen: summary.seenBeforeCount, total })}
        </p>
      ) : null}
    </Card>
  );
}

export function WhereMarksWentLost({ summary }: { summary: ResultsSummary }) {
  const t = useTranslations('results.lost');
  const locale = useLocale();
  const withMisses = summary.topics.filter((topic) => topic.scored > topic.correct);
  const allCorrect = summary.topics.filter((topic) => topic.scored > 0 && topic.scored === topic.correct);
  return (
    <section aria-labelledby="lost-heading" className="mb-10">
      <h2 id="lost-heading" className="mb-2 font-heading text-2xl font-semibold">
        {t('heading')}
      </h2>
      <p className="mb-4 max-w-2xl text-sm text-ink-muted">
        {t('intro', { min: MIN_ATTEMPTS_FOR_SIGNAL })}
      </p>
      {withMisses.length === 0 ? (
        <Card>
          <p>{t('nothing')}</p>
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
                    {t('missed', { missed, scored: topic.scored })}
                    <span className="text-ink-subtle">{topic.hasSignal ? '' : ` · ${t('tooFew')}`}</span>
                  </p>
                </div>
                {topic.hasSignal ? (
                  <p className={cx('mt-1 text-sm', weak ? 'font-medium text-negative' : 'text-ink-muted')}>
                    {t(weak ? 'needsAttention' : 'accuracy', { accuracy: topic.accuracy ?? 0, scored: topic.scored })}
                  </p>
                ) : null}
                <ul className="mt-2 space-y-0.5 text-sm text-ink-muted">
                  {topic.skills
                    .filter((skill) => skill.missed > 0)
                    .map((skill) => (
                      <li key={skill.slug}>{t('skillMissed', { skill: skill.name, missed: skill.missed, scored: skill.scored })}</li>
                    ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
      {allCorrect.length > 0 ? (
        <p className="mt-3 text-sm text-ink-muted">
          {t('allCorrect', {
            topics: new Intl.ListFormat(locale, { style: 'narrow', type: 'unit' }).format(
              allCorrect.map((topic) => t('topicCount', { topic: topic.name, count: topic.scored })),
            ),
          })}
        </p>
      ) : null}
    </section>
  );
}

export function NextSteps({ summary }: { summary: ResultsSummary }) {
  const t = useTranslations('results.next');
  const returnTo = `/attempt/${summary.attemptId}/results`;
  const firstMiss = summary.items.find((item) => isMiss(item.outcome));
  const { practice, retry } = summary;
  // The basis of the suggestion, from this session's own counts for the skill.
  const practiceSkill = practice
    ? summary.topics.find((topic) => topic.slug === practice.topic.slug)?.skills.find((skill) => skill.slug === practice.skill.slug)
    : undefined;
  return (
    <section aria-labelledby="next-heading" className="mb-10">
      <h2 id="next-heading" className="mb-4 font-heading text-2xl font-semibold">
        {t('heading')}
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {firstMiss ? (
          <Card>
            <h3 className="font-heading text-lg font-semibold">{t('understandTitle')}</h3>
            <p className="mt-1 text-sm text-ink-muted">{t('understandBody')}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ButtonLink href={`/attempt/${summary.attemptId}/results/${firstMiss.ordinal}`}>{t('understandButton')}</ButtonLink>
            </div>
          </Card>
        ) : null}

        {retry.available.length > 0 || retry.unavailable > 0 ? (
          <Card>
            <h3 className="font-heading text-lg font-semibold">{t('retryTitle')}</h3>
            <p className="mt-1 text-sm text-ink-muted">{t('retryBody')}</p>
            {retry.available.length > 0 ? (
              <form action={startRetryAction} className="mt-4">
                <input type="hidden" name="examKey" value={summary.examKey} />
                <input type="hidden" name="questionIds" value={retry.available.join(',')} />
                <input type="hidden" name="sourceAttemptId" value={summary.attemptId} />
                <input type="hidden" name="returnTo" value={returnTo} />
                <SubmitButton variant="secondary" pendingLabel={t('retryPending')}>
                  {t('retryButton', { count: retry.available.length })}
                </SubmitButton>
              </form>
            ) : null}
            {retry.unavailable > 0 ? (
              <p className="mt-3 text-sm text-ink-muted">
                {t('retryUnavailable', { count: retry.unavailable })}
              </p>
            ) : null}
          </Card>
        ) : null}

        {practice ? (
          <Card className="lg:col-span-2">
            <h3 className="font-heading text-lg font-semibold">{t('practiseTitle', { skill: practice.skill.name })}</h3>
            <p className="mt-1 text-sm text-ink-muted">
              {practiceSkill
                ? `${t('practiseBasis', { missed: practiceSkill.missed, scored: practiceSkill.scored, skill: practice.skill.name })} `
                : ''}
              {t('practiseNewMeaning')}
            </p>
            <div className="mt-4 flex flex-wrap items-start gap-3">
              {practice.skill.unseen > 0 ? (
                <form action={practiseNewAction}>
                  <input type="hidden" name="examKey" value={summary.examKey} />
                  <input type="hidden" name="skill" value={practice.skill.slug} />
                  <input type="hidden" name="length" value={Math.min(10, practice.skill.unseen)} />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <SubmitButton pendingLabel={t('practisePending')}>
                    {t('practiseSkillButton', { count: Math.min(10, practice.skill.unseen), skill: practice.skill.name })}
                  </SubmitButton>
                </form>
              ) : null}
              {practice.topic.unseen > practice.skill.unseen ? (
                <form action={practiseNewAction}>
                  <input type="hidden" name="examKey" value={summary.examKey} />
                  <input type="hidden" name="domain" value={practice.topic.slug} />
                  <input type="hidden" name="length" value={Math.min(10, practice.topic.unseen)} />
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <SubmitButton variant="secondary" pendingLabel={t('practisePending')}>
                    {t('practiseTopicButton', { topic: practice.topic.name, count: Math.min(10, practice.topic.unseen) })}
                  </SubmitButton>
                </form>
              ) : null}
            </div>
            {practice.skill.unseen === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">
                {t(practice.topic.unseen > 0 ? 'skillExhaustedTopic' : 'skillExhausted', {
                  reviewed: practice.skill.reviewed,
                  skill: practice.skill.name,
                })}
              </p>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">
                {t(practice.topic.unseen > practice.skill.unseen ? 'skillUnseenTopic' : 'skillUnseen', {
                  unseen: practice.skill.unseen,
                  reviewed: practice.skill.reviewed,
                  skill: practice.skill.name,
                  topicUnseen: practice.topic.unseen,
                  topic: practice.topic.name,
                })}
              </p>
            )}
          </Card>
        ) : null}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <ButtonLink href={`/practice/${summary.examKey}`} variant="secondary">
          {t('anotherSession')}
        </ButtonLink>
        <ButtonLink href={`/dashboard?exam=${summary.examKey}`} variant="secondary">
          {t('dashboard')}
        </ButtonLink>
        <ButtonLink href="/review" variant="secondary">
          {t('notebook')}
        </ButtonLink>
      </div>
    </section>
  );
}

export function QuestionList({ summary }: { summary: ResultsSummary }) {
  const t = useTranslations('results');
  return (
    <section aria-labelledby="questions-heading" className="mb-10">
      <h2 id="questions-heading" className="mb-4 font-heading text-2xl font-semibold">
        {t('questions.heading')}
      </h2>
      <ol className="divide-y divide-line rounded-card border border-line bg-surface">
        {summary.items.map((item) => {
          const notes = [
            item.flagged ? t('questions.noteFlagged') : null,
            item.seenBefore ? t('questions.noteSeenBefore') : null,
            item.correction === 'corrected' ? t('questions.noteCorrected') : null,
            item.correction === 'unavailable' ? t('questions.noteRevising') : null,
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
                  {[item.domainName, ...notes, ...item.labels.map((label) => t(`mistakeLabels.${label}`))].join(' · ')}
                </span>
              </span>
              <Link
                href={`/attempt/${summary.attemptId}/results/${item.ordinal}`}
                className="shrink-0 text-sm"
                aria-label={t('questions.reviewLabel', { n: item.ordinal })}
              >
                {t('questions.review')}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function HowToRead({ summary }: { summary: ResultsSummary }) {
  const t = useTranslations('results.howToRead');
  const { methodology } = summary;
  const facts = methodology.officialFacts;
  return (
    <section aria-labelledby="how-heading" className="mb-8">
      <h2 id="how-heading" className="mb-3 font-heading text-xl font-semibold">
        {t('heading')}
      </h2>
      <div className="grid gap-5 rounded-card border border-line bg-surface p-5 md:grid-cols-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">{t('officialFacts', { exam: summary.examShortName })}</h3>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            {facts.scale ? (
              <li>{t('scale', { scale: facts.scale.label, min: facts.scale.min, max: facts.scale.max })}</li>
            ) : null}
            <li>{t('points', { correct: facts.pointsCorrect, incorrect: facts.pointsIncorrect, omitted: facts.pointsOmitted })}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">{t('approximation')}</h3>
          <p className="mt-2 text-sm text-ink-muted">{summary.fidelityNote || methodology.ourApproximation.fidelityNote}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">{t('notProvided')}</h3>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            {methodology.notProvided.scaledScore ? <li>{methodology.notProvided.scaledScore}</li> : null}
            {/* A fixed sentence stored with each result; shown in the reader's language. */}
            <li>{t('noPercentiles')}</li>
            <li>{t('noReadiness')}</li>
          </ul>
        </div>
      </div>
      {methodology.unverifiedRules.length > 0 ? (
        <details className="mt-4 rounded-card border border-line bg-surface-sunken p-4 text-sm">
          <summary className="cursor-pointer font-medium">{t('unverified', { count: methodology.unverifiedRules.length })}</summary>
          <ul className="mt-2 list-disc space-y-1 ps-5 text-ink-muted">
            {methodology.unverifiedRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          {summary.formatGuideHref ? (
            <p className="mt-2">
              <Link href={summary.formatGuideHref}>{t('formatGuide')}</Link>
            </p>
          ) : null}
        </details>
      ) : null}
    </section>
  );
}
