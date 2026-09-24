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

export interface ExamChoice {
  hubSlug: string;
  label: string;
  name: string;
  destinations: Array<{ href: string; label: string }>;
  guideHref: string;
  guideLabel: string;
  facts: string[];
}

export interface FormatCell {
  status: FormatStatus;
  detail: string | null;
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

function snapshot(db: Db, config: ExamConfig): ConfigSnapshot {
  const pool = getPool(db, config.examKey, null);
  return { config, questions: pool.length, availability: availabilityFromPool(pool, config) };
}

function cellFor(entry: BlueprintAvailability | undefined): FormatCell {
  if (!entry) return { status: 'notoffered', detail: null };
  if (entry.available) return { status: 'open', detail: `${entry.itemsRequested} questions` };
  if (entry.blockedBy === 'rules') return { status: 'notoffered', detail: 'The rules it needs are not verified' };
  return { status: 'notyet', detail: `${entry.itemsAvailable} of ${entry.itemsRequested} questions` };
}

function timedCell(entries: BlueprintAvailability[]): FormatCell {
  const timed = entries.filter((entry) => isTimedSection(entry.blueprint));
  if (timed.length === 0) return { status: 'notoffered', detail: null };
  const open = timed.filter((entry) => entry.available);
  if (open.length > 0) {
    const names = open.map((entry) => shortFormatName(entry.blueprint.label)).join(' · ');
    const rest = timed.length - open.length;
    return { status: 'open', detail: rest > 0 ? `${names}; ${rest} more need questions` : names };
  }
  const closest = [...timed].sort((a, b) => a.shortfall - b.shortfall)[0];
  return {
    status: 'notyet',
    detail: `Closest: ${shortFormatName(closest.blueprint.label)}, ${closest.itemsAvailable} of ${closest.itemsRequested}`,
  };
}

function simulationCell(snap: ConfigSnapshot): FormatCell {
  const simulation = snap.availability.find((entry) => entry.blueprint.mode === 'simulation');
  if (simulation) return cellFor(simulation);
  // No simulation blueprint at all: the configuration has switched it off.
  return snap.config.capabilities.fullSimulation.available
    ? { status: 'notyet', detail: null }
    : { status: 'notoffered', detail: 'The rules it needs are not verified' };
}

function variantOf(hub: ExamHub, examKey: string): string | null {
  return hub.configKeys.length > 1 ? (hub.variantLabels?.[examKey] ?? null) : null;
}

export interface HomeData {
  choices: ExamChoice[];
  matrix: MatrixRow[];
  asOf: string;
}

export function buildHomeData(db: Db, now = new Date()): HomeData {
  const choices: ExamChoice[] = [];
  const matrix: MatrixRow[] = [];

  for (const hub of listHubs()) {
    const snaps = hub.configKeys.map((key) => snapshot(db, requireExamConfig(key)));

    for (const snap of snaps) {
      const byId = (id: string) => snap.availability.find((entry) => entry.blueprint.id === id);
      matrix.push({
        examKey: snap.config.examKey,
        hubSlug: hub.slug,
        name: hub.name,
        variant: variantOf(hub, snap.config.examKey),
        questions: snap.questions,
        practice: byId('practice')?.available ? { status: 'open', detail: null } : cellFor(byId('practice')),
        diagnostic: cellFor(byId('diagnostic')),
        timed: timedCell(snap.availability),
        simulation: simulationCell(snap),
      });
    }

    // What choosing this exam on the homepage leads to.
    const total = snaps.reduce((n, snap) => n + snap.questions, 0);
    const facts = [
      snaps.length > 1
        ? `${total} reviewed questions (${snaps.map((s) => `${s.questions} ${variantOf(hub, s.config.examKey)?.toLowerCase()}`).join(', ')})`
        : `${total} reviewed questions`,
    ];
    if (snaps.some((snap) => snap.availability.find((e) => e.blueprint.id === 'practice')?.available)) {
      facts.push('topic practice');
    }
    const diagnostics = snaps.filter((snap) => snap.availability.find((e) => e.blueprint.id === 'diagnostic')?.available);
    if (diagnostics.length === snaps.length && diagnostics.length > 0) {
      const diagnostic = diagnostics[0].availability.find((e) => e.blueprint.id === 'diagnostic')!;
      facts.push(snaps.length > 1 ? 'a diagnostic' : `a ${diagnostic.itemsRequested}-question diagnostic`);
    } else if (diagnostics.length > 0) {
      facts.push(
        `a diagnostic on the ${diagnostics.map((s) => variantOf(hub, s.config.examKey)?.toLowerCase()).join(' and ')} test`,
      );
    }
    const openTimed = snaps.flatMap((snap) => snap.availability.filter((e) => isTimedSection(e.blueprint) && e.available));
    if (openTimed.length > 0) facts.push(`${openTimed.length} timed section${openTimed.length === 1 ? '' : 's'}`);

    choices.push({
      hubSlug: hub.slug,
      label: hub.label,
      name: hub.name,
      destinations: snaps.map((snap) => ({
        href: `/practice/${snap.config.examKey}`,
        label:
          snaps.length > 1
            ? `Practise the ${variantOf(hub, snap.config.examKey)?.toLowerCase()} test`
            : `Start ${hub.label} practice`,
      })),
      guideHref: `/exams/${hub.slug}`,
      guideLabel: `What’s on the ${hub.label}`,
      facts,
    });
  }

  return { choices, matrix, asOf: now.toISOString() };
}

/** The initial sample, for whichever exam the page opens on. */
export function initialSample(db: Db, hubSlug: string): SampleView | null {
  const sample = homepageSampleFor(hubSlug);
  return sample ? loadSampleView(db, sample) : null;
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
