import { describe, expect, it } from 'vitest';
import {
  ResponseTypeMismatchError,
  isEmptyResponse,
  isResponseCorrect,
  parseNumericEntry,
  scoreAttempt,
  scoreResponse,
  type ScoredItem,
} from '@/lib/assessment/score';
import type { AnswerKey, Response, ScoringPolicy } from '@/lib/assessment/types';

/** No penalty for a wrong answer - SAT, ACT, LSAT, GMAT, GRE. */
const NO_PENALTY: ScoringPolicy = {
  pointsCorrect: 1,
  pointsIncorrect: 0,
  pointsOmitted: 0,
  multiSelectGrading: 'all_or_nothing',
  officialScale: null,
  scaledEstimate: { enabled: false, reason: 'Equating tables are not published.' },
  notes: [],
};

/** Verified Bocconi rule: +1 correct, 0 omitted, -0.2 wrong. */
const BOCCONI: ScoringPolicy = {
  ...NO_PENALTY,
  pointsIncorrect: -0.2,
};

/** The published exception for three-option critical-thinking items. */
const BOCCONI_THREE_OPTION: ScoringPolicy = {
  ...NO_PENALTY,
  pointsIncorrect: -0.33,
};

describe('parseNumericEntry', () => {
  it('reads plain and signed decimals', () => {
    expect(parseNumericEntry('12')).toBe(12);
    expect(parseNumericEntry('-4.5')).toBe(-4.5);
    expect(parseNumericEntry('  0.25 ')).toBe(0.25);
    expect(parseNumericEntry('.5')).toBe(0.5);
  });

  it('reads fractions, including negatives', () => {
    expect(parseNumericEntry('3/4')).toBe(0.75);
    expect(parseNumericEntry('-3/4')).toBe(-0.75);
    expect(parseNumericEntry('7 / 2')).toBe(3.5);
  });

  it('rejects entries it cannot compare rather than guessing', () => {
    expect(parseNumericEntry('')).toBeNull();
    expect(parseNumericEntry('   ')).toBeNull();
    expect(parseNumericEntry('abc')).toBeNull();
    expect(parseNumericEntry('1/0')).toBeNull();
    expect(parseNumericEntry('5x')).toBeNull();
    expect(parseNumericEntry('1e5')).toBeNull();
    expect(parseNumericEntry('--3')).toBeNull();
  });
});

describe('isEmptyResponse', () => {
  it('treats absent and blank responses as omitted', () => {
    expect(isEmptyResponse(null)).toBe(true);
    expect(isEmptyResponse(undefined)).toBe(true);
    expect(isEmptyResponse({ type: 'multi_select', optionIds: [] })).toBe(true);
    expect(isEmptyResponse({ type: 'numeric_entry', raw: '   ' })).toBe(true);
    expect(isEmptyResponse({ type: 'essay', text: '' })).toBe(true);
    expect(isEmptyResponse({ type: 'two_part', selections: [] })).toBe(true);
  });

  it('treats a real selection as answered', () => {
    expect(isEmptyResponse({ type: 'single_select', optionId: 'b' })).toBe(false);
    expect(isEmptyResponse({ type: 'numeric_entry', raw: '0' })).toBe(false);
    expect(isEmptyResponse({ type: 'data_sufficiency', choice: 'E' })).toBe(false);
  });
});

describe('single select', () => {
  const key: AnswerKey = { type: 'single_select', optionId: 'c' };

  it('scores a correct answer', () => {
    const outcome = scoreResponse(key, { type: 'single_select', optionId: 'c' }, NO_PENALTY);
    expect(outcome).toEqual({ status: 'correct', points: 1, pointsPossible: 1 });
  });

  it('scores a wrong answer', () => {
    const outcome = scoreResponse(key, { type: 'single_select', optionId: 'a' }, NO_PENALTY);
    expect(outcome).toEqual({ status: 'incorrect', points: 0, pointsPossible: 1 });
  });

  it('scores an omission', () => {
    const outcome = scoreResponse(key, null, NO_PENALTY);
    expect(outcome).toEqual({ status: 'omitted', points: 0, pointsPossible: 1 });
  });
});

describe('negative marking (Bocconi)', () => {
  const key: AnswerKey = { type: 'single_select', optionId: 'b' };

  it('subtracts 0.2 for a wrong answer', () => {
    expect(scoreResponse(key, { type: 'single_select', optionId: 'a' }, BOCCONI)).toEqual({
      status: 'incorrect',
      points: -0.2,
      pointsPossible: 1,
    });
  });

  it('does NOT penalise an omission - the distinction that makes guessing a real decision', () => {
    expect(scoreResponse(key, null, BOCCONI)).toEqual({
      status: 'omitted',
      points: 0,
      pointsPossible: 1,
    });
  });

  it('applies the published -0.33 exception for three-option items', () => {
    expect(scoreResponse(key, { type: 'single_select', optionId: 'c' }, BOCCONI_THREE_OPTION)).toEqual({
      status: 'incorrect',
      points: -0.33,
      pointsPossible: 1,
    });
  });

  it('an all-wrong attempt produces a negative total, which the engine must not clamp', () => {
    const items: ScoredItem[] = Array.from({ length: 5 }, (_, i) => ({
      partIndex: 0,
      sectionKey: 'main',
      domainSlug: 'maths',
      skillSlug: 'algebra',
      timeMs: 1000,
      outcome: scoreResponse(key, { type: 'single_select', optionId: 'z' }, BOCCONI),
    }));
    const result = scoreAttempt(items);
    expect(result.totals.pointsEarned).toBe(-1);
    expect(result.totals.accuracy).toBe(0);
  });
});

