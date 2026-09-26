import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { UnauthorizedError, requireUser, type AuthUser } from '@/lib/auth/session';
import { EXAM_CONFIGS, listHubs, requireExamConfig } from '@/lib/exams/registry';
import { buildDashboard, dashboardHref, examDisplayName, examLabel } from '@/lib/learning/dashboard';
import {
  EmptyBank,
  ExamSwitcher,
  GuestNote,
  NextStepCard,
  NoHistoryYet,
  OtherSteps,
  ProgressSummary,
  RecentSessions,
  TopicLandscape,
  UnfinishedList,
} from '@/components/dashboard/dashboard-sections';
import { Alert, Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';

/**
 * The learner's dashboard.
 *
 * Everything here is arithmetic on this learner's own answers, and every number
 * is shown with the count it was computed from. The exam shown can be chosen in
 * the address (`?exam=`); choosing one only changes what is shown, never the
 * learner's target. The data is built in src/lib/learning/dashboard.ts.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your dashboard',
  description: 'Your unfinished sessions, what to work on next and your accuracy by topic.',
  // Private page. Authorization is the protection; this is only an indexing hint.
  robots: { index: false, follow: false },
};

async function requireLearner(nextPath: string): Promise<AuthUser> {
  try {
    return await requireUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect(`/sign-in?next=${encodeURIComponent(nextPath)}`);
    }
    throw error;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string | string[] }>;
}) {
  const user = await requireLearner('/dashboard');
  const query = await searchParams;
  const data = buildDashboard(getDb(), user, query.exam);
  const exam = data.exam;
  const trail = [{ href: '/', label: 'Home' }, { label: 'Dashboard' }];

  return (
    <Container>
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow={exam ? examLabel(exam.examKey) : undefined}
        title="Your dashboard"
        lead="Counted from your own answers. Nothing here predicts a score."
      />

      {data.unknownExam ? (
        <Alert tone="caution" className="mb-8">
          {exam
            ? `That link named an exam we do not offer, so this shows your ${exam.shortName} practice instead.`
            : 'That link named an exam we do not offer.'}
        </Alert>
      ) : null}

      {data.guest ? <GuestNote guest={data.guest} /> : null}

      {data.unfinished.length > 0 ? <UnfinishedList items={data.unfinished} /> : null}

      {data.choices.length > 1 ? <ExamSwitcher choices={data.choices} /> : null}

      {!exam ? (
        <ChooseAnExam />
      ) : (
        <>
          {exam.bankSize === 0 ? <EmptyBank exam={exam} /> : null}
          {exam.finishedCount === 0 && exam.totalScored === 0 ? (
            exam.bankSize > 0 ? <NoHistoryYet exam={exam} /> : null
          ) : (
            <>
              {exam.next ? <NextStepCard step={exam.next} /> : null}
              <ProgressSummary exam={exam} />
              <OtherSteps steps={exam.others} />
              <TopicLandscape exam={exam} />
              <RecentSessions exam={exam} />
            </>
          )}

          <Alert tone="info" title="What this page does not do" className="mb-8">
            <p>
              It does not predict a score, place you in a percentile, or estimate your chance of
              admission. Every figure above is a count of your own answers and nothing more.
            </p>
          </Alert>

          <div className="mb-10 flex flex-wrap gap-3">
            {exam.bankSize > 0 ? (
              <ButtonLink href={`/practice/${exam.examKey}`}>{`Practise ${exam.shortName}`}</ButtonLink>
            ) : null}
            <ButtonLink href="/review" variant="secondary">
              Mistake notebook
            </ButtonLink>
            <ButtonLink href="/study-plan" variant="secondary">
              Study plan
            </ButtonLink>
          </div>

          <OtherExams current={exam.examKey} shown={data.choices.map((choice) => choice.examKey)} />
        </>
      )}
    </Container>
  );
}

/** Nothing practised and no target: offer a choice, not a guess. */
function ChooseAnExam() {
  return (
    <section aria-labelledby="choose-heading">
      <h2 id="choose-heading" className="mb-2 font-heading text-2xl font-semibold">
        Choose an exam to start
      </h2>
      <p className="mb-5 max-w-2xl text-ink-muted">
        This page then follows the exam you practise, and you can switch between exams here at any time.
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {listHubs().map((hub) => (
          <Card as="li" key={hub.slug}>
            <h3 className="font-heading text-xl font-semibold">{hub.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-subtle">{hub.publisher}</p>
            <p className="mt-2 text-sm text-ink-muted">{hub.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {hub.configKeys.map(requireExamConfig).map((config) => (
                <ButtonLink key={config.examKey} href={`/practice/${config.examKey}`} size="sm">
                  {hub.configKeys.length > 1 ? `Practise ${config.shortName}` : 'Start practising'}
                </ButtonLink>
              ))}
              <ButtonLink href={`/exams/${hub.slug}`} size="sm" variant="secondary">
                Exam guide
              </ButtonLink>
            </div>
          </Card>
        ))}
      </ul>
    </section>
  );
}

/** Every other exam, each opening its own view of this dashboard. */
function OtherExams({ current, shown }: { current: string; shown: string[] }) {
  const others = EXAM_CONFIGS.filter((config) => config.examKey !== current && !shown.includes(config.examKey));
  if (others.length === 0) return null;
  return (
    <section aria-labelledby="other-exams-heading">
      <h2 id="other-exams-heading" className="mb-2 font-heading text-lg font-semibold">
        Practising something else?
      </h2>
      <p className="mb-3 text-sm text-ink-muted">
        Open another exam here. It does not change the exam you have set as your target.
      </p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {others.map((other) => (
          <li key={other.examKey}>
            <Link href={dashboardHref(other.examKey)}>{examDisplayName(other.examKey)}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
