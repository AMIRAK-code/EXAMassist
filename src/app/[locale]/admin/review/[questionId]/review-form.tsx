'use client';

import { useId, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Alert, Button, fieldClass } from '@/components/ui';

/**
 * Approve, or request changes. An approval needs all four checks ticked; a
 * request for changes needs a note saying what to change. The server enforces
 * both, along with everything about who may decide; this only saves a round trip.
 */
export function ReviewForm({
  questionVersionId,
  reviewFingerprint,
  criteria,
}: {
  questionVersionId: string;
  reviewFingerprint: string;
  criteria: Array<{ value: string; label: string }>;
}) {
  const router = useRouter();
  const notesId = useId();
  const [checked, setChecked] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState<'approved' | 'changes_requested' | null>(null);
  const [message, setMessage] = useState<{ tone: 'negative' | 'positive'; text: string } | null>(null);

  const allChecked = criteria.every((c) => checked.includes(c.value));

  async function decide(outcome: 'approved' | 'changes_requested') {
    if (busy) return;
    if (outcome === 'approved' && !allChecked) {
      setMessage({ tone: 'negative', text: 'Tick all four checks to approve. If any fails, request changes instead.' });
      return;
    }
    if (outcome === 'changes_requested' && notes.trim().length < 10) {
      setMessage({ tone: 'negative', text: 'Say what needs to change (at least 10 characters).' });
      return;
    }
    setBusy(outcome);
    setMessage(null);
    const response = await fetch('/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({ questionVersionId, reviewFingerprint, outcome, checked, notes }),
    }).catch(() => null);
    const data: { error?: { message?: string } } | null = await response?.json().catch(() => null);
    setBusy(null);
    if (!response?.ok) {
      setMessage({ tone: 'negative', text: data?.error?.message ?? 'The decision could not be saved. Try again.' });
      return;
    }
    setMessage({ tone: 'positive', text: outcome === 'approved' ? 'Approval recorded.' : 'Request for changes recorded.' });
    router.refresh();
  }

  return (
    <form onSubmit={(event) => event.preventDefault()} className="space-y-4">
      {message ? (
        <Alert tone={message.tone} role={message.tone === 'negative' ? 'alert' : 'status'}>
          <p>{message.text}</p>
        </Alert>
      ) : null}
      <fieldset>
        <legend className="text-sm font-medium">I checked, myself, this exact version:</legend>
        <div className="mt-2 space-y-2">
          {criteria.map((criterion) => (
            <label key={criterion.value} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                name="checked"
                value={criterion.value}
                checked={checked.includes(criterion.value)}
                onChange={(event) =>
                  setChecked((current) =>
                    event.target.checked ? [...current, criterion.value] : current.filter((c) => c !== criterion.value),
                  )
                }
                className="size-4"
              />
              {criterion.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor={notesId} className="mb-1.5 block text-sm font-medium">
          Notes <span className="font-normal text-ink-muted">(required to request changes; kept internal)</span>
        </label>
        <textarea
          id={notesId}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={5}
          maxLength={4000}
          className={fieldClass('w-full')}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={() => decide('approved')} loading={busy === 'approved'} disabled={busy !== null}>
          Approve this version
        </Button>
        <Button type="button" variant="secondary" onClick={() => decide('changes_requested')} loading={busy === 'changes_requested'} disabled={busy !== null}>
          Request changes
        </Button>
      </div>
      <p className="text-xs text-ink-muted">
        Your approval is shown to learners with your public name, credentials, the date and these four checks, only for
        this version and only while its content is unchanged.
      </p>
    </form>
  );
}
