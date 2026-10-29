import type { Db } from '@/lib/db';
import { getCandidates, type CandidateItem } from './repository';
import { approvalStatus, reviewDecisions, type ApprovalStatus, type ReviewRecord } from './human-review';

/**
 * Where every current question version stands in the human approval
 * pipeline, for the admin review queue and the approval reports. Read-only.
 */

export interface QueueRow extends CandidateItem {
  version: number;
  status: ApprovalStatus;
  /** The most recent decision on this exact version and content, if any. */
  latestDecision: ReviewRecord | null;
  /** Decisions on earlier versions or earlier content of this question. */
  earlierDecisions: number;
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

export const STATUS_LABEL: Record<ApprovalStatus, string> = {
  approved: 'Human-approved — served',
  'awaiting-human-review': 'Awaiting human review — not served',
  'changes-requested': 'Changes requested — not served',
  'in-automated-review': 'In automated review — not served',
  draft: 'Draft — not served',
  quarantined: 'Quarantined — not served',
  retired: 'Retired — not served',
};

export const STATUS_TONE: Record<ApprovalStatus, 'neutral' | 'positive' | 'caution' | 'negative'> = {
  approved: 'positive',
  'awaiting-human-review': 'caution',
  'changes-requested': 'negative',
  'in-automated-review': 'neutral',
  draft: 'neutral',
  quarantined: 'negative',
  retired: 'neutral',
};

export async function reviewQueue(db: Db, examKeys: readonly string[]): Promise<QueueRow[]> {
  const decisions = await reviewDecisions(db, examKeys);
  const versions = new Map<string, number>(
    (
      (await db
        .prepare(`SELECT id, version FROM question_versions WHERE exam_key IN (${examKeys.map(() => '?').join(', ') || "''"})`)
        .all(...examKeys)) as Array<{ id: string; version: number }>
    ).map((row) => [row.id, Number(row.version)]),
  );
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
      });
    }
  }
  return rows;
}

export function countByStatus(rows: readonly QueueRow[]): Record<ApprovalStatus, number> {
  const counts = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0])) as Record<ApprovalStatus, number>;
  for (const row of rows) counts[row.status] += 1;
  return counts;
}
