'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Alert, Button, Container, PageHeader } from '@/components/ui';

/**
 * Shown when the dashboard cannot be built. Loading failed, so this page says
 * so plainly and offers a retry and a way to keep practising; it never shows a
 * partial or empty dashboard that would read as "no history".
 */
export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('learning.dashboard');
  return (
    <Container>
      <PageHeader title={t('title')} />
      <Alert tone="negative" title={t('error.title')} role="alert" className="mb-6">
        <p>{t('error.body')}</p>
      </Alert>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => reset()}>{t('error.retry')}</Button>
        <Link href="/exams">{t('error.chooseExam')}</Link>
      </div>
    </Container>
  );
}
