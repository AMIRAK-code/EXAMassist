import { md, type Lesson } from '../../types';

/** Bocconi master's, verbal reasoning: base-rate neglect, self-selection and the conjunction trap, and how each is weakened or strengthened. */
export const statisticalReasoningFlawsLesson: Lesson = {
  slug: 'statistical-reasoning-flaws',
  title: 'Statistical flaws: base rates, self-selection and the conjunction trap',
  metaTitle: 'Statistical reasoning flaws: base rates and self-selection',
  summary: 'Spot shares read as rates, self-selected volunteers and over-detailed stories in short arguments, and know which facts weaken or strengthen each.',
  minutes: 22,
  objectives: [
    'Turn a share of incidents into a rate per member using each group\'s share of the population, and say when the conclusion survives.',
    'Recognise a comparison between people who chose a treatment and people who did not, and name the evidence that would settle it.',
    'Apply the rule that a combination of events is never more probable than any one of them.',
    'Predict the weakener and the strengthener for each of the three flaws.',
  ],
  teachMd: md`
### When the evidence is a number

Many short arguments rest on a statistic: a percentage of cases, a comparison between participants and non-participants, a forecast. In Bocconi's verbal critical reasoning items the passage is taken as true, so the figures themselves are not in doubt. What can go wrong is the step from the figure to the conclusion. This lesson takes three such steps in turn. The first was introduced in [flaws and evaluation](/courses/bocconi-master/flaws-and-evaluation); here it gets the arithmetic that settles it.

### 1. Base-rate neglect: a share of incidents is not a rate

"70% of the thefts involved bikes of brand X" is a **share**: it divides the incidents among groups. A conclusion about risk needs a **rate**: incidents per member of each group. The missing number is the base rate, the size of each group. For each group,

$$\text{relative rate} = \frac{\text{share of incidents}}{\text{share of the population}}.$$

This ratio is the group's rate divided by the overall rate. Above 1, the group suffers more incidents than its share of the population would suggest; below 1, fewer. So a group is riskier per member **exactly when its share of incidents is larger than its share of the population**. A group with 65% of the incidents but 75% of the members has a relative rate of $\frac{65}{75} \approx 0.87$; the other group, with 35% of the incidents and 25% of the members, has $\frac{35}{25} = 1.4$. The group with most of the incidents is the safer one.

The same neglect has a second form. When a check is applied where the condition it looks for is rare, most of its alarms can be false even if the check is good. Take 10,000 payments, 1% of them fraudulent, and a filter that flags 90% of fraudulent payments and 5% of genuine ones. It flags 90 of the 100 fraudulent payments and 495 of the 9,900 genuine ones, so only $\frac{90}{585} \approx 0.15$ of flagged payments, about 15%, are fraud. An argument that treats "flagged" as "almost certainly fraud" has ignored the base rate.

**Weakening and strengthening.** "Group X has most of the incidents, so X is riskier" is weakened by a fact showing that X makes up an even larger share of the population, and strengthened by one showing that the groups are of similar size or that X is the smaller group. Asked what would be most useful to know, look for the relative size of the groups.

### 2. Self-selection: those who chose are not those who did not

"Staff who took the optional course were promoted more often than staff who did not" compares two groups that sorted themselves. Whatever made people sign up, such as ambition, spare time or an encouraging manager, may also make them more likely to be promoted, course or no course. The gap between the groups mixes the effect of the course with the effect of who chooses it.

The flaw grows when the conclusion is a plan to extend the treatment to everyone. Making the course compulsory adds exactly the people who chose not to take it, the group the evidence says least about.

- **Weakeners** show that the groups differed before the treatment: volunteers already had higher ratings, more experience or stronger motivation, or the gap between them existed before the treatment began.
- **Strengtheners** take the choice away: places were given by lottery among applicants and the winners did better than the losers; or volunteers and non-volunteers were alike on the relevant measures beforehand; or participants improved on their own earlier record while similar non-participants did not.

A related case is the voluntary response: people who answer a questionnaire or post a review chose to do so, and those with strong views are more likely to. [Strengthen and weaken](/courses/bocconi-master/strengthen-and-weaken) shows how a random sample supports a survey; the point here is that choice itself is the source of the bias.

### 3. The conjunction trap

For any two events, the probability that both happen is no larger than the probability of either one alone:

$$P(A \text{ and } B) \le P(A).$$

Every outcome in which both happen is an outcome in which $A$ happens. Yet a detailed story often feels more likely than a bare claim, because each detail fits what we know and the story seems to explain more. That feeling is the trap. Each detail added to a scenario is one more thing that must turn out right, so the scenario becomes less probable or, at best, stays as probable. If a recession next year has probability 0.3 and, given a recession, a fall in house prices has probability 0.5, then "a recession and a fall in house prices" has probability $0.3 \times 0.5 = 0.15$, half that of the recession alone.

The trap appears in two forms. Asked which statement is most likely, an option that adds a plausible detail to another option can never beat it. Asked for a flaw, an argument that rates a full scenario as more probable than one of its parts, because the scenario hangs together, commits this one. A detailed story can be a more satisfying explanation; it is never more probable than any of its parts.

### A method

1. Find the statistic and the conclusion, and say what kind of claim the conclusion is: a rate, a cause or a probability.
2. If the evidence is a share and the conclusion is a rate, ask for the size of each group.
3. If the groups chose their own treatment, ask how they differed beforehand.
4. If a scenario has several parts, compare it with each part alone.
`,
  examples: [
    {
      id: 'example-rate-break-even',
      title: 'From a share to a rate, and the break-even point',
      problemMd: md`"Last year, 72% of the bicycle thefts reported on a university campus involved bikes left at the main library's racks; the other 28% involved bikes at faculty racks. Campus security concludes that a bike left at the library is more likely to be stolen than one left at a faculty rack." On a typical day, 80% of the bikes parked on campus are at the library racks. Does the conclusion hold, and what share of bikes would it need?`,
      steps: [
        md`The evidence is a share of thefts; the conclusion is about the risk to each bike. The missing base rate is the share of bikes at each place, which the extra fact supplies.`,
        md`Relative rates: library $\frac{72}{80} = 0.9$; faculty racks $\frac{28}{20} = 1.4$. A faculty-rack bike is $\frac{1.4}{0.9} \approx 1.6$ times as likely to be stolen.`,
        md`Check by a second route. Picture 1,000 parked bikes and 100 thefts: 72 thefts among 800 library bikes is 9 per 100 bikes; 28 thefts among 200 faculty bikes is 14 per 100 bikes. The ratio $\frac{14}{9} \approx 1.6$ agrees.`,
        md`Break-even: the library is riskier per bike exactly when its share of thefts, 72%, is larger than its share of bikes. So the conclusion holds only if fewer than 72% of parked bikes are at the library.`,
      ],
      answerMd: md`The conclusion fails: with 80% of the bikes, the library racks are safer per bike, and a bike at a faculty rack is about 1.6 times as likely to be stolen. The tempting wrong reading is "72 against 28, so the library is about two and a half times as risky", which ignores how many bikes are parked at each place.`,
    },
    {
      id: 'example-self-selection',
      title: 'Volunteers, a plan and the evidence that would settle it',
      problemMd: md`"A city offered free home energy audits to any household that asked for one. In the following year, households that had an audit cut their electricity use by 12%, while other households cut theirs by 2%. The council plans to make audits compulsory for every household, to cut the city's electricity use." Name the flaw, a weakener and a strengthener.`,
      steps: [
        md`The groups chose themselves: households that ask for an energy audit are likely to be keen to save energy already. The 12% cut could come from that keenness rather than from the audit.`,
        md`Weakener: "Households that asked for an audit had already been cutting their electricity use faster than other households in the years before the scheme." The gap existed before the treatment, so the audit may have added little.`,
        md`Strengthener: "Requests outnumbered the available auditors, so audits went by lottery among the households that asked; those that won one cut their use by about 12%, those that lost by about 2%." Both groups asked, so keenness is held constant, and the remaining difference points to the audit.`,
        md`Even with that strengthener, the plan has a second gap: it extends audits to households that did not want one. An audit may work through advice that only willing households act on, so the plan also assumes that unwilling households will respond.`,
      ],
      answerMd: md`The flaw is self-selection: households that asked for audits may differ from the rest in ways that cut their use anyway. A weakener shows that the groups differed beforehand; a strengthener removes the choice, as the lottery does. The tempting wrong weakener is "the audits cost the city more than expected", which concerns cost, not whether audits cut use.`,
    },
    {
      id: 'example-conjunction-ranking',
      title: 'Ranking three forecasts',
      problemMd: md`An analyst writes three forecasts for next year: (i) the central bank cuts interest rates; (ii) the central bank cuts interest rates and house prices rise; (iii) house prices rise. Which forecasts can be ranked against which by logic alone? If (i) has probability 0.6 and, given a cut, house prices rise with probability 0.5, what is the probability of (ii)?`,
      steps: [
        md`Forecast (ii) is the combination of (i) and (iii). Every outcome in which (ii) comes true is one in which (i) comes true, so (ii) is no more probable than (i). By the same reasoning, (ii) is no more probable than (iii).`,
        md`Forecasts (i) and (iii) are different events, and neither contains the other. Logic alone cannot rank them.`,
        md`With the numbers: $P(\text{ii}) = 0.6 \times 0.5 = 0.3$, half the probability of (i). Since (ii) is contained in (iii), (iii) has probability at least 0.3.`,
        md`If the analyst believes that rate cuts push house prices up, (ii) may feel like the most convincing forecast, because it tells a story. The story adds a condition that must also come true, so it can only lose probability.`,
      ],
      answerMd: md`Forecast (ii) is no more probable than (i) or (iii), and here its probability is 0.3. Forecasts (i) and (iii) cannot be ranked without more information. The tempting wrong ranking puts (ii) above (iii) because the rate cut seems to explain the price rise.`,
    },
  ],
  traps: [
    {
      title: 'Dividing the incidents but not the people',
      md: md`"Most of the accidents involved group X" sounds like evidence against X. Before accepting it, ask what share of the population is in X. Compare the two shares: X is riskier per member only if its share of incidents is larger than its share of members.`,
    },
    {
      title: 'Treating a good check as a reliable alarm',
      md: md`A check that catches most real cases and rarely flags innocent ones can still produce mostly false alarms when real cases are rare. Count it out on a round number such as 10,000, splitting into real and innocent cases first, before trusting any claim about what a flag means.`,
    },
    {
      title: 'Comparing choosers with non-choosers',
      md: md`When the people who received a treatment chose it, the comparison mixes the treatment with the kind of person who chooses it. Ask how the groups differed beforehand; options about cost, popularity or satisfaction do not answer that.`,
    },
    {
      title: 'Rewarding the richer story',
      md: md`A scenario with more plausible details feels more likely, but each detail is another condition that must come true. An option that adds a detail to another option is never the more probable of the two.`,
    },
  ],
  check: [
    {
      id: 'check-plumbing-claims',
      title: 'Older plumbing and claims',
      topic: 'Verbal critical reasoning',
      stemMd: md`Of the water-damage claims an insurer paid last year, 80% came from homes whose plumbing was installed before 1980. The insurer's analyst concludes that homes with plumbing installed before 1980 are more likely to make a water-damage claim than homes with newer plumbing.

Which of the following, if true, most seriously weakens the analyst's conclusion?`,
      options: [
        { id: 'A', text: md`About 85% of the homes the insurer covers have plumbing installed before 1980.`, note: '' },
        { id: 'B', text: md`The average water-damage claim from homes with newer plumbing was larger than the average claim from homes with older plumbing.`, note: md`Claim size is a different measure from how often homes claim. The conclusion is about the likelihood of a claim, so the amount paid per claim does not touch it.` },
        { id: 'C', text: md`The insurer paid more water-damage claims last year than in the year before.`, note: md`The total number of claims says nothing about how they divide between the two groups relative to the number of homes in each.` },
        { id: 'D', text: md`About half of the homes the insurer covers have plumbing installed before 1980.`, note: md`This points the other way: with half the homes but 80% of the claims, homes with older plumbing claim far more often per home, which strengthens the conclusion.` },
      ],
      answer: 'A',
      workingMd: md`The evidence is a share of claims; the conclusion is about the chance of a claim per home. Compare each group's share of claims with its share of homes. If 85% of insured homes have plumbing from before 1980, that group's relative rate is $\frac{80}{85} \approx 0.94$, while newer homes, 15% of homes with 20% of claims, have $\frac{20}{15} \approx 1.33$. Homes with newer plumbing would then claim more often per home, the opposite of the conclusion. Claim size and the yearly total do not bear on the rate per home, and a half-and-half split of homes would support the analyst.`,
      lesson: 'A group with most of the incidents is riskier per member only if its share of incidents is larger than its share of members.',
    },
    {
      id: 'check-mentoring-evaluate',
      title: 'A voluntary mentoring scheme',
      topic: 'Verbal critical reasoning',
      stemMd: md`Hartwell Bank runs a voluntary mentoring scheme for its junior analysts. Of the analysts who joined the scheme in the past three years, 40% have since been promoted, compared with 15% of those who did not join. The bank's head of talent concludes that mentoring helps junior analysts win promotion.

Which of the following would be most useful to know in evaluating the head of talent's conclusion?`,
      options: [
        { id: 'A', text: md`Whether the analysts who joined the scheme had higher performance ratings than the others before they joined.`, note: '' },
        { id: 'B', text: md`Whether the analysts in the scheme enjoyed their mentoring sessions.`, note: md`Enjoyment does not bear on why the mentored analysts were promoted more often; either answer leaves the conclusion where it was.` },
        { id: 'C', text: md`How many junior analysts the bank hired in each of the past three years.`, note: md`The number hired does not separate the effect of the scheme from the kind of analyst who joins it; neither answer moves the conclusion.` },
        { id: 'D', text: md`Whether other banks run similar mentoring schemes for their junior staff.`, note: md`What other banks do says nothing about why Hartwell's mentored analysts were promoted more often.` },
      ],
      answer: 'A',
      workingMd: md`The comparison is between analysts who chose to join and analysts who did not. The obvious rival explanation is that the joiners were already stronger or more ambitious. Apply the two-answer test to the question about earlier ratings. If the joiners already had clearly higher ratings, the promotion gap may reflect who joined, and the conclusion weakens. If the two groups had similar ratings beforehand, that rival becomes much less likely, and the conclusion strengthens. Whether analysts enjoyed the sessions, how many were hired and what other banks do leave the conclusion where it was, whatever the answer.`,
      lesson: 'When people chose their own treatment, the most useful fact is how they differed before it.',
    },
    {
      id: 'check-merger-scenario',
      title: 'A merger scenario',
      topic: 'Verbal critical reasoning',
      stemMd: md`An analyst considers a proposed merger between two airlines, which the competition authority may approve or block. She sets out a scenario: the authority approves the merger, the combined airline drops two unprofitable routes, and its share price rises. Because every part of this scenario fits what is known about the two airlines, she concludes that the whole scenario is more likely to happen than the authority's simply approving the merger.

The analyst's reasoning is flawed because it`,
      options: [
        { id: 'A', text: md`treats a combination of outcomes as more probable than one of the outcomes it contains.`, note: '' },
        { id: 'B', text: md`relies on a sample of airlines that may not be typical of the industry.`, note: md`The argument draws no conclusion from a sample of airlines; it compares the probability of a scenario with that of one of its parts.` },
        { id: 'C', text: md`assumes that because the merger has been proposed, it will be approved.`, note: md`The analyst does not assume approval; the passage allows that the authority may block the merger. The error lies in how the two probabilities are compared.` },
        { id: 'D', text: md`confuses the combined airline's share of the market with its share price.`, note: md`The argument mentions the share price only as one part of the scenario and never uses market share, so there is no confusion between the two.` },
      ],
      answer: 'A',
      workingMd: md`The scenario of approval, route cuts and a higher share price can happen only if the merger is approved. Every outcome in which all three occur is an outcome in which the merger is approved, so the probability of all three can be no larger than the probability of approval alone. The analyst's reason, that each part fits the facts, makes the story more convincing but cannot make it more probable than one of its parts. A sample of airlines, an assumption of approval and a confusion of market share with share price do not describe what the argument does.`,
      lesson: 'A scenario that contains an outcome can never be more probable than that outcome alone.',
    },
  ],
  takeaways: [
    'A share of incidents becomes a rate only when set against the group\'s share of the population.',
    'A group is riskier per member exactly when its share of incidents is larger than its share of members.',
    'When a condition is rare, most alarms from a good check can still be false; count it out on 10,000 cases.',
    'People who chose a treatment may differ from those who did not: weakeners show they differed beforehand, strengtheners take the choice away.',
    'Adding detail to a scenario never makes it more probable than any of its parts.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-verbal-reasoning', skill: 'grad-verbal-argument-analysis' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
