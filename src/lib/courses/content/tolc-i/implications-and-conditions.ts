import { md, type Lesson } from '../../types';

export const lesson: Lesson = {
  slug: "implications-and-conditions",
  title: "Implications and necessary conditions",
  summary: "Translate if, only if and unless into one-way rules, chain deductions and test a proposed conclusion with a counterexample.",
  minutes: 18,
  objectives: [
    "Distinguish necessary and sufficient conditions.",
    "Use the contrapositive to trace a rule backwards.",
    "Construct a counterexample to an invalid inference."
  ],
  teachMd: md`
### Find the case the rule forbids

Suppose a workshop rule reads “If a strip is copper, it goes in the blue tray.” Take a single strip and ask what finding would prove the rule false. A copper strip in the red tray would do it, provided the trays are mutually exclusive. A steel strip in the blue tray would tell you nothing about a violation. The sentence tells you the destination of every copper strip. It leaves the destination of steel open. Imagining a physical object often makes an abstract implication (*implicazione*) easier to read.

Call being copper the starting condition and being in the blue tray the consequence. Being copper is sufficient for the blue tray under this rule. Being in the blue tray is necessary for being copper. Read “necessary” as a requirement that every instance must satisfy. The requirement can be shared by other objects. If all copper strips have a stamp as well, steel strips can still have the same stamp. A list of necessary features is useful for ruling candidates out even when it cannot identify them uniquely.

### Work forwards or use the contrapositive

From a known copper strip, follow the rule forwards to its tray. From a strip known to be outside the blue tray, reason backwards to the absence of copper. For if the strip were copper, the rule would have put it in blue. This backwards inference is the contrapositive. It reverses the order and negates both conditions. Reversing the order alone gives the converse. A steel strip in blue shows precisely why the converse can fail.

Try a four-row table if the language gets tangled. Record whether an object satisfies the starting condition and whether it satisfies the consequence. Both true is allowed. Both false is allowed. A false start with a true consequence is allowed too. Only a true start with a false consequence breaks the rule. Cross out that row. When given additional evidence, remove rows that disagree with the evidence, then inspect the survivors. A conclusion must hold in every surviving row to count as a deduction.

### Translate small connecting words

In “the cabinet opens only if the latch is raised”, the words after “only if” give the requirement. Starting from an open cabinet lets you infer a raised latch. A raised latch by itself settles nothing about the cabinet opening. In “the cabinet opens if the green button is pressed”, pressing the button suffices. With both sentences together, a press guarantees an opening, which guarantees a raised latch. State both intermediate links before trying to skip one. If a question says “if and only if”, it explicitly grants the reverse direction as well.

Treat “unless” by writing what happens when the exception is absent. “The bell rings unless the switch is muted” commits you to ringing whenever the switch is unmuted. On that statement alone, the behaviour when muted is unspecified. Read any extra sentence before deciding the exceptional case. Similarly, ordinary logical “or” allows both conditions unless the statement excludes that possibility. For “and” you need both conditions together. If a release needs both a signature and a seal, finding only a signature leaves the seal to establish.

### Check a deduction with one object

To test a proposed conclusion, deliberately try to defeat it. Keep every given rule true and arrange for the conclusion to be false. Write down one object with its features to show that the arrangement really is possible. If the rule concerns every item, check that your chosen object obeys every rule that applies to it. A story that breaks a premise cannot disprove a deduction. This method is especially helpful for a conclusion containing “must”. One permissible exception is enough to defeat “must”, even if the conclusion seems reasonable in everyday life.
`,
  examples: [
    {
      id: "example-1",
      title: "A required inspection",
      problemMd: "Only inspected lamps enter bay R. A lamp is in bay R. What follows?",
      steps: [
        "Place entry into R at the start of the arrow because inspection is required for entry.",
        "Follow the arrow from the known location to the requirement."
      ],
      answerMd: "The lamp was inspected. Inspection by itself does not establish its location."
    },
    {
      id: "example-2",
      title: "Two linked rules",
      problemMd: "Every embossed card is numbered. Every numbered card is logged. A card is absent from the log. Could it be embossed?",
      steps: [
        "Embossing would guarantee numbering, then logging.",
        "The missing log entry rules out numbering, which in turn rules out embossing."
      ],
      answerMd: "It cannot be embossed while both rules hold."
    }
  ],
  traps: [
    {
      title: "Reversing only if",
      md: "Underline the phrase after only if. A consequence written first in English can still come last in the logical rule."
    },
    {
      title: "Assuming a single cause",
      md: "A consequence may have several sufficient causes. Invent a second cause to test whether the first was necessary."
    }
  ],
  check: [
    {
      id: "check-1",
      title: "A lock and a light",
      topic: "Logic",
      stemMd: "Whenever a lock is jammed, its amber light is on. The light is off now. What must be true?",
      options: [
        {
          id: "A",
          text: "The lock jammed earlier.",
          note: "The rule gives no history of earlier states."
        },
        {
          id: "B",
          text: "The lock is jammed.",
          note: "A current jam would require a light."
        },
        {
          id: "C",
          text: "The lock is unjammed.",
          note: ""
        },
        {
          id: "D",
          text: "The lock has power.",
          note: "No premise mentions its power supply."
        },
        {
          id: "E",
          text: "The lamp is broken.",
          note: "An unjammed lock with a working lamp is compatible."
        }
      ],
      answer: "C",
      workingMd: "A jam would force the light on. Its absence rules out a current jam.",
      lesson: "Negate both ends when reversing a conditional."
    },
    {
      id: "check-2",
      title: "Test the converse",
      topic: "Logic",
      stemMd: "Every reserved bench carries a disc. Which observation disproves the converse while preserving the rule?",
      options: [
        {
          id: "A",
          text: "A reserved bench with a disc",
          note: "This satisfies both directions of the rule."
        },
        {
          id: "B",
          text: "An unreserved bench with a disc",
          note: ""
        },
        {
          id: "C",
          text: "An unreserved bench without a disc",
          note: "Neither direction is contradicted by this bench."
        },
        {
          id: "D",
          text: "A reserved bench without a disc",
          note: "This breaks the original rule itself."
        },
        {
          id: "E",
          text: "Two reserved benches with discs",
          note: "Repeating compatible observations still leaves the converse intact."
        }
      ],
      answer: "B",
      workingMd: "The converse says that every disc marks a reservation. An unreserved bench with a disc violates that claim and obeys the original rule.",
      lesson: "A counterexample must keep the premises true."
    },
    {
      id: "check-3",
      title: "Reading unless",
      topic: "Logic",
      stemMd: "A courier cycles unless it rains. Using only this rule, what follows?",
      options: [
        {
          id: "A",
          text: "Rain guarantees cycling.",
          note: "The rainy case is left unspecified."
        },
        {
          id: "B",
          text: "Cycling proves dry weather.",
          note: "The courier may also cycle in rain."
        },
        {
          id: "C",
          text: "Rain prevents cycling.",
          note: "The exception does not settle the rainy case."
        },
        {
          id: "D",
          text: "Failure to cycle implies rain.",
          note: ""
        },
        {
          id: "E",
          text: "Dry weather prevents cycling.",
          note: "This contradicts the condition that guarantees cycling."
        }
      ],
      answer: "D",
      workingMd: "Dry weather guarantees cycling. A failure to cycle excludes dry weather and hence requires rain.",
      lesson: "Write the non-exceptional case before reasoning about unless."
    }
  ],
  takeaways: [
    "Only if introduces a requirement.",
    "A contrapositive reverses and negates both ends.",
    "Try to satisfy the premises while defeating the conclusion."
  ],
  practice: {
    examKey: "tolc-i",
    domain: "tolci-logic",
    skill: "tolci-logic-deduction"
  },
  review: {
    aiAssisted: true,
    independentCheckOn: '2026-11-10',
    expertReview: null
  }
};
