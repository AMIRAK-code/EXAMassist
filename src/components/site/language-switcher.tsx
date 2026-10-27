'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { LOCALES, LOCALE_INFO, localizePath, splitLocale, type Locale } from '@/i18n/locales';
import { Flag } from './flags';

/**
 * The language menu in the header: a flag and the current language, opening
 * a list of the same page in every language.
 *
 * Plain links, not client-side state: each language is its own URL, which is
 * what search engines index, what a shared link preserves and what still
 * works without JavaScript (the list is server-rendered, hidden until opened).
 */
export function LanguageSwitcher({
  locale,
  label,
  compact = false,
}: {
  locale: Locale;
  /** "Language", in the current language. */
  label: string;
  /** Flag only, for narrow layouts. */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '/';
  const { path } = splitLocale(pathname);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onListKey = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>('a'));
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === 'ArrowDown' ? (index + 1) % links.length : (index - 1 + links.length) % links.length;
    links[next]?.focus();
  };

  const current = LOCALE_INFO[locale];

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${current.nativeName}`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-[0.9375rem] font-medium text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Flag locale={locale} />
        {compact ? null : <span className="uppercase tracking-wide">{locale}</span>}
        <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <ul
        id={listId}
        hidden={!open}
        onKeyDown={onListKey}
        className="absolute end-0 top-full z-50 mt-1 min-w-48 rounded-lg border-[1.5px] border-ink bg-surface p-1 shadow-[4px_4px_0_0_var(--color-ink)]"
      >
        {LOCALES.map((code) => {
          const info = LOCALE_INFO[code];
          const active = code === locale;
          return (
            <li key={code}>
              <a
                href={localizePath(path, code)}
                hrefLang={info.htmlLang}
                lang={info.htmlLang}
                aria-current={active ? 'true' : undefined}
                onClick={() => {
                  try {
                    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; samesite=lax`;
                  } catch {
                    // Remembering the choice is a convenience; the URL already carries it.
                  }
                }}
                className="flex min-h-11 items-center gap-3 rounded-md px-3 text-[0.9375rem] text-ink no-underline hover:bg-accent-soft focus-visible:bg-accent-soft focus-visible:outline-none aria-[current=true]:font-semibold"
              >
                <Flag locale={code} />
                <span>{info.nativeName}</span>
                {active ? (
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="ms-auto h-4 w-4 text-accent">
                    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
