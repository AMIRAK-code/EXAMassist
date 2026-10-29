/**
 * Plans, prices and the free/paid feature matrix: the ONE place to change them.
 *
 * Everything that sells, prices or gates something reads from here: the
 * pricing and checkout pages, the account page, the entitlement decisions in
 * src/lib/billing/entitlements.ts, the server that creates Stripe payments and
 * subscriptions, and scripts/stripe-setup.ts, which creates the matching
 * products and prices in Stripe. docs/BILLING.md explains how to change a
 * price safely (in short: a new price needs a new lookup key).
 *
 * Amounts are in cents and INCLUDE VAT: the price on the page is the price
 * charged. Stripe prices are created with tax_behavior 'inclusive'.
 *
 * What is sold (decided by the owner on 2026-10-29):
 *
 *   Free              guides, sample questions, the free diagnostic, official
 *                     practice-score tracking
 *   Single Exam Pass  €23.99 once: one exam for six calendar months from the
 *                     confirmed payment; never renews; no AI tutor
 *   Plus              €7.99 a month or €59.99 a year (charged upfront), renews
 *                     until cancelled: every exam; no AI tutor
 *   Premium           coming soon (planned €14.99 a month or €119 a year):
 *                     Plus and the AI tutor. Not for sale; the server refuses it.
 *
 * Plans sold before keep exactly what they were sold with until they end
 * (`status: 'legacy'`): nobody is moved to a new plan or price silently.
 */

/**
 * What can be free or paid. `guides`, `samples` and `official_scores` are
 * never gated in code; they are listed so the matrix on the pricing page is
 * complete.
 *
 * - `diagnostic`: the exam's free diagnostic. It is the fixed "free test"
 *   (src/lib/attempts/service.ts, chooseFreeTest): the same questions for
 *   everyone, one per exam per account. A diagnostic with freshly drawn
 *   questions counts as `practice`, so the free diagnostic cannot be used to
 *   work through the paid question bank.
 * - `official_scores`: recording results from official practice tests by
 *   hand (src/lib/learning/official-scores.ts).
 * - `practice`: untimed topic practice with worked explanations, fresh
 *   diagnostics and retries of missed questions.
 * - `timed_section`: timed sections at the published pace.
 * - `simulation`: full-length simulations.
 * - `study_plan`: the study plan and its readiness/progress view.
 * - `ai_tutor`: AI hints, deeper explanations and after-test guides.
 */
export type Feature =
  | 'guides'
  | 'samples'
  | 'diagnostic'
  | 'official_scores'
  | 'practice'
  | 'timed_section'
  | 'simulation'
  | 'study_plan'
  | 'ai_tutor';

/**
 * Every kind of paid access the site knows about. `exam_pass` and `plus` are
 * on sale, `premium` is announced but not sold, and `all_access` and
 * `single_exam` are earlier plans kept for the people who hold them.
 */
export type PlanKey = 'exam_pass' | 'plus' | 'premium' | 'all_access' | 'single_exam';

/** 'on-sale' can be bought; 'coming-soon' is shown but refused at checkout; 'legacy' is honoured but no longer sold. */
export type PlanStatus = 'on-sale' | 'coming-soon' | 'legacy';

export const CURRENCY = 'eur' as const;

/** How long a Single Exam Pass lasts: calendar months from the confirmed payment. */
export const PASS_ACCESS_MONTHS = 6;

export interface PlanDefinition {
  key: PlanKey;
  /** 'all-exams' covers every exam; 'one-exam' covers the one exam stored with the purchase. */
  scope: 'all-exams' | 'one-exam';
  status: PlanStatus;
  /** 'one-time': paid once for a fixed access period. 'subscription': renews until cancelled. */
  billing: 'one-time' | 'subscription';
  /** Stripe product id, created by scripts/stripe-setup.ts. */
  productId: string;
  features: readonly Feature[];
}

/** The exam features every paid plan opens for the exams it covers. */
const EXAM_FEATURES = ['practice', 'timed_section', 'simulation', 'study_plan'] as const satisfies readonly Feature[];

