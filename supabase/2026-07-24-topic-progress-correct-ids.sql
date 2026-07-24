alter table public.topic_progress
  add column if not exists correct_ids jsonb not null default '[]'::jsonb;
