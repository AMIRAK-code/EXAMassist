import { getDb } from '@/lib/db';
import { assertSameOrigin, toErrorResponse } from '@/lib/api/http';
import { countReportedView } from '@/lib/analytics/funnel';
import { getHub } from '@/lib/exams/registry';
import { getGuide } from '@/lib/content/guides';
import type { ReportedEvent } from '@/lib/analytics/funnel';

/**
 * A static page reporting its own view (src/components/exams/view-beacon.tsx),
 * because the page is a static file the server does not render: an exam page
 * (kind "exam", the default), a guide ("guide"), or a click from a guide to
 * an exam page or practice ("guide_click"). Only the daily total by coarse
 * source is kept, as for every other view.
 */
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = (await request.json().catch(() => null)) as { subject?: unknown; referrer?: unknown; kind?: unknown } | null;
    const subject = typeof body?.subject === 'string' ? body.subject : '';
    const kind = body?.kind ?? 'exam';
    const event: ReportedEvent | null =
      kind === 'exam' && getHub(subject) ? 'landing_view'
        : kind === 'guide' && getGuide(subject) ? 'guide_view'
          : kind === 'guide_click' && getGuide(subject) ? 'guide_click'
            : null;
    if (event) {
      await countReportedView(getDb(), subject, {
        referrer: typeof body?.referrer === 'string' && body.referrer ? body.referrer.slice(0, 2048) : null,
        userAgent: request.headers.get('user-agent'),
        ownHost: request.headers.get('x-forwarded-host') ?? request.headers.get('host'),
      }, event);
    }
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return toErrorResponse(error);
  }
}
