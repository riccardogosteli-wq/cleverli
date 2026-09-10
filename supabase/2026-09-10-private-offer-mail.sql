begin;
create table public.private_offer_mail (
 id text primary key check(id='slavica-approved-v3-5494'),
 tracking_id uuid not null unique default gen_random_uuid(),
 state text not null default 'draft' check(state in ('draft','sending','sent')),
 body_hash text, claimed_at timestamptz, sent_at timestamptz,
 provider_id text unique
);
create table public.private_offer_mail_clicks (
 mail_id text not null references public.private_offer_mail(id),
 label text not null check(label in ('yearly','lifetime','home','privacy','imprint')),
 bucket timestamptz not null,
 created_at timestamptz not null default now(),
 primary key(mail_id,label,bucket)
);
alter table public.private_offer_mail enable row level security;
alter table public.private_offer_mail_clicks enable row level security;
revoke all on public.private_offer_mail,public.private_offer_mail_clicks from public,anon,authenticated;
grant all on public.private_offer_mail,public.private_offer_mail_clicks to service_role;
commit;
