-- Apply after base mail and upgrade-guard migrations, before releasing the code.
-- No backfill: all pre-existing pending rows remain unready until a verified
-- webhook retry successfully synchronises and explicitly marks its row ready.
begin;
alter table public.cancellation_mail_outbox add column if not exists ready_at timestamptz;
create index if not exists cancellation_mail_ready_due on public.cancellation_mail_outbox(next_attempt_at)
 where state='pending' and ready_at is not null;
create or replace function public.ready_cancellation_mail(p_id uuid)
returns boolean language plpgsql security definer set search_path='' as $$
declare r public.cancellation_mail_outbox;
begin
 select * into r from public.cancellation_mail_outbox where id=p_id;
 if not found then return false; end if;
 -- Called only AFTER successful sync; recheck binding before durable readiness.
 perform 1 from public.parent_profiles p join auth.users u on u.id=p.id
 where p.id=r.user_id and coalesce(p.premium_plan,'')<>'schooltime'
 and p.stripe_customer_id=r.customer_id and p.stripe_subscription_id=r.subscription_id
 and lower(trim(p.email))=lower(trim(u.email)) and lower(trim(u.email))=r.payload->>'to'
 for update of p;
 if not found then return false; end if;
 -- Same profile -> outbox lock order as enqueue, avoiding a cross-path deadlock.
 select * into r from public.cancellation_mail_outbox where id=p_id for update;
 if not found then return false; end if;
 if r.ready_at is not null then return true; end if;
 if r.state<>'pending' or r.end_at<=clock_timestamp()
 or exists(select 1 from public.trial_upgrade_offers where subscription_id=r.subscription_id) then return false; end if;
 update public.cancellation_mail_outbox set ready_at=clock_timestamp() where id=p_id;
 return true;
end;
$$;
create or replace function public.claim_cancellation_mail(p_id uuid)
returns public.cancellation_mail_outbox language plpgsql security definer set search_path='' as $$
declare r public.cancellation_mail_outbox; n timestamptz:=clock_timestamp();
begin
 select * into r from public.cancellation_mail_outbox where id=p_id for update;
 if not found or r.ready_at is null or r.state<>'pending' or r.next_attempt_at>n or r.lease_until>n then return null; end if;
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
revoke all on function public.ready_cancellation_mail(uuid),public.claim_cancellation_mail(uuid) from public,anon,authenticated;
grant execute on function public.ready_cancellation_mail(uuid),public.claim_cancellation_mail(uuid) to service_role;
commit;
