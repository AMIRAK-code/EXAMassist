import type { ExamConfig, NavigationPolicy } from '@/lib/assessment/types';

/**
 * Bocconi Online Test - Law (a.y. 2027-28 admissions cycle).
 *
 * Every fact below is taken from the verified research record at
 * content/exam-specs/_raw/bocconi-online-test-law.draft.json. Anything the
 * record marks as unpublished is listed in `unverified` and is never asserted
 * as exam behaviour.
 *
 * Structural note: Bocconi delivers ONE 75-minute, 50-question form. The five
 * "subject areas" are content areas, not separately timed delivery sections —
 * the official pages state that items of all five areas are mixed throughout
 * the test, three per screen. They are therefore modelled as domains of a
 * single section rather than as sections with invented per-section clocks.
 */

const OFFICIAL_TEST_PAGE_EN =
  'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test';
const OFFICIAL_TEST_PAGE_IT =
  'https://www.unibocconi.it/it/entrare-bocconi/corsi-di-laurea-triennale-e-giurisprudenza/ammissione/test-online-bocconi';
const OFFICIAL_ADMISSIONS_PAGE =
  'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions';
const OFFICIAL_SAT_ACT_PAGE =
  'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act';
const OFFICIAL_RULES_PDF_2728 =
  'https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf';
const OFFICIAL_RULES_PDF_2627_EN =
  'https://www.unibocconi.it/sites/default/files/Istruzioni%20e%20regole_26-27%20ENG.pdf';

const VERIFIED_ON = '2026-09-18';

const SECTION_KEY = 'online-test-law';

/** Total published test length: 75 minutes for all 50 questions. */
const TOTAL_TIME_SECONDS = 75 * 60;

/**
 * The exam's own pace: 4500s / 50 items = 90s per item. Diagnostic parts use a
 * deliberately generous 1.5x of that (135s per item) because a diagnostic is a
 * skill check, not a pacing test.
 */
const DIAGNOSTIC_SECONDS_PER_ITEM = 135;

/**
 * The real, published navigation rule: strictly sequential, forward-only, three
 * questions per screen, no return to a passed screen, no flag-and-return.
 * Enforced server-side — the API rejects any attempt to revisit a committed item.
 */
const FORWARD_ONLY_NAVIGATION: NavigationPolicy = {
  // Verified, AY 2027/28 Instructions and Rules of Conduct, section 3.2:
  // "The test presents 3 questions on each screen and you must proceed by
  // following the order in which the questions are presented. By clicking the
  // 'Next' button, you will move to the next screen and will not be able to
  // return to previous screens."
  allowBackWithinPart: false,
  pageSize: 3,
  // Omitted answers are an officially scored outcome (0 points), so a
  // candidate may advance while leaving questions blank.
  allowForwardSkip: true,
  // Within the screen currently displayed, all three questions are visible and
  // editable until "Next" is clicked; afterwards the screen is committed.
  allowChangeAnswer: true,
  allowFlagForReview: false,
  allowReturnToPreviousPart: false,
  // Section 3.3: clicking "Finish" shows "a summary page ... showing all
  // questions, including both answered and omitted questions" before
  // "Submit All and Finish". The document does not say answers may be changed
  // from it, so we render it read-only.
  reviewScreen: true,
  reviewScreenEditable: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: OFFICIAL_RULES_PDF_2728,
};

/** Practice-mode relaxation. Explicitly NOT the exam's rule; labelled as ours. */
const PRACTICE_NAVIGATION_OVERRIDE: Partial<NavigationPolicy> = {
  allowBackWithinPart: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  enforcement: 'server',
};

