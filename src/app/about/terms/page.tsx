import Link from 'next/link';
import type { Metadata } from 'next';
import { INDEPENDENCE_NOTICE, SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { Alert, Breadcrumbs, Card, Container } from '@/components/ui';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';

const TITLE = 'Terms of use (draft)';
const DESCRIPTION =
  'Draft terms of use for this exam preparation site, prepared for legal review. Includes the open questions a lawyer still needs to settle.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/about/terms') },
  openGraph: {
    url: absoluteUrl('/about/terms'),
    title: `${TITLE} | ${SITE.shortName}`,
    description: DESCRIPTION,
  },
};

const LAST_REVIEWED = '2026-09-22';

export default function TermsPage() {
  const trail = [{ href: '/', label: 'Home' }, { label: 'Terms of use' }];

  return (
    <Container size="narrow">
      <JsonLd data={breadcrumbSchema(siteUrl(), trail)} />
      <Breadcrumbs trail={trail} />

      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">Terms of use</h1>

      <Alert tone="caution" title="This is a draft, not a finished legal document" className="mt-6">
        <p>
          It was written by the engineering team to describe what this application actually does, so
          that a qualified lawyer has something concrete to review. It has not been reviewed by one,
          it is not legal advice, and the open questions at the end are genuinely open.
        </p>
      </Alert>

      <p className="mt-4 text-sm text-ink-subtle">
        Drafted{' '}
        <time dateTime={LAST_REVIEWED}>
          {new Date(LAST_REVIEWED).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </time>
        .
      </p>

      <div className="prose-academic mt-8">
        <h2>What this service is</h2>
        <p>
          {SITE.name} is a free study tool. It provides original practice questions, worked
          explanations, and guides describing the published format and scoring rules of several
          university admission tests. It is a preparation aid and nothing more.
        </p>

        <h2>Independence and trademarks</h2>
        <p>{INDEPENDENCE_NOTICE}</p>
        <p>
          Exam names are used descriptively, to say which exam a guide or question set is about.
          Nothing here should be read as a claim of partnership, endorsement, licensing or
          accreditation.
        </p>

        <h2>What we do not promise</h2>
        <ul>
          <li>
            We do not promise any score, any score improvement, any admission outcome, or any
            probability of admission. We do not calculate such figures, because nothing we hold
            could support one.
          </li>
          <li>
            We do not promise that our practice reproduces a real exam. Each practice format carries
            a label saying how close it is, and what differs.
          </li>
          <li>
            We do not promise that exam information here is current. Test makers change their exams.
            Every factual claim carries the source and the date we checked it, and the official
            source always wins. Check it yourself before relying on it for a decision.
          </li>
          <li>
            We do not promise uninterrupted or error-free service, and this is not a secure
            environment for high-stakes assessment. Browser-based practice cannot be invigilated.
          </li>
        </ul>

        <h2>Your account and your conduct</h2>
        <ul>
          <li>You may use the service without an account, as a guest.</li>
          <li>
            If you create an account, keep your password to yourself. Tell us if you believe someone
            else has used it.
          </li>
          <li>
            Do not attempt to access another person&rsquo;s account or data, disrupt the service, or
            extract the question bank in bulk.
          </li>
          <li>
            You may delete your account at any time from{' '}
            <Link href="/account">your account settings</Link>, which removes your practice history.
          </li>
        </ul>

        <h2>Our content</h2>
        <p>
          The questions, explanations and guides on this site are our own original work. You may use
          them for your own study. You may not republish, resell or redistribute them, or use them to
          train a machine learning model, without permission.
        </p>

        <h2>Reporting a problem</h2>
        <p>
          If a question looks wrong, <Link href="/report-question">report it</Link>. We would rather
          withdraw an item than leave a bad one in the bank.
        </p>

        <h2>Changes</h2>
        <p>
          If these terms change materially, the date above changes with them, and we will not
          backdate it.
        </p>
      </div>

      <Card className="mt-10 border-s-4 border-s-caution">
        <h2 className="font-heading text-xl font-semibold">Open questions for legal review</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Deliberately unresolved. Each needs a decision before this draft becomes a real document.
        </p>
        <ol className="mt-4 list-decimal space-y-2 ps-5 text-sm">
          <li>
            <strong>Contracting entity and governing law.</strong> No company, jurisdiction, venue or
            governing law is named, because none has been chosen.
          </li>
          <li>
            <strong>Limitation of liability and warranty disclaimers.</strong> This draft contains
            none. The permitted scope depends on the jurisdiction, and in the EU on consumer
            protection rules that cannot be contracted away.
          </li>
          <li>
            <strong>Minors as contracting parties.</strong> A large part of the audience is under 18.
            Whether a minor can accept these terms, and whether parental consent is required, differs
            by jurisdiction and needs advice.
          </li>
          <li>
            <strong>Trademark wording.</strong> The nominative-fair-use notice above should be
            checked against each test maker&rsquo;s published trademark guidelines, particularly
            College Board&rsquo;s and ACT&rsquo;s.
          </li>
          <li>
            <strong>Describing exams accurately.</strong> We summarise published exam rules and link
            the source. Confirm that this stays within fair use and does not infringe database or
            copyright interests in the originals.
          </li>
          <li>
            <strong>Prohibiting model training on our content.</strong> Whether that restriction is
            enforceable, and how it should interact with the crawler policy in{' '}
            <code>robots.txt</code>, needs advice.
          </li>
          <li>
            <strong>Accessibility obligations.</strong> We target WCAG 2.2 AA. Whether a binding
            legal obligation applies in the markets served, and what conformance statement to publish,
            is undecided.
          </li>
        </ol>
      </Card>

      <p className="mt-8 text-sm">
        <Link href="/about/privacy">Privacy notice (also a draft)</Link>
      </p>
    </Container>
  );
}
