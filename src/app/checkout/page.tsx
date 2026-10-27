import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';
import { billingSettings, checkoutPath, pricingPath } from '@/lib/billing/config';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { PLANS, PLAN_COPY, PLAN_KEYS, isPlanKey } from '@/lib/billing/plans';
import { Alert, Breadcrumbs, ButtonLink, Container, PageHeader } from '@/components/ui';
import { CheckoutForm, type CheckoutPlanOption } from '@/components/billing/checkout-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

/** Every string on this page (the form has its own, in checkout-form.tsx). */
const COPY = {
  crumbs: { home: 'Home', pricing: 'Pricing', here: 'Checkout' },
  eyebrow: 'Checkout',
  title: 'Choose your plan and pay',
  lead: 'Monthly, VAT included, cancel any time from your account.',
  unavailable: {
    title: 'Payments are not available right now',
    body: 'Nothing can be bought on this site at the moment, so nothing will be charged. Everything that is open stays open.',
    back: 'Back to pricing',
  },
  allAccess: {
    title: 'You already have All access',
    body: 'Every exam and the AI tutor are already open to you, so there is nothing more to buy.',
    manage: 'Manage your plans',
  },
} as const;

type Query = { plan?: string; exam?: string; source?: string };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const plan = isPlanKey(query.plan) ? query.plan : 'all_access';
  const exam = typeof query.exam === 'string' && getExamConfig(query.exam) ? query.exam : null;
  const source = typeof query.source === 'string' && getExamConfig(query.source) ? query.source : exam;
  const here = `${checkoutPath(plan, exam)}${source && source !== exam ? `&source=${encodeURIComponent(source)}` : ''}`;

  // A plan needs an account to live in. Guests sign up first and keep their
  // guest history (the existing sign-up flow claims it), then come back here.
  const user = await getCurrentUser();
  if (!user || user.isGuest) redirect(`/sign-up?next=${encodeURIComponent(here)}`);

  const settings = billingSettings();
  const trail = [
    { href: '/', label: COPY.crumbs.home },
    { href: pricingPath(source), label: COPY.crumbs.pricing },
    { label: COPY.crumbs.here },
  ];

  if (!settings.checkoutAvailable || !settings.publishableKey) {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader eyebrow={COPY.eyebrow} title={COPY.unavailable.title} />
        <Alert tone="info">
          <p>{COPY.unavailable.body}</p>
        </Alert>
        <p className="mt-6">
          <Link href={pricingPath(source)}>{COPY.unavailable.back}</Link>
        </p>
      </Container>
    );
  }

  const owned = await loadEntitlements(getDb(), user.id, { settings: { ...settings, enforced: true } });
  if (owned.hasAllAccess) {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader eyebrow={COPY.eyebrow} title={COPY.allAccess.title} lead={COPY.allAccess.body} />
        <ButtonLink href="/account#billing">{COPY.allAccess.manage}</ButtonLink>
      </Container>
    );
  }

  const plans: CheckoutPlanOption[] = PLAN_KEYS.map((key) => ({
    key,
    name: PLAN_COPY.plans[key].name,
    tagline: PLAN_COPY.plans[key].tagline,
    perPeriod: PLAN_COPY.plans[key].perPeriod,
    amount: PLANS[key].amount,
    needsExam: PLANS[key].scope === 'one-exam',
  }));

  return (
    <Container>
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow={COPY.eyebrow} title={COPY.title} lead={COPY.lead} />
      <CheckoutForm
        publishableKey={settings.publishableKey}
        testMode={!settings.livemode}
        plans={plans}
        initialPlan={plan}
        initialExam={exam}
        sourceExam={source}
        exams={EXAM_CONFIGS.map((config) => ({ key: config.examKey, name: config.name }))}
        ownedExamKeys={owned.singleExamKeys}
        email={user.email ?? ''}
        name={user.displayName}
        collectCountry={settings.automaticTax}
      />
    </Container>
  );
}
