import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Db } from '@/lib/db';
import { AttemptError, recordResponse, startAttempt, startRetry, submitAttempt } from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import {
  EntitlementError,
  decideAccess,
  grantIsLive,
  loadEntitlements,
  requireEntitlement,
  type Grant,
  type Subject,
} from '@/lib/billing/entitlements';
import { BillingConfigError } from '@/lib/billing/config';
import { questionHelp, TutorError } from '@/lib/tutor/service';
import type { TutorModelClient } from '@/lib/tutor/client';
import { BILLING_ENV, ON, fakeStripe, stripeSubscription } from './helpers/fake-stripe';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * Who may use what. The pure decision is tested case by case; then the same
 * rule is checked where it is enforced: starting sessions, retries, the AI
 * tutor and the study plan.
 */

const SAT = requireExamConfig('digital-sat');
const GMAT = requireExamConfig('gmat');
const NOW = new Date('2026-10-27T12:00:00Z');
const inDays = (days: number) => new Date(NOW.getTime() + days * 86_400_000).toISOString();

const grant = (overrides: Partial<Grant> = {}): Grant => ({
  subscriptionId: 'sub_1',
  plan: 'all_access',
  examKey: null,
  status: 'active',
  currentPeriodEnd: inDays(20),
  cancelAtPeriodEnd: false,
  ...overrides,
});
const learner = (grants: Grant[] = [], isGuest = false): Subject => ({ role: 'learner', isGuest, grants });
const decide = (subject: Subject | null, feature: Parameters<typeof decideAccess>[0]['feature'], examKey: string | null = SAT.examKey, enforced = true) =>
  decideAccess({ enforced, subject, feature, examKey, now: NOW });

