import Link from 'next/link';
import { ButtonLink, Card, cx } from '@/components/ui';
import { checkoutPath, freeTestPath, pricingPath } from '@/lib/billing/config';
import { PLANS, PLAN_COPY, PLAN_KEYS, formatPrice, type Feature } from '@/lib/billing/plans';

/**
 * What a learner sees in place of a feature their plan does not include: what
 * it is, which plans open it, and the free diagnostic as the way to try first.
 * Rendered by the server; links only, so it works without JavaScript.
 */

const COPY = {
  eyebrow: 'Part of a paid plan',
  titles: {
    practice: 'Practise {exam} as often as you need',
    timed_section: 'Timed sections for {exam}',
    simulation: 'Full-length simulations for {exam}',
    study_plan: 'A study plan for {exam}',
    ai_tutor: 'The AI tutor',
    diagnostic: 'The free diagnostic',
    guides: 'Guides',
    samples: 'Sample questions',
  } satisfies Record<Feature, string>,
  leads: {
    practice: 'Topic practice with fresh questions every session, retries of what you missed, timed sections and simulations.',
    timed_section: 'Timed sections at the published pace, with results by topic.',
    simulation: 'Full-length simulations under the published rules, where the exam offers one.',
    study_plan: 'A dated plan to your test date, and a readiness view built from your own results.',
    ai_tutor: 'Hints while you practise, deeper explanations after you answer, and a guide after every test.',
    diagnostic: '',
    guides: '',
    samples: '',
  } satisfies Record<Feature, string>,
  thisExam: 'this exam',
  planLine: '{plan}: {price} {period}',
  seePlans: 'See plans',
  choosePlan: 'Choose {plan}',
  freeDiagnostic: 'Try the free diagnostic first',
} as const;

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

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
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const plans = PLAN_KEYS.filter((key) => PLANS[key].features.includes(feature)).sort((a, b) => PLANS[a].amount - PLANS[b].amount);
  const only = plans.length === 1 ? plans[0] : null;
  return (
    <Card padding="lg" className={cx('border-2 border-accent', className)}>
      <p className="eyebrow">{COPY.eyebrow}</p>
      <Heading className="mt-2 font-heading text-xl font-semibold">
        {fill(COPY.titles[feature], { exam: examName ?? COPY.thisExam })}
      </Heading>
      {COPY.leads[feature] ? <p className="mt-2 text-ink-muted">{COPY.leads[feature]}</p> : null}
      <ul className="mt-4 space-y-1 text-sm">
        {plans.map((key) => (
          <li key={key}>
            {fill(COPY.planLine, {
              plan: PLAN_COPY.plans[key].name,
              price: formatPrice(PLANS[key].amount),
              period: PLAN_COPY.plans[key].perPeriod,
            })}
          </li>
        ))}
      </ul>
      <p className="mt-1 text-xs text-ink-subtle">{PLAN_COPY.vatNote}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {only ? (
          <ButtonLink href={checkoutPath(only, PLANS[only].scope === 'one-exam' ? examKey : null)}>
            {fill(COPY.choosePlan, { plan: PLAN_COPY.plans[only].name })}
          </ButtonLink>
        ) : (
          <ButtonLink href={pricingPath(examKey, feature)}>{COPY.seePlans}</ButtonLink>
        )}
        {offerDiagnostic && examKey && feature !== 'ai_tutor' ? (
          <Link href={freeTestPath(examKey)} className="text-sm font-semibold">
            {COPY.freeDiagnostic}
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
