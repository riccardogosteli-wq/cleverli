-- Separate operational ledger. No changes to advertising/conversion events.
begin;
create table if not exists public.worksheet_download_events (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 user_id uuid references auth.users(id) on delete set null,
 access_type text not null check (access_type in ('free','premium','teacher')),
 topic_id text not null check (length(topic_id) between 1 and 120),
 title text not null check (length(title) between 1 and 200),
 grade smallint not null check (grade between 1 and 6),
 subject text not null check (length(subject) between 1 and 40),
 file_type text not null check (file_type in ('worksheet','solution')),
 file_sha256 text not null check (file_sha256 ~ '^[a-f0-9]{64}$'),
 file_bytes integer not null check (file_bytes > 0),
 source_path text,
 is_qa boolean not null default false,
 is_automated boolean not null default false,
 qa_reason text,
 check (access_type <> 'free' or user_id is null),
 check ((is_qa and qa_reason is not null) or (not is_qa and qa_reason is null))
);
alter table public.worksheet_download_events add column if not exists is_automated boolean not null default false;
comment on table public.worksheet_download_events is 'Successful PDF server responses, not proof of saving/printing. QA and previews excluded from normal reports. No IP, browser identifiers, child IDs or email snapshots.';
create index if not exists worksheet_download_events_created on public.worksheet_download_events(created_at desc);
create index if not exists worksheet_download_events_user on public.worksheet_download_events(user_id,created_at desc) where user_id is not null;
create index if not exists worksheet_download_events_real on public.worksheet_download_events(access_type,created_at desc) where not is_qa;
alter table public.worksheet_download_events enable row level security;
revoke all on public.worksheet_download_events from public,anon,authenticated;
grant select,insert,delete on public.worksheet_download_events to service_role;
notify pgrst, 'reload schema';
commit;
