import { describe, expect, it } from 'vitest';
import { contentLocales } from '@/i18n/alternates';
import { getConfigsForHub } from '@/lib/exams/registry';
import { hubContent, listHubTranslations } from '@/lib/exams/hub-content';
import { blueprintTextIt, examDetailsTranslation } from '@/lib/exams/hub-details-it';

/**
 * A hub translation gets its own canonical address (src/i18n/alternates.ts),
 * so it must be a whole translation: every part of the page that would
 * otherwise be English, the exam details included, and the same samples with
 * the same answers as the English page.
 */

const translations = listHubTranslations();

describe('translated exam hubs', () => {
  it('exist, so this suite checks something', () => {
    expect(translations.length).toBeGreaterThan(0);
  });

  it('are served at their own address in exactly the languages they are written in', () => {
    for (const [slug, locale] of translations) expect(contentLocales(`/exams/${slug}`), slug).toContain(locale);
  });

  it('translate every exam detail the page shows: summary, version, cycle, every section and every open-able format', () => {
    for (const [slug, locale] of translations) {
      for (const config of getConfigsForHub(slug)) {
        const details = examDetailsTranslation(config.examKey, locale);
        expect(details, `${slug} ${locale} ${config.examKey}`).toBeDefined();
        expect(details!.summary).not.toBe(config.summary);
        expect(details!.name).not.toBe(config.name);
        if (config.scoring.officialScale) expect(details!.scaleLabel, `${config.examKey} scale`).toBeTruthy();
        for (const section of config.sections) expect(details!.sections[section.key], `${config.examKey} ${section.key}`).toBeTruthy();
        for (const blueprint of config.blueprints) {
          const text = locale === 'it' ? blueprintTextIt(config, blueprint) : undefined;
          expect(text, `${config.examKey} ${blueprint.id}`).toBeDefined();
          expect(text!.label).not.toBe(blueprint.label);
          // Every number in the English description survives the translation.
          for (const n of blueprint.description.match(/\d+/g) ?? []) expect(text!.description, `${blueprint.id} ${n}`).toContain(n);
        }
      }
    }
  });

  it('have the same samples as the English page, with the same keys and the same numbers', () => {
    for (const [slug, locale, content] of translations) {
      const english = hubContent(slug)!;
      const en = english.samples?.set.sections ?? [];
      const tr = content.samples?.set.sections ?? [];
      expect(tr.map((s) => s.id), `${slug} ${locale}`).toEqual(en.map((s) => s.id));
      en.forEach((section, i) => {
        section.questions.forEach((q, j) => {
          const t = tr[i].questions[j];
          expect(t.id).toBe(q.id);
          expect(t.answer, q.id).toBe(q.answer);
          expect(t.options.map((o) => o.id), q.id).toEqual(q.options.map((o) => o.id));
          // Numeric options, and the formulas in every option, are the same in both languages.
          q.options.forEach((o, k) => {
            if (/^[\d.,%\s]+$|^\$[^$]*\$$/.test(o.text)) expect(t.options[k].text, `${q.id} ${o.id}`).toBe(o.text);
          });
          expect(Boolean(t.stimulusMd), q.id).toBe(Boolean(q.stimulusMd));
        });
      });
      expect(Boolean(content.studyPlan)).toBe(Boolean(english.studyPlan));
      expect(Boolean(content.status)).toBe(Boolean(english.status));
      expect(content.status?.checkedOn).toBe(english.status?.checkedOn);
    }
  });

  it('say that no fluent human reviewer has read them yet', () => {
    // Remove a translationNote only with a recorded review (docs/review/README.md).
    for (const [slug, locale, content] of translations) expect(content.translationNote, `${slug} ${locale}`).toBeDefined();
  });
});
