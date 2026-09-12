begin;
-- The primary key deliberately excludes dated campaign IDs: reruns cannot resend.
create table public.school_outreach_mail (
 form_key text not null check(form_key='school-outreach'),
 email text not null check(email=lower(btrim(email))),
 campaign text not null check(campaign='school-outreach-20260912'),
 state text not null default 'blocked' check(state in ('blocked','ready','sending','sent','suppressed')),
 reviewed_at timestamptz,
 review_evidence text,
 claimed_at timestamptz,
 provider_id text unique,
 sent_at timestamptz,
 delivery_status text,
 primary key(form_key,email),
 check ((state='sent') = (provider_id is not null and sent_at is not null)),
 check (state not in ('ready','sending','sent') or (reviewed_at is not null and review_evidence is not null))
);
alter table public.school_outreach_mail enable row level security;
revoke all on public.school_outreach_mail from public,anon,authenticated,service_role;
grant select,update on public.school_outreach_mail to service_role;
insert into public.school_outreach_mail(form_key,email,campaign) values
 ('school-outreach','andreas.gaberthueel@schuleflaachtal.ch','school-outreach-20260912'),
 ('school-outreach','info@ilern.ch','school-outreach-20260912'),
 ('school-outreach','tanja.berger@niederglatt-zh.ch','school-outreach-20260912'),
 ('school-outreach','schulverwaltung@primarschulekappel.ch','school-outreach-20260912'),
 ('school-outreach','schulverwaltung@weiningen.ch','school-outreach-20260912');
-- No inserts, deletes or resetting an ambiguous reservation through the app role.
create function public.claim_school_outreach_mail(recipient text)
returns setof public.school_outreach_mail
language sql security definer set search_path = '' as $$
 update public.school_outreach_mail m set state='sending',claimed_at=now()
 where m.form_key='school-outreach' and m.email=lower(btrim(recipient)) and m.state='ready'
 and m.reviewed_at > now()-interval '24 hours'
 returning m.*;
$$;
revoke all on function public.claim_school_outreach_mail(text) from public,anon,authenticated;
grant execute on function public.claim_school_outreach_mail(text) to service_role;
-- Irreversible states remain locked even if future application code attempts a reset.
create function public.protect_school_outreach_mail() returns trigger
language plpgsql set search_path = '' as $$
begin
 if new.form_key<>old.form_key or new.email<>old.email or new.campaign<>old.campaign then
  raise exception 'immutable_outreach_identity';
 end if;
 if old.state in ('sending','sent','suppressed') and new.state<>old.state
    and not (old.state='sending' and new.state='sent') then
  raise exception 'outreach_reservation_locked';
 end if;
 if old.provider_id is not null and (new.provider_id is distinct from old.provider_id or new.sent_at is distinct from old.sent_at) then
  raise exception 'immutable_outreach_receipt';
 end if;
 return new;
end;
$$;
create trigger protect_school_outreach_mail before update on public.school_outreach_mail
for each row execute function public.protect_school_outreach_mail();
commit;
