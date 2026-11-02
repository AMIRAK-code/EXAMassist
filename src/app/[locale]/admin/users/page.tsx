import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/guards';
import { accountReport, type Split } from '@/lib/analytics/accounts';
import { Breadcrumbs, Card, Container, PageHeader, Stat } from '@/components/ui';

/**
 * Accounts, sign-ins and activity, from src/lib/analytics/accounts.ts. Totals
 * only: no row here says anything about a person. Admins only, never indexed.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Users',
  robots: { index: false, follow: false },
};

const split = (s: Split) => `${s.registered} with an account, ${s.guests} ${s.guests === 1 ? 'guest' : 'guests'}`;

export default async function UsersPage() {
  await requireAdmin('/admin/users');
  const report = await accountReport(getDb());

  const cards = [
    {
      label: 'Accounts',
      value: report.registered,
      note: `${report.verifiedEmails} with a confirmed email address · ${report.staff} staff`,
    },
    { label: 'Guests', value: report.guests, note: 'Tried a test without signing up.' },
    { label: 'Signed in now', value: report.signedInNow.registered + report.signedInNow.guests, note: split(report.signedInNow) },
    { label: 'Active, last 7 days', value: report.activeLast7Days.registered + report.activeLast7Days.guests, note: split(report.activeLast7Days) },
    { label: 'Active, last 30 days', value: report.activeLast30Days.registered + report.activeLast30Days.guests, note: split(report.activeLast30Days) },
  ];

  return (
    <Container>
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { href: '/admin', label: 'Administration' }, { label: 'Users' }]} />
      <PageHeader
        eyebrow="Internal"
        title="Users"
        lead="Accounts, sign-ins and activity. Totals only; nothing here identifies a person."
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card as="li" key={card.label}>
            <Stat labelAs="h3" label={card.label} value={card.value} />
            <p className="mt-1 text-sm text-ink-muted">{card.note}</p>
          </Card>
        ))}
      </ul>

      <h2 className="mt-10 font-heading text-xl font-semibold">Week by week</h2>
      <Card className="mt-3">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">New accounts, new guests and sign-ins per week, newest first</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-2 text-left font-semibold">Week of (Monday, UTC)</th>
              <th scope="col" className="py-2 text-right font-semibold">New accounts</th>
              <th scope="col" className="py-2 text-right font-semibold">New guests</th>
              <th scope="col" className="py-2 text-right font-semibold">Sign-ins</th>
            </tr>
          </thead>
          <tbody>
            {report.weeks.map((week) => (
              <tr key={week.weekStart} className="border-b border-line last:border-0">
                <th scope="row" className="py-2 text-left font-normal tabular-nums">{week.weekStart}</th>
                <td className="py-2 text-right tabular-nums">{week.registered}</td>
                <td className="py-2 text-right tabular-nums">{week.guests}</td>
                <td className="py-2 text-right tabular-nums">{week.signIns ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-8 max-w-3xl space-y-3 text-sm text-ink-muted">
        <p>
          A sign-in is an account holder signing in with a password, an email code or a password reset; signing up is
          counted under new accounts instead.{' '}
          {report.signInsCountedSince
            ? `Sign-ins are counted from ${report.signInsCountedSince}; a dash means a week before that.`
            : 'No sign-in has been counted yet: counting starts with the deploy that added this page.'}
        </p>
        <p>
          &ldquo;Signed in now&rdquo; and &ldquo;active&rdquo; come from open sessions, which are deleted when someone
          signs out or a session expires, so both can only undercount. A guest who later signs up keeps the date they
          first arrived. Deleted accounts are left out of the figures above.
        </p>
        <p>
          Individual accounts are in Supabase: project Examer, Table Editor, schema <code>examer</code>, table{' '}
          <code>users</code>.
        </p>
      </div>
    </Container>
  );
}