export const PLANS: Record<PlanKey, PlanDefinition> = {
  exam_pass: {
    key: 'exam_pass',
    scope: 'one-exam',
    status: 'on-sale',
    billing: 'one-time',
    productId: 'examer_exam_pass',
    features: [...EXAM_FEATURES],
  },
  plus: {
    key: 'plus',
    scope: 'all-exams',
    status: 'on-sale',
    billing: 'subscription',
    productId: 'examer_plus',
    features: [...EXAM_FEATURES],
  },
  premium: {
    key: 'premium',
    scope: 'all-exams',
    status: 'coming-soon',
    billing: 'subscription',
    productId: 'examer_premium',
    features: [...EXAM_FEATURES, 'ai_tutor'],
  },
  // Earlier plans (the €39.00 "All access" and €19.99 "Single exam" monthly
  // subscriptions, and through LEGACY_LOOKUP_KEYS the first Premium plans).
  all_access: {
    key: 'all_access',
    scope: 'all-exams',
    status: 'legacy',
    billing: 'subscription',
    productId: 'examer_all_access',
    features: [...EXAM_FEATURES, 'ai_tutor'],
  },
  single_exam: {
    key: 'single_exam',
    scope: 'one-exam',
    status: 'legacy',
    billing: 'subscription',
    productId: 'examer_single_exam',
    features: [...EXAM_FEATURES],
  },
};

export const PLAN_KEYS = Object.keys(PLANS) as PlanKey[];

/** The plans the pricing page shows, in order (Free is not a plan here). */
export const DISPLAYED_PLANS = ['exam_pass', 'plus', 'premium'] as const satisfies readonly PlanKey[];
export type DisplayedPlan = (typeof DISPLAYED_PLANS)[number];

/** Each thing a buyer can be charged for. */
export type PriceKey =
  | 'exam_pass'
  | 'plus_month'
  | 'plus_year'
  | 'premium_month'
  | 'premium_year'
  | 'all_access_month'
  | 'single_exam_month';

export interface PriceDefinition {
  key: PriceKey;
  plan: PlanKey;
  /** Charged once or each period, in cents, VAT included. */
  amount: number;
  /** 'once' for a one-time payment; otherwise how often it renews. */
  interval: 'once' | 'month' | 'year';
  /**
   * The Stripe price is found by this lookup key. Prices in Stripe cannot be
   * edited, so changing `amount` means bumping the suffix (…_v2) and running
   * scripts/stripe-setup.ts. Existing subscribers stay on the old price until
   * they are moved in Stripe (with notice); keep the old key resolvable.
   */
  lookupKey: string;
}

export const PRICES: Record<PriceKey, PriceDefinition> = {
  exam_pass: { key: 'exam_pass', plan: 'exam_pass', amount: 2399, interval: 'once', lookupKey: 'examer_pass_exam_v1' },
  plus_month: { key: 'plus_month', plan: 'plus', amount: 799, interval: 'month', lookupKey: 'examer_plus_month_v1' },
  plus_year: { key: 'plus_year', plan: 'plus', amount: 5999, interval: 'year', lookupKey: 'examer_plus_year_v1' },
  // Planned, not on sale: never created in Stripe by stripe-setup, refused by the checkout.
  premium_month: { key: 'premium_month', plan: 'premium', amount: 1499, interval: 'month', lookupKey: 'examer_premium_month_v2' },
  premium_year: { key: 'premium_year', plan: 'premium', amount: 11900, interval: 'year', lookupKey: 'examer_premium_year_v2' },
  // Sold before 2026-10-29; their subscribers keep them until they end.
  all_access_month: {
    key: 'all_access_month',
    plan: 'all_access',
    amount: 3900,
    interval: 'month',
    lookupKey: 'examer_all_access_monthly_eur_v1',
  },
  single_exam_month: {
    key: 'single_exam_month',
    plan: 'single_exam',
    amount: 1999,
    interval: 'month',
    lookupKey: 'examer_single_exam_monthly_eur_v1',
  },
};

export const PRICE_KEYS = Object.keys(PRICES) as PriceKey[];

/** What the checkout can sell today, in the order it offers them. */
export const OFFERS = PRICE_KEYS.filter((key) => PLANS[PRICES[key].plan].status === 'on-sale');

/** The prices of a plan, in PRICE_KEYS order. */
export function pricesOf(plan: PlanKey): PriceDefinition[] {
  return PRICE_KEYS.filter((key) => PRICES[key].plan === plan).map((key) => PRICES[key]);
}

/**
 * User-facing words for plans and features, in English. The site renders the
 * same words from the `billing` message catalogue (messages/<locale>/billing.json:
 * `plans.<key>.*`, `features.<feature>`), so a change here must be made there
 * too. This copy stays for the Stripe product names (scripts/stripe-setup.ts)
 * and for code without a translator.
 */
