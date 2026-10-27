import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next.js 16 calls this file proxy.ts (formerly middleware.ts).
export default createMiddleware(routing);

export const config = {
  // Pages only: never API routes, Next internals, or files with an extension
  // (fonts, icons, robots.txt, sitemap.xml).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
