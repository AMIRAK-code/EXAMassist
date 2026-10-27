import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { redirect } from 'next/navigation';
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

export const metadata: Metadata = {
  title: 'Your account',
  description: 'Your account details, study target, and the controls for exporting or deleting your data.',
  // Private page. Authorization is what protects it; this only keeps it out of
  // search results if a URL ever leaks.
  robots: { index: false, follow: false },
};

const ROLE_LABEL: Record<string, string> = {
  learner: 'Learner',
  editor: 'Editor',
  admin: 'Administrator',
};

/** Interface languages the application ships. The API holds the same allowlist. */
const LOCALE_LABEL: Record<string, string> = { en: 'English' };

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Strings for the plan section of this page; the manager has its own. */
const BILLING_COPY = {
  heading: 'Plans and billing',
  guest: 'A plan needs an account. Create one first; your guest practice comes with you.',
  createAccount: 'Create an account',
  staff: 'Editors and administrators have every exam and feature open, without a plan.',
  cardUpdated: 'Your new card is saved and will be used for every plan.',
  cardFailed: 'The new card was not confirmed. Your previous card is unchanged.',
} as const;

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ card?: string; setup_intent?: string; redirect_status?: string }>;
}) {
  const query = await searchParams;
  // requireUser() is the authorisation check. The lookup before it exists only
  // so a signed-out visitor gets the sign-in page rather than an error screen.
  if (!(await getCurrentUser())) redirect('/sign-in?next=%2Faccount');
  const user = await requireUser();

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
      if (query.redirect_status !== 'succeeded') throw new BillingError('card-not-saved', BILLING_COPY.cardFailed);
      await finishCardUpdate(getDb(), user.id, query.setup_intent);
      cardNotice = { tone: 'positive', message: BILLING_COPY.cardUpdated };
    } catch (error) {
      if (!(error instanceof BillingError)) throw error;
      cardNotice = { tone: 'negative', message: error.message };
    }
  }
  const overview: BillingOverview | null = showBilling && !user.isGuest ? await billingOverview(getDb(), user.id) : null;

  const examOptions = EXAM_CONFIGS.map((config) => ({
    examKey: config.examKey,
    name: config.name,
  }));

  return (
    <Container size="narrow">
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { href: '/dashboard', label: 'Dashboard' }, { label: 'Account' }]} />
      <PageHeader
        eyebrow="Your account"
        title={user.displayName ? `Hello, ${user.displayName}` : 'Your account'}
        lead="What we hold, what you are working towards, and the controls to take your data with you or remove it."
      />

      {user.isGuest ? (
        <Alert tone="caution" title="You are practising as a guest" className="mb-8">
          <p>
            A guest session stores no email address and expires after seven days of not being used.{' '}
            <Link href="/sign-up">Create an account</Link> in this browser to keep the practice,
            bookmarks and review queue you have built up.
          </p>
        </Alert>
      ) : null}

      <section aria-labelledby="details-heading" className="mb-10">
        <h2 id="details-heading" className="mb-4 font-heading text-2xl font-semibold">
          Your details
        </h2>
        <Card>
          <DefinitionList
            items={[
              {
                term: 'Display name',
                value: user.displayName ?? <span className="text-ink-muted">Not set</span>,
              },
              {
                term: 'Email address',
                value: user.email ? (
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="break-all">{user.email}</span>
                    {user.emailVerifiedAt ? (
                      <Badge tone="positive">Confirmed</Badge>
                    ) : emailCodes ? (
                      <>
                        <Badge tone="caution">Not confirmed</Badge>
                        <Link href="/verify-email?next=%2Faccount" className="text-sm">
                          Confirm it
                        </Link>
                      </>
                    ) : null}
                  </span>
                ) : (
                  <span className="text-ink-muted">
                    None — guest accounts store no email address
                  </span>
                ),
              },
              {
                term: 'Account type',
                value: user.isGuest ? (
                  <Badge tone="caution">Guest account</Badge>
                ) : (
                  <Badge tone="positive">Registered account</Badge>
                ),
              },
              { term: 'Role', value: ROLE_LABEL[user.role] ?? user.role },
              { term: 'Interface language', value: LOCALE_LABEL[user.locale] ?? user.locale },
              {
                term: 'Target exam',
                value: targetConfig ? (
                  <Link href={`/practice/${targetConfig.examKey}`}>{targetConfig.name}</Link>
                ) : (
                  <span className="text-ink-muted">Not set</span>
                ),
              },
              {
                term: 'Exam dates',
                value:
                  examDates.length > 0 ? (
                    <ul className="space-y-1">
                      {examDates.map((entry) => (
                        <li key={entry.examKey}>
                          {entry.label}: {entry.date}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-ink-muted">Not set</span>
                  ),
              },
              ...(user.isMinor
                ? [
                    {
                      term: 'Age setting',
                      value:
                        'You told us you are under 16, so optional data collection stays switched off.',
                    },
                  ]
                : []),
            ]}
          />
          {user.locale === 'en' ? (
            <p className="mt-5 border-t border-line pt-4 text-sm text-ink-subtle">
              English is the only interface language we publish at the moment, so there is nothing to
              choose here yet.
            </p>
          ) : null}
        </Card>
      </section>

      <section aria-labelledby="settings-heading" className="mb-10">
        <h2 id="settings-heading" className="mb-4 font-heading text-2xl font-semibold">
          Name and study target
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
            {BILLING_COPY.heading}
          </h2>
          <Card>
            {user.isGuest ? (
              <>
                <p className="text-sm text-ink-muted">{BILLING_COPY.guest}</p>
                <ButtonLink href={`/sign-up?next=${encodeURIComponent('/pricing')}`} className="mt-4">
                  {BILLING_COPY.createAccount}
                </ButtonLink>
              </>
            ) : (
              <>
                {entitlements.isStaff ? <p className="mb-4 text-sm text-ink-muted">{BILLING_COPY.staff}</p> : null}
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
          Your data
        </h2>
        <Card>
          <h3 className="font-heading text-lg font-semibold">Download a copy</h3>
          <p className="mt-2 text-sm text-ink-muted">
            One JSON file with your account details, every practice session and answer, your results,
            bookmarks, review queue, goals and study plans. Nothing else is included, and nobody else&rsquo;s
            data can appear in it.
          </p>
          <div className="mt-4">
            <ExportDataLink />
          </div>

          <h3 className="mt-8 font-heading text-lg font-semibold">Sign out</h3>
          <p className="mt-2 text-sm text-ink-muted">
            Ends this session on this device. Your data stays exactly as it is.
          </p>
          <div className="mt-4">
            <SignOutButton />
          </div>
        </Card>
      </section>

      <section aria-labelledby="delete-heading" className="mb-10">
        <h2 id="delete-heading" className="mb-4 font-heading text-2xl font-semibold">
          Delete your account
        </h2>
        <Card>
          <DeleteAccountForm email={user.email} isGuest={user.isGuest} />
        </Card>
      </section>

      <p className="text-sm text-ink-subtle">
        Our <Link href="/about/privacy">privacy notice</Link> explains what we store and why. If
        something here looks wrong, tell us before you delete anything — a deleted account cannot be
        brought back.
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
