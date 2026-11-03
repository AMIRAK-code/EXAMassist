import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/guards';
import { accountReport, type Split } from '@/lib/analytics/accounts';
import { listUsers } from '@/lib/admin/users';
import { Badge, Breadcrumbs, Button, ButtonLink, Card, Container, PageHeader, Stat, fieldClass } from '@/components/ui';

/**
 * Accounts, sign-ins and activity (src/lib/analytics/accounts.ts), then the
 * people behind them (src/lib/admin/users.ts): search by email, open an
 * account to see what it has and change its access or role. Admins only,
 * never indexed.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Users',
  robots: { index: false, follow: false },
};

const split = (s: Split) => `${s.registered} with an account, ${s.guests} ${s.guests === 1 ? 'guest' : 'guests'}`;
const day = (iso: string | null) => (iso ? iso.slice(0, 10) : '—');

type Search = { q?: string; page?: string; guests?: string };

function pageHref(search: Search, page: number): string {
  const params = new URLSearchParams();
  if (search.q) params.set('q', search.q);
  if (search.guests === '1') params.set('guests', '1');
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return `/admin/users${query ? `?${query}` : ''}#people`;
}

export default async function UsersPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin('/admin/users');
  const search = await searchParams;
  const db = getDb();
  const report = await accountReport(db);
  const page = Math.max(1, Number.parseInt(search.page ?? '1', 10) || 1);
  const people = await listUsers(db, { query: search.q, page, includeGuests: search.guests === '1' });

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
        lead="Accounts, sign-ins and activity, then the people themselves: find an account to see what it has, give or take back access, or change its role."
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card as="li" key={card.label}>
            <Stat labelAs="h3" label={card.label} value={card.value} />
            <p className="mt-1 text-sm text-ink-muted">{card.note}</p>
          </Card>
        ))}
      </ul>

      <h2 id="people" className="mt-10 font-heading text-xl font-semibold">People</h2>
      <form method="get" action="/admin/users#people" className="mt-3 flex flex-wrap items-end gap-3">
        <div className="min-w-0 flex-1 sm:max-w-md">
          <label htmlFor="people-q" className="mb-1.5 block text-sm font-medium">Email address, or part of it</label>
          <input id="people-q" name="q" type="search" defaultValue={search.q ?? ''} className={fieldClass('w-full')} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="guests" value="1" defaultChecked={search.guests === '1'} />
          Include guests
        </label>
        <Button type="submit" variant="secondary">Search</Button>
        {search.q || search.guests === '1' ? <ButtonLink href="/admin/users#people" variant="quiet">Clear</ButtonLink> : null}
      </form>

      <Card className="mt-4 overflow-x-auto">
        {people.users.length === 0 ? (
          <p className="text-sm text-ink-muted">{search.q ? `No account matches “${search.q}”.` : 'No accounts yet.'}</p>
        ) : (
          <table className="w-full min-w-[44rem] border-collapse text-sm">
            <caption className="sr-only">Accounts, newest first</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pe-3 text-left font-semibold">Account</th>
                <th scope="col" className="py-2 pe-3 text-left font-semibold">Joined</th>
                <th scope="col" className="py-2 pe-3 text-left font-semibold">Last seen</th>
                <th scope="col" className="py-2 pe-3 text-left font-semibold">Email</th>
                <th scope="col" className="py-2 text-left font-semibold">Access now</th>
              </tr>
            </thead>
            <tbody>
              {people.users.map((person) => (
                <tr key={person.id} className="border-b border-line align-top last:border-0">
                  <th scope="row" className="py-2 pe-3 text-left font-normal">
                    <Link href={`/admin/users/${encodeURIComponent(person.id)}`} className="font-medium break-all">
                      {person.email ?? (person.isGuest ? 'Guest' : '(no email)')}
                    </Link>
                    {person.displayName ? <span className="block text-ink-muted">{person.displayName}</span> : null}
                    {person.role !== 'learner' ? <Badge tone="accent" className="mt-1">{person.role}</Badge> : null}
                  </th>
                  <td className="py-2 pe-3 tabular-nums">{day(person.createdAt)}</td>
                  <td className="py-2 pe-3 tabular-nums">{day(person.lastSeenAt)}</td>
                  <td className="py-2 pe-3">
                    {person.isGuest ? '—' : person.emailVerifiedAt ? 'Confirmed' : 'Not confirmed'}
                    {person.google ? <span className="block text-ink-muted">Google linked</span> : null}
                  </td>
                  <td className="py-2">
                    {person.role !== 'learner' ? (
                      'Every exam (staff)'
                    ) : person.access.length > 0 ? (
                      person.access.join(', ')
                    ) : (
                      <span className="text-ink-muted">Free</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {people.page > 1 || people.hasMore ? (
        <nav aria-label="Pages of accounts" className="mt-3 flex gap-3 text-sm">
          {people.page > 1 ? <Link href={pageHref(search, people.page - 1)}>← Newer</Link> : null}
          <span className="text-ink-muted">Page {people.page}</span>
          {people.hasMore ? <Link href={pageHref(search, people.page + 1)}>Older →</Link> : null}
        </nav>
      ) : null}

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
          &ldquo;Signed in now&rdquo;, &ldquo;active&rdquo; and &ldquo;last seen&rdquo; come from open sessions, which
          are deleted when someone signs out or a session expires, so all three can only undercount. A guest who later
          signs up keeps the date they first arrived. Deleted accounts are left out.
        </p>
      </div>
    </Container>
  );
}
