import type { NextConfig } from 'next';

/*
 * The site moved from exam.assist365.app to uniexamer.com on 27 October 2026,
 * and the apex is the one address it uses. The Worker still answers for these
 * hosts (wrangler.jsonc) only to send each request to the same path on the
 * apex, so old links, bookmarks and search results keep working. A 301 rather
 * than Next's default 308, because that is the code Search Console's Change of
 * Address tool looks for.
 */
const CANONICAL_ORIGIN = 'https://uniexamer.com';
const REDIRECTED_HOSTS = ['exam.assist365.app', 'www.uniexamer.com'];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // better-sqlite3 is a native module: never bundle it into the server build.
  serverExternalPackages: ['better-sqlite3'],
  poweredByHeader: false,
  /*
   * Pin the workspace root to this project.
   *
   * Next.js infers the root from the nearest lockfile, and an unrelated
   * package-lock.json further up the tree (for example in the user's home
   * directory) makes it choose that instead, which breaks output file tracing.
   */
  outputFileTracingRoot: process.cwd(),
  /*
   * Readiness is now a view of the study plan (docs/REDESIGN.md §18). Old
   * links and bookmarks keep working: a permanent redirect, which carries the
   * query string (?exam=) across unchanged.
   */
  async redirects() {
    return [
      // The home page needs its own rule: on Cloudflare, OpenNext uses the
      // destination verbatim when a match has no parameters, so `/` against
      // `/:path*` would redirect to the literal ".../:path*".
      ...REDIRECTED_HOSTS.flatMap((host) =>
        ['/', '/:path*'].map((source) => ({
          source,
          has: [{ type: 'host' as const, value: host }],
          destination: `${CANONICAL_ORIGIN}${source}`,
          statusCode: 301 as const,
        })),
      ),
      { source: '/readiness', destination: '/study-plan/progress', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
