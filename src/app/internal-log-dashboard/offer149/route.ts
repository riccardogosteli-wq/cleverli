import { NextRequest, NextResponse } from 'next/server';
import { INTERNAL_LOG_COOKIE, verifyInternalSession } from '@/lib/internalDashboardAuth';
import { FROM, RECIPIENTS, SUBJECT, TEMPLATE } from '@/lib/offer149Campaign';
import { execute149 } from '@/lib/offer149Transport';
import { services149 } from '@/lib/offer149Server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;
const headers = { 'Cache-Control': 'no-store, private', 'Referrer-Policy': 'same-origin', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'" };
const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers });
function authorized(req: NextRequest) { try { return verifyInternalSession(req.cookies.get(INTERNAL_LOG_COOKIE)?.value); } catch { return false; } }
const escape = (s: string) => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export async function GET(req: NextRequest) {
  if (!authorized(req)) return json({ error: 'unauthorized' }, 401);
  if (req.nextUrl.searchParams.get('status') === '1') {
    try { return json({ recipients: await services149().status() }); } catch { return json({ error: 'status_unavailable' }, 503); }
  }
  return new NextResponse(`<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Freigegebenes CHF 149 Angebot</title><main style="max-width:720px;margin:auto;padding:20px;font:16px/1.6 Arial"><h1>CHF 149 Kampagne, V3</h1><p>Von: ${escape(FROM)}<br>Antwort an: hello@cleverli.ch<br>Betreff: ${SUBJECT}</p><p>Nur die 9 fest freigegebenen Empfänger. Eine E-Mail pro Klick. Die Prüfung sendet nichts. Keine Änderung von Premiumrechten. Versand nur in Produktion.</p><p>Vor jedem Versand prüfen. Nach jedem Versand den Beleg und Providerstatus lesen. Bei reserviertem oder unklarem Ergebnis niemals erneut senden. Die Reservierung bleibt dauerhaft gesperrt.</p><form method="post" enctype="multipart/form-data"><label>Empfänger <select name="recipient" required>${RECIPIENTS.map(r => `<option value="${escape(r.email)}">${escape(r.email)}</option>`).join('')}</select></label><p><label>Private customer-material.json <input type="file" name="material" accept="application/json" required></label></p><button name="action" value="preview">Prüfen, ohne Versand</button><p><label><input type="checkbox" name="confirmed" value="yes"> Genau diesen Empfänger und V3 Inhalt endgültig freigeben</label></p><button name="action" value="send">Genau eine E-Mail senden</button></form><form method="post" enctype="multipart/form-data"><h2>Providerbeleg prüfen</h2><select name="recipient">${RECIPIENTS.map(r => `<option>${escape(r.email)}</option>`).join('')}</select><button name="action" value="verify">Nur lesen, nicht senden</button></form><p><a href="?status=1">Dauerhaften Versandstatus lesen</a></p><h2>Exakt freigegebener Inhalt, ohne persönlichen Link</h2>${TEMPLATE.replace('__CHECKOUT__','#').replace(/<!doctype html>|<html[^>]*>|<\/html>|<head>[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi,'')}</main></html>`, { headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } });
}
export async function POST(req: NextRequest) {
  if (!authorized(req)) return json({ error: 'unauthorized' }, 401);
  if (req.headers.get('origin') !== req.nextUrl.origin || req.headers.get('sec-fetch-site') === 'cross-site') return json({ error: 'origin' }, 403);
  if (!req.headers.get('content-type')?.startsWith('multipart/form-data;')) return json({ error: 'content_type' }, 415);
  // Bound actual bytes, not just attacker-controlled Content-Length. Never echo file contents/errors.
  const reader = req.body?.getReader(); if (!reader) return json({ error: 'body' }, 400);
  try {
    const chunks: Uint8Array[] = []; let size = 0;
    for (;;) { const r = await reader.read(); if (r.done) break; size += r.value.length; if (size > 30000) { await reader.cancel(); return json({ error: 'size' }, 413); } chunks.push(r.value); }
    const form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': req.headers.get('content-type')! } }).formData();
    if ([...form.keys()].some(k => !['recipient','action','material','confirmed'].includes(k)) || [...new Set(form.keys())].some(k => form.getAll(k).length !== 1)) return json({ error: 'fields' }, 400);
    const email = form.get('recipient'); const recipient = RECIPIENTS.find(r => r.email === email);
    const action = form.get('action');
    if (!recipient || !['preview','send','verify'].includes(String(action))) return json({ error: 'action_or_recipient' }, 400);
    if (action === 'verify') {
      if (form.has('material') || form.has('confirmed')) return json({ error: 'fields' }, 400);
      return json(await services149().verify(recipient));
    }
    if (action === 'send' && form.get('confirmed') !== 'yes') return json({ error: 'confirmation_required' }, 400);
    const file = form.get('material');
    if (!(file instanceof File) || file.size > 24000) return json({ error: 'material' }, 400);
    return json(await execute149(await file.text(), recipient.email, action === 'send', process.env.VERCEL_ENV === 'production', services149().io));
  } catch { return json({ error: 'not_sent_or_reconciliation_required', instruction: 'Read stored status and verify provider receipt. A reservation must never be retried.' }, 409); }
}
