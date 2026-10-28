'use client';

import { useLocale, useTranslations } from 'next-intl';

/**
 * The learner-facing text for a refusal from POST /api/attempts. The API
 * speaks English; its error `code` is what is translated here. A code with
 * no translation shows the server's own sentence in English, and the
 * generic line in every other language.
 */
export function useStartError() {
  const t = useTranslations('practice.errors');
  const locale = useLocale();
  return (error: { code?: unknown; message?: unknown } | null | undefined, fallback: 'formFallback' | 'buttonFallback') => {
    const code = typeof error?.code === 'string' ? error.code : null;
    if (code && t.has(`codes.${code}`)) return t(`codes.${code}`);
    if (locale === 'en' && typeof error?.message === 'string' && error.message) return error.message;
    return t(fallback);
  };
}
