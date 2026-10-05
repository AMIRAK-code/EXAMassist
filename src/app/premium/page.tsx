import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { absoluteUrl, SITE } from '@/lib/site';
import { EXAM_CONFIGS } from '@/lib/exams/registry';
import { tutorSettings } from '@/lib/tutor/config';
import { FREE_SESSIONS, PLANS, PLAN_KEYS, billingSettings, formatEuros } from '@/lib/billing/config';
import { getAccess, premiumActive } from '@/lib/billing/service';
import { Alert, Badge, Breadcrumbs, ButtonLink, Card, Container, PageHeader, cx } from '@/components/ui';
import { ChoosePlanButton, ManageBillingButton } from '@/components/billing/billing-buttons';

export const dynamic = 'force-dynamic';

const TITLE = 'Premium';
const DESCRIPTION =
  'Examer Premium opens every exam and every practice format: topic practice, timed sections, full mock exams, retries and study plans. From €7.99 a month, VAT included.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/premium') },
  openGraph: { url: absoluteUrl('/premium'), title: `${TITLE} | ${SITE.shortName}`, description: DESCRIPTION },
};

const MONTHLY = PLANS.monthly.perMonth;
const saving = (perMonth: number) => Math.floor((1 - perMonth / MONTHLY) * 100);

export default async function PremiumPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; reason?: string }>;
}) {
  const query = await searchParams;
  const settings = billingSettings();
  const user = await getCurrentUser();
  const access = user ? await getAccess(getDb(), user.id) : null;
  const premium = access ? premiumActive(access.subscription) : false;
  const tutor = tutorSettings().enabled;

  const includes = [
    `Every exam on ${SITE.name}, all ${EXAM_CONFIGS.length} of them, with every practice format each one offers.`,
    'As many sessions as you like: topic practice, timed sections and full-length mock exams wherever the exam offers one.',
    'Retries of the questions you missed, your review queue, and the sessions your study plan schedules.',
    'Full results and the worked explanation for every question, in every session.',
    ...(tutor ? ['The AI tutor’s hints and deeper explanations, within its daily allowance.'] : []),
  ];

  return (
    <Container>
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'Premium' }]} />
      <PageHeader
        eyebrow={`${SITE.name} Premium`}
        title="Practise every exam, as often as you need"
        lead={`Everyone gets ${FREE_SESSIONS === 1 ? 'one free session' : `${FREE_SESSIONS} free sessions`} on the exam of their choice, with full results. Premium opens everything else.`}
      />

      <div className="mb-8 space-y-4">
        {!settings.enabled ? (
          <Alert tone="info" title="Premium is not on sale yet">
            <p>Until it is, every exam and every practice format is open to everyone.</p>
          </Alert>
        ) : null}
        {query.checkout === 'cancelled' ? (
          <Alert tone="info" title="Checkout cancelled" role="status">
            <p>Nothing was charged. You can choose a plan whenever you are ready.</p>
          </Alert>
        ) : null}
        {query.reason === 'free-session-used' && !premium ? (
          <Alert tone="caution" title="You have used your free session">
            <p>
              Your free session and its results stay in your history. Choose a plan below to start
              another one, on any exam.
            </p>
          </Alert>
        ) : null}
        {premium && access?.subscription ? (
          <Alert tone="positive" title="You have Premium">
            <p>
              Every exam and every practice format is open to you.{' '}
              {access.subscription.cancel_at_period_end && access.subscription.current_period_end
                ? `Your plan ends on ${formatDay(access.subscription.current_period_end)} and will not renew.`
                : access.subscription.current_period_end
                  ? `It renews on ${formatDay(access.subscription.current_period_end)}.`
                  : null}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <ButtonLink href="/exams" size="sm">
                Choose an exam
              </ButtonLink>
              <ManageBillingButton />
            </div>
          </Alert>
        ) : null}
      </div>

      <ul className="grid gap-5 md:grid-cols-3" aria-label="Premium plans">
        {PLAN_KEYS.map((key) => {
          const plan = PLANS[key];
          const best = key === 'yearly';
          const off = saving(plan.perMonth);
          return (
            <Card as="li" key={key} padding="lg" className={cx('flex flex-col', best && 'border-2 border-accent')}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-heading text-xl font-semibold">{plan.label}</h2>
                {best ? <Badge tone="accent">Best value</Badge> : off > 0 ? <Badge tone="neutral">Save {off}%</Badge> : null}
              </div>
              <p className="mt-4">
                <span className="font-heading text-4xl font-semibold tracking-tight">{formatEuros(plan.perMonth)}</span>
                <span className="text-ink-muted"> / month</span>
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {plan.intervalCount === 1 && plan.interval === 'month'
                  ? 'Billed every month. VAT included.'
                  : `${formatEuros(plan.amount)} billed ${plan.billedEvery}. VAT included.`}
                {best ? ` Save ${off}% against monthly.` : ''}
              </p>
              <div className="mt-6 flex-1" />
              {settings.enabled && !premium ? (
                <ChoosePlanButton plan={key} label={`Choose ${plan.label.toLowerCase()}`} variant={best ? 'primary' : 'secondary'} />
              ) : null}
            </Card>
          );
        })}
      </ul>

      {settings.enabled && !premium && (!user || user.isGuest) ? (
        <p className="mt-4 text-sm text-ink-muted">
          Choosing a plan asks you to create an account first, so Premium has somewhere to live. Your
          guest practice comes with you.
        </p>
      ) : null}

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="includes-heading">
          <h2 id="includes-heading" className="font-heading text-2xl font-semibold">
            What Premium includes
          </h2>
          <ul className="mt-4 list-disc space-y-2 ps-5">
            {includes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="free-heading">
          <h2 id="free-heading" className="font-heading text-2xl font-semibold">
            Free, without a plan
          </h2>
          <ul className="mt-4 list-disc space-y-2 ps-5">
            <li>
              {FREE_SESSIONS === 1 ? 'One practice session' : `${FREE_SESSIONS} practice sessions`} on the exam
              of your choice, with its full results and explanations.
            </li>
            <li>
              Every <Link href="/exams">exam format and scoring guide</Link>, sourced to the test maker.
            </li>
            <li>Your account, your data export and account deletion, whatever your plan.</li>
          </ul>
        </section>
      </div>

      <section aria-labelledby="small-print-heading" className="mt-12 max-w-3xl">
        <h2 id="small-print-heading" className="font-heading text-xl font-semibold">
          How billing works
        </h2>
        <ul className="mt-3 list-disc space-y-2 ps-5 text-sm text-ink-muted">
          <li>Prices are in euros and include VAT.</li>
          <li>
            A plan renews automatically at the end of each period until you cancel. Cancel at any time
            from <Link href="/account#billing">your account</Link>; Premium then stays on until the end
            of the period you paid for.
          </li>
          <li>
            Premium starts as soon as you pay, so the 14-day right of withdrawal ends at that point; you
            are asked to agree to this at checkout.
          </li>
          <li>
            Payments are handled by Stripe on its own secure pages. Your card details go to Stripe and
            never reach {SITE.name}. See the <Link href="/about/terms">terms</Link> and the{' '}
            <Link href="/about/privacy">privacy notice</Link>.
          </li>
        </ul>
      </section>
    </Container>
  );
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
