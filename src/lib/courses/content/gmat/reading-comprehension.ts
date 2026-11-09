import { md, type Lesson, type Unit } from '../../types';

/**
 * GMAT Verbal Reasoning: Reading Comprehension. Every passage and question is
 * original to this course. The only exam facts used are those the research
 * record confirms from gmac.com: Verbal Reasoning is 23 multiple-choice Reading
 * Comprehension and Critical Reasoning questions in 45 minutes.
 */

const finesPassage = md`*For most of the twentieth century, public libraries treated overdue fines as a simple tool: a small charge would encourage borrowers to return books on time. In recent years a number of library systems have abandoned fines, and the reasons they give reveal a different view of what fines actually do.*

*Advocates of eliminating fines argue that the charges deter the very borrowers libraries most want to reach. A borrower who owes a fine she cannot easily pay may stop visiting altogether, so the library loses both the book and the reader. On this view, fines recover little money while quietly shrinking the library's public.*

*Defenders of fines reply that without some cost, borrowers will keep popular items longer, and waiting lists will grow. A library's collection is shared, they point out, and a fine is a modest way of reminding each borrower of the others in the queue.*

*Both sides, however, tend to assume that the fine is the main reason people return books. That assumption deserves more scrutiny than it has received. Many borrowers return items on time because of reminders, habit or a sense of obligation, none of which depends on money. If so, the debate over fines may matter less to return rates than either side supposes, and more to the question of who feels welcome in a library.*`;

const restorationPassage = md`When a farm is taken out of production, two strategies are commonly proposed for what should happen next. The first, often called active restoration, involves planting native species, reshaping drainage and sometimes reintroducing animals, all according to a plan for what the land should eventually become. The second, passive restoration, removes the farm's machinery and livestock and then largely leaves the land alone.

Supporters of active restoration argue that abandoned fields rarely return to anything like their former state on their own. Aggressive weeds, they note, can occupy bare soil for decades, and a planned intervention can shorten that period considerably.

Supporters of passive restoration respond that planners often do not know what the land "should" become. A plan drawn up today, they argue, reflects today's assumptions about which species belong, and land left alone may reveal possibilities that no plan anticipated.

The disagreement is often presented as a choice between expertise and humility. That framing is misleading. The more useful question is not which strategy is better in general but what each particular site already contains. A field next to an intact woodland, with seeds and animals able to move in, may recover well with little help; a field isolated by miles of cropland may not. Choosing a strategy before surveying the site, in other words, repeats the error each side attributes to the other.`;

const replicationPassage = md`*When a published finding cannot be reproduced by other laboratories, the failure is often treated as a scandal, and attention turns to whether the original researchers were careless or dishonest. Such cases exist. Yet treating every failed replication as a sign of misconduct obscures a more ordinary explanation.*

*Many experiments depend on conditions that their authors did not think to report because they seemed too obvious to mention: the supplier of a chemical, the time of day measurements were taken, the way animals were handled before testing. A second laboratory that follows the published method exactly may still differ in several of these respects. When its results diverge, the divergence may reveal not an error in the first study but a variable no one knew mattered.*

*Seen this way, a failed replication is less a verdict than a clue. It tells researchers that the finding is narrower than it first appeared, and that some unlisted condition is doing more work than anyone suspected. Laboratories that respond by comparing their procedures in detail, rather than by defending or attacking the original paper, are the ones most likely to learn what that condition is.*`;

const translationPassage = md`Debates about translating poetry usually begin with a choice between fidelity and freedom. A faithful translation, it is said, keeps the literal sense of every line at the cost of the original's music; a free translation keeps the music, or something like it, at the cost of the sense. Each camp accuses the other of betraying the poet.

This way of putting the matter assumes that sense and music can be separated, so that a translator must decide which to keep. In much poetry they cannot. A line's rhythm may be what tells a reader that a statement is ironic; a rhyme may join two words whose connection is the poem's whole point. A translation that preserves the dictionary meaning of each word but loses the rhythm has not kept the sense at all, because part of the sense lived in the rhythm.

None of this makes translation impossible. It means that the translator's real task is to identify, line by line, what is carrying the meaning, and to find some means in the new language that will carry it there. Sometimes that will be a literal rendering, sometimes a loose one. The fidelity-versus-freedom debate, by asking translators to choose a policy in advance, directs attention away from that work.`;

const seawallPassage = md`*Many coastal towns have tried to protect their beaches by building seawalls. A seawall stops waves from reaching the land behind it, but it does not absorb their energy; it reflects it. The reflected waves strip sand from the beach in front of the wall, so that over a period of years the beach narrows and, in some places, disappears. Towns that built seawalls to protect beach-side property have sometimes found that they preserved the property and lost the beach.*

*An alternative approach, sometimes called managed retreat, accepts that the shoreline will move and relocates buildings and roads away from it. Managed retreat preserves the beach by giving it room to shift, but it is expensive and politically difficult, because it asks particular owners to give up particular places.*

*Some engineers now favour a middle course: restoring dunes and marsh vegetation that absorb wave energy rather than reflecting it. Such features can protect property for a time while allowing sand to move naturally. They do not suit every coast, however; where storms are severe and frequent, vegetation may be destroyed faster than it can re-establish itself.*`;

const suggestionPassage = md`In many organisations, staff suggestion schemes produce a burst of ideas in their first months and then fall silent. Managers often conclude that employees have run out of ideas. A study of such schemes points to another cause: the way suggestions are handled after they are submitted.

In the schemes the researchers examined, most suggestions received either no reply or a brief note of thanks months later. Employees whose suggestions disappeared in this way rarely submitted another, even when the suggestion had in fact been adopted. What discouraged them was not rejection but silence. Employees who received a prompt explanation of why their idea would not be used, by contrast, were about as likely to submit again as those who were told that their ideas had been accepted.

The researchers draw a practical conclusion. A scheme's success depends less on rewards for good ideas than on a reliable, quick response to every idea. Organisations that offer large prizes for adopted suggestions but leave the rest unanswered are, on this account, paying to encourage a few submissions while discouraging many.`;

const cleaningPassage = md`*Few decisions in art conservation provoke as much argument as the cleaning of old paintings. Over centuries, the varnish that protects a painting yellows and darkens, and grime collects on its surface. Removing these layers can reveal colours that no living viewer has seen. It can also remove, critics warn, thin glazes that the artist applied on top of the paint to soften or unify the picture, glazes that may be hard to tell apart from later varnish.*

*Conservators have answered this concern with more cautious methods: cleaning small test areas first, analysing samples before proceeding, and leaving a thin layer of old varnish where the evidence is unclear. These methods have made serious mistakes rarer. They have not settled the argument, because the argument is partly about taste. A viewer accustomed to the warm, golden tone of an uncleaned picture may find its cleaned colours harsh, even if they are exactly what the painter intended.*

*It would be a mistake to dismiss such reactions as mere nostalgia. Yet it would be equally mistaken to let them decide the matter. What viewers have grown used to is a fact about viewers, not about paintings.*`;

