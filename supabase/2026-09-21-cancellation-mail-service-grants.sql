-- Supabase default privileges may grant service_role direct DML on newly created tables.
-- Keep access read-only; writes must go through the reviewed security-definer RPCs.
begin;
revoke all on public.cancellation_mail_activation,public.cancellation_mail_outbox from service_role;
grant select on public.cancellation_mail_activation,public.cancellation_mail_outbox to service_role;
commit;
