import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { pageAlternates } from '@/i18n/alternates';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { getExamConfig } from '@/lib/exams/registry';
import { checkoutPath, pricingPath } from '@/lib/billing/config';
import { grantIsLive, passToGrant, toGrant } from '@/lib/billing/entitlements';
import { priceForLookupKey } from '@/lib/billing/plans';
import { BillingError, syncPassForUser, syncSubscriptionForUser } from '@/lib/billing/service';
import type { PassRow, SubscriptionRow } from '@/lib/billing/store';
import { Alert, Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'billing.complete.meta' });
  return {
    title: t('title'),
    robots: { index: false, follow: false },
    alternates: (await pageAlternates(params, '/checkout/complete')),
  };
}

type Query = { subscription?: string; pass?: string; redirect_status?: string };
type State = 'processing' | 'pending' | 'failed' | 'expired';

/** What was bought, as the page needs it: a Plus (or earlier) subscription, or a Single Exam Pass. */
interface Purchase {
  kind: 'subscription' | 'pass';
  plan: string;
  examKey: string | null;
  live: boolean;
  ended: boolean;
  /** Renewal date (subscription) or end of access (pass). */
  until: string | null;
  interval: 'once' | 'month' | 'year' | null;
  retryHref: string;
}

function fromSubscription(row: SubscriptionRow): Purchase {
  const price = priceForLookupKey(row.price_lookup_key);
  return {
    kind: 'subscription',
    plan: row.plan,
    examKey: row.exam_key,
    live: grantIsLive(toGrant(row)),
    ended: row.status === 'incomplete_expired' || row.status === 'canceled',
    until: row.current_period_end,
    interval: price?.interval ?? null,
    retryHref: checkoutPath(price?.key ?? 'plus_month'),
  };
}

function fromPass(row: PassRow): Purchase {
  return {
    kind: 'pass',
    plan: row.plan,
    examKey: row.exam_key,
    // Paid means Stripe recorded the payment; the date shown says how long it lasts.
    live: row.status === 'paid' || grantIsLive(passToGrant(row)),
    ended: row.status === 'void' || row.status === 'refunded',
    until: row.access_ends_at,
    interval: 'once',
    retryHref: checkoutPath('exam_pass', row.exam_key),
  };
}

export default async function CheckoutCompletePage({ params, searchParams }: { params: Params; searchParams: Promise<Query> }) {
  const { locale } = await params;
  const query = await searchParams;
  const t = await getTranslations({ locale, namespace: 'billing' });
  const format = await getFormatter({ locale });
  const formatDay = (iso: string) =>
    format.dateTime(new Date(iso), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const subscriptionId = typeof query.subscription === 'string' && /^sub_[A-Za-z0-9]+$/.test(query.subscription) ? query.subscription : null;
  const invoiceId = !subscriptionId && typeof query.pass === 'string' && /^in_[A-Za-z0-9]+$/.test(query.pass) ? query.pass : null;
  const here = `/checkout/complete${subscriptionId ? `?subscription=${subscriptionId}` : invoiceId ? `?pass=${invoiceId}` : ''}`;
  const user = await getCurrentUser();
  if (!user) return redirect({ href: `/sign-in?next=${encodeURIComponent(here)}`, locale });

  let purchase: Purchase | null = null;
  try {
    // Webhooks may be a moment behind the browser: ask Stripe now, from the
    // server. Only Stripe's answer opens access; the browser's word never does.
    if (subscriptionId) purchase = fromSubscription(await syncSubscriptionForUser(getDb(), user.id, subscriptionId));
    else if (invoiceId) purchase = fromPass(await syncPassForUser(getDb(), user.id, invoiceId));
  } catch (error) {
    if (!(error instanceof BillingError)) throw error;
  }

  const trail = [
    { href: '/', label: t('crumbs.home') },
    { href: pricingPath(purchase?.examKey), label: t('crumbs.pricing') },
    { label: t('crumbs.confirmation') },
  ];

  if (!purchase) {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader eyebrow={t('complete.eyebrow')} title={t('complete.missing.title')} lead={t('complete.missing.body')} />
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/account#billing">{t('complete.missing.account')}</ButtonLink>
          <ButtonLink href="/pricing" variant="secondary">
            {t('complete.pricing')}
          </ButtonLink>
        </div>
      </Container>
    );
  }

  const exam = purchase.examKey ? getExamConfig(purchase.examKey) : undefined;
  const planName = t.has(`plans.${purchase.plan}.name`) ? t(`plans.${purchase.plan}.name`) : purchase.plan;
  const state: State | 'success' = purchase.live
    ? 'success'
    : purchase.ended
      ? 'expired'
      : query.redirect_status === 'failed'
        ? 'failed'
        : query.redirect_status === 'processing'
          ? 'processing'
          : 'pending';

  if (state === 'success') {
    const until = purchase.until ? formatDay(purchase.until) : null;
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader
          eyebrow={t('complete.eyebrow')}
          title={t('complete.success.title')}
          lead={
            exam
              ? t('complete.success.leadExam', { plan: planName, exam: exam.name })
              : t('complete.success.lead', { plan: planName })
          }
        />
        <Alert tone="positive" role="status" className="mb-6">
          {until ? (
            <p>
              {purchase.kind === 'pass'
                ? t('complete.success.passUntil', { exam: exam?.name ?? '', date: until })
                : purchase.interval === 'year'
                  ? t('complete.success.renewsYearly', { date: until })
                  : t('complete.success.renews', { date: until })}
            </p>
          ) : null}
          {user.email ? <p className="mt-1">{t('complete.success.receipt', { email: user.email })}</p> : null}
        </Alert>
        <div className="flex flex-wrap gap-3">
          {exam ? (
            <ButtonLink href={`/practice/${exam.examKey}`}>{t('complete.success.practise', { exam: exam.shortName })}</ButtonLink>
          ) : (
            <ButtonLink href="/exams">{t('complete.success.exams')}</ButtonLink>
          )}
          <ButtonLink href="/account#billing" variant="secondary">
            {t('complete.success.manage')}
          </ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <Container size="narrow">
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow={t('complete.eyebrow')} title={t(`complete.${state}.title`)} />
      <Card padding="lg">
        <p role={state === 'failed' ? 'alert' : 'status'}>{t(`complete.${state}.body`)}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {state === 'processing' || state === 'pending' ? (
            <ButtonLink href={here}>{t(`complete.${state}.refresh`)}</ButtonLink>
          ) : null}
          {state === 'failed' || state === 'expired' || state === 'pending' ? (
            <ButtonLink href={purchase.retryHref} variant={state === 'pending' ? 'secondary' : 'primary'}>
              {t(`complete.${state}.retry`)}
            </ButtonLink>
          ) : null}
        </div>
      </Card>
      <p className="mt-6 text-sm">
        <Link href={pricingPath(purchase.examKey)}>{t('complete.pricing')}</Link>
      </p>
    </Container>
  );
}
