import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { getReviewItem, isMiss } from '@/lib/learning/results';
import { MISTAKE_LABELS } from '@/lib/learning/mistakes';
import { chosenOptionIds, describeAnswerKey, describeResponse, keyOptionIds } from '@/lib/learning/answers';
import { saveLabelsAction, startRetryAction, toggleBookmarkAction } from '@/app/actions/learning';
import { preloadKatexFonts } from '@/lib/content/katex-fonts';
import { Markdown, Stimulus } from '@/components/content';
import { LearningNotice } from '@/components/learning-notice';
import { OutcomeBadge } from '@/components/results/results-sections';
import { SubmitButton } from '@/components/submit-button';
import { Alert, Badge, Breadcrumbs, ButtonLink, Container } from '@/components/ui';

/**
 * One question from a finished session, reviewed on its own page: the question
 * exactly as the learner saw it, their answer, the correct one, why each
 * option is right or wrong, and the worked explanation. A learner may label
 * a mistake, retry the question, or bookmark it.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Question review',
  robots: { index: false, follow: false },
};

export default async function QuestionReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; n: string }>;
  searchParams: Promise<{ notice?: string | string[] }>;
}) {
  const { id, n } = await params;
  const query = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=/attempt/${id}/results/${n}`);

  const ordinal = /^\d{1,3}$/.test(n) ? Number(n) : NaN;
  const review = Number.isInteger(ordinal) ? getReviewItem(getDb(), id, user.id, ordinal) : null;
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
  const keyIds = keyOptionIds(question.answerKey);
  const chosen = chosenOptionIds(response);
  const trail = [
    { href: '/', label: 'Home' },
    { href: `/dashboard?exam=${review.examKey}`, label: 'Dashboard' },
    { href: `/attempt/${id}/results`, label: 'Results' },
    { label: `Question ${ordinal}` },
  ];

  return (
    <Container size="narrow">
      <Breadcrumbs trail={trail} />
      <p className="eyebrow mb-3">{`${review.examShortName} · ${review.blueprintLabel}`}</p>
      <h1 className="font-heading text-3xl font-semibold">{`Question ${ordinal} of ${review.total}`}</h1>
      <p className="mt-2 text-sm text-ink-muted">{`${item.domainName} · ${item.skillName}`}</p>

      <LearningNotice code={query.notice} className="mt-6" />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <OutcomeBadge outcome={item.outcome} />
        {item.flagged ? <Badge tone="caution">You marked this</Badge> : null}
        {item.seenBefore ? <Badge tone="neutral">Seen in an earlier session</Badge> : null}
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-1.5 rounded-card border border-line bg-surface p-4 text-sm sm:grid-cols-[minmax(8rem,auto)_1fr]">
        <dt className="font-medium text-ink-muted">Your answer</dt>
        <dd>{describeResponse(response, question.options)}</dd>
        <dt className="font-medium text-ink-muted">Correct answer</dt>
        <dd>{describeAnswerKey(question.answerKey, question.options)}</dd>
      </dl>

      {item.correction === 'corrected' ? (
        <Alert tone="info" title="Corrected since you answered it" className="mt-4">
          <p>
            It is shown here exactly as you saw it, and your result stands as it was. New practice and retries
            use the corrected version, which has passed review.
          </p>
        </Alert>
      ) : item.correction === 'unavailable' ? (
        <Alert tone="caution" title="Being revised" className="mt-4">
          <p>This question is shown as you saw it, but it is not offered for new practice or retries until its revision has been reviewed.</p>
        </Alert>
      ) : null}

      <article aria-labelledby="question-heading" className="mt-8">
        <h2 id="question-heading" className="sr-only">The question</h2>
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
                    <span className="w-5 shrink-0 font-semibold text-ink-muted">{`${option.label}.`}</span>
                    <Markdown source={option.textMd} className="question-text min-w-0 flex-1" />
                  </div>
                  {isChosen || isKey ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {isChosen ? <Badge tone="accent">Your answer</Badge> : null}
                      {isKey ? <Badge tone="positive">Correct answer</Badge> : null}
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
            Worked explanation
          </h2>
          <Markdown source={question.explanationMd} className="prose-academic question-text text-sm" />
          <p className="mt-3 text-xs text-ink-subtle">
            {`Difficulty label: ${question.difficultyBasis} judgement, not calibrated against response data.`}
          </p>
        </section>
      </article>

      {missed ? (
        <section id="labels" aria-labelledby="labels-heading" className="mt-8 scroll-mt-24">
          <form action={saveLabelsAction} className="rounded-card border border-line bg-surface p-5">
            <fieldset>
              <legend id="labels-heading" className="font-heading text-lg font-semibold">
                Why did you miss it? <span className="text-sm font-normal text-ink-muted">Optional</span>
              </legend>
              <p className="mt-1 text-sm text-ink-muted">
                Only you know, so nothing is filled in for you. Choose any that apply. Labels are private and change
                nothing about your result.
              </p>
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
                    {label.text}
                  </label>
                ))}
              </div>
            </fieldset>
            <input type="hidden" name="attemptItemId" value={item.attemptItemId} />
            <input type="hidden" name="returnTo" value={here} />
            <div className="mt-4">
              <SubmitButton variant="secondary" size="sm" pendingLabel="Saving…">
                Save labels
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
            <SubmitButton size="sm" pendingLabel="Starting…">
              Retry this question
            </SubmitButton>
          </form>
        ) : null}
        <form action={toggleBookmarkAction}>
          <input type="hidden" name="questionId" value={item.questionId} />
          <input type="hidden" name="returnTo" value={here} />
          <SubmitButton size="sm" variant="secondary">
            {review.bookmarked ? 'Remove bookmark' : 'Bookmark'}
          </SubmitButton>
        </form>
        <Link href={`/report-question?id=${encodeURIComponent(item.questionId)}`} className="text-sm">
          Report a problem with this question
        </Link>
      </div>

      <nav aria-label="Questions in this session" className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
        {review.previous ? (
          <ButtonLink href={`/attempt/${id}/results/${review.previous}`} variant="secondary" size="sm">
            Previous question
          </ButtonLink>
        ) : null}
        {review.next ? (
          <ButtonLink href={`/attempt/${id}/results/${review.next}`} variant="secondary" size="sm">
            Next question
          </ButtonLink>
        ) : null}
        {review.nextMistake ? (
          <ButtonLink href={`/attempt/${id}/results/${review.nextMistake}`} size="sm">
            Next mistake
          </ButtonLink>
        ) : null}
        <Link href={`/attempt/${id}/results`} className="text-sm">
          Back to results
        </Link>
      </nav>
    </Container>
  );
}
