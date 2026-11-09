# Question bank expansion backlog

Generated 2026-11-09 by `npm run content:coverage -- --write`; no approvals: the review ledger is empty, as it is in any database right after migration 014.

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
| — | — | Nothing needed at this priority. | 0 | 0 | 0 | — | — |

## Priority 2: 3 non-overlapping sets per format

| Exam | Section | Domains / skills | Needed | Pending review | To author | Passages | Formats |
| --- | --- | --- | ---: | ---: | ---: | --- | --- |
| enhanced-act | english | Production of Writing (POW), Knowledge of Language (KLA), Conventions of Standard English (CSE) · single_select | 83 | 0 | 83 | — | timed-english |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity, Preparing for Higher Math: Algebra, Preparing for Higher Math: Functions, Preparing for Higher Math: Geometry, Preparing for Higher Math: Statistics and Probability, Integrating Essential Skills (IES), Modeling (overlay category) · single_select | 73 | 0 | 73 | — | timed-math |
| enhanced-act | science | Interpretation of Data (IOD), Scientific Investigation (SIN), Evaluating Scientific Arguments and Models with Evidence (EMI) · single_select | 61 | 0 | 61 | 13 × ~5 q | timed-science |
| enhanced-act | reading | Key Ideas and Details (KID), Craft and Structure, Integration of Knowledge and Ideas (IKI) · single_select | 60 | 0 | 60 | 12 × ~5 q | timed-reading |

## Priority 3: topic-practice depth

