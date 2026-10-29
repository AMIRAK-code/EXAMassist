import type Stripe from 'stripe';
import type { Db } from '@/lib/db';
import { getExamConfig } from '@/lib/exams/registry';
import { countEvent, subjectFor } from '@/lib/analytics/funnel';
import { ACCESS_POLICY, PASS_ACCESS_MONTHS, PLANS, addCalendarMonths, planForLookupKey, type PlanKey } from './plans';

/**
 * The local copy of Stripe customers, subscriptions (migration 012) and
 * Single Exam Passes (migration 016).
 *
 * Stripe is the source of truth. Every write here comes from a Stripe object
 * (a webhook payload, or one fetched just now) and carries the time that
 * object describes, so an older state can never overwrite a newer one.
 */

export interface SubscriptionRow {
  stripe_subscription_id: string;
  user_id: string;
  stripe_customer_id: string;
  plan: PlanKey;
  exam_key: string | null;
  status: string;
  price_lookup_key: string | null;
  current_period_end: string | null;
  cancel_at_period_end: number;
  withdrawal_waiver_at: string | null;
  stripe_synced_at: number;
  created_at: string;
  updated_at: string;
}

export async function getCustomerId(db: Db, userId: string): Promise<string | null> {
  const row = (await db.prepare('SELECT stripe_customer_id FROM billing_customers WHERE user_id = ?').get(userId)) as
    | { stripe_customer_id: string }
    | undefined;
  return row?.stripe_customer_id ?? null;
}

export async function linkCustomer(db: Db, userId: string, customerId: string, now = new Date()): Promise<void> {
  const at = now.toISOString();
  await db
    .prepare(
      `INSERT INTO billing_customers (user_id, stripe_customer_id, created_at, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = excluded.stripe_customer_id, updated_at = excluded.updated_at`,
    )
    .run(userId, customerId, at, at);
}

export async function userForCustomer(db: Db, customerId: string): Promise<string | null> {
  const row = (await db.prepare('SELECT user_id FROM billing_customers WHERE stripe_customer_id = ?').get(customerId)) as
    | { user_id: string }
    | undefined;
  return row?.user_id ?? null;
}

export async function userExists(db: Db, userId: string): Promise<boolean> {
  return Boolean(await db.prepare('SELECT id FROM users WHERE id = ? AND deleted_at IS NULL').get(userId));
}

export async function listSubscriptions(db: Db, userId: string): Promise<SubscriptionRow[]> {
  const rows = (await db
    .prepare('SELECT * FROM billing_subscriptions WHERE user_id = ? ORDER BY created_at, stripe_subscription_id')
    .all(userId)) as SubscriptionRow[];
  return rows.map(normalise);
}

export async function getSubscriptionRow(db: Db, subscriptionId: string): Promise<SubscriptionRow | null> {
  const row = (await db.prepare('SELECT * FROM billing_subscriptions WHERE stripe_subscription_id = ?').get(subscriptionId)) as
    | SubscriptionRow
    | undefined;
  return row ? normalise(row) : null;
}

function normalise(row: SubscriptionRow): SubscriptionRow {
  return { ...row, cancel_at_period_end: Number(row.cancel_at_period_end), stripe_synced_at: Number(row.stripe_synced_at) };
}

// ---------------------------------------------------------------------------
// From a Stripe subscription to a row
// ---------------------------------------------------------------------------

export interface SubscriptionSnapshot {
  id: string;
  customerId: string;
  plan: PlanKey;
  examKey: string | null;
  status: string;
  lookupKey: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  userIdHint: string | null;
}

const idOf = (value: string | { id: string } | null | undefined) => (typeof value === 'string' ? value : (value?.id ?? null));

/**
 * What this site needs from a Stripe subscription, or null when it is not
 * one of ours (a price this site does not sell).
 */
