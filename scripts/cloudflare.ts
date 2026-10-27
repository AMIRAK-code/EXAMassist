import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Builds (and optionally deploys) the Cloudflare Workers site: npm run cf:build / cf:deploy.
 *
 * OpenNext copies .env, .env.local and .env.<mode>(.local) into the Worker bundle,
 * and those files hold local secrets and DATABASE_URL. So this refuses to run next
 * to them; build from a clean checkout instead (git worktree add). Production
 * settings live in wrangler.jsonc ("vars") and Worker secrets (SESSION_SECRET).
 */

const ENV_FILES = ['production', 'development', 'test'].flatMap((mode) => [`.env.${mode}`, `.env.${mode}.local`]);
ENV_FILES.push('.env', '.env.local');

function main(): void {
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
  const vars = (JSON.parse(jsonc) as { vars?: Record<string, string> }).vars ?? {};
  const env: NodeJS.ProcessEnv = { ...process.env, ...vars, NEXT_TELEMETRY_DISABLED: '1' };
  // `opennextjs-cloudflare deploy` reads the bindings through a local proxy, which
  // needs some local Postgres address for Hyperdrive. Nothing connects to it.
  env.CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE ??= 'postgres://examer:examer@127.0.0.1:5432/examer';

  const cli = path.join('node_modules', '@opennextjs', 'cloudflare', 'dist', 'cli', 'index.js');
  for (const step of command === 'build' ? ['build'] : ['build', 'deploy']) {
    const result = spawnSync(process.execPath, [cli, step], { stdio: 'inherit', env });
    if (result.status !== 0) throw new Error(`opennextjs-cloudflare ${step} failed.`);
  }
}

try {
  main();
} catch (error: unknown) {
  console.error(error instanceof Error ? error.message : 'Cloudflare build failed.');
  process.exitCode = 1;
}
