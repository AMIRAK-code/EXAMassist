# Bocconi content audit, 7 October 2026

## Scope and method

- **Sample:** 36 of the 133 published Bocconi questions (27%): 21 of 80
  undergraduate and 15 of 53 Law. Stratified by test and area, at least two
  per area and a quarter of each area rounded up, drawn with a fixed seed
  (`20261007`).
- **Method:** three separate AI reviewers, one per batch, each solved its
  items from the stem and options alone before reading the key, then checked
  the key, uniqueness, ambiguity, the explanation, every distractor note, the
  screen-reader text, the skill tag against Bocconi's published topic lists,
  and whether the item suits a no-calculator, about-90-second test.
- **Not a human review.** No person re-solved these items. The result is a
  second, independent AI check, recorded as such; it is not displayed as
  expert review anywhere on the site.

## Results

| | Items | OK | Minor | Error |
| --- | --- | --- | --- | --- |
| Undergraduate mathematics | 10 | 7 | 3 | 0 |
| Undergraduate reading, numerical, critical thinking | 11 | 5 | 6 | 0 |
| Law, all five areas | 15 | 9 | 6 | 0 |
| **Total** | **36** | **21** | **15** | **0** |

No answer key was wrong, and no item had a second defensible answer. Every
skill tag matched its item and Bocconi's topic list.

## Confirmed defects and what was done

Learner-facing defects were fixed with a version bump, so earlier attempts keep
the text they were shown, and a dated note in each question's review record. No
fix touched a stem, an option or an answer key, so no new blind solve was needed.

| Item | Defect | Fix |
| --- | --- | --- |
| ug-logexp-difference-041, ug-prob-bayes-machines-010 | Screen-reader text listed the options in their pre-shuffle order | Listed in the order shown |
| ug-num-solar-multiple-020, ug-num-rail-fare-uplift-308 | Screen-reader text said "listed in increasing order"; the options are not | Listed in the order shown |
| ug-pct-successive-change-011 | Euro signs inside maths mode (fallback font); "roughly a quarter" for exactly 25% | Plain €; "a quarter" |
| ug-num-admissions-not-enrolled-445 | Explanation said "three groups" where there are two | "two groups" |
| ug-read-lottery-main-point-450 | Technique note described the wrong sentence | Rewritten |
| law-logic-notary-deeds-036 | Distractor note described a comparison that does not exist | Rewritten |
| law-logic-late-appeal-037 | Instructions stated as settled that the -0.33 rule covers the Law test; Bocconi does not say so explicitly | Says what Bocconi states and how we score it |
| law-numrsn-mediation-centres-020 | "How to check" miscounted the claims needing division; "roughly a third" for exactly two-fifths; instructions said "a single comparison" | Corrected |
| law-read-promising-structure-042 | Distractor note said the passage has no view of its own | Softened to what the passage does |
| law-verbal-dissent-error-050 | Explanation treated the premise as causal | Corrected |

The screen-reader fault was systematic, so the whole bank was scanned for
descriptions that claim an option order. Five more items had it and were fixed
the same way: ug-num-bakery-average-per-shop-019,
ug-read-congestion-revenue-301, ug-read-shipping-freight-share-304,
gmat-ps-margin-estimation-208 and gmat-ps-markup-discount-201.

**Queued, not fixed here** (each needs a change to a stem or option, and so a
new blind solve):

- ug-read-remittances-explicit-013: three options say "It" of a single
  average, which a test-wise reader can rule out on form alone.
- law-verbal-dissent-error-050: option text "which long service brings about"
  is causal where the premise is not.
- Stimulus law-passage-codification-001: its screen-reader text says four
  paragraphs and 330 words; it has three and about 300.

Internal review metadata (not shown to learners) carries stale option letters
and "Awaiting blind independent solve" notes on many items, and most stimuli
are still in state `in_review` while their questions are published. Neither
affects learners; both are worth tidying in a separate pass.

## A defect found outside the sample: the -0.33 penalty

While checking option counts against Bocconi's rule, the engine turned out never
to apply the -0.33 penalty for three-option critical-thinking questions, although
`/about/how-scoring-works` said it did. Wrong answers on those 12 items (7
undergraduate, 5 Law) scored -0.2. The rule is now config data
(`scoring.itemPenaltyOverrides`) applied per item; results already recorded are
not rescored.

## Regression checks added

