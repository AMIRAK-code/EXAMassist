import { Link } from '@/i18n/navigation';
import { PAGE_DATES } from '@/lib/content/page-dates';
import type { Metadata } from 'next';
import { INDEPENDENCE_NOTICE, SITE, absoluteUrl, shareImages, siteUrl } from '@/lib/site';
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
    images: shareImages('site', TITLE),
  },
};

const LAST_REVIEWED = PAGE_DATES.terms.updated;

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
          {SITE.name} is a study tool. It provides original practice questions, worked
          explanations, and guides describing the published format and scoring rules of several
          university admission tests. It is a preparation aid and nothing more.
        </p>
        <p>
          The guides, the sample questions and the format pages are open to everyone. A free account can
          also take the free diagnostic for every exam: the same fixed questions for every account, with
          full results. Practice sessions, timed sections, full simulations, the study plan and the AI
          tutor need a paid plan, described below.
        </p>

        <h2 id="sale">Plans and payments</h2>
        <ul>
          <li>
            <strong>All access</strong> opens every exam, every practice format, the study plan and the
            AI tutor. <strong>Single exam</strong> opens every practice format and the study plan for the
            one exam you choose; you can hold several. The plans and their prices are on the{' '}
            <Link href="/pricing">pricing page</Link>. Prices are in euros, include VAT and are charged
            monthly.
          </li>
          <li>
            Payment is taken by Stripe, our payment provider, at the start of each month. Card details
            are typed into fields provided by Stripe on our checkout page and go straight to Stripe; they
            never reach us.
          </li>
          <li>
            A subscription renews automatically every month until it is cancelled. You can cancel at any
            time from <Link href="/account#billing">your account</Link>; the plan then stays on until the
            end of the month already paid for, and nothing more is charged.
          </li>
          <li>
            A plan starts as soon as you pay. At checkout you expressly ask us to start it straight away
            and acknowledge that, once it has started, you lose the 14-day right of withdrawal. We keep a
            record of when you did.
          </li>
          <li>
            If a renewal payment fails, Stripe retries it for a limited period and your access continues
            until the end of the month that payment was for. If it still fails, the plan ends.
          </li>
          <li>
            If we change a price, the new price applies only from your next renewal, and we will tell
            you before it does.
          </li>
          <li>
            Deleting your account cancels your plans immediately, so nothing more is charged for an
            account that no longer exists.
          </li>
        </ul>

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
          <li>
            You may read the guides and try the sample question without an account. Practice sessions
            need one.
          </li>
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
            by jurisdiction and needs advice. This now includes buying a plan: nothing stops a minor
            from paying today.
          </li>
          <li>
            <strong>Consumer law for paid plans.</strong> Whether the checkout wording is enough to end the
            14-day right of withdrawal for a subscription that starts immediately (EU Consumer Rights
            Directive, Italian Consumer Code); what the pre-contract information and the confirmation
            email must contain; whether unused time should be refunded when an account is deleted or a
            plan is cancelled early; and how price changes must be notified.
          </li>
          <li>
            <strong>VAT.</strong> Prices include VAT, but VAT on digital services is due at the
            buyer&rsquo;s country rate. Whether to register for the EU One-Stop Shop and switch on
            Stripe Tax, and which rate the fixed prices assume, needs a decision with an accountant.
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
