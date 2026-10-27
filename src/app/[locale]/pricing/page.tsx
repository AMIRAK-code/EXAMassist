import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { absoluteUrl, SITE, shareImages, siteUrl } from '@/lib/site';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { EXAM_CONFIGS, examTestName, getExamConfig } from '@/lib/exams/registry';
import { countPageView, subjectFor } from '@/lib/analytics/funnel';
import { billingSettings, checkoutPath, freeTestPath } from '@/lib/billing/config';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { PLANS, PLAN_COPY, featureMatrix, formatPrice, type PlanKey } from '@/lib/billing/plans';
import { Alert, Badge, Breadcrumbs, ButtonLink, Card, Container, PageHeader, buttonClass, cx, fieldClass } from '@/components/ui';

export const dynamic = 'force-dynamic';

/** Every string on this page, for translation. Plan names and features come from plans.ts. */
const COPY = {
  title: 'Plans and pricing',
  metaDescription:
    'All access for €39 a month, or a single exam for €19.99 a month. Guides, sample questions and a diagnostic for every exam stay free. VAT included; cancel any time.',
  crumbs: { home: 'Home', here: 'Pricing' },
  eyebrow: 'Plans',
  heading: 'Practise every exam, or just the one you are sitting',
  headingForExam: 'Plans for your {exam} preparation',
  lead: 'Guides, sample questions and a diagnostic for every exam are free. A plan opens practice, timed sections, full simulations and the study plan.',
  notEnforced: {
    title: 'Everything is free right now',
    body: 'Payments are not switched on for this site yet, so every exam and every format is open to everyone.',
  },
  testMode: 'Test mode: checkout uses Stripe test cards and charges nothing.',
  reasons: {
    'diagnostic-taken': 'You have taken the free diagnostic. Choose a plan to keep practising with fresh questions.',
    practice: 'Practice sessions are part of a paid plan.',
    timed_section: 'Timed sections are part of a paid plan.',
    simulation: 'Full-length simulations are part of a paid plan.',
    study_plan: 'The study plan and readiness view are part of a paid plan.',
    ai_tutor: 'The AI tutor is part of All access.',
  } as Record<string, string>,
  current: {
    allAccess: 'You have All access: every exam and the AI tutor are open to you.',
    singleExam: 'Your single-exam plans: {exams}.',
    manage: 'Manage your plans',
  },
  freePrice: '€0',
  perMonth: '/ month',
  perMonthPerExam: '/ month per exam',
  featured: 'Most complete',
  free: { cta: 'Take a free diagnostic', ctaExams: 'Choose an exam' },
  single: {
    examLabel: 'Exam',
    owned: '(your plan)',
    coveredByAll: 'All access already includes every exam.',
    cta: 'Continue to checkout',
  },
  all: { cta: 'Choose All access', owned: 'You have this plan' },
  accountNote: 'Buying a plan needs a free account. If you have been practising as a guest, your history comes with you.',
  matrix: {
    heading: 'What each plan includes',
    caption: 'Features by plan',
    feature: 'Feature',
    included: 'Included',
    notIncluded: 'Not included',
  },
  smallPrint: {
    heading: 'How billing works',
    lines: [
      'Prices are in euros and include VAT.',
      'Plans renew every month until you cancel. Cancel any time from your account; the plan stays on until the end of the month you paid for.',
      'Access starts as soon as you pay. At checkout you are asked to confirm that you want it straight away and that the 14-day right of withdrawal ends when it starts.',
      'Card details are entered in fields provided by Stripe, our payment provider, and go straight to Stripe. They never reach our servers.',
    ],
    terms: 'Terms of sale',
    privacy: 'Privacy notice',
  },
} as const;

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

export const metadata: Metadata = {
  title: COPY.title,
  description: COPY.metaDescription,
  alternates: { canonical: absoluteUrl('/pricing') },
  openGraph: {
    url: absoluteUrl('/pricing'),
    title: `${COPY.title} | ${SITE.shortName}`,
    description: COPY.metaDescription,
    images: shareImages('site', COPY.title),
  },
};

