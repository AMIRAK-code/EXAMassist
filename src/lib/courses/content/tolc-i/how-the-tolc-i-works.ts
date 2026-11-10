import { md, type Lesson } from '../../types';

export const lesson: Lesson = {
  slug: "how-the-tolc-i-works",
  title: "How the TOLC-I works",
  summary: "Plan around four section clocks, calculate your score by hand and check the admission rules for the engineering programme you want to enter.",
  minutes: 18,
  objectives: [
    "Budget time within each section.",
    "Calculate the four-section absolute score.",
    "Find the conditions that matter in a programme’s admission notice."
  ],
  teachMd: md`
### Make four separate time budgets

Draw four boxes on paper. Label them Mathematics, Logic, Sciences and Verbal comprehension, in that order. In the first box write 20 questions and 50 minutes. In each of the other three write 10 questions and 20 minutes. Together the four boxes hold 50 questions in 110 minutes. The boxes matter because each section has its own clock. If you close Mathematics after 45 minutes, Logic still has 20 minutes. Once a section closes you cannot return to it. Use spare time to check work while the section is open whenever the format allows it.

For a practice session, divide the time in a box by its number of questions. Mathematics allows an average of two and a half minutes per question. Each other box allows two minutes. These are averages for planning. A quick deduction buys thinking time for a harder problem in the same box. Try a short set on paper using its corresponding share of the section clock. Afterwards, record which operation used the time. For instance, spotting a common factor before multiplying might save more time than practising multiplication itself.

### Count the answers before calculating the score

In the four main sections a correct answer earns one point, a blank earns zero and a wrong answer costs a quarter of a point. Each question has five options with one correct answer. Make three columns labelled correct, wrong and blank. Check that the counts together match the number of questions. Start with the correct count and subtract one point for each group of four wrong answers. Handle leftover wrong answers in quarters. You can use the same calculation on a single section or across all four. A calculator is unavailable during the test, so practise grouping numbers in this way on paper.

CISIA scores English separately. That section has 30 questions in 15 minutes and awards a point for a correct answer with zero for either a wrong answer or a blank. Keep a separate line for English when reading a score report. The lessons and practice links here cover the four main sections. If you combine the two totals, you lose the distinction a programme may need when it reads your results.

### Read the admission notice alongside the result

Find the admission notice (*bando*) for the programme you want to enter. CISIA sets no national pass mark. A university may give sections different weights, set its own minimum or look at Mathematics on its own when assigning additional learning requirements (*obblighi formativi aggiuntivi*, or OFA). Keep your four section scores even after you have calculated the total. Two students with the same absolute score can have different Mathematics scores. To apply a weighting rule, copy the rule from the relevant notice, multiply each named section by its stated weight and keep the unweighted result separately.

Check the delivery mode as well. TOLC@UNI means sitting the test in a university computer room. TOLC@CASA means sitting it from home in a proctored virtual room. Each university specifies which mode it accepts. A result is valid at universities using the same TOLC in the same mode for at least the year in which the test was taken. Check the conditions for the programme and year you plan to enter before choosing a sitting.

### Plan a second attempt

You may take a given type of TOLC at most once per calendar month, across modes and universities. Write the test type and calendar month next to a proposed date. Changing the location or switching from home to a university room still leaves the same type in the same month. When comparing possible dates, distinguish eligibility under this rule from the actual availability of a sitting. Finally, choose one skill to revisit between attempts. Work its examples by hand, cover the answers and try its three checks before following the practice link.
`,
  examples: [
    {
      id: "example-1",
      title: "Score a section",
      problemMd: "A learner gets 11 mathematics answers right and six wrong. What are the blank count and score?",
      steps: [
        "Of the 20 questions, 17 received answers. Three remained blank.",
        "Four wrong answers cost one point and the other two cost half a point."
      ],
      answerMd: "Three blanks and 9.5 points. Subtract the penalty from 11."
    },
    {
      id: "example-2",
      title: "Compare two reports",
      problemMd: "An invented programme doubles Mathematics and adds the other main sections. Fia has 12 in Mathematics and 18 across the rest. Teo has 14 and 16. Who has the higher weighted result?",
      steps: [
        "Both unweighted totals are 30.",
        "Applying the invented rule gives Fia 24 + 18 and Teo 28 + 16."
      ],
      answerMd: "Teo leads by two weighted points, 44 to 42."
    }
  ],
  traps: [
    {
      title: "Banking time",
      md: "Minutes left at early closure expire. Rehearse each section with a fresh timer."
    },
    {
      title: "Changing venue",
      md: "The monthly limit follows the test type. Put every planned TOLC-I sitting on the same calendar."
    }
  ],
  check: [
    {
      id: "check-1",
      title: "A section closes early",
      topic: "TOLC-I format",
      stemMd: "A learner closes Mathematics after 42 minutes. How many minutes does Logic allow?",
      options: [
        {
          id: "A",
          text: "8",
          note: "This counts the unused mathematics time alone."
        },
        {
          id: "B",
          text: "20",
          note: ""
        },
        {
          id: "C",
          text: "28",
          note: "This adds forfeited minutes to the logic clock."
        },
        {
          id: "D",
          text: "42",
          note: "This copies the time spent in Mathematics."
        },
        {
          id: "E",
          text: "50",
          note: "This uses the maximum for the previous section."
        }
      ],
      answer: "B",
      workingMd: "Logic starts with its own 20-minute limit. The unused eight minutes expire.",
      lesson: "Keep the four section clocks separate."
    },
    {
      id: "check-2",
      title: "Quarter points",
      topic: "TOLC-I format",
      stemMd: "A science section has six correct, three wrong and one blank. What does it contribute?",
      options: [
        {
          id: "A",
          text: "3",
          note: "This charges a whole point for each error."
        },
        {
          id: "B",
          text: "5",
          note: "This charges the blank a quarter as well."
        },
        {
          id: "C",
          text: "6",
          note: "This drops the penalty for the errors."
        },
        {
          id: "D",
          text: "5.25",
          note: ""
        },
        {
          id: "E",
          text: "6.75",
          note: "This adds the penalty to the correct count."
        }
      ],
      answer: "D",
      workingMd: "Three errors cost three quarters. Six minus three quarters is 5.25.",
      lesson: "Group wrong answers in fours to calculate by hand."
    },
    {
      id: "check-3",
      title: "Planning another sitting",
      topic: "TOLC-I format",
      stemMd: "Mara sat a TOLC-I in May at a university. Which plan meets the frequency rule, assuming places are available?",
      options: [
        {
          id: "A",
          text: "Another TOLC-I at home in May",
          note: "Changing the mode leaves the month unchanged."
        },
        {
          id: "B",
          text: "Another TOLC-I at a different university in May",
          note: "Moving to another university does not reset the count."
        },
        {
          id: "C",
          text: "A TOLC-I in June",
          note: ""
        },
        {
          id: "D",
          text: "A second May TOLC-I if her first score was low",
          note: "A low score creates no exception to the monthly limit."
        },
        {
          id: "E",
          text: "A second May TOLC-I if a programme accepts both modes",
          note: "Acceptance of modes concerns use of results, not frequency."
        }
      ],
      answer: "C",
      workingMd: "June is a new calendar month. All four May proposals repeat the same test type in the same month.",
      lesson: "Count sittings by test type and calendar month."
    }
  ],
  takeaways: [
    "Plan separately for each section clock.",
    "Keep English separate from the four-section score.",
    "Read the programme’s admission notice for mode, weights and thresholds."
  ],
  practice: {
    examKey: "tolc-i",
    domain: "tolci-mathematics"
  },
  review: {
    aiAssisted: true,
    independentCheckOn: '2026-11-10',
    expertReview: null
  }
};
