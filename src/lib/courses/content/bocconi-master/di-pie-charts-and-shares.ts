import { md, type Lesson } from '../../types';

/** Bocconi master's, Data insight: pie charts and shares (docs/COURSE-AUTHORING.md, the plan). */

export const pieChartsAndSharesLesson: Lesson = {
  slug: 'pie-charts-and-shares',
  title: 'Pie charts and shares of a whole',
  summary: 'Convert pie-chart shares into amounts and angles, compare two pies with different totals, and take shares of shares without slipping.',
  minutes: 18,
  objectives: [
    'Turn a share into an amount with the total, and a share into a sector angle and back.',
    'Compare two pie charts with different totals by comparing amounts, not only percentages.',
    'Combine a share of a share, and keep a change in share apart from a change in amount.',
  ],
  teachMd: md`
### A pie shows parts of one whole

A pie chart splits one total into parts. Each sector's share is a fraction of that total, and the shares add up to 100% (printed labels may add to 99% or 101% after rounding). What a pie shows well is the relative size of the parts at one moment; what it never shows on its own is the size of the whole. For that you need a total from the title, a note, a table or a passage.

### Three conversions

**Share to amount.** $\text{amount} = \text{share} \times \text{total}$. If a budget of €2,400,000 has 25% for materials, materials cost $0.25 \times 2\,400\,000 = 600\,000$ euros.

**Share to angle.** A full circle is $360°$, so a share $s$ is a sector of $s \times 360°$. Learn the friendly ones: 10% is $36°$, 25% is $90°$, 50% is $180°$, and 5% is $18°$. Then 15% is $36° + 18° = 54°$.

**Angle to share.** Divide by 360: a sector of $72°$ is $\frac{72}{360} = \frac{1}{5} = 20\%$. Some pies are labelled with angles rather than percentages, so be ready to go both ways.

### Comparing two pies

Questions love two pies side by side: this year and ten years ago, or two cities. A sector that is **smaller** in the second pie can stand for a **larger** amount, if the second whole is bigger. So:

- To compare shares, compare the percentages directly.
- To compare amounts, multiply each share by its own total first.

Example: food was 20% of a household's €30,000 spending in one year (€6,000) and 18% of €40,000 ten years later (€7,200). Food's share fell by 2 percentage points, yet spending on food rose by $\frac{1\,200}{6\,000} = 20\%$. Both statements are true; they answer different questions.

### Change in share versus change in amount

A share moving from 45% to 36% has fallen by 9 **percentage points**, and by $\frac{9}{45} = 20\%$ **of its old value**. Neither number says what happened to the amount; that also depends on the change in the total. When a question asks about "the number of" or "spending on", compute amounts. When it asks about "the share" or "the proportion", compare percentages, and read whether it wants points or percent.

### A share of a share

Pies are sometimes nested: a sector is split again in a second chart or in the text. "60% of the students are in economics, and 25% of the economics students are international" makes international economics students $0.60 \times 0.25 = 0.15$, that is 15% of **all** students. Multiply the shares; never add them, and be clear which whole the final answer is a share of.

### The "other" sector and rounded labels

Many pies end with a sector labelled "other" that lumps small categories together. It is one sector, not a category you can split: a question asking whether some unnamed group exceeds 3% cannot be answered from a 7% "other" sector. Labels are also often rounded, so the printed shares may add to 99% or 101%. If a question's options are close together, the rounding can matter; work from exact figures in a table or passage whenever one is given, and treat a rounded share as an approximation.

### Pies without a calculator

Shares are usually round, so the arithmetic is mostly multiplying a round percent by a round total. Write $36\%$ of $2\,500$ as $36 \times 25 = 900$: one percent of 2,500 is 25. For angles, build from $10\% = 36°$ and $1\% = 3.6°$. For comparisons between sectors in the same pie, the totals cancel: the ratio of two amounts is just the ratio of their shares.
`,
  examples: [
    {
      id: 'example-cost-pie',
      title: 'Amounts and angles from one pie',
      problemMd: md`A pie chart shows how a firm's 2025 costs of €2,400,000 were split: staff 45%, materials 25%, rent 15%, marketing 10%, other 5%. How much did rent cost, what angle does the rent sector have, and how many times larger were staff costs than marketing costs?`,
      steps: [
        md`Rent amount: $0.15 \times 2\,400\,000 = 360\,000$. One percent of 2,400,000 is 24,000, and $15 \times 24\,000 = 360\,000$ confirms it.`,
        md`Rent angle: $0.15 \times 360° = 54°$, or $36° + 18°$ from the 10% and 5% benchmarks.`,
        md`Staff over marketing: within one pie the total cancels, so the ratio is $\frac{45}{10} = 4.5$. Check with amounts: $1\,080\,000 \div 240\,000 = 4.5$.`,
      ],
      answerMd: md`Rent cost €360,000, its sector is $54°$, and staff costs were 4.5 times marketing costs. Answering "35 times" or "35 points more" mixes up a ratio with a difference of shares; staff is 35 percentage points above marketing, but 4.5 times as large.`,
    },
    {
      id: 'example-two-pies',
      title: 'Smaller slice, bigger amount',
      problemMd: md`Two pie charts show a city's tourist spending. In 2015 the total was €50 million and accommodation was 40%. In 2025 the total was €80 million and accommodation was 30%. Did spending on accommodation rise or fall, and by how much?`,
      steps: [
        md`The question is about **spending**, an amount, so multiply each share by its own total.`,
        md`2015: $0.40 \times 50 = 20$ million euros. 2025: $0.30 \times 80 = 24$ million euros.`,
        md`Change: $24 - 20 = 4$ million, and as a percent of the old value $\frac{4}{20} = 20\%$.`,
      ],
      answerMd: md`Spending on accommodation rose by €4 million, or 20%, even though its sector shrank from 40% to 30%. "It fell by 10 points" describes the share, not the spending.`,
    },
    {
      id: 'example-share-of-share',
      title: 'A share of a share',
      problemMd: md`A university has 8,000 students. A pie chart shows that 60% study economics. A second chart shows that 25% of the economics students are international. How many international economics students are there, and what share of all students are they?`,
      steps: [
        md`Multiply the shares: $0.60 \times 0.25 = 0.15$, so international economics students are 15% of all students.`,
        md`Apply it to the whole: $0.15 \times 8\,000 = 1\,200$.`,
        md`Check by steps: economics students $0.6 \times 8\,000 = 4\,800$, and a quarter of 4,800 is 1,200.`,
      ],
      answerMd: md`1,200 students, 15% of the university. Taking 25% of all 8,000 students (2,000) uses the wrong whole: the 25% is of economics students only.`,
    },
  ],
  traps: [
    {
      title: 'Comparing slices across pies with different totals',
      md: md`A smaller percentage of a larger whole can be a larger amount. Before saying "fell" or "rose" about an amount, multiply each share by its own total.`,
    },
    {
      title: 'Points versus percent of a share',
      md: md`A share going from 45% to 36% is down 9 percentage points and down 20% of its old value. Options often include both, plus the change in the amount, which can be zero or positive. Read which of the three the question asks for.`,
    },
    {
      title: 'The wrong whole for a nested share',
      md: md`"25% of the economics students" is not 25% of all students. When one share is taken of a sector, multiply the shares and state which whole the result belongs to.`,
    },
    {
      title: 'Percent read as degrees',
      md: md`A 16% sector is not $16°$; it is $0.16 \times 360° = 57.6°$. Convert with 360, and sanity-check: a quarter of the pie must be $90°$.`,
    },
  ],
  check: [
    {
      id: 'check-car-commuters',
      title: 'What happened to the number of car commuters?',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Two pie charts show how surveyed commuters in a city travel to work. In 2019, 2,000 commuters were surveyed; in 2024, 2,500.

| Main mode | 2019 | 2024 |
| --- | --- | --- |
| Car | 45% | 36% |
| Bus | 25% | 24% |
| Bicycle | 10% | 16% |
| Train | 15% | 18% |
| Walking | 5% | 6% |`,
      stemMd: md`From 2019 to 2024, the number of surveyed commuters who travelled mainly by car:`,
      options: [
        { id: 'A', text: md`fell by 20%`, note: md`This is the fall in the car **share** as a percent of its old value, $\frac{9}{45}$; it ignores that more people were surveyed.` },
        { id: 'B', text: md`fell by 9%`, note: md`The share fell by 9 percentage points; that is neither a percent change nor a statement about the number.` },
        { id: 'C', text: md`stayed the same`, note: '' },
        { id: 'D', text: md`rose by 25%`, note: md`25% is the growth in the number surveyed, from 2,000 to 2,500, not in the number travelling by car.` },
      ],
      answer: 'C',
      workingMd: md`Car commuters in 2019: $0.45 \times 2\,000 = 900$. In 2024: $0.36 \times 2\,500 = 36 \times 25 = 900$. The number is unchanged; the share fell only because the total grew.`,
      lesson: 'To compare amounts across two pies, multiply each share by its own total first.',
    },
    {
      id: 'check-bicycle-angle',
      title: 'The angle of a sector',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the commuting pie charts from the previous question.

| Main mode | 2019 | 2024 |
| --- | --- | --- |
| Car | 45% | 36% |
| Bus | 25% | 24% |
| Bicycle | 10% | 16% |
| Train | 15% | 18% |
| Walking | 5% | 6% |`,
      stemMd: md`In the 2024 pie chart, what is the angle of the bicycle sector?`,
      options: [
        { id: 'A', text: md`$16°$`, note: md`This reads the percentage as degrees; a percent must be multiplied by $360°$.` },
        { id: 'B', text: md`$36°$`, note: md`$36°$ is the bicycle sector in the **2019** pie, where the share was 10%.` },
        { id: 'C', text: md`$57.6°$`, note: '' },
        { id: 'D', text: md`$64.8°$`, note: md`This is $0.18 \times 360°$, the train sector in 2024, the neighbouring row.` },
      ],
      answer: 'C',
      workingMd: md`$0.16 \times 360° = 57.6°$. By benchmarks: 10% is $36°$ and 1% is $3.6°$, so 6% is $21.6°$ and $36° + 21.6° = 57.6°$.`,
      lesson: 'A share becomes an angle by multiplying by 360, built from 10% = 36°.',
    },
    {
      id: 'check-share-fell-number-rose',
      title: 'Share down, number up',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the commuting pie charts from the previous questions.

| Main mode | 2019 | 2024 |
| --- | --- | --- |
| Car | 45% | 36% |
| Bus | 25% | 24% |
| Bicycle | 10% | 16% |
| Train | 15% | 18% |
| Walking | 5% | 6% |`,
      stemMd: md`For which mode of transport did the share of commuters fall while the number of commuters rose?`,
      options: [
        { id: 'A', text: md`Car`, note: md`The car share fell, but the number stayed at 900; it did not rise.` },
        { id: 'B', text: md`Bus`, note: '' },
        { id: 'C', text: md`Train`, note: md`The train share rose, from 15% to 18%, so it fails the first condition.` },
        { id: 'D', text: md`Walking`, note: md`The walking share rose, from 5% to 6%; its number rose too, from 100 to 150.` },
      ],
      answer: 'B',
      workingMd: md`Only car and bus have falling shares. Car: 900 in both years. Bus: $0.25 \times 2\,000 = 500$ in 2019 and $0.24 \times 2\,500 = 24 \times 25 = 600$ in 2024, a rise. So bus is the mode whose share fell and whose number rose.`,
      lesson: 'Share and amount can move in opposite directions when the whole changes; check each with its own calculation.',
    },
  ],
  takeaways: [
    'Amount = share × total; a pie alone never gives the total.',
    'Angle = share × 360°, with 10% = 36° as the anchor.',
    'Across two pies, compare amounts only after multiplying by each total.',
    'A share of a share is a product, and belongs to the larger whole.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-data-insight', skill: 'grad-data-reading-displays' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
