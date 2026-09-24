import Link from 'next/link';

/**
 * The agreed one-line description of the question bank. It says what the
 * records support and points to the page that explains the rest, including
 * which checks are done by a model and which, if any, by a person.
 */
export function EditorialLine({ onInk = false, className }: { onInk?: boolean; className?: string }) {
  return (
    <p className={className}>
      AI-assisted practice questions with worked explanations. See our{' '}
      <Link
        href="/about/editorial-standards"
        className={
          onInk
            ? 'text-ink-inverse underline decoration-accent-on-ink underline-offset-4 hover:text-ink-inverse'
            : undefined
        }
      >
        editorial standards
      </Link>{' '}
      for how questions are created and checked.
    </p>
  );
}
