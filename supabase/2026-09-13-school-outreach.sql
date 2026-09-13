begin;
-- Preserve all eight prior identities, receipts and irreversible reservation safeguards.
alter table public.school_outreach_mail drop constraint school_outreach_mail_campaign_check;
alter table public.school_outreach_mail add constraint school_outreach_mail_campaign_check
 check(campaign in ('school-outreach-20260912','school-outreach-batch2-20260912','school-outreach-20260913'));
insert into public.school_outreach_mail(form_key,email,campaign) values
 ('school-outreach','thomas.kurer@schule-gais.ar.ch','school-outreach-20260913'),
 ('school-outreach','tobias.ernst@psduggingen.ch','school-outreach-20260913'),
 ('school-outreach','direktion.ps.st.antoni@edufr.ch','school-outreach-20260913'),
 ('school-outreach','direktion.ps.kerzers@edufr.ch','school-outreach-20260913'),
 ('school-outreach','melanie.helfenstein@schule-oberkirch.ch','school-outreach-20260913');
commit;
