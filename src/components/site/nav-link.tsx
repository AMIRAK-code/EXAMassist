'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * True when `pathname` is `href` itself or a page beneath one of `match`,
 * unless it falls under `except` (a page with a navigation item of its own).
 */
export function isActivePath(
  pathname: string,
  href: string,
  match: readonly string[] = [],
  except: readonly string[] = [],
): boolean {
  if (pathname === href) return true;
  if (except.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) return false;
  return [href, ...match].some(
    (prefix) => pathname === prefix || (prefix !== '/' && pathname.startsWith(`${prefix}/`)),
  );
}

/**
 * A navigation link that marks itself current. Only this small island needs
 * the pathname; the header around it stays a server component.
 */
export function NavLink({
  href,
  match,
  except,
  className,
  children,
}: {
  href: string;
  match?: readonly string[];
  except?: readonly string[];
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? '/';
  const active = isActivePath(pathname, href, match, except);
  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className={className}>
      {children}
    </Link>
  );
}
