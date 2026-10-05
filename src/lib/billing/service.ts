import type { Db } from '@/lib/db';
import { siteUrl } from '@/lib/site';
import {
  CURRENCY,
  FREE_SESSIONS,
  PLANS,
  PREMIUM_PRODUCT_ID,
  PREMIUM_PRODUCT_NAME,
  billingSettings,
  planForPrice,
  type BillingSettings,
  type PlanKey,
} from './config';
import { StripeError, stripeClient, verifyStripeSignature, type StripeRequest } from './stripe';

/**
 * Premium: who has it, the one free session everyone else gets, and keeping
 * the subscriptions table in step with Stripe.
 *
 * Stripe is the source of truth. Every change (checkout, webhook, a stale row)
 * re-reads the customer's subscriptions from Stripe and stores the one that
 * matters, so handling the same event twice, or events out of order, always
 * ends in the same state.
 */

export class BillingError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
    readonly detail?: unknown,
  ) {
    super(message);
    this.name = 'BillingError';
  }
}

export interface SubscriptionRow {
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  plan: string | null;
  status: string | null;
  current_period_end: string | null;
  cancel_at_period_end: number;
  created_at: string;
  updated_at: string;
}

/** Statuses that keep Premium on. past_due means Stripe is still retrying a failed renewal. */
const PREMIUM_STATUSES = new Set(['active', 'trialing', 'past_due']);

/** How long Premium survives a missed update after the paid period ends. */
const GRACE_MS = 3 * 24 * 60 * 60 * 1000;

export interface BillingDeps {
  settings?: BillingSettings;
  stripe?: StripeRequest;
  now?: Date;
}

function deps(options: BillingDeps) {
  const settings = options.settings ?? billingSettings();
  return { settings, stripe: options.stripe ?? stripeClient(settings), now: options.now ?? new Date() };
}

export async function getSubscription(db: Db, userId: string): Promise<SubscriptionRow | null> {
  return ((await db.prepare('SELECT * FROM subscriptions WHERE user_id = ?').get(userId)) as SubscriptionRow | undefined) ?? null;
}

export function premiumActive(row: SubscriptionRow | null, now = new Date()): boolean {
  if (!row?.status || !PREMIUM_STATUSES.has(row.status)) return false;
  if (!row.current_period_end) return true;
  return new Date(row.current_period_end).getTime() + GRACE_MS > now.getTime();
}

export interface Access {
  /** Billing is configured, so everything beyond the free test needs Premium. */
  paywall: boolean;
  premium: boolean;
  /** Editors and administrators review content and are never asked to pay. */
  staff: boolean;
  /** A real account rather than a guest. Only accounts get the free test. */
  registered: boolean;
  /** Every exam and format is open: no paywall, Premium, or staff. */
  fullAccess: boolean;
  sessionsUsed: number;
  freeSessionsLeft: number;
  /** The learner's first session. For a free account it is the free test. */
  firstSession: { id: string; examKey: string; status: string } | null;
  subscription: SubscriptionRow | null;
}

/**
 * What this user may do. A row that still says Premium after its paid period
 * ended is re-read from Stripe first, so a missed renewal webhook does not cut
 * a paying learner off.
 */
export async function getAccess(db: Db, userId: string, options: BillingDeps = {}): Promise<Access> {
  const { settings, stripe, now } = deps(options);
  const user = (await db.prepare('SELECT role, is_guest FROM users WHERE id = ?').get(userId)) as
    | { role: string; is_guest: number | string }
    | undefined;
  const staff = user?.role === 'editor' || user?.role === 'admin';
  const registered = user !== undefined && Number(user.is_guest) === 0;
  let subscription = settings.enabled ? await getSubscription(db, userId) : null;

  const stale =
    subscription?.status &&
    PREMIUM_STATUSES.has(subscription.status) &&
    subscription.current_period_end &&
    new Date(subscription.current_period_end) < now;
  if (stale && subscription) {
    try {
      subscription = await syncCustomer(db, userId, subscription.stripe_customer_id, stripe, now);
    } catch (error) {
      console.error('[billing] could not refresh a stale subscription:', error instanceof Error ? error.message : error);
    }
  }

  const premium = premiumActive(subscription, now);
  const sessionsUsed = await countSessions(db, userId);
  const first = (await db
    .prepare('SELECT id, exam_key, status FROM attempts WHERE user_id = ? ORDER BY created_at, id LIMIT 1')
    .get(userId)) as { id: string; exam_key: string; status: string } | undefined;
  return {
    paywall: settings.enabled,
    premium,
    staff,
    registered,
    fullAccess: !settings.enabled || premium || staff,
    sessionsUsed,
    freeSessionsLeft: Math.max(0, FREE_SESSIONS - sessionsUsed),
    firstSession: first ? { id: first.id, examKey: first.exam_key, status: first.status } : null,
    subscription,
  };
}

