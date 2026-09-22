import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, requireUser } from '@/lib/auth/session';
import { EXAM_CONFIGS, getExamConfig } from '@/lib/exams/registry';
import { Alert, Badge, Card, Container, DefinitionList, PageHeader } from '@/components/ui';
import {
  AccountSettingsForm,
  DeleteAccountForm,
  ExportDataLink,
  SignOutButton,
} from './account-actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your account',
  description: 'Your account details, study target, and the controls for exporting or deleting your data.',
  // Private page. Authorization is what protects it; this only keeps it out of
  // search results if a URL ever leaks.
  robots: { index: false, follow: false },
};

const ROLE_LABEL: Record<string, string> = {
  learner: 'Learner',
  editor: 'Editor',
  admin: 'Administrator',
};

/** Interface languages the application ships. The API holds the same allowlist. */
const LOCALE_LABEL: Record<string, string> = { en: 'English' };

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function AccountPage() {
  // requireUser() is the authorisation check. The lookup before it exists only
  // so a signed-out visitor gets the sign-in page rather than an error screen.
  if (!(await getCurrentUser())) redirect('/sign-in?next=%2Faccount');
  const user = await requireUser();

  const targetConfig = user.targetExamKey ? getExamConfig(user.targetExamKey) : undefined;
  const targetDate = formatDate(user.targetDate);

  const examOptions = EXAM_CONFIGS.map((config) => ({
    examKey: config.examKey,
    name: config.name,
  }));

  return (
    <Container size="narrow">
      <PageHeader
        eyebrow="Your account"
        title={user.displayName ? `Hello, ${user.displayName}` : 'Your account'}
        lead="What we hold, what you are working towards, and the controls to take your data with you or remove it."
      />

      {user.isGuest ? (
        <Alert tone="caution" title="You are practising as a guest" className="mb-8">
          <p>
            A guest session stores no email address and expires after seven days of not being used.{' '}
            <Link href="/sign-up">Create an account</Link> in this browser to keep the practice,
            bookmarks and review queue you have built up.
          </p>
        </Alert>
      ) : null}

      <section aria-labelledby="details-heading" className="mb-10">
        <h2 id="details-heading" className="mb-4 font-serif text-2xl font-semibold">
          Your details
        </h2>
        <Card>
          <DefinitionList
            items={[
              {
                term: 'Display name',
                value: user.displayName ?? <span className="text-ink-muted">Not set</span>,
              },
              {
                term: 'Email address',
                value: (user.email ? <span className="break-all">{user.email}</span> : null) ?? (
                  <span className="text-ink-muted">
                    None — guest accounts store no email address
                  </span>
                ),
              },
              {
                term: 'Account type',
                value: user.isGuest ? (
                  <Badge tone="caution">Guest account</Badge>
                ) : (
                  <Badge tone="positive">Registered account</Badge>
                ),
              },
              { term: 'Role', value: ROLE_LABEL[user.role] ?? user.role },
              { term: 'Interface language', value: LOCALE_LABEL[user.locale] ?? user.locale },
              {
                term: 'Target exam',
                value: targetConfig ? (
                  <Link href={`/practice/${targetConfig.examKey}`}>{targetConfig.name}</Link>
                ) : (
                  <span className="text-ink-muted">Not set</span>
                ),
              },
              {
                term: 'Test date',
                value: targetDate ?? <span className="text-ink-muted">Not set</span>,
              },
              ...(user.isMinor
                ? [
                    {
                      term: 'Age setting',
                      value:
                        'You told us you are under 16, so optional data collection stays switched off.',
                    },
                  ]
                : []),
            ]}
          />
          {user.locale === 'en' ? (
            <p className="mt-5 border-t border-line pt-4 text-sm text-ink-subtle">
              English is the only interface language we publish at the moment, so there is nothing to
              choose here yet.
            </p>
          ) : null}
        </Card>
      </section>

      <section aria-labelledby="settings-heading" className="mb-10">
        <h2 id="settings-heading" className="mb-4 font-serif text-2xl font-semibold">
          Name and study target
        </h2>
        <Card>
          <AccountSettingsForm
            examOptions={examOptions}
            initialDisplayName={user.displayName ?? ''}
            initialTargetExamKey={user.targetExamKey ?? ''}
            initialTargetDate={user.targetDate ?? ''}
          />
        </Card>
      </section>

      <section aria-labelledby="data-heading" className="mb-10">
        <h2 id="data-heading" className="mb-4 font-serif text-2xl font-semibold">
          Your data
        </h2>
        <Card>
          <h3 className="font-serif text-lg font-semibold">Download a copy</h3>
          <p className="mt-2 text-sm text-ink-muted">
            One JSON file with your account details, every practice session and answer, your results,
            bookmarks, review queue and study plan. Nothing else is included, and nobody else&rsquo;s
            data can appear in it.
          </p>
          <div className="mt-4">
            <ExportDataLink />
          </div>

          <h3 className="mt-8 font-serif text-lg font-semibold">Sign out</h3>
          <p className="mt-2 text-sm text-ink-muted">
            Ends this session on this device. Your data stays exactly as it is.
          </p>
          <div className="mt-4">
            <SignOutButton />
          </div>
        </Card>
      </section>

      <section aria-labelledby="delete-heading" className="mb-10">
        <h2 id="delete-heading" className="mb-4 font-serif text-2xl font-semibold">
          Delete your account
        </h2>
        <Card>
          <DeleteAccountForm email={user.email} isGuest={user.isGuest} />
        </Card>
      </section>

      <p className="text-sm text-ink-subtle">
        Our <Link href="/about/privacy">privacy notice</Link> explains what we store and why. If
        something here looks wrong, tell us before you delete anything — a deleted account cannot be
        brought back.
      </p>
    </Container>
  );
}
