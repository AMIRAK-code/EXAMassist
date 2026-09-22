-- 001_core.sql - core schema for the exam practice platform.
-- Owner: coordinating agent (shared contract). Do not edit an applied
-- migration; add a new numbered migration instead.
--
-- Portability note: this schema targets SQLite but deliberately avoids
-- SQLite-only syntax beyond INTEGER booleans and TEXT timestamps, so it can be
-- ported to PostgreSQL (see docs/ARCHITECTURE.md, "Porting to PostgreSQL").

-- ---------------------------------------------------------------------------
-- Identity
-- ---------------------------------------------------------------------------

CREATE TABLE users (
  id                TEXT PRIMARY KEY,
  email             TEXT UNIQUE,                         -- NULL for guest accounts
  password_hash     TEXT,                                -- NULL for guest accounts
  display_name      TEXT,
  role              TEXT NOT NULL DEFAULT 'learner',     -- learner | editor | admin
  is_guest          INTEGER NOT NULL DEFAULT 0,
  locale            TEXT NOT NULL DEFAULT 'en',
  target_exam_key   TEXT,
  target_date       TEXT,                                -- ISO date, learner supplied
  weekly_minutes    INTEGER,
  is_minor          INTEGER NOT NULL DEFAULT 0,          -- self-declared under 16
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL,
  deleted_at        TEXT
);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_guest_created ON users (is_guest, created_at);

CREATE TABLE sessions (
  id            TEXT PRIMARY KEY,                        -- SHA-256 of the cookie token
  user_id       TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at    TEXT NOT NULL,
  expires_at    TEXT NOT NULL,
  last_seen_at  TEXT NOT NULL
);
CREATE INDEX idx_sessions_user ON sessions (user_id);
CREATE INDEX idx_sessions_expires ON sessions (expires_at);

-- ---------------------------------------------------------------------------
-- Question bank. Published content is immutable: editing creates a new version
-- row, and attempts reference question_versions.id, so historical results can
-- never be changed by later editing.
-- ---------------------------------------------------------------------------

CREATE TABLE stimuli (
  id                  TEXT NOT NULL,
  version             INTEGER NOT NULL,
  exam_key            TEXT NOT NULL,
  kind                TEXT NOT NULL,                     -- passage | chart | table | figure
  title               TEXT,
  body_md             TEXT,
  data_json           TEXT,                              -- underlying data for charts/tables
  accessibility_text  TEXT NOT NULL,
  provenance          TEXT NOT NULL,
  rights_status       TEXT NOT NULL,
  created_at          TEXT NOT NULL,
  PRIMARY KEY (id, version)
);

CREATE TABLE questions (
  id               TEXT PRIMARY KEY,
  exam_key         TEXT NOT NULL,
  current_version  INTEGER NOT NULL DEFAULT 0,
  state            TEXT NOT NULL DEFAULT 'draft',        -- draft|in_review|published|retired|quarantined
  created_at       TEXT NOT NULL,
  updated_at       TEXT NOT NULL
);
CREATE INDEX idx_questions_exam_state ON questions (exam_key, state);

CREATE TABLE question_versions (
  id                         TEXT PRIMARY KEY,           -- immutable handle used by attempts
  question_id                TEXT NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
  version                    INTEGER NOT NULL,
  exam_key                   TEXT NOT NULL,
  section_key                TEXT NOT NULL,
  domain_slug                TEXT NOT NULL,
  skill_slug                 TEXT NOT NULL,
  subskill_slug              TEXT,
  response_type              TEXT NOT NULL,
  difficulty                 TEXT NOT NULL,              -- easy | medium | hard
  difficulty_basis           TEXT NOT NULL,              -- editorial | empirical
  stem_md                    TEXT NOT NULL,
  instructions_md            TEXT,
  options_json               TEXT,                       -- [{ id, label, textMd }]
  correct_json               TEXT NOT NULL,              -- answer key; never sent to a live attempt
  explanation_md             TEXT NOT NULL,
  distractor_rationale_json  TEXT,                       -- { optionId: rationale }
  estimated_seconds          INTEGER NOT NULL,
  stimulus_id                TEXT,
  stimulus_version           INTEGER,
  accessibility_text         TEXT,
  provenance                 TEXT NOT NULL,
  rights_status              TEXT NOT NULL,
  author                     TEXT NOT NULL,
  reviewer                   TEXT,
  reviewed_at                TEXT,
  review_notes               TEXT,
  state                      TEXT NOT NULL,
  content_hash               TEXT NOT NULL,
  created_at                 TEXT NOT NULL,
  UNIQUE (question_id, version)
);
CREATE INDEX idx_qv_pool ON question_versions (exam_key, state, section_key, domain_slug, difficulty);
CREATE INDEX idx_qv_skill ON question_versions (exam_key, skill_slug);
CREATE INDEX idx_qv_question ON question_versions (question_id, version);

