import { md, type Lesson } from '../../types';

export const lesson: Lesson = {
  slug: "stated-information-and-meaning-in-context",
  title: "Stated information and meaning in context",
  summary: "Match a paraphrase to a precise detail and use the surrounding sentences to choose the intended meaning of a word or phrase.",
  minutes: 18,
  objectives: [
    "Check a paraphrase against its subject, time and scope.",
    "Infer a local word meaning from contrasts and examples.",
    "Distinguish an explicit detail from an explanation supplied by the reader."
  ],
  teachMd: md`
### Identify what the question asks you to retrieve

A detail question gives you a small search task. Before rereading the passage, name the kind of information you need. A date, a comparison, the condition for an exception and the identity of a speaker each call for a different piece of evidence. Find the sentence containing the relevant idea and read one sentence on either side. An exception may appear after the rule it qualifies. A date may belong to a proposal mentioned before the project actually began. Keep both events in view until you know which the question asks about.

A correct restatement can use completely different words from the passage. To compare meanings, ask who did what, to which objects, when and under what condition. Suppose a notice says that staff may borrow unused screens after the exhibition closes. An answer saying employees have permission to take spare screens on loan after closure preserves those relationships. An answer saying staff borrowed the screens changes permission into an event. Both versions sound close to the notice until you check the verb.

### Keep the boundaries of the claim

Qualifiers are part of the information. “At least twelve” includes twelve and any larger number. “No more than twelve” points in the other direction. “Most of the returned forms” concerns a narrower group than “most of the forms”. Circle the words naming the group before reading a percentage or a comparison. If a passage distinguishes respondents from invitees, a fact about respondents transfers to all invitees only when the passage explicitly supplies the link.

Keep track of the source of a statement too. A caretaker may report a leak, an engineer may suggest a possible cause and an inspection may later confirm damage. The passage explicitly states that the engineer made a suggestion. That alone leaves the actual cause open. A detail question can ask what someone claimed without asking whether that person's claim was established. Repeat a reporting verb such as “suggested”, “observed” or “confirmed” in your rough answer to keep the strength intact.

### Infer a word’s sense locally

For meaning in context (*significato nel contesto*), cover the target word and read the remaining sentence as a gap. Decide what job the missing word does before scanning the alternatives. Does it describe a physical action, an attitude or the status of a decision? Try a plain substitute. Then inspect the neighbouring sentence for an example, contrast or consequence that tests your substitute. A “qualified welcome” followed by a list of reservations means approval with limits. The sense of being professionally trained fits a person but makes little sense as a description of that welcome.

Substitute each plausible answer into the complete phrase. Preserve the word’s grammatical role and the scale of its meaning. “Delayed” and “cancelled” might both describe a departure that fails to happen at noon. A line giving the new departure time distinguishes them. Avoid choosing a familiar dictionary meaning solely because it is the one you learned first. The surrounding sentences often do more work than the target sentence by itself.

### Make an evidence check before selecting

Produce a short answer in your own words while the options are covered. When an option matches it, point to the smallest span that supports all of the option. Read the rest of that option too. An answer can begin with a supported detail and end by adding a reason that appears nowhere. For a word question, check both the replacement word and its effect on the paragraph as a whole. For a detail question, reread any restriction on the group or the time. These final checks take little space on paper and expose differences that a keyword match would miss.
`,
  examples: [
    {
      id: "example-1",
      title: "Permission or action?",
      problemMd: "“After the final rehearsal, performers may collect the spare scores at the side door.” Does the notice state that performers collected scores?",
      steps: [
        "Identify the modal verb “may”, which grants permission.",
        "Check the time and object of that permission, then look for any statement of actual collection."
      ],
      answerMd: "It states that collection is permitted after the final rehearsal. Whether anyone collected a score is unstated."
    },
    {
      id: "example-2",
      title: "A local sense",
      problemMd: "“The inspector reserved judgement on the roof. She would give an opinion only after the tiles dried.” What does “reserved” mean here?",
      steps: [
        "The second sentence places the opinion in the future.",
        "Substitute “withheld” before “judgement”. The two sentences now agree on the timing."
      ],
      answerMd: "She withheld judgement. The familiar sense of booking in advance does not fit the object and context."
    }
  ],
  traps: [
    {
      title: "Copying a keyword",
      md: "Two sentences can share nouns while exchanging the roles of giver and recipient. Check the verbs and their subjects."
    },
    {
      title: "Ignoring the next sentence",
      md: "A second sentence can show whether an interruption is temporary or permanent. Read far enough to test the suggested meaning."
    }
  ],
  check: [
    {
      id: "check-1",
      title: "Who received the map?",
      topic: "Verbal comprehension",
      stemMd: "“All visitors received a ticket. Visitors joining the roof tour also received a map. Guides kept the keys at the desk.” Which detail is explicitly stated?",
      options: [
        {
          id: "A",
          text: "Every visitor received a map.",
          note: "The statement about maps applies to roof-tour visitors."
        },
        {
          id: "B",
          text: "Tour visitors kept the keys.",
          note: "The guides are identified as the key holders."
        },
        {
          id: "C",
          text: "Roof-tour visitors received a map.",
          note: ""
        },
        {
          id: "D",
          text: "Guides joined the roof tour.",
          note: "The guides’ role in the tour is unspecified."
        },
        {
          id: "E",
          text: "Only roof-tour visitors received tickets.",
          note: "Tickets went to all visitors."
        }
      ],
      answer: "C",
      workingMd: "The second sentence directly assigns maps to visitors joining the roof tour. No inference about other visitors’ maps is needed.",
      lesson: "Match both the item and the group receiving it."
    },
    {
      id: "check-2",
      title: "What was deferred?",
      topic: "Verbal comprehension",
      stemMd: "“The council shelved the plan until measurements from winter became available. Members agreed to discuss it again in March.” What does “shelved” mean here?",
      options: [
        {
          id: "A",
          text: "Installed it on a shelf.",
          note: "The subject under discussion is a plan for later debate."
        },
        {
          id: "B",
          text: "Approved it permanently.",
          note: "Future discussion signals that approval is unresolved."
        },
        {
          id: "C",
          text: "Declared it impossible.",
          note: "The council expects to revisit the proposal."
        },
        {
          id: "D",
          text: "Put it aside temporarily.",
          note: ""
        },
        {
          id: "E",
          text: "Divided it into phases.",
          note: "The passage gives a delay, without describing phases."
        }
      ],
      answer: "D",
      workingMd: "The word “until” and the planned March discussion both make the interruption temporary.",
      lesson: "Use the next action to test the meaning of the earlier verb."
    },
    {
      id: "check-3",
      title: "Scope of a count",
      topic: "Verbal comprehension",
      stemMd: "“Of the 18 sensors returned, six had cracked cases. The workshop also received three empty packages.” Which statement preserves the reported count?",
      options: [
        {
          id: "A",
          text: "Six returned sensors had cracked cases.",
          note: ""
        },
        {
          id: "B",
          text: "Six packages were empty.",
          note: "The empty-package count was three."
        },
        {
          id: "C",
          text: "Twelve returned sensors were fully functional.",
          note: "An intact case alone does not establish function."
        },
        {
          id: "D",
          text: "All cracked sensors were returned.",
          note: "The count covers returns and says nothing about unreturned sensors."
        },
        {
          id: "E",
          text: "Twenty-one sensors reached the workshop.",
          note: "Empty packages do not add to the sensor count."
        }
      ],
      answer: "A",
      workingMd: "The report counts cracked cases within the group of 18 returned sensors. Other faults and unreturned items are outside that measurement.",
      lesson: "Carry the counted property and its reference group together."
    }
  ],
  takeaways: [
    "Retain the subject, time and scope when paraphrasing.",
    "Keep permission, prediction and observation distinct.",
    "Test a proposed word meaning in its whole sentence and the sentence after it."
  ],
  practice: {
    examKey: "tolc-i",
    domain: "tolci-verbal",
    skill: "tolci-verbal-stated"
  },
  review: {
    aiAssisted: true,
    independentCheckOn: '2026-11-10',
    expertReview: null
  }
};
