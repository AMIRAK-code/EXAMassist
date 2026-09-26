import { randomUUID } from 'node:crypto';
import { expect, test, type Page } from '@playwright/test';
import { resetRateLimits, withE2eDb } from './helpers';

/**
 * Phase 4: results, a question reviewed on its own page, the mistake
 * notebook, labels, retries and new-question practice, in a real browser
 * against a real server. States a browser cannot reach in reasonable time (a
 * question coming due, a correction being published) are set in the
 * disposable e2e database and then exercised through the UI.
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

/**
 * A finished 10-question SAT practice session: the first seven answered with
 * whatever the first option or a small number is, the last three left blank,
 * so there are always at least three mistakes.
 */
async function finishedSession(page: Page): Promise<string> {
  await page.goto('/about/terms');
  expect((await api(page, 'POST', '/api/auth/guest')).status).toBeLessThan(300);
  const started = await api(page, 'POST', '/api/attempts', { examKey: 'digital-sat', blueprintId: 'practice' });
  expect(started.status).toBe(201);
  const id = started.data.attemptId as string;
  const state = (await api(page, 'GET', `/api/attempts/${id}`)).data;
  for (const item of state.parts[0].items.slice(0, 7)) {
    const q = item.question;
    const response =
      q.responseType === 'single_select'
        ? { type: 'single_select', optionId: q.options[0].id }
        : q.responseType === 'multi_select'
          ? { type: 'multi_select', optionIds: [q.options[0].id] }
          : q.responseType === 'numeric_entry'
            ? { type: 'numeric_entry', raw: '1' }
            : null;
    if (response) await api(page, 'POST', `/api/attempts/${id}/answer`, { partIndex: 0, position: item.position, response });
  }
  expect((await api(page, 'POST', `/api/attempts/${id}/submit`)).status).toBe(200);
  return id;
}

const verdict = (page: Page) => page.getByText(/ of 10 correct$/);

