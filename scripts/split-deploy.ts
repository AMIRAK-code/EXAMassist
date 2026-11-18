import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { assertHostsRedirect, fetchLive, snapshotPublicPages } from './snapshot-pages';
import { assertSearchReady } from './search-ready';

/**
 * Deploys uniexamer.com split across two hosts (docs/SPLIT-HOSTING.md):
 *
 *   npx tsx scripts/split-deploy.ts --vercel https://<deployment>.vercel.app --upload
 *   npx tsx scripts/split-deploy.ts --vercel https://<deployment>.vercel.app --deploy
 *
 * `--vercel` is one Vercel deployment of the commit being released (its own
 * address, not the project's production alias), so everything this release
 * serves comes from one build. VERCEL_BYPASS in the environment is Vercel's
 * Protection Bypass for Automation secret, if deployment protection is on.
 *
 * 1. Saves every public page from that deployment, the scripts and styles
 *    they load, and public/, into .router/assets: Cloudflare serves these as
 *    files, so the Worker never runs for them.
 * 2. --upload: uploads the router Worker as a version with no traffic and
 *    prints its preview address, to try the release before switching.
 *    --deploy: builds and deploys the `examer` Worker (pricing and payments),
 *    then deploys the router Worker with the pinned Vercel address, which moves
 *    visitors to the release.
 */

const SITE = 'https://uniexamer.com';
const ASSETS = path.join('.router', 'assets');
const ROUTER_CONFIG = path.join('router', 'wrangler.jsonc');
/** wrangler.jsonc without its routes, next to it so its relative paths still hold. Not committed. */
const EXAMER_SPLIT_CONFIG = 'wrangler.split.json';

function writeExamerConfigWithoutRoutes(): void {
  const config = JSON.parse(fs.readFileSync('wrangler.jsonc', 'utf8').replace(/^\s*\/\/.*$/gm, '')) as Record<string, unknown>;
  delete config.routes;
  fs.writeFileSync(EXAMER_SPLIT_CONFIG, `${JSON.stringify(config, null, 2)}\n`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const vercel = (args[args.indexOf('--vercel') + 1] ?? '').replace(/\/+$/, '');
  const mode = args.includes('--deploy') ? 'deploy' : args.includes('--upload') ? 'upload' : null;
  if (!args.includes('--vercel') || !/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(vercel) || !mode) {
    throw new Error('Usage: npx tsx scripts/split-deploy.ts --vercel https://<deployment>.vercel.app --upload|--deploy');
  }
  const bypass = process.env.VERCEL_BYPASS?.trim();
  const headers: Record<string, string> = bypass ? { 'x-vercel-protection-bypass': bypass } : {};

  // The deployment must answer, and as the site (its sitemap lists uniexamer.com).
  await fetchLive(`${vercel}/`, '', { headers });

  if (mode === 'deploy') await assertHostsRedirect(SITE, ['www.uniexamer.com', 'exam.assist365.app']);

  fs.rmSync(ASSETS, { recursive: true, force: true });
  fs.mkdirSync(ASSETS, { recursive: true });
  fs.cpSync('public', ASSETS, { recursive: true });

  console.log(`Saving the public pages of ${vercel}.`);
  // A pinned deployment always serves its own build, so there is no older build to tell apart ('').
  const pages = await snapshotPublicPages({ site: SITE, origin: vercel, assetsDir: ASSETS, buildId: '' }, { headers, pauseMs: 50 });
  const files = await saveReferencedFiles(vercel, headers);
  console.log(`Saved ${pages.length} pages and ${files} script, style and font files.`);
  assertSearchReady(ASSETS, SITE);

  if (mode === 'upload') {
    const upload = wrangler(['versions', 'upload', '-c', ROUTER_CONFIG, '--var', `VERCEL_ORIGIN:${vercel}`], true);
    const preview = /Version Preview URL:\s*(\S+)/.exec(upload)?.[1];
    console.log(preview ? `\nTry the release at ${preview} (no visitor is sent there).` : '\nUploaded; wrangler printed no preview address.');
    return;
  }

  // Build the examer Worker (pricing and payments) first, so a failed build changes nothing.
  run(process.execPath, ['node_modules/tsx/dist/cli.mjs', 'scripts/cloudflare.ts', 'build']);
  // Then the router takes the domains, in one step (wrangler moves a custom domain from another
  // Worker by itself when not run in a terminal, and asks first when it is). Meanwhile the
  // examer version already live answers pricing through the service binding.
  wrangler(['deploy', '-c', ROUTER_CONFIG, '--var', `VERCEL_ORIGIN:${vercel}`]);
  // Only now the new examer, from a copy of wrangler.jsonc without routes: wrangler.jsonc keeps
  // them, so `npm run cf:deploy` still serves the whole site from examer (the rollback). Deployed
  // the other way round, examer's new build would hold the domains without the saved pages.
  writeExamerConfigWithoutRoutes();
  run(process.execPath, ['node_modules/@opennextjs/cloudflare/dist/cli/index.js', 'deploy', '--config', EXAMER_SPLIT_CONFIG]);
  console.log(`\nuniexamer.com now serves this release: files from Cloudflare, pricing and payments from examer, the rest from ${vercel}.`);
}

/**
 * Downloads the scripts, styles and fonts the saved pages load (/_next/static/...),
 * and the fonts and images those styles load, so a page view needs no Worker
 * at all. Anything missed is still served: the router forwards it to Vercel.
 */
async function saveReferencedFiles(origin: string, headers: Record<string, string>): Promise<number> {
  const pattern = /\/_next\/static\/[^"'\s)\\<>]+/g;
  const queue = new Set<string>();
  const scan = (text: string) => {
    for (const match of text.matchAll(pattern)) queue.add(match[0].split('?')[0]);
  };
  for (const file of fs.readdirSync(ASSETS, { recursive: true, encoding: 'utf8' })) {
    if (file.endsWith('.html')) scan(fs.readFileSync(path.join(ASSETS, file), 'utf8'));
  }
  const done = new Set<string>();
  while (queue.size > 0) {
    const [next] = queue;
    queue.delete(next);
    if (done.has(next)) continue;
    done.add(next);
    const response = await fetch(`${origin}${next}`, { headers });
    if (!response.ok) {
      console.log(`  skipped ${next} (HTTP ${response.status}); the router will forward it`);
      continue;
    }
    const body = Buffer.from(await response.arrayBuffer());
    const file = path.join(ASSETS, ...decodeURIComponent(next).split('/').filter(Boolean));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
    if (next.endsWith('.css')) scan(body.toString('utf8'));
  }
  return done.size;
}

function run(command: string, args: string[]): void {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`${path.basename(args[0] ?? command)} ${args.slice(1).join(' ')} failed.`);
}

function wrangler(args: string[], capture = false): string {
  const result = spawnSync(process.execPath, ['node_modules/wrangler/bin/wrangler.js', ...args], {
    stdio: capture ? ['inherit', 'pipe', 'inherit'] : 'inherit',
    encoding: 'utf8',
  });
  if (capture) process.stdout.write(result.stdout ?? '');
  if (result.status !== 0) throw new Error(`wrangler ${args.join(' ')} failed.`);
  return result.stdout ?? '';
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
