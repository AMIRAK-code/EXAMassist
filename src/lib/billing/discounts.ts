import { PREMIUM_PRODUCT_ID, PREMIUM_PRODUCT_NAME } from './config';
import { StripeError, type StripeRequest } from './stripe';

/**
 * Discount codes a learner can type on the Stripe Checkout page.
 *
 * Checkout already shows Stripe's promotion-code box (allow_promotion_codes in
 * startCheckout), so a code needs nothing in the app at checkout time: it only
 * has to exist in Stripe. `npm run billing:discounts` creates what is listed
 * here, and is safe to run again.
 *
 * One coupon carries the discount; each code is its own promotion code on it,
 * so Stripe counts redemptions per code. A coupon's terms cannot be changed
 * once it exists: for different terms, add a new coupon with a new id.
 */

export interface DiscountCoupon {
  /** Stripe coupon id. */
  id: string;
  /** Shown to the customer on Checkout and on the invoice. */
  name: string;
  percentOff: number;
  /** 'once' discounts the first payment of a subscription only; renewals are at full price. */
  duration: 'once' | 'forever';
  /** What people type at checkout. Stripe matches them case-insensitively. */
  codes: string[];
}

export const DISCOUNT_COUPONS: readonly DiscountCoupon[] = [
  {
    id: 'examer_30_first_payment',
    name: '30% off your first payment',
    percentOff: 30,
    duration: 'once',
    codes: ['PARSAHARATI30', 'AMIRH30'],
  },
];

export interface DiscountResult {
  coupon: string;
  couponCreated: boolean;
  codes: Array<{ code: string; id: string; created: boolean; active: boolean }>;
}

const isMissing = (error: unknown) =>
  error instanceof StripeError && (error.status === 404 || error.code === 'resource_missing');

/** The Premium product the coupon is limited to; created here if no checkout has run yet. */
async function ensurePremiumProduct(stripe: StripeRequest): Promise<void> {
  try {
    await stripe('POST', 'products', {
      id: PREMIUM_PRODUCT_ID,
      name: PREMIUM_PRODUCT_NAME,
      description: 'Every exam and every practice format on Examer, with full results and review.',
    });
  } catch (error) {
    if (!(error instanceof StripeError && error.code === 'resource_already_exists')) throw error;
  }
}

async function ensureCoupon(stripe: StripeRequest, coupon: DiscountCoupon): Promise<boolean> {
  try {
    const existing = await stripe('GET', `coupons/${encodeURIComponent(coupon.id)}`);
    if (existing.percent_off !== coupon.percentOff || existing.duration !== coupon.duration) {
      throw new Error(
        `Stripe coupon ${coupon.id} exists with different terms (${existing.percent_off}% ${existing.duration}). ` +
          'Coupons cannot be edited: give the new terms a new coupon id.',
      );
    }
    return false;
  } catch (error) {
    if (!isMissing(error)) throw error;
  }
  await ensurePremiumProduct(stripe);
  await stripe('POST', 'coupons', {
    id: coupon.id,
    name: coupon.name,
    percent_off: coupon.percentOff,
    duration: coupon.duration,
    applies_to: { products: [PREMIUM_PRODUCT_ID] },
  });
  return true;
}

/**
 * Creates a promotion code. Newer Stripe API versions take the coupon as
 * promotion[coupon]; older ones as coupon. The account's default version
 * decides, so try the new form and fall back.
 */
async function createPromotionCode(stripe: StripeRequest, couponId: string, code: string) {
  const common = { code, metadata: { source: 'examer-discounts' } };
  try {
    return await stripe('POST', 'promotion_codes', { ...common, promotion: { type: 'coupon', coupon: couponId } });
  } catch (error) {
    if (!(error instanceof StripeError && error.code === 'parameter_unknown')) throw error;
    return stripe('POST', 'promotion_codes', { ...common, coupon: couponId });
  }
}

/** Makes sure every listed coupon and code exists in Stripe. Never changes or deletes anything. */
export async function ensureDiscountCodes(
  stripe: StripeRequest,
  coupons: readonly DiscountCoupon[] = DISCOUNT_COUPONS,
): Promise<DiscountResult[]> {
  const results: DiscountResult[] = [];
  for (const coupon of coupons) {
    const couponCreated = await ensureCoupon(stripe, coupon);
    const codes: DiscountResult['codes'] = [];
    for (const code of coupon.codes) {
      const found = await stripe('GET', 'promotion_codes', { code, limit: 1 });
      const existing = found.data?.[0];
      if (existing) {
        codes.push({ code, id: existing.id, created: false, active: Boolean(existing.active) });
      } else {
        const created = await createPromotionCode(stripe, coupon.id, code);
        codes.push({ code, id: created.id, created: true, active: Boolean(created.active ?? true) });
      }
    }
    results.push({ coupon: coupon.id, couponCreated, codes });
  }
  return results;
}
