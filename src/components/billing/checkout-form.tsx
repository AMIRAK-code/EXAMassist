'use client';

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { Appearance, Stripe, StripeElementsOptionsMode } from '@stripe/stripe-js';
import { Alert, Badge, Button, Card, cx, fieldClass } from '@/components/ui';
import { appearanceFromDocument, buildAppearance, elementFonts } from './stripe-appearance';
import { stripeFor } from './stripe-loader';
import { COUNTRY_CODES } from './countries';

/**
 * The checkout, on this site's own page.
 *
 * Plan picker, exam picker, order summary, consent and every message are
 * ours. The card fields are Stripe's Payment Element (Stripe's iframes, so card
 * data never reaches our server) styled with the Appearance API from our CSS
 * tokens, so they look like the rest of the form.
 *
 * The Payment Element is shown straight away ("deferred intent"). On Pay:
 *   1. elements.submit() validates the card fields,
 *   2. the server creates the subscription (payment_behavior
 *      'default_incomplete') and returns its client secret,
 *   3. stripe.confirmPayment() (or confirmSetup() when nothing is due now)
 *      completes it, including any 3-D Secure challenge, and the learner
 *      lands on /checkout/complete, our own confirmation page.
 */

/** Every string in this component, for translation. */
const COPY = {
  planLegend: 'Plan',
  examLabel: 'Exam',
  examPlaceholder: 'Choose an exam',
  examOwned: '(your plan)',
  examRequired: 'Choose the exam this plan is for.',
  examHint: 'A single-exam plan covers one exam. You can hold several, one for each exam you are preparing for.',
  countryLabel: 'Country of residence',
  countryPlaceholder: 'Choose your country',
  countryHint: 'Used to apply the right VAT. The price you pay does not change.',
  countryRequired: 'Choose your country.',
  paymentLegend: 'Payment',
  testMode: 'Test mode: use card 4242 4242 4242 4242, any future date and any CVC. For 3-D Secure, use 4000 0027 6000 3184.',
  secure: 'Card details are entered in secure fields provided by Stripe and go straight to Stripe; they never reach our servers.',
  loadingFields: 'Loading the secure card fields…',
  consent:
    'I want my plan to start now. I understand that I lose my 14-day right of withdrawal once access starts.',
  consentTerms: 'Terms of sale',
  consentRequired: 'Please tick this box to continue.',
  pay: 'Pay {price} and start',
  paying: 'Processing payment…',
  errorTitle: 'The payment did not go through',
  networkError: 'We could not reach the server. Check your connection and try again. Nothing was charged.',
  genericError: 'Something went wrong. Nothing was charged; please try again.',
  alreadySubscribed: 'Manage your plans',
  summary: {
    heading: 'Order summary',
    plan: 'Plan',
    exam: 'Exam',
    examNone: 'Not chosen yet',
    monthly: 'Monthly price',
    vat: 'VAT',
    vatIncluded: 'Included',
    vatByCountry: 'Included, at your country’s rate',
    dueToday: 'Due today',
    then: 'Then {price} every month from {date}, until you cancel.',
    cancel: 'Cancel any time from your account. Your plan stays on until the end of the month you paid for.',
  },
} as const;

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

const euros = (cents: number) => `€${(cents / 100).toFixed(2)}`;

export interface CheckoutPlanOption {
  key: string;
  name: string;
  tagline: string;
  perPeriod: string;
  amount: number;
  needsExam: boolean;
}

export interface CheckoutFormProps {
  publishableKey: string;
  testMode: boolean;
  plans: CheckoutPlanOption[];
  initialPlan: string;
  initialExam: string | null;
  sourceExam: string | null;
  exams: Array<{ key: string; name: string }>;
  ownedExamKeys: string[];
  email: string;
  name: string | null;
  collectCountry: boolean;
}

function newRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function CheckoutForm(props: CheckoutFormProps) {
  const [stripe, setStripe] = useState<Promise<Stripe | null> | null>(null);
  const [appearance, setAppearance] = useState<Appearance>(() => buildAppearance());
  const [origin, setOrigin] = useState('');
  const [plan, setPlan] = useState(props.initialPlan);
  const selected = props.plans.find((p) => p.key === plan) ?? props.plans[0]!;

  // Stripe.js and the token values exist only in the browser.
  useEffect(() => {
    setAppearance(appearanceFromDocument());
    setOrigin(window.location.origin);
    setStripe(stripeFor(props.publishableKey));
  }, [props.publishableKey]);

  const options = useMemo<StripeElementsOptionsMode>(
    () => ({
      mode: 'subscription',
      amount: selected.amount,
      currency: 'eur',
      paymentMethodTypes: ['card'],
      appearance,
      fonts: origin ? elementFonts(origin) : [],
      locale: 'en',
    }),
    [selected.amount, appearance, origin],
  );

  return (
    <Elements stripe={stripe} options={options}>
      <CheckoutBody {...props} plan={plan} setPlan={setPlan} selected={selected} origin={origin} ready={Boolean(stripe)} />
    </Elements>
  );
}

function CheckoutBody({
  plans,
  plan,
  setPlan,
  selected,
  initialExam,
  sourceExam,
  exams,
  ownedExamKeys,
  email,
  name,
  collectCountry,
  testMode,
  origin,
  ready,
}: CheckoutFormProps & {
  plan: string;
  setPlan: (plan: string) => void;
  selected: CheckoutPlanOption;
  origin: string;
  ready: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const id = useId();
  const [exam, setExam] = useState(initialExam && !ownedExamKeys.includes(initialExam) ? initialExam : '');
  const [country, setCountry] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [elementReady, setElementReady] = useState(false);
  const [error, setError] = useState<{ message: string; manage?: boolean } | null>(null);
  const [touched, setTouched] = useState(false);
  const [requestId] = useState(newRequestId);
  const errorRef = useRef<HTMLDivElement>(null);

  const examMissing = selected.needsExam && !exam;
  const countryMissing = collectCountry && !country;
  const examName = exams.find((e) => e.key === exam)?.name;
  const renewsOn = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }, []);
  const countries = useMemo(() => {
    if (!collectCountry) return [];
    const names = new Intl.DisplayNames(['en'], { type: 'region' });
    return COUNTRY_CODES.map((code) => ({ code, name: names.of(code) ?? code })).sort((a, b) => a.name.localeCompare(b.name, 'en'));
  }, [collectCountry]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  function fail(message: string, manage = false) {
    setBusy(false);
    setError({ message, manage });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setTouched(true);
    setError(null);
    if (!stripe || !elements) return;
    if (examMissing || countryMissing || !consent) {
      // Our own fields say what is wrong, beside each one; move to the first.
      const first = examMissing ? `${id}-exam` : countryMissing ? `${id}-country` : `${id}-consent`;
      document.getElementById(first)?.focus();
      return;
    }
    setBusy(true);

    // 1. Validate the card fields before anything is created.
    const submitted = await elements.submit();
    if (submitted.error) {
      setBusy(false);
      return; // Stripe shows the field error inside the element.
    }

    // 2. The subscription, created by our server.
    const response = await fetch('/api/billing/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({
        plan,
        examKey: selected.needsExam ? exam : null,
        sourceExam,
        consent: true,
        requestId,
        country: collectCountry ? country : null,
      }),
    }).catch(() => null);
    if (!response) return fail(COPY.networkError);
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const code = data?.error?.code;
      if (code === 'unauthorized' || code === 'account-required') {
        window.location.assign(`/sign-up?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      return fail(data?.error?.message ?? COPY.genericError, code === 'already-subscribed');
    }

    // 3. Confirm with Stripe, 3-D Secure included. Card payments finish here
    //    without leaving the page; anything that needs a redirect comes back
    //    to the same confirmation page.
    const returnUrl = `${origin}/checkout/complete?subscription=${encodeURIComponent(data.subscriptionId)}`;
    const billingDetails = { email, ...(name ? { name } : {}) };
    if (data.intent === 'payment' && data.clientSecret) {
      const result = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: { return_url: returnUrl, payment_method_data: { billing_details: billingDetails } },
        redirect: 'if_required',
      });
      if (result.error) return fail(result.error.message ?? COPY.genericError);
    } else if (data.intent === 'setup' && data.clientSecret) {
      const result = await stripe.confirmSetup({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: { return_url: returnUrl, payment_method_data: { billing_details: billingDetails } },
        redirect: 'if_required',
      });
      if (result.error) return fail(result.error.message ?? COPY.genericError);
    }
    window.location.assign(returnUrl);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <form onSubmit={(event) => void submit(event)} noValidate className="space-y-8">
        {error ? (
          <div ref={errorRef} tabIndex={-1} className="outline-none">
            <Alert tone="negative" role="alert" title={COPY.errorTitle}>
              <p>{error.message}</p>
              {error.manage ? (
                <p className="mt-2">
                  <a href="/account#billing">{COPY.alreadySubscribed}</a>
                </p>
              ) : null}
            </Alert>
          </div>
        ) : null}

        <fieldset>
          <legend className="mb-3 font-heading text-lg font-semibold">{COPY.planLegend}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {plans.map((option) => {
              const checked = option.key === plan;
              return (
                <label
                  key={option.key}
                  className={cx(
                    'relative flex cursor-pointer flex-col rounded-control border-[1.5px] bg-surface p-4 transition-colors',
                    'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
                    checked ? 'border-accent bg-accent-soft/60' : 'border-line-strong hover:border-ink',
                  )}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={option.key}
                    checked={checked}
                    onChange={() => setPlan(option.key)}
                    disabled={busy}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-heading text-base font-semibold">{option.name}</span>
                    <span
                      aria-hidden="true"
                      className={cx(
                        'grid size-5 shrink-0 place-items-center rounded-full border-[1.5px]',
                        checked ? 'border-accent bg-accent' : 'border-line-strong bg-surface',
                      )}
                    >
                      {checked ? <span className="size-2 rounded-full bg-accent-contrast" /> : null}
                    </span>
                  </span>
                  <span className="mt-1 text-sm">
                    <span className="font-semibold">{euros(option.amount)}</span>{' '}
                    <span className="text-ink-muted">{option.perPeriod}</span>
                  </span>
                  <span className="mt-2 text-sm text-ink-muted">{option.tagline}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {selected.needsExam ? (
          <div>
            <label htmlFor={`${id}-exam`} className="mb-1.5 block text-sm font-medium">
              {COPY.examLabel}
            </label>
            <select
              id={`${id}-exam`}
              value={exam}
              onChange={(event) => setExam(event.target.value)}
              disabled={busy}
              aria-invalid={touched && examMissing ? true : undefined}
              aria-describedby={`${id}-exam-hint${touched && examMissing ? ` ${id}-exam-error` : ''}`}
              className={fieldClass()}
            >
              <option value="">{COPY.examPlaceholder}</option>
              {exams.map((option) => {
                const owned = ownedExamKeys.includes(option.key);
                return (
                  <option key={option.key} value={option.key} disabled={owned}>
                    {option.name}
                    {owned ? ` ${COPY.examOwned}` : ''}
                  </option>
                );
              })}
            </select>
            <p id={`${id}-exam-hint`} className="mt-1.5 text-sm text-ink-muted">
              {COPY.examHint}
            </p>
            {touched && examMissing ? (
              <p id={`${id}-exam-error`} className="mt-1.5 text-sm text-negative">
                {COPY.examRequired}
              </p>
            ) : null}
          </div>
        ) : null}

        {collectCountry ? (
          <div>
            <label htmlFor={`${id}-country`} className="mb-1.5 block text-sm font-medium">
              {COPY.countryLabel}
            </label>
            <select
              id={`${id}-country`}
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              disabled={busy}
              autoComplete="country"
              aria-invalid={touched && countryMissing ? true : undefined}
              aria-describedby={`${id}-country-hint${touched && countryMissing ? ` ${id}-country-error` : ''}`}
              className={fieldClass()}
            >
              <option value="">{COPY.countryPlaceholder}</option>
              {countries.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
            <p id={`${id}-country-hint`} className="mt-1.5 text-sm text-ink-muted">
              {COPY.countryHint}
            </p>
            {touched && countryMissing ? (
              <p id={`${id}-country-error`} className="mt-1.5 text-sm text-negative">
                {COPY.countryRequired}
              </p>
            ) : null}
          </div>
        ) : null}

        <fieldset>
          <legend className="mb-3 font-heading text-lg font-semibold">{COPY.paymentLegend}</legend>
          {testMode ? <p className="mb-4 rounded-card bg-surface-sunken p-3 text-sm text-ink-muted">{COPY.testMode}</p> : null}
          {/* Holds the height of the fields while they load, so nothing below jumps. */}
          <div className="relative min-h-[11rem]">
            {!elementReady ? (
              <p className="absolute inset-0 text-sm text-ink-muted" aria-live="polite">
                {COPY.loadingFields}
              </p>
            ) : null}
            {ready ? (
              <PaymentElement
                onReady={() => setElementReady(true)}
                options={{
                  layout: 'tabs',
                  fields: { billingDetails: { email: 'never' } },
                  defaultValues: { billingDetails: { email, ...(name ? { name } : {}) } },
                  wallets: { applePay: 'auto', googlePay: 'auto' },
                }}
              />
            ) : null}
          </div>
          <p className="mt-3 text-xs text-ink-subtle">{COPY.secure}</p>
        </fieldset>

        <div>
          <label htmlFor={`${id}-consent`} className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              id={`${id}-consent`}
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              disabled={busy}
              required
              aria-invalid={touched && !consent ? true : undefined}
              aria-describedby={touched && !consent ? `${id}-consent-error` : undefined}
              className="mt-0.5 size-5 shrink-0 accent-[var(--color-accent)]"
            />
            <span>
              {COPY.consent}{' '}
              <a href="/about/terms#sale" target="_blank" rel="noopener">
                {COPY.consentTerms}
              </a>
            </span>
          </label>
          {touched && !consent ? (
            <p id={`${id}-consent-error`} className="mt-1.5 ps-8 text-sm text-negative">
              {COPY.consentRequired}
            </p>
          ) : null}
        </div>

        <Button type="submit" size="lg" full loading={busy} disabled={!stripe || !elements || !elementReady}>
          {busy ? COPY.paying : fill(COPY.pay, { price: euros(selected.amount) })}
        </Button>
      </form>

      <aside aria-labelledby={`${id}-summary`} className="lg:sticky lg:top-24 lg:self-start">
        <Card padding="lg">
          <h2 id={`${id}-summary`} className="font-heading text-lg font-semibold">
            {COPY.summary.heading}
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <SummaryRow term={COPY.summary.plan} value={<Badge tone="accent">{selected.name}</Badge>} />
            {selected.needsExam ? (
              <SummaryRow term={COPY.summary.exam} value={examName ?? <span className="text-ink-muted">{COPY.summary.examNone}</span>} />
            ) : null}
            <SummaryRow term={COPY.summary.monthly} value={euros(selected.amount)} />
            <SummaryRow term={COPY.summary.vat} value={collectCountry ? COPY.summary.vatByCountry : COPY.summary.vatIncluded} />
          </dl>
          <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-line pt-4">
            <span className="font-semibold">{COPY.summary.dueToday}</span>
            <span className="font-heading text-2xl font-semibold tabular-nums">{euros(selected.amount)}</span>
          </div>
          <p className="mt-3 text-sm text-ink-muted">{fill(COPY.summary.then, { price: euros(selected.amount), date: renewsOn })}</p>
          <p className="mt-2 text-sm text-ink-muted">{COPY.summary.cancel}</p>
        </Card>
      </aside>
    </div>
  );
}

function SummaryRow({ term, value }: { term: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-muted">{term}</dt>
      <dd className="text-end font-medium">{value}</dd>
    </div>
  );
}
