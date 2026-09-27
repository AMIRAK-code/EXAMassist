import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import { recordResponse, startAttempt, startRetry, submitAttempt } from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import {
  activePlan,
  addDays,
  applyAdjustment,
  buildSessions,
  createPlan,
  dayIsOver,
  isoDay,
  linkStartedSession,
  matchCompletions,
  planAdjustment,
  planInputs,
  planSessions,
  planShape,
  recordCompletions,
  resolveDateConflict,
  retryableMissed,
  satisfies,
  sessionMinutes,
  setExamDate,
  skipSession,
  stateOf,
  PlanError,
  type FinishedAttempt,
  type PlannedSession,
  type PlanSessionRow,
} from '@/lib/learning/plan';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * Stored study plans (docs/REDESIGN.md §18.5): the shape of a plan, what each
 * session asks for, the four states, what satisfies a session, and adjusting
 * with a preview that is exactly what gets stored.
 */

const SAT = requireExamConfig('digital-sat');
const DOMAIN = SAT.domains[0];

function session(overrides: Partial<PlanSessionRow> = {}): PlanSessionRow {
  return {
    id: 's1',
    planId: 'p1',
    scheduledOn: '2026-10-01',
    sequence: 1,
    kind: 'new',
    domainSlug: DOMAIN.slug,
    skillSlug: null,
    questionCount: 10,
    minutes: 25,
    reason: 'test',
    status: 'planned',
    attemptId: null,
    statusAt: null,
    ...overrides,
  };
}

function attempt(overrides: Partial<FinishedAttempt> = {}): FinishedAttempt {
  return {
    id: 'a1',
    blueprintId: 'practice',
    mode: 'practice',
    submittedAt: '2026-10-01T10:00:00.000Z',
    answered: 10,
    domains: [DOMAIN.slug],
    skills: [],
    newQuestionsOnly: true,
    ...overrides,
  };
}

describe('the shape of a plan', () => {
  it('runs six weeks without an exam date', () => {
    expect(planShape('2026-10-01', null, 150)).toEqual({ startsOn: '2026-10-01', endsOn: '2026-11-11', weeks: 6, sessionsPerWeek: 6 });
  });

  it('ends the day before the exam, and at eight weeks at most', () => {
    expect(planShape('2026-10-01', '2026-10-20', 50)).toMatchObject({ weeks: 3, endsOn: '2026-10-19', sessionsPerWeek: 2 });
    expect(planShape('2026-10-01', '2027-03-01', 50)).toMatchObject({ weeks: 8, endsOn: '2026-11-25' });
  });

  it('counts a day as over only from noon UTC the day after, wherever the learner is', () => {
    expect(dayIsOver('2026-10-01', new Date('2026-10-02T11:59:59Z'))).toBe(false);
    expect(dayIsOver('2026-10-01', new Date('2026-10-02T12:00:00Z'))).toBe(true);
    expect(stateOf(session(), new Date('2026-10-02T12:00:00Z'))).toBe('missed');
    expect(stateOf(session({ status: 'completed' }), new Date('2026-12-01T00:00:00Z'))).toBe('completed');
  });
});

