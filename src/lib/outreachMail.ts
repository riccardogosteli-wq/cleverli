import { createClient } from '@supabase/supabase-js';
import { outreachRecipient } from './outreachCampaign';
export function outreachDb() {
 return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {auth:{persistSession:false,autoRefreshToken:false}});
}
export async function outreachStatus(value?: unknown) {
 let q=outreachDb().from('school_outreach_mail').select('*').eq('form_key','school-outreach').order('email');
 if(value!==undefined) q=q.eq('email',outreachRecipient(value).email);
 const {data,error}=await q;
 if(error||!data?.length) throw Error('outreach_store_unavailable');
 return data;
}
export async function reserveOutreach(value: unknown) {
 const {email}=outreachRecipient(value);
 if(process.env.VERCEL_ENV!=='production'||!process.env.RESEND_API_KEY) throw Error('production_send_disabled');
 const db=outreachDb();
 const {data,error}=await db.rpc('claim_school_outreach_mail',{recipient:email});
 if(error||data?.length!==1) throw Error('not_ready_or_already_reserved');
 return {db,email};
}
export async function persistOutreachReceipt(db: ReturnType<typeof outreachDb>,email:string,id:string) {
 const {data,error}=await db.from('school_outreach_mail').update({state:'sent',provider_id:id,sent_at:new Date().toISOString(),delivery_status:'accepted'})
 .eq('form_key','school-outreach').eq('email',email).eq('state','sending').select('provider_id').single();
 if(error||data?.provider_id!==id) throw Error('receipt_reconciliation_required');
}
