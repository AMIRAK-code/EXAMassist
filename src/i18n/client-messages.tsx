import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { ReactNode } from 'react';

/**
 * Which message catalogues reach the browser.
 *
 * A NextIntlClientProvider without `messages` serialises every catalogue
 * (about 200 KB in English) into the HTML of each page, although public pages
 * run only a few client components. So the locale layout sends `common` alone,
 * for the header's mobile menu; a page whose client components need more wraps
 * them in ClientMessages with the catalogues they use; and the signed-in
 * areas, full of forms and the player, keep everything with AllClientMessages
 * in their layouts. A message missing here shows as its key in the browser,
 * so add the namespace when a public page gains a client component.
 */
export async function ClientMessages({ pick, children }: { pick: string[]; children: ReactNode }) {
  const messages = await getMessages();
  return <NextIntlClientProvider messages={pickMessages(messages, pick)}>{children}</NextIntlClientProvider>;
}

/** Every catalogue, for the signed-in areas' layouts. */
export function AllClientMessages({ children }: { children: ReactNode }) {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>;
}

/** The named catalogues, or parts of one by dotted path ("player.stimulus"). */
export function pickMessages(messages: AbstractIntlMessages, paths: string[]): AbstractIntlMessages {
  const picked: AbstractIntlMessages = {};
  for (const path of paths) {
    const keys = path.split('.');
    let source: AbstractIntlMessages | string | undefined = messages;
    let target = picked;
    keys.forEach((key, index) => {
      source = typeof source === 'object' ? source[key] : undefined;
      if (source === undefined) throw new Error(`No messages at "${path}"`);
      if (index === keys.length - 1) target[key] = source;
      else target = (target[key] ??= {}) as AbstractIntlMessages;
    });
  }
  return picked;
}
