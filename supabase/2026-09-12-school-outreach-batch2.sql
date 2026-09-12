begin;
-- Preserve the original five identities and irreversible reservation safeguards.
alter table public.school_outreach_mail drop constraint school_outreach_mail_campaign_check;
alter table public.school_outreach_mail add constraint school_outreach_mail_campaign_check
 check(campaign in ('school-outreach-20260912','school-outreach-batch2-20260912'));
insert into public.school_outreach_mail(form_key,email,campaign) values
 ('school-outreach','sarina.baumann@seuzach.ch','school-outreach-batch2-20260912'),
 ('school-outreach','redaktion@familienleben.ch','school-outreach-batch2-20260912'),
 ('school-outreach','letsfamily@present-service.ch','school-outreach-batch2-20260912');
commit;
