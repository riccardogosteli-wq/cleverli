-- Feedback rewards are automatic only after the app verifies an active
-- premium/trial customer email. Keep the database default conservative.

alter table public.customer_feedback
  alter column giveaway_opt_in set default false;
