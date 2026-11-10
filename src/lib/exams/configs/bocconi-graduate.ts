import type { ExamConfig, NavigationPolicy } from '@/lib/assessment/types';

/**
 * Online Bocconi test — INTERNATIONAL GRADUATE APPLICANTS variant (Master of
 * Science and MA programmes).
 *
 * Facts come from two records:
 *
 *  - content/exam-specs/_raw/bocconi-admissions-requirements.draft.json
 *    (claim `msc-graduate-bocconi-test`, verified 2026-09-18), from the
 *    graduate test page: 50 multiple-choice questions, Verbal reasoning 24 /
 *    Data insight 16 / Quantitative reasoning 10, 75 minutes, "Right answer:
 *    1 point", "Missing answer: 0 points", "Wrong answer: -0.25/-0.33 points",
 *    a floor of 15 out of 50, at most three attempts per academic year;
 *  - docs/research/bocconi-master-facts-2026-11-09.md (checked 2026-11-09),
 *    which re-confirmed all of the above and read Bocconi's graduate-specific
 *    "BOCCONI ONLINE TEST Academic Year 2027/28 - Instructions and Rules of
 *    Conduct - Master of Science Programs" PDF. That PDF is written for this
 *    test, not borrowed from the bachelor one, and publishes:
 *      - three questions per screen; after "Next" you "will not be able to
 *        return to previous screens"; a summary of answered and omitted
 *        questions before "Submit All and Finish"; automatic submission when
 *        the time runs out (sections 3.2-3.3);
 *      - calculators among the items whose "presence and/or use" is not
 *        permitted (rule 5); on the desk only the computer, an ID, one pen or
 *        pencil, two blank A4 sheets, a drink and the printed credentials;
 *      - a score report with the total, the score per area and the counts of
 *        correct, incorrect and unanswered questions.
 *    The graduate test page adds that the questions are "distributed within
 *    the test in a mixed way, both by difficulty level and by topic".
 *
 * So the section now uses the bachelor config's forward-only pattern
 * (src/lib/exams/configs/bocconi-undergraduate.ts), sourced to the graduate
 * PDF, and the calculator is off as a verified rule.
 *
 * Still NOT published, and listed in `unverified`: which items carry -0.33
 * instead of -0.25, the number of options per question, any time per area,
 * and the details of the summary page and the navigation panel. Because the
 * scoring rule cannot be reproduced item by item, there is still no full
 * simulation (docs/research/README.md: a simulation only when every rule it
 * depends on is verified). The timed 50-question block runs under the real
 * forward-only rule and scores every wrong answer at -0.25, and says so.
 */

const OFFICIAL_TEST_PAGE =
  'https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/online-bocconi-test-international-graduate-applicants';
const OFFICIAL_RULES_PDF =
  'https://www.unibocconi.it/sites/default/files/GR_Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf';
const MSC_ADMISSIONS_OVERVIEW =
  'https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions';
const MSC_ADMISSIONS_PAGE =
  'https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/admissions';
const MSC_GMAT_GRE_PAGE =
  'https://www.unibocconi.it/en/applying-bocconi/master-science-and-ma-programs/application-and-admissions/gmat-and-gre-test';

const SECTION_KEY = 'online-test';
const TOTAL_TIME_SECONDS = 75 * 60;

/**
 * The real exam's navigation rule, from the graduate Instructions and Rules
 * of Conduct, AY 2027/28, sections 3.2-3.3. Server-enforced: the API rejects
 * any attempt to revisit or amend a committed screen.
 */
const forwardOnlyNavigation: NavigationPolicy = {
  // "3 questions on each screen"; after "Next" you "will not be able to
  // return to previous screens".
  allowBackWithinPart: false,
  pageSize: 3,
  // A missing answer scores 0 and the summary counts omitted questions, so a
  // candidate may advance while leaving questions blank.
  allowForwardSkip: true,
  // The three questions on the current screen stay editable until "Next".
  allowChangeAnswer: true,
  allowFlagForReview: false,
  allowReturnToPreviousPart: false,
  // "Finish" shows a summary of answered and omitted questions before
  // "Submit All and Finish"; we treat it as read-only, as the forward-only
  // rule implies.
  reviewScreen: true,
  reviewScreenEditable: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source: OFFICIAL_RULES_PDF,
};

