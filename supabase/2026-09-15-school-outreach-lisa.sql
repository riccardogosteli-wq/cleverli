begin;
-- Preserve all thirteen identities, receipts and permanent reservations.
alter table public.school_outreach_mail drop constraint school_outreach_mail_campaign_check;
alter table public.school_outreach_mail add constraint school_outreach_mail_campaign_check
 check(campaign in ('school-outreach-20260912','school-outreach-batch2-20260912','school-outreach-20260913','school-outreach-lisa-20260915'));
insert into public.school_outreach_mail(form_key,email,campaign) values
 ('school-outreach','lisa.noser@hotmail.com','school-outreach-lisa-20260915');
commit;
