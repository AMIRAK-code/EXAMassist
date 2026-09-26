import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, toErrorResponse } from '@/lib/api/http';
import { SESSION_COOKIE, destroySession } from '@/lib/auth/session';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const store = await cookies();
    destroySession(getDb(), store.get(SESSION_COOKIE)?.value);
    store.delete(SESSION_COOKIE);
    // Answers the player kept on this device, waiting for the server, belong
    // to the account signing out: nothing of theirs stays behind.
    return ok({ signedOut: true }, { headers: { 'Clear-Site-Data': '"storage"' } });
  } catch (error) {
    return toErrorResponse(error);
  }
}
