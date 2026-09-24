import { describe, expect, it } from 'vitest';
import { loadContent } from '@/lib/content/loader';
import { answerLettersNamed, validateQuestion } from '@/lib/content/question-schema';

/**
 * Option letters written in explanations.
 *
 * `scripts/normalise-option-order.ts` once reordered 189 questions and
 * remapped their keys, but not the letters in their prose: 92 of those
 * explanations then pointed to a wrong option as the answer or discussed the
 * answer under a wrong letter. The validator now refuses an
 * explanation that presents a non-key letter as the answer. The phrasings
 * below are the defects that were found, before and after correction.
 */

describe('answerLettersNamed', () => {
  it('finds the ways the stale explanations named an answer', () => {
    expect(answerLettersNamed('...absorbs infrared light, while the paper around it reflects...". Choice B.\n\nCheck it with two quick tests.')).toEqual(['B']);
    expect(answerLettersNamed('Contracts is on Tuesday in both, so option D must be true.')).toEqual(['D']);
    expect(answerLettersNamed('Since $70 > 55$, the survey figure cannot be right: it is too high. That is (A).')).toEqual(['A']);
    expect(answerLettersNamed('The correct answer is (E), because the reply concedes the point.')).toEqual(['E']);
    expect(answerLettersNamed('That is exactly option C.')).toEqual(['C']);
  });

  it('does not read a discussion of a wrong option as a claim that it is the answer', () => {
    expect(answerLettersNamed('An arrow can never simply be read backwards, which is the error behind option B.')).toEqual([]);
    expect(answerLettersNamed('Then check that no punctuation separates the conjunction from its clause, which eliminates choice D.')).toEqual([]);
    expect(answerLettersNamed('That is choice A, which is the opposite of what the passage says is hidden.')).toEqual([]);
    expect(answerLettersNamed('It is the mirror image of option D’s error.')).toEqual([]);
    expect(answerLettersNamed('Let the area be $A$. The answer is $A = 12$.')).toEqual([]);
  });
});

describe('the validator', () => {
  const { questions } = loadContent();
  const choice = questions
    .map(({ question }) => question)
    .filter((q) => q.state === 'published' && (q.responseType === 'single_select' || q.responseType === 'multi_select'));

  it('refuses an explanation that names a wrong option as the answer', () => {
    const q = structuredClone(choice.find((item) => item.responseType === 'single_select')!);
    const wrong = q.options.find((o) => q.answerKey.type === 'single_select' && o.id !== q.answerKey.optionId)!;
    q.explanationMd = `${q.explanationMd}\n\nThe answer is ${wrong.label}.`;
    expect(validateQuestion(q).map((issue) => issue.code)).toContain('explanation-names-wrong-answer');
  });

  it('passes every published explanation in the bank', () => {
    expect(choice.length).toBeGreaterThan(200);
    for (const q of choice) {
      const codes = validateQuestion(q).map((issue) => issue.code);
      expect(codes, q.id).not.toContain('explanation-names-wrong-answer');
    }
  });
});
