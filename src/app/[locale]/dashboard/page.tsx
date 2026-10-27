import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { languageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
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

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'learning.dashboard.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: languageAlternates('/dashboard', locale),
    // Private page. Authorization is the protection; this is only an indexing hint.
    robots: { index: false, follow: false },
  };
}

async function requireLearner(nextPath: string, locale: Locale): Promise<AuthUser> {
  try {
    return await requireUser();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      redirect({ href: `/sign-in?next=${encodeURIComponent(nextPath)}`, locale });
    }
    throw error;
  }
}

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ exam?: string | string[] }>;
}) {
  const { locale } = await params;
  const user = await requireLearner('/dashboard', locale);
  const query = await searchParams;
  const data = (await buildDashboard(getDb(), user, query.exam));
  const exam = data.exam;
  const t = await getTranslations('learning');
  const trail = [{ href: '/', label: t('crumbs.home') }, { label: t('crumbs.dashboard') }];

  return (
    <Container>
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow={exam ? examLabel(exam.examKey) : undefined}
        title={t('dashboard.title')}
        lead={t('dashboard.lead')}
      />

      {data.unknownExam ? (
        <Alert tone="caution" className="mb-8">
          {exam ? t('dashboard.unknownExamShowing', { exam: exam.shortName }) : t('dashboard.unknownExam')}
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

          <Alert tone="info" title={t('dashboard.doesNotTitle')} className="mb-8">
            <p>{t('dashboard.doesNot')}</p>
          </Alert>

          <div className="mb-10 flex flex-wrap gap-3">
            {exam.bankSize > 0 ? (
              <ButtonLink href={`/practice/${exam.examKey}`}>{t('dashboard.practise', { exam: exam.shortName })}</ButtonLink>
            ) : null}
            <ButtonLink href="/review" variant="secondary">
              {t('crumbs.notebook')}
            </ButtonLink>
            <ButtonLink href="/study-plan" variant="secondary">
              {t('crumbs.studyPlan')}
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
  const t = useTranslations('learning.dashboard');
  return (
    <section aria-labelledby="choose-heading">
      <h2 id="choose-heading" className="mb-2 font-heading text-2xl font-semibold">
        {t('chooseTitle')}
      </h2>
      <p className="mb-5 max-w-2xl text-ink-muted">{t('chooseLead')}</p>
      <ul className="grid gap-4 md:grid-cols-2">
        {listHubs().map((hub) => (
          <Card as="li" key={hub.slug}>
            <h3 className="font-heading text-xl font-semibold">{hub.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-subtle">{hub.publisher}</p>
            {/* The hub's tagline is exam content, kept as published. */}
            <p className="mt-2 text-sm text-ink-muted">{hub.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {hub.configKeys.map(requireExamConfig).map((config) => (
                <ButtonLink key={config.examKey} href={`/practice/${config.examKey}`} size="sm">
                  {hub.configKeys.length > 1 ? t('practise', { exam: config.shortName }) : t('startPractising')}
                </ButtonLink>
              ))}
              <ButtonLink href={`/exams/${hub.slug}`} size="sm" variant="secondary">
                {t('examGuide')}
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
  const t = useTranslations('learning.dashboard');
  const others = EXAM_CONFIGS.filter((config) => config.examKey !== current && !shown.includes(config.examKey));
  if (others.length === 0) return null;
  return (
    <section aria-labelledby="other-exams-heading">
      <h2 id="other-exams-heading" className="mb-2 font-heading text-lg font-semibold">
        {t('otherTitle')}
      </h2>
      <p className="mb-3 text-sm text-ink-muted">{t('otherLead')}</p>
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