const TRAIL = [{ href: '/', label: COPY.crumbs.home }, { label: COPY.crumbs.here }];

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ exam?: string; reason?: string }> }) {
  const query = await searchParams;
  const db = getDb();
  const settings = billingSettings();
  const user = await getCurrentUser();
  const entitlements = await loadEntitlements(db, user?.id ?? null);
  // What the learner holds, whether or not the paywall is on yet.
  const owned = user && settings.configured ? await loadEntitlements(db, user.id, { settings: { ...settings, enforced: true } }) : null;
  const exam = typeof query.exam === 'string' ? getExamConfig(query.exam) : undefined;
  await countPageView(db, 'pricing_view', subjectFor(exam?.examKey), await headers());

  const hasAll = owned?.hasAllAccess ?? false;
  const ownedExams = new Set(owned?.singleExamKeys ?? []);
  const canBuy = settings.checkoutAvailable;
  const reason = typeof query.reason === 'string' ? COPY.reasons[query.reason] : undefined;
  const matrix = featureMatrix();
  const planColumns: Array<{ key: 'free' | PlanKey; name: string }> = [
    { key: 'free', name: PLAN_COPY.free.name },
    { key: 'single_exam', name: PLAN_COPY.plans.single_exam.name },
    { key: 'all_access', name: PLAN_COPY.plans.all_access.name },
  ];

  return (
    <Container>
      <JsonLd data={breadcrumbSchema(siteUrl(), TRAIL)} />
      <Breadcrumbs trail={TRAIL} />
      <PageHeader
        eyebrow={COPY.eyebrow}
        title={exam ? fill(COPY.headingForExam, { exam: examTestName(exam) }) : COPY.heading}
        lead={COPY.lead}
      />

      <div className="mb-8 space-y-4">
        {!entitlements.enforced ? (
          <Alert tone="info" title={COPY.notEnforced.title}>
            <p>{COPY.notEnforced.body}</p>
          </Alert>
        ) : null}
        {canBuy && !settings.livemode ? <p className="text-sm text-ink-muted">{COPY.testMode}</p> : null}
        {reason && !hasAll ? (
          <Alert tone="caution" role="status">
            <p>{reason}</p>
          </Alert>
        ) : null}
        {hasAll || ownedExams.size > 0 ? (
          <Alert tone="positive">
            <p>
              {hasAll
                ? COPY.current.allAccess
                : fill(COPY.current.singleExam, { exams: [...ownedExams].map((key) => getExamConfig(key)?.shortName ?? key).join(', ') })}{' '}
              <Link href="/account#billing">{COPY.current.manage}</Link>
            </p>
          </Alert>
        ) : null}
      </div>

      <ul className="grid gap-5 lg:grid-cols-3" aria-label={COPY.eyebrow}>
        <Card as="li" padding="lg" className="flex flex-col">
          <h2 className="font-heading text-xl font-semibold">{PLAN_COPY.free.name}</h2>
          <p className="mt-1 text-sm text-ink-muted">{PLAN_COPY.free.tagline}</p>
          <p className="mt-4">
            <span className="font-heading text-4xl font-semibold tracking-tight">{COPY.freePrice}</span>
          </p>
          <FeatureList included={matrix.filter((row) => row.free).map((row) => row.label)} />
          <div className="mt-6 flex-1" />
          <ButtonLink href={exam ? freeTestPath(exam.examKey) : '/exams'} variant="secondary" full>
            {exam ? COPY.free.cta : COPY.free.ctaExams}
          </ButtonLink>
        </Card>

        <Card as="li" padding="lg" className="flex flex-col">
          <h2 className="font-heading text-xl font-semibold">{PLAN_COPY.plans.single_exam.name}</h2>
          <p className="mt-1 text-sm text-ink-muted">{PLAN_COPY.plans.single_exam.tagline}</p>
          <p className="mt-4">
            <span className="font-heading text-4xl font-semibold tracking-tight">{formatPrice(PLANS.single_exam.amount)}</span>
            <span className="text-ink-muted"> {COPY.perMonthPerExam}</span>
          </p>
          <FeatureList included={matrix.filter((row) => row.plans.single_exam).map((row) => row.label)} />
          <div className="mt-6 flex-1" />
          {hasAll ? (
            <p className="text-sm text-ink-muted">{COPY.single.coveredByAll}</p>
          ) : canBuy ? (
            // A plain GET form: the exam picker works without JavaScript.
            <form action="/checkout" method="get" className="space-y-3">
              <input type="hidden" name="plan" value="single_exam" />
              <div>
                <label htmlFor="pricing-exam" className="mb-1.5 block text-sm font-medium">
                  {COPY.single.examLabel}
                </label>
                <select id="pricing-exam" name="exam" defaultValue={exam?.examKey ?? EXAM_CONFIGS[0]?.examKey} className={fieldClass()}>
                  {EXAM_CONFIGS.map((config) => (
                    <option key={config.examKey} value={config.examKey} disabled={ownedExams.has(config.examKey)}>
                      {config.name}
                      {ownedExams.has(config.examKey) ? ` ${COPY.single.owned}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={buttonClass({ variant: 'secondary', full: true })}>
                {COPY.single.cta}
              </button>
            </form>
          ) : null}
        </Card>

        <Card as="li" padding="lg" className="flex flex-col border-2 border-accent">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-xl font-semibold">{PLAN_COPY.plans.all_access.name}</h2>
            <Badge tone="accent">{COPY.featured}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-muted">{PLAN_COPY.plans.all_access.tagline}</p>
          <p className="mt-4">
            <span className="font-heading text-4xl font-semibold tracking-tight">{formatPrice(PLANS.all_access.amount)}</span>
            <span className="text-ink-muted"> {COPY.perMonth}</span>
          </p>
          <FeatureList included={matrix.filter((row) => row.plans.all_access).map((row) => row.label)} />
          <div className="mt-6 flex-1" />
          {hasAll ? (
            <p className="text-sm font-semibold text-positive">{COPY.all.owned}</p>
          ) : canBuy ? (
            <ButtonLink href={`${checkoutPath('all_access')}${exam ? `&source=${encodeURIComponent(exam.examKey)}` : ''}`} full>
              {COPY.all.cta}
            </ButtonLink>
          ) : null}
        </Card>
      </ul>

      <p className="mt-3 text-sm text-ink-muted">{PLAN_COPY.vatNote}</p>
      {canBuy && (!user || user.isGuest) ? <p className="mt-1 text-sm text-ink-muted">{COPY.accountNote}</p> : null}

      <section aria-labelledby="matrix-heading" className="mt-12">
        <h2 id="matrix-heading" className="font-heading text-2xl font-semibold">
          {COPY.matrix.heading}
        </h2>
        <div className="mt-4 overflow-x-auto rounded-card border border-line bg-surface">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <caption className="sr-only">{COPY.matrix.caption}</caption>
            <thead>
              <tr className="border-b border-line bg-surface-sunken">
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {COPY.matrix.feature}
                </th>
                {planColumns.map((column) => (
                  <th key={column.key} scope="col" className="px-4 py-3 text-center font-semibold">
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.feature} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-3 text-start font-normal">
                    {row.label}
                  </th>
                  {planColumns.map((column) => {
                    const on = column.key === 'free' ? row.free : row.plans[column.key];
                    return (
                      <td key={column.key} className="px-4 py-3 text-center">
                        <Mark on={on} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="small-print-heading" className="mt-12 max-w-3xl">
        <h2 id="small-print-heading" className="font-heading text-xl font-semibold">
          {COPY.smallPrint.heading}
        </h2>
        <ul className="mt-3 list-disc space-y-2 ps-5 text-sm text-ink-muted">
          {COPY.smallPrint.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <Link href="/about/terms#sale">{COPY.smallPrint.terms}</Link>
          <Link href="/about/privacy">{COPY.smallPrint.privacy}</Link>
        </p>
      </section>
    </Container>
  );
}

function FeatureList({ included }: { included: string[] }) {
  return (
    <ul className="mt-5 space-y-2 text-sm">
      {included.map((label) => (
        <li key={label} className="flex gap-2.5">
          <Mark on />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}

/** A tick or a dash, each with words for screen readers: never shape or colour alone. */
function Mark({ on }: { on: boolean }) {
  return on ? (
    <span className="inline-flex items-center">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className={cx('mt-0.5 shrink-0 text-positive')}>
        <path d="M3.5 8.4l2.9 2.8 6.1-6.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">{COPY.matrix.included}</span>
    </span>
  ) : (
    <span className="inline-flex items-center text-ink-subtle">
      <span aria-hidden="true">—</span>
      <span className="sr-only">{COPY.matrix.notIncluded}</span>
    </span>
  );
}
