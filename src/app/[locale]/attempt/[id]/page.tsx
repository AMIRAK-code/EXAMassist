import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { languageAlternates } from '@/i18n/alternates';
import type { Locale } from '@/i18n/locales';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { AttemptError, getAttemptState } from '@/lib/attempts/service';
import { toPlayerModel } from '@/lib/attempts/view-model';
import { preloadKatexFonts } from '@/lib/content/katex-fonts';
import { pendingOwner } from '@/lib/player/owner';
import { AttemptPlayer } from '@/components/player/attempt-player';
import { tutorEnabled } from '@/lib/tutor/config';
import { loadEntitlements } from '@/lib/billing/entitlements';

// A live attempt is personal state: never cached, never indexed.
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'player' });
  return {
    title: t('metaTitle'),
    robots: { index: false, follow: false },
    alternates: languageAlternates(`/attempt/${id}`, locale as Locale),
  };
}

export default async function AttemptPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const user = await getCurrentUser();
  if (!user) return redirect({ href: `/sign-in?next=/attempt/${id}`, locale });

  let state;
  try {
    state = (await getAttemptState(getDb(), id, user.id));
  } catch (error) {
    if (error instanceof AttemptError && error.status === 404) notFound();
    throw error;
  }

  // A finished attempt belongs on the results page.
  if (state.status !== 'in_progress') redirect({ href: `/attempt/${id}/results`, locale });

  // The AI tutor is offered only where the learner's plan includes it; the
  // server refuses it anywhere else in any case.
  const tutor = tutorEnabled() && (await loadEntitlements(getDb(), user.id)).can('ai_tutor', state.examKey);

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
      tutorEnabled={tutor}
    />
  );
}
