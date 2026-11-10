import { md, type Lesson } from '../../types';

export const numbersAndDivisibilityLesson: Lesson = {
  slug: 'numbers-and-divisibility',
  title: 'Numbers and divisibility: factors, multiples and remainders',
  summary: 'Test divisibility at a glance, factorise into primes, find GCDs and LCMs, and work with remainders, all by hand and without a calculator.',
  minutes: 20,
  objectives: [
    'Test divisibility by 2, 3, 4, 5, 6, 8, 9 and 11 from the digits alone.',
    'Write a number as a product of primes and use it to count divisors and find a GCD or LCM.',
    'Find remainders of sums and products by working with the remainders only.',
  ],
  teachMd: md`
### Why number facts pay off without a calculator

Bocconi describes quantitative reasoning as numerical and logical problems using basic mathematics, and calculators are not allowed on the test. That makes number structure worth knowing well: if you can see that a number is divisible by 9, or that a remainder repeats, you skip long division entirely. This lesson collects the facts that do the most work.

### Divisibility from the digits

| Divisible by | Test |
| --- | --- |
| 2 | last digit even |
| 3 | sum of digits divisible by 3 |
| 4 | last two digits form a multiple of 4 |
| 5 | last digit 0 or 5 |
| 6 | divisible by 2 **and** by 3 |
| 8 | last three digits form a multiple of 8 |
| 9 | sum of digits divisible by 9 |
| 11 | alternating sum of digits (first minus second plus third…) divisible by 11 |

Take 7,452. Its digits add to $7 + 4 + 5 + 2 = 18$, so it is divisible by 9 (and so by 3). Its last two digits, 52, are a multiple of 4. Because 4 and 9 share no factor, 7,452 is divisible by $4 \times 9 = 36$; indeed $36 \times 207 = 7452$. The alternating sum $7 - 4 + 5 - 2 = 6$ is not a multiple of 11, so 11 does not divide it.

The step "4 and 9 share no factor" matters. A number divisible by 4 and by 6 need not be divisible by 24: 12 is a counterexample. Combine tests only for numbers with no common factor, or use the LCM (below).

### Prime factorisation is the master key

Every whole number greater than 1 is a product of primes in exactly one way. Split off small primes until nothing is left:
$$360 = 2 \times 180 = 2^2 \times 90 = 2^3 \times 45 = 2^3 \times 3^2 \times 5.$$
Remember that 1 is not prime and that 2 is the only even prime. Once a number is factorised, several questions become counting:

- **Number of positive divisors.** If $n = p^a q^b r^c$, a divisor picks each prime's power independently, from 0 up to its exponent, so there are $(a+1)(b+1)(c+1)$ divisors.
- **Perfect squares.** A number is a perfect square exactly when every exponent in its factorisation is even.
- **Divisibility.** $m$ divides $n$ when every prime power in $m$ also appears, at least as high, in $n$.

### GCD and LCM

The **greatest common divisor** takes each prime the two numbers share, at the *lower* power. The **least common multiple** takes every prime that appears in either, at the *higher* power. For $84 = 2^2 \times 3 \times 7$ and $120 = 2^3 \times 3 \times 5$:
$$\gcd = 2^2 \times 3 = 12, \qquad \text{lcm} = 2^3 \times 3 \times 5 \times 7 = 840.$$
For two numbers, $\gcd \times \text{lcm}$ equals their product: $12 \times 840 = 10\,080 = 84 \times 120$, a quick check on your work.

Word problems signal which one they want. "The largest equal groups", "the biggest tile that fits exactly" or "share without anything left over" ask for a GCD. "When will both happen together again" or "the smallest number divisible by both" ask for an LCM.

### Remainders

Dividing $n$ by $d$ gives $n = qd + r$ with $0 \le r < d$. A remainder is never negative and is always smaller than the divisor. The key fact for questions without a specific $n$: **in sums and products you may replace each number by its remainder**, then reduce again at the end. If $n$ leaves remainder 4 on division by 6, then $5n$ leaves the same remainder as $5 \times 4 = 20$, which is 2. The last digit of a number is its remainder on division by 10, which is why last-digit questions are remainder questions in disguise.

When a question describes $n$ only through a remainder, the fastest check is to pick the smallest number that fits, then a second one, and confirm that both give the same result.

### Odd, even and signs

Odd plus odd is even; odd times odd is odd; any product with an even factor is even. A product of numbers is negative when an odd number of them are negative. When a question says "number" rather than "integer", remember that 0, negatives and fractions are allowed, and test them before you trust a pattern.
`,
  examples: [
    {
      id: 'example-count-divisors',
      title: 'Counting the divisors of 360',
      problemMd: md`How many positive divisors does 360 have?`,
      steps: [
        md`Factorise: $360 = 2^3 \times 3^2 \times 5^1$.`,
        md`A divisor is $2^a 3^b 5^c$ with $a$ from 0 to 3 (4 choices), $b$ from 0 to 2 (3 choices) and $c$ from 0 to 1 (2 choices).`,
        md`The choices are independent, so multiply: $4 \times 3 \times 2 = 24$.`,
        md`Check by pairing divisors whose product is 360: $1 \cdot 360$, $2 \cdot 180$, $3 \cdot 120$, $4 \cdot 90$, $5 \cdot 72$, $6 \cdot 60$, $8 \cdot 45$, $9 \cdot 40$, $10 \cdot 36$, $12 \cdot 30$, $15 \cdot 24$, $18 \cdot 20$. That is 12 pairs, so 24 divisors.`,
      ],
      answerMd: md`360 has 24 positive divisors. Multiplying the exponents themselves ($3 \times 2 \times 1 = 6$) is the tempting slip: each exponent needs 1 added, because the power 0 is also a choice.`,
    },
    {
      id: 'example-lcm-schedule',
      title: 'When do two schedules meet again?',
      problemMd: md`One machine is serviced every 84 days and another every 120 days. Both were serviced today. After how many days will they next be serviced on the same day?`,
      steps: [
        md`"Next time together" asks for the least common multiple of 84 and 120.`,
        md`Factorise: $84 = 2^2 \times 3 \times 7$ and $120 = 2^3 \times 3 \times 5$.`,
        md`Take every prime at its highest power: $2^3 \times 3 \times 5 \times 7 = 8 \times 105 = 840$.`,
        md`Check with the GCD: $\gcd = 2^2 \times 3 = 12$, and $\frac{84 \times 120}{12} = 7 \times 120 = 840$.`,
      ],
      answerMd: md`After 840 days. Multiplying the two intervals ($84 \times 120 = 10\,080$) gives a common multiple, but not the least one.`,
    },
    {
      id: 'example-remainder-product',
      title: 'A remainder without knowing the number',
      problemMd: md`When the positive integer $n$ is divided by 6, the remainder is 4. What is the remainder when $5n$ is divided by 6? And when $n$ is divided by 3?`,
      steps: [
        md`Write $n = 6k + 4$ for some whole number $k$.`,
        md`Then $5n = 30k + 20$. The part $30k$ is a multiple of 6, so only 20 matters, and $20 = 3 \times 6 + 2$ leaves remainder 2.`,
        md`For division by 3: $6k$ is a multiple of 3, and 4 leaves remainder 1, so $n$ leaves remainder 1.`,
        md`Check with real numbers: $n = 4$ gives $5n = 20$, remainder 2; $n = 10$ gives $5n = 50 = 8 \times 6 + 2$, remainder 2. Both 4 and 10 leave remainder 1 on division by 3.`,
      ],
      answerMd: md`$5n$ leaves remainder 2 on division by 6, and $n$ leaves remainder 1 on division by 3. Answering 20 is the tempting error: a remainder must be smaller than the divisor, so reduce it.`,
    },
  ],
  traps: [
    {
      title: 'Multiplying divisibility tests that overlap',
      md: md`Divisible by 4 and by 6 does not mean divisible by 24: 12, 36 and 60 are all counterexamples. Divisible by both means divisible by their LCM, which is 12. Combine two tests by multiplying only when the divisors share no factor, such as 4 and 9, or 3 and 8.`,
    },
    {
      title: 'Forgetting the +1 when counting divisors',
      md: md`For $n = 2^3 \times 3^2$ the count is $(3+1)(2+1) = 12$, not $3 \times 2 = 6$. The power 0 is a legitimate choice for each prime, which is how divisors such as 1, 3 and 8 arise.`,
    },
    {
      title: 'Leaving a remainder too large',
      md: md`After adding or multiplying remainders you often get a number at least as large as the divisor, such as 20 when dividing by 6. Reduce it again: a remainder always lies between 0 and the divisor minus 1.`,
    },
    {
      title: 'Treating 1 as prime, or forgetting 2',
      md: md`1 is not prime, so it never appears in a factorisation. 2 is prime and the only even prime, which is why "the sum of two primes is even" fails when one of them is 2: $2 + 3 = 5$.`,
    },
  ],
  check: [
    {
      id: 'check-divisors-72',
      title: 'Divisors of 72',
      topic: 'Quantitative reasoning: number properties',
      stemMd: md`How many positive divisors does 72 have?`,
      options: [
        { id: 'A', text: md`5`, note: md`Counts the prime factors with repetition ($2, 2, 2, 3, 3$); that is the number of primes in the factorisation, not the number of divisors.` },
        { id: 'B', text: md`6`, note: md`Multiplies the exponents of $2^3 \times 3^2$ without adding 1 to each, so divisors that use the power 0, such as 1, 3 and 8, are missed.` },
        { id: 'C', text: md`7`, note: md`Adds $(3+1) + (2+1)$ instead of multiplying; the choice of power of 2 and the choice of power of 3 are independent, so the counts multiply.` },
        { id: 'D', text: md`12`, note: '' },
      ],
      answer: 'D',
      workingMd: md`$72 = 2^3 \times 3^2$, so the number of divisors is $(3+1)(2+1) = 12$. Listing them confirms it: 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72.`,
      lesson: 'Factorise, add 1 to each exponent, then multiply.',
    },
    {
      id: 'check-remainder-sum',
      title: 'Remainder of a sum',
      topic: 'Quantitative reasoning: number properties',
      stemMd: md`When the positive integer $n$ is divided by 6, the remainder is 5. What is the remainder when $n + 10$ is divided by 6?`,
      options: [
        { id: 'A', text: md`3`, note: '' },
        { id: 'B', text: md`4`, note: md`This is the remainder of 10 alone; the remainder 5 carried by $n$ has been dropped.` },
        { id: 'C', text: md`5`, note: md`Assumes adding 10 leaves the remainder unchanged; only adding a multiple of 6 does that.` },
        { id: 'D', text: md`15`, note: md`This is the sum of the two parts, $5 + 10$, before reducing; a remainder on division by 6 must be less than 6.` },
      ],
      answer: 'A',
      workingMd: md`Write $n = 6k + 5$. Then $n + 10 = 6k + 15 = 6(k + 2) + 3$, so the remainder is 3. Check: $n = 5$ gives $15 = 2 \times 6 + 3$; $n = 11$ gives $21 = 3 \times 6 + 3$.`,
      lesson: 'Replace each number by its remainder, combine, and reduce once more at the end.',
    },
    {
      id: 'check-gcd-packs',
      title: 'Making identical packs',
      topic: 'Quantitative reasoning: number properties',
      stemMd: md`A shop has 84 red pens and 126 blue pens. It wants to make identical packs, each with the same number of red pens and the same number of blue pens, using every pen. What is the largest number of packs it can make?`,
      options: [
        { id: 'A', text: md`14`, note: md`14 is $2 \times 7$, a common divisor, but it misses the factor 3 that 84 and 126 also share, so it is not the largest.` },
        { id: 'B', text: md`21`, note: md`21 is $3 \times 7$, a common divisor, but it misses the common factor 2, so a larger number of packs is possible.` },
        { id: 'C', text: md`42`, note: '' },
        { id: 'D', text: md`252`, note: md`252 is the least common multiple; with more packs than pens of either colour, some packs would get no red pen at all.` },
      ],
      answer: 'C',
      workingMd: md`The number of packs must divide both 84 and 126, and we want the largest, so it is the GCD. $84 = 2^2 \times 3 \times 7$ and $126 = 2 \times 3^2 \times 7$, so $\gcd = 2 \times 3 \times 7 = 42$. Each pack then holds $84 \div 42 = 2$ red and $126 \div 42 = 3$ blue pens.`,
      lesson: '"Largest equal groups with nothing left over" asks for a GCD; "next time together" asks for an LCM.',
    },
  ],
  takeaways: [
    'Digit tests settle divisibility by 2, 3, 4, 5, 6, 8, 9 and 11 without dividing.',
    md`If $n = p^a q^b$, it has $(a+1)(b+1)$ positive divisors.`,
    'GCD: shared primes at the lower power. LCM: all primes at the higher power.',
    'In sums and products, work with remainders, then reduce below the divisor.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-numbers-percentages' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
