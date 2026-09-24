/**
 * Eligible-question counts for practice setup.
 *
 * The server groups the practice pool by domain, skill and difficulty once;
 * the setup form sums the groups that match the learner's current filters.
 * Summing matches exactly what `matchesConstraint` accepts for the same
 * filters, so the count the form shows is the count session creation will
 * check. Pure and dependency-free, so it runs in the browser too.
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PracticeFacet {
  domainSlug: string;
  skillSlug: string;
  difficulty: Difficulty;
  count: number;
}

export interface PracticeFilters {
  domain?: string | null;
  skill?: string | null;
  difficulty?: Difficulty | 'mixed' | null;
}

export function eligibleCount(facets: readonly PracticeFacet[], filters: PracticeFilters): number {
  let total = 0;
  for (const facet of facets) {
    if (filters.domain && facet.domainSlug !== filters.domain) continue;
    if (filters.skill && facet.skillSlug !== filters.skill) continue;
    if (filters.difficulty && filters.difficulty !== 'mixed' && facet.difficulty !== filters.difficulty) continue;
    total += facet.count;
  }
  return total;
}

/** The longest session the form offers, however large the bank. */
export const MAX_PRACTICE_LENGTH = 30;
const STANDARD_LENGTHS = [5, 10, 15, 20, 30];

/**
 * Session lengths worth offering for a given number of eligible questions.
 *
 * Standard lengths that fit, plus every length from 1 when fewer than five
 * questions qualify, plus "all of them" when that is not already a standard
 * length. A drill of one or two questions is offered only when that is all the
 * bank holds.
 */
export function lengthOptions(eligible: number): number[] {
  const cap = Math.min(eligible, MAX_PRACTICE_LENGTH);
  if (cap <= 0) return [];
  const options = new Set<number>(STANDARD_LENGTHS.filter((n) => n <= cap));
  if (cap < 5) for (let n = 1; n <= cap; n += 1) options.add(n);
  options.add(cap);
  return [...options].sort((a, b) => a - b);
}

/** The default length: ten, or everything eligible when that is fewer. */
export function defaultLength(eligible: number): number {
  return Math.min(10, Math.min(eligible, MAX_PRACTICE_LENGTH));
}
