import { z } from 'zod';
import type { ExamConfig } from '@/lib/assessment/types';
import { questionSchema, validateQuestion, type Question, type Stimulus } from './question-schema';

/**
 * Drafting new questions with a model, for the review queue.
 *
 * The exam's rules come from its config, never from the model's memory: the
 * option count (`choiceOptions`, plus any `scoring.itemPenaltyOverrides`
 * variant for the domain), the scoring, the calculator policy and the
 * taxonomy. Drafts are written in the bank's own format as `in_review` with
 * `aiAssisted: true` (docs/AUTHORING-BRIEF.md). Nothing here publishes:
 * normalise-option-order.ts, the blind review and apply-review.ts do that.
 *
 * Before a draft is kept, the same model solves it again blind, in a separate
 * request without the key; a disagreement or a second defensible answer
 * discards it. That catches some wrong keys early, but it is a filter, not the
 * independent review the brief requires.
 *
 * The model call itself lives in scripts/draft-questions.ts, so everything
 * here can be tested with a stand-in model.
 */

export const DRAFTABLE_RESPONSE_TYPES = ['single_select', 'numeric_entry'] as const;
export type DraftableResponseType = (typeof DRAFTABLE_RESPONSE_TYPES)[number];
export type DraftDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';

/** Most a single model request is asked for; larger counts are split. */
export const MAX_ITEMS_PER_REQUEST = 5;

export class DraftingError extends Error {}

export interface DraftRequest {
  examKey: string;
  domainSlug: string;
  /** One skill of the domain, or every skill in it when unset. */
  skillSlug?: string;
  responseType: DraftableResponseType;
  /** Single-select only: one of the counts the config allows. Defaults to the exam's count. */
  optionCount?: number;
  difficulty: DraftDifficulty;
  count: number;
  /** An existing passage, chart or table the items are written on. */
  stimulus?: Stimulus;
}

export interface DraftingRules {
  examKey: string;
  examName: string;
  publisher: string;
  summary: string;
  section: { key: string; name: string; calculator: string; calculatorNote: string; notes: string[] };
  domain: { slug: string; name: string; description: string };
  skills: Array<{ slug: string; name: string; description: string }>;
  responseType: DraftableResponseType;
  /** Options per item, null for numeric entry. */
  optionCount: number | null;
  optionCountSource: string;
  scoring: { correct: number; incorrect: number; omitted: number };
  unverified: string[];
}

/** Option counts a single-select item in this domain may have, per the config. */
export function allowedOptionCounts(config: ExamConfig, domainSlug: string): number[] {
  if (!config.choiceOptions) return [];
  const variants = (config.scoring.itemPenaltyOverrides ?? [])
    .filter((override) => override.domains.includes(domainSlug))
    .map((override) => override.optionCount);
  return [...new Set([config.choiceOptions.count, ...variants])];
}

/** The penalty for a wrong answer on an item of this domain with this many options. */
export function penaltyFor(config: ExamConfig, domainSlug: string, optionCount: number | null): number {
  const override = (config.scoring.itemPenaltyOverrides ?? []).find(
    (o) => o.domains.includes(domainSlug) && o.optionCount === optionCount,
  );
  return override ? override.pointsIncorrect : config.scoring.pointsIncorrect;
}

