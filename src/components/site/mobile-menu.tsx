'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useEffect, useRef, useState } from 'react';
import { buttonClass, cx } from '@/components/ui';
import { NavLink } from './nav-link';
import type { AccountState, NavItem } from './nav-items';

const ITEM =
  'flex min-h-12 items-center border-b border-line px-1 text-lg text-ink no-underline hover:text-ink ' +
  'aria-[current=page]:font-bold aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8';

/** The bar's destinations: four fit a 320 px phone with the Menu button beside them. */
const BAR_ITEMS = 4;

const TAB =
  'flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-control px-1 text-2xs font-medium leading-tight text-ink-muted no-underline ' +
  'hover:text-ink aria-[current=page]:bg-accent-soft aria-[current=page]:font-semibold aria-[current=page]:text-accent-ink';

/**
 * The compact navigation below the large breakpoint: a bar floating at the
 * bottom of the screen, within reach of a thumb, with the main destinations
 * and a Menu button. Menu opens everything else (the secondary pages, the
 * account, signing in) as a sheet above the bar: a disclosure, not a modal.
 * It closes on Escape (returning focus to its button), on navigation, and
 * when the learner clicks outside it.
 *
 * The bar lives in the site header, so a session's focus mode hides it with
 * the rest of the site chrome (src/app/globals.css); the page's footer keeps
 * clear of it there too.
 */
export function MobileMenu({
  primary,
  secondary,
  account,
}: {
  primary: NavItem[];
  secondary: NavItem[];
  account: AccountState;
}) {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      button.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panel.current?.contains(target) || button.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const bar = primary.slice(0, BAR_ITEMS);

  return (
    <div data-bottom-nav className="lg:hidden">
      <div
        ref={panel}
        id="site-menu"
        hidden={!open}
        className="fixed inset-x-3 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-40 max-h-[calc(100dvh-10rem)] overflow-y-auto rounded-card border-[1.5px] border-ink bg-surface shadow-raised"
      >
        <nav aria-label={t('nav.mainLabel')} className="px-4 pb-5 pt-1">
          <ul>
            {primary.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} match={item.match} except={item.except} className={ITEM}>
                  {t(`nav.${item.labelKey}`)}
                </NavLink>
              </li>
            ))}
          </ul>
          {secondary.length > 0 ? (
            <ul className="mt-2">
              {secondary.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    match={item.match} except={item.except}
                    className={cx(ITEM, 'min-h-11 text-base text-ink-muted')}
                  >
                    {t(`nav.${item.labelKey}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-5 flex flex-col gap-3">
            {account === 'registered' ? (
              <Link href="/account" className={buttonClass({ variant: 'secondary', full: true })}>
                {t('nav.account')}
              </Link>
            ) : null}
            {account === 'guest' ? <p className="text-sm leading-relaxed text-ink-muted">{t('guest.note')}</p> : null}
            {account === 'visitor' || account === 'guest' ? (
              // The same two equal buttons as the desktop bar
              <div className="grid grid-cols-2 gap-3">
                <Link href="/sign-in" className={buttonClass({ variant: 'secondary', full: true })}>
                  {t('nav.signIn')}
                </Link>
                <Link href="/sign-up" className={buttonClass({ variant: 'ink', full: true })}>
                  {t('nav.createAccount')}
                </Link>
              </div>
            ) : null}
          </div>
        </nav>
      </div>

      <nav
        aria-label={t('nav.barLabel')}
        className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 rounded-card border-[1.5px] border-ink bg-paper p-1 shadow-raised"
      >
        <ul className="grid" style={{ gridTemplateColumns: `repeat(${bar.length + 1}, minmax(0, 1fr))` }}>
          {bar.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} match={item.match} except={item.except} className={TAB}>
                <NavIcon name={item.labelKey} />
                <span className="max-w-full truncate">{t(`nav.short.${item.labelKey}`)}</span>
              </NavLink>
            </li>
          ))}
          <li>
            <button
              ref={button}
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
              className={cx(TAB, 'aria-expanded:bg-surface-sunken aria-expanded:text-ink')}
            >
              <NavIcon name={open ? 'close' : 'menu'} />
              <span>{open ? t('nav.close') : t('nav.menu')}</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

/** Small line icons for the bar, drawn in the text colour; the label beside each is what it means. */
function NavIcon({ name }: { name: NavItem['labelKey'] | 'menu' | 'close' }) {
  const paths: Record<typeof name, string> = {
    dashboard: 'M3 3h5.5v6H3zM11.5 3H17v3.5h-5.5zM11.5 9.5H17V17h-5.5zM3 12h5.5v5H3z',
    exams: 'M5 2.5h7.5L16 6v11.5H5zM12.5 2.5V6H16M8 10h5M8 13.5h5',
    bocconi: 'M2.5 7.5L10 3l7.5 4.5M4 8.5v6.5M8 8.5v6.5M12 8.5v6.5M16 8.5v6.5M2.5 17h15',
    guides: 'M10 5.5C8.5 4 6 3.5 3 3.5v12c3 0 5.5.5 7 2 1.5-1.5 4-2 7-2v-12c-3 0-5.5.5-7 2zM10 5.5v12',
    howScoringWorks: 'M3.5 15a6.5 6.5 0 1 1 13 0M10 15l3-4.5M3 17.5h14',
    mistakeNotebook: 'M5 2.5h10.5v15H5zM3 6h3.5M3 10h3.5M3 14h3.5M9.5 7.5l3.5 3.5M13 7.5l-3.5 3.5',
    studyPlan: 'M3 4.5h14v12.5H3zM3 8.5h14M7 2.5v4M13 2.5v4M6.5 12h2M11.5 12h2',
    menu: 'M3 5.5h14M3 10h14M3 14.5h14',
    close: 'M5 5l10 10M15 5L5 15',
  };
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
