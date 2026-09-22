import type { ExamConfig, NavigationPolicy } from '@/lib/assessment/types';

/**
 * GRE General Test — shorter format (effective 22 September 2023).
 *
 * Every fact here comes from content/exam-specs/_raw/gre-general.draft.json,
 * which was verified against ETS pages and PDFs on 2026-09-18. Anything ETS
 * does not publish is recorded in `unverified` and the dependent capability is
 * switched off rather than guessed at.
 */

const STRUCTURE_URL =
  'https://www.ets.org/gre/test-takers/general-test/prepare/test-structure.html';
const STRATEGIES_URL =
  'https://www.ets.org/gre/test-takers/general-test/prepare/strategies-tips.html';
const AW_URL =
  'https://www.ets.org/gre/test-takers/general-test/prepare/content/analytical-writing.html';
const VERBAL_URL =
  'https://www.ets.org/gre/test-takers/general-test/prepare/content/verbal-reasoning.html';
const QUANT_URL =
  'https://www.ets.org/gre/test-takers/general-test/prepare/content/quantitative-reasoning.html';

/**
 * Intra-section navigation is published verbatim by ETS: move forward and
 * backward throughout a section, preview and review, Mark/Review tagging, a
 * review screen listing every question, and answer changes while time remains.
 *
 * `allowReturnToPreviousPart: false` is the one restrictive rule here and it is
 * OUR product decision — it is required for section-level routing to mean
 * anything. ETS never states that a completed section is locked, so this is
 * listed in `unverified` and must never be presented to learners as an ETS
 * rule. Because it is restrictive it is enforced server-side.
 */
const SECTION_NAVIGATION: NavigationPolicy = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  allowReturnToPreviousPart: false,
  reviewScreen: true,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: STRUCTURE_URL,
};

/**
 * The Analytical Writing screen holds a single task, so Mark/Review and a
 * review screen are moot. ETS does not publish whether those controls exist
 * there, so we do not render them.
 */
const WRITING_NAVIGATION: NavigationPolicy = {
  allowBackWithinPart: true,
  allowForwardSkip: false,
  allowChangeAnswer: true,
  allowFlagForReview: false,
  allowReturnToPreviousPart: false,
  reviewScreen: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: AW_URL,
};

const CALCULATOR_NOTE_QUANT =
  'Basic on-screen calculator, published by ETS for the Quantitative Reasoning measure only. ' +
  'Documented behaviour: standard order of operations (parentheses, exponentiation including ' +
  'square roots, multiplication and division left to right, then addition and subtraction left ' +
  'to right); parentheses; one memory location with memory recall, memory clear and memory sum; ' +
  '"The calculator displays up to eight digits"; ERROR for results greater than 99,999,999, for ' +
  'division by zero and for the square root of a negative number (clearable only with the clear ' +
  'button); a positive result below 0.0000001 displays 0. The Transfer Display button works on ' +
  'Numeric Entry questions with a single answer box and cannot be used for a fraction.';

const CALCULATOR_NOTE_NON_QUANT =
  'ETS scopes the on-screen calculator to the Quantitative Reasoning measure and never states ' +
  'that a calculator is unavailable or technically blocked here, so the policy for this section ' +
  'is inferred rather than published. We provide no calculator in this section.';

