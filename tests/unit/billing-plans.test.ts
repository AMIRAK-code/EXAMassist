import { describe, expect, it } from 'vitest';
import {
  CURRENCY,
  FREE_FEATURES,
  LEGACY_LOOKUP_KEYS,
  PLANS,
  PLAN_COPY,
  PLAN_KEYS,
  cheapestPlanFor,
  featureForSession,
  featureMatrix,
  formatPrice,
  planForLookupKey,
  planIncludes,
} from '@/lib/billing/plans';
import { assertBillingConfig, billingConfigProblems, billingSettings, BillingConfigError } from '@/lib/billing/config';
import { buildAppearance } from '@/components/billing/stripe-appearance';
import { EXAM_CONFIGS } from '@/lib/exams/registry';

/** The plan definitions are the contract the owner edits; these pin what was agreed. */

describe('plans', () => {
  it('prices All access at €39.00 and Single exam at €19.99 a month, in euros, VAT included', () => {
    expect(CURRENCY).toBe('eur');
    expect(PLANS.all_access).toMatchObject({ amount: 3900, interval: 'month', intervalCount: 1, scope: 'all-exams' });
    expect(PLANS.single_exam).toMatchObject({ amount: 1999, interval: 'month', intervalCount: 1, scope: 'one-exam' });
    expect(formatPrice(PLANS.all_access.amount)).toBe('€39.00');
    expect(formatPrice(PLANS.single_exam.amount)).toBe('€19.99');
    expect(PLAN_COPY.vatNote).toMatch(/VAT included/);
  });

  it('gives every plan a unique lookup key and product id, distinct from the legacy Premium keys', () => {
    const keys = PLAN_KEYS.map((key) => PLANS[key].lookupKey);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(PLAN_KEYS.map((key) => PLANS[key].productId)).size).toBe(PLAN_KEYS.length);
    for (const key of keys) expect(LEGACY_LOOKUP_KEYS).not.toHaveProperty(key);
  });

  it('resolves current and legacy prices to plans, and ignores prices that are not ours', () => {
    expect(planForLookupKey(PLANS.all_access.lookupKey)).toBe('all_access');
    expect(planForLookupKey(PLANS.single_exam.lookupKey)).toBe('single_exam');
    expect(planForLookupKey('examer_premium_quarterly_v1')).toBe('all_access');
    expect(planForLookupKey('another_product_monthly')).toBeNull();
    expect(planForLookupKey(null)).toBeNull();
  });
});

describe('the free/paid matrix', () => {
  const row = (feature: string) => featureMatrix().find((r) => r.feature === feature)!;

  it('keeps guides, sample questions and the diagnostic free', () => {
    expect([...FREE_FEATURES].sort()).toEqual(['diagnostic', 'guides', 'samples']);
    for (const feature of ['guides', 'samples', 'diagnostic']) {
      expect(row(feature)).toMatchObject({ free: true, plans: { all_access: true, single_exam: true } });
    }
  });

  it('puts practice, timed sections, simulations and study plans in both paid plans', () => {
    for (const feature of ['practice', 'timed_section', 'simulation', 'study_plan']) {
      expect(row(feature)).toMatchObject({ free: false, plans: { all_access: true, single_exam: true } });
    }
  });

  it('keeps the AI tutor for All access only', () => {
    expect(row('ai_tutor')).toMatchObject({ free: false, plans: { all_access: true, single_exam: false } });
    expect(planIncludes('single_exam', 'ai_tutor')).toBe(false);
    expect(cheapestPlanFor('ai_tutor')).toBe('all_access');
    expect(cheapestPlanFor('practice')).toBe('single_exam');
    expect(cheapestPlanFor('diagnostic')).toBeNull();
  });

  it('labels every feature for the pricing page', () => {
    for (const r of featureMatrix()) expect(r.label.length).toBeGreaterThan(3);
  });
});

