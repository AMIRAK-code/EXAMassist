'use client';

import { useEffect, useState } from 'react';
import type { ContinueStudying } from '@/lib/learning/continue';
import { browserStorage, readAccountHint } from '@/lib/auth/account-hint';
import { ContinueStrip } from './continue-strip';

/**
 * The "continue studying" line on the home page when it is served as a static
 * file: asked for only when this browser remembers a session, so a visitor's
 * page makes no extra request.
 */
export function ContinueStripLoader() {
  const [strip, setStrip] = useState<ContinueStudying | null>(null);

  useEffect(() => {
    if (!readAccountHint(browserStorage())) return;
    let cancelled = false;
    fetch('/api/continue', { credentials: 'same-origin' })
      .then((response) => (response.ok ? (response.json() as Promise<{ strip: ContinueStudying | null }>) : null))
      .then((data) => {
        if (!cancelled && data?.strip) setStrip(data.strip);
      })
      .catch(() => {
        // The line is a convenience; without it the page is complete.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return strip ? <ContinueStrip strip={strip} /> : null;
}
