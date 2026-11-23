import { expect, test } from '@playwright/test';

test('the Italian course catalogue can open the English Physics II module', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'NEXT_LOCALE', value: 'it', url: baseURL! }]);
  await page.goto('/it/courses');
  await page.getByRole('link', { name: 'Physics II for Computer Engineering', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Physics II for Computer Engineering', level: 1 })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: 'Start with lesson 1' })).toBeVisible();
  expect((await context.cookies()).find(cookie => cookie.name === 'NEXT_LOCALE')?.value).toBe('it');
});

test('a learner opens Physics II, experiments with polarisation and keeps lesson progress', async ({ page }) => {
  await page.goto('/courses');
  await page.getByRole('link', { name: 'Physics II for Computer Engineering', exact: true }).click();
  const lessonTitle = 'Energy, momentum and polarisation';
  await page.getByRole('link', { name: lessonTitle, exact: true }).click();
  await expect(page.getByRole('heading', { name: lessonTitle, exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Show the next step' }).first()).toBeVisible();

  const angle = page.getByRole('slider', { name: 'Filter angle' });
  const intensity = page.getByRole('status', { name: 'Transmitted intensity' });
  await expect(intensity).toHaveText('40.0 W/m²');
  for (let degree = 45; degree < 60; degree++) await angle.press('ArrowRight');
  await expect(intensity).toHaveText('20.0 W/m²');
  const incident = page.getByRole('slider', { name: 'Incident intensity' });
  for (let watts = 80; watts < 160; watts += 5) await incident.press('ArrowRight');
  await expect(intensity).toHaveText('40.0 W/m²');
  await angle.press('End');
  await expect(intensity).toHaveText('0.0 W/m²');
  await angle.press('Home');
  await expect(intensity).toHaveText('160.0 W/m²');

  await page.getByRole('button', { name: 'Show the next step' }).first().click();
  await expect(page.getByText('Step 1 of 2', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: /It quadruples/ }).click();
  await expect(page.getByText('Correct.', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Question. Select the card to flip it.' }).click();
  await page.getByRole('button', { name: 'I knew it' }).click();
  await expect(page.getByText('Card 2 of 4', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Mark this lesson complete' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: /Lesson complete/, pressed: true })).toBeVisible();
  await page.getByRole('link', { name: 'Back to the course contents' }).click();
  await expect(page.getByRole('progressbar', { name: 'Lessons complete in this browser' })).toHaveAttribute('aria-valuenow', '1');
});