export function snapshotFromStripe(subscription: Stripe.Subscription): SubscriptionSnapshot | null {
  const item = subscription.items?.data?.[0];
  const lookupKey = item?.price?.lookup_key ?? null;
  const plan = planForLookupKey(lookupKey);
  const customerId = idOf(subscription.customer);
  if (!plan || !customerId || PLANS[plan].billing !== 'subscription') return null;
  // The billing period lives on the item in current API versions, and on the
  // subscription in older ones.
  const legacy = subscription as unknown as { current_period_end?: number };
  const periodEnd = item?.current_period_end ?? legacy.current_period_end ?? null;
  const examKey = subscription.metadata?.exam_key ?? null;
  return {
    id: subscription.id,
    customerId,
    plan,
    examKey: PLANS[plan].scope === 'one-exam' && examKey && getExamConfig(examKey) ? examKey : null,
    status: subscription.status,
    lookupKey,
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end || subscription.cancel_at),
    userIdHint: subscription.metadata?.examer_user_id ?? null,
  };
}

const granting = (status: string | null | undefined) => Boolean(status && ACCESS_POLICY.grantingStatuses.includes(status));

export interface StoreResult {
  stored: boolean;
  /** The subscription just became paid for the first time: counted as a purchase. */
  newlyActive: boolean;
  row: SubscriptionRow | null;
}

/**
 * Writes a Stripe subscription for a user, unless the row already reflects a
 * newer state than `syncedAt` (unix seconds of the Stripe object).
 */
export async function storeSubscription(
  db: Db,
  userId: string,
  subscription: Stripe.Subscription,
  options: { syncedAt: number; now?: Date; withdrawalWaiverAt?: string | null; sourceExam?: string | null },
): Promise<StoreResult> {
  const snapshot = snapshotFromStripe(subscription);
  if (!snapshot) return { stored: false, newlyActive: false, row: null };
  if (PLANS[snapshot.plan].scope === 'one-exam' && !snapshot.examKey) {
    console.error('[billing] single-exam subscription without a known exam_key:', snapshot.id);
  }
  const now = options.now ?? new Date();
  const at = now.toISOString();
  const before = await getSubscriptionRow(db, snapshot.id);
  if (before && before.stripe_synced_at > options.syncedAt) return { stored: false, newlyActive: false, row: before };

  await linkCustomer(db, userId, snapshot.customerId, now);
  await db
    .prepare(
      `INSERT INTO billing_subscriptions (
         stripe_subscription_id, user_id, stripe_customer_id, plan, exam_key, status, price_lookup_key,
         current_period_end, cancel_at_period_end, withdrawal_waiver_at, stripe_synced_at, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (stripe_subscription_id) DO UPDATE SET
         user_id = excluded.user_id,
         stripe_customer_id = excluded.stripe_customer_id,
         plan = excluded.plan,
         exam_key = excluded.exam_key,
         status = excluded.status,
         price_lookup_key = excluded.price_lookup_key,
         current_period_end = excluded.current_period_end,
         cancel_at_period_end = excluded.cancel_at_period_end,
         withdrawal_waiver_at = COALESCE(billing_subscriptions.withdrawal_waiver_at, excluded.withdrawal_waiver_at),
         stripe_synced_at = excluded.stripe_synced_at,
         updated_at = excluded.updated_at`,
    )
    .run(
      snapshot.id,
      userId,
      snapshot.customerId,
      snapshot.plan,
      snapshot.examKey,
      snapshot.status,
      snapshot.lookupKey,
      snapshot.currentPeriodEnd,
      snapshot.cancelAtPeriodEnd ? 1 : 0,
      options.withdrawalWaiverAt ?? null,
      options.syncedAt,
      before?.created_at ?? at,
      at,
    );

  const newlyActive = granting(snapshot.status) && !granting(before?.status) && before?.status !== 'past_due';
  if (newlyActive) {
    const subject = snapshot.examKey ?? subscription.metadata?.source_exam ?? options.sourceExam ?? null;
    await countEvent(db, 'purchase', subjectFor(subject), 'n/a', now);
  }
  return { stored: true, newlyActive, row: await getSubscriptionRow(db, snapshot.id) };
}

// ---------------------------------------------------------------------------
// Single Exam Passes (migration 016)
// ---------------------------------------------------------------------------

/** pending: invoice open, not paid. paid: access for its term. void: abandoned. refunded: fully refunded, access ended. */
export type PassStatus = 'pending' | 'paid' | 'void' | 'refunded';

