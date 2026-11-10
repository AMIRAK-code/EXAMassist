# Course authoring brief

The rules for writing and checking lessons in the study courses
(`src/lib/courses/`). The data model and its comments are in
`src/lib/courses/types.ts`; the model lesson to copy for shape, depth and
tone is `src/lib/courses/content/gre/percent-lesson.ts`.

## Non-negotiable

1. **Original work only.** Do not copy, paraphrase or reskin anything from
   ETS, GMAC, Bocconi or any prep company: no passages, questions, essay
   prompts, explanations or example sentences. Invent the situation, the
   numbers and the wording. Never present material as official, a past
   question, or "real exam" material; the validator rejects such phrases.
2. **Exam facts come only from the research records**:
   `docs/research/course-facts-2026-11-04.md` (checked 4 November 2026) and
   the per-exam records beside it. If a fact is not there, do not state it.
   Do not invent statistics ("80% of test takers…"), score effects or
   percentiles.
3. **Every worked example and every check question must be correct.** Work
   every number twice, by two routes where possible, before writing it down.
   A check question has exactly one defensible answer; argue for each wrong
   option before you accept the item.
4. **Authors never publish.** Write every lesson with
   `review: { aiAssisted: true, independentCheckOn: null, expertReview: null }`.
   An independent checker, who did not write the lesson, re-derives every
   example and solves every check without looking at the key; only when all
   agree does the checker set `independentCheckOn` to the date. Nobody sets
   `expertReview`: no human expert has reviewed the courses, and the pages
   say so.

## Lesson shape

| Field | Rule |
| --- | --- |
| `slug` | kebab-case, unique within the course (the plan below fixes them). |
| `summary` | 50–160 characters: the lesson's promise; it is the meta description. |
| `minutes` | Honest time to read and do the check (usually 12–25). |
| `objectives` | 2–4 "you will be able to" statements, without that prefix. |
| `teachMd` | The teaching, 600–1,200 words. Subheadings start at `###`. Explain why, not only how. Tables are fine. |
| `examples` | 2–4 worked examples, each with 2–6 `steps` that say what to do and why, and an `answerMd` that also names the tempting wrong answer when there is one. |
| `traps` | 2–5 named traps: what it looks like, why it catches people, how to avoid it. |
| `check` | 3 questions (2–5 allowed), the exam's own style. Options `A`, `B`, `C`… in order; the key's `note` is `''`; every wrong option's `note` says the specific misreading that produces it. `workingMd` solves it fully; `lesson` is one carry-over sentence. `topic` is the exam's own name for the question type or topic. |
| `takeaways` | 3–5 one-liners. |
| `practice` | `{ examKey, domain, skill? }` with slugs from the exam config (`npx tsx tmp/tax.ts` lists them). |

Option counts: GRE and GMAT checks have 5 options (GRE quantitative comparison
has its 4 fixed choices; a GRE sentence-equivalence check offers 5 pairs;
GMAT data sufficiency has its 5 fixed statements). Bocconi checks have 4
options, except critical thinking items in the true / false / cannot be
deduced form, which have 3. TOLC checks have 5 options with exactly one correct answer.

## Writing

- One spelling style everywhere, the site's British English: "practise" is
  the verb and "practice" the noun, "analyse", "colour", "-ise" endings.
- Plain, direct sentences. No filler ("In this lesson we will…"), no hype, no
  emojis.
- Maths in `$...$` or `$$...$$`. A literal dollar sign outside maths is `\$`;
  inside maths it is `\$` too. No backticks anywhere (lesson text is inside
  `md` template strings). Never write `${`.
- Do not cite option letters in a check's `workingMd` or `lesson`; name the
  option by its content. (Notes sit next to their own option, so they need
  no letter either.)
- Internal links only to pages that exist: `/exams/<hub>`, `/exams/<hub>/format`,
  `/guides/<slug>`, `/courses/<course>/<lesson-slug>` from the plan below.

## Files and tools

- One file per unit: `src/lib/courses/content/<course>/<unit>.ts`, exporting
  `export const <name>Unit: Unit = { slug, title, summary, lessons: [...] }`.
  Lessons may sit in the same file or in their own files.
