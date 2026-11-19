import localFont from 'next/font/local';

/**
 * The home page's blueprint faces, both SIL OFL 1.1: Barlow Condensed Bold for
 * display headings (OFL-barlow-condensed.txt, 22 KB) and Martian Mono for
 * drawing labels and the eyebrows (OFL-martian-mono.txt, 38 KB, width and
 * weight axes).
 *
 * Kept in their own module so only the home page declares them: every other
 * page uses Geist alone and never pays for these files. No preload and no
 * metric-adjusted fallback face, for the reasons given in sans.ts.
 */
export const barlow = localFont({
  src: [{ path: './barlow-condensed-latin-700-normal.woff2', weight: '700', style: 'normal' }],
  variable: '--font-barlow',
  display: 'swap',
  preload: false,
  fallback: ['Arial Narrow', 'Arial', 'sans-serif'],
  adjustFontFallback: false,
});

export const martian = localFont({
  src: [{ path: './martian-mono-latin-standard-normal.woff2', weight: '100 800', style: 'normal' }],
  variable: '--font-martian',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'Consolas', 'monospace'],
  adjustFontFallback: false,
});
