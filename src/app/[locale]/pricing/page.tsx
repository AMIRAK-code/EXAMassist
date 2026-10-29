import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Link, getPathname } from '@/i18n/navigation';
import { pageAlternates } from '@/i18n/alternates';
import { localizePath, type Locale } from '@/i18n/locales';
import { headers } from 'next/headers';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { shareImages, SITE, siteUrl } from '@/lib/site';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import { EXAM_CONFIGS, examTestName, getExamConfig } from '@/lib/exams/registry';
import { countPageView, subjectFor } from '@/lib/analytics/funnel';
import { billingSettings, checkoutPath, freeTestPath } from '@/lib/billing/config';
import { allExamSaleStatuses } from '@/lib/billing/availability';
import { loadEntitlements } from '@/lib/billing/entitlements';
import {
  DISPLAYED_PLANS,
  PRICES,
  annualSaving,
  featureMatrix,
  formatPrice,
  formatWholePrice,
  type DisplayedPlan,
} from '@/lib/billing/plans';
import { Alert, Badge, Breadcrumbs, ButtonLink, Card, Container, PageHeader, buttonClass, cx, fieldClass } from '@/components/ui';

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'billing.pricing.meta' });
  const title = t('title');
  const description = t('description', {
    passPrice: formatPrice(PRICES.exam_pass.amount, locale),
    plusMonthly: formatPrice(PRICES.plus_month.amount, locale),
    plusYearly: formatPrice(PRICES.plus_year.amount, locale),
  });
  const alternates = (await pageAlternates(params, '/pricing'));
  return {
    title,
    description,
    alternates,
    openGraph: { url: alternates.canonical, title: `${title} | ${SITE.shortName}`, description, images: shareImages('site', title) },
  };
}

/** `?reason=` values (from upgrade prompts and the free diagnostic) and the message each shows. */
const REASONS: Record<string, string> = {
  'diagnostic-taken': 'diagnosticTaken',
  practice: 'practice',
  timed_section: 'timed_section',
  simulation: 'simulation',
  study_plan: 'study_plan',
  ai_tutor: 'ai_tutor',
};

