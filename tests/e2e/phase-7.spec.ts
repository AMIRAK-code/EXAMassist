import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { resetRateLimits, withE2eDb } from './helpers';

/**
 * Phase 7: final validation (docs/REDESIGN.md §19). Automated accessibility
 * checks with axe-core against WCAG 2.0, 2.1 and 2.2 A and AA rules, keyboard
 * operation, visible and unobscured focus, and reflow at 320 px and at 200%
 * zoom, across public, learner and admin pages in their main states.
 *
 * axe finds a subset of accessibility problems; it does not replace a
 * screen-reader pass, which is a manual release check (§19).
 */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

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

/** A registered learner with a finished session (some answers wrong, some blank) and one in progress. */
async function learner(page: Page, prefix: string): Promise<{ email: string; finished: string; open: string }> {
  await page.goto('/about/terms');
  const email = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.invalid`;
  expect((await api(page, 'POST', '/api/auth/sign-up', { email, password: 'a quiet harbour at dawn' })).status).toBe(201);
  const finished = (await api(page, 'POST', '/api/attempts', { examKey: 'digital-sat', blueprintId: 'practice' })).data.attemptId as string;
  const state = (await api(page, 'GET', `/api/attempts/${finished}`)).data;
  for (const item of state.parts[0].items.slice(0, 7)) {
    const q = item.question;
    const response =
      q.responseType === 'single_select'
        ? { type: 'single_select', optionId: q.options[q.options.length - 1].id }
        : q.responseType === 'multi_select'
          ? { type: 'multi_select', optionIds: [q.options[0].id] }
          : q.responseType === 'numeric_entry'
            ? { type: 'numeric_entry', raw: '1' }
            : null;
    if (response) await api(page, 'POST', `/api/attempts/${finished}/answer`, { partIndex: 0, position: item.position, response });
  }
  expect((await api(page, 'POST', `/api/attempts/${finished}/submit`)).status).toBe(200);
  const open = (await api(page, 'POST', '/api/attempts', { examKey: 'lsat', blueprintId: 'practice' })).data.attemptId as string;
  return { email, finished, open };
}

/** Runs axe on the current page and fails with a readable list of what it found. */
async function expectNoViolations(page: Page, label: string): Promise<void> {
  const result = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const found = result.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('\n    ')}`,
  );
  expect(found, `axe on ${label}`).toEqual([]);
}

