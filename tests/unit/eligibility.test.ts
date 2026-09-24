import { beforeEach, describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';
import type { PoolItem } from '@/lib/assessment/select';
import { checkBlueprintSufficiency } from '@/lib/assessment/select';
import { availabilityFromPool, facetsFromPool, practiceFacets } from '@/lib/attempts/availability';
import { eligiblePool, isMeasurementFormat } from '@/lib/attempts/eligibility';
import { defaultLength, eligibleCount, lengthOptions } from '@/lib/attempts/facets';
import { AttemptError, getAttemptState, resolveParts, startAttempt } from '@/lib/attempts/service';
import { loadContent } from '@/lib/content/loader';
import { PUBLIC_SAMPLES, PUBLIC_SAMPLE_IDS, WITHHELD_SAMPLES, homepageSampleFor } from '@/lib/content/public-samples';
import { EXAM_CONFIGS, getBlueprint, getHubForConfig, listHubs, requireExamConfig } from '@/lib/exams/registry';
import { attemptQuestionOrder, createTestDb, createUser, seedQuestions } from './helpers/test-db';

/**
 * One eligibility rule for "is this open?" and "build this session".
 *
 * The first half runs against the real reviewed bank, because the property
 * that matters - no public sample closes a format that is open today - is a
 * property of the actual content, not of synthetic fixtures.
 */

const { questions } = loadContent();

/** The published bank as the selection engine sees it, without a database. */
function realPool(examKey: string): PoolItem[] {
  return questions
    .map(({ question }) => question)
    .filter((q) => q.examKey === examKey && q.state === 'published')
    .map((q) => ({
      questionVersionId: `${q.id}@${q.version}`,
      questionId: q.id,
      sectionKey: q.sectionKey,
      domainSlug: q.domainSlug,
      skillSlug: q.skillSlug,
      responseType: q.responseType,
      difficulty: q.difficulty,
      stimulusId: q.stimulusRef?.id ?? null,
      lastSeenAt: null,
    }));
}

describe('the public sample set', () => {
  it('holds only published, blind-solved single-select questions with worked explanations', () => {
    for (const sample of PUBLIC_SAMPLES) {
      const found = questions.find(({ question }) => question.id === sample.questionId)?.question;
      expect(found, sample.questionId).toBeDefined();
      expect(found!.state).toBe('published');
      expect(found!.examKey).toBe(sample.examKey);
      expect(found!.responseType).toBe('single_select');
      expect(found!.explanationMd.length).toBeGreaterThan(200);
      expect(Object.keys(found!.distractorRationale).length).toBeGreaterThanOrEqual(found!.options.length - 1);
      expect(found!.review.independentSolve?.agreesWithKey).toBe(true);
      expect(getHubForConfig(sample.examKey)?.slug).toBe(sample.hubSlug);
    }
  });

  it('gives every public exam hub a homepage sample, or a stated reason for withholding one', () => {
    for (const hub of listHubs()) {
      if (WITHHELD_SAMPLES[hub.slug]) expect(homepageSampleFor(hub.slug), hub.slug).toBeUndefined();
      else expect(homepageSampleFor(hub.slug), hub.slug).toBeDefined();
    }
  });

  it('shows no option letters in its explanations or notes', () => {
    // Options were reordered after review without the letters in the text being
    // updated, so any letter a public sample names could point at the wrong option.
    for (const sample of PUBLIC_SAMPLES) {
      const q = questions.find(({ question }) => question.id === sample.questionId)!.question;
      const text = [q.explanationMd, ...Object.values(q.distractorRationale)].join(' ').replace(/\$[^$]*\$/g, ' ');
      expect(text, sample.questionId).not.toMatch(/\b(?:[Cc]hoice|[Oo]ption)s? \(?[A-E]\)?\b|\([A-E]\)|\b[A-E]\)/);
    }
  });

  it('closes no format that is open without the exclusion', () => {
    for (const config of EXAM_CONFIGS) {
      const pool = realPool(config.examKey);
      const without = availabilityFromPool(pool, config, new Set());
      const withSamples = availabilityFromPool(pool, config);
      for (const [index, entry] of without.entries()) {
        if (!entry.available) continue;
        expect(withSamples[index].available, `${config.examKey}/${entry.blueprint.id}`).toBe(true);
      }
    }
  });

  it('is kept out of measurement formats but not out of topic practice', () => {
    for (const config of EXAM_CONFIGS) {
      const pool = realPool(config.examKey);
      for (const blueprint of config.blueprints) {
        const ids = new Set(eligiblePool(pool, blueprint).map((item) => item.questionId));
        const samplesPresent = [...PUBLIC_SAMPLE_IDS].filter((id) => ids.has(id));
        if (isMeasurementFormat(blueprint)) expect(samplesPresent, blueprint.id).toEqual([]);
        else expect(ids.size, blueprint.id).toBe(pool.length);
      }
    }
  });
});

