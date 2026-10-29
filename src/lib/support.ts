import { LOCALES, LOCALE_INFO } from '@/i18n/locales';

/**
 * Human support: the one place its promises are written down. Every page that
 * mentions support reads them from here, so a change of address or reply time
 * is one edit.
 *
 * As set by the owners on 2026-10-28: a person (never a bot) reads and answers
 * every message sent to this address, with a first reply within one business
 * day, in any of the site's languages.
 */
export const SUPPORT = {
  email: 'support@uniexamer.com',
  firstReplyBusinessDays: 1,
  /** Replies are written in every language the site is offered in. */
  languages: LOCALES,
} as const;

/** The support languages, each in its own name: "English, Italiano, Türkçe, Español, Polski". */
export const SUPPORT_LANGUAGE_NAMES: readonly string[] = SUPPORT.languages.map((code) => LOCALE_INFO[code].nativeName);

export function supportMailto(subject?: string): string {
  return `mailto:${SUPPORT.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
}
