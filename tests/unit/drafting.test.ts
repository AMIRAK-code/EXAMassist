import { describe, expect, it } from 'vitest';
import {
  DraftingError,
  allowedOptionCounts,
  assembleQuestion,
  buildDraftPrompt,
  buildSolvePrompt,
  checkDraft,
  compareSolution,
  draftQuestions,
  draftingRules,
  nextQuestionNumber,
  type ChoiceDraft,
  type DraftModel,
  type DraftRequest,
  type NumericDraft,
  type Prompt,
  type Solution,
} from '@/lib/content/drafting';
import { loadContent } from '@/lib/content/loader';
import { questionSchema, type Question } from '@/lib/content/question-schema';
import { DRAFT_EXAM_CONFIGS, EXAM_CONFIGS, requireExamConfig } from '@/lib/exams/registry';

/**
 * The question drafting tool: the exam's rules come from its config, drafts
 * land in the bank's format as in_review, and anything malformed, duplicated
 * or contradicted by the blind solve is discarded before it is written.
 */

const tolcI = requireExamConfig('tolc-i');
const bocconi = requireExamConfig('bocconi-undergraduate');
const request = (overrides: Partial<DraftRequest> = {}): DraftRequest => ({
  examKey: 'tolc-i',
  domainSlug: 'tolci-mathematics',
  responseType: 'single_select',
  difficulty: 'mixed',
  count: 2,
  ...overrides,
});

const goodDraft = (overrides: Partial<ChoiceDraft> = {}): ChoiceDraft => ({
  topicSlug: 'Exponential equation with base two',
  skillSlug: 'tolci-math-analytic-functions',
  difficulty: 'easy',
  stemMd: 'For which real number $x$ does $2^{x+1} = 16$ hold?',
  options: [
    { textMd: '$3$', mistake: '' },
    { textMd: '$4$', mistake: 'Reads $16 = 2^4$ and forgets the $+1$ in the exponent.' },
    { textMd: '$7$', mistake: 'Subtracts one from the right-hand side, $16 - 1 = 15$, then rounds to a power of two.' },
    { textMd: '$8$', mistake: 'Halves $16$ instead of comparing exponents, so takes $x + 1 = 8$ as $x = 8$.' },
    { textMd: '$15$', mistake: 'Treats $2^{x+1}$ as $2x + 1$ and solves $x + 1 = 16$.' },
  ],
  correctOption: 1,
  explanationMd:
    'Write both sides as powers of two first. $16 = 2^4$, so $2^{x+1} = 2^4$ and the exponents must match: $x + 1 = 4$, so $x = 3$. Check: $2^{3+1} = 16$.',
  estimatedSeconds: 45,
  accessibilityText: null,
  ...overrides,
});

const bank = loadContent().questions.map((entry) => entry.question);

describe('the rules come from the exam config', () => {
  it('gives every exam an option count, saying whether it is published or our choice', () => {
    for (const config of [...EXAM_CONFIGS, ...DRAFT_EXAM_CONFIGS]) {
      expect(config.choiceOptions, config.examKey).toBeDefined();
      expect(config.choiceOptions!.note, config.examKey).not.toBe('');
    }
    expect(bocconi.choiceOptions!.basis).toBe('editorial');
    expect(tolcI.choiceOptions!.basis).toBe('published');
  });

  it('reads TOLC-I as five options at +1 / 0 / -0.25', () => {
    const rules = draftingRules(tolcI, request());
    expect(rules.optionCount).toBe(5);
    expect(rules.scoring).toEqual({ correct: 1, omitted: 0, incorrect: -0.25 });
    expect(rules.section.key).toBe('mathematics');
  });

  it('reads the Enhanced ACT as four options with no penalty', () => {
    const rules = draftingRules(requireExamConfig('enhanced-act'), request({ examKey: 'enhanced-act', domainSlug: 'act-math-algebra' }));
    expect(rules.optionCount).toBe(4);
    expect(rules.scoring.incorrect).toBe(0);
  });

  it('allows Bocconi three-option critical thinking only where the config publishes it, at -0.33', () => {
    expect(allowedOptionCounts(bocconi, 'bocconi-ug-critical-thinking').sort()).toEqual([3, 4]);
    expect(allowedOptionCounts(bocconi, 'bocconi-ug-mathematics')).toEqual([4]);
    const base = { examKey: 'bocconi-undergraduate', domainSlug: 'bocconi-ug-critical-thinking' };
    expect(draftingRules(bocconi, request(base)).scoring.incorrect).toBe(-0.2);
    expect(draftingRules(bocconi, request({ ...base, optionCount: 3 })).scoring.incorrect).toBe(-0.33);
    expect(() => draftingRules(bocconi, request({ examKey: 'bocconi-undergraduate', domainSlug: 'bocconi-ug-mathematics', optionCount: 3 }))).toThrow(
      DraftingError,
    );
  });

  it('refuses formats, domains and skills the config does not have', () => {
    expect(() => draftingRules(tolcI, request({ responseType: 'numeric_entry' }))).toThrow(/does not use numeric_entry/);
    expect(() => draftingRules(tolcI, request({ domainSlug: 'nope' }))).toThrow(/no domain/);
    expect(() => draftingRules(tolcI, request({ skillSlug: 'nope' }))).toThrow(/no skill/);
    expect(() => draftingRules(tolcI, request({ count: 11 }))).toThrow(/between 1 and 10/);
  });

  it('puts the configured rules into the request the model gets', () => {
    const rules = draftingRules(tolcI, request());
    const prompt = buildDraftPrompt(rules, request(), 2, { examples: [], existingStems: ['An existing stem'] });
    expect(prompt.user).toContain('exactly 5 options');
    expect(prompt.user).toContain('-0.25 for a wrong answer');
    expect(prompt.user).toContain('tolci-math-analytic-functions');
    expect(prompt.user).toContain('An existing stem');
    expect(prompt.system).toContain('Never refer to options by letter');
  });
});

