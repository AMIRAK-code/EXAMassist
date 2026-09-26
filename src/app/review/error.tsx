'use client';

import Link from 'next/link';
import { Alert, Button, Container, PageHeader } from '@/components/ui';

/**
 * Shown when the notebook cannot be built. It says so and offers a retry; it
 * never shows an empty notebook that would read as "no mistakes".
 */
export default function NotebookError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container>
      <PageHeader title="Mistake notebook" />
      <Alert tone="negative" title="Your notebook could not be loaded" role="alert" className="mb-6">
        <p>Something went wrong while reading your mistakes. Try again in a moment.</p>
      </Alert>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/dashboard">Back to your dashboard</Link>
      </div>
    </Container>
  );
}
