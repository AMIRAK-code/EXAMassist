import { md, type Lesson } from '../../types';

export const readingShortScientificPassagesLesson: Lesson = {
  slug: 'reading-short-scientific-passages',
  title: 'Reading short scientific passages',
  summary: 'Read a short scientific text in English for its claim, its evidence and its qualifiers, and answer from the text rather than from what you already know.',
  minutes: 16,
  objectives: [
    'Find the main claim of a short scientific passage and the evidence that supports it.',
    'Read qualifiers such as "may", "some" and "is associated with" at their exact strength.',
    'Answer "according to the passage" questions from the text, and work out the meaning of a word from its context.',
  ],
  teachMd: md`
### What this part of the test asks

The first area of the IMAT is "Reading skills and knowledge acquired in studies". Its syllabus heading names comprehension of English texts alongside general knowledge, and the whole area has 4 of the 60 questions. Like everything on the test, the passages and questions are in English. A reading question is worth the same 1.5 points as a chemistry calculation, and it often takes less time, so a reliable method here is a good investment.

This lesson practises on short scientific passages, the kind of text a medical student reads every day: a paragraph on a physiological process, a description of a study, an explanation of a technique. You do not need to know the science in advance. You need to read precisely.

### Read for three things

Almost every short scientific passage is built from the same parts:

1. **The claim**: what the author says is true. It is often the first or the last sentence.
2. **The support**: the observation, data or mechanism offered as a reason for the claim.
3. **The limits**: the words that say how far the claim reaches, for whom and under what conditions.

As you read, ask of each sentence: is this the claim, a reason for it, or a limit on it? A passage you have sorted this way can be answered quickly, because most questions ask about one of the three.

### Qualifiers carry the meaning

Scientific writing is careful about how strong a statement is, and questions test whether you are equally careful. Compare:

| The passage says | You may conclude | You may not conclude |
| --- | --- | --- |
| A is associated with B | A and B tend to occur together | A causes B |
| X may reduce Y | X can sometimes reduce Y | X reduces Y |
| Some patients improved | At least one patient improved | Most patients improved |
| The effect was seen in mice | It held in the mice studied | It holds in humans |
| Usually, rarely, often | A tendency, with exceptions | Always, never |

A wrong option frequently copies the passage's words but drops or strengthens a qualifier. "Is associated with" becomes "causes"; "may" becomes "does"; "in mice" disappears. When an option sounds stronger than the passage, it is almost always wrong.

### Keep your own knowledge out

Medical candidates know a lot of biology, and that can hurt here. When the question says "according to the passage" or "the passage states", the answer must be supported by the text. An option that is true in the real world but not stated or implied in the passage is wrong for that question. The reverse also matters: if a passage describes an invented study, accept its results as given, even if they surprise you.

### Words in context

A question may ask what a word "most nearly means" as it is used in the passage. Many scientific words also have an everyday meaning, and the everyday meaning is the usual trap. "Conserved" in "this gene is highly conserved across vertebrates" does not mean saved or kept for later; it means that the sequence has stayed largely unchanged across species. To answer, cover the word, read the sentence, and decide what word you would put in its place. Then pick the option closest to your word, and test it by reading the sentence again with the option inserted.

### A method for each question

1. Read the question first, so you know whether you are looking for the claim, a detail, a limit or a word.
2. Read the passage once, sorting claim, support and limits.
3. Go back to the sentence the question is about and read it again carefully.
4. Before looking at the options, say in your own words what the answer should be.
5. Eliminate options that are **too strong** (a qualifier was removed), **reversed** (cause and effect swapped), **out of scope** (true perhaps, but not in the passage) or **contradicted** by the text.

If two options survive, the better one is usually the more cautious one that the text fully supports.

### Numbers in passages

Passages sometimes contain a figure: a percentage, a dose, a number of participants. Read exactly what the number refers to. "Blood pressure fell in 30% of the participants" is a statement about how many people responded, not about how much their pressure fell. If an option restates a number, check its unit and what it counts, not only the digits.
`,
  examples: [
    {
      id: 'example-claim-and-limits',
      title: 'Claim, support and limits',
      problemMd: md`*Passage:* "Red blood cells in mammals lose their nucleus as they mature. Without a nucleus, a mature red blood cell cannot divide, and it has more room for haemoglobin, the protein that carries oxygen. This is one reason why red blood cells must be continually replaced by new cells formed in the bone marrow."

According to the passage, why must red blood cells be continually replaced?`,
      steps: [
        md`Sort the sentences. Sentence 1 is a fact (mature mammalian red cells have no nucleus). Sentence 2 gives two consequences: they cannot divide, and they have more room for haemoglobin. Sentence 3 is the claim the question asks about.`,
        md`"This is one reason" points back to sentence 2. The relevant consequence is that mature red cells cannot divide, so they cannot make more of themselves.`,
        md`Note the limit: "one reason", not "the only reason". An answer should not claim that this is the whole explanation.`,
      ],
      answerMd: md`Because mature red blood cells have lost their nucleus, they cannot divide, so new ones must be produced in the bone marrow. A tempting wrong answer is "because they carry more haemoglobin": that is a consequence stated in the passage, but it is not the one linked to replacement.`,
    },
    {
      id: 'example-qualifier',
      title: 'Spotting a strengthened qualifier',
      problemMd: md`*Passage:* "In a group of volunteers who walked for 30 minutes a day, average fasting blood glucose was lower after 12 weeks than at the start. The researchers note that the volunteers may also have changed their diet during the study."

Which statement does the passage support: (i) "Daily walking lowered the volunteers' fasting blood glucose", or (ii) "Average fasting blood glucose in the group fell over the 12 weeks, though a change in diet may have contributed"?`,
      steps: [
        md`Find the claim: average fasting glucose was lower after 12 weeks. That is an observation about the group.`,
        md`Find the limit: the volunteers "may also have changed their diet". The authors themselves leave open another cause.`,
        md`Statement (i) turns the observation into a cause ("lowered") and drops the limit. Statement (ii) keeps both the observation and the limit.`,
      ],
      answerMd: md`Statement (ii). Statement (i) is the classic trap: it uses the passage's own words but makes a causal claim the passage deliberately avoids.`,
    },
  ],
  traps: [
    {
      title: 'The true-but-unstated option',
      md: md`An option may state a fact you learned at school and know to be true. If the question asks what the passage says and the passage does not say it, the option is wrong. Check every option against a sentence in the text.`,
    },
    {
      title: 'The dropped qualifier',
      md: md`"Some", "may", "in mice", "is associated with" are the words that wrong options remove. Before choosing, compare the strength of the option with the strength of the sentence it comes from.`,
    },
    {
      title: 'The everyday meaning of a technical word',
      md: md`Words such as "conserved", "affinity", "culture" or "resolution" have a scientific meaning that differs from the everyday one. Decide the meaning from the sentence, not from the dictionary entry you know best.`,
    },
  ],
  check: [
    {
      id: 'check-antibiotics-colds',
      title: 'Antibiotics and colds',
      topic: 'Reading comprehension',
      stimulusMd: md`Antibiotics kill bacteria or stop them from multiplying, but they have no effect on viruses. When a population of bacteria is exposed to an antibiotic, the few cells that happen to carry a resistance gene are more likely to survive and divide. Over many generations, the proportion of resistant cells in the population can rise. For this reason, taking antibiotics for a viral infection such as the common cold brings no benefit to the patient and may favour resistant bacteria.`,
      stemMd: md`According to the passage, why is taking antibiotics for the common cold unhelpful?`,
      options: [
        { id: 'A', text: md`The cold is caused by a virus, on which antibiotics have no effect, and the treatment may favour resistant bacteria.`, note: '' },
        { id: 'B', text: md`Antibiotics cause bacteria to develop resistance genes.`, note: md`The passage says the resistant cells "happen to carry" the gene; the antibiotic favours them, it does not create the gene. This reverses the mechanism.` },
        { id: 'C', text: md`Colds are caused by bacteria that are already resistant to antibiotics.`, note: md`The passage calls the cold a viral infection; this contradicts the text.` },
        { id: 'D', text: md`Antibiotics weaken the immune system's response to viruses.`, note: md`The passage says nothing about the immune system; this brings in outside ideas.` },
        { id: 'E', text: md`Resistant bacteria always outnumber the other bacteria in a population.`, note: md`The passage says the proportion of resistant cells "can rise"; "always outnumber" is far stronger than the text.` },
      ],
      answer: 'A',
      workingMd: md`The last sentence gives the answer and its reason: the cold is a viral infection, antibiotics have no effect on viruses, so there is no benefit, and the earlier sentences explain why the treatment "may favour resistant bacteria". The option that combines both, with the passage's own caution ("may"), is the answer.`,
      lesson: 'Check the mechanism in an option against the passage: selection of existing resistance is not creation of new resistance.',
    },
    {
      id: 'check-affinity',
      title: 'A word in context',
      topic: 'Reading comprehension',
      stimulusMd: md`Haemoglobin's affinity for oxygen is not fixed. In the lungs, where oxygen is plentiful, haemoglobin binds it readily. In active muscle, where the concentration of carbon dioxide is higher and the pH is lower, its affinity falls, and oxygen is released more easily to the tissue that needs it.`,
      stemMd: md`As used in the passage, "affinity" most nearly means`,
      options: [
        { id: 'A', text: md`liking or fondness`, note: md`This is the everyday sense of the word, used about people; a protein has no preferences.` },
        { id: 'B', text: md`similarity in structure`, note: md`"Affinity" can mean a resemblance between things, but the passage is about binding oxygen, not about resemblance.` },
        { id: 'C', text: md`the total amount carried`, note: md`The passage says the affinity falls in muscle so that oxygen is released; it describes how strongly oxygen is held, not a quantity.` },
        { id: 'D', text: md`speed of movement through the blood`, note: md`Nothing in the passage concerns how fast haemoglobin travels.` },
        { id: 'E', text: md`tendency to bind`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Replace the word with a blank: haemoglobin's ___ for oxygen falls, so oxygen is released more easily. The word must describe how readily haemoglobin binds and holds oxygen; "tendency to bind" fits, and reading the sentence again with it inserted keeps the meaning.`,
      lesson: 'Cover the word, decide what the sentence needs, then match an option to your own word.',
    },
    {
      id: 'check-resting-heart-rate',
      title: 'How strong is the claim?',
      topic: 'Reading comprehension',
      stimulusMd: md`Regular physical activity is associated with a lower resting heart rate in adults. In trained endurance athletes, the heart often pumps a larger volume of blood with each beat, so fewer beats per minute are needed at rest to supply the body.`,
      stemMd: md`Which statement is best supported by the passage?`,
      options: [
        { id: 'A', text: md`Every adult who exercises regularly has a lower resting heart rate than every adult who does not.`, note: md`The passage says the two are "associated"; that describes a tendency, not a rule for every individual.` },
        { id: 'B', text: md`A low resting heart rate makes people more likely to take up exercise.`, note: md`This reverses the direction the passage describes, from activity and training to heart rate.` },
        { id: 'C', text: md`In many trained endurance athletes, a larger volume pumped per beat allows a lower resting heart rate.`, note: '' },
        { id: 'D', text: md`Endurance training raises the maximum heart rate.`, note: md`The passage discusses the resting heart rate only; nothing is said about the maximum.` },
        { id: 'E', text: md`Physical activity has no effect on the resting heart rate.`, note: md`This contradicts the association the passage states in its first sentence.` },
      ],
      answer: 'C',
      workingMd: md`The second sentence gives the mechanism with its qualifier: the heart "often" pumps more per beat, "so fewer beats per minute are needed at rest". The option that keeps "many" (matching "often") and the same mechanism is fully supported. The others are too strong, reversed, out of scope or contradicted.`,
      lesson: 'The best-supported option keeps the passage’s qualifiers; the wrong ones strengthen, reverse or wander.',
    },
  ],
  takeaways: [
    'Sort each passage into claim, support and limits before reading the options.',
    'Wrong options often copy the text but drop or strengthen a qualifier.',
    '"According to the passage" means from the text, even when you know more.',
    'For a word in context, cover it, choose your own word, then match an option.',
  ],
  flashcards: [
    { front: 'The three parts of a short scientific passage', back: 'The claim, the support (data, observation or mechanism) and the limits (who, when, how far).' },
    { front: '"A is associated with B"', back: 'A and B tend to occur together. It does not say that A causes B.' },
    { front: 'An option that is true but not in the passage', back: 'Wrong for an "according to the passage" question: the answer must be supported by the text.' },
    { front: 'Four ways a wrong option fails', back: 'Too strong (a qualifier dropped), reversed (cause and effect swapped), out of scope, or contradicted by the text.' },
    { front: 'Method for a word in context', back: 'Cover the word, decide what the sentence needs, pick the closest option, and reread the sentence with it inserted.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-reading-knowledge', skill: 'imat-read-comprehension' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const inferenceAndAssumptionsInTextsLesson: Lesson = {
  slug: 'inference-and-assumptions-in-texts',
  title: 'Inference and assumptions in texts',
  summary: 'Tell what a text states, what must follow from it and what it silently assumes, and use the negation test to find the assumption an argument needs.',
  minutes: 18,
  objectives: [
    'Distinguish a statement, an inference that must be true, and a plausible guess.',
    'Find the unstated assumption an argument relies on, and check it with the negation test.',
    'Handle "all", "only", "most" and "some" correctly when drawing conclusions.',
  ],
  teachMd: md`
### Stated, inferred, assumed

Questions about a text ask about three different relationships, and confusing them is the commonest source of wrong answers.

- **Stated**: the text says it, perhaps in other words.
- **Inferred**: the text does not say it, but it must be true if everything in the text is true.
- **Assumed**: the text does not say it, but an argument in the text needs it in order to reach its conclusion.

An inference follows *from* the text. An assumption sits *underneath* an argument, filling the gap between its evidence and its conclusion.

### The "must be true" test

For an inference question ("Which of the following can be inferred?", "Which must be true?"), the standard is strict. The right option must hold in every situation consistent with the text. A plausible, likely or sensible conclusion is not enough.

Test each option by trying to imagine a situation where the text is true and the option is false. If you can, the option is not an inference. For example, "Every patient on the morning list had a blood test; Mr Rossi had no blood test this morning" lets you infer that Mr Rossi was not on the morning list. It does not let you infer that he was discharged, or that he refused the test: those may be true, but the text is equally true if they are false.

### Words that set the logic

Some words do most of the work in inference questions:

| Word | What it means | A common misreading |
| --- | --- | --- |
| all, every | no exceptions | reading it backwards ("all A are B" does not give "all B are A") |
| only | a necessary condition | treating it as sufficient ("open only when a doctor is present" does not mean "open whenever a doctor is present") |
| most | more than half | reading it as "almost all" |
| some | at least one | reading it as "some but not all" |
| none | no exceptions, in the negative | forgetting it also rules out the reverse ("no A is B" does give "no B is A") |

"Most" has a useful consequence. If more than half of a group has property P and more than half has property Q, the two halves cannot fit side by side without overlapping, so at least one member has both.

### Finding an assumption

An argument moves from evidence to a conclusion. To find its assumption, state the evidence and the conclusion in a few words each and look at the gap: what new idea appears in the conclusion that the evidence never mentioned? The assumption links the two.

Arguments in scientific texts often move from a correlation to a cause, or from one group to another. Typical assumptions are therefore:

- that nothing else explains the result (no other cause);
- that the cause did not run the other way;
- that the group studied is like the group the conclusion talks about;
- that a measure really captures what it claims to measure.

### The negation test

Once you have a candidate assumption, negate it, that is, state its opposite, and put the negation next to the argument. If the argument collapses, the statement was an assumption the argument needs. If the argument is untouched, the statement was not necessary, however reasonable it sounds.

Negate carefully. The negation of "all students drink coffee" is "at least one student does not", not "no student does". The negation of "the walking caused the fall" is "the walking did not cause the fall".

### Common wrong options

- **Too strong.** An assumption only has to be as strong as the argument needs. "Coffee is the only cause of poor sleep" is stronger than an argument about coffee needs.
- **Supports but is not needed.** An option may make the conclusion more likely without being required. The negation test separates the two.
- **Restates the conclusion or the evidence.** Something already written is not an unstated assumption.
- **Out of scope.** A true statement about a related topic.

### A method

1. Decide which relationship the question asks for: stated, inferred or assumed.
2. For an inference, apply the "must be true" test to each option.
3. For an assumption, name the evidence, the conclusion and the gap, then use the negation test on the options that address the gap.
`,
  examples: [
    {
      id: 'example-only-if',
      title: 'An inference from "only"',
      problemMd: md`*Text:* "The laboratory's freezer alarm sounds only when the temperature rises above −70 °C. On Saturday night the alarm did not sound."

Which follows: (i) "On Saturday night the temperature did not rise above −70 °C", or (ii) "Whenever the temperature rises above −70 °C, the alarm sounds"?`,
      steps: [
        md`"Only when" gives a necessary condition: if the alarm sounds, the temperature has risen above −70 °C.`,
        md`Statement (ii) turns this round into "if the temperature rises, the alarm sounds". The text does not say that; an alarm could fail to sound even after a rise. So (ii) is not an inference.`,
        md`Statement (i) also does not follow. The alarm not sounding is consistent with the temperature staying below −70 °C, and equally with a rise that the alarm missed. The text is true in both cases.`,
      ],
      answerMd: md`Neither follows. "Only when" says what must have happened if the alarm sounds; it says nothing about what happens when it does not. Choosing (i) is the tempting mistake, because it treats the alarm as a guaranteed signal.`,
    },
    {
      id: 'example-assumption-sanitiser',
      title: 'The assumption behind a before-and-after argument',
      problemMd: md`*Argument:* "Hand-sanitiser stations were installed at every ward entrance in March. Infections acquired in the hospital between March and June were fewer than in the same months last year. So the stations reduced infections."

What does the argument assume?`,
      steps: [
        md`Evidence: stations installed, and fewer infections afterwards than a year earlier. Conclusion: the stations caused the fall.`,
        md`The gap: the conclusion names a cause, while the evidence shows only that two things happened at the same time.`,
        md`Candidate assumption: no other change between the two periods, such as fewer patients or a new cleaning routine, explains the fall.`,
        md`Negation test: "another change explains the fall". If that were true, the stations might have done nothing, and the argument collapses. So the candidate is a real assumption.`,
      ],
      answerMd: md`The argument assumes that nothing else explains the drop in infections. A tempting but wrong choice would be "staff used the stations every time they entered a ward": that would strengthen the argument, but the conclusion could still hold if staff used them most of the time, so it is not required.`,
    },
    {
      id: 'example-most-and-most',
      title: 'Two "most" statements',
      problemMd: md`*Text:* "Most of the 30 students in the group passed the biology test. Most of them also passed the chemistry test." Must at least one student have passed both tests?`,
      steps: [
        md`"Most" means more than half. More than half of 30 is at least 16, so at least 16 passed biology and at least 16 passed chemistry.`,
        md`If no student passed both, the two groups would be separate, and together they would contain at least $16 + 16 = 32$ students. The group has only 30.`,
        md`So the groups must overlap by at least $32 - 30 = 2$ students.`,
      ],
      answerMd: md`Yes: at least two students passed both. What does not follow is that most of the biology passers also passed chemistry; the overlap could be as small as 2.`,
    },
  ],
  traps: [
    {
      title: 'Choosing the likely instead of the certain',
      md: md`Inference questions reward the option that must be true, not the one that is probably true. If you can imagine the text being true and the option false, reject the option, however sensible it sounds.`,
    },
    {
      title: 'Reading "only" as "whenever"',
      md: md`"A happens only if B" means B is needed for A. It does not mean B is enough for A. Rewrite "only if" sentences as "if A, then B" before you use them.`,
    },
    {
      title: 'Picking a strengthener as the assumption',
      md: md`Many options make an argument stronger without being necessary. Negate the option: if the argument survives the negation, the option was not an assumption.`,
    },
  ],
  check: [
    {
      id: 'check-clinic-days',
      title: 'When is the clinic open?',
      topic: 'Inference',
      stimulusMd: md`The clinic opens only on days when both a doctor and a nurse are present. Dr Bianchi is the clinic's only doctor, and she works there only on Tuesdays and Thursdays. A nurse is present every weekday.`,
      stemMd: md`If the statements above are true, which of the following must also be true?`,
      options: [
        { id: 'A', text: md`The clinic is open every Tuesday and Thursday.`, note: md`Having a doctor and a nurse present is required for opening, not a guarantee of it; "only on days when" gives a necessary condition.` },
        { id: 'B', text: md`The clinic is never open on a Monday.`, note: '' },
        { id: 'C', text: md`Nurses work only on days when the clinic is open.`, note: md`A nurse is present every weekday, including Mondays, when the clinic cannot open; this must be false.` },
        { id: 'D', text: md`The clinic is open on some Saturdays.`, note: md`Dr Bianchi, the only doctor, never works on Saturdays, so the clinic can never open then; this must be false.` },
        { id: 'E', text: md`Dr Bianchi is at the clinic every weekday.`, note: md`The text says she works there only on Tuesdays and Thursdays; this contradicts it.` },
      ],
      answer: 'B',
      workingMd: md`Opening requires a doctor. The only doctor works only on Tuesdays and Thursdays, so on a Monday no doctor is present and the clinic cannot open. This holds in every situation consistent with the text. Nothing guarantees that the clinic opens on the days when both are present.`,
      lesson: 'A necessary condition tells you when something cannot happen, never when it must.',
    },
    {
      id: 'check-evening-coffee',
      title: 'Coffee and sleep',
      topic: 'Assumption',
      stimulusMd: md`A survey at a university found that students who drink coffee in the evening sleep fewer hours, on average, than students who do not. Therefore, if the students who drink coffee in the evening stopped doing so, they would sleep longer.`,
      stemMd: md`The argument above depends on which of the following assumptions?`,
      options: [
        { id: 'A', text: md`All the students at the university drink coffee in the evening.`, note: md`The survey compares students who do and do not drink evening coffee, so the argument cannot need all of them to drink it.` },
        { id: 'B', text: md`Coffee is the most popular drink among the students.`, note: md`Popularity has no bearing on whether stopping would lengthen sleep; the negation leaves the argument intact.` },
        { id: 'C', text: md`Some students who drink coffee in the evening still sleep well.`, note: md`This is consistent with the survey but not needed; if it were false, the argument would be untouched or even stronger.` },
        { id: 'D', text: md`The shorter sleep is caused by the evening coffee, not by something that also leads students to drink it, such as studying late.`, note: '' },
        { id: 'E', text: md`Sleep matters for exam performance.`, note: md`This is outside the argument, which concludes only that the students would sleep longer, not that they would perform better.` },
      ],
      answer: 'D',
      workingMd: md`Evidence: evening coffee drinkers sleep less on average. Conclusion: stopping the coffee would lengthen their sleep. The gap is from a correlation to a cause. Negate the key option: "the shorter sleep is caused by something else, such as studying late, which also leads students to drink coffee". Then stopping the coffee would change nothing, and the argument collapses.`,
      lesson: 'When an argument moves from "goes with" to "causes", it assumes that nothing else explains the link.',
    },
    {
      id: 'check-volunteers-overlap',
      title: 'Overlapping majorities',
      topic: 'Inference',
      stimulusMd: md`More than half of the 40 volunteers in a study were vegetarians. More than half of the 40 volunteers exercised every day.`,
      stemMd: md`Which of the following must be true?`,
      options: [
        { id: 'A', text: md`At least one volunteer was a vegetarian who exercised every day.`, note: '' },
        { id: 'B', text: md`Most of the vegetarians in the study exercised every day.`, note: md`The overlap is guaranteed but may be as small as 2 volunteers out of 21 or more vegetarians, so "most" does not follow.` },
        { id: 'C', text: md`No volunteer was both a vegetarian and a daily exerciser.`, note: md`Two groups of at least 21 cannot fit into 40 people without overlapping; this must be false.` },
        { id: 'D', text: md`Exactly half of the daily exercisers were vegetarians.`, note: md`The text fixes no exact figure for the overlap; many different splits fit it.` },
        { id: 'E', text: md`Being a vegetarian makes people more likely to exercise every day.`, note: md`The text gives counts for one group, not a cause or a general tendency.` },
      ],
      answer: 'A',
      workingMd: md`More than half of 40 means at least 21. If the two groups did not overlap, they would contain at least $21 + 21 = 42$ people, more than the 40 volunteers. So at least $42 - 40 = 2$ volunteers belong to both groups, and in particular at least one does.`,
      lesson: 'Two "more than half" groups in the same set must share at least one member.',
    },
  ],
  takeaways: [
    'An inference must be true in every situation consistent with the text; "probably true" is not enough.',
    '"Only if" gives a necessary condition: it says when something cannot happen.',
    'An assumption fills the gap between evidence and conclusion; check it with the negation test.',
    'Two groups that each contain more than half of the same set must overlap.',
  ],
  flashcards: [
    { front: 'Inference', back: 'A statement that must be true if everything in the text is true. It must hold in every situation consistent with the text.' },
    { front: 'Assumption', back: 'An unstated idea that an argument needs to get from its evidence to its conclusion.' },
    { front: 'The negation test', back: 'State the opposite of a candidate assumption. If the argument then collapses, the statement was an assumption it needs.' },
    { front: '"A only if B"', back: 'B is necessary for A: if A happens, B holds. It does not say that B is enough for A.' },
    { front: '"Most" and "some"', back: '"Most" means more than half. "Some" means at least one, and does not rule out all.' },
    { front: 'Typical assumption in a cause argument', back: 'That nothing else explains the result, and that the cause does not run the other way.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-reading-knowledge', skill: 'imat-read-comprehension' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};

export const generalKnowledgeHistoryAndInstitutionsLesson: Lesson = {
  slug: 'general-knowledge-history-and-institutions',
  title: 'General knowledge: history, institutions and citizenship',
  summary: 'Prepare the general-knowledge part of the IMAT efficiently: a short timeline of anchor dates, the Italian Republic and EU institutions, and elimination by date.',
  minutes: 20,
  objectives: [
    'Place key events of modern Italian and European history in order using a short set of anchor dates.',
    'Name the main institutions of the Italian Republic and of the European Union and say what each does.',
    'Eliminate options by date, by function and by confusable names.',
  ],
  teachMd: md`
### What the syllabus asks for

The IMAT's first area is "Reading skills and knowledge acquired in studies". Its syllabus names history, institutions and citizenship alongside the comprehension of English texts, and our practice describes the knowledge part as the literary, historical, philosophical, social and institutional culture of secondary school. The area has 4 questions in total, and no separate count is given for general knowledge.

That combination, a wide syllabus and few questions, shapes how to study. You cannot learn all of history for a handful of marks, and you do not need to. The efficient approach is a small number of secure anchor facts, used for elimination. This lesson gives you those anchors for the three areas the syllabus names.

### A timeline of anchor dates

Learn a short list of dates well rather than a long list badly. These are enough to place most events of modern Italian and European history in order:

| Year | Event |
| --- | --- |
| 1789 | The French Revolution begins |
| 1861 | The Kingdom of Italy is proclaimed (17 March) |
| 1871 | Rome becomes the capital of Italy |
| 1914–1918 | The First World War (Italy enters in 1915) |
| 1939–1945 | The Second World War |
| 1945 | The United Nations is founded |
| 1946 | Referendum of 2 June: Italians choose the republic; women vote in a national vote for the first time |
| 1948 | The Constitution of the Italian Republic comes into force (1 January) |
| 1949 | The Council of Europe is founded |
| 1957 | The Treaties of Rome create the European Economic Community (EEC) and Euratom |
| 1979 | First direct elections to the European Parliament |
| 1989 | The Berlin Wall falls |
| 1992 | The Maastricht Treaty is signed; it creates the European Union when it comes into force in 1993 |
| 2002 | Euro banknotes and coins come into circulation |
| 2009 | The Lisbon Treaty comes into force |

With these in hand, many options can be eliminated as **anachronisms**: an option that places the EEC before the Italian Constitution, or the euro before Maastricht, is wrong without any further knowledge.

### The Italian Republic

The Constitution was approved by the Constituent Assembly in December 1947 and came into force on 1 January 1948. Article 1 states that Italy is a democratic Republic founded on labour, and that sovereignty belongs to the people.

- **Parliament** has two chambers, the Chamber of Deputies and the Senate of the Republic, with equal powers.
- **The President of the Republic** is the head of state. The President is elected by Parliament in joint session, joined by delegates of the regions, for a seven-year term.
- **The Government** is formed by the President of the Council of Ministers and the ministers, and must have the confidence of both chambers.
- **The Constitutional Court** judges whether laws conform to the Constitution.
- Citizens can also request an **abrogative referendum** to repeal a law, in whole or in part; the request needs 500,000 voters or five regional councils.

Do not confuse the President of the Republic (head of state) with the President of the Council of Ministers (head of government).

### The European Union

The EU has seven institutions. Learn them with their functions, because questions often hinge on who does what:

| Institution | What it does |
| --- | --- |
| European Parliament | Directly elected by EU citizens; adopts laws together with the Council of the EU |
| European Council | The heads of state or government; sets the EU's general political direction, but does not pass laws |
| Council of the European Union | Ministers of the member states; adopts laws together with the Parliament |
| European Commission | Proposes new laws and ensures the treaties are applied |
| Court of Justice of the European Union | Ensures EU law is interpreted and applied in the same way everywhere; sits in Luxembourg |
| European Central Bank | Runs monetary policy for the euro area; sits in Frankfurt |
| European Court of Auditors | Checks the EU's finances |

In the ordinary legislative procedure, the Commission makes the proposal, and the Parliament and the Council of the EU adopt it.

The **Council of Europe** is not an EU institution at all. It is a separate organisation, founded in 1949 and based in Strasbourg, responsible for the European Convention on Human Rights. The European Court of Human Rights belongs to it.

### Citizenship

The Constitution sets out rights and duties. Article 3 states that all citizens have equal social dignity and are equal before the law, without distinction of sex, race, language, religion, political opinion, or personal and social conditions. Article 48 describes the vote as personal, equal, free and secret, and its exercise as a civic duty.

Every citizen of an EU member state is also a citizen of the European Union. EU citizenship, introduced by the Maastricht Treaty, adds to national citizenship and does not replace it. It includes the right to move and reside freely within the EU, and the right to vote and stand as a candidate in European Parliament and municipal elections in the member state where one lives.

### How to answer

1. **Date the options.** Place each option on your timeline; anything out of order goes.
2. **Check the function.** Who proposes, who decides, who judges? Match the action to the institution.
3. **Watch the names.** European Council, Council of the EU and Council of Europe are three different bodies; President of the Republic and President of the Council of Ministers are two different offices.
`,
  examples: [
    {
      id: 'example-anachronism',
      title: 'Eliminating by date',
      problemMd: md`Is this statement true? "When the Constitution of the Italian Republic came into force, Italy was already a member of the European Economic Community."`,
      steps: [
        md`Date the first event: the Constitution came into force on 1 January 1948.`,
        md`Date the second: the EEC was created by the Treaties of Rome in 1957.`,
        md`1957 is after 1948, so the EEC did not yet exist when the Constitution came into force.`,
      ],
      answerMd: md`False. No detailed knowledge is needed: two anchor dates show the statement is an anachronism. The tempting error is to assume that the post-war republic and the European Community began together.`,
    },
    {
      id: 'example-who-proposes',
      title: 'Matching an action to an institution',
      problemMd: md`Under the ordinary legislative procedure, a new EU regulation is proposed, then adopted. Which institution proposes it, and which adopt it?`,
      steps: [
        md`The right to propose belongs to the European Commission.`,
        md`Adoption is shared by the two institutions that legislate together: the European Parliament and the Council of the European Union (the ministers).`,
        md`The European Council, made up of heads of state or government, sets political direction but does not pass laws, so it is not part of the answer.`,
      ],
      answerMd: md`The Commission proposes; the Parliament and the Council of the EU adopt. Naming the European Council as a legislator is the usual mistake, caused by the similar name.`,
    },
    {
      id: 'example-strasbourg-court',
      title: 'Which European court?',
      problemMd: md`A citizen brings a case claiming that a state has violated the European Convention on Human Rights. To which court, and to which organisation does it belong?`,
      steps: [
        md`The European Convention on Human Rights belongs to the Council of Europe, a separate organisation from the EU.`,
        md`Its court is the European Court of Human Rights, in Strasbourg.`,
        md`The Court of Justice of the EU, in Luxembourg, deals with EU law, so it is the wrong court here.`,
      ],
      answerMd: md`The European Court of Human Rights, part of the Council of Europe. Choosing the Court of Justice of the EU confuses two different organisations.`,
    },
  ],
  traps: [
    {
      title: 'Three councils with similar names',
      md: md`The European Council (heads of state or government), the Council of the European Union (ministers) and the Council of Europe (a separate organisation for human rights) are regularly confused. Learn one function for each and test options against it.`,
    },
    {
      title: '1946 or 1948?',
      md: md`The referendum that chose the republic was held on 2 June 1946; the Constitution came into force on 1 January 1948. An option that swaps the two dates, or treats them as one event, is easy to fall for.`,
    },
    {
      title: 'Two presidents',
      md: md`The President of the Republic is the head of state, elected by Parliament for seven years. The President of the Council of Ministers heads the Government, which needs the confidence of both chambers. Read which one the question names.`,
    },
  ],
  check: [
    {
      id: 'check-eu-initiative',
      title: 'Proposing EU laws',
      topic: 'Institutions',
      stemMd: md`Under the ordinary legislative procedure of the European Union, which institution proposes new legislation?`,
      options: [
        { id: 'A', text: md`The European Parliament`, note: md`The Parliament adopts legislation with the Council of the EU, but the proposal comes from elsewhere.` },
        { id: 'B', text: md`The Council of the European Union`, note: md`The Council of the EU adopts legislation with the Parliament; it does not make the proposal.` },
        { id: 'C', text: md`The European Commission`, note: '' },
        { id: 'D', text: md`The European Council`, note: md`The European Council sets general political direction and does not pass laws; its name is easily confused with the Council of the EU.` },
        { id: 'E', text: md`The Court of Justice of the European Union`, note: md`The Court interprets EU law and ensures it is applied the same way everywhere; it does not propose laws.` },
      ],
      answer: 'C',
      workingMd: md`In the ordinary legislative procedure the Commission proposes, and the European Parliament and the Council of the European Union adopt. The European Council and the Court have no part in proposing laws.`,
      lesson: 'Match the action to the institution: the Commission proposes, the Parliament and the Council of the EU adopt.',
    },
    {
      id: 'check-between-1945-1957',
      title: 'Between two dates',
      topic: 'History',
      stemMd: md`Which of these events took place after the end of the Second World War and before the signing of the Treaties of Rome?`,
      options: [
        { id: 'A', text: md`The Constitution of the Italian Republic came into force.`, note: '' },
        { id: 'B', text: md`The Kingdom of Italy was proclaimed.`, note: md`This happened in 1861, long before the Second World War.` },
        { id: 'C', text: md`The first direct elections to the European Parliament were held.`, note: md`These were held in 1979, more than twenty years after the Treaties of Rome.` },
        { id: 'D', text: md`The Maastricht Treaty was signed.`, note: md`It was signed in 1992, well after 1957.` },
        { id: 'E', text: md`Euro banknotes and coins came into circulation.`, note: md`This happened in 2002, after the Maastricht Treaty, not in the post-war years.` },
      ],
      answer: 'A',
      workingMd: md`The window runs from 1945 to 1957. Date each option: 1948 (the Constitution), 1861, 1979, 1992 and 2002. Only 1948 falls inside it.`,
      lesson: 'Put a date on every option first; anachronisms eliminate themselves.',
    },
    {
      id: 'check-president-election',
      title: 'Electing the head of state',
      topic: 'Institutions',
      stemMd: md`How is the President of the Italian Republic elected?`,
      options: [
        { id: 'A', text: md`Directly by the citizens, for a five-year term`, note: md`The President is not elected by the citizens, and the term is seven years, not five.` },
        { id: 'B', text: md`By Parliament in joint session, joined by delegates of the regions, for a seven-year term`, note: '' },
        { id: 'C', text: md`By the Senate of the Republic alone, for a seven-year term`, note: md`The term is right, but both chambers vote together, with regional delegates; the Senate does not elect alone.` },
        { id: 'D', text: md`By the Constitutional Court, for a nine-year term`, note: md`The Constitutional Court judges whether laws conform to the Constitution; it does not elect the head of state.` },
        { id: 'E', text: md`By the Council of Ministers, for the length of the Government`, note: md`The Council of Ministers is the Government; it needs Parliament's confidence and does not choose the head of state.` },
      ],
      answer: 'B',
      workingMd: md`The President of the Republic is elected by Parliament in joint session, with delegates of the regions, and serves seven years. The other options either name the wrong body or the wrong term.`,
      lesson: 'Head of state: President of the Republic, elected by Parliament with regional delegates for seven years.',
    },
  ],
  takeaways: [
    'Learn a short timeline of anchor dates and use it to eliminate anachronisms.',
    'The Constitution came into force on 1 January 1948, after the referendum of 2 June 1946.',
    'EU laws: the Commission proposes, the Parliament and the Council of the EU adopt.',
    'The Council of Europe and its Court of Human Rights are not part of the EU.',
  ],
  flashcards: [
    { front: 'Italian Constitution in force', back: '1 January 1948. It was approved by the Constituent Assembly in December 1947.' },
    { front: 'Referendum of 2 June 1946', back: 'Italians chose the republic over the monarchy; women voted in a national vote for the first time.' },
    { front: 'President of the Italian Republic', back: 'Head of state, elected by Parliament in joint session with delegates of the regions, for a seven-year term.' },
    { front: 'Who proposes and who adopts EU laws?', back: 'The European Commission proposes; the European Parliament and the Council of the EU adopt.' },
    { front: 'European Council', back: 'The heads of state or government of the member states. It sets the EU’s general political direction but does not pass laws.' },
    { front: 'Council of Europe', back: 'A separate organisation from the EU, founded in 1949 and based in Strasbourg; the European Court of Human Rights belongs to it.' },
  ],
  practice: { examKey: 'imat', domain: 'imat-reading-knowledge', skill: 'imat-read-general-knowledge' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-16', expertReview: null },
};
