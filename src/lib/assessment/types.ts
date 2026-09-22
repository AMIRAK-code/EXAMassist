import { z } from 'zod';

/**
 * Shared assessment contracts.
 *
 * OWNER: coordinating agent. Anything that reads or writes questions, exam
 * configurations, attempts or results depends on these shapes. Propose changes
 * before editing (see docs/CONTRACTS.md).
 */

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

export const responseTypeSchema = z.enum([
  'single_select',
  'multi_select',
  'numeric_entry',
  'quantitative_comparison',
  'data_sufficiency',
  'two_part',
  'essay',
]);
export type ResponseType = z.infer<typeof responseTypeSchema>;

/** Fixed, exam-defined choice sets. Stored in config so the UI never hardcodes them. */
export const QUANTITATIVE_COMPARISON_CHOICES = ['A', 'B', 'C', 'D'] as const;
export const DATA_SUFFICIENCY_CHOICES = ['A', 'B', 'C', 'D', 'E'] as const;

// ---------------------------------------------------------------------------
// Answer keys (never serialised into a live attempt payload)
// ---------------------------------------------------------------------------

export const numericAcceptedSchema = z.union([
  z.object({ kind: z.literal('exact'), value: z.number() }),
  z.object({ kind: z.literal('tolerance'), value: z.number(), tolerance: z.number().nonnegative() }),
  z.object({ kind: z.literal('range'), min: z.number(), max: z.number() }),
]);
export type NumericAccepted = z.infer<typeof numericAcceptedSchema>;

export const answerKeySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('single_select'), optionId: z.string().min(1) }),
  z.object({
    type: z.literal('multi_select'),
    optionIds: z.array(z.string().min(1)).min(1),
    /** Exams that mark select-all-that-apply all-or-nothing (GRE) use 'exact'. */
    grading: z.enum(['exact']).default('exact'),
  }),
  z.object({
    type: z.literal('numeric_entry'),
    accepted: z.array(numericAcceptedSchema).min(1),
    /** Literal strings also accepted, e.g. an unreduced fraction. */
    acceptedStrings: z.array(z.string()).default([]),
    unit: z.string().optional(),
  }),
  z.object({
    type: z.literal('quantitative_comparison'),
    choice: z.enum(QUANTITATIVE_COMPARISON_CHOICES),
  }),
  z.object({ type: z.literal('data_sufficiency'), choice: z.enum(DATA_SUFFICIENCY_CHOICES) }),
  z.object({
    type: z.literal('two_part'),
    selections: z
      .array(z.object({ columnId: z.string().min(1), optionId: z.string().min(1) }))
      .min(2),
  }),
  z.object({
    type: z.literal('essay'),
    /** Essays are never auto-scored. The rubric is shown for self-assessment. */
    rubricId: z.string().min(1),
  }),
]);
export type AnswerKey = z.infer<typeof answerKeySchema>;

// ---------------------------------------------------------------------------
// Learner responses
// ---------------------------------------------------------------------------

export const responseSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('single_select'), optionId: z.string().min(1) }),
  z.object({ type: z.literal('multi_select'), optionIds: z.array(z.string().min(1)) }),
  z.object({ type: z.literal('numeric_entry'), raw: z.string().max(64) }),
  z.object({
    type: z.literal('quantitative_comparison'),
    choice: z.enum(QUANTITATIVE_COMPARISON_CHOICES),
  }),
  z.object({ type: z.literal('data_sufficiency'), choice: z.enum(DATA_SUFFICIENCY_CHOICES) }),
  z.object({
    type: z.literal('two_part'),
    selections: z.array(z.object({ columnId: z.string().min(1), optionId: z.string().min(1) })),
  }),
  z.object({ type: z.literal('essay'), text: z.string().max(20_000) }),
]);
export type Response = z.infer<typeof responseSchema>;

export type ScoreStatus = 'correct' | 'incorrect' | 'omitted' | 'not_auto_scored';

