import { md, type Lesson } from '../../types';

const railPassage = md`
Last year the regional rail operator Linea Nord changed the way it measures punctuality. Under the old rule, a train counted as on time if it arrived within five minutes of its scheduled time; under the new rule, it must arrive within three minutes. By the new rule, 82% of the operator's trains were on time last year. The operator's annual report adds that, had the old rule still applied, the figure would have been 91%, higher than in any earlier year. Passenger complaints about delays nevertheless rose by a fifth over the same period, although most of the increase came from a single line on which track works forced repeated cancellations.
`;

export const detailAndInferenceQuestionsLesson: Lesson = {
  slug: 'detail-and-inference-questions',
  title: 'Detail and inference questions',
  summary: 'Find what a passage states by meaning, not by matching words, and infer only what must be true when the passage is true.',
  minutes: 18,
  objectives: [
    'Answer detail questions by locating the sentence and matching its meaning, not its words.',
    'Accept an inference only if it must be true whenever the passage is true, using a counterexample test.',
    'Recognise the usual wrong options: too strong, out of scope, reversed, and possible but not required.',
  ],
  teachMd: md`
### Two families of question

Most reading questions that are not about structure or main idea fall into two families.

- **Detail questions** ask what the passage says: "According to the passage…", "The passage states that…", "Which of the following is mentioned as…".
- **Inference questions** ask what follows from what it says: "It can be inferred that…", "The passage suggests…", "Which statement is most strongly supported by the passage?", "Which must be true?".

They need different habits. A detail question rewards accurate locating; an inference question rewards discipline about how far to go.

### Detail questions: locate, then paraphrase

1. Pick a precise anchor from the question: a name, a number, a date, a distinctive word.
2. Find it in the passage and read the sentence it sits in, plus the one before and the one after; qualifiers such as "although" or "most" often sit next door.
3. Say the answer in your own words, then look for the option that means the same.

The right option is usually **reworded**. The classic trap repeats the passage's words but attaches them to the wrong thing: a figure from one sentence answering a question about another, or a phrase lifted from a nearby clause. Matching meaning protects you; matching words does not.

### Inference questions: what must be true

On these questions, treat the passage as true and ask what else is then **guaranteed**. Bocconi tells candidates to assume the passage is true for its critical reasoning items, and the same discipline works for inference questions on any passage. An inference here is a short, safe step, not a creative leap. If the passage says sales rose 8% while the number of shops rose 12%, it follows that average sales per shop fell; it does not follow that the new shops are to blame.

The most useful tool is the **counterexample test**: can you imagine a world in which everything in the passage is true and the option is false? If you can, the option is not a valid inference, however reasonable it sounds. If you cannot, because the option is just the passage's information recombined, it is the answer.

"Most strongly supported" is slightly looser than "must be true": it asks for the option with the best support, and on a well-made question that option will still need no outside assumptions. Treat both the same way in practice.

### The usual wrong options

| Family | What it does | Example of the signal |
| --- | --- | --- |
| Too strong | Turns "most" into "all", "may" into "will", "some" into "every" | all, always, only, never, proves |
| Out of scope | Talks about something the passage does not address | a new group, a new time, a motive |
| Reversed | Swaps cause and effect, or the direction of a comparison | "A caused B" when the passage says B came first |
| Possible, not required | Could be true, but the passage does not force it | "probably", a plausible explanation |
| Outside knowledge | True in the world, but not in the passage | facts you know but were not given |

Most wrong inference options are of the "possible, not required" kind. They are dangerous because they are reasonable: a sensible person might well believe them. The question is not whether the option is reasonable, but whether the passage guarantees it.

### Numbers inside passages

Inference questions on passages with figures often turn on what the figures do and do not measure. Totals and averages can move in opposite directions; a share can rise while the amount falls; a change in how something is measured changes the figure without changing the thing. Before you accept an option about a figure, ask what exactly the figure counts and on what basis.

### Pace (our suggestion)

Detail questions should be quick once you have a passage map: locate, read three sentences, choose. Spend the saved time on inference questions, where the counterexample test needs a few seconds per option. Because you cannot come back to a screen, run the test on every option before you commit, rather than choosing the first one that sounds right.
`,
  examples: [
    {
      id: 'example-detail-meaning',
      title: 'Matching meaning, not words',
      problemMd: md`"Although the library extended its opening hours in March, the number of daily visitors did not rise until September, when the nearby university began its autumn term."

According to the sentence, when did the number of daily visitors rise?`,
      steps: [
        md`Anchor: "rise" and "daily visitors". The sentence gives two dates, March and September; read both clauses.`,
        md`March is attached to the extension of opening hours, and "although" tells you the extension did not produce the rise.`,
        md`The rise is attached to September, "when the nearby university began its autumn term".`,
      ],
      answerMd: md`Visitor numbers rose in September, when the university term began. The tempting wrong answer is "in March, when opening hours were extended": it takes the first date and the first event, and "although" says the opposite.`,
    },
    {
      id: 'example-inference-averages',
      title: 'A safe inference from two growth rates',
      problemMd: md`"Last year a café chain's total revenue grew by 8%, while the number of its cafés grew by 12%."

Which can be inferred? (i) Average revenue per café fell. (ii) Every café earned less than the year before. (iii) The new cafés performed worse than the old ones.`,
      steps: [
        md`Average revenue per café is total revenue divided by the number of cafés. Its multiplier is $\frac{1.08}{1.12} \approx 0.964$, so the average fell by about 3.6%. Check with numbers: 100 cafés earning 1,000 in total (10 each) become 112 cafés earning 1,080, which is about 9.64 each. (i) must be true.`,
        md`Counterexample for (ii): the old cafés could all have earned more while the new ones, open for part of the year, earned little. An average can fall while some members rise.`,
        md`Counterexample for (iii): the old cafés could have lost revenue while the new ones did as well as the old ones used to. (iii) is one possible explanation, not a requirement.`,
      ],
      answerMd: md`Only (i) follows. (iii) is the tempting option because it is a sensible explanation, but nothing in the sentence forces it.`,
    },
    {
      id: 'example-too-strong',
      title: 'Eliminating the too-strong option',
      problemMd: md`"In a survey of households that had switched energy supplier, most said price was their main reason for switching; a smaller group named customer service."

Which is supported? (i) All the switchers were motivated by price. (ii) Price was the main reason given most often by the switchers surveyed. (iii) Customer service matters little to consumers. (iv) Switchers paid less after switching.`,
      steps: [
        md`(i) turns "most" into "all": too strong. Some switchers named customer service.`,
        md`(iii) moves from "a smaller group named it" to a claim about all consumers and how much it matters: too strong and out of scope.`,
        md`(iv) is about what happened after switching, which the survey does not report: out of scope.`,
        md`(ii) restates "most said price" in different words. "Most" means more than half, so no other reason can have been given more often.`,
      ],
      answerMd: md`Only (ii) is supported. The passage's "most" licenses "more often than any other reason", but not "all".`,
    },
  ],
  traps: [
    {
      title: 'The word-match option',
      md: md`An option that repeats the passage's exact words feels safe. On detail questions the trap often reuses a phrase from the wrong sentence or the wrong clause. Locate the sentence that answers the question, then match its meaning.`,
    },
    {
      title: 'The reasonable explanation',
      md: md`Options that explain why something happened ("because the new cafés performed badly") are attractive because they are plausible. Unless the passage gives the cause, run the counterexample test: if another cause is possible, the option is not an inference.`,
    },
    {
      title: 'Quantifier creep',
      md: md`"Most" becomes "all", "some" becomes "many", "may" becomes "will". Circle the quantifier in the passage and in the option; if the option's is stronger, eliminate it.`,
    },
    {
      title: 'Bringing in what you know',
      md: md`An option can be true in the real world and still be wrong, because the question asks what the passage supports. Use only the passage's information, as the instruction to treat the passage as true implies.`,
    },
  ],
  check: [
    {
      id: 'check-rail-detail',
      title: 'What is the 91% figure?',
      topic: 'Reading comprehension',
      stimulusMd: railPassage,
      stemMd: md`According to the passage, the 91% figure is`,
      options: [
        { id: 'A', text: md`the share of last year's trains that were on time under the three-minute rule`, note: md`That share is 82%; the 91% belongs to the old five-minute rule.` },
        { id: 'B', text: md`an estimate of last year's punctuality had the five-minute rule still applied`, note: '' },
        { id: 'C', text: md`the highest punctuality ever achieved under the three-minute rule`, note: md`The 91% is calculated with the old five-minute rule; it is "higher than in any earlier year", which says nothing about the new rule's record.` },
        { id: 'D', text: md`the share of passenger complaints that were not about delays`, note: md`This joins two unrelated parts of the passage; the complaints are described only as rising by a fifth.` },
      ],
      answer: 'B',
      workingMd: md`The anchor "91%" sits in the sentence "had the old rule still applied, the figure would have been 91%". The old rule is the five-minute rule, and "would have been" marks it as a calculation of what last year's figure would have been, not a measured result under the rule in force.`,
      lesson: 'Read the clause attached to a figure: it tells you what the figure measures.',
    },
    {
      id: 'check-rail-inference',
      title: 'What must be true?',
      topic: 'Reading comprehension',
      stimulusMd: railPassage,
      stemMd: md`If the statements in the passage are true, which of the following must also be true?`,
      options: [
        { id: 'A', text: md`Some of last year's trains that counted as late under the new rule would have counted as on time under the old rule.`, note: '' },
        { id: 'B', text: md`Linea Nord's trains were less punctual last year than the year before.`, note: md`The passage points the other way: on the old rule, last year's 91% was higher than in any earlier year.` },
        { id: 'C', text: md`Track works caused most of last year's late arrivals.`, note: md`The passage says most of the rise in complaints came from one line with track works, not that track works caused most late arrivals.` },
        { id: 'D', text: md`Complaints rose because the operator adopted a stricter rule.`, note: md`A change in how punctuality is measured does not change when trains arrive; the passage gives no such cause, so this is possible at most.` },
      ],
      answer: 'A',
      workingMd: md`Under the old rule 91% of trains would have been on time; under the new rule 82% were. Every train within three minutes is also within five, so the 9 percentage points of difference are trains that arrived more than three but no more than five minutes from schedule: late under the new rule, on time under the old one. No counterexample is possible once the two figures are accepted.`,
      lesson: 'An inference recombines the passage’s own information; it needs no outside cause or motive.',
    },
    {
      id: 'check-rail-supported',
      title: 'Most strongly supported',
      topic: 'Reading comprehension',
      stimulusMd: railPassage,
      stemMd: md`Which of the following is most strongly supported by the passage?`,
      options: [
        { id: 'A', text: md`The operator changed the rule in order to hide poor performance.`, note: md`The passage gives no motive, and a stricter rule makes the punctuality figure lower, not better-looking.` },
        { id: 'B', text: md`Passengers on every line complained more about delays last year.`, note: md`Too strong: most of the rise came from one line, so complaints on some other lines may have stayed level or fallen.` },
        { id: 'C', text: md`Last year's 82% cannot be compared directly with the operator's figures for earlier years.`, note: '' },
        { id: 'D', text: md`Cancelled trains are left out of the punctuality figures.`, note: md`The passage never says how cancelled trains are counted; this is an assumption from outside the passage.` },
      ],
      answer: 'C',
      workingMd: md`The rule changed last year, so earlier years' figures were measured with the five-minute rule and last year's 82% with the three-minute rule. A like-for-like comparison needs the same rule, which is why the report adds the 91% figure. None of the other options can be checked against the passage.`,
      lesson: 'When the way a figure is measured changes, the figure can no longer be compared directly with the old series.',
    },
  ],
  takeaways: [
    'Detail: anchor, read the sentence and its neighbours, and match meaning rather than words.',
    'Inference: treat the passage as true and accept only what must then be true.',
    'Run the counterexample test on every option before you press Next.',
    'Most wrong options are too strong, out of scope, reversed, or possible but not required.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-verbal-reasoning', skill: 'grad-verbal-passage-reasoning' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
