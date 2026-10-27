import fs from 'node:fs';
import path from 'node:path';
import { createElement, type ReactElement } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { NAMESPACES } from '@/i18n/namespaces';

/** The message catalogue for one locale, as the app loads it (English only, no fallback merge). */
export function messagesFor(locale = 'en'): Record<string, unknown> {
  return Object.fromEntries(
    NAMESPACES.map((ns) => {
      const file = path.resolve(`messages/${locale}/${ns}.json`);
      return [ns, fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {}];
    }),
  );
}

/** Wraps a client component so its translations and locale-aware links resolve, as in the app. */
export function withIntl(element: ReactElement, locale = 'en'): ReactElement {
  return createElement(NextIntlClientProvider, { locale, messages: messagesFor(locale), children: element });
}
