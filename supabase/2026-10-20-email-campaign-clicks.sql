begin;
-- No recipient mapping, email, IP, user agent, raw URL, capability or payment identifiers.
create table public.email_campaigns (
 id uuid primary key default gen_random_uuid(),
 campaign text not null unique check (campaign ~ '^[a-z][a-z0-9_]{0,79}$'),
 source text not null default 'cleverli' check (source ~ '^[a-z][a-z0-9_]{0,47}$'),
 mode text not null default 'draft' check (mode in ('draft','test','live','paused')),
 created_at timestamptz not null default now()
);
create table public.email_campaign_links (
 campaign_id uuid not null references public.email_campaigns(id),
 label text not null check (label ~ '^[a-z][a-z0-9_]{0,47}$'),
 target text not null check (target in ('home','teachers','worksheets','sample','personal','privacy','terms','signup','pricing')),
 primary key (campaign_id,label)
);
create table public.email_campaign_clicks (
 campaign_id uuid not null, label text not null, bucket timestamptz not null,
 requests bigint not null default 1 check (requests > 0),
 primary key (campaign_id,label,bucket),
 foreign key (campaign_id,label) references public.email_campaign_links(campaign_id,label)
);
alter table public.email_campaigns enable row level security;
alter table public.email_campaign_links enable row level security;
alter table public.email_campaign_clicks enable row level security;
revoke all on public.email_campaigns, public.email_campaign_links, public.email_campaign_clicks from public, anon, authenticated;
grant select,insert,update,delete on public.email_campaigns, public.email_campaign_links, public.email_campaign_clicks to service_role;
-- Atomic minute counters; multiple clicks are NOT collapsed into one unique visitor.
-- Drafts are unreachable. Paused campaigns retain their destinations but stop counting.
create function public.resolve_email_campaign_link(p_campaign uuid, p_label text, p_count boolean default true)
returns table(target text, campaign text, source text, content text)
language plpgsql security invoker set search_path = '' as $$
declare r record;
begin
 select c.campaign, c.source, c.mode, l.target into r
 from public.email_campaigns c join public.email_campaign_links l on l.campaign_id=c.id
 where c.id=p_campaign and l.label=p_label and c.mode in ('test','live','paused');
 if not found then return; end if;
 if p_count and r.mode in ('test','live') then
  insert into public.email_campaign_clicks(campaign_id,label,bucket,requests)
  values(p_campaign,p_label,date_trunc('minute',now()),1)
  on conflict(campaign_id,label,bucket) do update set requests=email_campaign_clicks.requests+1;
 end if;
 return query select r.target::text, r.campaign::text, r.source::text, p_label;
end;
$$;
revoke all on function public.resolve_email_campaign_link(uuid,text,boolean) from public,anon,authenticated;
grant execute on function public.resolve_email_campaign_link(uuid,text,boolean) to service_role;
comment on table public.email_campaign_clicks is 'Aggregate GET requests, including scanners/repeats. Not unique people or verified human clicks. Test campaigns must be reported separately. No recipient identifiers.';
notify pgrst, 'reload schema';
commit;
