import { md, type Lesson } from '../../types';

/**
 * The model lesson for every course: docs/COURSE-AUTHORING.md points authors
 * here for the shape, the depth and the tone.
 */
export const percentLesson: Lesson = {
  slug: 'percents-and-percent-change',
  title: 'Percents, percent change and successive changes',
  summary: 'Turn every percent into a multiplier, find the right base for a percent change, and chain or undo changes without the classic GRE slips.',
  minutes: 20,
  objectives: [
    'Write any percent increase or decrease as a single multiplier.',
    'Find a percent change from the correct base, and tell it apart from a change in percentage points.',
    'Combine successive changes and reverse a change without adding or subtracting percents.',
  ],
  teachMd: md`
### A percent is a fraction with 100 underneath

"Percent" means "per hundred", so $35\%$ is $\frac{35}{100} = 0.35$. Almost every percent question reduces to one sentence:

$$\text{part} = \text{percent} \times \text{whole}$$

Read the question for the **whole**, the thing the percent is *of*. "30% of the students" has the students as its whole; "30% more than last year" has last year as its whole. Once you know the whole, the arithmetic is one multiplication or one division.

### Changes are multipliers

An increase of $p\%$ multiplies a quantity by $1 + \frac{p}{100}$; a decrease of $p\%$ multiplies it by $1 - \frac{p}{100}$.

| Change | Multiplier |
| --- | --- |
| up 8% | $1.08$ |
| up 150% | $2.5$ |
| down 12% | $0.88$ |
| down 100% | $0$ |

Thinking in multipliers does three jobs at once. It finds a new value in one step ($\$60$ up 8% is $60 \times 1.08 = \$64.80$). It chains changes: successive changes **multiply**, they never add. And it runs backwards: to recover an original value, **divide** by the multiplier.

### Percent change needs the right base

$$\text{percent change} = \frac{\text{new} - \text{old}}{\text{old}} \times 100\%$$

The base is the *old* value, the one the change starts from. A rise from 40 to 50 is a 25% increase ($\frac{10}{40}$), but the fall from 50 back to 40 is a 20% decrease ($\frac{10}{50}$). Same gap, different base, different percent.

### Percentage points are not percents

When the quantity being compared is itself a percent, two different changes can be asked for. If an approval rate moves from 40% to 50%, it rose by **10 percentage points** (a subtraction) and by **25 percent** (a percent change of the rate, $\frac{10}{40}$). The two phrasings ask for different numbers; read which one the question asks for.

### Percent of a percent, and the order of changes

Because multiplication is commutative, the order of successive changes never matters: up 10% then down 20% gives $1.1 \times 0.8 = 0.88$, exactly the same as down 20% then up 10%. Taking "40% of 25% of $x$" is $0.4 \times 0.25 \times x = 0.1x$, which is 10% of $x$.

### A check that saves marks

Before you choose, estimate: is the answer bigger or smaller than the starting value, and by roughly how much? A discount question whose answer is larger than the original price, or a two-step increase smaller than one of its steps, tells you a multiplier went the wrong way.
`,
  examples: [
    {
      id: 'example-up-then-down',
      title: 'Up 25%, then down 20%',
      problemMd: md`A jacket's price is raised by 25%. Later the new price is cut by 20%. Compared with the original price, is the final price higher, lower or the same, and by what percent?`,
      steps: [
        md`Write each change as a multiplier: up 25% is $\times 1.25$, down 20% is $\times 0.8$.`,
        md`Successive changes multiply: $1.25 \times 0.8 = 1.00$.`,
        md`A combined multiplier of exactly 1 means no net change. A quick check with a price of $\$100$: up 25% gives $\$125$, and 20% of $\$125$ is $\$25$, so the final price is $\$100$ again.`,
      ],
      answerMd: md`The final price equals the original price: a net change of 0%. Adding the percents ($+25 - 20 = +5$) would have given the wrong answer of a 5% increase.`,
    },
    {
      id: 'example-original-price',
      title: 'Recovering the price before a discount',
      problemMd: md`After a 15% discount, a laptop costs $\$680$. What was its price before the discount?`,
      steps: [
        md`A 15% discount is the multiplier $0.85$, so $\text{original} \times 0.85 = 680$.`,
        md`Undo a multiplier by dividing: $\text{original} = \frac{680}{0.85}$.`,
        md`Clear the decimal: $\frac{680}{0.85} = \frac{68\,000}{85} = 800$.`,
        md`Check forwards: 15% of $\$800$ is $\$120$, and $800 - 120 = 680$.`,
      ],
      answerMd: md`The laptop cost $\$800$. Adding 15% to $\$680$ instead gives $\$782$, which is wrong because the 15% was taken of the original price, not of $\$680$.`,
    },
    {
      id: 'example-points-or-percent',
      title: 'Percentage points or percent?',
      problemMd: md`In 2024, 40% of a firm's 250 employees worked remotely. In 2025 the firm had 300 employees, and 45% of them worked remotely. By what percent did the number of remote workers increase?`,
      steps: [
        md`The question asks about the **number** of remote workers, not the remote rate, so find both numbers first.`,
        md`2024: $0.40 \times 250 = 100$ remote workers. 2025: $0.45 \times 300 = 135$ remote workers.`,
        md`Percent change from the old value: $\frac{135 - 100}{100} = 0.35$.`,
      ],
      answerMd: md`The number of remote workers rose by 35%. The rate rose by 5 percentage points, and by $12.5\%$ as a percent of the rate ($\frac{5}{40}$); neither is what was asked.`,
    },
  ],
  traps: [
    {
      title: 'Adding successive percents',
      md: md`"Up 10%, then up 10%" is $1.1 \times 1.1 = 1.21$, an increase of 21%, not 20%. The second change is taken of a bigger number. Whenever changes come one after another, multiply the multipliers.`,
    },
    {
      title: 'Undoing a change with the same percent',
      md: md`A 20% rise is not undone by a 20% fall: $1.2 \times 0.8 = 0.96$. To return to the start you need to divide by 1.2, which is a fall of $\frac{1}{6}$, about 16.7%. "20%" is the tempting wrong choice in such a question.`,
    },
    {
      title: 'Taking the percent of the wrong whole',
      md: md`"$A$ is 25% more than $B$" uses $B$ as the base: $A = 1.25B$. It does **not** follow that $B$ is 25% less than $A$; in fact $B = 0.8A$, 20% less. Name the base before you compute.`,
    },
    {
      title: 'Confusing percentage points with percent',
      md: md`A rate moving from 4% to 6% has risen by 2 percentage points and by 50%. If the answer choices contain both 2 and 50, the question is testing whether you read which one it asked for.`,
    },
  ],
  check: [
    {
      id: 'check-up-down-15',
      title: 'Up 15%, down 15%',
      topic: 'Percent',
      stemMd: md`A price of $\$240$ is increased by 15%, and the new price is then decreased by 15%. What is the final price?`,
      options: [
        { id: 'A', text: md`\$204.00`, note: md`This is only the 15% decrease applied to \$240; the increase was skipped.` },
        { id: 'B', text: md`\$234.60`, note: '' },
        { id: 'C', text: md`\$240.00`, note: md`Assumes a 15% rise and a 15% fall cancel. They do not: the fall is taken of the larger, increased price.` },
        { id: 'D', text: md`\$276.00`, note: md`This is the price after the increase only.` },
      ],
      answer: 'B',
      workingMd: md`The combined multiplier is $1.15 \times 0.85 = 0.9775$, so the final price is $240 \times 0.9775 = \$234.60$. Step by step: $240 \times 1.15 = 276$, then $276 \times 0.85 = 234.6$.`,
      lesson: 'Equal percent rises and falls never cancel; together they always leave the quantity lower.',
    },
    {
      id: 'check-bicycle-owners',
      title: 'Which change was asked for?',
      topic: 'Percent',
      stemMd: md`A survey found that 30% of 400 households owned a bicycle. A year later, 25% of 560 households owned one. By what percent did the number of households owning a bicycle change?`,
      options: [
        { id: 'A', text: md`A decrease of 5%`, note: md`The ownership rate fell by 5 percentage points, but the question asks about the number of households, which rose.` },
        { id: 'B', text: md`A decrease of about 16.7%`, note: md`This is the percent change of the rate, $\frac{25 - 30}{30}$. It ignores that the number of households grew from 400 to 560.` },
        { id: 'C', text: md`An increase of about 16.7%`, note: '' },
        { id: 'D', text: md`An increase of 20%`, note: md`The number of owners rose by 20 households; 20 is a count, not a percent of the starting 120.` },
        { id: 'E', text: md`An increase of 40%`, note: md`This is the growth in the number of households surveyed ($\frac{160}{400}$), not in the number that owned a bicycle.` },
      ],
      answer: 'C',
      workingMd: md`Owners before: $0.30 \times 400 = 120$. Owners after: $0.25 \times 560 = 140$. Percent change from the old value: $\frac{140 - 120}{120} = \frac{20}{120} = \frac{1}{6} \approx 16.7\%$, an increase.`,
      lesson: 'When the rate and the total both change, compute the two counts before you compute any percent change.',
    },
    {
      id: 'check-undo-increase',
      title: 'Undoing a 20% increase',
      topic: 'Percent',
      stemMd: md`After a 20% increase, a quantity equals 360. By what percent must it now decrease to return to its original value?`,
      options: [
        { id: 'A', text: md`$16\frac{2}{3}\%$`, note: '' },
        { id: 'B', text: md`$20\%$`, note: md`A 20% fall is taken of 360, the larger number, so it removes 72 and overshoots to 288.` },
        { id: 'C', text: md`$80\%$`, note: md`0.8 is the multiplier for a 20% decrease; it is not a percent change, and it would not return 360 to the original value anyway.` },
        { id: 'D', text: md`$83\frac{1}{3}\%$`, note: md`300 is $83\frac{1}{3}\%$ **of** 360: that is the fraction that remains, not the size of the decrease.` },
      ],
      answer: 'A',
      workingMd: md`The original value is $\frac{360}{1.2} = 300$. The decrease needed is $360 - 300 = 60$, and as a percent of the current value 360 that is $\frac{60}{360} = \frac{1}{6} = 16\frac{2}{3}\%$.`,
      lesson: 'To reverse a change, divide by its multiplier, then measure the new change from the value you are starting at now.',
    },
  ],
  takeaways: [
    md`Every percent change is a multiplier: up $p\%$ is $\times\left(1+\frac{p}{100}\right)$, down $p\%$ is $\times\left(1-\frac{p}{100}\right)$.`,
    'Successive changes multiply; they never add.',
    'To undo a change, divide by its multiplier.',
    'Percent change is measured from the old value; a change in percentage points is a subtraction.',
  ],
  practice: { examKey: 'gre', domain: 'quant-arithmetic', skill: 'arith-percent' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
