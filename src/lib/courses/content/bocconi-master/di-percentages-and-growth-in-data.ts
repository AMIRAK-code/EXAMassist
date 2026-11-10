import { md, type Lesson } from '../../types';

/** Bocconi master's, Data insight: percentages and growth in data (docs/COURSE-AUTHORING.md, the plan). */

export const percentagesAndGrowthLesson: Lesson = {
  slug: 'percentages-and-growth-in-data',
  title: 'Percentages and growth in tables and charts',
  summary: 'Compute growth from the right base, chain yearly changes, read index numbers and tell points from percent, all by hand from tables and charts.',
  minutes: 22,
  objectives: [
    'Compute a percent change between any two figures in a display, from the correct base.',
    'Chain and reverse yearly changes with multipliers, and read index numbers as levels.',
    'Separate a change in a rate (percentage points) from a change in the count behind it.',
  ],
  teachMd: md`
### Growth is a fraction of the starting value

Most data insight questions on time series come down to one formula:

$$\text{percent change} = \frac{\text{new} - \text{old}}{\text{old}} \times 100\%$$

The base is the **older** value, the one the change starts from. A rise from 40 to 50 is $\frac{10}{40} = 25\%$; a fall from 50 to 40 is $\frac{10}{50} = 20\%$. In a table with many years, "from 2023 to 2024" fixes the base as the 2023 cell, whichever is larger.

### Multipliers chain and reverse

A change of $+p\%$ multiplies by $1 + \frac{p}{100}$, and a change of $-p\%$ by $1 - \frac{p}{100}$. This gives two rules you will use constantly:

- **Successive changes multiply.** Up 20% then down 10% is $1.2 \times 0.9 = 1.08$, a net rise of 8%, not 10%.
- **To go back, divide.** If a 2025 figure of 1,350 is 8% above 2024, then 2024 was $\frac{1\,350}{1.08} = 1\,250$, not $1\,350 - 8\%$.

When a table gives yearly growth rates instead of levels, you need the multipliers to say anything about the change over several years. Adding the rates is only an approximation, and options are built to catch it.

### Index numbers are levels, not changes

An index sets a base period to 100 and expresses other periods relative to it: a price index of 117 in 2022 means prices 17% above the base year. But the change **between two later years** is not the difference of the indices read as percent. From 117 to 130 is a rise of 13 index points, and $\frac{13}{117} = \frac{1}{9} \approx 11.1\%$. Only changes measured from the base year can be read off directly.

### Percentage points or percent

When the figure in the display is itself a rate (an unemployment rate, a market share, a pass rate), a change can be described two ways. A rate going from 35% to 25% has fallen by 10 **percentage points** and by $\frac{10}{35} \approx 28.6\%$ **of itself**. And the **count** behind the rate is a third thing: if the group also grew, the count may have fallen less, or even risen. Ask which of the three the question wants, then compute only that.

### Growth of a total is not an average of growths

If three gyms grew by 20%, 5% and $-10\%$, the combined membership did not grow by $\frac{20 + 5 - 10}{3} = 5\%$ unless the gyms were the same size. Bigger units weigh more. Add the levels first, then compute one percent change from the totals.

### Comparing growth rates by hand

No calculator means you compare rates the efficient way:

- **Find a friendly form.** $\frac{54}{360}$: divide by 18 to get $\frac{3}{20} = 15\%$.
- **Use 1% and 10%.** For 95 out of 1,420, 1% of 1,420 is 14.2, so 6.5% is about 92 and 7% is about 99: the answer is between them, nearer 6.7%.
- **Cross-multiply** to compare two fractions without dividing.
- **Estimate first.** Is the answer above or below 10%? Many options die on that question alone.

### Tables of growth rates

Some displays give yearly growth rates instead of levels: a column of "change on previous year (%)". Read them with care. A positive rate that shrinks (from 8% to 3%) still means the quantity **rose**, only more slowly; the level fell only in a year with a negative rate. And the highest level is not necessarily in the year with the largest rate: if every rate is positive the level keeps rising, so the peak is at the end of the last year; once some rates are negative, an earlier peak can stay the highest. When a question asks about levels, sketch them from an assumed start of 100 and apply the multipliers.

### A routine for growth questions

Identify the two figures and their order in time. Decide whether the question asks for a change in level, in percent, or in percentage points. For several periods, use multipliers; for a group, add levels first. Then estimate before you choose: a final answer that disagrees with the rough direction of the data has a sign or base error in it.
`,
  examples: [
    {
      id: 'example-index-numbers',
      title: 'Reading a price index',
      problemMd: md`A price index has 2020 = 100. Its values are: 2021, 104; 2022, 117; 2023, 130. By what percent did prices rise from 2020 to 2023, and from 2022 to 2023?`,
      steps: [
        md`From the base year the index reads directly as a level relative to 100: $130$ means prices 30% above 2020.`,
        md`From 2022 to 2023 the base is 117, not 100: the rise is $\frac{130 - 117}{117} = \frac{13}{117} = \frac{1}{9}$.`,
        md`$\frac{1}{9} \approx 11.1\%$. Check with a multiplier: $117 \times \frac{10}{9} = 13 \times 10 = 130$.`,
      ],
      answerMd: md`Prices rose 30% from 2020 to 2023 and about 11.1% from 2022 to 2023. The tempting wrong answer for the second is 13%, which reads index points as percent.`,
    },
    {
      id: 'example-which-grew-faster',
      title: 'Which region grew faster?',
      problemMd: md`A table shows that sales in Region X rose from 360 to 414 units, and in Region Y from 250 to 285 units. Which region's sales grew by the larger percentage?`,
      steps: [
        md`Rises: X gained $414 - 360 = 54$; Y gained $285 - 250 = 35$.`,
        md`Rates: X $\frac{54}{360}$; dividing top and bottom by 18 gives $\frac{3}{20} = 15\%$. Y $\frac{35}{250} = \frac{14}{100} = 14\%$.`,
        md`Check by multipliers: $360 \times 1.15 = 360 + 54 = 414$ and $250 \times 1.14 = 250 + 35 = 285$.`,
      ],
      answerMd: md`Region X, 15% against 14%. The rates are close, which is why a careful fraction beats eyeballing; the absolute rises (54 against 35) happen to point the same way here, but they need not.`,
    },
    {
      id: 'example-chain-and-reverse',
      title: 'Two years of changes, then backwards',
      problemMd: md`A firm's orders rose 20% in 2024 and fell 10% in 2025. What was the net change over the two years? If orders in 2025 were 1,350, how many were there at the start of 2024?`,
      steps: [
        md`Chain the multipliers: $1.2 \times 0.9 = 1.08$, a net rise of 8%.`,
        md`Reverse it: start $= \frac{1\,350}{1.08}$. Clear the decimal: $\frac{135\,000}{108} = 1\,250$.`,
        md`Check forwards: $1\,250 \times 1.2 = 1\,500$, and $1\,500 \times 0.9 = 1\,350$.`,
      ],
      answerMd: md`A net rise of 8%, from 1,250 orders. Adding the rates gives 10%, and taking 8% off 1,350 gives 1,242; both are the classic slips.`,
    },
  ],
  traps: [
    {
      title: 'Measuring from the wrong year',
      md: md`Percent change is measured from the earlier value. Dividing the rise by the later value gives a smaller number that often appears among the options. Write "old" under the fraction bar before filling in a number.`,
    },
    {
      title: 'Adding yearly growth rates',
      md: md`Up 15% and then up 20% is $1.15 \times 1.2 = 1.38$, a rise of 38%, not 35%. Each year's change applies to a new level; chain multipliers.`,
    },
    {
      title: 'Index points read as percent',
      md: md`Only changes from the base year read straight off an index. Between two other years, divide the difference by the earlier index value.`,
    },
    {
      title: 'Averaging growth rates of different-sized parts',
      md: md`The growth of a total is the change in the summed levels over the old summed level. A simple average of the parts' rates treats a small branch like a large one.`,
    },
    {
      title: 'Rate change mistaken for count change',
      md: md`When a rate falls but the group grows, the count can fall less than the rate, or rise. Compute the counts when the question asks about numbers of people or units.`,
    },
  ],
  check: [
    {
      id: 'check-north-two-years',
      title: 'Two years of growth',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`The table shows the number of members of three gyms at the start of each year.

| Gym | 2022 | 2023 | 2024 |
| --- | --- | --- | --- |
| North | 400 | 460 | 552 |
| Centre | 600 | 660 | 693 |
| South | 250 | 300 | 270 |`,
      stemMd: md`By what percent did North's membership grow from 2022 to 2024?`,
      options: [
        { id: 'A', text: md`35%`, note: md`This adds the two yearly rates, 15% and 20%. The second rise applies to the larger 2023 level, so the rates multiply.` },
        { id: 'B', text: md`38%`, note: '' },
        { id: 'C', text: md`About 27.5%`, note: md`This divides the rise of 152 by the 2024 figure, 552, instead of by the starting figure, 400.` },
        { id: 'D', text: md`152%`, note: md`152 is the rise in the number of members, not a percent.` },
      ],
      answer: 'B',
      workingMd: md`Directly: $\frac{552 - 400}{400} = \frac{152}{400} = 0.38$. By multipliers: 2022 to 2023 is $\frac{460}{400} = 1.15$; 2023 to 2024 is $\frac{552}{460} = 1.2$ (since $460 \times 1.2 = 552$); and $1.15 \times 1.2 = 1.38$. Both routes give 38%.`,
      lesson: 'Over several periods, use the first and last levels or chain the multipliers; never add the rates.',
    },
    {
      id: 'check-combined-growth',
      title: 'Growth of the three gyms together',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the gym table from the previous question.

| Gym | 2022 | 2023 | 2024 |
| --- | --- | --- | --- |
| North | 400 | 460 | 552 |
| Centre | 600 | 660 | 693 |
| South | 250 | 300 | 270 |`,
      stemMd: md`From 2023 to 2024, the combined membership of the three gyms changed by approximately:`,
      options: [
        { id: 'A', text: md`5%`, note: md`This is the simple average of the three gyms' rates, $\frac{20 + 5 - 10}{3}$, which ignores that the gyms differ in size.` },
        { id: 'B', text: md`6.3%`, note: md`This divides the rise of 95 by the 2024 total, 1,515, instead of by the 2023 total.` },
        { id: 'C', text: md`6.7%`, note: '' },
        { id: 'D', text: md`15%`, note: md`This adds the three gyms' rates (20%, 5% and $-10\%$), which is not the growth of any total.` },
      ],
      answer: 'C',
      workingMd: md`Totals: 2023 $460 + 660 + 300 = 1\,420$; 2024 $552 + 693 + 270 = 1\,515$. The rise is 95. As a share of 1,420: 1% is 14.2, so 6.5% is about 92.3 and 7% is about 99.4; 95 lies between, at about 6.7%.`,
      lesson: 'For the growth of a group, add the levels first and compute one percent change from the old total.',
    },
    {
      id: 'check-student-members',
      title: 'Rate down, group up',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the gym table from the previous questions. In addition, 35% of North's members in 2023 were students, and 25% of North's members in 2024 were students.

| Gym | 2022 | 2023 | 2024 |
| --- | --- | --- | --- |
| North | 400 | 460 | 552 |
| Centre | 600 | 660 | 693 |
| South | 250 | 300 | 270 |`,
      stemMd: md`From 2023 to 2024, the number of student members at North:`,
      options: [
        { id: 'A', text: md`fell by 10%`, note: md`The student **share** fell by 10 percentage points; that is not a percent change in the number of students.` },
        { id: 'B', text: md`fell by about 14.3%`, note: '' },
        { id: 'C', text: md`fell by about 28.6%`, note: md`This is the fall in the share as a percent of itself, $\frac{10}{35}$; it ignores that North's membership grew by 20%.` },
        { id: 'D', text: md`rose by 20%`, note: md`20% is the growth of North's total membership, not of its student members.` },
      ],
      answer: 'B',
      workingMd: md`Students in 2023: $0.35 \times 460 = 161$. In 2024: $0.25 \times 552 = 138$. The fall is 23, and $\frac{23}{161} = \frac{1}{7} \approx 14.3\%$ (since $7 \times 23 = 161$).`,
      lesson: 'When both a rate and its group change, compute the two counts before any percent change.',
    },
  ],
  takeaways: [
    'Percent change divides by the older value.',
    'Successive changes multiply; to go back, divide by the multiplier.',
    'An index reads as percent only against its base year.',
    'Group growth comes from summed levels, not averaged rates.',
    'Percentage points, percent of a rate and change in count are three different answers.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-data-insight', skill: 'grad-data-derived-conclusions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
