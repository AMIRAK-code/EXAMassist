import type { Db } from '@/lib/db';
import type { QuestionVersionRow, StimulusRow } from '@/lib/db/rows';
import type { PoolItem } from '@/lib/assessment/select';
import { answerKeySchema, type AnswerKey, type ResponseType } from '@/lib/assessment/types';

/**
 * Question bank reads.
 *
 * The central rule here: `toPresented` never includes the answer key,
 * explanation, or distractor reasoning. Those live only in `toReviewable`,
 * which the API calls exclusively for items the learner is entitled to review.
 */

export interface StimulusPayload {
  id: string;
  version: number;
  kind: string;
  title: string | null;
  bodyMd: string | null;
  data: unknown | null;
  accessibilityText: string;
}

export interface PresentedQuestion {
  questionId: string;
  questionVersionId: string;
  responseType: ResponseType;
  sectionKey: string;
  domainSlug: string;
  skillSlug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  stemMd: string;
  instructionsMd: string | null;
  options: Array<{ id: string; label: string; textMd: string }>;
  estimatedSeconds: number;
  accessibilityText: string | null;
  stimulus: StimulusPayload | null;
}

export interface ReviewableQuestion extends PresentedQuestion {
  answerKey: AnswerKey;
  explanationMd: string;
  distractorRationale: Record<string, string>;
  /** Editorial, not psychometric - the UI must label it that way. */
  difficultyBasis: string;
}

function parseOptions(json: string | null): Array<{ id: string; label: string; textMd: string }> {
  if (!json) return [];
  const parsed: unknown = JSON.parse(json);
  return Array.isArray(parsed) ? (parsed as Array<{ id: string; label: string; textMd: string }>) : [];
}

export function getStimulus(db: Db, id: string, version: number): StimulusPayload | null {
  const row = db
    .prepare('SELECT * FROM stimuli WHERE id = ? AND version = ?')
    .get(id, version) as StimulusRow | undefined;
  if (!row) return null;
  return {
    id: row.id,
    version: row.version,
    kind: row.kind,
    title: row.title,
    bodyMd: row.body_md,
    data: row.data_json ? (JSON.parse(row.data_json) as unknown) : null,
    accessibilityText: row.accessibility_text,
  };
}

export function toPresented(db: Db, row: QuestionVersionRow): PresentedQuestion {
  return {
    questionId: row.question_id,
    questionVersionId: row.id,
    responseType: row.response_type as ResponseType,
    sectionKey: row.section_key,
    domainSlug: row.domain_slug,
    skillSlug: row.skill_slug,
    difficulty: row.difficulty,
    stemMd: row.stem_md,
    instructionsMd: row.instructions_md,
    options: parseOptions(row.options_json),
    estimatedSeconds: row.estimated_seconds,
    accessibilityText: row.accessibility_text,
    stimulus:
      row.stimulus_id && row.stimulus_version !== null
        ? getStimulus(db, row.stimulus_id, row.stimulus_version)
        : null,
  };
}

export function toReviewable(db: Db, row: QuestionVersionRow): ReviewableQuestion {
  return {
    ...toPresented(db, row),
    answerKey: answerKeySchema.parse(JSON.parse(row.correct_json)),
    explanationMd: row.explanation_md,
    distractorRationale: row.distractor_rationale_json
      ? (JSON.parse(row.distractor_rationale_json) as Record<string, string>)
      : {},
    difficultyBasis: row.difficulty_basis,
  };
}

export function getQuestionVersion(db: Db, questionVersionId: string): QuestionVersionRow | undefined {
  return db.prepare('SELECT * FROM question_versions WHERE id = ?').get(questionVersionId) as
    | QuestionVersionRow
    | undefined;
}

export function getQuestionVersions(db: Db, ids: readonly string[]): Map<string, QuestionVersionRow> {
  if (ids.length === 0) return new Map();
  const placeholders = ids.map(() => '?').join(',');
  const rows = db
    .prepare(`SELECT * FROM question_versions WHERE id IN (${placeholders})`)
    .all(...ids) as QuestionVersionRow[];
  return new Map(rows.map((row) => [row.id, row]));
}

/**
 * Candidate pool for selection: published items only, annotated with when this
 * learner last saw each question so selection can prefer fresh material.
 */
export function getPool(db: Db, examKey: string, userId: string | null): PoolItem[] {
  const rows = db
    .prepare(
      `SELECT
         qv.id                AS questionVersionId,
         qv.question_id       AS questionId,
         qv.section_key       AS sectionKey,
         qv.domain_slug       AS domainSlug,
         qv.skill_slug        AS skillSlug,
         qv.response_type     AS responseType,
         qv.difficulty        AS difficulty,
         qv.stimulus_id       AS stimulusId,
         (
           SELECT MAX(ai.first_seen_at)
           FROM attempt_items ai
           JOIN attempts a ON a.id = ai.attempt_id
           WHERE ai.question_id = qv.question_id AND a.user_id = ?
         )                    AS lastSeenAt
       FROM question_versions qv
       JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version
       WHERE qv.exam_key = ? AND qv.state = 'published' AND q.state = 'published'`,
    )
    .all(userId ?? '', examKey) as PoolItem[];
  return rows;
}

export interface CoverageRow {
  examKey: string;
  sectionKey: string;
  domainSlug: string;
  published: number;
  draft: number;
  inReview: number;
  quarantined: number;
}

/** Content coverage, surfaced to learners so bank size is never hidden. */
export function getCoverage(db: Db, examKey?: string): CoverageRow[] {
  const where = examKey ? 'WHERE qv.exam_key = ?' : '';
  const params = examKey ? [examKey] : [];
  return db
    .prepare(
      `SELECT
         qv.exam_key     AS examKey,
         qv.section_key  AS sectionKey,
         qv.domain_slug  AS domainSlug,
         SUM(CASE WHEN qv.state = 'published'   THEN 1 ELSE 0 END) AS published,
         SUM(CASE WHEN qv.state = 'draft'       THEN 1 ELSE 0 END) AS draft,
         SUM(CASE WHEN qv.state = 'in_review'   THEN 1 ELSE 0 END) AS inReview,
         SUM(CASE WHEN qv.state = 'quarantined' THEN 1 ELSE 0 END) AS quarantined
       FROM question_versions qv
       JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version
       ${where}
       GROUP BY qv.exam_key, qv.section_key, qv.domain_slug
       ORDER BY qv.exam_key, qv.section_key, qv.domain_slug`,
    )
    .all(...params) as CoverageRow[];
}

export function countPublished(db: Db, examKey: string): number {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS n
       FROM question_versions qv
       JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version
       WHERE qv.exam_key = ? AND qv.state = 'published' AND q.state = 'published'`,
    )
    .get(examKey) as { n: number };
  return row.n;
}
