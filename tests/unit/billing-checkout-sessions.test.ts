import { beforeEach, describe, expect, it } from 'vitest';
import Stripe from 'stripe';
import type { Db } from '@/lib/db';
import { requireExamConfig } from '@/lib/exams/registry';
import { startHostedCheckout, type SessionClient } from '@/lib/billing/checkout-sessions';
import { handleWebhook, type BillingUser } from '@/lib/billing/service';
import { loadEntitlements } from '@/lib/billing/entitlements';
import { getPassRow } from '@/lib/billing/store';
import type { PriceKey } from '@/lib/billing/plans';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';
import { fakeStripe, ON, WEBHOOK_SECRET, stripeInvoice, stripeSubscription } from './helpers/fake-stripe';

let db: Db;
let user: BillingUser;
beforeEach(async () => {
  db = await createTestDb();
  await seedQuestions(db, requireExamConfig('digital-sat'), { perDomain: 8 });
  const id = await createUser(db);
  user = { id, email: `${id}@example.invalid`, displayName: 'Learner', isGuest: false, emailVerifiedAt: '2026-01-01T00:00:00.000Z' };
});

function provider() {
  const base = fakeStripe();
  const sessions = new Map<string, Stripe.Checkout.Session>();
  const creates: Stripe.Checkout.SessionCreateParams[] = [];
  const idempotent = new Map<string, Stripe.Checkout.Session>();
  const checkout = { sessions: {
    create: async (params: Stripe.Checkout.SessionCreateParams, options?: Stripe.RequestOptions) => {
      const key = options?.idempotencyKey ?? '';
      if (idempotent.has(key)) return idempotent.get(key)!;
      creates.push(params);
      const id = `cs_test_${creates.length}`;
      const session = { ...params, id, created: Math.floor(Date.now() / 1000), status: 'open', payment_status: 'unpaid', url: `https://checkout.stripe.com/${id}` } as unknown as Stripe.Checkout.Session;
      sessions.set(id, session); idempotent.set(key, session); return session;
    },
    retrieve: async (id: string) => sessions.get(id)!,
    expire: async (id: string) => { const s = sessions.get(id)!; s.status = 'expired'; return s; },
  } } as unknown as Stripe['checkout'];
  base.api.checkout = checkout;
  const stripe = { ...base.api, tax: { registrations: { list: async () => ({ data: [] }) } } } as unknown as SessionClient;
  return { base, stripe, sessions, creates };
}
const buy = (p: ReturnType<typeof provider>, offer: PriceKey = 'exam_pass', examKey = 'digital-sat') => startHostedCheckout(db, user, {
  offer, examKey, consent: true, requestId: 'request-0001', sourceExam: examKey,
}, { origin: 'https://uniexamer.com', locale: 'it' }, { settings: ON, stripe: p.stripe });

async function deliver(p: ReturnType<typeof provider>, type: string, object: unknown, id = `evt_${crypto.randomUUID()}`) {
  const payload = JSON.stringify({ id, object: 'event', type, created: Math.floor(Date.now() / 1000), data: { object }, livemode: false });
  return handleWebhook(db, payload, Stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET }), { settings: ON, stripe: p.base.api });
}