- `tests/unit/bocconi-penalty.test.ts`: the -0.33 rule, end to end through a
  scored session.
- `validateQuestion` rules `accessibility-claims-order` and `currency-in-maths`,
  with tests in `tests/unit/content-rules.test.ts`. They run in
  `npm run content:validate` and so in `npm run verify`.

## Limitations

A 27% sample with no wrong key does not show the bank is free of wrong keys.
The reviewers were AI models, like the authors and the original blind solvers,
so shared blind spots are possible. Difficulty and syllabus fit were judged
against Bocconi's topic list, not against real Bocconi items, which are not
published.

---

## Reviewer reports (as returned)

# Audit: 10 Bocconi UG mathematics items

I solved each stem and its options blind before reading the key. Every key matches my own solution, and every item has exactly one defensible option. All skillSlugs match the syllabus in src/lib/exams/configs/bocconi-undergraduate.ts. All items can be done without a calculator in the target time.

Options are not shuffled at runtime: `shuffle` in src/lib/assessment/select.ts orders items and blocks, not options. So a letter reference is correct only if it matches the stored label. KaTeX runs with `strict: false, throwOnError: false` (src/lib/markdown.ts). Question `accessibilityText` is rendered sr-only in attempt-player.tsx:548, so screen-reader users hear it.

## Per item

1. **bocconi-ug-pct-successive-change-011: MINOR.** Key c = €72 is correct (80 x 1.2 = 96, 96 x 0.75 = 72).
   - (a) The euro sign is placed inside math mode: `$€80$` in stemMd, and `$€96$`, `$€72$`, `$€80$` in explanationMd and distractorRationale.a/.d. This is the only item in the bank that does this. KaTeX has no metrics for €, so it falls back silently, and the result does not match the options, which use plain `€80`. Fix: replace every `$€N$` with plain `€N` in all four fields. For example, the stem should read "A jacket is priced at €80. In March its price is increased by $20\%$. …".
   - (b) distractorRationale.a says "20% up and then roughly a quarter down feel symmetric". 25% is exactly a quarter, so "roughly" reads oddly. Proposed: "This assumes the two moves cancel because a $20\%$ rise followed by a $25\%$ fall looks roughly symmetric. They do not: …" (rest unchanged).

2. **bocconi-ug-logexp-difference-041: MINOR.** Key d = 3 is correct. The explanation and the distractor notes are correct (log2 35 ≈ 5.13, the ratio ≈ 2.29, the bracket is 2 to 4).
   - accessibilityText lists the options in the old order: "log base two of thirty-five; the number three; the number eight; and the fraction …". The displayed order is log2 35, 8, ratio, 3. Proposed: "…The options are: log base two of thirty-five; the number eight; the fraction log base two of forty divided by log base two of five; and the number three."

3. **bocconi-ug-logexp-equation-008: OK.** Key b (x = 4) is correct: the domain is x > 2, and x² − 2x − 8 = 0 gives 4 and −2. Distractor a is log2(2x − 2) = 3, which gives x = 5. That and the other notes are correct.

4. **bocconi-ug-prob-bayes-machines-010: MINOR.** Key c = 4/7 is correct (0.04 / 0.07). The explanation and distractors are correct (2/5 is the prior, 3/7 is P(A|D), 1/10 is P(D|B)).
   - accessibilityText says "Answer options are fractions: one tenth, two fifths, three sevenths, four sevenths". The displayed order is 2/5, 3/7, 4/7, 1/10. Proposed: "…Answer options are fractions: two fifths, three sevenths, four sevenths, one tenth."
   - Internal only: review.independentSolve.workingNotes says "Option C (3/7) is P(A|D)". 3/7 is now option B.

5. **bocconi-ug-alg-absolute-value-034: OK.** Key b (1 ≤ x ≤ 4) is correct. Distractor d is the solution of |2x + 5| ≤ 3, which is −4 ≤ x ≤ −1, so that note is correct. The notes all match current labels.

6. **bocconi-ug-comb-delegation-042: OK.** Key d = 195 is correct (210 − 15). The case split 80 + 90 + 24 + 1 is correct. The overcount trap 4 x C(9,3) = 336 is correct. The distractors 15, 80 and 170 are described correctly.

