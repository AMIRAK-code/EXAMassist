import type { ExamConfig, NavigationPolicy } from '@/lib/assessment/types';

/**
 * Digital SAT (Bluebook two-stage adaptive), 2026-27 testing year.
 *
 * Every fact below comes from content/exam-specs/_raw/digital-sat.draft.json,
 * verified against College Board sources on 2026-09-18.
 *
 * Modelling decision: the four separately timed MODULES are the config's
 * sections, because timing, navigation and the module lock are all defined at
 * module level. The two reported sections (Reading and Writing, Math) are each
 * a pair of these module sections.
 */

const DIRECTIONS_PDF = 'https://satsuite.collegeboard.org/media/pdf/english-sat-test-directions-bb.pdf';
const FRAMEWORK_PDF = 'https://satsuite.collegeboard.org/media/pdf/assessment-framework-for-digital-sat-suite.pdf';
const SPEC_OVERVIEW_PDF = 'https://satsuite.collegeboard.org/media/pdf/digital-sat-test-spec-overview.pdf';
const WHAT_TO_EXPECT = 'https://satsuite.collegeboard.org/sat/what-to-bring-do/what-to-expect';
const STRUCTURE_PAGE = 'https://satsuite.collegeboard.org/sat/whats-on-the-test/structure';
const CALCULATOR_PAGE = 'https://satsuite.collegeboard.org/sat/whats-on-the-test/math/calculator-use';
const HOW_SCORES_CALCULATED = 'https://satsuite.collegeboard.org/scores/what-scores-mean/how-scores-calculated';
const BLUEBOOK_TOOLS = 'https://bluebook.collegeboard.org/students/tools';

/**
 * Identical for all four modules: free navigation inside the module, hard
 * one-way lock between modules ("Once you move on from any module, you cannot
 * return to it."). Enforced server-side — a resumed attempt must not be able to
 * re-enter a submitted module.
 */
const MODULE_NAVIGATION: NavigationPolicy = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  allowReturnToPreviousPart: false,
  reviewScreen: true,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: DIRECTIONS_PDF,
};

const RW_MODULE_SECONDS = 32 * 60; // 1920
const MATH_MODULE_SECONDS = 35 * 60; // 2100
const SECTION_BREAK_SECONDS = 10 * 60; // 600

/**
 * Our own routing rule for the second-stage module. College Board does not
 * publish the numeric cut score — only that the break point sits "around the
 * median" section score and that roughly half of test takers route each way.
 * 0.6 correct on the routing module is OUR threshold, stored with the attempt
 * so a resume replays the same panel, and labelled as ours everywhere.
 */
const ROUTING_UPPER_THRESHOLD = 0.6;

const ROUTING_DISCLOSURE =
  'Module-level (two-stage) routing is how the real Digital SAT works: your first module decides ' +
  'whether the second module is the higher- or lower-difficulty panel. The threshold used here ' +
  '(60% correct on the routing module) is OURS, not College Board\'s. College Board publishes only ' +
  'that its break point sits around the median section score and that roughly half of test takers ' +
  'route each way; the actual cut score, the IRT parameters and the difficulty mix of each panel ' +
  'are not published.';

const PRETEST_NOTE =
  'The real exam embeds 2 unscored pretest questions in every module (25 operational + 2 pretest in ' +
  'each Reading and Writing module, 20 + 2 in each Math module). College Board does not publish where ' +
  'in the module they sit, so we do not reproduce them: every question we deliver is scored.';

const ORIGINAL_ITEMS_NOTE =
  'Our questions are original and written to the published framework; they are not College Board items, ' +
  'no pretest (unscored) items are included, and our difficulty labels are editorial, not IRT-calibrated.';

