import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { pageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getDb } from '@/lib/db';
import { requireSignedIn } from '@/lib/auth/guards';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';
import { getExamTarget } from '@/lib/learning/queries';
import { planningExam, planningHref } from '@/lib/learning/planning';
import {
  OFFICIAL_SCORES_VERIFIED_ON,
  buildHistory,
  getOfficialScore,
  listOfficialScores,
  officialScoreExam,
} from '@/lib/learning/official-scores';
import { Alert, Breadcrumbs, Card, Container, EmptyState, PageHeader } from '@/components/ui';
import { PlanningExamSwitcher, PlanningViews } from '@/components/planning/planning-views';
import { OfficialScoreForm } from '@/components/official-scores/score-form';
import { LatestOfficialResult, OfficialScoreHistoryTables } from '@/components/official-scores/score-history';

/**
 * Official practice scores: results the learner received on practice tests
 * the test maker itself publishes, entered by hand, kept apart from anything
 * UniExamer measures (src/lib/learning/official-scores.ts).
 *
 * Open to every signed-in learner: recording your own results is not part of
 * a paid plan.
 */

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'learning.officialScores.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: await pageAlternates(params, '/study-plan/scores'),
    robots: { index: false, follow: false },
  };
}

type Query = { exam?: string | string[]; edit?: string | string[] };

export default async function OfficialScoresPage({ searchParams }: { searchParams: Promise<Query> }) {
  const user = await requireSignedIn('/study-plan/scores');
  const query = await searchParams;
  const db = getDb();
  const { examKey, choices } = await planningExam(db, user, query.exam, 'scores');
  const t = await getTranslations('learning');
  const format = await getFormatter();

  const trail = [
    { href: '/', label: t('crumbs.home') },
    { href: '/dashboard', label: t('crumbs.dashboard') },
    { href: planningHref('plan', examKey), label: t('crumbs.studyPlan') },
    { label: t('officialScores.title') },
  ];

  if (!examKey) {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader title={t('officialScores.title')} />
        <PlanningViews current="scores" examKey={null} />
        <p className="mb-6 text-ink-muted">{t('officialScores.chooseLead')}</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {EXAM_CONFIGS.filter((option) => officialScoreExam(option.examKey)).map((option) => (
            <Card as="li" key={option.examKey}>
              <h2 className="text-lg">
                <Link href={planningHref('scores', option.examKey)} className="no-underline hover:underline">
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

  const config = getExamConfig(examKey)!;
  const exam = officialScoreExam(examKey);

  const header = (
    <>
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow={config.publisher} title={t('officialScores.title')} />
      <PlanningViews current="scores" examKey={examKey} />
      <PlanningExamSwitcher choices={choices} />
    </>
  );

  if (!exam) {
    return (
      <Container>
        {header}
        <EmptyState title={t('officialScores.unsupportedTitle', { exam: config.shortName })}>
          <p>{t('officialScores.unsupportedBody')}</p>
        </EmptyState>
      </Container>
    );
  }

  const records = await listOfficialScores(db, user.id, examKey);
  const target = await getExamTarget(db, user.id, examKey);
  const history = buildHistory(examKey, records, target?.targetScore ?? null);
  const editId = Array.isArray(query.edit) ? query.edit[0] : query.edit;
  const editing = editId ? await getOfficialScore(db, user.id, editId) : null;
  const versions = exam.versions.map((v) => ({
    key: v.key,
    label: v.label,
    overall: v.overall,
    sections: v.sections.map((s) => ({ key: s.key, label: s.label, scale: s.scale })),
  }));
  const usedVersions = new Set(records.map((r) => r.scaleKey));
  const factsFor = exam.versions.filter((v) => usedVersions.has(v.key) || v === exam.versions[0]);

  return (
    <Container>
      {header}

      <Alert tone="info" className="mb-8" title={t('officialScores.label')}>
        <p>{t('officialScores.lead')}</p>
      </Alert>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <LatestOfficialResult history={history} examName={config.shortName} />
        <Card padding="lg">
          <h2 className="text-xl">{t('officialScores.measured.title')}</h2>
          <p className="mt-2 text-sm text-ink-muted">{t('officialScores.measured.body')}</p>
          <p className="mt-3 text-sm">
            <Link href={planningHref('progress', examKey)}>{t('officialScores.measured.link')}</Link>
          </p>
          {target === null || target.targetScore === null ? (
            <p className="mt-3 text-sm text-ink-muted">{t('officialScores.measured.setTarget')}</p>
          ) : null}
        </Card>
      </div>

      <div className="mt-10">
        <OfficialScoreHistoryTables history={history} examKey={examKey} />
      </div>

      <div className="mt-10">
        <OfficialScoreForm
          key={editing?.id ?? 'new'}
          examKey={examKey}
          versions={versions}
          providers={exam.providers}
          initial={editing}
          today={new Date().toISOString().slice(0, 10)}
        />
      </div>

      <section className="mt-10" aria-labelledby="scale-facts-heading">
        <h2 id="scale-facts-heading" className="text-xl">
          {t('officialScores.facts.title')}
        </h2>
        {factsFor.map((version) => (
          <div key={version.key} className="mt-4">
            <h3 className="text-base font-semibold">{version.label}</h3>
            <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-ink-muted">
              {version.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-ink-subtle">
              {t('officialScores.facts.sources', {
                date: format.dateTime(new Date(`${OFFICIAL_SCORES_VERIFIED_ON}T00:00:00Z`), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
              })}{' '}
              {version.sources.map((source, index) => (
                <span key={source}>
                  {index > 0 ? ' · ' : ''}
                  <a href={source} rel="noopener noreferrer" className="break-all">
                    {new URL(source).hostname}
                  </a>
                </span>
              ))}
            </p>
          </div>
        ))}
      </section>
    </Container>
  );
}
