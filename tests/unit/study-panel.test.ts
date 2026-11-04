import { beforeEach, describe, expect, it } from 'vitest';
import { createTranslator } from 'next-intl';
import type { Db } from '@/lib/db';
import { recordResponse, startAttempt, submitAttempt, visitPosition } from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { setExamTarget } from '@/lib/learning/queries';
import { createPlan } from '@/lib/learning/plan';
import { COVERAGE_MIN_ANSWERS } from '@/lib/learning/readiness';
import { MIN_ATTEMPTS_FOR_SIGNAL, WEAK_ACCURACY } from '@/lib/learning/recommend';
import type { Translate } from '@/lib/learning/text';
import {
  ACTIVITY_DAYS,
  MAX_PANEL_EXAMS,
  MAX_WEAK_SPOTS,
  STREAK_LOOKBACK_DAYS,
  buildStudyPanel,
  daysUntil,
  localDay,
  parseOffset,
  renderStudyPanel,
  summariseActivity,
} from '@/lib/learning/study-panel';
import { ON } from './helpers/fake-stripe';
import { english, messagesFor } from './helpers/intl';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * The site's "Study plan" side panel: which exams count as current, the
 * progress and weak spots it digests from the readiness and recommendation
 * modules, the next session, review counts, and this week's activity, all for
 * one learner only.
 */

const SAT = requireExamConfig('digital-sat');
const GMAT = requireExamConfig('gmat');
const DAY = 24 * 60 * 60 * 1000;

let db: Db;
let alice: string;
let bob: string;

beforeEach(async () => {
  db = await createTestDb();
  alice = await createUser(db);
  bob = await createUser(db);
});

const learner = (id: string, targetExamKey: string | null = null) => ({ id, targetExamKey });

/** A finished practice session with every answer wrong (seeded keys are "a"). */
async function finishSession(userId: string, examKey: string, now = new Date()) {
  const { attemptId } = await startAttempt(db, { userId, examKey, blueprintId: 'practice', now });
  const items = (await db.prepare('SELECT position FROM attempt_items WHERE attempt_id = ?').all(attemptId)) as Array<{ position: number }>;
  for (const { position } of items) {
    await recordResponse(db, { attemptId, userId, partIndex: 0, position, response: { type: 'single_select', optionId: 'b' }, now });
  }
  await submitAttempt(db, { attemptId, userId, now });
  return attemptId;
}

