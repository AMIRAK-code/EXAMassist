import { expect, test, type Page } from '@playwright/test';

/**
 * The web font arriving after the first paint must not move these pages by
 * more than the layout-shift budget (CLS 0.02, docs/REDESIGN.md §14).
 *
 * Deterministic, with no network timing involved: web-font requests fail, so
 * the page lays out in the Arial fallback exactly as a slow first visit does.
 * Bricolage is then added through the FontFace API under the page's own family
 * name, and the layout shift Chrome reports for that swap is summed. The pages
 * are checked at the lab's viewport sizes.
 */

const BUDGET = 0.02;
const ROUTES = ['/practice/digital-sat', '/exams/digital-sat/format', '/exams/gre/format'];

async function swapInWebFont(page: Page): Promise<{ shift: number; textWidthChange: number }> {
  const face = await page.evaluate(() => {
    const family = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-bricolage')
      .split(',')[0]
      .replace(/['"\s]/g, '');
    for (const sheet of Array.from(document.styleSheets)) {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule instanceof CSSFontFaceRule && rule.style.getPropertyValue('font-family').replace(/['"\s]/g, '') === family) {
          const src = /url\(["']?([^"')]+)/.exec(rule.style.getPropertyValue('src'));
          if (src) return { family, src: src[1], weight: rule.style.getPropertyValue('font-weight') };
        }
      }
    }
    return null;
  });
  expect(face, 'the page declares Bricolage').not.toBeNull();
  const bytes = await (await page.request.get(face!.src)).body();

  // The total advance of the main content's text, summed over line boxes. One
  // heading is not enough: some are as wide in Arial Bold as in Bricolage.
  const textWidth = () =>
    page.evaluate(() => {
      const walker = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      let sum = 0;
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        range.selectNodeContents(node);
        for (const rect of Array.from(range.getClientRects())) sum += rect.width;
      }
      return sum;
    });
  const widthBefore = await textWidth();
  const shiftBefore = await page.evaluate(() => (window as unknown as { __shift: number }).__shift);

  await page.evaluate(
    async ({ family, weight, data }) => {
      const buffer = Uint8Array.from(atob(data), (c) => c.charCodeAt(0)).buffer;
      const font = new FontFace(family, buffer, { weight });
      await font.load();
      document.fonts.add(font);
      // Two frames: the relayout, then the paint the shift is reported for.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    },
    { family: face!.family, weight: face!.weight, data: bytes.toString('base64') },
  );
  await page.waitForTimeout(200);

  const shift = (await page.evaluate(() => (window as unknown as { __shift: number }).__shift)) - shiftBefore;
  return { shift, textWidthChange: Math.abs((await textWidth()) - widthBefore) };
}

for (const route of ROUTES) {
  test(`the web font arriving late shifts ${route} by less than the budget`, async ({ page, browserName }, testInfo) => {
    test.skip(browserName !== 'chromium', 'layout-shift entries are reported by Chromium only');
    await page.setViewportSize(testInfo.project.name.startsWith('mobile') ? { width: 390, height: 844 } : { width: 1440, height: 900 });
    await page.route('**/*.woff2', (request) => request.abort());
    await page.addInitScript(() => {
      const w = window as unknown as { __shift: number };
      w.__shift = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
          if (!entry.hadRecentInput) w.__shift += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto(route);
    await page.waitForLoadState('networkidle');
    const { shift, textWidthChange } = await swapInWebFont(page);
    testInfo.annotations.push({ type: 'layout shift', description: shift.toFixed(4) });

    // The swap really happened: the text changed width.
    expect(textWidthChange).toBeGreaterThan(20);
    expect(shift).toBeLessThanOrEqual(BUDGET);
  });
}
