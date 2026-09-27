import { expect, test, type Page } from '@playwright/test';
import { resetRateLimits, withE2eDb } from './helpers';

/**
 * Phase 6 in a real browser against a real server (docs/REDESIGN.md §18):
 * the remaining pages on the design system, one planning destination, and
 * (stage B) persisted plans and readiness evidence.
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

async function signUp(page: Page, prefix = 'p6'): Promise<string> {
  await page.goto('/about/terms');
  const email = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.invalid`;
  const result = await api(page, 'POST', '/api/auth/sign-up', { email, password: 'a quiet harbour at dawn' });
  expect(result.status).toBe(201);
  return email;
}

/** Answers every question of an attempt with its first option (or a small number), through the API. */
async function answerAll(page: Page, attemptId: string): Promise<number> {
  const state = (await api(page, 'GET', `/api/attempts/${attemptId}`)).data;
  let answered = 0;
  for (const item of state.parts[0].items) {
    const q = item.question;
    const response =
      q.responseType === 'single_select'
        ? { type: 'single_select', optionId: q.options[0].id }
        : q.responseType === 'multi_select'
          ? { type: 'multi_select', optionIds: [q.options[0].id] }
          : q.responseType === 'numeric_entry'
            ? { type: 'numeric_entry', raw: '1' }
            : null;
    if (!response) continue;
    const saved = await api(page, 'POST', `/api/attempts/${attemptId}/answer`, { partIndex: 0, position: item.position, response });
    if (saved.status < 300) answered += 1;
  }
  return answered;
}

const planOf = (email: string) =>
  withE2eDb(
    (db) =>
      db
        .prepare("SELECT p.id, p.version FROM plans p JOIN users u ON u.id = p.user_id WHERE u.email = ? AND p.status = 'active'")
        .get(email) as { id: string; version: number } | undefined,
  );

const sessionCards = (page: Page) => page.locator('section[aria-labelledby="weeks-heading"] ol > li > ul > li');

/** Height of an element's box, for touch-target checks. */
const heightOf = async (page: Page, selector: string) => (await page.locator(selector).first().boundingBox())?.height ?? 0;

test.describe('navigation', () => {
  test('lists one Study plan destination, whose views keep the exam and the old readiness address', async ({ page }) => {
    await page.goto('/about/terms');
    await api(page, 'POST', '/api/auth/guest');
    await page.goto('/dashboard');
    const bar = page.getByRole('navigation', { name: 'Main' });
    if (await bar.isVisible()) {
      await expect(bar.getByRole('link', { name: 'Study plan' })).toBeVisible();
      await expect(bar.getByRole('link', { name: 'Readiness' })).toHaveCount(0);
    }

    await page.goto('/readiness?exam=gmat');
    await expect(page).toHaveURL(/\/study-plan\/progress\?exam=gmat$/);
    const views = page.getByRole('navigation', { name: 'Study plan views' });
    await expect(views.getByRole('link', { name: 'Progress & readiness' })).toHaveAttribute('aria-current', 'page');
    await expect(views.getByRole('link', { name: 'Plan' })).toHaveAttribute('href', '/study-plan?exam=gmat');
    await views.getByRole('link', { name: 'Plan' }).click();
    await expect(page).toHaveURL(/\/study-plan\?exam=gmat$/);
    await expect(views.getByRole('link', { name: 'Plan' })).toHaveAttribute('aria-current', 'page');
  });
});

