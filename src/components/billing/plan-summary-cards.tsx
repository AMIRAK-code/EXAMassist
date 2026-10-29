import { useLocale, useTranslations } from 'next-intl';
import { Badge, Card } from '@/components/ui';
import { PRICES, annualSaving, formatPrice } from '@/lib/billing/plans';

/**
 * The two plans on sale, side by side, for exam pages that sell them: the
 * Single Exam Pass (paid once, six months, one exam) and Plus (monthly or
 * yearly, every exam, the full yearly charge shown). Prices come from
 * plans.ts and words from the `billing` catalogue, so they always match the
 * pricing page and the checkout.
 */
export function PlanSummaryCards({ className }: { className?: string }) {
  const t = useTranslations('billing');
  const locale = useLocale();
  const price = (cents: number) => formatPrice(cents, locale);
  const saving = annualSaving();
  return (
    <div className={className}>
      <ul className="grid max-w-3xl gap-4 sm:grid-cols-2" aria-label={t('pricing.eyebrow')}>
        <Card as="li" padding="lg" className="border-2 border-accent">
          <h3 className="font-heading text-xl font-semibold">{t('plans.exam_pass.name')}</h3>
          <p className="mt-3">
            <span className="font-heading text-4xl font-semibold tracking-tight">{price(PRICES.exam_pass.amount)}</span>
            <span className="text-ink-muted"> {t('pricing.pass.once')}</span>
          </p>
          <p className="mt-1 text-sm text-ink-muted">{t('pricing.pass.term')}</p>
        </Card>
        <Card as="li" padding="lg">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-heading text-xl font-semibold">{t('plans.plus.name')}</h3>
            <Badge tone="accent">{t('pricing.plus.badge')}</Badge>
          </div>
          <p className="mt-3">
            <span className="font-heading text-4xl font-semibold tracking-tight">{price(PRICES.plus_month.amount)}</span>
            <span className="text-ink-muted"> {t('pricing.perMonth')}</span>
          </p>
          <p className="mt-1">
            <span className="font-heading text-2xl font-semibold tracking-tight">{price(PRICES.plus_year.amount)}</span>
            <span className="text-ink-muted"> {t('pricing.perYear')}</span>
          </p>
          <p className="mt-1 text-sm text-ink-muted">{t('pricing.plus.yearlySaving', { percent: saving.percent })}</p>
          <p className="mt-1 text-sm text-ink-muted">{t('plans.plus.tagline')}</p>
        </Card>
      </ul>
      <p className="mt-3 max-w-3xl text-sm text-ink-muted">{t('plans.summaryNote')}</p>
    </div>
  );
}
