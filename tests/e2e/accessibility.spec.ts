import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * Automated accessibility checks.
 *
 * These run axe-core against every page a learner actually passes through,
 * including the states that only exist after signing in and answering
 * something — an empty dashboard tells you very little.
 *
 * What this does and does not prove: axe catches roughly a third of WCAG
 * failures, the mechanically detectable ones. A clean run is evidence, not a
 * conformance claim. The structural checks in learner-journey.spec.ts (one h1,
 * skip link, keyboard operation, labelled controls, no horizontal scroll at
 * 360px) cover a further slice, and a screen-reader walkthrough is still
 * outstanding — see docs/VERIFICATION.md.
 */

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function scan(page: Page, options: { disableRules?: string[] } = {}) {
  let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);
  if (options.disableRules?.length) builder = builder.disableRules(options.disableRules);
  return builder.analyze();
}

/** Reports every violation with the offending markup, so a failure is actionable. */
function describe(results: Awaited<ReturnType<typeof scan>>): string {
  return results.violations
    .map((violation) => {
      const nodes = violation.nodes
        .slice(0, 3)
        .map((node) => `      ${node.html.slice(0, 160)}`)
        .join('\n');
      return `  [${violation.impact}] ${violation.id}: ${violation.help}\n${nodes}`;
    })
    .join('\n');
}

// ---------------------------------------------------------------------------
// Public pages
// ---------------------------------------------------------------------------

const PUBLIC_PAGES: Array<{ path: string; name: string }> = [
  { path: '/', name: 'homepage' },
  { path: '/exams', name: 'exam directory' },
  { path: '/exams/bocconi-online-test', name: 'exam hub' },
  { path: '/exams/digital-sat/format', name: 'format and scoring guide' },
  { path: '/guides', name: 'guide index' },
  { path: '/guides/lsat-without-logic-games', name: 'a guide' },
  { path: '/practice/digital-sat', name: 'practice setup' },
  { path: '/about/editorial-standards', name: 'editorial standards' },
  { path: '/about/how-scoring-works', name: 'scoring explainer' },
  { path: '/about/privacy', name: 'privacy draft' },
  { path: '/about/terms', name: 'terms draft' },
  { path: '/report-question', name: 'report a question' },
  { path: '/sign-in', name: 'sign in' },
  { path: '/sign-up', name: 'sign up' },
];

test.describe('accessibility: public pages', () => {
  for (const { path, name } of PUBLIC_PAGES) {
    test(`${name} has no detectable WCAG violations`, async ({ page }) => {
      await page.goto(path);
      const results = await scan(page);
      expect(results.violations, `${path}\n${describe(results)}`).toEqual([]);
    });
  }
});

// ---------------------------------------------------------------------------
// The signed-in journey, including states that need real data
// ---------------------------------------------------------------------------

test.describe('accessibility: the learner journey', () => {
  // Runs as a guest: every page here is open to guests, and the sign-up rate
  // limit (five an hour per address) is shared by the whole suite. The account
  // page, which needs a real account, is scanned in learner-journey.spec.ts.
  test('the practice player, results, dashboard and readiness are clean', async ({ page }) => {

    // --- The player, mid-attempt.
    await page.goto('/practice/digital-sat');
    await page.getByRole('button', { name: /start practising/i }).click();
    await page.waitForURL(/\/attempt\/[0-9a-f-]+$/);
    const attemptId = /\/attempt\/([0-9a-f-]+)/.exec(page.url())![1];

    await expect(page.getByRole('heading', { name: /^Question 1/ })).toBeVisible();
    const player = await scan(page);
    expect(player.violations, `practice player\n${describe(player)}`).toEqual([]);

    // --- The player with an answer recorded and feedback showing.
    const radio = page.getByRole('radio').first();
    if (await radio.count()) {
      await radio.check();
      await expect(page.getByText('1 of 10 answered')).toBeVisible();
      const answered = await scan(page);
      expect(answered.violations, `player after answering\n${describe(answered)}`).toEqual([]);
    }

    // --- Results, which carry the densest tables on the site.
    await page.evaluate(async (id) => {
      await fetch(`/api/attempts/${id}/submit`, {
        method: 'POST',
        headers: { 'X-Requested-With': 'examer' },
      });
    }, attemptId);

    await page.goto(`/attempt/${attemptId}/results`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your results');
    const results = await scan(page);
    expect(results.violations, `results\n${describe(results)}`).toEqual([]);

    // --- Dashboard with real data behind it.
    await page.goto('/dashboard');
    const dashboard = await scan(page);
    expect(dashboard.violations, `dashboard\n${describe(dashboard)}`).toEqual([]);

    // --- Readiness, with a target set so the projection panel renders.
    await page.evaluate(async () => {
      await fetch('/api/exam-targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
        body: JSON.stringify({ examKey: 'digital-sat', targetScore: 1400, targetDate: null }),
      });
    });
    await page.goto('/readiness?exam=digital-sat');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Are you ready?');
    const readiness = await scan(page);
    expect(readiness.violations, `readiness\n${describe(readiness)}`).toEqual([]);

    // --- Mistake notebook and study plan.
    for (const path of ['/review', '/study-plan']) {
      await page.goto(path);
      const scanned = await scan(page);
      expect(scanned.violations, `${path}\n${describe(scanned)}`).toEqual([]);
    }
  });
});

// ---------------------------------------------------------------------------
// Contrast, checked at the size text is actually rendered
// ---------------------------------------------------------------------------

test.describe('accessibility: colour contrast', () => {
  test('every public page passes contrast on its own', async ({ page }) => {
    for (const { path } of PUBLIC_PAGES.slice(0, 6)) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withRules(['color-contrast', 'color-contrast-enhanced'])
        .analyze();
      const blocking = results.violations.filter((v) => v.id === 'color-contrast');
      expect(blocking, `${path}\n${describe(results)}`).toEqual([]);
    }
  });
});
