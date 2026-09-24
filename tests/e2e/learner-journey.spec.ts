import { expect, test, type Page } from '@playwright/test';
import { resetRateLimits } from './helpers';

/**
 * The learner journeys the release is defined by, exercised in a real browser
 * against a real server and a real seeded database.
 */

/** The setup form names the session it will create, e.g. "Start 10-question session". */
const START_SESSION = /^Start \d+-question session$/;

async function startPracticeSession(page: Page, examKey = 'digital-sat'): Promise<string> {
  await page.goto(`/practice/${examKey}`);
  await page.getByRole('button', { name: START_SESSION }).click();
  await page.waitForURL(/\/attempt\/[0-9a-f-]+$/);
  const match = /\/attempt\/([0-9a-f-]+)/.exec(page.url());
  if (!match) throw new Error(`Did not land on an attempt page: ${page.url()}`);
  return match[1];
}

/**
 * Answers whatever the current question actually is. The bank mixes response
 * types, so a session can open on a numeric-entry or select-all item just as
 * easily as on a multiple-choice one.
 */
async function answerCurrentQuestion(page: Page): Promise<void> {
  const radio = page.getByRole('radio').first();
  const checkbox = page.getByRole('checkbox').first();
  const textbox = page.getByRole('textbox').first();

  if (await radio.count()) {
    await expect(radio).toBeVisible();
    await radio.check();
  } else if (await checkbox.count()) {
    await expect(checkbox).toBeVisible();
    await checkbox.check();
  } else {
    await expect(textbox).toBeVisible();
    await textbox.fill('12');
  }

  await expect(page.getByText('1 of 10 answered')).toBeVisible();
}

/** Submits from inside the page, so the browser's session cookie is used. */
async function submitAttempt(page: Page, attemptId: string): Promise<{ status: number; body: string }> {
  return page.evaluate(async (id) => {
    const response = await fetch(`/api/attempts/${id}/submit`, {
      method: 'POST',
      headers: { 'X-Requested-With': 'examer' },
    });
    return { status: response.status, body: await response.text() };
  }, attemptId);
}

// Every test comes from one address; see helpers.ts.
test.beforeEach(() => resetRateLimits());

test.describe('discovery', () => {
  test('a visitor can reach an exam guide from the homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Big ambitions');

    await page.getByRole('link', { name: 'Choose your exam' }).click();
    await expect(page).toHaveURL(/\/exams$/);

    await page.getByRole('link', { name: 'Digital SAT', exact: true }).first().click();
    await expect(page).toHaveURL(/\/exams\/digital-sat$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Digital SAT');
  });

  test('the exam guide states the verified structure and cites the test maker', async ({ page }) => {
    await page.goto('/exams/digital-sat/format');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/format and scoring/i);
    await expect(page.getByRole('table').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sources' })).toBeVisible();

    const html = await page.content();
    expect(html).toContain('collegeboard.org');
  });

  test('public pages carry a canonical URL and structured data', async ({ page }) => {
    await page.goto('/exams/digital-sat');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);

    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.length).toBeGreaterThan(0);
    const parsed = jsonLd.flatMap((raw) => {
      const value = JSON.parse(raw);
      return Array.isArray(value) ? value : [value];
    });
    expect(parsed.some((entry) => entry['@type'] === 'BreadcrumbList')).toBe(true);
  });
});

