import { NextRequest, NextResponse } from 'next/server';
import { INTERNAL_LOG_COOKIE, verifyInternalSession } from '@/lib/internalDashboardAuth';
import { FROM,TO,SUBJECT,MAIL_ID,mailDb,prepareMail,sendFixedMail } from '@/lib/privateOfferMail';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':"default-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"};
function authorized(req:NextRequest){try{return verifyInternalSession(req.cookies.get(INTERNAL_LOG_COOKIE)?.value);}catch{return false;}}
export async function GET(req:NextRequest){
 if(!authorized(req))return new NextResponse('Bitte zuerst im internen Dashboard anmelden.',{status:401,headers});
 if(req.nextUrl.searchParams.get('events')==='1'){
  const db=mailDb();const {data:mail,error}=await db.from('private_offer_mail').select('provider_id,state,sent_at').eq('id',MAIL_ID).maybeSingle();
  if(error)return NextResponse.json({error:'store_unavailable'},{status:503,headers});
  const {data:events,error:eventsError}=await db.from('private_offer_mail_clicks').select('label,created_at').eq('mail_id',MAIL_ID).order('created_at',{ascending:true}).limit(1000);
  if(eventsError)return NextResponse.json({error:'store_unavailable'},{status:503,headers});
  return NextResponse.json({mail,events,classification:'Recorded clicks may be automated scanners, not verified humans.'},{headers});
 }
 return new NextResponse(`<!doctype html><html lang="de"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Persönliches Angebot senden</title><main><h1>Freigegebenes Angebot</h1><p>Von: ${FROM.replace('<','&lt;').replace('>','&gt;')}</p><p>An: ${TO}</p><p>Betreff: ${SUBJECT}</p><p>Nur die exakt freigegebene HTML-Datei wird akzeptiert. Keine Premiumänderung. Vorschau sendet keine E-Mail.</p><form method="post" enctype="multipart/form-data"><label>Freigegebene HTML-Datei <input required type="file" name="artifact" accept="text/html"></label><p><button name="action" value="preview">Prüfen, ohne Versand</button></p><label><input type="checkbox" name="confirmed" value="yes"> Empfänger, Inhalt und Betreff geprüft</label><p><button name="action" value="send">Einmal endgültig senden</button></p></form><p><a href="?events=1">Versandstatus und Klickereignisse</a></p></main></html>`,{headers:{...headers,'Content-Type':'text/html; charset=utf-8'}});
}
export async function POST(req:NextRequest){
 if(!authorized(req))return NextResponse.json({error:'unauthorized'},{status:401,headers});
 if(req.headers.get('origin')!==req.nextUrl.origin)return NextResponse.json({error:'origin'},{status:403,headers});
 if(Number(req.headers.get('content-length')||0)>50000)return NextResponse.json({error:'size'},{status:413,headers});
 try{
  const form=await req.formData(),file=form.get('artifact');
  if(!(file instanceof File)||file.size>30000)return NextResponse.json({error:'artifact'},{status:400,headers});
  const artifact=await file.text();
  if(form.get('action')==='send'){
   if(form.get('confirmed')!=='yes')return NextResponse.json({error:'confirmation_required'},{status:400,headers});
   const receipt=await sendFixedMail(artifact);return NextResponse.json({ok:true,...receipt,from:FROM,to:TO,subject:SUBJECT},{headers});
  }
  const result=await prepareMail(artifact);return NextResponse.json({dryRun:true,from:FROM,to:TO,subject:SUBJECT,approvedBody:true,bodyHash:result.bodyHash,state:result.row.state,providerId:result.row.provider_id,productionSendEnabled:process.env.VERCEL_ENV==='production'},{headers});
 }catch{return NextResponse.json({error:'not_sent_or_receipt_reconciliation_required'}, {status:409,headers});}
}
