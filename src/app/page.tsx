import Link from 'next/link';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { EXAM_HUBS, listHubs, requireExamConfig } from '@/lib/exams/registry';
import { examCoverage } from '@/lib/attempts/availability';
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

export default async function HomePage() {
  const db = getDb();
  const hubs = listHubs().map((hub) => {
    const configs = hub.configKeys.map(requireExamConfig);
    const items = configs.reduce((total, config) => total + examCoverage(db, config).publishedItems, 0);
    return { hub, configs, items };
  });

  const totalQuestions = hubs.reduce((total, entry) => total + entry.items, 0);

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(siteUrl(), SITE.name, SITE.description),
          webSiteSchema(siteUrl(), SITE.name),
        ]}
      />

      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <Container className="py-14 sm:py-20">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              Practice that tells you the truth about the exam
            </h1>
            <p className="mt-5 text-lg text-ink-muted">
              Original practice questions, worked explanations and format guides for six admission
              tests. Every claim about how an exam works is checked against the test maker&rsquo;s own
              published pages, and we say plainly when something is not published at all.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/exams" size="lg">
                Choose your exam
              </ButtonLink>
              <ButtonLink href="/about/editorial-standards" variant="secondary" size="lg">
                How we verify
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-ink-subtle">
              Free. No account needed to start practising.
            </p>
          </div>
        </Container>
      </section>

      {/* Exams */}
      <Container>
        <h2 className="font-serif text-2xl font-semibold">Six exams, kept separate</h2>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Undergraduate, law and graduate admissions have different tests and different
          requirements. We never blend them together.
        </p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map(({ hub, configs, items }) => (
            <Card as="li" key={hub.slug} className="flex flex-col">
              <h3 className="font-serif text-lg font-semibold">
                <Link href={`/exams/${hub.slug}`} className="no-underline hover:underline">
                  {hub.name}
                </Link>
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink-subtle">
                {hub.publisher} ·{' '}
                {hub.audiences
                  .map((a) => (a === 'undergraduate' ? 'Undergraduate' : a === 'law' ? 'Law' : 'Graduate'))
                  .join(' & ')}
              </p>
              <p className="mt-3 flex-1 text-sm text-ink-muted">{hub.tagline}</p>
              <p className="mt-4 text-sm">
                <span className="font-medium tabular-nums">{items}</span>{' '}
                <span className="text-ink-muted">
                  reviewed {items === 1 ? 'question' : 'questions'}
                </span>
                {configs.length > 1 ? (
                  <span className="text-ink-subtle"> · {configs.length} test versions</span>
                ) : null}
              </p>
            </Card>
          ))}
        </ul>
      </Container>

      {/* How it works */}
      <section className="border-y border-line bg-surface">
        <Container>
          <h2 className="font-serif text-2xl font-semibold">How it works</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Read the real format',
                body: 'Each exam guide records sections, timing, navigation and scoring with a link to the official page each fact came from, and the date we checked it.',
              },
              {
                title: 'Take a short diagnostic',
                body: 'Answer a spread of questions across the exam’s own skill taxonomy and see where you actually stand.',
              },
              {
                title: 'Drill what is weak',
                body: 'Choose a topic, a difficulty and a length. Every question comes with a worked solution and an explanation of each wrong choice.',
              },
              {
                title: 'Review your mistakes',
                body: 'Missed questions return on a simple schedule, so you meet them again while they still matter.',
              },
            ].map((step, index) => (
              <li key={step.title}>
                <p className="font-mono text-sm text-ink-subtle">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 font-serif text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Honesty */}
      <Container>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-semibold">What we will not do</h2>
            <ul className="mt-4 space-y-3 text-ink-muted">
              <li>
                <strong className="text-ink">We do not invent a scaled score.</strong> None of these
                test makers publish their raw-to-scale conversion, so we report what we can actually
                measure: accuracy, timing and performance by skill.
              </li>
              <li>
                <strong className="text-ink">We do not report percentiles.</strong> That would need a
                calibrated reference population we do not have.
              </li>
              <li>
                <strong className="text-ink">We do not copy official questions.</strong> Everything
                here is written by our editorial team and independently solved before publication.
              </li>
              <li>
                <strong className="text-ink">
                  We do not present competitive scores as requirements.
                </strong>{' '}
                Where a university publishes an actual minimum, we label it as one. Where a number is
                just an observed average, we say that instead.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold">Where we are today</h2>
            <p className="mt-4 text-ink-muted">
              This is a starter library, and we would rather tell you its size than imply it is
              bigger. It currently holds{' '}
              <strong className="text-ink tabular-nums">{totalQuestions}</strong> reviewed questions
              across all six exams. Coverage and any limits on a given practice format are shown on
              the exam&rsquo;s own page, before you start.
            </p>
            <p className="mt-4 text-ink-muted">
              Full-length simulations only appear when two things are true: the exam&rsquo;s rules are
              verified, and there are enough reviewed questions to fill the blueprint without
              repeating one.
            </p>
            <p className="mt-4">
              <Link href="/about/editorial-standards">Read our editorial standards</Link>
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
