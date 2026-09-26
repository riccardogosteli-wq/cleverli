-- Additive only. The existing private_offer_mail is deliberately NOT reused:
-- its CHECK constraint permits only the earlier single-recipient campaign.
begin;
create table public.offer149_mail (
 campaign text not null check (campaign = 'offer149-v3-20260926'),
 recipient text not null,
 offer_id uuid not null references public.private_checkout_offers(id),
 state text not null default 'reserved' check (state in ('reserved','accepted')),
 body_hash text not null check (body_hash ~ '^[a-f0-9]{64}$'),
 claimed_at timestamptz not null,
 deadline bigint not null,
 provider_id text unique,
 accepted_at timestamptz,
 primary key (campaign,recipient),
 unique (campaign,offer_id)
);
alter table public.offer149_mail enable row level security;
revoke all on public.offer149_mail from public,anon,authenticated;
grant select,insert,update on public.offer149_mail to service_role;

create function public.reserve_offer149_mail(p_recipient text,p_offer uuid,p_user uuid,p_customer text,p_hash text,p_body text)
returns public.offer149_mail language plpgsql security definer set search_path = '' as $$
declare o public.private_checkout_offers; result public.offer149_mail;
 n timestamptz := clock_timestamp(); d bigint;
begin
 if not exists (select 1 from (values
 ('yvonne.hardegger@bluewin.ch','910c5c2f-2c8a-40ca-b6ff-2a985b8422b0'::uuid,'da952843-5ba2-4dda-850c-8b621403a63e'::uuid,'cus_VKUigLkAGKBvRY'),
 ('valbona_24@hotmail.de','944c7705-027a-4e83-8b43-ddb4fadd574f'::uuid,'73453fe0-c3fd-452e-8df5-f07b965b2c61'::uuid,'cus_VKUitgqbw2E8RC'),
 ('rebecca.locher@gmail.com','3065b4f1-a592-481f-a9ef-b3c01197bd2d'::uuid,'300c37b9-4e9f-4b7f-91f9-da56cf664d40'::uuid,'cus_VKUihPY7zCw21H'),
 ('sonja.balmer@edu3257.ch','9222b6e7-b1be-43ff-9527-73c6338be558'::uuid,'5e805510-f1c5-4347-a3fd-4fa144ca27f6'::uuid,'cus_VKUiE9xCJQud33'),
 ('hellen.mumu@yahoo.de','1c30c098-7dd2-4966-9694-8219d21b4360'::uuid,'578bde3b-a37b-498a-97d8-d9e8b08a106f'::uuid,'cus_VKUjzEnooh67Fa'),
 ('fricot.ste@gmail.com','c0e16d49-6fac-447e-b647-95fd6bed729f'::uuid,'0b3a22a2-c985-45ee-b330-c890a3b722dc'::uuid,'cus_VKUj2kBi6eTYZA'),
 ('hhhhwinisi@gmail.com','2430034c-12a8-4274-a0d0-50ff29842f12'::uuid,'acef6d4b-a3ea-47dd-a3ab-4ef6efeebfb4'::uuid,'cus_VKUjH3jmu1tulj'),
 ('miroslava.bley@gmail.com','09a89014-f1f3-477c-a226-29e7ea40e172'::uuid,'7040f10b-2d5b-4d4a-aa4a-1455a63c2cc8'::uuid,'cus_VKUjmEDodBRJaX'),
 ('bettina.huwyler@vsluzern.ch','71f23d4d-89b5-42b6-a397-fe183e749a22'::uuid,'1727787c-17f0-4a9c-a29b-d527ed5694eb'::uuid,'cus_VKUjP8gdDiCPTG')
 ) as approved(email,offer_id,user_id,customer_id)
 where email=p_recipient and offer_id=p_offer and user_id=p_user and customer_id=p_customer) then
 raise exception 'campaign_not_allowed'; end if;
 if exists(select 1 from public.offer219_mail where recipient=p_recipient) or exists(select 1 from public.trial_upgrade_mail where recipient=p_recipient) then raise exception 'already_contacted'; end if;
 select * into strict o from public.private_checkout_offers where id=p_offer for update;
 if o.user_id<>p_user or o.customer_id<>p_customer or o.token_hash<>p_hash or o.revoked or o.redeemed_session is not null or o.amount<>14900 or o.currency<>'chf' then raise exception 'offer_changed'; end if;
 if not exists(select 1 from public.parent_profiles p join auth.users u on u.id=p.id where p.id=p_user
 and lower(p.email)=p_recipient and lower(u.email)=p_recipient and not p.premium
 and (p.stripe_customer_id is null or p.stripe_customer_id=p_customer) and p.stripe_subscription_id is null
 and coalesce(p.premium_plan,'')<>'schooltime') then raise exception 'recipient_changed'; end if;
 d := floor(extract(epoch from n))::bigint + 604800;
 -- Unconditional INSERT is the irreversible reservation. Duplicate claims abort the
 -- transaction, including the deadline update. There is no reset/delete RPC.
 insert into public.offer149_mail(campaign,recipient,offer_id,body_hash,claimed_at,deadline)
 values ('offer149-v3-20260926',p_recipient,p_offer,p_body,n,d) returning * into result;
 update public.private_checkout_offers set deadline=d where id=p_offer;
 return result;
end;
$$;
revoke all on function public.reserve_offer149_mail(text,uuid,uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.reserve_offer149_mail(text,uuid,uuid,text,text,text) to service_role;
commit;
