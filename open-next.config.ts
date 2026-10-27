import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/*
 * Cloudflare Workers build (npm run cf:deploy).
 *
 * Every page that reads data is dynamic, so the only cached pages are the
 * ones prerendered at build time. They never revalidate, so they are served
 * read-only from the Worker's static assets rather than from an R2 bucket.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
