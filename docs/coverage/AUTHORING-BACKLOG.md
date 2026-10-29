# Question bank expansion backlog

Generated 2026-10-29 by `npm run content:coverage -- --write`; no approvals: the review ledger is empty, as it is in any database right after migration 014.

Counts are independent items: questions sharing a passage are one unit across sets, and near-duplicate
variants of one question are one unit. "Pending review" is what approving the questions already awaiting
human review would supply; "to author" is what remains after that. Approving pending questions is always the
cheaper first step. Essay formats are outside this plan. Opening a simulation also needs its exam rules
verified; content alone never opens it.

Plan settings (src/lib/content/coverage.ts): 3 non-overlapping sets per format (a planning
target, not an official requirement); topic practice floor 6 per skill and
2 per skill and difficulty band.

## Priority 1: content blocking an existing non-essay format

| Exam | Section | Domains / skills | Needed | Pending review | To author | Passages | Formats |
| --- | --- | --- | ---: | ---: | ---: | --- | --- |
| digital-sat | rw-module-1 | Information and Ideas, Craft and Structure, Expression of Ideas, Standard English Conventions · single_select | 27 | 27 | 0 | — | timed-rw-module-1, timed-rw-module-2, simulation-full |
| digital-sat | math-module-1 | Algebra, Advanced Math, Problem-Solving and Data Analysis, Geometry and Trigonometry · single_select, numeric_entry | 22 | 22 | 0 | — | timed-math-module-1, timed-math-module-2, simulation-full |
| digital-sat | rw-module-1 | any domain | 10 | 10 | 0 | — | practice |
| digital-sat | rw-module-1 | Information and Ideas, Craft and Structure · single_select | 4 | 4 | 0 | — | diagnostic |
| digital-sat | rw-module-1 | Expression of Ideas, Standard English Conventions · single_select | 4 | 4 | 0 | — | diagnostic |
| digital-sat | math-module-1 | Algebra, Advanced Math | 4 | 4 | 0 | — | diagnostic |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis, Geometry and Trigonometry | 4 | 4 | 0 | — | diagnostic |
| enhanced-act | english | Production of Writing (POW), Knowledge of Language (KLA), Conventions of Standard English (CSE) · single_select | 50 | 8 | 42 | 14 × ~3 q | diagnostic, timed-english |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity, Preparing for Higher Math: Algebra, Preparing for Higher Math: Functions, Preparing for Higher Math: Geometry, Preparing for Higher Math: Statistics and Probability, Integrating Essential Skills (IES), Modeling (overlay category) · single_select | 45 | 8 | 37 | — | diagnostic, timed-math |
| enhanced-act | science | Interpretation of Data (IOD), Scientific Investigation (SIN), Evaluating Scientific Arguments and Models with Evidence (EMI) · single_select | 40 | 23 | 17 | 4 × ~5 q | diagnostic, timed-science |
| enhanced-act | reading | Key Ideas and Details (KID), Craft and Structure, Integration of Knowledge and Ideas (IKI) · single_select | 36 | 7 | 29 | 8 × ~4 q | diagnostic, timed-reading |
| enhanced-act | english | any domain | 10 | 10 | 0 | — | practice |
| lsat | rc | Reading Comprehension, Comparative Reading · single_select | 27 | 20 | 7 | 2 × ~5 q | timed-rc |
| lsat | lr1 | Logical Reasoning · single_select | 24 | 24 | 0 | — | diagnostic, timed-lr1, timed-lr2 |
| lsat | lr1 | single_select | 10 | 10 | 0 | — | practice |
| lsat | rc | Reading Comprehension · single_select | 6 | 6 | 0 | — | diagnostic |
| lsat | rc | Comparative Reading · single_select | 3 | 3 | 0 | — | diagnostic |
| gmat | verbal-reasoning | Reading Comprehension, Critical Reasoning · single_select | 23 | 6 | 17 | 9 × ~2 q | diagnostic, timed-verbal-reasoning |
| gmat | quantitative-reasoning | Problem Solving · single_select | 21 | 18 | 3 | — | diagnostic, timed-quantitative-reasoning |
| gmat | data-insights | Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation, Two-Part Analysis | 20 | 11 | 9 | — | diagnostic, timed-data-insights |
| gmat | quantitative-reasoning | any domain | 10 | 10 | 0 | — | practice |
| gre | verbal-1 | Reading Comprehension, Text Completion, Sentence Equivalence | 15 | 15 | 0 | — | timed-verbal-1, timed-verbal-2 |
| gre | quant-1 | Arithmetic, Algebra, Geometry, Data Analysis | 15 | 15 | 0 | — | timed-quant-1, timed-quant-2 |
| gre | verbal-1 | any domain | 10 | 10 | 0 | — | practice |
| bocconi-undergraduate | online-test | Mathematics, Reading comprehension, Numerical reasoning, Critical thinking · single_select | 50 | 50 | 0 | — | timed-online-test |
| bocconi-undergraduate | online-test | Mathematics · single_select | 24 | 24 | 0 | — | simulation-full, diagnostic |
| bocconi-undergraduate | online-test | Reading comprehension · single_select | 11 | 11 | 0 | — | simulation-full, diagnostic |
| bocconi-undergraduate | online-test | any domain | 10 | 10 | 0 | — | practice |
| bocconi-undergraduate | online-test | Critical thinking · single_select | 9 | 9 | 0 | — | simulation-full, diagnostic |
| bocconi-undergraduate | online-test | Numerical reasoning · single_select | 6 | 6 | 0 | — | simulation-full, diagnostic |
| bocconi-law | online-test-law | Mathematics, Reading comprehension, Numerical reasoning, Logic and critical thinking, Verbal reasoning · single_select | 50 | 50 | 0 | — | timed-online-test-law |
| bocconi-law | online-test-law | Logic and critical thinking · single_select | 18 | 18 | 0 | — | diagnostic, simulation-full |
| bocconi-law | online-test-law | Reading comprehension · single_select | 11 | 11 | 0 | — | diagnostic, simulation-full |
| bocconi-law | online-test-law | Verbal reasoning · single_select | 10 | 10 | 0 | — | diagnostic, simulation-full |
| bocconi-law | online-test-law | any domain | 10 | 10 | 0 | — | practice |
| bocconi-law | online-test-law | Numerical reasoning · single_select | 6 | 6 | 0 | — | diagnostic, simulation-full |
| bocconi-law | online-test-law | Mathematics · single_select | 5 | 5 | 0 | — | diagnostic, simulation-full |
| bocconi-graduate | online-test | Verbal reasoning, Data insight, Quantitative reasoning · single_select | 50 | 33 | 17 | 5 × ~4 q | timed-online-test |
| bocconi-graduate | online-test | any domain | 10 | 10 | 0 | — | practice |
| bocconi-graduate | online-test | Verbal reasoning · single_select | 5 | 5 | 0 | — | diagnostic |
| bocconi-graduate | online-test | Data insight · single_select | 4 | 4 | 0 | — | diagnostic |
| bocconi-graduate | online-test | Quantitative reasoning · single_select | 3 | 3 | 0 | — | diagnostic |
| polito-til-i | mathematics | Mathematics · single_select | 16 | 16 | 0 | — | simulation-full, diagnostic, timed-mathematics |
| polito-til-i | reading-logic | Reading comprehension, Logic · single_select | 10 | 10 | 0 | — | simulation-full, diagnostic, timed-reading-logic |
| polito-til-i | physics | Physics · single_select | 10 | 10 | 0 | — | simulation-full, diagnostic, timed-physics |
| polito-til-i | mathematics | any domain | 10 | 10 | 0 | — | practice |
| polito-til-i | technical-knowledge | Representation, Computer science · single_select | 6 | 6 | 0 | — | simulation-full, diagnostic, timed-technical-knowledge |
| polito-til-a | reading-comprehension | Reading comprehension · single_select | 10 | 10 | 0 | — | simulation-full, diagnostic, timed-reading-comprehension |
| polito-til-a | general-knowledge | History and general knowledge · single_select | 10 | 10 | 0 | — | simulation-full, diagnostic, timed-general-knowledge |
| polito-til-a | logical-reasoning | Logical reasoning · single_select | 10 | 10 | 0 | — | simulation-full, diagnostic, timed-logical-reasoning |
| polito-til-a | drawing-representation | Drawing and representation · single_select | 10 | 10 | 0 | — | simulation-full, diagnostic, timed-drawing-representation |
| polito-til-a | mathematics-physics | Mathematics, Physics · single_select | 10 | 10 | 0 | — | simulation-full, diagnostic, timed-mathematics-physics |
| polito-til-a | reading-comprehension | any domain | 10 | 10 | 0 | — | practice |
| tolc-e | logic | Logic · single_select | 13 | 13 | 0 | — | simulation-full, diagnostic, timed-logic |
| tolc-e | mathematics | Mathematics · single_select | 13 | 13 | 0 | — | simulation-full, diagnostic, timed-mathematics |
| tolc-e | verbal-comprehension | Verbal comprehension · single_select | 10 | 10 | 0 | — | simulation-full, diagnostic, timed-verbal-comprehension |
| tolc-e | logic | any domain | 10 | 10 | 0 | — | practice |
| tolc-f | biology | Biology · single_select | 15 | 15 | 0 | — | simulation-full, diagnostic, timed-biology |
| tolc-f | chemistry | Chemistry · single_select | 15 | 15 | 0 | — | simulation-full, diagnostic, timed-chemistry |
| tolc-f | biology | any domain | 10 | 10 | 0 | — | practice |
| tolc-f | mathematics | Mathematics · single_select | 7 | 7 | 0 | — | simulation-full, diagnostic, timed-mathematics |
| tolc-f | physics | Physics · single_select | 7 | 7 | 0 | — | simulation-full, diagnostic, timed-physics |
| tolc-f | logic | Logic · single_select | 6 | 6 | 0 | — | simulation-full, diagnostic, timed-logic |
| tolc-i | mathematics | Mathematics · single_select | 20 | 20 | 0 | — | simulation-full, diagnostic, timed-mathematics |
| tolc-i | logic | Logic · single_select | 10 | 10 | 0 | — | simulation-full, diagnostic, timed-logic |
| tolc-i | sciences | Sciences · single_select | 10 | 10 | 0 | — | simulation-full, diagnostic, timed-sciences |
| tolc-i | verbal-comprehension | Verbal comprehension · single_select | 10 | 10 | 0 | — | simulation-full, diagnostic, timed-verbal-comprehension |
| tolc-i | mathematics | any domain | 10 | 10 | 0 | — | practice |

