import { md, type Lesson } from '../../types';

/** GMAT Critical Reasoning, lesson 7: plan and discrepancy questions. */
export const planAndDiscrepancyQuestions: Lesson = {
  slug: 'plan-and-discrepancy-questions',
  title: 'Plan and discrepancy questions: will it work, and how can both be true?',
  summary: 'Judge whether a plan will reach its goal, and explain an apparent paradox by finding the fact that lets both surprising statements be true.',
  minutes: 22,
  objectives: [
    'Recognise plan questions and discrepancy (paradox) questions from their stems.',
    'Test a plan against its stated goal, looking for the response, cost or obstacle that decides it.',
    'Explain a discrepancy with an option that makes both facts true at once, not just one of them.',
  ],
  teachMd: md`
### Two related question types

Both types start from a situation rather than a finished argument, and both reward the same habit: thinking about how the world works behind the numbers.

- A **plan** question describes a goal and a plan to reach it, and asks which fact most supports or most undermines the prediction that the plan will succeed. Stems: "Which of the following, if true, most strongly supports the prediction that the plan will achieve its goal?", "...most strongly indicates that the plan will fail?"
- A **discrepancy** question gives two facts that seem to clash, and asks which option best explains how both can be true. Stems: "Which of the following, if true, most helps to resolve the apparent discrepancy?", "...most helps to explain the surprising result?"

Neither type usually has a stated conclusion with "therefore". You must supply the expectation that makes the plan look sensible or the facts look odd.

### Plans: hold the goal fixed

Write down the plan's goal in exact words: "raise total fare revenue", not "help the bus company". Then ask how the plan is supposed to produce that goal, step by step, and where the chain could break.

| Plan breaks when... | Example |
| --- | --- |
| People respond differently from what the planners expect | A price cut attracts too few new buyers to make up for the lower price |
| The plan misses the real cause | Extra checkout staff do not help if the queue is at the car park |
| A side effect cancels the gain | Longer opening hours raise heating costs more than sales |
| Capacity or another limit blocks it | More passengers cannot board buses that are already full |

A plan supporter usually shows that the critical step will happen: enough new buyers, the real cause addressed, no limit in the way. Numbers often matter. A 20 percent fare cut multiplies revenue per passenger by $0.8$, so passenger numbers must rise by more than a quarter ($\frac{1}{0.8} = 1.25$) for revenue to rise. An option that guarantees a rise above that threshold supports the plan; one that does not may be too weak.

### Discrepancies: find the hidden difference

A discrepancy looks like a contradiction only because you are assuming something. "Sales of the e-reader rose, yet sales of e-books in its store fell" clashes only if you assume new owners buy books from the store. The explanation is the fact that removes that hidden assumption: perhaps the new model lets owners borrow library books free.

The method:

1. State both facts precisely, including what is measured (number, rate, share, average) and over what period.
2. Ask what you expected, and why the second fact surprises you.
3. Look for an option that shows the expectation was wrong while leaving **both** facts true.

### The two-sided check

The commonest wrong option explains **one** fact only. Lower e-reader prices explain why more e-readers sold, but they deepen the puzzle about falling e-book sales. A good explanation needs the two facts side by side, and should make you say "of course" about the pair.

A second common wrong option **deepens** the discrepancy: it makes the expectation even stronger. "Most of last year's buyers had never owned an e-reader" makes falling store sales more surprising, not less.

### Averages, totals and rates

Many discrepancies turn on the difference between kinds of measure. The average price of a car can rise while households spend less on cars, if households buy cars less often. Total accidents can fall while serious injuries rise, if the mix of accidents changes. When the two facts use different measures, the explanation usually lies in the quantity that links them: how often, how many, of what kind.

### Wrong-answer patterns

1. **One-sided.** Explains one fact and leaves the other as puzzling as before.
2. **Deepener.** Makes the clash worse.
3. **Irrelevant.** About a different product, place or period.
4. **Off the goal.** For plans: bears on something other than the stated goal, such as costs when the goal is revenue, or the environment when the goal is profit.
5. **Wrong measure.** Explains a change in totals when the puzzle is about averages, or the reverse.
`,
  examples: [
    {
      id: 'example-fare-cut-threshold',
      title: 'How much must demand rise?',
      problemMd: md`A theatre plans to cut ticket prices by 25 percent to raise its total ticket revenue. By what proportion must the number of tickets sold rise for the plan to succeed?`,
      steps: [
        md`Revenue is price times tickets. After the cut, price is multiplied by $0.75$.`,
        md`For revenue to rise, tickets must be multiplied by more than $\frac{1}{0.75} = \frac{4}{3}$.`,
        md`So ticket sales must rise by more than $\frac{1}{3}$, about 33 percent. Check: $0.75 \times \frac{4}{3} = 1$, exactly break-even.`,
      ],
      answerMd: md`Sales must rise by more than a third. A 25 percent rise in sales is the tempting wrong answer: $0.75 \times 1.25 = 0.9375$, so revenue would fall.`,
    },
    {
      id: 'example-plan-misses-cause',
      title: 'A plan that misses the cause',
      problemMd: md`"To reduce complaints about slow service, Dunmore Café will hire two more baristas." Which undermines the plan: (1) "Most complaints concern the wait for food from the kitchen, which has one cook", or (2) "Baristas in the area are paid more than they were last year"?`,
      steps: [
        md`Goal: fewer complaints about slow service. Mechanism: more baristas make drinks faster.`,
        md`Option (1): if the delay is in the kitchen, faster drinks do not touch the main cause. The plan is undermined.`,
        md`Option (2): higher pay bears on cost, not on whether complaints fall.`,
      ],
      answerMd: md`Option (1) undermines the plan, because it shows the plan misses the real cause. Option (2) is off the goal.`,
    },
    {
      id: 'example-explain-both',
      title: 'Explaining both facts',
      problemMd: md`"Rentals at Sutton's bike-hire scheme rose by half last summer, yet the scheme's total rental income fell." Which explains this: (1) "The scheme introduced a cheap 30-minute rental, which most users chose instead of the old daily rental", or (2) "Last summer was unusually sunny"?`,
      steps: [
        md`Fact one: more rentals. Fact two: less income. Expectation: more rentals bring more income.`,
        md`Option (2) explains more rentals but makes falling income harder to understand: it is one-sided.`,
        md`Option (1) explains both: cheap short rentals attract more use, while most users now pay much less per rental.`,
      ],
      answerMd: md`Option (1) resolves the discrepancy. The sunny weather explains only the rise in rentals.`,
    },
  ],
  traps: [
    {
      title: 'Explaining only one side',
      md: md`An option that accounts for one fact feels like progress, especially if that fact is the more surprising one. Before choosing, say both facts aloud and check the option against each. If one of them is left as odd as before, keep looking.`,
    },
    {
      title: md`Drifting from the plan's goal`,
      md: md`A plan aimed at revenue is not judged on customer satisfaction, and a plan aimed at shorter queues is not judged on cost. Write the goal down in its exact words and reject options that bear on a different goal, however sensible they are.`,
    },
    {
      title: 'Ignoring the numbers in a plan',
      md: md`When a plan changes a price or a rate, the success threshold is often a simple calculation. A 20 percent cut needs more than a 25 percent rise in volume, not a 20 percent rise. An option that sounds supportive can still fall short of the threshold.`,
    },
  ],
  check: [
    {
      id: 'check-e-reader',
      title: 'More readers, fewer purchases',
      topic: 'Critical Reasoning',
      stimulusMd: md`Sales of the Kinto e-reader rose sharply last year. Yet the number of e-books bought through the Kinto online store, the main store for Kinto owners, fell over the same period.`,
      stemMd: md`Which of the following, if true, most helps to resolve the apparent discrepancy?`,
      options: [
        { id: 'A', text: md`Last year's new Kinto model was the first that could borrow e-books free from public libraries, and its advertising was aimed mainly at library users.`, note: '' },
        { id: 'B', text: md`Kinto cut the price of its e-reader by a third last year.`, note: md`This explains why more e-readers sold, but more owners should then buy more e-books, so the fall in store purchases is as puzzling as before.` },
        { id: 'C', text: md`Many people who bought a Kinto last year had never owned an e-reader before.`, note: md`New owners would be expected to stock up on books, so this deepens the discrepancy rather than resolving it.` },
        { id: 'D', text: md`Sales of printed books also fell last year.`, note: md`Printed books are a different product; their fall does not explain why more Kinto owners bought fewer e-books from the Kinto store.` },
        { id: 'E', text: md`The Kinto store offers more titles than any rival e-book store.`, note: md`A wide range would encourage owners to buy there, which makes the fall in purchases harder, not easier, to explain.` },
      ],
      answer: 'A',
      workingMd: md`The clash rests on an assumption that new owners buy books from the store. If the new model lets owners borrow library e-books free, and its buyers were mainly library users, many new owners would read without buying from the store, and some existing owners might switch to borrowing too. That explains both the rise in e-readers and the fall in store purchases. The price cut explains only the first fact.`,
      lesson: 'A discrepancy dissolves when you find the hidden assumption that made the two facts seem to clash.',
    },
    {
      id: 'check-bus-fares',
      title: 'A fare cut to raise revenue',
      topic: 'Critical Reasoning',
      stimulusMd: md`Harlow Transit plans to cut all bus fares by 20 percent. Its managers predict that the cut will attract enough new passengers to increase the company's total fare revenue.`,
      stemMd: md`Which of the following, if true, most strongly supports the managers' prediction?`,
      options: [
        { id: 'A', text: md`On most of Harlow Transit's routes, buses are already full at peak times.`, note: md`Full buses limit how many extra passengers can be carried, which undermines the prediction rather than supporting it.` },
        { id: 'B', text: md`When three cities with bus networks similar to Harlow's cut their fares by 20 percent, the number of paid bus journeys in each rose by more than half within a year.`, note: '' },
        { id: 'C', text: md`The city council has praised the plan as good for the environment.`, note: md`Environmental benefits are off the goal; the prediction is about fare revenue.` },
        { id: 'D', text: md`Harlow Transit's fuel costs are expected to fall next year.`, note: md`Lower costs would help profit, but the prediction concerns revenue, which fuel costs do not affect.` },
        { id: 'E', text: md`The number of passengers on Harlow's buses has fallen in each of the past three years.`, note: md`A falling trend shows a problem the plan might address, not that the fare cut will reverse it enough to raise revenue.` },
      ],
      answer: 'B',
      workingMd: md`A 20 percent cut multiplies revenue per journey by $0.8$, so paid journeys must rise by more than a quarter for revenue to rise. In comparable cities, journeys rose by more than half: $0.8 \times 1.5 = 1.2$, a 20 percent rise in revenue. That is direct evidence that the response clears the threshold. Full buses point the other way, and the council and fuel options are about other goals.`,
      lesson: 'Support for a price-cut plan must show demand rising by more than the break-even threshold.',
    },
    {
      id: 'check-car-spending',
      title: 'Dearer cars, lower spending',
      topic: 'Critical Reasoning',
      stimulusMd: md`Over the past decade, the average price of a new car in Dellmark, adjusted for inflation, has risen by 25 percent. Yet over the same decade, the average amount that a Dellmark household spends each year on buying cars, also adjusted for inflation, has fallen.`,
      stemMd: md`Which of the following, if true, most helps to explain how both statements can be true?`,
      options: [
        { id: 'A', text: md`Dellmark households now keep their cars for much longer before replacing them than they did ten years ago.`, note: '' },
        { id: 'B', text: md`The average price of a used car in Dellmark has risen even faster than that of a new car.`, note: md`If used cars also became dearer, households buying them would spend more, so this deepens the puzzle.` },
        { id: 'C', text: md`New cars sold in Dellmark today have more safety features than those sold ten years ago.`, note: md`This may explain why new cars cost more, but it leaves the fall in household spending unexplained.` },
        { id: 'D', text: md`The number of households in Dellmark has grown over the decade.`, note: md`The spending figure is an average per household, so a larger number of households does not explain why each one spends less.` },
        { id: 'E', text: md`Car manufacturers' profits in Dellmark have risen over the decade.`, note: md`Manufacturers' profits do not bear on how much each household spends buying cars.` },
      ],
      answer: 'A',
      workingMd: md`Yearly spending on cars is roughly the price per car times how often a household buys one. If households replace cars much less often, yearly spending can fall even though each car costs 25 percent more. For example, a car bought every 5 years at a price of 100 costs 20 a year; a car bought every 7 years at 125 costs about 17.9 a year. The safety-features option explains only the price rise.`,
      lesson: 'When an average price and average spending move apart, look at how often people buy.',
    },
  ],
  takeaways: [
    'For a plan, write the goal in exact words and find the step where the plan could break.',
    'A price cut raises revenue only if volume rises by more than the break-even threshold.',
    'A discrepancy is resolved by a fact that keeps both statements true, usually by removing a hidden assumption.',
    'Reject options that explain one fact only, or that deepen the clash.',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-critical-reasoning', skill: 'cr-evaluate-plan' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