describe('decisions', () => {
  it('opens everything while billing is not enforced', () => {
    for (const feature of ['practice', 'simulation', 'study_plan', 'ai_tutor'] as const) {
      expect(decide(null, feature, SAT.examKey, false)).toMatchObject({ allowed: true, reason: 'billing-off' });
    }
  });

  it('free account: the diagnostic yes, everything paid no, with the pricing page for that exam', () => {
    const subject = learner();
    expect(decide(subject, 'diagnostic')).toMatchObject({ allowed: true, reason: 'free' });
    for (const feature of ['practice', 'timed_section', 'simulation', 'study_plan', 'ai_tutor'] as const) {
      const decision = decide(subject, feature);
      expect(decision.allowed).toBe(false);
      expect(decision.reason).toBe('upgrade-required');
      expect(decision.upgradeHref).toBe(`/pricing?exam=digital-sat&reason=${feature}`);
    }
  });

  it('guests and visitors are asked for an account before the diagnostic', () => {
    expect(decide(learner([], true), 'diagnostic')).toMatchObject({ allowed: false, reason: 'account-required' });
    expect(decide(null, 'diagnostic')).toMatchObject({ allowed: false, reason: 'account-required' });
    expect(decide(learner([], true), 'practice')).toMatchObject({ allowed: false, reason: 'upgrade-required' });
  });

  it('All access opens every exam and the AI tutor', () => {
    const subject = learner([grant()]);
    for (const exam of [SAT.examKey, GMAT.examKey]) {
      for (const feature of ['practice', 'timed_section', 'simulation', 'study_plan', 'ai_tutor'] as const) {
        expect(decide(subject, feature, exam)).toMatchObject({ allowed: true, reason: 'subscription' });
      }
    }
  });

  it('Single exam opens its own exam only, and never the AI tutor', () => {
    const subject = learner([grant({ plan: 'single_exam', examKey: SAT.examKey })]);
    expect(decide(subject, 'practice', SAT.examKey).allowed).toBe(true);
    expect(decide(subject, 'simulation', SAT.examKey).allowed).toBe(true);
    expect(decide(subject, 'study_plan', SAT.examKey).allowed).toBe(true);
    expect(decide(subject, 'practice', GMAT.examKey).allowed).toBe(false);
    expect(decide(subject, 'ai_tutor', SAT.examKey)).toMatchObject({ allowed: false, suggestedPlan: 'all_access' });
  });

  it('several single-exam plans add up', () => {
    const subject = learner([
      grant({ subscriptionId: 'sub_a', plan: 'single_exam', examKey: SAT.examKey }),
      grant({ subscriptionId: 'sub_b', plan: 'single_exam', examKey: GMAT.examKey }),
    ]);
    expect(decide(subject, 'practice', SAT.examKey).allowed).toBe(true);
    expect(decide(subject, 'practice', GMAT.examKey).allowed).toBe(true);
    expect(decide(subject, 'practice', 'lsat').allowed).toBe(false);
  });

  it('expired: a cancelled plan, or an active one long past its period, opens nothing', () => {
    expect(decide(learner([grant({ status: 'canceled', currentPeriodEnd: inDays(10) })]), 'practice').allowed).toBe(false);
    expect(decide(learner([grant({ status: 'incomplete_expired' })]), 'practice').allowed).toBe(false);
    expect(decide(learner([grant({ status: 'unpaid' })]), 'practice').allowed).toBe(false);
    expect(decide(learner([grant({ status: 'incomplete' })]), 'practice').allowed).toBe(false);
    expect(decide(learner([grant({ currentPeriodEnd: inDays(-3) })]), 'practice').allowed).toBe(false);
  });

  it('a late renewal webhook does not lock a paying learner out at once', () => {
    expect(grantIsLive(grant({ currentPeriodEnd: inDays(-1) }), NOW)).toBe(true);
    expect(grantIsLive(grant({ currentPeriodEnd: inDays(-2.1) }), NOW)).toBe(false);
  });

  it('past_due keeps access until the period end, then stops', () => {
    expect(decide(learner([grant({ status: 'past_due', currentPeriodEnd: inDays(5) })]), 'practice').allowed).toBe(true);
    expect(decide(learner([grant({ status: 'past_due', currentPeriodEnd: inDays(-0.1) })]), 'practice').allowed).toBe(false);
    expect(decide(learner([grant({ status: 'past_due', currentPeriodEnd: null })]), 'practice').allowed).toBe(false);
  });

  it('a plan cancelled at period end keeps access until then', () => {
    expect(decide(learner([grant({ cancelAtPeriodEnd: true, currentPeriodEnd: inDays(3) })]), 'practice').allowed).toBe(true);
  });

  it('editors and administrators bypass every gate', () => {
    for (const role of ['admin', 'editor'] as const) {
      const subject: Subject = { role, isGuest: false, grants: [] };
      for (const feature of ['practice', 'simulation', 'study_plan', 'ai_tutor'] as const) {
        expect(decide(subject, feature)).toMatchObject({ allowed: true, reason: 'staff' });
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Against the database and the places the rule is enforced
// ---------------------------------------------------------------------------

let db: Db;

async function giveSubscription(userId: string, options: { plan?: 'all_access' | 'single_exam'; examKey?: string; status?: string; periodEnd?: string }) {
  const at = new Date().toISOString();
  const id = `sub_${Math.random().toString(36).slice(2, 10)}`;
  await db.prepare('INSERT INTO billing_customers (user_id, stripe_customer_id, created_at, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT (user_id) DO NOTHING')
    .run(userId, `cus_${userId.slice(0, 8)}`, at, at);
  await db
    .prepare(
      `INSERT INTO billing_subscriptions (stripe_subscription_id, user_id, stripe_customer_id, plan, exam_key, status,
         price_lookup_key, current_period_end, cancel_at_period_end, withdrawal_waiver_at, stripe_synced_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NULL, ?, 0, NULL, 0, ?, ?)`,
    )
    .run(id, userId, `cus_${userId.slice(0, 8)}`, options.plan ?? 'all_access', options.examKey ?? null, options.status ?? 'active',
      options.periodEnd ?? new Date(Date.now() + 20 * 86_400_000).toISOString(), at, at);
  return id;
}

async function refusal(promise: Promise<unknown>): Promise<AttemptError> {
  const error = await promise.then(() => null, (e: unknown) => e);
  expect(error).toBeInstanceOf(AttemptError);
  return error as AttemptError;
}

beforeEach(async () => {
  db = await createTestDb();
  await seedQuestions(db, SAT, { perDomain: 8 });
  await seedQuestions(db, GMAT, { perDomain: 8 });
  for (const [name, value] of Object.entries(BILLING_ENV)) vi.stubEnv(name, value);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('starting sessions', () => {
  it('refuses paid formats to a free account with 402 and the way to the plans', async () => {
    const user = await createUser(db);
    const error = await refusal(startAttempt(db, { userId: user, examKey: SAT.examKey, blueprintId: 'practice' }));
    expect(error).toMatchObject({ code: 'upgrade-required', status: 402 });
    expect(error.detail).toMatchObject({ feature: 'practice', examKey: SAT.examKey, upgradeHref: '/pricing?exam=digital-sat&reason=practice' });
    expect(await refusal(startAttempt(db, { userId: user, examKey: SAT.examKey, blueprintId: 'timed-math-module-1' }))).toMatchObject({
      code: 'upgrade-required',
      detail: expect.objectContaining({ feature: 'timed_section' }),
    });
  });

  it('opens the free diagnostic for every exam, once each', async () => {
    const user = await createUser(db);
    const sat = await startAttempt(db, { userId: user, examKey: SAT.examKey, blueprintId: 'diagnostic', freeTest: true });
    const gmat = await startAttempt(db, { userId: user, examKey: GMAT.examKey, blueprintId: 'diagnostic', freeTest: true });
    expect(sat.attemptId).not.toBe(gmat.attemptId);
  });

  it('keeps the diagnostic for accounts, and a freshly drawn diagnostic for plans', async () => {
    const guest = await createUser(db, { isGuest: true });
    expect(await refusal(startAttempt(db, { userId: guest, examKey: SAT.examKey, blueprintId: 'diagnostic', freeTest: true }))).toMatchObject({
      code: 'account-required',
      status: 403,
    });
    const user = await createUser(db);
    expect((await refusal(startAttempt(db, { userId: user, examKey: SAT.examKey, blueprintId: 'diagnostic' }))).code).toBe('upgrade-required');
  });

  it('opens one exam for a single-exam plan and every exam for All access', async () => {
    const single = await createUser(db);
    await giveSubscription(single, { plan: 'single_exam', examKey: SAT.examKey });
    await expect(startAttempt(db, { userId: single, examKey: SAT.examKey, blueprintId: 'practice' })).resolves.toHaveProperty('attemptId');
    expect((await refusal(startAttempt(db, { userId: single, examKey: GMAT.examKey, blueprintId: 'practice' }))).code).toBe('upgrade-required');

    const all = await createUser(db);
    await giveSubscription(all, { plan: 'all_access' });
    await expect(startAttempt(db, { userId: all, examKey: GMAT.examKey, blueprintId: 'practice' })).resolves.toHaveProperty('attemptId');
  });

  it('closes again when the plan has expired, and stays open while a renewal is retried', async () => {
    const expired = await createUser(db);
    await giveSubscription(expired, { status: 'canceled' });
    expect((await refusal(startAttempt(db, { userId: expired, examKey: SAT.examKey, blueprintId: 'practice' }))).code).toBe('upgrade-required');

    const retrying = await createUser(db);
    await giveSubscription(retrying, { status: 'past_due' });
    await expect(startAttempt(db, { userId: retrying, examKey: SAT.examKey, blueprintId: 'practice' })).resolves.toHaveProperty('attemptId');
  });

  it('lets editors and administrators start anything without a plan', async () => {
    for (const role of ['admin', 'editor'] as const) {
      const staff = await createUser(db, { role });
      await expect(startAttempt(db, { userId: staff, examKey: SAT.examKey, blueprintId: 'practice' })).resolves.toHaveProperty('attemptId');
    }
  });

  it('keeps retries of missed questions for plans', async () => {
    const user = await createUser(db);
    expect((await refusal(startRetry(db, { userId: user, examKey: SAT.examKey, questionIds: ['x'] }))).code).toBe('upgrade-required');
  });

  it('starts anything for anyone when billing is not enforced', async () => {
    vi.stubEnv('BILLING_ENFORCED', 'false');
    const user = await createUser(db);
    await expect(startAttempt(db, { userId: user, examKey: SAT.examKey, blueprintId: 'practice' })).resolves.toHaveProperty('attemptId');
  });

  it('fails loudly, never openly, when enforced without its keys', async () => {
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', '');
    const user = await createUser(db);
    await expect(startAttempt(db, { userId: user, examKey: SAT.examKey, blueprintId: 'practice' })).rejects.toBeInstanceOf(BillingConfigError);
  });
});

describe('the AI tutor', () => {
  const model: TutorModelClient = {
    async complete() {
      return { ok: true as const, text: 'Think about the units.', model: 'fake', inputTokens: 1, outputTokens: 1, truncated: false };
    },
  };

  async function finishedSession(userId: string) {
    vi.stubEnv('BILLING_ENFORCED', 'false');
    const { attemptId } = await startAttempt(db, { userId, examKey: SAT.examKey, blueprintId: 'practice' });
    await recordResponse(db, { attemptId, userId, partIndex: 0, position: 0, response: { type: 'single_select', optionId: 'a' } });
    await submitAttempt(db, { attemptId, userId });
    vi.stubEnv('BILLING_ENFORCED', 'true');
    return attemptId;
  }

  it('is refused to a single-exam plan, with the upgrade in the error', async () => {
    const user = await createUser(db);
    await giveSubscription(user, { plan: 'single_exam', examKey: SAT.examKey });
    const attemptId = await finishedSession(user);
    const error = await questionHelp(db, { userId: user, isGuest: false }, { attemptId, partIndex: 0, position: 0, kind: 'explain' }, { client: model }).then(
      () => null,
      (e: unknown) => e,
    );
    expect(error).toBeInstanceOf(TutorError);
    expect(error).toMatchObject({ code: 'upgrade-required', status: 402, detail: { upgradeHref: '/pricing?exam=digital-sat&reason=ai_tutor' } });
  });

  it('answers an All access learner', async () => {
    const user = await createUser(db);
    await giveSubscription(user, { plan: 'all_access' });
    const attemptId = await finishedSession(user);
    const reply = await questionHelp(db, { userId: user, isGuest: false }, { attemptId, partIndex: 0, position: 0, kind: 'explain' }, { client: model });
    expect(reply.html).toContain('units');
  });
});

describe('loading entitlements', () => {
  it('reads every subscription once and answers per exam', async () => {
    const user = await createUser(db);
    await giveSubscription(user, { plan: 'single_exam', examKey: SAT.examKey });
    await giveSubscription(user, { plan: 'single_exam', examKey: GMAT.examKey, status: 'canceled' });
    const entitlements = await loadEntitlements(db, user, { settings: ON });
    expect(entitlements.singleExamKeys).toEqual([SAT.examKey]);
    expect(entitlements.hasAllAccess).toBe(false);
    expect(entitlements.can('study_plan', SAT.examKey)).toBe(true);
    expect(entitlements.can('study_plan', GMAT.examKey)).toBe(false);
    await expect(requireEntitlement(db, user, 'study_plan', GMAT.examKey, { settings: ON })).rejects.toBeInstanceOf(EntitlementError);
  });

  it('re-reads from Stripe a plan whose period ended without a renewal webhook', async () => {
    const user = await createUser(db);
    const id = await giveSubscription(user, { plan: 'all_access', periodEnd: new Date(Date.now() - 5 * 86_400_000).toISOString() });
    const fake = fakeStripe();
    fake.state.subscriptions.set(id, stripeSubscription({ id, customer: `cus_${user.slice(0, 8)}`, userId: user }));
    const entitlements = await loadEntitlements(db, user, { settings: ON, stripe: fake.api });
    expect(fake.called('subscriptions.retrieve')).toHaveLength(1);
    expect(entitlements.can('practice', SAT.examKey)).toBe(true);
  });
});
