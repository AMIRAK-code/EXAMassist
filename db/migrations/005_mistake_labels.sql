-- ---------------------------------------------------------------------------
-- 005: labels a learner chooses for a mistake ("misread the question" and so on).
--
-- Optional, editable and only ever set by the learner: nothing infers a
-- learner's reasoning from their answer. A label belongs to one answered
-- question in one finished session (the attempt item), so the same question
-- missed twice can be labelled differently each time. Labels never change a
-- score, a result or the review schedule.
-- ---------------------------------------------------------------------------

CREATE TABLE mistake_labels (
  attempt_item_id TEXT NOT NULL REFERENCES attempt_items (id) ON DELETE CASCADE,
  user_id         TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  label           TEXT NOT NULL,
  created_at      TEXT NOT NULL,
  PRIMARY KEY (attempt_item_id, label)
);
CREATE INDEX idx_mistake_labels_user ON mistake_labels (user_id);
