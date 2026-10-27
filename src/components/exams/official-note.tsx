import { useLocale, useTranslations } from 'next-intl';
import { DEFAULT_LOCALE } from '@/i18n/locales';

/**
 * One quiet line on exam pages in a translated interface: the exam's own
 * details (section names, notes, official wording) come from the exam
 * configurations and stay as the test maker publishes them, in English.
 * English pages need no such line.
 */
export function OfficialNote({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations('exams');
  if (locale === DEFAULT_LOCALE) return null;
  return <p className={className ?? 'mb-6 text-sm text-ink-subtle'}>{t('officialNote')}</p>;
}
