import { createTranslator, type AbstractIntlMessages } from 'next-intl';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales';
import { SITE } from '@/lib/site';
import en from '../../../messages/en/auth.json';
import es from '../../../messages/es/auth.json';
import it from '../../../messages/it/auth.json';
import pl from '../../../messages/pl/auth.json';
import tr from '../../../messages/tr/auth.json';
import type { OutgoingEmail } from './send';

/**
 * The text of every email the site sends. Each one says what the code is for,
 * how long it lasts, and what to do if the reader did not ask for it, because
 * an unexpected code is the moment someone decides whether to trust us.
 *
 * The code leads the subject line so it can be read from a notification.
 *
 * The wording lives in messages/<locale>/auth.json under `email`, and each
 * message goes out in the language of the page it was asked for on.
 */

export type CodeEmailPurpose = 'sign-in' | 'reset-password' | 'verify-email';

const CATALOGUES: Record<Locale, AbstractIntlMessages> = { en, it, tr, es, pl };

const KEYS: Record<CodeEmailPurpose, { tag: string; key: 'signIn' | 'resetPassword' | 'verifyEmail' }> = {
  'sign-in': { tag: 'sign-in-code', key: 'signIn' },
  'reset-password': { tag: 'password-reset-code', key: 'resetPassword' },
  'verify-email': { tag: 'verify-email-code', key: 'verifyEmail' },
};

/** A locale named by a request, or English when it names none we publish. */
export function emailLocale(value: unknown): Locale {
  return typeof value === 'string' && isLocale(value) ? value : DEFAULT_LOCALE;
}

export function codeEmail(
  purpose: CodeEmailPurpose,
  to: string,
  code: string,
  ttlMinutes: number,
  locale: Locale = DEFAULT_LOCALE,
): OutgoingEmail {
  const { tag, key } = KEYS[purpose];
  const translate = createTranslator({
    locale,
    messages: { auth: CATALOGUES[locale] ?? CATALOGUES[DEFAULT_LOCALE] } as AbstractIntlMessages,
  });
  const t = (key: string, values: Record<string, string | number>) => translate(`auth.email.${key}` as never, values as never) as string;
  const site = SITE.name;
  return {
    to,
    tag,
    subject: t(`${key}.subject`, { code, site }),
    text: [
      t(`${key}.intro`, { site }),
      '',
      `    ${code}`,
      '',
      t('expiry', { minutes: ttlMinutes }),
      '',
      t(`${key}.ignore`, { site }),
      '',
      t('signature', { site }),
    ].join('\n'),
  };
}
