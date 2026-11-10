import { md, type Lesson } from '../../types';

export const lesson: Lesson = {
  slug: "cohesion-and-inference",
  title: "Cohesion and inference",
  summary: "Use connective words, pronoun references and a passage’s structure to identify the conclusion its evidence supports.",
  minutes: 18,
  objectives: [
    "Identify what a connective asks the reader to do.",
    "Trace a reference to its supporting phrase.",
    "Choose an inference that survives a counterexample."
  ],
  teachMd: md`
### Read for the movement of the argument

Read a short passage through once before deciding which individual phrase matters most. Ask what happens between the beginning and the end. A writer might introduce a proposal, describe a trial and qualify the conclusion drawn from it. In that structure the proposal belongs to its proposer, the figures describe the trial and the qualification tells you how far the writer is willing to go. Confusing those roles can make a genuine quotation from the passage into a poor answer about the writer’s view.

Connectives (*connettivi*) are instructions about relationships. “Because” introduces a reason. “Therefore” introduces something presented as following from a reason. “Although” gives space to a fact that seems to pull against the point the writer goes on to make. Read the clauses on either side aloud in ordinary words. A sentence beginning “Although fewer repairs were recorded” might end with a warning that fewer machines were inspected. The fall in recorded repairs remains a fact. The warning changes what a reader can infer about the condition of the machines.

### Find what a reference picks up

Words such as “they”, “this” and “the latter” save the writer from repeating a whole phrase. To resolve a reference, replace it with a candidate and read the sentence again. Check agreement in number and check what kind of thing the verb requires. A policy can be adopted, a committee can vote and a measurement can fall. The nearest noun might fail one of these tests. A reference such as “this difference” often points to a comparison spanning a whole sentence rather than to a single noun.

Suppose a passage says that late deliveries fell in the morning but rose in the evening. “This contrast prompted a review” picks up the opposing changes. Replacing “this contrast” with “the evening” loses the comparison. If two candidates remain grammatically possible, use the surrounding argument to decide whether one makes better sense. When the passage leaves a reference genuinely unresolved, be cautious about any option whose conclusion requires choosing a particular candidate.

### Separate an inference from a plausible addition

An inference (*inferenza*) draws on statements the writer has supplied. One sentence might tell you that all items on display were lent by residents. Another tells you that a particular model boat was on display. Together they establish the origin of that boat even though neither sentence names its lender. To test the conclusion, try making it false while keeping the two sentences true. A displayed boat from a museum would break the first sentence. The proposed counterexample fails, and that shows how the conclusion follows.

By contrast, a conclusion that the boat was built by a resident adds an extra link between lending and making. A resident could have bought it. Look for that same gap in arguments based on numbers. A larger total can result from more participants, more activity per participant or both. An observation about the total alone rarely settles which explanation is right. Preserve the population, period and measurement used in the passage before moving to an explanation.

### Compare the strength of competing answers

Put two plausible options side by side and underline the word on which they differ. “May” leaves alternatives open. “Must” rules them out. “So far” limits a claim in time. “In every location” expands it across space. For each bold claim, ask which exact sentence would rule out an exception. You do not need outside knowledge to construct a possible exception. Give the passage a world in which its claims hold and the option fails. When explaining your choice, name the link that supplies the inference. Quoting one striking phrase without explaining its role leaves the reasoning unfinished.
`,
  examples: [
    {
      id: "example-1",
      title: "What prompted the review?",
      problemMd: "“The library opened an hour earlier. Morning visits rose, but the daily total stayed level. This discrepancy led staff to examine visits later in the day.” What does the discrepancy refer to?",
      steps: [
        "Identify the two measurements contrasted by “but”.",
        "Substitute the comparison for “this discrepancy” and read the final sentence."
      ],
      answerMd: "It refers to the rise in morning visits alongside an unchanged daily total."
    },
    {
      id: "example-2",
      title: "An unobserved interval",
      problemMd: "“The counter was read at noon and at dusk. Its reading was higher at dusk. It records only entries and never resets during the day.” What can be inferred?",
      steps: [
        "A higher cumulative reading requires at least one additional entry.",
        "Neither reading identifies the time of an individual entry within the interval."
      ],
      answerMd: "At least one entry occurred between readings. A steady rate throughout the afternoon is unproved."
    }
  ],
  traps: [
    {
      title: "Attributing a quoted belief to the author",
      md: "Locate who says a claim and read the writer’s response before assigning a view."
    },
    {
      title: "Turning sequence into cause",
      md: "An event can follow another for many reasons. Look for evidence connecting the events before inferring cause."
    }
  ],
  check: [
    {
      id: "check-1",
      title: "An apparent improvement",
      topic: "Verbal comprehension",
      stemMd: "“A depot received fewer complaints in June than in May. However, June also had fewer deliveries, and the number of complaints per delivery was unchanged.” Why introduce the delivery count?",
      options: [
        {
          id: "A",
          text: "To show delivery times improved.",
          note: "The passage gives no delivery times."
        },
        {
          id: "B",
          text: "To explain why fewer complaints need not indicate a lower complaint rate.",
          note: ""
        },
        {
          id: "C",
          text: "To dispute that complaint totals fell.",
          note: "The passage accepts the fall in totals."
        },
        {
          id: "D",
          text: "To show complaints caused a fall in deliveries.",
          note: "No causal direction of this kind is given."
        },
        {
          id: "E",
          text: "To claim May was typical.",
          note: "There is no comparison with other months."
        }
      ],
      answer: "B",
      workingMd: "The second sentence supplies the denominator. A smaller volume allows fewer complaints at the same rate.",
      lesson: "Read a qualification as a limit on what earlier evidence establishes."
    },
    {
      id: "check-2",
      title: "A necessary source",
      topic: "Verbal comprehension",
      stemMd: "“Every item in the cabinet was recovered from the old quay. The cabinet contains a brass key. Objects from the quay were catalogued before display.” Which conclusion follows?",
      options: [
        {
          id: "A",
          text: "Every key from the quay is brass.",
          note: "One example does not describe every key."
        },
        {
          id: "B",
          text: "The key opened a door at the quay.",
          note: "Recovery location does not establish use."
        },
        {
          id: "C",
          text: "The key was made at the quay.",
          note: "A place of recovery need not be the place of manufacture."
        },
        {
          id: "D",
          text: "The brass key was recovered from the old quay.",
          note: ""
        },
        {
          id: "E",
          text: "Everything recovered from the quay is in the cabinet.",
          note: "This reverses the direction of the first sentence."
        }
      ],
      answer: "D",
      workingMd: "Apply the rule about every cabinet item to the particular key inside. Its recovery location follows directly.",
      lesson: "Combine a membership fact with a rule about every member."
    },
    {
      id: "check-3",
      title: "The writer’s position",
      topic: "Verbal comprehension",
      stemMd: "“The designer calls the shorter queue proof that the new desk works faster. Yet the building admitted fewer visitors during the trial. Timing individual transactions would distinguish the explanations.” What is the writer’s position?",
      options: [
        {
          id: "A",
          text: "The desk definitely works more slowly.",
          note: "The writer offers no evidence of slower transactions."
        },
        {
          id: "B",
          text: "Fewer visitors always cause shorter queues.",
          note: "The writer does not make a universal claim."
        },
        {
          id: "C",
          text: "The queue alone cannot establish faster service.",
          note: ""
        },
        {
          id: "D",
          text: "The new desk should be removed.",
          note: "No decision to remove equipment is proposed."
        },
        {
          id: "E",
          text: "Individual transactions were already timed.",
          note: "Timing is proposed as a further measurement."
        }
      ],
      answer: "C",
      workingMd: "The writer accepts the observation and offers an alternative explanation. The proposed measurement would address the unresolved question.",
      lesson: "Distinguish a criticism of evidence from rejection of the hypothesis."
    }
  ],
  takeaways: [
    "Identify whose view each sentence expresses.",
    "Replace a pronoun or reference phrase with its proposed antecedent.",
    "Ask whether the passage permits an exception to the proposed inference."
  ],
  practice: {
    examKey: "tolc-i",
    domain: "tolci-verbal",
    skill: "tolci-verbal-inferred"
  },
  review: {
    aiAssisted: true,
    independentCheckOn: '2026-11-10',
    expertReview: null
  }
};