test.describe('practice', () => {
  test('a guest can practise, see an explanation and reach results', async ({ page }) => {
    const attemptId = await startPracticeSession(page);

    await expect(page.getByRole('heading', { name: /^Question 1/ })).toBeVisible();
    await answerCurrentQuestion(page);

    // Untimed practice reveals the explanation once the learner checks the answer.
    await page.getByRole('button', { name: 'Check answer' }).click();
    await expect(page.getByText(/^(Correct|Not correct)/).first()).toBeVisible();

    const submitted = await submitAttempt(page, attemptId);
    expect(submitted.status, submitted.body).toBe(200);

    await page.goto(`/attempt/${attemptId}/results`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your results');
    await expect(page.getByRole('heading', { name: 'Performance by skill' })).toBeVisible();
  });

  test('answers and question order survive a reload', async ({ page }) => {
    await startPracticeSession(page);
    await answerCurrentQuestion(page);

    const stemBefore = await page.locator('article .question-body').first().innerText();
    await page.reload();

    const stemAfter = await page.locator('article .question-body').first().innerText();
    expect(stemAfter).toBe(stemBefore);
    await expect(page.getByText('1 of 10 answered')).toBeVisible();
    await expect(page.getByRole('button', { name: /Question 1, answered/ })).toBeVisible();
  });

  test('results never present an invented scaled score', async ({ page }) => {
    const attemptId = await startPracticeSession(page);
    await answerCurrentQuestion(page);
    await submitAttempt(page, attemptId);
    await page.goto(`/attempt/${attemptId}/results`);

    await expect(page.getByText(/what we do not provide/i)).toBeVisible();
    await expect(page.getByText(/do not report percentiles/i)).toBeVisible();
  });

  test('a format the bank cannot fill is shown as unavailable, with the reason', async ({ page }) => {
    await page.goto('/practice/lsat');
    await expect(page.getByText(/Not enough reviewed questions yet/i).first()).toBeVisible();
  });
});

test.describe('authorization', () => {
  test('one learner cannot open another learner’s attempt', async ({ browser }) => {
    const first = await browser.newContext();
    const firstPage = await first.newPage();
    const attemptId = await startPracticeSession(firstPage);

    // A separate browser context: different cookies, a different guest.
    const second = await browser.newContext();
    const secondPage = await second.newPage();
    await secondPage.goto('/');

    const read = await secondPage.request.get(`/api/attempts/${attemptId}`, {
      headers: { 'X-Requested-With': 'examer' },
      failOnStatusCode: false,
    });
    expect([401, 404]).toContain(read.status());

    const write = await secondPage.request.post(`/api/attempts/${attemptId}/answer`, {
      headers: { 'X-Requested-With': 'examer' },
      data: { partIndex: 0, position: 0, response: { type: 'single_select', optionId: 'a' } },
      failOnStatusCode: false,
    });
    expect([401, 404]).toContain(write.status());

    await first.close();
    await second.close();
  });


  test('private learner pages redirect a signed-out visitor to sign in', async ({ page }) => {
    for (const path of ['/dashboard', '/review', '/study-plan', '/account']) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should not error`).toBeLessThan(400);
      expect(page.url(), `${path} should redirect to sign-in`).toContain('/sign-in');
      expect(page.url()).toContain(encodeURIComponent(path));
    }
  });

  test('the admin area is hidden from a signed-out visitor and from a learner', async ({ page }) => {
    // Signed out: redirected to sign in, carrying a return path.
    await page.goto('/admin');
    expect(page.url()).toContain('/sign-in');

    // Signed in as an ordinary learner: 404, so the area's existence is not
    // confirmed, and the admin API refuses with 403.
    const email = `probe-${Date.now()}@example.invalid`;
    const signUp = await page.evaluate(async (address) => {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
        body: JSON.stringify({ email: address, password: 'a quiet harbour at dawn' }),
      });
      return response.status;
    }, email);
    expect(signUp).toBe(201);

    for (const path of ['/admin', '/admin/questions', '/admin/flags']) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should be 404 for a learner`).toBe(404);
    }

    const apiStatus = await page.evaluate(async () => {
      const response = await fetch('/api/admin/flags/does-not-exist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      return response.status;
    });
    expect(apiStatus).toBe(403);

    // The learner's own area still works.
    const dashboard = await page.goto('/dashboard');
    expect(dashboard?.status()).toBe(200);
  });

  test('private pages are marked noindex', async ({ page }) => {
    const attemptId = await startPracticeSession(page);
    await page.goto(`/attempt/${attemptId}`);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });

  test('a cross-site POST is rejected', async ({ page }) => {
    await page.goto('/');
    const response = await page.request.post('/api/attempts', {
      headers: { Origin: 'https://attacker.example', 'Content-Type': 'application/json' },
      data: { examKey: 'digital-sat', blueprintId: 'practice' },
      failOnStatusCode: false,
    });
    expect(response.status()).toBe(403);
  });
});

test.describe('accessibility and responsiveness', () => {
  test('the practice player is operable by keyboard alone', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes('mobile'), 'Tab traversal is a desktop concern.');
    await startPracticeSession(page);

    // The bank mixes response types, so walk the question navigator until we
    // reach one that actually has radios rather than skipping the test.
    for (let position = 1; position <= 10; position += 1) {
      if ((await page.getByRole('radio').count()) > 0) break;
      const next = page.getByRole('button', { name: new RegExp(`Question ${position + 1},`) });
      if ((await next.count()) === 0) break;
      await next.click();
    }
    expect(await page.getByRole('radio').count()).toBeGreaterThan(0);

    const seen: string[] = [];
    let isRadio = false;
    for (let i = 0; i < 40 && !isRadio; i += 1) {
      await page.keyboard.press('Tab');
      const description = await page.evaluate(() => {
        const element = document.activeElement as HTMLElement | null;
        if (!element) return 'none';
        const type = element.getAttribute('type');
        return `${element.tagName.toLowerCase()}${type ? `[${type}]` : ''}`;
      });
      seen.push(description);
      isRadio = description === 'input[radio]';
    }
    expect(isRadio, `focus order was: ${seen.join(' -> ')}`).toBe(true);

    await page.keyboard.press('Space');
    await expect(page.getByText('1 of 10 answered')).toBeVisible();
  });

  test('a skip link is the first thing a keyboard user reaches', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const text = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '');
    expect(text.toLowerCase()).toContain('skip to main content');
  });

  test('every public page has exactly one h1 and a main landmark', async ({ page }) => {
    for (const path of ['/', '/exams', '/exams/digital-sat', '/guides']) {
      await page.goto(path);
      expect(await page.locator('h1').count(), `h1 count on ${path}`).toBe(1);
      await expect(page.locator('main#main')).toHaveCount(1);
    }
  });

  test('the practice player works at phone width without horizontal scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await startPracticeSession(page);

    await expect(page.getByRole('heading', { name: /^Question 1/ })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await answerCurrentQuestion(page);
  });

  test('question navigator buttons announce their state', async ({ page }) => {
    await startPracticeSession(page);
    await expect(page.getByRole('button', { name: /Question 2, not answered/ })).toBeVisible();
  });
});

