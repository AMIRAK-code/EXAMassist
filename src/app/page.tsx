import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { listHubs, requireExamConfig } from '@/lib/exams/registry';
import { examCoverage } from '@/lib/attempts/availability';
import { listGuides } from '@/lib/content/guides';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { ButtonLink, Card, Container } from '@/components/ui';
import { JsonLd, organizationSchema, webSiteSchema } from '@/components/seo/json-ld';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    url: absoluteUrl('/'),
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

const AUDIENCE_LABEL: Record<string, string> = {
  undergraduate: 'Undergraduate',
  law: 'Law',
  graduate: 'Graduate',
};

const STEPS = [
  {
    title: 'Read the real format',
    body: 'Every guide records sections, timing, navigation and scoring with a link to the official page each fact came from, and the date we checked it.',
  },
  {
    title: 'Find your starting point',
    body: 'A short diagnostic across the exam’s own skill taxonomy, so you know where you actually stand rather than where you assume you do.',
  },
  {
    title: 'Drill what is weak',
    body: 'Choose a topic, a difficulty and a length. Every question comes with a worked solution and an explanation of each wrong choice.',
  },
  {
    title: 'Check your readiness',
    body: 'Set the score you are aiming for and see how your accuracy, pace and topic coverage measure against it — with the limits stated.',
  },
];

const REFUSALS = [
  {
    heading: 'We do not invent a scaled score.',
    body: 'No test maker publishes its raw-to-scale conversion, and the digital SAT is not scored by counting correct answers at all. We report what we can actually measure.',
  },
  {
    heading: 'We do not report percentiles.',
    body: 'That would need a calibrated reference population we do not have.',
  },
  {
    heading: 'We do not copy official questions.',
    body: 'Everything here is written by our editorial team and independently solved by a second reviewer before it is published.',
  },
  {
    heading: 'We do not dress a competitive score as a requirement.',
    body: 'Where a university publishes an actual minimum, we label it one. Where a number is an observed average, we say so instead.',
  },
];

export default async function HomePage() {
  const db = getDb();
  const hubs = listHubs().map((hub) => {
    const configs = hub.configKeys.map(requireExamConfig);
    const coverage = configs.map((config) => examCoverage(db, config));
    return {
      hub,
      configs,
      items: coverage.reduce((total, c) => total + c.publishedItems, 0),
    };
  });

  const totalQuestions = hubs.reduce((total, entry) => total + entry.items, 0);
  const guides = listGuides().slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(siteUrl(), SITE.name, SITE.description),
          webSiteSchema(siteUrl(), SITE.name),
        ]}
      />

      {/* --- Hero --------------------------------------------------------- */}
      <section className="border-b border-line bg-surface">
        <Container className="py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-ink-subtle">
              Six admission tests · Verified against the test makers
            </p>
            <h1 className="text-4xl leading-[1.1] sm:text-5xl">
              Practice that tells you the truth about the exam
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              Original questions, worked explanations and format guides for the Bocconi Online Test,
              the Digital SAT, the Enhanced ACT, the LSAT, the GMAT and the GRE. Every claim about how
              an exam works is checked against the test maker&rsquo;s own published pages — and where
              something is not published, we say so instead of guessing.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/exams" size="lg">
                Choose your exam
              </ButtonLink>
              <ButtonLink href="/about/editorial-standards" variant="secondary" size="lg">
                How we verify
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm text-ink-subtle">
              Free. No account needed to start practising.
            </p>
          </div>
        </Container>
      </section>

      {/* --- Exams -------------------------------------------------------- */}
      <Container className="py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl">Six exams, kept separate</h2>
          <p className="mt-3 leading-relaxed text-ink-muted">
            Undergraduate, law and graduate admissions use different tests with different
            requirements. We never blend them together.
          </p>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map(({ hub, configs, items }) => (
            <Card as="li" key={hub.slug} className="flex flex-col transition-shadow hover:shadow-raised">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg">
                  <Link href={`/exams/${hub.slug}`} className="no-underline hover:underline">
                    {hub.name}
                  </Link>
                </h3>
                <span className="shrink-0 text-2xs uppercase tracking-wide text-ink-subtle">
                  {hub.audiences.map((a) => AUDIENCE_LABEL[a]).join(' · ')}
                </span>
              </div>

              <p className="mt-1 text-xs uppercase tracking-wide text-ink-subtle">{hub.publisher}</p>
              <p className="mt-3.5 flex-1 text-sm leading-relaxed text-ink-muted">{hub.tagline}</p>

              <p className="mt-5 rule-soft pt-4 text-sm text-ink-muted">
                <span className="font-medium tabular-nums text-ink">{items}</span> reviewed{' '}
                {items === 1 ? 'question' : 'questions'}
                {configs.length > 1 ? (
                  <span className="text-ink-subtle"> · {configs.length} test versions</span>
                ) : null}
              </p>
            </Card>
          ))}
        </ul>
      </Container>

      {/* --- How it works ------------------------------------------------- */}
      <section className="border-y border-line bg-surface">
        <Container className="py-16">
          <h2 className="text-2xl sm:text-3xl">How it works</h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <p className="font-mono text-sm text-accent">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* --- Honesty ------------------------------------------------------ */}
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl sm:text-3xl">What we will not do</h2>
            <ul className="mt-6 space-y-5">
              {REFUSALS.map((item) => (
                <li key={item.heading} className="border-s-2 border-line ps-4">
                  <p className="font-medium">{item.heading}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl">Where we are today</h2>
            <p className="mt-6 leading-relaxed text-ink-muted">
              This is a starter library, and we would rather tell you its size than imply it is
              bigger. It holds{' '}
              <strong className="tabular-nums text-ink">{totalQuestions}</strong> reviewed questions
              across all six exams.
            </p>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Coverage and any limit on a given practice format is shown on the exam&rsquo;s own page,
              before you start. A full-length simulation appears only when two things are true: the
              exam&rsquo;s rules are verified, and there are enough reviewed questions to fill it
              without repeating one.
            </p>

            {guides.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-base">Recent guides</h3>
                <ul className="mt-3 space-y-2.5">
                  {guides.map((guide) => (
                    <li key={guide.slug}>
                      <Link href={`/guides/${guide.slug}`} className="text-sm no-underline hover:underline">
                        {guide.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </>
  );
}
