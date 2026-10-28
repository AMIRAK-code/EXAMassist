import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { pageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
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
import { loadEntitlements } from '@/lib/billing/entitlements';
import { UpgradePrompt } from '@/components/billing/upgrade-prompt';
import { PlanningExamSwitcher, PlanningNotice, PlanningViews } from '@/components/planning/planning-views';
import { DateConflictCard } from '@/components/planning/plan-parts';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'learning.progress.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: (await pageAlternates(params, '/study-plan/progress')),
    robots: { index: false, follow: false },
  };
}

type Query = { exam?: string | string[]; notice?: string | string[] };

export default async function ReadinessPage({ searchParams }: { searchParams: Promise<Query> }) {
  const user = await requireSignedIn('/study-plan/progress');
  const query = await searchParams;
  const db = getDb();
  const { examKey, choices } = (await planningExam(db, user, query.exam, 'progress'));
  const t = await getTranslations('learning');

  const trail = [
    { href: '/', label: t('crumbs.home') },
    { href: '/dashboard', label: t('crumbs.dashboard') },
    { href: planningHref('plan', examKey), label: t('crumbs.studyPlan') },
    { label: t('crumbs.progress') },
  ];

  if (!examKey) {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader title={t('crumbs.studyPlan')} />
        <PlanningViews current="progress" examKey={null} />
        <p className="mb-6 text-ink-muted">{t('progress.chooseLead')}</p>
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
  // The study plan and readiness are part of a paid plan for this exam.
  if (!(await loadEntitlements(db, user.id)).can('study_plan', config.examKey)) {
    return (
      <Container>
        <Breadcrumbs trail={trail} />
        <PageHeader eyebrow={config.publisher} title={t('crumbs.studyPlan')} />
        <PlanningViews current="progress" examKey={config.examKey} />
        <PlanningExamSwitcher choices={choices} />
        <UpgradePrompt feature="study_plan" examKey={config.examKey} examName={config.shortName} />
      </Container>
    );
  }
  const target = (await getExamTarget(db, user.id, config.examKey));
  const dates = (await examDateFor(db, user.id, config.examKey));
  const assessment = (await buildReadiness(db, user.id, config, target?.targetScore ?? null));
  const hub = getHubForConfig(config.examKey);

  // Suggestions are built from what can be practised now.
  const practice = getBlueprint(config, 'practice');
  const timed = (await blueprintAvailability(db, config)).find((a) => a.available && a.blueprint.timing !== 'untimed' && a.blueprint.mode !== 'review');
  const suggestions = buildSuggestions({
    config,
    assessment,
    allFacets: (await practiceFacets(db, config)),
    unseenFacets: practice ? facetsFromPool((await getPool(db, config.examKey, user.id)).filter((item) => item.lastSeenAt === null), config, practice) : [],
    retryable: (await retryableMissed(db, user.id, config.examKey)).length,
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

      <PageHeader eyebrow={config.publisher} title={t('crumbs.studyPlan')} />
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
            title={t('progress.noAnswersTitle', { exam: config.shortName })}
            action={<ButtonLink href={`/practice/${config.examKey}`}>{t('progress.startPractising')}</ButtonLink>}
          >
            <p>{t('progress.noAnswersLead')}</p>
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
              <Link href={`/exams/${hub.slug}/format`}>{t('progress.formatLink', { exam: config.shortName })}</Link>
            </p>
          ) : null}
        </div>
      )}
    </Container>
  );
}
