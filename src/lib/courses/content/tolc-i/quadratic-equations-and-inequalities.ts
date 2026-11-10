import { md, type Lesson } from '../../types';

export const quadraticEquationsAndInequalitiesLesson: Lesson = {
  slug: 'quadratic-equations-and-inequalities',
  title: 'Quadratic equations and inequalities',
  summary: 'Use factors, the discriminant and the direction of a parabola to locate every real solution of a quadratic equation or inequality.',
  minutes: 18,
  objectives: [
    'Find the real roots of a quadratic.',
    'Decide which intervals have the required sign.',
    'Handle repeated roots and strict endpoints.'
  ],
  teachMd: md`### Read the question as a height

Imagine a point moving along the graph of $y=x^2-9$. At each horizontal position the formula gives its height above or below the axis. For real $x$, would the point be below the axis at $x=-4$? What about at $x=0$? Work out both heights before continuing. At the first position the square is $16$, so the height is $7$. At the second it is $-9$. A negative input can give a positive height. The inequality (*disequazione*) asks about the sign of the output.

An equation asks where the height equals zero. Its solutions, called roots, mark possible boundaries for an inequality involving the same expression. In the moving-point example the roots are $-3$ and $3$. Move from left to right and the curve passes below the axis at the first root and emerges at the second. The solutions of $x^2-9<0$ therefore form one open interval. Writing $x<3$ alone would accidentally admit the first position you tested.

### Find the boundaries exactly

Collect the terms on one side so that the other side reads zero. If the expression factors, each factor can be set equal to zero in turn. For a quadratic equation in the form $ax^2+bx+c=0$, where $a\ne0$, the formula $x=(-b\pm\sqrt{b^2-4ac})/(2a)$ also gives the roots when they are real. Include the coefficient's sign when you substitute, and divide the whole numerator by the denominator. Keep a square root in exact form if it does not simplify neatly.

The discriminant (*discriminante*) is the quantity under that square root. A positive discriminant gives two different real roots. Zero gives one repeated root, because adding and subtracting zero have the same effect. A negative discriminant gives no real roots. When a coefficient is unknown, you can sometimes answer a question about the number of roots without finding either root. For instance, the discriminant of $x^2+2x+k$ is $4-4k$. The two roots coincide precisely when $k=1$, as you can verify by writing the expression as a square.

### Decide the sign on each interval

With distinct roots $r<s$, write the quadratic as $a(x-r)(x-s)$. To the left of both roots the two bracketed factors are negative. Between the roots only the second is negative, and to the right both are positive. The product of the brackets therefore changes sign at each crossing. Multiplication by the leading coefficient gives the final sign. In particular, a negative leading coefficient makes both outer intervals negative and the middle interval positive. You can draw a short number line with two marks and write the signs over the gaps.

A sample value gives another way to recover the sign on a gap. The curve cannot switch from positive to negative there without passing through zero, and all its zeros are already marked. Choose an easy value *inside* the gap. Zero is convenient when the constant term is nonzero, since the height at zero equals the constant term. When zero is itself a root it tells you nothing about either neighbouring gap. Use another value, perhaps the midpoint between the roots, to decide the sign there.

### Read the marks as well as the gaps

A strict inequality excludes every root. An inclusive one admits a root even if neither neighbouring interval works. For example, a square is positive on both sides of its repeated root, but equals zero at the root itself. Asking where a square is less than or equal to zero can therefore leave a single point. With no real roots the entire curve stays on one side of the axis. A single substitution then settles the sign everywhere. Finally, translate your number line back into the language of the question. If it asks for integers, count the eligible integer positions only after settling which boundary points belong.`,
  examples: [
    {
      id: 'example-1',
      title: 'An upward parabola',
      problemMd: md`Solve $x^2-5x+6<0$ over the real numbers.`,
      steps: [
        md`The factors are $(x-2)(x-3)$ because the constants multiply to six and sum to negative five.`,
        'The heights at the roots are zero. Between them the factors have opposite signs, and outside they have matching signs.'
      ],
      answerMd: md`The solution is $2<x<3$. The endpoints solve the associated equation only.`
    },
    {
      id: 'example-2',
      title: 'Change all the coefficients',
      problemMd: md`Solve $-x^2+5x-6<0$ over the real numbers.`,
      steps: [
        md`The expression is $-(x-2)(x-3)$, so the two boundary positions stay fixed.`,
        'Each nonzero height changes sign. The outer intervals now lie below the axis.',
        'Check an outer point: at zero the height is negative six.'
      ],
      answerMd: md`Take $x<2$ or $x>3$. Negating all the coefficients reflects every height across the axis.`
    }
  ],
  traps: [
    {
      title: 'Taking the root of a square',
      md: md`The principal square root of $x^2$ is $|x|$. For $x^2<9$ both lower and upper bounds matter.`
    },
    {
      title: 'Testing a boundary',
      md: 'If the trial value gives zero, it locates a root. Move into the gap before assigning its sign.'
    }
  ],
  check: [
    {
      id: 'check-1',
      title: 'A closed solution set',
      topic: 'Equations, inequalities and systems',
      stemMd: md`Which real inputs satisfy $-2x^2+8x-6\ge0$?`,
      options: [
        {
          id: 'A',
          text: md`$x\le1$ or $x\ge3$`,
          note: 'This assigns the positive sign to the outer gaps of a downward parabola.'
        },
        {
          id: 'B',
          text: md`$1<x<3$`,
          note: 'Both endpoints give zero and satisfy the inclusive sign.'
        },
        {
          id: 'C',
          text: md`$1\le x\le3$`,
          note: ''
        },
        {
          id: 'D',
          text: md`$x\le3$`,
          note: 'This includes zero, where the expression is negative.'
        },
        {
          id: 'E',
          text: md`$x=1$ or $x=3$`,
          note: 'These are the zeros alone. The value at two is also admissible.'
        }
      ],
      answer: 'C',
      workingMd: md`Divide by negative two and reverse the sign. The resulting product $(x-1)(x-3)\le0$ holds between the roots and at both endpoints.`,
      lesson: 'Include the roots when equality is allowed.'
    },
    {
      id: 'check-2',
      title: 'A parameter at the boundary',
      topic: 'Equations, inequalities and systems',
      stemMd: md`For which real $h$ does $x^2-6x+h=0$ have precisely one real root?`,
      options: [
        {
          id: 'A',
          text: md`$h=3$`,
          note: 'Three is the position of the vertex, rather than the required constant.'
        },
        {
          id: 'B',
          text: md`$h=-9$`,
          note: 'This sign gives a positive discriminant and two roots.'
        },
        {
          id: 'C',
          text: md`$h=36$`,
          note: 'This uses the squared middle coefficient without dividing by four.'
        },
        {
          id: 'D',
          text: md`$h=9$`,
          note: ''
        },
        {
          id: 'E',
          text: md`$h=0$`,
          note: 'This gives the distinct roots zero and six.'
        }
      ],
      answer: 'D',
      workingMd: md`One root requires $36-4h=0$, giving $h=9$. The equation becomes $(x-3)^2=0$.`,
      lesson: 'A repeated root gives a zero discriminant.'
    },
    {
      id: 'check-3',
      title: 'A curve above the axis',
      topic: 'Equations, inequalities and systems',
      stemMd: md`Which real inputs satisfy $x^2-2x+3<0$?`,
      options: [
        {
          id: 'A',
          text: 'All real numbers',
          note: 'This reverses the sign of a quadratic that stays above the axis.'
        },
        {
          id: 'B',
          text: 'No real numbers',
          note: ''
        },
        {
          id: 'C',
          text: md`$x<0$`,
          note: 'A negative input does not force the height to be negative.'
        },
        {
          id: 'D',
          text: md`$x=1$ only`,
          note: 'One minimises the expression, but the minimum is positive.'
        },
        {
          id: 'E',
          text: md`$x<1$`,
          note: 'The curve decreases on this interval, which does not make its height negative.'
        }
      ],
      answer: 'B',
      workingMd: md`Completing the square gives $(x-1)^2+2$, at least two for every real input. It can never be below zero.`,
      lesson: 'A minimum above zero settles the sign everywhere.'
    }
  ],
  takeaways: [
    'Use the roots as boundary marks on the real line.',
    'The leading coefficient controls the sign outside two distinct roots.',
    'Check the endpoints separately for inclusive signs.'
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
