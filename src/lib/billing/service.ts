import type Stripe from 'stripe';
import type { Db } from '@/lib/db';
import { getExamConfig } from '@/lib/exams/registry';
import { countEvent, subjectFor } from '@/lib/analytics/funnel';
import { assertBillingConfig, type BillingSettings } from './config';
import { examSaleStatus } from './availability';
import { loadEntitlements } from './entitlements';
import { CURRENCY, PLANS, PLAN_COPY, PRICES, isPriceKey, type PriceKey } from './plans';
import {
  PASS_INVOICE_PURPOSE,
  eventSeen,
  getCustomerId,
  getPassByPaymentIntent,
  getPassRow,
  getSubscriptionRow,
  linkCustomer,
  listPasses,
  listSubscriptions,
  markPassRefunded,
  passSnapshotFromInvoice,
  recordEvent,
  snapshotFromStripe,
  storePass,
  storeSubscription,
  userExists,
  userForCustomer,
  type PassRow,
  type SubscriptionRow,
} from './store';
import { WEBHOOK_EVENTS, asStripeError, isSignatureError, stripeClient, verifyWebhookEvent, type StripeApi } from './stripe';

/**
 * Payments through Stripe, sold and managed on this site's own pages.
 *
 * - The checkout page collects the card in Stripe's Payment Element (Stripe's
 *   iframes; card data never reaches this server). On "Pay", the server
 *   creates what is being bought and returns the client secret the browser
 *   confirms, 3-D Secure included:
 *     Plus (monthly or yearly)  a subscription, payment_behavior
 *                               'default_incomplete': the client secret of its
 *                               first payment (or SetupIntent when nothing is due)
 *     Single Exam Pass          a one-off invoice for the pass price, finalised
 *                               without auto-advance (Stripe never charges it on
 *                               its own): the client secret of its payment
 *   Premium is announced but not sold: the server refuses it.
 * - A pass gives access only once Stripe records the payment (the invoice.paid
 *   webhook, or the invoice read back from Stripe by the server), for six
 *   calendar months from that moment. The browser's word is never enough.
 * - The account page cancels a subscription at period end, resumes it, and
 *   replaces the card through a SetupIntent: no hosted Stripe pages anywhere.
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
  unknownPlan: 'That plan is not on sale.',
  comingSoon: 'Premium is coming soon and cannot be bought yet. Nothing was charged.',
  unknownExam: 'Choose the exam this pass is for.',
  examUnavailable:
    'A pass for this exam cannot be bought yet: none of its practice formats has enough reviewed questions to open. Nothing was charged.',
  alreadyAllAccess: 'You already have a plan that includes every exam.',
  alreadyThisExam: 'You already have access to this exam.',
  misconfigured: 'Payments are not set up correctly yet. Nothing was charged.',
  unavailable: 'The payment provider is busy. Nothing was charged; please try again in a minute.',
  failed: 'The payment provider could not complete that. Nothing was charged.',
  retry: 'That request was already sent with different details. Reload the page and try again.',
  unknownSubscription: 'That subscription was not found.',
  unknownPass: 'That pass was not found.',
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

/**
 * The Stripe price for one of PRICES, by its lookup key. Created by
 * scripts/stripe-setup.ts, never here. A price whose amount, currency, tax
 * behaviour or interval differs from plans.ts is refused: the buyer must be
 * charged exactly what the page showed.
 */
export async function priceIdFor(stripe: StripeApi, key: PriceKey): Promise<string> {
  const wanted = PRICES[key];
  const found = await stripe.prices.list({ lookup_keys: [wanted.lookupKey], active: true, limit: 1 });
  const price = found.data[0];
  if (!price) {
    console.error(`[billing] no active Stripe price with lookup key ${wanted.lookupKey}; run scripts/stripe-setup.ts`);
    throw billingError('billing-misconfigured', 'misconfigured', 503);
  }
  const interval = price.recurring?.interval ?? 'once';
  if (
    price.unit_amount !== wanted.amount ||
    price.currency !== CURRENCY ||
    price.tax_behavior !== 'inclusive' ||
    interval !== wanted.interval ||
    (price.recurring?.interval_count ?? 1) !== 1
  ) {
    console.error(`[billing] Stripe price ${price.id} (${wanted.lookupKey}) does not match plans.ts; run scripts/stripe-setup.ts --dry-run`);
    throw billingError('billing-misconfigured', 'misconfigured', 503);
  }
  return price.id;
}

