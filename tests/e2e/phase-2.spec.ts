import { expect, test, type Page } from '@playwright/test';
import { resetRateLimits } from './helpers';

/**
 * Phase 2 of the redesign: the homepage sample and exam selector, the
 * navigation, practice setup counts, and the answer lock after feedback.
 */

const START_SESSION = /^Start \d+-question session$/;
const sampleCard = (page: Page) => page.locator('section[aria-labelledby="sample-heading"]');

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

async function becomeGuest(page: Page): Promise<void> {
  await page.evaluate(() => fetch('/api/auth/guest', { method: 'POST', headers: { 'X-Requested-With': 'examer' } }));
}

// Every test comes from one address; see helpers.ts.
test.beforeEach(() => resetRateLimits());

test.describe('homepage sample question', () => {
  test('choosing an exam swaps the sample and destination without moving focus', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('radio', { name: 'SAT', exact: true })).toBeChecked();

    await page.getByRole('radio', { name: 'GMAT' }).focus();
    await page.keyboard.press('ArrowRight');

    const gre = page.getByRole('radio', { name: 'GRE' });
    await expect(gre).toBeChecked();
    await expect(gre).toBeFocused();
    await expect(page).toHaveURL(/\?exam=gre$/);
    await expect(page.getByRole('link', { name: 'Start GRE practice' })).toHaveAttribute('href', '/practice/gre');
    await expect(sampleCard(page)).toContainText('GRE ·');
  });

  test('a visitor can answer, check and read the worked explanation, with no session created', async ({ page }) => {
    await page.goto('/?exam=digital-sat');
    const card = sampleCard(page);
    const check = card.getByRole('button', { name: 'Check answer' });
    await expect(check).toBeDisabled();

    await card.locator('label').filter({ hasText: 'monopolised' }).click();
    await check.click();

    await expect(card.getByText('Correct.')).toBeVisible();
    await expect(card.getByRole('heading', { name: 'Worked explanation' })).toBeVisible();
    await expect(card.getByRole('radio').first()).toBeDisabled();

    // The sample is public content: checking it records nothing and needs no session.
    const cookies = await page.context().cookies();
    expect(cookies.some((cookie) => cookie.name === 'examer_session')).toBe(false);
  });

  test('a wrong answer shows why that option fails', async ({ page }) => {
    await page.goto('/?exam=digital-sat');
    const card = sampleCard(page);
    await card.locator('label').filter({ hasText: 'invented' }).click();
    await card.getByRole('button', { name: 'Check answer' }).click();
    await expect(card.getByText(/You chose A\. The answer is D\./)).toBeVisible();
    await expect(card.getByText(/Why A doesn’t work/)).toBeVisible();
  });

  test('the sample endpoint serves only the fixed public set', async ({ request }) => {
    const sample = await request.get('/api/samples/gmat');
    expect(sample.status()).toBe(200);
    expect((await sample.json()).questionId).toBe('gmat-ps-units-digit-cycles-204');

    const unknown = await request.get('/api/samples/not-an-exam');
    expect(unknown.status()).toBe(404);
  });

  test('the homepage keeps one h1 and fits a phone without sideways scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/');
    expect(await page.locator('h1').count()).toBe(1);
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('the homepage summarises what each exam can start and links to every format', async ({ page }) => {
    await page.goto('/');
    const formats = page.locator('section#formats');
    // One entry per exam configuration, each naming what is open now.
    await expect(formats.getByRole('listitem')).toHaveCount(7);
    await expect(formats.getByRole('listitem').first()).toContainText('Open:');
    await formats.getByRole('link', { name: 'Every format, and what each still needs' }).click();
    await expect(page).toHaveURL(/\/exams#formats$/);
    await expect(page.getByRole('table', { name: /Practice formats by exam/ })).toBeVisible();
  });
});

