import { beforeEach, describe, expect, it } from 'vitest';
import Stripe from 'stripe';
import type { Db } from '@/lib/db';
import {
  BillingError,
  billingOverview,
  cancelBeforeDeletion,
  finishCardUpdate,
  setCancelAtPeriodEnd,
  startCardUpdate,
  startCheckout,
  syncSubscriptionForUser,
  type BillingUser,
  type CheckoutInput,
} from '@/lib/billing/service';
import { getCustomerId, getSubscriptionRow } from '@/lib/billing/store';
import { PRICES } from '@/lib/billing/plans';
import { OFF, ON, fakeStripe, stripePrice, stripeSubscription } from './helpers/fake-stripe';
import { createTestDb, createUser } from './helpers/test-db';

/**
 * Buying and managing Plus (and the earlier subscriptions people still hold)
 * against a mocked Stripe client. The Stripe API is not reachable from the
 * test environment, and no test here tries: every call goes to the fake in
 * helpers/fake-stripe.ts. The Single Exam Pass is in billing-passes.test.ts.
 */

let db: Db;
let user: BillingUser;

beforeEach(async () => {
  db = await createTestDb();
  const id = await createUser(db);
  user = { id, email: `${id}@example.invalid`, displayName: 'Ada', isGuest: false };
});

const buy = (input: Partial<CheckoutInput>, fake = fakeStripe(), settings = ON) =>
  startCheckout(db, user, { offer: 'plus_month', consent: true, requestId: 'req-00000001', ...input }, { settings, stripe: fake.api });

async function rejection(promise: Promise<unknown>) {
  const error = await promise.then(() => null, (e: unknown) => e);
  expect(error).toBeInstanceOf(BillingError);
  return error as BillingError;
}

