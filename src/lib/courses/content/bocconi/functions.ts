import { md, type Lesson, type Unit } from '../../types';

const functionsDomainLesson: Lesson = {
  slug: 'functions-domain-and-notation',
  title: 'Functions: notation, domain, composition and inverse',
  summary: 'Read function notation precisely, find the domain of any formula from three rules, and compose and invert functions without mixing up the order.',
  minutes: 22,
  objectives: [
    'Evaluate expressions such as $f(a+1)$ or $f(2x)$ by substituting the whole input.',
    'Find the domain of a formula from denominators, even roots and logarithms.',
    'Compose two functions in the right order and find an inverse by swapping and solving.',
  ],
  teachMd: md`
### What a function is

A function $f$ takes each input $x$ from a set called its **domain** and returns exactly one output $f(x)$. The set of outputs actually produced is the **range**. "Exactly one" is the whole definition: a rule that sends the input 4 to both 2 and $-2$ is not a function, which is why $\sqrt{4}$ means only $2$.

The letter inside the brackets is a placeholder. If $f(x) = x^2 - 3x$, then $f$ means "square the input, then subtract three times the input". So

$$f(a+1) = (a+1)^2 - 3(a+1) = a^2 - a - 2.$$

Every $x$ is replaced by the **whole** input, brackets included. Most notation errors come from replacing only part of it: writing $f(a+1)$ as $a^2 + 1 - 3a + 1$, or $f(2x)$ as $2f(x)$.

### Finding the domain: three rules

When a question gives only a formula, the domain is every real number for which the formula makes sense. For the formulas in this course that comes down to three restrictions:

| Expression | Requirement | Why |
| --- | --- | --- |
| $\frac{P}{Q}$ | $Q \neq 0$ | Division by zero is undefined. |
| $\sqrt{E}$ (any even root) | $E \geq 0$ | No real number squares to a negative. |
| $\log_a E$ or $\ln E$ | $E > 0$ | A positive base raised to any power is positive. |

Odd roots such as $\sqrt[3]{E}$ impose nothing: $\sqrt[3]{-8} = -2$. When a formula has several pieces, write every condition and take the values that satisfy **all** of them at once. Watch for combinations: an even root in a denominator needs its radicand strictly positive, because $\sqrt{0} = 0$ would put a zero underneath.

Simplifying a formula never enlarges its domain. $\frac{x^2 - 1}{x - 1}$ equals $x + 1$ wherever both are defined, but the first is undefined at $x = 1$, so its domain is $x \neq 1$ and its graph is the line $y = x + 1$ with one point missing. Find the domain from the formula as given, before you cancel anything.

### Composition: inside first

The composition $f(g(x))$, also written $(f \circ g)(x)$, means "apply $g$, then apply $f$ to the result". The function written nearer to $x$ acts first. In general $f(g(x)) \neq g(f(x))$, and the test likes to offer the other order as a wrong option.

To build $f(g(x))$ as a formula, take the formula for $f$ and put the whole of $g(x)$, in brackets, wherever $f$ has its variable. To evaluate $f(g(3))$ you do not need the formula at all: compute $g(3)$, then feed that number to $f$. Doing it both ways is a quick check on your algebra.

A composition also has a domain: $x$ must be in the domain of $g$, and $g(x)$ must be in the domain of $f$.

### Inverse functions

The inverse $f^{-1}$ undoes $f$: if $f(a) = b$, then $f^{-1}(b) = a$. It exists only when $f$ is **one-to-one**, meaning no two inputs share an output. $f(x) = x^2$ on all reals is not one-to-one ($f(3) = f(-3)$), so it has no inverse there; restricted to $x \geq 0$ it has the inverse $\sqrt{x}$.

To find an inverse from a formula:

1. Write $y = f(x)$.
2. Solve for $x$ in terms of $y$.
3. Rename: the result is $f^{-1}(y)$; swap letters to write $f^{-1}(x)$.

The domain of $f^{-1}$ is the range of $f$, and the range of $f^{-1}$ is the domain of $f$. On a graph, $f$ and $f^{-1}$ are mirror images in the line $y = x$, because every point $(a, b)$ becomes $(b, a)$.

The notation is a trap in itself: $f^{-1}(x)$ is the inverse function, not $\frac{1}{f(x)}$. When a question asks only for one value such as $f^{-1}(5)$, skip the formula: solve $f(x) = 5$.

### Why this matters under time pressure

In multiple-choice function questions, wrong options tend to come from predictable slips: the other order of composition, a domain endpoint wrongly included, a reciprocal instead of an inverse. Before you choose, substitute one easy number into your answer and into the original; it takes seconds and catches most of these.
`,
  examples: [
    {
      id: 'example-domain-root-fraction',
      title: 'Domain of a root over a quadratic',
      problemMd: md`Find the domain of $f(x) = \dfrac{\sqrt{6 - 2x}}{x^2 - 4x + 3}$.`,
      steps: [
        md`The square root needs $6 - 2x \geq 0$, so $2x \leq 6$ and $x \leq 3$.`,
        md`The denominator must not be zero. Factor it: $x^2 - 4x + 3 = (x - 1)(x - 3)$, which is zero at $x = 1$ and $x = 3$.`,
        md`Take the values that satisfy both conditions: $x \leq 3$, but $x \neq 1$ and $x \neq 3$. The endpoint $3$ allowed by the root is removed by the denominator.`,
        md`Spot check: at $x = 0$ the formula gives $\frac{\sqrt{6}}{3}$, defined; at $x = 2$ it gives $\frac{\sqrt{2}}{-1}$, defined; at $x = 4$ the root is $\sqrt{-2}$, undefined.`,
      ],
      answerMd: md`The domain is $x < 3$ with $x \neq 1$, that is $(-\infty, 1) \cup (1, 3)$. The tempting wrong answer is $x \leq 3,\ x \neq 1$, which forgets that $x = 3$ also zeroes the denominator.`,
    },
    {
      id: 'example-composition-order',
      title: 'Composing in both orders',
      problemMd: md`Let $f(x) = 2x - 1$ and $g(x) = x^2 + 3$. Find $f(g(x))$ and $g(f(x))$, and check both at $x = 2$.`,
      steps: [
        md`For $f(g(x))$, put the whole of $g(x)$ into $f$: $f(g(x)) = 2(x^2 + 3) - 1 = 2x^2 + 5$.`,
        md`For $g(f(x))$, put the whole of $f(x)$ into $g$: $g(f(x)) = (2x - 1)^2 + 3 = 4x^2 - 4x + 1 + 3 = 4x^2 - 4x + 4$.`,
        md`Check $f(g(2))$ by numbers: $g(2) = 7$, then $f(7) = 13$. The formula gives $2 \cdot 4 + 5 = 13$.`,
        md`Check $g(f(2))$: $f(2) = 3$, then $g(3) = 12$. The formula gives $16 - 8 + 4 = 12$.`,
      ],
      answerMd: md`$f(g(x)) = 2x^2 + 5$ and $g(f(x)) = 4x^2 - 4x + 4$. They differ, so the order matters; writing $(2x - 1)^2$ as $4x^2 + 1$ would drop the middle term $-4x$.`,
    },
    {
      id: 'example-inverse-rational',
      title: 'Inverse of a fraction of linear terms',
      problemMd: md`Find the inverse of $f(x) = \dfrac{3x + 2}{x - 1}$, $x \neq 1$, and state its domain.`,
      steps: [
        md`Write $y = \dfrac{3x + 2}{x - 1}$ and clear the fraction: $y(x - 1) = 3x + 2$, so $yx - y = 3x + 2$.`,
        md`Collect the $x$ terms on one side: $yx - 3x = y + 2$, so $x(y - 3) = y + 2$ and $x = \dfrac{y + 2}{y - 3}$.`,
        md`Rename the variable: $f^{-1}(x) = \dfrac{x + 2}{x - 3}$. It is undefined at $x = 3$, which tells you that $3$ is the one value $f$ never takes.`,
        md`Check with a number: $f(2) = \frac{8}{1} = 8$, and $f^{-1}(8) = \frac{10}{5} = 2$.`,
      ],
      answerMd: md`$f^{-1}(x) = \dfrac{x + 2}{x - 3}$, with domain $x \neq 3$ (the range of $f$). The reciprocal $\frac{x - 1}{3x + 2}$ is the tempting wrong answer: it is $\frac{1}{f(x)}$, not the inverse.`,
    },
  ],
  traps: [
    {
      title: 'Cancelling before finding the domain',
      md: md`$\frac{x^2 - 9}{x + 3}$ simplifies to $x - 3$, but the original is undefined at $x = -3$. If you cancel first, you lose the restriction and may pick an option that includes $-3$. Read every condition off the formula exactly as it is written.`,
    },
    {
      title: 'Composing in the wrong order',
      md: md`In $f(g(x))$ the inner function $g$ acts first. The opposite order is almost always among the options and looks equally plausible. Say "first $g$, then $f$" before you substitute, and check one value numerically.`,
    },
    {
      title: 'Reading $f^{-1}$ as a reciprocal',
      md: md`$f^{-1}(x)$ is the inverse function; $\frac{1}{f(x)}$ is written $(f(x))^{-1}$. The two agree only by accident. To find $f^{-1}(k)$, solve $f(x) = k$.`,
    },
    {
      title: 'Substituting only part of the input',
      md: md`With $f(x) = x^2 - 3x$, $f(a + 1)$ is $(a + 1)^2 - 3(a + 1)$, not $a^2 + 1 - 3a + 1$. Put the whole input in brackets every time it replaces $x$.`,
    },
  ],
  check: [
    {
      id: 'check-domain-root-log',
      title: 'A root in a denominator and a logarithm',
      topic: 'Functions',
      stemMd: md`What is the domain of $f(x) = \dfrac{1}{\sqrt{x + 2}} + \ln(5 - x)$?`,
      options: [
        { id: 'A', text: md`$-2 \leq x < 5$`, note: md`Including $x = -2$ makes the denominator $\sqrt{0} = 0$. A root in a denominator needs its radicand strictly positive.` },
        { id: 'B', text: md`$-2 < x < 5$`, note: '' },
        { id: 'C', text: md`$-2 < x \leq 5$`, note: md`At $x = 5$ the logarithm would be $\ln 0$, which is undefined: the argument of a logarithm must be strictly positive.` },
        { id: 'D', text: md`$x > -2$`, note: md`This uses only the root and ignores the logarithm, which needs $5 - x > 0$.` },
      ],
      answer: 'B',
      workingMd: md`The root sits in a denominator, so $x + 2 > 0$, giving $x > -2$. The logarithm needs $5 - x > 0$, giving $x < 5$. Both must hold: $-2 < x < 5$.`,
      lesson: 'List one condition for every denominator, even root and logarithm, then keep only the values that satisfy all of them.',
    },
    {
      id: 'check-composition-formula',
      title: 'Which composition?',
      topic: 'Functions',
      stemMd: md`Let $f(x) = x^2 - 1$ and $g(x) = 3 - x$. Which expression equals $f(g(x))$?`,
      options: [
        { id: 'A', text: md`$4 - x^2$`, note: md`This is $g(f(x)) = 3 - (x^2 - 1)$: the functions were applied in the opposite order.` },
        { id: 'B', text: md`$x^2 + 8$`, note: md`This expands $(3 - x)^2$ as $9 + x^2$ and drops the middle term $-6x$.` },
        { id: 'C', text: md`$x^2 - 6x + 8$`, note: '' },
        { id: 'D', text: md`$-x^3 + 3x^2 + x - 3$`, note: md`This is the product $f(x) \cdot g(x)$, not the composition.` },
      ],
      answer: 'C',
      workingMd: md`$g$ acts first, so put $3 - x$ into $f$: $f(g(x)) = (3 - x)^2 - 1 = 9 - 6x + x^2 - 1 = x^2 - 6x + 8$. Check at $x = 1$: $g(1) = 2$ and $f(2) = 3$; the expression gives $1 - 6 + 8 = 3$.`,
      lesson: 'The function nearer to $x$ acts first; check the formula with one number.',
    },
    {
      id: 'check-inverse-value',
      title: 'One value of an inverse',
      topic: 'Functions',
      stemMd: md`Let $f(x) = \dfrac{2x + 1}{x + 3}$ for $x \neq -3$. What is $f^{-1}(1)$?`,
      options: [
        { id: 'A', text: md`$-2$`, note: md`A sign slip when collecting terms gives $f^{-1}(x) = \frac{3x - 1}{x - 2}$ instead of $\frac{1 - 3x}{x - 2}$, and that formula gives $-2$ at $x = 1$.` },
        { id: 'B', text: md`$\frac{3}{4}$`, note: md`This is $f(1)$, the function itself at 1, not its inverse.` },
        { id: 'C', text: md`$\frac{4}{3}$`, note: md`This is $\frac{1}{f(1)}$: it reads $f^{-1}$ as a reciprocal.` },
        { id: 'D', text: md`$2$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`$f^{-1}(1)$ is the input that $f$ sends to 1. Solve $\frac{2x + 1}{x + 3} = 1$: $2x + 1 = x + 3$, so $x = 2$. Check: $f(2) = \frac{5}{5} = 1$.`,
      lesson: 'For a single value of an inverse, solve $f(x) = k$ instead of building the whole inverse formula.',
    },
  ],
  takeaways: [
    md`The domain comes from three rules: denominators $\neq 0$, even roots of something $\geq 0$, logarithms of something $> 0$.`,
    'Find the domain before simplifying; cancelling never removes a restriction.',
    md`In $f(g(x))$, $g$ acts first; the reverse order is a different function.`,
    md`$f^{-1}$ undoes $f$: swap the roles of input and output and solve; it is not $\frac{1}{f}$.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-functions-concepts' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const graphsLesson: Lesson = {
  slug: 'graphs-of-elementary-functions',
  title: 'Graphs of powers, exponentials, logarithms and absolute value',
  summary: 'Know the shape of each elementary graph, move it with shifts and reflections, and count solutions of an equation by counting where two graphs meet.',
  minutes: 24,
  objectives: [
    md`Describe the graphs of powers, roots, $\frac{1}{x}$, exponentials, logarithms and absolute value from a few key points.`,
    'Apply shifts, reflections and the absolute value to a known graph.',
    'Count the real solutions of an equation by comparing two graphs.',
  ],
  teachMd: md`
### Know a handful of shapes by heart

Without a calculator, graph questions are answered by recognising a basic shape and a few of its points. Learn these.

| Function | Domain | Shape and key points |
| --- | --- | --- |
| $y = x^2$ | all reals | U-shaped, lowest point $(0, 0)$, symmetric about the $y$-axis; passes $(\pm 1, 1)$, $(\pm 2, 4)$. |
| $y = x^3$ | all reals | Always increasing, flat at the origin, symmetric through the origin; passes $(1, 1)$, $(-1, -1)$, $(2, 8)$. |
| $y = \sqrt{x}$ | $x \geq 0$ | Starts at $(0, 0)$, rises ever more slowly; passes $(1, 1)$, $(4, 2)$, $(9, 3)$. |
| $y = \frac{1}{x}$ | $x \neq 0$ | Two separate branches, in the first and third quadrants; the axes are asymptotes; passes $(1, 1)$, $(-1, -1)$. |
| $y = a^x$, $a > 1$ | all reals | Always positive, increasing, passes $(0, 1)$ and $(1, a)$; hugs the $x$-axis on the left. |
| $y = a^x$, $0 < a < 1$ | all reals | Always positive, decreasing, passes $(0, 1)$; hugs the $x$-axis on the right. |
| $y = \log_a x$, $a > 1$ | $x > 0$ | Increasing, passes $(1, 0)$ and $(a, 1)$; plunges towards $-\infty$ next to the $y$-axis. |
| $y = \lvert x \rvert$ | all reals | V-shaped, corner at $(0, 0)$, slopes $-1$ and $1$. |

Two facts link these. The exponential $a^x$ and the logarithm $\log_a x$ are inverse functions, so their graphs are mirror images in the line $y = x$: the point $(0, 1)$ on one becomes $(1, 0)$ on the other, and the horizontal asymptote $y = 0$ becomes the vertical asymptote $x = 0$. And $y = \left(\frac{1}{2}\right)^x$ is $y = 2^{-x}$, the mirror image of $2^x$ in the $y$-axis.

### Moving a graph

Start from a known graph $y = f(x)$ and $k > 0$.

| New equation | Effect on the graph |
| --- | --- |
| $y = f(x) + k$ | up by $k$ |
| $y = f(x) - k$ | down by $k$ |
| $y = f(x - k)$ | right by $k$ |
| $y = f(x + k)$ | left by $k$ |
| $y = -f(x)$ | reflected in the $x$-axis |
| $y = f(-x)$ | reflected in the $y$-axis |
| $y = \lvert f(x) \rvert$ | parts below the $x$-axis flipped above it |

The horizontal shifts feel backwards, and that is exactly why they are tested. In $y = f(x - 3)$, the output that $f$ used to give at $0$ now appears at $x = 3$, so everything has moved right. Check any shift with one point: $y = \sqrt{x - 3}$ starts where the radicand is zero, at $x = 3$.

Asymptotes move with the graph. $y = 2^x - 4$ has the horizontal asymptote $y = -4$; $y = \log_2(x + 1)$ has the vertical asymptote $x = -1$ and the domain $x > -1$.

### Absolute value of a function

$y = \lvert f(x) \rvert$ keeps every point where $f$ is positive or zero and reflects the rest upwards. So $y = \lvert x^2 - 4 \rvert$ is the U-shape of $x^2 - 4$ with the stretch between $x = -2$ and $x = 2$, which dipped to $-4$, flipped into an arch that peaks at $(0, 4)$. The whole graph looks like a W: its two lowest points, at $(\pm 2, 0)$, are sharp corners, and its middle peak is rounded. Compare $y = f(\lvert x \rvert)$, which is a different operation: it copies the right half of the graph onto the left.

### Counting solutions with graphs

The real solutions of $f(x) = g(x)$ are the $x$-coordinates where the graphs of $f$ and $g$ meet. You often do not need the solutions themselves, only how many there are, and a rough sketch answers that. Two tools make the count reliable:

- **Monotonicity.** If one side is increasing and the other decreasing, the graphs meet at most once. If you also find one solution, it is the only one.
- **Sign changes.** If $f - g$ is positive at one point and negative at another, and both are unbroken in between, the graphs cross somewhere between them.

### Decreasing on the whole domain

"Decreasing" means that a larger input always gives a smaller output. $y = \frac{1}{x}$ falls on each branch separately, but it is not decreasing on its whole domain: $-1 < 1$ and $\frac{1}{-1} = -1 < 1 = \frac{1}{1}$. The break at $x = 0$ lets the graph jump from $-\infty$ to $+\infty$.
`,
  examples: [
    {
      id: 'example-shifted-v',
      title: 'A shifted absolute value',
      problemMd: md`Describe the graph of $y = \lvert x - 2 \rvert - 3$: its corner, its intercepts and its shape.`,
      steps: [
        md`Start from $y = \lvert x \rvert$, a V with its corner at the origin. $x - 2$ moves it right by 2, and $-3$ moves it down by 3, so the corner is at $(2, -3)$.`,
        md`The arms keep slopes $-1$ and $1$, and the V still opens upwards, so the lowest value of $y$ is $-3$.`,
        md`$x$-intercepts: $\lvert x - 2 \rvert = 3$ gives $x - 2 = 3$ or $x - 2 = -3$, so $x = 5$ or $x = -1$.`,
        md`$y$-intercept: at $x = 0$, $y = \lvert -2 \rvert - 3 = -1$. A value table confirms the shape: at $x = -1, 0, 2, 4, 5$ the values are $0, -1, -3, -1, 0$.`,
      ],
      answerMd: md`A V opening upwards with its corner at $(2, -3)$, crossing the $x$-axis at $-1$ and $5$ and the $y$-axis at $-1$. Putting the corner at $(-2, -3)$ is the usual slip: $x - 2$ moves the graph right, not left.`,
    },
    {
      id: 'example-shifted-log',
      title: 'A shifted logarithm',
      problemMd: md`For $y = \log_2(x + 4) - 1$, give the domain, the asymptote and the intercepts.`,
      steps: [
        md`The argument must be positive: $x + 4 > 0$, so the domain is $x > -4$. The graph of $\log_2 x$ has moved 4 to the left and 1 down, so the vertical asymptote is $x = -4$.`,
        md`$x$-intercept: $\log_2(x + 4) = 1$ means $x + 4 = 2^1 = 2$, so $x = -2$.`,
        md`$y$-intercept: at $x = 0$, $y = \log_2 4 - 1 = 2 - 1 = 1$.`,
        md`A value table: at $x = -3.5, -3, -2, 0, 4$ the values are $-2, -1, 0, 1, 2$. The function increases, quickly near the asymptote and slowly further right.`,
      ],
      answerMd: md`Domain $x > -4$, vertical asymptote $x = -4$, $x$-intercept $-2$, $y$-intercept $1$. Reading $x + 4$ as a shift to the right would put the asymptote at $x = 4$, which is wrong.`,
    },
    {
      id: 'example-count-intersections',
      title: 'How many solutions does $x^2 = 2^x$ have?',
      problemMd: md`How many real numbers satisfy $x^2 = 2^x$?`,
      steps: [
        md`Try small integers: $x = 2$ gives $4 = 4$ and $x = 4$ gives $16 = 16$. That is two solutions already.`,
        md`Negative $x$: as $x$ goes from $-1$ to $0$, $x^2$ falls from $1$ to $0$ while $2^x$ rises from $\frac{1}{2}$ to $1$. At $x = -1$ the parabola is above ($1 > \frac{1}{2}$); at $x = 0$ it is below ($0 < 1$). So they cross once between $-1$ and $0$.`,
        md`Only once for negative $x$: there $x^2$ is decreasing and $2^x$ increasing, so they can meet at most once.`,
        md`Positive $x$: between $0$ and $2$ the exponential is above (at $x = 1$, $2 > 1$); at $x = 3$, $9 > 8$, so the parabola is above between the two crossings; beyond $x = 4$ the exponential grows faster and stays above (at $x = 5$, $32 > 25$). There are no further crossings.`,
      ],
      answerMd: md`Three real solutions: $x = 2$, $x = 4$, and one between $-1$ and $0$. The tempting answer is two, from testing positive integers only.`,
    },
  ],
  traps: [
    {
      title: 'Shifting the wrong way',
      md: md`$f(x - 3)$ moves the graph 3 to the right, and $f(x + 3)$ moves it 3 to the left. Confirm with one point: the special point of the original (a corner, a starting point, an asymptote) moves to where the bracket becomes what it was before.`,
    },
    {
      title: 'Forgetting the domain of a logarithm or root',
      md: md`$y = \log_3(x - 2)$ does not exist for $x \leq 2$. An option that lists a point with $x \leq 2$ on that graph, or an intercept found there, can be rejected at once.`,
    },
    {
      title: 'Calling a function with a break "decreasing"',
      md: md`$\frac{1}{x}$ decreases on each branch, but not on its whole domain. To test a claim of monotonicity, compare one input on each side of the break.`,
    },
    {
      title: 'Confusing $a^x$ with $x^a$',
      md: md`$2^x$ is an exponential (variable in the exponent), always positive; $x^2$ is a power (variable in the base), zero at the origin. Their graphs, growth and domains differ, and the test can put both in one equation.`,
    },
  ],
  check: [
    {
      id: 'check-log-asymptote-intercept',
      title: 'Asymptote and intercept of a logarithm',
      topic: 'Functions',
      stemMd: md`For the graph of $y = \log_3(x - 2) + 1$, what are the vertical asymptote and the $x$-intercept?`,
      options: [
        { id: 'A', text: md`Asymptote $x = 2$; $x$-intercept $\frac{7}{3}$`, note: '' },
        { id: 'B', text: md`Asymptote $x = -2$; $x$-intercept $-\frac{5}{3}$`, note: md`This shifts the graph left instead of right, as if the formula were $\log_3(x + 2) + 1$.` },
        { id: 'C', text: md`Asymptote $x = 2$; $x$-intercept $3$`, note: md`At $x = 3$ the logarithm is $0$, so $y = 1$, not $0$: this is where the shifted graph crosses the line $y = 1$.` },
        { id: 'D', text: md`Asymptote $x = 2$; $x$-intercept $5$`, note: md`This solves $\log_3(x - 2) = 1$ instead of $-1$: the sign of the constant was lost when moving it across.` },
      ],
      answer: 'A',
      workingMd: md`The argument $x - 2$ must be positive, so the asymptote is $x = 2$. For the intercept set $y = 0$: $\log_3(x - 2) = -1$, so $x - 2 = 3^{-1} = \frac{1}{3}$ and $x = \frac{7}{3}$.`,
      lesson: 'The asymptote of a shifted logarithm is where its argument is zero; an intercept comes from converting the logarithm to a power.',
    },
    {
      id: 'check-count-abs-quadratic',
      title: 'Counting solutions on a W-shaped graph',
      topic: 'Functions',
      stemMd: md`How many real solutions does $\lvert x^2 - 4 \rvert = 4$ have?`,
      options: [
        { id: 'A', text: md`$1$`, note: md`This counts only $x = 0$, where the line $y = 4$ touches the top of the flipped arch, and misses the two outer branches.` },
        { id: 'B', text: md`$2$`, note: md`This solves only $x^2 - 4 = 4$ and forgets the case $x^2 - 4 = -4$.` },
        { id: 'C', text: md`$3$`, note: '' },
        { id: 'D', text: md`$4$`, note: md`This treats $x^2 = 0$ as giving two solutions. It gives only $x = 0$.` },
      ],
      answer: 'C',
      workingMd: md`Either $x^2 - 4 = 4$, so $x = \pm 2\sqrt{2}$, or $x^2 - 4 = -4$, so $x = 0$. That is three solutions. On the graph, the line $y = 4$ cuts each outer arm once and touches the peak of the arch at $(0, 4)$.`,
      lesson: md`An equation $\lvert f(x) \rvert = k$ splits into $f(x) = k$ and $f(x) = -k$; count the distinct roots of both.`,
    },
    {
      id: 'check-decreasing-on-domain',
      title: 'Decreasing on the whole domain',
      topic: 'Functions',
      stemMd: md`Which function is decreasing on its whole domain?`,
      options: [
        { id: 'A', text: md`$y = \dfrac{1}{x}$`, note: md`It decreases on each branch, but $-1 < 1$ while $\frac{1}{-1} < \frac{1}{1}$, so it is not decreasing across the break at $0$.` },
        { id: 'B', text: md`$y = \left(\frac{1}{2}\right)^x$`, note: '' },
        { id: 'C', text: md`$y = \log_2 x$`, note: md`A logarithm with base greater than 1 is increasing.` },
        { id: 'D', text: md`$y = -x^2$`, note: md`This increases for $x < 0$ and decreases only for $x > 0$.` },
      ],
      answer: 'B',
      workingMd: md`An exponential with base between 0 and 1 decreases for every $x$: each step of 1 to the right halves the value. The reciprocal function fails across its break, the logarithm with base 2 increases, and $-x^2$ rises up to $x = 0$ before falling.`,
      lesson: 'To test monotonicity, compare two inputs, including one on each side of any break in the domain.',
    },
  ],
  takeaways: [
    md`$a^x$ passes $(0, 1)$ with asymptote $y = 0$; $\log_a x$ passes $(1, 0)$ with asymptote $x = 0$; they mirror each other in $y = x$.`,
    md`$f(x - k)$ moves right, $f(x) + k$ moves up; check any shift with one point.`,
    md`$\lvert f(x) \rvert$ flips the negative parts of the graph upwards.`,
    'The number of solutions of an equation is the number of meeting points of two graphs; monotonicity and sign changes pin the count down.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-functions-graphs' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const expLogLesson: Lesson = {
  slug: 'exponentials-and-logarithms',
  title: 'Exponentials and logarithms: meaning and identities',
  summary: 'Treat a logarithm as an exponent, use the power and logarithm rules correctly, and compare large powers by hand, without a calculator.',
  minutes: 22,
  objectives: [
    md`Translate between $\log_a b = c$ and $a^c = b$ and evaluate simple logarithms by hand.`,
    'Apply the power rules and the product, quotient, power and change-of-base rules for logarithms.',
    'Compare powers with different bases by rewriting them with a common exponent or base.',
  ],
  teachMd: md`
### Powers first

For a positive base $a$ and any real exponents $m$ and $n$:

| Rule | Example |
| --- | --- |
| $a^m \cdot a^n = a^{m+n}$ | $2^3 \cdot 2^4 = 2^7$ |
| $\dfrac{a^m}{a^n} = a^{m-n}$ | $\dfrac{5^6}{5^4} = 25$ |
| $(a^m)^n = a^{mn}$ | $(3^2)^5 = 3^{10}$ |
| $(ab)^n = a^n b^n$ | $6^3 = 2^3 \cdot 3^3$ |
| $a^0 = 1$, $a^{-n} = \dfrac{1}{a^n}$ | $4^{-2} = \frac{1}{16}$ |
| $a^{\frac{m}{n}} = \sqrt[n]{a^m}$ | $8^{\frac{2}{3}} = \sqrt[3]{64} = 4$ |

There is no rule for $a^m + a^n$; the best you can do is factor, as in $2^{x+1} + 2^x = 2^x(2 + 1) = 3 \cdot 2^x$. A negative exponent makes a reciprocal, never a negative number. With a fractional exponent, take the root first when you can: $27^{\frac{4}{3}} = (\sqrt[3]{27})^4 = 3^4 = 81$, which keeps the numbers small.

### What a logarithm is

$\log_a b$ is the exponent you must put on $a$ to get $b$:

$$\log_a b = c \iff a^c = b \qquad (a > 0,\ a \neq 1,\ b > 0).$$

So $\log_2 32 = 5$ because $2^5 = 32$, $\log_{10} 0.001 = -3$ because $10^{-3} = 0.001$, and $\log_9 3 = \frac{1}{2}$ because $9^{\frac{1}{2}} = 3$. The base must be positive and different from 1, and the argument must be positive: $\log_2(-4)$ and $\log_2 0$ do not exist. The natural logarithm $\ln$ has base $e \approx 2.718$.

Two identities follow straight from the definition, because a logarithm and a power with the same base undo each other:

$$a^{\log_a x} = x \quad (x > 0), \qquad \log_a(a^x) = x.$$

Also $\log_a 1 = 0$ and $\log_a a = 1$ for every valid base.

### The logarithm rules

Because logarithms are exponents, the power rules turn into these, for positive $x$ and $y$:

| Rule | Comes from |
| --- | --- |
| $\log_a(xy) = \log_a x + \log_a y$ | multiplying powers adds exponents |
| $\log_a \dfrac{x}{y} = \log_a x - \log_a y$ | dividing powers subtracts exponents |
| $\log_a(x^k) = k \log_a x$ | a power of a power multiplies exponents |
| $\log_a b = \dfrac{\log_c b}{\log_c a}$ | change of base, for any valid base $c$ |

The change-of-base rule is how you evaluate logarithms whose base and argument are powers of the same number: $\log_8 4 = \frac{\log_2 4}{\log_2 8} = \frac{2}{3}$. It also gives $\log_a b = \frac{1}{\log_b a}$.

What the rules do **not** say matters as much. $\log_a(x + y)$ has no simplification. $\frac{\log_a x}{\log_a y}$ is not $\log_a \frac{x}{y}$. $(\log_a x)^2$ is not $2 \log_a x$. Wrong options are built from exactly these.

### Estimating and comparing without a calculator

A logarithm can be placed between two integers by bracketing its argument with powers of the base: $2^3 = 8 < 10 < 16 = 2^4$, so $3 < \log_2 10 < 4$.

To compare large powers, rewrite them with a **common exponent** or a **common base**. For example $2^{30} = (2^3)^{10} = 8^{10}$ and $3^{20} = (3^2)^{10} = 9^{10}$, so $3^{20} > 2^{30}$ even though $30 > 20$. When neither works, split off a shared factor, or compare logarithms instead of the numbers, since $\log$ with base greater than 1 preserves order.

### Expressing one logarithm through others

A common question gives $\log_a 2$ and $\log_a 3$ as letters and asks for $\log_a 72$. Factor the argument into the given numbers and apply the rules: $72 = 2^3 \cdot 3^2$, so $\log_a 72 = 3\log_a 2 + 2\log_a 3$. Fractions and decimals work the same way, with subtraction for the denominator.
`,
  examples: [
    {
      id: 'example-evaluate-logs',
      title: 'Evaluating a sum of logarithms',
      problemMd: md`Evaluate $\log_2 48 - \log_2 3 + \log_4 16$.`,
      steps: [
        md`Combine the first two with the quotient rule, since they share base 2: $\log_2 48 - \log_2 3 = \log_2 \frac{48}{3} = \log_2 16$.`,
        md`$\log_2 16 = 4$ because $2^4 = 16$.`,
        md`$\log_4 16 = 2$ because $4^2 = 16$. This term has a different base, so it is evaluated on its own, not merged with the others.`,
        md`Add: $4 + 2 = 6$.`,
      ],
      answerMd: md`The value is $6$. Merging all three terms into a single base-2 logarithm, $\log_2 \frac{48 \cdot 16}{3} = \log_2 256 = 8$, is the tempting wrong answer: the rules apply only to logarithms with the same base.`,
    },
    {
      id: 'example-simplify-powers',
      title: 'Simplifying with fractional and negative exponents',
      problemMd: md`Simplify $\dfrac{8^{\frac{2}{3}} \cdot 4^{-\frac{1}{2}}}{2^{-3}}$.`,
      steps: [
        md`Evaluate each piece, root first: $8^{\frac{2}{3}} = (\sqrt[3]{8})^2 = 4$, and $4^{-\frac{1}{2}} = \frac{1}{\sqrt{4}} = \frac{1}{2}$.`,
        md`The numerator is $4 \cdot \frac{1}{2} = 2$. Dividing by $2^{-3} = \frac{1}{8}$ means multiplying by 8: $2 \cdot 8 = 16$.`,
        md`Second route, all in base 2: $8^{\frac{2}{3}} = 2^2$, $4^{-\frac{1}{2}} = 2^{-1}$, so the expression is $2^{2 - 1 - (-3)} = 2^4 = 16$.`,
      ],
      answerMd: md`The value is $16$. Treating $2^{-3}$ as $-8$ gives $-\frac{1}{4}$, which is wrong: a negative exponent gives a reciprocal, not a negative number.`,
    },
    {
      id: 'example-express-log',
      title: 'Writing a logarithm in terms of given ones',
      problemMd: md`Given $\log_a 2 = p$ and $\log_a 3 = q$, express $\log_a 72$ and $\log_a \frac{9}{16}$ in terms of $p$ and $q$.`,
      steps: [
        md`Factor into primes: $72 = 8 \cdot 9 = 2^3 \cdot 3^2$.`,
        md`Product and power rules: $\log_a 72 = \log_a 2^3 + \log_a 3^2 = 3p + 2q$.`,
        md`For the fraction, $\frac{9}{16} = \frac{3^2}{2^4}$, so $\log_a \frac{9}{16} = 2q - 4p$.`,
      ],
      answerMd: md`$\log_a 72 = 3p + 2q$ and $\log_a \frac{9}{16} = 2q - 4p$. Writing $\log_a 72$ as $p^3 q^2$ confuses the logarithm with the number itself: logarithms turn products into sums and powers into multiples.`,
    },
    {
      id: 'example-compare-powers',
      title: 'Ordering three large numbers',
      problemMd: md`Put $2^{30}$, $3^{20}$ and $10^9$ in increasing order.`,
      steps: [
        md`$2^{30}$ and $3^{20}$ share the exponent 10 after rewriting: $2^{30} = 8^{10}$ and $3^{20} = 9^{10}$. Since $8 < 9$, $2^{30} < 3^{20}$.`,
        md`Compare $2^{30}$ with $10^9$ by grouping in threes: $2^{30} = (2^{10})^3 = 1024^3$ and $10^9 = 1000^3$. Since $1024 > 1000$, $2^{30} > 10^9$.`,
      ],
      answerMd: md`$10^9 < 2^{30} < 3^{20}$. Judging by the exponents alone would put $2^{30}$ last, which is wrong.`,
    },
  ],
  traps: [
    {
      title: 'Inventing a rule for sums',
      md: md`$\log_a(x + y)$ is not $\log_a x + \log_a y$, and $2^x + 2^x$ is $2^{x+1}$, not $4^x$. The rules turn products into sums, never sums into anything simpler. When you see a sum inside a logarithm, look for a factorisation instead.`,
    },
    {
      title: 'Negative exponents and negative signs',
      md: md`$5^{-2} = \frac{1}{25}$, a positive number. And $-3^2 = -9$, while $(-3)^2 = 9$: the exponent binds to the 3 before the minus sign applies. Rewrite every negative exponent as a reciprocal before calculating.`,
    },
    {
      title: 'Mixing bases',
      md: md`$\log_2 8 + \log_4 8$ cannot be combined into one logarithm as written; the bases differ. Evaluate each separately ($3 + \frac{3}{2}$) or convert one with change of base first.`,
    },
    {
      title: 'Forgetting that the argument must be positive',
      md: md`$\log_a(x^2) = 2\log_a x$ is true only for $x > 0$; for any $x \neq 0$ the correct form is $2\log_a \lvert x \rvert$. An expression like $\log_3(-9)$ is undefined, and an option built on it is wrong.`,
    },
  ],
  check: [
    {
      id: 'check-evaluate-mixed-logs',
      title: 'Three logarithms',
      topic: 'Logarithms and exponentials',
      stemMd: md`What is the value of $\log_3 54 - \log_3 2 + \log_2 \frac{1}{8}$?`,
      options: [
        { id: 'A', text: md`$0$`, note: '' },
        { id: 'B', text: md`$\frac{10}{3}$`, note: md`This takes $\log_2 \frac{1}{8}$ as $\frac{1}{3}$. The exponent that turns 2 into $\frac{1}{8}$ is $-3$.` },
        { id: 'C', text: md`$6$`, note: md`This takes $\log_2 \frac{1}{8}$ as $+3$, dropping the minus sign that a reciprocal produces.` },
        { id: 'D', text: md`$24$`, note: md`This stops at the argument 27 and subtracts 3 from it, forgetting to take the logarithm of 27.` },
      ],
      answer: 'A',
      workingMd: md`$\log_3 54 - \log_3 2 = \log_3 27 = 3$. And $\log_2 \frac{1}{8} = -3$ because $2^{-3} = \frac{1}{8}$. Total: $3 - 3 = 0$.`,
      lesson: 'Combine only logarithms with the same base, and remember that the logarithm of a reciprocal is negative.',
    },
    {
      id: 'check-log-of-decimal',
      title: 'A logarithm in terms of letters',
      topic: 'Logarithms and exponentials',
      stemMd: md`If $\log_b 2 = m$ and $\log_b 5 = n$, which expression equals $\log_b 0.4$?`,
      options: [
        { id: 'A', text: md`$2m - 1$`, note: md`This writes $0.4 = \frac{4}{10}$ correctly but then treats $\log_b 10$ as 1, which holds only when the base is 10. In fact $\log_b 10 = m + n$.` },
        { id: 'B', text: md`$\dfrac{m}{n}$`, note: md`The quotient rule subtracts logarithms; dividing them is a different, unrelated quantity.` },
        { id: 'C', text: md`$n - m$`, note: md`This is $\log_b \frac{5}{2} = \log_b 2.5$: the fraction is upside down.` },
        { id: 'D', text: md`$m - n$`, note: '' },
      ],
      answer: 'D',
      workingMd: md`$0.4 = \frac{2}{5}$, so $\log_b 0.4 = \log_b 2 - \log_b 5 = m - n$. By a second route, $0.4 = \frac{4}{10}$ gives $2m - (m + n) = m - n$.`,
      lesson: 'Rewrite a decimal as a fraction of the numbers whose logarithms you know, then use the product and quotient rules.',
    },
    {
      id: 'check-largest-power',
      title: 'The largest of four powers',
      topic: 'Logarithms and exponentials',
      stemMd: md`Which of these numbers is the largest?`,
      options: [
        { id: 'A', text: md`$3^{25}$`, note: md`$3^{25} = 243^5$ while $2^{40} = 256^5$, so it is smaller than $2^{40}$.` },
        { id: 'B', text: md`$4^{19}$`, note: md`$4^{19} = 2^{38}$, which is a quarter of $2^{40}$.` },
        { id: 'C', text: md`$2^{40}$`, note: '' },
        { id: 'D', text: md`$6^{15}$`, note: md`The largest base does not make the largest number. $6^{15} = 2^{15} \cdot 3^{15}$ and $2^{40} = 2^{15} \cdot 2^{25}$; since $3^{15} = 27^5$ and $2^{25} = 32^5$, $6^{15}$ is smaller.` },
      ],
      answer: 'C',
      workingMd: md`Use the exponent 5 where possible: $2^{40} = (2^8)^5 = 256^5$ and $3^{25} = (3^5)^5 = 243^5$, so $2^{40} > 3^{25}$. Also $4^{19} = 2^{38} < 2^{40}$. Finally $6^{15} = 2^{15} \cdot 3^{15} = 2^{15} \cdot 27^5$, while $2^{40} = 2^{15} \cdot 32^5$, so $2^{40}$ is larger. The largest is $2^{40}$.`,
      lesson: 'Compare powers by rewriting them with a common exponent or a common factor, never by the size of the base or exponent alone.',
    },
  ],
  takeaways: [
    md`$\log_a b = c$ means $a^c = b$; the base is positive and not 1, the argument positive.`,
    md`Logarithms turn products into sums, quotients into differences and powers into multiples; nothing simplifies $\log_a(x + y)$.`,
    md`A negative exponent gives a reciprocal; a fractional exponent is a root, best taken first.`,
    'Compare large powers by rewriting them with a common exponent or base.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-logexp-identities' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const expLogEquationsLesson: Lesson = {
  slug: 'exponential-and-logarithmic-equations',
  title: 'Exponential and logarithmic equations and inequalities',
  summary: 'Solve exponential and logarithmic equations with a common base, a substitution or a conversion, then check the domain and the direction of any inequality.',
  minutes: 24,
  objectives: [
    'Solve exponential equations by matching bases, by substitution, or by taking logarithms.',
    'Solve logarithmic equations by combining into one logarithm, and reject roots outside the domain.',
    'Solve exponential and logarithmic inequalities, reversing the sign when the base is between 0 and 1.',
  ],
  teachMd: md`
### Exponential equations: three methods

**Match the bases.** If both sides can be written as powers of the same base, set the exponents equal, because $a^u = a^v$ forces $u = v$ when $a > 0$ and $a \neq 1$. Typical bases are 2 (for 4, 8, 16, 32), 3 (for 9, 27, 81) and 5 (for 25, 125). Fractions and roots fit too: $\frac{1}{4} = 2^{-2}$ and $\sqrt{8} = 2^{\frac{3}{2}}$.

**Substitute.** When the equation mixes $a^{2x}$ and $a^x$, or $a^{x+1}$ and $a^x$, set $t = a^x$. Then $a^{2x} = t^2$ and $a^{x+1} = a \cdot t$, and the equation becomes a polynomial in $t$. Solve it, then return to $x$. Because $a^x$ is always positive, **only positive values of $t$ give solutions**; a zero or negative root in $t$ is discarded.

**Take logarithms.** When the bases cannot be matched, as in $3^x = 7$, the answer is a logarithm: $x = \log_3 7$. On a test without a calculator, options are then written as logarithms, or you need only to locate the value: $3^1 < 7 < 3^2$ puts $x$ between 1 and 2.

### Logarithmic equations: domain first

A logarithmic equation has an existence condition: every argument must be positive. Write it down **before** solving. Then:

1. Use the rules to combine each side into a single logarithm with one base.
2. Convert: $\log_a E = c$ becomes $E = a^c$; $\log_a E = \log_a F$ becomes $E = F$.
3. Solve the resulting algebraic equation.
4. Keep only the roots that satisfy the existence condition.

Step 4 is not optional. Combining $\log_a x + \log_a(x - 2)$ into $\log_a\big(x(x - 2)\big)$ quietly enlarges the domain, since $x(x - 2) > 0$ also holds for negative $x$, where the original logarithms do not exist. Roots from that enlarged domain are extraneous.

### Inequalities: watch the base

Both $a^x$ and $\log_a x$ are increasing when $a > 1$ and decreasing when $0 < a < 1$. So after rewriting both sides with the same base:

| Base | $a^u < a^v$ means | $\log_a u < \log_a v$ means |
| --- | --- | --- |
| $a > 1$ | $u < v$ | $u < v$ (with $u > 0$) |
| $0 < a < 1$ | $u > v$ | $u > v$ (with $v > 0$) |

With a base between 0 and 1, the inequality sign flips when you drop the base. For a logarithmic inequality, intersect the result with the existence condition; for an exponential one there is no domain restriction, since $a^x$ exists for every $x$.

Some inequalities are settled by positivity alone. $2^x > -3$ holds for every real $x$, and $2^x < 0$ for none, because an exponential with positive base is always positive.

### Checking costs seconds

Substitute each answer into the original equation, not into a rewritten one. For exponential equations, choose a root that makes the arithmetic easy; for logarithmic ones, check first that every argument is positive, then that the two sides agree. For an inequality, test one value inside your solution set and one outside.

### Reading the options

When the options mix a correct root with a set that includes an extraneous one, the extraneous root is usually negative or makes some argument zero. When the options for an inequality differ only in the direction of the sign, the question is testing whether you noticed a base less than 1.
`,
  examples: [
    {
      id: 'example-match-bases',
      title: 'Matching bases',
      problemMd: md`Solve $9^{x+1} = 27^{x-1}$.`,
      steps: [
        md`Both 9 and 27 are powers of 3: $9^{x+1} = 3^{2(x+1)} = 3^{2x+2}$ and $27^{x-1} = 3^{3(x-1)} = 3^{3x-3}$.`,
        md`Equal powers of the same base have equal exponents: $2x + 2 = 3x - 3$, so $x = 5$.`,
        md`Check: $9^6 = 3^{12}$ and $27^4 = 3^{12}$. They agree.`,
      ],
      answerMd: md`$x = 5$. Forgetting to multiply the whole bracket by the new exponent, writing $9^{x+1}$ as $3^{2x+1}$, gives $2x + 1 = 3x - 3$ and the wrong answer $x = 4$.`,
    },
    {
      id: 'example-substitution',
      title: 'An equation that becomes quadratic',
      problemMd: md`Solve $4^x - 3 \cdot 2^x - 4 = 0$.`,
      steps: [
        md`$4^x = (2^2)^x = (2^x)^2$, so set $t = 2^x$, with $t > 0$. The equation becomes $t^2 - 3t - 4 = 0$.`,
        md`Factor: $(t - 4)(t + 1) = 0$, so $t = 4$ or $t = -1$.`,
        md`$2^x = -1$ is impossible, because $2^x$ is always positive, so discard $t = -1$. From $2^x = 4$, $x = 2$.`,
        md`Check: $4^2 - 3 \cdot 2^2 - 4 = 16 - 12 - 4 = 0$.`,
      ],
      answerMd: md`The only solution is $x = 2$. Answering with the $t$-values 4 and $-1$, or keeping $t = -1$, are the usual errors.`,
    },
    {
      id: 'example-log-sum',
      title: 'Two logarithms and an extraneous root',
      problemMd: md`Solve $\log_2 x + \log_2(x - 2) = 3$.`,
      steps: [
        md`Existence condition: $x > 0$ and $x - 2 > 0$, so $x > 2$.`,
        md`Combine with the product rule: $\log_2\big(x(x - 2)\big) = 3$, so $x(x - 2) = 2^3 = 8$.`,
        md`Solve $x^2 - 2x - 8 = 0$: $(x - 4)(x + 2) = 0$, so $x = 4$ or $x = -2$.`,
        md`Only $x = 4$ satisfies $x > 2$. Check: $\log_2 4 + \log_2 2 = 2 + 1 = 3$.`,
      ],
      answerMd: md`$x = 4$. Keeping $x = -2$ is the trap: $\log_2(-2)$ does not exist, even though $(-2)(-4) = 8$ satisfies the combined equation.`,
    },
    {
      id: 'example-log-inequality',
      title: 'A logarithmic inequality with base one half',
      problemMd: md`Solve $\log_{\frac{1}{2}}(x - 1) > -2$.`,
      steps: [
        md`Existence condition: $x - 1 > 0$, so $x > 1$.`,
        md`Write $-2$ as a logarithm with the same base: $\left(\frac{1}{2}\right)^{-2} = 4$, so $-2 = \log_{\frac{1}{2}} 4$. The inequality is $\log_{\frac{1}{2}}(x - 1) > \log_{\frac{1}{2}} 4$.`,
        md`The base is between 0 and 1, so the logarithm is decreasing and the sign flips: $x - 1 < 4$, so $x < 5$.`,
        md`Combine with the condition: $1 < x < 5$. Test $x = 3$: $\log_{\frac{1}{2}} 2 = -1 > -2$, true. Test $x = 9$: $\log_{\frac{1}{2}} 8 = -3$, not greater than $-2$, as expected.`,
      ],
      answerMd: md`$1 < x < 5$. Not flipping the sign gives $x > 5$, and forgetting the condition gives $x < 5$; both are wrong.`,
    },
  ],
  traps: [
    {
      title: 'Keeping a root outside the domain',
      md: md`After combining logarithms, the algebraic equation often has a root where an original argument is negative or zero. Write the existence condition first and test every root against it.`,
    },
    {
      title: 'Not reversing for a base below 1',
      md: md`$\left(\frac{1}{3}\right)^u > \left(\frac{1}{3}\right)^v$ means $u < v$. The same holds for logarithms with base between 0 and 1. Look at the base before you drop it.`,
    },
    {
      title: 'Keeping a negative value of the substitute',
      md: md`With $t = a^x$, a root $t \leq 0$ gives no $x$ at all. It is not an extra solution, and the answer is never the value of $t$ itself; convert back to $x$.`,
    },
    {
      title: 'Adding the arguments',
      md: md`$\log_a x + \log_a(x - 2)$ is $\log_a\big(x(x - 2)\big)$, a product, not $\log_a(2x - 2)$. The rules come from exponents, and adding exponents corresponds to multiplying numbers.`,
    },
  ],
  check: [
    {
      id: 'check-substitution-solutions',
      title: 'Solutions after a substitution',
      topic: 'Logarithms and exponentials',
      stemMd: md`What is the set of real solutions of $9^x - 4 \cdot 3^x + 3 = 0$?`,
      options: [
        { id: 'A', text: md`$\{0, 1\}$`, note: '' },
        { id: 'B', text: md`$\{1\}$`, note: md`This discards $3^x = 1$ as if it had no solution. It has one: $x = 0$, since $3^0 = 1$.` },
        { id: 'C', text: md`$\{1, 3\}$`, note: md`These are the values of $t = 3^x$, not of $x$: the last step back to $x$ was skipped.` },
        { id: 'D', text: md`No real solution`, note: md`This comes from factoring $t^2 - 4t + 3$ as $(t + 1)(t + 3)$, which gives negative values of $t$. The correct factors are $(t - 1)(t - 3)$.` },
      ],
      answer: 'A',
      workingMd: md`Set $t = 3^x > 0$, so $9^x = t^2$ and $t^2 - 4t + 3 = (t - 1)(t - 3) = 0$. Then $3^x = 1$ gives $x = 0$ and $3^x = 3$ gives $x = 1$. Check $x = 1$: $9 - 12 + 3 = 0$; check $x = 0$: $1 - 4 + 3 = 0$.`,
      lesson: 'After a substitution, keep the positive roots in $t$ and convert every one of them back to $x$.',
    },
    {
      id: 'check-log-equation-domain',
      title: 'A logarithmic equation',
      topic: 'Logarithms and exponentials',
      stemMd: md`Solve $\log_3(x + 1) + \log_3(x - 1) = 1$.`,
      options: [
        { id: 'A', text: md`$x = \frac{3}{2}$`, note: md`This adds the arguments, $(x + 1) + (x - 1) = 2x$, instead of multiplying them.` },
        { id: 'B', text: md`$x = \sqrt{2}$`, note: md`This sets the combined argument equal to 1, the right-hand side, instead of to $3^1 = 3$.` },
        { id: 'C', text: md`$x = 2$`, note: '' },
        { id: 'D', text: md`$x = 2$ or $x = -2$`, note: md`$x = -2$ makes both arguments negative, so the original logarithms do not exist there.` },
      ],
      answer: 'C',
      workingMd: md`Existence: $x + 1 > 0$ and $x - 1 > 0$, so $x > 1$. Combine: $\log_3(x^2 - 1) = 1$, so $x^2 - 1 = 3$ and $x = \pm 2$. Only $x = 2$ satisfies $x > 1$. Check: $\log_3 3 + \log_3 1 = 1 + 0 = 1$.`,
      lesson: 'State the existence condition before solving a logarithmic equation, and use it to reject roots at the end.',
    },
    {
      id: 'check-exponential-inequality',
      title: 'An inequality with base one third',
      topic: 'Logarithms and exponentials',
      stemMd: md`Solve $\left(\frac{1}{3}\right)^{2x - 1} > 9$.`,
      options: [
        { id: 'A', text: md`$x < -\frac{1}{2}$`, note: '' },
        { id: 'B', text: md`$x > -\frac{1}{2}$`, note: md`The exponents were compared without reversing the sign, although the base $\frac{1}{3}$ is less than 1.` },
        { id: 'C', text: md`$x < \frac{3}{2}$`, note: md`This writes 9 as $\left(\frac{1}{3}\right)^2$; in fact $\left(\frac{1}{3}\right)^2 = \frac{1}{9}$ and $9 = \left(\frac{1}{3}\right)^{-2}$.` },
        { id: 'D', text: md`$x > \frac{3}{2}$`, note: md`Two slips together: 9 written as $\left(\frac{1}{3}\right)^2$, and the sign not reversed.` },
      ],
      answer: 'A',
      workingMd: md`$9 = \left(\frac{1}{3}\right)^{-2}$, so the inequality is $\left(\frac{1}{3}\right)^{2x - 1} > \left(\frac{1}{3}\right)^{-2}$. The base is less than 1, so the sign reverses: $2x - 1 < -2$, giving $x < -\frac{1}{2}$. Test $x = -1$: $\left(\frac{1}{3}\right)^{-3} = 27 > 9$, true.`,
      lesson: 'With a base between 0 and 1, reverse the inequality when you compare exponents.',
    },
  ],
  takeaways: [
    md`Exponential equations: match bases, substitute $t = a^x$ (keeping only $t > 0$), or take logarithms.`,
    'Logarithmic equations: write the existence condition first, combine into one logarithm, convert, then reject roots outside the condition.',
    'With a base between 0 and 1, dropping the base reverses an inequality.',
    'Check every answer in the original equation, not in a rewritten one.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-mathematics', skill: 'math-logexp-equations' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const functionsUnit: Unit = {
  slug: 'functions',
  title: 'Functions, exponentials and logarithms',
  summary:
    'Functions and logarithms with exponentials are both topics on the mathematics syllabus of the Online Bocconi Test. This unit covers notation, domain, composition and inverses; the graphs of powers, exponentials, logarithms and absolute value; the meaning and identities of logarithms; and exponential and logarithmic equations and inequalities, all worked by hand.',
  lessons: [functionsDomainLesson, graphsLesson, expLogLesson, expLogEquationsLesson],
};
