-- PostgreSQL bootstrap for EXAMassist. Private schema; no Data API grants.
BEGIN;
CREATE SCHEMA examer;
SET LOCAL search_path TO examer, pg_catalog;
CREATE TABLE users (
  id                TEXT PRIMARY KEY,
  email             TEXT UNIQUE,                         -- NULL for guest accounts
  password_hash     TEXT,                                -- NULL for guest accounts
  display_name      TEXT,
  role              TEXT NOT NULL DEFAULT 'learner',     -- learner | editor | admin
  is_guest          BIGINT NOT NULL DEFAULT 0,
  locale            TEXT NOT NULL DEFAULT 'en',
  target_exam_key   TEXT,
  target_date       TEXT,                                -- ISO date, learner supplied
  weekly_minutes    BIGINT,
  is_minor          BIGINT NOT NULL DEFAULT 0,          -- self-declared under 16
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL,
  deleted_at        TEXT
, email_verified_at TEXT);

CREATE TABLE sessions (
  id            TEXT PRIMARY KEY,                        -- SHA-256 of the cookie token
  user_id       TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  created_at    TEXT NOT NULL,
  expires_at    TEXT NOT NULL,
  last_seen_at  TEXT NOT NULL
);

CREATE TABLE stimuli (
  id                  TEXT NOT NULL,
  version             BIGINT NOT NULL,
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
  current_version  BIGINT NOT NULL DEFAULT 0,
  state            TEXT NOT NULL DEFAULT 'draft',        -- draft|in_review|published|retired|quarantined
  created_at       TEXT NOT NULL,
  updated_at       TEXT NOT NULL
);

CREATE TABLE question_versions (
  id                         TEXT PRIMARY KEY,           -- immutable handle used by attempts
  question_id                TEXT NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
  version                    BIGINT NOT NULL,
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
  estimated_seconds          BIGINT NOT NULL,
  stimulus_id                TEXT,
  stimulus_version           BIGINT,
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

CREATE TABLE exam_configs (
  exam_key      TEXT NOT NULL,
  version       TEXT NOT NULL,
  config_json   TEXT NOT NULL,
  content_hash  TEXT NOT NULL,
  published_at  TEXT NOT NULL,
  PRIMARY KEY (exam_key, version)
);

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
  current_part_index   BIGINT NOT NULL DEFAULT 0,
  idempotency_key      TEXT,
  created_at           TEXT NOT NULL,
  updated_at           TEXT NOT NULL
, resume_part_index BIGINT, resume_position BIGINT, resume_clock BIGINT, resume_saved_at TEXT);

CREATE TABLE attempt_parts (
  id                  TEXT PRIMARY KEY,
  attempt_id          TEXT NOT NULL REFERENCES attempts (id) ON DELETE CASCADE,
  part_index          BIGINT NOT NULL,
  part_key            TEXT NOT NULL,
  section_key         TEXT NOT NULL,
  label               TEXT NOT NULL,
  time_limit_seconds  BIGINT,
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
  part_index           BIGINT NOT NULL,
  position             BIGINT NOT NULL,
  question_id          TEXT NOT NULL,
  question_version_id  TEXT NOT NULL REFERENCES question_versions (id),
  response_json        TEXT,
  response_status      TEXT NOT NULL DEFAULT 'unanswered',  -- unanswered | answered
  is_correct           BIGINT,                              -- NULL until scored
  points_earned        DOUBLE PRECISION,
  points_possible      DOUBLE PRECISION NOT NULL DEFAULT 1,
  flagged              BIGINT NOT NULL DEFAULT 0,
  time_ms              BIGINT NOT NULL DEFAULT 0,
  first_seen_at        TEXT,
  last_answered_at     TEXT, feedback_released_at TEXT, response_clock BIGINT,
  UNIQUE (attempt_id, part_index, position)
);

CREATE TABLE attempt_events (
  id           BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  attempt_id   TEXT NOT NULL REFERENCES attempts (id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  payload_json TEXT,
  created_at   TEXT NOT NULL
);

CREATE TABLE attempt_results (
  attempt_id          TEXT PRIMARY KEY REFERENCES attempts (id) ON DELETE CASCADE,
  computed_at         TEXT NOT NULL,
  raw_correct         BIGINT NOT NULL,
  raw_incorrect       BIGINT NOT NULL,
  raw_omitted         BIGINT NOT NULL,
  points_earned       DOUBLE PRECISION NOT NULL,
  points_possible     DOUBLE PRECISION NOT NULL,
  accuracy            DOUBLE PRECISION NOT NULL,
  total_time_ms       BIGINT NOT NULL,
  per_part_json       TEXT NOT NULL,
  per_skill_json      TEXT NOT NULL,
  reported_score_json TEXT,                              -- only when a documented method exists
  methodology_json    TEXT NOT NULL                      -- official facts vs our approximation
);

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
  miss_count     BIGINT NOT NULL DEFAULT 0,
  correct_streak BIGINT NOT NULL DEFAULT 0,
  interval_days  BIGINT NOT NULL DEFAULT 1,
  due_at         TEXT NOT NULL,
  updated_at     TEXT NOT NULL,
  PRIMARY KEY (user_id, question_id)
);

