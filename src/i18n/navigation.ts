import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware replacements for next/link and next/navigation. Use these for
 * every internal link and redirect, so the visitor stays in their language.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