export interface PassRow {
  stripe_invoice_id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_payment_intent_id: string | null;
  plan: PlanKey;
  exam_key: string;
  price_lookup_key: string;
  amount: number;
  currency: string;
  status: PassStatus;
  access_starts_at: string | null;
  access_ends_at: string | null;
  withdrawal_waiver_at: string | null;
  source_exam: string | null;
  stripe_synced_at: number;
  created_at: string;
  updated_at: string;
}

/** Metadata on every pass invoice we create; an invoice without it is not one of our passes. */
export const PASS_INVOICE_PURPOSE = 'exam_pass';

function normalisePass(row: PassRow): PassRow {
  return { ...row, amount: Number(row.amount), stripe_synced_at: Number(row.stripe_synced_at) };
}

export async function listPasses(db: Db, userId: string): Promise<PassRow[]> {
  const rows = (await db
    .prepare('SELECT * FROM billing_passes WHERE user_id = ? ORDER BY created_at, stripe_invoice_id')
    .all(userId)) as PassRow[];
  return rows.map(normalisePass);
}

export async function getPassRow(db: Db, invoiceId: string): Promise<PassRow | null> {
  const row = (await db.prepare('SELECT * FROM billing_passes WHERE stripe_invoice_id = ?').get(invoiceId)) as PassRow | undefined;
  return row ? normalisePass(row) : null;
}

export async function getPassByPaymentIntent(db: Db, paymentIntentId: string): Promise<PassRow | null> {
  const row = (await db.prepare('SELECT * FROM billing_passes WHERE stripe_payment_intent_id = ?').get(paymentIntentId)) as
    | PassRow
    | undefined;
  return row ? normalisePass(row) : null;
}

export interface PassSnapshot {
  invoiceId: string;
  customerId: string;
  examKey: string;
  lookupKey: string;
  status: Exclude<PassStatus, 'refunded'>;
  /** When Stripe marked the invoice paid (unix seconds); null until then. */
  paidAt: number | null;
  paymentIntentId: string | null;
  amount: number;
  currency: string;
  userIdHint: string | null;
}

/**
 * What this site needs from a Stripe invoice that pays for a Single Exam
 * Pass, or null when the invoice is not one of ours (another product's
 * invoice, a subscription's invoice, or one naming an exam or price we do not
 * sell). Only our server writes this metadata.
 */
export function passSnapshotFromInvoice(invoice: Stripe.Invoice): PassSnapshot | null {
  const metadata = invoice.metadata ?? {};
  if (metadata.examer_purchase !== PASS_INVOICE_PURPOSE) return null;
  const customerId = idOf(invoice.customer);
  const examKey = metadata.exam_key;
  const lookupKey = metadata.price_lookup_key;
  const plan = planForLookupKey(lookupKey);
  if (!invoice.id || !customerId || !examKey || !getExamConfig(examKey) || !lookupKey || !plan || PLANS[plan].billing !== 'one-time') {
    return null;
  }
  const paid = invoice.status === 'paid';
  const payment = invoice.payments?.data?.find((entry) => entry.status === 'paid') ?? null;
  return {
    invoiceId: invoice.id,
    customerId,
    examKey,
    lookupKey,
    status: paid ? 'paid' : invoice.status === 'void' || invoice.status === 'uncollectible' ? 'void' : 'pending',
    paidAt: paid ? (invoice.status_transitions?.paid_at ?? null) : null,
    paymentIntentId: idOf(payment?.payment?.payment_intent ?? null),
    amount: paid ? invoice.amount_paid : invoice.amount_due,
    currency: invoice.currency,
    userIdHint: metadata.examer_user_id ?? null,
  };
}

export interface PassStoreResult {
  stored: boolean;
  /** The pass just became paid: counted as a purchase. */
  newlyPaid: boolean;
  row: PassRow | null;
}

/**
 * Writes a pass invoice for a user. The access term starts when Stripe
 * recorded the payment and lasts PASS_ACCESS_MONTHS calendar months; it is set
 * once and never moved by a later sync. A refunded pass stays refunded, a
 * paid one never goes back to pending, and a state older than the stored one
 * (`syncedAt`, unix seconds) is ignored.
 */
