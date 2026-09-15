begin;
-- Preserve all fourteen identities, receipts and permanent reservations.
alter table public.school_outreach_mail drop constraint school_outreach_mail_campaign_check;
alter table public.school_outreach_mail add constraint school_outreach_mail_campaign_check
 check(campaign in ('school-outreach-20260912','school-outreach-batch2-20260912','school-outreach-20260913','school-outreach-lisa-20260915','school-outreach-first3-20260915'));
insert into public.school_outreach_mail(form_key,email,campaign) values
 ('school-outreach','info@elternrat-steinacker.ch','school-outreach-first3-20260915'),
 ('school-outreach','schulleitung@schuledietwil.ch','school-outreach-first3-20260915'),
 ('school-outreach','schulleitung@schule-ermensee.ch','school-outreach-first3-20260915');
commit;
