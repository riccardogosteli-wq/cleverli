-- Code-first, EMPTY dedicated tables. Parent must rehearse and apply before deploying.
-- No changes to private_checkout_offers, original19 material, offer219_mail or their RPCs.
begin;
-- Private offer capabilities never readable by browser roles. Provision only a SHA256
-- digest of a random 32-byte token. No raw capability or hosted URL is stored here.
create table public.trial_upgrade_offers (
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
  subscription_id text not null default 'sub_1UHo3xDGUBi3vyUQhJGLpwRh' check (subscription_id = 'sub_1UHo3xDGUBi3vyUQhJGLpwRh'),
  trial_end bigint not null default 1790528279 check (trial_end = 1790528279),
  cancellation_state text check (cancellation_state in ('pending','confirmed')),
  cancellation_confirmed_at timestamptz,
  renewal_review_required boolean not null default false,
  check (id = '3823f764-03b8-4617-b808-d798fc9e9a10'::uuid
    and user_id = 'bb7c9111-8560-42a8-939c-2a3a4e70179c'::uuid
    and customer_id = 'cus_VIOr4Apz2BT3cJ' and amount = 21900),
  check ((redeemed_session is null and cancellation_state is null) or (redeemed_session is not null and cancellation_state is not null)),
  check (session_expires is null or session_expires <= trial_end - 600),
  created_at timestamptz not null default now()
);
create unique index trial_upgrade_offers_one_active_user
  on public.trial_upgrade_offers(user_id) where not revoked and redeemed_session is null;
alter table public.trial_upgrade_offers enable row level security;
revoke all on public.trial_upgrade_offers from public, anon, authenticated;
grant all on public.trial_upgrade_offers to service_role;

create or replace function public.advance_trial_upgrade(p_id uuid, p_generation integer, p_expires bigint)
returns public.trial_upgrade_offers language plpgsql security definer set search_path = '' as $$
declare o public.trial_upgrade_offers; n bigint := floor(extract(epoch from clock_timestamp()));
begin
  select * into strict o from public.trial_upgrade_offers where id = p_id for update;
  if o.revoked or o.redeemed_session is not null or n >= o.deadline then raise exception 'offer_unavailable'; end if;
  if o.generation <> p_generation then return o; end if;
  if p_expires is null or p_expires > o.deadline or p_expires > o.trial_end - 600 or p_expires < n + 1800 or p_expires > n + 86400 then raise exception 'invalid_expiry'; end if;
  update public.trial_upgrade_offers set generation = generation + 1,
    session_id = null, session_expires = p_expires where id = p_id returning * into o;
  return o;
end;
$$;

