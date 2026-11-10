import { md, type Lesson } from '../../types';

export const purposeLesson: Lesson = {
  slug: 'purpose-and-passage-structure',
  title: 'Purpose and passage structure',
  summary: 'Map what each part of a passage does, distinguish an author’s purpose from the subject, and select a summary with the right scope.',
  minutes: 19,
  objectives: ['Summarise a paragraph’s role in a few words.', 'Distinguish a passage’s subject from its communicative purpose.', 'Use the relationship between paragraphs to evaluate a main-idea answer.'],
  teachMd: md`
### Name the subject, then ask what is done with it

The subject of a passage is what it discusses. Its purpose is what the writer does by discussing it. Two passages can concern the same library scheme while doing different jobs. One might explain how borrowing lockers operate; another might challenge the claim that lockers help every neighbourhood equally. A main-purpose question asks you to identify that action, not simply to recognise a noun appearing repeatedly. Begin with an active verb such as explain, compare, qualify or recommend, then add the object of that action.

Do not force every passage into an argument. An explanation can describe why a process happens without asking the reader to endorse a policy. A comparison can lay out differences without choosing a winner. A report can describe uncertainty without resolving it. If an answer calls a neutral discussion a forceful criticism, it adds a stance the writer may not have taken. Look for evaluative language and an actual conclusion before assigning a strong attitude to the author.

### Give each paragraph a job

After reading a paragraph, write a short role label in your mind or on paper. Useful labels include “introduces the proposal”, “reports a limitation”, “gives an example” and “offers a revised explanation”. These labels describe relationships rather than merely repeating subject matter. A paragraph full of numbers might be evidence for a claim, a counterexample to it or background needed to understand it. The presence of data does not determine its role; the surrounding reasoning does.

Keep the map short enough to use. A five-word label that says “tests the initial explanation” is often more helpful than a list of every detail. When the question asks why a particular sentence appears, place it back inside its paragraph and ask what would be lost if it were removed. Removing a definition may make a later comparison unclear. Removing an example may leave the claim intact but eliminate its illustration. That difference helps separate explanation from essential support.

### Track turns in the discussion

Connective words often signal the direction of a passage. “However” introduces a contrast; “for example” marks an illustration; “therefore” points towards a result or conclusion. Their exact scope matters. A qualification may limit only the previous sentence rather than overturn the whole passage. Read the clause on each side and describe the contrast in plain language. “Although bookings increased, completed visits did not” contrasts demand expressed with attendance realised. It does not say that the booking count was measured incorrectly.

The final paragraph can clarify a purpose, but the last sentence is not automatically the main idea. A passage may end with a minor practical detail after giving its central explanation earlier. Test a proposed summary against the whole map. Does it cover the opening problem, the important contrast and the eventual position? If it accounts only for the final example, it is too narrow. If it introduces an ambitious policy conclusion that none of the paragraphs supports, it is too broad.

### Distinguish author and reported speaker

Writers often introduce another person's view before examining it. “Supporters argue that…” attributes a claim; it does not establish that the author accepts it. Later evidence may support, qualify or challenge that view. Attach a mental label to each voice. Otherwise an answer that accurately repeats the supporters' assertion may be mistaken for the writer's own conclusion. Similarly, quotation marks can present language for discussion rather than express agreement with it.

To assess tone, look at what the author commits to. A writer who says a promising scheme needs further testing is cautiously interested. Calling that writer wholly opposed exaggerates the criticism; calling them certain of success ignores the reservation. Choose the least overstated description that still accounts for the language. You do not need to invent an emotional state or assume that mentioning a drawback means disapproval of the entire project.

### Test a summary for both coverage and restraint

A strong main-idea answer contains the central relationship, not a catalogue of details. For a passage contrasting higher online bookings with unchanged attendance, “The booking system is new” is true but incomplete. “More reservations need not mean more attendance” captures the contrast. “Online services never improve attendance” extends one case into a universal claim. Judge answers on their scope even when every word sounds plausible individually.

Finally, use each option to test your map rather than rereading aimlessly. If an option says “recommend”, find the recommendation. If it says “disprove”, look for evidence that rules the claim out rather than merely questions it. If it says “describe a change”, identify the before-and-after structure. An option should match both the topic and the function of the passage. This two-part test prevents attractive wording from substituting for an accurate account of the author's work.
`,
  examples: [
    { id: 'lockers', title: 'One subject, a specific purpose', problemMd: 'A passage says: “Collection lockers let borrowers retrieve books after the library closes. Yet the scheme helps only residents who can reach a locker. Locating lockers near transport stops could widen its usefulness.” What is the overall purpose?', steps: ['The opening explains the scheme’s benefit; the next sentence limits that benefit by access.', 'The final sentence proposes a way to address the limitation, rather than rejecting the scheme.'], answerMd: 'To explain a benefit of lockers, identify an access limitation and suggest an improvement. A claim that the passage opposes all lockers is too strong.' },
    { id: 'example-role', title: 'Why an example appears', problemMd: 'A writer states that demand varies by season, then notes that a repair workshop receives many bicycle jobs in spring. What does the workshop detail do?', steps: ['The general claim about seasonal demand comes before the workshop detail.', 'The detail gives a concrete instance of that claim; it does not establish that every business follows the same pattern.'], answerMd: 'It illustrates seasonal variation in demand. It is not a universal proof about all businesses.' },
    { id: 'reported-view', title: 'Keep the voices apart', problemMd: '“Promoters call the shared office a solution for every worker. The space is useful for some, but anyone handling confidential calls may need a private room.” Does the author endorse the promoters’ whole claim?', steps: ['The universal claim is attributed to promoters.', 'The author acknowledges a benefit while identifying workers for whom the space may be unsuitable.'], answerMd: 'No. The author qualifies the universal claim, rather than denying that anyone benefits.' },
  ],
  traps: [
    { title: 'Choosing a subject instead of a purpose', md: 'An option may name the right institution but say nothing about the writer’s action. Add a verb and test whether the passage actually performs it.' },
    { title: 'Mistaking a qualification for rejection', md: 'A limitation can narrow a claim while preserving its core. Read the final position before labelling the passage hostile.' },
    { title: 'Letting the last detail dominate', md: 'The last sentence may be an example or practical note. A summary must account for the whole passage’s central relationship.' },
  ],
  check: [
    { id: 'check-1', title: 'Main purpose', topic: 'Verbal comprehension', stimulusMd: 'A town introduced online bookings for tennis courts. Recorded reservations rose, but the number of completed games did not. Some residents booked several possible times and cancelled late. The booking count therefore gave an incomplete picture of actual use.', stemMd: 'What is the passage’s main purpose?', options: [
      { id: 'A', text: 'To prove that online bookings always reduce sporting activity', note: 'The passage reports unchanged games in one town, not a universal decline.' },
      { id: 'B', text: 'To explain why more reservations did not demonstrate greater court use', note: '' },
      { id: 'C', text: 'To recommend closing the tennis courts', note: 'No closure recommendation appears in the passage.' },
      { id: 'D', text: 'To compare tennis with other sports', note: 'No other sport is discussed or compared.' },
      { id: 'E', text: 'To show that all recorded reservations were cancelled', note: 'Some late cancellations are described, not cancellation of every reservation.' },
    ], answer: 'B', workingMd: 'The passage contrasts increased reservations with unchanged completed games, then explains how multiple tentative bookings make reservations an incomplete usage measure.', lesson: 'Capture the contrast and its explanation in a main-purpose answer.' },
    { id: 'check-2', title: 'The role of a contrast', topic: 'Verbal comprehension', stimulusMd: 'The new museum labels contain fewer words. However, visitors now spend longer reading them, perhaps because the larger print is easier to follow.', stemMd: 'What is the role of the sentence beginning “However”?', options: [
      { id: 'A', text: 'It supplies a contrasting observation and a possible explanation.', note: '' },
      { id: 'B', text: 'It denies that the labels contain fewer words.', note: 'It accepts the word-count change and contrasts it with reading time.' },
      { id: 'C', text: 'It guarantees that larger print causes longer reading.', note: 'The word “perhaps” presents a possibility rather than a guarantee.' },
      { id: 'D', text: 'It recommends replacing all museum exhibits.', note: 'The sentence contains no recommendation about exhibits.' },
      { id: 'E', text: 'It defines what a museum label is.', note: 'It reports visitor behaviour and does not define the term.' },
    ], answer: 'A', workingMd: 'Longer reading time contrasts with the shorter text. The larger print is introduced as a possible explanation, explicitly qualified by “perhaps”.', lesson: 'Identify both the contrast and the strength of any explanation offered.' },
    { id: 'check-3', title: 'A qualified position', topic: 'Verbal comprehension', stimulusMd: 'Advocates say the delivery scheme will serve every village. Its first route reaches several isolated settlements, which is valuable. Yet villages beyond the river remain outside the route, so the scheme cannot currently fulfil the advocates’ entire promise.', stemMd: 'Which description best captures the author’s position?', options: [
      { id: 'A', text: 'Complete acceptance of the universal promise', note: 'The author explicitly identifies villages that remain outside the route.' },
      { id: 'B', text: 'A claim that the scheme has no value', note: 'The author calls service to isolated settlements valuable.' },
      { id: 'C', text: 'Uncertainty about whether any village receives deliveries', note: 'The passage states that several settlements are reached.' },
      { id: 'D', text: 'A recommendation to remove the river', note: 'No such proposal is made; the river marks a coverage boundary.' },
      { id: 'E', text: 'Recognition of a benefit alongside a limit on the promise', note: '' },
    ], answer: 'E', workingMd: 'The author accepts that the route brings value to several settlements but rejects the current universal scope of the advocates’ promise because some villages are not served.', lesson: 'Acknowledge both the accepted benefit and the stated reservation.' },
  ],
  takeaways: ['Describe purpose with an action as well as a subject.', 'Map paragraphs by role rather than by a list of details.', 'Keep reported views distinct from the author’s position.', 'A summary must cover the central relationship without expanding its scope.'],
  practice: { examKey: 'tolc-e', domain: 'tolce-verbal', skill: 'tolce-verbal-purpose' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
