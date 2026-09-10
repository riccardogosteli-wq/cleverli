import { NextRequest, NextResponse } from 'next/server';
import { INTERNAL_LOG_COOKIE, verifyInternalSession } from '@/lib/internalDashboardAuth';
import { approvedFeedbackEmail, FEEDBACK_RECIPIENTS, FEEDBACK_SUBJECT, FEEDBACK_FROM, FEEDBACK_REPLY_TO, FEEDBACK_CAMPAIGN } from '@/lib/customerFeedbackCampaign';
import { feedbackStatus } from '@/lib/customerFeedbackMail';
import { sendCustomerFeedbackRequestEmail } from '@/lib/email';

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
    const ledger = await feedbackStatus();
    if (req.nextUrl.searchParams.get('status') === '1') return NextResponse.json({ campaign: FEEDBACK_CAMPAIGN, recipients: FEEDBACK_RECIPIENTS, ledger }, { headers });
    return new NextResponse(`<!doctype html><html lang="de"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Feedback-Einladungen</title><style>body{font:16px/1.5 system-ui;margin:0;background:#f0fdf4;color:#143b26}main{max-width:850px;margin:auto;padding:24px}section,form{background:white;border:1px solid #bbd8c4;border-radius:12px;padding:20px;margin:20px 0}select,button{font:inherit;max-width:100%;padding:12px;border-radius:8px;border:1px solid #15803d}select{width:100%;background:white}button{background:#15803d;color:white;min-height:48px;cursor:pointer}label{display:block;margin:16px 0}li{overflow-wrap:anywhere;padding:12px 0;border-bottom:1px solid #ddd}input{width:20px;height:20px;vertical-align:middle}a{color:#166534}h1{line-height:1.2}</style></head><body><main><a href="/internal-log-dashboard">Zurück zum Dashboard</a><h1>Freigegebene Feedback-Einladungen</h1><section><p>Genau 17 freigegebene Empfänger. Einzelversand, keine Kontaktaufnahme ausserhalb dieser Liste.</p><p>Von: ${escape(FEEDBACK_FROM)}<br>Antwort an: ${FEEDBACK_REPLY_TO}<br>Betreff: <strong>${FEEDBACK_SUBJECT}</strong></p><p>Alle teilnehmenden Premium-Familien erhalten 1 Monat Premium gratis. Zusätzlich gewinnen 3 Familien je 3 Monate Premium.</p><p>Das bestehende Feedbackformular protokolliert Antworten. Diese Steuerung ändert keine Konten, Zahlungen oder Prämien.</p></section><form method="post"><label for="email">Freigegebener Empfänger</label><select id="email" name="email">${FEEDBACK_RECIPIENTS.map(email => `<option value="${email}">${email}</option>`).join('')}</select><p><button name="action" value="preview">Prüfen, ohne Versand</button></p><label><input type="checkbox" name="confirmed" value="yes"> Empfänger und freigegebenen Inhalt geprüft</label><button name="action" value="send">Einladung einmal senden</button></form><section><h2>Versandprotokoll</h2><p>Bereits reservierte Einladungen bleiben dauerhaft gesperrt. Bei unklarem Versand zuerst den Anbieterbeleg abgleichen, niemals erneut senden.</p><ul>${ledger.map(row => `<li><strong>${escape(row.email)}</strong><br>Status: ${escape(row.state)}${row.provider_id ? `<br>Beleg: ${escape(row.provider_id)}<br>Versandt: ${escape(row.sent_at)}` : ''}</li>`).join('')}</ul><a href="?status=1">Vollständige Belege als JSON</a></section></main></body></html>`, { headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
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
    if ([...form.keys()].some(k => !['email', 'action', 'confirmed'].includes(k)) || form.getAll('email').length !== 1 || form.getAll('action').length !== 1) throw Error('invalid_fields');
    email = approvedFeedbackEmail(form.get('email'));
  } catch { return NextResponse.json({ error: 'invalid_request' }, { status: 400, headers }); }
  const action = form.get('action');
  if (action !== 'preview' && action !== 'send') return NextResponse.json({ error: 'invalid_action' }, { status: 400, headers });
  if (action === 'send' && form.get('confirmed') !== 'yes') return NextResponse.json({ error: 'confirmation_required' }, { status: 400, headers });
  try {
    if (action === 'preview') {
      const ledger = await feedbackStatus(email);
      return NextResponse.json({ dryRun: true, email, sender: FEEDBACK_FROM, replyTo: FEEDBACK_REPLY_TO, subject: FEEDBACK_SUBJECT, campaign: FEEDBACK_CAMPAIGN, ledger, productionSendEnabled: process.env.VERCEL_ENV === 'production' && Boolean(process.env.RESEND_API_KEY) }, { headers });
    }
    const receipt = await sendCustomerFeedbackRequestEmail(email);
    return NextResponse.json({ ok: true, email, providerId: receipt.id, sender: FEEDBACK_FROM, replyTo: FEEDBACK_REPLY_TO, subject: FEEDBACK_SUBJECT }, { headers });
  } catch { return NextResponse.json({ error: 'not_sent_or_receipt_reconciliation_required', email }, { status: 409, headers }); }
}
