'use client';

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import { Link, getPathname } from '@/i18n/navigation';
import { PASS_ACCESS_MONTHS, addCalendarMonths, annualSaving, formatPrice } from '@/lib/billing/plans';
import { Alert, Badge, Button, Card, cx, fieldClass } from '@/components/ui';


import { COUNTRY_CODES } from './countries';
import { billingErrorMessage, countryOptions } from './locale';
import { checkoutPath } from '@/lib/billing/config';
import type { PriceKey } from '@/lib/billing/plans';

/** Branded order review; payment details are collected by Stripe Checkout. */

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
  testMode: boolean;
  offers: CheckoutOffer[];
  initialOffer: string;
  initialExam: string | null;
  sourceExam: string | null;
  returnTo?: string | null;
  /** Every exam, and whether a pass can be bought for it today. */
  exams: Array<{ key: string; name: string; available: boolean }>;
  ownedExamKeys: string[];
  collectCountry: boolean;
}

function newRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function CheckoutForm(props: CheckoutFormProps) {
  const [offer, setOffer] = useState(props.initialOffer);
  const selected = props.offers.find(o => o.key === offer) ?? props.offers[0]!;
  return <CheckoutBody {...props} offer={offer} setOffer={setOffer} selected={selected} />;
}

function CheckoutBody({
  offers,
  offer,
  setOffer,
  selected,
  initialExam,
  sourceExam,
  returnTo,
  exams,
  ownedExamKeys,
  collectCountry,
  testMode,
}: CheckoutFormProps & {
  offer: string;
  setOffer: (offer: string) => void;
  selected: CheckoutOffer;
}) {
  const t = useTranslations('billing');
  const locale = useLocale();
  const id = useId();
  const euros = (cents: number) => formatPrice(cents, locale);
  const buyable = (key: string) => exams.some((e) => e.key === key && e.available) && !ownedExamKeys.includes(key);
  const [exam, setExam] = useState(initialExam && buyable(initialExam) ? initialExam : '');
  const [country, setCountry] = useState('');
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
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
    const nextMonth = addCalendarMonths(today, 1);
    const nextYear = addCalendarMonths(today, 12);
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
    if (examMissing || countryMissing || !consent) {
      // Our own fields say what is wrong, beside each one; move to the first.
      const first = examMissing ? `${id}-exam` : countryMissing ? `${id}-country` : `${id}-consent`;
      document.getElementById(first)?.focus();
      return;
    }
    setBusy(true);

    const response = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({
        offer,
        locale,
        examKey: selected.needsExam ? exam : null,
        sourceExam,
        returnTo,
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
        const next = encodeURIComponent(checkoutPath(offer as PriceKey, selected.needsExam ? exam : null) + (sourceExam ? `&source=${encodeURIComponent(sourceExam)}` : '') + (returnTo ? `&next=${encodeURIComponent(returnTo)}` : ''));
        window.location.assign(getPathname({ href: `/sign-up?next=${next}`, locale }));
        return;
      }
      return fail(billingErrorMessage(t, data?.error, t('form.genericError')), code === 'already-subscribed');
    }

    if (!data?.url) return fail(t('form.genericError'));
    window.location.assign(data.url);
  }

  const periodRow =
    selected.interval === 'once'
      ? t('form.summary.oneTime')
      : selected.interval === 'year'
        ? t('form.summary.yearly')
        : t('form.summary.monthly');

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <form onSubmit={(event) => void submit(event)} noValidate aria-busy={busy} className="space-y-8">
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
          <div className="rounded-control border border-accent-line bg-accent-soft p-5">
            <p className="font-semibold">{t('experience.secureTitle')}</p>
            <p className="mt-2 text-sm text-ink-muted">{t('experience.secureBody')}</p>
          </div>
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

        <Button type="submit" size="lg" full loading={busy} disabled={busy}>
          {busy ? t('form.paying') : t('experience.continue', { price: euros(selected.amount) })}
        </Button>
      </form>

      <aside aria-labelledby={`${id}-summary`} className="lg:sticky lg:top-24 lg:self-start">
        <Card padding="lg" className="border-t-4 border-t-accent shadow-raised">
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
