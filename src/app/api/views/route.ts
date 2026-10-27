import { getDb } from '@/lib/db';
import { assertSameOrigin, toErrorResponse } from '@/lib/api/http';
import { countReportedView } from '@/lib/analytics/funnel';
import { getHub } from '@/lib/exams/registry';

/**
 * An exam page reporting its own view (src/components/analytics/view-beacon.tsx),
 * because the page is a static file the server does not render. Only the
 * daily total by coarse source is kept, as for every other view.
 */
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = (await request.json().catch(() => null)) as { subject?: unknown; referrer?: unknown } | null;
    const subject = typeof body?.subject === 'string' ? body.subject : '';
    if (getHub(subject)) {
      await countReportedView(getDb(), subject, {
        referrer: typeof body?.referrer === 'string' && body.referrer ? body.referrer.slice(0, 2048) : null,
        userAgent: request.headers.get('user-agent'),
        ownHost: request.headers.get('x-forwarded-host') ?? request.headers.get('host'),
      });
    }
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return toErrorResponse(error);
  }
}