describe('practice counts', () => {
  it('equal what session creation checks, for every combination of filters', () => {
    for (const config of EXAM_CONFIGS) {
      const blueprint = getBlueprint(config, 'practice')!;
      const pool = realPool(config.examKey);
      const facets = facetsFromPool(pool, config, blueprint);

      const combos: Array<{ domain?: string; skill?: string }> = [{}];
      for (const domain of config.domains) {
        combos.push({ domain: domain.slug });
        for (const skill of domain.skills) combos.push({ domain: domain.slug, skill: skill.slug }, { skill: skill.slug });
      }

      for (const combo of combos) {
        for (const difficulty of ['mixed', 'easy', 'medium', 'hard'] as const) {
          const shown = eligibleCount(facets, { ...combo, difficulty });
          const parts = resolveParts(
            blueprint,
            {
              domains: combo.domain ? [combo.domain] : undefined,
              skills: combo.skill ? [combo.skill] : undefined,
              difficulty,
              length: 1,
            },
            config,
          );
          const checked = checkBlueprintSufficiency(eligiblePool(pool, blueprint), parts).parts[0].available;
          expect(shown, `${config.examKey} ${JSON.stringify(combo)} ${difficulty}`).toBe(checked);
        }
      }
    }
  });

  it('offer one- and two-question drills only when that is all the bank holds', () => {
    expect(lengthOptions(0)).toEqual([]);
    expect(lengthOptions(1)).toEqual([1]);
    expect(lengthOptions(2)).toEqual([1, 2]);
    expect(lengthOptions(4)).toEqual([1, 2, 3, 4]);
    expect(lengthOptions(7)).toEqual([5, 7]);
    expect(lengthOptions(50)).toEqual([5, 10, 15, 20, 30]);
    expect(defaultLength(2)).toBe(2);
    expect(defaultLength(50)).toBe(10);
  });
});

