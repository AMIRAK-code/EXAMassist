import { describe, expect, it } from 'vitest';
import { GUEST_TTL_DAYS } from '@/lib/auth/session';
import fs from 'node:fs';
import path from 'node:path';
import { LOCALES } from '@/i18n/locales';
import { CONTACT, INDEPENDENCE_NOTICE, SITE, SOCIAL_LINKS } from '@/lib/site';
import { SUPPORT } from '@/lib/support';

/**
 * Public statements that describe behaviour, checked against the behaviour.
 * These are claims a learner relies on, so they must not drift from the code.
 */

/** The guest notes in every language that has a common catalogue. */
function guestNotes(): Array<{ locale: string; note: string }> {
  return LOCALES.flatMap((locale) => {
    const file = path.resolve(`messages/${locale}/common.json`);
    if (!fs.existsSync(file)) return [];
    const guest = (JSON.parse(fs.readFileSync(file, 'utf8')) as { guest?: Record<string, string> }).guest ?? {};
    return Object.values(guest).map((note) => ({ locale, note }));
  });
}

describe('guest messaging', () => {
  it('states the guest session lifetime the server actually applies, in every language', () => {
    const notes = guestNotes();
    expect(notes.length).toBeGreaterThanOrEqual(2);
    for (const { locale, note } of notes) {
      expect(note, locale).toMatch(new RegExp(`\\b${GUEST_TTL_DAYS}\\b`));
    }
  });

  it('never promises that signing in merges guest history', () => {
    for (const { note } of guestNotes().filter((n) => n.locale === 'en')) {
      expect(note.toLowerCase()).not.toMatch(/sign(ing)? in .*(keep|merge|move|bring)/);
    }
  });
});

describe('editorial claims', () => {
  it('does not claim a human editorial team the question records do not name', () => {
    expect(INDEPENDENCE_NOTICE).not.toMatch(/editorial team/i);
    expect(INDEPENDENCE_NOTICE).toMatch(/AI-assisted/);
    expect(SITE.publisher).not.toMatch(/editorial/i);
  });
});

describe('support promise', () => {
  it('states one reply promise, one business day, everywhere and in every language', () => {
    expect(SUPPORT.firstReplyBusinessDays).toBe(1);
    expect(SUPPORT.email).toBe(CONTACT.support);
    const read = (locale: string, ns: string) => JSON.parse(fs.readFileSync(path.resolve(`messages/${locale}/${ns}.json`), 'utf8'));
    for (const locale of LOCALES) {
      const common = read(locale, 'common') as { footer: { support: { note: string } } };
      const about = read(locale, 'about') as { support: { meta: { description: string }; how: { reply: string }; promise: { body: string } } };
      // Every statement of the promise takes the number from SUPPORT, and none states another one.
      for (const text of [common.footer.support.note, about.support.meta.description, about.support.how.reply, about.support.promise.body]) {
        expect(text, locale).toContain('{days, plural,');
        expect(text, locale).not.toMatch(/(24|48|72)/);
      }
    }
    expect(CONTACT.support).toBe('support@uniexamer.com');
    expect(CONTACT.info).toBe('info@uniexamer.com');
  });

  it('links every profile over https, and lists each once', () => {
    expect(new Set(SOCIAL_LINKS.map((link) => link.href)).size).toBe(SOCIAL_LINKS.length);
    for (const link of SOCIAL_LINKS) expect(link.href).toMatch(/^https:\/\//);
  });
});
