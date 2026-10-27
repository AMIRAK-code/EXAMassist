'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Alert, Button, Container, PageHeader } from '@/components/ui';

/**
 * Shown when the notebook cannot be built. It says so and offers a retry; it
 * never shows an empty notebook that would read as "no mistakes".
 */
export default function NotebookError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('results.notebookError');
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
