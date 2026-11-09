import type { Unit } from '../../types';
import { argumentAnatomy } from './cr-argument-anatomy';
import { assumptionQuestions } from './cr-assumption-questions';
import { strengthenQuestions } from './cr-strengthen-questions';
import { weakenQuestions } from './cr-weaken-questions';
import { evaluateTheArgument } from './cr-evaluate-the-argument';
import { flawQuestions } from './cr-flaw-questions';
import { planAndDiscrepancyQuestions } from './cr-plan-and-discrepancy-questions';
import { inferenceQuestions } from './cr-inference-questions';

/** GMAT Verbal Reasoning: the Critical Reasoning lessons (docs/COURSE-AUTHORING.md, the plan). */
export const criticalReasoningUnit: Unit = {
  slug: 'critical-reasoning',
  title: 'Verbal Reasoning: Critical Reasoning',
  summary: 'GMAT Verbal Reasoning mixes Reading Comprehension with Critical Reasoning: short arguments followed by a question about how they work. This unit starts with taking an argument apart, then covers each common question type in turn: assumption, strengthen, weaken, evaluate, flaw, plan and discrepancy, and inference.',
  lessons: [
    argumentAnatomy,
    assumptionQuestions,
    strengthenQuestions,
    weakenQuestions,
    evaluateTheArgument,
    flawQuestions,
    planAndDiscrepancyQuestions,
    inferenceQuestions,
  ],
};
