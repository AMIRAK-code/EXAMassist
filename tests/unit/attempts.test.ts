import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import {
  AttemptError,
  finalise,
  getAttemptState,
  getResult,
  recordResponse,
  startAttempt,
  submitAttempt,
  submitPart,
} from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { attemptQuestionOrder, createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * Integration tests for the attempt lifecycle, against a real database with the
 * real migrations. These cover the behaviours the release is defined by:
 * isolation between users, survival of a refresh, server-authoritative timing,
 * idempotent submission, and pinning to immutable content.
 */

const SAT = requireExamConfig('digital-sat');
const BOCCONI = requireExamConfig('bocconi-undergraduate');

let db: Db;
let alice: string;
let bob: string;

beforeEach(async () => {
  db = (await createTestDb());
  alice = (await createUser(db));
  bob = (await createUser(db));
});

describe('starting an attempt', () => {
  it('creates the attempt, its parts and its items in one go', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));

    const state = (await getAttemptState(db, attemptId, alice));
    expect(state.status).toBe('in_progress');
    expect(state.parts).toHaveLength(1);
    expect(state.parts[0].items).toHaveLength(10);
    expect(new Set(state.parts[0].items.map((i) => i.questionId)).size).toBe(10);
  });

  it('pins the exam configuration version at creation', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));
    const state = (await getAttemptState(db, attemptId, alice));
    expect(state.configVersion).toBe(SAT.version);
  });

  it('refuses to start when the reviewed pool cannot fill the blueprint', async () => {
    (await seedQuestions(db, SAT, { perDomain: 1 })); // 8 questions, practice wants 10
    (await expect(async () =>
      (await startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'practice' })),
    ).rejects.toThrowError(AttemptError));

    try {
      (await startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'practice' }));
    } catch (error) {
      expect((error as AttemptError).code).toBe('insufficient-content');
      expect((error as AttemptError).status).toBe(409);
    }
  });

  it('returns the same attempt for a repeated idempotency key', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const first = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
      idempotencyKey: 'double-click-1',
    }));
    const second = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
      idempotencyKey: 'double-click-1',
    }));

    expect(second.attemptId).toBe(first.attemptId);
    expect(second.reused).toBe(true);

    const count = (await db.prepare('SELECT COUNT(*) AS n FROM attempts WHERE user_id = ?').get(alice)) as {
      n: number;
    };
    expect(count.n).toBe(1);
  });

  it('lets two different users reuse the same idempotency key', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const a = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
      idempotencyKey: 'shared-key',
    }));
    const b = (await startAttempt(db, {
      userId: bob,
      examKey: SAT.examKey,
      blueprintId: 'practice',
      idempotencyKey: 'shared-key',
    }));
    expect(a.attemptId).not.toBe(b.attemptId);
  });

  it('refuses a simulation the exam configuration does not support', async () => {
    (await seedQuestions(db, SAT, { perDomain: 30 }));
    const gmat = requireExamConfig('gmat');
    expect(gmat.capabilities.fullSimulation.available).toBe(false);
    (await expect(async () =>
      (await startAttempt(db, { userId: alice, examKey: 'gmat', blueprintId: 'simulation-full' })),
    ).rejects.toThrowError());
  });
});

describe('user isolation', () => {
  it('hides another learner’s attempt entirely', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));

    // Bob must not be able to tell the attempt exists at all.
    (await expect(async () => (await getAttemptState(db, attemptId, bob))).rejects.toThrowError(AttemptError));
    try {
      (await getAttemptState(db, attemptId, bob));
    } catch (error) {
      expect((error as AttemptError).status).toBe(404);
    }
  });

  it('refuses to record another learner’s answer', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));

    (await expect(async () =>
      (await recordResponse(db, {
        attemptId,
        userId: bob,
        partIndex: 0,
        position: 0,
        response: { type: 'single_select', optionId: 'a' },
      })),
    ).rejects.toThrowError(AttemptError));

    const item = (await db
      .prepare('SELECT response_json FROM attempt_items WHERE attempt_id = ? AND position = 0')
      .get(attemptId)) as { response_json: string | null };
    expect(item.response_json).toBeNull();
  });

  it('refuses to submit another learner’s attempt', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));
    (await expect(async () => (await submitAttempt(db, { attemptId, userId: bob }))).rejects.toThrowError(AttemptError));
    const row = (await db.prepare('SELECT status FROM attempts WHERE id = ?').get(attemptId)) as {
      status: string;
    };
    expect(row.status).toBe('in_progress');
  });
});

