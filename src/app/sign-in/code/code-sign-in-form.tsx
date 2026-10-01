'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Button, buttonClass, cx, fieldClass } from '@/components/ui';
import { CodeField, NETWORK_ERROR, answerMessage, isCodeError, postJson } from '@/components/auth/email-code';

/**
 * Sign-in with an emailed code, in two steps: the address, then the code.
 *
 * The first step always moves on, whether or not an account uses the address,
 * because the server answers the same way in both cases. The wording says
 * "if" for the same reason.
 */
export function CodeSignInForm({
  next,
  passwordHref,
  ttlMinutes,
}: {
  next: string | null;
  passwordHref: string;
  ttlMinutes: number;
}) {
  const router = useRouter();
  const id = useId();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeInvalid, setCodeInvalid] = useState(false);
  const [resent, setResent] = useState(false);
  const errorId = `${id}-error`;

  const destination = next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';

  async function requestCode(again: boolean) {
    setSubmitting(true);
    setError(null);
    setCodeInvalid(false);
    const answer = await postJson('/api/auth/code', { purpose: 'sign-in', email });
    setSubmitting(false);

    if (!answer) return setError(NETWORK_ERROR);
    if (!answer.ok) {
      return setError(
        answer.code === 'invalid-request'
          ? 'Check the email address - that one does not look like a valid address.'
          : answerMessage(answer, 'We could not send a code. Please try again.'),
      );
    }
    setStep('code');
    setResent(again);
    if (again) setCode('');
  }

  async function signIn() {
    setSubmitting(true);
    setError(null);
    setCodeInvalid(false);
    const answer = await postJson('/api/auth/sign-in-code', { email, code });

    if (!answer) {
      setSubmitting(false);
      return setError(NETWORK_ERROR);
    }
    if (!answer.ok) {
      setSubmitting(false);
      setCodeInvalid(isCodeError(answer.code));
      return setError(answerMessage(answer, 'We could not sign you in. Please try again.'));
    }
    router.push(destination);
    router.refresh();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (step === 'email') void requestCode(false);
    else void signIn();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" title={step === 'email' ? 'Code not sent' : 'Sign-in failed'}>
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
            Email me a code
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

          <Button type="submit" size="lg" full loading={submitting}>
            Sign in
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
        <Link href={passwordHref}>Sign in with your password instead</Link>
      </p>
    </form>
  );
}
