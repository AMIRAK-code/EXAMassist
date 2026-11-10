import { md, type Lesson } from '../../types';

/** Bocconi master's, Data insight: averages and weighted data (docs/COURSE-AUTHORING.md, the plan). */

export const averagesAndWeightedDataLesson: Lesson = {
  slug: 'averages-and-weighted-data',
  title: 'Averages and weighted data',
  summary: 'Combine group averages with their sizes, work from totals, read means and medians from frequency tables, and spot when an overall rate reverses.',
  minutes: 20,
  objectives: [
    'Move between a mean, a count and a total, and use totals to add or remove values.',
    'Combine group averages or rates by weighting each with its size.',
    'Find the mean and median from a frequency table, and recognise when subgroup and overall comparisons disagree.',
  ],
  teachMd: md`
### The mean is a total in disguise

The arithmetic mean is the total divided by the count, so every average hides a total:

$$\text{total} = \text{mean} \times \text{count}$$

This one line solves most average questions in data insight. To add or remove a value, go to the total, change it, and divide by the new count. If eight sales figures average 50, their total is 400; removing a figure of 22 leaves 378 over seven figures, a mean of 54.

### Combining groups: weight by size

A table often gives an average for each group and the size of each group. The overall average is **not** the average of the averages unless the groups are the same size:

$$\text{overall mean} = \frac{n_1 \bar{x}_1 + n_2 \bar{x}_2 + \dots}{n_1 + n_2 + \dots}$$

Twenty students averaging 70 and thirty averaging 80 have a combined total of $1\,400 + 2\,400 = 3\,800$ over 50 students: a mean of 76, not 75. The combined mean always lies between the group means, **closer to the larger group**. That fact alone often rules out options without any arithmetic.

A quick way to compute a weighted mean by hand is to measure from the lowest group. With weights of 30%, 10% and 60% on averages of 2,400, 3,200 and 2,000, the mean is $2\,000 + 0.3 \times 400 + 0.1 \times 1\,200 = 2\,000 + 120 + 120 = 2\,240$.

### Rates combine the same way

Pass rates, conversion rates and prices per unit are averages too. A group's overall rate is the sum of the successes over the sum of the bases, never a simple average of the rates. A branch with 90% on 100 cases and another with 60% on 50 cases have $\frac{90 + 30}{150} = 80\%$ overall, not 75%.

### When the overall comparison reverses

Weighting has a striking consequence. Two teams win contracts with small and large clients:

| Team | Small clients | Large clients | Overall |
| --- | --- | --- | --- |
| P | 9 of 10 (90%) | 20 of 50 (40%) | 29 of 60 |
| Q | 40 of 50 (80%) | 3 of 10 (30%) | 43 of 60 |

P does better with each kind of client, yet Q wins more contracts overall, because Q's cases are mostly the easy kind. So a statement such as "P has the higher success rate overall" cannot be judged from the subgroup rates alone; you need the sizes. When a display gives both, check both.

### Means and medians from a frequency table

A frequency table lists each value and how many times it occurs. The mean is $\frac{\sum (\text{value} \times \text{frequency})}{\sum \text{frequency}}$. The median is the middle position in order: build running totals of the frequencies and see where the middle falls. The mode is the value with the highest frequency.

The mean and the median answer different questions. A few very large values pull the mean up but barely move the median, so with skewed data (incomes, house prices, waiting times) the mean is usually above the median. A question that says "typical" or "middle" wants the median; "per person" or "on average" with a total in view wants the mean.

### What an average cannot tell you

An average alone says nothing about any single member of the group. A department averaging €2,400 may have nobody paid exactly €2,400, and a rise in the average does not mean everyone earned more: hiring one well-paid person can lift it. Statements of the form "every employee", "at least one" or "most employees" usually cannot be decided from averages, and in a data question that makes them the "cannot be determined" option, not the true one.

### A routine for averages

Write each group as count, mean and total in three columns on your sheet. Add the counts and totals; divide once at the end. Before choosing, check that the result lies between the group means and leans towards the biggest group.
`,
  examples: [
    {
      id: 'example-two-classes',
      title: 'Combining two class averages',
      problemMd: md`One class of 20 students averaged 70 points on a test; another class of 30 students averaged 80. What was the average for all 50 students?`,
      steps: [
        md`Turn each mean into a total: $20 \times 70 = 1\,400$ and $30 \times 80 = 2\,400$.`,
        md`Add totals and counts: $\frac{1\,400 + 2\,400}{50} = \frac{3\,800}{50} = 76$.`,
        md`Sense check: 76 lies between 70 and 80 and nearer 80, the larger class, as it must.`,
      ],
      answerMd: md`76. The tempting wrong answer is 75, the simple average of 70 and 80, which treats the two classes as equal in size.`,
    },
    {
      id: 'example-frequency-table',
      title: 'Mean and median from frequencies',
      problemMd: md`In a survey, 40 people said how many books they had read in the last month:

| Books | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| People | 6 | 10 | 12 | 8 | 4 |

Find the mean and the median number of books.`,
      steps: [
        md`Check the count: $6 + 10 + 12 + 8 + 4 = 40$.`,
        md`Total books: $0 \times 6 + 1 \times 10 + 2 \times 12 + 3 \times 8 + 4 \times 4 = 0 + 10 + 24 + 24 + 16 = 74$. Mean: $\frac{74}{40} = 1.85$.`,
        md`Median: with 40 people it sits between the 20th and 21st values in order. Running totals are 6 (0 books), 16 (up to 1), 28 (up to 2). Both the 20th and 21st have read 2 books.`,
      ],
      answerMd: md`The mean is 1.85 books and the median is 2. Averaging the five listed values, $\frac{0 + 1 + 2 + 3 + 4}{5} = 2$, is the tempting wrong mean: it ignores the frequencies, and the many people who read 0 or 1 books pull the true mean below 2.`,
    },
    {
      id: 'example-remove-a-value',
      title: 'Removing a wrong entry',
      problemMd: md`The mean of 8 daily sales figures is 50. One figure, 22, turns out to be an error and is removed. What is the mean of the remaining figures?`,
      steps: [
        md`Total of the 8 figures: $8 \times 50 = 400$.`,
        md`Remove the error: $400 - 22 = 378$, over 7 figures.`,
        md`New mean: $\frac{378}{7} = 54$. Check: $7 \times 54 = 378$.`,
      ],
      answerMd: md`54. Subtracting 22 from the mean, or dividing 378 by 8, are the usual slips; work through the total.`,
    },
  ],
  traps: [
    {
      title: 'Averaging the averages',
      md: md`The mean of group means equals the overall mean only when the groups are the same size. With sizes in the display, always weight; without them, the overall mean is not determined.`,
    },
    {
      title: 'Taking the middle group as the overall mean',
      md: md`The median of the group averages, or the midpoint between the highest and lowest, is a tempting shortcut. The overall mean leans towards the largest group, wherever its average is.`,
    },
    {
      title: 'Ignoring frequencies',
      md: md`In a frequency table, each value counts as many times as its frequency. Averaging the distinct values, or taking the middle row as the median, skips the frequencies.`,
    },
    {
      title: 'Judging the overall rate from subgroup rates',
      md: md`One group can beat another in every subgroup and still lose overall, if its cases sit mostly in the harder subgroup. Combine counts, not percentages.`,
    },
  ],
  check: [
    {
      id: 'check-firm-average-salary',
      title: 'The firm’s average salary',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`The table shows the number of employees and the average monthly salary in the three departments of a firm.

| Department | Employees | Average salary (€) |
| --- | --- | --- |
| Sales | 30 | 2,400 |
| Finance | 10 | 3,200 |
| Operations | 60 | 2,000 |`,
      stemMd: md`What is the average monthly salary of all the firm's employees?`,
      options: [
        { id: 'A', text: md`€2,240`, note: '' },
        { id: 'B', text: md`€2,400`, note: md`€2,400 is the middle of the three department averages; the overall mean leans towards Operations, the largest and lowest-paid department.` },
        { id: 'C', text: md`About €2,533`, note: md`This is the simple average of the three department averages, which treats 10 Finance staff as weighing as much as 60 in Operations.` },
        { id: 'D', text: md`€2,600`, note: md`This is the midpoint of the highest and lowest averages, €2,000 and €3,200; it ignores Sales and every department's size.` },
      ],
      answer: 'A',
      workingMd: md`Totals: Sales $30 \times 2\,400 = 72\,000$; Finance $10 \times 3\,200 = 32\,000$; Operations $60 \times 2\,000 = 120\,000$. Sum 224,000 over 100 employees: €2,240. Measured from €2,000: $0.3 \times 400 + 0.1 \times 1\,200 = 240$, and $2\,000 + 240 = 2\,240$ again.`,
      lesson: 'An overall average comes from summed totals over summed counts, and leans towards the largest group.',
    },
    {
      id: 'check-finance-new-average',
      title: 'New hires change a department’s average',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the salary table from the previous question.

| Department | Employees | Average salary (€) |
| --- | --- | --- |
| Sales | 30 | 2,400 |
| Finance | 10 | 3,200 |
| Operations | 60 | 2,000 |`,
      stemMd: md`Finance hires 20 new employees, each paid €2,000 a month. Nothing else changes. What is the new average monthly salary in Finance?`,
      options: [
        { id: 'A', text: md`€2,200`, note: md`€2,200 is the new average of the **whole firm**, $\frac{224\,000 + 40\,000}{120}$, not of Finance.` },
        { id: 'B', text: md`€2,400`, note: '' },
        { id: 'C', text: md`€2,600`, note: md`This averages €3,200 and €2,000 equally, though there are twice as many new hires as existing staff.` },
        { id: 'D', text: md`€2,800`, note: md`This swaps the weights, giving 20 people the €3,200 salary and 10 the €2,000 one.` },
      ],
      answer: 'B',
      workingMd: md`Finance total: $32\,000 + 20 \times 2\,000 = 32\,000 + 40\,000 = 72\,000$, over $10 + 20 = 30$ employees: $\frac{72\,000}{30} = 2\,400$. Sense check: the result is two thirds of the way from €3,200 down to €2,000, because two thirds of the staff earn €2,000.`,
      lesson: 'Adding people to a group means adding to its total and its count, then dividing once.',
    },
    {
      id: 'check-sales-target-average',
      title: 'Hitting a target average',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the salary table from the previous questions, before any new hires.

| Department | Employees | Average salary (€) |
| --- | --- | --- |
| Sales | 30 | 2,400 |
| Finance | 10 | 3,200 |
| Operations | 60 | 2,000 |`,
      stemMd: md`Sales will hire 10 new employees, all on the same salary, so that the department's average monthly salary becomes exactly €2,500. What salary must each new employee receive?`,
      options: [
        { id: 'A', text: md`€2,500`, note: md`New hires paid exactly the target would pull a €2,400 average up only part of the way; they must be paid above it.` },
        { id: 'B', text: md`€2,600`, note: md`This treats €2,500 as the plain average of €2,400 and the new salary, as if the two groups were the same size; there are 30 existing staff and only 10 new ones.` },
        { id: 'C', text: md`€2,800`, note: '' },
        { id: 'D', text: md`€3,000`, note: md`€3,000 is the existing staff's total shortfall, 30 people each €100 below target. It is spread over the 10 new hires, €300 each above €2,500; it is not itself a salary.` },
      ],
      answer: 'C',
      workingMd: md`Target total: $40 \times 2\,500 = 100\,000$. Existing total: $30 \times 2\,400 = 72\,000$. The new hires must bring $100\,000 - 72\,000 = 28\,000$, so each earns $\frac{28\,000}{10} = 2\,800$. Check: $\frac{72\,000 + 28\,000}{40} = 2\,500$.`,
      lesson: 'To hit a target average, compute the target total and subtract what you already have.',
    },
  ],
  takeaways: [
    'Total = mean × count; work through totals to add, remove or combine.',
    'An overall mean weights each group by its size and leans towards the largest.',
    'Rates combine as summed successes over summed bases.',
    'A group can win every subgroup and lose overall; combine counts before judging.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-data-insight', skill: 'grad-data-derived-conclusions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
