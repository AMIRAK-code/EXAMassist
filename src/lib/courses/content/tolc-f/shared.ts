import type { CheckQuestion, Lesson, WorkedExample } from '../../types';

/** Reset review when adapting a lesson to a different course and practice taxonomy. */
export function adapt(lesson: Lesson, domain: string, skill: string): Lesson {
  return { ...lesson, practice: { examKey: 'tolc-f', domain, skill }, review: { aiAssisted: true, independentCheckOn: null, expertReview: null } };
}

// Independently solved in F on 2026-11-10; future additions remain drafts.
const checkedSharedSlugs = new Set([
  'real-numbers-powers-and-radicals', 'ratios-percentages-and-divisibility',
  'polynomial-division-and-factorisation', 'quadratic-equations-and-inequalities',
  'rational-inequalities-and-systems', 'radical-and-absolute-value-inequalities',
  'exponential-and-logarithmic-equations', 'plane-geometry-triangles-and-circles',
  'solid-geometry-and-scaling', 'coordinates-lines-and-distances',
  'circles-parabolas-ellipses-and-hyperbolas', 'function-domains-inverses-and-transformations',
  'exponential-and-logarithmic-graphs', 'unit-circle-and-trigonometric-equations',
  'sine-and-cosine-rules', 'weighted-means-and-probability',
  'vectors-motion-and-inclined-planes', 'energy-fluids-and-ideal-gases',
  'charges-circuits-and-optics', 'atoms-bonds-and-reacting-amounts',
  'solutions-equilibrium-and-ph', 'implications-and-conditions',
  'quantifiers-negation-and-venn-diagrams', 'constraints-guarantees-and-flows',
  'sequences-and-patterns',
]);

export function reviewedAdapt(lesson: Lesson, domain: string, skill: string): Lesson {
  const result = adapt(lesson, domain, skill);
  return checkedSharedSlugs.has(result.slug)
    ? { ...result, review: { ...result.review, independentCheckOn: '2026-11-10' } }
    : result;
}

export function example(id: string, title: string, problemMd: string, steps: string[], answerMd: string): WorkedExample {
  return { id, title, problemMd, steps, answerMd };
}

/** The empty note is explicit for the sole correct choice. */
export function check(id: string, topic: string, stemMd: string, choices: [string, string][], answer: string, workingMd: string, lesson: string): CheckQuestion {
  return { id, title: topic, topic, stemMd, options: choices.map(([text, note], index) => ({ id: 'ABCDE'[index], text, note })), answer, workingMd, lesson };
}