- Edit only with the Write and Edit tools. On this Windows machine Bash
  collapses backslashes, which destroys TeX.
- Check a unit file before handing it in, and paste the output:
  `npx tsx scripts/check-courses.ts src/lib/courses/content/<course>/<unit>.ts`
  It must print 0 issues. It checks structure, KaTeX rendering of every
  formula, stray `$`, TeX outside maths, control characters, official-sounding
  claims and practice slugs.

## The plan (lesson slugs are fixed)

### GRE (`/courses/gre`, practice exam `gre`)

| Unit file | Unit slug | Lessons |
| --- | --- | --- |
| getting-started.ts | getting-started | how-the-gre-works |
| text-completion.ts | text-completion | text-completion-reading-for-clues, text-completion-signal-words, text-completion-two-and-three-blanks, text-completion-vocabulary-in-context |
| sentence-equivalence.ts | sentence-equivalence | sentence-equivalence-method, sentence-equivalence-pairs-and-near-misses, sentence-equivalence-tone-and-intensity |
| reading-comprehension.ts | reading-comprehension | reading-passage-structure, reading-main-idea-and-purpose, reading-detail-and-inference, reading-select-in-passage-and-multiple-answer, reading-argument-passages, reading-strengthen-weaken-explain |
| quant-question-types.ts | quant-question-types | quantitative-comparison-strategy, numeric-entry-and-multiple-answer |
| arithmetic.ts | arithmetic | integers-divisibility-and-primes, remainders-odd-even-and-sign, exponents-and-roots, fractions-decimals-and-the-number-line, percents-and-percent-change (the model lesson), ratios-and-proportions, rates-work-and-speed, sequences |
| algebra.ts | algebra | linear-equations-and-systems, algebraic-expressions-and-factoring, quadratic-equations, inequalities-and-absolute-value, functions-and-symbolic-operations, coordinate-geometry-lines, word-problems-into-equations |
| geometry.ts | geometry | lines-and-angles, triangles-and-the-pythagorean-theorem, special-right-triangles-and-similarity, circles, quadrilaterals-polygons-and-area, three-dimensional-figures |
| data-analysis.ts | data-analysis | mean-median-mode-and-range, standard-deviation-quartiles-and-boxplots, reading-graphs-and-data-interpretation, counting-permutations-and-combinations, probability, distributions-and-the-normal-curve |
| analytical-writing.ts | analytical-writing | issue-task-what-is-scored, planning-an-issue-essay, writing-and-revising-under-time |

### GMAT (`/courses/gmat`, practice exam `gmat`)

| Unit file | Unit slug | Lessons |
| --- | --- | --- |
| getting-started.ts | getting-started | how-the-gmat-works |
| quant-arithmetic.ts | quant-arithmetic | number-properties, fractions-decimals-and-percents, ratios-and-mixtures, rates-work-and-travel, statistics-for-quant |
| quant-algebra.ts | quant-algebra | linear-equations-and-systems, quadratics-and-exponents, inequalities-and-absolute-value, functions-sequences-and-custom-operations, estimation-and-answer-choices |
| quant-word-problems.ts | quant-word-problems | overlapping-sets, counting, probability, interest-and-growth |
| critical-reasoning.ts | critical-reasoning | argument-anatomy, assumption-questions, strengthen-questions, weaken-questions, evaluate-the-argument, flaw-questions, plan-and-discrepancy-questions, inference-questions |
| reading-comprehension.ts | reading-comprehension | passage-mapping, main-idea-and-structure, inference-and-application, detail-and-style |
| data-sufficiency.ts | data-sufficiency | data-sufficiency-fundamentals, data-sufficiency-yes-no-questions, data-sufficiency-traps |
| data-insights.ts | data-insights | table-analysis, graphics-interpretation, two-part-analysis, multi-source-reasoning, data-insights-calculator-and-pacing |

### Bocconi (`/courses/bocconi`, practice exam `bocconi-undergraduate`)