test.describe('sign-in and sign-up', () => {
  test('tie a wrong-credentials error to both fields, with a 44 px show-password control', async ({ page }) => {
    await page.goto('/sign-in');
    const toggle = page.getByRole('button', { name: 'Show password' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(await toggle.boundingBox().then((box) => box?.height ?? 0)).toBeGreaterThanOrEqual(44);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'text');

    await page.getByLabel('Email address').fill('nobody@example.invalid');
    await page.getByLabel('Password', { exact: true }).fill('not the right password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    const error = page.getByRole('alert').filter({ hasText: 'Sign-in failed' });
    await expect(error).toBeVisible();
    for (const label of ['Email address', 'Password']) {
      const field = page.getByLabel(label, { exact: true });
      await expect(field).toHaveAttribute('aria-invalid', 'true');
      const described = (await field.getAttribute('aria-describedby')) ?? '';
      expect(described.length).toBeGreaterThan(0);
      await expect(page.locator(`[id="${described.split(' ')[0]}"]`)).toContainText('do not match');
    }
    expect(await heightOf(page, 'input[type="email"]')).toBeGreaterThanOrEqual(48);
  });

  test('mark an invalid email on sign-up, with a 44 px consent label', async ({ page }) => {
    await page.goto('/sign-up');
    expect(await heightOf(page, 'label:has(input[type="checkbox"])')).toBeGreaterThanOrEqual(44);
    await page.getByLabel('Email address').fill('not-an-address');
    await page.getByLabel('Password', { exact: true }).fill('a quiet harbour at dawn');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Account not created' })).toBeVisible();
    await expect(page.getByLabel('Email address')).toHaveAttribute('aria-invalid', 'true');
  });
});

test.describe('editorial pages', () => {
  test('a guide reads in the reading serif, says which sources open a new tab, and has one h1', async ({ page }) => {
    await page.goto('/guides/lsat-without-logic-games');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'In short' })).toBeVisible();
    const fonts = await page.evaluate(() => ({
      body: getComputedStyle(document.querySelector('article .prose-academic')!).fontFamily,
      title: getComputedStyle(document.querySelector('h1')!).fontFamily,
    }));
    expect(fonts.body).toMatch(/Charter|Palatino|Georgia|serif/);
    expect(fonts.title).not.toMatch(/Palatino|Georgia/);
    const external = page.locator('section[aria-labelledby="sources-heading"] a[target="_blank"]');
    expect(await external.count()).toBeGreaterThan(0);
    await expect(external.first()).toContainText('(opens in a new tab)');
  });

  test('a hub names the formats that are not open yet, beside the open ones', async ({ page }) => {
    await page.goto('/exams/digital-sat');
    await expect(page.getByRole('heading', { name: 'Practise this exam' })).toBeVisible();
    const notYet = page.getByRole('heading', { name: 'Not open yet' });
    if ((await notYet.count()) > 0) {
      const box = page.locator('div').filter({ has: notYet }).last();
      await expect(box.getByText(/needs \d+ more reviewed question|the rules it needs are not verified/).first()).toBeVisible();
      await expect(box.getByRole('link', { name: 'Why each format is or is not open' })).toHaveAttribute('href', '/practice/digital-sat');
    }
  });

  test('a format guide opens with the verification date alone', async ({ page }) => {
    await page.goto('/exams/gre/format');
    await expect(page.getByText(/^Verified \d{1,2} \w+ \d{4}$/)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'In short' })).toBeVisible();
  });
});

test.describe('account and admin', () => {
  test('the account page has breadcrumbs, and a refused deletion marks its field', async ({ page }) => {
    await signUp(page, 'p6-account');
    await page.goto('/account');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
    const confirm = page.getByLabel(/Type your email address to confirm/);
    await confirm.fill('someone-else@example.invalid');
    await page.getByRole('button', { name: 'Delete my account permanently' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Not deleted' })).toBeVisible();
    await expect(confirm).toHaveAttribute('aria-invalid', 'true');
  });

  test('admin pages use shared figures, and a flag decision without a note is an alert', async ({ page }) => {
    const email = await signUp(page, 'p6-admin');
    withE2eDb((db) => db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(email));
    await page.goto('/admin');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: 'Open content reports' })).toBeVisible();

    // A report to triage, then a decision attempted without a note.
    await page.goto('/about/terms');
    const questionId = withE2eDb((db) => (db.prepare("SELECT id FROM questions WHERE state = 'published' LIMIT 1").get() as { id: string }).id);
    const flag = await api(page, 'POST', '/api/content-flags', { questionId, reason: 'wrong_answer', details: 'Phase 6 check of the triage form.' });
    expect(flag.status).toBeLessThan(300);
    await page.goto('/admin/flags');
    await page.getByRole('button', { name: 'Accept report' }).first().click();
    await expect(page.getByRole('alert').filter({ hasText: 'Not saved' }).first()).toBeVisible();
    await expect(page.getByLabel('Resolution note').first()).toHaveAttribute('aria-invalid', 'true');
  });
});

