/**
 * The site's navigation, in one place so the desktop bar and the mobile menu
 * can never disagree. Every destination is a real page.
 */

export interface NavItem {
  href: string;
  /** Key under `common.nav` in the message catalogues. */
  labelKey: 'exams' | 'bocconi' | 'guides' | 'howScoringWorks' | 'dashboard' | 'mistakeNotebook' | 'studyPlan';
  /** Other path prefixes under which this item counts as current. */
  match?: string[];
  /** Path prefixes under `href` that have their own item, so this one is not current there. */
  except?: string[];
}

/** The Bocconi test page has its own place in the navigation. */
const BOCCONI = '/exams/bocconi-online-test';

/** For visitors without a session. */
export const PUBLIC_NAV: NavItem[] = [
  { href: '/exams', labelKey: 'exams', match: ['/practice'], except: [BOCCONI] },
  { href: BOCCONI, labelKey: 'bocconi' },
  { href: '/guides', labelKey: 'guides' },
  { href: '/about/how-scoring-works', labelKey: 'howScoringWorks' },
];

/** For anyone with a session, guest or registered. */
export const LEARNER_NAV: NavItem[] = [
  { href: '/dashboard', labelKey: 'dashboard' },
  { href: '/exams', labelKey: 'exams', match: ['/practice'], except: [BOCCONI] },
  { href: '/review', labelKey: 'mistakeNotebook' },
  // One planning destination, with Plan and Progress & readiness views.
  { href: '/study-plan', labelKey: 'studyPlan', match: ['/readiness'] },
];

/** Reference pages a learner still needs, kept out of the main bar. */
export const LEARNER_SECONDARY: NavItem[] = [
  { href: BOCCONI, labelKey: 'bocconi' },
  { href: '/guides', labelKey: 'guides' },
  { href: '/about/how-scoring-works', labelKey: 'howScoringWorks' },
];

export type AccountState = 'visitor' | 'guest' | 'registered';

/*
 * Guest-session notes live in messages/<locale>/common.json (common.guest):
 * guest sessions last seven days from creation (src/lib/auth/session.ts) and
 * are not extended by use. Signing up converts the guest in place and keeps
 * its history; signing in to an existing account does not merge it.
 */
