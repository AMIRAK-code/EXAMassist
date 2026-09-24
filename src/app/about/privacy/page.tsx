import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { Alert, Breadcrumbs, Card, Container, DefinitionList, PageHeader } from '@/components/ui';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';

/**
 * Privacy notice — DRAFT.
 *
 * This describes what the application genuinely does today, written so that a
 * lawyer can check it against the code rather than against a template. Every
 * point we cannot settle ourselves is listed at the bottom instead of being
 * papered over with boilerplate.
 */

const PATH = '/about/privacy';
const TITLE = 'Privacy notice (draft)';
const DESCRIPTION =
  'Draft privacy notice for Examer, prepared for legal review: one session cookie, optional email and password, practice history, no advertising, no third-party analytics, no payment, and export or deletion from your account page.';

/** Real dates: this draft was written on 2026-09-22 and has not been revised since. */
const PUBLISHED = '2026-09-22';
const UPDATED = '2026-09-22';
const PUBLISHED_LABEL = '22 September 2026';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: {
    type: 'article',
    url: absoluteUrl(PATH),
    title: `${TITLE} | ${SITE.shortName}`,
    description: DESCRIPTION,
    publishedTime: PUBLISHED,
    modifiedTime: UPDATED,
  },
};

const WHAT_WE_HOLD: Array<{ term: string; value: string }> = [
  {
    term: 'A session cookie',
    value:
      'One cookie, named examer_session. It carries a random token, is set HttpOnly and SameSite=Lax, is marked Secure in production, and lasts 30 days for an account or 7 days for a guest session. The server stores only a SHA-256 hash of the token, so the session table cannot be used to impersonate anyone.',
  },
  {
    term: 'A guest account, if you never sign up',
    value:
      'Practising without an account creates a real user row so your history persists and can be claimed later. It holds no email, no password and no name — nothing that identifies a person.',
  },
  {
    term: 'Your email address and password, if you create an account',
    value:
      'The email address is stored as you typed it, lowercased. The password is never stored: we keep a salted scrypt hash of it and compare against that.',
  },
  {
    term: 'Optional profile and study settings',
    value:
      'A display name, a target exam, a target date, a weekly study-minutes goal, and a self-declared flag for being under 16. We do not ask for a date of birth, a school, a country or a phone number.',
  },
  {
    term: 'Your practice history',
    value:
      'The attempts you start, the answers you give, which questions you flagged, how long each question took, and the computed result of each attempt.',
  },
  {
    term: 'Question reports you send us',
    value:
      'The question you reported, the reason you chose, whatever you typed in the details box, and your user id if you were signed in when you sent it.',
  },
  {
    term: 'Rate-limit counters',
    value:
      'To stop abuse we count requests per caller in fixed windows. The counter key is a SHA-256 hash of an identifier, so a raw IP address is never written to the database.',
  },
];

const WHAT_WE_DO_NOT: string[] = [
  'No advertising, and no advertising or tracking pixels of any kind.',
  'No third-party analytics. There is no Google Analytics, no product-analytics SDK, and no session recording.',
  'No payments. There is no checkout, no card handling and no payment processor, because nothing here is sold.',
  'No cookies other than the session cookie. Nothing is stored for advertising, measurement or personalisation.',
  'No selling, renting or sharing of personal data with third parties for their own purposes.',
  'No email marketing. We hold your address to let you sign in, not to send you campaigns.',
];

const OPEN_QUESTIONS: string[] = [
  'The controller: which legal entity operates this service, in which jurisdiction, and what the contact address for privacy requests should be. Nothing below can be finalised until this is settled.',
  'The lawful basis for each processing purpose under the GDPR — most plausibly contract for the account and the practice history, legitimate interests for rate limiting and abuse prevention — and whether that analysis survives review.',
  'Retention periods. Today nothing expires except sessions (30 days, or 7 for a guest) and rate-limit windows (purged after 24 hours). How long an inactive guest account, a practice history and a resolved question report should be kept needs a decision and then an implementation.',
  'Whether deletion should be a hard delete or the soft delete currently implemented. Today deletion marks the account deleted so it stops resolving and stops appearing anywhere; what happens to the underlying attempt rows, and after how long, is an open decision.',
  'Whether users under 16 need verifiable parental consent in each jurisdiction we serve, and whether a self-declared flag is defensible at all. The age flag exists in the code and is self-declared; we do not verify it and we do not currently ask for consent.',
  'Where the data is hosted, whether any international transfer occurs, and what the transfer mechanism and sub-processor list should say. The application itself uses one database and no third-party services.',
  'Whether the session cookie qualifies as strictly necessary in every jurisdiction served — our view is that it does, which is why no consent banner is shown — and confirmation that nothing else on the site would trigger consent requirements.',
  'The process and deadlines for handling access, rectification, portability, objection and erasure requests, and who is accountable for meeting them.',
  'Breach notification: the threshold, the internal process and the notification timetable.',
  'The wording of the trademark and non-affiliation notice, which appears on every page and is drafted by us rather than by a lawyer.',
];

