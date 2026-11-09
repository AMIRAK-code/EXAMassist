import { md, type Lesson } from '../../types';

export const integersLesson: Lesson = {
  slug: 'integers-divisibility-and-primes',
  title: 'Integers, divisibility and primes',
  summary: 'Break any integer into primes, then use the factorisation to count divisors, find the GCD and LCM, and decide what must divide a number.',
  minutes: 20,
  objectives: [
    'Test divisibility by 2, 3, 4, 5, 6, 8, 9 and 10 without dividing.',
    'Write the prime factorisation of an integer and use it to count its positive divisors.',
    'Find the greatest common divisor and least common multiple of two integers from their factorisations.',
    'Decide what must, and what need not, divide an integer described only by its divisors.',
  ],
  teachMd: md`
### Factors, multiples and divisibility

An integer $d$ **divides** $n$ when $n = dk$ for some integer $k$. Then $d$ is a **factor** (or divisor) of $n$, and $n$ is a **multiple** of $d$. The words describe one relationship from two sides: 6 is a factor of 42, and 42 is a multiple of 6.

Two edge cases are worth fixing in memory. Every integer divides 0, because $0 = d \times 0$. And 1 divides everything, while every non-zero integer divides itself. Questions about factors usually mean positive factors, but read the stem: negative integers are factors too, since $42 = (-6)(-7)$.

### Divisibility rules worth knowing

| Divisor | Test |
| --- | --- |
| 2 | last digit even |
| 3 | sum of digits divisible by 3 |
| 4 | last two digits form a multiple of 4 |
| 5 | last digit 0 or 5 |
| 6 | divisible by both 2 and 3 |
| 8 | last three digits form a multiple of 8 |
| 9 | sum of digits divisible by 9 |
| 10 | last digit 0 |

The rules for 3 and 9 work because $10 \equiv 1$ when you divide by 3 or 9: every power of 10 leaves remainder 1, so a number leaves the same remainder as the sum of its digits. For example, 7,128 has digit sum 18, so it is divisible by 9 (and by 3); its last two digits, 28, make it divisible by 4.

### Primes and prime factorisation

A **prime** is an integer greater than 1 whose only positive divisors are 1 and itself: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, … Two facts trip people up. **1 is not prime**, and **2 is the only even prime**.

Every integer greater than 1 can be written as a product of primes in exactly one way, apart from order. Build the factorisation with a factor tree, splitting off small primes first:

$$360 = 36 \times 10 = (2^2 \times 3^2)(2 \times 5) = 2^3 \times 3^2 \times 5$$

To check whether a number is prime, you only need to try primes up to its square root. For 151, $\sqrt{151}$ is a little above 12, so you try 2, 3, 5, 7 and 11; none divides 151, so 151 is prime.

### Reading the factorisation

The factorisation is a complete description of the number, and most integer questions are answered by reading it.

**Divisors.** A positive divisor of $2^3 \times 3^2 \times 5$ chooses an exponent for each prime: 0 to 3 for the 2, 0 to 2 for the 3, 0 to 1 for the 5. That gives $(3+1)(2+1)(1+1) = 24$ divisors. In general, if $n = p^a q^b r^c$, then $n$ has $(a+1)(b+1)(c+1)$ positive divisors. The "+1" counts the choice of leaving that prime out.

**Divides.** $d$ divides $n$ exactly when every prime in $d$ appears in $n$ at least as many times. So $12 = 2^2 \times 3$ divides 360, but $27 = 3^3$ does not, because 360 has only two 3s.

**Perfect squares and cubes.** A perfect square has every exponent even; a perfect cube has every exponent a multiple of 3.

### Greatest common divisor and least common multiple

Line the two factorisations up prime by prime.

- The **GCD** takes each shared prime with the **smaller** exponent.
- The **LCM** takes every prime that appears in either number, with the **larger** exponent.

For two positive integers, $\gcd(a, b) \times \operatorname{lcm}(a, b) = a \times b$, which gives a quick check on your work.

The LCM answers a whole family of questions: if $n$ is divisible by both $a$ and $b$, then $n$ is divisible by $\operatorname{lcm}(a, b)$, and by nothing larger that you can be sure of. Divisible by 4 and by 6 guarantees divisibility by 12, not by 24, because 4 and 6 share a factor of 2 that the product counts twice.

### Testing "must be" claims

Many integer questions ask what **must** be true. Prove a "must" with the factorisation; disprove it with one counterexample, usually the smallest number that fits the facts. For "divisible by 4 and 6", try $n = 12$: anything that fails for 12 is not a "must".
`,
  examples: [
    {
      id: 'example-count-divisors',
      title: 'How many divisors?',
      problemMd: md`How many positive divisors does 360 have?`,
      steps: [
        md`Factorise: $360 = 8 \times 45 = 2^3 \times 3^2 \times 5$.`,
        md`Each divisor picks an exponent for every prime: 4 choices for the 2 (0 to 3), 3 for the 3 (0 to 2) and 2 for the 5 (0 or 1).`,
        md`Multiply the numbers of choices: $4 \times 3 \times 2 = 24$.`,
        md`Check by pairing: the divisors pair up as $1 \times 360$, $2 \times 180$, $3 \times 120$, $4 \times 90$, $5 \times 72$, $6 \times 60$, $8 \times 45$, $9 \times 40$, $10 \times 36$, $12 \times 30$, $15 \times 24$, $18 \times 20$. That is 12 pairs, so 24 divisors.`,
      ],
      answerMd: md`360 has 24 positive divisors. Multiplying the exponents themselves ($3 \times 2 \times 1 = 6$) is the tempting slip; it forgets that each prime can also be left out.`,
    },
    {
      id: 'example-gcd-lcm',
      title: 'GCD and LCM side by side',
      problemMd: md`Find the greatest common divisor and the least common multiple of 84 and 120.`,
      steps: [
        md`Factorise both: $84 = 2^2 \times 3 \times 7$ and $120 = 2^3 \times 3 \times 5$.`,
        md`GCD: shared primes with the smaller exponent. The shared primes are 2 and 3, so the GCD is $2^2 \times 3 = 12$.`,
        md`LCM: every prime with the larger exponent: $2^3 \times 3 \times 5 \times 7 = 840$.`,
        md`Check with the product rule: $12 \times 840 = 10\,080$ and $84 \times 120 = 10\,080$.`,
      ],
      answerMd: md`The GCD is 12 and the LCM is 840. The product $84 \times 120 = 10\,080$ is a common multiple, but not the least one.`,
    },
    {
      id: 'example-perfect-square',
      title: 'Making a perfect square',
      problemMd: md`What is the smallest positive integer $k$ for which $150k$ is a perfect square?`,
      steps: [
        md`Factorise: $150 = 2 \times 3 \times 5^2$.`,
        md`A perfect square needs every exponent even. The 5 already has exponent 2; the 2 and the 3 each have exponent 1, so each needs one more copy.`,
        md`The smallest $k$ supplies exactly those copies: $k = 2 \times 3 = 6$.`,
        md`Check: $150 \times 6 = 900 = 30^2$.`,
      ],
      answerMd: md`$k = 6$. Choosing $k = 150$ also makes a perfect square ($150^2$), but it is not the smallest.`,
    },
  ],
  traps: [
    {
      title: 'Counting 1 as a prime',
      md: md`1 has only one positive divisor, so it is not prime (and not composite either). A question asking for "the number of primes less than 20" wants 2, 3, 5, 7, 11, 13, 17, 19: eight, not nine. Equally, do not forget 2, the only even prime.`,
    },
    {
      title: 'Multiplying two divisors to get a guaranteed divisor',
      md: md`If $n$ is divisible by 4 and by 6, it need not be divisible by 24: $n = 12$ is a counterexample. Only the LCM is guaranteed. The product works only when the two numbers share no prime factor, as with 4 and 9.`,
    },
    {
      title: 'Multiplying exponents instead of exponents plus one',
      md: md`For $n = 2^3 \times 3^2 \times 5$, the divisor count is $(3+1)(2+1)(1+1) = 24$, not $3 \times 2 \times 1 = 6$. The exponent 0 is a real choice: it is how you get divisors such as 1, 3 and 9 that leave out the 2.`,
    },
    {
      title: 'Proving a "must" with one example',
      md: md`One number that works shows a statement *can* be true, not that it *must* be. Use examples to break claims and the factorisation to prove them. If the stem fixes nothing but divisibility, start with the smallest number that fits, usually the LCM.`,
    },
  ],
  check: [
    {
      id: 'check-divisors-540',
      title: 'Divisors of 540',
      topic: 'Integer properties',
      stemMd: md`How many positive divisors does 540 have?`,
      options: [
        { id: 'A', text: md`6`, note: md`This multiplies the exponents of $540 = 2^2 \times 3^3 \times 5$ without adding 1 to each, so it never lets a prime be left out.` },
        { id: 'B', text: md`9`, note: md`This adds the counts $3 + 4 + 2$ instead of multiplying them; each divisor makes one choice for every prime at once.` },
        { id: 'C', text: md`12`, note: md`This is the number of divisor pairs, such as $1 \times 540$ and $2 \times 270$; each pair holds two divisors.` },
        { id: 'D', text: md`16`, note: md`This counts only the even divisors, those that use the 2 at least once: $2 \times 4 \times 2$.` },
        { id: 'E', text: md`24`, note: '' },
      ],
      answer: 'E',
      workingMd: md`$540 = 4 \times 135 = 2^2 \times 3^3 \times 5$. The number of positive divisors is $(2+1)(3+1)(1+1) = 3 \times 4 \times 2 = 24$. Check: there are 8 odd divisors ($4 \times 2$, the divisors of 135) and 16 even ones, and $8 + 16 = 24$.`,
      lesson: 'Factorise, add 1 to each exponent, and multiply.',
    },
    {
      id: 'check-multiple-of-4-and-6',
      title: 'A multiple of 4 and 6',
      topic: 'Quantitative Comparison',
      stemMd: md`$n$ is a positive integer that is a multiple of both 4 and 6.

| Quantity A | Quantity B |
| --- | --- |
| $n$ | 24 |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: md`True for $n = 36$ or $n = 48$, but $n = 12$ is a multiple of both 4 and 6 and is less than 24.` },
        { id: 'B', text: md`Quantity B is greater.`, note: md`True only for $n = 12$, the least common multiple; larger multiples of 12, such as 36, are also allowed.` },
        { id: 'C', text: md`The two quantities are equal.`, note: md`This takes $n$ to be the product $4 \times 6$. The product is one common multiple, but not the only one, and not the least.` },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`$4 = 2^2$ and $6 = 2 \times 3$, so $\operatorname{lcm}(4, 6) = 2^2 \times 3 = 12$, and $n$ can be any positive multiple of 12. With $n = 12$, Quantity B is greater; with $n = 24$ they are equal; with $n = 36$, Quantity A is greater. Different allowed values give different results.`,
      lesson: 'Divisible by two numbers means divisible by their LCM; list a few multiples of the LCM before you compare.',
    },
    {
      id: 'check-must-divide',
      title: 'What must divide n?',
      topic: 'Integer properties',
      stemMd: md`If $n$ is a positive integer divisible by both 6 and 8, which of the following must also divide $n$?`,
      options: [
        { id: 'A', text: md`16`, note: md`$n = 24$ is divisible by 6 and 8 but not by 16; $n$ is only guaranteed three factors of 2, not four.` },
        { id: 'B', text: md`18`, note: md`$n = 24$ fits the facts and is not divisible by 18; $n$ is only guaranteed one factor of 3, not two.` },
        { id: 'C', text: md`24`, note: '' },
        { id: 'D', text: md`36`, note: md`$36 = 6 \times 6$ needs two factors of 3, and $n = 24$ has only one.` },
        { id: 'E', text: md`48`, note: md`This is the product $6 \times 8$. It counts the shared factor 2 twice, and $n = 24$ fits the facts without being divisible by 48.` },
      ],
      answer: 'C',
      workingMd: md`$6 = 2 \times 3$ and $8 = 2^3$, so $\operatorname{lcm}(6, 8) = 2^3 \times 3 = 24$. Any $n$ divisible by 6 and 8 is a multiple of 24, so 24 must divide $n$. Every other choice fails for $n = 24$ itself.`,
      lesson: 'The smallest number that fits the facts, the LCM, is the counterexample that rules out every larger "must".',
    },
  ],
  takeaways: [
    'Prime factorisation answers most integer questions: divisors, GCD, LCM, squares and cubes.',
    md`If $n = p^a q^b$, it has $(a+1)(b+1)$ positive divisors.`,
    'GCD takes the smaller exponent of shared primes; LCM takes the larger exponent of every prime.',
    'Divisible by $a$ and $b$ guarantees only divisibility by their LCM.',
    '1 is not prime; 2 is the only even prime.',
  ],
  practice: { examKey: 'gre', domain: 'quant-arithmetic', skill: 'arith-integer-properties' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
