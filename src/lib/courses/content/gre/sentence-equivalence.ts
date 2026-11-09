import { md, type Lesson, type Unit } from '../../types';

/**
 * GRE unit 3: Sentence Equivalence. Format facts (one sentence, one blank,
 * six choices, select two, no partial credit) come from
 * docs/research/course-facts-2026-11-04.md (E2). Every sentence below is
 * original. On the test the six choices are selected directly; the checks
 * here list five possible pairs so that each has a single key.
 */

const method: Lesson = {
  slug: 'sentence-equivalence-method',
  title: 'Sentence Equivalence: a method that finds the pair',
  summary: 'Predict the blank, find every choice that fits, then keep only the two that give sentences alike in meaning. One perfect word without a partner is not enough.',
  minutes: 18,
  objectives: [
    'Apply a four-step method to a Sentence Equivalence question.',
    'Explain why the answer must be two choices that produce sentences alike in meaning.',
    'Reject a synonym pair that does not fit the sentence, and a fitting word that has no partner.',
  ],
  teachMd: md`
### What the question asks

A Sentence Equivalence question gives you one sentence with one blank and six choices. You must select **two** choices, and you score only if both are right; there is no partial credit for one. The instruction asks for the two choices that each complete the sentence coherently **and** give two sentences that are alike in meaning.

Both conditions matter. The two words do not have to be perfect synonyms, but the two finished sentences must say essentially the same thing. And each word must fit the sentence on its own; two synonyms that do not fit are still wrong.

### The method

1. **Read the sentence and find the clue**, exactly as in Text Completion: what does the blank describe, and which words tell you about it? Mark any signal words that set the direction.
2. **Predict** a plain-words answer before looking at the six choices.
3. **Find every choice that fits the prediction.** Go through all six and keep each one that could complete the sentence with the predicted meaning.
4. **Pair them.** From the words you kept, choose the two that give sentences alike in meaning. Then read the sentence twice, once with each word, and compare.

Many questions resolve at step 3: exactly two choices fit, and they are your pair. The method earns its keep when step 3 leaves one, three or four candidates.

### When only one choice fits

Sometimes a single word fits the sentence beautifully and nothing else does. That word cannot be the answer on its own: the correct answer is always a pair. Either you have misread the clue (so another word fits better than you thought), or the "perfect" word is a distractor without a partner. Go back to step 1 and look for the meaning that **two** of the choices share.

This is the most distinctive feature of the format and a real advantage: the pair requirement is a check on your reading. If your prediction picks out one word only, your prediction is probably too narrow or wrong.

### When three or four fit

Then you need precision. Ask which two produce the **same** sentence. Typical cases:

- Two words fit but say different things: in "The critic's review was \_\_\_\_\_\_", *harsh* and *short* can both complete it, but they are different reviews.
- One word is stronger or weaker than the other, or has a different positive or negative charge. The next two lessons deal with this in detail.

### Synonym pairs are not automatically right

A choice list can contain more than one pair of near-synonyms. Often the second pair is the reverse of the answer, ready for anyone who misses a contrast word. So "these two mean the same" is a necessary condition, not a sufficient one. Always check the pair against the clue.

A quick way to use this: after reading the six choices, notice the pairs of words that are alike. There may be two or three such pairs. The question is then which pair fits the sentence, and that question is usually easy once you have a prediction.

### Why predicting still matters

With six choices on screen, it is tempting to skip the prediction and look for pairs straight away. Resist it. A list built with a reversed pair and a topic pair can make several readings of the sentence seem possible, and without a prediction you end up choosing between pairs on instinct. A plain-words prediction made before you look turns that choice into a quick comparison.

### Working order and time

Sentence Equivalence questions are short, so they reward a steady routine rather than speed reading. A sensible order: clue, prediction, scan all six, pair, double reread. If you cannot find a pair after a fair attempt, choose the two most likely words (never leave it with one selection or none, since nothing is subtracted for a wrong answer), mark it and move on.
`,
  examples: [
    {
      id: 'example-spartan-rooms',
      title: 'Two pairs, one fits',
      problemMd: md`Visitors expecting a grand estate were surprised by the house's \_\_\_\_\_\_ rooms, which held little more than a bed, a table and a single chair.

Choices: austere, opulent, cramped, spartan, lavish, ornate`,
      steps: [
        md`Clue: the rooms held almost nothing, and visitors expecting grandeur were surprised.`,
        md`Predict: "bare, plain".`,
        md`Scan all six: *austere* (severely plain) and *spartan* (simple, without comfort) fit. *Opulent*, *lavish* and *ornate* describe grandeur, the visitors' expectation, not the rooms. *Cramped* means too small; the clue is about how little the rooms contained, not their size.`,
        md`Pair: *austere* and *spartan* both give "bare, plain rooms". Reread both sentences: they say the same thing.`,
      ],
      answerMd: md`*Austere* and *spartan*. *Opulent* and *lavish* are also a synonym pair, but they describe the grand estate the visitors expected.`,
    },
    {
      id: 'example-theory-greeted',
      title: 'A word that fits but has no partner',
      problemMd: md`Although the theory was at first greeted with \_\_\_\_\_\_, a decade of confirming experiments turned most of its critics into supporters.

Choices: scepticism, enthusiasm, hostility, incredulity, acclaim, indifference`,
      steps: [
        md`Clue: "Although" sets the first reception against a decade of confirmation that turned critics into supporters. The first reception was doubt about whether the theory was true.`,
        md`Predict: "doubt, disbelief".`,
        md`Scan: *scepticism* and *incredulity* (unwillingness to believe) fit. *Hostility* also fits the sentence: critics can be hostile. *Enthusiasm* and *acclaim* are the reverse; *indifference* does not match people who were actively critics.`,
        md`Pair: *hostility* has no partner among the six, and confirming experiments answer doubt more directly than they answer hostility. *Scepticism* and *incredulity* give two sentences alike in meaning.`,
      ],
      answerMd: md`*Scepticism* and *incredulity*. *Hostility* is the trap: it completes the sentence, but nothing else on the list gives the same meaning with it.`,
    },
    {
      id: 'example-diplomat-reply',
      title: 'Prediction first',
      problemMd: md`The diplomat's reply was deliberately \_\_\_\_\_\_, committing her government to nothing while appearing to agree with everyone.

Choices: candid, equivocal, hostile, forthright, ambiguous, belated`,
      steps: [
        md`Clue: the reply committed to nothing and seemed to agree with everyone; "deliberately" says it was meant that way.`,
        md`Predict: "open to more than one reading, non-committal".`,
        md`Scan: *equivocal* (open to more than one interpretation, often to avoid commitment) and *ambiguous* (having more than one possible meaning) fit. *Candid* and *forthright* mean frank and direct, the reverse. *Hostile* contradicts "appearing to agree with everyone". *Belated* is about timing.`,
        md`Pair *equivocal* and *ambiguous*; both sentences describe a reply that can be read several ways.`,
      ],
      answerMd: md`*Equivocal* and *ambiguous*. *Candid* and *forthright* are the reversed pair.`,
    },
  ],
  traps: [
    {
      title: 'The synonym pair that does not fit',
      md: md`A choice list may contain two or more pairs of near-synonyms. Spotting a pair is a start, not an answer: check it against your prediction from the clue.`,
    },
    {
      title: 'The perfect word with no partner',
      md: md`A word that fits the sentence well but has no match among the other five cannot be one of the answers. Look for the meaning two choices share, and reread the clue if you cannot find it.`,
    },
    {
      title: 'Two fitting words that make different sentences',
      md: md`*Harsh* and *brief* can both complete "the review was \_\_\_\_\_\_", but they describe different reviews. Read the sentence once with each word and ask whether the two versions say the same thing.`,
    },
    {
      title: 'Expecting credit for one right word',
      md: md`There is no partial credit. One right word and one wrong word score the same as two wrong words, so always select two, and choose them as a pair.`,
    },
  ],
  check: [
    {
      id: 'check-new-manager-budget',
      title: "The new manager's budget",
      topic: 'Sentence Equivalence',
      stemMd: md`The new manager's \_\_\_\_\_\_ approach to the budget surprised staff used to her predecessor's habit of approving almost every request.

Choices: frugal, lavish, haphazard, thrifty, profligate, transparent. Which pair completes the sentence with two sentences alike in meaning?`,
      options: [
        { id: 'A', text: md`lavish and profligate`, note: md`These are synonyms, but they describe the predecessor's free spending; the "surprised" signal calls for the opposite.` },
        { id: 'B', text: md`frugal and transparent`, note: md`Each could complete the sentence, but they describe different things: careful spending versus openness. The sentences are not alike in meaning.` },
        { id: 'C', text: md`thrifty and lavish`, note: md`These are opposites, so they cannot produce sentences alike in meaning.` },
        { id: 'D', text: md`frugal and thrifty`, note: '' },
        { id: 'E', text: md`haphazard and profligate`, note: md`Neither contrasts with approving almost every request, and they do not mean the same thing.` },
      ],
      answer: 'D',
      workingMd: md`Staff were surprised because they were used to a predecessor who approved almost everything, so the new approach is the opposite: careful with money. *Frugal* and *thrifty* both mean sparing in spending and give the same sentence.`,
      lesson: 'Use the clue to decide which synonym pair fits; the reversed pair is usually on the list too.',
    },
    {
      id: 'check-physicist-sharing',
      title: 'Once reluctant to share',
      topic: 'Sentence Equivalence',
      stemMd: md`Once \_\_\_\_\_\_ about sharing his research, the physicist has lately begun posting his data online the day it is collected.

Choices: secretive, forthcoming, careless, guarded, open, prolific. Which pair completes the sentence with two sentences alike in meaning?`,
      options: [
        { id: 'A', text: md`forthcoming and open`, note: md`These describe him now. "Once ... lately" calls for a past attitude that contrasts with posting data at once.` },
        { id: 'B', text: md`guarded and careless`, note: md`"Guarded" fits, but "careless about sharing" means something different, almost the reverse.` },
        { id: 'C', text: md`secretive and guarded`, note: '' },
        { id: 'D', text: md`secretive and prolific`, note: md`"Prolific" (producing a lot) does not contrast with sharing data, and it does not mean the same as secretive.` },
        { id: 'E', text: md`open and prolific`, note: md`"Open" is his present attitude, and the two words do not share a meaning.` },
      ],
      answer: 'C',
      workingMd: md`"Once ... has lately begun" is a time contrast: before, he was the opposite of someone who posts data the same day. *Secretive* and *guarded* both mean unwilling to share, and give the same sentence.`,
      lesson: 'Time contrasts like "once ... now" ask for the earlier state, the opposite of the one described.',
    },
    {
      id: 'check-witness-account',
      title: "The witness's account",
      topic: 'Sentence Equivalence',
      stemMd: md`The witness's account was so \_\_\_\_\_\_ that the investigators could not reconcile it with either the camera footage or her own earlier statement.

Choices: detailed, inconsistent, fabricated, vivid, contradictory, rehearsed. Which pair completes the sentence with two sentences alike in meaning?`,
      options: [
        { id: 'A', text: md`detailed and vivid`, note: md`These are alike, but rich detail does not stop an account being reconciled with the evidence; they miss the clue.` },
        { id: 'B', text: md`fabricated and rehearsed`, note: md`A rehearsed account would tend to be consistent, and the two words do not mean the same thing.` },
        { id: 'C', text: md`inconsistent and fabricated`, note: md`"Fabricated" fits on its own, but invented is not the same as inconsistent; the two sentences make different charges.` },
        { id: 'D', text: md`vivid and rehearsed`, note: md`Neither explains why the account could not be reconciled, and they do not share a meaning.` },
        { id: 'E', text: md`inconsistent and contradictory`, note: '' },
      ],
      answer: 'E',
      workingMd: md`"So ... that" gives the effect: the account could not be squared with the footage or with her own earlier statement. The account clashed with other evidence and with itself. *Inconsistent* and *contradictory* both say that. *Fabricated* is the word without a partner.`,
      lesson: 'A word that fits but has no partner is not part of the answer; find the meaning that two choices share.',
    },
  ],
  takeaways: [
    'The answer is always two choices that each fit and give sentences alike in meaning.',
    'Clue, prediction, scan all six, pair, then reread the sentence with each word.',
    'A fitting word without a partner is a distractor; a synonym pair that does not fit is too.',
    'No partial credit: always select two, and select them as a pair.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-sentence-equivalence', skill: 'se-conclude-from-partial-information' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const pairsAndNearMisses: Lesson = {
  slug: 'sentence-equivalence-pairs-and-near-misses',
  title: 'Sentence Equivalence: true pairs and near misses',
  summary: 'Tell a true pair from a near miss: words that share a topic, overlap only in part, or carry a different charge do not give sentences alike in meaning.',
  minutes: 18,
  objectives: [
    'Test whether two words produce sentences alike in meaning by substituting both.',
    'Recognise near misses: shared topic, partial overlap, and different charge.',
    'Choose between two candidate pairs using the precise demand of the clue.',
  ],
  teachMd: md`
### Alike in meaning, not identical

The two answers to a Sentence Equivalence question do not need to be dictionary synonyms. What must match is the meaning of the two **finished sentences**. That standard is both looser and stricter than "synonyms". Looser, because two words with different dictionary entries can produce the same sentence ("the plan was *abandoned*" and "the plan was *dropped*"). Stricter, because two words that are listed as synonyms can produce different sentences when the context brings out a difference between them.

The test is always the same: read the sentence with the first word, read it with the second, and ask whether a careful reader would take the two sentences to say the same thing.

### Three kinds of near miss

Wrong pairs are built to look right. Most fall into one of three groups.

**Shared topic.** Both words belong to the subject but say different things about it. In a sentence about a town's population, *stable*, *dense* and *diverse* all describe populations, but they are three different facts. Only words that make the same claim can pair.

**Partial overlap.** The words share part of their meaning but not all of it. *Concise* and *curt* both mean brief; *curt* adds rudeness. *Change* and *improve* overlap, but every improvement is a change and not the reverse. If the sentence needs the shared part only, a word that adds an extra layer can still break the pair.

**Different charge.** The words describe the same behaviour with different approval. *Frank* and *tactless* can describe the same remark, but one praises it and one criticises it. A sentence that says reviewers "praised" the writer as \_\_\_\_\_\_ needs the approving word, and its approving partner.

### How the clue decides

Near misses are separated by the clue, not by your feeling for the words. Before you choose between two candidate pairs, go back to the sentence and ask what exactly it says about the blank:

- Is there an approving or disapproving word ("admirably", "praised", "disappointingly")? Then the charge must match.
- Does the clue specify a scope (about length, about honesty, about speed)? Then both words must stay within that scope.
- Is there a word of degree ("slightly", "utterly")? Then both words must match that strength (the next lesson).

If one candidate pair satisfies every demand of the clue and the other fails one, the decision is made.

### Words that pair without being synonyms

The reverse case also matters. Two words with different dictionary meanings can still give sentences alike in meaning, because the sentence uses only the part they share. In "the committee \_\_\_\_\_\_ the plan after its cost doubled", *scrapped* and *abandoned* are not interchangeable in every setting (you scrap an old car; you abandon a ship or a hope), but here both say the committee gave the plan up for good. Do not reject a pair only because the words are not exact synonyms; reject it when the two sentences would make different claims.

### Building the habit

When you review a Sentence Equivalence question, do not stop at the right pair. For each wrong choice, name the group it belongs to: reversed, unsupported, shared topic, partial overlap or wrong charge. After a few dozen questions you will see the same patterns again and again, and you will start sorting choices on first reading.

It also helps to learn new words in small families rather than alone. When you learn *curt*, learn it beside *concise*, *succinct* and *brusque*, and write down what separates them. Sentence Equivalence is largely a test of whether you know those differences.

### One more check: grammar and idiom

Both words must also fit the sentence's grammar and usual phrasing. A word that means the right thing but cannot follow the preposition after the blank ("hostile to", "fond of", "averse to") makes an awkward sentence. This is rarely the deciding factor, but when two pairs seem equal, read each sentence aloud in your head: the one a careful writer would publish usually wins.
`,
  examples: [
    {
      id: 'example-lecturer-concise',
      title: 'Partial overlap and charge',
      problemMd: md`The lecturer's explanation was admirably \_\_\_\_\_\_, covering in ten minutes what the textbook took a whole chapter to say.

Choices: concise, brusque, exhaustive, succinct, curt, rambling`,
      steps: [
        md`Clue: ten minutes for what took a chapter, so the explanation was short. "Admirably" says the brevity is praised.`,
        md`Predict: "brief in a good way".`,
        md`Scan: *concise*, *succinct*, *brusque* and *curt* all involve brevity. *Exhaustive* and *rambling* are the reverse.`,
        md`Separate: *brusque* and *curt* add rudeness, which clashes with "admirably". *Concise* and *succinct* mean brief and clear, without that charge.`,
      ],
      answerMd: md`*Concise* and *succinct*. *Brusque* and *curt* are a near-miss pair: same basic sense, wrong charge.`,
    },
    {
      id: 'example-memoir-candid',
      title: 'Same behaviour, different approval',
      problemMd: md`Reviewers praised the memoir as \_\_\_\_\_\_, noting that the author admitted her own mistakes as readily as she described her successes.

Choices: boastful, candid, blunt, tactless, frank, modest`,
      steps: [
        md`Clue: she admitted mistakes as readily as successes: honesty about herself. "Praised" sets an approving charge.`,
        md`Predict: "honest, open".`,
        md`Scan: *candid* and *frank* fit. *Blunt* and *tactless* describe directness with a critical charge, and *tactless* in particular is not praise. *Modest* fits loosely (not boasting) but is about humility rather than honesty, and has no partner. *Boastful* is the reverse.`,
        md`Pair *candid* and *frank*: both give "praised as honest and open".`,
      ],
      answerMd: md`*Candid* and *frank*. *Modest* is the attractive single word, but it has no partner and it describes humility, not honesty.`,
    },
    {
      id: 'example-town-population',
      title: 'Shared topic',
      problemMd: md`The town's population has remained \_\_\_\_\_\_ for a decade, with births, deaths and moves almost exactly balancing out.

Choices: dense, stable, dwindling, diverse, constant, declining`,
      steps: [
        md`Clue: births, deaths and moves balance out, so the number does not change.`,
        md`Predict: "unchanged in size".`,
        md`Scan: *stable* and *constant* fit. *Dwindling* and *declining* form a pair, but a balance means no fall. *Dense* and *diverse* are population words that say nothing about change.`,
      ],
      answerMd: md`*Stable* and *constant*. *Dense* and *diverse* are shared-topic distractors: true or false of a population, but not what this sentence is about.`,
    },
  ],
  traps: [
    {
      title: 'Trusting the thesaurus',
      md: md`Two words listed together as synonyms can still give different sentences in context. Substitute each word and compare the sentences, not the words.`,
    },
    {
      title: 'Ignoring the charge',
      md: md`*Frank* and *tactless*, *thrifty* and *stingy*: same act, different judgement. Look for the approving or disapproving word in the sentence and match it.`,
    },
    {
      title: 'Picking topic words',
      md: md`Words that belong to the sentence's subject are often on the list. Ask what the sentence claims about the subject, not what the subject is.`,
    },
  ],
  check: [
    {
      id: 'check-senator-remarks',
      title: 'Unplanned remarks',
      topic: 'Sentence Equivalence',
      stemMd: md`The senator's \_\_\_\_\_\_ remarks, delivered without notes and clearly unplanned, nonetheless contained the most memorable line of the evening.

Choices: rehearsed, impromptu, eloquent, scripted, improvised, controversial. Which pair completes the sentence with two sentences alike in meaning?`,
      options: [
        { id: 'A', text: md`rehearsed and scripted`, note: md`These are synonyms but contradict "clearly unplanned".` },
        { id: 'B', text: md`impromptu and eloquent`, note: md`"Eloquent" is a different claim (well-expressed), and "nonetheless" needs remarks one would not expect to be memorable, which eloquent ones would be.` },
        { id: 'C', text: md`impromptu and improvised`, note: '' },
        { id: 'D', text: md`eloquent and controversial`, note: md`Neither matches "delivered without notes and clearly unplanned", and they do not share a meaning.` },
        { id: 'E', text: md`improvised and scripted`, note: md`These are opposites, so the two sentences would say opposite things.` },
      ],
      answer: 'C',
      workingMd: md`The clue restates the blank: without notes and unplanned. *Impromptu* and *improvised* both mean done without preparation. "Nonetheless" then makes sense: unprepared remarks are not expected to produce the best line.`,
      lesson: 'A descriptive phrase next to the blank often restates it; both words of the pair must match that phrase.',
    },
    {
      id: 'check-limited-funds',
      title: 'Stretching a small grant',
      topic: 'Sentence Equivalence',
      stemMd: md`Her colleagues admired the way she \_\_\_\_\_\_ the project's limited funds, stretching a small grant across three years of fieldwork.

Choices: squandered, husbanded, hoarded, dissipated, conserved, embezzled. Which pair completes the sentence with two sentences alike in meaning?`,
      options: [
        { id: 'A', text: md`squandered and dissipated`, note: md`Both mean wasted, which contradicts making a small grant last three years and the colleagues' admiration.` },
        { id: 'B', text: md`conserved and hoarded`, note: md`"Hoarded" means stored away and kept back, with a disapproving charge; she spent the money, carefully, and was admired for it.` },
        { id: 'C', text: md`husbanded and embezzled`, note: md`"Embezzled" means stole entrusted money, which nobody would admire and which does not match stretching the grant.` },
        { id: 'D', text: md`husbanded and conserved`, note: '' },
        { id: 'E', text: md`hoarded and embezzled`, note: md`Both are disapproving and neither means managing money carefully; they also differ from each other.` },
      ],
      answer: 'D',
      workingMd: md`The clue: she made a small grant last three years, and her colleagues admired it. The blank means "used economically". *Husbanded* (managed resources thriftily) and *conserved* (used carefully to avoid waste) both say that. *Hoarded* overlaps in "keeping" but carries the wrong charge and the wrong sense, since the funds were spent.`,
      lesson: 'When one word in a candidate pair adds a disapproving charge the sentence does not have, the pair is a near miss.',
    },
    {
      id: 'check-historian-thesis',
      title: 'Not overturned, but changed',
      topic: 'Sentence Equivalence',
      stemMd: md`The new evidence did not overturn the historian's thesis, but it did \_\_\_\_\_\_ it: she now argues that the policy affected the coastal towns far more than the inland ones.

Choices: refute, qualify, demolish, confirm, refine, publicise. Which pair completes the sentence with two sentences alike in meaning?`,
      options: [
        { id: 'A', text: md`refute and demolish`, note: md`Both mean disprove, which contradicts "did not overturn".` },
        { id: 'B', text: md`qualify and refine`, note: '' },
        { id: 'C', text: md`confirm and refine`, note: md`"Confirm" leaves the thesis as it was, but the colon shows she changed it; and confirm does not mean refine.` },
        { id: 'D', text: md`qualify and refute`, note: md`"Refute" contradicts "did not overturn", and the two words do not mean the same.` },
        { id: 'E', text: md`confirm and publicise`, note: md`Neither describes the change after the colon, and they do not share a meaning.` },
      ],
      answer: 'B',
      workingMd: md`"Did not overturn ... but did" asks for a change short of rejection, and the colon shows it: the thesis now applies more to some towns than others. To *qualify* a claim is to limit it; to *refine* it is to make it more precise. Both give "adjusted, not rejected".`,
      lesson: 'When a sentence rules out the extreme ("did not overturn"), look for the pair that describes the moderate change.',
    },
  ],
  takeaways: [
    'Compare the two finished sentences, not the two words.',
    'Near misses share a topic, overlap only in part, or carry a different charge.',
    'The clue decides between candidate pairs: check charge, scope and degree.',
    'When reviewing, name the reason each wrong choice fails.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-sentence-equivalence', skill: 'se-two-choices-alike-in-meaning' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const toneAndIntensity: Lesson = {
  slug: 'sentence-equivalence-tone-and-intensity',
  title: 'Sentence Equivalence: tone and intensity',
  summary: 'Match the strength and tone the sentence asks for: words like only, utterly and nothing short of decide between pairs that point the same way.',
  minutes: 17,
  objectives: [
    'Read degree words in a sentence and predict the strength of the blank.',
    'Separate a correct pair from a pair with the right direction but the wrong strength.',
    'Match the tone of the blank to the tone the sentence sets.',
  ],
  teachMd: md`
### Direction is not enough

Choice lists in Sentence Equivalence often contain two pairs that point the same way: one mild, one strong. *Annoyed* and *irked*; *enraged* and *incensed*. All four describe displeasure, but "enraged" and "annoyed" make very different sentences. Since the two answers must give sentences alike in meaning, a mild word and a strong word cannot pair, and the sentence will tell you which strength it wants.

### Words that set the degree

Look in the sentence for words that turn the volume up or down.

| Turns it down | Turns it up |
| --- | --- |
| only, merely, slightly, mildly, somewhat | utterly, thoroughly, wholly, outright |
| a few, rarely, hardly | nothing short of, so ... that, even |
| not entirely, a little | far from mere, more than just |

Evidence also sets the degree. "She noted the delays in a single sentence and moved on" describes mild annoyance; "she walked out halfway through" describes something stronger. A strong word needs strong evidence, and a mild word is wrong when the sentence describes an extreme.

### A scale for each family

It helps to think of words in a family as points on a scale. For displeasure: *irked*, *annoyed* (mild); *indignant*, *offended* (middle); *incensed*, *enraged*, *livid* (strong). For approval: *pleased*, *content*; *delighted*; *ecstatic*, *euphoric*. For criticism: *mild*, *muted*; *pointed*, *sharp*; *scathing*, *withering*.

When you predict, predict a point on the scale, not only a direction: not just "unhappy", but "a little unhappy". Then the pair you want is the two choices at that point.

### Tone: what the writer feels about it

Tone is related but different. It is the attitude of the sentence: approving, disapproving, ironic, neutral, formal. Two words can be equally strong and still differ in tone: *measured* and *restrained* describe calm language approvingly; *bland* and *flat* describe it critically. Look for the writer's evaluation: "admirably", "disappointingly", "to her credit", "unfortunately".

Tone can also be set by a contrast. "Though the report's language was \_\_\_\_\_\_, its findings were damning" contrasts the language with the findings. Damning findings are severe, so the language is calm. The contrast gives you both the direction and the tone.

### Putting it together

Your prediction for a Sentence Equivalence blank should now have three parts:

1. **Direction**: positive or negative, more or less, towards or away from the clue.
2. **Degree**: mild, middle or strong.
3. **Tone**: does the sentence approve or disapprove?

Then scan the six choices. The right pair matches on all three. The usual distractors match on one or two: the right direction at the wrong strength, or the right strength in the wrong direction.

### When the degree is not stated

Not every sentence has a word like "only" or "utterly". Then the degree comes from the facts. Compare the evidence with the choices: does the sentence describe a small inconvenience or a disaster, a polite comment or a walk-out, a slight rise or a doubling? Judge the strength the facts support and do not go beyond it. A strong word needs strong evidence; if the sentence gives only moderate evidence, the strong pair overstates it, and if it gives extreme evidence, a mild pair understates it.

A related check works on the pair itself. Once you have two candidates, ask whether a careful writer would swap one for the other without changing the sentence's force. *Annoyed* for *irked*, yes. *Annoyed* for *enraged*, no: the reader would picture a different scene. If the swap changes the scene, the two words are not a pair.

### Practising the skill

When you learn a new word, place it on a scale with words you know: is *disgruntled* weaker or stronger than *furious*? Is *perfunctory* approving or not? Short lists of five to eight words in order of strength, built from your own reading, do more for this question type than long alphabetical lists.
`,
  examples: [
    {
      id: 'example-mildly-irked',
      title: 'A degree word turns it down',
      problemMd: md`The reviewer was only mildly \_\_\_\_\_\_ by the delays; she mentioned them in a single sentence and moved on to praise the cast.

Choices: incensed, irked, delighted, enraged, annoyed, bewildered`,
      steps: [
        md`Direction: delays are a nuisance, so displeasure.`,
        md`Degree: "only mildly" and "a single sentence" both say weak.`,
        md`Scan: *irked* and *annoyed* are mild displeasure. *Incensed* and *enraged* are the strong pair, which clashes with "only mildly". *Delighted* is the reverse; *bewildered* means confused, not displeased.`,
      ],
      answerMd: md`*Irked* and *annoyed*. *Incensed* and *enraged* point the right way but are far too strong for "only mildly".`,
    },
    {
      id: 'example-crowd-ecstatic',
      title: 'A degree phrase turns it up',
      problemMd: md`The crowd's reaction to the final goal was nothing short of \_\_\_\_\_\_: strangers hugged, and the noise could be heard across the river.

Choices: pleased, hostile, ecstatic, subdued, content, euphoric`,
      steps: [
        md`Direction: celebration, so joy.`,
        md`Degree: "nothing short of" and the evidence (strangers hugging, noise across the river) say extreme.`,
        md`Scan: *ecstatic* and *euphoric* are intense joy. *Pleased* and *content* are joy at a mild level. *Hostile* and *subdued* point the wrong way.`,
      ],
      answerMd: md`*Ecstatic* and *euphoric*. *Pleased* and *content* are the right direction at the wrong strength.`,
    },
    {
      id: 'example-measured-report',
      title: 'Tone set by a contrast',
      problemMd: md`Though the report's language was \_\_\_\_\_\_, its findings were damning: the agency had missed every deadline it set itself.

Choices: inflammatory, measured, ambiguous, restrained, incendiary, ornate`,
      steps: [
        md`Signal: "Though" contrasts the language with the findings.`,
        md`The findings were severe ("damning"), so the language was the opposite: calm, not severe.`,
        md`Scan: *measured* and *restrained* describe calm, controlled language. *Inflammatory* and *incendiary* are the strong, provocative pair, which would remove the contrast. *Ambiguous* and *ornate* are about clarity and decoration, not severity.`,
      ],
      answerMd: md`*Measured* and *restrained*. *Inflammatory* and *incendiary* match the findings, which is exactly why "though" rules them out.`,
    },
  ],
  traps: [
    {
      title: 'Right direction, wrong strength',
      md: md`A frequent kind of wrong pair points the right way at the wrong volume. After you find the direction, look for degree words and evidence of degree, and choose the pair at that point.`,
    },
    {
      title: 'Overlooking small words',
      md: md`"Only", "even", "merely" and "nothing short of" are easy to read past and change the answer. Underline them mentally before you predict.`,
    },
    {
      title: 'Matching the subject instead of the sentence',
      md: md`A scandal or a disaster in the sentence pulls you towards strong words. The blank may describe something calm set against it, as in "though the language was measured". Ask what the blank describes, then set its tone.`,
    },
  ],
  check: [
    {
      id: 'check-board-criticism',
      title: 'A few questions about the timetable',
      topic: 'Sentence Equivalence',
      stemMd: md`The proposal drew \_\_\_\_\_\_ criticism from a few members, who mostly questioned the timetable, but the board approved it without a vote against.

Choices: scathing, mild, unanimous, muted, withering, anonymous. Which pair completes the sentence with two sentences alike in meaning?`,
      options: [
        { id: 'A', text: md`scathing and withering`, note: md`Right direction, wrong strength: a few members mostly questioning a timetable, followed by approval with no vote against, is not savage criticism.` },
        { id: 'B', text: md`mild and scathing`, note: md`These are opposite ends of the same scale, so they cannot give sentences alike in meaning.` },
        { id: 'C', text: md`muted and anonymous`, note: md`"Muted" fits, but "anonymous" makes a different claim (that the critics were unnamed), which nothing in the sentence supports, and it does not mean the same as muted.` },
        { id: 'D', text: md`mild and muted`, note: '' },
        { id: 'E', text: md`unanimous and withering`, note: md`Criticism from "a few members" cannot be unanimous, and withering is far too strong.` },
      ],
      answer: 'D',
      workingMd: md`The evidence sets a low degree: only a few members, mostly about the timetable, and the proposal passed without a vote against. *Mild* and *muted* (subdued) both describe criticism at that level.`,
      lesson: 'Let the evidence in the sentence set the strength of the blank, then pick the pair at that strength.',
    },
    {
      id: 'check-coach-praise',
      title: 'Even the coach',
      topic: 'Sentence Equivalence',
      stemMd: md`Even the coach, usually \_\_\_\_\_\_ in her praise, called the team's defensive performance the best she had seen in twenty years.

Choices: sparing, lavish, sincere, grudging, effusive, public. Which pair completes the sentence with two sentences alike in meaning?`,
      options: [
        { id: 'A', text: md`sparing and grudging`, note: '' },
        { id: 'B', text: md`lavish and effusive`, note: md`These are alike, but if she usually praised freely, "even the coach" would carry no surprise.` },
        { id: 'C', text: md`sparing and sincere`, note: md`"Sparing" fits, but sincerity is a different quality and does not explain the "even".` },
        { id: 'D', text: md`effusive and public`, note: md`"Effusive" reverses the meaning, and "public" says nothing about how often she praises.` },
        { id: 'E', text: md`grudging and lavish`, note: md`These are opposites, so the two sentences would contradict each other.` },
      ],
      answer: 'A',
      workingMd: md`"Even" signals that her strong praise here is unusual, so she usually praises little. *Sparing* (giving little) and *grudging* (given reluctantly) both describe someone slow to praise, and give the same sentence.`,
      lesson: '"Even" marks something unexpected; the blank describes the usual behaviour that makes it unexpected.',
    },
    {
      id: 'check-admissions-change',
      title: 'Not a minor adjustment',
      topic: 'Sentence Equivalence',
      stemMd: md`The new policy is not a minor adjustment; it is a \_\_\_\_\_\_ change to the way the university admits students.

Choices: modest, radical, incremental, cosmetic, temporary, fundamental. Which pair completes the sentence with two sentences alike in meaning?`,
      options: [
        { id: 'A', text: md`modest and incremental`, note: md`These describe small changes, which the sentence has just ruled out with "not a minor adjustment".` },
        { id: 'B', text: md`fundamental and cosmetic`, note: md`"Cosmetic" means superficial, the opposite of fundamental; the two sentences would contradict each other.` },
        { id: 'C', text: md`incremental and temporary`, note: md`"Incremental" is small, and "temporary" is about duration, not size; neither matches the contrast.` },
        { id: 'D', text: md`radical and temporary`, note: md`"Radical" fits, but "temporary" makes a different claim about how long the change lasts.` },
        { id: 'E', text: md`radical and fundamental`, note: '' },
      ],
      answer: 'E',
      workingMd: md`The semicolon sets the blank against "not a minor adjustment", so the change is large and deep. *Radical* and *fundamental* both describe a change that reaches the basis of how admissions work.`,
      lesson: 'When a sentence rules out one degree ("not a minor"), the blank sits at the opposite end of the scale.',
    },
  ],
  takeaways: [
    'Predict direction, degree and tone, not direction alone.',
    'Degree words (only, mildly, utterly, nothing short of) and the strength of the evidence set the degree.',
    'A mild word and a strong word cannot pair: the sentences would not be alike.',
    'Watch for the wrong pair with the right direction at the wrong strength.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-sentence-equivalence', skill: 'se-meaning-of-completed-whole' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const sentenceEquivalenceUnit: Unit = {
  slug: 'sentence-equivalence',
  title: 'Sentence Equivalence',
  summary: 'Sentence Equivalence questions give one sentence with one blank and six choices, and ask for the two choices that complete it with sentences alike in meaning; both must be right to score. This unit teaches a method for finding the pair, how to tell true pairs from near misses, and how to match the tone and strength the sentence asks for.',
  lessons: [method, pairsAndNearMisses, toneAndIntensity],
};