7. **bocconi-ug-fn-inverse-rational-035: OK.** Key b, (2x + 1)/(3 − x), is correct. The round-trip values are correct: A sends 2/3 to 1/7, C to −1, D to 8/3.
   - The "structural check" paragraph cites letters: "rules out C, which outputs −2 at x = 5/4, and D, which is undefined at x = 1/3 … A and B both pass". I checked these against the current labels and they are correct. Optional robustness fix, since sibling items were moved to value references: name the formulas instead of the letters, e.g. "This rules out $\frac{2x+1}{x-3}$, which outputs $-2$ at $x=\tfrac54$, and $\frac{x+2}{3x-1}$, which is undefined at $x=\tfrac13$ instead. $\frac{2x-1}{3-x}$ and $\frac{2x+1}{3-x}$ both pass, …"
   - Internal only: review.notes says "returns 1 only for option A; options B, C and D return 1/7, -1 and 8/3". This is stale; it should be B, with A, C, D returning 1/7, −1, 8/3.

8. **bocconi-ug-sets-interval-difference-404: OK.** Key b (0 < x < 2) is correct: S = (0,4), T = [2,6]. Distractor a = T\S = [4,6] exactly, and the rationale correctly says so. c = S∩T, and d wrongly includes 2.
   - Internal only: workingNotes says "A is part of T\S plus the point 4". This is inaccurate: A is exactly T\S, because 4 ∉ S.

9. **bocconi-ug-analytic-circle-line-039: OK.** Key d (r = 5, two points) is correct. The centre is (3, −2), the distance is 3 < 5, and the intersections are (7,1) and (−1,1). The distractor notes for r = 3, 1 and 2√3 are correct, including 2√3 ≈ 3.46 > 3.
   - Optional nit: explanationMd says "add to the 12 already there". The −12 is on the left-hand side, so "add to the 12 moved across with them" is more accurate. The closing line calls substitution "the safest route", but it does not give the radius, which the question also asks for.
   - Internal only: review.notes says "Only option A states both correctly". It is now D.

10. **bocconi-ug-fn-log-graph-transform-036: OK.** Key d, log2(−x − 3) for x < −3, is correct. The tracked point (1,0) → (−1,0) → (−4,0) is correct. The note on c (log2(3 − x), the reversed order, through (2,0)) is correct. The note on b (no shared point, opposite sides of x = −3) is correct, and so is the note on a.
    - Internal only: review.notes lists domains "x > -3, x < 3, x < -3 and x > -3 respectively … only the third". The current order is x > −3, x > −3, x < 3, x < −3, so the correct one is the fourth.

## Summary

- **Results:** 10 items: 7 OK, 3 MINOR, 0 ERROR. The MINOR items are 011, 041 and 010. Item 035 is OK; its fix below is optional. No wrong keys, no non-unique answers, no wrong distractor mappings, no misalignment.
- **User-facing fixes:**
  - 011: € inside math mode, and the "roughly a quarter" wording.
  - 041 and 010: accessibilityText lists the options in a stale order.
  - 035 (optional): letter references in the explanation are currently correct but fragile.
- **Internal metadata only:** stale letters in 010 workingNotes, 035 review.notes, 039 review.notes and 036 review.notes. The 404 workingNotes describes option A inaccurately. All 10 items still say "Awaiting blind independent solve" in review.notes, although they are published with a recorded independent solve.

# Audit: 11 Bocconi UG items (critical thinking / numerical / reading)

Read-only audit, 2026-10-07. Every item was solved from the stimulus, stem and options before the key and explanations were read. All four skill sets in `src/lib/exams/configs/bocconi-undergraduate.ts` were checked, and every skillSlug used here is valid.

## Critical thinking

### bocconi-ug-crit-export-share-434: OK
- My solve: only shares are given, so the Italian share is the complement, 70% falling to 60% (D). Totals of 100 to 50 and 100 to 200 refute A, B and C both ways. Key D matches.
- The explanation's two worked cases are correct: (30→20, 70→30) and (70→120). The distractor ids match their options, and the explanation uses no letters.
- Skill `critical-thinking-exclude-implications` fits, because three of the options are unsupported implications.

### bocconi-ug-crit-most-overlap-439: OK
- My solve: two groups that are each more than n/2 of the members must overlap. Any member in the overlap sells at the market, so by statement 3 is not exempt. That gives **true** (A). Key A matches.
- The 10-member check (6 + 6 = 12 > 10) is correct. The distractor rationales for b (false) and c (undetermined) match the current options. accessibilityText lists the options in their current order.
- Skill `critical-thinking-deducibility` fits, and the three-option format and its −0.33 penalty note match the config.

