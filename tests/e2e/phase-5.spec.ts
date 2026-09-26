import { expect, test, type Page } from '@playwright/test';
import { resetRateLimits, withE2eDb } from './helpers';

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

// ---------------------------------------------------------------------------
// Saving and recovery in the player
// ---------------------------------------------------------------------------

async function startSession(page: Page, examKey = 'lsat', blueprintId = 'practice'): Promise<string> {
  const result = await api(page, 'POST', '/api/attempts', { examKey, blueprintId });
  expect(result.status, JSON.stringify(result.data)).toBe(201);
  return result.data.attemptId as string;
}

/** The server's copy of one question's answer. */
async function serverAnswer(page: Page, id: string, position: number): Promise<unknown> {
  const state = (await api(page, 'GET', `/api/attempts/${id}`)).data;
  const part = state.parts[state.currentPartIndex] ?? state.parts[0];
  return part.items[position].response;
}

/** Answers the question on screen with its nth choice (or a number), and returns what was chosen. */
async function answerShown(page: Page, nth = 0): Promise<{ optionId?: string; raw?: string }> {
  const radios = page.getByRole('radio');
  if ((await radios.count()) > 0) {
    const radio = radios.nth(nth);
    await radio.check();
    const id = (await radio.getAttribute('id')) ?? '';
    return { optionId: id.slice(id.lastIndexOf('-') + 1) };
  }
  const raw = String(nth + 2);
  await page.getByLabel('Your answer').fill(raw);
  return { raw };
}

/** The player's own header, which carries the save status. */
const status = (page: Page) => page.locator('[data-focus-mode] > header');
const pendingKeys = (page: Page) =>
  page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('examer.pending.v1.')));