test.describe('persisted study plan', () => {
  test('previews without saving, then saves; finishing a started session completes it, opening does not', async ({ page }) => {
    const email = await signUp(page, 'p6-plan');
    await page.goto('/study-plan?exam=digital-sat');
    await expect(page.getByRole('heading', { name: 'Make a plan' })).toBeVisible();
    await page.getByLabel('Time each week').selectOption('60');
    await page.getByRole('button', { name: 'Preview with these' }).click();
    await expect(page).toHaveURL(/minutes=60/);
    await expect(page.getByRole('heading', { name: 'The plan this would make' })).toBeVisible();
    expect(planOf(email)).toBeUndefined();

    await page.getByRole('button', { name: 'Save this plan' }).click();
    await expect(page.getByText('Your plan is saved. It changes only when you adjust it.')).toBeVisible();
    expect(planOf(email)).toBeDefined();

    const first = sessionCards(page).first();
    await expect(first.getByText('Planned', { exact: true })).toBeVisible();
    await expect(first.getByText('New questions only')).toBeVisible();
    await first.getByRole('button', { name: 'Start', exact: true }).click();
    await page.waitForURL(/\/attempt\/[0-9a-f-]+$/);
    const attemptId = /\/attempt\/([0-9a-f-]+)/.exec(page.url())![1];
    // A new session is built with "new questions only" enforced.
    const settings = withE2eDb((db) => JSON.parse((db.prepare('SELECT settings_json AS s FROM attempts WHERE id = ?').get(attemptId) as { s: string }).s));
    expect(settings.overrides.unseenOnly).toBe(true);

    // Opened, not finished: still planned, and offered to continue.
    await page.goto('/study-plan?exam=digital-sat');
    await expect(first.getByText('Planned', { exact: true })).toBeVisible();
    await expect(first.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', `/attempt/${attemptId}`);

    expect(await answerAll(page, attemptId)).toBeGreaterThanOrEqual(5);
    expect((await api(page, 'POST', `/api/attempts/${attemptId}/submit`)).status).toBe(200);
    await page.goto('/study-plan?exam=digital-sat');
    await expect(first.getByText('Completed', { exact: true })).toBeVisible();
    // Completing needs 5 answers; the plan says how many there were rather than implying all.
    await expect(first.getByText(/^Completed with \d+ questions? answered( of the \d+ planned)?\.$/)).toBeVisible();
    await expect(first.getByRole('link', { name: 'See results' })).toHaveAttribute('href', `/attempt/${attemptId}/results`);

    // Skipping is kept as skipped, and offers nothing more.
    const second = sessionCards(page).nth(1);
    await second.getByRole('button', { name: 'Skip' }).click();
    await expect(page.getByText('Session skipped. It stays in your plan as skipped.')).toBeVisible();
    await expect(sessionCards(page).nth(1).getByText('Skipped', { exact: true })).toBeVisible();
    await expect(sessionCards(page).nth(1).getByRole('button', { name: 'Start', exact: true })).toHaveCount(0);
  });

  test('shows missed sessions, previews the adjustment without saving, and applies only that preview', async ({ page }) => {
    const email = await signUp(page, 'p6-adjust');
    await page.goto('/study-plan?exam=digital-sat');
    await page.getByRole('button', { name: 'Save this plan' }).click();
    await expect(page.getByText('Your plan is saved.', { exact: false })).toBeVisible();
    const plan = planOf(email)!;

    // Two weeks pass without practice.
    withE2eDb((db) => {
      db.prepare("UPDATE plan_sessions SET scheduled_on = date(scheduled_on, '-14 days') WHERE plan_id = ?").run(plan.id);
      db.prepare("UPDATE plans SET starts_on = date(starts_on, '-14 days'), ends_on = date(ends_on, '-14 days') WHERE id = ?").run(plan.id);
    });
    await page.goto('/study-plan?exam=digital-sat');
    await expect(page.getByText(/^\d+ sessions? missed$/)).toBeVisible();
    await expect(sessionCards(page).first().getByText('Missed', { exact: true })).toBeVisible();
    // Visiting records nothing as missed: that is the adjustment's job.
    const stored = () =>
      withE2eDb(
        (db) =>
          db.prepare('SELECT status, COUNT(*) AS n FROM plan_sessions WHERE plan_id = ? GROUP BY status').all(plan.id) as Array<{ status: string; n: number }>,
      );
    expect(stored().map((row) => row.status)).toEqual(['planned']);

    await page.getByRole('link', { name: 'Adjust my remaining plan' }).click();
    await expect(page).toHaveURL(/\/study-plan\/adjust\?exam=digital-sat$/);
    await expect(page.getByRole('heading', { name: 'What would change' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Carried forward' })).toBeVisible();
    expect(stored().map((row) => row.status)).toEqual(['planned']);

    // A preview that is no longer current is refused, and shown again as it is now.
    withE2eDb((db) => db.prepare('UPDATE plans SET version = version + 1 WHERE id = ?').run(plan.id));
    await page.getByRole('button', { name: 'Apply these changes' }).click();
    await expect(page.getByText(/changed since this preview was made, so nothing was applied/)).toBeVisible();
    expect(stored().map((row) => row.status)).toEqual(['planned']);

    await page.getByRole('button', { name: 'Apply these changes' }).click();
    await expect(page.getByText(/Your remaining plan is adjusted/)).toBeVisible();
    const after = Object.fromEntries(stored().map((row) => [row.status, row.n]));
    expect(after.missed).toBeGreaterThan(0);
    const today = new Date().toISOString().slice(0, 10);
    const early = withE2eDb(
      (db) =>
        (
          db
            .prepare("SELECT COUNT(*) AS n FROM plan_sessions WHERE plan_id = ? AND status = 'planned' AND scheduled_on < ?")
            .get(plan.id, today) as { n: number }
        ).n,
    );
    expect(early).toBe(0);
    await expect(page.getByText(/^\d+ sessions? missed$/)).toHaveCount(0);
  });
});

test.describe('progress and readiness', () => {
  test('applies evidence thresholds to every signal, keeps suggestions apart, and asks which date is right', async ({ page }) => {
    const email = await signUp(page, 'p6-progress');
    const started = await api(page, 'POST', '/api/attempts', { examKey: 'digital-sat', blueprintId: 'practice' });
    expect(started.status).toBe(201);
    await answerAll(page, started.data.attemptId);
    expect((await api(page, 'POST', `/api/attempts/${started.data.attemptId}/submit`)).status).toBe(200);

    withE2eDb((db) => {
      const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as { id: string };
      db.prepare(
        "INSERT INTO exam_targets (user_id, exam_key, target_score, target_date, created_at, updated_at, legacy_plan_date) VALUES (?, 'digital-sat', 1400, '2027-03-13', 'x', 'x', '2027-05-01')",
      ).run(user.id);
    });

    await page.goto('/study-plan/progress?exam=digital-sat');
    const signal = (label: string) => page.locator('section[aria-labelledby="signals-heading"] li').filter({ hasText: label });
    // Ten answers: every signal reads "Not enough evidence yet", accuracy as a count.
    for (const label of ['Accuracy', 'Pace', 'Topic coverage', 'Consistency']) {
      await expect(signal(label).getByText('Not enough evidence yet')).toBeVisible();
    }
    await expect(signal('Accuracy').getByText(/^\d+ of 10 correct$/)).toBeVisible();
    await expect(signal('Consistency').getByText('1 of 3 sessions')).toBeVisible();

    const suggestions = page.locator('section[aria-labelledby="suggestions-heading"]');
    await expect(suggestions.getByText('These are suggestions, not measurements.', { exact: false })).toBeVisible();
    await expect(page.locator('section[aria-labelledby="signals-heading"]').getByText('Suggestions')).toHaveCount(0);

    await expect(page.getByRole('heading', { name: 'Which is your SAT date?' })).toBeVisible();
    await page.getByRole('button', { name: /1 May 2027, from your earlier plan/ }).click();
    await expect(page.getByText('Exam date saved. That is now the one date for this exam.')).toBeVisible();
    const target = withE2eDb((db) =>
      db
        .prepare(
          'SELECT t.target_score AS score, t.target_date AS date, t.legacy_plan_date AS legacy FROM exam_targets t JOIN users u ON u.id = t.user_id WHERE u.email = ?',
        )
        .get(email),
    );
    expect(target).toEqual({ score: 1400, date: '2027-05-01', legacy: null });
    await expect(page.getByRole('heading', { name: 'Which is your SAT date?' })).toHaveCount(0);
  });
});