describe('multi select', () => {
  const key: AnswerKey = { type: 'multi_select', optionIds: ['a', 'c'], grading: 'exact' };

  it('requires the exact set', () => {
    expect(isResponseCorrect(key, { type: 'multi_select', optionIds: ['a', 'c'] })).toBe(true);
    expect(isResponseCorrect(key, { type: 'multi_select', optionIds: ['c', 'a'] })).toBe(true);
  });

  it('gives no credit for a partial selection', () => {
    expect(isResponseCorrect(key, { type: 'multi_select', optionIds: ['a'] })).toBe(false);
  });

  it('gives no credit for a superset', () => {
    expect(isResponseCorrect(key, { type: 'multi_select', optionIds: ['a', 'b', 'c'] })).toBe(false);
  });

  it('rejects a duplicated selection', () => {
    expect(isResponseCorrect(key, { type: 'multi_select', optionIds: ['a', 'a'] })).toBe(false);
  });
});

describe('numeric entry', () => {
  it('accepts equivalent forms of the same value', () => {
    const key: AnswerKey = {
      type: 'numeric_entry',
      accepted: [{ kind: 'exact', value: 0.75 }],
      acceptedStrings: [],
    };
    for (const raw of ['0.75', '.75', '3/4', '6/8', ' 0.750 ']) {
      expect(isResponseCorrect(key, { type: 'numeric_entry', raw })).toBe(true);
    }
  });

  it('honours a stated tolerance at both edges and just outside', () => {
    const key: AnswerKey = {
      type: 'numeric_entry',
      accepted: [{ kind: 'tolerance', value: 3.14159, tolerance: 0.01 }],
      acceptedStrings: [],
    };
    expect(isResponseCorrect(key, { type: 'numeric_entry', raw: '3.15' })).toBe(true);
    expect(isResponseCorrect(key, { type: 'numeric_entry', raw: '3.13159' })).toBe(true);
    expect(isResponseCorrect(key, { type: 'numeric_entry', raw: '3.16' })).toBe(false);
  });

  it('honours an inclusive range', () => {
    const key: AnswerKey = {
      type: 'numeric_entry',
      accepted: [{ kind: 'range', min: 10, max: 20 }],
      acceptedStrings: [],
    };
    expect(isResponseCorrect(key, { type: 'numeric_entry', raw: '10' })).toBe(true);
    expect(isResponseCorrect(key, { type: 'numeric_entry', raw: '20' })).toBe(true);
    expect(isResponseCorrect(key, { type: 'numeric_entry', raw: '9.99' })).toBe(false);
  });

  it('survives binary floating point', () => {
    const key: AnswerKey = {
      type: 'numeric_entry',
      accepted: [{ kind: 'exact', value: 0.3 }],
      acceptedStrings: [],
    };
    expect(isResponseCorrect(key, { type: 'numeric_entry', raw: '0.3' })).toBe(true);
  });

  it('accepts a literal string form when the item allows it', () => {
    const key: AnswerKey = {
      type: 'numeric_entry',
      accepted: [{ kind: 'exact', value: 1 / 3 }],
      acceptedStrings: ['1/3'],
    };
    expect(isResponseCorrect(key, { type: 'numeric_entry', raw: '1/3' })).toBe(true);
  });

  it('marks unparseable entries wrong, not omitted', () => {
    const key: AnswerKey = {
      type: 'numeric_entry',
      accepted: [{ kind: 'exact', value: 5 }],
      acceptedStrings: [],
    };
    expect(scoreResponse(key, { type: 'numeric_entry', raw: 'five' }, NO_PENALTY).status).toBe('incorrect');
  });
});

describe('quantitative comparison and data sufficiency', () => {
  it('compares the fixed choice letters', () => {
    const qc: AnswerKey = { type: 'quantitative_comparison', choice: 'B' };
    expect(isResponseCorrect(qc, { type: 'quantitative_comparison', choice: 'B' })).toBe(true);
    expect(isResponseCorrect(qc, { type: 'quantitative_comparison', choice: 'D' })).toBe(false);

    const ds: AnswerKey = { type: 'data_sufficiency', choice: 'E' };
    expect(isResponseCorrect(ds, { type: 'data_sufficiency', choice: 'E' })).toBe(true);
    expect(isResponseCorrect(ds, { type: 'data_sufficiency', choice: 'C' })).toBe(false);
  });
});

