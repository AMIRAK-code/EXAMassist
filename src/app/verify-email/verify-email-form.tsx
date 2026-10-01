'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Button, buttonClass, cx } from '@/components/ui';
import { CodeField, NETWORK_ERROR, answerMessage, isCodeError, postJson } from '@/components/auth/email-code';

/**
 * Confirms the signed-in account's address. Arriving from sign-up, a code is
 * already on its way; arriving from the account page, the learner asks for one.
 * Skipping is always allowed: an unconfirmed address changes nothing about the
 * practice on offer.
 */
export function VerifyEmailForm({
  email,
  alreadySent,
  continueHref,
  ttlMinutes,
}: {
  email: string;
  alreadySent: boolean;
  continueHref: string;
  ttlMinutes: number;
}) {
  const router = useRouter();
  const id = useId();
  const [codeSent, setCodeSent] = useState(alreadySent);
  const [resent, setResent] = useState(false);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeInvalid, setCodeInvalid] = useState(false);
  const errorId = `${id}-error`;

  async function sendCode() {
    setSubmitting(true);
    setError(null);
    setCodeInvalid(false);
    const answer = await postJson('/api/auth/code', { purpose: 'verify-email' });
    setSubmitting(false);

    if (!answer) return setError(NETWORK_ERROR);
    if (!answer.ok) return setError(answerMessage(answer, 'We could not send a code. Please try again.'));
    if (answer.body?.alreadyVerified) {
      router.refresh();
      return;
    }
    setResent(codeSent);
    setCodeSent(true);
    setCode('');
  }

  async function confirm() {
    setSubmitting(true);
    setError(null);
    setCodeInvalid(false);
    const answer = await postJson('/api/auth/verify-email', { code });

    if (!answer) {
      setSubmitting(false);
      return setError(NETWORK_ERROR);
    }
    if (!answer.ok) {
      setSubmitting(false);
      setCodeInvalid(isCodeError(answer.code));
      return setError(answerMessage(answer, 'We could not confirm your address. Please try again.'));
    }
    router.push(continueHref);
    router.refresh();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    if (codeSent) void confirm();
    else void sendCode();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" title="Address not confirmed">
            <p id={errorId}>{error}</p>
          </Alert>
        ) : null}
      </div>

      {codeSent ? (
        <>
          <div role="status" aria-live="polite">
            <Alert tone="info" title={resent ? 'New code sent' : 'Check your email'}>
              <p>
                We have sent a 6-digit code to <span className="break-all font-medium">{email}</span>
                {resent ? ', and the earlier one no longer works' : ''}. It expires in {ttlMinutes} minutes. It can
                take a minute to arrive, so check your spam folder too.
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
            Confirm address
          </Button>

          <button
            type="button"
            onClick={() => void sendCode()}
            disabled={submitting}
            className={cx(buttonClass({ variant: 'quiet', size: 'sm' }), '-ms-3.5 min-h-11')}
          >
            Send a new code
          </button>
        </>
      ) : (
        <>
          <p>
            We will send a 6-digit code to <span className="break-all font-medium">{email}</span>. Entering it shows
            that the address works, so password resets and sign-in codes will reach you.
          </p>
          <Button type="submit" size="lg" full loading={submitting}>
            Send me a code
          </Button>
        </>
      )}

      <p className="text-sm">
        <Link href={continueHref}>Skip for now</Link>
      </p>
    </form>
  );
}
