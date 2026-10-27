/**
 * Plans, prices and the free/paid feature matrix: the ONE place to change them.
 *
 * Everything that sells, prices or gates something reads from here: the
 * pricing and checkout pages, the account page, the entitlement decisions in
 * src/lib/billing/entitlements.ts, the server that creates Stripe
 * subscriptions, and scripts/stripe-setup.ts, which creates the matching
 * products and prices in Stripe. docs/BILLING.md explains how to change a
 * price safely (in short: a new price needs a new lookup key).
 *
 * Amounts are in cents and INCLUDE VAT: the price on the page is the price
 * charged. Stripe prices are created with tax_behavior 'inclusive'.
 */

/**
 * What can be free or paid. `guides` and `samples` are public pages and are
 * never gated in code; they are listed so the matrix on the pricing page is
 * complete.
 *
 * - `diagnostic`: the exam's free diagnostic. It is the fixed "free test"
 *   (src/lib/attempts/service.ts, chooseFreeTest): the same questions for
 *   everyone, one per exam per account. A diagnostic with freshly drawn
 *   questions counts as `practice`, so the free diagnostic cannot be used to
 *   work through the paid question bank.
 * - `practice`: untimed topic practice, fresh diagnostics and retries of
 *   missed questions.
 * - `timed_section`: timed sections at the published pace.
 * - `simulation`: full-length simulations.
 * - `study_plan`: the study plan and its readiness/progress view.
 * - `ai_tutor`: AI hints, deeper explanations and after-test guides.
 */
export type Feature =
  | 'guides'
  | 'samples'
  | 'diagnostic'
  | 'practice'
  | 'timed_section'
  | 'simulation'
  | 'study_plan'
  | 'ai_tutor';

export type PlanKey = 'all_access' | 'single_exam';

export const CURRENCY = 'eur' as const;

/** User-facing words for plans and features. Translated with the rest of the site. */
export const PLAN_COPY = {
  plans: {
    all_access: {
      name: 'All access',
      tagline: 'Every exam on the site, plus the AI tutor.',
      perPeriod: 'per month',
      scope: 'Every exam',
    },
    single_exam: {
      name: 'Single exam',
      tagline: 'Full use of the one exam you choose. Hold several if you prepare for more than one.',
      perPeriod: 'per month, per exam',
      scope: 'One exam of your choice',
    },
  },
  free: {
    name: 'Free',
    tagline: 'Guides, sample questions and a free diagnostic for every exam.',
  },
  features: {
    guides: 'Exam guides, format and scoring pages',
    samples: 'Sample questions',
    diagnostic: 'The free diagnostic for every exam',
    practice: 'Topic practice and retries, with fresh questions every session',
    timed_section: 'Timed sections at the published pace',
    simulation: 'Full-length simulations, where the exam offers one',
    study_plan: 'Study plan and readiness',
    ai_tutor: 'AI tutor: hints, deeper explanations, after-test guides',
  } satisfies Record<Feature, string>,
  vatNote: 'Prices in euros, VAT included. Billed monthly; renews automatically until you cancel.',
} as const;

export interface PlanDefinition {
  key: PlanKey;
  /** 'all-exams' covers every exam; 'one-exam' covers the exam stored on the subscription (metadata exam_key). */
  scope: 'all-exams' | 'one-exam';
  /** Charged each period, in cents, VAT included. */
  amount: number;
  interval: 'month';
  intervalCount: 1;
  /**
   * The Stripe price is found by this lookup key. Prices in Stripe cannot be
   * edited, so changing `amount` means bumping the suffix (…_v2) and running
   * scripts/stripe-setup.ts. Existing subscribers stay on the old price until
   * they are moved in Stripe; add the old key to LEGACY_LOOKUP_KEYS so their
   * entitlement still resolves.
   */
  lookupKey: string;
  /** Stripe product id, created by scripts/stripe-setup.ts. */
  productId: string;
  features: readonly Feature[];
}

/** The exam features every paid plan opens for the exams it covers. */
const EXAM_FEATURES = ['practice', 'timed_section', 'simulation', 'study_plan'] as const satisfies readonly Feature[];

export const PLANS: Record<PlanKey, PlanDefinition> = {
  all_access: {
    key: 'all_access',
    scope: 'all-exams',
    amount: 3900,
    interval: 'month',
    intervalCount: 1,
    lookupKey: 'examer_all_access_monthly_eur_v1',
    productId: 'examer_all_access',
    features: [...EXAM_FEATURES, 'ai_tutor'],
  },
  single_exam: {
    key: 'single_exam',
    scope: 'one-exam',
    amount: 1999,
    interval: 'month',
    intervalCount: 1,
    lookupKey: 'examer_single_exam_monthly_eur_v1',
    productId: 'examer_single_exam',
    features: [...EXAM_FEATURES],
  },
};

export const PLAN_KEYS = Object.keys(PLANS) as PlanKey[];

/** Free without any subscription. */
export const FREE_FEATURES: readonly Feature[] = ['guides', 'samples', 'diagnostic'];

/**
 * Whether the free diagnostic needs a registered account. True keeps the
 * existing rule that guests try the sample questions and are asked to sign up
 * (keeping their guest history) before their first session.
 */
export const DIAGNOSTIC_NEEDS_ACCOUNT = true;

/**
 * Lookup keys of prices this site sold before, and the plan they now grant.
 * The earlier "Premium" plans (monthly, 3-month, yearly) opened everything,
 * so their remaining subscribers keep all access until they cancel.
 */
export const LEGACY_LOOKUP_KEYS: Readonly<Record<string, PlanKey>> = {
  examer_premium_monthly_v1: 'all_access',
  examer_premium_quarterly_v1: 'all_access',
  examer_premium_yearly_v1: 'all_access',
};

/**
 * Which subscription statuses give access, and for how long.
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
  'practice',
  'timed_section',
  'simulation',
  'study_plan',
  'ai_tutor',
];

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(PLANS, value);
}

export function isFreeFeature(feature: Feature): boolean {
  return FREE_FEATURES.includes(feature);
}

export function planIncludes(plan: PlanKey, feature: Feature): boolean {
  return isFreeFeature(feature) || PLANS[plan].features.includes(feature);
}

/** The plan a Stripe price grants, from its lookup key; null for a price that is not ours. */
export function planForLookupKey(lookupKey: string | null | undefined): PlanKey | null {
  if (!lookupKey) return null;
  const current = PLAN_KEYS.find((key) => PLANS[key].lookupKey === lookupKey);
  return current ?? LEGACY_LOOKUP_KEYS[lookupKey] ?? null;
}

/** The cheapest plan that includes a feature, for upgrade prompts. Null for a free feature. */
export function cheapestPlanFor(feature: Feature): PlanKey | null {
  if (isFreeFeature(feature)) return null;
  const plans = PLAN_KEYS.filter((key) => PLANS[key].features.includes(feature));
  plans.sort((a, b) => PLANS[a].amount - PLANS[b].amount);
  return plans[0] ?? null;
}

export interface FeatureRow {
  feature: Feature;
  label: string;
  free: boolean;
  plans: Record<PlanKey, boolean>;
}

/** The free/paid matrix, as the pricing page and docs show it. */
export function featureMatrix(): FeatureRow[] {
  return FEATURE_ORDER.map((feature) => ({
    feature,
    label: PLAN_COPY.features[feature],
    free: isFreeFeature(feature),
    plans: Object.fromEntries(PLAN_KEYS.map((key) => [key, planIncludes(key, feature)])) as Record<PlanKey, boolean>,
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

/** "€39.00", from cents. */
export function formatPrice(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}
