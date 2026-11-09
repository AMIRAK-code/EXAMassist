import type { Unit } from '../../types';
import { tableAnalysisLesson } from './di-table-analysis';
import { graphicsInterpretationLesson } from './di-graphics-interpretation';
import { twoPartAnalysisLesson } from './di-two-part-analysis';
import { multiSourceReasoningLesson } from './di-multi-source-reasoning';
import { dataInsightsCalculatorPacingLesson } from './di-data-insights-calculator-and-pacing';

/** GMAT Data Insights: Table Analysis, Graphics Interpretation, Two-Part Analysis, Multi-Source Reasoning, calculator and pacing (docs/COURSE-AUTHORING.md, the plan). */

export const dataInsightsUnit: Unit = {
  slug: 'data-insights',
  title: 'Data Insights',
  summary: 'GMAT Data Insights is 20 questions in 45 minutes, with an on-screen calculator, across five question types: Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation and Two-Part Analysis. This unit teaches the four types beyond Data Sufficiency, each with original tables, graphs described in words and worked examples, and ends with when to use the calculator and how to pace the section.',
  lessons: [
    tableAnalysisLesson,
    graphicsInterpretationLesson,
    twoPartAnalysisLesson,
    multiSourceReasoningLesson,
    dataInsightsCalculatorPacingLesson,
  ],
};
