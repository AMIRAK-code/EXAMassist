import { expect, test, type Page } from '@playwright/test';
import { resetRateLimits } from './helpers';

/**
 * Phase 5 in a real browser against a real server: the notebook's pages, the
 * player's saving and recovery, and practice setup.
 */

test.beforeEach(() => resetRateLimits());

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

async function asGuest(page: Page): Promise<void> {
  await page.goto('/about/terms');
  expect((await api(page, 'POST', '/api/auth/guest')).status).toBeLessThan(300);
}

/** Sessions submitted with nothing answered, across three exams: well over one notebook page of mistakes. */
async function manyMistakes(page: Page): Promise<void> {
  for (const examKey of ['digital-sat', 'digital-sat', 'digital-sat', 'gmat', 'gmat', 'gre', 'gre']) {
    const started = await api(page, 'POST', '/api/attempts', { examKey, blueprintId: 'practice' });
    expect(started.status).toBe(201);
    expect((await api(page, 'POST', `/api/attempts/${started.data.attemptId}/submit`)).status).toBe(200);
  }
}

const entryLinks = (page: Page) =>
  page.getByRole('link', { name: 'Review answer and explanation' }).evaluateAll((links) => links.map((link) => link.getAttribute('href')));

test.describe('notebook pages', () => {
  test('reach every mistake once, keep the view, and work from the keyboard', async ({ page }) => {
    await asGuest(page);
    await manyMistakes(page);

    await page.goto('/review?filter=all');
    const pages = page.getByRole('navigation', { name: 'Notebook pages' });
    await expect(pages).toBeVisible();
    const summary = await pages.getByText(/^Showing 1–40 of \d+$/).textContent();
    const total = Number(summary!.match(/of (\d+)$/)![1]);
    expect(total).toBeGreaterThan(40);
    await expect(pages.getByRole('link', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');

    const seen: string[] = [];
    let page_ = 1;
    for (;;) {
      seen.push(...((await entryLinks(page)) as string[]));
      const next = pages.getByRole('link', { name: 'Next page' });
      if ((await next.count()) === 0) break;
      await next.focus();
      await page.keyboard.press('Enter');
      page_ += 1;
      await expect(page).toHaveURL(new RegExp(`/review\\?filter=all&page=${page_}$`));
      await expect(pages.getByRole('link', { name: `Page ${page_}` })).toHaveAttribute('aria-current', 'page');
      await expect(page).toHaveTitle(new RegExp(`Mistake notebook, page ${page_}`));
    }
    expect(seen).toHaveLength(total);
    expect(new Set(seen).size).toBe(total);

    // Back to page 2: the same entries as before, in the same order.
    await pages.getByRole('link', { name: 'Page 2' }).click();
    expect(await entryLinks(page)).toEqual(seen.slice(40, 80));

    // A bookmark from page 2 comes back to page 2.
    await page.getByRole('button', { name: 'Bookmark', exact: true }).first().click();
    await expect(page).toHaveURL(/\/review\?filter=all&page=2/);

    // Changing view starts that view at its first page.
    await page.getByRole('link', { name: /^Bookmarked/ }).click();
    await expect(page).toHaveURL(/\/review\?filter=bookmarked$/);

    // A page past the end opens the last page.
    const last = Math.ceil(total / 40);
    await page.goto('/review?filter=all&page=99');
    await expect(page).toHaveURL(new RegExp(`/review\\?filter=all&page=${last}$`));
  });

  test('never show another learner’s mistakes, on any page', async ({ page, browser }) => {
    await asGuest(page);
    await manyMistakes(page);

    const other = await browser.newContext();
    const otherPage = await other.newPage();
    await asGuest(otherPage);
    await otherPage.goto('/review?filter=all&page=2');
    await expect(otherPage).toHaveURL(/\/review\?filter=all$/);
    await expect(otherPage.getByRole('heading', { name: 'No mistakes yet' })).toBeVisible();
    await expect(otherPage.getByRole('navigation', { name: 'Notebook pages' })).toHaveCount(0);
    await other.close();
  });
});
