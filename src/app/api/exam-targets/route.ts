import { z } from 'zod';
import { getDb } from '@/lib/db';
import { assertSameOrigin, fail, ok, readJson, toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';
import { getExamConfig } from '@/lib/exams/registry';
import { listExamTargets, setExamTarget } from '@/lib/learning/queries';

const bodySchema = z.object({
  examKey: z.string().min(1).max(64),
  /** On the exam's own published scale, exactly as the learner typed it. */
  targetScore: z.number().finite().nonnegative().max(10_000).nullable(),
  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date in the form YYYY-MM-DD.')
    .nullable(),
});

export async function GET() {
  try {
    const user = await requireUser();
    return ok({ targets: (await listExamTargets(getDb(), user.id)) });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const body = await readJson(request, bodySchema);

    const config = getExamConfig(body.examKey);
    if (!config) return fail('unknown-exam', 'That exam does not exist.', 404);

    // Keep the target on the exam's own scale. A number outside it is almost
    // always a different scale remembered wrongly, and storing it would make
    // every downstream figure nonsense.
    const scale = config.scoring.officialScale;
    if (body.targetScore !== null && scale) {
      if (body.targetScore < scale.min || body.targetScore > scale.max) {
        return fail(
          'target-out-of-range',
          `A ${config.shortName} score runs from ${scale.min} to ${scale.max}. ${body.targetScore} is outside that.`,
          400,
        );
      }
    }

    // A real calendar date: 2026-02-31 is refused, not rolled forward.
    if (body.targetDate !== null) {
      const time = Date.parse(`${body.targetDate}T00:00:00Z`);
      if (Number.isNaN(time) || new Date(time).toISOString().slice(0, 10) !== body.targetDate) {
        return fail('invalid-date', 'That is not a real calendar date.', 400);
      }
    }

    (await setExamTarget(getDb(), user.id, body.examKey, body.targetScore, body.targetDate));
    return ok({ examKey: body.examKey, targetScore: body.targetScore, targetDate: body.targetDate });
  } catch (error) {
    return toErrorResponse(error);
  }
}
