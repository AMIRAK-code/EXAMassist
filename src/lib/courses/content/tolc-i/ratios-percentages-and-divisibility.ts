import { md, type Lesson } from '../../types';

export const ratiosPercentagesAndDivisibilityLesson: Lesson = {
  slug: 'ratios-percentages-and-divisibility',
  title: 'Ratios, percentage changes and divisibility',
  summary: 'Choose a percentage base, scale a ratio, and use integer factors and remainders to solve grouping and scheduling problems by hand.',
  minutes: 18,
  objectives: [
    'Recover the base of a percentage change.',
    'Use a ratio to allocate a whole quantity.',
    'Distinguish common divisors from common multiples.'
  ],
  teachMd: md`### Keep the units on the ratio

A ratio (*rapporto*) compares two quantities in a stated order. If a mixture contains three parts sand to two parts gravel by mass, the number three describes the sand relative to the gravel's two. A part has no fixed mass until one quantity is given. If the entire mixture weighs thirty kilograms, five equal parts weigh thirty kilograms and each weighs six. The sand accounts for three fifths of the mixture, even though the ratio of sand to gravel is three halves. Write the two labels above the numbers before using either fraction.

Two quantities are directly proportional when multiplying one by a factor multiplies the other by the same factor. Their quotient is then constant. If the product is constant instead, the quantities are inversely proportional. For a fixed length of track, doubling a constant speed halves the travel time. Decide which quantity stays fixed before writing a proportion. Cross multiplication will solve an equation you give it, but cannot tell whether that equation describes the situation.

### Record the amount just before the change

A percentage (*percentuale*) means a number of parts per hundred of some reference quantity. For a rise of one quarter, add the original whole to the extra quarter and multiply by five quarters. For a fall of one quarter, retain three quarters. These multipliers work just as well when the original amount is unknown. Give it a letter and carry the multiplier attached to the letter rather than choosing a convenient amount that might violate another condition.

Successive changes use successive bases. After a rise the reduction is taken from the larger amount. For instance, raising a quantity by a fifth and then lowering it by a fifth gives the multiplier $(6/5)(4/5)=24/25$. The missing twenty-fifth measures the loss relative to the starting amount. To recover a starting value from an ending value, divide by the complete multiplier. Reversing the sign of a percentage rarely reverses the change. Compare a value falling from ten to eight with its return from eight to ten: the same difference of two is a different fraction of each starting value.

### Decide whether an integer divides or repeats

A positive integer divides another exactly when the division leaves no remainder. To split two stocks into the greatest possible number of identical batches, that number must divide both stocks. The greatest common divisor (*massimo comune divisore*) is found by taking the smaller exponent of each shared prime in the two prime decompositions. Every copy of a prime included in the divisor has to be present on both sides. A prime missing on one side contributes nothing.

When two events recur at fixed whole-number intervals after a shared starting time, the first shared positive time has to be a multiple of both intervals. The least common multiple (*minimo comune multiplo*) takes the larger exponent of each prime from either interval. This time you are assembling a number large enough to contain each interval as a factor. Testing the result by dividing it by both intervals catches missing prime factors. If the events start at different times, a common multiple alone does not account for their different starting positions.

### Name what the remainder counts

For a nonnegative number of objects divided into groups of positive size $d$, write $N=dq+r$ with $0\le r<d$. There are $q$ complete groups and $r$ spare objects. If every object must be transported and each vehicle has $d$ places, a nonzero remainder means another vehicle is required. If you are counting full packages available for sale, the same remainder cannot make a further package. Read the noun after the number in your answer. Groups, objects left over and total capacity each correspond to different parts of the same division.`,
  examples: [
    {
      id: 'example-1',
      title: 'Recover the first day\'s stock',
      problemMd: 'A store receives an extra quarter of its starting stock, then issues one fifth of the new total. It finishes with 68 parts. How many did it start with?',
      steps: [
        md`The delivery multiplies stock by $5/4$. The issue leaves $4/5$ of that new amount.`,
        'Their product is one, so the finishing stock equals the starting stock.',
        'Check forward: the delivery adds 17, making 85, and issuing 17 leaves 68.'
      ],
      answerMd: 'It started with 68 parts. The two changes cancel because their multipliers are reciprocals.'
    },
    {
      id: 'example-2',
      title: 'Pack the connectors',
      problemMd: 'Make the greatest possible number of identical kits from 84 brass and 60 steel connectors using every connector. What goes in each kit?',
      steps: [
        'Any kit count divides both 84 and 60. Their difference is 24, and dividing 60 by 24 leaves 12.',
        'Twelve divides both 24 and 60. Every common divisor must divide the successive remainders, so twelve is greatest.',
        'Divide the stocks by twelve to get seven brass and five steel per kit.'
      ],
      answerMd: 'Each of the twelve kits holds seven brass and five steel connectors.'
    }
  ],
  traps: [
    {
      title: 'Using the wrong whole',
      md: 'In a mixture ratio of two to seven, the total represents nine parts. A component share uses nine as denominator.'
    },
    {
      title: 'Reporting spare seats as people',
      md: 'If the last vehicle has empty seats, subtract the people on it from its capacity to find the vacancies. The remainder of the people count gives occupants instead.'
    }
  ],
  check: [
    {
      id: 'check-1',
      title: 'A chained reduction',
      topic: 'Arithmetic and algebra',
      stemMd: 'A roll loses 20% of its length, then 25% of the remainder. What fraction of the original length remains?',
      options: [
        {
          id: 'A',
          text: md`$11/20$`,
          note: 'This subtracts both percentages from the starting length.'
        },
        {
          id: 'B',
          text: md`$3/5$`,
          note: ''
        },
        {
          id: 'C',
          text: md`$2/5$`,
          note: 'This is the fraction removed over the two cuts.'
        },
        {
          id: 'D',
          text: md`$1/20$`,
          note: 'This multiplies the fractions removed rather than the fractions retained.'
        },
        {
          id: 'E',
          text: md`$3/4$`,
          note: 'This accounts only for the second cut.'
        }
      ],
      answer: 'B',
      workingMd: md`The retained factors give $(4/5)(3/4)=3/5$.`,
      lesson: 'Multiply the retained fractions for successive reductions.'
    },
    {
      id: 'check-2',
      title: 'Repeating signals',
      topic: 'Arithmetic and algebra',
      stemMd: 'Two lamps flash together at time zero, then at intervals of 18 and 24 seconds respectively. When do they next flash together?',
      options: [
        {
          id: 'A',
          text: '6 seconds',
          note: 'Six is the greatest common divisor of the intervals.'
        },
        {
          id: 'B',
          text: '42 seconds',
          note: 'Adding the intervals does not produce a shared flash time.'
        },
        {
          id: 'C',
          text: '48 seconds',
          note: 'This is a multiple of 24 but is not divisible by 18.'
        },
        {
          id: 'D',
          text: '72 seconds',
          note: ''
        },
        {
          id: 'E',
          text: '432 seconds',
          note: 'Multiplying gives a common time but counts shared factors twice, so it is not the first.'
        }
      ],
      answer: 'D',
      workingMd: md`Use $18=2\times3^2$ and $24=2^3\times3$. The first common multiple is $2^3\times3^2=72$ seconds.`,
      lesson: 'A first recurrence after a joint start uses the least common multiple.'
    },
    {
      id: 'check-3',
      title: 'Complete sets',
      topic: 'Arithmetic and algebra',
      stemMd: 'A drawer has 83 washers. Each full repair set takes six. How many washers are left after making as many full sets as possible?',
      options: [
        {
          id: 'A',
          text: '13',
          note: 'Thirteen counts full sets rather than unallocated washers.'
        },
        {
          id: 'B',
          text: '14',
          note: 'Rounding the quotient up would require another washer.'
        },
        {
          id: 'C',
          text: '1',
          note: 'One is the shortfall for the next set, rather than the number left.'
        },
        {
          id: 'D',
          text: '6',
          note: 'A remainder equal to the set size would make another complete set.'
        },
        {
          id: 'E',
          text: '5',
          note: ''
        }
      ],
      answer: 'E',
      workingMd: md`Thirteen sets take $13\times6=78$ washers. Subtracting gives five left, fewer than six.`,
      lesson: 'Use the remainder for items left after forming full groups.'
    }
  ],
  takeaways: [
    'A component share divides its parts by all parts.',
    'Recover a starting amount by dividing by the change multiplier.',
    'For identical batches use a common divisor, and for joint recurrence from a shared start use a common multiple.'
  ],
  practice: {
    examKey: 'tolc-i',
    domain: 'tolci-mathematics',
    skill: 'tolci-math-arithmetic-algebra'
  },
  review: {
    aiAssisted: true,
    independentCheckOn: '2026-11-10',
    expertReview: null
  }
};
