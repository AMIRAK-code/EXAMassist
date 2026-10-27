'use client';

import { useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Alert, Button, buttonClass, cx, fieldClass } from '@/components/ui';
import {
  CodeField,
  answerMessage,
  emailChunk,
  isCodeError,
  isPasswordError,
  passwordMessage,
  postJson,
} from '@/components/auth/email-code';

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
  const t = useTranslations('auth');
  // The email goes out in the language of the page it was asked for on.
  const locale = useLocale();
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
    const answer = await postJson('/api/auth/code', { purpose: 'reset-password', email, locale });
    setSubmitting(false);

    if (!answer) return setError(t('errors.network'));
    if (!answer.ok) {
      return setError(
        answer.code === 'invalid-request'
          ? t('errors.invalidEmail')
          : answerMessage(t, answer, t('codeSent.sendFallback')),
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
      return setPasswordError(passwordMessage(t, 'too-short', minPasswordLength));
    }

    setSubmitting(true);
    const answer = await postJson('/api/auth/reset-password', { email, code, password });
    if (!answer) {
      setSubmitting(false);
      return setError(t('errors.network'));
    }
    if (!answer.ok) {
      setSubmitting(false);
      if (isPasswordError(answer.code)) return setPasswordError(passwordMessage(t, answer.code, minPasswordLength));
      setCodeInvalid(isCodeError(answer.code));
      return setError(answerMessage(t, answer, t('forgotPassword.form.fallback')));
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
          <Alert
            tone="negative"
            role="alert"
            title={step === 'email' ? t('codeSent.notSentTitle') : t('forgotPassword.form.failedTitle')}
          >
            <p id={errorId}>{error}</p>
          </Alert>
        ) : null}
      </div>

      {step === 'email' ? (
        <>
          <div>
            <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium">
              {t('fields.email')}
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
              {t('fields.accountEmailHint')}
            </p>
          </div>

          <Button type="submit" size="lg" full loading={submitting}>
            {t('forgotPassword.form.requestCode')}
          </Button>
        </>
      ) : (
        <>
          <div role="status" aria-live="polite">
            <Alert tone="info" title={resent ? t('codeSent.resentTitle') : t('codeSent.title')}>
              <p>
                {t.rich(resent ? 'codeSent.ifAccountResent' : 'codeSent.ifAccount', {
                  email,
                  minutes: ttlMinutes,
                  addr: emailChunk,
                })}
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
                {t('fields.newPassword')}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-pressed={showPassword}
                aria-controls={`${id}-password`}
                className={cx(buttonClass({ variant: 'quiet', size: 'sm' }), 'min-h-11 -me-3')}
              >
                {t('fields.showPassword')}
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
              {t('forgotPassword.form.passwordHint', { min: minPasswordLength })}
            </p>
            <p id={`${id}-password-state`} aria-live="polite" className="mt-1.5 text-sm text-negative">
              {passwordError}
            </p>
          </div>

          <Button type="submit" size="lg" full loading={submitting}>
            {t('forgotPassword.form.submit')}
          </Button>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={() => void requestCode(true)}
              disabled={submitting}
              className={cx(buttonClass({ variant: 'quiet', size: 'sm' }), '-ms-3.5 min-h-11')}
            >
              {t('codeSent.sendNew')}
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
              {t('codeSent.differentAddress')}
            </button>
          </div>
        </>
      )}

      <p className="text-sm">
        <Link href={signInHref}>{t('forgotPassword.form.backToSignIn')}</Link>
      </p>
    </form>
  );
}
