import { beforeEach, describe, expect, it } from 'vitest';
import Stripe from 'stripe';
import type { Db } from '@/lib/db';
import { requireExamConfig } from '@/lib/exams/registry';
import { examSaleStatus } from '@/lib/billing/availability';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { PASS_ACCESS_MONTHS, PRICES, addCalendarMonths } from '@/lib/billing/plans';
import {
  BillingError,
  billingOverview,
  cancelBeforeDeletion,
  handleWebhook,
  startCheckout,
  syncPassForUser,
  type BillingUser,
  type CheckoutInput,
} from '@/lib/billing/service';
import { getPassRow, listPasses } from '@/lib/billing/store';
import { ON, WEBHOOK_SECRET, fakeStripe, nowSeconds, stripeInvoice } from './helpers/fake-stripe';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * The Single Exam Pass: €23.99 once, one exam, six calendar months from the
 * payment Stripe confirms. Sold only for an exam with a practice format open
 * today; opened only by Stripe's record of the payment (webhook, or the
 * invoice read back by the server), never by the browser. Stripe is the fake
 * in helpers/fake-stripe.ts: nothing here reaches the network.
 */

const SAT = requireExamConfig('digital-sat');
const GMAT = requireExamConfig('gmat');

let db: Db;
let user: BillingUser;
let counter = 0;

beforeEach(async () => {
  db = await createTestDb();
  // Approved questions for the SAT only: GMAT has no practice format open.
  await seedQuestions(db, SAT, { perDomain: 8 });
  const id = await createUser(db);
  user = { id, email: `${id}@example.invalid`, displayName: 'Ada', isGuest: false };
});

const buy = (input: Partial<CheckoutInput>, fake = fakeStripe(), forUser = user) =>
  startCheckout(db, forUser, { offer: 'exam_pass', examKey: SAT.examKey, consent: true, requestId: 'req-00000001', ...input }, { settings: ON, stripe: fake.api });

async function rejection(promise: Promise<unknown>) {
  const error = await promise.then(() => null, (e: unknown) => e);
  expect(error).toBeInstanceOf(BillingError);
  return error as BillingError;
}

const access = async (userId = user.id, examKey = SAT.examKey) => (await loadEntitlements(db, userId, { settings: ON })).can('practice', examKey);

function event(type: string, object: unknown, created = nowSeconds()) {
  return JSON.stringify({ id: `evt_pass_${++counter}`, object: 'event', api_version: '2026-08-26.dahlia', created, livemode: false, type, data: { object } });
}
const sign = (payload: string) => Stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
const deliver = (payload: string, fake = fakeStripe()) => handleWebhook(db, payload, sign(payload), { settings: ON, stripe: fake.api });

describe('what can be sold', () => {
  it('sells a pass only for an exam with a paid practice format open on approved questions', async () => {
    expect(await examSaleStatus(db, SAT.examKey)).toMatchObject({ sellable: true, openFormats: expect.arrayContaining(['practice']) });
    expect(await examSaleStatus(db, GMAT.examKey)).toMatchObject({ sellable: false, openFormats: [] });
    expect(await examSaleStatus(db, 'no-such-exam')).toBeNull();
  });

  it('does not count questions that lack a standing human approval', async () => {
    const fresh = await createTestDb();
    await seedQuestions(fresh, SAT, { perDomain: 8, humanApproved: false });
    expect((await examSaleStatus(fresh, SAT.examKey))?.sellable).toBe(false);
  });

  it('refuses a pass for an exam with no open format on the server, before calling Stripe', async () => {
    const fake = fakeStripe();
    expect(await rejection(buy({ examKey: GMAT.examKey }, fake))).toMatchObject({ code: 'exam-unavailable', status: 409, messageKey: 'examUnavailable' });
    expect(fake.calls).toHaveLength(0);
  });

  it('refuses a pass without a known exam', async () => {
    const fake = fakeStripe();
    expect((await rejection(buy({ examKey: null }, fake))).code).toBe('unknown-exam');
    expect((await rejection(buy({ examKey: 'https://evil.example' }, fake))).code).toBe('unknown-exam');
    expect(fake.calls).toHaveLength(0);
  });
});

