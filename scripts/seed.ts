import { randomUUID } from 'node:crypto';
import { getDb } from '../src/lib/db';
import { migrate } from '../src/lib/db/migrate';
import { contentHash, loadContent, summariseCoverage } from '../src/lib/content/loader';
import { EXAM_CONFIGS } from '../src/lib/exams/registry';
import { hashPassword } from '../src/lib/auth/password';

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
  migrate(db);

  const now = new Date().toISOString();

  // --- Exam configurations -------------------------------------------------
  let configsWritten = 0;
  for (const config of EXAM_CONFIGS) {
    const hash = contentHash(config);
    const existing = db
      .prepare('SELECT content_hash FROM exam_configs WHERE exam_key = ? AND version = ?')
      .get(config.examKey, config.version) as { content_hash: string } | undefined;

    if (!existing) {
      db.prepare(
        'INSERT INTO exam_configs (exam_key, version, config_json, content_hash, published_at) VALUES (?, ?, ?, ?, ?)',
      ).run(config.examKey, config.version, JSON.stringify(config), hash, now);
      configsWritten += 1;
    } else if (existing.content_hash !== hash) {
      // A published config version is meant to be immutable. Overwriting it
      // would silently change what historical attempts claim to have run.
      console.warn(
        `WARNING  ${config.examKey}@${config.version} has changed since it was seeded. ` +
          'Bump the version string instead of editing a published configuration.',
      );
      db.prepare(
        'UPDATE exam_configs SET config_json = ?, content_hash = ?, published_at = ? WHERE exam_key = ? AND version = ?',
      ).run(JSON.stringify(config), hash, now, config.examKey, config.version);
      configsWritten += 1;
    }
  }
  console.log(`exam configurations: ${configsWritten} written, ${EXAM_CONFIGS.length} total`);

  // --- Content -------------------------------------------------------------
  const { questions, stimuli, issues } = loadContent();
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

  const seedAll = db.transaction(() => {
    for (const { stimulus } of stimuli) {
      db.prepare(
        `INSERT INTO stimuli (id, version, exam_key, kind, title, body_md, data_json,
                              accessibility_text, provenance, rights_status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id, version) DO UPDATE SET
           kind = excluded.kind, title = excluded.title, body_md = excluded.body_md,
           data_json = excluded.data_json, accessibility_text = excluded.accessibility_text`,
      ).run(
        stimulus.id,
        stimulus.version,
        stimulus.examKey,
        stimulus.kind,
        stimulus.title,
        stimulus.bodyMd,
        stimulus.data ? JSON.stringify(stimulus.data) : null,
        stimulus.accessibilityText,
        JSON.stringify(stimulus.provenance),
        stimulus.rightsStatus,
        now,
      );
    }

    for (const { question } of questions) {
      db.prepare(
        `INSERT INTO questions (id, exam_key, current_version, state, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           exam_key = excluded.exam_key,
           current_version = excluded.current_version,
           state = excluded.state,
           updated_at = excluded.updated_at`,
      ).run(question.id, question.examKey, question.version, question.state, now, now);

      const hash = contentHash(question);
      const existing = db
        .prepare('SELECT id, content_hash FROM question_versions WHERE question_id = ? AND version = ?')
        .get(question.id, question.version) as { id: string; content_hash: string } | undefined;

      if (existing && existing.content_hash !== hash && question.state === 'published') {
        console.warn(
          `WARNING  ${question.id} v${question.version} is published but its content changed. ` +
            'Increment "version" so earlier attempts keep the text they were shown.',
        );
      }

      const row = [
        question.examKey,
        question.sectionKey,
        question.domainSlug,
        question.skillSlug,
        question.subskillSlug,
        question.responseType,
        question.difficulty,
        question.difficultyBasis,
        question.stemMd,
        question.instructionsMd,
        question.options.length > 0 ? JSON.stringify(question.options) : null,
        JSON.stringify(question.answerKey),
        question.explanationMd,
        Object.keys(question.distractorRationale).length > 0
          ? JSON.stringify(question.distractorRationale)
          : null,
        question.estimatedSeconds,
        question.stimulusRef?.id ?? null,
        question.stimulusRef?.version ?? null,
        question.accessibilityText,
        JSON.stringify(question.provenance),
        question.rightsStatus,
        question.review.author,
        question.review.reviewer,
        question.review.reviewedOn,
        question.review.notes,
        question.state,
        hash,
      ];

      if (existing) {
        db.prepare(
          `UPDATE question_versions SET
             exam_key = ?, section_key = ?, domain_slug = ?, skill_slug = ?, subskill_slug = ?,
             response_type = ?, difficulty = ?, difficulty_basis = ?, stem_md = ?, instructions_md = ?,
             options_json = ?, correct_json = ?, explanation_md = ?, distractor_rationale_json = ?,
             estimated_seconds = ?, stimulus_id = ?, stimulus_version = ?, accessibility_text = ?,
             provenance = ?, rights_status = ?, author = ?, reviewer = ?, reviewed_at = ?,
             review_notes = ?, state = ?, content_hash = ?
           WHERE id = ?`,
        ).run(...row, existing.id);
      } else {
        db.prepare(
          `INSERT INTO question_versions (
             id, question_id, version, exam_key, section_key, domain_slug, skill_slug, subskill_slug,
             response_type, difficulty, difficulty_basis, stem_md, instructions_md, options_json,
             correct_json, explanation_md, distractor_rationale_json, estimated_seconds,
             stimulus_id, stimulus_version, accessibility_text, provenance, rights_status,
             author, reviewer, reviewed_at, review_notes, state, content_hash, created_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ).run(randomUUID(), question.id, question.version, ...row, now);
      }
    }
  });
  seedAll();

  console.log(`stimuli:   ${stimuli.length} seeded`);
  console.log(`questions: ${questions.length} seeded`);

  // --- Optional administrator ---------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail) as
      | { id: string }
      | undefined;
    const hash = await hashPassword(adminPassword);
    if (existing) {
      db.prepare("UPDATE users SET password_hash = ?, role = 'admin', updated_at = ? WHERE id = ?").run(
        hash,
        now,
        existing.id,
      );
      console.log(`admin:     updated ${adminEmail}`);
    } else {
      db.prepare(
        `INSERT INTO users (id, email, password_hash, display_name, role, is_guest, locale, created_at, updated_at)
         VALUES (?, ?, ?, 'Administrator', 'admin', 0, 'en', ?, ?)`,
      ).run(randomUUID(), adminEmail, hash, now, now);
      console.log(`admin:     created ${adminEmail}`);
    }
  } else {
    console.log('admin:     skipped (set ADMIN_EMAIL and ADMIN_PASSWORD to create one)');
  }

  // --- Coverage ------------------------------------------------------------
  console.log('\nContent coverage by exam');
  console.log('exam                      published  draft  review  quarantined  domains');
  for (const row of summariseCoverage(questions)) {
    console.log(
      `  ${row.examKey.padEnd(24)}${String(row.published).padStart(6)}` +
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
