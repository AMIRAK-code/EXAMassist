import type { QuestionVersionRow, StimulusRow } from '@/lib/db/rows';
import type { Question, Stimulus } from './question-schema';
import { contentFromQuestion, contentFromRows, reviewFingerprint } from './human-review';

/**
 * What a seed run would change in the question bank, worked out before
 * anything is written.
 *
 * Two rules come from here:
 *
 *  - A question version that some learner's attempt already points at is
 *    never rewritten with different learner-facing content. That attempt was
 *    scored against what the learner saw; changing the row would change their
 *    history. The fix is a new version number, which becomes a new row.
 *  - Every version row carries the fingerprint of its learner-facing content.
 *    A human approval is tied to that fingerprint, so any content change,
 *    version bump or not, leaves the version without approval until it is
 *    reviewed again.
 */

export interface ExistingVersion {
  row: QuestionVersionRow;
  /** The stimulus row the version currently points at, if any. */
  stimulus: StimulusRow | null;
}

export interface PlannedQuestion {
  question: Question;
  fingerprint: string;
  /** No row yet for this question and version. */
  isNewVersion: boolean;
  /** The row exists and its learner-facing content differs from the file. */
  contentChanged: boolean;
  /** The fingerprint the existing row's content has, computed from the row itself. */
  previousFingerprint: string | null;
}

export interface SeedConflict {
  questionId: string;
  version: number;
  message: string;
}

export interface SeedPlan {
  questions: PlannedQuestion[];
  conflicts: SeedConflict[];
}

/**
 * The question_versions columns the seeder writes for a content file, other
 * than the row's identity. One mapping, shared with the tests, so a stored
 * row's fingerprint (`contentFromRows`) and the file's (`contentFromQuestion`)
 * are always computed over the same values.
 */
export function versionColumns(question: Question, contentHash: string, fingerprint: string) {
  return {
    exam_key: question.examKey,
    section_key: question.sectionKey,
    domain_slug: question.domainSlug,
    skill_slug: question.skillSlug,
    subskill_slug: question.subskillSlug,
    response_type: question.responseType,
    difficulty: question.difficulty,
    difficulty_basis: question.difficultyBasis,
    stem_md: question.stemMd,
    instructions_md: question.instructionsMd,
    options_json: question.options.length > 0 ? JSON.stringify(question.options) : null,
    correct_json: JSON.stringify(question.answerKey),
    explanation_md: question.explanationMd,
    distractor_rationale_json:
      Object.keys(question.distractorRationale).length > 0 ? JSON.stringify(question.distractorRationale) : null,
    estimated_seconds: question.estimatedSeconds,
    stimulus_id: question.stimulusRef?.id ?? null,
    stimulus_version: question.stimulusRef?.version ?? null,
    accessibility_text: question.accessibilityText,
    provenance: JSON.stringify(question.provenance),
    rights_status: question.rightsStatus,
    author: question.review.author,
    reviewer: question.review.reviewer,
    reviewed_at: question.review.reviewedOn,
    review_notes: question.review.notes,
    state: question.state,
    content_hash: contentHash,
    review_fingerprint: fingerprint,
  };
}

/** The stimuli columns the seeder writes for a stimulus file. */
export function stimulusColumns(stimulus: Stimulus) {
  return {
    id: stimulus.id,
    version: stimulus.version,
    exam_key: stimulus.examKey,
    kind: stimulus.kind,
    title: stimulus.title,
    body_md: stimulus.bodyMd,
    data_json: stimulus.data ? JSON.stringify(stimulus.data) : null,
    accessibility_text: stimulus.accessibilityText,
    provenance: JSON.stringify(stimulus.provenance),
    rights_status: stimulus.rightsStatus,
  };
}

export function stimulusFileFor(question: Question, stimuli: readonly Stimulus[]): Stimulus | null {
  const ref = question.stimulusRef;
  if (!ref) return null;
  return stimuli.find((s) => s.id === ref.id && s.version === ref.version) ?? null;
}

export function planSeed(
  questions: readonly Question[],
  stimuli: readonly Stimulus[],
  existing: ReadonlyMap<string, ExistingVersion>,
  versionIdsInAttempts: ReadonlySet<string>,
): SeedPlan {
  const planned: PlannedQuestion[] = [];
  const conflicts: SeedConflict[] = [];
  for (const question of questions) {
    const fingerprint = reviewFingerprint(contentFromQuestion(question, stimulusFileFor(question, stimuli)));
    const current = existing.get(`${question.id}@${question.version}`);
    const previousFingerprint = current ? reviewFingerprint(contentFromRows(current.row, current.stimulus)) : null;
    const contentChanged = previousFingerprint !== null && previousFingerprint !== fingerprint;
    if (contentChanged && current && versionIdsInAttempts.has(current.row.id)) {
      conflicts.push({
        questionId: question.id,
        version: question.version,
        message:
          `${question.id} v${question.version} has learner attempts, and its file now says something different. ` +
          'Increment "version" so those attempts keep the text they were shown.',
      });
    }
    planned.push({ question, fingerprint, isNewVersion: !current, contentChanged, previousFingerprint });
  }
  return { questions: planned, conflicts };
}
