import type { Unit } from '../../types';
import { stoichiometryLesson } from '../tolc-i/atoms-bonds-and-reacting-amounts';
import { solutionsLesson } from '../tolc-i/solutions-equilibrium-and-ph';
import { inorganicLesson } from './inorganic-compounds';
import { redoxLesson } from './redox';
import { organicLesson } from './organic-chemistry';
import { reviewedAdapt as adapt } from './shared';

export const chemistryUnit: Unit = {
  slug: 'chemistry', title: 'Chemistry',
  summary: 'Use atomic structure and bonding to build formulas, balance reacting amounts and electrons, analyse solutions and identify organic functional groups.',
  lessons: [adapt(stoichiometryLesson, 'tolcf-chemistry', 'tolcf-chem-atoms-periodic'), inorganicLesson, redoxLesson, adapt(solutionsLesson, 'tolcf-chemistry', 'tolcf-chem-solutions-acids-bases'), organicLesson],
};