describe('satisfying a planned session', () => {
  it('needs a finished session with enough answers: opening one, or answering too few, is nothing', () => {
    expect(satisfies(attempt({ answered: 4 }), session())).toBe(false);
    expect(satisfies(attempt({ answered: 5 }), session())).toBe(true);
    // A short planned session needs only its own length.
    expect(satisfies(attempt({ answered: 3 }), session({ questionCount: 3 }))).toBe(true);
  });

  it('needs the same topic or skill, and a retry for a review', () => {
    expect(satisfies(attempt({ domains: [SAT.domains[1].slug] }), session())).toBe(false);
    expect(satisfies(attempt({ skills: [DOMAIN.skills[0].slug] }), session({ skillSlug: DOMAIN.skills[0].slug }))).toBe(true);
    expect(satisfies(attempt(), session({ kind: 'review', domainSlug: null }))).toBe(false);
    expect(satisfies(attempt({ blueprintId: 'retry', mode: 'review', domains: [] }), session({ kind: 'review', domainSlug: null }))).toBe(true);
    expect(satisfies(attempt({ blueprintId: 'retry', mode: 'review' }), session())).toBe(false);
    // Mixed practice takes any practice session.
    expect(satisfies(attempt({ domains: [] }), session({ kind: 'mixed', domainSlug: null }))).toBe(true);
    // A diagnostic is not practice.
    expect(satisfies(attempt({ blueprintId: 'diagnostic', mode: 'diagnostic', domains: [] }), session({ kind: 'mixed', domainSlug: null }))).toBe(false);
  });

  it('completes a new-questions activity only with a session recorded as built from new questions', () => {
    const ordinary = attempt({ newQuestionsOnly: false });
    expect(satisfies(ordinary, session({ kind: 'new' }))).toBe(false);
    expect(satisfies(ordinary, session({ kind: 'mixed', domainSlug: null }))).toBe(false);
    // Revision may repeat questions, so either kind of session completes it.
    expect(satisfies(ordinary, session({ kind: 'revision' }))).toBe(true);
    expect(satisfies(attempt(), session({ kind: 'revision' }))).toBe(true);
    expect(satisfies(attempt(), session({ kind: 'new' }))).toBe(true);
  });

  it('lets each finished session satisfy one planned session, the earliest it fits', () => {
    const sessions = [session({ id: 's1', scheduledOn: '2026-10-03' }), session({ id: 's2', scheduledOn: '2026-10-01' })];
    const matches = matchCompletions(sessions, [attempt({ id: 'a1' })]);
    expect(matches).toEqual([{ sessionId: 's2', attemptId: 'a1', at: '2026-10-01T10:00:00.000Z' }]);
    const both = matchCompletions(sessions, [attempt({ id: 'a1' }), attempt({ id: 'a2', submittedAt: '2026-10-02T10:00:00.000Z' })]);
    expect(both.map((m) => m.sessionId)).toEqual(['s2', 's1']);
  });

  it('keeps a session started from the plan for the session it was started from', () => {
    const sessions = [session({ id: 's1', attemptId: 'a9' }), session({ id: 's2', scheduledOn: '2026-10-05' })];
    // Another session of the topic fills s2, not the one waiting for a9.
    expect(matchCompletions(sessions, [attempt({ id: 'a1' })]).map((m) => m.sessionId)).toEqual(['s2']);
    expect(matchCompletions(sessions, [attempt({ id: 'a9' })]).map((m) => m.sessionId)).toEqual(['s1']);
    // Started from the plan but finished with too few answers: it satisfies nothing.
    expect(matchCompletions(sessions, [attempt({ id: 'a9', answered: 2 })])).toEqual([]);
  });

  it('never changes history: completed, skipped and recorded-missed sessions take nothing', () => {
    const sessions = [session({ id: 's1', status: 'skipped' }), session({ id: 's2', status: 'missed' }), session({ id: 's3', status: 'completed', attemptId: 'a0' })];
    expect(matchCompletions(sessions, [attempt({ id: 'a1' })])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------

let db: Db;
let learner: string;

/** A finished practice session with the given filters; every answer "a" (correct) except `wrong` positions. */
function practise(overrides: Record<string, unknown>, wrong: number[] = [], now?: Date): string {
  const { attemptId } = startAttempt(db, { userId: learner, examKey: SAT.examKey, blueprintId: 'practice', overrides, now });
  const items = db.prepare('SELECT position FROM attempt_items WHERE attempt_id = ? ORDER BY position').all(attemptId) as Array<{ position: number }>;
  for (const { position } of items) {
    recordResponse(db, {
      attemptId,
      userId: learner,
      partIndex: 0,
      position,
      response: { type: 'single_select', optionId: wrong.includes(position) ? 'b' : 'a' },
      now,
    });
  }
  submitAttempt(db, { attemptId, userId: learner, now });
  return attemptId;
}

beforeEach(() => {
  db = createTestDb();
  learner = createUser(db);
  seedQuestions(db, SAT, { perDomain: 12 });
});

describe('building sessions from what is available', () => {
  it('plans new questions while enough are unseen, then revision, saying so', () => {
    const inputs = planInputs(db, learner, SAT, { startsOn: '2026-10-01', examDate: null, weeklyMinutes: 200 });
    const sessions = buildSessions(inputs);
    const topic = sessions.filter((s) => s.domainSlug === DOMAIN.slug && s.skillSlug === null);
    // 12 questions in the topic: one new session of 10, then revision.
    expect(topic[0]).toMatchObject({ kind: 'new', questionCount: 10 });
    expect(topic[1].kind).toBe('revision');
    expect(topic[1].reason).toContain('revises ones you have');
  });

  it('revises a topic at most once a week, leaving time unfilled rather than repeating more', () => {
    const inputs = planInputs(db, learner, SAT, { startsOn: '2026-10-01', examDate: null, weeklyMinutes: 420 });
    const sessions = buildSessions(inputs);
    const shape = planShape('2026-10-01', null, 420);
    const perWeek = new Map<string, number>();
    for (const s of sessions.filter((s) => s.kind === 'revision')) {
      const week = Math.floor((Date.parse(s.scheduledOn) - Date.parse('2026-10-01')) / (7 * 86_400_000));
      const key = `${week}|${s.domainSlug}|${s.skillSlug}`;
      perWeek.set(key, (perWeek.get(key) ?? 0) + 1);
    }
    expect(Math.max(...perWeek.values())).toBe(1);
    // 8 topics can fill 8 of the 17 slots a week once their new questions run out.
    expect(sessions.length).toBeLessThan(shape.weeks * shape.sessionsPerWeek);
  });

  it('sizes a session’s minutes to its questions', () => {
    expect(sessionMinutes(10)).toBe(25);
    expect(sessionMinutes(3)).toBe(8);
    expect(sessionMinutes(1)).toBe(5);
  });

  it('plans a thin skill as its topic, saying so', () => {
    // A weak skill with signal (4 answers, 1 right), but only a few reviewed questions of its own.
    const skill = DOMAIN.skills[0].slug;
    practise({ skills: [skill], length: 3 }, [0, 1, 2]);
    practise({ skills: [skill], length: 1 }, [0]);
    const inputs = planInputs(db, learner, SAT, { startsOn: '2026-10-01', examDate: null, weeklyMinutes: 150 });
    const first = buildSessions(inputs).find((s) => s.kind !== 'review')!;
    expect(first).toMatchObject({ domainSlug: DOMAIN.slug, skillSlug: null });
    expect(first.reason).toMatch(/has only \d reviewed questions?, so its topic is practised/);
  });

  it('plans a review only while missed questions can be asked again, as many as it takes', () => {
    expect(buildSessions(planInputs(db, learner, SAT, { startsOn: '2026-10-01', examDate: null, weeklyMinutes: 150 })).some((s) => s.kind === 'review')).toBe(false);
    practise({ domains: [DOMAIN.slug], length: 10 }, [0, 1, 2]);
    expect(retryableMissed(db, learner, SAT.examKey)).toHaveLength(3);
    const reviews = buildSessions(planInputs(db, learner, SAT, { startsOn: '2026-10-01', examDate: null, weeklyMinutes: 150 })).filter((s) => s.kind === 'review');
    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toMatchObject({ questionCount: 3, scheduledOn: '2026-10-01' });
    expect(reviews[0].reason).toContain('This repeats them on purpose');
  });
});

describe('a stored plan', () => {
  const create = (now = new Date(), weeklyMinutes = 150) =>
    createPlan(db, { userId: learner, examKey: SAT.examKey, weeklyMinutes, examDate: null, now });

  it('is created once per exam, and a visit only records completions', () => {
    const plan = create();
    expect(() => create()).toThrowError(PlanError);
    const before = planSessions(db, learner, plan.id);
    expect(before.length).toBeGreaterThan(0);
    expect(before.every((s) => s.status === 'planned')).toBe(true);

    expect(recordCompletions(db, learner, plan)).toBe(0);
    expect(planSessions(db, learner, plan.id)).toEqual(before);
  });

  it('is completed by a finished matching session, and not by an unfinished one', () => {
    const plan = create();
    const first = planSessions(db, learner, plan.id)[0];
    expect(first.domainSlug).not.toBeNull();

    // Opened and answered, but not finished.
    const open = startAttempt(db, { userId: learner, examKey: SAT.examKey, blueprintId: 'practice', overrides: { domains: [first.domainSlug!], length: 10, unseenOnly: true } });
    for (let position = 0; position < 10; position += 1) {
      recordResponse(db, { attemptId: open.attemptId, userId: learner, partIndex: 0, position, response: { type: 'single_select', optionId: 'a' } });
    }
    expect(recordCompletions(db, learner, activePlan(db, learner, SAT.examKey)!)).toBe(0);

    submitAttempt(db, { attemptId: open.attemptId, userId: learner });
    expect(recordCompletions(db, learner, activePlan(db, learner, SAT.examKey)!)).toBe(1);
    const done = planSessions(db, learner, plan.id).find((s) => s.id === first.id)!;
    expect(done).toMatchObject({ status: 'completed', attemptId: open.attemptId });

    // Recording again changes nothing.
    expect(recordCompletions(db, learner, activePlan(db, learner, SAT.examKey)!)).toBe(0);
  });

  it('links a session started from it, so that session completes it', () => {
    const plan = create();
    const target = planSessions(db, learner, plan.id)[2];
    const attemptId = practise({ ...(target.domainSlug ? { domains: [target.domainSlug] } : {}), length: 10, unseenOnly: true });
    // Pretend it was started from the plan: link, then record.
    db.prepare("UPDATE attempts SET submitted_at = ? WHERE id = ?").run(new Date().toISOString(), attemptId);
    linkStartedSession(db, learner, target.id, attemptId);
    recordCompletions(db, learner, activePlan(db, learner, SAT.examKey)!);
    expect(planSessions(db, learner, plan.id).find((s) => s.id === target.id)).toMatchObject({ status: 'completed', attemptId });
  });

  it('skips a session for good, and refuses to skip a completed one', () => {
    const plan = create();
    const [first, second] = planSessions(db, learner, plan.id);
    skipSession(db, learner, second.id);
    expect(planSessions(db, learner, plan.id).find((s) => s.id === second.id)!.status).toBe('skipped');
    practise({ domains: [first.domainSlug!], length: 10, unseenOnly: true });
    recordCompletions(db, learner, activePlan(db, learner, SAT.examKey)!);
    expect(() => skipSession(db, learner, first.id)).toThrowError(PlanError);
    // Another learner cannot skip it.
    const other = createUser(db);
    const [third] = planSessions(db, learner, plan.id).filter((s) => s.status === 'planned');
    expect(() => skipSession(db, other, third.id)).toThrowError(PlanError);
  });
});

describe('what completes an activity', () => {
  /** A plan with exactly the given open activities, dated today. */
  function planWith(activities: Array<{ kind: PlannedSession['kind']; domainSlug?: string | null; questionCount?: number }>) {
    const plan = createPlan(db, { userId: learner, examKey: SAT.examKey, weeklyMinutes: 150, examDate: null, now: new Date() });
    db.prepare('DELETE FROM plan_sessions WHERE plan_id = ?').run(plan.id);
    const today = isoDay(new Date());
    const insert = db.prepare(
      `INSERT INTO plan_sessions (id, plan_id, user_id, scheduled_on, sequence, kind, domain_slug, skill_slug, question_count, minutes, reason, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?, 25, 'test', 'planned', ?)`,
    );
    const ids = activities.map((a, index) => {
      const id = `act-${index}`;
      insert.run(id, plan.id, learner, today, index + 1, a.kind, a.domainSlug === undefined ? DOMAIN.slug : a.domainSlug, a.questionCount ?? 10, new Date().toISOString());
      return id;
    });
    return { plan, ids };
  }
  const statusOf = (id: string) => (db.prepare('SELECT status, attempt_id AS attemptId FROM plan_sessions WHERE id = ?').get(id) as { status: string; attemptId: string | null });
  const record = () => recordCompletions(db, learner, activePlan(db, learner, SAT.examKey)!);

  /** A practice session of the topic with `answered` questions answered and the rest left blank, finished as `status`. */
  function finishWith(overrides: Record<string, unknown>, answered: number, status: 'submitted' | 'expired' | 'abandoned' = 'submitted'): string {
    const { attemptId } = startAttempt(db, { userId: learner, examKey: SAT.examKey, blueprintId: 'practice', overrides: { domains: [DOMAIN.slug], ...overrides } });
    const items = db.prepare('SELECT position FROM attempt_items WHERE attempt_id = ? ORDER BY position').all(attemptId) as Array<{ position: number }>;
    for (const { position } of items.slice(0, answered)) {
      recordResponse(db, { attemptId, userId: learner, partIndex: 0, position, response: { type: 'single_select', optionId: 'a' } });
    }
    submitAttempt(db, { attemptId, userId: learner });
    // Practice has no clock, so "closed by its clock" and "abandoned" are set directly.
    if (status !== 'submitted') db.prepare('UPDATE attempts SET status = ? WHERE id = ?').run(status, attemptId);
    return attemptId;
  }

  it('records "new questions only" on a session only when it was enforced as it was built', () => {
    const settings = (id: string) => JSON.parse((db.prepare('SELECT settings_json AS s FROM attempts WHERE id = ?').get(id) as { s: string }).s);
    expect(settings(finishWith({ length: 10, unseenOnly: true }, 10)).newQuestionsOnly).toBe(true);
    expect(settings(finishWith({ length: 10 }, 10)).newQuestionsOnly).toBeUndefined();
  });

  it('completes a new-questions activity with a genuinely new-question session', () => {
    const { ids } = planWith([{ kind: 'new' }]);
    const attemptId = finishWith({ length: 10, unseenOnly: true }, 10);
    expect(record()).toBe(1);
    expect(statusOf(ids[0])).toEqual({ status: 'completed', attemptId });
  });

  it('does not let an ordinary session, repeats included, complete a new-questions activity', () => {
    // Seen before the plan: the next ordinary session of this 12-question topic must repeat some.
    finishWith({ length: 10 }, 10);
    const { ids } = planWith([{ kind: 'new' }, { kind: 'mixed', domainSlug: null }, { kind: 'revision' }]);
    const ordinary = finishWith({ length: 10 }, 10);
    const repeated = db
      .prepare(
        `SELECT COUNT(*) AS n FROM attempt_items ai WHERE ai.attempt_id = ? AND EXISTS (
           SELECT 1 FROM attempt_items prior JOIN attempts a ON a.id = prior.attempt_id
            WHERE prior.question_id = ai.question_id AND a.user_id = ? AND a.id <> ai.attempt_id)`,
      )
      .get(ordinary, learner) as { n: number };
    expect(repeated.n).toBeGreaterThan(0);
    record();
    expect(statusOf(ids[0]).status).toBe('planned');
    expect(statusOf(ids[1]).status).toBe('planned');
    // It is revision, which may repeat: that one it completes.
    expect(statusOf(ids[2])).toEqual({ status: 'completed', attemptId: ordinary });
  });

  it('counts answers, not questions shown: blanks do not count, and 5 answers complete a 10-question activity', () => {
    const { ids } = planWith([{ kind: 'new' }]);
    finishWith({ length: 10, unseenOnly: true }, 4);
    expect(record()).toBe(0);
    // The threshold, not every planned question: 5 answered of the 10 planned.
    finishWith({ length: 5, unseenOnly: true }, 5);
    expect(record()).toBe(1);
    expect(statusOf(ids[0]).status).toBe('completed');
  });

  it('completes a short activity when every planned question is answered, and not with one left blank', () => {
    const { ids } = planWith([{ kind: 'revision', questionCount: 3 }]);
    finishWith({ length: 3 }, 2);
    expect(record()).toBe(0);
    finishWith({ length: 3 }, 3);
    expect(record()).toBe(1);
    expect(statusOf(ids[0]).status).toBe('completed');
  });

  it('treats a session closed by its clock as finished, and an abandoned one as not', () => {
    const { ids } = planWith([{ kind: 'new' }, { kind: 'new' }]);
    finishWith({ length: 5, unseenOnly: true }, 5, 'abandoned');
    expect(record()).toBe(0);
    finishWith({ length: 5, unseenOnly: true }, 5, 'expired');
    expect(record()).toBe(1);
    expect([statusOf(ids[0]).status, statusOf(ids[1]).status]).toEqual(['completed', 'planned']);
  });

  it('lets one session complete at most one activity, and opening one completes nothing', () => {
    const { ids } = planWith([{ kind: 'new' }, { kind: 'new' }]);
    const open = startAttempt(db, { userId: learner, examKey: SAT.examKey, blueprintId: 'practice', overrides: { domains: [DOMAIN.slug], length: 10, unseenOnly: true } });
    linkStartedSession(db, learner, ids[0], open.attemptId);
    expect(record()).toBe(0);
    expect(statusOf(ids[0])).toEqual({ status: 'planned', attemptId: open.attemptId });
    for (let position = 0; position < 10; position += 1) {
      recordResponse(db, { attemptId: open.attemptId, userId: learner, partIndex: 0, position, response: { type: 'single_select', optionId: 'a' } });
    }
    submitAttempt(db, { attemptId: open.attemptId, userId: learner });
    expect(record()).toBe(1);
    expect([statusOf(ids[0]).status, statusOf(ids[1]).status]).toEqual(['completed', 'planned']);
    expect(record()).toBe(0);
  });

  it('never re-judges history: completed and skipped activities stay as they were', () => {
    const { ids } = planWith([{ kind: 'new' }, { kind: 'new' }]);
    const earlier = finishWith({ length: 10 }, 10);
    // Completed before this rule, by an ordinary session; and one skipped.
    db.prepare("UPDATE plan_sessions SET status = 'completed', attempt_id = ?, status_at = ? WHERE id = ?").run(earlier, new Date().toISOString(), ids[0]);
    skipSession(db, learner, ids[1]);
    finishWith({ length: 2, unseenOnly: true }, 2);
    record();
    expect(statusOf(ids[0])).toEqual({ status: 'completed', attemptId: earlier });
    expect(statusOf(ids[1]).status).toBe('skipped');
  });
});

describe('adjusting the remaining plan', () => {
  it('previews first, and applies exactly the preview: missed recorded, future replaced, history kept', () => {
    const start = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const plan = createPlan(db, { userId: learner, examKey: SAT.examKey, weeklyMinutes: 150, examDate: null, now: start });
    const sessions = planSessions(db, learner, plan.id);
    const now = new Date();
    const missedBefore = sessions.filter((s) => stateOf(s, now) === 'missed');
    expect(missedBefore.length).toBeGreaterThan(0);

    // One of the past sessions was skipped: history.
    skipSession(db, learner, missedBefore[0].id);
    const current = activePlan(db, learner, SAT.examKey)!;

    const { preview, digest } = planAdjustment(db, learner, current, { weeklyMinutes: 150, examDate: null, now });
    expect(preview.missed.map((s) => s.id)).not.toContain(missedBefore[0].id);
    expect(preview.missed.length).toBe(missedBefore.length - 1);
    expect(preview.history).toBe(1);
    expect(preview.startsOn).toBe(isoDay(now));
    // Nothing is stored by a preview.
    expect(planSessions(db, learner, plan.id).filter((s) => s.status === 'missed')).toHaveLength(0);

    // A stale preview is refused.
    expect(() => applyAdjustment(db, learner, plan.id, 'not-the-digest', { weeklyMinutes: 150, examDate: null, now })).toThrowError(
      expect.objectContaining({ code: 'plan-changed' }),
    );

    applyAdjustment(db, learner, plan.id, digest, { weeklyMinutes: 150, examDate: null, now });
    const after = planSessions(db, learner, plan.id);
    expect(after.filter((s) => s.status === 'missed').map((s) => s.id).sort()).toEqual(preview.missed.map((s) => s.id).sort());
    expect(after.find((s) => s.id === missedBefore[0].id)!.status).toBe('skipped');
    const upcoming = after.filter((s) => s.status === 'planned');
    expect(upcoming.every((s) => s.scheduledOn >= isoDay(now))).toBe(true);
    expect(upcoming.length).toBe(preview.kept + preview.added.length);
    // The first new session carries a missed topic forward.
    const carried = upcoming.filter((s) => s.kind !== 'review').sort((a, b) => a.scheduledOn.localeCompare(b.scheduledOn) || a.sequence - b.sequence)[0];
    expect(carried.reason).toContain('Carried from a missed session');

    // Applying the same preview twice is refused: the plan moved on.
    expect(() => applyAdjustment(db, learner, plan.id, digest, { weeklyMinutes: 150, examDate: null, now })).toThrowError(
      expect.objectContaining({ code: 'plan-changed' }),
    );
  });

  it('keeps a recorded-missed session missed, even if matching practice comes later', () => {
    const start = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const plan = createPlan(db, { userId: learner, examKey: SAT.examKey, weeklyMinutes: 150, examDate: null, now: start });
    const current = activePlan(db, learner, SAT.examKey)!;
    const { digest, preview } = planAdjustment(db, learner, current, { weeklyMinutes: 150, examDate: null });
    applyAdjustment(db, learner, plan.id, digest, { weeklyMinutes: 150, examDate: null });
    const missed = preview.missed[0];
    practise({ domains: [missed.domainSlug!], length: 10 });
    recordCompletions(db, learner, activePlan(db, learner, SAT.examKey)!);
    expect(planSessions(db, learner, plan.id).find((s) => s.id === missed.id)!.status).toBe('missed');
  });
});

describe('the one exam date', () => {
  const target = () =>
    db.prepare('SELECT target_score AS score, target_date AS date, legacy_plan_date AS legacy FROM exam_targets WHERE user_id = ?').get(learner);

  it('keeps a conflict open until the learner chooses, and keeps the target score', () => {
    db.prepare("INSERT INTO exam_targets (user_id, exam_key, target_score, target_date, created_at, updated_at, legacy_plan_date) VALUES (?, ?, 1400, '2026-12-05', 'x', 'x', '2026-11-07')").run(learner, SAT.examKey);
    setExamDate(db, learner, SAT.examKey, '2026-12-05');
    expect(target()).toEqual({ score: 1400, date: '2026-12-05', legacy: '2026-11-07' });
    expect(resolveDateConflict(db, learner, SAT.examKey, 'earlier')).toBe(true);
    expect(target()).toEqual({ score: 1400, date: '2026-11-07', legacy: null });
    expect(resolveDateConflict(db, learner, SAT.examKey, 'current')).toBe(false);
  });

  it('settles a conflict when the learner sets a different date', () => {
    db.prepare("INSERT INTO exam_targets (user_id, exam_key, target_score, target_date, created_at, updated_at, legacy_plan_date) VALUES (?, ?, NULL, '2026-12-05', 'x', 'x', '2026-11-07')").run(learner, SAT.examKey);
    setExamDate(db, learner, SAT.examKey, addDays('2026-12-05', 7));
    expect(target()).toEqual({ score: null, date: '2026-12-12', legacy: null });
  });
});

describe('reviews', () => {
  it('drops a missed question from review once it is answered right in a retry', () => {
    practise({ domains: [DOMAIN.slug], length: 10 }, [0]);
    const [missed] = retryableMissed(db, learner, SAT.examKey);
    const retry = startRetry(db, { userId: learner, examKey: SAT.examKey, questionIds: [missed] });
    recordResponse(db, { attemptId: retry.attemptId, userId: learner, partIndex: 0, position: 0, response: { type: 'single_select', optionId: 'a' } });
    submitAttempt(db, { attemptId: retry.attemptId, userId: learner });
    expect(retryableMissed(db, learner, SAT.examKey)).toEqual([]);
  });
});
