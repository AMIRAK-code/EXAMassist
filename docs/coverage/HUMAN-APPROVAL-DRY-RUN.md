# Mandatory human approval: dry-run impact

Generated 2026-10-29 by `npm run content:coverage -- --write` from the content files in this checkout; no approvals: the review ledger is empty, as it is in any database right after migration 014.
It reads no database other than the one named, and changes nothing.

"Before" is the rule until now: a question is served once its content file says `published` (automated
checks and an AI blind solve passed). "After" is the strict rule: published AND a standing approval of its
exact current content by an authorised human reviewer. A format is open when the engine can fill it without
repeating a question (`checkBlueprintSufficiency`, public samples excluded from measured formats) and its
exam's rules allow it.

**Summary:** 963 published question(s), 0 human-approved. 66 format(s) open before, 0 after.

Attempts already made are not affected: they keep the question versions they pinned, their results and
their review pages. What closes is the start of NEW sessions, the free test included, and public sample
questions on the home and exam pages.

Production may hold different content from this checkout until it is re-seeded; run this again against the
content you deploy.

### SAT (Digital SAT) (`digital-sat`)

151 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| Digital SAT diagnostic (16 questions) (`diagnostic`) | diagnostic, measured | open | closed (short 16) | **becomes unavailable** |
| Custom practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Timed Reading and Writing module 1 (27 questions / 32 minutes) (`timed-rw-module-1`) | practice, measured | open | closed (short 27) | **becomes unavailable** |
| Timed Reading and Writing module 2 (27 questions / 32 minutes) (`timed-rw-module-2`) | practice, measured | open | closed (short 27) | **becomes unavailable** |
| Timed Math module 1 (22 questions / 35 minutes) (`timed-math-module-1`) | practice, measured | open | closed (short 22) | **becomes unavailable** |
| Timed Math module 2 (22 questions / 35 minutes) (`timed-math-module-2`) | practice, measured | open | closed (short 22) | **becomes unavailable** |
| Full Digital SAT simulation (98 questions / 134 minutes) (`simulation-full`) | simulation, measured | open | closed (short 98) | **becomes unavailable** |

Public sample `digital-sat-rw-words-in-context-cochineal-039` (home page and exam hub): **hidden until approved**.

### The ACT (Enhanced ACT) (`enhanced-act`)

47 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| Enhanced ACT diagnostic (`diagnostic`) | diagnostic, measured | open | closed (short 17) | **becomes unavailable** |
| Custom practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Timed English section (50 questions, 35 minutes) (`timed-english`) | practice, measured | closed (short 42) | closed (short 50) |  |
| Timed Mathematics section (45 questions, 50 minutes) (`timed-math`) | practice, measured | closed (short 37) | closed (short 45) |  |
| Timed Reading section (36 questions, 40 minutes) (`timed-reading`) | practice, measured | closed (short 29) | closed (short 36) |  |
| Timed Science section (40 questions, 40 minutes) (`timed-science`) | practice, measured | closed (short 17) | closed (short 40) |  |
| Timed Writing essay (1 prompt, 40 minutes) (`timed-writing`) | practice, measured | closed (short 1) | closed (short 1) | includes an essay part (outside this work) |

Public sample `enhanced-act-math-quadratic-minimum-008` (home page and exam hub): **hidden until approved**.

### Law School Admission Test (LSAT) (`lsat`)

46 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| LSAT diagnostic skill check (`diagnostic`) | diagnostic, measured | open | closed (short 15) | **becomes unavailable** |
| Custom practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Timed section: Logical Reasoning 1 (`timed-lr1`) | practice, measured | open | closed (short 24) | **becomes unavailable** |
| Timed section: Logical Reasoning 2 (`timed-lr2`) | practice, measured | open | closed (short 24) | **becomes unavailable** |
| Timed section: Reading Comprehension (`timed-rc`) | practice, measured | closed (short 7) | closed (short 27) |  |
| Timed: LSAT Argumentative Writing (`timed-writing`) | practice, measured | closed (short 1) | closed (short 1) | includes an essay part (outside this work) |

Public sample `lsat-lr-compost-supported-127` (home page and exam hub): **hidden until approved**.

### GMAT Exam (`gmat`)