## Priority 2: 3 non-overlapping sets per format

| Exam | Section | Domains / skills | Needed | Pending review | To author | Passages | Formats |
| --- | --- | --- | ---: | ---: | ---: | --- | --- |
| digital-sat | rw-module-1 | Information and Ideas, Craft and Structure, Expression of Ideas, Standard English Conventions · single_select | 54 | 52 | 2 | — | timed-rw-module-1, timed-rw-module-2, simulation-full |
| digital-sat | math-module-1 | Algebra, Advanced Math, Problem-Solving and Data Analysis, Geometry and Trigonometry · single_select, numeric_entry | 44 | 44 | 0 | — | timed-math-module-1, timed-math-module-2, simulation-full |
| digital-sat | rw-module-1 | any domain | 20 | 20 | 0 | — | practice |
| digital-sat | rw-module-1 | Information and Ideas, Craft and Structure · single_select | 8 | 8 | 0 | — | diagnostic |
| digital-sat | rw-module-1 | Expression of Ideas, Standard English Conventions · single_select | 8 | 8 | 0 | — | diagnostic |
| digital-sat | math-module-1 | Algebra, Advanced Math | 8 | 8 | 0 | — | diagnostic |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis, Geometry and Trigonometry | 8 | 8 | 0 | — | diagnostic |
| enhanced-act | english | Production of Writing (POW), Knowledge of Language (KLA), Conventions of Standard English (CSE) · single_select | 100 | 0 | 100 | 34 × ~3 q | diagnostic, timed-english |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity, Preparing for Higher Math: Algebra, Preparing for Higher Math: Functions, Preparing for Higher Math: Geometry, Preparing for Higher Math: Statistics and Probability, Integrating Essential Skills (IES), Modeling (overlay category) · single_select | 90 | 0 | 90 | — | diagnostic, timed-math |
| enhanced-act | science | Interpretation of Data (IOD), Scientific Investigation (SIN), Evaluating Scientific Arguments and Models with Evidence (EMI) · single_select | 80 | 0 | 80 | 16 × ~5 q | diagnostic, timed-science |
| enhanced-act | reading | Key Ideas and Details (KID), Craft and Structure, Integration of Knowledge and Ideas (IKI) · single_select | 72 | 0 | 72 | 18 × ~4 q | diagnostic, timed-reading |
| enhanced-act | english | any domain | 20 | 20 | 0 | — | practice |
| lsat | rc | Reading Comprehension, Comparative Reading · single_select | 54 | 0 | 54 | 11 × ~5 q | timed-rc |
| lsat | lr1 | Logical Reasoning · single_select | 48 | 1 | 47 | — | diagnostic, timed-lr1, timed-lr2 |
| lsat | lr1 | single_select | 20 | 20 | 0 | — | practice |
| lsat | rc | Reading Comprehension · single_select | 12 | 6 | 6 | 2 × ~5 q | diagnostic |
| lsat | rc | Comparative Reading · single_select | 6 | 0 | 6 | 2 × ~4 q | diagnostic |
| gmat | verbal-reasoning | Reading Comprehension, Critical Reasoning · single_select | 46 | 0 | 46 | 23 × ~2 q | diagnostic, timed-verbal-reasoning |
| gmat | quantitative-reasoning | Problem Solving · single_select | 42 | 0 | 42 | — | diagnostic, timed-quantitative-reasoning |
| gmat | data-insights | Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation, Two-Part Analysis | 40 | 0 | 40 | — | diagnostic, timed-data-insights |
| gmat | quantitative-reasoning | any domain | 20 | 20 | 0 | — | practice |
| gre | verbal-1 | Reading Comprehension, Text Completion, Sentence Equivalence | 30 | 20 | 10 | — | timed-verbal-1, timed-verbal-2 |
| gre | quant-1 | Arithmetic, Algebra, Geometry, Data Analysis | 30 | 21 | 9 | — | timed-quant-1, timed-quant-2 |
| gre | verbal-1 | any domain | 20 | 20 | 0 | — | practice |
| bocconi-undergraduate | online-test | Mathematics, Reading comprehension, Numerical reasoning, Critical thinking · single_select | 100 | 72 | 28 | — | timed-online-test |
| bocconi-undergraduate | online-test | Mathematics · single_select | 48 | 42 | 6 | — | simulation-full, diagnostic |
| bocconi-undergraduate | online-test | Reading comprehension · single_select | 22 | 8 | 14 | 5 × ~3 q | simulation-full, diagnostic |
| bocconi-undergraduate | online-test | any domain | 20 | 20 | 0 | — | practice |
| bocconi-undergraduate | online-test | Critical thinking · single_select | 18 | 12 | 6 | — | simulation-full, diagnostic |
| bocconi-undergraduate | online-test | Numerical reasoning · single_select | 12 | 8 | 4 | 2 × ~2 q | simulation-full, diagnostic |
| bocconi-law | online-test-law | Mathematics, Reading comprehension, Numerical reasoning, Logic and critical thinking, Verbal reasoning · single_select | 100 | 33 | 67 | — | timed-online-test-law |
| bocconi-law | online-test-law | Logic and critical thinking · single_select | 36 | 5 | 31 | — | diagnostic, simulation-full |
| bocconi-law | online-test-law | Reading comprehension · single_select | 22 | 5 | 17 | 6 × ~3 q | diagnostic, simulation-full |
| bocconi-law | online-test-law | Verbal reasoning · single_select | 20 | 10 | 10 | — | diagnostic, simulation-full |
| bocconi-law | online-test-law | any domain | 20 | 20 | 0 | — | practice |
| bocconi-law | online-test-law | Numerical reasoning · single_select | 12 | 3 | 9 | 9 × ~1 q | diagnostic, simulation-full |
| bocconi-law | online-test-law | Mathematics · single_select | 10 | 9 | 1 | — | diagnostic, simulation-full |
| bocconi-graduate | online-test | Verbal reasoning, Data insight, Quantitative reasoning · single_select | 100 | 0 | 100 | 25 × ~4 q | timed-online-test |
| bocconi-graduate | online-test | any domain | 20 | 20 | 0 | — | practice |
| bocconi-graduate | online-test | Verbal reasoning · single_select | 10 | 5 | 5 | 2 × ~4 q | diagnostic |
| bocconi-graduate | online-test | Data insight · single_select | 8 | 4 | 4 | 2 × ~3 q | diagnostic |
| bocconi-graduate | online-test | Quantitative reasoning · single_select | 6 | 4 | 2 | — | diagnostic |
| polito-til-i | mathematics | Mathematics · single_select | 32 | 2 | 30 | — | simulation-full, diagnostic, timed-mathematics |
| polito-til-i | reading-logic | Reading comprehension, Logic · single_select | 20 | 0 | 20 | 7 × ~3 q | simulation-full, diagnostic, timed-reading-logic |
| polito-til-i | physics | Physics · single_select | 20 | 2 | 18 | — | simulation-full, diagnostic, timed-physics |
| polito-til-i | mathematics | any domain | 20 | 20 | 0 | — | practice |
| polito-til-i | technical-knowledge | Representation, Computer science · single_select | 12 | 2 | 10 | — | simulation-full, diagnostic, timed-technical-knowledge |
| polito-til-a | reading-comprehension | Reading comprehension · single_select | 20 | 0 | 20 | 5 × ~4 q | simulation-full, diagnostic, timed-reading-comprehension |
| polito-til-a | general-knowledge | History and general knowledge · single_select | 20 | 2 | 18 | — | simulation-full, diagnostic, timed-general-knowledge |
| polito-til-a | logical-reasoning | Logical reasoning · single_select | 20 | 2 | 18 | — | simulation-full, diagnostic, timed-logical-reasoning |
| polito-til-a | drawing-representation | Drawing and representation · single_select | 20 | 2 | 18 | 18 × ~1 q | simulation-full, diagnostic, timed-drawing-representation |
| polito-til-a | mathematics-physics | Mathematics, Physics · single_select | 20 | 2 | 18 | — | simulation-full, diagnostic, timed-mathematics-physics |
| polito-til-a | reading-comprehension | any domain | 20 | 20 | 0 | — | practice |
| tolc-e | logic | Logic · single_select | 26 | 17 | 9 | — | simulation-full, diagnostic, timed-logic |
| tolc-e | mathematics | Mathematics · single_select | 26 | 10 | 16 | — | simulation-full, diagnostic, timed-mathematics |
| tolc-e | verbal-comprehension | Verbal comprehension · single_select | 20 | 10 | 10 | 3 × ~4 q | simulation-full, diagnostic, timed-verbal-comprehension |
| tolc-e | logic | any domain | 20 | 20 | 0 | — | practice |
| tolc-f | biology | Biology · single_select | 30 | 14 | 16 | — | simulation-full, diagnostic, timed-biology |
| tolc-f | chemistry | Chemistry · single_select | 30 | 14 | 16 | — | simulation-full, diagnostic, timed-chemistry |
| tolc-f | biology | any domain | 20 | 20 | 0 | — | practice |
| tolc-f | mathematics | Mathematics · single_select | 14 | 9 | 5 | — | simulation-full, diagnostic, timed-mathematics |
| tolc-f | physics | Physics · single_select | 14 | 7 | 7 | — | simulation-full, diagnostic, timed-physics |
| tolc-f | logic | Logic · single_select | 12 | 6 | 6 | — | simulation-full, diagnostic, timed-logic |
| tolc-i | mathematics | Mathematics · single_select | 40 | 12 | 28 | — | simulation-full, diagnostic, timed-mathematics |
| tolc-i | logic | Logic · single_select | 20 | 6 | 14 | — | simulation-full, diagnostic, timed-logic |
| tolc-i | sciences | Sciences · single_select | 20 | 6 | 14 | — | simulation-full, diagnostic, timed-sciences |
| tolc-i | verbal-comprehension | Verbal comprehension · single_select | 20 | 4 | 16 | 4 × ~4 q | simulation-full, diagnostic, timed-verbal-comprehension |
| tolc-i | mathematics | any domain | 20 | 20 | 0 | — | practice |