/**
 * Relaxed navigation used ONLY by the study blueprints (diagnostic and the
 * open practice template). They are study tools, not test-day conditions, and
 * their fidelity notes say so.
 */
const practiceNavigationOverride: Partial<NavigationPolicy> = {
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: true,
  reviewScreen: true,
  enforcement: 'server',
};

const DOMAINS = {
  verbal: 'bocconi-grad-verbal-reasoning',
  data: 'bocconi-grad-data-insight',
  quant: 'bocconi-grad-quantitative-reasoning',
} as const;

export const bocconiGraduateConfig: ExamConfig = {
  examKey: 'bocconi-graduate',
  version: '2026.11',
  name: 'Online Bocconi Test (international graduate applicants)',
  shortName: 'Bocconi Graduate Test',
  publisher: 'Bocconi University',
  versionLabel:
    'Online Bocconi test - International Graduate applicants, as published for the AY 2027-28 Master of Science and MA admissions cycle. Structure, timing, scoring, the eligibility floor and the attempt limit are verified on the official graduate test page; navigation, the calculator ban, permitted materials and the score report are verified from the graduate "Instructions and Rules of Conduct - Master of Science Programs" PDF for AY 2027/28. Which items carry the -0.33 penalty and how many options each question has are not published.',
  admissionsCycle:
    'AY 2027-28 MSc and MA admissions (four rounds for international candidates: Round I 1-29 October 2026, Round II 30 October 2026 - 26 January 2027, Round III 27 January - 11 March 2027, Round IV 12 March - 29 April 2027)',
  verifiedOn: '2026-11-09',
  audience: ['graduate'],
  summary:
    "Bocconi University's own online admission test for international applicants to its Master of Science and MA programmes, accepted as an alternative to the GMAT or GRE. It is a different test from the bachelor and law forms: 50 multiple-choice questions in three areas (Verbal reasoning 24, Data insight 16, Quantitative reasoning 10) in 75 minutes, mixed through the test rather than grouped. Questions come three to a screen and you cannot go back to an earlier screen; calculators are not allowed. A correct answer scores +1, a blank 0 and a wrong answer -0.25 (-0.33 on some items Bocconi does not identify), so omitting beats blind guessing. Applicants scoring lower than 15 out of 50 are not considered; Bocconi publishes no admission cut-off, and the test result is one of three compulsory elements of an MSc application, alongside undergraduate GPA and transcripts and the evaluation of the dossier and motivation. At most three attempts are allowed per academic year.",

  sources: [
    {
      label:
        'Online Bocconi test - International Graduate applicants — official test page (areas, question counts, timing, scoring, eligibility floor, attempts, mixed order)',
      url: OFFICIAL_TEST_PAGE,
      publisher: 'Bocconi University',
      verifiedOn: '2026-11-09',
    },
    {
      label:
        'Bocconi Online Test, AY 2027/28 — Instructions and Rules of Conduct, Master of Science Programs (navigation, calculator ban, permitted materials, auto-submission, score report)',
      url: OFFICIAL_RULES_PDF,
      publisher: 'Bocconi University',
      verifiedOn: '2026-11-09',
    },
    {
      label: 'Master of Science and MA programs — application and admissions (accepted tests: GMAT, GRE, Online Bocconi test)',
      url: MSC_ADMISSIONS_OVERVIEW,
      publisher: 'Bocconi University',
      verifiedOn: '2026-11-09',
    },
    {
      label: 'Master of Science and MA programs — admissions (three compulsory elements, selection rounds)',
      url: MSC_ADMISSIONS_PAGE,
      publisher: 'Bocconi University',
      verifiedOn: '2026-11-09',
    },
    {
      label: 'GMAT and GRE test — accepted editions, minimums and five-year validity',
      url: MSC_GMAT_GRE_PAGE,
      publisher: 'Bocconi University',
      verifiedOn: '2026-11-09',
    },
  ],

  sections: [
    {
      key: SECTION_KEY,
      name: 'Online Bocconi test (graduate) — 75 minutes',
      order: 0,
      officialQuestionCount: '50 (Verbal reasoning 24, Data insight 16, Quantitative reasoning 10)',
      officialTimeMinutes: 75,
      calculator: 'none',
      calculatorNote:
        'No calculator. The graduate Instructions and Rules of Conduct list calculators among the items whose "presence and/or use" is not permitted. The test runs inside the Safe Exam Browser, so there is no on-screen calculator either. On the desk you may have only the computer, an identity document, one pen or pencil, two blank A4 sheets, a drink and your printed access credentials; you may be asked to show the sheets to the webcam.',
      navigation: forwardOnlyNavigation,
      responseTypes: ['single_select'],
      notes: [
        'The three areas are reporting categories, not delivered sections. Bocconi states that the questions are "distributed within the test in a mixed way, both by difficulty level and by topic", and publishes no time per area.',
        'Navigation, per sections 3.2-3.3 of the graduate Instructions and Rules of Conduct: three questions on each screen; after "Next" you "will not be able to return to previous screens". A question left blank on a screen can never be revisited. "Finish" shows a summary of answered and omitted questions before "Submit All and Finish".',
        'The test submits itself when the 75 minutes run out. No breaks are described, and leaving the workstation once the test has started is not permitted.',
        'Delivery: online at home on the Giunti Psychometrics platform, inside the Safe Exam Browser, with a webcam and a side smartphone camera recording the session. Proctoring is not live; the University reviews the recordings afterwards.',
        'The total score is shown on screen at the end. About 48 hours later the score report gives the total, the score per area, the numbers of correct, incorrect and unanswered questions, and a reference number.',
        'The test may be taken in Italian or English, chosen at purchase. At most three attempts per academic year, not on the same day or on consecutive days. Each attempt costs EUR 60.',
      ],
    },
  ],

  domains: [
    {
      slug: DOMAINS.verbal,
      name: 'Verbal reasoning',
      sectionKey: SECTION_KEY,
      description:
        'The largest area: 24 of the 50 questions. Bocconi publishes the area name and its question count only. The two skills below are our own descriptive grouping for tagging practice questions, not an official Bocconi syllabus.',
      officialShare: '24 of 50 questions',
      skills: [
        {
          slug: 'grad-verbal-passage-reasoning',
          name: 'Reasoning from a passage',
          description:
            'Our grouping, not an official Bocconi sub-skill: understanding what a passage states, implies and is arguing for.',
        },
        {
          slug: 'grad-verbal-argument-analysis',
          name: 'Analysing an argument',
          description:
            'Our grouping, not an official Bocconi sub-skill: finding the assumption, weakness or strengthening point in a short argument.',
        },
      ],
      source: OFFICIAL_TEST_PAGE,
    },
    {
      slug: DOMAINS.data,
      name: 'Data insight',
      sectionKey: SECTION_KEY,
      description:
        '16 of the 50 questions. Bocconi publishes the area name and its question count only. The two skills below are our own descriptive grouping for tagging practice questions built on tables and charts, not an official Bocconi syllabus.',
      officialShare: '16 of 50 questions',
      skills: [
        {
          slug: 'grad-data-reading-displays',
          name: 'Reading tables and charts',
          description:
            'Our grouping, not an official Bocconi sub-skill: locating and comparing the figures a table or chart shows.',
        },
        {
          slug: 'grad-data-derived-conclusions',
          name: 'Conclusions and derived figures',
          description:
            'Our grouping, not an official Bocconi sub-skill: computing shares, rates and changes from data, and judging what the data does and does not support.',
        },
      ],
      source: OFFICIAL_TEST_PAGE,
    },
    {
      slug: DOMAINS.quant,
      name: 'Quantitative reasoning',
      sectionKey: SECTION_KEY,
      description:
        '10 of the 50 questions. Bocconi publishes the area name and its question count only. The two skills below are our own descriptive grouping for tagging practice questions, not an official Bocconi syllabus.',
      officialShare: '10 of 50 questions',
      skills: [
        {
          slug: 'grad-quant-numbers-percentages',
          name: 'Numbers, ratios and percentages',
          description:
            'Our grouping, not an official Bocconi sub-skill: arithmetic, ratios, percentage change and averages in worded problems.',
        },
        {
          slug: 'grad-quant-algebra-problem-solving',
          name: 'Algebra and problem solving',
          description:
            'Our grouping, not an official Bocconi sub-skill: setting up and solving equations, and counting and probability in worded problems.',
        },
      ],
      source: OFFICIAL_TEST_PAGE,
    },
  ],

  blueprints: [
    {
      id: 'diagnostic',
      label: 'Bocconi graduate diagnostic skill check',
      mode: 'diagnostic',
      description:
        'A short 12-item check across the three areas of the graduate test, timed generously so the result reflects what you know rather than how fast you work.',
      parts: [
        {
          key: 'diagnostic-verbal',
          sectionKey: SECTION_KEY,
          label: 'Verbal reasoning',
          timeLimitSeconds: 675,
          itemCount: 5,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [DOMAINS.verbal],
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
          key: 'diagnostic-data-insight',
          sectionKey: SECTION_KEY,
          label: 'Data insight',
          timeLimitSeconds: 540,
          itemCount: 4,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [DOMAINS.data],
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
          key: 'diagnostic-quantitative',
          sectionKey: SECTION_KEY,
          label: 'Quantitative reasoning',
          timeLimitSeconds: 405,
          itemCount: 3,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [DOMAINS.quant],
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
        'A short skill check, not a predictor of a Bocconi test score. It groups the three areas into separate timed parts at about 135 seconds per item, roughly 1.5x the real average pace of 90 seconds (75 minutes for 50 questions), and lets you go back and change answers, which the real test does not. Use it to find weak areas, nothing more.',
    },
    {
      id: 'practice',
      label: 'Bocconi graduate practice set',
      mode: 'practice',
      description:
        'An untimed 10-item set drawn from any of the three areas. This is a template: choose the area, difficulty and length you want before you start.',
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
        'A study tool, not a reproduction of the exam. It is untimed, you can move back and change answers, and the defaults here are overridden by whatever you pick at runtime. The real graduate test is 50 questions in 75 minutes, three per screen with no going back, and a penalty for wrong answers.',
    },
    {
      id: 'timed-online-test',
      label: 'Full-length timed Bocconi graduate block (50 items, 75 minutes)',
      mode: 'practice',
      description:
        "The published shape of the graduate Online Bocconi test: 50 questions under one 75-minute clock that keeps running, three per screen with no way back, no calculator, scored with Bocconi's -0.25 penalty for a wrong answer.",
      parts: [
        {
          key: 'timed-online-test-block',
          sectionKey: SECTION_KEY,
          label: 'Online Bocconi test (graduate) — 50 questions, 75 minutes',
          timeLimitSeconds: TOTAL_TIME_SECONDS,
          itemCount: 50,
          selection: {
            sectionKey: SECTION_KEY,
            domains: [DOMAINS.verbal, DOMAINS.data, DOMAINS.quant],
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
      overallTimeLimitSeconds: TOTAL_TIME_SECONDS,
      pauseBehaviour: 'clock_runs',
      fidelity: 'approximation',
      fidelityNote:
        'What matches the published test: 50 questions under one 75-minute clock that keeps running and submits at the end, three questions per screen with no return to an earlier screen, no calculator, and +1 / 0 / -0.25 scoring reported as a penalised total out of 50, with the 15-point eligibility floor shown as a floor, not a target. What differs, because Bocconi does not publish it: every wrong answer here costs -0.25 (Bocconi says some items cost -0.33 but not which), so a real form could score slightly lower for the same answers; the number of options per question is our editorial choice; and the 24 / 16 / 10 area mix is not guaranteed, because the block draws from the whole pool, mixed as the real test is mixed. Our questions are original and their difficulty labels are editorial, not calibrated.',
    },
  ],

  choiceOptions: {
    count: 4,
    basis: 'editorial',
    note: 'Bocconi publishes no option count for the graduate test; four is our choice, and some earlier items have five. Its 2024 sample paper mostly shows four.',
  },
  scoring: {
    pointsCorrect: 1,
    pointsIncorrect: -0.25,
    pointsOmitted: 0,
    multiSelectGrading: 'all_or_nothing',
    officialScale: {
      label: 'Online Bocconi test (graduate) total score (penalties included), out of 50',
      min: -12.5,
      max: 50,
      increment: 0.01,
      note: 'The total is out of 50: Bocconi states its floor as "15 out of 50". 50 is the maximum (50 correct at +1). The lower bound shown here is our arithmetic for 50 wrong answers at -0.25, not a figure Bocconi publishes; items carrying -0.33 would push it lower, and whether a negative total is reported is not published. The 0.01 increment reflects the two-decimal granularity the -0.33 penalty implies. The score report also gives the score per area and the numbers of correct, incorrect and unanswered questions.',
    },
    scaledEstimate: {
      enabled: false,
      reason:
        'There is no scale to estimate: the graduate Online Bocconi test is reported as a penalised total out of 50, and Bocconi publishes no conversion, percentile table or equating between attempts. When an applicant submits more than one accepted test, Bocconi says the system considers the most competitive one, but it does not publish how a Bocconi total is compared with a GMAT or GRE score. With no published method there is nothing defensible to estimate.',
    },
    notes: [
      'Official scoring for this variant: "Right answer: 1 point", "Missing answer: 0 points", "Wrong answer: -0.25/-0.33 points".',
      'The -0.33 penalty: Bocconi gives the wrong-answer penalty as "-0.25/-0.33" without saying which items carry -0.33. We do not guess. Our engine scores every wrong answer at -0.25, so a real form could score slightly lower than ours for the same answers.',
      'ELIGIBILITY FLOOR, NOT A TARGET: an applicant with a total "lower than 15 out of 50 will not be considered in the selection process". This is an exclusion threshold, not a pass mark and not an admission predictor.',
      'Omitted answers cost nothing and wrong answers cost 0.25 (or 0.33), so leaving a question blank can beat a blind guess. Bocconi does not publish how many options each question has, so no exact break-even rule is stated here.',
      'The test result is one of three compulsory elements of an MSc application, with undergraduate GPA and transcripts and the evaluation of the dossier and motivation: "Applications will not be evaluated if any of these three elements are missing." Bocconi publishes no admission cut-off and no average admitted score.',
      'Alternatives Bocconi accepts for the same programmes: the GMAT (GMAT Exam minimum 500 out of 800; GMAT Focus Edition minimum 485 out of 805) and the GRE General Test or Shorter GRE (the GRE General Test at Home is not accepted). Scores are accepted if no more than five years old. For the GRE Bocconi publishes a table of Verbal and Quantitative combinations rather than one minimum; see its GMAT and GRE page.',
      'At most three attempts per academic year, not on the same day or on consecutive days. Attempts from earlier academic years and scores from Bocconi’s online simulation cannot be used.',
    ],
  },

  capabilities: {
    fullSimulation: {
      available: false,
      reason:
        'Bocconi now publishes the graduate test’s size, areas, time, mixed order, navigation (three questions per screen, no return), calculator ban and score report, and our timed 50-question block follows all of them. One rule a simulation’s score depends on is still missing: Bocconi gives the wrong-answer penalty as "-0.25/-0.33" without saying which items carry -0.33, and it does not publish how many options each question has. A simulation would have to invent that scoring rule, so the block stays labelled as an approximation and no simulation is offered.',
    },
    adaptiveRouting: {
      available: false,
      reason:
        'Bocconi describes a fixed 50-question test with fixed area counts and makes no claim of adaptive delivery, routing or ability estimation for any Online Bocconi test variant. There is no adaptive behaviour to approximate.',
    },
    scaledScoreEstimate: {
      available: false,
      reason:
        'No scaled score exists for this test. Bocconi reports a penalised total out of 50 and publishes no conversion, no percentiles and no equating with GMAT or GRE scores.',
    },
  },

  unverified: [
    'Which items carry the -0.33 penalty instead of -0.25. Bocconi gives "-0.25/-0.33" without naming the items, on the test page, in the rules PDF and in its sample paper. ASSUMPTION in our scoring: every wrong answer costs -0.25.',
    'Number of answer options per question. Not published; our option counts are an editorial choice. Bocconi’s 2024 sample paper mostly shows four, but it is not linked from the current page.',
    'Time per area, and the exact order in which the mixed areas appear across the screens. Only the 75-minute total and the mixing are published; we set no per-area time.',
    'Whether the end-of-test summary page lets a candidate answer omitted questions or change answers, or is view-only. We assume view-only, consistent with the forward-only rule.',
    'What the on-screen "Test Navigation" panel does: whether it only shows progress or also allows jumping forward.',
    'The additional time granted as an accommodation. Bocconi applies it through a code but publishes no amount; any extra time we offer is a generic study aid.',
    'The theoretical minimum score, and whether a negative total is reported.',
    'Whether forms are equated across the three permitted attempts, and whether any items are unscored pretest questions. Every item in our practice is scored.',
    'How Bocconi compares a graduate Online Bocconi test total with GMAT or GRE scores when it "considers the most competitive one".',
  ],
};
