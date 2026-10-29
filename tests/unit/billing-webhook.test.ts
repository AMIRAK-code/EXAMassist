import { beforeEach, describe, expect, it } from 'vitest';
import Stripe from 'stripe';
import type { Db } from '@/lib/db';
import { BillingError, handleWebhook } from '@/lib/billing/service';
import { getSubscriptionRow } from '@/lib/billing/store';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { ON, WEBHOOK_SECRET, fakeStripe, nowSeconds, stripeSubscription } from './helpers/fake-stripe';
import { createTestDb, createUser } from './helpers/test-db';

/**
 * The webhook endpoint's contract: the signature is verified on the raw body
 * with Stripe's own SDK, a redelivered event changes nothing, an event older
 * than what is stored cannot roll a subscription back, and an invoice event
 * re-reads its subscription. No network: Stripe is the fake in helpers/.
 */

let db: Db;
let user: string;
let counter = 0;

beforeEach(async () => {
  db = await createTestDb();
  user = await createUser(db);
});

function event(type: string, object: unknown, created = nowSeconds()) {
  return JSON.stringify({
    id: `evt_test_${++counter}`,
    object: 'event',
    api_version: '2026-08-26.dahlia',
    created,
    livemode: false,
    type,
    data: { object },
  });
}

const sign = (payload: string, secret = WEBHOOK_SECRET, timestamp?: number) =>
  Stripe.webhooks.generateTestHeaderString({ payload, secret, ...(timestamp ? { timestamp } : {}) });

async function deliver(payload: string, signature: string | null = sign(payload), stripe = fakeStripe().api) {
  return handleWebhook(db, payload, signature, { settings: ON, stripe });
}

async function rejection(promise: Promise<unknown>) {
  const error = await promise.then(() => null, (e: unknown) => e);
  expect(error).toBeInstanceOf(BillingError);
  return error as BillingError;
}

describe('signature', () => {
  const payload = () => event('customer.subscription.created', stripeSubscription({ userId: user }));

  it('accepts a delivery signed with the endpoint secret', async () => {
    await expect(deliver(payload())).resolves.toMatchObject({ handled: true, duplicate: false });
  });

  it('refuses a missing, wrong-secret, tampered or replayed signature with 400, storing nothing', async () => {
    const body = payload();
    for (const attempt of [
      deliver(body, null),
      deliver(body, 'garbage'),
      deliver(body, sign(body, 'whsec_someone_else')),
      deliver(body.replace('"active"', '"trialing"'), sign(body)),
      deliver(body, sign(body, WEBHOOK_SECRET, nowSeconds() - 3600)),
    ]) {
      expect(await rejection(attempt)).toMatchObject({ code: 'invalid-signature', status: 400 });
    }
    expect(await db.prepare('SELECT COUNT(*) AS n FROM billing_subscriptions').get()).toEqual({ n: 0 });
    expect(await db.prepare('SELECT COUNT(*) AS n FROM billing_events').get()).toEqual({ n: 0 });
  });

  it('is unavailable without a webhook secret', async () => {
    const body = payload();
    const error = await handleWebhook(db, body, sign(body), { settings: { ...ON, webhookSecret: null }, stripe: null }).then(
      () => null,
      (e: unknown) => e,
    );
    expect(error).toMatchObject({ code: 'billing-off', status: 503 });
  });
});

describe('idempotency and ordering', () => {
  it('processes an event once: a redelivery is acknowledged and changes nothing', async () => {
    const body = event('customer.subscription.updated', stripeSubscription({ userId: user, status: 'active' }));
    const signature = sign(body);
    expect(await deliver(body, signature)).toMatchObject({ handled: true, duplicate: false });
    // Something else moves the subscription on, then Stripe redelivers the old event.
    await db.prepare("UPDATE billing_subscriptions SET status = 'canceled'").run();
    expect(await deliver(body, signature)).toMatchObject({ handled: false, duplicate: true });
    expect((await getSubscriptionRow(db, 'sub_test_1'))?.status).toBe('canceled');
    expect(await db.prepare('SELECT COUNT(*) AS n FROM billing_events').get()).toEqual({ n: 1 });
  });

  it('ignores an event older than the stored state', async () => {
    const now = nowSeconds();
    await deliver(event('customer.subscription.updated', stripeSubscription({ userId: user, status: 'active' }), now));
    await deliver(event('customer.subscription.created', stripeSubscription({ userId: user, status: 'incomplete' }), now - 60));
    expect((await getSubscriptionRow(db, 'sub_test_1'))?.status).toBe('active');
  });

  it('ends access when the subscription is deleted', async () => {
    await deliver(event('customer.subscription.created', stripeSubscription({ userId: user })));
    expect((await loadEntitlements(db, user, { settings: ON })).can('practice', 'digital-sat')).toBe(true);
    await deliver(event('customer.subscription.deleted', stripeSubscription({ userId: user, status: 'canceled' }), nowSeconds() + 1));
    expect((await loadEntitlements(db, user, { settings: ON })).can('practice', 'digital-sat')).toBe(false);
  });
});

