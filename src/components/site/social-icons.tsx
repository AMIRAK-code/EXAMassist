import type { SocialKey } from '@/lib/site';

/**
 * Small marks for the footer's profile and email links, drawn in the text
 * colour. Decorative: every link also shows its name, so the icons are hidden
 * from assistive technology. The brand marks follow Simple Icons (CC0).
 */

const BRAND_PATHS: Record<Exclude<SocialKey, 'instagram'>, string> = {
  blog: 'M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z',
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  substack: 'M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z',
};

const ICON = 'size-4 shrink-0';

export function SocialIcon({ name }: { name: SocialKey }) {
  if (name === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={ICON} fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.25" />
        <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={ICON} fill="currentColor">
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={ICON} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6.5 9 6.5 9-6.5" />
    </svg>
  );
}