describe('surviving a refresh', () => {
  it('returns the same questions in the same order every time', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));

    const first = (await attemptQuestionOrder(db, attemptId));
    const reloaded = (await getAttemptState(db, attemptId, alice));
    const second = reloaded.parts.flatMap((part) => part.items.map((item) => item.questionId));

    expect(second).toEqual(first);
    // And again, to be sure nothing regenerates on read.
    expect((await attemptQuestionOrder(db, attemptId))).toEqual(first);
  });

  it('keeps answers across reloads', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));

    (await recordResponse(db, {
      attemptId,
      userId: alice,
      partIndex: 0,
      position: 3,
      response: { type: 'single_select', optionId: 'b' },
    }));

    const state = (await getAttemptState(db, attemptId, alice));
    const item = state.parts[0].items.find((i) => i.position === 3);
    expect(item?.answered).toBe(true);
    expect(item?.response).toEqual({ type: 'single_select', optionId: 'b' });
  });

  it('does not leak the answer key while the attempt is live and unanswered', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'timed-math-module-1',
    }));

    const state = (await getAttemptState(db, attemptId, alice));
    const serialised = JSON.stringify(state);
    expect(state.immediateFeedback).toBe(false);
    for (const item of state.parts[0].items) {
      expect(item.review).toBeNull();
    }
    expect(serialised).not.toContain('explanation of why the first option is correct');
  });
});

