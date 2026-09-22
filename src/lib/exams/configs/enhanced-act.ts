import type {
  Blueprint,
  Domain,
  ExamConfig,
  NavigationPolicy,
  SectionConfig,
  SourceRef,
} from '@/lib/assessment/types';

/**
 * Enhanced ACT — 2026-2027 administration year.
 *
 * Every fact below is taken from content/exam-specs/_raw/enhanced-act.draft.json
 * (verified 2026-09-18). Nothing here is inferred from third-party prep material.
 *
 * Three things drive the shape of this config:
 *  1. The ACT is explicitly NOT adaptive in any mode, so adaptive routing is off
 *     and no part carries a routing rule.
 *  2. Per-section item counts and time limits are published and verified, but the
 *     enhanced-format BREAK durations are not — two official ACT sources conflict.
 *     That is why fullSimulation is unavailable and no "simulation-full" blueprint
 *     ships.
 *  3. Raw-to-scale conversion tables are form-specific and unpublished, so the
 *     1-36 scale is recorded as a fact about the exam only; we never produce a
 *     number on it.
 */

const VERIFIED_ON = '2026-09-18';

const DESIGN_FRAMEWORK_URL =
  'https://www.act.org/content/dam/act/unsecured/documents/R2519-Design-Framework-for-the-ACT-Enhancements-2026-02.pdf';
const EDUCATOR_GUIDE_URL =
  'https://www.act.org/content/dam/act/unsecured/documents/act-enhancements-educator-guide.pdf';
const SECTIONS_AND_STRUCTURE_URL =
  'https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/act-exam-sections-and-structure.html';
const STUDENT_TUTORIAL_URL =
  'https://www.act.org/content/dam/act/unsecured/documents/CBT-StudentTutorial-June.pdf';
const SCORING_KEY_URL =
  'https://www.act.org/content/dam/act/unsecured/documents/ACT-Ntl-Enhancements-Scoring-Key-and-Conversion-Tables.pdf';
const CALCULATOR_POLICY_URL =
  'https://www.act.org/content/dam/act/unsecured/documents/ACT-calculator-policy.pdf';
const UNDERSTANDING_SCORES_URL =
  'https://www.act.org/content/act/en/products-and-services/the-act/scores/understanding-your-scores.html';
const ENGLISH_DESCRIPTION_URL =
  'https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/description-of-english-test.html';
const MATH_DESCRIPTION_URL =
  'https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/description-of-math-test.html';
const READING_DESCRIPTION_URL =
  'https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/description-of-reading-test.html';
const SCIENCE_DESCRIPTION_URL =
  'https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/description-of-science-test.html';
const ENHANCEMENTS_URL =
  'https://www.act.org/content/act/en/products-and-services/the-act/test-changes/enhancements.html';
const K12_FAQ_URL =
  'https://www.act.org/content/act/en/products-and-services/the-act-educator/the-act-test/enhancements-k12/faqs.html';
const TEST_DATES_URL =
  'https://www.act.org/content/act/en/products-and-services/the-act/registration/test-dates.html';
const INTERNATIONAL_URL =
  'https://global.act.org/content/global/en/products-and-services/the-act-non-us/test-preparation/test-enhancements.html';

const sources: SourceRef[] = [
  {
    label: 'Design Framework for the ACT Enhancements (February 2026)',
    url: DESIGN_FRAMEWORK_URL,
    publisher: 'ACT Education Corp.',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'ACT Enhancements Educator Guide',
    url: EDUCATOR_GUIDE_URL,
    publisher: 'ACT Education Corp.',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'ACT exam sections and structure',
    url: SECTIONS_AND_STRUCTURE_URL,
    publisher: 'ACT',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'ACT online testing student tutorial (TestNav)',
    url: STUDENT_TUTORIAL_URL,
    publisher: 'ACT Education Corp.',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'ACT National Enhancements scoring key and conversion tables',
    url: SCORING_KEY_URL,
    publisher: 'ACT Education Corp.',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'ACT calculator policy (updated June 1, 2026)',
    url: CALCULATOR_POLICY_URL,
    publisher: 'ACT Education Corp.',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'Understanding your ACT scores',
    url: UNDERSTANDING_SCORES_URL,
    publisher: 'ACT',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'Description of the ACT English test',
    url: ENGLISH_DESCRIPTION_URL,
    publisher: 'ACT',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'Description of the ACT mathematics test',
    url: MATH_DESCRIPTION_URL,
    publisher: 'ACT',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'Description of the ACT reading test',
    url: READING_DESCRIPTION_URL,
    publisher: 'ACT',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'Description of the ACT science test',
    url: SCIENCE_DESCRIPTION_URL,
    publisher: 'ACT',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'ACT test enhancements overview',
    url: ENHANCEMENTS_URL,
    publisher: 'ACT',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'ACT enhancements K-12 educator FAQs',
    url: K12_FAQ_URL,
    publisher: 'ACT',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'ACT national test dates',
    url: TEST_DATES_URL,
    publisher: 'ACT',
    verifiedOn: VERIFIED_ON,
  },
  {
    label: 'ACT (non-US) test enhancements',
    url: INTERNATIONAL_URL,
    publisher: 'ACT',
    verifiedOn: VERIFIED_ON,
  },
];

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/**
 * Free movement WITHIN the open section, no movement between sections. Verified
 * from ACT's TestNav student tutorial: Next/Prev, a bottom navigation bar, an
 * item-navigation ("Nav") panel listing answered/flagged questions, changeable
 * answers, flagging that never affects scoring, and "You cannot end the test in
 * the middle of a section."
 */
const multipleChoiceNavigation: NavigationPolicy = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  allowReturnToPreviousPart: false,
  reviewScreen: true,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: STUDENT_TUTORIAL_URL,
};

/**
 * The writing prompt is a single item. ACT: "You cannot flag an essay question
 * for review." There is nothing to navigate between and no review list.
 */
