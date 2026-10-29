'use client';

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { Appearance, Stripe, StripeElementsOptionsMode } from '@stripe/stripe-js';
import { useLocale, useTranslations } from 'next-intl';
import { Link, getPathname, usePathname } from '@/i18n/navigation';
import { PASS_ACCESS_MONTHS, addCalendarMonths, annualSaving, formatPrice } from '@/lib/billing/plans';
import { Alert, Badge, Button, Card, cx, fieldClass } from '@/components/ui';
import { appearanceFromDocument, buildAppearance, elementFonts } from './stripe-appearance';
import { stripeFor } from './stripe-loader';
import { COUNTRY_CODES } from './countries';
import { billingErrorMessage, countryOptions, stripeLocale } from './locale';

/**
 * The checkout, on this site's own page.
 *
 * Offer picker, exam picker, order summary, consent and every message are
 * ours, from the `billing` catalogue (`form.*`). The card fields are Stripe's
 * Payment Element (Stripe's iframes, so card data never reaches our server)
 * styled with the Appearance API from our CSS tokens, so they look like the
 * rest of the form, and told the page's language so Stripe's own labels and
 * errors match it.
 *
 * The Payment Element is shown straight away ("deferred intent": 'payment'
 * mode for the Single Exam Pass, 'subscription' mode for Plus). On Pay:
 *   1. elements.submit() validates the card fields,
 *   2. the server creates the purchase (the pass invoice, or the Plus
 *      subscription with payment_behavior 'default_incomplete') and returns
 *      its client secret; the server alone decides whether it may be sold,
 *   3. stripe.confirmPayment() (or confirmSetup() when nothing is due now)
 *      completes it, including any 3-D Secure challenge, and the learner
 *      lands on /checkout/complete, our own confirmation page, which asks
 *      Stripe (on the server) whether the payment went through.
 */

export interface CheckoutOffer {
  /** A price key from plans.ts (OFFERS). */
  key: string;
  name: string;
  tagline: string;
  amount: number;
  interval: 'once' | 'month' | 'year';
  needsExam: boolean;
}

export interface CheckoutFormProps {
  publishableKey: string;
  testMode: boolean;
  offers: CheckoutOffer[];
  initialOffer: string;
  initialExam: string | null;
  sourceExam: string | null;
  /** Every exam, and whether a pass can be bought for it today. */
  exams: Array<{ key: string; name: string; available: boolean }>;
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
  const locale = useLocale();
  const [stripe, setStripe] = useState<Promise<Stripe | null> | null>(null);
  const [appearance, setAppearance] = useState<Appearance>(() => buildAppearance());
  const [origin, setOrigin] = useState('');
  const [offer, setOffer] = useState(props.initialOffer);
  const selected = props.offers.find((o) => o.key === offer) ?? props.offers[0]!;

  // Stripe.js and the token values exist only in the browser.
  useEffect(() => {
    setAppearance(appearanceFromDocument());
    setOrigin(window.location.origin);
    setStripe(stripeFor(props.publishableKey));
  }, [props.publishableKey]);

  const options = useMemo<StripeElementsOptionsMode>(
    () => ({
      // A pass is paid once; Plus is a subscription. Elements is updated in place when this changes.
      mode: selected.interval === 'once' ? 'payment' : 'subscription',
      amount: selected.amount,
      currency: 'eur',
      paymentMethodTypes: ['card'],
      appearance,
      fonts: origin ? elementFonts(origin) : [],
      locale: stripeLocale(locale),
    }),
    [selected.interval, selected.amount, appearance, origin, locale],
  );

  return (
    <Elements stripe={stripe} options={options}>
      <CheckoutBody {...props} offer={offer} setOffer={setOffer} selected={selected} origin={origin} ready={Boolean(stripe)} />
    </Elements>
  );
}

