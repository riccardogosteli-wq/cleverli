-- Private customer feedback from shareable noindex forms.

create table if not exists public.customer_feedback (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  rating smallint check (rating between 1 and 5),
  liked text,
  disliked text,
  missing text,
  issues text,
  child_reaction text,
  improvement_idea text,
  allow_followup boolean not null default false,
  giveaway_opt_in boolean not null default false,
  giveaway_months smallint not null default 3,
  giveaway_selected boolean not null default false,
  giveaway_awarded_at timestamptz,
  source text,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists idx_customer_feedback_created_at
  on public.customer_feedback (created_at desc);

create index if not exists idx_customer_feedback_email_created_at
  on public.customer_feedback (lower(email), created_at desc);

create index if not exists idx_customer_feedback_giveaway
  on public.customer_feedback (giveaway_opt_in, giveaway_selected, created_at desc)
  where giveaway_opt_in = true;

alter table public.customer_feedback enable row level security;

revoke all on table public.customer_feedback from anon, authenticated;
grant all on table public.customer_feedback to service_role;
