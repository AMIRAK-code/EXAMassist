import { md, type CheckQuestion, type Lesson, type Unit } from '../../types';

/**
 * Bocconi standard test: Critical thinking. Every passage and question is
 * original to this course; the firms and people are invented. The only exam
 * facts used are those in docs/research/course-facts-2026-11-04.md: 9 critical
 * thinking questions; two formats (choose which statements about given data
 * are true or false; judge an assertion about a short passage as true, false
 * or cannot be deduced); three-option critical thinking items score -0.33
 * when wrong, other wrong answers -0.2, a blank 0 and a correct answer 1.
 * Assumption, strengthen/weaken and flaw items are not presented as a format
 * of the standard test.
 */

/** The three fixed options of a true / false / cannot be deduced item, with notes. */
function tfc(notes: { true?: string; false?: string; cannot?: string }): CheckQuestion['options'] {
  return [
    { id: 'A', text: 'True', note: notes.true ?? '' },
    { id: 'B', text: 'False', note: notes.false ?? '' },
    { id: 'C', text: 'Cannot be deduced', note: notes.cannot ?? '' },
  ];
}

const orsaPassage = md`*Every employee of Orsa Logistics who works night shifts receives a 15% pay supplement. Some employees at Orsa's north depot work night shifts. No employee at Orsa's south depot works night shifts. Marta is an employee at the south depot.*`;

