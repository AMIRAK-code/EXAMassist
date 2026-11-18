import fs from 'node:fs';
import path from 'node:path';

/**
 * The saved files are what search engines get, so a Vercel deployment built
 * without NEXT_PUBLIC_SITE_URL=https://uniexamer.com or SEARCH_INDEXING_ENABLED=true
 * would publish noindex pages or canonicals naming the wrong address. Stops
 * the release before anything is uploaded if any saved file shows that.
 */
export function assertSearchReady(assetsDir: string, site = 'https://uniexamer.com'): void {
  const read = (file: string) => fs.readFileSync(path.join(assetsDir, ...file.split('/')), 'utf8');
  const problems: string[] = [];
  const pages = ['index.html', 'exams.html', 'courses/imat.html', 'it/courses/imat.html', 'courses/imat/biological-molecules.html', 'it/courses/imat/biological-molecules.html'];
  for (const page of pages) {
    if (!fs.existsSync(path.join(assetsDir, ...page.split('/')))) {
      problems.push(`${page} was not saved`);
      continue;
    }
    const html = read(page);
    if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) problems.push(`${page} is noindex (SEARCH_INDEXING_ENABLED is not true on Vercel)`);
    const canonical = /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i.exec(html)?.[1] ?? '';
    if (!canonical.startsWith(site)) problems.push(`${page} names ${canonical || 'no'} canonical (NEXT_PUBLIC_SITE_URL must be ${site} on Vercel)`);
    if (/\.vercel\.app/.test(html)) problems.push(`${page} mentions a vercel.app address`);
  }
  const robots = read('robots.txt');
  if (/^Disallow:\s*\/\s*$/m.test(robots.split(/User-agent:/i)[1] ?? '')) problems.push('robots.txt disallows the whole site');
  if (!robots.includes(`${site}/sitemap.xml`)) problems.push('robots.txt does not name the uniexamer.com sitemap');
  const sitemap = read('sitemap.xml');
  if (!sitemap.includes(`<loc>${site}/courses/imat</loc>`)) problems.push('sitemap.xml does not list the IMAT course');
  if (problems.length > 0) throw new Error(`Not released, the saved pages would hurt search:\n- ${problems.join('\n- ')}`);
  console.log('Search check: canonicals, robots meta, robots.txt and sitemap.xml are as on uniexamer.com.');
}
