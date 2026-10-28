import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/i18n/navigation';
import { pageAlternates } from '@/i18n/alternates';
import { LOCALE_INFO, type Locale } from '@/i18n/locales';
import { getCurrentUser, requireUser } from '@/lib/auth/session';
import { emailCodesMailer } from '@/lib/auth/email-codes';
import { getDb } from '@/lib/db';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';
import { listExamTargets } from '@/lib/learning/queries';
import { examLabel } from '@/lib/learning/dashboard';
import { Breadcrumbs, Alert, Badge, ButtonLink, Card, Container, DefinitionList, PageHeader } from '@/components/ui';
import { billingSettings, pricingPath } from '@/lib/billing/config';
import { grantIsLive, loadEntitlements, toGrant } from '@/lib/billing/entitlements';
import { PLANS, PLAN_COPY } from '@/lib/billing/plans';
import { BillingError, billingOverview, finishCardUpdate, type BillingOverview } from '@/lib/billing/service';
import { SubscriptionManager, type ManagedSubscription } from '@/components/billing/subscription-manager';
import {
  AccountSettingsForm,
  DeleteAccountForm,
  ExportDataLink,
  SignOutButton,
} from './account-actions';

export const dynamic = 'force-dynamic';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'account.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: (await pageAlternates(params, '/account')),
    // Private page. Authorization is what protects it; this only keeps it out of
    // search results if a URL ever leaks.
    robots: { index: false, follow: false },
  };
}

