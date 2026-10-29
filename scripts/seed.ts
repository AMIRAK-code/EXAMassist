import { loadEnvConfig } from '@next/env';
import { randomUUID } from 'node:crypto';
import { getDb } from '../src/lib/db';
import { migrate } from '../src/lib/db/migrate';
import { contentHash, loadContent, summariseCoverage } from '../src/lib/content/loader';
import { servableQuestionTranslations, servableStimulusTranslations, withoutTranslations } from '../src/lib/content/translations';
import { EXAM_CONFIGS, getExamConfig } from '../src/lib/exams/registry';
import { hashPassword } from '../src/lib/auth/password';
import { planSeed, stimulusColumns, versionColumns, type ExistingVersion } from '../src/lib/content/seed-plan';
import { humanApprovedCount } from '../src/lib/content/human-review';
import type { QuestionVersionRow, StimulusRow } from '../src/lib/db/rows';

loadEnvConfig(process.cwd(), true);

/**
 * Seeds exam configurations and the reviewed question bank into the database.
 *
 * Idempotent: re-running updates existing rows in place and never duplicates a
 * question. Published content is versioned, so editing a published question in
 * its JSON file creates a NEW version rather than mutating the old one - past
 * attempts keep pointing at exactly what the learner saw.
 */

async function main(): Promise<void> {
  const db = getDb();
  (await migrate(db));

  const now = new Date().toISOString();

  // --- Exam configurations -------------------------------------------------
  let configsWritten = 0;
  for (const config of EXAM_CONFIGS) {
    const hash = contentHash(config);
    const existing = (await db
      .prepare('SELECT content_hash FROM exam_configs WHERE exam_key = ? AND version = ?')
      .get(config.examKey, config.version)) as { content_hash: string } | undefined;

    if (!existing) {
      (await db.prepare(
        'INSERT INTO exam_configs (exam_key, version, config_json, content_hash, published_at) VALUES (?, ?, ?, ?, ?)',
      ).run(config.examKey, config.version, JSON.stringify(config), hash, now));
      configsWritten += 1;
    } else if (existing.content_hash !== hash) {
      // A published config version is meant to be immutable. Overwriting it
      // would silently change what historical attempts claim to have run.
      console.warn(
        `WARNING  ${config.examKey}@${config.version} has changed since it was seeded. ` +
          'Bump the version string instead of editing a published configuration.',
      );
      (await db.prepare(
        'UPDATE exam_configs SET config_json = ?, content_hash = ?, published_at = ? WHERE exam_key = ? AND version = ?',
      ).run(JSON.stringify(config), hash, now, config.examKey, config.version));
      configsWritten += 1;
    }
  }
  console.log(`exam configurations: ${configsWritten} written, ${EXAM_CONFIGS.length} total`);

  // --- Content -------------------------------------------------------------
  const loaded = loadContent();
  const { issues } = loaded;
  // Content for a draft config (DRAFT_EXAM_CONFIGS) is validated but never
  // seeded: its exam is not live, so nothing may serve it.
  const live = (examKey: string) => getExamConfig(examKey) !== undefined;
  const questions = loaded.questions.filter((q) => live(q.question.examKey));
  const stimuli = loaded.stimuli.filter((s) => live(s.stimulus.examKey));
  const heldBack = loaded.questions.length - questions.length;
  if (heldBack > 0) console.log(`draft-exam questions held back from seeding: ${heldBack}`);
  const errors = issues.filter((i) => i.level === 'error');
  if (errors.length > 0) {
    console.error(`\nRefusing to seed: ${errors.length} content error(s).`);
    for (const issue of errors.slice(0, 30)) {
      console.error(`  ${issue.file}  [${issue.code}] ${issue.message}`);
    }
    if (errors.length > 30) console.error(`  ... and ${errors.length - 30} more`);
    console.error('\nRun `npm run content:validate` for the full report.');
    process.exit(1);
  }

  // What this run would change, worked out before writing anything
  // (src/lib/content/seed-plan.ts): each version's content fingerprint, which
  // human approvals it would void, and any rewrite of a version that learners'
  // attempts already point at, which is refused.
  const stimulusRows = (await db.prepare('SELECT * FROM stimuli').all()) as StimulusRow[];
  const stimulusByKey = new Map(stimulusRows.map((row) => [`${row.id}@${row.version}`, row]));
  const existing = new Map<string, ExistingVersion>(
    ((await db.prepare('SELECT * FROM question_versions').all()) as QuestionVersionRow[]).map((row) => [
      `${row.question_id}@${row.version}`,
      { row, stimulus: row.stimulus_id ? stimulusByKey.get(`${row.stimulus_id}@${row.stimulus_version}`) ?? null : null },
    ]),
  );
  const inAttempts = new Set(
    ((await db.prepare('SELECT DISTINCT question_version_id AS id FROM attempt_items').all()) as Array<{ id: string }>).map((r) => r.id),
  );
  const previousStates = new Map(
    ((await db.prepare('SELECT id, state FROM questions').all()) as Array<{ id: string; state: string }>).map((r) => [r.id, r.state]),
  );
  const plan = planSeed(
    questions.map((q) => q.question),
    stimuli.map((s) => s.stimulus),
    existing,
    inAttempts,
  );
  if (plan.conflicts.length > 0) {
    console.error(`\nRefusing to seed: ${plan.conflicts.length} version(s) would rewrite what learners were shown.`);
    for (const conflict of plan.conflicts.slice(0, 30)) console.error(`  ${conflict.message}`);
    process.exit(1);
  }
  const fingerprints = new Map(plan.questions.map((p) => [p.question.id, p]));
  const audit = async (action: string, entityId: string, payload: unknown) => {
    (await db.prepare(
      `INSERT INTO audit_log (actor_user_id, action, entity_type, entity_id, payload_json, created_at)
       VALUES (NULL, ?, 'question', ?, ?, ?)`,
    ).run(action, entityId, JSON.stringify({ source: 'seed', ...(payload as object) }), now));
  };

  const seedAll = db.transaction(async () => {
    for (const { stimulus } of stimuli) {
      (await db.prepare(
        `INSERT INTO stimuli (id, version, exam_key, kind, title, body_md, data_json,
                              accessibility_text, provenance, rights_status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id, version) DO UPDATE SET
           kind = excluded.kind, title = excluded.title, body_md = excluded.body_md,
           data_json = excluded.data_json, accessibility_text = excluded.accessibility_text`,
      ).run(...Object.values(stimulusColumns(stimulus)), now));
      // Checked translations only (src/lib/content/translations.ts).
      const stimulusTranslations = servableStimulusTranslations(stimulus);
      (await db.prepare('UPDATE stimuli SET translations_json = ? WHERE id = ? AND version = ?').run(
        stimulusTranslations ? JSON.stringify(stimulusTranslations) : null,
        stimulus.id,
        stimulus.version,
      ));
    }

    for (const { question } of questions) {
      const planned = fingerprints.get(question.id)!;
      (await db.prepare(
        `INSERT INTO questions (id, exam_key, current_version, state, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           exam_key = excluded.exam_key,
           current_version = excluded.current_version,
           state = excluded.state,
           updated_at = excluded.updated_at`,
      ).run(question.id, question.examKey, question.version, question.state, now, now));

      const hash = contentHash(withoutTranslations(question));
      const existing = (await db
        .prepare('SELECT id, content_hash FROM question_versions WHERE question_id = ? AND version = ?')
        .get(question.id, question.version)) as { id: string; content_hash: string } | undefined;

      if (existing && existing.content_hash !== hash && question.state === 'published') {
        console.warn(
          `WARNING  ${question.id} v${question.version} is published but its content changed. ` +
            'Increment "version" so earlier attempts keep the text they were shown.',
        );
      }

      // In the column order of the statements below (src/lib/content/seed-plan.ts).
      const row = Object.values(versionColumns(question, hash, planned.fingerprint));

      if (existing) {
        (await db.prepare(
          `UPDATE question_versions SET
             exam_key = ?, section_key = ?, domain_slug = ?, skill_slug = ?, subskill_slug = ?,
             response_type = ?, difficulty = ?, difficulty_basis = ?, stem_md = ?, instructions_md = ?,
             options_json = ?, correct_json = ?, explanation_md = ?, distractor_rationale_json = ?,
             estimated_seconds = ?, stimulus_id = ?, stimulus_version = ?, accessibility_text = ?,
             provenance = ?, rights_status = ?, author = ?, reviewer = ?, reviewed_at = ?,
             review_notes = ?, state = ?, content_hash = ?, review_fingerprint = ?
           WHERE id = ?`,
        ).run(...row, existing.id));
      } else {
        (await db.prepare(
          `INSERT INTO question_versions (
             id, question_id, version, exam_key, section_key, domain_slug, skill_slug, subskill_slug,
             response_type, difficulty, difficulty_basis, stem_md, instructions_md, options_json,
             correct_json, explanation_md, distractor_rationale_json, estimated_seconds,
             stimulus_id, stimulus_version, accessibility_text, provenance, rights_status,
             author, reviewer, reviewed_at, review_notes, state, content_hash, review_fingerprint, created_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ).run(randomUUID(), question.id, question.version, ...row, now));
      }

      // The audit trail of publication decisions and content changes
      // (shown on the admin review page beside the review history).
      const previousState = previousStates.get(question.id) ?? null;
      if (planned.isNewVersion) {
        (await audit('question.version_added', question.id, { version: question.version, state: question.state, fingerprint: planned.fingerprint }));
      } else if (planned.contentChanged) {
        (await audit('question.content_changed', question.id, {
          version: question.version,
          previousFingerprint: planned.previousFingerprint,
          fingerprint: planned.fingerprint,
          note: 'Human approvals of the previous content no longer apply.',
        }));
      }
      if (previousState !== question.state) {
        (await audit('question.state_changed', question.id, { version: question.version, from: previousState, to: question.state }));
      }
      // Checked translations only, refreshed on every seed without a new version.
      const translations = servableQuestionTranslations(question);
      (await db.prepare('UPDATE question_versions SET translations_json = ? WHERE question_id = ? AND version = ?').run(
        translations ? JSON.stringify(translations) : null,
        question.id,
        question.version,
      ));
    }
  });
  (await seedAll());

  console.log(`stimuli:   ${stimuli.length} seeded`);
  console.log(`questions: ${questions.length} seeded`);

  // --- Optional administrator ---------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const existing = (await db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail)) as
      | { id: string }
      | undefined;
    const hash = await hashPassword(adminPassword);
    if (existing) {
      (await db.prepare("UPDATE users SET password_hash = ?, role = 'admin', updated_at = ? WHERE id = ?").run(
        hash,
        now,
        existing.id,
      ));
      console.log(`admin:     updated ${adminEmail}`);
    } else {
      (await db.prepare(
        `INSERT INTO users (id, email, password_hash, display_name, role, is_guest, locale, created_at, updated_at)
         VALUES (?, ?, ?, 'Administrator', 'admin', 0, 'en', ?, ?)`,
      ).run(randomUUID(), adminEmail, hash, now, now));
      console.log(`admin:     created ${adminEmail}`);
    }
  } else {
    console.log('admin:     skipped (set ADMIN_EMAIL and ADMIN_PASSWORD to create one)');
  }

  // --- Coverage ------------------------------------------------------------
  // "published" is what the content files say: the automated gates passed.
  // Only "approved" is served: published AND a standing human approval of the
  // current content (src/lib/content/human-review.ts).
  console.log('\nContent coverage by exam');
  console.log('exam                      published  approved  draft  review  quarantined  domains');
  for (const row of summariseCoverage(questions).filter((r) => !r.draftConfig)) {
    console.log(
      `  ${row.examKey.padEnd(24)}${String(row.published).padStart(6)}` +
        `${String(await humanApprovedCount(db, [row.examKey])).padStart(10)}` +
        `${String(row.draft).padStart(8)}${String(row.inReview).padStart(8)}` +
        `${String(row.quarantined).padStart(13)}` +
        `${String(`${row.domainsCovered}/${row.domainsTotal}`).padStart(10)}`,
    );
  }

  const warnings = issues.filter((i) => i.level === 'warning');
  if (warnings.length > 0) console.log(`\n${warnings.length} content warning(s) - see npm run content:validate`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