export const digitalSatConfig: ExamConfig = {
  examKey: 'digital-sat',
  version: '2026.09',
  name: 'SAT (Digital SAT)',
  shortName: 'SAT',
  publisher: 'College Board',
  versionLabel:
    'Digital SAT, Bluebook two-stage adaptive (2026-27 testing year / 2026-27 admissions cycle)',
  admissionsCycle: '2026-27',
  verifiedOn: '2026-09-18',
  audience: ['undergraduate'],
  summary:
    'Two sections delivered in College Board\'s Bluebook app, each split into two separately timed ' +
    'modules: Reading and Writing (2 x 27 questions / 32 minutes = 54 questions in 64 minutes) and ' +
    'Math (2 x 22 questions / 35 minutes = 44 questions in 70 minutes) — 98 administered questions in ' +
    '134 minutes, plus one 10-minute break between the two sections. Adaptivity is at module level ' +
    'only: performance on the first (routing) module of a section decides whether the second module is ' +
    'the higher- or lower-difficulty panel, which is why navigation inside a module is completely free. ' +
    'Once a module is left it can never be reopened. Two of the 27 (or 22) questions in each module are ' +
    'unscored pretest items. Scores are 400-1600 total and 200-800 per section, produced by IRT ability ' +
    'estimation rather than a raw-to-scale table.',

  sources: [
    {
      label: 'SAT test structure: two sections, module timing and the 10-minute break',
      url: STRUCTURE_PAGE,
      publisher: 'College Board',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Bluebook test directions (Fall 2026): module counts, module lock, auto-advance, SPR entry rules',
      url: DIRECTIONS_PDF,
      publisher: 'College Board',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Assessment Framework for the Digital SAT Suite: multistage adaptive design, operational vs pretest counts, domain distribution',
      url: FRAMEWORK_PDF,
      publisher: 'College Board',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Digital SAT test specifications overview: per-module minutes, response format split, score scale',
      url: SPEC_OVERVIEW_PDF,
      publisher: 'College Board',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'How SAT scores are calculated: IRT scoring, pretest questions, no guessing penalty',
      url: HOW_SCORES_CALCULATED,
      publisher: 'College Board',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'What to expect on test day: separately timed modules, free within-module navigation, no return to a finished module',
      url: WHAT_TO_EXPECT,
      publisher: 'College Board',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Calculator use: calculator permitted on the entire Math section, embedded Desmos plus approved handheld',
      url: CALCULATOR_PAGE,
      publisher: 'College Board',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Bluebook testing tools: Mark for Review, question menu, option eliminator, timer alert, reference sheet',
      url: BLUEBOOK_TOOLS,
      publisher: 'College Board',
      verifiedOn: '2026-09-18',
    },
  ],

  sections: [
    {
      key: 'rw-module-1',
      name: 'Reading and Writing — Module 1 (routing module)',
      order: 0,
      officialQuestionCount: '27 administered (25 operational + 2 pretest/unscored)',
      officialTimeMinutes: 32,
      calculator: 'none',
      calculatorNote:
        'No calculator permitted: "You may not use a calculator while working on the Reading and Writing section."',
      navigation: MODULE_NAVIGATION,
      responseTypes: ['single_select'],
      notes: [
        'Every question is four-option multiple choice with a single best answer.',
        'All questions are discrete: each carries its own 25-150 word passage or passage pair. There are no passage sets.',
        'Routing module: the same broad easy/medium/hard mix for every test taker, drawn from all four Reading and Writing domains.',
        'When the timer reaches zero the test taker is advanced automatically; unused time does not roll over.',
        'No break after this module — the test taker proceeds straight to Module 2.',
      ],
    },
    {
      key: 'rw-module-2',
      // Same content domains as rw-module-1; questions are tagged there.
      poolSectionKey: 'rw-module-1',
      name: 'Reading and Writing — Module 2 (second-stage adaptive module)',
      order: 1,
      officialQuestionCount: '27 administered (25 operational + 2 pretest/unscored)',
      officialTimeMinutes: 32,
      calculator: 'none',
      calculatorNote: 'No calculator permitted on the Reading and Writing section.',
      navigation: MODULE_NAVIGATION,
      responseTypes: ['single_select'],
      notes: [
        'Bluebook delivers one of two prebuilt second-stage panels — one averaging higher difficulty, one lower — based on Module 1 performance. Both contain easy, medium and hard questions in differing proportions.',
        'The numeric routing cut score is not published; College Board states only that roughly half of test takers route to each panel.',
        'Module 1 can never be reopened from here.',
        'A 10-minute break follows this module, before the Math section.',
      ],
    },
    {
      key: 'math-module-1',
      name: 'Math — Module 1 (routing module)',
      order: 2,
      officialQuestionCount: '22 administered (20 operational + 2 pretest/unscored)',
      officialTimeMinutes: 35,
      calculator: 'onscreen_and_personal',
      calculatorNote:
        'A calculator is permitted for every question. Bluebook embeds a Desmos calculator with graphing and scientific modes (draggable and, from 2026-27, resizable); the test taker may instead or additionally use an approved non-CAS handheld. A formula reference sheet is available throughout the Math section.',
      navigation: MODULE_NAVIGATION,
      responseTypes: ['single_select', 'numeric_entry'],
      notes: [
        'Roughly 75% four-option multiple choice and 25% student-produced response (numeric entry).',
        'Student-produced response entry: up to 5 characters for a positive answer, 6 with a leading negative sign; fractions use a slash; mixed numbers must be entered as an improper fraction or decimal; no percent, comma or dollar signs; a decimal that does not fit is truncated or rounded at the fourth digit.',
        'An SPR question may have more than one acceptable answer, but only one is entered.',
        'Routing module: broad, fixed easy/medium/hard mix drawn from all four Math domains.',
        'Approximately 30% of Math questions are set in a real-world, science or social-science context.',
        'No break after this module — the test taker proceeds straight to Module 2.',
      ],
    },
    {
      key: 'math-module-2',
      // Same content domains as math-module-1; questions are tagged there.
      poolSectionKey: 'math-module-1',
      name: 'Math — Module 2 (second-stage adaptive module)',
      order: 3,
      officialQuestionCount: '22 administered (20 operational + 2 pretest/unscored)',
      officialTimeMinutes: 35,
      calculator: 'onscreen_and_personal',
      calculatorNote:
        'Identical to Math Module 1: "Use of a calculator is permitted for all questions." There is no no-calculator portion on the Digital SAT.',
      navigation: MODULE_NAVIGATION,
      responseTypes: ['single_select', 'numeric_entry'],
      notes: [
        'Bluebook delivers a higher- or lower-difficulty second-stage Math panel based on Math Module 1 performance. The routing threshold is not published.',
        'No earlier module — Math Module 1 or either Reading and Writing module — can be reopened.',
        'The test ends after this module.',
      ],
    },
  ],

  domains: [
    {
      slug: 'information-and-ideas',
      name: 'Information and Ideas',
      sectionKey: 'rw-module-1',
      description:
        'Comprehension, analysis and synthesis of information, including quantitative information presented in tables and graphs. Appears in BOTH Reading and Writing modules; sectionKey names the routing module because this config models each timed module as a section.',
      officialShare: '~26% of the 50 operational Reading and Writing questions (12-14 questions)',
      skills: [
        { slug: 'central-ideas-and-details', name: 'Central Ideas and Details', description: 'Identify the main idea of a text and the details that support it.' },
        { slug: 'command-of-evidence-textual', name: 'Command of Evidence: Textual', description: 'Choose the textual evidence that best supports or weakens a claim.' },
        { slug: 'command-of-evidence-quantitative', name: 'Command of Evidence: Quantitative', description: 'Use data from a table or graph as evidence for a claim.' },
        { slug: 'inferences', name: 'Inferences', description: 'Complete a text with the most logical inference drawn from it.' },
      ],
      source: FRAMEWORK_PDF,
    },
    {
      slug: 'craft-and-structure',
      name: 'Craft and Structure',
      sectionKey: 'rw-module-1',
      description:
        'Vocabulary in context, rhetorical purpose and structure, and connections across paired texts. Appears in both Reading and Writing modules.',
      officialShare: '~28% of the 50 operational Reading and Writing questions (13-15 questions)',
      skills: [
        { slug: 'words-in-context', name: 'Words in Context', description: 'Determine the most logical and precise word or phrase for a context.' },
        { slug: 'text-structure-and-purpose', name: 'Text Structure and Purpose', description: 'Analyse the overall structure of a text and the function of a part of it.' },
        { slug: 'cross-text-connections', name: 'Cross-Text Connections', description: 'Compare the perspectives of two related texts.' },
      ],
      source: FRAMEWORK_PDF,
    },
    {
      slug: 'expression-of-ideas',
      name: 'Expression of Ideas',
      sectionKey: 'rw-module-1',
      description:
        'Revision of texts to improve effectiveness of expression and to meet a stated rhetorical goal. Appears in both Reading and Writing modules.',
      officialShare: '~20% of the 50 operational Reading and Writing questions (8-12 questions)',
      skills: [
        { slug: 'rhetorical-synthesis', name: 'Rhetorical Synthesis', description: 'Use given notes to accomplish a specified rhetorical goal.' },
        { slug: 'transitions', name: 'Transitions', description: 'Choose the transition that best expresses the logical relationship between ideas.' },
      ],
      source: FRAMEWORK_PDF,
    },
    {
      slug: 'standard-english-conventions',
      name: 'Standard English Conventions',
      sectionKey: 'rw-module-1',
      description:
        'Editing of texts to conform to the conventions of Standard English sentence structure, usage and punctuation. Appears in both Reading and Writing modules.',
      officialShare: '~26% of the 50 operational Reading and Writing questions (11-15 questions)',
      skills: [
        { slug: 'boundaries', name: 'Boundaries', description: 'Punctuate sentence and clause boundaries correctly.' },
        { slug: 'form-structure-and-sense', name: 'Form, Structure, and Sense', description: 'Apply conventions of usage, agreement and verb form.' },
      ],
      source: FRAMEWORK_PDF,
    },
    {
      slug: 'algebra',
      name: 'Algebra',
      sectionKey: 'math-module-1',
      description:
        'Linear equations, functions, systems and inequalities. Appears in both Math modules.',
      officialShare: '~35% of the 40 operational Math questions (13-15 questions)',
      skills: [
        { slug: 'linear-equations-one-variable', name: 'Linear equations in one variable', description: '' },
        { slug: 'linear-equations-two-variables', name: 'Linear equations in two variables', description: '' },
        { slug: 'linear-functions', name: 'Linear functions', description: '' },
        { slug: 'systems-of-two-linear-equations', name: 'Systems of two linear equations in two variables', description: '' },
        { slug: 'linear-inequalities', name: 'Linear inequalities in one or two variables', description: '' },
      ],
      source: FRAMEWORK_PDF,
    },
    {
      slug: 'advanced-math',
      name: 'Advanced Math',
      sectionKey: 'math-module-1',
      description:
        'Equivalent expressions and nonlinear equations, systems and functions. Appears in both Math modules.',
      officialShare: '~35% of the 40 operational Math questions (13-15 questions)',
      skills: [
        { slug: 'equivalent-expressions', name: 'Equivalent expressions', description: '' },
        { slug: 'nonlinear-equations-and-systems', name: 'Nonlinear equations in one variable and systems of equations in two variables', description: '' },
        { slug: 'nonlinear-functions', name: 'Nonlinear functions', description: '' },
      ],
      source: FRAMEWORK_PDF,
    },
    {
      slug: 'problem-solving-and-data-analysis',
      name: 'Problem-Solving and Data Analysis',
      sectionKey: 'math-module-1',
      description:
        'Quantitative reasoning about ratios, rates, percentages, distributions, probability and statistical claims. Appears in both Math modules.',
      officialShare: '~15% of the 40 operational Math questions (5-7 questions)',
      skills: [
        { slug: 'ratios-rates-proportions-units', name: 'Ratios, rates, proportional relationships, and units', description: '' },
        { slug: 'percentages', name: 'Percentages', description: '' },
        { slug: 'one-variable-data', name: 'One-variable data: distributions and measures of center and spread', description: '' },
        { slug: 'two-variable-data', name: 'Two-variable data: models and scatterplots', description: '' },
        { slug: 'probability-and-conditional-probability', name: 'Probability and conditional probability', description: '' },
        { slug: 'inference-from-sample-statistics', name: 'Inference from sample statistics and margin of error', description: '' },
        { slug: 'evaluating-statistical-claims', name: 'Evaluating statistical claims: observational studies and experiments', description: '' },
      ],
      source: FRAMEWORK_PDF,
    },
    {
      slug: 'geometry-and-trigonometry',
      name: 'Geometry and Trigonometry',
      sectionKey: 'math-module-1',
      description:
        'Area and volume, lines and angles, triangles, right-triangle trigonometry and circles. Appears in both Math modules.',
      officialShare: '~15% of the 40 operational Math questions (5-7 questions)',
      skills: [
        { slug: 'area-and-volume', name: 'Area and volume', description: '' },
        { slug: 'lines-angles-and-triangles', name: 'Lines, angles, and triangles', description: '' },
        { slug: 'right-triangles-and-trigonometry', name: 'Right triangles and trigonometry', description: '' },
        { slug: 'circles', name: 'Circles', description: '' },
      ],
      source: SPEC_OVERVIEW_PDF,
    },
  ],

  blueprints: [
    {
      id: 'diagnostic',
      label: 'Digital SAT diagnostic (16 questions)',
      mode: 'diagnostic',
      description:
        'A short skill check across all four Digital SAT modules and all eight content domains: four questions per module, generously timed, to show where to start.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_pauses',
      fidelity: 'practice_only',
      fidelityNote:
        'This is a short skill check, not a predictor of an SAT score. It is far shorter than the real exam, is not adaptive, and the time allowed per question is about 1.5x the real exam\'s pace. It produces per-domain accuracy only — never a 400-1600 estimate.',
      parts: [
        {
          key: 'diagnostic-rw-1',
          sectionKey: 'rw-module-1',
          label: 'Reading and Writing sample A',
          timeLimitSeconds: 420,
          itemCount: 4,
          selection: {
            sectionKey: 'rw-module-1',
            domains: ['information-and-ideas', 'craft-and-structure'],
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
          key: 'diagnostic-rw-2',
          sectionKey: 'rw-module-2',
          label: 'Reading and Writing sample B',
          timeLimitSeconds: 420,
          itemCount: 4,
          selection: {
            sectionKey: 'rw-module-2',
            domains: ['expression-of-ideas', 'standard-english-conventions'],
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
          key: 'diagnostic-math-1',
          sectionKey: 'math-module-1',
          label: 'Math sample A',
          timeLimitSeconds: 570,
          itemCount: 4,
          selection: {
            sectionKey: 'math-module-1',
            domains: ['algebra', 'advanced-math'],
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
          key: 'diagnostic-math-2',
          sectionKey: 'math-module-2',
          label: 'Math sample B',
          timeLimitSeconds: 570,
          itemCount: 4,
          selection: {
            sectionKey: 'math-module-2',
            domains: ['problem-solving-and-data-analysis', 'geometry-and-trigonometry'],
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
      id: 'practice',
      label: 'Custom practice set',
      mode: 'practice',
      description:
        'A template for an untimed 10-question set drawn from anywhere in the exam. Learners override the section, domain, difficulty and length at runtime; the values here are only the permissive defaults the picker starts from.',
      timing: 'untimed',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'not_applicable',
      fidelity: 'practice_only',
      fidelityNote:
        'Practice only: untimed, non-adaptive and freely filtered, so it resembles no part of the real test-day experience. Use it to drill a domain, not to gauge readiness.',
      parts: [
        {
          key: 'practice-set',
          sectionKey: 'rw-module-1',
          label: 'Practice set',
          timeLimitSeconds: null,
          itemCount: 10,
          selection: {
            sectionKey: 'rw-module-1',
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
      id: 'timed-rw-module-1',
      label: 'Timed Reading and Writing module 1 (27 questions / 32 minutes)',
      mode: 'practice',
      description:
        'One full-length Reading and Writing routing module at the real published length and pace: 27 questions in 32 minutes, free navigation inside the module.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_pauses',
      fidelity: 'approximation',
      fidelityNote:
        `Matches the real exam: 27 questions, 32 minutes, single-select four-option questions, no calculator, free back-and-forward navigation with mark-for-review, and a server-enforced lock once the module is submitted. Does not match it: ${ORIGINAL_ITEMS_NOTE} ${PRETEST_NOTE} No second-stage module follows, and no section score is produced.`,
      parts: [
        {
          key: 'rw-module-1',
          sectionKey: 'rw-module-1',
          label: 'Reading and Writing — Module 1',
          timeLimitSeconds: RW_MODULE_SECONDS,
          itemCount: 27,
          selection: {
            sectionKey: 'rw-module-1',
            domains: [
              'information-and-ideas',
              'craft-and-structure',
              'expression-of-ideas',
              'standard-english-conventions',
            ],
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
      id: 'timed-rw-module-2',
      label: 'Timed Reading and Writing module 2 (27 questions / 32 minutes)',
      mode: 'practice',
      description:
        'One full-length Reading and Writing second-stage module at the real published length and pace: 27 questions in 32 minutes.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_pauses',
      fidelity: 'approximation',
      fidelityNote:
        `Matches the real exam: 27 questions, 32 minutes, single-select four-option questions, no calculator, free navigation inside the module, server-enforced lock on submission. Does not match it: ${ORIGINAL_ITEMS_NOTE} ${PRETEST_NOTE} On test day this module's difficulty panel is chosen by your module 1 performance; taken on its own here, no routing happens and no section score is produced.`,
      parts: [
        {
          key: 'rw-module-2',
          sectionKey: 'rw-module-2',
          label: 'Reading and Writing — Module 2',
          timeLimitSeconds: RW_MODULE_SECONDS,
          itemCount: 27,
          selection: {
            sectionKey: 'rw-module-2',
            domains: [
              'information-and-ideas',
              'craft-and-structure',
              'expression-of-ideas',
              'standard-english-conventions',
            ],
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
      id: 'timed-math-module-1',
      label: 'Timed Math module 1 (22 questions / 35 minutes)',
      mode: 'practice',
      description:
        'One full-length Math routing module at the real published length and pace: 22 questions in 35 minutes, calculator and reference sheet available throughout.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_pauses',
      fidelity: 'approximation',
      fidelityNote:
        `Matches the real exam: 22 questions, 35 minutes, a mix of four-option multiple choice and student-produced response, calculator permitted on every question, formula reference sheet available, free navigation inside the module, server-enforced lock on submission. Does not match it: ${ORIGINAL_ITEMS_NOTE} ${PRETEST_NOTE} No second-stage module follows, and no section score is produced.`,
      parts: [
        {
          key: 'math-module-1',
          sectionKey: 'math-module-1',
          label: 'Math — Module 1',
          timeLimitSeconds: MATH_MODULE_SECONDS,
          itemCount: 22,
          selection: {
            sectionKey: 'math-module-1',
            domains: [
              'algebra',
              'advanced-math',
              'problem-solving-and-data-analysis',
              'geometry-and-trigonometry',
            ],
            skills: [],
            responseTypes: ['single_select', 'numeric_entry'],
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
      id: 'timed-math-module-2',
      label: 'Timed Math module 2 (22 questions / 35 minutes)',
      mode: 'practice',
      description:
        'One full-length Math second-stage module at the real published length and pace: 22 questions in 35 minutes, calculator and reference sheet available throughout.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_pauses',
      fidelity: 'approximation',
      fidelityNote:
        `Matches the real exam: 22 questions, 35 minutes, multiple-choice and student-produced response items, calculator permitted on every question, formula reference sheet available, free navigation inside the module, server-enforced lock on submission. Does not match it: ${ORIGINAL_ITEMS_NOTE} ${PRETEST_NOTE} On test day this module's difficulty panel is chosen by your Math module 1 performance; taken on its own here, no routing happens and no section score is produced.`,
      parts: [
        {
          key: 'math-module-2',
          sectionKey: 'math-module-2',
          label: 'Math — Module 2',
          timeLimitSeconds: MATH_MODULE_SECONDS,
          itemCount: 22,
          selection: {
            sectionKey: 'math-module-2',
            domains: [
              'algebra',
              'advanced-math',
              'problem-solving-and-data-analysis',
              'geometry-and-trigonometry',
            ],
            skills: [],
            responseTypes: ['single_select', 'numeric_entry'],
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
      id: 'simulation-full',
      label: 'Full Digital SAT simulation (98 questions / 134 minutes)',
      mode: 'simulation',
      description:
        'The complete published structure: Reading and Writing modules of 27 questions in 32 minutes each, a 10-minute break, then Math modules of 22 questions in 35 minutes each, with module-level routing after each first module and no way back into a finished module.',
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        `Matches the real exam: four separately timed modules (27/32min, 27/32min, 22/35min, 22/35min), the single 10-minute break between the Reading and Writing section and the Math section, no break between modules within a section, automatic advance when a module timer expires with no roll-over of unused time, completely free navigation inside a module, a server-enforced one-way lock between modules, no calculator on Reading and Writing and a calculator plus reference sheet on both Math modules, and two-stage module-level routing once per section. Does not match it: ${ORIGINAL_ITEMS_NOTE} ${PRETEST_NOTE} The routing threshold is ours, not College Board's. No 400-1600 or 200-800 score is produced — College Board scores with IRT ability estimation and publishes no raw-to-scale conversion; you get raw accuracy, per-domain accuracy and timing instead.`,
      parts: [
        {
          key: 'sim-rw-module-1',
          sectionKey: 'rw-module-1',
          label: 'Reading and Writing — Module 1',
          timeLimitSeconds: RW_MODULE_SECONDS,
          itemCount: 27,
          selection: {
            sectionKey: 'rw-module-1',
            domains: [
              'information-and-ideas',
              'craft-and-structure',
              'expression-of-ideas',
              'standard-english-conventions',
            ],
            skills: [],
            responseTypes: ['single_select'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: {
            enabled: true,
            kind: 'threshold_two_stage',
            upperThreshold: ROUTING_UPPER_THRESHOLD,
            routesTo: { lower: 'sim-rw-module-2-lower', upper: 'sim-rw-module-2-upper' },
            disclosure: ROUTING_DISCLOSURE,
          },
        },
        {
          key: 'sim-rw-module-2',
          sectionKey: 'rw-module-2',
          label: 'Reading and Writing — Module 2',
          timeLimitSeconds: RW_MODULE_SECONDS,
          itemCount: 27,
          selection: {
            sectionKey: 'rw-module-2',
            domains: [
              'information-and-ideas',
              'craft-and-structure',
              'expression-of-ideas',
              'standard-english-conventions',
            ],
            skills: [],
            responseTypes: ['single_select'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: SECTION_BREAK_SECONDS,
          adaptive: null,
        },
        {
          key: 'sim-math-module-1',
          sectionKey: 'math-module-1',
          label: 'Math — Module 1',
          timeLimitSeconds: MATH_MODULE_SECONDS,
          itemCount: 22,
          selection: {
            sectionKey: 'math-module-1',
            domains: [
              'algebra',
              'advanced-math',
              'problem-solving-and-data-analysis',
              'geometry-and-trigonometry',
            ],
            skills: [],
            responseTypes: ['single_select', 'numeric_entry'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: null,
          breakAfterSeconds: null,
          adaptive: {
            enabled: true,
            kind: 'threshold_two_stage',
            upperThreshold: ROUTING_UPPER_THRESHOLD,
            routesTo: { lower: 'sim-math-module-2-lower', upper: 'sim-math-module-2-upper' },
            disclosure: ROUTING_DISCLOSURE,
          },
        },
        {
          key: 'sim-math-module-2',
          sectionKey: 'math-module-2',
          label: 'Math — Module 2',
          timeLimitSeconds: MATH_MODULE_SECONDS,
          itemCount: 22,
          selection: {
            sectionKey: 'math-module-2',
            domains: [
              'algebra',
              'advanced-math',
              'problem-solving-and-data-analysis',
              'geometry-and-trigonometry',
            ],
            skills: [],
            responseTypes: ['single_select', 'numeric_entry'],
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
  ],

  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: 0,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'SAT total score (Reading and Writing 200-800 + Math 200-800)',
      min: 400,
      max: 1600,
      increment: 10,
      note:
        'College Board reports a total score of 400-1600 in 10-point intervals, equal to the arithmetic sum of two section scores of 200-800 each, also in 10-point intervals. No subscores or cross-test scores are reported. The College and Career Readiness Benchmarks are 480 for Reading and Writing and 530 for Math; they are readiness indicators, not admissions thresholds. This scale is recorded as a fact about the exam — we do not place your result on it.',
    },
    scaledEstimate: {
      enabled: false,
      reason:
        'College Board scores the digital SAT with IRT-based item-level calibration and does not publish raw-to-scaled conversion tables. The section score is an Item Response Theory ability estimate over the specific operational items administered, not a function of the number of correct answers: College Board states that "two students who answer the same number of questions correctly in a test section may earn differing section scores." The IRT item parameters and the theta-to-scale-score transformation are unpublished, so any 400-1600 estimate we produced would be fabricated. We report raw correct counts, per-domain and per-skill accuracy, and timing instead.',
    },
    notes: [
      'There is no guessing penalty. A wrong answer and an omitted answer both score zero, so guessing is never worse than leaving a question blank.',
      'Omitted answers are treated as incorrect for the purpose of the score; there is no additional deduction.',
      'On the real exam, 8 of the 98 administered questions (2 per module) are unscored pretest items, so 90 questions are operational. Our attempts contain no unscored items — every question we deliver counts.',
      'Published domain distributions are expressed over OPERATIONAL questions (50 Reading and Writing, 40 Math), not over the 54 and 44 administered.',
      'Percentile ranks, conditional standard error of measurement and Skills Insight descriptors are not reproduced: they were not verified and are not ours to approximate.',
    ],
  },

  capabilities: {
    fullSimulation: {
      available: true,
      note:
        'The structure that a simulation has to get right is fully published and verified: four separately timed modules (27/32min, 27/32min, 22/35min, 22/35min), one 10-minute break between the two sections, automatic advance with no roll-over of unused time, free navigation within a module, and a hard one-way lock between modules. The exam is adaptive at module level only, not question by question, so a faithful run does not require an undisclosed item-by-item algorithm. Two deviations are disclosed on the simulation itself: we do not reproduce the 2 unscored pretest questions per module (their positions are unpublished), so all 27/22 items we deliver are scored; and the second-stage routing threshold is our own published rule, not College Board\'s. No scaled score is produced.',
    },
    adaptiveRouting: {
      available: true,
      note:
        'Two-stage, module-level routing is structurally faithful: the real exam picks one of two prebuilt second-stage panels per section based on first-module performance, and we do the same. The decision rule is OURS — 60% correct on the routing module sends you to the higher-difficulty panel — and is stored with the attempt so a resume replays the same panel. College Board publishes only that its break point sits around the median section score and that roughly half of test takers route each way; its cut score, IRT parameters and panel difficulty mixes are not published and we do not claim to reproduce them. Routing happens exactly twice per test, once per section, and never question by question.',
    },
    scaledScoreEstimate: {
      available: false,
      reason:
        'College Board scores the digital SAT with IRT-based item-level calibration and publishes no raw-to-scaled conversion table for any form, so a 400-1600 or 200-800 estimate cannot be derived honestly from a raw count.',
    },
  },

  unverified: [
    'The numeric routing threshold between the higher- and lower-difficulty second-stage modules. College Board publishes only that the break point is set around the median section score and that roughly half of test takers route each way, so our 60%-correct rule is a house approximation, not the exam\'s.',
    'The IRT item parameters and the theta-to-scale-score transformation, and any raw-to-scaled conversion table for any Digital SAT form. No scaled score estimate is offered.',
    'The difficulty composition (proportion of easy, medium and hard questions) of the routing module and of each second-stage panel, so our panels cannot be blueprint-accurate.',
    'The positions of the 2 pretest questions within each module and whether they are fixed or randomised, so we do not reproduce unscored items; every item we deliver is scored.',
    'The score range attainable from the lower-difficulty second-stage path and the overlap between paths, so no "your ceiling was capped by routing" messaging is shown.',
    'Percentile rank tables and conditional standard error of measurement by score point for 2026-27 forms; no percentiles or score confidence intervals are displayed.',
    'Per-module minute allocations under accommodated timing (+50%, +100% and above) and extended-break schedules; extended time is built as a generic multiplier and labelled as ours, not as an accommodation replica.',
    'Whether the Bluebook question menu is strictly module-scoped: the Bluebook tools page says "any question in the section" while the test directions state the hard no-return-to-a-finished-module rule. We implement the review panel as module-scoped, the conservative reading.',
    'The exact answer-matching tolerance College Board applies to student-produced responses; each of our numeric items therefore enumerates its accepted answers explicitly instead of relying on a global tolerance.',
    'Bluebook\'s autosave interval and reconnect-recovery mechanics; our autosave contract is our own and is not claimed to match Bluebook.',
    'The scoring rubric and scale of the digital SAT Essay, offered only in select U.S. School Day administrations; it is out of scope for this configuration.',
  ],
};
