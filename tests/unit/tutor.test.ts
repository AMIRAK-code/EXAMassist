import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import { recordResponse, startAttempt, submitAttempt } from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import type { TutorModelClient, TutorRequest } from '@/lib/tutor/client';
import { tutorSettings } from '@/lib/tutor/config';
import { checkDebriefForForecasts, checkHintForLeaks } from '@/lib/tutor/safety';
import { debrief, flagResponse, questionHelp, TutorError, withdrawResponse } from '@/lib/tutor/service';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * The AI tutor's contract, tested against the real attempt engine with a fake
 * model. The fake records every prompt it is sent, so these tests can check
 * not only what the learner is allowed to receive but what leaves the server.
 *
 * The rules that matter most: the tutor can never be used inside a timed
 * section, diagnostic or simulation, and it can never reveal an answer the
 * learner is not yet entitled to see.
 */

const SAT = requireExamConfig('digital-sat');

class FakeModel implements TutorModelClient {
  calls: TutorRequest[] = [];
  constructor(private readonly replies: string[] = ['Look at what the question asks you to compare.']) {}
  async complete(request: TutorRequest) {
    this.calls.push(request);
    const text = this.replies[Math.min(this.calls.length - 1, this.replies.length - 1)];
    return { ok: true as const, text, model: 'fake-model', inputTokens: 100, outputTokens: 40, truncated: false };
  }
}

let db: Db;
let alice: string;
let bob: string;
const alsoAlice = () => ({ userId: alice, isGuest: false });

beforeEach(() => {
  db = createTestDb();
  alice = createUser(db);
  bob = createUser(db);
  seedQuestions(db, SAT, { perDomain: 6 });
});

afterEach(() => {
  delete process.env.TUTOR_ACCOUNT_DAILY_LIMIT;
  delete process.env.TUTOR_GLOBAL_DAILY_LIMIT;
});

function learningSession(userId = alice) {
  return startAttempt(db, { userId, examKey: SAT.examKey, blueprintId: 'practice' }).attemptId;
}

/** Chooses an answer. With `check`, submits it and releases the explanation, as the Check answer button does. */
function answer(attemptId: string, position: number, optionId = 'b', userId = alice, check = false) {
  recordResponse(db, {
    attemptId,
    userId,
    partIndex: 0,
    position,
    response: { type: 'single_select', optionId },
    ...(check ? { reveal: true } : {}),
  });
}
const checkAnswer = (attemptId: string, position: number, optionId = 'b') => answer(attemptId, position, optionId, alice, true);

async function expectTutorError(promise: Promise<unknown>, code: string) {
  await expect(promise).rejects.toBeInstanceOf(TutorError);
  await promise.catch((error: TutorError) => expect(error.code).toBe(code));
}

describe('when the tutor is available', () => {
  it('is off unless an operator sets an API key, and names Haiku as the default model', () => {
    expect(tutorSettings({}).enabled).toBe(false);
    expect(tutorSettings({ ANTHROPIC_API_KEY: '  ' }).enabled).toBe(false);
    expect(tutorSettings({ ANTHROPIC_API_KEY: 'sk-test', TUTOR_ENABLED: 'false' }).enabled).toBe(false);
    const on = tutorSettings({ ANTHROPIC_API_KEY: 'sk-test' });
    expect(on.enabled).toBe(true);
    expect(on.model).toBe('claude-haiku-4-5');
  });

  it('refuses to run with no key configured, instead of failing somewhere deeper', async () => {
    const attemptId = learningSession();
    const saved = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      await expectTutorError(
        questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint' }),
        'tutor-disabled',
      );
    } finally {
      if (saved !== undefined) process.env.ANTHROPIC_API_KEY = saved;
    }
  });
});

