-- Daily totals for a handful of public pages and sign-up and purchase steps
-- (src/lib/analytics/funnel.ts). Aggregate counts only: no user id, no
-- session, no IP address, no user agent and no cookie are stored, so no row
-- can be traced back to a visitor. Free-test starts and completions are not
-- counted here; they are read from the attempts table, which already records
-- them exactly.

CREATE TABLE funnel_counts (
  day     TEXT NOT NULL,                 -- UTC date, YYYY-MM-DD
  event   TEXT NOT NULL,                 -- landing_view | pricing_view | checkout_start | purchase
  subject TEXT NOT NULL,                 -- exam key, hub slug, or 'none'
  source  TEXT NOT NULL,                 -- search | ai | internal | other | direct | n/a
  count   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, event, subject, source)
);
