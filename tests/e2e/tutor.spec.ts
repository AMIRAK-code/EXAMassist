import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * The optional AI tutor, in a real browser.
 *
 * The test server runs the tutor with a dummy key pointed at a port nothing
 * listens on (see playwright.config.ts), so no request reaches a real model.
 * That makes these tests about the things that must hold whatever the model
 * does: the tutor appears only where it is allowed, it fails gracefully, and
 * core practice works regardless.
 */

async function startLearningSession(page: Page): Promise<string> {
  await page.goto('/practice/digital-sat');
  await page.getByRole('button', { name: /start practising/i }).click();
  await page.waitForURL(/\/attempt\/[0-9a-f-]+$/);
  return /\/attempt\/([0-9a-f-]+)/.exec(page.url())![1];
}

async function answerCurrentQuestion(page: Page): Promise<void> {
  const radio = page.getByRole('radio').first();
  const checkbox = page.getByRole('checkbox').first();
  if (await radio.count()) await radio.check();
  else if (await checkbox.count()) await checkbox.check();
  else await page.getByRole('textbox').first().fill('12');
  await expect(page.getByText('1 of 10 answered')).toBeVisible();
}

test.describe('the AI tutor', () => {
  test('offers a hint in a learning session and fails gracefully when the model is unreachable', async ({ page }) => {
    await startLearningSession(page);

    const hint = page.getByRole('button', { name: 'Get a hint' });
    await expect(hint).toBeVisible();
    await hint.click();

    // The failure is reported plainly, in words a learner can act on...
    await expect(page.getByText(/The AI tutor could not be reached/)).toBeVisible();

    // ...and nothing about practising is affected.
    await answerCurrentQuestion(page);
    await expect(page.getByRole('button', { name: 'Get a hint' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Explain this in more depth' })).toBeVisible();
  });

  test('never appears in a timed section', async ({ page }) => {
    // A learning session first, which also gives this browser a guest session.
    await startLearningSession(page);
    const started = await page.evaluate(async () => {
      const response = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
        body: JSON.stringify({ examKey: 'digital-sat', blueprintId: 'timed-math-module-1' }),
      });
      return { status: response.status, body: (await response.json()) as { attemptId?: string } };
    });
    expect([200, 201]).toContain(started.status);

    await page.goto(`/attempt/${started.body.attemptId}`);
    await expect(page.getByRole('heading', { name: /^Question 1/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /hint|explain this/i })).toHaveCount(0);

    // And the server refuses even if the button were forged.
    const forged = await page.evaluate(async (attemptId) => {
      const response = await fetch('/api/tutor/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
        body: JSON.stringify({ attemptId, partIndex: 0, position: 0, kind: 'hint' }),
      });
      return response.status;
    }, started.body.attemptId);
    expect(forged).toBe(403);
  });

  test('is labelled, and its controls pass an automated accessibility scan', async ({ page }) => {
    await startLearningSession(page);
    await expect(page.getByRole('button', { name: 'Get a hint' })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`)).toEqual([]);
  });
});
