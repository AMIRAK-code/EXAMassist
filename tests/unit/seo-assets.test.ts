import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { listGuides } from '@/lib/content/guides';
import { EXAM_HUBS } from '@/lib/exams/registry';
import { INDEXNOW_KEY, indexNowPayload, sitemapUrls } from '@/lib/seo/indexnow';
import { shareCards } from '@/lib/seo/share-cards';

/**
 * The files search engines and link previews fetch beside the pages: the share
 * images, the Apple touch icon and the IndexNow key.
 */

function pngSize(file: string): { width: number; height: number } {
  const bytes = fs.readFileSync(file);
  expect(bytes.subarray(1, 4).toString('latin1'), file).toBe('PNG');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe('share images', () => {
  it('has one card for the site, each exam and each guide', () => {
    const keys = shareCards().map((card) => card.key);
    expect(new Set(keys).size).toBe(keys.length);
    const expected = ['site', ...EXAM_HUBS.map((hub) => `exam-${hub.slug}`), ...listGuides().map((guide) => `guide-${guide.slug}`)];
    expect([...keys].sort()).toEqual(expected.sort());
  });

  it('has a 1200 × 630 PNG for every card (npm run seo:og-images draws them)', () => {
    for (const card of shareCards()) {
      expect(pngSize(path.join('public', 'og', `${card.key}.png`)), card.key).toEqual({ width: 1200, height: 630 });
    }
  });

  it('says on every card that the site is independent', () => {
    for (const card of shareCards()) expect(card.footnote, card.key).toMatch(/^Independent/);
  });

  it('has a 180 × 180 Apple touch icon', () => {
    expect(pngSize(path.join('src', 'app', 'apple-icon.png'))).toEqual({ width: 180, height: 180 });
  });
});

describe('IndexNow', () => {
  it('serves its key from public/<key>.txt', () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-f0-9]{32}$/);
    expect(fs.readFileSync(path.join('public', `${INDEXNOW_KEY}.txt`), 'utf8').trim()).toBe(INDEXNOW_KEY);
  });

  it('submits only URLs on the site’s own host, once each', () => {
    const urls = ['https://uniexamer.com/', 'https://uniexamer.com/exams', 'https://uniexamer.com/', 'https://exam.assist365.app/exams'];
    expect(indexNowPayload('https://uniexamer.com', urls)).toEqual({
      host: 'uniexamer.com',
      key: INDEXNOW_KEY,
      keyLocation: `https://uniexamer.com/${INDEXNOW_KEY}.txt`,
      urlList: ['https://uniexamer.com/', 'https://uniexamer.com/exams'],
    });
  });

  it('reads the URLs out of a sitemap', () => {
    const xml = '<urlset><url><loc>https://uniexamer.com/</loc></url><url><loc>\n  https://uniexamer.com/exams\n</loc></url></urlset>';
    expect(sitemapUrls(xml)).toEqual(['https://uniexamer.com/', 'https://uniexamer.com/exams']);
  });
});
