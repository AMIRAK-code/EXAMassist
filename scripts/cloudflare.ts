import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { assertHostsRedirect, previewUrlFrom, snapshotPublicPages } from './snapshot-pages';

/**
 * Builds (and optionally deploys) the Cloudflare Workers site: npm run cf:build / cf:deploy.
 *
 * A deploy uploads twice. First the build becomes a new version that gets no
 * traffic, and its public pages are saved from that version's preview URL as
 * static files, which Cloudflare serves without running the Worker
 * (scripts/snapshot-pages.ts, src/lib/seo/static-pages.ts). Then the build is
 * deployed with those files, and only that moves visitors over. On the Workers
 * Free plan a page the Worker has to render can fail with error 1102 (CPU
 * limit), so visitors must never get a version whose pages are not files yet:
 * if anything fails before the final deploy, visitors stay on the current
 * version, and npm run cf:snapshot carries on from the same folder and build.
 *
 * Preview URLs must be on for the Worker ("preview_urls" in wrangler.jsonc).
 *
 * OpenNext copies .env, .env.local and .env.<mode>(.local) into the Worker bundle,
 * and those files hold local secrets and DATABASE_URL. So this refuses to run next
 * to them; build from a clean checkout instead (git worktree add). Production
 * settings live in wrangler.jsonc ("vars") and Worker secrets (SESSION_SECRET).
 */

const ENV_FILES = ['production', 'development', 'test'].flatMap((mode) => [`.env.${mode}`, `.env.${mode}.local`]);
ENV_FILES.push('.env', '.env.local');

async function main(): Promise<void> {
  const command = process.argv[2];
  if (command !== 'build' && command !== 'deploy' && command !== 'snapshot') {
    throw new Error('Usage: tsx scripts/cloudflare.ts build|deploy|snapshot');
  }

  const found = ENV_FILES.filter((file) => fs.existsSync(path.join(process.cwd(), file)));
  if (found.length > 0) {
    throw new Error(
      `Refusing to build: OpenNext would copy ${found.join(', ')} into the Worker. ` +
        'Build from a clean checkout, for example: git worktree add ../examer-cf HEAD',
    );
  }

  // NEXT_PUBLIC_* values are inlined at build time, and prerendered pages read the
  // rest, so the build sees the same public settings the Worker gets at runtime.
  const jsonc = fs.readFileSync('wrangler.jsonc', 'utf8').replace(/^\s*\/\/.*$/gm, '');
  const wrangler = JSON.parse(jsonc) as { vars?: Record<string, string>; routes?: Array<{ pattern: string }> };
  const vars = wrangler.vars ?? {};
  const env: NodeJS.ProcessEnv = { ...process.env, ...vars, NEXT_TELEMETRY_DISABLED: '1' };
  // `opennextjs-cloudflare deploy` reads the bindings through a local proxy, which
  // needs some local Postgres address for Hyperdrive. Nothing connects to it.
  env.CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE ??= 'postgres://examer:examer@127.0.0.1:5432/examer';

  const cli = path.join('node_modules', '@opennextjs', 'cloudflare', 'dist', 'cli', 'index.js');
  const run = (step: string) => {
    const result = spawnSync(process.execPath, [cli, step], { stdio: 'inherit', env });
    if (result.status !== 0) throw new Error(`opennextjs-cloudflare ${step} failed.`);
  };
  const previewFile = path.join('.open-next', 'preview-url.txt');
  const stillLive = 'Visitors are still on the current version; nothing was deployed.';

  let preview: string;
  if (command === 'snapshot') {
    if (!fs.existsSync(path.join('.next', 'BUILD_ID')) || !fs.existsSync(previewFile)) {
      throw new Error('No uploaded build here to snapshot: run npm run cf:deploy.');
    }
    preview = fs.readFileSync(previewFile, 'utf8').trim();
  } else {
    run('build');
    if (command === 'build') return;
    // A new version, with no traffic: `wrangler versions upload` under OpenNext.
    const upload = spawnSync(process.execPath, [cli, 'upload'], { env, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['inherit', 'pipe', 'pipe'] });
    process.stdout.write(upload.stdout ?? '');
    process.stderr.write(upload.stderr ?? '');
    if (upload.status !== 0) throw new Error(`opennextjs-cloudflare upload failed. ${stillLive}`);
    const found = previewUrlFrom(`${upload.stdout}\n${upload.stderr}`);
    if (!found) {
      throw new Error(`The upload printed no preview URL: are preview URLs on ("preview_urls" in wrangler.jsonc)? ${stillLive}`);
    }
    preview = found;
    fs.writeFileSync(previewFile, preview);
  }

  // Save the public pages from the new version, which nobody is sent to yet.
  const site = (vars.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/+$/, '');
  const siteHost = new URL(site).host;
  const otherHosts = (wrangler.routes ?? []).map((route) => route.pattern).filter((host) => host !== siteHost);
  try {
    await assertHostsRedirect(site, otherHosts);
  } catch (error: unknown) {
    throw new Error(`${(error as Error).message}\n${stillLive}`);
  }
  const buildId = fs.readFileSync(path.join('.next', 'BUILD_ID'), 'utf8').trim();
  console.log(`\nSaving the public pages of build ${buildId} from ${preview} as static files.`);
  const saved = await snapshotPublicPages({ site, origin: preview, assetsDir: path.join('.open-next', 'assets'), buildId }).catch((error: unknown) => {
    throw new Error(`${(error as Error).message}\n${stillLive} Run npm run cf:snapshot in this folder to carry on.`);
  });
  console.log(`\nSaved ${saved.length} public pages as static files. Deploying them.\n`);
  run('deploy');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Cloudflare build failed.');
  process.exitCode = 1;
});
