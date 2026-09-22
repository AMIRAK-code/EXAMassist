'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button } from '@/components/ui';

/**
 * Email and password sign-in.
 *
 * The server owns every decision here: it decides whether the credentials are
 * valid, whether the caller is rate limited, and what the learner is told. This
 * component only renders that answer.
 */

interface ApiErrorBody {
  error?: { code?: string; message?: string; detail?: { retryAfterSeconds?: number } };
}

const FIELD_CLASS =
  'w-full rounded border border-line-strong bg-surface px-3 py-2.5 text-base text-ink';

export function SignInForm({ next }: { next: string | null }) {
  const router = useRouter();
  const id = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // `next` is validated on the server before it reaches this component; this is
  // the same rule restated so a relative path is the only thing we can navigate
  // to even if the prop were ever built somewhere else.
  const destination = next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);

    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'examer' },
      body: JSON.stringify({ email, password }),
    }).catch(() => null);

    if (!response) {
      setSubmitting(false);
      setError('We could not reach the server. Check your connection and try again.');
      return;
    }

    const body: ApiErrorBody | null = await response.json().catch(() => null);

    if (!response.ok) {
      setSubmitting(false);
      const code = body?.error?.code;
      const retry = body?.error?.detail?.retryAfterSeconds;
      if (code === 'rate-limited') {
        const minutes = retry ? Math.ceil(retry / 60) : null;
        setError(
          `Too many sign-in attempts. Please try again${minutes ? ` in about ${minutes} minute${minutes === 1 ? '' : 's'}` : ' later'}.`,
        );
        return;
      }
      setError(body?.error?.message ?? 'We could not sign you in. Please try again.');
      return;
    }

    router.push(destination);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div aria-live="assertive" aria-atomic="true">
        {error ? (
          <Alert tone="negative" role="alert" title="Sign-in failed">
            <p>{error}</p>
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
          onChange={(event) => setEmail(event.target.value)}
          className={FIELD_CLASS}
        />
      </div>

      <div>
        <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
          <label htmlFor={`${id}-password`} className="text-sm font-medium">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="rounded px-1 text-sm text-accent underline"
          >
            {showPassword ? 'Hide password' : 'Show password'}
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
          className={FIELD_CLASS}
        />
      </div>

      <Button type="submit" size="lg" full disabled={submitting}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>

      <p role="status" aria-live="polite" className="text-sm text-ink-muted">
        {submitting ? 'Checking your details…' : null}
      </p>
    </form>
  );
}
