import { beforeEach, describe, expect, it } from 'vitest';
import Stripe from 'stripe';
import type { Db } from '@/lib/db';
import {
  BillingError,
  billingOverview,
  cancelBeforeDeletion,
  createSubscription,
  finishCardUpdate,
  setCancelAtPeriodEnd,
  startCardUpdate,
  syncSubscriptionForUser,
  type BillingUser,
  type CreateSubscriptionInput,
} from '@/lib/billing/service';
import { getCustomerId, getSubscriptionRow } from '@/lib/billing/store';
import { PLANS } from '@/lib/billing/plans';
import { OFF, ON, fakeStripe, stripeSubscription } from './helpers/fake-stripe';
import { createTestDb, createUser } from './helpers/test-db';

/**
 * Creating and managing subscriptions against a mocked Stripe client. The
 * Stripe API is not reachable from the test environment, and no test here
 * tries: every call goes to the fake in helpers/fake-stripe.ts.
 */

let db: Db;
let user: BillingUser;

beforeEach(async () => {
  db = await createTestDb();
  const id = await createUser(db);
  user = { id, email: `${id}@example.invalid`, displayName: 'Ada', isGuest: false };
});

const buy = (input: Partial<CreateSubscriptionInput>, fake = fakeStripe(), settings = ON) =>
  createSubscription(db, user, { plan: 'all_access', consent: true, requestId: 'req-00000001', ...input }, { settings, stripe: fake.api });

async function rejection(promise: Promise<unknown>) {
  const error = await promise.then(() => null, (e: unknown) => e);
  expect(error).toBeInstanceOf(BillingError);
  return error as BillingError;
}

