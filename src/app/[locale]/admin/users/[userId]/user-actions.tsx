'use client';

import { useId, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Alert, Button, fieldClass } from '@/components/ui';

async function send(url: string, method: 'POST' | 'PATCH' | 'DELETE', body: unknown): Promise<string | null> {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
    body: JSON.stringify(body),
  }).catch(() => null);
  if (response?.ok) return null;
  const data: { error?: { message?: string } } | null = await response?.json().catch(() => null);
  return data?.error?.message ?? 'That could not be saved. Try again.';
}

type Message = { tone: 'negative' | 'positive'; text: string } | null;

function Notice({ message }: { message: Message }) {
  if (!message) return null;
  return (
    <Alert tone={message.tone} role={message.tone === 'negative' ? 'alert' : 'status'}>
      <p>{message.text}</p>
    </Alert>
  );
}

const userPath = (userId: string) => `/api/admin/users/${encodeURIComponent(userId)}`;

export function GrantAccessForm({ userId, exams }: { userId: string; exams: Array<{ key: string; name: string }> }) {
  const router = useRouter();
  const id = useId();
  const [plan, setPlan] = useState<'plus' | 'exam_pass'>('plus');
  const [examKey, setExamKey] = useState(exams[0]?.key ?? '');
  const [days, setDays] = useState('30');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const error = await send(`${userPath(userId)}/grants`, 'POST', {
      plan,
      examKey: plan === 'exam_pass' ? examKey : null,
      days: Number(days),
      reason,
    });
    setBusy(false);
    if (error) {
      setMessage({ tone: 'negative', text: error });
      return;
    }
    setReason('');
    setMessage({ tone: 'positive', text: `Given for ${days} days. It works straight away.` });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Notice message={message} />
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">What to give</legend>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name={`${id}-plan`} checked={plan === 'plus'} onChange={() => setPlan('plus')} />
            Plus: every exam
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name={`${id}-plan`} checked={plan === 'exam_pass'} onChange={() => setPlan('exam_pass')} />
            One exam
          </label>
        </div>
      </fieldset>
      {plan === 'exam_pass' ? (
        <div>
          <label htmlFor={`${id}-exam`} className="mb-1.5 block text-sm font-medium">Exam</label>
          <select id={`${id}-exam`} value={examKey} onChange={(e) => setExamKey(e.target.value)} className={fieldClass('w-full sm:max-w-md')}>
            {exams.map((exam) => (
              <option key={exam.key} value={exam.key}>{exam.name}</option>
            ))}
          </select>
        </div>
      ) : null}
      <div>
        <label htmlFor={`${id}-days`} className="mb-1.5 block text-sm font-medium">For how many days</label>
        <input
          id={`${id}-days`}
          type="number"
          required
          min={1}
          max={730}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className={fieldClass('w-32')}
        />
      </div>
      <div>
        <label htmlFor={`${id}-reason`} className="mb-1.5 block text-sm font-medium">Why (kept in the history)</label>
        <input
          id={`${id}-reason`}
          required
          minLength={3}
          maxLength={300}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Tester, or payment failed on 3 November"
          className={fieldClass('w-full sm:max-w-xl')}
        />
      </div>
      <Button type="submit" loading={busy}>Give access</Button>
    </form>
  );
}

export function RevokeGrantForm({ userId, grantId }: { userId: string; grantId: string }) {
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  if (!open) {
    return (
      <Button type="button" variant="danger" size="sm" onClick={() => setOpen(true)}>
        Revoke
      </Button>
    );
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const error = await send(`${userPath(userId)}/grants/${encodeURIComponent(grantId)}`, 'DELETE', { reason });
    setBusy(false);
    if (error) {
      setMessage({ tone: 'negative', text: error });
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-2 space-y-2">
      <Notice message={message} />
      <label htmlFor={`${id}-reason`} className="block text-sm font-medium">Why revoke it?</label>
      <input
        id={`${id}-reason`}
        required
        minLength={3}
        maxLength={300}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className={fieldClass('w-full sm:max-w-md')}
      />
      <div className="flex gap-2">
        <Button type="submit" variant="danger" size="sm" loading={busy}>Revoke now</Button>
        <Button type="button" variant="quiet" size="sm" onClick={() => setOpen(false)}>Keep it</Button>
      </div>
    </form>
  );
}

export function RoleForm({ userId, current }: { userId: string; current: 'learner' | 'editor' | 'admin' }) {
  const router = useRouter();
  const id = useId();
  const [role, setRole] = useState(current);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const error = await send(userPath(userId), 'PATCH', { role, reason });
    setBusy(false);
    if (error) {
      setMessage({ tone: 'negative', text: error });
      return;
    }
    setReason('');
    setMessage({ tone: 'positive', text: `The role is now ${role}.` });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Notice message={message} />
      <div>
        <label htmlFor={`${id}-role`} className="mb-1.5 block text-sm font-medium">Role</label>
        <select
          id={`${id}-role`}
          value={role}
          onChange={(e) => setRole(e.target.value as typeof role)}
          aria-describedby={`${id}-role-hint`}
          className={fieldClass('w-full sm:max-w-xs')}
        >
          <option value="learner">Learner</option>
          <option value="editor">Editor: content pages, every exam open</option>
          <option value="admin">Admin: everything, including this page</option>
        </select>
        <p id={`${id}-role-hint`} className="mt-1.5 text-sm text-ink-muted">
          Editors and admins use every exam for free. Staff roles need a confirmed email address.
        </p>
      </div>
      <div>
        <label htmlFor={`${id}-role-reason`} className="mb-1.5 block text-sm font-medium">Why (kept in the history)</label>
        <input
          id={`${id}-role-reason`}
          required
          minLength={3}
          maxLength={300}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={fieldClass('w-full sm:max-w-xl')}
        />
      </div>
      <Button type="submit" variant="secondary" loading={busy} disabled={role === current}>
        Change role
      </Button>
    </form>
  );
}