async function countSessions(db: Db, userId: string): Promise<number> {
  const row = (await db.prepare('SELECT COUNT(*) AS n FROM attempts WHERE user_id = ?').get(userId)) as { n: number | string };
  return Number(row.n);
}

export type SessionBlock = 'account-required' | 'premium-required' | null;

/**
 * Why this learner may not start a session of this kind, or null when they
 * may. A free account gets one session, the free test; a guest gets none (the
 * sample questions on the home page need no session). Run it again inside the
 * transaction that creates the session, so two tabs cannot both spend the
 * free test.
 */
export async function sessionBlock(db: Db, userId: string, access: Access, kind: 'free-test' | 'session'): Promise<SessionBlock> {
  if (access.fullAccess) return null;
  if (kind !== 'free-test') return 'premium-required';
  if (!access.registered) return 'account-required';
  return (await countSessions(db, userId)) >= FREE_SESSIONS ? 'premium-required' : null;
}

// ---------------------------------------------------------------------------
// Checkout and the billing portal
// ---------------------------------------------------------------------------

export interface BillingUser {
  id: string;
  email: string | null;
  displayName: string | null;
  isGuest: boolean;
}

/** Reaches the user through checkout and the webhooks; distinct from other products on the same Stripe account. */
const referenceFor = (userId: string) => `examer:${userId}`;

function explainStripeError(error: StripeError): BillingError {
  console.error('[billing] Stripe error', error.status, error.code, error.message);
  if (error.status === 401 || error.code === 'not_configured') {
    return new BillingError('billing-misconfigured', 'Payments are not set up correctly. Nothing was charged.', 503);
  }
  if (/stripe tax|tax settings|head office|origin address/i.test(error.message)) {
    return new BillingError('billing-misconfigured', 'Payments are not set up correctly yet (tax settings). Nothing was charged.', 503);
  }
  if (/customer portal|default configuration/i.test(error.message)) {
    return new BillingError('billing-misconfigured', 'Billing management is not set up yet. Please try again later.', 503);
  }
  if (error.status === 429 || error.status >= 500 || error.code === 'network') {
    return new BillingError('billing-unavailable', 'The payment provider is busy. Nothing was charged; please try again in a minute.', 503);
  }
  return new BillingError('billing-failed', 'The payment provider could not complete that. Nothing was charged.', 502);
}

async function withStripe<T>(work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    if (error instanceof StripeError) throw explainStripeError(error);
    throw error;
  }
}

/** The Stripe customer for this user, created on the first checkout. A stored one that no longer exists is replaced. */
async function ensureCustomer(db: Db, user: BillingUser, stripe: StripeRequest, now: Date): Promise<string> {
  const current = await getSubscription(db, user.id);
  if (current?.stripe_customer_id) {
    try {
      const existing = await stripe('GET', `customers/${current.stripe_customer_id}`);
      if (!existing.deleted) return existing.id;
    } catch (error) {
      if (!(error instanceof StripeError && error.code === 'resource_missing')) throw error;
    }
  }
  const customer = await stripe(
    'POST',
    'customers',
    {
      email: user.email,
      ...(user.displayName ? { name: user.displayName } : {}),
      metadata: { examer_user_id: user.id },
    },
    { idempotencyKey: `examer-customer-${user.id}-${current?.stripe_customer_id ?? 'first'}` },
  );
  await linkCustomer(db, user.id, customer.id, now);
  return customer.id;
}

async function linkCustomer(db: Db, userId: string, customerId: string, now: Date): Promise<void> {
  const at = now.toISOString();
  await db
    .prepare(
      `INSERT INTO subscriptions (user_id, stripe_customer_id, cancel_at_period_end, created_at, updated_at)
       VALUES (?, ?, 0, ?, ?)
       ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = excluded.stripe_customer_id, updated_at = excluded.updated_at`,
    )
    .run(userId, customerId, at, at);
}

/** The Stripe price for a plan, found by lookup key and created on first use. */
export async function premiumPrice(stripe: StripeRequest, planKey: PlanKey): Promise<string> {
  const plan = PLANS[planKey];
  const found = await stripe('GET', 'prices', { lookup_keys: [plan.lookupKey], active: true, limit: 1 });
  if (found.data?.[0]?.id) return found.data[0].id;

  try {
    await stripe('POST', 'products', {
      id: PREMIUM_PRODUCT_ID,
      name: PREMIUM_PRODUCT_NAME,
      description: 'Every exam and every practice format on Examer, with full results and review.',
    });
  } catch (error) {
    if (!(error instanceof StripeError && error.code === 'resource_already_exists')) throw error;
  }
  const price = await stripe('POST', 'prices', {
    product: PREMIUM_PRODUCT_ID,
    currency: CURRENCY,
    unit_amount: plan.amount,
    // Prices on the plans page include VAT
    tax_behavior: 'inclusive',
    recurring: { interval: plan.interval, interval_count: plan.intervalCount },
    lookup_key: plan.lookupKey,
    transfer_lookup_key: true,
    nickname: `Examer Premium, ${plan.label}`,
  });
  return price.id;
}