| Unit file | Unit slug | Lessons |
| --- | --- | --- |
| getting-started.ts | getting-started | how-the-bocconi-test-works, negative-marking-and-guessing |
| algebra.ts | algebra | algebraic-expressions-and-identities, first-and-second-degree-equations, first-and-second-degree-inequalities, systems-with-two-unknowns, absolute-values, expressing-quantities-as-functions |
| functions.ts | functions | functions-domain-and-notation, graphs-of-elementary-functions, exponentials-and-logarithms, exponential-and-logarithmic-equations |
| geometry.ts | geometry | plane-geometry-formulas, points-distances-and-lines, parabolas-and-circles, lines-and-conics, trigonometry-in-right-triangles, trigonometric-functions-and-identities |
| numbers-and-sets.ts | numbers-and-sets | sets-and-venn-diagrams, ordering-real-numbers, percentages-and-unit-conversion |
| counting-probability-statistics.ts | counting-probability-statistics | permutations-and-combinations, counting-problems, probability-basics, union-intersection-and-complements, conditional-probability-and-bayes, frequencies-centre-and-spread |
| reading.ts | reading | reading-explicit-information, reading-implicit-meaning, reading-economic-passages-with-data |
| numerical-reasoning.ts | numerical-reasoning | charts-and-tables, relevant-and-superfluous-information, calculating-by-hand |
| critical-thinking.ts | critical-thinking | true-false-or-cannot-be-deduced, drawing-valid-conclusions, excluding-unsupported-implications, quantifiers-and-conditionals |

### Bocconi master's (`/courses/bocconi-master`, practice exam `bocconi-graduate`)

Exam facts: `docs/research/bocconi-master-facts-2026-11-09.md` only. Checks have 4 options (Bocconi publishes no option count; our practice uses four).

| Unit file | Unit slug | Lessons |
| --- | --- | --- |
| getting-started.ts | getting-started | how-the-bocconi-master-test-works, scoring-pacing-and-guessing |
| verbal-reasoning.ts | verbal-reasoning | reading-passages-for-structure, main-idea-and-author-purpose, detail-and-inference-questions, data-and-statements, argument-structure, quantifiers-and-conditionals, assumptions, strengthen-and-weaken, flaws-and-evaluation, statistical-reasoning-flaws |
| data-insight.ts | data-insight | reading-tables, bar-and-line-charts, pie-charts-and-shares, percentages-and-growth-in-data, compound-growth-over-several-years, averages-and-weighted-data, subgroups-and-aggregates, combining-tables-and-charts, data-sufficiency-basics, data-sufficiency-pitfalls |
| quantitative-reasoning.ts | quantitative-reasoning | numbers-and-divisibility, fractions-ratios-and-proportions, percentages-and-successive-changes, interest-present-value-and-break-even, equations-and-systems, quadratics-and-inequalities, exponentials-logarithms-and-sequences, rates-work-and-mixtures, sets-and-overlaps, counting-and-probability, conditional-probability-and-expected-value, averages-and-basic-statistics |
| beyond-basic-maths.ts | beyond-basic-maths | derivatives-and-optimisation, normal-distribution-and-hypothesis-tests (optional: topics in Bocconi's 2024 sample, not on the current page's description) |

### TOLC-I (`/courses/tolc-i`, practice exam `tolc-i`)

Exam facts come from `docs/research/cisia-tolc.md` and `src/lib/exams/configs/tolc-i.ts`. The course covers the four main sections. English is scored separately.

| Unit file | Unit slug | Lessons |
| --- | --- | --- |
| getting-started.ts | getting-started | how-the-tolc-i-works |
| mathematics.ts | mathematics | real-numbers-powers-and-radicals, ratios-percentages-and-divisibility, polynomial-division-and-factorisation, quadratic-equations-and-inequalities, rational-inequalities-and-systems, radical-and-absolute-value-inequalities, exponential-and-logarithmic-equations, plane-geometry-triangles-and-circles, solid-geometry-and-scaling, coordinates-lines-and-distances, circles-parabolas-ellipses-and-hyperbolas, function-domains-inverses-and-transformations, exponential-and-logarithmic-graphs, unit-circle-and-trigonometric-equations, sine-and-cosine-rules, weighted-means-and-probability |
| logic.ts | logic | implications-and-conditions, quantifiers-negation-and-venn-diagrams, constraints-guarantees-and-flows, sequences-and-patterns |
| sciences.ts | sciences | vectors-motion-and-inclined-planes, energy-fluids-and-ideal-gases, charges-circuits-and-optics, atoms-bonds-and-reacting-amounts, solutions-equilibrium-and-ph |
| verbal-comprehension.ts | verbal-comprehension | cohesion-and-inference, stated-information-and-meaning-in-context |

