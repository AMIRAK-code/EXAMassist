-- ---------------------------------------------------------------------------
-- 007: stored study plans with dated sessions, and one exam date per exam.
--
-- Before this, the study plan was recomputed on every visit from
-- users.target_date and users.weekly_minutes, and nothing about it was kept.
-- Now a plan is created, and later adjusted, only when the learner asks, and
-- each session keeps its state (docs/REDESIGN.md §18.5):
--
--   planned    scheduled, not yet satisfied, and its day not over
--   completed  satisfied by a finished session (plan_sessions.attempt_id)
--   missed     recorded when the learner adjusts the plan; before that a
--              planned session whose day is over is shown as missed
--   skipped    the learner chose to skip it
--
-- The table study_plans (001) was never written; it is left as it is.
-- ---------------------------------------------------------------------------

CREATE TABLE plans (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  exam_key        TEXT NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('active', 'ended')),
  weekly_minutes  INTEGER NOT NULL,
  session_minutes INTEGER NOT NULL,
  starts_on       TEXT NOT NULL,          -- ISO date
  ends_on         TEXT NOT NULL,          -- ISO date of the last planned day
  exam_date       TEXT,                   -- the exam date the plan was built for
  created_at      TEXT NOT NULL,
  adjusted_at     TEXT,                   -- the last adjustment the learner applied
  ended_at        TEXT,
  version         INTEGER NOT NULL DEFAULT 1  -- bumped on every change; a preview applies only to its version
);
-- One active plan per learner and exam; ended plans are kept as history.
CREATE UNIQUE INDEX idx_plans_active ON plans (user_id, exam_key) WHERE status = 'active';
CREATE INDEX idx_plans_user ON plans (user_id, created_at);

CREATE TABLE plan_sessions (
  id             TEXT PRIMARY KEY,
  plan_id        TEXT NOT NULL REFERENCES plans (id) ON DELETE CASCADE,
  user_id        TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  scheduled_on   TEXT NOT NULL,           -- ISO date
  sequence       INTEGER NOT NULL,        -- order within the plan
  kind           TEXT NOT NULL CHECK (kind IN ('new', 'revision', 'review', 'mixed')),
  domain_slug    TEXT,
  skill_slug     TEXT,
  question_count INTEGER NOT NULL,
  minutes        INTEGER NOT NULL,
  reason         TEXT NOT NULL,           -- why the plan chose it, in words
  status         TEXT NOT NULL CHECK (status IN ('planned', 'completed', 'missed', 'skipped')),
  attempt_id     TEXT REFERENCES attempts (id) ON DELETE SET NULL,  -- started from here, or the one that satisfied it
  status_at      TEXT,                    -- when it was completed, skipped or recorded as missed
  created_at     TEXT NOT NULL
);
CREATE INDEX idx_plan_sessions_plan ON plan_sessions (plan_id, scheduled_on, sequence);
CREATE INDEX idx_plan_sessions_attempt ON plan_sessions (attempt_id);

-- ---------------------------------------------------------------------------
-- One exam date: exam_targets.target_date, per exam, beside the target score.
--
-- users.target_date was one date per learner, written by the old study plan
-- and tied to no exam. It is carried to the exam the old plan showed it for:
-- users.target_exam_key if set, else the learner's most recent session's
-- exam (the old page's own rule). Nothing is discarded:
--   no row for that exam        -> a row with the date and no score
--   a row without a date        -> the date is set
--   a row with a different date -> that date stays canonical; the plan's is
--                                  kept in legacy_plan_date until the learner
--                                  chooses between them
-- A date with no exam to attach it to stays in users.target_date, which is no
-- longer written; the plan's setup offers it when the learner first plans.
-- ---------------------------------------------------------------------------

ALTER TABLE exam_targets ADD COLUMN legacy_plan_date TEXT;

CREATE TEMP TABLE carried_dates AS
SELECT u.id AS user_id,
       COALESCE(
         u.target_exam_key,
         (SELECT a.exam_key FROM attempts a WHERE a.user_id = u.id ORDER BY a.created_at DESC LIMIT 1)
       ) AS exam_key,
       u.target_date AS plan_date
  FROM users u
 WHERE u.target_date IS NOT NULL;

DELETE FROM carried_dates WHERE exam_key IS NULL;

INSERT INTO exam_targets (user_id, exam_key, target_score, target_date, created_at, updated_at)
SELECT c.user_id, c.exam_key, NULL, c.plan_date,
       strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  FROM carried_dates c
 WHERE NOT EXISTS (SELECT 1 FROM exam_targets t WHERE t.user_id = c.user_id AND t.exam_key = c.exam_key);

UPDATE exam_targets
   SET target_date = (SELECT c.plan_date FROM carried_dates c
                       WHERE c.user_id = exam_targets.user_id AND c.exam_key = exam_targets.exam_key),
       updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
 WHERE target_date IS NULL
   AND EXISTS (SELECT 1 FROM carried_dates c WHERE c.user_id = exam_targets.user_id AND c.exam_key = exam_targets.exam_key);

UPDATE exam_targets
   SET legacy_plan_date = (SELECT c.plan_date FROM carried_dates c
                            WHERE c.user_id = exam_targets.user_id AND c.exam_key = exam_targets.exam_key)
 WHERE target_date IS NOT NULL
   AND EXISTS (SELECT 1 FROM carried_dates c
                WHERE c.user_id = exam_targets.user_id AND c.exam_key = exam_targets.exam_key
                  AND c.plan_date <> exam_targets.target_date);

-- Carried dates are cleared from users so each one lives in one place; a date
-- that could not be attached to an exam stays where it was.
UPDATE users SET target_date = NULL
 WHERE id IN (SELECT user_id FROM carried_dates);

DROP TABLE carried_dates;