export interface ScoreOutcome {
  status: ScoreStatus;
  /** Raw points under the exam's scoring policy (can be negative where a verified penalty exists). */
  points: number;
  pointsPossible: number;
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const navigationPolicySchema = z.object({
  /** May the learner move back to earlier questions in the same part? */
  allowBackWithinPart: z.boolean(),
  /** May the learner skip ahead without answering? */
  allowForwardSkip: z.boolean(),
  /** May a submitted-in-part answer be changed before the part is submitted? */
  allowChangeAnswer: z.boolean(),
  allowFlagForReview: z.boolean(),
  /** May the learner return to a part that has already been submitted? */
  allowReturnToPreviousPart: z.boolean(),
  /** Show an end-of-part review screen listing answered/flagged questions. */
  reviewScreen: z.boolean(),
  /**
   * Whether answers can actually be changed FROM the review screen. The Bocconi
   * test shows a read-only summary before submission; the GMAT review screen
   * permits a capped number of edits.
   */
  reviewScreenEditable: z.boolean().optional(),
  /**
   * Questions presented together on one screen. The Bocconi online test shows
   * three at a time: within a screen the candidate moves and edits freely, but
   * clicking "Next" commits the screen permanently.
   *
   * Omitted / null means one question per screen.
   */
  pageSize: z.number().int().positive().nullable().optional(),
  /** GMAT-style caps. null = no cap. */
  bookmarkLimitPerPart: z.number().int().positive().nullable(),
  editLimitPerPart: z.number().int().positive().nullable(),
  /**
   * 'server' means the API rejects illegal navigation. Client-only enforcement
   * is never acceptable for a simulation and is flagged in the UI.
   */
  enforcement: z.enum(['server', 'client-only']),
  /** URL of the official rule this policy encodes, or 'unverified'. */
  source: z.string(),
});
export type NavigationPolicy = z.infer<typeof navigationPolicySchema>;

// ---------------------------------------------------------------------------
// Scoring policy
// ---------------------------------------------------------------------------

export const scoringPolicySchema = z.object({
  pointsCorrect: z.number(),
  /** Negative only where an official penalty is verified (e.g. some Bocconi rounds). */
  pointsIncorrect: z.number(),
  pointsOmitted: z.number(),
  multiSelectGrading: z.enum(['all_or_nothing']),
  /**
   * The official reported scale, for display as a fact about the exam. We never
   * claim to produce a score on this scale unless scaledEstimate.enabled.
   */
  officialScale: z
    .object({
      label: z.string(),
      min: z.number(),
      max: z.number(),
      increment: z.number(),
      note: z.string(),
    })
    .nullable(),
  /**
   * Estimated scaled score. Disabled by default: raw-to-scaled equating tables
   * are proprietary for every exam we cover. Enabling requires a documented,
   * defensible method recorded in `method` and surfaced in the UI.
   */
  scaledEstimate: z.discriminatedUnion('enabled', [
    z.object({ enabled: z.literal(false), reason: z.string() }),
    z.object({
      enabled: z.literal(true),
      method: z.string(),
      methodSource: z.string(),
      limitations: z.array(z.string()).min(1),
    }),
  ]),
  notes: z.array(z.string()).default([]),
});
export type ScoringPolicy = z.infer<typeof scoringPolicySchema>;

// ---------------------------------------------------------------------------
// Taxonomy, sections, blueprints
// ---------------------------------------------------------------------------

export const skillSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(''),
});

export const domainSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  sectionKey: z.string().min(1),
  description: z.string().default(''),
  /** Official published share of the section, when the test maker publishes one. */
  officialShare: z.string().nullable().default(null),
  skills: z.array(skillSchema).min(1),
  source: z.string(),
});
export type Domain = z.infer<typeof domainSchema>;

export const sectionConfigSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  order: z.number().int().nonnegative(),
  /**
   * The section whose question pool this section draws from.
   *
   * Some exams deliver the same content domains across several separately
   * timed sections: the SAT's two Reading and Writing modules test one domain
   * set, and the GRE's two Verbal sections likewise. Questions are tagged to
   * the first of those sections, and the later ones point back at it here.
   *
   * Defaults to the section's own key.
   */
  poolSectionKey: z.string().min(1).optional(),
  /** As published by the test maker. Strings preserve values like "44 (some unscored)". */
  officialQuestionCount: z.string().nullable(),
  officialTimeMinutes: z.number().nullable(),
  calculator: z.enum([
    'none',
    'onscreen',
    'onscreen_and_personal',
    'personal_only',
    'not_applicable',
    'unverified',
  ]),
  calculatorNote: z.string().default(''),
  navigation: navigationPolicySchema,
  responseTypes: z.array(responseTypeSchema).min(1),
  notes: z.array(z.string()).default([]),
});
export type SectionConfig = z.infer<typeof sectionConfigSchema>;

