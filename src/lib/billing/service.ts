import type Stripe from 'stripe';
import type { Db } from '@/lib/db';
import { getExamConfig } from '@/lib/exams/registry';
import { countEvent, subjectFor } from '@/lib/analytics/funnel';
import { assertBillingConfig, type BillingSettings } from './config';
import { loadEntitlements } from './entitlements';
import { PLANS, isPlanKey, type PlanKey } from './plans';
import {
  eventSeen,
  getCustomerId,
  getSubscriptionRow,
  linkCustomer,
  listSubscriptions,
  recordEvent,
  snapshotFromStripe,
  storeSubscription,
  userExists,
  userForCustomer,
  type SubscriptionRow,
} from './store';
import { asStripeError, isSignatureError, stripeClient, verifyWebhookEvent, type StripeApi } from './stripe';

/**
 * Subscriptions through Stripe, sold and managed on this site's own pages.
 *
 * - The checkout page collects the card in Stripe's Payment Element (Stripe's
 *   iframes; card data never reaches this server). On "Pay", the server
 *   creates the subscription with payment_behavior 'default_incomplete' and
 *   returns the client secret of its first payment (or of its SetupIntent
 *   when nothing is due), which the browser confirms, 3-D Secure included.
 * - The account page cancels at period end, resumes, and replaces the card
 *   through a SetupIntent: no hosted Stripe pages anywhere.
 * - Webhooks keep the local copy in step (store.ts), idempotently.
 */

/**
 * Learner-facing messages, in English. Each is also in the `billing` message
 * catalogue under `errors.<key>`: a BillingError made by `billingError()`
 * carries its key in `detail.messageKey`, which the API passes on, so the page
 * shows the message in the buyer's language.
 */
export const BILLING_COPY = {
  billingOff: 'Payments are not switched on for this site yet. Nothing was charged.',
  accountRequired: 'Create an account first, so your plan has somewhere to live. Your guest practice comes with you.',
  consentRequired: 'Please confirm that you want access straight away and that the 14-day withdrawal right then ends.',
  unknownPlan: 'That plan does not exist.',
  unknownExam: 'Choose the exam this plan is for.',
  alreadyAllAccess: 'You already have All access, which includes every exam.',
  alreadyThisExam: 'You already have a plan for this exam.',
  misconfigured: 'Payments are not set up correctly yet. Nothing was charged.',
  unavailable: 'The payment provider is busy. Nothing was charged; please try again in a minute.',
  failed: 'The payment provider could not complete that. Nothing was charged.',
  retry: 'That request was already sent with different details. Reload the page and try again.',
  unknownSubscription: 'That subscription was not found.',
  notChangeable: 'That subscription has already ended.',
  noBillingAccount: 'There is no billing account yet. Choose a plan first.',
  cardNotSaved: 'The new card was not confirmed. Your previous card is unchanged.',
  countryRequired: 'Choose your country, so the right VAT can be applied.',
  deletionBlocked:
    'Your subscriptions could not be cancelled just now, so the account was not deleted. Please try again in a few minutes.',
  rateLimited: 'Too many tries. Please wait a few minutes.',
} as const;

export type BillingMessageKey = keyof typeof BILLING_COPY;

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

  /** The `billing.errors.*` key of this message, when it is one of BILLING_COPY. */
  get messageKey(): BillingMessageKey | null {
    const key = (this.detail as { messageKey?: unknown } | undefined)?.messageKey;
    return typeof key === 'string' && Object.prototype.hasOwnProperty.call(BILLING_COPY, key) ? (key as BillingMessageKey) : null;
  }
}

/** A BillingError with one of our messages, and its catalogue key for the page to translate. */
export function billingError(code: string, key: BillingMessageKey, status = 400): BillingError {
  return new BillingError(code, BILLING_COPY[key], status, { messageKey: key });
}

export interface BillingDeps {
  settings?: BillingSettings;
  stripe?: StripeApi | null;
  now?: Date;
}

function resolveDeps(options: BillingDeps) {
  const settings = options.settings ?? assertBillingConfig();
  const stripe = options.stripe !== undefined ? options.stripe : settings.secretKey ? stripeClient(settings) : null;
  return { settings, stripe, now: options.now ?? new Date() };
}