## Priority 3: topic-practice depth

| Exam | Section | Domains / skills | Needed | Pending review | To author | Passages | Formats |
| --- | --- | --- | ---: | ---: | ---: | --- | --- |
| digital-sat | rw-module-1 | Information and Ideas · Central Ideas and Details · bands short: easy, medium, hard | 6 | 5 | 1 | 1 × ~1 q | practice |
| digital-sat | rw-module-1 | Information and Ideas · Command of Evidence: Textual · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| digital-sat | rw-module-1 | Information and Ideas · Command of Evidence: Quantitative · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| digital-sat | rw-module-1 | Information and Ideas · Inferences · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| digital-sat | rw-module-1 | Craft and Structure · Words in Context · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| digital-sat | rw-module-1 | Craft and Structure · Text Structure and Purpose · bands short: easy, medium, hard | 6 | 5 | 1 | 1 × ~1 q | practice |
| digital-sat | rw-module-1 | Craft and Structure · Cross-Text Connections · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| digital-sat | rw-module-1 | Expression of Ideas · Rhetorical Synthesis · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| digital-sat | rw-module-1 | Expression of Ideas · Transitions · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| digital-sat | rw-module-1 | Standard English Conventions · Boundaries · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| digital-sat | rw-module-1 | Standard English Conventions · Form, Structure, and Sense · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| digital-sat | math-module-1 | Algebra · Linear equations in one variable · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| digital-sat | math-module-1 | Algebra · Linear equations in two variables · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| digital-sat | math-module-1 | Algebra · Linear functions · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| digital-sat | math-module-1 | Algebra · Systems of two linear equations in two variables · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| digital-sat | math-module-1 | Algebra · Linear inequalities in one or two variables · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| digital-sat | math-module-1 | Advanced Math · Equivalent expressions · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| digital-sat | math-module-1 | Advanced Math · Nonlinear equations in one variable and systems of equations in two variables · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| digital-sat | math-module-1 | Advanced Math · Nonlinear functions · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Ratios, rates, proportional relationships, and units · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Percentages · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · One-variable data: distributions and measures of center and spread · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Two-variable data: models and scatterplots · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Probability and conditional probability · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Inference from sample statistics and margin of error · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Evaluating statistical claims: observational studies and experiments · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| digital-sat | math-module-1 | Geometry and Trigonometry · Area and volume · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| digital-sat | math-module-1 | Geometry and Trigonometry · Lines, angles, and triangles · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| digital-sat | math-module-1 | Geometry and Trigonometry · Right triangles and trigonometry · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| digital-sat | math-module-1 | Geometry and Trigonometry · Circles · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| enhanced-act | english | Production of Writing (POW) · Topic Development — Purpose and Focus · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| enhanced-act | english | Production of Writing (POW) · Organization, Unity, and Cohesion · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| enhanced-act | english | Knowledge of Language (KLA) · Expressing Ideas Clearly · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| enhanced-act | english | Knowledge of Language (KLA) · Style · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | english | Conventions of Standard English (CSE) · Sentence Structure and Formation · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| enhanced-act | english | Conventions of Standard English (CSE) · Usage Conventions · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| enhanced-act | english | Conventions of Standard English (CSE) · Punctuation Conventions · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity · Rational and Irrational Numbers · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity · Properties of Exponents · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity · Vectors and Matrices · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity · Complex Numbers · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity · Quantities and Units · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Linear Expressions, Equations, and Inequalities · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Quadratic Expressions, Equations, and Inequalities · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Rational and Radical Expressions and Equations · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Polynomial Expressions and Equations · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Systems of Equations and Inequalities · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Representation of Expressions and Equations · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Functions · Properties of Functions · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Functions · Function Composition, Transformation, and Inverse Functions · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Functions · Sequences and Series · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Functions · Trigonometric Functions · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Functions · Exponential and Logarithmic Functions · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Geometry · Congruence and Similarity Relationships · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Geometry · Surface Area and Volume · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Geometry · Triangles and Circles; Missing Values · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Geometry · Trigonometric Ratios · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Geometry · Equations of Conic Sections · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Statistics and Probability · Center and Spread of Distributions · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Statistics and Probability · Data Collection Methods · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Statistics and Probability · Relationships in Bivariate Data · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Statistics and Probability · Probability · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Rate and Proportion · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Area · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Using Expressions to Represent Quantities · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Using Equations to Capture Relationships · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Rational Exponents · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Basics of Functions · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Data Analysis · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Modeling (overlay category) · Producing Models · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Modeling (overlay category) · Interpreting Models · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| enhanced-act | math | Modeling (overlay category) · Understanding Models · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Modeling (overlay category) · Evaluating Models · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Modeling (overlay category) · Improving Models · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | reading | Key Ideas and Details (KID) · Close Reading · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| enhanced-act | reading | Key Ideas and Details (KID) · Central Ideas, Themes, and Summaries · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| enhanced-act | reading | Key Ideas and Details (KID) · Relationships · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| enhanced-act | reading | Craft and Structure · Word Meanings and Word Choice · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| enhanced-act | reading | Craft and Structure · Text Structure · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| enhanced-act | reading | Craft and Structure · Purpose and Point of View · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | reading | Integration of Knowledge and Ideas (IKI) · Arguments · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| enhanced-act | reading | Integration of Knowledge and Ideas (IKI) · Synthesis of Multiple Texts · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | reading | Integration of Knowledge and Ideas (IKI) · Visual and Quantitative Information · bands short: easy, medium, hard | 6 | 0 | 6 | 6 × ~1 q | practice |
| enhanced-act | science | Interpretation of Data (IOD) · Manipulate and Analyse Scientific Data · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| enhanced-act | science | Interpretation of Data (IOD) · Identify and Interpret Trends and Relationships · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| enhanced-act | science | Interpretation of Data (IOD) · Translate Between Data Representations · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | science | Interpretation of Data (IOD) · Interpolate and Extrapolate from Data · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| enhanced-act | science | Scientific Investigation (SIN) · Understand Experimental Tools, Procedures and Design · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| enhanced-act | science | Scientific Investigation (SIN) · Compare and Extend Experiments · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| enhanced-act | science | Scientific Investigation (SIN) · Predict the Results of Modifying an Experiment · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| enhanced-act | science | Evaluating Scientific Arguments and Models with Evidence (EMI) · Judge the Credibility of Scientific Information · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | science | Evaluating Scientific Arguments and Models with Evidence (EMI) · Draw Conclusions and Make Predictions from Evidence · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| enhanced-act | science | Evaluating Scientific Arguments and Models with Evidence (EMI) · Evaluate and Compare Competing Models, Hypotheses and Viewpoints · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| enhanced-act | science | Evaluating Scientific Arguments and Models with Evidence (EMI) · Integrate Scientific Background Knowledge with the Passage · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| lsat | lr1 | Logical Reasoning · Recognizing the parts of an argument and their relationships · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| lsat | lr1 | Logical Reasoning · Recognizing similarities and differences between patterns of reasoning · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| lsat | lr1 | Logical Reasoning · Drawing well-supported conclusions · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| lsat | lr1 | Logical Reasoning · Reasoning by analogy · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| lsat | lr1 | Logical Reasoning · Recognizing misunderstandings or points of disagreement · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| lsat | lr1 | Logical Reasoning · Determining how additional evidence affects an argument · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| lsat | lr1 | Logical Reasoning · Detecting assumptions made by particular arguments · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| lsat | lr1 | Logical Reasoning · Identifying and applying principles or rules · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| lsat | lr1 | Logical Reasoning · Identifying flaws in arguments · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| lsat | lr1 | Logical Reasoning · Identifying explanations · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| lsat | rc | Reading Comprehension · The main idea or primary purpose · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| lsat | rc | Reading Comprehension · Information that is explicitly stated · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| lsat | rc | Reading Comprehension · Information or ideas that can be inferred · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| lsat | rc | Reading Comprehension · The meaning or purpose of words or phrases as used in context · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| lsat | rc | Reading Comprehension · The organization or structure · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| lsat | rc | Reading Comprehension · The application of information in the selection to a new context · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| lsat | rc | Reading Comprehension · Principles that function in the selection · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| lsat | rc | Reading Comprehension · Analogies to claims or arguments in the selection · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| lsat | rc | Reading Comprehension · An author’s attitude as revealed in the tone of a passage or the language used · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| lsat | rc | Reading Comprehension · The impact of new information on claims or arguments in the selection · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| lsat | rc | Comparative Reading · Relationships between two related shorter passages · bands short: easy, medium, hard | 6 | 2 | 4 | 2 × ~2 q | practice |
| lsat | rc | Comparative Reading · Generalization / instance relationships between passages · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| lsat | rc | Comparative Reading · Principle / application relationships between passages · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| lsat | rc | Comparative Reading · Point / counterpoint relationships between passages · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| gmat | quantitative-reasoning | Problem Solving · Arithmetic · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| gmat | quantitative-reasoning | Problem Solving · Elementary algebra · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| gmat | quantitative-reasoning | Problem Solving · Applying arithmetic and algebraic knowledge to solve problems · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| gmat | quantitative-reasoning | Problem Solving · Logic and analytical reasoning applied to quantitative problems · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| gmat | quantitative-reasoning | Problem Solving · Approximation and estimation · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| gmat | verbal-reasoning | Reading Comprehension · Main idea · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| gmat | verbal-reasoning | Reading Comprehension · Supporting idea · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| gmat | verbal-reasoning | Reading Comprehension · Inference · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | verbal-reasoning | Reading Comprehension · Application · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | verbal-reasoning | Reading Comprehension · Logical structure · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | verbal-reasoning | Reading Comprehension · Style · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | verbal-reasoning | Critical Reasoning · Construct or make an argument · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | verbal-reasoning | Critical Reasoning · Evaluate an argument · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | verbal-reasoning | Critical Reasoning · Strengthen an argument · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gmat | verbal-reasoning | Critical Reasoning · Weaken an argument · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gmat | verbal-reasoning | Critical Reasoning · Identify a flaw in the reasoning · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gmat | verbal-reasoning | Critical Reasoning · Formulate or evaluate a plan of action · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Data Sufficiency · Analyze a quantitative problem · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gmat | data-insights | Data Sufficiency · Recognize which data is relevant · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gmat | data-insights | Data Sufficiency · Determine at what point there is enough data to solve the problem · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gmat | data-insights | Data Sufficiency · Avoid unwarranted assumptions from figures not drawn to scale · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Data Sufficiency · Distinguish a unique value from a range of values · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gmat | data-insights | Multi-Source Reasoning · Examine data from multiple sources · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| gmat | data-insights | Multi-Source Reasoning · Recognize discrepancies among different sources of data · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Multi-Source Reasoning · Draw inferences from combined sources · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| gmat | data-insights | Multi-Source Reasoning · Determine whether a data source is relevant · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Table Analysis · Sort a table of data · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Table Analysis · Analyze spreadsheet-like data · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| gmat | data-insights | Table Analysis · Determine what information is relevant · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Table Analysis · Judge whether a stated condition has been met · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| gmat | data-insights | Graphics Interpretation · Interpret scatter plots · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Graphics Interpretation · Interpret x/y graphs · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| gmat | data-insights | Graphics Interpretation · Interpret bar charts · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Graphics Interpretation · Interpret pie charts · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Graphics Interpretation · Interpret statistical curve distributions · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Graphics Interpretation · Discern relationships from a graphic · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Graphics Interpretation · Make inferences from graphical data · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Two-Part Analysis · Solve complex quantitative, verbal or combined problems · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Two-Part Analysis · Evaluate trade-offs · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Two-Part Analysis · Solve simultaneous equations · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gmat | data-insights | Two-Part Analysis · Discern relationships between two entities · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Two-Part Analysis · Handle dependent versus independent paired tasks · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gre | verbal-1 | Reading Comprehension · Understanding the meaning of individual words and sentences · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | verbal-1 | Reading Comprehension · Understanding the meaning of paragraphs and larger bodies of text · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Distinguishing between minor and major points · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | verbal-1 | Reading Comprehension · Summarizing a passage · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Drawing conclusions from the information provided · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Reasoning from incomplete data to infer missing information · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Understanding the structure of a text in terms of how the parts relate to one another · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Identifying the author's assumptions and perspective · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Analyzing a text and reaching conclusions about it · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Identifying strengths and weaknesses of a position · bands short: easy, medium, hard | 6 | 1 | 5 | 5 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Developing and considering alternative explanations · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | verbal-1 | Text Completion · Interpreting and evaluating a passage while reading · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| gre | verbal-1 | Text Completion · Reasoning from partial information to reconstruct a coherent whole · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| gre | verbal-1 | Text Completion · Selecting words or short phrases to fill one to three blanks · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| gre | verbal-1 | Text Completion · Using structural signal words (e.g. although, moreover) to infer meaning · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| gre | verbal-1 | Text Completion · Revising an interpretation as further text is read · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gre | verbal-1 | Sentence Equivalence · Reaching a conclusion about how a sentence should be completed from partial information · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| gre | verbal-1 | Sentence Equivalence · Focusing on the meaning of the completed whole · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| gre | verbal-1 | Sentence Equivalence · Identifying two choices that produce complete, coherent sentences alike in meaning · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| gre | verbal-1 | Sentence Equivalence · Recognizing relationships among words and concepts · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gre | quant-1 | Arithmetic · Properties and types of integers: divisibility, factorization, prime numbers, remainders, odd and even integers · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| gre | quant-1 | Arithmetic · Arithmetic operations, exponents and roots · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Arithmetic · Estimation · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Arithmetic · Percent · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| gre | quant-1 | Arithmetic · Ratio · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gre | quant-1 | Arithmetic · Rate · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Arithmetic · Absolute value · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Arithmetic · The number line · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Arithmetic · Decimal representation · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Arithmetic · Sequences of numbers · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gre | quant-1 | Algebra · Operations with exponents · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| gre | quant-1 | Algebra · Factoring and simplifying algebraic expressions · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Algebra · Relations, functions, equations and inequalities · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gre | quant-1 | Algebra · Solving linear and quadratic equations and inequalities · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gre | quant-1 | Algebra · Solving simultaneous equations and inequalities · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gre | quant-1 | Algebra · Setting up equations to solve word problems · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Algebra · Coordinate geometry: graphs of functions, equations and inequalities, intercepts and slopes of lines · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| gre | quant-1 | Geometry · Parallel and perpendicular lines · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Geometry · Circles · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| gre | quant-1 | Geometry · Triangles, including isosceles, equilateral and 30-60-90 triangles · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| gre | quant-1 | Geometry · Quadrilaterals · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Geometry · Other polygons · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Geometry · Congruent and similar figures · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Geometry · Three-dimensional figures · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gre | quant-1 | Geometry · Area · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Geometry · Perimeter · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Geometry · Volume · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gre | quant-1 | Geometry · The Pythagorean theorem · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| gre | quant-1 | Geometry · Angle measurement in degrees · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Data Analysis · Basic descriptive statistics: mean, median, mode, range, standard deviation, interquartile range, quartiles and percentiles · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| gre | quant-1 | Data Analysis · Interpretation of data in tables and graphs: line graphs, bar graphs, circle graphs, boxplots, scatterplots and frequency distributions · bands short: easy, medium, hard | 6 | 5 | 1 | 1 × ~3 q | practice |
| gre | quant-1 | Data Analysis · Elementary probability: probabilities of compound events and independent events · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Data Analysis · Conditional probability · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Data Analysis · Random variables and probability distributions, including normal distributions · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Data Analysis · Counting methods: combinations, permutations and Venn diagrams · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Algebraic expressions · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · First and second degree equations · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Expressing one quantity as a function of others · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · First and second degree inequalities · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Systems with two unknowns · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Absolute values · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Mathematical notation and formula manipulation · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Function concepts · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Graphs of elementary functions · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Plane geometry formulas · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Points and distances · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Equations and properties of lines · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Parabolas and circles · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Positions of lines relative to conics · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Trigonometric identities · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Trigonometric functions · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Trigonometry in right triangles · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Sets · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Logarithmic and exponential forms · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Logarithmic and exponential equations and inequalities · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Logarithm and exponential identities · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Permutations and combinations · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Applied combinatorics · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Counting problems · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Ordering properties in the reals · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Percentages · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Unit conversion · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Basic probability · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Union and intersection of events · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Conditional probability and Bayes · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Application problems · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Absolute and relative frequencies · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Central tendency and dispersion · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| bocconi-undergraduate | online-test | Reading comprehension · Reading comprehension and information processing · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| bocconi-undergraduate | online-test | Reading comprehension · Explicit information · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| bocconi-undergraduate | online-test | Reading comprehension · Implicit meaning · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| bocconi-undergraduate | online-test | Reading comprehension · Economic passages with data · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| bocconi-undergraduate | online-test | Numerical reasoning · Reasoning from data · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| bocconi-undergraduate | online-test | Numerical reasoning · Charts and tables · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| bocconi-undergraduate | online-test | Numerical reasoning · Critical vs superfluous information · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| bocconi-undergraduate | online-test | Numerical reasoning · Simple calculation by hand · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| bocconi-undergraduate | online-test | Critical thinking · Interpreting the meaning of a text · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| bocconi-undergraduate | online-test | Critical thinking · Drawing conclusions · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| bocconi-undergraduate | online-test | Critical thinking · Excluding unsupported implications · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| bocconi-undergraduate | online-test | Critical thinking · Evaluating truth or falsehood · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| bocconi-undergraduate | online-test | Critical thinking · True, false or not deducible · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| bocconi-law | online-test-law | Mathematics · Plane geometry · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-law | online-test-law | Mathematics · Analytic geometry: points and distances · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-law | online-test-law | Mathematics · Analytic geometry: lines · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-law | online-test-law | Mathematics · Sets · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-law | online-test-law | Mathematics · Ordering of the real numbers · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-law | online-test-law | Mathematics · Percentages · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-law | online-test-law | Mathematics · Units of measure · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| bocconi-law | online-test-law | Reading comprehension · Explicit information · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| bocconi-law | online-test-law | Reading comprehension · Implicit meaning · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| bocconi-law | online-test-law | Reading comprehension · Humanistic passages · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| bocconi-law | online-test-law | Numerical reasoning · Charts and tables · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| bocconi-law | online-test-law | Numerical reasoning · Relevant vs superfluous information · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| bocconi-law | online-test-law | Numerical reasoning · Reasoning over calculation · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| bocconi-law | online-test-law | Logic and critical thinking · Data propositions · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| bocconi-law | online-test-law | Logic and critical thinking · Deductive logic from initial conditions · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| bocconi-law | online-test-law | Verbal reasoning · True / false / not deducible · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| bocconi-law | online-test-law | Verbal reasoning · Assumption · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| bocconi-law | online-test-law | Verbal reasoning · Conclusion · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| bocconi-law | online-test-law | Verbal reasoning · Logical error · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| bocconi-law | online-test-law | Verbal reasoning · Weaken and strengthen · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| bocconi-graduate | online-test | Verbal reasoning · Reasoning from a passage · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| bocconi-graduate | online-test | Verbal reasoning · Analysing an argument · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| bocconi-graduate | online-test | Data insight · Reading tables and charts · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| bocconi-graduate | online-test | Data insight · Conclusions and derived figures · bands short: easy, medium, hard | 6 | 4 | 2 | 1 × ~2 q | practice |
| bocconi-graduate | online-test | Quantitative reasoning · Numbers, ratios and percentages · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| bocconi-graduate | online-test | Quantitative reasoning · Algebra and problem solving · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| polito-til-i | mathematics | Mathematics · Natural, integer and rational numbers · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-i | mathematics | Mathematics · Real numbers, powers and radicals · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | mathematics | Mathematics · Statistics and probability · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | mathematics | Mathematics · Plane and solid geometry · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | mathematics | Mathematics · Monomials and polynomials · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-i | mathematics | Mathematics · Analytic geometry, exponentials and logarithms · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | mathematics | Mathematics · Goniometry and trigonometry · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-i | mathematics | Mathematics · Elementary graphs and plane regions · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | mathematics | Mathematics · Algebraic equations and inequalities · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | mathematics | Mathematics · Exponential, logarithmic and trigonometric equations · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| polito-til-i | reading-logic | Reading comprehension · What the excerpt states · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| polito-til-i | reading-logic | Reading comprehension · What the excerpt implies · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| polito-til-i | reading-logic | Reading comprehension · Purpose and structure · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| polito-til-i | reading-logic | Logic · Orders and arrangements · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | reading-logic | Logic · Quantifiers · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-i | reading-logic | Logic · Logical deduction · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-i | reading-logic | Logic · Elementary logic problems · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-i | reading-logic | Logic · Negating statements · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-i | physics | Physics · Vectors and units of measurement · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | physics | Physics · Kinematics · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | physics | Physics · Forces and dynamics · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | physics | Physics · Work and energy · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | physics | Physics · Calorimetry and thermodynamics · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | physics | Physics · Electrostatics and circuits · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | technical-knowledge | Representation · Views and projections · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| polito-til-i | technical-knowledge | Representation · Graphic-technical conventions · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-i | technical-knowledge | Computer science · Variables and assignment · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-i | technical-knowledge | Computer science · Conditions and loops · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-i | technical-knowledge | Computer science · Arithmetic and logical operators · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-i | technical-knowledge | Computer science · Bits, bytes and hardware basics · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-a | reading-comprehension | Reading comprehension · What the text states · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| polito-til-a | reading-comprehension | Reading comprehension · What the text implies · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| polito-til-a | reading-comprehension | Reading comprehension · Purpose and structure · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| polito-til-a | general-knowledge | History and general knowledge · History and geography · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| polito-til-a | general-knowledge | History and general knowledge · Art and architecture history · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| polito-til-a | general-knowledge | History and general knowledge · Institutions · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| polito-til-a | general-knowledge | History and general knowledge · Law, economics and citizenship · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| polito-til-a | logical-reasoning | Logical reasoning · Verbal reasoning · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| polito-til-a | logical-reasoning | Logical reasoning · Symbolic and abstract reasoning · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| polito-til-a | logical-reasoning | Logical reasoning · Logic problems · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| polito-til-a | drawing-representation | Drawing and representation · Plans and elevations · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| polito-til-a | drawing-representation | Drawing and representation · Axonometric projection · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| polito-til-a | drawing-representation | Drawing and representation · Graphs and diagrams · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| polito-til-a | mathematics-physics | Mathematics · Numbers and arithmetic · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-a | mathematics-physics | Mathematics · Algebraic calculation · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-a | mathematics-physics | Mathematics · Euclidean geometry · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-a | mathematics-physics | Mathematics · Analytic geometry and trigonometry · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-a | mathematics-physics | Mathematics · Probability and statistics · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-a | mathematics-physics | Physics · Mechanics and statics · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| polito-til-a | mathematics-physics | Physics · Heat and temperature · bands short: easy, medium, hard | 6 | 1 | 5 | — | practice |
| polito-til-a | mathematics-physics | Physics · Electrostatics and circuits · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| tolc-e | logic | Logic · Deduction · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| tolc-e | logic | Logic · Sequences and patterns · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| tolc-e | logic | Logic · Logic problems · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| tolc-e | logic | Logic · Arguments · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| tolc-e | verbal-comprehension | Verbal comprehension · What the text states · bands short: easy, medium, hard | 6 | 2 | 4 | 4 × ~1 q | practice |
| tolc-e | verbal-comprehension | Verbal comprehension · What the text implies · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| tolc-e | verbal-comprehension | Verbal comprehension · Meaning in context · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| tolc-e | verbal-comprehension | Verbal comprehension · Purpose and structure · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| tolc-e | mathematics | Mathematics · Numbers and percentages · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-e | mathematics | Mathematics · Powers, roots, exponentials and logarithms · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-e | mathematics | Mathematics · Polynomials and rational expressions · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| tolc-e | mathematics | Mathematics · Equations, inequalities and systems · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| tolc-e | mathematics | Mathematics · Analytic geometry · bands short: easy, medium, hard | 6 | 2 | 4 | — | practice |
| tolc-e | mathematics | Mathematics · Plane and solid geometry · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-e | mathematics | Mathematics · Elementary functions · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| tolc-f | biology | Biology · Chemistry of living things · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| tolc-f | biology | Biology · Biodiversity · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-f | biology | Biology · Cell biology · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-f | biology | Biology · Cell cycle, reproduction and heredity · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| tolc-f | biology | Biology · Bioenergetics · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| tolc-f | biology | Biology · Ecology · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-f | biology | Biology · Human anatomy and physiology · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| tolc-f | chemistry | Chemistry · Atoms, the periodic table and bonding · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| tolc-f | chemistry | Chemistry · Inorganic compounds · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| tolc-f | chemistry | Chemistry · Reactions, stoichiometry and redox · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| tolc-f | chemistry | Chemistry · Solutions, acids and bases · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| tolc-f | chemistry | Chemistry · Organic chemistry · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| tolc-f | mathematics | Mathematics · Numbers, ratios and percentages · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-f | mathematics | Mathematics · Algebra, equations and inequalities · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| tolc-f | mathematics | Mathematics · Functions and trigonometry · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-f | mathematics | Mathematics · Plane, solid and analytic geometry · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-f | mathematics | Mathematics · Combinatorics, probability and statistics · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-f | physics | Physics · Measures and units · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-f | physics | Physics · Kinematics, forces and energy · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| tolc-f | physics | Physics · Fluids and thermodynamics · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-f | physics | Physics · Electricity, magnetism, waves and optics · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-f | logic | Logic · Propositions and conditions · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| tolc-f | logic | Logic · Graphs and tables · bands short: easy, medium, hard | 6 | 5 | 1 | 1 × ~1 q | practice |
| tolc-f | logic | Logic · Reasoning with elementary mathematics · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-i | mathematics | Mathematics · Arithmetic and algebra · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| tolc-i | mathematics | Mathematics · Equations, inequalities and systems · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| tolc-i | mathematics | Mathematics · Plane and solid geometry · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| tolc-i | mathematics | Mathematics · Analytic geometry and functions · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| tolc-i | mathematics | Mathematics · Trigonometry · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| tolc-i | mathematics | Mathematics · Probability and statistics · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| tolc-i | logic | Logic · Deduction and conditions · bands short: easy, medium, hard | 6 | 6 | 0 | — | practice |
| tolc-i | logic | Logic · Sequences and patterns · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| tolc-i | logic | Logic · Logic problems · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| tolc-i | sciences | Sciences · Mechanics · bands short: easy, medium, hard | 6 | 5 | 1 | — | practice |
| tolc-i | sciences | Sciences · Thermodynamics · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-i | sciences | Sciences · Electromagnetism and optics · bands short: easy, medium, hard | 6 | 3 | 3 | — | practice |
| tolc-i | sciences | Sciences · Chemistry · bands short: easy, medium, hard | 6 | 4 | 2 | — | practice |
| tolc-i | verbal-comprehension | Verbal comprehension · What the text states · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |
| tolc-i | verbal-comprehension | Verbal comprehension · What the text implies · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| tolc-i | verbal-comprehension | Verbal comprehension · Meaning in context · bands short: easy, medium, hard | 6 | 4 | 2 | 2 × ~1 q | practice |
| tolc-i | verbal-comprehension | Verbal comprehension · Purpose and structure · bands short: easy, medium, hard | 6 | 3 | 3 | 3 × ~1 q | practice |

## Drafting against a gap

For a row with something to author, draft against that constraint with the existing tool, which writes
`in_review` items only (docs/AUTHORING-BRIEF.md). Check the request first with `--dry-run`; a live run calls
a paid model and needs the owner’s go-ahead:

    npm run content:draft -- --exam=<exam> --domain=<domain slug> --skill=<skill slug> --count=<n> --dry-run

A drafted item is a structurally valid draft, nothing more. It becomes available to learners only after
option-order normalisation, the AI blind review (`scripts/apply-review.ts`), a re-seed, and a human reviewer’s
approval of its exact content.
