-- Cleverli DB Schema
-- Run this in Supabase SQL editor: https://supabase.com/dashboard/project/hfptpwxguplwiikmjifo/sql/new

-- ─────────────────────────────────────────────
-- 1. PARENT ACCOUNTS (extends Supabase auth.users)
-- ─────────────────────────────────────────────
create table if not exists public.parent_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text,
  premium     boolean not null default false,
  premium_until timestamptz,
  premium_plan text,
  cancelled   boolean not null default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_parent_profiles_premium_until
  on public.parent_profiles (premium_until)
  where premium = true;

create index if not exists idx_parent_profiles_stripe_customer_id
  on public.parent_profiles (stripe_customer_id)
  where stripe_customer_id is not null;

alter table public.parent_profiles enable row level security;

create policy "Parents can read own profile"
  on public.parent_profiles for select
  using (auth.uid() = id);

create policy "Parents can update own profile"
  on public.parent_profiles for update
  using (auth.uid() = id);

create policy "Parents can insert own profile"
  on public.parent_profiles for insert
  with check (auth.uid() = id);

-- Auto-create parent_profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.parent_profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─────────────────────────────────────────────
-- 2. CHILD PROFILES (up to 3 per parent)
-- ─────────────────────────────────────────────
create table if not exists public.child_profiles (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references public.parent_profiles(id) on delete cascade,
  name        text not null,
  grade       int not null check (grade between 1 and 6),
  avatar      text not null default '🦊',
  created_at  timestamptz not null default now()
);

alter table public.child_profiles enable row level security;

create policy "Parents can manage own children"
  on public.child_profiles for all
  using (auth.uid() = parent_id);


-- ─────────────────────────────────────────────
-- 3. CHILD PROGRESS (XP, streak, topic completion)
-- ─────────────────────────────────────────────
create table if not exists public.child_progress (
  id              uuid primary key default gen_random_uuid(),
  child_id        uuid not null references public.child_profiles(id) on delete cascade,
  parent_id       uuid not null references public.parent_profiles(id) on delete cascade,

  -- XP & streak
  xp              int not null default 0,
  daily_streak    int not null default 0,
  last_played_date text,           -- "YYYY-MM-DD"
  weekly_xp       int not null default 0,
  weekly_xp_date  text,            -- "YYYY-WW"

  -- Counters
  total_exercises     int not null default 0,
  total_topics_done   int not null default 0,

  -- Cosmetics
  costume         int not null default 0,

  updated_at      timestamptz not null default now(),

  unique (child_id)
);

alter table public.child_progress enable row level security;

create policy "Parents can manage child progress"
  on public.child_progress for all
  using (auth.uid() = parent_id);


-- ─────────────────────────────────────────────
-- 4. TOPIC PROGRESS (per child, per topic)
-- ─────────────────────────────────────────────
create table if not exists public.topic_progress (
  id          uuid primary key default gen_random_uuid(),
  child_id    uuid not null references public.child_profiles(id) on delete cascade,
  parent_id   uuid not null references public.parent_profiles(id) on delete cascade,

  grade       int not null,
  subject     text not null,
  topic_id    text not null,

  stars       int not null default 0,
  score       int not null default 0,
  completed   int not null default 0,
  correct_ids jsonb not null default '[]'::jsonb,
  partial     boolean not null default false,
  last_played timestamptz,

  unique (child_id, grade, subject, topic_id)
);

alter table public.topic_progress enable row level security;

create policy "Parents can manage topic progress"
  on public.topic_progress for all
  using (auth.uid() = parent_id);


-- ─────────────────────────────────────────────
-- 5. NOTIFY SIGNUPS (grade 4-6 waitlist)
-- ─────────────────────────────────────────────
create table if not exists public.notify_signups (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- Public insert (no auth needed for waitlist)
alter table public.notify_signups enable row level security;

create policy "Anyone can join waitlist"
  on public.notify_signups for insert
  with check (true);


-- ─────────────────────────────────────────────
-- 6. PUSH SUBSCRIPTIONS (daily reminder service)
-- ─────────────────────────────────────────────
create table if not exists public.push_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  subscription jsonb not null,
  endpoint     text generated always as (subscription->>'endpoint') stored,
  created_at   timestamptz not null default now()
);

create unique index if not exists idx_push_subscriptions_endpoint_unique
  on public.push_subscriptions (endpoint);

alter table public.push_subscriptions enable row level security;


-- ─────────────────────────────────────────────
-- 7. EXERCISE EVENTS (private product telemetry)
-- ─────────────────────────────────────────────
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


-- ─────────────────────────────────────────────
-- 8. DATA API GRANTS
-- ─────────────────────────────────────────────
-- Supabase will stop exposing new public tables to the Data API automatically
-- for existing projects on 2026-10-30. Keep access explicit and narrow.
grant usage on schema public to anon, authenticated, service_role;

grant select on table public.parent_profiles to anon;
grant select, insert, update on table public.parent_profiles to authenticated;
grant all on table public.parent_profiles to service_role;

grant select, insert, update, delete on table public.child_profiles to authenticated;
grant all on table public.child_profiles to service_role;

grant select, insert, update, delete on table public.child_progress to authenticated;
grant all on table public.child_progress to service_role;

grant select, insert, update, delete on table public.topic_progress to authenticated;
grant all on table public.topic_progress to service_role;

grant insert on table public.notify_signups to anon;
grant all on table public.notify_signups to service_role;

grant all on table public.push_subscriptions to service_role;

revoke all on table public.exercise_events from anon, authenticated;
grant all on table public.exercise_events to service_role;


-- ─────────────────────────────────────────────
-- 9. USER ACTIVITY EVENTS (private product telemetry)
-- ─────────────────────────────────────────────
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
