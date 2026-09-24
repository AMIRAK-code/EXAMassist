import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { EXAM_CONFIGS, getExamConfig, getHubForConfig } from '@/lib/exams/registry';
import { blueprintAvailability, practiceFacets } from '@/lib/attempts/availability';
import { eligibleCount } from '@/lib/attempts/facets';
import { getCurrentUser } from '@/lib/auth/session';
import { StartPracticeForm, type PresetSkill } from '@/components/practice/start-practice-form';
import { GUEST_NOTE_SHORT } from '@/components/site/nav-items';
import { StartBlueprintButton } from '@/components/practice/start-blueprint-button';
import {
  Alert,
  Badge,
  Breadcrumbs,
  Card,
  Container,
  FidelityBadge,
  PageHeader,
  StatusBadge,
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
  const facets = practiceFacets(db, config);
  const availability = blueprintAvailability(db, config);
  const hub = getHubForConfig(config.examKey);
  const user = await getCurrentUser();

  const others = availability.filter((a) => a.blueprint.id !== 'practice');
  const totalItems = eligibleCount(facets, {});
  const domainChoices = config.domains.map((domain) => ({
    slug: domain.slug,
    name: domain.name,
    skills: domain.skills.map((skill) => ({ slug: skill.slug, name: skill.name })),
  }));

  // Links carry ?skill= or ?domain=. Accept only this exam's own taxonomy. An
  // older study-plan link passed a topic as ?skill=; it names the same thing,
  // so it is read as the topic it is.
  let presetSkill: PresetSkill | null = null;
  let presetDomain: string | null = null;
  let ignoredFilter: string | null = null;
  if (query.skill) {
    const owner = config.domains.find((domain) => domain.skills.some((skill) => skill.slug === query.skill));
    const skill = owner?.skills.find((s) => s.slug === query.skill);
    if (owner && skill) {
      presetSkill = { slug: skill.slug, name: skill.name, domainSlug: owner.slug, domainName: owner.name };
    } else if (config.domains.some((domain) => domain.slug === query.skill)) {
      presetDomain = query.skill;
    } else {
      ignoredFilter = query.skill;
    }
  }
  if (!presetSkill && !presetDomain && query.domain) {
    if (config.domains.some((domain) => domain.slug === query.domain)) presetDomain = query.domain;
    else ignoredFilter = query.domain;
  }

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
            Questions for this exam are still being checked, so there is nothing to practise here yet.
            Only questions that have passed review are ever served.
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
              <h2 className="text-xl">Topic practice</h2>
              <p className="mt-1 text-sm text-ink-muted">
                Untimed. Change an answer freely, then check it to see the worked explanation; a checked
                answer is locked.
              </p>
              {ignoredFilter ? (
                <Alert tone="caution" className="mt-4">
                  The link you followed named a topic or skill the {config.shortName} does not have, so no
                  filter has been applied.
                </Alert>
              ) : null}
              <div className="mt-5">
                <StartPracticeForm
                  examKey={config.examKey}
                  examLabel={hub?.label ?? config.shortName}
                  blueprintId="practice"
                  facets={facets}
                  domains={domainChoices}
                  presetDomain={presetDomain}
                  presetSkill={presetSkill}
                  guestNote={user && !user.isGuest ? null : GUEST_NOTE_SHORT}
                />
              </div>
            </Card>

            <h2 className="mb-4 mt-10 font-heading text-xl font-semibold">Other formats</h2>
            <ul className="space-y-4">
              {others.map((entry) => (
                <Card as="li" key={entry.blueprint.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-heading text-lg font-semibold">{entry.blueprint.label}</h3>
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
                        <StatusBadge status={entry.blockedBy === 'rules' ? 'notoffered' : 'notyet'} />
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
              <h2 className="font-heading text-lg font-semibold">Question bank</h2>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{totalItems}</p>
              <p className="text-sm text-ink-muted">
                reviewed questions across{' '}
                {config.domains.filter((d) => eligibleCount(facets, { domain: d.slug }) > 0).length} of{' '}
                {config.domains.length} topics
              </p>
              <p className="mt-3 text-sm text-ink-muted">
                This is a starter library, not a complete course. The questions are original and
                AI-assisted; each was solved blind by a separate AI reviewer before publication.{' '}
                <a href="/about/editorial-standards">How questions are checked</a>
              </p>
            </Card>

            {config.unverified.length > 0 ? (
              <Card>
                <h2 className="font-heading text-lg font-semibold">What we could not verify</h2>
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
