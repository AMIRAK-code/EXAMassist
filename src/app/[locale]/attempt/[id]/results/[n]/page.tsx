import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { languageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import type { AnswerKey, Response } from '@/lib/assessment/types';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { getReviewItem, isMiss } from '@/lib/learning/results';
import { MISTAKE_LABELS } from '@/lib/learning/mistakes';
import { chosenOptionIds, keyOptionIds } from '@/lib/learning/answers';
import { saveLabelsAction, startRetryAction, toggleBookmarkAction } from '@/app/actions/learning';
import { preloadKatexFonts } from '@/lib/content/katex-fonts';
import { Markdown, Stimulus } from '@/components/content';
import { LearningNotice } from '@/components/learning-notice';
import { OutcomeBadge } from '@/components/results/results-sections';
import { SubmitButton } from '@/components/submit-button';
import { Alert, Badge, Breadcrumbs, ButtonLink, Container } from '@/components/ui';
import { QuestionTutor } from '@/components/tutor/tutor-panel';
import { tutorEnabled } from '@/lib/tutor/config';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { pricingPath } from '@/lib/billing/config';
import { expertReviewFor } from '@/lib/content/expert-reviews';

type ResultsT = Awaited<ReturnType<typeof getTranslations<'results'>>>;
type Option = { id: string; label: string };

/**
 * One question from a finished session, reviewed on its own page: the question
 * exactly as the learner saw it, their answer, the correct one, why each
 * option is right or wrong, and the worked explanation. A learner may label
 * a mistake, retry the question, or bookmark it.
 */

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string; id: string; n: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, id, n } = await params;
  const t = await getTranslations({ locale, namespace: 'results.review' });
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
    alternates: languageAlternates(`/attempt/${id}/results/${n}`, locale as Locale),
  };
}

