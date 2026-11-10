import type { Unit } from '../../types';
import { lesson as implicationsAndConditions } from './implications-and-conditions';
import { lesson as quantifiersNegationAndVennDiagrams } from './quantifiers-negation-and-venn-diagrams';
import { lesson as constraintsGuaranteesAndFlows } from './constraints-guarantees-and-flows';
import { lesson as sequencesAndPatterns } from './sequences-and-patterns';

export const logicUnit: Unit = {
  slug: 'logic',
  title: 'Logic',
  summary: 'Use diagrams, counterexamples and small tables to test what follows from a rule.',
  lessons: [implicationsAndConditions, quantifiersNegationAndVennDiagrams, constraintsGuaranteesAndFlows, sequencesAndPatterns],
};
