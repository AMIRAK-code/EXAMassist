import type Stripe from 'stripe';
import type { Db } from '@/lib/db';
import { safeNext } from '@/lib/auth/next-path';
import { localizePath, type Locale } from '@/i18n/locales';
import { getExamConfig } from '@/lib/exams/registry';
import { countEvent, subjectFor } from '@/lib/analytics/funnel';
import { allExamSaleStatuses, examSaleStatus } from './availability';
import { assertBillingConfig, checkoutPath } from './config';
import { loadEntitlements } from './entitlements';
import { PLANS, PRICES, isPriceKey, priceForLookupKey } from './plans';
import { assertCanBuy, billingError, ensureCustomer, priceIdFor, type BillingUser, type CheckoutInput } from './service';
import { PASS_INVOICE_PURPOSE, getCustomerId } from './store';
import { stripeClient } from './stripe';

export type SessionClient = Pick<Stripe, 'checkout' | 'customers' | 'prices' | 'subscriptions' | 'tax'>;
type Slot = { attempt_id: string; session_id: string | null; offer: string | null; exam_key: string | null; status: string };

/** Creates payment UI only. Entitlements are written exclusively by webhooks. */
export async function startHostedCheckout(
  db: Db, user: BillingUser, input: CheckoutInput,
  location: { origin: string; locale: Locale },
  options: { settings?: ReturnType<typeof assertBillingConfig>; stripe?: SessionClient } = {},
) {
  const settings = options.settings ?? assertBillingConfig();
  if (!settings.checkoutAvailable) throw billingError('billing-off', 'billingOff', 503);
  assertCanBuy(user);
  if (!input.consent) throw billingError('consent-required', 'consentRequired');
  if (!isPriceKey(input.offer)) throw billingError('unknown-plan', 'unknownPlan');
  const price = PRICES[input.offer];
  const plan = PLANS[price.plan];
  if (plan.status !== 'on-sale') throw billingError('unknown-plan', plan.status === 'coming-soon' ? 'comingSoon' : 'unknownPlan', 409);
  const exam = plan.scope === 'one-exam' ? getExamConfig(input.examKey ?? '') : undefined;
  if (plan.scope === 'one-exam' && !exam) throw billingError('unknown-exam', 'unknownExam');
  if (exam ? !(await examSaleStatus(db, exam.examKey))?.sellable : !(await allExamSaleStatuses(db)).some(s => s.sellable)) {
    throw billingError('exam-unavailable', 'examUnavailable', 409);
  }
  const stripe = options.stripe ?? stripeClient(settings);
  // Persist a stable first-attempt key before any remote side effect. A failed
  // request or a crashed process will reuse Stripe's idempotency key.
  await db.prepare('INSERT INTO billing_checkouts (user_id, attempt_id) VALUES (?, ?) ON CONFLICT (user_id) DO NOTHING').run(user.id, input.requestId);
  return db.transaction(async () => {
    const slot = await db.prepare(`SELECT * FROM billing_checkouts WHERE user_id = ?${db.dialect === 'postgres' ? ' FOR UPDATE' : ''}`).get(user.id) as Slot;
    const owned = await loadEntitlements(db, user.id, { settings: { ...settings, enforced: true } });
    if (owned.hasAllAccess) throw billingError('already-subscribed', 'alreadyAllAccess', 409);
    if (exam && owned.singleExamKeys.includes(exam.examKey)) throw billingError('already-subscribed', 'alreadyThisExam', 409);
    const customerId = await getCustomerId(db, user.id);
    // Also check Stripe: a completed checkout may beat its webhook delivery.
    if (customerId) {
      const subs = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 100 });
      if (subs.data.some(s => ['active', 'trialing', 'past_due', 'unpaid', 'paused', 'incomplete'].includes(s.status) &&
        s.items.data.some(i => Boolean(priceForLookupKey(i.price.lookup_key ?? ''))))) {
        throw billingError('already-subscribed', 'alreadyAllAccess', 409);
      }
    }
    if (slot.session_id) {
      const current = await stripe.checkout.sessions.retrieve(slot.session_id);
      const sameOrder = slot.offer === input.offer && slot.exam_key === (exam?.examKey ?? null);
      if (current.status === 'complete' && !['failed', 'fulfilled'].includes(slot.status) && (sameOrder || current.payment_status !== 'paid')) {
        // A paid checkout or a delayed bank payment must never be purchased twice.
        // A paid one for something else (a pass for another exam) does not
        // block this purchase, even before its webhook has arrived; Plus bought
        // that way is caught by the subscription check above.
        return { url: `${location.origin}${localizePath(`/checkout/complete?session_id=${current.id}`, location.locale)}` };
      }
      if (current.status === 'open') {
        if (slot.offer === input.offer && slot.exam_key === (exam?.examKey ?? null) && current.url) return { url: current.url };
        await stripe.checkout.sessions.expire(current.id);
      }
    }
    if (settings.automaticTax) {
      const registrations = await stripe.tax.registrations.list({ status: 'active', limit: 1 });
      if (!registrations.data.length) throw billingError('billing-misconfigured', 'misconfigured', 503);
    }
    // Narrow structural adapters keep the existing tested customer/price validators.
    const customer = await ensureCustomer(db, user, stripe);
    const priceId = await priceIdFor(stripe, input.offer);
    const source = getExamConfig(input.sourceExam ?? '')?.examKey ?? exam?.examKey;
    const returnTo = safeNext(input.returnTo ?? undefined);
    const metadata: Record<string, string> = {
      examer_user_id: user.id, plan: price.plan, price_key: input.offer,
      price_lookup_key: price.lookupKey, checkout_flow: 'sessions',
      ...(exam ? { exam_key: exam.examKey, examer_purchase: PASS_INVOICE_PURPOSE } : {}),
      ...(source ? { source_exam: source } : {}),
      ...(returnTo ? { return_to: returnTo } : {}),
    };
    // The verified session creation time records consent; no moving timestamp
    // in Stripe parameters, so a timed-out request can be retried idempotently.
    const back = `${checkoutPath(input.offer, exam?.examKey)}${source ? `&source=${encodeURIComponent(source)}` : ''}${returnTo ? `&next=${encodeURIComponent(returnTo)}` : ''}&cancelled=1`;
    const session = await stripe.checkout.sessions.create({
      mode: plan.billing === 'one-time' ? 'payment' : 'subscription',
      customer, client_reference_id: user.id, metadata,
      line_items: [{ price: priceId, quantity: 1 }],
      locale: location.locale,
      success_url: `${location.origin}${localizePath('/checkout/complete', location.locale)}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${location.origin}${localizePath(back, location.locale)}`,
      customer_update: { address: 'auto' },
      // Stripe's own "Add promotion code" box. Codes live only in Stripe
      // (Dashboard -> Product catalogue -> Coupons), which checks their
      // limits; fulfilment keys on metadata and payment status, never the amount.
      allow_promotion_codes: true,
      ...(settings.automaticTax ? { automatic_tax: { enabled: true } } : {}),
      ...(plan.billing === 'one-time'
        ? { invoice_creation: { enabled: true, invoice_data: { metadata } }, payment_intent_data: { metadata } }
        : { subscription_data: { metadata } }),
      branding_settings: { display_name: 'UniExamer', background_color: '#f7f5ef', button_color: '#3155e7' },
      integration_identifier: 'uniexamer-paywall-qmktvhsp',
    } as Stripe.Checkout.SessionCreateParams, { idempotencyKey: `uniexamer-session-${user.id}-${slot.session_id ?? slot.attempt_id}` });
    if (!session.url) throw billingError('billing-unavailable', 'unavailable', 503);
    await db.prepare("UPDATE billing_checkouts SET session_id = ?, offer = ?, exam_key = ?, status = 'pending' WHERE user_id = ?")
      .run(session.id, input.offer, exam?.examKey ?? null, user.id);
    await countEvent(db, 'checkout_start', subjectFor(source), 'n/a');
    return { url: session.url };
  })();
}
