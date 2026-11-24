'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Alert, Button, fieldClass } from '@/components/ui';

/** Withdraws a whole batch, with a reason kept beside it. */
export function WithdrawBatch({ batchId, count }: { batchId: string; count: number }) {
  const t = useTranslations('admin.batches.withdraw');
  const tErrors = useTranslations('admin.batchReview.errors');
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button variant="danger" onClick={() => setOpen(true)}>
        {t('open')}
      </Button>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/admin/review-batches/${encodeURIComponent(batchId)}/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({ reason }),
    }).catch(() => null);
    setBusy(false);
    if (!response) return setError(tErrors('network'));
    if (!response.ok) {
      const json = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
      return setError(json?.error?.message || tErrors('generic'));
    }
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-3">
      {error ? (
        <Alert tone="negative" role="alert">
          <p>{error}</p>
        </Alert>
      ) : null}
      <div>
        <label htmlFor={`${id}-reason`} className="mb-1.5 block text-sm font-medium">{t('reason')}</label>
        <textarea
          id={`${id}-reason`}
          required
          minLength={10}
          maxLength={1000}
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          aria-describedby={`${id}-hint`}
          className={fieldClass('w-full')}
        />
        <p id={`${id}-hint`} className="mt-1 text-xs text-ink-muted">{t('reasonHint')}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="danger" loading={busy} disabled={reason.trim().length < 10}>
          {t('confirm', { count })}
        </Button>
        <Button type="button" variant="quiet" onClick={() => setOpen(false)}>
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