create or replace function public.attach_trial_upgrade(p_id uuid, p_generation integer, p_session text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.trial_upgrade_offers set session_id = p_session
  where id = p_id and generation = p_generation and not revoked and redeemed_session is null
    and (session_id is null or session_id = p_session);
  if not found then raise exception 'offer_changed'; end if;
end;
$$;

-- Caller retrieves the signed event's session from Stripe, checks paid status, then
-- this transaction revalidates immutable commercial identity and atomically redeems.
-- Late delivery of a valid paid session is accepted; no deadline check at delivery.
create or replace function public.redeem_trial_upgrade(
  p_id uuid, p_session text, p_user uuid, p_customer text,
  p_amount integer, p_currency text, p_paid boolean, p_expires bigint
) returns boolean language plpgsql security definer set search_path = '' as $$
declare o public.trial_upgrade_offers;
begin
  select * into strict o from public.trial_upgrade_offers where id = p_id for update;
  if p_paid is not true or p_session is null or p_session = '' or p_expires is null
    or o.session_id is distinct from p_session or o.user_id is distinct from p_user
    or o.customer_id is distinct from p_customer or o.amount is distinct from p_amount or o.currency is distinct from p_currency
    or o.session_expires is distinct from p_expires or p_expires > o.deadline then
    raise exception 'payment_mismatch';
  end if;
  if o.redeemed_session = p_session then return false; end if;
  if o.redeemed_session is not null then raise exception 'offer_already_redeemed'; end if;
  -- Revocation stops new checkout; an already settled valid payment is still owed access.
  -- Obligation and entitlement share one transaction. Lock parent before setting
  -- settled state so concurrent webhook writes serialize against the guard trigger.
  perform 1 from public.parent_profiles where id=p_user for update;
  update public.trial_upgrade_offers set redeemed_session=p_session, redeemed_at=now(), cancellation_state='pending' where id=p_id;
  update public.parent_profiles set premium = true, premium_plan = 'schooltime', premium_until = null,
    cancelled = false, stripe_customer_id = p_customer, stripe_subscription_id = null where id = p_user;
  if not found then raise exception 'parent_missing'; end if;

  return true;
end;
$$;
revoke all on function public.advance_trial_upgrade(uuid,integer,bigint) from public, anon, authenticated;
revoke all on function public.attach_trial_upgrade(uuid,integer,text) from public, anon, authenticated;
revoke all on function public.redeem_trial_upgrade(uuid,text,uuid,text,integer,text,boolean,bigint) from public, anon, authenticated;
grant execute on function public.advance_trial_upgrade(uuid,integer,bigint) to service_role;
grant execute on function public.attach_trial_upgrade(uuid,integer,text) to service_role;
grant execute on function public.redeem_trial_upgrade(uuid,text,uuid,text,integer,text,boolean,bigint) to service_role;

-- Atomic lifetime floor for this exact PAID upgrade only. Covers late deletion,
-- update, subscription Checkout and invoice events, including racing transactions.
-- The parent row lock is held by both ordinary UPDATE and redemption.
create function public.preserve_paid_trial_lifetime() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 if new.id='bb7c9111-8560-42a8-939c-2a3a4e70179c'::uuid and exists (
   select 1 from public.trial_upgrade_offers where user_id=new.id and redeemed_session is not null
 ) then
   new.premium := true; new.premium_plan := 'schooltime'; new.premium_until := null;
   new.cancelled := false; new.stripe_customer_id := 'cus_VIOr4Apz2BT3cJ'; new.stripe_subscription_id := null;
 end if;
 return new;
end;
$$;
revoke all on function public.preserve_paid_trial_lifetime() from public,anon,authenticated;
create trigger preserve_paid_trial_lifetime before update on public.parent_profiles
 for each row execute function public.preserve_paid_trial_lifetime();

create table public.trial_upgrade_mail (
 recipient text primary key check (recipient='stephan-michi@gmx.net'),
 offer_id uuid unique not null references public.trial_upgrade_offers(id),
 state text not null default 'reserved' check (state in ('reserved','accepted')),
 body_hash text not null check (body_hash ~ '^[a-f0-9]{64}$'),
 claimed_at timestamptz not null, deadline bigint not null,
 provider_id text unique, accepted_at timestamptz
);
alter table public.trial_upgrade_mail enable row level security;
revoke all on public.trial_upgrade_mail from public,anon,authenticated;
grant select,insert,update on public.trial_upgrade_mail to service_role;
create function public.reserve_trial_upgrade_mail(p_recipient text,p_offer uuid,p_user uuid,p_customer text,p_hash text,p_body text)
returns public.trial_upgrade_mail language plpgsql security definer set search_path = '' as $$
declare o public.trial_upgrade_offers; result public.trial_upgrade_mail; n timestamptz:=date_trunc('second',clock_timestamp()); d bigint;
begin
 if p_recipient is distinct from 'stephan-michi@gmx.net' or p_offer is distinct from '3823f764-03b8-4617-b808-d798fc9e9a10'::uuid
 or p_user is distinct from 'bb7c9111-8560-42a8-939c-2a3a4e70179c'::uuid or p_customer is distinct from 'cus_VIOr4Apz2BT3cJ' then raise exception 'not_approved'; end if;
 select * into strict o from public.trial_upgrade_offers where id=p_offer for update;
 if o.token_hash is distinct from p_hash or o.revoked or o.redeemed_session is not null or o.session_id is not null
 or o.generation<>0 or o.session_expires is not null or extract(epoch from n)>=o.trial_end-2460 then raise exception 'offer_changed'; end if;
 if not exists(select 1 from public.parent_profiles p join auth.users u on u.id=p.id
 where p.id=p_user and lower(p.email)=p_recipient and lower(u.email)=p_recipient and p.premium
 and p.premium_plan='monthly' and p.stripe_customer_id=p_customer and p.stripe_subscription_id=o.subscription_id) then raise exception 'recipient_changed'; end if;
 d:=floor(extract(epoch from n))::bigint+259200;
 if d>o.trial_end-600 then raise exception 'three_day_trial_window_requires_review'; end if;
 -- Daily 15UTC cron, no schedule changes. Require full final-session margin.
 if mod(mod(d-54000,86400)+86400,86400) not between 3600 and 85000 then
   raise exception 'trial_final_warm_window_requires_review';
 end if;
 insert into public.trial_upgrade_mail(recipient,offer_id,body_hash,claimed_at,deadline)
 values(p_recipient,p_offer,p_body,n,d) returning * into result;
 update public.trial_upgrade_offers set deadline=d where id=p_offer;
 return result;
end;
$$;
revoke all on function public.reserve_trial_upgrade_mail(text,uuid,uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.reserve_trial_upgrade_mail(text,uuid,uuid,text,text,text) to service_role;
commit;
