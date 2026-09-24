import { z } from 'zod';
import { answerKeySchema, responseTypeSchema } from '@/lib/assessment/types';

/**
 * Question bank contract.
 *
 * OWNER: coordinating agent. Authors write one JSON file per question under
 * content/questions/<examKey>/<id>.json validated against this schema by
 * `npm run content:validate`, which is part of `npm run verify`.
 */

export const publicationStateSchema = z.enum([
  'draft',
  'in_review',
  'published',
  'retired',
  'quarantined',
]);
export type PublicationState = z.infer<typeof publicationStateSchema>;

export const optionSchema = z.object({
  id: z.string().regex(/^[a-z0-9_-]+$/, 'option ids are lowercase slugs'),
  label: z.string().min(1).max(4),
  textMd: z.string().min(1),
});
export type QuestionOption = z.infer<typeof optionSchema>;

export const provenanceSchema = z.object({
  /**
   * 'original' is the only value permitted for published content. We do not
   * reproduce official question banks.
   */
  origin: z.literal('original'),
  authoredBy: z.string().min(1),
  /** Set when a model drafted the item; such items always enter as 'draft'. */
  aiAssisted: z.boolean(),
  notes: z.string().default(''),
});

export const reviewSchema = z.object({
  author: z.string().min(1),
  reviewer: z.string().nullable(),
  reviewedOn: z.string().nullable(),
  /**
   * Evidence that a second party solved the item independently before it was
   * published, without seeing the proposed key.
   */
  independentSolve: z
    .object({
      solvedBy: z.string().min(1),
      solvedAnswer: z.string().min(1),
      agreesWithKey: z.boolean(),
      uniquenessChecked: z.boolean(),
      workingNotes: z.string().min(1),
    })
    .nullable(),
  notes: z.string().default(''),
});

export const questionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'question ids are kebab-case'),
    version: z.number().int().positive(),
    examKey: z.string().min(1),
    sectionKey: z.string().min(1),
    domainSlug: z.string().min(1),
    skillSlug: z.string().min(1),
    subskillSlug: z.string().nullable().default(null),
    responseType: responseTypeSchema,
    difficulty: z.enum(['easy', 'medium', 'hard']),
    /** 'editorial' until we have enough responses to calibrate. Never claim otherwise. */
    difficultyBasis: z.enum(['editorial', 'empirical']),
    stemMd: z.string().min(1),
    instructionsMd: z.string().nullable().default(null),
    options: z.array(optionSchema).default([]),
    answerKey: answerKeySchema,
    explanationMd: z.string().min(40, 'explanations must actually explain'),
    distractorRationale: z.record(z.string(), z.string()).default({}),
    estimatedSeconds: z.number().int().positive().max(3600),
    stimulusRef: z
      .object({ id: z.string().min(1), version: z.number().int().positive() })
      .nullable()
      .default(null),
    accessibilityText: z.string().nullable().default(null),
    provenance: provenanceSchema,
    rightsStatus: z.enum(['original-owned']),
    review: reviewSchema,
    state: publicationStateSchema,
    quarantine: z
      .object({ reason: z.string().min(1), replacedBy: z.string().nullable() })
      .nullable()
      .default(null),
    tags: z.array(z.string()).default([]),
  })
  .strict();

export type Question = z.infer<typeof questionSchema>;

export const stimulusSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    version: z.number().int().positive(),
    examKey: z.string().min(1),
    kind: z.enum(['passage', 'chart', 'table', 'figure']),
    title: z.string().nullable().default(null),
    bodyMd: z.string().nullable().default(null),
    /** Underlying data for charts/tables so an accessible table can be rendered. */
    data: z
      .object({
        columns: z.array(z.object({ key: z.string(), label: z.string() })),
        rows: z.array(z.record(z.string(), z.union([z.string(), z.number()]))),
        caption: z.string().default(''),
        chart: z
          .object({
            type: z.enum(['bar', 'line', 'scatter']),
            xKey: z.string(),
            yKeys: z.array(z.string()).min(1),
            xLabel: z.string(),
            yLabel: z.string(),
          })
          .nullable()
          .default(null),
      })
      .nullable()
      .default(null),
    accessibilityText: z.string().min(1),
    provenance: provenanceSchema,
    rightsStatus: z.enum(['original-owned']),
    state: publicationStateSchema,
  })
  .strict();

export type Stimulus = z.infer<typeof stimulusSchema>;

// ---------------------------------------------------------------------------
// Editorial rules that a JSON schema alone cannot express
// ---------------------------------------------------------------------------

export interface ContentIssue {
  level: 'error' | 'warning';
  code: string;
  message: string;
}

const CHOICE_RESPONSE_TYPES = new Set(['single_select', 'multi_select']);
/** Response types whose options are the exam's own fixed choice set. */
const FIXED_CHOICE_RESPONSE_TYPES = new Set(['quantitative_comparison', 'data_sufficiency']);

