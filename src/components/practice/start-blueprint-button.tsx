'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { getPathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui';
import { upgradeTarget } from '@/lib/billing/upgrade';
import { useStartError } from './use-start-error';

/**
 * Starts a fixed blueprint (diagnostic, timed section, simulation).
 *
 * Sends an idempotency key so a double click or a retried request produces one
 * attempt rather than two.
 */
export function StartBlueprintButton({
  examKey,
  blueprintId,
  label,
  variant = 'primary',
  contentLocale = 'en',
}: {
  examKey: string;
  blueprintId: string;
  label: string;
  variant?: 'primary' | 'secondary';
  /** The language the questions are asked in, as for StartPracticeForm. */
  contentLocale?: string;
}) {
  const t = useTranslations('practice.blueprint');
  const locale = useLocale();
  const startError = useStartError();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    if (busy) return;
    setBusy(true);
    setError(null);

    const guest = await fetch('/api/auth/guest', {
      method: 'POST',
      headers: { 'X-Requested-With': 'examer' },
    })
      .then((r) => r.json())
      .catch(() => null);

    const response = await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({
        examKey,
        blueprintId,
        contentLocale,
        idempotencyKey: `${examKey}-${blueprintId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      }),
    }).catch(() => null);

    const data = await response?.json().catch(() => null);

    // No plan for this format: the pricing page for this exam, never an error.
    const upgrade = data?.error ? upgradeTarget(data.error) : null;
    if (upgrade) {
      window.location.assign(getPathname({ href: upgrade, locale }));
      return;
    }
    if (!response?.ok) {
      setBusy(false);
      setError(startError(data?.error, 'buttonFallback'));
      return;
    }
    // A brand-new guest session changes the header; see StartPracticeForm.
    if (guest?.created) window.location.assign(getPathname({ href: `/attempt/${data.attemptId}`, locale }));
    else router.push(`/attempt/${data.attemptId}`);
  }

  return (
    <div className="text-end">
      <Button variant={variant} onClick={() => void start()} disabled={busy}>
        {busy ? t('starting') : label}
      </Button>
      {error ? (
        <p role="alert" className="mt-2 max-w-60 text-sm text-negative">
          {error}
        </p>
      ) : null}
    </div>
  );
}