const seconds = (date: Date) => Math.floor(date.getTime() / 1000);
const idOf = (value: string | { id: string } | null | undefined) => (typeof value === 'string' ? value : (value?.id ?? null));

function explainStripeError(error: unknown): unknown {
  const stripeError = asStripeError(error);
  if (!stripeError) return error;
  console.error('[billing] Stripe error', stripeError.statusCode, stripeError.type, stripeError.code, stripeError.message);
  if (stripeError.type === 'StripeAuthenticationError' || stripeError.type === 'StripePermissionError') {
    return billingError('billing-misconfigured', 'misconfigured', 503);
  }
  if (/stripe tax|tax settings|head office|origin address|tax_location/i.test(stripeError.message)) {
    return billingError('billing-misconfigured', 'misconfigured', 503);
  }
  if (stripeError.type === 'StripeIdempotencyError') return billingError('retry', 'retry', 409);
  if (
    stripeError.type === 'StripeRateLimitError' ||
    stripeError.type === 'StripeConnectionError' ||
    stripeError.type === 'StripeAPIError' ||
    (stripeError.statusCode ?? 0) >= 500
  ) {
    return billingError('billing-unavailable', 'unavailable', 503);
  }
  return billingError('billing-failed', 'failed', 502);
}

async function withStripe<T>(work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    throw explainStripeError(error);
  }
}

function requireStripe(stripe: StripeApi | null): StripeApi {
  if (!stripe) throw billingError('billing-off', 'billingOff', 503);
  return stripe;
}

// ---------------------------------------------------------------------------
// Customers and prices
// ---------------------------------------------------------------------------

export interface BillingUser {
  id: string;
  email: string | null;
  displayName: string | null;
  isGuest: boolean;
}

/** The user's Stripe customer, created on the first purchase. A stored one deleted in Stripe is replaced. */
export async function ensureCustomer(db: Db, user: BillingUser, stripe: StripeApi, now = new Date()): Promise<string> {
  const existing = await getCustomerId(db, user.id);
  if (existing) {
    try {
      const customer = await stripe.customers.retrieve(existing);
      if (!('deleted' in customer && customer.deleted)) {
        if (user.email && (customer as Stripe.Customer).email !== user.email) {
          await stripe.customers.update(existing, { email: user.email });
        }
        return existing;
      }
    } catch (error) {
      if (asStripeError(error)?.code !== 'resource_missing') throw error;
    }
  }
  const customer = await stripe.customers.create(
    {
      email: user.email ?? undefined,
      ...(user.displayName ? { name: user.displayName } : {}),
      metadata: { examer_user_id: user.id },
    },
    { idempotencyKey: `examer-customer-${user.id}-${existing ?? 'first'}` },
  );
  await linkCustomer(db, user.id, customer.id, now);
  return customer.id;
}

/** The Stripe price for a plan, by its lookup key. Created by scripts/stripe-setup.ts, never here. */
export async function priceIdFor(stripe: StripeApi, plan: PlanKey): Promise<string> {
  const found = await stripe.prices.list({ lookup_keys: [PLANS[plan].lookupKey], active: true, limit: 1 });
  const price = found.data[0];
  if (!price) {
    console.error(`[billing] no active Stripe price with lookup key ${PLANS[plan].lookupKey}; run scripts/stripe-setup.ts`);
    throw billingError('billing-misconfigured', 'misconfigured', 503);
  }
  return price.id;
}

// ---------------------------------------------------------------------------
// Buying
// ---------------------------------------------------------------------------

export interface CreateSubscriptionInput {
  plan: PlanKey;
  /** The exam a single-exam plan is for. */
  examKey?: string | null;
  /** The exam the learner came from, for counting; never changes the plan. */
  sourceExam?: string | null;
  /** The buyer asked for immediate access and acknowledged losing the withdrawal right. */
  consent: boolean;
  /** One per checkout page view, so a double click cannot create two subscriptions. */
  requestId: string;
  /** ISO country code, needed only when Stripe Tax is on. */
  country?: string | null;
}

export interface CreatedSubscription {
  subscriptionId: string;
  /** What the browser confirms: the first payment, a SetupIntent (nothing due now), or nothing. */
  intent: 'payment' | 'setup' | 'none';
  clientSecret: string | null;
  status: string;
}

