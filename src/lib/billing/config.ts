/**
 * The billing settings this deployment runs with, read from the environment.
 * Plans, prices and the feature matrix are in ./plans.ts.
 *
 *   BILLING_ENFORCED                    "true" turns the paywall on. Anything
 *                                       else (the default) leaves every
 *                                       feature free, as before billing.
 *   STRIPE_SECRET_KEY                   server only
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  sent to the browser for Stripe.js
 *   STRIPE_WEBHOOK_SECRET               verifies /api/billing/webhook
 *   STRIPE_AUTOMATIC_TAX                "true" once Stripe Tax is set up
 *
 * With BILLING_ENFORCED=true and any of the three keys missing, the server
 * refuses to start (src/instrumentation.ts) and every entitlement check
 * throws, so a misconfigured deployment fails loudly instead of quietly
 * giving everything away.
 *
 * The environment is passed in rather than read as `process.env.NEXT_PUBLIC_…`
 * so the publishable key is read at run time, not inlined at build time.
 */

export interface BillingSettings {
  /** The paywall is on: paid features need an entitlement. */
  enforced: boolean;
  secretKey: string | null;
  publishableKey: string | null;
  webhookSecret: string | null;
  /** All three Stripe values are present. */
  configured: boolean;
  /** The secret key is a live-mode key. */
  livemode: boolean;
  /** Stripe Tax works out VAT per country (prices stay VAT-inclusive). */
  automaticTax: boolean;
  /**
   * Whether this deployment can take a payment: keys are set, and either the
   * paywall is on or the keys are test-mode keys (so a staging deployment can
   * rehearse checkout while everything is still free). Live keys never sell
   * a plan while everything is free anyway.
   */
  checkoutAvailable: boolean;
}

export class BillingConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BillingConfigError';
  }
}

const clean = (value: string | undefined) => value?.trim() || null;

export function billingSettings(env: Record<string, string | undefined> = process.env): BillingSettings {
  const secretKey = clean(env.STRIPE_SECRET_KEY);
  const publishableKey = clean(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  const webhookSecret = clean(env.STRIPE_WEBHOOK_SECRET);
  const enforced = env.BILLING_ENFORCED?.trim().toLowerCase() === 'true';
  const configured = Boolean(secretKey && publishableKey && webhookSecret);
  const livemode = Boolean(secretKey && /^(sk|rk)_live_/.test(secretKey));
  return {
    enforced,
    secretKey,
    publishableKey,
    webhookSecret,
    configured,
    livemode,
    automaticTax: env.STRIPE_AUTOMATIC_TAX?.trim() === 'true',
    checkoutAvailable: configured && (enforced || !livemode),
  };
}

/** What is wrong with this configuration, or an empty list. */
export function billingConfigProblems(settings: BillingSettings): string[] {
  const problems: string[] = [];
  const { secretKey, publishableKey, webhookSecret } = settings;
  if (settings.enforced) {
    if (!secretKey) problems.push('STRIPE_SECRET_KEY is not set.');
    if (!publishableKey) problems.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set.');
    if (!webhookSecret) problems.push('STRIPE_WEBHOOK_SECRET is not set.');
  }
  if (secretKey && !/^(sk|rk)_(test|live)_/.test(secretKey)) problems.push('STRIPE_SECRET_KEY must start with sk_test_, sk_live_, rk_test_ or rk_live_.');
  if (publishableKey && !/^pk_(test|live)_/.test(publishableKey)) problems.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_test_ or pk_live_.');
  if (webhookSecret && !webhookSecret.startsWith('whsec_')) problems.push('STRIPE_WEBHOOK_SECRET must start with whsec_.');
  if (secretKey && publishableKey) {
    const secretLive = /_live_/.test(secretKey);
    const publishableLive = /_live_/.test(publishableKey);
    if (secretLive !== publishableLive) problems.push('STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY are from different modes (one test, one live).');
  }
  return problems;
}

/**
 * Throws when billing is enforced but cannot work. Called at server start and
 * before every entitlement decision, so a missing key can never turn into
 * free access.
 */
export function assertBillingConfig(env: Record<string, string | undefined> = process.env): BillingSettings {
  const settings = billingSettings(env);
  const problems = billingConfigProblems(settings);
  if (problems.length > 0 && (settings.enforced || settings.secretKey || settings.publishableKey || settings.webhookSecret)) {
    throw new BillingConfigError(
      `Billing is misconfigured${settings.enforced ? ' while BILLING_ENFORCED=true' : ''}: ${problems.join(' ')} See docs/BILLING.md.`,
    );
  }
  return settings;
}

// ---------------------------------------------------------------------------
// Where things live
// ---------------------------------------------------------------------------

/** The short introduction a learner without access sees before an exam's plans and free diagnostic. */
export const startPath = (examKey: string) => `/start/${encodeURIComponent(examKey)}`;
export const freeTestPath = (examKey: string) => `/free-test/${encodeURIComponent(examKey)}`;

/** The pricing page, for one exam when there is one. */
export function pricingPath(examKey?: string | null, reason?: string): string {
  const params = new URLSearchParams();
  if (examKey) params.set('exam', examKey);
  if (reason) params.set('reason', reason);
  const query = params.toString();
  return query ? `/pricing?${query}` : '/pricing';
}

/**
 * Our own checkout page for an offer (a price key from plans.ts: 'exam_pass',
 * 'plus_month', 'plus_year'), and the exam, for a Single Exam Pass. Older links
 * naming an earlier plan land on the plans on sale now, with a note.
 */
export function checkoutPath(plan: string, examKey?: string | null): string {
  const params = new URLSearchParams({ plan });
  if (examKey) params.set('exam', examKey);
  return `/checkout?${params.toString()}`;
}
