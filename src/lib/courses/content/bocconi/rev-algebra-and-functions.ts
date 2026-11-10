import { md, type Lesson } from '../../types';

/**
 * Quick revision: algebra and functions. Adapted from the site owners'
 * revision deck (slides 2–13), with every number re-derived. Exam facts are
 * from docs/research/course-facts-2026-11-04.md.
 */
export const revisionAlgebraAndFunctionsLesson: Lesson = {
  slug: 'revision-algebra-and-functions',
  title: 'Revision: algebra and functions',
  summary: 'Identities, radicals, Vieta, sign tables, absolute values, systems, domains, inverses, exponentials and logarithms on one sheet, with worked drills.',
  minutes: 30,
  objectives: [
    'Recall the factoring identities, radical rules, Vieta formulas and log laws without hesitation.',
    'Solve quadratic, rational, absolute-value and exponential inequalities with the right sign rule.',
    'Find a domain, an inverse and a composite value in a few lines.',
    'Turn a remainder word problem into a short list of candidates and test them.',
  ],
  teachMd: md`
### How to use this sheet

Mathematics is 24 of the 50 questions on the standard test, and calculators are not allowed, so speed comes from structure: factor before you multiply out, and test the options when solving would take longer. 75 minutes for 50 questions is 90 seconds a question on average; treating that as a target per maths question is our pacing suggestion, not a rule of the test. Read each block below, cover it, and say the rule back.

### Factoring identities

| Identity | Expanded form | Factored form | Where it saves time |
| --- | --- | --- | --- |
| Difference of squares | $a^2 - b^2$ | $(a - b)(a + b)$ | rationalising roots, mental arithmetic |
| Square of a binomial | $a^2 \pm 2ab + b^2$ | $(a \pm b)^2$ | completing the square in circles and parabolas |
| Sum of cubes | $a^3 + b^3$ | $(a + b)(a^2 - ab + b^2)$ | cancelling cubic fractions |
| Difference of cubes | $a^3 - b^3$ | $(a - b)(a^2 + ab + b^2)$ | simplifying degree-3 polynomials |
| Square of a trinomial | $a^2 + b^2 + c^2 + 2(ab + bc + ca)$ | $(a + b + c)^2$ | symmetric three-variable expressions |

The difference of squares is also a mental-arithmetic tool: $\frac{2026^2 - 2024^2}{4} = \frac{(2026 - 2024)(2026 + 2024)}{4} = \frac{2 \times 4050}{4} = 2025$, with no large squares computed.

### Radicals

- $\sqrt[n]{a^m} = a^{m/n}$ (for $a \ge 0$), so every root is a fractional power and the power rules apply.
- $\sqrt[m]{\sqrt[n]{a}} = \sqrt[mn]{a}$: nested roots multiply their indices.
- $\sqrt{x^2} = \lvert x \rvert$, never simply $x$: an even root is never negative.
- $\sqrt{a^2 + b^2}$ is **not** $a + b$. Roots do not split over sums ($\sqrt{9 + 16} = 5$, not $7$).

To rationalise a denominator such as $3 - \sqrt{2}$, multiply top and bottom by its conjugate $3 + \sqrt{2}$; the bottom becomes a difference of squares, $9 - 2 = 7$. So $\frac{5}{3 - \sqrt{2}} = \frac{15 + 5\sqrt{2}}{7}$.

### Quadratics: the discriminant and Vieta

For $ax^2 + bx + c = 0$ with $a \neq 0$, the discriminant $\Delta = b^2 - 4ac$ counts the real roots: two if $\Delta > 0$, one (repeated) if $\Delta = 0$, none if $\Delta < 0$. When the roots are real, Vieta's formulas give their sum and product without solving:

| Expression | In terms of $S = x_1 + x_2 = -\frac{b}{a}$ and $P = x_1 x_2 = \frac{c}{a}$ |
| --- | --- |
| $x_1^2 + x_2^2$ | $S^2 - 2P$ |
| $\frac{1}{x_1} + \frac{1}{x_2}$ | $\frac{S}{P}$ |
| $(x_1 - x_2)^2$ | $S^2 - 4P$ |

### Sign tables for inequalities

Move everything to one side, factor, and mark where each factor is zero. For a quadratic with $a > 0$ the parabola opens upwards, so it is **negative between the roots** and positive outside them: $x^2 - 5x + 6 = (x - 2)(x - 3) < 0$ gives $2 < x < 3$.

For a rational inequality such as $\frac{x - 1}{x + 3} \le 0$, do not multiply across by $x + 3$, whose sign you do not know. Mark the zero of the numerator ($x = 1$) and of the denominator ($x = -3$), test the sign in each interval, and exclude the denominator's zero for good: the solution is $-3 < x \le 1$.

### Absolute values

| Form | Rule | Example |
| --- | --- | --- |
| $\lvert A \rvert < k$ (with $k > 0$) | sandwich: $-k < A < k$ | $\lvert 2x - 5 \rvert < 7 \Rightarrow -2 < 2x < 12 \Rightarrow -1 < x < 6$ |
| $\lvert A \rvert > k$ (with $k > 0$) | split: $A > k$ or $A < -k$ | $\lvert 3x + 1 \rvert > 8 \Rightarrow x > \frac{7}{3}$ or $x < -3$ |

If $k$ is negative, $\lvert A \rvert < k$ has no solution and $\lvert A \rvert > k$ holds for every $x$ where $A$ is defined.

### Systems and remainders

A line and a parabola meet where their $y$-values are equal. For $y = 2x + 3$ and $y = x^2$: $x^2 - 2x - 3 = 0$, so $(x - 3)(x + 1) = 0$ and the points are $(3, 9)$ and $(-1, 1)$. The discriminant of that equation tells you in advance whether there are two, one or no meeting points.

Remainder conditions are lists in disguise. "Leaves 2 when divided by 10" means the last digit is 2; "leaves 1 when divided by 7" means the number is 1 more than a multiple of 7. List the candidates of the stricter condition, then test them against the other.

### Domains

| Structure | Condition | Example |
| --- | --- | --- |
| Fraction $\frac{P(x)}{Q(x)}$ | $Q(x) \neq 0$ | $\frac{1}{x - 5}$: $x \neq 5$ |
| Even root $\sqrt[2n]{g(x)}$ | $g(x) \ge 0$ | $\sqrt{x - 3}$: $x \ge 3$ |
| Logarithm $\log_b h(x)$ | $h(x) > 0$, with $b > 0$, $b \neq 1$ | $\ln(4 - x)$: $x < 4$ |

When a function has several pieces, every condition must hold at once: $f(x) = \frac{\sqrt{x - 3}}{x - 5}$ needs $x \ge 3$ and $x \neq 5$. An even root **in a denominator** needs its radicand strictly positive.

### Inverses and composition

To invert $y = f(x)$, swap $x$ and $y$ and solve for $y$. For $f(x) = \frac{2x - 3}{5}$: $x = \frac{2y - 3}{5}$, so $5x + 3 = 2y$ and $f^{-1}(x) = \frac{5x + 3}{2}$. Check by composing: $f(f^{-1}(x)) = \frac{(5x + 3) - 3}{5} = x$.

In $f(g(x))$ the inner function acts first. With $f(x) = x^2 + 1$ and $g(x) = 3x - 2$: $g(2) = 4$, so $f(g(2)) = f(4) = 17$. The order matters: $g(f(2)) = g(5) = 13$.

### Exponentials

Write both sides as powers of the same base and compare exponents: $2^{x + 1} = 32 = 2^5$ gives $x = 4$. In an inequality the direction depends on the base. With a base greater than 1, $a^u > a^v$ means $u > v$; with a base between 0 and 1 the function is decreasing, so the inequality **flips**. Remember also that $a^x > 0$ for every $x$, so an equation like $2^x = -4$ has no solution.

### Logarithms

| Law | Statement |
| --- | --- |
| Product | $\log_b(xy) = \log_b x + \log_b y$ |
| Quotient | $\log_b \frac{x}{y} = \log_b x - \log_b y$ |
| Power | $\log_b(x^k) = k \log_b x$ |
| Change of base | $\log_a b = \frac{\ln b}{\ln a}$ |

The laws hold for positive $x$ and $y$. To condense $2\log x + \log y - 3\log z$, push the coefficients into exponents and merge: $\log\frac{x^2 y}{z^3}$. Also keep $\log_b 1 = 0$, $\log_b b = 1$ and $b^{\log_b x} = x$ to hand. After solving a log equation, check every root against the domain of the **original** equation.
`,
  examples: [
    {
      id: 'example-cubic-fraction',
      title: 'Cancelling a cubic fraction',
      problemMd: md`Simplify $\frac{x^3 - 8}{x^2 - 4}$ for $x \neq \pm 2$.`,
      steps: [
        md`Factor the numerator as a difference of cubes with $a = x$, $b = 2$: $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$.`,
        md`Factor the denominator as a difference of squares: $x^2 - 4 = (x - 2)(x + 2)$.`,
        md`Cancel the common factor $x - 2$, which is allowed because $x \neq 2$.`,
        md`Check with a number: at $x = 1$ the original is $\frac{-7}{-3} = \frac{7}{3}$, and $\frac{1 + 2 + 4}{1 + 2} = \frac{7}{3}$.`,
      ],
      answerMd: md`$\frac{x^2 + 2x + 4}{x + 2}$. The tempting slip is writing $x^3 - 8$ as $(x - 2)^3$ or $(x - 2)(x^2 - 2x + 4)$; the middle sign in the difference of cubes is $+$.`,
    },
    {
      id: 'example-vieta-reciprocals',
      title: 'Sum of reciprocals without solving',
      problemMd: md`The roots of $2x^2 - 7x + 3 = 0$ are $x_1$ and $x_2$. Find $\frac{1}{x_1} + \frac{1}{x_2}$.`,
      steps: [
        md`Check the roots are real: $\Delta = 49 - 24 = 25 > 0$.`,
        md`Combine the fractions: $\frac{1}{x_1} + \frac{1}{x_2} = \frac{x_1 + x_2}{x_1 x_2}$.`,
        md`By Vieta, $x_1 + x_2 = -\frac{-7}{2} = \frac{7}{2}$ and $x_1 x_2 = \frac{3}{2}$.`,
        md`Divide: $\frac{7/2}{3/2} = \frac{7}{3}$. Second route: the roots are $3$ and $\frac{1}{2}$, and $\frac{1}{3} + 2 = \frac{7}{3}$.`,
      ],
      answerMd: md`$\frac{7}{3}$. Dividing the product by the sum instead gives the reciprocal, $\frac{3}{7}$.`,
    },
    {
      id: 'example-stamps-remainders',
      title: 'A remainder word problem',
      problemMd: md`Adele has at least 30 and fewer than 100 stamps. Arranged in rows of 7, one stamp is left over; arranged in rows of 10, two are left over. How many stamps does she have?`,
      steps: [
        md`Rows of 10 leaving 2 means the last digit is 2. From 30 up to 99 the candidates are 32, 42, 52, 62, 72, 82 and 92: seven numbers, not just a few of them.`,
        md`Rows of 7 leaving 1 means the number is a multiple of 7 plus 1. Test each candidate: $32 = 28 + 4$, $42 = 42 + 0$, $52 = 49 + 3$, $62 = 56 + 6$, $72 = 70 + 2$, $82 = 77 + 5$, $92 = 91 + 1$.`,
        md`Only $92 = 7 \times 13 + 1$ works. Second route: the numbers from 30 to 99 that are one more than a multiple of 7 are 36, 43, 50, 57, 64, 71, 78, 85, 92 and 99, and only 92 ends in 2.`,
      ],
      answerMd: md`92 stamps. Checking only a handful of the numbers ending in 2 can miss the answer or miss a second solution; list them all, since there are only seven.`,
    },
    {
      id: 'example-fractional-base',
      title: 'An exponential inequality with a base below 1',
      problemMd: md`Solve $\left(\frac{1}{3}\right)^{2x - 1} > \frac{1}{27}$.`,
      steps: [
        md`Write the right side with the same base: $\frac{1}{27} = \left(\frac{1}{3}\right)^3$.`,
        md`The base $\frac{1}{3}$ is between 0 and 1, so the function is decreasing and the inequality flips when you compare exponents: $2x - 1 < 3$.`,
        md`Solve: $2x < 4$, so $x < 2$.`,
        md`Check both sides of the boundary: at $x = 0$ the left side is $\left(\frac{1}{3}\right)^{-1} = 3 > \frac{1}{27}$; at $x = 3$ it is $\frac{1}{243} < \frac{1}{27}$.`,
      ],
      answerMd: md`$x < 2$. Keeping the direction gives $x > 2$, the tempting wrong answer.`,
    },
  ],
  traps: [
    {
      title: 'Splitting a root over a sum',
      md: md`$\sqrt{a^2 + b^2}$ looks as if it should be $a + b$, but roots split only over products: $\sqrt{ab} = \sqrt{a}\sqrt{b}$ for $a, b \ge 0$. Test any rule you are unsure of with $3$ and $4$: $\sqrt{9 + 16} = 5$, not $7$.`,
    },
    {
      title: 'Dropping the absolute value',
      md: md`$\sqrt{x^2} = \lvert x \rvert$. Writing $x$ instead loses every negative solution, or keeps a negative value where only a non-negative one is possible. The same applies to $\log(x^2) = 2\log\lvert x \rvert$: the two sides have different domains if you write $2\log x$.`,
    },
    {
      title: 'Keeping the direction with a base below 1',
      md: md`An exponential or logarithmic inequality with base between 0 and 1 reverses when you compare exponents or arguments. Before you write the last line, ask whether the base is bigger or smaller than 1.`,
    },
    {
      title: 'Multiplying across an unknown sign',
      md: md`In $\frac{x - 1}{x + 3} \le 0$, multiplying by $x + 3$ is only safe when $x + 3 > 0$; for $x < -3$ it flips the inequality. Use a sign table instead, and never include the zero of a denominator.`,
    },
    {
      title: 'Keeping a root the domain forbids',
      md: md`Log and root equations often produce an extra root when you clear the logs or square both sides. Substitute every candidate into the original equation; a value that makes a log's argument zero or negative is rejected, however neat it looks.`,
    },
  ],
  check: [
    {
      id: 'check-sum-of-squares-of-roots',
      title: 'Sum of the squares of the roots',
      topic: 'Mathematics: algebra',
      stemMd: md`The equation $3x^2 - 5x - 4 = 0$ has real roots $x_1$ and $x_2$. What is $x_1^2 + x_2^2$?`,
      options: [
        { id: 'A', text: md`$\frac{1}{9}$`, note: md`This takes the product as $+\frac{4}{3}$ instead of $\frac{c}{a} = -\frac{4}{3}$, so it subtracts $\frac{8}{3}$ instead of adding it.` },
        { id: 'B', text: md`$\frac{25}{9}$`, note: md`This is only the square of the sum; it leaves out the $-2P$ term.` },
        { id: 'C', text: md`$\frac{37}{9}$`, note: md`This subtracts the product once instead of twice: $(x_1 + x_2)^2 = x_1^2 + 2x_1x_2 + x_2^2$.` },
        { id: 'D', text: md`$\frac{49}{9}$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`By Vieta, $S = x_1 + x_2 = \frac{5}{3}$ and $P = x_1 x_2 = -\frac{4}{3}$. Then $x_1^2 + x_2^2 = S^2 - 2P = \frac{25}{9} + \frac{8}{3} = \frac{25}{9} + \frac{24}{9} = \frac{49}{9}$. The roots are real because $\Delta = 25 + 48 = 73 > 0$.`,
      lesson: md`Write symmetric expressions of the roots in terms of $S$ and $P$, and keep the sign of $\frac{c}{a}$.`,
    },
    {
      id: 'check-combined-domain',
      title: 'A log over a root',
      topic: 'Mathematics: functions',
      stemMd: md`What is the domain of $f(x) = \frac{\ln(6 - x)}{\sqrt{x + 2}}$?`,
      options: [
        { id: 'A', text: md`$-2 \le x < 6$`, note: md`This allows $x = -2$, where the root is 0 and sits in the denominator, so the fraction is undefined.` },
        { id: 'B', text: md`$-2 < x < 6$`, note: '' },
        { id: 'C', text: md`$-2 < x \le 6$`, note: md`This allows $x = 6$, where the log's argument is 0; a logarithm needs a strictly positive argument.` },
        { id: 'D', text: md`$x < 6$ and $x \neq -2$`, note: md`This treats the root only as a denominator to keep non-zero and forgets that its radicand must not be negative, so it wrongly admits every $x < -2$.` },
      ],
      answer: 'B',
      workingMd: md`The logarithm needs $6 - x > 0$, so $x < 6$. The square root needs $x + 2 \ge 0$, and because it is in the denominator it must also be non-zero, so $x + 2 > 0$, that is $x > -2$. Both conditions together give $-2 < x < 6$.`,
      lesson: 'List one condition per piece of the function, then intersect them; a root in a denominator needs a strictly positive radicand.',
    },
    {
      id: 'check-log-equation-domain',
      title: 'A log equation with a rejected root',
      topic: 'Mathematics: logarithms and exponentials',
      stemMd: md`Solve $\log_2 x + \log_2(x - 2) = 3$.`,
      options: [
        { id: 'A', text: md`$x = \frac{16}{7}$`, note: md`This combines the sum with the quotient rule, $\log_2 \frac{x}{x - 2} = 3$; a sum of logs is the log of a product.` },
        { id: 'B', text: md`$x = 4$`, note: '' },
        { id: 'C', text: md`$x = 5$`, note: md`This turns the sum of logs into the log of a sum, $\log_2(2x - 2) = 3$, which no log law allows.` },
        { id: 'D', text: md`$x = -2$ or $x = 4$`, note: md`Both solve the quadratic, but $x = -2$ makes both log arguments negative, so it is not in the domain of the original equation.` },
      ],
      answer: 'B',
      workingMd: md`The domain needs $x > 0$ and $x - 2 > 0$, so $x > 2$. By the product rule, $\log_2[x(x - 2)] = 3$, so $x(x - 2) = 2^3 = 8$, that is $x^2 - 2x - 8 = 0$, or $(x - 4)(x + 2) = 0$. Only $x = 4$ satisfies $x > 2$. Check: $\log_2 4 + \log_2 2 = 2 + 1 = 3$.`,
      lesson: 'Set the domain before you solve a log equation, and use it to reject roots at the end.',
    },
  ],
  takeaways: [
    'Factor first: difference of squares and of cubes turn heavy arithmetic and cubic fractions into cancellations.',
    md`Vieta gives $S = -\frac{b}{a}$ and $P = \frac{c}{a}$; most symmetric root questions need nothing else.`,
    'Inequalities: sign tables for products and fractions, sandwich or split for absolute values, and a flip for exponential bases below 1.',
    'A domain is the intersection of every piece’s condition; check every root of a log or root equation against it.',
    md`Inverse: swap $x$ and $y$ and solve. Composition: the inner function acts first, and $f(g(x))$ is usually not $g(f(x))$.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