37 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| GMAT diagnostic (`diagnostic`) | diagnostic, measured | open | closed (short 15) | **becomes unavailable** |
| Practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Timed Quantitative Reasoning section (`timed-quantitative-reasoning`) | practice, measured | closed (short 2) | closed (short 21) |  |
| Timed Verbal Reasoning section (`timed-verbal-reasoning`) | practice, measured | closed (short 17) | closed (short 23) |  |
| Timed Data Insights section (`timed-data-insights`) | practice, measured | closed (short 9) | closed (short 20) |  |

Public sample `gmat-ps-units-digit-cycles-204` (home page and exam hub): **hidden until approved**.

### GRE General Test (`gre`)

73 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| GRE diagnostic (`diagnostic`) | diagnostic, measured | closed (short 1) | closed (short 17) | includes an essay part (outside this work) |
| Practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Timed: Analytical Writing (30 min) (`timed-analytical-writing`) | practice, measured | closed (short 1) | closed (short 1) | includes an essay part (outside this work) |
| Timed: Verbal Reasoning Section 1 (12 q / 18 min) (`timed-verbal-1`) | practice, measured | open | closed (short 12) | **becomes unavailable** |
| Timed: Verbal Reasoning Section 2 (15 q / 23 min) (`timed-verbal-2`) | practice, measured | open | closed (short 15) | **becomes unavailable** |
| Timed: Quantitative Reasoning Section 1 (12 q / 21 min) (`timed-quant-1`) | practice, measured | open | closed (short 12) | **becomes unavailable** |
| Timed: Quantitative Reasoning Section 2 (15 q / 26 min) (`timed-quant-2`) | practice, measured | open | closed (short 15) | **becomes unavailable** |

Public sample `gre-verbal-tc-fossil-record-014` (home page and exam hub): **hidden until approved**.

### Online Bocconi Test (standard variant) (`bocconi-undergraduate`)

124 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| Full simulation - Online Bocconi Test (`simulation-full`) | simulation, measured | open | closed (short 50) | **becomes unavailable** |
| Bocconi diagnostic skill check (`diagnostic`) | diagnostic, measured | open | closed (short 16) | **becomes unavailable** |
| Bocconi practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Full-length timed Bocconi block (50 items, 75 minutes) (`timed-online-test`) | practice, measured | open | closed (short 50) | **becomes unavailable** |

Public sample `bocconi-ug-alg-quadratic-inequality-002` (home page and exam hub): **hidden until approved**.

### Bocconi Online Test - Law (`bocconi-law`)

