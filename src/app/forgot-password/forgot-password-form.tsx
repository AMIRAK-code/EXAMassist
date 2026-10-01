'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Button, buttonClass, cx, fieldClass } from '@/components/ui';
import { CodeField, NETWORK_ERROR, answerMessage, isCodeError, postJson } from '@/components/auth/email-code';

/** Codes the password policy returns; these belong next to the password box. */
const PASSWORD_CODES = new Set(['too-short', 'too-long', 'contains-email', 'too-common', 'repeated']);

/**
 * Password reset in two steps: the address, then the emailed code together
 * with the new password. Success signs this browser in and every other
 * session for the account out.
 */
export function ForgotPasswordForm({
  next,
  signInHref,
  minPasswordLength,
  ttlMinutes,
}: {
  next: string | null;
  signInHref: string;
  minPasswordLength: number;
  ttlMinutes: number;
}) {
  const router = useRouter();
  const id = useId();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const errorId = `${id}-error`;

  const destination = next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';

  async function requestCode(again: boolean) {
    setSubmitting(true);
    setError(null);
    setCodeInvalid(false);
    const answer = await postJson('/api/auth/code', { purpose: 'reset-password', email });
    setSubmitting(false);

    if (!answer) return setError(NETWORK_ERROR);
    if (!answer.ok) {
      return setError(
        answer.code === 'invalid-request'
          ? 'Check the email address - that one does not look like a valid address.'
          : answerMessage(answer, 'We could not send a code. Please try again.'),
      );
    }
    setStep('reset');
    setResent(again);
    if (again) setCode('');
  }

  async function reset() {
    setError(null);
    setCodeInvalid(false);
    setPasswordError(null);

    if (password.length < minPasswordLength) {
      return setPasswordError(`Use at least ${minPasswordLength} characters. A short phrase works well.`);
    }

    setSubmitting(true);
    const answer = await postJson('/api/auth/reset-password', { email, code, password });
    if (!answer) {
      setSubmitting(false);
      return setError(NETWORK_ERROR);
    }
    if (!answer.ok) {
      setSubmitting(false);
      if (answer.code && PASSWORD_CODES.has(answer.code)) return setPasswordError(answer.message ?? 'Choose a different password.');
      setCodeInvalid(isCodeError(answer.code));
      return setError(answerMessage(answer, 'We could not reset your password. Please try again.'));
    }
    router.push(destination);
    router.refresh();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (step === 'email') void requestCode(false);
    else void reset();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" title={step === 'email' ? 'Code not sent' : 'Password not changed'}>
            <p id={errorId}>{error}</p>
          </Alert>
        ) : null}
      </div>

      {step === 'email' ? (
        <>
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
              onChange={(event) => setEmail(event.target.value)}
              aria-describedby={`${id}-email-hint`}
              className={fieldClass()}
            />
            <p id={`${id}-email-hint`} className="mt-1.5 text-sm text-ink-muted">
              The address you created your account with. We will email it a 6-digit code.
            </p>
          </div>

          <Button type="submit" size="lg" full loading={submitting}>
            Email me a reset code
          </Button>
        </>
      ) : (
        <>
          <div role="status" aria-live="polite">
            <Alert tone="info" title={resent ? 'New code sent' : 'Check your email'}>
              <p>
                If an account uses <span className="break-all font-medium">{email}</span>, we have sent it a
                6-digit code{resent ? ' and the earlier one no longer works' : ''}. It expires in {ttlMinutes}{' '}
                minutes. It can take a minute to arrive, so check your spam folder too.
              </p>
            </Alert>
          </div>

          <CodeField
            id={`${id}-code`}
            value={code}
            onChange={(value) => {
              setCode(value);
              setCodeInvalid(false);
            }}
            invalid={codeInvalid}
            describedBy={codeInvalid ? errorId : undefined}
          />

          <div>
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor={`${id}-password`} className="text-sm font-medium">
                New password
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
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError(null);
              }}
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={`${id}-password-hint ${id}-password-state`}
              className={fieldClass()}
            />
            <p id={`${id}-password-hint`} className="mt-1.5 text-sm text-ink-muted">
              At least {minPasswordLength} characters. A short phrase only you would write works well. Changing it
              signs you out on every other device.
            </p>
            <p id={`${id}-password-state`} aria-live="polite" className="mt-1.5 text-sm text-negative">
              {passwordError}
            </p>
          </div>

          <Button type="submit" size="lg" full loading={submitting}>
            Set new password
          </Button>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={() => void requestCode(true)}
              disabled={submitting}
              className={cx(buttonClass({ variant: 'quiet', size: 'sm' }), '-ms-3.5 min-h-11')}
            >
              Send a new code
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setCode('');
                setError(null);
              }}
              disabled={submitting}
              className={cx(buttonClass({ variant: 'quiet', size: 'sm' }), 'min-h-11')}
            >
              Use a different address
            </button>
          </div>
        </>
      )}

      <p className="text-sm">
        <Link href={signInHref}>Back to sign in</Link>
      </p>
    </form>
  );
}
