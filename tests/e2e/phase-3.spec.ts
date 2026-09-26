import { expect, test, type Page } from '@playwright/test';
import { resetRateLimits, withE2eDb } from './helpers';

/**
 * Phase 3: resume, the dashboard and the way back in from the homepage, in a
 * real browser against a real server. Where a state cannot be reached in a
 * browser in reasonable time (a clock that has run out, a guest in the last
 * days of their session, a forward-only section the bank cannot yet fill), it
 * is set in the disposable e2e database and then exercised through the UI.
 */

test.beforeEach(() => resetRateLimits());

type ApiResult = { status: number; data: any };

async function api(page: Page, method: string, url: string, body?: unknown): Promise<ApiResult> {
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

async function becomeGuest(page: Page): Promise<void> {
  await page.goto('/about/terms');
  const result = await api(page, 'POST', '/api/auth/guest');
  expect(result.status).toBeLessThan(300);
}

async function startSession(page: Page, examKey: string, blueprintId = 'practice'): Promise<string> {
  const result = await api(page, 'POST', '/api/attempts', { examKey, blueprintId });
  expect(result.status, JSON.stringify(result.data)).toBe(201);
  return result.data.attemptId as string;
}

const heading = (page: Page) => page.getByRole('heading', { level: 1 });
const saved = (page: Page) =>
  page.waitForResponse((r) => r.url().endsWith('/visit') && r.request().method() === 'POST');

/** Bocconi's real rule: screens of three, no way back (src/lib/exams/configs/bocconi-undergraduate.ts). */
const SCREENS_OF_THREE = {
  allowBackWithinPart: false,
  pageSize: 3,
  allowForwardSkip: true,
  allowChangeAnswer: true,
  allowFlagForReview: false,
  allowReturnToPreviousPart: false,
  reviewScreen: true,
  reviewScreenEditable: false,
  bookmarkLimitPerPart: null,
  editLimitPerPart: null,
  enforcement: 'server',
};

test.describe('resume', () => {
  test('an unfinished session in each of two exams is listed, and each reopens where it was left', async ({ page }) => {
    await becomeGuest(page);
    const sat = await startSession(page, 'digital-sat');
    const gmat = await startSession(page, 'gmat');

    await page.goto(`/attempt/${sat}`);
    let save = saved(page);
    await page.getByRole('button', { name: /^Question 4,/ }).click();
    await expect(heading(page)).toHaveText(/^Question 4/);
    await save;

    await page.goto(`/attempt/${gmat}`);
    save = saved(page);
    await page.getByRole('button', { name: /^Question 2,/ }).click();
    await save;

    await page.goto('/dashboard');
    const unfinished = page.getByRole('region', { name: 'Pick up where you left off' });
    await expect(unfinished.getByRole('listitem')).toHaveCount(2);
    // Newest activity first: the GMAT move came last.
    await expect(unfinished.getByRole('listitem').first()).toContainText('GMAT');
    await expect(unfinished).toContainText('Question 2 of 10');
    await expect(unfinished).toContainText('Question 4 of 10');

    await unfinished.getByRole('listitem').filter({ hasText: 'Digital SAT' }).getByRole('link', { name: 'Continue' }).click();
    await expect(page).toHaveURL(new RegExp(`/attempt/${sat}$`));
    await expect(heading(page)).toHaveText(/^Question 4/);
  });

  test('moving between questions does not wait for the position to save', async ({ page }) => {
    await becomeGuest(page);
    const id = await startSession(page, 'digital-sat');
    await page.goto(`/attempt/${id}`);
    await page.route('**/visit', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.continue();
    });
    const started = Date.now();
    await page.getByRole('button', { name: /^Question 5,/ }).click();
    await expect(heading(page)).toHaveText(/^Question 5/, { timeout: 1500 });
    expect(Date.now() - started).toBeLessThan(1500);
  });

  test('a late position update never overwrites a newer one', async ({ page }) => {
    await becomeGuest(page);
    const id = await startSession(page, 'digital-sat');
    await page.goto(`/attempt/${id}`);

    const now = Date.now();
    const newer = await api(page, 'POST', `/api/attempts/${id}/visit`, { partIndex: 0, position: 6, clock: now });
    const older = await api(page, 'POST', `/api/attempts/${id}/visit`, { partIndex: 0, position: 2, clock: now - 5000 });
    expect(newer.data).toEqual({ position: 6, recorded: true });
    expect(older.data).toEqual({ position: 2, recorded: false });

    await page.reload();
    await expect(heading(page)).toHaveText(/^Question 7/);
  });

  test('a forward-only section never reopens on a committed screen', async ({ page }) => {
    await becomeGuest(page);
    const id = await startSession(page, 'digital-sat');
    // No open format uses forward-only rules yet, so Bocconi's are pinned onto
    // this live section, which is where the server reads them from.
    withE2eDb((db) => {
      db.prepare('UPDATE attempt_parts SET navigation_json = ? WHERE attempt_id = ?').run(JSON.stringify(SCREENS_OF_THREE), id);
    });

    await page.goto(`/attempt/${id}`);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(heading(page)).toHaveText(/^Question 3/);
    await page.getByRole('button', { name: 'Next screen' }).click();
    await expect(heading(page)).toHaveText(/^Question 4/);

    await page.reload();
    await expect(heading(page)).toHaveText(/^Question 4/);

    // A stored position pointing at a committed screen is not honoured.
    withE2eDb((db) => db.prepare('UPDATE attempts SET resume_position = 0 WHERE id = ?').run(id));
    await page.reload();
    await expect(heading(page)).toHaveText(/^Question 4/);
    await expect(page.getByRole('button', { name: /^Question 1,.*not available/ })).toBeDisabled();

    // And the server refuses the move itself.
    const back = await api(page, 'POST', `/api/attempts/${id}/visit`, { partIndex: 0, position: 0, clock: Date.now() });
    expect(back.status).toBe(409);
    expect(back.data.error.code).toBe('no-backward-navigation');
  });

  test('a timed session whose clock has run out is closed, not offered to continue', async ({ page }) => {
    await becomeGuest(page);
    const id = await startSession(page, 'digital-sat', 'timed-math-module-1');
    const past = new Date(Date.now() - 60_000).toISOString();
    withE2eDb((db) => {
      db.prepare('UPDATE attempts SET deadline_at = CASE WHEN deadline_at IS NULL THEN NULL ELSE ? END WHERE id = ?').run(past, id);
      db.prepare('UPDATE attempt_parts SET deadline_at = ? WHERE attempt_id = ? AND part_index = 0').run(past, id);
    });

    await page.goto('/dashboard');
    await expect(page.getByRole('region', { name: 'Pick up where you left off' })).toHaveCount(0);
    await expect(page.getByRole('region', { name: 'Recent sessions' })).toContainText('Time ran out');

    await page.goto(`/attempt/${id}`);
    await expect(page).toHaveURL(new RegExp(`/attempt/${id}/results$`));
  });

  test('a new section starts clean, without the previous section’s answers', async ({ page }) => {
    await becomeGuest(page);
    const id = await startSession(page, 'digital-sat', 'diagnostic');
    await page.goto(`/attempt/${id}`);

    const answer = page.waitForResponse((r) => r.url().endsWith('/answer') && r.request().method() === 'POST');
    await page.getByRole('radio').first().check();
    await answer;

    const last = await page.getByRole('navigation', { name: 'Questions in this section' }).getByRole('button').count();
    await page.getByRole('button', { name: new RegExp(`^Question ${last},`) }).click();
    const finish = page.getByRole('button', { name: 'Finish section' });
    if (await finish.count()) await finish.click();
    else {
      await page.getByRole('button', { name: 'Review answers' }).click();
      await page.getByRole('button', { name: 'Submit section' }).click();
    }

    // The second section's first question is unanswered, and nothing is selected.
    await expect(page.getByRole('button', { name: /^Question 1, not answered/ })).toBeVisible();
    await expect(heading(page)).toHaveText(/^Question 1/);
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  });
});

