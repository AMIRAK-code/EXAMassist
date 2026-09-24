-- ---------------------------------------------------------------------------
-- 003: record when immediate feedback was released for an item.
--
-- In untimed practice the learner may ask to check an answer, which reveals the
-- key and the worked explanation. From that moment the answer is locked: a
-- learner who has seen the key must not be able to change the answer and have
-- the miss recorded as correct. The server enforces the lock by only writing an
-- item whose feedback_released_at is still NULL.
-- ---------------------------------------------------------------------------

ALTER TABLE attempt_items ADD COLUMN feedback_released_at TEXT;

-- Under the previous rule an in-progress immediate-feedback attempt showed the
-- key as soon as an item was answered. Record that release, so those answers
-- lock exactly as new ones will. Submitted and expired attempts, and their
-- results, are left untouched.
UPDATE attempt_items
   SET feedback_released_at = COALESCE(
         last_answered_at,
         first_seen_at,
         (SELECT a.started_at FROM attempts a WHERE a.id = attempt_items.attempt_id)
       )
 WHERE response_status = 'answered'
   AND feedback_released_at IS NULL
   AND attempt_id IN (
         SELECT id FROM attempts
          WHERE status = 'in_progress'
            AND json_extract(settings_json, '$.immediateFeedback') = 1
       );
