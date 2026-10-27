import type { NextConfig } from 'next';

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

export default nextConfig;
