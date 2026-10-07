import type { Db } from '@/lib/db';
import type { Blueprint, ExamConfig } from '@/lib/assessment/types';
import { getPool } from '@/lib/content/repository';
import { availabilityFromPool } from '@/lib/attempts/availability';
import { chooseFreeTest } from '@/lib/attempts/service';
import { expertReviewedCount } from '@/lib/content/expert-reviews';
import { initialSample } from '@/lib/home/home-data';
import type { SampleView } from '@/lib/content/sample-view';
import { getConfigsForHub, getHub, type ExamHub } from './registry';

/**
 * Everything the Bocconi landing page states about our own product, read from
 * the live bank and the exam configurations at request time. The page must
 * not carry a hand-typed count: if the bank grows or a format closes, the page
 * says so on the next request.
 */

export const BOCCONI_HUB_SLUG = 'bocconi-online-test';

export interface AreaCoverage {
  slug: string;
  name: string;
  /** Bocconi's published share, e.g. "24 of 50 questions". */
  officialShare: string | null;
  /** Reviewed questions we have in this area. */
  questions: number;
}

export interface FormatSummary {
  id: string;
  label: string;
  description: string;
  fidelity: Blueprint['fidelity'];
  fidelityNote: string;
  available: boolean;
  /** Why it is not open, in a few words, when it is not. */
  blockedNote: string | null;
}

export interface BocconiTestSummary {
  config: ExamConfig;
  /** "Undergraduate" or "Law". */
  variant: string;
  questions: number;
  areas: AreaCoverage[];
  formats: FormatSummary[];
  freeTest: { questions: number; minutes: number | null; label: string } | null;
}

export interface BocconiLandingData {
  hub: ExamHub;
  tests: BocconiTestSummary[];
  totalQuestions: number;
  openFormats: number;
  sample: SampleView | null;
  expertReviewed: number;
}

export async function bocconiLandingData(db: Db): Promise<BocconiLandingData> {
  const hub = getHub(BOCCONI_HUB_SLUG);
  if (!hub) throw new Error('The Bocconi hub is not registered.');
  const configs = getConfigsForHub(BOCCONI_HUB_SLUG);

  const tests = await Promise.all(
    configs.map(async (config): Promise<BocconiTestSummary> => {
      const pool = await getPool(db, config.examKey, null);
      const perArea = new Map<string, number>();
      for (const item of pool) perArea.set(item.domainSlug, (perArea.get(item.domainSlug) ?? 0) + 1);

      const formats = availabilityFromPool(pool, config).map((entry) => ({
        id: entry.blueprint.id,
        label: entry.blueprint.label,
        description: entry.blueprint.description,
        fidelity: entry.blueprint.fidelity,
        fidelityNote: entry.blueprint.fidelityNote,
        available: entry.available,
        blockedNote: entry.available
          ? null
          : entry.blockedBy === 'rules'
            ? 'the rules it needs are not verified'
            : `needs ${entry.shortfall} more reviewed question${entry.shortfall === 1 ? '' : 's'}`,
      }));

      const choice = chooseFreeTest(config, pool);
      const freeSeconds = choice
        ? choice.blueprint.timing === 'overall'
          ? choice.blueprint.overallTimeLimitSeconds
          : choice.blueprint.timing === 'per_part'
            ? choice.parts.reduce((sum, part) => sum + (part.timeLimitSeconds ?? 0), 0)
            : null
        : null;

      return {
        config,
        variant: hub.variantLabels?.[config.examKey] ?? config.shortName,
        questions: pool.length,
        areas: config.domains.map((domain) => ({
          slug: domain.slug,
          name: domain.name,
          officialShare: domain.officialShare ?? null,
          questions: perArea.get(domain.slug) ?? 0,
        })),
        formats,
        freeTest: choice
          ? {
              questions: choice.parts.reduce((sum, part) => sum + part.itemCount, 0),
              minutes: freeSeconds ? Math.round(freeSeconds / 60) : null,
              label: choice.blueprint.label,
            }
          : null,
      };
    }),
  );

  // Current published versions, so only a review of the version learners see counts.
  const examKeys = configs.map((c) => c.examKey);
  const versions = (await db
    .prepare(
      `SELECT id, current_version AS version FROM questions
       WHERE state = 'published' AND exam_key IN (${examKeys.map(() => '?').join(', ')})`,
    )
    .all(...examKeys)) as Array<{ id: string; version: number }>;

  return {
    hub,
    tests,
    totalQuestions: tests.reduce((sum, t) => sum + t.questions, 0),
    openFormats: tests.reduce((sum, t) => sum + t.formats.filter((f) => f.available).length, 0),
    sample: await initialSample(db, BOCCONI_HUB_SLUG),
    expertReviewed: expertReviewedCount(examKeys, new Map(versions.map((v) => [v.id, Number(v.version)]))),
  };
}
