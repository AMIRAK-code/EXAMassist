import type { Lesson } from '../../types';

// Independently re-solved for this course on 10 November 2026.
const checkedSlugs = new Set([
  'implications-and-conditions', 'quantifiers-negation-and-venn-diagrams',
  'constraints-guarantees-and-flows', 'sequences-and-patterns',
  'cohesion-and-inference', 'stated-information-and-meaning-in-context',
  'real-numbers-powers-and-radicals', 'ratios-percentages-and-divisibility',
  'polynomial-division-and-factorisation', 'quadratic-equations-and-inequalities',
  'rational-inequalities-and-systems', 'radical-and-absolute-value-inequalities',
  'exponential-and-logarithmic-equations', 'plane-geometry-triangles-and-circles',
  'solid-geometry-and-scaling', 'coordinates-lines-and-distances',
  'circles-parabolas-ellipses-and-hyperbolas',
  'function-domains-inverses-and-transformations', 'exponential-and-logarithmic-graphs',
]);

/** Shared teaching is rechecked in this course after its practice mapping changes. */
export function forTolcE(source: Lesson, domain: string, skill: string): Lesson {
  return {
    ...source,
    practice: { examKey: 'tolc-e', domain, skill },
    review: { aiAssisted: true, independentCheckOn: checkedSlugs.has(source.slug) ? '2026-11-10' : null, expertReview: null },
  };
}
