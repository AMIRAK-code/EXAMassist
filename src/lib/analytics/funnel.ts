import type { Db } from '@/lib/db';
import { getExamConfig, getHubForConfig } from '@/lib/exams/registry';

/**
 * First-party funnel counts, without tracking anyone.
 *
 * The privacy notice promises one cookie (the session) and no third-party
 * analytics, and this keeps that promise: the server adds 1 to a daily total
 * for a few public pages and purchase steps. A row is (day, event, subject,
 * source, count). Nothing that identifies a visitor is read into it or stored:
 * no user id, session, IP address, user agent, full referrer or cookie. The
 * referrer is reduced to one of six coarse sources before it is counted, and
 * crawlers are skipped. Because nothing is stored on the visitor's device and
 * no personal data is processed, no consent banner is needed for it.
 *
 * Free-test starts and completions are not counted here: the attempts table
 * already records them exactly, and `funnelReport` reads them from there.
 *
 * Counting must never break a page. Every write swallows its own errors, so a
 * database without migration 011 simply records nothing.
 */

export type FunnelEvent = 'landing_view' | 'pricing_view' | 'checkout_start' | 'purchase';
export type TrafficSource = 'search' | 'ai' | 'internal' | 'other' | 'direct' | 'n/a';

/** Assistants and AI search products that send visitors with a referrer. */
const AI_HOSTS = [
  'chatgpt.com',
  'chat.openai.com',
  'perplexity.ai',
  'claude.ai',
  'gemini.google.com',
  'copilot.microsoft.com',
  'chat.mistral.ai',
  'meta.ai',
];

const SEARCH_HOSTS = [
  /(^|\.)google\.[a-z.]+$/,
  /(^|\.)bing\.com$/,
  /(^|\.)duckduckgo\.com$/,
  /(^|\.)search\.yahoo\.com$/,
  /(^|\.)ecosia\.org$/,
  /(^|\.)qwant\.com$/,
  /(^|\.)yandex\.[a-z.]+$/,
  /(^|\.)baidu\.com$/,
  /(^|\.)search\.brave\.com$/,
  /(^|\.)startpage\.com$/,
];

/** Where a visit came from, at the coarsest useful grain. Only this is stored, never the referrer. */
export function classifyReferrer(referer: string | null | undefined, ownHost: string | null | undefined): TrafficSource {
  if (!referer) return 'direct';
  let host: string;
  try {
    host = new URL(referer).hostname.toLowerCase();
  } catch {
    return 'other';
  }
  if (ownHost && host === ownHost.toLowerCase().split(':')[0]) return 'internal';
  if (AI_HOSTS.some((ai) => host === ai || host.endsWith(`.${ai}`))) return 'ai';
  if (SEARCH_HOSTS.some((pattern) => pattern.test(host))) return 'search';
  return 'other';
}

/**
 * Crawlers, link previewers and monitoring, which would otherwise swamp a
 * small site's counts. Matching the user agent here only decides whether to
 * count; the user agent itself is never stored.
 */
const BOT = /bot|crawl|spider|slurp|preview|fetch|monitor|headless|lighthouse|pagespeed|curl|wget|python-requests|httpclient|go-http|okhttp|facebookexternalhit|embedly|whatsapp|-user\b/i;

export function isLikelyBot(userAgent: string | null | undefined): boolean {
  return !userAgent || BOT.test(userAgent);
}

/** The subject recorded for an exam: its config key if valid, otherwise 'none'. */
export function subjectFor(examKey: string | null | undefined): string {
  return examKey && getExamConfig(examKey) ? examKey : 'none';
}

const dayOf = (now: Date) => now.toISOString().slice(0, 10);

