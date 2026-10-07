import { z } from 'zod';
import ledger from '../../../content/expert-reviews.json';

/**
 * The record of genuine human expert review.
 *
 * Every question is AI-assisted and blind-solved by a separate AI reviewer
 * (see the editorial standards page); none of that is human review, and the
 * site never implies otherwise. This ledger is where a review by a named,
 * qualified person is recorded, one entry per question version. A review is
 * shown only while the question is still at the version that was reviewed:
 * editing a question makes its old review stale, and the site stops showing
 * it until somebody reviews the new version.
 *
 * The file is imported, not read from disk, so it ships with the build and
 * works on Cloudflare Workers. How to record a review: docs/EXPERT-REVIEW.md.
 */

export const expertReviewSchema = z
  .object({
    questionId: z.string().min(1),
    examKey: z.string().min(1),
    /** The question version the reviewer actually read. */
    version: z.number().int().positive(),
    reviewer: z
      .object({
        name: z.string().min(3),
        /** What qualifies them, as it may be shown publicly: "Mathematics teacher, liceo scientifico, 12 years". */
        credentials: z.string().min(10),
      })
      .strict(),
    reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'reviewedOn is YYYY-MM-DD'),
    /** What the reviewer checked. Only what is listed here is claimed. */
    checked: z.array(z.enum(['answer-key', 'explanation', 'wording', 'syllabus-alignment'])).min(1),
    /** Only an approval is ever shown. A review asking for changes is kept as a record and leads to a new version. */
    outcome: z.enum(['approved', 'changes-requested']),
    notes: z.string().default(''),
  })
  .strict();

export type ExpertReview = z.infer<typeof expertReviewSchema>;

const ledgerSchema = z.object({ $comment: z.string().optional(), reviews: z.array(expertReviewSchema) }).strict();

/** Parsed once at module load; a malformed ledger fails the build and the tests rather than a page. */
export const EXPERT_REVIEWS: readonly ExpertReview[] = ledgerSchema.parse(ledger).reviews;

/** The approved review of exactly this question version, if one is recorded. */
export function expertReviewFor(
  questionId: string,
  version: number,
  reviews: readonly ExpertReview[] = EXPERT_REVIEWS,
): ExpertReview | null {
  return reviews.find((r) => r.questionId === questionId && r.version === version && r.outcome === 'approved') ?? null;
}

/**
 * How many questions of these exams carry an approved review of their current
 * version. `currentVersions` maps question id to the version now published.
 */
export function expertReviewedCount(
  examKeys: readonly string[],
  currentVersions: ReadonlyMap<string, number>,
  reviews: readonly ExpertReview[] = EXPERT_REVIEWS,
): number {
  const ids = new Set(
    reviews
      .filter((r) => examKeys.includes(r.examKey) && r.outcome === 'approved' && currentVersions.get(r.questionId) === r.version)
      .map((r) => r.questionId),
  );
  return ids.size;
}

export interface LedgerIssue {
  level: 'error' | 'warning';
  code: string;
  message: string;
}

/**
 * Checks the ledger against the bank. A review of a question that does not
 * exist is an error; a review of an older version is a warning, because it is
 * still a true record but is no longer shown.
 */
export function validateExpertReviews(
  questions: ReadonlyArray<{ id: string; examKey: string; version: number }>,
  reviews: readonly ExpertReview[] = EXPERT_REVIEWS,
): LedgerIssue[] {
  const issues: LedgerIssue[] = [];
  const byId = new Map(questions.map((q) => [q.id, q]));
  const seen = new Set<string>();
  for (const review of reviews) {
    const question = byId.get(review.questionId);
    const label = `${review.questionId} v${review.version}`;
    if (!question) {
      issues.push({ level: 'error', code: 'expert-review-unknown-question', message: `${label}: no such question.` });
      continue;
    }
    if (question.examKey !== review.examKey) {
      issues.push({ level: 'error', code: 'expert-review-exam', message: `${label}: the question belongs to ${question.examKey}.` });
    }
    if (review.version > question.version) {
      issues.push({ level: 'error', code: 'expert-review-future-version', message: `${label}: the question is only at v${question.version}.` });
    } else if (review.version < question.version && review.outcome === 'approved') {
      issues.push({
        level: 'warning',
        code: 'expert-review-stale',
        message: `${label}: the question has changed since (now v${question.version}), so this review is no longer shown.`,
      });
    }
    const key = `${label} ${review.reviewer.name}`;
    if (seen.has(key)) issues.push({ level: 'error', code: 'expert-review-duplicate', message: `${label}: recorded twice for ${review.reviewer.name}.` });
    seen.add(key);
  }
  return issues;
}
