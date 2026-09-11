begin;
-- Teacher entitlements are separate from family subscriptions and editable only by the operator.
create table public.teacher_accounts (
  user_id uuid primary key references public.parent_profiles(id) on delete cascade,
  school_name text not null check (length(school_name) between 2 and 160),
  active boolean not null default true,
  valid_until timestamptz not null,
  updated_at timestamptz not null default now()
);
alter table public.teacher_accounts enable row level security;
revoke all on public.teacher_accounts from public, anon, authenticated, service_role;
grant select on public.teacher_accounts to authenticated, service_role;
create policy teacher_account_read_own on public.teacher_accounts for select to authenticated using (auth.uid() = user_id);

create table public.teacher_account_audit (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  action text not null check (action in ('grant','revoke')),
  school_name text not null,
  valid_until timestamptz not null,
  actor text not null default 'internal_dashboard',
  created_at timestamptz not null default now()
);
alter table public.teacher_account_audit enable row level security;
revoke all on public.teacher_account_audit from public, anon, authenticated, service_role;
grant select on public.teacher_account_audit to service_role;

create function public.set_teacher_account(p_user_id uuid, p_action text, p_school_name text, p_valid_until timestamptz)
returns public.teacher_accounts language plpgsql security definer set search_path = public, pg_temp as $$
declare result public.teacher_accounts; previous public.teacher_accounts;
begin
  if p_action not in ('grant','revoke') or p_action is null then raise exception 'invalid_action'; end if;
  -- Shared lock serializes entitlement changes and child-count decisions per account.
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));
  if not exists(select 1 from public.parent_profiles where id=p_user_id) then raise exception 'account_not_found'; end if;
  select * into previous from public.teacher_accounts where user_id=p_user_id;
  if p_action='grant' then
    if p_school_name is null or length(trim(p_school_name)) not between 2 and 160 or p_valid_until is null or p_valid_until<=now() or p_valid_until>now()+interval '5 years' then raise exception 'invalid_grant'; end if;
    if previous.active and previous.school_name=trim(p_school_name) and previous.valid_until=p_valid_until then return previous; end if;
    insert into public.teacher_accounts(user_id,school_name,active,valid_until)
      values(p_user_id,trim(p_school_name),true,p_valid_until)
      on conflict(user_id) do update set school_name=excluded.school_name,active=true,valid_until=excluded.valid_until,updated_at=now()
      returning * into result;
  else
    if previous.user_id is null then raise exception 'teacher_account_not_found'; end if;
    if not previous.active then return previous; end if;
    update public.teacher_accounts set active=false,updated_at=now() where user_id=p_user_id returning * into result;
  end if;
  insert into public.teacher_account_audit(user_id,action,school_name,valid_until) values(result.user_id,p_action,result.school_name,result.valid_until);
  return result;
end;
$$;
revoke all on function public.set_teacher_account(uuid,text,text,timestamptz) from public,anon,authenticated;
grant execute on function public.set_teacher_account(uuid,text,text,timestamptz) to service_role;

-- Enforce the existing family limit at the database boundary, not in localStorage.
-- Updates/restores of existing profiles remain allowed, including after a teacher licence ends.
create function public.check_child_profile_limit()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if TG_OP='UPDATE' and new.parent_id is distinct from old.parent_id then raise exception 'profile_owner_immutable'; end if;
  if TG_OP='UPDATE' then return new; end if;
  perform pg_advisory_xact_lock(hashtextextended(new.parent_id::text, 0));
  if exists(select 1 from public.child_profiles where id=new.id and parent_id<>new.parent_id) then raise exception 'profile_owner_immutable'; end if;
  if exists(select 1 from public.child_profiles where id=new.id and parent_id=new.parent_id) then return new; end if;
  if exists(select 1 from public.teacher_accounts where user_id=new.parent_id and active and valid_until>now()) then return new; end if;
  if (select count(*) from public.child_profiles where parent_id=new.parent_id)>=3 then raise exception 'child_profile_limit'; end if;
  return new;
end;
$$;
revoke all on function public.check_child_profile_limit() from public,anon,authenticated;
create trigger child_profiles_account_limit before insert or update on public.child_profiles for each row execute function public.check_child_profile_limit();
commit;
