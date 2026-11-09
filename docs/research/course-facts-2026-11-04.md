# Course facts check: GRE, GMAT, Bocconi Online Test

**Checked on:** 2026-11-04

**Earlier records compared:** `gre-general.md` (2026-09-18), `gmat-focus.md` (2026-09-18),
`bocconi-online-test-undergraduate.md` and `bocconi-online-test-law.md` (2026-09-18),
`bocconi-reverification-2026-10-07.md` (2026-10-07).

## How this was made

An AI research agent fetched the official pages listed below on 2026-11-04 and
compared them with the earlier records. No person has re-read these sources for
this record.

- **ETS:** WebFetch failed on every ets.org page with "Parse Error: Header overflow".
  The agent downloaded the pages with curl instead (all HTTP 200) and extracted the
  text locally. Quotes from these pages are exact.
- **GMAT:** every mba.com URL, including the August 2026 Policies & Procedures PDF,
  returned a bot-protection (Imperva/Incapsula) challenge instead of the page. In a
  browser the pages asked for a CAPTCHA ("Additional security check is required").
  The agent did not try to get past it. GMAT facts below therefore come only from
  **gmac.com** pages (GMAC is the test owner), and several of those are dated
  articles. Facts that only mba.com states were not re-checked today.
- **Bocconi:** curl, HTTP 200. The PDF text was extracted with pdftotext, so PDF
  quotes are exact.

Status values: **confirmed** (an official page fetched today says it),
**changed** (an official page today says something different from the earlier record),
**could not verify** (no page fetched today says it, or the page could not be fetched).

---

## 1. GRE General Test (ETS)

| Fact | Value | Source key | Status |
|---|---|---|---|
| Total time | "about 1 hour and 58 minutes"; five sections | E1 | confirmed |
| Analytical Writing | one "Analyze an Issue" task, 30 minutes; always first | E1, E4 | confirmed |
| Verbal Reasoning | Section 1: 12 questions / 18 min; Section 2: 15 questions / 23 min | E1 | confirmed |
| Quantitative Reasoning | Section 1: 12 questions / 21 min; Section 2: 15 questions / 26 min | E1 | confirmed |
| Section order | V and Q sections "may appear in any order after the Analytical Writing section" | E1 | confirmed |
| Unscored / research section | Only in the "before September 22, 2023" table and its footnotes, which are still on the page. Not in the current-format table. | E1 | confirmed (unchanged) |
| Adaptivity | "section-level adaptive"; first section of each measure "of average difficulty"; second depends on the first | E1, E6 | confirmed |
| Navigation | move forward and backward within a section; Mark and Review; change answers within a section | E1, E7 | confirmed |
| Calculator | "an on-screen calculator for the Quantitative Reasoning section" | E1, E3 | confirmed (Quant only; no page states explicitly that it is blocked elsewhere) |
| Verbal question types | Reading Comprehension, Text Completion, Sentence Equivalence; about half the measure is passage-based | E2 | confirmed |
| Reading Comprehension formats | select one of five; select one or more of three (1 to 3 correct, no partial credit); Select-in-Passage; one to six questions per passage | E2 | confirmed |
| Text Completion | one to five sentences, one to three blanks; 3 choices per blank if 2 or 3 blanks, 5 choices if one blank; no partial credit | E2 | confirmed |
| Sentence Equivalence | one sentence, one blank, six choices, select two; no partial credit | E2 | confirmed |
| Quant question types | Quantitative Comparison; MC select one (five choices); MC select one or more; Numeric Entry; each discrete or in a Data Interpretation set | E3 | confirmed |
| Quant content areas | arithmetic, algebra, geometry, data analysis; level "no higher than a second course in algebra"; no trigonometry, calculus, proofs or inferential statistics | E3 | confirmed |
| V and Q score scale | 130 to 170, one-point increments | E8 | confirmed |
| AW score scale | 0 to 6, half-point increments | E5, E8 | confirmed |
| Raw score / penalty | raw score = number correct; "Nothing is subtracted from your score for incorrect answers." | E6, E7 | confirmed |
| Equating | raw score converted to scaled score by equating; no conversion table published | E6 | confirmed |
| AW scoring method | "6-point holistic scale", "including receiving a score from the e-rater" engine; single reported score | E6, E8 | confirmed |
| AW human reader | The pages fetched today say only that essays are reviewed by "trained analysts" with similarity-detection software and by "experienced content experts". None of them states a human-reader-plus-e-rater rule. | E6 | could not verify (a human score rule is not stated on these pages) |
| Scheduled break | Only "break" text is in the pre-2023 block ("10-minute break following the third section") | E1 | confirmed (still no break documented for the current format) |
| Paper-delivered test | The Verbal page still has the note that Select-in-Passage questions "don't appear on the paper-delivered test" | E2 | could not verify whether a paper test is still offered (unchanged from the earlier record) |

