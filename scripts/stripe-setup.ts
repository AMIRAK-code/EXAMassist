/**
 * Creates (or checks) the Stripe products and prices the plans in
 * src/lib/billing/plans.ts are sold with. Safe to run any number of times:
 *
 *   - only plans ON SALE are created: the Single Exam Pass (a one-time price)
 *     and Plus (a monthly and a yearly price). Premium is "coming soon" and
 *     is never created here; the earlier plans are only reported on;
 *   - a product is created only if its id does not exist yet;
 *   - a price is found by its lookup key and created only if none is active;
 *   - an existing price whose amount, currency, tax behaviour or interval no
 *     longer matches plans.ts is reported, never changed (Stripe prices are
 *     immutable): bump the lookup key's version in plans.ts and run this again.
 *     The checkout refuses a price that does not match (service.ts, priceIdFor).
 *
 * Usage (reads STRIPE_SECRET_KEY from .env.local or the environment):
 *
 *   npm run stripe:setup              # create what is missing
 *   npm run stripe:setup -- --dry-run # only report
 *   npm run stripe:setup -- --connect # the live setup for the production Worker
 *
 * --connect is release step 6 in docs/BILLING.md in one go. It asks for the
 * live secret key (not echoed) and the live publishable key instead of reading
 * them from a file, does the above, creates the webhook endpoint for the site
 * (`--site=https://…`, default https://uniexamer.com) with the events
 * handleWebhook expects, and stores the keys and the endpoint's signing secret
 * as Worker secrets through `wrangler secret bulk`. Nothing secret is printed
 * or written to disk. It refuses test keys, since the production Worker must
 * only ever hold live ones, and it does not turn the paywall on: that is
 * BILLING_ENFORCED in wrangler.jsonc.
 *
 * Run it once with the test key and once with the live key, and only after
 * the owner has checked the account's tax settings (docs/BILLING.md). It makes
 * network calls to Stripe, so it does not run in the test suite.
 */
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { loadEnvConfig } from '@next/env';
import Stripe from 'stripe';
import { CURRENCY, PLANS, PLAN_COPY, PRICES, PRICE_KEYS, type PriceDefinition } from '../src/lib/billing/plans';
import { WEBHOOK_EVENTS } from '../src/lib/billing/stripe';

loadEnvConfig(process.cwd(), true);

const dryRun = process.argv.includes('--dry-run');
const connect = process.argv.includes('--connect');
const site = (process.argv.find((arg) => arg.startsWith('--site='))?.slice('--site='.length) ?? 'https://uniexamer.com').replace(/\/+$/, '');

function describe(price: PriceDefinition): string {
  return price.interval === 'once' ? `${price.amount} ${CURRENCY} once` : `${price.amount} ${CURRENCY} per ${price.interval}`;
}

/** Drops what a terminal may add around pasted text (bracketed paste, stray control characters). */
const cleanInput = (value: string) => value.replace(/\x1b\[20[01]~/g, '').replace(/[\x00-\x1f\x7f]/g, '').trim();

/** Reads a line without echoing it, for the secret key. */
function askHidden(question: string): Promise<string> {
  const stdin = process.stdin;
  if (!stdin.isTTY) return Promise.reject(new Error('--connect asks for the keys and needs an interactive terminal.'));
  process.stdout.write(question);
  return new Promise((resolve, reject) => {
    let value = '';
    const done = (error: Error | null) => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(cleanInput(value));
    };
    const onData = (chunk: string) => {
      for (const char of chunk) {
        if (char === '\r' || char === '\n') return done(null);
        if (char === '\u0003') return done(new Error('Cancelled.'));
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
        else value += char;
      }
    };
    stdin.setRawMode(true);
    stdin.setEncoding('utf8');
    stdin.resume();
    stdin.on('data', onData);
  });
}

async function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    return cleanInput(await rl.question(question));
  } finally {
    rl.close();
  }
}

/**
 * The webhook endpoint for the site, created with exactly WEBHOOK_EVENTS and
 * the API version this SDK's types describe. Returns its signing secret when
 * it was created now: Stripe shows that secret only once.
 */