describe('scoring an attempt', () => {
  it('scores correct, incorrect and omitted answers', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));

    // 4 correct, 3 wrong, 3 left blank.
    for (let position = 0; position < 4; position += 1) {
      (await recordResponse(db, {
        attemptId,
        userId: alice,
        partIndex: 0,
        position,
        response: { type: 'single_select', optionId: 'a' },
      }));
    }
    for (let position = 4; position < 7; position += 1) {
      (await recordResponse(db, {
        attemptId,
        userId: alice,
        partIndex: 0,
        position,
        response: { type: 'single_select', optionId: 'c' },
      }));
    }

    (await submitAttempt(db, { attemptId, userId: alice }));
    const result = (await getResult(db, attemptId, alice));

    expect(result?.totals).toMatchObject({
      correct: 4,
      incorrect: 3,
      omitted: 3,
      pointsEarned: 4,
      pointsPossible: 10,
    });
    expect(result?.totals.accuracy).toBeCloseTo(0.4, 5);
  });

  it('applies the Bocconi wrong-answer penalty but not to blanks', async () => {
    (await seedQuestions(db, BOCCONI, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: BOCCONI.examKey,
      blueprintId: 'practice',
    }));

    // 2 correct, 5 wrong, 3 blank -> 2 - (5 * 0.2) = 1.0
    for (let position = 0; position < 2; position += 1) {
      (await recordResponse(db, {
        attemptId,
        userId: alice,
        partIndex: 0,
        position,
        response: { type: 'single_select', optionId: 'a' },
      }));
    }
    for (let position = 2; position < 7; position += 1) {
      (await recordResponse(db, {
        attemptId,
        userId: alice,
        partIndex: 0,
        position,
        response: { type: 'single_select', optionId: 'd' },
      }));
    }

    (await submitAttempt(db, { attemptId, userId: alice }));
    const result = (await getResult(db, attemptId, alice));

    expect(BOCCONI.scoring.pointsIncorrect).toBe(-0.2);
    expect(result?.totals.correct).toBe(2);
    expect(result?.totals.incorrect).toBe(5);
    expect(result?.totals.omitted).toBe(3);
    expect(result?.totals.pointsEarned).toBeCloseTo(1, 5);
  });

  it('records a methodology block that separates official facts from our approximation', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));
    (await submitAttempt(db, { attemptId, userId: alice }));

    const result = (await getResult(db, attemptId, alice));
    const methodology = result?.methodology as {
      officialFacts: Record<string, unknown>;
      ourApproximation: Record<string, string>;
      notProvided: Record<string, string | null>;
    };

    expect(methodology.officialFacts).toBeDefined();
    expect(methodology.ourApproximation.fidelity).toBeDefined();
    // We must always say why there is no scaled score.
    expect(methodology.notProvided.scaledScore).toBeTruthy();
    expect(methodology.notProvided.percentiles).toContain('do not report percentiles');
    expect(result?.breakdown).toBeDefined();
  });

  it('is idempotent: submitting twice does not score twice', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));
    (await recordResponse(db, {
      attemptId,
      userId: alice,
      partIndex: 0,
      position: 0,
      response: { type: 'single_select', optionId: 'a' },
    }));

    const first = (await submitAttempt(db, { attemptId, userId: alice }));
    const second = (await submitAttempt(db, { attemptId, userId: alice }));

    expect(first.alreadySubmitted).toBe(false);
    expect(second.alreadySubmitted).toBe(true);

    const rows = (await db
      .prepare('SELECT COUNT(*) AS n FROM attempt_results WHERE attempt_id = ?')
      .get(attemptId)) as { n: number };
    expect(rows.n).toBe(1);
  });

  it('refuses to accept an answer after submission', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));
    (await submitAttempt(db, { attemptId, userId: alice }));

    (await expect(async () =>
      (await recordResponse(db, {
        attemptId,
        userId: alice,
        partIndex: 0,
        position: 0,
        response: { type: 'single_select', optionId: 'a' },
      })),
    ).rejects.toThrowError(AttemptError));
  });

  it('populates the review queue with what was missed', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));
    (await recordResponse(db, {
      attemptId,
      userId: alice,
      partIndex: 0,
      position: 0,
      response: { type: 'single_select', optionId: 'a' },
    }));
    (await recordResponse(db, {
      attemptId,
      userId: alice,
      partIndex: 0,
      position: 1,
      response: { type: 'single_select', optionId: 'c' },
    }));
    (await submitAttempt(db, { attemptId, userId: alice }));

    const queue = (await db
      .prepare('SELECT question_id, last_result, interval_days FROM review_queue WHERE user_id = ?')
      .all(alice)) as Array<{ question_id: string; last_result: string; interval_days: number }>;

    expect(queue).toHaveLength(10);
    const wrong = queue.filter((row) => row.last_result === 'incorrect');
    const omitted = queue.filter((row) => row.last_result === 'omitted');
    expect(wrong).toHaveLength(1);
    expect(omitted).toHaveLength(8);
    // A missed question comes back tomorrow.
    expect(wrong[0].interval_days).toBe(1);
  });
});

