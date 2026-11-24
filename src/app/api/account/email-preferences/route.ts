import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { setNewsConsent } from '@/lib/account/email-consent';

/**
 * The account holder's own choice about news emails: on or off. Keyed on the
 * session's account only; written to the audit log.
 */

export const dynamic = 'force-dynamic';

const bodySchema = z.object({ news: z.boolean() });

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const body = await readJson(request, bodySchema);
    return ok({ consent: await setNewsConsent(getDb(), user, body.news) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
