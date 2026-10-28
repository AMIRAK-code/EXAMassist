import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ButtonLink, Card, cx } from '@/components/ui';
import { checkoutPath, freeTestPath, pricingPath } from '@/lib/billing/config';
import { PLANS, PLAN_KEYS, formatPrice, type Feature } from '@/lib/billing/plans';

/**
 * What a learner sees in place of a feature their plan does not include: what
 * it is, which plans open it, and the free diagnostic as the way to try first.
 * Rendered by the server; links only, so it works without JavaScript. Its
 * words are in the `billing` catalogue (`upgrade.*`, `plans.*`).
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
  const plans = PLAN_KEYS.filter((key) => PLANS[key].features.includes(feature)).sort((a, b) => PLANS[a].amount - PLANS[b].amount);
  const only = plans.length === 1 ? plans[0] : null;
  return (
    <Card padding="lg" className={cx('border-2 border-accent', className)}>
      <p className="eyebrow">{t('upgrade.eyebrow')}</p>
      <Heading className="mt-2 font-heading text-xl font-semibold">
        {t(`upgrade.titles.${feature}`, { hasExam: examName ? 'yes' : 'no', exam: examName ?? '' })}
      </Heading>
      {t.has(`upgrade.leads.${feature}`) ? <p className="mt-2 text-ink-muted">{t(`upgrade.leads.${feature}`)}</p> : null}
      <ul className="mt-4 space-y-1 text-sm">
        {plans.map((key) => (
          <li key={key}>
            {t('upgrade.planLine', {
              plan: t(`plans.${key}.name`),
              price: formatPrice(PLANS[key].amount, locale),
              period: t(`plans.${key}.perPeriod`),
            })}
          </li>
        ))}
      </ul>
      <p className="mt-1 text-xs text-ink-subtle">{t('plans.vatNote')}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {only ? (
          <ButtonLink href={checkoutPath(only, PLANS[only].scope === 'one-exam' ? examKey : null)}>
            {t('upgrade.choosePlan', { plan: t(`plans.${only}.name`) })}
          </ButtonLink>
        ) : (
          <ButtonLink href={pricingPath(examKey, feature)}>{t('upgrade.seePlans')}</ButtonLink>
        )}
        {offerDiagnostic && examKey && feature !== 'ai_tutor' ? (
          <Link href={freeTestPath(examKey)} className="text-sm font-semibold">
            {t('upgrade.freeDiagnostic')}
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
