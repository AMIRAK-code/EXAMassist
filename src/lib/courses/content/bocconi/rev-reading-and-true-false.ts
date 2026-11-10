import { md, type CheckQuestion, type Lesson } from '../../types';

/**
 * Quick revision: reading comprehension and true / false / cannot be deduced.
 * Adapted from the site owners' revision deck (slides 22–30 and 47–50), with
 * the deck's errors corrected: the patent assertion about "a year after" is
 * cannot be deduced, not true; the congestion-toll assertion is rewritten so
 * that it is really false; reading has 11 questions, not 11 passages; the
 * distractor list and the pacing times are our own, not Bocconi's. Exam facts
 * come only from docs/research/course-facts-2026-11-04.md.
 */

/** The three fixed options of a true / false / cannot be deduced item, with notes. */
function tfc(notes: { true?: string; false?: string; cannot?: string }): CheckQuestion['options'] {
  return [
    { id: 'A', text: 'True', note: notes.true ?? '' },
    { id: 'B', text: 'False', note: notes.false ?? '' },
    { id: 'C', text: 'Cannot be deduced', note: notes.cannot ?? '' },
  ];
}

export const revisionReadingAndTrueFalseLesson: Lesson = {
  slug: 'revision-reading-and-true-false',
  title: 'Revision: reading and true, false or cannot be deduced',
  summary: 'The reading protocol, what counts as a valid inference, five distractor types and the three-gate test for true, false or cannot be deduced, on one sheet.',
  minutes: 28,
  objectives: [
    'Read a passage stem-first and reject options that rest on outside knowledge, causal leaps or extreme wording.',
    'Give an assertion the right verdict with the three-gate test: scope, contradiction, entailment.',
    'Spot the assertions that look deducible but are not: future claims, metric swaps, ignored middle groups and parts taken for wholes.',
  ],
  teachMd: md`
### Where these items sit

The standard test has 11 reading comprehension questions and 9 critical thinking questions out of 50, so together they are 20 questions, 40% of the test. Reading questions ask about explicit information and about implicit meaning, on passages about economic topics that may contain numbers and data. One of the two critical thinking formats gives a short passage and an assertion to judge true, false or cannot be deduced. Those items have three options, and a wrong answer to them costs −0.33 instead of the usual −0.2 (a right answer is +1, a blank 0).

### A reading protocol

75 minutes for 50 questions is 90 seconds a question on average. Our pacing suggestion, not a Bocconi figure, is about 75 seconds per reading or critical thinking item, which across 20 items banks about 5 minutes for mathematics.

| Step | Our suggested time | What to do |
| --- | --- | --- |
| 1. Read the stem first | 10 s | Find the keyword or the question type |
| 2. Map anchor lines | 25 s | Read the first and last sentence of each paragraph |
| 3. Track pivots | 20 s | Mark contrast words: however, yet, while, nevertheless |
| 4. Eliminate traps | 20 s | Cut extreme qualifiers and claims from outside the text |

Questions come three to a screen and you cannot return to a screen after moving on, so read the stems on a screen before the passage and settle each question before you press Next.

Pivots carry the author's point. When a passage sets out what supporters of an idea argue and then turns with "yet" to evidence against it, the main purpose is the contrast between the two halves, not either half alone; an option that calls for a ban is too extreme, and one about a detail in the first sentence is too narrow.

### What counts as a valid inference

| Valid | Invalid |
| --- | --- |
| Must be true if the passage is true | Plausible in business but unstated |
| Combines two explicit sentences with no new assumption | Assumes a past trend continues |
| Keeps the passage's cautious scope ("can", "some", "contributes to") | Uses real-world facts the passage does not give |

### Five common distractor types

This is our own classification, a revision aid, not a list Bocconi publishes.

| Distractor | Trigger words | How it misleads |
| --- | --- | --- |
| Extreme qualifier | always, never, only, all, impossible | Turns a moderate claim into an absolute rule |
| Causal invention | because, caused, triggered by | Turns two events at the same time into cause and effect |
| False comparison | more than, superior to, faster than | Compares two things the passage describes separately |
| Verbatim salad | the passage's own technical phrases | Repeats the words but reverses their relation |
| Scope shift | global, the entire industry, all citizens | Stretches a specific case into a universal truth |

A passage that says rate rises "coincided with" a fall in investment supports no option that says the rises "caused" it: that is causal invention.

### The three verdicts

| Verdict | Means |
| --- | --- |
| True | The passage, by logic or arithmetic, guarantees it |
| False | The passage rules it out |
| Cannot be deduced | Some situation that fits the passage makes it true and another makes it false |

### The three-gate test

1. **Scope.** Match every noun, number, time and group in the assertion to the passage. A new comparison, cause, time span or group usually means cannot be deduced.
2. **Contradiction.** Ask whether the passage rules the assertion out. Run this gate even when the assertion adds a new term: "zero competitors for nine months" is new wording, but a passage that guarantees competitors within six months still rules it out.
3. **Entailment.** Ask whether the assertion holds in every situation the passage allows. If it follows by logic or arithmetic, it is true.

When in doubt, build two situations, each consistent with the passage: one where the assertion holds and one where it fails. If you can build both, the verdict is cannot be deduced. The full lesson on [true, false or cannot be deduced](/courses/bocconi/true-false-or-cannot-be-deduced) works more cases.

### Assertions that look deducible but are not

| Passage says | Assertion | Why it cannot be deduced |
| --- | --- | --- |
| Exports rose 12% in 2025 | Exports will rise in 2026 | A claim about the future |
| Firm A has the highest revenue | Firm A is the most profitable | Revenue is not profit |
| 70% of managers supported Policy X | 30% of managers opposed it | Some may have been neutral or undecided |
| Training cut errors by 18% | Training is the best way to cut errors | Nothing was compared with other methods |
| The price fell at least 35% within six months | The price was still lower a year later | The passage says nothing about later |
| Renewables were the largest source | Solar was the largest source | A part is not the whole group |

Each row adds something: a time, a measure, a group or a comparison. That is the scope gate at work.
`,
  examples: [
    {
      id: 'example-solar-renewables',
      title: 'Part of a group, and a 100% complement',
      problemMd: md`*In 2025, national solar generation surged by 32%, propelling total renewable energy past natural gas to become the country's largest electricity source, at 44% of total grid output.*

Judge each assertion: (1) Solar was the largest grid source in 2025. (2) Natural gas supplied more than 44% of grid output in 2025. (3) Non-renewable sources supplied 56% of grid output in 2025.`,
      steps: [
        md`Assertion 1, scope gate: the passage says renewables as a group were largest. Solar is only part of that group. A split with solar at 30% of output, gas at 28% and every other single source smaller fits the passage and makes the assertion true; a split with solar at 10% and gas at 30% fits it and makes it false. **Cannot be deduced.**`,
        md`Assertion 2, contradiction gate: renewables went past gas and stand at 44%, so gas is below 44%. The passage rules the assertion out. **False.**`,
        md`Assertion 3, entailment gate: every source is either renewable or not, so the non-renewable share is $100\% - 44\% = 56\%$ in every situation the passage allows. **True.**`,
      ],
      answerMd: md`Cannot be deduced, false, true. Marking the first assertion true reads "solar surged" plus "renewables largest" as "solar largest", taking a part for the whole group.`,
    },
    {
      id: 'example-remote-share',
      title: 'The share doubled, the count fell',
      problemMd: md`*Between 2015 and 2025, the share of remote workers in Sector X doubled from 12% to 24%, while total employment in Sector X fell by 60% because of automation.*

Judge the assertion: The number of remote workers in Sector X rose between 2015 and 2025.`,
      steps: [
        md`Pick a convenient starting size: 100 workers in 2015, so $0.12 \times 100 = 12$ remote workers.`,
        md`A 60% fall leaves $100 \times 0.40 = 40$ workers in 2025, of whom $0.24 \times 40 = 9.6$ work remotely.`,
        md`The result does not depend on the starting size: the count is multiplied by $2 \times 0.4 = 0.8$ whatever the workforce was. So the number fell by 20%.`,
      ],
      answerMd: md`False: the number of remote workers fell by 20%. "True" is the tempting answer for anyone who reads "the share doubled" as "the number doubled".`,
    },
    {
      id: 'example-biologic-price',
      title: 'A strong pattern, but nothing about later',
      problemMd: md`*Whenever a blockbuster biologic drug loses patent exclusivity in the EU, biosimilar competitors enter the market within six months, reducing the average hospital procurement price of that molecule by at least 35%.*

Judge each assertion: (1) No EU blockbuster biologic keeps its pre-expiry hospital price a year after patent loss. (2) The original manufacturers lose 35% of their total profits. (3) Some EU blockbuster biologics face no competitors for nine months after expiry.`,
      steps: [
        md`Assertion 1, scope gate: the passage speaks about the first six months. It says nothing about the price twelve months on, which could have recovered or kept falling. It also speaks about the **average** price of the molecule, biosimilars included, not the original drug's own price. **Cannot be deduced.**`,
        md`Assertion 2 swaps the measure: a fall in a unit price says nothing certain about a company's total profit, which depends on volumes, costs and other products. **Cannot be deduced.**`,
        md`Assertion 3, contradiction gate: "whenever" covers every such drug, and competitors enter within six months, so none can go nine months without one. **False.**`,
      ],
      answerMd: md`Cannot be deduced, cannot be deduced, false. Calling the first assertion true is the trap: "at least 35% within six months" feels as if it must last, but the passage guarantees nothing beyond six months.`,
    },
    {
      id: 'example-congestion-toll',
      title: 'A rule with an exemption',
      problemMd: md`*Six months after City M introduced a €10 weekday congestion toll for private cars entering the historic centre, peak-hour vehicle entries fell by 22% while metro ridership rose by 15%. Electric vehicles were exempt from the toll.*

Judge each assertion: (1) The toll rules required every private car entering the centre on a weekday, electric cars included, to pay €10. (2) Every driver who stopped driving into the centre took the metro instead. (3) Peak-hour entries were lower six months after the toll than before it.`,
      steps: [
        md`Assertion 1 is a claim about the rule, not about which cars actually came in, and it names electric cars explicitly. The passage says electric vehicles were exempt, so the rules did not require an electric private car to pay. The passage rules the assertion out, whatever traffic there was. **False.**`,
        md`Assertion 2 turns two movements in the same period into a one-to-one transfer. Some drivers may have walked, cycled or stopped coming; some new metro riders may never have driven. **Cannot be deduced.**`,
        md`Assertion 3 restates the passage: entries fell by 22%. **True.**`,
      ],
      answerMd: md`False, cannot be deduced, true. Compare an assertion about what happened rather than about the rule, "All private cars that entered on Mondays paid €10": that is false only if some electric car actually entered on a Monday, which the passage does not say, so it cannot be deduced. A rule's exemption contradicts a claim about the rule, not automatically a claim about what happened.`,
    },
  ],
  traps: [
    {
      title: 'Not stated is not false',
      md: md`An assertion the passage never addresses feels wrong, so it gets marked false. False needs the passage to rule it out. If the passage is silent, as it is about which cars actually entered on a Monday, the verdict is cannot be deduced.`,
    },
    {
      title: 'A strong pattern is not a guarantee about later',
      md: md`"At least 35% within six months" invites the conclusion that the price is still lower a year on. The passage stops at six months. Any assertion that moves the time frame forward, or back, fails the scope gate.`,
    },
    {
      title: 'Part for the whole',
      md: md`When renewables as a group are the largest source, solar alone need not be. Check that the assertion names the same group as the passage, not a member of it or a larger group around it.`,
    },
    {
      title: 'Share up, count down',
      md: md`A share can double while the number it describes falls, if the total shrinks enough. Multiply the change in the share by the change in the total before you judge the count: $2 \times 0.4 = 0.8$ is a fall.`,
    },
    {
      title: 'The forgotten middle group',
      md: md`"70% supported" does not give "30% opposed": some people may have been neutral or undecided, or not answered. Only when the passage says every answer was yes or no is the complement fixed.`,
    },
  ],
  check: [
    {
      id: 'check-fibre-households',
      title: 'Fibre households',
      topic: 'Critical thinking',
      stimulusMd: md`*In 2026 the share of households in the town of Ferrano with a fibre broadband connection rose from 30% to 45%. The number of households in Ferrano did not change during the year.*`,
      stemMd: md`Is the following assertion true, false, or can it not be deduced from the passage? *The number of Ferrano households with a fibre connection rose by half in 2026.*`,
      options: tfc({
        false: md`Reads the rise of 15 percentage points as a 15% rise in the number. With the total fixed, the count changes in the same proportion as the share: from 30 to 45 is up by half.`,
        cannot: md`The actual number of households is not needed: the passage says it stayed the same, so whatever it was, the fibre count was multiplied by $\frac{45}{30} = 1.5$.`,
      }),
      answer: 'A',
      workingMd: md`Let the number of households be $H$, the same in both years. Fibre households went from $0.30H$ to $0.45H$, a ratio of $\frac{0.45}{0.30} = 1.5$, so the number rose by 50%, by half, whatever $H$ is. The rise in the share is 15 percentage points, but the assertion is about the number, and the passage fixes it by arithmetic. True.`,
      lesson: 'When the total is fixed, a count changes in the same proportion as its share; when the total changes too, multiply both changes.',
    },
    {
      id: 'check-shop-survey',
      title: 'A survey of shop owners',
      topic: 'Critical thinking',
      stimulusMd: md`*A survey of 400 of the 2,500 shop owners in Ferrano found that 62% of those surveyed expected their sales to rise next year.*`,
      stemMd: md`Is the following assertion true, false, or can it not be deduced from the passage? *Most of Ferrano's shop owners expect their sales to rise next year.*`,
      options: tfc({
        true: md`Stretches the result for the 400 surveyed owners to all 2,500. The passage says nothing about the 2,100 owners who were not surveyed.`,
        false: md`Counts only the 248 surveyed owners who expect a rise and compares them with 1,250. The 2,100 owners outside the survey might mostly expect a rise too, so the passage does not rule the assertion out.`,
      }),
      answer: 'C',
      workingMd: md`Of the 400 surveyed owners, $0.62 \times 400 = 248$ expect a rise. "Most of Ferrano's shop owners" means more than 1,250 of 2,500. If at least 1,003 of the 2,100 unsurveyed owners also expect a rise, the total passes 1,250 and the assertion is true; if few of them do, it is false. Both situations fit the passage, so the assertion cannot be deduced.`,
      lesson: 'A result for a sample says nothing certain about the people outside it: check that the assertion is about the same group as the passage.',
    },
    {
      id: 'check-museum-visitors',
      title: 'Young visitors at the museum',
      topic: 'Critical thinking',
      stimulusMd: md`*In March the Lorvia museum had 18,000 visitors, a third of them under 18. In April it had 15,000 visitors, 40% of them under 18.*`,
      stemMd: md`Is the following assertion true, false, or can it not be deduced from the passage? *The museum had more visitors under 18 in April than in March.*`,
      options: tfc({
        true: md`Compares the shares, 40% against a third, instead of the numbers. April's higher share is taken of a smaller total.`,
        cannot: md`The passage gives both totals and both shares, so both numbers can be worked out exactly; nothing is missing.`,
      }),
      answer: 'B',
      workingMd: md`March: $\frac{1}{3} \times 18\,000 = 6\,000$ visitors under 18. April: $0.40 \times 15\,000 = 6\,000$. The two numbers are equal, so April did not have more. The passage rules the assertion out: false.`,
      lesson: 'A higher share of a smaller total can give the same or a smaller number: compute both counts before comparing.',
    },
  ],
  takeaways: [
    'Read the stems first, track the pivots, and reject any option that needs outside knowledge, a causal leap or an extreme word.',
    'True means guaranteed by logic or arithmetic; false means ruled out; anything the passage allows both ways cannot be deduced.',
    'Run all three gates: a new term usually means cannot be deduced, but check for a contradiction before you decide.',
    'Watch for added time spans, swapped measures, ignored middle groups and parts taken for wholes.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-critical-thinking', skill: 'critical-thinking-deducibility' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
