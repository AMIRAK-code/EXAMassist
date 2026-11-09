import { md, type Lesson } from '../../types';

/** GMAT Critical Reasoning, lesson 4: weaken questions. */
export const weakenQuestions: Lesson = {
  slug: 'weaken-questions',
  title: 'Weaken questions: widening the gap',
  summary: 'Weaken an argument by attacking the link, not the facts: rival causes, reversed causation, unrepresentative samples and plans that backfire.',
  minutes: 20,
  objectives: [
    'Recognise a weaken question and what a correct weakener has to do.',
    'Attack causal, sample-based and plan-based arguments at their gap.',
    'Reject options that are out of scope, too weak to matter, or that strengthen.',
  ],
  teachMd: md`
### What the question asks

A weaken question asks which new fact, if true, would most seriously undermine the argument. Typical stems:

- "Which of the following, if true, most seriously weakens the argument?"
- "Which of the following, if true, casts the most doubt on the conclusion?"
- "Which of the following, if true, would most undermine the director's prediction?"

As with strengthening, "if true" means you accept the option as fact, and "weaken" does not mean "disprove". The right answer makes the conclusion less likely to follow from the premises. It usually does that **without denying a premise**: the premises are given as true, and the attack lands on the link between them and the conclusion.

### Attack the gap

Find the conclusion, find the premises, state the gap. A weakener widens that gap, by showing the premises are compatible with the conclusion being false. Each common gap has its standard attacks.

| Argument shape | How to weaken it |
| --- | --- |
| A caused B (from a correlation) | Show another factor caused B; show B caused A instead; show B also occurred without A |
| Sample to population | Show the sample differs from the population in a way that matters |
| Here to there, then to now | Show the settings differ in a way that matters |
| A plan will achieve its goal | Show an obstacle, a side effect that cancels the gain, or that the plan misses the real cause |
| Percent or rate to number, or the reverse | Show the other quantity moved differently |

### Causal arguments: three attacks

Most weaken questions involve a causal claim. Learn the three attacks so that you look for them automatically.

1. **Another cause.** Something else, present at the same time, explains the result. ("The town's crime rate fell after it installed cameras; but in the same year the town's largest nightclub closed.")
2. **Reversed causation.** The supposed effect is really the cause. ("People who own dogs are more active; but active people are more likely to choose to get a dog.")
3. **Cause without effect, or effect without cause.** The supposed cause was present elsewhere with no result, or the result appeared where the cause was absent. This breaks the pattern the argument relies on.

### Plans and predictions

When the conclusion is that a plan will work, look for a reason it will not: people will respond in a way the planners did not expect, a cost will cancel the gain, or the plan does not touch the actual cause of the problem. A price rise meant to raise revenue is weakened by evidence that many customers will stop buying; a campaign meant to cut accidents is weakened by evidence that accidents mostly have causes the campaign does not address.

### What a weakener does not need to do

It does not need to show the conclusion is false. It only needs to make the conclusion less well supported. "Some" and "a few" options can still weaken, but they tend to be weaker than an option that offers a rival explanation for the whole effect. When comparing two candidate weakeners, ask how much doubt each one casts. An option that explains the **entire** result another way beats one that nibbles at a corner.

### Wrong-answer patterns

1. **Strengthens.** The option supports the conclusion; it appears among weakeners because readers recall only that it was relevant.
2. **Out of scope.** It concerns a different group, time or outcome from the conclusion.
3. **Too weak.** "Some patients still had problems" does not weaken a claim about averages or tendencies.
4. **Symmetrical.** It applies equally to both groups being compared, so it cannot explain a difference between them.
5. **Denies nothing that matters.** It attacks a detail the argument does not depend on.

The symmetrical option deserves extra care. If an argument compares group X with group Y, a fact true of both groups (both are old, both were surveyed online) cannot explain why they differ. Only a difference between the groups can weaken a conclusion drawn from a difference between them.
`,
  examples: [
    {
      id: 'example-another-cause',
      title: 'Another cause for a fall in crime',
      problemMd: md`"In the year after Lanford installed security cameras in its town centre, reported street robberies there fell by 35 percent. The cameras, the council concludes, deterred robbers." Find a weakener.`,
      steps: [
        md`Conclusion: the cameras deterred robbers. Premise: robberies fell 35 percent after the cameras went in. Gap: the cameras caused the fall.`,
        md`Look for another cause present at the same time: more police, a change in reporting, an event that drew people away.`,
        md`A weakener: "In the same year, Lanford doubled the number of police officers on foot patrol in the town centre."`,
        md`Check the direction: the extra patrols could explain the fall without the cameras, so the conclusion is less well supported.`,
      ],
      answerMd: md`The doubled patrols weaken the argument by offering another cause. "Robberies in nearby towns without cameras also fell by 35 percent" would weaken it too, by showing the effect without the cause.`,
    },
    {
      id: 'example-reverse-causation',
      title: 'Reversed causation',
      problemMd: md`"Employees at Corvin Ltd who use the company's standing desks take fewer sick days than employees who do not. So standing desks improve health." Find the reversed-causation weakener.`,
      steps: [
        md`The argument says standing desks lead to better health.`,
        md`Reverse it: does better health lead to using standing desks? Employees with back problems or other illnesses may find standing uncomfortable and avoid the desks.`,
        md`A weakener: "Employees with long-term health conditions are much less likely than others to choose a standing desk."`,
      ],
      answerMd: md`That option weakens the argument: healthier people choosing the desks would produce the same pattern even if the desks did nothing. "Standing desks cost more than ordinary desks" is out of scope.`,
    },
    {
      id: 'example-symmetrical-option',
      title: 'Why a symmetrical fact does not weaken',
      problemMd: md`"Students who took an online revision course scored higher on a final exam than students who did not. So the course raised scores." Does "All the students in both groups were in their final year" weaken the argument?`,
      steps: [
        md`The argument draws its conclusion from a difference between two groups.`,
        md`The option describes something true of both groups equally.`,
        md`A fact shared by both groups cannot explain why one group scored higher than the other.`,
      ],
      answerMd: md`No. The option is symmetrical, so it neither explains the difference nor weakens the conclusion. A weakener would need a difference, such as "students who took the course had higher marks before it began".`,
    },
  ],
  traps: [
    {
      title: 'Attacking a premise',
      md: md`Premises are given as true. An option that seems to contradict a premise is either misread or beside the point. Aim at the link: what else could make the premises true while the conclusion is false?`,
    },
    {
      title: 'Choosing a symmetrical fact',
      md: md`When an argument compares two groups, only a factor that differs between them can explain the gap. Options describing both groups ("all participants were volunteers") look relevant but change nothing.`,
    },
    {
      title: 'Settling for a nibble',
      md: md`"A few customers complained" barely touches a conclusion about most customers. If one option offers a rival explanation for the whole result and another nibbles at the edge, the full explanation is the stronger weakener.`,
    },
    {
      title: 'Picking a strengthener by accident',
      md: md`Relevant options can point either way. Finish the sentence "this makes the conclusion less likely because..." before you choose. If the sentence will not finish, the option may support the argument instead.`,
    },
  ],
  check: [
    {
      id: 'check-walking-sleep',
      title: 'A health correlation',
      topic: 'Critical Reasoning',
      stimulusMd: md`Patients at Linfield Clinic who take a daily walk of at least 30 minutes report fewer sleep problems than patients who do not. A doctor at the clinic concludes that daily walking improves sleep.`,
      stemMd: md`Which of the following, if true, most seriously weakens the doctor's conclusion?`,
      options: [
        { id: 'A', text: md`Patients who sleep badly are often too tired during the day to go for a walk.`, note: '' },
        { id: 'B', text: md`Some patients who walk every day still report occasional sleep problems.`, note: md`Too weak: the conclusion is about a tendency, and a few walkers with occasional problems are consistent with walking improving sleep on average.` },
        { id: 'C', text: md`The clinic has not studied the effects of walks longer than one hour.`, note: md`Longer walks are outside the argument, which concerns daily walks of at least 30 minutes compared with no walk.` },
        { id: 'D', text: md`The clinic's patients are, on average, older than the population of the region.`, note: md`Age applies to walkers and non-walkers at the clinic alike, so it cannot explain why the walkers sleep better.` },
        { id: 'E', text: md`Sleep problems are among the complaints most often brought to the clinic.`, note: md`How common the complaint is has no bearing on whether walking is what reduces it.` },
      ],
      answer: 'A',
      workingMd: md`The argument moves from a correlation (walkers report fewer sleep problems) to a cause (walking improves sleep). If poor sleep makes people too tired to walk, the causation could run the other way: the good sleepers are the ones who manage to walk. That explains the whole pattern without walking improving anything. The age option is symmetrical, and the "some patients" option is too weak to matter.`,
      lesson: 'When two things go together, always ask whether the supposed effect is really the cause.',
    },
    {
      id: 'check-bakery-price',
      title: 'A plan to raise profit',
      topic: 'Critical Reasoning',
      stimulusMd: md`Stannard Bakery sells about 2,000 loaves of bread a week. Its owner plans to raise the price of every loaf by 10 percent. Since the bakery's costs will not change, the owner predicts that weekly profit from bread will rise.`,
      stemMd: md`Which of the following, if true, most seriously weakens the owner's prediction?`,
      options: [
        { id: 'A', text: md`A survey found that about a third of Stannard's regular bread customers would buy their bread elsewhere if its price rose by 10 percent.`, note: '' },
        { id: 'B', text: md`Stannard's flour supplier has agreed to keep its prices unchanged for the coming year.`, note: md`This supports the premise that costs will not change, so it helps the prediction rather than hurting it.` },
        { id: 'C', text: md`Stannard makes more profit on each cake it sells than on each loaf of bread.`, note: md`Cakes are outside the prediction, which concerns profit from bread alone.` },
        { id: 'D', text: md`Other bakeries in the town raised their bread prices by 15 percent last year without losing customers.`, note: md`This suggests customers tolerate price rises, which strengthens the prediction.` },
        { id: 'E', text: md`Stannard last raised its bread prices four years ago.`, note: md`How long ago the last rise happened does not show that this one will fail to raise profit.` },
      ],
      answer: 'A',
      workingMd: md`The prediction assumes the bakery will keep selling roughly the same number of loaves at the higher price. If a third of customers leave, sales fall to about two thirds of their old level while revenue per loaf rises by only a tenth: two thirds of 1.1 is about 0.73 of the old revenue. Unless costs are a very large share of the price, profit falls. The supplier option confirms a premise, and the other bakeries' experience supports the owner.`,
      lesson: 'A price-rise plan is weakened by evidence that enough buyers will leave to outweigh the higher price.',
    },
    {
      id: 'check-magazine-poll',
      title: 'A poll and a nationwide conclusion',
      topic: 'Critical Reasoning',
      stimulusMd: md`An online poll on the website of the hiking magazine Trail and Summit asked readers whether national parks should charge an entry fee. Of the 4,000 readers who answered, 78 percent said no. The magazine's editor concludes that most adults in the country oppose entry fees for national parks.`,
      stemMd: md`Which of the following, if true, most seriously weakens the editor's conclusion?`,
      options: [
        { id: 'A', text: md`Readers of Trail and Summit visit national parks far more often than most adults do, and so would pay any entry fee far more often.`, note: '' },
        { id: 'B', text: md`The 4,000 readers who answered are only a small part of the magazine's total readership.`, note: md`Every poll covers only part of a population; the size of the sample is not the problem unless it is unrepresentative.` },
        { id: 'C', text: md`Some readers who said no to entry fees also said they would pay one if it were introduced.`, note: md`Being willing to pay a fee is compatible with opposing it, so this does not reduce the share who oppose fees.` },
        { id: 'D', text: md`A poll of park rangers found that most rangers favour entry fees.`, note: md`Rangers are a different group again, so their view tells us nothing about the country's adults as a whole.` },
        { id: 'E', text: md`National parks in several other countries charge entry fees.`, note: md`Other countries' policies do not bear on what adults in this country think.` },
      ],
      answer: 'A',
      workingMd: md`The conclusion moves from the magazine's poll respondents to all adults in the country. It is weakened by any reason to think the respondents differ from other adults on this question. Frequent park visitors, who would pay a fee most often, have a special reason to oppose one, so their 78 percent is unlikely to reflect adults in general. The rangers' poll is tempting, but it swaps one unrepresentative group for another rather than undermining the editor's inference.`,
      lesson: 'A survey conclusion is weakened by showing the people surveyed differ from the wider group in a way that bears on the question.',
    },
  ],
  takeaways: [
    'A weakener widens the gap between premises and conclusion; it does not deny a premise.',
    'For a causal claim, look for another cause, reversed causation, or the cause without the effect.',
    'A fact shared by both groups compared cannot explain the difference between them.',
    'For a plan, look for the response, cost or side effect that cancels the gain.',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-critical-reasoning', skill: 'cr-weaken-argument' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
