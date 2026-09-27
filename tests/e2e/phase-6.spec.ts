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
