import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { getDb } from '@/lib/db';
import { ok, toErrorResponse } from '@/lib/api/http';
import { getCurrentUser } from '@/lib/auth/session';
import { routing } from '@/i18n/routing';
import { buildStudyPanel, parseOffset, renderStudyPanel } from '@/lib/learning/study-panel';

/**
 * The site's "Study plan" side panel for the signed-in learner, in the
 * reader's language. Public pages are served as static files
 * (src/lib/seo/static-pages.ts), so the panel asks for this from the browser.
 * Only an account sees it: a guest session or no session gets `panel: null`,
 * and the panel invites them to sign in or create an account.
 *
 * `?locale=` is the page's language, `?tz=` the browser's getTimezoneOffset(),
 * so "this week" and the exam countdown fall on the learner's own days.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const requested = url.searchParams.get('locale');
    const locale = requested && hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
    const user = await getCurrentUser();
    if (!user || user.isGuest) return ok({ account: user ? 'guest' : 'visitor', panel: null });

    const panel = await buildStudyPanel(getDb(), user, { offsetMinutes: parseOffset(url.searchParams.get('tz')) });
    const learning = (await getTranslations({ locale, namespace: 'learning' }));
    const results = (await getTranslations({ locale, namespace: 'results' }));
    return ok({ account: 'registered', panel: renderStudyPanel(panel, { learning, results }) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