test.describe('navigation', () => {
  test('a guest is offered the account flow that keeps their history', async ({ page }) => {
    await page.goto('/');
    await becomeGuest(page);
    await page.goto('/');

    const menu = page.getByRole('button', { name: 'Menu' });
    if (await menu.isVisible()) await menu.click();
    const keep = page.getByRole('link', { name: 'Keep your progress' }).filter({ visible: true });
    await expect(keep.first()).toHaveAttribute('href', '/sign-up');
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
  });

  test('the current page is marked in the navigation', async ({ page }) => {
    await page.goto('/guides');
    const menu = page.getByRole('button', { name: 'Menu' });
    if (await menu.isVisible()) await menu.click();
    const current = page.locator('a[aria-current="page"]').filter({ hasText: 'Guides' }).filter({ visible: true });
    await expect(current).toHaveCount(1);
  });

  test('Escape closes the mobile menu and returns focus to its button', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Menu' });
    await menu.click();
    await expect(page.locator('#site-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#site-menu')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused();
  });

  test('a favicon is served', async ({ page, request }) => {
    await page.goto('/');
    const href = await page.locator('link[rel="icon"]').first().getAttribute('href');
    expect(href).toBeTruthy();
    expect((await request.get(href!)).ok()).toBe(true);
  });
});

test.describe('practice setup', () => {
  test('a preset skill is shown and the length follows what the bank holds', async ({ page }) => {
    await page.goto('/practice/digital-sat?skill=words-in-context');
    await expect(page.getByRole('button', { name: 'Remove skill filter' })).toBeVisible();
    await expect(page.getByText(/Only \d+ reviewed questions? match(es)? these settings/)).toBeVisible();

    const start = page.getByRole('button', { name: START_SESSION });
    const planned = Number(/Start (\d+)-question/.exec((await start.textContent()) ?? '')![1]);
    expect(planned).toBeGreaterThan(0);
    expect(planned).toBeLessThan(5);

    await start.click();
    await page.waitForURL(/\/attempt\/[0-9a-f-]+$/);
    await expect(page.getByRole('button', { name: /^Question \d+,/ })).toHaveCount(planned);
  });

  test('broader practice is an explicit choice', async ({ page }) => {
    await page.goto('/practice/digital-sat?skill=words-in-context');
    await page.getByRole('button', { name: /^Practise all of Craft and Structure/ }).click();
    await expect(page.getByRole('button', { name: 'Remove skill filter' })).toHaveCount(0);
    await expect(page.getByLabel('Topic')).toHaveValue('craft-and-structure');
  });

  test('an older link that named a topic as a skill opens that topic', async ({ page }) => {
    await page.goto('/practice/digital-sat?skill=expression-of-ideas');
    await expect(page.getByLabel('Topic')).toHaveValue('expression-of-ideas');
    await expect(page.getByRole('button', { name: START_SESSION })).toBeEnabled();
  });

  test('an unknown filter is ignored, and the page says so', async ({ page }) => {
    await page.goto('/practice/digital-sat?skill=no-such-skill');
    await expect(page.getByText(/no filter has been applied/)).toBeVisible();
  });
});

test.describe('answer locking after feedback', () => {
  test('a checked answer is locked in the interface and refused by the server', async ({ page }) => {
    await page.goto('/practice/digital-sat');
    await page.getByRole('button', { name: START_SESSION }).click();
    await page.waitForURL(/\/attempt\/[0-9a-f-]+$/);
    const attemptId = /\/attempt\/([0-9a-f-]+)/.exec(page.url())![1];

    // Walk to a multiple-choice question.
    let position = 0;
    for (; position < 10; position += 1) {
      if ((await page.getByRole('radio').count()) > 1) break;
      await page.getByRole('button', { name: new RegExp(`^Question ${position + 2},`) }).click();
    }
    const radios = page.getByRole('radio');

    // Before checking, the answer can change freely.
    await radios.nth(0).check();
    await radios.nth(1).check();
    await page.getByRole('button', { name: 'Check answer' }).click();

    await expect(page.getByText(/^(Correct|Not correct)/).first()).toBeVisible();
    await expect(page.getByText(/Answer locked/)).toBeVisible();
    await expect(radios.first()).toBeDisabled();

    // Another tab, or a hand-made request, trying to overwrite it.
    const status = await page.evaluate(
      async ({ id, pos }) => {
        const response = await fetch(`/api/attempts/${id}/answer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
          body: JSON.stringify({ partIndex: 0, position: pos, response: { type: 'single_select', optionId: 'a' } }),
        });
        return { status: response.status, body: await response.json() };
      },
      { id: attemptId, pos: position },
    );
    expect(status.status).toBe(409);
    expect(status.body.error.code).toBe('response-locked');
  });
});
