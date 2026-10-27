import { describe, expect, it } from 'vitest';
import {
  EXPERT_REVIEWS,
  expertReviewFor,
  expertReviewedCount,
  expertReviewSchema,
  validateExpertReviews,
  type ExpertReview,
} from '@/lib/content/expert-reviews';

/**
 * The human expert review ledger. A review is shown only for the exact
 * question version that was reviewed, only when approved, and never for a
 * question that does not exist.
 */

const review = (overrides: Partial<ExpertReview> = {}): ExpertReview =>
  expertReviewSchema.parse({
    questionId: 'bocconi-ug-alg-linear-two-step-001',
    examKey: 'bocconi-undergraduate',
    version: 2,
    reviewer: { name: 'Maria Rossi', credentials: 'Mathematics teacher, liceo scientifico, 12 years' },
    reviewedOn: '2026-10-20',
    checked: ['answer-key', 'explanation'],
    outcome: 'approved',
    ...overrides,
  });

describe('expert review ledger', () => {
  it('records no review today, so the site claims none', () => {
    expect(EXPERT_REVIEWS).toEqual([]);
  });

  it('shows an approved review only for the version that was reviewed', () => {
    const ledger = [review()];
    expect(expertReviewFor('bocconi-ug-alg-linear-two-step-001', 2, ledger)?.reviewer.name).toBe('Maria Rossi');
    expect(expertReviewFor('bocconi-ug-alg-linear-two-step-001', 3, ledger)).toBeNull();
    expect(expertReviewFor('bocconi-ug-alg-linear-two-step-001', 2, [review({ outcome: 'changes-requested' })])).toBeNull();
  });

  it('counts only current, approved reviews of the exams asked about', () => {
    const ledger = [review(), review({ questionId: 'other', version: 1 }), review({ examKey: 'gmat', questionId: 'g' })];
    const current = new Map([
      ['bocconi-ug-alg-linear-two-step-001', 2],
      ['other', 2],
      ['g', 2],
    ]);
    expect(expertReviewedCount(['bocconi-undergraduate', 'bocconi-law'], current, ledger)).toBe(1);
  });

  it('flags reviews of unknown questions, future versions and stale versions', () => {
    const bank = [{ id: 'bocconi-ug-alg-linear-two-step-001', examKey: 'bocconi-undergraduate', version: 3 }];
    const codes = (r: ExpertReview) => validateExpertReviews(bank, [r]).map((i) => `${i.level}:${i.code}`);
    expect(codes(review({ questionId: 'missing' }))).toEqual(['error:expert-review-unknown-question']);
    expect(codes(review({ version: 4 }))).toEqual(['error:expert-review-future-version']);
    expect(codes(review({ version: 2 }))).toEqual(['warning:expert-review-stale']);
    expect(codes(review({ version: 3 }))).toEqual([]);
  });

  it('refuses a review without a named, qualified reviewer', () => {
    expect(() => review({ reviewer: { name: 'AI', credentials: 'model' } })).toThrow();
  });
});
