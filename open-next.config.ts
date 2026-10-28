import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/*
 * Cloudflare Workers build (npm run cf:deploy).
 *
 * Every page that reads data is dynamic, so the only cached pages are the
 * ones prerendered at build time. They never revalidate, so they are served
 * read-only from the Worker's static assets rather than from an R2 bucket.
 */
export default {
  ...defineCloudflareConfig({
    incrementalCache: staticAssetsIncrementalCache,
  }),
  /*
   * Webpack, not Next 16's default Turbopack. Turbopack reaches external
   * packages (better-sqlite3) through a symlink in .next/node_modules, which
   * OpenNext recreates with fs.symlinkSync, and Windows refuses that (EPERM)
   * outside Developer Mode or an administrator shell. Webpack requires the
   * package directly, as every deploy before Next 16 did. `npm run build`
   * and `npm run dev` keep Turbopack.
   */
  buildCommand: 'npx next build --webpack',
};
