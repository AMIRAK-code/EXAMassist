import { md, type Lesson, type Unit } from '../../types';

/**
 * GRE Quantitative Reasoning question formats: quantitative comparison,
 * numeric entry and select-one-or-more. All problems are original.
 */

const qcA = md`Quantity A is greater.`;
const qcB = md`Quantity B is greater.`;
const qcC = md`The two quantities are equal.`;
const qcD = md`The relationship cannot be determined from the information given.`;

const quantitativeComparisonLesson: Lesson = {
  slug: 'quantitative-comparison-strategy',
  title: 'Quantitative comparison: strategy for the four fixed choices',
  summary: 'Compare two quantities without computing more than you must: simplify both sides safely, test deliberate cases, and know when the answer is fixed.',
  minutes: 22,
  objectives: [
    'Explain what each of the four fixed choices means and when the fourth one is impossible.',
    'Simplify both quantities together using only operations that keep the comparison intact.',
    'Choose test values on purpose, including zero, negatives and fractions, to prove that a relationship can change.',
  ],
  teachMd: md`
### The format

Quantitative Comparison is one of the question types in GRE Quantitative Reasoning. Each question shows two quantities, Quantity A and Quantity B, sometimes with information above them that applies to both. You do not calculate an answer; you decide how the two quantities compare. The choices are always the same four:

| Choice | Means |
| --- | --- |
| Quantity A is greater. | A is greater for **every** situation the information allows |
| Quantity B is greater. | B is greater for every situation allowed |
| The two quantities are equal. | they are equal for every situation allowed |
| The relationship cannot be determined from the information given. | different allowed situations give different relationships |

The word "every" in the first three rows is the whole game. "A is greater" is wrong if even one allowed value makes the quantities equal.

### When "cannot be determined" is impossible

If both quantities are fixed numbers, with no variables and no unknown figures, one number is greater than, less than or equal to the other, and that never changes. So the fourth choice is out the moment you see two fixed numbers. That leaves a three-way choice, and often a quick estimate settles it.

When variables are involved, the fourth choice needs proof: **two allowed cases that give different relationships**. One case can never show it, and one case can never rule it out either.

### Strategy 1: simplify both sides together

Think of an unknown sign, $?$, between Quantity A and Quantity B, and change both sides in the same way, as you would solve an inequality. These moves keep the comparison intact:

- add or subtract the same quantity on both sides;
- multiply or divide both sides by the same **positive** quantity;
- square both sides, when both are known to be non-negative.

These moves are **not** safe: multiplying or dividing by a quantity that could be negative or zero (a negative multiplier flips the comparison, and zero erases it), and squaring when the signs are unknown ($-3 < 2$, but $9 > 4$).

For example, with Quantity A $\frac{x}{3} + 5$ and Quantity B $\frac{x}{3} + 4$, subtract $\frac{x}{3}$ from both sides: 5 against 4. Quantity A is greater for every $x$, without knowing anything about $x$.

### Strategy 2: test values on purpose

When variables remain and simplifying stalls, try values, but choose them deliberately. Values must satisfy every condition given. Then cover the kinds of number that behave unusually:

| Try | Because |
| --- | --- |
| 0 | products and powers become 0 |
| 1 and $-1$ | powers do not change size (or only change sign) |
| a negative number | multiplying by it reverses order; odd powers stay negative |
| a fraction between 0 and 1 | squaring makes it **smaller** |
| a large number | shows which side grows faster |

If two ordinary values give the same relationship, try an unusual one before you commit. The common mistake is testing only positive whole numbers greater than 1, which hide every one of these behaviours.

### Strategy 3: estimate instead of computing

With fixed numbers, you need only the comparison, not the values. To compare $\frac{17}{35}$ with $\frac{1}{2}$, note that half of 35 is 17.5, and $17 < 17.5$, so $\frac{17}{35} < \frac{1}{2}$. No division needed. Compare against easy benchmarks (½, 1, a round number) and decide whether the benchmark separates the two quantities. When an estimate is too close to call, compute exactly. The on-screen calculator is there for that.

### Figures

When a question comes with a figure, base the comparison on what is given in words and numbers, and on what geometry forces, not on how the drawing looks. Two lengths that look equal may not be stated to be equal, and an angle that looks like a right angle may not be one.

### A routine

1. Read the information above the quantities and note every condition (integer? positive? range?).
2. Are both quantities fixed numbers? If so, rule out "cannot be determined".
3. Simplify both sides together, with safe moves only.
4. If variables remain, test at least two contrasting allowed values, including unusual ones.
5. Choose. If two cases disagree, the answer is "cannot be determined"; if every case you tried agrees and the algebra explains why, choose that relationship.
`,
  examples: [
    {
      id: 'example-square-vs-number',
      title: 'Proving that the relationship can change',
      problemMd: md`$x > 0$

Quantity A: $x^2$

Quantity B: $x$`,
      steps: [
        md`Both quantities contain a variable, so "cannot be determined" is possible. Look for two allowed cases that disagree.`,
        md`Try an ordinary value: $x = 2$ gives $4$ against $2$, so Quantity A is greater.`,
        md`Try a fraction between 0 and 1, which the condition allows: $x = \frac{1}{2}$ gives $\frac{1}{4}$ against $\frac{1}{2}$, so Quantity B is greater.`,
        md`Two allowed values give different relationships (and $x = 1$ even makes them equal), so no single relationship holds.`,
      ],
      answerMd: md`The relationship cannot be determined. The tempting answer, "Quantity A is greater", comes from testing only whole numbers greater than 1.`,
    },
    {
      id: 'example-fixed-fractions',
      title: 'Two fixed numbers',
      problemMd: md`Quantity A: $\frac{3}{7} + \frac{5}{9}$

Quantity B: $1$`,
      steps: [
        md`Both quantities are fixed numbers, so "cannot be determined" is out.`,
        md`Try benchmarks: $\frac{3}{7}$ is a little under $\frac{1}{2}$ and $\frac{5}{9}$ a little over it, so the estimate is too close to call. Compute exactly.`,
        md`Common denominator 63: $\frac{3}{7} = \frac{27}{63}$ and $\frac{5}{9} = \frac{35}{63}$, so the sum is $\frac{62}{63}$.`,
        md`Second route: $\frac{3}{7} = 1 - \frac{4}{7}$ and $\frac{5}{9} = 1 - \frac{4}{9}$, so the sum is $2 - \left(\frac{4}{7} + \frac{4}{9}\right) = 2 - \frac{64}{63} = \frac{62}{63}$. The two routes agree.`,
      ],
      answerMd: md`$\frac{62}{63} < 1$, so Quantity B is greater. Rounding each fraction to $\frac{1}{2}$ suggests the quantities are equal, which is the trap here.`,
    },
    {
      id: 'example-negative-integer',
      title: 'Why two test values may not be enough',
      problemMd: md`$x$ is a negative integer.

Quantity A: $3x$

Quantity B: $x - 5$`,
      steps: [
        md`Simplify safely: subtract $x$ from both sides. Quantity A becomes $2x$ and Quantity B becomes $-5$.`,
        md`Try $x = -1$: $-2$ against $-5$, so A is greater. Try $x = -2$: $-4$ against $-5$, A again.`,
        md`Two values agree, but nothing in the algebra says they must. $2x > -5$ only when $x > -2.5$. Try $x = -3$: $-6$ against $-5$, so B is greater.`,
        md`Check in the original quantities: $x = -3$ gives $3x = -9$ and $x - 5 = -8$, and $-9 < -8$. Confirmed.`,
      ],
      answerMd: md`The relationship cannot be determined. "Quantity A is greater" is tempting after trying $-1$ and $-2$; the simplified form $2x$ against $-5$ shows where the relationship switches.`,
    },
  ],
  traps: [
    {
      title: 'Testing only easy positive integers',
      md: md`Values like 2, 3 and 10 hide what happens at 0, at negatives and at fractions between 0 and 1. Unless the information rules them out, test at least one unusual value before you choose a fixed relationship.`,
    },
    {
      title: 'Dividing by something that might be negative',
      md: md`Dividing both quantities by $x$ when $x$ could be negative silently flips the comparison for those values, and dividing by $x$ when $x$ could be 0 is not allowed at all. Divide only by quantities known to be positive; otherwise, subtract or test values.`,
    },
    {
      title: 'Choosing "cannot be determined" for fixed numbers',
      md: md`Two numbers always have a definite relationship. If a comparison of fixed numbers feels too hard, the fix is a better estimate or an exact calculation, never the fourth choice.`,
    },
    {
      title: 'Reading values off a figure',
      md: md`A drawing that looks precise can still mislead. Use only what is given and what the geometry forces; if the given information allows the figure to change shape, the relationship may change too.`,
    },
  ],
  check: [
    {
      id: 'check-qc-fractions-of-numbers',
      title: 'Two fixed products',
      topic: 'Quantitative Comparison',
      stemMd: md`Quantity A: $\frac{7}{8}$ of $96$

Quantity B: $\frac{6}{7}$ of $98$`,
      options: [
        { id: 'A', text: qcA, note: md`Comes from noticing that $\frac{7}{8} > \frac{6}{7}$ and stopping there; the larger number in Quantity B makes up the difference exactly.` },
        { id: 'B', text: qcB, note: md`Comes from noticing that $98 > 96$ and ignoring that the fraction applied to it is smaller.` },
        { id: 'C', text: qcC, note: '' },
        { id: 'D', text: qcD, note: md`Both quantities are fixed numbers, so their relationship is always determined.` },
      ],
      answer: 'C',
      workingMd: md`Quantity A: $96 \div 8 = 12$, and $12 \times 7 = 84$. Quantity B: $98 \div 7 = 14$, and $14 \times 6 = 84$. Both are 84. Check: $\frac{7 \times 96}{8} = \frac{672}{8} = 84$ and $\frac{6 \times 98}{7} = \frac{588}{7} = 84$.`,
      lesson: 'When each quantity has one larger factor and one smaller one, compute both; comparing the factors one at a time decides nothing.',
    },
    {
      id: 'check-qc-integer-cube',
      title: 'An integer with a small square',
      topic: 'Quantitative Comparison',
      stemMd: md`$k$ is an integer and $k^2 < 10$.

Quantity A: $k^3$

Quantity B: $k$`,
      options: [
        { id: 'A', text: qcA, note: md`Comes from testing only positive values such as $k = 2$ (8 against 2) or $k = 3$; negative values are also allowed.` },
        { id: 'B', text: qcB, note: md`Comes from testing only negative values such as $k = -2$ ($-8$ against $-2$); positive values are also allowed.` },
        { id: 'C', text: qcC, note: md`Comes from testing only $k = 0$, $1$ or $-1$, the values where a cube equals the number itself; $k = 2$ is also allowed.` },
        { id: 'D', text: qcD, note: '' },
      ],
      answer: 'D',
      workingMd: md`The condition allows $k = -3, -2, -1, 0, 1, 2, 3$. With $k = 2$: $8 > 2$, Quantity A greater. With $k = 0$: $0 = 0$, equal. With $k = -2$: $-8 < -2$, Quantity B greater. Different allowed values give different relationships.`,
      lesson: 'List the allowed values when there are few of them, and include 0 and the negatives.',
    },
    {
      id: 'check-qc-ratio-plus-one',
      title: 'Adding 1 to top and bottom',
      topic: 'Quantitative Comparison',
      stemMd: md`$a > b > 0$

Quantity A: $\frac{a}{b}$

Quantity B: $\frac{a + 1}{b + 1}$`,
      options: [
        { id: 'A', text: qcA, note: '' },
        { id: 'B', text: qcB, note: md`Assumes that adding to the numerator makes a fraction bigger, forgetting that the same amount was added to the denominator.` },
        { id: 'C', text: qcC, note: md`Assumes that adding the same number to the top and bottom keeps a ratio unchanged; that is true only for multiplying both by the same number.` },
        { id: 'D', text: qcD, note: md`The conditions fix the relationship: with $a > b > 0$, every allowed pair gives the same result, as the algebra shows.` },
      ],
      answer: 'A',
      workingMd: md`Test values first: $a = 3$, $b = 1$ gives $3$ against $\frac{4}{2} = 2$; $a = 2$, $b = 1$ gives $2$ against $1.5$. Both say A. The algebra confirms it for every allowed pair: $\frac{a}{b} - \frac{a+1}{b+1} = \frac{a(b+1) - b(a+1)}{b(b+1)} = \frac{a - b}{b(b+1)}$, which is positive because $a > b$ and $b > 0$. So Quantity A is always greater.`,
      lesson: 'Adding the same positive amount to the top and bottom of a fraction greater than 1 pulls it down towards 1.',
    },
  ],
  takeaways: [
    'Each of the first three choices must hold for every allowed value; one counter-case rules it out.',
    'Two fixed numbers can never give "cannot be determined".',
    'Simplify both sides with safe moves only: never multiply or divide by something that might be negative or zero.',
    'Test 0, negatives and fractions between 0 and 1 before trusting a pattern from easy integers.',
  ],
  practice: { examKey: 'gre', domain: 'quant-algebra', skill: 'alg-relations-functions-equations-inequalities' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const numericEntryLesson: Lesson = {
  slug: 'numeric-entry-and-multiple-answer',
  title: 'Numeric entry and select-one-or-more questions',
  summary: 'Answer numeric entry questions with no choices to lean on, and test every choice of a select-one-or-more question against one simplified condition.',
  minutes: 20,
  objectives: [
    'Answer a numeric entry question in the quantity, unit and rounding the question asks for, and verify it without answer choices.',
    'Reduce a select-one-or-more condition to a simple form, then test each choice against it.',
    'Tell "could be" from "must be" and handle the endpoints of an inequality correctly.',
  ],
  teachMd: md`
### The four quantitative formats

GRE Quantitative Reasoning uses four question types: Quantitative Comparison; multiple choice with one answer from five; multiple choice where you select one or more answer choices; and Numeric Entry. Any of them can stand alone or be part of a Data Interpretation set built around shared data. An on-screen calculator is available throughout the Quantitative Reasoning sections. The previous lesson covered quantitative comparison; this one covers the two formats in which the usual habits of a single-answer multiple-choice question stop working.

### Numeric entry: no choices to lean on

In a numeric entry question you produce the number yourself. That removes two familiar safety nets: you cannot work backwards from the choices, and a wrong answer will not be caught by its absence from the list. The work is the same; the checking has to come from you.

Three habits protect you:

1. **Answer the question asked.** Underline, in your head, the exact quantity: the percent or the number, the total or the part, the original value or the new one. Many wrong entries are correct answers to a neighbouring question.
2. **Match the form and units.** If the question asks for a percent, decide whether the entry is 57.5 (the percent) or 0.575 (the decimal) by reading how the question frames it. If it gives a unit, answer in that unit.
3. **Round once, at the end.** When the question asks for an answer to the nearest tenth or whole number, carry full precision through every step and round only the final result. Rounding an intermediate value can move the final answer.

Then check by a second route: substitute the answer back into the situation, or solve it a different way. Without choices, this is the only check you get.

### The calculator

The on-screen calculator is useful for awkward arithmetic: dividing 300 by 4.1667, or multiplying several decimals. It does not set up the problem. Write the expression first, estimate its size, and compare the calculator's result with your estimate. A result ten times too large is a keying slip, and an estimate catches it in a second.

### Select one or more: one condition, tested many times

These questions give several choices and ask you to select all that are correct; the number of correct choices is not fixed. Decide each choice on its own and do not stop at the first one that works.

The efficient approach is to simplify the condition **once**, then test each choice against the simple form:

- An inequality becomes a range: $3 < 2x - 5 \le 11$ becomes $4 < x \le 8$.
- A divisibility condition becomes a list of required factors.
- A geometric condition becomes a range of possible lengths or angles.

Testing each choice against the original condition repeats the algebra five times and multiplies the chances of a slip.

### "Could be" and "must be"

Read which one the question asks.

- **Could be** (or "which of the following are possible"): a choice is correct if **at least one** allowed situation produces it. Find one example.
- **Must be** (or "which must be true"): a choice is correct only if **every** allowed situation produces it. One counter-example rules it out.

The same set of choices can have different answers under the two wordings.

### Endpoints

With a range, check each boundary: is it "less than" or "less than or equal to"? In $4 < x \le 8$, the value 8 is allowed and 4 is not. Choices that sit exactly on a boundary are there to test this.
`,
  examples: [
    {
      id: 'example-tank-percent',
      title: 'Numeric entry: the right quantity in the right form',
      problemMd: md`A tank holds 240 litres when full. It is 35% full, and then 54 litres are added. What percent of the tank's capacity is now filled? (Enter the percent, without the percent sign.)`,
      steps: [
        md`Find the starting volume: $0.35 \times 240 = 84$ litres.`,
        md`Add the new water: $84 + 54 = 138$ litres.`,
        md`Convert to a percent of capacity, as the question asks: $\frac{138}{240} = 0.575$, which is $57.5\%$. The entry is 57.5, not 0.575 and not 138.`,
        md`Second route: 54 litres is $\frac{54}{240} = 22.5\%$ of the tank, and $35\% + 22.5\% = 57.5\%$. The two routes agree.`,
      ],
      answerMd: md`Enter 57.5. Tempting wrong entries: 138 (the volume, not the percent), 0.575 (the decimal, when the question asked for the percent) and 89 (adding 54 to 35 as if 54 litres were 54%).`,
    },
    {
      id: 'example-inequality-range',
      title: 'Select one or more: reduce once, test each',
      problemMd: md`Which of the following could be the value of $x$ if $3 < 2x - 5 \le 11$? Indicate all such values.

3, 4, 6, 8, 9`,
      steps: [
        md`Simplify once. Add 5 to every part: $8 < 2x \le 16$. Divide every part by 2 (positive, so the signs stay): $4 < x \le 8$.`,
        md`Test each choice against $4 < x \le 8$: 3 is below the range; 4 is the left endpoint, which is excluded because the inequality is strict; 6 is inside; 8 is the right endpoint, which is included; 9 is above.`,
        md`Check the endpoints in the original: $x = 4$ gives $2x - 5 = 3$, and $3 < 3$ is false. $x = 8$ gives $11$, and $11 \le 11$ is true.`,
      ],
      answerMd: md`6 and 8. Including 4 (a strict endpoint) or leaving out 8 (an included endpoint) are the two tempting slips.`,
    },
    {
      id: 'example-must-divide',
      title: 'Select one or more: "must be"',
      problemMd: md`$n$ is a positive integer, and $n^2$ is divisible by 12. Which of the following must be divisors of $n$? Indicate all such numbers.

2, 3, 4, 6, 9`,
      steps: [
        md`Reduce the condition. $12 = 2^2 \times 3$. Since $3$ divides $n^2$ and 3 is prime, 3 divides $n$. Since $2$ divides $n^2$, 2 divides $n$. So $n$ must be a multiple of 6.`,
        md`"Must be" needs every allowed $n$. The smallest allowed value is $n = 6$: $36 = 12 \times 3$, so it is allowed. Use it as the counter-example test.`,
        md`2, 3 and 6 divide every multiple of 6, so they must divide $n$. 4 does not divide 6, and 9 does not divide 6, so neither must divide $n$.`,
      ],
      answerMd: md`2, 3 and 6. Choosing 4 comes from reading the factor $2^2$ in 12 as a factor of $n$; but $n$ needs only one factor of 2 for $n^2$ to have two.`,
    },
  ],
  traps: [
    {
      title: 'Answering a neighbouring question',
      md: md`The volume instead of the percent, the part instead of the total, the new price instead of the change: numeric entry gives no list to show you that your number is not among the expected answers. Reread the last line of the question before you enter anything.`,
    },
    {
      title: 'Rounding too early',
      md: md`Rounding $\frac{5}{3}$ hours to 1.7 in the middle of a calculation can change the final answer in the first decimal place. Keep full precision, or exact fractions, until the last step.`,
    },
    {
      title: 'Stopping after the first correct choice',
      md: md`In a select-one-or-more question, finding one correct choice tells you nothing about the others. Test every choice against the simplified condition.`,
    },
    {
      title: 'Treating "could be" as "must be", or the reverse',
      md: md`"Could be" needs one example; "must be" needs every case. Reading one as the other changes which choices are correct, so check the wording before testing.`,
    },
  ],
  check: [
    {
      id: 'check-removed-number',
      title: 'Numeric entry: a removed value',
      topic: 'Numeric Entry',
      stemMd: md`The mean of five numbers is 18. When one of the numbers is removed, the mean of the remaining four numbers is 16. What number was removed?`,
      options: [
        { id: 'A', text: md`2`, note: md`This is the difference between the two means, not a number in the list.` },
        { id: 'B', text: md`17`, note: md`This averages the two means, which has no meaning here.` },
        { id: 'C', text: md`18`, note: md`This is the original mean; removing a number equal to the mean would leave the mean at 18, not 16.` },
        { id: 'D', text: md`26`, note: '' },
        { id: 'E', text: md`34`, note: md`This adds the two means; it does not use the number of values at all.` },
      ],
      answer: 'D',
      workingMd: md`Work with totals, not means. The five numbers total $5 \times 18 = 90$. The remaining four total $4 \times 16 = 64$. The removed number is $90 - 64 = 26$. Check: putting 26 back, $\frac{64 + 26}{5} = \frac{90}{5} = 18$.`,
      lesson: 'When values are added to or removed from a set, convert every mean to a total first.',
    },
    {
      id: 'check-absolute-value-could-be',
      title: 'Select one or more: which values are possible?',
      topic: 'Multiple-choice: select one or more answer choices',
      stemMd: md`If $|x - 3| < 4$, which of the following could be the value of $x$? Consider each value separately.

- I. $-2$
- II. $0$
- III. $6.5$`,
      options: [
        { id: 'A', text: md`I only`, note: md`$-2$ is outside the range: $|-2 - 3| = 5$, which is not less than 4. This comes from solving the left half as $x > -7$, subtracting 3 instead of adding it.` },
        { id: 'B', text: md`II only`, note: md`Stops after finding that 0 works. 6.5 also satisfies the condition, since $|6.5 - 3| = 3.5 < 4$.` },
        { id: 'C', text: md`I and II only`, note: md`Includes $-2$, which gives $|-5| = 5$, not less than 4, and leaves out 6.5, which works.` },
        { id: 'D', text: md`II and III only`, note: '' },
        { id: 'E', text: md`I, II and III`, note: md`$-2$ fails the condition: its distance from 3 is 5, more than 4.` },
      ],
      answer: 'D',
      workingMd: md`Reduce the condition once: $|x - 3| < 4$ means $-4 < x - 3 < 4$, so $-1 < x < 7$. Test each value: $-2$ is below $-1$, so it fails; $0$ is inside; $6.5$ is inside. Direct check: $|0 - 3| = 3 < 4$ and $|6.5 - 3| = 3.5 < 4$, but $|-2 - 3| = 5$.`,
      lesson: 'Turn an absolute-value condition into a range once, then test every choice against the range.',
    },
    {
      id: 'check-round-trip-speed',
      title: 'Numeric entry: average speed for a round trip',
      topic: 'Numeric Entry',
      stemMd: md`A car travels 150 km at an average speed of 60 km/h and returns along the same 150 km at an average speed of 90 km/h. What is its average speed for the whole round trip, in kilometres per hour? (Give the answer to the nearest tenth if it is not a whole number.)`,
      options: [
        { id: 'A', text: md`36`, note: md`Divides the one-way distance, 150 km, by the total time; the round trip is 300 km.` },
        { id: 'B', text: md`60`, note: md`Assumes each leg takes 2.5 hours; the return at 90 km/h takes only $\frac{5}{3}$ hours.` },
        { id: 'C', text: md`71.4`, note: md`Rounds the return time to 1.7 hours before dividing; $300 \div 4.2 \approx 71.4$. Rounding only at the end gives a whole number.` },
        { id: 'D', text: md`72`, note: '' },
        { id: 'E', text: md`75`, note: md`Averages the two speeds; the car spends longer at the slower speed, so the average speed is below 75.` },
      ],
      answer: 'D',
      workingMd: md`Outward time: $\frac{150}{60} = 2.5$ hours. Return time: $\frac{150}{90} = \frac{5}{3}$ hours. Total time: $\frac{5}{2} + \frac{5}{3} = \frac{25}{6}$ hours. Average speed: $300 \div \frac{25}{6} = \frac{300 \times 6}{25} = 72$ km/h. Second route: for equal distances, the average speed is $\frac{2 \times 60 \times 90}{60 + 90} = \frac{10\,800}{150} = 72$.`,
      lesson: 'Average speed is total distance over total time; keep exact fractions until the last step.',
    },
  ],
  takeaways: [
    'In numeric entry, answer the exact quantity asked, in its form and unit, and check by a second route.',
    'Round once, at the end.',
    'In select-one-or-more questions, simplify the condition once and test every choice against it.',
    '"Could be" needs one example; "must be" needs every case.',
  ],
  practice: { examKey: 'gre', domain: 'quant-arithmetic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const quantQuestionTypesUnit: Unit = {
  slug: 'quant-question-types',
  title: 'Quantitative question types',
  summary: 'GRE Quantitative Reasoning uses four formats: quantitative comparison, multiple choice with one answer, multiple choice with one or more answers, and numeric entry. This unit teaches the strategy each format needs, apart from the maths itself, which the following units cover topic by topic.',
  lessons: [quantitativeComparisonLesson, numericEntryLesson],
};