export default async function PricingPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ exam?: string; reason?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const t = await getTranslations({ locale, namespace: 'billing' });
  const format = await getFormatter({ locale });
  const price = (cents: number) => formatPrice(cents, locale);
  const db = getDb();
  const settings = billingSettings();
  const user = await getCurrentUser();
  const entitlements = await loadEntitlements(db, user?.id ?? null);
  // What the learner holds, whether or not the paywall is on yet.
  const owned = user && settings.configured ? await loadEntitlements(db, user.id, { settings: { ...settings, enforced: true } }) : null;
  const exam = typeof query.exam === 'string' ? getExamConfig(query.exam) : undefined;
  await countPageView(db, 'pricing_view', subjectFor(exam?.examKey), await headers());

  // What can be delivered today: a pass is sold only for an exam with an open practice format.
  const sale = new Map((await allExamSaleStatuses(db)).map((status) => [status.examKey, status]));
  const openExams = [...sale.values()].filter((status) => status.sellable).length;

  const hasAll = owned?.hasAllAccess ?? false;
  const hasTutor = owned?.can('ai_tutor') ?? false;
  const ownedExams = new Set(owned?.singleExamKeys ?? []);
  const canBuy = settings.checkoutAvailable;
  const buyable = (examKey: string) => Boolean(sale.get(examKey)?.sellable) && !ownedExams.has(examKey);
  const passDefault = exam && buyable(exam.examKey) ? exam.examKey : EXAM_CONFIGS.find((config) => buyable(config.examKey))?.examKey;
  const reasonKey = typeof query.reason === 'string' && Object.prototype.hasOwnProperty.call(REASONS, query.reason) ? REASONS[query.reason] : undefined;
  const reason = reasonKey ? t(`pricing.reasons.${reasonKey}`) : undefined;
  const saving = annualSaving();
  // Feature labels in the page's language (featureMatrix's own labels are English).
  const matrix = featureMatrix().map((row) => ({ ...row, label: t(`features.${row.feature}`) }));
  const planColumns: Array<{ key: 'free' | DisplayedPlan; name: string; note?: string }> = [
    { key: 'free', name: t('plans.free.name') },
    ...DISPLAYED_PLANS.map((key) => ({
      key,
      name: t(`plans.${key}.name`),
      note: key === 'premium' ? t('pricing.premium.badge') : undefined,
    })),
  ];
  const trail = [{ href: '/', label: t('crumbs.home') }, { label: t('crumbs.pricing') }];
  // Structured data carries full URLs, so it needs the language prefix the links add on their own.
  const schemaTrail = trail.map((crumb) => (crumb.href ? { ...crumb, href: localizePath(crumb.href, locale as Locale) } : crumb));
  // A plain HTML form does not go through the locale-aware Link, so it gets the prefixed path itself.
  const checkoutAction = getPathname({ href: '/checkout', locale });
  const markLabels = { included: t('pricing.matrix.included'), notIncluded: t('pricing.matrix.notIncluded') };
  const source = exam ? `&source=${encodeURIComponent(exam.examKey)}` : '';

  return (
    <Container>
      <JsonLd data={breadcrumbSchema(siteUrl(), schemaTrail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow={t('pricing.eyebrow')}
        title={exam ? t('pricing.headingForExam', { exam: examTestName(exam) }) : t('pricing.heading')}
        lead={t('pricing.lead')}
      />

      <div className="mb-8 space-y-4">
        {!entitlements.enforced ? (
          <Alert tone="info" title={t('pricing.notEnforced.title')}>
            <p>{t('pricing.notEnforced.body')}</p>
          </Alert>
        ) : null}
        {canBuy && !settings.livemode ? <p className="text-sm text-ink-muted">{t('pricing.testMode')}</p> : null}
        {reason && !(hasAll && reasonKey !== 'ai_tutor') ? (
          <Alert tone="caution" role="status">
            <p>{reason}</p>
          </Alert>
        ) : null}
        {hasAll || ownedExams.size > 0 ? (
          <Alert tone="positive">
            <p>
              {hasAll
                ? hasTutor
                  ? t('pricing.current.allAccessTutor')
                  : t('pricing.current.allAccess')
                : t('pricing.current.singleExam', {
                    exams: format.list([...ownedExams].map((key) => getExamConfig(key)?.shortName ?? key)),
                  })}{' '}
              <Link href="/account#billing">{t('pricing.current.manage')}</Link>
            </p>
          </Alert>
        ) : null}
      </div>

      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label={t('pricing.eyebrow')}>
        {/* Free */}
        <Card as="li" padding="lg" className="flex flex-col">
          <h2 className="font-heading text-xl font-semibold">{t('plans.free.name')}</h2>
          <p className="mt-1 text-sm text-ink-muted">{t('plans.free.tagline')}</p>
          <p className="mt-4">
            <span className="font-heading text-4xl font-semibold tracking-tight">
              {format.number(0, { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </p>
          <FeatureList included={matrix.filter((row) => row.free).map((row) => row.label)} labels={markLabels} />
          <div className="mt-6 flex-1" />
          <ButtonLink href={exam ? freeTestPath(exam.examKey) : '/exams'} variant="secondary" full>
            {exam ? t('pricing.free.cta') : t('pricing.free.ctaExams')}
          </ButtonLink>
        </Card>

        {/* Single Exam Pass */}
        <Card as="li" padding="lg" className="flex flex-col">
          <h2 className="font-heading text-xl font-semibold">{t('plans.exam_pass.name')}</h2>
          <p className="mt-1 text-sm text-ink-muted">{t('plans.exam_pass.tagline')}</p>
          <p className="mt-4">
            <span className="font-heading text-4xl font-semibold tracking-tight">{price(PRICES.exam_pass.amount)}</span>
            <span className="text-ink-muted"> {t('pricing.pass.once')}</span>
          </p>
          <p className="mt-2 text-sm font-medium">{t('pricing.pass.term')}</p>
          <FeatureList included={matrix.filter((row) => !row.free && row.plans.exam_pass).map((row) => row.label)} labels={markLabels} />
          <p className="mt-3 text-sm text-ink-muted">{t('pricing.pass.noTutor')}</p>
          <div className="mt-6 flex-1" />
          {hasAll ? (
            <p className="text-sm text-ink-muted">{t('pricing.pass.coveredByAll')}</p>
          ) : !passDefault ? (
            <p className="text-sm text-ink-muted">{t('pricing.pass.noneAvailable')}</p>
          ) : canBuy ? (
            // A plain GET form: the exam picker works without JavaScript.
            <form action={checkoutAction} method="get" className="space-y-3">
              <input type="hidden" name="plan" value="exam_pass" />
              <div>
                <label htmlFor="pricing-exam" className="mb-1.5 block text-sm font-medium">
                  {t('pricing.pass.examLabel')}
                </label>
                <select id="pricing-exam" name="exam" defaultValue={passDefault} className={fieldClass()}>
                  {EXAM_CONFIGS.map((config) => (
                    <option key={config.examKey} value={config.examKey} disabled={!buyable(config.examKey)}>
                      {config.name}
                      {ownedExams.has(config.examKey)
                        ? ` ${t('pricing.pass.owned')}`
                        : !sale.get(config.examKey)?.sellable
                          ? ` ${t('pricing.pass.unavailableOption')}`
                          : ''}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={buttonClass({ variant: 'secondary', full: true })}>
                {t('pricing.pass.cta')}
              </button>
            </form>
          ) : null}
        </Card>

        {/* Plus */}
        <Card as="li" padding="lg" className="flex flex-col border-2 border-accent">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-xl font-semibold">{t('plans.plus.name')}</h2>
            <Badge tone="accent">{t('pricing.plus.badge')}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-muted">{t('plans.plus.tagline')}</p>
          <p className="mt-4">
            <span className="font-heading text-4xl font-semibold tracking-tight">{price(PRICES.plus_month.amount)}</span>
            <span className="text-ink-muted"> {t('pricing.perMonth')}</span>
          </p>
          <p className="mt-2">
            <span className="font-heading text-2xl font-semibold tracking-tight">{price(PRICES.plus_year.amount)}</span>
            <span className="text-ink-muted"> {t('pricing.perYear')}</span>
          </p>
          <p className="mt-1 text-sm font-medium text-positive">{t('pricing.plus.yearlySaving', { percent: saving.percent })}</p>
          <p className="text-sm text-ink-muted">
            {t('pricing.plus.yearlyApprox', {
              perMonth: formatWholePrice(saving.perMonthCents, locale),
              price: price(PRICES.plus_year.amount),
            })}
          </p>
          <FeatureList included={matrix.filter((row) => !row.free && row.plans.plus).map((row) => row.label)} labels={markLabels} />
          <p className="mt-3 text-sm text-ink-muted">
            {t('pricing.plus.coverage', { open: openExams, total: EXAM_CONFIGS.length })}
          </p>
          <p className="mt-2 text-sm text-ink-muted">{t('pricing.plus.noTutor')}</p>
          <div className="mt-6 flex-1" />
          {hasAll ? (
            <p className="text-sm font-semibold text-positive">{t('pricing.plus.owned')}</p>
          ) : canBuy ? (
            <div className="space-y-2">
              <ButtonLink href={`${checkoutPath('plus_year')}${source}`} full>
                {t('pricing.plus.ctaYearly', { price: price(PRICES.plus_year.amount) })}
              </ButtonLink>
              <ButtonLink href={`${checkoutPath('plus_month')}${source}`} variant="secondary" full>
                {t('pricing.plus.ctaMonthly', { price: price(PRICES.plus_month.amount) })}
              </ButtonLink>
            </div>
          ) : null}
        </Card>

        {/* Premium: announced, not sold. The checkout refuses it on the server too. */}
        <Card as="li" padding="lg" className="flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-xl font-semibold">{t('plans.premium.name')}</h2>
            <Badge tone="neutral">{t('pricing.premium.badge')}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-muted">{t('plans.premium.tagline')}</p>
          <p className="mt-4 text-sm">
            {t('pricing.premium.planned', {
              monthly: price(PRICES.premium_month.amount),
              yearly: price(PRICES.premium_year.amount),
            })}
          </p>
          <FeatureList included={matrix.filter((row) => !row.free && row.plans.premium).map((row) => row.label)} labels={markLabels} />
          <p className="mt-3 text-sm text-ink-muted">{t('pricing.premium.limits')}</p>
          <div className="mt-6 flex-1" />
          <span
            aria-disabled="true"
            className={cx(buttonClass({ variant: 'secondary', full: true }), 'pointer-events-none cursor-not-allowed opacity-60')}
          >
            {t('pricing.premium.cta')}
          </span>
        </Card>
      </ul>

      <p className="mt-3 text-sm text-ink-muted">{t('plans.vatNote')}</p>
      {canBuy && (!user || user.isGuest) ? <p className="mt-1 text-sm text-ink-muted">{t('pricing.accountNote')}</p> : null}

      <section aria-labelledby="exams-heading" className="mt-12">
        <h2 id="exams-heading" className="font-heading text-2xl font-semibold">
          {t('pricing.exams.heading')}
        </h2>
        <p className="mt-2 max-w-3xl text-ink-muted">{t('pricing.exams.lead')}</p>
        <div className="mt-4 overflow-x-auto rounded-card border border-line bg-surface">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <caption className="sr-only">{t('pricing.exams.caption')}</caption>
            <thead>
              <tr className="border-b border-line bg-surface-sunken">
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t('pricing.exams.exam')}
                </th>
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t('pricing.exams.status')}
                </th>
              </tr>
            </thead>
            <tbody>
              {EXAM_CONFIGS.map((config) => {
                const status = sale.get(config.examKey);
                return (
                  <tr key={config.examKey} className="border-b border-line last:border-b-0">
                    <th scope="row" className="px-4 py-3 text-start font-normal">
                      {config.name}
                    </th>
                    <td className="px-4 py-3">
                      {status?.sellable ? (
                        <span className="text-positive">{t('pricing.exams.open', { count: status.openFormats.length })}</span>
                      ) : (
                        <span className="text-ink-muted">{t('pricing.exams.closed')}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="matrix-heading" className="mt-12">
        <h2 id="matrix-heading" className="font-heading text-2xl font-semibold">
          {t('pricing.matrix.heading')}
        </h2>
        <div className="mt-4 overflow-x-auto rounded-card border border-line bg-surface">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <caption className="sr-only">{t('pricing.matrix.caption')}</caption>
            <thead>
              <tr className="border-b border-line bg-surface-sunken">
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t('pricing.matrix.feature')}
                </th>
                {planColumns.map((column) => (
                  <th key={column.key} scope="col" className="px-4 py-3 text-center font-semibold">
                    {column.name}
                    {column.note ? <span className="block text-xs font-normal text-ink-muted">{column.note}</span> : null}
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
                        <Mark on={on} labels={markLabels} />
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
          {t('pricing.smallPrint.heading')}
        </h2>
        <ul className="mt-3 list-disc space-y-2 ps-5 text-sm text-ink-muted">
          {(['currency', 'pass', 'renewal', 'withdrawal', 'cards', 'earlier'] as const).map((line) => (
            <li key={line}>{t(`pricing.smallPrint.${line}`)}</li>
          ))}
        </ul>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <Link href="/about/terms#sale">{t('pricing.smallPrint.terms')}</Link>
          <Link href="/about/privacy">{t('pricing.smallPrint.privacy')}</Link>
        </p>
      </section>
    </Container>
  );
}

type MarkLabels = { included: string; notIncluded: string };

function FeatureList({ included, labels }: { included: string[]; labels: MarkLabels }) {
  return (
    <ul className="mt-5 space-y-2 text-sm">
      {included.map((label) => (
        <li key={label} className="flex gap-2.5">
          <Mark on labels={labels} />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}

/** A tick or a dash, each with words for screen readers: never shape or colour alone. */
function Mark({ on, labels }: { on: boolean; labels: MarkLabels }) {
  return on ? (
    <span className="inline-flex items-center">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className={cx('mt-0.5 shrink-0 text-positive')}>
        <path d="M3.5 8.4l2.9 2.8 6.1-6.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">{labels.included}</span>
    </span>
  ) : (
    <span className="inline-flex items-center text-ink-subtle">
      <span aria-hidden="true">—</span>
      <span className="sr-only">{labels.notIncluded}</span>
    </span>
  );
}
