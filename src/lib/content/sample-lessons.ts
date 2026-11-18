import type { CourseSlug } from '@/lib/courses/types';

/**
 * The course lesson that teaches the method behind each worked sample
 * question, keyed by the sample's id. The exam hubs and guides that show
 * samples link each one to its lesson, so a reader who misses a question has
 * the method one click away. These links are also how search engines find
 * the lessons from the pages they already show.
 *
 * Ids are shared by a hub's translations (the Italian TOLC page uses the
 * English ids), so one entry covers every language of a sample.
 *
 * Each entry names the lesson's canonical address (src/lib/courses: a lesson
 * shared by TOLC-I, TOLC-E and TOLC-F lives at its TOLC-I address) and
 * repeats its English title, so a page links the English lesson by name
 * without loading the course catalogue. tests/unit/sample-lessons.test.ts
 * checks every entry against the courses: the lesson exists, is published and
 * canonical, and the title matches.
 */
export interface SampleLesson {
  course: CourseSlug;
  lesson: string;
  /** The lesson's title, in the course's language (English). */
  title: string;
}

export const SAMPLE_LESSONS: Readonly<Record<string, SampleLesson>> = {
  // CISIA TOLC hub (/exams/cisia-tolc and /it/exams/cisia-tolc)
  'tolc-sample-log-maximum': { course: 'tolc-i', lesson: 'exponential-and-logarithmic-equations', title: 'Exponential and logarithmic equations and inequalities' },
  'tolc-sample-lockers': { course: 'tolc-i', lesson: 'constraints-guarantees-and-flows', title: 'Constraints, guarantees and flows' },
  'tolc-sample-kinematics': { course: 'tolc-i', lesson: 'vectors-motion-and-inclined-planes', title: 'Vectors, motion and inclined planes' },
  'tolc-sample-ratio': { course: 'tolc-i', lesson: 'ratios-percentages-and-divisibility', title: 'Ratios, percentage changes and divisibility' },
  'tolc-sample-necessary-condition': { course: 'tolc-i', lesson: 'implications-and-conditions', title: 'Implications and necessary conditions' },
  'tolc-sample-library-fines': { course: 'tolc-e', lesson: 'reading-claims-and-comparisons', title: 'Reading claims and comparisons' },
  'tolc-sample-peptide-water': { course: 'tolc-f', lesson: 'biological-molecules-water-and-enzymes', title: 'Biological molecules, water and enzymes' },
  'tolc-sample-oxygen-percentage': { course: 'tolc-i', lesson: 'atoms-bonds-and-reacting-amounts', title: 'Atoms, bonds and reacting amounts' },

  // Bocconi master's hub (/exams/bocconi-master)
  'master-sample-bike-scheme': { course: 'bocconi-master', lesson: 'strengthen-and-weaken', title: 'Strengthen and weaken: supporting or undermining a thesis' },
  'master-sample-subscription-share': { course: 'bocconi-master', lesson: 'percentages-and-growth-in-data', title: 'Percentages and growth in tables and charts' },
  'master-sample-ages': { course: 'bocconi-master', lesson: 'equations-and-systems', title: 'Linear equations and systems' },

  // IMAT sample questions guide
  'imat-sample-microplastics': { course: 'imat', lesson: 'inference-and-assumptions-in-texts', title: 'Inference and assumptions in texts' },
  'imat-sample-weekday': { course: 'imat', lesson: 'sequences-and-logical-puzzles', title: 'Sequences and logical puzzles' },
  'imat-sample-mitosis-anaphase': { course: 'imat', lesson: 'cell-cycle-mitosis-and-meiosis', title: 'The cell cycle, mitosis and meiosis' },
  'imat-sample-water-molecules': { course: 'imat', lesson: 'moles-and-stoichiometry', title: 'Moles and stoichiometry' },
  'imat-sample-hair-dryer': { course: 'imat', lesson: 'work-energy-and-momentum', title: 'Work, energy and momentum' },

  // Bocconi admission test sample questions guide
  'percentage-changes': { course: 'bocconi', lesson: 'percentages-and-unit-conversion', title: 'Percentages and unit conversions' },
  'absolute-value-inequality': { course: 'bocconi', lesson: 'absolute-values', title: 'Equations and inequalities with absolute values' },
  'conditional-probability': { course: 'bocconi', lesson: 'conditional-probability-and-bayes', title: 'Conditional probability, total probability and Bayes' },
  'logarithm-equation': { course: 'bocconi', lesson: 'exponential-and-logarithmic-equations', title: 'Exponential and logarithmic equations and inequalities' },
  'reading-supported-statement': { course: 'bocconi', lesson: 'reading-explicit-information', title: 'Finding explicit information in a passage' },
  'reading-main-point': { course: 'bocconi', lesson: 'reading-implicit-meaning', title: 'Reading for implicit meaning: inference, purpose and tone' },
  'rates-not-totals': { course: 'bocconi', lesson: 'charts-and-tables', title: 'Reading charts and tables correctly' },
  'shares-of-different-totals': { course: 'bocconi', lesson: 'charts-and-tables', title: 'Reading charts and tables correctly' },
  'true-false-cannot-deduce': { course: 'bocconi', lesson: 'true-false-or-cannot-be-deduced', title: 'True, false or cannot be deduced' },
  'overlapping-groups': { course: 'bocconi', lesson: 'drawing-valid-conclusions', title: 'Drawing valid conclusions from data and statements' },
  'necessary-assumption': { course: 'bocconi', lesson: 'excluding-unsupported-implications', title: 'Excluding unsupported implications' },
};

/** The lesson behind a sample question, with its path, if one is mapped. */
export function sampleLesson(sampleId: string): (SampleLesson & { path: string }) | undefined {
  const entry = SAMPLE_LESSONS[sampleId];
  return entry ? { ...entry, path: `/courses/${entry.course}/${entry.lesson}` } : undefined;
}