/** Elements wider than the viewport that are not inside their own scroll box. */
async function reflowOffenders(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const offenders: string[] = [];
    if (document.documentElement.scrollWidth > width + 1) offenders.push(`page is ${document.documentElement.scrollWidth - width}px too wide`);
    for (const el of Array.from(document.querySelectorAll('main *, header *'))) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.right <= width + 1) continue;
      let parent = el.parentElement;
      let contained = false;
      while (parent) {
        const overflow = getComputedStyle(parent).overflowX;
        if (/(auto|scroll|hidden|clip)/.test(overflow)) {
          contained = true;
          break;
        }
        parent = parent.parentElement;
      }
      if (!contained) offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 2).join('.')} reaches ${Math.round(r.right)}px`);
    }
    return offenders.slice(0, 5);
  });
}

const PUBLIC = [
  '/', '/exams', '/exams/digital-sat', '/exams/bocconi-online-test', '/exams/digital-sat/format', '/guides',
  '/guides/lsat-without-logic-games', '/practice/digital-sat', '/practice/bocconi-undergraduate', '/about/editorial-standards',
  '/about/how-scoring-works', '/about/privacy', '/about/terms', '/report-question', '/sign-in', '/sign-up', '/does-not-exist',
];

test.describe('automated accessibility checks (axe-core, WCAG A and AA)', () => {
  test('public pages', async ({ page }) => {
    // Seventeen full scans: allowed longer than the default, as slower engines (WebKit) need.
    test.slow();
    for (const path of PUBLIC) {
      await page.goto(path);
      await expectNoViolations(page, path);
    }
  });

  test('learner pages, in their main states', async ({ page }) => {
    test.slow();
    const { finished, open } = await learner(page, 'p7-axe');
    await page.goto('/study-plan?exam=digital-sat');
    await expectNoViolations(page, 'plan setup and preview');
    await page.getByRole('button', { name: 'Save this plan' }).click();
    await expect(page.getByText('Your plan is saved.', { exact: false })).toBeVisible();
    for (const path of [
      '/dashboard',
      '/review',
      '/study-plan?exam=digital-sat',
      '/study-plan/adjust?exam=digital-sat',
      '/study-plan/progress?exam=digital-sat',
      '/account',
      `/attempt/${finished}/results`,
      `/attempt/${finished}/results/1`,
      `/attempt/${finished}/results/10`,
      `/attempt/${open}`,
    ]) {
      await page.goto(path);
      await expectNoViolations(page, path);
    }

    // The player after an answer is checked: feedback and explanation showing.
    await page.goto(`/attempt/${open}`);
    const radio = page.getByRole('radio').first();
    if ((await radio.count()) > 0) {
      await radio.check();
      await page.getByRole('button', { name: 'Check answer' }).click();
      await expect(page.getByText(/^(Correct|Not correct)/).first()).toBeVisible();
      await expectNoViolations(page, 'player with feedback');
    }
  });

  test('form errors and the mobile menu', async ({ page }, testInfo) => {
    await page.goto('/sign-in');
    await page.getByLabel('Email address').fill('nobody@example.invalid');
    await page.getByLabel('Password', { exact: true }).fill('not the right password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Sign-in failed' })).toBeVisible();
    await expectNoViolations(page, 'sign-in with an error');

    if (testInfo.project.name.includes('mobile')) {
      await page.goto('/');
      await page.getByRole('button', { name: 'Menu' }).click();
      await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
      await expectNoViolations(page, 'the open mobile menu');
    }
  });

  test('admin pages', async ({ page }) => {
    const { email } = await learner(page, 'p7-admin');
    withE2eDb((db) => db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(email));
    for (const path of ['/admin', '/admin/flags', '/admin/questions']) {
      await page.goto(path);
      await expectNoViolations(page, path);
    }
  });
});

test.describe('keyboard operation', () => {
  test.skip(({ isMobile }) => isMobile, 'Tab traversal is a desktop concern.');

  test('the skip link moves focus into the main content on every kind of page', async ({ page }) => {
    for (const path of ['/', '/exams/digital-sat/format', '/practice/digital-sat', '/sign-in']) {
      await page.goto(path);
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: /skip to main content/i })).toBeFocused();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      const inMain = await page.evaluate(() => !!document.activeElement?.closest('main'));
      expect(inMain, `after the skip link on ${path}, focus is in main`).toBe(true);
    }
  });

  test('a practice question can be answered and checked from the keyboard alone', async ({ page }) => {
    const { open } = await learner(page, 'p7-keys');
    await page.goto(`/attempt/${open}`);
    if ((await page.getByRole('radio').count()) === 0) test.skip(true, 'The first question has no options to choose.');
    let reached = false;
    for (let i = 0; i < 60 && !reached; i += 1) {
      await page.keyboard.press('Tab');
      reached = await page.evaluate(() => (document.activeElement as HTMLInputElement | null)?.type === 'radio');
    }
    expect(reached).toBe(true);
    await page.keyboard.press('Space');
    let onCheck = false;
    for (let i = 0; i < 20 && !onCheck; i += 1) {
      await page.keyboard.press('Tab');
      onCheck = await page.evaluate(() => document.activeElement?.textContent?.trim() === 'Check answer');
    }
    expect(onCheck).toBe(true);
    await page.keyboard.press('Enter');
    await expect(page.getByText(/^(Correct|Not correct)/).first()).toBeVisible();
  });

  test('a study plan can be previewed and saved from the keyboard alone', async ({ page }) => {
    await learner(page, 'p7-plan-keys');
    await page.goto('/study-plan?exam=digital-sat');
    let onSave = false;
    for (let i = 0; i < 80 && !onSave; i += 1) {
      await page.keyboard.press('Tab');
      onSave = await page.evaluate(() => document.activeElement?.textContent?.trim() === 'Save this plan');
    }
    expect(onSave).toBe(true);
    await page.keyboard.press('Enter');
    await expect(page.getByText('Your plan is saved.', { exact: false })).toBeVisible();
  });

  test('focus is always visible, and never hidden behind the sticky header or player bars', async ({ browser }) => {
    for (const viewport of [{ width: 1440, height: 900 }, { width: 640, height: 450 }]) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce', baseURL: test.info().project.use.baseURL });
      const page = await context.newPage();
      const { open } = await learner(page, 'p7-focus');
      for (const path of ['/', '/exams/digital-sat/format', `/attempt/${open}`]) {
        await page.goto(path);
        const problems: string[] = [];
        const seen = new Set<string>();
        for (let i = 0; i < 70; i += 1) {
          await page.keyboard.press('Tab');
          const stop = await page.evaluate(() => {
            const el = document.activeElement as HTMLElement | null;
            if (!el || el === document.body) return null;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            const indicator = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== 'none';
            let covered = 0;
            let samples = 0;
            for (const x of [r.left + 2, r.left + r.width / 2, r.right - 2]) {
              for (const y of [r.top + 2, r.top + r.height / 2, r.bottom - 2]) {
                if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
                samples += 1;
                const hit = document.elementFromPoint(x, y);
                if (!hit || hit === el || el.contains(hit) || hit.contains(el)) continue;
                for (let n: Element | null = hit; n && n !== document.body; n = n.parentElement) {
                  const position = getComputedStyle(n).position;
                  if (position === 'sticky' || position === 'fixed') {
                    covered += 1;
                    break;
                  }
                }
              }
            }
            const label = `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40)}"`;
            return { key: `${label}@${Math.round(r.top + scrollY)}`, label, indicator, hidden: samples === 0 || covered === samples };
          });
          if (!stop) continue;
          if (seen.has(stop.key)) break;
          seen.add(stop.key);
          if (!stop.indicator) problems.push(`no indicator: ${stop.label}`);
          if (stop.hidden) problems.push(`hidden: ${stop.label}`);
        }
        expect(problems, `${path} at ${viewport.width}×${viewport.height}`).toEqual([]);
        expect(seen.size, `focus stops on ${path}`).toBeGreaterThan(3);
      }
      await context.close();
    }
  });
});

