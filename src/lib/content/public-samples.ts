/**
 * The fixed public sample set.
 *
 * These reviewed questions are shown on public pages together with their
 * answer and worked explanation, so anyone can read the key. They are
 * therefore excluded from every newly created diagnostic, simulation and timed
 * session (see `src/lib/attempts/eligibility.ts`). Untimed topic practice may
 * still serve them, and attempts created earlier keep the questions they were
 * assigned.
 *
 * Changing this list is an editorial decision. A replacement must be a
 * published, reviewed, single-select question, and `tests/unit/eligibility.test.ts`
 * must still show that no format which is open without the exclusion closes
 * because of it. If none qualifies, the fix is a newly reviewed question, not a
 * weaker rule.
 */

export type PublicSampleUse = 'homepage-sample' | 'formerly-public';

export interface PublicSample {
  questionId: string;
  /** The configuration the question belongs to. */
  examKey: string;
  /** The public exam hub it represents. */
  hubSlug: string;
  use: PublicSampleUse;
}

export const PUBLIC_SAMPLES: readonly PublicSample[] = [
  {
    questionId: 'bocconi-ug-alg-quadratic-inequality-002',
    examKey: 'bocconi-undergraduate',
    hubSlug: 'bocconi-online-test',
    use: 'homepage-sample',
  },
  {
    questionId: 'digital-sat-rw-words-in-context-cochineal-039',
    examKey: 'digital-sat',
    hubSlug: 'digital-sat',
    use: 'homepage-sample',
  },
  {
    questionId: 'enhanced-act-math-quadratic-minimum-008',
    examKey: 'enhanced-act',
    hubSlug: 'enhanced-act',
    use: 'homepage-sample',
  },
  {
    questionId: 'gmat-ps-units-digit-cycles-204',
    examKey: 'gmat',
    hubSlug: 'gmat',
    use: 'homepage-sample',
  },
  {
    questionId: 'gre-verbal-tc-fossil-record-014',
    examKey: 'gre',
    hubSlug: 'gre',
    use: 'homepage-sample',
  },
  {
    // Restored 24 September 2026: v2 corrects the option letters its
    // explanation had kept from before the options were reordered, and passed
    // a new blind solve and an option-reference check.
    questionId: 'lsat-lr-compost-supported-127',
    examKey: 'lsat',
    hubSlug: 'lsat',
    use: 'homepage-sample',
  },
  // Added 3 November 2026, once each bank had grown: checked one by one that
  // excluding the question closes no format that is open without it.
  {
    questionId: 'bocconi-grad-quant-remote-share-028',
    examKey: 'bocconi-graduate',
    hubSlug: 'bocconi-master',
    use: 'homepage-sample',
  },
  {
    questionId: 'tolc-e-logic-seq-interleaved-607',
    examKey: 'tolc-e',
    hubSlug: 'cisia-tolc',
    use: 'homepage-sample',
  },
  {
    questionId: 'polito-til-i-math-geometry-similar-triangle-areas-007',
    examKey: 'polito-til-i',
    hubSlug: 'politecnico-di-torino-til',
    use: 'homepage-sample',
  },
  {
    // Shown with its key and explanation in the homepage's mistake-notebook
    // demonstration until that section was removed on 24 September 2026. Its
    // answer has been public, so it stays out of measurement formats.
    questionId: 'digital-sat-rw-transitions-vanilla-010',
    examKey: 'digital-sat',
    hubSlug: 'digital-sat',
    use: 'formerly-public',
  },
];

/**
 * Hubs with no public sample, and why. The homepage shows an honest empty
 * state for these rather than a question it cannot stand behind.
 */
export const WITHHELD_SAMPLES: Readonly<Record<string, string>> = {
  // Bocconi Master, TIL and TOLC were withheld here until 3 November 2026, while
  // their banks were too small to spare a question. A new hub whose bank cannot
  // spare one yet goes here, with its reason.
};

export const PUBLIC_SAMPLE_IDS: ReadonlySet<string> = new Set(PUBLIC_SAMPLES.map((s) => s.questionId));

export function homepageSampleFor(hubSlug: string): PublicSample | undefined {
  return PUBLIC_SAMPLES.find((s) => s.hubSlug === hubSlug && s.use === 'homepage-sample');
}
