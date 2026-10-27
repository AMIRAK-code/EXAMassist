'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, buttonClass, cx, fieldClass } from '@/components/ui';

/**
 * Account creation.
 *
 * The password rule is stated in plain words before anyone types, and the
 * server's own verdict - which is the one that counts - is shown against the
 * field it belongs to.
 */

interface ApiErrorBody {
  error?: { code?: string; message?: string; detail?: { retryAfterSeconds?: number } };
}

/** Codes the password policy returns; these belong next to the password box. */
const PASSWORD_CODES = new Set(['too-short', 'too-long', 'contains-email', 'too-common', 'repeated']);

export function SignUpForm({
  next,
  minPasswordLength,
  emailCodes,
}: {
  next: string | null;
  minPasswordLength: number;
  /** Whether this deployment sends account codes by email. */
  emailCodes: boolean;
}) {
  const router = useRouter();
  const id = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isMinor, setIsMinor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Set when the server's refusal is about the email address itself.
  const [emailInvalid, setEmailInvalid] = useState(false);
  const errorId = `${id}-error`;
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const destination = next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';
  const tooShort = password.length > 0 && password.length < minPasswordLength;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    setPasswordError(null);

    // Say the obvious thing before spending a request on it.
    if (password.length < minPasswordLength) {
      setPasswordError(
        `Use at least ${minPasswordLength} characters. A short phrase works well.`,
      );
      return;
    }

    setSubmitting(true);

    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({
        email,
        password,
        displayName: displayName.trim() || undefined,
        isMinor,
      }),
    }).catch(() => null);

    if (!response) {
      setSubmitting(false);
      setError('We could not reach the server. Check your connection and try again.');
      return;
    }

    const body: (ApiErrorBody & { verificationSent?: boolean }) | null = await response.json().catch(() => null);

    if (!response.ok) {
      setSubmitting(false);
      const code = body?.error?.code;
      const message = body?.error?.message ?? 'That account could not be created.';

      if (code && PASSWORD_CODES.has(code)) {
        setPasswordError(message);
        return;
      }
      if (code === 'rate-limited') {
        const retry = body?.error?.detail?.retryAfterSeconds;
        const minutes = retry ? Math.ceil(retry / 60) : null;
        setError(
          `Too many accounts have been created from this connection. Please try again${
            minutes ? ` in about ${minutes} minute${minutes === 1 ? '' : 's'}` : ' later'
          }.`,
        );
        return;
      }
      if (code === 'invalid-request') {
        setError('Check the email address — that one does not look like a valid address.');
        setEmailInvalid(true);
        return;
      }
      setError(message);
      return;
    }

    // A confirmation code is on its way: ask for it now, while the email is
    // fresh. The page lets them skip straight on to where they were going.
    router.push(
      body?.verificationSent
        ? `/verify-email?sent=1&next=${encodeURIComponent(destination)}`
        : destination,
    );
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" title="Account not created">
            <p id={errorId}>{error}</p>
          </Alert>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailInvalid(false);
          }}
          aria-invalid={emailInvalid || undefined}
          aria-describedby={emailInvalid ? `${errorId} ${id}-email-hint` : `${id}-email-hint`}
          className={fieldClass()}
        />
        <p id={`${id}-email-hint`} className="mt-1.5 text-sm text-ink-muted">
          {emailCodes
            ? 'Used to sign in and for account codes, such as one to confirm this address or reset your password. We send no marketing email.'
            : 'Used to sign in and nothing else. We send no marketing email.'}
        </p>
      </div>

      <div>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <label htmlFor={`${id}-password`} className="text-sm font-medium">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-pressed={showPassword}
            aria-controls={`${id}-password`}
            className={cx(buttonClass({ variant: 'quiet', size: 'sm' }), 'min-h-11 -me-3')}
          >
            Show password
          </button>
        </div>
        <input
          id={`${id}-password`}
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          minLength={minPasswordLength}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby={`${id}-password-hint ${id}-password-state`}
          aria-invalid={passwordError ? true : undefined}
          className={fieldClass()}
        />
        <p id={`${id}-password-hint`} className="mt-1.5 text-sm text-ink-muted">
          At least {minPasswordLength} characters. Length matters more than symbols, so a short
          phrase only you would write — three unrelated words, for example — is both stronger and
          easier to type on a phone. Do not reuse a password from another site.
        </p>
        <p
          id={`${id}-password-state`}
          aria-live="polite"
          className={`mt-1.5 text-sm ${passwordError ? 'text-negative' : 'text-ink-subtle'}`}
        >
          {passwordError
            ? passwordError
            : tooShort
              ? `${minPasswordLength - password.length} more character${
                  minPasswordLength - password.length === 1 ? '' : 's'
                } to go.`
              : null}
        </p>
      </div>

      <div>
        <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium">
          Display name <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <input
          id={`${id}-name`}
          name="displayName"
          type="text"
          autoComplete="nickname"
          maxLength={60}
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          aria-describedby={`${id}-name-hint`}
          className={fieldClass()}
        />
        <p id={`${id}-name-hint`} className="mt-1.5 text-sm text-ink-muted">
          What we call you on your own pages. A first name or a nickname is plenty.
        </p>
      </div>

      <div className="rounded-card border border-line bg-surface-sunken p-4">
        {/* The whole label row is the target, 44 px tall, not just the box. */}
        <label htmlFor={`${id}-minor`} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
          <input
            id={`${id}-minor`}
            name="isMinor"
            type="checkbox"
            checked={isMinor}
            onChange={(event) => setIsMinor(event.target.checked)}
            aria-describedby={`${id}-minor-hint`}
            className="size-5 shrink-0 accent-[var(--color-accent)]"
          />
          I am under 16 (optional)
        </label>
        <div className="ps-8">
          <div>
            <p id={`${id}-minor-hint`} className="mt-1 text-sm text-ink-muted">
              Ticking this only switches off optional data collection for your account; we never ask
              for a date of birth, and it changes nothing about the practice you get.
            </p>
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" full loading={submitting}>
        Create account
      </Button>

      <p role="status" aria-live="polite" className="text-sm text-ink-muted">
        {submitting ? 'Creating your account…' : null}
      </p>
    </form>
  );
}