describe('server-authoritative timing', () => {
  it('expires a timed attempt whose deadline has passed, scoring blanks as omitted', async () => {
    (await seedQuestions(db, SAT, { perDomain: 30 }));
    const start = new Date('2026-09-22T10:00:00.000Z');

    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'timed-math-module-1',
      now: start,
    }));

    const live = (await getAttemptState(db, attemptId, alice, new Date('2026-09-22T10:10:00.000Z')));
    expect(live.status).toBe('in_progress');
    expect(live.remainingSeconds).toBeGreaterThan(0);

    // The module is 35 minutes; come back an hour later.
    const after = (await getAttemptState(db, attemptId, alice, new Date('2026-09-22T11:00:00.000Z')));
    expect(after.status).toBe('expired');
    expect(after.remainingSeconds).toBe(0);

    const result = (await getResult(db, attemptId, alice));
    expect(result?.totals.omitted).toBe(22);
    expect(result?.totals.correct).toBe(0);
  });

  it('rejects an answer written after the deadline', async () => {
    (await seedQuestions(db, SAT, { perDomain: 30 }));
    const start = new Date('2026-09-22T10:00:00.000Z');
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'timed-math-module-1',
      now: start,
    }));

    (await expect(async () =>
      (await recordResponse(db, {
        attemptId,
        userId: alice,
        partIndex: 0,
        position: 0,
        response: { type: 'single_select', optionId: 'a' },
        now: new Date('2026-09-22T11:00:00.000Z'),
      })),
    ).rejects.toThrowError(AttemptError));
  });

  it('accepts an answer written just inside the deadline', async () => {
    (await seedQuestions(db, SAT, { perDomain: 30 }));
    const start = new Date('2026-09-22T10:00:00.000Z');
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'timed-math-module-1',
      now: start,
    }));

    const result = (await recordResponse(db, {
      attemptId,
      userId: alice,
      partIndex: 0,
      position: 0,
      response: { type: 'single_select', optionId: 'a' },
      now: new Date('2026-09-22T10:34:59.000Z'),
    }));
    expect(result.saved).toBe(true);
  });
});

describe('navigation enforcement', () => {
  it('refuses to answer a question on a screen already committed (Bocconi)', async () => {
    (await seedQuestions(db, BOCCONI, { perDomain: 20 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: BOCCONI.examKey,
      blueprintId: 'timed-online-test',
    }));

    // Answer the first screen (positions 0-2), then move to position 5.
    for (const position of [0, 1, 2]) {
      (await recordResponse(db, {
        attemptId,
        userId: alice,
        partIndex: 0,
        position,
        response: { type: 'single_select', optionId: 'a' },
      }));
    }
    (await recordResponse(db, {
      attemptId,
      userId: alice,
      partIndex: 0,
      position: 5,
      response: { type: 'single_select', optionId: 'a' },
    }));

    // Position 1 is now two screens back and must be locked.
    (await expect(async () =>
      (await recordResponse(db, {
        attemptId,
        userId: alice,
        partIndex: 0,
        position: 1,
        response: { type: 'single_select', optionId: 'b' },
      })),
    ).rejects.toThrowError(AttemptError));

    const stored = (await db
      .prepare('SELECT response_json FROM attempt_items WHERE attempt_id = ? AND position = 1')
      .get(attemptId)) as { response_json: string };
    expect(JSON.parse(stored.response_json)).toEqual({ type: 'single_select', optionId: 'a' });
  });

  it('rejects a response whose shape does not match the question', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));

    (await expect(async () =>
      (await recordResponse(db, {
        attemptId,
        userId: alice,
        partIndex: 0,
        position: 0,
        response: { type: 'numeric_entry', raw: '42' },
      })),
    ).rejects.toThrowError(AttemptError));
  });
});

describe('content immutability', () => {
  it('scores against the question version the learner actually saw', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));

    (await recordResponse(db, {
      attemptId,
      userId: alice,
      partIndex: 0,
      position: 0,
      response: { type: 'single_select', optionId: 'a' },
    }));

    // An editor later publishes a NEW version with a different key. The old
    // version row, which the attempt references, is untouched.
    const item = (await db
      .prepare('SELECT question_id, question_version_id FROM attempt_items WHERE attempt_id = ? AND position = 0')
      .get(attemptId)) as { question_id: string; question_version_id: string };

    (await db.prepare(
      `INSERT INTO question_versions (
         id, question_id, version, exam_key, section_key, domain_slug, skill_slug, subskill_slug,
         response_type, difficulty, difficulty_basis, stem_md, instructions_md, options_json,
         correct_json, explanation_md, distractor_rationale_json, estimated_seconds,
         stimulus_id, stimulus_version, accessibility_text, provenance, rights_status,
         author, reviewer, reviewed_at, review_notes, state, content_hash, created_at
       )
       SELECT 'v2-' || id, question_id, 2, exam_key, section_key, domain_slug, skill_slug, subskill_slug,
              response_type, difficulty, difficulty_basis, 'Edited stem', instructions_md, options_json,
              '{"type":"single_select","optionId":"d"}', explanation_md, distractor_rationale_json,
              estimated_seconds, stimulus_id, stimulus_version, accessibility_text, provenance,
              rights_status, author, reviewer, reviewed_at, review_notes, state, 'newhash', created_at
       FROM question_versions WHERE id = ?`,
    ).run(item.question_version_id));
    (await db.prepare('UPDATE questions SET current_version = 2 WHERE id = ?').run(item.question_id));

    (await submitAttempt(db, { attemptId, userId: alice }));
    const result = (await getResult(db, attemptId, alice));

    // Still correct under the version that was administered.
    expect(result?.totals.correct).toBe(1);
  });
});

