import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type {
  AttemptItemRow,
  AttemptPartRow,
  AttemptResultRow,
  AttemptRow,
  BookmarkRow,
  ReviewQueueRow,
  StudyPlanRow,
  UserRow,
} from '@/lib/db/rows';
import { toErrorResponse } from '@/lib/api/http';
import { requireUser } from '@/lib/auth/session';

/**
 * Everything we hold about the learner who is asking, as one JSON file.
 *
 * Every query is filtered by the id resolved from the session cookie, and the
 * rows that hang off an attempt are reached through a join back to
 * `attempts.user_id`, so another learner's work cannot appear here even if an
 * attempt id were guessed. The password hash is never exported.
 */

export const dynamic = 'force-dynamic';

interface ExportItemRow extends AttemptItemRow {
  attempt_status: AttemptRow['status'];
  exam_key: string;
  section_key: string;
  domain_slug: string;
  skill_slug: string;
  difficulty: string;
  response_type: string;
  stem_md: string;
  options_json: string | null;
  correct_json: string;
  explanation_md: string;
}

function parseJson(value: string | null): unknown {
  if (value === null) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    // Keep the raw text rather than dropping data we cannot re-parse.
    return value;
  }
}

export async function GET() {
  try {
    const user = await requireUser();
    const db = getDb();

    const account = db
      .prepare(
        `SELECT id, email, display_name, role, is_guest, locale, target_exam_key, target_date,
                weekly_minutes, is_minor, created_at, updated_at
         FROM users WHERE id = ? AND deleted_at IS NULL`,
      )
      .get(user.id) as Omit<UserRow, 'password_hash' | 'deleted_at'> | undefined;

    if (!account) {
      return toErrorResponse(new Error('The signed-in account could not be read.'));
    }

    const attempts = db
      .prepare('SELECT * FROM attempts WHERE user_id = ? ORDER BY started_at')
      .all(user.id) as AttemptRow[];

    const parts = db
      .prepare(
        `SELECT p.* FROM attempt_parts p
         JOIN attempts a ON a.id = p.attempt_id
         WHERE a.user_id = ?
         ORDER BY p.attempt_id, p.part_index`,
      )
      .all(user.id) as AttemptPartRow[];

    const items = db
      .prepare(
        `SELECT i.*, a.status AS attempt_status,
                qv.exam_key, qv.section_key, qv.domain_slug, qv.skill_slug, qv.difficulty,
                qv.response_type, qv.stem_md, qv.options_json, qv.correct_json, qv.explanation_md
         FROM attempt_items i
         JOIN attempts a ON a.id = i.attempt_id
         JOIN question_versions qv ON qv.id = i.question_version_id
         WHERE a.user_id = ?
         ORDER BY i.attempt_id, i.part_index, i.position`,
      )
      .all(user.id) as ExportItemRow[];

    const results = db
      .prepare(
        `SELECT r.* FROM attempt_results r
         JOIN attempts a ON a.id = r.attempt_id
         WHERE a.user_id = ?`,
      )
      .all(user.id) as AttemptResultRow[];

    const bookmarks = db
      .prepare('SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at')
      .all(user.id) as BookmarkRow[];

    const reviewQueue = db
      .prepare('SELECT * FROM review_queue WHERE user_id = ? ORDER BY due_at')
      .all(user.id) as ReviewQueueRow[];

    const studyPlans = db
      .prepare('SELECT * FROM study_plans WHERE user_id = ? ORDER BY generated_at')
      .all(user.id) as StudyPlanRow[];

    const partsByAttempt = new Map<string, AttemptPartRow[]>();
    for (const part of parts) {
      const list = partsByAttempt.get(part.attempt_id) ?? [];
      list.push(part);
      partsByAttempt.set(part.attempt_id, list);
    }

    const itemsByAttempt = new Map<string, ExportItemRow[]>();
    for (const item of items) {
      const list = itemsByAttempt.get(item.attempt_id) ?? [];
      list.push(item);
      itemsByAttempt.set(item.attempt_id, list);
    }

    const resultByAttempt = new Map(results.map((row) => [row.attempt_id, row]));

    const payload = {
      format: 'examer.account-export.v1',
      exportedAt: new Date().toISOString(),
      notice:
        'This file contains the data held for one Examer account. Question text and explanations are ' +
        'included so your practice makes sense on its own; that material is original work by the Examer ' +
        'editorial team and is not licensed for republication. Answer keys are included only for ' +
        'practice you have already submitted.',
      account: {
        id: account.id,
        email: account.email,
        displayName: account.display_name,
        role: account.role,
        isGuest: account.is_guest === 1,
        locale: account.locale,
        targetExamKey: account.target_exam_key,
        targetDate: account.target_date,
        weeklyMinutes: account.weekly_minutes,
        declaredUnder16: account.is_minor === 1,
        createdAt: account.created_at,
        updatedAt: account.updated_at,
      },
      attempts: attempts.map((attempt) => {
        const result = resultByAttempt.get(attempt.id);
        const submitted = attempt.status !== 'in_progress';

        return {
          id: attempt.id,
          examKey: attempt.exam_key,
          examConfigVersion: attempt.exam_config_version,
          blueprintId: attempt.blueprint_id,
          mode: attempt.mode,
          status: attempt.status,
          settings: parseJson(attempt.settings_json),
          startedAt: attempt.started_at,
          deadlineAt: attempt.deadline_at,
          submittedAt: attempt.submitted_at,
          parts: (partsByAttempt.get(attempt.id) ?? []).map((part) => ({
            partIndex: part.part_index,
            partKey: part.part_key,
            sectionKey: part.section_key,
            label: part.label,
            timeLimitSeconds: part.time_limit_seconds,
            startedAt: part.started_at,
            deadlineAt: part.deadline_at,
            submittedAt: part.submitted_at,
            status: part.status,
            navigation: parseJson(part.navigation_json),
            routing: parseJson(part.routing_json),
          })),
          items: (itemsByAttempt.get(attempt.id) ?? []).map((item) => ({
            partIndex: item.part_index,
            position: item.position,
            questionId: item.question_id,
            questionVersionId: item.question_version_id,
            question: {
              examKey: item.exam_key,
              sectionKey: item.section_key,
              domain: item.domain_slug,
              skill: item.skill_slug,
              difficulty: item.difficulty,
              responseType: item.response_type,
              stemMarkdown: item.stem_md,
              options: parseJson(item.options_json),
              // Answer keys stay out of anything still in progress.
              ...(submitted
                ? {
                    answerKey: parseJson(item.correct_json),
                    explanationMarkdown: item.explanation_md,
                  }
                : {}),
            },
            yourResponse: parseJson(item.response_json),
            responseStatus: item.response_status,
            isCorrect: item.is_correct === null ? null : item.is_correct === 1,
            pointsEarned: item.points_earned,
            pointsPossible: item.points_possible,
            flagged: item.flagged === 1,
            timeMs: item.time_ms,
            firstSeenAt: item.first_seen_at,
            lastAnsweredAt: item.last_answered_at,
          })),
          result: result
            ? {
                computedAt: result.computed_at,
                rawCorrect: result.raw_correct,
                rawIncorrect: result.raw_incorrect,
                rawOmitted: result.raw_omitted,
                pointsEarned: result.points_earned,
                pointsPossible: result.points_possible,
                accuracy: result.accuracy,
                totalTimeMs: result.total_time_ms,
                perPart: parseJson(result.per_part_json),
                perSkill: parseJson(result.per_skill_json),
                reportedScore: parseJson(result.reported_score_json),
                methodology: parseJson(result.methodology_json),
              }
            : null,
        };
      }),
      bookmarks: bookmarks.map((row) => ({
        questionId: row.question_id,
        examKey: row.exam_key,
        note: row.note,
        createdAt: row.created_at,
      })),
      reviewQueue: reviewQueue.map((row) => ({
        questionId: row.question_id,
        examKey: row.exam_key,
        skill: row.skill_slug,
        lastResult: row.last_result,
        missCount: row.miss_count,
        correctStreak: row.correct_streak,
        intervalDays: row.interval_days,
        dueAt: row.due_at,
        updatedAt: row.updated_at,
      })),
      studyPlans: studyPlans.map((row) => ({
        id: row.id,
        examKey: row.exam_key,
        targetDate: row.target_date,
        weeklyMinutes: row.weekly_minutes,
        plan: parseJson(row.plan_json),
        generatedAt: row.generated_at,
      })),
    };

    const filename = `examer-export-${new Date().toISOString().slice(0, 10)}.json`;

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
