import { md, type Lesson } from '../../types';

/**
 * Quick revision: conditionals, quantifiers, chains, sequencing, paradoxes,
 * and argument skills. Adapted from the site owners' revision deck (slides
 * 31–39, 43–46 and 51–54), with corrections: the price-cut paradox is a
 * change in sales mix, not Simpson's paradox; division and composition are
 * told apart; assumption items are placed in the Law test's verbal
 * reasoning, not in the standard critical thinking area; the deck's
 * "high-frequency" and "recurring Bocconi" labels are dropped. Exam facts
 * come only from docs/research/course-facts-2026-11-04.md.
 */

export const revisionLogicAndArgumentsLesson: Lesson = {
  slug: 'revision-logic-and-arguments',
  title: 'Revision: logic, deductions and arguments',
  summary: 'Conditionals, only if and unless, quantifiers, chains, De Morgan, sequencing and paradoxes on one sheet, plus the argument skills that help with reading.',
  minutes: 30,
  objectives: [
    'Tell valid conditional inferences from the two classic fallacies, and translate "only if" and "unless" into arrows.',
    'Decide what "all", "some" and "no" guarantee, and run a chain of conditionals forwards or backwards.',
    'Fill a sequencing puzzle slot by slot and explain an apparent paradox without denying either fact.',
    'Name an argument\'s premise, unstated assumption and conclusion, and test an assumption by negating it.',
  ],
  teachMd: md`
### Where this sits

The standard test has 9 critical thinking questions, in two formats: data and statements, where you choose which statements are true (or false); and a short passage with an assertion to judge true, false or cannot be deduced. Both reward strict deduction, which is most of this sheet. Questions on assumptions, strengthening, weakening and flaws are part of the **Law** test's verbal reasoning, not of Bocconi's list for the standard test; the last section is here because the same skills help you read arguments in passages.

### Four conditional forms

Take the rule "if a good is taxed ($A$), its price rises ($B$)".

| Form | Pattern | Status | Example |
| --- | --- | --- | --- |
| Modus ponens | $A \to B$; $A$; so $B$ | Valid | It was taxed, so its price rose |
| Contrapositive (modus tollens) | $A \to B$; $\neg B$; so $\neg A$ | Valid | The price did not rise, so it was not taxed |
| Affirming the consequent | $A \to B$; $B$; so $A$ | Invalid | The price rose, so it was taxed (other causes exist) |
| Denying the antecedent | $A \to B$; $\neg A$; so $\neg B$ | Invalid | It was not taxed, so its price did not rise |

### Translating "only if" and "unless"

| Sentence | Arrow | Contrapositive |
| --- | --- | --- |
| If $P$, then $Q$ | $P \to Q$ | $\neg Q \to \neg P$ |
| $P$ only if $Q$ | $P \to Q$ | $\neg Q \to \neg P$ |
| $P$ unless $Q$ | $\neg Q \to P$ | $\neg P \to Q$ |

In $P \to Q$, $P$ is **sufficient** for $Q$ and $Q$ is **necessary** for $P$. "Only if" introduces the necessary condition, so the arrow points towards the clause that follows "only if".

### Quantifiers and Venn relations

| Statement | Picture | Guarantees |
| --- | --- | --- |
| All $A$ are $B$ | Circle $A$ inside circle $B$ | Nothing about $B$s outside $A$ |
| No $A$ are $B$ | Two separate circles | No $B$ is an $A$ either |
| Some $A$ are $B$ | Overlap with at least one member | Some $B$ are $A$ |

"Some" means at least one, and possibly all. "Some $A$ are $B$" reverses; "all $A$ are $B$" does not. Two "some" premises ("some $A$ are $B$", "some $B$ are $C$") give no certain link between $A$ and $C$: the $B$s involved may be different ones. The opposite of "all" is "not all", not "none".

### Chains and negations

| Rule | Form | Example |
| --- | --- | --- |
| Transitive chain | $A \to B$ and $B \to C$, so $A \to C$ | If inflation rises, rates rise; if rates rise, mortgage lending falls |
| Contrapositive chain | $A \to B \to C$, so $\neg C \to \neg B \to \neg A$ | Lending did not fall, so inflation did not rise |
| De Morgan | $\neg(A \land B) \equiv \neg A \lor \neg B$ and $\neg(A \lor B) \equiv \neg A \land \neg B$ | "Not both taxed and fined" means untaxed or unfined |
| Disjunctive syllogism | $A \lor B$ and $\neg A$, so $B$ | Bonds or shares were issued; no bonds, so shares |

A chain runs backwards only through negations: from the end of the chain being false you can walk back, but from the end being true you can conclude nothing about the start.

### Sequencing puzzles

Place the fixed facts first (a named slot), then the blocks they pull with them ("immediately before"), then the slots that are left. Write down every arrangement that survives; a "must be true" answer holds in all of them, a "could be true" answer in at least one.

### Paradoxes: both facts stand

An apparent contradiction is resolved by a fact that lets both statements be true, never by doubting one of them. A carmaker cuts the price of every model by 8%, sells as many cars as the year before, yet earns 6% more. If buyers moved from cheaper sedans to dearer SUVs, the average price per car can rise even though every price fell. With 50 sedans at €40,000 and 50 SUVs at €80,000, revenue is €6.0 million; after the cuts (€36,800 and €73,600), 27 sedans and 73 SUVs bring in about €6.37 million, roughly 6% more. This is a change in the sales mix (composition), not Simpson's paradox.

### Arguments: premise, assumption, conclusion

An argument has stated **premises**, a **conclusion** the author wants you to accept, and often an unstated **assumption** that bridges them. A **necessary** assumption is one the argument cannot do without; test it by negating it: if the negation wrecks the conclusion, it was necessary. A **sufficient** assumption is one that, added to the premises, makes the conclusion follow for certain. Look for a term that appears in the conclusion but not in the premises: "fewer fatigue crashes" does not by itself give "lower insurance premiums".

To weaken a causal claim ($X$ caused $Y$): show another cause, show that $Y$ caused $X$, or show $X$ without $Y$.

| Flaw | Error | Example |
| --- | --- | --- |
| Post hoc | $A$ came before $B$, so $A$ caused $B$ | Crime fell after the new mayor arrived, so the mayor cut crime |
| Survivorship bias | Studies only the survivors | Studying successful start-ups and ignoring failed ones |
| Division | A trait of the whole is given to every part | National output grew 4%, so every province grew 4% |
| Composition | A trait of the parts is given to the whole | Every player is excellent, so the team is excellent |
| False dilemma | Two extremes presented as the only options | Either 50% tariffs or the industry dies |

| Argument pattern | Unstated assumption it needs |
| --- | --- |
| It worked in City A, so it will work in City B | The two cities do not differ in any way that matters |
| A poll shows 80% support, so the public agrees | The sample is representative |
| Action X will achieve goal Y | X is feasible and has no side effect that defeats Y |
| A and B rose together, so A caused B | No third factor drove both |
`,
  examples: [
    {
      id: 'example-only-if-admission',
      title: '"Only if" gives a necessary condition',
      problemMd: md`*A candidate is admitted only if they pass the mathematics threshold. Luca passed the mathematics threshold.*

Can we conclude that Luca was admitted?`,
      steps: [
        md`Translate: "admitted only if passed" is $\text{admitted} \to \text{passed}$. Passing is necessary for admission.`,
        md`The fact given is the consequent: Luca passed. Concluding "admitted" from it is affirming the consequent.`,
        md`Build two situations: Luca passed and was admitted; Luca passed but failed another requirement and was not. Both fit the premise.`,
        md`What would follow: had Luca **not** passed, the contrapositive $\neg\text{passed} \to \neg\text{admitted}$ would tell us he was not admitted.`,
      ],
      answerMd: md`No. Luca's admission cannot be deduced: passing is necessary, not sufficient. "Admitted" is the tempting wrong conclusion, from reading "only if" as "if".`,
    },
    {
      id: 'example-auditors-syllogism',
      title: 'All, some and no in one puzzle',
      problemMd: md`*All auditors are accountants. Some accountants are lawyers. No lawyers are engineers.*

Which follow? (1) Some auditors are lawyers. (2) Some accountants are not engineers.`,
      steps: [
        md`Draw it: the auditors' circle sits inside the accountants' circle; the lawyers' circle overlaps the accountants' circle somewhere; the engineers' circle is apart from the lawyers' circle.`,
        md`Statement 1: the lawyers who are accountants may all be outside the auditors' circle. A drawing where the auditors and the lawyers do not meet fits every premise. It does not follow.`,
        md`Statement 2: "some accountants are lawyers" guarantees at least one accountant-lawyer, and "no lawyers are engineers" says that person is not an engineer. So at least one accountant is not an engineer. It follows.`,
      ],
      answerMd: md`Only statement 2 follows. Statement 1 is the trap: "all auditors are accountants" and "some accountants are lawyers" do not link auditors to lawyers, because the accountants who are lawyers may not be auditors.`,
    },
    {
      id: 'example-merger-chain',
      title: 'Walking a chain backwards',
      problemMd: md`*(1) If the merger is approved, the firm sells Division X. (2) If Division X is sold, either the CFO resigns or there are layoffs. (3) There were no layoffs, and the CFO did not resign.*

What can be concluded about the merger?`,
      steps: [
        md`Write the chain: $M \to D$ and $D \to (R \lor L)$.`,
        md`Premise 3 gives $\neg R \land \neg L$, which by De Morgan is $\neg(R \lor L)$: the "either" did not happen.`,
        md`Contrapositive of premise 2: $\neg(R \lor L) \to \neg D$, so Division X was not sold.`,
        md`Contrapositive of premise 1: $\neg D \to \neg M$, so the merger was not approved.`,
      ],
      answerMd: md`The merger was not approved. The chain only runs backwards through negations; had there been layoffs, nothing would follow about the merger.`,
    },
    {
      id: 'example-five-speakers',
      title: 'Five speakers in five slots',
      problemMd: md`*Five speakers, K, L, M, N and P, speak one after another in slots 1 to 5. L speaks immediately before M. K speaks earlier than N. P speaks in slot 1 or slot 5. M speaks in slot 3.*

If P speaks in slot 1, who speaks in slot 4? And what must be true whatever P does?`,
      steps: [
        md`Fixed fact first: M is in slot 3, so L, immediately before, is in slot 2.`,
        md`Slots 1, 4 and 5 remain for K, N and P, and P takes 1 or 5.`,
        md`If P is in slot 1, K and N fill 4 and 5 with K earlier, so K is in slot 4 and N in slot 5: P, L, M, K, N.`,
        md`If P is in slot 5, K and N fill 1 and 4 with K earlier: K, L, M, N, P.`,
      ],
      answerMd: md`With P in slot 1, K speaks fourth. In both arrangements N speaks after M (slot 4 or 5) and K is in slot 1 or 4; "N speaks fifth" is only possible, not certain.`,
    },
  ],
  traps: [
    {
      title: 'Affirming the consequent',
      md: md`"If taxed, the price rises; the price rose, so it was taxed" feels natural because the rule and the fact match. The rule says nothing about other causes. From the consequent alone, nothing follows about the antecedent.`,
    },
    {
      title: 'Reading "only if" as "if"',
      md: md`"Admitted only if passed" makes passing necessary, not sufficient. Turn every "only if" into an arrow pointing to the condition after it before you draw any conclusion.`,
    },
    {
      title: 'Linking through two "some" premises',
      md: md`"Some $A$ are $B$" and "some $B$ are $C$" seem to connect $A$ and $C$, but the $B$s in the two statements may be different members. Draw the circles so they miss each other; if you can, no link is guaranteed.`,
    },
    {
      title: 'Reading "some" as "not all"',
      md: md`In conversation "some" hints "not all"; in logic it means at least one, possibly all. "Some managers work remotely" does not tell you that some do not.`,
    },
    {
      title: 'Explaining a paradox away',
      md: md`An answer that says one of the two facts must be wrong, or that ignores one of them, cannot resolve a paradox. Look for the fact that lets both stand, such as a change in which products were sold.`,
    },
  ],
  check: [
    {
      id: 'check-catalogue-chain',
      title: 'Courses in the catalogue',
      topic: 'Critical thinking',
      stimulusMd: md`*At a language school, a course is listed in the catalogue only if a teacher has been assigned to it. A teacher is assigned to a course only if at least 20 students have enrolled in it. Course X is listed in the catalogue.*`,
      stemMd: md`Which of the following must be true?`,
      options: [
        { id: 'A', text: md`Every course with a teacher assigned is listed in the catalogue.`, note: md`Reverses the first rule: listing requires a teacher, but a teacher does not guarantee listing.` },
        { id: 'B', text: md`At least 20 students have enrolled in course X.`, note: '' },
        { id: 'C', text: md`Any course with 25 students enrolled is listed in the catalogue.`, note: md`Affirms the consequent twice: 20 or more students are necessary for a teacher, and a teacher for a listing, but neither is sufficient.` },
        { id: 'D', text: md`A course with no teacher assigned may still be listed in the catalogue.`, note: md`Contradicts the contrapositive of the first rule: with no teacher, a course is not listed.` },
      ],
      answer: 'B',
      workingMd: md`Write the rules as arrows: listed $\to$ teacher, and teacher $\to$ at least 20 students. Chained, listed $\to$ at least 20 students. Course X is listed, so by modus ponens twice it has at least 20 students. The rules run one way only, so they say nothing about courses with a teacher or with 25 students being listed, and with no teacher a course cannot be listed.`,
      lesson: 'Turn each "only if" into an arrow towards the condition, chain the arrows, and move only forwards from a fact or backwards from a negation.',
    },
    {
      id: 'check-vault-rule',
      title: 'The vault and the cash log',
      topic: 'Critical thinking',
      stimulusMd: md`*At a bank branch, no cashier may both open the vault and sign the cash log on the same day, and on Monday every cashier kept to this rule. On Monday Elena opened the vault, and the cash log was signed by Elena or by Paolo, or by both.*`,
      stemMd: md`Which of the following must be true?`,
      options: [
        { id: 'A', text: md`Elena signed the cash log on Monday.`, note: md`Ignores the rule: Elena opened the vault, so she could not also sign the log that day.` },
        { id: 'B', text: md`Paolo opened the vault on Monday.`, note: md`Not stated, and in fact ruled out: Paolo signed the log, so under the rule he could not also open the vault that day.` },
        { id: 'C', text: md`Elena did not sign the cash log on any day that week.`, note: md`Stretches Monday's facts to the whole week; the passage says nothing about other days.` },
        { id: 'D', text: md`Paolo signed the cash log on Monday.`, note: '' },
      ],
      answer: 'D',
      workingMd: md`The rule is $\neg(\text{opens} \land \text{signs})$ for each cashier, which by De Morgan means each cashier did not open or did not sign. Elena opened the vault, so she did not sign the log. The log was signed by Elena or Paolo; Elena did not, so by disjunctive syllogism Paolo did. The other options either break the rule, go beyond Monday, or claim something the rule forbids for Paolo.`,
      lesson: '"Not both" means at least one is missing; combine it with an "either … or" and one fact settles the other.',
    },
    {
      id: 'check-deliveries-sequence',
      title: 'Five deliveries',
      topic: 'Critical thinking',
      stimulusMd: md`*Five deliveries, V, W, X, Y and Z, are made one after another in slots 1 to 5. W is made immediately after V. X is made earlier than Z. Y is made in slot 2.*`,
      stemMd: md`Which of the following must be true?`,
      options: [
        { id: 'A', text: md`V is made in slot 3.`, note: md`True in one arrangement (X, Y, V, W, Z) but not in the other, where V is in slot 4.` },
        { id: 'B', text: md`X is made in slot 1.`, note: '' },
        { id: 'C', text: md`Z is made in slot 5.`, note: md`Holds only when V and W take slots 3 and 4; with V and W in slots 4 and 5, Z is in slot 3.` },
        { id: 'D', text: md`W is made in slot 5.`, note: md`Holds only in the arrangement X, Y, Z, V, W; in the other, W is in slot 4.` },
      ],
      answer: 'B',
      workingMd: md`Y is in slot 2, so the V–W block fits in slots 3–4 or 4–5 (not 1–2). If V and W take 3 and 4, slots 1 and 5 remain for X and Z, with X earlier: X, Y, V, W, Z. If V and W take 4 and 5, slots 1 and 3 remain: X, Y, Z, V, W. X is in slot 1 in both arrangements, so it must be true; every other option holds in only one arrangement.`,
      lesson: 'List every arrangement that survives the rules; "must be true" means true in all of them.',
    },
  ],
  takeaways: [
    'Only modus ponens and the contrapositive are valid; affirming the consequent and denying the antecedent are not.',
    md`"$P$ only if $Q$" is $P \to Q$; "$P$ unless $Q$" is $\neg Q \to P$.`,
    '"Some" means at least one and reverses; "all" does not reverse; two "some" premises link nothing.',
    'A paradox is resolved by a fact that lets both statements stand, such as a change in the sales mix.',
    'Assumption questions belong to the Law test\'s verbal reasoning; the negation test still sharpens your reading of any argument.',
  ],
  practice: { examKey: 'bocconi-undergraduate', domain: 'bocconi-ug-critical-thinking', skill: 'critical-thinking-draw-conclusions' },
  review: { aiAssisted: true, independentCheckOn: '2026-11-10', expertReview: null },
};
