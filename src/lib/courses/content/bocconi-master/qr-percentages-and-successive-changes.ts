import { md, type Lesson } from '../../types';

export const percentagesAndSuccessiveChangesLesson: Lesson = {
  slug: 'percentages-and-successive-changes',
  title: 'Percentages and successive changes',
  summary: 'Work out percentages in your head, treat every change as a multiplier, chain and reverse changes, and keep percent and percentage points apart.',
  minutes: 20,
  objectives: [
    'Compute percentages mentally by building them from 10%, 5% and 1%, or by swapping the two numbers.',
    'Write any increase or decrease as a multiplier, and combine successive changes by multiplying.',
    'Recover an original value after a change, and tell a change in percent from a change in percentage points.',
  ],
  teachMd: md`
### Percentages in your head

A percent is a fraction out of 100, so $p\%$ of $x$ is $\frac{p}{100} \times x$. Without a calculator, build awkward percentages from easy ones:

- $10\%$: move the decimal point one place left. $10\%$ of 260 is 26.
- $5\%$: half of $10\%$. $1\%$: move the point two places.
- $15\%$ of 260 $= 26 + 13 = 39$; $19\%$ of 260 $= 20\% - 1\% = 52 - 2.6 = 49.4$.

Some percentages are simple fractions, and the fraction is faster: $25\% = \frac{1}{4}$, $20\% = \frac{1}{5}$, $12.5\% = \frac{1}{8}$, $33\frac{1}{3}\% = \frac{1}{3}$, $75\% = \frac{3}{4}$.

One more trick: **$x\%$ of $y$ equals $y\%$ of $x$**, because both are $\frac{xy}{100}$. So $18\%$ of 50 is $50\%$ of 18, which is 9.

### Every change is a multiplier

An increase of $p\%$ multiplies by $1 + \frac{p}{100}$; a decrease of $p\%$ multiplies by $1 - \frac{p}{100}$. Up 6% is $\times 1.06$; down 35% is $\times 0.65$; up 100% is $\times 2$.

Multipliers make three things easy:

1. **New value in one step.** €420 cut by 15% is $420 \times 0.85 = 357$.
2. **Successive changes multiply.** Up 20% then down 25% is $1.2 \times 0.75 = 0.9$, a net fall of 10%. The order does not matter, since multiplication is commutative.
3. **Reversing a change divides.** If a price after a 25% rise is 1,150, the price before was $\frac{1150}{1.25} = 920$.

For two successive changes of $a\%$ and $b\%$ (negative for a fall), the net change is
$$a + b + \frac{ab}{100} \text{ percent}.$$
For $+20\%$ then $-25\%$: $20 - 25 + \frac{20 \times (-25)}{100} = -5 - 5 = -10\%$, matching the multiplier route. The extra term $\frac{ab}{100}$ is why successive percents never simply add.

### The base of a percent change

$$\text{percent change} = \frac{\text{new} - \text{old}}{\text{old}} \times 100\%$$

The base is always the starting value. A rise from 80 to 100 is $\frac{20}{80} = 25\%$; the fall from 100 back to 80 is $\frac{20}{100} = 20\%$. In the same way, "A is 25% more than B" means $A = 1.25B$, so $B = \frac{A}{1.25} = 0.8A$, which is 20% less than $A$, not 25%.

The same idea separates **markup** from **margin**. An item that costs 80 to make and sells for 100 has a markup of $\frac{20}{80} = 25\%$ on cost and a margin of $\frac{20}{100} = 20\%$ on price. Read which base the question names.

### Percentage points

When the quantity is itself a rate, there are two different changes. An interest rate going from 4% to 5% rises by **1 percentage point** (a subtraction) and by **25 percent** (a percent change of the rate, $\frac{1}{4}$). Questions often offer both numbers; decide which one was asked for before you look at the options.

### Percent of a percent, and "what percent of"

A percent of a percent is a product of fractions: $40\%$ of $25\%$ of a budget is $0.4 \times 0.25 = 0.1$, which is $10\%$ of the budget. Questions of the form "what percent of A is B?" are a single division, $\frac{B}{A} \times 100\%$, with A, the thing after "of", underneath. So 18 is $\frac{18}{72} = \frac{1}{4} = 25\%$ of 72, while 72 is $\frac{72}{18} = 400\%$ of 18. Simplify the fraction before converting: a fraction you recognise, such as $\frac{1}{4}$ or $\frac{3}{8}$, turns into a percent at once, which spares you long division.

### Estimate before you choose

A quick sense check catches most slips: a discount should leave a smaller number, two rises should give more than either alone, and an original price recovered from a sale price must be larger than the sale price. If an answer breaks such a rule, a multiplier went the wrong way.
`,
  examples: [
    {
      id: 'example-up-down',
      title: 'Up 20%, then down 25%',
      problemMd: md`A share price rises by 20% in one month and falls by 25% the next. What is the overall percent change?`,
      steps: [
        md`Multipliers: up 20% is $\times 1.2$, down 25% is $\times 0.75$.`,
        md`Successive changes multiply: $1.2 \times 0.75 = 0.9$.`,
        md`A multiplier of 0.9 is a 10% decrease.`,
        md`Check with 100: up 20% gives 120; 25% of 120 is 30, so it falls to 90, which is 10% below 100.`,
      ],
      answerMd: md`The price falls by 10% overall. Adding the percents gives $-5\%$, the tempting wrong answer: the 25% fall is taken of the larger, risen price.`,
    },
    {
      id: 'example-reverse',
      title: 'Rent before a rise',
      problemMd: md`After a 25% increase, a monthly rent is €1,150. What was it before the increase?`,
      steps: [
        md`The increase multiplied the old rent by 1.25: $\text{old} \times 1.25 = 1150$.`,
        md`Reverse by dividing: $\text{old} = \frac{1150}{1.25}$. Since $1.25 = \frac{5}{4}$, this is $1150 \times \frac{4}{5} = 920$.`,
        md`Check forwards: 25% of 920 is 230, and $920 + 230 = 1150$.`,
      ],
      answerMd: md`The old rent was €920. Subtracting 25% of 1,150 gives €862.50, which is wrong because the 25% was taken of the old rent, not the new one.`,
    },
    {
      id: 'example-swap',
      title: 'A percentage by swapping',
      problemMd: md`Compute $36\%$ of 25 without a calculator.`,
      steps: [
        md`Swap the two numbers: $36\%$ of 25 equals $25\%$ of 36, since both are $\frac{36 \times 25}{100}$.`,
        md`$25\%$ is a quarter, and a quarter of 36 is 9.`,
        md`Check directly: $\frac{36 \times 25}{100} = \frac{900}{100} = 9$.`,
      ],
      answerMd: md`$36\%$ of 25 is 9.`,
    },
  ],
  traps: [
    {
      title: 'Adding successive percents',
      md: md`Up 10% then up 20% is $1.1 \times 1.2 = 1.32$, a 32% rise, not 30%. The second change acts on a number already changed by the first. Multiply the multipliers every time.`,
    },
    {
      title: 'Reversing with the same percent',
      md: md`To undo a 25% rise you divide by 1.25, which is a 20% fall, not a 25% fall. In the same way, to recover a price before a 30% discount you divide by 0.7; adding 30% to the sale price gives too little.`,
    },
    {
      title: 'The wrong base',
      md: md`Percent change is measured from the starting value. When a question says "compared with last year" or "more than B", the year or the B is the base. Name the base before you divide.`,
    },
    {
      title: 'Percent versus percentage points',
      md: md`A rate going from 8% to 6% falls by 2 percentage points and by 25 percent. Both numbers may sit among the options; reread the question to see which it asks for.`,
    },
  ],
  check: [
    {
      id: 'check-two-rises',
      title: 'Two years of growth',
      topic: 'Quantitative reasoning: percentages',
      stemMd: md`A town's population grows by 10% in one year and by 20% in the next. By what percent has it grown over the two years?`,
      options: [
        { id: 'A', text: md`2%`, note: md`This is only the cross term $\frac{10 \times 20}{100}$, the growth on the first year's growth; it leaves out the two main changes.` },
        { id: 'B', text: md`30%`, note: md`Adds the two percents, ignoring that the 20% acts on a population that has already grown by 10%.` },
        { id: 'C', text: md`32%`, note: '' },
        { id: 'D', text: md`132%`, note: md`1.32 is the combined multiplier: the final population is 132% **of** the original, which is growth of 32%.` },
      ],
      answer: 'C',
      workingMd: md`The combined multiplier is $1.1 \times 1.2 = 1.32$, a growth of 32%. With the formula: $10 + 20 + \frac{10 \times 20}{100} = 32$. With numbers: 1,000 grows to 1,100, then 20% more is 1,320.`,
      lesson: 'Successive changes multiply, so their percents never simply add.',
    },
    {
      id: 'check-coat-before-sale',
      title: 'Price before a discount',
      topic: 'Quantitative reasoning: percentages',
      stemMd: md`After a 30% discount, a coat costs €182. What was its price before the discount?`,
      options: [
        { id: 'A', text: md`€127.40`, note: md`Applies the 30% discount a second time to the sale price instead of undoing it.` },
        { id: 'B', text: md`€236.60`, note: md`Adds 30% of €182; the discount was 30% of the original price, which is larger than €182.` },
        { id: 'C', text: md`€260.00`, note: '' },
        { id: 'D', text: md`€606.67`, note: md`Divides by 0.3, the discount, instead of by 0.7, the share of the price that remains after the discount.` },
      ],
      answer: 'C',
      workingMd: md`A 30% discount leaves 70% of the price: $\text{original} \times 0.7 = 182$, so $\text{original} = \frac{182}{0.7} = \frac{1820}{7} = 260$. Check: 30% of 260 is 78, and $260 - 78 = 182$.`,
      lesson: 'To recover a value before a change, divide by the multiplier of that change.',
    },
    {
      id: 'check-unemployment-points',
      title: 'Which change is it?',
      topic: 'Quantitative reasoning: percentages',
      stemMd: md`A country's unemployment rate falls from 8% to 6%. Which statement is correct?`,
      options: [
        { id: 'A', text: md`The rate fell by 2%.`, note: md`The fall of 2 is in percentage points; as a percent of the old rate it is 25%, so "2%" misstates it.` },
        { id: 'B', text: md`The rate fell by 2 percentage points, a decrease of 25%.`, note: '' },
        { id: 'C', text: md`The rate fell by 25 percentage points.`, note: md`Mixes the two measures: 25 is the percent change, while the difference in points is only 2.` },
        { id: 'D', text: md`The rate fell by about 33%.`, note: md`Divides the fall of 2 by the new rate, 6, instead of the old rate, 8; percent change is measured from the starting value.` },
      ],
      answer: 'B',
      workingMd: md`In percentage points the fall is $8 - 6 = 2$. As a percent change of the rate it is $\frac{8 - 6}{8} = \frac{1}{4} = 25\%$. Only the statement that gives both correctly is right.`,
      lesson: 'A difference of two rates is in percentage points; a percent change divides that difference by the starting rate.',
    },
  ],
  takeaways: [
    md`Up $p\%$ is $\times\left(1 + \frac{p}{100}\right)$; down $p\%$ is $\times\left(1 - \frac{p}{100}\right)$.`,
    md`Two successive changes of $a\%$ and $b\%$ give $a + b + \frac{ab}{100}$ percent overall.`,
    'To undo a change, divide by its multiplier.',
    md`$x\%$ of $y$ equals $y\%$ of $x$: pick whichever is easier.`,
    'Percentage points are a difference of rates; percent change divides by the starting value.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-numbers-percentages' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
