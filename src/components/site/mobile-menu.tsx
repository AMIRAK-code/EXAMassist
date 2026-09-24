'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { buttonClass, cx } from '@/components/ui';
import { NavLink } from './nav-link';
import { GUEST_NOTE, type AccountState, type NavItem } from './nav-items';

const ITEM =
  'flex min-h-12 items-center border-b border-line px-1 text-lg text-ink no-underline hover:text-ink ' +
  'aria-[current=page]:font-bold aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8';

/**
 * The compact navigation below the large breakpoint: a disclosure, not a
 * modal. It closes on Escape (returning focus to its button), on navigation,
 * and when the learner clicks outside it.
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

  return (
    <>
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-2 rounded-control border border-ink px-3 text-[0.9375rem] font-semibold text-ink lg:hidden"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          {open ? (
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          ) : (
            <path d="M2.5 5h13M2.5 9h13M2.5 13h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          )}
        </svg>
        {open ? 'Close' : 'Menu'}
      </button>

      <div
        ref={panel}
        id="site-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b-[1.5px] border-ink bg-surface shadow-raised lg:hidden"
      >
        <nav aria-label="Main" className="mx-auto max-w-6xl px-4 pb-6 pt-2 sm:px-6">
          <ul>
            {primary.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} match={item.match} className={ITEM}>
                  {item.label}
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
                    match={item.match}
                    className={cx(ITEM, 'min-h-11 text-base text-ink-muted')}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-5 flex flex-col gap-3">
            {account === 'registered' ? (
              <Link href="/account" className={buttonClass({ variant: 'secondary', full: true })}>
                Account
              </Link>
            ) : null}
            {account === 'guest' ? (
              <>
                <p className="text-sm leading-relaxed text-ink-muted">{GUEST_NOTE}</p>
                <Link href="/sign-up" className={buttonClass({ variant: 'ink', full: true })}>
                  Keep your progress
                </Link>
                <Link href="/sign-in" className={buttonClass({ variant: 'secondary', full: true })}>
                  Sign in to another account
                </Link>
              </>
            ) : null}
            {account === 'visitor' ? (
              <Link href="/sign-in" className={buttonClass({ variant: 'secondary', full: true })}>
                Sign in
              </Link>
            ) : null}
          </div>
        </nav>
      </div>
    </>
  );
}
