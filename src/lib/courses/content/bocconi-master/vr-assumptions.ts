import { md, type Lesson } from '../../types';

/** Bocconi master's, verbal reasoning: the unstated premise and the negation test. */
export const assumptionsLesson: Lesson = {
  slug: 'assumptions',
  title: 'Assumptions: the unstated link and the negation test',
  summary: 'Predict the unstated premise an argument needs, confirm it with the negation test, and reject options that are merely helpful or too strong.',
  minutes: 20,
  objectives: [
    'Predict an argument\'s assumption from the gap between its premises and its conclusion.',
    'Negate an option minimally and decide whether the argument survives.',
    'Tell a required assumption from an option that only helps, goes too far or misses the point.',
  ],
  teachMd: md`
### What an assumption is

An assumption is a premise the author relies on but does not state. The passage is taken as true, so the stated premises are not in doubt; the assumption is the extra, silent claim that links them to the conclusion. If it were false, the reasoning would no longer hold.

Questions about assumptions ask for something the argument **needs**: "Which of the following does the argument assume?", "The conclusion depends on which condition?", "Which must be true for the conclusion to follow?" That is a narrower target than "something that would help". Many options would make the conclusion more likely if true, yet the argument could manage without them.

### Predict from the gap

Start as in [argument structure](/courses/bocconi-master/argument-structure): find the conclusion, find the premises, and name what is new in the conclusion. The assumption is the bridge across that gap. You will rarely predict the exact words, but a rough prediction picks out the right option quickly.

| Gap | What the author must assume |
| --- | --- |
| Correlation to cause | No other factor explains the change; the cause runs the stated way |
| Sample to group | The sample is typical of the group the conclusion is about |
| Plan to goal | The plan can actually do its job; nothing blocks it |
| Term shift | What the premises measure tracks what the conclusion talks about |
| Comparison | The two things compared are alike in the ways that matter |

### The negation test

To check an option, write its **negation**, the smallest change that makes it false, and put it back into the argument.

- If the negated option **breaks** the argument, so that the premises no longer give any reason for the conclusion, the option is a required assumption.
- If the argument **still stands**, perhaps a little weaker, the option is not required.

The test works because a required assumption is, by definition, something whose falsity sinks the argument. It turns a vague feeling ("this seems relevant") into a yes-or-no check.

### Negate minimally

Most errors with the test come from negating too far. The negation must be the plain contradiction, not the opposite extreme.

| Statement | Minimal negation | Not this |
| --- | --- | --- |
| All drivers will obey | Not all drivers will obey (at least one will not) | No driver will obey |
| Most customers prefer chat | Not most prefer chat (half or fewer) | No customer prefers chat |
| Some drivers will slow down | No driver will slow down | Some drivers will not slow down |
| X is the main cause | X is not the main cause | X has no effect |
| A is at least as good as B | A is worse than B | A is better than B |

Notice what the table implies. The negation of a strong claim ("all", "most", "the only") is weak, so it rarely breaks anything. The negation of a modest claim ("some", "at least as", "not entirely") is strong, so it often does. That is why required assumptions are usually worded modestly.

### Defender assumptions

Many assumptions work by ruling something out: there was no other cause, the measurement did not change, the sample was not skewed. These **defender** assumptions are often written as a denial ("The fall was not due to...", "The new system records... at least as completely as the old one"). When an option denies an alternative explanation, test it at once: if that alternative were true, would the argument collapse?

### Wrong-answer patterns

1. **Helpful but not required.** It supports the conclusion, but the argument survives its negation. This is the hardest pattern because the option is on topic.
2. **Too strong.** It claims more than the argument needs ("all", "every", "always", "most"). Its negation leaves room for the argument.
3. **Out of scope.** It talks about something next to the conclusion (cost, popularity, the future) rather than the link the argument relies on.
4. **Restated premise.** It repeats what the passage already says. A stated premise is not an unstated assumption, and its negation would contradict the passage, which you take as true.

### A method that holds up

Find the conclusion and the gap, make a rough prediction, then read every option. Eliminate the out-of-scope and restated options quickly. For the two or three that remain, negate each one minimally and keep the option whose negation breaks the argument.
`,
  examples: [
    {
      id: 'example-term-shift',
      title: 'An assumption across a term shift',
      problemMd: md`"In a guest survey, the Hotel Aurora's rooms were rated the cleanest in the city. The hotel will therefore win this year's city hygiene award, which is decided by inspectors." What does the argument assume?`,
      steps: [
        md`Conclusion: the hotel will win the hygiene award. Premise: guests rated its rooms the cleanest in the city.`,
        md`Name what is new in the conclusion: the award is decided by inspectors, but the evidence is about guests' ratings. The argument shifts from what guests think to what inspectors will decide.`,
        md`Predict the bridge: inspectors' judgement must line up with guests' ratings, at least well enough that the guests' favourite comes out on top.`,
        md`Negation test on the prediction: "the inspectors judge on things guests do not notice, such as kitchens and water systems, where the Aurora does poorly". The guest survey then gives no reason to expect a win, so the prediction is required.`,
      ],
      answerMd: md`The argument assumes that the inspectors' assessment tracks how clean guests find the rooms. An option saying "most guests at the Aurora completed the survey" is tempting but not required: even a modest response rate could reflect the rooms fairly.`,
    },
    {
      id: 'example-negation-two-options',
      title: 'The negation test on two options',
      problemMd: md`"In March, a coffee chain began offering oat milk at no extra charge. Its sales of milky drinks in March were 12% higher than in February. The chain concludes that offering free oat milk raised its sales of milky drinks." Which option is required: (i) "Sales of milky drinks did not rise between February and March for some other reason, such as a seasonal change"; (ii) "Most customers who bought milky drinks in March chose oat milk"?`,
      steps: [
        md`Gap: a rise after a change is taken as a rise because of the change (correlation to cause). Predict a defender: nothing else caused the rise.`,
        md`Negate (i): "Sales did rise for some other reason, such as a seasonal change." Then the 12% could be entirely seasonal, and the timing gives no reason to credit the oat milk. The argument breaks, so (i) is required.`,
        md`Negate (ii): "Half or fewer of the March milky-drink buyers chose oat milk." The rise could still come from oat-milk drinkers: if a modest number of new customers came for free oat milk, sales could grow 12% without oat milk being the majority choice. The argument survives, so (ii) is not required.`,
      ],
      answerMd: md`Option (i) is the required assumption. Option (ii) is the tempting wrong answer: it sounds supportive, but its wording ("most") is far stronger than the argument needs, and its negation does no damage.`,
    },
    {
      id: 'example-plan',
      title: 'A plan and the modest assumption it needs',
      problemMd: md`"Students who visit the university writing centre at least three times in a term earn higher essay marks than those who do not. The university therefore plans to require every first-year student to visit the centre three times, to raise first-year essay marks." What must the planners assume?`,
      steps: [
        md`Conclusion: the requirement will raise first-year essay marks. Premise: students who choose to visit three times earn higher marks.`,
        md`Name the gap: the students who visit now chose to go. Perhaps they are simply more motivated, and would earn higher marks anyway. The plan needs the visits themselves to help.`,
        md`Predict modestly: the higher marks are at least partly caused by the visits, not entirely by the kind of student who chooses to visit.`,
        md`Negate it: "the higher marks are entirely due to the type of student who chooses to visit". Then forcing everyone to visit would not change marks, and the plan's reasoning breaks. Compare a stronger version, "the visits are the main reason for the higher marks": its negation (they are not the main reason) still allows the visits to help somewhat, so it is not required.`,
      ],
      answerMd: md`The planners assume the visits cause at least some of the improvement. The tempting wrong answer is the stronger "the visits are the main reason", which goes beyond what the plan needs.`,
    },
  ],
  traps: [
    {
      title: 'Choosing what helps instead of what is needed',
      md: md`An option can make the conclusion more likely and still not be required. Always run the negation test on your favourite option: if the argument survives its negation, it is not an assumption, however supportive it sounds.`,
    },
    {
      title: 'Negating to the opposite extreme',
      md: md`The negation of "all students passed" is "at least one did not", not "none passed". Negating to the extreme makes too many options look required. Write the plain contradiction, the smallest change that makes the statement false.`,
    },
    {
      title: 'Falling for strong wording',
      md: md`"All", "every", "most", "only" and "always" make an option claim more than the argument needs. Its negation then leaves the argument standing. Strong wording is not automatically wrong, but negate it with extra care.`,
    },
    {
      title: 'Picking a restated premise',
      md: md`An option that repeats the passage feels safe because it is clearly true. But an assumption is unstated by definition. If the option is already in the passage, it is not the answer to an assumption question.`,
    },
  ],
  check: [
    {
      id: 'check-helpline',
      title: 'Complaints and satisfaction',
      topic: 'Verbal critical reasoning',
      stemMd: md`Ravello Foods moved its customer helpline from a telephone call centre to an online chat service. In the first quarter after the switch, the number of customer complaints the company recorded fell by 30% compared with the quarter before. The company's director concludes that customers are more satisfied with the chat service than they were with the telephone line.

The director's conclusion depends on which of the following assumptions?`,
      options: [
        { id: 'A', text: md`Most of the company's customers prefer typing to speaking on the phone.`, note: md`Too strong and not needed. Negated ("half or fewer prefer typing"), the argument can still work: customers might be more satisfied because chat replies are quicker, whatever their general preference.` },
        { id: 'B', text: md`The chat service records customer complaints at least as completely as the call centre recorded them.`, note: '' },
        { id: 'C', text: md`Running the chat service costs the company less than running the call centre.`, note: md`Cost is out of scope. The conclusion is about customer satisfaction, and the argument says nothing that depends on what either service costs.` },
        { id: 'D', text: md`The number of recorded complaints will keep falling in later quarters.`, note: md`The conclusion is about the quarter already observed. If complaints levelled off later, that would not undo the evidence from the first quarter, so the argument does not need it.` },
      ],
      answer: 'B',
      workingMd: md`The evidence is about recorded complaints; the conclusion is about satisfaction. The bridge is that the fall in recorded complaints reflects a real fall in dissatisfaction rather than a change in how complaints are captured. Negate the option about recording: "the chat service records complaints less completely than the call centre did". Then the 30% fall could be nothing more than complaints going unrecorded, and the evidence no longer supports the conclusion. That option is required. The other three survive their negations or are about something else.`,
      lesson: 'When the evidence is a measurement, the argument usually assumes the way of measuring did not change.',
    },
    {
      id: 'check-speed-limit',
      title: 'A plan to cut fatal crashes',
      topic: 'Verbal critical reasoning',
      stemMd: md`The town of Verlo will lower the speed limit on its ring road from 70 km/h to 50 km/h. Since drivers travelling at lower speeds have more time to react to hazards, the town council expects fewer fatal crashes on the ring road as a result.

Which of the following is an assumption on which the council's expectation depends?`,
      options: [
        { id: 'A', text: md`Every driver on the ring road will obey the new limit.`, note: md`Too strong. Negated, it becomes "at least one driver will not obey". If most drivers still slow down, the council's reasoning holds, so full obedience is not required.` },
        { id: 'B', text: md`Lowering speed limits has reduced fatal crashes in other towns.`, note: md`Helpful but not required. Negated ("it has not done so elsewhere"), the council's own reasoning about reaction time still stands; evidence from other towns would only add support.` },
        { id: 'C', text: md`At least some drivers on the ring road will drive more slowly once the limit is lowered.`, note: '' },
        { id: 'D', text: md`Most of Verlo's fatal crashes happen on the ring road.`, note: md`The conclusion is only about crashes on the ring road. Even if most of the town's fatal crashes happen elsewhere, fewer ring-road crashes can still follow, so the argument survives the negation.` },
      ],
      answer: 'C',
      workingMd: md`The premise is about drivers at lower speeds; the plan only changes the limit. The bridge is that the new limit will in fact lower some drivers' speeds. Negate that option: "no driver will drive more slowly". Then nobody gains extra reaction time, and the reasoning collapses. The other options either demand more than the plan needs (every driver), add outside support (other towns), or concern crashes outside the ring road, which the conclusion does not cover.`,
      lesson: 'A plan assumes it will actually change behaviour, but usually only for some people, not all.',
    },
    {
      id: 'check-safety-quiz',
      title: 'A quiz before the lab',
      topic: 'Verbal critical reasoning',
      stemMd: md`This year, Arden College's chemistry department requires every first-year student to complete an online safety quiz before their first laboratory session, and the laboratory door admits only students whose quiz is recorded as complete. The department concludes that no first-year student will begin laboratory work this year without having seen the laboratory's safety rules.

The department's conclusion depends on which of the following assumptions?`,
      options: [
        { id: 'A', text: md`A student cannot complete the quiz without being shown the laboratory's safety rules.`, note: '' },
        { id: 'B', text: md`Most students will remember the safety rules for the rest of the year.`, note: md`The conclusion is about having seen the rules before starting, not about remembering them later, so this is out of scope.` },
        { id: 'C', text: md`Every first-year student will pass the quiz on the first attempt.`, note: md`Not required. A student who fails and retakes the quiz still sees the rules before entering; the argument survives if some students need several attempts.` },
        { id: 'D', text: md`Students who have not completed the quiz will not try to enter the laboratory.`, note: md`Not needed: the passage already says the door admits only students whose quiz is complete, so whether others try to enter makes no difference.` },
      ],
      answer: 'A',
      workingMd: md`The premises guarantee that every first-year student in the laboratory has completed the quiz. The conclusion is about having seen the safety rules. The bridge is that completing the quiz involves being shown the rules. Negate it: "a student can complete the quiz without being shown the rules". Then a student could get through the door without having seen them, and the conclusion fails. The other options concern memory, first-attempt passes or attempts to enter, none of which the conclusion needs.`,
      lesson: 'When the premises guarantee one thing and the conclusion claims another, the assumption is that the first brings the second with it.',
    },
  ],
  takeaways: [
    'An assumption is an unstated premise the argument needs, not just one that would help.',
    'Predict it from the gap, then confirm it with the negation test.',
    'Negate minimally: "not all", not "none"; "none", not "some are not".',
    'Required assumptions are usually worded modestly; strong wording is a warning sign.',
    'Restated premises, out-of-scope points and too-strong claims are the usual wrong options.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-verbal-reasoning', skill: 'grad-verbal-argument-analysis' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
