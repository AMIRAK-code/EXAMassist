import type { ExamConfig, NavigationPolicy } from '@/lib/assessment/types';

/**
 * Online Bocconi Test — STANDARD variant (Bachelor / economics-management).
 *
 * Every fact below is taken from the verified research record at
 * content/exam-specs/_raw/bocconi-online-test-undergraduate.draft.json
 * (verification date 2026-09-18). The "Online Bocconi Test - Law" variant has a
 * different content mix (Mathematics 5 / Reading 11 / Numerical reasoning 6 /
 * Logics and critical thinking 18 / Verbal reasoning 10) and is deliberately NOT
 * modelled here.
 *
 * Distinctive behaviours encoded:
 *  - ONE undivided 75-minute block of 50 items. Bocconi publishes no per-area time.
 *  - Strictly forward-only navigation in screens of three questions, no return.
 *  - Real negative marking: +1 / 0 / −0.2, with a −0.33 exception for
 *    three-option critical thinking items.
 *  - No calculator of any kind; scratch work on two physical A4 sheets.
 *  - Fixed linear form: not adaptive at any level.
 */

const OFFICIAL_TEST_PAGE =
  'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test';
const OFFICIAL_RULES_PDF =
  'https://www.unibocconi.it/sites/default/files/Istruzioni%20e%20regole_26-27%20ENG.pdf';

const SECTION_KEY = 'online-test';

/**
 * The real exam's navigation rule. Server-enforced: the API rejects any attempt
 * to revisit or amend a committed screen.
 */
const forwardOnlyNavigation: NavigationPolicy = {
  // Verified, AY 2027/28 Instructions and Rules of Conduct, section 3.2:
  // three questions per screen, sequential order, and "you will move to the
  // next screen and will not be able to return to previous screens".
  allowBackWithinPart: false,
  pageSize: 3,
  // Omitted answers score 0 and are an officially reported outcome, so a
  // candidate may advance while leaving questions blank.
  allowForwardSkip: true,
  // The three questions on the current screen stay editable until "Next".
  allowChangeAnswer: true,
  allowFlagForReview: false,
  allowReturnToPreviousPart: false,
  // Section 3.3: a read-only summary page listing answered and omitted
  // questions precedes "Submit All and Finish".
  reviewScreen: true,
  reviewScreenEditable: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: OFFICIAL_RULES_PDF,
};

/**
 * Relaxed navigation used ONLY by the practice-oriented blueprints (diagnostic
 * and the open practice template). These are study tools, not reproductions of
 * test-day conditions, and the fidelity notes say so.
 */
const practiceNavigationOverride: Partial<NavigationPolicy> = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  reviewScreen: true,
  enforcement: 'server',
};

