'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { Appearance } from '@stripe/stripe-js';
import { Alert, Badge, Button, ButtonLink, Card } from '@/components/ui';
import { appearanceFromDocument, buildAppearance, elementFonts } from './stripe-appearance';
import { stripeFor } from './stripe-loader';

/**
 * The learner's plans, managed on our own account page: no hosted Stripe
 * pages. Cancel at the end of the paid month, undo that, and replace the card
 * through a SetupIntent confirmed in the same styled Payment Element as the
 * checkout. The server re-checks ownership of everything it is asked to change.
 */

/** Every string in this component, for translation. */
const COPY = {
  none: 'You have no plan. Guides, sample questions and a diagnostic for every exam are free.',
  seePlans: 'See plans',
  addPlan: 'Add a plan',
  price: '{price} a month, VAT included',
  renews: 'Renews on {date}',
  ends: 'Ends on {date}; it will not renew',
  accessUntil: 'Access until {date}',
  statuses: {
    active: 'Active',
    trialing: 'Active',
    past_due: 'Payment failed: retrying',
    unpaid: 'Unpaid',
    paused: 'Paused',
    canceled: 'Ended',
    incomplete: 'Waiting for payment',
    incomplete_expired: 'Checkout expired',
  } as Record<string, string>,
  pastDue:
    'The last renewal payment did not go through. Stripe will try again over the next days; your access continues meanwhile. Update your card to pay now.',
  cancel: 'Cancel at end of period',
  cancelConfirm: 'Cancel this plan? It stays on until {date} and is not charged again.',
  cancelYes: 'Yes, cancel',
  cancelNo: 'Keep my plan',
  resume: 'Keep my plan',
  working: 'Saving…',
  changeFailed: 'That could not be changed just now. Please try again.',
  cancelled: 'Your plan will end on {date}. You can undo this until then.',
  resumed: 'Your plan will renew as usual.',
  card: {
    heading: 'Payment card',
    none: 'No card on file.',
    summary: '{brand} ending in {last4}, expires {month}/{year}',
    stale: 'The card details could not be loaded just now.',
    update: 'Update card',
    save: 'Save card',
    saving: 'Saving card…',
    cancel: 'Cancel',
    loading: 'Loading the secure card fields…',
    secure: 'Card details go straight to Stripe in secure fields; they never reach our servers.',
    saved: 'Your new card is saved and will be used for every plan.',
    retried: 'We charged the new card for the renewal that had failed.',
    failed: 'The card could not be saved. Your previous card is unchanged.',
    network: 'We could not reach the server. Your previous card is unchanged.',
  },
  history: 'Earlier plans',
} as const;

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

export interface ManagedSubscription {
  id: string;
  planName: string;
  examName: string | null;
  status: string;
  /** Gives access now. */
  live: boolean;
  /** Null for a subscription on an earlier price. */
  amount: number | null;
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

const euros = (cents: number) => `€${(cents / 100).toFixed(2)}`;
const day = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

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
  const router = useRouter();
  const [notice, setNotice] = useState(initialNotice);
  const current = subscriptions.filter((s) => s.live || s.status === 'past_due');
  const past = subscriptions.filter((s) => !current.includes(s) && s.status !== 'incomplete' && s.status !== 'incomplete_expired');

