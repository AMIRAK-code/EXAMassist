import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { requireSignedIn } from '@/lib/auth/guards';
import { getExamConfig } from '@/lib/exams/registry';
import {
  activePlan,
  examDateFor,
  planAdjustment,
  recordCompletions,
  sessionLabel,
  type PlannedSession,
  type PlanSessionRow,
} from '@/lib/learning/plan';
import { formatDate, formatDay, parsePlanDate, parseWeeklyMinutes } from '@/lib/learning/plan-inputs';
import { applyAdjustmentAction } from '@/app/actions/planning';
import { Breadcrumbs, Button, ButtonLink, Card, Container, DefinitionList, PageHeader, Stat } from '@/components/ui';
import { PlanningNotice } from '@/components/planning/planning-views';
import { KindBadge, PlanInputsForm } from '@/components/planning/plan-parts';

/**
 * "Adjust my remaining plan": a preview of every change, applied only when
 * the learner says so, and only if it is still exactly this preview.
 *
 * Completed and skipped sessions are history and are not touched. Missed
 * ones are recorded as missed and their topics scheduled first. Future
 * sessions not yet started are replaced by a schedule from today, from the
 * current evidence and the questions available now; unchanged ones stay.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Adjust your study plan',
  robots: { index: false, follow: false },
};

type Query = { exam?: string | string[]; minutes?: string | string[]; date?: string | string[]; notice?: string | string[] };
const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** A removed and an added session of the same kind and focus read as one session moving. */
function pairMoves(removed: PlanSessionRow[], added: PlannedSession[]) {
  const moves: Array<{ from: PlanSessionRow; to: PlannedSession }> = [];
  const addedLeft = [...added];
  const removedLeft: PlanSessionRow[] = [];
  for (const session of removed) {
    const index = addedLeft.findIndex((a) => a.kind === session.kind && a.domainSlug === session.domainSlug && a.skillSlug === session.skillSlug);
    if (index >= 0) moves.push({ from: session, to: addedLeft.splice(index, 1)[0] });
    else removedLeft.push(session);
  }
  return { moves, removed: removedLeft, added: addedLeft };
}

