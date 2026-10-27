'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Alert, Button, buttonClass, fieldClass } from '@/components/ui';
import { clearAllPending } from '@/lib/player/pending';

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

const FIELD_CLASS = fieldClass();

/** The word a guest types to delete their session; the server checks for exactly this. */
const DELETE_WORD = 'DELETE';

type Translate = (key: string, values?: Record<string, string | number>) => string;

/**
 * The server's error codes and the `account.errors` message for each. The API
 * answers in English; the learner reads the message for the code.
 */
const ERROR_KEYS: Record<string, string> = {
  'unknown-exam': 'unknownExam',
  'no-changes': 'noChanges',
  'not-found': 'notFound',
  'billing-unavailable': 'deletionBlocked',
  unauthorized: 'unauthorized',
  forbidden: 'forbidden',
  'server-error': 'serverError',
};

async function readError(response: Response, t: Translate, fallback: string, email?: string | null): Promise<string> {
  const body: ApiErrorBody | null = await response.json().catch(() => null);
  const code = body?.error?.code;
  if (code === 'confirmation-mismatch') {
    return email ? t('errors.confirmEmail') : t('errors.confirmWord', { word: DELETE_WORD });
  }
  const key = code ? ERROR_KEYS[code] : undefined;
  return key ? t(`errors.${key}`) : fallback;
}

// ---------------------------------------------------------------------------

export function AccountSettingsForm({
  examOptions,
  initialDisplayName,
  initialTargetExamKey,
}: {
  examOptions: Array<{ examKey: string; name: string }>;
  initialDisplayName: string;
  initialTargetExamKey: string;
}) {
  const t = useTranslations('account');
  const router = useRouter();
  const id = useId();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [targetExamKey, setTargetExamKey] = useState(initialTargetExamKey);
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
      }),
    }).catch(() => null);

    setSaving(false);

    if (!response) {
      setError(t('errors.network'));
      return;
    }
    if (!response.ok) {
      setError(await readError(response, t, t('settings.fallback')));
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" title={t('settings.notSavedTitle')}>
            <p>{error}</p>
          </Alert>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium">
          {t('settings.displayName')}
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
          {t('settings.displayNameHint')}
        </p>
      </div>

      <div>
        <label htmlFor={`${id}-exam`} className="mb-1.5 block text-sm font-medium">
          {t('settings.targetExam')}
        </label>
        <select
          id={`${id}-exam`}
          name="targetExamKey"
          value={targetExamKey}
          onChange={(event) => setTargetExamKey(event.target.value)}
          aria-describedby={`${id}-exam-hint`}
          className={FIELD_CLASS}
        >
          <option value="">{t('settings.noTarget')}</option>
          {examOptions.map((option) => (
            <option key={option.examKey} value={option.examKey}>
              {option.name}
            </option>
          ))}
        </select>
        <p id={`${id}-exam-hint`} className="mt-1.5 text-sm text-ink-muted">
          {t('settings.targetHint')}
        </p>
      </div>

      <p className="text-sm text-ink-muted">
        {t.rich('settings.examDateNote', {
          link: (chunks) => <Link href="/study-plan/progress">{chunks}</Link>,
        })}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? t('settings.saving') : t('settings.save')}
        </Button>
        <p role="status" aria-live="polite" className="text-sm text-ink-muted">
          {saving ? t('settings.savingStatus') : saved ? t('settings.saved') : null}
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
  const t = useTranslations('account.data');
  return (
    <div>
      <a
        href="/api/account/export"
        download
        className={buttonClass({ variant: 'secondary' })}
      >
        {t('downloadLink')}
      </a>
      <p className="mt-2 text-sm text-ink-subtle">{t('downloadNote')}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function SignOutButton() {
  const t = useTranslations('account.data');
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
      setError(t('signOutFailed'));
      return;
    }

    // The response also asks the browser to clear this site's storage; this
    // covers a browser that ignores that. Nothing of this account's waits here.
    try {
      clearAllPending(window.localStorage);
    } catch {
      /* storage unavailable: nothing was kept */
    }
    router.replace('/');
    router.refresh();
  }

  return (
    <div>
      <Button type="button" variant="secondary" onClick={signOut} disabled={busy}>
        {busy ? t('signingOut') : t('signOut')}
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
  const t = useTranslations('account');
  const router = useRouter();
  const id = useId();
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expectationHint = email
    ? t('delete.hintEmail', { email })
    : t('delete.hintWord', { word: DELETE_WORD });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const typed = confirm.trim();
    const matches = email ? typed.toLowerCase() === email.toLowerCase() : typed === DELETE_WORD;
    if (!matches) {
      setError(email ? t('delete.mismatchEmail', { email }) : t('delete.mismatchWord', { word: DELETE_WORD }));
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
      setError(response ? await readError(response, t, t('delete.fallback'), email) : t('errors.network'));
      return;
    }

    router.replace('/');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-heading text-lg font-semibold">{t('delete.cannotUndo')}</h3>
      <p className="mt-2 text-sm text-ink-muted">{isGuest ? t('delete.removesGuest') : t('delete.removesAccount')}</p>
      <ul className="mt-2 list-disc space-y-1 ps-5 text-sm text-ink-muted">
        <li>{email ? t('delete.itemRecordWithEmail') : t('delete.itemRecord')}</li>
        <li>{t('delete.itemSessions')}</li>
        <li>{t('delete.itemResults')}</li>
        <li>{t('delete.itemBookmarks')}</li>
        <li>{t('delete.itemSignIns')}</li>
      </ul>
      <p className="mt-2 text-sm text-ink-muted">{t('delete.reports')}</p>

      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" title={t('delete.notDeletedTitle')} className="mt-4">
            <p id={`${id}-confirm-error`}>{error}</p>
          </Alert>
        ) : null}
      </div>

      <div className="mt-5">
        <label htmlFor={`${id}-confirm`} className="mb-1.5 block text-sm font-medium">
          {email ? t('delete.labelEmail') : t('delete.labelWord', { word: DELETE_WORD })}
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
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-confirm-error ${id}-confirm-hint` : `${id}-confirm-hint`}
          className={FIELD_CLASS}
        />
        <p id={`${id}-confirm-hint`} className="mt-1.5 text-sm text-ink-muted">
          {expectationHint}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="danger" disabled={busy}>
          {busy ? t('delete.deleting') : t('delete.submit')}
        </Button>
        <p role="status" aria-live="polite" className="text-sm text-ink-muted">
          {busy ? t('delete.deletingStatus') : null}
        </p>
      </div>
    </form>
  );
}
