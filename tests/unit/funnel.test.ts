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
import { createSubscription } from '@/lib/billing/service';
import { storeSubscription } from '@/lib/billing/store';
import { ON, fakeStripe, nowSeconds, stripeSubscription } from './helpers/fake-stripe';
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
  const totals = async () =>
    db.prepare("SELECT event, subject, count FROM funnel_counts WHERE event IN ('purchase', 'checkout_start') ORDER BY event").all();

  it('counts a subscription’s first activation once, not renewals or recoveries', async () => {
    const user = await createUser(db);
    const at = nowSeconds();
    const sub = (status: 'incomplete' | 'active' | 'past_due') =>
      stripeSubscription({ userId: user, plan: 'single_exam', examKey: 'bocconi-undergraduate', status });
    await storeSubscription(db, user, sub('incomplete'), { syncedAt: at });
    await storeSubscription(db, user, sub('active'), { syncedAt: at + 1 });
    // The webhook arriving after the confirmation page already synced it.
    await storeSubscription(db, user, sub('active'), { syncedAt: at + 2 });
    await storeSubscription(db, user, sub('past_due'), { syncedAt: at + 3 });
    await storeSubscription(db, user, sub('active'), { syncedAt: at + 4 });
    expect(await totals()).toEqual([expect.objectContaining({ event: 'purchase', subject: 'bocconi-undergraduate', count: 1 })]);
  });

  it('counts an All access purchase under the exam it was bought from', async () => {
    const user = await createUser(db);
    const subscription = stripeSubscription({ userId: user, plan: 'all_access' });
    subscription.metadata = { ...subscription.metadata, source_exam: 'bocconi-law' };
    await storeSubscription(db, user, subscription, { syncedAt: nowSeconds() });
    expect(await totals()).toEqual([expect.objectContaining({ event: 'purchase', subject: 'bocconi-law', count: 1 })]);
  });
});

describe('checkout keeps the exam', () => {
  const buyer = async () => {
    const id = await createUser(db);
    return { id, email: `${id}@example.invalid`, displayName: null, isGuest: false };
  };

  it('counts a checkout start under the exam, and passes it as metadata without touching the price', async () => {
    const fake = fakeStripe();
    await createSubscription(db, await buyer(), { plan: 'all_access', sourceExam: 'bocconi-law', consent: true, requestId: 'req-00000001' }, { settings: ON, stripe: fake.api });
    const params = fake.called('subscriptions.create')[0]!.args[0] as { metadata: Record<string, string>; items: unknown };
    expect(params.metadata).toMatchObject({ plan: 'all_access', source_exam: 'bocconi-law' });
    expect(params.items).toEqual([{ price: 'price_all', quantity: 1 }]);
    expect(await totals()).toEqual([expect.objectContaining({ event: 'checkout_start', subject: 'bocconi-law', count: 1 })]);
  });

  it('ignores an exam it does not know', async () => {
    const fake = fakeStripe();
    await createSubscription(db, await buyer(), { plan: 'all_access', sourceExam: 'https://evil.example', consent: true, requestId: 'req-00000002' }, { settings: ON, stripe: fake.api });
    const params = fake.called('subscriptions.create')[0]!.args[0] as { metadata: Record<string, string> };
    expect(params.metadata).not.toHaveProperty('source_exam');
    expect(params.metadata).not.toHaveProperty('exam_key');
    expect(await totals()).toEqual([expect.objectContaining({ event: 'checkout_start', subject: 'none', count: 1 })]);
  });

  const totals = async () => db.prepare("SELECT event, subject, count FROM funnel_counts WHERE event = 'checkout_start'").all();
});
