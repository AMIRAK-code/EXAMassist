import { describe, expect, it } from 'vitest';
import { DISCOUNT_COUPONS, ensureDiscountCodes } from '@/lib/billing/discounts';
import { StripeError, type StripeRequest } from '@/lib/billing/stripe';

/** An in-memory Stripe with just coupons, products and promotion codes. */
function fakeStripe({ legacyApi = false } = {}) {
  const coupons = new Map<string, Record<string, unknown>>();
  const codes: Array<Record<string, unknown>> = [];
  const calls: string[] = [];
  const stripe: StripeRequest = async (method, path, params = {}) => {
    calls.push(`${method} ${path}`);
    if (method === 'POST' && path === 'products') return { id: params.id };
    if (method === 'GET' && path.startsWith('coupons/')) {
      const coupon = coupons.get(decodeURIComponent(path.slice('coupons/'.length)));
      if (!coupon) throw new StripeError(404, 'No such coupon', 'resource_missing');
      return coupon;
    }
    if (method === 'POST' && path === 'coupons') {
      coupons.set(params.id as string, params as Record<string, unknown>);
      return params;
    }
    if (method === 'GET' && path === 'promotion_codes') {
      return { data: codes.filter((c) => String(c.code).toLowerCase() === String(params.code).toLowerCase()) };
    }
    if (method === 'POST' && path === 'promotion_codes') {
      if (legacyApi && params.promotion) throw new StripeError(400, 'Received unknown parameter: promotion', 'parameter_unknown');
      const coupon = legacyApi ? params.coupon : (params.promotion as { coupon: string }).coupon;
      const row = { id: `promo_${codes.length + 1}`, code: params.code, coupon, active: true };
      codes.push(row);
      return row;
    }
    throw new Error(`unexpected ${method} ${path}`);
  };
  return { stripe, coupons, codes, calls };
}

describe('discount codes', () => {
  it('lists 30% off the first payment under both codes', () => {
    const [coupon] = DISCOUNT_COUPONS;
    expect(coupon).toMatchObject({ percentOff: 30, duration: 'once', codes: ['PARSAHARATI30', 'AMIRH30'] });
  });

  it('creates one coupon limited to Premium, and a promotion code for each code', async () => {
    const { stripe, coupons, codes } = fakeStripe();
    const [result] = await ensureDiscountCodes(stripe);
    expect(result.couponCreated).toBe(true);
    expect(coupons.get('examer_30_first_payment')).toMatchObject({
      percent_off: 30,
      duration: 'once',
      applies_to: { products: ['examer_premium'] },
    });
    expect(codes.map((c) => [c.code, c.coupon])).toEqual([
      ['PARSAHARATI30', 'examer_30_first_payment'],
      ['AMIRH30', 'examer_30_first_payment'],
    ]);
  });

  it('changes nothing when run again', async () => {
    const fake = fakeStripe();
    await ensureDiscountCodes(fake.stripe);
    const [again] = await ensureDiscountCodes(fake.stripe);
    expect(again.couponCreated).toBe(false);
    expect(again.codes.every((c) => !c.created)).toBe(true);
    expect(fake.codes).toHaveLength(2);
  });

  it('falls back to the older promotion-code parameters', async () => {
    const { stripe, codes } = fakeStripe({ legacyApi: true });
    await ensureDiscountCodes(stripe);
    expect(codes.map((c) => c.coupon)).toEqual(['examer_30_first_payment', 'examer_30_first_payment']);
  });

  it('refuses to reuse a coupon id whose terms differ', async () => {
    const fake = fakeStripe();
    fake.coupons.set('examer_30_first_payment', { id: 'examer_30_first_payment', percent_off: 20, duration: 'forever' });
    await expect(ensureDiscountCodes(fake.stripe)).rejects.toThrow(/different terms/);
  });
});
