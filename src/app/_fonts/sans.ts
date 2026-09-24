import localFont from 'next/font/local';

/**
 * Bricolage Grotesque (SIL OFL 1.1, see OFL-bricolage-grotesque.txt), the face
 * for headings and interface text.
 *
 * Only the weight axis is shipped (41 KB, Latin): the optical-size and width
 * axes would each roughly double the file and break the 90 KB font budget, so
 * display sizes get their character from weight and tracking instead.
 */
export const sans = localFont({
  src: [{ path: './bricolage-grotesque-latin-wght-normal.woff2', weight: '200 800', style: 'normal' }],
  variable: '--font-bricolage',
  display: 'swap',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});
