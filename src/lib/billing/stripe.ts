import Stripe from 'stripe';
import { billingSettings, type BillingSettings } from './config';

/**
 * The Stripe SDK, as this site uses it.
 *
 * `StripeApi` names only the calls the billing service makes, so tests can
 * pass a small fake instead of the network (tests/unit/billing-*.test.ts).
 * The real client uses the fetch HTTP client, which works the same in Node
 * and on Cloudflare Workers.
 */

type Opts = Stripe.RequestOptions;

export interface StripeApi {
  customers: {
    create(params: Stripe.CustomerCreateParams, options?: Opts): Promise<Stripe.Customer>;
    retrieve(id: string, params?: Stripe.CustomerRetrieveParams, options?: Opts): Promise<Stripe.Customer | Stripe.DeletedCustomer>;
    update(id: string, params: Stripe.CustomerUpdateParams, options?: Opts): Promise<Stripe.Customer>;
  };
  prices: {
    list(params: Stripe.PriceListParams, options?: Opts): Promise<{ data: Stripe.Price[] }>;
  };
  subscriptions: {
    create(params: Stripe.SubscriptionCreateParams, options?: Opts): Promise<Stripe.Subscription>;
    retrieve(id: string, params?: Stripe.SubscriptionRetrieveParams, options?: Opts): Promise<Stripe.Subscription>;
    update(id: string, params: Stripe.SubscriptionUpdateParams, options?: Opts): Promise<Stripe.Subscription>;
    list(params: Stripe.SubscriptionListParams, options?: Opts): Promise<{ data: Stripe.Subscription[] }>;
    cancel(id: string, params?: Stripe.SubscriptionCancelParams, options?: Opts): Promise<Stripe.Subscription>;
  };
  setupIntents: {
    create(params: Stripe.SetupIntentCreateParams, options?: Opts): Promise<Stripe.SetupIntent>;
    retrieve(id: string, params?: Stripe.SetupIntentRetrieveParams, options?: Opts): Promise<Stripe.SetupIntent>;
  };
  invoices: {
    pay(id: string, params?: Stripe.InvoicePayParams, options?: Opts): Promise<Stripe.Invoice>;
    /** A Single Exam Pass is one one-off invoice: created, given its line, finalised, then paid in the browser. */
    create(params: Stripe.InvoiceCreateParams, options?: Opts): Promise<Stripe.Invoice>;
    retrieve(id: string, params?: Stripe.InvoiceRetrieveParams, options?: Opts): Promise<Stripe.Invoice>;
    finalizeInvoice(id: string, params?: Stripe.InvoiceFinalizeInvoiceParams, options?: Opts): Promise<Stripe.Invoice>;
    voidInvoice(id: string, params?: Stripe.InvoiceVoidInvoiceParams, options?: Opts): Promise<Stripe.Invoice>;
  };
  invoiceItems: {
    create(params: Stripe.InvoiceItemCreateParams, options?: Opts): Promise<Stripe.InvoiceItem>;
  };
}

let cached: { key: string; client: Stripe } | null = null;

/** The SDK client for this deployment's secret key. */
export function stripeClient(settings: BillingSettings = billingSettings()): Stripe {
  if (!settings.secretKey) throw new StripeNotConfiguredError();
  if (cached?.key !== settings.secretKey) {
    cached = {
      key: settings.secretKey,
      client: new Stripe(settings.secretKey, {
        httpClient: Stripe.createFetchHttpClient(),
        maxNetworkRetries: 1,
        timeout: 15_000,
        appInfo: { name: 'UniExamer', url: 'https://uniexamer.com' },
      }),
    };
  }
  return cached.client;
}

export class StripeNotConfiguredError extends Error {
  constructor() {
    super('Stripe is not configured on this deployment (STRIPE_SECRET_KEY is empty).');
    this.name = 'StripeNotConfiguredError';
  }
}

/**
 * The events the webhook endpoint sends (docs/BILLING.md). handleWebhook
 * acknowledges any other type without acting on it; scripts/stripe-setup.ts
 * enables exactly these on the endpoint it creates.
 */
export const WEBHOOK_EVENTS = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
  'invoice.voided',
  'charge.refunded',
] as const satisfies readonly Stripe.WebhookEndpointCreateParams.EnabledEvent[];

/**
 * Verifies a webhook delivery against the raw request body and returns the
 * event. Throws Stripe's signature error for anything that does not verify,
 * including a delivery older than five minutes (a replay).
 */
export async function verifyWebhookEvent(
  payload: string,
  signature: string | null,
  secret: string,
  options: { toleranceSeconds?: number; nowMs?: number } = {},
): Promise<Stripe.Event> {
  // An empty header fails verification inside the SDK with its own signature error.
  return Stripe.webhooks.constructEventAsync(
    payload,
    signature ?? '',
    secret,
    options.toleranceSeconds ?? 300,
    undefined,
    options.nowMs,
  );
}

export function isSignatureError(error: unknown): boolean {
  return error instanceof Stripe.errors.StripeSignatureVerificationError;
}

/** A Stripe API error, with the fields the service decides on. */
export function asStripeError(error: unknown): { type: string; code?: string; statusCode?: number; message: string } | null {
  if (error instanceof Stripe.errors.StripeError) {
    return { type: error.type, code: error.code, statusCode: error.statusCode, message: error.message };
  }
  return null;
}
