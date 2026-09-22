import type { AnswerKey, NumericAccepted, Response, ScoreOutcome, ScoringPolicy } from './types';

/**
 * Pure scoring. No database, no clock, no configuration lookups - everything it
 * needs is an argument, so every rule below is directly testable.
 *
 * Independent review is required before any change here ships
 * (see docs/CONTRACTS.md).
 */

const FLOAT_EPSILON = 1e-9;

export class ResponseTypeMismatchError extends Error {
  constructor(keyType: string, responseType: string) {
    super(`Response type "${responseType}" cannot be scored against answer key type "${keyType}".`);
    this.name = 'ResponseTypeMismatchError';
  }
}

/**
 * Parses a learner-entered numeric string.
 *
 * Accepts plain decimals, signed values, and fractions such as "-3/4".
 * Returns null when the entry is not a number we can compare, which is scored
 * as incorrect rather than crashing the submission.
 */
export function parseNumericEntry(raw: string): number | null {
  const trimmed = raw.trim().replace(/\s+/g, '').replace(/,/g, '');
  if (trimmed === '') return null;

  const fraction = /^(-?)(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(trimmed);
  if (fraction) {
    const sign = fraction[1] === '-' ? -1 : 1;
    const numerator = Number(fraction[2]);
    const denominator = Number(fraction[3]);
    if (denominator === 0) return null;
    return sign * (numerator / denominator);
  }

  if (!/^-?(\d+(\.\d*)?|\.\d+)$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

function matchesNumeric(value: number, accepted: NumericAccepted): boolean {
  switch (accepted.kind) {
    case 'exact':
      return Math.abs(value - accepted.value) <= FLOAT_EPSILON;
    case 'tolerance':
      return Math.abs(value - accepted.value) <= accepted.tolerance + FLOAT_EPSILON;
    case 'range':
      return value >= accepted.min - FLOAT_EPSILON && value <= accepted.max + FLOAT_EPSILON;
  }
}

function sameSet(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const left = new Set(a);
  const right = new Set(b);
  // A repeated option is not a valid selection: ["a","a"] must not satisfy a
  // two-option key, even though it has the right length and every member is
  // present in the key.
  if (left.size !== a.length || right.size !== b.length) return false;
  for (const value of right) {
    if (!left.has(value)) return false;
  }
  return true;
}

/**
 * True when a response carries no actual answer. Such an item is *omitted*,
 * which matters: several exams score omissions differently from wrong answers
 * (the Bocconi test penalises wrong answers but not omissions).
 */
export function isEmptyResponse(response: Response | null | undefined): boolean {
  if (response === null || response === undefined) return true;
  switch (response.type) {
    case 'single_select':
      return response.optionId.trim() === '';
    case 'multi_select':
      return response.optionIds.length === 0;
    case 'numeric_entry':
      return response.raw.trim() === '';
    case 'quantitative_comparison':
    case 'data_sufficiency':
      return false; // a choice is always one of the fixed letters
    case 'two_part':
      return response.selections.length === 0;
    case 'essay':
      return response.text.trim() === '';
  }
}

/** Decides only correctness, ignoring the exam's points policy. */
export function isResponseCorrect(key: AnswerKey, response: Response): boolean {
  if (key.type !== response.type) {
    throw new ResponseTypeMismatchError(key.type, response.type);
  }

  switch (key.type) {
    case 'single_select':
      return response.type === 'single_select' && response.optionId === key.optionId;

    case 'multi_select':
      return response.type === 'multi_select' && sameSet(key.optionIds, response.optionIds);

    case 'numeric_entry': {
      if (response.type !== 'numeric_entry') return false;
      const normalised = response.raw.trim().replace(/\s+/g, '');
      if (key.acceptedStrings.some((s) => s.trim().replace(/\s+/g, '') === normalised)) {
        return true;
      }
      const value = parseNumericEntry(response.raw);
      if (value === null) return false;
      return key.accepted.some((accepted) => matchesNumeric(value, accepted));
    }

    case 'quantitative_comparison':
      return response.type === 'quantitative_comparison' && response.choice === key.choice;

    case 'data_sufficiency':
      return response.type === 'data_sufficiency' && response.choice === key.choice;

    case 'two_part': {
      if (response.type !== 'two_part') return false;
      if (response.selections.length !== key.selections.length) return false;
      const expected = new Map(key.selections.map((s) => [s.columnId, s.optionId]));
      const seen = new Set<string>();
      for (const selection of response.selections) {
        if (seen.has(selection.columnId)) return false; // two answers for one column
        seen.add(selection.columnId);
        if (expected.get(selection.columnId) !== selection.optionId) return false;
      }
      return seen.size === expected.size;
    }

    case 'essay':
      return false; // never auto-scored; callers must check the status instead
  }
}

/**
 * Scores one item under the exam's scoring policy.
 *
 * - An absent or empty response is `omitted` and earns `pointsOmitted`,
 *   which is NOT the same as a wrong answer on exams with negative marking.
 * - Essays are `not_auto_scored` and contribute zero possible points, so they
 *   never distort an accuracy figure.
 */
export function scoreResponse(
  key: AnswerKey,
  response: Response | null | undefined,
  policy: ScoringPolicy,
): ScoreOutcome {
  if (key.type === 'essay') {
    return { status: 'not_auto_scored', points: 0, pointsPossible: 0 };
  }

  if (isEmptyResponse(response)) {
    return { status: 'omitted', points: policy.pointsOmitted, pointsPossible: policy.pointsCorrect };
  }

  const correct = isResponseCorrect(key, response as Response);
  return correct
    ? { status: 'correct', points: policy.pointsCorrect, pointsPossible: policy.pointsCorrect }
    : { status: 'incorrect', points: policy.pointsIncorrect, pointsPossible: policy.pointsCorrect };
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

export interface ScoredItem {
  partIndex: number;
  sectionKey: string;
  domainSlug: string;
  skillSlug: string;
  outcome: ScoreOutcome;
  timeMs: number;
}

export interface GroupBreakdown {
  key: string;
  label: string;
  correct: number;
  incorrect: number;
  omitted: number;
  notAutoScored: number;
  answered: number;
  total: number;
  /** correct / (total - notAutoScored). 0 when nothing is auto-scorable. */
  accuracy: number;
  pointsEarned: number;
  pointsPossible: number;
  totalTimeMs: number;
  medianTimeMs: number;
}

export interface AttemptTotals {
  correct: number;
  incorrect: number;
  omitted: number;
  notAutoScored: number;
  total: number;
  accuracy: number;
  pointsEarned: number;
  pointsPossible: number;
  totalTimeMs: number;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

function round(value: number, places = 6): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function summarise(key: string, label: string, items: ScoredItem[]): GroupBreakdown {
  let correct = 0;
  let incorrect = 0;
  let omitted = 0;
  let notAutoScored = 0;
  let pointsEarned = 0;
  let pointsPossible = 0;
  let totalTimeMs = 0;

  for (const item of items) {
    switch (item.outcome.status) {
      case 'correct':
        correct += 1;
        break;
      case 'incorrect':
        incorrect += 1;
        break;
      case 'omitted':
        omitted += 1;
        break;
      case 'not_auto_scored':
        notAutoScored += 1;
        break;
    }
    pointsEarned += item.outcome.points;
    pointsPossible += item.outcome.pointsPossible;
    totalTimeMs += item.timeMs;
  }

  const scorable = items.length - notAutoScored;
  return {
    key,
    label,
    correct,
    incorrect,
    omitted,
    notAutoScored,
    answered: correct + incorrect,
    total: items.length,
    accuracy: scorable > 0 ? round(correct / scorable) : 0,
    pointsEarned: round(pointsEarned),
    pointsPossible: round(pointsPossible),
    totalTimeMs,
    medianTimeMs: median(items.map((i) => i.timeMs)),
  };
}

export interface AttemptScore {
  totals: AttemptTotals;
  byPart: GroupBreakdown[];
  bySection: GroupBreakdown[];
  byDomain: GroupBreakdown[];
  bySkill: GroupBreakdown[];
}

export function scoreAttempt(
  items: ScoredItem[],
  labels: { domains?: Record<string, string>; skills?: Record<string, string>; sections?: Record<string, string> } = {},
): AttemptScore {
  const group = <K extends string | number>(pick: (i: ScoredItem) => K): Map<K, ScoredItem[]> => {
    const map = new Map<K, ScoredItem[]>();
    for (const item of items) {
      const key = pick(item);
      const bucket = map.get(key);
      if (bucket) bucket.push(item);
      else map.set(key, [item]);
    }
    return map;
  };

  const overall = summarise('total', 'Total', items);

  return {
    totals: {
      correct: overall.correct,
      incorrect: overall.incorrect,
      omitted: overall.omitted,
      notAutoScored: overall.notAutoScored,
      total: overall.total,
      accuracy: overall.accuracy,
      pointsEarned: overall.pointsEarned,
      pointsPossible: overall.pointsPossible,
      totalTimeMs: overall.totalTimeMs,
    },
    byPart: [...group((i) => i.partIndex).entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([index, group_]) => summarise(String(index), `Part ${index + 1}`, group_)),
    bySection: [...group((i) => i.sectionKey).entries()].map(([key, group_]) =>
      summarise(key, labels.sections?.[key] ?? key, group_),
    ),
    byDomain: [...group((i) => i.domainSlug).entries()].map(([key, group_]) =>
      summarise(key, labels.domains?.[key] ?? key, group_),
    ),
    bySkill: [...group((i) => i.skillSlug).entries()].map(([key, group_]) =>
      summarise(key, labels.skills?.[key] ?? key, group_),
    ),
  };
}
