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
  created_at  timestamptz not null default now()
);

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
