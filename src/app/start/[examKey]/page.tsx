import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { getCoverage } from '@/lib/content/repository';
import { getBlueprint, getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { freeTestPreview } from '@/lib/attempts/service';
import { tutorSettings } from '@/lib/tutor/config';
import { PLANS, billingSettings, formatEuros, freeTestPath } from '@/lib/billing/config';
import { getAccess } from '@/lib/billing/service';
import { Breadcrumbs, Container } from '@/components/ui';
import { Onboarding, type OnboardingStep } from './onboarding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Get started',
  robots: { index: false, follow: false },
};

/**
 * What a learner without Premium sees after choosing an exam: a short
 * introduction to it, then the plans, with the free test one click away.
 * Everything said here comes from the exam's configuration and the bank.
 */
export default async function StartPage({ params }: { params: Promise<{ examKey: string }> }) {
  const { examKey } = await params;
  const config = getExamConfig(examKey);
  if (!config) notFound();

  const db = getDb();
  const user = await getCurrentUser();
  const access = user ? await getAccess(db, user.id) : null;
  if (!billingSettings().enabled || access?.fullAccess) redirect(`/practice/${config.examKey}`);

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

  const freeNeedsAccount = !access?.registered;
  const first = access?.firstSession ?? null;
  const choice = {
    premium: [
      'Every exam and every practice format.',
      'Fresh questions in every session.',
      `From ${formatEuros(PLANS.yearly.perMonth)} a month, VAT included. Cancel any time.`,
    ],
    free: first
      ? [first.status === 'in_progress' ? 'Your free test is still open: carry on where you left off.' : 'You have taken your free test; its results stay in your history.']
      : [
          preview ? `One ${preview.questions}-question test, the same for everyone.` : 'One fixed test, the same for everyone.',
          'Once per account, with full results and explanations.',
          ...(freeNeedsAccount ? ['Needs a free account.'] : []),
        ],
    freeLabel: freeNeedsAccount
      ? 'Create a free account'
      : first
        ? first.status === 'in_progress'
          ? 'Continue your free test'
          : 'Your free test results'
        : 'Take the free test',
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
        plansHref={`/premium?exam=${encodeURIComponent(config.examKey)}`}
        freeTestHref={freeTestPath(config.examKey)}
      />
    </Container>
  );
}
