import { loadEnvConfig } from '@next/env';
import { billingSettings } from '../src/lib/billing/config';
import { DISCOUNT_COUPONS, ensureDiscountCodes } from '../src/lib/billing/discounts';
import { stripeClient } from '../src/lib/billing/stripe';

/**
 * Creates the discount codes listed in src/lib/billing/discounts.ts in the
 * Stripe account of STRIPE_SECRET_KEY. Safe to run again: existing coupons and
 * codes are left as they are.
 *
 *   npm run billing:discounts
 */

loadEnvConfig(process.cwd(), true);

async function main() {
  const settings = billingSettings();
  if (!settings.secretKey) throw new Error('STRIPE_SECRET_KEY is not set. Set it (live or test) and run again.');
  console.log(`Stripe ${settings.livemode ? 'LIVE' : 'test'} mode`);

  const results = await ensureDiscountCodes(stripeClient(settings));
  for (const result of results) {
    const coupon = DISCOUNT_COUPONS.find((c) => c.id === result.coupon)!;
    console.log(`\n${coupon.name} (${coupon.percentOff}% off, ${coupon.duration}) — coupon ${result.coupon} ${result.couponCreated ? 'created' : 'already existed'}`);
    for (const code of result.codes) {
      console.log(`  ${code.code.padEnd(16)} ${code.created ? 'created' : 'already existed'}${code.active ? '' : '  (INACTIVE in Stripe)'}`);
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
