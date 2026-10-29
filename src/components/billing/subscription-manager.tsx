'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, getPathname, useRouter } from '@/i18n/navigation';
import { formatPrice } from '@/lib/billing/plans';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { Appearance } from '@stripe/stripe-js';
import { Alert, Badge, Button, ButtonLink, Card } from '@/components/ui';
import { appearanceFromDocument, buildAppearance, elementFonts } from './stripe-appearance';
import { stripeFor } from './stripe-loader';
import { billingErrorMessage, stripeLocale } from './locale';

/**
 * The learner's plans, managed on our own account page: no hosted Stripe
 * pages. A Single Exam Pass shows its exam and the date its access ends (it
 * was paid once, so there is nothing to cancel). A subscription can be
 * cancelled at the end of the paid period, resumed, and paid with a new card
 * through a SetupIntent confirmed in the same styled Payment Element as the
 * checkout. The server re-checks ownership of everything it is asked to change.
 * Its words are in the `billing` catalogue (`manager.*`).
 */

export interface ManagedSubscription {
  id: string;
  /** A renewing subscription, or a Single Exam Pass paid once. */
  kind: 'subscription' | 'pass';
  /** The plan's key ('plus', 'exam_pass', 'legacyPremium', …): its name is then shown in the page's language. */
  plan?: string;
  /** Shown when `plan` is not given or not a known plan. */
  planName: string;
  /** A plan no longer sold, kept with its benefits and price until it ends. */
  earlier: boolean;
  examName: string | null;
  status: string;
  /** Gives access now. */
  live: boolean;
  /** Null for a subscription on a price from before the current catalogue. */
  amount: number | null;
  interval: 'once' | 'month' | 'year' | null;
  /** Renewal or end of the paid period (subscription); end of access (pass). */
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  changeable: boolean;
}

export interface ManagedCard {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

/** "12 November 2026", in the page's language; dates are stored in UTC. */
function useDay(): (iso: string) => string {
  const locale = useLocale();
  return (iso) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));
}

/** The plan's name in the page's language, when the plan is one of ours. */
function usePlanName(): (subscription: ManagedSubscription) => string {
  const t = useTranslations('billing');
  return (subscription) =>
    subscription.plan && t.has(`plans.${subscription.plan}.name`) ? t(`plans.${subscription.plan}.name`) : subscription.planName;
}

async function send(url: string, method: 'POST' | 'PATCH', body: unknown) {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
    body: JSON.stringify(body),
  }).catch(() => null);
  const data = response ? await response.json().catch(() => null) : null;
  return { ok: Boolean(response?.ok), data, reached: Boolean(response) };
}

