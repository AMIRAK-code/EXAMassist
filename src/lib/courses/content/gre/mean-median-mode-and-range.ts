import { md, type Lesson } from '../../types';

export const meanMedianModeLesson: Lesson = {
  slug: 'mean-median-mode-and-range',
  title: 'Mean, median, mode and range',
  summary: 'Work with sums instead of averages, find the median of any list or frequency table, and predict how centre and spread react to changes in the data.',
  minutes: 20,
  objectives: [
    'Turn an average into a sum and back, including weighted averages of groups of different sizes.',
    'Find the median, mode and range of a list or a frequency table without miscounting.',
    'Predict how the mean, median and range change when values are added, removed, shifted or scaled.',
  ],
  teachMd: md`
### Four numbers that describe a list

Data analysis questions on the GRE start from a handful of summary numbers. Each answers a different question about a list of values.

| Measure | What it is | What it tells you |
| --- | --- | --- |
| Mean | the sum divided by the number of values | the "balance point" of the data |
| Median | the middle value once the list is in order | the value that splits the data in half |
| Mode | the value that occurs most often | the most common value (a list can have several, or none) |
| Range | the greatest value minus the least | how far apart the extremes are |

The mean, median and mode measure the **centre** of the data; the range measures its **spread**.

### The mean is really a statement about the sum

$$\text{mean} = \frac{\text{sum}}{n} \quad\Longleftrightarrow\quad \text{sum} = \text{mean} \times n$$

The second form is the one that solves problems. If five numbers average 12, you know nothing about any single number, but you know for certain that they add up to 60. Missing-value questions, "a new value is added" questions and "a value is removed" questions all become simple once you switch from averages to sums, do the arithmetic on the sums, and only divide at the end.

The mean has a useful balancing property: the distances of the values above the mean exactly cancel the distances of the values below it. For 4, 7 and 10 the mean is 7, and the deviations $-3$, $0$ and $+3$ add up to zero. This is why adding a value equal to the current mean leaves the mean unchanged, a value above the mean pulls it up, and a value below pulls it down.

### Averages of groups: weight by size

When two groups are combined, the combined mean is **not** the average of the two means unless the groups have the same size. Convert each group to a sum, add the sums, and divide by the total count:

$$\text{combined mean} = \frac{n_1 \bar{x}_1 + n_2 \bar{x}_2}{n_1 + n_2}$$

The combined mean always lies between the two group means, closer to the mean of the larger group. That gives a quick check on any answer.

### The median needs an ordered list

Put the values in order first. With an odd number of values $n$, the median is the value in position $\frac{n+1}{2}$. With an even number, there are two middle values, and the median is their mean, which may not be in the list at all.

For 3, 5, 8, 9, 12, 14, 20, 31 (eight values) the middle pair is 9 and 12, so the median is $10.5$. The mean is $\frac{102}{8} = 12.75$, larger than the median because the single large value 31 pulls the mean towards it.

That is the key difference between the two. The mean uses every value, so one extreme value (an **outlier**) can move it a lot. The median uses only the order, so it barely notices an outlier: replace 31 by 310 and the mean jumps to 47.625, while the median stays 10.5.

### Frequency tables

Data often comes as a table of values and how many times each occurs. Treat it as a compressed list.

- **Count** $n$ by adding the frequencies.
- **Mean**: multiply each value by its frequency, add the products, divide by $n$.
- **Median**: run a cumulative count down the table until you reach the middle position.
- **Mode**: the value with the largest frequency (the value, not the frequency).

Never take the median or mean of the frequency column; the frequencies are counts, not data values.

### How the measures react to changes

| Change to every value | Mean, median, mode | Range |
| --- | --- | --- |
| add a constant $c$ | each increases by $c$ | unchanged |
| multiply by $k > 0$ | each is multiplied by $k$ | multiplied by $k$ |

Shifting the whole list moves its centre but not the distance between its extremes. Doubling every value and then adding 5 turns a mean of 12 into $2 \times 12 + 5 = 29$, a median of 10 into 25, and a range of 8 into 16 (the "add 5" step does nothing to the range).

### Comparing without computing

In a quantitative comparison you rarely need exact values. Ask which way the data leans. A list with a long tail of large values usually has a mean above its median; a perfectly symmetric list has mean equal to median. When an unknown value appears, find the range of values it can take and check whether the comparison holds at both ends.
`,
  examples: [
    {
      id: 'example-missing-score',
      title: 'Finding a missing value from the mean',
      problemMd: md`The mean of five quiz scores is 84. Four of the scores are 78, 91, 80 and 88. What is the fifth score, and what is the median of all five?`,
      steps: [
        md`Switch from the mean to the sum: five scores with mean 84 add up to $5 \times 84 = 420$.`,
        md`Add the known scores: $78 + 91 + 80 + 88 = 337$. (Check in another order: $91 + 88 = 179$ and $78 + 80 = 158$, total 337.)`,
        md`The fifth score is the rest of the sum: $420 - 337 = 83$.`,
        md`For the median, order all five scores: 78, 80, 83, 88, 91. The middle (third) value is 83.`,
      ],
      answerMd: md`The fifth score is 83, and the median of the five scores is 83. Averaging the four known scores ($\frac{337}{4} = 84.25$) answers a different question and gives nothing useful here.`,
    },
    {
      id: 'example-combined-classes',
      title: 'Combining two groups of different sizes',
      problemMd: md`Class A has 12 students with a mean test score of 70. Class B has 18 students with a mean score of 80. What is the mean score of all 30 students?`,
      steps: [
        md`Turn each mean into a sum: Class A totals $12 \times 70 = 840$; Class B totals $18 \times 80 = 1440$.`,
        md`Add the sums and the counts: $840 + 1440 = 2280$ points over $12 + 18 = 30$ students.`,
        md`Divide: $\frac{2280}{30} = 76$.`,
        md`Sanity check: 76 lies between 70 and 80 and is closer to 80, the mean of the larger class, as it must be.`,
      ],
      answerMd: md`The combined mean is 76. The tempting answer 75, the average of 70 and 80, would be right only if the classes were the same size.`,
    },
    {
      id: 'example-frequency-table',
      title: 'Centre and spread from a frequency table',
      problemMd: md`A librarian recorded how many books each of 20 readers borrowed in a week.

| Books borrowed | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| Number of readers | 3 | 5 | 6 | 4 | 2 |

Find the mean, median, mode and range of the number of books borrowed.`,
      steps: [
        md`Count the readers: $3 + 5 + 6 + 4 + 2 = 20$.`,
        md`Mean: multiply each value by its frequency and add: $0 \times 3 + 1 \times 5 + 2 \times 6 + 3 \times 4 + 4 \times 2 = 0 + 5 + 12 + 12 + 8 = 37$. Then $\frac{37}{20} = 1.85$.`,
        md`Median: with 20 values, it is the mean of the 10th and 11th. Count down cumulatively: the value 0 fills positions 1–3, the value 1 fills 4–8, the value 2 fills 9–14. Both the 10th and 11th values are 2, so the median is 2.`,
        md`Mode: the largest frequency is 6, which belongs to the value 2, so the mode is 2. Range: $4 - 0 = 4$.`,
      ],
      answerMd: md`Mean 1.85, median 2, mode 2, range 4. A common slip is to report the mode as 6 (that is the frequency of the mode) or to take the median of the frequency row (3, 5, 6, 4, 2 has median 4, which means nothing here).`,
    },
  ],
  traps: [
    {
      title: 'Averaging averages',
      md: md`Two group means can be averaged directly only when the groups are equal in size. Otherwise go through the sums: multiply each mean by its group size, add, and divide by the total count. The plain average of the two means is a tempting answer precisely because it is so quick to compute.`,
    },
    {
      title: 'Finding the median of an unordered list',
      md: md`The "middle value" means the middle of the **ordered** list. A list printed as 14, 3, 21, 9, 6 has 21 in its middle position, but in order it reads 3, 6, 9, 14, 21, so the median is 9. Reorder first every time, especially when the list is long or contains repeats.`,
    },
    {
      title: 'Confusing values with frequencies',
      md: md`In a frequency table, the mode is a value, not the largest count, and the median is found by counting through the frequencies, not by taking the middle of the frequency row. Say "value" and "how many" aloud as you read each column.`,
    },
    {
      title: 'Assuming shifts change the spread',
      md: md`Adding the same number to every value moves the mean, median and mode but leaves the range untouched. Multiplying every value by a positive number changes all of them, the range included. Decide which kind of change the question describes before you compute anything.`,
    },
  ],
  check: [
    {
      id: 'check-removed-number',
      title: 'Removing one value',
      topic: 'Data Analysis: descriptive statistics',
      stemMd: md`The average (arithmetic mean) of six numbers is 15. When one of the numbers is removed, the average of the remaining five numbers is 13. What number was removed?`,
      options: [
        { id: 'A', text: md`2`, note: md`This is the change in the average, not the number removed. The removed number has to account for the whole drop in the sum.` },
        { id: 'B', text: md`12`, note: md`This uses $13 \times 6 = 78$ for the remaining sum, but only five numbers remain.` },
        { id: 'C', text: md`14`, note: md`This averages the two means, 15 and 13; the means describe different counts, so averaging them has no meaning here.` },
        { id: 'D', text: md`25`, note: '' },
        { id: 'E', text: md`65`, note: md`65 is the sum of the five remaining numbers, not the number that was taken away.` },
      ],
      answer: 'D',
      workingMd: md`The six numbers add up to $6 \times 15 = 90$. The five that remain add up to $5 \times 13 = 65$. The removed number is $90 - 65 = 25$. Check: a removed value above the old mean (25 > 15) should lower the mean, and it does.`,
      lesson: 'Turn every average into a sum, work with the sums, and divide only at the end.',
    },
    {
      id: 'check-mean-versus-median',
      title: 'Mean against median with an unknown',
      topic: 'Quantitative Comparison',
      stemMd: md`The list below contains six numbers, where $x$ is greater than 20.

4, 6, 6, 9, 15, $x$

| Quantity A | Quantity B |
| --- | --- |
| The average (arithmetic mean) of the six numbers | The median of the six numbers |`,
      options: [
        { id: 'A', text: md`Quantity A is greater.`, note: '' },
        { id: 'B', text: md`Quantity B is greater.`, note: md`This assumes the large value $x$ pulls the median up. It does not: the median is fixed at 7.5, while every allowed $x$ makes the mean more than 10.` },
        { id: 'C', text: md`The two quantities are equal.`, note: md`Mean and median are equal for a symmetric list; this list has one value far above the rest, which pulls the mean up but leaves the median alone.` },
        { id: 'D', text: md`The relationship cannot be determined from the information given.`, note: md`Not knowing $x$ exactly does not matter: the median does not depend on $x$ at all, and the lower bound on $x$ already puts the mean above the median.` },
      ],
      answer: 'A',
      workingMd: md`Since $x > 20$, the ordered list is 4, 6, 6, 9, 15, $x$, and the median is the mean of the third and fourth values: $\frac{6 + 9}{2} = 7.5$, whatever $x$ is. The mean is $\frac{4 + 6 + 6 + 9 + 15 + x}{6} = \frac{40 + x}{6}$. With $x > 20$ this is greater than $\frac{60}{6} = 10$. So the mean is always greater than 10, and the median is always 7.5.`,
      lesson: 'When a quantity depends on an unknown, find the bound the unknown allows and test the comparison at that bound.',
    },
    {
      id: 'check-siblings-median',
      title: 'Median from a frequency table',
      topic: 'Data Analysis: descriptive statistics',
      stimulusMd: md`Fifteen students reported how many siblings they have.

| Number of siblings | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Number of students | 4 | 6 | 3 | 2 |`,
      stemMd: md`What is the median number of siblings for the fifteen students?`,
      options: [
        { id: 'A', text: md`1`, note: '' },
        { id: 'B', text: md`1.2`, note: md`1.2 is the mean, $\frac{0 \times 4 + 1 \times 6 + 2 \times 3 + 3 \times 2}{15} = \frac{18}{15}$, not the median.` },
        { id: 'C', text: md`1.5`, note: md`This is the middle of the possible values 0 to 3. It ignores how many students have each value.` },
        { id: 'D', text: md`3.5`, note: md`This is the median of the frequency row (2, 3, 4, 6 in order). Frequencies are counts of students, not numbers of siblings.` },
        { id: 'E', text: md`6`, note: md`6 is the largest frequency, which tells you the mode is 1. It is a count of students, not a number of siblings.` },
      ],
      answer: 'A',
      workingMd: md`There are $4 + 6 + 3 + 2 = 15$ students, so the median is the 8th value in order. Counting cumulatively, the value 0 fills positions 1–4 and the value 1 fills positions 5–10. The 8th value is therefore 1.`,
      lesson: 'In a frequency table, find the middle position from the total count, then walk down the cumulative counts to the value that holds it.',
    },
  ],
  takeaways: [
    md`$\text{sum} = \text{mean} \times n$: work with sums, divide at the end.`,
    'A combined mean weights each group by its size; it lies closer to the larger group.',
    'Order the list before taking a median; with an even count, average the two middle values.',
    'Outliers move the mean but hardly move the median.',
    'Adding a constant shifts the centre but not the range; multiplying scales both.',
  ],
  practice: { examKey: 'gre', domain: 'quant-data-analysis', skill: 'data-descriptive-statistics' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