describe('the exams a learner is working on', () => {
  it('is empty for a new account, with nothing to resume or do next', async () => {
    const panel = await buildStudyPanel(db, learner(alice));
    expect(panel).toMatchObject({ resume: null, next: null, exams: [], weakSpots: [], mistakeLabels: [], review: { dueNow: 0, nextDueAt: null } });
    expect(panel.activity.days).toHaveLength(ACTIVITY_DAYS);
    expect(panel.activity).toMatchObject({ answeredThisWeek: 0, streak: 0 });
  });

  it('lists an exam practised recently, with its progress from the readiness module', async () => {
    await seedQuestions(db, SAT, { perDomain: 6 });
    await finishSession(alice, SAT.examKey);
    const [exam] = (await buildStudyPanel(db, learner(alice))).exams;
    expect(exam).toMatchObject({
      examKey: SAT.examKey,
      reasons: ['recent'],
      href: '/dashboard?exam=digital-sat',
      scored: 10,
      correct: 0,
      // Ten answers are too few for a share correct to mean anything.
      accuracy: null,
      answersToSignal: 15,
      band: 'insufficient',
      topicCount: SAT.domains.length,
      plan: null,
      examDate: null,
    });
    expect(exam.topicsCovered).toBeGreaterThan(0);
  });

  it('leaves out an exam last practised over a month ago, unless the learner holds a plan, pass or goal for it', async () => {
    await seedQuestions(db, SAT, { perDomain: 6 });
    await finishSession(alice, SAT.examKey, new Date(Date.now() - 40 * DAY));
    expect((await buildStudyPanel(db, learner(alice))).exams).toEqual([]);
    expect((await buildStudyPanel(db, learner(alice, SAT.examKey))).exams.map((e) => [e.examKey, e.reasons])).toEqual([[SAT.examKey, ['target']]]);
  });

  it('counts a live one-exam pass, and an active study plan', async () => {
    await seedQuestions(db, GMAT, { perDomain: 6 });
    await seedQuestions(db, SAT, { perDomain: 6 });
    const now = new Date();
    await db
      .prepare(
        `INSERT INTO access_grants (id, user_id, plan, exam_key, starts_at, ends_at, reason, granted_by, created_at)
         VALUES ('g1', ?, 'exam_pass', ?, ?, ?, 'test', 'admin', ?)`,
      )
      .run(alice, GMAT.examKey, now.toISOString(), new Date(now.getTime() + 30 * DAY).toISOString(), now.toISOString());
    await createPlan(db, { userId: alice, examKey: SAT.examKey, weeklyMinutes: 150, examDate: null, now });

    const panel = await buildStudyPanel(db, learner(alice), { billing: { settings: ON } });
    expect(Object.fromEntries(panel.exams.map((e) => [e.examKey, e.reasons]))).toEqual({ [GMAT.examKey]: ['pass'], [SAT.examKey]: ['plan'] });
    const plan = panel.exams.find((e) => e.examKey === SAT.examKey)!.plan!;
    expect(plan.done).toBe(0);
    expect(plan.total).toBeGreaterThan(0);
    // The plan's first session is the next one, opened from the plan page.
    expect(panel.next).toMatchObject({ source: 'plan', href: '/study-plan?exam=digital-sat' });
  });

  it('puts the exam with an unfinished session first, and offers to resume it', async () => {
    await seedQuestions(db, SAT, { perDomain: 6 });
    await seedQuestions(db, GMAT, { perDomain: 6 });
    await finishSession(alice, SAT.examKey);
    const { attemptId } = await startAttempt(db, { userId: alice, examKey: GMAT.examKey, blueprintId: 'practice' });
    await visitPosition(db, { attemptId, userId: alice, partIndex: 0, position: 3 });

    const panel = await buildStudyPanel(db, learner(alice));
    expect(panel.resume).toEqual({ href: `/attempt/${attemptId}`, examLabel: 'GMAT', question: 4, questionCount: 10, others: 0 });
    expect(panel.exams.map((e) => e.examKey)).toEqual([GMAT.examKey, SAT.examKey]);
    expect(panel.exams[0].reasons).toEqual(['unfinished']);
    // The next session follows the dashboard's choice (the latest finished practice), not the
    // unfinished session, which has its own card.
    expect(panel.next).toMatchObject({ source: 'recommendation', examLabel: 'SAT' });
  });

  it(`lists at most ${MAX_PANEL_EXAMS} exams`, async () => {
    const keys = ['digital-sat', 'gmat', 'lsat', 'gre', 'enhanced-act'];
    for (const key of keys) await setExamTarget(db, alice, key, null, null);
    const panel = await buildStudyPanel(db, learner(alice, 'digital-sat'));
    expect(panel.exams).toHaveLength(MAX_PANEL_EXAMS);
    expect(panel.exams.every((exam) => exam.reasons.includes('target'))).toBe(true);
  });

  it("never shows another learner's practice", async () => {
    await seedQuestions(db, SAT, { perDomain: 6 });
    await finishSession(bob, SAT.examKey);
    await startAttempt(db, { userId: bob, examKey: SAT.examKey, blueprintId: 'practice' });
    const panel = await buildStudyPanel(db, learner(alice));
    expect(panel).toMatchObject({ resume: null, exams: [], weakSpots: [], review: { dueNow: 0, nextDueAt: null } });
    expect(panel.activity.answeredThisWeek).toBe(0);
  });
});

describe('weak spots, review and the next session', () => {
  it('names skills and topics with enough answers and too few right, worst first, and says when misses come back', async () => {
    await seedQuestions(db, SAT, { perDomain: 6 });
    for (let i = 0; i < 3; i += 1) await finishSession(alice, SAT.examKey);
    const panel = await buildStudyPanel(db, learner(alice));

    expect(panel.weakSpots.length).toBeGreaterThan(0);
    expect(panel.weakSpots.length).toBeLessThanOrEqual(MAX_WEAK_SPOTS);
    for (const spot of panel.weakSpots) {
      expect(spot.scored).toBeGreaterThanOrEqual(MIN_ATTEMPTS_FOR_SIGNAL);
      expect(spot.accuracy).toBeLessThan(WEAK_ACCURACY);
      expect(spot.href).toMatch(/^\/practice\/digital-sat\?(skill|domain)=/);
      expect(spot.examLabel).toBe('SAT');
    }
    expect(panel.weakRule).toEqual({ minAnswers: MIN_ATTEMPTS_FOR_SIGNAL, below: WEAK_ACCURACY });

    // A missed question comes back the next day: nothing is due yet, but something is coming.
    expect(panel.review.dueNow).toBe(0);
    expect(panel.review.nextDueAt).not.toBeNull();
    const later = await buildStudyPanel(db, learner(alice), { now: new Date(Date.now() + 2 * DAY) });
    expect(later.review.dueNow).toBeGreaterThan(0);
    expect(later.exams[0].dueReview).toBe(later.review.dueNow);
    // With misses due, the dashboard's first step is to review them.
    expect(later.next).toMatchObject({ source: 'recommendation', href: '/review', title: { key: 'steps.dueReview.title' } });
  });

  it("starts a goal-only exam with the dashboard's first step", async () => {
    await seedQuestions(db, SAT, { perDomain: 6 });
    const panel = await buildStudyPanel(db, learner(alice, SAT.examKey));
    expect(panel.next).toMatchObject({ source: 'recommendation', examLabel: 'SAT', href: '/practice/digital-sat', title: { key: 'steps.getStarted.title' } });
    expect(english(panel.next!.title)).toBeTruthy();
  });

  it('counts down to the learner’s own exam date only', async () => {
    await setExamTarget(db, alice, SAT.examKey, null, '2026-12-01');
    const panel = await buildStudyPanel(db, learner(alice, SAT.examKey), { now: new Date('2026-11-04T10:00:00Z') });
    expect(panel.exams[0]).toMatchObject({ examDate: '2026-12-01', daysToExam: 27 });
  });

  it('topics count as weak on the same evidence as skills', () => {
    expect(COVERAGE_MIN_ANSWERS).toBe(MIN_ATTEMPTS_FOR_SIGNAL);
  });
});

