import { md, type Lesson, type Unit } from '../../types';

/**
 * Bocconi standard test: Reading comprehension. Every passage and question is
 * original to this course; the countries, cities and firms are invented. The
 * only exam facts used are those in docs/research/course-facts-2026-11-04.md:
 * 11 reading comprehension questions; questions on explicit information and
 * on implicit meaning; passages that involve economic topics (GDP, deficit,
 * inflation) and may contain numbers and data; no calculator.
 */

const valmoraPassage = md`*In 2019 the city of Valmora introduced a charge on private cars entering its historic centre on weekdays. The charge was set at €5 a day, and the revenue was assigned by law to the city's bus network. In the first year, the number of cars entering the centre fell by 18%, and average bus journey times through the centre fell by about a tenth, because buses were no longer held up in traffic.*

*Shopkeepers in the centre had predicted that the charge would drive customers to out-of-town retail parks. The city's own survey, published two years later, found that footfall in the centre was roughly unchanged, but that the mix of visitors had shifted: fewer came by car, and more came by bus or by bicycle. The shopkeepers' association disputed the survey, arguing that it counted people passing through the centre rather than people buying there.*

*The council has since proposed raising the charge to €8. Supporters say the higher charge would pay for new bus routes; opponents say it would fall most heavily on tradespeople who need a vehicle for their work and cannot switch to public transport.*`;

const deficitPassage = md`*When a government runs a deficit, it borrows to cover the gap between what it spends and what it collects in taxes. Commentators often describe any deficit as a sign of poor management, comparing the state to a household that spends beyond its means. The comparison is appealing but incomplete. A household's income does not usually rise because it borrows; a government's tax revenue can, if the borrowed money is spent on roads, schools or research that make the economy more productive over time.*

*None of this means that deficits are harmless. Borrowing spent on projects that yield little, or borrowing that continues year after year while the economy is growing strongly, adds to the public debt without building the capacity to repay it. Interest on that debt must then be paid out of future taxes, leaving less for other spending.*

*The useful question, then, is not whether a government runs a deficit but what the borrowing pays for and when it happens. A deficit during a recession, when private spending has collapsed, can support jobs that would otherwise be lost. The same deficit during a boom is harder to defend. Judging fiscal policy by the size of the annual deficit alone, as many headline comparisons do, therefore says less than it appears to.*`;

const estriaPassage = md`*Between 2022 and 2024, the economy of Estria went through a sharp swing in prices. Consumer price inflation, which had been 2% in 2021, reached 9% in 2022 before easing to 5% in 2023 and 3% in 2024. The central bank raised its policy rate from 1% at the start of 2022 to 6% by the middle of 2023, and has held it there since.*

*Nominal GDP grew by 11% in 2022 and by 6% in 2023. The government's deficit fell from 5% of GDP in 2022 to 3% in 2023, partly because tax revenue, which is collected on nominal incomes and spending, rose faster than the government had budgeted. Public debt stood at 70% of GDP at the end of 2023.*

*Wages have lagged behind. Average nominal wages rose by 4% in 2022 and by 6% in 2023. Unions argue that workers have not yet recovered the purchasing power they lost, and point to the gap between the cumulative rise in prices and the cumulative rise in wages since the end of 2021. The finance ministry replies that in 2023 wage growth outpaced inflation.*`;

