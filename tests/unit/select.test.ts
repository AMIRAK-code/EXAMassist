import { describe, expect, it } from 'vitest';
import {
  checkBlueprintSufficiency,
  createRng,
  hashSeed,
  selectItems,
  shuffle,
  type PoolItem,
} from '@/lib/assessment/select';
import type { BlueprintPart, SelectionConstraint } from '@/lib/assessment/types';

function item(
  id: string,
  overrides: Partial<PoolItem> = {},
): PoolItem {
  return {
    questionVersionId: `${id}-v1`,
    questionId: id,
    sectionKey: 'math',
    domainSlug: 'algebra',
    skillSlug: 'linear-equations',
    responseType: 'single_select',
    difficulty: 'medium',
    stimulusId: null,
    lastSeenAt: null,
    ...overrides,
  };
}

function constraint(overrides: Partial<SelectionConstraint> = {}): SelectionConstraint {
  return {
    sectionKey: 'math',
    domains: [],
    skills: [],
    responseTypes: [],
    difficultyMix: null,
    allowRepeatsWithinAttempt: false,
    avoidSeenWithinDays: 30,
    ...overrides,
  };
}

const pool20 = Array.from({ length: 20 }, (_, i) => item(`q${i}`));

describe('seeded randomness', () => {
  it('is deterministic for the same seed', () => {
    const a = Array.from({ length: 10 }, createRng('attempt-abc'));
    const b = Array.from({ length: 10 }, createRng('attempt-abc'));
    expect(a).toEqual(b);
  });

  it('differs for different seeds', () => {
    const a = Array.from({ length: 10 }, createRng('attempt-abc'));
    const b = Array.from({ length: 10 }, createRng('attempt-xyz'));
    expect(a).not.toEqual(b);
  });

  it('produces values in [0, 1)', () => {
    const rng = createRng('range-check');
    for (let i = 0; i < 1000; i += 1) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('hashes distinct seeds to distinct values', () => {
    expect(hashSeed('a')).not.toBe(hashSeed('b'));
    expect(hashSeed('attempt-1')).toBe(hashSeed('attempt-1'));
  });

  it('shuffle keeps every element exactly once', () => {
    const shuffled = shuffle(pool20, createRng('s'));
    expect(shuffled).toHaveLength(pool20.length);
    expect(new Set(shuffled.map((i) => i.questionId)).size).toBe(pool20.length);
  });
});

describe('selectItems', () => {
  it('returns the requested number of distinct questions', () => {
    const result = selectItems(pool20, constraint(), 10, createRng('seed-1'));
    expect(result.items).toHaveLength(10);
    expect(new Set(result.items.map((i) => i.questionId)).size).toBe(10);
    expect(result.short).toBe(false);
  });

  it('is reproducible for the same seed', () => {
    const a = selectItems(pool20, constraint(), 10, createRng('same'));
    const b = selectItems(pool20, constraint(), 10, createRng('same'));
    expect(a.items.map((i) => i.questionId)).toEqual(b.items.map((i) => i.questionId));
  });

  it('reports a shortfall instead of padding with repeats', () => {
    const result = selectItems(pool20.slice(0, 4), constraint(), 10, createRng('short'));
    expect(result.items).toHaveLength(4);
    expect(result.short).toBe(true);
    expect(new Set(result.items.map((i) => i.questionId)).size).toBe(4);
  });

  it('never reuses a question already placed earlier in the same attempt', () => {
    const used = new Set(['q0', 'q1', 'q2']);
    const result = selectItems(pool20, constraint(), 10, createRng('used'), {
      alreadyUsedQuestionIds: used,
    });
    for (const chosen of result.items) {
      expect(used.has(chosen.questionId)).toBe(false);
    }
  });

  it('filters by section, domain and skill', () => {
    const mixed = [
      item('m1', { sectionKey: 'math', domainSlug: 'algebra', skillSlug: 'linear-equations' }),
      item('m2', { sectionKey: 'math', domainSlug: 'geometry', skillSlug: 'circles' }),
      item('v1', { sectionKey: 'verbal', domainSlug: 'reading', skillSlug: 'inference' }),
    ];
    const result = selectItems(
      mixed,
      constraint({ sectionKey: 'math', domains: ['geometry'] }),
      5,
      createRng('filter'),
    );
    expect(result.items.map((i) => i.questionId)).toEqual(['m2']);
  });

  it('filters by response type', () => {
    const mixed = [
      item('a', { responseType: 'single_select' }),
      item('b', { responseType: 'numeric_entry' }),
    ];
    const result = selectItems(
      mixed,
      constraint({ responseTypes: ['numeric_entry'] }),
      5,
      createRng('rt'),
    );
    expect(result.items.map((i) => i.questionId)).toEqual(['b']);
  });

  it('honours a difficulty mix when the pool supports it', () => {
    const graded = [
      ...Array.from({ length: 5 }, (_, i) => item(`e${i}`, { difficulty: 'easy' })),
      ...Array.from({ length: 5 }, (_, i) => item(`m${i}`, { difficulty: 'medium' })),
      ...Array.from({ length: 5 }, (_, i) => item(`h${i}`, { difficulty: 'hard' })),
    ];
    const result = selectItems(
      graded,
      constraint({ difficultyMix: { easy: 2, medium: 3, hard: 1 } }),
      6,
      createRng('mix'),
    );
    const counts = { easy: 0, medium: 0, hard: 0 };
    for (const chosen of result.items) counts[chosen.difficulty] += 1;
    expect(counts).toEqual({ easy: 2, medium: 3, hard: 1 });
    expect(result.unmetMix).toEqual({});
  });

  it('reports which part of the difficulty mix it could not meet', () => {
    const graded = [
      ...Array.from({ length: 4 }, (_, i) => item(`e${i}`, { difficulty: 'easy' })),
      item('h0', { difficulty: 'hard' }),
    ];
    const result = selectItems(
      graded,
      constraint({ difficultyMix: { easy: 1, medium: 2, hard: 1 } }),
      4,
      createRng('unmet'),
    );
    expect(result.unmetMix.medium).toBe(2);
    expect(result.notes.join(' ')).toContain('difficulty mix');
  });

  it('prefers questions the learner has not seen recently', () => {
    const now = new Date('2026-09-21T00:00:00.000Z');
    const recent = new Date('2026-09-20T00:00:00.000Z').toISOString();
    const mixed = [
      item('seen1', { lastSeenAt: recent }),
      item('seen2', { lastSeenAt: recent }),
      item('fresh1'),
      item('fresh2'),
    ];
    const result = selectItems(mixed, constraint({ avoidSeenWithinDays: 30 }), 2, createRng('fresh'), {
      now,
    });
    expect(result.items.map((i) => i.questionId).sort()).toEqual(['fresh1', 'fresh2']);
  });

  it('falls back to recently seen questions rather than returning nothing, and says so', () => {
    const now = new Date('2026-09-21T00:00:00.000Z');
    const recent = new Date('2026-09-20T00:00:00.000Z').toISOString();
    const mixed = [item('seen1', { lastSeenAt: recent }), item('fresh1')];
    const result = selectItems(mixed, constraint({ avoidSeenWithinDays: 30 }), 2, createRng('fb'), {
      now,
    });
    expect(result.items).toHaveLength(2);
    expect(result.notes.join(' ')).toContain('seen in the last');
  });

  it('keeps questions that share a passage adjacent', () => {
    const passageItems = [
      item('p1a', { stimulusId: 'passage-1' }),
      item('p1b', { stimulusId: 'passage-1' }),
      item('p1c', { stimulusId: 'passage-1' }),
      item('p2a', { stimulusId: 'passage-2' }),
      item('p2b', { stimulusId: 'passage-2' }),
      item('solo'),
    ];
    const result = selectItems(passageItems, constraint(), 6, createRng('grouping'));
    const stimulusOrder = result.items.map((i) => i.stimulusId ?? 'none');
    // Each stimulus must appear as one contiguous run.
    const runs = stimulusOrder.filter((s, idx) => idx === 0 || stimulusOrder[idx - 1] !== s);
    expect(new Set(runs).size).toBe(runs.length);
  });
});

describe('checkBlueprintSufficiency', () => {
  function part(key: string, itemCount: number, domains: string[] = []): BlueprintPart {
    return {
      key,
      sectionKey: 'math',
      label: key,
      timeLimitSeconds: null,
      itemCount,
      selection: constraint({ domains }),
      navigationOverride: null,
      breakAfterSeconds: null,
      adaptive: null,
    };
  }

  it('passes when the pool covers every part without reuse', () => {
    const result = checkBlueprintSufficiency(pool20, [part('p1', 8), part('p2', 8)]);
    expect(result.sufficient).toBe(true);
    expect(result.shortfall).toBe(0);
  });

  it('fails when two parts would have to share questions', () => {
    const result = checkBlueprintSufficiency(pool20, [part('p1', 15), part('p2', 15)]);
    expect(result.sufficient).toBe(false);
    expect(result.shortfall).toBe(10);
    expect(result.parts[0].sufficient).toBe(true);
    expect(result.parts[1]).toMatchObject({ requested: 15, available: 5, sufficient: false });
  });

  it('accounts for domain filters when judging sufficiency', () => {
    const mixed = [
      ...Array.from({ length: 3 }, (_, i) => item(`a${i}`, { domainSlug: 'algebra' })),
      ...Array.from({ length: 2 }, (_, i) => item(`g${i}`, { domainSlug: 'geometry' })),
    ];
    const result = checkBlueprintSufficiency(mixed, [
      part('alg', 3, ['algebra']),
      part('geo', 3, ['geometry']),
    ]);
    expect(result.sufficient).toBe(false);
    expect(result.parts[1]).toMatchObject({ available: 2, requested: 3 });
  });

  it('an empty pool fails rather than silently producing an empty exam', () => {
    const result = checkBlueprintSufficiency([], [part('p1', 5)]);
    expect(result.sufficient).toBe(false);
    expect(result.shortfall).toBe(5);
  });
});