test.describe('reflow and zoom', () => {
  test.skip(({ isMobile }) => isMobile, 'Viewport sizes are set explicitly here.');

  test('nothing needs horizontal scrolling at 320 px or at 200% zoom, except tables in their own scroll box', async ({ page }) => {
    const { finished, open } = await learner(page, 'p7-reflow');
    const routes = [
      ...PUBLIC.filter((path) => path !== '/does-not-exist'),
      '/dashboard',
      '/review',
      '/study-plan?exam=digital-sat',
      '/study-plan/progress?exam=digital-sat',
      '/account',
      `/attempt/${finished}/results`,
      `/attempt/${finished}/results/1`,
      `/attempt/${open}`,
    ];
    // 320 CSS px is 1280 px at 400% (WCAG 1.4.10); 640 × 450 is 1280 × 900 at 200%.
    for (const viewport of [{ width: 320, height: 640 }, { width: 640, height: 450 }]) {
      await page.setViewportSize(viewport);
      for (const path of routes) {
        await page.goto(path);
        expect(await reflowOffenders(page), `${path} at ${viewport.width} px`).toEqual([]);
      }
    }
  });

  test('at 200% zoom the player keeps most of the screen for the question', async ({ page }) => {
    const { open } = await learner(page, 'p7-zoom');
    await page.setViewportSize({ width: 640, height: 450 });
    await page.goto(`/attempt/${open}`);
    const pinned = await page.evaluate(() => {
      let total = 0;
      for (const el of Array.from(document.querySelectorAll('body *'))) {
        const position = getComputedStyle(el).position;
        if (position !== 'sticky' && position !== 'fixed') continue;
        const r = el.getBoundingClientRect();
        if (r.height > 0 && r.bottom > 0 && r.top < innerHeight) total += Math.min(r.bottom, innerHeight) - Math.max(r.top, 0);
      }
      return total / innerHeight;
    });
    expect(pinned).toBeLessThan(0.5);
  });
});
