import fs from 'node:fs';
import path from 'node:path';
import { preload } from 'react-dom';
import { containsMath } from '@/lib/markdown';

/**
 * Early loading for the two KaTeX faces nearly every formula uses.
 *
 * KaTeX declares its fonts `font-display: block` and the browser only asks
 * for them once maths is being laid out, so on a phone they arrived after the
 * first paint and every formula reflowed the question around it: a layout
 * shift of about 0.1 on a maths question (docs/REDESIGN.md §16). Preloading
 * them, only on a page that shows maths, removed it at a cost of about 0.12 s
 * of first paint on the lab's slow link.
 *
 * The files are the ones the build emitted for the stylesheet's own
 * `url()`s, found by name, so the preload and the CSS always point at the
 * same file. If they cannot be found (another hosting layout), nothing is
 * preloaded and the fonts load as they did before.
 */

const FACES = ['KaTeX_Main-Regular', 'KaTeX_Math-Italic'];
let cached: string[] | null = null;

function builtFontUrls(): string[] {
  if (cached) return cached;
  try {
    const files = fs.readdirSync(path.join(process.cwd(), '.next', 'static', 'media'));
    const urls = FACES.map((face) => files.find((file) => new RegExp(`^${face}\\.[0-9a-f]{8}\\.woff2$`).test(file)))
      .filter((file): file is string => Boolean(file))
      .map((file) => `/_next/static/media/${file}`);
    if (urls.length === FACES.length) cached = urls;
    return urls;
  } catch {
    return [];
  }
}

/** Call while rendering a page, with the Markdown it shows; preloads only if any of it has maths. */
export function preloadKatexFonts(sources: ReadonlyArray<string | null | undefined>): void {
  if (!sources.some(containsMath)) return;
  for (const href of builtFontUrls()) preload(href, { as: 'font', type: 'font/woff2', crossOrigin: '' });
}
