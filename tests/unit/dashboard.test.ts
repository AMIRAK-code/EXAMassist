import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import { recordResponse, startAttempt, submitAttempt } from '@/lib/attempts/service';
import { practiceFacets } from '@/lib/attempts/availability';
import { eligibleCount } from '@/lib/attempts/facets';
import { requireExamConfig } from '@/lib/exams/registry';
import { SHORT_DRILL_BELOW, buildDashboard, chooseExam } from '@/lib/learning/dashboard';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * The dashboard's data (Phase 3): exam selection from the address, isolation
 * between learners, the next step and its basis, a short skill drill offered
 * with an explicit broader option, due and later review counts, and the
 * empty states.
 */

const SAT = requireExamConfig('digital-sat');
const GMAT = requireExamConfig('gmat');

let db: Db;
let alice: string;
let bob: string;

beforeEach(() => {
  db = createTestDb();
  alice = createUser(db);
  bob = createUser(db);
});

const learner = (id: string, extra: Partial<{ isGuest: boolean; targetExamKey: string | null; sessionExpiresAt: string }> = {}) => ({
  id,
  isGuest: false,
  targetExamKey: null,
  ...extra,
});

/** A finished practice session, every answer wrong (seeded keys are "a"). */
function finishSession(userId: string, examKey: string, overrides: Record<string, unknown> = {}, now = new Date()) {
  const { attemptId } = startAttempt(db, { userId, examKey, blueprintId: 'practice', overrides, now });
  const items = db.prepare('SELECT position FROM attempt_items WHERE attempt_id = ?').all(attemptId) as Array<{ position: number }>;
  for (const { position } of items) {
    recordResponse(db, { attemptId, userId, partIndex: 0, position, response: { type: 'single_select', optionId: 'b' }, now });
  }
  submitAttempt(db, { attemptId, userId, now });
  return attemptId;
}

describe('choosing the exam', () => {
  it('prefers the address, then the target, then the latest practice', () => {
    expect(chooseExam('gmat', 'lsat', 'digital-sat')).toEqual({ examKey: 'gmat', source: 'address', unknownExam: null });
    expect(chooseExam(undefined, 'lsat', 'digital-sat')).toEqual({ examKey: 'lsat', source: 'target', unknownExam: null });
    expect(chooseExam(undefined, null, 'digital-sat')).toEqual({ examKey: 'digital-sat', source: 'recent', unknownExam: null });
    expect(chooseExam(undefined, null, null)).toEqual({ examKey: null, source: null, unknownExam: null });
  });

  it('ignores an exam that is not offered, and says so', () => {
    expect(chooseExam('not-an-exam', null, 'gmat')).toEqual({ examKey: 'gmat', source: 'recent', unknownExam: 'not-an-exam' });
    expect(chooseExam('x'.repeat(500), null, null).unknownExam).toHaveLength(64);
  });

  it('treats an empty or repeated parameter gracefully', () => {
    expect(chooseExam('', null, 'gmat')).toEqual({ examKey: 'gmat', source: 'recent', unknownExam: null });
    expect(chooseExam('   ', null, null).unknownExam).toBeNull();
    expect(chooseExam(['gmat', 'lsat'], null, null).examKey).toBe('gmat');
  });
});

describe('what each learner sees', () => {
  it("shows only the learner's own history, whichever exam the address names", () => {
    seedQuestions(db, SAT, { perDomain: 6 });
    finishSession(alice, SAT.examKey);
    startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'practice' });

    const forBob = buildDashboard(db, learner(bob), 'digital-sat');
    expect(forBob.unfinished).toEqual([]);
    expect(forBob.exam).toMatchObject({ examKey: 'digital-sat', finishedCount: 0, totalScored: 0 });
    expect(forBob.exam!.review).toEqual({ dueNow: 0, comingLater: 0, nextDueAt: null });

    const forAlice = buildDashboard(db, learner(alice), undefined);
    expect(forAlice.exam).toMatchObject({ examKey: 'digital-sat', source: 'recent', finishedCount: 1, totalScored: 10 });
    expect(forAlice.unfinished).toHaveLength(1);
  });

  it('does not change the target when another exam is viewed', () => {
    seedQuestions(db, SAT, { perDomain: 6 });
    seedQuestions(db, GMAT, { perDomain: 6 });
    db.prepare("UPDATE users SET target_exam_key = 'digital-sat' WHERE id = ?").run(alice);
    const data = buildDashboard(db, learner(alice, { targetExamKey: 'digital-sat' }), 'gmat');
    expect(data.exam?.examKey).toBe('gmat');
    expect(data.choices.find((c) => c.examKey === 'digital-sat')).toMatchObject({ target: true, current: false });
    const row = db.prepare('SELECT target_exam_key AS t FROM users WHERE id = ?').get(alice) as { t: string };
    expect(row.t).toBe('digital-sat');
  });

  it('offers a choice when nothing has been practised and no target is set', () => {
    const data = buildDashboard(db, learner(alice), undefined);
    expect(data.exam).toBeNull();
    expect(data.choices).toEqual([]);
  });
});

