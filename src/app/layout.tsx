import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { INDEPENDENCE_NOTICE, SITE, indexingEnabled, siteUrl } from '@/lib/site';
import { getCurrentUser } from '@/lib/auth/session';

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

const PUBLIC_NAV = [
  { href: '/exams', label: 'Exams' },
  { href: '/guides', label: 'Guides' },
];

const LEARNER_NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/readiness', label: 'Readiness' },
];

const FOOTER_EXAMS = [
  { href: '/exams/bocconi-online-test', label: 'Bocconi Online Test' },
  { href: '/exams/digital-sat', label: 'Digital SAT' },
  { href: '/exams/enhanced-act', label: 'Enhanced ACT' },
  { href: '/exams/lsat', label: 'LSAT' },
  { href: '/exams/gmat', label: 'GMAT' },
  { href: '/exams/gre', label: 'GRE' },
];

const FOOTER_ABOUT = [
  { href: '/about/editorial-standards', label: 'Editorial standards' },
  { href: '/about/how-scoring-works', label: 'How our scoring works' },
  { href: '/report-question', label: 'Report a question' },
  { href: '/about/privacy', label: 'Privacy' },
  { href: '/about/terms', label: 'Terms' },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const signedIn = Boolean(user);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
            <Link
              href="/"
              className="font-serif text-xl font-semibold tracking-tight text-ink no-underline"
            >
              {SITE.name}
            </Link>

            <nav aria-label="Main" className="ms-auto">
              <ul className="flex items-center gap-0.5 text-sm sm:gap-1">
                {[...PUBLIC_NAV, ...(signedIn ? LEARNER_NAV : [])].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-sm px-2.5 py-2 text-ink-muted no-underline transition-colors hover:bg-surface-sunken hover:text-ink sm:px-3"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="ms-1">
                  {user && !user.isGuest ? (
                    <Link
                      href="/account"
                      className="rounded-sm px-2.5 py-2 text-ink-muted no-underline transition-colors hover:bg-surface-sunken hover:text-ink"
                    >
                      Account
                    </Link>
                  ) : (
                    <Link
                      href="/sign-in"
                      className="rounded-sm bg-accent px-3 py-2 font-medium text-accent-contrast no-underline shadow-card transition-colors hover:bg-accent-strong"
                    >
                      Sign in
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main id="main" className="flex-1">
          {children}
        </main>

        <footer className="mt-20 border-t border-line bg-surface-sunken">
          <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-ink-muted sm:px-6">
            <div className="grid gap-10 sm:grid-cols-3">
              <div>
                <h2 className="mb-2.5 font-serif text-base text-ink">{SITE.name}</h2>
                <p className="max-w-xs leading-relaxed">{SITE.tagline}.</p>
              </div>

              <nav aria-labelledby="footer-exams">
                <h2 id="footer-exams" className="mb-2.5 font-serif text-base text-ink">
                  Exams
                </h2>
                <ul className="space-y-1.5">
                  {FOOTER_EXAMS.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="no-underline hover:underline">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-labelledby="footer-about">
                <h2 id="footer-about" className="mb-2.5 font-serif text-base text-ink">
                  About
                </h2>
                <ul className="space-y-1.5">
                  {FOOTER_ABOUT.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="no-underline hover:underline">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <p className="mt-10 border-t border-line pt-6 text-xs leading-relaxed text-ink-subtle">
              {INDEPENDENCE_NOTICE}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
