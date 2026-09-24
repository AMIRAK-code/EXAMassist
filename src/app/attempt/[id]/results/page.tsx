import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { AttemptError, getAttemptState, getResult } from '@/lib/attempts/service';
import { toPlayerModel } from '@/lib/attempts/view-model';
import { getHubForConfig, requireExamConfig } from '@/lib/exams/registry';
import { StimulusView } from '@/components/stimulus-view';
import { Alert, Badge, ButtonLink, Card, Container, DefinitionList, PageHeader } from '@/components/ui';
import { SkillBreakdown } from '@/components/results/skill-breakdown';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your results',
  robots: { index: false, follow: false },
};

interface SkillRow {
  key: string;
  label: string;
  correct: number;
  incorrect: number;
  omitted: number;
  total: number;
  accuracy: number;
  medianTimeMs: number;
  notAutoScored: number;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes} min ${seconds} s` : `${seconds} s`;
}

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=/attempt/${id}/results`);

  let state;
  let result;
  try {
    state = getAttemptState(getDb(), id, user.id);
    result = getResult(getDb(), id, user.id);
  } catch (error) {
    if (error instanceof AttemptError && error.status === 404) notFound();
    throw error;
  }

  if (state.status === 'in_progress') redirect(`/attempt/${id}`);
  if (!result) notFound();

  const config = requireExamConfig(state.examKey);
  const hub = getHubForConfig(state.examKey);
  const model = toPlayerModel(state);
  const skills = result.bySkill as SkillRow[];
  const methodology = result.methodology as {
    officialFacts: Record<string, unknown>;
    ourApproximation: Record<string, string>;
    notProvided: Record<string, string | null>;
    unverifiedRules: string[];
  };

  const { totals } = result;
  const answered = totals.correct + totals.incorrect;
  const weakest = [...skills]
    .filter((s) => s.total - s.notAutoScored > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  return (
    <Container>
      <PageHeader
        eyebrow={state.examName}
        title="Your results"
        lead={`${model.blueprintLabel} · completed ${new Date(result.computedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
      />

      {state.status === 'expired' ? (
        <Alert tone="caution" title="This session ran out of time" className="mb-6">
          The clock reached zero, so unanswered questions were recorded as omitted.
        </Alert>
      ) : null}

      {/* Headline figures - raw performance only, never an invented scaled score */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-ink-muted">Correct</p>
          <p className="font-heading text-3xl font-semibold tabular-nums">
            {totals.correct}
            <span className="text-lg font-normal text-ink-subtle"> / {totals.correct + totals.incorrect + totals.omitted}</span>
          </p>
        </Card>
        <Card>
          <p className="text-sm text-ink-muted">Accuracy on answered questions</p>
          <p className="font-heading text-3xl font-semibold tabular-nums">
            {answered > 0 ? `${Math.round((totals.correct / answered) * 100)}%` : '—'}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-ink-muted">
            Raw points
            {config.scoring.pointsIncorrect !== 0 ? ' (penalties applied)' : ''}
          </p>
          <p className="font-heading text-3xl font-semibold tabular-nums">
            {Math.round(totals.pointsEarned * 100) / 100}
            <span className="text-lg font-normal text-ink-subtle"> / {totals.pointsPossible}</span>
          </p>
        </Card>
        <Card>
          <p className="text-sm text-ink-muted">Time spent</p>
          <p className="font-heading text-3xl font-semibold tabular-nums">
            {formatDuration(totals.totalTimeMs)}
          </p>
        </Card>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-ink-muted">Answered correctly</p>
          <p className="text-2xl font-semibold tabular-nums text-positive">{totals.correct}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-muted">Answered incorrectly</p>
          <p className="text-2xl font-semibold tabular-nums text-negative">{totals.incorrect}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-muted">Left blank</p>
          <p className="text-2xl font-semibold tabular-nums text-ink-muted">{totals.omitted}</p>
          {config.scoring.pointsIncorrect !== 0 ? (
            <p className="mt-1 text-xs text-ink-subtle">
              On this exam a blank scores {config.scoring.pointsOmitted} and a wrong answer scores{' '}
              {config.scoring.pointsIncorrect}.
            </p>
          ) : null}
        </Card>
      </div>

      {/* What this score is and is not */}
      <Card className="mb-8 border-s-4 border-s-accent">
        <h2 className="font-heading text-xl font-semibold">How to read this</h2>
        <div className="mt-3 grid gap-5 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
              Official facts about {config.shortName}
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-ink-muted">
              {config.scoring.officialScale ? (
                <li>
                  The real exam reports {config.scoring.officialScale.label} from{' '}
                  {config.scoring.officialScale.min} to {config.scoring.officialScale.max}.
                </li>
              ) : null}
              <li>
                Correct {config.scoring.pointsCorrect}, wrong {config.scoring.pointsIncorrect}, omitted{' '}
                {config.scoring.pointsOmitted}.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
              Our approximation
            </h3>
            <p className="mt-2 text-sm text-ink-muted">{methodology.ourApproximation.fidelityNote}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
              What we do not provide
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-ink-muted">
              {methodology.notProvided.scaledScore ? <li>{methodology.notProvided.scaledScore}</li> : null}
              <li>{methodology.notProvided.percentiles}</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Skill breakdown */}
      <section aria-labelledby="skills-heading" className="mb-8">
        <h2 id="skills-heading" className="mb-4 font-heading text-2xl font-semibold">
          Performance by skill
        </h2>
        {skills.length > 0 ? (
          <SkillBreakdown rows={skills} />
        ) : (
          <p className="text-ink-muted">No skill data for this session.</p>
        )}
      </section>

      {/* Next steps */}
      {weakest.length > 0 ? (
        <Card className="mb-8">
          <h2 className="font-heading text-xl font-semibold">What to work on next</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Based on accuracy in this session alone. One session is a small sample, so treat it as a
            pointer rather than a diagnosis.
          </p>
          <ul className="mt-4 space-y-3">
            {weakest.map((skill) => (
              <li key={skill.key} className="flex flex-wrap items-center justify-between gap-3">
                <span>
                  <span className="font-medium">{skill.label}</span>
                  <span className="ms-2 text-sm text-ink-muted">
                    {skill.correct} of {skill.total - skill.notAutoScored} correct
                  </span>
                </span>
                <ButtonLink
                  size="sm"
                  variant="secondary"
                  href={`/practice/${state.examKey}?skill=${encodeURIComponent(skill.key)}`}
                >
                  Practise this skill
                </ButtonLink>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {/* Question-by-question review */}
      <section aria-labelledby="review-heading">
        <h2 id="review-heading" className="mb-4 font-heading text-2xl font-semibold">
          Question review
        </h2>
        <ol className="space-y-6">
          {model.parts.flatMap((part) =>
            part.items.map((item) => {
              const review = item.review;
              const tone =
                review?.correct === true ? 'positive' : item.answered ? 'negative' : 'neutral';
              return (
                <li key={`${part.partIndex}-${item.position}`}>
                  <Card>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <h3 className="font-heading text-lg font-semibold">
                        {model.parts.length > 1 ? `${part.label} · ` : ''}Question {item.position + 1}
                      </h3>
                      <Badge tone={tone}>
                        {review?.correct === true
                          ? 'Correct'
                          : item.answered
                            ? 'Incorrect'
                            : 'Left blank'}
                      </Badge>
                      {item.flagged ? <Badge tone="caution">You marked this</Badge> : null}
                    </div>

                    {item.stimulus ? (
                      <div className="mb-4">
                        <StimulusView stimulus={item.stimulus} />
                      </div>
                    ) : null}

                    <div
                      className="prose-academic question-body mb-4"
                      dangerouslySetInnerHTML={{ __html: item.stemHtml }}
                    />

                    {item.options.length > 0 ? (
                      <ul className="mb-4 space-y-1.5 text-sm">
                        {item.options.map((option) => {
                          const chosen =
                            item.response?.type === 'single_select'
                              ? item.response.optionId === option.id
                              : item.response?.type === 'multi_select'
                                ? item.response.optionIds.includes(option.id)
                                : false;
                          const rationale = review?.distractorHtml[option.id];
                          return (
                            <li key={option.id} className="rounded border border-line p-2.5">
                              <span className="flex gap-2">
                                <span className="font-semibold text-ink-muted">{option.label}.</span>
                                <span dangerouslySetInnerHTML={{ __html: option.html }} />
                                {chosen ? <Badge tone="accent">Your answer</Badge> : null}
                              </span>
                              {rationale ? (
                                <p className="mt-1.5 ps-6 text-ink-muted">
                                  <span dangerouslySetInnerHTML={{ __html: rationale }} />
                                </p>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}

                    {review ? (
                      <div className="rounded-card bg-surface-sunken p-4">
                        {review.correctSummary ? (
                          <p className="mb-2 font-medium">Answer: {review.correctSummary}</p>
                        ) : null}
                        <div
                          className="prose-academic text-sm"
                          dangerouslySetInnerHTML={{ __html: review.explanationHtml }}
                        />
                        <p className="mt-3 text-xs text-ink-subtle">
                          Difficulty label: {review.difficultyBasis} judgement, not calibrated against
                          response data.
                        </p>
                      </div>
                    ) : null}

                    <p className="mt-3 text-xs text-ink-subtle">
                      <Link href={`/report-question?id=${encodeURIComponent(item.questionId)}`}>
                        Report a problem with this question
                      </Link>
                    </p>
                  </Card>
                </li>
              );
            }),
          )}
        </ol>
      </section>

      {methodology.unverifiedRules.length > 0 ? (
        <Alert tone="info" title="Rules we could not verify for this exam" className="mt-8">
          <ul className="mt-1 list-disc space-y-1 ps-5">
            {methodology.unverifiedRules.slice(0, 5).map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          {hub ? (
            <p className="mt-2">
              <Link href={`/exams/${hub.slug}/format`}>See the full format guide and sources</Link>
            </p>
          ) : null}
        </Alert>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={`/practice/${state.examKey}`}>Practise again</ButtonLink>
        <ButtonLink variant="secondary" href="/dashboard">
          Back to dashboard
        </ButtonLink>
        <ButtonLink variant="secondary" href="/review">
          Review your mistakes
        </ButtonLink>
      </div>
    </Container>
  );
}
