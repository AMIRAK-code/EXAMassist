'use client';

import { fieldClass } from '@/components/ui';

/**
 * Shared pieces of the three email-code forms (code sign-in, password reset,
 * address confirmation). The server decides everything; these only send the
 * request and render its answer.
 */

export const NETWORK_ERROR = 'We could not reach the server. Check your connection and try again.';

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

/** The sentence for an error answer, with a wait time when we were rate limited. */
export function answerMessage(answer: ApiAnswer, fallback: string): string {
  if (answer.code === 'rate-limited') {
    const minutes = answer.retryAfterSeconds ? Math.ceil(answer.retryAfterSeconds / 60) : null;
    return `Too many attempts. Please try again${
      minutes ? ` in about ${minutes} minute${minutes === 1 ? '' : 's'}` : ' later'
    }.`;
  }
  return answer.message ?? fallback;
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
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        6-digit code
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
