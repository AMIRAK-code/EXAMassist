-- Postgres (Supabase) version of db/migrations/013_content_translations.sql.
BEGIN;

ALTER TABLE examer.question_versions ADD COLUMN translations_json TEXT;
ALTER TABLE examer.stimuli ADD COLUMN translations_json TEXT;
ALTER TABLE examer.attempts ADD COLUMN content_locale TEXT NOT NULL DEFAULT 'en';

INSERT INTO _migrations (name, applied_at)
VALUES ('013_content_translations.sql', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'));

COMMIT;
