import { md, type Lesson, type Unit } from '../../types';

/**
 * Algebra for the Online Bocconi Test. The topic list follows the Algebra
 * heading of the Bocconi mathematics syllabus in
 * docs/research/course-facts-2026-11-04.md (polynomials, powers, radicals;
 * first and second degree equations, inequalities and two-unknown systems;
 * equations and inequalities with absolute values), plus "expressing one
 * quantity as a function of others" from the practice taxonomy. All examples
 * and checks are original. No calculator is allowed on the test, so every
 * number here is chosen to be worked by hand.
 */

const PRACTICE_EXAM = 'bocconi-undergraduate';
const PRACTICE_DOMAIN = 'bocconi-ug-mathematics';

const algebraicExpressionsAndIdentities: Lesson = {
  slug: 'algebraic-expressions-and-identities',
  title: 'Algebraic expressions: powers, radicals, polynomials and identities',
  summary: 'Use the rules of powers and radicals, the special products and the remainder theorem to simplify expressions by hand, without a calculator.',
  minutes: 22,
  objectives: [
    'Simplify expressions with integer and fractional exponents by writing everything over a common base.',
    'Simplify and combine radicals, and rationalise a denominator.',
    'Use the special products to expand, factor and evaluate quickly.',
    'Use the remainder theorem to test a factor of a polynomial or find a missing coefficient.',
  ],
  teachMd: md`
### Why this matters without a calculator

Without a calculator, the way through heavy-looking numbers is to simplify the expression first. A question that looks like heavy arithmetic, such as $\frac{2^{10} \cdot 4^3}{8^4}$ or $101^2 - 99^2$, is often a question about a rule. Your job is to spot the rule before you multiply anything.

### Powers

For any base $a \ne 0$ and integers $m, n$:

| Rule | Example |
| --- | --- |
| $a^m \cdot a^n = a^{m+n}$ | $x^3 \cdot x^5 = x^8$ |
| $\frac{a^m}{a^n} = a^{m-n}$ | $\frac{5^7}{5^4} = 5^3$ |
| $(a^m)^n = a^{mn}$ | $(2^3)^4 = 2^{12}$ |
| $(ab)^n = a^n b^n$ | $(3x)^2 = 9x^2$ |
| $a^0 = 1$, $a^{-n} = \frac{1}{a^n}$ | $2^{-3} = \frac{1}{8}$ |
| $a^{\frac{m}{n}} = \sqrt[n]{a^m}$ (for $a > 0$) | $8^{\frac{2}{3}} = (\sqrt[3]{8})^2 = 4$ |

The rules only combine **the same base**. Before you use them, rewrite every number as a power of a common base: $4 = 2^2$, $8 = 2^3$, $27 = 3^3$, $\frac{1}{9} = 3^{-2}$. There is no rule for $a^m + a^n$; a sum of powers is simplified only by factoring, for example $2^{10} + 2^{10} = 2 \cdot 2^{10} = 2^{11}$.

Watch the minus sign: $-3^2 = -9$, because the power applies only to the 3, while $(-3)^2 = 9$.

### Radicals

For $a, b \ge 0$, $\sqrt{ab} = \sqrt{a}\sqrt{b}$ and $\sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}$ (with $b > 0$). To simplify a root, pull out the largest square factor: $\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt{2}$. Roots with the same radicand combine like like terms: $3\sqrt{2} + 5\sqrt{2} = 8\sqrt{2}$.

Two facts cause most mistakes:

- $\sqrt{a + b} \ne \sqrt{a} + \sqrt{b}$. For instance $\sqrt{9 + 16} = 5$, but $\sqrt{9} + \sqrt{16} = 7$.
- $\sqrt{x^2} = |x|$, not $x$. A square root is never negative, so $\sqrt{(-4)^2} = 4$.

To **rationalise** a denominator, multiply top and bottom by what removes the root: by $\sqrt{a}$ for $\frac{1}{\sqrt{a}}$, and by the **conjugate** for a sum or difference, because $(\sqrt{a} - \sqrt{b})(\sqrt{a} + \sqrt{b}) = a - b$.

### Special products

These identities are true for every value of the letters, and they work in both directions: to expand and to factor.

$$(a + b)^2 = a^2 + 2ab + b^2 \qquad (a - b)^2 = a^2 - 2ab + b^2$$

$$(a + b)(a - b) = a^2 - b^2$$

$$a^3 + b^3 = (a + b)(a^2 - ab + b^2) \qquad a^3 - b^3 = (a - b)(a^2 + ab + b^2)$$

They also turn arithmetic into algebra: $49 \times 51 = (50 - 1)(50 + 1) = 2500 - 1 = 2499$. And they let you find one symmetric expression from others without solving for the letters: since $(a + b)^2 = a^2 + b^2 + 2ab$, knowing $a + b$ and $ab$ gives $a^2 + b^2$.

### Polynomials and the remainder theorem

When a polynomial $P(x)$ is divided by $x - c$, the remainder is $P(c)$. So $x - c$ is a factor of $P(x)$ exactly when $P(c) = 0$. This gives a fast test for factors and a way to find a missing coefficient: substitute the root and set the result to zero. Once one factor is found, divide (or match coefficients) to find the rest.

### Simplifying fractions

You may cancel **factors**, never **terms**. In $\frac{x^2 - 9}{x - 3}$, factor first: $\frac{(x - 3)(x + 3)}{x - 3} = x + 3$, valid for $x \ne 3$, where the original is undefined. In $\frac{x + 6}{6}$ nothing cancels: the 6 on top is a term of a sum, not a factor.
`,
  examples: [
    {
      id: 'example-common-base',
      title: 'Powers of different-looking bases',
      problemMd: md`Simplify $\frac{2^{10} \cdot 4^3}{8^4}$ without a calculator.`,
      steps: [
        md`Rewrite every base as a power of 2: $4^3 = (2^2)^3 = 2^6$ and $8^4 = (2^3)^4 = 2^{12}$.`,
        md`Multiply the top by adding exponents: $2^{10} \cdot 2^6 = 2^{16}$.`,
        md`Divide by subtracting exponents: $\frac{2^{16}}{2^{12}} = 2^4 = 16$.`,
      ],
      answerMd: md`The value is $16$. Multiplying the exponents of different bases, or computing $4^3 = 64$ and $8^4 = 4096$ first, is where the time and the errors come from.`,
    },
    {
      id: 'example-rationalise',
      title: 'Rationalising with the conjugate',
      problemMd: md`Write $\frac{6}{\sqrt{5} - \sqrt{2}}$ with no root in the denominator.`,
      steps: [
        md`Multiply top and bottom by the conjugate $\sqrt{5} + \sqrt{2}$, which does not change the value.`,
        md`The denominator becomes a difference of squares: $(\sqrt{5} - \sqrt{2})(\sqrt{5} + \sqrt{2}) = 5 - 2 = 3$.`,
        md`So the expression is $\frac{6(\sqrt{5} + \sqrt{2})}{3} = 2(\sqrt{5} + \sqrt{2}) = 2\sqrt{5} + 2\sqrt{2}$.`,
        md`Rough check: $\sqrt{5} \approx 2.24$ and $\sqrt{2} \approx 1.41$, so the original is about $\frac{6}{0.83} \approx 7.2$, and $2(2.24 + 1.41) = 7.3$. They agree to rounding.`,
      ],
      answerMd: md`$2\sqrt{5} + 2\sqrt{2}$. Multiplying only by $\sqrt{5}$ leaves a root in the denominator, and writing $\sqrt{5} - \sqrt{2} = \sqrt{3}$ is false.`,
    },
    {
      id: 'example-symmetric-identity',
      title: 'Using an identity instead of solving',
      problemMd: md`If $x + \frac{1}{x} = 5$, find $x^2 + \frac{1}{x^2}$.`,
      steps: [
        md`Square both sides: $\left(x + \frac{1}{x}\right)^2 = x^2 + 2 \cdot x \cdot \frac{1}{x} + \frac{1}{x^2} = x^2 + 2 + \frac{1}{x^2}$.`,
        md`The left side is $5^2 = 25$, so $x^2 + \frac{1}{x^2} = 25 - 2 = 23$.`,
        md`There is no need to find $x$ (it is $\frac{5 \pm \sqrt{21}}{2}$); the identity gives the answer directly.`,
      ],
      answerMd: md`$x^2 + \frac{1}{x^2} = 23$. Squaring term by term to get $25$ forgets the middle term $2 \cdot x \cdot \frac{1}{x} = 2$.`,
    },
    {
      id: 'example-remainder-theorem',
      title: 'Finding a coefficient from a factor',
      problemMd: md`The polynomial $P(x) = x^3 - 4x^2 + kx + 6$ is divisible by $x - 3$. Find $k$, then factor $P(x)$ completely.`,
      steps: [
        md`Divisible by $x - 3$ means $P(3) = 0$: $27 - 36 + 3k + 6 = 0$, so $3k - 3 = 0$ and $k = 1$.`,
        md`Then $P(x) = x^3 - 4x^2 + x + 6$. Divide by $x - 3$: $P(x) = (x - 3)(x^2 - x - 2)$.`,
        md`Factor the quadratic: two numbers with product $-2$ and sum $-1$ are $-2$ and $1$, so $x^2 - x - 2 = (x - 2)(x + 1)$.`,
        md`Check by expanding: $(x - 3)(x^2 - x - 2) = x^3 - x^2 - 2x - 3x^2 + 3x + 6 = x^3 - 4x^2 + x + 6$.`,
      ],
      answerMd: md`$k = 1$ and $P(x) = (x - 3)(x - 2)(x + 1)$. Substituting $x = -3$ instead of $x = 3$ is the usual slip: the factor $x - c$ corresponds to the root $c$.`,
    },
  ],
  traps: [
    {
      title: 'Squaring a sum term by term',
      md: md`$(a + b)^2$ is $a^2 + 2ab + b^2$, not $a^2 + b^2$. The same mistake in reverse is $\sqrt{a^2 + b^2} = a + b$. Test any "rule" you are unsure of with small numbers: $(1 + 2)^2 = 9$, but $1^2 + 2^2 = 5$.`,
    },
    {
      title: 'Forgetting that a root is never negative',
      md: md`$\sqrt{x^2} = |x|$. If $x$ might be negative, $\sqrt{x^2} = x$ is wrong; for $x = -4$ it would give $-4$ instead of $4$.`,
    },
    {
      title: 'Cancelling terms instead of factors',
      md: md`$\frac{x + 6}{6}$ is not $x + 1$, and $\frac{x^2 + 4}{x + 2}$ is not $x + 2$. Factor top and bottom completely, and cancel only whole factors that multiply everything.`,
    },
    {
      title: 'Combining powers of different bases',
      md: md`$2^3 \cdot 3^2$ is not $6^5$, and $2^3 + 2^3$ is not $2^6$ (it is $2^4$). The exponent rules apply to products and quotients of the **same** base only.`,
    },
  ],
  check: [
    {
      id: 'check-difference-of-squares',
      title: 'Arithmetic as an identity',
      topic: 'Algebra: algebraic expressions',
      stemMd: md`Without a calculator, find $101^2 - 99^2$.`,
      options: [
        { id: 'A', text: '2', note: md`This is only the factor $101 - 99$; the identity also multiplies by $101 + 99 = 200$.` },
        { id: 'B', text: '4', note: md`This is $(101 - 99)^2$, as if $a^2 - b^2$ were $(a - b)^2$.` },
        { id: 'C', text: '200', note: md`This is only the factor $101 + 99$; it still has to be multiplied by $101 - 99 = 2$.` },
        { id: 'D', text: '400', note: '' },
      ],
      answer: 'D',
      workingMd: md`By the difference of squares, $101^2 - 99^2 = (101 - 99)(101 + 99) = 2 \times 200 = 400$. Check directly: $101^2 = 10\,201$ and $99^2 = 9801$, and $10\,201 - 9801 = 400$.`,
      lesson: 'A difference of two squares is a product of a difference and a sum.',
    },
    {
      id: 'check-combine-radicals',
      title: 'Combining square roots',
      topic: 'Algebra: algebraic expressions',
      stemMd: md`Simplify $\sqrt{50} + \sqrt{18} - \sqrt{8}$.`,
      options: [
        { id: 'A', text: md`$2\sqrt{15}$`, note: md`This combines the radicands, $\sqrt{50 + 18 - 8} = \sqrt{60}$; roots do not add that way.` },
        { id: 'B', text: md`$4\sqrt{2}$`, note: md`This takes $\sqrt{8}$ as $4\sqrt{2}$, forgetting to take the root of 4: $\sqrt{8} = \sqrt{4 \cdot 2} = 2\sqrt{2}$.` },
        { id: 'C', text: md`$6\sqrt{2}$`, note: '' },
        { id: 'D', text: md`$10\sqrt{2}$`, note: md`This adds $\sqrt{8}$ instead of subtracting it: $5 + 3 + 2 = 10$.` },
      ],
      answer: 'C',
      workingMd: md`Pull out square factors: $\sqrt{50} = \sqrt{25 \cdot 2} = 5\sqrt{2}$, $\sqrt{18} = \sqrt{9 \cdot 2} = 3\sqrt{2}$, $\sqrt{8} = \sqrt{4 \cdot 2} = 2\sqrt{2}$. Then $5\sqrt{2} + 3\sqrt{2} - 2\sqrt{2} = 6\sqrt{2}$.`,
      lesson: 'Simplify each root to a common radicand, then combine the coefficients.',
    },
    {
      id: 'check-sum-of-squares',
      title: 'An identity with two facts',
      topic: 'Algebra: algebraic expressions',
      stemMd: md`If $a - b = 3$ and $ab = 10$, what is $a^2 + b^2$?`,
      options: [
        { id: 'A', text: md`$-11$`, note: md`This subtracts $2ab$ instead of adding it. From $(a - b)^2 = a^2 - 2ab + b^2$, the sum of squares is $(a - b)^2 + 2ab$.` },
        { id: 'B', text: md`$9$`, note: md`This is $(a - b)^2$ alone, as if it equalled $a^2 + b^2$; it leaves out the $-2ab$ term.` },
        { id: 'C', text: md`$19$`, note: md`This adds $ab$ once instead of $2ab$.` },
        { id: 'D', text: md`$29$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`$(a - b)^2 = a^2 - 2ab + b^2$, so $a^2 + b^2 = (a - b)^2 + 2ab = 9 + 20 = 29$. Check with $a = 5$, $b = 2$ (which satisfy both facts): $25 + 4 = 29$.`,
      lesson: 'Square the given sum or difference and solve for the symmetric expression you need.',
    },
  ],
  takeaways: [
    md`Rewrite powers over a common base before using $a^m a^n = a^{m+n}$ and $(a^m)^n = a^{mn}$.`,
    md`$\sqrt{a + b} \ne \sqrt{a} + \sqrt{b}$, and $\sqrt{x^2} = |x|$.`,
    md`Know $(a \pm b)^2$, $a^2 - b^2$ and $a^3 \pm b^3$ in both directions; they replace long arithmetic.`,
    md`$x - c$ is a factor of $P(x)$ exactly when $P(c) = 0$.`,
    'Cancel factors, never terms.',
  ],
  practice: { examKey: PRACTICE_EXAM, domain: PRACTICE_DOMAIN, skill: 'math-algebra-expressions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const firstAndSecondDegreeEquations: Lesson = {
  slug: 'first-and-second-degree-equations',
  title: 'First and second degree equations',
  summary: 'Solve linear and quadratic equations by hand, read the discriminant, use the sum and product of roots, and reject values outside the domain.',
  minutes: 22,
  objectives: [
    'Solve linear equations, including those with fractions, and recognise when there is no solution or every number is a solution.',
    'Solve quadratic equations by factoring or by the formula, and use the discriminant to count real solutions.',
    'Use the sum and product of the roots without solving the equation.',
    'Solve equations with the unknown in a denominator and discard values outside the domain.',
  ],
  teachMd: md`
### First degree equations

An equation of the form $ax + b = 0$ has:

- exactly one solution, $x = -\frac{b}{a}$, when $a \ne 0$;
- no solution when $a = 0$ and $b \ne 0$ (it says $b = 0$, which is false);
- every real number as a solution when $a = 0$ and $b = 0$ (it says $0 = 0$).

The last two cases appear in questions with a parameter, so do not divide by a coefficient that might be zero.

With fractions, multiply both sides by the least common denominator first. Put brackets round every numerator before multiplying, because the minus sign in front of a fraction applies to its whole numerator: $-\frac{x - 1}{4}$ becomes $-(x - 1) = -x + 1$ after clearing.

### Second degree equations

A quadratic $ax^2 + bx + c = 0$ with $a \ne 0$ can be solved three ways.

**Factoring** is fastest when it works. Find two numbers with product $ac$ and sum $b$; when $a = 1$, two numbers with product $c$ and sum $b$. Then use the zero-product rule: if $PQ = 0$, then $P = 0$ or $Q = 0$.

**Special forms** need no formula. If $b = 0$, isolate $x^2$: $x^2 = 16$ gives $x = \pm 4$. If $c = 0$, factor out $x$: $x^2 = 3x$ gives $x(x - 3) = 0$, so $x = 0$ or $x = 3$.

**The quadratic formula** always works:

$$x = \frac{-b \pm \sqrt{\Delta}}{2a}, \qquad \Delta = b^2 - 4ac.$$

### The discriminant counts the solutions

| $\Delta$ | Real solutions |
| --- | --- |
| $\Delta > 0$ | two distinct |
| $\Delta = 0$ | one (a repeated root, $x = -\frac{b}{2a}$) |
| $\Delta < 0$ | none |

Questions often ask "for which values of $k$ does the equation have two real solutions?" Set up $\Delta$ in terms of $k$ and solve the inequality; you never need the roots themselves.

### Sum and product of the roots

If $x_1$ and $x_2$ are the roots of $ax^2 + bx + c = 0$, then

$$x_1 + x_2 = -\frac{b}{a}, \qquad x_1 x_2 = \frac{c}{a}.$$

These follow from writing $a(x - x_1)(x - x_2)$ and comparing coefficients. They answer questions about the roots without the formula, and they check a solution: for $2x^2 - 7x + 3 = 0$ the roots should add to $\frac{7}{2}$ and multiply to $\frac{3}{2}$. They describe the real roots only when $\Delta \ge 0$, so check that first.

### Equations that reduce to quadratics

A biquadratic such as $x^4 - 13x^2 + 36 = 0$ becomes a quadratic with $t = x^2$: $t^2 - 13t + 36 = (t - 4)(t - 9) = 0$, so $x^2 = 4$ or $x^2 = 9$, and $x = \pm 2$ or $x = \pm 3$. Remember that $t = x^2$ cannot be negative: a negative value of $t$ gives no real $x$.

### The unknown in a denominator

Before you clear denominators, write down the **domain**: the values that make any denominator zero are excluded. After solving, throw out any solution in that excluded set. Multiplying by an expression that can be zero can create such false solutions, which is why the check is not optional.

### Never divide by the unknown

Dividing both sides of $x^2 = 3x$ by $x$ gives $x = 3$ and silently loses $x = 0$. Move everything to one side and factor instead.
`,
  examples: [
    {
      id: 'example-linear-with-fractions',
      title: 'A linear equation with fractions',
      problemMd: md`Solve $\frac{x + 2}{3} - \frac{x - 1}{4} = 2$.`,
      steps: [
        md`Multiply both sides by the common denominator 12, keeping each numerator in brackets: $4(x + 2) - 3(x - 1) = 24$.`,
        md`Expand, paying attention to the minus sign: $4x + 8 - 3x + 3 = 24$.`,
        md`Collect: $x + 11 = 24$, so $x = 13$.`,
        md`Check: $\frac{15}{3} - \frac{12}{4} = 5 - 3 = 2$.`,
      ],
      answerMd: md`$x = 13$. Writing $-3x - 3$ instead of $-3x + 3$ gives $x + 5 = 24$ and the wrong answer $x = 19$.`,
    },
    {
      id: 'example-quadratic-formula',
      title: 'A quadratic by the formula, checked two ways',
      problemMd: md`Solve $2x^2 - 7x + 3 = 0$.`,
      steps: [
        md`Identify $a = 2$, $b = -7$, $c = 3$, and compute $\Delta = (-7)^2 - 4 \cdot 2 \cdot 3 = 49 - 24 = 25$.`,
        md`Apply the formula: $x = \frac{7 \pm 5}{4}$, so $x = 3$ or $x = \frac{1}{2}$.`,
        md`Check with sum and product: $3 + \frac{1}{2} = \frac{7}{2} = -\frac{b}{a}$ and $3 \cdot \frac{1}{2} = \frac{3}{2} = \frac{c}{a}$.`,
        md`Or factor: $2x^2 - 7x + 3 = (2x - 1)(x - 3)$, which gives the same roots.`,
      ],
      answerMd: md`$x = 3$ or $x = \frac{1}{2}$. Using $-b = -7$ instead of $+7$ in the formula gives the negatives of the roots, $-3$ and $-\frac{1}{2}$.`,
    },
    {
      id: 'example-excluded-value',
      title: 'A solution that is not allowed',
      problemMd: md`Solve $\frac{x^2}{x - 3} = \frac{9}{x - 3}$.`,
      steps: [
        md`Domain first: $x - 3 \ne 0$, so $x \ne 3$.`,
        md`Multiply both sides by $x - 3$: $x^2 = 9$, so $x = 3$ or $x = -3$.`,
        md`Discard $x = 3$, which is excluded. Check $x = -3$: both sides equal $\frac{9}{-6} = -\frac{3}{2}$.`,
      ],
      answerMd: md`The only solution is $x = -3$. Reporting $x = \pm 3$ includes a value that makes the denominators zero.`,
    },
    {
      id: 'example-parameter-discriminant',
      title: 'How many solutions, depending on k',
      problemMd: md`For which values of $k$ does $x^2 - 6x + k = 0$ have two distinct real solutions?`,
      steps: [
        md`Two distinct real solutions need $\Delta > 0$: $\Delta = 36 - 4k$.`,
        md`Solve $36 - 4k > 0$: $4k < 36$, so $k < 9$.`,
        md`At $k = 9$ the equation is $(x - 3)^2 = 0$, a single repeated root; for $k > 9$ there are no real roots.`,
      ],
      answerMd: md`Exactly when $k < 9$. Writing $k \le 9$ wrongly includes the case of one repeated root.`,
    },
  ],
  traps: [
    {
      title: 'Dividing by the unknown',
      md: md`Dividing by $x$ (or by any expression containing $x$) assumes it is not zero, and loses the solutions where it is. Bring everything to one side and factor.`,
    },
    {
      title: 'Forgetting the negative root',
      md: md`$x^2 = 16$ has two solutions, $4$ and $-4$. Taking a square root of both sides of an equation needs the $\pm$.`,
    },
    {
      title: 'Keeping an excluded value',
      md: md`Clearing denominators can produce a value that makes a denominator zero. Write the domain before you start and check every solution against it.`,
    },
    {
      title: 'The sign in the sum of roots',
      md: md`The sum of the roots is $-\frac{b}{a}$, with a minus sign, and the product is $\frac{c}{a}$, without one. For $x^2 + 5x + 6 = 0$ the roots are $-2$ and $-3$: sum $-5$, product $6$.`,
    },
  ],
  check: [
    {
      id: 'check-do-not-divide',
      title: 'A quadratic with no constant term',
      topic: 'Algebra: equations',
      stemMd: md`What are all the real solutions of $x^2 = 3x$?`,
      options: [
        { id: 'A', text: md`$x = 3$ only`, note: md`Dividing both sides by $x$ assumes $x \ne 0$ and loses the solution $x = 0$.` },
        { id: 'B', text: md`$x = 0$ or $x = 3$`, note: '' },
        { id: 'C', text: md`$x = -3$ or $x = 3$`, note: md`This treats the equation as $x^2 = 9$. Check $x = -3$: the left side is $9$, the right side is $-9$.` },
        { id: 'D', text: md`$x = 0$ or $x = -3$`, note: md`The sign of the second root is wrong: from $x(x - 3) = 0$, the second factor is zero at $x = 3$.` },
      ],
      answer: 'B',
      workingMd: md`Move everything to one side: $x^2 - 3x = 0$, so $x(x - 3) = 0$. A product is zero when a factor is zero: $x = 0$ or $x = 3$. Both check: $0 = 0$ and $9 = 9$.`,
      lesson: 'Factor instead of dividing by the unknown, so that no solution is lost.',
    },
    {
      id: 'check-sum-of-roots',
      title: 'Sum of the roots',
      topic: 'Algebra: equations',
      stemMd: md`What is the sum of the real solutions of $3x^2 + 12x - 5 = 0$?`,
      options: [
        { id: 'A', text: md`$-4$`, note: '' },
        { id: 'B', text: md`$-\frac{5}{3}$`, note: md`This is the product of the roots, $\frac{c}{a}$, not their sum.` },
        { id: 'C', text: md`$4$`, note: md`This is $\frac{b}{a}$ without the minus sign; the sum of the roots is $-\frac{b}{a}$.` },
        { id: 'D', text: md`$12$`, note: md`This is the coefficient $b$ alone, neither negated nor divided by $a = 3$.` },
      ],
      answer: 'A',
      workingMd: md`First check that there are two real roots: $\Delta = 12^2 - 4 \cdot 3 \cdot (-5) = 144 + 60 = 204 > 0$. Then the sum is $-\frac{b}{a} = -\frac{12}{3} = -4$. (By the formula the roots are $\frac{-12 \pm \sqrt{204}}{6}$, and adding them cancels the roots, leaving $\frac{-24}{6} = -4$.)`,
      lesson: 'Sum of roots is minus b over a; product is c over a; check the discriminant first.',
    },
    {
      id: 'check-no-solution',
      title: 'Fractions with the unknown below',
      topic: 'Algebra: equations',
      stemMd: md`Solve $\frac{1}{x - 1} + \frac{2}{x + 1} = \frac{2}{x^2 - 1}$.`,
      options: [
        { id: 'A', text: md`$x = \frac{1}{3}$`, note: md`This multiplies each fraction by its own denominator: $(x - 1) + 2(x + 1) = 2$. Clearing by $x^2 - 1$ leaves the other factor: $(x + 1) + 2(x - 1)$.` },
        { id: 'B', text: md`$x = 1$`, note: md`This is the result of the cleared equation, but $x = 1$ makes two denominators zero, so it is excluded.` },
        { id: 'C', text: md`$x = 1$ or $x = -1$`, note: md`These are the values that make a denominator zero: the excluded values, not solutions.` },
        { id: 'D', text: 'No real solution', note: '' },
      ],
      answer: 'D',
      workingMd: md`Domain: $x^2 - 1 = (x - 1)(x + 1) \ne 0$, so $x \ne 1$ and $x \ne -1$. Multiply by $(x - 1)(x + 1)$: $(x + 1) + 2(x - 1) = 2$, so $3x - 1 = 2$ and $x = 1$. That value is excluded, so the equation has no solution.`,
      lesson: 'Write the domain before clearing denominators, and reject any solution outside it.',
    },
  ],
  takeaways: [
    md`$ax + b = 0$ has one solution if $a \ne 0$, none if $a = 0, b \ne 0$, and infinitely many if $a = b = 0$.`,
    md`$\Delta = b^2 - 4ac$: positive, two roots; zero, one; negative, none.`,
    md`Sum of roots $-\frac{b}{a}$, product $\frac{c}{a}$.`,
    'Never divide by the unknown; factor instead.',
    'With the unknown in a denominator, find the excluded values first and reject them at the end.',
  ],
  practice: { examKey: PRACTICE_EXAM, domain: PRACTICE_DOMAIN, skill: 'math-algebra-equations' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const firstAndSecondDegreeInequalities: Lesson = {
  slug: 'first-and-second-degree-inequalities',
  title: 'First and second degree inequalities',
  summary: 'Solve linear, quadratic and fractional inequalities: when to flip the sign, how to read a parabola, and why you build a sign chart.',
  minutes: 22,
  objectives: [
    'Solve linear inequalities, flipping the sign when multiplying or dividing by a negative number.',
    'Solve quadratic inequalities from the roots and the direction of the parabola.',
    'Solve fractional inequalities with a sign chart, excluding the zeros of the denominator.',
  ],
  teachMd: md`
### Linear inequalities

You solve $ax + b > 0$ like an equation, with one extra rule: **multiplying or dividing both sides by a negative number reverses the inequality**. The reason is that multiplying by $-1$ reflects the number line: $2 < 5$, but $-2 > -5$.

Adding or subtracting anything, and multiplying or dividing by a positive number, keeps the direction. So $-3x > 6$ gives $x < -2$, while $3x > 6$ gives $x > 2$.

The answer is a set of numbers, usually an interval: $x < -2$ is the interval $(-\infty, -2)$; $-1 \le x < 4$ is $[-1, 4)$. A square bracket includes the endpoint, a round one excludes it.

A double inequality such as $-1 < 2x + 3 \le 7$ is solved on all three parts at once: subtract 3 to get $-4 < 2x \le 4$, then divide by 2 to get $-2 < x \le 2$.

### Quadratic inequalities: think of the parabola

To solve $ax^2 + bx + c > 0$ (or $<$, $\ge$, $\le$), do not try to "take square roots". Instead:

1. Find the roots of $ax^2 + bx + c = 0$.
2. Picture the parabola $y = ax^2 + bx + c$. If $a > 0$ it opens upwards: it is **negative between the roots and positive outside them**. If $a < 0$ it is the other way round. (Or multiply by $-1$ first to make $a$ positive, flipping the sign.)
3. Read off the answer.

For example, $x^2 - x - 6 = (x + 2)(x - 3)$ has roots $-2$ and $3$, and opens upwards, so:

| Inequality | Solution |
| --- | --- |
| $x^2 - x - 6 < 0$ | $-2 < x < 3$ |
| $x^2 - x - 6 \le 0$ | $-2 \le x \le 3$ |
| $x^2 - x - 6 > 0$ | $x < -2$ or $x > 3$ |
| $x^2 - x - 6 \ge 0$ | $x \le -2$ or $x \ge 3$ |

When $\Delta < 0$ there are no roots and the parabola never crosses the axis: with $a > 0$ it is always positive. So $x^2 + 2x + 5 > 0$ holds for **every** real $x$, and $x^2 + 2x + 5 < 0$ for **none**. When $\Delta = 0$, the parabola touches the axis once: $(x - 1)^2 > 0$ holds for every $x$ except $x = 1$, and $(x - 1)^2 \le 0$ only at $x = 1$.

A common special case: $x^2 > 9$ means $x < -3$ or $x > 3$, not just $x > 3$; and $x^2 < 9$ means $-3 < x < 3$.

### Fractional inequalities: the sign chart

For $\frac{N(x)}{D(x)} \ge 0$, you may **not** multiply both sides by $D(x)$, because you do not know whether it is positive or negative, so you do not know whether to flip. Instead:

1. Bring everything to one side and combine into one fraction, so the other side is $0$.
2. Find the zeros of the numerator and of the denominator.
3. Mark them on a number line and record the sign of each factor in each interval.
4. Choose the intervals with the sign you want. A zero of the numerator is included for $\ge$ or $\le$; a zero of the denominator is **never** included.

The same chart solves products: $(x - 1)(x + 4)(x - 6) < 0$ changes sign at each root.

### Check with a test value

Whatever the method, pick a number inside your answer and one outside and substitute them. It takes seconds and catches a reversed sign every time.
`,
  examples: [
    {
      id: 'example-linear-flip',
      title: 'A linear inequality that flips',
      problemMd: md`Solve $\frac{x - 1}{2} - \frac{2x + 1}{3} > 1$.`,
      steps: [
        md`Multiply by 6, a positive number, so the direction stays: $3(x - 1) - 2(2x + 1) > 6$.`,
        md`Expand: $3x - 3 - 4x - 2 > 6$, so $-x - 5 > 6$ and $-x > 11$.`,
        md`Multiply by $-1$ and **reverse** the sign: $x < -11$.`,
        md`Test $x = -12$: $\frac{-13}{2} - \frac{-23}{3} = -6.5 + 7.67 \approx 1.17 > 1$. At $x = -11$ the left side is exactly $-6 + 7 = 1$, which is not greater than 1, so $-11$ is correctly excluded.`,
      ],
      answerMd: md`$x < -11$. Forgetting to reverse the sign gives $x > -11$; the test value $x = 0$ gives $-\frac{1}{2} - \frac{1}{3} < 1$, which shows it is wrong.`,
    },
    {
      id: 'example-quadratic-between',
      title: 'A quadratic inequality',
      problemMd: md`Solve $-x^2 + x + 6 \ge 0$.`,
      steps: [
        md`Make the leading coefficient positive by multiplying by $-1$ and reversing: $x^2 - x - 6 \le 0$.`,
        md`Roots: $x^2 - x - 6 = (x + 2)(x - 3)$, so $-2$ and $3$.`,
        md`An upward parabola is $\le 0$ between its roots, endpoints included: $-2 \le x \le 3$.`,
        md`Test $x = 0$ in the original: $6 \ge 0$, true. Test $x = 4$: $-16 + 4 + 6 = -6$, false, as expected.`,
      ],
      answerMd: md`$-2 \le x \le 3$. Answering "$x \le -2$ or $x \ge 3$" comes from multiplying by $-1$ without reversing the sign.`,
    },
    {
      id: 'example-fraction-sign-chart',
      title: 'Do not multiply by the denominator',
      problemMd: md`Solve $\frac{x + 2}{x - 1} \le 1$.`,
      steps: [
        md`Bring everything to one side: $\frac{x + 2}{x - 1} - 1 = \frac{x + 2 - (x - 1)}{x - 1} = \frac{3}{x - 1} \le 0$.`,
        md`The numerator 3 is always positive, so the fraction is $\le 0$ exactly when the denominator is negative. It can never equal 0.`,
        md`$x - 1 < 0$ gives $x < 1$. The value $x = 1$ is excluded because the denominator is zero there.`,
        md`Test $x = 0$: $\frac{2}{-1} = -2 \le 1$, true. Test $x = 2$: $\frac{4}{1} = 4$, false.`,
      ],
      answerMd: md`$x < 1$. Multiplying both sides by $x - 1$ as if it were positive gives $x + 2 \le x - 1$, that is $2 \le -1$, and the false conclusion that there is no solution.`,
    },
  ],
  traps: [
    {
      title: 'Not reversing after a negative',
      md: md`Multiplying or dividing by a negative number reverses the inequality. This includes the step from $-x > 11$ to $x < -11$, and multiplying a quadratic by $-1$.`,
    },
    {
      title: 'Multiplying by an expression of unknown sign',
      md: md`In a fractional inequality the denominator can be positive for some $x$ and negative for others. Multiplying by it is only safe if you split into cases; a sign chart is quicker and safer.`,
    },
    {
      title: 'Solving x squared > 9 as x > 3',
      md: md`Squares hide signs: $x = -4$ also satisfies $x^2 > 9$. Write $x^2 - 9 > 0$, factor as $(x - 3)(x + 3) > 0$, and read the two outer intervals.`,
    },
    {
      title: 'Including a zero of the denominator',
      md: md`With $\ge$ or $\le$, zeros of the numerator belong to the answer, but zeros of the denominator never do: the expression is undefined there.`,
    },
  ],
  check: [
    {
      id: 'check-linear-negative',
      title: 'Dividing by a negative',
      topic: 'Algebra: inequalities',
      stemMd: md`Solve $-3x + 5 > 11$.`,
      options: [
        { id: 'A', text: md`$x < -\frac{16}{3}$`, note: md`This adds 5 to 11 instead of subtracting it, giving $-3x > 16$.` },
        { id: 'B', text: md`$x < -2$`, note: '' },
        { id: 'C', text: md`$x > -2$`, note: md`This divides by $-3$ without reversing the inequality. Test $x = 0$: $5 > 11$ is false.` },
        { id: 'D', text: md`$x > 2$`, note: md`This drops the minus sign of $-3x$, solving $3x > 6$ instead.` },
      ],
      answer: 'B',
      workingMd: md`Subtract 5: $-3x > 6$. Divide by $-3$ and reverse: $x < -2$. Test $x = -3$: $9 + 5 = 14 > 11$, true; test $x = 0$: $5 > 11$, false.`,
      lesson: 'Dividing by a negative number reverses the inequality.',
    },
    {
      id: 'check-quadratic-outside',
      title: 'Outside the roots',
      topic: 'Algebra: inequalities',
      stemMd: md`Which set is the solution of $x^2 - 5x + 4 \ge 0$?`,
      options: [
        { id: 'A', text: md`$1 \le x \le 4$`, note: md`This is where the parabola is $\le 0$, between the roots. An upward parabola is $\ge 0$ outside them.` },
        { id: 'B', text: md`$x \ge 4$`, note: md`This keeps only one of the two outer intervals; $x = 0$ also works, since $4 \ge 0$.` },
        { id: 'C', text: md`$x \le -4$ or $x \ge -1$`, note: md`This uses the roots of $(x + 1)(x + 4)$; the correct factoring is $(x - 1)(x - 4)$.` },
        { id: 'D', text: md`$x \le 1$ or $x \ge 4$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Factor: $x^2 - 5x + 4 = (x - 1)(x - 4)$, roots $1$ and $4$. The parabola opens upwards, so it is $\ge 0$ outside the roots, endpoints included: $x \le 1$ or $x \ge 4$. Test $x = 2$: $4 - 10 + 4 = -2$, not in the set, as expected.`,
      lesson: 'An upward parabola is negative between its roots and positive outside them.',
    },
    {
      id: 'check-fraction-negative',
      title: 'A fraction below zero',
      topic: 'Algebra: inequalities',
      stemMd: md`Solve $\frac{2x - 1}{x + 3} < 0$.`,
      options: [
        { id: 'A', text: md`$x < \frac{1}{2}$`, note: md`This multiplies by $x + 3$ as if it were always positive. For $x < -3$ the fraction is positive: at $x = -4$ it is $\frac{-9}{-1} = 9$.` },
        { id: 'B', text: md`$-3 \le x < \frac{1}{2}$`, note: md`At $x = -3$ the denominator is zero, so the expression is undefined there and cannot be included.` },
        { id: 'C', text: md`$-3 < x < \frac{1}{2}$`, note: '' },
        { id: 'D', text: md`$x < -3$ or $x > \frac{1}{2}$`, note: md`This is where the fraction is positive, the opposite of what is asked.` },
      ],
      answer: 'C',
      workingMd: md`The numerator is zero at $x = \frac{1}{2}$, the denominator at $x = -3$. Sign chart: for $x < -3$ both are negative (fraction positive); for $-3 < x < \frac{1}{2}$ the numerator is negative and the denominator positive (fraction negative); for $x > \frac{1}{2}$ both are positive. So the solution is $-3 < x < \frac{1}{2}$. Test $x = 0$: $\frac{-1}{3} < 0$, true.`,
      lesson: 'Use a sign chart for fractions, and never include a zero of the denominator.',
    },
  ],
  takeaways: [
    'Multiplying or dividing by a negative number reverses an inequality.',
    md`For $a > 0$, $ax^2 + bx + c$ is negative between its roots and positive outside them; with $\Delta < 0$ it is always positive.`,
    'Never multiply by an expression whose sign you do not know; build a sign chart instead.',
    'Zeros of a denominator are always excluded; test one value inside and one outside your answer.',
  ],
  practice: { examKey: PRACTICE_EXAM, domain: PRACTICE_DOMAIN, skill: 'math-algebra-inequalities' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const systemsWithTwoUnknowns: Lesson = {
  slug: 'systems-with-two-unknowns',
  title: 'Systems of equations with two unknowns',
  summary: 'Solve two-unknown systems by substitution or elimination, tell when there is one, no or infinitely many solutions, and intersect a line with a parabola.',
  minutes: 22,
  objectives: [
    'Solve a linear system in two unknowns by substitution or by elimination, choosing the quicker method.',
    'Decide from the coefficients whether a linear system has one solution, none or infinitely many.',
    'Solve a system of a line and a parabola, and find what a question asks for without solving fully when a combination is enough.',
  ],
  teachMd: md`
### What a solution is

A solution of a system is a **pair** $(x, y)$ that satisfies every equation at once. Each linear equation $ax + by = c$ is a straight line in the plane, so solving two of them means finding where the two lines meet.

### Substitution

Isolate one unknown in the equation where it is easiest (a coefficient of $1$ or $-1$), and substitute into the other:

$$\begin{cases} x - y = 1 \\ 2x + 3y = 7 \end{cases} \quad\Rightarrow\quad x = 1 + y \quad\Rightarrow\quad 2(1 + y) + 3y = 7.$$

So $5y = 5$, $y = 1$ and $x = 2$. Substitution is the natural choice when one equation is not linear, for example a parabola and a line.

### Elimination

Multiply the equations by numbers that make the coefficients of one unknown equal or opposite, then add or subtract the equations to remove it. For

$$\begin{cases} 3x + 2y = 16 \\ 5x - 2y = 8 \end{cases}$$

adding removes $y$ at once: $8x = 24$. Elimination is usually faster when both equations are linear and no coefficient is $1$.

### Combinations: answer the question asked

A question may ask for an expression such as $x + y$ or $3x + 2y$, not for $x$ and $y$. Before solving, see whether adding or subtracting the equations produces that expression directly. In the system above, the sum of the two equations is $8x = 24$; in the first system, adding $x - y = 1$ to $2x + 3y = 7$ gives $3x + 2y = 8$ immediately.

### One, none or infinitely many

Two lines in the plane meet once, never (parallel) or everywhere (the same line). For

$$\begin{cases} a_1 x + b_1 y = c_1 \\ a_2 x + b_2 y = c_2 \end{cases}$$

the test is the number $a_1 b_2 - a_2 b_1$:

| Condition | Lines | Solutions |
| --- | --- | --- |
| $a_1 b_2 - a_2 b_1 \ne 0$ | cross | exactly one |
| $a_1 b_2 - a_2 b_1 = 0$, equations inconsistent | parallel, distinct | none |
| $a_1 b_2 - a_2 b_1 = 0$, one equation a multiple of the other | the same line | infinitely many |

When $a_1 b_2 - a_2 b_1 = 0$, the left sides are proportional. Compare the right sides with the same factor: if they match, the equations say the same thing; if not, they contradict each other. For example, $x + 2y = 4$ and $3x + 6y = 12$ are the same line, while $x + 2y = 4$ and $3x + 6y = 5$ are parallel.

### A line and a parabola

To intersect $y = x^2 + px + q$ with $y = mx + n$, substitute the line into the parabola. You get a quadratic in $x$, and its discriminant tells you how the line sits:

- $\Delta > 0$: two intersection points (a secant);
- $\Delta = 0$: one point, the line is tangent;
- $\Delta < 0$: no common point.

Each root $x$ gives a point; find its $y$ from the **line**, which is quicker, and check it in the parabola.

### Word problems

Name the two unknowns explicitly, with units ("$a$ = number of adult tickets"), write one equation per independent fact, solve, then check the answer against the story: counts must be whole numbers, lengths positive. The check catches most setting-up errors.
`,
  examples: [
    {
      id: 'example-elimination',
      title: 'Elimination in one step',
      problemMd: md`Solve $3x + 2y = 16$ and $5x - 2y = 8$.`,
      steps: [
        md`The $y$ coefficients are opposite, so add the equations: $8x = 24$, $x = 3$.`,
        md`Substitute into the first: $9 + 2y = 16$, so $y = 3.5$.`,
        md`Check in the second: $15 - 7 = 8$.`,
      ],
      answerMd: md`$(x, y) = (3, 3.5)$. Subtracting the equations instead of adding them gives $-2x + 4y = 8$, which still has both unknowns and solves nothing.`,
    },
    {
      id: 'example-parameter-system',
      title: 'Counting solutions with a parameter',
      problemMd: md`For which values of $k$ does the system $kx + 2y = 4$, $3x + 6y = 5$ have exactly one solution? What happens for the other values?`,
      steps: [
        md`Compute $a_1 b_2 - a_2 b_1 = k \cdot 6 - 3 \cdot 2 = 6k - 6$.`,
        md`Exactly one solution when $6k - 6 \ne 0$, that is $k \ne 1$.`,
        md`At $k = 1$: the first equation is $x + 2y = 4$; dividing the second by 3 gives $x + 2y = \frac{5}{3}$. The same left side cannot equal both 4 and $\frac{5}{3}$, so there is no solution.`,
      ],
      answerMd: md`One solution for every $k \ne 1$; no solution at $k = 1$, where the lines are parallel and distinct. Concluding "infinitely many" at $k = 1$ skips the comparison of the right sides.`,
    },
    {
      id: 'example-line-parabola',
      title: 'Where a line meets a parabola',
      problemMd: md`Find the intersection points of $y = x^2 - 2x$ and $y = x + 4$.`,
      steps: [
        md`Set the two expressions for $y$ equal: $x^2 - 2x = x + 4$, so $x^2 - 3x - 4 = 0$.`,
        md`Factor: $(x - 4)(x + 1) = 0$, so $x = 4$ or $x = -1$.`,
        md`Find $y$ from the line: $x = 4$ gives $y = 8$; $x = -1$ gives $y = 3$.`,
        md`Check in the parabola: $16 - 8 = 8$ and $1 + 2 = 3$.`,
      ],
      answerMd: md`The points are $(4, 8)$ and $(-1, 3)$. Stopping at $x = 4$ and $x = -1$ gives only half of each answer; a point needs both coordinates.`,
    },
    {
      id: 'example-tickets',
      title: 'A word problem',
      problemMd: md`A theatre sold 40 tickets for €395. Adult tickets cost €12 and child tickets €7. How many of each were sold?`,
      steps: [
        md`Let $a$ be the number of adult tickets and $c$ the number of child tickets: $a + c = 40$ and $12a + 7c = 395$.`,
        md`Substitute $c = 40 - a$: $12a + 280 - 7a = 395$, so $5a = 115$ and $a = 23$.`,
        md`Then $c = 17$. Check the money: $12 \cdot 23 + 7 \cdot 17 = 276 + 119 = 395$.`,
      ],
      answerMd: md`23 adult and 17 child tickets. If a setup gives a fraction of a ticket, the equations are wrong, not the arithmetic.`,
    },
  ],
  traps: [
    {
      title: 'Substitution sign slips',
      md: md`From $x - y = 1$ the substitution is $x = 1 + y$, not $x = 1 - y$. After solving, put the pair back into **both** original equations; one check is not enough.`,
    },
    {
      title: 'Assuming a proportional system has no solution',
      md: md`When the left sides are proportional, compare the right sides with the same factor. Matching right sides mean the same line and infinitely many solutions; only mismatched ones mean none.`,
    },
    {
      title: 'Answering with x when the question asks for something else',
      md: md`Read what is asked: $y$, $x + y$, the product $xy$, or the number of solutions. Often a combination of the equations gives it directly, and finding $x$ alone answers nothing.`,
    },
    {
      title: 'Taking y from the wrong curve',
      md: md`For a line and a parabola both curves give the same $y$ at a true intersection point, so either works, but a slip in squaring a negative $x$ is common. Use the line for speed and the parabola as a check.`,
    },
  ],
  check: [
    {
      id: 'check-combination',
      title: 'Asked for a combination',
      topic: 'Algebra: systems',
      stemMd: md`If $2x + 3y = 7$ and $x - y = 1$, what is the value of $3x + 2y$?`,
      options: [
        { id: 'A', text: '6', note: md`This subtracts the equations, which gives $x + 4y = 6$: a different combination from the one asked.` },
        { id: 'B', text: '7', note: md`This swaps the solution, using $(x, y) = (1, 2)$; that pair does not satisfy $x - y = 1$.` },
        { id: 'C', text: '8', note: '' },
        { id: 'D', text: '9', note: md`This is $3(x + y) = 3 \times 3$, using 3 as the coefficient of $y$ as well as of $x$.` },
      ],
      answer: 'C',
      workingMd: md`Add the two equations: $(2x + 3y) + (x - y) = 7 + 1$, so $3x + 2y = 8$ directly. Check by solving: $x = 1 + y$ gives $2 + 2y + 3y = 7$, so $y = 1$, $x = 2$, and $3(2) + 2(1) = 8$.`,
      lesson: 'Look for a combination of the equations that gives the requested expression before solving for each unknown.',
    },
    {
      id: 'check-parameter-infinite',
      title: 'A system with a parameter',
      topic: 'Algebra: systems',
      stemMd: md`Consider the system $2x + ay = 3$ and $4x + 6y = 6$. Which statement is true?`,
      options: [
        { id: 'A', text: md`At $a = 3$ the system has no solution.`, note: md`At $a = 3$ the second equation is exactly twice the first ($4x + 6y = 6$), so the lines coincide; there are infinitely many solutions, not none.` },
        { id: 'B', text: md`At $a = 3$ the system has infinitely many solutions.`, note: '' },
        { id: 'C', text: md`The system has exactly one solution for every value of $a$.`, note: md`At $a = 3$ the expression $a_1 b_2 - a_2 b_1 = 12 - 4a$ is zero, so the solution is not unique there.` },
        { id: 'D', text: md`At $a = 12$ the system has infinitely many solutions.`, note: md`This comes from a cross-multiplication slip, setting $a = 2 \cdot 6$. The left sides are proportional when $\frac{2}{4} = \frac{a}{6}$, which gives $a = 3$.` },
      ],
      answer: 'B',
      workingMd: md`$a_1 b_2 - a_2 b_1 = 2 \cdot 6 - 4a = 12 - 4a$, which is zero only at $a = 3$; for every other $a$ there is exactly one solution. At $a = 3$ the first equation is $2x + 3y = 3$, and twice it is $4x + 6y = 6$, the second equation exactly. The two equations describe the same line, so there are infinitely many solutions.`,
      lesson: 'When the left sides are proportional, compare the right sides to decide between none and infinitely many.',
    },
    {
      id: 'check-line-parabola-y',
      title: 'Line meets parabola',
      topic: 'Algebra: systems',
      stemMd: md`The line $y = 2x + 3$ meets the parabola $y = x^2$ at two points. What is the sum of the $y$-coordinates of these points?`,
      options: [
        { id: 'A', text: md`$-3$`, note: md`This is the product of the $x$-coordinates, $3 \times (-1)$, not a sum of $y$-coordinates.` },
        { id: 'B', text: md`$2$`, note: md`This is the sum of the $x$-coordinates, $3 + (-1)$.` },
        { id: 'C', text: md`$8$`, note: md`This takes $y = -1$ at $x = -1$, forgetting that $(-1)^2 = 1$; the line agrees: $2(-1) + 3 = 1$.` },
        { id: 'D', text: md`$10$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Set $x^2 = 2x + 3$: $x^2 - 2x - 3 = 0$, so $(x - 3)(x + 1) = 0$ and $x = 3$ or $x = -1$. The points are $(3, 9)$ and $(-1, 1)$; check with the line: $2(3) + 3 = 9$ and $2(-1) + 3 = 1$. The sum of the $y$-coordinates is $9 + 1 = 10$.`,
      lesson: 'Substitute to get a quadratic in x, then find each y and check it on both curves.',
    },
  ],
  takeaways: [
    'Use substitution when one equation is easy to rearrange or not linear; elimination when both are linear.',
    md`$a_1 b_2 - a_2 b_1 \ne 0$ means exactly one solution; if it is zero, compare the right sides: same line or parallel lines.`,
    'A line and a parabola meet in two, one or no points, according to the discriminant of the resulting quadratic.',
    'Read what is asked: a combination of the equations often gives it without solving.',
  ],
  practice: { examKey: PRACTICE_EXAM, domain: PRACTICE_DOMAIN, skill: 'math-algebra-systems' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const absoluteValues: Lesson = {
  slug: 'absolute-values',
  title: 'Equations and inequalities with absolute values',
  summary: 'Read absolute value as distance, solve equations and inequalities by splitting into cases, and check the conditions that remove false solutions.',
  minutes: 22,
  objectives: [
    'Interpret an absolute value as a distance on the number line.',
    md`Solve equations of the forms $|A| = k$, $|A| = |B|$ and $|A| = B$, checking the condition each case needs.`,
    md`Solve inequalities of the forms $|A| < k$ and $|A| > k$, and sums of absolute values by splitting at critical points.`,
  ],
  teachMd: md`
### Definition and meaning

The absolute value of a number is its distance from zero:

$$|x| = \begin{cases} x & \text{if } x \ge 0 \\ -x & \text{if } x < 0 \end{cases}$$

So $|5| = 5$, $|-5| = 5$ and $|0| = 0$. An absolute value is **never negative**. The second line looks odd at first: if $x = -5$, then $-x = 5$, which is positive.

More useful still: $|x - a|$ is the **distance between $x$ and $a$** on the number line. Then $|x - 2| = 3$ asks for the points at distance 3 from 2, which are $-1$ and $5$, and $|x + 4| < 1$ asks for the points within 1 of $-4$, because $x + 4 = x - (-4)$.

Useful properties: $|ab| = |a| \cdot |b|$, $\left|\frac{a}{b}\right| = \frac{|a|}{|b|}$, $|{-a}| = |a|$ and $\sqrt{x^2} = |x|$. But $|a + b|$ is **not** $|a| + |b|$ in general: $|3 + (-5)| = 2$, while $|3| + |-5| = 8$.

### Equations

**Form 1: $|A| = k$, with $k$ a number.** If $k > 0$, then $A = k$ or $A = -k$: two equations. If $k = 0$, then $A = 0$. If $k < 0$, there is **no solution**, since an absolute value cannot be negative.

**Form 2: $|A| = |B|$.** Two numbers with the same absolute value are equal or opposite, so $A = B$ or $A = -B$.

**Form 3: $|A| = B$, where $B$ contains the unknown.** Now the right side might be negative for some $x$, and those $x$ cannot be solutions. Either:

- solve $A = B$ and $A = -B$, then keep only the solutions with $B \ge 0$; or
- split by the sign of $A$: where $A \ge 0$ solve $A = B$; where $A < 0$ solve $-A = B$; and keep each solution only if it lies in its own case.

Both routes give the same answer. The check is not optional: this form is built to produce false solutions.

### Inequalities

For $k > 0$:

$$|A| < k \iff -k < A < k \qquad\qquad |A| > k \iff A < -k \ \text{ or } \ A > k$$

The first says "within $k$ of zero", one interval; the second says "farther than $k$ from zero", two separate pieces. The same holds with $\le$ and $\ge$, endpoints included.

If $k \le 0$, think instead of solving: $|A| < -2$ has no solution; $|A| > -2$ holds for every $x$ where $A$ is defined; $|A| \le 0$ holds only where $A = 0$.

### More than one absolute value: split at critical points

For an expression such as $|x - 1| + |x + 2|$, each absolute value changes formula where its inside is zero, here at $x = 1$ and $x = -2$. These critical points cut the line into intervals. In each interval every absolute value has a fixed sign, so you can drop the bars, solve an ordinary equation and **keep the solution only if it lies in that interval**.

| Interval | $x - 1$ | $x + 2$ | Expression |
| --- | --- | --- | --- |
| $x < -2$ | negative | negative | $-(x - 1) - (x + 2) = -2x - 1$ |
| $-2 \le x < 1$ | negative | non-negative | $-(x - 1) + (x + 2) = 3$ |
| $x \ge 1$ | non-negative | non-negative | $(x - 1) + (x + 2) = 2x + 1$ |

The middle row has a distance meaning too: for any $x$ between $-2$ and $1$, the distances to $-2$ and to $1$ add up to the gap between them, which is 3.

### The graph in one sentence

The graph of $y = |x - a|$ is a V with its corner at $(a, 0)$. The functions unit draws it in detail; for now, the V shape explains why $|A| = k$ (a horizontal line meeting the V) has two, one or no solutions.
`,
  examples: [
    {
      id: 'example-two-cases',
      title: 'An equation with a number on the right',
      problemMd: md`Solve $|2x - 3| = 7$.`,
      steps: [
        md`The right side is positive, so $2x - 3 = 7$ or $2x - 3 = -7$.`,
        md`First case: $2x = 10$, $x = 5$. Second case: $2x = -4$, $x = -2$.`,
        md`Check: $|10 - 3| = 7$ and $|-4 - 3| = |-7| = 7$.`,
      ],
      answerMd: md`$x = 5$ or $x = -2$. Solving only $2x - 3 = 7$ misses half the answer.`,
    },
    {
      id: 'example-unknown-on-right',
      title: 'The unknown on both sides',
      problemMd: md`Solve $|x - 4| = 2x + 1$.`,
      steps: [
        md`The right side must be non-negative: $2x + 1 \ge 0$, so $x \ge -\frac{1}{2}$.`,
        md`Case $x - 4 = 2x + 1$: $x = -5$. This fails $x \ge -\frac{1}{2}$ (the right side would be $-9$), so reject it.`,
        md`Case $x - 4 = -(2x + 1)$: $x - 4 = -2x - 1$, so $3x = 3$ and $x = 1$, which satisfies $x \ge -\frac{1}{2}$.`,
        md`Check $x = 1$: $|1 - 4| = 3$ and $2(1) + 1 = 3$.`,
      ],
      answerMd: md`Only $x = 1$. Keeping $x = -5$ is the trap: $|-5 - 4| = 9$, but the right side is $-9$.`,
    },
    {
      id: 'example-inequality-inside',
      title: 'An absolute value inequality',
      problemMd: md`Solve $|3x + 1| \le 5$.`,
      steps: [
        md`"At most 5 from zero": $-5 \le 3x + 1 \le 5$.`,
        md`Subtract 1 from all three parts: $-6 \le 3x \le 4$.`,
        md`Divide by 3 (positive, no flip): $-2 \le x \le \frac{4}{3}$.`,
        md`Check the ends: $|-6 + 1| = 5$ and $|4 + 1| = 5$; at $x = 0$, $|1| \le 5$.`,
      ],
      answerMd: md`$-2 \le x \le \frac{4}{3}$. Solving only $3x + 1 \le 5$ gives $x \le \frac{4}{3}$, which wrongly includes values such as $x = -3$, where $|{-8}| = 8$.`,
    },
    {
      id: 'example-sum-of-absolute-values',
      title: 'Two absolute values',
      problemMd: md`Solve $|x - 1| + |x + 2| = 5$.`,
      steps: [
        md`Critical points: $x = 1$ and $x = -2$. Use the three formulas from the table above.`,
        md`For $x \ge 1$: $2x + 1 = 5$, so $x = 2$, which lies in $x \ge 1$. Keep it.`,
        md`For $-2 \le x < 1$: the expression is $3$, and $3 = 5$ is false, so there is no solution in this interval.`,
        md`For $x < -2$: $-2x - 1 = 5$, so $x = -3$, which lies in $x < -2$. Keep it.`,
        md`Check: $|1| + |4| = 5$ and $|-4| + |-1| = 5$.`,
      ],
      answerMd: md`$x = -3$ or $x = 2$. As distances: the points whose distances to $1$ and $-2$ add to 5 lie 1 unit outside each end of the segment from $-2$ to $1$.`,
    },
  ],
  traps: [
    {
      title: 'Forgetting the negative case',
      md: md`$|A| = k$ with $k > 0$ always gives two equations, $A = k$ and $A = -k$. Writing only the first loses a solution.`,
    },
    {
      title: 'Accepting a solution that makes the right side negative',
      md: md`In $|A| = B$ with $B$ depending on $x$, every solution must give $B \ge 0$. Check each one; this is where the false solutions hide.`,
    },
    {
      title: 'Reading the distance from the wrong point',
      md: md`$|x + 3|$ is the distance from $x$ to $-3$, not to $3$. Rewrite $x + 3$ as $x - (-3)$ if in doubt.`,
    },
    {
      title: 'Swapping the two inequality shapes',
      md: md`"Less than" gives one interval in the middle ($-k < A < k$); "greater than" gives two outer pieces ($A < -k$ or $A > k$). A test value outside your answer should fail.`,
    },
    {
      title: 'Treating absolute value as distributive over sums',
      md: md`$|a + b| \le |a| + |b|$, with equality only when $a$ and $b$ do not have opposite signs. You cannot split $|x - 1 + 2x|$ into $|x - 1| + |2x|$.`,
    },
  ],
  check: [
    {
      id: 'check-distance-interval',
      title: 'Within a distance',
      topic: 'Algebra: absolute values',
      stemMd: md`Which set is the solution of $|x + 3| < 2$?`,
      options: [
        { id: 'A', text: md`$x < -1$`, note: md`This solves only $x + 3 < 2$ and drops the other side. Test $x = -10$: $|{-7}| = 7$, not less than 2.` },
        { id: 'B', text: md`$1 < x < 5$`, note: md`This measures distance from $+3$; $|x + 3|$ is the distance from $-3$.` },
        { id: 'C', text: md`$x < -5$ or $x > -1$`, note: md`This is the solution of $|x + 3| > 2$, the points farther than 2 from $-3$.` },
        { id: 'D', text: md`$-5 < x < -1$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`$|x + 3| < 2$ means $-2 < x + 3 < 2$; subtract 3: $-5 < x < -1$. As a distance: the points within 2 of $-3$. Test $x = -3$: $0 < 2$, true; $x = 0$: $3 < 2$, false.`,
      lesson: 'An absolute value less than k gives one interval centred on the point where the inside is zero.',
    },
    {
      id: 'check-unknown-both-sides',
      title: 'Two cases, both checked',
      topic: 'Algebra: absolute values',
      stemMd: md`What are all the real solutions of $|2x - 1| = x + 4$?`,
      options: [
        { id: 'A', text: md`$x = 5$ only`, note: md`This solves only $2x - 1 = x + 4$. The case $2x - 1 = -(x + 4)$ also gives a valid solution, $x = -1$.` },
        { id: 'B', text: md`$x = -\frac{5}{3}$ or $x = 5$`, note: md`This writes $-(2x - 1)$ as $-2x - 1$, forgetting to change the sign of the $-1$. Check $x = -\frac{5}{3}$: the left side is $\frac{13}{3}$, the right side $\frac{7}{3}$.` },
        { id: 'C', text: md`$x = -1$ or $x = 5$`, note: '' },
        { id: 'D', text: md`$x = -5$ or $x = 1$`, note: md`Every sign is flipped. Check $x = 1$: the left side is $|1| = 1$, the right side is $5$.` },
      ],
      answer: 'C',
      workingMd: md`The right side must be non-negative: $x \ge -4$. Case $2x - 1 = x + 4$: $x = 5$. Case $2x - 1 = -(x + 4) = -x - 4$: $3x = -3$, $x = -1$. Both satisfy $x \ge -4$. Check: $|9| = 9 = 5 + 4$ and $|-3| = 3 = -1 + 4$.`,
      lesson: 'Solve both cases, then keep only the solutions that make the right side non-negative.',
    },
    {
      id: 'check-farther-than',
      title: 'Farther than a distance',
      topic: 'Algebra: absolute values',
      stemMd: md`Which set is the solution of $|x - 2| \ge 3$?`,
      options: [
        { id: 'A', text: md`$-1 \le x \le 5$`, note: md`This is the solution of $|x - 2| \le 3$: the points within 3 of 2, the opposite of what is asked.` },
        { id: 'B', text: md`$x \le -5$ or $x \ge 1$`, note: md`This measures distance from $-2$; $|x - 2|$ is the distance from $+2$.` },
        { id: 'C', text: md`$x \le -1$ or $x \ge 5$`, note: '' },
        { id: 'D', text: md`$x \ge 5$`, note: md`This keeps only $x - 2 \ge 3$. The other piece, $x - 2 \le -3$, adds $x \le -1$; for example $x = -4$ is at distance 6 from 2.` },
      ],
      answer: 'C',
      workingMd: md`$|x - 2| \ge 3$ means $x - 2 \le -3$ or $x - 2 \ge 3$, so $x \le -1$ or $x \ge 5$: the points at least 3 away from 2. Test $x = 2$: $0 \ge 3$, false, as it should be.`,
      lesson: 'An absolute value greater than k gives two outer pieces, not one interval.',
    },
  ],
  takeaways: [
    md`$|x - a|$ is the distance from $x$ to $a$; an absolute value is never negative.`,
    md`$|A| = k$ with $k > 0$: $A = \pm k$. With $k < 0$: no solution.`,
    md`$|A| = B$ with the unknown in $B$: solve both cases and keep only solutions with $B \ge 0$.`,
    md`$|A| < k$ is one interval, $-k < A < k$; $|A| > k$ is two pieces, $A < -k$ or $A > k$.`,
    'With several absolute values, split at the points where each inside is zero and check each solution against its interval.',
  ],
  practice: { examKey: PRACTICE_EXAM, domain: PRACTICE_DOMAIN, skill: 'math-algebra-absolute-values' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const expressingQuantitiesAsFunctions: Lesson = {
  slug: 'expressing-quantities-as-functions',
  title: 'Expressing one quantity as a function of others',
  summary: 'Turn a description into a formula in one variable, eliminate the extra unknowns with the constraints, state the domain, and rearrange formulas.',
  minutes: 20,
  objectives: [
    'Translate a verbal or geometric situation into a formula for the requested quantity in terms of a chosen variable.',
    'Use a constraint to eliminate a second variable, and state the domain the context allows.',
    'Rearrange a formula to make another variable the subject, noting the values where it fails.',
  ],
  teachMd: md`
### What the question is asking

A question of this type describes a situation and asks for one quantity **as a function of** another: "express the area as a function of the width", "write the profit in terms of the number of items sold". The answer is a formula with exactly one variable in it, the one named, plus fixed numbers. If your formula still contains a second letter, you are not finished.

### A four-step method

1. **Name the variables.** Write down what each letter means, with units: "$x$ = width in metres".
2. **Write the target quantity** in whatever variables are natural: area $= x \cdot y$, profit $=$ revenue $-$ cost.
3. **Use the constraint** the problem gives (a fixed perimeter, a fixed total, a geometric relation) to write the extra variable in terms of the chosen one, and substitute.
4. **State the domain.** Lengths are positive, counts are whole numbers, a square root needs a non-negative argument, and a denominator cannot be zero. The domain is part of the answer, and it often decides which option is right.

### Common patterns

| Situation | Typical formula |
| --- | --- |
| Fixed charge plus a rate | $C(x) = F + rx$ (a straight line) |
| Price falls as quantity rises | revenue $R(x) = x \cdot p(x)$, often a quadratic |
| Profit | $P(x) = R(x) - C(x)$ |
| Rectangle with fixed perimeter $2s$ | width $x$, length $s - x$, area $x(s - x)$ |
| Rectangle with fixed area $S$ | width $x$, length $\frac{S}{x}$, perimeter $2x + \frac{2S}{x}$ |
| Right triangle with hypotenuse $h$ | legs $x$ and $\sqrt{h^2 - x^2}$ |
| Time for a distance at a speed | $t = \frac{d}{v}$ |

Two quantities are **directly proportional** when one is a fixed multiple of the other ($y = kx$), and **inversely proportional** when their product is fixed ($y = \frac{k}{x}$). Doubling a rectangle's width at fixed area halves its length: inverse proportion.

### Units

Check that every term has the same unit before adding. A taxi fare with a per-kilometre rate cannot have the distance in metres, and a speed in kilometres per hour needs a time in hours: 20 minutes is $\frac{1}{3}$ hour, not $0.2$.

### Rearranging a formula

Making another variable the subject is the same skill run backwards. Treat the other letters as fixed numbers and undo the operations in reverse order. When the variable you want appears in more than one place, collect all its terms on one side and **factor it out**:

$$y = \frac{3x + 2}{x - 1} \;\Rightarrow\; y(x - 1) = 3x + 2 \;\Rightarrow\; xy - 3x = y + 2 \;\Rightarrow\; x(y - 3) = y + 2 \;\Rightarrow\; x = \frac{y + 2}{y - 3}.$$

The new formula has its own restriction ($y \ne 3$), because you divided by $y - 3$. Check the rearrangement with one number: $x = 2$ gives $y = 8$, and $\frac{8 + 2}{8 - 3} = 2$.

### Why the check matters

Pick one simple value of the variable, compute the quantity directly from the story, and compare it with your formula. A wrong formula often differs from the right one by a factor of 2, a sign, or a missing term, and one substitution tells them apart.
`,
  examples: [
    {
      id: 'example-fixed-perimeter',
      title: 'Area at a fixed perimeter',
      problemMd: md`A rectangle has perimeter 40 cm. Express its area $A$ as a function of its width $x$, and give the domain. Which width gives the largest area?`,
      steps: [
        md`The perimeter is $2x + 2y = 40$, where $y$ is the length, so $y = 20 - x$.`,
        md`Area: $A = xy = x(20 - x) = 20x - x^2$.`,
        md`Domain: both sides must be positive, $x > 0$ and $20 - x > 0$, so $0 < x < 20$.`,
        md`The parabola $A = -x^2 + 20x$ opens downwards with roots $0$ and $20$; its top is midway, at $x = 10$, where $A = 100$ (a square).`,
        md`Check with $x = 5$: the length is 15, the perimeter $2(5 + 15) = 40$, and $A = 75 = 20(5) - 25$.`,
      ],
      answerMd: md`$A(x) = x(20 - x)$ for $0 < x < 20$, largest at $x = 10$ cm with $A = 100$ cm². Writing the length as $40 - x$ uses the whole perimeter for one width and one length, instead of half of it.`,
    },
    {
      id: 'example-right-triangle',
      title: 'A geometric constraint',
      problemMd: md`A right triangle has hypotenuse 10. Express its area as a function of one leg $x$.`,
      steps: [
        md`Call the other leg $y$. By Pythagoras, $x^2 + y^2 = 100$, so $y = \sqrt{100 - x^2}$ (positive, as a length).`,
        md`The legs are perpendicular, so the area is half their product: $A = \frac{1}{2}x\sqrt{100 - x^2}$.`,
        md`Domain: $x > 0$ and $y > 0$, so $0 < x < 10$.`,
        md`Check with $x = 6$: $y = \sqrt{64} = 8$ and $A = \frac{1}{2} \cdot 6 \cdot 8 = 24$.`,
      ],
      answerMd: md`$A(x) = \frac{x}{2}\sqrt{100 - x^2}$ for $0 < x < 10$. Writing $y = 10 - x$ is the trap: the legs do not add up to the hypotenuse.`,
    },
    {
      id: 'example-taxi-inverse',
      title: 'A linear cost and its inverse',
      problemMd: md`A taxi charges €3.50 plus €1.20 per kilometre. Write the fare $C$ as a function of the distance $d$ in km, then express $d$ as a function of $C$, and find the distance for a fare of €15.50.`,
      steps: [
        md`Fixed charge plus rate: $C(d) = 3.5 + 1.2d$, for $d \ge 0$.`,
        md`Rearrange: $C - 3.5 = 1.2d$, so $d = \frac{C - 3.5}{1.2}$, for $C \ge 3.5$.`,
        md`For $C = 15.5$: $d = \frac{12}{1.2} = 10$ km. Check: $3.5 + 1.2 \times 10 = 15.5$.`,
      ],
      answerMd: md`$C = 3.5 + 1.2d$ and $d = \frac{C - 3.5}{1.2}$; a fare of €15.50 covers 10 km. Dividing the whole fare by the rate ($\frac{15.5}{1.2} \approx 12.9$ km) forgets the fixed charge.`,
    },
  ],
  traps: [
    {
      title: 'Leaving a second variable in the answer',
      md: md`"Area as a function of $x$" means no $y$ may remain. If a letter other than the named one is left, use the constraint to eliminate it.`,
    },
    {
      title: 'Ignoring the domain',
      md: md`A width cannot be negative and a leg cannot exceed the hypotenuse. A formula may be defined for more values than the situation allows; state the domain the situation gives.`,
    },
    {
      title: 'Using the whole perimeter for one side',
      md: md`With perimeter $P$, width plus length is $\frac{P}{2}$, not $P$. The same slip with a fixed area is forgetting to double the length when writing the perimeter.`,
    },
    {
      title: 'Mixing units',
      md: md`Convert before you build the formula: minutes to hours, metres to kilometres, cents to euros. A formula with mixed units is wrong even when its shape is right.`,
    },
  ],
  check: [
    {
      id: 'check-fixed-area-perimeter',
      title: 'Perimeter at a fixed area',
      topic: 'Algebra: expressing quantities',
      stemMd: md`A rectangle has area 36. Which expression gives its perimeter $P$ as a function of its width $w$ (with $w > 0$)?`,
      options: [
        { id: 'A', text: md`$w + \frac{36}{w}$`, note: md`This is width plus length, half the perimeter. The perimeter counts each side twice.` },
        { id: 'B', text: md`$2w + \frac{36}{w}$`, note: md`This doubles the width but not the length $\frac{36}{w}$.` },
        { id: 'C', text: md`$2w + \frac{72}{w}$`, note: '' },
        { id: 'D', text: md`$2w + 72$`, note: md`This takes the length as 36, the area, instead of $\frac{36}{w}$.` },
      ],
      answer: 'C',
      workingMd: md`The length is $\frac{36}{w}$, since width times length is 36. The perimeter is $2w + 2 \cdot \frac{36}{w} = 2w + \frac{72}{w}$. Check with $w = 4$: the length is 9 and the perimeter is $2(4 + 9) = 26$, while $8 + 18 = 26$.`,
      lesson: 'Use the constraint to write the second side in terms of the first, then build the target quantity.',
    },
    {
      id: 'check-profit-function',
      title: 'Profit as a function of quantity',
      topic: 'Algebra: expressing quantities',
      stemMd: md`A firm sells $x$ units at a price of $50 - 2x$ euros each. Its total cost of producing $x$ units is $10x + 30$ euros. Which expression gives the profit as a function of $x$?`,
      options: [
        { id: 'A', text: md`$-2x^2 + 40x - 30$`, note: '' },
        { id: 'B', text: md`$-2x^2 + 40x + 30$`, note: md`The fixed cost 30 has been added instead of subtracted: subtracting $10x + 30$ subtracts both terms.` },
        { id: 'C', text: md`$-2x^2 + 60x - 30$`, note: md`This adds the variable cost $10x$ to the revenue instead of subtracting it.` },
        { id: 'D', text: md`$20 - 12x$`, note: md`This subtracts the cost from the price of one unit, $(50 - 2x) - (10x + 30)$, without multiplying the price by the number of units sold.` },
      ],
      answer: 'A',
      workingMd: md`Revenue is units times price: $x(50 - 2x) = 50x - 2x^2$. Profit is revenue minus cost: $50x - 2x^2 - (10x + 30) = -2x^2 + 40x - 30$. Check with $x = 5$: the price is 40, revenue 200, cost 80, profit 120; the formula gives $-50 + 200 - 30 = 120$.`,
      lesson: 'Revenue is quantity times price; profit is revenue minus the whole cost.',
    },
    {
      id: 'check-rearrange-formula',
      title: 'Making x the subject',
      topic: 'Algebra: expressing quantities',
      stemMd: md`If $y = \frac{3x + 2}{x - 1}$ (with $x \ne 1$), which expression gives $x$ in terms of $y$?`,
      options: [
        { id: 'A', text: md`$\frac{y - 1}{3y + 2}$`, note: md`This turns the fraction upside down. Undoing a formula is not taking its reciprocal: with $y = 8$ it gives $\frac{7}{26}$, not $x = 2$.` },
        { id: 'B', text: md`$\frac{y - 2}{y - 3}$`, note: md`The 2 changed sign when it moved across: from $xy - y = 3x + 2$ the right side after collecting $x$ terms is $y + 2$.` },
        { id: 'C', text: md`$\frac{y + 2}{3 - y}$`, note: md`This collects the $x$ terms as $3x - xy$ on one side without changing the sign of the other side. With $y = 8$ it gives $-2$, not $2$.` },
        { id: 'D', text: md`$\frac{y + 2}{y - 3}$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Multiply by $x - 1$: $xy - y = 3x + 2$. Collect the $x$ terms: $xy - 3x = y + 2$. Factor: $x(y - 3) = y + 2$, so $x = \frac{y + 2}{y - 3}$ for $y \ne 3$. Check: $x = 2$ gives $y = \frac{8}{1} = 8$, and $\frac{8 + 2}{8 - 3} = 2$.`,
      lesson: 'When the variable appears twice, collect its terms on one side and factor it out; then check with one number.',
    },
  ],
  takeaways: [
    'A function of x has only x as a variable: use the constraint to eliminate every other unknown.',
    'State the domain the situation allows: positive lengths, non-negative square-root arguments, non-zero denominators.',
    'Revenue is quantity times price; profit is revenue minus all of the cost.',
    'To rearrange, collect the wanted variable on one side, factor it out, divide, and check with one value.',
  ],
  practice: { examKey: PRACTICE_EXAM, domain: PRACTICE_DOMAIN, skill: 'math-algebra-expressing-quantities' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const algebraUnit: Unit = {
  slug: 'algebra',
  title: 'Algebra',
  summary: 'The algebra the mathematics area of the test relies on, done by hand: powers, radicals and polynomials; first and second degree equations and inequalities; systems with two unknowns; absolute values; and writing one quantity as a function of others.',
  lessons: [
    algebraicExpressionsAndIdentities,
    firstAndSecondDegreeEquations,
    firstAndSecondDegreeInequalities,
    systemsWithTwoUnknowns,
    absoluteValues,
    expressingQuantitiesAsFunctions,
  ],
};
