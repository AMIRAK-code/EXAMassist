import { notFound, redirect } from 'next/navigation';
import { getCurrentUser, type AuthUser } from './session';

/**
 * Page-level authorization guards.
 *
 * Route handlers throw UnauthorizedError / ForbiddenError, which the API maps
 * to 401 / 403. Server components cannot set an arbitrary status code, so pages
 * use these instead, and each returns a real HTTP status rather than rendering
 * a denial page at 200:
 *
 *   not signed in  -> 307 redirect to sign-in, carrying a return path
 *   wrong role     -> 404
 *
 * The 404 for a wrong role is deliberate. An authenticated learner poking at
 * /admin learns nothing: the response is indistinguishable from a URL that does
 * not exist, so the area's existence is not confirmed. Authorization is what
 * protects the data; this just avoids advertising it.
 *
 * Note that redirect() and notFound() work by throwing, so these must be called
 * OUTSIDE a try/catch that swallows errors.
 */

function safeReturnPath(path: string): string {
  // Only ever return to a path on this site: never to an absolute URL, and
  // never to a protocol-relative "//evil.example" which a browser treats as
  // absolute.
  if (!path.startsWith('/') || path.startsWith('//')) return '/';
  return path;
}

/** Any signed-in learner, including a guest. */
export async function requireSignedIn(returnPath: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=${encodeURIComponent(safeReturnPath(returnPath))}`);
  return user;
}

/** A learner with a real account: guests are asked to sign up first. */
export async function requireAccount(returnPath: string): Promise<AuthUser> {
  const user = await requireSignedIn(returnPath);
  if (user.isGuest) redirect(`/sign-up?next=${encodeURIComponent(safeReturnPath(returnPath))}`);
  return user;
}

/** Editorial staff only. */
export async function requireEditorial(returnPath: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user || user.isGuest) {
    redirect(`/sign-in?next=${encodeURIComponent(safeReturnPath(returnPath))}`);
  }
  if (user.role !== 'admin' && user.role !== 'editor') notFound();
  return user;
}

/** Administrators only. */
export async function requireAdmin(returnPath: string): Promise<AuthUser> {
  const user = await requireEditorial(returnPath);
  if (user.role !== 'admin') notFound();
  return user;
}
