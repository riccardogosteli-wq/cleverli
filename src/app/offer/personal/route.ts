import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { checkoutOffer, OfferError, tokenHash } from "@/lib/privateOffer";
import { privateOfferServices } from "@/lib/privateOfferServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const privacy = { "Cache-Control": "no-store, private", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow, noarchive" };

// Fragment capability never reaches access logs, Referer, analytics or the page URL
// after load. This standalone HTML deliberately bypasses the app analytics layout.
export function GET() {
  const nonce = randomBytes(18).toString("base64");
  const html = `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dein persönliches Angebot | Cleverli</title><style nonce="${nonce}">body{margin:0;background:#f0fdf4;font:18px/1.6 Arial,sans-serif;color:#1f2937}main{max-width:500px;margin:48px auto;padding:28px;background:white;border-radius:20px}h1{color:#15803d;font-size:26px}button{background:#15803d;color:white;border:0;border-radius:10px;padding:16px;font:inherit;cursor:pointer}button:disabled{opacity:.6}a{color:#15803d}@media(max-width:560px){main{margin:20px;padding:24px}}</style><main><h1>Dein persönliches Angebot</h1><p>Öffne hier die sichere Zahlungsseite für dein persönliches Cleverli Angebot.</p><button id="open" type="button">Zahlungsseite öffnen</button><p id="status" role="status" aria-live="polite"></p><a href="https://www.cleverli.ch">Zurück zu Cleverli</a></main><script nonce="${nonce}">(()=>{const token=location.hash.slice(1);history.replaceState(null,'',location.pathname);const button=document.getElementById('open'),status=document.getElementById('status');if(!/^[a-f0-9]{64}$/.test(token)){button.disabled=true;status.textContent='Bitte öffne den vollständigen Link aus deiner E-Mail.';return;}button.onclick=async()=>{button.disabled=true;status.textContent='Die Zahlungsseite wird vorbereitet.';try{const r=await fetch(location.pathname,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token}),credentials:'omit',cache:'no-store'});const d=await r.json();if(r.ok&&typeof d.url==='string'&&new URL(d.url).origin==='https://checkout.stripe.com'){location.replace(d.url);return;}status.textContent=d.message||'Das Angebot ist momentan nicht verfügbar. Bitte kontaktiere hello@cleverli.ch.';}catch{status.textContent='Die Zahlungsseite konnte nicht geöffnet werden. Bitte versuche es erneut.';}button.disabled=false;};})();</script></html>`;
  return new NextResponse(html, { headers: { ...privacy, "Content-Type": "text/html; charset=utf-8",
    "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'` } });
}

export async function POST(req: NextRequest) {
  const fail = (message: string, status: number) => NextResponse.json({ message }, { status, headers: privacy });
  if (req.headers.get("origin") !== new URL(req.url).origin || !req.headers.get("content-type")?.startsWith("application/json")) {
    return fail("Ungültige Anfrage.", 403);
  }
  // Read bounded data without echoing credentials or forwarding exception context.
  const reader = req.body?.getReader();
  if (!reader) return fail("Ungültige Anfrage.", 400);
  let raw = "";
  try {
    for (;;) { const { value, done } = await reader.read(); if (done) break;
      raw += new TextDecoder().decode(value); if (raw.length > 256) { await reader.cancel(); return fail("Ungültige Anfrage.", 413); } }
    const hash = tokenHash(JSON.parse(raw).token ?? "");
    if (!hash) return fail("Dieses Angebot ist nicht verfügbar.", 404);
    const { store, gateway } = privateOfferServices();
    const o = await store.byHash(hash);
    if (!o) return fail("Dieses Angebot ist nicht verfügbar.", 404);
    const url = await checkoutOffer(o, store, gateway, Math.floor(Date.now() / 1000));
    return NextResponse.json({ url }, { headers: privacy });
  } catch (e) {
    if (e instanceof OfferError && e.code === "expired") return fail("Dieses Angebot ist abgelaufen.", 410);
    if (e instanceof OfferError && ["redeemed", "ineligible"].includes(e.code)) return fail("Dieses Angebot kann nicht erneut verwendet werden.", 409);
    return fail("Das Angebot ist momentan nicht verfügbar. Bitte kontaktiere hello@cleverli.ch.", 503);
  }
}
