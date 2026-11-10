import { md, type Lesson } from '../../types';

/** Bocconi master's, Data insight: subgroups and totals, Simpson's paradox (docs/COURSE-AUTHORING.md). */

export const subgroupsAndAggregatesLesson: Lesson = {
  slug: 'subgroups-and-aggregates',
  title: 'Subgroups and totals: Simpson’s paradox',
  summary: 'Why a rate can be lower in every subgroup yet higher overall: recompute totals from counts, compare like for like, and judge what a split table shows.',
  minutes: 20,
  objectives: [
    'Recompute an overall rate from subgroup counts, or from subgroup rates and sizes, and work back from it to the mix.',
    'Explain why a group can do better in every subgroup and worse overall.',
    'Compare two groups like for like by giving both the same mix.',
    'Tell which statements a split table supports and which it leaves open.',
  ],
  teachMd: md`
### An overall rate is a weighted average

A table split by category usually shows a rate for each subgroup: defaults per loan, late deliveries per parcel, defects per unit. A group's overall rate is its total events over its total cases:

$$\text{overall rate} = \frac{\text{events}_1 + \text{events}_2 + \dots}{\text{cases}_1 + \text{cases}_2 + \dots}$$

Written another way, it is the subgroup rates weighted by each subgroup's share of the cases, which we will call the **mix**:

$$\text{overall rate} = s_1 r_1 + s_2 r_2 + \dots \qquad (s_1 + s_2 + \dots = 1)$$

So an overall rate depends on two things: how the group does inside each subgroup, and where its cases sit. The lesson on [averages and weighted data](/courses/bocconi-master/averages-and-weighted-data) showed the weighting; this lesson is about what happens when two groups have different mixes.

### Lower in every subgroup, higher overall

Two banks report defaults by loan category:

| Loan category | Bank X | Bank Y |
| --- | --- | --- |
| Prime mortgages | 1 of 100 (1%) | 18 of 900 (2%) |
| Small-business loans | 90 of 900 (10%) | 12 of 100 (12%) |
| All loans | 91 of 1,000 (9.1%) | 30 of 1,000 (3.0%) |

Bank X has the lower default rate in both categories, yet its overall rate is about three times Bank Y's. The arithmetic is right. Small-business loans default far more often than mortgages at both banks, and 90% of X's loans are small-business loans while 90% of Y's are mortgages. In weighted form, X is $0.1 \times 1\% + 0.9 \times 10\% = 9.1\%$ and Y is $0.9 \times 2\% + 0.1 \times 12\% = 3.0\%$. The overall rates mostly record **what** each bank lends, not **how well** it lends within a category.

This reversal is called Simpson's paradox. It is not a contradiction, only a surprise: an aggregate mixes a comparison of performance with a comparison of composition.

### When a reversal can happen

Two conditions must hold together:

1. The subgroups differ a lot in their own rates (here 1–2% against 10–12%).
2. The groups being compared have different mixes across those subgroups.

If both banks had the same mix, the bank with the lower rate in every category would also have the lower overall rate, because each overall rate would be the same weighted sum, taken of smaller numbers for one bank. So the first thing to check in a split table is whether the sizes, or the shares, differ between the groups.

A second quick check: each group's overall rate lies between its own lowest and highest subgroup rates. X's overall rate can be anything from 1% to 10%, depending on its mix; an option outside that range is wrong at once.

### A like-for-like comparison

To compare performance alone, give both groups the **same** mix and recompute. On X's mix (10% mortgages, 90% small business), Y would have $0.1 \times 2\% + 0.9 \times 12\% = 11.0\%$, against X's 9.1%. On Y's mix, X would have $0.9 \times 1\% + 0.1 \times 10\% = 1.9\%$, against Y's 3.0%. Whichever mix you choose, X comes out lower. Holding the mix fixed so that only the subgroup rates differ is called standardising.

### Recomputing an aggregate by hand

- **From counts**: add the events, add the cases, divide once.
- **From rates and sizes**: turn each rate into a count first (10% of 900 is 90), then add.
- **From rates and shares**: take the weighted sum, measuring from the lowest rate if it helps: $1\% + 0.9 \times (10 - 1)\% = 9.1\%$.
- **Backwards**: from the overall rate and the two subgroup rates, the mix follows. X's 9.1% sits $\frac{9.1 - 1}{10 - 1} = \frac{8.1}{9} = 0.9$ of the way from 1% to 10%, so 90% of its loans are in the 10% category.

Never average the rates column unless the subgroups are the same size. And when a table gives rates but no sizes, the overall rate is not determined: you can only say it lies between the subgroup rates.

### What a split table supports

Sort each statement by the level it speaks about.

- **Subgroup statements** ("X has the lower default rate on mortgages") are read straight from the rows.
- **Overall statements** ("Y has the lower default rate across all its loans") need the totals, recomputed from counts.
- **Statements about counts** need counts, not rates. X had more defaulted small-business loans than Y, 90 against 12, although X's default rate on them was lower.
- **Claims of cause or quality** ("X is the more careless lender", "small-business lending caused X's losses") go beyond any table of rates. The table describes outcomes; it does not say why they happened. A split also controls only for the variable it splits by: within "small-business loans" the two banks may still lend to very different firms, and a finer split could change the picture again.

The usual wrong answer is a statement that is true at one level, read as if it were true at another.

### A routine for split tables

Compare the mixes first: if the sizes differ a lot between groups, expect the overall comparison to part from the subgroup ones. Recompute any aggregate from counts. Then read each statement for its level (subgroup, overall or count) and for any word of cause or quality, such as "better", "safer", "because" or "more effective", which the table alone cannot support.
`,
  examples: [
    {
      id: 'example-delivery-firms',
      title: 'Two courier firms',
      problemMd: md`Two courier firms report the share of parcels they delivered on time last month.

| Distance | Firm A | Firm B |
| --- | --- | --- |
| Local | 95% of 200 parcels | 90% of 800 parcels |
| Long-distance | 75% of 800 parcels | 70% of 200 parcels |

Which firm delivered the larger share of all its parcels on time?`,
      steps: [
        md`Turn each rate into a count, because rates of different-sized groups cannot be added. Firm A delivered $0.95 \times 200 = 190$ local and $0.75 \times 800 = 600$ long-distance parcels on time; Firm B delivered $0.9 \times 800 = 720$ and $0.7 \times 200 = 140$.`,
        md`Add and divide once. Firm A: $\frac{190 + 600}{1\,000} = 79\%$. Firm B: $\frac{720 + 140}{1\,000} = 86\%$.`,
        md`Check with the mix. Firm A: $0.2 \times 95 + 0.8 \times 75 = 19 + 60 = 79$. Firm B: $0.8 \times 90 + 0.2 \times 70 = 72 + 14 = 86$. Each lies inside its own range of rates (75 to 95, and 70 to 90).`,
        md`Explain the reversal: long-distance parcels arrive late more often at both firms, and 80% of Firm A's parcels are long-distance against 20% of Firm B's.`,
      ],
      answerMd: md`Firm B, 86% against 79%, although Firm A is 5 points better in each category. Choosing Firm A because it wins both rows is the tempting wrong answer; so is averaging each firm's two rates (85% for A, 80% for B), which points to A as well.`,
    },
    {
      id: 'example-find-the-mix',
      title: 'Working back to the mix',
      problemMd: md`A lender's default rate is 2% on car loans and 8% on personal loans. Across all 4,000 of its loans, the default rate is 3.5%. How many of its loans are personal loans?`,
      steps: [
        md`The overall rate is a weighted average of 2% and 8%, so it sits between them, and how far along it sits gives the mix.`,
        md`Measure from the car-loan rate: $\frac{3.5 - 2}{8 - 2} = \frac{1.5}{6} = 0.25$. So a quarter of the loans carry the 8% rate: they are personal loans.`,
        md`Count: $0.25 \times 4\,000 = 1\,000$ personal loans, and 3,000 car loans.`,
        md`Check with counts: $2\% \times 3\,000 = 60$ and $8\% \times 1\,000 = 80$, so $\frac{140}{4\,000} = 3.5\%$.`,
      ],
      answerMd: md`1,000 personal loans. Measuring from the wrong end, $\frac{8 - 3.5}{6} = 0.75$, gives 3,000, which is the number of car loans. A sense check catches it: 3.5% is much nearer 2% than 8%, so most of the loans must be car loans.`,
    },
    {
      id: 'example-rates-without-sizes',
      title: 'Rates without sizes',
      problemMd: md`Two language schools publish pass rates. School P passes 80% of its beginners and 60% of its advanced students; School Q passes 75% of its beginners and 55% of its advanced students. Neither says how many students it has on each course. Does School P have the higher pass rate over all its students?`,
      steps: [
        md`What is fixed: P's overall rate lies between 60% and 80%, and Q's between 55% and 75%. The ranges overlap, so the rows alone do not settle the totals.`,
        md`Same mix: if both schools had the same share of beginners, P would be exactly 5 points higher overall, since it is 5 points higher on each course. With half beginners, P has 70% and Q has 65%.`,
        md`Different mixes: if 90% of P's students are advanced and 90% of Q's are beginners, P has $0.1 \times 80 + 0.9 \times 60 = 8 + 54 = 62\%$ and Q has $0.9 \times 75 + 0.1 \times 55 = 67.5 + 5.5 = 73\%$. Now Q is higher.`,
        md`The data allow either outcome, so the comparison cannot be decided.`,
      ],
      answerMd: md`It cannot be determined from the rates alone. Answering "yes" is the tempting mistake: it assumes the two schools have the same mix of students. What the data do support is that P has the higher pass rate on each course, and that P's overall rate is between 60% and 80%.`,
    },
  ],
  traps: [
    {
      title: 'Letting the total speak for every subgroup',
      md: md`A lower overall rate does not mean a lower rate in each category, and winning every category does not guarantee winning overall. Check a statement about subgroups in the rows and a statement about the whole in the totals.`,
    },
    {
      title: 'Averaging the rate column',
      md: md`A plain average of subgroup rates treats a category of 100 cases like one of 900. Turn rates into counts, add, and divide once. If the sizes are missing, the overall rate is not determined; it is only bounded by the subgroup rates.`,
    },
    {
      title: 'Confusing a rate with a count',
      md: md`A bigger subgroup can hold more events at a lower rate: 10% of 900 loans is 90 defaults, more than 12% of 100 loans, which is 12. Read whether a statement is about how many or about what share.`,
    },
    {
      title: 'Reading cause or quality into a split table',
      md: md`"X is the riskier lender" or "Y manages its loans better" are judgements about why. A table of rates shows outcomes by category; it cannot rule out other differences, such as the kinds of borrower each bank serves within a category.`,
    },
  ],
  check: [
    {
      id: 'check-north-overall-rate',
      title: 'North’s overall defect rate',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`A manufacturer makes two product lines, Standard and Precision, at two plants. The table shows last quarter's output and the share of units found defective.

| Product line | North: units | North: defect rate | South: units | South: defect rate |
| --- | --- | --- | --- | --- |
| Standard | 400 | 2% | 1,800 | 3% |
| Precision | 1,600 | 6% | 200 | 8% |`,
      stemMd: md`What share of all the units made at North last quarter were defective?`,
      options: [
        { id: 'A', text: md`2.8%`, note: md`This gives 80% weight to Standard and 20% to Precision, the reverse of North's output: 1,600 of its 2,000 units are Precision.` },
        { id: 'B', text: md`4%`, note: md`This is the simple average of 2% and 6%, which treats North's 400 Standard units as weighing as much as its 1,600 Precision units.` },
        { id: 'C', text: md`5.2%`, note: '' },
        { id: 'D', text: md`6.5%`, note: md`This divides all 104 defective units by the 1,600 Precision units only; the base is North's whole output of 2,000.` },
      ],
      answer: 'C',
      workingMd: md`Defective units: Standard $2\% \times 400 = 8$; Precision $6\% \times 1\,600 = 96$. That is 104 of 2,000 units, and $\frac{104}{2\,000} = 5.2\%$. With the mix: 80% of North's output is Precision, so $0.2 \times 2\% + 0.8 \times 6\% = 0.4\% + 4.8\% = 5.2\%$.`,
      lesson: 'An overall rate is summed counts over summed cases, which weights each line by its size.',
    },
    {
      id: 'check-what-the-table-supports',
      title: 'What the table supports',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the table from the previous question.

| Product line | North: units | North: defect rate | South: units | South: defect rate |
| --- | --- | --- | --- | --- |
| Standard | 400 | 2% | 1,800 | 3% |
| Precision | 1,600 | 6% | 200 | 8% |`,
      stemMd: md`Which conclusion does the table support?`,
      options: [
        { id: 'A', text: md`South's defect rate is lower than North's in each product line.`, note: md`The rows say the opposite: South's rates are 3% and 8%, North's 2% and 6%. South is lower only overall.` },
        { id: 'B', text: md`North's overall defect rate is higher than South's, although North's rate is lower in each product line.`, note: '' },
        { id: 'C', text: md`Quality control at North is worse than at South.`, note: md`This draws a judgement about cause from the overall rates. Within each line North does better, and the table says nothing about how either plant checks quality.` },
        { id: 'D', text: md`South made fewer defective units than North in each product line.`, note: md`In Standard, South made $3\% \times 1\,800 = 54$ defective units against North's 8. South made fewer only in Precision, 16 against 96.` },
      ],
      answer: 'B',
      workingMd: md`South's defective units: $3\% \times 1\,800 = 54$ and $8\% \times 200 = 16$, so 70 of 2,000, which is 3.5%. North's overall rate is 5.2% (previous question). North is lower in both rows (2% against 3%, 6% against 8%) and higher overall (5.2% against 3.5%). The reversal comes from the mix: 80% of North's output is Precision, the line with the higher defect rate at both plants, against 10% of South's.`,
      lesson: 'Check each statement at the level it speaks about, rows, totals or counts; no table of rates proves a cause.',
    },
    {
      id: 'check-south-on-north-mix',
      title: 'A like-for-like comparison',
      topic: 'Numerical critical reasoning',
      stimulusMd: md`Use the table from the previous questions.

| Product line | North: units | North: defect rate | South: units | South: defect rate |
| --- | --- | --- | --- | --- |
| Standard | 400 | 2% | 1,800 | 3% |
| Precision | 1,600 | 6% | 200 | 8% |`,
      stemMd: md`Suppose South had made the same mix of products as North, 20% Standard and 80% Precision, with its own defect rate in each line. What would South's overall defect rate have been?`,
      options: [
        { id: 'A', text: md`3.5%`, note: md`This is South's actual overall rate, on its own mix of 90% Standard; the question changes the mix.` },
        { id: 'B', text: md`4.0%`, note: md`This applies North's mix the wrong way round, 80% Standard and 20% Precision.` },
        { id: 'C', text: md`5.5%`, note: md`This is the simple average of 3% and 8%, which is a half-and-half mix, not North's 20% and 80%.` },
        { id: 'D', text: md`7.0%`, note: '' },
      ],
      answer: 'D',
      workingMd: md`$0.2 \times 3\% + 0.8 \times 8\% = 0.6\% + 6.4\% = 7.0\%$. With counts on 2,000 units: 400 Standard units at 3% is 12, and 1,600 Precision units at 8% is 128, so $\frac{140}{2\,000} = 7\%$. On the same mix, South's 7.0% is above North's 5.2%: like for like, North makes fewer defects.`,
      lesson: 'To compare performance alone, give both groups the same mix and recompute the overall rate.',
    },
  ],
  takeaways: [
    'An overall rate is the subgroup rates weighted by the mix of cases.',
    'A group can be lower in every subgroup and higher overall when the mixes differ.',
    'Recompute totals from counts; without sizes, an overall rate is only bounded by its subgroup rates.',
    'For a fair comparison, apply one mix to both groups.',
    'A split table shows outcomes, not their causes.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-data-insight', skill: 'grad-data-derived-conclusions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
