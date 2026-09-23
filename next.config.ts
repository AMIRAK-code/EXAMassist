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