describe('events', () => {
  it('stores a single-exam subscription with its exam', async () => {
    await deliver(event('customer.subscription.created', stripeSubscription({ userId: user, plan: 'single_exam', examKey: 'gmat' })));
    expect(await getSubscriptionRow(db, 'sub_test_1')).toMatchObject({ user_id: user, plan: 'single_exam', exam_key: 'gmat', status: 'active' });
  });

  it('finds the account through the stored customer, then through the Stripe customer', async () => {
    const fake = fakeStripe({ customerMetadata: { cus_other: { examer_user_id: user } } });
    const body = event('customer.subscription.created', stripeSubscription({ id: 'sub_x', customer: 'cus_other' }));
    expect(await deliver(body, sign(body), fake.api)).toMatchObject({ handled: true, userId: user });
    expect(fake.called('customers.retrieve')).toHaveLength(1);
  });

  it('records but ignores another product on the same Stripe account', async () => {
    const body = event('customer.subscription.created', stripeSubscription({ userId: user, lookupKey: 'someone_elses_price' }));
    expect(await deliver(body)).toMatchObject({ handled: false, duplicate: false });
    expect(await db.prepare('SELECT COUNT(*) AS n FROM billing_subscriptions').get()).toEqual({ n: 0 });
    expect(await db.prepare('SELECT handled FROM billing_events').get()).toEqual({ handled: 0 });
  });

  it('re-reads the subscription on invoice.paid and invoice.payment_failed', async () => {
    const fake = fakeStripe();
    fake.state.subscriptions.set('sub_test_1', stripeSubscription({ userId: user, status: 'past_due' }));
    const invoice = { id: 'in_1', object: 'invoice', parent: { type: 'subscription_details', subscription_details: { subscription: 'sub_test_1' } } };
    const failed = event('invoice.payment_failed', invoice);
    expect(await deliver(failed, sign(failed), fake.api)).toMatchObject({ handled: true });
    expect((await getSubscriptionRow(db, 'sub_test_1'))?.status).toBe('past_due');

    fake.state.subscriptions.set('sub_test_1', stripeSubscription({ userId: user, status: 'active' }));
    const paid = event('invoice.paid', invoice);
    expect(await deliver(paid, sign(paid), fake.api)).toMatchObject({ handled: true });
    expect((await getSubscriptionRow(db, 'sub_test_1'))?.status).toBe('active');
    expect(fake.called('subscriptions.retrieve')).toHaveLength(2);
  });

  it('stores a Plus subscription, yearly too', async () => {
    await deliver(event('customer.subscription.created', stripeSubscription({ userId: user, plan: 'plus', lookupKey: 'examer_plus_year_v1' })));
    expect(await getSubscriptionRow(db, 'sub_test_1')).toMatchObject({ plan: 'plus', exam_key: null, price_lookup_key: 'examer_plus_year_v1' });
    const entitlements = await loadEntitlements(db, user, { settings: ON });
    expect(entitlements.can('practice', 'gmat')).toBe(true);
    expect(entitlements.can('ai_tutor', 'gmat')).toBe(false);
  });

  it('keeps a first-generation Premium subscription with everything it was sold with', async () => {
    await deliver(event('customer.subscription.updated', stripeSubscription({ userId: user, plan: 'all_access', lookupKey: 'examer_premium_yearly_v1' })));
    expect(await getSubscriptionRow(db, 'sub_test_1')).toMatchObject({ plan: 'all_access', price_lookup_key: 'examer_premium_yearly_v1' });
    expect((await loadEntitlements(db, user, { settings: ON })).can('ai_tutor', 'gmat')).toBe(true);
  });

  it('acknowledges event types it does not handle without recording them', async () => {
    const body = event('payment_intent.created', { id: 'pi_1' });
    expect(await deliver(body)).toMatchObject({ handled: false, duplicate: false });
    expect(await db.prepare('SELECT COUNT(*) AS n FROM billing_events').get()).toEqual({ n: 0 });
  });
});
