import { md, type Lesson } from '../../types';

/** Bocconi master's, verbal reasoning: the parts of an argument and the gap between them. */
export const argumentStructureLesson: Lesson = {
  slug: 'argument-structure',
  title: 'Argument structure: conclusion, premises and the gap',
  summary: 'Find the conclusion of a short argument, sort premises from background and opposing views, and name the gap every critical reasoning question turns on.',
  minutes: 18,
  objectives: [
    'Find the main conclusion of a short argument wherever it sits in the passage.',
    'Label each sentence as premise, intermediate conclusion, background or opposing view.',
    'State the gap between the evidence and the conclusion in one sentence.',
  ],
  teachMd: md`
### Why structure comes first

Bocconi lists verbal critical reasoning as one of the three item types in verbal reasoning: a short passage, then a question such as which condition would best support the thesis, and you should assume the passage is true. Whatever the question asks (support, attack, an assumption, a flaw), you cannot answer it until you know what the author is trying to prove and what they offer as proof. Reading for structure is the skill under every later lesson in this unit.

An argument has two kinds of parts:

- the **conclusion**: the claim the author wants you to accept;
- the **premises**: the reasons given for accepting it.

Everything else in the passage is scenery: background that sets the scene, a view the author rejects, or a concession the author makes before pushing on.

### Finding the conclusion

The conclusion is often, but not always, the last sentence. Three tools find it wherever it is.

**Indicator words.** "So", "therefore", "thus", "hence", "it follows that", "this shows that" and "should" often introduce a conclusion. "Because", "since", "given that", "for" and "as shown by" introduce premises. Indicators are useful but not reliable: a passage may have none, or may use "so" inside a premise.

**The "why should I believe that?" test.** Pick a candidate sentence and ask why you should believe it. If other sentences in the passage answer that question, the candidate is a conclusion. If nothing in the passage answers it, the sentence is a premise or background: the author simply states it.

**The "therefore" test.** Put the candidate last and join the other sentences to it with "therefore". If the result reads naturally ("the market loses customers on match days; the car park is empty on Sundays; therefore the market should move to Sunday"), you have found it. If it reads backwards, try another sentence.

Conclusions are usually claims that go beyond fact: recommendations ("should"), predictions ("will"), explanations ("this is why") or judgements ("is overstated", "is the best option"). A sentence that only reports a number or an event is more often a premise.

### Intermediate conclusions

Longer arguments run in a chain. A premise supports a claim, and that claim then supports the final point. The middle claim is an **intermediate conclusion**: it is supported by something and also supports something. Ask of every claim both questions: "Is it supported here?" and "Does it support something else here?" The **main conclusion** is the one claim that is supported but supports nothing further.

| Supported in the passage? | Supports another claim? | Role |
| --- | --- | --- |
| No | Yes | Premise |
| Yes | Yes | Intermediate conclusion |
| Yes | No | Main conclusion |
| No | No | Background, or a view the author does not hold |

### Opposing views and concessions

Many short arguments open with someone else's position: "Critics claim...", "Some argue...", "It is often said...". The author then answers it with "but", "however" or "yet". The opening view is not the author's conclusion; it is the target. The author's conclusion is usually the rejection of that view, or the alternative they propose.

A **concession** works the other way: the author admits a point against their own side ("even though the price per kilo is higher", "admittedly, a few users will struggle") and then argues that the conclusion holds anyway. A concession is neither a premise nor the conclusion.

### The gap

Once you have the conclusion and the premises, compare them. The premises almost never prove the conclusion outright: the conclusion contains something new, a word or idea the premises do not cover. That difference is the **gap**. In one sentence: "The author goes from [what the premises establish] to [what the conclusion claims]."

Typical gaps:

- from a **correlation** to a **cause** (two things happened together, so one caused the other);
- from a **sample** to a **whole group** (the people surveyed stand for everyone);
- from a **plan** to its **goal** (the plan will work as intended);
- from one **term** to a different one (visit length to sales, complaints to satisfaction).

Every question type in the next lessons works on the gap. An [assumption](/courses/bocconi-master/assumptions) bridges it. A [strengthener](/courses/bocconi-master/strengthen-and-weaken) narrows it, a weakener widens it, and a [flaw](/courses/bocconi-master/flaws-and-evaluation) names it. Time spent naming the gap before you read the options is time saved on every option.

### Assume the passage is true

The premises are given. Your job is not to doubt them but to judge whether they lead to the conclusion. A strong argument is one where the gap is small, not one whose facts you happen to agree with.
`,
  examples: [
    {
      id: 'example-conclusion-first',
      title: 'A conclusion in the first sentence',
      problemMd: md`"The town's Saturday farmers' market should move to Sunday morning. On Saturdays it competes with the stadium's home games for the only nearby car park, and stallholders say their takings fall by about a third on match days. On Sunday mornings the car park is nearly empty." Which sentence is the main conclusion?`,
      steps: [
        md`Look for indicators: there is no "so" or "therefore", but the first sentence contains "should", a recommendation.`,
        md`Apply the "why should I believe that?" test to the first sentence: why should the market move? The next two sentences answer it (parking competition and lost takings on Saturdays, an empty car park on Sundays).`,
        md`Apply the "therefore" test: "It competes for parking on Saturdays; takings fall on match days; the car park is empty on Sundays; therefore the market should move to Sunday morning." It reads naturally.`,
        md`Check the other sentences: nothing in the passage supports the claim about falling takings or the empty car park. They are premises.`,
      ],
      answerMd: md`The main conclusion is the first sentence: the market should move to Sunday morning. The tempting wrong answer is the last sentence, chosen only because conclusions are often last.`,
    },
    {
      id: 'example-chain',
      title: 'A chain with an intermediate conclusion',
      problemMd: md`"The new ferry timetable adds a 7:10 departure from Lake Village, so commuters from the village can now reach the business district before 8:00. Houses in the village should therefore become more attractive to people who work in the district, and local estate agents can expect more enquiries this spring." Label each claim.`,
      steps: [
        md`List the claims: (1) a 7:10 departure is added; (2) commuters can reach the district before 8:00; (3) village houses become more attractive to district workers; (4) estate agents can expect more enquiries.`,
        md`Ask of each claim whether it is supported here. Claim 1 is simply stated. Claim 2 is supported by claim 1 ("so"). Claim 3 is supported by claim 2 ("therefore"). Claim 4 is supported by claim 3.`,
        md`Ask whether each supports something else. Claims 1, 2 and 3 each support the next; claim 4 supports nothing further.`,
        md`Use the table: claim 1 is a premise, claims 2 and 3 are intermediate conclusions, claim 4 is the main conclusion.`,
      ],
      answerMd: md`The main conclusion is that estate agents can expect more enquiries. The tempting wrong answer is claim 3, which follows "therefore" but is then used to support the prediction about enquiries.`,
    },
    {
      id: 'example-gap',
      title: 'Naming the gap',
      problemMd: md`"In the six months since a bookshop chain put reading armchairs in its shops, the average length of a customer's visit has risen from 14 to 22 minutes. The chain's managers conclude that the armchairs will raise the chain's sales." State the gap in one sentence.`,
      steps: [
        md`Conclusion: the armchairs will raise sales (a prediction). Premise: visits have become longer since the armchairs arrived.`,
        md`Look for what is new in the conclusion: the premise is about time spent in the shop; the conclusion is about sales. Nothing in the passage connects the two.`,
        md`There is a second, smaller gap: the premise reports that visits grew longer after the armchairs appeared, and the managers credit the armchairs with it.`,
        md`Write it in one sentence: "The managers go from 'visits got longer after the armchairs arrived' to 'the armchairs will make people buy more'."`,
      ],
      answerMd: md`The main gap is from visit length to sales: longer visits might be spent reading books without buying them. Any option about whether longer visits lead to more purchases goes straight to the heart of the argument; an option about how comfortable the armchairs are does not.`,
    },
  ],
  traps: [
    {
      title: 'Picking the last sentence by habit',
      md: md`Conclusions often come last, so readers stop looking once they reach the end. A passage may open with its thesis and spend the rest on evidence, as in the farmers' market example. Always run the "therefore" test on your candidate instead of trusting its position.`,
    },
    {
      title: 'Taking the opposing view for the author\'s',
      md: md`"Critics say the plan will fail" is a sentence about the critics, not the author's conclusion. The word that follows ("but", "however", "yet") usually signals the author's own position. Ask whose claim each sentence is before you label it.`,
    },
    {
      title: 'Stopping at an intermediate conclusion',
      md: md`A sentence after "therefore" can still support a further claim. If it does, it is an intermediate conclusion and the main conclusion lies beyond it. Check whether your candidate supports anything else in the passage.`,
    },
    {
      title: 'Judging the facts instead of the reasoning',
      md: md`You may think a premise is unlikely, but you must take the passage as true. An option or an answer that depends on doubting a premise misses the task, which is to judge whether the premises lead to the conclusion.`,
    },
  ],
  check: [
    {
      id: 'check-bus-tickets',
      title: 'The main conclusion',
      topic: 'Verbal critical reasoning',
      stemMd: md`A regional bus company plans to replace its paper tickets with a phone app. Critics say older passengers will be left out. However, the company's own survey found that nine in ten regular passengers over 65 already use a smartphone, and the company will keep selling paper tickets at its two main stations. The critics' worry is therefore overstated.

Which of the following best states the main conclusion of the argument?`,
      options: [
        { id: 'A', text: md`The bus company plans to replace paper tickets with a phone app.`, note: md`This is background that sets the scene; nothing in the passage argues for it, and the author's point is about the critics, not the plan itself.` },
        { id: 'B', text: md`Nine in ten regular passengers over 65 already use a smartphone.`, note: md`This is a premise: it answers "why is the worry overstated?" and is not itself supported by anything in the passage.` },
        { id: 'C', text: md`The concern that older passengers will be left out is exaggerated.`, note: '' },
        { id: 'D', text: md`Paper tickets should remain on sale at every station.`, note: md`The passage says paper tickets will stay at two main stations as a fact; it never argues that they should be sold everywhere.` },
      ],
      answer: 'C',
      workingMd: md`Ask of each claim whether the passage supports it. The survey result and the paper tickets at two stations are stated, not supported: they are premises. The critics' view is the target, introduced by "Critics say" and answered with "However". The last sentence, after "therefore", is supported by both premises and supports nothing further, so it is the main conclusion: the critics' worry about older passengers is overstated. The option that restates this in other words is the answer.`,
      lesson: 'The main conclusion is the claim that is supported in the passage and supports nothing further; the critics\' view is what it answers.',
    },
    {
      id: 'check-canteen-role',
      title: 'The role of a claim',
      topic: 'Verbal critical reasoning',
      stemMd: md`Lindmark school's canteen now buys its vegetables from farms within 50 km. Because the vegetables travel a shorter distance, they arrive fresher. Fresher vegetables keep longer, so less of each delivery is thrown away. The canteen should therefore be able to order smaller quantities, and its total spending on vegetables should fall, even though the price per kilo is slightly higher.

In the argument, the claim that less of each delivery is thrown away plays which role?`,
      options: [
        { id: 'A', text: md`It is the main conclusion of the argument.`, note: md`The claim is used to support something further (smaller orders and lower spending), so it cannot be the main conclusion.` },
        { id: 'B', text: md`It is a premise offered without any support.`, note: md`The passage does support it: fresher vegetables keep longer, "so" less is thrown away.` },
        { id: 'C', text: md`It is a consideration the author concedes against the conclusion.`, note: md`The concession is the higher price per kilo. Less waste counts in favour of the conclusion, not against it.` },
        { id: 'D', text: md`It is supported by other claims and is used in turn to support the main conclusion.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Trace the chain: shorter distance leads to fresher vegetables; fresher vegetables keep longer, so less is thrown away; less waste means the canteen can order smaller quantities, so total spending should fall. The claim about waste is supported (by "fresher vegetables keep longer") and supports a further claim (smaller orders and lower spending). A claim that is both supported and supporting is an intermediate conclusion. The higher price per kilo is the concession, and lower total spending is the main conclusion.`,
      lesson: 'Ask of every claim whether it is supported here and whether it supports something else; yes to both makes it an intermediate conclusion.',
    },
    {
      id: 'check-cycle-lane',
      title: 'The role of the opening sentence',
      topic: 'Verbal critical reasoning',
      stemMd: md`Some residents of Porto Lino oppose the planned cycle lane on Via Mare because, they say, it will remove parking spaces and drive shoppers away. Yet when the neighbouring town of Castelbruno opened a similar lane on its main shopping street, shop takings there rose in the following year. The council should go ahead with the Via Mare lane.

The first sentence of the argument does which of the following?`,
      options: [
        { id: 'A', text: md`It states the conclusion the author argues for.`, note: md`The author's conclusion is the last sentence, that the council should go ahead; the first sentence reports the opposite view.` },
        { id: 'B', text: md`It states a position that the author argues against.`, note: '' },
        { id: 'C', text: md`It provides evidence in support of the author's conclusion.`, note: md`The residents' worry points against building the lane; it is the view the Castelbruno evidence is offered to answer, not support for the author.` },
        { id: 'D', text: md`It states an assumption on which the author's argument depends.`, note: md`The author's argument does not need the residents' claim to be true; it is offered to be rejected, and "Yet" marks the turn against it.` },
      ],
      answer: 'B',
      workingMd: md`The last sentence is a recommendation ("should") supported by the Castelbruno evidence, so it is the author's conclusion. The first sentence reports what some residents believe, and "Yet" introduces evidence against that belief. The first sentence is therefore the opposing view: a position the author argues against.`,
      lesson: 'A sentence that opens with someone else\'s view and is followed by "yet" or "however" is usually the target, not the conclusion.',
    },
  ],
  takeaways: [
    'Find the conclusion with the "why should I believe that?" and "therefore" tests, not by its position.',
    'A claim that is supported and also supports another claim is an intermediate conclusion.',
    'Opposing views and concessions are neither premises nor the conclusion.',
    'Name the gap between premises and conclusion in one sentence before reading the options.',
    'Take the premises as true; judge only whether they lead to the conclusion.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-verbal-reasoning', skill: 'grad-verbal-argument-analysis' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
