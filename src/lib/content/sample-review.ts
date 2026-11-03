import { createHash } from 'node:crypto';
import { z } from 'zod';
import ledgerJson from '../../../content/reviews/editorial-samples.json';
import { listGuides, type SampleQuestion, type SampleQuestionSet } from './guides';
import { listHubContent, listHubTranslations } from '@/lib/exams/hub-content';

/**
 * Human review of the worked sample questions on public pages (the Bocconi
 * sample guide, the TOLC hub and its translations).
 *
 * Those samples are not in the question bank, so the bank's review ledger
 * (`reviewers` and `question_reviews`, docs/EXPERT-REVIEW.md) cannot record
 * them. This one is a file under version control instead:
 * content/reviews/editorial-samples.json. It records who reviewed, what they
 * agreed may be shown publicly, when they consented, and which exact text
 * they approved (a fingerprint of the question, its options, notes, working
 * and lesson). Editing a sample changes its fingerprint, and the approval stops
 * counting until someone reviews the new text: tests/unit/sample-review.test.ts
 * fails on any approval that no longer matches.
 *
 * Only real people, with their written consent, go in the ledger. Nothing on a
 * page may say a sample was reviewed until an approval of its current text is
 * recorded here. Read by tests and scripts only; pages do not import it.
 */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const reviewerSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** The name shown publicly, exactly as the reviewer agreed it in writing. */
  publicName: z.string().min(3),
  /** One line of credentials, in the reviewer's own words, that they agreed may be shown. */
  publicCredentials: z.string().min(10),
  /** Subjects and languages they are qualified to review, e.g. "mathematics", "it". */
  subjects: z.array(z.string()).min(1),
  languages: z.array(z.string().regex(/^[a-z]{2}$/)).min(1),
  consent: z.object({
    /** When they confirmed, in writing, the name and line above and that both may be published. */
    givenOn: isoDate,
    /** Where the written confirmation is kept: a reference, never the message or any private data. */
    record: z.string().min(5),
    publishName: z.boolean(),
    withdrawnOn: isoDate.nullable(),
  }),
  /** How their qualification was checked, as a reference (e.g. "school website, checked 2026-11-10"). */
  qualificationChecked: z.string().min(5),
  /** Names they have written or edited content under: they may never approve that content. */
  authorAliases: z.array(z.string()),
});

const reviewSchema = z.object({
  /** "hub:cisia-tolc", "hub:cisia-tolc:it" or "guide:bocconi-admission-test-sample-questions". */
  page: z.string(),
  sampleId: z.string(),
  fingerprint: z.string().regex(/^[0-9a-f]{64}$/),
  reviewerId: z.string(),
  reviewedOn: isoDate,
  outcome: z.enum(['approved', 'changes_requested']),
  /** All four must be true for an approval; translation too for a translated page. */
  checks: z.object({
    answerKey: z.boolean(),
    explanation: z.boolean(),
    wording: z.boolean(),
    syllabus: z.boolean(),
    translation: z.boolean().optional(),
  }),
  notes: z.string(),
});

export const ledgerSchema = z.object({
  reviewers: z.array(reviewerSchema),
  reviews: z.array(reviewSchema),
});

export type SampleReviewLedger = z.infer<typeof ledgerSchema>;
export type SampleReview = z.infer<typeof reviewSchema>;

export function sampleReviewLedger(): SampleReviewLedger {
  return ledgerSchema.parse(ledgerJson);
}

/** SHA-256 of everything a reader sees of one sample, in a fixed order. */
export function sampleFingerprint(question: SampleQuestion): string {
  const canonical = JSON.stringify([
    question.stimulusMd ?? '',
    question.stemMd,
    question.options.map((o) => [o.id, o.text, o.note]),
    question.answer,
    question.workingMd,
    question.lesson,
  ]);
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

export interface PublishedSample {
  page: string;
  /** The public address, for the review package. */
  path: string;
  locale: string;
  section: string;
  question: SampleQuestion;
}

/** Every worked sample shown on a public page, in every language it is published in. */
export function listPublishedSamples(): PublishedSample[] {
  const fromSet = (page: string, path: string, locale: string, set: SampleQuestionSet | undefined) =>
    (set?.sections ?? []).flatMap((section) => section.questions.map((question) => ({ page, path, locale, section: section.heading, question })));
  return [
    ...listGuides().flatMap((guide) => fromSet(`guide:${guide.slug}`, `/guides/${guide.slug}`, 'en', guide.samples)),
    ...listHubContent().flatMap(([slug, content]) => fromSet(`hub:${slug}`, `/exams/${slug}`, 'en', content.samples?.set)),
    ...listHubTranslations().flatMap(([slug, locale, content]) =>
      fromSet(`hub:${slug}:${locale}`, `/${locale}/exams/${slug}`, locale, content.samples?.set),
    ),
  ];
}

/**
 * The standing approval of a sample's current text, if any: the latest
 * decision on that exact fingerprint is an approval with every check, by a
 * reviewer whose consent stands and who did not write it.
 */
export function currentApproval(sample: PublishedSample, ledger = sampleReviewLedger()): SampleReview | undefined {
  const fingerprint = sampleFingerprint(sample.question);
  const decisions = ledger.reviews
    .filter((r) => r.page === sample.page && r.sampleId === sample.question.id && r.fingerprint === fingerprint)
    .sort((a, b) => a.reviewedOn.localeCompare(b.reviewedOn));
  const latest = decisions.at(-1);
  if (!latest || latest.outcome !== 'approved') return undefined;
  const reviewer = ledger.reviewers.find((r) => r.id === latest.reviewerId);
  if (!reviewer || reviewer.consent.withdrawnOn) return undefined;
  const { answerKey, explanation, wording, syllabus, translation } = latest.checks;
  if (!(answerKey && explanation && wording && syllabus)) return undefined;
  if (sample.locale !== 'en' && !translation) return undefined;
  return latest;
}
