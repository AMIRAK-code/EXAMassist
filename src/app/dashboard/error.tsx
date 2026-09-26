'use client';

import Link from 'next/link';
import { Alert, Button, Container, PageHeader } from '@/components/ui';

/**
 * Shown when the dashboard cannot be built. Loading failed, so this page says
 * so plainly and offers a retry and a way to keep practising; it never shows a
 * partial or empty dashboard that would read as "no history".
 */
export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container>
      <PageHeader title="Your dashboard" />
      <Alert tone="negative" title="Your dashboard could not be loaded" role="alert" className="mb-6">
        <p>Something went wrong while reading your practice history. Try again in a moment.</p>
      </Alert>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/exams">Choose an exam to practise</Link>
      </div>
    </Container>
  );
}
