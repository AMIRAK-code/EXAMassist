import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { homepageSampleFor } from '@/lib/content/public-samples';
import { loadSampleView } from '@/lib/content/sample-view';

/**
 * The public sample question for one exam hub.
 *
 * Read-only and public: it serves only the fixed sample set, never an
 * arbitrary question id, and it touches no attempt or session. Because the
 * response holds no personal data it may be cached.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ hub: string }> }) {
  const { hub } = await params;
  const sample = homepageSampleFor(hub);
  const view = sample ? loadSampleView(getDb(), sample) : null;

  if (!view) {
    return NextResponse.json(
      { error: { code: 'sample-unavailable', message: 'No sample question is available for this exam right now.' } },
      { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } },
    );
  }

  return NextResponse.json(view, {
    headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' },
  });
}
