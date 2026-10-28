/**
 * Draws the share images (Open Graph / X) into public/og/<key>.png, one per
 * card in src/lib/seo/share-cards.ts. Run it after adding a guide or exam,
 * after changing a title, or after a new logo pack:
 *
 *   npm run seo:og-images
 *
 * The cards use the site's own font, the brand colours and the logo files in
 * public/brand, drawn by a local Chrome (or Edge) through Playwright.
 * tests/unit/seo-assets.test.ts fails while any card is missing its file. The
 * Apple touch icon (src/app/apple-icon.png) comes ready-made in the logo pack.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium, type Browser } from '@playwright/test';
import { shareCards, type ShareCard } from '../src/lib/seo/share-cards';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public', 'og');

const dataUri = (file: string, type: string) =>
  `data:${type};base64,${fs.readFileSync(path.join(ROOT, file)).toString('base64')}`;

const FONT = dataUri('src/app/_fonts/bricolage-grotesque-latin-wght-normal.woff2', 'font/woff2');
// The PNG logo: the pack's SVG lettering is live Arial text (src/lib/site.ts).
const LOGO = dataUri('public/brand/uniexamer-logo.png', 'image/png');
const SYMBOL = dataUri('public/brand/uniexamer-symbol.svg', 'image/svg+xml');
// The logo pack's colours.
const NAVY = '#082448';
const BLUE = '#0866FF';

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Long guide titles get a smaller size so every card fits in four lines. */
function titleSize(title: string): number {
  if (title.length <= 40) return 76;
  if (title.length <= 64) return 64;
  return 54;
}

function cardHtml(card: ShareCard): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Bricolage; src: url(${FONT}) format('woff2'); font-weight: 200 800; }
* { box-sizing: border-box; }
html, body { margin: 0; width: 1200px; height: 630px; }
body { background: #f7f5ef; color: ${NAVY}; font-family: Bricolage, Arial, sans-serif; position: relative; overflow: hidden; }
.mark { position: absolute; right: -40px; bottom: -60px; width: 420px; opacity: 0.07; }
.frame { position: absolute; inset: 0; padding: 56px 80px; display: flex; flex-direction: column; }
/* The logo PNG has its own transparent margin; pull it back so the mark lines up with the text. */
.logo { height: 68px; align-self: flex-start; margin-left: -8px; }
.body { margin-top: auto; max-width: 980px; }
.eyebrow { font-size: 26px; font-weight: 600; color: ${BLUE}; letter-spacing: 0.01em; }
h1 { margin: 18px 0 0; font-size: ${titleSize(card.title)}px; line-height: 1.06; font-weight: 700; letter-spacing: -0.02em; }
.foot { margin-top: 44px; padding-top: 22px; border-top: 2px solid #dad6cb; display: flex; justify-content: space-between; font-size: 24px; color: #454a57; }
.foot strong { color: ${NAVY}; font-weight: 650; }
</style></head><body>
<img class="mark" src="${SYMBOL}" alt="">
<div class="frame">
  <img class="logo" src="${LOGO}" alt="">
  <div class="body">
    <div class="eyebrow">${escape(card.eyebrow)}</div>
    <h1>${escape(card.title)}</h1>
  </div>
  <div class="foot"><strong>uniexamer.com</strong><span>${escape(card.footnote)}</span></div>
</div>
</body></html>`;
}

async function launch(): Promise<Browser> {
  for (const channel of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ channel });
    } catch {
      /* try the next installed browser */
    }
  }
  return chromium.launch();
}

async function main(): Promise<void> {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    const cards = shareCards();
    for (const card of cards) {
      await page.setContent(cardHtml(card), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(OUT_DIR, `${card.key}.png`), type: 'png' });
    }

    // Files no card asks for any more would only be dead weight in the deploy.
    const keep = new Set(cards.map((card) => `${card.key}.png`));
    for (const file of fs.readdirSync(OUT_DIR)) {
      if (file.endsWith('.png') && !keep.has(file)) fs.rmSync(path.join(OUT_DIR, file));
    }

    console.log(`Wrote ${cards.length} share images to public/og.`);
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
