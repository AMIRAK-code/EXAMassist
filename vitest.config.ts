import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    globals: false,
    reporters: ['default'],
    // next-intl imports next/navigation without an extension, which Node's
    // ESM loader cannot resolve; bundling it through Vite lets it resolve.
    server: { deps: { inline: ['next-intl'] } },
  },
  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },
  // tsconfig keeps JSX for Next.js to compile; tests that render a component
  // need the automatic runtime instead.
  esbuild: { jsx: 'automatic' },
});
