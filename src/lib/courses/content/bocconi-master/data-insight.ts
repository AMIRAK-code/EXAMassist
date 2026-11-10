import type { Unit } from '../../types';
import { readingTablesLesson } from './di-reading-tables';
import { barAndLineChartsLesson } from './di-bar-and-line-charts';
import { pieChartsAndSharesLesson } from './di-pie-charts-and-shares';
import { percentagesAndGrowthLesson } from './di-percentages-and-growth-in-data';
import { averagesAndWeightedDataLesson } from './di-averages-and-weighted-data';
import { combiningTablesAndChartsLesson } from './di-combining-tables-and-charts';
import { dataSufficiencyBasicsLesson } from './di-data-sufficiency-basics';
import { dataSufficiencyPitfallsLesson } from './di-data-sufficiency-pitfalls';

/** Bocconi master's, Data insight (docs/COURSE-AUTHORING.md, the plan; facts from docs/research/bocconi-master-facts-2026-11-09.md). */

export const dataInsightUnit: Unit = {
  slug: 'data-insight',
  title: 'Data insight',
  summary: 'Data insight is 16 of the test’s 50 questions. Bocconi describes two kinds of item: questions on tables, histograms, graphs or short passages, and data sufficiency. Calculators are not allowed, so this unit teaches reading each kind of display, computing shares, growth and weighted averages by hand, combining sources, and the logic of deciding which statements are enough.',
  lessons: [
    readingTablesLesson,
    barAndLineChartsLesson,
    pieChartsAndSharesLesson,
    percentagesAndGrowthLesson,
    averagesAndWeightedDataLesson,
    combiningTablesAndChartsLesson,
    dataSufficiencyBasicsLesson,
    dataSufficiencyPitfallsLesson,
  ],
};
