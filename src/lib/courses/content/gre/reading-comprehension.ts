import { md, type Lesson, type Unit } from '../../types';

/**
 * GRE Reading Comprehension. Every passage and argument in this file is
 * original, written for this course; none is adapted from ETS material or a
 * prep book. A passage shared by several checks is a constant, used as the
 * check's stimulusMd, or joined to an example's problem with +.
 */

const silentFilmPassage = md`Accounts of silent cinema often imagine a lone pianist improvising whatever came to mind. Surviving theatre records suggest a more organised trade. By the 1910s, film distributors in several countries circulated cue sheets that listed suggested pieces for each scene, and larger theatres employed music directors who assembled scores from libraries of catalogued mood pieces: agitated music for chases, mysterious music for villains, and so on. Yet the same records show how loosely these sheets were followed. Players in small towns, with limited libraries and a single rehearsal at most, substituted freely, and audiences seem to have expected the local organist's favourite tunes as much as anything the distributor proposed. The improvising pianist, then, is not a myth so much as half the picture: silent-film music was planned at the centre and remade at the edges.`;

const lichenPassage = md`For most of the twentieth century, ecologists treated the disappearance of lichens from city trees as a simple signal of sulphur dioxide pollution: where the gas was concentrated, sensitive species died, and only a few tolerant crusts survived. When sulphur emissions fell sharply in many European cities, this view predicted a steady return of the lost species. Some did return, but the communities that came back looked nothing like the ones that had disappeared. Species that thrive on nitrogen, once uncommon, now cover many urban trunks, while several species that tolerate neither sulphur nor nitrogen remain absent. The pattern suggests that lichens record not one pollutant but the balance among several. A tree covered in lichens is therefore not necessarily a sign of clean air; it may simply be a sign of air polluted in a different way.`;

const bookshopPassage = md`Economists who study retail often predict that small, independent shops cannot survive competition from large chains and online sellers, since the larger firms buy in bulk and so can charge less. In many towns, though, independent bookshops have proved more durable than this reasoning allows. One explanation is that such shops do not mainly sell books at all, at least not in the sense that a warehouse does. What they offer is selection: a buyer who trusts a shop's choices saves the time of sorting through thousands of titles alone. On this view the independent shop competes on judgement rather than on price, and the price advantage of large sellers matters less than the prediction assumes. The explanation has limits. It works for shops whose staff have a recognisable taste; a small shop that stocks the same best-sellers as everyone else has no judgement to sell, and such shops appear to be the ones that have struggled most.`;

const varnishPassage = md`When a painting's varnish yellows, restorers face a choice that is as much philosophical as technical. Removing the old varnish reveals colours close to those the painter applied, and for most of the last century this was regarded as the only honest course. A growing number of conservators now argue for restraint. They point out that pigments themselves change with age: some blues darken and some reds fade, so that a fully cleaned canvas may show not the painter's intended harmony but a new imbalance that no one chose. A thin layer of toned varnish, they suggest, can keep the faded and the darkened colours in something like their intended relation. Critics answer that such toning replaces the painter's judgement with the restorer's guess. The two sides agree on more than their dispute suggests, however: neither claims that any surface visible today is the one the painter saw.`;

const antSeedPassage = md`Many plant species produce seeds with a small fatty attachment that ants find attractive. An ant carries the seed back to its nest, the colony eats the attachment, and the seed itself, undamaged, is discarded in the nest's refuse chambers or just outside. Biologists first assumed that the plant's gain was distance: the seed ends up away from its parent. But ants rarely carry seeds more than a few metres, a trivial distance compared with that reached by seeds blown by the wind or eaten by birds. Two other benefits are now thought more important. Seeds buried in a nest are hidden from the rodents that eat seeds left on the surface, and nest refuse is often richer in nutrients than the surrounding soil. Neither benefit depends on how far the seed travels, which may explain why plants go on producing the attachment even though ants carry seeds such short distances.`;

const roadPassage = md`When a city adds a lane to a road to relieve congestion, travel times often improve at first and then drift back towards their old level within a few years. Transport researchers call this induced demand. The extra capacity makes driving cheaper in time, so people who previously travelled at other hours, by other routes or by other means begin to drive at peak hours, and some who did not make the trip at all now do. The effect is not universal. Where a road was congested because of a single bottleneck, such as a narrow bridge, widening that point can produce lasting gains, because the extra traffic it attracts is held back by limited capacity elsewhere on the network. Critics of road building sometimes overlook this distinction, but its practical reach is modest: most urban congestion, the researchers argue, is spread across whole networks rather than concentrated at single points.`;

