'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, buttonClass } from '@/components/ui';

/**
 * The interactive parts of the account page: editing the profile, taking a copy
 * of the data, signing out, and deleting the account.
 *
 * None of these send an account id. The server acts on whoever the session
 * cookie resolves to, which is the only identity it trusts.
 */

interface ApiErrorBody {
  error?: { code?: string; message?: string };
}

const FIELD_CLASS =
  'w-full rounded border border-line-strong bg-surface px-3 py-2.5 text-base text-ink';

async function readError(response: Response, fallback: string): Promise<string> {
  const body: ApiErrorBody | null = await response.json().catch(() => null);
  return body?.error?.message ?? fallback;
}

// ---------------------------------------------------------------------------

export function AccountSettingsForm({
  examOptions,
  initialDisplayName,
  initialTargetExamKey,
  initialTargetDate,
}: {
  examOptions: Array<{ examKey: string; name: string }>;
  initialDisplayName: string;
  initialTargetExamKey: string;
  initialTargetDate: string;
}) {
  const router = useRouter();
  const id = useId();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [targetExamKey, setTargetExamKey] = useState(initialTargetExamKey);
  const [targetDate, setTargetDate] = useState(initialTargetDate);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    const response = await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({
        displayName: displayName.trim() || null,
        targetExamKey: targetExamKey || null,
        targetDate: targetDate || null,
      }),
    }).catch(() => null);

    setSaving(false);

    if (!response) {
      setError('We could not reach the server. Check your connection and try again.');
      return;
    }
    if (!response.ok) {
      setError(await readError(response, 'Those changes could not be saved.'));
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" title="Not saved">
            <p>{error}</p>
          </Alert>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium">
          Display name
        </label>
        <input
          id={`${id}-name`}
          name="displayName"
          type="text"
          maxLength={60}
          autoComplete="nickname"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          aria-describedby={`${id}-name-hint`}
          className={FIELD_CLASS}
        />
        <p id={`${id}-name-hint`} className="mt-1.5 text-sm text-ink-muted">
          Shown on your own pages only. Leave it empty to remove it.
        </p>
      </div>

      <div>
        <label htmlFor={`${id}-exam`} className="mb-1.5 block text-sm font-medium">
          Target exam
        </label>
        <select
          id={`${id}-exam`}
          name="targetExamKey"
          value={targetExamKey}
          onChange={(event) => setTargetExamKey(event.target.value)}
          aria-describedby={`${id}-exam-hint`}
          className={FIELD_CLASS}
        >
          <option value="">No target exam</option>
          {examOptions.map((option) => (
            <option key={option.examKey} value={option.examKey}>
              {option.name}
            </option>
          ))}
        </select>
        <p id={`${id}-exam-hint`} className="mt-1.5 text-sm text-ink-muted">
          Used to decide which exam your study pages open on. You can still practise any of them.
        </p>
      </div>

      <div>
        <label htmlFor={`${id}-date`} className="mb-1.5 block text-sm font-medium">
          Test date
        </label>
        <input
          id={`${id}-date`}
          name="targetDate"
          type="date"
          value={targetDate}
          onChange={(event) => setTargetDate(event.target.value)}
          aria-describedby={`${id}-date-hint`}
          className={FIELD_CLASS}
        />
        <p id={`${id}-date-hint`} className="mt-1.5 text-sm text-ink-muted">
          The date you are sitting the exam, if you have booked one. It only spaces out your study
          plan; clear it if your plans change.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <p role="status" aria-live="polite" className="text-sm text-ink-muted">
          {saving ? 'Saving your changes…' : saved ? 'Saved.' : null}
        </p>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------

/**
 * A real link, so the download works the way every other download does - and
 * still works if the JavaScript for this page never arrives.
 */
export function ExportDataLink() {
  return (
    <div>
      <a
        href="/api/account/export"
        download
        className={buttonClass({ variant: 'secondary' })}
      >
        Download my data (JSON)
      </a>
      <p className="mt-2 text-sm text-ink-subtle">
        The file is generated when you click, so it is always current.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    if (busy) return;
    setBusy(true);
    setError(null);

    const response = await fetch('/api/auth/sign-out', {
      method: 'POST',
      headers: { 'X-Requested-With': 'examer' },
    }).catch(() => null);

    if (!response || !response.ok) {
      setBusy(false);
      setError('We could not sign you out. Check your connection and try again.');
      return;
    }

    router.replace('/');
    router.refresh();
  }

  return (
    <div>
      <Button type="button" variant="secondary" onClick={signOut} disabled={busy}>
        {busy ? 'Signing out…' : 'Sign out'}
      </Button>
      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" className="mt-3">
            <p>{error}</p>
          </Alert>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function DeleteAccountForm({ email, isGuest }: { email: string | null; isGuest: boolean }) {
  const router = useRouter();
  const id = useId();
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expectationHint = email
    ? `Type ${email} to confirm.`
    : 'Type DELETE, in capital letters, to confirm.';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const typed = confirm.trim();
    const matches = email ? typed.toLowerCase() === email.toLowerCase() : typed === 'DELETE';
    if (!matches) {
      setError(`That does not match. ${expectationHint}`);
      return;
    }

    setBusy(true);
    setError(null);

    const response = await fetch('/api/account', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({ confirm: typed }),
    }).catch(() => null);

    if (!response || !response.ok) {
      setBusy(false);
      setError(
        response
          ? await readError(response, 'Your account could not be deleted.')
          : 'We could not reach the server. Check your connection and try again.',
      );
      return;
    }

    router.replace('/');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-serif text-lg font-semibold">This cannot be undone</h3>
      <p className="mt-2 text-sm text-ink-muted">Deleting {isGuest ? 'this guest session' : 'your account'} removes:</p>
      <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-ink-muted">
        <li>your account record{email ? ', including your email address' : ''}</li>
        <li>every practice session, answer and timing record</li>
        <li>your results and score breakdowns</li>
        <li>your bookmarks, your review queue and your study plan</li>
        <li>every sign-in session, on this device and any other</li>
      </ul>
      <p className="mt-2 text-sm text-ink-muted">
        Question reports you have sent us are kept for our editorial record, but they stop being
        linked to you. Nothing here can be restored afterwards, so download your data first if you
        want to keep it.
      </p>

      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" title="Not deleted" className="mt-4">
            <p>{error}</p>
          </Alert>
        ) : null}
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-confirm`} className="mb-1.5 block text-sm font-medium">
          {email ? 'Type your email address to confirm' : 'Type DELETE to confirm'}
        </label>
        <input
          id={`${id}-confirm`}
          name="confirm"
          type="text"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          aria-describedby={`${id}-confirm-hint`}
          className={FIELD_CLASS}
        />
        <p id={`${id}-confirm-hint`} className="mt-1.5 text-sm text-ink-muted">
          {expectationHint}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="danger" disabled={busy}>
          {busy ? 'Deleting…' : 'Delete my account permanently'}
        </Button>
        <p role="status" aria-live="polite" className="text-sm text-ink-muted">
          {busy ? 'Deleting your account…' : null}
        </p>
      </div>
    </form>
  );
}
