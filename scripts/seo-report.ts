/**
 * The first-party half of the 28-day search report: exam-page and guide views
 * and clicks into practice by coarse source, and practice sessions completed,
 * for the 28 UTC days ending on --to (default: yesterday) against the 28 days
 * before. Read-only. The Search Console half and the procedure are in
 * docs/seo/MEASUREMENT-PLAN.md.
 *
 *   npx tsx scripts/seo-report.ts                  # the configured database
 *   npx tsx scripts/seo-report.ts --to=2026-11-30
 *
 * It reads whichever database the environment points at (src/lib/db), like
 * every other script; against production, run it from a machine that can
 * reach the production database, with its read-only settings.
 */
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

async function main() {
  const { getDb } = await import('../src/lib/db');
  const { comparableWindows, formatOrganicReport, organicReport } = await import('../src/lib/analytics/organic-report');
  const arg = process.argv.find((a) => a.startsWith('--to='));
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const to = arg ? arg.slice('--to='.length) : yesterday;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(to)) throw new Error(`--to must be YYYY-MM-DD, not ${to}`);
  const { current, previous } = comparableWindows(to);
  const db = getDb();
  process.stdout.write(formatOrganicReport(await organicReport(db, current), await organicReport(db, previous)));
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  },
);
