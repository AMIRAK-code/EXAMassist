import { md, type Lesson } from '../../types';

export const rationalInequalitiesAndSystemsLesson: Lesson = {
  slug: 'rational-inequalities-and-systems',
  title: 'Rational inequalities and systems',
  summary: 'Build a sign chart for an algebraic fraction, handle holes and repeated factors, and intersect the answers to simultaneous inequalities.',
  minutes: 18,
  objectives: [
    'Distinguish denominator exclusions from numerator zeros.',
    'Find the sign of a quotient on each interval.',
    'Intersect solution sets for simultaneous conditions.'
  ],
  teachMd: md`### Start from the original denominator

A rational inequality (*disequazione fratta*) compares a ratio of polynomials with another expression. The first entry on the page should be the real inputs for which every original denominator is nonzero. These exclusions stay in force after any cancellation or rearrangement. An input at which a fraction is undefined cannot give equality and cannot give a positive or negative value either. Mark it on the number line with an open circle so it survives later simplifications.

Collect everything on one side. If one side was a nonzero number, subtract it and combine the terms over a common denominator. This step preserves the comparison because the same number is subtracted on both sides. Multiplying the inequality by a denominator of unknown sign would be different. Where that denominator is negative the direction would have to reverse, and where it is positive the direction would stay the same. A single unconditional multiplication would combine those two regions incorrectly.

### Build the sign chart from factors

Factor the numerator and denominator. Mark every real zero of either one on a single number line, in numerical order. Between two consecutive marks each factor keeps its sign, so their quotient also keeps its sign. To label a gap you can choose a simple input there and check each factor. Only the sign of the result matters. Multiplying several negative signs in pairs or counting them is usually easier than evaluating the whole fraction exactly.

For a linear factor such as $x-3$, the sign to the left of three is negative and to its right is positive. A factor written as $3-x$ has the opposite signs. A squared factor is positive everywhere it is nonzero. Do not alternate signs mechanically at each mark: two copies of a factor change signs together, leaving their product's sign unchanged. One way to check your chart is to test a large positive input in the rightmost gap and work back through the multiplicities.

A positive quotient has two routes. The numerator and denominator can both be positive, or both can be negative. Insisting that both are positive loses the second possibility. For a negative quotient the signs must differ. After selecting the open gaps, inspect each boundary separately. An allowed numerator zero belongs to an inclusive comparison with zero. A denominator zero is excluded even if the numerator also vanishes. A cancelled factor produces such a hole and may split an otherwise continuous solution interval into two pieces.

### Combine conditions using their meanings

A system (*sistema*) requires the same input to pass each condition at once. Solve the individual comparisons first, using separate lines if helpful. Shade the common part, called the intersection (*intersezione*). When the question instead asks where either condition holds, keep their union. Multiplying the left sides of two conditions and testing that product answers a different question: a positive product can arise when both factors are negative, even if the system demanded that both be positive.

Systems of equations can also be handled by substitution. If one equation gives $y$ in terms of $x$, insert that expression into the other equation, solve for $x$, then recover its matching $y$. The answers are ordered pairs. Giving every possible first coordinate paired with every possible second coordinate can create pairs that never satisfied the original equations. Substitute each pair into both equations to verify the matching.

### Check a boundary with the original comparison

A trial value in a gap verifies a sign, while a boundary substitution determines inclusion. Keep those two jobs separate. If your answer has an unbounded left part, a large negative test value is an inexpensive check on its direction. If the original comparison involved a constant on the right, use that original form once at the end. You may then catch a subtraction or distribution slip made while collecting terms into one numerator.`,
  examples: [
    {
      id: 'example-1',
      title: 'Compare a quotient with one',
      problemMd: md`For real $x$, solve $(2x+1)/(x-2)\ge1$.`,
      steps: [
        md`Exclude two. Subtract one and collect the numerator: $2x+1-(x-2)=x+3$.`,
        'The new quotient has critical positions negative three and two. Its signs from left to right are positive, negative and positive.',
        'Negative three gives equality. Two is forbidden.'
      ],
      answerMd: md`The solution is $x\le-3$ or $x>2$.`
    },
    {
      id: 'example-2',
      title: 'Intersect with a second condition',
      problemMd: md`Solve $(x-1)/(x+2)<0$ and $2x+3\ge0$ simultaneously.`,
      steps: [
        md`The fraction is negative on $-2<x<1$, since the two linear factors have opposite signs there.`,
        md`The second inequality gives $x\ge-3/2$. Keep the part of the first interval on or to the right of this point.`
      ],
      answerMd: md`The common solution is $-3/2\le x<1$.`
    }
  ],
  traps: [
    {
      title: 'Removing the denominator on sight',
      md: 'Multiplying by an expression with unknown sign leaves the inequality direction unsettled. Bring terms over one denominator instead.'
    },
    {
      title: 'Closing every endpoint',
      md: 'An inclusive comparison can include a numerator zero, but the denominator must still be defined and nonzero.'
    }
  ],
  check: [
    {
      id: 'check-1',
      title: 'A sign-changing quotient',
      topic: 'Equations, inequalities and systems',
      stemMd: md`For real $x$, where is $(x+4)/(x-1)>0$?`,
      options: [
        {
          id: 'A',
          text: md`$-4<x<1$`,
          note: 'Between the two marks the numerator and denominator have opposite signs.'
        },
        {
          id: 'B',
          text: md`$x>1$ only`,
          note: 'The left interval, where both factors are negative, also works.'
        },
        {
          id: 'C',
          text: md`$x\le-4$ or $x\ge1$`,
          note: 'This admits a zero and an undefined value into a strict inequality.'
        },
        {
          id: 'D',
          text: md`$x<-4$ or $x>1$`,
          note: ''
        },
        {
          id: 'E',
          text: md`$x<-4$ only`,
          note: 'Two positive factors also give a positive quotient on the right.'
        }
      ],
      answer: 'D',
      workingMd: 'The zero is negative four and the pole is one. The factors match signs outside these marks, and neither endpoint belongs.',
      lesson: 'Check both ways in which a quotient can be positive.'
    },
    {
      id: 'check-2',
      title: 'A hidden hole',
      topic: 'Equations, inequalities and systems',
      stemMd: md`Which real inputs satisfy $(x-2)^2/(x-2)\le0$?`,
      options: [
        {
          id: 'A',
          text: md`$x\le2$`,
          note: 'This includes two after cancelling, despite the original denominator.'
        },
        {
          id: 'B',
          text: md`$x<2$`,
          note: ''
        },
        {
          id: 'C',
          text: md`$x>2$`,
          note: 'The simplified factor is positive to the right of two.'
        },
        {
          id: 'D',
          text: md`$x=2$ only`,
          note: 'The proposed equality point is the one input the denominator excludes.'
        },
        {
          id: 'E',
          text: md`All real inputs except $x=2$`,
          note: 'Removing the hole is necessary, but positive values of the simplified expression still fail.'
        }
      ],
      answer: 'B',
      workingMd: md`When $x\ne2$ the quotient equals $x-2$. Its nonpositive inputs lie at or below two, and the domain removes two itself.`,
      lesson: 'Keep the hole left by a cancelled factor.'
    },
    {
      id: 'check-3',
      title: 'Simultaneous equations',
      topic: 'Equations, inequalities and systems',
      stemMd: md`Which ordered pairs satisfy both $y=x+1$ and $y=x^2-1$?`,
      options: [
        {
          id: 'A',
          text: md`$(2,3)$ only`,
          note: 'Negative one is another horizontal coordinate satisfying the substituted equation.'
        },
        {
          id: 'B',
          text: md`$(-1,0)$ only`,
          note: 'This loses the positive root of the quadratic.'
        },
        {
          id: 'C',
          text: md`$(-1,3)$ and $(2,0)$`,
          note: 'These use the right sets of coordinates but pair them the wrong way round.'
        },
        {
          id: 'D',
          text: md`$(1,2)$ and $(-2,-1)$`,
          note: 'These use roots with the opposite signs. Neither pair satisfies the quadratic relation.'
        },
        {
          id: 'E',
          text: md`$(-1,0)$ and $(2,3)$`,
          note: ''
        }
      ],
      answer: 'E',
      workingMd: md`Equating the two expressions gives $x^2-x-2=(x-2)(x+1)=0$. Inserting the roots into $y=x+1$ gives zero for negative one and three for two.`,
      lesson: 'Recover the second coordinate separately for each first coordinate.'
    }
  ],
  takeaways: [
    'Put exclusions on the number line before simplifying.',
    'Select gaps by signs and inspect boundary points individually.',
    'A system keeps the overlap of all its conditions.'
  ],
  practice: {
    examKey: 'tolc-i',
    domain: 'tolci-mathematics',
    skill: 'tolci-math-equations'
  },
  review: {
    aiAssisted: true,
    independentCheckOn: '2026-11-10',
    expertReview: null
  }
};
