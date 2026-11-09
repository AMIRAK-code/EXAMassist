import { md, type Lesson, type Unit } from '../../types';

/**
 * GRE Analytical Writing: the "Analyze an Issue" task. Every issue statement
 * here is original to this course. Scoring is described only as the research
 * record (docs/research/course-facts-2026-11-04.md) states it: a 0–6 score in
 * half points, a "6-point holistic scale" including an e-rater score, and
 * review by trained analysts and content experts. No rubric wording is given.
 */

const whatIsScored: Lesson = {
  slug: 'issue-task-what-is-scored',
  title: 'The Issue task: what it asks and how it is scored',
  summary: 'What the 30-minute "Analyze an Issue" task asks of you, what ETS says about its scoring, and what a position worth defending looks like.',
  minutes: 18,
  objectives: [
    'Describe where the Issue task sits in the GRE and what ETS states about how it is scored.',
    'Read an issue statement for its key terms, its scope words and its hidden comparison.',
    'Tell a qualified position apart from fence-sitting, and write a one-sentence thesis that commits.',
  ],
  teachMd: md`
### Where the task sits

The GRE General Test opens with Analytical Writing, and the section holds one task, "Analyze an Issue", with 30 minutes to complete it. It always comes first; the Verbal and Quantitative sections follow it in any order. The whole test takes about 1 hour and 58 minutes, so the essay is about a quarter of your time in the room, and it is the first thing you do while you are fresh.

### What the task asks

The task's name describes the job. You are given a short statement on an issue and asked to analyse it: work out exactly what it claims, decide how far you agree, and argue for that view. Read any instructions that come with the statement as carefully as the statement itself, and answer exactly what they ask; an excellent essay on a neighbouring question is still an essay on the wrong question.

Every issue statement in this course is our own invention, written for practice.

### What ETS says about scoring

This is everything this course states about how the essay is scored, because it is everything the ETS pages we checked say:

- The Analytical Writing score runs from 0 to 6 in half-point increments, and it is reported as a single score.
- ETS describes the scoring as a "6-point holistic scale", and says the score includes a score from the e-rater engine, an automated scoring program.
- ETS also says essays are reviewed by "trained analysts" using similarity-detection software, and by "experienced content experts".

Those pages do not publish a scoring formula or say how any human judgement and the e-rater score are combined, so we make no claim about either. Two practical points follow from what *is* stated.

**Holistic means the essay is judged as a whole.** There is no list of features that each earn a fixed number of points. A brilliant sentence does not rescue an essay with no position, and a typing slip does not sink a clear, well-supported argument. Aim at the overall impression a careful reader takes away.

**Similarity review means the words must be yours, written for this statement.** A memorised essay, a template of stock paragraphs or borrowed sentences can match text written elsewhere, and matching text is what similarity-detection software looks for. Practise a method, not a script.

### What a persuasive response does

The following is this course's advice on what makes any careful reader judge an argument persuasive. It is not a scoring rubric, and it does not paraphrase one.

1. **A position the reader can find in one sentence.** If someone asked "so what do you think?", your thesis should answer them.
2. **Qualifications where the claim breaks down.** Most issue statements are too broad to be simply right or simply wrong. Saying *when* or *why* the claim fails shows that you have analysed it rather than reacted to it.
3. **Reasons, each developed with a specific example.** A reason tells the reader why; an example shows that the reason holds somewhere real.
4. **The strongest objection, answered.** Taking on the best case against you is more convincing than ignoring it.
5. **Organisation and clear sentences.** The reader should never have to work out how a paragraph connects to your thesis.

### Agree, disagree or qualify

| Position | What it sounds like | Its risk |
| --- | --- | --- |
| Full agreement | "The statement is right." | Ignores obvious exceptions the reader will think of. |
| Full disagreement | "The statement is wrong." | Easy to slide into attacking an extreme version nobody holds. |
| Qualified | "It is right when..., but not when..." | Turns into fence-sitting if the line is vague. |

A qualified position is not "there are good points on both sides". It draws a line through the issue and says which side of the line you stand on, and why the line falls there. "Both sides have merit" commits to nothing; "competition improves schools when they are judged on the same measures, but harms them when the measures differ" commits to something a reader could dispute. That is what makes it worth arguing.

### Reading the statement before you take a side

Three things in a statement decide what you are really arguing about.

- **Key terms.** Words such as "success", "progress" or "education" can mean several things. Decide what you take them to mean, and say so early.
- **Scope words.** "All", "always", "should", "only", "never" and "most" set how strong the claim is. Strong scope words are where your qualifications will come from: a claim that something is *always* true is broken by one clear counterexample.
- **Hidden comparisons.** "Rather than", "more than" and "instead of" turn a claim into a trade-off. If a statement says money should go to A rather than B, your essay has to weigh A against B, not just praise A.

Spend the first minute here. A position built on a misread statement cannot be repaired by good writing later.
`,
  examples: [
    {
      id: 'example-decoding-a-statement',
      title: 'Decoding a statement before taking a side',
      problemMd: md`Statement: *"Towns should spend public money on preserving their old buildings rather than on building new ones."* Before deciding what you think, identify what the statement actually claims.`,
      steps: [
        md`**Key terms.** "Public money" means taxes, so the question is about public priorities, not what private owners do. "Old buildings" is vague: a medieval church and a 1970s car park are both old. Decide that you mean buildings with historical or civic value.`,
        md`**Scope word.** "Should" makes this a claim about policy. There is no "always", but the statement is unconditional: it does not say "sometimes" or "where possible".`,
        md`**Hidden comparison.** "Rather than" makes it a trade-off. The essay must weigh preservation against new construction for the same money, not just argue that old buildings are nice.`,
        md`**Where it might break.** A town short of housing or schools may need new buildings more than restored ones. That is the case where the claim is weakest, and the natural place for a qualification.`,
      ],
      answerMd: md`The statement claims that, when public money must be divided, preservation should win over new construction. A thesis that only praises old buildings misses the trade-off; a strong one says when preservation should win and when it should not, for example "preservation should come first only once a town's basic needs for housing and services are met".`,
    },
    {
      id: 'example-choosing-a-thesis',
      title: 'Choosing between three draft theses',
      problemMd: md`Statement: *"People learn more from their failures than from their successes."* A writer drafts three theses. Which is the best basis for the essay?

1. "Failure and success both teach us things, and each person is different."
2. "Failure teaches more than success only when someone works out why the failure happened; an unexamined failure teaches less than a success, which at least shows a method that works."
3. "Failure is always the greatest teacher in every area of life."`,
      steps: [
        md`Test each draft against the one-sentence question: would a reader know what the writer thinks? Draft 1 fails: "both teach us things" and "each person is different" commit to nothing.`,
        md`Draft 3 commits, but with "always" and "every area" it can be broken by one clear case, such as a surgeon who learns a procedure by doing it correctly under supervision. The essay would spend its time defending an extreme.`,
        md`Draft 2 commits and draws a line: examined failure beats success, unexamined failure does not. It also gives the reason for the line, which tells the reader what the body paragraphs will show.`,
      ],
      answerMd: md`Draft 2. It takes a position, qualifies it at the point where the claim breaks, and says why. Draft 1 is the tempting "balanced" choice, but balance without a commitment is fence-sitting.`,
    },
    {
      id: 'example-holistic-paragraphs',
      title: 'Two ways to spend the same paragraph',
      problemMd: md`A writer arguing that "cities should make public transport free" has room for one more body paragraph. Option one lists five benefits in five sentences (less traffic, cleaner air, fairer access, busier shops, fewer parking problems). Option two takes one benefit, fairer access, and develops it: who currently cannot afford fares, what free transport would change for them, and why the cost is worth it. Which serves the essay better?`,
      steps: [
        md`Ask what a reader judging the essay as a whole takes from each. The list shows that benefits exist, but each one is asserted, not argued; a reader cannot tell which matters or why.`,
        md`The developed paragraph shows a reason working: a specific group, a specific change, and a reply to the obvious objection (the cost). That is the kind of analysis the task's name asks for.`,
        md`A holistic judgement does not add up points per idea, so five unsupported benefits are not worth five times one. Depth is what persuades.`,
      ],
      answerMd: md`Option two. One reason developed with an example and an answer to an objection persuades more than five reasons merely named. The tempting choice is the list, because it looks like more content.`,
    },
  ],
  traps: [
    {
      title: 'Fence-sitting dressed as balance',
      md: md`"There are strong arguments on both sides" feels mature, but it leaves the reader without a position to evaluate. Balance belongs in how you treat the other side, not in refusing to choose. Draw a line and say which side of it you are on.`,
    },
    {
      title: 'Answering a neighbouring question',
      md: md`A statement about *public* money becomes an essay about whether old buildings are beautiful; a statement about *should* becomes an essay about what usually happens. Before writing, restate the claim in your own words, including its scope words and any "rather than", and check your thesis against that restatement.`,
    },
    {
      title: 'Bringing a memorised essay',
      md: md`A prepared essay or a set of stock paragraphs cannot fit a statement you have not seen, and ETS says essays are reviewed with similarity-detection software. Prepare a method (reading the statement, finding the line, choosing examples) rather than text.`,
    },
    {
      title: 'Treating length or rare words as the goal',
      md: md`Nothing in what ETS states says the score counts words or rewards unusual vocabulary. Padding costs time that analysis needed, and a long word used slightly wrongly makes a sentence less clear. Use the plainest word that is exactly right.`,
    },
  ],
  check: [
    {
      id: 'check-best-thesis',
      title: 'A thesis that commits and qualifies',
      topic: 'Analyze an Issue',
      stemMd: md`Statement: *"Competition between schools improves the education that students receive."* Which thesis best takes a clear position and qualifies it?`,
      options: [
        { id: 'A', text: md`Competition between schools improves the education that students receive.`, note: md`This repeats the statement word for word. It commits, but it shows no analysis of where the claim holds or fails.` },
        { id: 'B', text: md`Competition can be good and it can be bad, and every school is different.`, note: md`This is fence-sitting: it names both sides but never says which the writer believes or when.` },
        { id: 'C', text: md`Competition improves schools when they are judged on the same fair measures, but harms students when schools compete by turning away pupils who are hard to teach.`, note: '' },
        { id: 'D', text: md`Competition is the only force that has ever improved any school anywhere.`, note: md`This commits, but "only", "ever" and "anywhere" make an extreme claim that one counterexample breaks; it is overstatement, not qualification.` },
        { id: 'E', text: md`Schools should stop giving grades so that students can learn for its own sake.`, note: md`This takes a position on a different issue (grading), not on competition between schools.` },
      ],
      answer: 'C',
      workingMd: md`A good thesis does two things: a reader can tell what the writer thinks, and it says where the claim holds and where it breaks. The thesis about fair measures and turning away pupils does both, and it names the mechanism behind each half, so the body paragraphs are already planned. The restatement shows no analysis, the "both sides" version and the off-topic grading claim do not take a position on this statement, and the absolute claim is easy to refute.`,
      lesson: 'A qualified thesis draws a line through the issue and says which side the writer stands on and why.',
    },
    {
      id: 'check-scoring-description',
      title: 'What ETS says about Issue scoring',
      topic: 'Analyze an Issue',
      stemMd: md`Which description of how the Issue response is scored matches what ETS states on the pages this course relies on?`,
      options: [
        { id: 'A', text: md`Two human readers each give a whole-number score from 1 to 6, and the two are averaged.`, note: md`The ETS pages this course relies on do not state a two-reader rule, and the reported score moves in half points from 0, not whole points from 1.` },
        { id: 'B', text: md`Separate marks for grammar, organisation and argument are added together to make the score.`, note: md`ETS calls the scale holistic: the essay is judged as a whole, not built from separate sub-scores added together.` },
        { id: 'C', text: md`It is scored from 130 to 170 in one-point increments, like the other two measures.`, note: md`That is the Verbal and Quantitative scale. Analytical Writing has its own 0 to 6 scale.` },
        { id: 'D', text: md`The e-rater engine alone produces the score, and no person ever looks at an essay.`, note: md`ETS says the score includes an e-rater score, not that it is the whole score, and it says essays are reviewed by trained analysts and content experts.` },
        { id: 'E', text: md`A single score from 0 to 6 in half-point steps, on a holistic scale that includes a score from the e-rater engine.`, note: '' },
      ],
      answer: 'E',
      workingMd: md`ETS states a single Analytical Writing score from 0 to 6 in half-point increments, describes a "6-point holistic scale", and says the score includes a score from the e-rater engine. The two-reader average and the e-rater-only version both go beyond or against what is stated, the added sub-scores contradict "holistic", and 130 to 170 belongs to the other measures.`,
      lesson: 'State only what ETS states about Issue scoring: 0 to 6 in half points, holistic, including an e-rater score.',
    },
    {
      id: 'check-memorised-essay',
      title: 'The prepared-essay plan',
      topic: 'Analyze an Issue',
      stemMd: md`A test taker plans to memorise a 500-word essay about technology and adapt it to whatever statement appears. Which is the best reason to drop the plan?`,
      options: [
        { id: 'A', text: md`The score depends on length, and a 500-word essay will be too short.`, note: md`Nothing ETS states says the score depends on length; the objection to the plan is about fit and originality, not word count.` },
        { id: 'B', text: md`The e-rater engine cannot read essays about technology.`, note: md`This is invented. ETS says nothing of the kind, and the topic of an essay is not the problem with the plan.` },
        { id: 'C', text: md`The response must answer the particular statement and its instructions, and ETS says essays are reviewed with similarity-detection software.`, note: '' },
        { id: 'D', text: md`Thirty minutes is too short to type 500 words from memory.`, note: md`Typing speed is not the real issue; even typed in time, a memorised essay would not address the statement it was given.` },
        { id: 'E', text: md`Statements about technology never appear on the GRE.`, note: md`Nothing this course states supports any claim about which topics appear, so this reason has no basis.` },
      ],
      answer: 'C',
      workingMd: md`A memorised essay was written before the writer saw the statement, so at best it answers a neighbouring question; and ETS says essays are reviewed by trained analysts using similarity-detection software, so text prepared in advance risks being flagged by that review. The other reasons rest on claims about length, e-rater, typing time or topics that nothing ETS states supports.`,
      lesson: 'Prepare a method for building an argument, never a text to reproduce.',
    },
  ],
  takeaways: [
    'One "Analyze an Issue" task, 30 minutes, always first in the GRE.',
    'ETS states a single 0 to 6 score in half points, on a "6-point holistic scale" that includes an e-rater score.',
    'Holistic means judged as a whole: depth and a clear position beat a list of points.',
    'A qualified thesis draws a line and commits to one side of it; "both sides have merit" commits to nothing.',
    'Read key terms, scope words and any "rather than" before you choose a position.',
  ],
  practice: { examKey: 'gre', domain: 'aw-analyze-an-issue', skill: 'aw-evaluate-issue-complexities' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const planning: Lesson = {
  slug: 'planning-an-issue-essay',
  title: 'Planning an Issue essay in five minutes',
  summary: 'Test the statement on cases to find your qualified position, then choose reasons, specific examples and the objection you will answer.',
  minutes: 20,
  objectives: [
    'Test an issue statement against concrete cases to find where it holds and where it breaks.',
    'Choose two or three distinct reasons, each with a specific example that supports it.',
    'Plan a reply to the strongest objection and turn the plan into a short outline.',
  ],
  teachMd: md`
### Why plan at all

Thirty minutes feels too short to spend any of it not writing. But an unplanned essay usually discovers its position halfway through, so the introduction promises one argument and the conclusion delivers another. A few minutes of planning buy an essay whose every paragraph points the same way. The time split below is this course's suggestion, not a rule:

| Phase | Suggested time | Output |
| --- | --- | --- |
| Plan | about 5 minutes | position, reasons, examples, objection |
| Write | about 20 minutes | introduction, body, conclusion |
| Revise | about 5 minutes | fixes that change meaning first, then errors |

### Step 1: test the claim on cases

The quickest way to find a position you can defend is to try the statement on concrete cases. Pick three or four situations it covers, from different areas of life, and ask in each: is the claim true here?

Take the statement *"Leaders should rarely change their minds."*

| Case | Does the claim hold? | Why |
| --- | --- | --- |
| A captain in a storm, mid-manoeuvre | Mostly yes | Wavering in a crisis costs more than a slightly worse plan. |
| A health minister facing new evidence | No | Refusing to update on evidence turns a mistake into a policy. |
| A company founder setting long-term values | Yes | Constant change makes values meaningless. |
| A coach whose tactic is failing at half-time | No | The point of the break is to adjust. |

The cases do not split at random. The claim holds for *values and commitments under pressure* and fails for *beliefs about facts when evidence changes*. That split is your qualified position: "Leaders should hold their principles steady but change their factual judgements whenever the evidence does." You did not invent the qualification; the cases showed it to you.

### Step 2: choose reasons that are really different

Two or three reasons are enough. Check that they are distinct: "it builds trust" and "people trust consistent leaders" are one reason in two coats. Good sets often come from different angles on the issue:

- **Effects on people** (who gains, who loses);
- **Practical results** (does it work, what does it cost);
- **Principle** (is it fair, is it honest, what does it assume).

### Step 3: give each reason a specific example

An example is specific when it has a who, a what and a consequence. "History shows that stubborn leaders fail" is not an example; it is the reason repeated. "A school head who keeps a timetable that staff and pupils have shown does not work, because changing it would look like weakness, and loses a term of teaching" is an example.

Examples can come from history, current affairs, science, work, study or everyday life. They can also be clearly labelled hypotheticals. What matters is that the example fits the reason closely and that you can explain the connection in a sentence or two. Do not invent statistics or present made-up events as fact; a reader who doubts one claim starts to doubt the rest.

### Step 4: find the strongest objection

Ask what a thoughtful person who disagreed with you would say first. Then plan a reply. Three kinds of reply work well:

- **Concede and limit:** "That is true in cases of type X, which is why my position excludes them."
- **Deny the premise:** show the objection rests on something false or overstated.
- **Outweigh:** admit the cost and argue the benefit is larger.

Do not answer a weak objection because it is easy to beat. A reader can tell, and the strongest objection is still standing at the end.

### Step 5: write the outline

The outline is a few lines, not sentences you will copy:

1. Introduction: key term defined if needed; thesis with its line.
2. Body 1: reason, example, link to thesis.
3. Body 2: reason, example, link to thesis.
4. Objection and reply (its own paragraph or the end of a body paragraph).
5. Conclusion: the line restated, with why it matters.

With that on the page, the writing phase is filling in a structure, not searching for an argument.
`,
  examples: [
    {
      id: 'example-national-service-outline',
      title: 'From statement to outline',
      problemMd: md`Statement: *"Every adult should be required to spend one year in national service, such as working in hospitals, schools or conservation."* Build a five-line outline.`,
      steps: [
        md`**Test cases.** A school leaver with no work experience: a year of service may help. A nurse already working in a hospital: compulsion adds nothing. A single parent of a newborn: compulsion causes harm. A wealthy graduate who has never met people outside their own circle: service may widen their view.`,
        md`**Find the line.** The benefits fall on people at a transition point, and the harms fall on people with existing duties. Position: "A year of service should be expected of young adults at the end of education, with exemptions for those who already carry caring or professional duties, rather than required of every adult."`,
        md`**Reasons.** (1) Effect on people: service at a transition gives skills and contacts at the moment they matter most. (2) Practical: hospitals and schools gain help, but only if participants are not pulled from work that already serves the public.`,
        md`**Objection.** "Exemptions will let the well connected avoid service." Reply (concede and limit): exemptions should be defined by duties, such as caring for a child or working in a public service, not by income or influence.`,
        md`**Outline.** Intro with thesis; Body 1, transition-point benefit with an example of a school leaver placed in a conservation project; Body 2, the cost of conscripting people already serving; objection and reply on exemptions; conclusion restating the line.`,
      ],
      answerMd: md`A qualified thesis (expected at a transition point, with duty-based exemptions), two distinct reasons, one objection with a reply. The tempting plan is to argue for or against "every adult" as written, which forces the essay to defend cases, such as the parent of a newborn, that are hard to defend.`,
    },
    {
      id: 'example-making-an-example-specific',
      title: 'Making an example specific',
      problemMd: md`A writer arguing that "public libraries matter more now than they did before the internet" drafts the example: *"Many people use libraries for lots of things these days."* Make it specific enough to support the reason "libraries give people without home internet access to services that now exist only online".`,
      steps: [
        md`Name a who: a job seeker who has no computer at home.`,
        md`Name a what: an employer accepts applications only through an online form, so the library computer is the only way to apply.`,
        md`Name a consequence, and link it to the reason: without the library, the online-only shift would shut this person out of the job; the internet has made the library more necessary for them, not less.`,
      ],
      answerMd: md`"A job seeker with no computer at home finds that an employer now takes applications only online; the library's computers are the difference between applying and not. For such people the internet has made the library more necessary, not less." The tempting fix, adding vague words such as "very many people", makes the sentence longer but no more specific.`,
    },
    {
      id: 'example-strongest-objection',
      title: 'Picking the objection to answer',
      problemMd: md`Thesis: *"Museums should let visitors photograph the collection, except where light could damage an object."* Which objection should the essay answer: (1) "Some visitors take bad photographs"; (2) "Visitors who photograph everything look at nothing, so photography spoils the visit it is meant to record"?`,
      steps: [
        md`Ask which objection a thoughtful opponent would raise first. Bad photographs harm nobody; objection 1 is easy to dismiss, which is why it is tempting and why answering it proves little.`,
        md`Objection 2 attacks the purpose of the policy: if photography replaces looking, the museum fails at its main job. It deserves an answer.`,
        md`Plan the reply: concede that some visitors photograph instead of looking, then outweigh it. A photograph lets a visitor return to an object, and banning cameras does not make anyone look harder; it only removes the record.`,
      ],
      answerMd: md`Answer objection 2, the stronger one, with a concede-and-outweigh reply. Answering objection 1 would look like engaging the other side while avoiding it.`,
    },
  ],
  traps: [
    {
      title: 'Planning the topic instead of the claim',
      md: md`Notes such as "libraries: books, computers, community" collect material about the topic but contain no position. Plans should start from what you think about the claim and when; the material is chosen to support that.`,
    },
    {
      title: 'Three reasons that are one reason',
      md: md`"It builds trust", "people believe consistent leaders" and "followers rely on them" all say the same thing. Each body paragraph should be able to stand without the others. If two of your reasons could share an example, they are probably one reason.`,
    },
    {
      title: 'Examples that need a page of set-up',
      md: md`A historical episode you half remember will take a paragraph to explain and may still contain errors. Choose examples you can state accurately in two or three sentences, and never invent figures or present invented events as fact.`,
    },
    {
      title: 'Answering a straw man',
      md: md`Picking the weakest objection to defeat looks like engagement but leaves the real objection standing. Ask what the smartest person who disagrees with you would say, and answer that.`,
    },
  ],
  check: [
    {
      id: 'check-distinct-reasons',
      title: 'Two reasons that are really two',
      topic: 'Analyze an Issue',
      stemMd: md`Thesis: *"Cities should close their central districts to private cars, provided public transport is improved first."* Which pair of body-paragraph reasons gives the essay two genuinely distinct lines of support?`,
      options: [
        { id: 'A', text: md`Cars cause traffic in the centre; traffic in the centre is caused by too many cars.`, note: md`These are one claim stated twice, in reverse. The second paragraph would add nothing to the first.` },
        { id: 'B', text: md`Car-free centres make streets safer and quieter for the people who live and shop there; and they free road space that buses and bicycles can use more efficiently.`, note: '' },
        { id: 'C', text: md`Cars are expensive to own; many people enjoy driving.`, note: md`Neither supports the thesis: running costs are beside the point, and enjoying driving is a reason against closing the centre.` },
        { id: 'D', text: md`Car-free centres are better; people prefer car-free centres.`, note: md`The first only restates the thesis, and the second is an unsupported claim about preferences, not a reason the policy works.` },
        { id: 'E', text: md`Electric cars produce no exhaust; some cities already have trams.`, note: md`The first fact cuts against the thesis (it suggests cleaner cars instead of closure), and the second is a loose fact with no stated link to the argument.` },
      ],
      answer: 'B',
      workingMd: md`Two reasons are distinct when each stands without the other and both support the thesis. Safety and quiet for residents is an effect on people; freeing road space for buses and bicycles is a practical, transport-efficiency reason. The other pairs either repeat one idea, restate the thesis, or offer facts that do not support it or even cut against it.`,
      lesson: 'Check that each reason supports the thesis and could stand in its own paragraph without the other.',
    },
    {
      id: 'check-specific-example',
      title: 'The example that does the work',
      topic: 'Analyze an Issue',
      stemMd: md`Reason: *"Requiring students to work in groups prepares them for jobs in which results depend on cooperation."* Which example best supports this reason?`,
      options: [
        { id: 'A', text: md`Group work is common in schools in many countries.`, note: md`How common group work is says nothing about whether it prepares students for cooperative jobs.` },
        { id: 'B', text: md`Some students dislike group work because others do not contribute.`, note: md`This is an objection to group work, not support for the reason; it belongs in a reply-to-objection paragraph.` },
        { id: 'C', text: md`Cooperation is important in all areas of life.`, note: md`This is a general claim, not an example: it has no who, what or consequence, and it barely differs from the reason.` },
        { id: 'D', text: md`A student who learns in a group project to divide tasks, agree deadlines and resolve a disagreement later uses the same skills as a junior engineer whose design must fit a colleague's.`, note: '' },
        { id: 'E', text: md`A famous scientist made a major discovery while working entirely alone.`, note: md`A lone discovery, if anything, weakens the reason; it shows success without cooperation.` },
      ],
      answer: 'D',
      workingMd: md`A supporting example names a specific who and what, and its consequence matches the reason. The student who learns to divide tasks, set deadlines and resolve a disagreement, and then uses those skills as an engineer, shows the preparation the reason claims. The other choices are general statements, facts beside the point, or material that cuts against the reason.`,
      lesson: 'An example supports a reason only when its consequence is the very thing the reason claims.',
    },
    {
      id: 'check-objection-reply',
      title: 'Answering the strongest objection',
      topic: 'Analyze an Issue',
      stemMd: md`Thesis: *"Governments should fund scientific research whose practical use is not yet known."* The strongest objection is that public money is limited and should go to research with clear benefits. Which planned reply best answers it?`,
      options: [
        { id: 'A', text: md`Point out that some scientists find applied research boring.`, note: md`Scientists' preferences do not answer an objection about how limited public money should be spent.` },
        { id: 'B', text: md`Ignore the objection and add a third reason in favour of the thesis.`, note: md`Leaving the strongest objection unanswered means it is still standing at the end, however many reasons support the thesis.` },
        { id: 'C', text: md`Concede that money is limited, then argue that a modest share for open-ended research is justified because applied work later depends on findings no one could have predicted would be useful.`, note: '' },
        { id: 'D', text: md`Answer instead the objection that research topics are sometimes hard to explain to the public.`, note: md`That is a weaker objection chosen because it is easy to beat: a straw man that leaves the real one unanswered.` },
        { id: 'E', text: md`Argue that governments should fund every research proposal they receive.`, note: md`This overstates the thesis into a position that ignores limited money altogether, making the objection stronger, not weaker.` },
      ],
      answer: 'C',
      workingMd: md`The objection is about scarce money. A good reply engages it directly: concede that money is limited, then argue that a modest share for open-ended work pays off, because later applied work depends on earlier findings whose use was unknown. The other plans ignore the objection, answer a different and weaker one, rest on irrelevant preferences, or inflate the thesis.`,
      lesson: 'Answer the objection a thoughtful opponent would raise first, and engage its actual point.',
    },
  ],
  takeaways: [
    'Test the statement on three or four concrete cases; where they split is your qualified position.',
    'Choose two or three reasons that could each stand alone, often from different angles.',
    'A specific example has a who, a what and a consequence that matches the reason.',
    'Plan a reply to the strongest objection, not the easiest.',
    'A five-line outline turns the writing phase into filling in a structure.',
  ],
  practice: { examKey: 'gre', domain: 'aw-analyze-an-issue', skill: 'aw-develop-argument-reasons-examples' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

const writingAndRevising: Lesson = {
  slug: 'writing-and-revising-under-time',
  title: 'Writing and revising the Issue essay under time',
  summary: 'Write a direct introduction, build body paragraphs that argue, and spend the last minutes on the fixes that change what the essay says.',
  minutes: 20,
  objectives: [
    'Write an introduction that reaches the thesis quickly and a body paragraph that argues rather than lists.',
    'Choose topic sentences and transitions that show how each paragraph supports the thesis.',
    'Use the last minutes for the revisions that matter most, in the right order.',
  ],
  teachMd: md`
### The introduction: get to the thesis

An introduction has one job: tell the reader what you think and, briefly, how you will show it. Two or three sentences are enough. A useful pattern:

1. One sentence that frames the issue in your own terms (define a key term if it needs it).
2. The thesis, with its qualification.
3. Optionally, a sentence naming the reasons in the order the body will take them.

Avoid the long warm-up ("Since the dawn of time, people have debated...") and the restated prompt. Neither tells the reader anything, and both use minutes you will want later.

### The body paragraph: claim, example, explanation, link

Most strong body paragraphs follow the same four moves:

| Move | What it does |
| --- | --- |
| Claim (topic sentence) | States the reason this paragraph argues, in a way that clearly supports the thesis. |
| Example | Shows the reason working in a specific case. |
| Explanation | Says *why* the example supports the reason; this is the analysis. |
| Link | Ties the point back to the thesis, often to its qualification. |

The explanation is the move most often skipped. An example followed immediately by the next example leaves the reader to do the arguing. One or two sentences beginning "This matters because..." or "What this shows is..." turn a story into evidence.

### Topic sentences carry the argument

Read only your topic sentences in order. They should form a short version of the essay. A topic sentence that names the subject but not the claim ("Next, consider transport") forces the reader to wait for the point; one that states the claim ("Free transport matters most to people who cannot currently afford it") does not.

### Transitions show logic, not just order

"Firstly, secondly, finally" tell the reader where they are in a list. Words that show *how* ideas relate are more useful in an argument:

- **Cause and result:** because, so, therefore, as a result.
- **Contrast and concession:** however, yet, although, admittedly.
- **Extension:** moreover, more importantly, in the same way.

Use them only when the relationship is real. A "therefore" in front of a sentence that does not follow is worse than no transition.

### Sentences: precise beats impressive

Clear, varied, correct sentences help a reader follow the argument. That means the exact word rather than the grand one, a mix of short and longer sentences, and no sentence that must be read twice. A rare word used slightly wrongly costs more than a plain word used precisely.

### The conclusion

Restate the thesis in fresh words, including its line, and say briefly why the line matters. Do not open a new argument in the last paragraph: there is no room to support it, and it makes the essay look as if it changed its mind.

### Revising in the last minutes

With only a few minutes left, revise in order of how much each fix changes what the essay says:

1. **Thesis and body agree.** If the body argues a qualified view but the introduction states an absolute one, change the thesis sentence. One sentence, large effect.
2. **Missing links.** Add a linking sentence where a paragraph never says how it supports the thesis.
3. **Sentences a reader would misread.** Fix any sentence whose meaning is unclear.
4. **Typing slips and small errors.** Proofread yourself; do not count on noticing them while writing.

Do not start rewriting a paragraph from scratch in the last few minutes. A half-rewritten paragraph is worse than an imperfect complete one.
`,
  examples: [
    {
      id: 'example-improving-a-paragraph',
      title: 'Turning a list into an argument',
      problemMd: md`Thesis: *"Towns should spend public money on preserving old buildings only once basic housing and services are secure."* Draft body paragraph:

*"Old buildings are important. Many tourists visit old buildings. Old buildings are beautiful. They are part of history. So towns should preserve them."*

Improve it.`,
      steps: [
        md`**Diagnose.** Four separate assertions, no example, no explanation, and a closing sentence that drops the thesis's qualification. It argues a different, unqualified thesis.`,
        md`**Pick one reason and state it as a claim:** "Preserving a town's historic buildings can pay for itself when they draw visitors who spend money locally."`,
        md`**Add a specific example:** a town whose restored market hall now holds a weekly market, bringing in visitors who also use the shops around it.`,
        md`**Explain and link back to the qualification:** "This is why preservation deserves public money; but the same argument shows its limit: a market hall brings in visitors only if residents can afford to live in the town that hosts them, so housing must come first."`,
      ],
      answerMd: md`"Preserving historic buildings can pay for itself when they draw visitors who spend money locally. A town that restores its old market hall and opens it for a weekly market brings in visitors who also use the shops around it. This is why preservation deserves public money; but the same argument shows its limit, because a market hall draws visitors only to a town whose residents can afford to live there. Housing must come first." The tempting fix, adding more reasons to the list, keeps the paragraph a list.`,
    },
    {
      id: 'example-rewriting-an-introduction',
      title: 'An introduction that reaches the point',
      problemMd: md`Statement: *"Leaders should rarely change their minds."* Draft introduction:

*"Throughout history there have been many leaders. Leadership is a very important topic that many people have strong views about. In this essay I will discuss whether leaders should change their minds, which is a question with many sides."*

Rewrite it.`,
      steps: [
        md`**Diagnose.** Three sentences, no position. The first two would fit any essay about leadership, and the third repeats the prompt.`,
        md`**Frame the issue in your own terms:** separate the two things a leader can change, principles and factual judgements.`,
        md`**State the qualified thesis:** principles steady, factual judgements updated with evidence.`,
        md`**Optionally preview the reasons** in the order the body will take them.`,
      ],
      answerMd: md`"A leader can change two different things: the principles they act on, and their judgements about the facts. Leaders should rarely change the first, because others plan around them, but should change the second whenever the evidence does, because a judgement kept against the evidence turns an error into a policy." Two sentences now do the work the draft's three did not.`,
    },
    {
      id: 'example-last-four-minutes',
      title: 'What to fix with four minutes left',
      problemMd: md`Four minutes remain. Rereading, the writer finds: (1) the introduction says "competition always improves schools", but both body paragraphs argue that it helps only when schools are judged on fair measures; (2) two typing slips; (3) one paragraph that could use a better example. What should the writer do, and in what order?`,
      steps: [
        md`Rank by how much each fix changes what the essay says. The thesis–body mismatch makes the whole essay contradict itself; a reader judging it as a whole will notice. Fix it first.`,
        md`The fix is one sentence: change the thesis to the qualified version the body actually argues. That takes about a minute.`,
        md`Next, correct the two typing slips: quick, and they make the essay easier to read.`,
        md`Leave the example alone. Replacing it means rewriting most of a paragraph, which cannot be done well in the time left, and a half-rewritten paragraph is worse than the current one.`,
      ],
      answerMd: md`Rewrite the thesis sentence first, then fix the typing slips, and do not start replacing the example. The tempting order, polishing the slips first because they are easy, risks running out of time with the essay still contradicting itself.`,
    },
  ],
  traps: [
    {
      title: 'The warm-up introduction',
      md: md`Sentences such as "This is an important question that has been debated for centuries" fit every essay and say nothing. Start with your framing of the issue and reach the thesis by the second sentence.`,
    },
    {
      title: 'Example without explanation',
      md: md`Moving straight from one example to the next leaves the reader to work out why each matters. After every example, write at least one sentence that says what it shows and how it supports the thesis.`,
    },
    {
      title: 'A new argument in the conclusion',
      md: md`A fresh point in the last paragraph has no room for support and suggests the essay changed its mind. The conclusion restates the line you drew and why it matters; nothing new.`,
    },
    {
      title: 'Starting a rewrite in the last minutes',
      md: md`Late in the time, a rewrite rarely finishes. Make the one-sentence fixes that change meaning (thesis, links), then proofread. Leave weaker paragraphs complete rather than half-replaced.`,
    },
  ],
  check: [
    {
      id: 'check-topic-sentence',
      title: 'The topic sentence that argues',
      topic: 'Analyze an Issue',
      stemMd: md`Thesis: *"Museums should allow photography except where light could damage an object."* The paragraph that follows argues that photographs let visitors keep studying objects after they leave, using the example of an art student who sketches from her photographs of a sculpture for weeks after a visit. Which topic sentence best opens the paragraph?`,
      options: [
        { id: 'A', text: md`Next, I will talk about photographs.`, note: md`This names a subject but makes no claim; the reader still does not know what the paragraph argues.` },
        { id: 'B', text: md`Some museums do not allow cameras at all.`, note: md`This is background, not the paragraph's reason, and it does not say why photography should be allowed.` },
        { id: 'C', text: md`Light can damage old paintings.`, note: md`This supports the thesis's exception, not the paragraph's point about study after the visit.` },
        { id: 'D', text: md`A photograph lets a visitor go on learning from an object long after the visit ends.`, note: '' },
        { id: 'E', text: md`Art students are the most important visitors a museum has.`, note: md`This is an unsupported claim about one group, and it is not the reason the paragraph's example illustrates.` },
      ],
      answer: 'D',
      workingMd: md`A topic sentence states the paragraph's claim in a way that supports the thesis. The paragraph's reason is that photographs extend study beyond the visit, and the student who sketches from her photographs for weeks is the example of it. The sentence saying a photograph lets a visitor go on learning after the visit states exactly that. The others announce a subject, give background, support a different point, or make an unsupported claim.`,
      lesson: 'Read your topic sentences alone: each should state a reason that supports the thesis.',
    },
    {
      id: 'check-explanation-sentence',
      title: 'Adding the missing explanation',
      topic: 'Analyze an Issue',
      stemMd: md`Thesis: *"Leaders should keep their principles steady but change their factual judgements when the evidence changes."* A paragraph reads: *"A city council that decided a bridge was safe kept saying so after engineers reported new cracks, and the bridge was later closed in an emergency."* Which sentence, added next, best explains how the example supports the thesis?`,
      options: [
        { id: 'A', text: md`Bridges are expensive to build and to repair.`, note: md`Cost is beside the point; the sentence does not connect the example to changing judgements.` },
        { id: 'B', text: md`The council's error was not a lack of principle but a refusal to revise a factual judgement once the evidence had changed, which turned a fixable problem into an emergency.`, note: '' },
        { id: 'C', text: md`Therefore leaders should never change their minds about anything.`, note: md`This draws the opposite conclusion from the example and contradicts the thesis; "therefore" signals a link the logic does not support.` },
        { id: 'D', text: md`Many other councils have also had problems with bridges.`, note: md`This adds more examples of a topic without explaining how this one supports the thesis.` },
        { id: 'E', text: md`Engineers are often more reliable than politicians.`, note: md`This is a different, unsupported claim; it shifts the argument from leaders' judgement to a comparison of professions.` },
      ],
      answer: 'B',
      workingMd: md`An explanation says what the example shows and ties it to the thesis. The council kept a factual judgement after the evidence changed, and the result was an emergency; the sentence that names that as a failure to revise a factual judgement, not a lack of principle, connects the example to both halves of the thesis. The other sentences add side facts, more examples, a new claim, or a conclusion the thesis rejects.`,
      lesson: 'After every example, say in one sentence what it shows and how it supports the thesis.',
    },
    {
      id: 'check-revision-priority',
      title: 'The most valuable last-minute fix',
      topic: 'Analyze an Issue',
      stemMd: md`Three minutes remain. The writer's body paragraphs argue that national service helps young adults at the end of education but should not be forced on people with caring duties. The introduction states: *"Every adult without exception should do national service."* Which single revision is the best use of the time?`,
      options: [
        { id: 'A', text: md`Replace the introduction's thesis with one sentence stating the qualified position the body argues.`, note: '' },
        { id: 'B', text: md`Replace several plain words with longer, less common synonyms.`, note: md`Rarer words do not change what the essay argues, and nothing ETS states says they are rewarded; meanwhile the essay still contradicts itself.` },
        { id: 'C', text: md`Add a new paragraph on the history of national service in different countries.`, note: md`There is no time to write and support a new paragraph, and background history does not fix the contradiction.` },
        { id: 'D', text: md`Change the conclusion to agree with the introduction's "without exception" claim.`, note: md`This makes the conclusion contradict the body as well; the body is the argued part, so the thesis should move to match it, not the other way round.` },
        { id: 'E', text: md`Delete the paragraph about caring duties so that the body matches the introduction.`, note: md`Deleting the essay's qualification throws away its best analysis and leaves an absolute claim that obvious cases break.` },
      ],
      answer: 'A',
      workingMd: md`The essay contradicts itself: its thesis is absolute while its body argues a qualified view. That mismatch affects how the whole essay reads, and the fix is a single sentence: restate the thesis as the qualified position the body supports. Moving the conclusion or the body to match the absolute thesis damages the argued part, a new paragraph cannot be finished, and longer synonyms change nothing that matters.`,
      lesson: 'In the last minutes, fix whatever changes what the essay says, starting with the thesis.',
    },
  ],
  takeaways: [
    'Reach the thesis within the first two sentences.',
    'A body paragraph argues in four moves: claim, example, explanation, link.',
    'Topic sentences read alone should form a short version of the essay.',
    'Revise in order of effect: thesis and body agree, missing links, unclear sentences, then slips.',
    'Never start a rewrite you cannot finish.',
  ],
  practice: { examKey: 'gre', domain: 'aw-analyze-an-issue', skill: 'aw-sustain-focused-coherent-discussion' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-04', expertReview: null },
};

export const analyticalWritingUnit: Unit = {
  slug: 'analytical-writing',
  title: 'Analytical Writing: the Issue task',
  summary: 'The GRE opens with one 30-minute "Analyze an Issue" task, scored from 0 to 6 in half points. These lessons cover what the task asks, how to plan a qualified position with reasons and examples, and how to write and revise it in the time.',
  lessons: [whatIsScored, planning, writingAndRevising],
};
