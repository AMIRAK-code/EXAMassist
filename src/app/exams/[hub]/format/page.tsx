import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { EXAM_HUBS, getConfigsForHub, getHub } from '@/lib/exams/registry';
import { describePolicy } from '@/lib/assessment/navigation';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { guidesForHub } from '@/lib/content/guides';
import { Alert, Breadcrumbs, ButtonLink, Card, Container } from '@/components/ui';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';

export function generateStaticParams() {
  return EXAM_HUBS.map((hub) => ({ hub: hub.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hub: string }>;
}): Promise<Metadata> {
  const { hub: slug } = await params;
  const hub = getHub(slug);
  if (!hub) return { title: 'Format and scoring' };

  const configs = getConfigsForHub(slug);
  const title = `${hub.name} format and scoring guide`;
  const description = `Sections, question counts, timing, navigation rules, calculator policy and scoring for the ${hub.name}, verified against ${hub.publisher} on ${configs[0]?.verifiedOn ?? 'our last check'}.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/exams/${hub.slug}/format`) },
    openGraph: {
      type: 'article',
      url: absoluteUrl(`/exams/${hub.slug}/format`),
      title: `${title} | ${SITE.shortName}`,
      description,
    },
  };
}

const CALCULATOR_LABEL: Record<string, string> = {
  none: 'Not permitted',
  onscreen: 'On-screen calculator provided',
  onscreen_and_personal: 'On-screen calculator, and an approved personal calculator',
  personal_only: 'Approved personal calculator only',
  not_applicable: 'Not applicable',
  unverified: 'Not verified',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function FormatGuidePage({ params }: { params: Promise<{ hub: string }> }) {
  const { hub: slug } = await params;
  const hub = getHub(slug);
  if (!hub) notFound();

  const configs = getConfigsForHub(slug);
  const guides = guidesForHub(slug);
  const trail = [
    { href: '/', label: 'Home' },
    { href: '/exams', label: 'Exams' },
    { href: `/exams/${hub.slug}`, label: hub.name },
    { label: 'Format and scoring' },
  ];
  const verifiedOn = configs[0]?.verifiedOn ?? '';

  return (
    <Container size="narrow">
      <JsonLd
        data={[
          breadcrumbSchema(siteUrl(), trail),
          articleSchema({
            siteUrl: siteUrl(),
            url: absoluteUrl(`/exams/${hub.slug}/format`),
            headline: `${hub.name} format and scoring guide`,
            description: hub.tagline,
            datePublished: verifiedOn,
            dateModified: verifiedOn,
            publisherName: SITE.publisher,
            authorName: SITE.publisher,
          }),
        ]}
      />
      <Breadcrumbs trail={trail} />

      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
        {hub.name}: format and scoring
      </h1>

      {/*
        The opening is kept to lines that cannot jump when the web font
        arrives: the date starts its line and the rest of the sentence is one
        text run. The version and cycle details follow each summary, and the
        provenance note sits with the sources it describes (docs/REDESIGN.md §14).
      */}
      <p className="mt-2 text-sm text-ink-subtle">
        Verified{' '}
        <time dateTime={verifiedOn}>{verifiedOn ? formatDate(verifiedOn) : '—'}</time>
        {` from ${hub.publisher}’s published pages.`}
      </p>

      <div className="mt-6 rounded-card border-s-4 border-accent bg-accent-soft p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-strong">In short</h2>
        <p className="mt-2 text-ink">{hub.tagline}</p>
      </div>

      {configs.map((config) => (
        <section key={config.examKey} className="mt-10" aria-labelledby={`fmt-${config.examKey}`}>
          <h2 id={`fmt-${config.examKey}`} className="font-heading text-2xl font-semibold">
            {config.name}
          </h2>
          <p className="mt-3 text-ink">{config.summary}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="font-medium text-ink-muted">Version described</dt>
              <dd className="text-ink-subtle">{config.versionLabel}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink-muted">Admissions cycle</dt>
              <dd className="text-ink-subtle">{config.admissionsCycle}</dd>
            </div>
          </dl>

          {/* Structure */}
          <h3 className="mt-8 font-heading text-xl font-semibold">Sections and timing</h3>
          <div className="mt-3 relative overflow-x-auto rounded-card border border-line bg-surface">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                Sections of the {config.name} with question counts, time limits and calculator policy.
              </caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-4 py-3 text-left font-semibold">Section</th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold">Questions</th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold">Time</th>
                  <th scope="col" className="px-4 py-3 text-left font-semibold">Calculator</th>
                </tr>
              </thead>
              <tbody>
                {config.sections.map((section) => (
                  <tr key={section.key} className="border-b border-line last:border-0 align-top">
                    <th scope="row" className="px-4 py-3 text-left font-normal">{section.name}</th>
                    <td className="px-4 py-3">{section.officialQuestionCount ?? 'Not published'}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {section.officialTimeMinutes === null
                        ? 'Not published'
                        : `${section.officialTimeMinutes} min`}
                    </td>
                    <td className="px-4 py-3">
                      {CALCULATOR_LABEL[section.calculator] ?? section.calculator}
                      {section.calculatorNote ? (
                        <span className="block text-xs text-ink-muted">{section.calculatorNote}</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Navigation */}
          <h3 className="mt-8 font-heading text-xl font-semibold">Navigation rules</h3>
          <p className="mt-2 text-ink-muted">
            What you may and may not do once a section has started. Our timed practice enforces these
            on the server, not just in the interface.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 ps-5">
            {describePolicy(config.sections[0].navigation).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          {/* Scoring */}
          <h3 className="mt-8 font-heading text-xl font-semibold">Scoring</h3>
          <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[12rem_1fr]">
            <dt className="text-sm font-medium text-ink-muted">Correct answer</dt>
            <dd className="text-sm">{config.scoring.pointsCorrect} point(s)</dd>
            <dt className="text-sm font-medium text-ink-muted">Wrong answer</dt>
            <dd className="text-sm">
              {config.scoring.pointsIncorrect === 0
                ? 'No penalty'
                : `${config.scoring.pointsIncorrect} point(s) — a real penalty`}
            </dd>
            <dt className="text-sm font-medium text-ink-muted">Left blank</dt>
            <dd className="text-sm">{config.scoring.pointsOmitted} point(s)</dd>
            {config.scoring.officialScale ? (
              <>
                <dt className="text-sm font-medium text-ink-muted">Reported scale</dt>
                <dd className="text-sm">
                  {config.scoring.officialScale.label}: {config.scoring.officialScale.min}–
                  {config.scoring.officialScale.max}
                  {config.scoring.officialScale.note ? (
                    <span className="block text-ink-muted">{config.scoring.officialScale.note}</span>
                  ) : null}
                </dd>
              </>
            ) : null}
          </dl>

          {config.scoring.notes.length > 0 ? (
            <ul className="mt-4 list-disc space-y-1.5 ps-5 text-sm text-ink-muted">
              {config.scoring.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          ) : null}

          <Alert tone="info" title="Why we do not give you a scaled score" className="mt-5">
            {config.scoring.scaledEstimate.enabled
              ? config.scoring.scaledEstimate.method
              : config.scoring.scaledEstimate.reason}
          </Alert>

          {/* Taxonomy */}
          <h3 className="mt-8 font-heading text-xl font-semibold">What is tested</h3>
          <p className="mt-2 text-ink-muted">
            {config.publisher}&rsquo;s own content domains. Our question bank is tagged against these,
            so a results page names the same skills the test maker does.
          </p>
          <ul className="mt-3 space-y-3">
            {config.domains.map((domain) => (
              <li key={domain.slug}>
                <h4 className="font-medium">
                  {domain.name}
                  {domain.officialShare ? (
                    <span className="ms-2 text-sm font-normal text-ink-muted">
                      {domain.officialShare}
                    </span>
                  ) : null}
                </h4>
                {domain.description ? (
                  <p className="text-sm text-ink-muted">{domain.description}</p>
                ) : null}
                <p className="mt-1 text-sm text-ink-muted">
                  {domain.skills.map((skill) => skill.name).join(' · ')}
                </p>
              </li>
            ))}
          </ul>

          {/* Unverified */}
          {config.unverified.length > 0 ? (
            <>
              <h3 className="mt-8 font-heading text-xl font-semibold">
                What {config.publisher} does not publish
              </h3>
              <p className="mt-2 text-ink-muted">
                We could not verify the following from an official source. Rather than guess, we
                switch off any feature that would depend on them, and we say so here.
              </p>
              <ul className="mt-3 list-disc space-y-1.5 ps-5 text-sm text-ink-muted">
                {config.unverified.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </>
          ) : null}

          {/* Sources */}
          <h3 className="mt-8 font-heading text-xl font-semibold">Sources</h3>
          <p className="mt-2 text-sm text-ink-muted">
            {`Compiled by ${SITE.publisher} from ${hub.publisher}’s published pages. Each source shows the date it was checked.`}
          </p>
          <ol className="mt-3 space-y-2 text-sm">
            {config.sources.map((source, index) => (
              <li key={`${source.url}-${index}`}>
                <span className="text-ink-subtle">[{index + 1}]</span>{' '}
                <a href={source.url} rel="noopener noreferrer" target="_blank">
                  {source.label}
                </a>{' '}
                <span className="text-ink-muted">
                  — {source.publisher}, checked {source.verifiedOn}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ))}

      {guides.length > 0 ? (
        <Card className="mt-10">
          <h2 className="font-heading text-lg font-semibold">Related guides</h2>
          <ul className="mt-3 space-y-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={`/practice/${configs[0].examKey}`}>Start practising</ButtonLink>
        <ButtonLink href={`/exams/${hub.slug}`} variant="secondary">
          Back to {hub.name}
        </ButtonLink>
      </div>
    </Container>
  );
}
