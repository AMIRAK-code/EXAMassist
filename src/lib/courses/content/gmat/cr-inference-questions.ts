import { md, type Lesson } from '../../types';

/** GMAT Critical Reasoning, lesson 8: inference questions. */
export const inferenceQuestions: Lesson = {
  slug: 'inference-questions',
  title: 'Inference questions: what must be true',
  summary: 'Draw only what the statements guarantee: combine facts, respect quantifiers and percentages, and reject answers that go one step too far.',
  minutes: 20,
  objectives: [
    'Recognise an inference question and the standard of proof it sets.',
    'Combine two or more statements into a conclusion they guarantee together.',
    'Handle quantifiers (all, some, most, none) and percentages without overreaching.',
    'Reject converses, unsupported reasons and predictions.',
  ],
  teachMd: md`
### A different job

In most Critical Reasoning questions the passage contains an argument with a gap, and you work on the gap. Inference questions turn this round. The passage is usually a set of facts with no conclusion, and you must choose the conclusion they support. Typical stems:

- "If the statements above are true, which of the following must also be true?"
- "The statements above, if true, most strongly support which of the following?"
- "Which of the following can be properly inferred from the information above?"

Treat every statement in the passage as true, and nothing else. Your own knowledge, however reasonable, is not evidence here.

### The standard of proof

"Must be true" is strict: the right answer cannot be false if the statements are true. "Most strongly supported" is a little looser: the right answer is the one the statements make most likely, but in practice it is almost always something that follows with near certainty. In both cases the test for each option is the same: **can I imagine the statements all being true while this option is false?** If you can, reject the option.

This is the reverse of everyday reading. In conversation, "most of the club's members voted" suggests that some did not, and "the drug reduced symptoms" suggests it worked well. In an inference question, "most" means only "more than half", and could even be all; "reduced" means only "made smaller".

### Combining statements

The best answers usually join two statements. If every member who entered the tournament won a game, and no one who won a game had played in a tournament before, then every member who entered was new to tournaments. Neither statement alone says this. When the passage has several facts, look for a shared term that lets you chain them:

$$\text{A} \rightarrow \text{B}, \quad \text{B} \rightarrow \text{C} \quad \text{so} \quad \text{A} \rightarrow \text{C}$$

### Quantifiers

| Statement | What follows | What does not follow |
| --- | --- | --- |
| All A are B | Any particular A is B | All B are A (the converse) |
| No A are B | No B are A | Anything about things that are not A |
| Some A are B | Some B are A | Some A are not B |
| Most A are B | At least one A is B | Most B are A |

The converse ("all B are A") is the single most common wrong answer in inference questions. "Every household with solar panels received the grant" does not mean every household that received the grant has solar panels.

### Numbers, rates and shares

Numerical inference questions reward working from the definition. A share is a part divided by a whole, so a share and a number can move differently when the whole changes. If the part-time share of a workforce rises while the workforce shrinks, the number of part-time workers might rise or fall; but the full-time share has fallen and the whole has fallen, so the number of full-time workers must have fallen. When in doubt, try two sets of numbers that fit the statements: if the option is true in one and false in the other, it is not a "must be true".

### Wrong-answer patterns

1. **Goes one step too far.** It adds a reason, a prediction or a recommendation. "Higher-income households cannot afford panels" gives a reason the passage never offers.
2. **Converse.** It reverses an "all" statement.
3. **Strengthened quantifier.** It turns "some" into "most", or "most" into "all".
4. **Possible but not required.** It could be true, and might even be likely, but the statements allow it to be false.
5. **Contradicts the passage.** Surprisingly common, and easy to fall for if you read the passage quickly.

### Modest answers win

Because the right answer must survive every situation consistent with the statements, it tends to be cautious: "at least some", "not all", "was lower than". Strong, sweeping options are not automatically wrong, but they need strong support in the passage, and usually it is not there.

### A routine

1. Read every statement, noting quantifiers and measures (number, share, average).
2. Look for a shared term that lets you combine two statements.
3. For each option, try to build a situation where the statements hold and the option fails.
4. Choose the option for which you cannot build one.
`,
  examples: [
    {
      id: 'example-chain-statements',
      title: 'Chaining two statements',
      problemMd: md`"Every apprentice at Kerrow Joinery has passed the safety course. Nobody who has passed the safety course is allowed to skip the monthly refresher session." What must be true?`,
      steps: [
        md`Find the shared term: "passed the safety course" appears in both statements.`,
        md`Chain them: apprentice, so passed the course; passed the course, so may not skip the refresher.`,
        md`Conclusion: no apprentice at Kerrow Joinery is allowed to skip the monthly refresher session.`,
        md`Test a tempting converse: "everyone who has passed the safety course is an apprentice". Nothing rules out qualified staff who also passed, so it need not be true.`,
      ],
      answerMd: md`No apprentice may skip the monthly refresher. The converse, that everyone who passed the course is an apprentice, does not follow.`,
    },
    {
      id: 'example-two-number-sets',
      title: 'Testing with two sets of numbers',
      problemMd: md`"Between 2024 and 2025, the share of a city's commuters who cycle to work rose from 8 to 10 percent, and the total number of commuters rose." Must the number of commuters who drive have fallen?`,
      steps: [
        md`The statements say nothing about driving directly, so try numbers. Case 1: 100,000 commuters with 60 percent driving, then 110,000 with 55 percent driving: drivers go from 60,000 to 60,500, a rise.`,
        md`Case 2: 100,000 commuters with 60 percent driving, then 101,000 with 50 percent driving: drivers fall to 50,500.`,
        md`Both cases fit the statements (the cycling share rose and the total rose), yet the number of drivers rose in one and fell in the other.`,
        md`What must be true? The number of cyclists rose: 10 percent of a larger total is more than 8 percent of a smaller one.`,
      ],
      answerMd: md`No, the number of drivers need not have fallen. What must be true is that more commuters cycled in 2025 than in 2024.`,
    },
  ],
  traps: [
    {
      title: 'Choosing the converse',
      md: md`"All A are B" is often followed by an option saying "all B are A". It sounds like a restatement but says something different. Before choosing any option built on an "all" statement, check which way round it runs.`,
    },
    {
      title: 'Adding a reason or a prediction',
      md: md`Options that explain why something happens, or say what will happen next, go beyond facts that only describe what is. Unless the passage gives the reason or the trend, reject the option.`,
    },
    {
      title: 'Reading everyday meanings into quantifiers',
      md: md`In inference questions "some" means at least one, and "most" means more than half. "Some members voted" does not imply that some did not. Read quantifiers at their minimum.`,
    },
  ],
  check: [
    {
      id: 'check-chess-club',
      title: 'Combining two general statements',
      topic: 'Critical Reasoning',
      stimulusMd: md`Every member of the Tolland chess club who entered this year's regional tournament won at least one game there. No member of the club who won a game at this year's regional tournament had ever played in a tournament before. Marta, a member of the club, entered this year's regional tournament.`,
      stemMd: md`If the statements above are true, which of the following must also be true?`,
      options: [
        { id: 'A', text: md`Marta won more games at the tournament than any other member of the club.`, note: md`The statements say Marta won at least one game; nothing compares her results with other members'.` },
        { id: 'B', text: md`Before this year's regional tournament, Marta had never played in a tournament.`, note: '' },
        { id: 'C', text: md`Every member of the club who had never played in a tournament before entered this year's regional tournament.`, note: md`This reverses the second statement's direction; members new to tournaments may simply have stayed at home.` },
        { id: 'D', text: md`Some members of the club who entered the tournament lost every game they played.`, note: md`This contradicts the first statement, which says every member who entered won at least one game.` },
        { id: 'E', text: md`Marta will enter next year's regional tournament.`, note: md`A prediction about next year; nothing in the statements bears on it.` },
      ],
      answer: 'B',
      workingMd: md`Chain the statements. Marta is a member who entered, so by the first statement she won at least one game. By the second, no member who won a game had played in a tournament before. So Marta had never played in a tournament before this one. Every other option either goes beyond the statements, reverses one of them, or contradicts the first.`,
      lesson: 'Look for the term two statements share, and chain them through it.',
    },
    {
      id: 'check-solar-grant',
      title: 'A grant and its condition',
      topic: 'Critical Reasoning',
      stimulusMd: md`In the town of Ashby, every household that has fitted solar panels has received the council's energy-saving grant. The grant is given only to households whose annual income is below a limit set by the council. Last year about 300 Ashby households fitted solar panels.`,
      stemMd: md`Which of the following is most strongly supported by the statements above?`,
      options: [
        { id: 'A', text: md`Every Ashby household that has received the grant has fitted solar panels.`, note: md`The converse of the first statement: households may have used the grant for other energy-saving work.` },
        { id: 'B', text: md`Most households in Ashby have an annual income below the council's limit.`, note: md`About 300 qualifying households tells us nothing about the share of all Ashby households below the limit.` },
        { id: 'C', text: md`Some Ashby households that qualified for the grant have fitted solar panels.`, note: '' },
        { id: 'D', text: md`Households in Ashby with incomes above the limit cannot afford solar panels.`, note: md`The statements imply such households have not fitted panels, but give no reason; affordability is an added explanation.` },
        { id: 'E', text: md`The grant was used mainly to pay for solar panels.`, note: md`Nothing says how grant money was spent overall; other recipients may have used it for insulation or boilers.` },
      ],
      answer: 'C',
      workingMd: md`About 300 households fitted panels last year. Each of them received the grant, and the grant goes only to households below the income limit, so each of them qualified. Therefore at least some qualifying households have fitted panels. The converse, the reason about affordability, and the claim about how the money was used all go beyond the statements.`,
      lesson: 'A modest "some" conclusion that follows from chaining the facts beats a sweeping or explanatory one.',
    },
    {
      id: 'check-part-time-share',
      title: 'Shares, totals and numbers',
      topic: 'Critical Reasoning',
      stimulusMd: md`At Feld Logistics, the share of employees who work part-time rose from 10 percent in 2024 to 15 percent in 2025. Over the same period, the total number of people employed by Feld Logistics fell. Every employee works either part-time or full-time.`,
      stemMd: md`If the statements above are true, which of the following must also be true?`,
      options: [
        { id: 'A', text: md`Feld Logistics employed more part-time workers in 2025 than in 2024.`, note: md`Not required: 15 percent of a much smaller total can be fewer people than 10 percent of the old total, for example 15 of 100 against 20 of 200.` },
        { id: 'B', text: md`Feld Logistics employed fewer full-time workers in 2025 than in 2024.`, note: '' },
        { id: 'C', text: md`Some of Feld's full-time employees switched to part-time work.`, note: md`Possible, but the change in shares could come entirely from full-time staff leaving, so it need not be true.` },
        { id: 'D', text: md`Feld Logistics spent less on wages in 2025 than in 2024.`, note: md`The statements give no information about pay, so the wage bill could have risen or fallen.` },
        { id: 'E', text: md`The total number of people employed by Feld Logistics fell by more than 5 percent.`, note: md`The size of the fall is not given; a total falling from 1,000 to 980 (with 147 part-time workers) fits every statement.` },
      ],
      answer: 'B',
      workingMd: md`The full-time share fell from 90 to 85 percent, and the total fell. Call the totals $T_1$ and $T_2$ with $T_2 < T_1$. Then full-time staff went from $0.90T_1$ to $0.85T_2$, and $0.85T_2 < 0.90T_1$ because both the share and the total are smaller. So there must be fewer full-time workers. The number of part-time workers can go either way: from 20 of 200 to 15 of 100 it falls, from 100 of 1,000 to 135 of 900 it rises.`,
      lesson: 'If a share and its whole both fall, the number they describe must fall; if they move in opposite directions, test with numbers.',
    },
  ],
  takeaways: [
    'Treat the statements as true and nothing else; the answer must survive every situation they allow.',
    'The best answers usually chain two statements through a shared term.',
    'Beware the converse, the added reason and the strengthened quantifier.',
    'For shares and totals, test with two sets of numbers before accepting a "must be true".',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-critical-reasoning', skill: 'cr-construct-argument' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
