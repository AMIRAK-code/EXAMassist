import { getDb } from '@/lib/db';
import { assertSameOrigin, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { createOfficialScore, listOfficialScores, officialScoreInputSchema } from '@/lib/learning/official-scores';

/**
 * The acting learner's own official practice results
 * (src/lib/learning/official-scores.ts). Every read and write is keyed on the
 * id from the session; nothing in the request can name another learner.
 */

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const user = await requireUser();
    const exam = new URL(request.url).searchParams.get('exam') ?? undefined;
    return ok({ results: await listOfficialScores(getDb(), user.id, exam) });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const body = await readJson(request, officialScoreInputSchema);
    return ok({ result: await createOfficialScore(getDb(), user.id, body) });
  } catch (error) {
    return toErrorResponse(error);
  }
}
