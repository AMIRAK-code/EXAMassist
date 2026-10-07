/**
 * Bocconi admissions facts for the public Bocconi pages, each tied to the
 * official page it was read from and the date it was checked.
 *
 * Two kinds of statement live here, and the pages keep them apart:
 *  - `official`: what Università Bocconi publishes. Re-check these against the
 *    sources whenever `BOCCONI_FACTS_CHECKED_ON` is more than a few months old,
 *    and at the start of every admissions cycle.
 *  - `advice`: our own preparation advice. It is labelled as ours wherever it
 *    is shown and never presented as a Bocconi rule.
 *
 * Structure, timing and scoring are not repeated here: they come from the exam
 * configurations (src/lib/exams/configs/bocconi-*.ts), which the format guide
 * and the engine read too, so a number cannot drift between pages.
 */

export const BOCCONI_FACTS_CHECKED_ON = '2026-10-07';

export interface BocconiSource {
  label: string;
  url: string;
}

export const BOCCONI_SOURCES = {
  testPage: {
    label: 'Online Bocconi test (official test page, English)',
    url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test',
  },
  testPageIt: {
    label: 'Test online Bocconi (official test page, Italian)',
    url: 'https://www.unibocconi.it/it/entrare-bocconi/corsi-di-laurea-triennale-e-giurisprudenza/ammissione/test-online-bocconi',
  },
  admissions: {
    label: 'Bachelor and Law programs: admissions (official)',
    url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/admissions',
  },
  satAct: {
    label: 'SAT, ACT and LSAT routes (official)',
    url: 'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/sat-and-act',
  },
  rules: {
    label: 'Bocconi Online Test, AY 2027/28: Instructions and Rules of Conduct (official PDF)',
    url: 'https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf',
  },
  simulation: {
    label: 'Bocconi’s free online simulation (official)',
    url: 'https://info.unibocconi.it/forms/session.php?tipo=T&lingua=eng&key=C-00510048',
  },
} satisfies Record<string, BocconiSource>;

export interface BocconiFaq {
  id: string;
  question: string;
  /** Plain text, shown as written. */
  answer: string;
  kind: 'official' | 'advice';
  sources: BocconiSource[];
}

/**
 * Questions applicants actually ask about the test, answered from Bocconi's
 * own pages. Kept short: a direct answer first, then the condition that
 * matters.
 */
