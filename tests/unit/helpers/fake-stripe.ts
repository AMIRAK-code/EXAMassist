import type Stripe from 'stripe';
import { billingSettings } from '@/lib/billing/config';
import { PLANS, type PlanKey } from '@/lib/billing/plans';
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
          price: { id: `price_${plan}`, lookup_key: options.lookupKey ?? PLANS[plan].lookupKey },
        },
      ],
    },
    latest_invoice: options.latestInvoice ?? null,
    pending_setup_intent: options.pendingSetupIntent ?? null,
    default_payment_method: null,
  } as unknown as Stripe.Subscription;
}

export interface Call {
  method: string;
  args: unknown[];
}

export interface FakeState {
  subscriptions: Map<string, Stripe.Subscription>;
  prices: Partial<Record<string, string>>;
  customerMetadata: Record<string, Record<string, string>>;
  setupIntents: Record<string, Partial<Stripe.SetupIntent>>;
  nextSubscription: number;
  /** Status a newly created subscription starts with. */
  createdStatus: Stripe.Subscription.Status;
  /** What the first invoice carries: a payment secret, or nothing due (a SetupIntent). */
  firstPayment: 'payment' | 'setup';
  fail?: Error;
}

export function fakeStripe(initial: Partial<FakeState> = {}) {
  const state: FakeState = {
    subscriptions: new Map(),
    prices: { [PLANS.all_access.lookupKey]: 'price_all', [PLANS.single_exam.lookupKey]: 'price_single' },
    customerMetadata: {},
    setupIntents: {},
    nextSubscription: 1,
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
        const id = state.prices[key];
        return { data: id ? [{ id, lookup_key: key } as unknown as Stripe.Price] : [] };
      },
    },
    subscriptions: {
      async create(params, options) {
        record('subscriptions.create', params, options);
        const id = `sub_new_${state.nextSubscription++}`;
        const lookupKey = Object.entries(state.prices).find(([, price]) => price === params.items?.[0]?.price)?.[0];
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
    },
  };
  return { api, calls, state, called: (method: string) => calls.filter((call) => call.method === method) };
}