async function connectWebhook(stripe: Stripe): Promise<string | null> {
  const url = `${site}/api/billing/webhook`;
  const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
  const existing = endpoints.data.find((endpoint) => endpoint.url === url);
  if (existing) {
    const missing = WEBHOOK_EVENTS.filter((type) => !existing.enabled_events.includes(type) && !existing.enabled_events.includes('*'));
    if (missing.length > 0) {
      await stripe.webhookEndpoints.update(existing.id, {
        enabled_events: [...existing.enabled_events, ...missing] as Stripe.WebhookEndpointUpdateParams.EnabledEvent[],
      });
      console.log(`webhook ${url}: added ${missing.join(', ')}`);
    }
    console.log(`webhook ${url}: exists (${existing.id}, ${existing.status}, API ${existing.api_version ?? 'account default'})`);
    console.log('  Stripe shows a signing secret only when the endpoint is created. If the Worker does not have it,');
    console.log('  roll the secret in the dashboard (Developers > Webhooks) and run: npx wrangler secret put STRIPE_WEBHOOK_SECRET');
    return null;
  }
  const created = await stripe.webhookEndpoints.create({
    url,
    enabled_events: [...WEBHOOK_EVENTS],
    api_version: Stripe.API_VERSION,
    description: 'UniExamer passes and Plus (docs/BILLING.md)',
    metadata: { app: 'examer' },
  });
  console.log(`webhook ${url}: created ${created.id} (API ${Stripe.API_VERSION})`);
  return created.secret ?? null;
}

/** Stores values as secrets of the Worker in wrangler.jsonc, passed on stdin so they never reach the console or a file. */
function storeWorkerSecrets(values: Record<string, string>): boolean {
  const result = spawnSync('npx', ['wrangler', 'secret', 'bulk'], {
    input: JSON.stringify(values),
    stdio: ['pipe', 'inherit', 'inherit'],
    shell: process.platform === 'win32',
  });
  return result.status === 0;
}

