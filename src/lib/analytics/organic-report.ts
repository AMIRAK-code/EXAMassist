import type { Db } from '@/lib/db';
import { EXAM_HUBS } from '@/lib/exams/registry';
import { listGuides } from '@/lib/content/guides';
import type { TrafficSource } from './funnel';

/**
 * The first-party half of the 28-day search report (docs/seo/MEASUREMENT-PLAN.md):
 * for each exam page and guide, views and clicks into practice by coarse
 * source, from the daily totals in `funnel_counts`; and, separately, practice
 * sessions completed per exam, from the sessions themselves.
 *
 * The two halves are never joined. A click is a click on a link into practice;
 * a completed session is a session someone finished, from any page, signed in
 * or as a guest, and nothing records which visit it came from. So the report
 * gives "search visitors who clicked into practice" and "sessions completed"
 * side by side, and never "search visitors who completed a session".
 *
 * Nothing new is collected for it: it reads what the privacy notice already
 * describes (daily totals with a coarse source, and the sessions learners
 * keep in their own history).
 */

export interface Window {
  from: string;
  to: string;
}

/** The 28 UTC days ending on `to` (inclusive), and the 28 days before them. */
export function comparableWindows(to: string): { current: Window; previous: Window } {
  const day = (offset: number) => new Date(Date.parse(`${to}T00:00:00Z`) + offset * 86_400_000).toISOString().slice(0, 10);
  return { current: { from: day(-27), to }, previous: { from: day(-55), to: day(-28) } };
}

export interface PageRow {
  kind: 'exam' | 'guide';
  slug: string;
  views: Record<TrafficSource, number>;
  /** Exam pages: clicks into practice. Guides: clicks to an exam page or into practice. */
  clicks: Record<TrafficSource, number>;
}

export interface SessionRow {
  examKey: string;
  /** Sessions started in the window. */
  started: number;
  /** Of those, finished (submitted, or ended by the clock). */
  completed: number;
  completedByMode: Record<string, number>;
}

export interface OrganicReport extends Window {
  pages: PageRow[];
  sessions: SessionRow[];
}

const SOURCES: TrafficSource[] = ['search', 'ai', 'internal', 'other', 'direct', 'n/a'];
const zero = () => Object.fromEntries(SOURCES.map((s) => [s, 0])) as Record<TrafficSource, number>;

export async function organicReport(db: Db, window: Window): Promise<OrganicReport> {
  const pages = new Map<string, PageRow>();
  const page = (kind: PageRow['kind'], slug: string) => {
    const key = `${kind}:${slug}`;
    if (!pages.has(key)) pages.set(key, { kind, slug, views: zero(), clicks: zero() });
    return pages.get(key)!;
  };
  for (const hub of EXAM_HUBS) page('exam', hub.slug);
  for (const guide of listGuides()) page('guide', guide.slug);

  let rows: Array<{ event: string; subject: string; source: string; total: number | string }> = [];
  try {
    rows = (await db
      .prepare(
        `SELECT event, subject, source, SUM(count) AS total FROM funnel_counts
         WHERE day >= ? AND day <= ? AND event IN ('landing_view', 'practice_click', 'guide_view', 'guide_click')
         GROUP BY event, subject, source`,
      )
      .all(window.from, window.to)) as typeof rows;
  } catch {
    rows = [];
  }
  const sourceOf = (s: string): TrafficSource => (SOURCES.includes(s as TrafficSource) ? (s as TrafficSource) : 'n/a');
  for (const row of rows) {
    const total = Number(row.total);
    const source = sourceOf(row.source);
    if (row.event === 'landing_view') page('exam', row.subject).views[source] += total;
    else if (row.event === 'practice_click') page('exam', row.subject).clicks[source] += total;
    else if (row.event === 'guide_view') page('guide', row.subject).views[source] += total;
    else if (row.event === 'guide_click') page('guide', row.subject).clicks[source] += total;
  }

  const attemptRows = (await db
    .prepare(
      `SELECT exam_key, mode, status, COUNT(*) AS total FROM attempts
       WHERE substr(started_at, 1, 10) >= ? AND substr(started_at, 1, 10) <= ?
       GROUP BY exam_key, mode, status`,
    )
    .all(window.from, window.to)) as Array<{ exam_key: string; mode: string; status: string; total: number | string }>;
  const sessions = new Map<string, SessionRow>();
  for (const row of attemptRows) {
    const entry = sessions.get(row.exam_key) ?? { examKey: row.exam_key, started: 0, completed: 0, completedByMode: {} };
    const total = Number(row.total);
    entry.started += total;
    if (row.status === 'submitted' || row.status === 'expired') {
      entry.completed += total;
      entry.completedByMode[row.mode] = (entry.completedByMode[row.mode] ?? 0) + total;
    }
    sessions.set(row.exam_key, entry);
  }

  return {
    ...window,
    pages: [...pages.values()],
    sessions: [...sessions.values()].sort((a, b) => a.examKey.localeCompare(b.examKey)),
  };
}

const sum = (r: Record<TrafficSource, number>) => SOURCES.reduce((n, s) => n + r[s], 0);
const rate = (clicks: number, views: number) => (views === 0 ? '–' : `${((100 * clicks) / views).toFixed(1)}%`);
const delta = (now: number, before: number) => (now === before ? '±0' : now > before ? `+${now - before}` : `${now - before}`);

/** The report as Markdown tables, current window against the previous one. */
export function formatOrganicReport(current: OrganicReport, previous: OrganicReport): string {
  const before = new Map(previous.pages.map((p) => [`${p.kind}:${p.slug}`, p]));
  const lines = [
    `## First-party counts, ${current.from} to ${current.to} (previous: ${previous.from} to ${previous.to})`,
    '',
    'Views and clicks are daily totals by the coarse source of the page visit; bots are not counted. "Search" is any search engine, branded and non-branded together: the split by query is only in Search Console.',
    '',
    '| Page | Search views | Δ | Search-visit clicks | Δ | Click rate (search) | All views | All clicks |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ];
  for (const p of current.pages) {
    const old = before.get(`${p.kind}:${p.slug}`);
    const total = sum(p.views) + sum(p.clicks) + (old ? sum(old.views) + sum(old.clicks) : 0);
    if (total === 0) continue;
    lines.push(
      `| ${p.kind === 'exam' ? '/exams/' : '/guides/'}${p.slug} | ${p.views.search} | ${delta(p.views.search, old?.views.search ?? 0)} | ${p.clicks.search} | ${delta(p.clicks.search, old?.clicks.search ?? 0)} | ${rate(p.clicks.search, p.views.search)} | ${sum(p.views)} | ${sum(p.clicks)} |`,
    );
  }
  const oldSessions = new Map(previous.sessions.map((s) => [s.examKey, s]));
  lines.push(
    '',
    `## Practice sessions completed, ${current.from} to ${current.to}`,
    '',
    'All sessions on the site, from any page and any visitor; not attributable to search. Do not add these to the clicks above or divide one by the other.',
    '',
    '| Exam | Started | Completed | Δ completed | By mode |',
    '| --- | ---: | ---: | ---: | --- |',
  );
  for (const s of current.sessions) {
    const modes = Object.entries(s.completedByMode).map(([m, n]) => `${m} ${n}`).join(', ') || '–';
    lines.push(`| ${s.examKey} | ${s.started} | ${s.completed} | ${delta(s.completed, oldSessions.get(s.examKey)?.completed ?? 0)} | ${modes} |`);
  }
  if (current.sessions.length === 0) lines.push('| (none) | 0 | 0 | | |');
  return `${lines.join('\n')}\n`;
}
