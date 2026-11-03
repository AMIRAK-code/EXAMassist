import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/guards';
import { getUserDetail } from '@/lib/admin/users';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';
import { formatPrice } from '@/lib/billing/plans';
import { Alert, Badge, Breadcrumbs, Card, Container, PageHeader } from '@/components/ui';
import { GrantAccessForm, RevokeGrantForm, RoleForm } from './user-actions';

/**
 * One account, for administrators: what it is, what it has, and the changes
 * staff have made to it (src/lib/admin/users.ts). Payments are only shown
 * here; they are changed in the Stripe Dashboard. Admins only, never indexed.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'User',
  robots: { index: false, follow: false },
};

const when = (iso: string | null | undefined) => (iso ? `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC` : '—');
const day = (iso: string | null | undefined) => (iso ? iso.slice(0, 10) : '—');
const examName = (key: string | null) => (key ? (getExamConfig(key)?.name ?? key) : null);
const planName = (plan: string) => ({ plus: 'Plus', exam_pass: 'Single Exam Pass', premium: 'Premium', all_access: 'All access', single_exam: 'Single exam' })[plan] ?? plan;

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-line py-2 last:border-0 sm:grid-cols-[14rem_1fr]">
      <dt className="text-sm font-medium text-ink-muted">{label}</dt>
      <dd className="text-sm break-words">{children}</dd>
    </div>
  );
}

const ACTIONS: Record<string, string> = {
  'access.grant': 'Gave access',
  'access.revoke': 'Revoked access',
  'user.role': 'Changed role',
};

export default async function UserPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const admin = await requireAdmin(`/admin/users/${userId}`);
  const now = new Date();
  const user = await getUserDetail(getDb(), userId, now);
  if (!user) notFound();
  const self = user.id === admin.id;
  const exams = EXAM_CONFIGS.map((config) => ({ key: config.examKey, name: config.name }));
  const customerId = user.subscriptions[0]?.stripe_customer_id ?? user.passes[0]?.stripe_customer_id ?? null;

  return (
    <Container>
      <Breadcrumbs
        trail={[
          { href: '/', label: 'Home' },
          { href: '/admin', label: 'Administration' },
          { href: '/admin/users#people', label: 'Users' },
          { label: user.email ?? 'Guest' },
        ]}
      />
      <PageHeader eyebrow="Internal · User" title={user.email ?? 'Guest account'} lead={user.displayName ?? undefined} />
      <div className="-mt-4 mb-6 flex flex-wrap gap-2">
        <Badge tone={user.role === 'learner' ? 'neutral' : 'accent'}>{user.role}</Badge>
        {user.isGuest ? <Badge tone="caution">guest</Badge> : null}
        {!user.isGuest ? (
          <Badge tone={user.emailVerifiedAt ? 'positive' : 'caution'}>{user.emailVerifiedAt ? 'email confirmed' : 'email not confirmed'}</Badge>
        ) : null}
        {user.google ? <Badge tone="neutral">Google linked</Badge> : null}
        {user.isMinor ? <Badge tone="caution">under 16 (self-declared)</Badge> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-heading text-lg font-semibold">Account</h2>
          <dl className="mt-2">
            <Fact label="Account id"><code className="break-all">{user.id}</code></Fact>
            <Fact label="Joined">{when(user.createdAt)}</Fact>
            <Fact label="Email confirmed">{user.isGuest ? '—' : when(user.emailVerifiedAt)}</Fact>
            <Fact label="Signs in with">
              {[user.hasPassword ? 'password' : null, user.google ? `Google (${user.google.email})` : null, user.isGuest ? null : 'email codes']
                .filter(Boolean)
                .join(', ') || '—'}
            </Fact>
            {user.google ? <Fact label="Google last used">{when(user.google.last_used_at)}</Fact> : null}
            <Fact label="Language">{user.locale}</Fact>
            <Fact label="Open sessions">{user.liveSessions}</Fact>
            <Fact label="Last seen">{when(user.lastSeenAt)}</Fact>
          </dl>
        </Card>

        <Card>
          <h2 className="font-heading text-lg font-semibold">Practice</h2>
          <dl className="mt-2">
            <Fact label="Tests started">{user.attempts.total}</Fact>
            <Fact label="Tests finished">{user.attempts.submitted}</Fact>
            <Fact label="Last test started">{when(user.attempts.lastAt)}</Fact>
            <Fact label="Exams practised">{user.attempts.exams.join(', ') || '—'}</Fact>
            <Fact label="Target exams">
              {user.targets.length > 0
                ? user.targets.map((target) => `${target.examName}${target.targetDate ? ` (${target.targetDate})` : ''}`).join(', ')
                : '—'}
            </Fact>
          </dl>
        </Card>
      </div>

      <h2 className="mt-10 font-heading text-xl font-semibold">Access now</h2>
      <p className="mt-2 text-sm">
        {user.role !== 'learner'
          ? `Every exam, as ${user.role === 'admin' ? 'an administrator' : 'an editor'}.`
          : user.access.length > 0
            ? user.access.join(', ')
            : 'Free: the diagnostic only.'}
      </p>

      <h2 className="mt-10 font-heading text-xl font-semibold">Payments</h2>
      <Card className="mt-3 overflow-x-auto">
        {user.subscriptions.length === 0 && user.passes.length === 0 ? (
          <p className="text-sm text-ink-muted">Nothing bought.</p>
        ) : (
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <caption className="sr-only">Subscriptions and passes bought through Stripe</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pe-3 text-left font-semibold">Plan</th>
                <th scope="col" className="py-2 pe-3 text-left font-semibold">Status</th>
                <th scope="col" className="py-2 pe-3 text-left font-semibold">Paid</th>
                <th scope="col" className="py-2 text-left font-semibold">Ends or renews</th>
              </tr>
            </thead>
            <tbody>
              {user.subscriptions.map((sub) => (
                <tr key={sub.stripe_subscription_id} className="border-b border-line last:border-0">
                  <th scope="row" className="py-2 pe-3 text-left font-normal">
                    {planName(sub.plan)}{sub.exam_key ? `: ${examName(sub.exam_key)}` : ''}
                  </th>
                  <td className="py-2 pe-3">{sub.status}{Number(sub.cancel_at_period_end) === 1 ? ', cancels at period end' : ''}</td>
                  <td className="py-2 pe-3 text-ink-muted">subscription</td>
                  <td className="py-2 tabular-nums">{day(sub.current_period_end)}</td>
                </tr>
              ))}
              {user.passes.map((pass) => (
                <tr key={pass.stripe_invoice_id} className="border-b border-line last:border-0">
                  <th scope="row" className="py-2 pe-3 text-left font-normal">
                    {planName(pass.plan)}: {examName(pass.exam_key)}
                  </th>
                  <td className="py-2 pe-3">{pass.status}</td>
                  <td className="py-2 pe-3 tabular-nums">{pass.amount !== null ? formatPrice(pass.amount, 'en') : '—'}</td>
                  <td className="py-2 tabular-nums">{day(pass.access_ends_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <p className="mt-2 text-sm text-ink-muted">
        Refunds and cancellations are made in the Stripe Dashboard
        {customerId ? (
          <>
            {' '}(<a href={`https://dashboard.stripe.com/customers/${encodeURIComponent(customerId)}`} target="_blank" rel="noreferrer">this customer</a>)
          </>
        ) : null}
        ; this page then updates from Stripe&rsquo;s webhook.
      </p>

      <h2 className="mt-10 font-heading text-xl font-semibold">Access given by staff</h2>
      {user.grants === null ? (
        <Alert tone="caution" className="mt-3" title="Not available yet">
          <p>Run <code>db/postgres/019_access_grants.sql</code> in the Supabase SQL editor to give access by hand.</p>
        </Alert>
      ) : (
        <>
          {user.grants.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {user.grants.map((grant) => {
                const state = grant.revoked_at ? 'revoked' : new Date(grant.ends_at) <= now ? 'ended' : 'active';
                return (
                  <Card as="li" key={grant.id}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 text-sm">
                        <p className="font-semibold">
                          {grant.plan === 'plus' ? 'Plus: every exam' : `One exam: ${examName(grant.exam_key)}`}
                        </p>
                        <p className="mt-1 text-ink-muted">
                          {day(grant.starts_at)} to {day(grant.ends_at)} · {grant.reason}
                        </p>
                        {grant.revoked_at ? <p className="mt-1 text-ink-muted">Revoked {when(grant.revoked_at)}</p> : null}
                      </div>
                      <Badge tone={state === 'active' ? 'positive' : 'neutral'}>{state}</Badge>
                    </div>
                    {state === 'active' ? (
                      <div className="mt-3">
                        <RevokeGrantForm userId={user.id} grantId={grant.id} />
                      </div>
                    ) : null}
                  </Card>
                );
              })}
            </ul>
          ) : null}
          <Card className="mt-4">
            <h3 className="font-heading text-lg font-semibold">Give access</h3>
            <p className="mt-1 mb-4 text-sm text-ink-muted">
              Opens what the plan opens, from now, without a payment and without touching Stripe. It shows on their
              account page as given by UniExamer.
            </p>
            {user.isGuest ? (
              <p className="text-sm">A guest has no account to give access to. They sign up first.</p>
            ) : (
              <GrantAccessForm userId={user.id} exams={exams} />
            )}
          </Card>
        </>
      )}

      <h2 className="mt-10 font-heading text-xl font-semibold">Role</h2>
      <Card className="mt-3">
        {self ? (
          <p className="text-sm">This is your own account. Another administrator changes your role.</p>
        ) : user.isGuest ? (
          <p className="text-sm">A guest cannot have a role.</p>
        ) : (
          <RoleForm userId={user.id} current={user.role} />
        )}
      </Card>

      <h2 className="mt-10 font-heading text-xl font-semibold">History</h2>
      <Card className="mt-3">
        {user.audit.length === 0 ? (
          <p className="text-sm text-ink-muted">No changes by staff.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {user.audit.map((entry, index) => (
              <li key={`${entry.createdAt}-${index}`} className="border-b border-line pb-2 last:border-0">
                <span className="tabular-nums text-ink-muted">{when(entry.createdAt)}</span> · {ACTIONS[entry.action] ?? entry.action}
                {entry.action === 'user.role' ? ` from ${String(entry.payload.from)} to ${String(entry.payload.to)}` : null}
                {entry.action === 'access.grant'
                  ? `: ${entry.payload.plan === 'plus' ? 'Plus' : `one exam (${examName(String(entry.payload.examKey))})`} until ${day(String(entry.payload.endsAt))}`
                  : null}
                {entry.payload.reason ? ` · “${String(entry.payload.reason)}”` : null}
                {entry.actorEmail ? <span className="text-ink-muted"> · by {entry.actorEmail}</span> : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Container>
  );
}
