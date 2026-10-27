/**
 * Creates (or checks) the Stripe products and prices the plans in
 * src/lib/billing/plans.ts are sold with. Safe to run any number of times:
 *
 *   - a product is created only if its id does not exist yet;
 *   - a price is found by its lookup key and created only if none is active;
 *   - an existing price whose amount, currency or interval no longer matches
 *     plans.ts is reported, never changed (Stripe prices are immutable): bump
 *     the lookup key's version in plans.ts and run this again.
 *
 * Usage (reads STRIPE_SECRET_KEY from .env.local or the environment):
 *
 *   npm run stripe:setup              # create what is missing
 *   npm run stripe:setup -- --dry-run # only report
 *
 * Run it once with the test key and once with the live key. It makes network
 * calls to Stripe, so it does not run in the test suite.
 */
import { loadEnvConfig } from '@next/env';
import Stripe from 'stripe';
import { CURRENCY, PLANS, PLAN_COPY, PLAN_KEYS } from '../src/lib/billing/plans';

loadEnvConfig(process.cwd(), true);

const dryRun = process.argv.includes('--dry-run');

async function main(): Promise<void> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set (see .env.example and docs/BILLING.md).');
  const stripe = new Stripe(key, { httpClient: Stripe.createFetchHttpClient(), maxNetworkRetries: 2 });
  console.log(`Stripe ${/_live_/.test(key) ? 'LIVE' : 'test'} mode${dryRun ? ', dry run' : ''}\n`);

  let problems = 0;
  for (const planKey of PLAN_KEYS) {
    const plan = PLANS[planKey];
    const copy = PLAN_COPY.plans[planKey];

    // Product, by our fixed id.
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
          { id: plan.productId, name: `Examer ${copy.name}`, description: copy.tagline, metadata: { plan: planKey } },
          { idempotencyKey: `examer-setup-product-${plan.productId}` },
        );
        console.log(`product ${plan.productId}: created`);
      }
    }

    // Price, by lookup key.
    const found = await stripe.prices.list({ lookup_keys: [plan.lookupKey], active: true, limit: 1 });
    const price = found.data[0];
    if (price) {
      const mismatches = [
        price.unit_amount !== plan.amount ? `amount ${price.unit_amount} ≠ ${plan.amount}` : null,
        price.currency !== CURRENCY ? `currency ${price.currency} ≠ ${CURRENCY}` : null,
        price.recurring?.interval !== plan.interval ? `interval ${price.recurring?.interval} ≠ ${plan.interval}` : null,
        (price.recurring?.interval_count ?? 1) !== plan.intervalCount ? `interval count ≠ ${plan.intervalCount}` : null,
        price.tax_behavior !== 'inclusive' ? `tax_behavior ${price.tax_behavior} ≠ inclusive` : null,
      ].filter(Boolean);
      if (mismatches.length > 0) {
        problems += 1;
        console.log(`price ${plan.lookupKey}: ${price.id} DOES NOT MATCH plans.ts (${mismatches.join('; ')}).`);
        console.log('  Prices cannot be edited. Bump the lookup key version in plans.ts and run this again.');
      } else {
        console.log(`price ${plan.lookupKey}: ${price.id} matches`);
      }
    } else if (dryRun || !product) {
      console.log(`price ${plan.lookupKey}: missing, would create ${plan.amount} ${CURRENCY} per ${plan.interval}`);
    } else {
      const created = await stripe.prices.create(
        {
          product: product.id,
          currency: CURRENCY,
          unit_amount: plan.amount,
          // The price on the page is the price charged: VAT is inside it.
          tax_behavior: 'inclusive',
          recurring: { interval: plan.interval, interval_count: plan.intervalCount },
          lookup_key: plan.lookupKey,
          nickname: `${copy.name}, monthly`,
          metadata: { plan: planKey },
        },
        { idempotencyKey: `examer-setup-price-${plan.lookupKey}` },
      );
      console.log(`price ${plan.lookupKey}: created ${created.id}`);
    }
  }

  console.log(problems > 0 ? `\n${problems} problem(s) need attention.` : '\nStripe matches src/lib/billing/plans.ts.');
  if (problems > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
