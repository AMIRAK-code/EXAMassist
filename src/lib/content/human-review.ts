import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { Db } from '@/lib/db';
import type { QuestionVersionRow, StimulusRow } from '@/lib/db/rows';
import type { AuthUser } from '@/lib/auth/session';
import { getExamConfig } from '@/lib/exams/registry';
import type { Question, Stimulus } from './question-schema';

/**
 * Mandatory human approval of every question served to a new session.
 *
 * Every question is AI-assisted, and before publication a separate AI
 * reviewer solves it blind (scripts/apply-review.ts). That is automated QA. It
 * is useful and it stays, but it is not human review and nothing here treats
 * it as one. A question version is eligible for a new session only when:
 *
 *  1. its content file says `published` (it passed the automated gates), AND
 *  2. a named person, authorised as a reviewer for that exam and not one of
 *     its authors, approved exactly that version and exactly that content,
 *     checking all four of the answer key, the explanation, the wording and
 *     the syllabus alignment, AND
 *  3. no later review of that same content asked for changes.
 *
 * "Exactly that content" is a fingerprint of everything the learner sees or is
 * scored against, written by the seeder. An approval stores the fingerprint it
 * saw, so an edit drops the approval even if nobody bumped the version number.
 *
 * Attempts already made are untouched: they pinned their question versions,
 * and this gate is applied only where a new session draws its questions
 * (`getPool`) or a public page shows one (`getPublishedVersion`).
 *
 * The ledger is append-only. Reviews are recorded in the admin area by the
 * reviewer, signed in to their own account; there is no other way in. How a
 * reviewer is set up and what they do: docs/EXPERT-REVIEW.md.
 */

export const REVIEW_CRITERIA = ['answer-key', 'explanation', 'wording', 'syllabus-alignment'] as const;
export type ReviewCriterion = (typeof REVIEW_CRITERIA)[number];

export const REVIEW_OUTCOMES = ['approved', 'changes_requested'] as const;
export type ReviewOutcome = (typeof REVIEW_OUTCOMES)[number];

/** Content states a reviewer may act on. Drafts are unfinished; quarantined and retired items are out of service. */
export const REVIEWABLE_STATES = ['in_review', 'published'] as const;

export class ReviewError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = 'ReviewError';
  }
}

// ---------------------------------------------------------------------------
// The content fingerprint
// ---------------------------------------------------------------------------

/** Everything a learner sees or is scored against, in one comparable shape. */
export interface LearnerFacingContent {
  examKey: string;
  sectionKey: string;
  domainSlug: string;
  skillSlug: string;
  subskillSlug: string | null;
  responseType: string;
  difficulty: string;
  stemMd: string;
  instructionsMd: string | null;
  options: unknown[];
  answerKey: unknown;
  explanationMd: string;
  distractorRationale: Record<string, unknown>;
  accessibilityText: string | null;
  stimulus: {
    id: string;
    version: number;
    kind: string;
    title: string | null;
    bodyMd: string | null;
    data: unknown;
    accessibilityText: string;
  } | null;
}