describe('rendering for the browser', () => {
  it('turns every message into the reader’s language and names the mistake labels', async () => {
    await seedQuestions(db, SAT, { perDomain: 6 });
    const attemptId = await finishSession(alice, SAT.examKey);
    const item = (await db.prepare('SELECT id FROM attempt_items WHERE attempt_id = ? LIMIT 1').get(attemptId)) as { id: string };
    await db.prepare("INSERT INTO mistake_labels (attempt_item_id, user_id, label, created_at) VALUES (?, ?, 'misread', ?)").run(item.id, alice, new Date().toISOString());

    const messages = messagesFor('it');
    const t = (namespace: 'learning' | 'results') => createTranslator({ locale: 'it', messages, namespace }) as unknown as Translate;
    const panel = renderStudyPanel(await buildStudyPanel(db, learner(alice)), { learning: t('learning'), results: t('results') });

    expect(panel.exams[0].bandLabel).toBe((messages.learning as { readiness: { band: Record<string, string> } }).readiness.band.insufficient);
    expect(panel.mistakeLabels).toEqual([{ key: 'misread', count: 1, text: (messages.results as { mistakeLabels: Record<string, string> }).mistakeLabels.misread }]);
    expect(typeof panel.next?.title).toBe('string');
    // No message descriptor ({ key: 'steps.…' }) is left for the browser to translate.
    expect(JSON.stringify(panel)).not.toMatch(/"key":"[^"]*\./);
  });
});

describe('days in the reader’s zone', () => {
  const now = new Date('2026-11-04T23:30:00Z');

  it('reads the browser’s offset, refusing anything that is not one', () => {
    expect(parseOffset('-60')).toBe(-60);
    expect(parseOffset('330')).toBe(330);
    expect(parseOffset('9999')).toBe(0);
    expect(parseOffset('1e3')).toBe(0);
    expect(parseOffset(null)).toBe(0);
  });

  it('puts an instant on the reader’s calendar day', () => {
    expect(localDay(now, 0)).toBe('2026-11-04');
    // Rome in winter is UTC+1, which getTimezoneOffset() gives as -60.
    expect(localDay(now, -60)).toBe('2026-11-05');
    expect(localDay(now, 300)).toBe('2026-11-04');
  });

  it('counts answers per day and a streak that today has not broken yet', () => {
    const at = (day: string, hour = 12) => `${day}T${String(hour).padStart(2, '0')}:00:00.000Z`;
    const activity = summariseActivity([at('2026-11-01'), at('2026-11-02'), at('2026-11-03'), at('2026-11-03', 8), at('2026-10-20')], now, 0);
    expect(activity.days.map((d) => d.day)).toEqual(['2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04']);
    expect(activity.days.map((d) => d.answered)).toEqual([0, 0, 0, 1, 1, 2, 0]);
    expect(activity).toMatchObject({ answeredThisWeek: 4, streak: 3, streakAtLeast: false });

    // A gap of a day ends it.
    expect(summariseActivity([at('2026-11-02')], now, 0).streak).toBe(0);
  });

  it('caps a long streak at the lookback and says so', () => {
    const days = Array.from({ length: STREAK_LOOKBACK_DAYS + 5 }, (_, i) => new Date(now.getTime() - i * DAY).toISOString());
    expect(summariseActivity(days, now, 0)).toMatchObject({ streak: STREAK_LOOKBACK_DAYS, streakAtLeast: true });
  });

  it('counts whole days to an exam date, and nothing once it has passed', () => {
    expect(daysUntil('2026-11-04', now, 0)).toBe(0);
    expect(daysUntil('2026-11-05', now, 0)).toBe(1);
    // Already the 5th in Rome.
    expect(daysUntil('2026-11-05', now, -60)).toBe(0);
    expect(daysUntil('2026-11-03', now, 0)).toBeNull();
    expect(daysUntil('not a date', now, 0)).toBeNull();
  });
});
