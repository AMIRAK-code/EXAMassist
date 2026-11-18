import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { assertSearchReady } from '../../scripts/search-ready';

/** The split deploy refuses to publish saved pages that would hurt search (docs/SPLIT-HOSTING.md). */
describe('the search check before a split release', () => {
  let dir = '';
  const page = (canonical: string, robots = 'index, follow') =>
    `<html><head><meta name="robots" content="${robots}"/><link rel="canonical" href="${canonical}"/></head><body>ok</body></html>`;
  const write = (file: string, body: string) => {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
    fs.writeFileSync(path.join(dir, file), body);
  };

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'search-ready-'));
    for (const [file, url] of [
      ['index.html', 'https://uniexamer.com'],
      ['exams.html', 'https://uniexamer.com/exams'],
      ['courses/imat.html', 'https://uniexamer.com/courses/imat'],
      ['it/courses/imat.html', 'https://uniexamer.com/it/courses/imat'],
      ['courses/imat/biological-molecules.html', 'https://uniexamer.com/courses/imat/biological-molecules'],
      ['it/courses/imat/biological-molecules.html', 'https://uniexamer.com/it/courses/imat/biological-molecules'],
    ]) {
      write(file, page(url));
    }
    write('robots.txt', 'User-agent: *\nAllow: /\nDisallow: /account\n\nSitemap: https://uniexamer.com/sitemap.xml\n');
    write('sitemap.xml', '<urlset><url><loc>https://uniexamer.com/courses/imat</loc></url></urlset>');
  });
  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  it('passes pages as uniexamer.com serves them', () => {
    expect(() => assertSearchReady(dir)).not.toThrow();
  });

  it('refuses noindex pages, a canonical on another address, and a closed robots.txt', () => {
    write('index.html', page('https://exa-massist.vercel.app', 'noindex, nofollow'));
    write('robots.txt', 'User-agent: *\nDisallow: /\n');
    expect(() => assertSearchReady(dir)).toThrow(/noindex[\s\S]*canonical[\s\S]*vercel\.app[\s\S]*disallows the whole site/);
  });
});