test.describe('readiness', () => {
  test('assesses readiness against a target without inventing a score', async ({ page }) => {
    // A learner with a target and some practice behind them.
    await page.goto('/');
    const email = `readiness-${Date.now()}@example.invalid`;
    const signUp = await page.evaluate(async (address) => {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
        body: JSON.stringify({ email: address, password: 'a quiet harbour at dawn' }),
      });
      return response.status;
    }, email);
    expect(signUp).toBe(201);

    await page.goto('/practice/bocconi-undergraduate');
    await page.getByRole('button', { name: START_SESSION }).click();
    await page.waitForURL(/\/attempt\/[0-9a-f-]+$/);
    const attemptId = /\/attempt\/([0-9a-f-]+)/.exec(page.url())![1];

    await answerCurrentQuestion(page);
    await submitAttempt(page, attemptId);

    const saved = await page.evaluate(async () => {
      const response = await fetch('/api/exam-targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
        body: JSON.stringify({ examKey: 'bocconi-undergraduate', targetScore: 35, targetDate: null }),
      });
      return response.status;
    });
    expect(saved).toBe(200);

    await page.goto('/readiness?exam=bocconi-undergraduate');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Are you ready?');

    // Bocconi publishes its raw scoring in full, so the target IS quantified,
    // and the official floor is named as a requirement rather than a goal.
    await expect(page.getByText('Projected raw score')).toBeVisible();
    await expect(page.getByText('Official eligibility floor')).toBeVisible();

    // And the limits are never omitted.
    await expect(page.getByText(/do not report percentiles/i)).toBeVisible();
    // The limitations section is always rendered open, never behind a details.
    await expect(page.getByRole('heading', { name: 'What this assessment is not' })).toBeVisible();
    await expect(page.getByText(/Every figure here comes from your answers/i)).toBeVisible();
  });

  test('refuses to project a score for an exam that does not publish its conversion', async ({ page }) => {
    await page.goto('/');
    const email = `readiness-sat-${Date.now()}@example.invalid`;
    await page.evaluate(async (address) => {
      await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
        body: JSON.stringify({ email: address, password: 'a quiet harbour at dawn' }),
      });
    }, email);

    await page.goto('/practice/digital-sat');
    await page.getByRole('button', { name: START_SESSION }).click();
    await page.waitForURL(/\/attempt\/[0-9a-f-]+$/);
    const attemptId = /\/attempt\/([0-9a-f-]+)/.exec(page.url())![1];
    await answerCurrentQuestion(page);
    await submitAttempt(page, attemptId);

    await page.evaluate(async () => {
      await fetch('/api/exam-targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
        body: JSON.stringify({ examKey: 'digital-sat', targetScore: 1400, targetDate: null }),
      });
    });

    await page.goto('/readiness?exam=digital-sat');
    await expect(page.getByText(/We will not guess at this/i)).toBeVisible();
    await expect(page.getByText(/cannot tell you whether your practice equals 1400/i)).toBeVisible();
    await expect(page.getByText('Projected raw score')).toHaveCount(0);

    // A target on the wrong scale is refused rather than stored. 2400 was the
    // old three-section SAT; accepting it would make every figure nonsense.
    const outOfRange = await page.evaluate(async () => {
      const response = await fetch('/api/exam-targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
        body: JSON.stringify({ examKey: 'digital-sat', targetScore: 2400, targetDate: null }),
      });
      return { status: response.status, body: await response.text() };
    });
    expect(outOfRange.status).toBe(400);
    expect(outOfRange.body).toContain('400 to 1600');
  });

});

test.describe('indexing controls', () => {
  test('robots.txt disallows everything while indexing is switched off', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain('Disallow: /');
  });

  test('the sitemap is empty while indexing is switched off', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBe(true);
    expect(await response.text()).not.toContain('<loc>');
  });
});