### bocconi-ug-crit-certificate-deducible-435: OK
- My solve: 12 < 20, so Brunelli has no certificate, and by the contrapositive of statement 1 it does not export. The assertion is **false** (C). Key C matches.
- The rationales for b (true) and a (undetermined) are correct, and accessibilityText follows the current order (impossible / true / false).
- Skill `critical-thinking-deducibility` fits.

### bocconi-ug-crit-unemployment-rate-440: OK
- My solve: with E fixed, U/(E+U) increases with U. The rate fell, so U fell and the labour force E+U shrank (B). U goes from E/9 to 2E/23, a ratio of 18/23 and a fall of 21.7%, so A ("exactly 20%") is false. C and D depend on the population, which is not given. Key B matches.
- The worked example checks out: 0.9 × 230 = 207, 0.92 × 225 = 207, U = 23 → 18, 5/23 ≈ 21.7%. The distractors match their options.
- Skill `critical-thinking-draw-conclusions` fits.

## Numerical reasoning

### bocconi-ug-num-solar-multiple-020: MINOR
- My solve: 170/40 = 4.25 (A). The other options also check out: 170/120 ≈ 1.42 ("about 1.4"), 170/60 ≈ 2.83 ("about 2.8"), and 130/40 = 3.25. Key A matches, and the stimulus agrees (40, 60, 100, 120, 170; total 490; subsidy total 148). The distractors match their options.
- **accessibilityText** (defect): it says "The four answer options are multiples, listed in increasing order: about 1.4 times, about 2.8 times, 3.25 times and 4.25 times." The current order is A 4.25, B 3.25, C about 1.4, D about 2.8. Proposed text: "The four answer options, in order, are: 4.25 times; 3.25 times; about 1.4 times; about 2.8 times." The better fix is to put the options back in ascending order, as the provenance note itself recommends ("Options are in ascending order, as the real test presents numeric choices"), and keep the text as written. If the order stays, also correct that provenance sentence.
- **explanationMd** (style): the last paragraph says twice that the difference is 1 ("which is always exactly one less" and "note that the two answers differ by exactly $1$ whenever this confusion arises"). Delete the second clause. Also, "times larger" is used loosely in ordinary English, so present the 3.25 reading as the stricter reading rather than as a rule. Suggested replacement: "Some readers take 'how many times larger than' to mean the increase as a multiple of the original, $\frac{170-40}{40} = 3.25$. The stem avoids this by asking 'how many times the capacity connected in 2021', which is the plain ratio, 4.25."
- **review.independentSolve.workingNotes** (internal, stale): it says "Option C (3.25) ... A and B match no pair in the data". The letters predate the shuffle (3.25 is now B), and the claim is wrong: 1.4 and 2.8 are 170/120 and 170/60. Annotate it as pre-shuffle.

### bocconi-ug-num-rail-fare-uplift-308: MINOR
- My solve: Cedro 72/8 = 9, Bora 150/25 = 6, gap 3, and 3 × 25 = 75 (B). Key B matches. The distractors work out: 3 × 8 = 24, (8−6) × 25 = 50 using Alba's 96/12 = 8, and 25 × 9 = 225. The stimulus totals (60 million journeys, 408 million euros) are correct, and the distractor ids match their options.
- **accessibilityText** (defect): it says "The four options are amounts in millions of euros, listed in increasing order: 24, 50, 75, 225." The current order is 225, 75, 50, 24. Proposed text: "The four options, in order, are amounts in millions of euros: 225, 75, 50, 24." Alternatively, restore ascending order. The provenance note "Options are ordered ascending" is also stale.
- **review.notes / workingNotes** (internal): these still say "Awaiting blind independent solve before publication", and the workingNotes letters ("C and D do not match any reading") predate the shuffle and are wrong (50 and 24 are named errors).

### bocconi-ug-num-admissions-not-enrolled-445: MINOR
- My solve: 3,000 × 25% = 750, 750 × 80% = 600, and 750 − 600 = 150 (A). Key A matches. 3,000 − 600 = 2,400, 3,000 − 750 = 2,250, and 2,250 + 150 = 2,400 are consistent. The distractors match, and accessibilityText follows the current order.
- **explanationMd** (wording error): "The three groups among those offered a place must add up: 600 enrolled plus 150 who did not gives 750". There are only two groups. Proposed text: "The two groups among those offered a place must add up: 600 enrolled plus 150 who did not gives 750, which is 25 per cent of 3,000."
- Skill `numerical-reasoning-relevance` fits, because the fee and international columns are superfluous.

