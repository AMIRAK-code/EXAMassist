import { md, type Course } from '../../types';
import { greUnits } from './units';

/** Exam facts here are from docs/research/course-facts-2026-11-04.md (ETS pages E1–E8). */
export const greCourse: Course = {
  slug: 'gre',
  title: 'GRE General Test course',
  shortTitle: 'GRE course',
  metaTitle: 'Free GRE course: Verbal, Quant and Analytical Writing',
  description: 'A free GRE course: lessons with worked examples, common traps and quick checks for Verbal Reasoning, Quantitative Reasoning and the Issue essay.',
  examKeys: ['gre'],
  hubSlug: 'gre',
  examPublisher: 'ETS',
  introMd: md`
This course teaches what the GRE General Test measures, one idea per lesson. Each lesson explains the concept, works original examples step by step, shows the traps that cost marks, and ends with a short check whose answers stay hidden until you open them.

### The test in brief

The current GRE General Test takes about 1 hour and 58 minutes. It opens with one 30-minute Analytical Writing task ("Analyze an Issue"), followed by two Verbal Reasoning sections (12 questions in 18 minutes, then 15 in 23) and two Quantitative Reasoning sections (12 in 21 minutes, then 15 in 26). The Verbal and Quantitative sections can come in any order after the essay. Each measure is adaptive by section: how you do in its first section sets the difficulty of its second. Verbal and Quantitative are scored from 130 to 170, Analytical Writing from 0 to 6 in half points, and nothing is subtracted for a wrong answer, so never leave a question blank. A basic on-screen calculator is available in Quantitative Reasoning only.

### How to use the course

Work through a unit in order: the lessons build on each other. After each lesson, take the check before you open the answers, then use the practice link to apply the idea on fresh questions. Every question in this course is original and written for UniExamer; none comes from ETS, and difficulty is our editorial judgement, not a calibrated GRE level.
`,
  publishedOn: '2026-11-04',
  updatedOn: '2026-11-04',
  sources: [
    { label: 'GRE General Test structure', url: 'https://www.ets.org/gre/test-takers/general-test/prepare/test-structure.html', publisher: 'ETS' },
    { label: 'GRE Verbal Reasoning overview', url: 'https://www.ets.org/gre/test-takers/general-test/prepare/content/verbal-reasoning.html', publisher: 'ETS' },
    { label: 'GRE Quantitative Reasoning overview', url: 'https://www.ets.org/gre/test-takers/general-test/prepare/content/quantitative-reasoning.html', publisher: 'ETS' },
    { label: 'GRE Analytical Writing overview', url: 'https://www.ets.org/gre/test-takers/general-test/prepare/content/analytical-writing.html', publisher: 'ETS' },
    { label: 'Understanding GRE General Test scores', url: 'https://www.ets.org/gre/test-takers/general-test/scores/understand-scores.html', publisher: 'ETS' },
  ],
  units: greUnits,
};