describe('Checkout Sessions', () => {
  it('refuses an account whose email is not confirmed, before calling Stripe', async () => {
    const p = provider();
    for (const emailVerifiedAt of [null, undefined]) {
      user = { ...user, emailVerifiedAt };
      await expect(buy(p)).rejects.toMatchObject({ code: 'email-unverified', status: 403, messageKey: 'emailUnverified' });
    }
    expect(p.creates).toHaveLength(0);
  });

  it.each(['exam_pass', 'plus_month', 'plus_year'] as const)('uses validated server prices and dynamic methods for %s', async offer => {
    const p = provider();
    await buy(p, offer);
    expect(p.creates[0]).toMatchObject({ mode: offer === 'exam_pass' ? 'payment' : 'subscription', locale: 'it', metadata: { source_exam: 'digital-sat' }, allow_promotion_codes: true });
    expect(p.creates[0]).not.toHaveProperty('payment_method_types');
    expect(p.creates[0].success_url).toContain('/it/checkout/complete?session_id={CHECKOUT_SESSION_ID}');
    expect(p.creates[0].cancel_url).toContain('cancelled=1');
    expect((await loadEntitlements(db, user.id, { settings: ON })).can('practice', 'digital-sat')).toBe(false);
  });
  it('reuses the same checkout across concurrent tabs', async () => {
    const p = provider();
    const [a, b] = await Promise.all([buy(p), buy(p)]);
    expect(a).toEqual(b); expect(p.creates).toHaveLength(1);
  });
  it('recovers a remote creation timeout with the persisted idempotency key', async () => {
    const p = provider();
    const create = p.stripe.checkout.sessions.create;
    let timeout = true;
    p.stripe.checkout.sessions.create = (async (...args: Parameters<typeof create>) => {
      const result = await create(...args);
      if (timeout) { timeout = false; throw new Error('connection lost after creation'); }
      return result;
    }) as typeof create;
    await expect(buy(p)).rejects.toThrow('connection lost');
    expect((await buy(p)).url).toContain('cs_test_1');
    expect(p.creates).toHaveLength(1);
  });
  it('expires the old session before changing billing intervals', async () => {
    const p = provider(); await buy(p, 'plus_month'); await buy(p, 'plus_year');
    expect(p.sessions.get('cs_test_1')?.status).toBe('expired'); expect(p.creates).toHaveLength(2);
  });
  it('refuses Premium, unavailable exams, and mismatched Stripe prices', async () => {
    const p = provider();
    await expect(buy(p, 'premium_year')).rejects.toMatchObject({ messageKey: 'comingSoon' });
    await expect(buy(p, 'exam_pass', 'gmat')).rejects.toMatchObject({ code: 'exam-unavailable' });
    for (const price of Object.values(p.base.state.prices)) if (price) price.unit_amount = 1;
    await expect(buy(p)).rejects.toMatchObject({ messageKey: 'misconfigured' });
    expect(p.creates).toHaveLength(0);
  });
  it('refuses automatic tax when there is no active registration', async () => {
    const p = provider();
    await expect(startHostedCheckout(db, user, { offer: 'plus_month', consent: true, requestId: 'request-0001' }, { origin: 'https://uniexamer.com', locale: 'en' }, { settings: { ...ON, automaticTax: true }, stripe: p.stripe })).rejects.toMatchObject({ messageKey: 'misconfigured' });
    expect(p.creates).toHaveLength(0);
  });
  it('keeps delayed payments locked, grants once on success, and honors refunds', async () => {
    const p = provider(); await buy(p);
    const session = p.sessions.get('cs_test_1')!;
    session.status = 'complete'; session.invoice = 'in_paid';
    await deliver(p, 'checkout.session.completed', session);
    expect(await getPassRow(db, 'in_paid')).toBeNull();
    // Re-entering checkout during settlement must not create a second payment.
    expect((await buy(p)).url).toContain('session_id=cs_test_1');
    expect(p.creates).toHaveLength(1);
    const invoice = stripeInvoice({ id: 'in_paid', userId: user.id, customer: 'cus_new', examKey: 'digital-sat', status: 'paid', paidAt: Math.floor(Date.now() / 1000), paymentIntent: 'pi_paid' });
    p.base.state.invoices.set(invoice.id, invoice);
    session.payment_status = 'paid';
    await deliver(p, 'checkout.session.async_payment_succeeded', session, 'evt_paid');
    const before = await getPassRow(db, invoice.id);
    expect(before?.status).toBe('paid');
    expect((await deliver(p, 'checkout.session.async_payment_succeeded', session, 'evt_paid')).duplicate).toBe(true);
    expect((await getPassRow(db, invoice.id))?.access_ends_at).toBe(before?.access_ends_at);
    await deliver(p, 'charge.refunded', { payment_intent: 'pi_paid', refunded: true });
    expect((await getPassRow(db, invoice.id))?.status).toBe('refunded');
  });
  it('grants a pass paid at a promotion-code discount, recording what was paid', async () => {
    const p = provider(); await buy(p);
    const session = p.sessions.get('cs_test_1')!;
    session.status = 'complete'; session.payment_status = 'paid'; session.invoice = 'in_promo';
    const invoice = stripeInvoice({ id: 'in_promo', userId: user.id, customer: 'cus_new', examKey: 'digital-sat', status: 'paid', paymentIntent: 'pi_promo' });
    invoice.amount_paid = 100;
    p.base.state.invoices.set(invoice.id, invoice);
    await deliver(p, 'checkout.session.completed', session);
    expect(await getPassRow(db, 'in_promo')).toMatchObject({ status: 'paid', amount: 100 });
    expect((await loadEntitlements(db, user.id, { settings: ON })).can('practice', 'digital-sat')).toBe(true);
  });
  it.each(['active', 'past_due'] as const)('does not grant a new %s subscription before its first delayed payment settles', async status => {
    const p = provider(); await buy(p, 'plus_month');
    const sub = stripeSubscription({ id: 'sub_delayed', customer: 'cus_new', plan: 'plus', userId: user.id, latestInvoice: 'in_unpaid' });
    sub.metadata.checkout_flow = 'sessions';
    sub.status = status;
    p.base.state.invoices.set('in_unpaid', { id: 'in_unpaid', status: 'open' } as Stripe.Invoice);
    await deliver(p, 'customer.subscription.created', sub);
    expect((await loadEntitlements(db, user.id, { settings: ON })).hasAllAccess).toBe(false);
  });
  it.each(['checkout.session.async_payment_failed', 'checkout.session.expired'])('keeps access closed after %s and permits a fresh session', async type => {
    const p = provider(); await buy(p);
    const session = p.sessions.get('cs_test_1')!;
    session.status = type.endsWith('expired') ? 'expired' : 'complete';
    await deliver(p, type, session);
    expect((await loadEntitlements(db, user.id, { settings: ON })).can('practice', 'digital-sat')).toBe(false);
    await buy(p);
    expect(p.creates).toHaveLength(2);
  });
  it('preserves an internal destination and rejects an external destination', async () => {
    const p = provider();
    const input = { offer: 'plus_month' as const, consent: true, requestId: 'request-0001', sourceExam: 'digital-sat', returnTo: '/study-plan?exam=digital-sat' };
    await startHostedCheckout(db, user, input, { origin: 'https://uniexamer.com', locale: 'en' }, { settings: ON, stripe: p.stripe });
    expect(p.creates[0].metadata?.return_to).toBe(input.returnTo);
    expect(p.creates[0].cancel_url).toContain('next=%2Fstudy-plan%3Fexam%3Ddigital-sat');
    p.sessions.get('cs_test_1')!.status = 'expired';
    await startHostedCheckout(db, user, { ...input, returnTo: '//evil.example' }, { origin: 'https://uniexamer.com', locale: 'en' }, { settings: ON, stripe: p.stripe });
    expect(p.creates[1].metadata).not.toHaveProperty('return_to');
  });
  it('refuses an existing legacy subscriber even before their webhook arrives', async () => {
    const p = provider(); await buy(p, 'plus_month');
    p.base.state.subscriptions.set('sub_old', stripeSubscription({ id: 'sub_old', customer: 'cus_new', plan: 'all_access', userId: user.id }));
    await expect(buy(p, 'plus_year')).rejects.toMatchObject({ code: 'already-subscribed' });
  });
  it('lets a paid pass for one exam be followed by a pass for another before its webhook arrives', async () => {
    await seedQuestions(db, requireExamConfig('gmat'), { perDomain: 8 });
    const p = provider(); await buy(p);
    const first = p.sessions.get('cs_test_1')!;
    first.status = 'complete'; first.payment_status = 'paid';
    // The same pass again still goes back to the first purchase.
    expect((await buy(p)).url).toContain('session_id=cs_test_1');
    expect((await buy(p, 'exam_pass', 'gmat')).url).toContain('cs_test_2');
    expect(p.creates).toHaveLength(2);
  });
});
