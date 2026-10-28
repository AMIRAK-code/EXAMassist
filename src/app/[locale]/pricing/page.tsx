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
import { loadEntitlements } from '@/lib/billing/entitlements';
import { PLANS, featureMatrix, formatPrice, type PlanKey } from '@/lib/billing/plans';
import { Alert, Badge, Breadcrumbs, ButtonLink, Card, Container, PageHeader, buttonClass, cx, fieldClass } from '@/components/ui';

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'billing.pricing.meta' });
  const title = t('title');
  const description = t('description', {
    allAccessPrice: formatPrice(PLANS.all_access.amount, locale),
    singleExamPrice: formatPrice(PLANS.single_exam.amount, locale),
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

  const hasAll = owned?.hasAllAccess ?? false;
  const ownedExams = new Set(owned?.singleExamKeys ?? []);
  const canBuy = settings.checkoutAvailable;
  const reasonKey = typeof query.reason === 'string' && Object.prototype.hasOwnProperty.call(REASONS, query.reason) ? REASONS[query.reason] : undefined;
  const reason = reasonKey ? t(`pricing.reasons.${reasonKey}`) : undefined;
  // Feature labels in the page's language (featureMatrix's own labels are English).
  const matrix = featureMatrix().map((row) => ({ ...row, label: t(`features.${row.feature}`) }));
  const planColumns: Array<{ key: 'free' | PlanKey; name: string }> = [
    { key: 'free', name: t('plans.free.name') },
    { key: 'single_exam', name: t('plans.single_exam.name') },
    { key: 'all_access', name: t('plans.all_access.name') },
  ];
  const trail = [{ href: '/', label: t('crumbs.home') }, { label: t('crumbs.pricing') }];
  // Structured data carries full URLs, so it needs the language prefix the links add on their own.
  const schemaTrail = trail.map((crumb) => (crumb.href ? { ...crumb, href: localizePath(crumb.href, locale as Locale) } : crumb));
  // A plain HTML form does not go through the locale-aware Link, so it gets the prefixed path itself.
  const checkoutAction = getPathname({ href: '/checkout', locale });
  const markLabels = { included: t('pricing.matrix.included'), notIncluded: t('pricing.matrix.notIncluded') };

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
        {reason && !hasAll ? (
          <Alert tone="caution" role="status">
            <p>{reason}</p>
          </Alert>
        ) : null}
        {hasAll || ownedExams.size > 0 ? (
          <Alert tone="positive">
            <p>
              {hasAll
                ? t('pricing.current.allAccess')
                : t('pricing.current.singleExam', {
                    exams: format.list([...ownedExams].map((key) => getExamConfig(key)?.shortName ?? key)),
                  })}{' '}
              <Link href="/account#billing">{t('pricing.current.manage')}</Link>
            </p>
          </Alert>
        ) : null}
      </div>

      <ul className="grid gap-5 lg:grid-cols-3" aria-label={t('pricing.eyebrow')}>
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

        <Card as="li" padding="lg" className="flex flex-col">
          <h2 className="font-heading text-xl font-semibold">{t('plans.single_exam.name')}</h2>
          <p className="mt-1 text-sm text-ink-muted">{t('plans.single_exam.tagline')}</p>
          <p className="mt-4">
            <span className="font-heading text-4xl font-semibold tracking-tight">{price(PLANS.single_exam.amount)}</span>
            <span className="text-ink-muted"> {t('pricing.perMonthPerExam')}</span>
          </p>
          <FeatureList included={matrix.filter((row) => row.plans.single_exam).map((row) => row.label)} labels={markLabels} />
          <div className="mt-6 flex-1" />
          {hasAll ? (
            <p className="text-sm text-ink-muted">{t('pricing.single.coveredByAll')}</p>
          ) : canBuy ? (
            // A plain GET form: the exam picker works without JavaScript.
            <form action={checkoutAction} method="get" className="space-y-3">
              <input type="hidden" name="plan" value="single_exam" />
              <div>
                <label htmlFor="pricing-exam" className="mb-1.5 block text-sm font-medium">
                  {t('pricing.single.examLabel')}
                </label>
                <select id="pricing-exam" name="exam" defaultValue={exam?.examKey ?? EXAM_CONFIGS[0]?.examKey} className={fieldClass()}>
                  {EXAM_CONFIGS.map((config) => (
                    <option key={config.examKey} value={config.examKey} disabled={ownedExams.has(config.examKey)}>
                      {config.name}
                      {ownedExams.has(config.examKey) ? ` ${t('pricing.single.owned')}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className={buttonClass({ variant: 'secondary', full: true })}>
                {t('pricing.single.cta')}
              </button>
            </form>
          ) : null}
        </Card>

        <Card as="li" padding="lg" className="flex flex-col border-2 border-accent">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-heading text-xl font-semibold">{t('plans.all_access.name')}</h2>
            <Badge tone="accent">{t('pricing.featured')}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-muted">{t('plans.all_access.tagline')}</p>
          <p className="mt-4">
            <span className="font-heading text-4xl font-semibold tracking-tight">{price(PLANS.all_access.amount)}</span>
            <span className="text-ink-muted"> {t('pricing.perMonth')}</span>
          </p>
          <FeatureList included={matrix.filter((row) => row.plans.all_access).map((row) => row.label)} labels={markLabels} />
          <div className="mt-6 flex-1" />
          {hasAll ? (
            <p className="text-sm font-semibold text-positive">{t('pricing.all.owned')}</p>
          ) : canBuy ? (
            <ButtonLink href={`${checkoutPath('all_access')}${exam ? `&source=${encodeURIComponent(exam.examKey)}` : ''}`} full>
              {t('pricing.all.cta')}
            </ButtonLink>
          ) : null}
        </Card>
      </ul>

      <p className="mt-3 text-sm text-ink-muted">{t('plans.vatNote')}</p>
      {canBuy && (!user || user.isGuest) ? <p className="mt-1 text-sm text-ink-muted">{t('pricing.accountNote')}</p> : null}

      <section aria-labelledby="matrix-heading" className="mt-12">
        <h2 id="matrix-heading" className="font-heading text-2xl font-semibold">
          {t('pricing.matrix.heading')}
        </h2>
        <div className="mt-4 overflow-x-auto rounded-card border border-line bg-surface">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <caption className="sr-only">{t('pricing.matrix.caption')}</caption>
            <thead>
              <tr className="border-b border-line bg-surface-sunken">
                <th scope="col" className="px-4 py-3 text-start font-semibold">
                  {t('pricing.matrix.feature')}
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
          {(['currency', 'renewal', 'withdrawal', 'cards'] as const).map((line) => (
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
