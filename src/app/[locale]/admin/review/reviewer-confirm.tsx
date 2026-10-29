'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Alert, Button } from '@/components/ui';

/**
 * The reviewer's own confirmation that the public wording of their
 * credentials is accurate. An administrator wrote it; only the reviewer can
 * say it is true, and until they do they cannot record a decision.
 */
export function ReviewerConfirm({ name, credentials }: { name: string; credentials: string }) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!agreed || busy) return;
    setBusy(true);
    setError(null);
    const response = await fetch('/api/admin/reviewers/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: '{}',
    }).catch(() => null);
    const data: { error?: { message?: string } } | null = await response?.json().catch(() => null);
    setBusy(false);
    if (!response?.ok) {
      setError(data?.error?.message ?? 'The confirmation could not be saved. Try again.');
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {error ? (
        <Alert tone="negative" role="alert">
          <p>{error}</p>
        </Alert>
      ) : null}
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-1 size-4 shrink-0"
        />
        <span>
          I am {name}. The line “{credentials}” is accurate, and I agree to it being shown publicly beside the questions I
          approve, with the date and what I checked.
        </span>
      </label>
      <Button type="button" onClick={confirm} disabled={!agreed} loading={busy}>
        Confirm and start reviewing
      </Button>
    </div>
  );
}
