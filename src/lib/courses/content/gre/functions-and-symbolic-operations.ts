import { md, type Lesson } from '../../types';

export const functionsLesson: Lesson = {
  slug: 'functions-and-symbolic-operations',
  title: 'Functions and invented operations',
  summary: 'Evaluate functions and compositions with careful substitution, solve for an input, and work any operation a question defines with a new symbol.',
  minutes: 20,
  objectives: [
    md`Evaluate $f(a)$, $f(x + 1)$ and $f(2x)$ by substituting with brackets.`,
    md`Work out a composition such as $f(g(x))$ from the inside out.`,
    md`Solve $f(k) = c$ for the input $k$.`,
    'Apply an operation defined by a new symbol exactly as the definition says, inner brackets first.',
  ],
  teachMd: md`
### A function is a rule

A function takes an input and gives exactly one output. Writing $f(x) = 2x^2 - 3x$ says: whatever goes in the brackets, square it, double that, and subtract three times the input. The letter $x$ is only a placeholder. $f(5)$, $f(-2)$, $f(a + 1)$ and $f(2x)$ all mean "replace every $x$ in the rule with what is in the brackets".

### Substitute with brackets

The safest habit is to rewrite the rule with empty brackets where each $x$ was, then fill them:

$$f(\;) = 2(\;)^2 - 3(\;)$$

For $f(-2)$: $2(-2)^2 - 3(-2) = 8 + 6 = 14$. Without the brackets it is easy to write $-2^2 = -4$, or to lose the sign in $-3 \times (-2)$.

For $f(x + 1)$, the whole of $x + 1$ goes into each bracket:

$$f(x + 1) = 2(x + 1)^2 - 3(x + 1) = 2x^2 + 4x + 2 - 3x - 3 = 2x^2 + x - 1$$

### Four expressions that look alike

| Expression | Meaning | For $f(x) = 3x + 2$ |
| --- | --- | --- |
| $f(x + 1)$ | change the input, then apply $f$ | $3x + 5$ |
| $f(x) + 1$ | apply $f$, then change the output | $3x + 3$ |
| $f(2x)$ | double the input | $6x + 2$ |
| $2f(x)$ | double the output | $6x + 4$ |

These are different unless $f$ happens to be special. In particular $f(2x)$ and $2f(x)$ are equal only for functions like $f(x) = kx$ with no constant term. A comparison that sets one against the other is testing exactly this.

### Composition: inside out

$f(g(x))$ means: apply $g$ first, then feed its output to $f$. Work from the innermost brackets outwards. With $f(x) = 3x - 1$ and $g(x) = x^2 + 2$:

- $f(g(2))$: $g(2) = 6$, then $f(6) = 17$.
- $g(f(2))$: $f(2) = 5$, then $g(5) = 27$.

The order matters, and the two results are usually different. Read the expression from the inside, not from left to right.

### Solving for the input

Some questions give the output and ask for the input. "If $f(k) = 10$" means: substitute $k$ into the rule and set the result equal to 10, then solve the equation that results. If the rule is quadratic, expect two inputs, and check whether the stem limits which is allowed.

### Where a function is defined

A rule can fail for some inputs. At this level, two things cause it: a denominator that would be zero, and an even root of a negative number. For $h(x) = \frac{1}{x - 4}$, the input 4 is not allowed. For $r(x) = \sqrt{x + 3}$, inputs must satisfy $x \ge -3$.

### Operations with invented symbols

Questions often define a new operation with an unfamiliar symbol, for example

$$a \star b = \frac{a + b}{a - b} \quad (a \neq b)$$

There is nothing to know in advance; the definition is the whole rule. Treat it exactly like a function of two inputs:

1. Match the inputs by **position**: the first number replaces $a$, the second replaces $b$.
2. Work innermost brackets first, as with composition.
3. Assume nothing the definition does not say. An invented operation need not be commutative ($a \star b$ may differ from $b \star a$) or associative ($(a \star b) \star c$ may differ from $a \star (b \star c)$).

With the definition above, $3 \star 1 = \frac{4}{2} = 2$, but $1 \star 3 = \frac{4}{-2} = -2$. Swapping the inputs changed the answer.

### Functions on a graph

When a function is drawn, $f(a)$ is the height of the graph at $x = a$, and "$f(x) = 0$" asks where the graph crosses the $x$-axis. The same substitution rules apply; the graph is just the rule drawn as points $(x, f(x))$.
`,
  examples: [
    {
      id: 'example-evaluate',
      title: 'A negative input and a shifted input',
      problemMd: md`If $f(x) = 2x^2 - 3x$, find $f(-2)$ and write $f(x + 1)$ in simplest form.`,
      steps: [
        md`Substitute $-2$ with brackets: $f(-2) = 2(-2)^2 - 3(-2) = 2(4) + 6 = 14$.`,
        md`For $f(x + 1)$, put $x + 1$ in each bracket: $2(x + 1)^2 - 3(x + 1)$.`,
        md`Expand: $2x^2 + 4x + 2 - 3x - 3 = 2x^2 + x - 1$.`,
        md`Check with $x = 1$: the formula gives $2 + 1 - 1 = 2$, and directly $f(2) = 8 - 6 = 2$.`,
      ],
      answerMd: md`$f(-2) = 14$ and $f(x + 1) = 2x^2 + x - 1$. Writing $-2^2$ as $-4$ gives $f(-2) = -2$, a common wrong value.`,
    },
    {
      id: 'example-composition',
      title: 'Composition in both orders',
      problemMd: md`If $f(x) = 3x - 1$ and $g(x) = x^2 + 2$, find $f(g(2))$ and $g(f(2))$.`,
      steps: [
        md`$f(g(2))$: the inner function is $g$. $g(2) = 4 + 2 = 6$, then $f(6) = 18 - 1 = 17$.`,
        md`$g(f(2))$: the inner function is $f$. $f(2) = 6 - 1 = 5$, then $g(5) = 25 + 2 = 27$.`,
        md`Check with the general forms: $f(g(x)) = 3(x^2 + 2) - 1 = 3x^2 + 5$, which is $17$ at $x = 2$; $g(f(x)) = (3x - 1)^2 + 2$, which is $25 + 2 = 27$ at $x = 2$.`,
      ],
      answerMd: md`$f(g(2)) = 17$ and $g(f(2)) = 27$. Swapping the order is the usual slip, and the other value is likely to be offered.`,
    },
    {
      id: 'example-solve-input',
      title: 'Finding the input from the output',
      problemMd: md`If $f(x) = x^2 - 3x$ and $f(k) = 10$, what are the possible values of $k$?`,
      steps: [
        md`Substitute $k$ and set the result to 10: $k^2 - 3k = 10$.`,
        md`Make one side zero and factor: $k^2 - 3k - 10 = (k - 5)(k + 2) = 0$.`,
        md`So $k = 5$ or $k = -2$.`,
        md`Check: $f(5) = 25 - 15 = 10$ and $f(-2) = 4 + 6 = 10$.`,
      ],
      answerMd: md`$k = 5$ or $k = -2$. Stopping at $k = 5$ loses the negative input.`,
    },
    {
      id: 'example-symbol',
      title: 'An invented operation that is not associative',
      problemMd: md`For $a \neq b$, let $a \star b = \frac{a + b}{a - b}$. Find $(3 \star 1) \star 4$ and $3 \star (1 \star 4)$.`,
      steps: [
        md`Inner bracket first: $3 \star 1 = \frac{3 + 1}{3 - 1} = 2$. Then $2 \star 4 = \frac{6}{-2} = -3$.`,
        md`For the other grouping: $1 \star 4 = \frac{5}{-3} = -\frac{5}{3}$.`,
        md`Then $3 \star \left(-\frac{5}{3}\right) = \frac{3 - \frac{5}{3}}{3 + \frac{5}{3}} = \frac{\frac{4}{3}}{\frac{14}{3}} = \frac{4}{14} = \frac{2}{7}$.`,
      ],
      answerMd: md`$(3 \star 1) \star 4 = -3$ and $3 \star (1 \star 4) = \frac{2}{7}$. The grouping changes the result, so always follow the brackets as written.`,
    },
  ],
  traps: [
    {
      title: 'Substituting without brackets',
      md: md`For $g(x) = x^2 - 4x$, $g(-3)$ is $(-3)^2 - 4(-3) = 9 + 12 = 21$. Without brackets you may write $-9$ for the square or $-12$ for the second term. Put every substituted value in brackets.`,
    },
    {
      title: 'Treating $f(2x)$ as $2f(x)$',
      md: md`$f(2x)$ doubles the input; $2f(x)$ doubles the output. For $f(x) = 3x + 2$ they are $6x + 2$ and $6x + 4$. The same goes for $f(a + b)$, which is not $f(a) + f(b)$ in general.`,
    },
    {
      title: 'Composing in the wrong order',
      md: md`$f(g(x))$ applies $g$ first. Reading left to right and applying $f$ first gives $g(f(x))$, a different function.`,
    },
    {
      title: 'Assuming an invented operation is commutative',
      md: md`A new symbol has only the properties its definition gives it. Keep the inputs in their positions, and work innermost brackets first.`,
    },
  ],
  check: [
    {
      id: 'check-negative-input',
      title: 'Brackets around a negative',
      topic: 'Algebra',
      stemMd: md`If $g(x) = x^2 - 4x$, what is $g(-3)$?`,
      options: [
        { id: 'A', text: md`$-21$`, note: md`Takes $(-3)^2$ as $-9$ and also writes $-4(-3)$ as $-12$.` },
        { id: 'B', text: md`$-3$`, note: md`Squares correctly but writes $-4(-3)$ as $-12$ instead of $+12$.` },
        { id: 'C', text: md`$3$`, note: md`Takes $(-3)^2$ as $-9$; squaring a negative number gives a positive result.` },
        { id: 'D', text: md`$9$`, note: md`Evaluates only the squared term and drops $-4x$.` },
        { id: 'E', text: md`$21$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`$g(-3) = (-3)^2 - 4(-3) = 9 + 12 = 21$. Check with the factored form $g(x) = x(x - 4)$: $(-3)(-7) = 21$.`,
      lesson: 'Put every substituted value in brackets, especially a negative one.',
    },
    {
      id: 'check-double-input',
      title: 'Doubling the input or the output',
      topic: 'Quantitative Comparison',
      stemMd: md`$f(x) = 3x + 2$ for all numbers $x$.

| Quantity A | Quantity B |
| --- | --- |
| $f(2x)$ | $2f(x)$ |`,
      options: [
        { id: 'A', text: 'Quantity A is greater.', note: md`Doubling the input doubles only the $3x$ part; doubling the output doubles the constant too, so Quantity B is always 2 larger.` },
        { id: 'B', text: 'Quantity B is greater.', note: '' },
        { id: 'C', text: 'The two quantities are equal.', note: md`Assumes $f(2x) = 2f(x)$, which holds only for a rule with no constant term.` },
        { id: 'D', text: 'The relationship cannot be determined from the information given.', note: md`Both quantities change with $x$, but their difference is the constant 2, whatever $x$ is.` },
      ],
      answer: 'B',
      workingMd: md`$f(2x) = 3(2x) + 2 = 6x + 2$ and $2f(x) = 2(3x + 2) = 6x + 4$. Quantity B minus Quantity A is $2$ for every $x$. Check with $x = 0$: $f(0) = 2$ and $2f(0) = 4$.`,
      lesson: md`Write out $f(2x)$ and $2f(x)$ separately; they match only when the rule has no constant term.`,
    },
    {
      id: 'check-invented-operation',
      title: 'Follow the definition and the brackets',
      topic: 'Algebra',
      stemMd: md`For all numbers $a$ and $b$, let $a \# b = a^2 - 2b$. What is the value of $(2 \# 3) \# 1$?`,
      options: [
        { id: 'A', text: md`$-10$`, note: md`Groups the operation the other way, $2 \# (3 \# 1) = 2 \# 7 = 4 - 14$.` },
        { id: 'B', text: md`$-9$`, note: md`Swaps the roles of the inputs, using $b^2 - 2a$: $3^2 - 4 = 5$, then $1 - 10 = -9$.` },
        { id: 'C', text: md`$-6$`, note: md`Squares $-2$ as $-4$ in the second step; $(-2)^2 = 4$.` },
        { id: 'D', text: md`$-2$`, note: md`This is only the inner value $2 \# 3$; the operation still has to be applied with 1.` },
        { id: 'E', text: md`$2$`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Inner bracket: $2 \# 3 = 2^2 - 2(3) = 4 - 6 = -2$. Then $(-2) \# 1 = (-2)^2 - 2(1) = 4 - 2 = 2$.`,
      lesson: 'With an invented symbol, substitute by position, bracket negatives, and work the innermost brackets first.',
    },
  ],
  takeaways: [
    'A function is a rule; substitute the whole input, in brackets, for every $x$.',
    md`$f(x + 1)$, $f(x) + 1$, $f(2x)$ and $2f(x)$ are four different things.`,
    md`$f(g(x))$ applies $g$ first: work inside out.`,
    'An invented operation has only the properties its definition states.',
  ],
  practice: { examKey: 'gre', domain: 'quant-algebra', skill: 'alg-relations-functions-equations-inequalities' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