describe('hints', () => {
  it('are given in an untimed learning session before the learner answers', async () => {
    const model = new FakeModel();
    const attemptId = learningSession();
    const reply = await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint' }, { client: model });
    expect(reply.kind).toBe('hint');
    expect(reply.html).toContain('compare');
    expect(reply.label).toMatch(/AI-generated/);
    expect(model.calls).toHaveLength(1);
  });

  it('are refused in a timed section, where they would be assistance during a test', async () => {
    const model = new FakeModel();
    const { attemptId } = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'timed-math-module-1' });
    await expectTutorError(
      questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint' }, { client: model }),
      'tutor-not-allowed',
    );
    expect(model.calls).toHaveLength(0);
  });

  it('are refused in a diagnostic', async () => {
    const model = new FakeModel();
    const { attemptId } = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'diagnostic' });
    await expectTutorError(
      questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint' }, { client: model }),
      'tutor-not-allowed',
    );
    expect(model.calls).toHaveLength(0);
  });

  it('are still offered after choosing an answer, which can be changed until it is checked', async () => {
    const model = new FakeModel();
    const attemptId = learningSession();
    answer(attemptId, 0);
    const reply = await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint' }, { client: model });
    expect(reply.kind).toBe('hint');
  });

  it('are refused once the answer is checked and the explanation is showing', async () => {
    const model = new FakeModel();
    const attemptId = learningSession();
    checkAnswer(attemptId, 0);
    await expectTutorError(
      questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint' }, { client: model }),
      'tutor-already-answered',
    );
    expect(model.calls).toHaveLength(0);
  });

  it('are never served when they give the answer away, and the model is told why on the retry', async () => {
    // The seeded key is option a, whose text is "First option".
    const model = new FakeModel(['The answer is (A).', 'The correct answer is First option.']);
    const attemptId = learningSession();
    await expectTutorError(
      questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint' }, { client: model }),
      'tutor-hint-unsafe',
    );
    expect(model.calls).toHaveLength(2);
    expect(model.calls[1].user).toMatch(/gave the answer away/);
    const stored = db.prepare(`SELECT COUNT(*) AS n FROM tutor_responses`).get() as { n: number };
    expect(stored.n).toBe(0);
  });

  it('are cached per question version, so the same hint is not paid for twice and never drifts', async () => {
    const model = new FakeModel(['First wording.', 'A different wording.']);
    const attemptId = learningSession();
    const one = await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint' }, { client: model });
    const two = await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint' }, { client: model });
    expect(two.cached).toBe(true);
    expect(two.responseId).toBe(one.responseId);
    expect(two.html).toContain('First wording');
    expect(model.calls).toHaveLength(1);

    // The key is the question version, not the learner, so another learner
    // asking about the same version is served the same text.
    const key = (db.prepare(`SELECT cache_key FROM tutor_responses WHERE id = ?`).get(one.responseId) as { cache_key: string }).cache_key;
    expect(key).toMatch(/^hint:v2:[0-9a-f-]{36}:1$/);
  });
});

describe('deeper explanations', () => {
  it('are refused before the learner is entitled to see the answer, even with an answer chosen', async () => {
    const model = new FakeModel();
    const attemptId = learningSession();
    answer(attemptId, 1);
    await expectTutorError(
      questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 1, kind: 'explain' }, { client: model }),
      'tutor-not-allowed',
    );
    expect(model.calls).toHaveLength(0);
  });

  it('are refused during a timed section even after answering, because the key is still withheld', async () => {
    const model = new FakeModel();
    const { attemptId } = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'timed-math-module-1' });
    answer(attemptId, 0);
    await expectTutorError(
      questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'explain' }, { client: model }),
      'tutor-not-allowed',
    );
  });

  it('are given once the answer is checked in a learning session, grounded in the reviewed solution and the learner’s choice', async () => {
    const model = new FakeModel(['**The idea being tested** is comparison.']);
    const attemptId = learningSession();
    checkAnswer(attemptId, 0, 'c');
    const reply = await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'explain' }, { client: model });
    expect(reply.kind).toBe('explain');

    const prompt = model.calls[0];
    expect(prompt.user).toContain('<reviewed_solution>');
    expect(prompt.user).toContain('A sufficiently long explanation');
    expect(prompt.user).toContain('The learner chose: C: Third option');
    expect(prompt.system).toMatch(/Never contradict them/);
  });

  it('are available for every question once a timed attempt is over', async () => {
    const model = new FakeModel();
    const { attemptId } = startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'timed-math-module-1' });
    submitAttempt(db, { attemptId, userId: alice });
    const reply = await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'explain' }, { client: model });
    expect(reply.kind).toBe('explain');
  });

  it('cannot be requested for somebody else’s attempt', async () => {
    const model = new FakeModel();
    const attemptId = learningSession(alice);
    checkAnswer(attemptId, 0);
    await expectTutorError(
      questionHelp(db, { userId: bob, isGuest: false }, { attemptId, partIndex: 0, position: 0, kind: 'explain' }, { client: model }),
      'unknown-attempt',
    );
  });
});

describe('what is sent to the model provider', () => {
  it('contains no email address, account id or display name', async () => {
    const model = new FakeModel();
    const attemptId = learningSession();
    checkAnswer(attemptId, 0);
    await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'explain' }, { client: model });
    submitAttempt(db, { attemptId, userId: alice });
    await debrief(db, alsoAlice(), attemptId, { client: new FakeModel(['### What went well\nPacing.']) });

    const email = (db.prepare(`SELECT email FROM users WHERE id = ?`).get(alice) as { email: string }).email;
    for (const call of model.calls) {
      const sent = `${call.system}\n${call.user}`;
      expect(sent).not.toContain(alice);
      expect(sent).not.toContain(email);
      expect(sent).not.toContain('Test user');
    }
  });
});

