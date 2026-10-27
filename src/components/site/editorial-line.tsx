import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/**
 * The agreed one-line description of the question bank. It says what the
 * records support and points to the page that explains the rest, including
 * which checks are done by a model and which, if any, by a person.
 */
export function EditorialLine({ onInk = false, className }: { onInk?: boolean; className?: string }) {
  const t = useTranslations('common.site');
  return (
    <p className={className}>
      {t.rich('editorialLine', {
        link: (chunks) => (
          <Link
            href="/about/editorial-standards"
            className={
              onInk
                ? 'text-ink-inverse underline decoration-accent-on-ink underline-offset-4 hover:text-ink-inverse'
                : undefined
            }
          >
            {chunks}
          </Link>
        ),
      })}
    </p>
  );
}