const essayNavigation: NavigationPolicy = {
  allowBackWithinPart: false,
  allowForwardSkip: false,
  allowChangeAnswer: true,
  allowFlagForReview: false,
  allowReturnToPreviousPart: false,
  reviewScreen: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: STUDENT_TUTORIAL_URL,
};

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

const sections: SectionConfig[] = [
  {
    key: 'english',
    name: 'English',
    order: 1,
    officialQuestionCount: '50 administered (40 scored + 10 embedded field-test)',
    officialTimeMinutes: 35,
    calculator: 'none',
    calculatorNote:
      'Calculators may only be used on the mathematics test. Not permitted on English.',
    navigation: multipleChoiceNavigation,
    responseTypes: ['single_select'],
    notes: [
      'Core section. Contributes to the Composite score.',
      'Every item is four-option single-select. Items are grouped under shared prose passages; the enhanced format uses a mix of short and long passages, with at least one argumentative passage per form.',
      'Enhanced English items carry an explicit question stem rather than the legacy bare "NO CHANGE" format.',
      'Maximum raw score is 40; the 10 embedded field-test items are administered but not scored, and examinees are not told which ones they are.',
    ],
  },
  {
    key: 'math',
    name: 'Mathematics',
    order: 2,
    officialQuestionCount: '45 administered (41 scored + 4 embedded field-test)',
    officialTimeMinutes: 50,
    calculator: 'onscreen_and_personal',
    calculatorNote:
      'Permitted but never required — "all problems may be solved without a calculator". Online testing provides the Desmos on-screen calculator and examinees may still use a permitted personal calculator instead. Any 4-function, scientific or graphing model is allowed unless it is on ACT\'s prohibited list; computer algebra system (CAS) models are banned (e.g. TI-89/TI-92 model families, HP Prime, Casio ClassPad). No formula sheet is provided.',
    navigation: multipleChoiceNavigation,
    responseTypes: ['single_select'],
    notes: [
      'Core section. Contributes to the Composite score.',
      'Answer choices were reduced from five to four under the enhanced format. Any five-option ACT math item is stale legacy content.',
      'Preparing for Higher Math is the parent reporting category at 80% of scored items; its five sub-categories are modelled as separate domains here so shares are not double counted.',
      'Maximum raw score is 41; 4 embedded field-test items are unscored.',
    ],
  },
  {
    key: 'reading',
    name: 'Reading',
    order: 3,
    officialQuestionCount: '36 administered (27 scored + 9 embedded field-test)',
    officialTimeMinutes: 40,
    calculator: 'none',
    calculatorNote:
      'Calculators may only be used on the mathematics test. Not permitted on Reading.',
    navigation: multipleChoiceNavigation,
    responseTypes: ['single_select'],
    notes: [
      'Core section. Contributes to the Composite score.',
      'Literary and informational passages: two of roughly 750 standard words and one of roughly 650. Forms include a paired/synthesis element and visual or quantitative material. ACT does not publish a fixed passage count for the enhanced form.',
      'Maximum raw score is 27; 9 embedded field-test items are unscored.',
    ],
  },
  {
    key: 'science',
    name: 'Science (optional)',
    order: 4,
    officialQuestionCount: '40 administered (34 scored + 6 embedded field-test)',
    officialTimeMinutes: 40,
    calculator: 'none',
    calculatorNote:
      'Calculators may only be used on the mathematics test. Not permitted on Science.',
    navigation: multipleChoiceNavigation,
    responseTypes: ['single_select'],
    notes: [
      'OPTIONAL. Excluded from the Composite score under the enhanced format: "The science and writing sections are optional and do not affect your Composite score."',
      'Reported as its own 1-36 section score and feeds the STEM score (average of Mathematics and Science), which is awarded only if Science is taken.',
      'Data representation, research summaries and conflicting viewpoints stimuli with tables, graphs and diagrams; at least one engineering-and-design passage per enhanced form.',
      'Maximum raw score is 34; 6 embedded field-test items are unscored.',
      'For ACT State and District testing the decision to include Science rests with the state or district, not the individual student.',
    ],
  },
  {
    key: 'writing',
    name: 'Writing (optional essay)',
    order: 5,
    officialQuestionCount: '1 essay prompt',
    officialTimeMinutes: 40,
    calculator: 'not_applicable',
    calculatorNote: 'Calculators may only be used on the mathematics test.',
    navigation: essayNavigation,
    responseTypes: ['essay'],
    notes: [
      'OPTIONAL. Excluded from the Composite score. Scored 2-12 as the rounded average of four domain scores.',
      'Required, together with English and Reading, for the combined ELA score.',
      'ACT states the writing test did not change with the enhancements: "The design, timing, and scoring procedures are the same".',
      'Never auto-scored here. ACT publishes the domain rubrics but not the rater model, adjudication rules or any automated-scoring behaviour, so we offer rubric-guided self-assessment only.',
    ],
  },
];

// ---------------------------------------------------------------------------
// Domains (ACT reporting categories)
// ---------------------------------------------------------------------------

