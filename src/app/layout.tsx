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

const NAV = [
  { href: '/exams', label: 'Exams' },
  { href: '/guides', label: 'Guides' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <header className="border-b border-line bg-surface">
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
            <Link
              href="/"
              className="font-serif text-xl font-semibold tracking-tight text-ink no-underline"
            >
              {SITE.name}
            </Link>

            <nav aria-label="Main" className="ml-auto">
              <ul className="flex items-center gap-1 text-sm sm:gap-3">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded px-2 py-2 text-ink-muted no-underline hover:bg-surface-sunken hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  {user && !user.isGuest ? (
                    <Link
                      href="/account"
                      className="rounded px-2 py-2 text-ink-muted no-underline hover:bg-surface-sunken hover:text-ink"
                    >
                      Account
                    </Link>
                  ) : (
                    <Link
                      href="/sign-in"
                      className="rounded bg-accent px-3 py-2 font-medium text-accent-contrast no-underline hover:bg-accent-strong"
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

        <footer className="mt-16 border-t border-line bg-surface-sunken">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink-muted sm:px-6">
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <h2 className="mb-2 font-serif text-base text-ink">{SITE.name}</h2>
                <p className="max-w-xs">{SITE.tagline}.</p>
              </div>
              <div>
                <h2 className="mb-2 font-serif text-base text-ink">Exams</h2>
                <ul className="space-y-1">
                  <li>
                    <Link href="/exams/bocconi-online-test">Bocconi Online Test</Link>
                  </li>
                  <li>
                    <Link href="/exams/digital-sat">Digital SAT</Link>
                  </li>
                  <li>
                    <Link href="/exams/enhanced-act">Enhanced ACT</Link>
                  </li>
                  <li>
                    <Link href="/exams/lsat">LSAT</Link>
                  </li>
                  <li>
                    <Link href="/exams/gmat">GMAT</Link>
                  </li>
                  <li>
                    <Link href="/exams/gre">GRE</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-2 font-serif text-base text-ink">About</h2>
                <ul className="space-y-1">
                  <li>
                    <Link href="/about/editorial-standards">Editorial standards</Link>
                  </li>
                  <li>
                    <Link href="/about/how-scoring-works">How our scoring works</Link>
                  </li>
                  <li>
                    <Link href="/about/privacy">Privacy</Link>
                  </li>
                  <li>
                    <Link href="/about/terms">Terms</Link>
                  </li>
                </ul>
              </div>
            </div>

            <p className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-ink-subtle">
              {INDEPENDENCE_NOTICE}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