/** A Stripe Checkout page for this plan. Returns its address. */
export async function startCheckout(db: Db, user: BillingUser, planKey: PlanKey, options: BillingDeps = {}): Promise<string> {
  const { settings, stripe, now } = deps(options);
  if (!settings.enabled) throw new BillingError('billing-off', 'Premium is not on sale yet.', 503);
  if (user.isGuest || !user.email) {
    throw new BillingError('account-required', 'Create an account first, so your Premium plan has somewhere to live.', 403);
  }
  const access = await getAccess(db, user.id, { settings, stripe, now });
  if (access.premium) throw new BillingError('already-premium', 'You already have Premium.', 409);

  return withStripe(async () => {
    const [customer, price] = await Promise.all([ensureCustomer(db, user, stripe, now), premiumPrice(stripe, planKey)]);
    const site = siteUrl();
    const session = await stripe('POST', 'checkout/sessions', {
      mode: 'subscription',
      customer,
      client_reference_id: referenceFor(user.id),
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      ...(settings.automaticTax ? { automatic_tax: { enabled: true }, customer_update: { address: 'auto', name: 'auto' } } : {}),
      metadata: { examer_user_id: user.id, plan: planKey },
      subscription_data: { metadata: { examer_user_id: user.id, plan: planKey } },
      custom_text: {
        submit: {
          message:
            'Premium starts as soon as you pay, and you agree that the 14-day right of withdrawal ends when it does. It renews automatically until you cancel, which you can do at any time from your Examer account.',
        },
      },
      success_url: `${site}/premium/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/premium?checkout=cancelled`,
    });
    return session.url as string;
  });
}

/** Stripe's billing portal for this user: change plan, update the card, see invoices, cancel. */
export async function openBillingPortal(db: Db, userId: string, options: BillingDeps = {}): Promise<string> {
  const { settings, stripe } = deps(options);
  if (!settings.enabled) throw new BillingError('billing-off', 'Premium is not on sale yet.', 503);
  const row = await getSubscription(db, userId);
  if (!row) throw new BillingError('no-billing-account', 'There is no billing account yet. Choose a Premium plan first.', 404);
  return withStripe(async () => {
    const session = await stripe('POST', 'billing_portal/sessions', {
      customer: row.stripe_customer_id,
      return_url: `${siteUrl()}/account#billing`,
    });
    return session.url as string;
  });
}

// ---------------------------------------------------------------------------
// Keeping the table in step with Stripe
// ---------------------------------------------------------------------------

interface StripeSubscription {
  id: string;
  status: string;
  created?: number;
  cancel_at_period_end?: boolean;
  cancel_at?: number | null;
  current_period_end?: number;
  items?: {
    data?: Array<{
      current_period_end?: number;
      price?: { lookup_key?: string | null; recurring?: { interval?: string; interval_count?: number } | null };
    }>;
  };
}

/** The subscription that decides the plan: a live one if there is one, otherwise the newest. */
export function pickSubscription(subscriptions: StripeSubscription[]): StripeSubscription | null {
  const newestFirst = [...subscriptions].sort((a, b) => (b.created ?? 0) - (a.created ?? 0));
  return newestFirst.find((s) => PREMIUM_STATUSES.has(s.status)) ?? newestFirst[0] ?? null;
}

/** Re-reads the customer's subscriptions from Stripe and stores the one that matters. */
export async function syncCustomer(
  db: Db,
  userId: string,
  customerId: string,
  stripe: StripeRequest,
  now = new Date(),
): Promise<SubscriptionRow | null> {
  const list = await stripe('GET', 'subscriptions', { customer: customerId, status: 'all', limit: 20 });
  const subscription = pickSubscription(list.data ?? []);
  const item = subscription?.items?.data?.[0];
  // Newer Stripe API versions keep the billing period on the item instead
  const periodEnd = subscription?.current_period_end ?? item?.current_period_end ?? null;

  await linkCustomer(db, userId, customerId, now);
  await db
    .prepare(
      `UPDATE subscriptions
       SET stripe_subscription_id = ?, plan = ?, status = ?, current_period_end = ?, cancel_at_period_end = ?, updated_at = ?
       WHERE user_id = ?`,
    )
    .run(
      subscription?.id ?? null,
      planForPrice(item?.price),
      subscription?.status ?? null,
      periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      subscription && (subscription.cancel_at_period_end || subscription.cancel_at) ? 1 : 0,
      now.toISOString(),
      userId,
    );
  return getSubscription(db, userId);
}

