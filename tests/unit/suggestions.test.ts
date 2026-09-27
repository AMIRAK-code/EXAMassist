import { describe, expect, it } from 'vitest';
import { assessReadiness } from '@/lib/learning/readiness';
import { buildSuggestions, type SuggestionInput } from '@/lib/learning/suggestions';
import type { PracticeFacet } from '@/lib/attempts/facets';
import { requireExamConfig } from '@/lib/exams/registry';

/**
 * Suggestions sit apart from the readiness evidence and are built from what
 * can actually be practised: new questions while enough are unseen, revision
 * (said plainly) after that, and nothing where there is nothing to practise.
 */

const SAT = requireExamConfig('digital-sat');
const [first, second, third, fourth] = SAT.domains;

const facets = (counts: Record<string, number>): PracticeFacet[] =>
  Object.entries(counts).map(([domainSlug, count]) => ({
    domainSlug,
    skillSlug: SAT.domains.find((d) => d.slug === domainSlug)!.skills[0].slug,
    difficulty: 'medium',
    count,
  }));

const NO_TIMES = { timesMs: [], inUntimed: 0, missing: 0 };

function assessment(perDomain: Record<string, { correct: number; answered: number }>) {
  const byDomain = new Map(Object.entries(perDomain).map(([slug, row]) => [slug, { ...row, omitted: 0 }]));
  return assessReadiness({ config: SAT, performance: [], byDomain, targetScore: null, recentSessions: [], timing: NO_TIMES });
}

function input(overrides: Partial<SuggestionInput>): SuggestionInput {
  return {
    config: SAT,
    assessment: assessment({
      [first.slug]: { correct: 4, answered: 10 },
      [second.slug]: { correct: 9, answered: 10 },
      [third.slug]: { correct: 9, answered: 10 },
    }),
    allFacets: facets({ [first.slug]: 20, [second.slug]: 20, [third.slug]: 20, [fourth.slug]: 20 }),
    unseenFacets: facets({ [first.slug]: 10, [second.slug]: 10, [third.slug]: 10, [fourth.slug]: 20 }),
    retryable: 0,
    timedFormat: null,
    ...overrides,
  };
}

describe('suggestions', () => {
  it('offers an untouched topic and the weakest topic as new questions while enough are unseen', () => {
    const suggestions = buildSuggestions(input({}));
    const untouched = suggestions.find((s) => s.key === `untouched-${fourth.slug}`)!;
    expect(untouched.kind).toBe('new');
    expect(untouched.start).toEqual({ type: 'practice', domainSlug: fourth.slug, unseenOnly: true, length: 10 });
    const weak = suggestions.find((s) => s.key === `weak-${first.slug}`)!;
    expect(weak.kind).toBe('new');
    expect(weak.why).toContain('40% of 10');
  });

  it('turns topic practice into revision, and says so, once few questions are new', () => {
    const suggestions = buildSuggestions(input({ unseenFacets: facets({ [first.slug]: 2, [fourth.slug]: 20 }) }));
    const weak = suggestions.find((s) => s.key === `weak-${first.slug}`)!;
    expect(weak.kind).toBe('revision');
    expect(weak.start).toMatchObject({ unseenOnly: false });
    expect(weak.why).toContain('Only 2 of the 20 reviewed questions here are new to you');
  });

  it('suggests nothing for a topic with no reviewed questions', () => {
    const suggestions = buildSuggestions(
      input({ allFacets: facets({ [first.slug]: 20 }), unseenFacets: facets({ [first.slug]: 10 }) }),
    );
    expect(suggestions.some((s) => s.key.startsWith('untouched-'))).toBe(false);
  });

  it('offers a review of missed questions, saying it repeats them on purpose', () => {
    const review = buildSuggestions(input({ retryable: 14 })).find((s) => s.kind === 'review')!;
    expect(review.title).toBe('Revisit 14 questions you missed');
    expect(review.why).toContain('on purpose');
    expect(review.start).toEqual({ type: 'review', length: 10 });
  });

  it('asks for more answers first when there is too little evidence', () => {
    const suggestions = buildSuggestions(input({ assessment: assessment({ [first.slug]: { correct: 2, answered: 3 } }) }));
    expect(suggestions[0].key).toBe('more');
    expect(suggestions[0].why).toContain('Another 22 answers');
  });

  it('suggests timed practice only from a reliable pace and an open timed format', () => {
    const slow = assessReadiness({
      config: SAT,
      performance: [],
      byDomain: new Map([[first.slug, { correct: 20, answered: 40, omitted: 0 }]]),
      targetScore: null,
      recentSessions: [],
      timing: { timesMs: Array(40).fill(200_000), inUntimed: 0, missing: 0 },
    });
    expect(buildSuggestions(input({ assessment: slow })).some((s) => s.kind === 'timed')).toBe(false);
    expect(
      buildSuggestions(input({ assessment: slow, timedFormat: { label: 'Module practice' } })).some((s) => s.kind === 'timed'),
    ).toBe(true);
  });
});
