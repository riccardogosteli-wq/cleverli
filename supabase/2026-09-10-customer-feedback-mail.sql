begin;
-- The primary key deliberately excludes dated campaign IDs: reruns cannot resend.
create table public.customer_feedback_mail (
 form_key text not null check(form_key='premium-kunden'),
 email text not null check(email=lower(btrim(email))),
 campaign text not null,
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
alter table public.customer_feedback_mail enable row level security;
revoke all on public.customer_feedback_mail from public,anon,authenticated,service_role;
grant select,update on public.customer_feedback_mail to service_role;
insert into public.customer_feedback_mail(form_key,email,campaign) values
 ('premium-kunden','ale.ga@gmx.net','premium-feedback-20260910'),
 ('premium-kunden','ardnas_mueller@bluemail.ch','premium-feedback-20260910'),
 ('premium-kunden','astrid.prenza1@gmail.com','premium-feedback-20260910'),
 ('premium-kunden','familiebuechel@gmx.net','premium-feedback-20260910'),
 ('premium-kunden','family@maurer-boll.ch','premium-feedback-20260910'),
 ('premium-kunden','isa-caro@gmx.de','premium-feedback-20260910'),
 ('premium-kunden','jstaubli@icloud.com','premium-feedback-20260910'),
 ('premium-kunden','kosova42@gmail.com','premium-feedback-20260910'),
 ('premium-kunden','kosta.danilis@gmail.com','premium-feedback-20260910'),
 ('premium-kunden','manuel.weber@bluemail.ch','premium-feedback-20260910'),
 ('premium-kunden','meisa@gmx.ch','premium-feedback-20260910'),
 ('premium-kunden','nrdabagh@gmail.com','premium-feedback-20260910'),
 ('premium-kunden','pe@tca.ch','premium-feedback-20260910'),
 ('premium-kunden','pgaetzi@posteo.de','premium-feedback-20260910'),
 ('premium-kunden','ramona.1995@windowslive.com','premium-feedback-20260910'),
 ('premium-kunden','sabibo@gmx.ch','premium-feedback-20260910'),
 ('premium-kunden','stephanievoegeli90@gmail.com','premium-feedback-20260910');
-- No inserts, deletes or resetting an ambiguous reservation through the app role.
create function public.claim_customer_feedback_mail(recipient text)
returns setof public.customer_feedback_mail
language sql security definer set search_path = '' as $$
 update public.customer_feedback_mail m set state='sending',claimed_at=now()
 where m.form_key='premium-kunden' and m.email=lower(btrim(recipient)) and m.state='ready'
 and m.reviewed_at > now()-interval '24 hours'
 and exists(select 1 from public.parent_profiles p join auth.users u on u.id=p.id
   where lower(u.email)=m.email and p.premium=true
   and p.premium_plan in ('monthly','yearly')
   and (p.premium_until is null or p.premium_until>now()))
 returning m.*;
$$;
revoke all on function public.claim_customer_feedback_mail(text) from public,anon,authenticated;
grant execute on function public.claim_customer_feedback_mail(text) to service_role;
-- Irreversible states remain locked even if future application code attempts a reset.
create function public.protect_customer_feedback_mail() returns trigger
language plpgsql set search_path = '' as $$
begin
 if new.form_key<>old.form_key or new.email<>old.email or new.campaign<>old.campaign then
  raise exception 'immutable_feedback_identity';
 end if;
 if old.state in ('sending','sent','suppressed') and new.state<>old.state
    and not (old.state='sending' and new.state='sent') then
  raise exception 'feedback_reservation_locked';
 end if;
 if old.provider_id is not null and (new.provider_id is distinct from old.provider_id or new.sent_at is distinct from old.sent_at) then
  raise exception 'immutable_feedback_receipt';
 end if;
 return new;
end;
$$;
create trigger protect_customer_feedback_mail before update on public.customer_feedback_mail
for each row execute function public.protect_customer_feedback_mail();
commit;