describe('buying a pass', () => {
  it('creates one invoice for the pass price that Stripe never charges on its own, and opens nothing yet', async () => {
    const fake = fakeStripe();
    const started = await buy({ sourceExam: 'gmat' }, fake);
    expect(started).toMatchObject({ kind: 'pass', id: 'in_new_1', intent: 'payment', status: 'pending', clientSecret: 'pi_in_new_1_secret_p' });

    const [params, options] = fake.called('invoices.create')[0]!.args as [Stripe.InvoiceCreateParams, Stripe.RequestOptions];
    expect(params).toMatchObject({
      customer: 'cus_new',
      currency: 'eur',
      collection_method: 'charge_automatically',
      auto_advance: false,
      pending_invoice_items_behavior: 'exclude',
      payment_settings: { payment_method_types: ['card'] },
      metadata: {
        examer_user_id: user.id,
        examer_purchase: 'exam_pass',
        plan: 'exam_pass',
        exam_key: SAT.examKey,
        price_lookup_key: PRICES.exam_pass.lookupKey,
        source_exam: 'gmat',
        withdrawal_waiver_at: expect.any(String),
      },
    });
    expect(options.idempotencyKey).toBe(`examer-pass-${user.id}-${SAT.examKey}-req-00000001`);
    expect(fake.called('prices.list')[0]!.args[0]).toMatchObject({ lookup_keys: [PRICES.exam_pass.lookupKey] });
    expect(fake.called('invoiceItems.create')[0]!.args[0]).toMatchObject({ customer: 'cus_new', invoice: 'in_new_1', pricing: { price: 'price_exam_pass' } });
    expect(fake.called('invoices.finalizeInvoice')[0]!.args[1]).toMatchObject({ auto_advance: false });

    expect(await getPassRow(db, 'in_new_1')).toMatchObject({
      user_id: user.id,
      exam_key: SAT.examKey,
      status: 'pending',
      amount: 2399,
      access_starts_at: null,
      access_ends_at: null,
      withdrawal_waiver_at: expect.any(String),
    });
    // The browser has a client secret; only Stripe's record of payment opens the exam.
    expect(await access()).toBe(false);
  });

  it('reuses the invoice still waiting for the same exam, so nobody pays twice', async () => {
    const fake = fakeStripe();
    const first = await buy({}, fake);
    const second = await buy({ requestId: 'req-00000002' }, fake);
    expect(second).toMatchObject({ id: first.id, clientSecret: first.clientSecret });
    expect(fake.called('invoices.create')).toHaveLength(1);
  });

  it('voids an abandoned invoice older than a day before starting again', async () => {
    const fake = fakeStripe();
    const first = await buy({}, fake);
    await db.prepare('UPDATE billing_passes SET created_at = ?').run(new Date(Date.now() - 23 * 3_600_000).toISOString());
    const second = await buy({ requestId: 'req-00000002' }, fake);
    expect(second.id).not.toBe(first.id);
    expect(fake.called('invoices.voidInvoice').map((call) => call.args[0])).toEqual([first.id]);
    expect((await getPassRow(db, first.id))?.status).toBe('void');
  });

  it('never sells a second pass for an exam the learner can already practise', async () => {
    const fake = fakeStripe();
    const started = await buy({}, fake);
    fake.pay(started.id);
    // The pending invoice turns out paid when the second checkout looks at it.
    expect(await rejection(buy({ requestId: 'req-00000002' }, fake))).toMatchObject({ code: 'already-subscribed', status: 409 });
    expect((await getPassRow(db, started.id))?.status).toBe('paid');
    expect((await rejection(buy({ requestId: 'req-00000003' }, fake))).code).toBe('already-subscribed');
    expect(fake.called('invoices.create')).toHaveLength(1);
  });

  it('opens the exam once Stripe has the payment, for six calendar months from it', async () => {
    const fake = fakeStripe();
    const started = await buy({}, fake);
    const paidAt = nowSeconds() - 30;
    fake.pay(started.id, paidAt);
    const row = await syncPassForUser(db, user.id, started.id, { settings: ON, stripe: fake.api });
    const start = new Date(paidAt * 1000);
    expect(row).toMatchObject({
      status: 'paid',
      access_starts_at: start.toISOString(),
      access_ends_at: addCalendarMonths(start, PASS_ACCESS_MONTHS).toISOString(),
      stripe_payment_intent_id: `pi_${started.id}`,
    });
    expect(await access()).toBe(true);
    expect(await access(user.id, GMAT.examKey)).toBe(false);
    const entitlements = await loadEntitlements(db, user.id, { settings: ON });
    expect(entitlements.can('ai_tutor', SAT.examKey)).toBe(false);
  });

  it('shows a pass to its owner only', async () => {
    const fake = fakeStripe();
    const started = await buy({}, fake);
    const stranger = await createUser(db);
    expect(await rejection(syncPassForUser(db, stranger, started.id, { settings: ON, stripe: fake.api }))).toMatchObject({
      code: 'unknown-pass',
      status: 404,
    });
    expect(await rejection(syncPassForUser(db, user.id, 'in_nothing', { settings: ON, stripe: fake.api }))).toMatchObject({ code: 'unknown-pass' });
  });

  it('lists passes on the account page, settling one whose webhook was missed', async () => {
    const fake = fakeStripe();
    const started = await buy({}, fake);
    fake.pay(started.id);
    const overview = await billingOverview(db, user.id, { settings: ON, stripe: fake.api });
    expect(overview.passes).toEqual([expect.objectContaining({ stripe_invoice_id: started.id, status: 'paid', exam_key: SAT.examKey })]);
  });

  it('voids a pass invoice still waiting for payment before the account is deleted', async () => {
    const fake = fakeStripe();
    const started = await buy({}, fake);
    await cancelBeforeDeletion(db, user.id, { settings: ON, stripe: fake.api });
    expect(fake.called('invoices.voidInvoice').map((call) => call.args[0])).toEqual([started.id]);
  });
});

