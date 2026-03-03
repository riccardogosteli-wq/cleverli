import { Resend } from "resend";

const FROM = "Cleverli <hallo@cleverli.ch>";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// ── Welcome email after signup ───────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Willkommen bei Cleverli! 🎒",
    html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:32px 24px;text-align:center;">
      <img src="https://www.cleverli.ch/cleverli-logo.png" alt="Cleverli" width="160" style="margin:0 auto 8px;display:block;" />
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">Willkommen, ${name}! 🎉</h1>
    </div>
    <!-- Body -->
    <div style="padding:32px 28px;color:#1f2937;">
      <p style="font-size:16px;margin:0 0 16px;">Dein Konto ist bereit — Lernen kann sofort losgehen!</p>
      <p style="font-size:14px;color:#6b7280;margin:0 0 24px;">
        Mit Cleverli lernen Schweizer Kinder Mathe, Deutsch und NMG spielerisch —
        mit Aufgaben nach Lehrplan 21, lustigen Trophäen und täglichen Challenges.
      </p>
      <!-- CTA -->
      <div style="text-align:center;margin:28px 0;">
        <a href="https://www.cleverli.ch/dashboard"
           style="background:#16a34a;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:800;font-size:16px;display:inline-block;">
          Jetzt loslegen 🚀
        </a>
      </div>
      <!-- Features -->
      <div style="background:#f0fdf4;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
        <p style="font-size:13px;margin:0 0 8px;font-weight:700;color:#15803d;">✨ Was dich erwartet:</p>
        <ul style="font-size:13px;color:#374151;margin:0;padding-left:18px;line-height:1.8;">
          <li>🔢 Interaktive Mathe-Aufgaben ab Klasse 1</li>
          <li>📖 Deutsch — Buchstaben, Wörter, Sätze</li>
          <li>🌍 NMG — Natur, Mensch, Gesellschaft</li>
          <li>🏆 Trophäen & Level-System</li>
          <li>⚡ Tagesaufgabe mit Bonus-XP</li>
        </ul>
      </div>
      <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0;">
        Die ersten 5 Aufgaben pro Thema sind kostenlos. <a href="https://www.cleverli.ch/upgrade" style="color:#16a34a;">Premium freischalten →</a>
      </p>
    </div>
    <!-- Footer -->
    <div style="border-top:1px solid #e5e7eb;padding:16px 28px;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">
        Cleverli · Alexandra Gosteli · Langenmooserstrasse 22, 8467 Truttikon<br>
        <a href="https://www.cleverli.ch/datenschutz" style="color:#9ca3af;">Datenschutz</a> · 
        <a href="https://www.cleverli.ch/impressum" style="color:#9ca3af;">Impressum</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  });
}

// ── Payment confirmation email ────────────────────────────────────────────────
export async function sendPaymentConfirmationEmail(
  to: string,
  name: string,
  plan: "monthly" | "yearly"
) {
  const resend = getResend();
  if (!resend) return;
  const planLabel = plan === "yearly" ? "Jahres-Abo (CHF 99/Jahr)" : "Monats-Abo (CHF 9.90/Monat)";
  const planDetails = plan === "yearly"
    ? "Du sparst 2 Monate gegenüber dem Monatsabo."
    : "Jederzeit kündbar, nächste Abbuchung in 30 Tagen.";

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Dein Cleverli Premium ist aktiv! ⭐",
    html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#d97706,#f59e0b);padding:32px 24px;text-align:center;">
      <img src="https://www.cleverli.ch/cleverli-logo.png" alt="Cleverli" width="160" style="margin:0 auto 8px;display:block;" />
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">Premium aktiviert! ⭐</h1>
    </div>
    <!-- Body -->
    <div style="padding:32px 28px;color:#1f2937;">
      <p style="font-size:16px;margin:0 0 16px;">Hallo ${name}, danke für dein Vertrauen in Cleverli!</p>
      <!-- Plan info -->
      <div style="background:#fffbeb;border:2px solid #fbbf24;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
        <p style="font-size:13px;font-weight:700;color:#92400e;margin:0 0 4px;">📋 Dein Abo:</p>
        <p style="font-size:15px;font-weight:800;color:#1f2937;margin:0 0 4px;">${planLabel}</p>
        <p style="font-size:12px;color:#6b7280;margin:0;">${planDetails}</p>
      </div>
      <!-- What's unlocked -->
      <div style="background:#f0fdf4;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
        <p style="font-size:13px;margin:0 0 8px;font-weight:700;color:#15803d;">✅ Jetzt freigeschaltet:</p>
        <ul style="font-size:13px;color:#374151;margin:0;padding-left:18px;line-height:1.8;">
          <li>🚀 Alle 50 Aufgaben pro Thema</li>
          <li>📚 Alle Klassen 1–6 (Mathe, Deutsch, NMG)</li>
          <li>🎁 Belohnungs-System für Kinder</li>
          <li>👨‍👩‍👧‍👦 Bis zu 3 Kinderprofile</li>
          <li>📊 Elternbereich mit Statistiken</li>
        </ul>
      </div>
      <!-- CTA -->
      <div style="text-align:center;margin:28px 0;">
        <a href="https://www.cleverli.ch/dashboard"
           style="background:#16a34a;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:800;font-size:16px;display:inline-block;">
          Jetzt lernen 🎒
        </a>
      </div>
      <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0;">
        Kündigung jederzeit über <a href="https://www.cleverli.ch/account" style="color:#16a34a;">Mein Konto</a>.
        Dein Zugang läuft bis zum Ende der bezahlten Laufzeit.
      </p>
    </div>
    <!-- Footer -->
    <div style="border-top:1px solid #e5e7eb;padding:16px 28px;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">
        Cleverli · Alexandra Gosteli · Langenmooserstrasse 22, 8467 Truttikon<br>
        <a href="https://www.cleverli.ch/agb" style="color:#9ca3af;">AGB</a> · 
        <a href="https://www.cleverli.ch/datenschutz" style="color:#9ca3af;">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  });
}
