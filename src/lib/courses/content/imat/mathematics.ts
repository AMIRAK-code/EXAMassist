import { md, type Lesson } from '../../types';

/**
 * IMAT mathematics (English). The Italian version of every lesson is in
 * ./it/mathematics.ts, with the same slugs, practice links and check keys.
 */

export const algebraEquationsAndInequalitiesLesson: Lesson = {
  slug: 'algebra-equations-and-inequalities',
  title: 'Algebra: equations and inequalities',
  summary: 'Solve linear systems, quadratics and inequalities by hand, read the discriminant, and avoid the sign slips that cost marks on the IMAT.',
  minutes: 22,
  objectives: [
    'Solve linear equations and two-unknown systems by substitution or elimination, and check the result.',
    'Solve quadratic equations by factorising or by the formula, and use the discriminant and the sum and product of the roots.',
    'Solve linear, quadratic, rational and absolute-value inequalities with a sign chart, without losing or inventing solutions.',
  ],
  teachMd: md`
### Why algebra decides the maths questions

The IMAT is taken on paper with no calculator, and every question has five options. Most mathematics and physics problems end with an equation or an inequality to solve, so clean algebra is the step everything else depends on. The aim here is not speed through tricks but a short, reliable routine you can check in seconds.

### Linear equations and systems

A linear equation is solved by doing the same thing to both sides until the unknown stands alone. The only rule to watch is that you may multiply or divide both sides by any number **except zero**.

A system of two equations in two unknowns is solved in one of two ways:

- **Substitution**: make one unknown the subject of one equation and put it into the other. Best when a coefficient is already 1.
- **Elimination**: multiply the equations so that one unknown has opposite coefficients, then add. Best when no coefficient is 1.

Always substitute the pair back into **both** original equations. A pair that fits only one of them means an arithmetic slip, and the slip is usually one of the distractors.

### Quadratic equations

Write the equation as $ax^2 + bx + c = 0$ first; factorising solves an equation only when the other side is zero, because only a zero product forces one of its factors to be zero. Then:

- Try to factorise. For $x^2 + bx + c$ you need two numbers with product $c$ and sum $b$.
- If that fails, use the formula $x = \frac{-b \pm \sqrt{\Delta}}{2a}$ with the **discriminant** $\Delta = b^2 - 4ac$.

The discriminant alone tells you how many real roots there are: two distinct roots if $\Delta > 0$, one repeated root if $\Delta = 0$, none if $\Delta < 0$. Questions that ask "for which values of $k$…" are usually discriminant questions.

When the roots $x_1$ and $x_2$ are real, comparing $a(x - x_1)(x - x_2)$ with $ax^2 + bx + c$ gives

$$x_1 + x_2 = -\frac{b}{a}, \qquad x_1 x_2 = \frac{c}{a}.$$

These answer questions about the roots without finding them, and they check roots you have found: the roots of $x^2 - 5x + 6 = 0$ are 2 and 3, which add to 5 and multiply to 6.

A related identity is worth knowing: $(x - y)^2 = (x + y)^2 - 4xy$. It gives the difference of two numbers from their sum and product.

### Linear inequalities

Inequalities are solved like equations with one extra rule: **multiplying or dividing both sides by a negative number reverses the sign**. From $-3x < 12$ you get $x > -4$, not $x < -4$. A quick test with one value (here $x = 0$: $0 < 12$, true, and $0 > -4$, true) catches the slip.

### Quadratic inequalities

Move everything to one side and find the roots of the quadratic. For $a > 0$ the parabola opens upwards, so:

- the quadratic is **negative between** the roots;
- it is **positive outside** the roots.

So $x^2 - 9 < 0$ gives $-3 < x < 3$, and $x^2 - 9 > 0$ gives $x < -3$ or $x > 3$. Writing "$x > \pm 3$" is meaningless; an "outside" solution is always two separate pieces. If $\Delta < 0$ and $a > 0$, the quadratic is positive for every $x$.

### Rational inequalities and the sign chart

For an inequality such as $\frac{x - 1}{x + 3} \ge 2$, never multiply both sides by $x + 3$: you do not know whether it is positive or negative, so you do not know whether to reverse the sign. Instead:

1. Move everything to one side: $\frac{x - 1}{x + 3} - 2 \ge 0$.
2. Combine into a single fraction and simplify the numerator.
3. Mark the zeros of the numerator and of the denominator on a number line.
4. Find the sign in each interval by testing one value.
5. Include zeros of the numerator when the inequality is $\ge$ or $\le$; **never** include zeros of the denominator.

### Absolute value

$|x - a|$ is the distance between $x$ and $a$. Hence, for $b > 0$:

$$|x - a| < b \iff a - b < x < a + b, \qquad |x - a| > b \iff x < a - b \text{ or } x > a + b.$$

"Less than" gives one interval around $a$; "greater than" gives two pieces outside it. When the expression inside is $2x - 3$ rather than $x - a$, write the double inequality first and then solve it.

### Checking against the options

With five options and a penalty for a wrong answer, a 10-second check is worth doing. Substitute one value from inside your solution and one from outside it; the inside value must satisfy the original inequality and the outside one must not. Distractors are usually the result of a single slip, such as the wrong direction or a lost endpoint, so this check separates them quickly.
`,
  examples: [
    {
      id: 'example-linear-system',
      title: 'A system by elimination, checked by substitution',
      problemMd: md`Solve the system $3x + 2y = 16$ and $x - y = 2$.`,
      steps: [
        md`No coefficient of $y$ matches, so multiply the second equation by 2 to make the $y$ coefficients opposite: $2x - 2y = 4$.`,
        md`Add it to the first equation: $3x + 2y + 2x - 2y = 16 + 4$, so $5x = 20$ and $x = 4$.`,
        md`Put $x = 4$ into $x - y = 2$: $y = 2$.`,
        md`Second route, substitution: $x = y + 2$, so $3(y + 2) + 2y = 16$, giving $5y = 10$ and $y = 2$, then $x = 4$. Check in both equations: $12 + 4 = 16$ and $4 - 2 = 2$.`,
      ],
      answerMd: md`$x = 4$, $y = 2$. Checking only one equation is not enough: a pair that fits one equation but not the other comes from a slip in the elimination step.`,
    },
    {
      id: 'example-quadratic-inequality',
      title: 'A quadratic inequality',
      problemMd: md`Solve $x^2 - x - 6 < 0$.`,
      steps: [
        md`Find the roots: two numbers with product $-6$ and sum $-1$ are $-3$ and $2$, so $x^2 - x - 6 = (x - 3)(x + 2)$, with roots $3$ and $-2$.`,
        md`The coefficient of $x^2$ is positive, so the parabola opens upwards and is negative **between** its roots.`,
        md`Test one value inside and one outside: $x = 0$ gives $-6 < 0$, true; $x = 4$ gives $16 - 4 - 6 = 6$, not negative.`,
      ],
      answerMd: md`$-2 < x < 3$. The tempting wrong answer is $x < -2$ or $x > 3$, which is where the quadratic is **positive**.`,
    },
    {
      id: 'example-rational-inequality',
      title: 'A rational inequality with a sign chart',
      problemMd: md`Solve $\frac{x - 1}{x + 3} \ge 2$.`,
      steps: [
        md`Do not multiply by $x + 3$, whose sign is unknown. Subtract 2 instead: $\frac{x - 1 - 2(x + 3)}{x + 3} \ge 0$, which is $\frac{-x - 7}{x + 3} \ge 0$.`,
        md`Multiply the numerator by $-1$ and reverse the sign: $\frac{x + 7}{x + 3} \le 0$.`,
        md`Critical values: the numerator is zero at $x = -7$, the denominator at $x = -3$. The fraction is negative only between them.`,
        md`Endpoints: $x = -7$ makes the fraction $0$, which satisfies $\le 0$, so it is included; $x = -3$ makes the denominator zero, so it is excluded.`,
        md`Check in the original: $x = -5$ gives $\frac{-6}{-2} = 3 \ge 2$, true; $x = -7$ gives $\frac{-8}{-4} = 2 \ge 2$, true; $x = 0$ gives $-\frac{1}{3}$, false.`,
      ],
      answerMd: md`$-7 \le x < -3$. Multiplying through by $x + 3$ gives $x - 1 \ge 2x + 6$, so $x \le -7$: the wrong answer, because it assumed $x + 3 > 0$, which is false for every $x \le -7$.`,
    },
  ],
  traps: [
    {
      title: 'Dividing by a negative without reversing the sign',
      md: md`From $-2x \ge 8$ the answer is $x \le -4$. Keeping $\ge$ gives $x \ge -4$, which is exactly the opposite set, and it will be among the options. After dividing by any negative number, reverse the sign, then test one value.`,
    },
    {
      title: 'Multiplying through by an expression of unknown sign',
      md: md`In $\frac{x - 1}{x + 3} \ge 2$, multiplying by $x + 3$ silently assumes $x + 3 > 0$. Move everything to one side, combine into one fraction and use a sign chart instead. The same applies to dividing both sides of $x^2 = 5x$ by $x$: it loses the root $x = 0$.`,
    },
    {
      title: 'Writing an outside solution as one interval',
      md: md`$x^2 > 9$ is $x < -3$ or $x > 3$, two separate pieces. "$x > \pm 3$" and "$-3 > x > 3$" describe nothing. Picture the upward parabola: positive outside its roots, negative between them.`,
    },
    {
      title: 'Counting a repeated root as two distinct roots',
      md: md`"Two distinct real roots" needs $\Delta > 0$, strictly. If $\Delta = 0$ the two roots coincide. An option that includes the boundary values ($\le$ or $\ge$) is built to catch this.`,
    },
  ],
  check: [
    {
      id: 'check-discriminant-k',
      title: 'Two distinct real roots',
      topic: 'Algebra and functions',
      stemMd: md`For which values of $k$ does the equation $x^2 + kx + 9 = 0$ have two distinct real roots?`,
      options: [
        { id: 'A', text: md`$-6 < k < 6$`, note: md`This is where $k^2 - 36 < 0$, the values with **no** real roots: the inside and outside of the inequality were swapped.` },
        { id: 'B', text: md`$k > 6$ only`, note: md`The negative branch is lost: $k^2 > 36$ also holds for $k < -6$, for example $k = -10$.` },
        { id: 'C', text: md`$k \le -6$ or $k \ge 6$`, note: md`At $k = \pm 6$ the discriminant is zero and the two roots coincide, so these values give one repeated root, not two distinct ones.` },
        { id: 'D', text: md`$k < -6$ or $k > 6$`, note: '' },
        { id: 'E', text: md`$k > 36$`, note: md`This compares $k$ itself with 36 instead of $k^2$: the square root of both sides was never taken.` },
      ],
      answer: 'D',
      workingMd: md`Two distinct real roots need $\Delta > 0$: $\Delta = k^2 - 4 \cdot 1 \cdot 9 = k^2 - 36 > 0$, so $k^2 > 36$, which holds outside the roots $\pm 6$: $k < -6$ or $k > 6$. Check: $k = 10$ gives $x^2 + 10x + 9 = (x + 1)(x + 9)$, two roots; $k = 6$ gives $(x + 3)^2$, one repeated root.`,
      lesson: 'For "two distinct real roots" solve the strict inequality on the discriminant, and remember that a square exceeding a number gives two pieces.',
    },
    {
      id: 'check-absolute-value',
      title: 'An absolute-value inequality',
      topic: 'Algebra and functions',
      stemMd: md`Which set of values satisfies $|2x - 3| < 5$?`,
      options: [
        { id: 'A', text: md`$-1 < x < 4$`, note: '' },
        { id: 'B', text: md`$x < 4$`, note: md`Only the upper bound was kept; $x = -5$ gives $|-13| = 13$, which is not less than 5.` },
        { id: 'C', text: md`$-4 < x < 1$`, note: md`This solves $|2x + 3| < 5$: the sign inside the absolute value was misread.` },
        { id: 'D', text: md`$x < -1$ or $x > 4$`, note: md`This is the solution of $|2x - 3| > 5$, where $2x - 3$ is **farther** than 5 from zero, not closer.` },
        { id: 'E', text: md`$\frac{3}{2} \le x < 4$`, note: md`Only the case $2x - 3 \ge 0$ was solved; the case where $2x - 3$ is negative was dropped.` },
      ],
      answer: 'A',
      workingMd: md`$|2x - 3| < 5$ means $-5 < 2x - 3 < 5$. Add 3: $-2 < 2x < 8$. Divide by 2: $-1 < x < 4$. Check: $x = 0$ gives $|-3| = 3 < 5$, true; $x = 4$ gives $|5| = 5$, not less than 5, so 4 is correctly excluded.`,
      lesson: 'Turn "absolute value less than b" into one double inequality and solve all three parts at once.',
    },
    {
      id: 'check-sum-and-product',
      title: 'Difference from sum and product',
      topic: 'Algebra and functions',
      stemMd: md`Two numbers have sum 20 and product 91. What is the positive difference between them?`,
      options: [
        { id: 'A', text: md`$3$`, note: md`3 is how far each number lies from their mean, 10; the two numbers are $10 + 3$ and $10 - 3$, so their difference is twice that.` },
        { id: 'B', text: md`$6$`, note: '' },
        { id: 'C', text: md`$13$`, note: md`13 is the larger of the two numbers, not the difference between them.` },
        { id: 'D', text: md`$\sqrt{218}$`, note: md`This uses $(x - y)^2 = (x + y)^2 - 2xy$; the correct identity subtracts $4xy$.` },
        { id: 'E', text: md`$36$`, note: md`36 is $(x - y)^2$; the square root was not taken at the end.` },
      ],
      answer: 'B',
      workingMd: md`Route 1: $(x - y)^2 = (x + y)^2 - 4xy = 400 - 364 = 36$, so the difference is 6. Route 2: the numbers are the roots of $t^2 - 20t + 91 = 0$, which factorises as $(t - 7)(t - 13)$, giving 7 and 13, whose difference is 6.`,
      lesson: 'Sum and product describe a pair of numbers completely; use the quadratic they define or the identity for the square of the difference.',
    },
  ],
  takeaways: [
    'Substitute every solution back into the original equations or inequality before choosing an option.',
    md`The discriminant $b^2 - 4ac$ counts the real roots: two if positive, one if zero, none if negative.`,
    'Multiplying or dividing an inequality by a negative number reverses its sign; never multiply by an expression of unknown sign.',
    'An upward parabola is negative between its roots and positive outside them; an outside solution is two separate pieces.',
    md`$|x - a| < b$ is one interval around $a$; $|x - a| > b$ is two pieces outside it.`,
  ],
  flashcards: [
    { front: 'Discriminant and number of real roots', back: md`For $ax^2 + bx + c = 0$, $\Delta = b^2 - 4ac$. Two distinct real roots if $\Delta > 0$, one repeated root if $\Delta = 0$, none if $\Delta < 0$.` },
    { front: 'Sum and product of the roots of a quadratic', back: md`$x_1 + x_2 = -\frac{b}{a}$ and $x_1 x_2 = \frac{c}{a}$.` },
    { front: 'Dividing an inequality by a negative number', back: 'Reverse the inequality sign. Then test one value to confirm the direction.' },
    { front: md`Solution of $x^2 - 9 < 0$ and of $x^2 - 9 > 0$`, back: md`$-3 < x < 3$ (between the roots) and $x < -3$ or $x > 3$ (outside the roots).` },
    { front: 'Method for a rational inequality', back: 'Move everything to one side, combine into one fraction, mark the zeros of numerator and denominator, and read the sign in each interval. Never include a zero of the denominator.' },
    { front: md`$|x - a| < b$ with $b > 0$`, back: md`$a - b < x < a + b$: the values whose distance from $a$ is less than $b$.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-math-algebra-functions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const exponentialsLogarithmsAndFunctionsLesson: Lesson = {
  slug: 'exponentials-logarithms-and-functions',
  title: 'Exponentials, logarithms and functions',
  summary: 'Use the laws of powers and logarithms, solve exponential and log equations by hand, and handle domains, composition, inverses and graph shifts.',
  minutes: 24,
  objectives: [
    'Apply the laws of powers and logarithms to simplify expressions and estimate logarithms from given values.',
    'Solve exponential equations by a common base or a substitution, and logarithmic equations with a domain check.',
    'Find the domain of a function, compose functions, find an inverse and describe graph transformations.',
  ],
  teachMd: md`
### Powers first

Logarithms are only as easy as the powers behind them, so the laws of powers come first. For a positive base $a$:

$$a^m \cdot a^n = a^{m+n}, \qquad \frac{a^m}{a^n} = a^{m-n}, \qquad (a^m)^n = a^{mn}, \qquad a^{-n} = \frac{1}{a^n}, \qquad a^{\frac{1}{n}} = \sqrt[n]{a}.$$

Two traps sit here. $a^m + a^n$ has no simplification of its own; only products and quotients combine. And $(a + b)^2$ is not $a^2 + b^2$.

### Exponential equations

Without a calculator, an exponential equation is usually solved in one of two ways.

**Common base.** Write both sides as powers of the same base, then equate the exponents, because $a^p = a^q$ forces $p = q$ when $a > 0$ and $a \ne 1$. Know the small powers by heart: $2^{10} = 1024$, $3^5 = 243$, $4 = 2^2$, $8 = 2^3$, $9 = 3^2$, $27 = 3^3$, $25 = 5^2$, $125 = 5^3$.

**Substitution.** An equation such as $9^x - 4 \cdot 3^x + 3 = 0$ is a quadratic in disguise: $9^x = (3^x)^2$, so put $t = 3^x$. Solve for $t$, then return to $x$. Because $3^x > 0$ for every $x$, a negative value of $t$ gives no solution and must be thrown away.

### Logarithms

$\log_a b = c$ means exactly $a^c = b$: the logarithm is the exponent. It is defined only for a base $a > 0$ with $a \ne 1$ and an argument $b > 0$. Some values follow at once: $\log_a 1 = 0$, $\log_a a = 1$, $\log_2 32 = 5$, $\log_{10} 0.01 = -2$.

The laws of logarithms are the laws of powers read backwards:

$$\log_a (xy) = \log_a x + \log_a y, \qquad \log_a \frac{x}{y} = \log_a x - \log_a y, \qquad \log_a x^n = n \log_a x.$$

The change of base formula is $\log_a b = \frac{\log_c b}{\log_c a}$ for any valid base $c$. Note what is **not** a law: $\log(x + y)$ does not split, and $\log x \cdot \log y$ is not $\log(xy)$.

A typical calculator-free question gives you $\log_{10} 2$ and $\log_{10} 3$ and asks for the logarithm of another number. Factorise that number into 2s, 3s and 10s and add: $\log_{10} 12 = \log_{10}(2^2 \cdot 3) = 2\log_{10} 2 + \log_{10} 3$. A related fact: $\log_{10} 5 = \log_{10} 10 - \log_{10} 2 = 1 - \log_{10} 2$.

### Logarithmic equations need a domain check

Combine the logs into a single logarithm, rewrite it as a power, and solve. Then **check every candidate in the original equation**, because combining $\log x + \log(x - 2)$ into $\log(x(x - 2))$ widens the domain: the product can be positive when both factors are negative. A candidate that makes any original argument zero or negative is rejected.

### Functions: domain

The domain is the set of inputs for which the formula makes sense. Three restrictions cover nearly every question:

- a denominator cannot be zero;
- an even root needs a non-negative radicand (zero is allowed);
- a logarithm needs a strictly positive argument.

When a logarithm sits in a denominator, both apply: its argument must be positive **and** the log must not equal zero, which happens when the argument equals 1.

### Composition and inverses

$f(g(x))$ means: apply $g$ first, then $f$. Work from the inside out. In general $f(g(x)) \ne g(f(x))$, so read the order carefully.

The inverse $f^{-1}$ undoes $f$: if $f(a) = b$ then $f^{-1}(b) = a$. To find it, write $y = f(x)$, solve for $x$ in terms of $y$, then rename. Only a one-to-one function has an inverse. The graph of $f^{-1}$ is the reflection of the graph of $f$ in the line $y = x$, which is why $y = \log_a x$ and $y = a^x$ mirror each other.

### Graphs and transformations

For $a > 1$, $y = a^x$ is increasing, always positive, passes through $(0, 1)$ and approaches the $x$-axis on the left. For $0 < a < 1$ it is decreasing. $y = \log_a x$ ($a > 1$) passes through $(1, 0)$, is defined only for $x > 0$ and has the $y$-axis as an asymptote.

Starting from $y = f(x)$:

- $y = f(x - h)$ shifts the graph $h$ units to the **right** (the sign inside looks opposite);
- $y = f(x) + k$ shifts it $k$ units **up**;
- $y = -f(x)$ reflects it in the $x$-axis, and $y = f(-x)$ in the $y$-axis.

So $y = 2^{x - 3} + 1$ is $y = 2^x$ moved 3 right and 1 up: its point $(0, 1)$ moves to $(3, 2)$, and indeed $2^0 + 1 = 2$.
`,
  examples: [
    {
      id: 'example-common-base',
      title: 'An exponential equation with a common base',
      problemMd: md`Solve $4^{x + 1} = 8^{x - 1}$.`,
      steps: [
        md`Both 4 and 8 are powers of 2: $4^{x + 1} = (2^2)^{x + 1} = 2^{2x + 2}$ and $8^{x - 1} = (2^3)^{x - 1} = 2^{3x - 3}$.`,
        md`Equal powers of the same base have equal exponents: $2x + 2 = 3x - 3$, so $x = 5$.`,
        md`Check: $4^6 = (2^2)^6 = 2^{12}$ and $8^4 = (2^3)^4 = 2^{12}$, both equal to 4096.`,
      ],
      answerMd: md`$x = 5$. Equating the exponents before changing the base ($x + 1 = x - 1$) has no solution and is the usual false start.`,
    },
    {
      id: 'example-log-equation',
      title: 'A logarithmic equation and its domain',
      problemMd: md`Solve $\log_2 x + \log_2 (x - 2) = 3$.`,
      steps: [
        md`The domain of the original equation needs $x > 0$ and $x - 2 > 0$, so $x > 2$.`,
        md`Combine with the product law: $\log_2 \left(x(x - 2)\right) = 3$, so $x(x - 2) = 2^3 = 8$.`,
        md`Solve $x^2 - 2x - 8 = 0$: $(x - 4)(x + 2) = 0$, so $x = 4$ or $x = -2$.`,
        md`Reject $x = -2$: it makes $\log_2 x$ undefined. Check $x = 4$: $\log_2 4 + \log_2 2 = 2 + 1 = 3$.`,
      ],
      answerMd: md`$x = 4$ only. Listing both roots of the quadratic is the tempting wrong answer: $-2$ satisfies the combined equation but not the original one.`,
    },
    {
      id: 'example-composition-inverse',
      title: 'Composition and inverse',
      problemMd: md`Let $f(x) = 2x - 3$ and $g(x) = x^2 + 1$. Find $f(g(2))$, $g(f(2))$ and $f^{-1}(7)$.`,
      steps: [
        md`Inside out for $f(g(2))$: $g(2) = 4 + 1 = 5$, then $f(5) = 10 - 3 = 7$.`,
        md`For $g(f(2))$: $f(2) = 4 - 3 = 1$, then $g(1) = 1 + 1 = 2$. The order matters.`,
        md`For $f^{-1}(7)$: solve $2x - 3 = 7$, so $x = 5$. Or find the inverse in general: $y = 2x - 3$ gives $x = \frac{y + 3}{2}$, so $f^{-1}(7) = \frac{10}{2} = 5$.`,
        md`Cross-check: $f(5) = 7$ from the first step, so $f^{-1}(7) = 5$ agrees.`,
      ],
      answerMd: md`$f(g(2)) = 7$, $g(f(2)) = 2$ and $f^{-1}(7) = 5$. Computing $\frac{1}{f(7)} = \frac{1}{11}$ confuses the inverse function with the reciprocal.`,
    },
  ],
  traps: [
    {
      title: 'Inventing laws of logarithms',
      md: md`$\log(x + y)$ does not equal $\log x + \log y$, and $\log x \cdot \log y$ is not $\log(xy)$. Only the logarithm of a product, a quotient or a power simplifies. When an option looks too neat, check it with numbers: $\log_{10}(10 + 10) \approx 1.3$, not $2$.`,
    },
    {
      title: 'Keeping every root of a log equation',
      md: md`Combining logarithms can create candidates outside the original domain. Substitute each candidate into the **original** arguments; any that is zero or negative is rejected.`,
    },
    {
      title: 'Shifting the graph the wrong way',
      md: md`$f(x - 3)$ moves the graph 3 units to the right, not the left, because the input must be 3 larger to give the same output. Check with one point: the point where the inside equals zero has moved to $x = 3$.`,
    },
    {
      title: 'Confusing the inverse with the reciprocal',
      md: md`$f^{-1}(x)$ is the function that undoes $f$; $\frac{1}{f(x)}$ is the reciprocal. They are different almost always. Test: $f(f^{-1}(x))$ must give back $x$.`,
    },
  ],
  check: [
    {
      id: 'check-log-72',
      title: 'A logarithm from given values',
      topic: 'Algebra and functions',
      stemMd: md`Given $\log_{10} 2 \approx 0.30$ and $\log_{10} 3 \approx 0.48$, which is the best approximation of $\log_{10} 72$?`,
      options: [
        { id: 'A', text: md`$0.78$`, note: md`This is $\log_{10} 2 + \log_{10} 3 = \log_{10} 6$: the exponents in $72 = 2^3 \cdot 3^2$ were ignored.` },
        { id: 'B', text: md`$0.86$`, note: md`This multiplies $3 \times 0.30$ by $2 \times 0.48$; the logarithm of a product is a sum of logarithms, not a product.` },
        { id: 'C', text: md`$1.56$`, note: md`This is $2\log_{10} 6 = \log_{10} 36$: the remaining factor 2 in $72 = 36 \cdot 2$ was left out.` },
        { id: 'D', text: md`$1.86$`, note: '' },
        { id: 'E', text: md`$2.04$`, note: md`This uses $2^2 \cdot 3^3$, which is 108, not 72: the two exponents were swapped.` },
      ],
      answer: 'D',
      workingMd: md`$72 = 8 \cdot 9 = 2^3 \cdot 3^2$, so $\log_{10} 72 = 3\log_{10} 2 + 2\log_{10} 3 \approx 0.90 + 0.96 = 1.86$. Second route: $72 = 2 \cdot 6^2$, so $\log_{10} 72 = \log_{10} 2 + 2\log_{10} 6 \approx 0.30 + 2(0.78) = 1.86$. Sense check: $72$ lies between $10$ and $100$, so its logarithm lies between 1 and 2.`,
      lesson: 'Factorise the number into the primes whose logarithms you are given, then add the logarithms with their exponents as multipliers.',
    },
    {
      id: 'check-domain',
      title: 'Domain with a root and a logarithm',
      topic: 'Algebra and functions',
      stemMd: md`What is the domain of $f(x) = \frac{\sqrt{4 - x}}{\ln(x - 1)}$?`,
      options: [
        { id: 'A', text: md`$1 < x \le 4$`, note: md`This forgets that the denominator $\ln(x - 1)$ is zero at $x = 2$, where the fraction is undefined.` },
        { id: 'B', text: md`$x > 1$, $x \ne 2$`, note: md`This ignores the square root, which needs $4 - x \ge 0$, so values above 4 are not allowed.` },
        { id: 'C', text: md`$1 \le x \le 4$, $x \ne 2$`, note: md`At $x = 1$ the argument of the logarithm is zero, and $\ln 0$ is undefined.` },
        { id: 'D', text: md`$1 < x < 4$, $x \ne 2$`, note: md`This excludes $x = 4$, but $\sqrt{0} = 0$ is defined and $\ln 3 \ne 0$, so $f(4) = 0$ exists.` },
        { id: 'E', text: md`$1 < x \le 4$, $x \ne 2$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Three conditions. The root: $4 - x \ge 0$, so $x \le 4$. The logarithm: $x - 1 > 0$, so $x > 1$. The denominator: $\ln(x - 1) \ne 0$, so $x - 1 \ne 1$, $x \ne 2$. Together: $1 < x \le 4$ with $x \ne 2$.`,
      lesson: 'List every restriction separately (denominator, even root, logarithm) and only then intersect them.',
    },
    {
      id: 'check-exponential-substitution',
      title: 'An exponential equation in disguise',
      topic: 'Algebra and functions',
      stemMd: md`What is the sum of all real solutions of $9^x - 4 \cdot 3^x + 3 = 0$?`,
      options: [
        { id: 'A', text: md`$0$`, note: md`0 is one of the two solutions (or their product), not their sum; the solution $x = 1$ was left out.` },
        { id: 'B', text: md`$1$`, note: '' },
        { id: 'C', text: md`$3$`, note: md`3 is a value of $t = 3^x$, not of $x$; the substitution was not undone.` },
        { id: 'D', text: md`$4$`, note: md`4 is the sum of the values of $t = 3^x$ (1 and 3), not of the values of $x$.` },
        { id: 'E', text: md`There are no real solutions`, note: md`Both values of $t$ are positive, so both give real $x$; only a negative $t$ would have to be rejected.` },
      ],
      answer: 'B',
      workingMd: md`Put $t = 3^x > 0$, so $9^x = t^2$ and the equation becomes $t^2 - 4t + 3 = 0$, that is $(t - 1)(t - 3) = 0$. Then $3^x = 1$ gives $x = 0$ and $3^x = 3$ gives $x = 1$. The sum is 1. Check: $x = 1$ gives $9 - 12 + 3 = 0$; $x = 0$ gives $1 - 4 + 3 = 0$.`,
      lesson: 'When one power is the square of another, substitute, solve the quadratic, and translate each positive root back to the original unknown.',
    },
  ],
  takeaways: [
    md`$\log_a b = c$ means $a^c = b$; the argument must be positive.`,
    'Logarithms turn products into sums, quotients into differences and powers into multipliers; sums do not split.',
    'Solve exponential equations by a common base or by substituting for the repeated power.',
    'Check every candidate of a logarithmic equation in the original equation.',
    md`$f(x - h) + k$ moves the graph $h$ to the right and $k$ up.`,
  ],
  flashcards: [
    { front: 'Definition of a logarithm', back: md`$\log_a b = c$ means $a^c = b$, with $a > 0$, $a \ne 1$ and $b > 0$.` },
    { front: 'The three laws of logarithms', back: md`$\log_a(xy) = \log_a x + \log_a y$, $\log_a \frac{x}{y} = \log_a x - \log_a y$, $\log_a x^n = n\log_a x$.` },
    { front: 'Change of base', back: md`$\log_a b = \frac{\log_c b}{\log_c a}$ for any valid base $c$.` },
    { front: md`Solving an equation like $9^x - 4 \cdot 3^x + 3 = 0$`, back: md`Substitute $t = 3^x$ (so $9^x = t^2$), solve the quadratic in $t$, reject negative $t$, then solve $3^x = t$.` },
    { front: 'Three restrictions on a domain', back: 'A denominator cannot be zero, an even root needs a non-negative radicand, and a logarithm needs a positive argument.' },
    { front: md`Effect of $f(x - h) + k$ on a graph`, back: md`The graph of $f$ moves $h$ units to the right and $k$ units up.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-math-algebra-functions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const geometryAndTrigonometryLesson: Lesson = {
  slug: 'geometry-and-trigonometry',
  title: 'Geometry and trigonometry',
  summary: 'Plane figures, circles, lines and circles in coordinates, and trigonometry with exact values, the sine and cosine rules and the unit circle.',
  minutes: 25,
  objectives: [
    'Use triangle, polygon and circle facts, including Pythagoras, similarity, arcs and sectors.',
    'Find distances, midpoints, gradients, equations of lines and the centre and radius of a circle in coordinates.',
    'Use exact trigonometric values, the unit circle, the identity sin² + cos² = 1 and the sine and cosine rules.',
  ],
  teachMd: md`
### Plane geometry you need ready

- The angles of a triangle add to $180^\circ$; those of an $n$-sided polygon add to $(n - 2) \cdot 180^\circ$.
- **Pythagoras**: in a right-angled triangle, $a^2 + b^2 = c^2$ with $c$ the hypotenuse. Learn the common triples, $3, 4, 5$, $5, 12, 13$, $8, 15, 17$ and their multiples, so many questions need no square roots at all.
- **Similar triangles** have equal angles and proportional sides. If lengths scale by $k$, areas scale by $k^2$ and volumes by $k^3$.
- Areas: triangle $\frac{1}{2}bh$, parallelogram $bh$, trapezium $\frac{1}{2}(a + b)h$.

### Circles

For a circle of radius $r$: circumference $2\pi r$, area $\pi r^2$. An arc with central angle $\theta$ is the fraction $\frac{\theta}{360^\circ}$ of the whole circle, so

$$\text{arc} = \frac{\theta}{360^\circ} \cdot 2\pi r, \qquad \text{sector} = \frac{\theta}{360^\circ} \cdot \pi r^2.$$

In radians, $\pi$ rad $= 180^\circ$, and the formulas become arc $= r\theta$ and sector $= \frac{1}{2}r^2\theta$. Two angle facts: an angle at the circumference is half the central angle on the same arc, and an angle in a semicircle is a right angle.

### Points and lines in coordinates

For points $A(x_1, y_1)$ and $B(x_2, y_2)$:

$$AB = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}, \qquad M = \left(\frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\right), \qquad m = \frac{y_2 - y_1}{x_2 - x_1}.$$

A line with gradient $m$ through $(x_1, y_1)$ is $y - y_1 = m(x - x_1)$. From the general form $ax + by + c = 0$ the gradient is $-\frac{a}{b}$. Parallel lines have equal gradients; perpendicular lines have gradients whose product is $-1$, so the perpendicular gradient is the **negative reciprocal**: $\frac{2}{3}$ becomes $-\frac{3}{2}$.

### Circles in coordinates

The circle with centre $(p, q)$ and radius $r$ is $(x - p)^2 + (y - q)^2 = r^2$. When an equation is given expanded, such as $x^2 + y^2 - 6x + 8y = 0$, complete the square in $x$ and in $y$ to read off the centre and radius. A quick shortcut: in $x^2 + y^2 + Dx + Ey + F = 0$ the centre is $\left(-\frac{D}{2}, -\frac{E}{2}\right)$. If the computed $r^2$ is negative, there is no circle at all.

### Trigonometric ratios and exact values

In a right-angled triangle, $\sin\theta = \frac{\text{opposite}}{\text{hypotenuse}}$, $\cos\theta = \frac{\text{adjacent}}{\text{hypotenuse}}$ and $\tan\theta = \frac{\sin\theta}{\cos\theta} = \frac{\text{opposite}}{\text{adjacent}}$. With no calculator, you work with angles whose values you can derive from two triangles: half an equilateral triangle (sides $1, \sqrt{3}, 2$) and an isosceles right-angled triangle (sides $1, 1, \sqrt{2}$).

| Angle | $\sin$ | $\cos$ | $\tan$ |
| --- | --- | --- | --- |
| $30^\circ = \frac{\pi}{6}$ | $\frac{1}{2}$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{3}}{3}$ |
| $45^\circ = \frac{\pi}{4}$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{2}}{2}$ | $1$ |
| $60^\circ = \frac{\pi}{3}$ | $\frac{\sqrt{3}}{2}$ | $\frac{1}{2}$ | $\sqrt{3}$ |

### The unit circle and signs

For any angle, $\cos\theta$ and $\sin\theta$ are the $x$ and $y$ coordinates of the point at angle $\theta$ on the circle of radius 1. That gives the identity $\sin^2\theta + \cos^2\theta = 1$ and the signs by quadrant: in the second quadrant ($90^\circ$ to $180^\circ$) sine is positive and cosine negative, so tangent is negative; in the third both are negative; in the fourth only cosine is positive. Use the identity to find one ratio from another, then fix the sign from the quadrant.

Related angles: $\sin(180^\circ - \theta) = \sin\theta$ and $\cos(180^\circ - \theta) = -\cos\theta$. So an equation like $\sin x = \frac{1}{2}$ has two solutions between $0^\circ$ and $360^\circ$: $30^\circ$ and $150^\circ$.

### Triangles that are not right-angled

With sides $a, b, c$ opposite angles $A, B, C$:

$$\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C}, \qquad c^2 = a^2 + b^2 - 2ab\cos C, \qquad \text{area} = \frac{1}{2}ab\sin C.$$

Use the cosine rule when you know two sides and the angle between them, or all three sides; use the sine rule when you know a side and its opposite angle. When $C = 90^\circ$ the cosine rule becomes Pythagoras, which is a useful memory check.
`,
  examples: [
    {
      id: 'example-circle-centre-radius',
      title: 'Centre and radius by completing the square',
      problemMd: md`Find the centre and radius of the circle $x^2 + y^2 - 6x + 8y = 0$.`,
      steps: [
        md`Group the $x$ terms and the $y$ terms: $(x^2 - 6x) + (y^2 + 8y) = 0$.`,
        md`Complete each square: $x^2 - 6x = (x - 3)^2 - 9$ and $y^2 + 8y = (y + 4)^2 - 16$.`,
        md`So $(x - 3)^2 + (y + 4)^2 = 25$: centre $(3, -4)$ and radius $5$.`,
        md`Check with the shortcut: the centre is $\left(-\frac{-6}{2}, -\frac{8}{2}\right) = (3, -4)$. And since the constant term is 0, the origin lies on the circle: its distance from $(3, -4)$ is $\sqrt{9 + 16} = 5$, the radius.`,
      ],
      answerMd: md`Centre $(3, -4)$, radius $5$. Reading the centre as $(-3, 4)$, with the signs of the coefficients, is the common slip.`,
    },
    {
      id: 'example-perpendicular-bisector',
      title: 'The perpendicular bisector of a segment',
      problemMd: md`Find the equation of the perpendicular bisector of the segment from $A(1, 2)$ to $B(5, 10)$.`,
      steps: [
        md`Midpoint: $M = \left(\frac{1 + 5}{2}, \frac{2 + 10}{2}\right) = (3, 6)$.`,
        md`Gradient of $AB$: $\frac{10 - 2}{5 - 1} = 2$, so the perpendicular gradient is $-\frac{1}{2}$.`,
        md`Line through $M$: $y - 6 = -\frac{1}{2}(x - 3)$. Multiply by 2: $2y - 12 = -x + 3$, so $x + 2y = 15$.`,
        md`Check with a point on the line, say $(15, 0)$: its squared distance to $A$ is $14^2 + 2^2 = 200$ and to $B$ is $10^2 + 10^2 = 200$. Equal, as every point of the bisector must be.`,
      ],
      answerMd: md`$x + 2y = 15$. Using the gradient $\frac{1}{2}$ (reciprocal without the sign change) gives a line that is not perpendicular to $AB$.`,
    },
    {
      id: 'example-cosine-rule-area',
      title: 'Cosine rule and area',
      problemMd: md`A triangle has sides 5 and 8 with an angle of $60^\circ$ between them. Find the third side and the area.`,
      steps: [
        md`Two sides and the included angle: use the cosine rule. $c^2 = 25 + 64 - 2 \cdot 5 \cdot 8 \cdot \cos 60^\circ = 89 - 80 \cdot \frac{1}{2} = 49$, so $c = 7$.`,
        md`Area: $\frac{1}{2} \cdot 5 \cdot 8 \cdot \sin 60^\circ = 20 \cdot \frac{\sqrt{3}}{2} = 10\sqrt{3}$.`,
        md`Second route for the area, from the three sides 5, 8, 7 (Heron's formula): half the perimeter is $s = 10$, and $\sqrt{s(s - 5)(s - 8)(s - 7)} = \sqrt{10 \cdot 5 \cdot 2 \cdot 3} = \sqrt{300} = 10\sqrt{3}$.`,
      ],
      answerMd: md`The third side is 7 and the area is $10\sqrt{3}$. Forgetting the term $-2ab\cos C$ gives $\sqrt{89}$, which treats the triangle as right-angled.`,
    },
  ],
  traps: [
    {
      title: 'Ignoring the quadrant',
      md: md`$\sin^2\theta + \cos^2\theta = 1$ gives the size of the other ratio, never its sign. If $\theta$ is obtuse, cosine and tangent are negative. Decide the quadrant before choosing between $\frac{4}{5}$ and $-\frac{4}{5}$.`,
    },
    {
      title: 'Perpendicular gradient: only half the rule',
      md: md`The perpendicular gradient is the negative reciprocal. Changing only the sign ($\frac{2}{3} \to -\frac{2}{3}$) or only taking the reciprocal ($\frac{2}{3} \to \frac{3}{2}$) gives a line that still passes through the right point, which is why such options look convincing. Check that the product of the two gradients is $-1$.`,
    },
    {
      title: 'Reading the centre with the wrong signs',
      md: md`In $(x - 3)^2 + (y + 4)^2 = 25$ the centre is $(3, -4)$, and the radius is 5, not 25. Read the centre as the values that make each bracket zero.`,
    },
    {
      title: 'Mixing degrees and radians',
      md: md`Arc $= r\theta$ and sector $= \frac{1}{2}r^2\theta$ hold only for $\theta$ in radians. With degrees, use the fraction $\frac{\theta}{360^\circ}$ of the full circle.`,
    },
  ],
  check: [
    {
      id: 'check-obtuse-tangent',
      title: 'Tangent of an obtuse angle',
      topic: 'Geometry and trigonometry',
      stemMd: md`An angle $\theta$ satisfies $90^\circ < \theta < 180^\circ$ and $\sin\theta = \frac{3}{5}$. What is $\tan\theta$?`,
      options: [
        { id: 'A', text: md`$-\frac{4}{3}$`, note: md`This is $\frac{\cos\theta}{\sin\theta}$, the reciprocal of the tangent; tangent is sine over cosine.` },
        { id: 'B', text: md`$-\frac{4}{5}$`, note: md`This is $\cos\theta$, found correctly, but the question asks for the tangent.` },
        { id: 'C', text: md`$-\frac{3}{4}$`, note: '' },
        { id: 'D', text: md`$\frac{3}{4}$`, note: md`The size is right, but in the second quadrant cosine is negative, so the tangent is negative.` },
        { id: 'E', text: md`$\frac{4}{5}$`, note: md`This is the size of the cosine with the quadrant ignored, and it is not the tangent either.` },
      ],
      answer: 'C',
      workingMd: md`$\cos^2\theta = 1 - \frac{9}{25} = \frac{16}{25}$, so $\cos\theta = \pm\frac{4}{5}$; in the second quadrant it is $-\frac{4}{5}$. Then $\tan\theta = \frac{3/5}{-4/5} = -\frac{3}{4}$. Second route: a 3-4-5 triangle gives $\tan = \frac{3}{4}$ for the acute angle $180^\circ - \theta$, and tangent is negative in the second quadrant.`,
      lesson: 'Get the size of a trigonometric ratio from the identity or a triangle, then fix the sign from the quadrant.',
    },
    {
      id: 'check-perpendicular-line',
      title: 'A perpendicular line through a point',
      topic: 'Geometry and trigonometry',
      stemMd: md`Which line passes through $(2, 1)$ and is perpendicular to $2x - 3y + 6 = 0$?`,
      options: [
        { id: 'A', text: md`$2x - 3y - 1 = 0$`, note: md`This line passes through $(2, 1)$ but has the same gradient $\frac{2}{3}$, so it is parallel, not perpendicular.` },
        { id: 'B', text: md`$3x - 2y - 4 = 0$`, note: md`Its gradient $\frac{3}{2}$ is the reciprocal without the sign change; the product of the gradients is 1, not $-1$.` },
        { id: 'C', text: md`$2x + 3y - 7 = 0$`, note: md`Its gradient $-\frac{2}{3}$ changes the sign but is not the reciprocal; the product of the gradients is $-\frac{4}{9}$.` },
        { id: 'D', text: md`$3x + 2y - 8 = 0$`, note: '' },
        { id: 'E', text: md`$3x + 2y + 8 = 0$`, note: md`The gradient is right, but $(2, 1)$ gives $6 + 2 + 8 = 16 \ne 0$: a sign slip in the constant term.` },
      ],
      answer: 'D',
      workingMd: md`The given line has gradient $-\frac{2}{-3} = \frac{2}{3}$, so the perpendicular gradient is $-\frac{3}{2}$. Through $(2, 1)$: $y - 1 = -\frac{3}{2}(x - 2)$; multiply by 2: $2y - 2 = -3x + 6$, so $3x + 2y - 8 = 0$. Check: $6 + 2 - 8 = 0$, and the gradients multiply to $\frac{2}{3} \cdot \left(-\frac{3}{2}\right) = -1$.`,
      lesson: 'When several lines pass through the given point, the gradient decides: perpendicular means a product of $-1$.',
    },
    {
      id: 'check-sector-area',
      title: 'Area of a sector',
      topic: 'Geometry and trigonometry',
      stemMd: md`A circle has radius 6 cm. What is the area of a sector whose central angle is $120^\circ$?`,
      options: [
        { id: 'A', text: md`$4\pi \text{ cm}^2$`, note: md`$4\pi$ cm is the length of the arc, $\frac{1}{3} \cdot 2\pi \cdot 6$, not the area of the sector.` },
        { id: 'B', text: md`$12\pi \text{ cm}^2$`, note: '' },
        { id: 'C', text: md`$24\pi \text{ cm}^2$`, note: md`This takes $\frac{120}{180}$ of the circle instead of $\frac{120}{360}$, confusing a full turn with $\pi$ radians.` },
        { id: 'D', text: md`$36\pi \text{ cm}^2$`, note: md`This is the area of the whole circle; the fraction $\frac{120}{360}$ was not applied.` },
        { id: 'E', text: md`$48\pi \text{ cm}^2$`, note: md`This uses the diameter 12 as the radius: $\frac{1}{3} \cdot \pi \cdot 144$.` },
      ],
      answer: 'B',
      workingMd: md`$120^\circ$ is $\frac{1}{3}$ of a full turn, so the sector is $\frac{1}{3} \cdot \pi \cdot 6^2 = 12\pi$ cm². In radians: $120^\circ = \frac{2\pi}{3}$, and $\frac{1}{2} r^2 \theta = \frac{1}{2} \cdot 36 \cdot \frac{2\pi}{3} = 12\pi$ cm².`,
      lesson: 'A sector is the fraction of the circle given by its angle out of 360 degrees; check whether the question wants the arc or the area.',
    },
  ],
  takeaways: [
    'Learn the Pythagorean triples and the exact values for 30, 45 and 60 degrees; they replace a calculator.',
    'Perpendicular gradients multiply to −1: take the negative reciprocal.',
    'Complete the square to read a circle’s centre and radius; the centre has the opposite signs to the brackets.',
    'The identity sin² + cos² = 1 gives the size of a ratio; the quadrant gives its sign.',
    'Use the cosine rule for two sides and the included angle, the sine rule for a side with its opposite angle.',
  ],
  flashcards: [
    { front: 'Arc length and sector area for an angle in degrees', back: md`Arc $= \frac{\theta}{360^\circ} \cdot 2\pi r$ and sector $= \frac{\theta}{360^\circ} \cdot \pi r^2$. In radians: $r\theta$ and $\frac{1}{2}r^2\theta$.` },
    { front: 'Gradient of a line perpendicular to one with gradient m', back: md`$-\frac{1}{m}$, the negative reciprocal: the two gradients multiply to $-1$.` },
    { front: md`Centre of $x^2 + y^2 + Dx + Ey + F = 0$`, back: md`$\left(-\frac{D}{2}, -\frac{E}{2}\right)$; complete the square to find the radius.` },
    { front: md`$\sin$, $\cos$, $\tan$ of $30^\circ$, $45^\circ$ and $60^\circ$`, back: md`$30^\circ$: $\frac{1}{2}, \frac{\sqrt{3}}{2}, \frac{\sqrt{3}}{3}$. $45^\circ$: $\frac{\sqrt{2}}{2}, \frac{\sqrt{2}}{2}, 1$. $60^\circ$: $\frac{\sqrt{3}}{2}, \frac{1}{2}, \sqrt{3}$.` },
    { front: 'Signs of sine and cosine in the second quadrant', back: 'Sine positive, cosine negative, so tangent negative.' },
    { front: 'The cosine rule', back: md`$c^2 = a^2 + b^2 - 2ab\cos C$, with $C$ the angle between sides $a$ and $b$.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-math-geometry-trig' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const probabilityAndStatisticsLesson: Lesson = {
  slug: 'probability-and-statistics',
  title: 'Probability and statistics',
  summary: 'Count outcomes, combine probabilities with the addition, multiplication and complement rules, and find means, medians and weighted means by hand.',
  minutes: 22,
  objectives: [
    'Find probabilities by counting equally likely outcomes, and combine them with the addition, multiplication and complement rules.',
    'Handle draws without replacement and conditional probability, using combinations where they save work.',
    'Compute and compare the mean, median, mode, range and weighted mean of a data set.',
  ],
  teachMd: md`
### Probability as counting

When all outcomes are equally likely,

$$P(\text{event}) = \frac{\text{number of favourable outcomes}}{\text{number of possible outcomes}}.$$

The work is in counting both correctly. With two dice there are $6 \times 6 = 36$ ordered outcomes, and $(2, 6)$ and $(6, 2)$ are different outcomes. Listing a small sample space in a grid is often faster and safer than any formula. Every probability lies between 0 and 1; an answer outside that range means a mistake.

### Counting tools

- **Multiplication principle**: if one choice can be made in $m$ ways and a second in $n$ ways, the pair can be made in $mn$ ways.
- **Arrangements**: $n$ different objects can be put in order in $n! = n(n - 1) \cdots 1$ ways.
- **Combinations**: the number of ways to choose $k$ objects from $n$ when order does not matter is $\binom{n}{k} = \frac{n!}{k!(n - k)!}$. For example $\binom{10}{2} = \frac{10 \cdot 9}{2} = 45$.

Ask whether order matters. Choosing a committee of two does not depend on order; choosing a president and a secretary does.

### The three rules

**Complement.** $P(\text{not } A) = 1 - P(A)$. Any question with "at least one" is usually fastest through its complement, "none": $P(\text{at least one}) = 1 - P(\text{none})$.

**Addition.** $P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)$. The subtraction removes the overlap counted twice. When $A$ and $B$ cannot happen together (mutually exclusive), the overlap is zero and the probabilities simply add.

**Multiplication.** $P(A \text{ and } B) = P(A) \cdot P(B \mid A)$, where $P(B \mid A)$ is the probability of $B$ once $A$ is known to have happened. If $A$ and $B$ are **independent**, $P(B \mid A) = P(B)$ and the probabilities just multiply. Two separate dice rolls are independent; two cards drawn without replacement are not.

### Without replacement

When objects are drawn one after another without being put back, both the total and the count of the kind just drawn fall by one at each draw. For two red balls from a bag of 4 red and 6 blue: $\frac{4}{10} \cdot \frac{3}{9}$. The same answer comes from combinations: $\frac{\binom{4}{2}}{\binom{10}{2}} = \frac{6}{45}$. Using two routes is a good check.

### Conditional probability

$$P(A \mid B) = \frac{P(A \text{ and } B)}{P(B)}.$$

In counting terms: restrict attention to the outcomes in $B$, and ask what fraction of them are also in $A$. With a two-way table or a Venn diagram, $P(A \mid B)$ is the overlap divided by the **whole of $B$**, not by the whole population. Note that $P(A \mid B)$ and $P(B \mid A)$ have the same numerator but different denominators, so they are usually different.

### Averages

- **Mean**: sum of the values divided by how many there are. So $\text{sum} = \text{mean} \times \text{count}$, which is the key to most "a value was added or removed" questions.
- **Median**: the middle value once the data are **sorted**. With an even number of values, it is the mean of the two middle ones.
- **Mode**: the most frequent value. **Range**: largest minus smallest.

A **weighted mean** combines groups of different sizes: if $n_1$ values have mean $\bar{x}_1$ and $n_2$ values have mean $\bar{x}_2$, the overall mean is

$$\frac{n_1\bar{x}_1 + n_2\bar{x}_2}{n_1 + n_2}.$$

It lies between the two group means, closer to the mean of the larger group. Averaging the two means directly is right only when the groups are the same size.

### How changes affect the statistics

Adding the same constant to every value adds it to the mean, median and mode, and leaves the range and standard deviation unchanged. Multiplying every value by a constant multiplies the mean, median and mode by it, and the range and standard deviation by its size (a factor of $-2$ doubles the spread). The standard deviation measures how spread out the values are around the mean: data that are all equal have standard deviation 0. An extreme value moves the mean much more than the median, which is why the median describes skewed data better.

### Before you choose

Check that a probability lies between 0 and 1, that a mean lies between the smallest and largest values, and that a median comes from sorted data. Each of these checks takes seconds and can remove a distractor.
`,
  examples: [
    {
      id: 'example-two-dice',
      title: 'A sum with two dice',
      problemMd: md`Two fair six-sided dice are rolled. What is the probability that the sum of the scores is 8?`,
      steps: [
        md`The sample space has $6 \times 6 = 36$ equally likely ordered outcomes.`,
        md`List the favourable ones: $(2, 6), (3, 5), (4, 4), (5, 3), (6, 2)$, which is 5 outcomes.`,
        md`Second route: for a sum of 8 the first die must show 2 to 6 (a first score of 1 would need a 7), and each of those five values has exactly one partner. Again 5.`,
      ],
      answerMd: md`$P = \frac{5}{36}$. Counting unordered pairs ($\{2, 6\}, \{3, 5\}, \{4, 4\}$) and dividing by 36 gives $\frac{3}{36}$, which mixes unordered favourable outcomes with an ordered sample space.`,
    },
    {
      id: 'example-same-colour',
      title: 'Two balls of the same colour',
      problemMd: md`A bag holds 4 red and 6 blue balls. Two are drawn without replacement. What is the probability that they are the same colour?`,
      steps: [
        md`"Same colour" means both red or both blue; these cannot happen together, so add their probabilities.`,
        md`Both red: $\frac{4}{10} \cdot \frac{3}{9} = \frac{12}{90}$. Both blue: $\frac{6}{10} \cdot \frac{5}{9} = \frac{30}{90}$.`,
        md`Add: $\frac{42}{90} = \frac{7}{15}$.`,
        md`Second route with combinations: $\frac{\binom{4}{2} + \binom{6}{2}}{\binom{10}{2}} = \frac{6 + 15}{45} = \frac{21}{45} = \frac{7}{15}$.`,
      ],
      answerMd: md`$\frac{7}{15}$. Treating the draws as if the ball were replaced gives $\left(\frac{4}{10}\right)^2 + \left(\frac{6}{10}\right)^2 = \frac{52}{100}$, which is wrong here.`,
    },
    {
      id: 'example-weighted-mean',
      title: 'Combining two groups',
      problemMd: md`In one class 20 students have a mean mark of 15; in another, 30 students have a mean mark of 20. What is the mean mark of all 50 students?`,
      steps: [
        md`Turn each mean into a total: $20 \cdot 15 = 300$ and $30 \cdot 20 = 600$.`,
        md`Overall mean: $\frac{300 + 600}{50} = \frac{900}{50} = 18$.`,
        md`Second route: measure from 15. The first class adds nothing; the second adds $30 \cdot 5 = 150$ above 15. Spread over 50 students that is $3$, so the mean is $15 + 3 = 18$.`,
      ],
      answerMd: md`The mean is 18. Averaging the two means, $\frac{15 + 20}{2} = 17.5$, ignores that the second class is larger.`,
    },
  ],
  traps: [
    {
      title: 'Adding probabilities for "at least one"',
      md: md`The chance of at least one six in three rolls is not $3 \cdot \frac{1}{6} = \frac{1}{2}$: that counts the outcomes with two or three sixes more than once, and with six rolls the same method would give 1, a certainty. Use $1 - P(\text{none})$.`,
    },
    {
      title: 'Using the wrong denominator in a conditional probability',
      md: md`$P(A \mid B)$ divides the overlap by the size of $B$, the condition, not by the whole group and not by the size of $A$. Read the "given that" clause and make it the denominator.`,
    },
    {
      title: 'Taking the median of unsorted data',
      md: md`The median is the middle of the **sorted** list. With an even number of values, average the two middle values; picking one of them, or the wrong pair, gives a distractor.`,
    },
    {
      title: 'Averaging averages',
      md: md`The mean of two group means equals the overall mean only when the groups are the same size. Otherwise convert each mean into a total, add, and divide by the total count.`,
    },
  ],
  check: [
    {
      id: 'check-at-least-one-six',
      title: 'At least one six',
      topic: 'Probability and statistics',
      stemMd: md`A fair six-sided die is rolled three times. What is the probability of getting at least one six?`,
      options: [
        { id: 'A', text: md`$\frac{1}{216}$`, note: md`This is the probability that all three rolls are sixes, not that at least one is.` },
        { id: 'B', text: md`$\frac{75}{216}$`, note: md`This is the probability of exactly one six, $3 \cdot \frac{1}{6} \cdot \frac{25}{36}$; it leaves out two and three sixes.` },
        { id: 'C', text: md`$\frac{91}{216}$`, note: '' },
        { id: 'D', text: md`$\frac{1}{2}$`, note: md`This adds $\frac{1}{6}$ three times, counting the outcomes with more than one six several times.` },
        { id: 'E', text: md`$\frac{125}{216}$`, note: md`This is the probability of **no** six; the complement was computed but not subtracted from 1.` },
      ],
      answer: 'C',
      workingMd: md`$P(\text{no six}) = \left(\frac{5}{6}\right)^3 = \frac{125}{216}$, so $P(\text{at least one}) = 1 - \frac{125}{216} = \frac{91}{216}$. Second route: exactly one six $\frac{75}{216}$, exactly two $3 \cdot \frac{1}{36} \cdot \frac{5}{6} = \frac{15}{216}$, exactly three $\frac{1}{216}$; total $\frac{91}{216}$.`,
      lesson: 'For "at least one", subtract the probability of "none" from 1.',
    },
    {
      id: 'check-median-missing-value',
      title: 'A missing value, then the median',
      topic: 'Probability and statistics',
      stemMd: md`The six values $2, 4, 4, 5, 9, x$ have a mean of 5. What is their median?`,
      options: [
        { id: 'A', text: md`$4$`, note: md`4 is the mode; the median of six values is the mean of the third and fourth sorted values, 4 and 5.` },
        { id: 'B', text: md`$4.5$`, note: '' },
        { id: 'C', text: md`$5$`, note: md`5 is the mean given in the question, not the median.` },
        { id: 'D', text: md`$5.5$`, note: md`This averages the fourth and fifth sorted values, 5 and 6; with six values the middle pair is the third and fourth.` },
        { id: 'E', text: md`$7$`, note: md`7 is the range, $9 - 2$, not a measure of the centre.` },
      ],
      answer: 'B',
      workingMd: md`The sum must be $6 \cdot 5 = 30$; the known values add to 24, so $x = 6$. Sorted: $2, 4, 4, 5, 6, 9$. The middle pair is 4 and 5, so the median is $4.5$. Check the mean: $\frac{30}{6} = 5$.`,
      lesson: 'Use sum = mean × count to find a missing value, then sort before taking the median.',
    },
    {
      id: 'check-conditional-students',
      title: 'Given that a student studies chemistry',
      topic: 'Probability and statistics',
      stemMd: md`In a group of 40 students, 25 study biology, 18 study chemistry and 8 study both. A student chosen at random studies chemistry. What is the probability that this student also studies biology?`,
      options: [
        { id: 'A', text: md`$\frac{1}{5}$`, note: md`This is $\frac{8}{40}$, the probability of studying both, divided by the whole group instead of by the chemistry students.` },
        { id: 'B', text: md`$\frac{8}{25}$`, note: md`This is the probability of chemistry given biology; the condition here is chemistry, so divide by 18.` },
        { id: 'C', text: md`$\frac{4}{9}$`, note: '' },
        { id: 'D', text: md`$\frac{5}{8}$`, note: md`This is $\frac{25}{40}$, the probability of biology for any student; the information that the student studies chemistry is ignored.` },
        { id: 'E', text: md`$\frac{7}{8}$`, note: md`This is $\frac{35}{40}$, the probability of studying biology or chemistry, not a conditional probability.` },
      ],
      answer: 'C',
      workingMd: md`Restrict to the 18 chemistry students; 8 of them study biology. $P = \frac{8}{18} = \frac{4}{9}$. With the formula: $\frac{P(\text{both})}{P(\text{chemistry})} = \frac{8/40}{18/40} = \frac{8}{18} = \frac{4}{9}$.`,
      lesson: 'In a conditional probability the "given" group is the denominator.',
    },
  ],
  takeaways: [
    'Count equally likely outcomes carefully; with two dice there are 36 ordered outcomes.',
    'For "at least one", use 1 minus the probability of none.',
    'Without replacement, both the total and the count of the kind drawn fall after each draw.',
    md`$P(A \mid B)$ is the overlap divided by the size of $B$.`,
    'Turn means into totals to combine groups or find a missing value; sort the data before finding the median.',
  ],
  flashcards: [
    { front: 'Probability with equally likely outcomes', back: 'Favourable outcomes divided by possible outcomes; the answer always lies between 0 and 1.' },
    { front: 'Probability of "at least one"', back: md`$1 - P(\text{none})$.` },
    { front: 'Addition rule for "A or B"', back: md`$P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)$; the last term is zero for mutually exclusive events.` },
    { front: 'Conditional probability', back: md`$P(A \mid B) = \frac{P(A \text{ and } B)}{P(B)}$: the overlap as a fraction of $B$.` },
    { front: 'Number of ways to choose k objects from n, order not mattering', back: md`$\binom{n}{k} = \frac{n!}{k!(n - k)!}$; for example $\binom{10}{2} = 45$.` },
    { front: 'Weighted mean of two groups', back: md`$\frac{n_1\bar{x}_1 + n_2\bar{x}_2}{n_1 + n_2}$: convert each mean into a total, add, divide by the total count.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-physics-maths', skill: 'imat-math-probability-statistics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};
