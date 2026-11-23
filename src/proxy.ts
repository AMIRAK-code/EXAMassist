import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { courseLangs, courseSlugOf } from './lib/courses/languages';

const site = createMiddleware(routing);
const englishCourse = createMiddleware({
  locales: ['en'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
  localeCookie: false,
});

export default function proxy(request: NextRequest) {
  // The canonical English URL must work even when the reader browses the catalogue in Italian.
  // Redirecting it to a missing translation would send it straight back here (next.config.ts).
  const slug = courseSlugOf(request.nextUrl.pathname);
  return slug && courseLangs(slug).length === 1 ? englishCourse(request) : site(request);
}

export const config = {
  // Pages only: never API routes, Next internals, or files with an extension
  // (fonts, icons, robots.txt, sitemap.xml).
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
