import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CURRENCY,
  FREE_FEATURES,
  LEGACY_LOOKUP_KEYS,
  OFFERS,
  PASS_ACCESS_MONTHS,
  PLANS,
  PLAN_COPY,
  PLAN_KEYS,
  PRICES,
  PRICE_KEYS,
  addCalendarMonths,
  annualSaving,
  featureForSession,
  featureMatrix,
  formatPrice,
  formatWholePrice,
  isLegacyPremium,
  planForLookupKey,
  planIncludes,
  suggestedPlanFor,
} from '@/lib/billing/plans';
import { assertBillingConfig, billingConfigProblems, billingSettings, BillingConfigError } from '@/lib/billing/config';
import { buildAppearance } from '@/components/billing/stripe-appearance';
import { EXAM_CONFIGS } from '@/lib/exams/registry';
import { LOCALES } from '@/i18n/locales';

/** The plan definitions are the contract the owner edits; these pin what was agreed on 2026-10-29. */

describe('plans', () => {
  it('prices the pass at €23.99 once and Plus at €7.99 a month or €59.99 a year, in euros, VAT included', () => {
    expect(CURRENCY).toBe('eur');
    expect(PRICES.exam_pass).toMatchObject({ plan: 'exam_pass', amount: 2399, interval: 'once', lookupKey: 'examer_pass_exam_v1' });
    expect(PRICES.plus_month).toMatchObject({ plan: 'plus', amount: 799, interval: 'month', lookupKey: 'examer_plus_month_v1' });
    expect(PRICES.plus_year).toMatchObject({ plan: 'plus', amount: 5999, interval: 'year', lookupKey: 'examer_plus_year_v1' });
    expect(formatPrice(PRICES.exam_pass.amount)).toBe('€23.99');
    expect(formatPrice(PRICES.plus_month.amount)).toBe('€7.99');
    expect(formatPrice(PRICES.plus_year.amount)).toBe('€59.99');
    expect(PLAN_COPY.vatNote).toMatch(/VAT included/);
  });

  it('sells only the pass and Plus; Premium is announced, never on sale', () => {
    expect(OFFERS).toEqual(['exam_pass', 'plus_month', 'plus_year']);
    expect(PLANS.premium.status).toBe('coming-soon');
    expect(PRICES.premium_month.amount).toBe(1499);
    expect(PRICES.premium_year.amount).toBe(11900);
    expect(PLANS.all_access.status).toBe('legacy');
    expect(PLANS.single_exam.status).toBe('legacy');
  });

  it('gives the pass one exam for six calendar months, paid once, without the AI tutor', () => {
    expect(PLANS.exam_pass).toMatchObject({ scope: 'one-exam', billing: 'one-time' });
    expect(PASS_ACCESS_MONTHS).toBe(6);
    expect(planIncludes('exam_pass', 'ai_tutor')).toBe(false);
    expect(addCalendarMonths(new Date('2026-10-29T15:04:05Z'), 6).toISOString()).toBe('2027-04-29T15:04:05.000Z');
    expect(addCalendarMonths(new Date('2026-08-31T00:00:00Z'), 6).toISOString()).toBe('2027-02-28T00:00:00.000Z');
    expect(addCalendarMonths(new Date('2027-08-31T00:00:00Z'), 6).toISOString()).toBe('2028-02-29T00:00:00.000Z');
  });

  it('works out the yearly saving the copy states: 37%, approximately €5 a month', () => {
    const saving = annualSaving();
    expect(saving.percent).toBe(37);
    expect(formatWholePrice(saving.perMonthCents)).toBe('€5');
    // Every language states the computed figure, never a hard-coded one.
    for (const locale of LOCALES) {
      const billing = JSON.parse(fs.readFileSync(path.resolve(`messages/${locale}/billing.json`), 'utf8'));
      expect(billing.pricing.plus.yearlySaving, locale).toContain('{percent}');
      expect(billing.pricing.plus.yearlyApprox, locale).toContain('{price}');
    }
  });

  it('never promises unlimited AI use, in any language', () => {
    const unlimited = /unlimited|illimitat|sınırsız|ilimitad|nieograniczon/i;
    for (const locale of LOCALES) {
      for (const ns of ['billing', 'practice', 'about']) {
        const text = fs.readFileSync(path.resolve(`messages/${locale}/${ns}.json`), 'utf8');
        expect(text.match(unlimited), `${locale}/${ns}`).toBeNull();
      }
    }
  });

  it('gives every price a unique lookup key and every plan a unique product id, distinct from the first Premium keys', () => {
    const keys = PRICE_KEYS.map((key) => PRICES[key].lookupKey);
    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(PLAN_KEYS.map((key) => PLANS[key].productId)).size).toBe(PLAN_KEYS.length);
    for (const key of keys) expect(LEGACY_LOOKUP_KEYS).not.toHaveProperty(key);
  });

  it('resolves current and earlier prices to plans, and ignores prices that are not ours', () => {
    expect(planForLookupKey(PRICES.exam_pass.lookupKey)).toBe('exam_pass');
    expect(planForLookupKey(PRICES.plus_year.lookupKey)).toBe('plus');
    expect(planForLookupKey(PRICES.all_access_month.lookupKey)).toBe('all_access');
    expect(planForLookupKey(PRICES.single_exam_month.lookupKey)).toBe('single_exam');
    // The first Premium plans opened everything, the AI tutor included, and still do.
    expect(planForLookupKey('examer_premium_quarterly_v1')).toBe('all_access');
    expect(planIncludes('all_access', 'ai_tutor')).toBe(true);
    expect(isLegacyPremium('examer_premium_monthly_v1')).toBe(true);
    expect(isLegacyPremium(PRICES.premium_month.lookupKey)).toBe(false);
    expect(planForLookupKey('another_product_monthly')).toBeNull();
    expect(planForLookupKey(null)).toBeNull();
  });
});

describe('the free/paid matrix', () => {
  const row = (feature: string) => featureMatrix().find((r) => r.feature === feature)!;

  it('keeps guides, sample questions, the diagnostic and official score tracking free', () => {
    expect([...FREE_FEATURES].sort()).toEqual(['diagnostic', 'guides', 'official_scores', 'samples']);
    for (const feature of ['guides', 'samples', 'diagnostic', 'official_scores']) {
      expect(row(feature)).toMatchObject({ free: true, plans: { exam_pass: true, plus: true, premium: true } });
    }
  });

  it('puts practice, timed sections, simulations and study plans in the pass, Plus and Premium', () => {
    for (const feature of ['practice', 'timed_section', 'simulation', 'study_plan']) {
      expect(row(feature)).toMatchObject({ free: false, plans: { exam_pass: true, plus: true, premium: true } });
    }
  });

  it('keeps the AI tutor for Premium only, so nothing on sale suggests it', () => {
    expect(row('ai_tutor')).toMatchObject({ free: false, plans: { exam_pass: false, plus: false, premium: true } });
    expect(suggestedPlanFor('ai_tutor', 'gmat')).toBeNull();
    expect(suggestedPlanFor('practice', 'gmat')).toBe('exam_pass');
    expect(suggestedPlanFor('practice', null)).toBe('plus');
    expect(suggestedPlanFor('diagnostic')).toBeNull();
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
