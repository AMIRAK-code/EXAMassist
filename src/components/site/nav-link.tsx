'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** True when `pathname` is `href` itself or a page beneath one of `match`. */
export function isActivePath(pathname: string, href: string, match: readonly string[] = []): boolean {
  if (pathname === href) return true;
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
  className,
  children,
}: {
  href: string;
  match?: readonly string[];
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? '/';
  const active = isActivePath(pathname, href, match);
  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className={className}>
      {children}
    </Link>
  );
}
