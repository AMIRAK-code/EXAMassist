import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { getExamConfig } from '@/lib/exams/registry';
import { checkoutPath, pricingPath } from '@/lib/billing/config';
import { grantIsLive, toGrant } from '@/lib/billing/entitlements';
import { PLAN_COPY } from '@/lib/billing/plans';
import { BillingError, syncSubscriptionForUser } from '@/lib/billing/service';
import type { SubscriptionRow } from '@/lib/billing/store';
import { Alert, Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your plan',
  robots: { index: false, follow: false },
};

/** Every string on this page, for translation. */
const COPY = {
  crumbs: { home: 'Home', pricing: 'Pricing', here: 'Confirmation' },
  eyebrow: 'Checkout',
  success: {
    title: 'Your plan is active',
    lead: '{plan} is open to you now.',
    leadExam: '{plan} for {exam} is open to you now.',
    renews: 'It renews on {date} and every month after that, until you cancel.',
    receipt: 'Stripe, our payment provider, sends a receipt to {email}.',
    practise: 'Start practising {exam}',
    exams: 'Choose an exam',
    manage: 'Manage your plan',
  },
  processing: {
    title: 'Your payment is being processed',
    body: 'Your bank has not confirmed the payment yet. Your plan starts as soon as it does; refresh this page in a minute.',
    refresh: 'Refresh',
  },
  pending: {
    title: 'Waiting for your payment',
    body: 'We have not received confirmation of this payment yet. If you have just paid, refresh this page in a moment. If you left the payment unfinished, you can try again; nothing has been charged.',
    refresh: 'Refresh',
    retry: 'Back to checkout',
  },
  failed: {
    title: 'The payment did not go through',
    body: 'Your bank declined the payment or the verification was not completed. Nothing was charged. You can try again with the same or another card.',
    retry: 'Try again',
  },
  expired: {
    title: 'This checkout has expired',
    body: 'The payment was not completed in time, so nothing was charged. Start a new checkout whenever you are ready.',
    retry: 'Start again',
  },
  missing: {
    title: 'We could not find that checkout',
    body: 'It may belong to a different account. Your plans are listed on your account page.',
    account: 'Your account',
  },
  pricing: 'See plans',
} as const;

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

type Query = { subscription?: string; redirect_status?: string };

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export default async function CheckoutCompletePage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const subscriptionId = typeof query.subscription === 'string' && /^sub_[A-Za-z0-9]+$/.test(query.subscription) ? query.subscription : null;
  const here = `/checkout/complete${subscriptionId ? `?subscription=${subscriptionId}` : ''}`;
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(here)}`);

  let row: SubscriptionRow | null = null;
  if (subscriptionId) {
    try {
      // Webhooks may be a moment behind the browser: ask Stripe now.
      row = await syncSubscriptionForUser(getDb(), user.id, subscriptionId);
    } catch (error) {
      if (!(error instanceof BillingError)) throw error;
    }
  }

  const trail = [
    { href: '/', label: COPY.crumbs.home },
    { href: pricingPath(row?.exam_key), label: COPY.crumbs.pricing },
    { label: COPY.crumbs.here },
  ];

  if (!row) {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader eyebrow={COPY.eyebrow} title={COPY.missing.title} lead={COPY.missing.body} />
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/account#billing">{COPY.missing.account}</ButtonLink>
          <ButtonLink href="/pricing" variant="secondary">
            {COPY.pricing}
          </ButtonLink>
        </div>
      </Container>
    );
  }

  const exam = row.exam_key ? getExamConfig(row.exam_key) : undefined;
  const planName = PLAN_COPY.plans[row.plan].name;
  const retryHref = checkoutPath(row.plan, row.exam_key);
  const live = grantIsLive(toGrant(row));
  const state = live
    ? 'success'
    : row.status === 'incomplete_expired' || row.status === 'canceled'
      ? 'expired'
      : query.redirect_status === 'failed'
        ? 'failed'
        : query.redirect_status === 'processing'
          ? 'processing'
          : 'pending';

  if (state === 'success') {
    return (
      <Container size="narrow">
        <Breadcrumbs trail={trail} />
        <PageHeader
          eyebrow={COPY.eyebrow}
          title={COPY.success.title}
          lead={exam ? fill(COPY.success.leadExam, { plan: planName, exam: exam.name }) : fill(COPY.success.lead, { plan: planName })}
        />
        <Alert tone="positive" role="status" className="mb-6">
          {row.current_period_end ? <p>{fill(COPY.success.renews, { date: formatDay(row.current_period_end) })}</p> : null}
          {user.email ? <p className="mt-1">{fill(COPY.success.receipt, { email: user.email })}</p> : null}
        </Alert>
        <div className="flex flex-wrap gap-3">
          {exam ? (
            <ButtonLink href={`/practice/${exam.examKey}`}>{fill(COPY.success.practise, { exam: exam.shortName })}</ButtonLink>
          ) : (
            <ButtonLink href="/exams">{COPY.success.exams}</ButtonLink>
          )}
          <ButtonLink href="/account#billing" variant="secondary">
            {COPY.success.manage}
          </ButtonLink>
        </div>
      </Container>
    );
  }

  const copy = COPY[state];
  return (
    <Container size="narrow">
      <Breadcrumbs trail={trail} />
      <PageHeader eyebrow={COPY.eyebrow} title={copy.title} />
      <Card padding="lg">
        <p role={state === 'failed' ? 'alert' : 'status'}>{copy.body}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {state === 'processing' || state === 'pending' ? (
            <ButtonLink href={here}>{copy === COPY.processing ? COPY.processing.refresh : COPY.pending.refresh}</ButtonLink>
          ) : null}
          {state === 'failed' || state === 'expired' || state === 'pending' ? (
            <ButtonLink href={retryHref} variant={state === 'pending' ? 'secondary' : 'primary'}>
              {state === 'failed' ? COPY.failed.retry : state === 'expired' ? COPY.expired.retry : COPY.pending.retry}
            </ButtonLink>
          ) : null}
        </div>
      </Card>
      <p className="mt-6 text-sm">
        <Link href={pricingPath(row.exam_key)}>{COPY.pricing}</Link>
      </p>
    </Container>
  );
}
