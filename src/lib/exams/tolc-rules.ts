import type { NavigationPolicy } from '@/lib/assessment/types';

/**
 * Rules common to every CISIA TOLC, from the TOLC 2026 regulation
 * (Regolamento TOLC 2026), read first-hand on 29 September 2026.
 */

export const TOLC_REGULATION_2026 = 'https://www.cisiaonline.it/sites/default/files/Regolamenti/Regolamento-TOLC-2026.pdf';
export const TOLC_RULES_PAGE = 'https://www.cisiaonline.it/en/tolc/all-about-tolc/TOLC-rules';

/**
 * Sections are taken in order, each with its own clock; a closed section
 * cannot be reopened (CISIA structure pages: "you will not be able to go back
 * to the previous section"). Movement WITHIN a section is not described by
 * CISIA; we allow it, and every TOLC config lists that as unverified.
 */
export const tolcSectionNavigation = (source: string): NavigationPolicy => ({
  allowBackWithinPart: true,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: false,
  allowReturnToPreviousPart: false,
  reviewScreen: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
  source,
});

export const TOLC_NO_CALCULATOR =
  'No calculator or other aid. Regolamento TOLC 2026, 4.1.5: "Durante lo svolgimento del TOLC non può essere utilizzato alcuno strumento di calcolo o didattico o di supporto" except aids granted to candidates with a disability or specific learning disorder. Only a pen and the sheets handed out by the room committee may be on the desk.';

export const TOLC_SCORING_NOTES = [
  'Official scoring, Regolamento TOLC 2026, 1.5: 1 point for each correct answer, 0 for each unanswered question, -0.25 for each wrong answer.',
  'Every question has five options, only one of which is correct (Regolamento TOLC 2026, 1.2). A blind guess has an expected value of 0; eliminating even one option makes guessing worth it.',
  'NO NATIONAL PASS MARK. CISIA reports an absolute score; each university may transform it with its own evaluation system, weight the sections, and set its own minimum (Regolamento TOLC 2026, 1.5). The threshold that matters is in the admission notice (bando) of the university and programme you apply to.',
  'The 30-question English section that follows the main test (15 minutes) is scored separately, with no penalty (1 for a correct answer, 0 otherwise), and does not form part of the score above. It is not modelled here.',
  'Each type of TOLC may be taken at most once per calendar month, in any mode and at any university (Regolamento TOLC 2026, 2). A result is accepted by every university using that TOLC in the same mode, at least for the year in which it was taken (1.6).',
  'Two modes exist: TOLC@UNI, in a university computer room, and TOLC@CASA, from home in a proctored virtual room (1.4). Each university states which modes it accepts.',
];

export const TOLC_UNVERIFIED = [
  'Whether candidates can move back to earlier questions, or change answers, within an open section. CISIA states only that a closed section cannot be reopened; our simulation allows movement inside the open section.',
  'Whether a reported absolute score can be negative, or is floored at zero.',
];
