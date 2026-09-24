import Link from 'next/link';
import { SITE } from '@/lib/site';
import { buttonClass } from '@/components/ui';
import { MobileMenu } from './mobile-menu';
import { NavLink } from './nav-link';
import { LEARNER_NAV, LEARNER_SECONDARY, PUBLIC_NAV, type AccountState } from './nav-items';

// No display utility here: callers add `inline-flex` or `hidden lg:inline-flex`,
// because two display utilities on one element resolve by stylesheet order, not intent.
const LINK =
  'relative min-h-11 items-center px-2.5 text-[0.9375rem] font-medium text-ink-muted no-underline ' +
  'hover:text-ink aria-[current=page]:font-semibold aria-[current=page]:text-ink ' +
  "after:absolute after:inset-x-2.5 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-accent after:opacity-0 aria-[current=page]:after:opacity-100 after:content-['']";

/**
 * The site header. Visitors see the public pages and a way in; anyone with a
 * session sees the learner's destinations. Below the large breakpoint the
 * destinations collapse into one menu, so nothing overflows a phone.
 */
export function SiteHeader({ account }: { account: AccountState }) {
  const learner = account !== 'visitor';
  const primary = learner ? LEARNER_NAV : PUBLIC_NAV;

  return (
    <header className="sticky top-0 z-40 border-b-[1.5px] border-ink bg-paper">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={`${SITE.name} home`}
          className="shrink-0 text-2xl font-extrabold tracking-[-0.04em] text-ink no-underline hover:text-ink"
        >
          {SITE.name}
          <span aria-hidden="true" className="text-accent">
            .
          </span>
        </Link>

        <nav aria-label="Main" className="ms-4 hidden lg:block">
          <ul className="flex items-center gap-1">
            {primary.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} match={item.match} className={`inline-flex ${LINK}`}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          {account === 'visitor' ? (
            <>
              <NavLink href="/sign-in" className={`${LINK} hidden lg:inline-flex`}>
                Sign in
              </NavLink>
              <Link href="/exams" className={buttonClass({ variant: 'ink', size: 'sm' })}>
                <span className="lg:hidden">Start</span>
                <span className="hidden lg:inline">Start practising</span>
              </Link>
            </>
          ) : null}
          {account === 'guest' ? (
            <>
              <NavLink href="/sign-in" className={`${LINK} hidden lg:inline-flex`}>
                Sign in
              </NavLink>
              <div className="hidden lg:block">
                <Link href="/sign-up" className={buttonClass({ variant: 'ink', size: 'sm' })}>
                  Keep your progress
                </Link>
              </div>
            </>
          ) : null}
          {account === 'registered' ? (
            <NavLink href="/account" className={`${LINK} hidden lg:inline-flex`}>
              Account
            </NavLink>
          ) : null}

          <MobileMenu
            primary={primary}
            secondary={learner ? LEARNER_SECONDARY : []}
            account={account}
          />
        </div>
      </div>
    </header>
  );
}
