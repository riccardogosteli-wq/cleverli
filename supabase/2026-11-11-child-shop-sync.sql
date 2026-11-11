-- Per-child shop state. Snapshots never overwrite the authoritative wallet.
begin;
create table if not exists public.child_shop_state (
  child_id uuid primary key references public.child_profiles(id) on delete cascade,
  parent_id uuid not null references public.parent_profiles(id) on delete cascade,
  coins bigint not null default 0 check (coins >= 0),
  owned_items text[] not null default '{}',
  equipped_item text,
  legacy_capital bigint not null default 0 check (legacy_capital >= 0),
  legacy_debt bigint not null default 0 check (legacy_debt >= 0),
  revision bigint not null default 0,
  updated_at timestamptz not null default now()
);
create table if not exists public.child_shop_credits (
  child_id uuid not null references public.child_shop_state(child_id) on delete cascade,
  event_id uuid not null,
  amount smallint not null check (amount in (1,6)),
  created_at timestamptz not null default now(),
  primary key(child_id,event_id)
);
alter table public.child_shop_state enable row level security;
alter table public.child_shop_credits enable row level security;
drop policy if exists shop_read_own on public.child_shop_state;
create policy shop_read_own on public.child_shop_state for select to authenticated
using (parent_id=auth.uid() and exists(select 1 from public.child_profiles c where c.id=child_id and c.parent_id=auth.uid()));
revoke all on public.child_shop_state,public.child_shop_credits from anon,authenticated;
grant select on public.child_shop_state to authenticated;

create or replace function public.shop_item_cost(p_item text) returns integer
language sql immutable set search_path=public as $$
select case p_item when 'hat-wizard' then 20 when 'hat-crown' then 50 when 'hat-star' then 30
when 'acc-glasses' then 15 when 'acc-bow' then 15 when 'acc-medal' then 25
when 'bg-space' then 40 when 'bg-rainbow' then 40 else null end;
$$;
revoke all on function public.shop_item_cost(text) from public,anon,authenticated;

create or replace function public.sync_child_shop(
 p_child uuid, p_legacy jsonb default null, p_credits jsonb default '[]',
 p_action text default null, p_item text default null
) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare
 s public.child_shop_state%rowtype;
 owner_id uuid;
 legacy_ids text[];
 candidate text;
 capital bigint;
 imported_cost bigint:=0;
 credit jsonb;
 inserted integer;
 credit_total bigint:=0;
 adjusted_balance bigint;
 cost integer;
 changed boolean:=false;
 outcome text:='synced';
begin
 owner_id:=auth.uid();
 if owner_id is null or not exists(select 1 from public.child_profiles c where c.id=p_child and c.parent_id=owner_id) then
  raise exception 'Child not owned by authenticated parent' using errcode='42501';
 end if;
 if p_action is not null and p_action not in ('buy','wear','reset') then raise exception 'Invalid shop action'; end if;
 if p_credits is null or jsonb_typeof(p_credits)<>'array' or jsonb_array_length(p_credits)>500 then raise exception 'Invalid credit batch'; end if;
 insert into public.child_shop_state(child_id,parent_id) values(p_child,owner_id) on conflict(child_id) do nothing;
 select * into s from public.child_shop_state where child_id=p_child for update;
 if s.parent_id<>owner_id then raise exception 'Shop ownership mismatch' using errcode='42501'; end if;
 if p_legacy is not null then
  if jsonb_typeof(p_legacy)<>'object' or jsonb_typeof(p_legacy->'ownedItems')<>'array'
   or jsonb_array_length(p_legacy->'ownedItems')>128
   or coalesce(p_legacy->>'coins','') !~ '^[0-9]{1,10}$' then raise exception 'Invalid legacy shop'; end if;
  select coalesce(array_agg(distinct value #>> '{}'),'{}') into legacy_ids
   from jsonb_array_elements(p_legacy->'ownedItems') where jsonb_typeof(value)='string' and (value #>> '{}') ~ '^[a-zA-Z0-9_-]{1,80}$';
  select (p_legacy->>'coins')::bigint+coalesce(sum(public.shop_item_cost(x)),0) into capital from unnest(legacy_ids) x;
  if capital>2147483647 then raise exception 'Invalid legacy balance'; end if;
  foreach candidate in array legacy_ids loop
   if not candidate=any(s.owned_items) then
    s.owned_items:=array_append(s.owned_items,candidate);
    imported_cost:=imported_cost+coalesce(public.shop_item_cost(candidate),0);
    changed:=true;
   end if;
  end loop;
  adjusted_balance:=s.coins-s.legacy_debt+greatest(0,capital-s.legacy_capital)-imported_cost;
  s.coins:=greatest(0,adjusted_balance);
  s.legacy_debt:=greatest(0,-adjusted_balance);
  if capital>s.legacy_capital then changed:=true; end if;
  s.legacy_capital:=greatest(s.legacy_capital,capital);
  -- Only the first import can carry its old selection. Later stale devices cannot reset it.
  if s.revision=0 then
   candidate:=p_legacy->>'equippedItem';
   if public.shop_item_cost(candidate) is not null and candidate=any(s.owned_items) then s.equipped_item:=candidate;changed:=true;end if;
  end if;
 end if;
 for credit in select value from jsonb_array_elements(p_credits) loop
  if jsonb_typeof(credit)<>'object' or coalesce(credit->>'amount','') not in ('1','6') then raise exception 'Invalid earned coins'; end if;
  insert into public.child_shop_credits(child_id,event_id,amount)
   values(p_child,(credit->>'id')::uuid,(credit->>'amount')::smallint) on conflict do nothing;
  get diagnostics inserted=row_count;
  if inserted=1 then credit_total:=credit_total+(credit->>'amount')::smallint;end if;
 end loop;
 if credit_total>0 then
  adjusted_balance:=s.coins-s.legacy_debt+credit_total;
  s.coins:=greatest(0,adjusted_balance);s.legacy_debt:=greatest(0,-adjusted_balance);changed:=true;
 end if;
 if p_action='buy' then
  cost:=public.shop_item_cost(p_item);
  if cost is null then raise exception 'Unknown shop item'; end if;
  if p_item=any(s.owned_items) then outcome:='already_owned';
  elsif s.coins<cost then outcome:='insufficient';
  else s.coins:=s.coins-cost;s.owned_items:=array_append(s.owned_items,p_item);changed:=true;outcome:='purchased';end if;
 elsif p_action='wear' then
  if public.shop_item_cost(p_item) is null or not p_item=any(s.owned_items) then outcome:='not_owned';
  else s.equipped_item:=p_item;changed:=true;outcome:='equipped';end if;
 elsif p_action='reset' then s.equipped_item:=null;changed:=true;outcome:='equipped';end if;
 if changed then
  update public.child_shop_state set coins=s.coins,owned_items=s.owned_items,equipped_item=s.equipped_item,
   legacy_capital=s.legacy_capital,legacy_debt=s.legacy_debt,revision=s.revision+1,updated_at=clock_timestamp() where child_id=p_child returning * into s;
 end if;
 return jsonb_build_object('coins',s.coins,'ownedItems',s.owned_items,'equippedItem',s.equipped_item,'revision',s.revision,'result',outcome);
end;
$$;
revoke all on function public.sync_child_shop(uuid,jsonb,jsonb,text,text) from public,anon;
grant execute on function public.sync_child_shop(uuid,jsonb,jsonb,text,text) to authenticated;
notify pgrst,'reload schema';
commit;
