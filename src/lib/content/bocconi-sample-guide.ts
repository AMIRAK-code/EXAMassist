import type { Guide } from './guides';

export const bocconiSampleGuide: Guide = {
  slug: 'bocconi-admission-test-sample-questions',
  title: 'Bocconi admission test: sample questions and worked answers',
  answer: 'Start with four original examples covering mathematics, reading comprehension, numerical reasoning and critical thinking. Try each question before reading its explanation, then use your mistakes to choose what to practise next. These are independent learning examples, not official Bocconi questions or a scored mock test.',
  description: 'Try four original Bocconi admission test sample questions with worked answers. Learn how to practise mathematics, reading and reasoning before a timed test.',
  examKeys: ['bocconi-undergraduate'],
  hubSlug: 'bocconi-online-test',
  publishedOn: '2026-10-28',
  updatedOn: '2026-10-28',
  readingMinutes: 7,
  sources: [{
    label: 'Online Bocconi test: subject areas and official preparation resources',
    url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test',
    publisher: 'Università Bocconi',
  }],
  bodyMd: `## Which Bocconi admission test is this for?

These examples are for the **undergraduate Online Bocconi Test**, rather than the separate Law or master's forms. Bocconi lists four areas: mathematics, reading comprehension, numerical reasoning and critical thinking. Its undergraduate test has 50 questions and lasts 75 minutes. See the [official subject list and preparation tools](https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test), checked on 28 October 2026.

The questions below are original, AI-assisted teaching examples created for this article. They do not reproduce past papers, claim official difficulty, or measure your admission chances. They are not drawn from your diagnostic test. You can read every answer without signing in.

## 1. Mathematics: successive percentage changes

A course costs €240. Its price increases by 15%, then the new price is reduced by 15%. What is the final price?

- A. €240.00
- B. €234.60
- C. €204.00
- D. €276.00

**Answer: B, €234.60.**

The increase multiplies the original price by 1.15: 240 × 1.15 = 276. The reduction applies to that new price, so 276 × 0.85 = 234.60. Together, the changes multiply the price by 0.9775, making the final price 2.25% lower than the original.

A treats equal percentage changes as if they cancel. C applies only the discount to the original price. D stops after the increase. The useful habit is to write down the base of each percentage before calculating.

**Next practice:** percentage changes, ratios and rearranging equations. Explain aloud why the base changes; being able to repeat the calculation is less useful than understanding which amount each percentage describes.

## 2. Reading comprehension: what the passage actually supports

Read this original passage:

> A university library extended its evening opening hours during a six-week pilot. Evening visits rose, but total weekly visits stayed almost unchanged. Interviews suggested that some students moved their usual daytime visits to the evening. The library has not yet measured whether the change affected study outcomes.

Which conclusion is best supported?

- A. Longer opening hours improved students' examination results.
- B. Every evening visitor previously studied during the day.
- C. The pilot changed when some students visited, without a substantial increase in total weekly visits.
- D. The library should permanently reduce its daytime opening hours.

**Answer: C.**

C combines the reported totals with the interview evidence without claiming more than either establishes. A invents an outcome the passage says was not measured. B replaces “some” with “every”. D is a policy recommendation that does not follow from the information provided.

**Next practice:** distinguish an observation, a suggested explanation and a conclusion. Underline words such as “some”, “all”, “unchanged” and “not yet”: changing one of them can turn a supported answer into an unsupported one.

## 3. Numerical reasoning: compare rates, not totals

Two workshops report their applications and accepted places:

| Workshop | Applications | Accepted places |
| --- | ---: | ---: |
| A | 120 | 36 |
| B | 200 | 50 |

Which statement is correct?

- A. Workshop B has the higher acceptance rate because it accepted more people.
- B. Workshop A's acceptance rate is 5 percentage points higher than B's.
- C. Both workshops have a 30% acceptance rate.
- D. Workshop A accepted more people than B.

**Answer: B.**

A's rate is 36 ÷ 120 = 30%. B's is 50 ÷ 200 = 25%. Subtracting gives a difference of **5 percentage points**. B accepted more people in absolute terms, but a smaller share of its applicants. That makes A and D incorrect; C uses A's rate for both rows.

Do not confuse percentage points with relative change: 30% is 20% higher than 25%, because 5 ÷ 25 = 20%. Before calculating, decide whether the question asks for a count, a proportion, a difference in percentage points or a relative difference.

**Next practice:** tables with unequal group sizes. Always identify the denominator and check units before comparing values.

## 4. Critical thinking: identify a necessary assumption

A student association argues: “Moving our weekly meeting online will increase attendance because members will no longer need to travel to campus.”

Which assumption does the argument depend on?

- A. Every member prefers online meetings to in-person meetings.
- B. Travel currently prevents at least some members from attending who would attend online.
- C. Online meetings always last less than an hour.
- D. Other student associations have already moved online.

**Answer: B.**

The proposed cause is removing travel. For that cause to increase attendance, travel must stop at least some otherwise willing participants. If B is false, removing travel does not remove the claimed barrier. A is stronger than necessary: unanimous preference is not required. C and D do not connect the travel barrier to attendance.

This assumption does not guarantee the prediction: other barriers might remain. That is the difference between a necessary link in an argument and proof that its conclusion will happen.

**Next practice:** write the conclusion and the evidence on separate lines. Then ask what must be true to connect them. Test a proposed assumption by considering its opposite.

## Turn these answers into a preparation plan

Record why you missed a question: a missing concept, a reading mistake, the wrong denominator or an unsupported inference. Rework it without looking at the solution, then try a different question testing the same skill. Four correct answers here are not a readiness score.

For a structured starting point, visit [Bocconi admission test preparation and the free diagnostic](/exams/bocconi-online-test). Use the [week-by-week preparation plan](/guides/bocconi-test-preparation-plan) to organise your sessions. Read the [format and scoring guide](/exams/bocconi-online-test/format) before moving to timed practice, and review [how negative marking changes a guessing decision](/guides/bocconi-test-negative-marking-when-to-guess).

## Where can I find official Bocconi practice?

Bocconi links its own preparation resources and online simulation from the [official test page](https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test). Use those resources to become familiar with the university's test experience. UniExamer provides independent additional practice; it does not replace the university's admissions instructions.

Applying to Law instead? Start with [the undergraduate-versus-Law comparison](/guides/bocconi-undergraduate-vs-law-test). For graduate admission, use the [Bocconi master's test guide](/exams/bocconi-master) rather than assuming the undergraduate rules apply.`,
};
