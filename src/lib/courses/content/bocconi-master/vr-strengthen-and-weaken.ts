import { md, type Lesson } from '../../types';

/** Bocconi master's, verbal reasoning: options that support or undermine a thesis. */
export const strengthenAndWeakenLesson: Lesson = {
  slug: 'strengthen-and-weaken',
  title: 'Strengthen and weaken: supporting or undermining a thesis',
  summary: 'Pick the option that best supports or most undermines a thesis by working on the gap: rule out or raise alternatives, and ignore options off the point.',
  minutes: 20,
  objectives: [
    'Predict what kind of fact would support or undermine a given thesis before reading the options.',
    'Recognise the main ways to weaken: an alternative cause, an unrepresentative sample, an obstacle to a plan.',
    'Choose the option with the biggest effect on the conclusion, and reject options that are off topic or point the wrong way.',
  ],
  teachMd: md`
### What these questions ask

Bocconi describes its verbal critical reasoning items as a short passage followed by a question such as which condition would best support the thesis, with the passage assumed to be true. Supporting and undermining are two sides of one skill. A strengthener makes the conclusion more likely to follow from the premises; a weakener makes it less likely. Neither has to prove or disprove anything. You are looking for the option that moves the conclusion furthest in the direction asked.

Two rules frame every question of this kind:

1. **Take the options as true.** A stem that says "if true" means exactly that. Do not reject an option because it seems unlikely; ask what would follow if it were so.
2. **Work on the reasoning, not the premises.** The passage is true. An option that merely disputes a premise ("the survey may have been wrong") is not available as a weakener, and an option that repeats a premise adds nothing as a strengthener.

### Start from the gap

Find the conclusion and premises, then name the gap, as in [argument structure](/courses/bocconi-master/argument-structure). The gap tells you what to look for:

- a **strengthener** narrows the gap: it confirms the link the argument relies on, or rules out a rival explanation;
- a **weakener** widens the gap: it shows the link may not hold, or offers a rival explanation for the evidence.

In fact, most strengtheners and weakeners act on the argument's [assumption](/courses/bocconi-master/assumptions). Supporting the assumption strengthens; casting doubt on it weakens.

### The common moves

| Gap | Weaken by showing... | Strengthen by showing... |
| --- | --- | --- |
| Correlation to cause | another factor could explain the result; the cause runs the other way | the other factors were absent; the result appears only where the cause does |
| Sample to group | the sample differs from the group in a way that matters | the sample was chosen to be typical |
| Plan to goal | something blocks the plan, or it has a side effect that defeats the goal | the plan's key step works, or the obstacle is absent |
| Comparison | the two things differ in a way that matters | the two things are alike in the relevant ways |
| Term shift | the measured thing does not track the claimed thing | the measured thing does track it |

### Alternative explanations

The most common weakener in causal arguments is a rival explanation of the same evidence. If sales rose after a layout change, a weakener shows that sales also rose where nothing changed, or that something else changed at the same time. The rival does not need to be proven; it only needs to make the author's explanation less certain.

The mirror image is the most common strengthener: an option that removes the rival. "Sales did not rise at stores that kept the old layout" makes the layout explanation more likely, because the obvious alternative (a general trend) is now ruled out.

### Measuring effect

Several options can point the right way. The stem asks for the one that does so **most** or **best**. Prefer an option that:

- addresses the gap directly rather than a side issue;
- applies to the whole of the evidence, not a few cases ("some shoppers", "one store");
- would change your view of the conclusion even if you knew nothing else.

An option that touches the topic but not the reasoning, such as how popular a policy is or what it costs, usually has no effect on whether the conclusion follows.

### Read the conclusion's exact claim

Strengthening and weakening are always relative to the precise conclusion. If the thesis is that a rule will reduce **afternoon** congestion, facts about morning traffic, about who supports the rule, or about other cities matter only if they bear on afternoon congestion here. Before you weigh the options, restate the conclusion in a few words, including its scope: who, where, when, how much.

### A quick method

1. Restate the conclusion with its scope.
2. Name the gap and predict one or two kinds of fact that would move it.
3. For each option, ask: if this is true, does the conclusion become more likely, less likely, or neither?
4. Mark each option with a plus, a minus or a zero. In a strengthen question, keep the plus that bears most directly on the gap; in a weaken question, the minus.

The plus-minus-zero marks stop you from picking an option that is relevant but points the wrong way, one of the most common slips under time pressure.
`,
  examples: [
    {
      id: 'example-sick-days',
      title: 'Weakening a causal claim',
      problemMd: md`"Staff at a firm's Milan office, which moved to a four-day working week, took 40% fewer sick days last year than staff at its Turin office, which kept a five-day week. The firm concludes that the four-day week improves staff health." What would most weaken this?`,
      steps: [
        md`Conclusion: the four-day week improves health. Evidence: Milan staff took fewer sick days than Turin staff. Gap: from fewer sick days to better health, and from a difference between two offices to a cause.`,
        md`Predict weakeners: something else explains the difference (the offices differ in some other way), or fewer sick days does not mean better health.`,
        md`One strong candidate: "A sick day is recorded only for a scheduled working day missed." A Milan employee works four days a week instead of five, so even with identical health they would record about 20% fewer sick days, simply because there are fewer days on which to be absent.`,
        md`The counting effect alone produces 20% fewer sick days. Per day worked, Milan staff missed $\frac{0.6}{0.8} = 0.75$ times as many days as Turin staff, a gap of 25% rather than 40%. Part of the evidence is explained without any change in health, so the argument is weaker, though not destroyed: the remaining difference still needs explaining.`,
        md`A different weakener would also work: "Milan staff are on average fifteen years younger than Turin staff." Age is a rival explanation for the gap in sick days.`,
      ],
      answerMd: md`Either a counting effect (fewer working days means fewer possible sick days) or a difference between the two workforces would weaken the conclusion. The tempting wrong answer is "staff in Milan say they enjoy the four-day week", which is about enjoyment, not health.`,
    },
    {
      id: 'example-museum',
      title: 'Strengthening a plan',
      problemMd: md`"A city museum will offer free entry on the first Sunday of every month. The director expects this to raise the museum's yearly ticket revenue, because many first-time visitors who come free will later return as paying visitors." Which would most strengthen the director's expectation: (i) "Free Sundays at other museums draw large crowds"; (ii) "In a trial last year, about a third of free-Sunday visitors returned and paid for entry within six months"; (iii) "The museum's paying visitors are mostly local residents"?`,
      steps: [
        md`Conclusion: yearly ticket revenue will rise. Mechanism: free visitors later return and pay. Gap: whether enough free visitors actually come back and pay to outweigh the lost Sunday ticket sales.`,
        md`Option (i): large crowds on free days. That says people come when entry is free, not that they come back and pay. Mark it zero, or at most a weak plus.`,
        md`Option (ii): a third of free visitors returned and paid. That confirms the plan's key step directly. Mark it a strong plus.`,
        md`Option (iii): paying visitors are mostly local. That does not say whether free visitors will convert. Mark it zero.`,
      ],
      answerMd: md`Option (ii) strengthens most, because it supports the step the plan depends on. Option (i) is the tempting wrong answer: it is about the same topic, but crowds on free days do not raise ticket revenue on their own.`,
    },
    {
      id: 'example-sign-check',
      title: 'Marking plus, minus and zero',
      problemMd: md`"After the central library in a city extended its weekday closing time from 6 p.m. to 9 p.m., the number of books it lent rose by 15% over the following year. The library concludes that the longer opening hours led people to borrow more." Mark these options plus, minus or zero: (i) "Over the same year, loans fell slightly at the city's other libraries, which kept their old hours"; (ii) "During that year the central library doubled its stock of new popular novels, and loans of those novels account for nearly all of the extra borrowing"; (iii) "Users describe the library's evening atmosphere as pleasant".`,
      steps: [
        md`Conclusion: the longer hours caused more borrowing. Gap: the rise came after the change, but something else could explain it.`,
        md`Option (i): libraries without longer hours did not see a rise. That rules out a citywide trend in borrowing, so it is a plus.`,
        md`Option (ii): a new stock of popular novels that accounts for nearly all the extra loans is a rival explanation for the whole rise. It is a strong minus.`,
        md`Option (iii): a pleasant atmosphere says nothing about how much is borrowed or why. It is a zero.`,
      ],
      answerMd: md`Option (i) strengthens, option (ii) weakens and option (iii) has no effect. In a weaken question, (ii) is the answer; in a strengthen question, (i). A reader who only asks "is this on topic?" might pick (iii) in either case.`,
    },
  ],
  traps: [
    {
      title: 'Attacking a premise',
      md: md`The passage is taken as true. An option that says a figure may be mistaken or a survey may be dishonest does not engage with the reasoning, and it contradicts the instruction to treat the passage as true. Weaken the link, not the evidence.`,
    },
    {
      title: 'Relevant, but pointing the wrong way',
      md: md`In a weaken question, an option that strengthens is often included because it is clearly on topic. Mark every option plus, minus or zero before you choose, and check the sign against what the stem asks for.`,
    },
    {
      title: 'Right topic, wrong conclusion',
      md: md`An option about cost, popularity, fairness or another place can sit on the topic without touching the conclusion's exact claim. Restate the conclusion with its scope (who, where, when, how much) and test each option against that.`,
    },
    {
      title: 'A weak effect over a strong one',
      md: md`"Some shoppers find the layout confusing" points the right way for a weakener, but only a little and only for some shoppers. An option that explains the whole of the evidence another way does far more. When two options point the same way, keep the one that bears more directly and more broadly on the gap.`,
    },
  ],
  check: [
    {
      id: 'check-produce-weaken',
      title: 'Undermining a layout claim',
      topic: 'Verbal critical reasoning',
      stemMd: md`Two years ago, a supermarket chain moved its fruit and vegetables from the back of its stores to just inside the entrance. Over the two years since, the number of kilos of fresh produce it sold rose by 18%. The chain's marketing team concludes that placing produce at the entrance makes shoppers buy more of it.

Which of the following, if true, most weakens the marketing team's conclusion?`,
      options: [
        { id: 'A', text: md`Shoppers at the chain spend more time in the produce section than in any other section.`, note: md`This says nothing about whether the move changed buying; shoppers may have spent the most time there before the move as well, so it has no clear effect.` },
        { id: 'B', text: md`Over the same two years, the kilos of fresh produce sold rose by about 18% at competing supermarkets that did not change their layouts.`, note: '' },
        { id: 'C', text: md`Some shoppers say they find the new layout confusing.`, note: md`Points weakly against the layout, but confusion and buying more can go together, and it concerns only some shoppers. It does not explain the 18% rise another way.` },
        { id: 'D', text: md`The chain's stores sell more packaged food than fresh produce.`, note: md`The relative size of two product ranges is irrelevant to whether moving produce raised produce sales.` },
      ],
      answer: 'B',
      workingMd: md`The conclusion is causal: the entrance position made shoppers buy more produce. The evidence is a rise after the move. The strongest weakener offers another explanation for the whole rise. If supermarkets that kept their old layout saw the same 18% growth, a general trend, such as a shift in diet, explains the chain's rise without any help from the new layout. The other options are neutral, weak or irrelevant.`,
      lesson: 'To weaken a "before and after" causal claim, look for an option showing the same change where the cause was absent.',
    },
    {
      id: 'check-delivery-thesis',
      title: 'Supporting a traffic thesis',
      topic: 'Verbal critical reasoning',
      stemMd: md`A city will allow delivery vans to unload in its historic centre only before 10 a.m. Delivery vans stopped on the centre's narrow streets block other traffic while they unload. The council's thesis is that the new rule will reduce afternoon traffic jams in the historic centre.

Which of the following, if true, best supports the council's thesis?`,
      options: [
        { id: 'A', text: md`Most delivery companies operating in the city opposed the new rule.`, note: md`Opposition to the rule says nothing about whether it will reduce afternoon jams; it has no effect on the thesis.` },
        { id: 'B', text: md`Some drivers are expected to unload after 10 a.m. despite the rule.`, note: md`This points the wrong way: vans still unloading in the afternoon would keep causing some of the jams the rule is meant to prevent.` },
        { id: 'C', text: md`Most afternoon traffic jams in the historic centre now occur on streets where delivery vans stop to unload.`, note: '' },
        { id: 'D', text: md`Traffic in the historic centre is usually lighter in the morning than in the afternoon.`, note: md`This bears on whether morning unloading will cause new morning jams, not on the thesis, which is about afternoon jams. Even with no information on mornings, the case for fewer afternoon jams is unchanged.` },
      ],
      answer: 'C',
      workingMd: md`The thesis is about afternoon jams. The rule removes afternoon unloading, so it helps only if afternoon unloading is a real cause of those jams. The passage says unloading vans block traffic, but not that they account for much of the afternoon congestion. The option saying most afternoon jams occur where vans stop to unload closes that gap: removing the vans then targets the main source of the jams. Morning traffic levels concern a different time of day, opposition is irrelevant, and drivers breaking the rule would weaken the thesis.`,
      lesson: 'Restate the thesis with its scope; the best support bears on exactly that claim, here afternoon jams, not on the policy in general.',
    },
    {
      id: 'check-gym-survey',
      title: 'Supporting a survey conclusion',
      topic: 'Verbal critical reasoning',
      stemMd: md`A gym chain surveyed 200 of its members, and 70% of them said they would use the gyms if they opened at 6 a.m. instead of 7 a.m. The chain concludes that a 6 a.m. opening time would be popular with its members as a whole.

Which of the following, if true, most strengthens the chain's conclusion?`,
      options: [
        { id: 'A', text: md`Gyms run by other chains in the same city already open at 6 a.m.`, note: md`What other chains do says nothing about whether this chain's members want an earlier opening; at most it hints at demand in general.` },
        { id: 'B', text: md`Enough of the chain's staff are willing to work shifts starting at 5:30 a.m.`, note: md`This bears on whether the chain can open at 6 a.m., not on whether members would welcome it; the conclusion is about popularity.` },
        { id: 'C', text: md`Some of the members surveyed already exercise at home before work.`, note: md`Ambiguous and minor. It could suggest some would switch to the gym or that they are happy at home; it does not address whether the 200 represent all members.` },
        { id: 'D', text: md`The 200 members surveyed were chosen at random from the chain's full membership list.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`The gap runs from 200 surveyed members to the membership as a whole: sample to group. The argument relies on the sample being typical. If the 200 were chosen at random from all members, the main doubt about the sample (for instance, that only early risers were asked) is removed, and the 70% figure becomes good evidence about the whole membership. Staffing concerns feasibility, other chains concern other people, and home exercise is too vague to move the conclusion.`,
      lesson: 'When a conclusion generalises from a survey, the best strengthener shows the sample is typical of the whole group.',
    },
  ],
  takeaways: [
    'Strengtheners narrow the gap between evidence and conclusion; weakeners widen it.',
    'Treat every option as true and work on the reasoning, never on the premises.',
    'Rival explanations weaken causal claims; ruling them out strengthens them.',
    'Mark each option plus, minus or zero against the conclusion\'s exact scope before choosing.',
    'Among options pointing the same way, pick the one that bears most directly and broadly on the gap.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-verbal-reasoning', skill: 'grad-verbal-argument-analysis' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