// ---------------------------------------------------------------------------
// Buying
// ---------------------------------------------------------------------------

export interface CheckoutInput {
  /** What is being bought: one of OFFERS in plans.ts. Anything else is refused. */
  offer: PriceKey;
  /** The exam a Single Exam Pass is for. */
  examKey?: string | null;
  /** The exam the learner came from, for counting; never changes the plan. */
  sourceExam?: string | null;
  /** The buyer asked for immediate access and acknowledged losing the withdrawal right. */
  consent: boolean;
  /** One per checkout page view, so a double click cannot create two purchases. */
  requestId: string;
  /** ISO country code, needed only when Stripe Tax is on. */
  country?: string | null;
}

export interface CheckoutStarted {
  /** A Plus subscription, or a Single Exam Pass (one invoice). */
  kind: 'subscription' | 'pass';
  /** The subscription id, or the pass's invoice id. */
  id: string;
  /** What the browser confirms: the first payment, a SetupIntent (nothing due now), or nothing. */
  intent: 'payment' | 'setup' | 'none';
  clientSecret: string | null;
  status: string;
}

function subscriptionIntent(subscription: Stripe.Subscription): Pick<CheckoutStarted, 'intent' | 'clientSecret'> {
  const invoice = typeof subscription.latest_invoice === 'object' ? subscription.latest_invoice : null;
  const payment = invoice?.confirmation_secret?.client_secret ?? null;
  if (payment) return { intent: 'payment', clientSecret: payment };
  const setup = typeof subscription.pending_setup_intent === 'object' ? subscription.pending_setup_intent?.client_secret : null;
  if (setup) return { intent: 'setup', clientSecret: setup };
  return { intent: 'none', clientSecret: null };
}

function invoiceIntent(invoice: Stripe.Invoice): Pick<CheckoutStarted, 'intent' | 'clientSecret'> {
  const secret = invoice.confirmation_secret?.client_secret ?? null;
  return secret ? { intent: 'payment', clientSecret: secret } : { intent: 'none', clientSecret: null };
}

const SUBSCRIPTION_EXPAND = ['latest_invoice.confirmation_secret', 'pending_setup_intent'];

/** An incomplete subscription is confirmable for 23 hours, then Stripe expires it; a pending pass is reused as long. */
const PENDING_REUSE_MS = 22 * 60 * 60 * 1000;

/**
 * Starts paying for one of the offers on sale. Everything that decides what
 * may be sold is checked here, on the server, whatever the page showed:
 * Premium and the earlier plans are refused, a pass needs an exam with an
 * open practice format, and nothing the learner already holds is sold again.
 */
export async function startCheckout(
  db: Db,
  user: BillingUser,
  input: CheckoutInput,
  options: BillingDeps = {},
): Promise<CheckoutStarted> {
  const { settings, stripe: maybeStripe, now } = resolveDeps(options);
  if (!settings.checkoutAvailable) throw billingError('billing-off', 'billingOff', 503);
  const stripe = requireStripe(maybeStripe);
  if (user.isGuest || !user.email) throw billingError('account-required', 'accountRequired', 403);
  if (input.consent !== true) throw billingError('consent-required', 'consentRequired', 400);
  if (!isPriceKey(input.offer)) throw billingError('unknown-plan', 'unknownPlan', 400);
  const price = PRICES[input.offer];
  const plan = PLANS[price.plan];
  if (plan.status === 'coming-soon') throw billingError('coming-soon', 'comingSoon', 409);
  if (plan.status !== 'on-sale') throw billingError('unknown-plan', 'unknownPlan', 400);

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
  if (examKey && owned.singleExamKeys.includes(examKey)) throw billingError('already-subscribed', 'alreadyThisExam', 409);

  // Only sell what can be delivered: a pass needs an open paid practice format today.
  if (examKey && !(await examSaleStatus(db, examKey))?.sellable) {
    throw billingError('exam-unavailable', 'examUnavailable', 409);
  }

  const context = { user, stripe, settings, now, country, sourceExam, requestId: input.requestId };
  return withStripe(() =>
    plan.billing === 'one-time' ? createPass(db, context, input.offer, examKey!) : createSubscription(db, context, input.offer),
  );
}

