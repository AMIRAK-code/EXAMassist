import { useTranslations } from 'next-intl';
import { Alert } from '@/components/ui';

/** Outcomes of the results and notebook forms, shown after their redirect: tone and message key, by notice code. */
const NOTICES: Record<string, { tone: 'positive' | 'caution' | 'info'; key: string }> = {
  'labels-saved': { tone: 'positive', key: 'labelsSaved' },
  'nothing-to-retry': { tone: 'caution', key: 'nothingToRetry' },
  'rate-limited': { tone: 'caution', key: 'rateLimited' },
  'insufficient-content': { tone: 'caution', key: 'insufficientContent' },
  'not-a-mistake': { tone: 'info', key: 'notAMistake' },
  'not-found': { tone: 'caution', key: 'notFound' },
};

export function LearningNotice({ code, className }: { code: string | string[] | undefined; className?: string }) {
  const t = useTranslations('results.notices');
  const key = Array.isArray(code) ? code[0] : code;
  const notice = key ? NOTICES[key] : undefined;
  if (!notice) return null;
  return (
    <Alert tone={notice.tone} role="status" className={className}>
      <p>{t(notice.key)}</p>
    </Alert>
  );
}
