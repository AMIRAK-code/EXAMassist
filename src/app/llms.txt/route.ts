import { indexingEnabled } from '@/lib/site';
import { llmsTxt } from '@/lib/seo/llms';

/*
 * Rendered per request, like robots.txt and the sitemap: whether this
 * deployment may be indexed is a runtime setting, and a preview must not hand
 * out a map of itself.
 */
export const dynamic = 'force-dynamic';

export function GET(): Response {
  if (!indexingEnabled()) return new Response('Not found', { status: 404 });
  return new Response(llmsTxt(), {
    // Markdown content, but text/plain is what readers of llms.txt expect.
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