export const PLAN_COPY = {
  plans: {
    exam_pass: { name: 'Single Exam Pass', tagline: 'One exam of your choice for six months. Paid once; it does not renew.' },
    plus: { name: 'Plus', tagline: 'Every exam on the site, billed monthly or yearly until you cancel.' },
    premium: { name: 'Premium', tagline: 'Everything in Plus and the AI tutor. Coming soon.' },
    all_access: { name: 'All access', tagline: 'Every exam on the site, plus the AI tutor. No longer sold.' },
    single_exam: { name: 'Single exam', tagline: 'One exam of your choice, billed monthly. No longer sold.' },
  } satisfies Record<PlanKey, { name: string; tagline: string }>,
  /** Earlier Premium subscriptions (LEGACY_LOOKUP_KEYS) are named as they were sold. */
  legacyPremium: { name: 'Premium (earlier plan)' },
  free: {
    name: 'Free',
    tagline: 'Guides, sample questions, a free diagnostic for every exam and official score tracking.',
  },
  features: {
    guides: 'Exam guides, format and scoring pages',
    samples: 'Sample questions',
    diagnostic: 'The free diagnostic for every exam',
    official_scores: 'Tracking your official practice-test scores',
    practice: 'Topic practice and retries with worked explanations, fresh questions every session',
    timed_section: 'Timed sections at the published pace',
    simulation: 'Full-length simulations, where the exam offers one',
    study_plan: 'Study plan and progress tracking',
    ai_tutor: 'AI tutor: hints, deeper explanations, after-test guides',
  } satisfies Record<Feature, string>,
  vatNote: 'Prices in euros, VAT included.',
} as const;

/** Free without any plan. */
export const FREE_FEATURES: readonly Feature[] = ['guides', 'samples', 'diagnostic', 'official_scores'];

/**
 * Whether the free diagnostic needs a registered account. True keeps the
 * existing rule that guests try the sample questions and are asked to sign up
 * (keeping their guest history) before their first session.
 */
export const DIAGNOSTIC_NEEDS_ACCOUNT = true;

/**
 * Lookup keys of prices this site sold before PRICES existed, and the plan
 * they grant. The first "Premium" plans (monthly, 3-month, yearly) opened
 * everything including the AI tutor, so their subscribers keep exactly that
 * (the `all_access` benefits) until their subscription ends.
 */
export const LEGACY_LOOKUP_KEYS: Readonly<Record<string, PlanKey>> = {
  examer_premium_monthly_v1: 'all_access',
  examer_premium_quarterly_v1: 'all_access',
  examer_premium_yearly_v1: 'all_access',
};

/**
 * Which subscription statuses give access, and for how long. (A Single Exam
 * Pass is not a subscription: it gives access from its confirmed payment to
 * the end of its term, see entitlements.ts.)
 *
 * - active, trialing: access until the end of the paid period, plus
 *   `renewalGraceHours` so a renewal webhook that arrives late does not lock
 *   a paying learner out for a moment.
 * - past_due (a renewal payment failed and Stripe is retrying): access
 *   continues until the current period end Stripe reports. Stripe's retry
 *   settings decide when it gives up and moves the subscription to canceled
 *   or unpaid, which ends access at once (docs/BILLING.md).
 * - everything else (incomplete, incomplete_expired, unpaid, canceled,
 *   paused): no access.
 */
export const ACCESS_POLICY = {
  grantingStatuses: ['active', 'trialing'] as readonly string[],
  pastDueKeepsAccessUntilPeriodEnd: true,
  renewalGraceHours: 48,
} as const;

/** Features in the order the pricing page lists them. */
export const FEATURE_ORDER: readonly Feature[] = [
  'guides',
  'samples',
  'diagnostic',
  'official_scores',
  'practice',
  'timed_section',
  'simulation',
  'study_plan',
  'ai_tutor',
];

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(PLANS, value);
}

export function isPriceKey(value: unknown): value is PriceKey {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(PRICES, value);
}

export function isOnSale(price: PriceKey): boolean {
  return PLANS[PRICES[price].plan].status === 'on-sale';
}

export function isFreeFeature(feature: Feature): boolean {
  return FREE_FEATURES.includes(feature);
}