describe('a draft becomes a bank question for review', () => {
  const rules = draftingRules(tolcI, request());
  const assemble = (draft: ChoiceDraft) =>
    assembleQuestion(draft, { rules, id: 'tolc-i-exponential-equation-9001', model: 'claude-opus-5-5', today: '2026-10-27' });

  it('in the bank schema, in_review, marked as AI-assisted and not reviewed', () => {
    const question = assemble(goodDraft());
    expect(questionSchema.safeParse(question).success).toBe(true);
    expect(question.state).toBe('in_review');
    expect(question.provenance.aiAssisted).toBe(true);
    expect(question.review.independentSolve).toBeNull();
    expect(question.options.map((o) => o.label)).toEqual(['A', 'B', 'C', 'D', 'E']);
    expect(question.answerKey).toEqual({ type: 'single_select', optionId: 'a' });
    expect(Object.keys(question.distractorRationale).sort()).toEqual(['b', 'c', 'd', 'e']);
    expect(checkDraft(question, rules, bank, new Set())).toEqual([]);
  });

  it('is discarded with the wrong number of options', () => {
    const draft = goodDraft();
    const reasons = checkDraft(assemble({ ...draft, options: draft.options.slice(0, 4) }), rules, bank, new Set());
    expect(reasons.join(' ')).toContain('has 4 options; the config says 5');
  });

  it('is discarded when the explanation names an option letter', () => {
    const reasons = checkDraft(assemble(goodDraft({ explanationMd: `${goodDraft().explanationMd} So the answer is (A).` })), rules, bank, new Set());
    expect(reasons.some((r) => r.startsWith('explanation-cites-letters') || r.startsWith('stale-option-letter'))).toBe(true);
  });

  it('is discarded when a wrong choice has no real reason, or the skill is not the domain’s', () => {
    const draft = goodDraft();
    const vague = assemble({ ...draft, options: draft.options.map((o, i) => (i === 2 ? { ...o, mistake: 'Wrong.' } : o)) });
    expect(checkDraft(vague, rules, bank, new Set()).join(' ')).toContain('no real reason');
    expect(checkDraft(assemble(goodDraft({ skillSlug: 'tolci-logic-deduction' })), rules, bank, new Set()).join(' ')).toContain('is not one of');
  });

  it('is discarded when it repeats an item already in the bank', () => {
    const existing = bank.find((q) => q.id === 'tolc-i-ag-circle-chord-on-y-axis-124')!;
    const reasons = checkDraft(assemble(goodDraft({ stemMd: existing.stemMd })), rules, bank, new Set());
    expect(reasons.join(' ')).toContain('near-duplicate of tolc-i-ag-circle-chord-on-y-axis-124');
  });

  it('takes the next free number for the exam', () => {
    expect(nextQuestionNumber(['tolc-i-a-12', 'tolc-i-b-124', 'tolc-i-c'])).toBe(125);
  });

  it('carries a numeric answer, with a tolerance only when one is given', () => {
    const sat = requireExamConfig('digital-sat');
    const satRules = draftingRules(sat, request({ examKey: 'digital-sat', domainSlug: 'algebra', responseType: 'numeric_entry' }));
    const draft: NumericDraft = {
      topicSlug: 'linear-equation-intercept',
      skillSlug: sat.domains.find((d) => d.slug === 'algebra')!.skills[0].slug,
      difficulty: 'medium',
      stemMd: 'If $3x - 7 = 2x + 5$, what is the value of $x$?',
      answer: { value: 12, tolerance: 0, acceptedStrings: [] },
      explanationMd: 'Collect the $x$ terms on one side: subtracting $2x$ from both sides gives $x - 7 = 5$, so $x = 12$. Check: $3(12) - 7 = 29 = 2(12) + 5$.',
      estimatedSeconds: 40,
      accessibilityText: null,
    };
    const question = assembleQuestion(draft, { rules: satRules, id: 'digital-sat-linear-9001', model: 'm', today: '2026-10-27' });
    expect(question.options).toEqual([]);
    expect(question.answerKey).toEqual({ type: 'numeric_entry', accepted: [{ kind: 'exact', value: 12 }], acceptedStrings: [] });
    expect(checkDraft(question, satRules, bank, new Set())).toEqual([]);
  });
});

