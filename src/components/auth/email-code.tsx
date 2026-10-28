'use client';

import { useTranslations } from 'next-intl';
import { fieldClass } from '@/components/ui';

/**
 * Shared pieces of the auth forms (sign-in, sign-up, code sign-in, password
 * reset, address confirmation). The server decides everything; these only
 * send the request and render its answer, in the learner's language.
 */

export interface ApiAnswer {
  ok: boolean;
  status: number;
  code?: string;
  message?: string;
  retryAfterSeconds?: number;
  body: Record<string, unknown> | null;
}

/** POSTs JSON the way every form on the site does; null when the network failed. */
export async function postJson(url: string, payload: unknown): Promise<ApiAnswer | null> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
    body: JSON.stringify(payload),
  }).catch(() => null);
  if (!response) return null;

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  const error = (body?.error ?? null) as
    | { code?: string; message?: string; detail?: { retryAfterSeconds?: number } }
    | null;
  return {
    ok: response.ok,
    status: response.status,
    code: error?.code,
    message: error?.message,
    retryAfterSeconds: error?.detail?.retryAfterSeconds,
    body,
  };
}

/** A translator for the `auth` namespace, as `useTranslations('auth')` returns it. */
export type AuthTranslate = (key: string, values?: Record<string, string | number>) => string;

/**
 * The server's error codes and the `auth.errors` message for each. The API
 * answers in English; the learner reads the message for the code, in their
 * own language.
 */
const ERROR_KEYS: Record<string, string> = {
  'invalid-credentials': 'invalidCredentials',
  'signup-failed': 'signupFailed',
  'code-format': 'codeFormat',
  'code-invalid': 'codeInvalid',
  'code-expired': 'codeExpired',
  'code-locked': 'codeLocked',
  'email-unavailable': 'emailUnavailable',
  'account-required': 'accountRequired',
  unauthorized: 'unauthorized',
  forbidden: 'forbidden',
  'server-error': 'serverError',
};

/** Codes the password policy returns; these belong next to the password box. */
const PASSWORD_KEYS: Record<string, string> = {
  'too-short': 'tooShort',
  'too-long': 'tooLong',
  'contains-email': 'containsEmail',
  'too-common': 'tooCommon',
  repeated: 'repeated',
};

export function isPasswordError(code: string | undefined): boolean {
  return !!code && code in PASSWORD_KEYS;
}

/** The sentence for a password-policy refusal. */
export function passwordMessage(t: AuthTranslate, code: string | undefined, minLength: number): string {
  const key = code ? PASSWORD_KEYS[code] : undefined;
  return key ? t(`errors.password.${key}`, { min: minLength }) : t('errors.password.chooseDifferent');
}

/**
 * The sentence for an error answer, with a wait time when we were rate
 * limited. `rateLimit` picks the wording for the action that was limited.
 */
export function answerMessage(
  t: AuthTranslate,
  answer: Pick<ApiAnswer, 'code' | 'retryAfterSeconds'>,
  fallback: string,
  rateLimit: 'rateLimited' | 'signInRateLimited' | 'signUpRateLimited' = 'rateLimited',
): string {
  if (answer.code === 'rate-limited') {
    const minutes = answer.retryAfterSeconds ? Math.ceil(answer.retryAfterSeconds / 60) : null;
    return minutes ? t(`errors.${rateLimit}Minutes`, { minutes }) : t(`errors.${rateLimit}`);
  }
  const key = answer.code ? ERROR_KEYS[answer.code] : undefined;
  return key ? t(`errors.${key}`) : fallback;
}

/** Error codes that are about the code the learner typed, so they belong next to that box. */
export function isCodeError(code: string | undefined): boolean {
  return code === 'code-format' || code === 'code-invalid' || code === 'code-expired' || code === 'code-locked';
}

export function CodeField({
  id,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const t = useTranslations('auth.fields');
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {t('code')}
      </label>
      <input
        id={id}
        name="code"
        type="text"
        inputMode="numeric"
        // Lets phones offer the code straight from the email notification.
        autoComplete="one-time-code"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={9}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={fieldClass('font-mono text-lg tracking-[0.25em]')}
      />
    </div>
  );
}

/** The emailed address inside a translated sentence, kept on one breakable line. */
export function emailChunk(chunks: React.ReactNode) {
  return <span className="break-all font-medium">{chunks}</span>;
}