function intentOf(subscription: Stripe.Subscription): Pick<CreatedSubscription, 'intent' | 'clientSecret'> {
  const invoice = typeof subscription.latest_invoice === 'object' ? subscription.latest_invoice : null;
  const payment = invoice?.confirmation_secret?.client_secret ?? null;
  if (payment) return { intent: 'payment', clientSecret: payment };
  const setup = typeof subscription.pending_setup_intent === 'object' ? subscription.pending_setup_intent?.client_secret : null;
  if (setup) return { intent: 'setup', clientSecret: setup };
  return { intent: 'none', clientSecret: null };
}

const EXPAND = ['latest_invoice.confirmation_secret', 'pending_setup_intent'];

/** An incomplete subscription is confirmable for 23 hours, then Stripe expires it. */
const PENDING_REUSE_MS = 22 * 60 * 60 * 1000;

export async function createSubscription(
  db: Db,
  user: BillingUser,
  input: CreateSubscriptionInput,
  options: BillingDeps = {},
): Promise<CreatedSubscription> {
  const { settings, stripe: maybeStripe, now } = resolveDeps(options);
  if (!settings.checkoutAvailable) throw billingError('billing-off', 'billingOff', 503);
  const stripe = requireStripe(maybeStripe);
  if (user.isGuest || !user.email) throw billingError('account-required', 'accountRequired', 403);
  if (input.consent !== true) throw billingError('consent-required', 'consentRequired', 400);
  if (!isPlanKey(input.plan)) throw billingError('unknown-plan', 'unknownPlan', 400);

  const plan = PLANS[input.plan];
  const examKey = plan.scope === 'one-exam' ? (input.examKey ?? null) : null;
  if (plan.scope === 'one-exam' && (!examKey || !getExamConfig(examKey))) {
    throw billingError('unknown-exam', 'unknownExam', 400);
  }
  const sourceExam = input.sourceExam && getExamConfig(input.sourceExam) ? input.sourceExam : null;
  const country = input.country?.trim().toUpperCase() || null;
  if (settings.automaticTax && !(country && /^[A-Z]{2}$/.test(country))) {
    throw billingError('country-required', 'countryRequired', 400);
  }

  // Never sell what the learner already has. Checked whether or not the
  // paywall is on, so a rehearsal in test mode behaves like the real thing.
  const owned = await loadEntitlements(db, user.id, { settings: { ...settings, enforced: true }, now });
  if (owned.hasAllAccess) throw billingError('already-subscribed', 'alreadyAllAccess', 409);
  if (examKey && owned.singleExamKeys.includes(examKey)) {
    throw billingError('already-subscribed', 'alreadyThisExam', 409);
  }

  return withStripe(async () => {
    const customer = await ensureCustomer(db, user, stripe, now);

    // Going back and forth on the checkout page reuses the subscription that
    // is still waiting for this same plan, rather than leaving a trail of them.
    const pending = (await listSubscriptions(db, user.id))
      .filter(
        (row) =>
          row.status === 'incomplete' &&
          row.plan === input.plan &&
          row.exam_key === examKey &&
          now.getTime() - new Date(row.created_at).getTime() < PENDING_REUSE_MS,
      )
      .reverse();
    for (const row of pending) {
      const current = await stripe.subscriptions.retrieve(row.stripe_subscription_id, { expand: EXPAND });
      await storeSubscription(db, user.id, current, { syncedAt: seconds(now), now });
      const intent = intentOf(current);
      if (current.status === 'incomplete' && intent.clientSecret) {
        return { subscriptionId: current.id, status: current.status, ...intent };
      }
    }

    const price = await priceIdFor(stripe, input.plan);
    if (settings.automaticTax && country) {
      await stripe.customers.update(customer, { address: { country } });
    }
    const waiverAt = now.toISOString();
    const metadata: Record<string, string> = {
      examer_user_id: user.id,
      plan: input.plan,
      withdrawal_waiver_at: waiverAt,
      ...(examKey ? { exam_key: examKey } : {}),
      ...(sourceExam ? { source_exam: sourceExam } : {}),
    };
    const subscription = await stripe.subscriptions.create(
      {
        customer,
        items: [{ price, quantity: 1 }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription', payment_method_types: ['card'] },
        expand: EXPAND,
        metadata,
        ...(settings.automaticTax ? { automatic_tax: { enabled: true } } : {}),
      },
      { idempotencyKey: `examer-sub-${user.id}-${input.plan}-${examKey ?? 'all'}-${input.requestId}` },
    );
    await storeSubscription(db, user.id, subscription, {
      syncedAt: subscription.created ?? seconds(now),
      now,
      withdrawalWaiverAt: waiverAt,
      sourceExam,
    });
    await countEvent(db, 'checkout_start', subjectFor(examKey ?? sourceExam), 'n/a', now);
    return { subscriptionId: subscription.id, status: subscription.status, ...intentOf(subscription) };
  });
}

/** After the browser confirms (or returns from 3-D Secure): the subscription as Stripe now has it. */
export async function syncSubscriptionForUser(
  db: Db,
  userId: string,
  subscriptionId: string,
  options: BillingDeps = {},
): Promise<SubscriptionRow> {
  const { stripe, now } = resolveDeps(options);
  const row = await getSubscriptionRow(db, subscriptionId);
  if (!row || row.user_id !== userId) throw billingError('unknown-subscription', 'unknownSubscription', 404);
  if (!stripe) return row;
  try {
    const fresh = await stripe.subscriptions.retrieve(subscriptionId);
    const stored = await storeSubscription(db, userId, fresh, { syncedAt: seconds(now), now });
    return stored.row ?? row;
  } catch (error) {
    // The page can still show what the webhooks have told us.
    console.error('[billing] could not refresh a subscription:', error instanceof Error ? error.message : error);
    return row;
  }
}

// ---------------------------------------------------------------------------
// Managing
// ---------------------------------------------------------------------------

const CHANGEABLE = new Set(['active', 'trialing', 'past_due']);

/** Cancel at the end of the paid period, or undo that. */
export async function setCancelAtPeriodEnd(
  db: Db,
  userId: string,
  subscriptionId: string,
  cancel: boolean,
  options: BillingDeps = {},
): Promise<SubscriptionRow> {
  const { stripe: maybeStripe, now } = resolveDeps(options);
  const stripe = requireStripe(maybeStripe);
  const row = await getSubscriptionRow(db, subscriptionId);
  if (!row || row.user_id !== userId) throw billingError('unknown-subscription', 'unknownSubscription', 404);
  if (!CHANGEABLE.has(row.status)) throw billingError('not-changeable', 'notChangeable', 409);
  return withStripe(async () => {
    const updated = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: cancel });
    const stored = await storeSubscription(db, userId, updated, { syncedAt: seconds(now), now });
    return stored.row ?? row;
  });
}

