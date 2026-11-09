import { md, type Lesson, type Unit } from '../../types';

/** GMAT Quantitative Reasoning: the arithmetic lessons (docs/COURSE-AUTHORING.md, the plan). */

const numberProperties: Lesson = {
  slug: 'number-properties',
  title: 'Number properties: primes, divisibility, remainders and parity',
  summary: 'Use prime factorisation, divisibility rules, remainders and odd-even rules to settle integer questions in a line instead of a page of arithmetic.',
  minutes: 20,
  objectives: [
    'Factorise an integer into primes and read off its divisors, and whether it is a square or a cube.',
    'Find a GCD or LCM from prime powers, and combine divisibility conditions correctly.',
    'Work out remainders of sums and products without dividing large numbers.',
    'Decide what must be true about odd, even and negative integers.',
  ],
  teachMd: md`
### Why properties beat calculation

GMAT Quantitative Reasoning gives you 45 minutes for 21 problem-solving questions, a little over two minutes each, and you cannot use a calculator. Questions about integers are usually built so that multiplying everything out is slow, while one property of the numbers settles the answer in a line. This lesson collects the properties that do most of that work.

### Primes and prime factorisation

A prime has exactly two positive divisors, 1 and itself. So 1 is **not** prime, and 2 is the only even prime. The primes below 30 are 2, 3, 5, 7, 11, 13, 17, 19, 23 and 29.

Every integer greater than 1 is a product of primes in exactly one way. Break a number down with small factors first: $252 = 4 \times 63 = 2^2 \times 3^2 \times 7$. The factorisation answers most integer questions directly:

- **Divisibility.** $n$ is divisible by $m$ when every prime power in $m$ also appears in $n$. So $252$ is divisible by $18 = 2 \times 3^2$, but not by $8 = 2^3$.
- **Number of divisors.** Add 1 to each exponent and multiply. A divisor chooses, for every prime, an exponent from zero up to the maximum, so the choices multiply.
- **Squares and cubes.** A perfect square has only even exponents; a perfect cube has exponents that are all multiples of 3.

### Divisibility rules worth knowing

| Divisor | Test |
| --- | --- |
| 2, 5, 10 | the last digit |
| 4 | the last two digits form a multiple of 4 |
| 8 | the last three digits form a multiple of 8 |
| 3, 9 | the digit sum is divisible by 3, or by 9 |
| 6 | divisible by both 2 and 3 |

To combine conditions, use prime powers, not multiplication. A number divisible by 4 and by 6 must contain $2^2$ and $3$, so it is divisible by 12; it need not be divisible by 24, and 12 itself shows it.

### Greatest common divisor and least common multiple

Write both numbers as prime powers. The GCD takes the **smaller** exponent of each prime, the LCM the **larger**. For $72 = 2^3 \times 3^2$ and $60 = 2^2 \times 3 \times 5$, the GCD is $2^2 \times 3 = 12$ and the LCM is $2^3 \times 3^2 \times 5 = 360$. For any two positive integers,

$$\gcd(a, b) \times \text{lcm}(a, b) = ab$$

and here $12 \times 360 = 4320 = 72 \times 60$. LCM questions often hide inside schedules: events that repeat every 18 minutes and every 24 minutes coincide every $\text{lcm}(18, 24) = 72$ minutes.

### Remainders

Dividing $n$ by $d$ gives $n = qd + r$ with $0 \le r < d$. The remainder is always smaller than the divisor, and it can be 0, which means $d$ divides $n$. The smallest non-negative number with a given remainder is the remainder itself: if $n$ leaves remainder 5 on division by 7, $n$ could be 5, 12, 19 and so on.

Remainders survive addition and multiplication. To find the remainder of a sum or a product, replace each number by its remainder, compute, and reduce again. That is why you may test a remainder question with the smallest number that fits and trust the result for every other number that fits.

### Odd, even and sign

| Operation | Result |
| --- | --- |
| even $\pm$ even, odd $\pm$ odd | even |
| odd $\pm$ even | odd |
| a product with at least one even factor | even |
| a product of odd numbers only | odd |

Zero is even. A product is negative exactly when it has an odd number of negative factors, and a square is never negative. The product of $k$ consecutive integers is always divisible by $k!$: $n(n+1)(n+2)$ contains a multiple of 2 and a multiple of 3, so it is divisible by 6 whatever $n$ is.

### Testing cases

For "which must be true" questions, try numbers that break careless rules: 0, 1, a negative number, and one even and one odd value. A single counterexample is enough to discard an option; an option survives only if no allowed value breaks it.
`,
  examples: [
    {
      id: 'example-factorise-252',
      title: 'Divisors and a perfect square from one factorisation',
      problemMd: md`How many positive divisors does 252 have, and what is the smallest positive integer $k$ for which $252k$ is a perfect square?`,
      steps: [
        md`Factorise in small steps: $252 = 4 \times 63 = 2^2 \times 3^2 \times 7$.`,
        md`A divisor is $2^a \times 3^b \times 7^c$ with $a$ from 0 to 2, $b$ from 0 to 2 and $c$ from 0 to 1, so there are $3 \times 3 \times 2 = 18$ divisors.`,
        md`Check by pairing divisors whose product is 252: $1 \times 252$, $2 \times 126$, $3 \times 84$, $4 \times 63$, $6 \times 42$, $7 \times 36$, $9 \times 28$, $12 \times 21$, $14 \times 18$. Nine pairs give 18 divisors.`,
        md`For a square every exponent must be even. The exponents of 2 and 3 already are; 7 has exponent 1, so one more 7 is needed: $k = 7$. Check: $252 \times 7 = 1764 = 42^2$.`,
      ],
      answerMd: md`252 has 18 positive divisors, and $k = 7$. Multiplying by 252 itself also gives a square, but 252 is not the smallest such $k$.`,
    },
    {
      id: 'example-remainder-4n-plus-3',
      title: 'Remainder of an expression',
      problemMd: md`When the positive integer $n$ is divided by 7, the remainder is 5. What is the remainder when $4n + 3$ is divided by 7?`,
      steps: [
        md`Write what the condition means: $n = 7q + 5$ for some whole number $q$.`,
        md`Substitute: $4n + 3 = 28q + 23 = 28q + 21 + 2 = 7(4q + 3) + 2$, so the remainder is 2.`,
        md`Second route: replace $n$ by its remainder. $4 \times 5 + 3 = 23$, and $23 = 21 + 2$ leaves 2. Testing $n = 12$ gives $51 = 49 + 2$, the same.`,
      ],
      answerMd: md`The remainder is 2. Answering 23 forgets to reduce: a remainder on division by 7 must be less than 7.`,
    },
    {
      id: 'example-gcd-lcm-missing-number',
      title: 'A missing number from its GCD and LCM',
      problemMd: md`Positive integers $a$ and $b$ have greatest common divisor 6 and least common multiple 90. If $a = 18$, what is $b$?`,
      steps: [
        md`Use $\gcd \times \text{lcm} = ab$: $6 \times 90 = 540 = 18b$, so $b = 30$.`,
        md`Check with prime powers. $6 = 2 \times 3$, $90 = 2 \times 3^2 \times 5$ and $a = 18 = 2 \times 3^2$.`,
        md`For 2, the GCD and LCM both have exponent 1, so $b$ has $2^1$. For 3, $a$ already supplies the larger exponent 2, so $b$ must supply the smaller one, $3^1$. For 5, $a$ has none, so $b$ must have $5^1$. Hence $b = 2 \times 3 \times 5 = 30$.`,
      ],
      answerMd: md`$b = 30$. Picking 90 because it is the LCM fails: $\gcd(18, 90) = 18$, not 6.`,
    },
  ],
  traps: [
    {
      title: 'Multiplying divisors to combine them',
      md: md`"Divisible by 4 and by 6" does not mean divisible by 24; it means divisible by $\text{lcm}(4, 6) = 12$. The factors share a 2, and multiplying counts it twice. Combine conditions through prime powers, taking the largest exponent of each prime.`,
    },
    {
      title: 'Testing only comfortable numbers',
      md: md`"Must be true" options often fail only for 0, 1, a negative number or a fraction the question allows. If the stem says "integer", try a negative and zero; if it says "number", try a fraction too. Check what the stem permits before you test.`,
    },
    {
      title: 'A remainder that is not reduced',
      md: md`After replacing numbers by their remainders you may get something larger than the divisor, such as 23 for a division by 7. Reduce again. A remainder is always at least 0 and less than the divisor, so an answer choice equal to or above the divisor can be crossed out at once.`,
    },
    {
      title: 'Forgetting that 2 is prime and 1 is not',
      md: md`If two primes add up to an odd number, one of them must be 2, the only even prime. Counting 1 as a prime gives wrong divisor counts and wrong prime lists. Both slips are quick to make under time pressure and quick to avoid if you say the definition to yourself.`,
    },
  ],
  check: [
    {
      id: 'check-remainder-quadratic',
      title: 'Remainder of n² + 3n',
      topic: 'Problem Solving',
      stemMd: md`When the positive integer $n$ is divided by 8, the remainder is 5. What is the remainder when $n^2 + 3n$ is divided by 8?`,
      options: [
        { id: 'A', text: md`0`, note: '' },
        { id: 'B', text: md`1`, note: md`This is the remainder of $n^2$ alone ($25 = 24 + 1$); the $3n$ term was dropped.` },
        { id: 'C', text: md`5`, note: md`This repeats the remainder of $n$, or gives the quotient $40 \div 8$; neither is the remainder of the expression.` },
        { id: 'D', text: md`7`, note: md`This is the remainder of $3n$ alone ($15 = 8 + 7$); the $n^2$ term was dropped.` },
        { id: 'E', text: md`8`, note: md`Adding the two remainders 1 and 7 gives 8, which must be reduced: a remainder on division by 8 is less than 8.` },
      ],
      answer: 'A',
      workingMd: md`Replace $n$ by its remainder: $5^2 + 3 \times 5 = 40 = 5 \times 8$, so the remainder is 0. Algebra confirms it for every such $n$: with $n = 8q + 5$, $n^2 + 3n = n(n + 3) = (8q + 5)(8q + 8) = 8(8q + 5)(q + 1)$, a multiple of 8. Test: $n = 13$ gives $169 + 39 = 208 = 8 \times 26$.`,
      lesson: 'Replace each number by its remainder, compute, then reduce once more.',
    },
    {
      id: 'check-smallest-cube-multiplier',
      title: 'Making a perfect cube',
      topic: 'Problem Solving',
      stemMd: md`If $k$ is the smallest positive integer for which $600k$ is the cube of an integer, what is $k$?`,
      options: [
        { id: 'A', text: md`6`, note: md`This makes $600k$ a perfect square, $3600 = 60^2$, not a cube.` },
        { id: 'B', text: md`15`, note: md`Adding one to each short exponent gives $600 \times 15 = 2^3 \times 3^2 \times 5^3$, and $3^2$ is still not a cube.` },
        { id: 'C', text: md`30`, note: md`30 is the cube root of $600k$, not $k$ itself.` },
        { id: 'D', text: md`45`, note: '' },
        { id: 'E', text: md`90`, note: md`This includes an unneeded 2: $2^3$ is already a cube, and $600 \times 90 = 2^4 \times 3^3 \times 5^3$ is not.` },
      ],
      answer: 'D',
      workingMd: md`Factorise: $600 = 6 \times 100 = 2^3 \times 3 \times 5^2$. Each exponent must reach a multiple of 3: the 2 is fine, the 3 needs two more factors of 3 and the 5 needs one more factor of 5. So $k = 3^2 \times 5 = 45$, and $600 \times 45 = 27\,000 = 30^3$.`,
      lesson: 'For a square or a cube, raise every prime exponent to the next multiple of 2 or 3, and add nothing else.',
    },
    {
      id: 'check-parity-must-be-true',
      title: 'Which must be true?',
      topic: 'Problem Solving',
      stemMd: md`If $x$ and $y$ are integers and $y(x^2 + 1)$ is odd, which of the following must be true?`,
      options: [
        { id: 'A', text: md`$x$ is odd.`, note: md`If $x$ were odd, $x^2 + 1$ would be even and the whole product even.` },
        { id: 'B', text: md`$y$ is even.`, note: md`An even $y$ would make the product even.` },
        { id: 'C', text: md`$x + y$ is odd.`, note: '' },
        { id: 'D', text: md`$xy$ is odd.`, note: md`$x$ has to be even, so $xy$ is even.` },
        { id: 'E', text: md`$x^2 + y$ is even.`, note: md`$x^2$ is even and $y$ is odd, so the sum is odd.` },
      ],
      answer: 'C',
      workingMd: md`A product is odd only when every factor is odd. So $y$ is odd, and $x^2 + 1$ is odd, which makes $x^2$ even and therefore $x$ even. An even number plus an odd number is odd, so $x + y$ is odd. Check with $x = 2$, $y = 3$: $3 \times 5 = 15$ is odd and $x + y = 5$ is odd.`,
      lesson: 'An odd product forces every factor to be odd; start from that and the rest follows.',
    },
  ],
  takeaways: [
    'Prime factorisation answers divisibility, divisor-count, square and cube questions.',
    'Combine divisibility conditions with the LCM, never by multiplying the divisors.',
    'Replace numbers by their remainders, compute, and reduce below the divisor.',
    'An odd product needs every factor odd; zero is even; 2 is the only even prime.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-arithmetic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const fractionsDecimalsPercents: Lesson = {
  slug: 'fractions-decimals-and-percents',
  title: 'Fractions, decimals and percents without a calculator',
  summary: 'Switch between fractions, decimals and percents, compare fractions fast, handle decimals by hand and chain percent changes correctly.',
  minutes: 20,
  objectives: [
    'Convert between fractions, decimals and percents, choosing whichever makes the arithmetic shortest.',
    'Compare and order fractions by cross-multiplying or with benchmarks.',
    'Multiply and divide decimals by hand, and tell which fractions terminate.',
    'Chain percent changes and fractions of a remainder without adding them.',
  ],
  teachMd: md`
### One number, three spellings

A fraction, a decimal and a percent are three ways of writing the same value, and without a calculator the right spelling decides how long a question takes. $37.5\%$ of 168 is awkward as a decimal and quick as $\frac{3}{8}$ of 168. These equivalents are worth knowing without thinking:

| Fraction | Decimal | Percent |
| --- | --- | --- |
| $\frac{1}{3}$, $\frac{2}{3}$ | $0.\overline{3}$, $0.\overline{6}$ | $33\frac{1}{3}\%$, $66\frac{2}{3}\%$ |
| $\frac{1}{6}$, $\frac{5}{6}$ | $0.1\overline{6}$, $0.8\overline{3}$ | $16\frac{2}{3}\%$, $83\frac{1}{3}\%$ |
| $\frac{1}{8}$, $\frac{3}{8}$, $\frac{5}{8}$, $\frac{7}{8}$ | $0.125$, $0.375$, $0.625$, $0.875$ | $12.5\%$, $37.5\%$, $62.5\%$, $87.5\%$ |
| $\frac{1}{9}$ | $0.\overline{1}$ | $11\frac{1}{9}\%$ |
| $\frac{1}{12}$ | $0.08\overline{3}$ | $8\frac{1}{3}\%$ |
| $\frac{1}{20}$, $\frac{1}{25}$ | $0.05$, $0.04$ | $5\%$, $4\%$ |

One more swap saves time: $x\%$ of $y$ equals $y\%$ of $x$, because both are $\frac{xy}{100}$. So $16\%$ of 75 is $75\%$ of 16, which is 12.

### Comparing fractions

To compare $\frac{a}{b}$ and $\frac{c}{d}$ with positive denominators, cross-multiply: $\frac{a}{b} > \frac{c}{d}$ exactly when $ad > bc$. This is the same as writing both over the common denominator $bd$, without writing it. Two quicker tools often finish the job first:

- **Benchmarks.** $\frac{5}{11}$ is below $\frac{1}{2}$ and $\frac{6}{11}$ is above it, so neither needs arithmetic to be placed against $\frac{1}{2}$.
- **Distance from 1.** $\frac{7}{8}$ and $\frac{9}{10}$ fall short of 1 by $\frac{1}{8}$ and $\frac{1}{10}$. The smaller shortfall wins, so $\frac{9}{10}$ is larger.

### Decimals by hand

To multiply decimals, multiply the digits as whole numbers, then count decimal places. $0.4 \times 0.025$ is $4 \times 25 = 100$ with $1 + 3 = 4$ places, so $0.0100 = 0.01$. To divide, move both decimal points the same number of places until the divisor is a whole number; this multiplies top and bottom by the same power of ten, so the value does not change: $\frac{0.36}{0.009} = \frac{360}{9} = 40$. When the places get confusing, write each number as digits times a power of ten and add the exponents.

### Which fractions terminate?

A fraction in lowest terms has a terminating decimal exactly when its denominator has no prime factors other than 2 and 5. $\frac{7}{40}$ terminates, since $40 = 2^3 \times 5$; $\frac{7}{30}$ does not, since 30 contains 3. Reduce first: $\frac{21}{56} = \frac{3}{8} = 0.375$ terminates even though 56 contains 7.

### Percents as multipliers

A rise of $p\%$ multiplies by $1 + \frac{p}{100}$ and a fall of $p\%$ by $1 - \frac{p}{100}$. Successive changes multiply, and to undo a change you divide by its multiplier. A percent change is always measured from the value the change starts from:

$$\text{percent change} = \frac{\text{new} - \text{old}}{\text{old}} \times 100\%$$

Profit and discount questions are chains of multipliers. A cost marked up 50% and then discounted 20% sells for $1.5 \times 0.8 = 1.2$ times the cost, a profit of 20% of the cost, not the 30% that subtracting the percents suggests.

### Fractions of what is left

"Spent $\frac{1}{5}$, then $\frac{3}{4}$ of the remainder" takes the second fraction of a smaller amount. Track what is **left** after each step: $\frac{4}{5}$ remains after the first step and $\frac{1}{4}$ of that after the second, so $\frac{4}{5} \times \frac{1}{4} = \frac{1}{5}$ of the original remains. Writing the remaining fraction at each step avoids the most common slip, taking every fraction of the original amount.

### Estimate before you choose

Answer choices on problem-solving questions are often spread out enough that a rough value picks the right one. Rounding $\frac{29}{61}$ to just under $\frac{1}{2}$, or $0.198$ to $0.2$, is legitimate whenever the options are far apart; when they are close, do the exact arithmetic.
`,
  examples: [
    {
      id: 'example-order-three-fractions',
      title: 'Ordering three close fractions',
      problemMd: md`Put $\frac{7}{12}$, $\frac{5}{9}$ and $\frac{4}{7}$ in order from smallest to largest.`,
      steps: [
        md`All three are just above $\frac{1}{2}$, so the benchmark does not separate them. Cross-multiply in pairs.`,
        md`$\frac{7}{12}$ against $\frac{5}{9}$: $7 \times 9 = 63$ and $5 \times 12 = 60$, so $\frac{7}{12}$ is larger.`,
        md`$\frac{5}{9}$ against $\frac{4}{7}$: $5 \times 7 = 35$ and $4 \times 9 = 36$, so $\frac{4}{7}$ is larger.`,
        md`$\frac{7}{12}$ against $\frac{4}{7}$: $7 \times 7 = 49$ and $4 \times 12 = 48$, so $\frac{7}{12}$ is larger. Second route: how far each is above $\frac{1}{2}$: $\frac{1}{12}$, $\frac{1}{18}$ and $\frac{1}{14}$, which order the same way.`,
      ],
      answerMd: md`$\frac{5}{9} < \frac{4}{7} < \frac{7}{12}$. Judging by the size of the denominators alone would have put them in the wrong order.`,
    },
    {
      id: 'example-awkward-percent',
      title: 'An awkward percent as a fraction',
      problemMd: md`Without a calculator, find $37.5\%$ of 168.`,
      steps: [
        md`Recognise $37.5\% = \frac{3}{8}$.`,
        md`Divide first, then multiply: $168 \div 8 = 21$ and $21 \times 3 = 63$.`,
        md`Second route: $37.5\% = 40\% - 2.5\%$. $40\%$ of 168 is $67.2$ and $2.5\%$ of 168 is $4.2$, so the result is $67.2 - 4.2 = 63$.`,
      ],
      answerMd: md`$37.5\%$ of 168 is 63.`,
    },
    {
      id: 'example-markup-then-discount',
      title: 'A markup followed by a discount',
      problemMd: md`A shop prices an item 40% above its cost, then sells it at 15% off that price. The profit is $\$19$. What did the item cost the shop?`,
      steps: [
        md`Chain the multipliers: the selling price is $c \times 1.4 \times 0.85 = 1.19c$.`,
        md`Profit is selling price minus cost: $1.19c - c = 0.19c = 19$, so $c = 100$.`,
        md`Check forwards: marked price $\$140$, discount $15\%$ of $\$140$ is $\$21$, selling price $\$119$, profit $\$19$.`,
      ],
      answerMd: md`The item cost $\$100$. Subtracting the percents ($40 - 15 = 25\%$ profit) gives a cost of $\$76$, which is wrong because the discount is taken of the marked price, not of the cost.`,
    },
  ],
  traps: [
    {
      title: 'Taking every fraction of the original',
      md: md`"A quarter, then two thirds of the rest" is not $\frac{1}{4} + \frac{2}{3}$ of the whole. The second fraction applies to what remains. Write the fraction left after each step and multiply those.`,
    },
    {
      title: 'Adding or subtracting successive percents',
      md: md`A 40% markup and a 15% discount do not net to 25%. The discount is taken of a larger number, so the multipliers $1.4$ and $0.85$ must be multiplied. Any time one change follows another, multiply.`,
    },
    {
      title: 'Losing a decimal place',
      md: md`Most decimal errors are off by a power of ten, and the answer choices often include the neighbours $3$, $30$ and $300$. Count decimal places deliberately, or rewrite numbers as digits times powers of ten, and estimate the size of the answer before choosing.`,
    },
    {
      title: 'Judging a decimal before reducing',
      md: md`Whether a fraction terminates depends on the denominator in lowest terms. $\frac{21}{56}$ looks as if the 7 in 56 should stop it terminating, but it reduces to $\frac{3}{8}$. Cancel common factors first.`,
    },
  ],
  check: [
    {
      id: 'check-second-year-fall',
      title: 'The fall that follows a rise',
      topic: 'Problem Solving',
      stemMd: md`An investment's value rose 25% during its first year. At the end of the second year it was worth 10% less than at the start of the first year. By what percent did its value fall during the second year?`,
      options: [
        { id: 'A', text: md`10%`, note: md`10% is the overall change across both years, not the fall during the second year.` },
        { id: 'B', text: md`20%`, note: md`A 20% fall only undoes the 25% rise and returns the value to its start; it has to fall further, to 10% below the start.` },
        { id: 'C', text: md`25%`, note: md`A fall equal to the rise gives $1.25 \times 0.75 = 0.9375$, about 6% below the start rather than 10%.` },
        { id: 'D', text: md`28%`, note: '' },
        { id: 'E', text: md`35%`, note: md`The value drops 35 for every 100 of the original amount, but the second year's percent change is measured from the 125 it started that year with.` },
      ],
      answer: 'D',
      workingMd: md`Start at 100. After the first year the value is 125; at the end of the second year it is 90. The second-year fall is $\frac{125 - 90}{125} = \frac{35}{125} = 0.28$, or 28%. With multipliers: $\frac{0.9}{1.25} = 0.72$, a fall of 28%.`,
      lesson: 'Measure each period\'s percent change from the value at the start of that period.',
    },
    {
      id: 'check-decimal-places',
      title: 'Decimals by hand',
      topic: 'Problem Solving',
      stemMd: md`$$\frac{0.6 \times 0.035}{0.0007} = \;?$$`,
      options: [
        { id: 'A', text: md`3`, note: md`This takes the numerator as $0.0021$; the product $0.6 \times 0.035$ has $1 + 3 = 4$ decimal places and equals $0.0210$.` },
        { id: 'B', text: md`30`, note: '' },
        { id: 'C', text: md`300`, note: md`This takes the numerator as $0.21$, one decimal place short of the correct $0.021$.` },
        { id: 'D', text: md`3,000`, note: md`This takes the numerator as $2.1$, losing two decimal places of the product.` },
        { id: 'E', text: md`30,000`, note: md`This treats $0.6 \times 0.035$ as the whole number 21, dropping every decimal place of the product.` },
      ],
      answer: 'B',
      workingMd: md`Numerator: $6 \times 35 = 210$ with 4 decimal places, so $0.0210 = 0.021$. Divide: $\frac{0.021}{0.0007} = \frac{210}{7} = 30$ after moving both decimal points four places. With powers of ten: $\frac{6 \times 10^{-1} \times 35 \times 10^{-3}}{7 \times 10^{-4}} = \frac{210 \times 10^{-4}}{7 \times 10^{-4}} = 30$.`,
      lesson: 'Count decimal places on purpose, or convert to powers of ten, before you divide.',
    },
    {
      id: 'check-fraction-of-remainder',
      title: 'Savings spent in two steps',
      topic: 'Problem Solving',
      stemMd: md`Rosa spent $\frac{1}{4}$ of her savings on a laptop and then $\frac{2}{3}$ of the remaining savings on a trip. She has $\$600$ left. How much were her savings at first?`,
      options: [
        { id: 'A', text: md`\$1,200`, note: md`This treats $\frac{2}{3}$ as the share left after the trip rather than the share spent on it.` },
        { id: 'B', text: md`\$1,800`, note: md`$\$600$ is a third of $\$1,800$, but $\$1,800$ is what remained after the laptop, not the starting savings.` },
        { id: 'C', text: md`\$2,400`, note: '' },
        { id: 'D', text: md`\$3,600`, note: md`This multiplies the two spent fractions, $\frac{1}{4} \times \frac{2}{3} = \frac{1}{6}$, and treats that as what is left.` },
        { id: 'E', text: md`\$7,200`, note: md`This takes both fractions of the original savings: $\frac{1}{4} + \frac{2}{3} = \frac{11}{12}$ spent, leaving $\frac{1}{12}$.` },
      ],
      answer: 'C',
      workingMd: md`After the laptop $\frac{3}{4}$ of the savings remain; after the trip $\frac{1}{3}$ of that remains, so $\frac{3}{4} \times \frac{1}{3} = \frac{1}{4}$ of the savings is $\$600$, and the savings were $\$2,400$. Forwards: the laptop costs $\$600$, leaving $\$1,800$; the trip costs $\frac{2}{3} \times 1800 = \$1,200$, leaving $\$600$.`,
      lesson: 'Multiply the fractions that remain after each step, not the fractions spent.',
    },
  ],
  takeaways: [
    'Pick the spelling that makes the arithmetic short: fraction, decimal or percent.',
    'Cross-multiply to compare fractions; use benchmarks and the distance from 1 first.',
    'Count decimal places deliberately, or use powers of ten.',
    'Successive percent changes and fractions of a remainder multiply; they never add.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-arithmetic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const ratiosAndMixtures: Lesson = {
  slug: 'ratios-and-mixtures',
  title: 'Ratios and mixtures',
  summary: 'Write ratios as parts, link ratios through a common term, follow a ratio as quantities change, and solve mixtures with the balance method.',
  minutes: 20,
  objectives: [
    'Turn a ratio into actual quantities with one multiplier, and tell part-to-part from part-to-whole.',
    'Combine two ratios that share a term, and solve problems where a ratio changes.',
    'Solve mixture and weighted-average questions by tracking the pure ingredient or with the balance method.',
  ],
  teachMd: md`
### A ratio is a recipe of parts

A ratio of $3 : 5$ says nothing about size; it says the quantities are $3k$ and $5k$ for some positive number $k$. Introducing that one multiplier turns every ratio question into ordinary algebra. The total is $8k$, so the first quantity is $\frac{3}{8}$ of the whole and the second $\frac{5}{8}$. A ratio alone never fixes the actual numbers; you need one real quantity (a total, a difference, one of the parts) to find $k$.

### Part-to-part and part-to-whole

"Boys to girls is $3 : 5$" is part-to-part. "Three eighths of the class are boys" is part-to-whole. They carry the same information, but mixing them up is a classic slip: with a ratio of $3 : 5$, boys are $\frac{3}{8}$ of the class, not $\frac{3}{5}$. When a question gives a total, convert to part-to-whole; when it gives a difference, use the parts: the difference between the groups is $5k - 3k = 2k$.

### Linking ratios through a common term

If $a : b = 3 : 4$ and $b : c = 6 : 5$, the two ratios describe $b$ with different numbers of parts. Scale each so that $b$ gets the same number, the LCM of 4 and 6, which is 12: $a : b = 9 : 12$ and $b : c = 12 : 10$. Now $a : b : c = 9 : 12 : 10$. Joining the ratios without this step, as $3 : 4 : 5$, is wrong because the "4" and the "6" are not the same amount of $b$.

### When the quantities change

Questions often add or remove items and give the new ratio. Write the original quantities with $k$, apply the change, set the new ratio and cross-multiply. Whatever does not change is your anchor. If men and women are $5 : 3$ and only women join, the number of men is fixed, so the new ratio tells you how many women there must be per man.

### Mixtures: track the pure ingredient

A concentration is a part-to-whole ratio: $\frac{\text{amount of ingredient}}{\text{total amount}}$. Before writing any equation, ask which amount stays fixed.

- **Adding water** (or any other diluting liquid) leaves the amount of the ingredient unchanged. 40 litres of a 20% salt solution hold 8 litres of salt; to make it 16%, the total must become $\frac{8}{0.16} = 50$ litres, so add 10 litres of water.
- **Adding pure ingredient** raises both the ingredient and the total, so both appear in the equation.
- **Removing water** (evaporation) keeps the ingredient and lowers the total.

### Weighted averages and the balance method

When two groups with different values are combined, the result is a weighted average: it lies between the two values, closer to the value of the larger group. Picture a seesaw. With low value $L$, high value $H$ and mixed value $M$,

$$\frac{\text{amount at } L}{\text{amount at } H} = \frac{H - M}{M - L}$$

The amounts are in the **inverse** ratio of the distances. Mixing 30% and 75% solutions to get 45%: the distances are $45 - 30 = 15$ and $75 - 45 = 30$, so the amounts of 30% and 75% solution are in the ratio $30 : 15 = 2 : 1$. The 30% solution is the one the mixture sits closer to, so there must be more of it. The same method handles prices of blended goods, average scores of two classes and average speeds over equal times.

### Two checks before you choose

Is the mixed value between the two ingredient values, and is it closer to the one there is more of? Does your answer give the stated total? Both catch reversed ratios, the most common mistake in this topic.
`,
  examples: [
    {
      id: 'example-linking-ratios',
      title: 'Linking two ratios',
      problemMd: md`In a box of pens, the ratio of black to blue is $3 : 4$, and the ratio of blue to red is $6 : 5$. There are 155 pens in all. How many are red?`,
      steps: [
        md`Blue appears in both ratios as 4 parts and 6 parts. Scale both so blue is $\text{lcm}(4, 6) = 12$ parts: black : blue $= 9 : 12$, blue : red $= 12 : 10$.`,
        md`Combined: black : blue : red $= 9 : 12 : 10$, a total of 31 parts.`,
        md`Each part is $155 \div 31 = 5$ pens, so red is $10 \times 5 = 50$.`,
        md`Check: 45 black, 60 blue, 50 red add to 155; $45 : 60 = 3 : 4$ and $60 : 50 = 6 : 5$.`,
      ],
      answerMd: md`There are 50 red pens. Chaining the ratios without scaling, as $3 : 4 : 5$, gives 12 parts and a non-whole number of pens per part.`,
    },
    {
      id: 'example-ratio-after-joining',
      title: 'A ratio that changes',
      problemMd: md`A club's members are men and women in the ratio $5 : 3$. After 12 more women join and nobody leaves, the ratio becomes $5 : 4$. How many men are in the club?`,
      steps: [
        md`Let the men be $5k$ and the women $3k$. After the change: $5k : (3k + 12) = 5 : 4$.`,
        md`Cross-multiply: $4 \times 5k = 5(3k + 12)$, so $20k = 15k + 60$ and $k = 12$.`,
        md`Men: $5 \times 12 = 60$. Women: 36 before, 48 after, and $60 : 48 = 5 : 4$.`,
        md`Second route: the men are fixed. In the new ratio the women are $\frac{4}{5}$ of the men, up from $\frac{3}{5}$; the gain of $\frac{1}{5}$ of the men equals 12, so there are 60 men.`,
      ],
      answerMd: md`The club has 60 men. Reading the ratios as actual numbers, 5 men and 3 women, is the trap: then a single woman joining would already give $5 : 4$.`,
    },
    {
      id: 'example-acid-balance',
      title: 'Mixing two solutions',
      problemMd: md`How many litres of a 30% acid solution must be added to 12 litres of a 75% acid solution to obtain a 45% acid solution?`,
      steps: [
        md`Distances from the target: $45 - 30 = 15$ and $75 - 45 = 30$.`,
        md`Amounts are in the inverse ratio of the distances: 30% solution : 75% solution $= 30 : 15 = 2 : 1$.`,
        md`There are 12 litres of the 75% solution, so $2 \times 12 = 24$ litres of the 30% solution.`,
        md`Check by tracking the acid: $0.3 \times 24 + 0.75 \times 12 = 7.2 + 9 = 16.2$ litres of acid in 36 litres, and $\frac{16.2}{36} = 0.45$.`,
      ],
      answerMd: md`24 litres. Using the distances directly instead of inversely gives 6 litres, which would leave the mixture closer to 75% than to 30%.`,
    },
  ],
  traps: [
    {
      title: 'Part-to-part read as part-to-whole',
      md: md`With boys and girls in the ratio $3 : 5$, the boys are $\frac{3}{8}$ of the class. Using $\frac{3}{5}$ of a stated total is the slip. Write the total as $8k$ and the confusion disappears.`,
    },
    {
      title: 'Joining ratios without a common term',
      md: md`$a : b = 3 : 4$ and $b : c = 6 : 5$ do not give $3 : 4 : 5$ or $3 : 6 : 5$. The shared quantity must have the same number of parts in both before the ratios can be chained.`,
    },
    {
      title: 'Averaging concentrations without weights',
      md: md`Mixing equal volumes of 20% and 50% solutions gives 35%, but unequal volumes do not. A mixture's concentration is total ingredient over total volume, so the larger volume pulls the result towards its own value.`,
    },
    {
      title: 'Reversing the balance ratio',
      md: md`In the balance method the amounts are in the **inverse** ratio of the distances. A quick test: the result must be closer to the ingredient there is more of. If your answer puts it closer to the smaller amount, swap the ratio.`,
    },
  ],
  check: [
    {
      id: 'check-marbles-ratio-change',
      title: 'Marbles added to a bag',
      topic: 'Problem Solving',
      stemMd: md`The ratio of red to blue marbles in a bag is $4 : 7$. After 6 red marbles are added, the ratio of red to blue is $2 : 3$. How many blue marbles are in the bag?`,
      options: [
        { id: 'A', text: md`36`, note: md`36 is the original number of red marbles, not the blue ones.` },
        { id: 'B', text: md`42`, note: md`42 is the number of red marbles after the 6 are added.` },
        { id: 'C', text: md`63`, note: '' },
        { id: 'D', text: md`99`, note: md`99 is the total number of marbles before the red ones were added.` },
        { id: 'E', text: md`105`, note: md`105 is the total number of marbles after the red ones were added.` },
      ],
      answer: 'C',
      workingMd: md`Let red be $4k$ and blue $7k$. Then $\frac{4k + 6}{7k} = \frac{2}{3}$, so $12k + 18 = 14k$ and $k = 9$. Blue: $7 \times 9 = 63$. Check: red goes from 36 to 42, and $42 : 63 = 2 : 3$.`,
      lesson: 'Name the quantities with one multiplier, apply the change, then answer exactly the quantity asked for.',
    },
    {
      id: 'check-coffee-blend',
      title: 'A coffee blend',
      topic: 'Problem Solving',
      stemMd: md`A grocer blends coffee costing $\$12$ per kilogram with coffee costing $\$20$ per kilogram to make 40 kilograms of a blend costing $\$15$ per kilogram. How many kilograms of the $\$20$ coffee are in the blend?`,
      options: [
        { id: 'A', text: md`3`, note: md`3 is the price gap $15 - 12$, a distance on the balance, not an amount of coffee.` },
        { id: 'B', text: md`5`, note: md`5 is the price gap $20 - 15$, a distance on the balance, not an amount of coffee.` },
        { id: 'C', text: md`8`, note: md`8 is the full price range $20 - 12$; it is the number of parts, not kilograms.` },
        { id: 'D', text: md`15`, note: '' },
        { id: 'E', text: md`25`, note: md`25 kilograms is the amount of the $\$12$ coffee; the ratio was applied the wrong way round.` },
      ],
      answer: 'D',
      workingMd: md`Distances from the blend price: $15 - 12 = 3$ and $20 - 15 = 5$. The amounts are in the inverse ratio, so cheap : dear $= 5 : 3$. The 40 kilograms make 8 parts of 5 kilograms, so the $\$20$ coffee is $3 \times 5 = 15$ kilograms. Check: $25 \times 12 + 15 \times 20 = 300 + 300 = 600 = 40 \times 15$.`,
      lesson: 'On the balance, amounts are in the inverse ratio of the distances from the mixed value.',
    },
    {
      id: 'check-adding-pure-juice',
      title: 'Raising a juice concentration',
      topic: 'Problem Solving',
      stemMd: md`A 60-litre tank holds a drink that is 25% juice. How many litres of pure juice must be added to make the drink 40% juice?`,
      options: [
        { id: 'A', text: md`9`, note: md`This applies the 15-point gap to the original 60 litres, ignoring that the added juice also increases the total volume.` },
        { id: 'B', text: md`15`, note: '' },
        { id: 'C', text: md`22.5`, note: md`This is the water that would have to be removed to reach 40% juice, a different operation from adding juice.` },
        { id: 'D', text: md`24`, note: md`24 litres is the juice a 60-litre drink at 40% would contain; adding juice changes the volume, so this is not the amount to add.` },
        { id: 'E', text: md`37.5`, note: md`This is the total volume at which the original 15 litres of juice would make up 40%, not an amount to add.` },
      ],
      answer: 'B',
      workingMd: md`The drink holds $0.25 \times 60 = 15$ litres of juice. Adding $x$ litres of pure juice: $\frac{15 + x}{60 + x} = \frac{2}{5}$, so $75 + 5x = 120 + 2x$ and $x = 15$. Check: $\frac{30}{75} = 0.4$. Balance route: the drink is 25% and pure juice is 100%; the target 40% is 15 from one and 60 from the other, so drink : juice $= 60 : 15$, and with 60 litres of drink that is 15 litres of juice.`,
      lesson: 'Decide which amounts change before writing the concentration equation.',
    },
  ],
  takeaways: [
    'Write a ratio $a : b$ as $ak$ and $bk$; one real quantity fixes $k$.',
    'Give a shared term the same number of parts before chaining two ratios.',
    'In mixtures, track the pure ingredient and ask which amounts change.',
    'Amounts in a blend are in the inverse ratio of their distances from the mixed value.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-applied-arithmetic-algebra' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const ratesWorkTravel: Lesson = {
  slug: 'rates-work-and-travel',
  title: 'Rates, work and travel',
  summary: 'Use distance equals rate times time, average speeds correctly, relative speed for meetings and chases, and add work rates rather than times.',
  minutes: 22,
  objectives: [
    'Set up any travel question with distance equals rate times time, keeping units consistent.',
    'Find an average speed from total distance and total time.',
    'Solve meeting and catch-up problems with relative speed.',
    'Combine work rates, including a drain or a worker who leaves part-way.',
  ],
  teachMd: md`
### One relationship, three forms

Travel questions rest on $\text{distance} = \text{rate} \times \text{time}$, and work questions on $\text{work} = \text{rate} \times \text{time}$. Every question gives two of the three quantities, sometimes in disguise, and asks for the third. A small table with a row for each traveller or worker and columns for rate, time and distance keeps the facts straight.

### Units first

Rates in kilometres per hour and times in minutes do not mix. Convert before computing: 45 minutes is $\frac{3}{4}$ hour, and 1.9 hours is 1 hour and $0.9 \times 60 = 54$ minutes, not 1 hour 9 minutes. When answer choices are clock times, convert the decimal part of an hour carefully at the end.

### Average speed is total distance over total time

$$\text{average speed} = \frac{\text{total distance}}{\text{total time}}$$

It is **not** the average of the speeds, unless equal times are spent at each speed. Driving 120 km out at 60 km/h and back at 40 km/h takes 2 hours plus 3 hours, so the average speed is $\frac{240}{5} = 48$ km/h, not 50. More time is spent at the slower speed, which pulls the average towards it. For two equal distances at speeds $a$ and $b$ there is a shortcut:

$$\text{average speed} = \frac{2ab}{a + b}$$

and $\frac{2 \times 60 \times 40}{100} = 48$ agrees.

### Relative speed

When two objects move towards each other, or away from each other, the gap between them changes at the **sum** of their speeds. When one follows the other in the same direction, the gap changes at the **difference**. So two cyclists 63 km apart riding towards each other at 15 and 13 km/h close the gap at 28 km/h and meet after $\frac{63}{28} = 2.25$ hours.

For a chase, first find the head start: the distance the leader covers before the follower sets off. The catch-up time is the head start divided by the closing speed.

### Work: add rates, not times

If a job takes a worker $a$ hours, the worker's rate is $\frac{1}{a}$ of the job per hour. Rates of people working together add; times do not. A drain, or anyone undoing the work, contributes a negative rate. For two workers,

$$\frac{1}{T} = \frac{1}{a} + \frac{1}{b}, \qquad T = \frac{ab}{a + b}$$

A useful device without a calculator: pretend the job has a size equal to the LCM of the individual times. If one printer takes 10 hours and another 15, call the job 30 pages; the printers do 3 and 2 pages an hour, 5 together, so the job takes 6 hours. Fractions become whole numbers.

### Sanity checks

- Working together must be faster than the fastest worker alone and, with two equal workers, exactly half of one worker's time.
- An average speed lies between the slowest and fastest speeds.
- When two travellers set off towards each other at the same moment, they meet closer to the slower one's start.

These checks take seconds and often eliminate two or three answer choices before any arithmetic.
`,
  examples: [
    {
      id: 'example-round-trip-average',
      title: 'Average speed on a round trip',
      problemMd: md`A van drives 120 km to a depot at 60 km/h and returns along the same road at 40 km/h. What is its average speed for the round trip?`,
      steps: [
        md`Find each time: $\frac{120}{60} = 2$ hours out and $\frac{120}{40} = 3$ hours back.`,
        md`Total distance over total time: $\frac{240}{2 + 3} = 48$ km/h.`,
        md`Check with the equal-distance shortcut: $\frac{2 \times 60 \times 40}{60 + 40} = \frac{4800}{100} = 48$.`,
      ],
      answerMd: md`48 km/h. The tempting 50 km/h averages the speeds, which would be right only if the van spent equal times, not equal distances, at each speed.`,
    },
    {
      id: 'example-catch-up',
      title: 'A courier catching up',
      problemMd: md`One courier leaves a depot at 9:00 riding at 12 km/h. A second courier leaves the same depot at 9:30 along the same road at 18 km/h. At what time does the second courier catch the first?`,
      steps: [
        md`Head start: in the half hour before 9:30 the first courier covers $12 \times 0.5 = 6$ km.`,
        md`Same direction, so the gap closes at the difference of the speeds: $18 - 12 = 6$ km/h.`,
        md`Catch-up time: $\frac{6}{6} = 1$ hour after 9:30, so at 10:30.`,
        md`Check: by 10:30 the first courier has ridden 1.5 hours, $12 \times 1.5 = 18$ km; the second has ridden 1 hour, $18 \times 1 = 18$ km.`,
      ],
      answerMd: md`At 10:30. Adding the speeds instead would give a closing speed of 30 km/h and a catch-up after 12 minutes, which is impossible for riders going the same way.`,
    },
    {
      id: 'example-pipes-and-drain',
      title: 'Two pipes and a drain',
      problemMd: md`Pipe A fills a tank in 6 hours and pipe B fills it in 9 hours. A drain empties a full tank in 12 hours. If the tank starts empty and all three are open, how long does it take to fill?`,
      steps: [
        md`Pick a tank size equal to $\text{lcm}(6, 9, 12) = 36$ units. Pipe A adds 6 units per hour, pipe B adds 4, and the drain removes 3.`,
        md`Net rate: $6 + 4 - 3 = 7$ units per hour, so filling takes $\frac{36}{7} = 5\frac{1}{7}$ hours.`,
        md`Check with fractions: $\frac{1}{6} + \frac{1}{9} - \frac{1}{12} = \frac{6 + 4 - 3}{36} = \frac{7}{36}$ of the tank per hour, and the reciprocal is $\frac{36}{7}$.`,
      ],
      answerMd: md`$5\frac{1}{7}$ hours, about 5 hours 9 minutes. Without the drain the pipes alone need $\frac{36}{10} = 3.6$ hours, so the drain adds time, as it should.`,
    },
    {
      id: 'example-worker-leaves',
      title: 'Finishing a job alone',
      problemMd: md`Ana can paint a fence in 10 days and Ben in 15 days. Ana works alone for 4 days, then stops, and Ben finishes the fence alone. How many days does Ben work?`,
      steps: [
        md`Call the job 30 units, the LCM of 10 and 15. Ana paints 3 units a day and Ben 2.`,
        md`In 4 days Ana paints 12 units, leaving 18.`,
        md`Ben needs $\frac{18}{2} = 9$ days.`,
        md`Check with fractions: Ana does $\frac{4}{10}$ of the job and Ben $\frac{9}{15} = \frac{6}{10}$, which add to 1.`,
      ],
      answerMd: md`Ben works 9 days.`,
    },
  ],
  traps: [
    {
      title: 'Averaging the speeds',
      md: md`The average speed is total distance over total time. Over equal distances it is always below the simple average of the speeds, because more time is spent going slowly. Expect the simple average among the choices.`,
    },
    {
      title: 'Adding times instead of rates',
      md: md`Two machines taking 4 and 6 hours do not take 10 hours together, or 5. Convert each to a rate, add the rates, and turn the total back into a time. The combined time must be shorter than either machine's time alone.`,
    },
    {
      title: 'Decimal hours read as minutes',
      md: md`1.9 hours is 1 hour 54 minutes, not 1 hour 9 minutes. Multiply the decimal part by 60 whenever the answer is a clock time or a number of minutes.`,
    },
    {
      title: 'Forgetting the head start',
      md: md`When travellers set off at different times, the early one has already covered some distance. Work out where everyone is when the last one starts, then apply relative speed from that moment.`,
    },
  ],
  check: [
    {
      id: 'check-two-halves-speed',
      title: 'Average speed over two halves',
      topic: 'Problem Solving',
      stemMd: md`A runner covers the first half of a 12-kilometre course at 8 km/h and the second half at 12 km/h. What is her average speed for the whole course?`,
      options: [
        { id: 'A', text: md`4.8 km/h`, note: md`This divides only one half of the course, 6 km, by the total time.` },
        { id: 'B', text: md`9.6 km/h`, note: '' },
        { id: 'C', text: md`10 km/h`, note: md`This is the simple average of the two speeds; she spends longer at the slower speed, so the true average is lower.` },
        { id: 'D', text: md`10.4 km/h`, note: md`This weights each speed by the other half's time ($8 \times 0.5 + 12 \times 0.75$ over 1.25 hours), swapping the times.` },
        { id: 'E', text: md`20 km/h`, note: md`This adds the speeds, as for the closing speed of two runners approaching each other.` },
      ],
      answer: 'B',
      workingMd: md`Times: $\frac{6}{8} = 0.75$ hour and $\frac{6}{12} = 0.5$ hour, a total of 1.25 hours. Average speed: $\frac{12}{1.25} = 9.6$ km/h. Shortcut for equal distances: $\frac{2 \times 8 \times 12}{8 + 12} = \frac{192}{20} = 9.6$.`,
      lesson: 'Average speed is total distance over total time, never the average of the speeds over equal distances.',
    },
    {
      id: 'check-pipes-with-drain',
      title: 'Filling against a drain',
      topic: 'Problem Solving',
      stemMd: md`Pipe P fills an empty tank in 3 hours and pipe Q fills it in 5 hours. A drain, opened at the same moment, empties a full tank in 6 hours. With P, Q and the drain all open, how long does it take to fill the empty tank?`,
      options: [
        { id: 'A', text: md`$\frac{11}{30}$ hour`, note: md`$\frac{11}{30}$ is the fraction of the tank filled per hour, a rate; the time is its reciprocal.` },
        { id: 'B', text: md`$1\frac{3}{7}$ hours`, note: md`This adds the drain's rate instead of subtracting it: $\frac{1}{3} + \frac{1}{5} + \frac{1}{6} = \frac{21}{30}$.` },
        { id: 'C', text: md`$1\frac{7}{8}$ hours`, note: md`This is the time for the two pipes alone; the drain was left out.` },
        { id: 'D', text: md`2 hours`, note: md`This combines the times directly, $3 + 5 - 6$; times do not add or subtract, rates do.` },
        { id: 'E', text: md`$2\frac{8}{11}$ hours`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Net rate: $\frac{1}{3} + \frac{1}{5} - \frac{1}{6} = \frac{10 + 6 - 5}{30} = \frac{11}{30}$ of the tank per hour, so the time is $\frac{30}{11} = 2\frac{8}{11}$ hours. With a 30-unit tank: P adds 10 units per hour, Q adds 6 and the drain removes 5, a net 11 units per hour, and $\frac{30}{11}$ hours again. It is longer than the $1\frac{7}{8}$ hours the pipes need without the drain, as it must be.`,
      lesson: 'Add rates with signs, then take the reciprocal to get the time.',
    },
    {
      id: 'check-trains-meeting',
      title: 'Two trains, different start times',
      topic: 'Problem Solving',
      stemMd: md`Two stations are 345 km apart. Train A leaves the first station at 8:00 and travels towards the second at 60 km/h. Train B leaves the second station at 9:00 and travels towards the first at 90 km/h. At what time do the trains meet?`,
      options: [
        { id: 'A', text: md`10:09`, note: md`This reads 1.9 hours as 1 hour 9 minutes; 0.9 hour is 54 minutes.` },
        { id: 'B', text: md`10:18`, note: md`This starts both trains at 8:00, ignoring that train B sets off an hour later.` },
        { id: 'C', text: md`10:54`, note: '' },
        { id: 'D', text: md`11:18`, note: md`This starts both trains at 9:00 with the full 345 km between them, forgetting the 60 km train A has already covered.` },
        { id: 'E', text: md`11:54`, note: md`This counts train A's extra hour twice: it is already used up in the 60 km head start, so it must not be added to the meeting time.` },
      ],
      answer: 'C',
      workingMd: md`By 9:00 train A has covered 60 km, leaving 285 km between the trains. They close the gap at $60 + 90 = 150$ km/h, so they meet $\frac{285}{150} = 1.9$ hours after 9:00, which is 1 hour 54 minutes later, at 10:54. Check: train A has run 2.9 hours, $2.9 \times 60 = 174$ km; train B has run 1.9 hours, $1.9 \times 90 = 171$ km; $174 + 171 = 345$.`,
      lesson: 'Place everyone at the moment the last traveller starts, then divide the gap by the closing speed.',
    },
  ],
  takeaways: [
    'Distance = rate × time; convert units before computing.',
    'Average speed is total distance over total time.',
    'Towards or apart, add speeds; same direction, subtract them.',
    'Work rates add (drains subtract); times never add.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-applied-arithmetic-algebra' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const statisticsForQuant: Lesson = {
  slug: 'statistics-for-quant',
  title: 'Statistics for Quant: averages, medians and spread',
  summary: 'Work with sums instead of averages, find medians, handle weighted and evenly spaced sets, and judge standard deviation without computing it.',
  minutes: 20,
  objectives: [
    'Solve mean questions through the sum, including values added or removed.',
    'Find a weighted average, a median and the mean of an evenly spaced set quickly.',
    'Predict how changes to a set affect its standard deviation without calculating it.',
    'Find the largest or smallest possible value under a fixed mean and median.',
  ],
  teachMd: md`
### Think in sums

The mean of a list is its sum divided by the number of values, so

$$\text{sum} = \text{mean} \times \text{number of values}$$

Almost every averages question becomes easy once you switch from means to sums. If five numbers average 18, they add to 90. If a sixth number lifts the average to 20, the six add to 120, so the new number is $120 - 90 = 30$. A second way to see the same thing: the new number must equal the new mean (20) plus enough to lift each of the five old numbers by 2, that is $20 + 5 \times 2 = 30$.

### Weighted averages

When groups of different sizes are combined, the overall mean is a weighted average:

$$\text{mean} = \frac{n_1 m_1 + n_2 m_2}{n_1 + n_2}$$

It lies between the two group means, closer to the larger group. The balance method from mixtures applies: the distances from the overall mean to the group means are in the inverse ratio of the group sizes. Averaging the two means directly is right only when the groups are the same size.

### Median, mode and range

The **median** is the middle value once the list is **sorted**. With an even number of values it is the mean of the two middle values. The median ignores how far the extreme values are from the middle, so one huge value moves the mean but not the median. The **mode** is the most frequent value (a list can have several). The **range** is the largest value minus the smallest.

### Evenly spaced sets

In a list with a constant gap between consecutive values (consecutive integers, consecutive multiples of 5, and so on), the mean equals the median, and both equal the average of the first and last values:

$$\text{mean} = \text{median} = \frac{\text{first} + \text{last}}{2}$$

The number of values is $\frac{\text{last} - \text{first}}{\text{gap}} + 1$; forgetting the $+1$ is the usual off-by-one slip. The sum is the number of values times the mean, so the integers from 11 to 40 add to $30 \times 25.5 = 765$.

### Standard deviation without computing it

Standard deviation measures how far the values typically lie from the mean. You will rarely need to compute it; you need to know how it reacts:

| Change to every value | Effect on the standard deviation |
| --- | --- |
| add or subtract the same constant | none: the values move together |
| multiply by $k$ | multiplied by $\lvert k \rvert$ |
| add a new value equal to the mean | decreases (unless it is already 0) |
| add a new value far from the mean | increases |

To compare two sets, compare the distances of their values from their own means. $\{1, 5, 9\}$ and $\{101, 105, 109\}$ have the same standard deviation; $\{1, 9, 17\}$ has twice as much as either.

### Extremes under constraints

"What is the greatest possible value of the largest number?" asks you to make every other number as small as the conditions allow, and then let the sum do the rest. Read every condition: whether the numbers must be different, positive, integers, and where the median sits.
`,
  examples: [
    {
      id: 'example-removed-value',
      title: 'Finding a removed value',
      problemMd: md`The mean of eight numbers is 15. When one number is removed, the mean of the remaining seven is 14. What number was removed?`,
      steps: [
        md`Switch to sums: the eight numbers add to $8 \times 15 = 120$ and the seven add to $7 \times 14 = 98$.`,
        md`The removed number is $120 - 98 = 22$.`,
        md`Check another way: removing a value above the mean pulls the mean down. Each of the seven remaining values "gave" 1 to cover the drop, so the removed value was $15 + 7 \times 1 = 22$.`,
      ],
      answerMd: md`The removed number is 22. Answering 1, the change in the mean, is the quick misreading.`,
    },
    {
      id: 'example-two-classes',
      title: 'Mean of two classes',
      problemMd: md`A class of 20 students has a mean score of 72, and a class of 30 students has a mean score of 82. What is the mean score of all 50 students?`,
      steps: [
        md`Total of scores: $20 \times 72 + 30 \times 82 = 1440 + 2460 = 3900$.`,
        md`Mean: $\frac{3900}{50} = 78$.`,
        md`Check with the balance: 78 is 6 above 72 and 4 below 82, and $6 : 4 = 3 : 2$, the inverse of the class sizes $20 : 30$.`,
      ],
      answerMd: md`The mean is 78. The simple average of the class means, 77, ignores that the larger class has the higher mean.`,
    },
    {
      id: 'example-consecutive-even',
      title: 'Consecutive even integers',
      problemMd: md`The sum of nine consecutive even integers is 234. What is the largest of them?`,
      steps: [
        md`The set is evenly spaced, so its mean equals its median: $\frac{234}{9} = 26$, the fifth (middle) number.`,
        md`The largest is four steps of 2 above the middle: $26 + 8 = 34$.`,
        md`Check: the integers run from 18 to 34, and $\frac{18 + 34}{2} \times 9 = 26 \times 9 = 234$.`,
      ],
      answerMd: md`The largest is 34. Stepping up by 1 instead of 2 gives 30, the slip of treating even integers as consecutive integers.`,
    },
  ],
  traps: [
    {
      title: 'Averaging averages',
      md: md`The mean of two groups is the simple average of their means only when the groups are the same size. Otherwise go back to sums, or use the balance, and the larger group pulls the result its way.`,
    },
    {
      title: 'A median from an unsorted list',
      md: md`The median is the middle of the **sorted** list. Questions often list values out of order, or add new values, so the old middle is no longer the middle. Sort first, every time.`,
    },
    {
      title: 'Shifting a set and expecting the spread to change',
      md: md`Adding the same number to every value moves the mean but leaves the standard deviation unchanged. Multiplying every value by a number scales the standard deviation by the same factor (ignoring sign).`,
    },
    {
      title: 'Ignoring "different" or "positive"',
      md: md`When you minimise the other values to make one value as large as possible, the conditions decide how small they may be. Different positive integers can be no smaller than 1, 2, 3 and so on; values above the median must exceed it if the numbers are different.`,
    },
  ],
  check: [
    {
      id: 'check-sixth-number',
      title: 'A sixth number lifts the mean',
      topic: 'Problem Solving',
      stemMd: md`The mean of five numbers is 18. When a sixth number is added, the mean of the six numbers is 20. What is the sixth number?`,
      options: [
        { id: 'A', text: md`20`, note: md`20 is the new mean, not the added number; adding 20 would lift the mean only to $\frac{110}{6} \approx 18.3$.` },
        { id: 'B', text: md`22`, note: md`This adds the rise of 2 only once; the new number must supply 2 extra for each of the five original numbers.` },
        { id: 'C', text: md`30`, note: '' },
        { id: 'D', text: md`32`, note: md`This adds 2 for six numbers; only the five original numbers needed lifting.` },
        { id: 'E', text: md`120`, note: md`120 is the sum of all six numbers, not the sixth number.` },
      ],
      answer: 'C',
      workingMd: md`Sum of five: $5 \times 18 = 90$. Sum of six: $6 \times 20 = 120$. The sixth number is $120 - 90 = 30$. Check: it equals the new mean plus 2 for each of the five old numbers, $20 + 5 \times 2 = 30$.`,
      lesson: 'Turn every mean into a sum before adding or removing values.',
    },
    {
      id: 'check-largest-possible',
      title: 'Largest value under a mean and median',
      topic: 'Problem Solving',
      stemMd: md`A list of five different positive integers has a mean of 12 and a median of 14. What is the greatest possible value of the largest integer in the list?`,
      options: [
        { id: 'A', text: md`28`, note: '' },
        { id: 'B', text: md`29`, note: md`This sets the fourth number equal to the median, 14, but the integers must be different, so it has to be at least 15.` },
        { id: 'C', text: md`30`, note: md`This repeats values ($1, 1, 14, 14$), ignoring that the integers are different.` },
        { id: 'D', text: md`43`, note: md`This leaves out the fourth number, which must be larger than 14 and also counts towards the sum.` },
        { id: 'E', text: md`46`, note: md`This subtracts only the median from the sum of 60, as if the other three numbers could be zero.` },
      ],
      answer: 'A',
      workingMd: md`The five integers add to $5 \times 12 = 60$. In order, $a < b < 14 < d < e$. To make $e$ as large as possible, make the others as small as allowed: $a = 1$, $b = 2$, $d = 15$. Then $e = 60 - 1 - 2 - 14 - 15 = 28$. Check: $\{1, 2, 14, 15, 28\}$ has sum 60, mean 12 and median 14.`,
      lesson: 'To maximise one value, minimise all the others within every stated condition.',
    },
    {
      id: 'check-smaller-spread',
      title: 'Which set is less spread out?',
      topic: 'Problem Solving',
      stemMd: md`Set $S$ is $\{10, 14, 18, 22, 26\}$. Which of the following sets has a smaller standard deviation than $S$?`,
      options: [
        { id: 'A', text: md`$\{15, 19, 23, 27, 31\}$`, note: md`Adding 5 to every value moves the set without changing its spread; the standard deviation is the same.` },
        { id: 'B', text: md`$\{20, 28, 36, 44, 52\}$`, note: md`Doubling every value doubles every distance from the mean, so the standard deviation doubles.` },
        { id: 'C', text: md`$\{6, 14, 18, 22, 30\}$`, note: md`The two outer values moved further from the mean of 18, so the spread increased.` },
        { id: 'D', text: md`$\{10, 14, 18, 18, 22, 26\}$`, note: '' },
        { id: 'E', text: md`$\{10, 14, 18, 22, 26, 34\}$`, note: md`34 lies far from the mean, so adding it increases the spread.` },
      ],
      answer: 'D',
      workingMd: md`$S$ has mean 18, and its squared distances from the mean are $64, 16, 0, 16, 64$, a total of 160, so its variance is $\frac{160}{5} = 32$. Adding another 18, the mean itself, keeps the mean at 18 and the total at 160 but spreads it over six values: $\frac{160}{6} \approx 26.7 < 32$. The standard deviation therefore falls. Each other option keeps or increases the spread.`,
      lesson: 'Adding a value at the mean lowers the standard deviation; shifting all values leaves it alone.',
    },
  ],
  takeaways: [
    'Sum = mean × number of values: switch to sums first.',
    'A weighted mean lies closer to the larger group.',
    'Sort before finding a median; in an evenly spaced set, mean = median = (first + last) ÷ 2.',
    'Shifting values leaves the standard deviation alone; scaling scales it; a value at the mean lowers it.',
  ],
  practice: { examKey: 'gmat', domain: 'quant-problem-solving', skill: 'qps-arithmetic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const quantArithmeticUnit: Unit = {
  slug: 'quant-arithmetic',
  title: 'Quantitative Reasoning: arithmetic',
  summary: 'GMAT Quantitative Reasoning is 21 problem-solving questions in 45 minutes, without a calculator, measuring arithmetic and algebra. This unit covers the arithmetic: number properties, fractions, decimals and percents, ratios and mixtures, rates and work, and the statistics the section uses, each taught with the hand methods that keep you inside the time.',
  lessons: [numberProperties, fractionsDecimalsPercents, ratiosAndMixtures, ratesWorkTravel, statisticsForQuant],
};