/** Everything the model is told about the exam, read from its config. Throws DraftingError on a bad request. */
export function draftingRules(config: ExamConfig, request: DraftRequest): DraftingRules {
  const domain = config.domains.find((d) => d.slug === request.domainSlug);
  if (!domain) {
    throw new DraftingError(
      `${config.examKey} has no domain "${request.domainSlug}". Domains: ${config.domains.map((d) => d.slug).join(', ')}.`,
    );
  }
  const section = config.sections.find((s) => s.key === domain.sectionKey);
  if (!section) throw new DraftingError(`Domain ${domain.slug} points at a missing section "${domain.sectionKey}".`);
  if (!section.responseTypes.includes(request.responseType)) {
    throw new DraftingError(
      `${section.name} does not use ${request.responseType}; it uses ${section.responseTypes.join(', ')}.`,
    );
  }
  const skills = request.skillSlug ? domain.skills.filter((s) => s.slug === request.skillSlug) : domain.skills;
  if (skills.length === 0) {
    throw new DraftingError(
      `${domain.slug} has no skill "${request.skillSlug}". Skills: ${domain.skills.map((s) => s.slug).join(', ')}.`,
    );
  }

  let optionCount: number | null = null;
  let optionCountSource = 'Numeric entry: the candidate types the answer, so there are no options.';
  if (request.responseType === 'single_select') {
    if (!config.choiceOptions) {
      throw new DraftingError(`${config.examKey} sets no choiceOptions in its config, so the option count is unknown.`);
    }
    const allowed = allowedOptionCounts(config, domain.slug);
    optionCount = request.optionCount ?? config.choiceOptions.count;
    if (!allowed.includes(optionCount)) {
      throw new DraftingError(`${domain.name} items have ${allowed.join(' or ')} options in this exam's config, not ${optionCount}.`);
    }
    optionCountSource =
      optionCount === config.choiceOptions.count
        ? `${config.choiceOptions.basis === 'published' ? 'Published by the test maker' : 'Our editorial choice'}: ${config.choiceOptions.note}`
        : `A published variant for ${domain.name}, scored differently (scoring.itemPenaltyOverrides).`;
  }
  if (request.count < 1 || request.count > 10) throw new DraftingError('Draft between 1 and 10 questions at a time.');

  return {
    examKey: config.examKey,
    examName: config.name,
    publisher: config.publisher,
    summary: config.summary,
    section: {
      key: section.key,
      name: section.name,
      calculator: section.calculator,
      calculatorNote: section.calculatorNote,
      notes: section.notes,
    },
    domain: { slug: domain.slug, name: domain.name, description: domain.description },
    skills: skills.map((s) => ({ slug: s.slug, name: s.name, description: s.description })),
    responseType: request.responseType,
    optionCount,
    optionCountSource,
    scoring: {
      correct: config.scoring.pointsCorrect,
      incorrect: penaltyFor(config, domain.slug, optionCount),
      omitted: config.scoring.pointsOmitted,
    },
    unverified: config.unverified,
  };
}

// ---------------------------------------------------------------------------
// What the model returns
// ---------------------------------------------------------------------------

