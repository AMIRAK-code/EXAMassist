-- 015_official_practice_scores.sql - results a learner received on an
-- official practice test (one published by the test maker), entered by hand
-- (src/lib/learning/official-scores.ts).
--
-- These are the learner's own statements. Nothing here is verified, converted
-- or predicted: each score is stored on the scale the test maker reported it
-- on, and `scale_key` names that scale and test version, so results are only
-- ever compared with results on the same scale.

CREATE TABLE official_practice_scores (
  id                   TEXT PRIMARY KEY,
  user_id              TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  exam_key             TEXT NOT NULL,
  -- The reported scale and test version, e.g. 'digital-sat' or 'act-enhanced'.
  scale_key            TEXT NOT NULL,
  -- Who published the practice test, from the exam's list of official sources.
  provider_key         TEXT NOT NULL,
  -- The practice test as the learner names it: "Practice Test 4".
  test_name            TEXT NOT NULL,
  taken_on             TEXT NOT NULL,               -- YYYY-MM-DD
  -- NULL when no overall score was entered, or the exam reports none.
  overall_score        REAL,
  -- {"<section key>": score} for the section scores actually entered; a
  -- section left blank is absent, never zero.
  section_scores_json  TEXT NOT NULL DEFAULT '{}',
  notes                TEXT,
  created_at           TEXT NOT NULL,
  updated_at           TEXT NOT NULL
);
CREATE INDEX idx_official_scores_user ON official_practice_scores (user_id, exam_key, taken_on);