export const bocconiLawConfig: ExamConfig = {
  examKey: 'bocconi-law',
  version: '2026.09',
  name: 'Bocconi Online Test - Law',
  shortName: 'Bocconi Law',
  publisher: 'Università Bocconi',
  versionLabel:
    'Bocconi Online Test - Law (a.y. 2027-28 admissions cycle; booking window 13 July 2026 - 20 April 2027)',
  admissionsCycle:
    'Academic year 2027-28 (Early Session: 2-29 September 2026; Winter Session: 25 November 2026 - 26 January 2027). Attempts from earlier academic years cannot be reused for the 2027-28 selection.',
  verifiedOn: VERIFIED_ON,
  audience: ['law'],
  summary:
    'The Bocconi Online Test - Law is a separate admission test from the standard Bocconi Online Test: the two "differ in content" and are bought, booked and attempted separately (four attempts each per academic year). It is 50 single-answer multiple-choice questions in 75 minutes, taken remotely under proctoring, with a Law-specific blueprint of 5 Mathematics, 11 Reading comprehension, 6 Numerical reasoning, 18 Logic and critical thinking and 10 Verbal reasoning items — logic-dominant, with reading passages that are humanistic rather than economic. It is a single non-adaptive fixed form delivered strictly forward-only: three questions per screen, and once "Next" is clicked returning to a previous screen is impossible. Scoring is +1 for a correct answer, 0 for an omission and -0.2 for a wrong answer, with -0.33 for three-option "critical thinking" items; the reported score is the penalised raw total out of 50 and a total below 17 means the applicant is not considered in the selection process. Choosing this test (or the LSAT) restricts the applicant to Bocconi Law School programmes, where the test counts 55% and third-last and second-last year GPA counts 45%.',

  sources: [
    {
      label: 'Online Bocconi test — official test description (English)',
      url: OFFICIAL_TEST_PAGE_EN,
      publisher: 'Bocconi University',
      verifiedOn: VERIFIED_ON,
    },
    {
      label: 'Test online Bocconi — official test description (Italian)',
      url: OFFICIAL_TEST_PAGE_IT,
      publisher: 'Università Bocconi',
      verifiedOn: VERIFIED_ON,
    },
    {
      label: 'Bachelor and Law programs — application and admissions',
      url: OFFICIAL_ADMISSIONS_PAGE,
      publisher: 'Bocconi University',
      verifiedOn: VERIFIED_ON,
    },
    {
      label: 'SAT, ACT and LSAT routes into Bocconi (Law: LSAT 147/180 minimum)',
      url: OFFICIAL_SAT_ACT_PAGE,
      publisher: 'Bocconi University',
      verifiedOn: VERIFIED_ON,
    },
    {
      label: 'Instructions and Rules of Conduct 2027-2028 (PDF)',
      url: OFFICIAL_RULES_PDF_2728,
      publisher: 'Bocconi University',
      verifiedOn: VERIFIED_ON,
    },
    {
      label: 'Instructions and Rules 2026-2027, English (PDF)',
      url: OFFICIAL_RULES_PDF_2627_EN,
      publisher: 'Bocconi University',
      verifiedOn: VERIFIED_ON,
    },
  ],

  sections: [
    {
      key: SECTION_KEY,
      name: 'Bocconi Online Test - Law (single 50-question form)',
      order: 0,
      officialQuestionCount: '50',
      officialTimeMinutes: 75,
      calculator: 'none',
      calculatorNote:
        'No calculator of any kind. The Instructions and Rules of Conduct list "notebooks, notes, formula sheets, calculators or any sources/resources available online" among prohibited items. Permitted on the desk: the computer, an identity document, 1 pencil/pen, 2 blank A4 sheets, a beverage and the printed test credentials. There is no on-screen calculator, so none is rendered.',
      navigation: FORWARD_ONLY_NAVIGATION,
      // The schema has no passage-group response type; reading-comprehension
      // items are single-select items authored against a shared passage
      // stimulus, which is a content-model concern rather than a response type.
      responseTypes: ['single_select'],
      notes: [
        'One continuous 75-minute session covers all 50 questions. Bocconi publishes no per-subject-area time limit and no scheduled break, and the candidate may not leave once the test has started.',
        'The five subject areas are NOT delivered as contiguous blocks: Bocconi states the questions are "distributed within the test in a mixed way both by difficulty level and by topic" (Italian page: "in modo casuale"). The exact interleaving pattern is not published.',
        'Questions are presented three per screen and must be answered in the order presented; clicking "Next" makes the previous screen permanently unreachable. There is no flag-for-review-and-return mechanism.',
        'After the last screen a summary page lists all questions including answered and omitted ones, then "Submit All and Finish" submits. We render that summary read-only because Bocconi does not publish whether answers can still be changed from it.',
        'On expiry the test closes automatically, answers are saved and the data is submitted. Our engine reproduces this: one server-authoritative 75-minute deadline, auto-submit on expiry.',
        'Reading-comprehension items hang off shared passages. Bocconi does not publish how a passage and its items map onto the three-questions-per-screen layout, nor how many passages there are, so we keep a passage group intact on a screen where possible and re-render the passage on every screen carrying its items.',
        'Delivery is fully online and remote-proctored (audio/video recording, a side-mounted mobile device, screen sharing and a Safe Exam Browser lockdown browser). Time spent on proctoring checks requested mid-test is not counted against the test duration.',
        'The test may be taken in Italian or English; the language choice is independent of the degree programme’s language of instruction.',
      ],
    },
  ],

  domains: [
    {
      slug: 'law-mathematics',
      name: 'Mathematics',
      sectionKey: SECTION_KEY,
      description:
        'A deliberately narrow syllabus: plane and analytic geometry, sets, ordering of the reals, percentages and unit conversion. Only 5 of the 50 Law items — a radically lighter weight and narrower scope than the standard Bocconi Online Test.',
      officialShare: '5 of 50 questions',
      skills: [
        {
          slug: 'law-math-plane-geometry',
          name: 'Plane geometry',
          description:
            'Fundamental formulas for triangles, rectangles, squares, trapezoids and circles.',
        },
        {
          slug: 'law-math-analytic-geometry-points',
          name: 'Analytic geometry: points and distances',
          description: 'Points in the plane and distances between points.',
        },
        {
          slug: 'law-math-analytic-geometry-lines',
          name: 'Analytic geometry: lines',
          description:
            'Analytical equations and properties of lines — parallel, perpendicular, slope, intersection of lines.',
        },
        {
          slug: 'law-math-sets',
          name: 'Sets',
          description: 'Inclusion, union, intersection, complement and Cartesian product.',
        },
        {
          slug: 'law-math-real-number-ordering',
          name: 'Ordering of the real numbers',
          description:
            'Ordering properties of real numbers with respect to the fundamental operations (addition, multiplication).',
        },
        {
          slug: 'law-math-percentages',
          name: 'Percentages',
          description: 'Percentage calculation and reasoning.',
        },
        {
          slug: 'law-math-units-conversion',
          name: 'Units of measure',
          description: 'Simple problems involving units of measure and conversions between them.',
        },
      ],
      source: OFFICIAL_TEST_PAGE_EN,
    },
    {
      slug: 'law-reading-comprehension',
      name: 'Reading comprehension',
      sectionKey: SECTION_KEY,
      description:
        'Comprehension of discursive, humanistic passages — pedagogy, history, philosophy, geography and similar topics — rather than the economics-flavoured passages used in the standard Bocconi Online Test.',
      officialShare: '11 of 50 questions',
      skills: [
        {
          slug: 'law-read-explicit-information',
          name: 'Explicit information',
          description: 'Comprehension of information explicitly stated in the passage.',
        },
        {
          slug: 'law-read-implicit-meaning',
          name: 'Implicit meaning',
          description:
            'Comprehension of the implicit meaning of the passage as a whole or of parts of it.',
        },
        {
          slug: 'law-read-humanistic-passages',
          name: 'Humanistic passages',
          description:
            'Processing discursive humanistic prose (pedagogy, history, philosophy, geography and similar), the register used in the Law test.',
        },
      ],
      source: OFFICIAL_TEST_PAGE_EN,
    },
    {
      slug: 'law-numerical-reasoning',
      name: 'Numerical reasoning',
      sectionKey: SECTION_KEY,
      description:
        'Reasoning over supplied numerical data — charts and tables — with only simple calculations and no advanced mathematics. No calculator is permitted.',
      officialShare: '6 of 50 questions',
      skills: [
        {
          slug: 'law-numrsn-charts-and-tables',
          name: 'Charts and tables',
          description: 'Reading and interpreting charts and tables correctly.',
        },
        {
          slug: 'law-numrsn-relevant-vs-superfluous',
          name: 'Relevant vs superfluous information',
          description:
            'Distinguishing information critical to the problem from superfluous information.',
        },
        {
          slug: 'law-numrsn-reasoning-over-calculation',
          name: 'Reasoning over calculation',
          description:
            'Solving problems primarily through reasoning on given data, with only simple calculations and no advanced mathematics.',
        },
      ],
      source: OFFICIAL_TEST_PAGE_EN,
    },
    {
      slug: 'law-logic-and-critical-thinking',
      name: 'Logic and critical thinking',
      sectionKey: SECTION_KEY,
      description:
        'The largest area of the Law test at 18 of 50 items. Covers "data propositions" judgement items and deductive-logic items built on a set of initial conditions.',
      officialShare: '18 of 50 questions',
      skills: [
        {
          slug: 'law-logic-data-propositions',
          name: 'Data propositions',
          description: 'Judging which statements do and do not follow from the data supplied.',
        },
        {
          slug: 'law-logic-deductive-conditions',
          name: 'Deductive logic from initial conditions',
          description:
            'A series of initial conditions followed by a question to be answered by deductive reasoning.',
        },
      ],
      source: OFFICIAL_TEST_PAGE_EN,
    },
    {
      slug: 'law-verbal-reasoning',
      name: 'Verbal reasoning',
      sectionKey: SECTION_KEY,
      description:
        'Argument analysis: judging statements against a brief argument and identifying assumptions, conclusions, logical errors and the statements that most weaken or strengthen an argument.',
      officialShare: '10 of 50 questions',
      skills: [
        {
          slug: 'law-verbal-true-false-not-deducible',
          name: 'True / false / not deducible',
          description:
            'A brief argument followed by a statement to be judged true, false, or not deducible from the given data.',
        },
        {
          slug: 'law-verbal-assumption',
          name: 'Assumption',
          description: 'Identifying the assumption on which an argument depends.',
        },
        {
          slug: 'law-verbal-conclusion',
          name: 'Conclusion',
          description: 'Identifying the logical conclusion of an argument.',
        },
        {
          slug: 'law-verbal-logical-error',
          name: 'Logical error',
          description: 'Identifying logical errors in an argument.',
        },
        {
          slug: 'law-verbal-weaken-strengthen',
          name: 'Weaken and strengthen',
          description:
            'Identifying the statement that most weakens, or most strengthens, an argument.',
        },
      ],
      source: OFFICIAL_TEST_PAGE_EN,
    },
  ],

  blueprints: [
    {
      id: 'diagnostic',
      label: 'Bocconi Law diagnostic (15 questions)',
      mode: 'diagnostic',
      description:
        'A short skill check across all five Bocconi Law subject areas: three questions each from Mathematics, Reading comprehension, Numerical reasoning, Logic and critical thinking and Verbal reasoning. Each area is a separate part so the result shows where you stand per area.',
      parts: [
        {
          key: 'diagnostic-mathematics',
          sectionKey: SECTION_KEY,
          label: 'Mathematics',
          timeLimitSeconds: 3 * DIAGNOSTIC_SECONDS_PER_ITEM,
          itemCount: 3,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['law-mathematics'],
            skills: [],
            responseTypes: ['single_select'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: PRACTICE_NAVIGATION_OVERRIDE,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diagnostic-reading-comprehension',
          sectionKey: SECTION_KEY,
          label: 'Reading comprehension',
          timeLimitSeconds: 3 * DIAGNOSTIC_SECONDS_PER_ITEM,
          itemCount: 3,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['law-reading-comprehension'],
            skills: [],
            responseTypes: ['single_select'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: PRACTICE_NAVIGATION_OVERRIDE,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diagnostic-numerical-reasoning',
          sectionKey: SECTION_KEY,
          label: 'Numerical reasoning',
          timeLimitSeconds: 3 * DIAGNOSTIC_SECONDS_PER_ITEM,
          itemCount: 3,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['law-numerical-reasoning'],
            skills: [],
            responseTypes: ['single_select'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: PRACTICE_NAVIGATION_OVERRIDE,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diagnostic-logic-and-critical-thinking',
          sectionKey: SECTION_KEY,
          label: 'Logic and critical thinking',
          timeLimitSeconds: 3 * DIAGNOSTIC_SECONDS_PER_ITEM,
          itemCount: 3,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['law-logic-and-critical-thinking'],
            skills: [],
            responseTypes: ['single_select'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: PRACTICE_NAVIGATION_OVERRIDE,
          breakAfterSeconds: null,
          adaptive: null,
        },
        {
          key: 'diagnostic-verbal-reasoning',
          sectionKey: SECTION_KEY,
          label: 'Verbal reasoning',
          timeLimitSeconds: 3 * DIAGNOSTIC_SECONDS_PER_ITEM,
          itemCount: 3,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['law-verbal-reasoning'],
            skills: [],
            responseTypes: ['single_select'],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: PRACTICE_NAVIGATION_OVERRIDE,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
      timing: 'per_part',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_pauses',
      fidelity: 'practice_only',
      fidelityNote:
        'This is a short skill check, not a predictor of a Bocconi Online Test - Law score. Fifteen questions cannot estimate a 50-question result, the per-area allowance of 135 seconds per question is roughly 1.5x the real test’s 90-second average pace, the forward-only lock is relaxed so you can review your work, and our questions are original items written to Bocconi’s published syllabus rather than Bocconi items.',
    },
    {
      id: 'practice',
      label: 'Practice set (10 questions)',
      mode: 'practice',
      description:
        'An untimed set of 10 questions drawn from anywhere in the Bocconi Law syllabus. This is a template: choose the subject area, difficulty and length you want at the start of the session.',
      parts: [
        {
          key: 'practice-set',
          sectionKey: SECTION_KEY,
          label: 'Practice set',
          timeLimitSeconds: null,
          itemCount: 10,
          selection: {
            sectionKey: SECTION_KEY,
            // Empty = any domain. Learners narrow this at runtime.
            domains: [],
            skills: [],
            responseTypes: [],
            difficultyMix: null,
            allowRepeatsWithinAttempt: false,
            avoidSeenWithinDays: 30,
          },
          navigationOverride: PRACTICE_NAVIGATION_OVERRIDE,
          breakAfterSeconds: null,
          adaptive: null,
        },
      ],
      timing: 'untimed',
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_pauses',
      fidelity: 'practice_only',
      fidelityNote:
        'Untimed study practice, not a reproduction of the exam. There is no clock, you can move backwards and change answers, and the mix of subject areas is whatever you choose rather than Bocconi’s published 5 / 11 / 6 / 18 / 10 split. Our questions are original items written to Bocconi’s published syllabus.',
    },
    {
      id: `timed-${SECTION_KEY}`,
      label: 'Timed full-length set — 50 questions in 75 minutes',
      mode: 'practice',
      description:
        'The real published length and clock: 50 questions in 75 minutes, delivered under the exam’s own forward-only rule. Use it to train pacing at the 90-seconds-per-question average the real test demands.',
      parts: [
        {
          key: 'timed-full-form',
          sectionKey: SECTION_KEY,
          label: 'Bocconi Online Test - Law (timed)',
          timeLimitSeconds: TOTAL_TIME_SECONDS,
          itemCount: 50,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [
              'law-mathematics',
              'law-reading-comprehension',
              'law-numerical-reasoning',
              'law-logic-and-critical-thinking',
              'law-verbal-reasoning',
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
      overallTimeLimitSeconds: null,
      pauseBehaviour: 'clock_pauses',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real test: 50 questions, a single server-enforced 75-minute clock, no break, no calculator, the forward-only navigation lock (no returning to a passed question, no flag-and-return, a read-only summary before submission) and +1 / 0 / -0.2 scoring. What does not: this blueprint does not enforce Bocconi’s published 5 / 11 / 6 / 18 / 10 per-area split — the full simulation does — and the clock pauses if you leave, whereas the real test does not. Our questions are original items written to Bocconi’s published syllabus, not Bocconi questions; there are no unscored pretest items; and difficulty labels are our editorial judgement, not calibrated item statistics. Bocconi does not publish how many answer options each item carries (only that some "critical thinking" items have three), so our option counts are an editorial choice.',
    },
    {
      id: 'simulation-full',
      label: 'Full simulation — Bocconi Online Test - Law',
      mode: 'simulation',
      description:
        'The complete published structure: 50 questions in one continuous 75-minute session, built to Bocconi’s 5 / 11 / 6 / 18 / 10 subject-area blueprint, with no break, no calculator and the strict forward-only navigation lock. The clock keeps running if you leave, exactly as it does in the real test.',
      parts: [
        {
          key: 'simulation-mathematics',
          sectionKey: SECTION_KEY,
          label: 'Mathematics (5 questions)',
          timeLimitSeconds: null,
          itemCount: 5,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['law-mathematics'],
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
            domains: ['law-reading-comprehension'],
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
            domains: ['law-numerical-reasoning'],
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
          key: 'simulation-logic-and-critical-thinking',
          sectionKey: SECTION_KEY,
          label: 'Logic and critical thinking (18 questions)',
          timeLimitSeconds: null,
          itemCount: 18,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['law-logic-and-critical-thinking'],
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
          key: 'simulation-verbal-reasoning',
          sectionKey: SECTION_KEY,
          label: 'Verbal reasoning (10 questions)',
          timeLimitSeconds: null,
          itemCount: 10,
          selection: {
            sectionKey: SECTION_KEY,
            domains: ['law-verbal-reasoning'],
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
      // One clock for the whole form, exactly as published. Bocconi sets no
      // per-area time limit, so none is invented here.
      timing: 'overall',
      overallTimeLimitSeconds: TOTAL_TIME_SECONDS,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the real test: 50 questions under one continuous, server-enforced 75-minute clock that keeps running if you leave; the published 5 Mathematics / 11 Reading comprehension / 6 Numerical reasoning / 18 Logic and critical thinking / 10 Verbal reasoning blueprint; no break and no pause; no calculator; strictly forward-only navigation with no way back to a passed question and no flag-and-return; a read-only summary of answered and omitted questions before final submission; auto-submit when time expires; and +1 / 0 / -0.2 scoring reported as a penalised raw total out of 50 with the 17-point eligibility floor shown as an eligibility note. What does not match: we deliver the five subject areas as consecutive groups, whereas the real test interleaves items of all five areas three per screen — Bocconi does not publish the interleaving pattern, so it cannot be reproduced. Our questions are original items written to Bocconi’s published syllabus, not Bocconi questions; none are unscored pretest items; difficulty labels are our editorial judgement, not calibrated item statistics; and the number of answer options per item is our editorial choice, because Bocconi publishes an option count only for some three-option "critical thinking" items. We also let you review every question afterwards, which the live test does not — that is our educational addition.',
    },
  ],

  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: -0.2,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'Bocconi Online Test - Law total score (penalties included), out of 50',
      min: -10,
      max: 50,
      increment: 0.2,
      note: 'Bocconi reports the penalised raw total out of 50, plus per-subject-area subtotals and correct/wrong/omitted counts on the Test Score Report. 50 is the published maximum (50 correct answers at +1). A total below 17 means the applicant "will not be considered in the selection process" — an eligibility floor, not an admission cut-off; Bocconi publishes no cut-off or competitive score for Law or Global Law. The lower bound and the 0.2 increment shown here are arithmetic consequences of the published +1 / 0 / -0.2 rule, not figures Bocconi publishes: a score can be negative, and the granularity is finer wherever the -0.33 three-option penalty applies.',
    },
    scaledEstimate: {
      enabled: false,
      reason:
        'Bocconi reports the Bocconi Online Test - Law as a penalised raw total out of 50 and publishes no raw-to-scaled conversion at all — there is no scale to convert to. The only equating Bocconi performs is between the Bocconi test, SAT and ACT, via "an internal conversion system based on comparative tables that analyze candidate percentiles" whose tables are not published, and it does not publish how the 55% test weight is normalised before being combined with the 45% GPA weight. With no published method, any estimated scaled score, percentile or SAT/ACT/LSAT equivalent we produced would be fabricated.',
    },
    notes: [
      'Official raw scoring: correct answer +1, missing/omitted answer 0, wrong answer -0.2.',
      'Exception published by Bocconi: "For questions of the “critical thinking” area that give only three possible answer options, the penalty will be -0.33 points." This is carried as per-item data (an item authored with three options in the Logic and critical thinking domain), not as the config-level penalty, so the -0.2 / -0.33 split stays data rather than code. Whether the rule applies inside the Law test is not explicitly stated by Bocconi — see unverified.',
      'Maximum raw score is 50. Omitting is never penalised, and Bocconi’s Italian page states each candidate decides autonomously which and how many questions to attempt.',
      'A total score below 17 (penalties included) makes the applicant ineligible for the selection process. Present this as "minimum to be considered", never as a target score, a pass/fail line or an admission prediction.',
      'For Law School admission the selection test score is weighted 55% and third-last and second-last year GPA 45%. Bocconi does not publish how the test score is normalised before that weighting is applied.',
      'The results screen shows the penalised raw total, per-domain subtotals mirroring Bocconi’s subject-area score report, correct/wrong/omitted counts, timing and omission rate — no scaled score, no percentile, no predicted admission outcome.',
      'Bocconi does not publish whether any of the 50 items are unscored pretest items, so every item in our simulation is scored.',
    ],
  },

  capabilities: {
    fullSimulation: {
      available: true,
      note: 'Timing, navigation and section structure are all fully published and verified for the 2027-28 cycle (50 questions; one continuous 75-minute session; no break; strictly forward-only in screens of three; a fixed 5 / 11 / 6 / 18 / 10 subject-area blueprint), and the test is not adaptive, so a faithful full-length simulation is possible. Two honest gaps remain and are stated on the blueprint: Bocconi does not publish the pattern by which items from the five areas are interleaved across screens, so we deliver the areas as consecutive groups under the single 75-minute clock; and Bocconi publishes an answer-option count only for some three-option "critical thinking" items, so our option counts are an editorial choice.',
    },
    adaptiveRouting: {
      available: false,
      reason:
        'There is no adaptive behaviour to approximate. Bocconi delivers a single non-adaptive fixed form of 50 items with no routing, no modules and no stage-based difficulty adjustment: "The questions are distributed within the test in a mixed way both by difficulty level and by topic." Offering adaptive routing here would misrepresent the exam.',
    },
    scaledScoreEstimate: {
      available: false,
      reason:
        'No scaled score exists for this exam. Bocconi reports a penalised raw total out of 50 and publishes no raw-to-scaled conversion; its SAT/ACT equivalence rests on unpublished internal percentile comparative tables. There is nothing to estimate against.',
    },
  },

  unverified: [
    'Number of answer options per item. Bocconi discloses only that SOME "critical thinking" items have three options; the option count for Mathematics, Reading comprehension, Numerical reasoning, Verbal reasoning and the remaining logic items is not published, so our option counts are editorial and no option-count fidelity is claimed.',
    'Whether the -0.33 three-option penalty applies inside the Law test. The rule is worded for the “critical thinking” area while the Law test’s area is named "Logic and critical thinking", and Bocconi does not state the mapping explicitly.',
    'The exact interleaving pattern of the 50 items — which three items share a screen, and whether the subject areas appear in any fixed order. Only "mixed by difficulty and topic" (Italian: "in modo casuale") is published.',
    'Whether a visible countdown timer is displayed during the live test. A timer is confirmed only for Bocconi’s own practice simulation.',
    'Whether answers can still be changed from the pre-submission summary page, or whether that page is view-only. We render it read-only as the conservative reading.',
    'Whether a reading-comprehension passage stays visible across screen boundaries when its questions span more than one three-question screen.',
    'Item pool size, whether forms are randomised per candidate or per session, and whether any of the 50 items are unscored pretest items.',
    'The exact amount of additional time granted as a disability or specific-learning-disorder accommodation. No percentage or minute figure is published, so no accommodation preset is offered.',
    'Any admission cut-off or "competitive" score for Law or Global Law. Only the 17/50 eligibility floor is official; no target-score or admission-probability feature may be shown for this exam.',
    'The scale used for per-subject-area scores on the Test Score Report. Raw points are assumed but the report format is not published.',
    'Whether the Law test uses the same item-writing and difficulty-calibration process as the standard Bocconi Online Test. No item-difficulty calibration or IRT parameters are published for either, so our difficulty labels are editorial.',
    'Autosave, reconnect and resume behaviour during a live attempt. Bocconi documents only that answers are saved on time expiry and that technical failures may void the attempt.',
    'How the 55% test-score weight is normalised or rescaled before being combined with the 45% GPA weight, and the internal percentile comparative tables Bocconi uses to equate Bocconi, SAT, ACT and LSAT results.',
  ],
};