test.describe('the dashboard', () => {
  test('one learner never sees or moves another learner’s session', async ({ browser }) => {
    const first = await browser.newContext();
    const firstPage = await first.newPage();
    await becomeGuest(firstPage);
    const id = await startSession(firstPage, 'digital-sat');

    const second = await browser.newContext();
    const secondPage = await second.newPage();
    await becomeGuest(secondPage);

    await secondPage.goto('/dashboard');
    await expect(secondPage.getByRole('region', { name: 'Pick up where you left off' })).toHaveCount(0);
    await expect(secondPage.getByRole('heading', { name: 'Choose an exam to start' })).toBeVisible();

    await secondPage.goto('/dashboard?exam=digital-sat');
    await expect(secondPage.getByRole('heading', { name: 'No finished SAT session yet' })).toBeVisible();
    await expect(secondPage.getByRole('link', { name: 'Continue your session' })).toHaveCount(0);

    const move = await api(secondPage, 'POST', `/api/attempts/${id}/visit`, { partIndex: 0, position: 3, clock: Date.now() });
    expect(move.status).toBe(404);

    await secondPage.goto('/');
    await expect(secondPage.getByRole('region', { name: 'Continue studying' })).toHaveCount(0);

    await first.close();
    await second.close();
  });

  test('the address chooses the exam shown, and viewing one does not change the target', async ({ page }) => {
    await becomeGuest(page);
    await startSession(page, 'digital-sat');
    await startSession(page, 'gmat');
    expect((await api(page, 'PATCH', '/api/account', { targetExamKey: 'digital-sat' })).status).toBe(200);

    await page.goto('/dashboard');
    const exams = page.getByRole('navigation', { name: 'Exams on your dashboard' });
    await expect(exams.getByRole('link', { name: /SAT/ })).toHaveAttribute('aria-current', 'page');

    await exams.getByRole('link', { name: 'GMAT' }).click();
    await expect(page).toHaveURL(/\/dashboard\?exam=gmat$/);
    await expect(exams.getByRole('link', { name: 'GMAT' })).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('heading', { name: 'No finished GMAT session yet' })).toBeVisible();

    const target = withE2eDb(
      (db) =>
        db
          .prepare('SELECT u.target_exam_key AS t FROM users u JOIN attempts a ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 1')
          .get() as { t: string },
    );
    expect(target.t).toBe('digital-sat');

    await page.goto('/dashboard?exam=not-an-exam');
    await expect(page.getByText('That link named an exam we do not offer, so this shows your SAT practice instead.')).toBeVisible();
    await page.goto('/dashboard?exam=');
    await expect(page.getByText(/That link named an exam we do not offer/)).toHaveCount(0);
  });

  test('an exam with only an unfinished session offers to continue it', async ({ page }) => {
    await becomeGuest(page);
    const id = await startSession(page, 'digital-sat');
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'No finished SAT session yet' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Continue your session' })).toHaveAttribute('href', `/attempt/${id}`);
  });

  test('a guest in the last days of their session is told when their practice ends', async ({ page }) => {
    await becomeGuest(page);
    const id = await startSession(page, 'digital-sat');
    const soon = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    withE2eDb((db) =>
      db.prepare('UPDATE sessions SET expires_at = ? WHERE user_id = (SELECT user_id FROM attempts WHERE id = ?)').run(soon, id),
    );
    await page.goto('/dashboard');
    await expect(page.getByRole('status').filter({ hasText: 'Your guest practice ends soon' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Keep your progress' }).first()).toBeVisible();
  });
});

test.describe('the homepage for a returning learner', () => {
  test('offers a way back only to a learner with something to continue, and is never cacheable', async ({ page }) => {
    const visitor = await page.goto('/');
    expect(visitor?.headers()['cache-control']).toMatch(/no-store/);
    await expect(page.getByRole('region', { name: 'Continue studying' })).toHaveCount(0);

    await becomeGuest(page);
    await page.goto('/');
    // An empty guest session is not a returning learner.
    await expect(page.getByRole('region', { name: 'Continue studying' })).toHaveCount(0);

    const id = await startSession(page, 'digital-sat');
    const learner = await page.goto('/');
    const cacheControl = learner?.headers()['cache-control'] ?? '';
    expect(cacheControl).toMatch(/private/);
    expect(cacheControl).toMatch(/no-store/);
    const strip = page.getByRole('region', { name: 'Continue studying' });
    await expect(strip).toContainText('Digital SAT, question 1 of 10');
    await expect(strip.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `/attempt/${id}`);
  });
});