/**
 * Normalises option text so numerically equal choices collide as duplicates:
 * "0.50", ".5" and "1/2" are the same answer offered twice.
 *
 * Punctuation is only stripped while testing a NUMERIC reading. Text choices
 * keep their punctuation, because on the SAT and ACT the punctuation often *is*
 * the question: "light, while" and "light while," are different answers.
 */
export function normaliseChoiceText(text: string): string {
  const trimmed = text.trim().toLowerCase().replace(/\s+/g, ' ');

  // Try a numeric reading: drop currency symbols, thousands separators and any
  // surrounding maths delimiters authors use for KaTeX.
  const numericCandidate = trimmed.replace(/[$,]/g, '').replace(/^\$+|\$+$/g, '').trim();

  const fraction = /^(-?\d+)\s*\/\s*(\d+)$/.exec(numericCandidate);
  if (fraction) {
    const numerator = Number(fraction[1]);
    const denominator = Number(fraction[2]);
    if (denominator !== 0) return `num:${numerator / denominator}`;
  }

  if (numericCandidate !== '' && Number.isFinite(Number(numericCandidate))) {
    return `num:${Number(numericCandidate)}`;
  }

  return trimmed;
}

/**
 * Option letters an explanation explicitly presents as the answer: "the answer
 * is C", "so option A must be true", "That is (D).", or a closing "Choice B."
 * on its own. Letters inside maths are ignored. Deliberately narrow: a
 * sentence about why a wrong option fails ("the error behind option B.") is
 * not a claim that it is the answer.
 */