export const selectionConstraintSchema = z.object({
  sectionKey: z.string().min(1),
  domains: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  responseTypes: z.array(responseTypeSchema).default([]),
  /** Target counts per difficulty band. Unfilled slots fall back to any difficulty. */
  difficultyMix: z
    .object({ easy: z.number().int().nonnegative(), medium: z.number().int().nonnegative(), hard: z.number().int().nonnegative() })
    .nullable()
    .default(null),
  /** Never place the same question twice in one attempt. */
  allowRepeatsWithinAttempt: z.boolean().default(false),
  /** Prefer questions the learner has not recently seen. */
  avoidSeenWithinDays: z.number().int().nonnegative().default(30),
});
export type SelectionConstraint = z.infer<typeof selectionConstraintSchema>;

export const adaptiveRoutingSchema = z.discriminatedUnion('enabled', [
  z.object({ enabled: z.literal(false), reason: z.string() }),
  z.object({
    enabled: z.literal(true),
    /**
     * Our own transparent routing rule. It is NOT the test maker's algorithm,
     * which is not published; the UI must say so.
     */
    kind: z.literal('threshold_two_stage'),
    /** Fraction correct in the routing part at or above which the next part is the harder form. */
    upperThreshold: z.number().min(0).max(1),
    routesTo: z.object({ lower: z.string(), upper: z.string() }),
    disclosure: z.string().min(1),
  }),
]);
export type AdaptiveRouting = z.infer<typeof adaptiveRoutingSchema>;

export const blueprintPartSchema = z.object({
  key: z.string().min(1),
  sectionKey: z.string().min(1),
  label: z.string().min(1),
  /** null = untimed. Server-authoritative when set. */
  timeLimitSeconds: z.number().int().positive().nullable(),
  itemCount: z.number().int().positive(),
  selection: selectionConstraintSchema,
  navigationOverride: navigationPolicySchema.partial().nullable().default(null),
  /** Break offered after this part, in seconds. */
  breakAfterSeconds: z.number().int().nonnegative().nullable().default(null),
  adaptive: adaptiveRoutingSchema.nullable().default(null),
});
export type BlueprintPart = z.infer<typeof blueprintPartSchema>;

export const blueprintSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  mode: z.enum(['practice', 'diagnostic', 'simulation', 'review']),
  description: z.string().min(1),
  parts: z.array(blueprintPartSchema).min(1),
  timing: z.enum(['untimed', 'per_part', 'overall']),
  overallTimeLimitSeconds: z.number().int().positive().nullable().default(null),
  /**
   * What happens when the learner leaves. Simulations keep the clock running
   * (like the real exam); practice pauses.
   */
  pauseBehaviour: z.enum(['clock_runs', 'clock_pauses', 'not_applicable']),
  /** Honest labelling shown next to the blueprint. */
  fidelity: z.enum(['exam_accurate', 'approximation', 'practice_only']),
  fidelityNote: z.string().min(1),
});
export type Blueprint = z.infer<typeof blueprintSchema>;

// ---------------------------------------------------------------------------
// Exam configuration (versioned, immutable once published)
// ---------------------------------------------------------------------------

export const sourceRefSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
  publisher: z.string().min(1),
  verifiedOn: z.string().min(1),
});
export type SourceRef = z.infer<typeof sourceRefSchema>;

export const capabilitySchema = z.discriminatedUnion('available', [
  z.object({ available: z.literal(false), reason: z.string().min(1) }),
  z.object({ available: z.literal(true), note: z.string().default('') }),
]);

export const examConfigSchema = z.object({
  examKey: z.string().min(1),
  version: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  publisher: z.string().min(1),
  versionLabel: z.string().min(1),
  admissionsCycle: z.string().min(1),
  verifiedOn: z.string().min(1),
  /** Audience separation: undergraduate | law | graduate. */
  audience: z.array(z.enum(['undergraduate', 'law', 'graduate'])).min(1),
  summary: z.string().min(1),
  sources: z.array(sourceRefSchema).min(1),
  sections: z.array(sectionConfigSchema).min(1),
  domains: z.array(domainSchema).min(1),
  blueprints: z.array(blueprintSchema).min(1),
  scoring: scoringPolicySchema,
  capabilities: z.object({
    fullSimulation: capabilitySchema,
    adaptiveRouting: capabilitySchema,
    scaledScoreEstimate: capabilitySchema,
  }),
  /** Rules we could not verify. Surfaced to learners; gates simulation features. */
  unverified: z.array(z.string()).default([]),
});
export type ExamConfig = z.infer<typeof examConfigSchema>;

export function parseExamConfig(input: unknown): ExamConfig {
  return examConfigSchema.parse(input);
}
