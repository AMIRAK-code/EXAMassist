'use client';

import { useState } from 'react';
import { Alert, Button } from '@/components/ui';

/** Downloads account email addresses as a CSV for Brevo: everyone, or only those who opted in to news. */
export function ContactsExport() {
  const [busy, setBusy] = useState<'all' | 'news' | null>(null);
  const [message, setMessage] = useState<{ tone: 'positive' | 'negative'; text: string } | null>(null);

  async function download(scope: 'all' | 'news') {
    setBusy(scope);
    setMessage(null);
    const response = await fetch('/api/admin/users/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({ scope }),
    }).catch(() => null);
    setBusy(null);
    if (!response?.ok) {
      const json = (await response?.json().catch(() => null)) as { error?: { message?: string } } | null;
      return setMessage({ tone: 'negative', text: json?.error?.message ?? 'The download failed. Try again.' });
    }
    const name = /filename="([^"]+)"/.exec(response.headers.get('content-disposition') ?? '')?.[1] ?? 'contacts.csv';
    const url = URL.createObjectURL(await response.blob());
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setMessage({ tone: 'positive', text: `Downloaded ${name}: ${response.headers.get('x-contact-count') ?? 0} addresses.` });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-ink-muted">
        Email addresses of signed-up accounts (no guests, no deleted accounts) as a CSV Brevo imports directly:{' '}
        <code>EMAIL</code>, <code>LANGUAGE</code>, <code>NEWS_CONSENT</code> (yes/no) and <code>NEWS_CONSENT_DATE</code>. Nothing else
        about the person is included, and each download is logged.
      </p>
      <p className="text-sm text-ink-muted">
        Send news and offers only to contacts with <code>NEWS_CONSENT</code> = yes: the others agreed to account emails only, as
        the privacy notice says. Accounts marked under 16 never count as consenting.
      </p>
      {message ? (
        <Alert tone={message.tone} role={message.tone === 'negative' ? 'alert' : 'status'}>
          <p>{message.text}</p>
        </Alert>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" loading={busy === 'all'} disabled={busy !== null} onClick={() => download('all')}>
          Download all account emails (CSV)
        </Button>
        <Button variant="secondary" loading={busy === 'news'} disabled={busy !== null} onClick={() => download('news')}>
          Download news subscribers only (CSV)
        </Button>
      </div>
    </div>
  );
}