interface CheckoutContext {
  user: BillingUser;
  stripe: StripeApi;
  settings: BillingSettings;
  now: Date;
  country: string | null;
  sourceExam: string | null;
  requestId: string;
}

async function prepareCustomer(db: Db, context: CheckoutContext): Promise<string> {
  const customer = await ensureCustomer(db, context.user, context.stripe, context.now);
  if (context.settings.automaticTax && context.country) {
    await context.stripe.customers.update(customer, { address: { country: context.country } });
  }
  return customer;
}

/** Plus, monthly or yearly: a subscription confirmed in the browser. */
async function createSubscription(db: Db, context: CheckoutContext, offer: PriceKey): Promise<CheckoutStarted> {
  const { user, stripe, settings, now, sourceExam } = context;
  const wanted = PRICES[offer];

  // Going back and forth on the checkout page reuses the subscription that
  // is still waiting for this same price, rather than leaving a trail of them.
  const pending = (await listSubscriptions(db, user.id))
    .filter(
      (row) =>
        row.status === 'incomplete' &&
        row.price_lookup_key === wanted.lookupKey &&
        now.getTime() - new Date(row.created_at).getTime() < PENDING_REUSE_MS,
    )
    .reverse();
  for (const row of pending) {
    const current = await stripe.subscriptions.retrieve(row.stripe_subscription_id, { expand: SUBSCRIPTION_EXPAND });
    await storeSubscription(db, user.id, current, { syncedAt: seconds(now), now });
    const intent = subscriptionIntent(current);
    if (current.status === 'incomplete' && intent.clientSecret) {
      return { kind: 'subscription', id: current.id, status: current.status, ...intent };
    }
  }

  const customer = await prepareCustomer(db, context);
  const price = await priceIdFor(stripe, offer);
  const waiverAt = now.toISOString();
  const metadata: Record<string, string> = {
    examer_user_id: user.id,
    plan: wanted.plan,
    price_key: offer,
    withdrawal_waiver_at: waiverAt,
    ...(sourceExam ? { source_exam: sourceExam } : {}),
  };
  const subscription = await stripe.subscriptions.create(
    {
      customer,
      items: [{ price, quantity: 1 }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription', payment_method_types: ['card'] },
      expand: SUBSCRIPTION_EXPAND,
      metadata,
      ...(settings.automaticTax ? { automatic_tax: { enabled: true } } : {}),
    },
    { idempotencyKey: `examer-sub-${user.id}-${offer}-${context.requestId}` },
  );
  await storeSubscription(db, user.id, subscription, {
    syncedAt: subscription.created ?? seconds(now),
    now,
    withdrawalWaiverAt: waiverAt,
    sourceExam,
  });
  await countEvent(db, 'checkout_start', subjectFor(sourceExam), 'n/a', now);
  return { kind: 'subscription', id: subscription.id, status: subscription.status, ...subscriptionIntent(subscription) };
}

/**
 * A Single Exam Pass: one invoice for the pass price, finalised with
 * auto-advance off, so Stripe never tries to charge it by itself: only the
 * buyer confirming it on our page pays it. Its access starts when Stripe
 * records the payment (storePass), not here.
 */
async function createPass(db: Db, context: CheckoutContext, offer: PriceKey, examKey: string): Promise<CheckoutStarted> {
  const { user, stripe, settings, now, sourceExam } = context;
  const wanted = PRICES[offer];

  // Reuse the pass invoice still waiting for this exam (two tabs, a reload),
  // so one learner can never be asked to pay twice for the same exam. Older
  // unpaid ones are voided for the same reason.
  const pending = (await listPasses(db, user.id)).filter((row) => row.status === 'pending' && row.exam_key === examKey).reverse();
  for (const row of pending) {
    const current = await stripe.invoices.retrieve(row.stripe_invoice_id, { expand: ['confirmation_secret', 'payments'] });
    const fresh = now.getTime() - new Date(row.created_at).getTime() < PENDING_REUSE_MS;
    if (current.status === 'open' && !fresh) {
      const voided = await stripe.invoices.voidInvoice(row.stripe_invoice_id);
      await storePass(db, user.id, voided, { syncedAt: seconds(now), now });
      continue;
    }
    await storePass(db, user.id, current, { syncedAt: seconds(now), now });
    if (current.status === 'paid') throw billingError('already-subscribed', 'alreadyThisExam', 409);
    const intent = invoiceIntent(current);
    if (current.status === 'open' && intent.clientSecret) {
      return { kind: 'pass', id: row.stripe_invoice_id, status: 'pending', ...intent };
    }
  }

  const customer = await prepareCustomer(db, context);
  const price = await priceIdFor(stripe, offer);
  const waiverAt = now.toISOString();
  const metadata: Record<string, string> = {
    examer_user_id: user.id,
    examer_purchase: PASS_INVOICE_PURPOSE,
    plan: wanted.plan,
    price_key: offer,
    price_lookup_key: wanted.lookupKey,
    exam_key: examKey,
    withdrawal_waiver_at: waiverAt,
    ...(sourceExam ? { source_exam: sourceExam } : {}),
  };
  const key = `examer-pass-${user.id}-${examKey}-${context.requestId}`;
  const draft = await stripe.invoices.create(
    {
      customer,
      currency: CURRENCY,
      collection_method: 'charge_automatically',
      auto_advance: false,
      pending_invoice_items_behavior: 'exclude',
      description: `${PLAN_COPY.plans.exam_pass.name}: ${getExamConfig(examKey)?.name ?? examKey}. Access for six months from payment; does not renew.`,
      payment_settings: { payment_method_types: ['card'] },
      metadata,
      ...(settings.automaticTax ? { automatic_tax: { enabled: true } } : {}),
    },
    { idempotencyKey: key },
  );
  await stripe.invoiceItems.create(
    { customer, invoice: draft.id, pricing: { price }, quantity: 1, metadata: { examer_user_id: user.id, exam_key: examKey } },
    { idempotencyKey: `${key}-item` },
  );
  const invoice = await stripe.invoices.finalizeInvoice(
    draft.id,
    { auto_advance: false, expand: ['confirmation_secret'] },
    { idempotencyKey: `${key}-finalize` },
  );
  await storePass(db, user.id, invoice, {
    syncedAt: invoice.created ?? seconds(now),
    now,
    withdrawalWaiverAt: waiverAt,
    sourceExam,
  });
  await countEvent(db, 'checkout_start', subjectFor(examKey), 'n/a', now);
  return { kind: 'pass', id: invoice.id, status: 'pending', ...invoiceIntent(invoice) };
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

/**
 * After the browser confirms a pass: the pass as Stripe now records it. The
 * invoice is read from Stripe by the server; only Stripe saying "paid" starts
 * the access term. Another account's pass looks like one that does not exist.
 */
export async function syncPassForUser(db: Db, userId: string, invoiceId: string, options: BillingDeps = {}): Promise<PassRow> {
  const { stripe, now } = resolveDeps(options);
  const row = await getPassRow(db, invoiceId).catch(() => null);
  if (!row || row.user_id !== userId) throw billingError('unknown-pass', 'unknownPass', 404);
  if (!stripe || row.status === 'refunded' || row.status === 'void') return row;
  try {
    const fresh = await stripe.invoices.retrieve(invoiceId, { expand: ['payments'] });
    const stored = await storePass(db, userId, fresh, { syncedAt: seconds(now), now });
    return stored.row ?? (await getPassRow(db, invoiceId)) ?? row;
  } catch (error) {
    console.error('[billing] could not refresh a pass:', error instanceof Error ? error.message : error);
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
  /** Single Exam Passes, oldest first. */
  passes: PassRow[];
  card: CardSummary | null;
  /** False when Stripe could not be asked just now and the rows may be a little behind. */
  fresh: boolean;
}

function cardOf(method: string | Stripe.PaymentMethod | null | undefined): CardSummary | null {
  if (!method || typeof method === 'string' || !method.card) return null;
  return { brand: method.card.brand, last4: method.card.last4, expMonth: method.card.exp_month, expYear: method.card.exp_year };
}

/** Passes still waiting for payment are re-read from Stripe, so a missed webhook cannot hide a paid pass. */
async function refreshPendingPasses(db: Db, userId: string, stripe: StripeApi, now: Date): Promise<void> {
  const pending = (await listPasses(db, userId)).filter(
    (row) => row.status === 'pending' && now.getTime() - new Date(row.created_at).getTime() < 7 * 24 * 60 * 60 * 1000,
  );
  for (const row of pending) {
    const invoice = await stripe.invoices.retrieve(row.stripe_invoice_id, { expand: ['payments'] });
    await storePass(db, userId, invoice, { syncedAt: seconds(now), now });
  }
}

/** The account page's view: every subscription and pass, refreshed from Stripe when it can be, and the card on file. */
export async function billingOverview(db: Db, userId: string, options: BillingDeps = {}): Promise<BillingOverview> {
  const { stripe, now } = resolveDeps(options);
  // A database still awaiting migration 016 has no passes table; nobody can have bought one there.
  const passes = () => listPasses(db, userId).catch(() => [] as PassRow[]);
  const customer = await getCustomerId(db, userId).catch(() => null);
  if (!customer || !stripe) {
    return { subscriptions: await listSubscriptions(db, userId).catch(() => []), passes: await passes(), card: null, fresh: !customer };
  }
  try {
    const list = await stripe.subscriptions.list({ customer, status: 'all', limit: 100, expand: ['data.default_payment_method'] });
    let card: CardSummary | null = null;
    for (const subscription of list.data) {
      if (!snapshotFromStripe(subscription)) continue;
      await storeSubscription(db, userId, subscription, { syncedAt: seconds(now), now });
      if (!card && CHANGEABLE.has(subscription.status)) card = cardOf(subscription.default_payment_method);
    }
    await refreshPendingPasses(db, userId, stripe, now);
    if (!card) {
      const record = await stripe.customers.retrieve(customer, { expand: ['invoice_settings.default_payment_method'] });
      if (!('deleted' in record && record.deleted)) {
        card = cardOf((record as Stripe.Customer).invoice_settings?.default_payment_method as Stripe.PaymentMethod | string | null);
      }
    }
    return { subscriptions: await listSubscriptions(db, userId), passes: await passes(), card, fresh: true };
  } catch (error) {
    console.error('[billing] could not refresh the account billing view:', error instanceof Error ? error.message : error);
    return { subscriptions: await listSubscriptions(db, userId), passes: await passes(), card: null, fresh: false };
  }
}

// ---------------------------------------------------------------------------
// Webhooks
// ---------------------------------------------------------------------------

/** The events to enable on the webhook endpoint (docs/BILLING.md). */
export const HANDLED_EVENTS = new Set<string>(WEBHOOK_EVENTS);

export interface WebhookResult {
  type: string;
  /** Already processed: nothing was done again. */
  duplicate: boolean;
  /** Something here changed (false for another product's customer, or an event type not handled). */
  handled: boolean;
  userId?: string;
}

/** Which account a subscription belongs to: our own metadata, the stored link, then the Stripe customer. */
async function resolveUser(
  db: Db,
  hint: { userId: string | null; customerId: string | null },
  stripe: StripeApi | null,
): Promise<string | null> {
  if (hint.userId && (await userExists(db, hint.userId))) return hint.userId;
  if (!hint.customerId) return null;
  const linked = await userForCustomer(db, hint.customerId);
  if (linked && (await userExists(db, linked))) return linked;
  if (!stripe) return null;
  const customer = await stripe.customers.retrieve(hint.customerId);
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
 * an event already processed is acknowledged and skipped; events older than
 * what is stored are ignored. Throws BillingError('invalid-signature') for a
 * delivery that does not verify. Events about another product's customers,
 * prices or invoices (the Stripe account is shared) are acknowledged and
 * left alone.
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

  if (event.type === 'charge.refunded') return handleRefund(db, event, now);
  if (event.type.startsWith('invoice.')) {
    const invoice = event.data.object as Stripe.Invoice;
    if (!subscriptionOfInvoice(invoice) && passSnapshotFromInvoice(invoice)) return handlePassInvoice(db, event, invoice, stripe, now);
  }

  // Work out what to store before taking the write lock: it may ask Stripe.
  let subscription: Stripe.Subscription | null = null;
  let syncedAt = event.created;
  if (event.type.startsWith('customer.subscription.')) {
    subscription = event.data.object as Stripe.Subscription;
  } else if (event.type === 'invoice.paid' || event.type === 'invoice.payment_failed') {
    const subscriptionId = subscriptionOfInvoice(event.data.object as Stripe.Invoice);
    if (subscriptionId && stripe) {
      // An invoice does not carry the subscription's new state, so read it now.
      subscription = await stripe.subscriptions.retrieve(subscriptionId);
      syncedAt = Math.max(event.created, seconds(now));
    }
  }
  const ours = subscription && snapshotFromStripe(subscription) ? subscription : null;
  const userId = ours
    ? await resolveUser(db, { userId: ours.metadata?.examer_user_id ?? null, customerId: idOf(ours.customer) }, stripe)
    : null;

  return db.transaction(async () => {
    const first = await recordEvent(db, event, Boolean(userId), now);
    if (!first) return { type: event.type, duplicate: true, handled: false };
    if (!ours || !userId) return { type: event.type, duplicate: false, handled: false };
    await storeSubscription(db, userId, ours, { syncedAt, now });
    return { type: event.type, duplicate: false, handled: true, userId };
  })();
}

/** invoice.paid / payment_failed / voided for a Single Exam Pass: the invoice as Stripe has it now. */
async function handlePassInvoice(
  db: Db,
  event: Stripe.Event,
  invoice: Stripe.Invoice,
  stripe: StripeApi | null,
  now: Date,
): Promise<WebhookResult> {
  let fresh = invoice;
  let syncedAt = event.created;
  if (stripe && invoice.id) {
    // Re-read, with the payment, so the PaymentIntent is known for a later refund.
    fresh = await stripe.invoices.retrieve(invoice.id, { expand: ['payments'] });
    syncedAt = Math.max(event.created, seconds(now));
  }
  const snapshot = passSnapshotFromInvoice(fresh);
  const stored = snapshot ? await getPassRow(db, snapshot.invoiceId) : null;
  const userId = snapshot
    ? await resolveUser(db, { userId: stored?.user_id ?? snapshot.userIdHint, customerId: snapshot.customerId }, stripe)
    : null;

  return db.transaction(async () => {
    const first = await recordEvent(db, event, Boolean(userId), now);
    if (!first) return { type: event.type, duplicate: true, handled: false };
    if (!snapshot || !userId) return { type: event.type, duplicate: false, handled: false };
    const result = await storePass(db, userId, fresh, { syncedAt, now });
    return { type: event.type, duplicate: false, handled: result.stored, userId };
  })();
}

/**
 * charge.refunded: a fully refunded pass loses its access at once. A partial
 * refund (a goodwill gesture) leaves the pass as it is. Refunds of a
 * subscription payment change nothing here; the subscription's own status does.
 */
async function handleRefund(db: Db, event: Stripe.Event, now: Date): Promise<WebhookResult> {
  const charge = event.data.object as Stripe.Charge;
  const paymentIntent = idOf(charge.payment_intent);
  const row = paymentIntent ? await getPassByPaymentIntent(db, paymentIntent).catch(() => null) : null;
  return db.transaction(async () => {
    const first = await recordEvent(db, event, Boolean(row && charge.refunded), now);
    if (!first) return { type: event.type, duplicate: true, handled: false };
    if (!row || !charge.refunded) return { type: event.type, duplicate: false, handled: false };
    await markPassRefunded(db, row.stripe_invoice_id, event.created, now);
    return { type: event.type, duplicate: false, handled: true, userId: row.user_id };
  })();
}

// ---------------------------------------------------------------------------
// Account deletion
// ---------------------------------------------------------------------------

/**
 * Before an account is deleted: end its subscriptions now, so nobody is billed
 * for an account that no longer exists, and void any pass invoice still
 * waiting for payment, so it cannot be paid for an account that is gone.
 * Throws if Stripe cannot confirm the subscriptions ended.
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
  for (const pass of (await listPasses(db, userId).catch(() => [] as PassRow[])).filter((row) => row.status === 'pending')) {
    try {
      await stripe.invoices.voidInvoice(pass.stripe_invoice_id);
    } catch (error) {
      // Already paid or voided meanwhile: nothing more to stop.
      console.warn('[billing] could not void a pending pass before deletion:', error instanceof Error ? error.message : error);
    }
  }
}
