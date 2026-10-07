/**
 * Public editorial guides.
 *
 * Each guide answers one question directly in its opening paragraph, states
 * which exam version and admissions cycle it concerns, and cites the official
 * source next to the claim it supports. Dates are real: `updatedOn` changes
 * only when the substance changes.
 */

export interface GuideSource {
  label: string;
  url: string;
  publisher: string;
}

export interface Guide {
  slug: string;
  title: string;
  /** The direct answer, shown before the body and used as the meta description. */
  answer: string;
  description: string;
  examKeys: string[];
  hubSlug: string;
  publishedOn: string;
  updatedOn: string;
  readingMinutes: number;
  bodyMd: string;
  sources: GuideSource[];
}

const GUIDES: Guide[] = [
  {
    slug: 'bocconi-test-negative-marking-when-to-guess',
    title: 'Negative marking on the Bocconi Online Test: when to guess and when to leave a blank',
    answer:
      'Guess when you can rule out at least one option. The Bocconi Online Test scores +1 for a correct answer, 0 for a blank and −0.2 for a wrong answer (−0.33 on three-option critical-thinking items). A blind guess among five options is worth only +0.04 points on average, barely more than a blank, while every option you eliminate makes a guess clearly worthwhile.',
    description:
      'How Bocconi’s +1 / 0 / −0.2 scoring changes guessing strategy, worked through with the actual arithmetic, for the 2027-28 admissions cycle.',
    examKeys: ['bocconi-undergraduate', 'bocconi-law'],
    hubSlug: 'bocconi-online-test',
    publishedOn: '2026-09-22',
    updatedOn: '2026-10-07',
    readingMinutes: 5,
    sources: [
      {
        label: 'Online Bocconi test — structure and scoring',
        url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test',
        publisher: 'Università Bocconi',
      },
      {
        label: 'Online admission test — instructions and rules of conduct, a.y. 2027/28',
        url: 'https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf',
        publisher: 'Università Bocconi',
      },
    ],
    bodyMd: `## The rule, exactly as Bocconi states it

Bocconi publishes the scoring for the online test as: **"Right answer: 1 point. Missing answer: 0 points. Wrong answer: — 0.2 points."** A separate, larger penalty applies to some critical-thinking items: **"For questions of the 'critical thinking' area that give only three possible answer options, the penalty will be — 0.33 points."**

This matters more than it looks. On the SAT, the ACT, the LSAT, the GMAT and the GRE there is no wrong-answer penalty at all, so the correct strategy on those exams is simple: never leave anything blank. On the Bocconi test that advice is wrong, and following it will cost you marks.

## The arithmetic

Bocconi does not publish how many options most of its questions have; it mentions only that some critical-thinking questions have three. So the sums below show five, four and three options, and the conclusion holds for all of them.

Suppose a question has five options and you have no idea. You have a 1 in 5 chance of gaining 1 point and a 4 in 5 chance of losing 0.2:

$$E = \\tfrac{1}{5}(1) + \\tfrac{4}{5}(-0.2) = 0.2 - 0.16 = 0.04$$

Very slightly positive, but close enough to zero that it is not a strategy. Now eliminate one option, so you are guessing between four:

$$E = \\tfrac{1}{4}(1) + \\tfrac{3}{4}(-0.2) = 0.25 - 0.15 = 0.10$$

Eliminate two, and you are guessing between three:

$$E = \\tfrac{1}{3}(1) + \\tfrac{2}{3}(-0.2) \\approx 0.333 - 0.133 = 0.20$$

The pattern is the point: **every option you can eliminate roughly doubles the value of guessing.** Elimination, not boldness, is what pays.

### The three-option critical-thinking items

On the items Bocconi flags as having only three options, the penalty rises to 0.33. A blind guess there is:

$$E = \\tfrac{1}{3}(1) + \\tfrac{2}{3}(-0.33) = 0.333 - 0.22 = 0.11$$

Still positive, and eliminating a single option makes it a coin flip worth $0.5 - 0.165 = 0.335$. So the larger penalty does not make these questions ones to avoid; it makes them ones where a half-formed reason to discard an option is worth acting on.

## What this means while the clock is running

The test gives you **75 minutes for 50 questions**, which is 90 seconds each on average, and navigation is strictly forward-only: three questions appear per screen, and once you press Next you cannot return. You therefore cannot bank hard questions for later. Every question is answered or abandoned in the moment.

A workable policy:

1. If you can solve it, solve it.
2. If you cannot, spend a few seconds only on **elimination**, not on solving. Cross out what is impossible.
3. Eliminated at least one? Guess and move on.
4. Eliminated nothing at all? Leave it blank and move on. A blank costs nothing; a blind guess gains you on average 0.04 of a point on a five-option item, or 0.10 on a four-option one, which is rarely worth the seconds and the risk.

This policy is our advice, not a Bocconi rule; the scoring it rests on is Bocconi's.

## One number that is an actual requirement

Bocconi publishes an eligibility floor: an applicant whose total score, **penalties included**, is below **17** is not considered in the selection. That is a published requirement, not a competitive average. It is also not a target — admission is by competitive ranking, in which the test contributes alongside your school grades — so clearing 17 means you are in the ranking, not that you are admitted.

Be careful with any other number you read online. Figures circulated as "the score you need for Bocconi" are almost always observed averages from unofficial sources, not published thresholds, and we do not repeat them.

## Practise the decision, not just the maths

The blank-or-guess call only becomes automatic with practice under the real scoring. Our timed Bocconi sets apply the −0.2 and −0.33 penalties, and the results show how many points your wrong answers cost you. See [Bocconi Online Test preparation](/exams/bocconi-online-test) for the formats and a free test.`,
  },
  {
    slug: 'bocconi-undergraduate-vs-law-test',
    title: 'Bocconi undergraduate test or Bocconi Law test: which one to take',
    answer:
      'Take the standard Online Bocconi Test unless you are applying only to Bocconi’s Law School programmes. The standard test is valid for every bachelor programme, Law included; the Law test can only be used for programmes in the legal area. Both are 50 questions in 75 minutes with the same scoring, but the standard test is half mathematics, while the Law test is mostly logic, critical thinking and verbal reasoning.',
    description:
      'The two Bocconi online tests compared: who each one is for, how their 50 questions are split, and what that means for preparation, for the 2027-28 admissions cycle.',
    examKeys: ['bocconi-undergraduate', 'bocconi-law'],
    hubSlug: 'bocconi-online-test',
    publishedOn: '2026-10-07',
    updatedOn: '2026-10-07',
    readingMinutes: 4,
    sources: [
      {
        label: 'Online Bocconi test: structure, areas and which programmes each test is valid for',
        url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test',
        publisher: 'Università Bocconi',
      },
      {
        label: 'Bachelor and Law programs: admissions, accepted tests and the 55/45 ranking',
        url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions',
        publisher: 'Università Bocconi',
      },
      {
        label: 'SAT, ACT and LSAT routes',
        url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act',
        publisher: 'Università Bocconi',
      },
      {
        label: 'Bocconi Online Test, AY 2027/28: Instructions and Rules of Conduct',
        url: 'https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf',
        publisher: 'Università Bocconi',
      },
    ],
    bodyMd: `## Two tests, one format

Bocconi runs two online admission tests for its bachelor and Law programmes: the standard **Online Bocconi Test** and the **Online Bocconi Test – Law**. They share everything about *how* they are taken:

- 50 single-answer questions in 75 minutes, in one block with no break;
- three questions per screen, and no way back once you press Next;
- +1 for a correct answer, 0 for a blank, −0.2 for a wrong answer (−0.33 on critical-thinking questions with three options);
- a total below 17 out of 50 means you are not considered in the selection;
- taken at home, online, under recorded proctoring, in Italian or English.

What differs is *what* they test, and which programmes they open.

## Which programmes each test is valid for

According to Bocconi, the standard test is valid for every programme, Law included, while the Law test **"can only be used to apply for programs in the legal area"**: the Law School programmes. If you want to keep any non-Law programme open, including applying to Law and to economics in the same year, the standard test is the one that covers both.

The tests are separate: each is booked and paid for on its own (€60 per attempt), and you may take up to four attempts **per test type** in an academic year.

## How the 50 questions are split

| Area | Standard test | Law test |
| --- | --- | --- |
| Mathematics | 24 | 5 |
| Reading comprehension | 11 | 11 |
| Numerical reasoning | 6 | 6 |
| Critical thinking | 9 | — |
| Logic and critical thinking | — | 18 |
| Verbal reasoning | — | 10 |

The standard test is a mathematics test first: nearly half its questions, on a syllabus that runs from algebra and functions to probability and statistics, all without a calculator. The Law test keeps only five mathematics questions, on a narrower list, and gives most of its weight to reasoning: rules and conditions, what follows from a text and what does not, and the structure of arguments.

## What does not change

Admission to the Law School programmes uses the same ranking as the other programmes: the test counts **55%** and your third-last and second-last year school grades **45%**. Bocconi publishes no admission cut-off for either test, only the 17-point floor. For Law, an LSAT score of at least 147 is accepted instead of the Bocconi test; for every programme, so are SAT and ACT scores above Bocconi's published minimums.

## How to choose (our advice)

This part is our view, not Bocconi's.

- **Applying only to Law School programmes?** Compare yourself on the two mixes. If mathematics is your weak point, the Law test puts far less weight on it.
- **Applying to anything else as well?** Take the standard test; the Law test cannot be used for other programmes.
- **Unsure?** Take a short diagnostic for each before you book. The one that shows fewer weak areas is usually the better bet, but the deciding rule is still which programmes you want.

## Practise either test

Our [Bocconi Online Test preparation](/exams/bocconi-online-test) page covers both tests, with separate question banks, a free test for each, and timed 50-question sets under the rules above.`,
  },
  {
    slug: 'bocconi-test-preparation-plan',
    title: 'How to prepare for the Bocconi Online Test: a week-by-week plan',
    answer:
      'Start with a short diagnostic to find your weakest areas, spend most of the following weeks on untimed topic practice in those areas without a calculator, add timed 50-question sets in the last weeks, and use Bocconi’s free official simulation as a dress rehearsal. The test is 50 questions in 75 minutes with negative marking and no way back, so a plan has to train accuracy, pace and a blank-or-guess rule, not just content.',
    description:
      'A practical preparation plan for the Bocconi Online Test, built on Bocconi’s published rules: what to practise each week, how to handle negative marking and pace, and when to book.',
    examKeys: ['bocconi-undergraduate', 'bocconi-law'],
    hubSlug: 'bocconi-online-test',
    publishedOn: '2026-10-07',
    updatedOn: '2026-10-07',
    readingMinutes: 6,
    sources: [
      {
        label: 'Online Bocconi test: structure, topic lists, scoring and the free simulation',
        url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test',
        publisher: 'Università Bocconi',
      },
      {
        label: 'Bocconi Online Test, AY 2027/28: Instructions and Rules of Conduct (sessions, attempts, navigation)',
        url: 'https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf',
        publisher: 'Università Bocconi',
      },
      {
        label: 'Bachelor and Law programs: admissions (highest result used, 55/45 ranking)',
        url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions',
        publisher: 'Università Bocconi',
      },
    ],
    bodyMd: `## What the plan has to prepare you for

These are Bocconi's published rules, and every step below follows from them.

- **50 questions in 75 minutes**, one block, no break: 90 seconds per question on average.
- **No calculator**, and only two blank A4 sheets for working.
- **Three questions per screen, no way back.** Once you press Next, that screen is gone.
- **Negative marking:** +1 correct, 0 blank, −0.2 wrong (−0.33 on three-option critical-thinking questions).
- **Up to four attempts per test type** in an academic year, never on the same day or on consecutive days, at €60 each. The admissions portal uses your highest result.
- **For entry in 2027-28** the remaining sessions are Winter (25 November 2026 – 26 January 2027) and, for Italian applicants only, Spring (8–27 April 2027).

The standard test is Mathematics 24, Reading comprehension 11, Numerical reasoning 6 and Critical thinking 9. The Law test is Mathematics 5, Reading comprehension 11, Numerical reasoning 6, Logic and critical thinking 18 and Verbal reasoning 10.

## An eight-week plan (our advice)

Everything from here on is our advice, not a Bocconi rule. Eight weeks of four or five short sessions a week suits most applicants; compress it if your test date is closer.

| Weeks | Focus | What to do |
| --- | --- | --- |
| 1 | Find your gaps | One short diagnostic across all areas. List the three topics where you lost most marks. |
| 2–4 | Fix the biggest gaps | Untimed topic practice on those topics, about 10 questions a session. Read every explanation, including for the questions you got right. No calculator, ever. |
| 5 | Widen | Mixed practice across all areas, so weaker topics come back while stronger ones stay sharp. Retry the questions you missed in weeks 2–4. |
| 6 | Add the clock | Your first timed 50-question set under the real rules. Afterwards, check where the time went and which wrong answers were guesses. |
| 7 | Rehearse | A second timed set, then Bocconi's own free online simulation, to practise in the real interface. |
| 8 | Taper | Short reviews of your mistake notebook. No new topics. Check your equipment and room against Bocconi's rules of conduct. |

### Three habits to build along the way

1. **A blank-or-guess rule.** Guess when you can rule out at least one option; otherwise leave it blank. Decide this before test day, so you do not spend time on it during the test. [The arithmetic behind the rule.](/guides/bocconi-test-negative-marking-when-to-guess)
2. **Screen discipline.** Answer the three questions on a screen before moving on, because you cannot come back. In practice, stop flagging questions "for later".
3. **Hand arithmetic.** Mathematics and numerical reasoning have to be done on paper. Practise fractions, percentages and rough estimates by hand from the first week.

## If you have three weeks

Week 1: a diagnostic, then topic practice on your two weakest areas. Week 2: mixed practice and one timed set. Week 3: Bocconi's simulation, a second timed set, then review only.

## Booking and retakes

Because the portal keeps your highest result, an early first attempt in a session leaves room for another if it goes badly. Attempts cannot be on the same day or on consecutive days, and each costs €60. Bocconi also lists periods when the testing platform is closed, so check its test page before you plan a date.

## What no plan can tell you

Bocconi publishes one threshold, 17 out of 50, below which you are not considered, and no admission cut-off: places go by ranking, with the test counting 55% and your school grades 45%. Any "target score" you read elsewhere is an estimate, not a rule.

## Where to practise

On our [Bocconi Online Test preparation](/exams/bocconi-online-test) page you can start with a free test, then follow this plan with topic practice, timed sets, a mistake notebook and a study plan that schedules sessions toward your test date.`,
  },
  {
    slug: 'lsat-without-logic-games',
    title: 'The LSAT no longer has logic games: what the test looks like now',
    answer:
      'Analytical Reasoning — the "logic games" section — was removed from the LSAT in August 2024 and replaced by a second Logical Reasoning section. The current test is four 35-minute sections: two scored Logical Reasoning sections, one scored Reading Comprehension section, and one unscored variable section that can be either type.',
    description:
      'Analytical Reasoning was removed from the LSAT in August 2024. Here is the current structure for the 2026-27 testing cycle, and what it changes about preparation.',
    examKeys: ['lsat'],
    hubSlug: 'lsat',
    publishedOn: '2026-09-22',
    updatedOn: '2026-09-22',
    readingMinutes: 4,
    sources: [
      { label: 'LSAT test format', url: 'https://www.lsac.org/lsat/taking-lsat/test-format', publisher: 'LSAC' },
      {
        label: 'What to expect starting with the August 2024 LSAT',
        url: 'https://www.lsac.org/blog/what-to-expect-starting-with-august-2024-lsat',
        publisher: 'LSAC',
      },
      { label: 'LSAT scoring', url: 'https://www.lsac.org/lsat/lsat-scoring', publisher: 'LSAC' },
    ],
    bodyMd: `## What changed

For decades the LSAT contained an Analytical Reasoning section, universally known as "logic games": ordering, grouping and matching puzzles built around a set of constraints. **It is gone.** Since the August 2024 administration, that section has been replaced by a second Logical Reasoning section.

If you are working from a book, a course or a tutor's plan that still drills logic games, that material is preparing you for a test that is no longer administered.

## The current structure

LSAC describes the multiple-choice test as **"four 35-minute sections of multiple-choice questions"**. Three are scored and one is an unscored variable section used to trial new questions. The variable section **"can be any one of the question types — Reading Comprehension or Logical Reasoning — and can occur at any point in the test"**, and you are not told which one it is.

| Section | Scored | Time |
| --- | --- | --- |
| Logical Reasoning | Yes | 35 minutes |
| Logical Reasoning | Yes | 35 minutes |
| Reading Comprehension | Yes | 35 minutes |
| Variable (either type) | No | 35 minutes |

There is a 10-minute intermission after the second section. **LSAT Argumentative Writing** is separate: it is taken on its own, is not scored, and gives you 50 minutes in total — 15 minutes of prewriting analysis and 35 minutes of writing.

### One thing LSAC does not publish

LSAC publishes the number of sections and the time per section, but **not the number of questions in each section**, and not a total. Figures like "about 25 questions per Logical Reasoning section" circulate widely, and they are approximately right in practice, but they are not published by LSAC and we do not present them as though they were. This is why our timed LSAT practice states its own question count as our editorial choice rather than as the exam's rule.

## What it means for preparation

The practical consequence of the change is **weighting**. Logical Reasoning now accounts for two of the three scored sections rather than one of three. Roughly two thirds of your scored questions are single short arguments followed by a single question.

That makes a small number of skills disproportionately valuable:

- **Finding the conclusion**, reliably and quickly, including when it is not the last sentence.
- **Naming the gap** between the evidence and the conclusion, which is what assumption, flaw, strengthen and weaken questions all probe from different angles.
- **Reading the question stem first**, because the same stimulus supports very different correct answers depending on what is asked.

Reading Comprehension is unchanged in form, including Comparative Reading, where two shorter passages take different positions on one topic.

## Scoring

Your score is based on **the number of questions you answered correctly** across the three scored sections — LSAC calls this the raw score — converted to the 120–180 scale. There is **no deduction for wrong answers**, so unlike the Bocconi test, you should never leave an LSAT question blank. The raw-to-scale conversion is produced for each form and is not published in advance, which is why no honest practice tool can hand you a reliable 120–180 number.`,
  },
  {
    slug: 'why-practice-tests-cannot-give-you-a-real-sat-score',
    title: 'Why no honest SAT practice test can give you a real 400–1600 score',
    answer:
      'Because College Board does not score the digital SAT by counting correct answers. It uses Item Response Theory, so your section score depends on which questions you got right, not just how many — College Board states that two students with the same number correct can receive different section scores. The parameters that make that calculation possible are not published, so any 400–1600 number produced outside Bluebook is an estimate built on guesswork.',
    description:
      'The digital SAT is scored with Item Response Theory, not a raw-score table. Here is what that means for practice-test scores, and what to measure instead.',
    examKeys: ['digital-sat'],
    hubSlug: 'digital-sat',
    publishedOn: '2026-09-22',
    updatedOn: '2026-09-22',
    readingMinutes: 5,
    sources: [
      {
        label: 'How SAT scores are calculated',
        url: 'https://satsuite.collegeboard.org/scores/what-scores-mean/how-scores-calculated',
        publisher: 'College Board',
      },
      {
        label: 'SAT test structure',
        url: 'https://satsuite.collegeboard.org/sat/whats-on-the-test/structure',
        publisher: 'College Board',
      },
    ],
    bodyMd: `## The short version

On the old paper SAT, scoring was mechanical: count the correct answers, look the raw score up in a table printed with the test, read off the scaled score. Practice tests could reproduce that exactly, because the table was published.

The digital SAT does not work that way. College Board states that scores are **"a product of several factors, characteristics of the questions they answered right or wrong (e.g. the questions' difficulty levels), and the probability that the pattern of answers suggests they were guessing."** The consequence is stated plainly: **two students who answer the same number of questions correctly may earn different section scores.**

## Why the difficulty of your questions matters

The digital SAT is **multistage adaptive**. Each section has two modules. The first is the same broad mix for everyone; how you do on it determines whether your second module is the harder or the easier panel. A student routed to the harder second module is answering questions worth more, in the statistical sense, than a student routed to the easier one.

So "35 out of 44 correct" is not a score. It is not even enough information to produce a score, because the answer depends on *which* 35.

The machinery that turns your answer pattern into a 200–800 section score is a set of calibrated item parameters and an ability-estimation model. College Board does not publish either. Nobody outside College Board can run that calculation, and anyone who claims to is estimating.

## What about the questions that do not count?

There is a second reason a raw count misleads. College Board embeds unscored pretest questions: **"Two pretest questions are also included in each module ... Student responses to these pretest questions don't affect their scores."** With four modules, that is 8 of the 98 questions you answer that do not count toward anything, and you are not told which ones. Our practice contains no pretest items, so every question you see here counts — which makes our counts and the real exam's counts different things.

## So what should you measure?

Useful measurements exist; they are just not a fabricated 1600.

- **Accuracy by skill.** "I get 40% of inference questions right and 85% of linear-equation questions right" tells you what to do tomorrow morning. A composite score does not.
- **Time per question.** Running out of time and not knowing the content are different problems with different fixes, and timing data separates them.
- **Error patterns.** The same misconception usually produces the same wrong answer repeatedly. That is findable, and fixable.
- **Trend.** Whether your accuracy on a skill is climbing over weeks is more informative than any single session.

This is why our results pages report exactly those things and no scaled score. It is not modesty; producing a number we cannot justify would be the dishonest option.

## The one place you can get a real score

Official full-length practice tests taken in College Board's own Bluebook application are scored by College Board's own model. If you want a scaled-score estimate, that is the way to get one that means anything. Use ours for diagnosis and drilling, and theirs for score prediction.`,
  },
];

export function listGuides(): Guide[] {
  return [...GUIDES].sort((a, b) => b.updatedOn.localeCompare(a.updatedOn));
}

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export function guidesForHub(hubSlug: string): Guide[] {
  return GUIDES.filter((guide) => guide.hubSlug === hubSlug);
}