CREATE TABLE study_plans (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  exam_key       TEXT NOT NULL,
  target_date    TEXT,
  weekly_minutes BIGINT NOT NULL,
  plan_json      TEXT NOT NULL,
  generated_at   TEXT NOT NULL,
  UNIQUE (user_id, exam_key)
);

CREATE TABLE rate_limits (
  bucket       TEXT NOT NULL,
  window_start BIGINT NOT NULL,
  count        BIGINT NOT NULL,
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
, tutor_response_id TEXT);

CREATE TABLE audit_log (
  id             BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  actor_user_id  TEXT,
  action         TEXT NOT NULL,
  entity_type    TEXT NOT NULL,
  entity_id      TEXT NOT NULL,
  payload_json   TEXT,
  created_at     TEXT NOT NULL
);

CREATE TABLE exam_targets (
  user_id      TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  exam_key     TEXT NOT NULL,
  -- On the exam's own published scale (SAT 400-1600, LSAT 120-180, Bocconi
  -- raw points out of 50, and so on). NULL means "practising, no target set".
  target_score DOUBLE PRECISION,
  -- The learner's own exam date, if they have one. Drives the study plan.
  target_date  TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL, legacy_plan_date TEXT,
  PRIMARY KEY (user_id, exam_key)
);

CREATE TABLE mistake_labels (
  attempt_item_id TEXT NOT NULL REFERENCES attempt_items (id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  label           TEXT NOT NULL,
  created_at      TEXT NOT NULL,
  PRIMARY KEY (attempt_item_id, label)
);

CREATE TABLE plans (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  exam_key        TEXT NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('active', 'ended')),
  weekly_minutes  BIGINT NOT NULL,
  session_minutes BIGINT NOT NULL,
  starts_on       TEXT NOT NULL,          -- ISO date
  ends_on         TEXT NOT NULL,          -- ISO date of the last planned day
  exam_date       TEXT,                   -- the exam date the plan was built for
  created_at      TEXT NOT NULL,
  adjusted_at     TEXT,                   -- the last adjustment the learner applied
  ended_at        TEXT,
  version         BIGINT NOT NULL DEFAULT 1  -- bumped on every change; a preview applies only to its version
);

CREATE TABLE plan_sessions (
  id             TEXT PRIMARY KEY,
  plan_id        TEXT NOT NULL REFERENCES plans (id) ON DELETE CASCADE,
  user_id        TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  scheduled_on   TEXT NOT NULL,           -- ISO date
  sequence       BIGINT NOT NULL,        -- order within the plan
  kind           TEXT NOT NULL CHECK (kind IN ('new', 'revision', 'review', 'mixed')),
  domain_slug    TEXT,
  skill_slug     TEXT,
  question_count BIGINT NOT NULL,
  minutes        BIGINT NOT NULL,
  reason         TEXT NOT NULL,           -- why the plan chose it, in words
  status         TEXT NOT NULL CHECK (status IN ('planned', 'completed', 'missed', 'skipped')),
  attempt_id     TEXT REFERENCES attempts (id) ON DELETE SET NULL,  -- started from here, or the one that satisfied it
  status_at      TEXT,                    -- when it was completed, skipped or recorded as missed
  created_at     TEXT NOT NULL
);

CREATE TABLE tutor_responses (
  id                  TEXT PRIMARY KEY,
  -- 'hint' | 'explain' | 'debrief'
  kind                TEXT NOT NULL,
  -- What the response is about, so a cached answer is reused only for the
  -- identical request. For hints and explanations this is the question
  -- version plus the variant (hint level, or the option the learner chose);
  -- for a debrief it is the attempt.
  cache_key           TEXT NOT NULL,
  question_id         TEXT,
  question_version_id TEXT,
  attempt_id          TEXT,
  user_id             TEXT REFERENCES users (id) ON DELETE CASCADE,
  model               TEXT NOT NULL,
  body_md             TEXT NOT NULL,
  input_tokens        BIGINT NOT NULL DEFAULT 0,
  output_tokens       BIGINT NOT NULL DEFAULT 0,
  created_at          TEXT NOT NULL,
  -- Set when an editor withdraws a response after a report. A withdrawn
  -- response is never served again; the next request generates a new one.
  withdrawn_at        TEXT
);

CREATE TABLE tutor_usage (
  id           BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id      TEXT REFERENCES users (id) ON DELETE CASCADE,
  kind         TEXT NOT NULL,
  response_id  TEXT,
  cache_hit    BIGINT NOT NULL DEFAULT 0,
  outcome      TEXT NOT NULL,   -- 'ok' | 'error' | 'refused' | 'unsafe'
  created_at   TEXT NOT NULL
);

