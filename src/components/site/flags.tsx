import type { Locale } from '@/i18n/locales';

/**
 * Flags drawn inline, so they need no image request and render the same on
 * every platform (Windows shows regional-indicator emoji as letters). Each is
 * decorative: the language name is always written next to it.
 *
 * English uses the United Kingdom flag, the usual convention for British
 * English in a European product.
 */
const FLAGS: Record<Locale, React.ReactNode> = {
  en: (
    // No clipPath: ids would collide when several flags share a page. The
    // svg viewport clips the strokes, and at icon size the counterchanged
    // diagonals read the same as thin centred ones.
    <>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </>
  ),
  it: (
    <>
      <rect width="20" height="30" fill="#009246" />
      <rect x="20" width="20" height="30" fill="#fff" />
      <rect x="40" width="20" height="30" fill="#CE2B37" />
    </>
  ),
  tr: (
    <>
      <rect width="60" height="30" fill="#E30A17" />
      <circle cx="21" cy="15" r="7.5" fill="#fff" />
      <circle cx="22.9" cy="15" r="6" fill="#E30A17" />
      <polygon
        points="25.85,15.00 28.43,14.15 28.44,11.43 30.05,13.62 32.63,12.80 31.05,15.00 32.63,17.20 30.05,16.38 28.44,18.57 28.43,15.85"
        fill="#fff"
      />
    </>
  ),
  es: (
    <>
      <rect width="60" height="30" fill="#AA151B" />
      <rect y="7.5" width="60" height="15" fill="#F1BF00" />
    </>
  ),
  pl: (
    <>
      <rect width="60" height="15" fill="#fff" />
      <rect y="15" width="60" height="15" fill="#DC143C" />
    </>
  ),
};

export function Flag({ locale, className = '' }: { locale: Locale; className?: string }) {
  return (
    <svg
      viewBox="0 0 60 30"
      aria-hidden="true"
      focusable="false"
      className={`inline-block h-3.5 w-7 shrink-0 rounded-[2px] ring-1 ring-ink/15 ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {FLAGS[locale]}
    </svg>
  );
}
