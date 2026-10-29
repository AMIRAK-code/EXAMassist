'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui';

/** Deleting one recorded result, with an explicit second step. */
export function DeleteScoreButton({ id, label }: { id: string; label: string }) {
  const t = useTranslations('learning.officialScores.history');
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!confirming) {
    return (
      <Button type="button" size="sm" variant="secondary" onClick={() => setConfirming(true)} aria-label={t('deleteLabel', { test: label })}>
        {t('delete')}
      </Button>
    );
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2" role="group" aria-label={t('deleteLabel', { test: label })}>
      <span className="text-sm">{t('confirmDelete')}</span>
      <Button
        type="button"
        size="sm"
        loading={busy}
        onClick={async () => {
          setBusy(true);
          const response = await fetch(`/api/official-scores/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: { 'X-Requested-With': 'examer' },
          }).catch(() => null);
          setBusy(false);
          if (!response?.ok) {
            setFailed(true);
            return;
          }
          router.refresh();
        }}
      >
        {t('confirm')}
      </Button>
      <Button type="button" size="sm" variant="secondary" onClick={() => setConfirming(false)}>
        {t('cancel')}
      </Button>
      {failed ? (
        <span role="alert" className="text-sm text-negative">
          {t('deleteFailed')}
        </span>
      ) : null}
    </span>
  );
}
