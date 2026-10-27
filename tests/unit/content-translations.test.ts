import { describe, expect, it } from 'vitest';
import { servableQuestionTranslations, withoutTranslations } from '@/lib/content/translations';
import type { QuestionTranslation } from '@/lib/content/question-schema';

const translation = (check: Partial<QuestionTranslation['check']>): QuestionTranslation => ({
  stemMd: 'Quale?',
  instructionsMd: null,
  options: [{ id: 'a', textMd: 'Uno' }],
  explanationMd: 'Una spiegazione abbastanza lunga da superare il minimo richiesto dallo schema.',
  distractorRationale: {},
  accessibilityText: null,
  check: { translatedBy: 't', checkedBy: null, checkedOn: null, answerPreserved: null, notes: '', ...check },
});

describe('which translations reach learners', () => {
  it('serves a translation only after an independent check reached the key', () => {
    expect(servableQuestionTranslations({ translations: { it: translation({}) } })).toBeNull();
    expect(servableQuestionTranslations({ translations: { it: translation({ checkedBy: 'c', answerPreserved: false }) } })).toBeNull();
    const served = servableQuestionTranslations({ translations: { it: translation({ checkedBy: 'c', checkedOn: '2026-10-27', answerPreserved: true }) } });
    expect(served?.it?.stemMd).toBe('Quale?');
    // The check record stays in the content files, not in what is served.
    expect(served?.it).not.toHaveProperty('check');
  });

  it('keeps translations out of the version hash input', () => {
    expect(withoutTranslations({ id: 'q', translations: { it: 1 } })).toEqual({ id: 'q' });
  });
});
