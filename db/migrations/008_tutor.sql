-- The optional AI tutor.
--
-- Every model response is stored, for three reasons:
--   1. A learner who reports an explanation is reporting a specific text, and
--      the editor reviewing the report must see exactly that text.
--   2. The same question asked the same way gets the same answer, instead of a
--      fresh (and possibly different) one each time, which is both cheaper and
--      easier to trust.
--   3. Usage limits are counted from real calls, not estimated.
--
-- Nothing identifying is sent to the model provider. `user_id` is kept here,
-- locally, only so a learner's own debrief can be shown back to them and so
-- the per-learner limit can be enforced; it is removed with the account.

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
  input_tokens        INTEGER NOT NULL DEFAULT 0,
  output_tokens       INTEGER NOT NULL DEFAULT 0,
  created_at          TEXT NOT NULL,
  -- Set when an editor withdraws a response after a report. A withdrawn
  -- response is never served again; the next request generates a new one.
  withdrawn_at        TEXT
);

CREATE INDEX idx_tutor_cache ON tutor_responses (cache_key, withdrawn_at);
CREATE INDEX idx_tutor_user_day ON tutor_responses (user_id, created_at);
CREATE INDEX idx_tutor_created ON tutor_responses (created_at);

-- Each call made on a learner's behalf, including cache hits, so the daily
-- limit reflects what they asked for rather than what happened to be cached.
CREATE TABLE tutor_usage (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      TEXT REFERENCES users (id) ON DELETE CASCADE,
  kind         TEXT NOT NULL,
  response_id  TEXT,
  cache_hit    INTEGER NOT NULL DEFAULT 0,
  outcome      TEXT NOT NULL,   -- 'ok' | 'error' | 'refused' | 'unsafe'
  created_at   TEXT NOT NULL
);

CREATE INDEX idx_tutor_usage_user ON tutor_usage (user_id, created_at);
CREATE INDEX idx_tutor_usage_day ON tutor_usage (created_at, cache_hit);

-- Reports about an AI response join the existing editorial queue.
ALTER TABLE content_flags ADD COLUMN tutor_response_id TEXT;
