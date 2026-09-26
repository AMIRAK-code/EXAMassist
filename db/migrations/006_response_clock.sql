-- ---------------------------------------------------------------------------
-- 006: the order of answer writes, so a late one cannot undo a newer one.
--
-- The player keeps answers it has not yet had confirmed on the device and
-- sends them again after a reload, a dropped connection or a closed tab. A
-- resend, a second tab or a second device can then deliver an older answer
-- after a newer one. response_clock is the clock of the answer stored now, on
-- the same server-anchored timeline as attempts.resume_clock (004): an answer
-- is written only when its clock is ahead of the stored one, in the same
-- statement as the write. A repeat of the stored answer succeeds without
-- writing, so a resent request never counts its time twice.
--
-- NULL for answers written before this migration: the next write, of any
-- clock, replaces them.
-- ---------------------------------------------------------------------------

ALTER TABLE attempt_items ADD COLUMN response_clock INTEGER;
