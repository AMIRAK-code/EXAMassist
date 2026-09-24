import localFont from 'next/font/local';

/**
 * Instrument Serif Italic (SIL OFL 1.1, see OFL-instrument-serif.txt), used for
 * a few words of emphasis in marketing headlines and nowhere else.
 *
 * Kept in its own module so only the pages that import it declare it: a page
 * of exam content never pays for a display italic it does not use.
 *
 * No metric-adjusted `local()` fallback face and no preload, for the reasons
 * given in sans.ts: Chrome rebuilds such a face for every size it is used at,
 * and a preloaded font competes with the stylesheet on a slow link.
 */
export const accent = localFont({
  src: [{ path: './instrument-serif-latin-400-italic.woff2', weight: '400', style: 'italic' }],
  variable: '--font-instrument',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'Cambria', 'serif'],
  adjustFontFallback: false,
});
