/**
 * Whether this browser has a session, remembered in its own storage so that
 * public pages served as static files (src/lib/seo/static-pages.ts) can show
 * a learner their own menu.
 *
 * It is a hint, never a credential: the session cookie is HttpOnly and only the
 * server can read it. Every page the server renders corrects the hint, and
 * signing out clears it with the rest of the site's storage (Clear-Site-Data).
 * At worst a stale hint shows the learner menu to someone whose session ended,
 * and the first link they follow asks them to sign in.
 */

export type AccountHint = 'guest' | 'registered';
type AccountState = AccountHint | 'visitor';

export const ACCOUNT_HINT_KEY = 'examer:account';

/** The remembered state, or null for none (or no storage). Never throws. */
export function readAccountHint(storage: Pick<Storage, 'getItem'> | undefined): AccountHint | null {
  try {
    const value = storage?.getItem(ACCOUNT_HINT_KEY);
    return value === 'guest' || value === 'registered' ? value : null;
  } catch {
    return null;
  }
}

/** Records what the server said about this browser's session. Never throws. */
export function rememberAccount(storage: Pick<Storage, 'setItem' | 'removeItem'> | undefined, account: AccountState): void {
  try {
    if (account === 'visitor') storage?.removeItem(ACCOUNT_HINT_KEY);
    else storage?.setItem(ACCOUNT_HINT_KEY, account);
  } catch {
    // Storage can be full or blocked; the header then shows the visitor menu.
  }
}

/** The browser's localStorage, or undefined where it is unavailable. */
export function browserStorage(): Storage | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}
