import type { Unit } from '../../types';
import { derivativesAndOptimisationLesson } from './adv-derivatives-and-optimisation';
import { normalDistributionAndHypothesisTestsLesson } from './adv-normal-distribution-and-hypothesis-tests';

export const beyondBasicMathsUnit: Unit = {
  slug: 'beyond-basic-maths',
  title: 'Beyond basic maths (optional)',
  summary:
    "Optional extra preparation. Bocconi's current test page describes quantitative reasoning as problems using basic mathematics and publishes no topic list, so nothing in this unit is confirmed for the current test. A 2024 sample test on Bocconi's website, which the current page does not link to and which may not reflect the current form, included a few items beyond basic mathematics: the gradient of a function of two variables, a Type I error and null-hypothesis item, and expected values of random variables. These two lessons prepare you for that possibility: derivatives and optimisation, then the normal distribution and hypothesis tests. Work through the quantitative reasoning unit first; it covers the basic mathematics the test page describes.",
  lessons: [derivativesAndOptimisationLesson, normalDistributionAndHypothesisTestsLesson],
};
