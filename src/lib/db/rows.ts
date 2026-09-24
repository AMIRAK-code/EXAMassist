/**
 * Row shapes as SQLite returns them.
 *
 * Booleans are INTEGER 0/1 and timestamps are ISO-8601 TEXT, so these types
 * describe the raw row; repositories map them to domain objects.
 */

export interface UserRow {
  id: string;
  email: string | null;
  password_hash: string | null;
  display_name: string | null;
  role: 'learner' | 'editor' | 'admin';
  is_guest: 0 | 1;
  locale: string;
  target_exam_key: string | null;
  target_date: string | null;
  weekly_minutes: number | null;
  is_minor: 0 | 1;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SessionRow {
  id: string;
  user_id: string;
  created_at: string;
  expires_at: string;
  last_seen_at: string;
}

export interface QuestionRow {
  id: string;
  exam_key: string;
  current_version: number;
  state: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionVersionRow {
  id: string;
  question_id: string;
  version: number;
  exam_key: string;
  section_key: string;
  domain_slug: string;
  skill_slug: string;
  subskill_slug: string | null;
  response_type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  difficulty_basis: string;
  stem_md: string;
  instructions_md: string | null;
  options_json: string | null;
  correct_json: string;
  explanation_md: string;
  distractor_rationale_json: string | null;
  estimated_seconds: number;
  stimulus_id: string | null;
  stimulus_version: number | null;
  accessibility_text: string | null;
  provenance: string;
  rights_status: string;
  author: string;
  reviewer: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  state: string;
  content_hash: string;
  created_at: string;
}

export interface StimulusRow {
  id: string;
  version: number;
  exam_key: string;
  kind: string;
  title: string | null;
  body_md: string | null;
  data_json: string | null;
  accessibility_text: string;
  provenance: string;
  rights_status: string;
  created_at: string;
}

export interface AttemptRow {
  id: string;
  user_id: string;
  exam_key: string;
  exam_config_version: string;
  blueprint_id: string;
  mode: 'practice' | 'diagnostic' | 'simulation' | 'review';
  status: 'in_progress' | 'submitted' | 'expired' | 'abandoned';
  seed: string;
  settings_json: string;
  started_at: string;
  deadline_at: string | null;
  submitted_at: string | null;
  current_part_index: number;
  idempotency_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttemptPartRow {
  id: string;
  attempt_id: string;
  part_index: number;
  part_key: string;
  section_key: string;
  label: string;
  time_limit_seconds: number | null;
  started_at: string | null;
  deadline_at: string | null;
  submitted_at: string | null;
  status: 'pending' | 'in_progress' | 'submitted' | 'expired';
  navigation_json: string;
  routing_json: string | null;
}

export interface AttemptItemRow {
  id: string;
  attempt_id: string;
  part_index: number;
  position: number;
  question_id: string;
  question_version_id: string;
  response_json: string | null;
  response_status: 'unanswered' | 'answered';
  is_correct: 0 | 1 | null;
  points_earned: number | null;
  points_possible: number;
  flagged: 0 | 1;
  time_ms: number;
  first_seen_at: string | null;
  last_answered_at: string | null;
  /** Set when immediate feedback was shown for this item; the answer is locked from then on. */
  feedback_released_at: string | null;
}

export interface AttemptResultRow {
  attempt_id: string;
  computed_at: string;
  raw_correct: number;
  raw_incorrect: number;
  raw_omitted: number;
  points_earned: number;
  points_possible: number;
  accuracy: number;
  total_time_ms: number;
  per_part_json: string;
  per_skill_json: string;
  reported_score_json: string | null;
  methodology_json: string;
}

export interface ReviewQueueRow {
  user_id: string;
  question_id: string;
  exam_key: string;
  skill_slug: string;
  last_result: 'correct' | 'incorrect' | 'omitted';
  miss_count: number;
  correct_streak: number;
  interval_days: number;
  due_at: string;
  updated_at: string;
}

export interface BookmarkRow {
  user_id: string;
  question_id: string;
  exam_key: string;
  note: string | null;
  created_at: string;
}

export interface StudyPlanRow {
  id: string;
  user_id: string;
  exam_key: string;
  target_date: string | null;
  weekly_minutes: number;
  plan_json: string;
  generated_at: string;
}

export interface ContentFlagRow {
  id: string;
  question_id: string;
  question_version_id: string | null;
  user_id: string | null;
  reason: string;
  details: string | null;
  status: string;
  resolution: string | null;
  created_at: string;
  resolved_at: string | null;
}
