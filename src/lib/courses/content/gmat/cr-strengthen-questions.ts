import { md, type Lesson } from '../../types';

/** GMAT Critical Reasoning, lesson 3: strengthen questions. */
export const strengthenQuestions: Lesson = {
  slug: 'strengthen-questions',
  title: 'Strengthen questions: closing the gap',
  summary: 'Strengthen an argument by narrowing the gap between premises and conclusion: rule out other causes, show the sample fits, or confirm the mechanism.',
  minutes: 20,
  objectives: [
    'Recognise a strengthen question and what kind of option it rewards.',
    'Predict the shapes a strengthener can take for causal, sample and plan arguments.',
    'Choose the option that most supports the conclusion, rather than one that supports a premise or a side issue.',
  ],
  teachMd: md`
### What the question asks

A strengthen question asks which new fact, if true, would give the most support to the argument's conclusion. Typical stems:

- "Which of the following, if true, most strengthens the argument?"
- "Which of the following, if true, provides the most support for the conclusion?"
- "Which of the following, if true, most helps to justify the director's decision?"

Three words in these stems matter. **"If true"** means you accept the option as fact, however surprising; do not reject an option because you doubt it. **"Most"** means more than one option may help a little, and you want the one that helps the conclusion most. **"Strengthen"** does not mean "prove": the right answer only has to make the conclusion more likely than it was.

### Strengthening is about the gap

The conclusion is already supported by the premises, but not completely; there is a gap. A strengthener narrows it. So the method is the same as for an assumption question: find the conclusion, find the premises, state the gap. Then ask what new information would make the gap smaller.

The difference from an assumption question is the standard. An assumption must be **necessary**; a strengthener only has to **help**. That makes strengthen questions more forgiving, and it means a strengthener can be strongly worded ("in every one of the 20 cities studied...") without being wrong for that reason.

### Shapes of a strengthener

| Argument shape | What strengthens it |
| --- | --- |
| A caused B (from a correlation) | Rule out another cause; show B did not happen without A; show the timing fits; show a dose effect (more A, more B) |
| What holds for a sample holds for a group | Show the sample is typical of the group |
| What happened there will happen here | Show the two settings are alike in the ways that matter |
| A plan will achieve its goal | Show the plan addresses the cause of the problem; show an obstacle will not arise |
| A comparison between two groups | Show the groups were alike before the difference appeared |

The richest source of strengtheners is the **alternative explanation**. Whenever an argument concludes that one thing caused another, ask: "What else could explain this result?" An option that rules out that rival is usually the answer. A related strengthener shows that when the supposed cause was **absent**, the effect was absent too; this works like a control group in an experiment.

### Strengthening the conclusion, not a premise

A common wrong option makes a premise more certain ("The survey was carried out carefully, and its figures are accurate") without touching the link between premise and conclusion. Unless the premise itself is in doubt, confirming it adds nothing. The gap is between premise and conclusion; the right answer lives there.

Similarly, an option can support a **related** conclusion without supporting this one. If the argument concludes that a training course raised staff productivity, an option showing staff enjoyed the course is about enjoyment, not productivity. Hold every option up against the exact words of the conclusion.

### Wrong-answer patterns

1. **Wrong direction.** It weakens the argument. Under time pressure, readers who remember only that an option was "relevant" pick it anyway.
2. **Out of scope.** It is about a different group, place, time or outcome from the conclusion.
3. **Premise booster.** It makes a premise more credible when the premise was never in doubt.
4. **Irrelevant comparison.** It compares the subject with something the argument does not involve.
5. **Too weak.** It helps, but less than another option. When two options both help, choose the one that attacks the main gap, usually the one that rules out a rival explanation.

### Working the options

Sort each option into helps, hurts or neither. Most questions leave you with one "helps"; if two survive, compare them against the gap you stated. The one that would most change a sceptic's mind about the conclusion is the answer.
`,
  examples: [
    {
      id: 'example-rule-out-rival',
      title: 'Ruling out a rival explanation',
      problemMd: md`"After Calder Bank moved its call-centre staff to a quieter building, customer complaints about phone calls fell by a third. The bank concludes that the quieter environment improved the quality of its calls." Find a strengthener.`,
      steps: [
        md`Conclusion: the quieter building improved call quality. Premise: complaints fell by a third after the move. Gap: the move caused the fall.`,
        md`List rivals: fewer calls overall, a new complaints process, a change in staff, a seasonal pattern.`,
        md`A strengthener rules one out. For example: "The number of calls the centre handled was about the same before and after the move." Now the fall in complaints cannot be explained by fewer calls.`,
      ],
      answerMd: md`An option stating that call volume was unchanged strengthens the argument. "Staff said they preferred the new building" is the tempting wrong answer: it is about preference, not call quality.`,
    },
    {
      id: 'example-control-group',
      title: 'Showing the effect was absent without the cause',
      problemMd: md`"Fields on the Harrow estate treated with a new fertiliser yielded 18 percent more wheat this year than last year. The fertiliser therefore increases wheat yields." Which strengthens more: (1) "The new fertiliser is cheaper than the old one", or (2) "On the estate's untreated fields, wheat yields this year were about the same as last year"?`,
      steps: [
        md`Gap: the rise followed the fertiliser, but this year's weather might simply have been better for wheat.`,
        md`Option (1) is about cost. It might matter for a decision to buy the fertiliser, but it says nothing about whether the fertiliser raised yields.`,
        md`Option (2) gives a comparison group: fields that did not get the fertiliser, under the same weather, did not improve. That rules out the weather as the explanation.`,
      ],
      answerMd: md`Option (2) strengthens the argument; option (1) is out of scope. Untreated fields act as a control, which is one of the strongest ways to support a causal claim.`,
    },
    {
      id: 'example-representative-sample',
      title: 'Strengthening a survey-based conclusion',
      problemMd: md`"In a survey of 600 customers leaving its Northgate store, 72 percent of Bramley Foods shoppers said they would use a home-delivery service if one were offered. Bramley concludes that a home-delivery service would be popular with its customers across the region." Find a strengthener.`,
      steps: [
        md`Gap: from customers at one store to customers across the region.`,
        md`The author needs the Northgate shoppers to be typical. A strengthener shows they are: "Northgate's customers are similar in age, income and distance from the store to Bramley's customers at its other branches."`,
        md`Check the direction: this makes it more likely that the 72 percent figure applies elsewhere, so it helps.`,
      ],
      answerMd: md`An option showing that Northgate shoppers resemble Bramley's customers elsewhere strengthens the argument. "The survey was conducted on a weekday" is the kind of detail that, without more, neither helps nor hurts.`,
    },
  ],
  traps: [
    {
      title: 'Picking the weakener',
      md: md`Under time pressure, an option that clearly bears on the argument feels right even when it points the wrong way. Before choosing, say to yourself "this makes the conclusion more likely because..." and finish the sentence. If you cannot, check whether it actually hurts.`,
    },
    {
      title: 'Confirming a premise instead of the link',
      md: md`Options such as "the figures were checked by an independent auditor" make a premise more certain. The premises were already given as true; the doubt is about whether they lead to the conclusion. Prefer the option that connects premise to conclusion.`,
    },
    {
      title: 'Supporting a neighbouring conclusion',
      md: md`An argument about productivity is not strengthened by evidence about satisfaction; an argument about profit is not strengthened by evidence about sales. Read the conclusion word for word and test each option against those words, not against the general topic.`,
    },
  ],
  check: [
    {
      id: 'check-gym-classes',
      title: 'A comparison between two groups of branches',
      topic: 'Critical Reasoning',
      stimulusMd: md`A chain of gyms offered free nutrition classes at half of its branches. Over the following year, members at those branches renewed their memberships at a higher rate than members at the other branches. The chain concludes that the classes made members more likely to renew.`,
      stemMd: md`Which of the following, if true, most strengthens the chain's conclusion?`,
      options: [
        { id: 'A', text: md`Members who attended the classes said that they enjoyed them.`, note: md`Enjoying a class is not the same as renewing because of it, and the remark does nothing to rule out other differences between the two groups of branches.` },
        { id: 'B', text: md`In the year before the classes began, renewal rates at the two groups of branches were almost exactly the same.`, note: '' },
        { id: 'C', text: md`The branches that offered the classes are mostly in city centres, while most of the other branches are in suburbs.`, note: md`This points to a difference between the groups other than the classes, which could explain the higher renewals; it weakens rather than strengthens.` },
        { id: 'D', text: md`The chain plans to offer the classes at all of its branches next year.`, note: md`A future plan says nothing about whether the classes caused the higher renewal rate this year.` },
        { id: 'E', text: md`Renewal rates across the whole chain rose during the year.`, note: md`A chain-wide rise does not explain why one group of branches did better than the other, so it does not support the classes as the cause.` },
      ],
      answer: 'B',
      workingMd: md`The conclusion is causal and rests on a comparison of two groups of branches. The main rival explanation is that the branches chosen for the classes already had higher renewal rates. If the two groups renewed at the same rate before the classes started, that rival is ruled out and the classes become the best explanation of the gap that opened afterwards. The city-centre option introduces exactly the kind of difference the argument must avoid.`,
      lesson: 'When a conclusion rests on comparing two groups, showing the groups were alike before the change is a strong strengthener.',
    },
    {
      id: 'check-island-lizards',
      title: 'A biological explanation',
      topic: 'Critical Reasoning',
      stimulusMd: md`On the island of Pell, lizards of one species have longer back legs than lizards of the same species on the nearby mainland. Pell's lizards live mostly on open rock, where speed helps them escape predators, while the mainland lizards live mostly among dense shrubs. Biologists conclude that the longer legs are an adaptation to life on open ground.`,
      stemMd: md`Which of the following, if true, most strengthens the biologists' conclusion?`,
      options: [
        { id: 'A', text: md`Pell's lizards eat a different range of insects from the mainland lizards.`, note: md`A difference in diet is a second difference between the populations, which could offer another explanation of the leg length; it does not help the open-ground explanation.` },
        { id: 'B', text: md`On two other islands where the species lives mainly on open rock, its back legs are also longer than those of the mainland lizards.`, note: '' },
        { id: 'C', text: md`Pell has fewer kinds of predator than the mainland.`, note: md`If anything this weakens the argument, since less pressure from predators would make speed less valuable on Pell.` },
        { id: 'D', text: md`The first scientific study of Pell's lizards took place only twenty years ago.`, note: md`When the lizards were first studied has no bearing on why their legs are longer.` },
        { id: 'E', text: md`A few mainland lizards with unusually long back legs live among dense shrubs.`, note: md`A handful of exceptions says little either way, and long legs among shrubs, if anything, cuts slightly against the link with open ground.` },
      ],
      answer: 'B',
      workingMd: md`The argument links one difference in habitat to one difference in body shape, from a single comparison. A single pair of populations could differ for many reasons. If other open-rock populations of the same species also have longer legs, the link between open ground and leg length is repeated in independent cases, which makes coincidence or an island-specific cause much less likely. The diet option adds a rival difference, and the predator option undercuts the speed explanation.`,
      lesson: 'A pattern that repeats wherever the proposed cause is present makes a causal explanation much more likely.',
    },
    {
      id: 'check-work-from-home',
      title: 'A before-and-after productivity claim',
      topic: 'Critical Reasoning',
      stimulusMd: md`A software firm allowed its customer-support team to work from home two days a week for six months. During those six months the team resolved 12 percent more customer queries per week than in the previous six months. The firm concludes that working from home two days a week raised the team's productivity.`,
      stemMd: md`Which of the following, if true, most strengthens the firm's conclusion?`,
      options: [
        { id: 'A', text: md`Most members of the support team said they preferred working from home.`, note: md`Preference is not productivity; staff can prefer an arrangement that makes them no more productive.` },
        { id: 'B', text: md`Over the two periods, the team had the same number of members and received about the same number of queries each week.`, note: '' },
        { id: 'C', text: md`The firm's sales team, which continued to work in the office, also closed more sales during the same six months than in the previous six.`, note: md`This suggests a firm-wide upturn that could explain the support team's figures too, so it weakens the conclusion.` },
        { id: 'D', text: md`Several other software firms have adopted similar policies in the past year.`, note: md`What other firms decided says nothing about whether this team became more productive.` },
        { id: 'E', text: md`The queries the team resolved from home took, on average, slightly longer to resolve than those resolved in the office.`, note: md`Longer time per query points away from higher productivity at home, so this does not support the conclusion.` },
      ],
      answer: 'B',
      workingMd: md`Resolving 12 percent more queries could reflect more staff or more incoming queries rather than higher productivity. Ruling out both rivals (same team size, same number of queries arriving) leaves the working arrangement as the most likely explanation. The sales-team option suggests a general improvement unrelated to working from home, and the preference option changes the subject.`,
      lesson: 'Before crediting a change for a rise in output, check that the inputs, such as staff and workload, stayed the same.',
    },
  ],
  takeaways: [
    'A strengthener narrows the gap between premises and conclusion; it does not have to prove anything.',
    'For a causal conclusion, rule out the rival explanation or show the effect is missing when the cause is missing.',
    'Test every option against the exact words of the conclusion, not the topic.',
    'Confirming a premise rarely helps; the doubt lies in the link.',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-critical-reasoning', skill: 'cr-strengthen-argument' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
