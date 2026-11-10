import { md, type Lesson } from '../../types';

export const polynomialDivisionAndFactorisationLesson: Lesson = {
  slug: 'polynomial-division-and-factorisation',
  title: 'Polynomial division and factorisation',
  summary: 'Use the remainder theorem and Ruffini’s rule to divide by a linear factor, then factor higher-degree expressions and simplify fractions.',
  minutes: 18,
  objectives: [
    'Evaluate a remainder by substitution.',
    'Carry out synthetic division by a monic linear divisor.',
    'Factor a polynomial and preserve exclusions when cancelling.'
  ],
  teachMd: md`### Ask what is left at a root

A polynomial (*polinomio*) collects powers of the same variable with their coefficients. Dividing one polynomial by another produces a quotient and possibly a remainder. As in integer division, multiplication reconstructs the dividend. If the divisor is $x-a$, the identity is $P(x)=(x-a)Q(x)+r$, where the remainder is constant because its degree must be smaller than one. This identity holds for every input, including the one at which the divisor vanishes.

Substitute $x=a$ and the entire product disappears. What remains is $P(a)=r$, the remainder theorem (*teorema del resto*). If the answer needed is just the remainder, this substitution saves all the division. If the answer is zero, the identity becomes an exact factorisation. A positive constant in the written divisor can make the substitution look backwards: the divisor $x+5$ vanishes at negative five. Determine the input by setting the divisor equal to zero before putting any numbers into the polynomial.

### Recover the quotient one coefficient at a time

Synthetic division (*regola di Ruffini*) records the same division with only the coefficients visible. Arrange them from the highest power down to the constant. Give every missing power a zero placeholder. Dividing a cubic by a linear polynomial gives a quadratic quotient, so there will be three quotient coefficients followed by one remainder. The degree count is an immediate check on whether you have lost a column.

Bring down the first coefficient. Multiply it by the root of the divisor, then add the result to the next input coefficient. Repeat, multiplying the most recent result by the same root and adding the next coefficient each time. The last entry is the remainder. To see why addition appears, suppose the leading term of the quotient is $bx^2$. Multiplying it by $x-a$ contributes $bx^3-abx^2$. After subtracting that product, the coefficient available for the next term includes the original coefficient *plus* $ab$. Each addition repeats this cancellation at one lower power.

This particular coefficient rule assumes the divisor is monic, meaning its leading coefficient is one. If a divisor is written as $2x-4$, take out the factor two and divide first by $x-2$. Halve the resulting quotient to compensate for the doubled divisor. The constant remainder stays the same. Multiplying back is a stronger check than substituting the root alone, because two expressions with the same value at the root could still have different quotients.

### Choose the cheapest factorisation

Look for a factor shared by every term before trying possible roots. Next check for a difference of squares, a perfect square or repeated brackets. In a fourth-degree expression containing only even powers, give $x^2$ a temporary name. The resulting quadratic can reveal factors that are still differences of squares when the original variable is restored. State which number system you are working in if the request is to factor completely. A positive sum of squares such as $x^2+1$ has no linear factor over the real numbers.

When a polynomial with integer coefficients is monic, every integer root divides its constant term. You can check such candidates quickly by substitution. After finding a root, use division to lower the degree and try the remaining factor separately. This test helps find integer roots, while a polynomial might also have irrational roots or no real roots at all. A failed candidate establishes only that its particular linear factor does not divide exactly.

### Use factors inside a fraction

In an algebraic fraction the denominator must have a value different from zero. Record all forbidden inputs from its original form before simplifying. Cancellation divides the numerator and denominator by a shared nonzero factor. It can remove a whole bracket after factorisation, but cannot reach into a sum to remove a term from one side. The simplified formula agrees with the original at every allowed input. A cancelled bracket can leave an input at which the new formula looks perfectly ordinary even though the original fraction was undefined.`,
  examples: [
    {
      id: 'example-1',
      title: 'Divide with a missing power',
      problemMd: md`Divide $x^3-7x+6$ by $x-2$.`,
      steps: [
        md`Use coefficients $1,0,-7,6$ and root two. Bring down one, then add two to zero to get two.`,
        'Multiply two by two and add negative seven to get negative three. Multiply negative three by two and add six to get zero.',
        'Read the first three entries as the coefficients of a quadratic.'
      ],
      answerMd: md`The quotient is $x^2+2x-3$ and the remainder is zero. Multiplication by $x-2$ restores the original cubic.`
    },
    {
      id: 'example-2',
      title: 'Split a quartic',
      problemMd: md`Factor $x^4-10x^2+9$ into real linear factors.`,
      steps: [
        md`Set $u=x^2$. Two numbers summing to negative ten and multiplying to nine are negative one and negative nine.`,
        md`Restore $x$ in $(u-1)(u-9)$ and recognise two differences of squares.`
      ],
      answerMd: md`The factorisation is $(x-1)(x+1)(x-3)(x+3)$.`
    }
  ],
  traps: [
    {
      title: 'Dropping a missing power',
      md: 'Without a zero placeholder the next coefficient moves into the wrong column. Write the powers in order before stripping them away.'
    },
    {
      title: 'Testing the visible constant',
      md: md`The input is the zero of the divisor. Solve $x-a=0$ even when the divisor is written with an addition sign.`
    }
  ],
  check: [
    {
      id: 'check-1',
      title: 'A remainder only',
      topic: 'Arithmetic and algebra',
      stemMd: md`What is the remainder when $2x^3-x+5$ is divided by $x+2$?`,
      options: [
        {
          id: 'A',
          text: '19',
          note: 'This evaluates the polynomial at positive two.'
        },
        {
          id: 'B',
          text: md`$-13$`,
          note: 'This uses negative two for the cubic but positive two for the linear substitution.'
        },
        {
          id: 'C',
          text: md`$-9$`,
          note: ''
        },
        {
          id: 'D',
          text: md`$-14$`,
          note: 'This omits the constant five from the evaluation.'
        },
        {
          id: 'E',
          text: '0',
          note: 'The presence of a linear divisor does not make it a factor.'
        }
      ],
      answer: 'C',
      workingMd: md`At negative two the value is $2(-8)-(-2)+5=-9$.`,
      lesson: 'Evaluate at the zero of the divisor to get the remainder.'
    },
    {
      id: 'check-2',
      title: 'A missing coefficient',
      topic: 'Arithmetic and algebra',
      stemMd: md`For which $k$ is $x-3$ a factor of $x^3+kx-6$?`,
      options: [
        {
          id: 'A',
          text: md`$-7$`,
          note: ''
        },
        {
          id: 'B',
          text: '7',
          note: 'This misses the negative sign when moving twenty-one across the equals sign.'
        },
        {
          id: 'C',
          text: md`$-21$`,
          note: 'This stops at the value of three times the unknown coefficient.'
        },
        {
          id: 'D',
          text: md`$-11$`,
          note: 'This adds six instead of subtracting it when evaluating the constant.'
        },
        {
          id: 'E',
          text: '3',
          note: 'Three is the root used for substitution, rather than the coefficient.'
        }
      ],
      answer: 'A',
      workingMd: md`Set $27+3k-6=0$. Subtract twenty-one and divide by three to obtain negative seven.`,
      lesson: 'Turn exact divisibility into an equation for the coefficient.'
    },
    {
      id: 'check-3',
      title: 'A cancelled input',
      topic: 'Arithmetic and algebra',
      stemMd: md`Which expression and domain agree with $(x^2-16)/(x-4)$ on its original real domain?`,
      options: [
        {
          id: 'A',
          text: md`$x+4$, all real inputs`,
          note: 'The shortened formula is defined at four, which the original denominator forbids.'
        },
        {
          id: 'B',
          text: md`$x-4$, $x\ne4$`,
          note: 'Cancelling the matching factor leaves the other factor, which has a plus sign.'
        },
        {
          id: 'C',
          text: md`$x+4$, $x\ne-4$`,
          note: 'Negative four zeros the numerator only and is allowed.'
        },
        {
          id: 'D',
          text: md`$x+4$, $x\ne4$`,
          note: ''
        },
        {
          id: 'E',
          text: md`$x-4$, $x\ne-4$`,
          note: 'This keeps the wrong factor and excludes the numerator’s other zero.'
        }
      ],
      answer: 'D',
      workingMd: md`Factor the numerator as $(x-4)(x+4)$. Divide by the common nonzero factor on $x\ne4$, leaving $x+4$.`,
      lesson: 'Carry the original denominator exclusions through cancellation.'
    }
  ],
  takeaways: [
    'Substitution at the zero of a linear divisor finds the remainder.',
    'Synthetic division needs a place for every power.',
    'Record the original domain before cancelling common factors.'
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
