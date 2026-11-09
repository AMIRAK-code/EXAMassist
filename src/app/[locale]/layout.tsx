import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { pickMessages } from '@/i18n/client-messages';
import '../globals.css';
import { SITE, indexingEnabled, shareImages, siteUrl } from '@/lib/site';
import { getCurrentUser } from '@/lib/auth/session';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import { SidePanels } from '@/components/site/side-panels';
import { browseTree } from '@/lib/content/browse';
import type { AccountState } from '@/components/site/nav-items';
import { routing } from '@/i18n/routing';
import { LOCALE_INFO, type Locale } from '@/i18n/locales';
import { languageAlternates } from '@/i18n/alternates';
import { isSharedRender, localeScript } from '@/lib/seo/static-pages';
import { sans } from '../_fonts/sans';

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common.site' });
  const title = `${SITE.name} — ${t('tagline')}`;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s | ${SITE.shortName}` },
    description: t('description'),
    applicationName: SITE.name,
    // A static file with the logo pack's app icons (192 and 512 px).
    manifest: '/manifest.webmanifest',
    // Staging and preview deployments must never be indexed.
    robots: indexingEnabled() ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
    // The home page in every language. Pages with their own canonical add
    // their own alternates with languageAlternates(path).
    alternates: languageAlternates('/', locale as Locale),
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: LOCALE_INFO[locale as Locale]?.ogLocale ?? 'en_GB',
      title,
      description: t('description'),
      images: shareImages('site', `${SITE.name}: ${t('tagline')}`),
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'common' });
  const user = await getCurrentUser();
  const account: AccountState = !user ? 'visitor' : user.isGuest ? 'guest' : 'registered';
  // A page being saved as a static file, or prerendered at build time (the
  // courses), is served to everyone, and a saved file never passes through
  // src/proxy.ts: the browser decides the menu and the language.
  const snapshot = isSharedRender(await headers());

  return (
    <html lang={LOCALE_INFO[locale].htmlLang} className={sans.variable}>
      <body className="flex min-h-screen flex-col">
        {snapshot ? <script dangerouslySetInnerHTML={{ __html: localeScript(locale, (typeof routing.localeCookie === 'object' && routing.localeCookie.name) || 'NEXT_LOCALE') }} /> : null}
        {/* Only the header's catalogue reaches the browser here: src/i18n/client-messages.tsx. */}
        <NextIntlClientProvider messages={pickMessages(await getMessages(), ['common'])}>
          <a href="#main" className="skip-link">
            {t('skipToContent')}
          </a>

          <SiteHeader account={account} locale={locale} deferred={snapshot} />

          {/* The browse and study-plan panels beside the page, where they belong (src/components/site/panel-paths.ts). */}
          <SidePanels browse={browseTree()} account={account} deferred={snapshot}>
            {children}
          </SidePanels>

          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
