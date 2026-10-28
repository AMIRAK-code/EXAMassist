import { getDb } from '@/lib/db';
import { ok, toErrorResponse } from '@/lib/api/http';
import { getCurrentUser } from '@/lib/auth/session';
import { continueStudying } from '@/lib/learning/continue';

/**
 * The home page's "continue studying" line for the signed-in learner, or null.
 * The home page is served as a static file (src/lib/seo/static-pages.ts), so
 * it asks for this from the browser when it remembers a session.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    const strip = user ? await continueStudying(getDb(), user.id) : null;
    return ok({ strip });
  } catch (error) {
    return toErrorResponse(error);
  }
}