test.describe('results', () => {
  test('lead with the outcome and evidence, and review each question on its own page', async ({ page }) => {
    const id = await finishedSession(page);
    const response = await page.goto(`/attempt/${id}/results`);
    expect(response?.headers()['cache-control']).toMatch(/private/);
    expect(response?.headers()['cache-control']).toMatch(/no-store/);

    await expect(verdict(page)).toBeVisible();
    await expect(page.getByRole('list', { name: 'Counts' })).toContainText('left blank');
    await expect(page.getByRole('heading', { name: 'Where you lost marks' })).toBeVisible();
    await expect(page.getByText(/too few to judge/).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /^Review question \d+$/ })).toHaveCount(10);
    // Explanations are on the question pages, not here.
    await expect(page.getByRole('heading', { name: 'Worked explanation' })).toHaveCount(0);
    await expect(page.getByText(/what we do not provide/i)).toBeVisible();

    await page.getByRole('link', { name: 'Review your first mistake' }).click();
    await expect(page).toHaveURL(new RegExp(`/attempt/${id}/results/\\d+$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Question \d+ of 10$/);
    await expect(page.getByText('Your answer', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Correct answer', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Worked explanation' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Questions in this session' })).toBeVisible();
  });

  test('a learner can label a mistake, with the keyboard, and change it later', async ({ page }) => {
    const id = await finishedSession(page);
    await page.goto(`/attempt/${id}/results/10`); // left blank, so always a mistake
    const misread = page.getByRole('checkbox', { name: 'I misread the question' });
    await misread.focus();
    await page.keyboard.press('Space');
    await page.getByRole('checkbox', { name: 'I guessed' }).check();
    await page.getByRole('button', { name: 'Save labels' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Labels saved' })).toBeVisible();
    await expect(misread).toBeChecked();

    await page.getByRole('checkbox', { name: 'I guessed' }).uncheck();
    await page.getByRole('button', { name: 'Save labels' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Labels saved' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'I guessed' })).not.toBeChecked();

    await page.goto(`/attempt/${id}/results`);
    await expect(page.getByRole('list').filter({ hasText: 'I misread the question' })).toHaveCount(1);
  });

  test('a retry is a separate session that leaves the original result as it was', async ({ page }) => {
    const id = await finishedSession(page);
    await page.goto(`/attempt/${id}/results`);
    const before = await verdict(page).innerText();

    await page.goto(`/attempt/${id}/results/10`);
    await page.getByRole('button', { name: 'Retry this question' }).click();
    await page.waitForURL(/\/attempt\/[0-9a-f-]+$/);
    const retryId = /\/attempt\/([0-9a-f-]+)$/.exec(page.url())![1];
    expect(retryId).not.toBe(id);
    await expect(page.getByText(/Retry of questions you missed/).first()).toBeVisible();
    expect((await api(page, 'POST', `/api/attempts/${retryId}/submit`)).status).toBe(200);

    await page.goto(`/attempt/${retryId}/results`);
    await expect(page.getByText('A retry of questions you had missed')).toBeVisible();
    await page.getByRole('link', { name: 'See the original session' }).click();
    await expect(page).toHaveURL(new RegExp(`/attempt/${id}/results$`));
    expect(await verdict(page).innerText()).toBe(before);
  });

  test('new-question practice uses only questions the learner has never been shown', async ({ page }) => {
    const id = await finishedSession(page);
    await page.goto(`/attempt/${id}/results`);
    const start = page.getByRole('button', { name: /^\d+ new .+ questions?$/ }).first();
    test.skip((await start.count()) === 0, 'every question in the weakest skill has already been shown');
    await start.click();
    await page.waitForURL(/\/attempt\/[0-9a-f-]+$/);
    const practiceId = /\/attempt\/([0-9a-f-]+)$/.exec(page.url())![1];
    const repeated = withE2eDb(
      (db) =>
        db
          .prepare(
            `SELECT COUNT(*) AS n FROM attempt_items ai WHERE ai.attempt_id = ? AND ai.question_id IN (
               SELECT x.question_id FROM attempt_items x JOIN attempts a ON a.id = x.attempt_id
                WHERE a.user_id = (SELECT user_id FROM attempts WHERE id = ?) AND a.id <> ? AND x.first_seen_at IS NOT NULL)`,
          )
          .get(practiceId, practiceId, practiceId) as { n: number },
    );
    expect(repeated.n).toBe(0);
  });

  test('a corrected or withdrawn question says so, and a withdrawn one is not offered again', async ({ page }) => {
    const id = await finishedSession(page);
    const questionId = withE2eDb((db) => {
      const row = db.prepare('SELECT question_id AS q FROM attempt_items WHERE attempt_id = ? AND position = 9').get(id) as { q: string };
      const current = db.prepare('SELECT * FROM question_versions WHERE question_id = ? ORDER BY version DESC LIMIT 1').get(row.q) as Record<string, unknown>;
      const columns = Object.keys(current);
      db.prepare(`INSERT INTO question_versions (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`).run(
        ...columns.map((column) => (column === 'id' ? randomUUID() : column === 'version' ? Number(current.version) + 1 : current[column])),
      );
      db.prepare('UPDATE questions SET current_version = current_version + 1 WHERE id = ?').run(row.q);
      return row.q;
    });
    await page.goto(`/attempt/${id}/results/10`);
    await expect(page.getByText('Corrected since you answered it')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Retry this question' })).toBeVisible();

    withE2eDb((db) => db.prepare("UPDATE questions SET state = 'quarantined' WHERE id = ?").run(questionId));
    try {
      await page.reload();
      await expect(page.getByText('Being revised')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Retry this question' })).toHaveCount(0);
    } finally {
      // The e2e database is shared by the rest of the run.
      withE2eDb((db) => {
        db.prepare("UPDATE questions SET state = 'published', current_version = current_version - 1 WHERE id = ?").run(questionId);
        db.prepare('DELETE FROM question_versions WHERE question_id = ? AND version > (SELECT current_version FROM questions WHERE id = ?)').run(questionId, questionId);
      });
    }
  });

  test('another learner cannot open this session’s results or its questions', async ({ page, browser }) => {
    const id = await finishedSession(page);
    const other = await browser.newContext();
    const otherPage = await other.newPage();
    await otherPage.goto('/about/terms');
    await api(otherPage, 'POST', '/api/auth/guest');
    expect((await otherPage.goto(`/attempt/${id}/results`))?.status()).toBe(404);
    expect((await otherPage.goto(`/attempt/${id}/results/1`))?.status()).toBe(404);
    await other.close();
  });
});

test.describe('the mistake notebook', () => {
  test('keeps what is due now apart from what comes back later', async ({ page }) => {
    const id = await finishedSession(page);

    // Just finished: every miss comes back tomorrow, so nothing is due yet.
    const response = await page.goto('/review');
    expect(response?.headers()['cache-control']).toMatch(/no-store/);
    await expect(page.getByRole('heading', { name: 'Nothing is due right now' })).toBeVisible();
    await page.getByRole('link', { name: 'See what comes back later' }).click();
    await expect(page).toHaveURL(/filter=later/);
    const later = page.getByRole('listitem').filter({ has: page.getByRole('link', { name: 'Review answer and explanation' }) });
    await expect(later.first()).toBeVisible();
    const laterCount = await later.count();
    expect(laterCount).toBeGreaterThanOrEqual(3);

    // One of them comes due.
    withE2eDb((db) =>
      db
        .prepare(
          `UPDATE review_queue SET due_at = ? WHERE user_id = (SELECT user_id FROM attempts WHERE id = ?)
             AND question_id = (SELECT question_id FROM attempt_items WHERE attempt_id = ? AND position = 9)`,
        )
        .run(new Date(Date.now() - 60_000).toISOString(), id, id),
    );
    await page.goto('/review');
    const due = page.getByRole('listitem').filter({ has: page.getByRole('link', { name: 'Review answer and explanation' }) });
    await expect(due).toHaveCount(1);
    await expect(due.first().getByText('Due now')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Notebook views' }).getByRole('link', { name: /Coming back later/ })).toContainText(String(laterCount - 1));

    await due.first().getByRole('link', { name: 'Review answer and explanation' }).click();
    await expect(page).toHaveURL(new RegExp(`/attempt/${id}/results/10$`));
    await expect(page.getByRole('heading', { name: 'Worked explanation' })).toBeVisible();
  });

  test('retries the questions in view as a separate session', async ({ page }) => {
    await finishedSession(page);
    await page.goto('/review?filter=all');
    await page.getByRole('button', { name: /^Retry \d+ questions?$/ }).click();
    await page.waitForURL(/\/attempt\/[0-9a-f-]+$/);
    await expect(page.getByText(/Retry of questions you missed/).first()).toBeVisible();
  });
});
