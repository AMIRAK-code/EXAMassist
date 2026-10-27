-- Question content in a second language (docs/DRAFT-EXAMS.md, src/lib/content).
--
-- Only translations an independent checker has solved and judged faithful are
-- stored here, keyed by locale: {"it": {stemMd, options, explanationMd, ...}}.
-- They are presentation of an existing version, not a new version: the answer
-- key, option ids and scoring never change with the language.
ALTER TABLE question_versions ADD COLUMN translations_json TEXT;
ALTER TABLE stimuli ADD COLUMN translations_json TEXT;

-- The language an attempt's questions are shown in, fixed when it starts so a
-- resumed or reviewed attempt never switches language halfway.
ALTER TABLE attempts ADD COLUMN content_locale TEXT NOT NULL DEFAULT 'en';