test.describe('saving', () => {
  test('says saved only once the server has the answer, in focus mode', async ({ page }) => {
    await asGuest(page);
    const id = await startSession(page);
    await page.goto(`/attempt/${id}`);

    // Focus mode: the site's header and footer are not shown; the control bar is.
    await expect(page.getByRole('link', { name: /home$/ })).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'Question controls' })).toBeVisible();
    await expect(status(page)).toContainText('Saves as you go');

    const [answerRequest] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith('/answer') && r.request().method() === 'POST'),
      answerShown(page, 1),
    ]);
    expect(answerRequest.status()).toBe(200);
    await expect(status(page)).toContainText('Saved');
    expect(await serverAnswer(page, id, 0)).not.toBeNull();
    expect(await pendingKeys(page)).toEqual([]);
  });

  test('keeps an answer and a move made just before a reload, and saves them after it', async ({ page }) => {
    await asGuest(page);
    const id = await startSession(page);
    await page.goto(`/attempt/${id}`);

    // Nothing reaches the server: as if the page reloaded before the requests landed.
    await page.route('**/api/attempts/*/answer', (route) => route.abort());
    await page.route('**/api/attempts/*/visit', (route) => route.abort());
    const chosen = await answerShown(page, 2);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Question 2/);
    expect(await pendingKeys(page)).toHaveLength(1);
    expect(await serverAnswer(page, id, 0)).toBeNull();

    await page.unrouteAll({ behavior: 'ignoreErrors' });
    await page.reload();

    // Reopens at the question the learner had moved to, with the answer kept.
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Question 2/);
    await expect(status(page)).toContainText('Saved');
    await expect.poll(() => serverAnswer(page, id, 0)).toMatchObject({ optionId: chosen.optionId });
    await expect.poll(async () => (await api(page, 'GET', `/api/attempts/${id}`)).data.resume?.position).toBe(1);
    await page.getByRole('button', { name: 'Previous' }).click();
    await expect(page.locator(`#q-0-${chosen.optionId}`)).toBeChecked();
    await expect.poll(() => pendingKeys(page)).toEqual([]);
  });

  test('holds answers on the device while offline, says so, and sends them on reconnecting', async ({ page, context }) => {
    await asGuest(page);
    const id = await startSession(page);
    await page.goto(`/attempt/${id}`);
    await expect(status(page)).toContainText('Saves as you go');

    await context.setOffline(true);
    const chosen = await answerShown(page, 1);
    await expect(status(page)).toContainText('Offline · 1 waiting');
    await expect(page.getByRole('button', { name: 'Question 1, answered, not yet saved' })).toBeVisible();
    await expect(page.getByText('You are offline. 1 answer not yet saved, kept on this device')).toBeAttached();
    // An untimed session says nothing about a clock.
    await expect(page.getByText('The timer keeps running')).toHaveCount(0);

    await context.setOffline(false);
    await expect(status(page)).toContainText('Saved');
    await expect(page.getByRole('button', { name: 'Question 1, answered', exact: true })).toBeVisible();
    await expect.poll(() => serverAnswer(page, id, 0)).toMatchObject({ optionId: chosen.optionId });
  });

  test('sends an answer kept on the device when the session is reopened after the tab was closed offline', async ({ page, context }) => {
    await asGuest(page);
    const id = await startSession(page);
    await page.goto(`/attempt/${id}`);
    await context.setOffline(true);
    const chosen = await answerShown(page, 3);
    await expect(status(page)).toContainText('Offline');
    await page.close();

    await context.setOffline(false);
    const again = await context.newPage();
    await again.goto(`/attempt/${id}`);
    await expect(again.locator(`#q-0-${chosen.optionId}`)).toBeChecked();
    // Sent either by the closing tab's last request, if it got out as the
    // connection returned, or from the device by this page: saved once either way.
    await expect.poll(() => serverAnswer(again, id, 0)).toMatchObject({ optionId: chosen.optionId });
    await expect.poll(() => pendingKeys(again)).toEqual([]);
    await expect(status(again)).not.toContainText(/Offline|not saved|Saving/);
  });

  test('does not count an answer made offline that reaches the server after time ran out', async ({ page, context }) => {
    await asGuest(page);
    const id = await startSession(page, 'digital-sat', 'timed-math-module-1');
    const soon = new Date(Date.now() + 8_000).toISOString();
    withE2eDb((db) => {
      db.prepare('UPDATE attempts SET deadline_at = CASE WHEN deadline_at IS NULL THEN NULL ELSE ? END WHERE id = ?').run(soon, id);
      db.prepare('UPDATE attempt_parts SET deadline_at = ? WHERE attempt_id = ? AND part_index = 0').run(soon, id);
    });
    await page.goto(`/attempt/${id}`);

    await context.setOffline(true);
    await answerShown(page, 1);
    await expect(page.getByText(/The timer keeps running\./).first()).toBeAttached();
    // Past the deadline and the server's short grace for requests in flight.
    await page.waitForTimeout(12_500);
    await context.setOffline(false);

    await expect(page).toHaveURL(new RegExp(`/attempt/${id}/results$`), { timeout: 30_000 });
    await expect(page.getByText(/1 answer made on this device did not reach the server before this session ended/)).toBeVisible();
    const item = withE2eDb((db) => db.prepare('SELECT response_json FROM attempt_items WHERE attempt_id = ? AND position = 0').get(id)) as {
      response_json: string | null;
    };
    expect(item.response_json).toBeNull();
    expect(await pendingKeys(page)).toEqual([]);
  });

  test('recognises a repeated request, and counts its time once', async ({ page }) => {
    await asGuest(page);
    const id = await startSession(page);
    const state = (await api(page, 'GET', `/api/attempts/${id}`)).data;
    const optionId = state.parts[0].items[0].question.options[0].id;
    const body = { partIndex: 0, position: 0, response: { type: 'single_select', optionId }, elapsedMs: 30_000, clock: Date.now() };
    const first = await api(page, 'POST', `/api/attempts/${id}/answer`, body);
    const second = await api(page, 'POST', `/api/attempts/${id}/answer`, body);
    expect(first.data).toMatchObject({ saved: true, duplicate: false });
    expect(second.data).toMatchObject({ saved: true, duplicate: true });
    const row = withE2eDb((db) => db.prepare('SELECT time_ms FROM attempt_items WHERE attempt_id = ? AND position = 0').get(id)) as {
      time_ms: number;
    };
    expect(row.time_ms).toBe(30_000);
  });

  test('never lets an older answer from another device replace a newer one', async ({ page, browser }) => {
    await asGuest(page);
    const id = await startSession(page);
    await page.goto(`/attempt/${id}`);

    // A second device, signed in to the same account.
    const other = await browser.newContext();
    await other.addCookies(await page.context().cookies());
    const second = await other.newPage();
    await second.goto(`/attempt/${id}`);

    // This device changes the answer offline; the other changes it later, online.
    await page.context().setOffline(true);
    await answerShown(page, 1);
    await expect(status(page)).toContainText('Offline');
    const newer = await answerShown(second, 2);
    await expect(status(second)).toContainText('Saved');

    await page.context().setOffline(false);
    await expect(page.getByText(/answered again in another tab or on another device/)).toBeVisible();
    await expect(page.locator(`#q-0-${newer.optionId}`)).toBeChecked();
    await expect.poll(() => serverAnswer(page, id, 0)).toMatchObject({ optionId: newer.optionId });
    await other.close();
  });

  test('never changes a checked answer, whichever device sends the change', async ({ page, browser }) => {
    await asGuest(page);
    const id = await startSession(page);
    await page.goto(`/attempt/${id}`);
    const other = await browser.newContext();
    await other.addCookies(await page.context().cookies());
    const second = await other.newPage();
    await second.goto(`/attempt/${id}`);

    await page.context().setOffline(true);
    await answerShown(page, 1);
    const checked = await answerShown(second, 2);
    await second.getByRole('button', { name: 'Check answer' }).click();
    await expect(second.getByText('Answer locked')).toBeVisible();

    await page.context().setOffline(false);
    await expect(page.getByText(/checked in another tab or on another device/)).toBeVisible();
    await expect(page.getByText('Answer locked')).toBeVisible();
    await expect(page.locator(`#q-0-${checked.optionId}`)).toBeChecked();
    await expect.poll(() => serverAnswer(page, id, 0)).toMatchObject({ optionId: checked.optionId });
    await other.close();
  });

  test('sends nothing into a session submitted elsewhere, and says what was not saved', async ({ page, browser }) => {
    await asGuest(page);
    const id = await startSession(page);
    await page.goto(`/attempt/${id}`);

    await page.context().setOffline(true);
    await answerShown(page, 1);
    await expect(status(page)).toContainText('Offline');

    // Submitted from another device while this one is offline.
    const other = await browser.newContext();
    await other.addCookies(await page.context().cookies());
    const second = await other.newPage();
    await second.goto('/about/terms');
    expect((await api(second, 'POST', `/api/attempts/${id}/submit`)).status).toBe(200);
    await other.close();

    const answers: number[] = [];
    page.on('response', (r) => {
      if (r.url().endsWith('/answer')) answers.push(r.status());
    });
    await page.context().setOffline(false);
    await expect(page).toHaveURL(new RegExp(`/attempt/${id}/results$`), { timeout: 30_000 });
    await expect(page.getByText(/1 answer made on this device did not reach the server/)).toBeVisible();
    // One refused request, then nothing more.
    expect(answers).toEqual([409]);
    const item = withE2eDb((db) => db.prepare('SELECT response_json FROM attempt_items WHERE attempt_id = ? AND position = 0').get(id)) as {
      response_json: string | null;
    };
    expect(item.response_json).toBeNull();
  });

  test('never shows or keeps one account’s waiting answers under another account', async ({ page, context }) => {
    await asGuest(page);
    const first = await startSession(page);
    await page.goto(`/attempt/${first}`);
    await page.route('**/api/attempts/*/answer', (route) => route.abort());
    const chosen = await answerShown(page, 1);
    await expect(status(page)).toContainText('Offline');
    expect(await pendingKeys(page)).toHaveLength(1);

    // Another learner signs in on the same device before anything was sent.
    await context.clearCookies();
    await asGuest(page);
    const own = await startSession(page);
    await page.goto(`/attempt/${own}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Question 1/);
    // The first learner's record is gone from the device, and nothing of it shows here.
    await expect.poll(() => pendingKeys(page)).toEqual([]);
    await expect(page.locator(`#q-0-${chosen.optionId}`)).not.toBeChecked();
    // Their session does not exist for this account.
    expect((await page.goto(`/attempt/${first}`))?.status()).toBe(404);
  });

  test('asks the browser to clear waiting answers on signing out', async ({ page }) => {
    await asGuest(page);
    // The raw response, as the browser receives it (a page script cannot read this header).
    const response = await page.request.post('/api/auth/sign-out', { headers: { 'X-Requested-With': 'examer' } });
    expect(response.status()).toBe(200);
    expect(response.headers()['clear-site-data']).toBe('"storage"');
  });
});

