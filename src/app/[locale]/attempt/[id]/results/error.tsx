'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Alert, Button, Container, PageHeader } from '@/components/ui';

/**
 * Shown when results or a question review cannot be built. Loading failed,
 * nothing else: the session and its answers are stored on the server, and
 * this page never shows a partial result that could be misread.
 */
export default function ResultsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('results.error');
  return (
    <Container>
      <PageHeader title={t('title')} />
      <Alert tone="negative" title={t('alertTitle')} role="alert" className="mb-6">
        <p>{t('body')}</p>
      </Alert>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => reset()}>{t('retry')}</Button>
        <Link href="/dashboard">{t('back')}</Link>
      </div>
    </Container>
  );
}
