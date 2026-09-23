-- 002_exam_targets.sql
--
-- A learner's goal for a specific exam.
--
-- Kept in its own table rather than on `users` because a learner can genuinely
-- be preparing for more than one exam at a time (an applicant taking both the
-- SAT and the Bocconi test is the common case for this audience), and because
-- the target is per-exam by nature: 1400 means nothing without "on the SAT".
--
-- The score is stored on the exam's OWN reported scale, as the learner states
-- it. We never convert it into anything, and we never infer it.

CREATE TABLE exam_targets (
  user_id      TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  exam_key     TEXT NOT NULL,
  -- On the exam's own published scale (SAT 400-1600, LSAT 120-180, Bocconi
  -- raw points out of 50, and so on). NULL means "practising, no target set".
  target_score REAL,
  -- The learner's own exam date, if they have one. Drives the study plan.
  target_date  TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  PRIMARY KEY (user_id, exam_key)
);

CREATE INDEX idx_exam_targets_user ON exam_targets (user_id);