const tfcLesson: Lesson = {
  slug: 'true-false-or-cannot-be-deduced',
  title: 'True, false or cannot be deduced',
  summary: 'Judge an assertion against a short passage with the two-scenario test, and keep "false" apart from "not stated" and "true" apart from "likely".',
  minutes: 20,
  objectives: [
    'Define the three verdicts precisely and apply them to a statement about a passage.',
    'Use the two-scenario test, with invented figures where the passage has numbers.',
    'Keep outside knowledge and likely-but-unstated conclusions out of the verdict.',
  ],
  teachMd: md`
### The format

One of the two critical thinking formats Bocconi lists for the standard test gives a short passage followed by an assertion, and you judge whether the assertion is true, false, or cannot be deduced from the passage. These items have only three options, and Bocconi scores a wrong answer to a three-option critical thinking item at −0.33 rather than the −0.2 used elsewhere; a correct answer still scores 1 and a blank 0.

### The three verdicts, defined

Everything depends on using the three labels precisely.

| Verdict | Means | Test |
| --- | --- | --- |
| True | The passage guarantees the statement | No situation consistent with the passage makes it false |
| False | The passage guarantees the opposite | No situation consistent with the passage makes it true |
| Cannot be deduced | The passage allows both | One situation consistent with the passage makes it true, another makes it false |

"True" does not mean "probably true", "reasonable" or "what usually happens". It means the passage leaves no alternative. "False" does not mean "not mentioned"; it means the passage rules the statement out. Everything in between is "cannot be deduced".

### The two-scenario test

The most reliable way to decide is to try to build situations.

1. Accept everything the passage says, and nothing else.
2. Try to describe a situation that fits the passage and makes the statement true.
3. Try to describe a situation that fits the passage and makes the statement false.

If only the first is possible, the answer is true. If only the second, false. If both, cannot be deduced. With numbers, the situations can be concrete: invent figures that satisfy the passage and see what happens to the statement. One pair of invented figures that goes each way settles a "cannot be deduced".

### Only the passage counts

Your own knowledge stays out. If a passage about an invented bank says nothing about its interest rates, a statement about those rates cannot be deduced, however predictable it seems. Equally, a statement you know to be true in the real world is not "true" here unless the passage supports it.

What you may, and must, use is the ordinary meaning of words and simple arithmetic. If the passage says revenue rose by 10% and costs by 12%, you are entitled to work out what that does to costs as a share of revenue.

### Words that change the verdict

- **Some** means at least one, and possibly all. "Some managers work remotely" does not imply that some do not.
- **All** is contradicted by a single exception, so the opposite of "all" is "not all", not "none".
- **Every A is B** does not mean every B is A. If every night-shift worker gets a supplement, a day worker might get it too, for another reason.
- **Most** means more than half.
- **Only**, **unless** and **if** set conditions that run in one direction; the lesson on quantifiers and conditionals covers them.

### A sensible order of work

Read the passage carefully once, because each word may matter. Then, for each statement:

- find the sentence or sentences of the passage it relates to;
- decide whether the statement adds anything those sentences do not give;
- run the two-scenario test.

If the statement restates, combines or follows arithmetically from the passage, it is true. If it contradicts the passage, it is false. If it goes beyond the passage in any way, it cannot be deduced.

### Guessing with three options

With three options, a blind guess has a one-in-three chance of +1 and a two-in-three chance of −0.33, an expected value of about +0.11 points. Once you can rule out one verdict with confidence, a guess between the other two is worth about a third of a point on average. The lesson on [negative marking and guessing](/courses/bocconi/negative-marking-and-guessing) works through the numbers.
`,
  examples: [
    {
      id: 'example-cooperatives',
      title: 'Three statements, three verdicts',
      problemMd: md`*All the cooperatives in the Lavine valley sell their wine through a single distributor, Vinaria. Vinaria also sells wine from producers outside the valley. Cantina Rossa is a cooperative in the Lavine valley.*

Judge each statement: (1) Cantina Rossa sells its wine through Vinaria. (2) Every wine Vinaria sells comes from the Lavine valley. (3) Some producers outside the valley are cooperatives.`,
      steps: [
        md`Statement 1 combines two sentences: all valley cooperatives sell through Vinaria, and Cantina Rossa is a valley cooperative. No situation fitting the passage makes it false. **True.**`,
        md`Statement 2 is contradicted by the second sentence: Vinaria sells wine from producers outside the valley. **False.**`,
        md`Statement 3: the passage says nothing about whether producers outside the valley are cooperatives. A situation where some are and one where none are both fit the passage. **Cannot be deduced.**`,
      ],
      answerMd: md`True, false, cannot be deduced. Statement 3 is the one people get wrong, by marking it false because the passage never says so; "not stated" is not "false".`,
    },
    {
      id: 'example-bakery',
      title: 'Using invented figures',
      problemMd: md`*In 2025 a bakery's revenue rose by 10% and its costs rose by 12%.*

Judge each statement: (1) The bakery's profit fell in 2025. (2) The bakery's costs as a share of its revenue rose in 2025.`,
      steps: [
        md`Statement 1, first situation: revenue 100 rises to 110, costs 50 rise to $50 \times 1.12 = 56$. Profit goes from 50 to 54: it rose.`,
        md`Second situation: revenue 100 rises to 110, costs 95 rise to $95 \times 1.12 = 106.4$. Profit goes from 5 to 3.6: it fell.`,
        md`Both situations fit the passage, so statement 1 **cannot be deduced**.`,
        md`Statement 2: the ratio costs ÷ revenue is multiplied by $\frac{1.12}{1.10}$, which is greater than 1, whatever the starting figures. So the share rose. **True.**`,
      ],
      answerMd: md`Statement 1 cannot be deduced; statement 2 is true. Marking statement 1 true ("costs grew faster, so profit fell") is the tempting error: it holds only if costs were already a large part of revenue.`,
    },
    {
      id: 'example-some',
      title: 'Some, and the rest',
      problemMd: md`*Some of the firm's managers work remotely.*

Judge the statement: Some of the firm's managers do not work remotely.`,
      steps: [
        md`"Some" means at least one, and possibly all.`,
        md`Situation 1: three of ten managers work remotely; then some do not, and the statement is true.`,
        md`Situation 2: all ten work remotely; "some work remotely" is still true, and the statement is false.`,
      ],
      answerMd: md`Cannot be deduced. In conversation "some" hints "not all", but the passage does not say so.`,
    },
  ],
  traps: [
    {
      title: 'Not mentioned is not false',
      md: md`A statement about something the passage does not discuss feels wrong, so it is marked false. False requires the passage to rule it out. If the passage is simply silent, the verdict is cannot be deduced.`,
    },
    {
      title: 'Likely is not true',
      md: md`A statement that would usually follow in real life (costs grew faster, so profit fell) is marked true. True requires that no situation fitting the passage makes it false. Try to build one; if you can, it is not true.`,
    },
    {
      title: 'Reading "every A is B" backwards',
      md: md`"Every night-shift worker gets the supplement" is read as "only night-shift workers get it". The rule says nothing about anyone else. Keep the direction of the rule.`,
    },
    {
      title: 'Bringing in the real world',
      md: md`Your knowledge of how banks, firms or markets usually behave fills a gap in the passage. On these items the passage is the whole world. Use only its statements, ordinary word meanings and arithmetic.`,
    },
  ],
  check: [
    {
      id: 'check-marta-supplement',
      title: 'Does Marta get the supplement?',
      topic: 'Critical thinking',
      stimulusMd: orsaPassage,
      stemMd: md`Is the following statement true, false, or can it not be deduced from the passage? *Marta does not receive a 15% pay supplement.*`,
      options: tfc({
        true: md`Assumes that only night-shift workers receive the supplement. The passage says every night-shift worker receives it, not that no one else does.`,
        false: md`Nothing in the passage says Marta receives the supplement; she works at a depot with no night shifts, so the rule does not give it to her.`,
      }),
      answer: 'C',
      workingMd: md`Marta works at the south depot, where no one works night shifts, so the night-shift rule does not apply to her. But the rule runs one way: night-shift work guarantees the supplement; the passage does not say that the supplement is paid only for night shifts. A situation where Marta receives a 15% supplement for some other reason fits the passage, and so does one where she receives none. The statement cannot be deduced.`,
      lesson: '"Every A is B" says nothing about those who are not A.',
    },
    {
      id: 'check-south-depot-nights',
      title: 'Night shifts at the south depot',
      topic: 'Critical thinking',
      stimulusMd: orsaPassage,
      stemMd: md`Is the following statement true, false, or can it not be deduced from the passage? *At least one employee at the south depot works night shifts.*`,
      options: tfc({
        true: md`Perhaps confuses the depots: it is the north depot where some employees work night shifts.`,
        cannot: md`The passage is not silent here: it says no employee at the south depot works night shifts, which rules the statement out.`,
      }),
      answer: 'B',
      workingMd: md`The third sentence says "No employee at Orsa's south depot works night shifts." The statement claims at least one does, which is the exact opposite. No situation consistent with the passage makes it true, so it is false.`,
      lesson: 'A statement is false only when the passage rules it out, as "no employee" rules out "at least one employee".',
    },
    {
      id: 'check-sales-up-down',
      title: 'Up 20%, then down 20%',
      topic: 'Critical thinking',
      stimulusMd: md`*A firm's sales in 2024 were 20% higher than in 2023. Its sales in 2025 were 20% lower than in 2024.*`,
      stemMd: md`Is the following statement true, false, or can it not be deduced from the passage? *The firm's sales in 2025 were lower than its sales in 2023.*`,
      options: tfc({
        false: md`Assumes a 20% rise and a 20% fall cancel, or that the fall leaves sales higher. They do not cancel: the fall is taken of the larger 2024 figure.`,
        cannot: md`No extra data is needed: the result holds for every starting value, because 2025 sales are always 96% of 2023 sales.`,
      }),
      answer: 'A',
      workingMd: md`Let 2023 sales be $S$. Then 2024 sales are $1.2S$ and 2025 sales are $0.8 \times 1.2S = 0.96S$. Whatever $S$ is (sales are positive), $0.96S < S$. The statement follows from the passage by arithmetic alone, so it is true.`,
      lesson: 'Arithmetic on the passage’s own figures is allowed; if a result holds for every starting value, the statement is true.',
    },
  ],
  takeaways: [
    md`True means the passage leaves no alternative; false means it rules the statement out; anything else cannot be deduced.`,
    md`Test with two situations: if one fits the passage and makes the statement true and another makes it false, it cannot be deduced.`,
    md`"Not mentioned" is not false, and "likely" is not true.`,
    md`Use only the passage, the ordinary meaning of words and arithmetic.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-critical-thinking', skill: 'critical-thinking-deducibility' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const conclusionsLesson: Lesson = {
  slug: 'drawing-valid-conclusions',
  title: 'Drawing valid conclusions from data and statements',
  summary: 'Find the one statement the data guarantees: orderings, overlaps, averages and percentages, each tested for must-be-true rather than could-be-true.',
  minutes: 22,
  objectives: [
    'Separate statements that must be true from statements that could be true.',
    'Organise orderings and overlapping groups so that what is fixed and what can vary is visible.',
    'Combine averages and percentages from groups of different sizes correctly.',
  ],
  teachMd: md`
### The format

The other critical thinking format Bocconi lists for the standard test gives some data or statements and asks you to choose which statement is true (or which is false). Unlike the three-verdict items, several candidate statements are offered, and your task is to find the one the data guarantees.

### Must be true, not could be true

The decisive distinction is between a statement that **must** be true given the data and one that merely **could** be true. Several options will usually be consistent with the data; only one will be forced by it. For each option ask: is there any arrangement of the facts, consistent with everything given, in which this statement is false? If there is, it is not the answer to a "must be true" question.

For a "which is false" question, flip the test: the answer is the statement that cannot be true in any arrangement consistent with the data. A statement that merely might be false is not enough.

### Orderings

Many items give comparisons: A sold more than B, C sold less than A, and so on. Turn them into a vertical line, highest at the top, and place each item only where the data forces it. Comparisons chain (if A is above B and B is above C, then A is above C), but an item compared with only one other may float. If all you know about an item is that it is below Neri, it could sit anywhere below Neri. Mark its possible positions rather than picking one.

### Overlaps

When two groups come from the same total, their overlap has limits even if it is not given. If 130 of 200 firms export and 110 have a website, at least $130 + 110 - 200 = 40$ firms do both, because otherwise the two groups would need more than 200 firms between them. The overlap is at most 110, the size of the smaller group. Anything from 40 to 110 is possible, so "at least 40 do both" must be true, while "exactly 40 do both" could be true but need not be.

### Averages and totals

An average is a total divided by a count. When data gives averages for groups of different sizes, the overall average is not the simple average of the group averages: go back to totals. Group averages also say nothing about individuals: an average salary of €2,600 in one office and €2,100 in another does not mean that everyone in the first earns more than everyone in the second.

### Percentages of different bases

A percentage is always a percentage of something. If 30% of the men and 30% of the women in a firm work part-time, then 30% of everyone does. But if 30% of the north office and 50% of the south office do, the overall rate lies somewhere between 30% and 50%, depending on the sizes of the offices. Without the sizes, a statement fixing the overall rate cannot be guaranteed.

### Working method

1. Organise the data: a line for orderings, a quick count for overlaps, totals for averages.
2. Before reading the options, note what is fixed and what can vary.
3. Test each option against the parts that can vary. An option that depends on one of them is not guaranteed.
4. Choose the option that holds in every arrangement. If two seem to, re-read both: one usually depends on an assumption you made without noticing.

### Why this format rewards care

The wrong options in these items are rarely absurd. Each is usually true in at least one arrangement, often the first arrangement that comes to mind. That is why picking an arrangement and checking options against it fails: you need to check them against all the arrangements the data allows.
`,
  examples: [
    {
      id: 'example-fund-returns',
      title: 'An ordering with a floating item',
      problemMd: md`Five funds are ranked by last year's return, with no ties. Alfa beat Beta. Gamma beat Alfa. Delta did worse than Beta. Epsilon did worse than Alfa. Which statement must be true: (1) Gamma had the highest return; (2) Delta had the lowest return; (3) Epsilon beat Delta?`,
      steps: [
        md`Chain the fixed comparisons: Gamma above Alfa, Alfa above Beta, Beta above Delta. So Gamma, Alfa, Beta, Delta from top to bottom.`,
        md`Epsilon is known only to be below Alfa. It could sit between Alfa and Beta, between Beta and Delta, or below Delta.`,
        md`Statement 1: everyone else is below Gamma (Alfa directly, Beta and Delta through Alfa, Epsilon through Alfa). It must be true.`,
        md`Statement 2 fails if Epsilon is below Delta; statement 3 fails in exactly that case too. Both could be true but need not be.`,
      ],
      answerMd: md`Only statement 1 must be true. Statements 2 and 3 are true in the arrangement most people draw first, which is why they tempt.`,
    },
    {
      id: 'example-overlap',
      title: 'How many firms do both?',
      problemMd: md`Of 200 firms surveyed, 130 export and 110 have a website. Which must be true: (1) at least 40 firms both export and have a website; (2) exactly 40 do both; (3) more firms export than have a website?`,
      steps: [
        md`Minimum overlap: $130 + 110 - 200 = 40$. If fewer than 40 did both, the exporters and the website owners together would exceed 200 firms.`,
        md`Maximum overlap: 110, if every firm with a website also exports. Any value from 40 to 110 fits the data.`,
        md`Statement 1 holds for every possible overlap. Statement 2 picks one value from the range. Statement 3 compares 130 with 110 directly: it is given by the data.`,
      ],
      answerMd: md`Statements 1 and 3 must be true; statement 2 could be true but need not be. In a single-answer item, "exactly 40" is the classic wrong option: it treats the minimum as the actual value.`,
    },
    {
      id: 'example-branch-average',
      title: 'Average of two groups',
      problemMd: md`Branch 1 has 30 staff with an average monthly salary of €2,000. Branch 2 has 20 staff with an average of €2,500. What is the average salary across both branches?`,
      steps: [
        md`Go back to totals: Branch 1 pays $30 \times 2{,}000 = 60{,}000$ euros; Branch 2 pays $20 \times 2{,}500 = 50{,}000$ euros.`,
        md`Overall: $\frac{60{,}000 + 50{,}000}{50} = \frac{110{,}000}{50} = 2{,}200$ euros.`,
        md`Check: the answer lies between 2,000 and 2,500 and nearer to 2,000, because Branch 1 is larger.`,
      ],
      answerMd: md`€2,200. The simple average of the two averages, €2,250, is the tempting wrong answer.`,
    },
  ],
  traps: [
    {
      title: 'Could be true taken for must be true',
      md: md`An option fits the arrangement you drew, so you choose it. But the data may allow other arrangements. Before choosing, try to build one in which the option fails.`,
    },
    {
      title: 'The minimum overlap taken as the overlap',
      md: md`From 130 and 110 out of 200 you work out 40 and pick "exactly 40". The data fixes only a range. "At least" statements are guaranteed; "exactly" statements usually are not.`,
    },
    {
      title: 'Averaging averages',
      md: md`Two group averages are averaged as if the groups were the same size. Multiply each average by its group size, add, and divide by the total count.`,
    },
    {
      title: 'From averages to individuals',
      md: md`A higher average in one group is read as "everyone in that group earns more". Averages describe groups, not their members.`,
    },
  ],
  check: [
    {
      id: 'check-sales-agents',
      title: 'Ranking five sales agents',
      topic: 'Critical thinking',
      stimulusMd: md`*Five sales agents, Fabbri, Greco, Leone, Moro and Neri, each closed a different number of contracts in March. Greco closed more than Fabbri but fewer than Neri. Moro closed more than Neri. Leone closed fewer than Neri.*`,
      stemMd: md`Which of the following statements must be true?`,
      options: [
        { id: 'A', text: md`Leone closed fewer contracts than Greco.`, note: md`Leone is known only to be below Neri; Leone could sit between Neri and Greco, above Greco.` },
        { id: 'B', text: md`Moro closed the most contracts.`, note: '' },
        { id: 'C', text: md`Fabbri closed the fewest contracts.`, note: md`Leone could be below Fabbri, in which case Leone closed the fewest.` },
        { id: 'D', text: md`Greco ranked third.`, note: md`Greco is third only if Leone is below Greco. If Leone is between Neri and Greco, Greco is fourth.` },
      ],
      answer: 'B',
      workingMd: md`Fixed chain: Moro above Neri, Neri above Greco, Greco above Fabbri. Leone is below Neri but otherwise free: above Greco, between Greco and Fabbri, or below Fabbri. Everyone is below Neri except Moro, and Moro is above Neri, so Moro is at the top in every arrangement. The statements about Leone, Fabbri and Greco each fail in at least one arrangement.`,
      lesson: 'Place each item only where the data forces it, and test every option against all the positions a floating item can take.',
    },
    {
      id: 'check-two-exams',
      title: 'Students who passed both',
      topic: 'Critical thinking',
      stimulusMd: md`*All 120 students in a course sat two exams. 85 passed the economics exam and 70 passed the statistics exam.*`,
      stemMd: md`Which of the following statements must be true?`,
      options: [
        { id: 'A', text: md`Exactly 35 students passed both exams.`, note: md`35 is the smallest possible number who passed both. The number could be anything from 35 to 70.` },
        { id: 'B', text: md`At least 15 students failed both exams.`, note: md`15 is the difference between the two pass counts, not a count of failures. If every student passed at least one exam, none failed both.` },
        { id: 'C', text: md`At least 35 students passed both exams.`, note: '' },
        { id: 'D', text: md`At least half the students passed both exams.`, note: md`Half the course is 60. The overlap could be as low as 35, so this need not hold.` },
      ],
      answer: 'C',
      workingMd: md`The two pass groups add up to $85 + 70 = 155$ places among 120 students, so at least $155 - 120 = 35$ students are in both. The overlap can be as large as 70 (every statistics pass also passed economics). So "at least 35" holds in every case; "exactly 35" and "at least 60" do not. The number failing both is $120$ minus those who passed at least one, which can be anything from 0 to 35.`,
      lesson: 'Two groups from the same total overlap by at least their sum minus the total; the exact overlap is usually not fixed.',
    },
    {
      id: 'check-two-branches',
      title: 'Salaries at two branches',
      topic: 'Critical thinking',
      stimulusMd: md`| Branch | Employees | Average monthly salary (€) |
| --- | --- | --- |
| Riva | 40 | 2,100 |
| Sole | 10 | 2,600 |`,
      stemMd: md`Which of the following statements must be true?`,
      options: [
        { id: 'A', text: md`Every employee at Sole earns more than every employee at Riva.`, note: md`Averages describe groups, not individuals; a Riva employee could earn more than a Sole employee.` },
        { id: 'B', text: md`Sole's total monthly salary bill is larger than Riva's.`, note: md`Sole's bill is $10 \times 2{,}600 = 26{,}000$ euros against Riva's $40 \times 2{,}100 = 84{,}000$ euros.` },
        { id: 'C', text: md`The average monthly salary across both branches is €2,350.`, note: md`This is the simple average of the two averages, which ignores that Riva has four times as many employees.` },
        { id: 'D', text: md`The average monthly salary across both branches is €2,200.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`Totals: Riva $40 \times 2{,}100 = 84{,}000$ euros, Sole $10 \times 2{,}600 = 26{,}000$ euros. Overall average: $\frac{84{,}000 + 26{,}000}{50} = \frac{110{,}000}{50} = 2{,}200$ euros. The result sits nearer Riva's average because Riva is the larger branch.`,
      lesson: 'Combine group averages through totals, weighting each group by its size.',
    },
  ],
  takeaways: [
    md`Choose the statement that holds in every arrangement the data allows, not the one that fits your first drawing.`,
    md`Two groups from one total overlap by at least their sum minus the total; "exactly" is rarely guaranteed.`,
    md`Combine averages through totals, and never read a group average as a fact about each member.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-critical-thinking', skill: 'critical-thinking-draw-conclusions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const exclusionLesson: Lesson = {
  slug: 'excluding-unsupported-implications',
  title: 'Excluding unsupported implications',
  summary: 'Spot the plausible leaps a passage does not support (cause from correlation, a rule run backwards, sample to population) and keep the modest truths.',
  minutes: 20,
  objectives: [
    'Name the extra premise an attractive conclusion would need.',
    'Recognise the common leaps: correlation to cause, converse of a rule, sample to population, average to every member.',
    'Keep the implications that are fully supported, even when they look modest.',
  ],
  teachMd: md`
### What an unsupported implication is

Many critical thinking statements sound like natural conclusions of a passage but need something the passage does not supply. Recognising these unsupported implications, and rejecting them however reasonable they sound, matters in both critical thinking formats Bocconi lists: the statement you must not choose is very often a plausible next step that goes one step too far.

### The question to ask

For any candidate conclusion, ask: **what would I have to add to the passage to make this certain?** If the answer is "nothing", the conclusion is supported. If you need an extra premise, however modest ("and nothing else changed", "and the survey was representative", "and that is the only reason"), the conclusion cannot be deduced from the passage.

### The usual leaps

| Leap | The passage gives | The unsupported conclusion |
| --- | --- | --- |
| Correlation to cause | Provinces with more bank branches save more | Opening branches raises saving |
| Converse of a rule | Every applicant over the limit is refused | Every refused applicant was over the limit |
| Sample to population | 70% of one bank's surveyed customers never visit a branch | 70% of all bank customers never visit a branch |
| Average to every member | Average income in the town rose | Every household's income rose |
| Average of percentages to total | The departments' cuts average 15% | Total spending fell by 15% |
| Past to future | Prices rose in each of the last five years | Prices will rise next year |
| Some to most | Some exporters insure against currency risk | Most exporters insure |

### Correlation and cause

When two things move together, several explanations are possible: one causes the other, the other causes the one, a third factor drives both, or the link is coincidence. In the bank-branch case, banks may open branches where people already save more. A passage that reports only the association does not establish any of these. A statement claiming a cause is not deducible unless the passage itself states the causal link.

### Rules run one way

"If an applicant's repayments would exceed 35% of income, the loan is refused" tells you what happens to applicants over the limit. It says nothing about why other loans are refused; refusals can have many causes. The valid move in the other direction is the contrapositive: if a loan was approved, the repayments did not exceed 35%.

### Averages and percentages hide the parts

An average can rise while some members fall. And percentage changes of parts of different sizes cannot be averaged into a total. If three departments that spend €50,000, €30,000 and €20,000 cut that spending by 0%, 10% and 35%, the average of the three cuts is 15%, but total spending falls by €10,000 out of €100,000, which is 10%.

### What is supported

Rejecting leaps does not mean rejecting everything. Some implications are fully supported, and the test rewards spotting them too:

- If every part fell, the total fell.
- If an average fell, at least one member fell.
- If all A are B and X is an A, then X is B.
- If two groups from one total add up to more than the total, they overlap.

A well-built item often places one supported implication among several attractive leaps. The supported one tends to look modest; the leaps look interesting. Do not reject the modest statement because it seems too obvious to be the answer.
`,
  examples: [
    {
      id: 'example-branches-and-saving',
      title: 'Branches and saving',
      problemMd: md`*In a study of 40 provinces, those with more bank branches per resident had higher household saving rates.*

Judge the statement: Opening more bank branches in a province raises its household saving rate.`,
      steps: [
        md`Ask what must be added to make the statement certain: that the branches cause the saving, rather than the other way round or both being driven by something else.`,
        md`Alternative 1: banks open branches where households already save more. Alternative 2: richer provinces both save more and attract more branches.`,
        md`The passage reports only that the two go together. Each explanation fits it, so the causal claim is not established.`,
      ],
      answerMd: md`Cannot be deduced. The tempting verdict is true, because the causal story is plausible; but plausibility is an extra premise the passage does not give.`,
    },
    {
      id: 'example-travel-cuts',
      title: 'Average cut against total cut',
      problemMd: md`Three departments spent €50,000, €30,000 and €20,000 on travel in 2023. In 2024 they cut that spending by 0%, 10% and 35% respectively. By how much did their total travel spending fall?`,
      steps: [
        md`The cuts in euros: $0$; $0.10 \times 30{,}000 = 3{,}000$; $0.35 \times 20{,}000 = 7{,}000$.`,
        md`Total cut: $0 + 3{,}000 + 7{,}000 = 10{,}000$ euros, out of a total of $100{,}000$ euros: 10%.`,
        md`The simple average of the percentages is $\frac{0 + 10 + 35}{3} = 15\%$. It overstates the cut because the largest percentage cut fell on the smallest budget.`,
        md`What is supported without the budgets: since no department increased its spending and some cut it, the total fell. Its size needs the budgets.`,
      ],
      answerMd: md`Total spending fell by 10%. "15%" is the unsupported implication: an average of percentages is not the percentage change of the total.`,
    },
    {
      id: 'example-survey',
      title: 'A sample and its population',
      problemMd: md`*In a survey of 400 customers of an online bank, all of whom answered, 280 said they had not visited a bank branch in the past year.*

Judge each statement: (1) 70% of the surveyed customers had not visited a branch in the past year. (2) Most of the country's bank customers no longer visit branches. (3) Fewer than half of the surveyed customers had visited a branch in the past year.`,
      steps: [
        md`Statement 1: $\frac{280}{400} = 70\%$. **True.**`,
        md`Statement 2 extends the result from one online bank's customers to all customers in the country. Online-bank customers may visit branches far less than others. **Cannot be deduced.**`,
        md`Statement 3: $400 - 280 = 120$ had visited, which is 30%, fewer than half. **True.**`,
      ],
      answerMd: md`Statements 1 and 3 are true; statement 2 cannot be deduced. The supported statements are dull restatements; the unsupported one is the interesting headline.`,
    },
  ],
  traps: [
    {
      title: 'The reasonable story',
      md: md`A causal explanation is so natural that it feels stated. Ask whether the passage says one thing causes the other, or only that they occur together. Without the causal claim in the passage, the statement cannot be deduced.`,
    },
    {
      title: 'Running the rule backwards',
      md: md`"Over the limit, so refused" becomes "refused, so over the limit". The first is a rule; the second needs the extra premise that the limit is the only reason for refusal.`,
    },
    {
      title: 'The interesting conclusion',
      md: md`Options that generalise (to the whole country, to every member, to next year) are more interesting than restatements, and catch readers who expect the answer to say something new. Check scope: same group, same period, same measure.`,
    },
    {
      title: 'Rejecting the modest truth',
      md: md`A statement that only restates or combines the passage looks too easy to be right. If it follows with no added premise, it is supported, and in a "must be true" item it is the answer.`,
    },
  ],
  check: [
    {
      id: 'check-ring-roads',
      title: 'Ring roads and town centres',
      topic: 'Critical thinking',
      stimulusMd: md`*Over the past ten years, the towns in a province that built a ring road saw retail employment in their centres fall by an average of 8%, while the towns that did not build one saw it rise by an average of 2%.*`,
      stemMd: md`Which of the following can be deduced from the information?`,
      options: [
        { id: 'A', text: md`Building a ring road reduces retail employment in a town's centre.`, note: md`The passage reports an association, not a cause. Towns whose centres were already declining might have been the ones to build ring roads.` },
        { id: 'B', text: md`In at least one town that built a ring road, retail employment in the centre fell over the period.`, note: '' },
        { id: 'C', text: md`Every town without a ring road gained retail jobs in its centre.`, note: md`An average rise of 2% is compatible with some of those towns losing jobs while others gained more.` },
        { id: 'D', text: md`Total retail employment in the province fell over the period.`, note: md`The figures cover only town centres and are averages of towns of unknown sizes; jobs outside the centres are not mentioned at all.` },
      ],
      answer: 'B',
      workingMd: md`If the average change across the ring-road towns was a fall of 8%, the towns cannot all have had a rise or no change; at least one must have fallen. That needs no added premise. The causal claim needs the premise that the ring road, not something else, explains the difference; the claim about every town confuses an average with each member; the claim about the province needs town sizes and jobs outside centres, which are not given.`,
      lesson: 'If an average fell, at least one member fell; nothing more about individual members or causes follows.',
    },
    {
      id: 'check-mortgage-refused',
      title: 'A refused mortgage',
      topic: 'Critical thinking',
      stimulusMd: md`*A bank approves a mortgage only if the monthly repayments would be no more than 35% of the applicant's net monthly income. Paolo applied to the bank for a mortgage and was refused.*`,
      stemMd: md`Is the following statement true, false, or can it not be deduced from the passage? *Paolo's monthly repayments would have been more than 35% of his net monthly income.*`,
      options: tfc({
        true: md`Treats the 35% condition as the only reason for refusal. The passage makes it necessary for approval, not sufficient, so Paolo may have met it and been refused for another reason.`,
        false: md`Nothing in the passage says his repayments were within the limit. He may have been refused precisely because they were not.`,
      }),
      answer: 'C',
      workingMd: md`"Approved only if repayments are at most 35%" means every approved mortgage met the limit. It does not say that every mortgage meeting the limit is approved. Paolo's refusal fits a situation where his repayments exceeded 35%, and also one where they were within the limit but he was refused for another reason. Both fit the passage, so the statement cannot be deduced.`,
      lesson: 'A necessary condition explains some refusals, not all of them; a refusal does not tell you which condition failed.',
    },
    {
      id: 'check-department-cuts',
      title: 'Three departments cut spending',
      topic: 'Critical thinking',
      stimulusMd: md`*Compared with 2023, three departments of a firm cut their travel spending in 2024 by 5%, 10% and 30% respectively.*`,
      stemMd: md`Is the following statement true, false, or can it not be deduced from the passage? *Together, the three departments spent less on travel in 2024 than in 2023.*`,
      options: tfc({
        false: md`Perhaps reacts against the unknown size of the total cut. The size is unknown, but every part fell, so the total must have fallen.`,
        cannot: md`The size of the total cut cannot be deduced, because the budgets are not given; but the statement asks only about the direction, and that is fixed.`,
      }),
      answer: 'A',
      workingMd: md`Each department spent less in 2024 than in 2023. A sum of three smaller amounts is smaller than the sum of the three larger ones, whatever the budgets were. So total travel spending fell, and the statement is true. What cannot be deduced is the percentage fall of the total, which depends on the budgets.`,
      lesson: 'If every part fell, the total fell; separate what is fixed (direction) from what is not (size).',
    },
  ],
  takeaways: [
    md`Ask what you would have to add to the passage to make a conclusion certain; if anything, it is not deducible.`,
    md`Association is not cause, and a rule does not run backwards.`,
    md`Averages hide their members, and percentages of different bases cannot be averaged into a total.`,
    md`Modest restatements and combinations are often the supported answer; do not reject them for being obvious.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-critical-thinking', skill: 'critical-thinking-exclude-implications' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const logicLesson: Lesson = {
  slug: 'quantifiers-and-conditionals',
  title: 'Quantifiers and conditionals',
  summary: 'Read all, some, most, only, if, only if and unless with their strict meanings, negate them correctly, and use the contrapositive.',
  minutes: 22,
  objectives: [
    'State the strict meaning and the correct negation of all, some, most and none.',
    'Draw the valid conclusions from a conditional and reject its converse and inverse.',
    'Translate only if, unless and if and only if into ordinary conditionals.',
  ],
  teachMd: md`
### Small words, exact meanings

Critical thinking items turn on a few words used with their strict logical meaning. In conversation, "some" often hints "not all", and "unless" is often heard as a two-way promise; in a true / false / cannot be deduced item, you must read them strictly. This lesson fixes the meanings.

### Quantifiers

| Word | Strict meaning | Does not mean |
| --- | --- | --- |
| all, every, each | no exceptions | (nothing weaker) |
| some | at least one, possibly all | not all |
| most | more than half | almost all |
| none, no | zero | (nothing stronger) |
| not all | at least one exception | none |
| only A are B | every B is an A | every A is a B |

Two consequences matter most.

**Negations.** The opposite of "all exporters increased sales" is "at least one exporter did not", not "no exporter did". The opposite of "some banks failed" is "no bank failed". The opposite of "most" is "half or fewer".

**Combining "most" with "most".** If more than half the branches are in the north and more than half offer Saturday opening, at least one northern branch offers Saturday opening: two groups that are each more than half of the same total must overlap. "Some" with "some" gives no such guarantee.

### Conditionals

"If P, then Q" says that whenever P holds, Q holds. From it:

| Given | Conclusion | Valid? |
| --- | --- | --- |
| P | Q | Yes |
| not Q | not P | Yes (the contrapositive) |
| Q | P | No (the converse) |
| not P | not Q | No (the inverse) |

Example: "If a supplier delivers late more than twice in a year, it is removed from the approved list." A supplier still on the list did not deliver late more than twice (contrapositive). A removed supplier may have been removed for something else (the converse fails).

### Only if, unless, if and only if

- **"P only if Q"** means Q is necessary for P: if P, then Q. "A firm can bid only if it has audited accounts": a firm that bid has audited accounts; a firm with audited accounts may still be unable to bid for other reasons.
- **"P unless Q"** means: if not Q, then P. "The plant will close unless it wins an order" means that without an order, it closes. Read strictly, winning an order does not guarantee that the plant stays open; it only removes this reason for closing.
- **"P if and only if Q"** runs both ways: each guarantees the other.
- **Necessary and sufficient.** Q is necessary for P when P cannot happen without Q (P only if Q). Q is sufficient for P when Q alone guarantees P (if Q, then P).

### Chains

Conditionals chain: "if P then Q" and "if Q then R" give "if P then R". Their contrapositives chain too: not R gives not Q, which gives not P. When a passage contains several rules, write them as arrows and follow the arrows forwards, or follow the negations backwards. Never run an arrow itself backwards.

### Reading strictly without being pedantic

Strict reading applies to the logical words, not to ordinary language in general. "A firm" means one firm; "last year" means the year before the one the passage describes. The aim is not to find loopholes but to avoid adding meaning that the words do not carry.
`,
  examples: [
    {
      id: 'example-negating-all',
      title: 'When "all" turns out false',
      problemMd: md`A report claimed: "All the region's banks met the new capital requirement." An audit showed the claim was false. What follows?`,
      steps: [
        md`"All met it" is false when there is at least one exception.`,
        md`So at least one bank did not meet the requirement.`,
        md`The audit does not say how many failed. "None met it" and "most failed" are both possible but not guaranteed.`,
      ],
      answerMd: md`At least one of the region's banks did not meet the requirement. "No bank met it" is the tempting overstatement.`,
    },
    {
      id: 'example-only-if',
      title: 'Only if',
      problemMd: md`*A firm can bid for the contract only if it has audited accounts for the last three years.*

Judge: (1) Firm X has audited accounts for the last three years, so it can bid. (2) Firm Y bid for the contract, so it has audited accounts for the last three years. (3) Firm Z does not have audited accounts for the last three years, so it cannot bid.`,
      steps: [
        md`Translate: "can bid only if audited" means "if a firm can bid, it has audited accounts". Audited accounts are necessary, not sufficient.`,
        md`(1) runs the arrow backwards (audited, so can bid). Other conditions may apply. **Cannot be deduced.**`,
        md`(2) follows the arrow: Y could bid, so Y has audited accounts. **True.**`,
        md`(3) is the contrapositive: no audited accounts, so cannot bid. **True.**`,
      ],
      answerMd: md`(1) cannot be deduced; (2) and (3) are true. Reading "only if" as "if" is what makes (1) tempting.`,
    },
    {
      id: 'example-most-and-most',
      title: 'Most and most',
      problemMd: md`*More than half of a bank's branches are in the north. More than half of its branches offer Saturday opening.*

Judge: At least one of the bank's branches in the north offers Saturday opening.`,
      steps: [
        md`Let the bank have $n$ branches. Northern branches number more than $\frac{n}{2}$, and Saturday branches more than $\frac{n}{2}$.`,
        md`Together the two groups count more than $n$ branches, so at least one branch is counted twice: it is in the north and opens on Saturday.`,
      ],
      answerMd: md`True. With "some" instead of "most" the statement could not be deduced, because two small groups need not overlap.`,
    },
  ],
  traps: [
    {
      title: '"Some" read as "some but not all"',
      md: md`"Some employees work remotely" is taken to imply that some do not. Strictly, "some" allows "all". A statement that relies on "not all" cannot be deduced from "some".`,
    },
    {
      title: 'Negating "all" as "none"',
      md: md`When "all X did Y" is false, readers conclude "no X did Y". One exception is enough to make "all" false. The correct negation is "at least one X did not".`,
    },
    {
      title: 'Running the arrow backwards',
      md: md`From "if late more than twice, removed" readers conclude "removed, so late more than twice". That is the converse, and it needs the extra premise that lateness is the only reason for removal. Use the contrapositive instead.`,
    },
    {
      title: '"Only if" read as "if"',
      md: md`"Only if Q" names a necessary condition. Meeting it does not guarantee the outcome. Rewrite "P only if Q" as "if P, then Q" before you reason.`,
    },
  ],
  check: [
    {
      id: 'check-supplier-on-list',
      title: 'A supplier still on the list',
      topic: 'Critical thinking',
      stimulusMd: md`*Any supplier that delivers late more than twice in a calendar year is removed from the approved list immediately, and a removed supplier cannot be readmitted in the same year. Ferri Srl supplied the company throughout 2025 and stayed on the approved list for the whole of 2025, without interruption.*`,
      stemMd: md`Is the following statement true, false, or can it not be deduced from the passage? *Ferri Srl delivered late no more than twice in 2025.*`,
      options: tfc({
        false: md`The passage gives no sign of more than two late deliveries; if there had been, Ferri would have been removed immediately, and it was never off the list in 2025.`,
        cannot: md`The contrapositive settles it: more than two late deliveries would have meant immediate removal, and Ferri stayed on the list for the whole year without interruption.`,
      }),
      answer: 'A',
      workingMd: md`The rule: more than two late deliveries in a year, then immediate removal. Contrapositive: a supplier that was never removed during the year did not deliver late more than twice in it. Ferri stayed on the list for the whole of 2025 without interruption, so it was never removed in 2025, and so it delivered late at most twice in 2025. The statement is true.`,
      lesson: 'From "if P then Q" and "not Q", conclude "not P": the contrapositive is always valid.',
    },
    {
      id: 'check-negating-exporters',
      title: 'A false claim about exporters',
      topic: 'Critical thinking',
      stimulusMd: md`*A trade report claimed: "All of the region's exporters increased their sales last year." The claim later turned out to be false.*`,
      stemMd: md`Which of the following must be true?`,
      options: [
        { id: 'A', text: md`None of the region's exporters increased their sales last year.`, note: md`Negates "all" as "none". One exporter whose sales did not rise is enough to make the claim false.` },
        { id: 'B', text: md`Most of the region's exporters saw their sales fall last year.`, note: md`Nothing says how many exceptions there were; there may have been only one, and its sales may have stayed flat rather than fallen.` },
        { id: 'C', text: md`At least one of the region's exporters did not increase its sales last year.`, note: '' },
        { id: 'D', text: md`Some of the region's exporters increased their sales last year.`, note: md`Possible, but not guaranteed: the claim is also false if no exporter increased its sales.` },
      ],
      answer: 'C',
      workingMd: md`"All exporters increased their sales" is false exactly when at least one exporter did not increase its sales. That is all the falsity tells us. It does not say how many exceptions there were, whether their sales fell or stayed flat, or whether any exporter's sales rose.`,
      lesson: 'The negation of "all" is "at least one is not", never "none".',
    },
    {
      id: 'check-regional-grant',
      title: 'Who receives the grant?',
      topic: 'Critical thinking',
      stimulusMd: md`*The regional grant is paid only to firms that have been registered for at least two years. Some of the firms that applied for this year's grant had been registered for less than a year when it was paid.*`,
      stemMd: md`Is the following statement true, false, or can it not be deduced from the passage? *Every firm that applied for this year's grant received it.*`,
      options: tfc({
        true: md`Ignores the condition: a firm registered for less than a year cannot meet the two-year requirement, so it cannot receive the grant.`,
        cannot: md`The passage is not silent: "some" guarantees at least one applicant registered for less than a year, and the rule excludes that firm.`,
      }),
      answer: 'B',
      workingMd: md`"Paid only to firms registered for at least two years" means: if a firm receives the grant, it has been registered for at least two years. At least one applicant had been registered for less than a year when the grant was paid, so by the contrapositive it did not receive the grant. Therefore not every applicant received it, and the statement is false.`,
      lesson: 'A necessary condition that some applicants fail rules out "every applicant succeeded".',
    },
  ],
  takeaways: [
    md`"Some" means at least one, possibly all; "most" means more than half; the negation of "all" is "at least one is not".`,
    md`From "if P then Q", the contrapositive "if not Q then not P" is valid; the converse and the inverse are not.`,
    md`"P only if Q" means "if P then Q"; "P unless Q" means "if not Q then P".`,
    md`Two groups that are each more than half of the same total must overlap.`,
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-critical-thinking', skill: 'critical-thinking-truth-evaluation' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const criticalThinkingUnit: Unit = {
  slug: 'critical-thinking',
  title: 'Critical thinking',
  summary: 'Nine questions of the standard Online Bocconi Test are critical thinking. Bocconi lists two formats: choosing which statements about given data are true or false, and judging whether an assertion about a short passage is true, false or cannot be deduced. A wrong answer to a three-option critical thinking item costs 0.33 points. These lessons teach strict deduction: what a text guarantees, what it only suggests, and how the logical words work. All passages are invented.',
  lessons: [tfcLesson, conclusionsLesson, exclusionLesson, logicLesson],
};
