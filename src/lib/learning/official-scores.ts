import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { Db } from '@/lib/db';

/**
 * Official practice-test results, entered by the learner.
 *
 * A learner who sits an official practice test (Bluebook, LawHub, POWERPREP,
 * a GMAT Official Practice Exam, Bocconi's online simulation...) can record
 * the score the test maker's own tool gave them. We never see that test, so
 * every record is the learner's own statement, and the interface labels it
 * "User-entered official practice result — not independently verified".
 *
 * What this module will and will not do:
 *  - It checks a score against the scale the test maker publishes for that
 *    test version: range and step, and, only where the test maker publishes
 *    the exact rule, that the total agrees with the section scores (the SAT
 *    total is their sum; the ACT Composite is their rounded average).
 *  - It never fills in a missing score, never converts between scales or
 *    versions, never predicts an official score from UniExamer practice, and
 *    never states a percentile or an admission chance.
 *  - It compares two results only on the same scale and test version, and it
 *    marks a repeat sitting of the same practice test, since familiarity with
 *    the questions inflates a second score.
 *
 * Writing scores (ACT Writing, GRE Analytical Writing, LSAT Argumentative
 * Writing) are left out: this site does not handle essay scoring.
 *
 * The scoring facts below were checked on the test makers' own sites on
 * 2026-10-28; each version lists its sources. Exams with no verified official
 * practice test (the graduate Bocconi test, the draft IMAT) are not offered.
 */

export const OFFICIAL_SCORES_VERIFIED_ON = '2026-10-28';

export interface ScoreScale {
  min: number;
  max: number;
  step: number;
}

export interface ScoreSection {
  key: string;
  /** The test maker's own name for the score; data, shown as published. */
  label: string;
  scale: ScoreScale;
  /** False for a score reported beside the total but not part of it (TOLC English, ACT Science). */
  inTotal: boolean;
}

export type TotalRule =
  /** The total is the sum of these section scores, as the test maker publishes. */
  | { kind: 'sum'; sections: string[] }
  /** The total is the average of these section scores, rounded half up, as the test maker publishes. */
  | { kind: 'rounded-average'; sections: string[] }
  /** A relation exists but its exact formula is not published, so it is never checked or applied. */
  | { kind: 'unpublished' };

export interface ScoreVersion {
  key: string;
  examKey: string;
  /** Which test version and scale this is: data, shown as published. */
  label: string;
  overall: { label: string; scale: ScoreScale } | null;
  sections: ScoreSection[];
  totalRule: TotalRule;
  /**
   * True when the learner's target for this exam (set on the exam's own
   * scale, migration 002) is on this overall scale, so a difference means
   * something.
   */
  targetComparable: boolean;
  /** Facts a learner should know when reading these scores, as published. */
  notes: string[];
  sources: string[];
}

export interface OfficialProvider {
  key: string;
  /** The test maker and its practice product, as they name them. */
  name: string;
  note: string;
}

export interface OfficialScoreExam {
  examKey: string;
  versions: ScoreVersion[];
  providers: OfficialProvider[];
}

const scale = (min: number, max: number, step: number): ScoreScale => ({ min, max, step });

/** A raw-scored section with a per-item penalty: n items at +1, every one wrong at -penalty. */
const raw = (items: number, penalty: number, step = 0.01): ScoreScale => scale(round2(-items * penalty), items, step);

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

const BOCCONI_SOURCES = [
  'https://www.unibocconi.it/en/applying-bocconi/bachelor-and-law-programs/application-and-admissions/online-bocconi-test',
  'https://www.unibocconi.it/sites/default/files/media/attachments/Instructions%20and%20Rules%20of%20Conduct%2027%2028.pdf',
];
const BOCCONI_NOTES = [
  'Bocconi scores +1 for a correct answer, 0 for a blank and -0.2 for a wrong one; a wrong answer to a three-option critical thinking question costs -0.33. The total can therefore have two decimals and can be below zero.',
  'Bocconi states that scores obtained in its online simulation cannot be used for admission. The simulation is not proctored.',
];
const CISIA_SOURCES = [
  'https://www.cisiaonline.it/sites/default/files/Regolamenti/Regolamento-TOLC-2026.pdf',
  'https://www.cisiaonline.it/en/practicing/tolc-practicing',
];
const CISIA_NOTES = [
  'CISIA scores +1 for a correct answer, 0 for a blank and -0.25 for a wrong one. The English section (30 questions, no penalty, 0-30) is reported separately and is not part of the total.',
  'Each university may weight the sections differently and sets its own threshold; the total here is CISIA’s unweighted one.',
];
const POLITO_NOTES = [
  'From the 2027/28 intake Politecnico di Torino no longer runs the TIL tests and accepts CISIA tests instead, so TIL scores apply to the 2026/27 intake and earlier.',
];