  return (
    <div className="space-y-5">
      {notice ? (
        <Alert tone={notice.tone} role="status">
          <p>{notice.message}</p>
        </Alert>
      ) : null}

      {current.length === 0 ? (
        <div>
          <p className="text-sm text-ink-muted">{COPY.none}</p>
          <ButtonLink href={pricingHref} className="mt-4">
            {COPY.seePlans}
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
          <a href={pricingHref}>{COPY.addPlan}</a>
        </p>
      ) : null}

      {canManage && publishableKey && (current.length > 0 || card) ? (
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
          <summary className="cursor-pointer font-semibold">{COPY.history}</summary>
          <ul className="mt-2 space-y-1 text-ink-muted">
            {past.map((subscription) => (
              <li key={subscription.id}>
                {subscription.planName}
                {subscription.examName ? `, ${subscription.examName}` : ''}: {COPY.statuses[subscription.status] ?? subscription.status}
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
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const end = subscription.periodEnd ? day(subscription.periodEnd) : '';

  async function change(cancelAtPeriodEnd: boolean) {
    setBusy(true);
    setError(null);
    const result = await send(`/api/billing/subscriptions/${encodeURIComponent(subscription.id)}`, 'PATCH', { cancelAtPeriodEnd });
    setBusy(false);
    setConfirming(false);
    if (!result.ok) {
      setError(result.data?.error?.message ?? COPY.changeFailed);
      return;
    }
    onChanged(cancelAtPeriodEnd ? fill(COPY.cancelled, { date: end }) : COPY.resumed);
  }

  return (
    <Card as="li" className="bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-semibold">
            {subscription.planName}
            {subscription.examName ? <span className="font-normal text-ink-muted">: {subscription.examName}</span> : null}
          </h3>
          {subscription.amount !== null ? (
            <p className="mt-1 text-sm text-ink-muted">{fill(COPY.price, { price: euros(subscription.amount) })}</p>
          ) : null}
          {end ? (
            <p className="mt-1 text-sm">
              {subscription.status === 'past_due'
                ? fill(COPY.accessUntil, { date: end })
                : subscription.cancelAtPeriodEnd
                  ? fill(COPY.ends, { date: end })
                  : fill(COPY.renews, { date: end })}
            </p>
          ) : null}
        </div>
        <Badge tone={subscription.status === 'past_due' ? 'caution' : subscription.cancelAtPeriodEnd ? 'neutral' : 'positive'}>
          {COPY.statuses[subscription.status] ?? subscription.status}
        </Badge>
      </div>

      {subscription.status === 'past_due' ? (
        <Alert tone="caution" className="mt-4">
          <p>{COPY.pastDue}</p>
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
              {busy ? COPY.working : COPY.resume}
            </Button>
          ) : confirming ? (
            <div role="group" aria-label={COPY.cancel}>
              <p className="text-sm">{fill(COPY.cancelConfirm, { date: end })}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="danger" size="sm" loading={busy} onClick={() => void change(true)}>
                  {busy ? COPY.working : COPY.cancelYes}
                </Button>
                <Button variant="secondary" size="sm" disabled={busy} onClick={() => setConfirming(false)}>
                  {COPY.cancelNo}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="quiet" size="sm" onClick={() => setConfirming(true)}>
              {COPY.cancel}
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
    if (!result.reached) return setError(COPY.card.network);
    if (!result.ok || !result.data?.clientSecret) return setError(result.data?.error?.message ?? COPY.card.failed);
    setClientSecret(result.data.clientSecret);
  }

  return (
    <section aria-labelledby="card-heading" className="border-t border-line pt-5">
      <h3 id="card-heading" className="font-heading text-base font-semibold">
        {COPY.card.heading}
      </h3>
      <p className="mt-1 text-sm text-ink-muted">
        {card
          ? fill(COPY.card.summary, {
              brand: card.brand.charAt(0).toUpperCase() + card.brand.slice(1),
              last4: card.last4,
              month: String(card.expMonth).padStart(2, '0'),
              year: String(card.expYear),
            })
          : fresh
            ? COPY.card.none
            : COPY.card.stale}
      </p>
      {error ? (
        <Alert tone="negative" role="alert" className="mt-3">
          <p>{error}</p>
        </Alert>
      ) : null}
      {clientSecret && origin ? (
        <Elements stripe={stripeFor(publishableKey)} options={{ clientSecret, appearance, fonts: elementFonts(origin), locale: 'en' }}>
          <CardForm
            origin={origin}
            onCancel={() => setClientSecret(null)}
            onSaved={(message) => {
              setClientSecret(null);
              onSaved(message);
            }}
          />
        </Elements>
      ) : (
        <Button variant="secondary" size="sm" className="mt-3" loading={opening} onClick={() => void open()}>
          {COPY.card.update}
        </Button>
      )}
    </section>
  );
}

function CardForm({ origin, onCancel, onSaved }: { origin: string; onCancel: () => void; onSaved: (message: string) => void }) {
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
      // page, which finishes the change (src/app/account/page.tsx).
      confirmParams: { return_url: `${origin}/account?card=updated#billing` },
      redirect: 'if_required',
    });
    if (result.error) {
      setBusy(false);
      setError(result.error.message ?? COPY.card.failed);
      return;
    }
    const saved = await send('/api/billing/payment-method', 'POST', { setupIntentId: result.setupIntent.id });
    setBusy(false);
    if (!saved.ok) {
      setError(saved.data?.error?.message ?? COPY.card.failed);
      return;
    }
    onSaved(saved.data?.retried > 0 ? `${COPY.card.saved} ${COPY.card.retried}` : COPY.card.saved);
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
            {COPY.card.loading}
          </p>
        ) : null}
        <PaymentElement onReady={() => setReady(true)} options={{ layout: 'tabs' }} />
      </div>
      <p className="text-xs text-ink-subtle">{COPY.card.secure}</p>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="sm" loading={busy} disabled={!ready}>
          {busy ? COPY.card.saving : COPY.card.save}
        </Button>
        <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={onCancel}>
          {COPY.card.cancel}
        </Button>
      </div>
    </form>
  );
}