async function giveEarlierPlan(userId: string, lookupKey: string) {
  const at = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO billing_subscriptions (stripe_subscription_id, user_id, stripe_customer_id, plan, exam_key, status,
         price_lookup_key, current_period_end, cancel_at_period_end, withdrawal_waiver_at, stripe_synced_at, created_at, updated_at)
       VALUES ('sub_earlier', ?, 'cus_earlier', 'all_access', NULL, 'active', ?, ?, 0, NULL, 0, ?, ?)`,
    )
    .run(userId, lookupKey, new Date(Date.now() + 20 * 86_400_000).toISOString(), at, at);
}

describe('buying Plus', () => {
  it('creates the customer, finds the monthly price by lookup key and creates an incomplete subscription', async () => {
    const fake = fakeStripe();
    const created = await buy({ sourceExam: 'gmat' }, fake);

    expect(created).toMatchObject({ kind: 'subscription', intent: 'payment', status: 'incomplete', clientSecret: expect.stringMatching(/^pi_.+_secret_/) });
    expect(fake.called('customers.create')[0]!.args[0]).toMatchObject({ email: user.email, name: 'Ada', metadata: { examer_user_id: user.id } });
    expect(fake.called('prices.list')[0]!.args[0]).toMatchObject({ lookup_keys: [PRICES.plus_month.lookupKey], active: true });

    const [params, options] = fake.called('subscriptions.create')[0]!.args as [Stripe.SubscriptionCreateParams, Stripe.RequestOptions];
    expect(params).toMatchObject({
      customer: 'cus_new',
      items: [{ price: 'price_plus_month', quantity: 1 }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.confirmation_secret', 'pending_setup_intent'],
      metadata: { examer_user_id: user.id, plan: 'plus', price_key: 'plus_month', source_exam: 'gmat', withdrawal_waiver_at: expect.any(String) },
    });
    expect(params.metadata).not.toHaveProperty('exam_key');
    expect(params).not.toHaveProperty('automatic_tax');
    expect(options.idempotencyKey).toBe(`examer-sub-${user.id}-plus_month-req-00000001`);

    expect(await getCustomerId(db, user.id)).toBe('cus_new');
    expect(await getSubscriptionRow(db, created.id)).toMatchObject({
      user_id: user.id,
      plan: 'plus',
      exam_key: null,
      price_lookup_key: PRICES.plus_month.lookupKey,
      status: 'incomplete',
      withdrawal_waiver_at: expect.any(String),
    });
  });

  it('sells the yearly price as a yearly subscription, charged upfront', async () => {
    const fake = fakeStripe();
    const created = await buy({ offer: 'plus_year' }, fake);
    const [params] = fake.called('subscriptions.create')[0]!.args as [Stripe.SubscriptionCreateParams];
    expect(params.items).toEqual([{ price: 'price_plus_year', quantity: 1 }]);
    expect(await getSubscriptionRow(db, created.id)).toMatchObject({ plan: 'plus', price_lookup_key: PRICES.plus_year.lookupKey });
  });

  it('returns the SetupIntent secret when nothing is due now', async () => {
    const created = await buy({}, fakeStripe({ firstPayment: 'setup' }));
    expect(created).toMatchObject({ intent: 'setup', clientSecret: expect.stringMatching(/^seti_.+_secret_/) });
  });

  it('reuses the subscription still waiting for the same price instead of creating another', async () => {
    const fake = fakeStripe();
    const first = await buy({}, fake);
    const second = await buy({ requestId: 'req-00000002' }, fake);
    expect(second.id).toBe(first.id);
    expect(fake.called('subscriptions.create')).toHaveLength(1);
    // Switching to yearly is a different price: a new subscription.
    await buy({ offer: 'plus_year', requestId: 'req-00000003' }, fake);
    expect(fake.called('subscriptions.create')).toHaveLength(2);
  });

  it('asks Stripe Tax for VAT and stores the country when automatic tax is on', async () => {
    const fake = fakeStripe();
    const settings = { ...ON, automaticTax: true };
    expect((await rejection(buy({}, fake, settings))).code).toBe('country-required');
    await buy({ country: 'it' }, fake, settings);
    expect(fake.called('customers.update')[0]!.args).toEqual(['cus_new', { address: { country: 'IT' } }]);
    expect(fake.called('subscriptions.create')[0]!.args[0]).toMatchObject({ automatic_tax: { enabled: true } });
  });

  it('refuses guests, missing consent and anything not on sale, before calling Stripe', async () => {
    const fake = fakeStripe();
    const guest = { ...user, isGuest: true, email: null };
    expect(
      await rejection(startCheckout(db, guest, { offer: 'plus_month', consent: true, requestId: 'req-00000001' }, { settings: ON, stripe: fake.api })),
    ).toMatchObject({ code: 'account-required', status: 403 });
    expect((await rejection(buy({ consent: false }, fake))).code).toBe('consent-required');
    expect((await rejection(buy({ offer: 'lifetime' as never }, fake))).code).toBe('unknown-plan');
    // The earlier plans are honoured for their holders, never sold again.
    expect((await rejection(buy({ offer: 'all_access_month' }, fake))).code).toBe('unknown-plan');
    expect((await rejection(buy({ offer: 'single_exam_month', examKey: 'gmat' }, fake))).code).toBe('unknown-plan');
    expect(fake.calls).toHaveLength(0);
  });

  it('refuses Premium on the server, monthly or yearly, whatever the page sent', async () => {
    const fake = fakeStripe();
    // Even if someone created the Premium prices in Stripe by hand.
    fake.state.prices[PRICES.premium_month.lookupKey] = stripePrice('premium_month');
    for (const offer of ['premium_month', 'premium_year'] as const) {
      expect(await rejection(buy({ offer }, fake))).toMatchObject({ code: 'coming-soon', status: 409, messageKey: 'comingSoon' });
    }
    expect(fake.calls).toHaveLength(0);
  });

  it('never sells what the learner already has', async () => {
    const fake = fakeStripe({ createdStatus: 'active' });
    await buy({}, fake);
    expect(await rejection(buy({ offer: 'plus_year', requestId: 'req-00000002' }, fake))).toMatchObject({
      code: 'already-subscribed',
      status: 409,
    });
    // Plus covers every exam, so no pass is sold beside it.
    expect((await rejection(buy({ offer: 'exam_pass', examKey: 'gmat', requestId: 'req-00000003' }, fake))).code).toBe('already-subscribed');
  });

  it('does not sell Plus over an earlier plan that already covers every exam', async () => {
    await giveEarlierPlan(user.id, 'examer_premium_monthly_v1');
    const fake = fakeStripe();
    expect((await rejection(buy({}, fake))).code).toBe('already-subscribed');
    expect(fake.called('subscriptions.create')).toHaveLength(0);
  });

  it('says payments are misconfigured, not that the card failed, when a price is missing or differs from the page', async () => {
    expect(await rejection(buy({}, fakeStripe({ prices: {} })))).toMatchObject({ code: 'billing-misconfigured', status: 503 });
    const wrongAmount = fakeStripe();
    wrongAmount.state.prices[PRICES.plus_month.lookupKey] = stripePrice('plus_month', { unit_amount: 899 });
    expect((await rejection(buy({}, wrongAmount))).code).toBe('billing-misconfigured');
    const exclusive = fakeStripe();
    exclusive.state.prices[PRICES.plus_month.lookupKey] = stripePrice('plus_month', { tax_behavior: 'exclusive' });
    expect((await rejection(buy({}, exclusive))).code).toBe('billing-misconfigured');
    const wrongInterval = fakeStripe();
    wrongInterval.state.prices[PRICES.plus_year.lookupKey] = stripePrice('plus_month', { lookup_key: PRICES.plus_year.lookupKey, unit_amount: 5999 });
    expect((await rejection(buy({ offer: 'plus_year' }, wrongInterval))).code).toBe('billing-misconfigured');
    for (const fake of [wrongAmount, exclusive, wrongInterval]) expect(fake.called('subscriptions.create')).toHaveLength(0);
  });

  it('turns Stripe outages into a retryable message that says nothing was charged', async () => {
    const fake = fakeStripe({ fail: new Stripe.errors.StripeConnectionError({ message: 'socket hang up' }) });
    const error = await rejection(buy({}, fake));
    expect(error).toMatchObject({ code: 'billing-unavailable', status: 503 });
    expect(error.message).toMatch(/Nothing was charged/);
  });

  it('sells nothing when checkout is not available', async () => {
    expect((await rejection(buy({}, fakeStripe(), OFF))).code).toBe('billing-off');
    const live = { ...ON, enforced: false, livemode: true, checkoutAvailable: false };
    expect((await rejection(buy({}, fakeStripe(), live))).code).toBe('billing-off');
  });
});

describe('managing subscriptions', () => {
  async function activePlan(fake = fakeStripe({ createdStatus: 'active' })) {
    const created = await buy({}, fake);
    return { id: created.id, fake };
  }

  it('cancels at period end and resumes, for the owner only', async () => {
    const { id, fake } = await activePlan();
    expect((await setCancelAtPeriodEnd(db, user.id, id, true, { settings: ON, stripe: fake.api })).cancel_at_period_end).toBe(1);
    expect(fake.called('subscriptions.update')[0]!.args).toEqual([id, { cancel_at_period_end: true }]);
    expect((await setCancelAtPeriodEnd(db, user.id, id, false, { settings: ON, stripe: fake.api })).cancel_at_period_end).toBe(0);

    const stranger = await createUser(db);
    expect(await rejection(setCancelAtPeriodEnd(db, stranger, id, true, { settings: ON, stripe: fake.api }))).toMatchObject({
      code: 'unknown-subscription',
      status: 404,
    });
  });

  it('will not change a subscription that has ended', async () => {
    const { id, fake } = await activePlan();
    await db.prepare("UPDATE billing_subscriptions SET status = 'canceled'").run();
    expect((await rejection(setCancelAtPeriodEnd(db, user.id, id, true, { settings: ON, stripe: fake.api }))).code).toBe('not-changeable');
  });

  it('replaces the card with a SetupIntent and retries a failed renewal on it', async () => {
    const { id, fake } = await activePlan();
    expect(await startCardUpdate(db, user.id, { settings: ON, stripe: fake.api })).toEqual({ clientSecret: 'seti_new_secret_z' });
    expect(fake.called('setupIntents.create')[0]!.args[0]).toMatchObject({ customer: 'cus_new', usage: 'off_session' });

    fake.state.subscriptions.set(
      id,
      stripeSubscription({ id, plan: 'plus', customer: 'cus_new', userId: user.id, status: 'past_due', latestInvoice: 'in_failed' }),
    );
    await db.prepare("UPDATE billing_subscriptions SET status = 'past_due'").run();
    fake.state.setupIntents.seti_done = { customer: 'cus_new', status: 'succeeded', payment_method: 'pm_new' };
    const result = await finishCardUpdate(db, user.id, 'seti_done', { settings: ON, stripe: fake.api });

    expect(result).toEqual({ updated: 1, retried: 1 });
    expect(fake.called('customers.update').at(-1)!.args).toEqual(['cus_new', { invoice_settings: { default_payment_method: 'pm_new' } }]);
    expect(fake.called('subscriptions.update').at(-1)!.args).toEqual([id, { default_payment_method: 'pm_new' }]);
    expect(fake.called('invoices.pay')[0]!.args).toEqual(['in_failed', { payment_method: 'pm_new' }]);
  });

  it('refuses a SetupIntent that belongs to another customer or did not succeed', async () => {
    const { fake } = await activePlan();
    fake.state.setupIntents.seti_other = { customer: 'cus_someone', status: 'succeeded', payment_method: 'pm_x' };
    fake.state.setupIntents.seti_pending = { customer: 'cus_new', status: 'requires_action', payment_method: 'pm_y' };
    for (const intent of ['seti_other', 'seti_pending']) {
      expect((await rejection(finishCardUpdate(db, user.id, intent, { settings: ON, stripe: fake.api }))).code).toBe('card-not-saved');
    }
    expect(fake.called('customers.update')).toHaveLength(0);
  });

  it('refreshes the state after the browser confirms, for the owner only', async () => {
    const fake = fakeStripe();
    const created = await buy({}, fake);
    fake.state.subscriptions.set(created.id, stripeSubscription({ id: created.id, plan: 'plus', customer: 'cus_new', userId: user.id, status: 'active' }));
    expect((await syncSubscriptionForUser(db, user.id, created.id, { settings: ON, stripe: fake.api })).status).toBe('active');
    const stranger = await createUser(db);
    expect((await rejection(syncSubscriptionForUser(db, stranger, created.id, { settings: ON, stripe: fake.api }))).code).toBe(
      'unknown-subscription',
    );
  });

  it('lists the account view from Stripe, and falls back to stored rows when Stripe cannot be reached', async () => {
    const { fake } = await activePlan();
    expect((await billingOverview(db, user.id, { settings: ON, stripe: fake.api })).fresh).toBe(true);
    fake.state.fail = new Error('offline');
    const overview = await billingOverview(db, user.id, { settings: ON, stripe: fake.api });
    expect(overview).toMatchObject({ fresh: false, card: null, passes: [] });
    expect(overview.subscriptions).toHaveLength(1);
  });

  it('cancels every live subscription before the account is deleted', async () => {
    const { id, fake } = await activePlan();
    await cancelBeforeDeletion(db, user.id, { settings: ON, stripe: fake.api });
    expect(fake.called('subscriptions.cancel').map((call) => call.args[0])).toEqual([id]);
  });

  it('stops a deletion it cannot confirm with Stripe', async () => {
    const { fake } = await activePlan();
    fake.state.fail = new Stripe.errors.StripeAPIError({ message: 'down' });
    expect((await rejection(cancelBeforeDeletion(db, user.id, { settings: ON, stripe: fake.api }))).code).toBe('billing-unavailable');
  });

  it('has nothing to cancel for an account that never paid', async () => {
    const fake = fakeStripe();
    await cancelBeforeDeletion(db, user.id, { settings: ON, stripe: fake.api });
    expect(fake.calls).toHaveLength(0);
  });
});
