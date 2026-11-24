import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { Db } from '@/lib/db';
import type { QuestionVersionRow, StimulusRow } from '@/lib/db/rows';
import type { AuthUser } from '@/lib/auth/session';
import { getExamConfig } from '@/lib/exams/registry';
import {
  REVIEW_CRITERIA,
  REVIEWABLE_STATES,
  ReviewError,
  authorIdentities,
  changesRequestedSql,
  contentFromRows,
  getReviewer,
  humanApprovalSql,
  isOwnWork,
  reviewFingerprint,
  type ReviewerProfile,
} from './human-review';
import { EXPORT_COLUMNS, readDecisionRow, toCsv, type DecisionRow, type RowProblem } from './review-csv';

/**
 * Approvals recorded in bulk, on behalf of a reviewer who made them outside
 * the site.
 *
 * The team sends reviewers a CSV of questions (`exportForReview`), each with
 * its exact version and content fingerprint. A reviewer returns the file with
 * a decision on each row, and an administrator records it here, either by
 * importing the file or by selecting the questions on the batch screen. Every
 * approval so recorded:
 *
 *  - names the reviewer who made it, who must be an authorised, confirmed
 *    reviewer for that exam and not one of the question's authors, exactly as
 *    when they approve on their own account; never the administrator;
 *  - is of the exact version and fingerprint the reviewer saw: a row whose
 *    question changed since it was sent is refused, because the reviewer
 *    approved a different text;
 *  - records the batch it came from (the file name and its SHA-256, or the
 *    administrator's description), the day the reviewer decided, and the
 *    administrator who entered it.
 *
 * Only rows the reviewer marked approved are ever approved. Requests for
 * changes in a file are reported and left for a reviewer to record one by one,
 * with their note, on the review page. A batch recorded in error can be
 * withdrawn as a whole: its rows stay in the ledger and stop counting.
 *
 * Writes go in transactions of CHUNK_SIZE rows, so thousands of rows finish
 * well inside a serverless function's time limit, and a failure part-way
 * leaves the batch's count accurate; importing the same file again approves
 * only what is still missing.
 */

export const CHUNK_SIZE = 200;
/** Rows read in one request: far more than one reviewer returns at once, and small enough that the request stays well under a serverless body limit (4.5 MB on Vercel). */
export const MAX_ROWS = 10_000;
/** Questions in one export file, which must stay under a serverless response's size limit with its text. */
export const MAX_EXPORT_ROWS = 1000;

export type RowOutcome =
  | 'will-approve'
  | 'already-approved'
  | 'changed-since-sent'
  | 'unverifiable'
  | 'not-found'
  | 'not-reviewable'
  | 'content-integrity'
  | 'changes-requested'
  | 'exam-not-authorised'
  | 'own-work'
  | 'other-reviewer'
  | 'not-approved'
  | 'no-decision'
  | 'duplicate'
  | 'conflict'
  | 'unknown-export'
  | RowProblem;

export interface RowResult {
  line: number;
  questionId: string;
  outcome: RowOutcome;
}

export interface BatchPlan {
  reviewer: { userId: string; publicName: string };
  rows: RowResult[];
  counts: Partial<Record<RowOutcome, number>>;
  willApprove: number;
}

const rawRowSchema = z.object({
  line: z.number().int().min(0).max(10_000_000),
  questionId: z.string().max(400),
  version: z.string().max(40).default(''),
  fingerprint: z.string().max(200).default(''),
  exportId: z.string().max(80).default(''),
  decision: z.string().max(80).default(''),
  reviewerEmail: z.string().max(300).default(''),
});

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), 'Not a date.');

export const batchPreviewSchema = z.object({
  reviewerUserId: z.string().min(1).max(64),
  /** The export the file answers, when the administrator knows it and the file does not say. */
  exportId: z.string().uuid().nullable().default(null),
  rows: z.array(rawRowSchema).min(1).max(MAX_ROWS),
});
export type BatchPreviewInput = z.infer<typeof batchPreviewSchema>;

