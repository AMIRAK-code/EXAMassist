import { md, type Lesson } from '../../types';

/** GMAT Critical Reasoning, lesson 2: assumption questions. */
export const assumptionQuestions: Lesson = {
  slug: 'assumption-questions',
  title: 'Assumption questions: the unstated premise and the negation test',
  summary: 'Find the unstated premise an argument cannot do without, and use the negation test to confirm it and reject options that are merely helpful.',
  minutes: 22,
  objectives: [
    'Recognise an assumption question from its stem and say what kind of answer it needs.',
    'Predict the assumption from the gap between premises and conclusion.',
    'Use the negation test to tell a required assumption from one that only helps.',
    'Reject options that are too strong, irrelevant or restate a premise.',
  ],
  teachMd: md`
### What an assumption is

An assumption is a premise the author needs but does not state. If it were false, the argument would fall apart. Assumption questions ask you to find it, with stems such as:

- "The argument depends on which of the following assumptions?"
- "Which of the following is an assumption on which the argument relies?"
- "The conclusion above is properly drawn only if which of the following is true?"

All three ask for a **required** assumption: something that must be true for the argument to work. That is a narrower target than "something that would help". Many wrong options would make the argument stronger if true, yet the argument could survive without them.

### Start from the gap

Before the options, find the main conclusion and the premises, then ask: "What new idea appears in the conclusion that the premises never mention, and what link would the author need between the two?" The assumption is that link. Most gaps fall into a few shapes:

| Gap | What the author must assume |
| --- | --- |
| Correlation to cause | No other factor explains the link; the cause runs the stated way |
| Sample to population | The sample is typical of the group the conclusion is about |
| Plan to goal | The plan can work: nothing in the situation blocks it |
| Term shift | The thing measured in the premises behaves like the thing named in the conclusion |
| Comparison | The two things compared are alike in the ways that matter |

You will rarely predict the exact wording, but a rough prediction ("something about the test kitchen being like a home kitchen") picks out the right option quickly.

### The negation test

To check an option, turn it into its negation, the minimal statement that it is false, and ask whether the argument survives.

- If the negated option **destroys** the argument (the conclusion no longer follows at all), the option is a required assumption.
- If the argument **still stands**, perhaps a little weaker, the option is not required.

Negate minimally. The negation of "all" is "not all" (at least one is not), not "none". The negation of "at least some" is "none". The negation of "X is the main cause" is "X is not the main cause", not "X has no effect". Getting this right matters, because options are often phrased so that a sloppy negation gives the wrong verdict.

### Why modest wording wins

A required assumption only needs to be as strong as the argument needs. An argument that a bonus will reduce late deliveries needs only that **some** lateness is within drivers' control, not that **most** is. A strongly worded option ("all", "most", "only", "always") claims more than the argument needs, so its negation ("not all", "not most") usually leaves the argument standing. Strong wording is not automatically wrong, but treat it as a warning and negate it carefully.

### Defender assumptions

Many assumptions do their work by ruling something out: there was no other cause, the sample was not skewed, nothing blocks the plan. These "defender" assumptions are usually phrased negatively ("No other change accounts for...", "The sample was not..."). When you see an option written as a denial of an alternative explanation, test it straight away: if the alternative were true, would the argument collapse?

### Wrong-answer patterns

1. **Too strong.** It goes beyond what the argument needs ("most", "every", "the only").
2. **Helpful but not needed.** It supports the conclusion, but the argument could work without it. This is the hardest trap, because the option is relevant.
3. **Restates a premise.** It is already given, so it is not an unstated assumption.
4. **Irrelevant comparison.** It compares the subject with something the argument never brings in.
5. **Wrong direction.** It would weaken the argument if true.

### Sufficient assumptions

Occasionally a stem asks which option, **if assumed**, would make the conclusion "follow logically" or allow it to be "properly drawn". There the right answer is one that, added to the premises, guarantees the conclusion. Such an answer can be strong, and the negation test is less useful. Read the stem: "depends on" and "relies on" want a necessary assumption; "if assumed, allows the conclusion to be properly drawn" wants a sufficient one.
`,
  examples: [
    {
      id: 'example-negating-a-strong-option',
      title: 'Negating a strongly worded option',
      problemMd: md`"Since the city introduced a congestion charge, average traffic speed in the centre has risen from 14 to 19 kilometres per hour. So the charge has reduced congestion in the centre." Is "Most drivers who stopped driving into the centre did so because of the charge" an assumption the argument relies on?`,
      steps: [
        md`State the gap: speeds rose after the charge, and the conclusion credits the charge. The argument needs the charge to be responsible for at least a meaningful part of the rise.`,
        md`Negate the option minimally: "Not most drivers who stopped driving into the centre did so because of the charge" (for example, 40 percent did, and the rest stopped for other reasons).`,
        md`Ask whether the argument survives. If 40 percent of those who stopped did so because of the charge, the charge still reduced congestion, just less than it seemed. The conclusion "the charge has reduced congestion" can still hold.`,
      ],
      answerMd: md`No. The option helps the argument but is not required: its negation leaves the conclusion standing. A required assumption here would be weaker, for example that the rise in speed was not caused entirely by something else, such as roadworks finishing at the same time.`,
    },
    {
      id: 'example-defender-assumption',
      title: 'Predicting a defender assumption',
      problemMd: md`"Pupils at Wexley School who learn a musical instrument score higher in mathematics than pupils who do not. Learning an instrument must therefore improve mathematical ability." Predict an assumption and test it.`,
      steps: [
        md`The gap is correlation to cause. The author must assume nothing else explains why instrument learners score higher.`,
        md`Write a defender: "The higher mathematics scores of instrument learners are not entirely explained by extra mathematics tuition that those pupils receive."`,
        md`Negate it: the higher scores are entirely explained by extra tuition. Then learning an instrument adds nothing to mathematics scores, and the conclusion fails.`,
        md`Because the negation breaks the argument, the defender is a required assumption. Note the wording "entirely": a defender that only says tuition is not part of the explanation would be too strong, since its negation (tuition explains some of the gap) leaves room for the instrument to help as well. More generally, the argument relies on no alternative cause accounting for the whole difference.`,
      ],
      answerMd: md`An assumption: the higher scores are not explained by some other difference between the two groups of pupils, such as extra tuition. An option stating any specific alternative cause as true would be a weakener, not an assumption.`,
    },
    {
      id: 'example-term-shift',
      title: 'An assumption hiding in a term shift',
      problemMd: md`"Fernhill Books' online sales rose by 40 percent last year, while sales in its shops were flat. So the online store is now the more profitable part of the business." What must the author assume?`,
      steps: [
        md`The premises are about sales growth; the conclusion is about profit, and about which part earns more, not which grew faster.`,
        md`Two links are needed. First, growth in sales does not tell you the size of sales: online could have grown 40 percent from a tiny base. Second, sales are not profit: online orders might carry delivery costs.`,
        md`Negate each link to check it. If online sales are still far smaller than shop sales, or if online costs eat up most of the extra revenue, the online store cannot be the more profitable part, and the conclusion fails. So both links are required.`,
      ],
      answerMd: md`The argument assumes that online sales are now large enough, and online costs low enough, for the online store's profit to exceed the shops'. Options about growth rates only restate the premise; options about the size of sales or the level of costs are where the real assumption lies.`,
    },
  ],
  traps: [
    {
      title: 'Choosing an option that helps but is not needed',
      md: md`The most tempting wrong answers are relevant: if true, they would make the argument better. But an assumption question asks what the argument cannot do without. Run the negation test on any option you like; if the argument survives the negation, move on.`,
    },
    {
      title: 'Negating too far',
      md: md`The negation of "most" is "not most", not "none"; the negation of "always" is "not always", not "never". Negating to the extreme makes almost every option look necessary. Use the smallest change that makes the statement false.`,
    },
    {
      title: 'Picking a restated premise',
      md: md`An option that repeats a premise in new words feels safe because it is clearly true in the passage. But an assumption is unstated by definition. If you can point to the sentence that already says it, it is not the answer.`,
    },
    {
      title: 'Mixing up assumption and weakener',
      md: md`An option that names an alternative cause as true ("pupils who learn instruments also receive extra tuition") is a weakener. The assumption is the denial of it. Check the direction: the assumption is something the author would be glad to have confirmed.`,
    },
  ],
  check: [
    {
      id: 'check-library-hours',
      title: 'A causal claim and its assumption',
      topic: 'Critical Reasoning',
      stimulusMd: md`Rivermouth Library extended its weekday opening hours to 10 p.m. In the three months since, the number of books borrowed has been 15 percent higher than in the same three months a year earlier. The library's director concludes that the longer opening hours caused the rise in borrowing.`,
      stemMd: md`The director's conclusion depends on which of the following assumptions?`,
      options: [
        { id: 'A', text: md`Most of the extra borrowing took place between 6 p.m. and 10 p.m.`, note: md`This would help, but it is not required: negate it, and the longer hours could still have caused the rise, for example by drawing in new members who then borrow during the day.` },
        { id: 'B', text: md`No other change during the same three months, such as a reading campaign in local schools, accounts for most of the rise in borrowing.`, note: '' },
        { id: 'C', text: md`Most of the library's weekday evening visitors are students.`, note: md`Who the evening visitors are has no bearing on whether the longer hours caused the rise; the argument works whoever they are.` },
        { id: 'D', text: md`Borrowing would have risen even more if the library had also opened on Sundays.`, note: md`A claim about a different change the library did not make; the argument neither needs nor mentions it.` },
        { id: 'E', text: md`Borrowing at the other libraries in the region fell during the same three months.`, note: md`Helpful but not required. If borrowing elsewhere held steady or rose slightly, the longer hours could still explain Rivermouth's rise, so the argument does not need a fall elsewhere.` },
      ],
      answer: 'B',
      workingMd: md`The gap is from "borrowing rose after the change" to "the change caused the rise". Negate the defender: some other change during those months does account for most of the rise. Then the longer hours are not what caused the rise, and the conclusion fails. Negate the evening-borrowing option instead and the conclusion survives, since longer hours can raise borrowing at other times of day. The regional comparison asks for more than the argument needs.`,
      lesson: 'A causal conclusion drawn from a before-and-after comparison assumes that nothing else changed enough to explain the result.',
    },
    {
      id: 'check-test-kitchen',
      title: 'An assumption behind a term shift',
      topic: 'Critical Reasoning',
      stimulusMd: md`Every recipe in Tomas Reyes's new cookbook was cooked successfully by at least three volunteer testers in the publisher's test kitchen before the book went to print. So the recipes will work for readers cooking in an ordinary home kitchen.`,
      stemMd: md`Which of the following is an assumption on which the argument relies?`,
      options: [
        { id: 'A', text: md`Every tester completed every recipe successfully at the first attempt.`, note: md`Too strong. The premise says each recipe was cooked successfully; whether it took one attempt or two does not decide whether it will work at home.` },
        { id: 'B', text: md`The publisher's test kitchen is not equipped in a way that makes recipes succeed there that would fail in an ordinary home kitchen.`, note: '' },
        { id: 'C', text: md`Recipes tested by professional chefs are less likely to work in home kitchens than recipes tested by volunteers.`, note: md`An irrelevant comparison: the argument says nothing about professional chefs and does not depend on how they compare.` },
        { id: 'D', text: md`Some recipes in Tomas Reyes's earlier cookbooks did not work in home kitchens.`, note: md`His earlier books play no part in the argument; if anything this hints at a problem, so it is not something the author relies on.` },
        { id: 'E', text: md`Three testers is the largest number used by any cookbook publisher.`, note: md`How the number compares with other publishers' practice does not affect whether these recipes work at home.` },
      ],
      answer: 'B',
      workingMd: md`The premise is about success in the publisher's test kitchen; the conclusion is about ordinary home kitchens. The author must assume the two settings are alike in the ways that matter. Negate that: the test kitchen has equipment that makes recipes succeed which would fail at home. Then success in testing tells us little about home kitchens, and the argument collapses. The first-attempt option overshoots what the argument needs.`,
      lesson: 'When the premise is about one setting and the conclusion about another, the argument assumes the settings do not differ in a way that matters.',
    },
    {
      id: 'check-courier-bonus',
      title: 'The assumption behind a plan',
      topic: 'Critical Reasoning',
      stimulusMd: md`To reduce the number of late deliveries, Brightway Couriers will pay its drivers a bonus for every delivery made on time. Brightway's managers predict that, as a result, the number of late deliveries will fall.`,
      stemMd: md`The managers' prediction depends on which of the following assumptions?`,
      options: [
        { id: 'A', text: md`Most late deliveries are caused by drivers taking unnecessary breaks.`, note: md`Too strong. The plan needs only some lateness to be within drivers' control; negate "most" and the bonus can still cut the late deliveries that drivers can prevent.` },
        { id: 'B', text: md`At least some late deliveries result from factors that drivers are able to influence.`, note: '' },
        { id: 'C', text: md`Brightway's competitors already pay their drivers similar bonuses.`, note: md`What competitors do has no bearing on whether Brightway's own drivers will respond to the bonus.` },
        { id: 'D', text: md`The bonus will be large enough to double the pay of a typical driver.`, note: md`Far more than the plan needs: a smaller bonus could still change drivers' behaviour.` },
        { id: 'E', text: md`Customers care more about on-time delivery than about the price they pay.`, note: md`Customers' priorities do not affect whether the bonus reduces late deliveries, which is all the prediction claims.` },
      ],
      answer: 'B',
      workingMd: md`The plan works by changing what drivers do. Negate the modest option: no late deliveries result from anything drivers can influence. Then a bonus to drivers cannot change the number of late deliveries, and the prediction fails. The options about "most" causes and doubling pay go further than the plan requires; competitors and customers are outside the argument.`,
      lesson: 'A plan that works through people assumes those people can actually affect the outcome; the right option says so as modestly as possible.',
    },
  ],
  takeaways: [
    'A required assumption is an unstated premise without which the argument collapses.',
    'Predict it from the gap, then confirm with the negation test: the right negation destroys the argument.',
    'Negate minimally: "most" becomes "not most", never "none".',
    'Modest wording usually beats strong wording; helpful-but-not-needed options are the main trap.',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-critical-reasoning', skill: 'cr-construct-argument' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
