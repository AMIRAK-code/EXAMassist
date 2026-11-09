import { md, type Lesson } from '../../types';

export const algebraicExpressionsLesson: Lesson = {
  slug: 'algebraic-expressions-and-factoring',
  title: 'Algebraic expressions, identities and factoring',
  summary: 'Expand and factor expressions with three key identities, simplify fractions by cancelling factors, and use identities to evaluate without solving.',
  minutes: 22,
  objectives: [
    'Expand products and recognise the three standard identities in either direction.',
    'Factor out a common factor, a difference of squares and a trinomial, including one whose leading coefficient is not 1.',
    'Simplify an algebraic fraction by cancelling common factors, never common terms.',
    md`Use an identity to find a value such as $x^2 - y^2$ or $a^2 + b^2$ without finding the variables.`,
  ],
  teachMd: md`
### Terms and factors

An expression is built from **terms** joined by $+$ and $-$; each term is a product of **factors**. In $3x^2 - 5xy + 2$ there are three terms; the first term has the factors $3$, $x$ and $x$. The distinction decides almost everything in this lesson: you may combine *like terms* (same variables to the same powers), and you may cancel *common factors* of a numerator and a denominator, but you may never cancel a term.

### Expanding

To multiply two brackets, multiply every term of the first by every term of the second and add the results:

$$(2x - 3)(x + 4) = 2x^2 + 8x - 3x - 12 = 2x^2 + 5x - 12$$

Three products come up so often that it pays to know them by sight, in both directions:

| Identity | Expanded |
| --- | --- |
| $(a + b)^2$ | $a^2 + 2ab + b^2$ |
| $(a - b)^2$ | $a^2 - 2ab + b^2$ |
| $(a + b)(a - b)$ | $a^2 - b^2$ |

The middle term $2ab$ is the one people lose. $(a + b)^2$ is **not** $a^2 + b^2$; a quick test with $a = b = 1$ gives $4$ on one side and $2$ on the other.

### Factoring is expanding in reverse

Work through these checks in order.

1. **Common factor.** Take out the largest factor shared by every term: $6x^3 - 9x^2 = 3x^2(2x - 3)$.
2. **Difference of squares.** Two squares with a minus between them: $x^2 - 49 = (x - 7)(x + 7)$, and $4m^2 - 25 = (2m - 5)(2m + 5)$. A *sum* of squares such as $x^2 + 49$ does not factor this way.
3. **Trinomial $x^2 + bx + c$.** Find two numbers that multiply to $c$ and add to $b$. For $x^2 - x - 12$, the numbers are $-4$ and $3$, so it is $(x - 4)(x + 3)$.
4. **Trinomial $ax^2 + bx + c$ with $a \neq 1$.** Find two numbers that multiply to $ac$ and add to $b$, split the middle term with them, and factor in pairs (grouping).
5. **Perfect square trinomial.** If the first and last terms are squares and the middle term is twice the product of their roots, it is a square: $x^2 - 10x + 25 = (x - 5)^2$.

After factoring, take out anything that still factors: $2x^3 - 8x = 2x(x^2 - 4) = 2x(x - 2)(x + 2)$. To check a factorisation, expand it back, or substitute a small number such as $x = 3$ into both forms.

### Simplifying algebraic fractions

Factor the numerator and the denominator completely, then cancel factors that appear in both. A whole bracket is one factor; a single term inside a bracket is not.

$$\frac{x^2 + 5x}{x^2 - 25} = \frac{x(x + 5)}{(x - 5)(x + 5)} = \frac{x}{x - 5}, \quad x \neq \pm 5$$

The restriction matters. The original fraction is undefined at $x = 5$ and at $x = -5$, and the simplified one still is at $x = 5$; cancelling a factor never makes a forbidden value allowed. When a question adds a condition such as $x \neq 5$, this is the reason.

### Identities let you skip the solving

Questions often give two facts and ask for a third expression. If the third expression is linked to the given ones by an identity, use it directly:

- Given $x + y$ and $x - y$, the product gives $x^2 - y^2$.
- Given $a + b$ and $ab$, rearrange $(a + b)^2 = a^2 + 2ab + b^2$ to get $a^2 + b^2 = (a + b)^2 - 2ab$.
- Given $a - b$ and $ab$, similarly $a^2 + b^2 = (a - b)^2 + 2ab$.

When you see $x^2 - y^2$, $a^2 + b^2$ or $(a + b)^2$ in a question, the question is almost always built on one of these identities. Solving for the variables is possible in some cases but slower, and in others the variables are not whole numbers, so the identity is the only sensible route.

### Comparisons built on identities

In a quantitative comparison, subtract one quantity from the other and simplify. Comparing $(x + 3)^2$ with $x^2 + 9$, the difference is $6x$, so the answer depends only on the sign of $x$. If the stem says $x$ is negative, Quantity B is greater; if $x$ could be anything, the relationship cannot be determined.
`,
  examples: [
    {
      id: 'example-simplify-fraction',
      title: 'Cancelling factors in a fraction',
      problemMd: md`Simplify $\frac{x^2 - 9}{x^2 + x - 6}$, where $x \neq -3$ and $x \neq 2$.`,
      steps: [
        md`Factor the numerator as a difference of squares: $x^2 - 9 = (x - 3)(x + 3)$.`,
        md`Factor the denominator: two numbers that multiply to $-6$ and add to $1$ are $3$ and $-2$, so $x^2 + x - 6 = (x + 3)(x - 2)$.`,
        md`Cancel the common factor $(x + 3)$: the result is $\frac{x - 3}{x - 2}$.`,
        md`Check with $x = 4$: the original is $\frac{16 - 9}{16 + 4 - 6} = \frac{7}{14} = \frac{1}{2}$, and the simplified form is $\frac{1}{2}$ too.`,
      ],
      answerMd: md`$\frac{x - 3}{x - 2}$. Cancelling the $x^2$ terms to get $\frac{-9}{x - 6}$ is the classic error: $x^2$ is a term, not a factor of the whole numerator and denominator.`,
    },
    {
      id: 'example-difference-of-squares',
      title: 'Evaluating $x^2 - y^2$ from two sums',
      problemMd: md`If $x + y = 9$ and $x - y = 3$, what is $x^2 - y^2$?`,
      steps: [
        md`$x^2 - y^2 = (x + y)(x - y)$, and both factors are given.`,
        md`Multiply: $9 \times 3 = 27$.`,
        md`Check by solving: adding the equations gives $2x = 12$, so $x = 6$ and $y = 3$; then $36 - 9 = 27$.`,
      ],
      answerMd: md`$x^2 - y^2 = 27$. Squaring the difference instead, $3^2 = 9$, finds $(x - y)^2$, which is a different expression.`,
    },
    {
      id: 'example-sum-of-squares',
      title: 'Finding $a^2 + b^2$ from $a + b$ and $ab$',
      problemMd: md`If $(a + b)^2 = 64$ and $ab = 7$, what is $a^2 + b^2$?`,
      steps: [
        md`Expand the given square: $a^2 + 2ab + b^2 = 64$.`,
        md`Substitute $ab = 7$: $a^2 + 14 + b^2 = 64$, so $a^2 + b^2 = 50$.`,
        md`Check: $a + b = 8$ and $ab = 7$ fit $a = 7$, $b = 1$, and $49 + 1 = 50$. The other possibility, $a + b = -8$, fits $a = -7$, $b = -1$, which also gives 50.`,
      ],
      answerMd: md`$a^2 + b^2 = 50$. Subtracting $ab$ once instead of $2ab$ gives the tempting wrong answer 57.`,
    },
    {
      id: 'example-grouping',
      title: 'Factoring when the leading coefficient is not 1',
      problemMd: md`Factor $3x^2 + 7x - 6$.`,
      steps: [
        md`Multiply the leading coefficient by the constant: $ac = 3 \times (-6) = -18$.`,
        md`Find two numbers that multiply to $-18$ and add to $7$: they are $9$ and $-2$.`,
        md`Split the middle term: $3x^2 + 9x - 2x - 6$.`,
        md`Factor in pairs: $3x(x + 3) - 2(x + 3) = (3x - 2)(x + 3)$.`,
        md`Check with $x = 1$: the original is $3 + 7 - 6 = 4$, and the factored form is $(1)(4) = 4$.`,
      ],
      answerMd: md`$3x^2 + 7x - 6 = (3x - 2)(x + 3)$.`,
    },
  ],
  traps: [
    {
      title: 'Losing the middle term',
      md: md`$(x + 5)^2$ is $x^2 + 10x + 25$, not $x^2 + 25$. Whenever you square a sum or a difference, write out the $2ab$ term. A one-second check with small numbers ($a = b = 1$) exposes the error.`,
    },
    {
      title: 'Cancelling terms instead of factors',
      md: md`In $\frac{x + 6}{6}$ the 6 on top is a term, so nothing cancels; the fraction is $\frac{x}{6} + 1$. You may cancel only something that multiplies the **entire** numerator and the **entire** denominator. Factor first, then cancel.`,
    },
    {
      title: 'Mixing up $x^2 - y^2$ and $(x - y)^2$',
      md: md`$x^2 - y^2 = (x - y)(x + y)$, while $(x - y)^2 = x^2 - 2xy + y^2$. They are equal only when $y = 0$ or $x = y$. Questions that give $x - y$ and ask for $x^2 - y^2$ need $x + y$ as well.`,
    },
    {
      title: 'Stopping too early',
      md: md`$2x^3 - 8x = 2x(x^2 - 4)$ is not finished: $x^2 - 4$ is a difference of squares. If answer choices are fully factored, a half-factored expression will not match any of them.`,
    },
  ],
  check: [
    {
      id: 'check-sum-from-difference',
      title: 'Using the difference of squares',
      topic: 'Algebra',
      stemMd: md`If $x - y = 5$ and $x^2 - y^2 = 45$, what is the value of $x + y$?`,
      options: [
        { id: 'A', text: md`$2$`, note: md`This is the value of $y$, found after solving; the question asks for $x + y$.` },
        { id: 'B', text: md`$5$`, note: md`This repeats the given $x - y$.` },
        { id: 'C', text: md`$7$`, note: md`This is the value of $x$, not of $x + y$.` },
        { id: 'D', text: md`$9$`, note: '' },
        { id: 'E', text: md`$40$`, note: md`Subtracts $5$ from $45$ instead of dividing; $x^2 - y^2$ is the product of $x - y$ and $x + y$.` },
      ],
      answer: 'D',
      workingMd: md`$x^2 - y^2 = (x - y)(x + y)$, so $45 = 5(x + y)$ and $x + y = 9$. Check: with $x + y = 9$ and $x - y = 5$, $x = 7$ and $y = 2$, and $49 - 4 = 45$.`,
      lesson: md`When a question gives $x - y$ and $x^2 - y^2$, divide to get $x + y$.`,
    },
    {
      id: 'check-square-comparison',
      title: 'Where did the middle term go?',
      topic: 'Quantitative Comparison',
      stemMd: md`$x < 0$

| Quantity A | Quantity B |
| --- | --- |
| $(x + 3)^2$ | $x^2 + 9$ |`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: md`Quantity A exceeds Quantity B by $6x$, which would be positive only for positive $x$; the stem says $x$ is negative.` },
        { id: 'B', text: 'Quantity B is greater.', note: '' },
        { id: 'C', text: 'The two quantities are equal.', note: md`Treats $(x + 3)^2$ as $x^2 + 9$, dropping the middle term $6x$.` },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: md`The difference $6x$ does depend on $x$, but only on its sign, and the condition $x < 0$ fixes the sign.` },
      ],
      answer: 'B',
      workingMd: md`Expand Quantity A: $x^2 + 6x + 9$. Subtract Quantity B: the difference is $6x$, which is negative for every $x < 0$, so Quantity B is greater. Check with $x = -1$: Quantity A is $4$ and Quantity B is $10$.`,
      lesson: 'In a comparison, expand both quantities and look at their difference; a condition in the stem often settles its sign.',
    },
    {
      id: 'check-simplify-fraction',
      title: 'Simplify fully',
      topic: 'Algebra',
      stemMd: md`For $x \neq 3$, which of the following is equal to $\frac{2x^2 - 18}{x^2 - 6x + 9}$?`,
      options: [
        { id: 'A', text: md`$2$`, note: md`Cancels $x^2$ against $2x^2$ as if they were factors and ignores the other terms; terms cannot be cancelled.` },
        { id: 'B', text: md`$2(x + 3)$`, note: md`Treats the denominator as a single factor $x - 3$; it is $(x - 3)^2$, so one factor $x - 3$ stays underneath.` },
        { id: 'C', text: md`$\frac{2(x + 3)}{x - 3}$`, note: '' },
        { id: 'D', text: md`$\frac{2(x - 3)}{x + 3}$`, note: md`Factors the denominator as $(x + 3)^2$; the middle term $-6x$ means it is $(x - 3)^2$.` },
        { id: 'E', text: md`$\frac{x + 3}{x - 3}$`, note: md`Loses the common factor 2 that was taken out of the numerator.` },
      ],
      answer: 'C',
      workingMd: md`Numerator: $2x^2 - 18 = 2(x^2 - 9) = 2(x - 3)(x + 3)$. Denominator: $x^2 - 6x + 9 = (x - 3)^2$. Cancel one factor of $x - 3$ to get $\frac{2(x + 3)}{x - 3}$. Check with $x = 5$: the original is $\frac{50 - 18}{25 - 30 + 9} = \frac{32}{4} = 8$, and $\frac{2 \times 8}{2} = 8$.`,
      lesson: 'Take out common factors first, then factor what is left, and cancel whole factors only.',
    },
  ],
  takeaways: [
    md`Know $(a + b)^2$, $(a - b)^2$ and $(a + b)(a - b)$ by sight, in both directions.`,
    'Factor in order: common factor, difference of squares, trinomial, then check for anything left.',
    'Cancel factors, never terms.',
    md`When a question shows $x^2 - y^2$ or $a^2 + b^2$, look for the identity before solving.`,
  ],
  practice: { examKey: 'gre', domain: 'quant-algebra', skill: 'alg-factoring-simplifying' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