const birdPassage = md`Amateur birdwatchers have long recorded what they see, but only recently have their records been collected on a large scale. Online platforms now gather enormous numbers of sightings, and researchers have begun to use them to track where species live and when they migrate.

Professional ecologists were at first wary. Amateur observers, they pointed out, tend to visit places that are easy to reach and pleasant to walk in, and they report rare birds more eagerly than common ones. A map built from such reports might show where birdwatchers go rather than where birds are.

These objections were sound, and they have not disappeared. But they have turned out to be problems of method rather than reasons for dismissal. Researchers now ask observers to record every species they see, not only the notable ones, and to note how long they looked and where they walked. With this information, analysts can estimate how much of a pattern reflects observers' habits and correct for it. The resulting maps are imperfect, but for many common species they cover more ground, more often, than any professional survey could afford to.`;

const passageMapping: Lesson = {
  slug: 'passage-mapping',
  title: 'Mapping a passage: read for structure, not for detail',
  summary: 'Read a GMAT passage once for its structure, separate the author from the views reported, and keep a one-line map per paragraph.',
  minutes: 22,
  objectives: [
    'Build a one-line-per-paragraph map of a passage on a single careful read.',
    'Tell the author\'s own view apart from the views the passage reports.',
    'Use structural signal words to predict where a passage is going.',
  ],
  teachMd: md`
### Why map at all

Verbal Reasoning gives you 23 multiple-choice Reading Comprehension and Critical Reasoning questions in 45 minutes. Reading Comprehension questions come attached to passages, so the minutes you spend reading are shared by every question on that passage. Reading slowly enough to remember every detail is expensive, and it is also the wrong goal: details can be looked up when a question asks for them. What you cannot look up quickly is the passage's *structure*: who says what, where the author stands, and how each paragraph serves the whole.

A map is a few words per paragraph that capture that structure. It takes almost no extra time if you build it while reading, and it turns every later question into "go to the right paragraph and check".

### What goes in the map

For each paragraph, write (or hold in mind) one line answering: *what is this paragraph doing?* Use verbs, not topics.

| Weak line (topic) | Strong line (function) |
| --- | --- |
| "fines" | "case against fines: deter poor borrowers" |
| "history" | "background: the old view of fines" |
| "author" | "author: both sides share a doubtful assumption" |

Then add one line for the whole passage: the **main point**, which is usually the author's position. If the passage only reports views and the author never takes one, say so; that is a finding too.

### Whose voice is it?

The single most useful habit in Reading Comprehension is tracking voice. Passages often present several views: what "critics", "supporters", "some economists" or "the traditional view" holds. Those are *reported* views. The author's own view usually appears where the language stops attributing ("they argue", "on this view") and starts asserting ("that assumption deserves scrutiny", "this framing is misleading").

Ask of every claim: who would sign this? If the answer is "the defenders of fines", then a question about what *the author* believes cannot be answered with it.

### Signal words

Some words tell you where the passage is turning before you finish the sentence.

- **Contrast:** however, yet, but, although, by contrast, nevertheless. Often marks the author's own move against a reported view.
- **Continuation:** moreover, likewise, in addition, also. The same direction, more support.
- **Conclusion:** therefore, thus, in other words, so. The point a paragraph has been building to.
- **Concession:** admittedly, to be sure, such cases exist. The author grants something before turning.
- **Evaluation:** misleading, sound, deserves scrutiny, overstated. The author's judgement, almost always.

A "however" in the last paragraph is one of the strongest hints a passage gives: what follows it is very often the main point.

### Common passage shapes

Most passages follow one of a few shapes. Recognising the shape early lets you predict the rest:

- **Debate and verdict:** two views are presented, then the author judges or reframes them.
- **Problem and solution:** a problem is described, solutions are weighed, one is favoured or qualified.
- **Received view and challenge:** what is commonly believed, then why it is incomplete.
- **Explanation:** a phenomenon is described and its causes explained, with little argument.

### Reading speed

Read the first paragraph carefully: it sets the topic and often the received view the author will push against. Read topic sentences and turning points carefully. Read examples and lists of detail more quickly, noting only *that* they are there and what they support. You can come back to them in seconds with a good map.

### Check the map before the questions

Before you look at the first question, take a few seconds to say the main point to yourself in one sentence. If you cannot, you have not finished reading; reread the last paragraph and any sentence that follows a "however". This small check is cheaper than discovering halfway through the questions that you misjudged where the author stands, because every question about the whole passage depends on it.
`,
  examples: [
    {
      id: 'example-build-a-map',
      title: 'Building a map',
      problemMd: finesPassage + md`

Build a map: one line per paragraph and a main point.`,
      steps: [
        md`**Paragraph 1.** It describes the old view (fines encourage returns) and says that systems dropping fines reveal "a different view". Line: *background: old view of fines; a shift is coming.*`,
        md`**Paragraph 2.** "Advocates of eliminating fines argue" marks a reported view. Line: *case against fines: they drive away borrowers who cannot pay.*`,
        md`**Paragraph 3.** "Defenders of fines reply" marks the opposing reported view. Line: *case for fines: they keep shared items moving.*`,
        md`**Paragraph 4.** "Both sides, however" is the author stepping in, and "deserves more scrutiny" is the author's evaluation. Line: *author: both sides' shared assumption that fines drive returns is doubtful; fines may matter more to who feels welcome.*`,
        md`**Main point.** The author's view is in paragraph 4: the fines debate rests on a doubtful shared assumption, so fines may matter more to who feels welcome than to return rates.`,
      ],
      answerMd: md`Map: (1) background and shift; (2) case against fines; (3) case for fines; (4) author questions both sides' assumption. Main point: fines probably matter less to return rates than both sides think, and more to who feels welcome. The tempting main point, "libraries should abolish fines", is the advocates' view in paragraph 2, not the author's.`,
    },
    {
      id: 'example-whose-voice',
      title: 'Sorting reported views from the author\'s',
      problemMd: md`Using the library-fines passage in the first example, decide who would sign each claim: (1) "Fines quietly shrink the library's public." (2) "A fine reminds each borrower of the others in the queue." (3) "Many borrowers return items because of reminders, habit or obligation."`,
      steps: [
        md`Claim 1 sits in paragraph 2, under "Advocates of eliminating fines argue", and "on this view" confirms it is reported. The advocates sign it.`,
        md`Claim 2 sits in paragraph 3, under "Defenders of fines reply" and "they point out". The defenders sign it.`,
        md`Claim 3 sits in paragraph 4, after "however", in a paragraph of unattributed assertion with the author's evaluation ("deserves more scrutiny"). The author signs it.`,
      ],
      answerMd: md`(1) advocates of abolition; (2) defenders of fines; (3) the author. Only the third can support an answer about what the author believes; treating the first as the author's view is the most common slip on this passage.`,
    },
    {
      id: 'example-map-to-answer',
      title: 'Using the map to answer a structure question',
      problemMd: md`Using the library-fines passage: *"The third paragraph serves primarily to..."* Answer from the map before looking at any choices.`,
      steps: [
        md`Look up paragraph 3 on the map: *case for fines: they keep shared items moving.*`,
        md`Note its relation to its neighbours: it answers paragraph 2 ("reply") and is then questioned, together with paragraph 2, by the author in paragraph 4.`,
        md`Phrase a prediction: "to present the opposing argument, in favour of fines, which the author later says rests on the same doubtful assumption as the first."`,
      ],
      answerMd: md`The third paragraph presents the defenders' argument for fines, as a reply to the case against them. A choice saying it "states the author's view that fines are needed" would be the trap: the paragraph is reported, and the author questions it.`,
    },
  ],
  traps: [
    {
      title: 'Taking a reported view for the author\'s',
      md: md`A passage can spend two paragraphs explaining a view the author goes on to reject. If you remember the most detailed paragraph rather than the most committed one, you will pick the reported view. Look for the place where attribution stops and evaluation starts.`,
    },
    {
      title: 'Mapping topics instead of functions',
      md: md`A map line that says "seawalls" tells you where seawalls are mentioned, not what the paragraph is doing with them. Write what the paragraph does: describes, argues, objects, concedes, concludes.`,
    },
    {
      title: 'Reading every detail at the same speed',
      md: md`Lingering on a list of examples costs time the questions need, and you will reread the one that matters anyway. Read turning points slowly and supporting detail quickly, noting only what it supports.`,
    },
    {
      title: 'Missing the late turn',
      md: md`Many passages save the author's view for the last paragraph, after a "however" or "yet". If you stop reading carefully after the middle, you will map the passage as a neutral report when it is an argument.`,
    },
  ],
  check: [
    {
      id: 'check-final-paragraph-function',
      title: 'What the last paragraph does',
      topic: 'Reading Comprehension',
      stimulusMd: restorationPassage,
      stemMd: md`The final paragraph functions primarily to`,
      options: [
        { id: 'A', text: md`endorse passive restoration as the generally better strategy`, note: md`The author declines to call either strategy better "in general"; this takes one side the paragraph explicitly avoids.` },
        { id: 'B', text: md`summarise the two positions without passing judgement on the debate`, note: md`The paragraph does judge: it calls the usual framing "misleading" and says both sides repeat an error.` },
        { id: 'C', text: md`reject a common framing of the debate and argue that the choice should depend on each site's conditions`, note: '' },
        { id: 'D', text: md`provide evidence that active restoration fails on land next to woodland`, note: md`The paragraph says land next to woodland may recover with little help, not that active restoration fails there; and it offers an illustration, not evidence of failure.` },
        { id: 'E', text: md`describe how the debate between the two strategies first arose`, note: md`Nothing in the paragraph concerns the history or origin of the debate.` },
      ],
      answer: 'C',
      workingMd: md`The final paragraph begins by naming how the disagreement "is often presented", calls that framing misleading, and replaces it with a site-by-site question, illustrated by the woodland and cropland fields. That is rejecting a framing and proposing that the choice depend on site conditions. It does not favour one strategy, it plainly judges, and it says nothing about the debate's origins.`,
      lesson: 'When a paragraph says "that framing is misleading", its function is to reframe, not to pick a side.',
    },
    {
      id: 'check-passage-organisation',
      title: 'The passage as a whole',
      topic: 'Reading Comprehension',
      stimulusMd: restorationPassage,
      stemMd: md`Which of the following best describes the organisation of the passage?`,
      options: [
        { id: 'A', text: md`A problem is described, several causes are considered, and one cause is identified as the most important.`, note: md`The passage compares two strategies; it does not weigh causes of a problem.` },
        { id: 'B', text: md`Two approaches are defined, an argument for each is presented, and the author then argues that the usual way of framing the choice between them is mistaken.`, note: '' },
        { id: 'C', text: md`A theory is stated, evidence against it is presented, and the theory is abandoned.`, note: md`Neither strategy is presented as a theory that is then abandoned; the author keeps both available, depending on the site.` },
        { id: 'D', text: md`Two approaches are defined, and the author shows that one is superior in every respect.`, note: md`The author explicitly refuses to say which strategy is better in general.` },
        { id: 'E', text: md`A historical account is given of how farmland has been restored over time.`, note: md`The passage has no historical sequence; it sets out a present-day debate.` },
      ],
      answer: 'B',
      workingMd: md`Map: (1) defines active and passive restoration; (2) argument for active; (3) argument for passive; (4) author: the expertise-versus-humility framing is misleading; the site should decide. The description matching that map is: two approaches defined, an argument for each, then the author rejects the usual framing.`,
      lesson: 'Check an organisation answer against your map one paragraph at a time; one wrong segment rules it out.',
    },
    {
      id: 'check-author-voice',
      title: 'The author\'s own view',
      topic: 'Reading Comprehension',
      stimulusMd: restorationPassage,
      stemMd: md`Which of the following is presented as the author's own view rather than as a view the author attributes to others?`,
      options: [
        { id: 'A', text: md`Aggressive weeds can occupy bare soil for decades.`, note: md`This is attributed to supporters of active restoration ("they note").` },
        { id: 'B', text: md`A plan drawn up today reflects today's assumptions about which species belong.`, note: md`This belongs to supporters of passive restoration ("respond that", "they argue").` },
        { id: 'C', text: md`The choice between the strategies is a choice between expertise and humility.`, note: md`This is the framing the author calls misleading; the author reports it in order to reject it.` },
        { id: 'D', text: md`A planned intervention can considerably shorten the time abandoned land takes to recover.`, note: md`This is part of the active-restoration supporters' argument in the second paragraph.` },
        { id: 'E', text: md`A restoration strategy should not be chosen before the particular site has been surveyed.`, note: '' },
      ],
      answer: 'E',
      workingMd: md`The second and third paragraphs report each camp's view with attribution ("they note", "respond that"). The fourth paragraph is the author's, and it ends by saying that choosing a strategy before surveying the site repeats both sides' error, which is the claim that a strategy should not be chosen before the site is surveyed. The expertise-versus-humility framing appears in that paragraph only to be rejected.`,
      lesson: 'Find where the attribution stops and the evaluation starts: that is where the author speaks.',
    },
  ],
  takeaways: [
    'Reading time is shared by every question on a passage, so read for structure and look details up.',
    'Map each paragraph by what it does, then state the main point in one line.',
    'Track voice: reported views are attributed; the author evaluates.',
    'A late "however" very often introduces the author\'s main point.',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-reading-comprehension', skill: 'rc-logical-structure' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const mainIdeaAndStructure: Lesson = {
  slug: 'main-idea-and-structure',
  title: 'Main idea, primary purpose and the role of a paragraph',
  summary: 'Answer main-idea, primary-purpose and function questions by predicting from your map and testing each choice for scope and verb.',
  minutes: 22,
  objectives: [
    'State a passage\'s main idea and primary purpose before reading the choices.',
    'Reject choices that are too narrow, too broad or wrong in their verb.',
    'Say why an author includes a paragraph or a detail.',
  ],
  teachMd: md`
### Three questions about the whole

Many Reading Comprehension questions ask about the passage as a whole or about the job one part does in it. They come in three common forms:

- **Main idea:** "Which best states the main point of the passage?"
- **Primary purpose:** "The primary purpose of the passage is to..." The answer is usually a verb phrase: *to argue that...*, *to explain why...*, *to challenge...*
- **Function:** "The second paragraph serves to..." or "The author mentions X in order to..."

All three are answered from the map, not from the details. If you mapped the passage, you can predict the answer before you read a single choice, and prediction is what protects you from attractive wrong answers.

### Main idea: what the author would sign

The main idea is the claim the whole passage supports, usually the author's position. Test a candidate with two questions:

1. **Would the author sign it?** A view the passage reports and then rejects fails at once.
2. **Does it cover the whole passage?** A point that only one paragraph makes is too narrow; a claim larger than anything the passage argues is too broad.

| Choice type | Example (replication passage) | Verdict |
| --- | --- | --- |
| Too narrow | "Some experiments depend on the time of day." | One detail from one paragraph. |
| Too broad | "Science cannot be trusted to correct itself." | Far beyond anything argued. |
| Wrong voice | "Failed replications show misconduct." | The view the author pushes against. |
| Right | "Failed replications often reflect unreported conditions and are better treated as clues than verdicts." | Covers the argument; the author would sign. |

### Primary purpose: get the verb right

A purpose choice has two parts: a verb and an object. Check the verb first; it often eliminates half the choices.

- **Argue, challenge, criticise, defend, propose** mean the author takes a position.
- **Describe, explain, summarise, outline** mean the author mostly reports or accounts for something.
- **Compare, evaluate** mean the author weighs two or more things.

A passage that calls a view "misleading" and proposes another is not one whose purpose is "to describe" two views. A passage that explains a process with no position is not one whose purpose is "to argue". Match the strength of the verb to how committed the author is, then check the object: what exactly is argued, explained or challenged?

### Function: why is it there?

For a function question, ask what the part does for the main point. Typical jobs:

- gives **background** the argument needs;
- presents a **view the author will answer**;
- offers an **example** or illustration of a claim;
- makes a **concession** before a turn;
- states or supports the **conclusion**.

Then read the part's neighbours. A function is a relation: an example illustrates *something*, an objection is raised *against something*. The right choice usually names both the job and what it relates to.

When the question names a detail ("The author mentions the supplier of a chemical in order to..."), the answer is almost never about the detail itself. It is about the claim the detail supports. Find the sentence the detail sits in, and the claim that sentence serves.

### Testing the choices

After predicting, read every choice and sort it:

- **Matches the prediction** in voice, scope and verb: keep.
- **Half right:** the first half matches, the second adds something unsupported. A single wrong word sinks a choice; reject it.
- **True but beside the point:** something the passage says, but not the answer to this question. Common in function questions.

If two choices survive, compare them on the word that differs, and go back to the passage for that word only.
`,
  examples: [
    {
      id: 'example-primary-purpose',
      title: 'Predicting the primary purpose',
      problemMd: replicationPassage + md`

What is the primary purpose of the passage? Predict, then judge these candidates: (1) "to expose researchers who publish unreliable findings"; (2) "to describe the methods laboratories use to replicate experiments"; (3) "to argue that failed replications are often better understood as revealing unreported conditions than as evidence of misconduct".`,
      steps: [
        md`Map: (1) failed replications treated as scandal; author concedes misconduct exists ("Such cases exist") but says this obscures a more ordinary explanation; (2) the explanation: unreported conditions; (3) so treat a failure as a clue; compare procedures.`,
        md`Voice and verb: the author takes a position ("obscures", "less a verdict than a clue"), so the verb should be argue, challenge or propose, not describe.`,
        md`Prediction: to argue that failed replications often reflect unreported conditions and should be treated as clues.`,
        md`Judge: (1) takes the scandal view the author pushes against; (2) has a neutral verb and a topic the passage does not cover in detail; (3) matches the prediction.`,
      ],
      answerMd: md`Candidate 3. Candidate 1 is the wrong voice, the view the author qualifies; candidate 2 has the wrong verb, since the passage argues rather than describes.`,
    },
    {
      id: 'example-paragraph-function',
      title: 'The job of the middle paragraph',
      problemMd: md`Using the replication passage in the first example: *"The second paragraph serves primarily to..."* Predict the answer.`,
      steps: [
        md`Find the paragraph's place on the map: paragraph 1 promises "a more ordinary explanation"; paragraph 3 draws the practical lesson.`,
        md`Paragraph 2 supplies that explanation: unreported conditions, with three examples of them, and the consequence that a diverging result may reveal an unknown variable.`,
        md`State the job and what it relates to: it gives the alternative explanation promised in the first paragraph, which the third paragraph builds on.`,
      ],
      answerMd: md`It sets out the ordinary explanation (unreported conditions) that the first paragraph says is obscured by the misconduct view. A choice saying it "lists the errors careless researchers make" is the trap: the conditions it lists are not errors.`,
    },
    {
      id: 'example-detail-purpose',
      title: 'Why mention a detail?',
      problemMd: md`Using the replication passage: *"The author mentions the time of day measurements were taken primarily in order to..."*`,
      steps: [
        md`Find the sentence: it is one of three examples of "conditions that their authors did not think to report because they seemed too obvious to mention".`,
        md`Ask what claim the example serves: that experiments depend on unreported conditions, which can differ between laboratories.`,
        md`Phrase the answer as illustration of that claim, not as a claim about time of day itself.`,
      ],
      answerMd: md`To illustrate the kind of seemingly trivial, unreported condition that can make a second laboratory's results differ. A choice claiming the author "recommends taking measurements at a fixed time" turns an illustration into advice the passage never gives.`,
    },
  ],
  traps: [
    {
      title: 'The too-narrow main idea',
      md: md`A choice that accurately repeats one paragraph feels safe because you can find it in the text. But a main idea must cover the passage. If a choice would be equally good as the summary of one paragraph alone, it is probably too narrow.`,
    },
    {
      title: 'The verb that overcommits or undercommits',
      md: md`"To prove" for a passage that suggests, or "to describe" for a passage that argues, misstates the author's stance. Check the verb against the author's evaluative words before you read the object.`,
    },
    {
      title: 'Half-right choices',
      md: md`Many wrong choices begin exactly as you predicted and then add one unsupported claim: "...and recommends that journals ban such studies". Read to the last word; a choice is only as right as its weakest part.`,
    },
    {
      title: 'True but not the function',
      md: md`In function questions, choices often state something the passage really says. That is not enough; the question asks why the part is there. Ask what the part does for the main point.`,
    },
  ],
  check: [
    {
      id: 'check-translation-purpose',
      title: 'Primary purpose',
      topic: 'Reading Comprehension',
      stimulusMd: translationPassage,
      stemMd: md`The primary purpose of the passage is to`,
      options: [
        { id: 'A', text: md`argue that free translations of poetry are superior to faithful ones`, note: md`The author says the right rendering is "sometimes a literal rendering, sometimes a loose one"; neither policy is declared superior.` },
        { id: 'B', text: md`explain why poetry cannot be successfully translated`, note: md`The passage says plainly "None of this makes translation impossible".` },
        { id: 'C', text: md`challenge a common way of framing the choices in poetry translation and propose a different account of the translator's task`, note: '' },
        { id: 'D', text: md`trace the history of the debate between faithful and free translators`, note: md`The passage describes the debate's terms, not its history; there is no sequence of events or periods.` },
        { id: 'E', text: md`defend faithful translation against the charge that it betrays the poet`, note: md`The author criticises the faithful camp's assumption as much as the free camp's, and defends neither.` },
      ],
      answer: 'C',
      workingMd: md`Map: (1) the fidelity-versus-freedom debate; (2) the debate assumes sense and music can be separated, and often they cannot; (3) translation is still possible: the real task is finding what carries meaning, line by line, and the debate distracts from it. The author challenges the framing and proposes another account of the task. Choosing a side, declaring translation impossible or tracing a history all misread the passage.`,
      lesson: 'When an author attacks the terms of a debate, the purpose is to reframe it, not to win it for one side.',
    },
    {
      id: 'check-translation-paragraph-two',
      title: 'Role of the second paragraph',
      topic: 'Reading Comprehension',
      stimulusMd: translationPassage,
      stemMd: md`The second paragraph serves primarily to`,
      options: [
        { id: 'A', text: md`present the argument that free translators use against faithful ones`, note: md`The paragraph speaks in the author's voice against an assumption both camps share; it is not one camp's argument.` },
        { id: 'B', text: md`concede that sense and music can usually be separated`, note: md`This reverses the paragraph, which says that in much poetry they cannot be separated.` },
        { id: 'C', text: md`propose the method the author recommends to translators`, note: md`The recommended approach, identifying what carries the meaning line by line, comes in the third paragraph.` },
        { id: 'D', text: md`question an assumption underlying the debate and illustrate why it often fails`, note: '' },
        { id: 'E', text: md`provide historical evidence about how poems have been translated`, note: md`The paragraph's illustrations are general (a rhythm, a rhyme), not historical evidence about past translations.` },
      ],
      answer: 'D',
      workingMd: md`The paragraph opens by naming the assumption the debate makes ("that sense and music can be separated"), says that in much poetry they cannot, and illustrates with rhythm signalling irony and rhyme joining words. That is questioning an assumption and illustrating its failure. The method comes later, and neither camp's argument is being presented.`,
      lesson: 'A function answer names the job and what it acts on: here, an assumption of the debate.',
    },
    {
      id: 'check-translation-rhyme',
      title: 'Why mention rhyme?',
      topic: 'Reading Comprehension',
      stimulusMd: translationPassage,
      stemMd: md`The author mentions that "a rhyme may join two words whose connection is the poem's whole point" primarily in order to`,
      options: [
        { id: 'A', text: md`illustrate a way in which a poem's sound can carry part of its meaning`, note: '' },
        { id: 'B', text: md`argue that translators should always preserve a poem's rhymes`, note: md`The author never says rhyme should always be kept; the third paragraph says the right means varies line by line.` },
        { id: 'C', text: md`show that rhyming poems are harder to translate than unrhymed ones`, note: md`The passage never compares rhymed with unrhymed poems.` },
        { id: 'D', text: md`give an example of a successful free translation`, note: md`No particular translation, free or faithful, is discussed.` },
        { id: 'E', text: md`criticise poets who rely on rhyme to make their point`, note: md`The author treats rhyme carrying meaning as a feature of poetry, not as a fault of poets.` },
      ],
      answer: 'A',
      workingMd: md`The rhyme sentence sits beside the rhythm sentence, both supporting the claim that sense and music often cannot be separated. Its job is to show sound carrying meaning. Turning it into a rule for translators, a difficulty ranking, an example of a translation or a criticism of poets each adds something the passage does not say.`,
      lesson: 'A detail is usually there to support the claim of its sentence or paragraph; name that claim.',
    },
  ],
  takeaways: [
    'Predict the main idea, purpose or function from your map before reading the choices.',
    'A main idea must be the author\'s and must cover the whole passage.',
    'Check the verb of a purpose choice against how committed the author is.',
    'A function answer names the job and what the part relates to.',
    'One unsupported word makes a choice wrong.',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-reading-comprehension', skill: 'rc-main-idea' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const inferenceAndApplication: Lesson = {
  slug: 'inference-and-application',
  title: 'Inference and application questions',
  summary: 'Pick the inference the passage forces, not the one it merely allows, and apply a passage\'s idea to a new case by matching its structure.',
  minutes: 24,
  objectives: [
    'Choose the inference that must be true given the passage, rejecting those that are only plausible.',
    'Use the strength of the passage\'s language to judge how strong an inference can be.',
    'Apply a principle from a passage to a new situation by matching its structure, not its topic.',
  ],
  teachMd: md`
### What "infer" means here

In everyday speech, to infer is to guess sensibly. In Reading Comprehension it means something stricter: the right answer is a statement that **must be true**, or is very strongly supported, given what the passage says. It usually takes one short step beyond the text: combining two sentences, restating a claim in other words, or drawing the obvious consequence of a statement.

That is why the right answer often looks modest. The wrong answers are frequently more interesting, more sweeping or more in line with what you already believe. Interesting is not the test. Support is.

### The proof test

For every inference choice, ask: *which sentence or sentences make this true?* If you can point to them and the step from them is short, keep the choice. If you need an extra assumption the passage does not give, reject it.

Typical failures:

| Failure | Looks like |
| --- | --- |
| Goes beyond | The passage says *some* towns lost beaches; the choice says *most*. |
| Reverses | The passage says silence discouraged employees; the choice says rejection did. |
| Outside knowledge | The choice is true in the world but not supported by the passage. |
| Wrong voice | The choice states a view the passage reports and rejects. |
| Wrong comparison | The passage compares A and B; the choice ranks A against C. |

### Watch the strength words

The passage's own qualifiers set a ceiling on what can be inferred. "May", "sometimes", "often", "some" and "for a time" are weak; "always", "never", "all", "must" and "only" are strong. A choice can be as strong as the passage or weaker; it cannot be stronger.

If the passage says dunes "can protect property for a time", the choice "dunes protect property permanently" goes beyond it, while "dunes do not necessarily protect property indefinitely" stays within it.

### Application: carry the idea to a new case

Application questions ask you to use something from the passage in a situation the passage never mentions: "Which of the following is most analogous to...?", "The author would most likely recommend which action?", "Which situation best illustrates the principle described?"

The method:

1. **State the idea abstractly.** Strip out the topic. A seawall becomes "a defence that protects one thing by redirecting a force onto something else that is also valuable".
2. **Match structure, not subject.** The right answer usually has a different topic and the same structure. A choice about another kind of coastal defence may share the topic and miss the structure.
3. **Check every part.** If the idea has three parts (protects X, harms Y, by redirecting rather than absorbing), the right analogy has all three.

The most common wrong answers in application questions share the passage's *topic* or vocabulary but not its logic. They feel familiar, which is exactly why they tempt.

### Recommendations

When asked what an author or researcher "would most likely recommend", find the passage's stated conclusion or principle, and look for the action that follows directly from it. Reject actions the passage argues against, actions it treats as less important, and actions that address a different problem.

### "The author would most likely agree"

A close cousin of inference asks what the author would agree with. Treat it the same way, with one addition: check voice. The author would agree with their own conclusions and with what follows from them, but not necessarily with every view the passage reports. A statement taken from a paragraph that begins "critics argue" is the critics' view until the author endorses it.

### Reread narrowly

Inference questions tempt you to reread the whole passage. Do not. Use the map to go to the one or two sentences each choice depends on, check the step and the strength words, and move on. The proof test is quick precisely because it asks one narrow question of each choice.
`,
  examples: [
    {
      id: 'example-seawall-inference',
      title: 'Choosing the inference the passage forces',
      problemMd: seawallPassage + md`

Which of these can be inferred? (1) "Seawalls should never be built." (2) "A beach in front of a seawall may narrow even if the property behind the wall is protected." (3) "Managed retreat is the cheapest way to preserve a beach."`,
      steps: [
        md`Statement 2: paragraph 1 says reflected waves strip sand so that "over a period of years the beach narrows", and that some towns "preserved the property and lost the beach". The step is short and the strength matches ("may"). Keep.`,
        md`Statement 1: the passage describes a cost of seawalls, but never says they should not be built. "Never" is far stronger than anything stated. Reject.`,
        md`Statement 3: paragraph 2 says managed retreat is "expensive". The choice contradicts the passage. Reject.`,
      ],
      answerMd: md`Statement 2. Statement 1 is the tempting one, because it feels like the passage's message, but the passage only shows a trade-off and never makes a recommendation.`,
    },
    {
      id: 'example-seawall-analogy',
      title: 'Matching structure, not topic',
      problemMd: md`Using the seawall passage in the first example: which situation is most analogous to the effect of a seawall as described? (1) A town builds a larger seawall after a storm. (2) A drainage channel keeps one field dry by sending its water onto a neighbouring field, which floods. (3) A dune is planted with grass to hold sand in place.`,
      steps: [
        md`State the idea abstractly: a defence protects one thing by redirecting a force rather than absorbing it, and the redirected force damages something else of value.`,
        md`Situation 1 shares the topic (seawalls) but adds nothing about redirection or a second thing harmed. It repeats the subject, not the structure.`,
        md`Situation 2: the channel protects one field (the property) by redirecting water (the force) onto another field (the beach), which suffers. All three parts match.`,
        md`Situation 3 is the passage's alternative, which absorbs rather than redirects; it is the opposite structure.`,
      ],
      answerMd: md`Situation 2. Situations 1 and 3 share the coastal topic, which is exactly what makes them tempting; neither has the protect-by-redirecting-onto-something-else structure.`,
    },
  ],
  traps: [
    {
      title: 'The plausible but unsupported inference',
      md: md`A choice that sounds reasonable and matches the passage's mood is not thereby supported. Insist on the sentences that make it true. If you need "probably" or "usually" to get there and the passage does not say it, reject the choice.`,
    },
    {
      title: 'Upgrading the strength',
      md: md`"Some", "may" and "for a time" in the passage cannot support "most", "will" or "permanently" in a choice. Compare the qualifiers word for word; a stronger choice is a wrong choice.`,
    },
    {
      title: 'Same topic, different logic',
      md: md`In analogy questions, the choice that mentions the passage's subject is often a trap. Abstract the passage's idea first, then look for the same structure under a different topic.`,
    },
    {
      title: 'Recommending what the passage downplays',
      md: md`If a passage says success depends "less on X than on Y", a recommendation to increase X is the trap, even though X is mentioned favourably elsewhere. The recommendation must follow from the conclusion.`,
    },
  ],
  check: [
    {
      id: 'check-suggestion-inference',
      title: 'What must be true',
      topic: 'Reading Comprehension',
      stimulusMd: suggestionPassage,
      stemMd: md`Which of the following can be inferred about the employees in the schemes the researchers examined?`,
      options: [
        { id: 'A', text: md`Most of them had run out of ideas after the schemes' first months.`, note: md`That is the managers' conclusion, which the passage introduces in order to offer another cause.` },
        { id: 'B', text: md`Being promptly told that an idea would not be used did not, by itself, make them much less likely to submit another.`, note: '' },
        { id: 'C', text: md`Those whose ideas were adopted received large prizes.`, note: md`Large prizes are mentioned only as a policy some organisations use; nothing says the schemes studied paid them.` },
        { id: 'D', text: md`Rejection discouraged them more than silence did.`, note: md`This reverses the passage, which says what discouraged them "was not rejection but silence".` },
        { id: 'E', text: md`They valued rewards for adopted suggestions more than replies to their suggestions.`, note: md`The passage says the scheme's success depends less on rewards than on replies, which points the other way, and it reports nothing about what employees valued.` },
      ],
      answer: 'B',
      workingMd: md`The second paragraph says employees who received a prompt explanation of why their idea would not be used were "about as likely to submit again" as those whose ideas were accepted. So a prompt rejection, by itself, did not make them much less likely to submit again. The other choices repeat the managers' rejected view, add facts the passage does not give, or reverse what it says.`,
      lesson: 'The right inference restates or combines what the passage says; it is often more modest than the wrong ones.',
    },
    {
      id: 'check-suggestion-recommendation',
      title: 'Applying the conclusion',
      topic: 'Reading Comprehension',
      stimulusMd: suggestionPassage,
      stemMd: md`An organisation's suggestion scheme has gone quiet after a busy start. Which action does the researchers' conclusion most directly support?`,
      options: [
        { id: 'A', text: md`Doubling the prize paid for each adopted suggestion`, note: md`The researchers say success depends less on rewards than on replies; raising prizes while leaving other ideas unanswered is the pattern they criticise.` },
        { id: 'B', text: md`Closing the scheme, since the employees have evidently run out of ideas`, note: md`This adopts the managers' explanation, which the passage replaces with another cause.` },
        { id: 'C', text: md`Publishing a newsletter that lists only the suggestions that were adopted`, note: md`Every suggestion that was not adopted would still go unanswered, and silence is what the passage says discourages people.` },
        { id: 'D', text: md`Asking employees to submit fewer but better-developed suggestions`, note: md`The passage does not identify the quality or number of suggestions as the problem; this addresses a different issue.` },
        { id: 'E', text: md`Committing to reply to every suggestion within a short fixed period, explaining the decision`, note: '' },
      ],
      answer: 'E',
      workingMd: md`The researchers conclude that a scheme's success depends "less on rewards for good ideas than on a reliable, quick response to every idea". A firm commitment to reply promptly to every suggestion, with reasons, follows directly. Bigger prizes and a list of adopted ideas leave the silence in place, closing the scheme accepts the rejected explanation, and asking for fewer ideas addresses a problem the passage never identifies.`,
      lesson: 'A recommendation question is answered by the action that follows directly from the passage\'s stated conclusion.',
    },
    {
      id: 'check-suggestion-analogy',
      title: 'The analogous situation',
      topic: 'Reading Comprehension',
      stimulusMd: suggestionPassage,
      stemMd: md`Which of the following is most closely analogous to the problem the study identifies?`,
      options: [
        { id: 'A', text: md`A shop's sales fall after it raises its prices.`, note: md`This is a response to a cost, not to a lack of acknowledgement; the structure of contribution followed by silence is missing.` },
        { id: 'B', text: md`Volunteers leave a charity after their proposals are openly rejected at a meeting.`, note: md`Here the discouragement comes from rejection, which the passage says was not the problem; it shares the topic of proposals but not the cause.` },
        { id: 'C', text: md`Residents stop reporting broken streetlights to a council website after finding their reports are never acknowledged, even when the lights are eventually fixed.`, note: '' },
        { id: 'D', text: md`A contest receives more entries after its prize is increased.`, note: md`This is about rewards increasing participation, the factor the passage says matters less, and it describes growth rather than a scheme falling silent.` },
        { id: 'E', text: md`A team improves its results after hiring a new coach.`, note: md`Nothing in this situation involves contributions that go unanswered.` },
      ],
      answer: 'C',
      workingMd: md`Abstractly, the problem is: people contribute something, receive no acknowledgement even when their contribution is acted on, and stop contributing. The streetlight reports match every part: contributions, silence, action taken anyway, contributions stop. The volunteers who are openly rejected share the topic but have the opposite cause, and the price, prize and coach situations lack the structure entirely.`,
      lesson: 'For an analogy, abstract the idea into its parts and find the choice that has every part, whatever its topic.',
    },
  ],
  takeaways: [
    'An inference must be forced by the passage, usually one short step from the text.',
    'A choice may be as strong as the passage or weaker, never stronger.',
    'For analogies, abstract the idea, then match structure rather than topic.',
    'A recommendation follows from the passage\'s stated conclusion, not from what it mentions in passing.',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-reading-comprehension', skill: 'rc-inference' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const detailAndStyle: Lesson = {
  slug: 'detail-and-style',
  title: 'Detail, tone and style questions',
  summary: 'Answer "according to the passage" questions by going back to the line, and read an author\'s tone from the words that judge.',
  minutes: 20,
  objectives: [
    'Locate the sentence a detail question depends on and match it to a faithful paraphrase.',
    'Reject choices that are true in the world, true elsewhere in the passage, or distorted.',
    'Identify an author\'s tone from evaluative language and choose a description of matching strength.',
  ],
  teachMd: md`
### Detail questions: the answer is in a sentence

Detail questions ask what the passage says: "According to the passage...", "The passage states that...", "Which of the following is mentioned as...?" They are the most direct questions on a passage, and the most often missed, because readers answer them from memory.

Never answer a detail question from memory. Use your map to find the paragraph, find the sentence, and read it again. Then look for the choice that says the same thing in different words.

### Paraphrase, not copy

The right answer rarely repeats the passage's words. It paraphrases them: "estimate how much of a pattern reflects observers' habits and correct for it" may appear as "allow analysts to adjust for the influence of observers' behaviour". Meanwhile, wrong answers often *do* reuse the passage's words, attached to the wrong idea.

So match meaning, not vocabulary. If a choice contains a striking phrase from the passage, check that it uses the phrase for the same claim.

### Four ways a detail choice goes wrong

| Problem | What it looks like |
| --- | --- |
| Distortion | Right topic, changed claim: "many" becomes "most", "cover more ground" becomes "more accurate". |
| Wrong place | Something the passage says, but about a different thing or answering a different question. |
| Not stated | Plausible, even true in the world, but nowhere in the passage. |
| Reversed | The passage's claim turned around, often with a negation added or removed. |

"Not stated" is the subtlest. Outside knowledge does not count, however accurate. If you cannot point to the sentence, the choice is wrong.

### Detail purpose versus detail content

Some questions ask *what* a detail is ("The passage mentions which of the following as a concern?") and others *why* it is there ("The author mentions X in order to..."). The first is a detail question: go to the line. The second is a function question: go to the claim the line supports. Read the stem carefully to know which you have.

### Tone and attitude

Tone questions ask how the author regards something: "The author's attitude toward X is best described as..." The evidence is the author's evaluative words: *sound*, *misleading*, *imperfect*, *a mistake*, *deserves scrutiny*. Collect them, then decide two things:

1. **Direction:** positive, negative, or mixed.
2. **Strength:** mild, moderate or strong.

Authors of passages like the ones in this course are usually measured, so the right tone is often mixed or moderate: *qualified approval*, *cautious optimism*, *measured scepticism*. Extreme tones (*outrage*, *uncritical enthusiasm*, *contempt*) are possible but need extreme language in the passage to support them.

A passage that reports both sides and then judges is not *neutral*. A passage that praises something while naming its limits is not *enthusiastic*. Match both direction and strength.

### Style questions

Style questions ask about how the passage is written: the kind of evidence it uses (examples, comparisons, data), how it handles opposing views (concedes, rejects, reframes) or the register of its language. Answer them from the map and the evaluative words, as for tone. A passage built on hypothetical illustrations does not "rely on statistical evidence", even if it mentions a quantity once.

### "Except" and "not" questions

Some detail questions are reversed: "Each of the following is mentioned in the passage EXCEPT..." Here four choices are stated and one is not. The method is the same, applied four times: find each choice's sentence, and the one you cannot find is the answer. Read the stem twice before you start, because answering the ordinary version of a reversed question is one of the easiest ways to lose a mark you had earned. A quick note of "EXCEPT" in your scratch work helps.
`,
  examples: [
    {
      id: 'example-detail-line',
      title: 'Going back to the line',
      problemMd: cleaningPassage + md`

According to the passage, why have cautious cleaning methods not settled the argument about cleaning old paintings?`,
      steps: [
        md`Map: (1) cleaning reveals colours but may remove the artist's glazes; (2) cautious methods made mistakes rarer, but taste keeps the argument alive; (3) author: viewers' reactions matter but should not decide.`,
        md`The question is in paragraph 2. The sentence: "They have not settled the argument, because the argument is partly about taste."`,
        md`Read the next sentence for what "taste" means here: viewers used to the golden tone of an uncleaned picture may find cleaned colours harsh, even if they are what the painter intended.`,
      ],
      answerMd: md`Because part of the disagreement concerns taste: viewers accustomed to the darkened appearance may dislike the cleaned colours even when those colours are accurate. A tempting distortion is "because the methods still often remove the artist's glazes"; the passage says the methods made mistakes rarer, not that they still fail often.`,
    },
    {
      id: 'example-tone',
      title: 'Reading the author\'s attitude',
      problemMd: md`Using the cleaning passage in the first example: which best describes the author's attitude toward viewers who prefer uncleaned paintings? (1) contempt; (2) sympathetic but unpersuaded; (3) wholehearted agreement.`,
      steps: [
        md`Collect the evaluative words in paragraph 3: "a mistake to dismiss such reactions as mere nostalgia" (sympathy) and "equally mistaken to let them decide the matter" (disagreement).`,
        md`Direction: mixed. Strength: moderate; the language is calm and balanced ("it would be a mistake", "equally mistaken").`,
        md`Match: contempt is too negative and contradicts "a mistake to dismiss"; wholehearted agreement contradicts "equally mistaken to let them decide".`,
      ],
      answerMd: md`Sympathetic but unpersuaded. The author takes the reactions seriously but holds that they should not decide what is done to a painting.`,
    },
  ],
  traps: [
    {
      title: 'Answering from memory',
      md: md`Detail questions punish the reader who is sure what the passage said. One changed word, "most" for "many", is enough to make a choice wrong. Go back to the sentence every time; it takes seconds with a map.`,
    },
    {
      title: 'The borrowed phrase',
      md: md`A choice that repeats a vivid phrase from the passage feels right. Check that the phrase is attached to the same claim; wrong answers often reuse the passage's words for a different idea.`,
    },
    {
      title: 'True, but not in the passage',
      md: md`A choice that is accurate in the world but not stated in the passage is wrong for "according to the passage" questions. If you cannot point to the sentence, reject it.`,
    },
    {
      title: 'Extreme tone for a measured author',
      md: md`An author who calls objections "sound" and the result "imperfect" but useful is not enthusiastic and not hostile. Match strength as well as direction; most authors on these passages are measured.`,
    },
  ],
  check: [
    {
      id: 'check-bird-detail',
      title: 'According to the passage',
      topic: 'Reading Comprehension',
      stimulusMd: birdPassage,
      stemMd: md`According to the passage, researchers now ask observers to note how long they looked and where they walked in order to`,
      options: [
        { id: 'A', text: md`increase the number of rare species recorded`, note: md`The passage's concern is the opposite: observers already over-report rare birds, and the new requests aim to correct distortions, not add rare records.` },
        { id: 'B', text: md`allow analysts to estimate and correct for the effect of observers' habits on the patterns in the data`, note: '' },
        { id: 'C', text: md`replace professional surveys of bird populations entirely`, note: md`The passage says the maps cover more ground than surveys could afford to for many common species; it never says they replace surveys.` },
        { id: 'D', text: md`identify which observers are the most skilled`, note: md`Observer skill is never mentioned; the information is used to adjust patterns, not to rank people.` },
        { id: 'E', text: md`discourage observers from visiting places that are easy to reach`, note: md`The passage names easy-to-reach places as a source of bias but says the response is to record effort and correct for it, not to change where observers go.` },
      ],
      answer: 'B',
      workingMd: md`The third paragraph says researchers ask observers to record every species, how long they looked and where they walked, and that "with this information, analysts can estimate how much of a pattern reflects observers' habits and correct for it." That is the stated purpose. The other choices add aims the passage never gives or overstate what it says.`,
      lesson: 'Answer detail questions from the sentence itself, then pick the faithful paraphrase.',
    },
    {
      id: 'check-bird-tone',
      title: 'The author\'s attitude',
      topic: 'Reading Comprehension',
      stimulusMd: birdPassage,
      stemMd: md`The author's attitude toward the use of amateur birdwatching records in research is best described as`,
      options: [
        { id: 'A', text: md`uncritical enthusiasm`, note: md`The author calls the objections "sound" and the maps "imperfect"; that is not uncritical.` },
        { id: 'B', text: md`detached neutrality`, note: md`The author takes a position: the objections are "problems of method rather than reasons for dismissal".` },
        { id: 'C', text: md`growing scepticism`, note: md`The passage moves the other way, from early wariness to the view that the problems can be corrected.` },
        { id: 'D', text: md`reluctant rejection`, note: md`The author does not reject the records; the closing sentence values their coverage.` },
        { id: 'E', text: md`qualified approval`, note: '' },
      ],
      answer: 'E',
      workingMd: md`The evaluative words point both ways: the objections are "sound" and the maps "imperfect" (limits acknowledged), but the objections are "problems of method rather than reasons for dismissal" and the maps cover more ground than surveys could afford (approval). Positive direction, moderate strength: qualified approval.`,
      lesson: 'Judge tone by direction and strength together, from the author\'s own evaluative words.',
    },
    {
      id: 'check-bird-stated',
      title: 'Which is stated?',
      topic: 'Reading Comprehension',
      stimulusMd: birdPassage,
      stemMd: md`Which of the following is stated in the passage?`,
      options: [
        { id: 'A', text: md`Professional ecologists now rely mainly on amateur records.`, note: md`The passage says researchers have begun to use the records, not that ecologists rely mainly on them.` },
        { id: 'B', text: md`For rare species, maps built from amateur records are more accurate than professional surveys.`, note: md`The passage speaks of common species, and of coverage ("more ground, more often"), not of accuracy.` },
        { id: 'C', text: md`Ecologists' early objections were based on where amateurs choose to look and which birds they choose to report.`, note: '' },
        { id: 'D', text: md`The ecologists' early objections were mistaken.`, note: md`This reverses the author's verdict: the objections "were sound, and they have not disappeared".` },
        { id: 'E', text: md`Online platforms for sightings were designed by professional ecologists.`, note: md`The passage never says who designed the platforms.` },
      ],
      answer: 'C',
      workingMd: md`The second paragraph gives the objections: observers visit places that are easy to reach and pleasant to walk in, and report rare birds more eagerly than common ones. That is where they look and which birds they report. The other choices overstate the passage, swap common species and coverage for rare species and accuracy, reverse its verdict or add a fact it does not give.`,
      lesson: 'A "stated" choice must be traceable to a sentence; distortions change one word or one scope.',
    },
  ],
  takeaways: [
    'Answer detail questions from the sentence, never from memory.',
    'The right answer paraphrases; wrong answers often reuse the passage\'s words for a different claim.',
    'Outside knowledge does not make a choice stated.',
    'Tone has a direction and a strength; measured authors call for measured descriptions.',
  ],
  practice: { examKey: 'gmat', domain: 'verbal-reading-comprehension', skill: 'rc-supporting-idea' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const readingComprehensionUnit: Unit = {
  slug: 'reading-comprehension',
  title: 'Reading Comprehension',
  summary: 'Reading Comprehension shares the 45-minute Verbal Reasoning section with Critical Reasoning. These lessons build one method for every passage: map the structure, then answer main-idea, inference, application, detail and tone questions from the map and the text.',
  lessons: [passageMapping, mainIdeaAndStructure, inferenceAndApplication, detailAndStyle],
};
