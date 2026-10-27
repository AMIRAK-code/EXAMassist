'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { browserStorage, readAccountHint, rememberAccount } from '@/lib/auth/account-hint';
import type { AccountState } from './nav-items';

/**
 * Shows the header bar for this browser's account state.
 *
 * On a page the server rendered for this visitor, `served` is the truth: it is
 * shown and remembered. A page saved as a static file (src/lib/seo/static-pages.ts)
 * comes with a bar for every state (`deferred`), and the browser's remembered
 * state picks one after hydration, so the first paint matches the server's.
 */
export function AccountAware({
  served,
  deferred,
  bars,
}: {
  served: AccountState;
  deferred: boolean;
  bars: Partial<Record<AccountState, ReactNode>>;
}) {
  const [account, setAccount] = useState<AccountState>(served);

  useEffect(() => {
    if (deferred) {
      const remembered = readAccountHint(browserStorage());
      if (remembered) setAccount(remembered);
    } else {
      setAccount(served);
      rememberAccount(browserStorage(), served);
    }
  }, [served, deferred]);

  return <>{bars[account] ?? bars[served]}</>;
}
