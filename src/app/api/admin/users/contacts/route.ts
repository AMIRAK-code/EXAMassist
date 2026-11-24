import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, readJson, toErrorResponse } from '@/lib/api/http';
import { requireRole } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/auth/rate-limit';
import { contactsCsv, emailContacts } from '@/lib/account/email-consent';

/**
 * Account email addresses as a CSV for the mailing tool (Brevo), for
 * administrators only: every signed-up account, or only those who opted in to
 * news. Each row has the address, the interface language and the news
 * consent; nothing else. Each download is written to the audit log.
 */

export const dynamic = 'force-dynamic';

const bodySchema = z.object({ scope: z.enum(['all', 'news']) });

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const admin = await requireRole('admin');
    const db = getDb();
    const limit = await checkRateLimit(db, 'adminContactExport', `user:${admin.id}`);
    if (!limit.allowed) return fail('rate-limited', 'Too many downloads. Please try again later.', 429);
    const { scope } = await readJson(request, bodySchema);
    const contacts = await emailContacts(db, scope);
    const at = new Date().toISOString();
    await db
      .prepare('INSERT INTO audit_log (actor_user_id, action, entity_type, entity_id, payload_json, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .run(admin.id, 'users.contacts_exported', 'users', scope, JSON.stringify({ scope, count: contacts.length }), at);
    const fileName = `uniexamer-contacts-${scope}-${at.slice(0, 10)}.csv`;
    return new NextResponse(contactsCsv(contacts), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
        'X-Contact-Count': String(contacts.length),
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
