import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { resetRateLimits } from './helpers';

/**
 * The Politecnico di Torino TIL and CISIA TOLC exams, in a real browser: their
 * sessions are built from the published structure. Needs reviewed
 * questions, so it ships with the question bank.
 */

test.beforeEach(() => resetRateLimits());

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const PAGES = [
  '/exams/politecnico-di-torino-til',
  '/exams/politecnico-di-torino-til/format',
  '/exams/cisia-tolc',
  '/exams/cisia-tolc/format',
  '/practice/polito-til-i',
  '/practice/polito-til-a',
  '/practice/tolc-e',
  '/practice/tolc-f',
];

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

test.describe('Politecnico di Torino and CISIA sessions', () => {
  test('a TIL-I diagnostic follows the published section order and never reopens a section', async ({ page }) => {
    await page.goto('/about/terms');
    const email = `newexams-${Date.now()}@example.invalid`;
    expect((await api(page, 'POST', '/api/auth/sign-up', { email, password: 'a quiet harbour at dawn' })).status).toBe(201);

    const started = await api(page, 'POST', '/api/attempts', { examKey: 'polito-til-i', blueprintId: 'diagnostic' });
    expect([200, 201], JSON.stringify(started.data)).toContain(started.status);
    const attemptId = started.data.attemptId as string;

    const state = (await api(page, 'GET', `/api/attempts/${attemptId}`)).data;
    expect(state.parts.map((p: { label: string }) => p.label)).toEqual([
      'Mathematics',
      'Reading comprehension and logic',
      'Physics',
      'Basic technical knowledge',
    ]);

    // Submitting the first section moves on to the second; the first cannot be answered again.
    expect((await api(page, 'POST', `/api/attempts/${attemptId}/submit-part`, { partIndex: 0 })).status).toBe(200);
    const late = await api(page, 'POST', `/api/attempts/${attemptId}/answer`, {
      partIndex: 0,
      position: 0,
      response: { type: 'single_select', optionId: 'a' },
    });
    expect(late.status).toBeGreaterThanOrEqual(400);

    await page.goto(`/attempt/${attemptId}`);
    await expect(page.getByRole('heading', { name: /^Question 1/ })).toBeVisible();
    await expect(page.getByRole('radio')).toHaveCount(5);
  });
});
