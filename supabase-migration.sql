-- Cleverli migration — run in Supabase SQL Editor
-- https://supabase.com/dashboard/project/hfptpwxguplwiikmjifo/editor

ALTER TABLE parent_profiles
  ADD COLUMN IF NOT EXISTS premium_until  timestamptz,
  ADD COLUMN IF NOT EXISTS premium_plan   text,
  ADD COLUMN IF NOT EXISTS cancelled      boolean DEFAULT false;

-- Optional: index for expiry checks
CREATE INDEX IF NOT EXISTS idx_parent_profiles_premium_until
  ON parent_profiles (premium_until)
  WHERE premium = true;
