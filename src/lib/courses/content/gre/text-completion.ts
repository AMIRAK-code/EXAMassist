import { md, type Lesson, type Unit } from '../../types';

/**
 * GRE unit 2: Text Completion. Format facts (one to five sentences, one to
 * three blanks, five choices for one blank and three per blank otherwise, no
 * partial credit) come from docs/research/course-facts-2026-11-04.md (E2).
 * Every sentence below is original.
 */

const readingForClues: Lesson = {
  slug: 'text-completion-reading-for-clues',
  title: 'Text Completion: reading for the clue',
  summary: 'Find the words in the sentence that decide the blank, predict your own answer before you look, and only then match it to a choice.',
  minutes: 18,
  objectives: [
    'Identify what a blank describes and which words in the sentence give evidence about it.',
    'Recognise the four common kinds of clue: restatement, contrast, cause and effect, and example.',
    'Predict a word for the blank before reading the choices, and check the finished sentence.',
  ],
  teachMd: md`
### What a Text Completion asks

A Text Completion gives you a passage of one to five sentences with one, two or three blanks. With one blank you choose from five words or phrases; with two or three blanks each blank has its own column of three. There is no partial credit: every blank must be right.

The question is not "which word is the most sophisticated" or "which word do I like here". It is narrower: which choice does **the passage itself** require? Every sentence is written so that some of its words force the meaning of the blank. Those words are the clue. Your first job is to find them.

### Two questions before you look at the choices

Cover the choices and ask:

1. **What is the blank about?** Name the thing the missing word describes: a person's manner, the state of the soil, the reaction of critics.
2. **What else in the passage tells me about that thing?** Look for a phrase that describes the same thing in other words, explains its cause or result, gives an example of it, or sets it against something.

If you cannot answer the second question, you have not finished reading. The clue is often in a different clause, after a colon, or in the following sentence.

### Four kinds of clue

| Kind | What it looks like | What it tells you |
| --- | --- | --- |
| Restatement | a colon, a semicolon, "that is", an appositive phrase | the blank means roughly what the clue says |
| Contrast | "although", "but", "far from", "rather than" | the blank means roughly the opposite of the clue |
| Cause and effect | "because", "so ... that", "as a result" | the blank is what produces, or follows from, the clue |
| Example | a list of actions or details | the blank names the quality the examples share |

Restatement is the most generous kind of clue: if the sentence says "she labelled every folder and cross-checked each date", the blank describing her is something like *careful*. The next lesson deals with signal words in detail; here the point is that you can usually name the direction of the blank before you see a single choice.

### Predict in plain words

Once you have the clue, write or think a prediction in your own, simple words: "careful", "fast", "long", "drains water easily". It does not need to be elegant, and it often should not be a single word. A rough prediction does two things. It protects you from choices designed to sound right, and it saves time, because you can reject most choices in a second each.

Then compare each choice with your prediction, not with the sentence. A choice that means roughly what you predicted stays; one that does not goes. If two choices survive, go back to the clue and make the prediction sharper. If none survives, your prediction is probably reversed: check whether you missed a "not" or a contrast word.

### Why the wrong choices tempt you

Wrong choices on a well-built item are not random. They usually belong to one of these families:

- **Topic words.** A word that belongs to the subject of the sentence but does not fit its logic. In a sentence about a bridge that expands in heat, *corrosion* is a bridge word, but heat does not cause it.
- **Reversals.** The opposite of the answer, waiting for anyone who missed a contrast.
- **Plausible but unsupported.** A word that could be true of the subject in real life, but that nothing in the sentence supports.
- **Right tone, wrong meaning.** A word with the same positive or negative charge as the answer but a different sense.

Knowing these families makes elimination faster: you can say why each wrong choice is wrong, not only that it "feels off".

### Finish by rereading

Put your choice into the blank and read the whole passage once more. It should read as something a careful writer would publish, with the clue and the blank agreeing. This takes a few seconds and catches most slips, especially reversals.
`,
  examples: [
    {
      id: 'example-archivist',
      title: 'A restatement clue',
      problemMd: md`The new archivist proved remarkably \_\_\_\_\_\_: she labelled every folder, cross-checked each date against two sources, and never left a box unreturned.

Choices: gregarious, meticulous, impetuous, indolent, eloquent`,
      steps: [
        md`Name the target: the blank describes the archivist's character at work.`,
        md`Find the clue: the colon introduces three examples, all of careful, thorough work. This is a restatement clue.`,
        md`Predict: "very careful about details".`,
        md`Compare: *meticulous* means showing great attention to detail. *Gregarious* (sociable) and *eloquent* (fluent in speech) are unsupported; *impetuous* (rash) and *indolent* (lazy) point the other way.`,
      ],
      answerMd: md`*Meticulous*. *Eloquent* is the tempting wrong answer for anyone who picks a generally positive word without checking it against the evidence.`,
    },
    {
      id: 'example-bridge',
      title: 'A cause-and-effect clue',
      problemMd: md`Because the bridge's designers had underestimated how much the steel would expand in summer heat, the joints soon showed signs of \_\_\_\_\_\_.

Choices: neglect, corrosion, stress, ornamentation, symmetry`,
      steps: [
        md`Target: what the joints showed signs of.`,
        md`Clue: "Because" gives the cause. Steel expanding more than planned pushes against the joints.`,
        md`Predict: "strain from being pushed".`,
        md`Compare: *stress* matches. *Corrosion* is a bridge word, but it comes from moisture and chemistry, not from heat expansion. *Neglect* is not supported: nothing says anyone failed to maintain the bridge. *Ornamentation* and *symmetry* have no link to the cause.`,
      ],
      answerMd: md`*Stress*. *Corrosion* is the tempting topic word: it belongs to bridges, but the sentence's cause does not produce it.`,
    },
    {
      id: 'example-botanist',
      title: 'A clue in the outcome',
      problemMd: md`Few of the botanist's colleagues shared her \_\_\_\_\_\_ about the remote valley: years before the survey, she predicted that it would hold at least a dozen undescribed species, and the survey found fourteen.

Choices: indifference, nostalgia, scepticism, confidence, embarrassment`,
      steps: [
        md`Target: the botanist's attitude about the valley.`,
        md`Clue: after the colon, she made a bold, specific prediction, and it came true.`,
        md`Predict: "strong belief that the valley was rich".`,
        md`Compare: *confidence* fits. *Scepticism* is the attitude of the colleagues who did not share her view, not hers. *Indifference*, *nostalgia* and *embarrassment* do not match someone making a bold prediction.`,
      ],
      answerMd: md`*Confidence*. *Scepticism* tempts because it is the right word for the wrong people in the sentence.`,
    },
  ],
  traps: [
    {
      title: 'Choosing before predicting',
      md: md`If you read the choices first, a well-built distractor can make the sentence seem to mean something it does not. Cover the choices, find the clue, and say a rough answer to yourself first. It takes five seconds and protects the next sixty.`,
    },
    {
      title: 'The topic word',
      md: md`A choice that belongs to the subject (corrosion for a bridge, harvest for a farm) feels right because it is about the same thing. Ask whether the sentence's logic produces it, not whether it belongs to the subject.`,
    },
    {
      title: 'Bringing in outside knowledge',
      md: md`A choice may be true of the subject in real life. That does not matter. If nothing in the passage supports it, it is wrong. The test rewards reading the sentence, not knowing about soils or bridges.`,
    },
    {
      title: 'Stopping at the first clause',
      md: md`The clue is often after a colon or in the next sentence. If the first clause seems to allow several answers, keep reading: the rest of the passage is usually there to narrow it to one.`,
    },
  ],
  check: [
    {
      id: 'check-committee-report',
      title: 'The short report',
      topic: 'Text Completion',
      stemMd: md`Far from being \_\_\_\_\_\_, the committee's final report ran to only nine pages and could be read in a single sitting.`,
      options: [
        { id: 'A', text: md`concise`, note: md`This describes what the report actually was. "Far from being" needs the opposite of short.` },
        { id: 'B', text: md`rigorous`, note: md`Rigour is about care in reasoning, not length; nothing in the sentence speaks to it.` },
        { id: 'C', text: md`controversial`, note: md`Nothing in the sentence concerns disagreement; the clue is entirely about length.` },
        { id: 'D', text: md`prolix`, note: '' },
        { id: 'E', text: md`belated`, note: md`This is about timing; the clue (nine pages, one sitting) is about length.` },
      ],
      answer: 'D',
      workingMd: md`The blank describes the report. The clue is that it was nine pages and quick to read, and "far from being" sets the blank against that: the blank must mean "long and wordy". *Prolix* means using too many words, tediously long.`,
      lesson: 'Name what the blank describes and find the words that describe the same thing; the blank must agree with them, or oppose them if a contrast says so.',
    },
    {
      id: 'check-mayor-response',
      title: 'The mayor and the flood',
      topic: 'Text Completion',
      stemMd: md`The mayor's response to the flooding was strikingly \_\_\_\_\_\_; within an hour of the first warnings she had opened shelters, closed the riverside roads and called in volunteers.`,
      options: [
        { id: 'A', text: md`tentative`, note: md`Tentative means hesitant and uncommitted; opening shelters, closing roads and calling in volunteers within an hour is decisive action.` },
        { id: 'B', text: md`expeditious`, note: '' },
        { id: 'C', text: md`lackadaisical`, note: md`This means lazy and lacking energy, the reverse of what the actions after the semicolon show.` },
        { id: 'D', text: md`ostentatious`, note: md`This means showy; nothing suggests she acted to be seen.` },
        { id: 'E', text: md`conciliatory`, note: md`This means trying to calm a dispute; there is no dispute in the sentence.` },
      ],
      answer: 'B',
      workingMd: md`The semicolon introduces a restatement: three actions within an hour of the warnings. The prediction is "fast and efficient". *Expeditious* means done with speed and efficiency.`,
      lesson: 'After a colon or semicolon, the next clause usually restates the blank; predict from it.',
    },
    {
      id: 'check-valley-soil',
      title: 'Soil that needs water',
      topic: 'Text Completion',
      stemMd: md`The soil in the valley is so \_\_\_\_\_\_ that farmers there must irrigate even in years of average rainfall, while farms on the clay slopes nearby rarely need to.`,
      options: [
        { id: 'A', text: md`fertile`, note: md`Fertility is about nutrients, not water; it would not explain the need to irrigate.` },
        { id: 'B', text: md`saturated`, note: md`Saturated soil is already full of water, the opposite of soil that needs irrigation.` },
        { id: 'C', text: md`acidic`, note: md`Acidity is real soil chemistry, but nothing in the sentence links it to water; this is outside knowledge, not the clue.` },
        { id: 'D', text: md`porous`, note: '' },
        { id: 'E', text: md`fallow`, note: md`Fallow describes land left unplanted, which says nothing about why farmed land needs water.` },
      ],
      answer: 'D',
      workingMd: md`"So ... that" is cause and effect: the blank names a property that makes farmers irrigate despite normal rain. The contrast with clay, which holds water, sharpens it: the valley soil lets water through. *Porous* means full of small holes that let water pass.`,
      lesson: 'In a "so ... that" sentence, the blank is the cause of the stated effect; predict the cause before looking.',
    },
  ],
  takeaways: [
    'Before reading the choices, name what the blank describes and find the clue.',
    'Clues restate, contrast, explain a cause or effect, or give examples.',
    'Predict in plain words, then compare choices with the prediction.',
    'Reread the finished passage; a reversed or unsupported word shows up at once.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-text-completion', skill: 'tc-reason-from-partial-information' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const signalWords: Lesson = {
  slug: 'text-completion-signal-words',
  title: 'Text Completion: signal words that set the direction',
  summary: 'Use contrast, continuation, cause and time words to know whether the blank agrees with its clue or opposes it, and handle double reversals.',
  minutes: 18,
  objectives: [
    'Sort common signal words into contrast, continuation, cause and effect, and time contrast.',
    'Decide from a signal word whether the blank agrees with or opposes its clue.',
    'Handle sentences that combine a contrast word with a negative.',
  ],
  teachMd: md`
### Signals tell you the direction

The clue in a Text Completion tells you what the blank is about. A signal word tells you which way to go from the clue: towards it or away from it. "She was usually talkative, and at dinner she was \_\_\_\_\_\_" and "She was usually talkative, but at dinner she was \_\_\_\_\_\_" have the same clue and opposite answers. Reading signal words carefully is the cheapest skill in the Verbal measure: it costs no vocabulary and often decides the answer on its own.

### The main families

| Family | Common signals | Effect on the blank |
| --- | --- | --- |
| Contrast | although, though, but, yet, however, despite, while, whereas, far from, rather than, instead of, nevertheless | opposite of the clue |
| Continuation | and, moreover, indeed, in fact, similarly, likewise, not only ... but also, a colon or semicolon | same as the clue |
| Cause and effect | because, since, so, therefore, thus, consequently, so ... that, as a result | the blank causes, or follows from, the clue |
| Time contrast | once, formerly, until recently, at first ... later, now | the earlier state differs from the later one |
| Surprise | surprisingly, ironically, paradoxically, unexpectedly | the blank goes against what you would expect |

The surprise family deserves attention. "Ironically, the novelist whose books celebrate conversation was, in person, almost painfully \_\_\_\_\_\_" tells you the blank is the opposite of what the books would suggest: someone who barely speaks.

### Where to look

Signals do not always sit next to the blank. "Although" at the start of a sentence governs the relationship between its two clauses, wherever the blank is. A colon in the middle of a sentence turns everything after it into an explanation of what came before. Mark the signal, then ask which two parts of the passage it connects; the blank is in one part and the clue is in the other.

### Negatives count as reversals

A "not", "hardly", "never", "far from" or "anything but" reverses meaning just as "although" does. When a sentence has two reversals, they can cancel. Take: "Although the drug's side effects were not \_\_\_\_\_\_, regulators approved it." Work it in two steps:

1. "Although" says the first clause gives a reason against approval.
2. So "the side effects were not \_\_\_\_\_\_" must describe side effects that argue against approval: serious ones. The words that do that after "not" are words meaning small or harmless: *not negligible*, *not trivial*.

The quick way to handle a double reversal is to rewrite the clause without the negative ("the side effects were serious") and then put the negative back on the blank ("not negligible").

### "Not only ... but also" is not a contrast

"But" here adds rather than opposes: "not only cheap but also durable" lists two good things. Read the whole construction, not the single word.

### Some signals are implied

Sometimes no signal word is printed and the contrast comes from the facts. "The critics expected a disaster. The film earned more than any other that year." The second sentence surprises the first without a "but". Ask: does the rest of the passage confirm or overturn the clue? The answer gives you the direction.

### A routine that works

1. Find the clue for the blank.
2. Find the signal that links the clue to the blank, including any negatives.
3. Decide: same direction or opposite?
4. Predict, then match.

With practice the first three steps take a few seconds. They also explain most wrong answers you make: when you review a missed Text Completion, the first thing to check is whether you read the signal the wrong way.
`,
  examples: [
    {
      id: 'example-critic-reviews',
      title: 'A contrast with "although"',
      problemMd: md`Although the critic's earlier reviews had been notably \_\_\_\_\_\_, her assessment of the new opera was full of qualified praise and careful hedging.

Choices: circumspect, measured, categorical, ambivalent, verbose`,
      steps: [
        md`Clue: the new assessment was hedged and qualified, that is, cautious and not committed.`,
        md`Signal: "Although" sets the earlier reviews against the new one, so the blank is the opposite of hedged.`,
        md`Predict: "firm, with no hedging".`,
        md`Compare: *categorical* means unqualified and absolute. *Circumspect*, *measured* and *ambivalent* all describe caution or mixed feelings, the same direction as the clue. *Verbose* is about length, not commitment.`,
      ],
      answerMd: md`*Categorical*. The three cautious words are the trap for anyone who matched the clue without applying "although".`,
    },
    {
      id: 'example-fungus',
      title: 'A time contrast',
      problemMd: md`Once dismissed as a \_\_\_\_\_\_ curiosity, the fungus is now studied in laboratories on three continents for the antibiotics it produces.

Choices: celebrated, lethal, trivial, ubiquitous, durable`,
      steps: [
        md`Signal: "Once ... now" contrasts an earlier view with the present one.`,
        md`Clue: now it is studied widely for something valuable. "Dismissed as" adds that the earlier view was low.`,
        md`Predict: "unimportant".`,
        md`Compare: *trivial* fits. *Celebrated* is the reverse. *Lethal* and *ubiquitous* (found everywhere) are not things one would be "dismissed as" and nothing supports them. *Durable* is unsupported.`,
      ],
      answerMd: md`*Trivial*. *Celebrated* describes the present, not the past, so it ignores the time contrast.`,
    },
    {
      id: 'example-novelist',
      title: 'A surprise signal',
      problemMd: md`Ironically, the novelist whose books celebrate the pleasures of conversation was, in person, almost painfully \_\_\_\_\_\_.

Choices: garrulous, gracious, taciturn, prolific, erudite`,
      steps: [
        md`Signal: "Ironically" says the blank goes against what the books would lead you to expect.`,
        md`Clue: the books celebrate conversation, so you would expect a talkative person.`,
        md`Predict: "reluctant to talk". "Painfully" fits someone so quiet it is awkward.`,
        md`Compare: *taciturn* means saying little. *Garrulous* (very talkative) is the expected trait, so it removes the irony. *Gracious*, *prolific* and *erudite* (learned) do not oppose a love of conversation.`,
      ],
      answerMd: md`*Taciturn*. *Garrulous* tempts because it matches the books, but then there is nothing ironic.`,
    },
  ],
  traps: [
    {
      title: 'Missing a double reversal',
      md: md`"Although ... not" or "far from ... un-" stacks two reversals. Readers who catch only one end up with the opposite answer. Rewrite the clause without the negative, decide its meaning, then put the negative back.`,
    },
    {
      title: 'Reading "but" in "not only ... but also" as contrast',
      md: md`This construction adds a second, stronger point in the same direction. If you treat it as a contrast, you will pick a reversal.`,
    },
    {
      title: 'Ignoring a colon or semicolon',
      md: md`Punctuation is a signal too: a colon or semicolon nearly always introduces a restatement or explanation. People who read only for words like "because" miss half the clues.`,
    },
    {
      title: "Matching the clue when the signal says oppose",
      md: md`After finding a clue, it is natural to look for a choice that resembles it. If a contrast word sits between the clue and the blank, the resemblance is exactly what makes the choice wrong.`,
    },
  ],
  check: [
    {
      id: 'check-side-effects',
      title: 'Although ... not',
      topic: 'Text Completion',
      stemMd: md`Although the drug's side effects were not \_\_\_\_\_\_, regulators approved it, judging that its benefits for patients with no other treatment outweighed the risks.`,
      options: [
        { id: 'A', text: md`severe`, note: md`"Not severe" removes the tension that "although" needs, and "outweighed the risks" shows the risks were real. This catches readers who applied "although" but forgot the "not".` },
        { id: 'B', text: md`alarming`, note: md`Like "severe", "not alarming" would make the side effects harmless, so there would be nothing for the approval to stand against.` },
        { id: 'C', text: md`negligible`, note: '' },
        { id: 'D', text: md`publicised`, note: md`Whether the side effects were publicised has no bearing on approval, so "although" has nothing to contrast.` },
        { id: 'E', text: md`novel`, note: md`Whether the side effects were new says nothing about whether they argue against approval.` },
      ],
      answer: 'C',
      workingMd: md`"Although" means the first clause should give a reason against approval, and "outweighed the risks" confirms the side effects were a real cost. So the side effects were serious, which, with the "not", means they were *not negligible*.`,
      lesson: 'With a contrast word and a negative together, settle the meaning without the negative first, then put it back on the blank.',
    },
    {
      id: 'check-guidebook',
      title: 'An old guidebook',
      topic: 'Text Completion',
      stemMd: md`The guidebook's directions were thoroughly \_\_\_\_\_\_: they named landmarks that had been demolished, gave bus routes that had been discontinued and quoted prices from a decade earlier.`,
      options: [
        { id: 'A', text: md`verbose`, note: md`Nothing in the list is about wordiness; each item is about information that has gone out of date.` },
        { id: 'B', text: md`cryptic`, note: md`Cryptic directions are hard to understand. The problem described is not obscurity but information that is no longer true.` },
        { id: 'C', text: md`meticulous`, note: md`The directions are detailed, which makes this tempting, but the colon introduces a list of failures, so the blank must be a criticism.` },
        { id: 'D', text: md`obsolete`, note: '' },
        { id: 'E', text: md`whimsical`, note: md`Whimsical means playfully odd; nothing in the list suggests playfulness.` },
      ],
      answer: 'D',
      workingMd: md`The colon introduces a restatement: three examples of information that was once true and no longer is (demolished, discontinued, a decade old). The blank names what they share: *obsolete*, no longer current.`,
      lesson: 'A colon is a continuation signal: the blank names what the following examples have in common.',
    },
    {
      id: 'check-mediator',
      title: 'Rather than',
      topic: 'Text Completion',
      stemMd: md`Rather than \_\_\_\_\_\_ the dispute, the mediator's proposal inflamed it: within a week both unions had called strikes.`,
      options: [
        { id: 'A', text: md`aggravating`, note: md`This means making worse, which is what the proposal did. "Rather than" needs the opposite of inflaming.` },
        { id: 'B', text: md`defusing`, note: '' },
        { id: 'C', text: md`prolonging`, note: md`Inflaming a dispute is not the opposite of prolonging it; strikes would prolong it too, so there is no contrast.` },
        { id: 'D', text: md`publicising`, note: md`Making a dispute public is not the opposite of inflaming it, so "rather than" has nothing to contrast.` },
        { id: 'E', text: md`documenting`, note: md`Recording a dispute is unrelated to calming or worsening it.` },
      ],
      answer: 'B',
      workingMd: md`"Rather than" sets the blank against "inflamed". The opposite of inflaming a dispute is calming it, and *defusing* means reducing tension. The strikes after the colon confirm the proposal made things worse.`,
      lesson: '"Rather than", "instead of" and "far from" all ask for the opposite of what actually happened.',
    },
  ],
  takeaways: [
    'Every blank has a clue and a direction; signal words give the direction.',
    'Contrast and surprise words reverse; continuation words and colons agree; cause words link.',
    'Negatives are reversals too, and two reversals can cancel.',
    'When you miss a Text Completion, first check whether you read the signal the wrong way.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-text-completion', skill: 'tc-structural-signal-words' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const twoAndThreeBlanks: Lesson = {
  slug: 'text-completion-two-and-three-blanks',
  title: 'Text Completion: two and three blanks',
  summary: 'Start with the blank that has the strongest clue, let each answer inform the next, and test the whole passage before you commit.',
  minutes: 22,
  objectives: [
    'Choose which blank to solve first in a multi-blank item.',
    'Use a solved blank as a clue for the others.',
    'Check a full set of answers against the whole passage, knowing there is no partial credit.',
  ],
  teachMd: md`
### How multi-blank items are built

When a Text Completion has two or three blanks, each blank has its own column of three choices, and you pick one from each column. Credit comes only when every blank is right; there is no partial credit. Passages run up to five sentences, so a three-blank item can be a short paragraph with an argument of its own.

That design has two consequences. The good one: with three choices per blank, each column is quicker to sort than a five-choice list. The hard one: the blanks depend on each other, and a column often contains a word that fits its own clause perfectly but breaks the passage as a whole.

### You do not have to start with blank (i)

Blanks are numbered in reading order, but the first blank often has the weakest clue. Before choosing, read the whole passage and ask, for each blank, how much the surrounding text tells you about it. Start with the blank whose clue is clearest. Typical strong clues are a colon followed by examples, a word like "laughed" or "strikes" that describes an outcome directly, or a contrast word next to a plain description.

### Let each answer become a clue

Once one blank is filled, read the passage again with it in place. The filled word is now part of the text, and it often settles the other blanks. In "The speech was (i) \_\_\_\_\_\_ in tone but (ii) \_\_\_\_\_\_ in substance", knowing that the tone was mild tells you, through "but", that the substance was not.

This is also why a mistake in one blank tends to spread. If your first answer is wrong, the clue it gives for the next blank is wrong too. Fill the blank you are surest of first.

### Map the logic of a longer passage

For two- and three-sentence passages, sketch the argument in a few words before you look at any column:

- What was believed or done first?
- What changed, and why?
- What is the result?

A typical shape is "people used to think X; a new study says X was a mistake, because Y; as a result, Z". Each blank sits at one of those points. When you know which point a blank sits at, you know whether it should agree with the old view, reject it or describe its consequence.

### Three choices per column: sort them

In a three-choice column you can usually sort the words quickly: one points in the direction you predicted, one points the other way, and one is off topic. If two seem to point your way, the passage is asking for a more precise word; go back to the clue. If none does, recheck the signal words.

### Test the whole passage

Before you move on, read the passage once more with all the blanks filled. Ask: does it make one coherent point? A passage that says "the letters were marginal; this neglect was justified; the letters influenced policy" contradicts itself, however well each word fits its own clause. Because there is no partial credit, this final read is worth more on a multi-blank item than anywhere else.

### When the columns seem to disagree

Sometimes you fill two blanks confidently and find nothing in the third column that fits. Do not force a word in. A dead end in one column almost always means an earlier choice was wrong: the column you filled first gave you a false clue. Go back to the blank you were least sure of, try its next-best choice, and see whether the stuck column now has an obvious answer. The passage was written to have exactly one consistent set; if your set is not consistent, one of its parts is wrong.

### Time

Multi-blank items take longer than one-blank items, and that is fine. A three-blank paragraph can deserve two to three minutes if it is solvable; quick one-blank items will pay that time back. If you are stuck, enter your best set of answers, mark the question and return to it.
`,
  examples: [
    {
      id: 'example-senator-speech',
      title: 'Two blanks joined by "but"',
      problemMd: md`The senator's speech was (i) \_\_\_\_\_\_ in tone but (ii) \_\_\_\_\_\_ in substance: she spoke softly and courteously, yet proposed cutting the agency's budget by half.

Blank (i): mild, combative, evasive. Blank (ii): drastic, modest, vague.`,
      steps: [
        md`Find the strongest clue for each blank. After the colon, "spoke softly and courteously" describes the tone, and "cutting the budget by half" describes the substance.`,
        md`Blank (i): soft and courteous is *mild*. *Combative* is the reverse; *evasive* is about avoiding questions, which nothing mentions.`,
        md`Blank (ii): halving a budget is a large change, so *drastic*. *Modest* is the reverse; *vague* is wrong because the proposal is specific.`,
        md`Check the whole: "mild in tone but drastic in substance" uses "but" correctly, and the colon's two halves match the two blanks in order.`,
      ],
      answerMd: md`*Mild* and *drastic*. Choosing *modest* for blank (ii) because it "goes with" a mild tone ignores both "but" and the halved budget.`,
    },
    {
      id: 'example-first-comedy',
      title: 'Starting with the second blank',
      problemMd: md`Critics who expected the director's first comedy to be (i) \_\_\_\_\_\_ were surprised; the film is so (ii) \_\_\_\_\_\_ that audiences at the premiere laughed through most of its scenes.

Blank (i): hilarious, leaden, lucrative. Blank (ii): uproarious, sombre, tedious.`,
      steps: [
        md`Blank (i) has a weak clue on its own: "critics who expected it to be ..." could go anywhere. Blank (ii) has a direct clue: audiences laughed through most scenes.`,
        md`Solve (ii) first: a film that keeps an audience laughing is *uproarious*. *Sombre* and *tedious* point the other way.`,
        md`Now "were surprised" links the critics' expectation to that result: they expected the opposite of very funny. Blank (i) is *leaden* (heavy, dull). *Hilarious* would remove the surprise; *lucrative* (profitable) is about money, not humour.`,
        md`Read the whole: critics expected a leaden comedy and were surprised by an uproarious one. It is coherent.`,
      ],
      answerMd: md`*Leaden* and *uproarious*. Starting with blank (i), many readers pick *hilarious* simply because the film is a comedy, and then cannot make "were surprised" work.`,
    },
    {
      id: 'example-merchant-letters',
      title: 'Three blanks in a short argument',
      problemMd: md`For decades, historians treated the merchant's letters as (i) \_\_\_\_\_\_ sources, useful only for prices and shipping dates. A new study argues that this neglect was (ii) \_\_\_\_\_\_: read closely, the letters reveal a network of informants whose reports quietly (iii) \_\_\_\_\_\_ trade policy in three ports.

Blank (i): indispensable, marginal, fraudulent. Blank (ii): justified, deliberate, misguided. Blank (iii): influenced, mirrored, ignored.`,
      steps: [
        md`Map the argument: historians undervalued the letters; a new study says that was a mistake; the letters show informants who mattered.`,
        md`Blank (i): "useful only for prices and shipping dates" and "this neglect" both say the letters were treated as minor: *marginal*. *Indispensable* is the reverse; *fraudulent* would make the letters useless even for prices.`,
        md`Blank (iii): the colon gives the evidence that the letters matter, so the informants' reports must have had an effect on policy: *influenced*. *Mirrored* (merely reflected) and *ignored* would not show that the letters matter.`,
        md`Blank (ii): with the evidence in place, the study's verdict on the neglect is that it was a mistake: *misguided*. *Justified* contradicts the evidence; *deliberate* is about intent, which nothing addresses.`,
        md`Read the whole passage with *marginal*, *misguided* and *influenced*: it makes one consistent point.`,
      ],
      answerMd: md`*Marginal*, *misguided*, *influenced*. The tempting error is *justified* for blank (ii): it agrees with the historians' view in the first sentence, but the colon's evidence shows the study rejects that view.`,
    },
  ],
  traps: [
    {
      title: 'Always starting with blank (i)',
      md: md`The order of the blanks is the order of reading, not of difficulty. If blank (i) has a weak clue, a guess there will mislead you on the others. Rank the blanks by the strength of their clues and start with the strongest.`,
    },
    {
      title: 'Words that fit their own clause only',
      md: md`Each column is likely to hold a word that reads naturally in its own clause but contradicts another part of the passage. Only the full read-through catches it.`,
    },
    {
      title: 'Treating a blank as half-marks',
      md: md`There is no partial credit, so a set with one wrong blank is worth the same as a set with all blanks wrong. Spend the extra seconds to check the whole passage before moving on.`,
    },
    {
      title: 'Letting an early error spread',
      md: md`A wrong first answer becomes a false clue for the next blank. If the remaining columns seem to have no good choice, the problem is probably the blank you filled first; go back to it.`,
    },
  ],
  check: [
    {
      id: 'check-startup-accounts',
      title: "The founders' accounts",
      topic: 'Text Completion',
      stemMd: md`Though the startup's founders described their accounting as merely (i) \_\_\_\_\_\_, the auditors found it (ii) \_\_\_\_\_\_: entire quarters of expenses had simply been left off the books.

On the test each blank has its own column of three (blank (i): informal, rigorous, audited; blank (ii): incomplete, meticulous, transparent). Here the possible combinations are listed.`,
      options: [
        { id: 'A', text: md`rigorous ... incomplete`, note: md`"Merely" with "though" calls for a word that plays the problem down; "rigorous" is praise, not a modest description.` },
        { id: 'B', text: md`informal ... meticulous`, note: md`Blank (i) is right, but "meticulous" contradicts quarters of expenses left off the books.` },
        { id: 'C', text: md`informal ... incomplete`, note: '' },
        { id: 'D', text: md`audited ... transparent`, note: md`"Transparent" contradicts the missing expenses, and "merely audited" is not a way of downplaying a problem.` },
        { id: 'E', text: md`rigorous ... meticulous`, note: md`Both words praise the accounts, so "though" has nothing to contrast and the missing expenses are left unexplained.` },
      ],
      answer: 'C',
      workingMd: md`Start with blank (ii), which has the clearest clue: the colon says whole quarters of expenses were missing, so the auditors found the accounts *incomplete*. "Though" then sets the founders' description against that finding, and "merely" marks it as a minimising description: *informal*.`,
      lesson: 'Solve the blank with the clearest clue first, then let the signal words connect it to the others.',
    },
    {
      id: 'check-essayist',
      title: 'Early and late essays',
      topic: 'Text Completion',
      stemMd: md`The essayist's later work is far more (i) \_\_\_\_\_\_ than her early pieces, which were notorious for (ii) \_\_\_\_\_\_: a single paragraph might wander through four unrelated anecdotes before reaching its point.

Blank (i): focused, rambling, playful. Blank (ii): digression, brevity, repetition. The possible combinations are listed.`,
      options: [
        { id: 'A', text: md`rambling ... digression`, note: md`Blank (ii) is right, but "far more ... than" sets the later work against the early pieces; "rambling" makes them alike.` },
        { id: 'B', text: md`focused ... digression`, note: '' },
        { id: 'C', text: md`focused ... brevity`, note: md`Wandering through four anecdotes before the point is the opposite of brevity.` },
        { id: 'D', text: md`rambling ... brevity`, note: md`Both blanks are reversed: the early pieces wander, and the later work is contrasted with them.` },
        { id: 'E', text: md`playful ... repetition`, note: md`Four unrelated anecdotes are not the same thing repeated, and "playful" does not oppose wandering.` },
      ],
      answer: 'B',
      workingMd: md`Blank (ii) has the direct clue: paragraphs that wander through unrelated anecdotes show *digression*. "Far more ... than" contrasts the later work with that habit, so it is *focused*.`,
      lesson: 'A comparison such as "far more ... than" is a contrast signal between the two things compared.',
    },
    {
      id: 'check-museum-director',
      title: "The museum's storage",
      topic: 'Text Completion',
      stemMd: md`The museum's new director inherited a collection that had been (i) \_\_\_\_\_\_ for years: dozens of works sat uncatalogued in basement storage. Rather than (ii) \_\_\_\_\_\_ the problem, she made it public, inviting volunteers to help photograph and record every piece. The result was a catalogue far more (iii) \_\_\_\_\_\_ than any the museum had produced before.

Blank (i): neglected, exhibited, insured. Blank (ii): concealing, addressing, exaggerating. Blank (iii): comprehensive, selective, costly. The possible combinations are listed.`,
      options: [
        { id: 'A', text: md`neglected ... exaggerating ... comprehensive`, note: md`Making a problem public is not the opposite of exaggerating it, so "rather than" has nothing to contrast.` },
        { id: 'B', text: md`exhibited ... concealing ... comprehensive`, note: md`Works sitting uncatalogued in a basement were not being exhibited; the colon contradicts blank (i).` },
        { id: 'C', text: md`neglected ... concealing ... selective`, note: md`A catalogue built by recording every piece is the opposite of selective.` },
        { id: 'D', text: md`insured ... addressing ... costly`, note: md`Making the problem public with volunteers is a way of addressing it, so "rather than addressing" contradicts itself; nothing supports "insured" or "costly".` },
        { id: 'E', text: md`neglected ... concealing ... comprehensive`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Blank (i): the colon's evidence (uncatalogued works in storage) restates *neglected*. Blank (ii): "rather than" contrasts with "made it public", so *concealing*. Blank (iii): volunteers recorded every piece, so the catalogue was more *comprehensive*. Read together, the passage tells one story: neglect, openness instead of hiding, a complete record.`,
      lesson: 'In a three-blank passage, give each blank its own clue, then check that the three answers tell one consistent story.',
    },
  ],
  takeaways: [
    'Start with the blank whose clue is clearest, wherever it sits.',
    'Each filled blank becomes a clue for the others.',
    'Map a longer passage as belief, change, result before reading the columns.',
    'No partial credit: read the whole passage with every blank filled before moving on.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-text-completion', skill: 'tc-revise-interpretation' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const vocabularyInContext: Lesson = {
  slug: 'text-completion-vocabulary-in-context',
  title: 'Text Completion: vocabulary in context',
  summary: 'Handle second meanings, misleading roots and words with the right sense but the wrong charge, and decide what to do with a word you do not know.',
  minutes: 20,
  objectives: [
    'Recognise common words used in a less familiar second meaning.',
    'Avoid choices that only look like the word you predicted.',
    'Weigh the charge and strength of a word as well as its sense.',
    'Decide between a word you know that fails and a word you do not know.',
  ],
  teachMd: md`
### Context decides the meaning

Text Completion tests vocabulary, but not as a list of definitions. A choice is right only if its meaning, in this sentence, matches what the clue requires. That turns three kinds of vocabulary knowledge into points: knowing a familiar word's less familiar meaning, not being fooled by appearances, and feeling the difference between near-synonyms.

### Familiar words, second meanings

Many ordinary words have a second, more formal sense that a careful sentence may call on. If a familiar word seems to make no sense in a choice list, check whether its other meaning fits.

| Word | Everyday sense | Second sense |
| --- | --- | --- |
| qualify | meet a requirement | limit or modify a statement |
| temper | a mood or outburst | moderate, soften |
| flag | a cloth banner | weaken, lose energy |
| pedestrian | a person on foot | dull, unimaginative |
| wanting | desiring | lacking, deficient |
| sanction | a penalty | official approval |
| check | inspect | restrain, hold back |

*Qualified praise* is limited praise, not praise from an expert; *unqualified praise* is praise without reservations. A writer whose energy *flags* is tiring. A *pedestrian* essay is dull. The sentence tells you which sense is meant: look at the clue, not at the word's most common use.

### Look-alikes and misleading roots

Some words look as if they mean something they do not. Roots help often enough that people trust them too much.

- *Enervate* means to weaken, not to energise.
- *Noisome* means offensive or harmful (often of a smell), not noisy.
- *Restive* means restless or impatient, not restful.
- *Peripatetic* means travelling from place to place, not "walking around" a topic.

When your prediction is "tired", a choice that looks like "energy" should make you stop, not reach for it.

### Sense, charge and strength

Two words can share a basic sense and still not be interchangeable.

- **Charge.** *Frugal* and *thrifty* praise careful spending; *stingy* and *miserly* criticise it. If the sentence admires the person, the critical words are wrong, even though all four mean "spends little".
- **Strength.** *Dislike* and *loathe*, *pleased* and *ecstatic*: same direction, different strength. Words such as "outright", "utterly" or "only mildly" in the sentence tell you which strength is wanted.
- **Scope.** *Brief* is about length; *terse* adds abruptness. Make the prediction precise enough to tell them apart when the clue asks you to.

### When you do not know a word

You will meet choices you do not know. Use them correctly:

1. Predict as usual.
2. Test each word you know. If one matches the prediction, choose it.
3. If every word you know clearly fails, the answer is probably a word you do not know. Choose it rather than forcing a known word into a sentence it does not fit.
4. If two unknown words remain, use what you can: a recognisable root or prefix, or the word's sense of positive or negative charge. Then make a quick choice and move on.

This works because wrong choices are usually wrong for a clear reason, and a known word that fails is evidence. It is not permission to pick unknown words by default: an unfamiliar word is right only after the familiar ones have been ruled out.

### Building vocabulary that pays

Learn words in context, not in isolation: for each new word, write a short sentence of your own where the word could not be replaced by its opposite. Group words by meaning (words for "careful", words for "short", words for "praise") and note the charge and strength of each. That organisation is exactly what the test asks you to use.
`,
  examples: [
    {
      id: 'example-qualified-praise',
      title: 'A second meaning',
      problemMd: md`Her praise for the proposal was \_\_\_\_\_\_: she called it promising, but added that its cost estimates were "optimistic at best".

Choices: unqualified, effusive, qualified, sarcastic, belated`,
      steps: [
        md`Clue: praise ("promising") followed by a reservation about the costs.`,
        md`Predict: "praise with a reservation", that is, limited praise.`,
        md`*Qualified* in its second sense means limited or modified, which is exactly the prediction.`,
        md`Eliminate: *unqualified* means without reservation, the reverse. *Effusive* means gushing. *Sarcastic* would mean she did not mean "promising", which nothing suggests. *Belated* is about timing.`,
      ],
      answerMd: md`*Qualified*. Readers who know only the everyday sense ("having the right credentials") may reject it, or pick *unqualified* by mistake.`,
    },
    {
      id: 'example-enervated-hikers',
      title: 'A misleading look-alike',
      problemMd: md`After three days of walking in the heat, the hikers were thoroughly \_\_\_\_\_\_ and could barely lift their packs.

Choices: invigorated, elated, energised, enervated, restive`,
      steps: [
        md`Clue: "could barely lift their packs" after three days in the heat.`,
        md`Predict: "worn out, weak".`,
        md`*Enervated* means drained of energy, weakened. It looks like *energised*, but means nearly the opposite.`,
        md`Eliminate: *invigorated*, *energised* and *elated* all point the other way. *Restive* means restless, which does not match people who can barely lift a pack.`,
      ],
      answerMd: md`*Enervated*. *Energised* is the trap for anyone who guesses meaning from appearance.`,
    },
    {
      id: 'example-thrift-to-parsimony',
      title: 'Same sense, different charge',
      problemMd: md`What began as sensible thrift hardened over the years into outright \_\_\_\_\_\_: the family refused to heat the house even when the pipes froze.

Choices: generosity, frugality, prudence, parsimony, extravagance`,
      steps: [
        md`Clue: thrift "hardened into" something, and the example (no heat even when pipes froze) is extreme.`,
        md`Predict: "excessive, harsh unwillingness to spend". "Outright" asks for a strong, critical word.`,
        md`*Parsimony* means extreme unwillingness to spend money, which matches.`,
        md`Eliminate: *frugality* and *prudence* are the sensible starting point the sentence says was left behind. *Generosity* and *extravagance* are the reverse.`,
      ],
      answerMd: md`*Parsimony*. *Frugality* has the right sense but the wrong charge and strength: it is the "sensible thrift" the habit hardened out of.`,
    },
  ],
  traps: [
    {
      title: 'Rejecting a familiar word too fast',
      md: md`If a common word seems odd in the sentence, check its second meaning before ruling it out. *Qualify*, *flag*, *temper* and *pedestrian* are typical. The odd fit is often the point.`,
    },
    {
      title: 'Trusting the look of a word',
      md: md`*Enervate*, *noisome* and *restive* look like words they are not related to in meaning. If you are relying on appearance alone, treat the choice as unknown and use elimination instead.`,
    },
    {
      title: 'Right sense, wrong charge',
      md: md`A choice that means roughly the right thing but praises where the sentence criticises (or the reverse) is wrong. Check the charge of your prediction: is the writer admiring or disapproving?`,
    },
    {
      title: 'Choosing the unknown word first',
      md: md`An unfamiliar word is not more likely to be right because it is unfamiliar. Pick it only after the words you know have each failed for a reason you can name.`,
    },
  ],
  check: [
    {
      id: 'check-scientist-conclusion',
      title: 'A careful conclusion',
      topic: 'Text Completion',
      stemMd: md`The scientist was careful to \_\_\_\_\_\_ her conclusion, noting that the trial had included only forty patients and had lasted just six weeks.`,
      options: [
        { id: 'A', text: md`trumpet`, note: md`To trumpet is to announce loudly; pointing out a small sample and a short trial does the opposite.` },
        { id: 'B', text: md`abandon`, note: md`She still holds the conclusion; noting limits on it is not giving it up.` },
        { id: 'C', text: md`corroborate`, note: md`To corroborate is to confirm with further evidence. Noting the trial's limits adds no evidence; it narrows the claim.` },
        { id: 'D', text: md`qualify`, note: '' },
        { id: 'E', text: md`plagiarise`, note: md`Copying someone else's work has nothing to do with stating the limits of a trial.` },
      ],
      answer: 'D',
      workingMd: md`The clue is that she pointed out the trial's small size and short length: she limited the reach of her conclusion. In its second sense, to *qualify* a statement is to limit or modify it.`,
      lesson: 'When a sentence describes limiting or softening a claim, look for the second senses of words like qualify and temper.',
    },
    {
      id: 'check-second-half-novel',
      title: "The novel's second half",
      topic: 'Text Completion',
      stemMd: md`The second half of the novel is disappointingly \_\_\_\_\_\_: after the inventive opening chapters, the plot settles into predictable episodes told in flat, ordinary prose.`,
      options: [
        { id: 'A', text: md`peripatetic`, note: md`This means travelling from place to place. It may call to mind "walking", but nothing in the sentence is about travel.` },
        { id: 'B', text: md`ornate`, note: md`Ornate prose is elaborate and decorated, which contradicts "flat, ordinary prose".` },
        { id: 'C', text: md`pedestrian`, note: '' },
        { id: 'D', text: md`harrowing`, note: md`Harrowing means deeply distressing; predictable episodes in flat prose are dull, not distressing.` },
        { id: 'E', text: md`idiosyncratic`, note: md`This means peculiar to one person, unusual; the sentence says the second half is predictable and ordinary.` },
      ],
      answer: 'C',
      workingMd: md`After the colon, the clue lists predictable episodes and flat, ordinary prose, set against an inventive opening. The prediction is "dull, unimaginative", which is the second sense of *pedestrian*.`,
      lesson: 'An everyday word that seems out of place in the list may be there in its second meaning; test that meaning against the clue.',
    },
    {
      id: 'check-debate-attention',
      title: 'Hour four of the debate',
      topic: 'Text Completion',
      stemMd: md`By the fourth hour of the debate, the audience's attention had begun to \_\_\_\_\_\_, and many people were checking their phones.`,
      options: [
        { id: 'A', text: md`rally`, note: md`Attention that rallies recovers and grows, the reverse of an audience turning to its phones.` },
        { id: 'B', text: md`sharpen`, note: md`Sharpening attention is the opposite of what checking phones shows.` },
        { id: 'C', text: md`crystallise`, note: md`To crystallise is to become clear and definite; it does not describe attention fading.` },
        { id: 'D', text: md`intensify`, note: md`This is the reverse direction: attention was weakening, not growing stronger.` },
        { id: 'E', text: md`flag`, note: '' },
      ],
      answer: 'E',
      workingMd: md`Four hours in, with people turning to their phones, attention was weakening. As a verb, *flag* means to lose energy or become weaker, so "attention had begun to flag" is the only choice in the right direction.`,
      lesson: 'Short everyday words like flag, check and temper often appear as verbs with a formal meaning.',
    },
  ],
  takeaways: [
    'Context decides which meaning of a word is in play; check second meanings before rejecting a familiar word.',
    'Do not trust a word because it looks like your prediction.',
    'Match charge and strength as well as basic sense.',
    'Choose an unknown word only after every known word has failed for a nameable reason.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-text-completion', skill: 'tc-select-words-for-blanks' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const textCompletionUnit: Unit = {
  slug: 'text-completion',
  title: 'Text Completion',
  summary: 'Text Completion questions give one to five sentences with one to three blanks, and credit only a fully correct set of answers. This unit teaches how to find the clue for a blank, read the signal words that set its direction, work through two- and three-blank passages, and use vocabulary precisely in context.',
  lessons: [readingForClues, signalWords, twoAndThreeBlanks, vocabularyInContext],
};
