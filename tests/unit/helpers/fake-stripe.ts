import type Stripe from 'stripe';
import { billingSettings } from '@/lib/billing/config';
import { PRICES, type PlanKey, type PriceKey } from '@/lib/billing/plans';
import { PASS_INVOICE_PURPOSE } from '@/lib/billing/store';
import type { StripeApi } from '@/lib/billing/stripe';

/**
 * A stand-in for the Stripe API. The Stripe API is not reachable from the test
 * environment, and the suite must not depend on it, so every billing test
 * passes this instead: it records each call and answers from a small
 * in-memory account. Webhook signatures are still produced and checked by the
 * real SDK (Stripe.webhooks.generateTestHeaderString / constructEventAsync).
 */

export const WEBHOOK_SECRET = 'whsec_unit_test_secret';

export const BILLING_ENV = {
  BILLING_ENFORCED: 'true',
  STRIPE_SECRET_KEY: 'sk_test_unit',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_unit',
  STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
};

export const ON = billingSettings(BILLING_ENV);
export const OFF = billingSettings({});

const DAY = 24 * 60 * 60;
export const nowSeconds = () => Math.floor(Date.now() / 1000);

/** The price a test subscription is on, when only its plan is given. */
const DEFAULT_PRICE: Partial<Record<PlanKey, PriceKey>> = {
  plus: 'plus_month',
  all_access: 'all_access_month',
  single_exam: 'single_exam_month',
  premium: 'premium_month',
};

/** A Stripe subscription object, shaped as the 2026 API returns it (period on the item). */
export function stripeSubscription(options: {
  id?: string;
  customer?: string;
  plan?: PlanKey;
  lookupKey?: string;
  status?: Stripe.Subscription.Status;
  examKey?: string;
  userId?: string;
  periodEnd?: number;
  created?: number;
  cancelAtPeriodEnd?: boolean;
  latestInvoice?: unknown;
  pendingSetupIntent?: unknown;
}): Stripe.Subscription {
  const plan = options.plan ?? 'all_access';
  return {
    id: options.id ?? 'sub_test_1',
    object: 'subscription',
    customer: options.customer ?? 'cus_test_1',
    status: options.status ?? 'active',
    created: options.created ?? nowSeconds() - DAY,
    cancel_at_period_end: options.cancelAtPeriodEnd ?? false,
    cancel_at: null,
    metadata: {
      ...(options.userId ? { examer_user_id: options.userId } : {}),
      ...(options.examKey ? { exam_key: options.examKey } : {}),
      plan,
    },
    items: {
      object: 'list',
      data: [
        {
          id: 'si_test',
          current_period_end: options.periodEnd ?? nowSeconds() + 30 * DAY,
          price: { id: `price_${plan}`, lookup_key: options.lookupKey ?? PRICES[DEFAULT_PRICE[plan] ?? 'plus_month'].lookupKey },
        },
      ],
    },
    latest_invoice: options.latestInvoice ?? null,
    pending_setup_intent: options.pendingSetupIntent ?? null,
    default_payment_method: null,
  } as unknown as Stripe.Subscription;
}

/** A Single Exam Pass invoice as Stripe returns it, with the metadata our checkout writes. */
export function stripeInvoice(options: {
  id?: string;
  customer?: string;
  userId?: string;
  examKey?: string;
  status?: Stripe.Invoice.Status;
  paidAt?: number | null;
  created?: number;
  paymentIntent?: string | null;
  lookupKey?: string;
  purpose?: string | null;
  subscription?: string | null;
}): Stripe.Invoice {
  const id = options.id ?? 'in_test_1';
  const status = options.status ?? 'open';
  const paidAt = options.paidAt === undefined ? (status === 'paid' ? nowSeconds() - 60 : null) : options.paidAt;
  const paymentIntent = options.paymentIntent === undefined ? `pi_${id}` : options.paymentIntent;
  return {
    id,
    object: 'invoice',
    customer: options.customer ?? 'cus_test_1',
    status,
    created: options.created ?? nowSeconds() - 120,
    currency: 'eur',
    amount_due: PRICES.exam_pass.amount,
    amount_paid: status === 'paid' ? PRICES.exam_pass.amount : 0,
    status_transitions: { paid_at: paidAt, finalized_at: null, voided_at: null, marked_uncollectible_at: null },
    confirmation_secret: status === 'open' ? { client_secret: `pi_${id}_secret_p`, type: 'payment_intent' } : null,
    payments: {
      object: 'list',
      data:
        status === 'paid' && paymentIntent
          ? [{ id: 'inpay_1', status: 'paid', payment: { type: 'payment_intent', payment_intent: paymentIntent } }]
          : [],
    },
    parent: options.subscription ? { type: 'subscription_details', subscription_details: { subscription: options.subscription } } : null,
    metadata: {
      ...(options.purpose === null ? {} : { examer_purchase: options.purpose ?? PASS_INVOICE_PURPOSE }),
      ...(options.userId ? { examer_user_id: options.userId } : {}),
      ...(options.examKey ? { exam_key: options.examKey } : {}),
      plan: 'exam_pass',
      price_lookup_key: options.lookupKey ?? PRICES.exam_pass.lookupKey,
    },
  } as unknown as Stripe.Invoice;
}

