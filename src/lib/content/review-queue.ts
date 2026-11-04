import type { Db } from '@/lib/db';
import { getCandidates, type CandidateItem } from './repository';
import {
  approvalStatus,
  authorIdentities,
  humanApprovalRequired,
  isOwnWork,
  reviewDecisions,
  type ApprovalStatus,
  type ReviewerProfile,
  type ReviewRecord,
} from './human-review';
import { PUBLIC_SAMPLES } from './public-samples';

/**
 * Where every current question version stands in the human approval
 * pipeline, for the admin review queue and the approval reports. Read-only.
 */

/** Why a question is near the top of the queue: what learners see most comes first. */
export interface ReviewPriority {
  /** Shown with its answer on a public page, so anyone can read the key. */
  publicSample: boolean;
  /** Learner reports still open, on any version. */
  openReports: number;
  /** Times it was put in front of a learner, on any version. */
  timesServed: number;
}

export interface QueueRow extends CandidateItem {
  version: number;
  status: ApprovalStatus;
  /** The most recent decision on this exact version and content, if any. */
  latestDecision: ReviewRecord | null;
  /** Decisions on earlier versions or earlier content of this question. */
  earlierDecisions: number;
  priority: ReviewPriority;
}

export const STATUS_ORDER: readonly ApprovalStatus[] = [
  'awaiting-human-review',
  'changes-requested',
  'approved',
  'in-automated-review',
  'draft',
  'quarantined',
  'retired',
];

/**
 * The label for a status, which says whether learners get the question. That
 * depends on the rule in force: while human approval is optional, a question
 * awaiting review is served; one sent back for changes never is.
 */
export function statusLabel(status: ApprovalStatus, required: boolean = humanApprovalRequired()): string {
  switch (status) {
    case 'approved':
      return 'Human-approved — served';
    case 'awaiting-human-review':
      return required ? 'Awaiting human review — not served' : 'Awaiting human review — served meanwhile';
    case 'changes-requested':
      return 'Changes requested — not served';
    case 'in-automated-review':
      return 'In automated review — not served';
    case 'draft':
      return 'Draft — not served';
    case 'quarantined':
      return 'Quarantined — not served';
    case 'retired':
      return 'Retired — not served';
  }
}

export const STATUS_TONE: Record<ApprovalStatus, 'neutral' | 'positive' | 'caution' | 'negative'> = {
  approved: 'positive',
  'awaiting-human-review': 'caution',
  'changes-requested': 'negative',
  'in-automated-review': 'neutral',
  draft: 'neutral',
  quarantined: 'negative',
  retired: 'neutral',
};

function inList(examKeys: readonly string[]): string {
  return examKeys.map(() => '?').join(', ') || "''";
}

async function countsByQuestion(db: Db, sql: string, examKeys: readonly string[]): Promise<Map<string, number>> {
  const rows = (await db.prepare(sql).all(...examKeys)) as Array<{ questionId: string; n: number | string }>;
  return new Map(rows.map((row) => [row.questionId, Number(row.n)]));
}

export async function reviewQueue(db: Db, examKeys: readonly string[]): Promise<QueueRow[]> {
  const decisions = await reviewDecisions(db, examKeys);
  const versions = new Map<string, number>(
    (
      (await db
        .prepare(`SELECT id, version FROM question_versions WHERE exam_key IN (${inList(examKeys)})`)
        .all(...examKeys)) as Array<{ id: string; version: number }>
    ).map((row) => [row.id, Number(row.version)]),
  );
  const served = await countsByQuestion(
    db,
    `SELECT ai.question_id AS questionId, COUNT(*) AS n
       FROM attempt_items ai JOIN questions q ON q.id = ai.question_id
      WHERE q.exam_key IN (${inList(examKeys)})
      GROUP BY ai.question_id`,
    examKeys,
  );
  const reports = await countsByQuestion(
    db,
    `SELECT cf.question_id AS questionId, COUNT(*) AS n
       FROM content_flags cf JOIN questions q ON q.id = cf.question_id
      WHERE cf.status = 'open' AND q.exam_key IN (${inList(examKeys)})
      GROUP BY cf.question_id`,
    examKeys,
  );
  const samples = new Set(PUBLIC_SAMPLES.map((sample) => sample.questionId));

  const rows: QueueRow[] = [];
  for (const examKey of examKeys) {
    for (const item of await getCandidates(db, examKey)) {
      const mine = decisions
        .filter((d) => d.questionVersionId === item.questionVersionId && d.reviewFingerprint === item.reviewFingerprint)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      const latest = mine[0] ?? null;
      rows.push({
        ...item,
        version: versions.get(item.questionVersionId) ?? 0,
        status: approvalStatus(item.state, item.humanApproved, latest?.outcome ?? null),
        latestDecision: latest,
        earlierDecisions: decisions.filter((d) => d.questionId === item.questionId).length - mine.length,
        priority: {
          publicSample: samples.has(item.questionId),
          openReports: reports.get(item.questionId) ?? 0,
          timesServed: served.get(item.questionId) ?? 0,
        },
      });
    }
  }
  return rows.sort(byReviewPriority);
}

/**
 * The order reviewers work in: open learner reports first (someone already
 * thinks it is wrong), then the public samples (anyone can read their key),
 * then the questions learners have been given most, then exam and id, so the
 * order is stable from one visit to the next.
 */
export function byReviewPriority(a: QueueRow, b: QueueRow): number {
  return (
    b.priority.openReports - a.priority.openReports ||
    Number(b.priority.publicSample) - Number(a.priority.publicSample) ||
    b.priority.timesServed - a.priority.timesServed ||
    (a.examKey < b.examKey ? -1 : a.examKey > b.examKey ? 1 : 0) ||
    (a.questionId < b.questionId ? -1 : a.questionId > b.questionId ? 1 : 0)
  );
}

/**
 * The next question this reviewer can decide on, after `currentQuestionId`:
 * awaiting human review, in an exam they are authorised for, and not their
 * own work. Rows must already be in queue order (`reviewQueue` returns them so).
 */
export function nextForReviewer(
  rows: readonly QueueRow[],
  reviewer: Pick<ReviewerProfile, 'publicName' | 'authorAliases' | 'userId' | 'examKeys'>,
  account: { email: string | null; displayName: string | null },
  currentQuestionId: string,
): QueueRow | null {
  return (
    rows.find(
      (row) =>
        row.questionId !== currentQuestionId &&
        row.status === 'awaiting-human-review' &&
        reviewer.examKeys.includes(row.examKey) &&
        !isOwnWork(reviewer, account, authorIdentities(row)),
    ) ?? null
  );
}

export function countByStatus(rows: readonly QueueRow[]): Record<ApprovalStatus, number> {
  const counts = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0])) as Record<ApprovalStatus, number>;
  for (const row of rows) counts[row.status] += 1;
  return counts;
}
