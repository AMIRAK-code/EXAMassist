import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
    globals: false,
    reporters: ['default'],
  },
  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },
  // tsconfig keeps JSX for Next.js to compile; tests that render a component
  // need the automatic runtime instead.
  esbuild: { jsx: 'automatic' },
});