export function SubscriptionManager({
  subscriptions,
  card,
  cardFresh,
  publishableKey,
  pricingHref,
  canManage,
  initialNotice,
}: {
  subscriptions: ManagedSubscription[];
  card: ManagedCard | null;
  cardFresh: boolean;
  publishableKey: string | null;
  pricingHref: string;
  /** Stripe is reachable from this deployment (keys set). */
  canManage: boolean;
  /** A message carried back from a 3-D Secure redirect. */
  initialNotice: { tone: 'positive' | 'negative'; message: string } | null;
}) {
  const t = useTranslations('billing');
  const day = useDay();
  const planName = usePlanName();
  const router = useRouter();
  const [notice, setNotice] = useState(initialNotice);
  const current = subscriptions.filter((s) => s.live || (s.kind === 'subscription' && s.status === 'past_due'));
  const hidden = new Set(['incomplete', 'incomplete_expired', 'pending', 'void']);
  const past = subscriptions.filter((s) => !current.includes(s) && !hidden.has(s.status));
  const renewing = current.some((s) => s.kind === 'subscription');

  return (
    <div className="space-y-5">
      {notice ? (
        <Alert tone={notice.tone} role="status">
          <p>{notice.message}</p>
        </Alert>
      ) : null}

      {current.length === 0 ? (
        <div>
          <p className="text-sm text-ink-muted">{t('manager.none')}</p>
          <ButtonLink href={pricingHref} className="mt-4">
            {t('manager.seePlans')}
          </ButtonLink>
        </div>
      ) : (
        <ul className="space-y-4">
          {current.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              canManage={canManage}
              onChanged={(message) => {
                setNotice({ tone: 'positive', message });
                router.refresh();
              }}
            />
          ))}
        </ul>
      )}

      {current.length > 0 ? (
        <p className="text-sm">
          <Link href={pricingHref}>{t('manager.addPlan')}</Link>
        </p>
      ) : null}

      {canManage && publishableKey && (renewing || card) ? (
        <CardSection
          card={card}
          fresh={cardFresh}
          publishableKey={publishableKey}
          onSaved={(message) => {
            setNotice({ tone: 'positive', message });
            router.refresh();
          }}
        />
      ) : null}

      {past.length > 0 ? (
        <details className="text-sm">
          <summary className="cursor-pointer font-semibold">{t('manager.history')}</summary>
          <ul className="mt-2 space-y-1 text-ink-muted">
            {past.map((subscription) => (
              <li key={subscription.id}>
                {planName(subscription)}
                {subscription.examName ? `, ${subscription.examName}` : ''}: {statusLabel(t, subscription.status)}
                {subscription.periodEnd ? `, ${day(subscription.periodEnd)}` : ''}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

function SubscriptionCard({
  subscription,
  canManage,
  onChanged,
}: {
  subscription: ManagedSubscription;
  canManage: boolean;
  onChanged: (message: string) => void;
}) {
  const t = useTranslations('billing');
  const locale = useLocale();
  const day = useDay();
  const planName = usePlanName();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const end = subscription.periodEnd ? day(subscription.periodEnd) : '';

  if (subscription.kind === 'pass') {
    return (
      <Card as="li" className="bg-surface">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading text-lg font-semibold">
              {planName(subscription)}
              {subscription.examName ? <span className="font-normal text-ink-muted">: {subscription.examName}</span> : null}
            </h3>
            {subscription.amount !== null ? (
              <p className="mt-1 text-sm text-ink-muted">{t('manager.prices.once', { price: formatPrice(subscription.amount, locale) })}</p>
            ) : null}
            {end ? <p className="mt-1 text-sm font-medium">{t('manager.passUntil', { date: end })}</p> : null}
            <p className="mt-1 text-sm text-ink-muted">{t('manager.passNoRenewal')}</p>
          </div>
          <Badge tone="positive">{statusLabel(t, subscription.status)}</Badge>
        </div>
      </Card>
    );
  }

  async function change(cancelAtPeriodEnd: boolean) {
    setBusy(true);
    setError(null);
    const result = await send(`/api/billing/subscriptions/${encodeURIComponent(subscription.id)}`, 'PATCH', { cancelAtPeriodEnd });
    setBusy(false);
    setConfirming(false);
    if (!result.ok) {
      setError(billingErrorMessage(t, result.data?.error, t('manager.changeFailed')));
      return;
    }
    onChanged(cancelAtPeriodEnd ? t('manager.cancelled', { date: end }) : t('manager.resumed'));
  }

  return (
    <Card as="li" className="bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-semibold">
            {planName(subscription)}
            {subscription.examName ? <span className="font-normal text-ink-muted">: {subscription.examName}</span> : null}
          </h3>
          {subscription.amount !== null ? (
            <p className="mt-1 text-sm text-ink-muted">
              {t(subscription.interval === 'year' ? 'manager.prices.year' : 'manager.prices.month', {
                price: formatPrice(subscription.amount, locale),
              })}
            </p>
          ) : null}
          {subscription.earlier ? <p className="mt-1 text-sm text-ink-muted">{t('manager.earlierNote')}</p> : null}
          {end ? (
            <p className="mt-1 text-sm">
              {subscription.status === 'past_due'
                ? t('manager.accessUntil', { date: end })
                : subscription.cancelAtPeriodEnd
                  ? t('manager.ends', { date: end })
                  : t('manager.renews', { date: end })}
            </p>
          ) : null}
        </div>
        <Badge tone={subscription.status === 'past_due' ? 'caution' : subscription.cancelAtPeriodEnd ? 'neutral' : 'positive'}>
          {statusLabel(t, subscription.status)}
        </Badge>
      </div>

      {subscription.status === 'past_due' ? (
        <Alert tone="caution" className="mt-4">
          <p>{t('manager.pastDue')}</p>
        </Alert>
      ) : null}

      {error ? (
        <Alert tone="negative" role="alert" className="mt-4">
          <p>{error}</p>
        </Alert>
      ) : null}

      {canManage && subscription.changeable ? (
        <div className="mt-4 border-t border-line pt-4">
          {subscription.cancelAtPeriodEnd ? (
            <Button variant="secondary" size="sm" loading={busy} onClick={() => void change(false)}>
              {busy ? t('manager.working') : t('manager.resume')}
            </Button>
          ) : confirming ? (
            <div role="group" aria-label={t('manager.cancel')}>
              <p className="text-sm">{t('manager.cancelConfirm', { date: end })}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="danger" size="sm" loading={busy} onClick={() => void change(true)}>
                  {busy ? t('manager.working') : t('manager.cancelYes')}
                </Button>
                <Button variant="secondary" size="sm" disabled={busy} onClick={() => setConfirming(false)}>
                  {t('manager.cancelNo')}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="quiet" size="sm" onClick={() => setConfirming(true)}>
              {t('manager.cancel')}
            </Button>
          )}
        </div>
      ) : null}
    </Card>
  );
}

function CardSection({
  card,
  fresh,
  publishableKey,
  onSaved,
}: {
  card: ManagedCard | null;
  fresh: boolean;
  publishableKey: string;
  onSaved: (message: string) => void;
}) {
  const t = useTranslations('billing');
  const locale = useLocale();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appearance, setAppearance] = useState<Appearance>(() => buildAppearance());
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setAppearance(appearanceFromDocument());
    setOrigin(window.location.origin);
  }, []);

  async function open() {
    setOpening(true);
    setError(null);
    const result = await send('/api/billing/setup-intent', 'POST', {});
    setOpening(false);
    if (!result.reached) return setError(t('manager.card.network'));
    if (!result.ok || !result.data?.clientSecret) {
      return setError(billingErrorMessage(t, result.data?.error, t('manager.card.failed')));
    }
    setClientSecret(result.data.clientSecret);
  }

  return (
    <section aria-labelledby="card-heading" className="border-t border-line pt-5">
      <h3 id="card-heading" className="font-heading text-base font-semibold">
        {t('manager.card.heading')}
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        {card
          ? t('manager.card.summary', {
              brand: card.brand.charAt(0).toUpperCase() + card.brand.slice(1),
              last4: card.last4,
              month: String(card.expMonth).padStart(2, '0'),
              year: String(card.expYear),
            })
          : fresh
            ? t('manager.card.none')
            : t('manager.card.stale')}
      </p>
      {error ? (
        <Alert tone="negative" role="alert" className="mt-3">
          <p>{error}</p>
        </Alert>
      ) : null}
      {clientSecret && origin ? (
        <Elements stripe={stripeFor(publishableKey)} options={{ clientSecret, appearance, fonts: elementFonts(origin), locale: stripeLocale(locale) }}>
          <CardForm
            origin={origin}
            locale={locale}
            onCancel={() => setClientSecret(null)}
            onSaved={(message) => {
              setClientSecret(null);
              onSaved(message);
            }}
          />
        </Elements>
      ) : (
        <Button variant="secondary" size="sm" className="mt-3" loading={opening} onClick={() => void open()}>
          {t('manager.card.update')}
        </Button>
      )}
    </section>
  );
}

function CardForm({
  origin,
  locale,
  onCancel,
  onSaved,
}: {
  origin: string;
  locale: string;
  onCancel: () => void;
  onSaved: (message: string) => void;
}) {
  const t = useTranslations('billing');
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements || busy) return;
    setBusy(true);
    setError(null);
    const result = await stripe.confirmSetup({
      elements,
      // A card that needs a redirect for 3-D Secure comes back to the account
      // page, in the same language, which finishes the change
      // (src/app/[locale]/account/page.tsx).
      confirmParams: { return_url: `${origin}${getPathname({ href: '/account?card=updated#billing', locale })}` },
      redirect: 'if_required',
    });
    if (result.error) {
      setBusy(false);
      setError(result.error.message ?? t('manager.card.failed'));
      return;
    }
    const saved = await send('/api/billing/payment-method', 'POST', { setupIntentId: result.setupIntent.id });
    setBusy(false);
    if (!saved.ok) {
      setError(billingErrorMessage(t, saved.data?.error, t('manager.card.failed')));
      return;
    }
    onSaved(saved.data?.retried > 0 ? t('manager.card.savedAndRetried') : t('manager.card.saved'));
  }

  return (
    <form onSubmit={(event) => void save(event)} className="mt-4 space-y-4">
      {error ? (
        <div ref={errorRef} tabIndex={-1} className="outline-none">
          <Alert tone="negative" role="alert">
            <p>{error}</p>
          </Alert>
        </div>
      ) : null}
      <div className="relative min-h-[11rem]">
        {!ready ? (
          <p className="absolute inset-0 text-sm text-ink-muted" aria-live="polite">
            {t('manager.card.loading')}
          </p>
        ) : null}
        <PaymentElement onReady={() => setReady(true)} options={{ layout: 'tabs' }} />
      </div>
      <p className="text-xs text-ink-subtle">{t('manager.card.secure')}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" loading={busy} disabled={!ready}>
          {busy ? t('manager.card.saving') : t('manager.card.save')}
        </Button>
        <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={onCancel}>
          {t('manager.card.cancel')}
        </Button>
      </div>
    </form>
  );
}

/** A subscription status in the page's language; a status Stripe adds later shows as Stripe names it. */
function statusLabel(t: ReturnType<typeof useTranslations<'billing'>>, status: string): string {
  return t.has(`manager.statuses.${status}`) ? t(`manager.statuses.${status}`) : status;
}
