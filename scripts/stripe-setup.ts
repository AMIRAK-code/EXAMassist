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
 *
 * Run it once with the test key and once with the live key, and only after
 * the owner has checked the account's tax settings (docs/BILLING.md). It makes
 * network calls to Stripe, so it does not run in the test suite.
 */
import { loadEnvConfig } from '@next/env';
import Stripe from 'stripe';
import { CURRENCY, PLANS, PLAN_COPY, PRICES, PRICE_KEYS, type PriceDefinition } from '../src/lib/billing/plans';

loadEnvConfig(process.cwd(), true);

const dryRun = process.argv.includes('--dry-run');

function describe(price: PriceDefinition): string {
  return price.interval === 'once' ? `${price.amount} ${CURRENCY} once` : `${price.amount} ${CURRENCY} per ${price.interval}`;
}

async function main(): Promise<void> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set (see .env.example and docs/BILLING.md).');
  const stripe = new Stripe(key, { httpClient: Stripe.createFetchHttpClient(), maxNetworkRetries: 2 });
  console.log(`Stripe ${/_live_/.test(key) ? 'LIVE' : 'test'} mode${dryRun ? ', dry run' : ''}\n`);

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
          console.log(`product ${plan.productId}: missing, would create "${copy.name}"`);
        } else {
          product = await stripe.products.create(
            { id: plan.productId, name: `Examer ${copy.name}`, description: copy.tagline, metadata: { plan: wanted.plan } },
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
  if (problems > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
