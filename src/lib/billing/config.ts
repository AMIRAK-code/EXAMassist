/**
 * Premium plans and the Stripe settings this deployment runs with.
 *
 * Billing is on only when STRIPE_SECRET_KEY is set. Without it there is no
 * paywall at all: every session is open, as before Premium existed, so a
 * deployment that has not been given a key never locks anyone out.
 */

export type PlanKey = 'monthly' | 'quarterly' | 'yearly';

export interface Plan {
  key: PlanKey;
  label: string;
  /** For prose: "your 3-month plan". */
  name: string;
  /** What is charged each billing period, in cents, VAT included. */
  amount: number;
  /** The same price spread per month, in cents, for comparing plans. */
  perMonth: number;
  interval: 'month' | 'year';
  intervalCount: number;
  /** Stripe finds (or creates) the price by this key. Bump the suffix to change a price. */
  lookupKey: string;
  /** "every 3 months", for the plan cards and the account page. */
  billedEvery: string;
}

export const CURRENCY = 'eur';
export const PREMIUM_PRODUCT_ID = 'examer_premium';
export const PREMIUM_PRODUCT_NAME = 'Examer Premium';

export const PLANS: Record<PlanKey, Plan> = {
  monthly: {
    key: 'monthly',
    label: 'Monthly',
    name: 'monthly',
    amount: 1499,
    perMonth: 1499,
    interval: 'month',
    intervalCount: 1,
    lookupKey: 'examer_premium_monthly_v1',
    billedEvery: 'every month',
  },
  quarterly: {
    key: 'quarterly',
    label: '3 months',
    name: '3-month',
    amount: 3597,
    perMonth: 1199,
    interval: 'month',
    intervalCount: 3,
    lookupKey: 'examer_premium_quarterly_v1',
    billedEvery: 'every 3 months',
  },
  yearly: {
    key: 'yearly',
    label: 'Yearly',
    name: 'yearly',
    amount: 9588,
    perMonth: 799,
    interval: 'year',
    intervalCount: 1,
    lookupKey: 'examer_premium_yearly_v1',
    billedEvery: 'every year',
  },
};

export const PLAN_KEYS = Object.keys(PLANS) as PlanKey[];

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === 'string' && value in PLANS;
}

/** Which plan a Stripe price belongs to, by lookup key first and then by its billing interval. */
export function planForPrice(price: {
  lookup_key?: string | null;
  recurring?: { interval?: string; interval_count?: number } | null;
} | null | undefined): PlanKey | null {
  if (!price) return null;
  const byKey = PLAN_KEYS.find((key) => PLANS[key].lookupKey === price.lookup_key);
  if (byKey) return byKey;
  const interval = price.recurring?.interval;
  const count = price.recurring?.interval_count ?? 1;
  return PLAN_KEYS.find((key) => PLANS[key].interval === interval && PLANS[key].intervalCount === count) ?? null;
}

/** "€14.99", from cents. */
export function formatEuros(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}

export interface BillingSettings {
  /** True when a Stripe key is set: Premium is sold and the free allowance applies. */
  enabled: boolean;
  secretKey: string | null;
  webhookSecret: string | null;
  livemode: boolean;
  /** Stripe Tax works out VAT per country. Needs Stripe Tax set up in the dashboard first. */
  automaticTax: boolean;
  apiBase: string;
  timeoutMs: number;
}

export function billingSettings(env: Record<string, string | undefined> = process.env): BillingSettings {
  const secretKey = env.STRIPE_SECRET_KEY?.trim() || null;
  return {
    enabled: secretKey !== null,
    secretKey,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET?.trim() || null,
    livemode: secretKey !== null && /^(sk|rk)_live_/.test(secretKey),
    automaticTax: env.STRIPE_AUTOMATIC_TAX?.trim() === 'true',
    apiBase: (env.STRIPE_API_BASE?.trim() || 'https://api.stripe.com').replace(/\/+$/, ''),
    timeoutMs: Number.parseInt(env.STRIPE_TIMEOUT_MS ?? '', 10) || 15_000,
  };
}

/**
 * A free account may start this many sessions in total, and each one is the
 * free test: the same fixed questions for everyone (startAttempt, freeTest).
 * Guests start none; they can try the sample questions on the home page.
 */
export const FREE_SESSIONS = 1;

/** Where a learner goes once the free test is used. */
export const PREMIUM_PATH = '/premium?reason=free-test-used';

/** The short introduction a learner without Premium sees before an exam's plans and free test. */
export const startPath = (examKey: string) => `/start/${encodeURIComponent(examKey)}`;
export const freeTestPath = (examKey: string) => `/free-test/${encodeURIComponent(examKey)}`;
