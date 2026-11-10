import { md, type Lesson } from '../../types';

export const exponentialAndLogarithmicEquationsLesson: Lesson = {
  slug: 'exponential-and-logarithmic-equations',
  title: 'Exponential and logarithmic equations and inequalities',
  summary: 'Rewrite powers with a common base, use a positive substitution, and solve logarithmic comparisons while preserving the original domain.',
  minutes: 18,
  objectives: [
    'Compare exponents for increasing and decreasing bases.',
    'Reduce a quadratic in an exponential to a polynomial.',
    'Enforce every logarithm’s argument restrictions.'
  ],
  teachMd: md`### Choose a common base

An exponential equation (*equazione esponenziale*) puts an unknown in an exponent. For a fixed positive base other than one, each different real exponent gives a different value. Consequently matching two powers with the same base is equivalent to matching their exponents. Try to recognise exact powers on both sides before turning to logarithms. Eight and one quarter can both be written as powers of two, for instance. A negative exponent changes a power into its reciprocal, so fractions often hide the most convenient common base.

For an inequality, first decide whether increasing the exponent increases the value. Repeated multiplication by a number above one increases a positive starting quantity. Multiplication by a number between zero and one decreases it. This order continues for real exponents. Thus with the same base above one the larger power has the larger exponent. With the same base below one, the larger power has the smaller exponent. When you rewrite a reciprocal base as a negative exponent of a base above one, use the direction rule for the new base, then handle the minus sign in the exponent as ordinary algebra.

### Spot a repeated exponential

An expression with both $a^{2x}$ and $a^x$ contains a square and its base, since $a^{2x}=(a^x)^2$. Give $a^x$ a short name and solve the resulting quadratic. The new quantity is strictly positive for every real exponent. Keep that restriction next to the substitution and filter the roots of the quadratic before trying to recover the original unknown. A negative temporary root may be entirely valid for the polynomial while representing no possible exponential value.

A positive temporary root still needs translation back into an exponent. If the number is an obvious power, read the exponent directly. Otherwise the logarithm gives an exact answer: $\log_a u$ means the exponent needed on $a$ to obtain positive $u$. There is no need to estimate its decimal expansion to give a value or compare it with consecutive integers. Compare $u$ with nearby powers of the same base to bracket the exponent. Remember to reverse this comparison if the base is below one.

### Restrict the logarithms before combining them

For a real logarithm (*logaritmo*), the argument must be strictly positive. In a sum of two logarithms there are two separate requirements. Their product can be positive when both original arguments are negative, so replacing the sum by the logarithm of a product can conceal forbidden inputs. List the original restrictions and take their intersection. You can then safely use the product rule on that domain. Subtraction of logarithms corresponds to division of arguments, with both original arguments again positive.

If two logarithms with the same valid base are equal, their positive arguments are equal. If they are compared by an inequality, their order follows the order of their arguments for a base above one and reverses for a base below one. Think of the logarithm as reading off an exponent from a power. For a decreasing exponential, a larger positive argument needs a smaller exponent, which explains the reversal without a separate rule to memorise.

### Decide how much evaluation the question needs

A comparison with zero is particularly simple because every valid base to the power zero gives one. For a base above one a positive logarithm has argument greater than one. For a base below one a positive logarithm has argument between zero and one. Those endpoints perform different jobs: zero marks loss of the domain, while one gives a defined logarithm equal to zero. Give each endpoint its own test if the comparison allows equality. Finally, check any candidate in the original expression before reporting it. A substitution often reduces a complicated expression to an integer power you can verify in one line.`,
  examples: [
    {
      id: 'example-1',
      title: 'Discard a temporary root',
      problemMd: md`Find all real $x$ with $9^x+2(3^x)=15$.`,
      steps: [
        md`Set $u=3^x>0$, so $9^x=u^2$. Rearrange to $u^2+2u-15=0$.`,
        md`The factors $(u+5)(u-3)$ give negative five and positive three. Only three can be an exponential value.`,
        md`Recover the exponent from $3^x=3$.`
      ],
      answerMd: md`The unique solution is $x=1$. It gives $9+6=15$.`
    },
    {
      id: 'example-2',
      title: 'Combine logarithms on their domain',
      problemMd: md`Solve $\log_2(x-1)+\log_2(x+2)=2$.`,
      steps: [
        md`Both arguments must be positive, giving $x>1$. Combine into $\log_2((x-1)(x+2))=2$.`,
        md`The product must be four. Rearrange to $x^2+x-6=(x+3)(x-2)=0$.`,
        'Only two lies in the original domain. Its arguments are one and four.'
      ],
      answerMd: md`The answer is $x=2$. Negative three makes the product positive but both individual logarithms undefined.`
    }
  ],
  traps: [
    {
      title: 'Keeping zero after an exponential substitution',
      md: 'An exponential value can approach zero but never reaches it for a finite real exponent. Reject zero as well as negative temporary roots.'
    },
    {
      title: 'Confusing products with sums',
      md: 'Logarithm addition makes multiplication of arguments. A logarithm of a sum has no corresponding sum rule.'
    }
  ],
  check: [
    {
      id: 'check-1',
      title: 'A reciprocal base',
      topic: 'Equations, inequalities and systems',
      stemMd: md`Solve $(1/3)^{2x-1}\ge 1/27$ over the reals.`,
      options: [
        {
          id: 'A',
          text: md`$x\ge2$`,
          note: 'This keeps the exponent direction for a decreasing base.'
        },
        {
          id: 'B',
          text: md`$x\le1$`,
          note: 'This subtracts one instead of adding it when isolating the exponent.'
        },
        {
          id: 'C',
          text: md`$x\le2$`,
          note: ''
        },
        {
          id: 'D',
          text: md`$x<2$`,
          note: 'Equality occurs at two, so this loses an allowed endpoint.'
        },
        {
          id: 'E',
          text: md`$x\ge-1$`,
          note: 'This treats the left base as three and compares exponents with negative three. The left base is one third.'
        }
      ],
      answer: 'C',
      workingMd: md`Write $1/27=(1/3)^3$. The base is decreasing, so $2x-1\le3$. Thus $x\le2$.`,
      lesson: 'Identify the base after rewriting both sides before deciding direction.'
    },
    {
      id: 'check-2',
      title: 'An argument bound',
      topic: 'Equations, inequalities and systems',
      stemMd: md`Which real $x$ satisfy $\log_{1/2}(x+3)>0$?`,
      options: [
        {
          id: 'A',
          text: md`$x>-2$`,
          note: 'A base below one gives negative logarithms for arguments above one.'
        },
        {
          id: 'B',
          text: md`$-3<x<-2$`,
          note: ''
        },
        {
          id: 'C',
          text: md`$x<-2$`,
          note: 'This includes zero and negative arguments, which are outside the domain.'
        },
        {
          id: 'D',
          text: md`$-3\le x<-2$`,
          note: 'At negative three the argument is zero and the logarithm is undefined.'
        },
        {
          id: 'E',
          text: md`$-3<x\le-2$`,
          note: 'At negative two the logarithm equals zero, failing the strict inequality.'
        }
      ],
      answer: 'B',
      workingMd: md`With base one half, a positive exponent produces a number strictly between zero and one. Solve $0<x+3<1$ by subtracting three.`,
      lesson: 'Keep the strict positive-argument condition beside the comparison.'
    },
    {
      id: 'check-3',
      title: 'A quadratic substitution',
      topic: 'Equations, inequalities and systems',
      stemMd: md`How many distinct real solutions does $4^x-5(2^x)+4=0$ have?`,
      options: [
        {
          id: 'A',
          text: 'Zero',
          note: 'Both temporary roots are positive and can be achieved by powers of two.'
        },
        {
          id: 'B',
          text: 'One',
          note: 'Keeping only the root four overlooks that one is also a power of two.'
        },
        {
          id: 'C',
          text: 'Three',
          note: 'The temporary substitution introduces no additional solution of its own.'
        },
        {
          id: 'D',
          text: 'Four',
          note: 'The base four does not count the possible exponents.'
        },
        {
          id: 'E',
          text: 'Two',
          note: ''
        }
      ],
      answer: 'E',
      workingMd: md`With $u=2^x$ the polynomial is $(u-1)(u-4)=0$. Its positive roots correspond to $x=0$ and $x=2$, giving two solutions.`,
      lesson: 'Each positive temporary root corresponds to one exponent for a fixed valid base.'
    }
  ],
  takeaways: [
    'Use the same valid base before matching exponents.',
    'An exponential substitution takes strictly positive values.',
    'Check original logarithm arguments even after combining them.'
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
