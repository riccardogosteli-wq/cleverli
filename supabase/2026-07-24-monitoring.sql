-- Private product telemetry for operational monitoring.
-- No public read policy: only the service role writes/reads this table.

create table if not exists public.exercise_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (
    event_name in (
      'exercise_started',
      'exercise_completed',
      'exercise_wrong_answer',
      'hint_used',
      'exercise_error',
      'paywall_shown',
      'checkout_error'
    )
  ),
  exercise_id text,
  grade int check (grade between 1 and 6),
  subject text,
  topic_id text,
  exercise_type text,
  is_correct boolean,
  attempt_index int,
  wrong_count_session int,
  hints_used int,
  duration_ms int,
  topic_index int,
  topic_total int,
  lang text,
  path text,
  anonymous_session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_exercise_events_created_at
  on public.exercise_events (created_at desc);

create index if not exists idx_exercise_events_exercise_name
  on public.exercise_events (exercise_id, event_name, created_at desc);

create index if not exists idx_exercise_events_topic
  on public.exercise_events (grade, subject, topic_id, created_at desc);

alter table public.exercise_events enable row level security;

revoke all on table public.exercise_events from anon, authenticated;
grant all on table public.exercise_events to service_role;
