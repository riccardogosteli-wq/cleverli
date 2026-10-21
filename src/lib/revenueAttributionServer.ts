import { createHmac, timingSafeEqual } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { parseAdsExperimentMetadata, type AdsExperimentAttribution } from './adsAbVariant';
import { exposureSnapshot, REVENUE_COOKIE, type RevenueSnapshot } from './revenueAttribution';
export function revenueDb(){return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false}});}
function secret(){const s=process.env.STRIPE_WEBHOOK_SECRET;if(!s)throw new Error('attribution_signing_unavailable');return s;}
export function signRevenueCookie(s:RevenueSnapshot){const body=Buffer.from(JSON.stringify(s)).toString('base64url');return body+'.'+createHmac('sha256',secret()).update('revenue-v1:'+body).digest('base64url');}
export function readRevenueCookie(value?:string):RevenueSnapshot|null {
 if(!value||value.length>2500)return null;
 try{const [body,sig,extra]=value.split('.');if(extra||!body||!sig)return null;const wanted=createHmac('sha256',secret()).update('revenue-v1:'+body).digest();const got=Buffer.from(sig,'base64url');if(got.length!==wanted.length||!timingSafeEqual(got,wanted))return null;const s=JSON.parse(Buffer.from(body,'base64url').toString()) as RevenueSnapshot;const at=Date.parse(s.captured_at);if(s.version!=='1'||!Number.isFinite(at)||at>Date.now()+60000||Date.now()-at>180*86400000)return null;return s;}catch{return null;}
}
export async function persistRevenueExposure(current:RevenueSnapshot|null){
 if(!current?.visitor_id)return;
 const {error}=await revenueDb().from('revenue_exposures').upsert({visitor_id:current.visitor_id,cohort:current.cohort,snapshot:current},{onConflict:'visitor_id,cohort',ignoreDuplicates:true});
 if(error)throw new Error('attribution_exposure_persist_failed');
}
export async function freezeCheckoutRevenue(key:string,userId:string,snapshot:RevenueSnapshot):Promise<RevenueSnapshot>{
 const db=revenueDb();const saved=await db.from('revenue_checkout_snapshots').upsert({checkout_key:key,user_id:userId,snapshot},{onConflict:'checkout_key',ignoreDuplicates:true});
 if(saved.error)throw new Error('checkout_snapshot_persist_failed');
 const r=await db.from('revenue_checkout_snapshots').select('user_id,snapshot').eq('checkout_key',key).single();
 if(r.error||r.data.user_id!==userId)throw new Error('checkout_snapshot_read_failed');return r.data.snapshot as RevenueSnapshot;
}
export async function bindRevenueAccount(userId:string,current:RevenueSnapshot|null){
 await persistRevenueExposure(current);
 // QA traffic is excluded without poisoning a real customer's first exposure.
 if(current?.cohort==='qa')current=null;
 const db=revenueDb();
 const exposures:RevenueSnapshot[]=[];
 if(current?.visitor_id){const history=await db.from('revenue_exposures').select('snapshot').eq('visitor_id',current.visitor_id).neq('cohort','qa').order('observed_at').limit(10);if(history.error)throw Error('attribution_exposure_read_failed');exposures.push(...history.data.map(x=>x.snapshot as RevenueSnapshot));}
 if(current&&!exposures.length)exposures.push(current);
 let row:{first_exposure:RevenueSnapshot|null;latest_exposure:RevenueSnapshot|null;conflict:boolean}|null=null;
 for(const exposure of exposures.length?exposures:[null]){const {data,error}=await db.rpc('bind_revenue_attribution',{p_user:userId,p_exposure:exposure});if(error||!data)throw new Error('attribution_account_persist_failed');row=Array.isArray(data)?data[0]:data;}
 return row!;
}
export async function resolveCheckoutRevenue(userId:string,context:string,req?:NextRequest,explicit?:AdsExperimentAttribution|null):Promise<RevenueSnapshot>{
 const db=revenueDb();const {data,error}=await db.auth.admin.getUserById(userId);if(error||!data.user)throw new Error('attribution_user_unavailable');
 const cookie=readRevenueCookie(req?.cookies.get(REVENUE_COOKIE)?.value);
 const current=exposureSnapshot(explicit??null,'checkout_observed')||cookie||exposureSnapshot(parseAdsExperimentMetadata(data.user.user_metadata),'saved_auth_metadata');
 if(current?.cohort==='qa')return {...current,checkout_context:context.slice(0,80),checkout_cohort:'qa'};
 if(cookie&&cookie.cohort!=='qa')await bindRevenueAccount(userId,cookie);
 const row=await bindRevenueAccount(userId,current);
 const first=row.first_exposure;const base:RevenueSnapshot=first?{...first}:{version:'1',cohort:'outside_experiment',evidence:'no_observed_experiment_at_checkout',captured_at:new Date().toISOString()};
 return {...base,cohort:row.conflict?'conflicting_exposures':base.cohort,checkout_context:context.slice(0,80),checkout_cohort:current?.cohort||base.cohort,evidence:row.conflict?'account_exposure_conflict':first?'persisted_account_first_exposure':base.evidence};
}