/**
 * The return trip from Stripe Checkout. Webhooks may arrive a moment later,
 * so the plan is pulled now rather than waited for.
 */
export async function completeCheckout(
  db: Db,
  userId: string,
  sessionId: string,
  options: BillingDeps = {},
): Promise<{ paid: boolean; access: Access }> {
  const { settings, stripe, now } = deps(options);
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,}$/.test(sessionId)) throw new BillingError('unknown-checkout', 'That checkout was not found.', 404);
  return withStripe(async () => {
    const session = await stripe('GET', `checkout/sessions/${sessionId}`);
    if (session.client_reference_id !== referenceFor(userId)) {
      throw new BillingError('not-your-checkout', 'That checkout belongs to a different account.', 403);
    }
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    if (customerId) await syncCustomer(db, userId, customerId, stripe, now);
    return {
      paid: session.status === 'complete' && session.payment_status !== 'unpaid',
      access: await getAccess(db, userId, { settings, stripe, now }),
    };
  });
}

const HANDLED_EVENTS = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed',
  'invoice.paid',
  'invoice.payment_failed',
]);

export interface WebhookResult {
  handled: boolean;
  type: string;
  userId?: string;
}

/** A Stripe webhook delivery: verified, then the customer it concerns is synced. */
export async function handleWebhook(
  db: Db,
  payload: string,
  signature: string | null,
  options: BillingDeps = {},
): Promise<WebhookResult> {
  const { settings, stripe, now } = deps(options);
  if (!settings.enabled || !settings.webhookSecret) {
    throw new BillingError('billing-off', 'Webhooks are not configured.', 503);
  }
  if (!verifyStripeSignature(payload, signature, settings.webhookSecret, { now: Math.floor(now.getTime() / 1000) })) {
    throw new BillingError('invalid-signature', 'The webhook signature did not verify.', 400);
  }

  const event = JSON.parse(payload) as { type: string; data?: { object?: Record<string, any> } };
  if (!HANDLED_EVENTS.has(event.type)) return { handled: false, type: event.type };
  const object = event.data?.object ?? {};
  const customerId: string | undefined = typeof object.customer === 'string' ? object.customer : object.customer?.id;
  if (!customerId) return { handled: false, type: event.type };

  // Who this customer is: the stored link first, then the id attached at checkout
  const linked = (await db.prepare('SELECT user_id FROM subscriptions WHERE stripe_customer_id = ?').get(customerId)) as
    | { user_id: string }
    | undefined;
  let userId = linked?.user_id ?? object.metadata?.examer_user_id ?? fromReference(object.client_reference_id);
  if (!userId) {
    const customer = await stripe('GET', `customers/${customerId}`);
    userId = customer.metadata?.examer_user_id;
  }
  // Another product on the same Stripe account, or an account deleted since: nothing to do
  if (!userId || !(await db.prepare('SELECT id FROM users WHERE id = ?').get(userId))) {
    return { handled: false, type: event.type };
  }

  await syncCustomer(db, userId, customerId, stripe, now);
  return { handled: true, type: event.type, userId };
}

function fromReference(value: unknown): string | undefined {
  return typeof value === 'string' && value.startsWith('examer:') ? value.slice('examer:'.length) : undefined;
}

/**
 * Before an account is deleted: end its subscriptions now, so nobody is billed
 * for an account that no longer exists. Throws if Stripe cannot confirm it.
 */
export async function cancelBeforeDeletion(db: Db, userId: string, options: BillingDeps = {}): Promise<void> {
  const { settings, stripe } = deps(options);
  if (!settings.enabled) {
    // A database still awaiting migration 010 has no subscriptions table, and
    // without billing nobody can have bought a plan there.
    const row = await getSubscription(db, userId).catch(() => null);
    if (premiumActive(row)) {
      throw new BillingError('billing-unavailable', 'Your Premium plan cannot be cancelled right now, so the account was not deleted. Please try again later.', 503);
    }
    return;
  }
  const row = await getSubscription(db, userId);
  if (!row) return;
  try {
    const list = await stripe('GET', 'subscriptions', { customer: row.stripe_customer_id, status: 'all', limit: 20 });
    for (const subscription of (list.data ?? []) as StripeSubscription[]) {
      if (['canceled', 'incomplete_expired'].includes(subscription.status)) continue;
      await stripe('DELETE', `subscriptions/${subscription.id}`);
    }
  } catch (error) {
    if (error instanceof StripeError && error.code === 'resource_missing') return;
    if (error instanceof StripeError) {
      console.error('[billing] cancel before deletion failed', error.status, error.code, error.message);
      throw new BillingError(
        'billing-unavailable',
        'Your Premium plan could not be cancelled just now, so the account was not deleted. Please try again in a few minutes.',
        503,
      );
    }
    throw error;
  }
}
