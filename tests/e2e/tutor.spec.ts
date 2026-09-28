import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { resetRateLimits } from './helpers';

/**
 * The optional AI tutor, in a real browser.
 *
 * The test server runs the tutor with a dummy key pointed at a port nothing
 * listens on (see playwright.config.ts), so no request reaches a real model.
 * That makes these tests about the things that must hold whatever the model
 * does: the tutor appears only where it is allowed, it fails gracefully, and
 * core practice works regardless.
 */

test.beforeEach(() => resetRateLimits());

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function api(page: Page, method: string, url: string, body?: unknown): Promise<{ status: number; data: any }> {
  return page.evaluate(
    async ({ method, url, body }) => {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        /* no body */
      }
      return { status: response.status, data };
    },
    { method, url, body },
  );
}

/** A signed-in learner with one open session of the given blueprint. */
async function openSession(page: Page, blueprintId = 'practice', examKey = 'lsat'): Promise<string> {
  await page.goto('/about/terms');
  const email = `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.invalid`;
  expect((await api(page, 'POST', '/api/auth/sign-up', { email, password: 'a quiet harbour at dawn' })).status).toBe(201);
  const started = await api(page, 'POST', '/api/attempts', { examKey, blueprintId });
  expect([200, 201]).toContain(started.status);
  const attemptId = started.data.attemptId as string;
  await page.goto(`/attempt/${attemptId}`);
  await expect(page.getByRole('heading', { name: /^Question 1/ })).toBeVisible();
  return attemptId;
}

test.describe('the AI tutor', () => {
  test('offers hints until the answer is checked, fails gracefully, and never blocks practice', async ({ page }) => {
    await openSession(page);

    const hint = page.getByRole('button', { name: 'Get a hint' });
    await expect(hint).toBeVisible();
    await hint.click();

    // The failure is reported plainly, in words a learner can act on...
    await expect(page.getByText(/The AI tutor could not be reached/)).toBeVisible();

    // ...and nothing about practising is affected. Choosing an answer keeps
    // the hint on offer, because the answer can still be changed.
    await page.getByRole('radio').first().check();
    await expect(page.getByRole('button', { name: 'Get a hint' })).toBeVisible();

    // Checking the answer reveals the reviewed explanation and swaps the hint
    // for the optional deeper explanation.
    await page.getByRole('button', { name: 'Check answer' }).click();
    await expect(page.getByText(/^(Correct|Not correct)/).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get a hint' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Explain this in more depth' })).toBeVisible();
  });

  test('never appears in a timed section, and the server refuses a forged request', async ({ page }) => {
    const attemptId = await openSession(page, 'timed-math-module-1', 'digital-sat');
    await expect(page.getByRole('button', { name: /hint|explain this/i })).toHaveCount(0);

    const forged = await api(page, 'POST', '/api/tutor/help', { attemptId, partIndex: 0, position: 0, kind: 'hint' });
    expect(forged.status).toBe(403);
  });

  test('is labelled, and its controls pass an automated accessibility scan', async ({ page }) => {
    await openSession(page);
    await expect(page.getByRole('button', { name: 'Get a hint' })).toBeVisible();
    await expect(page.getByText(/Optional AI help/)).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
});