const domains: Domain[] = [
  // --- English -------------------------------------------------------------
  {
    slug: 'act-english-production-of-writing',
    name: 'Production of Writing (POW)',
    sectionKey: 'english',
    description:
      'Topic development and the organisation of a text: whether material serves the writer\'s purpose and whether a passage holds together.',
    officialShare: '38-43% of scored items',
    skills: [
      {
        slug: 'act-eng-pow-topic-development',
        name: 'Topic Development — Purpose and Focus',
        description: 'Judge whether material is relevant to and advances the purpose of the text.',
      },
      {
        slug: 'act-eng-pow-organization-unity-cohesion',
        name: 'Organization, Unity, and Cohesion',
        description: 'Order ideas, manage transitions and keep a passage unified.',
      },
    ],
    source: ENGLISH_DESCRIPTION_URL,
  },
  {
    slug: 'act-english-knowledge-of-language',
    name: 'Knowledge of Language (KLA)',
    sectionKey: 'english',
    description: 'Precise, concise and stylistically consistent use of language.',
    officialShare: '18-23% of scored items',
    skills: [
      {
        slug: 'act-eng-kla-expressing-ideas-clearly',
        name: 'Expressing Ideas Clearly',
        description: 'Precision and concision in word choice.',
      },
      {
        slug: 'act-eng-kla-style',
        name: 'Style',
        description: 'Consistency of style and tone across a passage.',
      },
    ],
    source: ENGLISH_DESCRIPTION_URL,
  },
  {
    slug: 'act-english-conventions-of-standard-english',
    name: 'Conventions of Standard English (CSE)',
    sectionKey: 'english',
    description:
      'Sentence structure, usage and punctuation. Reduced from the legacy 52-55% share under the enhanced format.',
    officialShare: '38-43% of scored items',
    skills: [
      {
        slug: 'act-eng-cse-sentence-structure-and-formation',
        name: 'Sentence Structure and Formation',
        description: 'Clause relationships, modifier placement, shifts in construction.',
      },
      {
        slug: 'act-eng-cse-usage-conventions',
        name: 'Usage Conventions',
        description: 'Agreement, pronoun use, verb forms, idiomatic usage.',
      },
      {
        slug: 'act-eng-cse-punctuation-conventions',
        name: 'Punctuation Conventions',
        description: 'Commas, apostrophes, semicolons, colons and dashes.',
      },
    ],
    source: ENGLISH_DESCRIPTION_URL,
  },

  // --- Mathematics ---------------------------------------------------------
  {
    slug: 'act-math-number-and-quantity',
    name: 'Preparing for Higher Math: Number and Quantity',
    sectionKey: 'math',
    description:
      'Sub-category of Preparing for Higher Math (PHM), which is 80% of scored math items in total.',
    officialShare: '10-12% of scored items',
    skills: [
      {
        slug: 'act-math-nq-rational-and-irrational-numbers',
        name: 'Rational and Irrational Numbers',
        description: 'Real number system, classification and operations.',
      },
      {
        slug: 'act-math-nq-properties-of-exponents',
        name: 'Properties of Exponents',
        description: 'Integer and rational exponents.',
      },
      {
        slug: 'act-math-nq-vectors-and-matrices',
        name: 'Vectors and Matrices',
        description: 'Vector and matrix representation and operations.',
      },
      {
        slug: 'act-math-nq-complex-numbers',
        name: 'Complex Numbers',
        description: 'Arithmetic with complex numbers.',
      },
      {
        slug: 'act-math-nq-quantities-and-units',
        name: 'Quantities and Units',
        description: 'Units, scale and dimensional reasoning.',
      },
    ],
    source: DESIGN_FRAMEWORK_URL,
  },
  {
    slug: 'act-math-algebra',
    name: 'Preparing for Higher Math: Algebra',
    sectionKey: 'math',
    description: 'Sub-category of Preparing for Higher Math (PHM).',
    officialShare: '17-20% of scored items',
    skills: [
      {
        slug: 'act-math-alg-linear',
        name: 'Linear Expressions, Equations, and Inequalities',
        description: 'Solve and interpret linear relationships.',
      },
      {
        slug: 'act-math-alg-quadratic',
        name: 'Quadratic Expressions, Equations, and Inequalities',
        description: 'Factoring, roots, vertex form and quadratic inequalities.',
      },
      {
        slug: 'act-math-alg-rational-and-radical',
        name: 'Rational and Radical Expressions and Equations',
        description: 'Simplify and solve rational and radical forms.',
      },
      {
        slug: 'act-math-alg-polynomial',
        name: 'Polynomial Expressions and Equations',
        description: 'Operations on and roots of polynomials.',
      },
      {
        slug: 'act-math-alg-systems',
        name: 'Systems of Equations and Inequalities',
        description: 'Solve systems algebraically and graphically.',
      },
      {
        slug: 'act-math-alg-representation',
        name: 'Representation of Expressions and Equations',
        description: 'Move between symbolic, tabular, graphical and verbal forms.',
      },
    ],
    source: DESIGN_FRAMEWORK_URL,
  },
  {
    slug: 'act-math-functions',
    name: 'Preparing for Higher Math: Functions',
    sectionKey: 'math',
    description: 'Sub-category of Preparing for Higher Math (PHM).',
    officialShare: '17-20% of scored items',
    skills: [
      {
        slug: 'act-math-fn-properties-of-functions',
        name: 'Properties of Functions',
        description: 'Domain, range, behaviour and notation.',
      },
      {
        slug: 'act-math-fn-composition-transformation-inverse',
        name: 'Function Composition, Transformation, and Inverse Functions',
        description: 'Build and manipulate functions from other functions.',
      },
      {
        slug: 'act-math-fn-sequences-and-series',
        name: 'Sequences and Series',
        description: 'Arithmetic and geometric sequences and their sums.',
      },
      {
        slug: 'act-math-fn-trigonometric-functions',
        name: 'Trigonometric Functions',
        description: 'Graphs, periodicity and identities.',
      },
      {
        slug: 'act-math-fn-exponential-and-logarithmic',
        name: 'Exponential and Logarithmic Functions',
        description: 'Growth and decay models, logarithmic laws.',
      },
    ],
    source: DESIGN_FRAMEWORK_URL,
  },
  {
    slug: 'act-math-geometry',
    name: 'Preparing for Higher Math: Geometry',
    sectionKey: 'math',
    description: 'Sub-category of Preparing for Higher Math (PHM).',
    officialShare: '17-20% of scored items',
    skills: [
      {
        slug: 'act-math-geo-congruence-and-similarity',
        name: 'Congruence and Similarity Relationships',
        description: 'Reason about congruent and similar figures.',
      },
      {
        slug: 'act-math-geo-surface-area-and-volume',
        name: 'Surface Area and Volume',
        description: 'Three-dimensional measurement.',
      },
      {
        slug: 'act-math-geo-triangles-and-circles',
        name: 'Triangles and Circles; Missing Values',
        description: 'Find missing lengths, angles and arc measures.',
      },
      {
        slug: 'act-math-geo-trigonometric-ratios',
        name: 'Trigonometric Ratios',
        description: 'Right-triangle trigonometry.',
      },
      {
        slug: 'act-math-geo-conic-sections',
        name: 'Equations of Conic Sections',
        description: 'Circles and other conics in the coordinate plane.',
      },
    ],
    source: MATH_DESCRIPTION_URL,
  },
  {
    slug: 'act-math-statistics-and-probability',
    name: 'Preparing for Higher Math: Statistics and Probability',
    sectionKey: 'math',
    description:
      'Sub-category of Preparing for Higher Math (PHM). ACT\'s "Initial Enhanced ACT Math Content Blueprint" table gives 10-12% for this category, but both the operational alignment table and ACT\'s public math description page give 12-15%; the 12-15% figure is the current specification.',
    officialShare: '12-15% of scored items',
    skills: [
      {
        slug: 'act-math-stat-center-and-spread',
        name: 'Center and Spread of Distributions',
        description: 'Mean, median, range and variability.',
      },
      {
        slug: 'act-math-stat-data-collection',
        name: 'Data Collection Methods',
        description: 'Sampling, study design and the conclusions they support.',
      },
      {
        slug: 'act-math-stat-bivariate-relationships',
        name: 'Relationships in Bivariate Data',
        description: 'Scatterplots, association and lines of best fit.',
      },
      {
        slug: 'act-math-stat-probability',
        name: 'Probability',
        description: 'Simple, compound and conditional probability.',
      },
    ],
    source: MATH_DESCRIPTION_URL,
  },
  {
    slug: 'act-math-integrating-essential-skills',
    name: 'Integrating Essential Skills (IES)',
    sectionKey: 'math',
    description:
      'Concepts typically learned before higher math, applied in more complex or multi-step settings.',
    officialShare: '20% of scored items',
    skills: [
      {
        slug: 'act-math-ies-rate-and-proportion',
        name: 'Rate and Proportion',
        description: 'Rates, ratios, percentages and proportional reasoning.',
      },
      {
        slug: 'act-math-ies-area',
        name: 'Area',
        description: 'Two-dimensional measurement in applied settings.',
      },
      {
        slug: 'act-math-ies-expressions-represent-quantities',
        name: 'Using Expressions to Represent Quantities',
        description: 'Translate situations into algebraic expressions.',
      },
      {
        slug: 'act-math-ies-equations-capture-relationships',
        name: 'Using Equations to Capture Relationships',
        description: 'Model relationships with equations and solve them.',
      },
      {
        slug: 'act-math-ies-rational-exponents',
        name: 'Rational Exponents',
        description: 'Interpret and compute with rational exponents.',
      },
      {
        slug: 'act-math-ies-basics-of-functions',
        name: 'Basics of Functions',
        description: 'Evaluate and interpret straightforward functions.',
      },
      {
        slug: 'act-math-ies-data-analysis',
        name: 'Data Analysis',
        description: 'Read and reason from tables and graphs.',
      },
    ],
    source: DESIGN_FRAMEWORK_URL,
  },
  {
    slug: 'act-math-modeling',
    name: 'Modeling (overlay category)',
    sectionKey: 'math',
    description:
      'An OVERLAY reporting category: "Each modeling item is also counted in the other appropriate reporting categories". Its share therefore does not sum to 100% with PHM and IES.',
    officialShare: 'greater than 20% of scored items (overlay, double-counted)',
    skills: [
      {
        slug: 'act-math-mod-producing',
        name: 'Producing Models',
        description: 'Build a model that represents a situation.',
      },
      {
        slug: 'act-math-mod-interpreting',
        name: 'Interpreting Models',
        description: 'Explain what a model says about the situation.',
      },
      {
        slug: 'act-math-mod-understanding',
        name: 'Understanding Models',
        description: 'Identify the structure and assumptions of a model.',
      },
      {
        slug: 'act-math-mod-evaluating',
        name: 'Evaluating Models',
        description: 'Judge how well a model fits its purpose.',
      },
      {
        slug: 'act-math-mod-improving',
        name: 'Improving Models',
        description: 'Refine a model in light of new information.',
      },
    ],
    source: DESIGN_FRAMEWORK_URL,
  },

  // --- Reading -------------------------------------------------------------
  {
    slug: 'act-reading-key-ideas-and-details',
    name: 'Key Ideas and Details (KID)',
    sectionKey: 'reading',
    description:
      'What the text says and implies. Reduced from the legacy 53-60% share under the enhanced format.',
    officialShare: '44-52% of scored items',
    skills: [
      {
        slug: 'act-read-kid-close-reading',
        name: 'Close Reading',
        description: 'Read and infer from explicit and implicit detail.',
      },
      {
        slug: 'act-read-kid-central-ideas-themes-summaries',
        name: 'Central Ideas, Themes, and Summaries',
        description: 'Identify main ideas and summarise accurately.',
      },
      {
        slug: 'act-read-kid-relationships',
        name: 'Relationships',
        description: 'Sequence, comparison, cause and effect.',
      },
    ],
    source: READING_DESCRIPTION_URL,
  },
  {
    slug: 'act-reading-craft-and-structure',
    name: 'Craft and Structure',
    sectionKey: 'reading',
    description: 'How a text is built and why the author made those choices.',
    officialShare: '26-33% of scored items',
    skills: [
      {
        slug: 'act-read-cs-word-meanings-and-word-choice',
        name: 'Word Meanings and Word Choice',
        description: 'Determine meaning in context and analyse diction.',
      },
      {
        slug: 'act-read-cs-text-structure',
        name: 'Text Structure',
        description: 'Analyse how parts of a text relate to the whole.',
      },
      {
        slug: 'act-read-cs-purpose-and-point-of-view',
        name: 'Purpose and Point of View',
        description: 'Identify authorial purpose and perspective.',
      },
    ],
    source: READING_DESCRIPTION_URL,
  },
  {
    slug: 'act-reading-integration-of-knowledge-and-ideas',
    name: 'Integration of Knowledge and Ideas (IKI)',
    sectionKey: 'reading',
    description: 'Evaluating arguments and drawing across multiple texts and representations.',
    officialShare: '19-26% of scored items',
    skills: [
      {
        slug: 'act-read-iki-arguments',
        name: 'Arguments',
        description: 'Analyse claims, evidence and reasoning.',
      },
      {
        slug: 'act-read-iki-synthesis-of-multiple-texts',
        name: 'Synthesis of Multiple Texts',
        description: 'Compare and integrate paired passages.',
      },
      {
        slug: 'act-read-iki-visual-and-quantitative-information',
        name: 'Visual and Quantitative Information',
        description:
          'Interpret graphics and quantitative material alongside prose. Category assignment inferred: ACT\'s source table does not assign this skill area to a reporting category unambiguously.',
      },
    ],
    source: READING_DESCRIPTION_URL,
  },

  // --- Science -------------------------------------------------------------
  {
    slug: 'act-science-interpretation-of-data',
    name: 'Interpretation of Data (IOD)',
    sectionKey: 'science',
    description: 'Reading and reasoning from scientific data presentations.',
    officialShare: '38-50% of scored items',
    skills: [
      {
        slug: 'act-sci-iod-manipulate-and-analyse-data',
        name: 'Manipulate and Analyse Scientific Data',
        description: 'Work with data in tables, graphs and diagrams.',
      },
      {
        slug: 'act-sci-iod-trends-and-relationships',
        name: 'Identify and Interpret Trends and Relationships',
        description: 'Detect patterns and dependencies in data.',
      },
      {
        slug: 'act-sci-iod-translate-representations',
        name: 'Translate Between Data Representations',
        description: 'Move between tables, graphs and diagrams.',
      },
      {
        slug: 'act-sci-iod-interpolate-and-extrapolate',
        name: 'Interpolate and Extrapolate from Data',
        description: 'Estimate values within and beyond the given range.',
      },
    ],
    source: SCIENCE_DESCRIPTION_URL,
  },
  {
    slug: 'act-science-scientific-investigation',
    name: 'Scientific Investigation (SIN)',
    sectionKey: 'science',
    description: 'Experimental tools, procedures and design.',
    officialShare: '18-32% of scored items',
    skills: [
      {
        slug: 'act-sci-sin-tools-procedures-design',
        name: 'Understand Experimental Tools, Procedures and Design',
        description: 'Identify variables, controls and method.',
      },
      {
        slug: 'act-sci-sin-compare-and-extend-experiments',
        name: 'Compare and Extend Experiments',
        description: 'Relate experiments to one another and extend them.',
      },
      {
        slug: 'act-sci-sin-predict-modified-results',
        name: 'Predict the Results of Modifying an Experiment',
        description: 'Reason about the effect of a change in procedure.',
      },
    ],
    source: SCIENCE_DESCRIPTION_URL,
  },
  {
    slug: 'act-science-evaluating-scientific-arguments-and-models',
    name: 'Evaluating Scientific Arguments and Models with Evidence (EMI)',
    sectionKey: 'science',
    description:
      'Renamed under the enhanced format from "Evaluation of Models, Inferences, and Experimental Results" but keeps the code EMI in ACT scoring keys.',
    officialShare: '24-38% of scored items',
    skills: [
      {
        slug: 'act-sci-emi-judge-credibility',
        name: 'Judge the Credibility of Scientific Information',
        description: 'Weigh the reliability of claims and sources.',
      },
      {
        slug: 'act-sci-emi-conclusions-and-predictions',
        name: 'Draw Conclusions and Make Predictions from Evidence',
        description: 'Infer beyond the stated results.',
      },
      {
        slug: 'act-sci-emi-compare-competing-models',
        name: 'Evaluate and Compare Competing Models, Hypotheses and Viewpoints',
        description: 'Adjudicate between conflicting scientific positions.',
      },
      {
        slug: 'act-sci-emi-integrate-background-knowledge',
        name: 'Integrate Scientific Background Knowledge with the Passage',
        description: 'Combine prior knowledge with passage evidence.',
      },
    ],
    source: SCIENCE_DESCRIPTION_URL,
  },

  // --- Writing -------------------------------------------------------------
  {
    slug: 'act-writing-essay-domains',
    name: 'Essay Domain Scores',
    sectionKey: 'writing',
    description:
      'Four domain scores, each 2-12, averaged and rounded to a single 2-12 Writing subject score. Rubrics are published; the rater model is not.',
    officialShare: null,
    skills: [
      {
        slug: 'act-write-ideas-and-analysis',
        name: 'Ideas and Analysis',
        description: 'Generate productive ideas and engage critically with multiple perspectives.',
      },
      {
        slug: 'act-write-development-and-support',
        name: 'Development and Support',
        description: 'Develop and support ideas with reasoning and illustration.',
      },
      {
        slug: 'act-write-organization',
        name: 'Organization',
        description: 'Organise ideas with clarity and purpose.',
      },
      {
        slug: 'act-write-language-use-and-conventions',
        name: 'Language Use and Conventions',
        description: 'Use language precisely and observe the conventions of standard English.',
      },
    ],
    source: SECTIONS_AND_STRUCTURE_URL,
  },
];

