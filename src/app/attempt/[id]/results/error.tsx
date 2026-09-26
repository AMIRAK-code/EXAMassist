'use client';

import Link from 'next/link';
import { Alert, Button, Container, PageHeader } from '@/components/ui';

/**
 * Shown when results or a question review cannot be built. Loading failed,
 * nothing else: the session and its answers are stored on the server, and
 * this page never shows a partial result that could be misread.
 */
export default function ResultsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container>
      <PageHeader title="Your results" />
      <Alert tone="negative" title="These results could not be loaded" role="alert" className="mb-6">
        <p>Something went wrong while reading this session. Try again in a moment.</p>
      </Alert>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/dashboard">Back to your dashboard</Link>
      </div>
    </Container>
  );
}