// ---------------------------------------------------------------------------
// The player's layout, and practice setup
// ---------------------------------------------------------------------------

test.describe('player layout', () => {
  test('keeps the controls in place when the explanation appears', async ({ page }) => {
    await asGuest(page);
    const id = await startSession(page);
    await page.goto(`/attempt/${id}`);
    const controls = page.getByRole('navigation', { name: 'Question controls' });
    await answerShown(page, 0);
    const before = await controls.boundingBox();
    await page.getByRole('button', { name: 'Check answer' }).click();
    await expect(page.getByText(/^(Correct|Not correct)/)).toBeVisible();
    const after = await controls.boundingBox();
    expect(after?.y).toBe(before?.y);
    // The bar sits at the bottom of the viewport.
    const viewport = page.viewportSize()!;
    expect(Math.round((after?.y ?? 0) + (after?.height ?? 0))).toBe(viewport.height);
  });

  test('shows a passage beside its question on a wide screen, and above it on a narrow one', async ({ page }) => {
    await asGuest(page);
    // LSAT reading comprehension questions come with a passage.
    const id = await startSession(page);
    const state = (await api(page, 'GET', `/api/attempts/${id}`)).data;
    const withPassage = state.parts[0].items.findIndex((item: any) => item.question.stimulus);
    test.skip(withPassage < 0, 'this session drew no question with a passage');
    if (withPassage > 0) await api(page, 'POST', `/api/attempts/${id}/visit`, { partIndex: 0, position: withPassage, clock: Date.now() });
    await page.goto(`/attempt/${id}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(new RegExp(`Question ${withPassage + 1}`));

    const passage = page.locator('[data-focus-mode] section[aria-label]').first();
    const question = page.locator('article[aria-labelledby="question-heading"]');
    const [p, q] = [await passage.boundingBox(), await question.boundingBox()];
    if ((page.viewportSize()?.width ?? 0) >= 1024) {
      expect(q!.x).toBeGreaterThan(p!.x + p!.width - 1);
      expect(Math.abs(q!.y - p!.y)).toBeLessThan(40);
    } else {
      expect(q!.y).toBeGreaterThan(p!.y + p!.height - 1);
    }
    // Passages and questions are set in the reading serif; the heading is not.
    const fonts = await page.evaluate(() => ({
      passage: getComputedStyle(document.querySelector('[data-focus-mode] section[aria-label] .prose-academic')!).fontFamily,
      heading: getComputedStyle(document.querySelector('#question-heading')!).fontFamily,
    }));
    expect(fonts.passage).toMatch(/Charter|Palatino|Georgia|serif/);
    expect(fonts.heading).not.toMatch(/Palatino|Georgia/);
  });
});