### GRE sources

| Key | URL | What came back |
|---|---|---|
| E1 | https://www.ets.org/gre/test-takers/general-test/prepare/test-structure.html | HTTP 200 (curl); title "GRE General Test Structure" |
| E2 | https://www.ets.org/gre/test-takers/general-test/prepare/content/verbal-reasoning.html | HTTP 200; "GRE General Test Verbal Reasoning Overview" |
| E3 | https://www.ets.org/gre/test-takers/general-test/prepare/content/quantitative-reasoning.html | HTTP 200; "GRE General Test Quantitative Reasoning Overview" |
| E4 | https://www.ets.org/gre/test-takers/general-test/prepare/content/analytical-writing.html | HTTP 200; "GRE General Test Analytical Writing Overview" |
| E5 | https://www.ets.org/gre/test-takers/general-test/prepare/content/analytical-writing/scoring.html | HTTP 200; "GRE General Test Analytical Writing Scoring" |
| E6 | https://www.ets.org/gre/test-takers/general-test/scores/understand-scores.html | HTTP 200; "Understanding GRE General Test Scores" |
| E7 | https://www.ets.org/gre/test-takers/general-test/prepare/strategies-tips.html | HTTP 200; "Strategies & Tips for Taking the GRE General Test" |
| E8 | https://www.ets.org/pdfs/gre/interpreting-gre-scores.pdf | HTTP 200, application/pdf, 335,799 bytes; headed "Interpreting Your GRE Scores: 2026-27" |

WebFetch on E1–E4 returned "Parse Error: Header overflow". The pages were read through curl.

---

## 2. GMAT Exam (GMAC)

| Fact | Value | Source key | Status |
|---|---|---|---|
| Current name | GMAC: "transitioning back to using the 'GMAT Exam' name from July 1, 2024". A GMAC article dated 9 Feb 2026 calls it the "11th Edition of the GMAT (previously called the Focus Edition)". The score pages still say "GMAT Exam (Focus Edition)" in places. | M5, M6, M3 | confirmed: plain "GMAT Exam". The "11th Edition" label is new compared with the earlier record (see Discrepancies). |
| Sections | Quantitative Reasoning 45 min / 21 questions; Verbal Reasoning 45 min / 23; Data Insights 45 min / 20 | M2, M3 | confirmed |
| Total time and length | "2 hours, 15 minutes", 3 sections, 64 questions, "no writing assessment" | M2 | confirmed |
| Section order | "whatever section order they prefer" | M2, M6 | confirmed. The six-order prompt and two-minute default are mba.com details: could not verify today. |
| Break | optional 10-minute break, "after the first or second section" | M6 | confirmed |
| Adaptivity | "computer adaptive, which means it selects each question for the test taker based on his or her ability level" | M5, M8 | confirmed (question by question) |
| Question Review & Edit | bookmark and review "as many questions as they want"; "change up to three answers per section" | M2, M8 | confirmed. The rule that the review screen needs all questions answered and time remaining is an mba.com detail: could not verify today. |
| Calculator | Quant: "you cannot use a calculator during this section". DI: "An on-screen calculator is available in this section." | M6, M3 | confirmed for Quant and DI. No page fetched today speaks about Verbal (only the content makes it moot). |
| Section scores | each 60 to 90 | M3, M4 | confirmed |
| Total score | 205 to 805; "All GMAT Exam scores now end in a 5"; three sections "equally weighted" | M3, M4 | confirmed |
| Scoring factors | number answered, right or wrong, difficulty and other parameters of questions answered | M3 | confirmed |
| DI multi-part credit | "all parts must be correct to score" | M7 (2024 article) | confirmed (GMAC article, not a rules page) |
| Quant content | "21 multiple-choice Problem Solving questions"; measures "Algebraic and arithmetic foundational knowledge" | M3 | confirmed. No page fetched today mentions geometry either way. Data Sufficiency is not in Quant (it is listed under DI). |
| Verbal content | "23 multiple-choice Reading Comprehension and Critical Reasoning questions" | M3 | confirmed. No Sentence Correction: stated in M8 and M9 (2023). |
| Data Insights types | Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation, Two-Part Analysis | M3 | confirmed |
| Percentile tables, score validity, retake limits, P&P rules | mba.com only | M1 | could not verify (mba.com blocked) |