export const bocconiUndergraduateConfig: ExamConfig = {
  examKey: 'bocconi-undergraduate',
  version: '2026.09',
  name: 'Online Bocconi Test (standard variant)',
  shortName: 'Bocconi Test',
  publisher: 'Bocconi University',
  versionLabel:
    'Online Bocconi Test, AY 2027-28 admissions cycle. Structure and scoring verified on the current official test page; delivery, navigation and conduct rules verified from the official "ONLINE ADMISSION TEST AY 2026-2027 Instructions and Rules of Conduct" PDF, the most recent such document publicly fetchable.',
  admissionsCycle:
    'AY 2027-28 (test booking 13 July 2026 – 19 January 2027 for international applicants, 13 July 2026 – 20 April 2027 for Italian applicants)',
  verifiedOn: '2026-09-18',
  audience: ['undergraduate'],
  summary:
    "Bocconi University's own remote-proctored admission test for its Bachelor programs. The standard variant is 50 single-select multiple-choice questions in one undivided 75-minute block: Mathematics 24, Reading comprehension 11, Numerical reasoning 6, Critical thinking 9. Items from the four areas are interleaved rather than grouped, navigation is strictly forward-only in screens of three questions with no return, and no calculator is allowed. Scoring is raw with real negative marking (+1 correct, 0 omitted, −0.2 wrong, −0.33 for three-option critical thinking items), so omitting beats blind guessing. Bocconi publishes an eligibility floor of 17 points, below which an applicant is not considered; it publishes no admission cut-off, because admission is by competitive ranking (test 55%, high-school GPA 45%).",

  sources: [
    {
      label: 'Online Bocconi Test — official test page (structure, timing, scoring, eligibility floor)',
      url: OFFICIAL_TEST_PAGE,
      publisher: 'Bocconi University',
      verifiedOn: '2026-09-18',
    },
    {
      label:
        'ONLINE ADMISSION TEST AY 2026-2027 — Instructions and Rules of Conduct (navigation, delivery, permitted materials, score report)',
      url: OFFICIAL_RULES_PDF,
      publisher: 'Bocconi University',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Application and admissions — accepted selection tests and 55/45 ranking weighting',
      url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions',
      publisher: 'Bocconi University',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'SAT and ACT — official exclusion floors for the alternative admission routes',
      url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act',
      publisher: 'Bocconi University',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Results and enrollment — ranking construction',
      url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/results-and-enrollment',
      publisher: 'Bocconi University',
      verifiedOn: '2026-09-18',
    },
    {
      label: 'Application and admissions overview — places available',
      url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions',
      publisher: 'Bocconi University',
      verifiedOn: '2026-09-18',
    },
  ],

  sections: [
    {
      key: SECTION_KEY,
      name: 'Online Bocconi Test — single 75-minute block',
      order: 0,
      officialQuestionCount:
        '50 (Mathematics 24, Reading comprehension 11, Numerical reasoning 6, Critical thinking 9)',
      officialTimeMinutes: 75,
      calculator: 'none',
      calculatorNote:
        'No calculator of any kind. The official rules of conduct prohibit "having books, notebooks, notes, formularies, calculators or sources/resources available online". The test runs inside the Safe Exam Browser lockdown browser, so no on-screen calculator exists either. Only an identification document, one pen or pencil, two blank A4 sheets and an unlabelled drink are permitted on the desk; all scratch work is done on the two physical sheets.',
      navigation: forwardOnlyNavigation,
      responseTypes: ['single_select'],
      notes: [
        'The four named areas are REPORTING CATEGORIES, not delivered sections. Bocconi states "The questions are distributed within the test in a mixed way both by difficulty level and by topic", so items are interleaved across the 17 screens rather than grouped. There are no section headers, no section timers and no section transitions.',
        'Navigation, per section 3.2 "SEQUENTIAL NAVIGATION DURING THE TEST" of the official rules: "The test offers 3 questions for each screen. With the \'Next\' button, you can view the next screen but going back to the previous one will no longer be possible."',
        'allowForwardSkip is false because there is no defer-and-return facility: an item left blank on the current screen can never be revisited. Leaving an item unanswered is permitted and scores 0 — it is simply irreversible.',
        'No breaks. The rules of conduct forbid leaving the seat for the whole duration once the test has started.',
        'At expiry the platform auto-submits: "the test will close automatically when the available time has expired, the answers provided will be saved". No grace period.',
        'Within 48 hours the candidate can download a score report giving the total score, per-area subscores (mathematics, comprehension of the text, critical and numerical reasoning), the counts of correct / not answered / incorrect answers, and a reference number.',
        'The test may be taken in Italian or English; the choice is independent of the language of the programs applied for. Up to four attempts per test type per academic year, not on the same day nor on two consecutive days.',
      ],
    },
  ],

  domains: [
    {
      slug: 'bocconi-ug-mathematics',
      name: 'Mathematics',
      sectionKey: SECTION_KEY,
      description:
        'The largest area of the standard variant: 24 of the 50 items. Bocconi publishes a detailed syllabus covering algebra, functions, plane and analytical geometry, trigonometry, sets, logarithms and exponentials, discrete mathematics, numbers, probability, problem solving and descriptive statistics.',
      officialShare: '24 of 50 questions',
      skills: [
        {
          slug: 'math-algebra-expressions',
          name: 'Algebraic expressions',
          description: 'Solving and manipulating algebraic expressions, polynomials, powers and radicals.',
        },
        {
          slug: 'math-algebra-equations',
          name: 'First and second degree equations',
          description: 'Solving and interpreting first and second degree equations with one unknown.',
        },
        {
          slug: 'math-algebra-expressing-quantities',
          name: 'Expressing one quantity as a function of others',
          description: 'Rewriting relationships so a target quantity is expressed in terms of the others.',
        },
        {
          slug: 'math-algebra-inequalities',
          name: 'First and second degree inequalities',
          description: 'Solving and interpreting first and second degree inequalities with one unknown.',
        },
        {
          slug: 'math-algebra-systems',
          name: 'Systems with two unknowns',
          description: 'Solving and interpreting first and second degree systems with two unknowns.',
        },
        {
          slug: 'math-algebra-absolute-values',
          name: 'Absolute values',
          description: 'Solving equations and inequalities containing absolute values.',
        },
        {
          slug: 'math-functions-notation',
          name: 'Mathematical notation and formula manipulation',
          description: 'Reading and transforming formulas expressed in standard mathematical notation.',
        },
        {
          slug: 'math-functions-concepts',
          name: 'Function concepts',
          description: 'Function concepts, inverse functions and composition of functions.',
        },
        {
          slug: 'math-functions-graphs',
          name: 'Graphs of elementary functions',
          description: 'Graphs of powers, logarithms, exponentials and the absolute value function.',
        },
        {
          slug: 'math-plane-geometry-formulas',
          name: 'Plane geometry formulas',
          description: 'Formulas for triangles, circles, squares, trapezoids and rhombuses.',
        },
        {
          slug: 'math-analytic-points-distances',
          name: 'Points and distances',
          description: 'Analytical geometry: points and distances between points.',
        },
        {
          slug: 'math-analytic-lines',
          name: 'Equations and properties of lines',
          description: 'Parallel and perpendicular lines, slope and intersection.',
        },
        {
          slug: 'math-analytic-conics',
          name: 'Parabolas and circles',
          description: 'Equations and properties of parabolas and circles.',
        },
        {
          slug: 'math-analytic-line-conic-positions',
          name: 'Positions of lines relative to conics',
          description: 'Relative positions of lines with respect to circles and parabolas.',
        },
        {
          slug: 'math-trigonometry-identities',
          name: 'Trigonometric identities',
          description: 'Main trigonometric identities.',
        },
        {
          slug: 'math-trigonometry-functions',
          name: 'Trigonometric functions',
          description: 'sin(x), cos(x), tan(x), their inverses and graphical representations.',
        },
        {
          slug: 'math-trigonometry-right-triangles',
          name: 'Trigonometry in right triangles',
          description: 'Applications of trigonometry to right triangles.',
        },
        {
          slug: 'math-sets',
          name: 'Sets',
          description: 'Inclusion, union, intersection, complement and Cartesian product.',
        },
        {
          slug: 'math-logexp-forms',
          name: 'Logarithmic and exponential forms',
          description: 'Converting between and interpreting logarithmic and exponential forms.',
        },
        {
          slug: 'math-logexp-equations',
          name: 'Logarithmic and exponential equations and inequalities',
          description: 'Solving equations and inequalities involving logarithms and/or exponentials.',
        },
        {
          slug: 'math-logexp-identities',
          name: 'Logarithm and exponential identities',
          description: 'Fundamental identities for logarithms and exponentials.',
        },
        {
          slug: 'math-discrete-permutations-combinations',
          name: 'Permutations and combinations',
          description: 'Permutations and combinations with and without repetitions.',
        },
        {
          slug: 'math-discrete-applied-combinatorics',
          name: 'Applied combinatorics',
          description: 'Applying combinatorics to simple problems.',
        },
        {
          slug: 'math-discrete-counting',
          name: 'Counting problems',
          description: 'Counting problems using the sum rule and the product rule.',
        },
        {
          slug: 'math-numbers-ordering',
          name: 'Ordering properties in the reals',
          description: 'Ordering properties in the real numbers.',
        },
        {
          slug: 'math-numbers-percentages',
          name: 'Percentages',
          description: 'Percentage calculation and interpretation.',
        },
        {
          slug: 'math-numbers-unit-conversion',
          name: 'Unit conversion',
          description: 'Unit conversion problems.',
        },
        {
          slug: 'math-probability-basics',
          name: 'Basic probability',
          description: 'Basic properties of probability.',
        },
        {
          slug: 'math-probability-union-intersection',
          name: 'Union and intersection of events',
          description: 'Probability of the union and intersection of events.',
        },
        {
          slug: 'math-probability-conditional-bayes',
          name: 'Conditional probability and Bayes',
          description: "Total probability theorem, conditional probability and Bayes' theorem.",
        },
        {
          slug: 'math-problem-solving',
          name: 'Application problems',
          description: 'Problem solving applied to worded quantitative situations.',
        },
        {
          slug: 'math-statistics-frequencies',
          name: 'Absolute and relative frequencies',
          description: 'Reading and computing absolute and relative frequencies.',
        },
        {
          slug: 'math-statistics-central-dispersion',
          name: 'Central tendency and dispersion',
          description: 'Measures of central tendency and of dispersion.',
        },
      ],
      source: OFFICIAL_TEST_PAGE,
    },
    {
      slug: 'bocconi-ug-reading-comprehension',
      name: 'Reading comprehension',
      sectionKey: SECTION_KEY,
      description:
        'Passage-based items testing reading comprehension and information processing, including economic passages containing numbers, percentages and data. 11 of the 50 items.',
      officialShare: '11 of 50 questions',
      skills: [
        {
          slug: 'reading-information-processing',
          name: 'Reading comprehension and information processing',
          description: 'Overall comprehension and processing of information presented in a passage.',
        },
        {
          slug: 'reading-explicit-information',
          name: 'Explicit information',
          description: 'Understanding information explicitly stated in a passage.',
        },
        {
          slug: 'reading-implicit-meaning',
          name: 'Implicit meaning',
          description: 'Understanding implicit meaning across passages or across sections of a passage.',
        },
        {
          slug: 'reading-economic-data-passages',
          name: 'Economic passages with data',
          description: 'Analysing economic topics containing numbers, percentages and data.',
        },
      ],
      source: OFFICIAL_TEST_PAGE,
    },
    {
      slug: 'bocconi-ug-numerical-reasoning',
      name: 'Numerical reasoning',
      sectionKey: SECTION_KEY,
      description:
        'Chart and table stimulus items requiring data analysis and simple hand calculation. 6 of the 50 items.',
      officialShare: '6 of 50 questions',
      skills: [
        {
          slug: 'numerical-reasoning-data-analysis',
          name: 'Reasoning from data',
          description: 'Solving problems through reasoning and data analysis.',
        },
        {
          slug: 'numerical-reasoning-charts-tables',
          name: 'Charts and tables',
          description: 'Reading and correctly understanding charts or tables.',
        },
        {
          slug: 'numerical-reasoning-relevance',
          name: 'Critical vs superfluous information',
          description: 'Distinguishing critical information from superfluous information.',
        },
        {
          slug: 'numerical-reasoning-hand-calculation',
          name: 'Simple calculation by hand',
          description: 'Performing simple calculations when necessary, without a calculator.',
        },
      ],
      source: OFFICIAL_TEST_PAGE,
    },
    {
      slug: 'bocconi-ug-critical-thinking',
      name: 'Critical thinking',
      sectionKey: SECTION_KEY,
      description:
        'Items asking what can and cannot be deduced from a given text or data set. 9 of the 50 items. Some critical thinking items are presented with only three answer options and carry the heavier −0.33 penalty.',
      officialShare: '9 of 50 questions',
      skills: [
        {
          slug: 'critical-thinking-interpret-text',
          name: 'Interpreting the meaning of a text',
          description: 'Understanding and interpreting the meaning of a text.',
        },
        {
          slug: 'critical-thinking-draw-conclusions',
          name: 'Drawing conclusions',
          description: 'Drawing conclusions from the information provided.',
        },
        {
          slug: 'critical-thinking-exclude-implications',
          name: 'Excluding unsupported implications',
          description: 'Excluding implications not supported by the given information.',
        },
        {
          slug: 'critical-thinking-truth-evaluation',
          name: 'Evaluating truth or falsehood',
          description: 'Evaluating the truth or falsehood of statements based on provided data.',
        },
        {
          slug: 'critical-thinking-deducibility',
          name: 'True, false or not deducible',
          description: 'Determining whether an assertion is true, false, or cannot be deduced from the text.',
        },
      ],
      source: OFFICIAL_TEST_PAGE,
    },
  ],

  blueprints: [
    {
      id: 'simulation-full',
      label: 'Full simulation - Online Bocconi Test',
      mode: 'simulation',
      description:
        'The complete published structure: 50 questions in one continuous 75-minute session built to ' +
        "Bocconi's 24 / 11 / 6 / 9 subject-area blueprint, with no break, no calculator, three questions " +
        'per screen and the strict forward-only lock. The clock keeps running if you leave, exactly as it ' +
        'does in the real test.',
      parts: [
        {
          key: 'simulation-mathematics',
          sectionKey: SECTION_KEY,
          label: 'Mathematics (24 questions)',
          timeLimitSeconds: null,
          itemCount: 24,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['bocconi-ug-mathematics'],
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
          key: 'simulation-reading-comprehension',
          sectionKey: SECTION_KEY,
          label: 'Reading comprehension (11 questions)',
          timeLimitSeconds: null,
          itemCount: 11,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['bocconi-ug-reading-comprehension'],
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
          key: 'simulation-numerical-reasoning',
          sectionKey: SECTION_KEY,
          label: 'Numerical reasoning (6 questions)',
          timeLimitSeconds: null,
          itemCount: 6,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['bocconi-ug-numerical-reasoning'],
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
          key: 'simulation-critical-thinking',
          sectionKey: SECTION_KEY,
          label: 'Critical thinking (9 questions)',
          timeLimitSeconds: null,
          itemCount: 9,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['bocconi-ug-critical-thinking'],
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
      timing: 'overall',
      overallTimeLimitSeconds: 4500,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'Timing, navigation, the subject-area blueprint and the penalty scheme match the published rules. ' +
        'What differs: every question is original material written by us, difficulty labels are editorial ' +
        'rather than calibrated, Bocconi does not publish the interleaving order of the four areas so they ' +
        'are delivered as consecutive groups, and Bocconi does not disclose whether any live items are ' +
        'unscored pretest questions, so every item here counts.',
    },

    {
      id: 'diagnostic',
      label: 'Bocconi diagnostic skill check',
      mode: 'diagnostic',
      description:
        'A short 16-item check across all four Bocconi content areas, timed generously so the result reflects what you know rather than how fast you work.',
      parts: [
        {
          key: 'diagnostic-mathematics',
          sectionKey: SECTION_KEY,
          label: 'Mathematics',
          timeLimitSeconds: 675,
          itemCount: 5,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['bocconi-ug-mathematics'],
            skills: [],
            responseTypes: ['single_select'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: practiceNavigationOverride,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diagnostic-reading-comprehension',
          sectionKey: SECTION_KEY,
          label: 'Reading comprehension',
          timeLimitSeconds: 540,
          itemCount: 4,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['bocconi-ug-reading-comprehension'],
            skills: [],
            responseTypes: ['single_select'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: practiceNavigationOverride,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diagnostic-numerical-reasoning',
          sectionKey: SECTION_KEY,
          label: 'Numerical reasoning',
          timeLimitSeconds: 405,
          itemCount: 3,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['bocconi-ug-numerical-reasoning'],
            skills: [],
            responseTypes: ['single_select'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: practiceNavigationOverride,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diagnostic-critical-thinking',
          sectionKey: SECTION_KEY,
          label: 'Critical thinking',
          timeLimitSeconds: 540,
          itemCount: 4,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['bocconi-ug-critical-thinking'],
            skills: [],
            responseTypes: ['single_select'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: practiceNavigationOverride,
          breakAfterSeconds: null,
          adaptive: null,
        },
        ],
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_pauses',
      fidelity: 'practice_only',
      fidelityNote:
        'This is a short skill check, not a predictor of a Bocconi test score. It groups the four content areas into separate timed parts, allows you to move back and change answers, and gives about 135 seconds per item — roughly 1.5x the real pace of 90 seconds per item. The real test interleaves the areas in one undivided 75-minute block with forward-only navigation and negative marking. Use it to find weak areas, nothing more.',
    },
    {
      id: 'practice',
      label: 'Bocconi practice set',
      mode: 'practice',
      description:
        'An untimed 10-item set drawn from anywhere in the Bocconi syllabus. This is a template: choose the area, difficulty and length you want before you start.',
      parts: [
        {
          key: 'practice-mixed',
          sectionKey: SECTION_KEY,
          label: 'Mixed practice',
          timeLimitSeconds: null,
          itemCount: 10,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [],
            skills: [],
            responseTypes: [],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: practiceNavigationOverride,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
      timing: 'untimed',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'not_applicable',
      fidelity: 'practice_only',
      fidelityNote:
        'A study tool, not a reproduction of the exam. It is untimed, you can move back and change answers, and the defaults here are overridden by whatever you pick at runtime. The real Bocconi test is 50 items in 75 minutes with forward-only navigation and a penalty for wrong answers.',
    },
    {
      id: 'timed-online-test',
      label: 'Full-length timed Bocconi block (50 items, 75 minutes)',
      mode: 'practice',
      description:
        "The real published shape of the standard Online Bocconi Test: 50 single-select questions in one undivided 75-minute block, delivered three per screen with no way back, no calculator, and Bocconi's negative marking applied.",
      parts: [
        {
          key: 'timed-online-test-block',
          sectionKey: SECTION_KEY,
          label: 'Online Bocconi Test — 50 questions, 75 minutes',
          timeLimitSeconds: 4500,
          itemCount: 50,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [
              'bocconi-ug-mathematics',
              'bocconi-ug-reading-comprehension',
              'bocconi-ug-numerical-reasoning',
              'bocconi-ug-critical-thinking',
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
      timing: 'per_part',
      overallTimeLimitSeconds: 4500,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real exam: 50 questions, one undivided 75-minute clock that keeps running and auto-submits at expiry, no breaks, no calculator, strictly forward-only navigation in screens of three questions with no return and no flagging, and the official scoring of +1 correct / 0 omitted / −0.2 wrong. What does not match: our questions are original, written by us — none are retired Bocconi items and there are no pretest items; our difficulty labels are editorial judgement, not calibrated statistics; Bocconi does not publish how many answer options each item carries, so our option counts are a product choice rather than an exam-accurate detail; Bocconi publishes the area mix as Mathematics 24 / Reading comprehension 11 / Numerical reasoning 6 / Critical thinking 9, but because the real test interleaves the areas inside one undivided block this blueprint draws all 50 items from the whole pool and does not guarantee those per-area counts; and the real interleaving order of areas and difficulties across the 17 screens is not published, so ours cannot reproduce it.',
    },
  ],

  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: -0.2,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'Bocconi Online Test total score (penalties included), out of 50',
      min: -10,
      max: 50,
      increment: 0.01,
      note: 'Bocconi reports the raw penalty-adjusted total, not a converted or equated scale. The maximum attainable is 50 (50 items x 1 point). The lower bound shown here is the arithmetic minimum if all 50 items were answered incorrectly at the standard −0.2 penalty; three-option critical thinking items penalised at −0.33 would push it lower, and Bocconi does not publish whether the reported total is floored at zero. The increment reflects the two-decimal granularity implied by the −0.33 penalty; Bocconi publishes no rounding rule. The score report also gives per-area subscores (mathematics, comprehension of the text, critical and numerical reasoning) and the counts of correct / not answered / incorrect answers.',
    },
    scaledEstimate: {
      enabled: false,
      reason:
        'Bocconi does not publish, and does not use, any raw-to-scaled conversion for the Online Bocconi Test: the reported result IS the raw penalty-adjusted total out of 50. There is also no published equating between the four permitted attempts, between different test forms, or between the Italian and English versions of the test, and no published formula mapping that total onto the 55% test component of the admission ranking. With no published method there is nothing defensible to estimate, so we report your raw penalty-adjusted total and per-area subscores only.',
    },
    notes: [
      'Official scoring, quoted: "Right answer: 1 point Missing answer: 0 points Wrong answer: — 0.2 points."',
      'THREE-OPTION EXCEPTION: for critical thinking questions presented with three answer options, "the penalty will be — 0.33 points" instead of −0.2. The penalty therefore belongs to the item, not to the exam: items flagged as three-option critical thinking are scored at −0.33 for a wrong answer while every other item uses the −0.2 configured here.',
      'Omitted answers are never penalised, so strategic omission is rational. Leaving an item blank costs 0; a wrong guess costs 0.2 (or 0.33) points.',
      'Bocconi does not publish how many answer options non-critical-thinking items carry, so the guessing-penalty geometry cannot be reconstructed and no break-even guessing rule can be stated with confidence.',
      'ELIGIBILITY FLOOR, NOT A TARGET: "Applicants who receive a total score (penalties included) lower than 17 will not be considered in the selection process." This is an exclusion threshold. It is not a pass mark and not an admission predictor.',
      'PROGRAMME-SPECIFIC FLOOR: applicants listing the Bachelor in Mathematical and Computing Sciences for Artificial Intelligence among their choices "will need to obtain at least 11 points out of 24 in the \'Mathematics\' area".',
      'Admission is by competitive ranking, not by reaching a score: the selection test score contributes 55% and the third-last and second-last year high-school GPA contributes 45%. Bocconi publishes no admission cut-off for any programme or round, and the formula converting the raw score into the 55% component is not published. Never present a "target score".',
      'Parallel official floors exist for the alternative routes into the same ranking: SAT total below 1040 or section score below 520 is not considered (600/800 Math for the AI bachelor; scores before 2022 not accepted); ACT composite below 19 is not considered (25/36 Math for the AI bachelor; scores before 2021 not accepted).',
    ],
  },

  capabilities: {
    fullSimulation: {
      available: true,
      note:
        'Structure (50 items; Mathematics 24 / Reading comprehension 11 / Numerical reasoning 6 / ' +
        'Critical thinking 9), timing (one undivided 75-minute block, auto-submit at expiry), navigation ' +
        '(three questions per screen, sequential, no return to a committed screen, read-only summary page ' +
        'before submission) and scoring (+1 / 0 / -0.2, with -0.33 on three-option critical-thinking items) ' +
        'are all published and verified against the AY 2027/28 Instructions and Rules of Conduct, and the ' +
        'test is not adaptive. One gap is disclosed on the blueprint rather than invented: Bocconi describes ' +
        'the four areas only as "mixed" across the screens and does not publish the interleaving pattern, so ' +
        'our simulation delivers the areas as consecutive groups under the single 75-minute clock.',
    },
    adaptiveRouting: {
      available: false,
      reason:
        "The Online Bocconi Test is not adaptive at any level. Bocconi makes no claim of adaptive delivery, adaptive routing, IRT-based item selection or module-level branching; the official page describes a fixed linear form in which 'The questions are distributed within the test in a mixed way both by difficulty level and by topic'. Every candidate answers the same 50 questions in 75 minutes regardless of performance, so there is no published adaptive behaviour to approximate and offering routing here would misrepresent the exam.",
    },
    scaledScoreEstimate: {
      available: false,
      reason:
        'There is no scaled score to estimate. Bocconi reports the raw penalty-adjusted total out of 50 with per-area subscores, and publishes no raw-to-scale conversion, no percentile table, no equating between attempts or between the Italian and English versions, and no formula mapping the total onto the 55% test component of the admission ranking.',
    },
  },

  unverified: [
    'Number of answer options per question. The only signal is indirect: some critical thinking items have three options, attracting the −0.33 penalty. Option counts for Mathematics, Reading comprehension and Numerical reasoning items are not published, so no fixed 4- or 5-option layout can be called exam-accurate.',
    "Whether answers can be changed among the three questions on the CURRENT screen before pressing 'Next'. Only backward navigation across screens is explicitly forbidden; we enforce the strict reading.",
    "Whether the end-of-test summary page permits answering previously unanswered questions or editing answers, or is purely a view-only confirmation screen before 'Submit all and finish'. We assume view-only, consistent with the explicit forward-only rule.",
    "What the on-screen 'test navigation' box does — whether it merely shows progress or permits jumping forward to a later screen.",
    'Number of reading passages, their length, and how many of the 11 Reading comprehension questions attach to each passage. Passage grouping is implied but its shape is not published.',
    "The exact interleaving order of the four content areas across the 17 screens. Bocconi says topics are 'mixed', so no blueprint can reproduce the real ordering.",
    'Whether a countdown timer is displayed to the candidate during the test, and whether any per-screen time limit exists.',
    'Whether the four permitted attempts draw from equated forms of comparable difficulty, and whether the Italian and English versions are equated.',
    'The additional time granted to candidates with certified disabilities or specific learning disorders — decided case by case by a Commission, with no published multiplier. Any extra-time setting we offer is a generic study aid, not a Bocconi allowance.',
    'The theoretical minimum score: whether the reported total is floored at zero or can be negative when penalties exceed correct answers.',
    'Whether the AY 2027-28 rules differ from the AY 2026-27 rules on navigation, conduct or attempt limits. The AY 2027-28 Instructions and Rules of Conduct PDF returned HTTP 403 and did not appear in search; re-verify when it is published.',
    'Whether a Spring session formally exists for the AY 2027-28 international cycle. The admissions page lists only Early and Winter sessions, while the test page lets Italian applicants book until 20 April 2027.',
  ],
};
