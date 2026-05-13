-- Cleverli launch hardening for Supabase Data API exposure changes.
-- Run once in the Supabase SQL Editor for project hfptpwxguplwiikmjifo.

alter table public.parent_profiles
  add column if not exists premium_until timestamptz,
  add column if not exists premium_plan text,
  add column if not exists cancelled boolean default false,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

alter table public.parent_profiles
  alter column cancelled set default false;

create index if not exists idx_parent_profiles_premium_until
  on public.parent_profiles (premium_until)
  where premium = true;

create index if not exists idx_parent_profiles_stripe_customer_id
  on public.parent_profiles (stripe_customer_id)
  where stripe_customer_id is not null;

create table if not exists public.push_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete cascade,
  subscription jsonb not null,
  endpoint     text generated always as (subscription->>'endpoint') stored,
  created_at   timestamptz not null default now()
);

alter table public.push_subscriptions
  add column if not exists endpoint text generated always as (subscription->>'endpoint') stored;

create unique index if not exists idx_push_subscriptions_endpoint_unique
  on public.push_subscriptions (endpoint);

alter table public.push_subscriptions enable row level security;

-- Supabase will stop exposing new public tables to the Data API automatically
-- for existing projects on 2026-10-30. These explicit grants keep Cleverli's
-- REST/supabase-js access stable while RLS continues to enforce row access.
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
