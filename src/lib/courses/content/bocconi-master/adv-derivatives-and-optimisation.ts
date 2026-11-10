import { md, type Lesson } from '../../types';

export const derivativesAndOptimisationLesson: Lesson = {
  slug: 'derivatives-and-optimisation',
  title: 'Derivatives and optimisation',
  summary: 'Optional: derivative rules, maxima and minima, profit maximisation with MR = MC, and partial derivatives and gradients of two-variable functions.',
  minutes: 25,
  objectives: [
    'Differentiate powers, exponentials, logarithms, products, quotients and compositions by hand.',
    md`Find a maximum or minimum where $f'(x) = 0$ and confirm it with the second derivative, or with $-\frac{b}{2a}$ for a parabola.`,
    'Maximise profit by setting marginal revenue equal to marginal cost, and check that the result is a maximum.',
    'Compute partial derivatives and the gradient of a function of two variables.',
  ],
  teachMd: md`
### Why this lesson is optional

Bocconi's current test page describes quantitative reasoning as numerical and logical problems using basic mathematics, and it publishes no topic list. A 2024 sample test on Bocconi's website, which the current page does not link to and which may not reflect today's form, included an item on the gradient of a function of two variables. Nothing confirms that calculus appears on the current test. Treat this lesson as extra preparation for that possibility, after the core quantitative reasoning lessons.

### What a derivative measures

The derivative $f'(x)$ is the slope of the graph of $f$ at the point $x$: how fast $f$ changes per unit change in $x$. For a straight line the slope is the same everywhere; for a curve it changes from point to point. In economics the derivative of a total is called a **marginal** quantity. If $C(Q)$ is the total cost of $Q$ units, the marginal cost $C'(Q)$ is approximately the extra cost of one more unit.

### The rules you need

| Function | Derivative | Example |
| --- | --- | --- |
| $x^n$ | $n x^{n-1}$ | $(4x^3)' = 12x^2$ |
| a constant | $0$ | $(500)' = 0$ |
| $e^{kx}$ | $k e^{kx}$ | $(e^{3x})' = 3e^{3x}$ |
| $\ln x$ | $\frac{1}{x}$ | $(5\ln x)' = \frac{5}{x}$ |
| $uv$ | $u'v + uv'$ | $(x e^x)' = e^x + x e^x$ |
| $\frac{u}{v}$ | $\frac{u'v - uv'}{v^2}$ | $\left(\frac{x}{x+1}\right)' = \frac{1}{(x+1)^2}$ |
| $f(g(x))$ | $f'(g(x))\, g'(x)$ | $\left(\ln(x^2 + 1)\right)' = \frac{2x}{x^2 + 1}$ |

Sums are differentiated term by term, and a constant factor stays where it is. The power rule also covers roots and reciprocals once they are written as powers: $\sqrt{x} = x^{1/2}$ has derivative $\frac{1}{2}x^{-1/2} = \frac{1}{2\sqrt{x}}$, and $\frac{1}{x} = x^{-1}$ has derivative $-\frac{1}{x^2}$.

The chain rule says: differentiate the outside function with the inside left alone, then multiply by the derivative of the inside. For $(3x + 1)^4$ the outside is a fourth power and the inside is $3x + 1$, so the derivative is $4(3x + 1)^3 \times 3 = 12(3x + 1)^3$. The rule for $e^{kx}$ in the table is the chain rule at work: the inside, $kx$, has derivative $k$.

### Maxima and minima

At a maximum or minimum of a smooth function, away from the ends of its domain, the graph is momentarily flat, so $f'(x) = 0$. Points where this happens are **stationary points**. To tell which kind you have, look at the second derivative $f''(x)$, the derivative of $f'$:

- $f''(x_0) < 0$: the curve bends downwards there, so $x_0$ is a local **maximum**;
- $f''(x_0) > 0$: it bends upwards, so $x_0$ is a local **minimum**;
- $f''(x_0) = 0$: the test is silent; look at how the sign of $f'$ changes on either side.

A point where $f''$ changes sign is a **point of inflection**, where the curve switches between bending down and bending up. "Local" matters: a local maximum is the highest point nearby, not necessarily the highest value overall. When $x$ is restricted to an interval, compare the stationary values with the values at the ends.

### Parabolas without calculus

For $f(x) = ax^2 + bx + c$ the derivative is $2ax + b$, which is zero at
$$x = -\frac{b}{2a}.$$
That is the vertex, and the formula can be used without any calculus. If $a < 0$ the parabola opens downwards and the vertex is its maximum; if $a > 0$ it is its minimum. The vertex also lies midway between the roots, which gives a check: $-x^2 + 10x$ has roots 0 and 10 and its maximum at $x = 5$, and indeed $-\frac{10}{2 \times (-1)} = 5$.

### Marginal revenue, marginal cost and profit

Profit is revenue minus cost, $\pi(Q) = R(Q) - C(Q)$. Setting its derivative to zero gives $R'(Q) = C'(Q)$: **marginal revenue equals marginal cost**. The logic is plain. While one more unit adds more to revenue than to cost, producing it raises profit; the best output is where the two are equal.

$\text{MR} = \text{MC}$ is only the first condition. It can also hold where profit is at a minimum, so check the second derivative: profit is at a maximum when $\pi''(Q) = R''(Q) - C''(Q) < 0$, that is, where marginal cost is rising faster than marginal revenue. When the price $p$ is fixed, $R = pQ$, so $\text{MR} = p$ and the condition becomes $p = \text{MC}$ with marginal cost rising. When the price falls as the firm sells more, marginal revenue is below the price: with demand $P = a - bQ$, revenue is $aQ - bQ^2$ and $\text{MR} = a - 2bQ$.

Fixed costs have derivative zero. They change the level of profit but not the output that maximises it.

### Partial derivatives and the gradient

A function of two variables, $f(x, y)$, has two partial derivatives. For $\frac{\partial f}{\partial x}$, treat $y$ as a fixed number and differentiate with respect to $x$; for $\frac{\partial f}{\partial y}$, do the reverse. For $f(x, y) = x^2 y + 3y^2$:
$$\frac{\partial f}{\partial x} = 2xy, \qquad \frac{\partial f}{\partial y} = x^2 + 6y.$$
The **gradient** collects them into a vector, in this order: $\nabla f = \left(\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right)$. At $(1, 2)$ it is $(4, 13)$. The gradient points in the direction in which $f$ rises fastest, and at an interior maximum or minimum both partial derivatives are zero.

In economics the partial derivatives of a production function are **marginal products**: $\frac{\partial Q}{\partial L}$ is roughly the extra output from one more unit of labour with capital held fixed. For a Cobb–Douglas function $Q = A K^{\alpha} L^{\beta}$ the exponents also describe returns to scale: if $\alpha + \beta = 1$, doubling both inputs doubles output; if the sum is above 1, output more than doubles; below 1, it less than doubles.
`,
  examples: [
    {
      id: 'example-stationary-points',
      title: 'Classifying stationary points',
      problemMd: md`Find and classify the stationary points of $f(x) = x^3 - 6x^2 + 9x + 2$, and find its point of inflection.`,
      steps: [
        md`Differentiate term by term: $f'(x) = 3x^2 - 12x + 9 = 3(x^2 - 4x + 3) = 3(x - 1)(x - 3)$.`,
        md`Stationary points are where $f'(x) = 0$: $x = 1$ and $x = 3$.`,
        md`Second derivative: $f''(x) = 6x - 12$. At $x = 1$ it is $-6 < 0$, a local maximum; at $x = 3$ it is $6 > 0$, a local minimum.`,
        md`Values: $f(1) = 1 - 6 + 9 + 2 = 6$ and $f(3) = 27 - 54 + 27 + 2 = 2$. Check: between the two points $f$ should be falling, and $f'(2) = 12 - 24 + 9 = -3 < 0$.`,
        md`Inflection: $f''(x) = 0$ at $x = 2$, and $f''$ is negative before 2 and positive after, so the sign changes. $f(2) = 8 - 24 + 18 + 2 = 4$. The point $(2, 4)$ lies midway between $(1, 6)$ and $(3, 2)$, as it does for every cubic with two stationary points.`,
      ],
      answerMd: md`Local maximum at $(1, 6)$, local minimum at $(3, 2)$, point of inflection at $(2, 4)$. Stopping at $f'(x) = 0$ and calling both points maxima is the tempting error; the second derivative shows that $x = 3$ is a minimum.`,
    },
    {
      id: 'example-vertex-profit',
      title: 'Profit with a linear demand curve',
      problemMd: md`A firm faces the demand curve $P = 100 - 2Q$ and has total cost $C(Q) = 20Q + 300$. Which output maximises profit, and what is the maximum profit?`,
      steps: [
        md`Revenue is price times quantity: $R(Q) = (100 - 2Q)Q = 100Q - 2Q^2$.`,
        md`Profit: $\pi(Q) = 100Q - 2Q^2 - 20Q - 300 = -2Q^2 + 80Q - 300$, a parabola opening downwards because $a = -2 < 0$.`,
        md`Vertex, no calculus needed: $Q = -\frac{80}{2 \times (-2)} = 20$.`,
        md`Second route with marginals: $\text{MR} = 100 - 4Q$ and $\text{MC} = 20$, equal when $4Q = 80$, so $Q = 20$. And $\pi''(Q) = -4 < 0$, so this is a maximum.`,
        md`Profit at $Q = 20$: $-2(400) + 80(20) - 300 = -800 + 1600 - 300 = 500$. Check: the price is $100 - 40 = 60$, revenue $60 \times 20 = 1200$, cost $400 + 300 = 700$, profit 500.`,
      ],
      answerMd: md`Output 20, at a price of 60, gives the maximum profit of 500. Setting the price equal to marginal cost, $100 - 2Q = 20$, gives $Q = 40$, where profit is $-300$: when the price falls as the firm sells more, marginal revenue is below the price, so price = MC is the wrong condition.`,
    },
    {
      id: 'example-cubic-cost',
      title: 'MR = MC with a cubic cost',
      problemMd: md`A firm sells every unit at a fixed price of 60. Its total cost is $C(Q) = \frac{1}{3}Q^3 - 5Q^2 + 36Q + 100$. Find the profit-maximising output and the profit there.`,
      steps: [
        md`With a fixed price, $\text{MR} = 60$. Marginal cost: $C'(Q) = Q^2 - 10Q + 36$.`,
        md`Set them equal: $Q^2 - 10Q + 36 = 60$, so $Q^2 - 10Q - 24 = 0$, which factorises as $(Q - 12)(Q + 2) = 0$. Output cannot be negative, so $Q = 12$.`,
        md`Second-order check: $\pi''(Q) = -C''(Q) = -(2Q - 10)$, which is $-14$ at $Q = 12$. Negative, so profit is at a maximum.`,
        md`Profit: revenue $60 \times 12 = 720$; cost $\frac{1728}{3} - 720 + 432 + 100 = 576 - 720 + 432 + 100 = 388$; profit $720 - 388 = 332$.`,
        md`Second route: $\pi(Q) = 60Q - C(Q) = -\frac{1}{3}Q^3 + 5Q^2 + 24Q - 100$, so $\pi(12) = -576 + 720 + 288 - 100 = 332$.`,
      ],
      answerMd: md`$Q = 12$, with profit 332. Keeping $Q = -2$ as a second answer is the slip to avoid: it solves the equation but means nothing as an output.`,
    },
    {
      id: 'example-marginal-product',
      title: 'Marginal products in a Cobb–Douglas function',
      problemMd: md`Output is $Q = 10K^{0.5}L^{0.5}$, where $K$ is capital and $L$ is labour. Find $\frac{\partial Q}{\partial L}$ and $\frac{\partial Q}{\partial K}$ at $K = 16$, $L = 4$.`,
      steps: [
        md`Hold $K$ fixed and apply the power rule to $L$: $\frac{\partial Q}{\partial L} = 10K^{0.5} \times 0.5L^{-0.5} = 5\sqrt{\frac{K}{L}}$.`,
        md`At $K = 16$, $L = 4$: $5\sqrt{4} = 10$.`,
        md`Second route: fix $K = 16$ first, so $Q = 10 \times 4 \times L^{0.5} = 40\sqrt{L}$, an ordinary function of $L$. Its derivative is $\frac{40}{2\sqrt{L}} = \frac{20}{\sqrt{L}}$, which is $10$ at $L = 4$.`,
        md`In the same way, $\frac{\partial Q}{\partial K} = 5\sqrt{\frac{L}{K}} = 5 \times \frac{1}{2} = 2.5$. The gradient at this point, in the order $(K, L)$, is $(2.5, 10)$.`,
      ],
      answerMd: md`The marginal product of labour is 10 and that of capital is 2.5: one more unit of labour adds roughly 10 units of output. Since $0.5 + 0.5 = 1$, the function has constant returns to scale. Substituting both $K = 16$ and $L = 4$ before differentiating is the tempting error: it turns $Q$ into the constant 80, whose derivative is 0. Fix only the variable you are not differentiating.`,
    },
  ],
  traps: [
    {
      title: 'Multiplying the derivatives of a product',
      md: md`The derivative of $uv$ is $u'v + uv'$, not $u'v'$. For $x^2 e^x$ the product of derivatives gives $2xe^x$, but the correct derivative is $2xe^x + x^2e^x$. Differentiate one factor at a time and add the two terms.`,
    },
    {
      title: 'Dropping the inside derivative',
      md: md`The chain rule multiplies by the derivative of the inside: $(e^{5x})' = 5e^{5x}$, not $e^{5x}$. A quick check is to rewrite when you can: $\ln(2x) = \ln 2 + \ln x$, so its derivative is $\frac{1}{x}$, and the chain rule agrees, $\frac{2}{2x} = \frac{1}{x}$.`,
    },
    {
      title: 'Treating every stationary point as a maximum',
      md: md`$f'(x) = 0$ holds at minima and some inflection points too, and $\text{MR} = \text{MC}$ can hold where profit is lowest. Always check the sign of the second derivative, or the sign of $f'$ on either side, before calling a point a maximum.`,
    },
    {
      title: 'Price = MC when the price is not fixed',
      md: md`Marginal revenue equals the price only when the price does not depend on output. With a demand curve $P = a - bQ$, marginal revenue is $a - 2bQ$, so set that, not the price, equal to marginal cost.`,
    },
    {
      title: 'Setting the other variable to zero',
      md: md`In a partial derivative the other variable is held constant, not set to zero: $\frac{\partial}{\partial x}(x^2 y) = 2xy$, not $2x$ and not 0. Only terms with no $x$ at all, such as $3y^2$, vanish when you differentiate with respect to $x$.`,
    },
  ],
  check: [
    {
      id: 'check-product-chain',
      title: 'Product and chain rules together',
      topic: 'Quantitative reasoning: derivatives',
      stemMd: md`If $f(x) = x^3 e^{2x}$, what is $f'(1)$?`,
      options: [
        { id: 'A', text: md`$2e^2$`, note: md`Keeps only $x^3 \times 2e^{2x}$, the term from differentiating the exponential; the product rule also needs the term $3x^2 e^{2x}$.` },
        { id: 'B', text: md`$4e^2$`, note: md`Treats $e^{2x}$ as its own derivative, dropping the chain-rule factor 2, and gets $3e^2 + e^2$.` },
        { id: 'C', text: md`$5e^2$`, note: '' },
        { id: 'D', text: md`$6e^2$`, note: md`Multiplies the two derivatives, $3x^2 \times 2e^{2x}$; the derivative of a product is not the product of the derivatives.` },
      ],
      answer: 'C',
      workingMd: md`Product rule with $u = x^3$ and $v = e^{2x}$: $u' = 3x^2$ and, by the chain rule, $v' = 2e^{2x}$. So $f'(x) = 3x^2 e^{2x} + 2x^3 e^{2x} = x^2 e^{2x}(3 + 2x)$, and $f'(1) = e^2 \times 5 = 5e^2$. Check by logarithms: $\ln f = 3\ln x + 2x$, so $\frac{f'}{f} = \frac{3}{x} + 2$, which is 5 at $x = 1$; with $f(1) = e^2$, $f'(1) = 5e^2$.`,
      lesson: 'For a product, differentiate each factor in turn and add the two terms; inside an exponential, multiply by the derivative of the exponent.',
    },
    {
      id: 'check-profit-maximum',
      title: 'Which output maximises profit?',
      topic: 'Quantitative reasoning: optimisation',
      stemMd: md`A firm sells every unit at a fixed price of 30. Its total cost is $C(Q) = Q^3 - 15Q^2 + 78Q + 24$. Which output maximises profit?`,
      options: [
        { id: 'A', text: md`$Q = 2$`, note: md`Solves $\text{MR} = \text{MC}$ correctly but keeps the smaller root; there marginal cost is falling and $\pi''(2) = 18 > 0$, so profit is at a local minimum.` },
        { id: 'B', text: md`$Q = 5$`, note: md`This is where marginal cost is lowest, $6Q - 30 = 0$, not where marginal cost equals the price.` },
        { id: 'C', text: md`$Q = 8$`, note: '' },
        { id: 'D', text: md`Both $Q = 2$ and $Q = 8$`, note: md`Treats every solution of $\text{MR} = \text{MC}$ as a maximum; the second-derivative test separates them, and profit is 40 at one and $-68$ at the other.` },
      ],
      answer: 'C',
      workingMd: md`With a fixed price, $\text{MR} = 30$. Marginal cost is $C'(Q) = 3Q^2 - 30Q + 78$. Setting them equal: $3Q^2 - 30Q + 48 = 0$, so $Q^2 - 10Q + 16 = 0$ and $(Q - 2)(Q - 8) = 0$. Second derivative of profit: $\pi''(Q) = -C''(Q) = -(6Q - 30)$, which is $+18$ at $Q = 2$ (a minimum) and $-18$ at $Q = 8$ (a maximum). Check with values: at $Q = 8$, revenue 240 and cost $512 - 960 + 624 + 24 = 200$, profit 40; at $Q = 2$, revenue 60 and cost $8 - 60 + 156 + 24 = 128$, profit $-68$; producing nothing gives $-24$.`,
      lesson: 'MR = MC gives candidates; the second derivative of profit, or the sign of the slope of MC, picks the maximum.',
    },
    {
      id: 'check-gradient',
      title: 'Gradient of a two-variable function',
      topic: 'Quantitative reasoning: partial derivatives',
      stemMd: md`What is the gradient of $f(x, y) = 3x^2 y + y^2$ at the point $(1, 2)$?`,
      options: [
        { id: 'A', text: md`$(6, 7)$`, note: md`Differentiates $3x^2 y$ with respect to $x$ as $6x$, dropping the factor $y$; $y$ is held constant, not removed.` },
        { id: 'B', text: md`$(12, 7)$`, note: '' },
        { id: 'C', text: md`$(12, 4)$`, note: md`Treats $3x^2 y$ as a constant when differentiating with respect to $y$; it contains $y$, so its partial derivative is $3x^2$.` },
        { id: 'D', text: md`$(7, 12)$`, note: md`Has the right partial derivatives in the wrong order; the gradient lists the derivative with respect to $x$ first.` },
      ],
      answer: 'B',
      workingMd: md`With $y$ held constant, $\frac{\partial f}{\partial x} = 6xy$ (the $y^2$ term gives 0), which is $6 \times 1 \times 2 = 12$ at $(1, 2)$. With $x$ held constant, $\frac{\partial f}{\partial y} = 3x^2 + 2y = 3 + 4 = 7$. So the gradient is $(12, 7)$. Check by fixing one variable first: $f(x, 2) = 6x^2 + 4$ has derivative $12x = 12$ at $x = 1$, and $f(1, y) = 3y + y^2$ has derivative $3 + 2y = 7$ at $y = 2$.`,
      lesson: 'A partial derivative holds the other variable constant, and the gradient lists the partial derivatives in the order of the variables.',
    },
  ],
  takeaways: [
    md`Power rule: $x^n$ becomes $nx^{n-1}$; for products, quotients and compositions use the product, quotient and chain rules, never the product of derivatives.`,
    md`At a smooth interior maximum or minimum $f'(x) = 0$; at such a stationary point, $f'' < 0$ means a local maximum and $f'' > 0$ a local minimum.`,
    md`A parabola $ax^2 + bx + c$ has its vertex at $x = -\frac{b}{2a}$: a maximum if $a < 0$, a minimum if $a > 0$.`,
    'Profit peaks where MR = MC and the second derivative of profit is negative; fixed costs do not move the best output.',
    'A partial derivative holds the other variables constant; the gradient lists the partial derivatives as a vector.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-algebra-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
