import type { Unit } from '../../types';
import { moleculesLesson } from './biological-molecules';
import { diversityLesson } from './biodiversity';
import { cellLesson } from './cells-and-transport';
import { geneticsLesson } from './genetics';
import { bioenergeticsLesson } from './bioenergetics';
import { ecologyLesson } from './ecology';
import { physiologyLesson } from './human-physiology';

export const biologyUnit: Unit = {
  slug: 'biology', title: 'Biology',
  summary: 'Connect biological molecules and cells with inheritance, energy pathways, ecological interactions and human organ systems.',
  lessons: [moleculesLesson, diversityLesson, cellLesson, geneticsLesson, bioenergeticsLesson, ecologyLesson, physiologyLesson],
};
