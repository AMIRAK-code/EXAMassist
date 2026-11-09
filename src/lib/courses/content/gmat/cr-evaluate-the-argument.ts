import { md, type Lesson } from '../../types';

/** GMAT Critical Reasoning, lesson 5: evaluate-the-argument questions. */
export const evaluateTheArgument: Lesson = {
  slug: 'evaluate-the-argument',
  title: 'Evaluate the argument: the question whose answer matters',
  summary: 'Find the piece of information that would decide whether an argument holds, using the two-answer test to reject questions whose answers change nothing.',
  minutes: 18,
  objectives: [
    'Recognise an evaluate question and what its options look like.',
    'Apply the two-answer test: one answer should strengthen and the other weaken.',
    'Reject options whose answer, either way, leaves the argument untouched.',
  ],
  teachMd: md`
### What the question asks

Evaluate questions ask what you would most want to know in order to judge the argument. Typical stems:

- "Which of the following would it be most useful to determine in order to evaluate the argument?"
- "The answer to which of the following questions would be most helpful in evaluating the plan?"
- "Which of the following would be most important to know in assessing the conclusion?"

The options are usually written as questions or as "whether..." clauses: "Whether the number of visitors also rose at other museums". You are not asked whether the argument is good. You are asked which piece of missing information would tell you.

### The link to strengthen and weaken

An evaluate question is a strengthen and a weaken question folded together. The right option is a question with two possible answers, and those answers push the argument in **opposite directions**: one makes the conclusion more likely, the other less likely. If you know the answer, you learn something about whether the argument holds.

That gives the central method, the **two-answer test**. For each option:

1. Give it a "yes" answer (or a high value), and ask: does the argument get stronger, weaker, or neither?
2. Give it a "no" answer (or a low value), and ask the same.
3. Keep the option only if the two answers move the argument in opposite directions.

An option that leaves the argument unchanged under both answers is irrelevant, however closely it echoes the passage.

### Where the right option comes from

Because the answer must bear on the gap, predict it the way you would for a strengthen or weaken question. State the conclusion and the premises, name the gap, then think of the alternative explanation or the obstacle that would sink the argument. The right option almost always asks whether that alternative or obstacle exists.

| Gap | A typical evaluate question |
| --- | --- |
| A caused B | Did B also happen where A was absent? Did something else change at the same time? |
| Sample to population | Are the people sampled like the group in the conclusion? |
| A plan will work | Does the plan address the actual cause of the problem? Will people respond as expected? |
| A comparison | Were the groups alike before the difference appeared? |

### Why wrong options fail

1. **Irrelevant.** Neither answer affects the conclusion (the colour of the new lamps, the cost of a programme when the conclusion is not about cost).
2. **One-sided.** One answer matters, the other does not. For example, "whether any customers complained" might weaken if the answer is "many", but "a few" changes nothing; compare with a better option whose two answers both matter.
3. **Already answered.** The passage states the answer.
4. **Off-target comparison.** It compares the subject with something that has no bearing on the conclusion ("whether this street has more parked cars than any other street").

### Scope discipline

Evaluate questions punish drifting from the conclusion more than any other type, because every option is phrased as a reasonable thing to wonder. Hold on to the exact conclusion. If it is about whether a fall in theft was caused by the lighting, then the cost of the lighting, the residents' opinion of it, and how long the lamps last are all interesting and all irrelevant. Ask: "If I knew this, would I believe the conclusion more, or less, depending on the answer?"

### Timing

The two-answer test takes a few seconds per option once it is habitual. You do not need to run it carefully on every option: options that are obviously out of scope can go at a glance, leaving two or three for the full test.
`,
  examples: [
    {
      id: 'example-two-answer-test',
      title: 'Running the two-answer test',
      problemMd: md`"After Marlow Council introduced a free bus service to its hospital, missed hospital appointments fell by 20 percent. The council concludes that the bus service reduced missed appointments." Is it useful to know "whether the hospital began sending text-message reminders of appointments during the same period"?`,
      steps: [
        md`The gap is causal: the fall followed the bus service, and the council credits the bus.`,
        md`Answer "yes": reminders began at the same time. That is a rival cause, so the conclusion weakens.`,
        md`Answer "no": no reminders were introduced. One rival is ruled out, so the conclusion strengthens a little.`,
        md`The two answers push in opposite directions, so the option passes the test.`,
      ],
      answerMd: md`Yes, it is useful: the answer would either supply a rival explanation or remove one. By contrast, "whether the buses run on electricity" leaves the argument where it was under either answer.`,
    },
    {
      id: 'example-plan-evaluation',
      title: 'Evaluating a plan',
      problemMd: md`"To reduce queues at its passport office, the agency plans to extend opening hours by two hours each evening." Which is more useful to know: (1) "whether the evening staff will be paid overtime", or (2) "whether people in the queues could come in the evening if they wished"?`,
      steps: [
        md`The plan's goal is shorter queues; it works only if some demand moves to the evening.`,
        md`Option (2): if yes, demand can spread out and queues are likely to shrink; if no (most applicants work and can only come at the times they come now, or cannot travel at night), the extra hours are wasted. Opposite directions, so it passes.`,
        md`Option (1): overtime affects the cost, but the plan's success is judged on queues. Either answer leaves the prediction about queues unchanged.`,
      ],
      answerMd: md`Option (2) is the more useful thing to know. Option (1) is tempting because cost matters to any real plan, but the argument's conclusion is about queues, not cost.`,
    },
  ],
  traps: [
    {
      title: 'Choosing an interesting question instead of a relevant one',
      md: md`Every option in an evaluate question is a sensible thing to wonder about. That is the trap. Relevance is judged only against the conclusion: if neither answer to the question changes how far you believe it, the question is useless here.`,
    },
    {
      title: 'Accepting a one-sided option',
      md: md`Some options matter under one answer only. If "whether any staff disliked the change" would weaken the argument when the answer is "most" but changes nothing when the answer is "a few", look for an option whose answers both matter.`,
    },
    {
      title: 'Bringing in cost when the conclusion is about effect',
      md: md`Cost is the most common out-of-scope option. Unless the conclusion says the plan is worthwhile, affordable or profitable, what it costs does not bear on whether it will work.`,
    },
  ],
  check: [
    {
      id: 'check-street-lighting',
      title: 'Lighting and car theft',
      topic: 'Critical Reasoning',
      stimulusMd: md`Garrow Council replaced the streetlights on Elm Avenue with brighter lamps. In the year after the change, reported thefts from parked cars on Elm Avenue fell by 40 percent compared with the year before. The council concludes that the brighter lighting caused the fall in thefts.`,
      stemMd: md`Which of the following would it be most useful to determine in order to evaluate the council's conclusion?`,
      options: [
        { id: 'A', text: md`Whether the new lamps cost more to buy than the lamps they replaced`, note: md`Cost bears on whether the change was worth paying for, not on whether it caused the fall in thefts; either answer leaves the conclusion unchanged.` },
        { id: 'B', text: md`Whether thefts from parked cars on nearby streets, where the lighting did not change, fell by a similar proportion over the same period`, note: '' },
        { id: 'C', text: md`Whether the council consulted residents of Elm Avenue before replacing the lamps`, note: md`Consultation has no bearing on the cause of the fall in thefts, whatever the answer.` },
        { id: 'D', text: md`Whether more cars are parked on Elm Avenue than on any other street in Garrow`, note: md`The conclusion rests on a change over time on one street; how its number of cars ranks against other streets does not affect that comparison.` },
        { id: 'E', text: md`Whether the new lamps are expected to last longer than the old ones`, note: md`The lamps' lifespan matters for maintenance, not for whether they reduced theft.` },
      ],
      answer: 'B',
      workingMd: md`The gap is causal: thefts fell after the change. If thefts fell just as much on nearby streets with unchanged lighting, something other than the lamps (more patrols, a regional trend) is the likelier cause, and the conclusion weakens. If they did not fall there, the lamps become the best explanation, and the conclusion strengthens. The other options stay neutral under either answer.`,
      lesson: 'For a before-and-after causal claim, the most useful fact is what happened, over the same period, where the cause was absent.',
    },
    {
      id: 'check-film-covers',
      title: 'New covers and higher sales',
      topic: 'Critical Reasoning',
      stimulusMd: md`When a film is made of one of its novels, the publisher Alder and Finch reissues the novel with a cover showing a still from the film. In their first month on sale, these reissued editions sold three times as many copies as the original editions had sold in the previous month. Some bookshops kept selling the original editions alongside the reissues. The publisher concludes that film covers greatly increase sales.`,
      stemMd: md`The answer to which of the following questions would be most helpful in evaluating the publisher's conclusion?`,
      options: [
        { id: 'A', text: md`Did the films follow the plots of the novels closely?`, note: md`How faithful the films were does not tell us whether the cover, rather than the film, drove the extra sales.` },
        { id: 'B', text: md`During the same month, did the original editions still on sale also sell far more copies than before?`, note: '' },
        { id: 'C', text: md`Do the film covers cost more to print than the original covers?`, note: md`Printing cost bears on profit, not on whether the covers increased sales.` },
        { id: 'D', text: md`Had any of the novels won literary prizes before the films were made?`, note: md`Earlier prizes would affect sales under either cover equally, and the answer does not separate the effect of the cover from that of the film.` },
        { id: 'E', text: md`Did the film covers show the films' leading actors?`, note: md`A design detail; whatever the answer, it does not tell us whether film covers in general raised sales.` },
      ],
      answer: 'B',
      workingMd: md`The rival explanation is the film itself: its release could have tripled interest in the novel whatever the cover. If the original editions also sold far more that month, the film is driving sales and the cover effect is doubtful. If the original editions did not rise while the reissues did, the cover looks responsible. The two answers point in opposite directions, so this is the most useful question.`,
      lesson: 'When two changes happen together, the useful question separates them: what happened where only one of them was present?',
    },
    {
      id: 'check-triage-nurses',
      title: 'A plan to cut waiting times',
      topic: 'Critical Reasoning',
      stimulusMd: md`To reduce waiting times in its emergency department, Corran Hospital plans to hire four more triage nurses, who assess patients when they arrive and sort them by urgency. Hospital managers predict that average waiting times will fall.`,
      stemMd: md`Which of the following would be most useful to know in evaluating the managers' prediction?`,
      options: [
        { id: 'A', text: md`Whether hiring four triage nurses costs less than hiring one more doctor`, note: md`A comparison of costs; the prediction is about waiting times, not about which option is cheaper.` },
        { id: 'B', text: md`Whether most of the waiting in the department happens before triage or afterwards, while patients wait to see a doctor`, note: '' },
        { id: 'C', text: md`Whether patients describe the department's current staff as friendly`, note: md`Patients' opinion of the staff has no bearing on whether more triage nurses will shorten waits.` },
        { id: 'D', text: md`Whether other hospitals in the region have longer waiting times than Corran`, note: md`How Corran compares with other hospitals does not affect whether this plan will reduce Corran's own waits.` },
        { id: 'E', text: md`Whether the department treats more adults than children`, note: md`The age mix of patients does not decide whether extra triage capacity shortens the wait, under either answer.` },
      ],
      answer: 'B',
      workingMd: md`More triage nurses speed up the first assessment. If most waiting happens before triage, the plan attacks the real bottleneck and waits should fall. If most waiting happens afterwards, while patients wait for a doctor, faster triage just moves people more quickly into the same queue, and the prediction is in doubt. Opposite answers, opposite effects.`,
      lesson: 'A plan works only if it targets the actual cause of the problem, so the most useful question is where that cause lies.',
    },
  ],
  takeaways: [
    'An evaluate question wants the missing fact that would decide whether the argument holds.',
    'Two-answer test: one answer should strengthen the argument and the other weaken it.',
    'Predict the right option from the gap: it usually asks whether the rival explanation or the obstacle exists.',
    'Cost, opinions and design details are the usual out-of-scope options.',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-critical-reasoning', skill: 'cr-evaluate-argument' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