describe('creating a subscription', () => {
  it('creates the customer, finds the price by lookup key and creates an incomplete subscription', async () => {
    const fake = fakeStripe();
    const created = await buy({ plan: 'all_access', sourceExam: 'gmat' }, fake);

    expect(created).toMatchObject({ intent: 'payment', status: 'incomplete', clientSecret: expect.stringMatching(/^pi_.+_secret_/) });
    expect(fake.called('customers.create')[0]!.args[0]).toMatchObject({ email: user.email, name: 'Ada', metadata: { examer_user_id: user.id } });
    expect(fake.called('prices.list')[0]!.args[0]).toMatchObject({ lookup_keys: [PLANS.all_access.lookupKey], active: true });

    const [params, options] = fake.called('subscriptions.create')[0]!.args as [Stripe.SubscriptionCreateParams, Stripe.RequestOptions];
    expect(params).toMatchObject({
      customer: 'cus_new',
      items: [{ price: 'price_all', quantity: 1 }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.confirmation_secret', 'pending_setup_intent'],
      metadata: { examer_user_id: user.id, plan: 'all_access', source_exam: 'gmat', withdrawal_waiver_at: expect.any(String) },
    });
    expect(params.metadata).not.toHaveProperty('exam_key');
    expect(params).not.toHaveProperty('automatic_tax');
    expect(options.idempotencyKey).toBe(`examer-sub-${user.id}-all_access-all-req-00000001`);

    expect(await getCustomerId(db, user.id)).toBe('cus_new');
    expect(await getSubscriptionRow(db, created.subscriptionId)).toMatchObject({
      user_id: user.id,
      plan: 'all_access',
      status: 'incomplete',
      withdrawal_waiver_at: expect.any(String),
    });
  });

  it('carries the exam on a single-exam subscription as metadata exam_key', async () => {
    const fake = fakeStripe();
    const created = await buy({ plan: 'single_exam', examKey: 'digital-sat' }, fake);
    const [params] = fake.called('subscriptions.create')[0]!.args as [Stripe.SubscriptionCreateParams];
    expect(params.items).toEqual([{ price: 'price_single', quantity: 1 }]);
    expect(params.metadata).toMatchObject({ plan: 'single_exam', exam_key: 'digital-sat' });
    expect(await getSubscriptionRow(db, created.subscriptionId)).toMatchObject({ plan: 'single_exam', exam_key: 'digital-sat' });
  });

  it('returns the SetupIntent secret when nothing is due now', async () => {
    const created = await buy({}, fakeStripe({ firstPayment: 'setup' }));
    expect(created).toMatchObject({ intent: 'setup', clientSecret: expect.stringMatching(/^seti_.+_secret_/) });
  });

  it('reuses the subscription still waiting for the same plan instead of creating another', async () => {
    const fake = fakeStripe();
    const first = await buy({}, fake);
    const second = await buy({ requestId: 'req-00000002' }, fake);
    expect(second.subscriptionId).toBe(first.subscriptionId);
    expect(fake.called('subscriptions.create')).toHaveLength(1);
  });

  it('asks Stripe Tax for VAT and stores the country when automatic tax is on', async () => {
    const fake = fakeStripe();
    const settings = { ...ON, automaticTax: true };
    expect((await rejection(buy({}, fake, settings))).code).toBe('country-required');
    await buy({ country: 'it' }, fake, settings);
    expect(fake.called('customers.update')[0]!.args).toEqual(['cus_new', { address: { country: 'IT' } }]);
    expect(fake.called('subscriptions.create')[0]!.args[0]).toMatchObject({ automatic_tax: { enabled: true } });
  });

  it('refuses guests, missing consent, unknown plans and exams, before calling Stripe', async () => {
    const fake = fakeStripe();
    const guest = { ...user, isGuest: true, email: null };
    expect(
      await rejection(createSubscription(db, guest, { plan: 'all_access', consent: true, requestId: 'req-00000001' }, { settings: ON, stripe: fake.api })),
    ).toMatchObject({ code: 'account-required', status: 403 });
    expect((await rejection(buy({ consent: false }, fake))).code).toBe('consent-required');
    expect((await rejection(buy({ plan: 'lifetime' as never }, fake))).code).toBe('unknown-plan');
    expect((await rejection(buy({ plan: 'single_exam' }, fake))).code).toBe('unknown-exam');
    expect((await rejection(buy({ plan: 'single_exam', examKey: 'https://evil.example' }, fake))).code).toBe('unknown-exam');
    expect(fake.calls).toHaveLength(0);
  });

  it('never sells what the learner already has', async () => {
    const fake = fakeStripe({ createdStatus: 'active' });
    await buy({ plan: 'single_exam', examKey: 'gmat' }, fake);
    expect(await rejection(buy({ plan: 'single_exam', examKey: 'gmat', requestId: 'req-00000002' }, fake))).toMatchObject({
      code: 'already-subscribed',
      status: 409,
    });
    // Another exam is fine; then All access covers everything.
    await buy({ plan: 'single_exam', examKey: 'lsat', requestId: 'req-00000003' }, fake);
    await buy({ plan: 'all_access', requestId: 'req-00000004' }, fake);
    expect((await rejection(buy({ plan: 'single_exam', examKey: 'gre', requestId: 'req-00000005' }, fake))).code).toBe('already-subscribed');
  });

  it('says payments are misconfigured, not that the card failed, when a price is missing', async () => {
    const error = await rejection(buy({}, fakeStripe({ prices: {} })));
    expect(error).toMatchObject({ code: 'billing-misconfigured', status: 503 });
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
    return { id: created.subscriptionId, fake };
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

    fake.state.subscriptions.set(id, stripeSubscription({ id, customer: 'cus_new', userId: user.id, status: 'past_due', latestInvoice: 'in_failed' }));
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
    fake.state.subscriptions.set(created.subscriptionId, stripeSubscription({ id: created.subscriptionId, customer: 'cus_new', userId: user.id, status: 'active' }));
    expect((await syncSubscriptionForUser(db, user.id, created.subscriptionId, { settings: ON, stripe: fake.api })).status).toBe('active');
    const stranger = await createUser(db);
    expect((await rejection(syncSubscriptionForUser(db, stranger, created.subscriptionId, { settings: ON, stripe: fake.api }))).code).toBe(
      'unknown-subscription',
    );
  });

  it('lists the account view from Stripe, and falls back to stored rows when Stripe cannot be reached', async () => {
    const { fake } = await activePlan();
    expect((await billingOverview(db, user.id, { settings: ON, stripe: fake.api })).fresh).toBe(true);
    fake.state.fail = new Error('offline');
    const overview = await billingOverview(db, user.id, { settings: ON, stripe: fake.api });
    expect(overview).toMatchObject({ fresh: false, card: null });
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
