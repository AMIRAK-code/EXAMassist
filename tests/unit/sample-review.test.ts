import { describe, expect, it } from 'vitest';
import { listGuides } from '@/lib/content/guides';
import { listHubContent, listHubTranslations } from '@/lib/exams/hub-content';
import { currentApproval, listPublishedSamples, sampleFingerprint, sampleReviewLedger } from '@/lib/content/sample-review';

/**
 * The human-review ledger for public worked samples
 * (content/reviews/editorial-samples.json) and what the pages may say about it.
 */

const ledger = sampleReviewLedger();
const samples = listPublishedSamples();

describe('the sample review ledger', () => {
  it('parses, and covers the samples the review package lists', () => {
    expect(samples.length).toBeGreaterThanOrEqual(11 + 8 + 8);
    const pages = new Set(samples.map((s) => s.page));
    expect(pages).toContain('guide:bocconi-admission-test-sample-questions');
    expect(pages).toContain('hub:cisia-tolc');
    expect(pages).toContain('hub:cisia-tolc:it');
  });

  it('names only reviewers it records, each with consent given on or before their reviews', () => {
    const ids = new Set(ledger.reviewers.map((r) => r.id));
    expect(ids.size).toBe(ledger.reviewers.length);
    for (const review of ledger.reviews) {
      const reviewer = ledger.reviewers.find((r) => r.id === review.reviewerId);
      expect(reviewer, review.sampleId).toBeDefined();
      expect(reviewer!.consent.givenOn <= review.reviewedOn, review.sampleId).toBe(true);
      expect(reviewer!.consent.publishName, `${reviewer!.id} has not agreed to be named`).toBe(true);
    }
  });

  it('records decisions only on samples that exist, by reviewers who read the language', () => {
    for (const review of ledger.reviews) {
      const sample = samples.find((s) => s.page === review.page && s.question.id === review.sampleId);
      expect(sample, `${review.page} ${review.sampleId}`).toBeDefined();
      const reviewer = ledger.reviewers.find((r) => r.id === review.reviewerId)!;
      expect(reviewer.languages, review.sampleId).toContain(sample!.locale);
      if (review.outcome === 'changes_requested') expect(review.notes.length, review.sampleId).toBeGreaterThan(10);
    }
  });

  it('holds no approval of text that has changed since: re-review it, or remove the decision', () => {
    for (const review of ledger.reviews.filter((r) => r.outcome === 'approved')) {
      const sample = samples.find((s) => s.page === review.page && s.question.id === review.sampleId)!;
      expect(review.fingerprint, `${review.page} ${review.sampleId} changed after approval`).toBe(sampleFingerprint(sample.question));
    }
  });

  it('fingerprints every visible part of a sample', () => {
    const q = samples[0].question;
    const base = sampleFingerprint(q);
    expect(sampleFingerprint({ ...q, lesson: `${q.lesson} ` })).not.toBe(base);
    expect(sampleFingerprint({ ...q, options: q.options.map((o, i) => (i === 0 ? { ...o, note: `${o.note}.` } : o)) })).not.toBe(base);
    expect(sampleFingerprint({ ...q, answer: q.options.find((o) => o.id !== q.answer)!.id })).not.toBe(base);
  });
});

describe('what public pages say about human review of their samples', () => {
  const approvedEverywhere = (page: string) => samples.filter((s) => s.page === page).every((s) => currentApproval(s, ledger));

  const pages = [
    ...listGuides().filter((g) => g.samples).map((g) => ({ page: `guide:${g.slug}`, text: `${g.bodyMd}\n${g.samples!.afterMd}` })),
    ...listHubContent().filter(([, c]) => c.samples).map(([slug, c]) => ({ page: `hub:${slug}`, text: c.samples!.set.afterMd })),
    ...listHubTranslations().filter(([, , c]) => c.samples).map(([slug, l, c]) => ({ page: `hub:${slug}:${l}`, text: c.samples!.set.afterMd })),
  ];

  it('say plainly that no human expert has reviewed them, until the ledger shows that one has', () => {
    for (const { page, text } of pages) {
      if (approvedEverywhere(page)) continue;
      expect(text, page).toMatch(/not been reviewed by a human subject expert|no human subject expert has reviewed|nessun esperto della materia li ha ancora rivisti/);
    }
  });

  it('never claim expert review, endorsement or official status without it', () => {
    for (const { page, text } of pages) {
      if (approvedEverywhere(page)) continue;
      expect(text, page).not.toMatch(/\b(?:expert-reviewed|reviewed by (?:a|an|our) (?:teacher|expert|tutor)|approved by|endorsed by|rivist[eio] da un (?:docente|esperto)|approvat[eio] da)\b/i);
    }
  });
});