export function answerLettersNamed(explanationMd: string): string[] {
  const text = explanationMd.replace(/\$\$[\s\S]*?\$\$/g, ' ').replace(/\$[^$\n]*\$/g, ' ');
  const patterns = [
    /\b[Aa]nswer is (?:[Cc]hoice |[Oo]ption )?\(?([A-H])\)?(?![A-Za-z0-9'’])/g,
    /\b[Cc]orrect (?:[Cc]hoice|[Oo]ption) is \(?([A-H])\)?(?![A-Za-z0-9'’])/g,
    /\b(?:[Cc]hoice|[Oo]ption) \(?([A-H])\)? (?:must be true|is (?:the )?correct|is the answer)\b/g,
    /\(([A-H])\) (?:must be true|is (?:the )?correct|is the answer)\b/g,
    /\b(?:That|This|which) is (?:exactly )?(?:[Cc]hoice |[Oo]ption )?\(?([A-H])\)?(?=[.!])/g,
    /(?:^|[.!?]["”’']?[ \t]+)(?:[Cc]hoice|[Oo]ption) \(?([A-H])\)?\.[ \t]*$/gm,
  ];
  const found = new Set<string>();
  for (const pattern of patterns) for (const match of text.matchAll(pattern)) found.add(match[1]);
  return [...found];
}

/**
 * Editorial validation. Errors block publication; warnings are reported but do
 * not fail the build.
 */
export function validateQuestion(
  question: Question,
  context: { stimulusIds?: Set<string> } = {},
): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const err = (code: string, message: string) => issues.push({ level: 'error', code, message });
  const warn = (code: string, message: string) => issues.push({ level: 'warning', code, message });

  const optionIds = question.options.map((o) => o.id);
  const uniqueOptionIds = new Set(optionIds);
  if (uniqueOptionIds.size !== optionIds.length) {
    err('duplicate-option-id', 'Option ids must be unique.');
  }

  const needsOptions = CHOICE_RESPONSE_TYPES.has(question.responseType);
  if (needsOptions && question.options.length < 2) {
    err('missing-options', `${question.responseType} requires at least two options.`);
  }
  // Quantitative comparison and data sufficiency carry the exam's own fixed
  // choice set, and two-part items carry one option list per column.
  if (
    !needsOptions &&
    !FIXED_CHOICE_RESPONSE_TYPES.has(question.responseType) &&
    question.responseType !== 'two_part' &&
    question.options.length > 0
  ) {
    warn('unexpected-options', `${question.responseType} does not normally carry options.`);
  }

  // Duplicate / equivalent answer choices - explicitly required by the brief.
  if (question.options.length > 1) {
    const seen = new Map<string, string>();
    for (const option of question.options) {
      const key = normaliseChoiceText(option.textMd);
      const prior = seen.get(key);
      if (prior) {
        err(
          'equivalent-options',
          `Options ${prior} and ${option.id} are equivalent ("${option.textMd}"). More than one choice would be defensible.`,
        );
      } else {
        seen.set(key, option.id);
      }
    }
  }

  // Answer key must reference real options.
  const key = question.answerKey;
  if (key.type === 'single_select') {
    if (!uniqueOptionIds.has(key.optionId)) {
      err('key-missing-option', `Answer key references unknown option "${key.optionId}".`);
    }
  } else if (key.type === 'multi_select') {
    for (const id of key.optionIds) {
      if (!uniqueOptionIds.has(id)) {
        err('key-missing-option', `Answer key references unknown option "${id}".`);
      }
    }
    if (key.optionIds.length === question.options.length) {
      err('key-selects-all', 'A select-all key that includes every option is not a real question.');
    }
  } else if (key.type === 'numeric_entry') {
    for (const accepted of key.accepted) {
      if (accepted.kind === 'range' && accepted.min > accepted.max) {
        err('bad-range', 'Numeric range has min greater than max.');
      }
      if (accepted.kind === 'tolerance' && accepted.tolerance < 0) {
        err('bad-tolerance', 'Numeric tolerance must not be negative.');
      }
    }
  }
  if (key.type !== question.responseType) {
    err('key-type-mismatch', `Answer key type "${key.type}" does not match responseType.`);
  }

  // Distractor reasoning for every wrong choice.
  if (needsOptions) {
    const correct = new Set<string>(
      key.type === 'single_select' ? [key.optionId] : key.type === 'multi_select' ? key.optionIds : [],
    );
    for (const option of question.options) {
      if (correct.has(option.id)) continue;
      const rationale = question.distractorRationale[option.id];
      if (!rationale || rationale.trim().length < 15) {
        (question.state === 'published' ? err : warn)(
          'missing-distractor-rationale',
          `Option ${option.id} has no meaningful distractor explanation.`,
        );
      }
    }
  }

  // Two-part items encode their column on the option id as "<column>-<option>".
  // Option ids may not contain a colon, so the hyphen is the separator, and the
  // answer key stores the WHOLE option id.
  if (question.responseType === 'two_part') {
    const columnOf = (id: string) => (id.includes('-') ? id.slice(0, id.indexOf('-')) : '');
    const columns = new Set(question.options.map((o) => columnOf(o.id)).filter(Boolean));

    if (question.options.some((o) => !o.id.includes('-'))) {
      err(
        'two-part-option-id',
        'Two-part option ids must be "<columnId>-<optionId>", e.g. "loaves-c", so the player can group them.',
      );
    }
    if (columns.size < 2) {
      err('two-part-columns', `A two-part item needs at least two columns; found ${columns.size}.`);
    }
    if (key.type === 'two_part') {
      for (const selection of key.selections) {
        if (!uniqueOptionIds.has(selection.optionId)) {
          err(
            'two-part-key',
            `Answer key references option "${selection.optionId}", which is not one of this item's options. ` +
              'The key must hold the full option id, not the bare suffix.',
          );
        }
        if (columnOf(selection.optionId) !== selection.columnId) {
          err(
            'two-part-key-column',
            `Answer key pairs column "${selection.columnId}" with option "${selection.optionId}", ` +
              'whose id belongs to a different column.',
          );
        }
      }
      if (new Set(key.selections.map((sel) => sel.columnId)).size !== columns.size) {
        err('two-part-key-coverage', 'The answer key must name exactly one option per column.');
      }
    }
  }

  // An explanation that names an option as the answer must name a correct one.
  // Option order can change after an explanation is written, and nothing else
  // ties the letters in prose to the stored order.
  if (needsOptions) {
    const correctIds = new Set<string>(
      key.type === 'single_select' ? [key.optionId] : key.type === 'multi_select' ? key.optionIds : [],
    );
    const correctLabels = new Set(question.options.filter((o) => correctIds.has(o.id)).map((o) => o.label));
    for (const label of answerLettersNamed(question.explanationMd)) {
      if (!correctLabels.has(label)) {
        err(
          'explanation-names-wrong-answer',
          `The explanation presents option ${label} as the answer, but the key is ${[...correctLabels].join(', ')}.`,
        );
      }
    }
  }

  if (question.stimulusRef && context.stimulusIds && !context.stimulusIds.has(question.stimulusRef.id)) {
    err('missing-stimulus', `Stimulus "${question.stimulusRef.id}" does not exist.`);
  }

  // Publication gates.
  if (question.state === 'published') {
    if (!question.review.reviewer) {
      err('unreviewed-publication', 'Published questions need a named reviewer.');
    }
    if (question.review.reviewer && question.review.reviewer === question.review.author) {
      err('self-review', 'The reviewer must not be the author.');
    }
    if (!question.review.reviewedOn) {
      err('missing-review-date', 'Published questions need a review date.');
    }
    const solve = question.review.independentSolve;
    if (!solve) {
      err('missing-independent-solve', 'Published questions need an independent solve record.');
    } else {
      if (!solve.agreesWithKey) {
        err('solve-disagrees', 'The independent solver disagreed with the answer key.');
      }
      if (!solve.uniquenessChecked) {
        err('uniqueness-unchecked', 'Answer uniqueness was not checked.');
      }
    }
    if (question.difficultyBasis === 'empirical') {
      warn(
        'unsupported-calibration',
        'Difficulty is marked empirical. That requires validated response data.',
      );
    }
  }

  if (question.state === 'quarantined' && !question.quarantine) {
    err('missing-quarantine-reason', 'Quarantined questions must record why.');
  }

  if (question.responseType === 'essay' && question.state === 'published') {
    warn('essay-not-auto-scored', 'Essay items are never auto-scored; results must say so.');
  }

  return issues;
}
