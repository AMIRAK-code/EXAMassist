/**
 * Saves the public pages of a new version as static files in the Worker's
 * assets, so Cloudflare serves them without running the Worker
 * (src/lib/seo/static-pages.ts). `npm run cf:deploy` (scripts/cloudflare.ts)
 * runs this between an upload and the deploy:
 *
 *   1. build, and upload the Worker as a new version that receives no traffic;
 *   2. fetch each public page from that version's preview URL, as an anonymous
 *      visitor;
 *   3. deploy with those files among the assets: visitors move to a version
 *      that already has every public page as a file.
 *
 * Until 2026-10-29 step 1 deployed the version straight away, so visitors got
 * it before its pages were saved; on the Free plan they then hit error 1102
 * (CPU limit) for as long as the snapshot took, twice that day.
 *
 * The pages are the new version's own output, so they reference exactly the
 * scripts and styles uploaded with them. They change only at the next deploy:
 * after publishing questions straight to the database, deploy again to refresh
 * the counts the pages show.
 *
 * On the Free plan a page can fail with error 1102 (the client sees HTTP 503),
 * and fetching about 150 pages back to back keeps the Worker over its CPU limit
 * for minutes at a time: on 2026-10-28 /tr/exams took 268 s to come through.
 * So the snapshot pauses between pages, backs off for several minutes before
 * giving up on one, and keeps the pages an earlier run saved from the same
 * build, so `npm run cf:snapshot` can carry on where a failed run stopped.
 * Only the deploy waits for this now; visitors stay on the current version.
 */
import fs from 'node:fs';
import path from 'node:path';
import { sitemapUrls } from '../src/lib/seo/indexnow';
import { SNAPSHOT_HEADER, assetFileFor, staticPagePaths } from '../src/lib/seo/static-pages';

// "bot" keeps these requests out of the page-view totals (src/lib/analytics/funnel.ts).
const USER_AGENT = 'ExamerSnapshot/1.0 (deploy bot)';
// 3 s, 6 s, 9 s ... then 20 s each: about nine minutes in all. The previous
// deployment can also answer for a few seconds after an upload.
export const ATTEMPTS = 30;
export const retryDelay = (attempt: number) => Math.min(3000 * attempt, 20_000);
const PAUSE_MS = 1500;
const SLOW_MS = 5000;

const realSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface FetchDeps {
  fetch?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
}

export async function fetchLive(url: string, buildId: string, deps: FetchDeps = {}): Promise<Buffer> {
  const { fetch: get = fetch, sleep = realSleep } = deps;
  let reason = '';
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const response = await get(url, {
      headers: { [SNAPSHOT_HEADER]: '1', 'user-agent': USER_AGENT },
      redirect: 'manual',
      cache: 'no-store',
    }).catch((error: unknown) => {
      reason = error instanceof Error ? error.message : 'network error';
      return null;
    });
    if (response) {
      const body = Buffer.from(await response.arrayBuffer());
      const html = (response.headers.get('content-type') ?? '').startsWith('text/html');
      if (response.status !== 200) reason = `HTTP ${response.status}`;
      else if (html && !body.includes(buildId)) reason = 'served by the previous deployment';
      else return body;
    }
    if (attempt === 6) console.log(`  still waiting for ${url} (${reason})`);
    if (attempt < ATTEMPTS) await sleep(retryDelay(attempt));
  }
  throw new Error(`${url}: ${reason}, ${ATTEMPTS} attempts.`);
}

/**
 * Static assets are served whatever the hostname, before the Worker's own
 * redirects run. So the other addresses must already redirect in Cloudflare
 * (Rules → Redirect Rules), or they would serve copies of every page. Probes a
 * file every deployment has (public/og/site.png): the Worker never sees it.
 */
export async function assertHostsRedirect(site: string, hosts: readonly string[]): Promise<void> {
  const missing: string[] = [];
  for (const host of hosts) {
    const response = await fetch(`https://${host}/og/site.png`, { redirect: 'manual', cache: 'no-store' }).catch(() => null);
    const location = response?.headers.get('location') ?? '';
    if (!response || ![301, 308].includes(response.status) || !location.startsWith(`${site}/og/site.png`)) missing.push(host);
  }
  if (missing.length > 0) {
    throw new Error(
      `${missing.join(' and ')} must redirect to ${site} in Cloudflare (Rules → Redirect Rules) before public ` +
        'pages are served as files, or those hosts would serve copies of them. See README, "Cloudflare Workers".',
    );
  }
}

/**
 * The preview URL of the version `wrangler versions upload` (behind
 * `opennextjs-cloudflare upload`) just made, from what it printed:
 * "Version Preview URL: https://<id>-examer.<subdomain>.workers.dev". Null
 * when the Worker has preview URLs off, or the upload printed none.
 */
export function previewUrlFrom(output: string): string | null {
  // Strip colour codes before matching.
  const plain = output.replace(/\u001b\[[0-9;]*m/g, '');
  const match = /Version Preview URL:\s*(https:\/\/[^\s]+\.workers\.dev)\b/i.exec(plain);
  return match ? match[1].replace(/\/+$/, '') : null;
}

/**
 * Writes the files into `assetsDir` and returns the paths saved. Pages are
 * fetched from `origin` (the new version's preview URL; `site` if not given),
 * while `site` is the production address the sitemap lists them under. A page
 * an earlier run saved from this build (its HTML carries the build id) is kept;
 * files without the id (robots.txt, the sitemap, icons) are always fetched.
 */
export async function snapshotPublicPages(
  options: { site: string; origin?: string; assetsDir: string; buildId: string },
  deps: FetchDeps = {},
): Promise<string[]> {
  const { site, assetsDir, buildId } = options;
  const origin = (options.origin ?? site).replace(/\/+$/, '');
  const sleep = deps.sleep ?? realSleep;
  // Only HTML carries the build id, so first wait for the new version to
  // answer there; then the sitemap and robots.txt are surely its own.
  await fetchLive(`${origin}/`, buildId, deps);
  const sitemap = (await fetchLive(`${origin}/sitemap.xml`, buildId, deps)).toString('utf8');
  if (!sitemap.includes(`<loc>${site}`)) throw new Error(`The sitemap at ${origin} does not list ${site}: is NEXT_PUBLIC_SITE_URL set?`);
  const paths = staticPagePaths(sitemapUrls(sitemap));
  if (paths.length < 10) throw new Error(`The live sitemap lists too few pages (${paths.length}): is indexing on?`);

  let kept = 0;
  for (const [index, pathname] of paths.entries()) {
    const file = path.join(assetsDir, assetFileFor(pathname));
    if (fs.existsSync(file) && fs.readFileSync(file).includes(buildId)) {
      kept += 1;
      continue;
    }
    const started = Date.now();
    const body = await fetchLive(`${origin}${pathname}`, buildId, deps);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
    const took = Date.now() - started;
    console.log(`  ${index + 1}/${paths.length} ${pathname}${took > SLOW_MS ? ` (${Math.round(took / 1000)} s)` : ''}`);
    if (index < paths.length - 1) await sleep(PAUSE_MS);
  }
  if (kept > 0) console.log(`  ${kept} pages kept from an earlier run of this build`);
  return paths;
}
