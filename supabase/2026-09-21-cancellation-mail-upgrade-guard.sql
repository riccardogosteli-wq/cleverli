-- Apply after 2026-09-21-cancellation-mail.sql. Safe if the base migration was already applied.
-- Adds the authoritative pending/settled upgrade exclusion without changing the
-- activation fence, existing outbox rows, receipts, grants or trial-upgrade data.
begin;
create or replace function public.enqueue_cancellation_mail(p_event text,p_created bigint,p_user uuid,p_subscription text,p_customer text,p_cancelled bigint,p_end timestamptz,p_access boolean,p_payload jsonb)
returns public.cancellation_mail_outbox language plpgsql security definer set search_path='' as $$
declare r public.cancellation_mail_outbox; n timestamptz:=clock_timestamp(); fence bigint;
begin
 select not_before into strict fence from public.cancellation_mail_activation where singleton;
 if p_created<fence or p_cancelled<fence or p_created>extract(epoch from n)+300 or p_cancelled>p_created+300 or p_end<=n then raise exception 'not_future_confirmation'; end if;
 if p_payload->>'from' is distinct from 'Cleverli <hello@cleverli.ch>' or p_payload->>'replyTo' is distinct from 'hello@cleverli.ch' then raise exception 'sender_not_allowed'; end if;
 if exists(select 1 from public.trial_upgrade_offers where subscription_id=p_subscription) then raise exception 'trial_upgrade_excluded'; end if;
 -- Freeze verified recipient. Never derive it from an untrusted event email field.
 perform 1 from public.parent_profiles p join auth.users u on u.id=p.id
 where p.id=p_user and coalesce(p.premium_plan,'')<>'schooltime'
 and p.stripe_customer_id=p_customer and (p.stripe_subscription_id=p_subscription or p.stripe_subscription_id is null)
 and lower(trim(p.email))=lower(trim(u.email)) and lower(trim(u.email))=p_payload->>'to'
 for update of p;
 if not found then raise exception 'recipient_identity_changed'; end if;
 insert into public.cancellation_mail_outbox(source_event_id,event_created,user_id,subscription_id,customer_id,cancelled_at,end_at,access_active,payload)
 values(p_event,p_created,p_user,p_subscription,p_customer,p_cancelled,p_end,p_access,p_payload)
 on conflict(subscription_id,cancelled_at) do nothing;
 select * into strict r from public.cancellation_mail_outbox where subscription_id=p_subscription and cancelled_at=p_cancelled;
 if r.user_id<>p_user or r.customer_id<>p_customer then raise exception 'confirmation_identity_conflict'; end if;
 return r;
end;
$$;

create or replace function public.claim_cancellation_mail(p_id uuid)
returns public.cancellation_mail_outbox language plpgsql security definer set search_path='' as $$
declare r public.cancellation_mail_outbox; n timestamptz:=clock_timestamp();
begin
 select * into r from public.cancellation_mail_outbox where id=p_id for update;
 if not found or r.state<>'pending' or r.next_attempt_at>n or r.lease_until>n then return null; end if;
 -- Resend idempotency is bounded. Never automatically resend ambiguous work after 23h.
 if r.first_attempt_at is not null and r.first_attempt_at<=n-interval '23 hours' then
  update public.cancellation_mail_outbox set state='review',lease_id=null,lease_until=null where id=p_id; return null;
 end if;
 if r.end_at<=n or exists(select 1 from public.trial_upgrade_offers where subscription_id=r.subscription_id) then
  update public.cancellation_mail_outbox set state='suppressed',lease_id=null,lease_until=null where id=p_id; return null;
 end if;
 update public.cancellation_mail_outbox set first_attempt_at=coalesce(first_attempt_at,n),attempts=attempts+1,
 lease_id=gen_random_uuid(),lease_until=n+interval '5 minutes' where id=p_id returning * into r;
 return r;
end;
$$;
revoke all on function public.enqueue_cancellation_mail(text,bigint,uuid,text,text,bigint,timestamptz,boolean,jsonb),public.claim_cancellation_mail(uuid) from public,anon,authenticated;
grant execute on function public.enqueue_cancellation_mail(text,bigint,uuid,text,text,bigint,timestamptz,boolean,jsonb),public.claim_cancellation_mail(uuid) to service_role;
commit;
