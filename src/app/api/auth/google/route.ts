import type { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales';
import {
  GOOGLE_CALLBACK_PATH,
  GOOGLE_REQUEST_TTL_MINUTES,
  GOOGLE_START_PATH,
  GOOGLE_STATE_COOKIE,
  googleSettings,
  startGoogleSignIn,
} from '@/lib/auth/google';
import { googleRedirect, googleSignInPage } from '@/lib/auth/google-routes';
import { safeNext } from '@/lib/auth/next-path';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';

/**
 * Starts "Continue with Google": /api/auth/google?locale=it&next=/practice.
 *
 * A plain link, so it works without JavaScript. Starting a sign-in changes
 * nothing about who is signed in; only the callback does, and only for the
 * browser holding this request's state cookie.
 */

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const requested = query.get('locale');
  const locale: Locale = isLocale(requested) ? requested : DEFAULT_LOCALE;
  const next = safeNext(query.get('next') ?? undefined);

  const settings = googleSettings();
  if (!settings) return googleRedirect(googleSignInPage(locale, next, 'unavailable'));

  // The state cookie is set on the host the sign-in starts on and must come
  // back with Google's answer, which arrives at the registered redirect URI.
  // Start on that same host (the www name and other domains move across),
  // once: `moved` stops a loop if a proxy ever reports a different origin.
  const canonical = new URL(settings.redirectUri);
  if (request.nextUrl.origin !== canonical.origin && !query.has('moved')) {
    const moved = new URL(GOOGLE_START_PATH, canonical);
    moved.search = query.toString();
    moved.searchParams.set('moved', '1');
    return googleRedirect(moved.toString());
  }

  try {
    const db = getDb();
    const limit = (await checkRateLimit(db, 'googleSignIn', callerKey(request)));
    if (!limit.allowed) return googleRedirect(googleSignInPage(locale, next, 'rate-limited'));

    const started = await startGoogleSignIn(db, settings, { next, locale });
    const response = googleRedirect(started.url);
    response.cookies.set(GOOGLE_STATE_COOKIE, started.state, {
      httpOnly: true,
      // Lax, not Strict: the cookie must come back on Google's top-level
      // redirect to the callback, which is a cross-site navigation.
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: GOOGLE_CALLBACK_PATH,
      maxAge: GOOGLE_REQUEST_TTL_MINUTES * 60,
    });
    return response;
  } catch (error) {
    console.error('[google] a sign-in could not be started:', error instanceof Error ? error.message : error);
    return googleRedirect(googleSignInPage(locale, next, 'failed'));
  }
}
