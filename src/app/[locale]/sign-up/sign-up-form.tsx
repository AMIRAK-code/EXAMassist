'use client';

import { useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Alert, Button, buttonClass, cx, fieldClass } from '@/components/ui';
import { answerMessage, isPasswordError, passwordMessage, postJson } from '@/components/auth/email-code';

/**
 * Account creation.
 *
 * The password rule is stated in plain words before anyone types, and the
 * server's own verdict - which is the one that counts - is shown against the
 * field it belongs to.
 */

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
  const t = useTranslations('auth');
  // The confirmation email goes out in the language the account is created in.
  const locale = useLocale();
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
      setPasswordError(passwordMessage(t, 'too-short', minPasswordLength));
      return;
    }

    setSubmitting(true);

    const answer = await postJson('/api/auth/sign-up', {
      email,
      password,
      displayName: displayName.trim() || undefined,
      isMinor,
      locale,
    });

    if (!answer) {
      setSubmitting(false);
      setError(t('errors.network'));
      return;
    }

    if (!answer.ok) {
      setSubmitting(false);
      if (isPasswordError(answer.code)) {
        setPasswordError(passwordMessage(t, answer.code, minPasswordLength));
        return;
      }
      if (answer.code === 'invalid-request') {
        setError(t('errors.invalidEmail'));
        setEmailInvalid(true);
        return;
      }
      setError(answerMessage(t, answer, t('signUp.form.fallback'), 'signUpRateLimited'));
      return;
    }

    // A confirmation code is on its way: ask for it now, while the email is
    // fresh. The page lets them skip straight on to where they were going.
    router.push(
      answer.body?.verificationSent
        ? `/verify-email?sent=1&next=${encodeURIComponent(destination)}`
        : destination,
    );
    router.refresh();
  }

  const remaining = minPasswordLength - password.length;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" title={t('signUp.form.failedTitle')}>
            <p id={errorId}>{error}</p>
          </Alert>
        ) : null}
      </div>

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
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailInvalid(false);
          }}
          aria-invalid={emailInvalid || undefined}
          aria-describedby={emailInvalid ? `${errorId} ${id}-email-hint` : `${id}-email-hint`}
          className={fieldClass()}
        />
        <p id={`${id}-email-hint`} className="mt-1.5 text-sm text-ink-muted">
          {emailCodes ? t('signUp.form.emailHintCodes') : t('signUp.form.emailHint')}
        </p>
      </div>

      <div>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <label htmlFor={`${id}-password`} className="text-sm font-medium">
            {t('fields.password')}
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
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby={`${id}-password-hint ${id}-password-state`}
          aria-invalid={passwordError ? true : undefined}
          className={fieldClass()}
        />
        <p id={`${id}-password-hint`} className="mt-1.5 text-sm text-ink-muted">
          {t('signUp.form.passwordHint', { min: minPasswordLength })}
        </p>
        <p
          id={`${id}-password-state`}
          aria-live="polite"
          className={`mt-1.5 text-sm ${passwordError ? 'text-negative' : 'text-ink-subtle'}`}
        >
          {passwordError ? passwordError : tooShort ? t('signUp.form.remaining', { count: remaining }) : null}
        </p>
      </div>

      <div>
        <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium">
          {t('signUp.form.displayName')}{' '}
          <span className="font-normal text-ink-muted">{t('signUp.form.optional')}</span>
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
          {t('signUp.form.displayNameHint')}
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
          {t('signUp.form.minor')}
        </label>
        <div className="ps-8">
          <div>
            <p id={`${id}-minor-hint`} className="mt-1 text-sm text-ink-muted">
              {t('signUp.form.minorHint')}
            </p>
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" full loading={submitting}>
        {t('signUp.form.submit')}
      </Button>

      <p role="status" aria-live="polite" className="text-sm text-ink-muted">
        {submitting ? t('signUp.form.creating') : null}
      </p>
    </form>
  );
}