/** A SetupIntent for a new card, confirmed in the browser with the same styled Payment Element. */
export async function startCardUpdate(db: Db, userId: string, options: BillingDeps = {}): Promise<{ clientSecret: string }> {
  const { stripe: maybeStripe } = resolveDeps(options);
  const stripe = requireStripe(maybeStripe);
  const customer = await getCustomerId(db, userId);
  if (!customer) throw billingError('no-billing-account', 'noBillingAccount', 404);
  return withStripe(async () => {
    const intent = await stripe.setupIntents.create({
      customer,
      usage: 'off_session',
      payment_method_types: ['card'],
      metadata: { examer_user_id: userId, purpose: 'card_update' },
    });
    if (!intent.client_secret) throw billingError('billing-failed', 'failed', 502);
    return { clientSecret: intent.client_secret };
  });
}

/**
 * Makes a confirmed card the default for the customer and every live
 * subscription, then retries any renewal that failed on the old card.
 */
export async function finishCardUpdate(
  db: Db,
  userId: string,
  setupIntentId: string,
  options: BillingDeps = {},
): Promise<{ updated: number; retried: number }> {
  const { stripe: maybeStripe, now } = resolveDeps(options);
  const stripe = requireStripe(maybeStripe);
  if (!/^seti_[A-Za-z0-9]+$/.test(setupIntentId)) throw billingError('card-not-saved', 'cardNotSaved', 400);
  const customer = await getCustomerId(db, userId);
  if (!customer) throw billingError('no-billing-account', 'noBillingAccount', 404);

  return withStripe(async () => {
    const intent = await stripe.setupIntents.retrieve(setupIntentId);
    const paymentMethod = idOf(intent.payment_method);
    if (idOf(intent.customer) !== customer || intent.status !== 'succeeded' || !paymentMethod) {
      throw billingError('card-not-saved', 'cardNotSaved', 409);
    }
    await stripe.customers.update(customer, { invoice_settings: { default_payment_method: paymentMethod } });

    let updated = 0;
    let retried = 0;
    for (const row of await listSubscriptions(db, userId)) {
      if (!CHANGEABLE.has(row.status)) continue;
      let subscription = await stripe.subscriptions.update(row.stripe_subscription_id, { default_payment_method: paymentMethod });
      updated += 1;
      const invoiceId = idOf(subscription.latest_invoice);
      if (subscription.status === 'past_due' && invoiceId) {
        try {
          await stripe.invoices.pay(invoiceId, { payment_method: paymentMethod });
          retried += 1;
          subscription = await stripe.subscriptions.retrieve(subscription.id);
        } catch (error) {
          // Stripe keeps retrying on its own schedule with the new card.
          console.warn('[billing] immediate retry of a failed renewal did not succeed:', error instanceof Error ? error.message : error);
        }
      }
      await storeSubscription(db, userId, subscription, { syncedAt: seconds(now), now });
    }
    return { updated, retried };
  });
}

