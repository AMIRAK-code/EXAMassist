'use client';

import { useId, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { Alert, Button, buttonClass, cx } from '@/components/ui';
import { CodeField, answerMessage, emailChunk, isCodeError, postJson } from '@/components/auth/email-code';

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
  const t = useTranslations('auth');
  // The email goes out in the language of the page it was asked for on.
  const locale = useLocale();
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
    const answer = await postJson('/api/auth/code', { purpose: 'verify-email', locale });
    setSubmitting(false);

    if (!answer) return setError(t('errors.network'));
    if (!answer.ok) return setError(answerMessage(t, answer, t('codeSent.sendFallback')));
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
      return setError(t('errors.network'));
    }
    if (!answer.ok) {
      setSubmitting(false);
      setCodeInvalid(isCodeError(answer.code));
      return setError(answerMessage(t, answer, t('verifyEmail.form.fallback')));
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
          <Alert tone="negative" role="alert" title={t('verifyEmail.form.failedTitle')}>
            <p id={errorId}>{error}</p>
          </Alert>
        ) : null}
      </div>

      {codeSent ? (
        <>
          <div role="status" aria-live="polite">
            <Alert tone="info" title={resent ? t('codeSent.resentTitle') : t('codeSent.title')}>
              <p>
                {t.rich(resent ? 'codeSent.toAddressResent' : 'codeSent.toAddress', {
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

          <Button type="submit" size="lg" full loading={submitting}>
            {t('verifyEmail.form.submit')}
          </Button>

          <button
            type="button"
            onClick={() => void sendCode()}
            disabled={submitting}
            className={cx(buttonClass({ variant: 'quiet', size: 'sm' }), '-ms-3.5 min-h-11')}
          >
            {t('codeSent.sendNew')}
          </button>
        </>
      ) : (
        <>
          <p>{t.rich('verifyEmail.form.intro', { email, addr: emailChunk })}</p>
          <Button type="submit" size="lg" full loading={submitting}>
            {t('verifyEmail.form.sendCode')}
          </Button>
        </>
      )}

      <p className="text-sm">
        <Link href={continueHref}>{t('verifyEmail.form.skip')}</Link>
      </p>
    </form>
  );
}
