import fs from 'node:fs';
import path from 'node:path';
import { createElement, type ReactElement } from 'react';
import { NextIntlClientProvider, createTranslator } from 'next-intl';
import { NAMESPACES } from '@/i18n/namespaces';
import { renderText, type LearnerText, type Translate } from '@/lib/learning/text';

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
  return createElement(NextIntlClientProvider, { locale, messages: messagesFor(locale), timeZone: 'Europe/Rome', children: element });
}

let learning: Translate | null = null;

/**
 * Learner text from the learning modules (readiness, plan, suggestions,
 * dashboard steps) as an English reader sees it on the page.
 */
export function english(text: LearnerText): string {
  learning ??= createTranslator({ locale: 'en', messages: messagesFor('en'), namespace: 'learning' }) as unknown as Translate;
  return renderText(learning, text);
}

/** A list of learner texts (limitations, assumptions), each as English, joined as the page lists them. */
export function englishList(texts: LearnerText[]): string {
  return texts.map(english).join(' ');
}
