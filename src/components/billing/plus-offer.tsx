'use client';

import { useState, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ButtonLink, cx } from '@/components/ui';
import { checkoutPath } from '@/lib/billing/config';
import { annualSaving, formatPrice, PRICES } from '@/lib/billing/plans';

/** Native radio inputs provide arrow-key navigation without a custom tab widget. */
export function PlusOffer({ children, canBuy, owned, source }: {
  children: ReactNode; canBuy: boolean; owned: boolean; source: string;
}) {
  const [interval, setInterval] = useState<'month' | 'year'>('year');
  const locale = useLocale();
  const t = useTranslations('billing');
  const offer = interval === 'year' ? PRICES.plus_year : PRICES.plus_month;
  const price = formatPrice(offer.amount, locale);
  return <>
    <fieldset className="mt-5 grid grid-cols-2 gap-1 rounded-control bg-surface-sunken p-1">
      <legend className="sr-only">{t('experience.billingPeriod')}</legend>
      {(['month', 'year'] as const).map(value => <label key={value} className={cx(
        'cursor-pointer rounded-sm px-3 py-2 text-center text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
        interval === value ? 'bg-surface text-ink shadow-card' : 'text-ink-muted',
      )}>
        <input className="sr-only" type="radio" name="plus-interval" checked={interval === value} onChange={() => setInterval(value)} />
        {t(`experience.${value}`)}
      </label>)}
    </fieldset>
    <div className="mt-5 min-h-32" aria-live="polite" aria-atomic="true">
      <p><span className="font-heading text-5xl font-semibold tracking-tight">{price}</span><span className="text-ink-muted"> {t(interval === 'year' ? 'pricing.perYear' : 'pricing.perMonth')}</span></p>
      <p className="mt-2 text-sm font-semibold">{t(interval === 'year' ? 'form.summary.yearly' : 'form.offers.plus')}</p>
      {interval === 'year' ? <p className="mt-2 text-sm text-positive">{t('pricing.plus.yearlySaving', { percent: annualSaving().percent })}</p> : null}
    </div>
    {children}
    <div className="mt-6 flex-1" />
    {owned ? <p className="text-sm font-semibold text-positive">{t('pricing.plus.owned')}</p> : canBuy ? <ButtonLink full href={`${checkoutPath(offer.key)}${source}`}>
      {t(interval === 'year' ? 'pricing.plus.ctaYearly' : 'pricing.plus.ctaMonthly', { price })}
    </ButtonLink> : null}
    <p className="mt-3 text-xs text-ink-muted">{t('experience.renewal')}</p>
  </>;
}
