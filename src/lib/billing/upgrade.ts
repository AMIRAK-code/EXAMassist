/**
 * Where a refused learner goes next. Server actions and the practice buttons
 * use this so a missing plan always ends on the pricing page for that exam,
 * never on an error.
 */
export function upgradeTarget(error: { code: string; detail?: unknown }): string | null {
  if (error.code !== 'upgrade-required' && error.code !== 'account-required') return null;
  const href = (error.detail as { upgradeHref?: unknown } | undefined)?.upgradeHref;
  // Only a path on this site: never an absolute or protocol-relative URL.
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//') ? href : '/pricing';
}
