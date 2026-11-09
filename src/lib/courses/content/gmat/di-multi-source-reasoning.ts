import { md, type Lesson } from '../../types';

/** GMAT Data Insights: Multi-Source Reasoning (docs/COURSE-AUTHORING.md, the plan). */

export const multiSourceReasoningLesson: Lesson = {
  slug: 'multi-source-reasoning',
  title: 'Multi-Source Reasoning: combining rules, tables and updates',
  summary: 'Map what each source contributes, apply a rule from one source to figures in another, and spot updates, conflicts and questions the sources cannot answer.',
  minutes: 24,
  objectives: [
    'Map several sources quickly: what each one is, what it defines and what it gives as data.',
    'Apply a rule stated in one source to the figures in another, step by step.',
    'Notice when a later source changes or contradicts an earlier one, and when the sources together cannot answer a question.',
  ],
  teachMd: md`
### What the question type asks

Multi-Source Reasoning is one of the five question types GMAC lists for Data Insights. As the name says, the work is reasoning from more than one source. This lesson practises it with sources of different kinds, such as a memo, a table and an email: combining them, noticing where they disagree, and judging which source is relevant. GMAC states that for Data Insights questions with several parts, all parts must be correct to score.

The checks on this page are single-answer multiple choice, one question each, and almost every one needs facts from at least two sources.

### Map the sources before the questions

Do not read every source in full detail first. Skim each one and note, in a few words, three things:

1. **What it is.** A rule, a dataset, an update, an opinion.
2. **What it defines.** Thresholds, conditions, definitions ("a station is flagged when…"). Rules usually live in text.
3. **What it gives as data.** Columns, units, the period covered.

A short map, such as "Memo: qualification rule, two conditions, order frequency. Table: price, delivery charge, on-time rate. Email: order frequency changes next quarter", is enough. When a question comes, the map tells you where to look.

### Rules in text, numbers in tables

The most common question applies a rule from a text source to the rows of a table. Treat it as a checklist:

- Write the rule's conditions exactly, including the words that matter: "at most" includes the boundary, "more than" does not; "and" needs every condition, "or" needs only one.
- Find the figures each condition needs. Often one condition needs a value that no single column holds and you must build it, such as a delivery charge spread over the boxes in an order.
- Run every row through every condition and mark pass or fail.

When a rule has an "or", a row can pass on either condition; check the second condition for every row that fails the first. When it has an "and", stop at the first failure.

### Updates and conflicts

Sources may disagree, and the disagreement can be the point of the question. A later email may change an assumption the memo made ("from next quarter we order every two weeks"). Then a question can ask about the situation before the change, after it, or the difference. Read the question for which situation it means, and note on your map which source supersedes which.

Other conflicts are real discrepancies: two sources give different values for the same thing. Do not average them or pick the one you like. Look for what the question says about which to use; if it says nothing, it may be asking you to notice that they differ.

### What the sources cannot tell you

Some questions ask whether something can be determined. Be strict. A monthly total does not give a busiest day; an on-time rate does not give the number of late deliveries unless the number of deliveries is also known; a rule for "this year" says nothing about last year. If the figure you need is not in any source and cannot be built from them, the answer is that it cannot be determined, however reasonable a guess would be.

### Relevance

Not every source matters for every question. Part of the skill is ignoring a source that is beside the point. Before you calculate, ask which sources the question touches. A question about qualification under current terms does not need the email about next quarter, and bringing it in produces a wrong answer.

### Working method

1. Map the sources in a few words each.
2. For each question, list the sources it needs.
3. Write the rule's conditions, then compute only the figures they need.
4. Check boundaries ("at most", "more than") and connectives ("and", "or").
5. Before answering, ask whether a later source changes the picture for the situation the question asks about.
`,
  examples: [
    {
      id: 'example-qualifying-suppliers',
      title: 'Applying a rule from a memo to a table',
      problemMd: md`**Source 1, procurement memo.** "Our warehouses need 18,000 boxes per quarter. A supplier qualifies only if (a) its cost per box, including delivery, is at most \$0.95, and (b) its on-time delivery rate last year was at least 92%. Delivery is charged per order, and we place one order a month, three a quarter, of equal size."

**Source 2, supplier table.**

| Supplier | Price per box | Delivery charge per order | On-time rate last year |
| --- | --- | --- | --- |
| Korra | \$0.82 | \$600 | 94% |
| Lumen | \$0.88 | \$150 | 91% |
| Mistral | \$0.79 | \$1,200 | 96% |
| Norvik | \$0.85 | \$300 | 93% |

**Source 3, email from the warehouse manager.** "From next quarter we will order every two weeks instead: six orders a quarter, still 18,000 boxes in total."

Under the current ordering, which suppliers qualify?`,
      steps: [
        md`The question is about current ordering, so Sources 1 and 2 are needed; Source 3 describes next quarter and does not apply.`,
        md`Build the missing figure: delivery per box. Three orders a quarter cost $3 \times \text{charge}$, spread over 18,000 boxes, so delivery per box is $\frac{3 \times \text{charge}}{18000} = \frac{\text{charge}}{6000}$.`,
        md`Cost per box: Korra $0.82 + \frac{600}{6000} = 0.82 + 0.10 = \$0.92$; Lumen $0.88 + 0.025 = \$0.905$; Mistral $0.79 + 0.20 = \$0.99$; Norvik $0.85 + 0.05 = \$0.90$.`,
        md`Condition (a), at most \$0.95: Korra, Lumen and Norvik pass; Mistral fails. Condition (b), at least 92%: Lumen's 91% fails. The rule says "and", so a supplier must pass both.`,
      ],
      answerMd: md`Korra and Norvik qualify. Mistral, with the lowest price per box, fails once delivery is included, and Lumen, well within the cost limit at \$0.905, fails the on-time condition.`,
    },
    {
      id: 'example-after-update',
      title: 'An update changes the answer',
      problemMd: md`Using the same three sources, which suppliers qualify next quarter, and how much more will the qualifying supplier's boxes cost per quarter than under monthly ordering?`,
      steps: [
        md`Source 3 now applies: six orders a quarter, so delivery per box is $\frac{6 \times \text{charge}}{18000} = \frac{\text{charge}}{3000}$.`,
        md`Cost per box: Korra $0.82 + 0.20 = \$1.02$ (fails); Lumen $0.88 + 0.05 = \$0.93$ (passes on cost, still fails on-time); Mistral $0.79 + 0.40 = \$1.19$ (fails); Norvik $0.85 + 0.10 = \$0.95$.`,
        md`"At most \$0.95" includes \$0.95 itself, so Norvik passes, and its 93% passes the on-time condition.`,
        md`Norvik's quarterly cost: monthly ordering $18000 \times 0.85 + 3 \times 300 = 15300 + 900 = \$16{,}200$; two-weekly ordering $15300 + 6 \times 300 = \$17{,}100$. Check per box: $\frac{16200}{18000} = 0.90$ and $\frac{17100}{18000} = 0.95$.`,
      ],
      answerMd: md`Only Norvik qualifies, at exactly \$0.95 per box, and its boxes cost \$900 more per quarter. Reading "at most" as "less than" would wrongly rule out every supplier.`,
    },
    {
      id: 'example-cannot-determine',
      title: 'What the sources cannot answer',
      problemMd: md`Using the same three sources, can you determine which supplier made the largest number of late deliveries last year?`,
      steps: [
        md`A number of late deliveries is (1 minus the on-time rate) times the number of deliveries each supplier made last year.`,
        md`The table gives on-time rates, but no source gives how many deliveries each supplier made last year, to these warehouses or to anyone else.`,
        md`Without the counts, a supplier with a higher on-time rate could still have more late deliveries, so the ranking cannot be built.`,
      ],
      answerMd: md`No, it cannot be determined. Picking Lumen because it has the lowest on-time rate confuses a rate with a count.`,
    },
  ],
  traps: [
    {
      title: 'Using a source the question does not cover',
      md: md`An update that applies "from next quarter" does not change the answer to a question about now, and the other way round. Before you calculate, say which situation the question asks about and which sources describe it.`,
    },
    {
      title: 'Misreading the boundary words',
      md: md`"At most \$0.95" passes \$0.95; "more than 10%" fails exactly 10%. A row can land exactly on a boundary, as Norvik does next quarter above. Write the inequality down with the correct sign.`,
    },
    {
      title: 'Treating "or" as "and", or "and" as "or"',
      md: md`A rule with "or" flags a row that meets either condition, so a row that fails the first must still be tested on the second. A rule with "and" needs both, so one failure settles it.`,
    },
    {
      title: 'Answering a "can it be determined" question with a guess',
      md: md`If no source gives a needed figure and none can be built from the others, the answer is that it cannot be determined, even when one option looks likely. Rates without counts, totals without daily figures and this year without last year are the usual gaps.`,
    },
  ],
  check: [
    {
      id: 'check-stations-expanded',
      title: 'Applying a rule and a budget note',
      topic: 'Multi-Source Reasoning',
      stemMd: md`**Source A, scheme report.** "A bike-share station is flagged for expansion when its average daily trips exceed 1.5 times its number of docks, or when it was empty for more than 10% of operating hours. Stations operate 18 hours a day."

**Source B, last month's figures (30 days).**

| Station | Docks | Trips in the month | Hours empty in the month |
| --- | --- | --- | --- |
| Quay | 20 | 960 | 40 |
| Market | 30 | 1,260 | 60 |
| Park | 16 | 690 | 30 |
| Mill | 24 | 1,170 | 48 |
| Hill | 12 | 510 | 70 |

**Source C, budget note.** "This year only stations flagged under the trips condition can be expanded; stations flagged only for empty hours will get extra rebalancing instead."

According to the sources, how many of the five stations can be expanded this year?`,
      options: [
        { id: 'A', text: md`0`, note: md`This reads Source A's "or" as "and": no station meets both conditions, but the rule needs only one, and Source C keeps the trips condition.` },
        { id: 'B', text: md`1`, note: md`Mill, at 1.625 trips per dock a day, is not the only station above 1.5: Quay's 32 trips on 20 docks is 1.6.` },
        { id: 'C', text: md`2`, note: '' },
        { id: 'D', text: md`4`, note: md`Four stations are flagged under Source A, but Source C limits expansion to stations flagged under the trips condition, which removes Market and Hill.` },
        { id: 'E', text: md`5`, note: md`This compares daily trips with the number of docks, leaving out the factor 1.5; every station has more daily trips than docks.` },
      ],
      answer: 'C',
      workingMd: md`Daily trips are monthly trips over 30: Quay 32, Market 42, Park 23, Mill 39, Hill 17. Trips condition, more than 1.5 times docks: Quay $32 > 30$ yes; Market $42 > 45$ no; Park $23 > 24$ no; Mill $39 > 36$ yes; Hill $17 > 18$ no. Empty condition, more than 10% of $18 \times 30 = 540$ hours, so more than 54 hours: Market (60) and Hill (70). So Source A flags Quay, Market, Mill and Hill, but Source C allows expansion only for stations flagged under the trips condition: Quay and Mill.`,
      lesson: 'Apply the rule in one source, then ask whether another source narrows or changes it.',
    },
    {
      id: 'check-what-can-be-determined',
      title: 'What the sources can answer',
      topic: 'Multi-Source Reasoning',
      stemMd: md`Using the same three sources, which of the following can be determined?`,
      options: [
        { id: 'A', text: md`The number of trips that started at Quay on its busiest day last month`, note: md`Source B gives only a monthly total of 960; the daily average of 32 says nothing about the busiest day.` },
        { id: 'B', text: md`The number of hours Park had every dock full last month`, note: md`Source B records hours empty, not hours full; nothing in the sources gives full hours.` },
        { id: 'C', text: md`The percentage of last month's operating hours for which Hill was empty`, note: '' },
        { id: 'D', text: md`Whether Mill was flagged for expansion in the previous year`, note: md`The sources give only last month's figures; Mill's flag last year cannot be built from them.` },
        { id: 'E', text: md`The number of trips Market lost while it was empty`, note: md`Being empty stops bikes being taken, but no source gives how many people wanted a bike during those hours.` },
      ],
      answer: 'C',
      workingMd: md`Hill was empty for 70 hours, and Source A gives 18 operating hours a day over Source B's 30 days, 540 hours. So the share is $\frac{70}{540} \approx 13\%$. Every other figure needs data that no source holds: daily trips, full hours, last year's figures or demand while empty.`,
      lesson: 'A figure can be determined only if every input to it appears in, or can be built from, the sources.',
    },
    {
      id: 'check-trips-needed',
      title: 'The smallest total that triggers the rule',
      topic: 'Multi-Source Reasoning',
      stemMd: md`Using the same sources, suppose Park keeps its 16 docks and next month also has 30 days. What is the smallest whole number of trips in the month that would flag Park under the trips condition?`,
      options: [
        { id: 'A', text: md`480`, note: md`This is 1 times the docks over 30 days; it leaves out the factor 1.5.` },
        { id: 'B', text: md`720`, note: md`720 trips is an average of exactly 24 a day, equal to 1.5 times the docks; the rule needs more than that.` },
        { id: 'C', text: md`721`, note: '' },
        { id: 'D', text: md`750`, note: md`This assumes the daily average must be a whole number, 25. A monthly total of 721 already gives an average just above 24.` },
        { id: 'E', text: md`1,080`, note: md`This applies the factor 1.5 twice: $1.5 \times 24 \times 30$, where 24 is already 1.5 times the docks.` },
      ],
      answer: 'C',
      workingMd: md`The condition is an average of more than $1.5 \times 16 = 24$ trips a day, so more than $24 \times 30 = 720$ trips in the month. The smallest whole number above 720 is 721, an average of about $24.03$ a day.`,
      lesson: '"More than" a boundary means the next whole number past it, not the boundary itself.',
    },
  ],
  takeaways: [
    'Map each source in a few words: what it is, what it defines, what data it gives.',
    'Rules usually sit in the text and numbers in the table; apply the rule row by row as a checklist.',
    'Read "at most", "more than", "and" and "or" exactly; a row can sit exactly on the boundary.',
    'Check whether a later source changes the situation the question asks about.',
    'If a needed figure is in no source and cannot be built, it cannot be determined.',
  ],
  practice: { examKey: 'gmat', domain: 'di-multi-source-reasoning', skill: 'msr-draw-combined-inferences' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
