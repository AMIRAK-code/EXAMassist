import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import { incorrectPoints } from '@/lib/assessment/score';
import { getResult, recordResponse, scoringItem, startAttempt, submitAttempt } from '@/lib/attempts/service';
import { loadContent } from '@/lib/content/loader';
import { requireExamConfig } from '@/lib/exams/registry';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * Bocconi's published exception: a wrong answer to a critical-thinking
 * question offered with only three options costs 0.33, not 0.2. Until
 * October 2026 the engine scored every wrong answer at -0.2 while the scoring
 * page said the heavier penalty was applied; these tests keep the two in step.
 */

const UG = requireExamConfig('bocconi-undergraduate');
const LAW = requireExamConfig('bocconi-law');
// Loaded once, outside any test's timeout, as the other bank-wide tests do.
const { questions } = loadContent();

describe('the three-option penalty rule', () => {
  it('applies -0.33 only to three-option critical-thinking items', () => {
    expect(incorrectPoints(UG.scoring, { domainSlug: 'bocconi-ug-critical-thinking', optionCount: 3 })).toBe(-0.33);
    expect(incorrectPoints(UG.scoring, { domainSlug: 'bocconi-ug-critical-thinking', optionCount: 4 })).toBe(-0.2);
    expect(incorrectPoints(UG.scoring, { domainSlug: 'bocconi-ug-mathematics', optionCount: 3 })).toBe(-0.2);
    expect(incorrectPoints(LAW.scoring, { domainSlug: 'law-logic-and-critical-thinking', optionCount: 3 })).toBe(-0.33);
    // Verbal reasoning is not the critical-thinking area, whatever its option count.
    expect(incorrectPoints(LAW.scoring, { domainSlug: 'law-verbal-reasoning', optionCount: 3 })).toBe(-0.2);
    // No item facts: the exam-level rule.
    expect(incorrectPoints(UG.scoring)).toBe(-0.2);
  });

  it('leaves every exam without an override unchanged', () => {
    const sat = requireExamConfig('digital-sat');
    expect(incorrectPoints(sat.scoring, { domainSlug: 'anything', optionCount: 3 })).toBe(sat.scoring.pointsIncorrect);
  });

  it('reaches every published three-option critical-thinking item in the bank', () => {
    const heavy = questions
      .map(({ question }) => question)
      .filter((q) => q.state === 'published' && (q.examKey === UG.examKey || q.examKey === LAW.examKey))
      .filter((q) => {
        const config = q.examKey === UG.examKey ? UG : LAW;
        return incorrectPoints(config.scoring, { domainSlug: q.domainSlug, optionCount: q.options.length }) === -0.33;
      });
    // Every match is a three-option item in a critical-thinking domain, and there are some.
    expect(heavy.length).toBeGreaterThan(0);
    for (const q of heavy) {
      expect(q.options).toHaveLength(3);
      expect(['bocconi-ug-critical-thinking', 'law-logic-and-critical-thinking']).toContain(q.domainSlug);
    }
  });

  it('reads the item facts from a stored question version', () => {
    expect(
      scoringItem({ domain_slug: 'bocconi-ug-critical-thinking', options_json: JSON.stringify([{}, {}, {}]) }),
    ).toEqual({ domainSlug: 'bocconi-ug-critical-thinking', optionCount: 3 });
    expect(scoringItem({ domain_slug: 'x', options_json: null })).toEqual({ domainSlug: 'x', optionCount: 0 });
  });
});

describe('scoring a Bocconi session', () => {
  let db: Db;
  let learner: string;

  beforeEach(async () => {
    db = await createTestDb();
    learner = await createUser(db);
    await seedQuestions(db, UG, { perDomain: 6 });
    // Make the critical-thinking and mathematics items three-option.
    const three = JSON.stringify([
      { id: 'a', label: 'A', textMd: 'True' },
      { id: 'b', label: 'B', textMd: 'False' },
      { id: 'c', label: 'C', textMd: 'Cannot be deduced' },
    ]);
    await db
      .prepare(`UPDATE question_versions SET options_json = ? WHERE domain_slug IN ('bocconi-ug-critical-thinking', 'bocconi-ug-mathematics')`)
      .run(three);
  });

  async function wrongAnswersIn(domain: string): Promise<number> {
    const { attemptId } = await startAttempt(db, {
      userId: learner,
      examKey: UG.examKey,
      blueprintId: 'practice',
      overrides: { domains: [domain], length: 5 },
    });
    for (let position = 0; position < 5; position += 1) {
      await recordResponse(db, {
        attemptId,
        userId: learner,
        partIndex: 0,
        position,
        response: { type: 'single_select', optionId: 'c' },
      });
    }
    await submitAttempt(db, { attemptId, userId: learner });
    const result = await getResult(db, attemptId, learner);
    expect(result?.totals.incorrect).toBe(5);
    return result?.totals.pointsEarned ?? Number.NaN;
  }

  it('charges 0.33 for each wrong three-option critical-thinking answer', async () => {
    expect(await wrongAnswersIn('bocconi-ug-critical-thinking')).toBeCloseTo(-1.65, 5);
  });

  it('charges 0.2 for a wrong three-option answer outside critical thinking', async () => {
    expect(await wrongAnswersIn('bocconi-ug-mathematics')).toBeCloseTo(-1, 5);
  });
});
