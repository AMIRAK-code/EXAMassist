import { md, type Lesson } from '../../types';

export const howTheImatWorksLesson: Lesson = {
  slug: 'how-the-imat-works',
  title: 'How the IMAT works',
  summary: 'The IMAT in one page: 60 questions in 100 minutes on paper, where the 90 points sit, what the 20-point threshold means and how the rankings work.',
  minutes: 15,
  objectives: [
    'Describe the format of the 2026/27 IMAT: questions, options, time, language and materials.',
    'Work out how many points each subject area can contribute to the maximum of 90.',
    'Explain the difference between the 20-point threshold, the national rankings and winning a place.',
  ],
  teachMd: md`
### One test for three degree courses

The IMAT is the admission test for the English-taught degree courses in Medicine and Surgery, Dentistry and Dental Prosthodontics, and Veterinary Medicine at Italian universities. The Ministry of University and Research (MUR) sets its rules each year by decree, and CINECA writes the questions, prepares the test and computes the scores. One test serves all three degrees, and it is the same at every venue, in Italy and abroad. The 2025 reform that replaced the entrance test with a *semestre filtro* does not apply to the English-taught degrees, so the IMAT is still a single test sat on one day.

Everything in this lesson describes the 2026/27 test, held on 29 September 2026 under D.M. 1005 of 6 August 2026. Nothing has been published for 2027/28 yet. The last two decrees were both signed in early August, so when the next one appears, check the format, the scoring, the threshold and the date against it before you rely on any number here.

### Sixty questions, five options, one hundred minutes

The test has 60 questions. Each has five options, and you choose exactly one. You have 100 minutes for the whole paper, and every question is written in English, symbolic language included. The questions fall into five areas:

| Area | Questions | Most points available |
| --- | --- | --- |
| Reading skills and knowledge acquired in studies | 4 | 6 |
| Logical reasoning and problems | 5 | 7.5 |
| Biology | 23 | 34.5 |
| Chemistry | 15 | 22.5 |
| Physics and mathematics | 13 | 19.5 |
| **Total** | **60** | **90** |

The last column is simply the number of questions times 1.5, the mark for a correct answer. Read it as a study plan: biology, chemistry, and physics and mathematics together hold 51 of the 60 questions, which is $51 \times 1.5 = 76.5$ of the 90 points, or $85\%$. The two non-science areas are small, but together their 9 questions still hold $9 \times 1.5 = 13.5$ points, so they are worth securing rather than ignoring.

### On paper, with no calculator

The test is sat in person. You receive a question booklet and an answer sheet, and you mark each answer with an X using the black pen handed out at the venue. You may correct an answer only once per question, and a question you decide to leave blank is marked as such. Phones, tablets, smartwatches and similar equipment are banned, as are manuals, notes and any pen or pencil of your own.

The rules do not name calculators, but nothing allows one either, and you write only with what the venue supplies. Prepare as if every calculation will be done by hand, which is how every worked example in this course is set out.

Nothing in the decree divides the 100 minutes between the areas or fixes an order. With a single booklet in front of you, you can move freely between questions. That follows from the paper format rather than from a stated rule, but it means the order in which you work is your decision.

### How the score is built

A correct answer scores $+1.5$, a blank scores $0$ and a wrong answer scores $-0.4$. Your score is the sum over all 60 questions, so the maximum is $60 \times 1.5 = 90$. There is no scaled score: the number you receive is this raw, penalty-adjusted total. The next lesson works out when the penalty makes guessing worthwhile and how to spend the 100 minutes.

### Threshold, rankings and places

The score does two separate jobs.

**It decides whether you can be ranked.** EU candidates, and non-EU candidates resident in Italy, must score at least 20 points to be placed in a ranking. Non-EU candidates resident abroad need only a score above 0, and they compete for their own places in the ranking of the university at which they pre-enrolled.

**It decides your position.** There are two national rankings: one for Medicine and Surgery together with Dentistry, and one for Veterinary Medicine. In 2026/27 you choose one of the two at registration, on Universitaly, and the choice becomes irrevocable when registration closes. A place depends on where you stand in your ranking against the places available at each university, so 20 points is an entry ticket to the ranking, not a pass mark for admission.

When two candidates have the same total, the tie is broken in this order: the higher score in biology, then in chemistry, then in physics and mathematics, then in logical reasoning, then in reading and knowledge. After that come a recognised English certificate, then a disability of at least 66%, and finally the younger candidate.

### What the syllabus covers

The syllabus headings are reading skills and general knowledge (comprehension of English texts; history, institutions and citizenship), logical reasoning and problems, biology, chemistry, mathematics (algebra, functions, geometry and trigonometry, probability and statistics) and physics (units and vectors, kinematics, dynamics, fluids, thermodynamics, electricity and magnetism). The units of this course follow the same headings, and each lesson ends with a link to practice in the matching area.
`,
  examples: [
    {
      id: 'example-points-by-area',
      title: 'Where the 90 points sit',
      problemMd: md`A candidate plans to spend most of their study time on chemistry. What share of the maximum score can the chemistry questions contribute, and how does that compare with biology?`,
      steps: [
        md`Each correct answer is worth $1.5$ points, so the chemistry maximum is $15 \times 1.5 = 22.5$ points.`,
        md`As a share of the maximum: $\frac{22.5}{90} = 0.25$, which is $25\%$. A second route gives the same figure: chemistry is $\frac{15}{60} = \frac{1}{4}$ of the questions, and every question carries the same weight.`,
        md`Biology: $23 \times 1.5 = 34.5$ points, and $\frac{23}{60} \approx 0.383$, about $38\%$ of the maximum.`,
      ],
      answerMd: md`Chemistry can contribute 22.5 points, a quarter of the 90; biology can contribute 34.5 points, about $38\%$. Because every question carries the same mark, the share of points always equals the share of questions.`,
    },
    {
      id: 'example-threshold',
      title: 'Reading a score against the threshold',
      problemMd: md`Two EU candidates finish the test. Candidate P has 20 correct, 15 wrong and 25 blank. Candidate Q has 16 correct, 11 wrong and 33 blank. Can each of them be ranked?`,
      steps: [
        md`Check the counts first: $20 + 15 + 25 = 60$ and $16 + 11 + 33 = 60$.`,
        md`P: $20 \times 1.5 - 15 \times 0.4 = 30 - 6 = 24$ points.`,
        md`Q: $16 \times 1.5 - 11 \times 0.4 = 24 - 4.4 = 19.6$ points.`,
        md`For EU candidates the threshold is at least 20 points. P, with 24, can be ranked; Q, with 19.6, cannot.`,
      ],
      answerMd: md`P (24 points) enters the ranking; Q (19.6 points) does not. Had Q been a non-EU candidate resident abroad, 19.6 would have been enough to enter their university's ranking, since that only needs a score above 0. Entering a ranking does not guarantee a place for either of them.`,
    },
    {
      id: 'example-tie-break',
      title: 'Breaking a tie',
      problemMd: md`Candidates R and S both score 61 points in the Medicine and Dentistry ranking. In biology, R had 18 correct, 2 wrong and 3 blank; S had 18 correct, 1 wrong and 4 blank. Who is placed higher?`,
      steps: [
        md`The first tie-break is the biology score, so compute it for each candidate. The counts both add up to 23, the number of biology questions.`,
        md`R: $18 \times 1.5 - 2 \times 0.4 = 27 - 0.8 = 26.2$.`,
        md`S: $18 \times 1.5 - 1 \times 0.4 = 27 - 0.4 = 26.6$.`,
      ],
      answerMd: md`S is placed above R, because S's biology score is higher (26.6 against 26.2). Counting correct answers alone would show a tie, since both have 18; the penalty for the extra wrong answer separates them.`,
    },
  ],
  traps: [
    {
      title: 'Treating 20 points as a pass mark',
      md: md`The 20-point threshold only lets EU candidates, and non-EU candidates resident in Italy, into a ranking. Places are won by position in the ranking against the places at each university. Plan for the strongest score you can reach, not for 20.`,
    },
    {
      title: 'Assuming next year is the same',
      md: md`Every number in this lesson comes from the 2026/27 decree. Nothing has been published for 2027/28. The 2026/27 format repeated the 2025/26 one, but the only safe habit is to read the new decree when it appears and check the format, scoring, threshold and date.`,
    },
    {
      title: 'Practising with a calculator',
      md: md`Nothing in the rules allows a calculator, and only the venue's pen may be used. A candidate who always practises with a calculator meets hand arithmetic for the first time under time pressure. Do all your practice by hand from the start.`,
    },
    {
      title: 'Forgetting that the ranking choice is final',
      md: md`In 2026/27 a candidate chose Medicine and Dentistry or Veterinary Medicine at registration, and the choice became irrevocable when registration closed. Decide which ranking you want before registration ends.`,
    },
  ],
  check: [
    {
      id: 'check-biology-chemistry-count',
      title: 'Counting the questions',
      topic: 'Test format',
      stemMd: md`How many of the 60 IMAT questions are in biology and chemistry together?`,
      options: [
        { id: 'A', text: md`15`, note: md`This is the chemistry count alone; the biology questions were left out.` },
        { id: 'B', text: md`23`, note: md`This is the biology count alone; the chemistry questions were left out.` },
        { id: 'C', text: md`28`, note: md`This adds chemistry (15) and physics and mathematics (13), not biology and chemistry.` },
        { id: 'D', text: md`38`, note: '' },
        { id: 'E', text: md`51`, note: md`This is all three science areas, including the 13 physics and mathematics questions.` },
      ],
      answer: 'D',
      workingMd: md`Biology has 23 questions and chemistry has 15, so together they have $23 + 15 = 38$. As a check, the other three areas have $4 + 5 + 13 = 22$, and $38 + 22 = 60$.`,
      lesson: 'Learn the five area counts (4, 5, 23, 15, 13); most planning questions start from them.',
    },
    {
      id: 'check-physics-maths-points',
      title: 'Points in physics and mathematics',
      topic: 'Scoring',
      stemMd: md`What is the largest number of points a candidate can score from the physics and mathematics questions alone?`,
      options: [
        { id: 'A', text: md`13`, note: md`This is the number of questions; each correct answer is worth 1.5 points, not 1.` },
        { id: 'B', text: md`15`, note: md`This is the number of chemistry questions, not a points total for physics and mathematics.` },
        { id: 'C', text: md`19.5`, note: '' },
        { id: 'D', text: md`20`, note: md`This is the ranking threshold for EU candidates, not the maximum of any area.` },
        { id: 'E', text: md`22.5`, note: md`This is the chemistry maximum, $15 \times 1.5$.` },
      ],
      answer: 'C',
      workingMd: md`Physics and mathematics has 13 questions, each worth $1.5$ when correct: $13 \times 1.5 = 19.5$. Check: $\frac{13}{60}$ of 90 is $\frac{13 \times 90}{60} = \frac{1170}{60} = 19.5$.`,
      lesson: 'An area’s maximum is its question count times 1.5, and the five maxima add up to 90.',
    },
    {
      id: 'check-threshold-meaning',
      title: 'What 24 points means',
      topic: 'Threshold and rankings',
      stemMd: md`An EU candidate who chose the Medicine and Dentistry ranking scores 24 points. Which statement is correct under the 2026/27 rules?`,
      options: [
        { id: 'A', text: md`The candidate is guaranteed a place, because 24 is above the threshold.`, note: md`The threshold only gives entry to the ranking; a place depends on the candidate's position against the places available.` },
        { id: 'B', text: md`The candidate can be placed in the national ranking they chose; whether they win a place depends on their position in it.`, note: '' },
        { id: 'C', text: md`The candidate cannot be ranked, because EU candidates need at least 30 points.`, note: md`The threshold for EU candidates is 20 points, not 30.` },
        { id: 'D', text: md`The candidate appears in both the Medicine and Dentistry ranking and the Veterinary Medicine ranking.`, note: md`In 2026/27 each candidate chose one of the two rankings at registration, and the choice became irrevocable.` },
        { id: 'E', text: md`The score is first converted to a scaled score, and the threshold applies to that.`, note: md`There is no scaled score; the threshold applies to the raw, penalty-adjusted total.` },
      ],
      answer: 'B',
      workingMd: md`EU candidates need at least 20 points to be ranked, and 24 is above that, so the candidate enters the Medicine and Dentistry ranking they chose. Admission then depends on their position in that ranking against the places at each university, which a score alone cannot tell.`,
      lesson: 'The threshold decides who is ranked; the ranking decides who is admitted.',
    },
  ],
  takeaways: [
    'The 2026/27 IMAT: 60 five-option questions in 100 minutes, in English, on paper, with no calculator.',
    'The areas hold 4, 5, 23, 15 and 13 questions; the three science areas carry 76.5 of the 90 points.',
    'Scoring is +1.5 correct, 0 blank, −0.4 wrong, for a maximum of 90.',
    'Twenty points lets EU candidates, and non-EU candidates resident in Italy, into a ranking; a place depends on the ranking against the places.',
    'Nothing is published for 2027/28 yet: check every number against the new decree.',
  ],
  flashcards: [
    { front: 'IMAT format (2026/27)', back: '60 questions with five options and one correct answer, in 100 minutes, in English, on paper.' },
    { front: 'Questions per area', back: 'Reading skills and knowledge 4, logical reasoning and problems 5, biology 23, chemistry 15, physics and mathematics 13.' },
    { front: 'Marks per answer', back: 'Correct +1.5, blank 0, wrong −0.4. The maximum is 90.' },
    { front: 'The 20-point threshold', back: 'EU candidates, and non-EU candidates resident in Italy, need at least 20 points to be ranked. Non-EU candidates resident abroad need a score above 0.' },
    { front: 'The two national rankings', back: 'One for Medicine and Surgery with Dentistry, one for Veterinary Medicine. In 2026/27 a candidate chose one at registration.' },
    { front: 'First tie-break', back: 'The higher biology score, then chemistry, physics and mathematics, logical reasoning, and reading and knowledge.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const scoringGuessingAndPacingLesson: Lesson = {
  slug: 'scoring-guessing-and-pacing',
  title: 'Scoring, guessing and pacing on the IMAT',
  summary: 'Score an IMAT answer sheet, decide when a guess is worth the −0.4 penalty, and split 100 minutes across 60 questions without running out of time.',
  minutes: 18,
  objectives: [
    'Calculate an IMAT score from the numbers of correct, wrong and blank answers.',
    'Work out the expected value of a guess after eliminating some options, and decide when to guess.',
    'Build a time plan for the 100 minutes and adjust it during the test.',
  ],
  teachMd: md`
### The score in one line

With $c$ correct answers and $w$ wrong answers, the score is

$$S = 1.5c - 0.4w$$

Blanks score nothing, so they do not appear. Always check that correct, wrong and blank add up to 60 before you compute; most scoring slips are counting slips. A useful ratio: one wrong answer costs $\frac{0.4}{1.5} = \frac{4}{15}$ of a correct one, so 15 wrong answers cost $15 \times 0.4 = 6$ points, exactly the value of 4 correct answers.

### What a guess is worth

A guess is a gamble, and its long-run value is its **expected value**: the gain if right times the chance of being right, minus the loss if wrong times the chance of being wrong. If you choose at random among $k$ options that still contain the correct one,

$$E = 1.5 \times \frac{1}{k} - 0.4 \times \frac{k-1}{k}$$

| Options left | Chance of being right | Expected value |
| --- | --- | --- |
| 5 (blind guess) | $\frac{1}{5}$ | $0.3 - 0.32 = -0.02$ |
| 4 | $\frac{1}{4}$ | $0.375 - 0.3 = +0.075$ |
| 3 | $\frac{1}{3}$ | $0.5 - 0.267 \approx +0.23$ |
| 2 | $\frac{1}{2}$ | $0.75 - 0.2 = +0.55$ |

A blind guess is very slightly worse than a blank: on average it costs 0.02 points. As soon as you can rule out one option with confidence, the expected value turns positive, and it grows quickly with each option you remove.

The break-even point tells the same story. If $p$ is your chance of being right, a guess pays on average when $1.5p - 0.4(1 - p) > 0$, that is when $1.9p > 0.4$, or $p > \frac{4}{19} \approx 0.21$. A random pick among five gives $p = 0.2$, just below the line; any real knowledge pushes you above it.

### Expected value is an average, not a promise

On a single question you either gain 1.5 or lose 0.4; the expected value describes what happens over many guesses. Its message for planning is simple: an option you have honestly eliminated is worth something, so never leave a question blank only because you are unsure between two or three options. The elimination must be honest, though. Ruling out an option because it "looks wrong", without a reason, does not change your real chance of being right.

### The time budget

One hundred minutes for 60 questions is an average of $\frac{100}{60} = 1\frac{2}{3}$ minutes, or 1 minute 40 seconds, per question. If you share the time in proportion to the number of questions, each area gets:

| Area | Questions | Time at 1 min 40 s each |
| --- | --- | --- |
| Reading skills and knowledge | 4 | 6 min 40 s |
| Logical reasoning and problems | 5 | 8 min 20 s |
| Biology | 23 | 38 min 20 s |
| Chemistry | 15 | 25 min |
| Physics and mathematics | 13 | 21 min 40 s |

The total is exactly 100 minutes. This is a starting plan, not a rule: nothing in the decree divides the time, and a recall question in biology may take 30 seconds while a physics calculation takes three minutes. The point of the table is to give you checkpoints. If you work in the order of the table and are still in the middle of biology after 40 minutes, you know you are behind.

### Two passes through the booklet

Because you can move freely through the paper booklet, a two-pass method works well:

1. **First pass.** Answer every question you can settle quickly. When a question will clearly take long, note its number and move on.
2. **Second pass.** Return to the marked questions, hardest last. Eliminate what you can and apply the guessing rule above.

Leave a few minutes at the end. The answer sheet allows only one correction per question, so decide before you mark. Mark the sheet as you go, or, if you hold provisional answers anywhere else, transfer them regularly, for example at the end of each area, rather than all at once in the final minutes. A correct answer that never reaches the sheet scores nothing.
`,
  examples: [
    {
      id: 'example-score-a-sheet',
      title: 'Scoring an answer sheet',
      problemMd: md`A candidate answers 38 questions correctly, 12 wrongly and leaves 10 blank. What is the score?`,
      steps: [
        md`Check the counts: $38 + 12 + 10 = 60$.`,
        md`Points for correct answers: $38 \times 1.5 = 57$.`,
        md`Penalty for wrong answers: $12 \times 0.4 = 4.8$. Blanks add nothing.`,
        md`Score: $57 - 4.8 = 52.2$. Second route: 12 wrong answers cost as much as $12 \times \frac{4}{15} = 3.2$ correct ones, and $(38 - 3.2) \times 1.5 = 34.8 \times 1.5 = 52.2$.`,
      ],
      answerMd: md`52.2 points. Subtracting a full point per wrong answer would give $57 - 12 = 45$, a common slip.`,
    },
    {
      id: 'example-guess-after-elimination',
      title: 'Guess or leave blank?',
      problemMd: md`On a chemistry question you are certain two of the five options are wrong, but you cannot choose between the other three. Should you answer?`,
      steps: [
        md`Three options remain, one of them correct, so a random choice among them is right with probability $\frac{1}{3}$.`,
        md`Expected value: $1.5 \times \frac{1}{3} - 0.4 \times \frac{2}{3} = 0.5 - 0.267 \approx 0.23$ points.`,
        md`A blank is worth exactly 0, and $0.23 > 0$, so guessing is better on average.`,
      ],
      answerMd: md`Answer the question. Guessing among three remaining options is worth about $+0.23$ points on average, against 0 for a blank. Treating every guess as dangerous because a blind guess is slightly negative would throw these points away.`,
    },
    {
      id: 'example-final-minutes',
      title: 'The last three minutes',
      problemMd: md`With three minutes left, six questions are unanswered. On two of them you have narrowed the choice to two options; the other four you have not read. What should you do?`,
      steps: [
        md`For each of the two narrowed questions: $1.5 \times \frac{1}{2} - 0.4 \times \frac{1}{2} = 0.75 - 0.2 = 0.55$. Together, $2 \times 0.55 = 1.1$ points on average.`,
        md`For each unread question a blind guess is worth $-0.02$; four of them together are worth $4 \times (-0.02) = -0.08$ on average.`,
        md`So mark the two narrowed answers on the sheet first, and leave the four unread questions blank.`,
      ],
      answerMd: md`Answer the two narrowed questions (about $+1.1$ points on average) and leave the other four blank. Guessing on all six blindly would waste the work already done; guessing on the four unread ones adds a slightly negative expectation.`,
    },
  ],
  traps: [
    {
      title: 'Guessing blind because "a guess cannot hurt"',
      md: md`With five options and a $-0.4$ penalty, a blind guess has an expected value of $-0.02$. It hurts very little on average, but it does not help. Guess when you have a reason to remove at least one option.`,
    },
    {
      title: 'Leaving every uncertain question blank',
      md: md`The opposite mistake. Once one option is honestly eliminated, a guess is worth $+0.075$ on average; with two eliminated it is worth about $+0.23$. Candidates who refuse to answer anything they are not sure of give away points across the whole paper.`,
    },
    {
      title: 'Losing time to one question',
      md: md`Every question carries the same 1.5 points. Five minutes on one stubborn calculation is the time of three average questions. Mark it, move on, and come back on the second pass.`,
    },
    {
      title: 'Transferring answers at the last moment',
      md: md`Only one correction is allowed per question, and an answer that never reaches the answer sheet scores nothing. Mark the sheet during the test, not in a rush at the end, and decide before you mark.`,
    },
  ],
  check: [
    {
      id: 'check-score-sheet',
      title: 'Score the sheet',
      topic: 'Scoring',
      stemMd: md`A candidate has 42 correct answers, 9 wrong answers and 9 blanks. What is the score?`,
      options: [
        { id: 'A', text: md`38.4`, note: md`This counts each correct answer as 1 point instead of 1.5: $42 - 3.6$.` },
        { id: 'B', text: md`54.0`, note: md`This subtracts a full point for each wrong answer: $63 - 9$.` },
        { id: 'C', text: md`55.8`, note: md`This applies the $-0.4$ penalty to the blanks as well as the wrong answers: $63 - 0.4 \times 18$.` },
        { id: 'D', text: md`59.4`, note: '' },
        { id: 'E', text: md`63.0`, note: md`This ignores the penalty for the 9 wrong answers.` },
      ],
      answer: 'D',
      workingMd: md`The counts add up: $42 + 9 + 9 = 60$. Score: $42 \times 1.5 - 9 \times 0.4 = 63 - 3.6 = 59.4$.`,
      lesson: 'Multiply correct answers by 1.5, wrong answers by 0.4, and leave blanks out entirely.',
    },
    {
      id: 'check-three-options-left',
      title: 'Three options left',
      topic: 'Guessing',
      stemMd: md`A candidate eliminates two options with certainty and guesses at random among the remaining three. What is the expected value of this guess, in points?`,
      options: [
        { id: 'A', text: md`About $-0.02$`, note: md`This is the value of a blind guess among all five options; the two eliminations were ignored.` },
        { id: 'B', text: md`About $+0.08$`, note: md`This is the value with four options left, after eliminating only one.` },
        { id: 'C', text: md`About $+0.23$`, note: '' },
        { id: 'D', text: md`$+0.50$`, note: md`This is $1.5 \times \frac{1}{3}$ alone: the penalty for the two chances in three of being wrong was left out.` },
        { id: 'E', text: md`About $+0.77$`, note: md`This adds the penalty term instead of subtracting it: $0.5 + 0.267$.` },
      ],
      answer: 'C',
      workingMd: md`The chance of being right is $\frac{1}{3}$ and of being wrong $\frac{2}{3}$. Expected value: $1.5 \times \frac{1}{3} - 0.4 \times \frac{2}{3} = 0.5 - 0.267 \approx 0.23$ points, better than the 0 of a blank.`,
      lesson: 'Each option honestly eliminated raises the value of a guess; with even one gone, it is positive.',
    },
    {
      id: 'check-remaining-pace',
      title: 'Behind schedule',
      topic: 'Pacing',
      stemMd: md`Working through the booklet in order, a candidate finishes question 30 after 55 minutes. To attempt every remaining question in the time left, what average time per question is now available?`,
      options: [
        { id: 'A', text: md`45 seconds`, note: md`This divides the 45 minutes left by all 60 questions instead of the 30 still to do.` },
        { id: 'B', text: md`1 minute 30 seconds`, note: '' },
        { id: 'C', text: md`1 minute 40 seconds`, note: md`This is the average for the whole test, $\frac{100}{60}$ minutes; it ignores the time already used.` },
        { id: 'D', text: md`1 minute 50 seconds`, note: md`This is the pace so far, 55 minutes for 30 questions, not the pace still available.` },
        { id: 'E', text: md`3 minutes 20 seconds`, note: md`This divides the full 100 minutes by the 30 remaining questions, forgetting the 55 minutes already spent.` },
      ],
      answer: 'B',
      workingMd: md`Time left: $100 - 55 = 45$ minutes. Questions left: $60 - 30 = 30$. Average: $\frac{45}{30} = 1.5$ minutes, which is 1 minute 30 seconds per question.`,
      lesson: 'At each checkpoint, divide the time left by the questions left; compare it with the 1 minute 40 seconds you started with.',
    },
  ],
  takeaways: [
    'Score = 1.5 × correct − 0.4 × wrong; blanks count zero.',
    'A blind guess among five options is worth −0.02 on average; with one option honestly eliminated it is worth +0.075.',
    'The average time is 1 minute 40 seconds per question; use the area budgets as checkpoints, not rules.',
    'Work in two passes, and mark the answer sheet during the test, deciding before you mark, since each question can be corrected only once.',
  ],
  flashcards: [
    { front: 'IMAT score formula', back: 'Score = 1.5 × correct − 0.4 × wrong. Blanks score 0.' },
    { front: 'Expected value of a blind guess', back: 'With five options, 1.5 × 0.2 − 0.4 × 0.8 = −0.02 points: very slightly worse than a blank.' },
    { front: 'Expected value with one option eliminated', back: 'With four options left, 1.5 × 0.25 − 0.4 × 0.75 = +0.075 points, so guessing pays on average.' },
    { front: 'Break-even chance for a guess', back: 'A guess pays on average when the chance of being right is above 4/19, about 21%.' },
    { front: 'Average time per question', back: '100 minutes for 60 questions is 1 minute 40 seconds per question.' },
    { front: 'Corrections on the answer sheet', back: 'One correction per question, so decide before marking, and mark the sheet regularly during the test.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-logic' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};