export const BOCCONI_FAQ: readonly BocconiFaq[] = [
  {
    id: 'which-test',
    question: 'Should I take the standard Bocconi test or the Law test?',
    answer:
      'The standard Online Bocconi Test is valid for every bachelor programme, Law included. The Online Bocconi Test – Law is a separate test that can only be used for programmes in the legal area (the Law School programmes). Both are 50 questions in 75 minutes with the same scoring, but the content differs: the standard test is half mathematics (24 questions), while the Law test has 5 mathematics questions and is dominated by logic and critical thinking (18) and verbal reasoning (10).',
    kind: 'official',
    sources: [BOCCONI_SOURCES.testPage, BOCCONI_SOURCES.admissions],
  },
  {
    id: 'score-needed',
    question: 'What score do I need?',
    answer:
      'Bocconi publishes one floor: a total below 17 out of 50 (penalties included) means you are not considered in the selection. Applicants to the Bachelor in Mathematical and Computing Sciences for Artificial Intelligence also need at least 11 out of 24 in the Mathematics area. There is no published admission cut-off: places are given by ranking, in which the test counts 55% and your third-last and second-last year school grades count 45%. Any "score you need" beyond 17 is somebody’s estimate, not a Bocconi rule.',
    kind: 'official',
    sources: [BOCCONI_SOURCES.testPage, BOCCONI_SOURCES.admissions],
  },
  {
    id: 'negative-marking',
    question: 'Is there negative marking?',
    answer:
      'Yes. A correct answer scores 1, a blank scores 0 and a wrong answer costs 0.2 points; on critical-thinking questions offered with only three options, a wrong answer costs 0.33. Leaving a question blank is therefore a real choice, unlike on the SAT.',
    kind: 'official',
    sources: [BOCCONI_SOURCES.testPage],
  },
  {
    id: 'calculator',
    question: 'Can I use a calculator?',
    answer:
      'No. The rules of conduct prohibit calculators, notes and formula sheets. You may have an identity document, one pen or pencil, two blank A4 sheets and a drink on the desk.',
    kind: 'official',
    sources: [BOCCONI_SOURCES.rules],
  },
  {
    id: 'go-back',
    question: 'Can I go back to a question?',
    answer:
      'No. The test shows three questions per screen; once you press Next you cannot return to an earlier screen. A summary page of answered and omitted questions appears before you submit.',
    kind: 'official',
    sources: [BOCCONI_SOURCES.rules],
  },
  {
    id: 'attempts',
    question: 'How many times can I take it, and which score counts?',
    answer:
      'Up to four attempts per test type in an academic year, never on the same day or on consecutive days. Each attempt costs €60. If you submit more than one result, the admissions portal uses the highest.',
    kind: 'official',
    sources: [BOCCONI_SOURCES.rules, BOCCONI_SOURCES.testPage, BOCCONI_SOURCES.admissions],
  },
  {
    id: 'language',
    question: 'Is the test in English or Italian?',
    answer:
      'You choose Italian or English when you book, whatever the language of the programme you apply to. Our practice questions are in English only.',
    kind: 'official',
    sources: [BOCCONI_SOURCES.rules],
  },
  {
    id: 'sessions',
    question: 'When can I take the test for entry in 2027-28?',
    answer:
      'Booking runs from 13 July 2026 to 19 January 2027 for international applicants and to 20 April 2027 for Italian applicants. The sessions are Early (2–29 September 2026, now closed), Winter (25 November 2026 – 26 January 2027) and Spring (8–27 April 2027, Italian applicants only). Bocconi also lists periods when the test platform is closed, so check the test page before you plan a date.',
    kind: 'official',
    sources: [BOCCONI_SOURCES.rules, BOCCONI_SOURCES.testPage],
  },
  {
    id: 'where',
    question: 'Where and how is it taken?',
    answer:
      'Online, at home, alone in a room, inside the Safe Exam Browser. Your webcam, screen and a side-mounted smartphone record the session, and the recordings are reviewed afterwards. You see your total at the end and can download the full score report within 48 hours.',
    kind: 'official',
    sources: [BOCCONI_SOURCES.rules],
  },
  {
    id: 'alternatives',
    question: 'Can I send an SAT, ACT or LSAT score instead?',
    answer:
      'Yes. An SAT total below 1040 (or a section below 520) or an ACT composite below 19 is not considered; for the AI bachelor the minimums are 600 in SAT Math or 25 in ACT Math. The LSAT is accepted for Law only, with a minimum of 147.',
    kind: 'official',
    sources: [BOCCONI_SOURCES.satAct],
  },
  {
    id: 'official-practice',
    question: 'Does Bocconi offer official practice?',
    answer:
      'Yes: a free, unmonitored online simulation of 50 questions in 75 minutes, and a topic list for each area on the test page. Bocconi does not publish past papers.',
    kind: 'official',
    sources: [BOCCONI_SOURCES.testPage, BOCCONI_SOURCES.simulation],
  },
  {
    id: 'accommodations',
    question: 'Can I get extra time for a disability or a learning disorder?',
    answer:
      'Yes, on request: Bocconi asks for the request form at least five business days before your test date and decides each case. It publishes no standard amount of extra time.',
    kind: 'official',
    sources: [BOCCONI_SOURCES.rules],
  },
];

/** Our preparation advice. Shown under its own heading, never as a Bocconi rule. */
export const BOCCONI_ADVICE: readonly string[] = [
  'Start with a diagnostic, not a full mock: a short check across the four areas tells you where the hours should go.',
  'Practise mathematics without a calculator from the first day. On the standard test it is 24 of 50 questions, and the arithmetic has to be done on paper.',
  'Decide your blank-or-guess rule before test day: guess when you can rule out at least one option, otherwise leave it blank.',
  'Train the forward-only habit: answer the three questions on a screen before you move on, because you cannot come back.',
  'Book a date early in a session, so a second attempt is still possible if the first goes badly.',
  'Take Bocconi’s own free simulation once your weakest topics are under control, as a dress rehearsal in the real interface.',
];
