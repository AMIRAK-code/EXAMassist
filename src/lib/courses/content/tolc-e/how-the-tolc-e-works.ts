import { md, type Lesson } from '../../types';

export const gettingStartedLesson: Lesson = {
  slug: 'how-the-tolc-e-works',
  title: 'How the TOLC-E works',
  summary: 'Plan around three separate section clocks, calculate the main score, and separate CISIA rules from your university’s requirements.',
  minutes: 16,
  objectives: ['Describe the section order and separate timing.', 'Calculate a main-section score from an answer record.', 'Find the programme-specific conditions that a national score cannot settle.'],
  teachMd: md`
### Start with the three clocks

The TOLC-E begins with Logic: 13 questions in 30 minutes. Verbal comprehension follows with 10 questions in 30 minutes, then Mathematics with 13 questions in 30 minutes. Together these make 36 questions in 90 minutes. English follows separately, with 30 questions in 15 minutes. The English result is scored separately; do not add it to the main score when describing your performance. This course teaches the three main sections. Its logic and reading lesson titles organise useful reasoning skills; CISIA does not publish a topic list for those two aptitude sections.

A separate clock matters because unused time cannot rescue a later section. Closing a section early forfeits its remaining time, and after leaving a section you cannot return to it. Suppose you finish Logic comfortably. That does not create a longer Mathematics allowance. Prepare to complete the work inside each section's own budget. The rules recorded in our research do not specify movement between questions within an open section, so avoid turning a convenient practice-tool feature into a claim about test-day navigation.

### Count decisions, then calculate the score

Each main-section question offers five options, of which exactly one is correct. A correct answer earns 1 point, a blank earns 0, and a wrong answer loses 0.25. If $c$ is the number correct and $w$ the number wrong, the main score is $c-0.25w$. Always check that correct, wrong and blank counts total 36 before applying the formula. A misplaced blank can otherwise make a plausible calculation describe an impossible answer record.

For a study exercise, compare two answer records with the same number correct. The one containing more wrong answers has the lower score. That observation is useful when reviewing decisions: distinguish a knowledge gap from an avoidable misreading. It does not mean every uncertain answer should be left blank. A probability calculation describes repeated decisions under an assumption about your chance of being correct; it does not tell you that your feeling of confidence is accurately calibrated. Keep actual evidence, such as a rejected contradiction or a checked calculation, separate from familiarity.

### Understand the arithmetic of uncertainty

If the chance of a correct answer is $p$, the expected main-section points from answering are $p-0.25(1-p)=1.25p-0.25$. This equals zero at $p=0.2$. Choosing uniformly among all five options therefore has zero expected points under that model. If one option has genuinely been ruled out and the remaining four are equally likely, the expected result is $0.25-0.25(0.75)=0.0625$ points. These are mathematical expectations, not promised outcomes on an individual question. You can still lose points on any single uncertain choice.

Use that distinction to make your review more precise. After a practice question, record why you eliminated an option. “It felt unfamiliar” is weak evidence. “It violates the condition that the denominator is positive” is a reason another reader can inspect. Revisit apparently successful guesses too. A correct selection reached through an invalid argument needs repair just as much as a wrong selection does. Your purpose in study is to build repeatable reasoning, not to defend yesterday's answer.

### Read the programme's admission notice

CISIA sets no national pass mark for the TOLC-E. A university may transform the result, weight sections and set its own minimum. Your programme's admission notice, often called the bando, determines what the score means for that application. Check the accepted test and mode, deadlines and stated selection conditions there. A total that meets one programme's requirement cannot establish admission elsewhere. Keep a short written list of the conditions you actually found, rather than carrying an assumed universal target from another applicant.

The test can be taken at a university or from home under remote proctoring, but the university states which modes it accepts. Each type of TOLC may be taken at most once per calendar month, regardless of mode or university. The recorded validity rule guarantees acceptance by universities using the same TOLC in the same mode at least for the year taken. That is not permission to ignore the receiving programme's dates and conditions. Put proposed attempts on a calendar before making a preparation plan around them.

### Practise in a way you can inspect

No calculator or other calculation aid is permitted. During study, write enough intermediate working to locate an error without redoing the entire question. In reading, underline the words that restrict a claim; in logic, draw a small counterexample; in mathematics, state a domain restriction before manipulating an expression. Try each course example before opening its solution. Then compare the reason for every step, not merely the final result. Finish with the check and use its explanations to choose the next skill to practise. A short, accurate account of why an answer follows is more useful than a long collection of unchecked solutions.
`,
  examples: [
    { id: 'score-record', title: 'A complete answer record', problemMd: 'A learner answers 25 main questions correctly, 7 wrongly and leaves 4 blank. Calculate the main score.', steps: ['Check the count: 25 + 7 + 4 = 36, so the record covers the main test.', 'Deduct one quarter point for each of the 7 wrong answers: $25-7(0.25)=25-1.75$.'], answerMd: 'The score is 23.25. Subtracting the four blanks as well would wrongly penalise omissions.' },
    { id: 'remaining-time', title: 'Keep time in its own section', problemMd: 'A learner closes Logic after 24 minutes. How much time is available for the following Verbal comprehension section?', steps: ['Logic and Verbal comprehension have separate 30-minute limits.', 'The six unused Logic minutes are forfeited when that section is closed.'], answerMd: 'Verbal comprehension still has 30 minutes, not 36.' },
    { id: 'expected-points', title: 'A probability model', problemMd: 'Assume an answer has a 0.4 probability of being correct. What are its expected main-section points?', steps: ['The incorrect probability is $1-0.4=0.6$.', 'Weight both outcomes: $0.4(1)+0.6(-0.25)=0.4-0.15$.'], answerMd: 'The expectation is 0.25 points. This is an average under the model, not a guaranteed gain.' },
  ],
  traps: [
    { title: 'Treating 90 minutes as a shared pool', md: 'The total summarises three separate clocks. Practise the sections separately so unused time in one does not hide a pacing problem in another.' },
    { title: 'Inventing a universal pass mark', md: 'A programme may apply its own weights and threshold. Read the admission notice before treating any score as sufficient.' },
    { title: 'Confusing expectation with certainty', md: 'A positive expected value can still produce a loss on one answer. Inspect the evidence behind your probability judgement.' },
  ],
  check: [
    { id: 'check-1', title: 'Score from counts', topic: 'TOLC-E format', stemMd: 'A main-test record has 24 correct answers, 8 wrong answers and 4 blanks. What is the main score?', options: [
      { id: 'A', text: '20', note: 'This deducts one point per wrong pair rather than one quarter per wrong answer.' },
      { id: 'B', text: '21', note: 'This also deducts one quarter point for each blank.' },
      { id: 'C', text: '22', note: '' },
      { id: 'D', text: '24', note: 'This omits the penalty for the eight wrong answers.' },
      { id: 'E', text: '26', note: 'This adds the wrong-answer adjustment instead of subtracting it.' },
    ], answer: 'C', workingMd: 'The counts total 36. Eight wrong answers cost $8(0.25)=2$ points; blanks cost nothing. The result is $24-2=22$.', lesson: 'Check the total count before applying the penalty.' },
    { id: 'check-2', title: 'Section order', topic: 'TOLC-E format', stemMd: 'Which description gives the three main TOLC-E sections in their published order?', options: [
      { id: 'A', text: 'Mathematics, Logic, Verbal comprehension', note: 'This moves Mathematics from the third position to the first.' },
      { id: 'B', text: 'Logic, Verbal comprehension, Mathematics', note: '' },
      { id: 'C', text: 'Logic, Mathematics, Verbal comprehension', note: 'This swaps the second and third sections.' },
      { id: 'D', text: 'Verbal comprehension, Logic, Mathematics', note: 'This swaps the first and second sections.' },
      { id: 'E', text: 'Logic, Sciences, Mathematics', note: 'Sciences is not a main TOLC-E section.' },
    ], answer: 'B', workingMd: 'The published sequence starts with 13 Logic questions, continues with 10 Verbal comprehension questions and ends with 13 Mathematics questions. Each has 30 minutes.', lesson: 'Prepare for the order and the clock of each section.' },
    { id: 'check-3', title: 'A second attempt', topic: 'TOLC-E format', stemMd: 'Nico takes a TOLC-E at home in April. Assuming places are available, which further TOLC-E attempt satisfies the frequency rule?', options: [
      { id: 'A', text: 'At a university later in April', note: 'Changing the mode does not restart the monthly allowance.' },
      { id: 'B', text: 'At home later in April after a low score', note: 'The first result does not create an exception to the monthly limit.' },
      { id: 'C', text: 'At a different university later in April', note: 'Changing university does not restart the allowance.' },
      { id: 'D', text: 'At home in May', note: '' },
      { id: 'E', text: 'A second April attempt if the first contained blanks', note: 'Leaving answers blank does not create an extra attempt.' },
    ], answer: 'D', workingMd: 'The limit applies to each TOLC type once per calendar month, across modes and universities. May is a new calendar month; a second April attempt is not allowed by that rule.', lesson: 'Count attempts by test type and calendar month.' },
  ],
  takeaways: ['The main sections contain 36 questions across three separate 30-minute clocks.', 'The main score is correct answers minus one quarter of wrong answers.', 'English is scored separately.', 'The programme’s admission notice determines how the score is used.'],
  practice: { examKey: 'tolc-e', domain: 'tolce-logic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
