import { md, type Lesson } from '../../types';

/** GMAT Critical Reasoning, lesson 6: flaw questions. */
export const flawQuestions: Lesson = {
  slug: 'flaw-questions',
  title: 'Flaw questions: naming the error in the reasoning',
  summary: 'Recognise the reasoning errors that recur in Critical Reasoning and pick the option that describes what this argument actually does wrong.',
  minutes: 22,
  objectives: [
    'Recognise a flaw question and the abstract language its options use.',
    'Identify the common reasoning errors: causal, sampling, conditional, numerical and others.',
    'Match an abstract description to the specific move the argument makes.',
  ],
  teachMd: md`
### What the question asks

A flaw question asks you to describe the error in an argument. Typical stems:

- "Which of the following most accurately describes a flaw in the argument?"
- "The reasoning in the argument is most vulnerable to criticism on the grounds that it..."
- "The argument is questionable because it fails to consider..."

Flaw questions are close cousins of weaken and assumption questions: the flaw is the gap, described as a mistake. What makes them distinctive is the language of the options. They are written abstractly ("treats a correlation as proof of causation", "draws a general conclusion from an unrepresentative sample"), and your job is to match that description to what the argument actually does.

### Two checks on every option

An option is right only if it passes both checks.

1. **Does the argument actually do this?** Many options describe real flaws that this argument does not commit. Point to the sentence where the move happens. If you cannot, reject the option.
2. **Is it a flaw?** Some options describe something the argument does that is perfectly reasonable, such as relying on a statistic or drawing a modest conclusion.

The second check catches fewer people than the first. The common error is to choose a textbook flaw because it sounds familiar, without confirming it happens in this argument.

### The common flaws

| Flaw | What the argument does | Sign to look for |
| --- | --- | --- |
| Correlation as causation | Two things go together, so one causes the other | "after", "people who... tend to..." then "caused", "leads to" |
| Unrepresentative sample | Draws a conclusion about a group from a skewed part of it | Surveys of volunteers, customers, readers, survivors |
| Necessary taken as sufficient | Treats a requirement as a guarantee | "must", "only if", "required" |
| Sufficient taken as necessary | Treats one route to a result as the only route | "if... then", followed by "did not, so cannot" |
| Percent versus number | Moves between a share or rate and an amount | A share falls, so the number must fall; or the reverse |
| Part and whole | What is true of the parts is said of the whole, or the reverse | Members and teams, ingredients and dishes |
| Absence of evidence | No proof that something is true is taken as proof that it is false | "There is no evidence that..., so..." |
| Overlooking alternatives | Ignores another explanation or option | One explanation offered as the only one |
| Attacking the source | Rejects a claim because of who made it | Motives, interests or character of the speaker |
| Circular reasoning | The conclusion is assumed in a premise | Premise and conclusion say the same thing in different words |
| False choice | Treats two options as the only ones | "Either... or..." with other possibilities ignored |

### Conditional flaws

Requirements cause many flaws. "To enter the final, a runner must win a heat" means winning a heat is **necessary**. It does not mean winning a heat is **sufficient**: there may be other requirements. An argument that says "Ana won a heat, so she will enter the final" confuses the two. The reverse error treats a sufficient condition as necessary: "Anyone who scores above 90 gets a distinction; Ben scored 85, so he cannot get one" ignores other ways to get a distinction.

### Numerical flaws

A share is a part divided by a whole. If the whole changes, the share and the number can move in opposite directions. Cyclists' share of all road accidents can fall while the number of cyclist accidents rises, if accidents of other kinds rose faster. Whenever an argument moves from a percentage to a number, or from a number to a rate, check what happened to the other quantity.

### Matching abstract language

Translate each option into the terms of the argument before judging it. "It takes for granted that a condition required for an outcome is enough to bring it about" becomes, for an argument that a runner who has completed a half-marathon will qualify for a marathon that requires one, "it assumes that completing a half-marathon is enough to qualify". If the translation describes what happens in the passage, and what happens is an error, the option is right.

### Wrong-answer patterns

1. **Real flaw, wrong argument.** A familiar flaw the passage does not commit.
2. **Wrong direction.** It describes the reverse of what the argument does ("assumes the fee caused the fall" when the argument says it did not).
3. **Not a flaw.** It describes a reasonable move.
4. **Too extreme.** It says the argument "ignores all evidence" or "relies only on opinion" when it does not.
`,
  examples: [
    {
      id: 'example-sufficient-necessary',
      title: 'A sufficient condition treated as necessary',
      problemMd: md`"Every employee who completes the leadership course is eligible for promotion. Priya has not completed the course. So Priya is not eligible for promotion." Describe the flaw.`,
      steps: [
        md`The premise says completing the course is enough (sufficient) for eligibility.`,
        md`The conclusion treats it as required (necessary): no course, no eligibility.`,
        md`Check that the argument does this: yes, it moves from "has not completed" to "not eligible".`,
        md`Check it is a flaw: other routes to eligibility, such as years of service, are not ruled out.`,
      ],
      answerMd: md`The argument treats a condition that is sufficient for eligibility as if it were necessary. An option saying it "assumes that Priya does not want promotion" describes something the argument never does.`,
    },
    {
      id: 'example-part-whole',
      title: 'Part to whole',
      problemMd: md`"Each player in the Riverside football squad is among the fittest in the league. So Riverside will be the hardest team in the league to beat." Describe the flaw.`,
      steps: [
        md`The premise is about each player (the parts); the conclusion is about the team (the whole).`,
        md`A team's strength depends on more than individual fitness: skill, tactics, how the players combine.`,
        md`So the argument assumes that a quality of each part carries over to the whole.`,
      ],
      answerMd: md`The flaw is reasoning from the parts to the whole: what is true of each player need not be true of the team. "Relies on a sample that is too small" is a real flaw, but not one this argument commits.`,
    },
    {
      id: 'example-absence-of-evidence',
      title: 'No evidence for is not evidence against',
      problemMd: md`"No study has shown that the food colouring E-free Red causes headaches. Therefore E-free Red does not cause headaches." Describe the flaw.`,
      steps: [
        md`The premise reports an absence of evidence: no study has shown a link.`,
        md`The conclusion asserts the link does not exist.`,
        md`If no study has looked for the link, the lack of findings says nothing either way.`,
      ],
      answerMd: md`The argument treats a lack of evidence that something is true as proof that it is false. That is a flaw; the right option would say so in abstract words, such as "takes the absence of proof of a claim as proof that the claim is false".`,
    },
  ],
  traps: [
    {
      title: 'Picking a textbook flaw the argument does not commit',
      md: md`Options are drawn from the same list of common flaws, so most of them sound familiar. Before choosing, point to the sentence where the flaw happens. If the argument has no sample, it cannot have an unrepresentative one.`,
    },
    {
      title: 'Choosing the flaw in reverse',
      md: md`If an argument concludes that a fee did not cause a fall in visitors, an option saying it "assumes the fee caused the fall" describes the opposite. Check the direction of every causal or conditional claim in the option against the passage.`,
    },
    {
      title: 'Getting lost in abstract wording',
      md: md`Abstract options are hard to read under time pressure. Translate each one into the terms of the argument ("a condition required for an outcome" becomes "completing a half-marathon"). The translation makes it obvious whether the description fits.`,
    },
  ],
  check: [
    {
      id: 'check-marathon',
      title: 'A requirement treated as a guarantee',
      topic: 'Critical Reasoning',
      stimulusMd: md`To qualify for the Brennan City Marathon, a runner must have completed an officially timed half-marathon within the previous twelve months. Dana completed an officially timed half-marathon two months ago. So Dana will qualify for the Brennan City Marathon.`,
      stemMd: md`Which of the following most accurately describes a flaw in the argument?`,
      options: [
        { id: 'A', text: md`It treats a condition that is required for qualifying as if it were enough, on its own, to guarantee qualifying.`, note: '' },
        { id: 'B', text: md`It assumes that because something is true of one runner, it is true of all runners.`, note: md`The argument never generalises from Dana to other runners; its conclusion is about Dana alone.` },
        { id: 'C', text: md`It relies on evidence from a sample that may not be representative.`, note: md`There is no sample in the argument, only a rule and one runner's record.` },
        { id: 'D', text: md`It fails to consider that Dana may not wish to enter the marathon.`, note: md`The conclusion is that Dana will qualify, not that she will enter; whether she wants to run does not affect qualifying.` },
        { id: 'E', text: md`It mistakes the effect of a runner's training for its cause.`, note: md`The argument makes no causal claim, so there is nothing to reverse.` },
      ],
      answer: 'A',
      workingMd: md`The rule states a necessary condition: no qualifying half-marathon, no place. The argument treats it as sufficient: Dana has the half-marathon, so she qualifies. There may be other requirements (an entry deadline, a qualifying time, an age limit), so the conclusion does not follow. The half-marathon was two months ago, inside the twelve-month window, so the argument's use of the premise is not itself the problem.`,
      lesson: '"Must" and "only if" state requirements; meeting one requirement does not guarantee the result.',
    },
    {
      id: 'check-cyclist-share',
      title: 'A share taken for a number',
      topic: 'Critical Reasoning',
      stimulusMd: md`Last year, 30 percent of the road accidents in Kessly involved cyclists. This year, only 20 percent did. Clearly, Kessly's roads have become safer for cyclists.`,
      stemMd: md`The reasoning in the argument is most vulnerable to criticism on the grounds that it`,
      options: [
        { id: 'A', text: md`infers that cyclists face less danger from a fall in their share of all accidents, a share that could fall even if accidents involving cyclists became more frequent`, note: '' },
        { id: 'B', text: md`assumes that cyclists cause most of the accidents in which they are involved`, note: md`The argument says nothing about who caused the accidents; it relies only on the share involving cyclists.` },
        { id: 'C', text: md`relies on the opinions of cyclists, who are likely to be biased`, note: md`The argument uses accident figures, not anyone's opinion.` },
        { id: 'D', text: md`concludes that something true of Kessly's roads as a whole must be true of each road in Kessly`, note: md`The conclusion is about Kessly's roads in general, not each road, so there is no move from whole to part.` },
        { id: 'E', text: md`treats the absence of evidence that roads have become more dangerous as proof that they have become safer`, note: md`The argument offers positive evidence (a falling share), not an absence of evidence; its problem is what that evidence measures.` },
      ],
      answer: 'A',
      workingMd: md`The evidence is a share: accidents involving cyclists divided by all accidents. If accidents not involving cyclists rose sharply, the share could fall from 30 to 20 percent while the number of cyclist accidents rose. For example, 30 of 100 accidents last year, then 40 of 200 this year: the share falls to 20 percent while cyclist accidents rise from 30 to 40. So a falling share does not show the roads are safer for cyclists.`,
      lesson: 'A share can fall while the number it describes rises; check what happened to the whole.',
    },
    {
      id: 'check-museum-fee',
      title: 'A survey that could not find the answer',
      topic: 'Critical Reasoning',
      stimulusMd: md`Since the Orrin Museum began charging an entry fee in January, the number of visitors has fallen by a quarter. The museum's director argues that the fee is not to blame, because in a survey of people who visited the museum after January, almost none said the fee was too high.`,
      stemMd: md`Which of the following most accurately describes a flaw in the director's reasoning?`,
      options: [
        { id: 'A', text: md`It assumes that the fee caused the fall in visitors without considering other possible causes.`, note: md`This reverses the argument: the director concludes the fee did not cause the fall.` },
        { id: 'B', text: md`It relies on a survey that, by its design, could not include the people most likely to have been put off by the fee.`, note: '' },
        { id: 'C', text: md`It treats a fall of a quarter in visitor numbers as larger than it really is.`, note: md`The argument accepts the fall as given and does not exaggerate it; it disputes only its cause.` },
        { id: 'D', text: md`It attacks the people who criticise the fee instead of answering their reasons.`, note: md`No critic is mentioned or attacked; the director argues from survey results.` },
        { id: 'E', text: md`It assumes that what was true of the museum's visitors in earlier years is true of them this year.`, note: md`The argument does not compare this year's visitors with earlier ones; the survey is only of visitors since January.` },
      ],
      answer: 'B',
      workingMd: md`The question is whether the fee kept people away. The people kept away did not visit, so they could not be surveyed among visitors. Those who did visit had already decided the fee was acceptable, so their answers say almost nothing about the quarter who stopped coming. The causal option is the reverse of what the director argues.`,
      lesson: 'A survey of the people who stayed cannot tell you why others left.',
    },
  ],
  takeaways: [
    'A flaw option must describe something the argument actually does, and that thing must be an error.',
    'Translate abstract options into the argument\'s own terms before judging them.',
    'Requirements are not guarantees, and one route to a result is not the only route.',
    'Shares and numbers can move in opposite directions when the whole changes.',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-critical-reasoning', skill: 'cr-identify-flaw' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};