## Reading comprehension

### bocconi-ug-read-congestion-economists-302: MINOR (internal metadata only)
- My solve: "an untolled road is not free; it is paid for in time" together with "converts a queue into a price" gives C (a change of form, not a new cost). A reverses the passage, B is ruled out by "a political question rather than an economic one", and D contradicts the last sentence. Key C matches, and only one option is defensible.
- explanationMd is letter-free, its quotations are verbatim, and the distractors match their options. Skill `reading-implicit-meaning` fits, since the stem asks what the passage "suggests" the economists would agree with.
- **review.notes** (stale, contradicts the key): it says "Author's uniqueness check: only D is entailed by the pair of sentences about the economists. A is denied by 'a political question...', B is denied by 'time is distributed as unequally as money', and C is denied by the final sentence's explicit ranking". Every letter is from before the shuffle. Under the current labels the key C is called "denied". Proposed text: "Author's uniqueness check: only the change-of-form option is entailed by the pair of sentences about the economists. The revenue-return condition is denied by 'a political question rather than an economic one', the queues-are-fairer option by 'time is distributed as unequally as money', and the charge-level option by the final sentence's ranking of exemption design above charge level." Also remove the stale "Awaiting blind independent solve" line.

### bocconi-ug-read-lottery-main-point-450: MINOR
- My solve: the thesis in paragraph 3 is "clean on its own question; error lies in carrying that answer over". That is C. D is the "too quick" reading, A contradicts "None of this diminishes the study", and B overgeneralises the finding. Key C matches, and no second option is defensible.
- The distractors match their options, and the quotations are verbatim. Skill `reading-information-processing` (overall comprehension) fits a main-point item.
- **explanationMd, Technique paragraph** (wording error): "When a paragraph begins \"It is tempting to\" or \"None of this\", the sentence that follows is usually a view the author is about to qualify or a concession, not the thesis." Taken literally, the sentence after "It is tempting to read this..." is "The inference is too quick", which is the author's rejection, not the tempting view. Proposed text: "When a paragraph begins \"It is tempting to\" or \"None of this\", that opening sentence is usually a view the author is about to qualify, or a concession, not the thesis. Read on to the sentence that says where the error lies."

### bocconi-ug-read-remittances-explicit-013: MINOR
- My solve: "about 6.2 per cent, more than double the 3 per cent target" gives D. Key D matches. A drops the exclusivity condition, B is contradicted by intra-African corridors above 8%, and C swaps the corridors. The distractors match their options, and accessibilityText follows the current order.
- **stemMd / options** (logical coherence): the stem asks what is stated "about the global average charge for sending 200 dollars", and each option's subject "It" refers to that average. But A–C ascribe corridor-level or market-level properties to a single global average: "It is highest in the corridor running from the Gulf states...", "It has fallen below 4 per cent in every corridor". A global average has no value per corridor, so these distractors don't make sense as written, and a test-wise candidate can rule them out on form alone. Proposed stemMd: "According to the passage, which of the following is stated about the cost of sending remittances?" Rewrite the options with their own subjects:
  - A: "Charges have not changed in any market over the past decade, despite the spread of mobile money."
  - B: "Charges have fallen below 4 per cent in every corridor, including the intra-African ones."
  - C: "Charges are highest in the corridor running from the Gulf states to South Asia, at over 8 per cent."
  - D: "The global average charge for sending 200 dollars is more than twice the 3 per cent target set under the Sustainable Development Goals."

  After that, check the length cue again (D becomes longest). Trimming D to "The global average charge is more than twice the 3 per cent target set under the Sustainable Development Goals." keeps the lengths close.
- explanationMd: "each fail on a single word ...: *any* market, *every* corridor, and *highest*". For C, the error is the swap of corridors, not the word "highest". Suggested: "...*any* market, *every* corridor, and a swap of the cheap and expensive corridors."

### bocconi-ug-read-water-family-price-447: OK
- My solve: the tariff is "applied to each connection, not to each person". The family's 12 m³ pass the 10 m³ cheap block, so D. Key D matches. A is contradicted ("every member ... uses less"), B describes a price rule that is never stated, and C is imported from paragraph 1.
- The arithmetic checks out: 8.00 + 4.80 = 12.80, 12.80/12 ≈ 1.07, and 5 × 0.80 = 4.00. The distractors match their options, and the explanation is letter-free. Skill `reading-explicit-information` fits.