describe('session creation', () => {
  const SAT = requireExamConfig('digital-sat');
  let db: Db;
  let learner: string;

  beforeEach(() => {
    db = createTestDb();
    learner = createUser(db);
    seedQuestions(db, SAT, { perDomain: 6 });
  });

  it('builds a drill of exactly the eligible count and refuses one more', () => {
    const facets = practiceFacets(db, SAT);
    const skill = facets[0].skillSlug;
    const eligible = eligibleCount(facets, { skill });

    const ok = startAttempt(db, {
      userId: learner,
      examKey: SAT.examKey,
      blueprintId: 'practice',
      overrides: { skills: [skill], length: eligible },
    });
    expect(getAttemptState(db, ok.attemptId, learner).parts[0].items).toHaveLength(eligible);

    try {
      startAttempt(db, {
        userId: learner,
        examKey: SAT.examKey,
        blueprintId: 'practice',
        overrides: { skills: [skill], length: eligible + 1 },
      });
      expect.unreachable();
    } catch (error) {
      expect((error as AttemptError).code).toBe('insufficient-content');
      expect(((error as AttemptError).detail as { parts: Array<{ available: number }> }).parts[0].available).toBe(eligible);
    }
  });

  it('treats a chosen difficulty as a filter, never padding with other levels', () => {
    const hard = eligibleCount(practiceFacets(db, SAT), { difficulty: 'hard' });
    const { attemptId } = startAttempt(db, {
      userId: learner,
      examKey: SAT.examKey,
      blueprintId: 'practice',
      overrides: { difficulty: 'hard', length: hard },
    });
    const ids = attemptQuestionOrder(db, attemptId);
    const levels = db
      .prepare(
        `SELECT DISTINCT qv.difficulty AS d FROM attempt_items ai
         JOIN question_versions qv ON qv.id = ai.question_version_id WHERE ai.attempt_id = ?`,
      )
      .all(attemptId) as Array<{ d: string }>;
    expect(ids).toHaveLength(hard);
    expect(levels.map((l) => l.d)).toEqual(['hard']);

    expect(() =>
      startAttempt(db, {
        userId: learner,
        examKey: SAT.examKey,
        blueprintId: 'practice',
        overrides: { difficulty: 'hard', length: hard + 1 },
      }),
    ).toThrowError(AttemptError);
  });

  it('reports an unknown exam as not found rather than failing', () => {
    try {
      startAttempt(db, { userId: learner, examKey: 'no-such-exam', blueprintId: 'practice' });
      expect.unreachable();
    } catch (error) {
      expect((error as AttemptError).status).toBe(404);
    }
  });

  describe('with a public sample in the bank', () => {
    const SAMPLE = 'digital-sat-rw-words-in-context-cochineal-039';
    beforeEach(() => {
      // Give a synthetic question the id of a real public sample.
      for (const [from, to] of [['craft-and-structure-q0', SAMPLE]]) {
        db.prepare(
          `INSERT INTO questions (id, exam_key, current_version, state, created_at, updated_at)
           SELECT ?, exam_key, current_version, state, created_at, updated_at FROM questions WHERE id = ?`,
        ).run(to, from);
        db.prepare('UPDATE question_versions SET question_id = ? WHERE question_id = ?').run(to, from);
        db.prepare('DELETE FROM questions WHERE id = ?').run(from);
      }
    });

    it('never places it in a new diagnostic or timed session', () => {
      for (let seed = 0; seed < 25; seed += 1) {
        for (const blueprintId of ['diagnostic']) {
          const { attemptId } = startAttempt(db, {
            userId: learner,
            examKey: SAT.examKey,
            blueprintId,
            seed: `seed-${blueprintId}-${seed}`,
          });
          expect(attemptQuestionOrder(db, attemptId)).not.toContain(SAMPLE);
        }
      }
    });

    it('still lets topic practice serve it', () => {
      const served = Array.from({ length: 25 }, (_, seed) =>
        attemptQuestionOrder(
          db,
          startAttempt(db, {
            userId: learner,
            examKey: SAT.examKey,
            blueprintId: 'practice',
            overrides: { domains: ['craft-and-structure'], length: 3 },
            seed: `practice-${seed}`,
          }).attemptId,
        ),
      );
      expect(served.some((ids) => ids.includes(SAMPLE))).toBe(true);
    });

    it('keeps an existing attempt’s assignment, even one that holds the sample', () => {
      const { attemptId } = startAttempt(db, { userId: learner, examKey: SAT.examKey, blueprintId: 'diagnostic' });
      const version = db.prepare('SELECT id FROM question_versions WHERE question_id = ?').get(SAMPLE) as { id: string };
      // An attempt created before the sample set existed.
      db.prepare(
        'UPDATE attempt_items SET question_id = ?, question_version_id = ? WHERE attempt_id = ? AND position = 0 AND part_index = 0',
      ).run(SAMPLE, version.id, attemptId);

      const before = attemptQuestionOrder(db, attemptId);
      getAttemptState(db, attemptId, learner);
      expect(attemptQuestionOrder(db, attemptId)).toEqual(before);
      expect(before).toContain(SAMPLE);
    });
  });
});
