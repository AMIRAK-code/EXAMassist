'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

/**
 * Resolves one content report.
 *
 * The note is required: a report that is closed without a reason tells the next
 * editor nothing, and "accepted" is meaningless unless it says what was wrong.
 * The server enforces the same rule; this only saves a round trip.
 */

type Decision = 'accepted' | 'rejected';

const MIN_NOTE = 5;
const MAX_NOTE = 500;

export function FlagActions({ flagId }: { flagId: string }) {
  const router = useRouter();
  const fieldId = useId();
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<Decision | null>(null);
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<{ tone: 'error' | 'success'; text: string } | null>(null);

  async function resolve(decision: Decision) {
    if (busy || done) return;

    const trimmed = note.trim();
    if (trimmed.length < MIN_NOTE) {
      setStatus({
        tone: 'error',
        text: `Write a short resolution note first — at least ${MIN_NOTE} characters saying what you decided and why.`,
      });
      return;
    }

    setBusy(decision);
    setStatus(null);

    const response = await fetch(`/api/admin/flags/${encodeURIComponent(flagId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({ status: decision, resolution: trimmed }),
    }).catch(() => null);

    const data: { error?: { message?: string } } | null = await response?.json().catch(() => null);

    if (!response?.ok) {
      setBusy(null);
      setStatus({
        tone: 'error',
        text: data?.error?.message ?? 'This report could not be updated right now. Try again.',
      });
      return;
    }

    setBusy(null);
    setDone(true);
    setStatus({
      tone: 'success',
      text:
        decision === 'accepted'
          ? 'Marked accepted. Correct the question in its JSON file, increment its version and re-seed.'
          : 'Marked rejected. The question stays as it is.',
    });
    router.refresh();
  }

  return (
    <div className="mt-4 border-t border-line pt-4">
      <label htmlFor={fieldId} className="block text-sm font-medium">
        Resolution note
      </label>
      <p id={`${fieldId}-hint`} className="mt-1 text-sm text-ink-muted">
        Required. What you decided and why, in a sentence. It is stored with the report and in the
        audit log.
      </p>
      <textarea
        id={fieldId}
        name="resolution"
        rows={3}
        maxLength={MAX_NOTE}
        required
        disabled={done}
        aria-describedby={`${fieldId}-hint`}
        value={note}
        onChange={(event) => setNote(event.target.value)}
        className="mt-2 w-full rounded border border-line-strong bg-surface px-3 py-2 text-ink disabled:opacity-55"
      />

      <div className="mt-3 flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => void resolve('accepted')}
          disabled={busy !== null || done}
        >
          {busy === 'accepted' ? 'Saving…' : 'Accept report'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => void resolve('rejected')}
          disabled={busy !== null || done}
        >
          {busy === 'rejected' ? 'Saving…' : 'Reject report'}
        </Button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`mt-3 text-sm ${
          status?.tone === 'error' ? 'text-negative' : status ? 'text-positive' : 'text-ink-muted'
        }`}
      >
        {status ? `${status.tone === 'error' ? 'Not saved: ' : 'Saved: '}${status.text}` : ''}
      </p>
    </div>
  );
}
