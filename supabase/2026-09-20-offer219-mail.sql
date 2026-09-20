-- Additive only. The existing private_offer_mail is deliberately NOT reused:
-- its CHECK constraint permits only the earlier single-recipient campaign.
begin;
create table public.offer219_mail (
 campaign text not null check (campaign = 'offer219-v3-20260920'),
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
alter table public.offer219_mail enable row level security;
revoke all on public.offer219_mail from public,anon,authenticated;
grant select,insert,update on public.offer219_mail to service_role;

create function public.reserve_offer219_mail(p_recipient text,p_offer uuid,p_user uuid,p_customer text,p_hash text,p_body text)
returns public.offer219_mail language plpgsql security definer set search_path = '' as $$
declare o public.private_checkout_offers; result public.offer219_mail;
 n timestamptz := clock_timestamp(); d bigint;
begin
 if not exists (select 1 from (values
 ('stephan-michi@gmx.net','592407b7-8c6f-4a84-b586-b54ed7114ac4'::uuid,'bb7c9111-8560-42a8-939c-2a3a4e70179c'::uuid,'cus_VIOXq9aXmNgCJh'),
 ('aysekayagaziantep@gmail.com','6fed355d-2249-4e29-88ed-6f1bcae17f11'::uuid,'aab1c98c-fc2c-4276-8570-1ccb487cac4e'::uuid,'cus_VIOX91WASqmKUS'),
 ('theepthivilvarasa@gmail.com','2c79912b-e7a2-422e-87da-8f8a69c5b017'::uuid,'4d71f093-a31d-4749-a206-2fb222de07b2'::uuid,'cus_VIOXY97m0Plmv2'),
 ('michi676@gmail.com','cf739e56-95aa-413d-a5f0-2987cc109f26'::uuid,'e14efc49-8c32-4c5f-b882-32b18c21b839'::uuid,'cus_VIOX22Zt5iJ1qD'),
 ('noemicarigiet@gmx.ch','3087373e-2cf4-460b-913e-0f070e4fcee3'::uuid,'af0fdb84-0056-4b05-bfaa-9ba96b7a8cc0'::uuid,'cus_VIOXih1pskrPxu'),
 ('pati91@gmx.ch','2cf831dd-f18b-4783-8dc2-8c9fe364b7e9'::uuid,'c10cd0ac-0371-45d3-bef6-7b59f5be368d'::uuid,'cus_VIOX2Z8DJd7DOQ'),
 ('nazihsidali@gmail.com','f445f420-8df3-4e7f-8d71-0c91cf34afcf'::uuid,'e07b990f-c6a3-4e80-8b0b-d2dc4668463c'::uuid,'cus_VIIkfdUpE0tdKA'),
 ('larina.ganser@icloud.com','7adfac25-6eb7-4bca-b015-4e15f94cb8ae'::uuid,'89138dc9-c2f2-4523-b1be-6aa827ff72a1'::uuid,'cus_VIOXECjyahlDWy'),
 ('simonecoray@outlook.com','202f3d47-8820-4c27-863d-32201d12234d'::uuid,'21f3f86f-3e6a-420b-8378-50a57737991d'::uuid,'cus_VIOXJ9ZmUdtxXW'),
 ('kristinashala@icloud.ch','a3efc09f-7f72-4765-bf6c-c5451cd1b4d6'::uuid,'ed461453-9ea1-4e84-82c6-2f00631355d5'::uuid,'cus_VIOXmtXYqmFGo4'),
 ('alilib@gmx.ch','3e99d1fe-8399-4270-a08b-c12227bfb11d'::uuid,'a58e26f7-5945-4bae-a5fe-23ce097535da'::uuid,'cus_VIOX3G5TrriVOU'),
 ('sheribane.xh@hotmail.com','c319e849-a79c-4dbc-844f-ad96cd10505e'::uuid,'99632dc6-3fd1-40f4-916c-d9fc8beac169'::uuid,'cus_VGty2ncNlKEf26'),
 ('hp.luginbuehl@ggs.ch','7896b9c9-480b-4c3a-8841-60d0ca3e68ce'::uuid,'9e9242e8-75c7-4837-9419-dc4d4b0c6bb3'::uuid,'cus_VIOX2Pr0BNGnoq'),
 ('ucanmakeit@gmail.com','fcc71cbe-32e6-4013-9c80-208e79e17feb'::uuid,'1b2b335b-3816-4158-b231-c83c6e881d33'::uuid,'cus_VIOXW4kZhCOOLO'),
 ('tanjusa_26@hotmail.com','8699f77f-2dad-44d5-b444-2a22926ddf2c'::uuid,'0ff1e228-b376-4e83-8d8a-448d2b3765a2'::uuid,'cus_VIOXTxMxulmtgC'),
 ('nadiaschaub@gmx.ch','519adec8-78b0-49b0-9e08-40bb9d324687'::uuid,'214d0e3f-abd5-4f17-8c27-15a7861249bc'::uuid,'cus_VIOXDMQNhA9UEs'),
 ('oona.kelmendi@schulen.olten.ch','719d5639-6d55-4ae4-b12f-9837be179f9a'::uuid,'c04c661b-4da3-4e96-80f1-8aba3c911f30'::uuid,'cus_VIOXp13YfVVdDA'),
 ('claudia.hirt@schule-pieterlen.ch','643afdc5-8943-4cd7-98b0-4a0d024011c9'::uuid,'d3ec20fc-f5d4-459f-961d-d227120272a1'::uuid,'cus_VIOXigBxzthg9c'),
 ('cj42cn@hotmail.com','62cd4cc7-31a1-44b3-b157-11adee9427ab'::uuid,'7cae8578-1ea0-470e-b08a-f9ae18e333ac'::uuid,'cus_VIOXLifNYkfGJE'),
 ('grossniklaussidler@gmail.com','a7e4c3af-42a5-490e-9ae7-a0be9f3c5fd8'::uuid,'636e2dbd-4a72-4794-b27c-89578771418a'::uuid,'cus_VIOXziegvV9dKn')
 ) as approved(email,offer_id,user_id,customer_id)
 where email=p_recipient and offer_id=p_offer and user_id=p_user and customer_id=p_customer) then
 raise exception 'campaign_not_allowed'; end if;
 select * into strict o from public.private_checkout_offers where id=p_offer for update;
 if o.user_id<>p_user or o.customer_id<>p_customer or o.token_hash<>p_hash or o.revoked or o.redeemed_session is not null or o.amount<>21900 or o.currency<>'chf' then raise exception 'offer_changed'; end if;
 if not exists(select 1 from public.parent_profiles p join auth.users u on u.id=p.id where p.id=p_user
 and lower(p.email)=p_recipient and lower(u.email)=p_recipient and not p.premium
 and (p.stripe_customer_id is null or p.stripe_customer_id=p_customer) and p.stripe_subscription_id is null
 and coalesce(p.premium_plan,'')<>'schooltime') then raise exception 'recipient_changed'; end if;
 d := floor(extract(epoch from n))::bigint + 604800;
 -- Unconditional INSERT is the irreversible reservation. Duplicate claims abort the
 -- transaction, including the deadline update. There is no reset/delete RPC.
 insert into public.offer219_mail(campaign,recipient,offer_id,body_hash,claimed_at,deadline)
 values ('offer219-v3-20260920',p_recipient,p_offer,p_body,n,d) returning * into result;
 update public.private_checkout_offers set deadline=d where id=p_offer;
 return result;
end;
$$;
revoke all on function public.reserve_offer219_mail(text,uuid,uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.reserve_offer219_mail(text,uuid,uuid,text,text,text) to service_role;
commit;
