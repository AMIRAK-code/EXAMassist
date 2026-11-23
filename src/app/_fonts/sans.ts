import localFont from 'next/font/local';

/**
 * Geist (SIL OFL 1.1, see OFL-geist.txt), the face for headings and interface
 * text. Only the weight axis is shipped (29 KB, Latin), well inside the 90 KB
 * font budget.
 *
 * On a slow first visit the page is laid out before this file arrives, so the
 * fallback decides how long that first layout takes (docs/REDESIGN.md §12):
 *
 * - No metric-adjusted fallback face. `adjustFontFallback` generates a
 *   `local("Arial")` face with size overrides, and Chrome builds a new typeface
 *   from the Arial file for each size and weight it is used at: the lab trace
 *   of an exam page showed the 1 MB file parsed 15 times before the first paint.
 * - Arial, not the system UI stack: Segoe UI ships one file per weight, so the
 *   system stack loads several font files before the first paint where the
 *   Arial stack loads three.
 *
 * - No preload. On the lab's slow mobile link a preloaded font competed with
 *   the stylesheet and made the first paint later (docs/REDESIGN.md §13). It is
 *   off explicitly so every build behaves the same: with `preload: true`, Linux
 *   builds would emit one and Windows builds would not, since
 *   NextFontManifestPlugin looks for '/next-font-loader/index.js?' in module
 *   requests and Windows requests use backslashes.
 */
export const sans = localFont({
  src: [{ path: './geist-latin-wght-normal.woff2', weight: '100 900', style: 'normal' }],
  variable: '--font-geist',
  display: 'swap',
  preload: false,
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: false,
});