export default async function QuestionReviewPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ notice?: string | string[] }>;
}) {
  const { locale, id, n } = await params;
  const query = await searchParams;
  const t = await getTranslations('results');
  const user = await getCurrentUser();
  if (!user) return redirect({ href: `/sign-in?next=/attempt/${id}/results/${n}`, locale });

  const ordinal = /^\d{1,3}$/.test(n) ? Number(n) : NaN;
  const review = Number.isInteger(ordinal) ? (await getReviewItem(getDb(), id, user.id, ordinal)) : null;
  if (!review) notFound();

  const { item, question, response } = review;
  const here = `/attempt/${id}/results/${ordinal}`;
  preloadKatexFonts([
    question.stimulus?.bodyMd,
    question.instructionsMd,
    question.stemMd,
    question.explanationMd,
    ...question.options.map((option) => option.textMd),
    ...Object.values(question.distractorRationale),
  ]);
  const missed = isMiss(item.outcome);
  const tutorOn = tutorEnabled();
  const tutorAllowed = tutorOn && (await loadEntitlements(getDb(), user.id)).can('ai_tutor', review.examKey);
  const keyIds = keyOptionIds(question.answerKey);
  const chosen = chosenOptionIds(response);
  const nav = await getTranslations('common.nav');
  const trail = [
    { href: '/', label: t('breadcrumbs.home') },
    { href: `/dashboard?exam=${review.examKey}`, label: nav('dashboard') },
    { href: `/attempt/${id}/results`, label: t('breadcrumbs.results') },
    { label: t('breadcrumbs.question', { n: ordinal }) },
  ];

  return (
    <Container size="narrow">
      <Breadcrumbs trail={trail} />
      <p className="eyebrow mb-3">{`${review.examShortName} · ${review.blueprintLabel}`}</p>
      <h1 className="font-heading text-3xl font-semibold">{t('review.heading', { n: ordinal, total: review.total })}</h1>
      <p className="mt-2 text-sm text-ink-muted">{`${item.domainName} · ${item.skillName}`}</p>

      <LearningNotice code={query.notice} className="mt-6" />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <OutcomeBadge outcome={item.outcome} />
        {item.flagged ? <Badge tone="caution">{t('review.flagged')}</Badge> : null}
        {item.seenBefore ? <Badge tone="neutral">{t('review.seenBefore')}</Badge> : null}
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-1.5 rounded-card border border-line bg-surface p-4 text-sm sm:grid-cols-[minmax(8rem,auto)_1fr]">
        <dt className="font-medium text-ink-muted">{t('review.yourAnswer')}</dt>
        <dd>{describeResponse(t, response, question.options)}</dd>
        <dt className="font-medium text-ink-muted">{t('review.correctAnswer')}</dt>
        <dd>{describeAnswerKey(t, locale, question.answerKey, question.options)}</dd>
      </dl>

      {item.correction === 'corrected' ? (
        <Alert tone="info" title={t('review.correctedTitle')} className="mt-4">
          <p>{t('review.correctedBody')}</p>
        </Alert>
      ) : item.correction === 'unavailable' ? (
        <Alert tone="caution" title={t('review.revisingTitle')} className="mt-4">
          <p>{t('review.revisingBody')}</p>
        </Alert>
      ) : null}

      <article aria-labelledby="question-heading" className="mt-8">
        <h2 id="question-heading" className="sr-only">
          {t('review.questionHeading')}
        </h2>
        {question.stimulus ? (
          <div className="question-text mb-5">
            <Stimulus stimulus={question.stimulus} reading />
          </div>
        ) : null}
        {question.instructionsMd ? (
          <Markdown source={question.instructionsMd} className="prose-academic question-text mb-3 text-sm text-ink-muted" />
        ) : null}
        <Markdown source={question.stemMd} className="prose-academic question-body question-text mb-5" />

        {question.options.length > 0 ? (
          <ul className="mb-6 space-y-2 text-sm">
            {question.options.map((option) => {
              const isKey = keyIds.includes(option.id);
              const isChosen = chosen.includes(option.id);
              const rationale = question.distractorRationale[option.id];
              return (
                <li
                  key={option.id}
                  className={`rounded-card border p-3 ${isKey ? 'border-positive-line bg-positive-soft/50' : isChosen ? 'border-negative-line bg-negative-soft/40' : 'border-line bg-surface'}`}
                >
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="w-5 shrink-0 font-semibold text-ink-muted">{t('review.optionLabel', { label: option.label })}</span>
                    <Markdown source={option.textMd} className="question-text min-w-0 flex-1" />
                  </div>
                  {isChosen || isKey ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {isChosen ? <Badge tone="accent">{t('review.yourAnswer')}</Badge> : null}
                      {isKey ? <Badge tone="positive">{t('review.correctAnswer')}</Badge> : null}
                    </div>
                  ) : null}
                  {rationale ? <Markdown source={rationale} className="question-text mt-2 text-ink-muted" /> : null}
                </li>
              );
            })}
          </ul>
        ) : null}

        <section aria-labelledby="explanation-heading" className="rounded-card bg-surface-sunken p-5">
          <h2 id="explanation-heading" className="mb-2 font-heading text-lg font-semibold">
            {t('review.explanationHeading')}
          </h2>
          <Markdown source={question.explanationMd} className="prose-academic question-text text-sm" />
          <p className="mt-3 text-xs text-ink-subtle">
            {t(question.difficultyBasis === 'empirical' ? 'review.difficultyEmpirical' : 'review.difficultyEditorial')}
          </p>
          <ExpertReviewLine t={t} locale={locale} questionId={item.questionId} version={review.questionVersion} />
        </section>

        {/* Optional AI tutor: a second, labelled explanation built on the reviewed one above. */}
        {tutorAllowed ? (
          <QuestionTutor attemptId={id} partIndex={item.partIndex} position={item.position} canHint={false} canExplain />
        ) : tutorOn ? (
          <p className="text-sm text-ink-muted">
            {t('review.tutorUpgrade')} <Link href={pricingPath(review.examKey, 'ai_tutor')}>{t('review.tutorUpgradeLink')}</Link>
          </p>
        ) : null}
      </article>

      {missed ? (
        <section id="labels" aria-labelledby="labels-heading" className="mt-8 scroll-mt-24">
          <form action={saveLabelsAction} className="rounded-card border border-line bg-surface p-5">
            <fieldset>
              <legend id="labels-heading" className="font-heading text-lg font-semibold">
                {t('review.labelsHeading')}{' '}
                <span className="text-sm font-normal text-ink-muted">{t('review.labelsOptional')}</span>
              </legend>
              <p className="mt-1 text-sm text-ink-muted">{t('review.labelsBody')}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {MISTAKE_LABELS.map((label) => (
                  <label
                    key={label.key}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-control border-[1.5px] border-line-strong bg-surface px-3 text-sm has-[:checked]:border-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
                  >
                    <input
                      type="checkbox"
                      name="label"
                      value={label.key}
                      defaultChecked={item.labels.includes(label.key)}
                      className="size-4 accent-[var(--color-accent)]"
                    />
                    {t(`mistakeLabels.${label.key}`)}
                  </label>
                ))}
              </div>
            </fieldset>
            <input type="hidden" name="attemptItemId" value={item.attemptItemId} />
            <input type="hidden" name="returnTo" value={here} />
            <div className="mt-4">
              <SubmitButton variant="secondary" size="sm" pendingLabel={t('review.labelsSaving')}>
                {t('review.labelsSave')}
              </SubmitButton>
            </div>
          </form>
        </section>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {review.retryable ? (
          <form action={startRetryAction}>
            <input type="hidden" name="examKey" value={review.examKey} />
            <input type="hidden" name="questionIds" value={item.questionId} />
            <input type="hidden" name="sourceAttemptId" value={id} />
            <input type="hidden" name="returnTo" value={here} />
            <SubmitButton size="sm" pendingLabel={t('review.retryPending')}>
              {t('review.retry')}
            </SubmitButton>
          </form>
        ) : null}
        <form action={toggleBookmarkAction}>
          <input type="hidden" name="questionId" value={item.questionId} />
          <input type="hidden" name="returnTo" value={here} />
          <SubmitButton size="sm" variant="secondary">
            {review.bookmarked ? t('review.removeBookmark') : t('review.bookmark')}
          </SubmitButton>
        </form>
        <Link href={`/report-question?id=${encodeURIComponent(item.questionId)}`} className="text-sm">
          {t('review.report')}
        </Link>
      </div>

      <nav aria-label={t('review.navLabel')} className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
        {review.previous ? (
          <ButtonLink href={`/attempt/${id}/results/${review.previous}`} variant="secondary" size="sm">
            {t('review.previous')}
          </ButtonLink>
        ) : null}
        {review.next ? (
          <ButtonLink href={`/attempt/${id}/results/${review.next}`} variant="secondary" size="sm">
            {t('review.next')}
          </ButtonLink>
        ) : null}
        {review.nextMistake ? (
          <ButtonLink href={`/attempt/${id}/results/${review.nextMistake}`} size="sm">
            {t('review.nextMistake')}
          </ButtonLink>
        ) : null}
        <Link href={`/attempt/${id}/results`} className="text-sm">
          {t('review.backToResults')}
        </Link>
      </nav>
    </Container>
  );
}

/**
 * Who checked this question. A human expert review is named only when one is
 * recorded for this exact version (content/expert-reviews.json); otherwise the
 * line says what did happen, so nothing implies a review that was not done.
 */
function ExpertReviewLine({
  t,
  locale,
  questionId,
  version,
}: {
  t: ResultsT;
  locale: string;
  questionId: string;
  version: number;
}) {
  const expert = expertReviewFor(questionId, version);
  if (!expert) {
    return (
      <p className="mt-1 text-xs text-ink-subtle">
        {t('review.noExpertReview')} <Link href="/about/editorial-standards">{t('review.howChecked')}</Link>
      </p>
    );
  }
  const checkedKey = {
    'answer-key': 'answerKey',
    explanation: 'explanation',
    wording: 'wording',
    'syllabus-alignment': 'syllabusAlignment',
  } as const;
  const checked = new Intl.ListFormat(locale, { style: 'long', type: 'unit' }).format(
    expert.checked.map((c) => t(`review.checked.${checkedKey[c]}`)),
  );
  // reviewedOn is a calendar date (YYYY-MM-DD); format it as that date, whatever the server's time zone.
  const date = new Date(`${expert.reviewedOn}T00:00:00Z`).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return (
    <p className="mt-1 text-xs text-ink-subtle">
      {t.rich('review.expertReview', {
        name: expert.reviewer.name,
        credentials: expert.reviewer.credentials,
        date,
        checked,
        time: (chunks) => <time dateTime={expert.reviewedOn}>{chunks}</time>,
      })}
    </p>
  );
}

/** The learner's answer, in plain words. Option labels and typed entries are shown as they are. */
function describeResponse(t: ResultsT, response: Response | null, options: Option[]): string {
  if (!response) return t('answer.blank');
  const labelFor = (id: string) => options.find((option) => option.id === id)?.label ?? id;
  switch (response.type) {
    case 'single_select':
      return t('answer.option', { label: labelFor(response.optionId) });
    case 'multi_select':
      return response.optionIds.length > 0
        ? t('answer.options', { labels: response.optionIds.map(labelFor).join(', ') })
        : t('answer.blank');
    case 'numeric_entry':
      return response.raw.trim().length > 0 ? response.raw : t('answer.blank');
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return t('answer.option', { label: response.choice });
    case 'two_part':
      return response.selections.length > 0
        ? response.selections.map((s) => `${s.columnId}: ${labelFor(s.optionId)}`).join('; ')
        : t('answer.blank');
    case 'essay':
      return response.text.trim().length > 0 ? t('answer.essayWritten') : t('answer.blank');
  }
}

/** The answer key, in plain words. */
function describeAnswerKey(t: ResultsT, locale: string, key: AnswerKey, options: Option[]): string {
  const labelFor = (id: string) => options.find((option) => option.id === id)?.label ?? id;
  switch (key.type) {
    case 'single_select':
      return t('answer.option', { label: labelFor(key.optionId) });
    case 'multi_select':
      return t('answer.options', {
        labels: new Intl.ListFormat(locale, { type: 'conjunction' }).format(key.optionIds.map(labelFor)),
      });
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return t('answer.option', { label: key.choice });
    case 'numeric_entry': {
      const first = key.accepted[0];
      if (!first) return '—';
      if (first.kind === 'range') return t('answer.range', { min: String(first.min), max: String(first.max) });
      if (first.kind === 'tolerance') return `${first.value} (± ${first.tolerance})`;
      return String(first.value);
    }
    case 'two_part':
      return key.selections.map((s) => `${s.columnId}: ${labelFor(s.optionId)}`).join('; ');
    case 'essay':
      return t('answer.essayKey');
  }
}