/** JSON with object keys sorted at every depth, so equal content always serialises equally. */
function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value ?? null);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(',')}}`;
}

export function reviewFingerprint(content: LearnerFacingContent): string {
  return createHash('sha256').update(canonicalJson(content)).digest('hex');
}

/** The content as the authored files hold it. Translations are left out: see docs/EXPERT-REVIEW.md. */
export function contentFromQuestion(question: Question, stimulus: Stimulus | null): LearnerFacingContent {
  return {
    examKey: question.examKey,
    sectionKey: question.sectionKey,
    domainSlug: question.domainSlug,
    skillSlug: question.skillSlug,
    subskillSlug: question.subskillSlug,
    responseType: question.responseType,
    difficulty: question.difficulty,
    stemMd: question.stemMd,
    instructionsMd: question.instructionsMd,
    options: question.options,
    answerKey: question.answerKey,
    explanationMd: question.explanationMd,
    distractorRationale: question.distractorRationale,
    accessibilityText: question.accessibilityText,
    stimulus: stimulus
      ? {
          id: stimulus.id,
          version: stimulus.version,
          kind: stimulus.kind,
          title: stimulus.title,
          bodyMd: stimulus.bodyMd,
          data: stimulus.data,
          accessibilityText: stimulus.accessibilityText,
        }
      : null,
  };
}

function parseOr<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  return JSON.parse(json) as T;
}

/** The same content as the database rows hold it, so a stored fingerprint can be checked against what is served. */
export function contentFromRows(row: QuestionVersionRow, stimulus: StimulusRow | null): LearnerFacingContent {
  return {
    examKey: row.exam_key,
    sectionKey: row.section_key,
    domainSlug: row.domain_slug,
    skillSlug: row.skill_slug,
    subskillSlug: row.subskill_slug,
    responseType: row.response_type,
    difficulty: row.difficulty,
    stemMd: row.stem_md,
    instructionsMd: row.instructions_md,
    options: parseOr<unknown[]>(row.options_json, []),
    answerKey: JSON.parse(row.correct_json) as unknown,
    explanationMd: row.explanation_md,
    distractorRationale: parseOr<Record<string, unknown>>(row.distractor_rationale_json, {}),
    accessibilityText: row.accessibility_text,
    stimulus: stimulus
      ? {
          id: stimulus.id,
          version: Number(stimulus.version),
          kind: stimulus.kind,
          title: stimulus.title,
          bodyMd: stimulus.body_md,
          data: parseOr<unknown>(stimulus.data_json, null),
          accessibilityText: stimulus.accessibility_text,
        }
      : null,
  };
}

// ---------------------------------------------------------------------------
// Eligibility: one definition, in SQL and in code
// ---------------------------------------------------------------------------

/**
 * SQL predicate: the question version aliased `qv` holds a standing human
 * approval of its current content. Every query that decides what a NEW session
 * or a public page may show uses this, and `isApprovalStanding` below is the
 * same rule for code that already holds the review rows (the coverage report).
 */
export function humanApprovalSql(qv = 'qv'): string {
  return `(${qv}.review_fingerprint IS NOT NULL AND EXISTS (
      SELECT 1 FROM question_reviews hr
       WHERE hr.question_version_id = ${qv}.id
         AND hr.review_fingerprint = ${qv}.review_fingerprint
         AND hr.outcome = 'approved'
         AND NOT EXISTS (
           SELECT 1 FROM question_reviews hx
            WHERE hx.question_version_id = hr.question_version_id
              AND hx.review_fingerprint = hr.review_fingerprint
              AND hx.outcome = 'changes_requested'
              AND hx.created_at > hr.created_at)))`;
}

/**
 * Whether a question must hold a standing human approval before a new session
 * or a public page may show it: the HUMAN_APPROVAL_REQUIRED variable, "true" to
 * require it. Set by the owners: required from 2026-10-29, not required since
 * 2026-10-30 (the variable is unset), while reviewers work through the bank.
 *
 * While it is off, questions that passed the automatic checks and the blind AI
 * solve are served, the public copy says that no per-question human review is
 * recorded, and the approvals that do exist are still recorded and shown on
 * each question's review page. Turning it on closes every question without a
 * standing approval, so change the public copy (editorial standards, home
 * page, Bocconi page, practice and pricing notes) at the same time.
 */
export function humanApprovalRequired(env: Record<string, string | undefined> = process.env): boolean {
  return env.HUMAN_APPROVAL_REQUIRED?.trim().toLowerCase() === 'true';
}

/** SQL predicate for what new sessions and public pages may serve: `humanApprovalSql` while approval is required. */
export function servableSql(qv = 'qv'): string {
  return humanApprovalRequired() ? humanApprovalSql(qv) : '1 = 1';
}

export interface ReviewDecision {
  questionVersionId: string;
  reviewFingerprint: string;
  outcome: ReviewOutcome;
  createdAt: string;
}

/** The standing approval among these decisions for this exact version and content, if any: `humanApprovalSql` in code. */
export function standingApproval<T extends ReviewDecision>(
  decisions: readonly T[],
  questionVersionId: string,
  fingerprint: string | null | undefined,
): T | null {
  if (!fingerprint) return null;
  const mine = decisions.filter((d) => d.questionVersionId === questionVersionId && d.reviewFingerprint === fingerprint);
  const approvals = mine.filter((d) => d.outcome === 'approved');
  const standing = approvals.filter(
    (approval) => !mine.some((d) => d.outcome === 'changes_requested' && d.createdAt > approval.createdAt),
  );
  return standing.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0] ?? null;
}

/** Where a question stands, in the words the admin screens and the reports use. */
export type ApprovalStatus =
  | 'approved' // human-approved, current content: served if published
  | 'awaiting-human-review' // passed the automated gates, no standing approval
  | 'changes-requested' // the latest review of this content asked for changes
  | 'in-automated-review' // in_review: the AI blind solve has not passed yet
  | 'draft'
  | 'quarantined'
  | 'retired';

/**
 * The single eligibility rule for new sessions: published by the content file
 * (automated gates passed) AND a standing human approval of the current content.
 */
export function eligibleForNewSessions(questionState: string, versionState: string, humanApproved: boolean): boolean {
  return questionState === 'published' && versionState === 'published' && (humanApproved || !humanApprovalRequired());
}

export function approvalStatus(state: string, humanApproved: boolean, latestOutcome: ReviewOutcome | null): ApprovalStatus {
  if (state === 'draft' || state === 'quarantined' || state === 'retired') return state;
  if (humanApproved) return state === 'published' ? 'approved' : 'in-automated-review';
  if (latestOutcome === 'changes_requested') return 'changes-requested';
  return state === 'in_review' ? 'in-automated-review' : 'awaiting-human-review';
}

// ---------------------------------------------------------------------------
// Reviewers
// ---------------------------------------------------------------------------

interface ReviewerRow {
  user_id: string;
  public_name: string;
  public_credentials: string;
  exam_keys_json: string;
  author_aliases_json: string;
  granted_by: string;
  granted_at: string;
  confirmed_at: string | null;
  revoked_at: string | null;
  revoked_by: string | null;
  revoke_reason: string | null;
  updated_at: string;
}

export interface ReviewerProfile {
  userId: string;
  publicName: string;
  publicCredentials: string;
  examKeys: string[];
  authorAliases: string[];
  grantedBy: string;
  grantedAt: string;
  confirmedAt: string | null;
  revokedAt: string | null;
  revokedBy: string | null;
  revokeReason: string | null;
  status: 'pending-confirmation' | 'active' | 'revoked';
}

function toProfile(row: ReviewerRow): ReviewerProfile {
  return {
    userId: row.user_id,
    publicName: row.public_name,
    publicCredentials: row.public_credentials,
    examKeys: parseOr<string[]>(row.exam_keys_json, []),
    authorAliases: parseOr<string[]>(row.author_aliases_json, []),
    grantedBy: row.granted_by,
    grantedAt: row.granted_at,
    confirmedAt: row.confirmed_at,
    revokedAt: row.revoked_at,
    revokedBy: row.revoked_by,
    revokeReason: row.revoke_reason,
    status: row.revoked_at ? 'revoked' : row.confirmed_at ? 'active' : 'pending-confirmation',
  };
}

export async function getReviewer(db: Db, userId: string): Promise<ReviewerProfile | null> {
  const row = (await db.prepare('SELECT * FROM reviewers WHERE user_id = ?').get(userId)) as ReviewerRow | undefined;
  return row ? toProfile(row) : null;
}

export async function listReviewers(db: Db): Promise<Array<ReviewerProfile & { email: string | null }>> {
  const rows = (await db
    .prepare('SELECT r.*, u.email AS email FROM reviewers r JOIN users u ON u.id = r.user_id ORDER BY r.public_name')
    .all()) as Array<ReviewerRow & { email: string | null }>;
  return rows.map((row) => ({ ...toProfile(row), email: row.email }));
}

async function audit(db: Db, actor: string | null, action: string, entityType: string, entityId: string, payload: unknown, now: string) {
  await db
    .prepare(
      'INSERT INTO audit_log (actor_user_id, action, entity_type, entity_id, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .run(actor, action, entityType, entityId, JSON.stringify(payload), now);
}

export const grantReviewerSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  publicName: z.string().trim().min(3).max(120),
  /** One line that may be shown publicly; the reviewer confirms it before reviewing. */
  publicCredentials: z.string().trim().min(10).max(200),
  examKeys: z.array(z.string().min(1).max(64)).min(1).max(30),
  /** Names this person authors or edits content under, so they can never approve their own work. */
  authorAliases: z.array(z.string().trim().min(1).max(120)).max(20).default([]),
});
export type GrantReviewerInput = z.infer<typeof grantReviewerSchema>;

/**
 * An administrator authorises a person to review. The person must already have
 * an account; they then confirm the public wording of their credentials
 * themselves. Granting again (to change exams or wording) asks for a fresh
 * confirmation.
 */
export async function grantReviewer(db: Db, actor: AuthUser, input: GrantReviewerInput, now = new Date()): Promise<ReviewerProfile> {
  if (actor.role !== 'admin') throw new ReviewError('forbidden', 'Only an administrator can authorise reviewers.', 403);
  for (const examKey of input.examKeys) {
    if (!getExamConfig(examKey)) throw new ReviewError('unknown-exam', `"${examKey}" is not an exam we serve.`, 400);
  }
  const user = (await db
    .prepare('SELECT id, is_guest FROM users WHERE email = ? AND deleted_at IS NULL')
    .get(input.email)) as { id: string; is_guest: number } | undefined;
  if (!user || Number(user.is_guest) === 1) {
    throw new ReviewError('no-such-account', 'There is no account with that email address. The reviewer signs up first.', 404);
  }
  const at = now.toISOString();
  await db
    .prepare(
      `INSERT INTO reviewers (user_id, public_name, public_credentials, exam_keys_json, author_aliases_json,
                              granted_by, granted_at, confirmed_at, revoked_at, revoked_by, revoke_reason, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         public_name = excluded.public_name, public_credentials = excluded.public_credentials,
         exam_keys_json = excluded.exam_keys_json, author_aliases_json = excluded.author_aliases_json,
         granted_by = excluded.granted_by, granted_at = excluded.granted_at, confirmed_at = NULL,
         revoked_at = NULL, revoked_by = NULL, revoke_reason = NULL, updated_at = excluded.updated_at`,
    )
    .run(
      user.id,
      input.publicName,
      input.publicCredentials,
      JSON.stringify([...new Set(input.examKeys)].sort()),
      JSON.stringify([...new Set(input.authorAliases)]),
      actor.id,
      at,
      at,
    );
  await audit(db, actor.id, 'reviewer.granted', 'reviewer', user.id, {
    publicName: input.publicName,
    publicCredentials: input.publicCredentials,
    examKeys: input.examKeys,
    authorAliases: input.authorAliases,
    selfGranted: actor.id === user.id,
  }, at);
  return (await getReviewer(db, user.id))!;
}

/** The reviewer confirms, on their own account, that the public wording of their credentials is accurate. */
export async function confirmReviewer(db: Db, actor: AuthUser, now = new Date()): Promise<ReviewerProfile> {
  const profile = await getReviewer(db, actor.id);
  if (!profile || profile.status === 'revoked') {
    throw new ReviewError('not-a-reviewer', 'This account is not authorised to review questions.', 403);
  }
  if (profile.status === 'active') return profile;
  const at = now.toISOString();
  await db.prepare('UPDATE reviewers SET confirmed_at = ?, updated_at = ? WHERE user_id = ? AND revoked_at IS NULL').run(at, at, actor.id);
  await audit(db, actor.id, 'reviewer.confirmed', 'reviewer', actor.id, {
    publicName: profile.publicName,
    publicCredentials: profile.publicCredentials,
  }, at);
  return (await getReviewer(db, actor.id))!;
}

/**
 * Withdraws the authorisation. Decisions already recorded stay in the ledger,
 * and approvals made while the person was authorised still stand; to withdraw
 * one, another reviewer records a request for changes on that content.
 */
export async function revokeReviewer(db: Db, actor: AuthUser, userId: string, reason: string, now = new Date()): Promise<void> {
  if (actor.role !== 'admin') throw new ReviewError('forbidden', 'Only an administrator can withdraw a reviewer.', 403);
  const profile = await getReviewer(db, userId);
  if (!profile) throw new ReviewError('not-found', 'That person is not a reviewer.', 404);
  const at = now.toISOString();
  await db
    .prepare('UPDATE reviewers SET revoked_at = ?, revoked_by = ?, revoke_reason = ?, updated_at = ? WHERE user_id = ?')
    .run(at, actor.id, reason, at, userId);
  await audit(db, actor.id, 'reviewer.revoked', 'reviewer', userId, { reason }, at);
}

// ---------------------------------------------------------------------------
// Recording a review
// ---------------------------------------------------------------------------

export const recordReviewSchema = z
  .object({
    questionVersionId: z.string().min(1).max(64),
    /** The fingerprint shown on the review page, so a review is of the content the reviewer actually read. */
    reviewFingerprint: z.string().regex(/^[0-9a-f]{64}$/),
    outcome: z.enum(REVIEW_OUTCOMES),
    checked: z.array(z.enum(REVIEW_CRITERIA)).max(REVIEW_CRITERIA.length),
    notes: z.string().trim().max(4000).default(''),
  })
  .superRefine((value, ctx) => {
    if (value.outcome === 'approved' && REVIEW_CRITERIA.some((c) => !value.checked.includes(c))) {
      ctx.addIssue({
        code: 'custom',
        path: ['checked'],
        message: 'An approval must confirm all four checks: answer key, explanation, wording and syllabus alignment.',
      });
    }
    if (value.outcome === 'changes_requested' && value.notes.length < 10) {
      ctx.addIssue({ code: 'custom', path: ['notes'], message: 'Say what needs to change.' });
    }
  });
export type RecordReviewInput = z.infer<typeof recordReviewSchema>;

/** Lower-cased, whitespace-collapsed, so "Maria Rossi" and "maria  rossi" are the same person. */
function identity(value: string | null | undefined): string | null {
  const trimmed = value?.trim().toLowerCase().replace(/\s+/g, ' ');
  return trimmed ? trimmed : null;
}

/** The names a question version records as its authors and editors. */
export function authorIdentities(row: Pick<QuestionVersionRow, 'author' | 'provenance'>): string[] {
  const names = [row.author];
  try {
    const provenance = JSON.parse(row.provenance) as { authoredBy?: string; editedBy?: string[] };
    if (provenance.authoredBy) names.push(provenance.authoredBy);
    if (Array.isArray(provenance.editedBy)) names.push(...provenance.editedBy);
  } catch {
    // A malformed provenance column cannot widen what counts as independent.
  }
  return names.map(identity).filter((n): n is string => n !== null);
}

/** Whether this reviewer is, under any name they use, one of the question's authors or editors. */
export function isOwnWork(
  profile: Pick<ReviewerProfile, 'publicName' | 'authorAliases' | 'userId'>,
  account: { email: string | null; displayName: string | null },
  authors: readonly string[],
): boolean {
  const mine = [profile.publicName, profile.userId, account.email, account.displayName, ...profile.authorAliases]
    .map(identity)
    .filter((n): n is string => n !== null);
  return authors.some((author) => mine.includes(author));
}

export interface ReviewRecord {
  id: string;
  questionId: string;
  questionVersionId: string;
  questionVersion: number;
  reviewFingerprint: string;
  examKey: string;
  reviewerUserId: string | null;
  reviewerName: string;
  reviewerCredentials: string;
  outcome: ReviewOutcome;
  checked: ReviewCriterion[];
  notes: string | null;
  reviewedOn: string;
  createdAt: string;
}

interface ReviewRow {
  id: string;
  question_id: string;
  question_version_id: string;
  question_version: number;
  review_fingerprint: string;
  exam_key: string;
  reviewer_user_id: string | null;
  reviewer_name: string;
  reviewer_credentials: string;
  outcome: ReviewOutcome;
  checked_json: string;
  notes: string | null;
  reviewed_on: string;
  created_at: string;
}

function toRecord(row: ReviewRow): ReviewRecord {
  return {
    id: row.id,
    questionId: row.question_id,
    questionVersionId: row.question_version_id,
    questionVersion: Number(row.question_version),
    reviewFingerprint: row.review_fingerprint,
    examKey: row.exam_key,
    reviewerUserId: row.reviewer_user_id,
    reviewerName: row.reviewer_name,
    reviewerCredentials: row.reviewer_credentials,
    outcome: row.outcome,
    checked: parseOr<ReviewCriterion[]>(row.checked_json, []),
    notes: row.notes,
    reviewedOn: row.reviewed_on,
    createdAt: row.created_at,
  };
}

async function stimulusFor(db: Db, row: QuestionVersionRow): Promise<StimulusRow | null> {
  if (!row.stimulus_id || row.stimulus_version === null) return null;
  return ((await db.prepare('SELECT * FROM stimuli WHERE id = ? AND version = ?').get(row.stimulus_id, row.stimulus_version)) as
    | StimulusRow
    | undefined) ?? null;
}

/**
 * The fingerprint of what this row actually serves, recomputed from the stored
 * text, and whether it matches the one the seeder wrote. A mismatch means the
 * row was changed outside the content workflow; nobody may approve it then.
 */
export async function verifiedFingerprint(db: Db, row: QuestionVersionRow): Promise<{ stored: string | null; actual: string; matches: boolean }> {
  const actual = reviewFingerprint(contentFromRows(row, await stimulusFor(db, row)));
  const stored = row.review_fingerprint ?? null;
  return { stored, actual, matches: stored === actual };
}

/**
 * Records a reviewer's decision. Every rule is checked here, on the server,
 * against the acting account from the session: the reviewer's authorisation
 * and exam, that they are not an author, that the version is the current one,
 * that its content is what the page showed, and the four checks of an approval.
 */
export async function recordReview(db: Db, actor: AuthUser, input: RecordReviewInput, now = new Date()): Promise<ReviewRecord> {
  const profile = await getReviewer(db, actor.id);
  if (!profile || profile.status === 'revoked') {
    throw new ReviewError('not-a-reviewer', 'This account is not authorised to review questions.', 403);
  }
  if (profile.status !== 'active') {
    throw new ReviewError('reviewer-unconfirmed', 'Confirm the public wording of your credentials before reviewing.', 403);
  }

  const row = (await db.prepare('SELECT * FROM question_versions WHERE id = ?').get(input.questionVersionId)) as
    | QuestionVersionRow
    | undefined;
  if (!row) throw new ReviewError('not-found', 'That question version does not exist.', 404);
  const question = (await db.prepare('SELECT current_version, state FROM questions WHERE id = ?').get(row.question_id)) as
    | { current_version: number; state: string }
    | undefined;
  if (!question || Number(question.current_version) !== Number(row.version)) {
    throw new ReviewError('not-current-version', 'A newer version of this question exists. Review that one.', 409);
  }
  if (!(REVIEWABLE_STATES as readonly string[]).includes(question.state)) {
    throw new ReviewError('not-reviewable', `A question in the "${question.state}" state cannot be reviewed.`, 409);
  }
  if (!profile.examKeys.includes(row.exam_key)) {
    throw new ReviewError('exam-not-authorised', 'You are not authorised to review questions for this exam.', 403);
  }
  if (isOwnWork(profile, { email: actor.email, displayName: actor.displayName }, authorIdentities(row))) {
    throw new ReviewError('own-work', 'You wrote or edited this question, so someone else must review it.', 403);
  }

  const fingerprint = await verifiedFingerprint(db, row);
  if (!fingerprint.stored) {
    throw new ReviewError('not-fingerprinted', 'This question has not been loaded with a content fingerprint yet. Re-run the seed.', 409);
  }
  if (!fingerprint.matches) {
    throw new ReviewError('content-integrity', 'The stored content does not match its fingerprint. It was changed outside the content workflow.', 409);
  }
  if (input.reviewFingerprint !== fingerprint.stored) {
    throw new ReviewError('content-changed', 'The question changed after you opened it. Reload and review the current text.', 409);
  }

  const record: ReviewRecord = {
    id: randomUUID(),
    questionId: row.question_id,
    questionVersionId: row.id,
    questionVersion: Number(row.version),
    reviewFingerprint: fingerprint.stored,
    examKey: row.exam_key,
    reviewerUserId: actor.id,
    reviewerName: profile.publicName,
    reviewerCredentials: profile.publicCredentials,
    outcome: input.outcome,
    checked: REVIEW_CRITERIA.filter((c) => input.checked.includes(c)),
    notes: input.notes ? input.notes : null,
    reviewedOn: now.toISOString().slice(0, 10),
    createdAt: now.toISOString(),
  };
  const write = db.transaction(async () => {
    await db
      .prepare(
        `INSERT INTO question_reviews (id, question_id, question_version_id, question_version, review_fingerprint, exam_key,
                                       reviewer_user_id, reviewer_name, reviewer_credentials, outcome, checked_json, notes,
                                       reviewed_on, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        record.id,
        record.questionId,
        record.questionVersionId,
        record.questionVersion,
        record.reviewFingerprint,
        record.examKey,
        record.reviewerUserId,
        record.reviewerName,
        record.reviewerCredentials,
        record.outcome,
        JSON.stringify(record.checked),
        record.notes,
        record.reviewedOn,
        record.createdAt,
      );
    await audit(db, actor.id, `question_review.${record.outcome}`, 'question', record.questionId, {
      reviewId: record.id,
      version: record.questionVersion,
      fingerprint: record.reviewFingerprint,
      checked: record.checked,
    }, record.createdAt);
  });
  await write();
  return record;
}