export interface CardSummary {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface BillingOverview {
  subscriptions: SubscriptionRow[];
  card: CardSummary | null;
  /** False when Stripe could not be asked just now and the rows may be a little behind. */
  fresh: boolean;
}

function cardOf(method: string | Stripe.PaymentMethod | null | undefined): CardSummary | null {
  if (!method || typeof method === 'string' || !method.card) return null;
  return { brand: method.card.brand, last4: method.card.last4, expMonth: method.card.exp_month, expYear: method.card.exp_year };
}

/** The account page's view: every subscription, refreshed from Stripe when it can be, and the card on file. */
export async function billingOverview(db: Db, userId: string, options: BillingDeps = {}): Promise<BillingOverview> {
  const { stripe, now } = resolveDeps(options);
  const customer = await getCustomerId(db, userId).catch(() => null);
  if (!customer || !stripe) {
    return { subscriptions: await listSubscriptions(db, userId).catch(() => []), card: null, fresh: !customer };
  }
  try {
    const list = await stripe.subscriptions.list({ customer, status: 'all', limit: 100, expand: ['data.default_payment_method'] });
    let card: CardSummary | null = null;
    for (const subscription of list.data) {
      if (!snapshotFromStripe(subscription)) continue;
      await storeSubscription(db, userId, subscription, { syncedAt: seconds(now), now });
      if (!card && CHANGEABLE.has(subscription.status)) card = cardOf(subscription.default_payment_method);
    }
    if (!card) {
      const record = await stripe.customers.retrieve(customer, { expand: ['invoice_settings.default_payment_method'] });
      if (!('deleted' in record && record.deleted)) {
        card = cardOf((record as Stripe.Customer).invoice_settings?.default_payment_method as Stripe.PaymentMethod | string | null);
      }
    }
    return { subscriptions: await listSubscriptions(db, userId), card, fresh: true };
  } catch (error) {
    console.error('[billing] could not refresh the account billing view:', error instanceof Error ? error.message : error);
    return { subscriptions: await listSubscriptions(db, userId), card: null, fresh: false };
  }
}

// ---------------------------------------------------------------------------
// Webhooks
// ---------------------------------------------------------------------------

export const HANDLED_EVENTS = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
]);

export interface WebhookResult {
  type: string;
  /** Already processed: nothing was done again. */
  duplicate: boolean;
  /** Something here changed (false for another product's customer, or an event type not handled). */
  handled: boolean;
  userId?: string;
}

/** Which account a subscription belongs to: our own metadata, the stored link, then the Stripe customer. */
async function resolveUser(db: Db, subscription: Stripe.Subscription, stripe: StripeApi | null): Promise<string | null> {
  const hinted = subscription.metadata?.examer_user_id;
  if (hinted && (await userExists(db, hinted))) return hinted;
  const customerId = idOf(subscription.customer);
  if (!customerId) return null;
  const linked = await userForCustomer(db, customerId);
  if (linked && (await userExists(db, linked))) return linked;
  if (!stripe) return null;
  const customer = await stripe.customers.retrieve(customerId);
  const fromCustomer = 'metadata' in customer ? customer.metadata?.examer_user_id : undefined;
  return fromCustomer && (await userExists(db, fromCustomer)) ? fromCustomer : null;
}