-- ---------------------------------------------------------------------------
-- Exam configuration. Rows are immutable; a change means a new version string.
-- ---------------------------------------------------------------------------

CREATE TABLE exam_configs (
  exam_key      TEXT NOT NULL,
  version       TEXT NOT NULL,
  config_json   TEXT NOT NULL,
  content_hash  TEXT NOT NULL,
  published_at  TEXT NOT NULL,
  PRIMARY KEY (exam_key, version)
);

-- ---------------------------------------------------------------------------
-- Attempts
-- ---------------------------------------------------------------------------

CREATE TABLE attempts (
  id                   TEXT PRIMARY KEY,
  user_id              TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  exam_key             TEXT NOT NULL,
  exam_config_version  TEXT NOT NULL,                    -- pinned at creation
  blueprint_id         TEXT NOT NULL,
  mode                 TEXT NOT NULL,                    -- practice | diagnostic | simulation | review
  status               TEXT NOT NULL,                    -- in_progress | submitted | expired | abandoned
  seed                 TEXT NOT NULL,
  settings_json        TEXT NOT NULL,
  started_at           TEXT NOT NULL,
  deadline_at          TEXT,                             -- server-authoritative; NULL = untimed
  submitted_at         TEXT,
  current_part_index   INTEGER NOT NULL DEFAULT 0,
  idempotency_key      TEXT,
  created_at           TEXT NOT NULL,
  updated_at           TEXT NOT NULL
);
CREATE UNIQUE INDEX idx_attempts_idempotency ON attempts (user_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;
CREATE INDEX idx_attempts_user ON attempts (user_id, created_at);
CREATE INDEX idx_attempts_user_status ON attempts (user_id, status);

CREATE TABLE attempt_parts (
  id                  TEXT PRIMARY KEY,
  attempt_id          TEXT NOT NULL REFERENCES attempts (id) ON DELETE CASCADE,
  part_index          INTEGER NOT NULL,
  part_key            TEXT NOT NULL,
  section_key         TEXT NOT NULL,
  label               TEXT NOT NULL,
  time_limit_seconds  INTEGER,
  started_at          TEXT,
  deadline_at         TEXT,                              -- server-authoritative per part
  submitted_at        TEXT,
  status              TEXT NOT NULL,                     -- pending | in_progress | submitted | expired
  navigation_json     TEXT NOT NULL,                     -- resolved navigation policy snapshot
  routing_json        TEXT,                              -- adaptive routing inputs + decision
  UNIQUE (attempt_id, part_index)
);

CREATE TABLE attempt_items (
  id                   TEXT PRIMARY KEY,
  attempt_id           TEXT NOT NULL REFERENCES attempts (id) ON DELETE CASCADE,
  part_index           INTEGER NOT NULL,
  position             INTEGER NOT NULL,
  question_id          TEXT NOT NULL,
  question_version_id  TEXT NOT NULL REFERENCES question_versions (id),
  response_json        TEXT,
  response_status      TEXT NOT NULL DEFAULT 'unanswered',  -- unanswered | answered
  is_correct           INTEGER,                              -- NULL until scored
  points_earned        REAL,
  points_possible      REAL NOT NULL DEFAULT 1,
  flagged              INTEGER NOT NULL DEFAULT 0,
  time_ms              INTEGER NOT NULL DEFAULT 0,
  first_seen_at        TEXT,
  last_answered_at     TEXT,
  UNIQUE (attempt_id, part_index, position)
);
CREATE INDEX idx_items_attempt ON attempt_items (attempt_id, part_index, position);
CREATE INDEX idx_items_question ON attempt_items (question_id);

CREATE TABLE attempt_events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  attempt_id   TEXT NOT NULL REFERENCES attempts (id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  payload_json TEXT,
  created_at   TEXT NOT NULL
);
CREATE INDEX idx_events_attempt ON attempt_events (attempt_id, id);

CREATE TABLE attempt_results (
  attempt_id          TEXT PRIMARY KEY REFERENCES attempts (id) ON DELETE CASCADE,
  computed_at         TEXT NOT NULL,
  raw_correct         INTEGER NOT NULL,
  raw_incorrect       INTEGER NOT NULL,
  raw_omitted         INTEGER NOT NULL,
  points_earned       REAL NOT NULL,
  points_possible     REAL NOT NULL,
  accuracy            REAL NOT NULL,
  total_time_ms       INTEGER NOT NULL,
  per_part_json       TEXT NOT NULL,
  per_skill_json      TEXT NOT NULL,
  reported_score_json TEXT,                              -- only when a documented method exists
  methodology_json    TEXT NOT NULL                      -- official facts vs our approximation
);

-- ---------------------------------------------------------------------------
-- Review, bookmarks, planning
-- ---------------------------------------------------------------------------

CREATE TABLE bookmarks (
  user_id     TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  exam_key    TEXT NOT NULL,
  note        TEXT,
  created_at  TEXT NOT NULL,
  PRIMARY KEY (user_id, question_id)
);

CREATE TABLE review_queue (
  user_id        TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  question_id    TEXT NOT NULL,
  exam_key       TEXT NOT NULL,
  skill_slug     TEXT NOT NULL,
  last_result    TEXT NOT NULL,                          -- correct | incorrect | omitted
  miss_count     INTEGER NOT NULL DEFAULT 0,
  correct_streak INTEGER NOT NULL DEFAULT 0,
  interval_days  INTEGER NOT NULL DEFAULT 1,
  due_at         TEXT NOT NULL,
  updated_at     TEXT NOT NULL,
  PRIMARY KEY (user_id, question_id)
);
CREATE INDEX idx_review_due ON review_queue (user_id, exam_key, due_at);

CREATE TABLE study_plans (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  exam_key       TEXT NOT NULL,
  target_date    TEXT,
  weekly_minutes INTEGER NOT NULL,
  plan_json      TEXT NOT NULL,
  generated_at   TEXT NOT NULL,
  UNIQUE (user_id, exam_key)
);

-- ---------------------------------------------------------------------------
-- Operations
-- ---------------------------------------------------------------------------

CREATE TABLE rate_limits (
  bucket       TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count        INTEGER NOT NULL,
  PRIMARY KEY (bucket, window_start)
);

CREATE TABLE content_flags (
  id                  TEXT PRIMARY KEY,
  question_id         TEXT NOT NULL,
  question_version_id TEXT,
  user_id             TEXT,
  reason              TEXT NOT NULL,
  details             TEXT,
  status              TEXT NOT NULL DEFAULT 'open',      -- open | accepted | rejected
  resolution          TEXT,
  created_at          TEXT NOT NULL,
  resolved_at         TEXT
);
CREATE INDEX idx_flags_status ON content_flags (status, created_at);

CREATE TABLE audit_log (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_user_id  TEXT,
  action         TEXT NOT NULL,
  entity_type    TEXT NOT NULL,
  entity_id      TEXT NOT NULL,
  payload_json   TEXT,
  created_at     TEXT NOT NULL
);
CREATE INDEX idx_audit_entity ON audit_log (entity_type, entity_id, id);
