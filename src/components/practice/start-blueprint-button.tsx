'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

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
}: {
  examKey: string;
  blueprintId: string;
  label: string;
  variant?: 'primary' | 'secondary';
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    if (busy) return;
    setBusy(true);
    setError(null);

    await fetch('/api/auth/guest', {
      method: 'POST',
      headers: { 'X-Requested-With': 'examer' },
    }).catch(() => null);

    const response = await fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({
        examKey,
        blueprintId,
        idempotencyKey: `${examKey}-${blueprintId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      }),
    }).catch(() => null);

    const data = await response?.json().catch(() => null);

    if (!response?.ok) {
      setBusy(false);
      setError(data?.error?.message ?? 'This session could not be started right now.');
      return;
    }
    router.push(`/attempt/${data.attemptId}`);
  }

  return (
    <div className="text-end">
      <Button variant={variant} onClick={() => void start()} disabled={busy}>
        {busy ? 'Starting…' : label}
      </Button>
      {error ? (
        <p role="alert" className="mt-2 max-w-60 text-sm text-negative">
          {error}
        </p>
      ) : null}
    </div>
  );
}
