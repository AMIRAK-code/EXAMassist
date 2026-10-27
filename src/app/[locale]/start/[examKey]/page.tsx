import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { getCoverage } from '@/lib/content/repository';
import { getBlueprint, getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { freeTestFor, freeTestPreview } from '@/lib/attempts/service';
import { tutorSettings } from '@/lib/tutor/config';
import { freeTestPath, pricingPath } from '@/lib/billing/config';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { PLANS, PLAN_COPY, formatPrice } from '@/lib/billing/plans';
import { Breadcrumbs, Container } from '@/components/ui';
import { Onboarding, type OnboardingStep } from './onboarding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Get started',
  robots: { index: false, follow: false },
};

/**
 * What a learner without a plan for this exam sees after choosing it: a short
 * introduction, then the plans, with the free diagnostic one click away.
 * Everything said here comes from the exam's configuration and the bank.
 */
export default async function StartPage({ params }: { params: Promise<{ examKey: string }> }) {
  const { examKey } = await params;
  const config = getExamConfig(examKey);
  if (!config) notFound();

  const db = getDb();
  const user = await getCurrentUser();
  const entitlements = await loadEntitlements(db, user?.id ?? null);
  if (entitlements.can('practice', config.examKey)) redirect(`/practice/${config.examKey}`);

  const hub = getHubForConfig(config.examKey);
  const reviewed = (await getCoverage(db, config.examKey)).reduce((sum, row) => sum + Number(row.published), 0);
  const preview = await freeTestPreview(db, config.examKey);
  const timedSections = config.blueprints.filter((b) => b.mode === 'practice' && b.timing !== 'untimed').length;
  const fullMock = config.capabilities.fullSimulation.available && config.blueprints.some((b) => b.mode === 'simulation');
  const hasDiagnostic = Boolean(getBlueprint(config, 'diagnostic'));

  const sectionLine = (section: (typeof config.sections)[number]) =>
    [
      section.name,
      section.officialQuestionCount ? `${section.officialQuestionCount} questions` : null,
      section.officialTimeMinutes ? `${section.officialTimeMinutes} minutes` : null,
    ]
      .filter(Boolean)
      .join(' · ');

  const steps: OnboardingStep[] = [
    {
      eyebrow: config.publisher,
      title: `Practise for the ${config.name}`,
      lead: `The real exam has ${config.sections.length === 1 ? 'one section' : `${config.sections.length} sections`}, as the test maker publishes it:`,
      points: config.sections.map(sectionLine),
    },
    {
      eyebrow: 'How practice works',
      title: 'Practise the way the exam works',
      lead: `${reviewed > 0 ? `${reviewed} reviewed ${config.shortName} questions` : 'Reviewed questions'}, each with a worked explanation.`,
      points: [
        'Topic practice: pick topics and difficulty, untimed, with the worked explanation as soon as you check an answer.',
        ...(timedSections > 0 ? [`${timedSections === 1 ? 'A timed section' : `${timedSections} timed sections`} at the published pace.`] : []),
        ...(fullMock ? ['A full-length mock exam under the real rules.'] : []),
        ...(hasDiagnostic ? ['A short diagnostic that shows where to start.'] : []),
      ],
    },
    {
      eyebrow: 'Your results',
      title: 'See exactly what needs work',
      lead: 'Every session ends with results you can act on.',
      points: [
        'Accuracy by topic and skill, so you know what to practise next.',
        'A mistake notebook and a review queue that bring back what you missed.',
        'A study plan built around your exam date.',
        ...(tutorSettings().enabled ? ['An AI tutor for hints and deeper explanations, within a daily allowance.'] : []),
      ],
    },
  ];

  const freeNeedsAccount = !entitlements.can('diagnostic', config.examKey);
  const first = user && !freeNeedsAccount ? await freeTestFor(db, user.id, config.examKey) : null;
  const choice = {
    paid: [
      `${PLAN_COPY.plans.single_exam.name}: every ${config.shortName} practice format, ${formatPrice(PLANS.single_exam.amount)} a month.`,
      `${PLAN_COPY.plans.all_access.name}: every exam plus the AI tutor, ${formatPrice(PLANS.all_access.amount)} a month.`,
      'VAT included. Cancel any time from your account.',
    ],
    free: first
      ? [first.status === 'in_progress' ? 'Your free diagnostic is still open: carry on where you left off.' : 'You have taken this diagnostic; its results stay in your history.']
      : [
          preview ? `One ${preview.questions}-question diagnostic, the same for everyone.` : 'One fixed diagnostic, the same for everyone.',
          'Free for every exam, with full results and explanations.',
          ...(freeNeedsAccount ? ['Needs a free account.'] : []),
        ],
    freeLabel: freeNeedsAccount
      ? 'Create a free account'
      : first
        ? first.status === 'in_progress'
          ? 'Continue your diagnostic'
          : 'Your diagnostic results'
        : 'Take the free diagnostic',
  };

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[
          { href: '/', label: 'Home' },
          { href: '/exams', label: 'Exams' },
          ...(hub ? [{ href: `/exams/${hub.slug}`, label: hub.name }] : []),
          { label: 'Get started' },
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
