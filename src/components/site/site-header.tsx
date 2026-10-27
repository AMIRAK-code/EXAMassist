import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { SITE } from '@/lib/site';
import { buttonClass } from '@/components/ui';
import { AccountAware } from './account-aware';
import { LanguageSwitcher } from './language-switcher';
import { MobileMenu } from './mobile-menu';
import { NavLink } from './nav-link';
import { LEARNER_NAV, LEARNER_SECONDARY, PUBLIC_NAV, type AccountState } from './nav-items';

// No display utility here: callers add `inline-flex` or `hidden lg:inline-flex`,
// because two display utilities on one element resolve by stylesheet order, not intent.
const LINK =
  'relative min-h-11 items-center px-2.5 text-[0.9375rem] font-medium text-ink-muted no-underline ' +
  'hover:text-ink aria-[current=page]:font-semibold aria-[current=page]:text-ink ' +
  "after:absolute after:inset-x-2.5 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-accent after:opacity-0 aria-[current=page]:after:opacity-100 after:content-['']";

const ACCOUNT_STATES: AccountState[] = ['visitor', 'guest', 'registered'];

/**
 * The site header. Visitors see the public pages and a way in; anyone with a
 * session sees the learner's destinations. Below the large breakpoint the
 * destinations collapse into one menu, so nothing overflows a phone.
 *
 * `deferred` marks a page saved as a static file (src/lib/seo/static-pages.ts):
 * the server saw no session, so it renders the bar for every account state and
 * the browser's remembered state chooses one (AccountAware).
 */
export async function SiteHeader({ account, locale, deferred = false }: { account: AccountState; locale: Locale; deferred?: boolean }) {
  const t = await getTranslations('common');

  function bar(state: AccountState) {
    const learner = state !== 'visitor';
    const primary = learner ? LEARNER_NAV : PUBLIC_NAV;
    return (
      <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={t('site.homeLabel', { name: SITE.name })}
          className="flex min-h-11 shrink-0 items-center no-underline"
        >
          {/* The brand files in public/brand are the source of truth; never redraw the mark in text.
              PNG, not SVG: the SVG's lettering is live Arial text, which a device without Arial would redraw. */}
          <img src="/brand/uniexamer-logo.png" alt="" width={125} height={30} className="block" />
        </Link>

        <nav aria-label={t('nav.mainLabel')} className="ms-4 hidden lg:block">
          <ul className="flex items-center gap-1">
            {primary.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} match={item.match} except={item.except} className={`inline-flex ${LINK}`}>
                  {t(`nav.${item.labelKey}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={t('language.label')} />
          {state === 'visitor' || state === 'guest' ? (
            // Signing in and creating an account sit side by side, as equals
            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/sign-in" className={buttonClass({ variant: 'secondary', size: 'sm' })}>
                {t('nav.signIn')}
              </Link>
              <Link href="/sign-up" className={buttonClass({ variant: 'ink', size: 'sm' })}>
                {t('nav.createAccount')}
              </Link>
            </div>
          ) : null}
          {state === 'visitor' ? (
            <Link href="/exams" className={buttonClass({ variant: 'primary', size: 'sm' })}>
              <span className="lg:hidden">{t('nav.start')}</span>
              <span className="hidden lg:inline">{t('nav.startPractising')}</span>
            </Link>
          ) : null}
          {state === 'registered' ? (
            <NavLink href="/account" className={`${LINK} hidden lg:inline-flex`}>
              {t('nav.account')}
            </NavLink>
          ) : null}

          <MobileMenu primary={primary} secondary={learner ? LEARNER_SECONDARY : []} account={state} />
        </div>
      </div>
    );
  }

  const states = deferred ? ACCOUNT_STATES : [account];
  return (
    <header data-site-chrome className="sticky top-0 z-40 border-b-[1.5px] border-ink bg-paper">
      <AccountAware served={account} deferred={deferred} bars={Object.fromEntries(states.map((state) => [state, bar(state)]))} />
    </header>
  );
}