## Cross-cutting observation (not counted)
All seven referenced stimuli have `"state": "in_review"`, while the items are `published`. That is true of 92 of the 111 stimuli in the repo, and no loader code appears to gate on stimulus state, so it is probably harmless. Still, check it against the publication policy.

## Summary
- ERROR: 0
- MINOR: 6, as follows:
  - 020: accessibilityText order; redundant/contested "times larger" wording; stale notes
  - 308: accessibilityText order; stale notes
  - 445: "three groups"
  - 302: stale review.notes with pre-shuffle letters that contradict the key
  - 450: Technique sentence
  - 013: stem/option subject mismatch; explanation "highest"
- OK: 5 (434, 439, 435, 440, 447)

All 11 keys are correct and uniquely defensible, and every distractorRationale id matches its option. No user-facing explanation contains a letter reference.

# Bocconi Law content audit: 15 published items

Read-only audit. For each item I solved the stem and options myself before I read the key. Then I checked the key, the explanation, the distractor rationales, the stimulus figures and the skill fit against `src/lib/exams/configs/bocconi-law.ts`.

A mechanical scan of explanationMd, distractorRationale and instructionsMd found no letter-based option references ("option B", "(c)" and similar) in any of the 15 items. Every distractorRationale key names the right option.

## Per-item verdicts

### 1. bocconi-law-logic-mediation-agreements-031: OK
- My solve: mediation-agreement (MA) cases are a subset of the 120 settled cases, so there are 45 MA cases in total and 155 cases without one. The answer is "Exactly 45 of the 200 cases" (d). (a) is false (155, not 80), (b) is the converse, and (c) is false (45/120 = 37.5%). The key d matches and the answer is unique.
- The explanation, the arithmetic (45/75/80/155) and the rationales are all correct. The skill (data propositions) fits.

### 2. bocconi-law-logic-archiving-rule-014: OK
- My solve: archived means signed off (rule 1). Rule 2 then forbids archiving before notification, so the client had been notified by the time of archiving (d). The order of sign-off and notification is not fixed, so (a) and (b) fail. (c) is the converse of rule 1. The key d matches and the answer is unique.
- The explanation and the two-timeline check are correct. Rationales a, b and c each describe their own option. The skill (deductive conditions) fits.

### 3. bocconi-law-logic-course-enrolment-033: OK (skill note)
- My solve: Roman Law (RL) is a subset of Legal History (LH), and Comparative Private Law (CPL) is disjoint from LH, so RL and CPL are disjoint (a). (b), (c) and (d) all fail on one counter-model. The key a matches and the answer is unique.
- The v3 counterexample now includes a Canon Law student outside LH. That makes it falsify (b), (c) and (d) together.
- Note, optional: this is a pure categorical syllogism ("three facts, must be true"). It arguably fits `law-logic-deductive-conditions` ("initial conditions followed by a question to be answered by deductive reasoning") better than `law-logic-data-propositions`. Either is defensible, so no change is required.

### 4. bocconi-law-logic-notary-deeds-036: MINOR
- My solve: company deeds = 10. 36 > 14 + 10 = 24, so (b). (a) fails (10 < 14), (c) fails (60%) and (d) fails (15 ≠ 14). The key b matches and the answer is unique.
- Defect, `distractorRationale.c`, which is internally incoherent: "This option treats 36 as a minority because it is smaller than the total of the other two categories' headline numbers before they are added — or simply compares 36 with 60 without halving." 36 is larger than 14, 10 and 24, so the first clause describes no possible reasoning.
  - Proposed: "Property transfers are 36 out of 60, which is 60 per cent — more than half, since half of 60 is 30. This option comes from comparing 36 with the whole 60 rather than with half of it, and so treating it as a minority."

### 5. bocconi-law-logic-late-appeal-037: MINOR
- My solve: the contrapositive of Rule 1 turns "not dismissed without a hearing" into "not late" (b). (a) contradicts this and (c) contradicts the stem. Rule 2 does not apply. The key b matches and the answer is unique.
- Option count: a three-option item in the Logic and critical thinking area is consistent with Bocconi's rule and with the config's `itemPenaltyOverrides` (-0.33).
- Defect, `instructionsMd`: "On the real test a wrong answer to a three-option critical-thinking item costs 0.33 points instead of 0.2". This states as fact something the config lists under `unverified`: "Whether the -0.33 three-option penalty applies inside the Law test … Bocconi does not state the mapping explicitly."
  - Proposed: "This question has only three answer options. Bocconi states that a wrong answer to a three-option 'critical thinking' item costs 0.33 points instead of 0.2; it does not say explicitly that this applies to the Law test, but this practice scores it that way, so an unaided guess is worth less here than elsewhere."