### GMAT sources

| Key | URL | What came back |
|---|---|---|
| M1 | https://www.mba.com/exams/gmat-exam/about/exam-structure (also /about/exam-content, /scores/understanding-your-score, /faqs, the three /prep-strategies/ pages, /exams-and-exam-prep/gmat-exam/what-to-expect-during-gmat, and the Aug-2026 Policies & Procedures PDF) | HTTP 200 but a 212-byte Incapsula challenge stub, not the page. In a browser: an Imperva "Additional security check is required" CAPTCHA. Not bypassed. WebFetch returned empty content. |
| M2 | https://www.gmac.com/gmat-other-assessments/about-the-gmat-focus-edition/exam-overview | HTTP 200; title "The GMAT Exam"; heading "Exam Structure, Content & Features" |
| M3 | https://www.gmac.com/gmat-other-assessments/about-the-gmat-focus-edition/exam-scores | HTTP 200; "GMAT™ Exam Scores" |
| M4 | https://www.gmac.com/gmat-other-assessments/accessing-gmat-exam-scores-and-reports | HTTP 200; "Access and Understand GMAT Exam Scores" |
| M5 | https://www.gmac.com/gmat-other-assessments/about-the-gmat-focus-edition/gmat-focus-edition | HTTP 200; "The GMAT Exam" |
| M6 | https://www.gmac.com/resources/learners/how-to-apply/exams-preparation/what-is-gmat-exam-how-get-started | HTTP 200; "What is the GMAT exam, and how to get started?"; dated February 09, 2026 |
| M7 | https://www.gmac.com/resources/learners/how-to-apply/exams-preparation/gmat-data-insights | HTTP 200; "GMAT Data Insights: How to nail the GMAT data questions"; dated January 29, 2024 |
| M8 | https://www.gmac.com/why-gmac/gmac-news/gmac-press-releases/gmat-focus-edition-the-next-evolution | HTTP 200; "GMAT™ Focus Edition: The Next Evolution of the GMAT™ Will Arrive Later This Year" (2023 press release) |
| M9 | https://www.gmac.com/resources/learners/how-to-apply/exams-preparation/new-gmat-exam-details | HTTP 200; "Details Of New GMAT Exam Revealed, Including Content, Structure & Test Prep" (2023 article) |

M6–M9 are dated GMAC articles and press releases, not rules pages. M2–M5 are GMAC's
current exam reference pages for schools.

---

## 3. Online Bocconi Test (bachelor's) and Online Bocconi Test – Law

| Fact | Value | Source key | Status |
|---|---|---|---|
| Standard test length | "50 multiple-choice questions", "designed SAT-oriented" (IT: "progettate in linea con il test SAT") | B1, B2 | confirmed. The "SAT-oriented" wording was not in the earlier records. |
| Time | "75 minutes" | B1 | confirmed |
| Standard areas | Mathematics 24, Reading comprehension 11, Numerical reasoning 6, Critical thinking 9 | B1 | confirmed. The Italian page says "11 brani" (passages) for reading; see Discrepancies. |
| Mixing | questions distributed "in a mixed way both by difficulty level and by topic" | B1 | confirmed |
| Scoring | right 1 point; missing 0 points; wrong "— 0.2 points" | B1 | confirmed |
| Three-option items | "For questions of the 'critical thinking' area that give only three possible answer options, the penalty will be — 0.33 points" | B1 | confirmed (wording unchanged) |
| Floor | total score "(penalties included) lower than 17" not considered | B1 | confirmed |
| AI bachelor | at least 11 of 24 in Mathematics | B1 | confirmed |
| Navigation | "3 questions on each screen"; after "Next" you "will not be able to return to previous screens" (s.3.2 "SEQUENTIAL NAVIGATION DURING THE TEST") | B3 | confirmed |
| Summary page | "Finish" shows a summary of answered and omitted questions, then "Submit All and Finish" (s.3.3) | B3 | confirmed |
| Calculator | not permitted: "notebooks, notes, formula sheets, calculators" (s.4 list) | B3 | confirmed |
| Language | Italian or English; "independent of the language of instruction" | B3 | confirmed |
| Attempts | up to four per test type per year | B1, B3 | confirmed |
| Law variant length | 50 multiple-choice questions, 75 minutes (time and scoring section is shared) | B1 | confirmed |
| Law areas | Mathematics 5, Reading comprehension 11, Numerical reasoning 6, Logics and critical thinking 18, Verbal reasoning 10 | B1, B2 | confirmed (IT also says "11 brani") |
| Law validity | Law test only for "integrated Master of Arts in Law and Global Law"; the standard test is valid for any programme | B1 | confirmed |
| Official simulation | 50 questions, 75 min, "three per page", cannot return; no monitoring | B1 | confirmed |

