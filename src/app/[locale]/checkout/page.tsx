import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { pageAlternates } from '@/i18n/alternates';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';
import { billingSettings, checkoutPath, pricingPath } from '@/lib/billing/config';
import { allExamSaleStatuses } from '@/lib/billing/availability';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { OFFERS, PLANS, PRICES, isOnSale, isPriceKey, type PriceKey } from '@/lib/billing/plans';
import { Alert, Breadcrumbs, ButtonLink, Container, PageHeader } from '@/components/ui';
import { CheckoutForm, type CheckoutOffer } from '@/components/billing/checkout-form';

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

/**
 * What `?plan=` asks for, and why the page shows something else when it does.
 * Links made before 2026-10-29 name the earlier plans; Premium is not on sale.
 */
function chooseOffer(plan: string | undefined, hasExam: boolean): { offer: PriceKey; notice: 'premium' | 'earlier' | null } {
  if (isPriceKey(plan) && isOnSale(plan)) return { offer: plan, notice: null };
  if (plan === 'premium' || (isPriceKey(plan) && PRICES[plan].plan === 'premium')) return { offer: 'plus_month', notice: 'premium' };
  if (plan === 'single_exam' || plan === 'single_exam_month') return { offer: 'exam_pass', notice: 'earlier' };
  if (plan === 'all_access' || plan === 'all_access_month') return { offer: 'plus_month', notice: 'earlier' };
  if (plan === 'plus') return { offer: 'plus_month', notice: null };
  return { offer: hasExam ? 'exam_pass' : 'plus_month', notice: null };
}

export default async function CheckoutPage({ params, searchParams }: { params: Params; searchParams: Promise<Query> }) {
  const { locale } = await params;
  const query = await searchParams;
  // The form has its own strings, in the same `billing` catalogue (form.*).
  const t = await getTranslations({ locale, namespace: 'billing' });
  const exam = typeof query.exam === 'string' && getExamConfig(query.exam) ? query.exam : null;
  const { offer, notice } = chooseOffer(query.plan, Boolean(exam));
  const source = typeof query.source === 'string' && getExamConfig(query.source) ? query.source : exam;
  const here = `${checkoutPath(offer, PLANS[PRICES[offer].plan].scope === 'one-exam' ? exam : null)}${source && source !== exam ? `&source=${encodeURIComponent(source)}` : ''}`;

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

  const db = getDb();
  const owned = await loadEntitlements(db, user.id, { settings: { ...settings, enforced: true } });
  if (owned.hasAllAccess) {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader eyebrow={t('checkout.eyebrow')} title={t('checkout.allAccess.title')} lead={t('checkout.allAccess.body')} />
        <ButtonLink href="/account#billing">{t('checkout.allAccess.manage')}</ButtonLink>
      </Container>
    );
  }

  // The same rule the server applies when the pass is bought (startCheckout).
  const sale = new Map((await allExamSaleStatuses(db)).map((status) => [status.examKey, status.sellable]));
  const offers: CheckoutOffer[] = OFFERS.map((key) => ({
    key,
    name: t(`plans.${PRICES[key].plan}.name`),
    tagline: t(`plans.${PRICES[key].plan}.tagline`),
    amount: PRICES[key].amount,
    interval: PRICES[key].interval,
    needsExam: PLANS[PRICES[key].plan].scope === 'one-exam',
  }));

  return (
    <Container>
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow={t('checkout.eyebrow')} title={t('checkout.title')} lead={t('checkout.lead')} />
      {notice ? (
        <Alert tone="info" className="mb-6">
          <p>{t(`checkout.notices.${notice}`)}</p>
        </Alert>
      ) : null}
      <CheckoutForm
        publishableKey={settings.publishableKey}
        testMode={!settings.livemode}
        offers={offers}
        initialOffer={offer}
        initialExam={exam}
        sourceExam={source}
        exams={EXAM_CONFIGS.map((config) => ({ key: config.examKey, name: config.name, available: sale.get(config.examKey) ?? false }))}
        ownedExamKeys={owned.singleExamKeys}
        email={user.email ?? ''}
        name={user.displayName}
        collectCountry={settings.automaticTax}
      />
    </Container>
  );
}
