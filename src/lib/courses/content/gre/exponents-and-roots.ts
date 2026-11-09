import { md, type Lesson } from '../../types';

export const exponentsLesson: Lesson = {
  slug: 'exponents-and-roots',
  title: 'Exponents and roots',
  summary: 'Use the exponent rules on a common base, simplify and combine square roots, and compare powers without working out huge numbers.',
  minutes: 20,
  objectives: [
    'Apply the product, quotient and power rules, including zero, negative and fractional exponents.',
    'Rewrite powers on a common base to simplify expressions and solve exponential equations.',
    'Simplify square roots and combine them correctly, knowing which operations roots respect.',
    'Compare powers and roots, including numbers between 0 and 1 and negative bases.',
  ],
  teachMd: md`
### The rules come from counting factors

$a^n$ means $n$ factors of $a$ multiplied together. Every exponent rule is a way of counting those factors.

| Rule | Why |
| --- | --- |
| $a^m \cdot a^n = a^{m+n}$ | $m$ factors and then $n$ more |
| $\frac{a^m}{a^n} = a^{m-n}$ | $n$ factors cancel |
| $(a^m)^n = a^{mn}$ | $n$ groups of $m$ factors |
| $(ab)^n = a^n b^n$ | each factor of $ab$ splits in two |
| $\left(\frac{a}{b}\right)^n = \frac{a^n}{b^n}$ | the same, for a quotient |

The quotient rule explains the definitions that look odd at first. $\frac{a^3}{a^3}$ is 1, and the rule gives $a^0$, so $a^0 = 1$ for any non-zero $a$. $\frac{a^2}{a^5} = \frac{1}{a^3}$, and the rule gives $a^{-3}$, so a negative exponent means a reciprocal: $2^{-3} = \frac{1}{8}$. A negative exponent never makes the number negative.

There is **no rule for sums**. $2^3 + 2^4$ is $8 + 16 = 24$, which is not a power of 2. What you can do is factor: $2^3 + 2^4 = 2^3(1 + 2) = 3 \cdot 2^3$. In the same way, $5^{10} + 5^{10} + 5^{10} + 5^{10} + 5^{10} = 5 \cdot 5^{10} = 5^{11}$.

### Work on a common base

Most exponent questions become easy once every power is written on the same base, usually a small prime. Learn the common ones: $4 = 2^2$, $8 = 2^3$, $16 = 2^4$, $32 = 2^5$, $9 = 3^2$, $27 = 3^3$, $81 = 3^4$, $25 = 5^2$, $125 = 5^3$.

With a common base you can simplify by adding and subtracting exponents, and you can solve equations: if $3^p = 3^q$ then $p = q$ (for a base other than 0, 1 and $-1$).

To **compare** two powers, make either the bases or the exponents match. $2^{30}$ and $3^{20}$ share a factor 10 in their exponents: $2^{30} = (2^3)^{10} = 8^{10}$ and $3^{20} = (3^2)^{10} = 9^{10}$, so $3^{20}$ is larger. No calculation of a ten-digit number is needed.

### Roots

$\sqrt{a}$ is the **non-negative** number whose square is $a$. So $\sqrt{25} = 5$, not $\pm 5$, even though the equation $x^2 = 25$ has the two solutions $5$ and $-5$. In the same spirit, $\sqrt{x^2} = |x|$.

Roots are fractional exponents: $\sqrt{a} = a^{1/2}$, $\sqrt[3]{a} = a^{1/3}$, and $a^{m/n} = \left(\sqrt[n]{a}\right)^m$. So $8^{2/3} = 2^2 = 4$, and $16^{-1/2} = \frac{1}{4}$.

Roots respect multiplication and division, but **not** addition:

$$\sqrt{ab} = \sqrt{a}\sqrt{b}, \qquad \sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}, \qquad \sqrt{a + b} \ne \sqrt{a} + \sqrt{b}$$

(for non-negative $a$ and $b$; the last inequality fails only when $a$ or $b$ is 0). A quick reminder: $\sqrt{9 + 16} = 5$, while $\sqrt{9} + \sqrt{16} = 7$.

To **simplify** a root, pull out the largest square factor: $\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt{2}$. Roots with the same radicand combine like terms: $3\sqrt{2} + 5\sqrt{2} = 8\sqrt{2}$, but $\sqrt{2} + \sqrt{3}$ does not simplify. To remove a root from a denominator, multiply top and bottom by it: $\frac{6}{\sqrt{3}} = \frac{6\sqrt{3}}{3} = 2\sqrt{3}$.

### Size: where the number sits matters

Raising a number to a power does not always make it bigger.

- For $x > 1$: $\sqrt{x} < x < x^2 < x^3$.
- For $0 < x < 1$: $x^3 < x^2 < x < \sqrt{x}$. Squaring $\frac{1}{2}$ gives $\frac{1}{4}$, smaller; its square root is about 0.71, larger.
- For $x = 0$ or $x = 1$, all of these are equal.
- For a negative base, even powers are positive and odd powers negative: $(-2)^4 = 16$, $(-2)^3 = -8$.

Watch the brackets: $-3^2$ means $-(3^2) = -9$, while $(-3)^2 = 9$.

These facts decide many comparison questions. When a stem says $0 < x < 1$, it is usually inviting you to assume powers grow; they shrink.

### Benchmarks worth knowing

Knowing $\sqrt{2} \approx 1.41$, $\sqrt{3} \approx 1.73$ and $\sqrt{5} \approx 2.24$, and the squares up to $15^2 = 225$, lets you estimate fast. The on-screen calculator in the Quantitative Reasoning section can check arithmetic, but the rules above are usually quicker than keying in long powers.
`,
  examples: [
    {
      id: 'example-common-base',
      title: 'Simplify on base 2',
      problemMd: md`Simplify $\dfrac{2^5 \cdot 4^3}{8^3}$.`,
      steps: [
        md`Rewrite every power on base 2: $4^3 = (2^2)^3 = 2^6$ and $8^3 = (2^3)^3 = 2^9$.`,
        md`Combine the exponents: $\frac{2^5 \cdot 2^6}{2^9} = 2^{5 + 6 - 9} = 2^2$.`,
        md`So the value is 4.`,
        md`Check with the actual numbers: $2^5 \cdot 4^3 = 32 \cdot 64 = 2048$ and $8^3 = 512$; $\frac{2048}{512} = 4$.`,
      ],
      answerMd: md`The expression equals 4. Treating the bases as if they could be combined directly, for example $\frac{2 \cdot 4}{8} = 1$ raised to some power, gives 1, which is wrong.`,
    },
    {
      id: 'example-exponential-equation',
      title: 'Solve by matching exponents',
      problemMd: md`Solve $3^{x+1} = 9^{x-2}$.`,
      steps: [
        md`Write 9 as $3^2$: $9^{x-2} = 3^{2(x-2)} = 3^{2x-4}$.`,
        md`With equal bases, the exponents must be equal: $x + 1 = 2x - 4$.`,
        md`Solve: $x = 5$.`,
        md`Check: $3^{6} = 729$ and $9^{3} = 729$.`,
      ],
      answerMd: md`$x = 5$. Forgetting to double the whole exponent, writing $3^{2x - 2}$, gives $x = 3$, which fails the check ($3^4 = 81$ but $9^1 = 9$).`,
    },
    {
      id: 'example-compare-powers',
      title: 'Which power is larger?',
      problemMd: md`Which is larger, $2^{30}$ or $3^{20}$?`,
      steps: [
        md`The exponents 30 and 20 share the factor 10, so make both exponents 10.`,
        md`$2^{30} = (2^3)^{10} = 8^{10}$ and $3^{20} = (3^2)^{10} = 9^{10}$.`,
        md`With equal positive exponents, the larger base wins: $9^{10} > 8^{10}$.`,
        md`A rough second route: $2^{10} \approx 10^3$, so $2^{30} \approx 10^9$; $3^{20} = (3^{10})^2$ and $3^{10} = 59\,049$, so $3^{20} \approx 3.5 \times 10^9$.`,
      ],
      answerMd: md`$3^{20}$ is larger. The larger exponent, 30, does not decide the comparison when the bases differ.`,
    },
    {
      id: 'example-combine-roots',
      title: 'Combining square roots',
      problemMd: md`Simplify $\sqrt{50} + \sqrt{18} - \sqrt{8}$.`,
      steps: [
        md`Pull the largest square factor out of each root: $\sqrt{50} = 5\sqrt{2}$, $\sqrt{18} = 3\sqrt{2}$, $\sqrt{8} = 2\sqrt{2}$.`,
        md`The roots now match, so combine the coefficients: $5 + 3 - 2 = 6$.`,
        md`Check with decimals: $7.071 + 4.243 - 2.828 = 8.486$, and $6\sqrt{2} \approx 8.485$.`,
      ],
      answerMd: md`The expression equals $6\sqrt{2}$. Combining under one root, $\sqrt{50 + 18 - 8} = \sqrt{60}$, is the tempting error: roots do not add.`,
    },
  ],
  traps: [
    {
      title: 'Adding powers as if they multiplied',
      md: md`$2^5 + 2^5 = 2 \cdot 2^5 = 2^6$, not $2^{10}$ and not $4^5$. Exponents add only when powers of the same base are **multiplied**. With a sum of equal powers, count the copies and factor.`,
    },
    {
      title: 'Splitting a root over a sum',
      md: md`$\sqrt{a + b}$ is not $\sqrt{a} + \sqrt{b}$, and $(a + b)^2$ is not $a^2 + b^2$. Both lose the cross term. Test with numbers ($\sqrt{9 + 16} = 5$, not 7) whenever you are unsure.`,
    },
    {
      title: 'Assuming powers make numbers bigger',
      md: md`For $0 < x < 1$, $x^2 < x$ and $\sqrt{x} > x$. For negative $x$, $x^3 < x$ when $x < -1$. A comparison stem that restricts $x$ to a range is usually testing exactly this.`,
    },
    {
      title: 'Giving two values for a square root',
      md: md`$\sqrt{49}$ is 7 only. The equation $x^2 = 49$ has two solutions, 7 and $-7$, but the symbol $\sqrt{\phantom{x}}$ always means the non-negative root.`,
    },
  ],
  check: [
    {
      id: 'check-sum-of-powers',
      title: 'Four equal powers',
      topic: 'Exponents',
      stemMd: md`$2^{10} + 2^{10} + 2^{10} + 2^{10} =$`,
      options: [
        { id: 'A', text: md`$2^{11}$`, note: md`This doubles $2^{10}$ once, which is the sum of only two of the four terms.` },
        { id: 'B', text: md`$2^{12}$`, note: '' },
        { id: 'C', text: md`$2^{40}$`, note: md`This would be the **product** of the four terms, $2^{10} \cdot 2^{10} \cdot 2^{10} \cdot 2^{10}$; adding them does not add exponents.` },
        { id: 'D', text: md`$8^{10}$`, note: md`This adds the bases, $2 + 2 + 2 + 2 = 8$, and keeps the exponent; bases do not add.` },
        { id: 'E', text: md`$8^{40}$`, note: md`This adds both the bases and the exponents; neither step is a valid rule.` },
      ],
      answer: 'B',
      workingMd: md`Four copies of $2^{10}$ is $4 \cdot 2^{10} = 2^2 \cdot 2^{10} = 2^{12}$. Check: $2^{10} = 1024$, four of them make $4096$, and $2^{12} = 4096$.`,
      lesson: 'A sum of equal powers is a count times one power; write the count as a power of the same base.',
    },
    {
      id: 'check-root-versus-square',
      title: 'Root against square below 1',
      topic: 'Quantitative Comparison',
      stemMd: md`$0 < x < 1$

| Quantity A | Quantity B |
| --- | --- |
| $\sqrt{x}$ | $x^2$ |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: '' },
        { id: 'B', text: md`Quantity B is greater.`, note: md`This carries over the habit that squares are larger than square roots, which holds only for $x > 1$.` },
        { id: 'C', text: md`The two quantities are equal.`, note: md`$\sqrt{x}$ and $x^2$ are equal only at $x = 0$ and $x = 1$, and the stem excludes both.` },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`A value such as $x = 4$ would reverse the order, but it lies outside the range the stem allows.` },
      ],
      answer: 'A',
      workingMd: md`For $0 < x < 1$, squaring shrinks a number and taking the square root enlarges it: $x^2 < x < \sqrt{x}$. Check with $x = \frac{1}{4}$: $\sqrt{x} = \frac{1}{2}$ and $x^2 = \frac{1}{16}$. With $x = 0.81$: $\sqrt{x} = 0.9$ and $x^2 = 0.6561$.`,
      lesson: 'Between 0 and 1, higher powers are smaller and roots are larger.',
    },
    {
      id: 'check-square-of-root-sum',
      title: 'Squaring a sum of roots',
      topic: 'Roots',
      stemMd: md`$\left(\sqrt{12} + \sqrt{27}\right)^2 =$`,
      options: [
        { id: 'A', text: md`15`, note: md`This squares the $\sqrt{3}$ in $5\sqrt{3}$ but not the 5: $(5\sqrt{3})^2 = 25 \cdot 3$, not $5 \cdot 3$.` },
        { id: 'B', text: md`39`, note: md`This squares each root separately, $12 + 27$, and drops the cross term $2\sqrt{12}\sqrt{27}$.` },
        { id: 'C', text: md`57`, note: md`This includes the cross term $\sqrt{12 \cdot 27} = 18$ only once; in $(a + b)^2$ it appears twice.` },
        { id: 'D', text: md`75`, note: '' },
        { id: 'E', text: md`81`, note: md`This rounds $\sqrt{12} + \sqrt{27} \approx 8.66$ up to 9 before squaring; the exact value is $5\sqrt{3}$.` },
      ],
      answer: 'D',
      workingMd: md`Simplify first: $\sqrt{12} = 2\sqrt{3}$ and $\sqrt{27} = 3\sqrt{3}$, so the sum is $5\sqrt{3}$ and its square is $25 \cdot 3 = 75$. Second route: $(a + b)^2 = a^2 + 2ab + b^2 = 12 + 2\sqrt{324} + 27 = 12 + 36 + 27 = 75$.`,
      lesson: 'Simplify roots to a common radicand before squaring, or expand with the cross term counted twice.',
    },
  ],
  takeaways: [
    'Exponents add when powers of one base multiply; sums of powers have no exponent rule, only factoring.',
    md`$a^0 = 1$, $a^{-n} = \frac{1}{a^n}$, and $a^{1/n}$ is the $n$th root.`,
    'Rewrite powers on a common base, or with a common exponent, to simplify, solve and compare.',
    md`$\sqrt{ab} = \sqrt{a}\sqrt{b}$, but a root never splits over a sum.`,
    'Between 0 and 1, squaring shrinks a number and rooting enlarges it.',
  ],
  practice: { examKey: 'gre', domain: 'quant-arithmetic', skill: 'arith-operations-exponents-roots' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
