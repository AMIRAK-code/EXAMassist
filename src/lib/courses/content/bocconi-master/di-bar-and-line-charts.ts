import { md, type Lesson } from '../../types';

/** Bocconi master's, Data insight: bar charts, line charts and histograms (docs/COURSE-AUTHORING.md, the plan). */

export const barAndLineChartsLesson: Lesson = {
  slug: 'bar-and-line-charts',
  title: 'Bar charts, line charts and histograms',
  summary: 'Read values, changes and trends off bar charts, line charts and histograms, and avoid the slips that steep lines and cut-off axes invite.',
  minutes: 20,
  objectives: [
    'Turn a bar or line chart into the few numbers a question needs, using the axis scale.',
    'Tell the largest absolute change (the steepest segment) from the largest percent change.',
    'Read a histogram as counts in intervals, and say what it cannot tell you.',
  ],
  teachMd: md`
### A chart is a table drawn as shapes

Bocconi lists tables, histograms and graphs among the displays that data insight questions are built on. Every chart encodes numbers, and the work is to decode the few you need, so start the way you start a table: title, units, what each bar or point stands for, and the scale of each axis. In this course charts are described in words or given as the table behind them; on screen you will be reading the same numbers off gridlines.

### Reading values off the scale

Find the axis unit first: "thousands of visitors", "billions of euros", "%". Then read each value from the gridlines, estimating between them when you must. If a question's options are far apart, a rough reading is enough; if they are close, read carefully and check against a gridline. When an exact value is printed on a bar, use it rather than your estimate.

### Bar charts: grouped and stacked

- **Grouped bars** stand side by side, one per series, for each category (exports and imports for each year). Compare bars within a group to compare series; compare the same series across groups to see change.
- **Stacked bars** pile the series on top of each other. The top of the stack is the **total**; the height of one segment is its top minus its bottom, not the level where it ends. Only the bottom segment can be read directly from the axis.

### Line charts: level, change and slope

A line chart shows a quantity over time. Three readings matter:

1. **Level**: the height of a point.
2. **Absolute change**: the difference in height between two points. The steepest segment is the largest absolute change between neighbouring points.
3. **Percent change**: the absolute change divided by the starting level.

The steepest segment is not always the largest percent change. A rise of 15 from 45 is a third; a rise of 20 from 70 is under 30%. When the question says "percent", "fastest growth" or "relative", compute or compare the fractions; when it says "by how much", subtract.

### A cut-off axis exaggerates differences

If the vertical axis starts at 36% instead of 0%, a bar for 42% is six units tall and a bar for 38% is two, so the first looks three times the second. The real ratio is $\frac{42}{38}$, about 1.1. Never compare bar heights by eye when the axis does not start at zero; read the values and compare those.

### Two vertical axes

Some charts plot two series against different axes, left and right. Read each series against its own axis. Where two lines cross on such a chart means nothing about the two quantities being equal; it is an accident of the two scales.

### Histograms: counts in intervals

A histogram groups values into intervals (classes) and shows how many fall in each. Its bars touch because the intervals do. What it can tell you:

- how many values fall in an interval or a run of intervals;
- the total count (add all bars);
- which interval holds the median: find where the middle position falls in the running total;
- the modal class, the interval with the tallest bar (when the classes have equal widths).

What it cannot tell you is anything about single values inside an interval. If 26 people commute 20 to 30 minutes, you do not know how many commute more than 25 minutes, nor the single most common commute time. A statement that needs this is not determined by the chart. Check the boundary rule too: a class "20–30" usually means at least 20 and under 30.

### Working without a calculator

Write the values you read onto your sheet as a small table. Most chart questions then become the table questions of the previous lesson: a difference, a ratio against a benchmark, or a count of categories that meet a condition.
`,
  examples: [
    {
      id: 'example-steepest-or-fastest',
      title: 'Steepest segment or fastest growth?',
      problemMd: md`A line chart shows a museum's monthly visitors, in thousands, from January to June. The points are: January 40, February 45, March 60, April 55, May 70, June 90. Between which two consecutive months was the increase largest in absolute terms, and between which was it largest in percent terms?`,
      steps: [
        md`Write the month-to-month changes: $+5$, $+15$, $-5$, $+15$, $+20$. The largest absolute rise, the steepest segment, is May to June, $+20$ thousand.`,
        md`For percent change divide each rise by its starting level: February to March $\frac{15}{45} = \frac{1}{3} \approx 33.3\%$; April to May $\frac{15}{55} = \frac{3}{11} \approx 27.3\%$; May to June $\frac{20}{70} = \frac{2}{7} \approx 28.6\%$; January to February $\frac{5}{40} = 12.5\%$.`,
        md`Confirm the top two without decimals: compare $\frac{1}{3}$ with $\frac{2}{7}$ by cross-multiplying, $1 \times 7 = 7 > 2 \times 3 = 6$, so $\frac{1}{3}$ is larger.`,
      ],
      answerMd: md`The largest absolute rise is May to June (20 thousand visitors); the largest percent rise is February to March (one third). Answering May to June to the percent question is the tempting slip: it is the steepest segment, but it starts from a higher level.`,
    },
    {
      id: 'example-commute-histogram',
      title: 'What a histogram does and does not say',
      problemMd: md`A histogram shows the commute times of 80 employees in 10-minute classes (each includes its lower end and excludes its upper end): 0–10 minutes, 6 people; 10–20, 18; 20–30, 26; 30–40, 16; 40–50, 10; 50–60, 4. What percent commute for at least 30 minutes? In which class is the median? How many commute for more than 35 minutes?`,
      steps: [
        md`Check the total: $6 + 18 + 26 + 16 + 10 + 4 = 80$, as stated.`,
        md`"At least 30 minutes" is the classes 30–40, 40–50 and 50–60: $16 + 10 + 4 = 30$ people, and $\frac{30}{80} = \frac{3}{8} = 37.5\%$.`,
        md`The median of 80 values sits between the 40th and 41st in order. Running totals: 6, then 24, then 50. Both the 40th and 41st fall in the 20–30 class.`,
        md`"More than 35 minutes" splits the 30–40 class. The chart says 16 people are somewhere from 30 to under 40, but not how many are above 35, so the count is between $10 + 4 = 14$ and $16 + 10 + 4 = 30$ and cannot be fixed.`,
      ],
      answerMd: md`37.5% commute for at least 30 minutes; the median is in the 20–30 class; the number above 35 minutes cannot be determined from the histogram. Answering 22 by taking half of the 30–40 bar assumes the 16 people are spread evenly, which the chart does not say.`,
    },
    {
      id: 'example-cut-off-axis',
      title: 'A bar three times as tall',
      problemMd: md`A bar chart shows the market shares of two firms: P has 42% and Q has 38%. The vertical axis starts at 36%. A reader says "P's bar is three times Q's, so P's share is three times Q's". Is that right?`,
      steps: [
        md`Measure the bars from the axis start: P's bar shows $42 - 36 = 6$ points, Q's shows $38 - 36 = 2$ points, so P's bar is indeed three times as tall.`,
        md`The quantities are the full shares, 42% and 38%. Their ratio is $\frac{42}{38} = \frac{21}{19}$, a little over 1.1.`,
      ],
      answerMd: md`No. P's share is only about 10% larger than Q's, 4 percentage points more. The bar heights mislead because the axis is cut off at 36%.`,
    },
  ],
  traps: [
    {
      title: 'Steepest means fastest',
      md: md`The steepest segment of a line is the largest change in absolute terms. Percent growth also depends on the starting level, so a gentler segment that starts low can be the faster growth. Read whether the question asks "by how much" or "by what percent".`,
    },
    {
      title: 'Comparing bar heights on a cut-off axis',
      md: md`When the axis does not start at zero, height ratios exaggerate differences. Read the values from the scale and compare those, never the lengths of the bars.`,
    },
    {
      title: 'Reading a stacked segment from the axis',
      md: md`In a stacked bar only the bottom segment starts at zero. The height of a middle segment is its top minus its bottom; the level where it ends is a running total.`,
    },
    {
      title: 'Assuming values inside a histogram class',
      md: md`A histogram class gives a count for the whole interval. Statements about part of an interval, a single most common value, or the exact median need data the chart does not show, so they cannot be decided from it.`,
    },
  ],
  check: [
    {
      id: 'check-smallest-deficit',
      title: 'Smallest trade deficit',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`A grouped bar chart shows a small country's exports and imports of goods, in billions of euros, for five years. The values behind the bars are:

| Year | Exports | Imports |
| --- | --- | --- |
| 2020 | 24 | 30 |
| 2021 | 30 | 32 |
| 2022 | 36 | 40 |
| 2023 | 33 | 42 |
| 2024 | 40 | 44 |`,
      stemMd: md`In which year was the trade deficit (imports minus exports) smallest?`,
      options: [
        { id: 'A', text: md`2020`, note: md`2020 has the shortest bars, the lowest exports and imports, but the gap between them is 6 billion, not the smallest.` },
        { id: 'B', text: md`2021`, note: '' },
        { id: 'C', text: md`2023`, note: md`2023 has the **largest** deficit, $42 - 33 = 9$ billion; this reverses the question.` },
        { id: 'D', text: md`2024`, note: md`2024 has the highest exports, but imports are high too, leaving a deficit of 4 billion, more than 2021's.` },
      ],
      answer: 'B',
      workingMd: md`Deficit each year: 2020 $30 - 24 = 6$; 2021 $32 - 30 = 2$; 2022 $40 - 36 = 4$; 2023 $42 - 33 = 9$; 2024 $44 - 40 = 4$. The smallest is 2 billion, in 2021.`,
      lesson: 'A question about the gap between two series needs the difference in every category, not the size of either bar.',
    },
    {
      id: 'check-fastest-export-growth',
      title: 'Fastest growth in exports',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the exports and imports chart from the previous question.

| Year | Exports | Imports |
| --- | --- | --- |
| 2020 | 24 | 30 |
| 2021 | 30 | 32 |
| 2022 | 36 | 40 |
| 2023 | 33 | 42 |
| 2024 | 40 | 44 |`,
      stemMd: md`Between which two consecutive years did exports grow by the largest percentage?`,
      options: [
        { id: 'A', text: md`2020 to 2021`, note: '' },
        { id: 'B', text: md`2021 to 2022`, note: md`Exports rose by 6 billion, the same as the year before, but from a larger base of 30, so only 20%.` },
        { id: 'C', text: md`2022 to 2023`, note: md`Exports fell from 36 to 33 billion in this period; it is a decrease, not growth.` },
        { id: 'D', text: md`2023 to 2024`, note: md`This is the largest absolute rise, 7 billion, but from 33 that is $\frac{7}{33}$, which is below a quarter.` },
      ],
      answer: 'A',
      workingMd: md`Percent rises: 2020 to 2021 $\frac{6}{24} = 25\%$; 2021 to 2022 $\frac{6}{30} = 20\%$; 2022 to 2023 a fall; 2023 to 2024 $\frac{7}{33}$, and since $4 \times 7 = 28 < 33$ this is under 25% (about 21%). The largest is 25%, from 2020 to 2021.`,
      lesson: 'For percent growth, divide each rise by its own starting level; the biggest jump on the chart is not always the fastest growth.',
    },
    {
      id: 'check-age-histogram',
      title: 'What the age histogram shows',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`A histogram shows the ages of the 120 members of a sports club. Each class includes its lower end and excludes its upper end.

| Age | Members |
| --- | --- |
| 10–20 | 12 |
| 20–30 | 30 |
| 30–40 | 36 |
| 40–50 | 24 |
| 50–60 | 18 |`,
      stemMd: md`Which statement must be true?`,
      options: [
        { id: 'A', text: md`Exactly 18 members are 55 or older.`, note: md`The 18 members are somewhere from 50 to under 60; the histogram does not say how many of them are 55 or older.` },
        { id: 'B', text: md`The median age is at least 30 and under 40.`, note: '' },
        { id: 'C', text: md`More than half of the members are under 30.`, note: md`Members under 30 number $12 + 30 = 42$, which is 35% of 120, not more than half.` },
        { id: 'D', text: md`The single most common age is between 30 and 40.`, note: md`30–40 is the tallest class, but the most common **single** age could lie in another class; the chart hides individual ages.` },
      ],
      answer: 'B',
      workingMd: md`The total is $12 + 30 + 36 + 24 + 18 = 120$. The median of 120 values lies between the 60th and 61st. Running totals are 12, 42, 78, so both the 60th and 61st members fall in the 30–40 class: the median is at least 30 and under 40. The other statements need individual ages or are false ($42 < 60$).`,
      lesson: 'A histogram fixes counts per class and the class of the median, never single values inside a class.',
    },
  ],
  takeaways: [
    'Read the axis unit and where the axis starts before comparing anything.',
    'The steepest segment is the largest absolute change; percent change also needs the starting level.',
    'In a stacked bar, a segment is its top minus its bottom.',
    'A histogram gives counts per interval; values inside an interval cannot be determined.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-data-insight', skill: 'grad-data-reading-displays' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
