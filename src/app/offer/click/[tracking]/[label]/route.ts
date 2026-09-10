import { NextResponse } from 'next/server';
import { LINKS,MAIL_ID,mailDb } from '@/lib/privateOfferMail';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow'};
export async function GET(_req:Request,{params}:{params:Promise<{tracking:string,label:string}>}){
 const {tracking,label}=await params;
 if(!/^[a-f0-9-]{36}$/.test(tracking)||!Object.hasOwn(LINKS,label))return new NextResponse('Nicht verfügbar',{status:404,headers});
 try{
  const db=mailDb();const {data:mail,error}=await db.from('private_offer_mail').select('id,state,provider_id').eq('tracking_id',tracking).eq('id',MAIL_ID).maybeSingle();
  if(error||!mail||mail.state!=='sent'||!mail.provider_id)return new NextResponse('Nicht verfügbar',{status:404,headers});
  // No request URL, fragment, IP, user agent or fingerprint stored. Minute buckets deduplicate scanner bursts.
  const bucket=new Date(Math.floor(Date.now()/60000)*60000).toISOString();
  await db.from('private_offer_mail_clicks').upsert({mail_id:MAIL_ID,label,bucket},{onConflict:'mail_id,label,bucket',ignoreDuplicates:true});
  // Fragmentless Location intentionally inherits the incoming fragment in browsers (RFC9110).
  return new NextResponse(null,{status:302,headers:{...headers,Location:LINKS[label]}});
 }catch{return new NextResponse('Vorübergehend nicht verfügbar',{status:503,headers});}
}
