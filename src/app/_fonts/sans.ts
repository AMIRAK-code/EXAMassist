import localFont from 'next/font/local';

/**
 * Bricolage Grotesque (SIL OFL 1.1, see OFL-bricolage-grotesque.txt), the face
 * for headings and interface text.
 *
 * Only the weight axis is shipped (41 KB, Latin): the optical-size and width
 * axes would each roughly double the file and break the 90 KB font budget, so
 * display sizes get their character from weight and tracking instead.
 *
 * On a slow first visit the page is laid out before this file arrives, so the
 * fallback decides how long that first layout takes (docs/REDESIGN.md §12):
 *
 * - No metric-adjusted fallback face. `adjustFontFallback` generates a
 *   `local("Arial")` face with size overrides, and Chrome builds a new typeface
 *   from the Arial file for each size and weight it is used at: the lab trace
 *   of an exam page shows the 1 MB file parsed 15 times before the first paint.
 * - Arial, not the system UI stack: Segoe UI ships one file per weight and the
 *   design uses 300 to 800, so on the same page the system stack loaded seven
 *   font files before the first paint, where the Arial stack loads three.
 *
 * - No preload. On the lab's slow mobile link a preload made the first paint
 *   0.19 to 0.53 s later, because the 41 KB font competed with the stylesheet
 *   (docs/REDESIGN.md §13). It is off explicitly so every build behaves the
 *   same: with `preload: true`, Linux builds would emit one and Windows builds
 *   would not, since NextFontManifestPlugin looks for
 *   '/next-font-loader/index.js?' in module requests and Windows requests use
 *   backslashes.
 */
export const sans = localFont({
  src: [{ path: './bricolage-grotesque-latin-wght-normal.woff2', weight: '200 800', style: 'normal' }],
  variable: '--font-bricolage',
  display: 'swap',
  preload: false,
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: false,
});
