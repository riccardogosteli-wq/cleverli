import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { INTERNAL_LOG_COOKIE, verifyInternalSession } from '@/lib/internalDashboardAuth';
import { validateTeacherAction } from '@/lib/teacherAccount';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control':'no-store', 'Referrer-Policy':'same-origin', 'X-Robots-Tag':'noindex, nofollow', 'Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'" };
const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
function authorized(req: NextRequest) { try { return verifyInternalSession(req.cookies.get(INTERNAL_LOG_COOKIE)?.value); } catch { return false; } }
function db() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false,autoRefreshToken:false} }); }
export async function GET(req: NextRequest) {
  if (!authorized(req)) return new NextResponse('Bitte zuerst im internen Dashboard anmelden.',{status:401,headers});
  try {
    const client=db();
    const [parents,teachers,audit] = await Promise.all([
      client.from('parent_profiles').select('id,email,name').order('email').limit(1000),
      client.from('teacher_accounts').select('*').order('updated_at',{ascending:false}),
      client.from('teacher_account_audit').select('*').order('created_at',{ascending:false}).limit(50),
    ]);
    if (parents.error || teachers.error || audit.error) throw Error('store');
    return new NextResponse(`<!doctype html><html lang="de"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lehrerkonten | Cleverli</title><style>body{font:16px/1.5 system-ui;background:#f0fdf4;color:#143b26;margin:0}main{max-width:850px;margin:auto;padding:24px}section,form{background:white;border:1px solid #bbd8c4;border-radius:12px;padding:20px;margin:20px 0}input,select,button{font:inherit;padding:12px;max-width:100%;box-sizing:border-box}input:not([type=checkbox]),select{display:block;width:100%;margin:8px 0 20px}button{background:#15803d;color:white;border:0;border-radius:8px;min-height:48px;margin:6px}label{display:block}li{overflow-wrap:anywhere;padding:10px}a{color:#166534}</style></head><body><main><a href="/internal-log-dashboard">Zurück zum Dashboard</a><h1>Lehrerkonten</h1><p>Manuelle Freischaltung nach Vereinbarung. Keine Zahlung, keine automatische E-Mail und kein neues Benutzerkonto. Familienabonnements und deren Abrechnung bleiben unverändert.</p><p>Lehrpersonen registrieren zunächst ein eigenes Erwachsenenkonto. Ein aktives Lehrerkonto erhält Premium-Zugang und unbegrenzt viele Kinderprofile für die vereinbarte Klasse. CHF 99 pro Klasse und Jahr, einschliesslich gemeinsamem Zugang für die Lehrpersonen derselben Klasse. Keine Weitergabe an Kinder oder andere Klassen. Schule und Klasse im Feld unten erfassen. Nach Ablauf bleiben bestehende Profile erhalten; neue Profile unterliegen wieder dem Familienlimit.</p><form method="post"><label for="userId">Bestehendes Konto</label><select required id="userId" name="userId"><option value="">Konto auswählen</option>${parents.data.map(p=>`<option value="${escape(p.id)}">${escape(p.email)} (${escape(p.name)})</option>`).join('')}</select><label for="school">Schule und Klasse</label><input id="school" name="school" maxlength="160" minlength="2"><label for="until">Zugang gültig bis einschliesslich (UTC)</label><input id="until" name="until" type="date"><p><button name="action" value="preview">Konto prüfen, nichts ändern</button></p><label><input type="checkbox" name="confirmed" value="yes"> Konto, Einrichtung und vereinbarte Laufzeit geprüft. Eine bestehende Familienrechnung wird dadurch nicht beendet.</label><p><button name="action" value="grant">Lehrerkonto freischalten / verlängern</button><button name="action" value="revoke">Lehrerzugang beenden</button></p></form><section><h2>Freigaben</h2><ul>${teachers.data.map(t=>`<li>${escape(parents.data.find(p=>p.id===t.user_id)?.email || t.user_id)}: ${escape(t.school_name)}<br>${t.active?'Freigegeben':'Beendet'}, gültig bis ${escape(t.valid_until)}</li>`).join('') || '<li>Noch keine Lehrerkonten freigeschaltet.</li>'}</ul></section><section><h2>Änderungsprotokoll</h2><ul>${audit.data.map(a=>`<li>${escape(a.created_at)}: ${escape(a.action)} · ${escape(a.user_id)} · ${escape(a.school_name)}</li>`).join('') || '<li>Noch keine Änderungen.</li>'}</ul></section></main></body></html>`,{headers:{...headers,'Content-Type':'text/html; charset=utf-8'}});
  } catch { return NextResponse.json({error:'store_unavailable'},{status:503,headers}); }
}
export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({error:'unauthorized'},{status:401,headers});
  if (req.headers.get('origin')!==req.nextUrl.origin || (req.headers.get('sec-fetch-site') && req.headers.get('sec-fetch-site')!=='same-origin')) return NextResponse.json({error:'origin'},{status:403,headers});
  if (Number(req.headers.get('content-length')||0)>4096) return NextResponse.json({error:'size'},{status:413,headers});
  let input;
  try { const text=await req.text(); if (text.length>4096) throw Error('size'); input=validateTeacherAction(new FormDataFromParams(text)); } catch { return NextResponse.json({error:'invalid_request'},{status:400,headers}); }
  try {
    const client=db();
    const parent=await client.from('parent_profiles').select('id,email,name').eq('id',input.userId).maybeSingle();
    if (parent.error) throw Error('store');
    if (!parent.data) return NextResponse.json({error:'account_not_found'},{status:404,headers});
    if (input.action==='preview') {
      const teacher=await client.from('teacher_accounts').select('*').eq('user_id',input.userId).maybeSingle();
      if (teacher.error) throw Error('store');
      return NextResponse.json({dryRun:true,account:parent.data,teacher:teacher.data,changed:false},{headers});
    }
    const result=await client.rpc('set_teacher_account',{p_user_id:input.userId,p_action:input.action,p_school_name:input.school,p_valid_until:input.until});
    if (result.error) return NextResponse.json({error:'teacher_account_not_changed'},{status:409,headers});
    return NextResponse.redirect(new URL('/internal-log-dashboard/teacher-accounts',req.url),{status:303,headers});
  } catch { return NextResponse.json({error:'store_unavailable'},{status:503,headers}); }
}
// Native forms only; reject arbitrary/multipart objects and duplicate fields in the validator.
class FormDataFromParams extends FormData { constructor(text:string) { super(); for(const [k,v] of new URLSearchParams(text)) this.append(k,v); } }
