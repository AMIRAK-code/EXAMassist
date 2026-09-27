import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { requireSignedIn } from '@/lib/auth/guards';
import { EXAM_CONFIGS, getBlueprint, getHubForConfig, requireExamConfig } from '@/lib/exams/registry';
import { blueprintAvailability, facetsFromPool, practiceFacets } from '@/lib/attempts/availability';
import { getPool } from '@/lib/content/repository';
import { buildReadiness, getExamTarget } from '@/lib/learning/queries';
import { examDateFor, retryableMissed } from '@/lib/learning/plan';
import { planningExam, planningHref } from '@/lib/learning/planning';
import { buildSuggestions } from '@/lib/learning/suggestions';
import { ReadinessReport } from '@/components/readiness/readiness-report';
import { SuggestionsList } from '@/components/readiness/suggestions-list';
import { TargetForm } from '@/components/readiness/target-form';
import { Breadcrumbs, Card, Container, EmptyState, ButtonLink, PageHeader } from '@/components/ui';
import { PlanningExamSwitcher, PlanningNotice, PlanningViews } from '@/components/planning/planning-views';
import { DateConflictCard } from '@/components/planning/plan-parts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Progress and readiness',
  description: 'How your practice measures against the exam you are preparing for.',
  robots: { index: false, follow: false },
};

type Query = { exam?: string | string[]; notice?: string | string[] };

export default async function ReadinessPage({ searchParams }: { searchParams: Promise<Query> }) {
  const user = await requireSignedIn('/study-plan/progress');
  const query = await searchParams;
  const db = getDb();
  const { examKey, choices } = planningExam(db, user, query.exam, 'progress');

  const trail = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: planningHref('plan', examKey), label: 'Study plan' },
    { label: 'Progress & readiness' },
  ];

  if (!examKey) {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader title="Study plan" />
        <PlanningViews current="progress" examKey={null} />
        <p className="mb-6 text-ink-muted">Choose the exam you are preparing for, and this view measures your practice against it.</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {EXAM_CONFIGS.map((option) => (
            <Card as="li" key={option.examKey}>
              <h2 className="text-lg">
                <Link href={planningHref('progress', option.examKey)} className="no-underline hover:underline">
                  {option.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-ink-muted">{option.publisher}</p>
            </Card>
          ))}
        </ul>
      </Container>
    );
  }

  const config = requireExamConfig(examKey);
  const target = getExamTarget(db, user.id, config.examKey);
  const dates = examDateFor(db, user.id, config.examKey);
  const assessment = buildReadiness(db, user.id, config, target?.targetScore ?? null);
  const hub = getHubForConfig(config.examKey);

  // Suggestions are built from what can be practised now.
  const practice = getBlueprint(config, 'practice');
  const timed = blueprintAvailability(db, config).find((a) => a.available && a.blueprint.timing !== 'untimed' && a.blueprint.mode !== 'review');
  const suggestions = buildSuggestions({
    config,
    assessment,
    allFacets: practiceFacets(db, config),
    unseenFacets: practice ? facetsFromPool(getPool(db, config.examKey, user.id).filter((item) => item.lastSeenAt === null), config, practice) : [],
    retryable: retryableMissed(db, user.id, config.examKey).length,
    timedFormat: timed ? { label: timed.blueprint.label } : null,
  });

  const targetForm = (
    <TargetForm
      examKey={config.examKey}
      scale={config.scoring.officialScale}
      currentScore={target?.targetScore ?? null}
      currentDate={target?.targetDate ?? null}
    />
  );

  return (
    <Container>
      <Breadcrumbs trail={trail} />

      <PageHeader eyebrow={config.publisher} title="Study plan" />
      <PlanningViews current="progress" examKey={config.examKey} />
      <PlanningExamSwitcher choices={choices} />
      <PlanningNotice code={query.notice} className="mb-6" />
      {dates.examDate && dates.conflicting ? (
        <DateConflictCard examKey={config.examKey} examName={config.shortName} current={dates.examDate} earlier={dates.conflicting} returnTo="progress" />
      ) : null}
      {/* That this describes preparation, not a predicted score, is stated in the report itself (headline and limits). */}

      {assessment.answeredTotal === 0 ? (
        <div className="space-y-10">
          <EmptyState
            title={`No answers yet for ${config.shortName}`}
            action={<ButtonLink href={`/practice/${config.examKey}`}>Start practising</ButtonLink>}
          >
            <p>
              This page measures your readiness from questions you have actually answered. Answer some
              and it becomes meaningful — there is nothing useful we could tell you before that.
            </p>
          </EmptyState>
          {targetForm}
        </div>
      ) : (
        <div className="space-y-10">
          <ReadinessReport assessment={assessment} config={config} />
          <SuggestionsList examKey={config.examKey} suggestions={suggestions} planHref={planningHref('plan', config.examKey)} />
          {targetForm}

          {hub ? (
            <p className="text-sm">
              <Link href={`/exams/${hub.slug}/format`}>What the {config.shortName} actually looks like</Link>
            </p>
          ) : null}
        </div>
      )}
    </Container>
  );
}
