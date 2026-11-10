import { md, type Lesson } from '../../types';

const fourDayPassage = md`
**[1]** Trials of a four-day working week have produced striking headlines: participating firms report steady output and happier staff. Advocates conclude that a shorter week would pay for itself across the whole economy.

**[2]** The trials deserve attention, but their design limits what they can show. Firms chose to take part, so they were likely to be those that expected the change to suit them. Staff, for their part, knew the trial would be judged on output, which may have raised their effort for its duration.

**[3]** Neither point proves the advocates wrong. Both mean that the trials tell us what happens in willing firms over a few months, not what would happen if every employer had to adopt the policy. A trial in which firms were assigned at random, and observed for longer, would settle far more.
`;

export const mainIdeaAndAuthorPurposeLesson: Lesson = {
  slug: 'main-idea-and-author-purpose',
  title: 'Main idea, author’s purpose and tone',
  summary: 'Find the claim a whole passage serves, name the author’s purpose with the right verb, and judge tone without overstating it.',
  minutes: 18,
  objectives: [
    'State a passage’s main idea in one sentence and test options against it for scope and strength.',
    'Choose the verb that matches the author’s purpose: describe, explain, argue, evaluate, challenge or propose.',
    'Judge the author’s attitude from hedges, concessions and evaluative words.',
  ],
  teachMd: md`
### The main idea is what the whole passage serves

The main idea is the single claim that every paragraph helps to establish. It is not the first sentence, the most striking fact, or the topic. "Four-day weeks" is a topic; "the trials of four-day weeks cannot support the economy-wide conclusion drawn from them" is a main idea. A topic names what the passage is about; a main idea says what the passage says about it.

In passages that argue, the main idea is usually the author's position, and it tends to sit after the turn ("but", "yet", "however") or in the conclusion. A first paragraph that reports a common view is often the view the author is about to qualify, so do not lift the main idea from the opening sentence without reading on.

### Testing an option: scope and strength

Write your own one-sentence main idea before you read the options, then test each one with two questions.

**Scope: does it cover the whole passage, and only the passage?**

- *Too narrow*: it states the point of one paragraph, or one piece of evidence. It is true, and it is in the passage, which is what makes it tempting.
- *Too broad*: it makes a claim about a wider subject than the passage covers ("working practices across Europe" for a passage about one set of trials).

**Strength: does it say what the author says, as strongly as the author says it?**

- *Overstated*: the author says the evidence is limited, the option says the policy is wrong.
- *Reversed*: the option states the view the author criticises.
- *Understated*: the option is so hedged that it drops the author's actual claim.

A good main-idea option survives both tests. The usual wrong answers fail one of them: a detail fails scope, a distortion fails strength.

### Purpose: pick the verb first

Purpose questions ("the primary purpose of the passage is to…") are main-idea questions with a verb attached. The verb carries most of the marks, so decide it before reading the options.

| Verb | Use it when the author… |
| --- | --- |
| describe | sets out what something is or what happened, without judging it |
| explain | shows how or why something works or happens, without judging it |
| compare | sets two or more things side by side |
| argue, propose | takes a position, or recommends a course of action |
| evaluate, assess | weighs strengths and weaknesses of a claim, policy or piece of evidence |
| challenge, question | disputes a claim or an interpretation |

The test for the verb is evaluative language. If the passage contains words like "should", "would do better", "overstated", "limits what they can show", the author is doing more than describing, and "describe" or "explain" will be too weak. If it contains none, "argue" and "criticise" are too strong. Then check the object of the verb: "to assess the evidence for a policy" and "to assess the policy" are different purposes.

The same tests apply to the purpose of a single paragraph, using the paragraph's role from your passage map.

### Tone and attitude: degree matters

Tone questions ask how the author regards something. Place the author on a scale before you look at the options:

strong rejection, measured scepticism, neutral, qualified support, enthusiasm.

Hedges ("may", "likely", "seems") and concessions ("this does not mean", "deserves attention") pull the author towards the middle. Most argumentative passages sit at **measured scepticism** or **qualified support**, because careful writers concede something. Extreme words in an option ("contempt", "dismissive", "unreserved") need equally extreme language in the passage; if you cannot point to it, eliminate the option. "Indifferent" is rarely right for an author who has bothered to write an argument.

### "The author would most likely agree"

These questions apply the main idea. The right option follows from the author's position at the author's strength. An option that matches the topic but goes beyond the author ("the trials prove the policy would fail") is as wrong as one that contradicts the author.

### A routine (ours)

1. Map the paragraphs.
2. Write the main idea in one sentence, starting with the author's verb: "The author argues that…" or "The author explains how…".
3. For each option, ask: right scope? right strength? right verb?
4. Choose the option that survives all three, even if another sounds more striking.
`,
  examples: [
    {
      id: 'example-main-idea-forecasts',
      title: 'Narrow, broad, distorted or right?',
      problemMd: md`**[1]** For a long time, many central banks said little about where they expected interest rates to go, on the view that surprise made their decisions more powerful.

**[2]** Some have since begun to publish their own forecasts of future rates. The change rests on a different view: if households and firms understand what the bank intends, long-term borrowing costs start moving in the intended direction before the bank acts.

**[3]** Publishing has a cost. When events force a bank to abandon a published path, critics read the change as a broken promise, and the bank's words may count for less next time. The banks that publish have accepted that risk because they judge that being understood is worth more than being unpredictable.

Which is the main idea? (i) Publishing forecasts can damage a central bank's credibility. (ii) Central banks have changed many of their tools in recent decades. (iii) Some central banks now publish rate forecasts, judging that being understood outweighs the risk to credibility. (iv) Central banks now regard surprise as harmful.`,
      steps: [
        md`Map: P1, the old view (surprise is powerful); P2, the change and the reasoning behind it; P3, the cost and why banks accept it.`,
        md`Own main idea: some banks moved from silence to publishing forecasts because they value being understood more than surprise, while accepting a credibility risk.`,
        md`(i) is the point of paragraph 3 only: too narrow. (ii) speaks of "many tools" when the passage discusses one: too broad.`,
        md`(iv) overstates: the banks judge understanding to be worth *more* than unpredictability, which does not make surprise harmful. And it says "central banks" when the passage says "some".`,
        md`(iii) covers all three paragraphs at the passage's own strength.`,
      ],
      answerMd: md`The main idea is (iii). The tempting wrong answer is (i), because it is true and stated in the passage, but it is only the last paragraph's point.`,
    },
    {
      id: 'example-purpose-verb',
      title: 'Explain or argue?',
      problemMd: md`A tax on sugary drinks can be designed in two ways. A tax on volume charges the same amount per litre whatever the sugar content, so it raises prices but gives producers no reason to change their recipes. A tax in sugar bands charges more for drinks above set thresholds, so a producer that cuts sugar below a threshold pays less. Which design a government chooses depends on whether its main aim is revenue or reformulation.

What is the primary purpose of the passage?`,
      steps: [
        md`Look for evaluative language: "should", "better", "unfortunately", "flawed". There is none. The last sentence says what the choice depends on, not which choice is right.`,
        md`So the verb is "explain" (how each design works and what the choice depends on), possibly "compare". It is not "argue for" either design.`,
        md`Check the object: the passage is about two designs of one tax, not about whether to tax sugary drinks at all.`,
      ],
      answerMd: md`The purpose is to explain how two designs of a sugar tax differ in effect and what the choice between them depends on. The tempting wrong answer is "to argue for a banded tax": the banded design sounds more effective, but the author never says it is better.`,
    },
    {
      id: 'example-tone-degree',
      title: 'Placing an attitude on the scale',
      problemMd: md`An author writes about a plan to move a city's bus depot: "The plan is not without merit, and the council has consulted widely. Its costs, however, have been understated, and the savings it promises rest on traffic forecasts that have been wrong before." Which word best describes the author's attitude to the plan: enthusiastic, indifferent, sceptical or hostile?`,
      steps: [
        md`Collect the evaluative words: "not without merit" and "consulted widely" are concessions; "understated" and "wrong before" are criticisms.`,
        md`The criticisms come after "however" and are more specific, so they carry more weight: the author leans against the plan.`,
        md`The concessions rule out the extreme: an author who is hostile does not credit the plan's merits or the consultation. Enthusiastic is contradicted by the criticisms; indifferent by the fact that the author takes a side.`,
      ],
      answerMd: md`Sceptical: critical, but measured by real concessions. "Hostile" is the tempting overstatement; it would need language such as "reckless" or "indefensible".`,
    },
  ],
  traps: [
    {
      title: 'The true but narrow option',
      md: md`The most tempting wrong main-idea option is a sentence the passage really says, taken from one paragraph. Ask whether the other paragraphs serve it; if two of three paragraphs are about something else, it is a detail, not the main idea.`,
    },
    {
      title: 'Taking the opening view as the author’s',
      md: md`Passages often open with a claim made by others ("advocates conclude", "it is widely believed"). If the next paragraph turns against it, the opening claim is what the author is arguing about, not what the author argues.`,
    },
    {
      title: 'Wrong verb, right topic',
      md: md`"To describe the four-day trials" names the right topic with too weak a verb if the author evaluates them; "to reject the four-day week" names it with too strong a verb. Settle the verb from the evaluative language before reading the options.`,
    },
    {
      title: 'Extreme tone words',
      md: md`Options such as "contemptuous", "dismissive" or "unqualified praise" are rarely right because careful authors hedge and concede. Choose an extreme word only if you can point to equally extreme language in the passage.`,
    },
  ],
  check: [
    {
      id: 'check-four-day-main-idea',
      title: 'The main idea',
      topic: 'Reading comprehension',
      stimulusMd: fourDayPassage,
      stemMd: md`Which of the following best expresses the main idea of the passage?`,
      options: [
        { id: 'A', text: md`Trials show that a four-day week raises firms' output.`, note: md`The trials reported steady output, not higher output, and the author treats them as limited evidence, not proof.` },
        { id: 'B', text: md`Firms that took part in the trials were chosen unfairly.`, note: md`Too narrow and distorted: the firms chose themselves, and this is one point of the second paragraph, not what the whole passage serves.` },
        { id: 'C', text: md`The trials' design means they cannot support the economy-wide conclusion drawn from them, and better trials are needed.`, note: '' },
        { id: 'D', text: md`A four-day week would harm the economy if every employer had to adopt it.`, note: md`Overstated: the author says the trials cannot tell us what would happen economy-wide, which is not a prediction of harm.` },
      ],
      answer: 'C',
      workingMd: md`Map: P1, the trials' results and the advocates' economy-wide conclusion; P2, two design limits (self-selection, effort during the trial); P3, these limits do not prove the advocates wrong but restrict what the trials show, and a randomised, longer trial would settle more. The main idea joins P2 and P3: the evidence does not reach the conclusion drawn from it.`,
      lesson: 'A main-idea option must cover every paragraph at the author’s own strength.',
    },
    {
      id: 'check-four-day-purpose',
      title: 'The primary purpose',
      topic: 'Reading comprehension',
      stimulusMd: fourDayPassage,
      stemMd: md`The primary purpose of the passage is to`,
      options: [
        { id: 'A', text: md`dismiss the four-day week as a passing fashion`, note: md`Too strong: the author says the trials deserve attention and that the points raised do not prove the advocates wrong.` },
        { id: 'B', text: md`describe how the four-day week trials were organised`, note: md`Too weak: the author evaluates the trials' design and what it allows us to conclude, rather than only describing it.` },
        { id: 'C', text: md`compare the four-day week with other ways of improving staff well-being`, note: md`Out of scope: no other way of improving well-being is mentioned.` },
        { id: 'D', text: md`assess what a set of trials can and cannot show about a policy`, note: '' },
      ],
      answer: 'D',
      workingMd: md`The passage contains evaluative language ("their design limits what they can show", "would settle far more"), so the verb is stronger than "describe". It concedes the advocates may be right, so it is weaker than "dismiss". Its object is the evidence, the trials, more than the policy itself: the author assesses what the trials can show.`,
      lesson: 'Choose the verb from the evaluative language, then check its object.',
    },
    {
      id: 'check-four-day-attitude',
      title: 'The author’s attitude',
      topic: 'Reading comprehension',
      stimulusMd: fourDayPassage,
      stemMd: md`The author's attitude towards the advocates' conclusion is best described as`,
      options: [
        { id: 'A', text: md`measured scepticism`, note: '' },
        { id: 'B', text: md`outright rejection`, note: md`The author says plainly that neither point proves the advocates wrong, which rules out rejection.` },
        { id: 'C', text: md`enthusiastic agreement`, note: md`The author spends a paragraph on reasons the trials cannot support the conclusion; that is doubt, not agreement.` },
        { id: 'D', text: md`indifference`, note: md`The author takes a position and even proposes a better trial; indifference would not do either.` },
      ],
      answer: 'A',
      workingMd: md`The author doubts that the trials support the conclusion (design limits, "not what would happen if every employer had to adopt the policy") but concedes the trials deserve attention and that the advocates are not proved wrong. Doubt held with concessions is measured scepticism.`,
      lesson: 'Concessions pull an attitude towards the middle of the scale; extremes need extreme language.',
    },
  ],
  takeaways: [
    'The main idea is the claim every paragraph serves, not the topic and not the first sentence.',
    'Wrong main-idea options fail on scope (too narrow, too broad) or on strength (overstated, reversed).',
    'Decide the purpose verb from the evaluative language before reading the options.',
    'Hedges and concessions put most authors at measured scepticism or qualified support.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-verbal-reasoning', skill: 'grad-verbal-passage-reasoning' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