/** The subscription an invoice belongs to (current API versions put it under `parent`). */
function subscriptionOfInvoice(invoice: Stripe.Invoice): string | null {
  const fromParent = idOf(invoice.parent?.subscription_details?.subscription ?? null);
  const legacy = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
  return fromParent ?? idOf(legacy ?? null);
}

/**
 * A Stripe webhook delivery. The signature is checked against the raw body;
 * an event already processed is acknowledged and skipped; subscription events
 * older than what is stored are ignored. Throws BillingError('invalid-signature')
 * for a delivery that does not verify.
 */
export async function handleWebhook(
  db: Db,
  payload: string,
  signature: string | null,
  options: BillingDeps = {},
): Promise<WebhookResult> {
  const { settings, stripe, now } = resolveDeps(options);
  if (!settings.webhookSecret) throw new BillingError('billing-off', 'Webhooks are not configured.', 503);

  let event: Stripe.Event;
  try {
    event = await verifyWebhookEvent(payload, signature, settings.webhookSecret, { nowMs: now.getTime() });
  } catch (error) {
    if (isSignatureError(error)) throw new BillingError('invalid-signature', 'The webhook signature did not verify.', 400);
    throw error;
  }

  if (!HANDLED_EVENTS.has(event.type)) return { type: event.type, duplicate: false, handled: false };
  if (await eventSeen(db, event.id)) return { type: event.type, duplicate: true, handled: false };

  // Work out what to store before taking the write lock: it may ask Stripe.
  let subscription: Stripe.Subscription | null = null;
  let syncedAt = event.created;
  if (event.type.startsWith('customer.subscription.')) {
    subscription = event.data.object as Stripe.Subscription;
  } else {
    const subscriptionId = subscriptionOfInvoice(event.data.object as Stripe.Invoice);
    if (subscriptionId && stripe) {
      // An invoice does not carry the subscription's new state, so read it now.
      subscription = await stripe.subscriptions.retrieve(subscriptionId);
      syncedAt = Math.max(event.created, seconds(now));
    }
  }
  const ours = subscription && snapshotFromStripe(subscription) ? subscription : null;
  const userId = ours ? await resolveUser(db, ours, stripe) : null;

  return db.transaction(async () => {
    const first = await recordEvent(db, event, Boolean(userId), now);
    if (!first) return { type: event.type, duplicate: true, handled: false };
    if (!ours || !userId) return { type: event.type, duplicate: false, handled: false };
    await storeSubscription(db, userId, ours, { syncedAt, now });
    return { type: event.type, duplicate: false, handled: true, userId };
  })();
}

// ---------------------------------------------------------------------------
// Account deletion
// ---------------------------------------------------------------------------

/**
 * Before an account is deleted: end its subscriptions now, so nobody is billed
 * for an account that no longer exists. Throws if Stripe cannot confirm it.
 */
export async function cancelBeforeDeletion(db: Db, userId: string, options: BillingDeps = {}): Promise<void> {
  const settings = options.settings ?? assertBillingConfig();
  const stripe = options.stripe !== undefined ? options.stripe : settings.secretKey ? stripeClient(settings) : null;
  // A database still awaiting migration 012 has no billing tables; nobody can have paid there.
  const customer = await getCustomerId(db, userId).catch(() => null);
  if (!customer) return;
  if (!stripe) {
    const live = (await listSubscriptions(db, userId).catch(() => [])).some((row) => CHANGEABLE.has(row.status));
    if (live) throw billingError('billing-unavailable', 'deletionBlocked', 503);
    return;
  }
  try {
    const list = await stripe.subscriptions.list({ customer, status: 'all', limit: 100 });
    for (const subscription of list.data) {
      if (['canceled', 'incomplete_expired'].includes(subscription.status)) continue;
      await stripe.subscriptions.cancel(subscription.id);
    }
  } catch (error) {
    if (asStripeError(error)?.code === 'resource_missing') return;
    if (asStripeError(error)) {
      console.error('[billing] cancel before deletion failed:', asStripeError(error)?.message);
      throw billingError('billing-unavailable', 'deletionBlocked', 503);
    }
    throw error;
  }
}