/** Adds 1 to today's total. Never throws. */
export async function countEvent(
  db: Db,
  event: FunnelEvent,
  subject: string,
  source: TrafficSource = 'n/a',
  now = new Date(),
): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO funnel_counts (day, event, subject, source, count) VALUES (?, ?, ?, ?, 1)
         ON CONFLICT(day, event, subject, source) DO UPDATE SET count = count + 1`,
      )
      .run(dayOf(now), event, subject, source);
  } catch (error) {
    // Most likely migration 011 is not applied yet. A count is never worth a failed page.
    console.warn('[funnel] not counted:', event, error instanceof Error ? error.message : error);
  }
}

/** The request headers a page view is judged by. */
export interface ViewHeaders {
  get(name: string): string | null;
}

/**
 * Counts a page view from a person: not a crawler, and not a router prefetch
 * (which is the browser guessing, not a visit). Never throws.
 */
export async function countPageView(db: Db, event: 'landing_view' | 'pricing_view', subject: string, headers: ViewHeaders): Promise<void> {
  try {
    if (headers.get('next-router-prefetch') || headers.get('purpose') === 'prefetch' || headers.get('sec-purpose')?.includes('prefetch')) return;
    if (isLikelyBot(headers.get('user-agent'))) return;
    const source = classifyReferrer(headers.get('referer'), headers.get('x-forwarded-host') ?? headers.get('host'));
    await countEvent(db, event, subject, source);
  } catch {
    // Never let measurement break a page.
  }
}

// ---------------------------------------------------------------------------
// Reading the counts back
// ---------------------------------------------------------------------------

export interface FunnelReport {
  from: string;
  to: string;
  /** Exam keys the report covers. */
  examKeys: string[];
  landingViews: Record<TrafficSource, number>;
  landingTotal: number;
  pricingViews: number;
  freeTestStarts: number;
  freeTestCompletions: number;
  checkoutStarts: number;
  purchases: number;
}

const SOURCES: TrafficSource[] = ['search', 'ai', 'internal', 'other', 'direct', 'n/a'];

/**
 * The Bocconi funnel (or any hub's) over a date range, inclusive, in UTC days.
 * Landing views are counted per hub; every later step per exam key.
 */
export async function funnelReport(db: Db, options: { hubSlug: string; examKeys: string[]; from: string; to: string }): Promise<FunnelReport> {
  const { hubSlug, examKeys, from, to } = options;
  const subjects = [hubSlug, ...examKeys];
  const placeholders = subjects.map(() => '?').join(', ');

  let rows: Array<{ event: string; subject: string; source: string; total: number }> = [];
  try {
    rows = (await db
      .prepare(
        `SELECT event, subject, source, SUM(count) AS total FROM funnel_counts
         WHERE day >= ? AND day <= ? AND subject IN (${placeholders})
         GROUP BY event, subject, source`,
      )
      .all(from, to, ...subjects)) as typeof rows;
  } catch {
    rows = [];
  }

  const landingViews = Object.fromEntries(SOURCES.map((s) => [s, 0])) as Record<TrafficSource, number>;
  let pricingViews = 0;
  let checkoutStarts = 0;
  let purchases = 0;
  for (const row of rows) {
    const total = Number(row.total);
    if (row.event === 'landing_view' && row.subject === hubSlug) landingViews[row.source as TrafficSource] = (landingViews[row.source as TrafficSource] ?? 0) + total;
    else if (row.event === 'pricing_view') pricingViews += total;
    else if (row.event === 'checkout_start') checkoutStarts += total;
    else if (row.event === 'purchase') purchases += total;
  }

  // The free test, read from the sessions themselves: started_at decides the day.
  const examPlaceholders = examKeys.map(() => '?').join(', ');
  const free = (await db
    .prepare(
      `SELECT status, COUNT(*) AS total FROM attempts
       WHERE exam_key IN (${examPlaceholders}) AND settings_json LIKE '%"freeTest":true%'
         AND substr(started_at, 1, 10) >= ? AND substr(started_at, 1, 10) <= ?
       GROUP BY status`,
    )
    .all(...examKeys, from, to)) as Array<{ status: string; total: number }>;
  const freeTestStarts = free.reduce((sum, row) => sum + Number(row.total), 0);
  const freeTestCompletions = free
    .filter((row) => row.status === 'submitted' || row.status === 'expired')
    .reduce((sum, row) => sum + Number(row.total), 0);

  return {
    from,
    to,
    examKeys,
    landingViews,
    landingTotal: SOURCES.reduce((sum, s) => sum + landingViews[s], 0),
    pricingViews,
    freeTestStarts,
    freeTestCompletions,
    checkoutStarts,
    purchases,
  };
}

/** The hub an exam key belongs to, for labelling. */
export function hubSlugFor(examKey: string): string | null {
  return getHubForConfig(examKey)?.slug ?? null;
}
