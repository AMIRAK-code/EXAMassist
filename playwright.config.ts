import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['json', { outputFile: 'test-results/e2e-results.json' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // Each project is a different client, as two real learners would be. The
  // test server has no proxy in front of it, so the header stands in for the
  // one a proxy would add; rate limits then apply per project, exactly as
  // they would per person, instead of the whole suite sharing one address.
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'], extraHTTPHeaders: { 'X-Forwarded-For': '192.0.2.10' } },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'], extraHTTPHeaders: { 'X-Forwarded-For': '192.0.2.20' } },
    },
  ],
  webServer: {
    // Playwright starts webServer before globalSetup, so the database is
    // prepared here rather than in a setup hook.
    command: `npx tsx scripts/reset.ts && npm run start -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      DATABASE_PATH: './tmp/e2e.db',
      SESSION_SECRET: 'e2e-session-secret-at-least-32-characters-long!!',
      NODE_ENV: 'production',
      // The AI tutor is switched on with a dummy key and pointed at a port
      // nothing listens on. Its interface renders (so it is scanned for
      // accessibility) and every call fails fast, which is exactly the
      // failure path the tests need - offline, free and deterministic. No
      // request ever reaches the real provider from the test suite.
      ANTHROPIC_API_KEY: 'e2e-dummy-key-not-a-real-credential',
      ANTHROPIC_BASE_URL: 'http://127.0.0.1:9',
      TUTOR_TIMEOUT_MS: '3000',
    },
  },
});
