import type { Db } from '@/lib/db';
import type { Blueprint, ExamConfig } from '@/lib/assessment/types';
import { getPool } from '@/lib/content/repository';
import { availabilityFromPool, type BlueprintAvailability } from '@/lib/attempts/availability';
import { homepageSampleFor } from '@/lib/content/public-samples';
import { loadSampleView, type SampleView } from '@/lib/content/sample-view';
import { listHubs, requireExamConfig, type ExamHub } from '@/lib/exams/registry';
import type { FormatStatus } from '@/components/ui';

/**
 * Everything the homepage states about the bank and its formats.
 *
 * All of it is computed from the live reviewed bank with the same eligibility
 * rule that session creation uses, so the page can never advertise a format
 * that would then refuse to start.
 */

/**
 * A sentence for the page, as a key in the `home` message namespace plus its
 * values, so it is translated where it is rendered. A list value is joined
 * with the reader's locale's list format ("x and y", "x, y and z").
 */
export type HomeValue = string | number | { list: string[] };
export interface HomeMessage {
  key: string;
  values?: Record<string, HomeValue>;
}

export interface ExamChoice {
  hubSlug: string;
  label: string;
  name: string;
  destinations: Array<{ href: string; label: HomeMessage }>;
  guideHref: string;
  guideLabel: HomeMessage;
  facts: HomeMessage[];
}

export interface FormatCell {
  status: FormatStatus;
  /** English detail, kept for callers that do not translate yet. Prefer `message`. */
  detail: string | null;
  /** The same detail as a `home` message (keys under `formats.detail`). */
  message: HomeMessage | null;
}

export interface MatrixRow {
  examKey: string;
  hubSlug: string;
  name: string;
  variant: string | null;
  questions: number;
  practice: FormatCell;
  diagnostic: FormatCell;
  timed: FormatCell;
  simulation: FormatCell;
}

interface ConfigSnapshot {
  config: ExamConfig;
  questions: number;
  availability: BlueprintAvailability[];
}

const isEssayOnly = (blueprint: Blueprint) =>
  blueprint.parts.every((part) => part.selection.responseTypes.length === 1 && part.selection.responseTypes[0] === 'essay');

const isTimedSection = (blueprint: Blueprint) =>
  blueprint.mode === 'practice' && blueprint.timing !== 'untimed' && !isEssayOnly(blueprint);

/** "Timed Math module 1 (22 questions / 35 minutes)" -> "Math module 1". */
function shortFormatName(label: string): string {
  return label.replace(/\s*\(.*\)\s*$/, '').replace(/^Timed\s+/i, '').trim();
}

async function snapshot(db: Db, config: ExamConfig): Promise<ConfigSnapshot> {
  const pool = (await getPool(db, config.examKey, null));
  return { config, questions: pool.length, availability: availabilityFromPool(pool, config) };
}

const RULES_NOT_VERIFIED = 'The rules it needs are not verified';
const NO_DETAIL = { detail: null, message: null } as const;

function cellFor(entry: BlueprintAvailability | undefined): FormatCell {
  if (!entry) return { status: 'notoffered', ...NO_DETAIL };
  if (entry.available) {
    return {
      status: 'open',
      detail: `${entry.itemsRequested} questions`,
      message: { key: 'formats.detail.questions', values: { count: entry.itemsRequested } },
    };
  }
  if (entry.blockedBy === 'rules') {
    return { status: 'notoffered', detail: RULES_NOT_VERIFIED, message: { key: 'formats.detail.rulesNotVerified' } };
  }
  return {
    status: 'notyet',
    detail: `${entry.itemsAvailable} of ${entry.itemsRequested} questions`,
    message: {
      key: 'formats.detail.partial',
      values: { available: entry.itemsAvailable, requested: entry.itemsRequested },
    },
  };
}

function timedCell(entries: BlueprintAvailability[]): FormatCell {
  const timed = entries.filter((entry) => isTimedSection(entry.blueprint));
  if (timed.length === 0) return { status: 'notoffered', ...NO_DETAIL };
  const open = timed.filter((entry) => entry.available);
  if (open.length > 0) {
    // Section names come from the exam configuration and stay as published.
    const names = open.map((entry) => shortFormatName(entry.blueprint.label)).join(' · ');
    const rest = timed.length - open.length;
    return rest > 0
      ? {
          status: 'open',
          detail: `${names}; ${rest} more need questions`,
          message: { key: 'formats.detail.timedOpenWithRest', values: { names, rest } },
        }
      : { status: 'open', detail: names, message: { key: 'formats.detail.timedOpen', values: { names } } };
  }
  const closest = [...timed].sort((a, b) => a.shortfall - b.shortfall)[0];
  const name = shortFormatName(closest.blueprint.label);
  return {
    status: 'notyet',
    detail: `Closest: ${name}, ${closest.itemsAvailable} of ${closest.itemsRequested}`,
    message: {
      key: 'formats.detail.closest',
      values: { name, available: closest.itemsAvailable, requested: closest.itemsRequested },
    },
  };
}

