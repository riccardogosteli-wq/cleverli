import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { PRIVATE_OFFER_EMAIL_TEMPLATE } from './privateOfferEmailTemplate';
export const MAIL_ID = 'slavica-approved-v3-5494';
export const SUBJECT = 'Können wir dir bei Cleverli helfen?';
export const FROM = 'Cleverli <hello@cleverli.ch>';
export const TO = 'slavica.nevistic@hotmail.com';
export const DEADLINE = Date.parse('2026-09-13T22:00:00Z');
export const LINKS: Record<string,string> = {yearly:'https://www.cleverli.ch/login?checkout=yearly&source=slavica_email_v2',lifetime:'https://www.cleverli.ch/offer/personal',home:'https://www.cleverli.ch',privacy:'https://www.cleverli.ch/datenschutz',imprint:'https://www.cleverli.ch/impressum'};
export const digest = (s:string) => createHash('sha256').update(s).digest('hex');
export function mailDb() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}}); }
export function extractCapability(html:string) {
 const match=html.match(/https:\/\/www\.cleverli\.ch\/offer\/personal#([a-f0-9]{64})/);
 if(!match || html.replace(match[0],'__PRIVATE_OFFER_URL__')!==PRIVATE_OFFER_EMAIL_TEMPLATE) throw Error('approved_artifact_mismatch');
 return match[1];
}
export function renderMail(token:string,tracking:string) {
 if(!/^[a-f0-9]{64}$/.test(token)|| !/^[a-f0-9-]{36}$/.test(tracking))throw Error('invalid_material');
 let html=PRIVATE_OFFER_EMAIL_TEMPLATE.replace('__PRIVATE_OFFER_URL__',LINKS.lifetime+'#'+token);
 for(const [label,url] of Object.entries(LINKS)){
  const escaped=url.replaceAll('&','&amp;');
  html=html.replace('href="'+escaped+(label==='lifetime'?'#'+token:'')+'"','href="https://www.cleverli.ch/offer/click/'+tracking+'/'+label+(label==='lifetime'?'#'+token:'')+'"');
 }
 return html;
}
export async function prepareMail(artifact:string) {
 const token=extractCapability(artifact),db=mailDb();
 const {data:offer,error}=await db.from('private_checkout_offers').select('*').eq('token_hash',digest(token)).single();
 if(error||!offer||offer.user_id!=='9155188e-10e4-476c-8ab9-7d4830a57f63'||offer.customer_id!=='cus_VEFNMadoaR5oEQ'||offer.revoked||offer.redeemed_session||offer.amount!==19900||offer.currency!=='chf'||Number(offer.deadline)!==DEADLINE/1000||Date.now()>=DEADLINE)throw Error('offer_not_ready');
 const {error:insertError}=await db.from('private_offer_mail').upsert({id:MAIL_ID},{onConflict:'id',ignoreDuplicates:true});if(insertError)throw Error('mail_store_unavailable');
 const {data:row,error:readError}=await db.from('private_offer_mail').select('*').eq('id',MAIL_ID).single();if(readError||!row)throw Error('mail_store_unavailable');
 const html=renderMail(token,row.tracking_id);return {db,row,html,bodyHash:digest(html)};
}
export async function sendFixedMail(artifact:string) {
 if(process.env.VERCEL_ENV!=='production'||process.env.PRIVATE_OFFER_MAIL_SEND_ENABLED!=='true')throw Error('production_send_disabled');
 const {db,row,html,bodyHash}=await prepareMail(artifact);
 if(row.provider_id)return {id:row.provider_id,reused:true};
 if(row.body_hash&&row.body_hash!==bodyHash)throw Error('body_changed');
 // Persist one irreversible reservation. An ambiguous send is never automatically retried.
 const {data:claim,error}=await db.from('private_offer_mail').update({state:'sending',body_hash:bodyHash,claimed_at:new Date().toISOString()}).eq('id',MAIL_ID).eq('state','draft').select('id').maybeSingle();
 if(error||!claim)throw Error('receipt_reconciliation_required');
 const resend=new Resend(process.env.RESEND_API_KEY!);
 const {data,error:sendError}=await resend.emails.send({from:FROM,to:TO,replyTo:'hello@cleverli.ch',subject:SUBJECT,html,tags:[{name:'offer',value:MAIL_ID}]},{idempotencyKey:MAIL_ID});
 if(sendError||!data?.id)throw Error('receipt_reconciliation_required');
 const {error:saveError}=await db.from('private_offer_mail').update({provider_id:data.id,state:'sent',sent_at:new Date().toISOString()}).eq('id',MAIL_ID).eq('state','sending');
 if(saveError)throw Error('receipt_reconciliation_required');
 return {id:data.id,reused:false};
}
