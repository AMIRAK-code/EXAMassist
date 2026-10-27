import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { languageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getCurrentUser } from '@/lib/auth/session';
import { getDb } from '@/lib/db';
import { getExamConfig } from '@/lib/exams/registry';
import { checkoutPath, pricingPath } from '@/lib/billing/config';
import { grantIsLive, toGrant } from '@/lib/billing/entitlements';
import { BillingError, syncSubscriptionForUser } from '@/lib/billing/service';
import type { SubscriptionRow } from '@/lib/billing/store';
import { Alert, Breadcrumbs, ButtonLink, Card, Container, PageHeader } from '@/components/ui';

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'billing.complete.meta' });
  return {
    title: t('title'),
    robots: { index: false, follow: false },
    alternates: languageAlternates('/checkout/complete', locale as Locale),
  };
}

type Query = { subscription?: string; redirect_status?: string };
type State = 'processing' | 'pending' | 'failed' | 'expired';

export default async function CheckoutCompletePage({ params, searchParams }: { params: Params; searchParams: Promise<Query> }) {
  const { locale } = await params;
  const query = await searchParams;
  const t = await getTranslations({ locale, namespace: 'billing' });
  const format = await getFormatter({ locale });
  const formatDay = (iso: string) =>
    format.dateTime(new Date(iso), { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const subscriptionId = typeof query.subscription === 'string' && /^sub_[A-Za-z0-9]+$/.test(query.subscription) ? query.subscription : null;
  const here = `/checkout/complete${subscriptionId ? `?subscription=${subscriptionId}` : ''}`;
  const user = await getCurrentUser();
  if (!user) return redirect({ href: `/sign-in?next=${encodeURIComponent(here)}`, locale });

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
    { href: '/', label: t('crumbs.home') },
    { href: pricingPath(row?.exam_key), label: t('crumbs.pricing') },
    { label: t('crumbs.confirmation') },
  ];

  if (!row) {
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

  const exam = row.exam_key ? getExamConfig(row.exam_key) : undefined;
  const planName = t(`plans.${row.plan}.name`);
  const retryHref = checkoutPath(row.plan, row.exam_key);
  const live = grantIsLive(toGrant(row));
  const state: State | 'success' = live
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
          eyebrow={t('complete.eyebrow')}
          title={t('complete.success.title')}
          lead={
            exam
              ? t('complete.success.leadExam', { plan: planName, exam: exam.name })
              : t('complete.success.lead', { plan: planName })
          }
        />
        <Alert tone="positive" role="status" className="mb-6">
          {row.current_period_end ? <p>{t('complete.success.renews', { date: formatDay(row.current_period_end) })}</p> : null}
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
            <ButtonLink href={retryHref} variant={state === 'pending' ? 'secondary' : 'primary'}>
              {t(`complete.${state}.retry`)}
            </ButtonLink>
          ) : null}
        </div>
      </Card>
      <p className="mt-6 text-sm">
        <Link href={pricingPath(row.exam_key)}>{t('complete.pricing')}</Link>
      </p>
    </Container>
  );
}
