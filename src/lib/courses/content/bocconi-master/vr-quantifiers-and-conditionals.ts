import { md, type Lesson } from '../../types';

/** Bocconi master's, verbal reasoning: translating the logical words, valid moves with conditionals, matching patterns and testing rules. */
export const quantifiersAndConditionalsLesson: Lesson = {
  slug: 'quantifiers-and-conditionals',
  title: 'Quantifiers, conditionals and contrapositives',
  summary: 'Turn only if, unless, none but and not all into plain arrows, use the contrapositive, match argument patterns and test a rule by hunting for counterexamples.',
  minutes: 22,
  objectives: [
    'Translate "not all", "none but", "no X without Y", "only if", "unless" and "not impossible" into plain arrows and quantities.',
    'Draw the valid conclusions from a conditional, including one with two conditions, and reject the converse and the inverse.',
    'Match an argument to another with the same logical blueprint, whatever the subject matter.',
    'Pick out the cases that could show a general rule to be false.',
  ],
  teachMd: md`
### Why the small words carry the argument

Two of the verbal item types Bocconi describes depend on exact reading: data and statements, where you decide whether each statement is true or false, and verbal critical reasoning, where a short passage is taken as true and a question asks, for example, which condition would best support its thesis. Short arguments are often built from rules ("only", "unless", "no ... without") and quantities ("not all", "none but"). Read loosely, these words can reverse a sentence's meaning. The cure is mechanical: translate each rule into a plain arrow, "if this, then that", before you judge anything.

### Translating the awkward phrasings

| Phrase in the passage | Plain meaning | Arrow or quantity |
| --- | --- | --- |
| Not all A are B | At least one A is not B | some A are not B |
| None but A may do X | Anyone who does X is an A | $\text{X} \to \text{A}$ |
| Only A do X | The same as "none but" | $\text{X} \to \text{A}$ |
| No X without Y | Every X has Y | $\text{X} \to \text{Y}$ |
| X only if Y | Y is needed for X | $\text{X} \to \text{Y}$ |
| X if Y | Y is enough for X | $\text{Y} \to \text{X}$ |
| X unless Y | Without Y, X happens | $\text{not Y} \to \text{X}$ |
| X if and only if Y | Each guarantees the other | both arrows |
| It is not impossible that X | X has some chance, however small | possible, not probable |

Four rows deserve a second look.

**"Not all A are B"** says only that there is at least one exception. It does not say that some A are B: "not all of the fund's bonds are investment grade" is still true if none of them is.

**"None but", "only" and "no ... without"** all name a requirement, and the arrow points to the requirement. "No firm wins the tender without an environmental certificate" means that winning requires the certificate: $\text{wins} \to \text{certificate}$. The certificate is a **necessary** condition. Holding it is not a guarantee, which would be a **sufficient** condition.

**"Unless"** works in one direction only. "The launch will be delayed unless the supplier delivers by May" says that if the supplier does not deliver by May, the launch is delayed. Its contrapositive is just as useful: if the launch is on time, the supplier delivered by May. Strictly, the sentence makes no promise about what happens if the supplier does deliver; the launch could be delayed for some other reason.

**"Not impossible"** is the weakest positive claim there is. It rules out only a zero chance. It does not mean "likely", and an option that turns it into "probably" says more than the passage.

### One arrow, four moves

Write the rule as $P \to Q$. Then:

| You learn | You may conclude | Name |
| --- | --- | --- |
| $P$ | $Q$ | following the arrow: valid |
| not $Q$ | not $P$ | the contrapositive: valid |
| $Q$ | nothing about $P$ | the converse: invalid |
| not $P$ | nothing about $Q$ | the inverse: invalid |

The contrapositive is valid because it says the same thing as the rule: if $P$ were true, $Q$ would be true; $Q$ is false, so $P$ cannot be. The converse fails because $Q$ may come about in other ways, and the inverse fails for the same reason. The converse and the inverse are contrapositives of each other, so they stand or fall together, and the rule supports neither. An argument that runs an arrow backwards commits the flaw described in [flaws and evaluation](/courses/bocconi-master/flaws-and-evaluation): it treats a necessary condition as sufficient, or a sufficient one as necessary.

### Rules with two conditions

Rules often join two conditions: "any project that is funded and finished on time earns a bonus", or $(F \text{ and } T) \to B$. Its contrapositive is: no bonus, so not both $F$ and $T$. That means **at least one** of them is false, not both. To say which, you need another fact. If you also know the project was funded, the false one must be $T$: it was not finished on time. The negation of "$F$ and $T$" is "not $F$ or not $T$", never "not $F$ and not $T$".

### Matching an argument's blueprint

When a question asks which argument reasons in the same way as another, ignore the subject matter. Replace each claim with a letter, keep the logical words, translate them into arrows, and write the pattern, for example "$(P \text{ and } Q) \to R$; $Q$; not $R$; so not $P$". Do the same for each option and compare. Check three things:

- the **conclusion**: a negative conclusion needs a negative match, a certain one a certain match;
- the **direction** of every arrow, after translating "only", "unless" and "without";
- the **validity**: a valid argument is matched by a valid one, and a flawed argument by one with the same flaw.

The order in which the premises appear does not matter; the pattern does.

### Testing a rule: look for the case that could break it

A rule of the form "every $P$ is $Q$" can never be proved by cases that agree with it, but a single $P$ that is not $Q$ refutes it. So when you must check a rule, or decide which evidence would test it, look only where a counterexample could hide:

- cases known to be $P$: check that they are $Q$;
- cases known to be not $Q$: check that they are not $P$.

Cases known to be $Q$, or known to be not $P$, cannot break the rule whatever else is true of them. Checking them feels productive because they tend to agree with the rule, which is exactly why they tell you nothing. The same habit helps with evaluation questions: the most useful fact about a general claim is often whether a counterexample exists.
`,
  examples: [
    {
      id: 'example-translate-chain',
      title: 'Translating before judging',
      problemMd: md`"The board will not approve the budget unless the auditors sign it off. No auditor signs off a budget without a complete set of receipts. It is not impossible that some of the receipts are missing." Which of these follow? (i) If some receipts are missing, the board will not approve the budget. (ii) If the receipts are complete, the board will approve the budget. (iii) The board will probably not approve the budget.`,
      steps: [
        md`Translate the first sentence. "X unless Y" means "if not Y, then X": if the auditors do not sign off, the board will not approve. Its contrapositive points the useful way: $\text{approve} \to \text{sign-off}$.`,
        md`Translate the second. "No X without Y" puts Y at the point of the arrow: $\text{sign-off} \to \text{complete receipts}$.`,
        md`Chain the arrows: $\text{approve} \to \text{sign-off} \to \text{complete receipts}$. The contrapositive of the chain runs backwards through the negations: receipts incomplete, so no sign-off, so no approval. That is statement (i), so (i) follows.`,
        md`Statement (ii) runs the chain the wrong way. Complete receipts are required for a sign-off, not enough for one, and a sign-off is required for approval, not enough for it. The auditors could still refuse, or the board could reject the budget for another reason. It does not follow.`,
        md`Statement (iii) reads "not impossible" as "likely". The passage only says that missing receipts have some chance; it gives no reason to think they are likely. It does not follow.`,
      ],
      answerMd: md`Only (i) follows. Statement (ii) is the tempting wrong answer: it turns two requirements into a guarantee. Statement (iii) tempts anyone who hears "not impossible" as "probable".`,
    },
    {
      id: 'example-blueprint',
      title: 'A rule with two conditions, and its blueprint',
      problemMd: md`"Every regional airport that received the transport grant and had more than one million passengers last year opened a new terminal. Airport K had more than one million passengers last year but opened no new terminal. So airport K did not receive the grant." Is the argument valid, and which of these has the same pattern? (i) "Any employee who completes the training course and passes the exam is promoted. Dina passed the exam but was not promoted. So Dina did not complete the training course." (ii) "Any employee who completes the training course and passes the exam is promoted. Dina passed the exam and was promoted. So Dina completed the training course."`,
      steps: [
        md`Name the claims: $G$, received the grant; $M$, more than one million passengers; $T$, opened a new terminal. The rule is $(G \text{ and } M) \to T$.`,
        md`The facts are $M$ true and $T$ false. By the contrapositive, not $T$ gives not ($G$ and $M$): at least one of $G$ and $M$ is false.`,
        md`$M$ is true, so the false one is $G$: airport K did not receive the grant. The argument is valid. Its blueprint is "$(P \text{ and } Q) \to R$; $Q$; not $R$; so not $P$".`,
        md`Argument (i): course and exam lead to promotion; exam true; promotion false; so no course. Same blueprint, and valid.`,
        md`Argument (ii): the same rule, but it starts from the promotion and the exam and concludes the course. That runs the arrow backwards: Dina could have been promoted for some other reason. It is the converse, and invalid.`,
      ],
      answerMd: md`The argument is valid, and (i) has the same pattern. Argument (ii) is the tempting wrong match: it shares the rule and the people, but it reasons from the result back to a condition.`,
    },
    {
      id: 'example-falsify',
      title: 'Which records could break the rule?',
      problemMd: md`An internal auditor wants to test the rule "Every invoice over €10,000 is approved by a director." Each record card shows the invoice amount on one side and the approver on the other. Four cards lie face up, showing: €14,000; €3,000; approved by a director; approved by a team leader. Which cards must she turn over, and no others?`,
      steps: [
        md`Translate: an invoice over €10,000 $\to$ approval by a director. The only case that breaks the rule is an invoice over €10,000 approved by someone other than a director.`,
        md`The €14,000 card meets the condition; its back might name a non-director. Turn it.`,
        md`The €3,000 card does not meet the condition; the rule says nothing about small invoices. Leave it.`,
        md`The director card agrees with the rule whatever the amount on its back, so it cannot break it. Leave it.`,
        md`The team-leader card fails the requirement; if its back shows more than €10,000, the rule is broken. Turn it.`,
      ],
      answerMd: md`She must turn the €14,000 card and the team-leader card. The tempting wrong choice is the €14,000 card and the director card: the director card can only confirm the rule, never test it.`,
    },
  ],
  traps: [
    {
      title: 'Running the arrow backwards',
      md: md`"Only", "none but", "only if" and "no ... without" name a requirement, and meeting a requirement guarantees nothing. Put the requirement at the point of the arrow and allow yourself only two moves: from the condition to the requirement, and from a missing requirement to a missing condition.`,
    },
    {
      title: 'Hearing "unless" as a promise',
      md: md`"The launch will be delayed unless the supplier delivers by May" is often heard as "if the supplier delivers, the launch is on time". The sentence does not say that. Translate it as "if not Y, then X", take its contrapositive if you need it, and stop there.`,
    },
    {
      title: 'Stretching "not all" and "not impossible"',
      md: md`"Not all A are B" means one exception or more; it neither guarantees that some A are B nor suggests that most are not. "Not impossible" means a chance above zero, not a good chance. Options that turn either phrase into something stronger say more than the passage.`,
    },
    {
      title: 'Negating "both" as "neither"',
      md: md`When a rule has two conditions and its result fails, at least one condition fails, not necessarily both. Write the negation of "$P$ and $Q$" as "not $P$ or not $Q$", and look for a second fact that tells you which.`,
    },
    {
      title: 'Checking the cases that agree',
      md: md`To test "every $P$ is $Q$", people look at cases that are $Q$, because they usually fit. They can never break the rule. Look instead at the $P$ cases and the not-$Q$ cases: only there can a counterexample hide.`,
    },
  ],
  check: [
    {
      id: 'check-fund-rules',
      title: 'The fund\'s rules',
      topic: 'Verbal critical reasoning',
      stemMd: md`The rules of the Arbor investment fund state that none but accredited investors may buy units of the fund, and that no investor may buy units without first passing a suitability check. Not all of the investors who passed the suitability check last month are accredited.

If the statements above are true, which of the following must also be true?`,
      options: [
        { id: 'A', text: md`Every accredited investor who has passed the suitability check may buy units.`, note: md`Runs both arrows backwards: accreditation and the check are each required for buying, and the rules never say that meeting both is enough.` },
        { id: 'B', text: md`At least one investor who passed the suitability check last month may not buy units.`, note: '' },
        { id: 'C', text: md`Some of the investors who passed the suitability check last month are accredited.`, note: md`Reads "not all are accredited" as "some are". The statement is still true if none of the investors who passed last month is accredited.` },
        { id: 'D', text: md`An accredited investor who has not passed the suitability check may buy units.`, note: md`Contradicts the second rule: no investor may buy units without first passing the check, accredited or not.` },
      ],
      answer: 'B',
      workingMd: md`Translate the rules: $\text{may buy} \to \text{accredited}$ and $\text{may buy} \to \text{passed the check}$. "Not all of last month's investors who passed are accredited" means at least one of them is not accredited. By the contrapositive of the first rule, an investor who is not accredited may not buy. So at least one investor who passed the check last month may not buy units. The claim that accredited investors who passed may buy reverses both arrows; the claim that some of last month's investors are accredited reads "not all" as "some are"; and an accredited investor without the check is ruled out by the second rule.`,
      lesson: 'Put each requirement at the point of its arrow, then use the contrapositive to rule people out.',
    },
    {
      id: 'check-listing-flaw',
      title: 'The same flaw',
      topic: 'Verbal critical reasoning',
      stemMd: md`Only firms with audited accounts for the last three years can list their shares on the Lumen exchange. Ferro SpA has audited accounts for the last three years. Therefore Ferro SpA can list its shares on the Lumen exchange.

Which of the following arguments contains the same flaw in reasoning as the argument above?`,
      options: [
        { id: 'A', text: md`Only registered members can vote at the annual meeting. Paola voted at the annual meeting. Therefore Paola is a registered member.`, note: md`This argument is valid: it follows the arrow from voting to membership. The original argument starts from the requirement and concludes the outcome, the other way round.` },
        { id: 'B', text: md`A resident's permit is required to park in zone B. Luca has a resident's permit. Therefore Luca may park in zone B.`, note: '' },
        { id: 'C', text: md`Anyone with a resident's permit may park in zone B. Luca does not have a resident's permit. Therefore Luca may not park in zone B.`, note: md`Flawed, but differently: it treats a sufficient condition (a permit) as the only way to qualify. The original treats a necessary condition as enough.` },
        { id: 'D', text: md`Only registered members can vote at the annual meeting. Paola is not a registered member. Therefore Paola cannot vote at the annual meeting.`, note: md`Valid: it uses the contrapositive (not a member, so cannot vote). The original argument contains no such step.` },
      ],
      answer: 'B',
      workingMd: md`Translate the original rule: $\text{can list} \to \text{audited accounts}$. The argument finds the requirement met and concludes the outcome: the pattern "$X \to Y$; $Y$; so $X$", which treats a necessary condition as sufficient. In the parking argument where a permit is required, the rule is $\text{may park} \to \text{permit}$; Luca has a permit, so the argument concludes he may park. That is the same pattern and the same flaw. The voting argument that infers membership from a vote follows the arrow, and the one that infers no vote from non-membership uses the contrapositive; both are valid. The parking argument built on "anyone with a permit may park" reasons from a missing sufficient condition, a different flaw.`,
      lesson: 'Match arguments by their arrows and the direction of the inference, not by their subject or by whether they are flawed in some way.',
    },
    {
      id: 'check-upgrade-cards',
      title: 'Which cards to turn',
      topic: 'Verbal critical reasoning',
      stemMd: md`A hotel manager claims: "Only guests who booked through our app were given a room upgrade last weekend." Four registration cards each show, on one side, how the guest booked (through the app or by phone) and, on the other, whether the guest was upgraded. The visible sides read: booked through the app; booked by phone; upgraded; not upgraded.

Which cards must be turned over, and no others, to find out whether the manager's claim is false for these four guests?`,
      options: [
        { id: 'A', text: md`The app-booking card and the upgraded card.`, note: md`Turns the app-booking card, which cannot break the claim whatever its back shows, and leaves the phone-booking card, which could hide an upgraded phone guest.` },
        { id: 'B', text: md`The app-booking card and the not-upgraded card.`, note: md`Tests "every app guest was upgraded", which reverses the claim. "Only" puts the app at the point of the arrow: upgraded guests booked through the app.` },
        { id: 'C', text: md`The phone-booking card and the upgraded card.`, note: '' },
        { id: 'D', text: md`The upgraded card only.`, note: md`Misses the phone-booking card: if its other side reads "upgraded", the claim is false.` },
      ],
      answer: 'C',
      workingMd: md`Translate "only": $\text{upgraded} \to \text{booked through the app}$. The claim is false only if some guest was upgraded without booking through the app. The upgraded card must be turned, because its back might show a phone booking. The phone-booking card must be turned, because its back might show an upgrade. The app-booking card cannot break the claim, since app guests may or may not have been upgraded; the not-upgraded card cannot break it either, whatever the booking on its back. So the phone-booking card and the upgraded card must be turned, and no others.`,
      lesson: 'Translate the rule first, then look only where a counterexample could hide: cases that meet its condition and cases that lack its requirement.',
    },
  ],
  takeaways: [
    'Translate "only", "none but", "no X without Y" and "only if" into an arrow that points to the requirement.',
    'From "if P then Q", only two moves are valid: P gives Q, and not Q gives not P.',
    '"Not all" means at least one exception; "not impossible" means a chance above zero, nothing more.',
    'Match arguments by blueprint: letters, arrow directions and the form of the conclusion, not the topic.',
    'To test "every P is Q", examine the P cases and the not-Q cases; agreeing cases prove nothing.',
  ],
  practice: { examKey: 'bocconi-graduate', domain: 'bocconi-grad-verbal-reasoning', skill: 'grad-verbal-argument-analysis' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