CREATE TABLE email_codes (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  -- 'sign-in' | 'reset-password' | 'verify-email'
  purpose      TEXT NOT NULL,
  -- The address the code was sent to. A code proves control of this address
  -- only, so it stops working if the account's address changes.
  email        TEXT NOT NULL,
  code_hash    TEXT NOT NULL,
  attempts     BIGINT NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL,
  expires_at   TEXT NOT NULL,
  consumed_at  TEXT
);

CREATE TABLE subscriptions (
  user_id                TEXT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  stripe_customer_id     TEXT NOT NULL UNIQUE,
  stripe_subscription_id TEXT,
  -- 'monthly' | 'quarterly' | 'yearly'; NULL until a checkout completes
  plan                   TEXT,
  -- Stripe's subscription status: active, trialing, past_due, canceled, ...
  status                 TEXT,
  current_period_end     TEXT,
  cancel_at_period_end   BIGINT NOT NULL DEFAULT 0,
  created_at             TEXT NOT NULL,
  updated_at             TEXT NOT NULL
);

CREATE INDEX idx_users_role ON users (role);

CREATE INDEX idx_users_guest_created ON users (is_guest, created_at);

CREATE INDEX idx_sessions_user ON sessions (user_id);

CREATE INDEX idx_sessions_expires ON sessions (expires_at);

CREATE INDEX idx_questions_exam_state ON questions (exam_key, state);

CREATE INDEX idx_qv_pool ON question_versions (exam_key, state, section_key, domain_slug, difficulty);

CREATE INDEX idx_qv_skill ON question_versions (exam_key, skill_slug);

CREATE INDEX idx_qv_question ON question_versions (question_id, version);

CREATE UNIQUE INDEX idx_attempts_idempotency ON attempts (user_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;

CREATE INDEX idx_attempts_user ON attempts (user_id, created_at);

CREATE INDEX idx_attempts_user_status ON attempts (user_id, status);

CREATE INDEX idx_items_attempt ON attempt_items (attempt_id, part_index, position);

CREATE INDEX idx_items_question ON attempt_items (question_id);

CREATE INDEX idx_events_attempt ON attempt_events (attempt_id, id);

CREATE INDEX idx_review_due ON review_queue (user_id, exam_key, due_at);

CREATE INDEX idx_flags_status ON content_flags (status, created_at);

CREATE INDEX idx_audit_entity ON audit_log (entity_type, entity_id, id);

CREATE INDEX idx_exam_targets_user ON exam_targets (user_id);

CREATE INDEX idx_mistake_labels_user ON mistake_labels (user_id);

CREATE UNIQUE INDEX idx_plans_active ON plans (user_id, exam_key) WHERE status = 'active';

CREATE INDEX idx_plans_user ON plans (user_id, created_at);

CREATE INDEX idx_plan_sessions_plan ON plan_sessions (plan_id, scheduled_on, sequence);

CREATE INDEX idx_plan_sessions_attempt ON plan_sessions (attempt_id);

CREATE INDEX idx_tutor_cache ON tutor_responses (cache_key, withdrawn_at);

CREATE INDEX idx_tutor_user_day ON tutor_responses (user_id, created_at);

CREATE INDEX idx_tutor_created ON tutor_responses (created_at);

CREATE INDEX idx_tutor_usage_user ON tutor_usage (user_id, created_at);

CREATE INDEX idx_tutor_usage_day ON tutor_usage (created_at, cache_hit);

CREATE INDEX idx_email_codes_user ON email_codes (user_id, purpose, created_at);

CREATE INDEX idx_email_codes_expires ON email_codes (expires_at);

ALTER TABLE examer.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.stimuli ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.question_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.exam_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.attempt_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.attempt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.attempt_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.attempt_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.exam_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.mistake_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.plan_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.tutor_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.tutor_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.email_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE examer.subscriptions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON SCHEMA examer FROM PUBLIC, anon, authenticated;
CREATE TABLE _migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL);
INSERT INTO _migrations (name, applied_at) VALUES
('001_core.sql', '2026-09-30T10:28:36.291Z'),
('002_exam_targets.sql', '2026-09-30T10:28:36.293Z'),
('003_feedback_release.sql', '2026-09-30T10:28:36.293Z'),
('004_resume_position.sql', '2026-09-30T10:28:36.293Z'),
('005_mistake_labels.sql', '2026-09-30T10:28:36.293Z'),
('006_response_clock.sql', '2026-09-30T10:28:36.293Z'),
('007_study_plans.sql', '2026-09-30T10:28:36.293Z'),
('008_tutor.sql', '2026-09-30T10:28:36.293Z'),
('009_email_codes.sql', '2026-10-01T00:00:00.000Z'),
('010_billing.sql', '2026-10-05T00:00:00.000Z');
ALTER TABLE examer._migrations ENABLE ROW LEVEL SECURITY;
COMMIT;