### What each area tests (as Bocconi describes it)

- **Reading comprehension (standard):** questions on explicit information and on
  "implicit meaning". The passages "involve economic topics (e.g., GDP, deficit,
  inflation, etc.)" and may contain numbers and data. This is stated on B1 in the
  Law section, as a contrast.
- **Reading comprehension (Law):** "more discursive and humanistic": pedagogy,
  history, philosophy, geography.
- **Numerical reasoning:** "Advanced knowledge of mathematics is not required";
  calculations are simple; the challenge is often to "read a chart or table correctly".
- **Critical thinking (standard):** two question types. (1) Data and statements are
  given; choose which statements are true (or false). (2) A short passage is followed
  by an assertion to judge "true, false, or it cannot be deduced". Bocconi does
  **not** list assumption, strengthen/weaken or flaw items for the standard test.
- **Logic and critical thinking (Law):** "data propositions" items, plus logic items
  with initial conditions answered "using deductive reasoning".
- **Verbal reasoning (Law):** true/false/not deducible items, plus short-argument
  items: "identifying the assumption, the logical conclusion, logical errors", and
  strengthen or weaken.

### Bocconi sources

| Key | URL | What came back |
|---|---|---|
| B1 | https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test | HTTP 200; "Online Bocconi test \| Bocconi University" |
| B2 | https://www.unibocconi.it/it/entrare-bocconi/corsi-di-laurea-triennale-e-giurisprudenza/ammissione/test-online-bocconi | HTTP 200; "Test online Bocconi - Università Bocconi" |
| B3 | https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf | HTTP 200, application/pdf, 1,227,123 bytes; headed "BOCCONI ONLINE TEST Academic Year 2027/28 INSTRUCTIONS AND RULES OF CONDUCT" |

---

## Syllabus topics as published

### GRE Quantitative Reasoning (E3)

- **Arithmetic:** properties and types of integers (divisibility, factorization,
  primes, remainders, odd/even); arithmetic operations, exponents and roots;
  estimation, percent, ratio, rate, absolute value, the number line, decimal
  representation, sequences of numbers.
- **Algebra:** operations with exponents; factoring and simplifying expressions;
  relations, functions, equations and inequalities; linear and quadratic equations
  and inequalities; simultaneous equations and inequalities; word-problem equations;
  coordinate geometry (graphs, intercepts, slopes).
- **Geometry:** parallel and perpendicular lines; circles; triangles (isosceles,
  equilateral, 30°-60°-90°); quadrilaterals; other polygons; congruent and similar
  figures; 3-dimensional figures; area, perimeter, volume; Pythagorean theorem;
  angle measurement in degrees. "The ability to construct proofs is not tested."
- **Data analysis:** descriptive statistics (mean, median, mode, range, standard
  deviation, interquartile range, quartiles, percentiles); tables and graphs (line,
  bar, circle, boxplots, scatterplots, frequency distributions); elementary
  probability; conditional probability; random variables and distributions incl.
  normal; counting (combinations, permutations, Venn diagrams). "Inferential
  statistics is not tested."
- **Excluded:** "trigonometry, calculus or other higher-level mathematics".

**GRE Verbal (E2):** the three question types above. ETS gives no topic syllabus. RC
passages are drawn from physical sciences, biological sciences, social sciences,
business, arts and humanities, and everyday topics.