describe('what a session needs', () => {
  it('maps every format of every exam to a feature', () => {
    for (const config of EXAM_CONFIGS) {
      for (const blueprint of config.blueprints) {
        const feature = featureForSession(blueprint);
        if (blueprint.mode === 'simulation') expect(feature).toBe('simulation');
        else if (blueprint.mode === 'practice' && blueprint.timing !== 'untimed') expect(feature).toBe('timed_section');
        else expect(feature).toBe('practice');
      }
    }
  });

  it('makes only the fixed free diagnostic free: a freshly drawn diagnostic is practice', () => {
    expect(featureForSession({ mode: 'diagnostic', timing: 'per_part' }, { freeTest: true })).toBe('diagnostic');
    expect(featureForSession({ mode: 'diagnostic', timing: 'per_part' })).toBe('practice');
    expect(featureForSession({ mode: 'review', timing: 'untimed' })).toBe('practice');
  });
});

describe('billing settings', () => {
  const keys = { STRIPE_SECRET_KEY: 'sk_test_a', NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_a', STRIPE_WEBHOOK_SECRET: 'whsec_a' };

  it('is off by default, so everything stays free without keys', () => {
    const settings = billingSettings({});
    expect(settings).toMatchObject({ enforced: false, configured: false, checkoutAvailable: false });
    expect(() => assertBillingConfig({})).not.toThrow();
    expect(billingSettings({ BILLING_ENFORCED: 'false', ...keys }).enforced).toBe(false);
  });

  it('refuses to run enforced with any key missing', () => {
    expect(() => assertBillingConfig({ BILLING_ENFORCED: 'true' })).toThrow(BillingConfigError);
    expect(() => assertBillingConfig({ BILLING_ENFORCED: 'true', ...keys, STRIPE_WEBHOOK_SECRET: '' })).toThrow(/STRIPE_WEBHOOK_SECRET/);
    expect(() => assertBillingConfig({ BILLING_ENFORCED: 'true', ...keys, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ' ' })).toThrow(/PUBLISHABLE/);
    expect(assertBillingConfig({ BILLING_ENFORCED: 'true', ...keys }).enforced).toBe(true);
  });

  it('refuses malformed keys and keys from different modes', () => {
    expect(billingConfigProblems(billingSettings({ ...keys, STRIPE_SECRET_KEY: 'pk_test_wrong' }))).toHaveLength(1);
    expect(billingConfigProblems(billingSettings({ ...keys, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_live_a' }))).toEqual([
      expect.stringMatching(/different modes/),
    ]);
  });

  it('sells with test keys while everything is free, but never with live keys unless enforced', () => {
    expect(billingSettings(keys).checkoutAvailable).toBe(true);
    const live = { STRIPE_SECRET_KEY: 'sk_live_a', NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_live_a', STRIPE_WEBHOOK_SECRET: 'whsec_a' };
    expect(billingSettings(live).checkoutAvailable).toBe(false);
    expect(billingSettings({ ...live, BILLING_ENFORCED: 'true' }).checkoutAvailable).toBe(true);
  });
});

describe('the card fields look like ours', () => {
  it('maps the design tokens onto the Stripe Appearance API', () => {
    const appearance = buildAppearance();
    expect(appearance.variables).toMatchObject({
      colorPrimary: '#3155e7',
      colorBackground: '#fffdf8',
      colorText: '#151923',
      colorDanger: '#b42318',
      borderRadius: '10px',
      fontFamily: expect.stringContaining('Bricolage Grotesque'),
    });
    expect(appearance.rules?.['.Input']).toMatchObject({ border: '1.5px solid #8c897f' });
    expect(appearance.rules?.['.Input:focus']).toMatchObject({ outline: '2px solid #3155e7', outlineOffset: '2px' });
    expect(appearance.rules?.['.Input--invalid']).toMatchObject({ borderColor: '#b42318' });
  });

  it('follows the tokens when they change', () => {
    const appearance = buildAppearance((name) => (name === '--color-accent' ? ' #ff0000 ' : ''));
    expect(appearance.variables?.colorPrimary).toBe('#ff0000');
    expect(appearance.variables?.colorText).toBe('#151923');
  });
});
