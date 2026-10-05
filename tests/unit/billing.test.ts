import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Db } from '@/lib/db';
import { AttemptError, recordResponse, startAttempt, startRetry, submitAttempt, getAttemptState } from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { PLANS, billingSettings, planForPrice } from '@/lib/billing/config';
import {
  BillingError,
  cancelBeforeDeletion,
  completeCheckout,
  getAccess,
  handleWebhook,
  startCheckout,
} from '@/lib/billing/service';
import { encodeForm, signStripePayload, StripeError, verifyStripeSignature, type StripeRequest } from '@/lib/billing/stripe';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * Premium: one fixed free test for each account, then a plan. Stripe is replaced by a
 * fake that records each call and answers from a small in-memory account, so
 * these tests run the real SQL and the real rules without the network.
 */

const SAT = requireExamConfig('digital-sat');
const ON = billingSettings({ STRIPE_SECRET_KEY: 'sk_test_unit', STRIPE_WEBHOOK_SECRET: 'whsec_unit' });
const OFF = billingSettings({});
const DAY = 24 * 60 * 60;

interface Call {
  method: string;
  path: string;
  params: Record<string, unknown>;
}

/** A Stripe account holding at most one customer's subscriptions. */
function fakeStripe(state: { subscriptions?: unknown[]; session?: Record<string, unknown>; fail?: StripeError } = {}) {
  const calls: Call[] = [];
  const stripe: StripeRequest = async (method, path, params = {}) => {
    calls.push({ method, path, params });
    if (state.fail) throw state.fail;
    if (method === 'GET' && path === 'subscriptions') return { data: state.subscriptions ?? [] };
    if (method === 'GET' && path.startsWith('checkout/sessions/')) return state.session ?? {};
    if (method === 'GET' && path === 'prices') return { data: [] };
    if (method === 'GET' && path.startsWith('customers/')) return { id: path.split('/')[1], metadata: {} };
    if (method === 'POST' && path === 'customers') return { id: 'cus_new' };
    if (method === 'POST' && path === 'products') return { id: 'examer_premium' };
    if (method === 'POST' && path === 'prices') return { id: `price_${String(params.lookup_key)}` };
    if (method === 'POST' && path === 'checkout/sessions') return { id: 'cs_test_1', url: 'https://checkout.stripe.test/cs_test_1' };
    if (method === 'POST' && path === 'billing_portal/sessions') return { url: 'https://billing.stripe.test/p' };
    if (method === 'DELETE') return { id: path.split('/')[1], status: 'canceled' };
    throw new Error(`unexpected Stripe call ${method} ${path}`);
  };
  return { stripe, calls };
}

const subscription = (overrides: Record<string, unknown> = {}) => ({
  id: 'sub_1',
  status: 'active',
  created: 1_700_000_000,
  cancel_at_period_end: false,
  items: {
    data: [
      {
        current_period_end: Math.floor(Date.now() / 1000) + 30 * DAY,
        price: { lookup_key: PLANS.quarterly.lookupKey, recurring: { interval: 'month', interval_count: 3 } },
      },
    ],
  },
  ...overrides,
});

