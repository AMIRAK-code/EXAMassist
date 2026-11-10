import { md, type Lesson } from '../../types';

const bikePassage = md`
**[1]** City councils that launch bike-sharing schemes usually justify them as a way to cut car traffic. The early evidence seemed to agree: in several mid-sized cities, the number of car journeys into the centre fell in the first year after a scheme opened.

**[2]** A closer look at who rides the bikes complicates this picture. Surveys of riders in those cities found that most shared-bike trips replaced walking or bus journeys, not car journeys. The fall in car traffic, it turns out, coincided with a rise in fuel prices and with new parking charges introduced in the same years.

**[3]** None of this means the schemes waste public money. Riders report shorter journey times, and buses on crowded routes become less full. But councils would do better to defend the schemes on those grounds than on a traffic effect the data do not show.
`;

export const readingPassagesForStructureLesson: Lesson = {
  slug: 'reading-passages-for-structure',
  title: 'Reading passages for structure',
  summary: 'Read a passage for the job each paragraph does, separate the author’s view from the views reported, and answer structure questions from a quick map.',
  minutes: 18,
  objectives: [
    'Name the role of each paragraph (claim, evidence, objection, concession, conclusion) in one pass.',
    'Tell the author’s own position apart from views the author reports or attacks.',
    'Answer "the paragraph serves to" and "the author mentions X in order to" questions from a passage map.',
  ],
  teachMd: md`
### Why structure comes first

Bocconi describes its reading comprehension items as questions on passages that test the quality of your processing of the information. Processing is not memorising. A reader who remembers every figure in a passage but cannot say what the passage is *doing* will struggle with most of the questions, because most of them ask about relationships: which claim the evidence supports, what a paragraph adds, where the author stands. Those relationships are the passage's **structure**, and you can read for it on purpose.

### Every paragraph has a job

Most argumentative passages are built from a handful of moves. When you finish a paragraph, ask: what is this paragraph doing for the passage?

| Role | What it does | Typical signals |
| --- | --- | --- |
| Background | Sets the scene or describes a policy or event | (often none) |
| Received view | States what others believe or claim | "it is often argued", "advocates say", "the usual view" |
| Evidence | Gives data, examples or observations | "for instance", "surveys found", figures |
| Challenge | Questions a claim or an interpretation | "yet", "however", "a closer look" |
| Concession | Grants part of the other side | "admittedly", "this does not mean", "granted" |
| Conclusion or recommendation | States what follows, or what should be done | "therefore", "so", "would do better to" |

A typical shape is: a common view with its evidence, then a challenge, then a concession and a qualified conclusion. Once you can see the shape, most structure questions answer themselves.

### Whose view is it?

Passages often report views the author does not hold. "Advocates argue that…" tells you what advocates think, not what the author thinks. The author's own position shows in three places:

1. **Evaluative words**: "convincingly", "overstated", "complicates this picture", "the data do not show".
2. **Turns**: what follows "but", "yet" or "however" is usually closer to the author's view than what came before.
3. **The conclusion**: recommendations and "so" sentences are the author speaking.

A common wrong answer attributes a reported view to the author, or the author's view to the people the author is criticising.

### Signal words, and their limits

Signal words tell you how two sentences relate:

| Relation | Signals |
| --- | --- |
| Contrast | however, yet, but, nevertheless, on the other hand |
| Continuation | moreover, also, similarly, in addition |
| Cause and effect | because, since, so, as a result, therefore |
| Concession | although, admittedly, granted, none of this means |
| Example | for instance, for example, such as |

They are clues, not proof. "However" may introduce only a small qualification rather than a full reversal, so read the sentence it introduces before deciding how far it turns.

### A passage map (our method)

Bocconi gives no method; this one is ours. On the first read, write one short line per paragraph on your scratch sheet: its role and its point in a few words. For the passage in this lesson's check, a map might read:

- P1: received view (bikes cut traffic) + early evidence.
- P2: challenge (riders came from walking and buses; other causes).
- P3: concession (schemes still useful) + author's recommendation.

That map takes well under a minute and answers most structure questions without re-reading. Return to the text for wording and details only when a question needs them.

### How structure questions are worded

- "The second paragraph primarily serves to…"
- "Which best describes the organisation of the passage?"
- "The author mentions X in order to…"
- "Which of the following is a view the author attributes to others?"

Answer with your map, then test each option against two things: is the **role** right (supports, challenges, qualifies, illustrates), and is the **target** right (which claim it supports or challenges)? Many wrong options get one right and the other wrong: they name the correct paragraph content but the wrong job, or the correct job aimed at the wrong claim.

### Function is not content

An option can describe a paragraph's content accurately and still be wrong, because the question asks for the paragraph's function. "The second paragraph reports survey results" is true of many passages; "the second paragraph questions the interpretation of the first paragraph's evidence" says why those results are there. When a question asks what a part of the passage *does*, prefer the option with a verb of purpose (challenge, qualify, illustrate, explain) over one that only restates what it says.
`,
  examples: [
    {
      id: 'example-map-museum-passage',
      title: 'Mapping a three-paragraph passage',
      problemMd: md`Map this passage, one line per paragraph.

**[1]** When the city's museums dropped their entry fees ten years ago, the stated aim was to widen their audience. Visitor numbers doubled within two years.

**[2]** Yet visitor surveys carried out since then suggest the audience changed less than the numbers did. Most of the extra visits came from people who already visited, now coming more often; the share of visitors from the city's poorer districts barely moved.

**[3]** Free entry may still be worth its cost, since frequent visits have value of their own. But if the aim is a wider audience, the museums will need to do more than remove the fee, for instance by running programmes in the districts they are not reaching.`,
      steps: [
        md`Paragraph 1 states a policy, its aim and a headline result. It contains no evaluation, so it is background plus the evidence that seems to show success. Map: "P1: policy + aim (wider audience) + numbers doubled".`,
        md`Paragraph 2 opens with "Yet", a contrast, and "suggest the audience changed less than the numbers did" evaluates the headline. Its survey results are evidence for that challenge. Map: "P2: challenge: more visits, same people".`,
        md`Paragraph 3 opens with a concession ("may still be worth its cost") and then turns ("But") to a recommendation. Map: "P3: concession + recommendation (outreach)".`,
        md`Read the map as a whole: headline success, challenge to what it means, qualified conclusion. The author does not deny that visits doubled; the author denies that the audience widened.`,
      ],
      answerMd: md`P1: policy, aim and headline result. P2: challenge to the interpretation, with survey evidence. P3: concession and recommendation. Tempting misreading: "the passage argues free entry failed"; the author concedes it may be worth its cost and objects only to the claim that it widened the audience.`,
    },
    {
      id: 'example-mentions-in-order-to',
      title: '"The author mentions X in order to…"',
      problemMd: md`In the museum passage, why does the author mention that "the share of visitors from the city's poorer districts barely moved"?

Candidate answers: (i) to show that the policy failed to raise visitor numbers; (ii) to support the claim that the audience did not widen; (iii) to explain why the museums dropped their fees.`,
      steps: [
        md`Find the detail in the map: it sits in P2, the challenge paragraph. Its job is to support that paragraph's point.`,
        md`P2's point is that the audience changed less than the numbers did. A stable share from poorer districts is direct evidence that the audience did not widen, so candidate (ii) fits role and target.`,
        md`Candidate (i) has the target wrong: P1 says visitor numbers doubled, and the author never disputes that.`,
        md`Candidate (iii) has the role wrong: the reason for dropping fees is given in P1 (to widen the audience); the survey detail comes later and evaluates the result.`,
      ],
      answerMd: md`The detail supports the claim that the audience did not widen. The tempting wrong answer, "to show the policy failed to raise numbers", aims the evidence at a claim the author never makes.`,
    },
    {
      id: 'example-qualify-or-refute',
      title: 'Qualify or refute?',
      problemMd: md`Does the third paragraph of the museum passage refute the first, qualify it, or support it?`,
      steps: [
        md`To refute is to show a claim false. The third paragraph does not deny any fact in the first: the fees were dropped and visits did double.`,
        md`To qualify is to limit a claim or say under what conditions it holds. The third paragraph says the policy may be worth its cost but does not achieve the stated aim on its own.`,
        md`It also does not simply support the first paragraph, since it adds a condition ("will need to do more") that the first paragraph did not mention.`,
      ],
      answerMd: md`It qualifies: it accepts the policy's value but limits what it achieved and adds what else is needed. "Refutes" is the tempting overstatement; strong verbs like refute, reject and disprove are wrong whenever the author concedes part of the point.`,
    },
  ],
  traps: [
    {
      title: 'Giving the author someone else’s view',
      md: md`"Councils justify the schemes as a way to cut traffic" is the councils' claim, which the author goes on to question. Before you choose an option that says "the author believes", check that the sentence it rests on is in the author's own voice and not a reported view.`,
    },
    {
      title: 'Describing content when the question asks for function',
      md: md`An option can repeat exactly what a paragraph says and still be wrong, because the question asked what the paragraph does. Prefer options with a purpose verb (challenge, illustrate, qualify) that matches your map.`,
    },
    {
      title: 'Overstating the turn',
      md: md`"However" and "yet" signal contrast, but not necessarily a full rejection. If the author concedes part of the earlier point, options with "refute", "reject" or "prove wrong" are too strong.`,
    },
    {
      title: 'Reading for every detail first',
      md: md`Trying to absorb every figure on the first read costs time you cannot recover on a forward-only test. Read for roles first; go back into the passage for a detail only when a question needs it.`,
    },
  ],
  check: [
    {
      id: 'check-second-paragraph-role',
      title: 'The job of the second paragraph',
      topic: 'Reading comprehension',
      stimulusMd: bikePassage,
      stemMd: md`The second paragraph primarily serves to`,
      options: [
        { id: 'A', text: md`provide further evidence for the claim reported in the first paragraph`, note: md`The second paragraph works against the first paragraph's claim: it shows most trips replaced walking and buses, not cars.` },
        { id: 'B', text: md`question the interpretation of the evidence given in the first paragraph`, note: '' },
        { id: 'C', text: md`propose a new policy for reducing car traffic`, note: md`No policy is proposed in the second paragraph; fuel prices and parking charges are mentioned as alternative causes, not as proposals.` },
        { id: 'D', text: md`list the benefits of bike-sharing that the third paragraph goes on to reject`, note: md`The benefits (shorter journeys, less crowded buses) appear in the third paragraph, and the author accepts them rather than rejecting them.` },
      ],
      answer: 'B',
      workingMd: md`The first paragraph reports a fall in car journeys as evidence that the schemes cut traffic. The second does not dispute the fall; it shows that riders mostly switched from walking and buses, and that other causes coincided with the fall. That is a challenge to how the evidence was read, not to the evidence itself.`,
      lesson: 'A challenge paragraph often accepts the facts and attacks the interpretation; say which.',
    },
    {
      id: 'check-passage-organisation',
      title: 'The shape of the passage',
      topic: 'Reading comprehension',
      stimulusMd: bikePassage,
      stemMd: md`Which best describes the organisation of the passage as a whole?`,
      options: [
        { id: 'A', text: md`A problem is described, two solutions are compared, and one is recommended.`, note: md`Only one policy, bike-sharing, is discussed; nothing is compared with it as an alternative solution.` },
        { id: 'B', text: md`A theory is stated, tested against evidence, and shown to be false in every respect.`, note: md`Too strong: the author concedes that the schemes have real benefits, so the passage does not reject everything said for them.` },
        { id: 'C', text: md`A common view is supported with data, and the author then adds further examples in its favour.`, note: md`The author turns against the common view in the second paragraph instead of adding support for it.` },
        { id: 'D', text: md`A common justification is reported, its evidence is called into question, and a different justification is recommended.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`The map is: P1, the councils' traffic justification and its early evidence; P2, a challenge showing the evidence does not establish a traffic effect; P3, a concession that the schemes have other benefits and a recommendation to defend them on those grounds. Only the option naming those three moves in that order fits.`,
      lesson: 'Check an organisation option move by move against your paragraph map, including the strength of each move.',
    },
    {
      id: 'check-mentions-fuel-prices',
      title: 'Why mention fuel prices?',
      topic: 'Reading comprehension',
      stimulusMd: bikePassage,
      stemMd: md`The author mentions the rise in fuel prices and the new parking charges in order to`,
      options: [
        { id: 'A', text: md`suggest another explanation for the fall in car journeys`, note: '' },
        { id: 'B', text: md`argue that councils should raise parking charges further`, note: md`The author makes no recommendation about parking charges; the only recommendation concerns how to justify bike-sharing.` },
        { id: 'C', text: md`show that bike riders chose the bikes to save money`, note: md`The passage gives no reason why riders chose the bikes; the costs are linked to the fall in car traffic, not to riders' motives.` },
        { id: 'D', text: md`explain why buses on crowded routes became less full`, note: md`Less crowded buses are a benefit of the bikes in the third paragraph; the costs in the second paragraph are aimed at car traffic.` },
      ],
      answer: 'A',
      workingMd: md`The detail sits in the challenge paragraph. Having shown that riders did not mostly come from cars, the author points to two other things that happened at the same time and could have reduced car journeys. Its target is the fall in car traffic and its role is an alternative explanation.`,
      lesson: 'For "in order to" questions, locate the detail in your map; its paragraph’s job tells you its job.',
    },
  ],
  takeaways: [
    'Read for the job of each paragraph, then come back for details when a question needs them.',
    'The author speaks through evaluative words, turns and conclusions; reported views are not the author’s.',
    'A structure option must have the right role and the right target.',
    'Strong verbs (refute, reject, disprove) are wrong when the author concedes part of the point.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-verbal-reasoning', skill: 'grad-verbal-passage-reasoning' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