// ---------------------------------------------------------------------------
// Reading the ledger
// ---------------------------------------------------------------------------

/** Every decision on any version of this question, newest first. */
export async function reviewHistory(db: Db, questionId: string): Promise<ReviewRecord[]> {
  const rows = (await db
    .prepare('SELECT * FROM question_reviews WHERE question_id = ? ORDER BY created_at DESC')
    .all(questionId)) as ReviewRow[];
  return rows.map(toRecord);
}

/** Every decision recorded for these exams, for the coverage report. */
export async function reviewDecisions(db: Db, examKeys?: readonly string[]): Promise<ReviewRecord[]> {
  const where = examKeys?.length ? `WHERE exam_key IN (${examKeys.map(() => '?').join(', ')})` : '';
  const rows = (await db.prepare(`SELECT * FROM question_reviews ${where}`).all(...(examKeys ?? []))) as ReviewRow[];
  return rows.map(toRecord);
}

/**
 * The approval that stands for exactly this version and content, if any. Used
 * wherever a review is named: only an approval of the version a learner saw
 * is ever shown to them.
 */
export async function standingApprovalFor(db: Db, questionVersionId: string): Promise<ReviewRecord | null> {
  const row = (await db.prepare('SELECT id, review_fingerprint FROM question_versions WHERE id = ?').get(questionVersionId)) as
    | { id: string; review_fingerprint: string | null }
    | undefined;
  if (!row?.review_fingerprint) return null;
  const rows = (await db
    .prepare('SELECT * FROM question_reviews WHERE question_version_id = ? AND review_fingerprint = ?')
    .all(row.id, row.review_fingerprint)) as ReviewRow[];
  return standingApproval(rows.map(toRecord), row.id, row.review_fingerprint);
}