83 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| Bocconi Law diagnostic (15 questions) (`diagnostic`) | diagnostic, measured | open | closed (short 15) | **becomes unavailable** |
| Practice set (10 questions) (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Timed full-length set — 50 questions in 75 minutes (`timed-online-test-law`) | practice, measured | open | closed (short 50) | **becomes unavailable** |
| Full simulation — Bocconi Online Test - Law (`simulation-full`) | simulation, measured | open | closed (short 50) | **becomes unavailable** |

### Online Bocconi Test (international graduate applicants) (`bocconi-graduate`)

33 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| Bocconi graduate diagnostic skill check (`diagnostic`) | diagnostic, measured | open | closed (short 12) | **becomes unavailable** |
| Bocconi graduate practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Full-length timed Bocconi graduate block (50 items, 75 minutes) (`timed-online-test`) | practice, measured | closed (short 17) | closed (short 50) |  |

### Politecnico di Torino TIL-I (Engineering) (`polito-til-i`)

50 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| Full simulation - TIL-I (`simulation-full`) | simulation, measured | open | closed (short 42) | **becomes unavailable** |
| TIL-I diagnostic skill check (`diagnostic`) | diagnostic, measured | open | closed (short 12) | **becomes unavailable** |
| TIL-I practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Mathematics: timed section (16 questions, 36 minutes) (`timed-mathematics`) | practice, measured | open | closed (short 16) | **becomes unavailable** |
| Reading comprehension and logic: timed section (10 questions, 20 minutes) (`timed-reading-logic`) | practice, measured | open | closed (short 10) | **becomes unavailable** |
| Physics: timed section (10 questions, 22 minutes) (`timed-physics`) | practice, measured | open | closed (short 10) | **becomes unavailable** |
| Basic technical knowledge: timed section (6 questions, 12 minutes) (`timed-technical-knowledge`) | practice, measured | open | closed (short 6) | **becomes unavailable** |

### Politecnico di Torino TIL-A (Architecture) (`polito-til-a`)

60 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| Full simulation - TIL-A (`simulation-full`) | simulation, measured | open | closed (short 50) | **becomes unavailable** |
| TIL-A diagnostic skill check (`diagnostic`) | diagnostic, measured | open | closed (short 15) | **becomes unavailable** |
| TIL-A practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Reading comprehension: timed section (10 questions, 20 minutes) (`timed-reading-comprehension`) | practice, measured | open | closed (short 10) | **becomes unavailable** |
| History and general knowledge: timed section (10 questions, 20 minutes) (`timed-general-knowledge`) | practice, measured | open | closed (short 10) | **becomes unavailable** |
| Logical reasoning: timed section (10 questions, 20 minutes) (`timed-logical-reasoning`) | practice, measured | open | closed (short 10) | **becomes unavailable** |
| Drawing and representation: timed section (10 questions, 20 minutes) (`timed-drawing-representation`) | practice, measured | open | closed (short 10) | **becomes unavailable** |
| Mathematics and physics: timed section (10 questions, 20 minutes) (`timed-mathematics-physics`) | practice, measured | open | closed (short 10) | **becomes unavailable** |

### CISIA TOLC-E (Economics) (`tolc-e`)

79 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| Full simulation - TOLC-E (`simulation-full`) | simulation, measured | open | closed (short 36) | **becomes unavailable** |
| TOLC-E diagnostic skill check (`diagnostic`) | diagnostic, measured | open | closed (short 12) | **becomes unavailable** |
| TOLC-E practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Logic: timed section (13 questions, 30 minutes) (`timed-logic`) | practice, measured | open | closed (short 13) | **becomes unavailable** |
| Verbal comprehension: timed section (10 questions, 30 minutes) (`timed-verbal-comprehension`) | practice, measured | open | closed (short 10) | **becomes unavailable** |
| Mathematics: timed section (13 questions, 30 minutes) (`timed-mathematics`) | practice, measured | open | closed (short 13) | **becomes unavailable** |

### CISIA TOLC-F (Pharmacy) (`tolc-f`)

100 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| Full simulation - TOLC-F (`simulation-full`) | simulation, measured | open | closed (short 50) | **becomes unavailable** |
| TOLC-F diagnostic skill check (`diagnostic`) | diagnostic, measured | open | closed (short 15) | **becomes unavailable** |
| TOLC-F practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Biology: timed section (15 questions, 20 minutes) (`timed-biology`) | practice, measured | open | closed (short 15) | **becomes unavailable** |
| Chemistry: timed section (15 questions, 20 minutes) (`timed-chemistry`) | practice, measured | open | closed (short 15) | **becomes unavailable** |
| Mathematics: timed section (7 questions, 12 minutes) (`timed-mathematics`) | practice, measured | open | closed (short 7) | **becomes unavailable** |
| Physics: timed section (7 questions, 12 minutes) (`timed-physics`) | practice, measured | open | closed (short 7) | **becomes unavailable** |
| Logic: timed section (6 questions, 8 minutes) (`timed-logic`) | practice, measured | open | closed (short 6) | **becomes unavailable** |

### CISIA TOLC-I (Engineering) (`tolc-i`)

80 published question(s); 0 with a current human approval.

| Format | Mode | Before (published pool) | After (strict policy) | Note |
| --- | --- | --- | --- | --- |
| Full simulation - TOLC-I (`simulation-full`) | simulation, measured | open | closed (short 50) | **becomes unavailable** |
| TOLC-I diagnostic skill check (`diagnostic`) | diagnostic, measured | open | closed (short 12) | **becomes unavailable** |
| TOLC-I practice set (`practice`) | practice | open | closed (short 10) | **becomes unavailable** |
| Mathematics: timed section (20 questions, 50 minutes) (`timed-mathematics`) | practice, measured | open | closed (short 20) | **becomes unavailable** |
| Logic: timed section (10 questions, 20 minutes) (`timed-logic`) | practice, measured | open | closed (short 10) | **becomes unavailable** |
| Sciences: timed section (10 questions, 20 minutes) (`timed-sciences`) | practice, measured | open | closed (short 10) | **becomes unavailable** |
| Verbal comprehension: timed section (10 questions, 20 minutes) (`timed-verbal-comprehension`) | practice, measured | open | closed (short 10) | **becomes unavailable** |
