'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Alert, Button } from '@/components/ui';

/** The account holder turns news emails on or off. Account emails (sign-in codes, account messages) are not optional. */
export function EmailPreferences({ subscribed, isMinor }: { subscribed: boolean; isMinor: boolean }) {
  const t = useTranslations('account.emailPrefs');
  const router = useRouter();
  const [on, setOn] = useState(subscribed);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function change(next: boolean) {
    setBusy(true);
    setError(null);
    const response = await fetch('/api/account/email-preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({ news: next }),
    }).catch(() => null);
    setBusy(false);
    if (!response?.ok) return setError(t('error'));
    setOn(next);
    router.refresh();
  }

  return (
    <div className="space-y-3 text-sm">
      <p>{t('account')}</p>
      <p role="status" className="font-medium">
        {on ? t('newsOn') : t('newsOff')}
      </p>
      {isMinor && !on ? <p className="text-ink-muted">{t('minor')}</p> : null}
      {error ? (
        <Alert tone="negative" role="alert">
          <p>{error}</p>
        </Alert>
      ) : null}
      {on ? (
        <Button variant="secondary" loading={busy} onClick={() => change(false)}>
          {t('unsubscribe')}
        </Button>
      ) : isMinor ? null : (
        <Button variant="secondary" loading={busy} onClick={() => change(true)}>
          {t('subscribe')}
        </Button>
      )}
    </div>
  );
}