export const OFFICIAL_SCORE_EXAMS: readonly OfficialScoreExam[] = [
  {
    examKey: 'digital-sat',
    providers: [
      {
        key: 'college-board-bluebook',
        name: 'College Board — Bluebook full-length practice test',
        note: 'Scored in Bluebook when you are signed in; the scores appear in My Practice. College Board’s paper practice tests report a score range rather than a single score, so they are not recorded here.',
      },
    ],
    versions: [
      {
        key: 'digital-sat',
        examKey: 'digital-sat',
        label: 'Digital SAT',
        overall: { label: 'Total score', scale: scale(400, 1600, 10) },
        sections: [
          { key: 'reading-writing', label: 'Reading and Writing', scale: scale(200, 800, 10), inTotal: true },
          { key: 'math', label: 'Math', scale: scale(200, 800, 10), inTotal: true },
        ],
        totalRule: { kind: 'sum', sections: ['reading-writing', 'math'] },
        targetComparable: true,
        notes: ['College Board: the total score is the sum of the Reading and Writing and the Math section scores.'],
        sources: [
          'https://satsuite.collegeboard.org/scores/what-scores-mean',
          'https://satsuite.collegeboard.org/practice/practice-tests/bluebook',
        ],
      },
    ],
  },
  {
    examKey: 'enhanced-act',
    providers: [
      {
        key: 'act-official-practice',
        name: 'ACT — official practice test',
        note: 'ACT’s free practice tests come with a scoring key and conversion tables; enter the scale scores you obtained from them.',
      },
    ],
    versions: [
      {
        key: 'act-enhanced',
        examKey: 'enhanced-act',
        label: 'Enhanced ACT (Composite of English, Math and Reading)',
        overall: { label: 'Composite', scale: scale(1, 36, 1) },
        sections: [
          { key: 'english', label: 'English', scale: scale(1, 36, 1), inTotal: true },
          { key: 'math', label: 'Math', scale: scale(1, 36, 1), inTotal: true },
          { key: 'reading', label: 'Reading', scale: scale(1, 36, 1), inTotal: true },
          { key: 'science', label: 'Science (reported separately)', scale: scale(1, 36, 1), inTotal: false },
        ],
        totalRule: { kind: 'rounded-average', sections: ['english', 'math', 'reading'] },
        targetComparable: true,
        notes: [
          'ACT: the Composite is the average of the English, Math and Reading scale scores, with fractions of one-half or more rounded up. Science is reported separately and is not in the Composite.',
          'The Writing score is not recorded here.',
        ],
        sources: [
          'https://www.act.org/content/act/en/products-and-services/the-act/scores/understanding-your-scores.html',
          'https://www.act.org/content/dam/act/unsecured/documents/ACT-National-Online-Practice-Test-1-Scoring-Key-and-Conversion-Tables.pdf',
        ],
      },
      {
        key: 'act-legacy',
        examKey: 'enhanced-act',
        label: 'Legacy ACT (Composite includes Science)',
        overall: { label: 'Composite', scale: scale(1, 36, 1) },
        sections: [
          { key: 'english', label: 'English', scale: scale(1, 36, 1), inTotal: true },
          { key: 'math', label: 'Math', scale: scale(1, 36, 1), inTotal: true },
          { key: 'reading', label: 'Reading', scale: scale(1, 36, 1), inTotal: true },
          { key: 'science', label: 'Science', scale: scale(1, 36, 1), inTotal: true },
        ],
        totalRule: { kind: 'rounded-average', sections: ['english', 'math', 'reading', 'science'] },
        targetComparable: false,
        notes: [
          'For practice tests in the format used before 2025, whose Composite averages all four sections including Science. These are kept apart from enhanced-format results and from your target, which is on the enhanced Composite.',
        ],
        sources: [
          'https://www.act.org/content/act/en/products-and-services/the-act-educator/the-act-test/enhancements-k12/faqs.html',
        ],
      },
    ],
  },
  {
    examKey: 'lsat',
    providers: [
      {
        key: 'lsac-lawhub',
        name: 'LSAC — LawHub official PrepTest',
        note: 'Enter the 120-180 score LawHub reported, if it reported one.',
      },
    ],
    versions: [
      {
        key: 'lsat',
        examKey: 'lsat',
        label: 'LSAT',
        overall: { label: 'LSAT score', scale: scale(120, 180, 1) },
        sections: [],
        totalRule: { kind: 'unpublished' },
        targetComparable: true,
        notes: [
          'LSAC reports one score from 120 to 180. LSAC states that scores stay comparable across the August 2024 and August 2027 format changes.',
        ],
        sources: ['https://www.lsac.org/lsat/lsat-scoring', 'https://www.lsac.org/lsat/prepare/official-lsat-practice-tests'],
      },
    ],
  },
  {
    examKey: 'gmat',
    providers: [
      {
        key: 'gmac-official-practice-exam',
        name: 'GMAC — GMAT Official Practice Exam',
        note: 'GMAC states that its Official Practice Exams use the same scoring as the real exam.',
      },
    ],
    versions: [
      {
        key: 'gmat-focus',
        examKey: 'gmat',
        label: 'GMAT Focus Edition',
        overall: { label: 'Total score', scale: scale(205, 805, 10) },
        sections: [
          { key: 'quantitative', label: 'Quantitative Reasoning', scale: scale(60, 90, 1), inTotal: true },
          { key: 'verbal', label: 'Verbal Reasoning', scale: scale(60, 90, 1), inTotal: true },
          { key: 'data-insights', label: 'Data Insights', scale: scale(60, 90, 1), inTotal: true },
        ],
        totalRule: { kind: 'unpublished' },
        targetComparable: true,
        notes: [
          'GMAC weights the three sections equally in the total but does not publish the formula, so the total is never worked out from them here.',
          'GMAC: scores from the previous GMAT edition (200-800) cannot be compared with Focus Edition scores, so they are not recorded here.',
        ],
        sources: ['https://www.gmac.com/gmat-other-assessments/about-the-gmat-focus-edition/exam-scores'],
      },
    ],
  },
  {
    examKey: 'gre',
    providers: [
      {
        key: 'ets-powerprep',
        name: 'ETS — POWERPREP practice test',
        note: 'The free POWERPREP tests report Verbal and Quantitative scores; the first one gives no scores if taken untimed.',
      },
    ],
    versions: [
      {
        key: 'gre-general',
        examKey: 'gre',
        label: 'GRE General Test',
        overall: null,
        sections: [
          { key: 'verbal', label: 'Verbal Reasoning', scale: scale(130, 170, 1), inTotal: false },
          { key: 'quantitative', label: 'Quantitative Reasoning', scale: scale(130, 170, 1), inTotal: false },
        ],
        totalRule: { kind: 'unpublished' },
        targetComparable: false,
        notes: [
          'ETS reports each measure separately and no total, so there is no single score to compare with a target. The Analytical Writing score is not recorded here.',
          'ETS states the score scales did not change with the shorter test introduced in September 2023.',
        ],
        sources: [
          'https://in.ets.org/gre/test-takers/general-test/scores/understand-scores.html',
          'https://in.ets.org/gre/test-takers/general-test/prepare/powerprep.html',
        ],
      },
    ],
  },
  {
    examKey: 'bocconi-undergraduate',
    providers: [
      {
        key: 'bocconi-online-simulation',
        name: 'Università Bocconi — official online simulation',
        note: 'Bocconi’s simulation has 50 questions in 75 minutes. It is not proctored, and Bocconi states its scores cannot be used for admission.',
      },
    ],
    versions: [
      {
        key: 'bocconi-online-test-standard',
        examKey: 'bocconi-undergraduate',
        label: 'Bocconi Online Test (bachelor), total out of 50',
        overall: { label: 'Total score (penalties included)', scale: scale(-11.17, 50, 0.01) },
        sections: [
          { key: 'mathematics', label: 'Mathematics', scale: raw(24, 0.2), inTotal: true },
          { key: 'reading-comprehension', label: 'Reading comprehension', scale: raw(11, 0.2), inTotal: true },
          { key: 'numerical-reasoning', label: 'Numerical reasoning', scale: raw(6, 0.2), inTotal: true },
          { key: 'critical-thinking', label: 'Critical thinking', scale: raw(9, 0.33), inTotal: true },
        ],
        totalRule: { kind: 'unpublished' },
        targetComparable: true,
        notes: BOCCONI_NOTES,
        sources: BOCCONI_SOURCES,
      },
    ],
  },
  {
    examKey: 'bocconi-law',
    providers: [
      {
        key: 'bocconi-online-simulation',
        name: 'Università Bocconi — official online simulation',
        note: 'Bocconi’s simulation is not proctored, and Bocconi states its scores cannot be used for admission.',
      },
    ],
    versions: [
      {
        key: 'bocconi-online-test-law',
        examKey: 'bocconi-law',
        label: 'Bocconi Online Test (law), total out of 50',
        overall: { label: 'Total score (penalties included)', scale: scale(-12.34, 50, 0.01) },
        sections: [
          { key: 'mathematics', label: 'Mathematics', scale: raw(5, 0.2), inTotal: true },
          { key: 'reading-comprehension', label: 'Reading comprehension', scale: raw(11, 0.2), inTotal: true },
          { key: 'numerical-reasoning', label: 'Numerical reasoning', scale: raw(6, 0.2), inTotal: true },
          { key: 'logic-critical-thinking', label: 'Logics and critical thinking', scale: raw(18, 0.33), inTotal: true },
          { key: 'verbal-reasoning', label: 'Verbal reasoning', scale: raw(10, 0.2), inTotal: true },
        ],
        totalRule: { kind: 'unpublished' },
        targetComparable: true,
        notes: BOCCONI_NOTES,
        sources: BOCCONI_SOURCES,
      },
    ],
  },
  {
    examKey: 'tolc-e',
    providers: [{ key: 'cisia-simulation', name: 'CISIA — TOLC simulation (practice area)', note: 'In CISIA’s practice area, after signing in.' }],
    versions: [
      {
        key: 'tolc-e',
        examKey: 'tolc-e',
        label: 'TOLC-E, total excluding English, out of 36',
        overall: { label: 'Total (punteggio totale), excluding English', scale: scale(-9, 36, 0.25) },
        sections: [
          { key: 'logic', label: 'Logic (Logica)', scale: raw(13, 0.25, 0.25), inTotal: true },
          { key: 'verbal-comprehension', label: 'Verbal comprehension (Comprensione verbale)', scale: raw(10, 0.25, 0.25), inTotal: true },
          { key: 'mathematics', label: 'Mathematics (Matematica)', scale: raw(13, 0.25, 0.25), inTotal: true },
          { key: 'english', label: 'English (reported separately)', scale: scale(0, 30, 1), inTotal: false },
        ],
        totalRule: { kind: 'unpublished' },
        targetComparable: true,
        notes: CISIA_NOTES,
        sources: [...CISIA_SOURCES, 'https://www.cisiaonline.it/tolc/tolc-e/struttura-della-prova-e-sillabo'],
      },
    ],
  },
  {
    examKey: 'tolc-i',
    providers: [{ key: 'cisia-simulation', name: 'CISIA — TOLC simulation (practice area)', note: 'In CISIA’s practice area, after signing in.' }],
    versions: [
      {
        key: 'tolc-i',
        examKey: 'tolc-i',
        label: 'TOLC-I, total excluding English, out of 50',
        overall: { label: 'Total (punteggio totale), excluding English', scale: scale(-12.5, 50, 0.25) },
        sections: [
          { key: 'mathematics', label: 'Mathematics (Matematica)', scale: raw(20, 0.25, 0.25), inTotal: true },
          { key: 'logic', label: 'Logic (Logica)', scale: raw(10, 0.25, 0.25), inTotal: true },
          { key: 'sciences', label: 'Sciences (Scienze)', scale: raw(10, 0.25, 0.25), inTotal: true },
          { key: 'verbal-comprehension', label: 'Verbal comprehension (Comprensione verbale)', scale: raw(10, 0.25, 0.25), inTotal: true },
          { key: 'english', label: 'English (reported separately)', scale: scale(0, 30, 1), inTotal: false },
        ],
        totalRule: { kind: 'unpublished' },
        targetComparable: true,
        notes: CISIA_NOTES,
        sources: [...CISIA_SOURCES, 'https://www.cisiaonline.it/tolc/tolc-i/struttura-della-prova-e-sillabo'],
      },
    ],
  },
  {
    examKey: 'tolc-f',
    providers: [{ key: 'cisia-simulation', name: 'CISIA — TOLC simulation (practice area)', note: 'In CISIA’s practice area, after signing in.' }],
    versions: [
      {
        key: 'tolc-f',
        examKey: 'tolc-f',
        label: 'TOLC-F, total excluding English, out of 50',
        overall: { label: 'Total (punteggio totale), excluding English', scale: scale(-12.5, 50, 0.25) },
        sections: [
          { key: 'biology', label: 'Biology (Biologia)', scale: raw(15, 0.25, 0.25), inTotal: true },
          { key: 'chemistry', label: 'Chemistry (Chimica)', scale: raw(15, 0.25, 0.25), inTotal: true },
          { key: 'mathematics', label: 'Mathematics (Matematica)', scale: raw(7, 0.25, 0.25), inTotal: true },
          { key: 'physics', label: 'Physics (Fisica)', scale: raw(7, 0.25, 0.25), inTotal: true },
          { key: 'logic', label: 'Logic (Logica)', scale: raw(6, 0.25, 0.25), inTotal: true },
          { key: 'english', label: 'English (reported separately)', scale: scale(0, 30, 1), inTotal: false },
        ],
        totalRule: { kind: 'unpublished' },
        targetComparable: true,
        notes: CISIA_NOTES,
        sources: [...CISIA_SOURCES, 'https://www.cisiaonline.it/tolc/tolc-f/struttura-della-prova-e-sillabo'],
      },
    ],
  },
  {
    examKey: 'polito-til-i',
    providers: [
      {
        key: 'polito-test-simulator',
        name: 'Politecnico di Torino — Test Simulator (Apply@polito)',
        note: 'In the Teaching Materials area of your Apply@polito page.',
      },
    ],
    versions: [
      {
        key: 'til-i-2026',
        examKey: 'polito-til-i',
        label: 'TIL-I (2026/27 call), score out of 100',
        overall: { label: 'Score out of 100', scale: scale(-25, 100, 0.01) },
        sections: [
          { key: 'mathematics', label: 'Mathematics', scale: raw(16, 0.25, 0.25), inTotal: true },
          { key: 'reading-logic', label: 'Reading comprehension and logical reasoning', scale: raw(10, 0.25, 0.25), inTotal: true },
          { key: 'physics', label: 'Physics', scale: raw(10, 0.25, 0.25), inTotal: true },
          { key: 'technical-knowledge', label: 'Basic technical knowledge', scale: raw(6, 0.25, 0.25), inTotal: true },
        ],
        totalRule: { kind: 'unpublished' },
        targetComparable: true,
        notes: [
          'PoliTo scores 42 questions at +1 / 0 / -0.25 and converts the result to hundredths without publishing the formula; section scores stay on the raw scale (Mathematics out of 16, and so on).',
          ...POLITO_NOTES,
        ],
        sources: [
          'https://www.polito.it/sites/default/files/2025-12/Call%20for%20applications%20for%20admissions%20Engineering%20_%20LP%202026-27.pdf',
        ],
      },
    ],
  },
  {
    examKey: 'polito-til-a',
    providers: [
      {
        key: 'polito-test-simulator',
        name: 'Politecnico di Torino — Test Simulator (Apply@polito)',
        note: 'In the Teaching Materials area of your Apply@polito page.',
      },
    ],
    versions: [
      {
        key: 'til-a-2026',
        examKey: 'polito-til-a',
        label: 'TIL-A (2026/27 call), section scores',
        overall: null,
        sections: [
          { key: 'reading-comprehension', label: 'Reading comprehension', scale: raw(10, 0.25, 0.25), inTotal: true },
          { key: 'prior-knowledge', label: 'Prior school knowledge', scale: raw(10, 0.25, 0.25), inTotal: true },
          { key: 'logic', label: 'Logic reasoning', scale: raw(10, 0.25, 0.25), inTotal: true },
          { key: 'drawing', label: 'Drawing and representation', scale: raw(10, 0.25, 0.25), inTotal: true },
          { key: 'physics-mathematics', label: 'Physics and mathematics', scale: raw(10, 0.25, 0.25), inTotal: true },
        ],
        totalRule: { kind: 'unpublished' },
        targetComparable: false,
        notes: [
          'PoliTo’s call gives a maximum of 50 and says the score is "converted to hundredths" without saying to what scale, so only the raw section scores are recorded here.',
          ...POLITO_NOTES,
        ],
        sources: [
          'https://www.polito.it/sites/default/files/2026-06/def_ENG_Call%20for%20applications%20Architecture%20a.y.%202026-27.pdf',
        ],
      },
    ],
  },
];

