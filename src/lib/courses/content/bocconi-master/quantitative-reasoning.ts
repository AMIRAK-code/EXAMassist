import type { Unit } from '../../types';
import { numbersAndDivisibilityLesson } from './qr-numbers-and-divisibility';
import { fractionsRatiosAndProportionsLesson } from './qr-fractions-ratios-and-proportions';
import { percentagesAndSuccessiveChangesLesson } from './qr-percentages-and-successive-changes';
import { equationsAndSystemsLesson } from './qr-equations-and-systems';
import { quadraticsAndInequalitiesLesson } from './qr-quadratics-and-inequalities';
import { ratesWorkAndMixturesLesson } from './qr-rates-work-and-mixtures';
import { countingAndProbabilityLesson } from './qr-counting-and-probability';
import { averagesAndBasicStatisticsLesson } from './qr-averages-and-basic-statistics';
import { setsAndOverlapsLesson } from './qr-sets-and-overlaps';
import { interestPresentValueAndBreakEvenLesson } from './qr-interest-present-value-and-break-even';
import { exponentialsLogarithmsAndSequencesLesson } from './qr-exponentials-logarithms-and-sequences';
import { conditionalProbabilityAndExpectedValueLesson } from './qr-conditional-probability-and-expected-value';

export const quantitativeReasoningUnit: Unit = {
  slug: 'quantitative-reasoning',
  title: 'Quantitative reasoning',
  summary:
    'Bocconi describes the 10 quantitative reasoning questions as numerical and logical problems using basic mathematics, and publishes no topic list. This unit reviews core areas of basic mathematics: number properties, fractions and ratios, percentages, interest and break-even, linear equations and systems, quadratics and inequalities, exponentials, logarithms and sequences, rates and mixtures, sets and overlaps, counting and probability, conditional probability and expected value, and averages. Calculators are not allowed, so every method here is worked by hand.',
  lessons: [
    numbersAndDivisibilityLesson,
    fractionsRatiosAndProportionsLesson,
    percentagesAndSuccessiveChangesLesson,
    interestPresentValueAndBreakEvenLesson,
    equationsAndSystemsLesson,
    quadraticsAndInequalitiesLesson,
    exponentialsLogarithmsAndSequencesLesson,
    ratesWorkAndMixturesLesson,
    setsAndOverlapsLesson,
    countingAndProbabilityLesson,
    conditionalProbabilityAndExpectedValueLesson,
    averagesAndBasicStatisticsLesson,
  ],
};
