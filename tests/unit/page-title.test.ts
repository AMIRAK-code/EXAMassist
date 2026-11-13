import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { TITLE_BUDGET, pageTitle, renderedTitle } from '@/lib/seo/title';

describe('page titles', () => {
  it('keeps the site name, through the layout template, when the whole title fits', () => {
    expect(pageTitle('Pricing')).toBe('Pricing');
    expect(renderedTitle(pageTitle('Pricing'))).toBe('Pricing | UniExamer');
  });

  it('adds context parts in order while they fit, then the site name', () => {
    expect(renderedTitle(pageTitle('Sine and cosine rules', 'TOLC-I course'))).toBe('Sine and cosine rules | TOLC-I course | UniExamer');
  });

  it('drops the site name before the page’s own context', () => {
    // 53 characters with the course; the site name would make 65.
    expect(pageTitle('Exponential and logarithmic equations', 'TOLC-I course')).toEqual({
      absolute: 'Exponential and logarithmic equations | TOLC-I course',
    });
  });

  it('never cuts the page’s own name, even past the budget', () => {
    const name = 'Algebraic expressions: powers, radicals, polynomials and identities';
    expect(name.length).toBeGreaterThan(TITLE_BUDGET);
    expect(pageTitle(name, 'Bocconi test course')).toEqual({ absolute: name });
  });

  it('stops at the first context part that does not fit, rather than skipping to a later one', () => {
    expect(renderedTitle(pageTitle('Short name', 'A context part far too long to sit beside the name at all', 'Tiny'))).toBe('Short name | UniExamer');
  });

  it('renders within the budget whenever the name alone fits, and always starts with the name', () => {
    for (let length = 1; length <= 80; length++) {
      const name = 'x'.repeat(length);
      for (const context of [[], ['GRE course'], ['Bocconi master’s course', 'More']]) {
        const rendered = renderedTitle(pageTitle(name, ...context));
        expect(rendered.startsWith(name), `${length} ${context}`).toBe(true);
        expect(rendered.length, `${length} ${context}`).toBeLessThanOrEqual(Math.max(TITLE_BUDGET, length));
      }
    }
  });

  it('is what the indexable listing, exam, guide, course and lesson pages use', () => {
    const app = path.join('src', 'app', '[locale]');
    for (const file of [
      ['exams', 'page.tsx'],
      ['exams', '[hub]', 'page.tsx'],
      ['exams', '[hub]', 'format', 'page.tsx'],
      ['guides', 'page.tsx'],
      ['guides', '[slug]', 'page.tsx'],
      ['courses', 'page.tsx'],
      ['courses', '[course]', 'page.tsx'],
      ['courses', '[course]', '[lesson]', 'page.tsx'],
    ]) {
      const source = fs.readFileSync(path.join(app, ...file), 'utf8');
      const metadata = source.slice(source.indexOf('export async function generateMetadata'));
      expect(metadata, file.join('/')).toMatch(/\n\s+title: pageTitle\(/);
    }
  });
});