export function officialScoreExam(examKey: string): OfficialScoreExam | undefined {
  return OFFICIAL_SCORE_EXAMS.find((exam) => exam.examKey === examKey);
}

export function scoreVersion(scaleKey: string): ScoreVersion | undefined {
  for (const exam of OFFICIAL_SCORE_EXAMS) {
    const version = exam.versions.find((v) => v.key === scaleKey);
    if (version) return version;
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export class OfficialScoreError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
    readonly detail?: { field?: string; min?: number; max?: number; step?: number; expected?: number },
  ) {
    super(message);
    this.name = 'OfficialScoreError';
  }
}

export const officialScoreInputSchema = z.object({
  examKey: z.string().min(1).max(64),
  scaleKey: z.string().min(1).max(64),
  providerKey: z.string().min(1).max(64),
  testName: z.string().trim().min(1).max(120),
  takenOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  overallScore: z.number().finite().nullable(),
  /** Only the sections the learner entered; a blank section is left out, never sent as zero. */
  sectionScores: z.record(z.string().min(1).max(64), z.number().finite()).default({}),
  notes: z.string().trim().max(1000).default(''),
});
export type OfficialScoreInput = z.infer<typeof officialScoreInputSchema>;

/** Within floating-point noise of a multiple of the step above the minimum. */
export function onScale(value: number, s: ScoreScale): boolean {
  if (value < s.min - 1e-9 || value > s.max + 1e-9) return false;
  const steps = (value - s.min) / s.step;
  return Math.abs(steps - Math.round(steps)) < 1e-6;
}