describe('two part analysis', () => {
  const key: AnswerKey = {
    type: 'two_part',
    selections: [
      { columnId: 'increase', optionId: 'row2' },
      { columnId: 'decrease', optionId: 'row5' },
    ],
  };

  it('needs every column right', () => {
    expect(
      isResponseCorrect(key, {
        type: 'two_part',
        selections: [
          { columnId: 'decrease', optionId: 'row5' },
          { columnId: 'increase', optionId: 'row2' },
        ],
      }),
    ).toBe(true);
  });

  it('rejects one column wrong', () => {
    expect(
      isResponseCorrect(key, {
        type: 'two_part',
        selections: [
          { columnId: 'increase', optionId: 'row2' },
          { columnId: 'decrease', optionId: 'row1' },
        ],
      }),
    ).toBe(false);
  });

  it('rejects two answers for the same column', () => {
    expect(
      isResponseCorrect(key, {
        type: 'two_part',
        selections: [
          { columnId: 'increase', optionId: 'row2' },
          { columnId: 'increase', optionId: 'row5' },
        ],
      }),
    ).toBe(false);
  });
});

describe('essays', () => {
  const key: AnswerKey = { type: 'essay', rubricId: 'gre-issue' };

  it('are never auto-scored and contribute no possible points', () => {
    const outcome = scoreResponse(key, { type: 'essay', text: 'A well argued response.' }, NO_PENALTY);
    expect(outcome).toEqual({ status: 'not_auto_scored', points: 0, pointsPossible: 0 });
  });

  it('do not drag down accuracy', () => {
    const items: ScoredItem[] = [
      {
        partIndex: 0,
        sectionKey: 'aw',
        domainSlug: 'aw-analyze-an-issue',
        skillSlug: 'argument',
        timeMs: 0,
        outcome: scoreResponse(key, { type: 'essay', text: 'x' }, NO_PENALTY),
      },
      {
        partIndex: 1,
        sectionKey: 'verbal',
        domainSlug: 'verbal',
        skillSlug: 'rc',
        timeMs: 0,
        outcome: scoreResponse({ type: 'single_select', optionId: 'a' }, { type: 'single_select', optionId: 'a' }, NO_PENALTY),
      },
    ];
    const result = scoreAttempt(items);
    expect(result.totals.accuracy).toBe(1);
    expect(result.totals.notAutoScored).toBe(1);
    expect(result.totals.pointsPossible).toBe(1);
  });
});

describe('type safety', () => {
  it('refuses to score a response of the wrong shape', () => {
    const key: AnswerKey = { type: 'single_select', optionId: 'a' };
    const response = { type: 'numeric_entry', raw: '1' } as unknown as Response;
    expect(() => isResponseCorrect(key, response)).toThrow(ResponseTypeMismatchError);
  });
});

describe('scoreAttempt breakdowns', () => {
  const mk = (
    partIndex: number,
    sectionKey: string,
    domainSlug: string,
    skillSlug: string,
    status: 'correct' | 'incorrect' | 'omitted',
    timeMs: number,
  ): ScoredItem => ({
    partIndex,
    sectionKey,
    domainSlug,
    skillSlug,
    timeMs,
    outcome:
      status === 'correct'
        ? { status, points: 1, pointsPossible: 1 }
        : status === 'incorrect'
          ? { status, points: 0, pointsPossible: 1 }
          : { status, points: 0, pointsPossible: 1 },
  });

  const items: ScoredItem[] = [
    mk(0, 'math', 'algebra', 'linear-equations', 'correct', 40_000),
    mk(0, 'math', 'algebra', 'linear-equations', 'incorrect', 90_000),
    mk(0, 'math', 'geometry', 'circles', 'omitted', 5_000),
    mk(1, 'verbal', 'reading', 'inference', 'correct', 60_000),
  ];

  it('computes totals', () => {
    const result = scoreAttempt(items);
    expect(result.totals).toMatchObject({
      correct: 2,
      incorrect: 1,
      omitted: 1,
      total: 4,
      pointsEarned: 2,
      pointsPossible: 4,
      accuracy: 0.5,
      totalTimeMs: 195_000,
    });
  });

  it('breaks down by skill with per-skill accuracy', () => {
    const result = scoreAttempt(items);
    const linear = result.bySkill.find((s) => s.key === 'linear-equations');
    expect(linear).toMatchObject({ correct: 1, incorrect: 1, total: 2, accuracy: 0.5 });
    const circles = result.bySkill.find((s) => s.key === 'circles');
    expect(circles).toMatchObject({ omitted: 1, accuracy: 0 });
  });

  it('reports median time per group, which is robust to one very slow item', () => {
    const result = scoreAttempt(items);
    const math = result.byPart.find((p) => p.key === '0');
    expect(math?.medianTimeMs).toBe(40_000);
    expect(math?.totalTimeMs).toBe(135_000);
  });

  it('handles an empty attempt without dividing by zero', () => {
    const result = scoreAttempt([]);
    expect(result.totals.accuracy).toBe(0);
    expect(result.totals.total).toBe(0);
    expect(result.bySkill).toEqual([]);
  });
});
