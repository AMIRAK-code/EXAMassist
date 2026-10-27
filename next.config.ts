import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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
      // Plans moved from /premium (hosted Stripe Checkout) to /pricing and our
      // own /checkout (docs/BILLING.md). Old links keep working, query and all.
      { source: '/premium', destination: '/pricing', permanent: true },
      { source: '/premium/welcome', destination: '/account', permanent: false },
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
          // HTTPS only, for a year, on the host that sent it. No includeSubDomains
          // or preload: other subdomains of assist365.app are not this site's.
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
        ],
      },
      {
        // The interface font, fetched by Stripe's card-field iframes
        // so the Payment Element matches our own fields.
        source: '/fonts/:path*',
        headers: [
          // A public, openly licensed font file: any origin may read it.
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