**GRE Analytical Writing (E4):** one Issue task. ETS publishes the task pool (not fetched today).

### GMAT (M3, M6, M2)

- **Quantitative Reasoning:** Problem Solving only; "Algebraic and arithmetic
  foundational knowledge"; M6: "elementary algebra and arithmetic". No topic list was
  reachable today (the mba.com Exam Content page was blocked). Geometry is not
  mentioned on any page fetched today, in either direction.
- **Verbal Reasoning:** Reading Comprehension and Critical Reasoning. M3 says RC
  measures understanding words and statements, logical relationships, inferences.
- **Data Insights:** Data Sufficiency, Multi-Source Reasoning, Table Analysis,
  Graphics Interpretation, Two-Part Analysis.

### Bocconi standard test, Mathematics (B1). Topic headings exactly as listed

- **Algebra:** polynomials, powers, radicals; first and second degree equations,
  inequalities and two-unknown systems; equations and inequalities with absolute values.
- **Functions:** function, inverse, composition; graphs of powers, logarithms,
  exponentials, absolute value.
- **Plane Geometry:** formulas for triangle, circle, square, trapezoid, rhombus.
- **Analytical Geometry:** points and distance; lines (parallel, perpendicular,
  slope, intersection); parabolas and circles, line–circle/parabola positions.
- **Trigonometry:** main identities; sin, cos, tan, their inverses, graphs, right triangles.
- **Sets:** inclusion, union, intersection, complement, cartesian product.
- **Logarithms/Exponentials:** meaning, simple equations and inequalities, fundamental identities.
- **Discrete Mathematics:** permutations, combinations with and without repetition; sum and product rules.
- **Numbers:** order properties of the reals; percentage; unit conversions.
- **Probability:** union/intersection, total probability theorem, conditional probability, Bayes' theorem.
- **Problem solving:** "simple application problems".
- **Statistics:** absolute, relative, joint and conditional frequencies; measures of
  central tendency and dispersion.

Not listed: calculus (limits, derivatives, integrals), vectors, matrices, complex numbers, sequences/series.

### Bocconi Law test, Mathematics (B1)

Plane Geometry (triangles, rectangles, squares, trapezoids, circles); Analytical
Geometry (points and distances; lines only, with no parabolas or circles); Sets;
Numbers (order properties, percentages, unit conversions). Not listed for Law:
algebra, functions, trigonometry, logarithms/exponentials, discrete maths,
probability, statistics.

---

## Discrepancies with earlier records

1. **GMAT naming (new detail):** a GMAC article dated 9 Feb 2026 (M6) calls the
   current exam the "11th Edition of the GMAT (previously called the Focus Edition)".
   The earlier record says only "GMAT Exam", with "Focus Edition" as the legacy label.
   GMAC's reference page (M5) still says it went back to the plain "GMAT Exam" name
   from July 1, 2024. Suggest adding "GMAT 11th Edition" as a search alias. The
   canonical name stays "GMAT Exam".
2. **GMAT: could not re-verify the mba.com-only details today** (the bot challenge
   blocked them). These are: the six-order prompt with its 2-minute default; the
   review screen needing all questions answered and time remaining; the break overrun
   rule; the percentile figures (2021–2026 sample); and retake and validity rules.
   Nothing seen contradicts them. They stand on the 2026-09-18 record only.
3. **GRE AW scoring:** the brief says "reader + e-rater". The ETS pages fetched today
   describe a "6-point holistic scale" with an e-rater score, plus review by "trained
   analysts" and "content experts". They do not state a human-reader rule. This
   matches the earlier record, which also cites only holistic + e-rater.
4. **Bocconi reading count wording (known, unchanged):** EN says Reading
   comprehension "11 questions"; IT says "11 brani" (passages), for both tests. The
   question totals only add up to 50 if it is 11 questions. This was already flagged
   in `bocconi-online-test-law.md`.
5. **Bocconi critical thinking (standard):** Bocconi lists only true/false-statement
   items and true/false/cannot-be-deduced items. The "assumption" format is listed
   only under the **Law** test's Verbal reasoning. Course material for the standard
   test should not present assumption items as an official Bocconi format.
6. Otherwise none. All GRE structure, timing, adaptivity, scale and question-type
   facts, and all Bocconi structure, scoring, floor, navigation, calculator and
   language facts, match the earlier records.
