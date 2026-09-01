-- Make canton-profile rollout usage observable in private Supabase telemetry.

alter table public.child_profiles
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.touch_child_profiles_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists child_profiles_touch_updated_at on public.child_profiles;
create trigger child_profiles_touch_updated_at
  before update on public.child_profiles
  for each row execute function public.touch_child_profiles_updated_at();

alter table public.user_activity_events
  drop constraint if exists user_activity_events_activity_type_check;

alter table public.user_activity_events
  add constraint user_activity_events_activity_type_check
  check (
    activity_type in (
      'login',
      'signup',
      'signup_started',
      'password_reset_requested',
      'password_updated',
      'checkout_started',
      'subscription_trial_started',
      'subscription_started',
      'schooltime_access_started',
      'subscription_updated',
      'subscription_cancel_requested',
      'subscription_cancelled',
      'ads_lp_ab_assignment',
      'ads_lp_cta_click',
      'curriculum_profile_selected',
      'curriculum_profile_changed',
      'exercise_started',
      'exercise_completed',
      'exercise_wrong_answer',
      'hint_used',
      'paywall_shown'
    )
  );
