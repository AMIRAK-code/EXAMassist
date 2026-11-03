import type { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { DEFAULT_LOCALE } from '@/i18n/locales';
import {
  GOOGLE_CALLBACK_PATH,
  GOOGLE_STATE_COOKIE,
  finishGoogleSignIn,
  googleNotice,
  googleSettings,
} from '@/lib/auth/google';
import { googleDestination, googleRedirect, googleSignInPage } from '@/lib/auth/google-routes';
import { callerKey, checkRateLimit } from '@/lib/auth/rate-limit';
import {
  SESSION_COOKIE,
  createSession,
  createSignInSession,
  getCurrentUser,
  sessionCookieOptions,
} from '@/lib/auth/session';

/**
 * Where Google sends the browser back: ?code=...&state=..., or ?error=...
 * when the learner cancelled. Every check lives in finishGoogleSignIn; this
 * route only turns its answer into a session and a redirect.
 */

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const settings = googleSettings();
  if (!settings) return googleRedirect(googleSignInPage(DEFAULT_LOCALE, null, 'unavailable'));

  try {
    const db = getDb();
    const limit = (await checkRateLimit(db, 'googleSignIn', callerKey(request)));
    if (!limit.allowed) return withoutState(googleRedirect(googleSignInPage(DEFAULT_LOCALE, null, 'rate-limited')));

    // A guest's account is upgraded in place if this Google account is new here.
    const current = await getCurrentUser();
    const result = await finishGoogleSignIn(db, settings, {
      params: request.nextUrl.searchParams,
      cookieState: request.cookies.get(GOOGLE_STATE_COOKIE)?.value,
      guestUserId: current?.isGuest ? current.id : null,
    });

    if (!result.ok) {
      if (result.failure !== 'cancelled') console.warn('[google] sign-in did not finish:', result.failure);
      return withoutState(googleRedirect(googleSignInPage(result.locale, result.next, googleNotice(result.failure))));
    }

    // A new account is a sign-up, which is not counted as a sign-in; a
    // returning one is, the same as a password or code sign-in.
    const session = result.created
      ? (await createSession(db, result.user.id))
      : (await createSignInSession(db, result.user.id));
    const response = withoutState(googleRedirect(googleDestination(result.locale, result.next)));
    response.cookies.set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
    return response;
  } catch (error) {
    console.error('[google] sign-in failed:', error instanceof Error ? error.message : error);
    return withoutState(googleRedirect(googleSignInPage(DEFAULT_LOCALE, null, 'failed')));
  }
}

/** The state cookie is single-use whatever happened. */
function withoutState<T extends ReturnType<typeof googleRedirect>>(response: T): T {
  response.cookies.set(GOOGLE_STATE_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: GOOGLE_CALLBACK_PATH,
    maxAge: 0,
  });
  return response;
}