async function main(): Promise<void> {
  let key = process.env.STRIPE_SECRET_KEY?.trim();
  let publishableKey: string | null = null;
  if (connect) {
    key = await askHidden('Stripe LIVE secret key (sk_live_… or rk_live_…, not shown): ');
    if (!/^(sk|rk)_live_\w+$/.test(key)) throw new Error('That is not a live secret key. --connect only stores live keys on the production Worker.');
    publishableKey = await ask('Stripe LIVE publishable key (pk_live_…): ');
    if (!/^pk_live_\w+$/.test(publishableKey)) throw new Error('That is not a live publishable key (pk_live_…).');
  }
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set (see .env.example and docs/BILLING.md).');
  const stripe = new Stripe(key, { httpClient: Stripe.createFetchHttpClient(), maxNetworkRetries: 2 });
  console.log(`Stripe ${/_live_/.test(key) ? 'LIVE' : 'test'} mode${dryRun ? ', dry run' : ''}`);
  if (connect) {
    // The account may be shared with another product: say which one these keys open.
    const account = await stripe.accounts.retrieveCurrent().catch(() => null);
    if (account) console.log(`account ${account.id}: ${account.settings?.dashboard?.display_name ?? account.business_profile?.name ?? 'no display name'}`);
  }
  console.log('');

  let problems = 0;
  const products = new Map<string, Stripe.Product | null>();

  for (const priceKey of PRICE_KEYS) {
    const wanted = PRICES[priceKey];
    const plan = PLANS[wanted.plan];
    const copy = PLAN_COPY.plans[wanted.plan];

    if (plan.status === 'coming-soon') {
      console.log(`price ${wanted.lookupKey}: ${copy.name} is coming soon, not created`);
      continue;
    }
    if (plan.status === 'legacy') {
      // Kept for the people who hold it; never created again.
      const found = await stripe.prices.list({ lookup_keys: [wanted.lookupKey], limit: 1 });
      console.log(`price ${wanted.lookupKey}: earlier plan, ${found.data[0] ? `exists (${found.data[0].id})` : 'not in this account'}`);
      continue;
    }

    // Product, by our fixed id (one per plan).
    if (!products.has(plan.productId)) {
      let product: Stripe.Product | null = null;
      try {
        product = await stripe.products.retrieve(plan.productId);
        console.log(`product ${plan.productId}: exists${product.active ? '' : ' (INACTIVE: reactivate it in the dashboard)'}`);
        if (!product.active) problems += 1;
      } catch (error) {
        if (!(error instanceof Stripe.errors.StripeError && error.code === 'resource_missing')) throw error;
        if (dryRun) {
          console.log(`product ${plan.productId}: missing, would create "UniExamer ${copy.name}"`);
        } else {
          // The product name is what receipts and invoices show.
          product = await stripe.products.create(
            { id: plan.productId, name: `UniExamer ${copy.name}`, description: copy.tagline, metadata: { plan: wanted.plan } },
            { idempotencyKey: `examer-setup-product-${plan.productId}` },
          );
          console.log(`product ${plan.productId}: created`);
        }
      }
      products.set(plan.productId, product);
    }
    const product = products.get(plan.productId) ?? null;

    // Price, by lookup key.
    const found = await stripe.prices.list({ lookup_keys: [wanted.lookupKey], active: true, limit: 1 });
    const price = found.data[0];
    if (price) {
      const interval = price.recurring?.interval ?? 'once';
      const mismatches = [
        price.unit_amount !== wanted.amount ? `amount ${price.unit_amount} ≠ ${wanted.amount}` : null,
        price.currency !== CURRENCY ? `currency ${price.currency} ≠ ${CURRENCY}` : null,
        interval !== wanted.interval ? `interval ${interval} ≠ ${wanted.interval}` : null,
        (price.recurring?.interval_count ?? 1) !== 1 ? 'interval count ≠ 1' : null,
        price.tax_behavior !== 'inclusive' ? `tax_behavior ${price.tax_behavior} ≠ inclusive` : null,
      ].filter(Boolean);
      if (mismatches.length > 0) {
        problems += 1;
        console.log(`price ${wanted.lookupKey}: ${price.id} DOES NOT MATCH plans.ts (${mismatches.join('; ')}).`);
        console.log('  Prices cannot be edited. Bump the lookup key version in plans.ts and run this again.');
      } else {
        console.log(`price ${wanted.lookupKey}: ${price.id} matches`);
      }
    } else if (dryRun || !product) {
      console.log(`price ${wanted.lookupKey}: missing, would create ${describe(wanted)}`);
    } else {
      const created = await stripe.prices.create(
        {
          product: product.id,
          currency: CURRENCY,
          unit_amount: wanted.amount,
          // The price on the page is the price charged: VAT is inside it.
          tax_behavior: 'inclusive',
          ...(wanted.interval === 'once' ? {} : { recurring: { interval: wanted.interval, interval_count: 1 } }),
          lookup_key: wanted.lookupKey,
          nickname: `${copy.name}, ${wanted.interval === 'once' ? 'one payment' : wanted.interval === 'year' ? 'yearly' : 'monthly'}`,
          metadata: { plan: wanted.plan, price_key: wanted.key },
        },
        { idempotencyKey: `examer-setup-price-${wanted.lookupKey}` },
      );
      console.log(`price ${wanted.lookupKey}: created ${created.id}`);
    }
  }

  console.log(problems > 0 ? `\n${problems} problem(s) need attention.` : '\nStripe matches src/lib/billing/plans.ts.');

  if (connect && !dryRun && problems === 0 && publishableKey) {
    const webhookSecret = await connectWebhook(stripe);
    const secrets: Record<string, string> = { STRIPE_SECRET_KEY: key, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: publishableKey };
    if (webhookSecret) secrets.STRIPE_WEBHOOK_SECRET = webhookSecret;
    console.log(`\nStoring ${Object.keys(secrets).join(', ')} on the Worker…`);
    if (!storeWorkerSecrets(secrets)) {
      problems += 1;
      console.log('Storing the Worker secrets failed.' + (webhookSecret ? ' The new endpoint\'s signing secret was not saved: roll it in the dashboard and run npx wrangler secret put STRIPE_WEBHOOK_SECRET.' : ''));
    } else {
      console.log('Done. Nothing is sold until BILLING_ENFORCED is "true" in wrangler.jsonc and the site is deployed.');
    }
  }
  if (problems > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