/** ACT's published rounding: fractions of one-half or more round up, smaller ones down. */
export function roundHalfUp(value: number): number {
  return Math.floor(value + 0.5 + 1e-9);
}

/** The total the test maker's published rule gives, when every section it needs was entered; otherwise null. */
export function totalFromSections(version: ScoreVersion, sections: Readonly<Record<string, number>>): number | null {
  const rule = version.totalRule;
  if (rule.kind === 'unpublished') return null;
  if (rule.sections.some((key) => sections[key] === undefined)) return null;
  const values = rule.sections.map((key) => sections[key]);
  const sum = values.reduce((a, b) => a + b, 0);
  return rule.kind === 'sum' ? sum : roundHalfUp(sum / values.length);
}

function validCalendarDate(value: string): boolean {
  const time = Date.parse(`${value}T00:00:00Z`);
  return !Number.isNaN(time) && new Date(time).toISOString().slice(0, 10) === value;
}

/** Checks an entry against the exam's published scale; throws an OfficialScoreError naming the field. */
export function validateOfficialScore(input: OfficialScoreInput, today = new Date()): ScoreVersion {
  const exam = officialScoreExam(input.examKey);
  if (!exam) throw new OfficialScoreError('unsupported-exam', 'Official practice results cannot be recorded for this exam.', 400, { field: 'examKey' });
  const version = exam.versions.find((v) => v.key === input.scaleKey);
  if (!version) throw new OfficialScoreError('unknown-scale', 'Choose the test version the result was reported on.', 400, { field: 'scaleKey' });
  if (!exam.providers.some((p) => p.key === input.providerKey)) {
    throw new OfficialScoreError('unknown-provider', 'Choose who published the practice test.', 400, { field: 'providerKey' });
  }
  if (!validCalendarDate(input.takenOn)) throw new OfficialScoreError('invalid-date', 'That is not a real calendar date.', 400, { field: 'takenOn' });
  // A day of slack for time zones ahead of the server's.
  const latest = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (input.takenOn > latest) throw new OfficialScoreError('future-date', 'The date cannot be in the future.', 400, { field: 'takenOn' });
  if (input.takenOn < '2015-01-01') throw new OfficialScoreError('invalid-date', 'That date is too far in the past.', 400, { field: 'takenOn' });

  if (input.overallScore !== null) {
    if (!version.overall) {
      throw new OfficialScoreError('no-overall', 'This test version reports no single overall score.', 400, { field: 'overallScore' });
    }
    const s = version.overall.scale;
    if (!onScale(input.overallScore, s)) {
      throw new OfficialScoreError('off-scale', `The overall score must be between ${s.min} and ${s.max} in steps of ${s.step}.`, 400, {
        field: 'overallScore',
        ...s,
      });
    }
  }
  for (const [key, value] of Object.entries(input.sectionScores)) {
    const section = version.sections.find((sec) => sec.key === key);
    if (!section) throw new OfficialScoreError('unknown-section', 'That section is not part of this test version.', 400, { field: `section:${key}` });
    if (!onScale(value, section.scale)) {
      throw new OfficialScoreError(
        'off-scale',
        `${section.label} must be between ${section.scale.min} and ${section.scale.max} in steps of ${section.scale.step}.`,
        400,
        { field: `section:${key}`, ...section.scale },
      );
    }
  }
  if (input.overallScore === null && Object.keys(input.sectionScores).length === 0) {
    throw new OfficialScoreError('no-score', 'Enter at least one score.', 400, { field: version.overall ? 'overallScore' : 'sections' });
  }

  // Where the test maker publishes the exact rule, an entered total must agree
  // with the entered sections. A missing section means no check, never a guess.
  const expected = totalFromSections(version, input.sectionScores);
  if (expected !== null && input.overallScore !== null && Math.abs(expected - input.overallScore) > 1e-9) {
    throw new OfficialScoreError(
      'total-mismatch',
      `By ${version.totalRule.kind === 'sum' ? 'the published sum' : 'the published rounding'} these section scores give ${expected}, not ${input.overallScore}. Check the scores you entered.`,
      400,
      { field: 'overallScore', expected },
    );
  }
  return version;
}