export const batchApplySchema = batchPreviewSchema.extend({
  source: z.enum(['csv', 'selection']),
  /** The returned file's name, or where the decisions on a selection came from. */
  sourceName: z.string().trim().min(3).max(200),
  sourceSha256: z.string().regex(/^[0-9a-f]{64}$/).nullable().default(null),
  /** The day the reviewer made the decisions. */
  reviewedOn: isoDate,
  /**
   * The administrator confirms the reviewer told them that every row marked
   * approved was checked for all four criteria. An approval is recorded with
   * all four, as on the review page, or not at all.
   */
  reviewerCheckedAll: z.literal(true),
});
export type BatchApplyInput = z.infer<typeof batchApplySchema>;

export const withdrawBatchSchema = z.object({ reason: z.string().trim().min(10).max(1000) });

function inList(values: readonly unknown[]): string {
  return values.map(() => '?').join(', ');
}

function chunks<T>(values: readonly T[], size = CHUNK_SIZE): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < values.length; i += size) out.push(values.slice(i, i + size));
  return out;
}

async function audit(db: Db, actor: string, action: string, entityType: string, entityId: string, payload: unknown, at: string) {
  await db
    .prepare('INSERT INTO audit_log (actor_user_id, action, entity_type, entity_id, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(actor, action, entityType, entityId, JSON.stringify(payload), at);
}

function requireAdminActor(actor: AuthUser): void {
  if (actor.role !== 'admin') throw new ReviewError('forbidden', 'Only an administrator can record approvals in a batch.', 403);
}

/** The reviewer of record: an active, confirmed reviewer, and never the administrator entering the batch. */
async function reviewerOfRecord(db: Db, actor: AuthUser, reviewerUserId: string): Promise<{ profile: ReviewerProfile; account: { email: string | null; displayName: string | null } }> {
  if (reviewerUserId === actor.id) {
    throw new ReviewError(
      'reviewer-is-recorder',
      'You cannot record a batch in your own name. Approve on the review page yourself, or choose the reviewer who made these decisions.',
      403,
    );
  }
  const profile = await getReviewer(db, reviewerUserId);
  if (!profile || profile.status === 'revoked') throw new ReviewError('not-a-reviewer', 'That person is not an authorised reviewer.', 403);
  if (profile.status !== 'active') {
    throw new ReviewError(
      'reviewer-unconfirmed',
      'That reviewer has not yet confirmed the public wording of their credentials. They sign in and confirm it on the review page first.',
      403,
    );
  }
  const account = (await db.prepare('SELECT email, display_name FROM users WHERE id = ?').get(reviewerUserId)) as
    | { email: string | null; display_name: string | null }
    | undefined;
  return { profile, account: { email: account?.email ?? null, displayName: account?.display_name ?? null } };
}

interface CurrentRow extends QuestionVersionRow {
  question_state: string;
  approved_now: number | string;
  changes_now: number | string;
}

interface Candidate {
  row: DecisionRow;
  current: CurrentRow;
}

/** The current version of each question, with whether it holds a standing approval or request for changes now. */
async function currentVersions(db: Db, questionIds: readonly string[]): Promise<Map<string, CurrentRow>> {
  const found = new Map<string, CurrentRow>();
  for (const part of chunks(questionIds, 500)) {
    const rows = (await db
      .prepare(
        `SELECT qv.*, q.state AS question_state,
                CASE WHEN ${humanApprovalSql('qv')} THEN 1 ELSE 0 END AS approved_now,
                CASE WHEN ${changesRequestedSql('qv')} THEN 1 ELSE 0 END AS changes_now
           FROM questions q
           JOIN question_versions qv ON qv.question_id = q.id AND qv.version = q.current_version
          WHERE q.id IN (${inList(part)})`,
      )
      .all(...part)) as CurrentRow[];
    for (const row of rows) found.set(row.question_id, row);
  }
  return found;
}

async function stimuliFor(db: Db, rows: readonly QuestionVersionRow[]): Promise<Map<string, StimulusRow>> {
  const ids = [...new Set(rows.map((r) => r.stimulus_id).filter((id): id is string => Boolean(id)))];
  const out = new Map<string, StimulusRow>();
  for (const part of chunks(ids, 500)) {
    const found = (await db.prepare(`SELECT * FROM stimuli WHERE id IN (${inList(part)})`).all(...part)) as StimulusRow[];
    for (const s of found) out.set(`${s.id}@${Number(s.version)}`, s);
  }
  return out;
}

/** What each export recorded for each question: the version and fingerprint that went out. */
async function exportedFingerprints(db: Db, exportIds: readonly string[], questionIds: readonly string[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (exportIds.length === 0 || questionIds.length === 0) return out;
  for (const part of chunks(questionIds, 400)) {
    const rows = (await db
      .prepare(
        `SELECT export_id, question_id, review_fingerprint FROM review_export_items
          WHERE export_id IN (${inList(exportIds)}) AND question_id IN (${inList(part)})`,
      )
      .all(...exportIds, ...part)) as Array<{ export_id: string; question_id: string; review_fingerprint: string }>;
    for (const r of rows) out.set(`${r.export_id}|${r.question_id}`, r.review_fingerprint);
  }
  return out;
}

/**
 * The dry run: what importing these rows for this reviewer would do, row by
 * row, without writing anything. `applyBatch` runs the same plan again and
 * records only the rows marked `will-approve`.
 */
export async function planBatch(db: Db, actor: AuthUser, input: BatchPreviewInput): Promise<BatchPlan & { candidates: Candidate[] }> {
  requireAdminActor(actor);
  const { profile, account } = await reviewerOfRecord(db, actor, input.reviewerUserId);

  const results: RowResult[] = [];
  const parsed: DecisionRow[] = [];
  for (const raw of input.rows) {
    const read = readDecisionRow(raw);
    if ('problem' in read) results.push({ line: raw.line, questionId: raw.questionId.trim().slice(0, 160), outcome: read.problem });
    else parsed.push(read.row);
  }

  // Exports named by the file or the form must exist; a row naming an unknown export cannot be checked against it.
  const namedExports = [...new Set([input.exportId, ...parsed.map((r) => r.exportId)].filter((id): id is string => Boolean(id)))];
  const knownExports = new Set<string>();
  for (const part of chunks(namedExports, 400)) {
    const rows = (await db.prepare(`SELECT id FROM review_exports WHERE id IN (${inList(part)})`).all(...part)) as Array<{ id: string }>;
    for (const r of rows) knownExports.add(r.id);
  }

  // The same question more than once: identical rows count once; rows that disagree are all refused.
  const byQuestion = new Map<string, DecisionRow[]>();
  for (const row of parsed) byQuestion.set(row.questionId, [...(byQuestion.get(row.questionId) ?? []), row]);
  const pending: DecisionRow[] = [];
  for (const rows of byQuestion.values()) {
    const key = (r: DecisionRow) => `${r.decision}|${r.version ?? ''}|${r.fingerprint ?? ''}|${r.exportId ?? ''}|${r.reviewerEmail ?? ''}`;
    if (new Set(rows.map(key)).size > 1) {
      for (const r of rows) results.push({ line: r.line, questionId: r.questionId, outcome: 'conflict' });
      continue;
    }
    pending.push(rows[0]);
    for (const r of rows.slice(1)) results.push({ line: r.line, questionId: r.questionId, outcome: 'duplicate' });
  }

  const toCheck: DecisionRow[] = [];
  for (const row of pending) {
    let outcome: RowOutcome | null = null;
    if (row.decision === 'changes') outcome = 'not-approved';
    else if (row.decision === 'none') outcome = 'no-decision';
    else if (row.reviewerEmail && row.reviewerEmail !== account.email?.toLowerCase()) outcome = 'other-reviewer';
    else if (row.exportId && !knownExports.has(row.exportId)) outcome = 'unknown-export';
    if (outcome) results.push({ line: row.line, questionId: row.questionId, outcome });
    else toCheck.push(row);
  }

  const current = await currentVersions(db, toCheck.map((r) => r.questionId));
  const stimuli = await stimuliFor(db, [...current.values()]);
  const exported = await exportedFingerprints(db, [...knownExports], toCheck.map((r) => r.questionId));

  const candidates: Candidate[] = [];
  for (const row of toCheck) {
    const cur = current.get(row.questionId);
    const outcome = ((): RowOutcome => {
      if (!cur) return 'not-found';
      if (!(REVIEWABLE_STATES as readonly string[]).includes(cur.question_state)) return 'not-reviewable';
      // What the reviewer saw: the file's own fingerprint and version, and what the export recorded for that question.
      const exportId = row.exportId ?? input.exportId;
      const sent = exportId && knownExports.has(exportId) ? exported.get(`${exportId}|${row.questionId}`) : undefined;
      if (row.version !== null && row.version !== Number(cur.version)) return 'changed-since-sent';
      if (row.fingerprint !== null && row.fingerprint !== cur.review_fingerprint) return 'changed-since-sent';
      if (sent !== undefined && sent !== cur.review_fingerprint) return 'changed-since-sent';
      // Without a fingerprint, a version or an export record we cannot tell which text the reviewer approved.
      if (row.fingerprint === null && row.version === null && sent === undefined) return 'unverifiable';
      if (!cur.review_fingerprint) return 'content-integrity';
      const stimulus = cur.stimulus_id ? (stimuli.get(`${cur.stimulus_id}@${Number(cur.stimulus_version)}`) ?? null) : null;
      if (reviewFingerprint(contentFromRows(cur, stimulus)) !== cur.review_fingerprint) return 'content-integrity';
      if (!profile.examKeys.includes(cur.exam_key)) return 'exam-not-authorised';
      if (isOwnWork(profile, account, authorIdentities(cur))) return 'own-work';
      if (Number(cur.approved_now) === 1) return 'already-approved';
      // Overriding another reviewer's request for changes is a decision to take one question at a time.
      if (Number(cur.changes_now) === 1) return 'changes-requested';
      return 'will-approve';
    })();
    results.push({ line: row.line, questionId: row.questionId, outcome });
    if (outcome === 'will-approve' && cur) candidates.push({ row, current: cur });
  }

  results.sort((a, b) => a.line - b.line);
  const counts: Partial<Record<RowOutcome, number>> = {};
  for (const r of results) counts[r.outcome] = (counts[r.outcome] ?? 0) + 1;
  return {
    reviewer: { userId: profile.userId, publicName: profile.publicName },
    rows: results,
    counts,
    willApprove: candidates.length,
    candidates,
  };
}

/** The dry run as the screen sees it. */
export async function previewBatch(db: Db, actor: AuthUser, input: BatchPreviewInput): Promise<BatchPlan> {
  const { candidates: _omit, ...plan } = await planBatch(db, actor, input);
  void _omit;
  return plan;
}

export interface BatchSummary {
  id: string;
  source: 'csv' | 'selection';
  sourceName: string;
  sourceSha256: string | null;
  exportId: string | null;
  reviewerUserId: string | null;
  reviewerName: string;
  recordedBy: string;
  recordedByEmail: string | null;
  reviewedOn: string;
  approvedCount: number;
  createdAt: string;
  withdrawnAt: string | null;
  withdrawnBy: string | null;
  withdrawReason: string | null;
}

interface BatchRow {
  id: string;
  source: 'csv' | 'selection';
  source_name: string;
  source_sha256: string | null;
  export_id: string | null;
  reviewer_user_id: string | null;
  reviewer_name: string;
  recorded_by: string;
  recorded_by_email?: string | null;
  reviewed_on: string;
  approved_count: number;
  created_at: string;
  withdrawn_at: string | null;
  withdrawn_by: string | null;
  withdraw_reason: string | null;
}

function toSummary(row: BatchRow): BatchSummary {
  return {
    id: row.id,
    source: row.source,
    sourceName: row.source_name,
    sourceSha256: row.source_sha256,
    exportId: row.export_id,
    reviewerUserId: row.reviewer_user_id,
    reviewerName: row.reviewer_name,
    recordedBy: row.recorded_by,
    recordedByEmail: row.recorded_by_email ?? null,
    reviewedOn: row.reviewed_on,
    approvedCount: Number(row.approved_count),
    createdAt: row.created_at,
    withdrawnAt: row.withdrawn_at,
    withdrawnBy: row.withdrawn_by,
    withdrawReason: row.withdraw_reason,
  };
}

/**
 * Records the approvals of a batch: the plan again, then the rows it marks
 * `will-approve`, CHUNK_SIZE per transaction. Inside each transaction every
 * row is checked once more against the current version, so a question edited
 * or approved between the dry run and now is skipped, not approved.
 */
export async function applyBatch(
  db: Db,
  actor: AuthUser,
  input: BatchApplyInput,
  now = new Date(),
): Promise<{ batch: BatchSummary; plan: BatchPlan; skippedAtWrite: number }> {
  const today = now.toISOString().slice(0, 10);
  if (input.reviewedOn > today) throw new ReviewError('future-date', 'The review date cannot be in the future.', 400);
  const { candidates, ...plan } = await planBatch(db, actor, input);
  if (candidates.length === 0) throw new ReviewError('nothing-to-approve', 'No row in this batch can be approved.', 409);
  const { profile } = await reviewerOfRecord(db, actor, input.reviewerUserId);

  const createdAt = now.toISOString();
  const batchId = randomUUID();
  const exportId = input.exportId ?? [...new Set(candidates.map((c) => c.row.exportId).filter(Boolean))].at(0) ?? null;
  await db.transaction(async () => {
    await db
      .prepare(
        `INSERT INTO review_batches (id, source, source_name, source_sha256, export_id, reviewer_user_id, reviewer_name,
                                     recorded_by, reviewed_on, approved_count, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      )
      .run(batchId, input.source, input.sourceName, input.sourceSha256, exportId, profile.userId, profile.publicName, actor.id, input.reviewedOn, createdAt);
    await audit(db, actor.id, 'review_batch.recorded', 'review_batch', batchId, {
      source: input.source,
      sourceName: input.sourceName,
      sourceSha256: input.sourceSha256,
      exportId,
      reviewerUserId: profile.userId,
      reviewerName: profile.publicName,
      reviewedOn: input.reviewedOn,
      planned: candidates.length,
      counts: plan.counts,
    }, createdAt);
  })();

  const checked = JSON.stringify([...REVIEW_CRITERIA]);
  let skippedAtWrite = 0;
  for (const part of chunks(candidates)) {
    await db.transaction(async () => {
      const fresh = await currentVersions(db, part.map((c) => c.row.questionId));
      const still = part.filter((c) => {
        const cur = fresh.get(c.row.questionId);
        return (
          cur &&
          cur.id === c.current.id &&
          cur.review_fingerprint === c.current.review_fingerprint &&
          Number(cur.approved_now) === 0 &&
          Number(cur.changes_now) === 0 &&
          (REVIEWABLE_STATES as readonly string[]).includes(cur.question_state)
        );
      });
      skippedAtWrite += part.length - still.length;
      if (still.length === 0) return;
      const reviews = still.map((c) => ({ id: randomUUID(), c }));
      await db
        .prepare(
          `INSERT INTO question_reviews (id, question_id, question_version_id, question_version, review_fingerprint, exam_key,
                                         reviewer_user_id, reviewer_name, reviewer_credentials, outcome, checked_json, notes,
                                         reviewed_on, created_at, batch_id, recorded_by)
           VALUES ${reviews.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, NULL, ?, ?, ?, ?)").join(', ')}`,
        )
        .run(
          ...reviews.flatMap(({ id, c }) => [
            id,
            c.current.question_id,
            c.current.id,
            Number(c.current.version),
            c.current.review_fingerprint,
            c.current.exam_key,
            profile.userId,
            profile.publicName,
            profile.publicCredentials,
            checked,
            input.reviewedOn,
            createdAt,
            batchId,
            actor.id,
          ]),
        );
      await db
        .prepare(
          `INSERT INTO audit_log (actor_user_id, action, entity_type, entity_id, payload_json, created_at)
           VALUES ${reviews.map(() => "(?, 'question_review.approved', 'question', ?, ?, ?)").join(', ')}`,
        )
        .run(
          ...reviews.flatMap(({ id, c }) => [
            actor.id,
            c.current.question_id,
            JSON.stringify({
              reviewId: id,
              version: Number(c.current.version),
              fingerprint: c.current.review_fingerprint,
              checked: [...REVIEW_CRITERIA],
              reviewer: profile.publicName,
              batchId,
              recordedBy: actor.id,
            }),
            createdAt,
          ]),
        );
      await db.prepare('UPDATE review_batches SET approved_count = approved_count + ? WHERE id = ?').run(reviews.length, batchId);
    })();
  }

  const batch = await getBatch(db, batchId);
  return { batch: batch!, plan, skippedAtWrite };
}

/**
 * Withdraws a batch recorded in error: every approval in it stops counting at
 * once. The rows stay in the ledger, marked by the batch, so the record of
 * what was entered, by whom and why it was withdrawn is complete.
 */
export async function withdrawBatch(db: Db, actor: AuthUser, batchId: string, reason: string, now = new Date()): Promise<BatchSummary> {
  requireAdminActor(actor);
  const batch = await getBatch(db, batchId);
  if (!batch) throw new ReviewError('not-found', 'That batch does not exist.', 404);
  if (batch.withdrawnAt) throw new ReviewError('already-withdrawn', 'That batch was already withdrawn.', 409);
  const at = now.toISOString();
  await db.transaction(async () => {
    await db
      .prepare('UPDATE review_batches SET withdrawn_at = ?, withdrawn_by = ?, withdraw_reason = ? WHERE id = ? AND withdrawn_at IS NULL')
      .run(at, actor.id, reason, batchId);
    await audit(db, actor.id, 'review_batch.withdrawn', 'review_batch', batchId, { reason, approvedCount: batch.approvedCount }, at);
  })();
  return (await getBatch(db, batchId))!;
}

export async function getBatch(db: Db, batchId: string): Promise<BatchSummary | null> {
  const row = (await db
    .prepare('SELECT b.*, u.email AS recorded_by_email FROM review_batches b LEFT JOIN users u ON u.id = b.recorded_by WHERE b.id = ?')
    .get(batchId)) as BatchRow | undefined;
  return row ? toSummary(row) : null;
}

export async function listBatches(db: Db, limit = 200): Promise<BatchSummary[]> {
  const rows = (await db
    .prepare(
      'SELECT b.*, u.email AS recorded_by_email FROM review_batches b LEFT JOIN users u ON u.id = b.recorded_by ORDER BY b.created_at DESC LIMIT ?',
    )
    .all(limit)) as BatchRow[];
  return rows.map(toSummary);
}

/** The questions a batch approved, for its detail page. */
export async function batchItems(db: Db, batchId: string, limit = 2000): Promise<Array<{ questionId: string; version: number; examKey: string; fingerprint: string }>> {
  const rows = (await db
    .prepare('SELECT question_id, question_version, exam_key, review_fingerprint FROM question_reviews WHERE batch_id = ? ORDER BY question_id LIMIT ?')
    .all(batchId, limit)) as Array<{ question_id: string; question_version: number; exam_key: string; review_fingerprint: string }>;
  return rows.map((r) => ({ questionId: r.question_id, version: Number(r.question_version), examKey: r.exam_key, fingerprint: r.review_fingerprint }));
}

// ---------------------------------------------------------------------------
// What is waiting, and what was sent
// ---------------------------------------------------------------------------

export interface PendingQuestion {
  questionId: string;
  questionVersionId: string;
  version: number;
  fingerprint: string;
  examKey: string;
  sectionKey: string;
  domainSlug: string;
  skillSlug: string;
  difficulty: string;
  stem: string;
  /** When this version was loaded (YYYY-MM-DD). */
  loadedOn: string;
  /** Exports that sent exactly this version and content. */
  exportIds: string[];
}

export const pendingFilterSchema = z.object({
  exam: z.string().max(64).optional(),
  section: z.string().max(64).optional(),
  domain: z.string().max(120).optional(),
  /** An export id, 'never' for questions not yet sent, or empty for all. */
  sent: z.string().max(64).optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
});
export type PendingFilter = z.infer<typeof pendingFilterSchema>;

/**
 * Every current question version awaiting human review: published, with a
 * fingerprint, no standing approval and no standing request for changes. The
 * batch screen filters and selects among these; the export writes them out.
 */
export async function pendingQuestions(db: Db, filter: PendingFilter = {}): Promise<PendingQuestion[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (filter.exam) (where.push('qv.exam_key = ?'), params.push(filter.exam));
  if (filter.section) (where.push('qv.section_key = ?'), params.push(filter.section));
  if (filter.domain) (where.push('qv.domain_slug = ?'), params.push(filter.domain));
  if (filter.from) (where.push('qv.created_at >= ?'), params.push(filter.from));
  if (filter.to) (where.push('qv.created_at < ?'), params.push(nextDay(filter.to)));
  const rows = (await db
    .prepare(
      `SELECT q.id AS question_id, qv.id AS version_id, qv.version, qv.review_fingerprint, qv.exam_key, qv.section_key,
              qv.domain_slug, qv.skill_slug, qv.difficulty, substr(qv.stem_md, 1, 180) AS stem, qv.created_at
         FROM questions q
         JOIN question_versions qv ON qv.question_id = q.id AND qv.version = q.current_version
        WHERE q.state = 'published' AND qv.review_fingerprint IS NOT NULL
          AND NOT ${humanApprovalSql('qv')} AND NOT ${changesRequestedSql('qv')}
          ${where.length ? `AND ${where.join(' AND ')}` : ''}
        ORDER BY qv.exam_key, qv.section_key, qv.domain_slug, q.id`,
    )
    .all(...params)) as Array<{
    question_id: string;
    version_id: string;
    version: number;
    review_fingerprint: string;
    exam_key: string;
    section_key: string;
    domain_slug: string;
    skill_slug: string;
    difficulty: string;
    stem: string;
    created_at: string;
  }>;

  const sent = new Map<string, string[]>();
  const items = (await db
    .prepare('SELECT export_id, question_id, review_fingerprint FROM review_export_items')
    .all()) as Array<{ export_id: string; question_id: string; review_fingerprint: string }>;
  for (const item of items) {
    const key = `${item.question_id}|${item.review_fingerprint}`;
    sent.set(key, [...(sent.get(key) ?? []), item.export_id]);
  }

  const out = rows.map((r) => ({
    questionId: r.question_id,
    questionVersionId: r.version_id,
    version: Number(r.version),
    fingerprint: r.review_fingerprint,
    examKey: r.exam_key,
    sectionKey: r.section_key,
    domainSlug: r.domain_slug,
    skillSlug: r.skill_slug,
    difficulty: r.difficulty,
    stem: r.stem,
    loadedOn: r.created_at.slice(0, 10),
    exportIds: sent.get(`${r.question_id}|${r.review_fingerprint}`) ?? [],
  }));
  if (filter.sent === 'never') return out.filter((q) => q.exportIds.length === 0);
  if (filter.sent) return out.filter((q) => q.exportIds.includes(filter.sent!));
  return out;
}

function nextDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export interface ExportSummary {
  id: string;
  fileName: string;
  itemCount: number;
  createdBy: string;
  createdAt: string;
  filter: PendingFilter;
}

export async function listExports(db: Db, limit = 200): Promise<ExportSummary[]> {
  const rows = (await db.prepare('SELECT * FROM review_exports ORDER BY created_at DESC LIMIT ?').all(limit)) as Array<{
    id: string;
    file_name: string;
    filter_json: string;
    item_count: number;
    created_by: string;
    created_at: string;
  }>;
  return rows.map((r) => ({
    id: r.id,
    fileName: r.file_name,
    itemCount: Number(r.item_count),
    createdBy: r.created_by,
    createdAt: r.created_at,
    filter: JSON.parse(r.filter_json) as PendingFilter,
  }));
}

function plainOptions(json: string | null): string {
  if (!json) return '';
  const options = JSON.parse(json) as Array<{ id?: string; label?: string; textMd?: string }>;
  return options.map((o) => `${o.label ?? o.id ?? ''}) ${o.textMd ?? ''}`.trim()).join('\n');
}

function plainKey(json: string): string {
  const key = JSON.parse(json) as Record<string, unknown>;
  if (typeof key.optionId === 'string') return key.optionId;
  if (Array.isArray(key.optionIds)) return key.optionIds.join(', ');
  if (typeof key.choice === 'string') return key.choice;
  if (Array.isArray(key.selections)) {
    return (key.selections as Array<{ columnId: string; optionId: string }>).map((s) => `${s.columnId}: ${s.optionId}`).join('; ');
  }
  // Numeric entries and anything else: the stored key as it stands, so nothing is lost in translation.
  return JSON.stringify(key);
}

/**
 * Writes the CSV sent to reviewers: the questions awaiting review that match
 * the filter (at most MAX_EXPORT_ROWS), each with its export id, version and
 * fingerprint, its full text, key and explanation, and empty `decision`,
 * `reviewer_email` and `notes` columns for the reviewer. What went out is
 * recorded, so the returned file can be checked against it.
 */
export async function exportForReview(
  db: Db,
  actor: AuthUser,
  filter: PendingFilter,
  now = new Date(),
): Promise<{ exportId: string; fileName: string; csv: string; itemCount: number; truncated: boolean }> {
  requireAdminActor(actor);
  const pending = await pendingQuestions(db, filter);
  if (pending.length === 0) throw new ReviewError('nothing-to-export', 'No question awaiting review matches these filters.', 404);
  const chosen = pending.slice(0, MAX_EXPORT_ROWS);

  const versions = new Map<string, QuestionVersionRow>();
  for (const part of chunks(chosen.map((q) => q.questionVersionId), 400)) {
    const rows = (await db.prepare(`SELECT * FROM question_versions WHERE id IN (${inList(part)})`).all(...part)) as QuestionVersionRow[];
    for (const r of rows) versions.set(r.id, r);
  }
  const stimuli = await stimuliFor(db, [...versions.values()]);

  const exportId = randomUUID();
  const stamp = now.toISOString().slice(0, 16).replace(/[-:T]/g, '').replace(/^(\d{8})(\d{4})$/, '$1-$2');
  const scope = [filter.exam, filter.section, filter.domain].filter(Boolean).join('-') || 'all';
  const fileName = `uniexamer-review-${scope.replace(/[^a-z0-9-]+/gi, '_').slice(0, 60)}-${stamp}.csv`;

  const lines: unknown[][] = [[...EXPORT_COLUMNS]];
  for (const q of chosen) {
    const row = versions.get(q.questionVersionId)!;
    const stimulus = row.stimulus_id ? stimuli.get(`${row.stimulus_id}@${Number(row.stimulus_version)}`) : undefined;
    const exam = getExamConfig(row.exam_key);
    lines.push([
      exportId,
      row.question_id,
      Number(row.version),
      row.review_fingerprint,
      exam?.name ?? row.exam_key,
      row.section_key,
      row.domain_slug,
      row.skill_slug,
      row.difficulty,
      row.response_type,
      stimulus ? [stimulus.title, stimulus.body_md, stimulus.accessibility_text].filter(Boolean).join('\n\n') : '',
      row.instructions_md ?? '',
      row.stem_md,
      plainOptions(row.options_json),
      plainKey(row.correct_json),
      row.explanation_md,
      row.distractor_rationale_json ?? '',
      '',
      '',
      '',
    ]);
  }
  const csv = toCsv(lines);

  const at = now.toISOString();
  await db.transaction(async () => {
    await db
      .prepare('INSERT INTO review_exports (id, file_name, filter_json, item_count, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(exportId, fileName, JSON.stringify(filter), chosen.length, actor.id, at);
    for (const part of chunks(chosen)) {
      await db
        .prepare(
          `INSERT INTO review_export_items (export_id, question_id, question_version_id, question_version, review_fingerprint)
           VALUES ${part.map(() => '(?, ?, ?, ?, ?)').join(', ')}`,
        )
        .run(...part.flatMap((q) => [exportId, q.questionId, q.questionVersionId, q.version, q.fingerprint]));
    }
    await audit(db, actor.id, 'review_export.created', 'review_export', exportId, {
      fileName,
      filter,
      itemCount: chosen.length,
      sha256: createHash('sha256').update(csv).digest('hex'),
    }, at);
  })();

  return { exportId, fileName, csv, itemCount: chosen.length, truncated: pending.length > chosen.length };
}
