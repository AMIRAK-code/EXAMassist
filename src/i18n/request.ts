import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { NAMESPACES } from './namespaces';
import { DEFAULT_LOCALE } from './locales';

type Messages = Record<string, unknown>;

async function load(locale: string): Promise<Messages> {
  const parts = await Promise.all(
    NAMESPACES.map(async (ns) => {
      try {
        return [ns, (await import(`../../messages/${locale}/${ns}.json`)).default as Messages] as const;
      } catch {
        return [ns, {}] as const;
      }
    }),
  );
  return Object.fromEntries(parts);
}

/** English underneath, the locale on top: a missing key shows English, never a raw key. */
function deepMerge(base: Messages, over: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(over)) {
    const current = out[key];
    out[key] =
      value && typeof value === 'object' && !Array.isArray(value) && current && typeof current === 'object'
        ? deepMerge(current as Messages, value as Messages)
        : value;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const english = await load(DEFAULT_LOCALE);
  const messages = locale === DEFAULT_LOCALE ? english : deepMerge(english, await load(locale));
  // One time zone for server and browser, so a date never renders differently
  // in each; the site's exams and deadlines are Italian.
  return { locale, messages, timeZone: 'Europe/Rome' };
});
