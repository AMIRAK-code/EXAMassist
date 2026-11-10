import { md, type Lesson } from '../../types';

export const realNumbersPowersAndRadicalsLesson: Lesson = {
  slug: 'real-numbers-powers-and-radicals',
  title: 'Real numbers, powers and radicals',
  summary: 'Compare exact real numbers, simplify powers and roots, and estimate sizes by hand using normalised scientific notation.',
  minutes: 18,
  objectives: [
    'Classify integers, fractions and irrational numbers.',
    'Simplify powers with negative and fractional exponents.',
    'Compare magnitudes without rounding.'
  ],
  teachMd: md`### Place each number on the line

An integer (*numero intero*) is a whole step from zero in either direction, including zero itself. A rational number (*numero razionale*) can be written as a quotient of integers with nonzero denominator. Every integer is rational because it can be divided by one. A terminating decimal is rational too. Move the decimal point until the numerator is an integer and put the corresponding power of ten underneath. An irrational number is a real number for which no such fraction exists. Together the rational and irrational numbers fill the real line.

The way a number is written can conceal its family. A radical sign alone tells you little. The square root of forty-nine is seven, while the square root of fifty lies strictly between seven and eight and is irrational. For a positive integer, its square root is rational exactly when the integer is a perfect square. This follows from prime factors: in the square of a fraction in lowest terms all prime exponents are even. A prime occurring an odd number of times in the integer prevents that matching.

### Count factors rather than memorising signs

A positive whole exponent counts repeated factors. Multiplying powers with the same base lets you add the counts. Dividing powers of the same nonzero base lets you subtract them, because each matched factor cancels. This explains the less familiar exponents too. Dividing a power by itself gives one, so a nonzero base to the power zero equals one. Dividing a smaller power by a larger one leaves extra factors in the denominator. Thus $a^{-n}=1/a^n$ for nonzero $a$.

Addition has a different structure. In $3^4+3^5$ there are two terms, each of which contains four factors of three. Removing the common factor gives $3^4(1+3)$. Adding the exponents would instead give a product containing nine factors of three. If an exponent rule seems uncertain, expand a much smaller version in ordinary numbers. This also helps with brackets: a leading minus outside an even power survives, whereas a negative base inside the brackets is multiplied by itself an even number of times.

### Replace a fractional exponent by a root

For a positive base, $a^{m/n}$ means the $n$th root of $a$ raised to the power $m$, where $n$ is a positive integer. Take the root first when it is easy. For a negative exponent take the reciprocal as a separate final step. With an even root over the real numbers the input must be nonnegative and the result is nonnegative. Consequently $\sqrt{t^2}=|t|$ for every real input. Pull a square factor out of a radical by applying this rule to the factor being removed.

Exact comparison is often cheaper than extracting a decimal. If two quantities are both nonnegative, squaring them preserves their order. If their signs differ, their order is already known. For two negative quantities compare their positive magnitudes first, then reverse the comparison. Squaring two numbers without checking their signs loses precisely this information. When estimating a root, find the consecutive squares surrounding its input and keep those two integers as bounds.

### Read the scale before the leading digits

In scientific notation a positive number is written as a coefficient at least one and below ten times an integer power of ten. Normalise before comparing exponents. Moving the decimal point one place to the left divides the coefficient by ten, so increase the exponent by one to preserve the number. Between two normalised positive quantities, the larger exponent wins. If the exponents match, compare the coefficients directly. To say how many times larger one quantity is, divide their coefficients and subtract their exponents. This last calculation distinguishes a ratio from the difference between the two written exponents.`,
  examples: [
    {
      id: 'example-1',
      title: 'A negative rational exponent',
      problemMd: md`Simplify $81^{-3/4}$.`,
      steps: [
        md`The positive fourth root of $81$ is three, since $3^4=81$.`,
        'Cube three to obtain twenty-seven. Take the reciprocal for the negative exponent.'
      ],
      answerMd: md`The value is $1/27$, a positive fraction.`
    },
    {
      id: 'example-2',
      title: 'Compare two small lengths',
      problemMd: md`Which is longer, $74\times10^{-6}$ m or $8\times10^{-5}$ m?`,
      steps: [
        md`Normalise the first length to $7.4\times10^{-5}$ m.`,
        md`At equal exponents compare $7.4$ with $8$.`
      ],
      answerMd: 'The second length is longer. Comparing the original coefficients alone would reverse their order.'
    }
  ],
  traps: [
    {
      title: 'Ignoring the minus outside a power',
      md: md`In $-4^2$ the square acts on four first. Brackets change the base in $(-4)^2$.`
    },
    {
      title: 'Splitting a square root across addition',
      md: md`Extract square factors from a product. As a check on an attempted sum rule, $\sqrt{9+16}=5$ while $3+4=7$.`
    }
  ],
  check: [
    {
      id: 'check-1',
      title: 'An exact classification',
      topic: 'Arithmetic and algebra',
      stemMd: 'Which expression has an irrational value?',
      options: [
        {
          id: 'A',
          text: md`$\sqrt{121}$`,
          note: 'This square root equals the integer eleven.'
        },
        {
          id: 'B',
          text: md`$0.125$`,
          note: 'This terminating decimal equals one eighth.'
        },
        {
          id: 'C',
          text: md`$\sqrt{45}$`,
          note: ''
        },
        {
          id: 'D',
          text: md`$5^{-2}$`,
          note: 'This negative exponent gives one twenty-fifth.'
        },
        {
          id: 'E',
          text: md`$\sqrt{49}/2$`,
          note: 'This expression equals the fraction seven halves.'
        }
      ],
      answer: 'C',
      workingMd: md`Write $45=9\times5$. Its square root is $3\sqrt5$ and the prime five has odd exponent, so the root is irrational.`,
      lesson: 'Simplify a radical before classifying it.'
    },
    {
      id: 'check-2',
      title: 'Two close magnitudes',
      topic: 'Arithmetic and algebra',
      stemMd: 'Which list is in increasing order?',
      options: [
        {
          id: 'A',
          text: md`$\sqrt{15},4,\sqrt{17}$`,
          note: ''
        },
        {
          id: 'B',
          text: md`$4,\sqrt{15},\sqrt{17}$`,
          note: 'The square of four exceeds fifteen, so four cannot come first.'
        },
        {
          id: 'C',
          text: md`$\sqrt{17},4,\sqrt{15}$`,
          note: 'This arranges the three quantities in decreasing order.'
        },
        {
          id: 'D',
          text: md`$\sqrt{15},\sqrt{17},4$`,
          note: 'Seventeen exceeds sixteen, so its square root exceeds four.'
        },
        {
          id: 'E',
          text: md`$4,\sqrt{17},\sqrt{15}$`,
          note: 'The smallest radical has been placed last.'
        }
      ],
      answer: 'A',
      workingMd: 'All values are positive. Their squares are fifteen, sixteen and seventeen in that order.',
      lesson: 'Squaring preserves order for nonnegative quantities.'
    },
    {
      id: 'check-3',
      title: 'A power quotient',
      topic: 'Arithmetic and algebra',
      stemMd: md`What is $2^{-2}\times 2^5/2^4$?`,
      options: [
        {
          id: 'A',
          text: md`$-2$`,
          note: 'A negative exponent does not make a positive base negative.'
        },
        {
          id: 'B',
          text: md`$2$`,
          note: 'This uses the absolute value of the final exponent.'
        },
        {
          id: 'C',
          text: md`$128$`,
          note: 'This adds the denominator exponent instead of subtracting it.'
        },
        {
          id: 'D',
          text: md`$1/2$`,
          note: ''
        },
        {
          id: 'E',
          text: md`$8$`,
          note: 'This multiplies the two numerator powers and omits division by the denominator.'
        }
      ],
      answer: 'D',
      workingMd: md`The combined exponent is $-2+5-4=-1$. The value is the reciprocal of two.`,
      lesson: 'Add exponents of factors, and subtract exponents belonging to divisors.'
    }
  ],
  takeaways: [
    'An integer and a terminating decimal are both rational.',
    'A negative exponent takes a reciprocal.',
    'Normalise powers of ten before comparing magnitudes.'
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
