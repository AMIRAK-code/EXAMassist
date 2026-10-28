import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  isLiteralElement,
  isPluralElement,
  isPoundElement,
  isSelectElement,
  isTagElement,
  parse,
  type MessageFormatElement,
} from '@formatjs/icu-messageformat-parser';
import { LOCALES, localizePath, splitLocale } from '@/i18n/locales';
import { NAMESPACES } from '@/i18n/namespaces';

/**
 * Every language must say everything English says, with the same
 * placeholders and tags, so no page falls back to English unnoticed and no
 * translated sentence drops a number or a link.
 */

type Tree = { [key: string]: string | Tree };

function load(locale: string, ns: string): Tree | null {
  const file = path.resolve(`messages/${locale}/${ns}.json`);
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as Tree) : null;
}

function flatten(tree: Tree, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.set(full, value);
    else for (const [k, v] of flatten(value, full)) out.set(k, v);
  }
  return out;
}

/**
 * ICU arguments ({name}, {count, plural, ...}) and rich-text tags (<link>),
 * read by the ICU parser, so the words inside a plural or select branch
 * ("one {Source}") are text, not arguments. A message that does not parse
 * fails here too.
 */
function tokens(message: string): string[] {
  const found = new Set<string>();
  const walk = (elements: MessageFormatElement[]) => {
    for (const element of elements) {
      if (isLiteralElement(element) || isPoundElement(element)) continue;
      if (isTagElement(element)) {
        found.add(`<${element.value}>`);
        walk(element.children);
        continue;
      }
      found.add(`{${element.value}}`);
      if (isPluralElement(element) || isSelectElement(element)) {
        for (const option of Object.values(element.options)) walk(option.value);
      }
    }
  };
  walk(parse(message));
  return [...found].sort();
}

describe('message catalogues', () => {
  for (const ns of NAMESPACES) {
    const english = load('en', ns);

    it(`has an English ${ns} catalogue`, () => {
      expect(english).not.toBeNull();
    });
    if (!english) continue;
    const en = flatten(english);

    for (const locale of LOCALES.filter((l) => l !== 'en')) {
      it(`${locale}/${ns} has exactly the English keys, placeholders and tags`, () => {
        const translated = load(locale, ns);
        expect(translated, `messages/${locale}/${ns}.json is missing`).not.toBeNull();
        const tr = flatten(translated!);
        expect([...tr.keys()].sort()).toEqual([...en.keys()].sort());
        for (const [key, value] of en) {
          expect(tokens(tr.get(key) ?? ''), `${locale}/${ns}: ${key}`).toEqual(tokens(value));
          expect((tr.get(key) ?? '').trim().length, `${locale}/${ns}: ${key} is empty`).toBeGreaterThan(0);
        }
      });
    }
  }
});

describe('locale paths', () => {
  it('keeps English at the bare path and prefixes every other language', () => {
    expect(localizePath('/exams', 'en')).toBe('/exams');
    expect(localizePath('/exams', 'it')).toBe('/it/exams');
    expect(localizePath('/', 'pl')).toBe('/pl');
    expect(splitLocale('/tr/guides/x')).toEqual({ locale: 'tr', path: '/guides/x' });
    expect(splitLocale('/es')).toEqual({ locale: 'es', path: '/' });
    expect(splitLocale('/exams')).toEqual({ locale: 'en', path: '/exams' });
  });
});
