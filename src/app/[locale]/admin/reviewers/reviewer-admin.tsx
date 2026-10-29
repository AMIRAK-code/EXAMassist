'use client';

import { useId, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Alert, Button, fieldClass } from '@/components/ui';

async function send(url: string, method: 'POST' | 'DELETE', body: unknown): Promise<string | null> {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
    body: JSON.stringify(body),
  }).catch(() => null);
  if (response?.ok) return null;
  const data: { error?: { message?: string } } | null = await response?.json().catch(() => null);
  return data?.error?.message ?? 'That could not be saved. Try again.';
}

export function GrantReviewerForm({ exams }: { exams: Array<{ key: string; name: string }> }) {
  const router = useRouter();
  const id = useId();
  const [email, setEmail] = useState('');
  const [publicName, setPublicName] = useState('');
  const [credentials, setCredentials] = useState('');
  const [aliases, setAliases] = useState('');
  const [examKeys, setExamKeys] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'negative' | 'positive'; text: string } | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const error = await send('/api/admin/reviewers', 'POST', {
      email,
      publicName,
      publicCredentials: credentials,
      examKeys,
      authorAliases: aliases
        .split(',')
        .map((alias) => alias.trim())
        .filter(Boolean),
    });
    setBusy(false);
    if (error) {
      setMessage({ tone: 'negative', text: error });
      return;
    }
    setMessage({ tone: 'positive', text: `${publicName} is authorised and must now confirm their credentials on the review page.` });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {message ? (
        <Alert tone={message.tone} role={message.tone === 'negative' ? 'alert' : 'status'}>
          <p>{message.text}</p>
        </Alert>
      ) : null}
      <div>
        <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium">Their account email</label>
        <input id={`${id}-email`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass('w-full')} />
      </div>
      <div>
        <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium">Public name</label>
        <input id={`${id}-name`} required minLength={3} maxLength={120} value={publicName} onChange={(e) => setPublicName(e.target.value)} className={fieldClass('w-full')} />
      </div>
      <div>
        <label htmlFor={`${id}-cred`} className="mb-1.5 block text-sm font-medium">Public credentials, one line</label>
        <input
          id={`${id}-cred`}
          required
          minLength={10}
          maxLength={200}
          value={credentials}
          onChange={(e) => setCredentials(e.target.value)}
          aria-describedby={`${id}-cred-hint`}
          className={fieldClass('w-full')}
        />
        <p id={`${id}-cred-hint`} className="mt-1.5 text-sm text-ink-muted">
          As they want it shown, e.g. “Mathematics teacher, liceo scientifico, 12 years”. No invented titles.
        </p>
      </div>
      <fieldset>
        <legend className="text-sm font-medium">Exams they may approve</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {exams.map((exam) => (
            <label key={exam.key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={examKeys.includes(exam.key)}
                onChange={(e) => setExamKeys((current) => (e.target.checked ? [...current, exam.key] : current.filter((k) => k !== exam.key)))}
                className="size-4"
              />
              {exam.name}
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor={`${id}-aliases`} className="mb-1.5 block text-sm font-medium">
          Names they write or edit content under <span className="font-normal text-ink-muted">(comma-separated)</span>
        </label>
        <input id={`${id}-aliases`} value={aliases} onChange={(e) => setAliases(e.target.value)} className={fieldClass('w-full')} />
      </div>
      <Button type="submit" loading={busy} disabled={examKeys.length === 0}>
        Authorise
      </Button>
    </form>
  );
}

export function RevokeReviewer({ userId, name }: { userId: string; name: string }) {
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(true)}>
        Withdraw authorisation
      </Button>
    );
  }
  return (
    <div className="space-y-2">
      {error ? (
        <Alert tone="negative" role="alert">
          <p>{error}</p>
        </Alert>
      ) : null}
      <label htmlFor={id} className="block text-sm font-medium">Why are you withdrawing {name}?</label>
      <input id={id} value={reason} onChange={(e) => setReason(e.target.value)} minLength={5} className={fieldClass('w-full')} />
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          loading={busy}
          disabled={reason.trim().length < 5}
          onClick={async () => {
            setBusy(true);
            const message = await send(`/api/admin/reviewers/${encodeURIComponent(userId)}`, 'DELETE', { reason });
            setBusy(false);
            if (message) setError(message);
            else router.refresh();
          }}
        >
          Withdraw
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
