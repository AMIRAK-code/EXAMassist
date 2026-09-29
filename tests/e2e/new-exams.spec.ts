import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { resetRateLimits } from './helpers';

/**
 * The Politecnico di Torino TIL and CISIA TOLC exams, in a real browser: their
 * public pages are complete, sourced and accessible.
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


test.describe('Politecnico di Torino and CISIA exams', () => {
  test('their public pages pass an automated accessibility scan', async ({ page }) => {
    test.slow();
    for (const path of PAGES) {
      await page.goto(path);
      const result = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`), path).toEqual([]);
    }
  });

  test('the format guides state the published structure and the verified rules', async ({ page }) => {
    await page.goto('/exams/politecnico-di-torino-til/format');
    await expect(page.getByText(/42 questions in four consecutive, separately timed sections/)).toBeVisible();
    await expect(page.getByText(/30\/100 to be placed in the ranking/)).toBeVisible();

    await page.goto('/exams/cisia-tolc/format');
    await expect(page.getByText(/Logic 13 questions, Verbal comprehension 10, Mathematics 13/)).toBeVisible();
    await expect(page.getByText(/There is no national pass mark/).first()).toBeVisible();
  });
});
