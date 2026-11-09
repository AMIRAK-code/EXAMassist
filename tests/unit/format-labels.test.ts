import { describe, expect, it } from 'vitest';
import { EXAM_CONFIGS } from '@/lib/exams/registry';
import { FORMAT_TEXT, formatDescription, formatFidelityNote, formatLabel } from '@/lib/exams/format-labels';

/**
 * Practice-format names are shown in the visitor's language. The English name
 * lives in the exam configuration; the others in src/lib/exams/format-labels.ts.
 */

const LOCALES = ['it', 'es', 'pl', 'tr'] as const;
const numbers = (text: string) => (text.match(/\d+/g) ?? []).join(' ');

describe('practice-format names', () => {
  const formats = EXAM_CONFIGS.flatMap((config) => config.blueprints.map((blueprint) => ({ config, blueprint })));

  it('have a name in every interface language for every format', () => {
    for (const { config, blueprint } of formats) {
      const key = `${config.examKey}/${blueprint.id}`;
      for (const locale of LOCALES) expect(FORMAT_TEXT[key]?.[locale]?.label, `${key} (${locale})`).toBeTruthy();
    }
  });

  it('carry exactly the numbers of the English name, so a changed length or time cannot go unnoticed', () => {
    for (const { config, blueprint } of formats) {
      for (const locale of LOCALES) {
        const local = formatLabel(config.examKey, blueprint, locale);
        expect(numbers(local).split(' ').sort().join(' '), `${config.examKey}/${blueprint.id} (${locale})`).toBe(
          numbers(blueprint.label).split(' ').sort().join(' '),
        );
      }
    }
  });

  it('never leave the English count words in another language', () => {
    for (const { config, blueprint } of formats) {
      for (const locale of LOCALES) {
        expect(formatLabel(config.examKey, blueprint, locale), `${config.examKey}/${blueprint.id} (${locale})`).not.toMatch(
          /\b(?:questions?|minutes?|items?|prompt|q|min)\b/,
        );
      }
    }
  });

  it('keep the configuration name in English and for unknown formats', () => {
    const { config, blueprint } = formats[0];
    expect(formatLabel(config.examKey, blueprint, 'en')).toBe(blueprint.label);
    expect(formatLabel('no-such-exam', { id: 'x', label: 'Fallback' }, 'it')).toBe('Fallback');
  });

  it('has no entry for a format that no longer exists', () => {
    const keys = new Set(formats.map(({ config, blueprint }) => `${config.examKey}/${blueprint.id}`));
    expect(Object.keys(FORMAT_TEXT).filter((key) => !keys.has(key))).toEqual([]);
  });

  it('describe every format in every interface language, with the English numbers and no English time words', () => {
    const digits = (text: string) => (text.match(/\d+/g) ?? []).sort().join(' ');
    for (const { config, blueprint } of formats) {
      for (const locale of LOCALES) {
        const where = `${config.examKey}/${blueprint.id} (${locale})`;
        expect(FORMAT_TEXT[`${config.examKey}/${blueprint.id}`]?.[locale]?.description, where).toBeTruthy();
        const local = formatDescription(config.examKey, blueprint, locale);
        expect(digits(local), where).toBe(digits(blueprint.description));
        expect(local, where).not.toMatch(/\b(?:questions?|minutes?|seconds?|items?)\b|-minute/);
      }
    }
  });

  it('give every format’s fidelity note in every interface language, with the English numbers and no English time words', () => {
    const digits = (text: string) => (text.match(/\d+/g) ?? []).sort().join(' ');
    for (const { config, blueprint } of formats) {
      for (const locale of LOCALES) {
        const where = `${config.examKey}/${blueprint.id} (${locale})`;
        expect(FORMAT_TEXT[`${config.examKey}/${blueprint.id}`]?.[locale]?.fidelityNote, where).toBeTruthy();
        const local = formatFidelityNote(config.examKey, blueprint, locale);
        expect(digits(local), where).toBe(digits(blueprint.fidelityNote));
        expect(local, where).not.toMatch(/\b(?:questions?|minutes?|seconds?|items?)\b|-minute/);
      }
    }
  });

  it('name a retry in the visitor’s language for every exam', () => {
    expect(formatLabel('gmat', { id: 'retry', label: 'Retry of questions you missed' }, 'it')).toBe(
      'Ripetizione delle domande che avevi sbagliato',
    );
    expect(formatLabel('gmat', { id: 'retry', label: 'Retry of questions you missed' }, 'en')).toBe('Retry of questions you missed');
  });
});