/** How many questions of these exams are currently served with a standing human approval. */
export async function humanApprovedCount(db: Db, examKeys: readonly string[]): Promise<number> {
  if (examKeys.length === 0) return 0;
  const row = (await db
    .prepare(
      `SELECT COUNT(*) AS n
         FROM question_versions qv
         JOIN questions q ON q.id = qv.question_id AND q.current_version = qv.version
        WHERE qv.exam_key IN (${examKeys.map(() => '?').join(', ')})
          AND qv.state = 'published' AND q.state = 'published'
          AND ${humanApprovalSql('qv')}`,
    )
    .get(...examKeys)) as { n: number };
  return Number(row.n);
}

/** Audit entries for one question: state changes, content changes and review decisions, newest first. */
export async function questionAuditTrail(db: Db, questionId: string): Promise<Array<{ action: string; actorUserId: string | null; payload: unknown; createdAt: string }>> {
  const rows = (await db
    .prepare(
      `SELECT action, actor_user_id, payload_json, created_at FROM audit_log
        WHERE entity_type = 'question' AND entity_id = ? ORDER BY id DESC`,
    )
    .all(questionId)) as Array<{ action: string; actor_user_id: string | null; payload_json: string | null; created_at: string }>;
  return rows.map((row) => ({
    action: row.action,
    actorUserId: row.actor_user_id,
    payload: row.payload_json ? (JSON.parse(row.payload_json) as unknown) : null,
    createdAt: row.created_at,
  }));
}
