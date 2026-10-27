import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { expireIfDue, AttemptError } from '@/lib/attempts/service';
import { getResultsSummary } from '@/lib/learning/results';
import { examLabel } from '@/lib/learning/dashboard';
import { pendingOwner } from '@/lib/player/owner';
import { LearningNotice } from '@/components/learning-notice';
import { UnsentAnswersNotice } from '@/components/player/unsent-answers-notice';
import { HowToRead, NextSteps, QuestionList, Verdict, WhereMarksWentLost } from '@/components/results/results-sections';
import { DebriefTutor } from '@/components/tutor/tutor-panel';
import { tutorEnabled } from '@/lib/tutor/config';
import { billingSettings } from '@/lib/billing/config';
import { getAccess } from '@/lib/billing/service';
import { getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { Alert, Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';

/**
 * A finished session's results: the outcome, where marks were lost (with the
 * evidence each statement rests on), what to do next, and every question,
 * each reviewed on its own page. Raw counts only: no scaled score, no
 * percentile, no readiness claim.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your results',
  robots: { index: false, follow: false },
};

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string | string[] }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=/attempt/${id}/results`);

  const db = getDb();
  try {
    // A session whose clock ran out while nobody was looking is closed first.
    (await expireIfDue(db, id, user.id));
  } catch (error) {
    if (error instanceof AttemptError && error.status === 404) notFound();
    throw error;
  }
  const summary = (await getResultsSummary(db, id, user.id));
  if (!summary) {
    const inProgress = (await db.prepare("SELECT 1 FROM attempts WHERE id = ? AND user_id = ? AND status = 'in_progress'").get(id, user.id));
    if (inProgress) redirect(`/attempt/${id}`);
    notFound();
  }

  // After the free test, the next step for a learner without Premium is the
  // offer for this same exam, so the exam they chose is not lost here.
  const attemptRow = (await db.prepare('SELECT settings_json FROM attempts WHERE id = ? AND user_id = ?').get(id, user.id)) as
    | { settings_json: string }
    | undefined;
  const wasFreeTest = Boolean(attemptRow && JSON.parse(attemptRow.settings_json)?.freeTest);
  const offer =
    wasFreeTest && billingSettings().enabled && !(await getAccess(db, user.id)).fullAccess
      ? getExamConfig(summary.examKey)
      : undefined;
  const offerHub = offer ? getHubForConfig(offer.examKey) : undefined;

  const finished = new Date(summary.finishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const trail = [
    { href: '/', label: 'Home' },
    { href: `/dashboard?exam=${summary.examKey}`, label: 'Dashboard' },
    { label: 'Results' },
  ];

  return (
    <Container>
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow={examLabel(summary.examKey)} title="Your results" lead={`${summary.blueprintLabel} · finished ${finished}`} />

      <LearningNotice code={query.notice} className="mb-6" />
      <UnsentAnswersNotice attemptId={id} owner={pendingOwner(user.id)} />

      {summary.status === 'expired' ? (
        <Alert tone="caution" title="This session ran out of time" className="mb-6">
          <p>The clock reached zero, so unanswered questions were recorded as left blank.</p>
        </Alert>
      ) : null}

      {summary.isRetry ? (
        <Alert tone="info" title="A retry of questions you had missed" className="mb-6">
          <p>
            These questions were asked again. This result stands on its own: it did not change the session the
            questions came from, and it is not counted in your accuracy by topic.
          </p>
          {summary.retrySourceAttemptId ? (
            <p className="mt-2">
              <Link href={`/attempt/${summary.retrySourceAttemptId}/results`}>See the original session</Link>
            </p>
          ) : null}
        </Alert>
      ) : null}

      <Verdict summary={summary} />
      <WhereMarksWentLost summary={summary} />
      <NextSteps summary={summary} />
      {offer ? (
        <Card padding="lg" className="mb-10 border-2 border-accent">
          <h2 className="font-heading text-xl font-semibold">Keep preparing for the {offerHub?.name ?? offer.name}</h2>
          <p className="mt-2 text-ink-muted">
            That was your free test. Premium opens every {offerHub?.label ?? offer.shortName} practice format with
            fresh questions each time, brings back the questions you missed, and plans your sessions toward your
            test date.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href={`/premium?exam=${encodeURIComponent(offer.examKey)}&reason=free-test-used`}>
              See Premium for {offerHub?.label ?? offer.shortName}
            </ButtonLink>
            {offerHub ? (
              <ButtonLink href={`/exams/${offerHub.slug}`} variant="secondary">
                Back to {offerHub.name} preparation
              </ButtonLink>
            ) : null}
          </div>
        </Card>
      ) : null}
      {/* Optional AI after-test guide: only when the operator has switched the tutor on. */}
      {tutorEnabled() ? (
        <section aria-label="After-test guide" className="mb-10">
          <DebriefTutor attemptId={id} />
        </section>
      ) : null}
      <QuestionList summary={summary} />
      <HowToRead summary={summary} />
    </Container>
  );
}
