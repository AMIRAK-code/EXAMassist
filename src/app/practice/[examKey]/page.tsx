import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { EXAM_CONFIGS, getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { blueprintAvailability, practisableDomains } from '@/lib/attempts/availability';
import { StartPracticeForm } from '@/components/practice/start-practice-form';
import { StartBlueprintButton } from '@/components/practice/start-blueprint-button';
import {
  Alert,
  Badge,
  Breadcrumbs,
  Card,
  Container,
  FidelityBadge,
  PageHeader,
} from '@/components/ui';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return EXAM_CONFIGS.map((config) => ({ examKey: config.examKey }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ examKey: string }>;
}): Promise<Metadata> {
  const { examKey } = await params;
  const config = getExamConfig(examKey);
  if (!config) return { title: 'Practice' };
  return {
    title: `Practise ${config.shortName}`,
    description: `Choose a topic, difficulty and session length, then practise ${config.name} with original questions and full explanations.`,
    // Practice setup is a functional page, not editorial content.
    robots: { index: false, follow: true },
  };
}

function formatMinutes(seconds: number | null): string {
  if (seconds === null) return 'Untimed';
  return `${Math.round(seconds / 60)} min`;
}

export default async function PracticeSetupPage({
  params,
  searchParams,
}: {
  params: Promise<{ examKey: string }>;
  searchParams: Promise<{ domain?: string; skill?: string }>;
}) {
  const { examKey } = await params;
  const query = await searchParams;
  const config = getExamConfig(examKey);
  if (!config) notFound();

  const db = getDb();
  const domains = practisableDomains(db, config);
  const availability = blueprintAvailability(db, config);
  const hub = getHubForConfig(config.examKey);

  const openPractice = availability.find((a) => a.blueprint.id === 'practice');
  const others = availability.filter((a) => a.blueprint.id !== 'practice');
  const totalItems = domains.reduce((n, d) => n + d.count, 0);

  return (
    <Container>
      <Breadcrumbs
        trail={[
          { href: '/', label: 'Home' },
          { href: '/exams', label: 'Exams' },
          ...(hub ? [{ href: `/exams/${hub.slug}`, label: hub.name }] : []),
          { label: 'Practise' },
        ]}
      />

      <PageHeader
        eyebrow={config.publisher}
        title={`Practise ${config.name}`}
        lead={config.summary}
      />

      {totalItems === 0 ? (
        <Alert tone="caution" title="No reviewed questions yet for this exam">
          <p>
            Every question is written by our editorial team and independently solved by a second
            reviewer before it is published. Questions for this exam are still in review, so there is
            nothing to practise here yet.
          </p>
          {hub ? (
            <p className="mt-2">
              The <a href={`/exams/${hub.slug}/format`}>format and scoring guide</a> is complete and
              sourced, and is useful now.
            </p>
          ) : null}
        </Alert>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <Card>
              <h2 className="font-serif text-xl font-semibold">Build a practice session</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Untimed, with the explanation shown after each answer.
              </p>
              <div className="mt-5">
                <StartPracticeForm
                  examKey={config.examKey}
                  blueprintId="practice"
                  domains={domains}
                  maxLength={Math.min(30, totalItems)}
                  presetDomain={query.domain}
                  presetSkill={query.skill}
                />
              </div>
            </Card>

            <h2 className="mb-4 mt-10 font-serif text-xl font-semibold">Other formats</h2>
            <ul className="space-y-4">
              {others.map((entry) => (
                <Card as="li" key={entry.blueprint.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg font-semibold">{entry.blueprint.label}</h3>
                      <p className="mt-1 text-sm text-ink-muted">{entry.blueprint.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <FidelityBadge fidelity={entry.blueprint.fidelity} />
                        <Badge tone="neutral">
                          {entry.blueprint.parts.reduce((n, p) => n + p.itemCount, 0)} questions
                        </Badge>
                        <Badge tone="neutral">
                          {entry.blueprint.timing === 'untimed'
                            ? 'Untimed'
                            : formatMinutes(
                                entry.blueprint.overallTimeLimitSeconds ??
                                  entry.blueprint.parts.reduce(
                                    (n, p) => n + (p.timeLimitSeconds ?? 0),
                                    0,
                                  ),
                              )}
                        </Badge>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {entry.available ? (
                        <StartBlueprintButton
                          examKey={config.examKey}
                          blueprintId={entry.blueprint.id}
                          label="Start"
                        />
                      ) : (
                        <Badge tone="caution">Not available yet</Badge>
                      )}
                    </div>
                  </div>

                  {!entry.available && entry.reason ? (
                    <p className="mt-3 border-t border-line pt-3 text-sm text-ink-muted">
                      <span className="font-medium">
                        {entry.blockedBy === 'rules'
                          ? 'Why this is not offered: '
                          : 'Not enough reviewed questions yet: '}
                      </span>
                      {entry.reason}
                    </p>
                  ) : null}
                </Card>
              ))}
            </ul>
          </div>

          <aside className="space-y-5">
            <Card>
              <h2 className="font-serif text-lg font-semibold">Question bank</h2>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{totalItems}</p>
              <p className="text-sm text-ink-muted">
                reviewed questions across {domains.length} of {config.domains.length} topics
              </p>
              <p className="mt-3 text-sm text-ink-muted">
                This is a starter library, not a complete course. Every question is original and has
                been solved independently by a second reviewer before publication.
              </p>
            </Card>

            {config.unverified.length > 0 ? (
              <Card>
                <h2 className="font-serif text-lg font-semibold">What we could not verify</h2>
                <ul className="mt-2 list-disc space-y-1.5 ps-5 text-sm text-ink-muted">
                  {config.unverified.slice(0, 3).map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
                {hub ? (
                  <p className="mt-3 text-sm">
                    <a href={`/exams/${hub.slug}/format`}>See all sources and caveats</a>
                  </p>
                ) : null}
              </Card>
            ) : null}
          </aside>
        </div>
      )}
    </Container>
  );
}