/** A Stripe price as prices.list returns it for a lookup key. */
export function stripePrice(key: PriceKey, overrides: Partial<Stripe.Price> = {}): Stripe.Price {
  const price = PRICES[key];
  return {
    id: `price_${key}`,
    object: 'price',
    lookup_key: price.lookupKey,
    unit_amount: price.amount,
    currency: 'eur',
    tax_behavior: 'inclusive',
    type: price.interval === 'once' ? 'one_time' : 'recurring',
    recurring: price.interval === 'once' ? null : { interval: price.interval, interval_count: 1 },
    ...overrides,
  } as unknown as Stripe.Price;
}

export interface Call {
  method: string;
  args: unknown[];
}

export interface FakeState {
  subscriptions: Map<string, Stripe.Subscription>;
  invoices: Map<string, Stripe.Invoice>;
  /** Active prices by lookup key. */
  prices: Partial<Record<string, Stripe.Price>>;
  customerMetadata: Record<string, Record<string, string>>;
  setupIntents: Record<string, Partial<Stripe.SetupIntent>>;
  nextSubscription: number;
  nextInvoice: number;
  /** Status a newly created subscription starts with. */
  createdStatus: Stripe.Subscription.Status;
  /** What the first invoice carries: a payment secret, or nothing due (a SetupIntent). */
  firstPayment: 'payment' | 'setup';
  fail?: Error;
}

