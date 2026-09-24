import type { Metadata } from 'next';
import './globals.css';
import { SITE, indexingEnabled, siteUrl } from '@/lib/site';
import { getCurrentUser } from '@/lib/auth/session';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';
import type { AccountState } from '@/components/site/nav-items';
import { sans } from './_fonts/sans';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  // Staging and preview deployments must never be indexed.
  robots: indexingEnabled()
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: 'summary_large_image' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const account: AccountState = !user ? 'visitor' : user.isGuest ? 'guest' : 'registered';

  return (
    <html lang="en" className={sans.variable}>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <SiteHeader account={account} />

        <main id="main" className="flex-1">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
