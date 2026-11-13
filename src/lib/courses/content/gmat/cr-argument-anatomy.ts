import { md, type Lesson } from '../../types';

/** GMAT Critical Reasoning, lesson 1: the parts of an argument. */
export const argumentAnatomy: Lesson = {
  slug: 'argument-anatomy',
  title: 'Argument anatomy: conclusion, premises and the gap between them',
  metaTitle: 'Argument anatomy: conclusion, premises and the gap',
  summary: 'Take any Critical Reasoning argument apart into conclusion, premises, background and counterpoint, and find the gap that most questions ask about.',
  minutes: 20,
  objectives: [
    'Find the main conclusion of a short argument, and tell it apart from an intermediate conclusion.',
    'Label every sentence of an argument as premise, background, counterpoint or conclusion.',
    'Name the gap between what the premises establish and what the conclusion claims.',
    'Describe the role a highlighted sentence plays in an argument.',
  ],
  teachMd: md`
### What a Critical Reasoning question looks like

The GMAT Verbal Reasoning section gives you 45 minutes for 23 multiple-choice questions, a mix of Reading Comprehension and Critical Reasoning. That is just under two minutes a question on average. A Critical Reasoning question has three parts: a short passage (usually a single argument of a few sentences), a question stem that tells you the job, and five options. Almost every job, whether you are asked to strengthen, weaken, find an assumption or name a flaw, depends on the same first step: seeing how the argument is built.

### The four kinds of sentence

Every sentence in an argument does one of four things.

| Part | What it does | Typical signals |
| --- | --- | --- |
| **Conclusion** | The claim the author wants you to accept | therefore, so, thus, hence, clearly, it follows that, we should |
| **Premise** | A reason offered in support of the conclusion | because, since, given that, for, after all, as shown by |
| **Background** | Sets the scene; neither argued for nor used as a reason | often the first sentence, stated neutrally |
| **Counterpoint** | A view or fact the author answers or concedes | some argue, critics claim, admittedly, although, but |

Signal words help, but they are not reliable on their own: a conclusion can sit in the first sentence with no "therefore" at all, and "but" can introduce a premise as easily as a conclusion. Use the words as hints, then confirm with a test.

### The "because" test

To check which of two claims supports the other, join them with "because" both ways round and see which version makes sense as reasoning. "The plan will fail, because costs will rise" is an argument; "costs will rise, because the plan will fail" usually is not. The claim that comes before "because" in the sensible version is the conclusion.

### Main and intermediate conclusions

Many arguments run in a chain: a premise supports a claim, and that claim in turn supports a further claim. The middle claim is an **intermediate conclusion**: it is argued for, and it also serves as a premise. The **main conclusion** is the one claim that supports nothing else in the argument. When a question asks for the conclusion, it wants the main one; an option that states the intermediate conclusion is a standard wrong answer, because it is in the passage and it is argued for.

A quick way to find the main conclusion: for each argued-for claim, ask "what is this for?" If the answer is another claim in the passage, keep going. The claim with no further answer is the main conclusion.

### The gap

Premises almost never prove a conclusion outright. Between what the premises establish and what the conclusion claims there is a **gap**, and most Critical Reasoning questions are about that gap:

- an **assumption** question asks what must be true to bridge it;
- a **strengthen** question asks what narrows it;
- a **weaken** question asks what widens it;
- a **flaw** question asks you to describe it;
- an **evaluate** question asks what you would need to find out to judge it.

To find the gap, compare the words of the conclusion with the words of the premises. Look for an idea that appears in the conclusion but nowhere in the premises. Common shapes:

- **Correlation to cause.** Two things go together, so one is said to cause the other.
- **Sample to population.** Something true of a group studied is said to be true of a wider group.
- **Past to future, or here to there.** What happened in one setting is said to happen in another.
- **Plan to result.** A plan is said to achieve its goal.
- **Term shift.** The premises talk about one thing (sales, for example) and the conclusion about a related but different thing (profit).

### Role questions

Some questions highlight one or two sentences (shown in bold) and ask what role each plays. Label each highlighted part with the table above, then add how it relates to the main conclusion: does it support it, oppose it, or is it the main conclusion itself? Options often differ by a single word ("supports" against "opposes", "main conclusion" against "intermediate conclusion"), so read each option against your labels rather than reading your labels into the options.

### A routine for every question

1. Read the question stem first, so you know the job before you read the argument.
2. Read the argument and find the main conclusion.
3. Mark the premises, and set aside background and counterpoint.
4. State the gap in your own words, in one short sentence.
5. Only then read the options.

Doing steps 2 to 4 before you look at the options protects you from the most common way of losing marks in this question type: being talked into an option that sounds relevant because it repeats the passage's words.
`,
  examples: [
    {
      id: 'example-label-every-sentence',
      title: 'Labelling a four-sentence argument',
      problemMd: md`"The town of Ostley is considering a ban on cars in its old market square. Shop owners fear the ban would cost them customers. However, when the nearby town of Ferrin closed its high street to cars, footfall in its shops rose within a year. So Ostley's shop owners have less to fear than they think." Label each sentence and state the main conclusion.`,
      steps: [
        md`Sentence 1 states the situation and argues for nothing: it is **background**.`,
        md`Sentence 2 reports a worry the author goes on to answer ("However"): it is a **counterpoint**.`,
        md`Sentence 3 offers evidence from Ferrin. Use the "because" test with sentence 4: "Ostley's shop owners have less to fear, because Ferrin's footfall rose" makes sense, so sentence 3 is a **premise**.`,
        md`Sentence 4, signalled by "So", is supported and supports nothing further: it is the **main conclusion**.`,
        md`Compare premise and conclusion: the evidence is about Ferrin, the conclusion about Ostley. The gap is "what happened in Ferrin will happen in Ostley".`,
      ],
      answerMd: md`Background, counterpoint, premise, main conclusion. The main conclusion is that Ostley's shop owners have less to fear than they think. The tempting wrong choice for "conclusion" is the shop owners' fear itself, which is the view the author argues against.`,
    },
    {
      id: 'example-intermediate-conclusion',
      title: 'Finding the main conclusion in a chain',
      problemMd: md`"The new warehouse software routes pickers to items in the shortest order. Pickers will therefore spend less time walking between shelves. That means each picker can fill more orders per shift, so the company can meet the holiday rush without hiring temporary staff." Which claim is the main conclusion?`,
      steps: [
        md`Find every argued-for claim: "pickers will spend less time walking" (signalled by "therefore"), "each picker can fill more orders" ("That means"), and "the company can meet the rush without hiring" ("so").`,
        md`Ask "what is this for?" of each. Less walking is offered to show more orders per shift; more orders per shift is offered to show no temporary staff are needed.`,
        md`The claim about not hiring temporary staff supports nothing else, so it is the main conclusion; the other two are intermediate conclusions.`,
      ],
      answerMd: md`The main conclusion is that the company can meet the holiday rush without hiring temporary staff. "Each picker can fill more orders per shift" is the tempting wrong answer: it is argued for, but only as a step towards the final claim.`,
    },
    {
      id: 'example-name-the-gap',
      title: 'Naming the gap',
      problemMd: md`"Sales of the Velo cycling helmet rose by 30 percent after the manufacturer switched its advertising from magazines to social media. The switch was clearly a good business decision." State the gap.`,
      steps: [
        md`Conclusion: the switch was a good business decision. Premise: sales rose 30 percent after the switch.`,
        md`Look for ideas in the conclusion that are missing from the premise. "Good business decision" is about profit and value, while the premise is only about sales.`,
        md`There is a second gap: the premise says the rise came after the switch, not because of it.`,
      ],
      answerMd: md`Two gaps: the argument assumes the switch caused the rise in sales, and that the rise in sales made the business better off (for example, that the social media campaign did not cost more than the extra sales earned). A question on this argument could test either one.`,
    },
  ],
  traps: [
    {
      title: 'Picking the intermediate conclusion',
      md: md`In a chain of reasoning, a claim that is argued for can still be only a step. Options that restate an intermediate conclusion are attractive because they are clearly supported by the passage. Before you answer a conclusion question, ask of your choice "what is this claim for?" If it supports another claim in the passage, it is not the main conclusion.`,
    },
    {
      title: md`Taking the counterpoint for the author's view`,
      md: md`Arguments often open with what "some people" or "critics" believe, then answer it. A reader who stops early, or skims, takes that opening view as the conclusion. Watch for contrast words (but, however, yet, nevertheless): what follows them is usually the author's own position.`,
    },
    {
      title: 'Trusting signal words blindly',
      md: md`"Since" can mean "because" or "from the time when"; "so" can mean "therefore" or "very". And a conclusion can appear with no signal at all, often as the first sentence. Confirm every label with the "because" test rather than the vocabulary alone.`,
    },
    {
      title: 'Reading the options before stating the gap',
      md: md`Options are written to sound relevant: many repeat words from the passage. If you have not put the gap into your own words first, you have nothing to measure them against, and the most familiar-sounding option tends to win. Spend the extra ten seconds before you read the choices.`,
    },
  ],
  check: [
    {
      id: 'check-electric-buses',
      title: 'Main conclusion in a chain',
      topic: 'Critical Reasoning',
      stimulusMd: md`The town of Merrow plans to replace its diesel buses with electric ones over five years. Critics point out that an electric bus costs nearly twice as much to buy. But the savings on fuel and maintenance repay that difference within six years of a bus's twelve-year working life. Since an electric bus will therefore cost the town less over its working life than a diesel bus, the plan is financially sound, whatever the purchase price suggests.`,
      stemMd: md`Which of the following most accurately states the main conclusion of the argument?`,
      options: [
        { id: 'A', text: md`An electric bus costs nearly twice as much to buy as a diesel bus.`, note: md`This is the critics' point, which the author concedes and then answers; it is a counterpoint, not the conclusion.` },
        { id: 'B', text: md`Savings on fuel and maintenance repay the higher purchase price of an electric bus within six years.`, note: md`This is a premise: it is offered as the reason the electric buses cost less overall.` },
        { id: 'C', text: md`Over its working life, an electric bus will cost the town less than a diesel bus.`, note: md`This is argued for ("therefore"), but it is then used to support the claim about the plan, so it is an intermediate conclusion.` },
        { id: 'D', text: md`Merrow's plan to replace its diesel buses with electric ones is financially sound.`, note: '' },
        { id: 'E', text: md`Towns should judge vehicle purchases by their working-life cost rather than their purchase price.`, note: md`A general policy the argument might suggest, but it never states it; the conclusion is about Merrow's plan only.` },
      ],
      answer: 'D',
      workingMd: md`Trace the chain. The repayment within six years (premise) shows that an electric bus costs less over its working life (intermediate conclusion, "therefore"), which in turn shows that the plan is financially sound. That last claim supports nothing else, so it is the main conclusion. The critics' point about purchase price is a counterpoint, and the general rule about judging purchases goes beyond anything the passage says.`,
      lesson: 'The main conclusion is the one argued-for claim that supports nothing further in the passage.',
    },
    {
      id: 'check-calorie-labels',
      title: 'The roles of two highlighted sentences',
      topic: 'Critical Reasoning',
      stimulusMd: md`Some nutritionists argue that a new law requiring restaurants to print the calorie count of each dish on their menus will do little to change what diners order. **They point out that in a trial in one city, average calories per order fell by only 2 percent.** But that trial ran for just three weeks, and shoppers took several months to start paying attention to similar labels on packaged food. **The law is therefore likely to change ordering habits more than the trial suggests.**`,
      stemMd: md`In the argument, the two portions in bold type play which of the following roles?`,
      options: [
        { id: 'A', text: md`The first is evidence the argument uses to support its conclusion; the second is that conclusion.`, note: md`The first portion supports the nutritionists' view, which the argument opposes; it is not evidence for the author's conclusion.` },
        { id: 'B', text: md`The first is evidence offered for a position that the argument opposes; the second is the argument's main conclusion.`, note: '' },
        { id: 'C', text: md`The first is the argument's main conclusion; the second is evidence offered in support of it.`, note: md`This reverses the roles: the second portion is signalled by "therefore" and is the claim the author argues for.` },
        { id: 'D', text: md`The first is a position that the argument opposes; the second is evidence against that position.`, note: md`The first portion is evidence for a position (the nutritionists' prediction), not the position itself, and the second is a conclusion, not evidence.` },
        { id: 'E', text: md`The first is evidence offered for a position that the argument opposes; the second is an intermediate conclusion offered in support of the main conclusion.`, note: md`The first half is right, but nothing in the passage is supported by the second portion; it is the main conclusion, not a step towards one.` },
      ],
      answer: 'B',
      workingMd: md`The nutritionists' position is that the law will do little. The first bold portion is the trial result they cite, so it is evidence for the opposed position. The author then attacks that evidence (the trial was short, and label effects take months) and concludes, with "therefore", that the law will change habits more than the trial suggests. Nothing follows from that claim, so it is the main conclusion.`,
      lesson: 'Label each highlighted part by what it does and by which side it serves before reading the role options.',
    },
    {
      id: 'check-study-groups',
      title: 'Naming the gap',
      topic: 'Critical Reasoning',
      stimulusMd: md`Students at Halden College who join a study group earn higher average marks in their first year than students who do not. So if every first-year student at the college were required to join a study group, average first-year marks at the college would rise.`,
      stemMd: md`The conclusion of the argument relies on which of the following ideas, which the premise does not establish?`,
      options: [
        { id: 'A', text: md`Students who join study groups at Halden College earn higher average marks than students who do not.`, note: md`This restates the premise; it is established, not missing.` },
        { id: 'B', text: md`It is joining a study group that produces the higher marks, rather than something about the kind of student who chooses to join.`, note: '' },
        { id: 'C', text: md`First-year marks at Halden College are lower than at similar colleges.`, note: md`A comparison with other colleges plays no part in the reasoning, which is about Halden alone.` },
        { id: 'D', text: md`Study groups at Halden College meet at least once a week.`, note: md`How often groups meet is a detail the argument does not need; it would hold whatever the schedule, as long as membership raises marks.` },
        { id: 'E', text: md`Students who join study groups also spend more time in the library than students who do not.`, note: md`This is not something the argument relies on; if anything it suggests another cause of the higher marks, which would count against the conclusion.` },
      ],
      answer: 'B',
      workingMd: md`The premise is a correlation: group members earn higher marks. The conclusion predicts that forcing everyone into groups would raise marks, which is a causal claim. The missing idea is that membership itself causes the higher marks, rather than, say, more motivated students choosing to join. The library option points to a possible other cause, which the argument would need to rule out, not rely on.`,
      lesson: 'When the premise reports that two things go together and the conclusion predicts what a change will do, the gap is causation.',
    },
  ],
  takeaways: [
    'Read the question stem first, then find the main conclusion before anything else.',
    'The main conclusion supports nothing further; an argued-for claim that does is an intermediate conclusion.',
    'Use the "because" test, not signal words alone, to confirm which claim supports which.',
    'State the gap in your own words before you read the options; most question types are about that gap.',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-critical-reasoning', skill: 'cr-construct-argument' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