export default async function AdjustPlanPage({ searchParams }: { searchParams: Promise<Query> }) {
  const user = await requireSignedIn('/study-plan/adjust');
  const query = await searchParams;
  const config = getExamConfig(one(query.exam) ?? '');
  if (!config) redirect('/study-plan');
  const db = getDb();
  let plan = activePlan(db, user.id, config.examKey);
  if (!plan) redirect(`/study-plan?exam=${encodeURIComponent(config.examKey)}&notice=no-plan`);
  if (recordCompletions(db, user.id, plan) > 0) plan = activePlan(db, user.id, config.examKey)!;

  // Inputs: what the learner asked to preview, else the plan's own, with the
  // exam date as it is now (it may have changed since the plan was made).
  const weeklyMinutes = parseWeeklyMinutes(one(query.minutes)) ?? plan.weeklyMinutes;
  const askedDate = one(query.date);
  const current = examDateFor(db, user.id, config.examKey).examDate;
  const parsed = parsePlanDate(askedDate !== undefined ? askedDate : current);
  const examDate = parsed === 'invalid' ? null : parsed;
  const dateNote =
    parsed === 'invalid'
      ? askedDate !== undefined
        ? 'That date is not after today, so this preview uses no exam date.'
        : `Your exam date, ${formatDate(current!)}, has passed, so this preview uses none.`
      : null;

  const { preview, digest } = planAdjustment(db, user.id, plan, { weeklyMinutes, examDate });
  const { moves, removed, added } = pairMoves(preview.removed, preview.added);
  const carried = [...new Set(preview.missed.filter((s) => s.kind === 'new' || s.kind === 'revision').map((s) => sessionLabel(config, s)))];
  const inputsChanged = weeklyMinutes !== plan.weeklyMinutes || examDate !== plan.examDate;
  const changes = preview.missed.length + preview.removed.length + preview.added.length;
  const planHref = `/study-plan?exam=${encodeURIComponent(config.examKey)}`;

  return (
    <Container size="narrow">
      <Breadcrumbs
        trail={[
          { href: '/', label: 'Home' },
          { href: '/dashboard', label: 'Dashboard' },
          { href: planHref, label: 'Study plan' },
          { label: 'Adjust' },
        ]}
      />
      <PageHeader eyebrow={config.publisher} title="Adjust my remaining plan" />
      <PlanningNotice code={query.notice} className="mb-6" />

      <section aria-labelledby="changes-heading" className="mb-10">
        <h2 id="changes-heading" className="mb-4 font-heading text-2xl font-semibold">
          What would change
        </h2>
        <Card>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <Stat label="Recorded missed" value={preview.missed.length} />
            <Stat label="Moved" value={moves.length} />
            <Stat label="Added" value={added.length} />
            <Stat label="Removed" value={removed.length} />
          </div>
          <div className="mt-5 border-t border-line pt-5">
            <DefinitionList
              items={[
                { term: 'Unchanged', value: `${preview.kept} upcoming session${preview.kept === 1 ? '' : 's'}` },
                { term: 'History kept', value: `${preview.history} completed or skipped` },
                { term: 'New schedule', value: `${formatDay(preview.startsOn)} to ${formatDay(preview.endsOn, true)}` },
                { term: 'Exam date', value: examDate ? formatDate(examDate) : 'None' },
                { term: 'Each week', value: `${weeklyMinutes} minutes` },
              ]}
            />
          </div>
          {changes > 0 || inputsChanged ? (
            <form action={applyAdjustmentAction} className="mt-5 flex flex-wrap gap-3">
              <input type="hidden" name="examKey" value={config.examKey} />
              <input type="hidden" name="planId" value={plan.id} />
              <input type="hidden" name="digest" value={digest} />
              <input type="hidden" name="weeklyMinutes" value={weeklyMinutes} />
              <input type="hidden" name="examDate" value={examDate ?? ''} />
              <Button type="submit">Apply these changes</Button>
              <ButtonLink href={planHref} variant="secondary">
                Keep my plan as it is
              </ButtonLink>
            </form>
          ) : (
            <div className="mt-5">
              <p className="text-sm text-ink-muted">Nothing would change: your plan already matches these inputs.</p>
              <ButtonLink href={planHref} variant="secondary" className="mt-3">
                Back to my plan
              </ButtonLink>
            </div>
          )}
        </Card>
      </section>

      <section aria-labelledby="inputs-heading" className="mb-10">
        <h2 id="inputs-heading" className="mb-4 font-heading text-2xl font-semibold">
          Time and date
        </h2>
        <Card>
          <PlanInputsForm
            action="/study-plan/adjust"
            examKey={config.examKey}
            examDate={examDate}
            weeklyMinutes={weeklyMinutes}
            submitLabel="Update the preview"
            dateHint="Your one exam date for this exam. Changing it here changes it for your goal too, once you apply."
          />
          {dateNote ? <p className="mt-4 text-sm text-caution">{dateNote}</p> : null}
        </Card>
      </section>

      <section aria-labelledby="details-heading">
        <h2 id="details-heading" className="mb-4 font-heading text-2xl font-semibold">
          Every change
        </h2>
        <div className="space-y-8">
          <ChangeList title="Recorded as missed" empty="No missed sessions.">
            {preview.missed.map((s) => (
              <Row key={s.id} day={s.scheduledOn} label={sessionLabel(config, s)} kind={s.kind} />
            ))}
          </ChangeList>
          {carried.length > 0 ? (
            <div>
              <h3 className="font-heading text-lg font-semibold">Carried forward</h3>
              <p className="mt-1 text-sm text-ink-muted">Scheduled first in the new schedule: {carried.join('; ')}.</p>
            </div>
          ) : null}
          <ChangeList title="Moved" empty="Nothing moves.">
            {moves.map(({ from, to }) => (
              <Row key={from.id} day={to.scheduledOn} previous={from.scheduledOn} label={sessionLabel(config, to)} kind={to.kind} />
            ))}
          </ChangeList>
          <ChangeList title="Added" empty="Nothing is added.">
            {added.map((s) => (
              <Row key={`${s.scheduledOn}-${s.sequence}`} day={s.scheduledOn} label={sessionLabel(config, s)} kind={s.kind} />
            ))}
          </ChangeList>
          <ChangeList title="Removed" empty="Nothing is removed.">
            {removed.map((s) => (
              <Row key={s.id} day={s.scheduledOn} label={sessionLabel(config, s)} kind={s.kind} />
            ))}
          </ChangeList>
        </div>
      </section>
    </Container>
  );
}

function ChangeList({ title, empty, children }: { title: string; empty: string; children: React.ReactNode[] }) {
  return (
    <div>
      <h3 className="font-heading text-lg font-semibold">{title}</h3>
      {children.length === 0 ? (
        <p className="mt-1 text-sm text-ink-muted">{empty}</p>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-card border border-line bg-surface">{children}</ul>
      )}
    </div>
  );
}

function Row({ day, previous, label, kind }: { day: string; previous?: string; label: string; kind: PlannedSession['kind'] }) {
  return (
    <li className="px-4 py-3">
      <p className="text-sm font-semibold tabular-nums text-ink-muted">
        {previous ? (
          <>
            <time dateTime={previous}>{formatDay(previous)}</time> <span aria-hidden="true">→</span>
            <span className="sr-only"> moves to </span> <time dateTime={day}>{formatDay(day)}</time>
          </>
        ) : (
          <time dateTime={day}>{formatDay(day)}</time>
        )}
      </p>
      <p className="mt-1 font-medium">{label}</p>
      <div className="mt-2">
        <KindBadge kind={kind} />
      </div>
    </li>
  );
}
