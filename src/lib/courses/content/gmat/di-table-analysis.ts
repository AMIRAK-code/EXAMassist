import { md, type Lesson } from '../../types';

/** GMAT Data Insights: Table Analysis (docs/COURSE-AUTHORING.md, the plan). */

export const tableAnalysisLesson: Lesson = {
  slug: 'table-analysis',
  title: 'Table Analysis: reading a data table for exactly what is asked',
  summary: 'Read a spreadsheet-style table column by column, test each statement against the right figures, and keep rates, counts and averages apart.',
  minutes: 20,
  objectives: [
    'Read a table\'s title, columns and units before judging any statement about it.',
    'Decide whether a stated condition is met by ranking, comparing or multiplying instead of dividing every row.',
    'Combine rows correctly: weight rates by their base, and keep counts and percentages apart.',
  ],
  teachMd: md`
### What a Table Analysis item asks

Table Analysis is one of the five question types GMAC lists for the Data Insights section, alongside Data Sufficiency, Multi-Source Reasoning, Graphics Interpretation and Two-Part Analysis. As the name says, the work is reading a table of data, and this lesson practises the core skill: judging statements against the figures in a table, each statement on its own. GMAC states that for Data Insights questions with several parts, all parts must be correct to score, so one careless row can cost the whole question.

The checks on this page are single-answer multiple choice: they ask how many statements are true, or which combination of statements is true. Every statement still has to be settled on its own before you choose.

### Read the frame before the numbers

Before you look at a single figure, read three things:

1. **The title and any note under the table.** They tell you the period, the population and sometimes a definition ("late" means more than two days after the promised date).
2. **The column headings and their units.** Thousands or units? Percent or count? Per month or per year? A column headed "Late shipments (%)" is a rate; you cannot add it across rows.
3. **What each row is.** A row may be a store, a month or a product. Statements that mix rows of different kinds ("the North region") need you to group rows first.

Most wrong answers in Table Analysis come from using the right method on the wrong column.

### Match each statement to its columns

Take each statement and ask: which column or columns does it need, and what operation? Statements fall into a few families:

| Statement type | What you do |
| --- | --- |
| Largest, smallest, rank | Scan or sort one column |
| "At least", "more than", threshold | Compare each row with the threshold |
| Median | Sort the column, take the middle value |
| Mean or total | Add the column (or compare with the median by reasoning) |
| Ratio between two columns | Divide, or better, multiply the threshold back |
| Group statements | Add counts for the rows in the group, then compute |

Name the family, then do only that work. A statement about one column never needs the other columns.

### Sorting is your first tool

A sorted column answers rank, median and "how many exceed" questions at once. When you have seven or nine rows, write the column in order on your scratch paper: it takes seconds and prevents the classic slip of taking the median from the unsorted list. For an odd number of rows, the median is the middle value; for an even number, the mean of the two middle values.

### Test a ratio condition by multiplying

"Did the warehouse ship more than 410 orders per staff member?" invites seven divisions. Multiply instead: the condition is $\text{orders} > 0.41 \times \text{staff}$. Multiplying a round threshold is faster and less error-prone than dividing awkward numbers, and it gives a clear yes or no even when the two sides are close.

### Combining rows: counts add, rates do not

A rate column (percent late, revenue per employee, growth rate) cannot be summed or simply averaged across rows that have different sizes. To get a group's rate:

$$\text{group rate} = \frac{\text{sum of the counts}}{\text{sum of the bases}}$$

So convert each rate back to a count (rate times base), add the counts, add the bases, and divide once. The plain average of the rates is right only when every row has the same base. The weighted rate always lies between the smallest and largest row rates, pulled towards the rates of the bigger rows.

### Compare mean and median without a full calculation

A statement like "the median exceeds the mean" does not always need the mean to the decimal. Find the median, then check whether the deviations of the values from it sum to a positive or a negative number: if the values below the median are further from it in total, the mean is pulled below the median. When the call is close, add the column; the section has an on-screen calculator.

### Judge each statement independently

Do not let one statement colour the next. A table that looks "good" for one store may still make a statement about that store false. Settle each statement with its own figures, write a tick or a cross, and only then answer.
`,
  examples: [
    {
      id: 'example-rate-or-count',
      title: 'Rate, count and median',
      problemMd: md`A logistics firm reports one quarter's figures for seven warehouses.

| Warehouse | Region | Orders shipped (thousands) | Late shipments (%) | Staff |
| --- | --- | --- | --- | --- |
| Alder | North | 48 | 3.5 | 120 |
| Birch | North | 62 | 2.0 | 150 |
| Cedar | South | 35 | 6.0 | 80 |
| Dunmore | South | 54 | 4.5 | 135 |
| Elm | East | 71 | 3.0 | 170 |
| Fenwick | East | 40 | 5.0 | 95 |
| Garth | West | 58 | 2.5 | 140 |

Judge each statement. I: The warehouse with the highest late-shipment rate also shipped the fewest orders. II: The warehouse with the highest late-shipment rate had the largest number of late shipments. III: The median number of orders shipped is greater than the mean.`,
      steps: [
        md`Statement I uses two columns, each by rank. The highest rate is Cedar's 6.0%; the fewest orders are Cedar's 35 thousand. True.`,
        md`Statement II asks for a **count** of late shipments, so convert each rate: orders times rate. Cedar $35 \times 0.06 = 2.1$; Dunmore $54 \times 0.045 = 2.43$; Elm $71 \times 0.03 = 2.13$; Fenwick $40 \times 0.05 = 2.0$; Alder $48 \times 0.035 = 1.68$; Garth $58 \times 0.025 = 1.45$; Birch $62 \times 0.02 = 1.24$ (all in thousands).`,
        md`The largest count is Dunmore's 2.43 thousand, not Cedar's 2.1 thousand. Statement II is false: a high rate on a small base can give fewer late shipments than a moderate rate on a large base.`,
        md`Statement III: sort the orders: 35, 40, 48, 54, 58, 62, 71. The median is the fourth value, 54. The total is $368$, so the mean is $\frac{368}{7} \approx 52.6$. Check the total another way: $48 + 62 = 110$, $35 + 54 = 89$, $71 + 40 = 111$, plus $58$ gives $368$. The median is greater. True.`,
      ],
      answerMd: md`Statements I and III are true; II is false. The tempting slip is to treat the highest rate as the most late shipments: Cedar leads on the rate, Dunmore on the count.`,
    },
    {
      id: 'example-threshold-by-multiplying',
      title: 'A ratio threshold, tested by multiplying',
      problemMd: md`Using the same table, for how many warehouses did orders shipped exceed 410 per staff member?`,
      steps: [
        md`Orders are in thousands, so 410 orders per staff member is 0.41 thousand. The condition is $\text{orders} > 0.41 \times \text{staff}$.`,
        md`Multiply the threshold for each row: Alder $0.41 \times 120 = 49.2$, Birch $61.5$, Cedar $32.8$, Dunmore $55.35$, Elm $69.7$, Fenwick $38.95$, Garth $57.4$.`,
        md`Compare with orders: Alder 48 (no), Birch 62 (yes), Cedar 35 (yes), Dunmore 54 (no), Elm 71 (yes), Fenwick 40 (yes), Garth 58 (yes).`,
        md`Check two rows by division: Alder $\frac{48}{120} = 0.40$ and Dunmore $\frac{54}{135} = 0.40$, both exactly 400 per staff member, so both fail.`,
      ],
      answerMd: md`Five warehouses meet the condition. Reading "410" against the thousands column without converting would make every row fail.`,
    },
    {
      id: 'example-group-rate',
      title: 'A regional rate is a weighted rate',
      problemMd: md`Using the same table, was the North region's overall late-shipment rate (Alder and Birch together) below 2.7%?`,
      steps: [
        md`A group rate is total late shipments divided by total orders. Late shipments: Alder $1.68$ and Birch $1.24$ thousand, a total of $2.92$ thousand.`,
        md`Total orders: $48 + 62 = 110$ thousand.`,
        md`Group rate: $\frac{2.92}{110} \approx 0.0265$, about $2.65\%$. Check: $110 \times 0.027 = 2.97$, which is more than $2.92$, so the rate is below 2.7%.`,
      ],
      answerMd: md`Yes: about 2.65%. The plain average of the two rates, $\frac{3.5 + 2.0}{2} = 2.75\%$, would give the wrong answer, because Birch, with the lower rate, shipped more orders and pulls the group rate towards 2.0%.`,
    },
  ],
  traps: [
    {
      title: 'Treating a rate as a count',
      md: md`The row with the highest percentage is not necessarily the row with the most of anything. Whenever a statement says "the most", "the largest number" or "the greatest amount", convert rates to counts first (rate times base). Rank the counts, not the rates.`,
    },
    {
      title: 'Averaging rates across rows of different sizes',
      md: md`A region's late rate, a group's growth rate or a combined margin is a weighted figure. Convert to counts, add, then divide once. The simple average is right only when the bases are equal, and in most tables they are not.`,
    },
    {
      title: 'Taking a median from an unsorted column',
      md: md`The middle row of the table is not the median unless the table is sorted on that column. Write the column out in order first; with an even number of rows, average the two middle values.`,
    },
    {
      title: 'Ignoring units in the heading',
      md: md`"Orders shipped (thousands)" and "Revenue (\$000)" change every threshold in the statements. Convert the statement's number to the table's units, or the table's to the statement's, before comparing.`,
    },
  ],
  check: [
    {
      id: 'check-which-statements',
      title: 'Which statements are true?',
      topic: 'Table Analysis',
      stemMd: md`A retailer reports annual revenue for five stores.

| Store | Revenue 2024 (\$000) | Revenue 2025 (\$000) | Employees |
| --- | --- | --- | --- |
| P | 420 | 462 | 12 |
| Q | 380 | 361 | 10 |
| R | 510 | 561 | 15 |
| S | 295 | 354 | 9 |
| T | 640 | 672 | 20 |

I: The store with the largest percent increase in revenue also had the largest increase in dollars. II: Total revenue of the five stores grew by more than 8% from 2024 to 2025. III: In 2025, store S had the highest revenue per employee.

Which of the statements are true?`,
      options: [
        { id: 'A', text: md`I only`, note: md`Statement III is also true: S's \$354,000 over 9 employees is about \$39,300 each, above P's \$38,500.` },
        { id: 'B', text: md`II only`, note: md`Total revenue grew from \$2,245,000 to \$2,410,000, about 7.3%, so II is false; adding the store percent changes or eyeballing the big stores suggests more.` },
        { id: 'C', text: md`I and III only`, note: '' },
        { id: 'D', text: md`II and III only`, note: md`II is false (total growth is about 7.3%), and I is true: S leads on both the percent increase (20%) and the dollar increase (\$59,000).` },
        { id: 'E', text: md`I, II and III`, note: md`Statement II fails: $\frac{165}{2245} \approx 7.3\%$, below 8%. The simple average of the five store growth rates, $\frac{10 - 5 + 10 + 20 + 5}{5} = 8\%$, is not even above 8%, and it is the wrong measure anyway.` },
      ],
      answer: 'C',
      workingMd: md`Changes in \$000: P $+42$ (10%), Q $-19$ ($-5\%$), R $+51$ (10%), S $+59$ (20%), T $+32$ (5%). S has both the largest percent and the largest dollar increase, so I is true. Totals: 2024 is $420 + 380 + 510 + 295 + 640 = 2245$; 2025 is $462 + 361 + 561 + 354 + 672 = 2410$. Growth is $\frac{165}{2245} \approx 7.3\%$, so II is false. Revenue per employee in 2025, in \$000: P $38.5$, Q $36.1$, R $37.4$, S $\frac{354}{9} \approx 39.3$, T $33.6$. S is highest, so III is true.`,
      lesson: 'Settle each statement with its own columns, and compute group growth from totals, not from the rows\' percentages.',
    },
    {
      id: 'check-closest-to-average',
      title: 'Closest to the overall figure',
      topic: 'Table Analysis',
      stemMd: md`Using the same table, which store's 2025 revenue per employee was closest to the revenue per employee of the five stores taken together in 2025?`,
      options: [
        { id: 'A', text: md`P`, note: md`P has the median 2025 revenue (\$462,000), but the question is about revenue per employee; P's \$38,500 is about \$2,000 above the overall figure.` },
        { id: 'B', text: md`Q`, note: '' },
        { id: 'C', text: md`R`, note: md`R is closest to the plain average of the five stores' ratios, about \$37,000. The five stores together means total revenue over total employees, about \$36,500, and Q is closer to that.` },
        { id: 'D', text: md`S`, note: md`S has the highest revenue per employee, about \$39,300, the furthest above the overall figure.` },
        { id: 'E', text: md`T`, note: md`T has the largest revenue, but its \$33,600 per employee is the furthest below the overall figure.` },
      ],
      answer: 'B',
      workingMd: md`Together the five stores had 2025 revenue of \$2,410,000 and $12 + 10 + 15 + 9 + 20 = 66$ employees, so $\frac{2410}{66} \approx 36.5$ thousand dollars per employee. The store figures are P $38.5$, Q $36.1$, R $37.4$, S $39.3$, T $33.6$. Q is $0.4$ away, R is $0.9$ away, and the others are further. The average of the five ratios, $\frac{184.9}{5} \approx 37.0$, is a different and wrong quantity.`,
      lesson: 'A figure for the stores taken together is a ratio of totals, not the average of the rows\' ratios.',
    },
    {
      id: 'check-group-growth',
      title: 'Growth of a combined group',
      topic: 'Table Analysis',
      stemMd: md`Using the same table, suppose stores P and Q are reported together as one city group. By about what percent did the city group's revenue change from 2024 to 2025?`,
      options: [
        { id: 'A', text: md`An increase of 2.5%`, note: md`This averages P's 10% and Q's $-5\%$ as if the two stores were the same size. P is bigger, so the group grows faster than the plain average.` },
        { id: 'B', text: md`An increase of about 2.9%`, note: '' },
        { id: 'C', text: md`An increase of 5%`, note: md`This adds the two percent changes, $10\% + (-5\%)$. Percent changes of different bases cannot be added.` },
        { id: 'D', text: md`An increase of 15%`, note: md`This is the gap between the two stores' rates, $10\% - (-5\%)$, not the group's change.` },
        { id: 'E', text: md`An increase of 23%`, note: md`The group gained \$23,000; that is a dollar change, not a percent of the starting \$800,000.` },
      ],
      answer: 'B',
      workingMd: md`Group revenue in 2024: $420 + 380 = 800$ thousand dollars. In 2025: $462 + 361 = 823$ thousand dollars. The change is $\frac{823 - 800}{800} = \frac{23}{800} = 2.875\%$, about 2.9%. As a check, the weighted average of 10% and $-5\%$ with weights 420 and 380 is $\frac{42 - 19}{800}$, the same 2.875%.`,
      lesson: 'A group\'s percent change comes from the group\'s totals, which weights each row by its size.',
    },
  ],
  takeaways: [
    'Read the title, the units and what a row is before judging any statement.',
    'Convert rates to counts before ranking "the most" of anything.',
    'Test a ratio threshold by multiplying the threshold, not by dividing every row.',
    'A group rate is the sum of the counts over the sum of the bases, never the plain average of the rates.',
  ],
  practice: { examKey: 'gmat', domain: 'di-table-analysis', skill: 'ta-analyze-spreadsheet-data' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
