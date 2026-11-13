import { md, type Lesson } from '../../types';

export const quadraticEquationsLesson: Lesson = {
  slug: 'quadratic-equations',
  title: 'Quadratic equations: factoring, the formula and the discriminant',
  metaTitle: 'Quadratic equations: factoring, formula and discriminant',
  summary: 'Solve quadratics by factoring or by the formula, keep both roots, read the discriminant, and use the sum and product of roots as a shortcut.',
  minutes: 22,
  objectives: [
    'Rearrange a quadratic to equal zero and solve it by factoring and the zero-product rule.',
    'Use the quadratic formula when factoring fails, and the discriminant to count real solutions.',
    'Find the sum and product of the roots straight from the coefficients.',
    'Keep every root, and use conditions in the stem to choose between them.',
  ],
  teachMd: md`
### What makes an equation quadratic

A quadratic equation can be written as $ax^2 + bx + c = 0$ with $a \neq 0$. It can have two real solutions, one, or none. That is the key difference from a linear equation: there is usually **more than one** value of $x$ that works, and many questions turn on the second one.

### Step one: make one side zero

Every method starts from $ax^2 + bx + c = 0$. Move all terms to one side first. The equation $x^2 = 5x + 14$ becomes $x^2 - 5x - 14 = 0$. Do not try to factor while terms are on both sides.

### Factoring and the zero-product rule

If a product equals zero, at least one factor equals zero. So once a quadratic is factored, each bracket gives a root:

$$x^2 - 5x - 14 = (x - 7)(x + 2) = 0 \quad\Rightarrow\quad x = 7 \text{ or } x = -2$$

Watch the signs: the factor $(x + 2)$ gives the root $-2$, not $2$. Then substitute each root back into the original equation; both should work.

The rule needs **zero** on one side. $(x - 1)(x - 4) = 10$ does not mean $x - 1 = 10$ or $x - 4 = 10$. Expand, move the 10 across and factor again: $x^2 - 5x - 6 = 0$, so $(x - 6)(x + 1) = 0$ and $x = 6$ or $x = -1$.

### Never divide by the variable

Faced with $3x^2 = 12x$, it is tempting to divide both sides by $x$ and write $3x = 12$. That loses a root. Dividing by $x$ is only allowed if $x \neq 0$, and here $x = 0$ is a solution. Instead, move everything to one side and factor: $3x^2 - 12x = 3x(x - 4) = 0$, so $x = 0$ or $x = 4$.

### Square roots give two signs

If a square equals a positive number, the thing being squared can be positive or negative. From $(x - 3)^2 = 25$, $x - 3 = 5$ or $x - 3 = -5$, so $x = 8$ or $x = -2$. Writing only $x - 3 = 5$ is one of the most common ways to lose a root.

### The quadratic formula

When the numbers do not factor neatly, use

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

Write down $a$, $b$ and $c$ with their signs before substituting, and put negative values in brackets. The whole numerator, $-b$ and the root, is divided by $2a$.

### The discriminant counts the roots

The expression under the root, $b^2 - 4ac$, is the **discriminant**.

| $b^2 - 4ac$ | Real solutions |
| --- | --- |
| positive | two different ones |
| zero | exactly one (a repeated root) |
| negative | none |

You can answer "how many solutions" questions without solving at all. For $x^2 + 4x + 7 = 0$, the discriminant is $16 - 28 = -12$, so there are no real solutions.

### Sum and product of the roots

For $ax^2 + bx + c = 0$ with roots $r$ and $s$:

$$r + s = -\frac{b}{a} \qquad rs = \frac{c}{a}$$

This follows from writing the quadratic as $a(x - r)(x - s)$ and expanding. It answers "what is the sum of the solutions" in one line, and it is a quick check on roots you found by factoring: for $x^2 - 5x - 14 = 0$ the roots $7$ and $-2$ add to $5$ and multiply to $-14$, as they should. Check that the discriminant is not negative before you rely on it for real roots.

### Two roots in a comparison

When a quantitative comparison asks about a variable defined by a quadratic, find **both** roots and compare each with the other quantity. If one root makes Quantity A greater and the other makes Quantity B greater, the relationship cannot be determined. If the stem adds a condition such as $x > 0$, use it to discard a root before comparing.
`,
  examples: [
    {
      id: 'example-rearrange-and-factor',
      title: 'Rearrange, then factor',
      problemMd: md`Solve $x^2 = 5x + 14$.`,
      steps: [
        md`Make one side zero: $x^2 - 5x - 14 = 0$.`,
        md`Find two numbers that multiply to $-14$ and add to $-5$: they are $-7$ and $2$. So $(x - 7)(x + 2) = 0$.`,
        md`Zero-product rule: $x = 7$ or $x = -2$.`,
        md`Check in the original: $49 = 35 + 14$ and $4 = -10 + 14$. Both hold. As a second check, the roots add to $5 = -\frac{-5}{1}$ and multiply to $-14$.`,
      ],
      answerMd: md`$x = 7$ or $x = -2$. Reading the roots straight off the brackets as $-7$ and $2$ is the usual sign slip.`,
    },
    {
      id: 'example-common-factor',
      title: 'Do not divide by $x$',
      problemMd: md`Solve $3x^2 = 12x$.`,
      steps: [
        md`Move every term to one side: $3x^2 - 12x = 0$.`,
        md`Take out the common factor: $3x(x - 4) = 0$.`,
        md`So $3x = 0$ or $x - 4 = 0$, giving $x = 0$ or $x = 4$.`,
        md`Check: $x = 0$ gives $0 = 0$, and $x = 4$ gives $48 = 48$.`,
      ],
      answerMd: md`$x = 0$ or $x = 4$. Dividing both sides by $x$ gives only $x = 4$ and silently loses the root 0.`,
    },
    {
      id: 'example-formula',
      title: 'When factoring fails',
      problemMd: md`Solve $2x^2 - 4x - 3 = 0$.`,
      steps: [
        md`No pair of integers multiplies to $2 \times (-3) = -6$ and adds to $-4$, so use the formula with $a = 2$, $b = -4$, $c = -3$.`,
        md`Discriminant: $b^2 - 4ac = 16 - 4(2)(-3) = 16 + 24 = 40$. It is positive, so there are two real roots.`,
        md`$x = \frac{4 \pm \sqrt{40}}{4} = \frac{4 \pm 2\sqrt{10}}{4} = \frac{2 \pm \sqrt{10}}{2}$.`,
        md`Check with sum and product: the roots add to $\frac{4}{2} = 2$, which is $-\frac{b}{a} = \frac{4}{2}$; they multiply to $\frac{4 - 10}{4} = -\frac{3}{2}$, which is $\frac{c}{a}$.`,
      ],
      answerMd: md`$x = \frac{2 + \sqrt{10}}{2}$ or $x = \frac{2 - \sqrt{10}}{2}$, roughly $2.58$ and $-0.58$.`,
    },
    {
      id: 'example-square-root',
      title: 'A square equal to a number',
      problemMd: md`If $(x - 3)^2 = 25$, what is the sum of all possible values of $x$?`,
      steps: [
        md`Take square roots, keeping both signs: $x - 3 = 5$ or $x - 3 = -5$.`,
        md`So $x = 8$ or $x = -2$.`,
        md`Second route: expand to $x^2 - 6x + 9 = 25$, so $x^2 - 6x - 16 = 0$, whose roots add to $-\frac{-6}{1} = 6$.`,
      ],
      answerMd: md`The sum is $8 + (-2) = 6$. Keeping only the positive square root gives 8, the tempting wrong answer.`,
    },
  ],
  traps: [
    {
      title: 'Dividing by the variable',
      md: md`Dividing $x^2 = 7x$ by $x$ leaves $x = 7$ and loses $x = 0$. Never divide by an expression that could be zero; factor it out instead.`,
    },
    {
      title: 'Only the positive square root',
      md: md`$x^2 = 36$ means $x = 6$ **or** $x = -6$. The symbol $\sqrt{36}$ means only $6$, but solving $x^2 = 36$ gives both. Comparisons often hinge on the negative root.`,
    },
    {
      title: 'Zero-product rule without zero',
      md: md`$(x - 2)(x + 1) = 4$ does not give $x - 2 = 4$. The rule works only when the product equals zero. Expand, move everything to one side, then factor.`,
    },
    {
      title: 'Sign of the roots read from the brackets',
      md: md`The factor $(x + 5)$ gives the root $-5$. A root found with the wrong sign is often among the options, so substitute it back before choosing.`,
    },
  ],
  check: [
    {
      id: 'check-positive-root',
      title: 'Choose the root the stem allows',
      topic: 'Algebra',
      stemMd: md`If $x^2 + 2x - 35 = 0$ and $x > 0$, what is the value of $x$?`,
      options: [
        { id: 'A', text: md`$-7$`, note: md`This is a root, but the condition $x > 0$ rules it out.` },
        { id: 'B', text: md`$-5$`, note: md`Reads the roots off $(x + 7)(x - 5)$ with the signs reversed.` },
        { id: 'C', text: md`$5$`, note: '' },
        { id: 'D', text: md`$7$`, note: md`Reverses the sign of the root $-7$ from the factor $(x + 7)$; check: $49 + 14 - 35 = 28$, not 0.` },
        { id: 'E', text: md`$35$`, note: md`This is the size of the constant term, not a root.` },
      ],
      answer: 'C',
      workingMd: md`Two numbers that multiply to $-35$ and add to $2$ are $7$ and $-5$, so $(x + 7)(x - 5) = 0$ and $x = -7$ or $x = 5$. Only $5$ is positive. Check: $25 + 10 - 35 = 0$.`,
      lesson: 'Find both roots, then let the condition in the stem choose.',
    },
    {
      id: 'check-two-roots-comparison',
      title: 'A root you might lose',
      topic: 'Quantitative Comparison',
      stemMd: md`$x^2 = 6x$

| Quantity A | Quantity B |
| --- | --- |
| $x$ | $3$ |`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: md`Comes from dividing both sides by $x$, which leaves only $x = 6$ and loses the root $x = 0$.` },
        { id: 'B', text: 'Quantity B is greater.', note: md`Holds for the root $x = 0$ only; the root $x = 6$ makes Quantity A greater.` },
        { id: 'C', text: 'The two quantities are equal.', note: md`$x = 3$ is halfway between the roots, but it is not a solution: $9 \neq 18$.` },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: '' },
      ],
      answer: 'D',
      workingMd: md`$x^2 - 6x = 0$, so $x(x - 6) = 0$ and $x = 0$ or $x = 6$. With $x = 0$, Quantity B is greater; with $x = 6$, Quantity A is greater. The relationship is not fixed.`,
      lesson: 'In a comparison, test every root of a quadratic; two roots on opposite sides of the other quantity mean it cannot be determined.',
    },
    {
      id: 'check-sum-of-roots',
      title: 'Sum without solving',
      topic: 'Algebra',
      stemMd: md`What is the sum of the solutions of $2x^2 - 10x + 7 = 0$?`,
      options: [
        { id: 'A', text: md`$-5$`, note: md`Uses $\frac{b}{a}$ instead of $-\frac{b}{a}$; the sum of the roots carries the opposite sign of $b$.` },
        { id: 'B', text: md`$\frac{7}{2}$`, note: md`This is $\frac{c}{a}$, the product of the roots, not their sum.` },
        { id: 'C', text: md`$5$`, note: '' },
        { id: 'D', text: md`$7$`, note: md`This is the constant term, which relates to the product of the roots, and even then it must be divided by $a = 2$.` },
        { id: 'E', text: md`$10$`, note: md`Takes $-b$ without dividing by $a = 2$.` },
      ],
      answer: 'C',
      workingMd: md`The discriminant is $100 - 56 = 44 > 0$, so there are two real roots, and their sum is $-\frac{b}{a} = -\frac{-10}{2} = 5$. Check with the formula: the roots are $\frac{10 \pm \sqrt{44}}{4} = \frac{5 \pm \sqrt{11}}{2}$, which add to $\frac{10}{2} = 5$.`,
      lesson: md`For $ax^2 + bx + c = 0$, the roots add to $-\frac{b}{a}$ and multiply to $\frac{c}{a}$.`,
    },
  ],
  takeaways: [
    'Make one side zero before factoring; the zero-product rule needs a zero.',
    'Never divide by the variable: factor it out and keep the root 0.',
    'A square equal to a positive number gives two roots, one of each sign.',
    md`The discriminant $b^2 - 4ac$ tells you whether there are two, one or no real roots.`,
    md`Roots add to $-\frac{b}{a}$ and multiply to $\frac{c}{a}$.`,
  ],
  practice: { examKey: 'gre', domain: 'quant-algebra', skill: 'alg-linear-quadratic-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
