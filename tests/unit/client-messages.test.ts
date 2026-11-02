import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { pickMessages } from '@/i18n/client-messages';
import { LOCALES } from '@/i18n/locales';
import { NAMESPACES } from '@/i18n/namespaces';

/**
 * Public pages send the browser only the catalogues their client components
 * use (src/i18n/client-messages.tsx). These are the picks they make.
 */
const PUBLIC_PICKS = [['common'], ['common', 'home', 'player.stimulus'], ['common', 'billing']];

function catalogue(locale: string) {
  return Object.fromEntries(
    NAMESPACES.map((ns) => [ns, JSON.parse(fs.readFileSync(path.resolve('messages', locale, `${ns}.json`), 'utf8'))]),
  );
}

describe('client message picks', () => {
  it('copy whole namespaces and nested parts, and nothing else', () => {
    const messages = { common: { a: 'A' }, player: { stimulus: { b: 'B' }, other: { c: 'C' } }, billing: { d: 'D' } };
    expect(pickMessages(messages, ['common', 'player.stimulus'])).toEqual({ common: { a: 'A' }, player: { stimulus: { b: 'B' } } });
  });

  it('refuse a path that does not exist, so a typo fails loudly instead of showing keys', () => {
    expect(() => pickMessages({ common: {} }, ['comon'])).toThrow(/comon/);
  });

  it('resolve in every language for every pick a public page makes', () => {
    for (const locale of LOCALES) {
      const messages = catalogue(locale);
      for (const pick of PUBLIC_PICKS) expect(() => pickMessages(messages, pick), `${locale}: ${pick.join(', ')}`).not.toThrow();
    }
  });

  it('leave public pages far lighter than the whole catalogue', () => {
    const messages = catalogue('en');
    const whole = JSON.stringify(messages).length;
    for (const pick of PUBLIC_PICKS) expect(JSON.stringify(pickMessages(messages, pick)).length, pick.join(', ')).toBeLessThan(whole / 4);
  });
});
