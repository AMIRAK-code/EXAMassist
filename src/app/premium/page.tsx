import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { absoluteUrl, SITE, siteUrl } from '@/lib/site';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { headers } from 'next/headers';
import { EXAM_CONFIGS, examTestName, getConfigsForHub, getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { examCoverage } from '@/lib/attempts/availability';
import { countPageView, subjectFor } from '@/lib/analytics/funnel';
import { tutorSettings } from '@/lib/tutor/config';
import { FREE_SESSIONS, PLANS, PLAN_KEYS, billingSettings, formatEuros, freeTestPath, type PlanKey } from '@/lib/billing/config';
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

const PREMIUM_TRAIL = [{ href: '/', label: 'Home' }, { label: 'Premium' }];

const MONTHLY = PLANS.monthly.perMonth;
const saving = (perMonth: number) => Math.floor((1 - perMonth / MONTHLY) * 100);

export default async function PremiumPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; reason?: string; exam?: string }>;
}) {
  const query = await searchParams;
  const settings = billingSettings();
  const user = await getCurrentUser();
  const access = user ? await getAccess(getDb(), user.id) : null;
  const premium = access ? premiumActive(access.subscription) : false;
  const tutor = tutorSettings().enabled;
  // Came here from an exam's introduction: the free test for it is the way to skip
  const exam = typeof query.exam === 'string' ? getExamConfig(query.exam) : undefined;
  const offerFreeTest = settings.enabled && !access?.fullAccess && (access?.sessionsUsed ?? 0) === 0;
  await countPageView(getDb(), 'pricing_view', subjectFor(exam?.examKey), await headers());

  // Arriving from an exam: lead with what Premium does for that exam.
  const hub = exam ? getHubForConfig(exam.examKey) : undefined;
  const hubConfigs = hub ? getConfigsForHub(hub.slug) : [];
  const examQuestions = exam
    ? (await Promise.all(hubConfigs.map((config) => examCoverage(getDb(), config)))).reduce((sum, c) => sum + c.publishedItems, 0)
    : 0;
  const examIncludes = exam && hub
    ? [
        `Every ${hub.label} practice format${hubConfigs.length > 1 ? ` for ${hubConfigs.map((c) => hub.variantLabels?.[c.examKey] ?? c.shortName).join(' and ')}` : ''}: topic practice, timed sets at the real pace${exam.capabilities.fullSimulation.available ? ', and full-length simulations under the published rules' : ''}, drawn from ${examQuestions} reviewed questions.`,
        'A fresh selection in every session, retries of the questions you missed, and a mistake notebook that brings them back.',
        `Results by ${hub.label} area and topic after every session, so you can see which topics are holding you back.`,
        'A study plan that schedules your sessions toward your test date.',
        ...(tutor ? ['The AI tutor’s hints and deeper explanations, within its daily allowance.'] : []),
        `Also included, at no extra cost: every other test on ${SITE.name} (${EXAM_CONFIGS.length} tests in all).`,
      ]
    : null;

  const includes = examIncludes ?? [
    `Every exam on ${SITE.name}, all ${EXAM_CONFIGS.length} of them, with every practice format each one offers.`,
    'As many sessions as you like, with fresh questions in each: topic practice, timed sections and full-length mock exams wherever the exam offers one.',
    'Retries of the questions you missed, your review queue, and the sessions your study plan schedules.',
    'Full results and the worked explanation for every question, in every session.',
    ...(tutor ? ['The AI tutor’s hints and deeper explanations, within its daily allowance.'] : []),
  ];

  return (
    <Container>
      <JsonLd data={breadcrumbSchema(siteUrl(), PREMIUM_TRAIL)} />
      <Breadcrumbs trail={PREMIUM_TRAIL} />
      <PageHeader
        eyebrow={`${SITE.name} Premium`}
        title={hub ? `Premium for your ${hub.label} preparation` : 'Practise every exam, as often as you need'}
        lead={
          hub
            ? `Practise ${hub.label} questions as often as you need, see exactly which topics cost you marks, and follow a plan to your test date. A free account gets one free test; Premium opens everything else.`
            : 'A free account gets one free test on the exam of its choice: the same fixed questions for everyone. Premium opens everything else, with fresh questions in every session.'
        }
      >
        {exam && offerFreeTest ? (
          <Link href={freeTestPath(exam.examKey)} className="font-semibold">
            Not ready to choose? Take the free {examTestName(exam)} test first
          </Link>
        ) : null}
      </PageHeader>

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
        {query.reason === 'free-test-used' && !premium ? (
          <Alert tone="caution" title="You have taken your free test">
            <p>
              Its results stay in your history. Choose a plan below to practise any exam, in any format,
              with fresh questions every time.
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
              <ButtonLink href={exam ? `/practice/${exam.examKey}` : '/exams'} size="sm">
                {exam ? `Continue ${examTestName(exam)} practice` : 'Choose an exam'}
              </ButtonLink>
              <ManageBillingButton />
            </div>
          </Alert>
        ) : null}
      </div>

      <ul className="grid gap-5 md:grid-cols-3" aria-label="Premium plans">
        {planOrder(Boolean(exam)).map((key) => {
          const plan = PLANS[key];
          // From an exam, the 3-month plan is the one shown first and marked:
          // it spans a typical run-up to a test date. Prices are unchanged.
          const featured = exam ? key === 'quarterly' : key === 'yearly';
          const best = key === 'yearly';
          const off = saving(plan.perMonth);
          return (
            <Card as="li" key={key} padding="lg" className={cx('flex flex-col', featured && 'border-2 border-accent')}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-heading text-xl font-semibold">{plan.label}</h2>
                {featured && exam ? (
                  <Badge tone="accent">A 3-month run-up</Badge>
                ) : best ? (
                  <Badge tone={featured ? 'accent' : 'neutral'}>Best value</Badge>
                ) : off > 0 ? (
                  <Badge tone="neutral">Save {off}%</Badge>
                ) : null}
              </div>
              <p className="mt-4">
                <span className="font-heading text-4xl font-semibold tracking-tight">{formatEuros(plan.perMonth)}</span>
                <span className="text-ink-muted"> / month</span>
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                {plan.intervalCount === 1 && plan.interval === 'month'
                  ? 'Billed every month. VAT included.'
                  : `${formatEuros(plan.amount)} billed ${plan.billedEvery}. VAT included.`}
                {best || (featured && exam) ? ` Save ${off}% against monthly.` : ''}
                {featured && exam ? ' Renews every 3 months until you cancel.' : ''}
              </p>
              <div className="mt-6 flex-1" />
              {settings.enabled && !premium ? (
                <ChoosePlanButton
                  plan={key}
                  label={`Choose ${plan.label.toLowerCase()}`}
                  variant={featured ? 'primary' : 'secondary'}
                  exam={exam?.examKey}
                />
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
            {hub ? `What Premium includes for ${hub.label} applicants` : 'What Premium includes'}
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
              With a free account: {FREE_SESSIONS === 1 ? 'one test' : `${FREE_SESSIONS} tests`} on the exam of
              your choice, the same fixed questions for everyone, with full results and explanations.
            </li>
            <li>
              Without an account: the <Link href="/#top">sample question on the home page</Link>.
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

/** Monthly, 3 months, yearly; from an exam, the 3-month plan comes first. */
function planOrder(fromExam: boolean): PlanKey[] {
  return fromExam ? ['quarterly', 'monthly', 'yearly'] : PLAN_KEYS;
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
