import { md, type Lesson } from '../../types';

export const lesson: Lesson = {
  slug: "sequences-and-patterns",
  title: "Sequences and patterns",
  summary: "Test additive, multiplicative and interleaved rules, track positions carefully and explain which continuation follows a specified pattern.",
  minutes: 18,
  objectives: [
    "Recognise a constant change in values or differences.",
    "Separate alternating operations from interleaved sequences.",
    "Use a position and cycle length to predict a term."
  ],
  teachMd: md`
### Compare neighbours before guessing the next term

Copy the terms in order, leaving a small space between each pair. In those spaces write the operation that takes you from the earlier value to the later one. Start with subtraction because differences still make sense when a term is zero. If the differences are all the same, the terms follow an arithmetic progression (*progressione aritmetica*) over the displayed range. Starting at seven and adding four each time gives seven, eleven, fifteen and nineteen. To reach the fifth term from the first you make four moves. The number of gaps is always one fewer than the number of displayed terms.

When the differences change, inspect how they change. Steps of two, four and six suggest adding successive even numbers. Under that rule the following step is eight. Write that step between the last known term and its empty neighbour, then add it to obtain the missing term. A common slip is to report the number in the gap when the question asks for the number in the row. For a missing middle term, work from both ends. The proposed term should produce the expected step on its left and on its right.

### Try a ratio or split the row

When each jump grows sharply, try dividing a non-zero term into the next one. Constant ratios signal a geometric progression. Keep ratios as fractions so that halving and multiplying by three halves remain easy to track by hand. Be careful with negative terms. Multiplying by a negative number both changes magnitude and reverses sign. Alternating signs alone therefore do not force two separate rules. Check whether one multiplier explains the entire list before separating it into parts.

A row may alternate two operations on consecutive terms. Write the first operation over the first gap, the second over the second gap, then test the same pair over the next two gaps. Alternatively, a problem may define independent rules for odd and even positions. In that case write positions one, three and five on one line and positions two, four and six below. A proposed rule on one line says nothing about the other line until a clue links them. Number the empty position before choosing which line to extend.

### Track a cycle by position

For a repeating display, label the positions in one complete cycle. A wheel might show a triangle, a dot and a square, then repeat in that order. Positions three, six and nine show the square. Dividing the target position by three leaves a remainder that tells you where to stop. A remainder of zero lands on the final item of the cycle when counting positions from one. If the question instead counts moves from an initial display, zero moves leaves that initial display in place. Draw the first move explicitly to settle the indexing.

The same bookkeeping helps with letter sequences and rotating figures. Assign a number to each letter if the problem specifies an alphabet. If the rule wraps around, write the wrap point on the page. In a figure with several features, track orientation separately from shading or shape. The two features may have different periods. To determine a later frame, take its position in each feature’s cycle and combine the results only at the end.

### State the rule you are using

A finite list can be extended in many ways. An exercise may specify constant second differences, a repeating operation pair or a choice of candidate rules. Use that information when justifying a continuation. A rule that fits only the final pair is weak evidence even when it predicts one of the options. Run the rule from the first term and account for every transition. If several rules explain the displayed terms and predict different continuations, look again for a restriction in the question. A definite numerical answer needs a stated or otherwise constrained rule.
`,
  examples: [
    {
      id: "example-1",
      title: "Growing steps",
      problemMd: "A row starts 4, 7, 12, 19. The differences grow by two on each move. What follows?",
      steps: [
        "The three observed gaps are 3, 5 and 7.",
        "The next gap is 9. Add it to the last term."
      ],
      answerMd: "28. Nine is the change in the term."
    },
    {
      id: "example-2",
      title: "Cycle positions",
      problemMd: "A lamp repeats blue, white, green and amber from position one. Which colour occupies position 38?",
      steps: [
        "Nine complete cycles use 36 positions.",
        "Two further positions are blue and white."
      ],
      answerMd: "White occupies position 38."
    }
  ],
  traps: [
    {
      title: "Counting the first term as a move",
      md: "To go from position one to position six takes five moves. Write both end indices."
    },
    {
      title: "Extending the wrong strand",
      md: "For interleaved rows, mark odd and even positions explicitly before extrapolating."
    }
  ],
  check: [
    {
      id: "check-1",
      title: "A missing term",
      topic: "Logic",
      stemMd: "In an arithmetic progression the second term is 9 and the fifth is 21. What is the third?",
      options: [
        {
          id: "A",
          text: "12",
          note: "This divides the total change by four terms rather than three gaps and then adds three."
        },
        {
          id: "B",
          text: "13",
          note: ""
        },
        {
          id: "C",
          text: "15",
          note: "This takes the midpoint of the two endpoints, which lies between positions three and four."
        },
        {
          id: "D",
          text: "17",
          note: "This is the fourth term after two moves."
        },
        {
          id: "E",
          text: "21",
          note: "This repeats the given fifth term."
        }
      ],
      answer: "B",
      workingMd: "Three gaps cover a change of twelve, so each is four. One move from nine gives thirteen.",
      lesson: "Divide by the number of gaps between known positions."
    },
    {
      id: "check-2",
      title: "Two strands",
      topic: "Logic",
      stemMd: "Odd positions start at 2 and double each time. Even positions start at 20 and fall by 3 each time. What is the seventh term?",
      options: [
        {
          id: "A",
          text: "8",
          note: "This is the third odd-position term, at position five."
        },
        {
          id: "B",
          text: "11",
          note: "This belongs to the fourth even position."
        },
        {
          id: "C",
          text: "14",
          note: "This belongs to the third even position."
        },
        {
          id: "D",
          text: "16",
          note: ""
        },
        {
          id: "E",
          text: "32",
          note: "This doubles one more time to reach position nine."
        }
      ],
      answer: "D",
      workingMd: "The odd positions one, three, five and seven contain 2, 4, 8 and 16.",
      lesson: "Translate a position into its index within the relevant strand."
    },
    {
      id: "check-3",
      title: "A rotating pointer",
      topic: "Logic",
      stemMd: "A pointer initially faces north. On each move it turns clockwise by one quarter-turn. Where does it face after 19 moves?",
      options: [
        {
          id: "A",
          text: "North",
          note: "A multiple of four moves would bring it back to north."
        },
        {
          id: "B",
          text: "East",
          note: "East is reached after one extra move."
        },
        {
          id: "C",
          text: "South",
          note: "South follows two extra moves."
        },
        {
          id: "D",
          text: "North-east",
          note: "Whole quarter-turns never reach a diagonal from north."
        },
        {
          id: "E",
          text: "West",
          note: ""
        }
      ],
      answer: "E",
      workingMd: "Sixteen moves complete four cycles. The final three bring the pointer through east and south to west.",
      lesson: "Count moves from the initial state when it is position zero."
    }
  ],
  takeaways: [
    "Write changes in the gaps and terms in the row.",
    "Check a candidate rule against all the displayed terms.",
    "Mark the difference between position one and move zero."
  ],
  practice: {
    examKey: "tolc-i",
    domain: "tolci-logic",
    skill: "tolci-logic-sequences"
  },
  review: {
    aiAssisted: true,
    independentCheckOn: '2026-11-10',
    expertReview: null
  }
};
