import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import {
  decideRoute,
  getAttemptState,
  recordResponse,
  startAttempt,
  submitPart,
} from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * Adaptive routing, end to end.
 *
 * Only the SAT simulation has the structure routing needs: a routing part whose
 * result decides the composition of the part that follows it. The rule is OURS
 * — College Board does not publish its thresholds — so the test also asserts
 * that the decision and its disclosure are persisted, because the results page
 * has to be able to say whose rule produced the second module.
 */

const SAT = requireExamConfig('digital-sat');

let db: Db;
let learner: string;

beforeEach(() => {
  db = createTestDb();
  learner = createUser(db);
});

describe('the routing rule itself', () => {
  const adaptive = {
    enabled: true as const,
    kind: 'threshold_two_stage' as const,
    upperThreshold: 0.6,
    routesTo: { lower: 'lower-panel', upper: 'upper-panel' },
    disclosure: 'This threshold is ours, not College Board’s.',
  };

  it('routes upward at and above the threshold', () => {
    expect(decideRoute(0.6, adaptive)?.route).toBe('upper');
    expect(decideRoute(1, adaptive)?.route).toBe('upper');
  });

  it('routes downward below the threshold', () => {
    expect(decideRoute(0.59, adaptive)?.route).toBe('lower');
    expect(decideRoute(0, adaptive)?.route).toBe('lower');
  });

  it('carries the disclosure with the decision', () => {
    const decision = decideRoute(0.8, adaptive);
    expect(decision?.routeLabel).toBe('upper-panel');
    expect(decision?.threshold).toBe(0.6);
    expect(decision?.disclosure).toContain('ours');
  });

  it('returns nothing when routing is switched off', () => {
    expect(decideRoute(0.9, { enabled: false, reason: 'not published' })).toBeNull();
  });
});

describe('routing inside a real attempt', () => {
  function startSimulation() {
    // The full simulation needs 98 distinct items across four modules.
    seedQuestions(db, SAT, { perDomain: 40 });
    return startAttempt(db, {
      userId: learner,
      examKey: SAT.examKey,
      blueprintId: 'simulation-full',
    }).attemptId;
  }

  function answerPart(attemptId: string, partIndex: number, correctCount: number) {
    const state = getAttemptState(db, attemptId, learner);
    const part = state.parts.find((p) => p.partIndex === partIndex);
    if (!part) throw new Error(`part ${partIndex} missing`);

    part.items.forEach((item, index) => {
      recordResponse(db, {
        attemptId,
        userId: learner,
        partIndex,
        position: item.position,
        // "a" is the seeded correct answer; "b" is wrong.
        response: { type: 'single_select', optionId: index < correctCount ? 'a' : 'b' },
      });
    });
    return part.items.length;
  }

  it('records an upward route after a strong routing module', () => {
    const attemptId = startSimulation();
    const total = answerPart(attemptId, 0, 27); // all correct
    expect(total).toBe(27);

    submitPart(db, { attemptId, userId: learner, partIndex: 0 });

    const state = getAttemptState(db, attemptId, learner);
    const routed = state.parts[1];
    expect(routed.status).toBe('in_progress');
    expect(routed.routing).not.toBeNull();
    expect(routed.routing?.route).toBe('upper');
    expect(routed.routing?.accuracy).toBe(1);
    expect(routed.routing?.disclosure.length).toBeGreaterThan(20);
  });

  it('records a downward route after a weak routing module', () => {
    const attemptId = startSimulation();
    answerPart(attemptId, 0, 0); // all wrong
    submitPart(db, { attemptId, userId: learner, partIndex: 0 });

    const routed = getAttemptState(db, attemptId, learner).parts[1];
    expect(routed.routing?.route).toBe('lower');
    expect(routed.routing?.accuracy).toBe(0);
  });

  it('actually changes the difficulty of the routed module', () => {
    const attemptId = startSimulation();
    answerPart(attemptId, 0, 27);
    submitPart(db, { attemptId, userId: learner, partIndex: 0 });

    const hardCount = (
      db
        .prepare(
          `SELECT COUNT(*) AS n
           FROM attempt_items ai
           JOIN question_versions qv ON qv.id = ai.question_version_id
           WHERE ai.attempt_id = ? AND ai.part_index = 1 AND qv.difficulty = 'hard'`,
        )
        .get(attemptId) as { n: number }
    ).n;

    // The upper route asks for roughly half hard items; the pool is an even
    // third of each difficulty, so a meaningful share must be hard.
    expect(hardCount).toBeGreaterThan(8);
  });

  it('never reuses a question from the routing module in the routed module', () => {
    const attemptId = startSimulation();
    answerPart(attemptId, 0, 27);
    submitPart(db, { attemptId, userId: learner, partIndex: 0 });

    const rows = db
      .prepare('SELECT part_index, question_id FROM attempt_items WHERE attempt_id = ? AND part_index IN (0, 1)')
      .all(attemptId) as Array<{ part_index: number; question_id: string }>;

    const first = new Set(rows.filter((r) => r.part_index === 0).map((r) => r.question_id));
    const second = rows.filter((r) => r.part_index === 1).map((r) => r.question_id);

    expect(second.length).toBe(27);
    for (const id of second) expect(first.has(id)).toBe(false);
  });

  it('persists the routing decision so results can attribute it to us', () => {
    const attemptId = startSimulation();
    answerPart(attemptId, 0, 27);
    submitPart(db, { attemptId, userId: learner, partIndex: 0 });

    const stored = db
      .prepare('SELECT routing_json FROM attempt_parts WHERE attempt_id = ? AND part_index = 1')
      .get(attemptId) as { routing_json: string | null };

    expect(stored.routing_json).not.toBeNull();
    const decision = JSON.parse(stored.routing_json as string) as Record<string, unknown>;
    expect(decision.route).toBe('upper');
    expect(typeof decision.disclosure).toBe('string');

    // The routing event is in the audit trail too.
    const events = db
      .prepare("SELECT payload_json FROM attempt_events WHERE attempt_id = ? AND type = 'part.started'")
      .all(attemptId) as Array<{ payload_json: string }>;
    expect(events.some((e) => e.payload_json.includes('"route"'))).toBe(true);
  });

  it('leaves a non-adaptive part with no routing record', () => {
    seedQuestions(db, SAT, { perDomain: 40 });
    const attemptId = startAttempt(db, {
      userId: learner,
      examKey: SAT.examKey,
      blueprintId: 'diagnostic',
    }).attemptId;

    submitPart(db, { attemptId, userId: learner, partIndex: 0 });
    const state = getAttemptState(db, attemptId, learner);
    expect(state.parts[1].routing).toBeNull();
  });
});
