import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { AttemptError, getAttemptState } from '@/lib/attempts/service';
import { toPlayerModel } from '@/lib/attempts/view-model';
import { AttemptPlayer } from '@/components/player/attempt-player';

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
    state = getAttemptState(getDb(), id, user.id);
  } catch (error) {
    if (error instanceof AttemptError && error.status === 404) notFound();
    throw error;
  }

  // A finished attempt belongs on the results page.
  if (state.status !== 'in_progress') redirect(`/attempt/${id}/results`);

  // Keyed by section: when a section ends (submitted, or its clock ran out) the
  // player starts afresh for the next one, from that section's own answers and
  // resume position, instead of carrying the previous section's state over.
  return <AttemptPlayer key={`${state.id}:${state.currentPartIndex}`} model={toPlayerModel(state)} />;
}
