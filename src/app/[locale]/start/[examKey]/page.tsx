import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { pageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { getCoverage } from '@/lib/content/repository';
import { getBlueprint, getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { freeTestFor, freeTestPreview } from '@/lib/attempts/service';
import { tutorSettings } from '@/lib/tutor/config';
import { freeTestPath, pricingPath } from '@/lib/billing/config';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { PLANS, PLAN_COPY } from '@/lib/billing/plans';
import { Breadcrumbs, Container } from '@/components/ui';
import { Onboarding, type OnboardingStep } from './onboarding';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; examKey: string }>;
}): Promise<Metadata> {
  const { locale, examKey } = await params;
  const t = await getTranslations({ locale, namespace: 'practice.start' });
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
    alternates: (await pageAlternates(params, `/start/${examKey}`)),
  };
}

/**
 * What a learner without a plan for this exam sees after choosing it: a short
 * introduction, then the plans, with the free diagnostic one click away.
 * Everything said here comes from the exam's configuration and the bank.
 */
export default async function StartPage({ params }: { params: Promise<{ locale: string; examKey: string }> }) {
  const { locale, examKey } = await params;
  const config = getExamConfig(examKey);
  if (!config) notFound();

  const db = getDb();
  const user = await getCurrentUser();
  const entitlements = await loadEntitlements(db, user?.id ?? null);
  if (entitlements.can('practice', config.examKey)) redirect({ href: `/practice/${config.examKey}`, locale });

  const t = await getTranslations('practice');
  const format = await getFormatter();
  const price = (cents: number) => format.number(cents / 100, { style: 'currency', currency: 'EUR' });

  const hub = getHubForConfig(config.examKey);
  // Questions a learner can actually be served: published and human-approved.
  const reviewed = (await getCoverage(db, config.examKey)).reduce((sum, row) => sum + Number(row.approved), 0);
  const preview = await freeTestPreview(db, config.examKey);
  const timedSections = config.blueprints.filter((b) => b.mode === 'practice' && b.timing !== 'untimed').length;
  const fullMock = config.capabilities.fullSimulation.available && config.blueprints.some((b) => b.mode === 'simulation');
  const hasDiagnostic = Boolean(getBlueprint(config, 'diagnostic'));

  const sectionLine = (section: (typeof config.sections)[number]) =>
    [
      section.name,
      section.officialQuestionCount ? t('start.intro.questions', { count: section.officialQuestionCount }) : null,
      section.officialTimeMinutes ? t('start.intro.minutes', { count: section.officialTimeMinutes }) : null,
    ]
      .filter(Boolean)
      .join(' · ');

  const steps: OnboardingStep[] = [
    {
      eyebrow: config.publisher,
      title: t('start.intro.title', { exam: config.name }),
      lead: t('start.intro.lead', { count: config.sections.length }),
      points: config.sections.map(sectionLine),
    },
    {
      eyebrow: t('start.how.eyebrow'),
      title: t('start.how.title'),
      lead: reviewed > 0 ? t('start.how.leadCount', { count: reviewed, exam: config.shortName }) : t('start.how.lead'),
      points: [
        t('start.how.topic'),
        ...(timedSections > 0 ? [t('start.how.timed', { count: timedSections })] : []),
        ...(fullMock ? [t('start.how.mock')] : []),
        ...(hasDiagnostic ? [t('start.how.diagnostic')] : []),
      ],
    },
    {
      eyebrow: t('start.results.eyebrow'),
      title: t('start.results.title'),
      lead: t('start.results.lead'),
      points: [
        t('start.results.accuracy'),
        t('start.results.notebook'),
        t('start.results.plan'),
        ...(tutorSettings().enabled ? [t('start.results.tutor')] : []),
      ],
    },
  ];

  const freeNeedsAccount = !entitlements.can('diagnostic', config.examKey);
  const first = user && !freeNeedsAccount ? await freeTestFor(db, user.id, config.examKey) : null;
  const choice = {
    paid: [
      t('start.paid.single', {
        plan: PLAN_COPY.plans.single_exam.name,
        exam: config.shortName,
        price: price(PLANS.single_exam.amount),
      }),
      t('start.paid.all', { plan: PLAN_COPY.plans.all_access.name, price: price(PLANS.all_access.amount) }),
      t('start.paid.vat'),
    ],
    free: first
      ? [first.status === 'in_progress' ? t('start.free.open') : t('start.free.taken')]
      : [
          preview ? t('start.free.questions', { count: preview.questions }) : t('start.free.fixed'),
          t('start.free.every'),
          ...(freeNeedsAccount ? [t('start.free.needsAccount')] : []),
        ],
    freeLabel: freeNeedsAccount
      ? t('start.freeLabel.signUp')
      : first
        ? first.status === 'in_progress'
          ? t('start.freeLabel.continue')
          : t('start.freeLabel.results')
        : t('start.freeLabel.take'),
  };

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[
          { href: '/', label: t('crumbs.home') },
          { href: '/exams', label: t('crumbs.exams') },
          ...(hub ? [{ href: `/exams/${hub.slug}`, label: hub.name }] : []),
          { label: t('crumbs.getStarted') },
        ]}
      />
      <Onboarding
        steps={steps}
        choice={choice}
        plansHref={pricingPath(config.examKey)}
        freeTestHref={freeTestPath(config.examKey)}
      />
    </Container>
  );
}
