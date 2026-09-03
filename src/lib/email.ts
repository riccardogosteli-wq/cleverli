import { Resend } from "resend";

const FROM = "Cleverli <hello@cleverli.ch>";
const ADMIN_PAYMENT_NOTIFY_EMAIL =
  process.env.ADMIN_PAYMENT_NOTIFY_EMAIL || "hello@cleverli.ch";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY is not configured; email not sent");
    return null;
  }
  return new Resend(key);
}

function escapeHtml(value: string | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCurrency(amount: number | null | undefined, currency: string | null | undefined) {
  if (typeof amount !== "number") return "Unbekannter Betrag";
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: (currency || "CHF").toUpperCase(),
  }).format(amount / 100);
}

// ── Welcome email after signup ───────────────────────────────────────────────
export async function sendWelcomeEmail(to: string) {
  const resend = getResend();
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  const { error } = await resend.emails.send({
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
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">Willkommen bei Cleverli! 🎉</h1>
    </div>
    <!-- Body -->
    <div style="padding:32px 28px;color:#1f2937;">
      <p style="font-size:16px;margin:0 0 16px;">Dein Konto ist bereit — Lernen kann sofort losgehen!</p>
      <p style="font-size:14px;color:#6b7280;margin:0 0 24px;">
        Mit Cleverli lernen Kinder Mathe, Deutsch, NMG, Sprachen und Medien spielerisch —
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
        Kostenlos starten, in Ruhe ausprobieren und später entscheiden.
      </p>
    </div>
    <!-- Footer -->
    <div style="border-top:1px solid #e5e7eb;padding:16px 28px;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">
        Cleverli · Alexandra Gosteli Digital Solutions · Langenmooserstrasse 22, 8467 Truttikon<br>
        <a href="https://www.cleverli.ch/datenschutz" style="color:#9ca3af;">Datenschutz</a> · 
        <a href="https://www.cleverli.ch/impressum" style="color:#9ca3af;">Impressum</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  });
  if (error) throw error;
}

// ── Payment confirmation email ────────────────────────────────────────────────
export async function sendPaymentConfirmationEmail(
  to: string,
  name: string,
  plan: "monthly" | "yearly" | "schooltime",
  options?: { idempotencyKey?: string }
) {
  const resend = getResend();
  if (!resend) return;
  const greeting = name?.trim()
    ? `Hallo ${escapeHtml(name.trim())}, danke für dein Vertrauen in Cleverli!`
    : "Danke für dein Vertrauen in Cleverli!";
  const planLabel = plan === "schooltime"
    ? "Lebenslanger Zugang (einmalig CHF 249)"
    : plan === "yearly"
      ? "Jahres-Abo (CHF 99/Jahr)"
      : "Monats-Abo (CHF 9.90/Monat)";
  const planDetails = plan === "schooltime"
    ? "Lebenslanger Zugang – keine Verlängerung und keine weiteren Abbuchungen."
    : plan === "yearly"
      ? "Du sparst 2 Monate gegenüber dem Monatsabo."
      : "Dein Monatsabo ist aktiv. Die nächste Abbuchung erfolgt in 30 Tagen.";

  const { error } = await resend.emails.send({
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
      <p style="font-size:16px;margin:0 0 16px;">${greeting}</p>
      <p style="font-size:15px;line-height:1.7;color:#4b5563;margin:0 0 20px;">
        Mit Premium ist die ganze Cleverli-Welt für euch freigeschaltet: mehr als 13’000 interaktive Übungen für die Schweizer Primarschule, abgestimmt auf den Lehrplan 21.
      </p>
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
          <li>🚀 Mehr als 13’000 interaktive Übungen</li>
          <li>📚 Alle verfügbaren Fächer passend zur Klasse deines Kindes</li>
          <li>🇨🇭 Inhalte passend zur Schweizer Primarschule und zum Lehrplan 21</li>
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
    </div>
    <!-- Footer -->
    <div style="border-top:1px solid #e5e7eb;padding:16px 28px;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">
        Cleverli · Alexandra Gosteli Digital Solutions · Langenmooserstrasse 22, 8467 Truttikon<br>
        <a href="https://www.cleverli.ch/agb" style="color:#9ca3af;">AGB</a> · 
        <a href="https://www.cleverli.ch/datenschutz" style="color:#9ca3af;">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  }, options?.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : undefined);

  if (error) throw error;
}