- Nit: `distractorRationale.a` says "reading the contrapositive without reversing the negation", which is vague. Possible rewording: "…comes from affirming what the contrapositive of Rule 1 denies."

### 6. bocconi-law-math-sets-neither-300: OK
- My solve: A = {3,6,9,12}, B = {2,4,6,8,10,12} and A∩B = {6,12}, so |A∪B| = 8. That leaves 4 elements in neither set: {1,5,7,11}. The answer is 4 (b). The key b matches.
- The explanation and all three rationales (2 = no overlap correction, 6 = |U\B|, 8 = |U\A| = |A∪B|) are arithmetically correct. The skill (sets) fits.

### 7. bocconi-law-math-plane-geometry-trapezium-001: OK
- My solve: the trapezium's area is (14+8)/2 × 6 = 66, so ½ × 12 × h = 66 and h = 11 (c). The key c matches.
- The rationales (14 = longer side only, 22 = unhalved sum, 5.5 = dropped ½) are correct. The "-0.2" reminder matches the config. The skill (plane geometry) fits.
- Internal metadata only: `review.independentSolve.workingNotes` says "5.5 cm from halving twice". 5.5 actually comes from dropping the ½, as the rationale correctly states. This field is not learner-facing.

### 8. bocconi-law-numrsn-mediation-centres-020: MINOR
- My solve: Dora 1500 − Arno 1200 = 300, and both resolved 900, so (a) is true. (b) is a tie (75% each). (c) is reversed: Dora has the most mediators and the longest time, 50 days. (d) is a tie (60 per mediator each). The key a matches and the answer is unique.
- Defect 1, `explanationMd` ("How to check"): "Notice that only the Dora-and-Arno claim can be settled without dividing anything, and that the other three each fail on a comparison that turns out to be an equality or a reversal. Re-run those three:". This is false: the claim about mediators and the shortest average also needs no division. The text then re-runs only two checks.
  - Proposed: "Notice that the Dora-and-Arno claim and the claim about mediators and the shortest average need no division at all, while the other two fail on comparisons that turn out to be exact ties. Re-run those two:"
- Defect 2, `distractorRationale.d`: "Chienti does have roughly a third of Dora's staff, but it also resolved roughly a third as many cases". 6/15 and 360/900 are both exactly two-fifths. The rationale also never explains where "six" comes from.
  - Proposed: "Chienti has two-fifths of Dora's staff (6 against 15) and resolved exactly two-fifths as many cases (360 against 900), so both centres resolved 60 cases per mediator and the ratio is 1, not 6. The 'six' is lifted from Chienti's mediator count rather than computed."
- Defect 3, `instructionsMd`: "Each statement can be settled by a single comparison". The correct option needs two comparisons (received and resolved), and the explanation itself says "two columns".
  - Proposed: "No calculator is permitted. Each statement can be settled by one or two quick comparisons; find the figures that decide it and ignore the rest of the table."
- Stimulus `bocconi-law-table-mediation-centres-003`: the figures match the explanation. Its state is "in_review" (see the systemic note below). The skill (relevant vs superfluous) fits.

### 9. bocconi-law-numrsn-applications-per-place-021: OK
- My solve: the applications-per-place ratios are 8, 9, 8, 8.8 and 8. The changes are +1, −1, +0.8 and −0.8, so the largest fall is 2021 to 2022 (c). The key c matches and the answer is unique.
- The growth-rate check (+1/4 vs +1/9 and +1/5 vs +1/11) is correct, and the rationales are correct. The skill (reasoning over calculation) fits. The stimulus state is "in_review" (see the systemic note).

### 10. bocconi-law-read-promising-borrowing-041: OK
- My solve: the final paragraph says promisors "draw on a practice they did not create and cannot unilaterally alter". "Borrowing" sums this up, which is (d). The key d matches.
- The explanation and rationales are sound. The skill (implicit meaning) fits.

