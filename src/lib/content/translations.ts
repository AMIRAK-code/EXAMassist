import type { ContentLocale, Question, QuestionTranslation, Stimulus, StimulusTranslation } from './question-schema';

/**
 * Translations that may be served: those an independent checker solved from
 * the translated wording, reaching the keyed answer, and judged faithful.
 * Anything else stays in the content files and never reaches a learner.
 */
export function servableQuestionTranslations(
  question: Pick<Question, 'translations'>,
): Partial<Record<ContentLocale, Omit<QuestionTranslation, 'check'>>> | null {
  const out: Partial<Record<ContentLocale, Omit<QuestionTranslation, 'check'>>> = {};
  for (const [locale, t] of Object.entries(question.translations ?? {}) as Array<[ContentLocale, QuestionTranslation]>) {
    if (!t.check.checkedBy || t.check.answerPreserved !== true) continue;
    const { check: _check, ...content } = t;
    out[locale] = content;
  }
  return Object.keys(out).length > 0 ? out : null;
}

export function servableStimulusTranslations(
  stimulus: Pick<Stimulus, 'translations'>,
): Partial<Record<ContentLocale, Omit<StimulusTranslation, 'check'>>> | null {
  const out: Partial<Record<ContentLocale, Omit<StimulusTranslation, 'check'>>> = {};
  for (const [locale, t] of Object.entries(stimulus.translations ?? {}) as Array<[ContentLocale, StimulusTranslation]>) {
    if (!t.check.checkedBy || t.check.answerPreserved !== true) continue;
    const { check: _check, ...content } = t;
    out[locale] = content;
  }
  return Object.keys(out).length > 0 ? out : null;
}

/**
 * The version hash covers what makes a version a version: wording, key and
 * scoring. A checked translation is presentation of that version, so adding
 * one never forces a new version.
 */
export function withoutTranslations<T extends { translations?: unknown }>(value: T): Omit<T, 'translations'> {
  const { translations: _translations, ...rest } = value;
  return rest;
}
