-- Cleverli migration — run in Supabase SQL Editor
-- https://supabase.com/dashboard/project/hfptpwxguplwiikmjifo/editor

ALTER TABLE parent_profiles
  ADD COLUMN IF NOT EXISTS premium_until  timestamptz,
  ADD COLUMN IF NOT EXISTS premium_plan   text,
  ADD COLUMN IF NOT EXISTS cancelled      boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

ALTER TABLE parent_profiles
  ALTER COLUMN cancelled SET DEFAULT false;

-- Optional: index for expiry checks
CREATE INDEX IF NOT EXISTS idx_parent_profiles_premium_until
  ON parent_profiles (premium_until)
  WHERE premium = true;

CREATE INDEX IF NOT EXISTS idx_parent_profiles_stripe_customer_id
  ON parent_profiles (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription jsonb NOT NULL,
  endpoint     text GENERATED ALWAYS AS (subscription->>'endpoint') STORED,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE push_subscriptions
  ADD COLUMN IF NOT EXISTS endpoint text GENERATED ALWAYS AS (subscription->>'endpoint') STORED;

CREATE UNIQUE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint_unique
  ON push_subscriptions (endpoint);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Supabase will stop exposing new public tables to the Data API automatically
-- for existing projects on 2026-10-30. Keep access explicit and narrow.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT ON TABLE parent_profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE parent_profiles TO authenticated;
GRANT ALL ON TABLE parent_profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE child_profiles TO authenticated;
GRANT ALL ON TABLE child_profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE child_progress TO authenticated;
GRANT ALL ON TABLE child_progress TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE topic_progress TO authenticated;
GRANT ALL ON TABLE topic_progress TO service_role;

GRANT INSERT ON TABLE notify_signups TO anon;
GRANT ALL ON TABLE notify_signups TO service_role;

GRANT ALL ON TABLE push_subscriptions TO service_role;
