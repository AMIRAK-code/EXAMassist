import { md, type Lesson } from '../../types';

export const averagesAndBasicStatisticsLesson: Lesson = {
  slug: 'averages-and-basic-statistics',
  title: 'Averages and basic statistics',
  summary: 'Work with sums instead of means, combine groups with weighted averages, find medians and ranges, and see how changing the data moves each measure.',
  minutes: 20,
  objectives: [
    'Solve mean problems through the total: mean × count = sum.',
    'Combine groups of different sizes with a weighted average.',
    'Find the median, mode and range, and predict how each responds when the data are shifted or scaled.',
  ],
  teachMd: md`
### Think in totals

The mean of a list is its sum divided by the number of values. Turned round, it gives the single most useful fact in average problems:
$$\text{sum} = \text{mean} \times \text{count}.$$
Whenever a value is added, removed or changed, convert means into sums, do the arithmetic on the sums, and convert back at the end.

If five numbers have a mean of 14, their sum is 70. If one number is removed and the other four have a mean of 12, their sum is 48, so the removed number was $70 - 48 = 22$. No single number needs to be known.

### Mental means with deviations

Without a calculator, pick a convenient reference value close to the data and average the **deviations** from it. For 98, 103, 101, 96 and 107, take 100 as the reference. The deviations are $-2, +3, +1, -4, +7$, which add to $+5$, an average of $+1$. So the mean is $100 + 1 = 101$. Check: the sum is 505 and $\frac{505}{5} = 101$. The same idea shows that deviations from the mean itself always add to zero.

### Weighted averages

Combining groups of different sizes needs a **weighted average**: each group's mean counts in proportion to its size.
$$\text{combined mean} = \frac{n_1 \bar{x}_1 + n_2 \bar{x}_2}{n_1 + n_2}.$$
A group of 20 with mean 65 and a group of 30 with mean 75 have total $1300 + 2250 = 3550$ over 50 people, a combined mean of 71, not the simple mean of 70. The combined mean always lies between the two group means, closer to the larger group: here 71 is nearer to 75, because there are more people in that group.

Weights may come as shares rather than counts. If 40% of a firm's staff earn on average 30 thousand and 60% earn 40 thousand, the overall mean is $0.4 \times 30 + 0.6 \times 40 = 12 + 24 = 36$ thousand.

### Median, mode and range

- **Median:** the middle value once the data are **sorted**. With an odd number of values it is the middle one; with an even number, the mean of the two middle ones. For 7, 3, 9, 4, 12, 6, sorting gives 3, 4, 6, 7, 9, 12, and the median is $\frac{6 + 7}{2} = 6.5$.
- **Mode:** the most frequent value. A list may have several modes or none.
- **Range:** largest minus smallest, a simple measure of spread.

The mean uses every value, so one extreme value can pull it far; the median depends only on the order, so it resists outliers. In the list 2, 3, 3, 4, 48, the mean is 12 but the median is 3. When a question asks which measure "best describes a typical value" in skewed data, this is why the median is often the answer.

### Shifting and scaling the data

Changing every value in the same way changes the measures predictably:

| Change to every value | Mean, median, mode | Range |
| --- | --- | --- |
| add $c$ | add $c$ | unchanged |
| multiply by $k > 0$ | multiply by $k$ | multiply by $k$ |
| multiply by $k$, then add $c$ | $\times k$, then $+ c$ | $\times k$ only |

Adding a constant slides the whole data set along without stretching it, so the gaps between values, and hence the range, stay the same. Multiplying stretches every gap by the same factor.

### Quick checks

A mean lies between the smallest and largest values. A combined mean lies between the group means. If your answer breaks either rule, recheck the totals.
`,
  examples: [
    {
      id: 'example-removed-value',
      title: 'Finding a removed value',
      problemMd: md`The mean of five numbers is 14. One number is removed, and the mean of the remaining four is 12. What number was removed?`,
      steps: [
        md`Convert to sums: five numbers with mean 14 add to $5 \times 14 = 70$.`,
        md`Four numbers with mean 12 add to $4 \times 12 = 48$.`,
        md`The removed number is the difference: $70 - 48 = 22$.`,
        md`Check: removing 22, which is 8 above the old mean, lowers the total of deviations by 8. Spread over the 4 values left, that lowers the mean by $\frac{8}{4} = 2$, from 14 to 12.`,
      ],
      answerMd: md`The removed number is 22. Answering 2, the change in the mean, confuses a difference in means with a value.`,
    },
    {
      id: 'example-two-classes',
      title: 'Two classes of different sizes',
      problemMd: md`Class A has 20 students with a mean mark of 65; class B has 30 students with a mean mark of 75. What is the mean mark of all 50 students?`,
      steps: [
        md`Total marks: $20 \times 65 = 1300$ and $30 \times 75 = 2250$, so $3550$ altogether.`,
        md`Combined mean: $\frac{3550}{50} = 71$.`,
        md`Check by weights: B is $\frac{30}{50} = \frac{3}{5}$ of the students, so the mean sits $\frac{3}{5}$ of the way from 65 to 75: $65 + \frac{3}{5} \times 10 = 71$.`,
      ],
      answerMd: md`The mean is 71. The simple mean of the two class means, 70, ignores that class B is larger.`,
    },
    {
      id: 'example-median-mean',
      title: 'Median and mean of an even list',
      problemMd: md`For the data 7, 3, 9, 4, 12, 6, find the median and the mean.`,
      steps: [
        md`Sort first: 3, 4, 6, 7, 9, 12.`,
        md`There are six values, so the median is the mean of the third and fourth: $\frac{6 + 7}{2} = 6.5$.`,
        md`The sum is $3 + 4 + 6 + 7 + 9 + 12 = 41$, so the mean is $\frac{41}{6} = 6\frac{5}{6} \approx 6.83$.`,
      ],
      answerMd: md`The median is 6.5 and the mean is $6\frac{5}{6}$. Taking the middle of the unsorted list (9 and 4, giving 6.5 by coincidence here) is a habit that usually gives a wrong median; always sort first.`,
    },
  ],
  traps: [
    {
      title: 'Averaging averages',
      md: md`The mean of two group means is the overall mean only when the groups are the same size. Otherwise weight each mean by its group size, or work with the totals.`,
    },
    {
      title: 'Median of unsorted data',
      md: md`The median is the middle of the **sorted** list. Reading the middle of the list as given is a common error; with an even count, also remember to average the two middle values.`,
    },
    {
      title: 'Expecting the range to move with a shift',
      md: md`Adding the same number to every value leaves the range unchanged; only multiplying changes it. The mean and median, by contrast, move with both.`,
    },
    {
      title: 'Working with means instead of sums',
      md: md`When a value joins or leaves a group, the means cannot simply be added or subtracted. Convert to sums with mean × count, adjust, and divide again.`,
    },
  ],
  check: [
    {
      id: 'check-seventh-number',
      title: 'Adding a seventh number',
      topic: 'Quantitative reasoning: averages',
      stemMd: md`The mean of six numbers is 20. When a seventh number is added, the mean of all seven becomes 22. What is the seventh number?`,
      options: [
        { id: 'A', text: md`2`, note: md`This is the change in the mean, not the value of the number that caused it.` },
        { id: 'B', text: md`22`, note: md`This is the new mean; a number equal to 22 would raise the mean only to $\frac{142}{7}$, about 20.3.` },
        { id: 'C', text: md`34`, note: '' },
        { id: 'D', text: md`154`, note: md`This is the sum of all seven numbers, not the seventh number alone.` },
      ],
      answer: 'C',
      workingMd: md`Sum of six: $6 \times 20 = 120$. Sum of seven: $7 \times 22 = 154$. The seventh number is $154 - 120 = 34$. Check: 34 is 14 above the old mean, and $\frac{14}{7} = 2$ raises the mean from 20 to 22.`,
      lesson: 'Convert each mean to a sum, then the difference of the sums is the value added or removed.',
    },
    {
      id: 'check-weighted-salary',
      title: 'Average salary across two groups',
      topic: 'Quantitative reasoning: averages',
      stemMd: md`In a firm, 40% of employees earn an average of €30,000 and the other 60% earn an average of €40,000. What is the average salary of all employees?`,
      options: [
        { id: 'A', text: md`€34,000`, note: md`Swaps the weights, giving 60% to the €30,000 group; the larger share earns €40,000.` },
        { id: 'B', text: md`€35,000`, note: md`The simple mean of the two averages; it ignores that the groups are of different sizes.` },
        { id: 'C', text: md`€36,000`, note: '' },
        { id: 'D', text: md`€40,000`, note: md`This is the average of the larger group only; the €30,000 group pulls the overall average down.` },
      ],
      answer: 'C',
      workingMd: md`Weighted average: $0.4 \times 30\,000 + 0.6 \times 40\,000 = 12\,000 + 24\,000 = 36\,000$. Check: with 10 employees, the total is $4 \times 30\,000 + 6 \times 40\,000 = 360\,000$, and $\frac{360\,000}{10} = 36\,000$.`,
      lesson: 'Weight each group mean by its share; the result lies nearer the larger group.',
    },
    {
      id: 'check-range-transform',
      title: 'Range after a transformation',
      topic: 'Quantitative reasoning: statistics',
      stemMd: md`The data set 4, 8, 8, 10, 15 is changed by multiplying every value by 2 and then adding 5. What is the range of the new data set?`,
      options: [
        { id: 'A', text: md`11`, note: md`This is the original range; multiplying by 2 doubles every gap between values, so the range changes.` },
        { id: 'B', text: md`16`, note: md`Adds 5 to the original range, but adding the same number to every value does not change the range, and the doubling is missed.` },
        { id: 'C', text: md`22`, note: '' },
        { id: 'D', text: md`27`, note: md`Doubles the range and then adds 5; adding 5 to every value shifts the data without changing the range.` },
      ],
      answer: 'C',
      workingMd: md`The original range is $15 - 4 = 11$. Multiplying by 2 doubles it to 22; adding 5 leaves it at 22. Directly: the new values are 13, 21, 21, 25, 35, and $35 - 13 = 22$.`,
      lesson: 'Adding a constant leaves the range alone; multiplying scales it.',
    },
  ],
  takeaways: [
    md`$\text{sum} = \text{mean} \times \text{count}$: solve average problems through totals.`,
    'A combined mean is weighted by group size and lies nearer the larger group.',
    'Sort before finding a median; with an even count, average the two middle values.',
    'Adding a constant shifts the mean and median but not the range; multiplying scales all three.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-quantitative-reasoning', skill: 'grad-quant-numbers-percentages' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
