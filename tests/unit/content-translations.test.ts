import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import { servableQuestionTranslations, sessionContentLocale, withoutTranslations } from '@/lib/content/translations';
import type { QuestionTranslation } from '@/lib/content/question-schema';
import { getQuestionVersion, toPresented, toReviewable } from '@/lib/content/repository';
import { getAttemptState, startAttempt } from '@/lib/attempts/service';
import { requireExamConfig } from '@/lib/exams/registry';
import { createTestDb, createUser, seedQuestions } from './helpers/test-db';

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

describe('the language a session is set in', () => {
  const tolc = { examKey: 'tolc-e', contentLocales: ['en', 'it'] as Array<'en' | 'it'> };
  const imat = { examKey: 'imat', contentLocales: ['en', 'it'] as Array<'en' | 'it'> };

  it('is Italian only when asked for and offered by the exam', () => {
    expect(sessionContentLocale(tolc, 'practice', 'it')).toBe('it');
    expect(sessionContentLocale(tolc, 'practice', 'en')).toBe('en');
    expect(sessionContentLocale(tolc, 'practice', null)).toBe('en');
    expect(sessionContentLocale({ examKey: 'digital-sat' }, 'practice', 'it')).toBe('en');
    expect(sessionContentLocale(tolc, 'practice', 'tr')).toBe('en');
  });

  it('keeps an IMAT simulation in English, as the real test is', () => {
    expect(sessionContentLocale(imat, 'simulation', 'it')).toBe('en');
    expect(sessionContentLocale(imat, 'practice', 'it')).toBe('it');
  });
});

describe('serving checked Italian versions', () => {
  const TOLC = requireExamConfig('tolc-e');
  let db: Db;
  let learner: string;
  let ids: string[];

  const italian = (stem: string) =>
    JSON.stringify({
      it: {
        stemMd: stem,
        instructionsMd: null,
        options: [
          { id: 'a', textMd: 'Prima opzione' },
          { id: 'b', textMd: 'Seconda opzione' },
          { id: 'c', textMd: 'Terza opzione' },
          { id: 'd', textMd: 'Quarta opzione' },
        ],
        explanationMd: 'Spiegazione in italiano, abbastanza lunga per lo schema.',
        distractorRationale: {},
        accessibilityText: null,
      },
    });

  beforeEach(async () => {
    db = await createTestDb();
    learner = await createUser(db);
    ids = await seedQuestions(db, TOLC);
    // Every other question has a checked Italian version.
    for (const [index, questionId] of ids.entries()) {
      if (index % 2 === 0) {
        await db.prepare('UPDATE question_versions SET translations_json = ? WHERE question_id = ?').run(italian(`Domanda ${index}`), questionId);
      }
    }
  });

  async function shownItems(contentLocale?: string) {
    const { attemptId } = await startAttempt(db, { userId: learner, examKey: TOLC.examKey, blueprintId: 'practice', contentLocale });
    const state = await getAttemptState(db, attemptId, learner);
    return state.parts.flatMap((part) => part.items);
  }

  it('shows translated questions in Italian and the rest in English', async () => {
    const items = await shownItems('it');
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      const translated = ids.indexOf(item.questionId) % 2 === 0;
      expect(item.question.locale).toBe(translated ? 'it' : 'en');
      expect(item.question.stemMd.startsWith(translated ? 'Domanda' : 'Question')).toBe(true);
      // Ids and letters are the original's, so the key still points at the same choice.
      for (const option of item.question.options) expect(option.label).toBe(option.id.toUpperCase());
    }
    expect(items.some((item) => item.question.locale === 'it')).toBe(true);
  });

  it('stays in English unless Italian is asked for', async () => {
    for (const item of await shownItems()) expect(item.question.locale).toBe('en');
  });

  it('never pairs an Italian question with an English passage', async () => {
    const now = new Date().toISOString();
    await db
      .prepare(
        `INSERT INTO stimuli (id, version, exam_key, kind, title, body_md, data_json, accessibility_text, provenance, rights_status, created_at)
         VALUES ('passage', 1, ?, 'passage', 'A passage', 'English text.', NULL, 'English text.', '{}', 'original-owned', ?)`,
      )
      .run(TOLC.examKey, now);
    await db.prepare("UPDATE question_versions SET stimulus_id = 'passage', stimulus_version = 1 WHERE question_id = ?").run(ids[0]);
    const row = (await db.prepare('SELECT id FROM question_versions WHERE question_id = ?').get(ids[0])) as { id: string };
    const version = (await getQuestionVersion(db, row.id))!;

    const withoutPassage = await toPresented(db, version, 'it');
    expect(withoutPassage.locale).toBe('en');
    expect(withoutPassage.stimulus?.bodyMd).toBe('English text.');

    await db
      .prepare('UPDATE stimuli SET translations_json = ? WHERE id = ?')
      .run(JSON.stringify({ it: { title: 'Un brano', bodyMd: 'Testo italiano.', accessibilityText: 'Testo italiano.', dataLabels: null } }), 'passage');
    const reviewable = await toReviewable(db, version, 'it');
    expect(reviewable.locale).toBe('it');
    expect(reviewable.stimulus?.bodyMd).toBe('Testo italiano.');
    expect(reviewable.explanationMd).toContain('italiano');
  });
});
