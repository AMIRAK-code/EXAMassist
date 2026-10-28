'use client';

import { useEffect } from 'react';

/**
 * Reports one view of an exam page, for the daily totals in /admin/funnel.
 * Rendered only on the copy saved as a static file (src/lib/seo/static-pages.ts),
 * which the server never renders for a visitor; elsewhere the server counts.
 * Sends the referring address, which the server reduces to a coarse source.
 */
export function ViewBeacon({ subject }: { subject: string }) {
  useEffect(() => {
    void fetch('/api/views', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({ subject, referrer: document.referrer }),
    }).catch(() => {
      // A missed count never matters to the visitor.
    });
  }, [subject]);

  return null;
}
