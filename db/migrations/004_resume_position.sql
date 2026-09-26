-- ---------------------------------------------------------------------------
-- 004: where a learner was in an unfinished attempt, so it reopens there.
--
-- Written only by the navigation endpoint, after the move itself has passed
-- the exam's navigation rules, and only for the section that is currently
-- open. The stored position is a hint, never a permission: every read checks
-- it again against the current section and its rules (a section can close, or
-- a forward-only screen can be committed, after it was written).
--
-- resume_clock orders the writes. It is a millisecond timestamp anchored to
-- the server's clock when the page was rendered, so a request that arrives
-- late (a slow network, a retry, a second tab) cannot overwrite a newer one:
-- the update only applies when its clock is ahead of the stored one.
-- ---------------------------------------------------------------------------

ALTER TABLE attempts ADD COLUMN resume_part_index INTEGER;
ALTER TABLE attempts ADD COLUMN resume_position INTEGER;
ALTER TABLE attempts ADD COLUMN resume_clock INTEGER;
ALTER TABLE attempts ADD COLUMN resume_saved_at TEXT;