### 11. bocconi-law-read-codification-main-point-006: MINOR (stimulus field)
- My solve: the central claim is (a): writing custom down changed dispute settlement and shifted authority to jurists. (b) is the rejected contemporary view, (c) is an invented motive, and (d) misreads the disappearing clauses as the abandonment of custom. The key a matches and the answer is unique.
- The item's explanation is correct and refers to Paragraphs 1–3 correctly.
- Defect, stimulus `content/stimuli/bocconi-law/bocconi-law-passage-codification-001.json` → `accessibilityText`: "A four-paragraph prose passage of about 330 words". The bodyMd actually has 3 paragraphs and 303 words.
  - Proposed: "A three-paragraph prose passage of about 300 words on the history of law. …" Keep "The final paragraph discusses clauses…" as it is, because it is correct once the count is 3.
- The skill (humanistic passages) fits.

### 12. bocconi-law-read-promising-structure-042: MINOR (low priority)
- My solve: the passage sets out a puzzle, then examines two answers, each found incomplete ("Yet it too…"). That is (a). The key a matches and the answer is unique.
- Defect, `distractorRationale.d`: "The passage advances no theory of its own. … ends with an unresolved difficulty, so its final paragraph undercuts rather than supports a position." The closing sentence ("Whatever else a promise is, it is a borrowing") is an authorial claim, so "advances no theory of its own" is overstated. The option is still wrong, because nothing is supported by two independent arguments.
  - Proposed: "The passage does not set out a theory of its own and then argue for it. It examines two accounts attributed to others and ends by raising a further difficulty for the second, summed up in a one-line remark rather than defended by independent arguments. This option mistakes sustained criticism for advocacy."

### 13. bocconi-law-verbal-gazette-conclusion-017: OK
- My solve: if the rule had been enacted this session and its date were its enactment date, premise 1 would contradict premise 2. So at least one of those two conditions fails, which is (d). (a) contradicts premise 1, (b) overreaches, and (c) assumes the date is the enactment date. The key d matches and the answer is unique.
- The two-world check works: enacted 1 March, published 10 March, dated 1 January, which is more than 30 days after the borne date. The rationales are correct. The skill (conclusion) fits.

### 14. bocconi-law-verbal-dissent-error-050: MINOR
- My solve: this is affirming the consequent, so (d) is the only defensible description. (a) has the direction backwards, (b) involves no authority, and (c) involves no collective/individual confusion. The key d matches.
- Defect, `options[d].textMd` and `explanationMd` read the universal conditional causally. The premise says only that every long-serving judge has dissented; it does not say long service causes dissents. The blind solver noticed this too.
  - The option says: "It treats writing dissents, which long service brings about, as though it established long service." Proposed: "It treats writing dissents, which every long-serving judge has done, as though that were enough to establish long service."
  - The explanation says "Dissents are a consequence of long service, not a proof of it" and "…as treating dissents, which long service brings about, as though they established long service…". Proposed: "Having dissented is guaranteed by long service, not proof of it" and "…as treating dissents, which every long-serving judge has written, as though they established long service…".
  - Changing the option text requires a re-solve under the item's own process.

### 15. bocconi-law-verbal-filing-fee-assumption-016: OK
- My solve: the argument needs higher fees to lead to fewer filings, which is (b). The negation test breaks the argument for (b) only. The key b matches.
- The explanation and rationales are correct. The skill (assumption) fits.

## Alignment and option count
- All skillSlugs exist in the config and sit under their domainSlug. The spread is: Mathematics 2, Reading 3, Numerical 2, Logic 5, Verbal 3.
- Option counts: all non-logic items have 4 options. The logic items have 4, 4, 4, 4 and 3; only 037 has three options and carries the -0.33 penalty. The config states that option counts are editorial, so nothing is inconsistent.

## Systemic notes, not counted per item
- All 9 stimuli in `content/stimuli/bocconi-law/` have `"state": "in_review"`, while the items that reference them (020, 021, 041, 006, 042) are published. The loader does not gate on stimulus state, so this has no runtime effect, but it is a lifecycle inconsistency.
- `review.notes` on most items still contain pre-shuffle option letters. They carry a disclaimer and are not learner-facing.

## Summary
- **OK: 9** (031, 014, 033, 300, trapezium-001, 021, 041, 017, 016)
- **MINOR: 6** (036, 037, 020, 006 via its stimulus, 042, 050)
- **ERROR: 0**

All 15 keys are correct and every item has exactly one defensible answer.
