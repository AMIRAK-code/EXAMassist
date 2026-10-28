import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { pageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';
import { billingSettings, checkoutPath, pricingPath } from '@/lib/billing/config';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { PLANS, PLAN_KEYS, isPlanKey } from '@/lib/billing/plans';
import { Alert, Breadcrumbs, ButtonLink, Container, PageHeader } from '@/components/ui';
import { CheckoutForm, type CheckoutPlanOption } from '@/components/billing/checkout-form';

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'billing.checkout.meta' });
  return {
    title: t('title'),
    robots: { index: false, follow: false },
    alternates: (await pageAlternates(params, '/checkout')),
  };
}

type Query = { plan?: string; exam?: string; source?: string };

export default async function CheckoutPage({ params, searchParams }: { params: Params; searchParams: Promise<Query> }) {
  const { locale } = await params;
  const query = await searchParams;
  // The plan form has its own strings, in the same `billing` catalogue (form.*).
  const t = await getTranslations({ locale, namespace: 'billing' });
  const plan = isPlanKey(query.plan) ? query.plan : 'all_access';
  const exam = typeof query.exam === 'string' && getExamConfig(query.exam) ? query.exam : null;
  const source = typeof query.source === 'string' && getExamConfig(query.source) ? query.source : exam;
  const here = `${checkoutPath(plan, exam)}${source && source !== exam ? `&source=${encodeURIComponent(source)}` : ''}`;

  // A plan needs an account to live in. Guests sign up first and keep their
  // guest history (the existing sign-up flow claims it), then come back here,
  // in the same language.
  const user = await getCurrentUser();
  if (!user || user.isGuest) return redirect({ href: `/sign-up?next=${encodeURIComponent(here)}`, locale });

  const settings = billingSettings();
  const trail = [
    { href: '/', label: t('crumbs.home') },
    { href: pricingPath(source), label: t('crumbs.pricing') },
    { label: t('crumbs.checkout') },
  ];

  if (!settings.checkoutAvailable || !settings.publishableKey) {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader eyebrow={t('checkout.eyebrow')} title={t('checkout.unavailable.title')} />
        <Alert tone="info">
          <p>{t('checkout.unavailable.body')}</p>
        </Alert>
        <p className="mt-6">
          <Link href={pricingPath(source)}>{t('checkout.unavailable.back')}</Link>
        </p>
      </Container>
    );
  }

  const owned = await loadEntitlements(getDb(), user.id, { settings: { ...settings, enforced: true } });
  if (owned.hasAllAccess) {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader eyebrow={t('checkout.eyebrow')} title={t('checkout.allAccess.title')} lead={t('checkout.allAccess.body')} />
        <ButtonLink href="/account#billing">{t('checkout.allAccess.manage')}</ButtonLink>
      </Container>
    );
  }

  const plans: CheckoutPlanOption[] = PLAN_KEYS.map((key) => ({
    key,
    name: t(`plans.${key}.name`),
    tagline: t(`plans.${key}.tagline`),
    perPeriod: t(`plans.${key}.perPeriod`),
    amount: PLANS[key].amount,
    needsExam: PLANS[key].scope === 'one-exam',
  }));

  return (
    <Container>
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow={t('checkout.eyebrow')} title={t('checkout.title')} lead={t('checkout.lead')} />
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