describe('the blind solve', () => {
  const rules = draftingRules(tolcI, request());
  const question = assembleQuestion(goodDraft(), { rules, id: 'tolc-i-x-9001', model: 'm', today: '2026-10-27' });
  const solution = (answer: string, secondDefensibleAnswer = false): Solution => ({ item: 1, answer, secondDefensibleAnswer, working: 'w' });

  it('sees the item as a candidate does: no key, no explanation', () => {
    const prompt = buildSolvePrompt(rules, [question]);
    expect(prompt.user).toContain(question.stemMd);
    expect(prompt.user).not.toContain('Write both sides');
    expect(prompt.user).not.toContain('forgets the $+1$');
  });

  it('keeps an item only when it reaches the key and finds no second answer', () => {
    expect(compareSolution(question, solution('A'))).toBeNull();
    expect(compareSolution(question, solution(' (a) '))).toBeNull();
    expect(compareSolution(question, solution('B'))).toContain('chose B, the key says A');
    expect(compareSolution(question, solution('A', true))).toContain('second defensible answer');
    expect(compareSolution(question, undefined)).toContain('no answer');
  });
});

describe('a whole run', () => {
  /** A stand-in for Claude: returns the drafts it is given and solves every item as `answers` says. */
  function fakeModel(drafts: ChoiceDraft[], answers: string[]): DraftModel & { prompts: Prompt[] } {
    const prompts: Prompt[] = [];
    return {
      name: 'fake-model',
      prompts,
      async draft(prompt) {
        prompts.push(prompt);
        return drafts;
      },
      async solve(prompt) {
        prompts.push(prompt);
        return answers.map((answer, i) => ({ item: i + 1, answer, secondDefensibleAnswer: false, working: 'w' }));
      },
    };
  }

  it('keeps the drafts the blind solve confirms and discards the rest, with reasons', async () => {
    const wrongKey = goodDraft({
      topicSlug: 'logarithm-of-a-product',
      stemMd: 'What is $\\log_{10} 20 + \\log_{10} 5$?',
      // A draft that is consistent with itself but wrong: it keys 1 and explains 2 away.
      options: [
        { textMd: '$1$', mistake: '' },
        { textMd: '$2$', mistake: 'Multiplies the arguments to get $100$ and then takes the logarithm twice.' },
        { textMd: '$25$', mistake: 'Adds the arguments and forgets to take the logarithm at all.' },
        { textMd: '$100$', mistake: 'Multiplies the arguments correctly but forgets to take the logarithm.' },
        { textMd: '$\\log_{10} 25$', mistake: 'Turns a sum of logarithms into the logarithm of a sum.' },
      ],
      correctOption: 1, // wrong on purpose: the answer is 2
      explanationMd:
        'A sum of logarithms with the same base is the logarithm of the product: $\\log_{10}(20 \\cdot 5) = \\log_{10} 100 = 2$. Check: $10^2 = 100$.',
    });
    const model = fakeModel([goodDraft(), wrongKey], ['A', 'B']);
    const outcome = await draftQuestions(tolcI, request(), { model, bank, stimulusIds: new Set(), today: '2026-10-27', precheck: true });

    expect(outcome.accepted.map((q) => q.stemMd)).toEqual([goodDraft().stemMd]);
    expect(outcome.rejected).toHaveLength(1);
    expect(outcome.rejected[0].reasons[0]).toContain('the key says A');

    const highest = nextQuestionNumber(bank.filter((q) => q.examKey === 'tolc-i').map((q) => q.id)) - 1;
    expect(outcome.accepted[0].id).toBe(`tolc-i-exponential-equation-with-base-two-${highest + 1}`);
    expect(outcome.accepted[0].provenance.authoredBy).toBe('draft-questions (fake-model)');
    expect(model.prompts).toHaveLength(2);
  });

  it('never writes the same item twice in one run', async () => {
    const model = fakeModel([goodDraft(), goodDraft({ topicSlug: 'again' })], ['A', 'A']);
    const outcome = await draftQuestions(tolcI, request(), { model, bank, stimulusIds: new Set(), today: '2026-10-27', precheck: false });
    expect(outcome.accepted).toHaveLength(1);
    expect(outcome.rejected[0].reasons.join(' ')).toContain('near-duplicate');
  });
});

// Keep the type import used: a Question is what every accepted draft is.
export type { Question };
