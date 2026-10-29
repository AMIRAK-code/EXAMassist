'use client';

import { useEffect, type ReactNode } from 'react';

/**
 * Reports one view of an exam page, for the daily totals in /admin/funnel.
 * Rendered only on the copy saved as a static file (src/lib/seo/static-pages.ts),
 * which the server never renders for a visitor; elsewhere the server counts.
 * Sends the referring address, which the server reduces to a coarse source.
 */
export function ViewBeacon({ subject, kind = 'exam' }: { subject: string; kind?: 'exam' | 'guide' }) {
  useEffect(() => {
    report({ subject, kind, referrer: document.referrer });
  }, [subject, kind]);

  return null;
}

/** Exam pages and the ways into practice, in any language. */
const PRACTICE_PATH = /^(?:\/(?:it|tr|es|pl))?\/(?:exams|practice|free-test|start)(?:\/|$)/;

/**
 * Counts clicks from a guide to an exam page or into practice, for the daily
 * totals in /admin/funnel. Wraps the guide; only the fact of the click and the
 * guide are sent, never who clicked.
 */
export function GuideClickBeacon({ subject, children }: { subject: string; children: ReactNode }) {
  return (
    <div
      onClickCapture={(event) => {
        const link = (event.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
        if (link && link.origin === window.location.origin && PRACTICE_PATH.test(link.pathname)) {
          report({ subject, kind: 'guide_click', referrer: '' });
        }
      }}
    >
      {children}
    </div>
  );
}

function report(body: { subject: string; kind: string; referrer: string }) {
  void fetch('/api/views', {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
    body: JSON.stringify(body),
  }).catch(() => {
    // A missed count never matters to the visitor.
  });
}
