import { md, type Lesson } from '../../types';

/** Bocconi master's, verbal reasoning: naming a flaw and finding the question that would settle an argument. */
export const flawsAndEvaluationLesson: Lesson = {
  slug: 'flaws-and-evaluation',
  title: 'Flaws and evaluation: naming what is wrong and what would settle it',
  metaTitle: 'Flaws and evaluation: what is wrong and what would settle it',
  summary: 'Recognise the common reasoning flaws, describe them in the abstract wording options use, and find the fact that would best test an argument.',
  minutes: 22,
  objectives: [
    'Recognise the common flaws in short arguments and match each to its abstract description.',
    'Tell a confused necessary condition from a sufficient one, and a share from a rate.',
    'Use the two-answer test to pick the question whose answer would most help evaluate an argument.',
  ],
  teachMd: md`
### Why flaws matter even when the question does not say "flaw"

Bocconi's description of verbal critical reasoning gives, as an example, a question asking which condition would best support the thesis. Whatever form a question takes, the quickest route is the same: see what is wrong with the reasoning. A flaw is the gap between premises and conclusion described as a mistake. Once you can name it, you can spot the assumption that would cover it, the fact that would weaken the argument by exploiting it, and the information that would settle it.

### The flaws that come up again and again

| Flaw | What the argument does | Abstract wording you may see |
| --- | --- | --- |
| Correlation as cause | Treats two things that happen together, or one after another, as cause and effect | "overlooks the possibility that some other factor accounts for both" |
| Unrepresentative sample | Draws a conclusion about a group from a part that may not be typical | "relies on a sample that may not be representative" |
| Necessary as sufficient | Treats a condition that must be met as one that guarantees the result | "takes a requirement for an outcome to be enough to bring it about" |
| Sufficient as necessary | Treats one way of reaching a result as the only way | "assumes that because one condition produces a result, the result cannot occur without it" |
| Share as rate | Uses a percentage of cases without asking how large each group is | "ignores the relative sizes of the groups being compared" |
| Shifting term | Uses a word in two senses, or slides from one measure to another | "uses a key term in two different senses" |
| Part and whole | Assumes what holds for each part holds for the whole, or the reverse | "assumes that a property of each member is a property of the group" |
| False choice | Presents two options as the only ones | "overlooks alternatives other than the two considered" |
| Attacking the source | Rejects a claim because of who makes it | "responds to the person rather than to the argument" |

### Conditions: necessary and sufficient

"Only students with an average above 27 are eligible" sets a **necessary** condition: no student without it qualifies. It does not say every student with it does. Reading it as "above 27, so eligible" is the flaw of treating a necessary condition as sufficient. The reverse slip: "Anyone who scores 100 on the final passes the course; Ada did not score 100, so she failed." Scoring 100 is **sufficient** for passing, but there may be other ways to pass.

A quick check: rewrite the rule as "if A then B". From A you may infer B; from not B you may infer not A. From B you may not infer A, and from not A you may not infer B.

### Shares and rates

"Sixty per cent of burglaries happened in homes without an alarm" is a **share** of burglaries. Whether unalarmed homes are more at risk depends on the **rate**: burglaries per home in each group. If 80% of homes have no alarm, unalarmed homes, with 60% of the burglaries, are actually burgled less often per home than alarmed ones. Whenever an argument compares groups using percentages of an outcome, ask how big each group is.

### Matching a flaw to an option

Flaw options are written in general terms, so translate the specific argument into its pattern before reading them. Then check every word of the option you like: it must describe what this argument actually does. Many wrong options name a real flaw that this argument does not commit, or describe a step the argument never takes. An option can also describe the argument accurately without naming anything wrong with it.

### Evaluation: what would we need to know?

Some questions ask which information would be most useful in evaluating an argument. The answer is a question whose answer bears on the gap. Use the **two-answer test**: answer the question both ways, yes and no, or high and low.

- If one answer strengthens the argument and the other weakens it, the question is useful.
- If either answer leaves the argument where it was, the question is not.

Evaluation is therefore strengthen and weaken folded together. The best question is usually the one that tests the most obvious rival explanation, or the representativeness of the sample, or whether the plan's key step works.

### A method for both

1. Find the conclusion and the evidence, and name the gap.
2. Fit the gap to a pattern from the table.
3. For a flaw, find the option that describes that pattern in this argument's terms. For evaluation, find the option whose two answers pull the conclusion in opposite directions.
4. Check that the chosen option is about this argument's actual conclusion, not a nearby claim.
`,
  examples: [
    {
      id: 'example-share-rate',
      title: 'A share mistaken for a rate',
      problemMd: md`"Five years ago, riders aged over 60 were involved in 4% of the city's cycling accidents. Last year the figure was 7%. Cycling in the city has therefore become more dangerous for riders over 60." What is the flaw?`,
      steps: [
        md`Conclusion: cycling is more dangerous for over-60s, which is a claim about the risk to each older rider. Evidence: their share of all cycling accidents rose.`,
        md`A share can rise for reasons that have nothing to do with risk. If many more over-60s now cycle, they will be in a larger share of accidents even at the same risk per rider.`,
        md`The share can also rise if accidents among younger riders fall while those among older riders stay the same.`,
        md`So the argument moves from a share of accidents to a rate of accidents per rider, without information on how many older people cycle or how the total changed.`,
      ],
      answerMd: md`The flaw is treating a change in share as a change in risk: the argument ignores how many over-60s cycle and how the total number of accidents changed. The tempting wrong description is "it relies on too small a sample"; the figures cover all the city's accidents.`,
    },
    {
      id: 'example-necessary-sufficient',
      title: 'A requirement taken as a guarantee',
      problemMd: md`"To be considered for the faculty scholarship, a student must have a grade average above 27 out of 30. Luca's average is 28.5, so he will receive the scholarship." What is the flaw?`,
      steps: [
        md`Rewrite the rule: "if a student is considered, then their average is above 27". The average is a necessary condition for being considered.`,
        md`The argument runs: Luca's average is above 27, so he will be considered and indeed receive the scholarship. That infers the "if" part from the "then" part.`,
        md`Two steps are missing: meeting the threshold does not guarantee being considered, and being considered does not guarantee receiving the award.`,
      ],
      answerMd: md`The argument treats a necessary condition (an average above 27) as a sufficient one. The tempting wrong description is "it assumes Luca's average was calculated correctly"; the passage is taken as true, and the error is in the inference.`,
    },
    {
      id: 'example-two-answer',
      title: 'The two-answer test',
      problemMd: md`"A bakery began posting its daily menu on social media at the start of May. Its weekday sales in May were 15% higher than in April. The owner concludes that the posts caused the rise." Which is more useful to know: (i) whether the bakery's weekday sales also rose from April to May in previous years; (ii) how many followers the bakery's social media account has?`,
      steps: [
        md`Gap: a rise after the posts began is taken as caused by the posts. The main rival is a seasonal pattern.`,
        md`Test (i), answer yes: sales usually rise by a similar amount in May, so the season explains the rise, and the conclusion weakens. Answer no: sales were flat in earlier Mays, so the season is ruled out, and the conclusion strengthens. The two answers pull in opposite directions.`,
        md`Test (ii), answer "many": the posts could reach people, but that does not show they changed buying. Answer "few": a handful of followers might still include regulars who now visit more. Neither answer clearly moves the conclusion.`,
      ],
      answerMd: md`Question (i) is more useful: its two answers move the conclusion in opposite directions. Question (ii) is the tempting wrong choice because it is about the posts, but neither answer settles whether they caused the rise.`,
    },
  ],
  traps: [
    {
      title: 'A real flaw, but not this argument\'s',
      md: md`Flaw options often name genuine reasoning errors, such as a small sample or an attack on the source, that the argument in front of you does not commit. Before you choose, point to the sentence where the argument makes that exact mistake. If you cannot, reject the option.`,
    },
    {
      title: 'An accurate description that is not a flaw',
      md: md`"The argument draws on a comparison between two towns" may describe the passage correctly while naming nothing wrong. A flaw option must say what the argument fails to consider or wrongly takes for granted.`,
    },
    {
      title: 'Reversing a condition',
      md: md`"Only X can do Y" and "every X does Y" are easy to blur. Rewrite the rule as "if A then B" and allow yourself only the two valid moves: from A to B, and from not B to not A.`,
    },
    {
      title: 'Evaluation questions with one-sided answers',
      md: md`A question can be on topic and still useless if only one of its answers would matter. Answer every evaluation option both ways. If neither answer would change your view of the conclusion, it is not the information you need.`,
    },
  ],
  check: [
    {
      id: 'check-award-flaw',
      title: 'The food award',
      topic: 'Verbal critical reasoning',
      stemMd: md`Every one of the five restaurants that won the city's food award last year uses mainly locally sourced ingredients. Therefore any restaurant in the city that switches to mainly local ingredients will win the award.

The reasoning in the argument is flawed because it`,
      options: [
        { id: 'A', text: md`concludes that local ingredients make food taste better, which the evidence does not show.`, note: md`Misdescribes the conclusion: the argument concludes that switching will win the award, and says nothing about taste.` },
        { id: 'B', text: md`takes a feature shared by all the winners to be enough to guarantee winning.`, note: '' },
        { id: 'C', text: md`rejects the judges' decisions because of who the judges are.`, note: md`The argument does not reject or criticise the judges at all; it relies on their past decisions.` },
        { id: 'D', text: md`confuses the number of winning restaurants with the share of restaurants that win.`, note: md`The argument makes no use of shares or proportions of restaurants; the number five is only the list of winners.` },
      ],
      answer: 'B',
      workingMd: md`The premise says all winners have a feature (local ingredients). At most, that suggests the feature may be needed to win. The conclusion says having it guarantees a win. Many restaurants may use local ingredients and not win, because the award surely depends on other things too. The flaw is treating a shared feature, at best a necessary condition, as a sufficient one. The other descriptions name things the argument does not do.`,
      lesson: 'If all winners share a feature, that feature may be needed, but it does not follow that having it is enough to win.',
    },
    {
      id: 'check-ski-evaluate',
      title: 'Wristbands and queues',
      topic: 'Verbal critical reasoning',
      stemMd: md`Last winter, a ski resort replaced its paper lift passes with wristbands that skiers scan at the gate. Average queue times at the main lift fell by four minutes compared with the winter before. The resort's manager concludes that the wristbands shortened the queues.

Which of the following would be most useful to know in evaluating the manager's conclusion?`,
      options: [
        { id: 'A', text: md`Whether skiers prefer wristbands to paper passes.`, note: md`Preferences do not bear on what shortened the queues; either answer leaves the conclusion where it was.` },
        { id: 'B', text: md`How much the wristbands cost compared with the paper passes.`, note: md`Cost is irrelevant to whether the wristbands caused the shorter queues; neither answer moves the conclusion.` },
        { id: 'C', text: md`Whether the number of skiers using the main lift last winter was similar to the number the winter before.`, note: '' },
        { id: 'D', text: md`Whether other resorts in the region plan to introduce wristbands.`, note: md`Other resorts' plans say nothing about the cause of shorter queues here; neither answer helps.` },
      ],
      answer: 'C',
      workingMd: md`The conclusion is causal, drawn from a fall in queue times after the change. The obvious rival is that fewer skiers used the lift. Apply the two-answer test to the question about skier numbers. If numbers fell sharply, the shorter queues may simply reflect fewer skiers, and the conclusion weakens. If numbers were similar, that rival is ruled out, and the conclusion strengthens. The other questions concern preference, cost and other resorts, and neither answer to any of them changes the case.`,
      lesson: 'The most useful question tests the most obvious rival explanation: one answer helps the argument and the other hurts it.',
    },
    {
      id: 'check-alarm-flaw',
      title: 'Burglaries and alarms',
      topic: 'Verbal critical reasoning',
      stemMd: md`Of the burglaries reported in Valdora last year, 60% took place in homes without a burglar alarm. So in Valdora, a home without an alarm is more likely to be burgled than a home with one.

Which of the following most accurately describes a flaw in the argument?`,
      options: [
        { id: 'A', text: md`It assumes that alarms prevent every burglary.`, note: md`The argument does not assume this; its own premise says 40% of burglaries happened in homes with alarms.` },
        { id: 'B', text: md`It concludes that burglar alarms attract burglars.`, note: md`The argument concludes the opposite, that homes without alarms are more at risk; it says nothing about alarms attracting burglars.` },
        { id: 'C', text: md`It draws a conclusion about Valdora from figures collected in a different town.`, note: md`The figures are Valdora's own burglaries, so there is no shift from one town to another.` },
        { id: 'D', text: md`It does not consider what proportion of Valdora's homes have no alarm.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`The premise is a share of burglaries; the conclusion is about the risk per home. Whether unalarmed homes are at greater risk depends on how many homes are in each group. Suppose 80% of homes have no alarm: they suffer 60% of burglaries, so per home their rate is proportional to $\frac{60}{80} = 0.75$, while alarmed homes, 20% of homes with 40% of burglaries, have a rate proportional to $\frac{40}{20} = 2$. The conclusion would then be false. The flaw is ignoring the proportion of homes without an alarm.`,
      lesson: 'A share of cases says nothing about risk until you know how large each group is.',
    },
  ],
  takeaways: [
    'A flaw is the gap between premises and conclusion, described as a mistake.',
    'Translate the argument into its pattern, then check every word of the flaw option against it.',
    'Necessary is not sufficient: "only those with A" does not mean "all with A".',
    'A share of cases is not a rate; ask how large each group is.',
    'For evaluation, answer each question both ways; the useful one pulls the conclusion in opposite directions.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-verbal-reasoning', skill: 'grad-verbal-argument-analysis' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
