import { buttonClass, cx } from '@/components/ui';
import type { Locale } from '@/i18n/locales';
import { GOOGLE_START_PATH } from '@/lib/auth/google';

/**
 * "Continue with Google", above the email form on the sign-in and sign-up
 * pages. Pages render it only when this deployment has a Google OAuth client
 * (googleSettings), the way email codes appear only when email is set up.
 *
 * A plain link, not a client-side navigation: it leaves the app for Google's
 * consent page, and it works without JavaScript.
 */
export function GoogleButton({
  locale,
  next,
  label,
  or,
  hint,
}: {
  locale: Locale;
  next: string | null;
  label: string;
  /** The divider between this button and the email form. */
  or: string;
  /** A line under the button, such as what Google shares with us. */
  hint?: string;
}) {
  const query = new URLSearchParams({ locale });
  if (next) query.set('next', next);

  return (
    <div className="mb-6">
      <a
        href={`${GOOGLE_START_PATH}?${query.toString()}`}
        className={cx(buttonClass({ variant: 'secondary', size: 'lg', full: true }), 'gap-3')}
      >
        <GoogleMark />
        {label}
      </a>
      {hint ? <p className="mt-2 text-sm text-ink-muted">{hint}</p> : null}
      <p className="mt-6 flex items-center gap-3 text-sm text-ink-subtle" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        {or}
        <span className="h-px flex-1 bg-line" />
      </p>
    </div>
  );
}

/** Google's "G", in its own colours, as Google's sign-in branding asks. */
function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="size-5 shrink-0">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