const explicitLesson: Lesson = {
  slug: 'reading-explicit-information',
  title: 'Finding explicit information in a passage',
  summary: 'Locate the sentence a detail question depends on, match its meaning rather than its words, and catch the qualifiers that make an option wrong.',
  minutes: 18,
  objectives: [
    'Locate the sentence or sentences an explicit-information question depends on.',
    'Match an option to the text by meaning, and reject options that overstate, relocate or misattribute it.',
    'Report figures from a passage with the right unit, period and quantity.',
  ],
  teachMd: md`
### What an explicit question asks

An explicit-information question asks what the passage actually says. Its stem usually contains a signal such as "according to the passage", "the passage states that" or "which of the following is mentioned". The answer sits in one or two sentences of the text, so the job is not to reason beyond the passage but to find those sentences and read them precisely.

That sounds easy, and that is exactly why these questions cost marks: readers answer from their memory of the passage rather than from the passage. Bocconi describes its reading passages as involving economic topics such as GDP, the deficit or inflation, and says they may contain numbers and data. A half-remembered figure or a misplaced qualifier is enough to pick the wrong option.

### Locate, then compare

Work in two separate moves.

1. **Locate.** Take one or two key words from the stem (a name, a date, a figure, a technical term) and find where the passage deals with them. Read that sentence and the sentences either side of it.
2. **Compare.** Hold each option against the sentence you found, word by word. An option is right only if everything in it is supported; one unsupported word makes it wrong.

Do not compare the options with each other first. Comparing options tells you which one *sounds* most likely; comparing them with the text tells you which one is *stated*.

### Expect paraphrase

The right option rarely copies the passage. "Exports fell for the third year running" may appear as "exports had declined in each of the previous three years". Wrong options, by contrast, often reuse the passage's exact words in a combination the passage never made. Treat a string of familiar words as a reason to check more carefully, not as evidence.

### Qualifiers carry the meaning

Small words decide whether an option matches.

| In the passage | An option that overstates it |
| --- | --- |
| some, several, many | most, all, the majority |
| may, can, could | will, always, must |
| tends to, is often | invariably |
| contributed to | caused, was the reason for |
| in the region | in the country |

It works the other way too: if the passage says "all", an option saying "some" is still true, because all includes some. Whether it is the best answer depends on what the stem asks, so read the stem again before you choose.

### Whose claim is it?

Economic passages often report several views: the government's, critics', a central bank's, the author's own. "According to the passage" covers everything the passage states, but "according to the shopkeepers" asks only for that group's view. A common wrong option takes a claim the passage attributes to one party and presents it as established fact, or gives it to the wrong party. When you locate the sentence, note who is speaking.

### Figures stated in the text

When a passage gives figures, an explicit question may simply ask you to report them correctly. Check three things:

- **The unit:** euros, percent, percentage points, thousands.
- **The period:** which year, which quarter, before or after a change.
- **The thing measured:** exports or imports, prices or the inflation rate, cars or buses.

An option with the right number attached to the wrong thing is one of the most common distractors there is.

### A routine for every explicit question

- Read the stem and name the target: who, what, when.
- Locate the sentence; read one sentence before it and one after.
- Strike every option that adds, strengthens, relocates or reassigns anything.
- Choose the option the text states, even if another option seems more interesting or more important.

This routine is slower than answering from memory by a few seconds per question, and it is the reason careful readers rarely lose marks on explicit questions.
`,
  examples: [
    {
      id: 'example-whose-claim',
      title: 'Who says what caused the rise?',
      problemMd: md`*In 2023 the port authority of Corvale cut docking fees for container ships by a quarter. Over the following year, container traffic through the port rose by 12%. Local business groups credited the fee cut. The port authority's own annual report, however, attributes most of the increase to the reopening of a rail link to the interior, completed the same year.*

According to the port authority's report, what caused most of the rise in container traffic?`,
      steps: [
        md`Name the target: the cause of most of the traffic rise, **according to the port authority's report**. The stem names a speaker, so only that speaker's view counts.`,
        md`Locate: two sentences give causes. "Local business groups credited the fee cut" is one party's view; "The port authority's own annual report ... attributes most of the increase to the reopening of a rail link" is the other.`,
        md`Compare: the report's answer is the rail link. The fee cut is mentioned, and it is the authority's own policy, which makes it tempting, but the passage gives that explanation to the business groups.`,
      ],
      answerMd: md`The reopening of the rail link to the interior. "The fee cut" is the tempting wrong answer: it is in the passage, but it is the business groups' explanation, not the report's.`,
    },
    {
      id: 'example-qualifiers',
      title: 'Many, some and most',
      problemMd: md`*Many small exporters in the region invoice their customers in euros, and some of them also buy insurance against exchange-rate movements.*

Which statement does the sentence support?

1. Most small exporters in the region insure against exchange-rate movements.
2. At least some small exporters in the region that invoice in euros also insure against exchange-rate movements.
3. Small exporters in the region that do not invoice in euros never insure against exchange-rate movements.`,
      steps: [
        md`Find what "some of them" refers to: "them" is the many small exporters who invoice in euros. So the sentence says that some exporters who invoice in euros also insure.`,
        md`Statement 1 turns "some" into "most", and also drops the restriction to exporters who invoice in euros. It overstates the text.`,
        md`Statement 3 makes a claim about exporters who do **not** invoice in euros. The sentence says nothing about them, so "never" is unsupported.`,
        md`Statement 2 restates the sentence with "at least some", which is exactly what "some" means.`,
      ],
      answerMd: md`Only statement 2 is supported. Statement 1 is the usual trap: "many" and "some" sound like "most", but neither means more than half.`,
    },
    {
      id: 'example-figures',
      title: 'Reporting a figure correctly',
      problemMd: md`*Household debt in Merania rose from 80% of disposable income in 2019 to 92% in 2024, while the share of that debt carrying a fixed interest rate fell from 60% to 45%.*

According to the passage, by how much did household debt as a share of disposable income rise between 2019 and 2024?`,
      steps: [
        md`Name the quantity: debt **as a share of disposable income**, not the fixed-rate share, which is the other pair of figures in the sentence.`,
        md`Read the two values: 80% in 2019 and 92% in 2024.`,
        md`The quantity is itself a percentage, so the natural answer is a difference in percentage points: $92 - 80 = 12$ points. As a percentage change of the ratio, that is $\frac{12}{80} = 0.15$, or 15%.`,
      ],
      answerMd: md`It rose by 12 percentage points (equivalently, the ratio rose by 15% of its 2019 level). An option of "15 percentage points" would be the fall in the fixed-rate share (60 to 45), attached to the wrong quantity.`,
    },
  ],
  traps: [
    {
      title: 'The familiar-words option',
      md: md`An option that repeats a phrase from the passage feels safe, but wrong options are often built from the passage's own words placed in a new combination. Judge an option by what it claims, not by how familiar it sounds; the right option is usually a paraphrase.`,
    },
    {
      title: 'The stronger version',
      md: md`The passage says "some", "may" or "contributed to"; the option says "most", "will" or "caused". Readers skim past the difference because the topic matches. Underline the qualifier in the passage and check that the option's qualifier is no stronger.`,
    },
    {
      title: 'Right number, wrong thing',
      md: md`Passages with figures give several numbers in the same sentence. An option may quote a real figure from the passage but attach it to the wrong quantity, year or group. Before accepting a number, confirm what it measures and when.`,
    },
    {
      title: 'A view treated as a fact',
      md: md`When a passage reports what critics, supporters or a ministry say, an option may present that view as something the passage establishes, or give it to a different party. Note the speaker of every claim you rely on.`,
    },
  ],
  check: [
    {
      id: 'check-charge-revenue',
      title: 'Where the revenue goes',
      topic: 'Reading comprehension',
      stimulusMd: valmoraPassage,
      stemMd: md`According to the passage, what was the revenue from the €5 charge required to fund?`,
      options: [
        { id: 'A', text: md`Road maintenance in the historic centre`, note: md`The passage never mentions road maintenance; it says the revenue was assigned to the bus network.` },
        { id: 'B', text: md`The city's bus network`, note: '' },
        { id: 'C', text: md`New bus routes`, note: md`New routes are what supporters say a higher €8 charge would pay for. That is a proposal, not where the existing revenue is required to go.` },
        { id: 'D', text: md`Compensation for shopkeepers in the centre`, note: md`Shopkeepers appear only as critics of the charge; no compensation is mentioned.` },
      ],
      answer: 'B',
      workingMd: md`The first paragraph states that "the revenue was assigned by law to the city's bus network". That is the only place the passage says where the revenue must go. New bus routes belong to the later proposal to raise the charge, and are claimed only by its supporters.`,
      lesson: 'Match the stem to the right moment in the passage: what is required now is not the same as what is proposed.',
    },
    {
      id: 'check-survey-finding',
      title: 'What the survey found',
      topic: 'Reading comprehension',
      stimulusMd: valmoraPassage,
      stemMd: md`Which of the following is stated in the passage?`,
      options: [
        { id: 'A', text: md`The charge caused footfall in the centre to fall.`, note: md`This is what the shopkeepers predicted; the city's survey found footfall roughly unchanged.` },
        { id: 'B', text: md`Bus journey times through the centre fell by 18%.`, note: md`18% is the fall in the number of cars entering the centre. Bus journey times fell by about a tenth.` },
        { id: 'C', text: md`The shopkeepers' association accepted the survey's finding that footfall was unchanged.`, note: md`The association disputed the survey, arguing that it counted people passing through rather than people buying.` },
        { id: 'D', text: md`According to the city's survey, fewer visitors arrived in the centre by car.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`The second paragraph reports the survey: footfall roughly unchanged, but "fewer came by car, and more came by bus or by bicycle". The option about visitors arriving by car paraphrases that, and attributes it correctly to the survey. The 18% figure belongs to cars, not bus journey times, and the association disputed rather than accepted the survey.`,
      lesson: 'Check each figure against the quantity it measures, and each claim against the party that makes it.',
    },
    {
      id: 'check-opponents-argument',
      title: 'The opponents of the higher charge',
      topic: 'Reading comprehension',
      stimulusMd: valmoraPassage,
      stemMd: md`According to the passage, opponents of raising the charge to €8 argue that the higher charge would`,
      options: [
        { id: 'A', text: md`leave less money for new bus routes`, note: md`The passage gives the opposite view to supporters, who say the higher charge would pay for new routes; opponents argue about who would pay.` },
        { id: 'B', text: md`drive shoppers to out-of-town retail parks`, note: md`This was the shopkeepers' prediction about the original charge, before it was introduced, not the opponents' argument against the rise.` },
        { id: 'C', text: md`weigh most on people who need a vehicle for their work and have no public-transport alternative`, note: '' },
        { id: 'D', text: md`fail to reduce the number of cars entering the centre`, note: md`No one in the passage makes this argument, and the passage reports that car numbers fell by 18% under the original charge.` },
      ],
      answer: 'C',
      workingMd: md`The last sentence says opponents believe the €8 charge "would fall most heavily on tradespeople who need a vehicle for their work and cannot switch to public transport". The option about people who need a vehicle for their work and have no public-transport alternative is a paraphrase of that. The other options either belong to other parties or are not in the passage.`,
      lesson: 'When the stem names a group, the answer is that group’s claim, usually paraphrased.',
    },
  ],
  takeaways: [
    md`Locate the sentence first, then compare each option with it word by word.`,
    md`The right option usually paraphrases; familiar words in a new combination are a warning sign.`,
    md`Check qualifiers: "some" is not "most", "may" is not "will", "contributed to" is not "caused".`,
    md`For every claim, note who makes it; for every figure, note its unit, period and quantity.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-reading-comprehension', skill: 'reading-explicit-information' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const implicitLesson: Lesson = {
  slug: 'reading-implicit-meaning',
  title: 'Reading for implicit meaning: inference, purpose and tone',
  summary: 'Draw only the inferences a passage supports, explain why an author includes a sentence, and read an author’s attitude without overstating it.',
  minutes: 20,
  objectives: [
    'Tell a supported inference from a merely plausible one.',
    'Identify what a sentence or example does in the author’s argument.',
    'Describe an author’s attitude in words no stronger than the passage’s own.',
  ],
  teachMd: md`
### From what is said to what follows

An implicit-meaning question asks for something the passage does not state in so many words but that the text supports. Bocconi lists implicit meaning alongside explicit information as what its reading questions ask about. Stems use phrases such as "it can be inferred", "the passage suggests", "the author implies", "the author would most likely agree" or "the author mentions X in order to".

On a test, an inference is narrower than in conversation. In everyday life you infer whatever is plausible; here the right answer must be supported by the text alone. Typically it follows from one sentence, or from combining two, with no outside knowledge added. Plausible is not enough. If you need a fact the passage never gives, the option goes.

### Three kinds of implicit question

**Inference.** Something follows from what is stated. The best inferences are usually modest: a careful restatement, a combination of two facts, a necessary consequence. They rarely sound exciting.

**Purpose and function.** Why does the author include a sentence, an example or a paragraph? Ask what it does in the argument: does it introduce a view to be challenged, give evidence for a claim, concede a point, or illustrate a general statement with a case? Signal words help. "However", "yet" and "but" often mark the author's turn away from a view just described; "for example" marks an illustration; "admittedly" or "none of this means" marks a concession.

**Attitude and tone.** What does the author think of a policy, a forecast or a view? Economic writing is usually measured, so the right answer is usually measured too: "sceptical", "qualified support", "cautious". Extreme words such as "contemptuous" or "enthusiastic" are rarely right unless the passage's language is equally strong.

### Test each option with two questions

1. **Is it supported by specific words in the passage?** Point to them. If you cannot, the option is out.
2. **Does it go further than those words?** An option that takes "may reduce" to "eliminates", or a claim about one region to the whole economy, has gone too far.

A good habit is to say, before reading the options, what the passage would let you conclude. The right answer is often close to your own modest version.

### Separate the author from the people described

Passages often present a view the author does not hold: "Commentators often argue that...", "Critics claim that...". The author's own view usually appears after a contrast word, or in evaluative language such as "appealing but incomplete" or "harder to defend". A question about what the author implies is about the author's view; an option that repeats the commentators' view is a classic wrong answer.

### Keep background knowledge out

Economic passages invite outside knowledge. You may know what usually happens to bond prices when interest rates rise, or what central banks tend to do in a recession. That knowledge can help you follow the passage, but it cannot justify an answer. An option that is true in the real world but has no basis in the passage is not an inference from the passage.

### Purpose questions: describe the move, not the topic

When asked why the author mentions something, the right answer describes what the mention *does* ("to introduce a view the author then qualifies"); wrong answers often describe what it is *about* ("to explain how households borrow"). Read the sentence after the mention: what the author does next usually shows why the mention was there.

### Tone: collect the evaluative words

To judge attitude, list the words in which the author evaluates rather than reports: "appealing", "incomplete", "harder to defend", "says less than it appears to". Their direction (positive, negative, mixed) and their strength (mild, strong) give you the answer. A passage that concedes a point and then criticises shows a qualified, not a hostile, attitude.
`,
  examples: [
    {
      id: 'example-combining-two-sentences',
      title: 'Combining two sentences',
      problemMd: md`*The regional development fund lends only to firms with fewer than 50 employees. Last year it made its largest loan to Tessil Nord, a textile firm.*

Which of the following can be inferred?

1. Tessil Nord had fewer than 50 employees when it received the loan.
2. Tessil Nord is the largest firm the fund has lent to.
3. Tessil Nord still has fewer than 50 employees today.`,
      steps: [
        md`Combine the two sentences: the fund lends **only** to firms with fewer than 50 employees, and it lent to Tessil Nord. So when the loan was made, Tessil Nord met the rule.`,
        md`Statement 2 confuses the largest **loan** with the largest **firm**. A smaller firm can receive a larger loan; the passage says nothing about the firms' relative sizes.`,
        md`Statement 3 moves the time. The rule applied when the loan was made; nothing in the passage says the firm has not grown since.`,
      ],
      answerMd: md`Only statement 1 can be inferred. Statement 3 is the tempting one: it sounds like a restatement, but it adds a claim about the present that the passage does not support.`,
    },
    {
      id: 'example-purpose',
      title: 'Why does the author mention it?',
      problemMd: md`*It is often said that a weaker currency is good for a country's economy because it makes exports cheaper abroad. For exporters that buy few of their inputs abroad, this is largely true. Many manufacturers, however, import most of their components and energy, and for them a weaker currency raises costs almost as fast as it lifts sales.*

The author mentions the view that a weaker currency is good for the economy primarily in order to`,
      steps: [
        md`Look at what happens next. The author first concedes ("this is largely true") for one group of exporters, then turns with "however" to a group for whom the view fails.`,
        md`So the view is introduced to be qualified: true for some firms, much less true for others.`,
        md`Check the strength. The author does not say a weaker currency harms the economy; that would go further than the passage, which concedes the view holds for some exporters.`,
      ],
      answerMd: md`To introduce a common view that the author then qualifies by showing it holds only for some exporters. "To argue that a weaker currency harms the economy" is the tempting overstatement.`,
    },
    {
      id: 'example-tone',
      title: 'Reading the author’s attitude',
      problemMd: md`*The ministry's growth forecast, which has overestimated growth in each of the past four years, again predicts that the economy will expand by 2.5% next year. The ministry has not explained what will be different this time.*

The author's attitude towards the forecast is best described as`,
      steps: [
        md`Collect the evaluative details: the forecast "has overestimated growth in each of the past four years"; it "again" predicts growth; the ministry "has not explained what will be different".`,
        md`All three point the same way: the author doubts the forecast. That rules out "neutral" and "approving".`,
        md`Check the strength. There is no insult and no claim that the ministry is dishonest; the author lets the record speak. "Sceptical" fits; "hostile" or "contemptuous" would overstate it.`,
      ],
      answerMd: md`Sceptical. "Hostile" is the tempting wrong answer: the direction is right, but the strength is not supported by the measured language.`,
    },
  ],
  traps: [
    {
      title: 'Plausible but unsupported',
      md: md`An option describes something that would probably be true in the real world. It catches readers who know some economics. Ask where in the passage it comes from; if you can point to nothing, reject it.`,
    },
    {
      title: 'One step too far',
      md: md`The passage says a policy "may" help some firms; the option says it helps the economy. Each step looks small, but together they turn a modest claim into a sweeping one. The right inference stays as narrow as the text.`,
    },
    {
      title: 'The view the author reports',
      md: md`Passages often describe a view in order to argue against it. An option that restates that view is tempting because the words are in the passage. Check whether the author endorses the view or turns away from it with "however", "but" or "incomplete".`,
    },
    {
      title: 'Extreme tone',
      md: md`Options such as "dismissive", "hostile" or "enthusiastic" catch readers who sense the right direction. Economic passages are usually measured; match both the direction and the strength of the author's words.`,
    },
  ],
  check: [
    {
      id: 'check-household-comparison',
      title: 'Why the household comparison?',
      topic: 'Reading comprehension',
      stimulusMd: deficitPassage,
      stemMd: md`The author mentions the comparison between a government and a household primarily in order to`,
      options: [
        { id: 'A', text: md`show that governments should budget the way households do`, note: md`This is the commentators' view, which the author calls "appealing but incomplete"; the author argues against applying it without qualification.` },
        { id: 'B', text: md`introduce a common view that the author then argues is incomplete`, note: '' },
        { id: 'C', text: md`prove that government deficits are harmless`, note: md`The author says the opposite in the second paragraph: "None of this means that deficits are harmless."` },
        { id: 'D', text: md`explain how households can raise their income by borrowing`, note: md`This describes the topic of a sentence, not its purpose, and reverses it: the passage says a household's income does not usually rise because it borrows.` },
      ],
      answer: 'B',
      workingMd: md`The comparison is attributed to commentators, and the very next sentence judges it: "The comparison is appealing but incomplete." The author then explains what it misses (borrowing can raise future tax revenue). So the comparison is there to be qualified. The author neither endorses it nor claims deficits are harmless.`,
      lesson: 'A view the author reports and then evaluates is usually there to be qualified; read the sentence that follows it.',
    },
    {
      id: 'check-hardest-to-justify',
      title: 'Which deficit would the author defend least?',
      topic: 'Reading comprehension',
      stimulusMd: deficitPassage,
      stemMd: md`It can be inferred that the author would regard which of the following as hardest to justify?`,
      options: [
        { id: 'A', text: md`Borrowing during a recession to pay for road building`, note: md`The author says a deficit during a recession can support jobs, and that borrowing for roads can raise future revenue: both features count in its favour.` },
        { id: 'B', text: md`A deficit in a year when private spending has collapsed`, note: md`This is the case the author defends most clearly: a deficit when private spending has collapsed "can support jobs that would otherwise be lost".` },
        { id: 'C', text: md`Borrowing year after year during strong growth to fund projects that yield little`, note: '' },
        { id: 'D', text: md`A balanced budget during a boom`, note: md`The passage criticises deficits during a boom; a balanced budget in a boom involves no borrowing, so nothing in the passage counts against it.` },
      ],
      answer: 'C',
      workingMd: md`The second paragraph names two features that make borrowing hard to defend: spending on projects "that yield little", and borrowing that "continues year after year while the economy is growing strongly". The third paragraph adds that a deficit during a boom is "harder to defend". Only the option about borrowing year after year during strong growth for low-yield projects combines both criticised features.`,
      lesson: 'Inference questions about the author’s judgement are answered by matching the options to the criteria the author has already stated.',
    },
    {
      id: 'check-headline-comparisons',
      title: 'The author’s attitude to headline deficits',
      topic: 'Reading comprehension',
      stimulusMd: deficitPassage,
      stemMd: md`The author's attitude towards judging fiscal policy by the size of the annual deficit alone is best described as`,
      options: [
        { id: 'A', text: md`approving, because the deficit is the clearest single measure of fiscal policy`, note: md`The author says this approach "says less than it appears to", which is a criticism, not approval.` },
        { id: 'B', text: md`dismissive of deficits as irrelevant to fiscal policy`, note: md`Too strong. The author treats deficits as relevant (some are "harder to defend") and objects only to judging by their size alone.` },
        { id: 'C', text: md`neutral; the author takes no position`, note: md`The final sentence takes a clear position, introduced by "therefore".` },
        { id: 'D', text: md`critical, because the size alone leaves out what the borrowing pays for and when it happens`, note: '' },
      ],
      answer: 'D',
      workingMd: md`The last paragraph says the useful question is "what the borrowing pays for and when it happens", and concludes that judging by the size of the deficit alone "says less than it appears to". That is a measured criticism with a stated reason. The author does not call deficits irrelevant.`,
      lesson: 'Match the attitude in both direction and strength: a measured criticism is not dismissal.',
    },
  ],
  takeaways: [
    md`A test inference must be supported by the passage alone; plausible is not enough.`,
    md`The best inference is usually modest: a restatement, a combination of two facts, or a necessary consequence.`,
    md`For purpose questions, describe what the mention does in the argument, not what it is about.`,
    md`Separate the author's view from the views the author reports, and match tone in strength as well as direction.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-reading-comprehension', skill: 'reading-implicit-meaning' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const dataLesson: Lesson = {
  slug: 'reading-economic-passages-with-data',
  title: 'Economic passages with figures',
  summary: 'Read GDP, deficit and inflation figures correctly: rates against levels, deficit against debt, nominal against real, and points against percent.',
  minutes: 22,
  objectives: [
    'Use the economic terms that passages rely on without confusing related quantities.',
    'Turn nominal figures into approximate real ones, and compound rates over several years.',
    'Check a numerical claim in an option against the passage’s figures by hand.',
  ],
  teachMd: md`
### Why the vocabulary matters

Bocconi describes the passages in the reading area as involving economic topics, for example GDP, the deficit and inflation, and says they may contain numbers and data. You are not tested on economics as a subject, but a passage can only be read correctly if its terms are understood correctly, and several everyday words mean something precise in economics. Most wrong answers on data-rich passages come from treating two related quantities as if they were the same.

### Terms that are easy to confuse

| Term | What it measures | Easily confused with |
| --- | --- | --- |
| GDP | The value of everything an economy produces in a period | GDP per person (GDP divided by population) |
| Nominal | Measured at the prices of the time | Real: adjusted for changes in prices |
| Inflation rate | How fast prices are rising | The price level itself |
| Deficit | How much more a government spends than it collects in one year (a flow) | Debt: the total owed, built up over many years (a stock) |
| "% of GDP" | An amount divided by GDP | The amount itself |
| Share | A part as a fraction of a total | The size of the part |

### Falling inflation is not falling prices

If inflation falls from 6% to 3%, prices are still rising, only more slowly. Prices fall only when inflation is negative. An option such as "prices fell in 2024", after a passage reporting that inflation fell to 3%, reads a rate as if it were a level.

### Deficits add to debt

A deficit is the gap in one year; the debt is the stock it adds to. A government can cut its deficit sharply and still see its debt rise, because a smaller deficit is still new borrowing. Whether the debt *ratio* (debt divided by GDP) rises is a separate question: it also depends on how fast GDP grows.

### Nominal and real

Nominal figures include the effect of rising prices; real figures remove it. For small rates, a good approximation is:

$$\text{real growth} \approx \text{nominal growth} - \text{inflation}$$

Nominal GDP up 5% with inflation at 3% means real GDP up about 2%. The same rule applies to wages: a 4% pay rise with 6% inflation is a fall in real wages of about 2%. The exact calculation divides the multipliers ($\frac{1.05}{1.03} \approx 1.019$), but the approximation is almost always enough to choose an option.

### Percentage points and percent

When the figure is itself a rate or a ratio, a change can be reported two ways. Unemployment rising from 8% to 10% is a rise of 2 percentage points, and a rise of 25% in the rate. Debt rising from 60% to 66% of GDP is a rise of 6 points, or of one tenth. Read which one the question asks for.

### Rates compound

Inflation of 9%, then 5%, then 3% does not add up to 17% over three years. Each year's rise is taken on a higher price level, so the yearly multipliers are multiplied: $1.09 \times 1.05 \times 1.03 \approx 1.179$, a rise of about 17.9%. When an option claims a cumulative figure that is a plain sum of yearly rates, be suspicious.

### Reading the passage with the data in mind

- On the first read, note which quantities are given and in which unit: percent of GDP, euros, percentage growth, index points.
- When two parties argue about the same figures, check whether they measure the same thing over the same period. Often both are right about different things: one about a single year, the other about a cumulative total.
- Before choosing an option that makes a numerical claim, do the arithmetic, even roughly. Calculators are not allowed on the test, so practise the multiplications by hand.
`,
  examples: [
    {
      id: 'example-inflation-falls',
      title: 'Inflation fell. Did prices?',
      problemMd: md`*In Norland, consumer price inflation fell from 6% in 2023 to 3% in 2024.*

Which statement follows? (1) Consumer prices were lower at the end of 2024 than at the end of 2023. (2) Consumer prices were higher at the end of 2024 than at the end of 2023. (3) Consumer prices rose by 3 percentage points less in 2024 than in 2023, so they were 3% lower.`,
      steps: [
        md`Name the quantity: inflation is the **rate** at which prices rise, not the price level.`,
        md`An inflation rate of 3% in 2024 means prices rose by 3% during 2024. A positive rate means prices went up.`,
        md`Statement 1 reads the fall in the rate as a fall in prices. Statement 3 does the same with the numbers: the rate fell by 3 points, but prices still rose by 3%.`,
      ],
      answerMd: md`Statement 2: prices were higher at the end of 2024, about 3% higher than a year earlier. Prices rose more slowly; they did not fall.`,
    },
    {
      id: 'example-deficit-and-debt',
      title: 'A deficit, yet a steady debt ratio',
      problemMd: md`A government starts the year with debt of €500 billion, and GDP is €1,000 billion. During the year it runs a deficit of €20 billion, covered entirely by new borrowing, and nominal GDP grows by 4%. What happens to the debt and to the debt-to-GDP ratio?`,
      steps: [
        md`The deficit is new borrowing, so the debt rises: $500 + 20 = 520$ billion euros.`,
        md`GDP grows by 4%: $1{,}000 \times 1.04 = 1{,}040$ billion euros.`,
        md`Ratio before: $\frac{500}{1{,}000} = 50\%$. Ratio after: $\frac{520}{1{,}040} = 50\%$.`,
        md`Check by growth rates: debt grew by $\frac{20}{500} = 4\%$, exactly as fast as GDP, so the ratio cannot change.`,
      ],
      answerMd: md`The debt rises to €520 billion, but the debt ratio stays at 50% of GDP. "The ratio must rise because there was a deficit" is the tempting wrong conclusion: the ratio also depends on the growth of GDP.`,
    },
    {
      id: 'example-real-wage',
      title: 'A pay rise that is a pay cut',
      problemMd: md`Average nominal wages rise by 3% in a year in which inflation is 5%. What happened to real wages?`,
      steps: [
        md`Use the approximation: real change $\approx 3\% - 5\% = -2\%$.`,
        md`Check exactly with multipliers: $\frac{1.03}{1.05} \approx 0.981$, a fall of about 1.9%.`,
        md`Both routes agree: wages buy about 2% less than a year earlier.`,
      ],
      answerMd: md`Real wages fell by about 2%. "Wages rose by 3%" is true only in nominal terms; it is the tempting wrong answer when a question asks about purchasing power.`,
    },
  ],
  traps: [
    {
      title: 'Reading a rate as a level',
      md: md`"Inflation fell" is read as "prices fell"; "growth slowed" is read as "the economy shrank". A falling positive rate still means a rising level. Ask whether the figure is a level or a rate of change before you judge an option.`,
    },
    {
      title: 'Deficit for debt',
      md: md`A falling deficit is taken to mean a falling debt. As long as there is any deficit, the debt rises. Keep the flow (one year's gap) apart from the stock (the total owed).`,
    },
    {
      title: 'Nominal for real',
      md: md`A wage or GDP figure that rose in euros is taken as a rise in what it can buy. Subtract inflation (approximately) before deciding whether anything rose in real terms.`,
    },
    {
      title: 'Adding yearly rates',
      md: md`Three years of 9%, 5% and 3% inflation give about 17.9%, not 17%, because each rise applies to a higher level. Multiply the multipliers when an option states a cumulative figure.`,
    },
    {
      title: 'Points for percent',
      md: md`A ratio moving from 60% to 66% of GDP has risen by 6 points and by 10%. Options often include both numbers; read which the question asks for.`,
    },
  ],
  check: [
    {
      id: 'check-estria-prices',
      title: 'What happened to prices?',
      topic: 'Reading comprehension',
      stimulusMd: estriaPassage,
      stemMd: md`Which statement about consumer prices in Estria is supported by the passage?`,
      options: [
        { id: 'A', text: md`Prices rose in every year from 2021 to 2024.`, note: '' },
        { id: 'B', text: md`Prices fell in 2023 and in 2024.`, note: md`Inflation fell in those years, from 9% to 5% to 3%, but positive inflation means prices still rose.` },
        { id: 'C', text: md`Prices at the end of 2024 were lower than at the end of 2022.`, note: md`Reads the falling inflation rate as a falling price level. With inflation of 5% and then 3%, prices kept rising after 2022.` },
        { id: 'D', text: md`Prices rose by exactly 17% over 2022, 2023 and 2024 together.`, note: md`Adds the yearly rates. Compounded, $1.09 \times 1.05 \times 1.03 \approx 1.179$, a rise of about 17.9%.` },
      ],
      answer: 'A',
      workingMd: md`The passage gives inflation of 2% (2021), 9% (2022), 5% (2023) and 3% (2024). Every rate is positive, so prices rose in every one of those years. The rate fell after 2022, but a lower positive rate is slower growth of prices, not a fall. The cumulative rise over the last three years is $1.09 \times 1.05 \times 1.03 \approx 1.179$, about 17.9%, not exactly 17%.`,
      lesson: 'A positive inflation rate always means rising prices; only a negative rate means falling prices.',
    },
    {
      id: 'check-estria-real-wages',
      title: 'Real wages in 2023',
      topic: 'Reading comprehension',
      stimulusMd: estriaPassage,
      stemMd: md`According to the figures in the passage, by roughly how much did average real wages change in 2023?`,
      options: [
        { id: 'A', text: md`They fell by about 5%.`, note: md`This is roughly the 2022 change: wages up 4% against inflation of 9%.` },
        { id: 'B', text: md`They fell by about 1%.`, note: md`Subtracts in the wrong direction. Wages (6%) rose faster than prices (5%), so real wages rose.` },
        { id: 'C', text: md`They rose by about 1%.`, note: '' },
        { id: 'D', text: md`They rose by about 6%.`, note: md`6% is the nominal rise. It ignores the 5% rise in prices in the same year.` },
      ],
      answer: 'C',
      workingMd: md`In 2023 nominal wages rose by 6% and inflation was 5%. Real change $\approx 6\% - 5\% = +1\%$. Exactly: $\frac{1.06}{1.05} \approx 1.0095$, a rise of just under 1%. This matches the ministry's statement that wage growth outpaced inflation in 2023.`,
      lesson: 'Real change is roughly nominal change minus inflation, for the same year.',
    },
    {
      id: 'check-estria-two-claims',
      title: 'Unions against the ministry',
      topic: 'Reading comprehension',
      stimulusMd: estriaPassage,
      stemMd: md`Using the figures for 2022 and 2023, which statement about the claims of the unions and the finance ministry is correct?`,
      options: [
        { id: 'A', text: md`The two claims contradict each other, so one of the figures in the passage must be wrong.`, note: md`They do not contradict each other: the ministry speaks about one year, 2023; the unions about the cumulative change since the end of 2021. Both can be true.` },
        { id: 'B', text: md`Because wages outpaced prices in 2023, workers fully recovered the purchasing power they lost in 2022.`, note: md`One year of a 1% real gain does not undo 2022's fall of about 5%; cumulative wages still trail prices.` },
        { id: 'C', text: md`The deficit fell in 2023 because wages rose faster than prices.`, note: md`The passage attributes the fall in the deficit partly to tax revenue rising faster than budgeted, not to the gap between wages and prices.` },
        { id: 'D', text: md`Over the two years, wages rose by about 10% and prices by about 14%, which supports the unions' claim, while the ministry's statement about 2023 is also true.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Cumulative prices: $1.09 \times 1.05 = 1.1445$, about 14%. Cumulative wages: $1.04 \times 1.06 = 1.1024$, about 10%. Wages trail prices over the two years, as the unions say. In 2023 alone, wages (6%) beat inflation (5%), as the ministry says. The claims measure different periods, so both hold.`,
      lesson: 'When two parties cite the same data, check the period each one measures before deciding who is right.',
    },
  ],
  takeaways: [
    md`Falling inflation means prices rise more slowly, not that they fall.`,
    md`A deficit is one year's gap and adds to the debt; the debt ratio also depends on GDP growth.`,
    md`Real change is roughly nominal change minus inflation.`,
    md`Yearly rates compound: multiply the multipliers rather than adding the percentages.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-reading-comprehension', skill: 'reading-economic-data-passages' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const readingUnit: Unit = {
  slug: 'reading',
  title: 'Reading comprehension',
  summary: 'The standard Online Bocconi Test has 11 reading comprehension questions. Bocconi says the passages involve economic topics such as GDP, the deficit and inflation, may contain numbers and data, and ask about both explicit information and implicit meaning. These lessons teach how to find what a passage states, what it implies, and how to read its figures. Every passage here is original, and the places and firms in it are invented.',
  lessons: [explicitLesson, implicitLesson, dataLesson],
};