const ROLE_KEYS = new Set(['learner', 'editor', 'admin']);

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ card?: string; setup_intent?: string; redirect_status?: string }>;
}) {
  const locale = (await params).locale as Locale;
  const t = await getTranslations('account');
  const format = await getFormatter();
  const query = await searchParams;
  // requireUser() is the authorisation check. The lookup before it exists only
  // so a signed-out visitor gets the sign-in page rather than an error screen.
  if (!(await getCurrentUser())) return redirect({ href: '/sign-in?next=%2Faccount', locale });
  const user = await requireUser();

  function formatDate(value: string | null): string | null {
    if (!value) return null;
    const parsed = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) return value;
    return format.dateTime(parsed, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }

  const targetConfig = user.targetExamKey ? getExamConfig(user.targetExamKey) : undefined;
  // Offer to confirm the address only where this deployment can send the code.
  const emailCodes = emailCodesMailer() !== null;
  // The one exam date per exam (migration 007), beside each goal.
  const examDates = (await listExamTargets(getDb(), user.id))
    .filter((target) => target.targetDate && getExamConfig(target.examKey))
    .map((target) => ({ examKey: target.examKey, label: examLabel(target.examKey), date: formatDate(target.targetDate)! }));

  // Plans: shown wherever billing is on or Stripe keys are set.
  const settings = billingSettings();
  const showBilling = settings.enforced || settings.configured;
  const entitlements = await loadEntitlements(getDb(), user.id);
  let cardNotice: { tone: 'positive' | 'negative'; message: string } | null = null;
  if (showBilling && !user.isGuest && query.card === 'updated' && typeof query.setup_intent === 'string') {
    // Back from a 3-D Secure redirect while replacing the card: finish it here.
    try {
      if (query.redirect_status !== 'succeeded') throw new BillingError('card-not-saved', t('billing.cardFailed'));
      await finishCardUpdate(getDb(), user.id, query.setup_intent);
      cardNotice = { tone: 'positive', message: t('billing.cardUpdated') };
    } catch (error) {
      if (!(error instanceof BillingError)) throw error;
      // The card was not saved, whatever Stripe's reason: say so in the learner's language.
      cardNotice = { tone: 'negative', message: error.code === 'card-not-saved' ? t('billing.cardFailed') : error.message };
    }
  }
  const overview: BillingOverview | null = showBilling && !user.isGuest ? await billingOverview(getDb(), user.id) : null;

  // Exam names are data from the exam configs and stay as published.
  const examOptions = EXAM_CONFIGS.map((config) => ({
    examKey: config.examKey,
    name: config.name,
  }));

  const notSet = <span className="text-ink-muted">{t('details.notSet')}</span>;

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[
          { href: '/', label: t('breadcrumbs.home') },
          { href: '/dashboard', label: t('breadcrumbs.dashboard') },
          { label: t('breadcrumbs.account') },
        ]}
      />
      <PageHeader
        eyebrow={t('header.eyebrow')}
        title={user.displayName ? t('header.greeting', { name: user.displayName }) : t('header.title')}
        lead={t('header.lead')}
      />

      {user.isGuest ? (
        <Alert tone="caution" title={t('guest.title')} className="mb-8">
          <p>{t.rich('guest.body', { link: (chunks) => <Link href="/sign-up">{chunks}</Link> })}</p>
        </Alert>
      ) : null}

      <section aria-labelledby="details-heading" className="mb-10">
        <h2 id="details-heading" className="mb-4 font-heading text-2xl font-semibold">
          {t('details.heading')}
        </h2>
        <Card>
          <DefinitionList
            items={[
              {
                term: t('details.displayName'),
                value: user.displayName ?? notSet,
              },
              {
                term: t('details.email'),
                value: user.email ? (
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="break-all">{user.email}</span>
                    {user.emailVerifiedAt ? (
                      <Badge tone="positive">{t('details.confirmed')}</Badge>
                    ) : emailCodes ? (
                      <>
                        <Badge tone="caution">{t('details.notConfirmed')}</Badge>
                        <Link href="/verify-email?next=%2Faccount" className="text-sm">
                          {t('details.confirmIt')}
                        </Link>
                      </>
                    ) : null}
                  </span>
                ) : (
                  <span className="text-ink-muted">{t('details.noEmail')}</span>
                ),
              },
              {
                term: t('details.accountType'),
                value: user.isGuest ? (
                  <Badge tone="caution">{t('details.guestAccount')}</Badge>
                ) : (
                  <Badge tone="positive">{t('details.registeredAccount')}</Badge>
                ),
              },
              { term: t('details.role'), value: ROLE_KEYS.has(user.role) ? t(`roles.${user.role}`) : user.role },
              // The language this page is shown in, which the language menu changes.
              { term: t('details.interfaceLanguage'), value: LOCALE_INFO[locale]?.nativeName ?? locale },
              {
                term: t('details.targetExam'),
                value: targetConfig ? (
                  <Link href={`/practice/${targetConfig.examKey}`}>{targetConfig.name}</Link>
                ) : (
                  notSet
                ),
              },
              {
                term: t('details.examDates'),
                value:
                  examDates.length > 0 ? (
                    <ul className="space-y-1">
                      {examDates.map((entry) => (
                        <li key={entry.examKey}>{t('details.examDate', { exam: entry.label, date: entry.date })}</li>
                      ))}
                    </ul>
                  ) : (
                    notSet
                  ),
              },
              ...(user.isMinor ? [{ term: t('details.ageSetting'), value: t('details.minor') }] : []),
            ]}
          />
          <p className="mt-5 border-t border-line pt-4 text-sm text-ink-subtle">{t('details.languageNote')}</p>
        </Card>
      </section>

      <section aria-labelledby="settings-heading" className="mb-10">
        <h2 id="settings-heading" className="mb-4 font-heading text-2xl font-semibold">
          {t('settings.heading')}
        </h2>
        <Card>
          <AccountSettingsForm
            examOptions={examOptions}
            initialDisplayName={user.displayName ?? ''}
            initialTargetExamKey={user.targetExamKey ?? ''}
          />
        </Card>
      </section>

      {showBilling ? (
        <section id="billing" aria-labelledby="billing-heading" className="mb-10 scroll-mt-24">
          <h2 id="billing-heading" className="mb-4 font-heading text-2xl font-semibold">
            {t('billing.heading')}
          </h2>
          <Card>
            {user.isGuest ? (
              <>
                <p className="text-sm text-ink-muted">{t('billing.guest')}</p>
                <ButtonLink href={`/sign-up?next=${encodeURIComponent('/pricing')}`} className="mt-4">
                  {t('billing.createAccount')}
                </ButtonLink>
              </>
            ) : (
              <>
                {entitlements.isStaff ? <p className="mb-4 text-sm text-ink-muted">{t('billing.staff')}</p> : null}
                <SubscriptionManager
                  subscriptions={(overview?.subscriptions ?? []).map(toManaged)}
                  card={overview?.card ?? null}
                  cardFresh={overview?.fresh ?? false}
                  publishableKey={settings.publishableKey}
                  pricingHref={pricingPath(user.targetExamKey)}
                  canManage={settings.configured}
                  initialNotice={cardNotice}
                />
              </>
            )}
          </Card>
        </section>
      ) : null}

      <section aria-labelledby="data-heading" className="mb-10">
        <h2 id="data-heading" className="mb-4 font-heading text-2xl font-semibold">
          {t('data.heading')}
        </h2>
        <Card>
          <h3 className="font-heading text-lg font-semibold">{t('data.downloadHeading')}</h3>
          <p className="mt-2 text-sm text-ink-muted">{t('data.downloadBody')}</p>
          <div className="mt-4">
            <ExportDataLink />
          </div>

          <h3 className="mt-8 font-heading text-lg font-semibold">{t('data.signOutHeading')}</h3>
          <p className="mt-2 text-sm text-ink-muted">{t('data.signOutBody')}</p>
          <div className="mt-4">
            <SignOutButton />
          </div>
        </Card>
      </section>

      <section aria-labelledby="delete-heading" className="mb-10">
        <h2 id="delete-heading" className="mb-4 font-heading text-2xl font-semibold">
          {t('delete.heading')}
        </h2>
        <Card>
          <DeleteAccountForm email={user.email} isGuest={user.isGuest} />
        </Card>
      </section>

      <p className="text-sm text-ink-subtle">
        {t.rich('footer', { link: (chunks) => <Link href="/about/privacy">{chunks}</Link> })}
      </p>
    </Container>
  );
}

/** A stored subscription, as the plan manager shows it. */
function toManaged(row: BillingOverview['subscriptions'][number]): ManagedSubscription {
  const grant = toGrant(row);
  return {
    id: row.stripe_subscription_id,
    planName: PLAN_COPY.plans[row.plan].name,
    examName: row.exam_key ? (getExamConfig(row.exam_key)?.name ?? row.exam_key) : null,
    status: row.status,
    live: grantIsLive(grant),
    // A subscription on an earlier price (LEGACY_LOOKUP_KEYS) shows no current price.
    amount: row.price_lookup_key === PLANS[row.plan].lookupKey ? PLANS[row.plan].amount : null,
    periodEnd: row.current_period_end,
    cancelAtPeriodEnd: grant.cancelAtPeriodEnd,
    changeable: ['active', 'trialing', 'past_due'].includes(row.status),
  };
}
