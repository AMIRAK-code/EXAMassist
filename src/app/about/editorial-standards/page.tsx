import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE, absoluteUrl, siteUrl } from '@/lib/site';
import { Badge, Breadcrumbs, Card, Container, DefinitionList, PageHeader } from '@/components/ui';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/json-ld';

/**
 * Editorial standards.
 *
 * Everything on this page describes a control that actually exists in this
 * repository: the question contract and its validator, the blinded review
 * export, the mechanical verdict script, and the dated research records.
 * Nothing here describes an aspiration.
 */

const PATH = '/about/editorial-standards';
const TITLE = 'Editorial standards';
const DESCRIPTION =
  'How Examer creates, checks and publishes practice questions: original, AI-assisted drafting, a blind solve by a separate AI reviewer, mechanical comparison against the answer key, and quarantine instead of quiet correction.';

/**
 * Real dates: written on 2026-09-22; revised on 2026-09-24 to state plainly
 * which checks are done by a model and that no per-question human review is
 * recorded, and again that day to record the option-letter correction.
 */
const PUBLISHED = '2026-09-22';
const UPDATED = '2026-09-24';
const PUBLISHED_LABEL = '22 September 2026';
const UPDATED_LABEL = '24 September 2026';

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

const STATES: Array<{ term: string; value: string }> = [
  {
    term: 'draft',
    value:
      'Being written. Anything a model helped draft enters here and cannot skip the queue. Drafts are never delivered to a learner.',
  },
  {
    term: 'in_review',
    value:
      'Queued for the blind independent solve. This is the only state the review export picks up.',
  },
  {
    term: 'published',
    value:
      'Passed every automatic check and the independent solve. Only published questions are served in practice, diagnostics and simulations.',
  },
  {
    term: 'quarantined',
    value:
      'The reviewer disagreed with the answer key, or could not confirm that only one answer works. The question is withdrawn from the bank with the reason recorded, and stays out until it is rewritten and passes a new blind solve.',
  },
  {
    term: 'retired',
    value:
      'Withdrawn deliberately — superseded, or made wrong by a change to the exam. Results that already reference it are untouched, because an attempt points at an immutable question version.',
  },
];

const AUTOMATIC_CHECKS: string[] = [
  'Answer choices that mean the same thing are rejected. Choice text is normalised numerically first, so “0.50”, “.5” and “1/2” collide as one answer offered twice. Punctuation is only ignored while testing a numeric reading, because on the SAT and ACT the punctuation often is the question.',
  'The answer key must name options that exist, and its type must match the question’s response type. A select-all key that includes every option is rejected as not a real question.',
  'Numeric answers must be coherent: no range whose minimum exceeds its maximum, and no negative tolerance.',
  'Every wrong choice needs a written reason it is wrong. A missing or throwaway distractor rationale blocks publication.',
  'Explanations have to explain: an explanation shorter than 40 characters is not accepted at all.',
  'An explanation that names an option as the answer — “the answer is C”, “so option A must be true” — must name the keyed option. The check reads explicit statements only, so it is a safety net, not a proof that every letter is right.',
  'A question that refers to a passage, chart or table must refer to one that exists.',
  'A published question must name a reviewer, and the reviewer must not be the author.',
  'A published question must carry a review date and a complete independent-solve record in which the solver agreed with the key and confirmed answer uniqueness.',
  'Difficulty marked as empirically calibrated is flagged, because we do not hold validated response data to calibrate with.',
];

/** Who does each step today, as the question records show it. */
const ROLES: Array<{ term: string; value: string }> = [
  {
    term: 'Drafting',
    value:
      'An AI model, working to the exam’s official taxonomy. Every published record says a model assisted and names the drafting role, not a person.',
  },
  {
    term: 'Automatic checks',
    value: 'Code: the content validator described in section 3, run over every question on every build.',
  },
  {
    term: 'Blind solve',
    value:
      'A separate AI reviewer, given the question without its key, explanation or distractor notes. Its role is recorded on the question and is never the drafting role.',
  },
  {
    term: 'Comparison with the key',
    value: 'Code: the same scoring engine that marks learners’ answers.',
  },
  {
    term: 'Human review of each question',
    value:
      'Not recorded today. No question record names a human reviewer, so we do not claim one. Explanations are not yet independently re-read for teaching quality either.',
  },
  {
    term: 'Learner reports',
    value: 'Triaged in a role-gated editor area by a signed-in editor account.',
  },
];

const REFUSALS: string[] = [
  'Reproduce, adapt or paraphrase an official question. Every item here is ours, and the content contract permits nothing else.',
  'Report a scaled score, a percentile, a score band or an admission probability. No test maker we cover publishes the equating that would make such a number honest.',
  'Present a “target score” for an admissions process that is decided by competitive ranking.',
  'Describe a difficulty label, a routing rule or a timing allowance as the exam’s when it is ours.',
  'Refresh a published or updated date to look current. The dates on this site are the dates the work was done.',
  'Claim an affiliation with, or endorsement by, any test maker. We have neither; the notice in the site footer is the full statement.',
];

