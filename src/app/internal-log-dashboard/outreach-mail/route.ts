import { NextRequest, NextResponse } from 'next/server';
import { INTERNAL_LOG_COOKIE, verifyInternalSession } from '@/lib/internalDashboardAuth';
import { outreachRecipient, outreachContent, OUTREACH_RECIPIENTS, OUTREACH_SUBJECT, OUTREACH_FROM, OUTREACH_REPLY_TO, OUTREACH_CAMPAIGN } from '@/lib/outreachCampaign';
import { outreachStatus } from '@/lib/outreachMail';
import { sendApprovedOutreachEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = {
  'Cache-Control': 'no-store', 'Referrer-Policy': 'same-origin', 'X-Robots-Tag': 'noindex, nofollow',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
};
const escape = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
function authorized(req: NextRequest) {
  try { return verifyInternalSession(req.cookies.get(INTERNAL_LOG_COOKIE)?.value); } catch { return false; }
}
export async function GET(req: NextRequest) {
  if (!authorized(req)) return new NextResponse('Bitte zuerst im internen Dashboard anmelden.', { status: 401, headers });
  try {
    const ledger = await outreachStatus();
    if (req.nextUrl.searchParams.get('status') === '1') return NextResponse.json({ campaign: OUTREACH_CAMPAIGN, recipients: OUTREACH_RECIPIENTS, ledger }, { headers });
    return new NextResponse(`<!doctype html><html lang="de"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lernempfehlungen</title><style>body{font:16px/1.5 system-ui;margin:0;background:#f0fdf4;color:#143b26}main{max-width:850px;margin:auto;padding:24px}section,form{background:white;border:1px solid #bbd8c4;border-radius:12px;padding:20px;margin:20px 0}select,button{font:inherit;max-width:100%;padding:12px;border-radius:8px;border:1px solid #15803d}select{width:100%;background:white}button{background:#15803d;color:white;min-height:48px;cursor:pointer}label{display:block;margin:16px 0}li{overflow-wrap:anywhere;padding:12px 0;border-bottom:1px solid #ddd}input{width:20px;height:20px;vertical-align:middle}a{color:#166534}h1{line-height:1.2}</style></head><body><main><a href="/internal-log-dashboard">Zurück zum Dashboard</a><h1>Freigegebene Lernempfehlungen</h1><section><p>Genau 5 freigegebene Empfänger. Einzelversand, keine Kontaktaufnahme ausserhalb dieser Liste.</p><p>Von: ${escape(OUTREACH_FROM)}<br>Antwort an: ${OUTREACH_REPLY_TO}<br>Betreff: <strong>${OUTREACH_SUBJECT}</strong></p><p>Freigegebener Inhalt mit persönlicher Anrede und Homepage www.cleverli.ch, unterzeichnet von Alexandra und dem Cleverli-Team.</p><p>Keine Konten, Premiumfreischaltungen, Abonnements oder zusätzlichen Empfänger. Unklare Belege bleiben gesperrt.</p></section><form method="post"><label for="email">Freigegebener Empfänger</label><select id="email" name="email">${OUTREACH_RECIPIENTS.map(r => `<option value="${r.email}">${escape(r.organisation)}: ${r.email}</option>`).join('')}</select><p><button name="action" value="preview">Prüfen, ohne Versand</button></p><label><input type="checkbox" name="confirmed" value="yes"> Empfänger und freigegebenen Inhalt geprüft</label><button name="action" value="send">Einladung einmal senden</button></form><section><h2>Versandprotokoll</h2><p>Bereits reservierte Einladungen bleiben dauerhaft gesperrt. Bei unklarem Versand zuerst den Anbieterbeleg abgleichen, niemals erneut senden.</p><ul>${ledger.map(row => `<li><strong>${escape(row.email)}</strong><br>Status: ${escape(row.state)}${row.provider_id ? `<br>Beleg: ${escape(row.provider_id)}<br>Versandt: ${escape(row.sent_at)}` : ''}</li>`).join('')}</ul><a href="?status=1">Vollständige Belege als JSON</a></section></main></body></html>`, { headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
  } catch { return NextResponse.json({ error: 'store_unavailable' }, { status: 503, headers }); }
}
export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers });
  if (req.headers.get('origin') !== req.nextUrl.origin) return NextResponse.json({ error: 'origin' }, { status: 403, headers });
  if (Number(req.headers.get('content-length') || 0) > 4096) return NextResponse.json({ error: 'size' }, { status: 413, headers });
  let form: FormData;
  let email: string;
  try {
    form = await req.formData();
    if ([...form.keys()].some(k => !['email', 'action', 'confirmed'].includes(k)) || form.getAll('email').length !== 1 || form.getAll('action').length !== 1 || form.getAll('confirmed').length > 1) throw Error('invalid_fields');
    email = outreachRecipient(form.get('email')).email;
  } catch { return NextResponse.json({ error: 'invalid_request' }, { status: 400, headers }); }
  const action = form.get('action');
  if (action !== 'preview' && action !== 'send') return NextResponse.json({ error: 'invalid_action' }, { status: 400, headers });
  if (action === 'send' && form.get('confirmed') !== 'yes') return NextResponse.json({ error: 'confirmation_required' }, { status: 400, headers });
  try {
    if (action === 'preview') {
      const ledger = await outreachStatus(email);
      return NextResponse.json({ dryRun: true, email, content: outreachContent(email), sender: OUTREACH_FROM, replyTo: OUTREACH_REPLY_TO, subject: OUTREACH_SUBJECT, campaign: OUTREACH_CAMPAIGN, ledger, productionSendEnabled: process.env.VERCEL_ENV === 'production' && Boolean(process.env.RESEND_API_KEY) }, { headers });
    }
    const receipt = await sendApprovedOutreachEmail(email);
    return NextResponse.json({ ok: true, email, providerId: receipt.id, sender: OUTREACH_FROM, replyTo: OUTREACH_REPLY_TO, subject: OUTREACH_SUBJECT }, { headers });
  } catch { return NextResponse.json({ error: 'not_sent_or_receipt_reconciliation_required', email }, { status: 409, headers }); }
}
