import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { Db } from '@/lib/db';

/**
 * Migration 007 moves the old study plan's single exam date
 * (users.target_date) to the canonical per-exam date (exam_targets), without
 * discarding anything (docs/REDESIGN.md §18.5). Run against a database built
 * from migrations 001 to 006, as a real one would be.
 */

const DIR = path.resolve('db/migrations');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort();

function before007(): Db {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  for (const file of files.filter((f) => f < '007')) db.exec(fs.readFileSync(path.join(DIR, file), 'utf8'));
  return db;
}

const apply007 = (db: Db) => db.exec(fs.readFileSync(path.join(DIR, '007_study_plans.sql'), 'utf8'));

const NOW = '2026-09-01T10:00:00.000Z';

function user(db: Db, id: string, targetDate: string | null, targetExamKey: string | null = null): void {
  db.prepare(
    `INSERT INTO users (id, email, password_hash, display_name, role, is_guest, locale, created_at, updated_at, target_exam_key, target_date, weekly_minutes)
     VALUES (?, ?, 'x', 'Test', 'learner', 0, 'en', ?, ?, ?, ?, 150)`,
  ).run(id, `${id}@example.invalid`, NOW, NOW, targetExamKey, targetDate);
}

function attempt(db: Db, userId: string, examKey: string, createdAt: string): void {
  db.prepare(
    `INSERT INTO attempts (id, user_id, exam_key, exam_config_version, blueprint_id, mode, status, seed, settings_json, started_at, created_at, updated_at)
     VALUES (?, ?, ?, '1', 'practice', 'practice', 'submitted', 's', '{}', ?, ?, ?)`,
  ).run(`${userId}-${examKey}-${createdAt}`, userId, examKey, createdAt, createdAt, createdAt);
}

function target(db: Db, userId: string, examKey: string, score: number | null, date: string | null): void {
  db.prepare(
    'INSERT INTO exam_targets (user_id, exam_key, target_score, target_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
  ).run(userId, examKey, score, date, NOW, NOW);
}

const targets = (db: Db, userId: string) =>
  db
    .prepare('SELECT exam_key AS examKey, target_score AS score, target_date AS date, legacy_plan_date AS legacy FROM exam_targets WHERE user_id = ? ORDER BY exam_key')
    .all(userId);
const userDate = (db: Db, userId: string) =>
  (db.prepare('SELECT target_date AS date FROM users WHERE id = ?').get(userId) as { date: string | null }).date;

describe('migration 007: one exam date per exam', () => {
  it('creates a row for the exam the old plan showed the date for, when there is none', () => {
    const db = before007();
    user(db, 'u1', '2026-12-06');
    attempt(db, 'u1', 'digital-sat', '2026-08-01T09:00:00Z');
    attempt(db, 'u1', 'bocconi-undergraduate', '2026-08-20T09:00:00Z');
    apply007(db);
    // No target exam: the most recent session's exam, as the old page chose.
    expect(targets(db, 'u1')).toEqual([{ examKey: 'bocconi-undergraduate', score: null, date: '2026-12-06', legacy: null }]);
    expect(userDate(db, 'u1')).toBeNull();
  });

  it('prefers the learner’s target exam, and sets the date on a row that has none, keeping the score', () => {
    const db = before007();
    user(db, 'u2', '2026-11-14', 'gmat');
    attempt(db, 'u2', 'digital-sat', '2026-08-20T09:00:00Z');
    target(db, 'u2', 'gmat', 655, null);
    apply007(db);
    expect(targets(db, 'u2')).toEqual([{ examKey: 'gmat', score: 655, date: '2026-11-14', legacy: null }]);
    expect(userDate(db, 'u2')).toBeNull();
  });

  it('keeps a different existing date canonical and the plan’s date for the learner to choose', () => {
    const db = before007();
    user(db, 'u3', '2026-10-10', 'lsat');
    target(db, 'u3', 'lsat', 165, '2026-11-07');
    apply007(db);
    expect(targets(db, 'u3')).toEqual([{ examKey: 'lsat', score: 165, date: '2026-11-07', legacy: '2026-10-10' }]);
    expect(userDate(db, 'u3')).toBeNull();
  });

  it('records no conflict when both dates agree', () => {
    const db = before007();
    user(db, 'u4', '2026-11-07', 'lsat');
    target(db, 'u4', 'lsat', 165, '2026-11-07');
    apply007(db);
    expect(targets(db, 'u4')).toEqual([{ examKey: 'lsat', score: 165, date: '2026-11-07', legacy: null }]);
  });

  it('leaves a date with no exam to attach it to where it was', () => {
    const db = before007();
    user(db, 'u5', '2026-12-01');
    apply007(db);
    expect(targets(db, 'u5')).toEqual([]);
    expect(userDate(db, 'u5')).toBe('2026-12-01');
  });

  it('changes nothing for learners without an old date, and keeps attempts', () => {
    const db = before007();
    user(db, 'u6', null);
    attempt(db, 'u6', 'gre', '2026-08-20T09:00:00Z');
    target(db, 'u6', 'gre', 320, '2027-01-15');
    apply007(db);
    expect(targets(db, 'u6')).toEqual([{ examKey: 'gre', score: 320, date: '2027-01-15', legacy: null }]);
    expect((db.prepare('SELECT COUNT(*) AS n FROM attempts').get() as { n: number }).n).toBe(1);
  });

  it('allows one active plan per learner and exam, and keeps ended ones', () => {
    const db = before007();
    user(db, 'u7', null);
    apply007(db);
    const insert = db.prepare(
      `INSERT INTO plans (id, user_id, exam_key, status, weekly_minutes, session_minutes, starts_on, ends_on, created_at)
       VALUES (?, 'u7', 'gre', ?, 150, 25, '2026-09-01', '2026-10-12', ?)`,
    );
    insert.run('p1', 'ended', NOW);
    insert.run('p2', 'active', NOW);
    expect(() => insert.run('p3', 'active', NOW)).toThrow(/UNIQUE/);
  });
});