const passageStructureLesson: Lesson = {
  slug: 'reading-passage-structure',
  title: 'Reading a passage for its structure',
  summary: 'Read each GRE passage for what its parts are doing, not for every fact, and build a quick map you can answer most questions from.',
  minutes: 18,
  objectives: [
    'Identify the views in a passage, whose they are, and where the author stands.',
    'Use signal words to find the turns that carry a passage’s structure.',
    'Build a short map of roles that answers structure and function questions without rereading.',
  ],
  teachMd: md`
### What the questions are built on

About half of the GRE Verbal Reasoning measure is based on passages. A passage can carry from one to six questions, and the subjects range across the physical and biological sciences, the social sciences, business, the arts and humanities, and everyday topics. You are not expected to know anything about the subject beforehand: every answer is supported by the text in front of you, and outside knowledge is more often a trap than a help.

The questions come in three formats: choose one answer from five; choose one or more of three answers (from one to all three can be correct, and there is no partial credit); and Select-in-Passage, where you choose the sentence in the passage that fits a description. Later lessons in this unit take each kind in turn. This lesson is about the reading that all of them depend on.

### Read for the shape, not the facts

A passage is short but dense, and trying to hold every detail in mind is how readers run out of time. You can always go back to find a fact: within a section you can move back and forth between questions and change answers. What you cannot look up is the thing most questions turn on: what each part of the passage is *doing*.

So as you read, ask of every paragraph (and, in a one-paragraph passage, of every few sentences):

- **What is the topic?** The subject the passage is about.
- **Whose view is this?** A passage often reports a view and then questions it. Note who holds each view: "historians", "critics", "the standard account", or the author.
- **Where does the author stand?** Agreement, rejection, qualification ("partly right"), or neutral description.
- **What job does this part do?** Introduce a view, give evidence, raise an objection, explain a cause, give an example, concede a point, draw a conclusion.

### Signal words carry the structure

Writers mark the turns of an argument with a small set of words. Reading them closely is the cheapest way to see the shape.

| Signal | What usually follows |
| --- | --- |
| however, yet, but, by contrast, nevertheless | a turn against what came before |
| therefore, thus, so, hence | a conclusion |
| because, since, for | a reason or evidence |
| for example, for instance, such as | an illustration of a claim already made |
| moreover, furthermore, also | more support of the same kind |
| admittedly, granted, to be sure | a concession before the author's real point |

A "yet" or "but" in the middle of a passage often marks the most important sentence: the one where the author turns from a reported view to the author's own.

### Common shapes

Most passages follow one of a handful of patterns. Recognising the pattern early tells you where the author's point will be.

| Shape | Where the author's point usually sits |
| --- | --- |
| An older view, then a challenge or refinement | after the turn ("but", "yet", "recent work suggests") |
| A puzzle, then possible explanations | in the explanation the author favours, if any |
| A claim, then evidence for it | in the opening claim |
| Two positions compared | in any judgement between them, or in what they share |
| A proposal, then its limits | in the qualification |

### Build a map as you go

A map is a few words for each paragraph or each turn. For a three-paragraph passage it might read: "P1 old view: X causes Y. P2 evidence against: Y without X. P3 author: X speeds Y up, does not start it." Building a map like this as you read answers most main-idea and function questions without rereading, and it tells you exactly where to look when a question asks about a detail.

Keep the map about roles, not data. "P2 evidence against" is useful; "P2: 1910s, three countries" is not, because if a question asks about the 1910s you will reread that sentence anyway.

### Read the question, then go back

After your first read, decide what kind of question each one is. A question about the passage as a whole ("primary purpose", "organisation") is answered from the map. A question about a sentence or a detail sends you back to that place: reread the sentence and the ones on either side of it, then answer in your own words before you look at the choices. Wrong choices are written to sound plausible, and an answer you formed first is the best defence against them.
`,
  examples: [
    {
      id: 'example-lichen-map',
      title: 'Mapping a one-paragraph passage',
      problemMd: lichenPassage + '\n\n' + md`Build a map of this passage, then name its shape.`,
      steps: [
        md`Find the topic and the first view. The topic is lichens on city trees. The opening sentence reports a view held by "ecologists" for most of the twentieth century: losing lichens signals sulphur dioxide pollution. The author has not yet taken a side. Map: "old view: lichens = SO2 signal".`,
        md`The next sentence draws a prediction from that view: when sulphur fell, the lost species should return. Map: "prediction: species come back".`,
        md`"Some did return, **but**…" is the turn. The evidence only partly fits the prediction, and the following sentence gives the details (nitrogen-loving species now common; some species still missing). Map: "evidence: partial, different return".`,
        md`"The pattern suggests" introduces the author's own conclusion: lichens record the balance of several pollutants. "Therefore" in the last sentence draws a consequence from it. Map: "author: balance of pollutants; so lichen cover ≠ clean air".`,
      ],
      answerMd: md`Map: old view, its prediction, evidence that partly fails the prediction, the author's refined view, a practical consequence. The shape is **an older view refined by new evidence**. The tempting description is "the passage rejects the older view"; it does not, because sulphur still matters in the author's account; it is one pollutant among several.`,
    },
    {
      id: 'example-lichen-function',
      title: 'What is the last sentence doing?',
      problemMd: md`In the lichen passage above, what is the function of the final sentence ("A tree covered in lichens is therefore not necessarily a sign of clean air…")?`,
      steps: [
        md`Locate the sentence and read the one before it. The previous sentence states the author's conclusion: lichens record the balance among several pollutants.`,
        md`Read the signal word. "Therefore" marks what follows as drawn from what came before, so the final sentence is a consequence, not new evidence.`,
        md`Say what the consequence is about: how to read a lichen-covered tree. It is a practical implication of the refined view.`,
        md`Test it against a tempting description: "it restates the twentieth-century view". The old view would say a lichen-covered tree means low sulphur, which comes close to "clean air"; the final sentence warns against exactly that reading.`,
      ],
      answerMd: md`The final sentence draws a practical implication of the author's refined view: plenty of lichens does not by itself show that the air is clean. It neither offers evidence nor restates the older view.`,
    },
  ],
  traps: [
    {
      title: 'Reading for every detail',
      md: md`Trying to remember every date, name and number makes the first read slow and leaves you no clearer about the structure. Details can be found again in seconds; the role of each part cannot. Read for roles and come back for details when a question asks for one.`,
    },
    {
      title: 'Taking a reported view for the author’s',
      md: md`Passages often open with what "critics", "economists" or "the usual account" say. A choice that matches that opening view will look supported by the passage, because the words are there. Before you accept it, ask whether the author agrees, or only reports the view in order to question it.`,
    },
    {
      title: 'Missing the turn',
      md: md`A single "yet", "but" or "however" can reverse the direction of a passage. Readers who skim past it end up attributing the first half's position to the whole. When you see a contrast word, stop and note in your map what has changed.`,
    },
    {
      title: 'Treating a refinement as a rejection',
      md: md`Many passages do not overturn an older view; they narrow it or add to it ("not a myth so much as half the picture"). Choices that say the author "refutes" or "dismisses" a view are wrong for such passages. Match the strength of the verb to the strength of the author's position.`,
    },
  ],
  check: [
    {
      id: 'check-silent-film-organisation',
      title: 'How the passage is organised',
      topic: 'Reading Comprehension',
      stimulusMd: silentFilmPassage,
      stemMd: md`Which of the following best describes the organisation of the passage?`,
      options: [
        { id: 'A', text: md`A popular image is described, evidence that complicates it is presented, that evidence is itself qualified, and a reconciling view is stated.`, note: '' },
        { id: 'B', text: md`A popular image is rejected outright and replaced by a contrary account.`, note: md`The author says the image is "not a myth so much as half the picture", which keeps part of it. "Rejected outright" is too strong.` },
        { id: 'C', text: md`Two scholarly theories are compared, and one is shown to be better supported.`, note: md`The opening view is a popular image, not a scholarly theory, and the passage ends by combining the two pictures rather than choosing one.` },
        { id: 'D', text: md`A historical practice is described, and the reasons for its decline are explained.`, note: md`Nothing in the passage describes a decline; the cue sheets and the local substitutions are presented as existing side by side.` },
        { id: 'E', text: md`A claim is made, and several examples are given that all support it.`, note: md`The evidence points both ways: the cue sheets suggest planning, and the small-town practice suggests improvisation. That tension is the passage's point.` },
      ],
      answer: 'A',
      workingMd: md`Map the passage: the popular image (a lone improvising pianist); evidence of an organised trade (cue sheets, music directors); "Yet" the sheets were loosely followed in small towns; conclusion: planned at the centre and remade at the edges. That is an image, complicating evidence, a qualification of that evidence, and a reconciling view.`,
      lesson: 'Count the turns: each "yet" or "but" adds a stage, and the right description of the organisation names every stage.',
    },
    {
      id: 'check-silent-film-function',
      title: 'The role of one sentence',
      topic: 'Reading Comprehension',
      stimulusMd: silentFilmPassage,
      stemMd: md`The sentence beginning "Yet the same records show" functions primarily to`,
      options: [
        { id: 'A', text: md`deny that distributors circulated cue sheets`, note: md`The sentence accepts that cue sheets existed; it says only that they were loosely followed.` },
        { id: 'B', text: md`explain why larger theatres employed music directors`, note: md`Music directors appear in the previous sentence, and no reason for employing them is given anywhere.` },
        { id: 'C', text: md`introduce evidence that limits how far the organised system actually governed what was played`, note: '' },
        { id: 'D', text: md`state the conclusion that the author draws from the theatre records`, note: md`The conclusion comes in the last sentence ("The improvising pianist, then…"). This sentence supplies part of the evidence for it.` },
        { id: 'E', text: md`give an example of the mood pieces kept in theatre music libraries`, note: md`The examples of mood pieces (music for chases, for villains) are in the previous sentence.` },
      ],
      answer: 'C',
      workingMd: md`The sentence opens with "Yet", so it turns against what came just before: the description of an organised system of cue sheets and catalogued scores. It says the sheets were loosely followed, and the next sentence gives the small-town evidence. Its job is to limit how far the organised system controlled the music, which sets up the reconciling conclusion.`,
      lesson: 'A sentence that starts with a contrast word usually limits or reverses the claim just before it; name that claim to name the function.',
    },
    {
      id: 'check-silent-film-attitude',
      title: 'The author on the popular image',
      topic: 'Reading Comprehension',
      stimulusMd: silentFilmPassage,
      stemMd: md`The author would most likely describe the image of a lone pianist improvising whatever came to mind as`,
      options: [
        { id: 'A', text: md`accurate for large theatres but not for small ones`, note: md`This reverses the passage: the large theatres had music directors and assembled scores, while the free substitution happened in small towns.` },
        { id: 'B', text: md`an invention of later writers with no basis in practice`, note: md`The author says the image is "not a myth", and the small-town evidence gives it a real basis.` },
        { id: 'C', text: md`confirmed by the cue sheets that distributors circulated`, note: md`The cue sheets are the evidence of planning, which is what makes the image incomplete; they do not confirm it.` },
        { id: 'D', text: md`partly accurate, but incomplete as an account of the whole trade`, note: '' },
        { id: 'E', text: md`accurate for the 1910s but not for later decades`, note: md`The passage makes no contrast between periods; the 1910s are mentioned only as the time when cue sheets circulated.` },
      ],
      answer: 'D',
      workingMd: md`The last sentence gives the author's judgement directly: the image "is not a myth so much as half the picture". Half the picture is partly accurate but incomplete, which is the choice that says so. The other half, the organised system, is what the image leaves out.`,
      lesson: 'When the author states a judgement in so many words, the right choice paraphrases it at the same strength.',
    },
  ],
  takeaways: [
    'Read for what each part of a passage does; come back for details when a question asks for them.',
    'Note whose view each claim is, and where the author stands on it.',
    'Contrast words mark the turns; the author’s own point usually comes after one.',
    'Answer in your own words before you read the choices.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-reading-comprehension', skill: 'rc-text-structure' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const mainIdeaLesson: Lesson = {
  slug: 'reading-main-idea-and-purpose',
  title: 'Main idea, primary purpose and the author’s attitude',
  summary: 'State a passage’s main idea in one sentence, match purpose choices verb first, and rule out choices that are too broad, too narrow or off in tone.',
  minutes: 18,
  objectives: [
    'Tell the topic, the main idea and the primary purpose of a passage apart.',
    'Choose a primary-purpose answer by testing its verb against the author’s stance, then its object against the whole passage.',
    'Recognise choices that are too broad, too narrow, distorted or wrong in tone.',
  ],
  teachMd: md`
### Three things that are easy to confuse

Questions about the passage as a whole come in a few wordings: "the main idea", "the primary purpose", "which title best fits", "the author's attitude". They ask for different things, and mixing them up is a common way to pick a choice that is true but not what was asked.

| Term | What it is | Example (a passage about independent bookshops) |
| --- | --- | --- |
| Topic | what the passage is about | independent bookshops |
| Main idea | what the author says about the topic, in one sentence | independent bookshops survive by selling judgement rather than low prices, but only if they have judgement to sell |
| Primary purpose | what the author is doing | to offer, and then limit, an explanation for something a standard prediction did not expect |

### Find the main idea from your map

The main idea is not usually the first sentence. In a passage that reports a view and then turns against it, the main idea sits after the turn. In a passage that proposes something and then limits it, the main idea includes the limit.

Write it as one sentence that the whole passage serves. Then test it: does every paragraph (or every stage of a one-paragraph passage) support, illustrate or qualify that sentence? If one stage is left over, the sentence is too narrow. If the sentence says more than any stage supports, it is too broad.

### Purpose choices: test the verb, then the object

Primary-purpose choices are almost always a verb and an object: "to *challenge* a common assumption about…", "to *describe* two approaches to…". Test the verb first, because it carries the author's stance, and a wrong stance rules a choice out at once.

| Verb family | Fits a passage where the author… |
| --- | --- |
| describe, outline, discuss, present | reports without taking a side |
| explain, account for | gives the causes of something |
| argue, defend, advocate | takes a side and supports it |
| challenge, question, dispute, refute | argues against a view ("refute" means show it false, which is strong) |
| qualify, refine, limit | accepts a view in part and narrows it |
| compare, contrast, evaluate | weighs two or more things |

A passage that lays out a debate even-handedly cannot have the purpose "to argue that one side is right". A passage that refines a view cannot have the purpose "to refute" it. Only after the verb survives should you check the object: is it the whole passage's subject, or only one paragraph's?

### The four ways a choice goes wrong

- **Too narrow:** it describes one paragraph or one example correctly but leaves out the rest. These are the hardest to reject, because everything in them is true.
- **Too broad:** it claims more than the passage covers ("the history of restoration" for a passage about one decision in restoration).
- **Distorted:** it uses the passage's own words but changes their relationship, for instance turning a cause into an effect, or one side's claim into the author's.
- **Wrong stance or tone:** the verb or an adjective is stronger or weaker than the author's position.

### Tone and attitude

The author's attitude shows in a few places: evaluative adjectives ("trivial", "apt", "honest"), hedges ("seems", "may", "suggests"), concessions ("admittedly"), and the way the last sentence lands. Academic writing is usually measured, so extreme attitude words ("contemptuous", "ecstatic", "outraged") rarely fit. A passage that presents two sides and then points out what they share is even-handed, even if it gives one side more space.

### The same method for one paragraph

"The second paragraph primarily serves to…" is a purpose question on a smaller scale. Use the paragraph's line in your map, test the verb, and make sure the object is about that paragraph's job in the whole passage, not about some detail inside it.
`,
  examples: [
    {
      id: 'example-bookshop-main-idea',
      title: 'Stating the main idea',
      problemMd: bookshopPassage + '\n\n' + md`State the main idea of this passage in one sentence.`,
      steps: [
        md`Map the stages. A prediction (independent shops cannot survive because big sellers are cheaper); a turn, "though" (independent bookshops have proved durable); an explanation (they sell selection, so they compete on judgement); a limit (it works only for shops with a recognisable taste).`,
        md`Find the author's position. The author offers the explanation ("One explanation is…", "On this view…") and then limits it ("The explanation has limits"). Both belong in the main idea.`,
        md`Draft the sentence and test it against each stage: "Independent bookshops can outlast cheaper rivals by selling trusted judgement rather than low prices, but only when they actually have a distinctive selection." The prediction is what this answers, the explanation is its core, and the limit is its second half. Nothing is left over.`,
      ],
      answerMd: md`Main idea: independent bookshops can survive cheaper competitors by selling judgement rather than price, an explanation that holds only for shops with a distinctive selection. The tempting answer "small shops cannot compete with large sellers on price" is the prediction the passage pushes against, not its point.`,
    },
    {
      id: 'example-bookshop-purpose',
      title: 'Choosing a primary purpose, verb first',
      problemMd: md`For the bookshop passage above, which of these best states the primary purpose?

1. to argue that economists' predictions about retail are generally unreliable
2. to describe how independent bookshops choose which titles to stock
3. to propose an explanation for an outcome a common prediction did not expect, and to note where that explanation stops applying
4. to defend large online sellers against the charge of unfair competition
5. to compare the prices charged by independent and chain bookshops`,
      steps: [
        md`Test the verbs. The author offers an explanation and then limits it, without attacking anyone. "Argue that… generally unreliable" is far stronger than the passage, which questions one prediction about one kind of shop. "Defend" takes a side the passage never takes.`,
        md`Test the objects of what remains. "Describe how bookshops choose titles" is too narrow and not even in the passage: it says shops sell judgement, not how they exercise it. "Compare the prices" picks up one premise (big sellers charge less) and nothing else.`,
        md`The remaining choice, "to propose an explanation… and to note where that explanation stops applying", covers the prediction, the explanation and the limit, with a verb that matches the author's stance.`,
      ],
      answerMd: md`The third choice: to propose an explanation for an unexpected outcome and to note its limits. The most tempting wrong choice is the first, because the passage does push against an economists' prediction; but it questions one prediction, not economists' predictions in general.`,
    },
  ],
  traps: [
    {
      title: 'The true but narrow choice',
      md: md`A choice that accurately describes one paragraph feels safe because nothing in it is false. Ask whether it covers the whole passage. If a stage of your map is missing from it, it describes a part, not the purpose.`,
    },
    {
      title: 'The verb that is too strong',
      md: md`"Refute", "dismiss" and "prove" claim more than most passages do. If the author concedes anything, hedges ("seems", "may"), or keeps part of the view under discussion, a strong verb is wrong however well its object fits.`,
    },
    {
      title: 'Giving one side’s view to the author',
      md: md`In a passage that reports a debate, each side's claims are in the text, so a choice that states one of them looks supported. Check who says it. If the author only reports it, the choice is not the main idea.`,
    },
    {
      title: 'Reading tone from the topic',
      md: md`A passage about a disaster is not therefore "alarmed", and a passage about art is not therefore "admiring". Tone comes from the author's words about the subject, not from the subject.`,
    },
  ],
  check: [
    {
      id: 'check-varnish-purpose',
      title: 'Primary purpose',
      topic: 'Reading Comprehension',
      stimulusMd: varnishPassage,
      stemMd: md`The primary purpose of the passage is to`,
      options: [
        { id: 'A', text: md`argue that old varnish should never be removed from paintings`, note: md`The author reports the case for restraint but does not adopt it, and even the restraint camp proposes only a thin layer of toned varnish, not a rule that old varnish should never be removed.` },
        { id: 'B', text: md`explain the chemical reasons that varnish yellows with age`, note: md`Yellowing is the starting point, but its causes are never discussed.` },
        { id: 'C', text: md`trace the history of painting restoration over the last century`, note: md`Too broad. The last century is mentioned once, as the period when full cleaning was the norm; the passage is about one decision, not a history.` },
        { id: 'D', text: md`defend the conservators who favour restraint against their critics`, note: md`The critics' objection is given without rebuttal, and the final sentence finds common ground; the author defends neither side.` },
        { id: 'E', text: md`present a disagreement about cleaning paintings and point out an assumption both sides share`, note: '' },
      ],
      answer: 'E',
      workingMd: md`The map: the choice restorers face; the older view (remove all varnish); the restraint view (pigments change, so toned varnish keeps their relation); the critics' reply; then "however", what both sides agree on. The author takes no side, so the verb must be neutral ("present"), and the object must include the shared assumption that the last sentence adds. Only the choice that presents the disagreement and the shared assumption fits both tests.`,
      lesson: 'When a passage ends by finding common ground between two sides, the purpose includes that common ground and the verb stays neutral.',
    },
    {
      id: 'check-varnish-main-idea',
      title: 'Main idea',
      topic: 'Reading Comprehension',
      stimulusMd: varnishPassage,
      stemMd: md`Which of the following best states the main idea of the passage?`,
      options: [
        { id: 'A', text: md`A fully cleaned painting shows the colours its painter intended.`, note: md`The restraint camp denies this, since pigments change with age, and the last sentence says that neither side claims any surface visible today is the one the painter saw.` },
        { id: 'B', text: md`Restorers have stopped removing yellowed varnish from paintings.`, note: md`"A growing number" of conservators favour restraint; that is not all restorers, and the passage does not say the practice has stopped.` },
        { id: 'C', text: md`The dispute over varnish is a dispute about how best to approximate an original appearance that both sides accept can no longer be seen.`, note: '' },
        { id: 'D', text: md`Toned varnish is the most reliable way to preserve a painting’s colours.`, note: md`This is one side's claim, and the passage reports the critics' objection to it without settling the matter.` },
        { id: 'E', text: md`Pigments that darken with age are more common than pigments that fade.`, note: md`The passage says some blues darken and some reds fade; it compares neither their frequency nor their importance.` },
      ],
      answer: 'C',
      workingMd: md`Both positions aim at the painter's intended appearance by different means: full cleaning shows the original pigments, toning tries to keep their original relation. The final sentence adds that neither side thinks today's surface is the one the painter saw. The main idea joins these: the dispute is about how best to approximate an appearance both sides agree is lost.`,
      lesson: 'A main idea must cover the passage’s last move as well as its first; check that your choice includes the turn at the end.',
    },
    {
      id: 'check-varnish-attitude',
      title: 'The author’s attitude',
      topic: 'Reading Comprehension',
      stimulusMd: varnishPassage,
      stemMd: md`The author's attitude towards the two positions on varnish is best described as`,
      options: [
        { id: 'A', text: md`dismissive of both`, note: md`The author treats both positions as serious; the closing remark finds agreement between them rather than fault with them.` },
        { id: 'B', text: md`strongly in favour of restraint`, note: md`The case for restraint gets more space, but the critics' reply is given the last word in the debate, and the author endorses neither.` },
        { id: 'C', text: md`sceptical of the critics’ motives`, note: md`The critics' argument is reported, but nothing is said about their motives.` },
        { id: 'D', text: md`even-handed`, note: '' },
        { id: 'E', text: md`nostalgic for the practice of full cleaning`, note: md`Full cleaning is described as the older norm, with no sign that the author regrets its loss.` },
      ],
      answer: 'D',
      workingMd: md`The author reports each position in its own terms ("they point out", "they suggest", "critics answer"), adds no evaluative words for either, and ends by noting what both sides share. That is an even-handed treatment.`,
      lesson: 'Reporting verbs with no evaluation, plus a closing note on common ground, mark an even-handed author.',
    },
  ],
  takeaways: [
    'Topic is what the passage is about; the main idea is what it says; the purpose is what it does.',
    'Test a purpose choice verb first: the verb must match the author’s stance.',
    'Reject choices that are too narrow, too broad, distorted, or wrong in tone.',
    'A main idea must account for the whole passage, including its last turn.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-reading-comprehension', skill: 'rc-summarize-passage' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const detailInferenceLesson: Lesson = {
  slug: 'reading-detail-and-inference',
  title: 'Detail and inference questions',
  summary: 'Answer detail questions by going back to the text, and inference questions by taking the smallest step the passage forces, never a step it only allows.',
  minutes: 20,
  objectives: [
    'Locate the sentence a detail question depends on and match a paraphrase of it.',
    'Tell what a passage requires from what it merely leaves open.',
    'Reject inference choices that are too strong, out of scope or reversed.',
  ],
  teachMd: md`
### Two kinds of question about the text

**Detail questions** ask what the passage says: "According to the passage…", "The passage states that…", "The author mentions X in order to…". The answer is in a particular sentence, usually in different words.

**Inference questions** ask what follows from what the passage says: "It can be inferred that…", "The passage suggests…", "The passage most strongly supports which statement…". The answer is not written in the passage, but the passage leaves no reasonable doubt about it.

The two need the same discipline: the answer must be supported by the text, not by what you know or what sounds reasonable.

### Detail questions: go back every time

The words of a detail question point to a place in the passage. Go there, and reread the sentence that answers the question along with the sentences on either side, since the reason or qualification you need is often next door. Then put the answer in your own words before you read the choices.

The right choice is usually a paraphrase. A choice that repeats the passage's exact words is not necessarily right: wrong choices often borrow a phrase and attach it to the wrong claim. Read for meaning, not for matching words.

### Inference: the smallest step

An inference on the GRE is not a guess about what the author might think. It is a statement that must be true, or is very strongly supported, given what the passage says. The right choice is usually modest: it takes one short step from the text, such as combining two sentences, or noticing what a contrast implies about the other side.

Ask of each choice:

1. **Can I point to the sentences that support it?** If you cannot, it is out.
2. **Does the passage force it, or only allow it?** "Some species did return" allows that most did, but does not force it. A choice that depends on "most" is out.
3. **Is it as strong as the text, and no stronger?** Words like *always*, *only*, *never*, *all* and *must* need the same strength in the passage.

### How wrong inference choices are built

| Kind | What it does | Example against "ants rarely carry seeds more than a few metres" |
| --- | --- | --- |
| Too strong | turns "often" into "always", "some" into "most" | "Ants never carry seeds more than a few metres." |
| Out of scope | brings in something the passage does not discuss | "Seeds carried by birds germinate more often." |
| Reversed | swaps cause and effect, or the two sides of a comparison | "The attachment exists because ants carry seeds short distances." |
| True in the world, not in the passage | relies on outside knowledge | anything you know about ants that the passage does not say |
| Half right | one clause is supported, the other is not | a choice that is right about rodents and wrong about soil |

A half-right choice is wrong. Read every clause of a choice before you accept it.

### Contrasts imply their other side

Many inferences come from contrasts. If the passage says a benefit "does not depend on how far the seed travels", you can infer that the benefit would remain even if ants carried seeds a very short distance. If it says a solution works "where a road was congested because of a single bottleneck", you can infer that the passage does not expect the same result where there is no single bottleneck. Asking "what does this contrast tell me about the other case?" is one of the most reliable ways to find the supported choice.

### "The author mentions X in order to…"

This is a detail question about function. Find X, then ask what claim X supports or illustrates. The answer names that claim's role, not a fact about X itself. For example, the distances reached by wind-blown seeds are mentioned to show that the distance ants manage is trivial, not to teach anything about wind.
`,
  examples: [
    {
      id: 'example-ant-detail',
      title: 'A detail question',
      problemMd: antSeedPassage + '\n\n' + md`According to the passage, why did biologists come to doubt that distance is the main benefit to the plant?`,
      steps: [
        md`The question points to the sentences about distance. Find the first view ("Biologists first assumed that the plant's gain was distance") and read on.`,
        md`The next sentence begins with "But", the turn: ants rarely carry seeds more than a few metres, a trivial distance compared with wind and bird dispersal.`,
        md`Answer in your own words: because the distances ants achieve are tiny compared with other ways seeds travel.`,
      ],
      answerMd: md`Because ants carry seeds only a few metres, which is trivial next to the distances that wind or birds achieve. A tempting wrong answer is "because seeds are hidden from rodents": that is one of the benefits now thought more important, not the reason distance was doubted.`,
    },
    {
      id: 'example-ant-inference',
      title: 'An inference question',
      problemMd: md`Using the same passage, which statement can be inferred?

1. Plants whose seeds are carried by ants produce more seeds than other plants.
2. If ants left seeds on the surface far from any nest, the plant would lose at least one of the benefits the passage calls most important.
3. Ants eat the seeds they carry when food is scarce.`,
      steps: [
        md`Statement 1: the passage says nothing about how many seeds such plants produce. Out of scope.`,
        md`Statement 2: one of the two important benefits is that seeds **buried in a nest** are hidden from rodents that eat seeds left on the surface. A seed left on the surface far from a nest would not have that protection. The statement follows in one step and says only "at least one", which is as strong as the text allows.`,
        md`Statement 3: the passage says the seed is discarded "undamaged". Nothing is said about scarcity, and the claim runs against the text.`,
      ],
      answerMd: md`Only the second statement can be inferred. Note how modest it is: it does not claim the plant would gain nothing, only that it would lose the rodent protection, and possibly the nutrient benefit too.`,
    },
  ],
  traps: [
    {
      title: 'Answering from memory',
      md: md`After one read, it is tempting to answer a detail question from what you remember. Memory blends nearby sentences, and wrong choices are built from those blends. Go back to the sentence every time; it takes seconds.`,
    },
    {
      title: 'The choice that copies the passage’s words',
      md: md`Exact wording from the passage is not a sign of a right answer. Wrong choices often lift a phrase from one sentence and attach it to a claim from another. Check that the meaning, not just the vocabulary, matches.`,
    },
    {
      title: 'Inferring what is only possible',
      md: md`A passage that says "some species returned" leaves open whether most did. A choice that is consistent with the passage is not therefore inferred. Ask whether the passage would be contradicted if the choice were false; if not, the choice is not an inference.`,
    },
    {
      title: 'Half-right choices',
      md: md`A choice with two clauses, one supported and one not, is wrong. Readers who nod at the first clause often stop reading. Check every clause.`,
    },
  ],
  check: [
    {
      id: 'check-road-detail',
      title: 'Why a bottleneck is different',
      topic: 'Reading Comprehension',
      stimulusMd: roadPassage,
      stemMd: md`According to the passage, widening a single bottleneck can produce lasting gains because`,
      options: [
        { id: 'A', text: md`bottlenecks are usually found on bridges`, note: md`A narrow bridge is given only as an example of a bottleneck; the passage does not say most bottlenecks are bridges, and that would not explain the gains anyway.` },
        { id: 'B', text: md`drivers do not change their habits when a bottleneck is removed`, note: md`The passage says widening a bottleneck does attract extra traffic; the point is that the traffic is limited elsewhere, not that habits stay the same.` },
        { id: 'C', text: md`induced demand does not occur on roads that cross bridges`, note: md`Nothing says induced demand is absent; the passage says the traffic it brings is held back by capacity elsewhere.` },
        { id: 'D', text: md`most urban congestion is concentrated at single points`, note: md`This reverses the researchers' claim, which is that most congestion is spread across networks.` },
        { id: 'E', text: md`the extra traffic it attracts is limited by the capacity of other parts of the network`, note: '' },
      ],
      answer: 'E',
      workingMd: md`The sentence about bottlenecks gives the reason after "because": "the extra traffic it attracts is held back by limited capacity elsewhere on the network". The right choice paraphrases exactly that.`,
      lesson: 'In a detail question, find the "because" in the passage; the answer is its paraphrase.',
    },
    {
      id: 'check-road-author-view',
      title: 'How the author weighs the critics’ oversight',
      topic: 'Reading Comprehension',
      stimulusMd: roadPassage,
      stemMd: md`It can be inferred that the author regards the critics' failure to distinguish bottlenecks from other congestion as`,
      options: [
        { id: 'A', text: md`the main reason that road-building schemes fail`, note: md`The passage explains failing schemes by induced demand, not by anything the critics do.` },
        { id: 'B', text: md`a deliberate misrepresentation of the research`, note: md`"Overlook" describes an oversight, not deliberate misrepresentation.` },
        { id: 'C', text: md`a real error, but one that matters for relatively few urban roads`, note: '' },
        { id: 'D', text: md`an error that undermines the theory of induced demand`, note: md`The bottleneck case is an exception the theory itself explains, through capacity elsewhere; it does not undermine the theory.` },
        { id: 'E', text: md`a correct judgement that the researchers wrongly dispute`, note: md`The author says the critics "overlook" the distinction, which treats it as a real distinction they miss, not as their correct judgement.` },
      ],
      answer: 'C',
      workingMd: md`"Overlook" shows the author thinks the critics miss a real distinction, so it is an error. "Its practical reach is modest", followed by the claim that most congestion is spread across networks, shows that the exception covers few cases. Together: a real error that matters for relatively few roads.`,
      lesson: 'An inference about the author’s view combines the author’s own evaluative words; here "overlook" gives the error and "modest" gives its size.',
    },
    {
      id: 'check-road-network',
      title: 'Applying the passage to a new case',
      topic: 'Reading Comprehension',
      stimulusMd: roadPassage,
      stemMd: md`The passage most strongly supports which of the following about adding a lane to a congested urban road where the congestion is spread across the whole network rather than caused by a single bottleneck?`,
      options: [
        { id: 'A', text: md`Travel times would likely improve at first and then drift back towards their earlier level.`, note: '' },
        { id: 'B', text: md`Travel times would fall permanently.`, note: md`Lasting gains are what the passage expects only at a single bottleneck; this case is the opposite one.` },
        { id: 'C', text: md`Travel times would immediately become worse than before.`, note: md`The passage says travel times improve at first; nothing suggests an immediate worsening.` },
        { id: 'D', text: md`Fewer trips would be made on the road at peak hours.`, note: md`This reverses induced demand: the new capacity draws more people to drive at peak hours.` },
        { id: 'E', text: md`People would no longer change the times at which they travel.`, note: md`The passage says people who travelled at other hours start to drive at peak hours, so travel times do change.` },
      ],
      answer: 'A',
      workingMd: md`The general pattern of induced demand is stated in the first sentence: improvement at first, then a drift back. The only exception the passage names is the single bottleneck, and the case in the stem is explicitly not that. So the general pattern applies.`,
      lesson: 'When a passage states a rule and one exception, a case outside the exception falls under the rule.',
    },
  ],
  takeaways: [
    'Detail answers are paraphrases of a sentence you have just reread.',
    'An inference must be forced by the passage, not merely allowed by it.',
    'Match the strength of a choice to the strength of the text; reject half-right choices.',
    'Contrasts and exceptions tell you what the passage implies about the other case.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-reading-comprehension', skill: 'rc-draw-conclusions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const pricingPassage = md`Many shops price goods at amounts just below a round number, such as 9.99 rather than 10.00. The usual explanation is that shoppers read prices from left to right and give too much weight to the first digit, so that 9.99 feels closer to 9 than to 10. Experiments broadly support this left-digit effect, but they also find it weaker for expensive purchases, where buyers tend to compare prices more carefully. A second explanation does not depend on any misreading. A price ending in nines may simply signal that an item is discounted or that the shop competes on price, and shoppers who have learned this association respond to the signal rather than to the number itself. The two explanations make different predictions: if the signal account is right, a shop known for luxury goods should gain little from such prices, whatever their first digit.`;

const translationPassage = md`**(1)** Translators of poetry are often told that they must choose between sense and sound: either keep what the lines say or keep how they sing. **(2)** The choice is real but narrower than it seems. **(3)** Rhyme and metre are rarely the whole of a poem's music; repeated vowels, the length of phrases and the placing of stressed words often matter as much, and these can usually be carried into another language without bending the meaning. **(4)** What resists translation is the coincidence of sense and sound, as when a line's meaning depends on two words that happen to sound alike in the original. **(5)** Here no strategy saves both, and a translator who claims otherwise has usually given up one without saying so.`;

const glacierPassage = md`Glaciers are often described as rivers of ice, and the comparison is apt in one respect: both move downhill under gravity. In other respects it misleads. A river's speed depends mainly on the slope of its bed and the depth of its water, whereas a glacier moves partly by the slow deformation of the ice itself and partly by sliding over its bed, and the second process can change abruptly. When meltwater reaches the base of a glacier, it can lift the ice slightly from the rock and let it slide many times faster than before, even where the slope has not changed.`;

const selectFormatsLesson: Lesson = {
  slug: 'reading-select-in-passage-and-multiple-answer',
  title: 'Select-in-Passage and select-one-or-more questions',
  summary: 'Judge each choice of a select-one-or-more question on its own, and find a Select-in-Passage sentence by turning the description into a test.',
  minutes: 18,
  objectives: [
    'Decide each choice of a select-one-or-more question independently, with no assumption about how many are right.',
    'Turn a Select-in-Passage description into a test and apply it to each candidate sentence.',
    'Avoid the near-miss sentence that fits half of a description.',
  ],
  teachMd: md`
### Two formats that change how you answer

Most reading questions ask you to choose one answer from five. Two other formats work differently, and the usual habit of looking for the single best choice fails on both.

- **Select one or more answer choices.** Three choices are given, and anywhere from one to all three can be correct. You must select every correct choice and no incorrect one; there is no partial credit.
- **Select-in-Passage.** Instead of choices, you are asked to select the sentence in the passage that fits a description, such as "the sentence that presents evidence against the author's own view".

### Select one or more: three true-or-false questions

Treat each of the three choices as its own true-or-false question against the passage. Do not compare them with each other, and do not decide in advance how many will be right. A format that allows one, two or three correct choices gives you no information about the number in any particular question.

For each choice, apply the same tests as for any detail or inference question:

1. Find the sentence that supports it, or that it contradicts.
2. Check its strength: "some" in the passage does not support "most" in the choice.
3. Check every clause: a choice that is half supported is not supported.

Because there is no partial credit, one wrong decision costs the whole question. That is a reason to be equally careful with the choice you like least: the classic loss is to find two good choices, feel finished, and skim the third.

**How the checks in this course show this format.** A check here has one key, so a select-one-or-more question appears with its three statements numbered I, II and III, and the options list combinations ("I and III only"). Decide each statement on its own first, then pick the combination; do not work backwards from the combinations.

### Select-in-Passage: turn the description into a test

The description in the question is precise, and every word of it is a condition. "The sentence in which the author **concedes** a point to the opposing view" requires a sentence that (a) gives ground, (b) to the opposing view, (c) in the author's own voice. Write the conditions down or hold them clearly in mind, then go through the candidate sentences one at a time.

Most sentences fail quickly. The ones that remain usually fail one condition each, and that is where the question is decided:

| Description asks for | Near-miss to watch for |
| --- | --- |
| evidence for a claim | the claim itself |
| the author's conclusion | a view the author reports and then questions |
| an example of something that works | an example of something that fails |
| the cause of an effect | a consequence of the effect |
| what cannot be done | the result of trying to do it |

Signal words help here as they do in mapping: "therefore" tends to open a conclusion, "for example" an illustration, "but" or "yet" a turn.

### Pace

Select-in-Passage questions can take time if you reread the whole passage for each one. Your map tells you which paragraph to search; start there. For select-one-or-more questions, the time goes on the third choice, which is exactly where it should go.
`,
  examples: [
    {
      id: 'example-pricing-multiple',
      title: 'Three choices, judged one by one',
      problemMd: pricingPassage + '\n\n' + md`Which of the following does the passage indicate about the left-digit effect? Consider each choice separately and select all that apply.

- I. It has received some experimental support.
- II. It is weaker for expensive purchases than for cheaper ones.
- III. It explains why shops known for luxury goods gain little from prices ending in nines.`,
      steps: [
        md`Statement I: "Experiments broadly support this left-digit effect." Supported.`,
        md`Statement II: the experiments "find it weaker for expensive purchases". The comparison with cheaper purchases is what "weaker for expensive purchases" means. Supported.`,
        md`Statement III: luxury shops appear only in the last sentence, as a prediction of the **signal** account, not the left-digit account. The passage does not say luxury shops actually gain little, and it does not tie this to the left-digit effect. Not supported.`,
        md`Only after deciding each statement, combine: I and II.`,
      ],
      answerMd: md`I and II only. Statement III is the trap: it mentions something from the passage, but attaches it to the wrong explanation and turns a prediction into a fact.`,
    },
    {
      id: 'example-pricing-select-sentence',
      title: 'Finding a sentence from its description',
      problemMd: md`In the pricing passage above, select the sentence that states how the two explanations could be told apart.`,
      steps: [
        md`Turn the description into conditions: the sentence must (a) involve both explanations and (b) say something that would distinguish them.`,
        md`The opening sentence names no explanation. The left-digit sentence and the sentence on experiments deal only with the first explanation, and the sentence beginning "A price ending in nines" deals only with the second: all fail condition (a). The sentence "A second explanation does not depend on any misreading" sets the second against the first, so it meets (a), but it gives no way to tell them apart, so it fails (b).`,
        md`The last sentence names both ("The two explanations make different predictions") and gives the distinguishing case: luxury shops should gain little if the signal account is right. Both conditions hold.`,
      ],
      answerMd: md`The last sentence, beginning "The two explanations make different predictions". The near-miss is "A second explanation does not depend on any misreading", which does contrast the two accounts but does not say how one could tell which is right.`,
    },
  ],
  traps: [
    {
      title: 'Deciding how many are right before reading',
      md: md`Expecting two correct choices (or one) makes readers bend their judgement of the last choice to fit. Each choice stands or falls on the passage alone; one, two or three can be right.`,
    },
    {
      title: 'Stopping after the choices you like',
      md: md`With no partial credit, the choice you check least carefully decides the question. Give the third choice the same reread you gave the first.`,
    },
    {
      title: 'The sentence that fits half the description',
      md: md`In Select-in-Passage questions, the wrong sentences that remain after a first pass usually meet every condition but one. List the conditions and check each, especially whose voice the sentence is in and whether it gives evidence or the claim itself.`,
    },
  ],
  check: [
    {
      id: 'check-translation-select-sentence',
      title: 'Select-in-Passage',
      topic: 'Reading Comprehension: Select-in-Passage',
      stimulusMd: translationPassage,
      stemMd: md`Select the sentence in which the author identifies what, in the author's view, genuinely resists translation.`,
      options: [
        { id: 'A', text: md`Sentence (1)`, note: md`This reports what translators "are often told", a view the author goes on to narrow, not the author's own identification of anything.` },
        { id: 'B', text: md`Sentence (2)`, note: md`This says the choice is narrower than it seems but does not yet say what lies inside the narrower choice.` },
        { id: 'C', text: md`Sentence (3)`, note: md`This names features that **can** be carried into another language, the opposite of what is asked.` },
        { id: 'D', text: md`Sentence (4)`, note: '' },
        { id: 'E', text: md`Sentence (5)`, note: md`This states the consequence ("no strategy saves both") of the case already identified; "Here" points back to the sentence that names it.` },
      ],
      answer: 'D',
      workingMd: md`Conditions: the sentence must (a) be the author's view and (b) name what cannot be translated. Sentence (4) begins "What resists translation is the coincidence of sense and sound" and illustrates it with words that sound alike. Sentence (5) depends on it ("Here") and gives a consequence, and sentence (3) names what can be translated.`,
      lesson: 'Between a sentence that names something and the next sentence that comments on it, the description decides which you need; "Here" and "this" point back to the naming sentence.',
    },
    {
      id: 'check-translation-multiple',
      title: 'Select one or more',
      topic: 'Reading Comprehension: select one or more answer choices',
      stimulusMd: translationPassage,
      stemMd: md`Which of the following can be inferred about the author's view? Consider each statement separately.

- I. Some features of a poem's sound can survive translation with its meaning intact.
- II. Translators should usually keep a poem's sense rather than its sound.
- III. A translation that claims to keep both the sense and the sound of a line that turns on similar-sounding words is probably hiding a loss.`,
      options: [
        { id: 'A', text: md`I only`, note: md`Statement III also follows: sentence (5) says a translator who claims to save both has usually given one up without saying so.` },
        { id: 'B', text: md`III only`, note: md`Statement I also follows: sentence (3) says repeated vowels, phrase length and stress can usually be carried over without bending the meaning.` },
        { id: 'C', text: md`I and II only`, note: md`Statement II is not supported: the author never says which of sense and sound to prefer, only where the choice is unavoidable.` },
        { id: 'D', text: md`I and III only`, note: '' },
        { id: 'E', text: md`I, II and III`, note: md`Statement II has no basis in the passage, which recommends neither sense nor sound.` },
      ],
      answer: 'D',
      workingMd: md`Statement I: sentence (3) says vowel repetition, phrase length and stress placement "can usually be carried into another language without bending the meaning". Supported. Statement II: the author narrows the choice but never says how to make it. Not supported. Statement III: sentences (4) and (5) say that where meaning depends on similar-sounding words no strategy saves both, and a translator who claims otherwise "has usually given up one without saying so". Supported. So I and III.`,
      lesson: 'Decide each statement from its own sentence in the passage; a statement about what the author recommends needs a recommendation in the text.',
    },
    {
      id: 'check-glacier-multiple',
      title: 'Select one or more',
      topic: 'Reading Comprehension: select one or more answer choices',
      stimulusMd: glacierPassage,
      stemMd: md`Based on the passage, which of the following statements are true? Consider each statement separately.

- I. A glacier's speed can increase without any change in the slope beneath it.
- II. Rivers and glaciers both move downhill under the influence of gravity.
- III. The deformation of the ice changes more abruptly than the glacier's sliding over its bed.`,
      options: [
        { id: 'A', text: md`I only`, note: md`Statement II is stated directly in the first sentence: both move downhill under gravity.` },
        { id: 'B', text: md`I and II only`, note: '' },
        { id: 'C', text: md`I and III only`, note: md`Statement III reverses the passage: it is sliding, "the second process", that can change abruptly.` },
        { id: 'D', text: md`II and III only`, note: md`Statement I is supported by the last sentence, and statement III reverses which process changes abruptly.` },
        { id: 'E', text: md`I, II and III`, note: md`Statement III swaps the two processes; the passage says sliding, not deformation, can change abruptly.` },
      ],
      answer: 'B',
      workingMd: md`Statement I: meltwater can make the ice slide many times faster "even where the slope has not changed". True. Statement II: the comparison is "apt in one respect: both move downhill under gravity". True. Statement III: the glacier moves by deformation and by sliding, "and the second process can change abruptly"; the second process is sliding, so the statement reverses it. False.`,
      lesson: 'With "the first" and "the second" in a passage, work out exactly which is which before judging a statement that names them.',
    },
  ],
  takeaways: [
    'In select-one-or-more questions, judge each choice on its own; any number from one to three can be right.',
    'There is no partial credit, so the last choice deserves as much care as the first.',
    'For Select-in-Passage, list every condition in the description and test each sentence against all of them.',
    'The surviving wrong sentence usually fails exactly one condition: find it.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-reading-comprehension', skill: 'rc-paragraph-text-meaning' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const argumentLesson: Lesson = {
  slug: 'reading-argument-passages',
  title: 'Argument passages: conclusions, assumptions and flaws',
  summary: 'Break a short argument into conclusion and evidence, find the unstated assumption that links them, and name the flaw when the link fails.',
  minutes: 20,
  objectives: [
    'Separate an argument’s conclusion from its evidence, using indicator words and the "why?" test.',
    'Find the assumption an argument depends on, and confirm it with the negation test.',
    'Recognise the common gaps between evidence and conclusion and describe them as flaws.',
  ],
  teachMd: md`
### Arguments inside passages

Whether a passage is several paragraphs or a single short one, it often contains an argument: a claim supported by reasons. Some questions about it ask you to find the claim; others ask what the reasoning takes for granted, or where it goes wrong. These questions reward a different kind of reading from summarising: you are reading to find the weak joint.

### Conclusion and evidence

The **conclusion** is the claim the author wants you to accept. The **evidence** (premises) is what is offered as the reason to accept it. Indicator words help:

| Before a conclusion | Before evidence |
| --- | --- |
| therefore, thus, so, hence, consequently, clearly, it follows that | because, since, for, given that, as shown by |

When there are no indicators, use the **"why?" test**. Take a candidate conclusion and ask "why should I believe that?" If the other sentences answer it, you have the conclusion. If the candidate itself answers "why?" for another sentence, it is evidence.

The conclusion is not always last. It can come first ("Clearly, the policy failed: …") or in the middle, and an argument can open with a view it is about to reject, as in "Some economists claim… Yet…". In that case the view reported first is not the conclusion; the author's answer to it is.

### Assumptions: the missing link

An **assumption** is something the argument needs but does not state. It sits in the gap between the evidence and the conclusion. To find it, put the two side by side and ask: what new idea appears in the conclusion that the evidence does not mention? The assumption connects the two.

For example: "Residents of tree-lined streets report fewer heat-related illnesses than other residents, so planting trees reduces heat-related illness." The evidence is a difference between two groups; the conclusion says trees cause it. The assumption is that nothing else about the tree-lined streets explains the difference.

**The negation test** confirms an assumption. Negate the candidate and see whether the argument falls apart. "The tree-lined streets do **not** differ from others in any other relevant way" → negated: "the tree-lined streets are also wealthier, with more air-conditioned homes". Now the evidence no longer supports the conclusion, so the original statement was a necessary assumption. If the argument survives the negation, the candidate was not needed.

### The usual gaps

Most flawed arguments make one of a few moves. Learning them by name lets you spot them fast.

| Gap | The move | What it ignores |
| --- | --- | --- |
| Correlation to cause | A and B go together, so A causes B | a third factor; B causing A; coincidence |
| Sequence to cause | B followed A, so A caused B | anything else that changed at the same time |
| Unrepresentative sample | a group's view is taken as everyone's | that the group was chosen in a way that skews it |
| Past to future | what held before will hold again | changed conditions |
| Shifting term | a word means one thing in the evidence and another in the conclusion | that the evidence supports only the first meaning |
| Ruling out too little | one alternative is dismissed, so the favoured one must be true | other alternatives |

### Describing a flaw

Flaw choices are written abstractly: "takes for granted that…", "fails to consider the possibility that…", "treats a correlation as proof of causation". Translate each into the argument's own terms before judging it. A choice may describe a real logical error that this argument does not commit; it must fit **this** argument. Name the gap yourself first, in plain words, and then look for the choice that describes it.

### A routine

1. Find the conclusion (indicators, then the "why?" test).
2. List the evidence.
3. Find what appears in the conclusion but not in the evidence: that is where the gap is.
4. State the assumption that bridges it, or the flaw that ignores it, in your own words.
5. Match a choice, and confirm an assumption with the negation test.
`,
  examples: [
    {
      id: 'example-trees-assumption',
      title: 'Finding and testing an assumption',
      problemMd: md`Over the past decade, the town of Ridgeford has planted trees along forty of its streets. Residents of the tree-lined streets report fewer illnesses related to summer heat than residents of other streets. The town council concludes that planting trees reduces heat-related illness, and it plans to plant trees along every street.

What does the council's conclusion assume?`,
      steps: [
        md`Find the conclusion: "planting trees reduces heat-related illness". The plan follows from it. Ask "why believe it?": because residents of tree-lined streets report fewer heat illnesses. That is the evidence.`,
        md`Compare them. The evidence is a difference between two groups of streets; the conclusion says the trees **cause** the difference. The new idea is causation, so the gap is correlation to cause.`,
        md`State the bridge: the tree-lined streets do not differ from the other streets in some other way that would explain the difference, such as wealth, building type or the age of residents.`,
        md`Negate it: "the tree-lined streets were chosen because they are in the town's wealthier districts, where most homes are air-conditioned". The evidence would then say nothing about trees, so the argument fails. The assumption is confirmed.`,
      ],
      answerMd: md`The council assumes that nothing other than the trees accounts for the lower rate of heat-related illness on tree-lined streets. A tempting wrong answer is "trees lower air temperature": that would help the argument, but the argument does not need it to be stated in those terms, and its negation does not destroy the conclusion on its own.`,
    },
    {
      id: 'example-cycling-sample',
      title: 'An unrepresentative sample',
      problemMd: md`A survey of the members of a city cycling club found that 85% of them support adding cycle lanes to the main avenue. The city's transport office concludes that most of the city's residents support the cycle lanes.

Describe the flaw.`,
      steps: [
        md`Conclusion: most of the city's residents support the lanes. Evidence: 85% of a cycling club's members do.`,
        md`What appears in the conclusion but not the evidence? "The city's residents" in general. The argument moves from one group to everyone.`,
        md`Ask whether the group is likely to be typical. Members of a cycling club are chosen, by their own choice, for an interest in cycling, the very thing the question is about.`,
      ],
      answerMd: md`The argument generalises from a sample that is unlikely to represent the city's residents on this question. The tempting wrong description is "the sample is too small": the passage gives no size, and the problem is who was asked, not how many.`,
    },
  ],
  traps: [
    {
      title: 'Taking a reported view for the conclusion',
      md: md`"Some economists claim X. Yet… so Y." The first sentence is the view being argued against. If you take it for the conclusion, every assumption and flaw question on the argument will go wrong. Look for the author's own claim after the turn.`,
    },
    {
      title: 'Assumptions that are too strong',
      md: md`A necessary assumption is the minimum the argument needs. "Morning meetings are the only way teams communicate" is far more than an argument about meetings needs; negate it ("there are other ways to communicate") and the argument is unharmed. Prefer the modest choice that the negation test confirms.`,
    },
    {
      title: 'A real flaw, but not this argument’s',
      md: md`Flaw choices describe genuine errors in general terms. A choice can name a real mistake that the argument simply does not make: "relies on the opinion of experts" when no expert is mentioned. Translate the choice into the argument's terms before you accept it.`,
    },
  ],
  check: [
    {
      id: 'check-meetings-assumption',
      title: 'Assumption',
      topic: 'Reading Comprehension: argument',
      stimulusMd: md`A software company found that teams that held a short meeting every morning finished their projects on schedule more often than teams that did not. The company's director concluded that requiring all teams to hold a morning meeting will increase the share of projects finished on schedule.`,
      stemMd: md`The director's conclusion depends on which of the following assumptions?`,
      options: [
        { id: 'A', text: md`Morning meetings are the only way that members of a team communicate.`, note: md`Far stronger than needed. Negate it, "teams also communicate in other ways", and the director's argument is unaffected.` },
        { id: 'B', text: md`Projects that are finished on schedule are of higher quality than those that are not.`, note: md`The conclusion is about finishing on schedule, not about quality; this is irrelevant to the reasoning.` },
        { id: 'C', text: md`The teams that chose to hold morning meetings were not already better organised in ways that would by themselves explain their better record.`, note: '' },
        { id: 'D', text: md`Most teams in the company already hold a morning meeting.`, note: md`If anything this would limit how much a requirement could change; the argument does not need it.` },
        { id: 'E', text: md`Meetings held in the afternoon would be less effective than morning meetings.`, note: md`Afternoon meetings are never compared; the argument works whether or not they would help.` },
      ],
      answer: 'C',
      workingMd: md`The evidence is a correlation between choosing to hold morning meetings and finishing on schedule; the conclusion says requiring the meetings will improve the record, which treats the meetings as the cause. The argument needs the teams that chose meetings not to differ in some other way that explains their record. Negate that: if those teams were simply the better-organised ones, imposing meetings on others need not help, and the conclusion collapses.`,
      lesson: 'When evidence compares groups that chose differently, the argument assumes the choice itself, not some trait of the choosers, explains the difference.',
    },
    {
      id: 'check-library-flaw',
      title: 'Flaw',
      topic: 'Reading Comprehension: argument',
      stimulusMd: md`Last year the public library extended its weekday opening hours from 6 p.m. to 8 p.m. Over the same year, the number of books borrowed rose by 12%. Clearly, the longer opening hours were responsible for the rise in borrowing.`,
      stemMd: md`Which of the following describes a flaw in the reasoning?`,
      options: [
        { id: 'A', text: md`It draws a conclusion about all libraries from the experience of one.`, note: md`The conclusion is only about this library; no generalisation is made.` },
        { id: 'B', text: md`It confuses the number of visitors with the number of books borrowed.`, note: md`Visitors are never mentioned; the argument speaks only of books borrowed throughout.` },
        { id: 'C', text: md`It assumes that every book was borrowed during the extended hours.`, note: md`The argument does not need this: longer hours could cause a rise even if only some extra borrowing happened in the evening.` },
        { id: 'D', text: md`It relies on the opinions of library staff rather than on records.`, note: md`No opinions are cited; the 12% figure is presented as a count.` },
        { id: 'E', text: md`It takes for granted that because the rise followed the change in hours, the change caused it, without considering other causes.`, note: '' },
      ],
      answer: 'E',
      workingMd: md`The evidence is that borrowing rose in the same year the hours were extended. The conclusion says the hours caused the rise. Nothing rules out other causes, such as new stock, a growing population or a reading campaign. That is the sequence-to-cause gap, which the choice about taking causation for granted describes.`,
      lesson: 'When "clearly" introduces a cause drawn from two things that happened together, look for the alternatives the argument never ruled out.',
    },
    {
      id: 'check-esterra-conclusion',
      title: 'Main conclusion',
      topic: 'Reading Comprehension: argument',
      stimulusMd: md`Some economists claim that the arrival of railway lines caused the growth of market towns in the province of Esterra. Yet several Esterran towns were growing quickly before any line reached them, and a few towns that gained stations early grew hardly at all. The railway, it seems, sped up growth in towns that already had something to trade; it did not create that growth on its own.`,
      stemMd: md`Which of the following best states the main conclusion of the argument?`,
      options: [
        { id: 'A', text: md`The arrival of railway lines caused the growth of Esterra's market towns.`, note: md`This is the economists' claim that the author argues against, introduced before the turn at "Yet".` },
        { id: 'B', text: md`Several Esterran towns were growing quickly before any railway line reached them.`, note: md`This is evidence; it answers "why believe the railway did not create growth by itself?"` },
        { id: 'C', text: md`The railway accelerated growth in towns that already had trade but did not by itself create growth.`, note: '' },
        { id: 'D', text: md`Towns that gained stations early did not grow.`, note: md`The passage says "a few" such towns grew hardly at all; this overstates a piece of evidence, and evidence is not the conclusion anyway.` },
        { id: 'E', text: md`Economists have overstated the importance of trade to Esterra's towns.`, note: md`The author's claim makes trade more important, not less, and criticises the economists for overstating the railway.` },
      ],
      answer: 'C',
      workingMd: md`Apply the "why?" test. The last sentence, that the railway sped up existing growth but did not create it, is supported by both facts in the middle sentence: towns grew before the railway, and some towns with early stations did not grow. Neither fact is supported by the last sentence, so the last sentence is the conclusion. The first sentence is the view being argued against.`,
      lesson: 'In an argument that opens with someone else’s claim, the conclusion is the author’s answer after the turn.',
    },
  ],
  takeaways: [
    'Find the conclusion with indicator words, then confirm it with the "why?" test.',
    'The assumption bridges what is new in the conclusion and absent from the evidence.',
    'Confirm an assumption by negating it: if the argument collapses, it was needed.',
    'Name the gap in plain words before reading flaw choices, then match one that fits this argument.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-reading-comprehension', skill: 'rc-author-assumptions-perspective' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const strengthenWeakenLesson: Lesson = {
  slug: 'reading-strengthen-weaken-explain',
  title: 'Strengthen, weaken and explain',
  summary: 'Use the gap in an argument to find what strengthens or weakens it, and resolve an apparent paradox with the fact that lets both sides be true.',
  minutes: 20,
  objectives: [
    'Find the choice that most weakens or strengthens an argument by aiming at its gap.',
    'Resolve an apparent discrepancy with a fact that makes both observations true together.',
    'Reject choices that are irrelevant, merely restate the evidence or push the wrong way.',
  ],
  teachMd: md`
### Questions that add new information

Strengthen, weaken and explain questions are unusual in one respect: the right answer brings in information that is **not** in the passage. You accept each choice as true and ask what it does to the argument. This is the reverse of detail and inference questions, where anything not in the passage is out. Mixing up the two habits is the main source of errors here.

### Start from the gap

Before reading the choices, do what the previous lesson taught: find the conclusion, the evidence, and the gap between them. Almost every right answer is aimed at that gap.

- To **weaken**, a choice shows the gap is real: it gives an alternative cause, shows the sample is skewed, or shows that conditions changed.
- To **strengthen**, a choice closes the gap: it rules out an alternative cause, shows the sample is typical, or supplies the missing link.

A weakener does not have to prove the conclusion false. It only has to make it less likely. Likewise, a strengthener does not have to prove the conclusion; it makes it more likely.

### The same argument, both ways

Take: "Since a café chain introduced a discount for customers who bring reusable cups, the share of its drinks sold in disposable cups has fallen from 90% to 70%. The chain's report credits the discount." The gap is sequence to cause: the fall followed the discount, but was it caused by it?

| Choice | Effect |
| --- | --- |
| Over the same period, the city introduced a charge on all disposable cups. | weakens: an alternative cause |
| In the chain's branches outside the city, where no such charge applies, the share fell by a similar amount after the discount began. | strengthens: rules that alternative out |
| Many customers say they like the discount. | little effect: liking it does not show it changed behaviour |
| Reusable cups are better for the environment. | irrelevant: says nothing about the cause of the fall |

### Explain questions: let both facts be true

Some questions describe two facts that seem to clash and ask which choice "helps to explain", "resolves" or "reconciles" them. For example: a town installed brighter street lights, and reported burglaries then rose.

The right answer does not deny either fact. It adds something that makes both expected. Here: with brighter lighting, more burglaries are seen by neighbours and passers-by, and so more are reported, even if no more take place. Now brighter lights and a rise in **reported** burglaries fit together.

To find it, state the tension exactly ("we would expect X, but we see Y") and look for a choice that makes Y what we should have expected. Choices that explain only one of the two facts, or that make the tension worse, are wrong.

### Wrong choices you will meet

- **Irrelevant:** true, on topic, but not touching the gap.
- **Restates the evidence:** repeats what the argument already says; adds no support.
- **Wrong direction:** a strengthener among weakener choices, or the reverse. Read the question word again before choosing.
- **Off target:** a choice that would be decisive if true but is about a different situation from the argument's.
- **Explains half:** in explain questions, accounts for one fact only.

### A routine

1. Read the question first, so you know whether you are strengthening, weakening or explaining.
2. Find the conclusion and the gap, or state the tension in one sentence.
3. Predict the kind of fact that would work (an alternative cause, a comparison group, a reporting effect).
4. Treat each choice as true and ask what it does to the gap. Pick the one with the largest effect in the asked direction.
`,
  examples: [
    {
      id: 'example-cafe-weaken',
      title: 'Weakening a causal claim',
      problemMd: md`Since a café chain introduced a discount for customers who bring reusable cups, the share of its drinks sold in disposable cups in its city branches has fallen from 90% to 70%. The chain's report concludes that the discount caused the fall.

Which of these, if true, most weakens the report's conclusion?

1. Customers who use the discount visit the café more often than before.
2. During the same period, the city began charging customers for every disposable cup they take.
3. The discount is the largest the chain has ever offered.`,
      steps: [
        md`Conclusion: the discount caused the fall. Evidence: the fall came after the discount. Gap: sequence to cause, so look for another cause that arrived at the same time.`,
        md`Choice 1 is about customers who already use the discount; it does not question whether the discount caused the change. If anything it fits the report.`,
        md`Choice 2 gives a different cause, arriving in the same period and pushing customers away from disposable cups. If it is true, the fall may owe little to the discount.`,
        md`Choice 3 says the discount was large, which makes the report's story slightly more plausible, not less.`,
      ],
      answerMd: md`The city's charge on disposable cups most weakens the conclusion: it is an alternative cause that coincides with the discount. The tempting wrong answer is the size of the discount, which sounds relevant but pushes in the report's favour.`,
    },
    {
      id: 'example-lights-explain',
      title: 'Explaining an apparent paradox',
      problemMd: md`After a town installed brighter street lights in its residential areas, the number of burglaries reported to the police in those areas rose. Which of these would most help to explain the rise?

1. The new lights use less electricity than the old ones.
2. Burglaries in the town's commercial areas fell over the same period.
3. With brighter lighting, more burglaries are noticed by neighbours and passers-by, and more of those noticed are reported.`,
      steps: [
        md`State the tension: brighter lights are expected to deter burglary, yet reported burglaries rose.`,
        md`Predict: something that makes a rise in **reports** expected even if burglaries did not rise, or a reason burglaries might rise.`,
        md`Choice 1 is about electricity; it touches neither fact. Choice 2 is about different areas; it leaves the residential rise unexplained.`,
        md`Choice 3 makes more burglaries visible and so more reported. Both facts are now expected: the lights work as designed, and reports rise.`,
      ],
      answerMd: md`The third choice explains the rise: brighter lighting increases the share of burglaries that are noticed and reported. The trap is the commercial-area choice, which is about burglary and lighting's effects but explains a different place.`,
    },
  ],
  traps: [
    {
      title: 'Rejecting a choice because it is not in the passage',
      md: md`In these questions the answer is new information by design. A reader trained to reject anything not stated will reject the right answer. Accept each choice as true and judge what it does.`,
    },
    {
      title: 'Answering the opposite question',
      md: md`In a weaken question, a strong strengthener is very tempting, because it clearly bears on the argument. Re-read the question word before you choose, and check the direction of your choice's effect.`,
    },
    {
      title: 'Explaining only half the paradox',
      md: md`A choice that explains why burglaries might rise, but contradicts the lights being brighter, or explains one fact while ignoring the other, does not resolve the tension. The right choice leaves both facts standing and makes them fit.`,
    },
    {
      title: 'Choices that only say people like something',
      md: md`"Customers say they like the discount" or "staff prefer the new lamps" rarely strengthens a causal claim. Preferences are not behaviour. Look for choices that bear on what actually happened.`,
    },
  ],
  check: [
    {
      id: 'check-lighting-weaken',
      title: 'Weaken',
      topic: 'Reading Comprehension: argument',
      stimulusMd: md`A company replaced its office lighting with lamps designed to imitate daylight. In the six months after the change, staff took 20% fewer sick days than in the six months before it. The facilities manager concludes that the new lighting improved the staff's health.`,
      stemMd: md`Which of the following, if true, most seriously weakens the manager's conclusion?`,
      options: [
        { id: 'A', text: md`Most staff said in a survey that they prefer the new lamps.`, note: md`A preference says nothing about health or sick days; it neither supports nor undermines the causal claim.` },
        { id: 'B', text: md`The new lamps use less electricity than the old ones.`, note: md`Electricity use is irrelevant to whether the lighting changed sick days.` },
        { id: 'C', text: md`The six months before the change were the region's winter months, when illness is most common, and the six months after were spring and summer.`, note: '' },
        { id: 'D', text: md`Several other companies that installed similar lamps also reported fewer sick days afterwards.`, note: md`This supports the manager's conclusion by repeating the pattern elsewhere; it strengthens rather than weakens.` },
        { id: 'E', text: md`A few staff members found the new light too bright.`, note: md`Discomfort for a few people does not bear on the overall fall in sick days.` },
      ],
      answer: 'C',
      workingMd: md`The gap is sequence to cause: sick days fell after the change. The seasonal choice offers an alternative cause that fits the timing exactly: the "before" period was the high-illness season and the "after" period was not. With that true, a fall in sick days was to be expected without any effect from the lamps.`,
      lesson: 'When a before-and-after comparison is the evidence, look for anything else that differed between the two periods.',
    },
    {
      id: 'check-dogs-strengthen',
      title: 'Strengthen',
      topic: 'Reading Comprehension: argument',
      stimulusMd: md`Researchers found that people who own dogs walk more each week, on average, than people who do not. They concluded that owning a dog causes people to walk more.`,
      stemMd: md`Which of the following, if true, most strengthens the researchers' conclusion?`,
      options: [
        { id: 'A', text: md`The dog owners in the study were, on average, younger than the people without dogs.`, note: md`Age is an alternative explanation for walking more, so this weakens the conclusion.` },
        { id: 'B', text: md`Some dog owners walk their dogs for only a few minutes a day.`, note: md`This concerns a few owners and says nothing about whether owning a dog changes how much people walk.` },
        { id: 'C', text: md`People who enjoy walking are more likely than others to decide to get a dog.`, note: md`This suggests the causation runs the other way, from walking to dog ownership, and so weakens the conclusion.` },
        { id: 'D', text: md`Dog owners in cities walk less, on average, than dog owners in the countryside.`, note: md`A difference among dog owners does not address whether owning a dog causes more walking.` },
        { id: 'E', text: md`In a group followed over several years, people's weekly walking rose after they acquired a dog, compared with similar people who did not acquire one.`, note: '' },
      ],
      answer: 'E',
      workingMd: md`The evidence is a correlation; the gap is that walkers might get dogs, or that some third factor drives both. Following the same people before and after they acquire a dog, against a similar group that does not, shows walking rising after the dog arrives. That closes both the reverse-causation and the third-factor gaps, so it makes the causal conclusion more likely.`,
      lesson: 'A causal claim from a correlation is best strengthened by evidence that the effect follows the cause in the same people, against a comparison group.',
    },
    {
      id: 'check-bicycle-explain',
      title: 'Explain',
      topic: 'Reading Comprehension: argument',
      stimulusMd: md`In the district of Morrow, the number of bicycle thefts reported to the police doubled in the year after the police launched an online form that lets residents report a theft in two minutes. Over the same year, insurers in the district received about the same number of claims for stolen bicycles as in the year before.`,
      stemMd: md`Which of the following, if true, most helps to explain the difference between the two trends?`,
      options: [
        { id: 'A', text: md`The police increased their patrols in the district during the year.`, note: md`More patrols might reduce thefts, but that explains neither the doubling of reports nor why claims did not change.` },
        { id: 'B', text: md`Sales of new bicycles in the district rose slightly during the year.`, note: md`More bicycles could mean more thefts, but then insurance claims would be expected to rise too, so the gap remains.` },
        { id: 'C', text: md`Many residents did not learn of the online form until late in the year.`, note: md`This would limit the rise in reports; it does not explain why reports and claims moved differently.` },
        { id: 'D', text: md`Most thefts that had gone unreported before the form existed involved bicycles too cheap for their owners to have insured.`, note: '' },
        { id: 'E', text: md`Thieves in the district mostly target expensive bicycles.`, note: md`Expensive bicycles are the ones likely to be insured, so a real doubling of their theft would raise claims; this deepens the puzzle.` },
      ],
      answer: 'D',
      workingMd: md`State the tension: reports doubled, but insured losses did not change. If the easy form mainly brought in reports of thefts that previously went unreported, and those were mostly uninsured cheap bicycles, then reports would rise while claims stayed level, with no real rise in theft needed. Both facts are then expected.`,
      lesson: 'When two measures of the same thing move apart, look for a choice showing they count different cases.',
    },
  ],
  takeaways: [
    'In strengthen, weaken and explain questions, treat every choice as true; the answer is new information.',
    'Aim at the gap: weakeners widen it, strengtheners close it.',
    'An explanation leaves both facts standing and makes them fit together.',
    'Re-read the question word before choosing, to avoid answering its opposite.',
  ],
  practice: { examKey: 'gre', domain: 'verbal-reading-comprehension', skill: 'rc-strengths-weaknesses-of-position' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const readingComprehensionUnit: Unit = {
  slug: 'reading-comprehension',
  title: 'Reading Comprehension',
  summary: 'About half of GRE Verbal Reasoning is based on passages. This unit teaches how to read a passage for its structure, answer main-idea, detail and inference questions, handle the select-one-or-more and Select-in-Passage formats, and reason about arguments: their assumptions, and what would strengthen, weaken or explain them.',
  lessons: [passageStructureLesson, mainIdeaLesson, detailInferenceLesson, selectFormatsLesson, argumentLesson, strengthenWeakenLesson],
};
