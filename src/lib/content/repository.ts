import type { Db } from '@/lib/db';
import type { QuestionVersionRow, StimulusRow } from '@/lib/db/rows';
import type { PoolItem } from '@/lib/assessment/select';
import { answerKeySchema, type AnswerKey, type ResponseType } from '@/lib/assessment/types';
import type { ContentLocale, QuestionTranslation, StimulusTranslation } from './question-schema';
import { humanApprovalSql, servableSql } from './human-review';

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
  /** The language this question is shown in: the one asked for, or English where it has no checked version. */
  locale: ServedLocale;
}

/**
 * The language a question is served in. English is the original; another
 * language comes only from a checked translation (translations.ts).
 */
export type ServedLocale = 'en' | ContentLocale;

type QuestionText = Omit<QuestionTranslation, 'check'>;
type StimulusText = Omit<StimulusTranslation, 'check'>;

/** One language's checked version from a `translations_json` column, if it has one. */
function translationIn<T>(json: string | null | undefined, locale: ServedLocale): T | null {
  if (locale === 'en' || !json) return null;
  try {
    return ((JSON.parse(json) as Record<string, T | undefined>)[locale]) ?? null;
  } catch {
    return null;
  }
}

/** A stimulus's labels in another language; the data values themselves are never translated. */
function translatedData(data: unknown, labels: StimulusText['dataLabels']): unknown {
  if (!labels || !data || typeof data !== 'object') return data;
  const original = data as {
    columns?: Array<{ key: string; label: string }>;
    caption?: string;
    chart?: { xLabel: string; yLabel: string } | null;
  };
  return {
    ...original,
    columns: original.columns?.map((column) => ({ ...column, label: labels.columns[column.key] ?? column.label })),
    caption: labels.caption || original.caption,
    chart: original.chart
      ? { ...original.chart, xLabel: labels.xLabel ?? original.chart.xLabel, yLabel: labels.yLabel ?? original.chart.yLabel }
      : original.chart,
  };
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

async function stimulusRow(db: Db, id: string, version: number): Promise<StimulusRow | undefined> {
  return (await db.prepare('SELECT * FROM stimuli WHERE id = ? AND version = ?').get(id, version)) as StimulusRow | undefined;
}

function toStimulusPayload(row: StimulusRow, text: StimulusText | null): StimulusPayload {
  const data = row.data_json ? (JSON.parse(row.data_json) as unknown) : null;
  return {
    id: row.id,
    version: row.version,
    kind: row.kind,
    title: text ? text.title : row.title,
    bodyMd: text ? text.bodyMd : row.body_md,
    data: text ? translatedData(data, text.dataLabels) : data,
    accessibilityText: text ? text.accessibilityText : row.accessibility_text,
  };
}

export async function getStimulus(db: Db, id: string, version: number, locale: ServedLocale = 'en'): Promise<StimulusPayload | null> {
  const row = (await stimulusRow(db, id, version));
  return row ? toStimulusPayload(row, translationIn<StimulusText>(row.translations_json, locale)) : null;
}

/**
 * A question in the language asked for. It is shown in that language only
 * when it and its stimulus both have a checked version in it, so a learner
 * never reads a passage in one language and its question in another;
 * otherwise it is shown in English.
 */
async function presentedWithText(
  db: Db,
  row: QuestionVersionRow,
  locale: ServedLocale,
): Promise<{ question: PresentedQuestion; text: QuestionText | null }> {
  const stimulus =
    row.stimulus_id && row.stimulus_version !== null ? (await stimulusRow(db, row.stimulus_id, row.stimulus_version)) ?? null : null;
  let text = translationIn<QuestionText>(row.translations_json, locale);
  let stimulusText = stimulus ? translationIn<StimulusText>(stimulus.translations_json, locale) : null;
  if (!text || (stimulus && !stimulusText)) {
    text = null;
    stimulusText = null;
  }
  const options = parseOptions(row.options_json);
  const translatedOptions = new Map((text?.options ?? []).map((option) => [option.id, option.textMd]));
  return {
    text,
    question: {
      questionId: row.question_id,
      questionVersionId: row.id,
      responseType: row.response_type as ResponseType,
      sectionKey: row.section_key,
      domainSlug: row.domain_slug,
      skillSlug: row.skill_slug,
      difficulty: row.difficulty,
      stemMd: text ? text.stemMd : row.stem_md,
      instructionsMd: text ? text.instructionsMd : row.instructions_md,
      // Option ids and letters are the original's; only the wording changes.
      options: options.map((option) => ({ ...option, textMd: translatedOptions.get(option.id) ?? option.textMd })),
      estimatedSeconds: row.estimated_seconds,
      accessibilityText: text ? text.accessibilityText : row.accessibility_text,
      stimulus: stimulus ? toStimulusPayload(stimulus, stimulusText) : null,
      locale: text ? locale : 'en',
    },
  };
}

export async function toPresented(db: Db, row: QuestionVersionRow, locale: ServedLocale = 'en'): Promise<PresentedQuestion> {
  return (await presentedWithText(db, row, locale)).question;
}

export async function toReviewable(db: Db, row: QuestionVersionRow, locale: ServedLocale = 'en'): Promise<ReviewableQuestion> {
  const { question, text } = await presentedWithText(db, row, locale);
  const rationale = row.distractor_rationale_json
    ? (JSON.parse(row.distractor_rationale_json) as Record<string, string>)
    : {};
  return {
    ...question,
    answerKey: answerKeySchema.parse(JSON.parse(row.correct_json)),
    explanationMd: text ? text.explanationMd : row.explanation_md,
    distractorRationale: text ? { ...rationale, ...text.distractorRationale } : rationale,
    difficultyBasis: row.difficulty_basis,
  };
}

export async function getQuestionVersion(db: Db, questionVersionId: string): Promise<QuestionVersionRow | undefined> {
  return (await db.prepare('SELECT * FROM question_versions WHERE id = ?').get(questionVersionId)) as
    | QuestionVersionRow
    | undefined;
}

/**
 * The version of a question currently being served: published, and, while
 * human approval is required, approved by a human reviewer as it stands now
 * (human-review.ts).
 */
export async function getPublishedVersion(db: Db, questionId: string): Promise<QuestionVersionRow | undefined> {
  return (await db
    .prepare(
      `SELECT qv.* FROM question_versions qv
       JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version
       WHERE q.id = ? AND q.state = 'published' AND qv.state = 'published'
         AND ${servableSql('qv')}`,
    )
    .get(questionId)) as QuestionVersionRow | undefined;
}

export async function getQuestionVersions(db: Db, ids: readonly string[]): Promise<Map<string, QuestionVersionRow>> {
  if (ids.length === 0) return new Map();
  const placeholders = ids.map(() => '?').join(',');
  const rows = (await db
    .prepare(`SELECT * FROM question_versions WHERE id IN (${placeholders})`)
    .all(...ids)) as QuestionVersionRow[];
  return new Map(rows.map((row) => [row.id, row]));
}

const POOL_COLUMNS = `
         qv.id                AS questionVersionId,
         qv.question_id       AS questionId,
         qv.section_key       AS sectionKey,
         qv.domain_slug       AS domainSlug,
         qv.skill_slug        AS skillSlug,
         qv.response_type     AS responseType,
         qv.difficulty        AS difficulty,
         qv.stimulus_id       AS stimulusId`;

/**
 * Candidate pool for every new session: published items that a human reviewer
 * has approved as they stand now (human-review.ts), annotated with when this
 * learner last saw each question so selection can prefer fresh material.
 *
 * This is the one place a new session's questions come from. A published item
 * without a standing human approval is not in it, whatever passed before.
 */
export async function getPool(db: Db, examKey: string, userId: string | null): Promise<PoolItem[]> {
  const rows = (await db
    .prepare(
      `SELECT ${POOL_COLUMNS},
         (
           SELECT MAX(ai.first_seen_at)
           FROM attempt_items ai
           JOIN attempts a ON a.id = ai.attempt_id
           WHERE ai.question_id = qv.question_id AND a.user_id = ?
         )                    AS lastSeenAt
       FROM question_versions qv
       JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version
       WHERE qv.exam_key = ? AND qv.state = 'published' AND q.state = 'published'
         AND ${servableSql('qv')}`,
    )
    .all(userId ?? '', examKey)) as PoolItem[];
  return rows;
}

/** A current question version with where it stands, for coverage and approval reports. Never used to build a session. */
export interface CandidateItem extends PoolItem {
  examKey: string;
  state: string;
  humanApproved: boolean;
  reviewFingerprint: string | null;
  stemMd: string;
}

/**
 * Every current question version of an exam, whatever its state, with whether
 * it holds a standing human approval: the same predicate `getPool` applies.
 */
export async function getCandidates(db: Db, examKey: string): Promise<CandidateItem[]> {
  const rows = (await db
    .prepare(
      `SELECT ${POOL_COLUMNS},
         NULL                 AS lastSeenAt,
         qv.exam_key          AS examKey,
         q.state              AS state,
         qv.review_fingerprint AS reviewFingerprint,
         qv.stem_md           AS stemMd,
         CASE WHEN ${humanApprovalSql('qv')} THEN 1 ELSE 0 END AS humanApproved
       FROM question_versions qv
       JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version
       WHERE qv.exam_key = ?`,
    )
    .all(examKey)) as Array<Omit<CandidateItem, 'humanApproved'> & { humanApproved: number }>;
  return rows.map((row) => ({ ...row, humanApproved: Number(row.humanApproved) === 1 }));
}

export interface CoverageRow {
  examKey: string;
  sectionKey: string;
  domainSlug: string;
  /** Published by the content file: passed the automated gates. Not necessarily served. */
  published: number;
  /** Published AND human-approved as it stands: what new sessions can draw on. */
  approved: number;
  draft: number;
  inReview: number;
  quarantined: number;
}

/** Content coverage, surfaced to learners so bank size is never hidden. */
export async function getCoverage(db: Db, examKey?: string): Promise<CoverageRow[]> {
  const where = examKey ? 'WHERE qv.exam_key = ?' : '';
  const params = examKey ? [examKey] : [];
  return (await db
    .prepare(
      `SELECT
         qv.exam_key     AS examKey,
         qv.section_key  AS sectionKey,
         qv.domain_slug  AS domainSlug,
         SUM(CASE WHEN qv.state = 'published'   THEN 1 ELSE 0 END) AS published,
         SUM(CASE WHEN qv.state = 'published' AND q.state = 'published' AND ${servableSql('qv')} THEN 1 ELSE 0 END) AS approved,
         SUM(CASE WHEN qv.state = 'draft'       THEN 1 ELSE 0 END) AS draft,
         SUM(CASE WHEN qv.state = 'in_review'   THEN 1 ELSE 0 END) AS inReview,
         SUM(CASE WHEN qv.state = 'quarantined' THEN 1 ELSE 0 END) AS quarantined
       FROM question_versions qv
       JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version
       ${where}
       GROUP BY qv.exam_key, qv.section_key, qv.domain_slug
       ORDER BY qv.exam_key, qv.section_key, qv.domain_slug`,
    )
    .all(...params)) as CoverageRow[];
}

/** Questions new sessions can draw on: published (and human-approved while that is required). */
export async function countPublished(db: Db, examKey: string): Promise<number> {
  const row = (await db
    .prepare(
      `SELECT COUNT(*) AS n
       FROM question_versions qv
       JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version
       WHERE qv.exam_key = ? AND qv.state = 'published' AND q.state = 'published'
         AND ${servableSql('qv')}`,
    )
    .get(examKey)) as { n: number };
  return row.n;
}
