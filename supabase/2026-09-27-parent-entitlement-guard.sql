begin;
-- Preserve normal profile editing and all trusted server-side billing writes.
-- Browser/Data API roles must never create or change their own entitlement.
create or replace function public.guard_parent_entitlements()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      if new.premium is true or new.premium_until is not null or new.premium_plan is not null
        or new.stripe_customer_id is not null or new.stripe_subscription_id is not null
        or new.cancelled is true then
        raise exception 'Premium fields are managed by the server' using errcode = '42501';
      end if;
    elsif row(new.premium,new.premium_until,new.premium_plan,new.stripe_customer_id,new.stripe_subscription_id,new.cancelled)
       is distinct from row(old.premium,old.premium_until,old.premium_plan,old.stripe_customer_id,old.stripe_subscription_id,old.cancelled) then
      raise exception 'Premium fields are managed by the server' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;
-- Run after existing BEFORE triggers so their output cannot bypass the guard.
do $$ begin
  if not exists (select 1 from pg_trigger where tgrelid='public.parent_profiles'::regclass and tgname='zz_parent_entitlements_server_only') then
    create trigger zz_parent_entitlements_server_only before insert or update on public.parent_profiles
      for each row execute function public.guard_parent_entitlements();
  elsif not exists (select 1 from pg_trigger where tgrelid='public.parent_profiles'::regclass
    and tgname='zz_parent_entitlements_server_only' and tgfoid='public.guard_parent_entitlements()'::regprocedure
    and tgtype=23 and tgenabled='O' and tgqual is null and tgattr::text='') then
    raise exception 'Existing entitlement guard differs; refusing to replace it';
  end if;
end $$;
commit;
select tgname,pg_get_triggerdef(oid) as definition from pg_trigger
where tgrelid='public.parent_profiles'::regclass and tgname='zz_parent_entitlements_server_only';
