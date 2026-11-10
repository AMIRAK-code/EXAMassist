import type { Unit } from '../../types';
import { mechanicsLesson } from './vectors-motion-and-inclined-planes';
import { energyLesson } from './energy-fluids-and-ideal-gases';
import { electricityLesson } from './charges-circuits-and-optics';
import { stoichiometryLesson } from './atoms-bonds-and-reacting-amounts';
import { solutionsLesson } from './solutions-equilibrium-and-ph';

export const sciencesUnit: Unit = {
  slug: 'sciences',
  title: 'Sciences',
  summary: 'Follow forces, energy and electric charge through physical systems. Then use particle counts, mole ratios and concentrations to explain chemical changes.',
  lessons: [mechanicsLesson, energyLesson, electricityLesson, stoichiometryLesson, solutionsLesson],
};
