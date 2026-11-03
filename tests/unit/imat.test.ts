import { beforeEach, describe, expect, it, onTestFinished } from 'vitest';
import type { Db } from '@/lib/db';
import type { PoolItem } from '@/lib/assessment/select';
import { examConfigSchema } from '@/lib/assessment/types';
import { availabilityFromPool } from '@/lib/attempts/availability';
import { examSaleStatus, saleStatusFrom } from '@/lib/billing/availability';
import { loadContent } from '@/lib/content/loader';
import { servableQuestionTranslations, sessionContentLocale } from '@/lib/content/translations';
import { hubContent } from '@/lib/exams/hub-content';
import { blueprintTextIt, examDetailsTranslation } from '@/lib/exams/hub-details-it';
import { DRAFT_EXAM_CONFIGS, getBlueprint, getConfigsForHub, getHub, getHubForConfig, requireExamConfig } from '@/lib/exams/registry';
import { createTestDb, seedQuestions } from './helpers/test-db';

/**
 * The IMAT, live from 3 November 2026: the 2026/27 rules of D.M. 1005 of
 * 6 August 2026 (docs/research/imat.md), its bank of 60 original questions
 * with checked Italian versions, and the same billing rule as every exam.
 */

const IMAT = requireExamConfig('imat');
const MIX: Record<string, number> = {
  'imat-reading-knowledge': 4,
  'imat-logic': 5,
  'imat-biology': 23,
  'imat-chemistry': 15,
  'imat-physics-maths': 13,
};

const published = loadContent()
  .questions.map(({ question }) => question)
  .filter((q) => q.examKey === 'imat' && q.state === 'published');