### TOLC-E (`/courses/tolc-e`, practice exam `tolc-e`)

Exam facts come from `docs/research/cisia-tolc.md` and the TOLC-E configuration. Shared teaching is independently checked with its course-specific practice mapping.

| Unit file | Unit slug | Lessons |
| --- | --- | --- |
| getting-started.ts | getting-started | how-the-tolc-e-works |
| logic.ts | logic | implications-and-conditions, quantifiers-negation-and-venn-diagrams, constraints-guarantees-and-flows, sequences-and-patterns, arguments-assumptions-and-evidence |
| verbal-comprehension.ts | verbal-comprehension | stated-information-and-meaning-in-context, cohesion-and-inference, purpose-and-passage-structure, reading-claims-and-comparisons |
| mathematics.ts | mathematics | real-numbers-powers-and-radicals, ratios-percentages-and-divisibility, polynomial-division-and-factorisation, linear-equations-and-modelling, quadratic-equations-and-inequalities, rational-inequalities-and-systems, radical-and-absolute-value-inequalities, exponential-and-logarithmic-equations, plane-geometry-triangles-and-circles, solid-geometry-and-scaling, coordinates-lines-and-distances, circles-parabolas-ellipses-and-hyperbolas, function-domains-inverses-and-transformations, exponential-and-logarithmic-graphs |

### TOLC-F (`/courses/tolc-f`, practice exam `tolc-f`)

Exam facts come from `docs/research/cisia-tolc.md` and the TOLC-F configuration. Lessons cover its five main sections, with an introduction and practice links into every domain.

| Unit file | Unit slug | Lessons |
| --- | --- | --- |
| getting-started.ts | getting-started | how-the-tolc-f-works |
| biology.ts | biology | biological-molecules-water-and-enzymes, biodiversity-classification-and-viruses, cells-organelles-and-membrane-transport, cell-division-dna-and-inheritance, photosynthesis-respiration-and-fermentation, ecosystems-food-webs-and-populations, human-organ-systems-and-homeostasis |
| chemistry.ts | chemistry | atoms-bonds-and-reacting-amounts, inorganic-compounds-formulas-and-names, oxidation-numbers-and-electron-transfer, solutions-equilibrium-and-ph, carbon-bonding-isomers-and-functional-groups |
| mathematics.ts | mathematics | real-numbers-powers-and-radicals, ratios-percentages-and-divisibility, polynomial-division-and-factorisation, quadratic-equations-and-inequalities, rational-inequalities-and-systems, radical-and-absolute-value-inequalities, exponential-and-logarithmic-equations, plane-geometry-triangles-and-circles, solid-geometry-and-scaling, coordinates-lines-and-distances, circles-parabolas-ellipses-and-hyperbolas, function-domains-inverses-and-transformations, exponential-and-logarithmic-graphs, unit-circle-and-trigonometric-equations, sine-and-cosine-rules, weighted-means-and-probability, factorials-combinations-and-probability |
| physics.ts | physics | physical-quantities-units-and-errors, vectors-motion-and-inclined-planes, energy-fluids-and-ideal-gases, charges-circuits-and-optics, magnetic-forces-waves-and-thin-lenses |
| logic.ts | logic | implications-and-conditions, quantifiers-negation-and-venn-diagrams, constraints-guarantees-and-flows, sequences-and-patterns, graphs-tables-and-justified-comparisons |

## Independent check

The checker reads each lesson cold and, for every worked example and check
question, solves it without looking at the stated answer, then compares. It
also confirms every wrong option is really wrong, every note matches its
option, no exam fact goes beyond the research record, and nothing reads as
copied. It fixes small errors in place (typos, a wrong intermediate number
that does not change the answer) and lists them; anything bigger goes back
to the author. Then it sets `independentCheckOn` on the lessons that pass and
leaves `null` on any that do not, with the reason in its report.