const draftCommon = {
  topicSlug: z.string().describe('2 to 5 lowercase words joined by hyphens naming what the item tests, e.g. "circle-chord-length".'),
  skillSlug: z.string().describe('One of the skill slugs listed in the request.'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  stemMd: z.string().describe('The question in Markdown, maths in $...$, without the answer choices.'),
  explanationMd: z.string().describe('Teaches the method: what to notice first, the working, and the check that settles it. Never names option letters.'),
  estimatedSeconds: z.number().int().describe('Honest working time for a prepared candidate.'),
  accessibilityText: z.string().nullable().describe('How a screen reader should read the notation or any figure; null when the stem reads aloud as written.'),
};

export const choiceDraftSchema = z.object({
  items: z.array(
    z.object({
      ...draftCommon,
      options: z
        .array(
          z.object({
            textMd: z.string(),
            mistake: z.string().describe('Empty for the correct option. Otherwise the specific misreading or slip that produces this choice.'),
          }),
        )
        .describe('The answer choices in any order; their order is shuffled before review.'),
      correctOption: z.number().int().describe('1-based position of the correct option in `options`.'),
    }),
  ),
});

export const numericDraftSchema = z.object({
  items: z.array(
    z.object({
      ...draftCommon,
      answer: z.object({
        value: z.number(),
        tolerance: z.number().describe('0 for an exact answer.'),
        acceptedStrings: z.array(z.string()).describe('Other written forms to accept, e.g. "3/4"; may be empty.'),
      }),
    }),
  ),
});

export const solveSchema = z.object({
  solutions: z.array(
    z.object({
      item: z.number().int().describe('The item number as given.'),
      answer: z.string().describe('The option letter you choose, or the number you would enter.'),
      secondDefensibleAnswer: z.boolean().describe('True if a strong candidate could also defend another answer.'),
      working: z.string(),
    }),
  ),
});

export type ChoiceDraft = z.infer<typeof choiceDraftSchema>['items'][number];
export type NumericDraft = z.infer<typeof numericDraftSchema>['items'][number];
export type RawDraft = ChoiceDraft | NumericDraft;
export type Solution = z.infer<typeof solveSchema>['solutions'][number];

export interface Prompt {
  system: string;
  user: string;
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

const DRAFT_SYSTEM = `You write original practice questions for an independent admissions-test preparation site. Every question is checked by a second solver before anyone sees it, and a question with a wrong key or two defensible answers is thrown away, so correctness matters more than volume.

Rules that are never relaxed:
- Original work only. Do not reproduce, paraphrase or lightly reskin a published item from any test maker. Invent the situation, the numbers and the wording.
- Exactly one defensible answer. Before you settle on an item, argue for each wrong choice; if you can make a case for a second one, change the choices rather than the argument. Give every variable its domain (integer or real, non-zero, and so on) so the question cannot be read two ways.
- Every wrong choice comes from a specific, realistic mistake (a dropped sign, a forgotten root, an inverted ratio, a misread condition), and you say which. No filler choices, and no choice that is obviously absurd.
- Never refer to options by letter or position in the explanation or anywhere else. Write "the choice that keeps both roots", not "(C)". Choices are shuffled before review.
- The explanation teaches the method: what a candidate should notice first, the working, and the check that settles the answer. Say how to save time where that is honest.
- Follow the exam's rules exactly as the request states them: number of options, response type, scoring, calculator policy. They come from the exam's verified configuration and override anything you remember about the exam.
- Difficulty is your editorial judgement for a prepared candidate of this exam. Spread a set across levels when asked for a mix.
- Write in English. Markdown, with maths in $...$.`;

const SOLVE_SYSTEM = `You are solving practice questions for an admissions test as a careful, strong candidate would, to check them before publication. Work each one fully. Give the single answer you would mark, and say whether a strong candidate could also defend another answer. Be strict: an item with two defensible answers, or none, must be flagged.`;

function list(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

/** A passage, chart or table as text: its title, body and any data rows. */
function stimulusText(stimulus: Stimulus): string {
  const table = stimulus.data
    ? `\n\n${stimulus.data.columns.map((c) => c.label).join(' | ')}\n${stimulus.data.rows
        .map((row) => stimulus.data!.columns.map((c) => String(row[c.key] ?? '')).join(' | '))
        .join('\n')}`
    : '';
  return `${stimulus.title ? `"${stimulus.title}"\n\n` : ''}${stimulus.bodyMd ?? ''}${table}`;
}

/** The request for a batch of drafts. */
export function buildDraftPrompt(
  rules: DraftingRules,
  request: Pick<DraftRequest, 'difficulty' | 'stimulus'>,
  count: number,
  context: { examples: Question[]; existingStems: string[] },
): Prompt {
  const scoring = `+${rules.scoring.correct} for a correct answer, ${rules.scoring.omitted} for a blank, ${rules.scoring.incorrect} for a wrong answer`;
  const format =
    rules.responseType === 'single_select'
      ? `Single answer, exactly ${rules.optionCount} options. ${rules.optionCountSource}`
      : `Numeric entry: the candidate types a number, so give the exact value and any other written forms to accept.`;
  const examples = context.examples
    .map((q, i) => {
      const options = q.options.map((o) => `   ${o.label}. ${o.textMd}`).join('\n');
      return `Example ${i + 1} (${q.difficulty}):\n${q.stemMd}${options ? `\n${options}` : ''}\nExplanation: ${q.explanationMd}`;
    })
    .join('\n\n');
  const difficulty =
    request.difficulty === 'mixed' ? 'a spread of easy, medium and hard' : `${request.difficulty} difficulty`;

  const user = `Exam: ${rules.examName} (${rules.publisher})
${rules.summary}

Section: ${rules.section.name}
Calculator: ${rules.section.calculator}${rules.section.calculatorNote ? ` (${rules.section.calculatorNote})` : ''}${
    rules.section.notes.length ? `\nSection notes:\n${list(rules.section.notes)}` : ''
  }

Domain: ${rules.domain.name}
${rules.domain.description}

Skills (tag each item with exactly one of these slugs):
${list(rules.skills.map((s) => `${s.slug}: ${s.name}${s.description ? ` — ${s.description}` : ''}`))}

Format: ${format}
Scoring on the real exam: ${scoring}.${
    rules.unverified.length ? `\nRules of this exam we could not verify (do not rely on them):\n${list(rules.unverified)}` : ''
  }${
    request.stimulus
      ? `\n\nWrite every item on this ${request.stimulus.kind}. Do not repeat it in the stem; candidates see it beside the question.\n\n${stimulusText(request.stimulus)}`
      : ''
  }

${examples ? `Published items from this domain, for the house style only. Do not copy their situations or numbers.\n\n${examples}\n\n` : ''}${
    context.existingStems.length
      ? `Items that already exist in this domain; write something different from each:\n${list(context.existingStems)}\n\n`
      : ''
  }Write ${count} new question${count === 1 ? '' : 's'} at ${difficulty}, covering different skills where more than one is listed.`;

  return { system: DRAFT_SYSTEM, user };
}

/** The request for the blind solve: the items as a candidate sees them, without keys or explanations. */
export function buildSolvePrompt(rules: DraftingRules, questions: Question[], stimulus?: Stimulus): Prompt {
  const items = questions
    .map((q, i) => {
      const options = q.options.map((o) => `   ${o.label}. ${o.textMd}`).join('\n');
      const how = q.responseType === 'numeric_entry' ? '(Type a number.)' : '(Choose one letter.)';
      return `Item ${i + 1} ${how}\n${q.stemMd}${options ? `\n${options}` : ''}`;
    })
    .join('\n\n');
  const material = stimulus ? `\n\nEvery item is about this ${stimulus.kind}:\n\n${stimulusText(stimulus)}` : '';
  const user = `Exam: ${rules.examName}, ${rules.section.name}. Calculator: ${rules.section.calculator}.${material}\n\n${items}`;
  return { system: SOLVE_SYSTEM, user };
}

// ---------------------------------------------------------------------------
// Turning a draft into a bank question, and checking it
// ---------------------------------------------------------------------------

const LETTERS = 'abcdefghij';

/** The next free number for an exam's ids: one past the highest trailing number in use. */
export function nextQuestionNumber(ids: Iterable<string>): number {
  let highest = 0;
  for (const id of ids) {
    const match = /-(\d+)$/.exec(id);
    if (match) highest = Math.max(highest, Number(match[1]));
  }
  return highest + 1;
}

export function slugify(text: string, fallback: string): string {
  const words = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5);
  return words.length ? words.join('-') : fallback;
}

/** A bank question from one draft, in the shape of content/questions/<exam>/<id>.json. */
export function assembleQuestion(
  draft: RawDraft,
  context: { rules: DraftingRules; id: string; model: string; today: string; stimulus?: Stimulus },
): Question {
  const { rules } = context;
  let options: Question['options'] = [];
  let answerKey: Question['answerKey'];
  let distractorRationale: Record<string, string> = {};

  if ('options' in draft) {
    options = draft.options.map((option, index) => ({
      id: LETTERS[index] ?? `o${index + 1}`,
      label: (LETTERS[index] ?? `o${index + 1}`).toUpperCase(),
      textMd: option.textMd.trim(),
    }));
    const correct = options[draft.correctOption - 1];
    answerKey = { type: 'single_select', optionId: correct?.id ?? '' };
    distractorRationale = Object.fromEntries(
      draft.options.flatMap((option, index) => (index === draft.correctOption - 1 ? [] : [[options[index].id, option.mistake.trim()]])),
    );
  } else {
    answerKey = {
      type: 'numeric_entry',
      accepted: [
        draft.answer.tolerance > 0
          ? { kind: 'tolerance', value: draft.answer.value, tolerance: draft.answer.tolerance }
          : { kind: 'exact', value: draft.answer.value },
      ],
      acceptedStrings: draft.answer.acceptedStrings.map((s) => s.trim()).filter(Boolean),
    };
  }

  return {
    id: context.id,
    version: 1,
    examKey: rules.examKey,
    sectionKey: rules.section.key,
    domainSlug: rules.domain.slug,
    skillSlug: draft.skillSlug,
    subskillSlug: null,
    responseType: rules.responseType,
    difficulty: draft.difficulty,
    difficultyBasis: 'editorial',
    stemMd: draft.stemMd.trim(),
    instructionsMd: null,
    options,
    answerKey,
    explanationMd: draft.explanationMd.trim(),
    distractorRationale,
    estimatedSeconds: draft.estimatedSeconds,
    stimulusRef: context.stimulus ? { id: context.stimulus.id, version: context.stimulus.version } : null,
    accessibilityText: draft.accessibilityText?.trim() || null,
    provenance: {
      origin: 'original',
      authoredBy: `draft-questions (${context.model})`,
      aiAssisted: true,
      notes: `Drafted ${context.today} by scripts/draft-questions.ts. Not yet blind-reviewed.`,
    },
    rightsStatus: 'original-owned',
    review: { author: 'draft-questions', reviewer: null, reviewedOn: null, independentSolve: null, notes: '' },
    state: 'in_review',
    quarantine: null,
    tags: ['ai-draft'],
    translations: {},
  };
}

// Words every question uses, which say nothing about what it asks.
const STOPWORDS = new Set(
  'a an and are as at be by can do does for from has have how if in is it its of on or that the then this to was what when which who why will with value following true statement number'.split(' '),
);

/** A stem's content words, maths tokens such as 3x or 7 included. */
function words(text: string): Set<string> {
  return new Set(text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter((w) => w && !STOPWORDS.has(w)));
}

/** Share of content words two stems have in common (Jaccard), 0 to 1; 0 when either is too short to judge. */
export function stemSimilarity(a: string, b: string): number {
  const x = words(a);
  const y = words(b);
  if (Math.min(x.size, y.size) < 5) return 0;
  let shared = 0;
  for (const w of x) if (y.has(w)) shared += 1;
  return shared / (x.size + y.size - shared);
}

export const NEAR_DUPLICATE = 0.6;

/** Stem overlap, numbers masked, at which two items are the same template with new numbers. */
export const TEMPLATE_VARIANT = 0.85;
/**
 * Below this many distinct words a stem is a question type ("What number
 * comes next in the sequence?"), not a template, and masking its numbers
 * would make unrelated items look alike.
 */
const MIN_TEMPLATE_WORDS = 12;

function maskNumbers(text: string): string {
  return text.replace(/\d+(?:[.,]\d+)?/g, ' num ');
}

/** Stem similarity with every number masked, or 0 when either stem is too short to identify a template. */
export function templateSimilarity(a: string, b: string): number {
  const x = maskNumbers(a);
  const y = maskNumbers(b);
  const length = (text: string) => new Set(text.toLowerCase().replace(/[^a-z]+/g, ' ').split(' ').filter((w) => w.length > 2)).size;
  if (Math.min(length(x), length(y)) < MIN_TEMPLATE_WORDS) return 0;
  return stemSimilarity(x, y);
}

/**
 * Whether two items are variants of one question: most of the same words, or
 * the same template with different numbers. Items on different stimuli are
 * never variants of each other: there the passage carries the content, and a
 * shared stock question ("Which choice best states the main idea?") is not.
 */
export function areVariants(
  a: { stemMd: string; stimulusId: string | null },
  b: { stemMd: string; stimulusId: string | null },
  thresholds: { nearDuplicate: number; templateVariant: number } = { nearDuplicate: NEAR_DUPLICATE, templateVariant: TEMPLATE_VARIANT },
): boolean {
  if (a.stimulusId !== b.stimulusId) return false;
  return stemSimilarity(a.stemMd, b.stemMd) >= thresholds.nearDuplicate || templateSimilarity(a.stemMd, b.stemMd) >= thresholds.templateVariant;
}

/** Reasons a draft cannot go to review; empty when it can. */
export function checkDraft(question: Question, rules: DraftingRules, bank: Question[], stimulusIds: Set<string>): string[] {
  const reasons: string[] = [];
  const parsed = questionSchema.safeParse(question);
  if (!parsed.success) {
    reasons.push(...parsed.error.issues.map((issue) => `schema: ${issue.path.join('.')}: ${issue.message}`));
    return reasons;
  }
  for (const issue of validateQuestion(parsed.data, { stimulusIds })) {
    // The brief treats letters in prose as a defect, not a style note.
    if (issue.level === 'error' || issue.code === 'stale-option-letter' || issue.code === 'explanation-cites-letters') {
      reasons.push(`${issue.code}: ${issue.message}`);
    }
  }
  if (!rules.skills.some((s) => s.slug === question.skillSlug)) {
    reasons.push(`skill "${question.skillSlug}" is not one of ${rules.skills.map((s) => s.slug).join(', ')}`);
  }
  if (rules.optionCount !== null) {
    if (question.options.length !== rules.optionCount) {
      reasons.push(`has ${question.options.length} options; the config says ${rules.optionCount}`);
    }
    const keyed = question.answerKey.type === 'single_select' ? question.answerKey.optionId : null;
    if (!question.options.some((o) => o.id === keyed)) {
      reasons.push('the correct option number points at no option');
    }
    for (const option of question.options) {
      if (option.id === keyed) continue;
      if ((question.distractorRationale[option.id] ?? '').length < 15) {
        reasons.push(`no real reason given for the wrong choice "${option.textMd}"`);
      }
    }
    const texts = question.options.map((o) => o.textMd.replace(/\s+/g, ' ').trim().toLowerCase());
    if (new Set(texts).size !== texts.length) reasons.push('two options read the same');
  }
  if (question.estimatedSeconds < 10) reasons.push(`estimatedSeconds ${question.estimatedSeconds} is not an honest working time`);
  for (const other of bank) {
    if (other.examKey !== question.examKey || other.id === question.id) continue;
    const similarity = stemSimilarity(question.stemMd, other.stemMd);
    if (similarity >= NEAR_DUPLICATE) {
      reasons.push(`near-duplicate of ${other.id} (${Math.round(similarity * 100)}% of words shared)`);
      break;
    }
    // The same template with new numbers adds nothing a set can measure
    // twice, and would inflate coverage (src/lib/content/coverage.ts).
    const sameStimulus = (question.stimulusRef?.id ?? null) === (other.stimulusRef?.id ?? null);
    const template = sameStimulus ? templateSimilarity(question.stemMd, other.stemMd) : 0;
    if (template >= TEMPLATE_VARIANT) {
      reasons.push(`the same template as ${other.id} with different numbers (${Math.round(template * 100)}% of words shared, numbers aside)`);
      break;
    }
  }
  return reasons;
}

/** Whether the blind solve reached the key, and why not when it did not. */
export function compareSolution(question: Question, solution: Solution | undefined): string | null {
  if (!solution) return 'the blind solve returned no answer for it';
  if (solution.secondDefensibleAnswer) return `the blind solve found a second defensible answer: ${solution.working.slice(0, 200)}`;
  const key = question.answerKey;
  if (key.type === 'single_select') {
    const keyed = question.options.find((o) => o.id === key.optionId)?.label;
    const chosen = solution.answer.trim().replace(/[^A-Za-z]/g, '').toUpperCase();
    return chosen === keyed ? null : `the blind solve chose ${chosen || '(nothing)'}, the key says ${keyed}`;
  }
  if (key.type === 'numeric_entry') {
    const typed = solution.answer.trim();
    const value = Number(typed.replace(',', '.'));
    const ok =
      key.acceptedStrings.includes(typed) ||
      key.accepted.some((a) =>
        a.kind === 'exact' ? value === a.value : a.kind === 'tolerance' ? Math.abs(value - a.value) <= a.tolerance : value >= a.min && value <= a.max,
      );
    return ok ? null : `the blind solve entered ${typed}, the key accepts ${JSON.stringify(key.accepted)}`;
  }
  return `cannot compare a ${key.type} answer`;
}

// ---------------------------------------------------------------------------
// The whole run
// ---------------------------------------------------------------------------

export interface DraftModel {
  /** The model's id, recorded in provenance. */
  readonly name: string;
  draft(prompt: Prompt, responseType: DraftableResponseType): Promise<RawDraft[]>;
  solve(prompt: Prompt): Promise<Solution[]>;
}

export interface DraftOutcome {
  accepted: Question[];
  rejected: Array<{ id: string; stem: string; reasons: string[] }>;
}

/** Published items of this domain and response type to show as house style, easiest first. */
export function styleExamples(bank: Question[], rules: DraftingRules, stimulus: Stimulus | undefined, limit = 2): Question[] {
  const order = { easy: 0, medium: 1, hard: 2 };
  const candidates = bank
    .filter(
      (q) =>
        q.state === 'published' &&
        q.examKey === rules.examKey &&
        q.domainSlug === rules.domain.slug &&
        q.responseType === rules.responseType &&
        (rules.optionCount === null || q.options.length === rules.optionCount) &&
        (stimulus ? true : q.stimulusRef === null),
    )
    .sort((a, b) => order[a.difficulty] - order[b.difficulty] || a.id.localeCompare(b.id));
  // Items of the requested skills first, the rest of the domain only when there are none.
  const sameSkill = candidates.filter((q) => rules.skills.some((s) => s.slug === q.skillSlug));
  const pool = sameSkill.length > 0 ? sameSkill : candidates;
  if (pool.length <= limit) return pool;
  // One from each end, so the model sees the range rather than two of a kind.
  return [pool[0], pool[pool.length - 1]].slice(0, limit);
}

/** What the draft prompt shows from the bank: style examples, and the stems a new item must differ from. */
export function draftContext(bank: Question[], rules: DraftingRules, stimulus: Stimulus | undefined) {
  return {
    examples: styleExamples(bank, rules, stimulus),
    existingStems: bank
      .filter((q) => q.examKey === rules.examKey && q.domainSlug === rules.domain.slug)
      .map((q) => q.stemMd.replace(/\s+/g, ' ').slice(0, 140))
      .slice(0, 80),
  };
}

export async function draftQuestions(
  config: ExamConfig,
  request: DraftRequest,
  deps: { model: DraftModel; bank: Question[]; stimulusIds: Set<string>; today: string; precheck: boolean },
): Promise<DraftOutcome> {
  const rules = draftingRules(config, request);
  const { examples, existingStems } = draftContext(deps.bank, rules, request.stimulus);

  let next = nextQuestionNumber(deps.bank.filter((q) => q.examKey === rules.examKey).map((q) => q.id));
  const outcome: DraftOutcome = { accepted: [], rejected: [] };
  const seen = [...deps.bank];

  for (let remaining = request.count; remaining > 0; remaining -= MAX_ITEMS_PER_REQUEST) {
    const batchSize = Math.min(MAX_ITEMS_PER_REQUEST, remaining);
    const drafts = await deps.model.draft(buildDraftPrompt(rules, request, batchSize, { examples, existingStems }), rules.responseType);

    const candidates: Question[] = [];
    for (const draft of drafts.slice(0, batchSize)) {
      const id = `${rules.examKey}-${slugify(draft.topicSlug, 'draft')}-${next++}`;
      const question = assembleQuestion(draft, { rules, id, model: deps.model.name, today: deps.today, stimulus: request.stimulus });
      // Against the bank, earlier batches and this batch's own drafts so far.
      const reasons = checkDraft(question, rules, [...seen, ...candidates], deps.stimulusIds);
      if (reasons.length > 0) outcome.rejected.push({ id, stem: question.stemMd, reasons });
      else candidates.push(question);
    }

    let solutions: Solution[] = [];
    if (deps.precheck && candidates.length > 0) {
      solutions = await deps.model.solve(buildSolvePrompt(rules, candidates, request.stimulus));
    }
    candidates.forEach((question, index) => {
      const mismatch = deps.precheck ? compareSolution(question, solutions.find((s) => s.item === index + 1)) : null;
      if (mismatch) outcome.rejected.push({ id: question.id, stem: question.stemMd, reasons: [mismatch] });
      else {
        outcome.accepted.push(question);
        seen.push(question);
      }
    });
  }
  return outcome;
}
