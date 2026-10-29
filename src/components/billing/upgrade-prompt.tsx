import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ButtonLink, Card, cx } from '@/components/ui';
import { checkoutPath, freeTestPath, pricingPath } from '@/lib/billing/config';
import { PLANS, PRICES, formatPrice, type Feature } from '@/lib/billing/plans';

/**
 * What a learner sees in place of a feature their plan does not include: what
 * it is, which plans on sale open it, and the free diagnostic as the way to
 * try first. The AI tutor is in no plan on sale (Premium is coming soon), so
 * for it the prompt says so instead of offering anything to buy. Rendered by
 * the server; links only, so it works without JavaScript. Its words are in
 * the `billing` catalogue (`upgrade.*`, `plans.*`).
 */

export function UpgradePrompt({
  feature,
  examKey = null,
  examName,
  className,
  headingLevel = 2,
  offerDiagnostic = true,
}: {
  feature: Feature;
  examKey?: string | null;
  /** Short name of the exam, for the heading. */
  examName?: string;
  className?: string;
  headingLevel?: 2 | 3;
  /** Link to the free diagnostic for this exam. */
  offerDiagnostic?: boolean;
}) {
  const t = useTranslations('billing');
  const locale = useLocale();
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const price = (cents: number) => formatPrice(cents, locale);
  const pass = PLANS.exam_pass.status === 'on-sale' && PLANS.exam_pass.features.includes(feature);
  const plus = PLANS.plus.status === 'on-sale' && PLANS.plus.features.includes(feature);
  const nothingOnSale = !pass && !plus;
  return (
    <Card padding="lg" className={cx('border-2 border-accent', className)}>
      <p className="eyebrow">{nothingOnSale ? t('upgrade.eyebrowSoon') : t('upgrade.eyebrow')}</p>
      <Heading className="mt-2 font-heading text-xl font-semibold">
        {t(`upgrade.titles.${feature}`, { hasExam: examName ? 'yes' : 'no', exam: examName ?? '' })}
      </Heading>
      {t.has(`upgrade.leads.${feature}`) ? <p className="mt-2 text-ink-muted">{t(`upgrade.leads.${feature}`)}</p> : null}
      {nothingOnSale ? (
        <p className="mt-4 text-sm">{t('upgrade.tutorComingSoon')}</p>
      ) : (
        <>
          <ul className="mt-4 space-y-1 text-sm">
            {pass ? (
              <li>{t('upgrade.passLine', { plan: t('plans.exam_pass.name'), price: price(PRICES.exam_pass.amount) })}</li>
            ) : null}
            {plus ? (
              <li>
                {t('upgrade.plusLine', {
                  plan: t('plans.plus.name'),
                  monthly: price(PRICES.plus_month.amount),
                  yearly: price(PRICES.plus_year.amount),
                })}
              </li>
            ) : null}
          </ul>
          <p className="mt-1 text-xs text-ink-subtle">{t('plans.vatNote')}</p>
        </>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {pass && examKey ? (
          <ButtonLink href={checkoutPath('exam_pass', examKey)}>{t('upgrade.choosePlan', { plan: t('plans.exam_pass.name') })}</ButtonLink>
        ) : null}
        <ButtonLink href={pricingPath(examKey, feature)} variant={pass && examKey ? 'secondary' : 'primary'}>
          {t('upgrade.seePlans')}
        </ButtonLink>
        {offerDiagnostic && examKey && feature !== 'ai_tutor' ? (
          <Link href={freeTestPath(examKey)} className="text-sm font-semibold">
            {t('upgrade.freeDiagnostic')}
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
