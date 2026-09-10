-- Private offer capabilities never readable by browser roles. Provision only a SHA256
-- digest of a random 32-byte token. No raw capability or hosted URL is stored here.
create table if not exists public.private_checkout_offers (
  id uuid primary key default gen_random_uuid(),
  token_hash text unique not null check (token_hash ~ '^[a-f0-9]{64}$'),
  user_id uuid not null references public.parent_profiles(id),
  customer_id text not null check (customer_id like 'cus_%'),
  amount integer not null check (amount > 0),
  currency text not null default 'chf' check (currency = 'chf'),
  deadline bigint not null,
  generation integer not null default 0,
  session_id text unique,
  session_expires bigint,
  redeemed_session text unique,
  redeemed_at timestamptz,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index if not exists private_checkout_offers_one_active_user
  on public.private_checkout_offers(user_id) where not revoked and redeemed_session is null;
alter table public.private_checkout_offers enable row level security;
revoke all on public.private_checkout_offers from public, anon, authenticated;
grant all on public.private_checkout_offers to service_role;

create or replace function public.advance_private_offer(p_id uuid, p_generation integer, p_expires bigint)
returns public.private_checkout_offers language plpgsql security definer set search_path = '' as $$
declare o public.private_checkout_offers; n bigint := floor(extract(epoch from clock_timestamp()));
begin
  select * into strict o from public.private_checkout_offers where id = p_id for update;
  if o.revoked or o.redeemed_session is not null or n >= o.deadline then raise exception 'offer_unavailable'; end if;
  if o.generation <> p_generation then return o; end if;
  if p_expires is null or p_expires > o.deadline or p_expires < n + 1800 or p_expires > n + 86400 then raise exception 'invalid_expiry'; end if;
  update public.private_checkout_offers set generation = generation + 1,
    session_id = null, session_expires = p_expires where id = p_id returning * into o;
  return o;
end;
$$;

create or replace function public.attach_private_offer(p_id uuid, p_generation integer, p_session text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.private_checkout_offers set session_id = p_session
  where id = p_id and generation = p_generation and not revoked and redeemed_session is null
    and (session_id is null or session_id = p_session);
  if not found then raise exception 'offer_changed'; end if;
end;
$$;

-- Caller retrieves the signed event's session from Stripe, checks paid status, then
-- this transaction revalidates immutable commercial identity and atomically redeems.
-- Late delivery of a valid paid session is accepted; no deadline check at delivery.
create or replace function public.redeem_private_offer(
  p_id uuid, p_session text, p_user uuid, p_customer text,
  p_amount integer, p_currency text, p_paid boolean, p_expires bigint
) returns boolean language plpgsql security definer set search_path = '' as $$
declare o public.private_checkout_offers;
begin
  select * into strict o from public.private_checkout_offers where id = p_id for update;
  if p_paid is not true or p_session is null or p_session = '' or p_expires is null
    or o.session_id is distinct from p_session or o.user_id is distinct from p_user
    or o.customer_id is distinct from p_customer or o.amount is distinct from p_amount or o.currency is distinct from p_currency
    or o.session_expires is distinct from p_expires or p_expires > o.deadline then
    raise exception 'payment_mismatch';
  end if;
  if o.redeemed_session = p_session then return false; end if;
  if o.redeemed_session is not null then raise exception 'offer_already_redeemed'; end if;
  -- Revocation stops new checkout; an already settled valid payment is still owed access.
  update public.parent_profiles set premium = true, premium_plan = 'schooltime', premium_until = null,
    cancelled = false, stripe_customer_id = p_customer, stripe_subscription_id = null where id = p_user;
  if not found then raise exception 'parent_missing'; end if;
  update public.private_checkout_offers set redeemed_session = p_session, redeemed_at = now() where id = p_id;
  return true;
end;
$$;
revoke all on function public.advance_private_offer(uuid,integer,bigint) from public, anon, authenticated;
revoke all on function public.attach_private_offer(uuid,integer,text) from public, anon, authenticated;
revoke all on function public.redeem_private_offer(uuid,text,uuid,text,integer,text,boolean,bigint) from public, anon, authenticated;
grant execute on function public.advance_private_offer(uuid,integer,bigint) to service_role;
grant execute on function public.attach_private_offer(uuid,integer,text) to service_role;
grant execute on function public.redeem_private_offer(uuid,text,uuid,text,integer,text,boolean,bigint) to service_role;