export async function sendManualPremiumInviteEmail(
  to: string,
  name: string,
  passwordSetupUrl: string,
  options?: { idempotencyKey?: string }
) {
  const resend = getResend();
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const safeName = name?.trim() ? escapeHtml(name.trim()) : "";
  const greeting = safeName ? `Hallo ${safeName}` : "Hallo";
  const safePasswordSetupUrl = escapeHtml(passwordSetupUrl);

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Dein Cleverli Premium ist aktiv",
    html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
    <div style="background:linear-gradient(135deg,#d97706,#f59e0b);padding:32px 24px;text-align:center;">
      <img src="https://www.cleverli.ch/cleverli-logo.png" alt="Cleverli" width="160" style="margin:0 auto 8px;display:block;" />
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">Premium aktiviert!</h1>
    </div>
    <div style="padding:32px 28px;color:#1f2937;">
      <p style="font-size:16px;margin:0 0 16px;">${greeting}, schön bist du bei Cleverli.</p>
      <p style="font-size:15px;line-height:1.7;color:#4b5563;margin:0 0 20px;">
        Dein Cleverli Premium-Zugang ist kostenlos freigeschaltet. Es wurde keine Zahlung ausgelöst und es gibt keine automatische Verlängerung.
      </p>
      <div style="background:#fffbeb;border:2px solid #fbbf24;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
        <p style="font-size:13px;font-weight:700;color:#92400e;margin:0 0 4px;">Dein Zugang</p>
        <p style="font-size:15px;font-weight:800;color:#1f2937;margin:0 0 4px;">Cleverli Premium</p>
        <p style="font-size:12px;color:#6b7280;margin:0;">Kostenlos aktiviert - ohne Abbuchung.</p>
      </div>
      <div style="background:#f0fdf4;border-radius:12px;padding:16px 20px;margin:0 0 24px;">
        <p style="font-size:13px;margin:0 0 8px;font-weight:700;color:#15803d;">Jetzt freigeschaltet:</p>
        <ul style="font-size:13px;color:#374151;margin:0;padding-left:18px;line-height:1.8;">
          <li>Mehr als 13'000 interaktive Übungen</li>
          <li>Alle verfügbaren Fächer passend zur Klasse deines Kindes</li>
          <li>Inhalte passend zur Schweizer Primarschule und zum Lehrplan 21</li>
          <li>Belohnungs-System für Kinder</li>
          <li>Bis zu 3 Kinderprofile</li>
          <li>Elternbereich mit Statistiken</li>
        </ul>
      </div>
      <div style="text-align:center;margin:28px 0;">
        <a href="${safePasswordSetupUrl}"
           style="background:#16a34a;color:#fff;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:800;font-size:16px;display:inline-block;">
          Passwort setzen & loslegen
        </a>
      </div>
      <p style="font-size:12px;color:#6b7280;line-height:1.6;margin:0;">
        Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:<br>
        <a href="${safePasswordSetupUrl}" style="color:#15803d;word-break:break-all;">${safePasswordSetupUrl}</a>
      </p>
    </div>
    <div style="border-top:1px solid #e5e7eb;padding:16px 28px;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">
        Cleverli · Alexandra Gosteli Digital Solutions · Langenmooserstrasse 22, 8467 Truttikon<br>
        <a href="https://www.cleverli.ch/datenschutz" style="color:#9ca3af;">Datenschutz</a>
        · <a href="https://www.cleverli.ch/impressum" style="color:#9ca3af;">Impressum</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    text: `${greeting}, schön bist du bei Cleverli.

Dein Cleverli Premium-Zugang ist kostenlos freigeschaltet. Es wurde keine Zahlung ausgelöst und es gibt keine automatische Verlängerung.

Passwort setzen und loslegen:
${passwordSetupUrl}

Liebe Grüsse
Cleverli`,
  }, options?.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : undefined);

  if (error) throw error;
}

export async function sendAdminPaymentNotificationEmail({
  customerEmail,
  plan,
  amountTotal,
  currency,
  stripeCustomerId,
  stripeSubscriptionId,
  idempotencyKey,
}: {
  customerEmail: string;
  plan: "monthly" | "yearly" | "schooltime";
  amountTotal?: number | null;
  currency?: string | null;
  stripeCustomerId: string;
  stripeSubscriptionId?: string | null;
  idempotencyKey?: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const planLabel = plan === "schooltime" ? "Lebenslanger Zugang" : plan === "yearly" ? "Jahres-Abo" : "Monats-Abo";
  const amountLabel = formatCurrency(amountTotal, currency);
  const safeCustomerEmail = escapeHtml(customerEmail || "Unbekannt");
  const safeStripeCustomerId = escapeHtml(stripeCustomerId);
  const safeStripeSubscriptionId = escapeHtml(stripeSubscriptionId || "Einmalzahlung – kein Abo");

  const { error } = await resend.emails.send({
    from: FROM,
    to: ADMIN_PAYMENT_NOTIFY_EMAIL,
    subject: `Neue Cleverli Zahlung: ${amountLabel} (${planLabel})`,
    html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
    <div style="background:#16a34a;padding:24px 28px;">
      <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:800;">Neue Cleverli Zahlung</h1>
    </div>
    <div style="padding:28px;">
      <p style="font-size:15px;margin:0 0 20px;">Ein Cleverli Premium-Abo wurde bezahlt.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:10px 0;color:#64748b;border-bottom:1px solid #e5e7eb;">Kunde</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;">${safeCustomerEmail}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#64748b;border-bottom:1px solid #e5e7eb;">Plan</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;">${planLabel}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#64748b;border-bottom:1px solid #e5e7eb;">Betrag</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:700;">${amountLabel}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#64748b;border-bottom:1px solid #e5e7eb;">Stripe Customer</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-family:monospace;font-size:12px;">${safeStripeCustomerId}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#64748b;">Stripe Abo</td>
          <td style="padding:10px 0;text-align:right;font-family:monospace;font-size:12px;">${safeStripeSubscriptionId}</td>
        </tr>
      </table>
      <div style="text-align:center;margin:28px 0 0;">
        <a href="https://dashboard.stripe.com/customers/${safeStripeCustomerId}"
           style="background:#111827;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:700;display:inline-block;">
          In Stripe öffnen
        </a>
      </div>
    </div>
  </div>
</body>
</html>`,
  }, idempotencyKey ? { idempotencyKey } : undefined);

  if (error) throw error;
}