describe('multi-part attempts', () => {
  it('opens the next part only when the current one is submitted', async () => {
    (await seedQuestions(db, SAT, { perDomain: 30 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'diagnostic',
    }));

    const initial = (await getAttemptState(db, attemptId, alice));
    expect(initial.parts.length).toBeGreaterThan(1);
    expect(initial.parts[0].status).toBe('in_progress');
    expect(initial.parts[1].status).toBe('pending');

    // Answering in a part that has not started must be refused.
    (await expect(async () =>
      (await recordResponse(db, {
        attemptId,
        userId: alice,
        partIndex: 1,
        position: 0,
        response: { type: 'single_select', optionId: 'a' },
      })),
    ).rejects.toThrowError(AttemptError));

    const outcome = (await submitPart(db, { attemptId, userId: alice, partIndex: 0 }));
    expect(outcome.advancedToPartIndex).toBe(1);
    expect(outcome.attemptSubmitted).toBe(false);

    const advanced = (await getAttemptState(db, attemptId, alice));
    expect(advanced.parts[0].status).toBe('submitted');
    expect(advanced.parts[1].status).toBe('in_progress');
    expect(advanced.currentPartIndex).toBe(1);
  });

  it('finalises the attempt after the last part', async () => {
    (await seedQuestions(db, SAT, { perDomain: 30 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'diagnostic',
    }));

    const state = (await getAttemptState(db, attemptId, alice));
    for (let partIndex = 0; partIndex < state.parts.length; partIndex += 1) {
      const outcome = (await submitPart(db, { attemptId, userId: alice, partIndex }));
      if (partIndex === state.parts.length - 1) {
        expect(outcome.attemptSubmitted).toBe(true);
      }
    }

    const finished = (await getAttemptState(db, attemptId, alice));
    expect(finished.status).toBe('submitted');
    expect((await getResult(db, attemptId, alice))).not.toBeNull();
  });
});

describe('finalise', () => {
  it('is safe to call twice', async () => {
    (await seedQuestions(db, SAT, { perDomain: 6 }));
    const { attemptId } = (await startAttempt(db, {
      userId: alice,
      examKey: SAT.examKey,
      blueprintId: 'practice',
    }));
    (await finalise(db, attemptId, alice));
    (await finalise(db, attemptId, alice));

    const rows = (await db
      .prepare('SELECT COUNT(*) AS n FROM attempt_results WHERE attempt_id = ?')
      .get(attemptId)) as { n: number };
    expect(rows.n).toBe(1);
  });
});

it('finalises overlapping submissions exactly once', async () => {
  await seedQuestions(db, SAT, { perDomain: 6 });
  const { attemptId } = await startAttempt(db, { userId: alice, examKey: SAT.examKey, blueprintId: 'practice' });
  await Promise.all([finalise(db, attemptId, alice), finalise(db, attemptId, alice)]);
  expect(await db.prepare('SELECT COUNT(*) AS n FROM attempt_results WHERE attempt_id = ?').get(attemptId)).toEqual({ n: 1 });
  expect(await db.prepare("SELECT COUNT(*) AS n FROM attempt_events WHERE attempt_id = ? AND type = 'attempt.finalised'").get(attemptId)).toEqual({ n: 1 });
});
