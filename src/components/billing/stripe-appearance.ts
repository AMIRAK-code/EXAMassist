import type { Appearance, CustomFontSource } from '@stripe/stripe-js';

/**
 * Stripe's Payment Element, dressed as this site's own form fields.
 *
 * Card details are typed into Stripe's iframes (so they never touch this
 * server, which keeps the site out of most PCI scope), but an iframe cannot
 * see our stylesheet. The Appearance API is how the fields inside it get our
 * look: every value below is read from the design tokens in
 * src/app/globals.css at run time, with the same values as fallbacks, and the
 * rules mirror `fieldClass()` and the form labels in src/components/ui.tsx:
 * a 48 px field, 1.5 px control border, the control radius, a 2 px accent
 * focus ring offset by 2 px, the negative colour for errors.
 *
 * The site has one (light) theme, so there is one appearance.
 */

/** Our tokens, as globals.css defines them. Used until (or if) the computed values cannot be read. */
export const TOKEN_DEFAULTS = {
  '--color-surface': '#fffdf8',
  '--color-surface-sunken': '#eeebe2',
  '--color-ink': '#151923',
  '--color-ink-muted': '#454a57',
  '--color-ink-subtle': '#5e6371',
  '--color-line': '#dad6cb',
  '--color-line-strong': '#8c897f',
  '--color-accent': '#3155e7',
  '--color-accent-soft': '#e7ecfd',
  '--color-negative': '#b42318',
  '--color-positive': '#1d7349',
  '--color-caution': '#7a4f00',
  '--radius-control': '0.625rem',
  '--radius-sm': '0.375rem',
} as const;

export type TokenName = keyof typeof TOKEN_DEFAULTS;

/** The interface face. Served from /fonts so Stripe's iframe can load it (see next.config.ts for CORS). */
export const FONT_FAMILY = 'Bricolage Grotesque';
export const FONT_PATH = '/fonts/bricolage-grotesque-latin-wght-normal.woff2';

export function elementFonts(origin: string): CustomFontSource[] {
  return [{ family: FONT_FAMILY, src: `url(${origin}${FONT_PATH})`, weight: '200 800', style: 'normal', display: 'swap' }];
}

/** rem to px at the browser default, because the iframe has its own root size. */
function px(value: string): string {
  const rem = /^([\d.]+)rem$/.exec(value.trim());
  return rem ? `${Math.round(Number(rem[1]) * 16)}px` : value.trim();
}

export function buildAppearance(read: (name: TokenName) => string = (name) => TOKEN_DEFAULTS[name]): Appearance {
  const t = (name: TokenName) => read(name)?.trim() || TOKEN_DEFAULTS[name];
  const ring = `2px solid ${t('--color-accent')}`;
  return {
    theme: 'stripe',
    labels: 'above',
    variables: {
      fontFamily: `'${FONT_FAMILY}', Arial, sans-serif`,
      fontSizeBase: '16px',
      fontSizeSm: '14px',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightBold: '600',
      fontLineHeight: '1.5',
      colorPrimary: t('--color-accent'),
      colorBackground: t('--color-surface'),
      colorText: t('--color-ink'),
      colorTextSecondary: t('--color-ink-muted'),
      colorTextPlaceholder: t('--color-ink-subtle'),
      colorIcon: t('--color-ink-muted'),
      colorDanger: t('--color-negative'),
      colorSuccess: t('--color-positive'),
      colorWarning: t('--color-caution'),
      borderRadius: px(t('--radius-control')),
      spacingUnit: '4px',
      gridRowSpacing: '20px',
      gridColumnSpacing: '16px',
      focusBoxShadow: 'none',
      focusOutline: ring,
    },
    rules: {
      '.Label': {
        fontSize: '14px',
        fontWeight: '500',
        color: t('--color-ink'),
        marginBottom: '6px',
      },
      '.Input': {
        border: `1.5px solid ${t('--color-line-strong')}`,
        backgroundColor: t('--color-surface'),
        boxShadow: 'none',
        padding: '11px 12px',
        fontSize: '16px',
        color: t('--color-ink'),
      },
      '.Input:hover': { borderColor: t('--color-ink') },
      '.Input:focus': {
        borderColor: t('--color-line-strong'),
        boxShadow: 'none',
        outline: ring,
        outlineOffset: '2px',
      },
      '.Input--invalid': {
        borderColor: t('--color-negative'),
        boxShadow: 'none',
        color: t('--color-ink'),
      },
      '.Input::placeholder': { color: t('--color-ink-subtle') },
      '.Error': { color: t('--color-negative'), fontSize: '14px', marginTop: '6px' },
      '.Tab': {
        border: `1.5px solid ${t('--color-line-strong')}`,
        backgroundColor: t('--color-surface'),
        boxShadow: 'none',
      },
      '.Tab:hover': { borderColor: t('--color-ink') },
      '.Tab--selected, .Tab--selected:hover': {
        borderColor: t('--color-accent'),
        backgroundColor: t('--color-accent-soft'),
        color: t('--color-ink'),
      },
      '.Tab:focus': { boxShadow: 'none', outline: ring, outlineOffset: '2px' },
      '.Block': {
        backgroundColor: t('--color-surface'),
        border: `1px solid ${t('--color-line')}`,
        boxShadow: 'none',
      },
      '.CheckboxInput': { border: `1.5px solid ${t('--color-line-strong')}`, borderRadius: px(t('--radius-sm')) },
      '.CheckboxInput--checked': { backgroundColor: t('--color-accent'), borderColor: t('--color-accent') },
      '.CheckboxInput:focus': { boxShadow: 'none', outline: ring, outlineOffset: '2px' },
    },
  };
}

/** The appearance from the tokens as the browser has computed them for this page. */
export function appearanceFromDocument(doc: Document = document): Appearance {
  const style = getComputedStyle(doc.documentElement);
  return buildAppearance((name) => style.getPropertyValue(name));
}