function CheckoutBody({
  offers,
  offer,
  setOffer,
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
  offer: string;
  setOffer: (offer: string) => void;
  selected: CheckoutOffer;
  origin: string;
  ready: boolean;
}) {
  const t = useTranslations('billing');
  const locale = useLocale();
  const pathname = usePathname();
  const stripe = useStripe();
  const elements = useElements();
  const id = useId();
  const euros = (cents: number) => formatPrice(cents, locale);
  const buyable = (key: string) => exams.some((e) => e.key === key && e.available) && !ownedExamKeys.includes(key);
  const [exam, setExam] = useState(initialExam && buyable(initialExam) ? initialExam : '');
  const [country, setCountry] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [elementReady, setElementReady] = useState(false);
  const [error, setError] = useState<{ message: string; manage?: boolean } | null>(null);
  const [touched, setTouched] = useState(false);
  const [requestId] = useState(newRequestId);
  const errorRef = useRef<HTMLDivElement>(null);
  const saving = annualSaving();

  const examMissing = selected.needsExam && !exam;
  const countryMissing = collectCountry && !country;
  const examName = exams.find((e) => e.key === exam)?.name;
  const initialUnavailable = Boolean(initialExam && selected.needsExam && !buyable(initialExam));
  const day = (date: Date) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  const dates = useMemo(() => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return { nextMonth, nextYear, passEnds: addCalendarMonths(today, PASS_ACCESS_MONTHS) };
  }, []);
  const countries = useMemo(
    () => (collectCountry ? countryOptions(COUNTRY_CODES, locale) : []),
    [collectCountry, locale],
  );

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

    // 2. The purchase, created by our server, which decides whether it may be sold.
    const response = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({
        offer,
        examKey: selected.needsExam ? exam : null,
        sourceExam,
        consent: true,
        requestId,
        country: collectCountry ? country : null,
      }),
    }).catch(() => null);
    if (!response) return fail(t('form.networkError'));
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const code = data?.error?.code;
      if (code === 'unauthorized' || code === 'account-required') {
        // `next` is the path without the language prefix; sign-up adds it back.
        const next = encodeURIComponent(pathname + window.location.search);
        window.location.assign(getPathname({ href: `/sign-up?next=${next}`, locale }));
        return;
      }
      return fail(billingErrorMessage(t, data?.error, t('form.genericError')), code === 'already-subscribed');
    }

    // 3. Confirm with Stripe, 3-D Secure included. Card payments finish here
    //    without leaving the page; anything that needs a redirect comes back
    //    to the same confirmation page.
    const param = data.kind === 'pass' ? 'pass' : 'subscription';
    const returnUrl = `${origin}${getPathname({
      href: `/checkout/complete?${param}=${encodeURIComponent(data.id)}`,
      locale,
    })}`;
    const billingDetails = { email, ...(name ? { name } : {}) };
    if (data.intent === 'payment' && data.clientSecret) {
      const result = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: { return_url: returnUrl, payment_method_data: { billing_details: billingDetails } },
        redirect: 'if_required',
      });
      if (result.error) return fail(result.error.message ?? t('form.genericError'));
    } else if (data.intent === 'setup' && data.clientSecret) {
      const result = await stripe.confirmSetup({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: { return_url: returnUrl, payment_method_data: { billing_details: billingDetails } },
        redirect: 'if_required',
      });
      if (result.error) return fail(result.error.message ?? t('form.genericError'));
    }
    window.location.assign(returnUrl);
  }

  const periodRow =
    selected.interval === 'once'
      ? t('form.summary.oneTime')
      : selected.interval === 'year'
        ? t('form.summary.yearly')
        : t('form.summary.monthly');

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <form onSubmit={(event) => void submit(event)} noValidate className="space-y-8">
        {error ? (
          <div ref={errorRef} tabIndex={-1} className="outline-none">
            <Alert tone="negative" role="alert" title={t('form.errorTitle')}>
              <p>{error.message}</p>
              {error.manage ? (
                <p className="mt-2">
                  <Link href="/account#billing">{t('form.alreadySubscribed')}</Link>
                </p>
              ) : null}
            </Alert>
          </div>
        ) : null}

        <fieldset>
          <legend className="mb-3 font-heading text-lg font-semibold">{t('form.planLegend')}</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {offers.map((option) => {
              const checked = option.key === offer;
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
                    name="offer"
                    value={option.key}
                    checked={checked}
                    onChange={() => setOffer(option.key)}
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
                  <span className="mt-1 text-sm font-semibold">{t(`prices.${option.key}`, { price: euros(option.amount) })}</span>
                  {option.interval === 'year' ? (
                    <span className="mt-1 text-sm text-positive">{t('pricing.plus.yearlySaving', { percent: saving.percent })}</span>
                  ) : null}
                  <span className="mt-2 text-sm text-ink-muted">
                    {option.interval === 'once' ? t('form.offers.pass') : t('form.offers.plus')}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {selected.needsExam ? (
          <div>
            <label htmlFor={`${id}-exam`} className="mb-1.5 block text-sm font-medium">
              {t('form.examLabel')}
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
              <option value="">{t('form.examPlaceholder')}</option>
              {exams.map((option) => {
                const owned = ownedExamKeys.includes(option.key);
                return (
                  <option key={option.key} value={option.key} disabled={owned || !option.available}>
                    {option.name}
                    {owned ? ` ${t('form.examOwned')}` : !option.available ? ` ${t('form.examUnavailable')}` : ''}
                  </option>
                );
              })}
            </select>
            <p id={`${id}-exam-hint`} className="mt-1.5 text-sm text-ink-muted">
              {t('form.examHint')}
            </p>
            {initialUnavailable && !exam ? (
              <p className="mt-1.5 text-sm text-caution">{t('form.examInitialUnavailable')}</p>
            ) : null}
            {touched && examMissing ? (
              <p id={`${id}-exam-error`} className="mt-1.5 text-sm text-negative">
                {t('form.examRequired')}
              </p>
            ) : null}
          </div>
        ) : null}

        {collectCountry ? (
          <div>
            <label htmlFor={`${id}-country`} className="mb-1.5 block text-sm font-medium">
              {t('form.countryLabel')}
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
              <option value="">{t('form.countryPlaceholder')}</option>
              {countries.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
            <p id={`${id}-country-hint`} className="mt-1.5 text-sm text-ink-muted">
              {t('form.countryHint')}
            </p>
            {touched && countryMissing ? (
              <p id={`${id}-country-error`} className="mt-1.5 text-sm text-negative">
                {t('form.countryRequired')}
              </p>
            ) : null}
          </div>
        ) : null}

        <fieldset>
          <legend className="mb-3 font-heading text-lg font-semibold">{t('form.paymentLegend')}</legend>
          {testMode ? <p className="mb-4 rounded-card bg-surface-sunken p-3 text-sm text-ink-muted">{t('form.testMode')}</p> : null}
          {/* Holds the height of the fields while they load, so nothing below jumps. */}
          <div className="relative min-h-[11rem]">
            {!elementReady ? (
              <p className="absolute inset-0 text-sm text-ink-muted" aria-live="polite">
                {t('form.loadingFields')}
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
          <p className="mt-3 text-xs text-ink-subtle">{t('form.secure')}</p>
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
              {t('form.consent')}{' '}
              <Link href="/about/terms#sale" target="_blank" rel="noopener">
                {t('form.consentTerms')}
                <span className="sr-only"> {t('form.consentTermsNewTab')}</span>
              </Link>
            </span>
          </label>
          {touched && !consent ? (
            <p id={`${id}-consent-error`} className="mt-1.5 ps-8 text-sm text-negative">
              {t('form.consentRequired')}
            </p>
          ) : null}
        </div>

        <Button type="submit" size="lg" full loading={busy} disabled={!stripe || !elements || !elementReady}>
          {busy ? t('form.paying') : t('form.pay', { price: euros(selected.amount) })}
        </Button>
      </form>

      <aside aria-labelledby={`${id}-summary`} className="lg:sticky lg:top-24 lg:self-start">
        <Card padding="lg">
          <h2 id={`${id}-summary`} className="font-heading text-lg font-semibold">
            {t('form.summary.heading')}
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <SummaryRow term={t('form.summary.plan')} value={<Badge tone="accent">{selected.name}</Badge>} />
            {selected.needsExam ? (
              <SummaryRow
                term={t('form.summary.exam')}
                value={examName ?? <span className="text-ink-muted">{t('form.summary.examNone')}</span>}
              />
            ) : null}
            <SummaryRow term={periodRow} value={euros(selected.amount)} />
            <SummaryRow
              term={t('form.summary.vat')}
              value={collectCountry ? t('form.summary.vatByCountry') : t('form.summary.vatIncluded')}
            />
          </dl>
          <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-line pt-4">
            <span className="font-semibold">{t('form.summary.dueToday')}</span>
            <span className="font-heading text-2xl font-semibold tabular-nums">{euros(selected.amount)}</span>
          </div>
          {selected.interval === 'once' ? (
            <>
              <p className="mt-3 text-sm text-ink-muted">{t('form.summary.passTerm', { date: day(dates.passEnds) })}</p>
              <p className="mt-2 text-sm text-ink-muted">{t('form.summary.passNoRenewal')}</p>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-ink-muted">
                {selected.interval === 'year'
                  ? t('form.summary.thenYearly', { price: euros(selected.amount), date: day(dates.nextYear) })
                  : t('form.summary.thenMonthly', { price: euros(selected.amount), date: day(dates.nextMonth) })}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{t('form.summary.cancel')}</p>
            </>
          )}
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
