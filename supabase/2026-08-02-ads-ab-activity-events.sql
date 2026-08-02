-- Allow Ads LP A/B test events in the private activity log.

alter table public.user_activity_events
  drop constraint if exists user_activity_events_activity_type_check;

alter table public.user_activity_events
  add constraint user_activity_events_activity_type_check
  check (
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
  );