// ---------------------------------------------------------------------------
// Storage. Every statement is keyed on the acting learner's id.
// ---------------------------------------------------------------------------

export interface OfficialScoreRecord {
  id: string;
  examKey: string;
  scaleKey: string;
  providerKey: string;
  testName: string;
  takenOn: string;
  overallScore: number | null;
  sectionScores: Record<string, number>;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OfficialScoreRow {
  id: string;
  exam_key: string;
  scale_key: string;
  provider_key: string;
  test_name: string;
  taken_on: string;
  overall_score: number | null;
  section_scores_json: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function toRecord(row: OfficialScoreRow): OfficialScoreRecord {
  let sections: Record<string, number> = {};
  try {
    sections = JSON.parse(row.section_scores_json) as Record<string, number>;
  } catch {
    sections = {};
  }
  return {
    id: row.id,
    examKey: row.exam_key,
    scaleKey: row.scale_key,
    providerKey: row.provider_key,
    testName: row.test_name,
    takenOn: row.taken_on,
    overallScore: row.overall_score === null ? null : Number(row.overall_score),
    sectionScores: Object.fromEntries(Object.entries(sections).map(([k, v]) => [k, Number(v)])),
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listOfficialScores(db: Db, userId: string, examKey?: string): Promise<OfficialScoreRecord[]> {
  const rows = (await db
    .prepare(
      `SELECT * FROM official_practice_scores WHERE user_id = ?${examKey ? ' AND exam_key = ?' : ''}
        ORDER BY taken_on, created_at`,
    )
    .all(...(examKey ? [userId, examKey] : [userId]))) as OfficialScoreRow[];
  return rows.map(toRecord);
}

export async function getOfficialScore(db: Db, userId: string, id: string): Promise<OfficialScoreRecord | null> {
  const row = (await db.prepare('SELECT * FROM official_practice_scores WHERE id = ? AND user_id = ?').get(id, userId)) as
    | OfficialScoreRow
    | undefined;
  return row ? toRecord(row) : null;
}

const NOT_FOUND = () => new OfficialScoreError('not-found', 'That result does not exist.', 404);

export async function createOfficialScore(db: Db, userId: string, input: OfficialScoreInput, now = new Date()): Promise<OfficialScoreRecord> {
  validateOfficialScore(input, now);
  const id = randomUUID();
  const at = now.toISOString();
  await db
    .prepare(
      `INSERT INTO official_practice_scores (id, user_id, exam_key, scale_key, provider_key, test_name, taken_on,
                                             overall_score, section_scores_json, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      id,
      userId,
      input.examKey,
      input.scaleKey,
      input.providerKey,
      input.testName,
      input.takenOn,
      input.overallScore,
      JSON.stringify(input.sectionScores),
      input.notes ? input.notes : null,
      at,
      at,
    );
  return (await getOfficialScore(db, userId, id))!;
}

/** Updates the learner's own record. Another learner's id behaves exactly like one that does not exist. */
export async function updateOfficialScore(
  db: Db,
  userId: string,
  id: string,
  input: OfficialScoreInput,
  now = new Date(),
): Promise<OfficialScoreRecord> {
  validateOfficialScore(input, now);
  const result = await db
    .prepare(
      `UPDATE official_practice_scores SET exam_key = ?, scale_key = ?, provider_key = ?, test_name = ?, taken_on = ?,
              overall_score = ?, section_scores_json = ?, notes = ?, updated_at = ?
        WHERE id = ? AND user_id = ?`,
    )
    .run(
      input.examKey,
      input.scaleKey,
      input.providerKey,
      input.testName,
      input.takenOn,
      input.overallScore,
      JSON.stringify(input.sectionScores),
      input.notes ? input.notes : null,
      now.toISOString(),
      id,
      userId,
    );
  if (Number(result.changes) === 0) throw NOT_FOUND();
  return (await getOfficialScore(db, userId, id))!;
}

export async function deleteOfficialScore(db: Db, userId: string, id: string): Promise<void> {
  const result = await db.prepare('DELETE FROM official_practice_scores WHERE id = ? AND user_id = ?').run(id, userId);
  if (Number(result.changes) === 0) throw NOT_FOUND();
}

// ---------------------------------------------------------------------------
// History: what may be compared with what
// ---------------------------------------------------------------------------

/** "Practice Test #4" and "practice test 4" are the same test. */
export function normaliseTestName(name: string): string {
  return name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '');
}

export interface HistoryEntry extends OfficialScoreRecord {
  version: ScoreVersion | null;
  providerName: string;
  /** 1 for the first recorded sitting of this practice test, 2 for the second... */
  sittingOfTest: number;
  /** The previous result on the same scale and test version, if any. */
  previous: { id: string; takenOn: string; testName: string } | null;
  overallChange: number | null;
  sectionChanges: Array<{ key: string; change: number }>;
}

export interface OfficialScoreHistory {
  examKey: string;
  supported: boolean;
  /** Oldest first. */
  entries: HistoryEntry[];
  latest: HistoryEntry | null;
  /** The learner's target on the exam's own scale (migration 002), if set. */
  target: number | null;
  /** Latest overall minus target, only when both exist on the same scale. */
  targetDifference: number | null;
  /** Why no difference is shown when a target and a latest result both exist. */
  targetNotComparable: boolean;
}

/**
 * Builds the history view. Two results are compared only when they are on the
 * same scale and test version; anything else stands alone.
 */
export function buildHistory(examKey: string, records: readonly OfficialScoreRecord[], target: number | null): OfficialScoreHistory {
  const exam = officialScoreExam(examKey);
  const ordered = records
    .filter((r) => r.examKey === examKey)
    .slice()
    .sort((a, b) => (a.takenOn === b.takenOn ? (a.createdAt < b.createdAt ? -1 : 1) : a.takenOn < b.takenOn ? -1 : 1));
  const sittings = new Map<string, number>();
  const lastOnScale = new Map<string, HistoryEntry>();
  const entries: HistoryEntry[] = ordered.map((record) => {
    const version = exam?.versions.find((v) => v.key === record.scaleKey) ?? null;
    const testKey = `${record.scaleKey}|${record.providerKey}|${normaliseTestName(record.testName)}`;
    const sitting = (sittings.get(testKey) ?? 0) + 1;
    sittings.set(testKey, sitting);
    const previous = lastOnScale.get(record.scaleKey) ?? null;
    const entry: HistoryEntry = {
      ...record,
      version,
      providerName: exam?.providers.find((p) => p.key === record.providerKey)?.name ?? record.providerKey,
      sittingOfTest: sitting,
      previous: previous ? { id: previous.id, takenOn: previous.takenOn, testName: previous.testName } : null,
      overallChange:
        previous && previous.overallScore !== null && record.overallScore !== null
          ? round2(record.overallScore - previous.overallScore)
          : null,
      sectionChanges: previous
        ? Object.keys(record.sectionScores)
            .filter((key) => previous.sectionScores[key] !== undefined)
            .map((key) => ({ key, change: round2(record.sectionScores[key] - previous.sectionScores[key]) }))
        : [],
    };
    lastOnScale.set(record.scaleKey, entry);
    return entry;
  });
  const latest = entries.at(-1) ?? null;
  const comparable = Boolean(latest?.version?.targetComparable && latest.overallScore !== null);
  return {
    examKey,
    supported: exam !== undefined,
    entries,
    latest,
    target,
    targetDifference: comparable && target !== null && latest?.overallScore != null ? round2(latest.overallScore - target) : null,
    targetNotComparable: target !== null && latest !== null && !comparable,
  };
}
