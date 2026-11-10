import { md, type Lesson } from '../../types';

export const radicalAndAbsoluteValueInequalitiesLesson: Lesson = {
  slug: 'radical-and-absolute-value-inequalities',
  title: 'Radical and absolute-value inequalities',
  summary: 'Use domain and sign conditions before squaring a radical inequality, and translate absolute-value bounds into distances on the real line.',
  minutes: 18,
  objectives: [
    'Find the real domain of a square root.',
    'Divide a radical comparison into sign cases.',
    'Translate an absolute-value inequality into intervals.'
  ],
  teachMd: md`### Decide whether the comparison exists

The square root (*radice quadrata*) in a real inequality denotes the nonnegative square root. It makes sense when the expression inside it is greater than or equal to zero. If the root itself is the denominator, equality there would make the denominator zero, so only positive inputs to that root remain. Write the domain beside the original question. Every later step takes place on that domain, even if the square root disappears from the algebra.

Squaring preserves the order of two nonnegative numbers. To see why, take two such numbers with the larger one first. The difference of their squares factors into their difference times their sum. The sum is positive unless they are both zero, so the difference of squares has the same sign as the difference you started with. Once negative values enter, this argument no longer works. For example negative three is below one, although its square is above one. Identify the sign of the other side before squaring an inequality with a root.

### Split by the sign on the other side

Consider $\sqrt{A(x)}<B(x)$. The left member is at least zero, so a strict upper bound must be positive. Keep $A(x)\ge0$ and $B(x)>0$, then solve $A(x)<B(x)^2$ under those two conditions. For a weak upper bound, use $B(x)\ge0$ and replace the strict squared comparison by a weak one. At an input with $B(x)=0$, the weak comparison accepts a zero root only. You can test that boundary in the original statement.

For $\sqrt{A(x)}>B(x)$ the negative branch has the opposite role. Every point in the domain with a negative right member already works, even a point where the root equals zero. Keep that entire branch. On the branch where the right member is nonnegative, both sides can safely be squared. Solve the squared inequality there and take the union with the branch you saved. The same split works with a weak lower bound if you allow equality in the squared comparison. A single squaring across both branches can throw away valid solutions precisely because the negative number may have large magnitude.

### Read absolute value as distance

Absolute value (*valore assoluto*) gives the distance from zero, and $|x-c|$ gives the distance between two positions $x$ and $c$. When a positive number $r$ is an upper bound for that distance, mark the point $c$ and go $r$ units left and right. The admissible inputs lie between those positions. A strict bound excludes the two positions themselves. If the question instead asks for a distance at least $r$, take the two outer rays and include the endpoints. The geometry tells you whether the two pieces should be joined with “and” or “or”.

A threshold of zero needs its own reading: zero distance means coincidence, while positive distance means any position except the centre. A negative threshold cannot exceed a nonnegative distance in a strict upper-bound question. For a variable threshold, record where it is positive, zero or negative before applying the distance rules. This is the same sign decision that made the radical comparison reliable.

### Translate a linear expression into a distance

If the expression inside the bars is linear, factor out the coefficient of the variable. The identity $|ab|=|a||b|$ makes the outside coefficient positive even when the original coefficient was negative. Divide the threshold by that positive number and read the centre from the remaining bracket. As an alternative, solve separate linear inequalities on the two sides of the point where the expression inside the bars changes sign. At the end check the centre, a boundary point and a point well outside the interval. Together they tell you whether you selected the right region and handled equality correctly.`,
  examples: [
    {
      id: 'example-1',
      title: 'An upper bound with a variable right side',
      problemMd: md`Solve $\sqrt{x+2}<x$ over the reals.`,
      steps: [
        md`Require $x\ge-2$ for existence and $x>0$ because the right side must exceed a nonnegative value.`,
        md`Now square to get $x+2<x^2$, or $(x-2)(x+1)>0$. The squared condition gives $x<-1$ or $x>2$.`,
        'Only the latter branch meets the positive-right-side condition.'
      ],
      answerMd: md`The solution is $x>2$. At two the heights coincide.`
    },
    {
      id: 'example-2',
      title: 'Keep the automatic branch',
      problemMd: md`Solve $\sqrt{x+2}>x$ over the reals.`,
      steps: [
        md`The domain is $x\ge-2$. In $-2\le x<0$ the right side is negative, so all these points work.`,
        md`For $x\ge0$ square to get $(x-2)(x+1)<0$. Its overlap with the branch is $0\le x<2$.`,
        'Join the two adjacent pieces and keep the domain boundary at negative two.'
      ],
      answerMd: md`The solution is $-2\le x<2$. Blind squaring would lose the leftmost inputs.`
    }
  ],
  traps: [
    {
      title: 'Discarding a zero radicand',
      md: 'A zero inside the radical gives the defined value zero. Decide whether it works using the original comparison.'
    },
    {
      title: 'Joining outer rays with and',
      md: 'A large distance can occur on either side of the centre. No point can lie strictly left of the lower boundary and strictly right of the upper boundary simultaneously.'
    }
  ],
  check: [
    {
      id: 'check-1',
      title: 'A distance threshold',
      topic: 'Equations, inequalities and systems',
      stemMd: md`For real $x$, solve $|3x-6|\ge9$.`,
      options: [
        {
          id: 'A',
          text: md`$-1\le x\le5$`,
          note: 'This selects distances at most three from the centre.'
        },
        {
          id: 'B',
          text: md`$x\le-1$ or $x\ge5$`,
          note: ''
        },
        {
          id: 'C',
          text: md`$x<-1$ or $x>5$`,
          note: 'The weak comparison also permits both boundary positions.'
        },
        {
          id: 'D',
          text: md`$x\ge5$ only`,
          note: 'Distances of at least three also occur to the left of two.'
        },
        {
          id: 'E',
          text: md`$x\le-7$ or $x\ge11$`,
          note: 'This keeps the old threshold nine after factoring three from the bars.'
        }
      ],
      answer: 'B',
      workingMd: md`Divide by three to obtain $|x-2|\ge3$. The two positions three units from two are negative one and five. Include them and take the exterior.`,
      lesson: 'Scale the threshold when extracting a factor from absolute value.'
    },
    {
      id: 'check-2',
      title: 'A constant lower bound',
      topic: 'Equations, inequalities and systems',
      stemMd: md`For real $t$, solve $\sqrt{5-t}>-3$.`,
      options: [
        {
          id: 'A',
          text: md`$t<5$`,
          note: 'At five the square root is zero, which still exceeds negative three.'
        },
        {
          id: 'B',
          text: md`$t<-4$`,
          note: 'This squares a negative right member, imposing an unnecessary restriction.'
        },
        {
          id: 'C',
          text: 'All real numbers',
          note: 'The root still requires a nonnegative radicand.'
        },
        {
          id: 'D',
          text: md`$t\le5$`,
          note: ''
        },
        {
          id: 'E',
          text: md`$t\ge5$`,
          note: 'This reverses the domain when isolating the variable.'
        }
      ],
      answer: 'D',
      workingMd: md`Every defined square root is at least zero and exceeds negative three. The only restriction is $5-t\ge0$, or $t\le5$.`,
      lesson: 'A negative lower bound is automatic wherever the square root exists.'
    },
    {
      id: 'check-3',
      title: 'An inclusive upper bound',
      topic: 'Equations, inequalities and systems',
      stemMd: md`Which real inputs satisfy $\sqrt{2x}\le x$?`,
      options: [
        {
          id: 'A',
          text: md`$x\ge2$ only`,
          note: 'Zero gives equality and must also be included.'
        },
        {
          id: 'B',
          text: md`$0\le x\le2$`,
          note: 'At one the root of two exceeds one, so the middle region fails.'
        },
        {
          id: 'C',
          text: md`$x=0$ or $x\ge2$`,
          note: ''
        },
        {
          id: 'D',
          text: md`$x\le0$ or $x\ge2$`,
          note: 'Negative inputs do not lie in the real domain of this root.'
        },
        {
          id: 'E',
          text: md`$x=0$ or $x>2$`,
          note: 'At two both sides equal two, so this boundary belongs.'
        }
      ],
      answer: 'C',
      workingMd: md`The domain $x\ge0$ makes both sides nonnegative. Squaring gives $x(x-2)\ge0$. Intersect $x\le0$ or $x\ge2$ with the domain, leaving zero and the right ray.`,
      lesson: 'Intersect the squared answer with the domain, including isolated points that survive.'
    }
  ],
  takeaways: [
    'Record the real domain before removing a root.',
    'Square a comparison only on a branch where both sides are nonnegative.',
    'Read a positive absolute-value threshold as a distance from a centre.'
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
