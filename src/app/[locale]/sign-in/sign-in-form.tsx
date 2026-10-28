'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Alert, Button, buttonClass, cx, fieldClass } from '@/components/ui';
import { answerMessage, postJson } from '@/components/auth/email-code';

/**
 * Email and password sign-in.
 *
 * The server owns every decision here: it decides whether the credentials are
 * valid, whether the caller is rate limited, and what the learner is told. This
 * component only renders that answer.
 */

export function SignInForm({
  next,
  forgotHref,
  codeHref,
}: {
  next: string | null;
  /** Null when this deployment cannot send email, so there is no reset to offer. */
  forgotHref: string | null;
  codeHref: string | null;
}) {
  const t = useTranslations('auth');
  const router = useRouter();
  const id = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Which fields the error is about: wrong credentials concern both; a network
  // failure or a rate limit concerns neither.
  const [fieldsInvalid, setFieldsInvalid] = useState(false);
  const errorId = `${id}-error`;

  // `next` is validated on the server before it reaches this component; this is
  // the same rule restated so a relative path is the only thing we can navigate
  // to even if the prop were ever built somewhere else.
  const destination = next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    setFieldsInvalid(false);

    const answer = await postJson('/api/auth/sign-in', { email, password });

    if (!answer) {
      setSubmitting(false);
      setError(t('errors.network'));
      return;
    }

    if (!answer.ok) {
      setSubmitting(false);
      setError(
        answer.code === 'invalid-request'
          ? t('errors.signInIncomplete')
          : answerMessage(t, answer, t('signIn.form.fallback'), 'signInRateLimited'),
      );
      setFieldsInvalid(answer.code === 'invalid-credentials' || answer.status === 400);
      return;
    }

    router.push(destination);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" title={t('signIn.form.failedTitle')}>
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
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={fieldsInvalid || undefined}
          aria-describedby={fieldsInvalid ? errorId : undefined}
          className={fieldClass()}
        />
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={fieldsInvalid || undefined}
          aria-describedby={fieldsInvalid ? errorId : undefined}
          className={fieldClass()}
        />
        {forgotHref ? (
          <p className="mt-2 text-sm">
            <Link href={forgotHref}>{t('signIn.form.forgot')}</Link>
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" full loading={submitting}>
        {t('signIn.form.submit')}
      </Button>

      <p role="status" aria-live="polite" className="text-sm text-ink-muted">
        {submitting ? t('signIn.form.checking') : null}
      </p>

      {codeHref ? (
        <p className="border-t border-line pt-4 text-sm">
          <Link href={codeHref}>{t('signIn.form.useCode')}</Link>
        </p>
      ) : null}
    </form>
  );
}
