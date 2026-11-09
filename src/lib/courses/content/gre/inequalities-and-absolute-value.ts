import { md, type Lesson } from '../../types';

export const inequalitiesLesson: Lesson = {
  slug: 'inequalities-and-absolute-value',
  title: 'Inequalities and absolute value',
  summary: 'Solve linear inequalities, flip the sign only when you should, combine ranges correctly, and treat absolute value as distance on the number line.',
  minutes: 22,
  objectives: [
    'Solve a linear inequality, reversing the sign exactly when multiplying or dividing by a negative number.',
    'Combine two ranges to find the possible values of a sum or a difference.',
    md`Solve $|x - a| < b$ and $|x - a| > b$ by reading them as distances.`,
    'Solve an absolute value equation in two cases and reject any solution that fails the check.',
  ],
  teachMd: md`
### Inequalities behave like equations, with one exception

You may add or subtract the same number on both sides of an inequality, and you may multiply or divide both sides by the same **positive** number, without changing the direction of the sign. The exception: multiplying or dividing by a **negative** number reverses the sign.

Why? Multiplying by $-1$ reflects every number across zero on the number line, so the order of any two numbers flips. $2 < 5$, but $-2 > -5$.

$$7 - 3x \ge 19 \;\Rightarrow\; -3x \ge 12 \;\Rightarrow\; x \le -4$$

The sign flipped at the division by $-3$, and only there. Subtracting 7 did not flip it. To check the direction, test one value on each side of the boundary in the original inequality: $x = -5$ gives $22 \ge 19$ (true) and $x = 0$ gives $7 \ge 19$ (false), so the solution really is $x \le -4$.

### Never multiply by a variable of unknown sign

From $\frac{6}{x} > 2$ you cannot simply write $6 > 2x$, because if $x$ is negative the sign should flip. Unless the stem tells you the sign of $x$, treat the cases separately or test values. Here, a negative $x$ makes $\frac{6}{x}$ negative, which is never greater than 2, so $x$ must be positive, and then $6 > 2x$ gives $0 < x < 3$.

### Compound inequalities

An inequality such as $-3 < 2x + 1 \le 9$ is two inequalities at once. Do the same thing to all three parts: subtract 1 to get $-4 < 2x \le 8$, then divide by 2 to get $-2 < x \le 4$. Keep track of which ends are strict ($<$) and which include the endpoint ($\le$); a question that asks for the number of integers in a range turns on this.

### Combining ranges

If $-3 < x < 2$ and $1 < y < 5$, what values can $x + y$ and $x - y$ take?

- **Sum:** add the lower ends and add the upper ends: $-2 < x + y < 7$.
- **Difference:** the smallest $x - y$ uses the smallest $x$ and the **largest** $y$; the largest uses the largest $x$ and the **smallest** $y$. So $-3 - 5 < x - y < 2 - 1$, that is $-8 < x - y < 1$.

Subtracting the lower ends from each other ($-3 - 1 = -4$) and the upper ends from each other ($2 - 5 = -3$) gives a range that is too narrow and is a frequent wrong answer. Products are harder still, because signs interact; with mixed signs, test the four corner products.

### Absolute value is distance

$|x|$ is the distance from $x$ to $0$ on the number line, so it is never negative. More usefully, $|x - a|$ is the distance from $x$ to $a$. That reading turns absolute value inequalities into pictures:

| Statement | Meaning | Solution |
| --- | --- | --- |
| $\lvert x - a \rvert < b$ | within $b$ of $a$ | $a - b < x < a + b$ |
| $\lvert x - a \rvert > b$ | more than $b$ from $a$ | $x < a - b$ or $x > a + b$ |
| $\lvert x - a \rvert = b$ | exactly $b$ from $a$ | $x = a - b$ or $x = a + b$ |

For $|x + 4| \le 3$, rewrite $x + 4$ as $x - (-4)$: the points within 3 of $-4$, so $-7 \le x \le -1$. If the inside has a coefficient, as in $|2x - 5| \le 9$, write the compound form $-9 \le 2x - 5 \le 9$ and solve all three parts.

### Absolute value equations: two cases and a check

$|E| = k$ means $E = k$ or $E = -k$. When $k$ is a plain number, both cases are genuine solutions as long as $k \ge 0$; if $k$ is negative, there is no solution at all. When the right side contains the variable, as in $|x + 1| = 2x - 4$, solve both cases and then **substitute each answer into the original**: a case can produce a value that makes the right side negative, and an absolute value can never equal a negative number. Such a value is extraneous and must be thrown out.
`,
  examples: [
    {
      id: 'example-flip',
      title: 'Dividing by a negative',
      problemMd: md`Solve $7 - 3x \ge 19$.`,
      steps: [
        md`Subtract 7 from both sides. Subtraction never flips the sign: $-3x \ge 12$.`,
        md`Divide by $-3$. Dividing by a negative flips the sign: $x \le -4$.`,
        md`Check the boundary and one point on each side: $x = -4$ gives $19 \ge 19$ (true), $x = -5$ gives $22 \ge 19$ (true), $x = 0$ gives $7 \ge 19$ (false).`,
      ],
      answerMd: md`$x \le -4$. Forgetting to flip gives $x \ge -4$, which $x = 0$ shows to be wrong.`,
    },
    {
      id: 'example-absolute-range',
      title: 'Counting integers in an absolute value range',
      problemMd: md`How many integers $x$ satisfy $|2x - 5| \le 9$?`,
      steps: [
        md`Write the compound form: $-9 \le 2x - 5 \le 9$.`,
        md`Add 5 to all three parts: $-4 \le 2x \le 14$. Divide by 2: $-2 \le x \le 7$.`,
        md`Both ends are included, so the integers are $-2, -1, 0, \dots, 7$. Count them as $7 - (-2) + 1 = 10$.`,
        md`Check the ends: $x = 7$ gives $|9| = 9$ and $x = -2$ gives $|-9| = 9$, both allowed; $x = 8$ gives $11$, too big.`,
      ],
      answerMd: md`10 integers. Subtracting the endpoints, $7 - (-2) = 9$, forgets that both endpoints are counted.`,
    },
    {
      id: 'example-extraneous',
      title: 'An absolute value equation with a false case',
      problemMd: md`Solve $|x + 1| = 2x - 4$.`,
      steps: [
        md`Case 1, inside non-negative: $x + 1 = 2x - 4$, so $x = 5$.`,
        md`Case 2, inside negative: $x + 1 = -(2x - 4) = -2x + 4$, so $3x = 3$ and $x = 1$.`,
        md`Check $x = 5$: $|6| = 6$ and $2(5) - 4 = 6$. It works.`,
        md`Check $x = 1$: $|2| = 2$, but $2(1) - 4 = -2$. An absolute value cannot equal $-2$, so $x = 1$ is extraneous.`,
      ],
      answerMd: md`The only solution is $x = 5$. Reporting both values, or their sum 6, is the trap.`,
    },
    {
      id: 'example-combine-ranges',
      title: 'The range of a difference',
      problemMd: md`If $-3 < x < 2$ and $1 < y < 5$, what are the possible values of $x - y$?`,
      steps: [
        md`To make $x - y$ as small as possible, take $x$ near its lowest value and $y$ near its highest: $-3 - 5 = -8$.`,
        md`To make it as large as possible, take $x$ near its highest and $y$ near its lowest: $2 - 1 = 1$.`,
        md`Both original inequalities are strict, so the ends are not reached: $-8 < x - y < 1$.`,
        md`Second route: $-y$ lies between $-5$ and $-1$, so add $-3 < x < 2$ and $-5 < -y < -1$ end to end: $-8 < x - y < 1$.`,
      ],
      answerMd: md`$-8 < x - y < 1$. Subtracting end from matching end gives $-4 < x - y < -3$, which wrongly excludes values such as $x - y = 0$ (from $x = y = 1.5$).`,
    },
  ],
  traps: [
    {
      title: 'Flipping at the wrong moment',
      md: md`The sign flips only when you multiply or divide by a negative number. Subtracting a number, or dividing by a positive one, leaves it alone. Test a value in the original inequality whenever you are unsure.`,
    },
    {
      title: 'Multiplying by a variable',
      md: md`From $\frac{a}{b} > 1$ you may write $a > b$ only if $b$ is known to be positive. If the sign of $b$ is unknown, the direction is unknown, and in a comparison that usually means the answer cannot be determined.`,
    },
    {
      title: 'Subtracting ranges end to end',
      md: md`For a difference $x - y$, pair the small end of $x$ with the large end of $y$, and the large end of $x$ with the small end of $y$. Rewriting $-y$ as its own range and then adding makes this automatic.`,
    },
    {
      title: 'Keeping an extraneous solution',
      md: md`When the variable appears outside the absolute value, one case may give a value that makes the other side negative. Substitute every candidate into the original equation and throw out any that fail.`,
    },
    {
      title: 'Strict or not strict when counting',
      md: md`$-1 < n < 7$ contains the integers 0 to 6, which is 7 integers; $-1 \le n \le 7$ contains 9. Read each sign before you count.`,
    },
  ],
  check: [
    {
      id: 'check-count-integers',
      title: 'Within a distance',
      topic: 'Algebra',
      stemMd: md`How many integers $n$ satisfy $|n - 3| < 4$?`,
      options: [
        { id: 'A', text: md`$6$`, note: md`Counts only the positive integers 1 to 6 and leaves out 0.` },
        { id: 'B', text: md`$7$`, note: '' },
        { id: 'C', text: md`$8$`, note: md`Subtracts the endpoints, $7 - (-1) = 8$; with strict signs the integers run from 0 to 6.` },
        { id: 'D', text: md`$9$`, note: md`Includes both endpoints $-1$ and $7$, as if the sign were $\le$; at those values $|n - 3| = 4$, which is not less than 4.` },
        { id: 'E', text: 'Infinitely many', note: md`Solves only $n - 3 < 4$ and forgets the lower bound $n - 3 > -4$.` },
      ],
      answer: 'B',
      workingMd: md`$|n - 3| < 4$ means $n$ is less than 4 away from 3: $-1 < n < 7$. The integers are $0, 1, 2, 3, 4, 5, 6$, which is 7 of them.`,
      lesson: 'Read an absolute value inequality as a distance, then check whether each endpoint is included before counting.',
    },
    {
      id: 'check-range-difference',
      title: 'How large can the difference be?',
      topic: 'Quantitative Comparison',
      stemMd: md`$-2 < a < 3$ and $-4 < b < 1$

| Quantity A | Quantity B |
| --- | --- |
| $a - b$ | $7$ |`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: md`Adds the upper ends, $3 + 4$, and then forgets that neither end can be reached; $a - b$ never reaches 7, let alone exceeds it.` },
        { id: 'B', text: 'Quantity B is greater.', note: '' },
        { id: 'C', text: 'The two quantities are equal.', note: md`$7$ is the boundary $3 - (-4)$, but both inequalities are strict, so $a - b$ can only approach 7.` },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: md`$a - b$ does vary, but every possible value lies below 7, so the comparison is fixed.` },
      ],
      answer: 'B',
      workingMd: md`The largest $a - b$ pairs the largest $a$ with the smallest $b$: it approaches $3 - (-4) = 7$ but never reaches it, because $a < 3$ and $b > -4$. So $-3 < a - b < 7$, and every value is less than 7.`,
      lesson: 'For a difference, pair opposite ends of the two ranges, and keep strict inequalities strict.',
    },
    {
      id: 'check-absolute-equation',
      title: 'Two cases, two checks',
      topic: 'Algebra',
      stemMd: md`What is the sum of all values of $x$ that satisfy $|3x - 6| = x + 2$?`,
      options: [
        { id: 'A', text: md`$1$`, note: md`This is only the solution from the negative case; $x = 4$ also works.` },
        { id: 'B', text: md`$4$`, note: md`This is only the solution from the positive case; $x = 1$ also works, since $|-3| = 3 = 1 + 2$.` },
        { id: 'C', text: md`$5$`, note: '' },
        { id: 'D', text: md`$6$`, note: md`Writes the negative case as $3x - 6 = -x + 2$, negating only part of the right side, which gives $x = 2$ and the sum $4 + 2$; but $x = 2$ fails the check, since $|0| \neq 4$.` },
        { id: 'E', text: md`$8$`, note: md`Stops at $2x = 8$ in the first case and reports $2x$, not $x$.` },
      ],
      answer: 'C',
      workingMd: md`Case 1: $3x - 6 = x + 2$, so $x = 4$; check $|6| = 6 = 4 + 2$. Case 2: $3x - 6 = -(x + 2)$, so $4x = 4$ and $x = 1$; check $|-3| = 3 = 1 + 2$. Both work, and their sum is $5$.`,
      lesson: 'Solve both cases of an absolute value equation, check each in the original, and keep only those that pass.',
    },
  ],
  takeaways: [
    'Flip the inequality sign only when multiplying or dividing by a negative number.',
    'Do not multiply an inequality by a variable unless you know its sign.',
    'For the range of a difference, pair opposite ends.',
    md`$|x - a|$ is the distance from $x$ to $a$.`,
    'Check every case of an absolute value equation in the original equation.',
  ],
  practice: { examKey: 'gre', domain: 'quant-algebra', skill: 'alg-relations-functions-equations-inequalities' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