| Exam | Section | Domains / skills | Needed | Pending review | To author | Passages | Formats |
| --- | --- | --- | ---: | ---: | ---: | --- | --- |
| digital-sat | rw-module-1 | Information and Ideas · Inferences · bands short: easy | 2 | 0 | 2 | — | practice |
| digital-sat | rw-module-1 | Craft and Structure · Cross-Text Connections · bands short: easy | 2 | 0 | 2 | — | practice |
| digital-sat | math-module-1 | Algebra · Linear equations in one variable · bands short: hard | 2 | 0 | 2 | — | practice |
| digital-sat | math-module-1 | Algebra · Systems of two linear equations in two variables · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Percentages · bands short: easy | 2 | 0 | 2 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Two-variable data: models and scatterplots · bands short: hard | 2 | 0 | 2 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Probability and conditional probability · bands short: easy | 2 | 0 | 2 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Inference from sample statistics and margin of error · bands short: hard | 2 | 0 | 2 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Evaluating statistical claims: observational studies and experiments · bands short: easy, medium | 2 | 0 | 2 | — | practice |
| digital-sat | math-module-1 | Geometry and Trigonometry · Right triangles and trigonometry · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| digital-sat | math-module-1 | Algebra · Linear equations in two variables · bands short: hard | 1 | 0 | 1 | — | practice |
| digital-sat | math-module-1 | Algebra · Linear functions · bands short: hard | 1 | 0 | 1 | — | practice |
| digital-sat | math-module-1 | Problem-Solving and Data Analysis · Ratios, rates, proportional relationships, and units · bands short: hard | 1 | 0 | 1 | — | practice |
| digital-sat | math-module-1 | Geometry and Trigonometry · Area and volume · bands short: easy | 1 | 0 | 1 | — | practice |
| digital-sat | math-module-1 | Geometry and Trigonometry · Lines, angles, and triangles · bands short: hard | 1 | 0 | 1 | — | practice |
| digital-sat | math-module-1 | Geometry and Trigonometry · Circles · bands short: easy | 1 | 0 | 1 | — | practice |
| enhanced-act | math | Modeling (overlay category) · Producing Models · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Modeling (overlay category) · Understanding Models · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Modeling (overlay category) · Evaluating Models · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Modeling (overlay category) · Improving Models · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity · Rational and Irrational Numbers · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity · Complex Numbers · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity · Quantities and Units · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Polynomial Expressions and Equations · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Representation of Expressions and Equations · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Using Expressions to Represent Quantities · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Rational Exponents · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Basics of Functions · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| enhanced-act | math | Modeling (overlay category) · Interpreting Models · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| enhanced-act | reading | Integration of Knowledge and Ideas (IKI) · Visual and Quantitative Information · bands short: easy, medium, hard | 5 | 0 | 5 | 5 × ~1 q | practice |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity · Properties of Exponents · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Number and Quantity · Vectors and Matrices · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Linear Expressions, Equations, and Inequalities · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Rational and Radical Expressions and Equations · bands short: easy, medium | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Functions · Properties of Functions · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Functions · Function Composition, Transformation, and Inverse Functions · bands short: easy, medium | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Functions · Trigonometric Functions · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Functions · Exponential and Logarithmic Functions · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Geometry · Congruence and Similarity Relationships · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Geometry · Surface Area and Volume · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Geometry · Trigonometric Ratios · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Geometry · Equations of Conic Sections · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Statistics and Probability · Center and Spread of Distributions · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Statistics and Probability · Data Collection Methods · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Statistics and Probability · Relationships in Bivariate Data · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Area · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Using Equations to Capture Relationships · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Data Analysis · bands short: easy, medium | 4 | 0 | 4 | — | practice |
| enhanced-act | reading | Key Ideas and Details (KID) · Central Ideas, Themes, and Summaries · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| enhanced-act | reading | Craft and Structure · Purpose and Point of View · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| enhanced-act | science | Interpretation of Data (IOD) · Translate Between Data Representations · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| enhanced-act | science | Interpretation of Data (IOD) · Interpolate and Extrapolate from Data · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| enhanced-act | science | Evaluating Scientific Arguments and Models with Evidence (EMI) · Judge the Credibility of Scientific Information · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| enhanced-act | science | Evaluating Scientific Arguments and Models with Evidence (EMI) · Integrate Scientific Background Knowledge with the Passage · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Quadratic Expressions, Equations, and Inequalities · bands short: easy, medium | 3 | 0 | 3 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Algebra · Systems of Equations and Inequalities · bands short: easy, medium, hard | 3 | 0 | 3 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Functions · Sequences and Series · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Geometry · Triangles and Circles; Missing Values · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| enhanced-act | math | Preparing for Higher Math: Statistics and Probability · Probability · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| enhanced-act | math | Integrating Essential Skills (IES) · Rate and Proportion · bands short: easy, medium | 3 | 0 | 3 | — | practice |
| enhanced-act | reading | Key Ideas and Details (KID) · Relationships · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| enhanced-act | reading | Craft and Structure · Word Meanings and Word Choice · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| enhanced-act | reading | Craft and Structure · Text Structure · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| enhanced-act | science | Scientific Investigation (SIN) · Compare and Extend Experiments · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| enhanced-act | science | Evaluating Scientific Arguments and Models with Evidence (EMI) · Evaluate and Compare Competing Models, Hypotheses and Viewpoints · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| enhanced-act | english | Production of Writing (POW) · Topic Development — Purpose and Focus · bands short: hard | 2 | 0 | 2 | — | practice |
| enhanced-act | english | Production of Writing (POW) · Organization, Unity, and Cohesion · bands short: hard | 2 | 0 | 2 | — | practice |
| enhanced-act | english | Knowledge of Language (KLA) · Expressing Ideas Clearly · bands short: hard | 2 | 0 | 2 | — | practice |
| enhanced-act | english | Knowledge of Language (KLA) · Style · bands short: hard | 2 | 0 | 2 | — | practice |
| enhanced-act | english | Conventions of Standard English (CSE) · Usage Conventions · bands short: hard | 2 | 0 | 2 | — | practice |
| enhanced-act | english | Conventions of Standard English (CSE) · Punctuation Conventions · bands short: hard | 2 | 0 | 2 | — | practice |
| enhanced-act | reading | Key Ideas and Details (KID) · Close Reading · bands short: hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| enhanced-act | reading | Integration of Knowledge and Ideas (IKI) · Arguments · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| enhanced-act | reading | Integration of Knowledge and Ideas (IKI) · Synthesis of Multiple Texts · bands short: easy | 2 | 0 | 2 | 1 × ~3 q | practice |
| enhanced-act | science | Interpretation of Data (IOD) · Manipulate and Analyse Scientific Data · bands short: hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| enhanced-act | science | Interpretation of Data (IOD) · Identify and Interpret Trends and Relationships · bands short: hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| enhanced-act | science | Scientific Investigation (SIN) · Understand Experimental Tools, Procedures and Design · bands short: easy, hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| enhanced-act | science | Scientific Investigation (SIN) · Predict the Results of Modifying an Experiment · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| enhanced-act | science | Evaluating Scientific Arguments and Models with Evidence (EMI) · Draw Conclusions and Make Predictions from Evidence · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| enhanced-act | english | Conventions of Standard English (CSE) · Sentence Structure and Formation · bands short: hard | 1 | 0 | 1 | — | practice |
| lsat | rc | Reading Comprehension · Information that is explicitly stated · bands short: medium, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| lsat | rc | Reading Comprehension · The meaning or purpose of words or phrases as used in context · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| lsat | rc | Reading Comprehension · Principles that function in the selection · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| lsat | rc | Reading Comprehension · Analogies to claims or arguments in the selection · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| lsat | rc | Reading Comprehension · An author’s attitude as revealed in the tone of a passage or the language used · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| lsat | rc | Comparative Reading · Principle / application relationships between passages · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| lsat | rc | Reading Comprehension · The main idea or primary purpose · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| lsat | rc | Reading Comprehension · The organization or structure · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| lsat | rc | Reading Comprehension · The impact of new information on claims or arguments in the selection · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| lsat | rc | Comparative Reading · Point / counterpoint relationships between passages · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| lsat | lr1 | Logical Reasoning · Recognizing the parts of an argument and their relationships · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| lsat | lr1 | Logical Reasoning · Drawing well-supported conclusions · bands short: hard | 2 | 0 | 2 | — | practice |
| lsat | lr1 | Logical Reasoning · Reasoning by analogy · bands short: easy | 2 | 0 | 2 | — | practice |
| lsat | lr1 | Logical Reasoning · Recognizing misunderstandings or points of disagreement · bands short: easy | 2 | 0 | 2 | — | practice |
| lsat | lr1 | Logical Reasoning · Determining how additional evidence affects an argument · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| lsat | lr1 | Logical Reasoning · Identifying and applying principles or rules · bands short: hard | 2 | 0 | 2 | — | practice |
| lsat | lr1 | Logical Reasoning · Identifying explanations · bands short: hard | 2 | 0 | 2 | — | practice |
| lsat | rc | Reading Comprehension · Information or ideas that can be inferred · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| lsat | rc | Reading Comprehension · The application of information in the selection to a new context · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| lsat | rc | Comparative Reading · Relationships between two related shorter passages · bands short: easy | 2 | 0 | 2 | 1 × ~2 q | practice |
| lsat | rc | Comparative Reading · Generalization / instance relationships between passages · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| lsat | lr1 | Logical Reasoning · Recognizing similarities and differences between patterns of reasoning · bands short: easy | 1 | 0 | 1 | — | practice |
| lsat | lr1 | Logical Reasoning · Detecting assumptions made by particular arguments · bands short: hard | 1 | 0 | 1 | — | practice |
| lsat | lr1 | Logical Reasoning · Identifying flaws in arguments · bands short: hard | 1 | 0 | 1 | — | practice |
| gmat | verbal-reasoning | Critical Reasoning · Formulate or evaluate a plan of action · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Data Sufficiency · Avoid unwarranted assumptions from figures not drawn to scale · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Graphics Interpretation · Interpret pie charts · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gmat | data-insights | Data Sufficiency · Analyze a quantitative problem · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| gmat | data-insights | Data Sufficiency · Recognize which data is relevant · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| gmat | data-insights | Graphics Interpretation · Interpret scatter plots · bands short: easy, medium, hard | 5 | 0 | 5 | 5 × ~1 q | practice |
| gmat | data-insights | Graphics Interpretation · Make inferences from graphical data · bands short: easy, medium, hard | 5 | 0 | 5 | 5 × ~1 q | practice |
| gmat | quantitative-reasoning | Problem Solving · Approximation and estimation · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| gmat | verbal-reasoning | Reading Comprehension · Main idea · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | verbal-reasoning | Reading Comprehension · Inference · bands short: easy, medium | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | verbal-reasoning | Reading Comprehension · Application · bands short: easy, medium | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | verbal-reasoning | Reading Comprehension · Logical structure · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | verbal-reasoning | Reading Comprehension · Style · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | verbal-reasoning | Critical Reasoning · Construct or make an argument · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| gmat | verbal-reasoning | Critical Reasoning · Evaluate an argument · bands short: easy, medium | 4 | 0 | 4 | — | practice |
| gmat | verbal-reasoning | Critical Reasoning · Identify a flaw in the reasoning · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| gmat | data-insights | Data Sufficiency · Distinguish a unique value from a range of values · bands short: easy, medium | 4 | 0 | 4 | — | practice |
| gmat | data-insights | Multi-Source Reasoning · Recognize discrepancies among different sources of data · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | data-insights | Multi-Source Reasoning · Draw inferences from combined sources · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | data-insights | Multi-Source Reasoning · Determine whether a data source is relevant · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | data-insights | Table Analysis · Sort a table of data · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | data-insights | Table Analysis · Analyze spreadsheet-like data · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | data-insights | Table Analysis · Determine what information is relevant · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | data-insights | Graphics Interpretation · Interpret x/y graphs · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | data-insights | Graphics Interpretation · Interpret bar charts · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | data-insights | Graphics Interpretation · Interpret statistical curve distributions · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | data-insights | Graphics Interpretation · Discern relationships from a graphic · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gmat | data-insights | Two-Part Analysis · Solve complex quantitative, verbal or combined problems · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| gmat | data-insights | Two-Part Analysis · Evaluate trade-offs · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| gmat | data-insights | Two-Part Analysis · Solve simultaneous equations · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| gmat | data-insights | Two-Part Analysis · Discern relationships between two entities · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| gmat | data-insights | Two-Part Analysis · Handle dependent versus independent paired tasks · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| gmat | quantitative-reasoning | Problem Solving · Logic and analytical reasoning applied to quantitative problems · bands short: easy, medium | 3 | 0 | 3 | — | practice |
| gmat | verbal-reasoning | Reading Comprehension · Supporting idea · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| gmat | verbal-reasoning | Critical Reasoning · Strengthen an argument · bands short: easy, medium | 3 | 0 | 3 | — | practice |
| gmat | verbal-reasoning | Critical Reasoning · Weaken an argument · bands short: easy, medium | 3 | 0 | 3 | — | practice |
| gmat | data-insights | Data Sufficiency · Determine at what point there is enough data to solve the problem · bands short: easy, medium | 3 | 0 | 3 | — | practice |
| gmat | data-insights | Table Analysis · Judge whether a stated condition has been met · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| gmat | quantitative-reasoning | Problem Solving · Applying arithmetic and algebraic knowledge to solve problems · bands short: easy | 2 | 0 | 2 | — | practice |
| gmat | data-insights | Multi-Source Reasoning · Examine data from multiple sources · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Developing and considering alternative explanations · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Arithmetic · Estimation · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Arithmetic · The number line · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Arithmetic · Decimal representation · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Geometry · Parallel and perpendicular lines · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Geometry · Quadrilaterals · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Geometry · Congruent and similar figures · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Geometry · Perimeter · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Data Analysis · Conditional probability · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | quant-1 | Data Analysis · Random variables and probability distributions, including normal distributions · bands short: easy, medium, hard | 6 | 0 | 6 | — | practice |
| gre | verbal-1 | Reading Comprehension · Understanding the meaning of paragraphs and larger bodies of text · bands short: easy, medium, hard | 5 | 0 | 5 | 5 × ~1 q | practice |
| gre | verbal-1 | Sentence Equivalence · Recognizing relationships among words and concepts · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| gre | quant-1 | Arithmetic · Absolute value · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| gre | quant-1 | Algebra · Solving simultaneous equations and inequalities · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| gre | quant-1 | Geometry · Volume · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| gre | quant-1 | Geometry · The Pythagorean theorem · bands short: easy, medium, hard | 5 | 0 | 5 | — | practice |
| gre | verbal-1 | Reading Comprehension · Distinguishing between minor and major points · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Reasoning from incomplete data to infer missing information · bands short: easy, medium | 4 | 0 | 4 | 4 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Analyzing a text and reaching conclusions about it · bands short: easy, medium, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| gre | verbal-1 | Sentence Equivalence · Reaching a conclusion about how a sentence should be completed from partial information · bands short: easy, medium | 4 | 0 | 4 | — | practice |
| gre | quant-1 | Arithmetic · Arithmetic operations, exponents and roots · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| gre | quant-1 | Arithmetic · Sequences of numbers · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| gre | quant-1 | Algebra · Factoring and simplifying algebraic expressions · bands short: easy, medium, hard | 4 | 0 | 4 | — | practice |
| gre | quant-1 | Geometry · Angle measurement in degrees · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| gre | quant-1 | Data Analysis · Elementary probability: probabilities of compound events and independent events · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| gre | verbal-1 | Reading Comprehension · Summarizing a passage · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Understanding the structure of a text in terms of how the parts relate to one another · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Identifying strengths and weaknesses of a position · bands short: easy, medium | 3 | 0 | 3 | 3 × ~1 q | practice |
| gre | verbal-1 | Text Completion · Selecting words or short phrases to fill one to three blanks · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| gre | verbal-1 | Text Completion · Revising an interpretation as further text is read · bands short: easy, medium | 3 | 0 | 3 | — | practice |
| gre | verbal-1 | Sentence Equivalence · Focusing on the meaning of the completed whole · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| gre | quant-1 | Arithmetic · Rate · bands short: easy, medium | 3 | 0 | 3 | — | practice |
| gre | quant-1 | Algebra · Setting up equations to solve word problems · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| gre | quant-1 | Algebra · Coordinate geometry: graphs of functions, equations and inequalities, intercepts and slopes of lines · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| gre | quant-1 | Geometry · Other polygons · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| gre | quant-1 | Geometry · Area · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| gre | quant-1 | Data Analysis · Counting methods: combinations, permutations and Venn diagrams · bands short: easy, medium | 3 | 0 | 3 | — | practice |
| gre | verbal-1 | Reading Comprehension · Understanding the meaning of individual words and sentences · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Drawing conclusions from the information provided · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| gre | verbal-1 | Reading Comprehension · Identifying the author's assumptions and perspective · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| gre | verbal-1 | Text Completion · Reasoning from partial information to reconstruct a coherent whole · bands short: easy | 2 | 0 | 2 | — | practice |
| gre | verbal-1 | Text Completion · Using structural signal words (e.g. although, moreover) to infer meaning · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| gre | quant-1 | Arithmetic · Properties and types of integers: divisibility, factorization, prime numbers, remainders, odd and even integers · bands short: easy | 2 | 0 | 2 | — | practice |
| gre | quant-1 | Arithmetic · Percent · bands short: hard | 2 | 0 | 2 | — | practice |
| gre | quant-1 | Algebra · Operations with exponents · bands short: easy | 2 | 0 | 2 | — | practice |
| gre | quant-1 | Algebra · Relations, functions, equations and inequalities · bands short: easy | 2 | 0 | 2 | — | practice |
| gre | quant-1 | Algebra · Solving linear and quadratic equations and inequalities · bands short: easy | 2 | 0 | 2 | — | practice |
| gre | quant-1 | Geometry · Circles · bands short: easy | 2 | 0 | 2 | — | practice |
| gre | quant-1 | Geometry · Triangles, including isosceles, equilateral and 30-60-90 triangles · bands short: easy | 2 | 0 | 2 | — | practice |
| gre | quant-1 | Geometry · Three-dimensional figures · bands short: easy | 2 | 0 | 2 | — | practice |
| gre | quant-1 | Data Analysis · Basic descriptive statistics: mean, median, mode, range, standard deviation, interquartile range, quartiles and percentiles · bands short: easy | 2 | 0 | 2 | — | practice |
| gre | verbal-1 | Text Completion · Interpreting and evaluating a passage while reading · bands short: easy | 1 | 0 | 1 | — | practice |
| gre | quant-1 | Arithmetic · Ratio · bands short: easy | 1 | 0 | 1 | — | practice |
| gre | quant-1 | Data Analysis · Interpretation of data in tables and graphs: line graphs, bar graphs, circle graphs, boxplots, scatterplots and frequency distributions · bands short: easy | 1 | 0 | 1 | 1 × ~3 q | practice |
| bocconi-undergraduate | online-test | Mathematics · First and second degree inequalities · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Function concepts · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Equations and properties of lines · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Sets · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Ordering properties in the reals · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Basic probability · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Conditional probability and Bayes · bands short: easy, medium | 4 | 0 | 4 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Central tendency and dispersion · bands short: easy, hard | 4 | 0 | 4 | — | practice |
| bocconi-undergraduate | online-test | Reading comprehension · Reading comprehension and information processing · bands short: easy, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| bocconi-undergraduate | online-test | Reading comprehension · Explicit information · bands short: medium, hard | 4 | 0 | 4 | 4 × ~1 q | practice |
| bocconi-undergraduate | online-test | Mathematics · Algebraic expressions · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · First and second degree equations · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Systems with two unknowns · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Mathematical notation and formula manipulation · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Plane geometry formulas · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Positions of lines relative to conics · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Trigonometric identities · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Trigonometric functions · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Logarithmic and exponential forms · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Permutations and combinations · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Applied combinatorics · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Percentages · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Unit conversion · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Union and intersection of events · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Application problems · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Absolute and relative frequencies · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Numerical reasoning · Simple calculation by hand · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| bocconi-undergraduate | online-test | Critical thinking · Interpreting the meaning of a text · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Critical thinking · Evaluating truth or falsehood · bands short: easy, medium | 3 | 0 | 3 | — | practice |
| bocconi-undergraduate | online-test | Critical thinking · True, false or not deducible · bands short: easy, hard | 3 | 0 | 3 | 1 × ~4 q | practice |
| bocconi-undergraduate | online-test | Mathematics · Expressing one quantity as a function of others · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Points and distances · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Parabolas and circles · bands short: easy | 2 | 0 | 2 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Trigonometry in right triangles · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Logarithmic and exponential equations and inequalities · bands short: easy | 2 | 0 | 2 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Logarithm and exponential identities · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Counting problems · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| bocconi-undergraduate | online-test | Reading comprehension · Implicit meaning · bands short: easy | 2 | 0 | 2 | 1 × ~2 q | practice |
| bocconi-undergraduate | online-test | Numerical reasoning · Reasoning from data · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| bocconi-undergraduate | online-test | Numerical reasoning · Critical vs superfluous information · bands short: hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| bocconi-undergraduate | online-test | Critical thinking · Drawing conclusions · bands short: easy, medium | 2 | 0 | 2 | — | practice |
| bocconi-undergraduate | online-test | Critical thinking · Excluding unsupported implications · bands short: hard | 2 | 0 | 2 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Absolute values · bands short: easy | 1 | 0 | 1 | — | practice |
| bocconi-undergraduate | online-test | Mathematics · Graphs of elementary functions · bands short: easy | 1 | 0 | 1 | — | practice |
| bocconi-undergraduate | online-test | Reading comprehension · Economic passages with data · bands short: easy | 1 | 0 | 1 | 1 × ~1 q | practice |
| bocconi-undergraduate | online-test | Numerical reasoning · Charts and tables · bands short: hard | 1 | 0 | 1 | 1 × ~1 q | practice |
| bocconi-law | online-test-law | Mathematics · Sets · bands short: medium, hard | 4 | 0 | 4 | — | practice |
| bocconi-law | online-test-law | Mathematics · Plane geometry · bands short: medium, hard | 3 | 0 | 3 | — | practice |
| bocconi-law | online-test-law | Mathematics · Analytic geometry: points and distances · bands short: medium, hard | 3 | 0 | 3 | — | practice |
| bocconi-law | online-test-law | Mathematics · Units of measure · bands short: medium, hard | 3 | 0 | 3 | — | practice |
| bocconi-law | online-test-law | Reading comprehension · Implicit meaning · bands short: easy, medium | 3 | 0 | 3 | 3 × ~1 q | practice |
| bocconi-law | online-test-law | Reading comprehension · Humanistic passages · bands short: easy, hard | 3 | 0 | 3 | 2 × ~2 q | practice |
| bocconi-law | online-test-law | Numerical reasoning · Reasoning over calculation · bands short: easy, hard | 3 | 0 | 3 | 2 × ~2 q | practice |
| bocconi-law | online-test-law | Mathematics · Analytic geometry: lines · bands short: hard | 2 | 0 | 2 | — | practice |
| bocconi-law | online-test-law | Mathematics · Ordering of the real numbers · bands short: medium, hard | 2 | 0 | 2 | — | practice |
| bocconi-law | online-test-law | Mathematics · Percentages · bands short: hard | 2 | 0 | 2 | — | practice |
| bocconi-law | online-test-law | Reading comprehension · Explicit information · bands short: hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| bocconi-law | online-test-law | Numerical reasoning · Relevant vs superfluous information · bands short: hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| bocconi-law | online-test-law | Verbal reasoning · Assumption · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| bocconi-law | online-test-law | Verbal reasoning · Conclusion · bands short: easy, medium | 2 | 0 | 2 | — | practice |
| bocconi-law | online-test-law | Verbal reasoning · Logical error · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| bocconi-law | online-test-law | Verbal reasoning · Weaken and strengthen · bands short: easy | 2 | 0 | 2 | — | practice |
| bocconi-law | online-test-law | Numerical reasoning · Charts and tables · bands short: hard | 1 | 0 | 1 | 1 × ~1 q | practice |
| bocconi-law | online-test-law | Verbal reasoning · True / false / not deducible · bands short: easy | 1 | 0 | 1 | 1 × ~4 q | practice |
| bocconi-graduate | online-test | Quantitative reasoning · Numbers, ratios and percentages · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| bocconi-graduate | online-test | Verbal reasoning · Analysing an argument · bands short: easy | 2 | 0 | 2 | 1 × ~4 q | practice |
| bocconi-graduate | online-test | Data insight · Reading tables and charts · bands short: hard | 2 | 0 | 2 | 1 × ~2 q | practice |
| bocconi-graduate | online-test | Data insight · Conclusions and derived figures · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| bocconi-graduate | online-test | Quantitative reasoning · Algebra and problem solving · bands short: easy | 2 | 0 | 2 | — | practice |
| polito-til-i | reading-logic | Reading comprehension · What the excerpt implies · bands short: easy, hard | 4 | 0 | 4 | 2 × ~2 q | practice |
| polito-til-i | mathematics | Mathematics · Exponential, logarithmic and trigonometric equations · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| polito-til-i | reading-logic | Logic · Logical deduction · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| polito-til-i | technical-knowledge | Computer science · Conditions and loops · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| polito-til-i | technical-knowledge | Computer science · Bits, bytes and hardware basics · bands short: medium, hard | 3 | 0 | 3 | — | practice |
| polito-til-i | mathematics | Mathematics · Plane and solid geometry · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| polito-til-i | mathematics | Mathematics · Monomials and polynomials · bands short: easy | 2 | 0 | 2 | — | practice |
| polito-til-i | mathematics | Mathematics · Analytic geometry, exponentials and logarithms · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| polito-til-i | reading-logic | Reading comprehension · What the excerpt states · bands short: hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| polito-til-i | reading-logic | Reading comprehension · Purpose and structure · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| polito-til-i | reading-logic | Logic · Quantifiers · bands short: easy | 2 | 0 | 2 | — | practice |
| polito-til-i | reading-logic | Logic · Elementary logic problems · bands short: easy | 2 | 0 | 2 | — | practice |
| polito-til-i | reading-logic | Logic · Negating statements · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| polito-til-i | physics | Physics · Vectors and units of measurement · bands short: hard | 2 | 0 | 2 | — | practice |
| polito-til-i | technical-knowledge | Computer science · Variables and assignment · bands short: hard | 2 | 0 | 2 | — | practice |
| polito-til-i | technical-knowledge | Computer science · Arithmetic and logical operators · bands short: easy | 2 | 0 | 2 | — | practice |
| polito-til-i | mathematics | Mathematics · Natural, integer and rational numbers · bands short: hard | 1 | 0 | 1 | — | practice |
| polito-til-i | mathematics | Mathematics · Goniometry and trigonometry · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-i | mathematics | Mathematics · Elementary graphs and plane regions · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-i | mathematics | Mathematics · Algebraic equations and inequalities · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-i | reading-logic | Logic · Orders and arrangements · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-i | physics | Physics · Kinematics · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-i | physics | Physics · Forces and dynamics · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-i | physics | Physics · Work and energy · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-i | physics | Physics · Electrostatics and circuits · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-i | technical-knowledge | Representation · Views and projections · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-i | technical-knowledge | Representation · Graphic-technical conventions · bands short: hard | 1 | 0 | 1 | — | practice |
| polito-til-a | mathematics-physics | Mathematics · Algebraic calculation · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| polito-til-a | reading-comprehension | Reading comprehension · What the text states · bands short: hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| polito-til-a | reading-comprehension | Reading comprehension · What the text implies · bands short: easy, hard | 2 | 0 | 2 | 1 × ~2 q | practice |
| polito-til-a | reading-comprehension | Reading comprehension · Purpose and structure · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| polito-til-a | mathematics-physics | Mathematics · Numbers and arithmetic · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| polito-til-a | mathematics-physics | Mathematics · Euclidean geometry · bands short: easy | 2 | 0 | 2 | — | practice |
| polito-til-a | mathematics-physics | Physics · Heat and temperature · bands short: easy | 2 | 0 | 2 | — | practice |
| polito-til-a | mathematics-physics | Physics · Electrostatics and circuits · bands short: easy | 2 | 0 | 2 | — | practice |
| polito-til-a | general-knowledge | History and general knowledge · Law, economics and citizenship · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-a | logical-reasoning | Logical reasoning · Verbal reasoning · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-a | logical-reasoning | Logical reasoning · Logic problems · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-a | mathematics-physics | Mathematics · Analytic geometry and trigonometry · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-a | mathematics-physics | Mathematics · Probability and statistics · bands short: easy | 1 | 0 | 1 | — | practice |
| polito-til-a | mathematics-physics | Physics · Mechanics and statics · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-e | verbal-comprehension | Verbal comprehension · Meaning in context · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| tolc-e | verbal-comprehension | Verbal comprehension · What the text states · bands short: hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| tolc-e | verbal-comprehension | Verbal comprehension · What the text implies · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| tolc-e | verbal-comprehension | Verbal comprehension · Purpose and structure · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| tolc-e | mathematics | Mathematics · Analytic geometry · bands short: easy | 2 | 0 | 2 | — | practice |
| tolc-e | logic | Logic · Arguments · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-e | mathematics | Mathematics · Polynomials and rational expressions · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-e | mathematics | Mathematics · Equations, inequalities and systems · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-e | mathematics | Mathematics · Plane and solid geometry · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-e | mathematics | Mathematics · Elementary functions · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-f | mathematics | Mathematics · Combinatorics, probability and statistics · bands short: easy | 2 | 0 | 2 | — | practice |
| tolc-f | physics | Physics · Measures and units · bands short: hard | 2 | 0 | 2 | — | practice |
| tolc-f | logic | Logic · Reasoning with elementary mathematics · bands short: easy | 2 | 0 | 2 | — | practice |
| tolc-f | biology | Biology · Chemistry of living things · bands short: hard | 1 | 0 | 1 | — | practice |
| tolc-f | biology | Biology · Biodiversity · bands short: hard | 1 | 0 | 1 | — | practice |
| tolc-f | biology | Biology · Cell biology · bands short: hard | 1 | 0 | 1 | — | practice |
| tolc-f | biology | Biology · Cell cycle, reproduction and heredity · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-f | biology | Biology · Ecology · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-f | mathematics | Mathematics · Numbers, ratios and percentages · bands short: hard | 1 | 0 | 1 | — | practice |
| tolc-f | mathematics | Mathematics · Algebra, equations and inequalities · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-f | mathematics | Mathematics · Functions and trigonometry · bands short: hard | 1 | 0 | 1 | — | practice |
| tolc-f | mathematics | Mathematics · Plane, solid and analytic geometry · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-f | physics | Physics · Kinematics, forces and energy · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-f | physics | Physics · Fluids and thermodynamics · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-f | physics | Physics · Electricity, magnetism, waves and optics · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-f | logic | Logic · Graphs and tables · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-i | verbal-comprehension | Verbal comprehension · Purpose and structure · bands short: easy, hard | 3 | 0 | 3 | 3 × ~1 q | practice |
| tolc-i | verbal-comprehension | Verbal comprehension · What the text states · bands short: hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| tolc-i | verbal-comprehension | Verbal comprehension · What the text implies · bands short: easy | 2 | 0 | 2 | 2 × ~1 q | practice |
| tolc-i | verbal-comprehension | Verbal comprehension · Meaning in context · bands short: hard | 2 | 0 | 2 | 2 × ~1 q | practice |
| tolc-i | mathematics | Mathematics · Trigonometry · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-i | mathematics | Mathematics · Probability and statistics · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-i | logic | Logic · Sequences and patterns · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-i | sciences | Sciences · Mechanics · bands short: easy | 1 | 0 | 1 | — | practice |
| tolc-i | sciences | Sciences · Chemistry · bands short: easy | 1 | 0 | 1 | — | practice |
| imat | imat | Reading skills and knowledge acquired in studies · Reading comprehension · bands short: easy, hard | 3 | 0 | 3 | — | practice |
| imat | imat | Reading skills and knowledge acquired in studies · Knowledge acquired in studies · bands short: hard | 2 | 0 | 2 | — | practice |
| imat | imat | Logical reasoning and problems · Problem solving · bands short: easy | 2 | 0 | 2 | — | practice |
| imat | imat | Chemistry · Bonding and molecules · bands short: hard | 2 | 0 | 2 | — | practice |
| imat | imat | Physics and mathematics · Algebra and functions · bands short: easy | 2 | 0 | 2 | — | practice |
| imat | imat | Physics and mathematics · Probability and statistics · bands short: easy, hard | 2 | 0 | 2 | — | practice |
| imat | imat | Physics and mathematics · Mechanics and fluids · bands short: easy | 2 | 0 | 2 | — | practice |
| imat | imat | Physics and mathematics · Thermodynamics · bands short: hard | 2 | 0 | 2 | — | practice |
| imat | imat | Biology · Genetics and heredity · bands short: easy | 1 | 0 | 1 | — | practice |
| imat | imat | Biology · Human anatomy and physiology · bands short: hard | 1 | 0 | 1 | — | practice |
| imat | imat | Biology · Evolution and diversity · bands short: hard | 1 | 0 | 1 | — | practice |
| imat | imat | Chemistry · Atoms and the periodic table · bands short: hard | 1 | 0 | 1 | — | practice |
| imat | imat | Chemistry · Reactions, equilibrium, acids and bases · bands short: hard | 1 | 0 | 1 | — | practice |
| imat | imat | Chemistry · Organic chemistry · bands short: hard | 1 | 0 | 1 | — | practice |
| imat | imat | Physics and mathematics · Geometry and trigonometry · bands short: hard | 1 | 0 | 1 | — | practice |
| imat | imat | Physics and mathematics · Electricity and magnetism · bands short: hard | 1 | 0 | 1 | — | practice |

## Drafting against a gap

For a row with something to author, draft against that constraint with the existing tool, which writes
`in_review` items only (docs/AUTHORING-BRIEF.md). Check the request first with `--dry-run`; a live run calls
a paid model and needs the owner’s go-ahead:

    npm run content:draft -- --exam=<exam> --domain=<domain slug> --skill=<skill slug> --count=<n> --dry-run

A drafted item is a structurally valid draft, nothing more. It becomes available to learners only after
option-order normalisation, the AI blind review (`scripts/apply-review.ts`), a re-seed, and a human reviewer’s
approval of its exact content.
