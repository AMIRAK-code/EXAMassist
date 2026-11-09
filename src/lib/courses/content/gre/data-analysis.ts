import type { Unit } from '../../types';
import { meanMedianModeLesson } from './mean-median-mode-and-range';
import { standardDeviationLesson } from './standard-deviation-quartiles-and-boxplots';
import { readingGraphsLesson } from './reading-graphs-and-data-interpretation';
import { countingLesson } from './counting-permutations-and-combinations';
import { probabilityLesson } from './probability';
import { normalCurveLesson } from './distributions-and-the-normal-curve';

export const dataAnalysisUnit: Unit = {
  slug: 'data-analysis',
  title: 'Data analysis',
  summary:
    'Data analysis is one of the four content areas of GRE Quantitative Reasoning. This unit covers descriptive statistics (centre, spread, quartiles and boxplots), reading tables and graphs, counting methods, probability, and distributions including the normal curve. Inferential statistics is not tested, so the focus is on reading data accurately and reasoning about it.',
  lessons: [
    meanMedianModeLesson,
    standardDeviationLesson,
    readingGraphsLesson,
    countingLesson,
    probabilityLesson,
    normalCurveLesson,
  ],
};
