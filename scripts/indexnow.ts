/**
 * Submits every URL in the live sitemap to IndexNow (src/lib/seo/indexnow.ts).
 * Run it after a deploy that adds or changes public pages:
 *
 *   npm run seo:indexnow               submit
 *   npm run seo:indexnow -- --dry-run  list what would be submitted
 *
 * The site address is NEXT_PUBLIC_SITE_URL from wrangler.jsonc, the same value
 * the Worker is built with. It checks the key file is live first, because the
 * engines reject a submission whose key they cannot fetch.
 */
import fs from 'node:fs';
import { INDEXNOW_ENDPOINT, INDEXNOW_KEY, indexNowPayload, sitemapUrls } from '../src/lib/seo/indexnow';

function productionSiteUrl(): string {
  const jsonc = fs.readFileSync('wrangler.jsonc', 'utf8').replace(/^\s*\/\/.*$/gm, '');
  const url = (JSON.parse(jsonc) as { vars?: Record<string, string> }).vars?.NEXT_PUBLIC_SITE_URL;
  if (!url) throw new Error('wrangler.jsonc has no NEXT_PUBLIC_SITE_URL.');
  return url.replace(/\/+$/, '');
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const site = productionSiteUrl();

  const sitemap = await fetch(`${site}/sitemap.xml`);
  if (!sitemap.ok) throw new Error(`${site}/sitemap.xml answered ${sitemap.status}.`);
  const payload = indexNowPayload(site, sitemapUrls(await sitemap.text()));
  if (payload.urlList.length === 0) {
    throw new Error('The sitemap is empty: is SEARCH_INDEXING_ENABLED "true" on this deployment?');
  }

  const keyFile = await fetch(payload.keyLocation);
  const served = keyFile.ok ? (await keyFile.text()).trim() : '';
  if (served !== INDEXNOW_KEY) {
    throw new Error(`${payload.keyLocation} does not serve the key (HTTP ${keyFile.status}). Deploy first.`);
  }

  if (dryRun) {
    console.log(`Would submit ${payload.urlList.length} URLs for ${payload.host}:`);
    for (const url of payload.urlList) console.log(`  ${url}`);
    return;
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  // 200: accepted. 202: accepted, key check still pending. Anything else is a refusal.
  const detail = (await response.text().catch(() => '')).slice(0, 300);
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow refused the submission (HTTP ${response.status}) ${detail}`);
  }
  console.log(`IndexNow accepted ${payload.urlList.length} URLs for ${payload.host} (HTTP ${response.status}).`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
