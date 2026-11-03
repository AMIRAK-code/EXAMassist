import { NextResponse } from 'next/server';
import { localizePath, type Locale } from '@/i18n/locales';
import type { GoogleNotice } from './google';
import { withNext } from './next-path';

/**
 * Where the Google routes send the browser. They are API routes, outside the
 * locale-prefixed pages, so they put the learner's language back into the
 * path themselves.
 */

/**
 * A 303 to a path on this site (or Google's consent page), never cached. The
 * Location stays relative for paths, so the browser stays on the host it is on.
 */
export function googleRedirect(location: string): NextResponse {
  return new NextResponse(null, { status: 303, headers: { Location: location, 'Cache-Control': 'no-store' } });
}

/** The sign-in page in the learner's language, saying why Google sign-in did not finish. */
export function googleSignInPage(locale: Locale, next: string | null, notice: GoogleNotice): string {
  return withNext(`${localizePath('/sign-in', locale)}?google=${notice}`, next);
}

/** Where a signed-in learner goes: where they were heading, or their account. */
export function googleDestination(locale: Locale, next: string | null): string {
  return localizePath(next ?? '/account', locale);
}