describe('the next step', () => {
  it('keeps a short skill drill as it is and offers the whole topic explicitly', () => {
    seedQuestions(db, SAT, { perDomain: 6 });
    const facets = practiceFacets(db, SAT);
    // A skill the bank holds only a few questions for, in a topic that holds more.
    const domain = SAT.domains.find((d) => d.skills.length >= 2)!;
    const skill = domain.skills.find((s) => {
      const n = eligibleCount(facets, { skill: s.slug });
      return n > 0 && n < SHORT_DRILL_BELOW;
    })!;
    const inSkill = eligibleCount(facets, { skill: skill.slug });
    for (let answered = 0; answered < 4; answered += inSkill) {
      finishSession(alice, SAT.examKey, { skills: [skill.slug], length: inSkill });
    }

    const exam = buildDashboard(db, learner(alice), 'digital-sat').exam!;
    const drill = [exam.next!, ...exam.others].find((step) => step.kind === 'weak_skill' && step.skillSlug === skill.slug)!;
    expect(drill.href).toBe(`/practice/digital-sat?skill=${skill.slug}`);
    expect(drill.broader).toMatchObject({ href: `/practice/digital-sat?domain=${domain.slug}` });
    expect(drill.broader!.because).toContain(`${inSkill} reviewed question`);
  });

  it('puts the recommendation with the lowest priority number first', () => {
    seedQuestions(db, SAT, { perDomain: 6 });
    finishSession(alice, SAT.examKey);
    const exam = buildDashboard(db, learner(alice), 'digital-sat', new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)).exam!;
    // Misses from two days ago are due now, and due review outranks everything else.
    expect(exam.next?.kind).toBe('due_review');
    expect(exam.others.every((step) => step.priority >= exam.next!.priority)).toBe(true);
  });
});

describe('mistake-notebook counts', () => {
  it('separates questions due now from those coming back later', () => {
    seedQuestions(db, SAT, { perDomain: 6 });
    finishSession(alice, SAT.examKey);
    const today = buildDashboard(db, learner(alice), 'digital-sat').exam!.review;
    expect(today.dueNow).toBe(0);
    expect(today.comingLater).toBe(10);
    expect(today.nextDueAt).not.toBeNull();

    const later = buildDashboard(db, learner(alice), 'digital-sat', new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)).exam!.review;
    expect(later).toEqual({ dueNow: 10, comingLater: 0, nextDueAt: null });
  });
});

describe('topics', () => {
  it('lists every topic and skill, practised or not, with counts and no figure below the threshold', () => {
    seedQuestions(db, SAT, { perDomain: 6 });
    finishSession(alice, SAT.examKey, { length: 5 });
    const exam = buildDashboard(db, learner(alice), 'digital-sat').exam!;
    expect(exam.topics.map((t) => t.slug)).toEqual(SAT.domains.map((d) => d.slug));
    expect(exam.topics.flatMap((t) => t.skills)).toHaveLength(SAT.domains.reduce((n, d) => n + d.skills.length, 0));
    for (const topic of exam.topics) {
      if (topic.scored < 4) expect(topic.accuracy).toBeNull();
      expect(topic.reviewed).toBe(6);
    }
    expect(exam.topics.some((t) => t.scored === 0)).toBe(true);
  });
});

describe('states', () => {
  it('reports an exam whose bank holds no reviewed questions', () => {
    const exam = buildDashboard(db, learner(alice), 'gmat').exam!;
    expect(exam.bankSize).toBe(0);
    expect(exam.next).toBeNull();
  });

  it('distinguishes an exam with only an unfinished session', () => {
    seedQuestions(db, SAT, { perDomain: 6 });
    startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'practice' });
    const data = buildDashboard(db, learner(alice), undefined);
    expect(data.exam).toMatchObject({ examKey: 'digital-sat', finishedCount: 0, totalScored: 0 });
    expect(data.exam!.unfinishedHere).toHaveLength(1);
  });

  it('warns a guest in the last two days of the session that holds their practice', () => {
    const now = new Date('2026-09-26T12:00:00.000Z');
    const soon = buildDashboard(db, learner(alice, { isGuest: true, sessionExpiresAt: '2026-09-28T06:00:00.000Z' }), undefined, now);
    expect(soon.guest).toEqual({ expiresAt: '2026-09-28T06:00:00.000Z', expiringSoon: true });
    const later = buildDashboard(db, learner(alice, { isGuest: true, sessionExpiresAt: '2026-10-02T12:00:00.000Z' }), undefined, now);
    expect(later.guest?.expiringSoon).toBe(false);
    expect(buildDashboard(db, learner(alice), undefined, now).guest).toBeNull();
  });
});

describe('the failed-load state', () => {
  it('says the dashboard could not be loaded and offers a retry, never an empty dashboard', async () => {
    const { createElement } = await import('react');
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { default: DashboardError } = await import('@/app/dashboard/error');
    const html = renderToStaticMarkup(createElement(DashboardError, { error: new Error('boom'), reset: () => {} }));
    expect(html).toContain('Your dashboard could not be loaded');
    expect(html).toContain('role="alert"');
    expect(html).toContain('Try again');
    expect(html).not.toContain('Nothing to summarise');
    expect(html).not.toContain('boom');
  });
});
