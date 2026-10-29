import type { Guide } from './guides';

/**
 * Original sample questions for the undergraduate Online Bocconi Test, with
 * worked answers. They are public teaching examples: none of them is in the
 * question bank, so reading the answers spoils no diagnostic or practice
 * session. Keep it that way when adding one (search content/ for its numbers).
 *
 * Every answer was re-derived step by step when the page was written. No
 * human subject expert has reviewed them; the page says so.
 */
export const bocconiSampleGuide: Guide = {
  slug: 'bocconi-admission-test-sample-questions',
  title: 'Bocconi admission test sample questions and answers',
  answer:
    'Below are eleven original practice questions for the undergraduate Online Bocconi Test: four in mathematics, two in reading comprehension, two in numerical reasoning and two in critical thinking, plus one reasoning item for applicants to the Law test. Each has a worked answer and an explanation of every wrong option. They are independent teaching examples, not official Bocconi questions, and getting them right does not predict your score.',
  description:
    'Eleven original Bocconi admission test sample questions in maths, reading, numerical reasoning and critical thinking, each with a worked answer.',
  examKeys: ['bocconi-undergraduate'],
  hubSlug: 'bocconi-online-test',
  publishedOn: '2026-10-29',
  updatedOn: '2026-10-29',
  readingMinutes: 20,
  sources: [
    {
      label: 'Online Bocconi test: structure, subject areas, scoring and preparation tools',
      url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test',
      publisher: 'Università Bocconi',
    },
    {
      label: 'Online Bocconi test, AY 2027/28: instructions and rules of conduct (PDF)',
      url: 'https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf',
      publisher: 'Università Bocconi',
    },
  ],
  bodyMd: `## Who these examples are for

They are written for the **undergraduate Online Bocconi Test**, the test used for admission to Bocconi's bachelor's programmes. One extra item at the end is for applicants taking the separate **Online Bocconi Test – Law**. The master's admission test has different rules and is not covered here: see the [Bocconi master's test guide](/exams/bocconi-master).

## What the real test contains

Bocconi's [official test page](https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test), checked on 29 October 2026, describes 50 multiple-choice questions in 75 minutes, in four areas:

| Area | Questions on the real test | Examples on this page |
| --- | ---: | ---: |
| Mathematics | 24 | 4 |
| Reading comprehension | 11 | 2 |
| Numerical reasoning | 6 | 2 |
| Critical thinking | 9 | 2 |

The areas are mixed through the test rather than grouped, and calculators are not allowed. A correct answer scores 1, a blank 0 and a wrong answer −0.2; on critical-thinking questions with only three options, a wrong answer costs −0.33. The Law test also has 50 questions in 75 minutes, but in a different mix: 5 mathematics, 11 reading comprehension, 6 numerical reasoning, 18 logic and critical thinking, and 10 verbal reasoning.

## How to use these examples

- **Answer first, then open the explanation.** The real test allows 90 seconds per question on average; reading questions usually take longer and some calculations less.
- **Work on paper, without a calculator**, as you will on the day.
- **Read the explanations of the wrong options too.** Each one describes a mistake students actually make, and recognising it is what transfers to the next question.

Bocconi does not publish how many options most questions have, so we use four. For the true / false / cannot-be-deduced format that Bocconi describes for critical thinking, we use its three options.

These questions are original, AI-assisted examples written for this page. They are not past Bocconi questions, their difficulty is not calibrated to the real test, and eleven questions cannot estimate a score. They are not part of UniExamer's question bank, so reading the answers here spoils no diagnostic or practice session.`,
  samples: {
    sections: [
      {
        id: 'mathematics',
        heading: 'Mathematics',
        introMd:
          'Mathematics is 24 of the 50 questions. Bocconi’s topic list runs from algebra, functions and geometry to logarithms, combinatorics, probability and statistics. These four examples cover percentages, absolute values, conditional probability and logarithms.',
        questions: [
          {
            id: 'percentage-changes',
            title: 'Successive percentage changes',
            topic: 'Numbers: percentages',
            stemMd: 'A course costs €240. Its price rises by 15%, and later the new price is cut by 15%. What is the final price?',
            options: [
              { id: 'A', text: '€240.00', note: 'Assumes that equal percentage changes cancel out. They do not, because the 15% cut is taken from a larger amount than the 15% rise.' },
              { id: 'B', text: '€234.60', note: '' },
              { id: 'C', text: '€204.00', note: 'Applies only the cut, and to the original price.' },
              { id: 'D', text: '€276.00', note: 'Stops after the rise.' },
            ],
            answer: 'B',
            workingMd:
              'The rise multiplies the price by 1.15: €240 + €36 = €276.\n\nThe cut is 15% of the new price: 15% of €276 is €41.40, so the final price is €276 − €41.40 = **€234.60**.\n\nIn one step: $1.15 \\times 0.85 = 0.9775$, so the final price is 97.75% of the original, 2.25% lower.',
            lesson:
              'Before using a percentage, name the amount it is a percentage of. Successive changes multiply: a rise of p% followed by a fall of p% always ends below the start, because $(1 + p)(1 - p) = 1 - p^2$.',
          },
          {
            id: 'absolute-value-inequality',
            title: 'An inequality with an absolute value',
            topic: 'Algebra: equations and inequalities with absolute values',
            stemMd: 'How many integers $x$ satisfy $|2x - 3| < 5$?',
            options: [
              { id: 'A', text: '3', note: 'Solves only $2x - 3 < 5$, which gives $x < 4$, and counts 1, 2 and 3. That ignores the lower bound and loses 0.' },
              { id: 'B', text: '4', note: '' },
              { id: 'C', text: '5', note: 'Includes −1, as if one end of the inequality were “less than or equal to”.' },
              { id: 'D', text: '6', note: 'Includes both −1 and 4, treating the strict inequality as non-strict at both ends.' },
            ],
            answer: 'B',
            workingMd:
              '$|2x - 3| < 5$ means $-5 < 2x - 3 < 5$.\n\nAdd 3 to every part: $-2 < 2x < 8$. Divide by 2: $-1 < x < 4$.\n\nThe integers strictly between −1 and 4 are 0, 1, 2 and 3: **four** of them.',
            lesson:
              'Rewrite $|A| < k$ as $-k < A < k$, keep each inequality sign exactly as given, and test a boundary value. Here $x = 4$ gives $|5| = 5$, which is not less than 5, so 4 is excluded.',
          },
          {
            id: 'conditional-probability',
            title: 'Conditional probability from a description',
            topic: 'Probability: conditional probability',
            stemMd:
              'Of 200 applicants, 120 took a preparation course. Of those 120, 90 passed a practice test. Of the 80 who did not take the course, 40 passed. One applicant who passed is chosen at random. What is the probability that this applicant took the course?',
            options: [
              { id: 'A', text: '$\\dfrac{9}{13}$', note: '' },
              { id: 'B', text: '$\\dfrac{3}{4}$', note: 'This is 90 ÷ 120, the probability of passing given that the applicant took the course. The condition is the wrong way round.' },
              { id: 'C', text: '$\\dfrac{9}{20}$', note: 'This is 90 ÷ 200, the probability that a random applicant both took the course and passed. It ignores the condition “who passed”.' },
              { id: 'D', text: '$\\dfrac{13}{20}$', note: 'This is 130 ÷ 200, the probability that a random applicant passed.' },
            ],
            answer: 'A',
            workingMd:
              'The applicant is chosen from those who passed, so they are the denominator: 90 + 40 = 130 passed.\n\nOf those 130, 90 took the course. The probability is $\\dfrac{90}{130} = \\dfrac{9}{13}$, about 0.69.',
            lesson:
              'The group you are choosing from defines the denominator. Sketch a two-way table (course or no course; passed or not) and read only the row or column the question restricts you to. The same habit underlies Bayes’ theorem, which is on Bocconi’s topic list.',
          },
          {
            id: 'logarithm-equation',
            title: 'A logarithm equation and its domain',
            topic: 'Logarithms and exponentials',
            stemMd: 'Solve $\\log_3 x + \\log_3 (x - 6) = 3$.',
            options: [
              { id: 'A', text: '$x = -3$', note: 'A root of the quadratic, but $\\log_3(-3)$ is not defined.' },
              { id: 'B', text: '$x = 9$', note: '' },
              { id: 'C', text: '$x = -3$ or $x = 9$', note: 'Both roots of the quadratic, without checking which ones the original equation allows.' },
              { id: 'D', text: '$x = 27$', note: 'Solves $\\log_3 x = 3$ and drops the second term.' },
            ],
            answer: 'B',
            workingMd:
              'Both logarithms need positive arguments: $x > 0$ and $x - 6 > 0$, so $x > 6$.\n\nCombine the logarithms: $\\log_3 [x(x - 6)] = 3$, so $x(x - 6) = 3^3 = 27$.\n\nThen $x^2 - 6x - 27 = 0$, which factors as $(x - 9)(x + 3) = 0$, giving $x = 9$ or $x = -3$. Only **9** satisfies $x > 6$.\n\nCheck: $\\log_3 9 + \\log_3 3 = 2 + 1 = 3$.',
            lesson:
              'Write the domain down before transforming a logarithm equation, and test every root against it. Combining logarithms, squaring or multiplying out can create solutions the original equation does not have.',
          },
        ],
      },
      {
        id: 'reading-comprehension',
        heading: 'Reading comprehension',
        introMd:
          'Reading comprehension is 11 of the 50 questions. Bocconi says the passages for the standard test deal with economic topics such as GDP, deficits and inflation and may contain figures, and that questions test both explicit information and the implicit meaning of the text. Both questions below refer to this original passage.',
        questions: [
          {
            id: 'reading-supported-statement',
            title: 'What the passage supports',
            topic: 'Explicit information',
            stimulusMd:
              '> In 2025, average nominal wages in Country X rose by 4%, while consumer prices rose by 6%. Because prices rose faster than pay, economists estimate that the purchasing power of the average wage fell by about 2%. Some commentators concluded that households in Country X were worse off. Others warned that the figure describes an average: workers whose pay was renegotiated early in the year may have kept pace with prices, while workers on long fixed contracts are likely to have fallen further behind. Neither group disputed the published figures; they disagreed about what an average can show about individual households.',
            stemMd: 'Which statement is best supported by the passage?',
            options: [
              { id: 'A', text: 'Every worker in Country X could buy less with their pay in 2025 than in 2024.', note: 'Turns an average into a claim about everyone. The passage says some workers may have kept pace with prices.' },
              { id: 'B', text: 'On average, a wage in Country X bought less in 2025 than in 2024.', note: '' },
              { id: 'C', text: 'Workers on long fixed contracts received the largest pay rises.', note: 'The passage suggests the opposite: these workers are likely to have fallen further behind.' },
              { id: 'D', text: 'The commentators disagreed about the published inflation figure.', note: 'The passage says neither group disputed the published figures.' },
            ],
            answer: 'B',
            workingMd:
              'The passage says that the purchasing power of the average wage fell by about 2%, which is what B says in other words. The figures agree: pay rose 4% while prices rose 6%, and $1.04 \\div 1.06 \\approx 0.98$.',
            lesson:
              'Match the strength of an answer to the strength of the text. Words such as “average”, “about”, “may have” and “likely” limit what you can conclude; an option that removes them, such as “every worker”, usually claims too much.',
          },
          {
            id: 'reading-main-point',
            title: 'A commentator’s point',
            topic: 'Implicit meaning',
            stemMd:
              'Refer to the passage above. What is the main point of the commentators who “warned that the figure describes an average”?',
            options: [
              { id: 'A', text: 'The published wage figures were measured incorrectly.', note: 'They did not dispute the published figures.' },
              { id: 'B', text: 'Rising prices affected only workers on fixed contracts.', note: 'Overstates the passage, which says these workers are likely to have fallen further behind, not that nobody else was affected.' },
              { id: 'C', text: 'One average can hide very different experiences among workers.', note: '' },
              { id: 'D', text: 'Households in Country X were better off in 2025 than in 2024.', note: 'Nobody in the passage claims this.' },
            ],
            answer: 'C',
            workingMd:
              'These commentators accept the figures but say they describe an average, then contrast two groups of workers whose experience differed. Their point is that the average does not show what happened to any particular household: answer C.',
            lesson:
              'To find a writer’s or speaker’s point, locate the sentence that explains why they disagree with someone else, then choose the option that restates it without adding a new claim.',
          },
        ],
      },
      {
        id: 'numerical-reasoning',
        heading: 'Numerical reasoning',
        introMd:
          'Numerical reasoning is 6 of the 50 questions. Bocconi describes simple calculations where the difficulty is reading a chart or table correctly and separating the information you need from the information you do not.',
        questions: [
          {
            id: 'rates-not-totals',
            title: 'Comparing rates, not totals',
            topic: 'Reading a table',
            stimulusMd:
              '| Workshop | Places offered | Applications | Accepted |\n| --- | ---: | ---: | ---: |\n| A | 40 | 120 | 36 |\n| B | 60 | 200 | 50 |',
            stemMd: 'A workshop’s acceptance rate is the number accepted divided by the number of applications. Which statement is correct?',
            options: [
              { id: 'A', text: 'Workshop B has the higher acceptance rate, because it accepted more applicants.', note: 'Compares totals instead of rates. B accepted more people but a smaller share of its applicants.' },
              { id: 'B', text: 'Workshop A’s acceptance rate is 5 percentage points higher than Workshop B’s.', note: '' },
              { id: 'C', text: 'Both workshops have an acceptance rate of 30%.', note: 'Uses Workshop A’s rate for both rows.' },
              { id: 'D', text: 'Workshop A’s acceptance rate is 20 percentage points higher than Workshop B’s.', note: 'Confuses a relative difference with a difference in percentage points: 30% is 20% higher than 25% (5 ÷ 25), but only 5 percentage points higher.' },
            ],
            answer: 'B',
            workingMd:
              'Workshop A: 36 ÷ 120 = 0.30, or 30%. Workshop B: 50 ÷ 200 = 0.25, or 25%. The difference is **5 percentage points**.\n\nThe “Places offered” column is not needed: the question defines the rate using applications.',
            lesson:
              'Decide what the question asks for (a count, a rate, a difference in percentage points or a relative difference) and find its denominator before calculating. Columns you do not need are part of the test.',
          },
          {
            id: 'shares-of-different-totals',
            title: 'Percentages of different totals',
            topic: 'Reading a table',
            stimulusMd:
              '| Month | Visitors | Share who bought an exhibition ticket |\n| --- | ---: | ---: |\n| March | 8,000 | 15% |\n| April | 10,000 | 12% |\n| May | 12,500 | 10% |',
            stemMd: 'A museum recorded its visitors for three months. In which month did it sell the most exhibition tickets?',
            options: [
              { id: 'A', text: 'March', note: 'March has the highest share, but a share of the smallest number of visitors.' },
              { id: 'B', text: 'March and April, equally', note: 'March and April do tie, at 1,200 tickets each, but May sold more.' },
              { id: 'C', text: 'May', note: '' },
              { id: 'D', text: 'About the same number in all three months', note: 'Rounds too coarsely. The question asks which month sold the most, and 1,250 is more than 1,200.' },
            ],
            answer: 'C',
            workingMd:
              'Multiply each share by its own number of visitors:\n\n- March: 15% of 8,000 = 1,200\n- April: 12% of 10,000 = 1,200\n- May: 10% of 12,500 = 1,250\n\nMay sold the most: **1,250** tickets.',
            lesson:
              'A percentage means nothing without its base. Turn shares into numbers before comparing them; here a falling percentage hides a rising number of tickets.',
          },
        ],
      },
      {
        id: 'critical-thinking',
        heading: 'Critical thinking',
        introMd:
          'Critical thinking is 9 of the 50 questions. Bocconi describes two kinds: a set of data followed by statements, where you decide which are true from the data alone; and a short passage followed by a statement that you judge true, false or impossible to deduce from the passage. The second kind has three possible answers, and on critical-thinking questions with only three options a wrong answer costs −0.33.',
        questions: [
          {
            id: 'true-false-cannot-deduce',
            title: 'True, false or cannot be deduced',
            topic: 'A passage and a statement',
            stimulusMd:
              '> The town council says its new street lighting has reduced burglaries. In the twelve months after the lights were installed, reported burglaries fell from 140 to 110. During the same twelve months, the town also put more police officers on night patrol.',
            stemMd: 'Statement: *The new street lighting caused the fall in burglaries.* Based only on the passage, the statement is:',
            options: [
              { id: 'A', text: 'True', note: 'Repeats the council’s claim. The passage reports the claim, but nothing in it establishes that the lighting caused the fall.' },
              { id: 'B', text: 'False', note: 'Tempting, because the passage offers another explanation. But another possible cause does not show that the lighting had no effect. “False” needs the passage to contradict the statement.' },
              { id: 'C', text: 'Cannot be deduced from the passage', note: '' },
            ],
            answer: 'C',
            workingMd:
              'The passage gives two changes that happened at the same time, the new lighting and more night patrols, and one result, fewer burglaries. Either change, both or neither could explain the fall, and the passage gives nothing that separates them. It neither confirms nor contradicts the statement, so the statement **cannot be deduced**.',
            lesson:
              'Answer only from the passage. Choose “true” only when the text guarantees the statement and “false” only when it contradicts it; everything in between cannot be deduced. With a −0.33 penalty on these questions, this distinction is worth practising.',
          },
          {
            id: 'overlapping-groups',
            title: 'Statements about overlapping groups',
            topic: 'Data and statements',
            stemMd:
              'At a summer school of 60 students, 38 attend a statistics workshop, 30 attend a writing workshop and 8 attend neither. Which statement must be true?',
            options: [
              { id: 'A', text: 'Exactly 16 students attend both workshops.', note: '' },
              { id: 'B', text: 'Exactly 8 students attend both workshops.', note: 'Calculates 38 + 30 − 60 and forgets the 8 students who attend neither workshop.' },
              { id: 'C', text: 'More students attend only the writing workshop than only the statistics workshop.', note: 'Only writing: 30 − 16 = 14. Only statistics: 38 − 16 = 22.' },
              { id: 'D', text: 'More than half of the students attend the writing workshop.', note: '30 is exactly half of 60, not more than half.' },
            ],
            answer: 'A',
            workingMd:
              '60 − 8 = 52 students attend at least one workshop.\n\nAdding the two workshops, 38 + 30 = 68, counts everyone who attends both twice. So 68 − 52 = **16** attend both.\n\nFrom there: only statistics 38 − 16 = 22, only writing 30 − 16 = 14.',
            lesson:
              'With overlapping groups, count each part once: total = only the first + only the second + both + neither. A quick Venn diagram on your scrap paper prevents double counting. Read limits such as “more than half” and “at least half” exactly.',
          },
        ],
      },
      {
        id: 'law-test-verbal-reasoning',
        heading: 'For the Law test: verbal reasoning',
        introMd:
          'Verbal reasoning is 10 of the 50 questions on the Law test and does not appear on the standard test. Bocconi says some of these questions ask you to identify an argument’s assumption, conclusion or flaw, or what strengthens or weakens it.',
        questions: [
          {
            id: 'necessary-assumption',
            title: 'An argument’s assumption',
            topic: 'Identifying an assumption',
            stemMd:
              'A student association argues: “Moving our weekly meeting online will increase attendance, because members will no longer need to travel to campus.” Which assumption does the argument depend on?',
            options: [
              { id: 'A', text: 'Every member prefers online meetings to meetings on campus.', note: 'Stronger than the argument needs. It still works if only some members prefer meeting online.' },
              { id: 'B', text: 'Travel currently stops at least some members, who would attend an online meeting, from attending.', note: '' },
              { id: 'C', text: 'Online meetings are always shorter than meetings on campus.', note: 'Meeting length is never mentioned and does not connect travel to attendance.' },
              { id: 'D', text: 'Other student associations have already moved their meetings online.', note: 'What other associations did says nothing about whether travel keeps these members away.' },
            ],
            answer: 'B',
            workingMd:
              'The argument says removing travel will raise attendance. That only works if travel is currently keeping away some members who would otherwise come.\n\nNegate B: if travel stops nobody from attending, removing it cannot raise attendance, and the argument collapses. So B is necessary.\n\nB does not guarantee the conclusion; other obstacles could remain. A necessary assumption is a link the argument needs, not proof that its conclusion is true.',
            lesson:
              'To test a possible assumption, negate it. If the argument falls apart, the assumption is necessary; if the argument survives, the option is too strong or irrelevant.',
          },
        ],
      },
    ],
    afterMd: `## Turn your mistakes into the next practice session

For each question you missed, write down why: a concept you did not know, a misread word, the wrong denominator, or a conclusion the text did not support. Then rework the question without looking at the solution, and try a different question that tests the same skill. Explanations you can reproduce a week later are worth more than a high score on questions you have already seen.

## Official Bocconi practice

Bocconi's [test page](https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test) lists the topics for every area, recommends the Faculty app for practice by subject, and links a free online simulation: 50 questions in 75 minutes, three questions per page and no going back. Use the simulation to rehearse the real test experience; Bocconi's page and its rules of conduct are the authority on how the test works.

## Next steps on UniExamer

- [Bocconi admission test preparation](/exams/bocconi-online-test), with the free diagnostic and the practice available for the undergraduate and Law tests.
- [The format and scoring guide](/exams/bocconi-online-test/format), with every rule and its source.
- [Negative marking on the Bocconi test](/guides/bocconi-test-negative-marking-when-to-guess): when a guess is worth it.
- [A week-by-week preparation plan](/guides/bocconi-test-preparation-plan).
- [Undergraduate or Law test: which one to take](/guides/bocconi-undergraduate-vs-law-test).

## About this page

Written by the UniExamer team with AI assistance and published on 29 October 2026. The facts about the test were checked against Bocconi's official test page on the same day. Every answer was re-derived step by step during editing; the questions have not been reviewed by a human subject expert. Read our [editorial standards](/about/editorial-standards) for how we create and check content. If you find a mistake, write to [support@uniexamer.com](mailto:support@uniexamer.com) and a person will reply.`,
  },
};