function poolOf(questions: typeof published): PoolItem[] {
  return questions.map((q) => ({
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

describe('the IMAT configuration', () => {
  it('is live, verified and served by its own hub', () => {
    expect(() => examConfigSchema.parse(IMAT)).not.toThrow();
    expect(DRAFT_EXAM_CONFIGS.some((c) => c.examKey === 'imat')).toBe(false);
    expect(IMAT.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const source of IMAT.sources) expect(source.verifiedOn, source.url).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(getHubForConfig('imat')?.slug).toBe('imat');
    expect(getConfigsForHub('imat').map((c) => c.examKey)).toEqual(['imat']);
    expect(getHub('imat')?.audiences).toEqual(['undergraduate']);
  });

  it('holds the 2026/27 decree: 60 five-option questions in 100 minutes, in the published subject mix', () => {
    const simulation = getBlueprint(IMAT, 'simulation-full')!;
    expect(simulation.mode).toBe('simulation');
    expect(simulation.overallTimeLimitSeconds).toBe(100 * 60);
    expect(Object.fromEntries(simulation.parts.map((p) => [p.selection.domains[0], p.itemCount]))).toEqual(MIX);
    expect(simulation.parts.reduce((sum, p) => sum + p.itemCount, 0)).toBe(60);
    expect(IMAT.sections.map((s) => [s.officialQuestionCount, s.officialTimeMinutes])).toEqual([['60', 100]]);
    expect(IMAT.choiceOptions?.count).toBe(5);
    expect(IMAT.capabilities.fullSimulation.available).toBe(true);
  });

  it('scores +1.5 / 0 / -0.4, out of 90, with 20 points to be ranked and no admission score', () => {
    expect([IMAT.scoring.pointsCorrect, IMAT.scoring.pointsOmitted, IMAT.scoring.pointsIncorrect]).toEqual([1.5, 0, -0.4]);
    expect(IMAT.scoring.officialScale?.max).toBe(90);
    expect(IMAT.scoring.officialScale?.min).toBe(-24);
    expect(IMAT.scoring.scaledEstimate.enabled).toBe(false);
    const projection = IMAT.scoring.rawProjection!;
    expect(projection.scoredItems).toBe(60);
    expect(projection.thresholds.map((t) => t.value)).toEqual([20]);
    expect(projection.thresholds[0].meaning).toContain('not an admission score');
  });

  it('offers Italian questions in practice, never in the simulation', () => {
    expect(IMAT.contentLocales).toEqual(['en', 'it']);
    expect(sessionContentLocale(IMAT, 'simulation', 'it')).toBe('en');
    expect(sessionContentLocale(IMAT, 'practice', 'it')).toBe('it');
    expect(sessionContentLocale(IMAT, 'diagnostic', 'it')).toBe('it');
    expect(sessionContentLocale(IMAT, 'practice', null)).toBe('en');
  });
});

describe('the IMAT question bank', () => {
  it('fills one full simulation in the published mix, so every format can open once reviewers approve it', () => {
    const byDomain: Record<string, number> = {};
    for (const q of published) byDomain[q.domainSlug] = (byDomain[q.domainSlug] ?? 0) + 1;
    for (const [domain, count] of Object.entries(MIX)) expect(byDomain[domain] ?? 0, domain).toBeGreaterThanOrEqual(count);
    const availability = availabilityFromPool(poolOf(published), IMAT);
    expect(availability.filter((a) => !a.available).map((a) => a.blueprint.id)).toEqual([]);
  });

  it('is original, blind-solved and five-option throughout, and never claims to be official', () => {
    for (const q of published) {
      expect(q.provenance.origin, q.id).toBe('original');
      expect(q.options, q.id).toHaveLength(5);
      expect(q.review.independentSolve?.agreesWithKey, q.id).toBe(true);
      expect(`${q.stemMd} ${q.explanationMd}`, q.id).not.toMatch(/past paper|official (IMAT )?question|real IMAT question/i);
    }
  });
});

describe('Italian versions of the IMAT questions', () => {
  // "0.10" in English is "0,10" (or "0{,}10" in TeX) in Italian, "period 3"
  // may read "terzo periodo", and blood group O is written "gruppo 0"; the
  // numbers themselves must not change.
  const ORDINALS: Record<string, string> = { primo: '1', terzo: '3', quarto: '4', quinto: '5' };
  const numbers = (text: string) =>
    (
      text
        .replace(/\b(primo|terzo|quarto|quinto) periodo\b/g, (_, word: string) => `${ORDINALS[word]} periodo`)
        .replace(/\bgruppo (sanguigno )?0\b/g, 'gruppo $1O')
        .replace(/(\d)(?:,|\{,\})(\d)/g, '$1.$2')
        .match(/\d+(?:\.\d+)?/g) ?? []
    ).sort();

  it('exist for every published question, checked and served', () => {
    for (const q of published) {
      const it = servableQuestionTranslations(q)?.it;
      expect(it, q.id).toBeDefined();
      expect(q.translations!.it!.check.answerPreserved, q.id).toBe(true);
      expect(it!.options.map((o) => o.id), q.id).toEqual(q.options.map((o) => o.id));
      expect(it!.stemMd, q.id).not.toBe(q.stemMd);
      expect(it!.explanationMd.length, q.id).toBeGreaterThan(100);
    }
  });

  it('keep every number of the stem and the options', () => {
    for (const q of published) {
      const it = q.translations!.it!;
      expect(numbers(it.stemMd), `${q.id} stem`).toEqual(numbers(q.stemMd));
      q.options.forEach((o, i) => expect(numbers(it.options[i].textMd), `${q.id} ${o.id}`).toEqual(numbers(o.textMd)));
    }
  });
});

describe('the IMAT hub', () => {
  it('has English content and a full Italian translation that says it awaits a fluent reviewer', () => {
    const en = hubContent('imat')!;
    const it = hubContent('imat', 'it')!;
    expect(en.translationNote).toBeUndefined();
    expect(it.translationNote?.title).toBeTruthy();
    expect(it.status?.checkedOn).toBe(en.status?.checkedOn);
    const details = examDetailsTranslation('imat', 'it')!;
    expect(details.summary).toContain('60');
    for (const blueprint of IMAT.blueprints) expect(blueprintTextIt(IMAT, blueprint)?.label, blueprint.id).toBeTruthy();
  });
});

describe('selling an IMAT pass', () => {
  let db: Db;
  beforeEach(async () => {
    db = await createTestDb();
  });

  it('is refused, while human approval is required, until approved questions exist, however many are published', async () => {
    process.env.HUMAN_APPROVAL_REQUIRED = 'true';
    onTestFinished(() => { delete process.env.HUMAN_APPROVAL_REQUIRED; });
    await seedQuestions(db, IMAT, { perDomain: 25, humanApproved: false });
    expect(await examSaleStatus(db, 'imat')).toEqual({ examKey: 'imat', sellable: false, openFormats: [] });
  });

  it('counts the published bank while human approval is not required, as for every exam', async () => {
    await seedQuestions(db, IMAT, { perDomain: 25, humanApproved: false });
    expect((await examSaleStatus(db, 'imat'))?.openFormats.sort()).toEqual(['practice', 'simulation-full']);
  });

  it('opens with practice once ten approved questions exist, and adds the simulation at the full subject mix', async () => {
    process.env.HUMAN_APPROVAL_REQUIRED = 'true';
    onTestFinished(() => { delete process.env.HUMAN_APPROVAL_REQUIRED; });
    await seedQuestions(db, IMAT, { perDomain: 10 });
    expect(await examSaleStatus(db, 'imat')).toEqual({ examKey: 'imat', sellable: true, openFormats: ['practice'] });

    const full = await createTestDb();
    await seedQuestions(full, IMAT, { perDomain: 23 });
    expect((await examSaleStatus(full, 'imat'))?.openFormats.sort()).toEqual(['practice', 'simulation-full']);
  });

  it('never counts the free diagnostic as a reason to sell', () => {
    const diagnosticOnly = availabilityFromPool(poolOf(published), IMAT).map((entry) =>
      entry.blueprint.mode === 'diagnostic' ? entry : { ...entry, available: false },
    );
    expect(saleStatusFrom(IMAT, diagnosticOnly).sellable).toBe(false);
  });
});
