import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { SITE } from '@/lib/site';
import { buttonClass } from '@/components/ui';
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

/**
 * The site header. Visitors see the public pages and a way in; anyone with a
 * session sees the learner's destinations. Below the large breakpoint the
 * destinations collapse into one menu, so nothing overflows a phone.
 */
export async function SiteHeader({ account, locale }: { account: AccountState; locale: Locale }) {
  const t = await getTranslations('common');
  const learner = account !== 'visitor';
  const primary = learner ? LEARNER_NAV : PUBLIC_NAV;

  return (
    <header data-site-chrome className="sticky top-0 z-40 border-b-[1.5px] border-ink bg-paper">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={t('site.homeLabel', { name: SITE.name })}
          className="flex min-h-11 shrink-0 items-center no-underline"
        >
          {/* The brand files in public/brand are the source of truth; never redraw the mark in text. */}
          <img src="/brand/examer-wordmark.svg" alt="" width={99} height={28} className="block" />
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
          {account === 'visitor' || account === 'guest' ? (
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
          {account === 'visitor' ? (
            <Link href="/exams" className={buttonClass({ variant: 'primary', size: 'sm' })}>
              <span className="lg:hidden">{t('nav.start')}</span>
              <span className="hidden lg:inline">{t('nav.startPractising')}</span>
            </Link>
          ) : null}
          {account === 'registered' ? (
            <NavLink href="/account" className={`${LINK} hidden lg:inline-flex`}>
              {t('nav.account')}
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