export async function storePass(
  db: Db,
  userId: string,
  invoice: Stripe.Invoice,
  options: { syncedAt: number; now?: Date; withdrawalWaiverAt?: string | null; sourceExam?: string | null },
): Promise<PassStoreResult> {
  const snapshot = passSnapshotFromInvoice(invoice);
  if (!snapshot) return { stored: false, newlyPaid: false, row: null };
  const now = options.now ?? new Date();
  const at = now.toISOString();
  const before = await getPassRow(db, snapshot.invoiceId);
  if (before) {
    const stale = before.stripe_synced_at > options.syncedAt;
    const final = before.status === 'refunded' || (before.status === 'paid' && snapshot.status !== 'paid');
    if (stale || final || before.user_id !== userId) return { stored: false, newlyPaid: false, row: before };
  }

  let startsAt = before?.access_starts_at ?? null;
  let endsAt = before?.access_ends_at ?? null;
  if (snapshot.status === 'paid' && !startsAt) {
    // Stripe's own record of the payment; the moment of this sync only if Stripe gave none.
    const start = snapshot.paidAt ? new Date(snapshot.paidAt * 1000) : now;
    startsAt = start.toISOString();
    endsAt = addCalendarMonths(start, PASS_ACCESS_MONTHS).toISOString();
  }

  await linkCustomer(db, userId, snapshot.customerId, now);
  await db
    .prepare(
      `INSERT INTO billing_passes (
         stripe_invoice_id, user_id, stripe_customer_id, stripe_payment_intent_id, plan, exam_key, price_lookup_key,
         amount, currency, status, access_starts_at, access_ends_at, withdrawal_waiver_at, source_exam,
         stripe_synced_at, created_at, updated_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (stripe_invoice_id) DO UPDATE SET
         stripe_payment_intent_id = COALESCE(excluded.stripe_payment_intent_id, billing_passes.stripe_payment_intent_id),
         amount = excluded.amount,
         currency = excluded.currency,
         status = excluded.status,
         access_starts_at = excluded.access_starts_at,
         access_ends_at = excluded.access_ends_at,
         withdrawal_waiver_at = COALESCE(billing_passes.withdrawal_waiver_at, excluded.withdrawal_waiver_at),
         source_exam = COALESCE(billing_passes.source_exam, excluded.source_exam),
         stripe_synced_at = excluded.stripe_synced_at,
         updated_at = excluded.updated_at`,
    )
    .run(
      snapshot.invoiceId,
      userId,
      snapshot.customerId,
      snapshot.paymentIntentId,
      'exam_pass',
      snapshot.examKey,
      snapshot.lookupKey,
      snapshot.amount,
      snapshot.currency,
      snapshot.status,
      startsAt,
      endsAt,
      options.withdrawalWaiverAt ?? null,
      options.sourceExam ?? null,
      options.syncedAt,
      before?.created_at ?? at,
      at,
    );

  const newlyPaid = snapshot.status === 'paid' && before?.status !== 'paid';
  if (newlyPaid) await countEvent(db, 'purchase', subjectFor(snapshot.examKey), 'n/a', now);
  return { stored: true, newlyPaid, row: await getPassRow(db, snapshot.invoiceId) };
}

/** A fully refunded pass: its access ends now. Final; a later sync never reopens it. */
export async function markPassRefunded(db: Db, invoiceId: string, syncedAt: number, now = new Date()): Promise<PassRow | null> {
  await db
    .prepare(
      `UPDATE billing_passes
          SET status = 'refunded',
              stripe_synced_at = CASE WHEN stripe_synced_at > ? THEN stripe_synced_at ELSE ? END,
              updated_at = ?
        WHERE stripe_invoice_id = ? AND status = 'paid'`,
    )
    .run(syncedAt, syncedAt, now.toISOString(), invoiceId);
  return getPassRow(db, invoiceId);
}

/** Records a processed webhook event. False when it was already recorded. */
export async function recordEvent(db: Db, event: { id: string; type: string }, handled: boolean, now = new Date()): Promise<boolean> {
  const result = await db
    .prepare('INSERT INTO billing_events (id, type, handled, received_at) VALUES (?, ?, ?, ?) ON CONFLICT (id) DO NOTHING')
    .run(event.id, event.type, handled ? 1 : 0, now.toISOString());
  return result.changes > 0;
}

export async function eventSeen(db: Db, eventId: string): Promise<boolean> {
  return Boolean(await db.prepare('SELECT id FROM billing_events WHERE id = ?').get(eventId));
}