const englishDomains = [
  'act-english-production-of-writing',
  'act-english-knowledge-of-language',
  'act-english-conventions-of-standard-english',
];

const mathDomains = [
  'act-math-number-and-quantity',
  'act-math-algebra',
  'act-math-functions',
  'act-math-geometry',
  'act-math-statistics-and-probability',
  'act-math-integrating-essential-skills',
  'act-math-modeling',
];

const readingDomains = [
  'act-reading-key-ideas-and-details',
  'act-reading-craft-and-structure',
  'act-reading-integration-of-knowledge-and-ideas',
];

const scienceDomains = [
  'act-science-interpretation-of-data',
  'act-science-scientific-investigation',
  'act-science-evaluating-scientific-arguments-and-models',
];

// ---------------------------------------------------------------------------
// Blueprints
// ---------------------------------------------------------------------------

const MINUTE = 60;

/**
 * "simulation-full" is deliberately absent. ACT publishes per-section item counts,
 * time limits and within-section navigation, but not the enhanced-format break
 * durations, and two official ACT documents contradict each other on them. We do
 * not ship a full-length simulation we cannot deliver honestly.
 */
const blueprints: Blueprint[] = [
  {
    id: 'diagnostic',
    label: 'Enhanced ACT diagnostic',
    mode: 'diagnostic',
    description:
      'A 17-item skill check across English, Mathematics, Reading and Science, sampling every multiple-choice reporting category so you can see where to start.',
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_pauses',
    fidelity: 'practice_only',
    fidelityNote:
      'This is a short skill check, not a predictor of an ACT score. It is far shorter than any real section, the per-part clocks are deliberately generous (about 1.5x the real per-question pace), and no raw or 1-36 score is produced. The optional Writing essay is excluded because essays are never auto-scored and cannot contribute to a diagnostic skill profile.',
    parts: [
      {
        key: 'diagnostic-english',
        sectionKey: 'english',
        label: 'English check',
        timeLimitSeconds: 252,
        itemCount: 4,
        selection: {
          sectionKey: 'english',
          domains: englishDomains,
          skills: [],
          responseTypes: ['single_select'],
          difficultyMix: null,
          allowRepeatsWithinAttempt: false,
          avoidSeenWithinDays: 30,
        },
        navigationOverride: null,
        breakAfterSeconds: null,
        adaptive: null,
      },
      {
        key: 'diagnostic-math',
        sectionKey: 'math',
        label: 'Mathematics check',
        timeLimitSeconds: 500,
        itemCount: 5,
        selection: {
          sectionKey: 'math',
          domains: mathDomains,
          skills: [],
          responseTypes: ['single_select'],
          difficultyMix: null,
          allowRepeatsWithinAttempt: false,
          avoidSeenWithinDays: 30,
        },
        navigationOverride: null,
        breakAfterSeconds: null,
        adaptive: null,
      },
      {
        key: 'diagnostic-reading',
        sectionKey: 'reading',
        label: 'Reading check',
        timeLimitSeconds: 400,
        itemCount: 4,
        selection: {
          sectionKey: 'reading',
          domains: readingDomains,
          skills: [],
          responseTypes: ['single_select'],
          difficultyMix: null,
          allowRepeatsWithinAttempt: false,
          avoidSeenWithinDays: 30,
        },
        navigationOverride: null,
        breakAfterSeconds: null,
        adaptive: null,
      },
      {
        key: 'diagnostic-science',
        sectionKey: 'science',
        label: 'Science check (optional section)',
        timeLimitSeconds: 360,
        itemCount: 4,
        selection: {
          sectionKey: 'science',
          domains: scienceDomains,
          skills: [],
          responseTypes: ['single_select'],
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
    id: 'practice',
    label: 'Custom practice set',
    mode: 'practice',
    description:
      'A template for a 10-question untimed practice set. Section, domain, difficulty and length are all chosen by the learner at runtime; the values stored here are only the defaults.',
    timing: 'untimed',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_pauses',
    fidelity: 'practice_only',
    fidelityNote:
      'Practice only. Untimed, drawn from whichever part of the exam the learner selects, and in no way structured like a real ACT section. No score on any ACT scale is produced.',
    parts: [
      {
        key: 'practice-set',
        // Default only. The runtime overrides sectionKey along with domain,
        // difficulty and length when the learner builds the set.
        sectionKey: 'english',
        label: 'Practice questions',
        timeLimitSeconds: null,
        itemCount: 10,
        selection: {
          sectionKey: 'english',
          // Empty = any domain. Kept permissive so the runtime override is free.
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
  {
    id: 'timed-english',
    label: 'Timed English section (50 questions, 35 minutes)',
    mode: 'practice',
    description:
      'The full published English section: 50 administered questions in 35 minutes, with free movement, answer changes and flagging within the section.',
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote:
      'Matches the real exam: 50 administered questions, a 35-minute server-enforced limit, four-option single-select items, free forward/backward movement, changeable answers, flagging that does not affect scoring, and no exit before time is called. Does NOT match the real exam: our questions are original and were never pretested, difficulty is editorial rather than IRT-calibrated, there are no embedded field-test items so all 50 count toward your raw score here, and the passage mix is our own because ACT does not publish the short/long passage split or passage count.',
    parts: [
      {
        key: 'english-section',
        sectionKey: 'english',
        label: 'English',
        timeLimitSeconds: 35 * MINUTE,
        itemCount: 50,
        selection: {
          sectionKey: 'english',
          domains: englishDomains,
          skills: [],
          responseTypes: ['single_select'],
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
    id: 'timed-math',
    label: 'Timed Mathematics section (45 questions, 50 minutes)',
    mode: 'practice',
    description:
      'The full published Mathematics section: 45 administered questions in 50 minutes, four answer choices per question, calculator permitted but not required.',
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote:
      'Matches the real exam: 45 administered questions, a 50-minute server-enforced limit, four answer choices per item (reduced from five under the enhanced format), no formula sheet, calculator permitted, free movement and flagging within the section. Does NOT match the real exam: our questions are original and were never pretested, difficulty is editorial rather than IRT-calibrated, there are no embedded field-test items so all 45 count toward your raw score here, and the operational blueprint constraints ACT uses to assemble a form are proprietary.',
    parts: [
      {
        key: 'math-section',
        sectionKey: 'math',
        label: 'Mathematics',
        timeLimitSeconds: 50 * MINUTE,
        itemCount: 45,
        selection: {
          sectionKey: 'math',
          domains: mathDomains,
          skills: [],
          responseTypes: ['single_select'],
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
    id: 'timed-reading',
    label: 'Timed Reading section (36 questions, 40 minutes)',
    mode: 'practice',
    description:
      'The full published Reading section: 36 administered questions in 40 minutes across literary and informational passages.',
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote:
      'Matches the real exam: 36 administered questions, a 40-minute server-enforced limit, four-option single-select items, free movement, changeable answers and flagging within the section. Does NOT match the real exam: our passages and questions are original and were never pretested, difficulty is editorial rather than IRT-calibrated, there are no embedded field-test items so all 36 count toward your raw score here, and ACT does not publish a passage count for the enhanced form so our passage structure is our own.',
    parts: [
      {
        key: 'reading-section',
        sectionKey: 'reading',
        label: 'Reading',
        timeLimitSeconds: 40 * MINUTE,
        itemCount: 36,
        selection: {
          sectionKey: 'reading',
          domains: readingDomains,
          skills: [],
          responseTypes: ['single_select'],
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
    id: 'timed-science',
    label: 'Timed Science section (40 questions, 40 minutes)',
    mode: 'practice',
    description:
      'The full published optional Science section: 40 administered questions in 40 minutes. Science does not count toward the enhanced ACT Composite score.',
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote:
      'Matches the real exam: 40 administered questions, a 40-minute server-enforced limit, four-option single-select items over data-based stimuli, free movement and flagging within the section. Does NOT match the real exam: our passages and questions are original and were never pretested, difficulty is editorial rather than IRT-calibrated, there are no embedded field-test items so all 40 count toward your raw score here, and the enhanced-format split across data representation, research summaries and conflicting viewpoints is not published, so our passage mix is our own.',
    parts: [
      {
        key: 'science-section',
        sectionKey: 'science',
        label: 'Science',
        timeLimitSeconds: 40 * MINUTE,
        itemCount: 40,
        selection: {
          sectionKey: 'science',
          domains: scienceDomains,
          skills: [],
          responseTypes: ['single_select'],
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
    id: 'timed-writing',
    label: 'Timed Writing essay (1 prompt, 40 minutes)',
    mode: 'practice',
    description:
      'The full published optional Writing section: one argumentative prompt presenting three perspectives on a complex issue, in 40 minutes. Writing does not count toward the Composite score.',
    timing: 'per_part',
    overallTimeLimitSeconds: null,
    pauseBehaviour: 'clock_runs',
    fidelity: 'approximation',
    fidelityNote:
      'Matches the real exam: one prompt, a 40-minute server-enforced limit, the three-perspectives task format, and no flagging (ACT does not allow an essay to be flagged for review). Does NOT match the real exam: the prompt is original, and your essay is NOT scored. ACT publishes the four domain rubrics but not the rater model, adjudication rules or automated-scoring behaviour, so we show the rubrics for self-assessment and never report a 2-12 Writing score.',
    parts: [
      {
        key: 'writing-section',
        sectionKey: 'writing',
        label: 'Writing',
        timeLimitSeconds: 40 * MINUTE,
        itemCount: 1,
        selection: {
          sectionKey: 'writing',
          domains: ['act-writing-essay-domains'],
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
];

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export const enhancedActConfig: ExamConfig = {
  examKey: 'enhanced-act',
  version: '2026.09',
  name: 'The ACT (Enhanced ACT)',
  shortName: 'ACT',
  publisher: 'ACT Education Corp.',
  versionLabel:
    'Enhanced ACT — 2026-2027 administration year (national online + national paper; state/district from spring 2026)',
  admissionsCycle:
    '2026-2027 national test dates: September 19, 2026; October 17, 2026; December 12, 2026; February 27, 2027; April 10, 2027; June 12, 2027; July 10, 2027.',
  verifiedOn: VERIFIED_ON,
  audience: ['undergraduate'],
  summary:
    'The Enhanced ACT is a fixed-form, non-adaptive multiple-choice test with three core sections — English, Mathematics and Reading — plus an optional Science section and an optional Writing essay. The core test is 131 administered questions in 125 minutes, of which 108 are scored and 23 are embedded unscored field-test items; adding Science gives 171 administered questions (142 scored) in 165 minutes. Every section is scaled 1-36, and under the enhanced format the Composite is the rounded average of English, Mathematics and Reading only: Science feeds a separate STEM score and Writing (2-12) feeds an ELA score. Math answer choices were reduced from five to four, calculators are permitted on Mathematics only, and there is no penalty for wrong answers.',
  sources,
  sections,
  domains,
  blueprints,
  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: 0,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'ACT Composite (1-36)',
      min: 1,
      max: 36,
      increment: 1,
      note:
        'Each section generates a 1-36 scale score. Under the enhanced format the Composite is the average of the English, Mathematics and Reading scale scores only, rounded to the nearest whole number (fractions below one-half round down, one-half or more round up). Science is reported separately on 1-36 and is excluded from the Composite; the optional Writing test is reported separately on 2-12. This records the real reported scale as a fact about the exam — we do not produce a score on it.',
    },
    scaledEstimate: {
      enabled: false,
      reason:
        'ACT converts each section raw score to the 1-36 scale using a FORM-SPECIFIC conversion table built from unpublished equating methodology and item-level IRT parameters. ACT publishes conversion tables only for particular released practice forms, and those tables are valid for those forms alone — they cannot be applied to an original question bank. With no published raw-to-scale method there is no defensible way to estimate a section score, a Composite, a STEM score or an ELA score, so we report raw score, percent correct, per-reporting-category accuracy and pacing instead. ACT percentile ranks and national norms for the enhanced Composite are likewise not published and are suppressed entirely.',
    },
    notes: [
      'Raw score is the count of correct answers: "The number of questions you answered correctly on each test section is a raw score."',
      'There is no penalty for incorrect answers and no penalty for guessing. Omitted answers score zero — neither penalised nor rewarded — but are tracked separately from wrong answers for analytics.',
      'Maximum raw scores under the enhanced format are the scored-item counts: English 40, Mathematics 41, Reading 27, Science 34. Embedded field-test items are excluded from scoring.',
      'Reporting-category subscores are the sum of correct answers within each category code: English POW + KLA + CSE = 40; Mathematics PHM + IES = 41; Science IOD + SIN + EMI = 34.',
      'The Mathematics Modeling category is an overlay: each modeling item is also counted in its content reporting category, so category shares do not sum to 100%.',
      'STEM score = average of Mathematics and Science, awarded only if the optional Science section is taken. ELA score requires English, Reading and the optional Writing section.',
      'Superscore Composite is also English/Mathematics/Reading only. Science superscores are still reported and still feed STEM, but not the Superscore Composite.',
      'Writing is scored 2-12 as the rounded average of four domain scores (Ideas and Analysis, Development and Support, Organization, Language Use and Conventions). We never auto-score an essay; the rubrics are shown for self-assessment.',
      'Our sectional practice contains no embedded field-test items, so every administered question counts toward the raw score we report. Real ACT raw scores exclude 10 English, 4 Mathematics, 9 Reading and 6 Science items.',
    ],
  },
  capabilities: {
    fullSimulation: {
      available: false,
      reason:
        'Per-section item counts, time limits and within-section navigation are all published and verified, and the exam is not adaptive — but the enhanced-format BREAK structure is not published, and two official ACT documents contradict each other on it. ACT\'s February 2026 design framework describes only "a short break" after Reading before the optional sections and another before Writing, with no durations given, while ACT\'s own online student tutorial still states the legacy pattern of a 15-minute break after mathematics and a 5-minute break after science. A full-length simulation is defined by its end-to-end timing, and we will not invent break durations or hard-code a legacy pattern ACT has superseded. Separately, the verified navigation rules come from the online TestNav tutorial only; no official statement was located for the paper administration. Sectional timed practice with real counts, real limits and real within-section navigation is offered instead.',
    },
    adaptiveRouting: {
      available: false,
      reason:
        'The ACT is explicitly and deliberately not adaptive in any delivery mode: "While the ACT can be taken online, it is not a computer-adaptive test." Computer-adaptive testing was ruled out during the enhancement design because it would make paper and online modes non-equivalent. There is no routing, no module selection and no difficulty adaptation to approximate, so simulated adaptive routing is switched off for this exam. Embedded field-test items sit in fixed slots within a given form and move between forms, not within an administration.',
    },
    scaledScoreEstimate: {
      available: false,
      reason:
        'ACT does not publish a raw-to-scale conversion method. Conversion tables are form-specific, and the equating methodology and item-level IRT parameters behind them are proprietary, so no 1-36 section score, Composite, STEM or ELA score can be estimated from an original question bank.',
    },
  },
  unverified: [
    'Exact duration of the "short break" between Reading and the optional Science/Writing sections on national test dates, and whether any break exists between Mathematics and Reading under the enhanced format. ACT\'s online student tutorial still describes the legacy pattern (15-minute break after mathematics, 5-minute break after science), which contradicts the February 2026 design framework. Exam-accurate break timing is disabled; no blueprint schedules a timed break.',
    'Whether the paper (offline) administration permits the same free within-section navigation and review as the online TestNav interface. The navigation rules encoded here come from the online student tutorial; no official statement was located for paper. Navigation is therefore not presented as mode-specific.',
    'The exact split of English items between short and long passages, and the number of passages per English form. ACT states the enhanced English test features "a mix of short and long essays" but does not publish the counts.',
    'Number of Reading passages per form. ACT confirms passage lengths (two of roughly 750 standard words, one of roughly 650) and a paired/synthesis element, but does not state a fixed passage count for the enhanced form.',
    'Number of Science passages per form and the enhanced-format split across Data Representation / Research Summaries / Conflicting Viewpoints. The 25-35% / 45-60% / 15-20% figures on ACT\'s science description page are not restated in the February 2026 design framework and may be legacy.',
    'Placement of the Reading skill area "Visual and Quantitative Information" under a specific reporting category. ACT\'s source table does not assign it unambiguously; it is filed under Integration of Knowledge and Ideas here as an inference.',
    'Raw-to-scale conversion tables, the equating/pre-equating methodology and the item-level IRT parameters behind them. Published only for specific released practice forms, never in general.',
    'The operational blueprint constraints ACT uses to assemble a form (difficulty targets, depth-of-knowledge distribution, passage-type mix beyond the published percentage ranges, matrix-sampling tier assignments).',
    'The positions of embedded field-test items within an operational form. ACT says they are "placed strategically throughout the section tests" but does not disclose the placement rule; the clustering seen in one released practice form is form-specific.',
    'Writing essay scoring beyond the published domain rubrics: the rater model, adjudication rules and any automated-scoring engine behaviour are not documented in a way that permits replication.',
    'Percentile ranks and national norms for the enhanced Composite. Not published in the sources verified, so ACT percentiles are never displayed.',
    'Whether Science can be selected or deselected after registration, and the precise registration-time mechanics for choosing Science/Writing on national test dates.',
    'Accommodation timing multipliers (50% / 100% extended time) under the enhanced format.',
    'Whether international (non-US) test dates in the 2026-2027 cycle are offered in both paper and online modes, and what the February 2026 "additional enhancements for international test takers" consist of.',
  ],
};