function simulationCell(snap: ConfigSnapshot): FormatCell {
  const simulation = snap.availability.find((entry) => entry.blueprint.mode === 'simulation');
  if (simulation) return cellFor(simulation);
  // No simulation blueprint at all: the configuration has switched it off.
  return snap.config.capabilities.fullSimulation.available
    ? { status: 'notyet', ...NO_DETAIL }
    : { status: 'notoffered', detail: RULES_NOT_VERIFIED, message: { key: 'formats.detail.rulesNotVerified' } };
}

function variantOf(hub: ExamHub, examKey: string): string | null {
  return hub.configKeys.length > 1 ? (hub.variantLabels?.[examKey] ?? null) : null;
}

/**
 * A variant label as it reads mid-sentence ("Law" -> "law"). Only the first
 * letter changes, so an exam name inside it ("Economics (TOLC-E)") stays intact.
 */
function inSentence(label: string | null): string {
  return label ? label.charAt(0).toLowerCase() + label.slice(1) : '';
}

export interface HomeData {
  choices: ExamChoice[];
  matrix: MatrixRow[];
  asOf: string;
}

export async function buildHomeData(db: Db, now = new Date()): Promise<HomeData> {
  const choices: ExamChoice[] = [];
  const matrix: MatrixRow[] = [];

  for (const hub of listHubs()) {
    const snaps = (await Promise.all(hub.configKeys.map(async (key) => (await snapshot(db, requireExamConfig(key))))));

    for (const snap of snaps) {
      const byId = (id: string) => snap.availability.find((entry) => entry.blueprint.id === id);
      matrix.push({
        examKey: snap.config.examKey,
        hubSlug: hub.slug,
        name: hub.name,
        variant: variantOf(hub, snap.config.examKey),
        questions: snap.questions,
        practice: byId('practice')?.available ? { status: 'open', ...NO_DETAIL } : cellFor(byId('practice')),
        diagnostic: cellFor(byId('diagnostic')),
        timed: timedCell(snap.availability),
        simulation: simulationCell(snap),
      });
    }

    // What choosing this exam on the homepage leads to.
    const total = snaps.reduce((n, snap) => n + snap.questions, 0);
    const facts: HomeMessage[] = [
      snaps.length > 1
        ? {
            key: 'choice.facts.reviewedQuestionsSplit',
            values: {
              count: total,
              breakdown: {
                list: snaps.map((s) => `${s.questions} ${inSentence(variantOf(hub, s.config.examKey))}`),
              },
            },
          }
        : { key: 'choice.facts.reviewedQuestions', values: { count: total } },
    ];
    if (snaps.some((snap) => snap.availability.find((e) => e.blueprint.id === 'practice')?.available)) {
      facts.push({ key: 'choice.facts.topicPractice' });
    }
    const diagnostics = snaps.filter((snap) => snap.availability.find((e) => e.blueprint.id === 'diagnostic')?.available);
    if (diagnostics.length === snaps.length && diagnostics.length > 0) {
      const diagnostic = diagnostics[0].availability.find((e) => e.blueprint.id === 'diagnostic')!;
      facts.push(
        snaps.length > 1
          ? { key: 'choice.facts.diagnostic' }
          : { key: 'choice.facts.diagnosticSized', values: { count: diagnostic.itemsRequested } },
      );
    } else if (diagnostics.length > 0) {
      facts.push({
        key: 'choice.facts.diagnosticOn',
        values: {
          variants: {
            list: diagnostics.map((s) => inSentence(variantOf(hub, s.config.examKey))),
          },
        },
      });
    }
    const openTimed = snaps.flatMap((snap) => snap.availability.filter((e) => isTimedSection(e.blueprint) && e.available));
    if (openTimed.length > 0) facts.push({ key: 'choice.facts.timedSections', values: { count: openTimed.length } });

    choices.push({
      hubSlug: hub.slug,
      label: hub.label,
      name: hub.name,
      destinations: snaps.map((snap): ExamChoice['destinations'][number] => ({
        href: `/practice/${snap.config.examKey}`,
        label:
          snaps.length > 1
            ? { key: 'choice.practiseVariant', values: { variant: inSentence(variantOf(hub, snap.config.examKey)) } }
            : { key: 'choice.startPractice', values: { exam: hub.label } },
      })),
      guideHref: `/exams/${hub.slug}`,
      guideLabel: { key: 'choice.whatsOn', values: { exam: hub.label } },
      facts,
    });
  }

  return { choices, matrix, asOf: now.toISOString() };
}

/** The initial sample, for whichever exam the page opens on. */
export async function initialSample(db: Db, hubSlug: string): Promise<SampleView | null> {
  const sample = homepageSampleFor(hubSlug);
  return sample ? (await loadSampleView(db, sample)) : null;
}

export interface SourceExample {
  host: string;
  verifiedOn: string;
  href: string;
}

/** A real source and verification date, shown as an example of how facts are cited. */
export function sourceExample(examKey = 'digital-sat'): SourceExample | null {
  const config = requireExamConfig(examKey);
  const source = config.sources[0];
  if (!source) return null;
  return { host: new URL(source.url).host, verifiedOn: source.verifiedOn, href: '/exams/digital-sat/format' };
}
