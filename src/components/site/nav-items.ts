/**
 * The site's navigation, in one place so the desktop bar and the mobile menu
 * can never disagree. Every destination is a real page.
 */

export interface NavItem {
  href: string;
  label: string;
  /** Other path prefixes under which this item counts as current. */
  match?: string[];
}

/** For visitors without a session. */
export const PUBLIC_NAV: NavItem[] = [
  { href: '/exams', label: 'Exams', match: ['/practice'] },
  { href: '/guides', label: 'Guides' },
  { href: '/about/how-scoring-works', label: 'How scoring works' },
];

/** For anyone with a session, guest or registered. */
export const LEARNER_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/exams', label: 'Exams', match: ['/practice'] },
  { href: '/review', label: 'Mistake notebook' },
  { href: '/study-plan', label: 'Study plan' },
  { href: '/readiness', label: 'Readiness' },
];

/** Reference pages a learner still needs, kept out of the main bar. */
export const LEARNER_SECONDARY: NavItem[] = [
  { href: '/guides', label: 'Guides' },
  { href: '/about/how-scoring-works', label: 'How scoring works' },
];

export type AccountState = 'visitor' | 'guest' | 'registered';

/**
 * Guest sessions last seven days from creation (src/lib/auth/session.ts) and
 * are not extended by use. Signing up converts the guest in place and keeps
 * its history; signing in to an existing account does not merge it.
 */
export const GUEST_NOTE =
  'You are practising as a guest. This browser keeps your practice for 7 days from when you started. Create an account to keep it.';

/** The same facts, for places that invite a visitor to start. */
export const GUEST_NOTE_SHORT =
  'Free to start, no account needed. As a guest, this browser keeps your practice for 7 days; create an account to keep it longer.';
