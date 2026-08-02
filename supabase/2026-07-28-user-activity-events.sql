-- Private user activity telemetry for the internal log dashboard.
-- Service role only: no public read/write access.

create table if not exists public.user_activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  activity_type text not null check (
    activity_type in (
      'login',
      'signup',
      'password_reset_requested',
      'password_updated',
      'checkout_started',
      'subscription_trial_started',
      'subscription_started',
      'subscription_updated',
      'subscription_cancel_requested',
      'subscription_cancelled',
      'ads_lp_ab_assignment',
      'ads_lp_cta_click',
      'exercise_started',
      'exercise_completed',
      'exercise_wrong_answer',
      'hint_used',
      'paywall_shown'
    )
  ),
  path text,
  source text,
  exercise_id text,
  grade int check (grade between 1 and 6),
  subject text,
  topic_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_activity_events_created_at
  on public.user_activity_events (created_at desc);

create index if not exists idx_user_activity_events_user_created_at
  on public.user_activity_events (user_id, created_at desc)
  where user_id is not null;

create index if not exists idx_user_activity_events_email_created_at
  on public.user_activity_events (lower(email), created_at desc)
  where email is not null;

create index if not exists idx_user_activity_events_type_created_at
  on public.user_activity_events (activity_type, created_at desc);

alter table public.user_activity_events enable row level security;

revoke all on table public.user_activity_events from anon, authenticated;
grant all on table public.user_activity_events to service_role;
