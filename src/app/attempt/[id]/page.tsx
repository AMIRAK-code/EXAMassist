import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { AttemptError, getAttemptState } from '@/lib/attempts/service';
import { toPlayerModel } from '@/lib/attempts/view-model';
import { preloadKatexFonts } from '@/lib/content/katex-fonts';
import { pendingOwner } from '@/lib/player/owner';
import { AttemptPlayer } from '@/components/player/attempt-player';
import { tutorEnabled } from '@/lib/tutor/config';

// A live attempt is personal state: never cached, never indexed.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Practice session',
  robots: { index: false, follow: false },
};

export default async function AttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/sign-in?next=/attempt/${id}`);

  let state;
  try {
    state = (await getAttemptState(getDb(), id, user.id));
  } catch (error) {
    if (error instanceof AttemptError && error.status === 404) notFound();
    throw error;
  }

  // A finished attempt belongs on the results page.
  if (state.status !== 'in_progress') redirect(`/attempt/${id}/results`);

  // The maths fonts, early, if anything in the open section shows maths. The
  // whole section counts, not just the first question: the player moves
  // between questions without a page load, and a formula shown after a move
  // would otherwise wait for its fonts and reflow the question around it.
  const open = state.parts.find((part) => part.partIndex === state.currentPartIndex);
  preloadKatexFonts(
    (open?.items ?? []).flatMap((item) => [
      item.question.stimulus?.bodyMd,
      item.question.instructionsMd,
      item.question.stemMd,
      ...(item.question.options ?? []).map((option) => option.textMd),
      item.review?.explanationMd,
    ]),
  );

  // Keyed by section: when a section ends (submitted, or its clock ran out) the
  // player starts afresh for the next one, from that section's own answers and
  // resume position, instead of carrying the previous section's state over.
  return (
    <AttemptPlayer
      key={`${state.id}:${state.currentPartIndex}`}
      model={toPlayerModel(state)}
      owner={pendingOwner(user.id)}
      tutorEnabled={tutorEnabled()}
    />
  );
}