export function fakeStripe(initial: Partial<FakeState> = {}) {
  const state: FakeState = {
    subscriptions: new Map(),
    invoices: new Map(),
    prices: Object.fromEntries((['exam_pass', 'plus_month', 'plus_year'] as const).map((key) => [PRICES[key].lookupKey, stripePrice(key)])),
    customerMetadata: {},
    setupIntents: {},
    nextSubscription: 1,
    nextInvoice: 1,
    createdStatus: 'incomplete',
    firstPayment: 'payment',
    ...initial,
  };
  const calls: Call[] = [];
  const record = (method: string, ...args: unknown[]) => {
    calls.push({ method, args });
    if (state.fail) throw state.fail;
  };
  const withIntent = (subscription: Stripe.Subscription) =>
    ({
      ...subscription,
      latest_invoice:
        state.firstPayment === 'payment'
          ? { id: `in_${subscription.id}`, confirmation_secret: { client_secret: `pi_${subscription.id}_secret_x`, type: 'payment_intent' } }
          : { id: `in_${subscription.id}`, confirmation_secret: null },
      pending_setup_intent: state.firstPayment === 'setup' ? { id: `seti_${subscription.id}`, client_secret: `seti_${subscription.id}_secret_y` } : null,
    }) as unknown as Stripe.Subscription;

  const api: StripeApi = {
    customers: {
      async create(params) {
        record('customers.create', params);
        return { id: 'cus_new', object: 'customer', email: params.email ?? null, metadata: params.metadata ?? {} } as unknown as Stripe.Customer;
      },
      async retrieve(id) {
        record('customers.retrieve', id);
        return { id, object: 'customer', email: null, metadata: state.customerMetadata[id] ?? {}, invoice_settings: {} } as unknown as Stripe.Customer;
      },
      async update(id, params) {
        record('customers.update', id, params);
        return { id, object: 'customer' } as unknown as Stripe.Customer;
      },
    },
    prices: {
      async list(params) {
        record('prices.list', params);
        const key = params.lookup_keys?.[0] ?? '';
        const price = state.prices[key];
        return { data: price ? [price] : [] };
      },
    },
    subscriptions: {
      async create(params, options) {
        record('subscriptions.create', params, options);
        const id = `sub_new_${state.nextSubscription++}`;
        const lookupKey = Object.values(state.prices).find((price) => price?.id === params.items?.[0]?.price)?.lookup_key ?? undefined;
        const created = stripeSubscription({
          id,
          customer: params.customer,
          status: state.createdStatus,
          plan: (params.metadata as Record<string, string>)?.plan as PlanKey,
          lookupKey,
          examKey: (params.metadata as Record<string, string>)?.exam_key,
          userId: (params.metadata as Record<string, string>)?.examer_user_id,
          created: nowSeconds(),
        });
        state.subscriptions.set(id, created);
        return withIntent(created);
      },
      async retrieve(id, params) {
        record('subscriptions.retrieve', id, params);
        const found = state.subscriptions.get(id);
        if (!found) throw new Error(`no such subscription ${id}`);
        return params?.expand ? withIntent(found) : found;
      },
      async update(id, params) {
        record('subscriptions.update', id, params);
        const found = state.subscriptions.get(id);
        if (!found) throw new Error(`no such subscription ${id}`);
        const updated = {
          ...found,
          ...(params.cancel_at_period_end !== undefined ? { cancel_at_period_end: params.cancel_at_period_end } : {}),
        } as Stripe.Subscription;
        state.subscriptions.set(id, updated);
        return updated;
      },
      async list(params) {
        record('subscriptions.list', params);
        return { data: [...state.subscriptions.values()].filter((s) => s.customer === params.customer) };
      },
      async cancel(id) {
        record('subscriptions.cancel', id);
        const found = state.subscriptions.get(id)!;
        const cancelled = { ...found, status: 'canceled' } as Stripe.Subscription;
        state.subscriptions.set(id, cancelled);
        return cancelled;
      },
    },
    setupIntents: {
      async create(params) {
        record('setupIntents.create', params);
        return { id: 'seti_new', client_secret: 'seti_new_secret_z', customer: params.customer } as unknown as Stripe.SetupIntent;
      },
      async retrieve(id) {
        record('setupIntents.retrieve', id);
        return { id, ...(state.setupIntents[id] ?? {}) } as unknown as Stripe.SetupIntent;
      },
    },
    invoices: {
      async pay(id, params) {
        record('invoices.pay', id, params);
        return { id, status: 'paid' } as unknown as Stripe.Invoice;
      },
      async create(params, options) {
        record('invoices.create', params, options);
        const id = `in_new_${state.nextInvoice++}`;
        const metadata = (params.metadata ?? {}) as Record<string, string>;
        const draft = {
          ...stripeInvoice({ id, customer: params.customer, userId: metadata.examer_user_id, examKey: metadata.exam_key, created: nowSeconds() }),
          status: 'draft',
          metadata,
          confirmation_secret: null,
        } as unknown as Stripe.Invoice;
        state.invoices.set(id, draft);
        return draft;
      },
      async retrieve(id, params) {
        record('invoices.retrieve', id, params);
        const found = state.invoices.get(id);
        if (!found) throw new Error(`no such invoice ${id}`);
        return found;
      },
      async finalizeInvoice(id, params, options) {
        record('invoices.finalizeInvoice', id, params, options);
        const found = state.invoices.get(id);
        if (!found) throw new Error(`no such invoice ${id}`);
        const open = { ...found, status: 'open', confirmation_secret: { client_secret: `pi_${id}_secret_p`, type: 'payment_intent' } } as unknown as Stripe.Invoice;
        state.invoices.set(id, open);
        return open;
      },
      async voidInvoice(id) {
        record('invoices.voidInvoice', id);
        const found = state.invoices.get(id);
        if (!found) throw new Error(`no such invoice ${id}`);
        const voided = { ...found, status: 'void', confirmation_secret: null } as unknown as Stripe.Invoice;
        state.invoices.set(id, voided);
        return voided;
      },
    },
    invoiceItems: {
      async create(params, options) {
        record('invoiceItems.create', params, options);
        return { id: 'ii_new', invoice: params.invoice ?? null } as unknown as Stripe.InvoiceItem;
      },
    },
  };
  /** What Stripe records when the buyer confirms the payment in the browser. */
  const pay = (id: string, paidAt = nowSeconds()) => {
    const found = state.invoices.get(id)!;
    const paid = {
      ...found,
      status: 'paid',
      amount_paid: found.amount_due,
      status_transitions: { ...found.status_transitions, paid_at: paidAt },
      confirmation_secret: null,
      payments: { object: 'list', data: [{ id: 'inpay_1', status: 'paid', payment: { type: 'payment_intent', payment_intent: `pi_${id}` } }] },
    } as unknown as Stripe.Invoice;
    state.invoices.set(id, paid);
    return paid;
  };
  return { api, calls, state, pay, called: (method: string) => calls.filter((call) => call.method === method) };
}
