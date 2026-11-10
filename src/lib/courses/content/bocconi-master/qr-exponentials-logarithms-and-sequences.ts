import { md, type Lesson } from '../../types';

export const exponentialsLogarithmsAndSequencesLesson: Lesson = {
  slug: 'exponentials-logarithms-and-sequences',
  title: 'Exponentials, logarithms and sequences',
  summary: 'Solve growth and half-life problems by matching powers, apply log rules with a domain check, and sum arithmetic and geometric sequences.',
  minutes: 25,
  objectives: [
    'Model doubling and half-life, and solve exponential equations by hand by writing both sides as powers of one base.',
    'Use the product, quotient and power rules for logarithms, and reject any root that falls outside the domain.',
    'Find terms and sums of arithmetic and geometric sequences, including an infinite geometric sum.',
    'Turn a recursive rule such as "double and add one" into a formula for any term.',
  ],
  teachMd: md`
### Growth by a constant factor

A quantity that doubles every $T$ units of time is multiplied by 2 once per period, and $\frac{t}{T}$ counts the periods. Starting from $N_0$,
$$N(t) = N_0 \cdot 2^{t/T}.$$
A half-life works the same way with a factor of $\frac{1}{2}$: $N(t) = N_0 \cdot \left(\frac{1}{2}\right)^{t/T}$. Any constant factor fits this pattern; growth of 5% per period multiplies by 1.05 each time, as in [percentages and successive changes](/courses/bocconi-master/percentages-and-successive-changes).

The usual question gives the start and the end and asks how long. **Divide first**, so that only the growth factor is left, then write it as a power. If active users double every 3 months, growing from 5,000 to 160,000 takes
$$\frac{160\,000}{5\,000} = 32 = 2^5 \quad\Longrightarrow\quad \frac{t}{3} = 5 \quad\Longrightarrow\quad t = 15 \text{ months}.$$
The exponent, 5, is the number of doublings; the ratio, 32, is not a time at all. Halving runs the other way: 400 mg of a substance with a half-life of 6 hours becomes $400 \cdot \left(\frac{1}{2}\right)^{24/6} = \frac{400}{16} = 25$ mg after 24 hours.

### Solving by matching powers

Calculators are not allowed on the test, so you cannot take the logarithm of an awkward number. The hand method is to write both sides as powers of one base and compare exponents: if $a^x = a^y$ with $a > 0$ and $a \ne 1$, then $x = y$. The exponent rules do the rewriting:

| Rule | Example |
| --- | --- |
| $a^m \cdot a^n = a^{m+n}$ | $2^3 \cdot 2^4 = 2^7$ |
| $(a^m)^n = a^{mn}$ | $8^x = (2^3)^x = 2^{3x}$ |
| $a^{-n} = \frac{1}{a^n}$ | $\frac{1}{9} = 3^{-2}$ |
| $a^{1/n} = \sqrt[n]{a}$ | $27^{1/3} = 3$ |

So $9^{x+1} = 27^x$ becomes $3^{2x+2} = 3^{3x}$, giving $2x + 2 = 3x$ and $x = 2$. Check: $9^3 = 729 = 27^2$. A few powers known by heart make the rewriting quick: $2^{10} = 1024$, $3^4 = 81$, $3^5 = 243$, $5^4 = 625$.

### Logarithms are exponents

$\log_a y = x$ means exactly $a^x = y$. So $\log_2 32 = 5$, $\log_{10} 1000 = 3$ and $\log_3 \frac{1}{9} = -2$. Because a log is an exponent, each exponent rule becomes a log rule:

- **Product:** $\log_a (xy) = \log_a x + \log_a y$.
- **Quotient:** $\log_a \frac{x}{y} = \log_a x - \log_a y$.
- **Power:** $\log_a (x^k) = k \log_a x$.
- **Special values:** $\log_a a = 1$ and $\log_a 1 = 0$.

The rules let awkward logs combine into whole numbers: $\log_6 4 + \log_6 9 = \log_6 36 = 2$, and $\log_2 48 - \log_2 3 = \log_2 16 = 4$. To change base, divide: $\log_a b = \frac{\log_c b}{\log_c a}$, so $\log_4 8 = \frac{\log_2 8}{\log_2 4} = \frac{3}{2}$. There is no rule for $\log_a (x + y)$: the log of a sum does not split.

### Domain first, then solve, then check

$\log_a y$ exists only when $y > 0$. Combining logs can hide this, so write the domain down before you start. In
$$\log_2 x + \log_2 (x - 6) = 4,$$
both arguments must be positive, so $x > 6$. The product rule gives $\log_2 \big(x(x - 6)\big) = 4$, so $x^2 - 6x = 2^4 = 16$, and $(x - 8)(x + 2) = 0$. The combined log also exists at $x = -2$, where $x(x - 6) = 16$ is positive, but the original logs do not, so $-2$ is rejected. Only $x = 8$ remains: $\log_2 8 + \log_2 2 = 3 + 1 = 4$.

### Arithmetic sequences: add the same step

In 7, 11, 15, 19, … each term adds the same difference, $d = 4$. Reaching the $n$-th term takes $n - 1$ steps, not $n$:
$$a_n = a_1 + (n - 1)d.$$
For the sum, pair the first term with the last, the second with the second-last, and so on. Every pair has the same total, and $n$ terms make $\frac{n}{2}$ pairs (when $n$ is odd, the middle term on its own is worth half a pair):
$$S_n = \frac{n}{2}(a_1 + a_n).$$
The integers from 1 to 100 add to $50 \times 101 = 5050$. To count the terms of a list such as 12, 15, …, 99, count the steps and add one: $\frac{99 - 12}{3} + 1 = 30$.

### Geometric sequences: multiply by the same ratio

In 5, 15, 45, 135, … each term multiplies by the same ratio, $r = 3$. In general
$$a_n = a_1 r^{n-1}, \qquad S_n = a_1 \cdot \frac{1 - r^n}{1 - r} \quad (r \ne 1).$$
The sum formula comes from subtracting $rS_n$ from $S_n$: every middle term cancels, leaving $a_1 - a_1 r^n$. Check: $5 + 15 + 45 + 135 = 200$, and $5 \cdot \frac{1 - 81}{1 - 3} = 5 \cdot 40 = 200$.

When $|r| < 1$, the power $r^n$ shrinks towards 0, so the sum of infinitely many terms settles at
$$S_\infty = \frac{a_1}{1 - r}.$$
For $12 + 6 + 3 + 1.5 + \cdots$, $r = \frac{1}{2}$ and $S_\infty = \frac{12}{1 - \frac{1}{2}} = 24$. When $|r| \ge 1$ the terms never shrink and there is no finite sum. A geometric sequence is exponential growth recorded once per period: a quantity that doubles each period, measured at the end of each one, is a geometric sequence with $r = 2$.

### Recursive rules

Some sequences give each term from the one before. When the rule mixes multiplying and adding, look for a constant that turns it into a pure geometric sequence. With $a_{n+1} = 3a_n - 2$ and $a_1 = 4$, the terms are 4, 10, 28, 82, …; subtracting 1 from each gives 3, 9, 27, 81, the powers of 3, so $a_n = 3^n + 1$. The differences of such a sequence (6, 18, 54) are geometric too, which is another way to spot it.
`,
  examples: [
    {
      id: 'example-half-life',
      title: 'How long until 30 mg remain?',
      problemMd: md`The amount of a medicine in a patient's blood halves every 5 hours. At 08:00 there are 480 mg. At what time are 30 mg left?`,
      steps: [
        md`Divide the end by the start to isolate the factor: $\frac{30}{480} = \frac{1}{16}$.`,
        md`Write it as a power of the halving factor: $\frac{1}{16} = \left(\frac{1}{2}\right)^4$, so 4 half-lives pass.`,
        md`Each half-life is 5 hours: $4 \times 5 = 20$ hours after 08:00, which is 04:00 the next day.`,
        md`Check by halving: 480, 240, 120, 60 and 30 mg at 08:00, 13:00, 18:00, 23:00 and 04:00. That is five amounts but only four halvings.`,
      ],
      answerMd: md`04:00 the next day, 20 hours later. Counting the five amounts as five half-lives gives 25 hours, and using the ratio 16 as the number of half-lives gives 80 hours.`,
    },
    {
      id: 'example-log-domain',
      title: 'A root the domain rejects',
      problemMd: md`Solve $\log_2 (x + 2) + \log_2 (x - 2) = 5$.`,
      steps: [
        md`Domain first: both arguments must be positive, so $x > -2$ and $x > 2$, which together mean $x > 2$.`,
        md`Product rule: $\log_2 \big((x + 2)(x - 2)\big) = 5$, so $x^2 - 4 = 2^5 = 32$.`,
        md`Then $x^2 = 36$, so $x = 6$ or $x = -6$.`,
        md`Reject $x = -6$: it makes both arguments negative ($-4$ and $-8$), so neither original log exists, even though their product, 32, is positive. Check $x = 6$: $\log_2 8 + \log_2 4 = 3 + 2 = 5$.`,
      ],
      answerMd: md`$x = 6$ only. Answering $x = \pm 6$ keeps a root that the combined equation allows but the original equation does not.`,
    },
    {
      id: 'example-arithmetic-savings',
      title: 'Savings that grow by a fixed amount',
      problemMd: md`A graduate saves €200 in the first month and, in each later month, €30 more than in the month before. How much does she save in month 12, and how much in total over the first 12 months?`,
      steps: [
        md`This is an arithmetic sequence with $a_1 = 200$ and $d = 30$. Month 12 is 11 steps after month 1: $a_{12} = 200 + 11 \times 30 = 530$.`,
        md`Sum by pairing the first and last months: $S_{12} = \frac{12}{2}(200 + 530) = 6 \times 730 = 4\,380$.`,
        md`Check another way: twelve base amounts of 200 make 2,400, and the extras are $30 \times (0 + 1 + \cdots + 11) = 30 \times 66 = 1\,980$; $2\,400 + 1\,980 = 4\,380$.`,
      ],
      answerMd: md`€530 in month 12 and €4,380 in total. Taking 12 steps instead of 11 gives €560 for month 12 and €4,560 for the total.`,
    },
    {
      id: 'example-recursive-sequence',
      title: 'Double and add one',
      problemMd: md`Find the next term of 3, 7, 15, 31, 63, …, and then the 10th term.`,
      steps: [
        md`Look at the differences: 4, 8, 16, 32. They double, so the next difference is 64 and the next term is $63 + 64 = 127$.`,
        md`Name the rule: each term is twice the one before plus 1, since $2 \times 3 + 1 = 7$, $2 \times 7 + 1 = 15$, and $2 \times 63 + 1 = 127$.`,
        md`Add 1 to every term: 4, 8, 16, 32, 64 are $2^2, 2^3, \ldots, 2^6$, so the $n$-th term is $a_n = 2^{n+1} - 1$.`,
        md`Then $a_{10} = 2^{11} - 1 = 2048 - 1 = 2047$. Check the formula on known terms: $a_1 = 2^2 - 1 = 3$ and $a_5 = 2^6 - 1 = 63$.`,
      ],
      answerMd: md`The next term is 127 and the 10th term is 2,047. Writing $a_n = 2^n - 1$ gives 1,023 for the 10th term; that formula fails the first term, since $2^1 - 1 = 1$, not 3.`,
    },
  ],
  traps: [
    {
      title: 'Using the ratio as the number of periods',
      md: md`Growth from 5,000 to 160,000 is a factor of 32, but 32 is not a time. Write the factor as a power of the growth factor, $32 = 2^5$, and the exponent counts the periods. Then multiply by the length of one period.`,
    },
    {
      title: 'Counting values instead of steps',
      md: md`From the first term to the $n$-th there are $n - 1$ steps, which is why $a_n = a_1 + (n - 1)d$ and $a_n = a_1 r^{n-1}$. In the same way, five amounts in a halving list are four half-lives. Check a formula on the first term before trusting it.`,
    },
    {
      title: 'Splitting the log of a sum',
      md: md`$\log (x + y)$ is not $\log x + \log y$; the product rule says $\log x + \log y = \log (xy)$. Likewise $2 \log x$ is $\log (x^2)$, not $\log (2x)$. Rewrite only with the three rules, exactly as stated.`,
    },
    {
      title: 'Keeping a root outside the domain',
      md: md`Combining logs can admit values at which the original logs do not exist, because a product or square of negatives is positive. Write the domain first, and test every root in the original equation.`,
    },
    {
      title: 'Using the infinite sum when it does not exist',
      md: md`$\frac{a_1}{1 - r}$ works only for $|r| < 1$. Applied to $3 + 6 + 12 + \cdots$ it gives $\frac{3}{1 - 2} = -3$, a negative total for positive terms. If the terms do not shrink, there is no finite sum.`,
    },
  ],
  check: [
    {
      id: 'check-tripling-culture',
      title: 'A culture that triples',
      topic: 'Quantitative reasoning: exponential growth',
      stemMd: md`A culture of 2,000 cells triples every 4 hours. How many hours does it take to grow to 162,000 cells?`,
      options: [
        { id: 'A', text: md`4`, note: md`This is the number of tripling periods, since $81 = 3^4$; each period lasts 4 hours.` },
        { id: 'B', text: md`16`, note: '' },
        { id: 'C', text: md`20`, note: md`Counts the five amounts 2,000, 6,000, 18,000, 54,000 and 162,000 as five periods; there are only four steps between them.` },
        { id: 'D', text: md`160`, note: md`Treats the growth as linear, adding the first period's 4,000 cells every 4 hours; the culture multiplies by 3 each period instead.` },
      ],
      answer: 'B',
      workingMd: md`Divide end by start: $\frac{162\,000}{2\,000} = 81 = 3^4$. So $\frac{t}{4} = 4$ and $t = 16$ hours. Check: 2,000, 6,000, 18,000, 54,000 and 162,000 cells at 0, 4, 8, 12 and 16 hours.`,
      lesson: 'Divide the end by the start, write the factor as a power, and multiply the exponent by the length of one period.',
    },
    {
      id: 'check-log-equation',
      title: 'A logarithmic equation',
      topic: 'Quantitative reasoning: logarithms',
      stemMd: md`Which values of $x$ satisfy $2 \log_2 x - \log_2 (x + 4) = 1$?`,
      options: [
        { id: 'A', text: md`$x = -2$ or $x = 4$`, note: md`Keeps $x = -2$, but $\log_2 (-2)$ does not exist; the combined form $\log_2 \frac{x^2}{x + 4}$ hides this because $x^2$ is positive.` },
        { id: 'B', text: md`$x = 3$`, note: md`Subtracts the arguments instead of dividing them, solving $x^2 - (x + 4) = 2$; the quotient rule gives $\frac{x^2}{x + 4} = 2$.` },
        { id: 'C', text: md`$x = 4$`, note: '' },
        { id: 'D', text: md`No real solution`, note: md`Turns $2 \log_2 x$ into $\log_2 (2x)$ instead of $\log_2 (x^2)$; then $\frac{2x}{x + 4} = 2$ has no solution, but the power rule gives a different equation.` },
      ],
      answer: 'C',
      workingMd: md`Domain: $x > 0$. Power rule, then quotient rule: $\log_2 \frac{x^2}{x + 4} = 1$, so $\frac{x^2}{x + 4} = 2$ and $x^2 - 2x - 8 = 0$, which factorises as $(x - 4)(x + 2) = 0$. Reject $x = -2$, which is outside the domain. Check $x = 4$: $2 \log_2 4 - \log_2 8 = 4 - 3 = 1$.`,
      lesson: 'Apply the power and quotient rules exactly, then reject any root that makes an original argument zero or negative.',
    },
    {
      id: 'check-bouncing-ball',
      title: 'A bouncing ball',
      topic: 'Quantitative reasoning: sequences',
      stemMd: md`A ball is dropped from a height of 9 m. After each bounce it rises to $\frac{2}{3}$ of the height it last fell from. Treating the bounces as going on for ever, what total vertical distance does the ball travel?`,
      options: [
        { id: 'A', text: md`27 m`, note: md`Sums $9 + 6 + 4 + \cdots = \frac{9}{1 - \frac{2}{3}}$ once; after the first drop, the ball travels every height twice, up and then down.` },
        { id: 'B', text: md`45 m`, note: '' },
        { id: 'C', text: md`54 m`, note: md`Doubles the whole series, $2 \times 27$, which counts the first 9 m twice; the ball falls that distance but never rises it.` },
        { id: 'D', text: md`There is no finite total`, note: md`Infinitely many bounces do not mean an infinite distance: each height is $\frac{2}{3}$ of the one before, and with $|r| < 1$ the sum is finite.` },
      ],
      answer: 'B',
      workingMd: md`The first drop is 9 m. The bounce heights 6, 4, $\frac{8}{3}$, … form a geometric sequence with $a_1 = 6$ and $r = \frac{2}{3}$, summing to $\frac{6}{1 - \frac{2}{3}} = 18$, and each is travelled up and down. Total: $9 + 2 \times 18 = 45$ m. Check: doubling $9 + 6 + 4 + \cdots = 27$ gives 54, which counts the first drop twice, and $54 - 9 = 45$.`,
      lesson: md`Split the path into the pieces actually travelled, then sum each geometric piece with $\frac{a_1}{1 - r}$.`,
    },
  ],
  takeaways: [
    'For growth or decay, divide the end by the start, write the factor as a power, and read the number of periods from the exponent.',
    md`A logarithm is an exponent: $\log_a y = x$ means $a^x = y$.`,
    'Write the domain before solving a log equation, and reject any root outside it.',
    md`Arithmetic: $a_n = a_1 + (n - 1)d$ and $S_n = \frac{n}{2}(a_1 + a_n)$. Geometric: $a_n = a_1 r^{n-1}$, and for $|r| < 1$, $S_\infty = \frac{a_1}{1 - r}$.`,
    'For a rule that mixes multiplying and adding, shift every term by a constant to reveal a geometric sequence.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-algebra-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