export const greConfig: ExamConfig = {
  examKey: 'gre',
  version: '2026.09',
  name: 'GRE General Test',
  shortName: 'GRE',
  publisher: 'ETS',
  versionLabel:
    'Shorter GRE General Test (format effective September 22, 2023; verified for the 2026–27 administration year)',
  admissionsCycle: '2026–27',
  verifiedOn: '2026-09-18',
  audience: ['graduate'],
  summary:
    'The current GRE General Test runs about 1 hour and 58 minutes (118 minutes) across five ' +
    'separately timed sections: one 30-minute Analytical Writing "Analyze an Issue" task, two ' +
    'Verbal Reasoning sections (12 questions in 18 minutes, then 15 questions in 23 minutes) and ' +
    'two Quantitative Reasoning sections (12 questions in 21 minutes, then 15 questions in 26 ' +
    'minutes) — 54 scored questions plus one essay. Analytical Writing is always first; the ' +
    'Verbal and Quantitative sections may appear in any order after it. Verbal and Quantitative ' +
    'are section-level adaptive: the first section of each measure is of average difficulty and ' +
    'the difficulty of the second depends on performance on the first. Within a section the ' +
    'taker can move forward and backward, mark and review, and change answers. A basic on-screen ' +
    'calculator is available for Quantitative Reasoning only. Verbal and Quantitative are ' +
    'reported 130–170 in one-point increments and Analytical Writing 0–6 in half-point ' +
    'increments, with nothing subtracted for incorrect answers. The current format contains no ' +
    'unscored and no research section.',

  sources: [
    {
      label: 'GRE General Test structure and timing',
      url: STRUCTURE_URL,
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'GRE General Test content overview',
      url: 'https://www.ets.org/gre/test-takers/general-test/prepare/content.html',
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Analytical Writing measure',
      url: AW_URL,
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Verbal Reasoning measure',
      url: VERBAL_URL,
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Quantitative Reasoning measure',
      url: QUANT_URL,
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'How the Analytical Writing measure is scored',
      url: 'https://www.ets.org/gre/test-takers/general-test/prepare/content/analytical-writing/scoring.html',
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Understand your GRE General Test scores',
      url: 'https://www.ets.org/gre/test-takers/general-test/scores/understand-scores.html',
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'GRE General Test strategies and tips',
      url: STRATEGIES_URL,
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'GRE Information Bulletin (PDF)',
      url: 'https://www.ets.org/content/dam/ets-india/pdfs/gre/gre-info-bulletin.pdf',
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Interpreting Your GRE Scores 2026-27 (PDF)',
      url: 'https://www.eu.ets.org/pdfs/gre/interpreting-gre-scores.pdf',
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'GRE sample questions, including Numeric Entry rules (PDF)',
      url: 'https://www.ets.org/pdfs/gre/gre-sample-questions.pdf',
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Guidelines for Using the On-screen Calculator (PDF)',
      url: 'https://www.ets.org/content/dam/ets-org/pdfs/gre/on-screen-calculator-guidelines.pdf',
      publisher: 'ETS',
      verifiedOn: '2026-09-18',
    },
  ],

  sections: [
    {
      key: 'analytical-writing',
      name: 'Analytical Writing — Analyze an Issue',
      order: 0,
      officialQuestionCount: '1 (one "Analyze an Issue" task)',
      officialTimeMinutes: 30,
      calculator: 'unverified',
      calculatorNote: CALCULATOR_NOTE_NON_QUANT,
      navigation: WRITING_NAVIGATION,
      responseTypes: ['essay'],
      notes: [
        'Always delivered first. The "Analyze an Argument" task is not part of the current format.',
        'Typed in a basic ETS word processor supporting insert, delete, cut-and-paste and undo. ' +
          '"Tools such as a spellchecker and grammar checker are not available." — our editor sets ' +
          'spellcheck off to match.',
        'Not adaptive.',
        'ETS publishes no character or word limit for the response and does not say whether a word ' +
          'count is displayed.',
        'Essays are never auto-scored here. ETS scores the measure 0–6 holistically with input from ' +
          'the e-rater engine, whose feature weights and adjudication rules are unpublished.',
      ],
    },
    {
      key: 'verbal-1',
      name: 'Verbal Reasoning — Section 1',
      order: 1,
      officialQuestionCount: '12',
      officialTimeMinutes: 18,
      calculator: 'unverified',
      calculatorNote: CALCULATOR_NOTE_NON_QUANT,
      navigation: SECTION_NAVIGATION,
      responseTypes: ['single_select', 'multi_select', 'two_part'],
      notes: [
        'The first Verbal section is of average difficulty. It is not itself adaptive; it determines ' +
          'the difficulty of Verbal Section 2.',
        'Question types: Reading Comprehension (select one of five; select one or more of three, with ' +
          'one to three correct; Select-in-Passage), Text Completion (one to three blanks) and ' +
          'Sentence Equivalence (one blank, six choices, select exactly two).',
        'Text Completion with two or three blanks is carried by the two_part response type; ' +
          'single-blank Text Completion is single_select with five choices.',
        'Select-in-Passage has no value in the shared responseType enum and is therefore not yet ' +
          'deliverable; no Select-in-Passage items are selected into an attempt.',
        'Data Sufficiency is not a GRE question type and is never emitted into this section.',
        'Multi-answer items are all-or-nothing: "there is no credit for partially correct answers".',
      ],
    },
    {
      key: 'verbal-2',
      // Same content domains as verbal-1; questions are tagged there.
      poolSectionKey: 'verbal-1',
      name: 'Verbal Reasoning — Section 2',
      order: 2,
      officialQuestionCount: '15',
      officialTimeMinutes: 23,
      calculator: 'unverified',
      calculatorNote: CALCULATOR_NOTE_NON_QUANT,
      navigation: SECTION_NAVIGATION,
      responseTypes: ['single_select', 'multi_select', 'two_part'],
      notes: [
        'Section-level adaptive: "the computer selects the second operational section of a measure ' +
          'based on your performance on the first section". ETS does not publish the routing ' +
          'statistic, the number of difficulty tiers or the cut thresholds.',
        'Same question types and same intra-section navigation as Verbal Section 1.',
        'Select-in-Passage is not yet deliverable (no enum value in the shared responseType set).',
      ],
    },
    {
      key: 'quant-1',
      name: 'Quantitative Reasoning — Section 1',
      order: 3,
      officialQuestionCount: '12',
      officialTimeMinutes: 21,
      calculator: 'onscreen',
      calculatorNote: CALCULATOR_NOTE_QUANT,
      navigation: SECTION_NAVIGATION,
      responseTypes: ['quantitative_comparison', 'single_select', 'multi_select', 'numeric_entry'],
      notes: [
        'The first Quantitative section is of average difficulty. It determines the difficulty of ' +
          'Quantitative Section 2.',
        'Four published question types: Quantitative Comparison (four fixed answer choices whose ' +
          'order is part of the item type and is never randomised), Multiple-choice Select One ' +
          'Answer Choice, Multiple-choice Select One or More Answer Choices, and Numeric Entry ' +
          '(single box integer/decimal, or two boxes for a fraction). Each may also appear inside a ' +
          'Data Interpretation set sharing one table or graph.',
        'Content is arithmetic, algebra, geometry and data analysis at a level no higher than a ' +
          'second course in algebra: "It doesn\'t include trigonometry, calculus or other ' +
          'higher-level mathematics." and "The ability to construct proofs is not tested."',
        'Numeric Entry is graded by value, not string: equivalent forms such as 2.5 and 2.50 are ' +
          'both correct, fractions need not be reduced, and where no rounding instruction is given ' +
          'the exact answer is required.',
        'Geometric figures are not necessarily drawn to scale; coordinate systems and statistical ' +
          'graphs are drawn to scale and may be read by measurement.',
        'Data Sufficiency is a GMAT question type and is never emitted into this section.',
      ],
    },
    {
      key: 'quant-2',
      // Same content domains as quant-1; questions are tagged there.
      poolSectionKey: 'quant-1',
      name: 'Quantitative Reasoning — Section 2',
      order: 4,
      officialQuestionCount: '15',
      officialTimeMinutes: 26,
      calculator: 'onscreen',
      calculatorNote: CALCULATOR_NOTE_QUANT,
      navigation: SECTION_NAVIGATION,
      responseTypes: ['quantitative_comparison', 'single_select', 'multi_select', 'numeric_entry'],
      notes: [
        'Section-level adaptive: difficulty is selected by the computer based on overall performance ' +
          'on Quantitative Section 1. The routing algorithm and thresholds are not published.',
        'Same question types, calculator specification and intra-section navigation as Quantitative ' +
          'Section 1.',
      ],
    },
  ],

  domains: [
    {
      slug: 'aw-analyze-an-issue',
      name: 'Analyze an Issue',
      sectionKey: 'analytical-writing',
      description:
        'The single 30-minute Analytical Writing task: evaluate an issue, take a position and ' +
        'develop an argument for it with reasons and examples.',
      officialShare: 'The entire Analytical Writing measure (one task)',
      skills: [
        {
          slug: 'aw-articulate-support-complex-ideas',
          name: 'Articulate and support complex ideas',
          description: '',
        },
        { slug: 'aw-construct-arguments', name: 'Construct arguments', description: '' },
        {
          slug: 'aw-sustain-focused-coherent-discussion',
          name: 'Sustain a focused and coherent discussion',
          description: '',
        },
        {
          slug: 'aw-control-standard-written-english',
          name: 'Control the elements of standard written English',
          description: '',
        },
        {
          slug: 'aw-evaluate-issue-complexities',
          name: 'Evaluate an issue and consider its complexities',
          description: '',
        },
        {
          slug: 'aw-develop-argument-reasons-examples',
          name: "Develop an argument with reasons and examples supporting one's own position",
          description: '',
        },
      ],
      source: AW_URL,
    },
    {
      slug: 'verbal-reading-comprehension',
      name: 'Reading Comprehension',
      sectionKey: 'verbal-1',
      description:
        'Applies to BOTH Verbal Reasoning sections (verbal-1 and verbal-2). ETS does not publish a ' +
        'separate Verbal content-domain tree, so the three published question types are used as the ' +
        'Verbal domains.',
      officialShare: 'About half of the Verbal Reasoning measure is passage-based',
      skills: [
        {
          slug: 'rc-word-sentence-meaning',
          name: 'Understanding the meaning of individual words and sentences',
          description: '',
        },
        {
          slug: 'rc-paragraph-text-meaning',
          name: 'Understanding the meaning of paragraphs and larger bodies of text',
          description: '',
        },
        {
          slug: 'rc-major-vs-minor-points',
          name: 'Distinguishing between minor and major points',
          description: '',
        },
        { slug: 'rc-summarize-passage', name: 'Summarizing a passage', description: '' },
        {
          slug: 'rc-draw-conclusions',
          name: 'Drawing conclusions from the information provided',
          description: '',
        },
        {
          slug: 'rc-infer-missing-information',
          name: 'Reasoning from incomplete data to infer missing information',
          description: '',
        },
        {
          slug: 'rc-text-structure',
          name: 'Understanding the structure of a text in terms of how the parts relate to one another',
          description: '',
        },
        {
          slug: 'rc-author-assumptions-perspective',
          name: "Identifying the author's assumptions and perspective",
          description: '',
        },
        {
          slug: 'rc-analyze-and-conclude',
          name: 'Analyzing a text and reaching conclusions about it',
          description: '',
        },
        {
          slug: 'rc-strengths-weaknesses-of-position',
          name: 'Identifying strengths and weaknesses of a position',
          description: '',
        },
        {
          slug: 'rc-alternative-explanations',
          name: 'Developing and considering alternative explanations',
          description: '',
        },
      ],
      source: VERBAL_URL,
    },
    {
      slug: 'verbal-text-completion',
      name: 'Text Completion',
      sectionKey: 'verbal-1',
      description:
        'Applies to BOTH Verbal Reasoning sections. One to five sentences with one to three blanks; ' +
        'five choices for a single blank, three choices per blank for two or three blanks, scored ' +
        'all-or-nothing.',
      officialShare: null,
      skills: [
        {
          slug: 'tc-interpret-evaluate-while-reading',
          name: 'Interpreting and evaluating a passage while reading',
          description: '',
        },
        {
          slug: 'tc-reason-from-partial-information',
          name: 'Reasoning from partial information to reconstruct a coherent whole',
          description: '',
        },
        {
          slug: 'tc-select-words-for-blanks',
          name: 'Selecting words or short phrases to fill one to three blanks',
          description: '',
        },
        {
          slug: 'tc-structural-signal-words',
          name: 'Using structural signal words (e.g. although, moreover) to infer meaning',
          description: '',
        },
        {
          slug: 'tc-revise-interpretation',
          name: 'Revising an interpretation as further text is read',
          description: '',
        },
      ],
      source: VERBAL_URL,
    },
    {
      slug: 'verbal-sentence-equivalence',
      name: 'Sentence Equivalence',
      sectionKey: 'verbal-1',
      description:
        'Applies to BOTH Verbal Reasoning sections. A single sentence with one blank and six answer ' +
        'choices, from which exactly two must be selected, with no partial credit.',
      officialShare: null,
      skills: [
        {
          slug: 'se-conclude-from-partial-information',
          name: 'Reaching a conclusion about how a sentence should be completed from partial information',
          description: '',
        },
        {
          slug: 'se-meaning-of-completed-whole',
          name: 'Focusing on the meaning of the completed whole',
          description: '',
        },
        {
          slug: 'se-two-choices-alike-in-meaning',
          name: 'Identifying two choices that produce complete, coherent sentences alike in meaning',
          description: '',
        },
        {
          slug: 'se-word-concept-relationships',
          name: 'Recognizing relationships among words and concepts',
          description: '',
        },
      ],
      source: VERBAL_URL,
    },
    {
      slug: 'quant-arithmetic',
      name: 'Arithmetic',
      sectionKey: 'quant-1',
      description: 'Applies to BOTH Quantitative Reasoning sections (quant-1 and quant-2).',
      officialShare: null,
      skills: [
        {
          slug: 'arith-integer-properties',
          name: 'Properties and types of integers: divisibility, factorization, prime numbers, remainders, odd and even integers',
          description: '',
        },
        {
          slug: 'arith-operations-exponents-roots',
          name: 'Arithmetic operations, exponents and roots',
          description: '',
        },
        { slug: 'arith-estimation', name: 'Estimation', description: '' },
        { slug: 'arith-percent', name: 'Percent', description: '' },
        { slug: 'arith-ratio', name: 'Ratio', description: '' },
        { slug: 'arith-rate', name: 'Rate', description: '' },
        { slug: 'arith-absolute-value', name: 'Absolute value', description: '' },
        { slug: 'arith-number-line', name: 'The number line', description: '' },
        { slug: 'arith-decimal-representation', name: 'Decimal representation', description: '' },
        { slug: 'arith-sequences', name: 'Sequences of numbers', description: '' },
      ],
      source: QUANT_URL,
    },
    {
      slug: 'quant-algebra',
      name: 'Algebra',
      sectionKey: 'quant-1',
      description: 'Applies to BOTH Quantitative Reasoning sections.',
      officialShare: null,
      skills: [
        { slug: 'alg-exponent-operations', name: 'Operations with exponents', description: '' },
        {
          slug: 'alg-factoring-simplifying',
          name: 'Factoring and simplifying algebraic expressions',
          description: '',
        },
        {
          slug: 'alg-relations-functions-equations-inequalities',
          name: 'Relations, functions, equations and inequalities',
          description: '',
        },
        {
          slug: 'alg-linear-quadratic-solving',
          name: 'Solving linear and quadratic equations and inequalities',
          description: '',
        },
        {
          slug: 'alg-simultaneous-equations',
          name: 'Solving simultaneous equations and inequalities',
          description: '',
        },
        {
          slug: 'alg-word-problem-setup',
          name: 'Setting up equations to solve word problems',
          description: '',
        },
        {
          slug: 'alg-coordinate-geometry',
          name: 'Coordinate geometry: graphs of functions, equations and inequalities, intercepts and slopes of lines',
          description: '',
        },
      ],
      source: QUANT_URL,
    },
    {
      slug: 'quant-geometry',
      name: 'Geometry',
      sectionKey: 'quant-1',
      description: 'Applies to BOTH Quantitative Reasoning sections.',
      officialShare: null,
      skills: [
        {
          slug: 'geom-parallel-perpendicular-lines',
          name: 'Parallel and perpendicular lines',
          description: '',
        },
        { slug: 'geom-circles', name: 'Circles', description: '' },
        {
          slug: 'geom-triangles',
          name: 'Triangles, including isosceles, equilateral and 30-60-90 triangles',
          description: '',
        },
        { slug: 'geom-quadrilaterals', name: 'Quadrilaterals', description: '' },
        { slug: 'geom-other-polygons', name: 'Other polygons', description: '' },
        {
          slug: 'geom-congruent-similar-figures',
          name: 'Congruent and similar figures',
          description: '',
        },
        {
          slug: 'geom-three-dimensional-figures',
          name: 'Three-dimensional figures',
          description: '',
        },
        { slug: 'geom-area', name: 'Area', description: '' },
        { slug: 'geom-perimeter', name: 'Perimeter', description: '' },
        { slug: 'geom-volume', name: 'Volume', description: '' },
        { slug: 'geom-pythagorean-theorem', name: 'The Pythagorean theorem', description: '' },
        {
          slug: 'geom-angle-measurement',
          name: 'Angle measurement in degrees',
          description: '',
        },
      ],
      source: QUANT_URL,
    },
    {
      slug: 'quant-data-analysis',
      name: 'Data Analysis',
      sectionKey: 'quant-1',
      description:
        'Applies to BOTH Quantitative Reasoning sections. Inferential statistics is out of scope.',
      officialShare: null,
      skills: [
        {
          slug: 'data-descriptive-statistics',
          name: 'Basic descriptive statistics: mean, median, mode, range, standard deviation, interquartile range, quartiles and percentiles',
          description: '',
        },
        {
          slug: 'data-tables-and-graphs',
          name: 'Interpretation of data in tables and graphs: line graphs, bar graphs, circle graphs, boxplots, scatterplots and frequency distributions',
          description: '',
        },
        {
          slug: 'data-elementary-probability',
          name: 'Elementary probability: probabilities of compound events and independent events',
          description: '',
        },
        { slug: 'data-conditional-probability', name: 'Conditional probability', description: '' },
        {
          slug: 'data-random-variables-distributions',
          name: 'Random variables and probability distributions, including normal distributions',
          description: '',
        },
        {
          slug: 'data-counting-methods',
          name: 'Counting methods: combinations, permutations and Venn diagrams',
          description: '',
        },
      ],
      source: QUANT_URL,
    },
  ],

  blueprints: [
    // -----------------------------------------------------------------------
    // 1. Diagnostic — short skill check across every domain.
    // -----------------------------------------------------------------------
    {
      id: 'diagnostic',
      label: 'GRE diagnostic',
      mode: 'diagnostic',
      description:
        'A short check across all eight GRE domains — one part per published section, generously ' +
        'timed at roughly 1.5x the real per-question pace. Seventeen items in total.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_pauses',
      fidelity: 'practice_only',
      fidelityNote:
        'This is a short skill check, NOT a predictor of a GRE score. It is far shorter than the ' +
        'real test, every part is timed at about 1.5x the real per-question pace, there is no ' +
        'adaptive routing, and it produces no 130–170 or 0–6 figure. The Analytical Writing part ' +
        'asks for one essay (the real measure has exactly one task) rather than the 3–6 items used ' +
        'in the other parts, because writing several essays for a diagnostic would be pointless; ' +
        'the essay is offered for self-assessment against the rubric and is never auto-scored.',
      parts: [
        {
          key: 'diagnostic-analytical-writing',
          sectionKey: 'analytical-writing',
          label: 'Analytical Writing — Analyze an Issue',
          timeLimitSeconds: 2700,
          itemCount: 1,
          selection: {
            sectionKey: 'analytical-writing',
            domains: ['aw-analyze-an-issue'],
            skills: [],
            responseTypes: ['essay'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diagnostic-verbal-1',
          sectionKey: 'verbal-1',
          label: 'Verbal Reasoning — part 1',
          // Real pace 18 min / 12 q = 90 s per question; 1.5x = 135 s x 4 items.
          timeLimitSeconds: 540,
          itemCount: 4,
          selection: {
            sectionKey: 'verbal-1',
            domains: [
              'verbal-reading-comprehension',
              'verbal-text-completion',
              'verbal-sentence-equivalence',
            ],
            skills: [],
            responseTypes: [],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diagnostic-verbal-2',
          sectionKey: 'verbal-2',
          label: 'Verbal Reasoning — part 2',
          // Real pace 23 min / 15 q = 92 s per question; 1.5x = 138 s x 4 items.
          timeLimitSeconds: 552,
          itemCount: 4,
          selection: {
            sectionKey: 'verbal-2',
            domains: [
              'verbal-reading-comprehension',
              'verbal-text-completion',
              'verbal-sentence-equivalence',
            ],
            skills: [],
            responseTypes: [],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diagnostic-quant-1',
          sectionKey: 'quant-1',
          label: 'Quantitative Reasoning — part 1',
          // Real pace 21 min / 12 q = 105 s per question; 1.5x = 157.5 s x 4 items.
          timeLimitSeconds: 630,
          itemCount: 4,
          selection: {
            sectionKey: 'quant-1',
            domains: [
              'quant-arithmetic',
              'quant-algebra',
              'quant-geometry',
              'quant-data-analysis',
            ],
            skills: [],
            responseTypes: [],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diagnostic-quant-2',
          sectionKey: 'quant-2',
          label: 'Quantitative Reasoning — part 2',
          // Real pace 26 min / 15 q = 104 s per question; 1.5x = 156 s x 4 items.
          timeLimitSeconds: 624,
          itemCount: 4,
          selection: {
            sectionKey: 'quant-2',
            domains: [
              'quant-arithmetic',
              'quant-algebra',
              'quant-geometry',
              'quant-data-analysis',
            ],
            skills: [],
            responseTypes: [],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 2. Practice — a runtime-overridable template.
    // -----------------------------------------------------------------------
    {
      id: 'practice',
      label: 'Practice set',
      mode: 'practice',
      description:
        'A ten-question untimed practice set drawn from anywhere in the exam. This is a TEMPLATE: ' +
        'the learner overrides domain, difficulty and length at runtime, so the selection here is ' +
        'deliberately permissive (no domain filter, no difficulty mix). The sectionKey is only the ' +
        'default starting point and is replaced by whatever the learner picks.',
      timing: 'untimed',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_pauses',
      fidelity: 'practice_only',
      fidelityNote:
        'Untimed practice. It does not reproduce GRE timing, GRE section structure or GRE adaptive ' +
        'routing, and it produces no score on any GRE scale. Items are original and their ' +
        'difficulty labels are editorial, not ETS-calibrated.',
      parts: [
        {
          key: 'practice-set',
          sectionKey: 'verbal-1',
          label: 'Practice set',
          timeLimitSeconds: null,
          itemCount: 10,
          selection: {
            sectionKey: 'verbal-1',
            domains: [],
            skills: [],
            responseTypes: [],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 3. One timed blueprint per published section.
    // -----------------------------------------------------------------------
    {
      id: 'timed-analytical-writing',
      label: 'Timed: Analytical Writing (30 min)',
      mode: 'practice',
      description:
        'The published Analytical Writing section: one "Analyze an Issue" task in 30 minutes, typed ' +
        'in an editor with spellcheck and grammar check disabled.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real exam: one Analyze an Issue task, a 30-minute limit, and an editor ' +
        'restricted to insert, delete, cut-and-paste and undo with no spellchecker or grammar ' +
        'checker. What does NOT match: the prompt is original to us and is not drawn from the ETS ' +
        'Issue pool; the response is never auto-scored, because ETS publishes neither the e-rater ' +
        'feature weights nor the human/e-rater adjudication rule, so no 0–6 score is produced; and ' +
        'ETS publishes no word or character limit, so ours is a product choice.',
      parts: [
        {
          key: 'timed-analytical-writing-part',
          sectionKey: 'analytical-writing',
          label: 'Analytical Writing — Analyze an Issue (30 min)',
          timeLimitSeconds: 1800,
          itemCount: 1,
          selection: {
            sectionKey: 'analytical-writing',
            domains: ['aw-analyze-an-issue'],
            skills: [],
            responseTypes: ['essay'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
    },
    {
      id: 'timed-verbal-1',
      label: 'Timed: Verbal Reasoning Section 1 (12 q / 18 min)',
      mode: 'practice',
      description:
        'The published first Verbal Reasoning section: 12 questions in 18 minutes at average ' +
        'difficulty, with free forward and backward navigation, Mark/Review and a section review ' +
        'screen.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real exam: 12 questions, an 18-minute limit, the published intra-section ' +
        'navigation (move forward and backward, Mark and Review, change answers while time ' +
        'remains, a review screen listing every question), all-or-nothing scoring on multi-answer ' +
        'items, and no penalty for a wrong answer. What does NOT match: our items are original ' +
        'rather than ETS items; there are no pretest items; item difficulty is editorial, not ' +
        'IRT-calibrated, so "average difficulty" is our judgement and not an ETS calibration; ETS ' +
        'does not publish the per-section mix of Reading Comprehension, Text Completion and ' +
        'Sentence Equivalence items, so our mix is a product choice; and Select-in-Passage items ' +
        'are not yet deliverable.',
      parts: [
        {
          key: 'timed-verbal-1-part',
          sectionKey: 'verbal-1',
          label: 'Verbal Reasoning Section 1 (12 q / 18 min)',
          timeLimitSeconds: 1080,
          itemCount: 12,
          selection: {
            sectionKey: 'verbal-1',
            domains: [
              'verbal-reading-comprehension',
              'verbal-text-completion',
              'verbal-sentence-equivalence',
            ],
            skills: [],
            responseTypes: [],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
    },
    {
      id: 'timed-verbal-2',
      label: 'Timed: Verbal Reasoning Section 2 (15 q / 23 min)',
      mode: 'practice',
      description:
        'The published second Verbal Reasoning section: 15 questions in 23 minutes. On the real ' +
        'test this section\'s difficulty is chosen from performance on Verbal Section 1; here it is ' +
        'chosen by our own disclosed two-stage rule.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real exam: 15 questions, a 23-minute limit, the published intra-section ' +
        'navigation, all-or-nothing multi-answer scoring, no wrong-answer penalty, and the SHAPE of ' +
        'section-level adaptation (this section is harder or easier depending on the first Verbal ' +
        'section). What does NOT match: our items are original; there are no pretest items; ' +
        'difficulty is editorial, not IRT-calibrated; ETS publishes neither its routing statistic, ' +
        'the number of difficulty tiers it can choose from, nor its cut thresholds, so the routing ' +
        'rule applied here is ours and is not ETS\'s algorithm; and the per-section question-type ' +
        'mix is a product choice.',
      parts: [
        {
          key: 'timed-verbal-2-part',
          sectionKey: 'verbal-2',
          label: 'Verbal Reasoning Section 2 (15 q / 23 min)',
          timeLimitSeconds: 1380,
          itemCount: 15,
          selection: {
            sectionKey: 'verbal-2',
            domains: [
              'verbal-reading-comprehension',
              'verbal-text-completion',
              'verbal-sentence-equivalence',
            ],
            skills: [],
            responseTypes: [],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: {
            enabled: true,
            kind: 'threshold_two_stage',
            upperThreshold: 0.7,
            routesTo: {
              lower: 'verbal-2-standard-pool',
              upper: 'verbal-2-harder-pool',
            },
            disclosure:
              'ETS publishes that the second Verbal Reasoning section is section-level adaptive — ' +
              'its difficulty depends on your overall performance on the first Verbal section — but ' +
              'it does not publish the routing statistic, how many difficulty levels the second ' +
              'section can take, or the cut thresholds. The rule used here is OURS, not ETS\'s: if ' +
              'you answered 70% or more of the first Verbal section correctly, this section is drawn ' +
              'from our harder pool; otherwise it is drawn from our standard pool. The 70% figure is ' +
              'our editorial choice. Difficulty labels on our items are editorial and are not ' +
              'IRT-calibrated. When this section is run on its own, with no first Verbal section to ' +
              'route from, the standard pool is used.',
          },
        },
      ],
    },
    {
      id: 'timed-quant-1',
      label: 'Timed: Quantitative Reasoning Section 1 (12 q / 21 min)',
      mode: 'practice',
      description:
        'The published first Quantitative Reasoning section: 12 questions in 21 minutes at average ' +
        'difficulty, with the basic on-screen calculator available.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real exam: 12 questions, a 21-minute limit, the published intra-section ' +
        'navigation, the documented on-screen calculator behaviour including Transfer Display only ' +
        'on single-box Numeric Entry, the four published question types with Quantitative ' +
        'Comparison choices never reordered, value-based Numeric Entry grading, all-or-nothing ' +
        'multi-answer scoring and no wrong-answer penalty. What does NOT match: our items are ' +
        'original; there are no pretest items; difficulty is editorial, not IRT-calibrated; and ETS ' +
        'does not publish how many Quantitative Comparison or Data Interpretation items a section ' +
        'carries, so our mix is a product choice.',
      parts: [
        {
          key: 'timed-quant-1-part',
          sectionKey: 'quant-1',
          label: 'Quantitative Reasoning Section 1 (12 q / 21 min)',
          timeLimitSeconds: 1260,
          itemCount: 12,
          selection: {
            sectionKey: 'quant-1',
            domains: [
              'quant-arithmetic',
              'quant-algebra',
              'quant-geometry',
              'quant-data-analysis',
            ],
            skills: [],
            responseTypes: [],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
    },
    {
      id: 'timed-quant-2',
      label: 'Timed: Quantitative Reasoning Section 2 (15 q / 26 min)',
      mode: 'practice',
      description:
        'The published second Quantitative Reasoning section: 15 questions in 26 minutes with the ' +
        'on-screen calculator. On the real test this section\'s difficulty is chosen from ' +
        'performance on Quantitative Section 1; here it is chosen by our own disclosed two-stage ' +
        'rule.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real exam: 15 questions, a 26-minute limit, the published intra-section ' +
        'navigation, the documented on-screen calculator behaviour, the four published question ' +
        'types, all-or-nothing multi-answer scoring, no wrong-answer penalty, and the SHAPE of ' +
        'section-level adaptation. What does NOT match: our items are original; there are no ' +
        'pretest items; difficulty is editorial, not IRT-calibrated; ETS publishes neither its ' +
        'routing statistic, its tier count nor its thresholds, so the routing rule here is ours and ' +
        'not ETS\'s algorithm; and the per-section question-type mix is a product choice.',
      parts: [
        {
          key: 'timed-quant-2-part',
          sectionKey: 'quant-2',
          label: 'Quantitative Reasoning Section 2 (15 q / 26 min)',
          timeLimitSeconds: 1560,
          itemCount: 15,
          selection: {
            sectionKey: 'quant-2',
            domains: [
              'quant-arithmetic',
              'quant-algebra',
              'quant-geometry',
              'quant-data-analysis',
            ],
            skills: [],
            responseTypes: [],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: {
            enabled: true,
            kind: 'threshold_two_stage',
            upperThreshold: 0.7,
            routesTo: {
              lower: 'quant-2-standard-pool',
              upper: 'quant-2-harder-pool',
            },
            disclosure:
              'ETS publishes that the second Quantitative Reasoning section is section-level ' +
              'adaptive — its difficulty depends on your overall performance on the first ' +
              'Quantitative section — but it does not publish the routing statistic, how many ' +
              'difficulty levels the second section can take, or the cut thresholds. The rule used ' +
              'here is OURS, not ETS\'s: if you answered 70% or more of the first Quantitative ' +
              'section correctly, this section is drawn from our harder pool; otherwise it is drawn ' +
              'from our standard pool. The 70% figure is our editorial choice. Difficulty labels on ' +
              'our items are editorial and are not IRT-calibrated. When this section is run on its ' +
              'own, with no first Quantitative section to route from, the standard pool is used.',
          },
        },
      ],
    },

    // NOTE: there is deliberately no "simulation-full" blueprint. See
    // capabilities.fullSimulation for the reason.
  ],

  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: 0,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'Verbal Reasoning and Quantitative Reasoning scaled score (each measure reported separately)',
      min: 130,
      max: 170,
      increment: 1,
      note:
        'This records the real reported GRE scale as a fact about the exam; we do not produce a ' +
        'score on it. ETS reports Verbal Reasoning and Quantitative Reasoning 130–170 in one-point ' +
        'increments, each measure scaled separately, and reports Analytical Writing separately on a ' +
        '0–6 scale in half-point increments. NS (No Score) is reported for a measure in which no ' +
        'question was answered, and for an Analytical Writing response with no text whatsoever.',
    },
    scaledEstimate: {
      enabled: false,
      reason:
        'ETS converts a GRE raw score to the 130–170 scale "through a process known as equating", ' +
        'which also absorbs the difficulty difference introduced by section-level adaptation, and ' +
        'publishes no raw-to-scaled conversion table for any form, no equating model, no IRT item ' +
        'parameters and no account of how the delivered second section\'s difficulty is combined ' +
        'with the raw count. The Analytical Writing 0–6 score additionally depends on e-rater ' +
        'feature weights and a human/e-rater adjudication rule that are likewise unpublished. With ' +
        'none of those inputs available, any 130–170 or 0–6 figure we produced would be a ' +
        'fabrication, so we report raw correct counts and percent correct instead.',
    },
    notes: [
      'Raw score is the count of correct answers: "The raw score is the number of questions you ' +
        'answered correctly."',
      'No wrong-answer penalty: "Nothing is subtracted from your score for incorrect answers." An ' +
        'omitted question simply scores zero, so learners are coached to answer every question, ' +
        'matching ETS\'s own advice.',
      'All questions within a section contribute equally to the final score.',
      'No partial credit on any multi-answer item. Verbal select-one-or-more, Sentence Equivalence ' +
        'and multi-blank Text Completion are all scored all-or-nothing.',
      'A measure with no answered questions yields NS (No Score) rather than a numeric score.',
      'Analytical Writing responses are never auto-scored here. The ETS rubric is shown for ' +
        'self-assessment only.',
      'Percentile ranks are published by ETS only as summary statistics for a fixed reference ' +
        'window (test takers from 1 July 2022 through 30 June 2025) and not at raw-score ' +
        'granularity, so we ship no percentile lookup presented as ETS-equivalent.',
    ],
  },

  capabilities: {
    fullSimulation: {
      available: false,
      reason:
        'Per-section item counts and time limits are fully verified (30 / 18 / 23 / 21 / 26 ' +
        'minutes, 118 total), but three structural and navigational rules a full simulation needs ' +
        'are not. (1) SECTION ORDER: ETS states only that the Verbal and Quantitative sections ' +
        '"may appear in any order after the Analytical Writing section" and never says whether the ' +
        'two sections of a measure are delivered adjacently, so no canonical five-section sequence ' +
        'can be reproduced. (2) CROSS-SECTION NAVIGATION: ETS documents free navigation within a ' +
        'section but nowhere states that a completed section is locked; the lock our routing needs ' +
        'is a product decision, not a published rule. (3) BREAKS: no scheduled break is documented ' +
        'for the current five-section format, but ETS never affirmatively says there is none — the ' +
        'no-break configuration is evidenced only by the absence of any break text outside the ' +
        'pre-September-2023 block. Rather than ship a five-section simulation whose order, ' +
        'section-locking and break structure we would be guessing at, we ship each published ' +
        'section as its own timed blueprint with its real item count and time limit.',
    },
    adaptiveRouting: {
      available: true,
      note:
        'GRE adaptation is SECTION-level, not question-level: ETS publishes that the first section ' +
        'of each measure is of average difficulty and that "the computer selects the second ' +
        'operational section of a measure based on your performance on the first section". That ' +
        'shape can be reproduced honestly with a two-stage rule. What ETS does NOT publish — the ' +
        'routing statistic, how many difficulty tiers the second section can take, and the cut ' +
        'thresholds — we do not attempt to reproduce. Instead we apply our own transparent rule ' +
        '(70% or more correct on the first section of a measure routes the second section to our ' +
        'harder pool) and the UI discloses that it is our rule and not ETS\'s algorithm. Our ' +
        'difficulty labels are editorial and are not IRT-calibrated.',
    },
    scaledScoreEstimate: {
      available: false,
      reason:
        'No published raw-to-scale method exists for the GRE. ETS describes equating in prose but ' +
        'publishes no conversion table, no equating model, no IRT item parameters, no routing ' +
        'thresholds and no e-rater weights, so neither a 130–170 nor a 0–6 figure can be estimated ' +
        'defensibly. Raw correct counts and percent correct are the only outputs we report.',
    },
  },

  unverified: [
    'Whether a completed section is permanently locked. ETS documents free navigation WITHIN a ' +
      'section but never states that the taker cannot return to a prior section. Our cross-section ' +
      'lock is a product decision required for section-level routing and must not be presented to ' +
      'learners as an ETS rule.',
    'Whether the two sections of a measure are delivered adjacently. ETS says only that Verbal and ' +
      'Quantitative sections "may appear in any order after the Analytical Writing section", so no ' +
      'canonical AW-V-V-Q-Q order can be claimed.',
    'The section-level adaptive routing algorithm: the statistic computed from section 1, the ' +
      'number of distinct difficulty levels available for section 2, and the cut thresholds. Our ' +
      'two-stage 70% rule is our own and is disclosed as such.',
    'IRT item parameters and item-pool calibration. No exam-accurate difficulty estimate can be ' +
      'attached to a bank item; our difficulty labels are editorial.',
    'Raw-to-scaled conversion tables for the 130–170 scale. No accurate scaled score can be ' +
      'produced, so none is shown.',
    'How the raw count and the delivered second section\'s difficulty are combined into the scaled ' +
      'score.',
    'e-rater feature weights, the human/e-rater adjudication rule and the discrepancy threshold ' +
      'for Analytical Writing. Automated 0–6 essay scoring cannot be made exam-accurate and is not ' +
      'offered.',
    'Whether any scheduled break exists in the current five-section format. Evidenced by absence — ' +
      'the only "break" text on the ETS structure page belongs to the pre-September-2023 format — ' +
      'but never stated affirmatively by ETS.',
    'Whether a paper-delivered GRE General Test is still offered in 2026. The ETS Verbal Reasoning ' +
      'page still refers to a "paper-delivered test" when explaining Select-in-Passage; this ' +
      'appears to be legacy text and was not confirmed elsewhere, so no paper mode is built.',
    'The exact per-section mix of question types (how many Reading Comprehension vs Text ' +
      'Completion vs Sentence Equivalence items in a 12- or 15-question Verbal section; how many ' +
      'Quantitative Comparison vs Data Interpretation items in a Quantitative section). ETS ' +
      'publishes only that "about half" of Verbal is passage-based.',
    'Whether the on-screen calculator is technically unavailable in Verbal Reasoning and ' +
      'Analytical Writing. ETS scopes it to Quantitative but never states it is blocked elsewhere, ' +
      'so those sections are marked calculator: "unverified".',
    'Character or word limits for the Analytical Writing response, and whether the ETS word ' +
      'processor displays a word count.',
    'Select-in-Passage has no value in the shared responseType enum, so this genuine GRE Reading ' +
      'Comprehension format cannot yet be delivered; sections that publish it are shipped without ' +
      'it.',
  ],
};