export default function PrivacyPage() {
  const trail = [{ href: '/', label: 'Home' }, { label: 'Privacy notice' }];

  return (
    <Container size="narrow">
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), trail),
          articleSchema({
            siteUrl: siteUrl(),
            url: absoluteUrl(PATH),
            headline: TITLE,
            description: DESCRIPTION,
            datePublished: PUBLISHED,
            dateModified: UPDATED,
            publisherName: SITE.publisher,
            authorName: SITE.publisher,
          }),
        ]}
      />
      <Breadcrumbs trail={trail} />

      <Alert tone="caution" title="Draft — prepared for review, not yet reviewed by a lawyer">
        <p>
          This is a working draft written by the {SITE.name} team to describe what the application
          actually does. It has not been reviewed or approved by a lawyer, it is not legal advice,
          and it is not a contract. The open questions we cannot answer ourselves are listed in full
          at the <a href="#open-questions">end of the page</a> rather than filled in with boilerplate.
        </p>
      </Alert>

      <div className="mt-8">
        <PageHeader
          eyebrow="About Examer"
          title="Privacy notice"
          lead="What this application stores, why it stores it, and what it deliberately never collects."
        />
      </div>

      <div className="rounded-card border-s-4 border-accent bg-accent-soft p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-strong">In short</h2>
        <p className="mt-2 text-ink">
          You can use {SITE.name} without giving us anything: practising without an account creates a
          guest record that holds no personal data at all. If you do create an account we hold your
          email address, a salted hash of your password, any study settings you set, and your
          practice history. There is one cookie, and it only keeps you signed in. There is no
          advertising, no third-party analytics and no payment processing anywhere on this site, and
          you can export or delete your data from your <Link href="/account">account page</Link>.
        </p>
      </div>

      <p className="mt-4 text-sm text-ink-subtle">
        Drafted by {SITE.publisher} · <time dateTime={PUBLISHED}>{PUBLISHED_LABEL}</time>
      </p>

      <div className="mt-10 space-y-12">
        <section aria-labelledby="what-we-hold">
          <h2 id="what-we-hold" className="font-heading text-2xl font-semibold">
            1. What we hold
          </h2>
          <Card className="mt-4">
            <DefinitionList items={WHAT_WE_HOLD} />
          </Card>
        </section>

        <section aria-labelledby="what-we-dont">
          <h2 id="what-we-dont" className="font-heading text-2xl font-semibold">
            2. What we do not do
          </h2>
          <div className="prose-academic">
            <ul>
              {WHAT_WE_DO_NOT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="why">
          <h2 id="why" className="font-heading text-2xl font-semibold">
            3. Why we hold it
          </h2>
          <div className="prose-academic">
            <ul>
              <li>
                <strong>To keep you signed in.</strong> That is the entire job of the session cookie.
              </li>
              <li>
                <strong>To give you your practice history back.</strong> Results, topic breakdowns
                and the “don’t show me this question again for a month” behaviour all need the
                history to exist.
              </li>
              <li>
                <strong>To fix bad questions.</strong> A report tells our editors which question and
                which version to look at.
              </li>
              <li>
                <strong>To stop abuse.</strong> Sign-in attempts, sign-ups, guest creation, attempt
                starts, answer writes and question reports are all rate limited.
              </li>
            </ul>
            <p>
              We do not profile you, we do not build an advertising audience, and we do not use your
              practice history for anything except showing it to you and selecting questions you have
              not recently seen.
            </p>
          </div>
        </section>

        <section aria-labelledby="security">
          <h2 id="security" className="font-heading text-2xl font-semibold">
            4. How it is protected
          </h2>
          <div className="prose-academic">
            <ul>
              <li>
                Passwords are hashed with scrypt and a per-password salt. A leaked database does not
                hand over passwords.
              </li>
              <li>
                Session tokens are stored only as SHA-256 hashes, so a leaked database does not hand
                over live sessions either.
              </li>
              <li>
                Every private page and every private API route resolves who you are on the server and
                filters data by your own user id. An id in a URL is never trusted to identify you.
              </li>
              <li>
                State-changing requests are checked against the site’s own origin, in addition to the
                SameSite cookie setting.
              </li>
              <li>Rate-limit keys are hashed, so raw IP addresses are not stored.</li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="your-controls">
          <h2 id="your-controls" className="font-heading text-2xl font-semibold">
            5. What you can do
          </h2>
          <div className="prose-academic">
            <ul>
              <li>
                <strong>Export.</strong> Download everything associated with your account from your
                account page.
              </li>
              <li>
                <strong>Delete.</strong> Delete your account from the same place. See the open
                question below about what deletion should mean underneath.
              </li>
              <li>
                <strong>Sign out everywhere.</strong> Signing out destroys the session; a password
                change destroys every session for the account.
              </li>
              <li>
                <strong>Stay a guest.</strong> If you never sign up, there is nothing personal to
                export or delete in the first place — clearing the cookie ends the session.
              </li>
            </ul>
          </div>
          <p className="mt-2 text-sm">
            <Link href="/account">Go to your account page →</Link>
          </p>
        </section>

        <section aria-labelledby="open-questions">
          <h2 id="open-questions" className="font-heading text-2xl font-semibold">
            Open questions for legal review
          </h2>
          <div className="prose-academic">
            <p>
              These are the points this draft cannot settle on its own. They are listed rather than
              guessed at, because a confident-sounding answer here would be worse than an admitted
              gap.
            </p>
            <ol>
              {OPEN_QUESTIONS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </Container>
  );
}
