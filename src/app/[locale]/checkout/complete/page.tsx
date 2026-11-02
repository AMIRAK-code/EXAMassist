import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { pageAlternates } from '@/i18n/alternates';
import { getCurrentUser } from '@/lib/auth/session';
import { safeNext } from '@/lib/auth/next-path';
import { getDb } from '@/lib/db';
import { getExamConfig } from '@/lib/exams/registry';
import { checkoutPath, pricingPath } from '@/lib/billing/config';
import { grantIsLive, passToGrant, toGrant } from '@/lib/billing/entitlements';
import { priceForLookupKey } from '@/lib/billing/plans';
import { stripeClient } from '@/lib/billing/stripe';
import { getCustomerId, getPassRow, getSubscriptionRow } from '@/lib/billing/store';
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

type Query = { subscription?: string; pass?: string; redirect_status?: string; session_id?: string };
type State = 'processing' | 'pending' | 'failed' | 'ended';

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
  cancelAtEnd?: boolean;
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
    cancelAtEnd: Boolean(row.cancel_at_period_end),
  };
}

function fromPass(row: PassRow): Purchase {
  return {
    kind: 'pass',
    plan: row.plan,
    examKey: row.exam_key,
    // Paid means Stripe recorded the payment; the date shown says how long it lasts.
    live: grantIsLive(passToGrant(row)),
    ended: row.status === 'void' || row.status === 'refunded' || (row.status === 'paid' && !grantIsLive(passToGrant(row))),
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
  const sessionId = typeof query.session_id === 'string' && /^cs_[A-Za-z0-9_]+$/.test(query.session_id) ? query.session_id : null;
  const here = `/checkout/complete${sessionId ? `?session_id=${sessionId}` : subscriptionId ? `?subscription=${subscriptionId}` : invoiceId ? `?pass=${invoiceId}` : ''}`;
  const user = await getCurrentUser();
  if (!user) return redirect({ href: `/sign-in?next=${encodeURIComponent(here)}`, locale });

  let purchase: Purchase | null = null;
  let sessionPending = false;
  let sessionExpired = false;
  let sessionFailed = false;
  let sourceExam: string | null = null;
  let returnTo: string | null = null;
  // The return page only reads webhook-owned records. A redirect never grants access.
  const db = getDb();
  if (sessionId) {
    try {
      const session = await stripeClient().checkout.sessions.retrieve(sessionId);
      const customer = typeof session.customer === 'string' ? session.customer : session.customer?.id;
      if (session.metadata?.examer_user_id === user.id && customer === await getCustomerId(db, user.id)) {
        sourceExam = session.metadata?.source_exam ?? null;
        returnTo = safeNext(session.metadata?.return_to);
        const sub = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
        const inv = typeof session.invoice === 'string' ? session.invoice : session.invoice?.id;
        const row = sub ? await getSubscriptionRow(db, sub) : inv ? await getPassRow(db, inv) : null;
        if (row?.user_id === user.id) purchase = 'stripe_subscription_id' in row ? fromSubscription(row) : fromPass(row);
        sessionExpired = session.status === 'expired';
        const checkout = await db.prepare('SELECT status FROM billing_checkouts WHERE user_id = ? AND session_id = ?').get(user.id, session.id) as { status: string } | undefined;
        sessionFailed = checkout?.status === 'failed';
        sessionPending = !purchase && !sessionExpired;
      }
    } catch { sessionPending = true; }
  } else {
    const row = subscriptionId ? await getSubscriptionRow(db, subscriptionId) : invoiceId ? await getPassRow(db, invoiceId) : null;
    if (row?.user_id === user.id) purchase = 'stripe_subscription_id' in row ? fromSubscription(row) : fromPass(row);
  }
  if (sessionPending || sessionExpired || sessionFailed) {
    return <Container size="narrow"><Card padding="lg" className="border-t-4 border-t-accent">
      <p className="eyebrow">{t('complete.eyebrow')}</p>
      <h1 className="mt-3 font-heading text-3xl font-semibold">{t(sessionFailed ? 'complete.failed.title' : sessionExpired ? 'complete.expired.title' : 'complete.processing.title')}</h1>
      <p role="status" className="mt-4 text-ink-muted">{t(sessionFailed ? 'complete.failed.body' : sessionExpired ? 'complete.expired.body' : 'experience.waiting')}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {!sessionExpired && !sessionFailed ? <ButtonLink href={here}>{t('complete.processing.refresh')}</ButtonLink> : <ButtonLink href={pricingPath(sourceExam)}>{t('complete.pricing')}</ButtonLink>}
        <ButtonLink href="/account#billing" variant="secondary">{t('complete.success.manage')}</ButtonLink>
      </div>
    </Card></Container>;
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

  const exam = getExamConfig(purchase.examKey ?? sourceExam ?? '');
  const planName = t.has(`plans.${purchase.plan}.name`) ? t(`plans.${purchase.plan}.name`) : purchase.plan;
  const state: State | 'success' = purchase.live
    ? 'success'
    : purchase.ended
      ? 'ended'
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
                : purchase.cancelAtEnd ? t('manager.ends', { date: until }) : purchase.interval === 'year'
                  ? t('complete.success.renewsYearly', { date: until })
                  : t('complete.success.renews', { date: until })}
            </p>
          ) : null}
          {user.email ? <p className="mt-1">{t('complete.success.receipt', { email: user.email })}</p> : null}
        </Alert>
        <div className="flex flex-wrap gap-3">
          {returnTo ? <ButtonLink href={returnTo}>{t('experience.resume')}</ButtonLink> : exam ? (
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
          {state === 'failed' || state === 'ended' ? (
            <ButtonLink href={purchase.retryHref}>
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
