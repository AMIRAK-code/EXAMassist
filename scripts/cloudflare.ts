import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { assertHostsRedirect, snapshotPublicPages } from './snapshot-pages';

/**
 * Builds (and optionally deploys) the Cloudflare Workers site: npm run cf:build / cf:deploy.
 *
 * A deploy uploads twice: once as built, then again with the public pages of
 * that first upload saved as static files, which Cloudflare serves without
 * running the Worker (scripts/snapshot-pages.ts, src/lib/seo/static-pages.ts).
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
  if (command !== 'build' && command !== 'deploy') throw new Error('Usage: tsx scripts/cloudflare.ts build|deploy');

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
  // Next.js 15 left the Next team's two-year support window on 2026-10-21, and
  // OpenNext refuses to build it without this flag. Remove it after moving to 16.
  const stepArgs: Record<string, string[]> = { build: ['--dangerouslyUseUnsupportedNextVersion'], deploy: [] };
  const run = (step: string) => {
    const result = spawnSync(process.execPath, [cli, step, ...stepArgs[step]], { stdio: 'inherit', env });
    if (result.status !== 0) throw new Error(`opennextjs-cloudflare ${step} failed.`);
  };
  for (const step of command === 'build' ? ['build'] : ['build', 'deploy']) run(step);
  if (command !== 'deploy') return;

  // The first upload is live and renders every page. Now the public pages.
  const site = (vars.NEXT_PUBLIC_SITE_URL ?? '').replace(/\/+$/, '');
  const siteHost = new URL(site).host;
  const otherHosts = (wrangler.routes ?? []).map((route) => route.pattern).filter((host) => host !== siteHost);
  try {
    await assertHostsRedirect(site, otherHosts);
  } catch (error: unknown) {
    console.warn(`\nPublic pages NOT saved as static files; every page stays rendered by the Worker.\n${(error as Error).message}`);
    return;
  }
  const buildId = fs.readFileSync(path.join('.next', 'BUILD_ID'), 'utf8').trim();
  const saved = await snapshotPublicPages({ site, assetsDir: path.join('.open-next', 'assets'), buildId });
  console.log(`\nSaved ${saved.length} public pages as static files. Uploading them.\n`);
  run('deploy');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Cloudflare build failed.');
  process.exitCode = 1;
});
