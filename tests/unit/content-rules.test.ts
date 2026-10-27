import { describe, expect, it } from 'vitest';
import { citedOptionLetters, questionSchema, validateQuestion, type Question } from '@/lib/content/question-schema';

/**
 * Editorial rules about option letters in prose.
 *
 * These exist because reordering answer choices once left explanations
 * contradicting their own keys: the script remapped ids, labels and the key,
 * and could not rewrite English. The rules make that failure mode a build
 * error instead of something a learner finds.
 */

function question(overrides: Partial<Question> = {}): Question {
  return questionSchema.parse({
    id: 'test-letters-001',
    version: 1,
    examKey: 'lsat',
    sectionKey: 'lr1',
    domainSlug: 'logical-reasoning',
    skillSlug: 'lr-argument-parts',
    responseType: 'single_select',
    difficulty: 'medium',
    difficultyBasis: 'editorial',
    stemMd: 'Which role does the claim play?',
    options: [
      { id: 'a', label: 'A', textMd: 'Evidence for the conclusion.' },
      { id: 'b', label: 'B', textMd: 'A point conceded and then outweighed.' },
      { id: 'c', label: 'C', textMd: 'The main conclusion.' },
    ],
    answerKey: { type: 'single_select', optionId: 'b' },
    explanationMd: 'The claim is conceded with "It is true that" and then outweighed by the urgency argument.',
    distractorRationale: {
      a: 'It helps the critics, so it cannot be evidence for the author.',
      c: 'The conclusion is the final sentence, not the concession.',
    },
    estimatedSeconds: 90,
    provenance: { origin: 'original', authoredBy: 'test', aiAssisted: true },
    rightsStatus: 'original-owned',
    review: { author: 'test', reviewer: null, reviewedOn: null, independentSolve: null },
    state: 'in_review',
    ...overrides,
  });
}

const codes = (q: Question) => validateQuestion(q).map((issue) => `${issue.level}:${issue.code}`);

describe('citedOptionLetters', () => {
  it('finds every form authors use to name a choice', () => {
    expect(citedOptionLetters('That is precisely (C).')).toEqual(['C']);
    expect(citedOptionLetters('Option B states one of these.')).toEqual(['B']);
    expect(citedOptionLetters('choice D is too strong, and **A** is too weak.')).toEqual(['D', 'A']);
    expect(citedOptionLetters('So the answer is E.')).toEqual(['E']);
  });

  it('ignores notation that only looks like a letter', () => {
    expect(citedOptionLetters('By Bayes, $P(A)$ is 0.3 and P(B) is 0.5.')).toEqual([]);
    expect(citedOptionLetters('Statement (1) alone is sufficient.')).toEqual([]);
    expect(citedOptionLetters('Try to answer a simpler version first.')).toEqual([]);
    expect(citedOptionLetters("The answer's shape matters.")).toEqual([]);
  });
});

describe('validateQuestion and option letters', () => {
  it('accepts prose that describes choices', () => {
    expect(codes(question())).toEqual([]);
  });

  it('fails an explanation that asserts a different answer from the key', () => {
    const q = question({ explanationMd: 'Map the argument first. That is precisely (C), the concession.' });
    expect(codes(q)).toContain('error:stale-option-letter');
  });

  it('fails a distractor note that discusses a different choice from the one it is keyed to', () => {
    const q = question({
      distractorRationale: { a: 'Unlike (C), this one helps the critics.', c: 'The conclusion is the final sentence.' },
    });
    expect(codes(q)).toContain('error:stale-option-letter');
  });

  it('warns on any letter in prose, even a correct one, because it will go stale when choices move', () => {
    const q = question({ explanationMd: 'The claim is conceded and outweighed, which is option B.' });
    expect(codes(q)).toEqual(['warning:explanation-cites-letters']);
  });

  it('warns when an unpublished item’s screen-reader text names choices by letter', () => {
    const q = question({ accessibilityText: 'Option A is evidence, option B is a concession, option C is the conclusion.' });
    expect(codes(q)).toContain('warning:accessibility-cites-letters');
  });

  it('exempts quantitative comparison and data sufficiency, whose letters have fixed meanings', () => {
    const q = question({
      examKey: 'gre',
      responseType: 'quantitative_comparison',
      options: [
        { id: 'a', label: 'A', textMd: 'Quantity A is greater.' },
        { id: 'b', label: 'B', textMd: 'Quantity B is greater.' },
      ],
      answerKey: { type: 'quantitative_comparison', choice: 'A' },
      explanationMd: 'Quantity A is 12 and Quantity B is 10, so the answer is (A).',
      distractorRationale: {},
    });
    expect(codes(q).filter((c) => c.includes('letter'))).toEqual([]);
  });
});

describe('validateQuestion and choice positions', () => {
  it('warns on a choice named by its position, which moves just as a letter does', () => {
    const q = question({ explanationMd: 'The concession is conceded and outweighed, exactly what the first choice describes.' });
    expect(codes(q)).toEqual(['warning:explanation-cites-position']);
  });

  it('leaves positions in the question itself alone, such as the first arrangement of a logic game', () => {
    const q = question({ explanationMd: 'The extra condition rules out the first arrangement only, so two arrangements survive.' });
    expect(codes(q)).toEqual([]);
  });
});

describe('screen-reader descriptions and currency in maths (October 2026 audit)', () => {
  const money = [
    { id: 'a', label: 'A', textMd: '€225 million' },
    { id: 'b', label: 'B', textMd: '€75 million' },
    { id: 'c', label: 'C', textMd: '€50 million' },
  ];

  it('rejects a description that promises an increasing order the choices do not have', () => {
    const q = question({
      options: money,
      answerKey: { type: 'single_select', optionId: 'b' },
      distractorRationale: {},
      accessibilityText: 'The options are amounts in millions of euros, listed in increasing order: 50, 75, 225.',
    });
    expect(codes(q)).toContain('error:accessibility-claims-order');
  });

  it('accepts the same description once it lists the choices in the order shown', () => {
    const q = question({
      options: money,
      answerKey: { type: 'single_select', optionId: 'b' },
      distractorRationale: {},
      accessibilityText: 'The options are amounts in millions of euros, in the order shown: 225, 75, 50.',
    });
    expect(codes(q)).not.toContain('error:accessibility-claims-order');
  });

  it('accepts a true increasing-order claim, fractions included', () => {
    const q = question({
      options: [
        { id: 'a', label: 'A', textMd: '$\frac{1}{10}$' },
        { id: 'b', label: 'B', textMd: '$\frac{2}{5}$' },
        { id: 'c', label: 'C', textMd: '$\frac{4}{7}$' },
      ],
      answerKey: { type: 'single_select', optionId: 'c' },
      distractorRationale: {},
      accessibilityText: 'Answer options are fractions listed in increasing order: one tenth, two fifths, four sevenths.',
    });
    expect(codes(q)).not.toContain('error:accessibility-claims-order');
  });

  it('rejects a size-order claim about choices that are not numbers', () => {
    const q = question({ accessibilityText: 'The three options are listed from smallest to largest.' });
    expect(codes(q)).toContain('error:accessibility-claims-order');
  });

  it('rejects a currency sign inside inline maths', () => {
    expect(codes(question({ stemMd: 'A coat costs $€80$. What is the price after both changes?' }))).toContain(
      'error:currency-in-maths',
    );
    expect(codes(question({ stemMd: 'A coat costs €80 and $x$ is its new price.' }))).not.toContain('error:currency-in-maths');
  });
});
