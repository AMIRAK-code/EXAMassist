import { md, type Lesson } from '../../types';

/** Bocconi master's, Data insight: reading tables (docs/COURSE-AUTHORING.md, the plan). */

export const readingTablesLesson: Lesson = {
  slug: 'reading-tables',
  title: 'Reading tables: the frame first, then the figures',
  summary: 'Read a data table’s title, units, rows and totals before any figure, then answer each question from exactly the cells it needs, without a calculator.',
  minutes: 18,
  objectives: [
    'Read the title, units, row labels and total lines of a table before using any number in it.',
    'Find the cells a question needs and choose the right operation: read, compare, subtract or divide.',
    'Compare fractions by hand with benchmarks and cross-multiplication instead of long division.',
  ],
  teachMd: md`
### Where tables sit in the test

Data insight is 16 of the test's 50 questions. Bocconi describes two kinds of item in it: numerical critical reasoning, where tables, histograms, graphs or short passages are followed by several questions, and data sufficiency, which has its own two lessons at the end of this unit. This lesson and the next five are about the first kind, starting with the plainest display of all, the table.

Two rules of the test shape how you should work. Calculators are not allowed, but you may have a pen and two blank A4 sheets. And because several questions are built on the same display, a minute spent understanding the table once is repaid on every question that follows it.

### Read the frame before the numbers

Before you look at a single figure, read four things:

1. **The title and any note.** They give the period, the population and sometimes a definition. "Revenue, thousands of euros, 2025" tells you that 150 means €150,000 and that every figure is for one year.
2. **The units of each column.** Counts, euros, percentages and rates behave differently. A column of percentages cannot be added across rows; a column of counts can.
3. **What one row is.** A shop, a month, a product, a region. A question about "the shops" means the shop rows only.
4. **Total rows and columns.** A line labelled "Total" or "All" is not one more category. It is the sum of the others, and it is the most common source of miscounts when a question asks "how many shops…".

Most wrong answers on tables come from the right method applied to the wrong row or column, not from bad arithmetic.

### Match the question to an operation

Once the frame is clear, decide what the question needs before touching the numbers.

| The question asks for | What you do |
| --- | --- |
| A value, the largest, the smallest | Read one cell, or scan one column |
| "How many rows satisfy…" | Test each row against the condition, one at a time |
| A difference ("how much more") | Subtract two cells with the same units |
| A share, a proportion, "what fraction of" | Divide a part by its own whole |
| A comparison of shares across rows | Compare fractions without fully dividing |

A share needs the right whole. "What share of Arco's annual revenue came in the fourth quarter" divides by Arco's annual total, not by all shops' fourth-quarter revenue. Say the whole aloud before dividing.

### Comparing fractions without a calculator

Questions often ask which row has the largest share, and the fractions will not be friendly. Three tools cover nearly every case.

- **Benchmarks.** Know $\frac{1}{8} = 12.5\%$, $\frac{1}{6} \approx 16.7\%$, $\frac{1}{5} = 20\%$, $\frac{1}{4} = 25\%$, $\frac{1}{3} \approx 33.3\%$, $\frac{3}{8} = 37.5\%$. Many fractions sit clearly above or below one of them: $\frac{140}{440}$ is less than $\frac{1}{3}$ because $3 \times 140 = 420 < 440$.
- **Simplify first.** $\frac{135}{360}$ looks awkward, but dividing both by 45 gives $\frac{3}{8}$.
- **Cross-multiply.** To compare $\frac{a}{b}$ with $\frac{c}{d}$ (all positive), compare $a \times d$ with $c \times b$. The larger product goes with the larger fraction, and you never divide.

You rarely need a share to two decimal places. You need to know which is bigger, or whether it passes a threshold.

### Strict and non-strict conditions

"More than", "at least", "fewer than" and "no more than" decide what happens to a tie. If a row has exactly the threshold value, "more than" excludes it and "at least" includes it. Questions about tables like to put one row exactly on the line, so mark ties as you scan.

### A routine for every table

Read the frame. Restate the question as "which cells, which operation". Work on the A4 sheet, writing down the few numbers you use, so a slip can be found. Then glance back: does the answer have the right units and a sensible size?
`,
  examples: [
    {
      id: 'example-rising-every-quarter',
      title: 'How many shops grew every quarter?',
      problemMd: md`The table shows the quarterly revenue of four bookshops in one year, in thousands of euros.

| Shop | Q1 | Q2 | Q3 | Q4 | Year |
| --- | --- | --- | --- | --- | --- |
| Arco | 120 | 135 | 150 | 195 | 600 |
| Brera | 90 | 110 | 100 | 140 | 440 |
| Corso | 150 | 140 | 130 | 160 | 580 |
| Duomo | 60 | 75 | 90 | 135 | 360 |
| Total | 420 | 460 | 470 | 630 | 1,980 |

In how many of the shops was revenue higher in each quarter than in the quarter before?`,
      steps: [
        md`Read the frame: rows are shops plus a Total row, units are thousands of euros, and the Year column is each row's sum. The question is about **shops**, so the Total row is out.`,
        md`Test each shop row from left to right. Arco: $120 < 135 < 150 < 195$, rises every time. Brera: 110 then 100, a fall. Corso: 150 then 140, a fall. Duomo: $60 < 75 < 90 < 135$, rises every time.`,
        md`Count the shops that passed: Arco and Duomo.`,
      ],
      answerMd: md`Two shops. The tempting wrong answer is 3, which counts the Total row: it also rises every quarter ($420 < 460 < 470 < 630$), but it is not a shop.`,
    },
    {
      id: 'example-largest-q4-share',
      title: 'Which shop depended most on the fourth quarter?',
      problemMd: md`Using the same table, which shop earned the largest share of its own annual revenue in Q4?`,
      steps: [
        md`The whole is each shop's **own** Year figure, so the four fractions are $\frac{195}{600}$, $\frac{140}{440}$, $\frac{160}{580}$ and $\frac{135}{360}$.`,
        md`Simplify where it is quick. $\frac{195}{600} = \frac{13}{40} = 32.5\%$. $\frac{135}{360} = \frac{3}{8} = 37.5\%$.`,
        md`Place the other two against a benchmark. $\frac{140}{440}$: $3 \times 140 = 420 < 440$, so it is below $\frac{1}{3}$, and certainly below $37.5\%$. $\frac{160}{580}$: $4 \times 160 = 640 > 580$, so it is above $\frac{1}{4}$, but $3 \times 160 = 480 < 580$ puts it below $\frac{1}{3}$ as well.`,
        md`Only Duomo's share reaches $37.5\%$; every other shop, Arco at $32.5\%$ included, is below $\frac{1}{3}$.`,
      ],
      answerMd: md`Duomo, with $37.5\%$ of its revenue in Q4. The tempting wrong answer is Arco, which has the largest Q4 revenue (195) but also the largest year, so its share is smaller.`,
    },
    {
      id: 'example-share-of-quarter',
      title: 'A share of a column total',
      problemMd: md`Using the same table, is it true that Arco and Brera together earned more than half of all four shops' revenue in Q3?`,
      steps: [
        md`The whole is now the Q3 column total, 470, because the question is about all four shops in Q3.`,
        md`Arco and Brera in Q3: $150 + 100 = 250$.`,
        md`Half of 470 is 235, and $250 > 235$.`,
      ],
      answerMd: md`True: 250 of 470 is more than half. Dividing by the year total of 1,980 instead would answer a different question, about the whole year.`,
    },
  ],
  traps: [
    {
      title: 'Counting the Total row as a category',
      md: md`A Total line looks like one more row and usually behaves like the bigger rows, so it often passes the same tests. When a question counts "shops", "regions" or "courses", cover the Total row with your finger before you start counting.`,
    },
    {
      title: 'Dividing by the wrong whole',
      md: md`"Share of its own revenue", "share of the quarter's revenue" and "share of all revenue" use three different denominators. The numerator is often the same cell, so the error is invisible unless you name the whole first. Write the fraction with its whole before simplifying.`,
    },
    {
      title: 'Largest value instead of largest share',
      md: md`The row with the biggest number in a column is often not the row with the biggest proportion, because big rows have big totals too. When a question says share, proportion, percent or fraction, every row needs its own division or comparison.`,
    },
    {
      title: 'Ignoring ties in "more than"',
      md: md`A row exactly on the threshold is out for "more than" and in for "at least". Writers of data questions like to put one row on the line, so when two numbers are equal, stop and reread the wording.`,
    },
  ],
  check: [
    {
      id: 'check-highest-advanced-share',
      title: 'Highest proportion of advanced students',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`The table shows the students enrolled in four evening language courses, by level.

| Course | Beginner | Intermediate | Advanced | Total |
| --- | --- | --- | --- | --- |
| French | 48 | 30 | 12 | 90 |
| German | 30 | 20 | 20 | 70 |
| Spanish | 70 | 35 | 25 | 130 |
| Chinese | 40 | 8 | 2 | 50 |
| Total | 188 | 93 | 59 | 340 |`,
      stemMd: md`Which course has the highest proportion of advanced students?`,
      options: [
        { id: 'A', text: md`French`, note: md`French has the highest proportion of **intermediate** students ($\frac{30}{90}$, one third); its advanced share is only $\frac{12}{90}$, about 13%. That is the wrong column.` },
        { id: 'B', text: md`German`, note: '' },
        { id: 'C', text: md`Spanish`, note: md`Spanish has the most advanced students in number (25), but out of 130 that is under 20%, well below German's share.` },
        { id: 'D', text: md`Chinese`, note: md`Chinese has the highest proportion of **beginners** (40 of 50); its advanced share is the lowest, 2 of 50.` },
      ],
      answer: 'B',
      workingMd: md`Each course's advanced count over its own total: French $\frac{12}{90} \approx 13\%$, German $\frac{20}{70} = \frac{2}{7} \approx 29\%$, Spanish $\frac{25}{130} \approx 19\%$, Chinese $\frac{2}{50} = 4\%$. German is the only one above $\frac{1}{4}$: $4 \times 20 = 80 > 70$, while $4 \times 25 = 100 < 130$ and $4 \times 12 = 48 < 90$.`,
      lesson: 'A proportion question needs each row divided by its own total; the biggest count is a different question.',
    },
    {
      id: 'check-more-intermediate-than-advanced',
      title: 'Counting rows with a strict condition',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the language-course table from the previous question.

| Course | Beginner | Intermediate | Advanced | Total |
| --- | --- | --- | --- | --- |
| French | 48 | 30 | 12 | 90 |
| German | 30 | 20 | 20 | 70 |
| Spanish | 70 | 35 | 25 | 130 |
| Chinese | 40 | 8 | 2 | 50 |
| Total | 188 | 93 | 59 | 340 |`,
      stemMd: md`In how many of the courses are there more intermediate students than advanced students?`,
      options: [
        { id: 'A', text: md`2`, note: md`This misses Chinese, where both numbers are small (8 and 2) but intermediate is still the larger.` },
        { id: 'B', text: md`3`, note: '' },
        { id: 'C', text: md`4`, note: md`This treats German's tie (20 and 20) as "more than", or counts the Total row (93 against 59) as a course.` },
        { id: 'D', text: md`5`, note: md`This counts both the German tie and the Total row; the Total row is not a course and a tie is not "more than".` },
      ],
      answer: 'B',
      workingMd: md`Row by row: French $30 > 12$, yes. German $20 = 20$, a tie, so no. Spanish $35 > 25$, yes. Chinese $8 > 2$, yes. The Total row is not a course. Three courses qualify.`,
      lesson: 'Mark ties as you scan, and leave the Total row out of any count of categories.',
    },
    {
      id: 'check-supported-statement',
      title: 'Which statement does the table support?',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the language-course table from the previous questions.

| Course | Beginner | Intermediate | Advanced | Total |
| --- | --- | --- | --- | --- |
| French | 48 | 30 | 12 | 90 |
| German | 30 | 20 | 20 | 70 |
| Spanish | 70 | 35 | 25 | 130 |
| Chinese | 40 | 8 | 2 | 50 |
| Total | 188 | 93 | 59 | 340 |`,
      stemMd: md`Which of the following statements is true?`,
      options: [
        { id: 'A', text: md`Spanish accounts for more than half of all advanced students.`, note: md`Spanish has the most advanced students, 25, but half of the 59 advanced students is 29.5, so 25 is less than half.` },
        { id: 'B', text: md`Beginners make up more than half of all the students in the four courses.`, note: '' },
        { id: 'C', text: md`German has the highest proportion of intermediate students.`, note: md`German's intermediate share is $\frac{20}{70} \approx 29\%$; French's is $\frac{30}{90} \approx 33\%$, which is higher.` },
        { id: 'D', text: md`Chinese has fewer beginners than any other course.`, note: md`Chinese has the smallest total, but its 40 beginners are more than German's 30.` },
      ],
      answer: 'B',
      workingMd: md`There are 188 beginners out of 340 students, and half of 340 is 170, so $188 > 170$: beginners are more than half. Each other statement fails on the figures: $25 < 29.5$; French's intermediate share $\frac{30}{90}$ beats German's $\frac{20}{70}$ (cross-multiply: $30 \times 70 = 2100 > 20 \times 90 = 1800$); and German has fewer beginners than Chinese.`,
      lesson: 'Test every statement against the exact cells it names, and use the Total row only when the statement is about everyone.',
    },
  ],
  takeaways: [
    'Read title, units, what a row is, and the Total lines before any number.',
    'Name the whole before you compute a share: own row, column total or grand total.',
    'Compare fractions by benchmarks and cross-multiplication; you rarely need a decimal.',
    '"More than" excludes a tie and "at least" includes it.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-data-insight', skill: 'grad-data-reading-displays' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