export default function EditorialStandardsPage() {
  const trail = [{ href: '/', label: 'Home' }, { label: TITLE }];

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

      <PageHeader
        eyebrow="About Examer"
        title={TITLE}
        lead="What has to be true before a question is shown to anyone, and what we refuse to claim about it afterwards."
      />

      <div className="rounded-card border-s-4 border-accent bg-accent-soft p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent-strong">In short</h2>
        <p className="mt-2 text-ink">
          Every practice question on {SITE.name} is original, AI-assisted material. Before it is
          published, a separate AI reviewer solves it from scratch without seeing the proposed
          answer, and the comparison between that solution and the key is made by the same scoring
          code the app uses. When the two disagree the question is quarantined — not quietly
          corrected. No per-question human review is recorded today, and we say so rather than imply
          one. Difficulty labels are editorial judgement, not calibrated statistics, and every claim
          we make about an exam’s format is sourced to the test maker and dated.
        </p>
      </div>

      <p className="mt-4 text-sm text-ink-subtle">
        By {SITE.publisher} · Published <time dateTime={PUBLISHED}>{PUBLISHED_LABEL}</time> · Updated{' '}
        <time dateTime={UPDATED}>{UPDATED_LABEL}</time>
      </p>

      <div className="mt-10 space-y-12">
        <section aria-labelledby="original">
          <h2 id="original" className="font-heading text-2xl font-semibold">
            1. All questions are original
          </h2>
          <div className="prose-academic">
            <p>
              The question contract permits exactly one provenance for anything that reaches a
              learner: <code>original</code>, owned by us. We do not reproduce, adapt or paraphrase
              official question banks, retired forms, or any other publisher’s items, and there is no
              code path that would let a question of another provenance be published.
            </p>
            <p>
              Every question record identifies the role that drafted it, records that a model
              assisted the drafting, and carries its rights status. Anything a model helped draft
              enters the bank as a <code>draft</code>, and no question reaches learners without
              passing every step below.
            </p>
          </div>
        </section>

        <section aria-labelledby="states">
          <h2 id="states" className="font-heading text-2xl font-semibold">
            2. The five states a question can be in
          </h2>
          <div className="prose-academic">
            <p>
              Publication is a state, not an opinion. These are the only five states a question can
              hold, and only one of them is served to learners.
            </p>
          </div>
          <Card className="mt-4">
            <DefinitionList items={STATES} />
          </Card>
        </section>

        <section aria-labelledby="automatic">
          <h2 id="automatic" className="font-heading text-2xl font-semibold">
            3. What code checks before any review
          </h2>
          <div className="prose-academic">
            <p>
              A validator runs over every question in the repository as part of the build. These
              checks are cheap, boring and absolute — they exist so that review is spent on whether
              the question is <em>right</em>, not on whether it is well formed.
            </p>
            <ul>
              {AUTOMATIC_CHECKS.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
            <p>A question that fails any of these is not published. The build fails with it.</p>
          </div>
        </section>

        <section aria-labelledby="blind-solve">
          <h2 id="blind-solve" className="font-heading text-2xl font-semibold">
            4. The blind solve by a separate AI reviewer
          </h2>
          <div className="prose-academic">
            <p>
              This is the control the whole process turns on, so it is worth being precise about how
              it works. The reviewer is an AI model, separate from the one that drafted the question.
              A reviewer that can see the proposed answer is not solving the question, it is agreeing
              with it. So the reviewer never sees it.
            </p>

            <h3>The batch is stripped, then the stripping is checked</h3>
            <p>
              Questions waiting for review are exported to a separate file with the answer key, the
              explanation and the distractor reasoning removed. The export then re-reads what it
              wrote and fails loudly if any of those three fields appears anywhere in the file. A
              leak stops the batch rather than quietly degrading the review.
            </p>

            <h3>The reviewer solves it from scratch</h3>
            <p>
              The reviewer receives the stem, the instructions, the passage or chart and the answer
              choices — nothing else — together with a statement of exactly how to express an answer
              of that type. They record the answer they reached, their working notes, and whether
              they confirmed that only one choice is defensible.
            </p>

            <h3>The comparison is mechanical</h3>
            <p>
              The reviewer is never asked whether they agree. Their answer is parsed into a response
              and run through the same scoring engine that marks a learner’s attempt, and the engine
              decides whether it matches the author’s key. That removes the most common failure mode
              in editorial review: a reviewer who half-recognises the intended answer and talks
              themselves into it.
            </p>

            <h3>Disagreement quarantines, it does not fix</h3>
            <p>
              If the solved answer matches the key <em>and</em> uniqueness was confirmed, the question
              is published with the reviewer’s role, the date and the full solve record attached. In
              every other case — a mismatch, or uniqueness left unconfirmed — the question moves to{' '}
              <code>quarantined</code>, with the reviewer’s answer and notes written into the reason,
              and it leaves the live bank. Nothing in that path infers what the author “meant”. A
              disputed question stays out until it is rewritten and passes a new blind solve.
            </p>
          </div>
        </section>

        <section aria-labelledby="roles">
          <h2 id="roles" className="font-heading text-2xl font-semibold">
            5. Who does what, as the records show it
          </h2>
          <div className="prose-academic">
            <p>
              A check done by a model is not the same as a check done by a person, so here is the
              list, step by step. It describes what the question records actually contain.
            </p>
          </div>
          <Card className="mt-4">
            <DefinitionList items={ROLES} />
          </Card>
        </section>

        <section aria-labelledby="limits">
          <h2 id="limits" className="font-heading text-2xl font-semibold">
            6. What review does not establish
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="caution">Difficulty labels are editorial</Badge>
            <Badge tone="caution">Not calibrated</Badge>
            <Badge tone="caution">No score prediction</Badge>
          </div>
          <div className="prose-academic">
            <p>
              Every question carries an easy, medium or hard label, and every one of those labels is
              our editorial judgement of how hard the question ought to be. They are not calibrated
              against test-taker data, because we do not hold validated response data to calibrate
              with — and a label that claimed otherwise would be a statistic we invented. Where a
              question’s difficulty basis says “empirical”, the validator flags it.
            </p>
            <p>
              For the same reason: a review tells you a question is correct and unambiguous. It tells
              you nothing about where a set of these questions would place you on an exam’s reported
              scale. Why we publish no scaled score, percentile or admission estimate is set out in{' '}
              <Link href="/about/how-scoring-works">how scoring works</Link>.
            </p>
          </div>
        </section>

        <section aria-labelledby="exam-facts">
          <h2 id="exam-facts" className="font-heading text-2xl font-semibold">
            7. How exam facts are verified and dated
          </h2>
          <div className="prose-academic">
            <p>
              Format, timing, navigation, calculator policy and scoring are not written from memory.
              Each exam has a research record holding the verified claims, the sources behind them
              with publisher and fetch status, a verification date, and — the part that matters most
              — an explicit list of the things the test maker does <strong>not</strong> publish.
            </p>
            <p>
              The research documents in the repository are generated from those records by a pure
              transformation, deliberately, so that the documentation cannot assert anything the
              record does not already contain. A fact changes in the record and the document follows;
              never the reverse.
            </p>
            <p>
              The unverifiable list has teeth. Where a rule cannot be verified, the feature that
              depends on it is <em>disabled</em> rather than estimated, and the exam page says which
              feature and why. Where we do approximate something, the approximation is labelled as
              ours on the page where it applies: the second-stage routing threshold in our Digital
              SAT simulation, for instance, is our own published rule, not College Board’s.
            </p>
            <p>
              Date-sensitive facts such as booking windows and test dates are reviewed on a shorter
              cycle than rule facts, and rule facts are re-verified before any release that changes
              how a simulation behaves. Every current exam record was verified on{' '}
              <time dateTime="2026-09-18">18 September 2026</time>.
            </p>
          </div>
        </section>

        <section aria-labelledby="corrections">
          <h2 id="corrections" className="font-heading text-2xl font-semibold">
            8. Corrections
          </h2>
          <div className="prose-academic">
            <p>
              Controls catch a great deal and never everything. If a question looks wrong, ambiguous
              or badly worded, tell us. The report goes into the editor area’s review queue, with the
              question and the version you saw attached to it.
            </p>
            <p>
              Corrections are made as new versions, never by editing what a learner already saw. In
              September 2026 an audit found that reordering answer options had left 104 published
              explanations referring to options by their old letters, 91 of them in a way that pointed
              to a wrong option as the answer. Each was corrected as a new version, withdrawn from new
              sessions until a separate AI reviewer had re-checked its option references and a new
              blind solve had passed, and then restored. Earlier attempts keep the version they were
              shown.
            </p>
          </div>
          <Card className="mt-4">
            <h3 className="font-heading text-lg font-semibold">Found a problem in a question?</h3>
            <p className="mt-1 text-sm text-ink-muted">
              No account needed. It takes about a minute, and it is the fastest way to get a bad
              question out of the bank.
            </p>
            <p className="mt-3 text-sm">
              <Link href="/report-question">Report a question →</Link>
            </p>
          </Card>
        </section>

        <section aria-labelledby="never">
          <h2 id="never" className="font-heading text-2xl font-semibold">
            9. What we will not do
          </h2>
          <div className="prose-academic">
            <ul>
              {REFUSALS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </Container>
  );
}