export function planIncludes(plan: PlanKey, feature: Feature): boolean {
  return isFreeFeature(feature) || PLANS[plan].features.includes(feature);
}

/** The price behind a Stripe lookup key, when it is one of PRICES. */
export function priceForLookupKey(lookupKey: string | null | undefined): PriceDefinition | null {
  if (!lookupKey) return null;
  return Object.values(PRICES).find((price) => price.lookupKey === lookupKey) ?? null;
}

/** The plan a Stripe price grants, from its lookup key; null for a price that is not ours. */
export function planForLookupKey(lookupKey: string | null | undefined): PlanKey | null {
  if (!lookupKey) return null;
  return priceForLookupKey(lookupKey)?.plan ?? LEGACY_LOOKUP_KEYS[lookupKey] ?? null;
}

/** A first-generation Premium subscription (named as it was sold, with the benefits it was sold with). */
export function isLegacyPremium(lookupKey: string | null | undefined): boolean {
  return Boolean(lookupKey && Object.prototype.hasOwnProperty.call(LEGACY_LOOKUP_KEYS, lookupKey));
}

/**
 * The plan to point a refused learner at: the pass for one exam, Plus without
 * an exam, nothing for a free feature or one no plan on sale includes (the AI
 * tutor, until Premium is sold).
 */
export function suggestedPlanFor(feature: Feature, examKey: string | null = null): PlanKey | null {
  if (isFreeFeature(feature)) return null;
  const onSale = PLAN_KEYS.filter((key) => PLANS[key].status === 'on-sale' && PLANS[key].features.includes(feature));
  if (onSale.length === 0) return null;
  const scoped = examKey ? onSale.find((key) => PLANS[key].scope === 'one-exam') : undefined;
  return scoped ?? onSale.find((key) => PLANS[key].scope === 'all-exams') ?? onSale[0]!;
}

export interface FeatureRow {
  feature: Feature;
  label: string;
  free: boolean;
  plans: Record<DisplayedPlan, boolean>;
}

/** The free/paid matrix, as the pricing page and docs show it. */
export function featureMatrix(): FeatureRow[] {
  return FEATURE_ORDER.map((feature) => ({
    feature,
    label: PLAN_COPY.features[feature],
    free: isFreeFeature(feature),
    plans: Object.fromEntries(DISPLAYED_PLANS.map((key) => [key, planIncludes(key, feature)])) as Record<DisplayedPlan, boolean>,
  }));
}

/** What a practice session needs, from its format. */
export function featureForSession(
  blueprint: { mode: 'practice' | 'diagnostic' | 'simulation' | 'review'; timing: 'untimed' | 'per_part' | 'overall' },
  options: { freeTest?: boolean } = {},
): Feature {
  if (options.freeTest) return 'diagnostic';
  if (blueprint.mode === 'simulation') return 'simulation';
  if (blueprint.mode === 'practice' && blueprint.timing !== 'untimed') return 'timed_section';
  return 'practice';
}

/**
 * What the yearly Plus price saves against twelve monthly payments, as a
 * whole percentage rounded down (never overstated), and what it works out at
 * per month. The pricing copy takes both from here.
 */
export function annualSaving(monthly: PriceDefinition = PRICES.plus_month, yearly: PriceDefinition = PRICES.plus_year) {
  const twelveMonths = monthly.amount * 12;
  return {
    percent: Math.floor(((twelveMonths - yearly.amount) / twelveMonths) * 100),
    perMonthCents: yearly.amount / 12,
  };
}

/**
 * The end of a fixed access term: `months` calendar months after `start`, at
 * the same time of day, in UTC. A day the target month lacks becomes its last
 * day (31 August + 6 months = 28 February, or 29 in a leap year).
 */
export function addCalendarMonths(start: Date, months: number): Date {
  const year = start.getUTCFullYear();
  const month = start.getUTCMonth() + months;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(
    Date.UTC(
      year,
      month,
      Math.min(start.getUTCDate(), lastDay),
      start.getUTCHours(),
      start.getUTCMinutes(),
      start.getUTCSeconds(),
      start.getUTCMilliseconds(),
    ),
  );
}

/** A price in euros from cents, written the way the given language writes money: "€39.00" (en), "39,00 €" (it). */
export function formatPrice(cents: number, locale = 'en'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

/** A price rounded to whole euros, for "approximately €5 a month". */
export function formatWholePrice(cents: number, locale = 'en'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(
    cents / 100,
  );
}
