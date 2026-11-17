import { md, type Lesson } from '../../types';

/**
 * IMAT course, unit "logic": critical thinking (arguments, assumptions,
 * strengthening, weakening and flaws) and problem solving (numerical problems,
 * sequences and puzzles). Italian version: ./it/logic.ts.
 */

export const argumentsConclusionsAndAssumptionsLesson: Lesson = {
  slug: 'arguments-conclusions-and-assumptions',
  title: 'Arguments, conclusions and assumptions',
  summary: 'Find the main conclusion of a short argument, tell it apart from its reasons, and name the unstated assumption the reasoning depends on.',
  minutes: 20,
  objectives: [
    'Separate the premises, the intermediate conclusion and the main conclusion of a short argument.',
    'Locate the gap between the evidence and the conclusion before reading the options.',
    'Use the negation test to tell a necessary assumption from a statement that is merely helpful or too strong.',
  ],
  teachMd: md`
### What an argument is

An argument is a group of claims in which some claims, the **premises**, are offered as reasons for another claim, the **conclusion**. A passage may also contain background: facts that set the scene but are not offered as reasons for anything. A list of facts with no "so" in it is a description, not an argument.

The logical reasoning area of the IMAT is 5 of the 60 questions. Critical-thinking questions of the kind practised here give you a short passage and ask what it concludes, what it takes for granted, or how well its reasons support it. Every one of those tasks starts with the same skill: seeing which claim is the point and which claims are the support.

### Finding the conclusion

Indicator words help. "Therefore", "so", "thus", "hence", "it follows that" and "which shows that" usually come before a conclusion; "because", "since", "given that" and "as" usually come before a premise. Conclusions are often recommendations ("the hospital should…"), predictions ("cases will fall") or general claims ("exercise lowers blood pressure").

Indicators can be missing, so use the **therefore test**. Take two claims, join them with "therefore" in both orders, and keep the order that reads as reasoning. "Staff clean their hands more often, therefore infections passed by touch should fall" makes sense; "infections should fall, therefore staff clean their hands more often" does not. The claim after the working "therefore" is the conclusion of that step.

### Main and intermediate conclusions

Longer passages chain their reasoning: a premise supports a claim, and that claim in turn supports the final point.

| Role | Supported by another claim? | Supports another claim? |
| --- | --- | --- |
| Premise | No | Yes |
| Intermediate conclusion | Yes | Yes |
| Main conclusion | Yes | No |

The main conclusion is the one claim that supports nothing further: it is what the author wants you to accept in the end. When a question asks for the main conclusion, the intermediate conclusion is the most tempting wrong answer, because it is also argued for and often sits next to a "since" or "so".

### Assumptions: the unstated premise

An **assumption** is a claim the argument needs but does not state. It fills the gap between what the premises establish and what the conclusion says. To find the gap, compare the words of the conclusion with the words of the premises: an idea that appears in the conclusion but nowhere in the evidence marks the place where something has been taken for granted.

Gaps come in a few familiar shapes.

- **From a link to a cause.** Two things go together, so one is said to cause the other. The argument assumes the link does not run the other way and that no third factor explains both.
- **From some to all.** A result in a sample is applied to a whole population. The argument assumes the sample is typical in the ways that matter.
- **From past to future.** What happened before is expected to happen again. The argument assumes that conditions have not changed.
- **From one term to another.** The evidence is about one thing ("fewer hospital admissions") and the conclusion about another ("better health"). The argument assumes the two go together.

### The negation test

To check whether a statement is an assumption, write its opposite and ask whether the argument still stands. If the negated statement wrecks the argument, the argument needed the original: it is an assumption. If the argument survives the negation, the statement was at most helpful.

This test also exposes options that are **too strong**. Words such as "all", "every", "always", "only" and "the best" make a statement easy to negate without harm: the negation of "every diner is trying to lose weight" is "not every diner is", and an argument about some diners choosing differently survives that comfortably. An assumption is usually the weakest claim that still closes the gap.

### A method under time pressure

1. Read the question first, so you know whether you are looking for a conclusion or an assumption.
2. Find the main conclusion with indicator words and the therefore test.
3. Say the gap in your own words before you read the options.
4. Strike out options that repeat a premise, restate the conclusion, bring in facts the argument does not use, or claim far more than the argument needs.
5. Apply the negation test to the one or two options left.

A correct answer scores 1.5, a wrong one costs 0.4 and a blank scores 0, so elimination matters: every option you can rule out with a reason makes a final choice better informed.
`,
  examples: [
    {
      id: 'example-hand-gel-stations',
      title: 'Main or intermediate conclusion?',
      problemMd: md`Identify the main conclusion of this argument.

> A hospital has placed hand-gel stations at the entrance of every ward, positioned so that nobody can walk in without passing one. Since staff now clean their hands more often, infections passed on by touch should become less common on the wards. The hospital should therefore install the same stations in its outpatient clinics.`,
      steps: [
        md`List the claims: the stations are at every ward entrance; staff clean their hands more often; infections passed by touch should become less common; the hospital should install stations in its outpatient clinics.`,
        md`Mark the indicators. "Since" introduces the cleaning as a reason for the claim about infections; "therefore" introduces the recommendation as the conclusion drawn from what came before.`,
        md`Apply the therefore test to the last two claims: "infections should become less common, therefore the hospital should install the stations in its clinics" reads as reasoning, and the reverse order does not.`,
        md`The claim about infections is supported (by the extra hand cleaning) and also supports something (the recommendation), so it is an intermediate conclusion. The recommendation supports nothing further, so it is the main conclusion.`,
      ],
      answerMd: md`The main conclusion is that the hospital should install the same stations in its outpatient clinics. The tempting wrong answer is "infections passed on by touch should become less common", which is argued for but is only a step on the way.`,
    },
    {
      id: 'example-stairs-blood-pressure',
      title: 'The assumption behind a causal claim',
      problemMd: md`> In a survey of 2,000 office workers, those who usually took the stairs had lower blood pressure, on average, than those who usually took the lift. Taking the stairs therefore lowers blood pressure.

Which of these does the argument depend on? (i) Having lower blood pressure did not itself make people more likely to choose the stairs. (ii) Everyone who takes the stairs has normal blood pressure.`,
      steps: [
        md`Find the conclusion and the evidence. The conclusion is causal: taking the stairs **lowers** blood pressure. The evidence is only an association between stair use and lower average blood pressure.`,
        md`Name the gap: moving from a link to a cause. The argument needs the link not to run the other way and not to be produced by some third factor.`,
        md`Negate (i): "having lower blood pressure did make people more likely to choose the stairs". Then the survey result could arise without the stairs doing anything, and the conclusion loses its support. So (i) is needed.`,
        md`Negate (ii): "not everyone who takes the stairs has normal blood pressure". The evidence is about averages, so the argument survives this easily. (ii) is far stronger than anything the argument needs.`,
      ],
      answerMd: md`The argument assumes (i). Statement (ii) is tempting because it sounds as if it supports the conclusion, but it is a sweeping claim the argument never relies on.`,
    },
    {
      id: 'example-reading-programme',
      title: 'Only what the conclusion needs',
      problemMd: md`> A new reading programme was tried in five primary schools, and pupils' reading-test scores rose in all five. If the region introduces the programme in all its primary schools, reading-test scores across the region will rise.

Which of these does the argument assume? (i) The five schools were not unusual in ways that made the programme work there. (ii) Reading-test scores are an accurate measure of how well pupils read.`,
      steps: [
        md`The conclusion predicts higher reading-test scores across the region; the evidence is a rise in five schools. The new idea in the conclusion is "all the region's schools", so the gap is from some to all.`,
        md`Negate (i): the five schools were unusual in ways that made the programme work there. Then nothing follows about the other schools, and the prediction collapses. So (i) is an assumption.`,
        md`Negate (ii): test scores are not an accurate measure of reading. The conclusion is about **scores**, not about reading ability, so it still follows from the evidence. (ii) is not needed.`,
      ],
      answerMd: md`The argument assumes (i). Statement (ii) would matter only if the conclusion claimed that pupils read better; choosing it means reading more into the conclusion than it says.`,
    },
  ],
  traps: [
    {
      title: 'Choosing the intermediate conclusion',
      md: md`In a chained argument the intermediate conclusion is argued for, often stands next to "so" or "since", and sounds like a conclusion. Check whether it goes on to support another claim; if it does, it is not the main conclusion. The main conclusion is the end of the chain.`,
    },
    {
      title: 'Picking an assumption that is too strong',
      md: md`Options with "all", "always", "only" or "the best" are attractive because they would make the conclusion certain. An assumption does not need to make the conclusion certain; it needs to be something the argument cannot do without. Negate the option: if the argument survives, it was not assumed.`,
    },
    {
      title: 'Answering from outside knowledge',
      md: md`An option can be true, sensible and medically correct and still not be an assumption of this argument. Judge every option only by whether this passage's reasoning needs it. What you know about the topic from elsewhere does not count.`,
    },
    {
      title: 'Mistaking a premise for an assumption',
      md: md`An assumption is unstated. An option that repeats something the passage already says is a premise, not an assumption, however central it is. If you can underline it in the passage, it is not the answer to an assumption question.`,
    },
  ],
  check: [
    {
      id: 'check-blood-pressure-tablets',
      title: 'The pharmacist argument',
      topic: 'Critical thinking: main conclusion',
      stimulusMd: md`Many patients stop taking their blood-pressure tablets once they feel well. Yet high blood pressure rarely causes symptoms, so feeling well tells a patient nothing about whether the tablets are still needed. Pharmacists who hand over these tablets should therefore remind each patient that the treatment must continue even when there are no symptoms.`,
      stemMd: md`Which of the following best expresses the main conclusion of the argument?`,
      options: [
        { id: 'A', text: md`Many patients stop taking their blood-pressure tablets once they feel well.`, note: md`This is background that sets up the problem; nothing in the passage argues for it, and it is not what the passage wants you to accept in the end.` },
        { id: 'B', text: md`High blood pressure rarely causes symptoms.`, note: md`This is a premise: it is given as a reason ("so…") and is not supported by anything else in the passage.` },
        { id: 'C', text: md`Feeling well tells a patient nothing about whether the tablets are still needed.`, note: md`This is an intermediate conclusion. It is supported by the premise about symptoms, but it in turn supports the recommendation to pharmacists.` },
        { id: 'D', text: md`Pharmacists should remind patients collecting blood-pressure tablets that treatment must continue without symptoms.`, note: '' },
        { id: 'E', text: md`Patients who stop their tablets will develop dangerously high blood pressure.`, note: md`The passage never says this. It is a stronger claim about consequences that the argument neither states nor needs.` },
      ],
      answer: 'D',
      workingMd: md`The chain runs: high blood pressure rarely causes symptoms, so feeling well says nothing about whether treatment is needed, therefore pharmacists should remind patients to continue. The claim about feeling well is supported and also supports the recommendation, so it is intermediate. The recommendation to pharmacists supports nothing further: it is the main conclusion.`,
      lesson: 'The main conclusion is the claim that supports nothing else; a claim that is argued for and then used again is intermediate.',
    },
    {
      id: 'check-helmet-law',
      title: 'The helmet law',
      topic: 'Critical thinking: assumption',
      stimulusMd: md`In the year after a town made helmets compulsory for cyclists, the number of cyclists treated at the town's hospital for head injuries fell by a third. The law has therefore reduced head injuries among the town's cyclists.`,
      stemMd: md`Which of the following is an assumption on which the argument depends?`,
      options: [
        { id: 'A', text: md`Helmets prevent every head injury in a cycling accident.`, note: md`Far too strong. The argument needs helmets to prevent some injuries, not all of them; negating this ("helmets do not prevent every head injury") leaves the argument standing.` },
        { id: 'B', text: md`The number of people cycling in the town did not fall sharply in the year after the law was introduced.`, note: '' },
        { id: 'C', text: md`Most cyclists in the town already wore helmets before the law.`, note: md`The argument does not need this; if anything, the law could only have had an effect if many cyclists did not wear helmets before. Negating it does no harm to the argument.` },
        { id: 'D', text: md`Head injuries are the most common injury among cyclists.`, note: md`How common head injuries are compared with other injuries is irrelevant to whether the law reduced head injuries.` },
        { id: 'E', text: md`Other towns should introduce a similar law.`, note: md`This is a further conclusion someone might draw, not something the argument relies on.` },
      ],
      answer: 'B',
      workingMd: md`The evidence is a fall in the number of cyclists treated for head injuries; the conclusion is that the law caused fewer head injuries. If far fewer people cycled after the law, the number of injuries could fall for that reason alone. Negate the statement about cycling: "the number of people cycling fell sharply". The fall in injuries is then explained without the helmets, and the argument collapses, so the argument depends on it.`,
      lesson: 'When a count falls, ask whether the number of people at risk fell too; an argument from a count assumes it did not.',
    },
    {
      id: 'check-calorie-menu',
      title: 'Calories on the menu',
      topic: 'Critical thinking: assumption',
      stimulusMd: md`From next month, the hospital canteen's menu will show the number of calories in every dish. Diners at the canteen will therefore choose lower-calorie meals than they do now.`,
      stemMd: md`Which of the following is an assumption on which the argument depends?`,
      options: [
        { id: 'A', text: md`Every diner at the canteen is trying to lose weight.`, note: md`Too strong. The argument needs only some diners to change their choices; negating this ("not every diner is trying to lose weight") leaves it intact.` },
        { id: 'B', text: md`Lower-calorie meals are healthier than higher-calorie meals.`, note: md`The conclusion is about what diners will choose, not about health, so the argument does not need this, true or not.` },
        { id: 'C', text: md`At least some diners will notice the calorie figures and let them affect what they choose.`, note: '' },
        { id: 'D', text: md`The canteen's dishes were higher in calories in the past than they are now.`, note: md`The dishes themselves are not said to change; the argument is about the effect of showing their calories, so their past content is irrelevant.` },
        { id: 'E', text: md`In other canteens that show calories, diners have not changed what they choose.`, note: md`This would weaken the argument. An assumption is something the argument needs to be true, not evidence against it.` },
      ],
      answer: 'C',
      workingMd: md`The gap is between showing the calories and diners choosing differently. Negate the statement about noticing: "no diner will both notice the figures and let them affect the choice". Then showing the calories changes nothing and the conclusion fails, so the argument depends on it. The statements about every diner dieting and about health go beyond what the conclusion says.`,
      lesson: 'An assumption is usually the weakest claim that closes the gap; test it by negating it.',
    },
  ],
  takeaways: [
    'The main conclusion supports nothing further; an intermediate conclusion is argued for and then used again.',
    'Use indicator words and the therefore test to find which claim is the point.',
    'An assumption is unstated and necessary: it fills the gap between the evidence and the conclusion.',
    'Negate a candidate assumption: if the argument collapses, it was assumed; if it survives, it was not.',
  ],
  flashcards: [
    { front: 'Premise', back: 'A claim offered as a reason for another claim. It is stated in the passage and is not itself argued for.' },
    { front: 'Intermediate conclusion', back: 'A claim that is supported by a premise and in turn supports the main conclusion. It is the most tempting wrong answer to a main-conclusion question.' },
    { front: 'The therefore test', back: 'Join two claims with "therefore" in both orders. The order that reads as reasoning shows which claim is the conclusion of that step.' },
    { front: 'Assumption', back: 'An unstated claim the argument needs: without it the evidence no longer supports the conclusion.' },
    { front: 'The negation test', back: 'Write the opposite of a candidate assumption. If the argument collapses, the statement was assumed; if it survives, it was not.' },
    { front: 'Four common gaps', back: 'From a link to a cause, from some to all, from past to future, and from one term to another.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic', skill: 'imat-logic-critical' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const strengtheningWeakeningAndFlawsLesson: Lesson = {
  slug: 'strengthening-weakening-and-flaws',
  title: 'Strengthening, weakening and flaws in arguments',
  summary: 'Judge which new fact most strengthens or weakens an argument, and name the flaw in reasoning that moves from a link to a cause or reverses a rule.',
  minutes: 22,
  objectives: [
    'Strengthen or weaken an argument by working on the gap between its evidence and its conclusion.',
    'Recognise alternative explanations for a causal claim: reverse cause, a third factor and a biased comparison.',
    'Name common reasoning flaws, including reversing a conditional and treating a necessary condition as sufficient.',
  ],
  teachMd: md`
### Start from the gap

Strengthen, weaken and flaw questions all build on the previous lesson. Before you read the options, find the conclusion, find the evidence, and say in a few words what the argument takes for granted to get from one to the other. That gap is where every right answer acts.

- An option **strengthens** the argument if it makes the gap smaller: it rules out a rival explanation or confirms something the argument assumed.
- An option **weakens** the argument if it makes the gap wider: it offers a rival explanation for the evidence or shows an assumption is false.
- A **flaw** is the gap itself, described in general terms: the kind of mistake the reasoning makes.

Two rules of the game. First, accept every option as true; the question is what it would do to the argument, not whether you believe it. Second, the question asks for the option that does the **most**: a small effect loses to a large one, and an option that is merely on the same topic does nothing.

### Weakening a causal claim

Many arguments you will meet end in a claim that something causes something: a drug prevents colds, a tax reduces drinking, a garden speeds recovery. The evidence is usually that two things go together, or that a change was followed by another change. There are three standard ways the evidence can be explained without the claimed cause.

| Rival explanation | What it says | Example |
| --- | --- | --- |
| Reverse cause | The effect produces the supposed cause | Healthier people are more able to exercise, not only the other way round |
| Third factor | Something else produces both | Wealth could lead both to more gym use and to better health |
| Something else changed | Another change at the same time explains the result | A ward's recovery times fell when it also started taking easier cases |

A strong weakener names one of these and makes it fit the facts in the passage. A strong strengthener rules one of them out, for example by showing that the groups compared were alike in every other way.

### Comparisons and fair tests

Many medical and scientific arguments compare two groups. The comparison supports a causal conclusion only if the groups differ in the factor being studied and in nothing else that matters. That is why **random assignment** (chance decides who gets which treatment) and **blinding** (people do not know which treatment they have) strengthen a study so much: random assignment removes systematic differences between the groups, and blinding stops expectations from colouring what is reported. An option revealing that one group was healthier, younger or more motivated to begin with weakens the argument for the same reason.

### Flaws to recognise

| Flaw | What the argument does |
| --- | --- |
| Link taken as cause | Concludes that one thing causes another only because they occur together |
| Unrepresentative sample | Generalises from a group that is not typical of the whole |
| Reversing a conditional | From "all A are B" concludes "all B are A" |
| Necessary taken as sufficient | Treats a condition that is required as if it guaranteed the result |
| Circular reasoning | Uses the conclusion, reworded, as one of its premises |
| Attacking the person | Rejects a claim because of who made it, not because of the evidence |
| False choice | Presents two options as the only ones when others exist |
| Numbers and rates confused | Compares totals when the groups differ in size, or the reverse |

Reversing a conditional and confusing necessary with sufficient are close cousins. "Every nurse on the ward has a first-aid certificate" does not mean that everyone with a certificate is a nurse on the ward. "A certificate is required for the course" does not mean that having one gets you in. In both cases the argument reads a one-way rule as if it ran both ways.

### How to read the options

1. Find the conclusion and name the gap before you look at the options.
2. For a weakener, look for the rival explanation; for a strengthener, look for what rules it out.
3. Check direction: an option can be relevant and still push the wrong way. Bottled-water sales rising after a soft-drink tax fits the conclusion that people drink fewer soft drinks; it does not weaken it.
4. Check scope: an option about other towns, other diseases or the cost of something usually leaves this argument untouched.
5. For a flaw, match the general description to the specific step in the passage. A flaw option that describes a mistake the passage does not make is wrong, however familiar its wording.
`,
  examples: [
    {
      id: 'example-garden-ward',
      title: 'Weakening: the garden beside the ward',
      problemMd: md`> After a garden was opened beside ward A, the average stay of its patients fell from nine days to seven. The garden must have helped patients recover faster.

Which of these, if true, most weakens the argument? (i) Patients on ward A said they enjoyed the garden. (ii) In the same month the garden opened, ward A began admitting mainly patients recovering from minor operations.`,
      steps: [
        md`Conclusion: the garden caused faster recovery. Evidence: shorter average stays after it opened. Gap: nothing else changed that could shorten stays.`,
        md`Option (ii) names something else that changed at the same time: the ward's patients became easier cases, who would be expected to stay less long anyway. That explains the evidence without the garden.`,
        md`Option (i) is on the topic and even fits the conclusion, but enjoying a garden says nothing about whether it shortened stays. It does not weaken the argument.`,
      ],
      answerMd: md`Statement (ii) most weakens the argument, because it offers a rival explanation for the shorter stays. Statement (i) is tempting because it mentions the garden, but it has no bearing on the gap.`,
    },
    {
      id: 'example-strengthen-garden',
      title: 'Strengthening the same argument',
      problemMd: md`Take the garden argument again, without option (ii). Which would most strengthen it? (i) Over the same period, ward B, which has no garden and admits the same kinds of patients as ward A, saw no change in its average stay. (ii) The garden was expensive to build.`,
      steps: [
        md`To strengthen a causal claim, rule out rival explanations. The biggest rival is that something affecting the whole hospital (a new discharge policy, a milder season) shortened stays everywhere.`,
        md`Option (i) supplies a comparison: a similar ward without a garden did not change. That makes a hospital-wide cause much less likely and points to something specific to ward A.`,
        md`Option (ii) is about cost. It has nothing to do with whether the garden shortened stays.`,
      ],
      answerMd: md`Statement (i) strengthens the argument by ruling out a hospital-wide explanation. It does not prove the garden caused the change, but a strengthener only has to make the conclusion more likely.`,
    },
    {
      id: 'example-certificate-flaw',
      title: 'Naming the flaw',
      problemMd: md`> To be accepted on the advanced training course, a nurse must hold a first-aid certificate. Luca holds a first-aid certificate, so he will be accepted on the course.

What is the flaw in this reasoning?`,
      steps: [
        md`Write the rule in the passage as a one-way statement: accepted on the course → holds a certificate. The certificate is a **necessary** condition.`,
        md`The argument uses it the other way round: holds a certificate → accepted. That treats the certificate as a **sufficient** condition, which the rule never said.`,
        md`Check with a counter-case: Luca could hold the certificate and still be turned down for another reason, such as too few places. Nothing in the passage rules that out.`,
      ],
      answerMd: md`The argument treats a necessary condition as if it were sufficient. Describing it as "it relies on an unrepresentative sample" or "it attacks the person" would be naming flaws that are not in the passage.`,
    },
  ],
  traps: [
    {
      title: 'Relevant but pointing the wrong way',
      md: md`An option can be clearly about the argument and still strengthen when you were asked to weaken, or the reverse. Before choosing, say in one sentence what the option does to the gap: wider or narrower. Questions are often built so that the tempting option has the right topic and the wrong direction.`,
    },
    {
      title: 'Doubting the option instead of using it',
      md: md`Every option is to be taken as true. Rejecting an option because you think it is unlikely, or because you know a study that says otherwise, means answering a different question. Ask only what the option would do to this argument if it were true.`,
    },
    {
      title: 'Choosing a familiar flaw that is not there',
      md: md`Flaw options use standard labels, and a label you recognise feels right. Match each label to a specific step in the passage. If you cannot point to the sentence where the argument attacks a person or uses a small sample, that flaw is not the answer.`,
    },
  ],
  check: [
    {
      id: 'check-soft-drink-tax',
      title: 'The soft-drink tax',
      topic: 'Critical thinking: weaken',
      stimulusMd: md`Since a city introduced a tax on sugary soft drinks, sales of those drinks in shops within the city have fallen by 20%. The city council concludes that the tax has reduced the amount of sugary soft drink that the city's residents drink.`,
      stemMd: md`Which of the following, if true, most seriously weakens the council's conclusion?`,
      options: [
        { id: 'A', text: md`Since the tax was introduced, sales of sugary soft drinks in shops just outside the city boundary have risen sharply.`, note: '' },
        { id: 'B', text: md`The council had expected sales to fall by more than 20%.`, note: md`What the council expected does not change what happened; a smaller fall than forecast is still a fall, and it says nothing about where residents buy their drinks.` },
        { id: 'C', text: md`Several other cities have introduced similar taxes.`, note: md`Other cities are outside the scope of the argument; this neither explains the fall in this city nor gives a reason to doubt it.` },
        { id: 'D', text: md`Sales of bottled water in shops within the city have risen since the tax was introduced.`, note: md`This fits the conclusion, since residents may have switched from soft drinks to water. It points the wrong way for a weakener.` },
        { id: 'E', text: md`Sugary soft drinks contain a large amount of sugar.`, note: md`This is background about the drinks. It has no bearing on whether residents now drink less of them.` },
      ],
      answer: 'A',
      workingMd: md`The evidence is about sales in shops inside the city; the conclusion is about how much residents drink. The gap is that residents might simply buy the drinks elsewhere. A sharp rise in sales just outside the boundary offers that rival explanation for the 20% fall, so the fall need not mean residents drink less.`,
      lesson: 'When the evidence measures one thing (sales in one place) and the conclusion another (consumption), the best weakener shows how they could come apart.',
    },
    {
      id: 'check-nasal-spray',
      title: 'The nasal-spray trial',
      topic: 'Critical thinking: strengthen',
      stimulusMd: md`During one winter, researchers gave one group of volunteers a new nasal spray and a second group a salt-water spray, each for a week. Over the following month, the volunteers in the first group reported 30% fewer colds than those in the second. The researchers conclude that the new spray helps to prevent colds.`,
      stemMd: md`Which of the following, if true, most strengthens the researchers' conclusion?`,
      options: [
        { id: 'A', text: md`Some volunteers in the first group disliked the taste of the new spray.`, note: md`Disliking the taste says nothing about whether the spray prevented colds; it does not touch the gap.` },
        { id: 'B', text: md`Colds are more common in winter than in summer.`, note: md`Both groups were studied in the same winter, so the season affects them equally and cannot explain the difference.` },
        { id: 'C', text: md`The first group happened to include more volunteers who were already in very good general health.`, note: md`This weakens the conclusion: better general health is a rival explanation for the fewer colds.` },
        { id: 'D', text: md`Volunteers were assigned to the groups at random, and neither they nor the researchers knew which spray each had received.`, note: '' },
        { id: 'E', text: md`The salt-water spray costs less than the new spray.`, note: md`Cost is irrelevant to whether the new spray prevents colds.` },
      ],
      answer: 'D',
      workingMd: md`The main threats to the conclusion are that the groups differed in some other way, and that volunteers who knew they had the new spray reported fewer colds because they expected to. Random assignment removes systematic differences between the groups, and blinding removes the effect of expectations on what is reported. Ruling out both rival explanations makes the spray the most likely cause.`,
      lesson: 'A fair comparison strengthens a causal claim: random assignment and blinding rule out the commonest rival explanations.',
    },
    {
      id: 'check-rash-painkiller',
      title: 'The rash and the painkiller',
      topic: 'Critical thinking: flaw',
      stimulusMd: md`A hospital audit found that every patient who developed a particular rash had been taking a new painkiller. A pharmacist concludes that every patient who takes the new painkiller will develop the rash.`,
      stemMd: md`Which of the following best describes the flaw in the pharmacist's reasoning?`,
      options: [
        { id: 'A', text: md`It rejects a claim because of who made it rather than because of the evidence.`, note: md`Nobody's claim is rejected and no person is criticised; the passage contains no attack on anyone.` },
        { id: 'B', text: md`It uses its conclusion, in other words, as one of its premises.`, note: md`The premise is about patients with the rash and the conclusion about patients taking the drug; they are different claims, so the reasoning is not circular.` },
        { id: 'C', text: md`From the fact that all patients with the rash took the painkiller, it concludes that all patients taking the painkiller will develop the rash.`, note: '' },
        { id: 'D', text: md`It presents only two possibilities when there are others.`, note: md`The passage never offers a choice between two options, so there is no false choice to criticise.` },
        { id: 'E', text: md`It compares totals for groups of very different sizes.`, note: md`The passage gives no numbers or group sizes at all, so it cannot be comparing totals unfairly.` },
      ],
      answer: 'C',
      workingMd: md`The audit establishes "rash → took the painkiller". The pharmacist concludes "took the painkiller → rash", the same rule run backwards. Many patients may take the painkiller without any rash; the audit, which looked only at patients with the rash, cannot tell. None of the other flaws named appears in the passage.`,
      lesson: '"All A are B" does not give "all B are A": check which way a rule runs before using it.',
    },
  ],
  takeaways: [
    'Find the gap first: a strengthener narrows it, a weakener widens it, and a flaw describes it.',
    'Treat every option as true and ask what it does to this argument, in which direction and by how much.',
    'Causal claims are weakened by reverse cause, a third factor or another change at the same time.',
    'Random assignment and blinding strengthen a comparison; a difference between the groups weakens it.',
    'Reversing a one-way rule and treating a necessary condition as sufficient are two common logical flaws.',
  ],
  flashcards: [
    { front: 'Strengthener', back: 'A fact that narrows the gap between evidence and conclusion, usually by ruling out a rival explanation or confirming an assumption.' },
    { front: 'Weakener', back: 'A fact that widens the gap, usually by offering a rival explanation for the evidence or showing an assumption is false.' },
    { front: 'Three rival explanations for a causal claim', back: 'Reverse cause, a third factor that produces both, and another change that happened at the same time.' },
    { front: 'Why random assignment and blinding strengthen a study', back: 'Random assignment removes systematic differences between the groups; blinding stops expectations from affecting what is reported.' },
    { front: 'Reversing a conditional', back: 'Concluding "all B are A" from "all A are B". The rule runs only one way.' },
    { front: 'Necessary taken as sufficient', back: 'Treating a condition that is required, like a certificate for a course, as if it guaranteed the result.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic', skill: 'imat-logic-critical' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const numericalProblemSolvingLesson: Lesson = {
  slug: 'numerical-problem-solving',
  title: 'Numerical problem solving without a calculator',
  summary: 'Set up word problems on doses, rates, proportions and overlapping groups, and solve them by hand with fractions, friendly numbers and quick checks.',
  minutes: 22,
  objectives: [
    'Turn a word problem into a short chain of quantities with their units.',
    'Solve rate, proportion and overlapping-group problems by hand, using fractions rather than long decimals.',
    'Check an answer by a second route and spot the intermediate quantity that a wrong option offers.',
  ],
  teachMd: md`
### What these problems test

Problem-solving questions describe an everyday or scientific situation in words and ask for a number. The arithmetic is simple; the difficulty is in setting up the right chain of quantities and not stopping halfway. Nothing in the IMAT rules allows a calculator, so plan to work by hand.

### Write the chain before you calculate

Read the question sentence first and write down what is wanted, with its unit: "mL per dose", "km/h", "number of students". Then list the given quantities with their units and look for the chain that links them. Units are your guide: mg per kg times kg gives mg; mg divided by mg per mL gives mL. If the units of your final step do not match what is asked, the set-up is wrong before any arithmetic has gone wrong.

### Arithmetic that suits working by hand

- **Fractions beat decimals.** $\frac{3}{5}$ of something is easier to handle than $0.6$ of it, and $\frac{1}{4} \times \frac{3}{5} = \frac{3}{20}$ stays exact.
- **Cancel before you multiply.** $\frac{36 \times 20}{3}$ is $12 \times 20 = 240$; there is no need to work out $720$ first.
- **Friendly numbers.** $15 \times 24 = 15 \times 4 \times 6 = 60 \times 6 = 360$.
- **Estimate first.** A rough size lets you rule out options that are ten times too big or that lie outside the obvious range.

### Rates

A rate is an amount per unit of time (or per unit of something else). Three patterns cover most problems.

1. **Distance, speed and time:** $d = v \times t$. Keep hours with km/h; 45 minutes is $\frac{3}{4}$ h.
2. **Average speed:** total distance divided by total time. It is not the average of the speeds, because more time is spent at the lower speed.
3. **Working together:** if one person finishes a job in $a$ hours and another in $b$ hours, their rates are $\frac{1}{a}$ and $\frac{1}{b}$ jobs per hour, and rates **add**: together they do $\frac{1}{a} + \frac{1}{b}$ jobs per hour. Times never add.

### Proportions and parts of a whole

When a question gives a fraction of a fraction ("three fifths of the patients are adults, and a quarter of the adults are over 65"), multiply the fractions to get the share of the whole: $\frac{3}{5} \times \frac{1}{4} = \frac{3}{20}$. If you know the size of the part, divide by its share to find the whole. A ratio of $1 : 4$ means 1 part out of $1 + 4 = 5$ parts, not 1 part out of 4.

### Overlapping groups

For two groups that overlap,

$$\text{total} = A + B - \text{both} + \text{neither}$$

Adding $A$ and $B$ counts the people in both groups twice, so they are taken away once. A small table or a two-circle diagram makes the four regions visible: only $A$, only $B$, both, neither.

### Working backwards from the options

With five numerical options, it is sometimes quicker to test them than to solve. Start with a middle-sized option: if it gives too large a result, the answer is smaller, and two or three options go at once. This works best when the forward calculation is awkward but checking a single number is easy, as in "how many tablets were in the box at the start?" problems where each day removes a fixed fraction.

### Counting intervals

When events repeat at fixed intervals, the number of events is one more than the number of gaps between the first and the last. Tablets every 8 hours from 06:00 on Monday to 22:00 on Tuesday cover 40 hours, which is 5 gaps and therefore 6 tablets. Draw a short timeline whenever you are unsure whether to add the one.

### Checking an answer

A second route catches most slips. Run the answer forwards through the problem: if the answer is a total of 240 patients, does $\frac{3}{20}$ of 240 really give the 36 you were told? Also look at the options for the numbers you met on the way: wrong options are often the intermediate results of the right method (the daily dose instead of the single dose, the number of adults instead of all patients). If your answer is one of those, check that you finished.
`,
  examples: [
    {
      id: 'example-dose-volume',
      title: 'Volume of one dose',
      problemMd: md`A fictional prescription gives a child 15 mg of a medicine per kg of body mass per day, split into 3 equal doses. The child's mass is 24 kg, and the liquid medicine contains 120 mg in every 5 mL. What volume should each dose be?`,
      steps: [
        md`Write the chain with units: mg per kg per day × kg → mg per day; ÷ 3 → mg per dose; ÷ (mg per mL) → mL per dose.`,
        md`Daily amount: $15 \times 24 = 360$ mg.`,
        md`One dose: $360 \div 3 = 120$ mg.`,
        md`The liquid has 120 mg in 5 mL, so 120 mg is exactly 5 mL.`,
        md`Check by another route: the daily volume is $\frac{360}{120} \times 5 = 15$ mL, and $15 \div 3 = 5$ mL per dose.`,
      ],
      answerMd: md`Each dose is 5 mL. The tempting wrong answer is 15 mL, which is the volume for the whole day.`,
    },
    {
      id: 'example-two-workers',
      title: 'Working together',
      problemMd: md`One technician can pack a box of test kits in 20 minutes; a second takes 30 minutes for the same job. Working together at these rates, how long do they take to pack 5 boxes?`,
      steps: [
        md`Turn times into rates: $\frac{1}{20}$ and $\frac{1}{30}$ of a box per minute.`,
        md`Rates add: $\frac{1}{20} + \frac{1}{30} = \frac{3}{60} + \frac{2}{60} = \frac{5}{60} = \frac{1}{12}$ box per minute.`,
        md`At one box every 12 minutes, 5 boxes take $5 \times 12 = 60$ minutes.`,
        md`Check: in 60 minutes the first packs $60 \div 20 = 3$ boxes and the second $60 \div 30 = 2$, which is 5 boxes.`,
      ],
      answerMd: md`They take 60 minutes. Averaging the times (25 minutes per box, so 125 minutes) or adding them are the tempting wrong methods: times do not add or average, rates add.`,
    },
    {
      id: 'example-two-subjects',
      title: 'Overlapping groups',
      problemMd: md`Of 120 students, 70 study biology, 50 study chemistry and 20 study neither. How many study both subjects?`,
      steps: [
        md`Students who study at least one subject: $120 - 20 = 100$.`,
        md`Adding the two subjects gives $70 + 50 = 120$, which is 20 more than 100, because everyone who studies both has been counted twice.`,
        md`So $20$ students study both. Check with the four regions: biology only $70 - 20 = 50$, chemistry only $50 - 20 = 30$, both 20, neither 20, and $50 + 30 + 20 + 20 = 120$.`,
      ],
      answerMd: md`20 students study both subjects. Forgetting the 20 who study neither leads to $70 + 50 - 120 = 0$, the tempting wrong answer.`,
    },
  ],
  traps: [
    {
      title: 'Averaging speeds',
      md: md`Going 60 km/h one way and 40 km/h back does not average 50 km/h: the slower leg takes longer, so it counts for more. Average speed is always total distance divided by total time.`,
    },
    {
      title: 'Mixing units',
      md: md`Minutes with km/h, mL with L, or mg with g produce answers out by a factor of 60 or 1,000. Convert everything into the units of the answer before calculating, and check the unit of each step.`,
    },
    {
      title: 'Stopping at an intermediate result',
      md: md`The daily dose, the number of adults, the time for one box: each is a step on the way, and each is likely to appear among the options. Reread the question sentence before you choose.`,
    },
    {
      title: 'Misreading a ratio',
      md: md`A ratio of $1 : 4$ is 1 part in 5, not 1 part in 4. Add the parts of the ratio to get the whole before you divide.`,
    },
  ],
  check: [
    {
      id: 'check-round-trip-speed',
      title: 'There and back',
      topic: 'Problem solving: rates',
      stemMd: md`A paramedic drives 30 km to a hospital at an average speed of 60 km/h and returns by the same route at an average speed of 40 km/h. What is the average speed for the whole round trip?`,
      options: [
        { id: 'A', text: md`24 km/h`, note: md`This divides only the one-way distance, 30 km, by the total time of 1.25 hours; the round trip is 60 km.` },
        { id: 'B', text: md`48 km/h`, note: '' },
        { id: 'C', text: md`50 km/h`, note: md`This is the average of the two speeds. More time is spent at 40 km/h, so the average speed is lower than 50.` },
        { id: 'D', text: md`75 km/h`, note: md`75 is the total time in minutes, not a speed.` },
        { id: 'E', text: md`96 km/h`, note: md`This uses 120 km for the distance, counting the round trip twice.` },
      ],
      answer: 'B',
      workingMd: md`Time out: $\frac{30}{60} = 0.5$ h. Time back: $\frac{30}{40} = 0.75$ h. Total: 60 km in 1.25 h, so the average speed is $\frac{60}{1.25} = 48$ km/h. Second route: for equal distances the average speed is $\frac{2 \times 60 \times 40}{60 + 40} = \frac{4800}{100} = 48$ km/h.`,
      lesson: 'Average speed is total distance over total time, never the mean of the speeds.',
    },
    {
      id: 'check-clinic-patients',
      title: 'Patients over 65',
      topic: 'Problem solving: proportions',
      stemMd: md`At a clinic, $\frac{3}{5}$ of the patients registered are adults and the rest are children. A quarter of the adults are over 65. If 36 registered patients are over 65, how many patients are registered at the clinic?`,
      options: [
        { id: 'A', text: md`60`, note: md`This divides 36 by $\frac{3}{5}$ and skips the step for the quarter of adults who are over 65.` },
        { id: 'B', text: md`96`, note: md`This is the number of children, $\frac{2}{5}$ of 240, not the total.` },
        { id: 'C', text: md`144`, note: md`This is the number of adults ($36 \times 4$); the question asks for all registered patients.` },
        { id: 'D', text: md`240`, note: '' },
        { id: 'E', text: md`360`, note: md`This divides the 144 adults by $\frac{2}{5}$, the children's share, instead of by $\frac{3}{5}$.` },
      ],
      answer: 'D',
      workingMd: md`Adults: $36 \times 4 = 144$. Adults are $\frac{3}{5}$ of all patients, so the total is $144 \times \frac{5}{3} = 240$. Check by the share of the whole: over-65s are $\frac{3}{5} \times \frac{1}{4} = \frac{3}{20}$ of the patients, and $\frac{3}{20} \times 240 = 36$.`,
      lesson: 'Multiply the fractions to get the share of the whole, then divide the known part by that share.',
    },
    {
      id: 'check-two-pumps',
      title: 'Two pumps',
      topic: 'Problem solving: rates',
      stemMd: md`Pump P alone fills a tank in 6 hours. Pumps P and Q working together fill the same tank in 4 hours. How long would pump Q take to fill the tank alone?`,
      options: [
        { id: 'A', text: md`2 hours`, note: md`This subtracts the times, $6 - 4$. Times do not add or subtract; rates do.` },
        { id: 'B', text: md`2.4 hours`, note: md`This is the time for two pumps of 6 and 4 hours working together, $\frac{6 \times 4}{6 + 4}$; but 4 hours is already the joint time, not Q's own time.` },
        { id: 'C', text: md`5 hours`, note: md`This averages the two times given, which has no meaning here.` },
        { id: 'D', text: md`10 hours`, note: md`This adds the two times given. Times do not add; only rates do.` },
        { id: 'E', text: md`12 hours`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Rates in tanks per hour: together $\frac{1}{4}$, P alone $\frac{1}{6}$. Q's rate is $\frac{1}{4} - \frac{1}{6} = \frac{3}{12} - \frac{2}{12} = \frac{1}{12}$, so Q alone takes 12 hours. Check: in 12 hours P fills 2 tanks and Q fills 1, which is 3 tanks in 12 hours, one tank every 4 hours.`,
      lesson: 'Convert times to rates, add or subtract the rates, and convert back.',
    },
  ],
  takeaways: [
    'Write the chain of quantities with their units before doing any arithmetic.',
    'Work in fractions and cancel before multiplying; estimate to rule options out.',
    'Rates add, times do not; average speed is total distance over total time.',
    'For two overlapping groups, total = A + B − both + neither.',
    'Wrong options are often intermediate results: reread the question before choosing.',
  ],
  flashcards: [
    { front: 'Average speed', back: 'Total distance divided by total time. It is not the mean of the speeds, because more time is spent at the slower speed.' },
    { front: 'Two workers or pumps together', back: md`Add their rates: $\frac{1}{a} + \frac{1}{b}$ jobs per hour. Turn the combined rate back into a time at the end.` },
    { front: 'Overlapping groups formula', back: 'Total = A + B − both + neither. Adding A and B counts the overlap twice.' },
    { front: 'A ratio of 1 : 4', back: 'One part out of 5 in total. Add the parts of a ratio to get the whole before dividing.' },
    { front: 'Fraction of a fraction', back: md`Multiply to get the share of the whole: $\frac{3}{5}$ of $\frac{1}{4}$ is $\frac{3}{20}$. Divide the known part by its share to find the whole.` },
    { front: 'Checking a numerical answer', back: 'Run the answer forwards through the problem, and watch for options that equal an intermediate result.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic', skill: 'imat-logic-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const sequencesAndLogicalPuzzlesLesson: Lesson = {
  slug: 'sequences-and-logical-puzzles',
  title: 'Sequences and logical puzzles',
  summary: 'Find the rule behind number and letter sequences, solve ordering puzzles by cases, and count faces and cubes in simple spatial problems.',
  minutes: 22,
  objectives: [
    'Find the rule of a number or letter sequence by testing differences, ratios and alternating patterns.',
    'Solve an ordering puzzle by placing fixed facts first and splitting the rest into cases.',
    'Tell what must be true from what only could be true, and count the pieces of a painted cube.',
  ],
  teachMd: md`
### Sequences: test the simple rules in order

A sequence question gives a few terms and asks for the next one (or a missing one). Almost every rule you will meet comes from a short list, so test the rules in a fixed order rather than staring at the numbers.

1. **Differences.** Subtract each term from the next. A constant difference means an arithmetic sequence. If the differences themselves change steadily (2, 4, 6, 8), continue the differences.
2. **Ratios.** If the terms grow fast, divide each term by the one before. A constant ratio means a geometric sequence (3, 6, 12, 24).
3. **Two sequences interleaved.** If the differences alternate (+5, −2, +5, −2), look at the odd-numbered and even-numbered terms separately; each may be simple on its own.
4. **Known families.** Squares (1, 4, 9, 16), cubes (1, 8, 27, 64), primes (2, 3, 5, 7, 11), products of neighbours (2, 6, 12, 20 is $1 \times 2, 2 \times 3, 3 \times 4, 4 \times 5$), and sums of the two previous terms (1, 1, 2, 3, 5, 8).

Once you have a rule, check that it produces **every** given term, not just the last two. Then apply it once more.

### Letter sequences

Turn letters into their positions in the alphabet (A = 1, B = 2, … Z = 26) and treat the result as a number sequence. C, F, I, L is 3, 6, 9, 12, so the next letter is the 15th, O. When a sequence runs past Z, count on from A again.

### Ordering puzzles

An ordering puzzle gives a set of people or objects, a set of positions (times, seats, places in a queue) and some conditions. The aim is to find who goes where, or what must follow.

- **Draw the slots.** Write the positions in a row and fill in anything fixed outright ("R is at 11:00").
- **Use the tightest condition next.** A block ("S is immediately after T") has only a few places it can fit. List them.
- **Split into cases.** For each place the block could go, follow the other conditions through. A case that breaks a condition is closed; what survives is the answer.
- **Read the question type.** "Must be true" means true in every surviving case. "Could be true" means true in at least one. "Cannot be true" means true in none.

Writing the cases out takes less time than it seems, and it prevents the commonest error: answering from the first arrangement that works when another arrangement also works.

### Truth and consistency

Some puzzles state that exactly one of several statements is false, or that one person always lies. Assume each candidate is the odd one out in turn and check whether everything else then fits. Usually only one assumption gives a consistent picture.

### Painted cubes

A large cube built from $n \times n \times n$ small cubes, painted on the outside and then taken apart, is a standard spatial problem. Count by position.

| Position | Faces painted | Number of small cubes |
| --- | --- | --- |
| Corners | 3 | $8$ |
| Edges, not corners | 2 | $12(n - 2)$ |
| Faces, not edges | 1 | $6(n - 2)^2$ |
| Inside | 0 | $(n - 2)^3$ |

A cube has 8 corners, 12 edges and 6 faces. Each edge holds $n$ small cubes, two of which are corners, which is where $n - 2$ comes from. The four counts must add up to $n^3$, which makes a quick check.

### When to move on

Every IMAT question scores the same 1.5 when correct, so a long puzzle earns no more than a short biology question. If a puzzle has not opened up after a careful first pass, mark it, move on, and come back with fresh eyes; nothing in the rules fixes the order in which you answer.
`,
  examples: [
    {
      id: 'example-growing-differences',
      title: 'Differences that grow',
      problemMd: md`Find the next term: 3, 5, 9, 15, 23, …`,
      steps: [
        md`The differences are $5 - 3 = 2$, $9 - 5 = 4$, $15 - 9 = 6$, $23 - 15 = 8$.`,
        md`The differences rise by 2 each time, so the next difference is 10.`,
        md`Next term: $23 + 10 = 33$.`,
        md`Check with a formula that fits every term: $n^2 - n + 3$ gives 3, 5, 9, 15, 23 for $n = 1$ to $5$, and $36 - 6 + 3 = 33$ for $n = 6$.`,
      ],
      answerMd: md`The next term is 33. Adding 8 again, to get 31, is the tempting wrong answer: it assumes the differences are constant.`,
    },
    {
      id: 'example-lab-tests',
      title: 'Must be true or could be true?',
      problemMd: md`Four lab tests, W, X, Y and Z, are run one after another in slots 1 to 4. X runs before Y, but not immediately before it. Z does not run first or last. Which of these must be true? (i) X runs first. (ii) Y runs third or fourth.`,
      steps: [
        md`List the places for X and Y with at least one slot between them: X1 Y3, X1 Y4, X2 Y4.`,
        md`X1 Y3: slots 2 and 4 are left; Z cannot be last, so Z2, W4. Order X Z Y W. Valid.`,
        md`X1 Y4: slots 2 and 3 are left, and Z can take either: X Z W Y or X W Z Y. Both valid.`,
        md`X2 Y4: slots 1 and 3 are left; Z cannot be first, so Z3, W1. Order W X Z Y. Valid.`,
        md`Four arrangements survive. Y is third or fourth in all four, so (ii) must be true. X is first in three of them but second in W X Z Y, so (i) only could be true.`,
      ],
      answerMd: md`Only (ii) must be true. Statement (i) is the tempting wrong answer: it holds in the first arrangements you are likely to find, but not in all of them.`,
    },
    {
      id: 'example-painted-cube',
      title: 'A painted 3 × 3 × 3 cube',
      problemMd: md`A cube made of 27 small cubes, 3 along each edge, is painted on all its outside faces and then taken apart. How many small cubes have paint on exactly two faces?`,
      steps: [
        md`Cubes with exactly two painted faces sit on an edge of the large cube but not at a corner.`,
        md`Each edge has 3 small cubes, of which 2 are corners, leaving $3 - 2 = 1$ per edge.`,
        md`A cube has 12 edges, so there are $12 \times 1 = 12$ such cubes.`,
        md`Check the totals: corners 8 (three faces), edges 12 (two), face centres $6 \times 1 = 6$ (one), centre 1 (none), and $8 + 12 + 6 + 1 = 27$.`,
      ],
      answerMd: md`12 small cubes have exactly two painted faces. The tempting wrong answer is 8, which is the number of corner cubes, painted on three faces.`,
    },
  ],
  traps: [
    {
      title: 'Fitting a rule to the last two terms only',
      md: md`Many rules produce the last two terms of a sequence; only one produces them all. Test your rule on every term given before you trust it.`,
    },
    {
      title: 'Stopping at the first arrangement that works',
      md: md`In an ordering puzzle, finding one valid arrangement shows what could be true, not what must be. For a "must be true" question, check every case, or look for an option that holds in all of them.`,
    },
    {
      title: 'Counting corners with the edges',
      md: md`In cube problems, the corner cubes belong to three edges at once. Count each edge without its two ends, and check that your categories add up to the total number of small cubes.`,
    },
  ],
  check: [
    {
      id: 'check-alternating-sequence',
      title: 'Alternating steps',
      topic: 'Problem solving: sequences',
      stemMd: md`What is the next term of the sequence 4, 9, 7, 12, 10, 15, …?`,
      options: [
        { id: 'A', text: md`12`, note: md`This subtracts 3 from 15. The steps alternate between +5 and −2, so the next step is −2, not −3.` },
        { id: 'B', text: md`13`, note: '' },
        { id: 'C', text: md`17`, note: md`This adds 2 to 15, misreading the falling step −2 as +2.` },
        { id: 'D', text: md`18`, note: md`This continues the even-placed terms 9, 12, 15 by +3, but the next term is the seventh, an odd-placed one.` },
        { id: 'E', text: md`20`, note: md`This repeats the +5 step; after +5 the pattern takes −2.` },
      ],
      answer: 'B',
      workingMd: md`The differences are +5, −2, +5, −2, +5, so the next is −2: $15 - 2 = 13$. Second route: the odd-placed terms 4, 7, 10 rise by 3, so the seventh term is $10 + 3 = 13$.`,
      lesson: 'When differences alternate, split the sequence into its odd-placed and even-placed terms.',
    },
    {
      id: 'check-clinic-appointments',
      title: 'Five appointments',
      topic: 'Problem solving: logical puzzles',
      stemMd: md`Five patients, P, Q, R, S and T, have one appointment each at 09:00, 10:00, 11:00, 12:00 and 13:00.

- R's appointment is at 11:00.
- P's appointment is earlier than Q's.
- S's appointment is immediately after T's.
- Q's appointment is not at 13:00.

Who has the 09:00 appointment?`,
      options: [
        { id: 'A', text: md`P`, note: '' },
        { id: 'B', text: md`Q`, note: md`Q must come after P, so Q cannot have the first slot of the day.` },
        { id: 'C', text: md`R`, note: md`R is fixed at 11:00 by the first condition.` },
        { id: 'D', text: md`S`, note: md`S comes immediately after T, so S can never have the first slot.` },
        { id: 'E', text: md`T`, note: md`If T were at 09:00, S would be at 10:00, leaving 12:00 and 13:00 for P and Q; P before Q would then put Q at 13:00, which is not allowed.` },
      ],
      answer: 'A',
      workingMd: md`With R at 11:00, the pair T then S must take 09:00 and 10:00 or 12:00 and 13:00. In the first case P and Q take 12:00 and 13:00 with P first, so Q is at 13:00, which breaks the last condition. So T is at 12:00 and S at 13:00, and P and Q take 09:00 and 10:00 with P first. The order is P, Q, R, T, S, and P has the 09:00 appointment.`,
      lesson: 'Place the fixed fact, list the few places a block can go, and close every case that breaks a condition.',
    },
    {
      id: 'check-five-cube',
      title: 'A painted 5 × 5 × 5 cube',
      topic: 'Problem solving: spatial reasoning',
      stemMd: md`A large cube is built from 125 small cubes, 5 along each edge. Its outside faces are painted, and it is then taken apart. How many of the small cubes have paint on exactly two faces?`,
      options: [
        { id: 'A', text: md`8`, note: md`These are the corner cubes, which have paint on three faces.` },
        { id: 'B', text: md`27`, note: md`This is the number of cubes inside the large cube, $3^3$, with no paint at all.` },
        { id: 'C', text: md`36`, note: '' },
        { id: 'D', text: md`54`, note: md`This is the number with exactly one painted face, $6 \times 3^2$.` },
        { id: 'E', text: md`60`, note: md`This counts all 5 cubes along each of the 12 edges, including the corners, which have three painted faces.` },
      ],
      answer: 'C',
      workingMd: md`Cubes with exactly two painted faces lie on an edge but not at a corner. Each edge has $5 - 2 = 3$ of them, and there are 12 edges, so $12 \times 3 = 36$. Check the totals: $8 + 36 + 54 + 27 = 125$.`,
      lesson: 'Count painted cubes by position (corner, edge, face, inside) and check that the counts add up to the total.',
    },
  ],
  takeaways: [
    'Test sequence rules in order: differences, ratios, interleaved sequences, then known families.',
    'A sequence rule must produce every given term, not only the last two.',
    'In ordering puzzles, place fixed facts first, list the places for a block, and split into cases.',
    '"Must be true" means true in every surviving case; "could be true" means in at least one.',
    'In an n × n × n painted cube, two-face cubes number 12(n − 2) and the four counts add up to n³.',
  ],
  flashcards: [
    { front: 'Order of tests for a number sequence', back: 'Differences (and differences of differences), ratios, two interleaved sequences, then known families such as squares, cubes, primes and Fibonacci-type sums.' },
    { front: 'Letter sequences', back: 'Replace each letter with its position in the alphabet (A = 1, … Z = 26), solve as numbers, and count on from A after Z.' },
    { front: 'Differences that alternate', back: 'Split the sequence into odd-placed and even-placed terms; each part is often a simple sequence on its own.' },
    { front: 'Must be true vs could be true', back: 'Must be true holds in every arrangement that satisfies the conditions; could be true holds in at least one.' },
    { front: 'Painted n × n × n cube', back: md`Three faces: 8. Two faces: $12(n-2)$. One face: $6(n-2)^2$. None: $(n-2)^3$.` },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic', skill: 'imat-logic-problem-solving' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};
