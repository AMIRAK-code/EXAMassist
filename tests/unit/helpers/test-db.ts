import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import type { Db } from '@/lib/db';
import type { AnswerKey, ExamConfig } from '@/lib/assessment/types';

/**
 * Test harness: a real SQLite database with the real migrations applied, and
 * synthetic questions tagged against a real exam configuration.
 *
 * Nothing is mocked. These tests exercise the same SQL, the same transactions
 * and the same scoring path the application uses.
 */

export function createTestDb(): Db {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');

  const dir = path.resolve('db/migrations');
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
    db.exec(fs.readFileSync(path.join(dir, file), 'utf8'));
  }
  return db;
}

export function createUser(db: Db, options: { role?: 'learner' | 'editor' | 'admin'; isGuest?: boolean } = {}): string {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO users (id, email, password_hash, display_name, role, is_guest, locale, created_at, updated_at)
     VALUES (?, ?, 'x', 'Test user', ?, ?, 'en', ?, ?)`,
  ).run(
    id,
    options.isGuest ? null : `${id}@example.invalid`,
    options.role ?? 'learner',
    options.isGuest ? 1 : 0,
    now,
    now,
  );
  return id;
}

export interface SeedOptions {
  /** How many questions to create per domain. */
  perDomain?: number;
  /** Override the answer key for every question (defaults to option "a"). */
  correctOptionId?: string;
  state?: 'published' | 'draft';
}

/**
 * Seeds questions that are valid for a real exam configuration, so selection
 * constraints, section keys and domain slugs all resolve exactly as they do in
 * production.
 */
export function seedQuestions(db: Db, config: ExamConfig, options: SeedOptions = {}): string[] {
  const perDomain = options.perDomain ?? 6;
  const state = options.state ?? 'published';
  const correct = options.correctOptionId ?? 'a';
  const now = new Date().toISOString();
  const ids: string[] = [];

  const difficulties = ['easy', 'medium', 'hard'] as const;

  for (const domain of config.domains) {
    const section = config.sections.find((s) => s.key === domain.sectionKey);
    if (!section) continue;

    for (let index = 0; index < perDomain; index += 1) {
      const questionId = `${domain.slug}-q${index}`;
      const versionId = randomUUID();
      const skill = domain.skills[index % domain.skills.length];
      const answerKey: AnswerKey = { type: 'single_select', optionId: correct };

      db.prepare(
        `INSERT INTO questions (id, exam_key, current_version, state, created_at, updated_at)
         VALUES (?, ?, 1, ?, ?, ?)`,
      ).run(questionId, config.examKey, state, now, now);

      db.prepare(
        `INSERT INTO question_versions (
           id, question_id, version, exam_key, section_key, domain_slug, skill_slug, subskill_slug,
           response_type, difficulty, difficulty_basis, stem_md, instructions_md, options_json,
           correct_json, explanation_md, distractor_rationale_json, estimated_seconds,
           stimulus_id, stimulus_version, accessibility_text, provenance, rights_status,
           author, reviewer, reviewed_at, review_notes, state, content_hash, created_at
         ) VALUES (?, ?, 1, ?, ?, ?, ?, NULL, 'single_select', ?, 'editorial', ?, NULL, ?, ?, ?, NULL, 60,
                   NULL, NULL, NULL, '{}', 'original-owned', 'author', 'reviewer', ?, NULL, ?, ?, ?)`,
      ).run(
        versionId,
        questionId,
        config.examKey,
        section.key,
        domain.slug,
        skill.slug,
        difficulties[index % difficulties.length],
        `Question ${index} for ${domain.name}`,
        JSON.stringify([
          { id: 'a', label: 'A', textMd: 'First option' },
          { id: 'b', label: 'B', textMd: 'Second option' },
          { id: 'c', label: 'C', textMd: 'Third option' },
          { id: 'd', label: 'D', textMd: 'Fourth option' },
        ]),
        JSON.stringify(answerKey),
        'A sufficiently long explanation of why the first option is correct here.',
        now,
        state,
        `hash-${questionId}`,
        now,
      );
      ids.push(questionId);
    }
  }
  return ids;
}

/** Reads the question ids of an attempt in stored order, for order-stability checks. */
export function attemptQuestionOrder(db: Db, attemptId: string): string[] {
  return (
    db
      .prepare(
        'SELECT question_id FROM attempt_items WHERE attempt_id = ? ORDER BY part_index, position',
      )
      .all(attemptId) as Array<{ question_id: string }>
  ).map((row) => row.question_id);
}
