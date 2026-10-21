begin;
create table public.revenue_account_attribution (
 user_id uuid primary key references auth.users(id) on delete cascade,
 first_exposure jsonb, latest_exposure jsonb, conflict boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.revenue_account_attribution enable row level security;
revoke all on public.revenue_account_attribution from public,anon,authenticated;
grant all on public.revenue_account_attribution to service_role;
create function public.bind_revenue_attribution(p_user uuid,p_exposure jsonb) returns public.revenue_account_attribution
language plpgsql security invoker set search_path=public as $$
declare r public.revenue_account_attribution;
begin
 insert into public.revenue_account_attribution(user_id) values(p_user) on conflict do nothing;
 select * into r from public.revenue_account_attribution where user_id=p_user for update;
 if p_exposure is not null then
  if p_exposure->>'cohort' not in ('randomized_control','randomized_trial','fixed_meta_control','qa') then raise exception 'invalid cohort'; end if;
  update public.revenue_account_attribution set
   conflict=conflict or (first_exposure is not null and first_exposure->>'cohort' is distinct from p_exposure->>'cohort'),
   first_exposure=coalesce(first_exposure,p_exposure), latest_exposure=p_exposure, updated_at=now()
   where user_id=p_user returning * into r;
 end if;
 return r;
end $$;
revoke all on function public.bind_revenue_attribution(uuid,jsonb) from public,anon,authenticated;
grant execute on function public.bind_revenue_attribution(uuid,jsonb) to service_role;
create table public.revenue_payment_ledger (
 charge_id text primary key, payment_intent_id text, invoice_id text, subscription_id text, session_id text,
 customer_id text, user_id uuid, paid_at timestamptz not null, currency text not null,
 amount integer not null check(amount>0), refunded integer not null default 0 check(refunded>=0),
 livemode boolean not null, snapshot jsonb not null, updated_at timestamptz not null default now(),
 check(refunded<=amount)
);
alter table public.revenue_payment_ledger enable row level security;
revoke all on public.revenue_payment_ledger from public,anon,authenticated;
grant all on public.revenue_payment_ledger to service_role;
create index revenue_payment_ledger_paid_at on public.revenue_payment_ledger(paid_at);
create table public.revenue_reconciliation_runs (
 id uuid primary key default gen_random_uuid(), started_at timestamptz not null default now(),
 completed_at timestamptz, result jsonb, error text
);
alter table public.revenue_reconciliation_runs enable row level security;
revoke all on public.revenue_reconciliation_runs from public,anon,authenticated;
grant all on public.revenue_reconciliation_runs to service_role;
create table public.revenue_exposures (
 visitor_id text not null, cohort text not null, snapshot jsonb not null,
 observed_at timestamptz not null default now(), primary key(visitor_id,cohort)
);
create table public.revenue_checkout_snapshots (
 checkout_key text primary key, user_id uuid not null, snapshot jsonb not null,
 created_at timestamptz not null default now()
);
alter table public.revenue_exposures enable row level security;
alter table public.revenue_checkout_snapshots enable row level security;
revoke all on public.revenue_exposures,public.revenue_checkout_snapshots from public,anon,authenticated;
grant all on public.revenue_exposures,public.revenue_checkout_snapshots to service_role;
create function public.refresh_revenue_charge(p_charge text,p_refunded integer) returns void
language sql security invoker set search_path=public as $$
 update public.revenue_payment_ledger set refunded=greatest(refunded,p_refunded),updated_at=now() where charge_id=p_charge;
$$;
revoke all on function public.refresh_revenue_charge(text,integer) from public,anon,authenticated;
grant execute on function public.refresh_revenue_charge(text,integer) to service_role;
commit;
