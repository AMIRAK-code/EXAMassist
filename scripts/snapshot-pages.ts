/**
 * Saves the public pages of the live deployment as static files in the Worker's
 * assets, so Cloudflare serves them without running the Worker
 * (src/lib/seo/static-pages.ts). `npm run cf:deploy` (scripts/cloudflare.ts)
 * runs this between its two uploads:
 *
 *   1. build, and deploy the Worker as it is: every page is rendered;
 *   2. fetch each public page from that deployment, as an anonymous visitor;
 *   3. deploy again with those files among the assets.
 *
 * The pages are the new deployment's own output, so they reference exactly the
 * scripts and styles uploaded with them. They change only at the next deploy:
 * after publishing questions straight to the database, deploy again to refresh
 * the counts the pages show.
 */
import fs from 'node:fs';
import path from 'node:path';
import { sitemapUrls } from '../src/lib/seo/indexnow';
import { SNAPSHOT_HEADER, assetFileFor, staticPagePaths } from '../src/lib/seo/static-pages';

// "bot" keeps these requests out of the page-view totals (src/lib/analytics/funnel.ts).
const USER_AGENT = 'ExamerSnapshot/1.0 (deploy bot)';
// A page can fail with error 1102 on the Free plan, and the previous deployment
// can answer for a few seconds after an upload: retry for about a minute.
const ATTEMPTS = 20;
const WAIT_MS = 3000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchLive(url: string, buildId: string): Promise<Buffer> {
  let reason = '';
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    const response = await fetch(url, {
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
    if (attempt < ATTEMPTS) await sleep(WAIT_MS);
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

/** Writes the files into `assetsDir` and returns the paths saved. */
export async function snapshotPublicPages(options: { site: string; assetsDir: string; buildId: string }): Promise<string[]> {
  const { site, assetsDir, buildId } = options;
  // Only HTML carries the build id, so first wait for the new deployment to
  // answer there; then the sitemap and robots.txt are surely its own.
  await fetchLive(`${site}/`, buildId);
  const sitemap = (await fetchLive(`${site}/sitemap.xml`, buildId)).toString('utf8');
  const paths = staticPagePaths(sitemapUrls(sitemap));
  if (paths.length < 10) throw new Error(`The live sitemap lists too few pages (${paths.length}): is indexing on?`);

  for (const pathname of paths) {
    const body = await fetchLive(`${site}${pathname}`, buildId);
    const file = path.join(assetsDir, assetFileFor(pathname));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
  }
  return paths;
}
