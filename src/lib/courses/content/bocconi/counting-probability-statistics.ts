import type { Unit } from '../../types';
import { permutationsAndCombinationsLesson } from './cps-permutations-and-combinations';
import { countingProblemsLesson } from './cps-counting-problems';
import { probabilityBasicsLesson } from './cps-probability-basics';
import { unionIntersectionAndComplementsLesson } from './cps-union-intersection-and-complements';
import { conditionalProbabilityAndBayesLesson } from './cps-conditional-probability-and-bayes';
import { frequenciesCentreAndSpreadLesson } from './cps-frequencies-centre-and-spread';

export const countingProbabilityStatisticsUnit: Unit = {
  slug: 'counting-probability-statistics',
  title: 'Counting, probability and statistics',
  summary:
    'Discrete mathematics, probability and statistics from the Bocconi mathematics syllabus: permutations and combinations with and without repetition, counting with the sum and product rules, equally likely outcomes, unions and intersections of events, conditional probability, total probability and Bayes, and frequencies with measures of centre and spread. Everything is worked by hand, since calculators are not permitted on the test.',
  lessons: [
    permutationsAndCombinationsLesson,
    countingProblemsLesson,
    probabilityBasicsLesson,
    unionIntersectionAndComplementsLesson,
    conditionalProbabilityAndBayesLesson,
    frequenciesCentreAndSpreadLesson,
  ],
};