describe('pass webhooks', () => {
  const paidInvoice = (overrides: Parameters<typeof stripeInvoice>[0] = {}) =>
    stripeInvoice({ id: 'in_pass', customer: 'cus_pass', userId: user.id, examKey: SAT.examKey, status: 'paid', ...overrides });

  it('opens the exam on invoice.paid, from the moment Stripe recorded the payment', async () => {
    const fake = fakeStripe();
    const paidAt = nowSeconds() - 300;
    const invoice = paidInvoice({ paidAt });
    fake.state.invoices.set('in_pass', invoice);
    expect(await deliver(event('invoice.paid', invoice), fake)).toMatchObject({ handled: true, duplicate: false, userId: user.id });
    // The invoice is re-read from Stripe, with its payment, for a later refund.
    expect(fake.called('invoices.retrieve')[0]!.args).toEqual(['in_pass', { expand: ['payments'] }]);
    expect(await getPassRow(db, 'in_pass')).toMatchObject({
      status: 'paid',
      access_starts_at: new Date(paidAt * 1000).toISOString(),
      access_ends_at: addCalendarMonths(new Date(paidAt * 1000), 6).toISOString(),
      stripe_payment_intent_id: 'pi_in_pass',
    });
    expect(await access()).toBe(true);
  });

  it('is idempotent: a redelivery changes nothing, and a later sync never moves the term', async () => {
    const fake = fakeStripe();
    const invoice = paidInvoice({ paidAt: nowSeconds() - 300 });
    fake.state.invoices.set('in_pass', invoice);
    const body = event('invoice.paid', invoice);
    await deliver(body, fake);
    const first = await getPassRow(db, 'in_pass');
    expect(await deliver(body, fake)).toMatchObject({ duplicate: true, handled: false });
    // The same payment reported again under a new event id, with a different paid_at, keeps the first term.
    fake.state.invoices.set('in_pass', paidInvoice({ paidAt: nowSeconds() }));
    await deliver(event('invoice.paid', invoice, nowSeconds() + 5), fake);
    expect(await getPassRow(db, 'in_pass')).toMatchObject({ access_starts_at: first!.access_starts_at, access_ends_at: first!.access_ends_at });
    expect(await db.prepare("SELECT SUM(count) AS n FROM funnel_counts WHERE event = 'purchase'").get()).toEqual({ n: 1 });
    expect(await listPasses(db, user.id)).toHaveLength(1);
  });

  it('marks an abandoned pass invoice void, which never opens anything', async () => {
    const fake = fakeStripe();
    const started = await buy({}, fake);
    const voided = await fake.api.invoices.voidInvoice(started.id);
    expect(await deliver(event('invoice.voided', voided), fake)).toMatchObject({ handled: true });
    expect((await getPassRow(db, started.id))?.status).toBe('void');
    expect(await access()).toBe(false);
  });

  it('ends access on a full refund, keeps it on a partial one, and a late paid event cannot reopen it', async () => {
    const fake = fakeStripe();
    const invoice = paidInvoice();
    fake.state.invoices.set('in_pass', invoice);
    await deliver(event('invoice.paid', invoice), fake);

    const partial = { id: 'ch_1', object: 'charge', payment_intent: 'pi_in_pass', refunded: false, amount_refunded: 500 };
    expect(await deliver(event('charge.refunded', partial), fake)).toMatchObject({ handled: false });
    expect(await access()).toBe(true);

    const full = { ...partial, refunded: true, amount_refunded: 2399 };
    expect(await deliver(event('charge.refunded', full), fake)).toMatchObject({ handled: true, userId: user.id });
    expect((await getPassRow(db, 'in_pass'))?.status).toBe('refunded');
    expect(await access()).toBe(false);

    await deliver(event('invoice.paid', invoice, nowSeconds() + 60), fake);
    expect((await getPassRow(db, 'in_pass'))?.status).toBe('refunded');
  });

  it('creates the pass from Stripe’s record when the checkout row was never stored', async () => {
    const fake = fakeStripe();
    const invoice = paidInvoice({ id: 'in_lost' });
    fake.state.invoices.set('in_lost', invoice);
    expect(await deliver(event('invoice.paid', invoice), fake)).toMatchObject({ handled: true });
    expect(await getPassRow(db, 'in_lost')).toMatchObject({ user_id: user.id, status: 'paid', exam_key: SAT.examKey });
  });

  it('leaves another product’s invoices alone, and invoices naming an exam or price we do not sell', async () => {
    const fake = fakeStripe();
    const someoneElses = paidInvoice({ id: 'in_other', purpose: null });
    const unknownExam = paidInvoice({ id: 'in_exam', examKey: 'not-an-exam' });
    const unknownPrice = paidInvoice({ id: 'in_price', lookupKey: 'vibeassist_credits_v1' });
    for (const invoice of [someoneElses, unknownExam, unknownPrice]) {
      fake.state.invoices.set(invoice.id!, invoice);
      expect(await deliver(event('invoice.paid', invoice), fake)).toMatchObject({ handled: false });
    }
    expect(await db.prepare('SELECT COUNT(*) AS n FROM billing_passes').get()).toEqual({ n: 0 });
    // A refund of a charge that is not a pass changes nothing either.
    expect(await deliver(event('charge.refunded', { id: 'ch_x', object: 'charge', payment_intent: 'pi_unknown', refunded: true }), fake)).toMatchObject({
      handled: false,
    });
  });

  it('never hands a stored pass to another account, whatever the invoice metadata says', async () => {
    const fake = fakeStripe();
    const started = await buy({}, fake);
    const intruder = await createUser(db);
    const forged = { ...fake.pay(started.id), metadata: { ...fake.state.invoices.get(started.id)!.metadata, examer_user_id: intruder } };
    fake.state.invoices.set(started.id, forged as Stripe.Invoice);
    await deliver(event('invoice.paid', forged), fake);
    expect((await getPassRow(db, started.id))?.user_id).toBe(user.id);
    expect(await access(intruder)).toBe(false);
    expect(await access(user.id)).toBe(true);
  });
});
