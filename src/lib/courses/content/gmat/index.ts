import { md, type Course } from '../../types';
import { gmatUnits } from './units';

/** Exam facts here are from docs/research/course-facts-2026-11-04.md (GMAC pages M2–M7). */
export const gmatCourse: Course = {
  slug: 'gmat',
  title: 'GMAT Focus Edition course',
  shortTitle: 'GMAT course',
  metaTitle: 'Free GMAT Focus course: Quant, Verbal and Data Insights',
  description: 'A free GMAT Focus Edition course: lessons with worked examples, traps and quick checks for Quantitative Reasoning, Verbal Reasoning and Data Insights.',
  examKeys: ['gmat'],
  hubSlug: 'gmat',
  examPublisher: 'GMAC',
  introMd: md`
This course teaches the three sections of the GMAT exam, one idea per lesson. Each lesson explains the concept, works original examples step by step, shows the traps that cost marks, and ends with a short check whose answers stay hidden until you open them.

### The test in brief

GMAC now calls the exam simply the GMAT exam; it is the format introduced as the GMAT Focus Edition. It has three sections of 45 minutes each, 2 hours 15 minutes in all: Quantitative Reasoning (21 questions), Verbal Reasoning (23) and Data Insights (20). You choose the order of the sections, and you may take one optional 10-minute break. Questions are chosen one at a time according to how you are doing, and within each section you can change up to three answers. There is no calculator in Quantitative Reasoning; Data Insights has an on-screen calculator. Each section is scored from 60 to 90 and the total from 205 to 805, with the three sections weighted equally.

Quantitative Reasoning is problem solving in arithmetic and algebra. Verbal Reasoning is reading comprehension and critical reasoning. Data Insights has five question types: data sufficiency, multi-source reasoning, table analysis, graphics interpretation and two-part analysis.

### How to use the course

Work through a unit in order. After each lesson, take the check before you open the answers, then use the practice link to apply the idea on fresh questions. Every question in this course is original and written for UniExamer; none comes from GMAC, and difficulty is our editorial judgement, not a calibrated GMAT level.
`,
  publishedOn: '2026-11-04',
  updatedOn: '2026-11-04',
  sources: [
    { label: 'The GMAT Exam: structure, content and features', url: 'https://www.gmac.com/gmat-other-assessments/about-the-gmat-focus-edition/exam-overview', publisher: 'GMAC' },
    { label: 'GMAT Exam scores', url: 'https://www.gmac.com/gmat-other-assessments/about-the-gmat-focus-edition/exam-scores', publisher: 'GMAC' },
    { label: 'GMAT Data Insights', url: 'https://www.gmac.com/resources/learners/how-to-apply/exams-preparation/gmat-data-insights', publisher: 'GMAC' },
  ],
  units: gmatUnits,
};
