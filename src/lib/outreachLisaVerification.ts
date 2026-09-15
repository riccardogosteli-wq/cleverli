import { Resend } from 'resend';
import { outreachStatus } from './outreachMail';

export const LISA_EMAIL = 'lisa.noser@hotmail.com';
export const VERIFIED_OUTREACH_EMAILS = [LISA_EMAIL, 'info@elternrat-steinacker.ch', 'schulleitung@schuledietwil.ch', 'schulleitung@schule-ermensee.ch'] as const;
// Read-only provider verification. No caller-controlled recipient, ID or API path.
export async function verifyLisaProvider(email: string = LISA_EMAIL) {
 if (!VERIFIED_OUTREACH_EMAILS.some(e => e === email)) throw Error('provider_unapproved_recipient');
 if (!process.env.RESEND_API_KEY) throw Error('provider_unavailable');
 const provider = new Resend(process.env.RESEND_API_KEY);
 const history: {id:string;to:string[];subject:string;last_event:string}[] = [];
 const suppressions: {email:string;origin:string}[] = [];
 let scanned = 0;
 for (const kind of ['emails','suppressions'] as const) {
  let after: string | undefined;
  const seen = new Set<string>();
  let complete = false;
  for (let page=0;page<100;page++) {
   const result = kind === 'emails' ? await provider.emails.list({limit:100,...(after?{after}:{})}) : await provider.suppressions.list({limit:100,...(after?{after}:{})});
   if(result.error) throw Error('provider_read_unavailable_'+kind+'_'+(result.error.statusCode||0));
   if(!result.data || !Array.isArray(result.data.data) || typeof result.data.has_more !== 'boolean') throw Error('provider_read_unavailable');
   const rows=result.data.data;
   scanned+=rows.length;
   for(const row of rows) {
    if(kind==='emails' && 'to' in row && [...row.to,...(row.cc||[]),...(row.bcc||[])].some(e=>e.toLowerCase()===email)) history.push({id:row.id,to:row.to,subject:row.subject,last_event:row.last_event});
    if(kind==='suppressions' && 'email' in row && row.email.toLowerCase()===email) suppressions.push({email:row.email,origin:row.origin});
   }
   if(!result.data.has_more){complete=true;break;}
   const cursor=rows.at(-1)?.id;
   if(!cursor||seen.has(cursor)) throw Error('provider_pagination_incomplete');
   seen.add(cursor);after=cursor;
   await new Promise(resolve=>setTimeout(resolve,600));
  }
  if(!complete)throw Error('provider_pagination_incomplete');
  await new Promise(resolve=>setTimeout(resolve,600));
 }
 const ledger=await outreachStatus();
 const row=ledger.find(r=>r.email===email);
 let receipt=null;
 if(row?.provider_id) {
  const result=await provider.emails.get(row.provider_id);
  if(result.error||!result.data)throw Error('provider_receipt_unavailable');
  const r=result.data;
  if(r.to.length!==1||r.to[0].toLowerCase()!==email)throw Error('provider_recipient_mismatch');
  receipt={id:r.id,to:r.to,from:r.from,reply_to:r.reply_to,subject:r.subject,cc:r.cc,bcc:r.bcc,last_event:r.last_event,created_at:r.created_at};
 }
 return {email,checkedAt:new Date().toISOString(),complete:true,scanned,history,suppressions,clear:history.length===0&&suppressions.length===0,receipt};
}