async function giveSubscription(db: Db, userId: string, status: string, periodEnd: Date | null) {
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end, cancel_at_period_end, created_at, updated_at)
       VALUES (?, ?, 'sub_1', 'monthly', ?, ?, 0, ?, ?)`,
    )
    .run(userId, `cus_${userId.slice(0, 8)}`, status, periodEnd?.toISOString() ?? null, now, now);
}

async function finishSession(db: Db, userId: string): Promise<string> {
  const { attemptId } = await startAttempt(db, { userId, examKey: SAT.examKey, blueprintId: 'practice' });
  const state = await getAttemptState(db, attemptId, userId);
  for (const item of state.parts[0].items) {
    await recordResponse(db, {
      attemptId,
      userId,
      partIndex: 0,
      position: item.position,
      response: { type: 'single_select', optionId: 'b' },
      clock: Date.now(),
    });
  }
  await submitAttempt(db, { attemptId, userId });
  return attemptId;
}

let db: Db;
let alice: string;

beforeEach(async () => {
  db = await createTestDb();
  alice = await createUser(db);
  await seedQuestions(db, SAT, { perDomain: 6 });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Stripe plumbing', () => {
  it('accepts a correctly signed payload and refuses a tampered, stale or unsigned one', () => {
    const payload = '{"id":"evt_1"}';
    const now = 1_800_000_000;
    const header = signStripePayload(payload, 'whsec_x', now);
    expect(verifyStripeSignature(payload, header, 'whsec_x', { now })).toBe(true);
    expect(verifyStripeSignature('{"id":"evt_2"}', header, 'whsec_x', { now })).toBe(false);
    expect(verifyStripeSignature(payload, header, 'whsec_other', { now })).toBe(false);
    expect(verifyStripeSignature(payload, header, 'whsec_x', { now: now + 301 })).toBe(false);
    expect(verifyStripeSignature(payload, null, 'whsec_x', { now })).toBe(false);
    expect(verifyStripeSignature(payload, 't=1,v1=', 'whsec_x', { now })).toBe(false);
  });

  it('encodes nested parameters the way Stripe expects', () => {
    const form = encodeForm({ line_items: [{ price: 'price_1', quantity: 1 }], metadata: { a: 'b' }, skip: undefined });
    expect(form.toString()).toBe('line_items%5B0%5D%5Bprice%5D=price_1&line_items%5B0%5D%5Bquantity%5D=1&metadata%5Ba%5D=b');
  });

  it('maps a price to its plan by lookup key, then by interval', () => {
    expect(planForPrice({ lookup_key: PLANS.yearly.lookupKey })).toBe('yearly');
    expect(planForPrice({ lookup_key: 'something_else', recurring: { interval: 'month', interval_count: 3 } })).toBe('quarterly');
    expect(planForPrice({ recurring: { interval: 'month' } })).toBe('monthly');
    expect(planForPrice(null)).toBeNull();
  });

  it('prices the plans as agreed, VAT included', () => {
    expect(PLANS.monthly).toMatchObject({ amount: 1499, perMonth: 1499, interval: 'month', intervalCount: 1 });
    expect(PLANS.quarterly).toMatchObject({ amount: 3597, perMonth: 1199, interval: 'month', intervalCount: 3 });
    expect(PLANS.yearly).toMatchObject({ amount: 9588, perMonth: 799, interval: 'year', intervalCount: 1 });
  });

  it('switches billing on only with a secret key', () => {
    expect(OFF.enabled).toBe(false);
    expect(ON.enabled).toBe(true);
    expect(ON.livemode).toBe(false);
    expect(billingSettings({ STRIPE_SECRET_KEY: 'sk_live_x' }).livemode).toBe(true);
  });
});

const freeTest = (userId: string, idempotencyKey?: string) =>
  startAttempt(db, { userId, examKey: SAT.examKey, blueprintId: 'practice', freeTest: true, idempotencyKey });

const practice = (userId: string) => startAttempt(db, { userId, examKey: SAT.examKey, blueprintId: 'practice' });

/** Every question in a session, in the order it is asked. */
async function questionOrder(attemptId: string): Promise<string[]> {
  const rows = (await db
    .prepare('SELECT question_id FROM attempt_items WHERE attempt_id = ? ORDER BY part_index, position')
    .all(attemptId)) as Array<{ question_id: string }>;
  return rows.map((row) => row.question_id);
}

describe('the free test', () => {
  const paywallOn = () => vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_unit');

  it('gives a free account one test, then asks for Premium', async () => {
    paywallOn();
    await freeTest(alice);
    const refusal = await freeTest(alice).catch((e) => e);
    expect(refusal).toBeInstanceOf(AttemptError);
    expect(refusal).toMatchObject({ code: 'premium-required', status: 402 });
  });

  it('keeps every other format for Premium, even before the free test is taken', async () => {
    paywallOn();
    await expect(practice(alice)).rejects.toMatchObject({ code: 'premium-required' });
  });

  it('asks a guest to create an account, and opens nothing else to a guest', async () => {
    paywallOn();
    const guest = await createUser(db, { isGuest: true });
    await expect(freeTest(guest)).rejects.toMatchObject({ code: 'account-required', status: 403 });
    await expect(practice(guest)).rejects.toMatchObject({ code: 'premium-required' });
  });

  it('is the exam diagnostic, marked as the free test', async () => {
    paywallOn();
    const { attemptId } = await freeTest(alice);
    const row = (await db.prepare('SELECT blueprint_id, settings_json FROM attempts WHERE id = ?').get(attemptId)) as {
      blueprint_id: string;
      settings_json: string;
    };
    expect(row.blueprint_id).toBe('diagnostic');
    expect(JSON.parse(row.settings_json)).toMatchObject({ freeTest: true, overrides: {} });
  });

  it('holds the same questions, in the same order, for every account and whatever it has seen', async () => {
    // Bob practises first, with no paywall, so he has a history; the free test ignores it
    const bob = await createUser(db);
    await practice(bob);
    await practice(bob);
    const carol = await createUser(db);

    const first = await questionOrder((await freeTest(alice)).attemptId);
    expect(first.length).toBeGreaterThan(0);
    expect(await questionOrder((await freeTest(bob)).attemptId)).toEqual(first);
    paywallOn();
    expect(await questionOrder((await freeTest(carol)).attemptId)).toEqual(first);
  });

  it('returns the same free test to a repeated request', async () => {
    paywallOn();
    const first = await freeTest(alice, `free-test:${alice}`);
    const again = await freeTest(alice, `free-test:${alice}`);
    expect(again).toMatchObject({ attemptId: first.attemptId, reused: true });
  });

  it('keeps retries of missed questions for Premium', async () => {
    const source = await finishSession(db, alice);
    const missed = await questionOrder(source);
    paywallOn();
    await expect(startRetry(db, { userId: alice, examKey: SAT.examKey, questionIds: missed, sourceAttemptId: source })).rejects.toMatchObject({
      code: 'premium-required',
    });
  });

  it('opens everything with an active plan, including one whose renewal is still being retried', async () => {
    paywallOn();
    await giveSubscription(db, alice, 'past_due', new Date(Date.now() + DAY * 1000));
    await practice(alice);
    await practice(alice);
  });

  it('closes again once a plan is cancelled', async () => {
    paywallOn();
    await giveSubscription(db, alice, 'canceled', null);
    await expect(practice(alice)).rejects.toMatchObject({ code: 'premium-required' });
  });

  it('never asks editors or administrators to pay', async () => {
    paywallOn();
    const editor = await createUser(db, { role: 'editor' });
    await practice(editor);
    await practice(editor);
  });

  it('has no paywall at all while billing is not configured', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', '');
    await practice(alice);
    await practice(alice);
    expect((await getAccess(db, alice, { settings: OFF })).fullAccess).toBe(true);
  });

  it('re-reads a plan from Stripe once its paid period has passed', async () => {
    await giveSubscription(db, alice, 'active', new Date(Date.now() - 5 * DAY * 1000));
    const { stripe, calls } = fakeStripe({ subscriptions: [subscription()] });
    const access = await getAccess(db, alice, { settings: ON, stripe });
    expect(calls.map((c) => `${c.method} ${c.path}`)).toEqual(['GET subscriptions']);
    expect(access.premium).toBe(true);
    expect(access.subscription).toMatchObject({ plan: 'quarterly', status: 'active' });
  });
});

describe('checkout', () => {
  it('asks a guest to create an account first', async () => {
    const guest = await createUser(db, { isGuest: true });
    const { stripe, calls } = fakeStripe();
    await expect(
      startCheckout(db, { id: guest, email: null, displayName: null, isGuest: true }, 'monthly', { settings: ON, stripe }),
    ).rejects.toMatchObject({ code: 'account-required', status: 403 });
    expect(calls).toHaveLength(0);
  });

  it('creates the customer, the price and a subscription checkout for the chosen plan', async () => {
    const { stripe, calls } = fakeStripe();
    const url = await startCheckout(db, { id: alice, email: 'a@example.invalid', displayName: null, isGuest: false }, 'yearly', {
      settings: ON,
      stripe,
    });
    expect(url).toBe('https://checkout.stripe.test/cs_test_1');

    const price = calls.find((c) => c.method === 'POST' && c.path === 'prices')!;
    expect(price.params).toMatchObject({
      currency: 'eur',
      unit_amount: 9588,
      tax_behavior: 'inclusive',
      recurring: { interval: 'year', interval_count: 1 },
      lookup_key: PLANS.yearly.lookupKey,
    });
    const session = calls.find((c) => c.path === 'checkout/sessions')!;
    expect(session.params).toMatchObject({
      mode: 'subscription',
      customer: 'cus_new',
      client_reference_id: `examer:${alice}`,
      line_items: [{ price: `price_${PLANS.yearly.lookupKey}`, quantity: 1 }],
      metadata: { examer_user_id: alice, plan: 'yearly' },
    });
    expect(session.params).not.toHaveProperty('automatic_tax');
    expect((await db.prepare('SELECT stripe_customer_id FROM subscriptions WHERE user_id = ?').get(alice)) as object).toEqual({
      stripe_customer_id: 'cus_new',
    });
  });

  it('refuses a second plan for someone who already has Premium', async () => {
    await giveSubscription(db, alice, 'active', new Date(Date.now() + 10 * DAY * 1000));
    const { stripe } = fakeStripe();
    await expect(
      startCheckout(db, { id: alice, email: 'a@example.invalid', displayName: null, isGuest: false }, 'monthly', { settings: ON, stripe }),
    ).rejects.toMatchObject({ code: 'already-premium' });
  });

  it('turns Premium on when the learner comes back from their own checkout', async () => {
    const { stripe } = fakeStripe({
      subscriptions: [subscription()],
      session: { client_reference_id: `examer:${alice}`, customer: 'cus_back', status: 'complete', payment_status: 'paid' },
    });
    const outcome = await completeCheckout(db, alice, 'cs_test_abcdefghijkl', { settings: ON, stripe });
    expect(outcome.paid).toBe(true);
    expect(outcome.access.premium).toBe(true);
    expect(outcome.access.subscription).toMatchObject({ stripe_customer_id: 'cus_back', plan: 'quarterly' });
  });

  it('will not attach somebody else’s checkout to this account', async () => {
    const { stripe } = fakeStripe({ session: { client_reference_id: 'examer:someone-else', customer: 'cus_x' } });
    await expect(completeCheckout(db, alice, 'cs_test_abcdefghijkl', { settings: ON, stripe })).rejects.toMatchObject({
      code: 'not-your-checkout',
      status: 403,
    });
    expect(await db.prepare('SELECT * FROM subscriptions').all()).toHaveLength(0);
  });

  it('reports a Stripe failure without a stack trace and says nothing was charged', async () => {
    const { stripe } = fakeStripe({ fail: new StripeError(500, 'boom') });
    const error = await startCheckout(db, { id: alice, email: 'a@example.invalid', displayName: null, isGuest: false }, 'monthly', {
      settings: ON,
      stripe,
    }).catch((e) => e);
    expect(error).toBeInstanceOf(BillingError);
    expect(error.message).toMatch(/Nothing was charged/);
  });
});

describe('webhooks', () => {
  const deliver = (event: unknown, secret = 'whsec_unit') => {
    const payload = JSON.stringify(event);
    return { payload, signature: signStripePayload(payload, secret) };
  };

  it('stores the plan for a customer linked at checkout', async () => {
    await giveSubscription(db, alice, 'incomplete', null);
    const customer = `cus_${alice.slice(0, 8)}`;
    const { stripe } = fakeStripe({ subscriptions: [subscription({ status: 'active' })] });
    const { payload, signature } = deliver({ type: 'customer.subscription.updated', data: { object: { customer } } });
    const result = await handleWebhook(db, payload, signature, { settings: ON, stripe });
    expect(result).toMatchObject({ handled: true, userId: alice });
    expect(await getAccess(db, alice, { settings: ON, stripe })).toMatchObject({ premium: true });
  });

  it('links a new customer through the account id attached at checkout', async () => {
    const { stripe } = fakeStripe({ subscriptions: [subscription()] });
    const { payload, signature } = deliver({
      type: 'checkout.session.completed',
      data: { object: { customer: 'cus_fresh', client_reference_id: `examer:${alice}` } },
    });
    expect(await handleWebhook(db, payload, signature, { settings: ON, stripe })).toMatchObject({ handled: true });
    expect(await db.prepare('SELECT stripe_customer_id, plan FROM subscriptions WHERE user_id = ?').get(alice)).toEqual({
      stripe_customer_id: 'cus_fresh',
      plan: 'quarterly',
    });
  });

  it('turns Premium off when the subscription ends', async () => {
    await giveSubscription(db, alice, 'active', new Date(Date.now() + DAY * 1000));
    const { stripe } = fakeStripe({ subscriptions: [subscription({ status: 'canceled' })] });
    const { payload, signature } = deliver({
      type: 'customer.subscription.deleted',
      data: { object: { customer: `cus_${alice.slice(0, 8)}` } },
    });
    await handleWebhook(db, payload, signature, { settings: ON, stripe });
    expect(await getAccess(db, alice, { settings: ON, stripe })).toMatchObject({ premium: false });
  });

  it('ignores customers of other products on the same Stripe account', async () => {
    const { stripe } = fakeStripe();
    const { payload, signature } = deliver({ type: 'invoice.paid', data: { object: { customer: 'cus_other', metadata: { user_id: 'x' } } } });
    expect(await handleWebhook(db, payload, signature, { settings: ON, stripe })).toMatchObject({ handled: false });
    expect(await db.prepare('SELECT * FROM subscriptions').all()).toHaveLength(0);
  });

  it('refuses a delivery whose signature does not verify', async () => {
    const { stripe, calls } = fakeStripe();
    const { payload, signature } = deliver({ type: 'invoice.paid', data: { object: { customer: 'cus_1' } } }, 'whsec_wrong');
    await expect(handleWebhook(db, payload, signature, { settings: ON, stripe })).rejects.toMatchObject({
      code: 'invalid-signature',
      status: 400,
    });
    expect(calls).toHaveLength(0);
  });
});

describe('deleting an account', () => {
  it('cancels every live subscription first', async () => {
    await giveSubscription(db, alice, 'active', new Date(Date.now() + DAY * 1000));
    const { stripe, calls } = fakeStripe({
      subscriptions: [subscription({ id: 'sub_live' }), subscription({ id: 'sub_old', status: 'canceled' })],
    });
    await cancelBeforeDeletion(db, alice, { settings: ON, stripe });
    expect(calls.filter((c) => c.method === 'DELETE').map((c) => c.path)).toEqual(['subscriptions/sub_live']);
  });

  it('stops the deletion when Stripe cannot confirm the cancellation', async () => {
    await giveSubscription(db, alice, 'active', new Date(Date.now() + DAY * 1000));
    const { stripe } = fakeStripe({ fail: new StripeError(503, 'down') });
    await expect(cancelBeforeDeletion(db, alice, { settings: ON, stripe })).rejects.toMatchObject({ code: 'billing-unavailable' });
  });

  it('has nothing to do for an account that never paid', async () => {
    const { stripe, calls } = fakeStripe();
    await cancelBeforeDeletion(db, alice, { settings: ON, stripe });
    expect(calls).toHaveLength(0);
  });
});