describe('the after-test guide', () => {
  it('is only available once the session is finished', async () => {
    const attemptId = learningSession();
    await expectTutorError(debrief(db, alsoAlice(), attemptId, { client: new FakeModel() }), 'tutor-not-allowed');
  });

  it('is built from the session’s results and the questions that were missed', async () => {
    const model = new FakeModel(['### What went well\nYou finished.']);
    const attemptId = learningSession();
    answer(attemptId, 0, 'b'); // wrong: the seeded key is a
    answer(attemptId, 1, 'a'); // right
    submitAttempt(db, { attemptId, userId: alice });

    const reply = await debrief(db, alsoAlice(), attemptId, { client: model });
    expect(reply.kind).toBe('debrief');
    const prompt = model.calls[0];
    expect(prompt.user).toContain('<by_skill>');
    expect(prompt.user).toContain('<missed_questions>');
    expect(prompt.user).toMatch(/Correct: 1\s+Incorrect: 1/);
    expect(prompt.system).toMatch(/Never predict a score/);
  });

  it('is withheld when it predicts a score, which we never allow', async () => {
    const attemptId = learningSession();
    submitAttempt(db, { attemptId, userId: alice });
    await expectTutorError(
      debrief(db, alsoAlice(), attemptId, { client: new FakeModel(['You are likely to score 1400 on test day.']) }),
      'tutor-debrief-unsafe',
    );
  });

  it('is personal: one learner’s guide is never served to another', async () => {
    const attemptId = learningSession();
    submitAttempt(db, { attemptId, userId: alice });
    const reply = await debrief(db, alsoAlice(), attemptId, { client: new FakeModel(['### What went well\nPacing.']) });
    expect(() => flagResponse(db, { userId: bob, isGuest: false }, { responseId: reply.responseId })).toThrowError(TutorError);
  });
});

describe('limits', () => {
  it('stop a learner after their daily allowance, counting real model calls only', async () => {
    process.env.TUTOR_ACCOUNT_DAILY_LIMIT = '2';
    const model = new FakeModel();
    const attemptId = learningSession();
    await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint', level: 1 }, { client: model });
    // A cache hit is free.
    await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint', level: 1 }, { client: model });
    await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint', level: 2 }, { client: model });
    await expectTutorError(
      questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 1, kind: 'hint' }, { client: model }),
      'tutor-quota',
    );
    expect(model.calls).toHaveLength(2);
  });

  it('cap the whole site, so the tutor has a spending ceiling', async () => {
    process.env.TUTOR_GLOBAL_DAILY_LIMIT = '1';
    const model = new FakeModel();
    await questionHelp(db, alsoAlice(), { attemptId: learningSession(alice), partIndex: 0, position: 0, kind: 'hint' }, { client: model });
    const bobAttempt = learningSession(bob);
    await expectTutorError(
      questionHelp(db, { userId: bob, isGuest: false }, { attemptId: bobAttempt, partIndex: 0, position: 1, kind: 'hint', level: 2 }, { client: model }),
      'tutor-busy',
    );
  });
});

describe('reports and withdrawal', () => {
  it('files a report against the exact response, and a withdrawn response is never served again', async () => {
    const model = new FakeModel(['First hint text.', 'Replacement hint text.']);
    const attemptId = learningSession();
    const first = await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint' }, { client: model });

    flagResponse(db, alsoAlice(), { responseId: first.responseId, details: 'This is misleading.' });
    const flag = db.prepare(`SELECT reason, tutor_response_id, details FROM content_flags`).get() as Record<string, string>;
    expect(flag).toEqual({ reason: 'ai_response', tutor_response_id: first.responseId, details: 'This is misleading.' });

    expect(withdrawResponse(db, first.responseId)).toBe(true);
    const second = await questionHelp(db, alsoAlice(), { attemptId, partIndex: 0, position: 0, kind: 'hint' }, { client: model });
    expect(second.responseId).not.toBe(first.responseId);
    expect(second.html).toContain('Replacement');
  });
});

describe('the answer-leak check', () => {
  const base = { correctChoiceTexts: ['a point granted to the opponents and then outweighed'], correctValues: [], visibleText: 'A stem with 12 and 30 in it.' };

  it('passes a hint that points at method', () => {
    expect(checkHintForLeaks({ ...base, hint: 'Label each sentence: premise, concession or conclusion. Start with 12 and 30.' }).safe).toBe(true);
    expect(checkHintForLeaks({ ...base, hint: 'Try to answer a simpler version of the question first.' }).safe).toBe(true);
  });

  it('rejects letters, statements of the answer, quoted choices and unseen final values', () => {
    expect(checkHintForLeaks({ ...base, hint: 'Look closely at (C).' }).safe).toBe(false);
    expect(checkHintForLeaks({ ...base, hint: 'Option B is worth a second look.' }).safe).toBe(false);
    expect(checkHintForLeaks({ ...base, hint: 'So the answer is clear.' }).safe).toBe(false);
    expect(checkHintForLeaks({ ...base, hint: 'It is a point granted to the opponents and then outweighed.' }).safe).toBe(false);
    expect(
      checkHintForLeaks({ ...base, correctChoiceTexts: ['42'], hint: 'Multiply to get 42.' }).safe,
    ).toBe(false);
  });
});

describe('the forecast check', () => {
  it('rejects scores, percentiles and admission chances, and allows ordinary advice', () => {
    expect(checkDebriefForForecasts('You are likely to score 160 on the real test.').safe).toBe(false);
    expect(checkDebriefForForecasts('That would put you in the 80th percentile.').safe).toBe(false);
    expect(checkDebriefForForecasts('Your chances of admission look strong.').safe).toBe(false);
    expect(checkDebriefForForecasts('Drill ten inference questions, untimed, then five timed.').safe).toBe(true);
  });
});
