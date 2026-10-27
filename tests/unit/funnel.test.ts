import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import {
  classifyReferrer,
  countEvent,
  countPageView,
  funnelReport,
  isLikelyBot,
  subjectFor,
} from '@/lib/analytics/funnel';
import { recordResponse, startAttempt, submitAttempt } from '@/lib/attempts/service';
import { billingSettings, PLANS } from '@/lib/billing/config';
import { isNewPurchase, startCheckout, syncCustomer } from '@/lib/billing/service';
import type { StripeRequest } from '@/lib/billing/stripe';
import { requireExamConfig } from '@/lib/exams/registry';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * The funnel counts: daily totals with nothing that identifies a visitor,
 * and the exam a learner chose carried through checkout.
 */

const CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';
const headers = (values: Record<string, string>) => new Headers(values);

let db: Db;
beforeEach(async () => {
  db = await createTestDb();
});

async function totals() {
  return (await db.prepare('SELECT day, event, subject, source, count FROM funnel_counts ORDER BY event, source').all()) as Array<
    Record<string, unknown>
  >;
}

describe('classifying where a visit came from', () => {
  it('keeps only a coarse source', () => {
    expect(classifyReferrer('https://www.google.it/', 'exam.assist365.app')).toBe('search');
    expect(classifyReferrer('https://www.bing.com/search?q=bocconi', 'exam.assist365.app')).toBe('search');
    expect(classifyReferrer('https://duckduckgo.com/', 'exam.assist365.app')).toBe('search');
    expect(classifyReferrer('https://chatgpt.com/', 'exam.assist365.app')).toBe('ai');
    expect(classifyReferrer('https://www.perplexity.ai/search/x', 'exam.assist365.app')).toBe('ai');
    expect(classifyReferrer('https://gemini.google.com/app', 'exam.assist365.app')).toBe('ai');
    expect(classifyReferrer('https://exam.assist365.app/guides', 'exam.assist365.app')).toBe('internal');
    expect(classifyReferrer('https://assist365.app/', 'exam.assist365.app')).toBe('other');
    expect(classifyReferrer(null, 'exam.assist365.app')).toBe('direct');
    expect(classifyReferrer('not a url', 'exam.assist365.app')).toBe('other');
  });

  it('skips crawlers and assistants fetching for a user', () => {
    expect(isLikelyBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe(true);
    expect(isLikelyBot('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0')).toBe(true);
    expect(isLikelyBot('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0')).toBe(true);
    expect(isLikelyBot(null)).toBe(true);
    expect(isLikelyBot(CHROME)).toBe(false);
  });

  it('records only known exams as subjects', () => {
    expect(subjectFor('bocconi-undergraduate')).toBe('bocconi-undergraduate');
    expect(subjectFor('../../etc')).toBe('none');
    expect(subjectFor(undefined)).toBe('none');
  });
});

describe('counting', () => {
  it('adds to a daily total and stores nothing else', async () => {
    const now = new Date('2026-10-07T10:00:00Z');
    await countEvent(db, 'checkout_start', 'bocconi-undergraduate', 'n/a', now);
    await countEvent(db, 'checkout_start', 'bocconi-undergraduate', 'n/a', now);
    expect(await totals()).toEqual([
      { day: '2026-10-07', event: 'checkout_start', subject: 'bocconi-undergraduate', source: 'n/a', count: 2 },
    ]);
  });

  it('counts a person’s page view by source, and not a crawler’s or a prefetch', async () => {
    const page = { 'user-agent': CHROME, host: 'exam.assist365.app' };
    await countPageView(db, 'landing_view', 'bocconi-online-test', headers({ ...page, referer: 'https://www.google.com/' }));
    await countPageView(db, 'landing_view', 'bocconi-online-test', headers({ ...page }));
    await countPageView(db, 'landing_view', 'bocconi-online-test', headers({ ...page, 'next-router-prefetch': '1' }));
    await countPageView(db, 'landing_view', 'bocconi-online-test', headers({ 'user-agent': 'Googlebot/2.1', host: 'exam.assist365.app' }));
    const rows = await totals();
    expect(rows.map((r) => [r.source, r.count])).toEqual([
      ['direct', 1],
      ['search', 1],
    ]);
  });

  it('never breaks a page when the table is missing', async () => {
    await db.exec('DROP TABLE funnel_counts');
    await expect(countEvent(db, 'purchase', 'none')).resolves.toBeUndefined();
    await expect(countPageView(db, 'pricing_view', 'none', headers({ 'user-agent': CHROME }))).resolves.toBeUndefined();
    const report = await funnelReport(db, { hubSlug: 'bocconi-online-test', examKeys: ['bocconi-undergraduate'], from: '2026-01-01', to: '2026-12-31' });
    expect(report.landingTotal).toBe(0);
  });
});

describe('the funnel report', () => {
  it('adds the counts and reads free tests from the sessions themselves', async () => {
    const config = requireExamConfig('bocconi-undergraduate');
    await seedQuestions(db, config, { perDomain: 6 });
    const today = new Date().toISOString().slice(0, 10);

    await countEvent(db, 'landing_view', 'bocconi-online-test', 'search');
    await countEvent(db, 'landing_view', 'bocconi-online-test', 'ai');
    await countEvent(db, 'pricing_view', 'bocconi-undergraduate');
    await countEvent(db, 'checkout_start', 'bocconi-undergraduate');
    await countEvent(db, 'purchase', 'bocconi-undergraduate');
    await countEvent(db, 'landing_view', 'gmat', 'search'); // another exam: not counted

    // Two accounts take the free test; one finishes it.
    const [ana, ben] = [await createUser(db), await createUser(db)];
    const first = await startAttempt(db, { userId: ana, examKey: config.examKey, blueprintId: 'diagnostic', freeTest: true });
    await startAttempt(db, { userId: ben, examKey: config.examKey, blueprintId: 'diagnostic', freeTest: true });
    await recordResponse(db, { attemptId: first.attemptId, userId: ana, partIndex: 0, position: 0, response: { type: 'single_select', optionId: 'a' } });
    await submitAttempt(db, { attemptId: first.attemptId, userId: ana });
    // An ordinary session is not a free test.
    await startAttempt(db, { userId: ana, examKey: config.examKey, blueprintId: 'practice' });

    const report = await funnelReport(db, {
      hubSlug: 'bocconi-online-test',
      examKeys: ['bocconi-undergraduate', 'bocconi-law'],
      from: today,
      to: today,
    });
    expect(report).toMatchObject({
      landingTotal: 2,
      pricingViews: 1,
      checkoutStarts: 1,
      purchases: 1,
      freeTestStarts: 2,
      freeTestCompletions: 1,
    });
    expect(report.landingViews).toMatchObject({ search: 1, ai: 1 });
  });
});

describe('purchases', () => {
  it('counts a subscription’s first activation, not renewals or recoveries', () => {
    expect(isNewPurchase(null, { id: 'sub_1', status: 'active' })).toBe(true);
    expect(isNewPurchase({ stripe_subscription_id: null, status: null }, { id: 'sub_1', status: 'active' })).toBe(true);
    expect(isNewPurchase({ stripe_subscription_id: 'sub_1', status: 'incomplete' }, { id: 'sub_1', status: 'active' })).toBe(true);
    expect(isNewPurchase({ stripe_subscription_id: 'sub_1', status: 'active' }, { id: 'sub_1', status: 'active' })).toBe(false);
    expect(isNewPurchase({ stripe_subscription_id: 'sub_1', status: 'past_due' }, { id: 'sub_1', status: 'active' })).toBe(false);
    expect(isNewPurchase(null, { id: 'sub_1', status: 'incomplete' })).toBe(false);
    expect(isNewPurchase({ stripe_subscription_id: 'sub_0', status: 'canceled' }, { id: 'sub_2', status: 'active' })).toBe(true);
  });

  it('counts a purchase once per subscription, under the exam it was bought from', async () => {
    const user = await createUser(db);
    const sub = {
      id: 'sub_1',
      status: 'active',
      created: 1_700_000_000,
      metadata: { examer_user_id: user, plan: 'quarterly', exam_key: 'bocconi-undergraduate' },
      items: { data: [{ current_period_end: Math.floor(Date.now() / 1000) + 86400 * 90, price: { lookup_key: PLANS.quarterly.lookupKey } }] },
    };
    const stripe: StripeRequest = async () => ({ data: [sub] });
    await syncCustomer(db, user, 'cus_1', stripe);
    await syncCustomer(db, user, 'cus_1', stripe); // the webhook arriving after the return from Checkout
    expect(await totals()).toEqual([
      expect.objectContaining({ event: 'purchase', subject: 'bocconi-undergraduate', count: 1 }),
    ]);
  });
});

describe('checkout keeps the exam', () => {
  const ON = billingSettings({ STRIPE_SECRET_KEY: 'sk_test_unit', STRIPE_WEBHOOK_SECRET: 'whsec_unit' });

  function fake() {
    const calls: Array<{ method: string; path: string; params: Record<string, unknown> }> = [];
    const stripe: StripeRequest = async (method, path, params = {}) => {
      calls.push({ method, path, params });
      if (method === 'GET' && path === 'subscriptions') return { data: [] };
      if (method === 'GET' && path === 'prices') return { data: [{ id: 'price_q' }] };
      if (method === 'POST' && path === 'customers') return { id: 'cus_new' };
      if (method === 'POST' && path === 'checkout/sessions') return { id: 'cs_test_1', url: 'https://checkout.stripe.test/cs_test_1' };
      throw new Error(`unexpected Stripe call ${method} ${path}`);
    };
    return { stripe, calls };
  }

  it('passes a known exam as metadata and on both return addresses, without touching the price', async () => {
    const user = await createUser(db);
    const { stripe, calls } = fake();
    await startCheckout(db, { id: user, email: 'b@example.invalid', displayName: null, isGuest: false }, 'quarterly', { settings: ON, stripe }, { examKey: 'bocconi-law' });
    const session = calls.find((c) => c.path === 'checkout/sessions')!.params;
    expect(session.metadata).toMatchObject({ plan: 'quarterly', exam_key: 'bocconi-law' });
    expect(session.subscription_data).toMatchObject({ metadata: { exam_key: 'bocconi-law' } });
    expect(String(session.success_url)).toMatch(/\/premium\/welcome\?session_id=\{CHECKOUT_SESSION_ID\}&exam=bocconi-law$/);
    expect(String(session.cancel_url)).toMatch(/\/premium\?checkout=cancelled&exam=bocconi-law$/);
    expect(session.line_items).toEqual([{ price: 'price_q', quantity: 1 }]);
  });

  it('ignores an exam it does not know', async () => {
    const user = await createUser(db);
    const { stripe, calls } = fake();
    await startCheckout(db, { id: user, email: 'c@example.invalid', displayName: null, isGuest: false }, 'monthly', { settings: ON, stripe }, { examKey: 'https://evil.example' });
    const session = calls.find((c) => c.path === 'checkout/sessions')!.params;
    expect(session.metadata).not.toHaveProperty('exam_key');
    expect(String(session.success_url)).not.toContain('exam=');
  });
});
