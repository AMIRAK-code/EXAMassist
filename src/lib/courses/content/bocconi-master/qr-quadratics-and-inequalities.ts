import { md, type Lesson } from '../../types';

export const quadraticsAndInequalitiesLesson: Lesson = {
  slug: 'quadratics-and-inequalities',
  title: 'Quadratic equations and inequalities',
  summary: 'Factorise quadratics by hand, use the formula and the discriminant when factoring fails, and solve linear and quadratic inequalities safely.',
  minutes: 22,
  objectives: [
    'Solve a quadratic equation by factorising, and by the formula when factorising fails.',
    'Solve a linear inequality, reversing the sign when multiplying or dividing by a negative.',
    'Solve a quadratic inequality from its roots and the shape of its graph.',
  ],
  teachMd: md`
### Factorising: the fastest route

A quadratic equation $ax^2 + bx + c = 0$ is easiest when it factorises, because a product is zero only when one of its factors is zero. For $x^2 + bx + c$, look for two numbers that **multiply to $c$ and add to $b$**. For $x^2 - 5x - 14$: the pair $-7$ and $2$ multiplies to $-14$ and adds to $-5$, so
$$x^2 - 5x - 14 = (x - 7)(x + 2) = 0 \quad\Longrightarrow\quad x = 7 \text{ or } x = -2.$$
Check one root: $49 - 35 - 14 = 0$.

When the leading coefficient is not 1, try factor pairs of the first and last coefficients and check the middle term: $2x^2 - 7x + 3 = (2x - 1)(x - 3)$, since $2x \times (-3) + (-1) \times x = -7x$.

Two patterns are worth recognising on sight:
$$a^2 - b^2 = (a - b)(a + b), \qquad a^2 \pm 2ab + b^2 = (a \pm b)^2.$$
They also help with arithmetic: $49 \times 51 = (50 - 1)(50 + 1) = 2500 - 1 = 2499$.

### The formula and the discriminant

If no factor pair works, use
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}.$$
The **discriminant** $D = b^2 - 4ac$ tells you how many real roots there are before you finish: two if $D > 0$, one (a repeated root) if $D = 0$, none if $D < 0$. A question that only asks "how many solutions" needs only $D$.

Two more facts save time. The roots of $ax^2 + bx + c = 0$ add to $-\frac{b}{a}$ and multiply to $\frac{c}{a}$. And never divide both sides by $x$: from $x^2 = 6x$, write $x^2 - 6x = 0$, so $x(x - 6) = 0$, giving $x = 0$ **or** $x = 6$. Dividing by $x$ silently throws away $x = 0$.

### Linear inequalities

Solve a linear inequality like an equation, with one extra rule: **multiplying or dividing both sides by a negative number reverses the sign.** The reason is that negating swaps the order of numbers: $2 < 5$, but $-2 > -5$.

$$7 - 3x > 19 \;\Longrightarrow\; -3x > 12 \;\Longrightarrow\; x < -4.$$
Test a value: $x = -5$ gives $7 + 15 = 22 > 19$, which fits, while $x = 0$ gives $7 > 19$, which does not. Adding or subtracting never reverses the sign; only multiplying or dividing by a negative does.

When two conditions must hold together, solve each and keep the overlap. If an inequality is strict ($<$ or $>$), the boundary value itself is excluded; check endpoints whenever a question counts integers.

### Quadratic inequalities

To solve $x^2 - 2x - 15 \le 0$:

1. Find the roots of the matching equation: $(x - 5)(x + 3) = 0$, so $x = -3$ and $x = 5$.
2. Picture the graph. With a positive $x^2$ coefficient, the parabola opens upwards: it is below zero **between** the roots and above zero **outside** them.
3. Read off the answer: $\le 0$ means between, so $-3 \le x \le 5$.

| Form (leading coefficient positive, roots $r_1 < r_2$) | Solution |
| --- | --- |
| $(x - r_1)(x - r_2) < 0$ | $r_1 < x < r_2$ |
| $(x - r_1)(x - r_2) > 0$ | $x < r_1$ or $x > r_2$ |

Test one value to confirm: $x = 0$ gives $-15 \le 0$, true, and 0 is between the roots. If the leading coefficient is negative, multiply the whole inequality by $-1$ first, reversing the sign.

### Squares and square roots

$x^2 = 9$ has two solutions, $x = 3$ and $x = -3$, and $x^2 < 9$ means $-3 < x < 3$, not just $x < 3$. A square is never negative, so $x^2 \ge 0$ for every $x$ and an equation like $x^2 = -4$ has no real solution.
`,
  examples: [
    {
      id: 'example-factorise',
      title: 'A quadratic that factorises',
      problemMd: md`Solve $x^2 - 5x - 14 = 0$.`,
      steps: [
        md`Look for two numbers with product $-14$ and sum $-5$: these are $-7$ and $2$.`,
        md`Factorise: $(x - 7)(x + 2) = 0$.`,
        md`A product is zero only when a factor is zero: $x = 7$ or $x = -2$.`,
        md`Check both: $49 - 35 - 14 = 0$ and $4 + 10 - 14 = 0$. The sum of the roots is 5, which matches $-\frac{b}{a} = 5$.`,
      ],
      answerMd: md`$x = 7$ or $x = -2$. Writing $(x + 7)(x - 2)$ gives the right product but the wrong sum ($+5$), so the signs of both roots come out reversed.`,
    },
    {
      id: 'example-quadratic-inequality',
      title: 'Counting integers in a quadratic inequality',
      problemMd: md`How many integers $x$ satisfy $x^2 - 2x - 15 \le 0$?`,
      steps: [
        md`Roots of $x^2 - 2x - 15 = 0$: factorise as $(x - 5)(x + 3)$, so $x = -3$ and $x = 5$.`,
        md`The parabola opens upwards, so it is at or below zero between the roots: $-3 \le x \le 5$.`,
        md`The sign $\le$ includes the endpoints. Count the integers from $-3$ to $5$: $5 - (-3) + 1 = 9$.`,
        md`Check the edges: $x = 5$ gives $25 - 10 - 15 = 0$, allowed; $x = 6$ gives $36 - 12 - 15 = 9 > 0$, not allowed.`,
      ],
      answerMd: md`9 integers. Subtracting the endpoints, $5 - (-3) = 8$, forgets that both endpoints count.`,
    },
    {
      id: 'example-linear-inequality',
      title: 'Dividing by a negative',
      problemMd: md`Solve $7 - 3x > 19$.`,
      steps: [
        md`Subtract 7 from both sides: $-3x > 12$. Subtracting does not change the sign.`,
        md`Divide by $-3$, which reverses the sign: $x < -4$.`,
        md`Test: $x = -5$ gives $22 > 19$, true; $x = -4$ gives $19 > 19$, false, as the strict sign requires.`,
      ],
      answerMd: md`$x < -4$. Keeping the sign as it was gives $x > -4$, which includes $x = 0$, a value that plainly fails.`,
    },
  ],
  traps: [
    {
      title: 'Forgetting to reverse the sign',
      md: md`Dividing or multiplying an inequality by a negative number reverses it. After solving, test one value from your answer in the original inequality; it takes seconds and catches the slip every time.`,
    },
    {
      title: 'Dividing by the unknown',
      md: md`From $x^2 = 6x$, dividing by $x$ leaves only $x = 6$ and loses $x = 0$. Move everything to one side and factorise instead. In an inequality, dividing by $x$ is worse still, because you do not know whether $x$ is negative.`,
    },
    {
      title: 'Between or outside?',
      md: md`For an upward parabola, "less than zero" is between the roots and "greater than zero" is outside them. Reversing these is easy under time pressure; a single test value such as $x = 0$ settles it.`,
    },
    {
      title: 'Strict signs and endpoints',
      md: md`$<$ excludes the boundary and $\le$ includes it. When a question counts integers, check each endpoint in the original inequality before including it.`,
    },
  ],
  check: [
    {
      id: 'check-roots',
      title: 'Roots of a quadratic',
      topic: 'Quantitative reasoning: quadratics',
      stemMd: md`What are the solutions of $2x^2 - 7x + 3 = 0$?`,
      options: [
        { id: 'A', text: md`$x = -3$ or $x = -\frac{1}{2}$`, note: md`These are the roots of $(2x + 1)(x + 3)$, which has middle term $+7x$; the signs are reversed.` },
        { id: 'B', text: md`$x = \frac{1}{2}$ or $x = 3$`, note: '' },
        { id: 'C', text: md`$x = 1$ or $x = \frac{3}{2}$`, note: md`These are the roots of $(2x - 3)(x - 1) = 2x^2 - 5x + 3$; the factor pair gives the right first and last terms but the middle term $-5x$, not $-7x$.` },
        { id: 'D', text: md`$x = 3$ only`, note: md`Finds one factor, $x - 3$, but drops the other: $2x - 1 = 0$ also gives a solution.` },
      ],
      answer: 'B',
      workingMd: md`Factorise: $2x^2 - 7x + 3 = (2x - 1)(x - 3)$; the middle term is $-6x - x = -7x$. So $x = \frac{1}{2}$ or $x = 3$. Check with the formula: $D = 49 - 24 = 25$, so $x = \frac{7 \pm 5}{4}$, giving 3 and $\frac{1}{2}$.`,
      lesson: 'When factorising, check the middle term, and keep every factor: each one gives a root.',
    },
    {
      id: 'check-integers-quadratic',
      title: 'Integers in a quadratic inequality',
      topic: 'Quantitative reasoning: inequalities',
      stemMd: md`How many integers $x$ satisfy $x^2 < 2x + 8$?`,
      options: [
        { id: 'A', text: md`3`, note: md`Counts only the positive integers 1, 2 and 3; 0 and $-1$ also satisfy the inequality.` },
        { id: 'B', text: md`5`, note: '' },
        { id: 'C', text: md`7`, note: md`Includes the roots $-2$ and $4$, but the inequality is strict: at those values both sides are equal.` },
        { id: 'D', text: md`Infinitely many`, note: md`Takes the region outside the roots; for an upward parabola, "less than zero" is the region between them.` },
      ],
      answer: 'B',
      workingMd: md`Rearrange: $x^2 - 2x - 8 < 0$, which factorises as $(x - 4)(x + 2) < 0$. The upward parabola is negative between its roots: $-2 < x < 4$. The integers are $-1, 0, 1, 2, 3$, five of them. Check: $x = 3$ gives $9 < 14$; $x = 4$ gives $16 < 16$, false.`,
      lesson: 'Find the roots, decide between or outside from the parabola, and test the endpoints when counting.',
    },
    {
      id: 'check-two-conditions',
      title: 'Two conditions at once',
      topic: 'Quantitative reasoning: inequalities',
      stemMd: md`How many positive integers $n$ satisfy both $3n - 7 < 20$ and $5 - 2n < -3$?`,
      options: [
        { id: 'A', text: md`3`, note: md`Does not reverse the sign when dividing $-2n < -8$ by $-2$, getting $n < 4$, so it counts 1, 2 and 3.` },
        { id: 'B', text: md`4`, note: '' },
        { id: 'C', text: md`5`, note: md`Includes $n = 4$; at $n = 4$, $5 - 8 = -3$, which is not less than $-3$.` },
        { id: 'D', text: md`8`, note: md`Uses only the first condition, $n < 9$; the second condition rules out 1 to 4.` },
      ],
      answer: 'B',
      workingMd: md`First: $3n < 27$, so $n < 9$. Second: $-2n < -8$; dividing by $-2$ reverses the sign, so $n > 4$. Together $4 < n < 9$: $n = 5, 6, 7, 8$, four integers. Check $n = 5$: $8 < 20$ and $-5 < -3$; check $n = 9$: $20 < 20$ fails.`,
      lesson: 'Solve each condition separately, reverse the sign when dividing by a negative, and keep only the overlap.',
    },
  ],
  takeaways: [
    md`Factorise $x^2 + bx + c$ with two numbers that multiply to $c$ and add to $b$.`,
    md`The discriminant $b^2 - 4ac$ counts the real roots: positive two, zero one, negative none.`,
    'Multiplying or dividing an inequality by a negative number reverses it.',
    'For an upward parabola, less than zero is between the roots and greater than zero is outside.',
    'Never divide by the unknown; move everything to one side and factorise.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-algebra-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
