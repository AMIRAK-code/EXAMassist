import type { StripeElementLocale } from '@stripe/stripe-js';
import type { useTranslations } from 'next-intl';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/locales';

/**
 * The language Stripe's Payment Element speaks, so its own field labels,
 * placeholders and card errors (and the messages confirmPayment returns) match
 * the page. Every interface language is one Stripe supports.
 */
const STRIPE_LOCALES: Record<Locale, StripeElementLocale> = { en: 'en', it: 'it', tr: 'tr', es: 'es', pl: 'pl' };

export function stripeLocale(locale: string): StripeElementLocale {
  return STRIPE_LOCALES[isLocale(locale) ? locale : DEFAULT_LOCALE];
}

/** Country names in the page's language, sorted the way that language sorts them. */
export function countryOptions(codes: readonly string[], locale: string): Array<{ code: string; name: string }> {
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  const collator = new Intl.Collator(locale);
  return codes.map((code) => ({ code, name: names.of(code) ?? code })).sort((a, b) => collator.compare(a.name, b.name));
}

type BillingTranslator = ReturnType<typeof useTranslations<'billing'>>;

/** Error codes the billing API returns without a message key, and the catalogue message for each. */
const CODE_MESSAGES: Record<string, string> = {
  'rate-limited': 'rateLimited',
  'unknown-subscription': 'unknownSubscription',
  'billing-off': 'billingOff',
  'billing-misconfigured': 'misconfigured',
  'billing-unavailable': 'unavailable',
};

/**
 * What to tell the buyer about a refused billing request, in their language.
 * The API sends `error.detail.messageKey` (a key under `billing.errors`) with
 * each of our own messages; anything else gets the caller's general message,
 * never English text from the server.
 */
export function billingErrorMessage(
  t: BillingTranslator,
  error: { code?: unknown; detail?: unknown } | null | undefined,
  fallback: string,
): string {
  const detailKey = (error?.detail as { messageKey?: unknown } | undefined)?.messageKey;
  const key =
    typeof detailKey === 'string' ? detailKey : typeof error?.code === 'string' ? CODE_MESSAGES[error.code] : undefined;
  return key && t.has(`errors.${key}`) ? t(`errors.${key}`) : fallback;
}
