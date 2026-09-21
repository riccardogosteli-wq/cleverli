import type Stripe from "stripe";
import { subscriptionEnd } from "./accountBilling";

export const CANCELLATION_FROM = "Cleverli <hello@cleverli.ch>";
export const CANCELLATION_REPLY_TO = "hello@cleverli.ch";
export type CancellationLocale = "de" | "fr" | "it" | "en";
export type CancellationPayload = { from: string; replyTo: string; to: string; subject: string; html: string; text: string };
export type CancellationMailRow = {
  id: string; subscription_id: string; customer_id: string; user_id: string;
  cancelled_at: number; end_at: string; access_active: boolean; payload: CancellationPayload;
  state: "pending" | "accepted" | "suppressed" | "review";
  lease_id: string | null; lease_until: string | null; first_attempt_at: string | null; provider_id: string | null;
};

export function cancellationTransition(event: Stripe.Event, notBefore: number) {
  if (event.livemode !== true || event.type !== "customer.subscription.updated" || event.created < notBefore) return null;
  const sub = event.data.object as Stripe.Subscription;
  const previous = event.data.previous_attributes as { cancel_at_period_end?: boolean; cancel_at?: number | null } | undefined;
  if (sub.metadata?.site !== "cleverli.ch" || !["monthly", "yearly"].includes(sub.metadata.plan ?? "") || !sub.metadata.userId) return null;
  if (sub.metadata.trial_upgrade_id || sub.metadata.private_offer_id || !["active", "trialing", "past_due", "unpaid", "paused"].includes(sub.status)) return null;
  if (!(previous?.cancel_at_period_end === false && sub.cancel_at_period_end) &&
      !(previous?.cancel_at === null && sub.cancel_at && sub.cancel_at > event.created)) return null;
  if (!sub.canceled_at || sub.canceled_at < notBefore || sub.canceled_at > event.created + 300) return null;
  return sub;
}

export function confirmedMailSubscription(sub: Stripe.Subscription, cancelledAt: number, now = Date.now()) {
  if (sub.metadata?.site !== "cleverli.ch" || !["monthly", "yearly"].includes(sub.metadata.plan ?? "")) return null;
  if (sub.metadata.trial_upgrade_id || sub.metadata.private_offer_id || sub.canceled_at !== cancelledAt) return null;
  if (!["active", "trialing", "past_due", "unpaid", "paused"].includes(sub.status) || (!sub.cancel_at_period_end && !sub.cancel_at)) return null;
  const endAt = subscriptionEnd(sub);
  return endAt && Date.parse(endAt) > now ? endAt : null;
}

const words = {
  de: { subject: "Deine Kündigung bei Cleverli ist bestätigt", hello: "Hallo", confirmed: "Dein Cleverli-Abonnement ist gekündigt.", until: "Dein Premium-Zugang bleibt bis", suffix: "nutzbar.", noRenew: "Es gibt keine automatische Verlängerung.", balance: "Bereits offene Rechnungen bleiben davon unberührt.", thanks: "Danke, dass Cleverli eure Familie beim Lernen begleiten durfte. Euer Lernfortschritt bleibt in eurem Konto gespeichert.", help: "Bei Fragen antworte einfach auf diese E-Mail.", account: "Mein Konto", privacy: "Datenschutz", terms: "AGB", service: "Diese Nachricht bestätigt deine Kündigung und ist keine Werbe-E-Mail." },
  fr: { subject: "Ta résiliation Cleverli est confirmée", hello: "Bonjour", confirmed: "Ton abonnement Cleverli est résilié.", until: "Ton accès Premium reste utilisable jusqu’au", suffix: ".", noRenew: "Il n’y aura aucun renouvellement automatique.", balance: "Les factures déjà ouvertes restent dues.", thanks: "Merci d’avoir laissé Cleverli accompagner votre famille dans ses apprentissages. Votre progression reste enregistrée dans votre compte.", help: "Pour toute question, réponds simplement à cet e-mail.", account: "Mon compte", privacy: "Confidentialité", terms: "Conditions", service: "Ce message confirme ta résiliation. Ce n’est pas un e-mail publicitaire." },
  it: { subject: "Il tuo annullamento Cleverli è confermato", hello: "Ciao", confirmed: "Il tuo abbonamento Cleverli è annullato.", until: "Il tuo accesso Premium resta utilizzabile fino al", suffix: ".", noRenew: "Non ci sarà alcun rinnovo automatico.", balance: "Le fatture già aperte restano dovute.", thanks: "Grazie per aver scelto Cleverli per accompagnare la vostra famiglia nell’apprendimento. I vostri progressi restano salvati nell’account.", help: "Per qualsiasi domanda, rispondi a questa e-mail.", account: "Il mio account", privacy: "Privacy", terms: "Condizioni", service: "Questo messaggio conferma l’annullamento e non è un’e-mail pubblicitaria." },
  en: { subject: "Your Cleverli cancellation is confirmed", hello: "Hello", confirmed: "Your Cleverli subscription is cancelled.", until: "Your Premium access remains available until", suffix: ".", noRenew: "There will be no automatic renewal.", balance: "Any outstanding invoices remain payable.", thanks: "Thank you for letting Cleverli support your family’s learning. Your learning progress stays saved in your account.", help: "If you have any questions, simply reply to this email.", account: "My account", privacy: "Privacy", terms: "Terms", service: "This message confirms your cancellation and is not a marketing email." },
};
function escape(value: string) { return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]!)); }
export function cancellationEmail(recipient: string, endAt: string, locale: CancellationLocale, accessActive: boolean): CancellationPayload {
  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(recipient) || !Number.isFinite(Date.parse(endAt))) throw Error("invalid_cancellation_message");
  const t = words[locale];
  const date = new Intl.DateTimeFormat(`${locale}-CH`, { dateStyle: "long", timeStyle: "long", timeZone: "Europe/Zurich" }).format(new Date(endAt)) + " (Europe/Zurich)";
  // Unpaid/paused access must not be described as usable simply because renewal stopped.
  const unavailable = { de: "Premium ist derzeit nicht aktiv. Das bestätigte Laufzeitende ist", fr: "Premium n’est pas actif actuellement. La date de fin confirmée est le", it: "Premium non è attualmente attivo. La data di fine confermata è il", en: "Premium is not currently active. The confirmed period ends on" }[locale];
  const period = accessActive ? `${t.until} ${date}${locale === "de" ? " " : ""}${t.suffix}` : `${unavailable} ${date}.`;
  const lines = [t.hello + ",", t.confirmed, period, t.noRenew, t.balance, t.thanks, t.help, "Dein Cleverli-Team"];
  lines[lines.length - 1] = { de: "Dein Cleverli-Team", fr: "L’équipe Cleverli", it: "Il team Cleverli", en: "The Cleverli team" }[locale];
  const footer = `Cleverli | hello@cleverli.ch | ${t.privacy}: https://www.cleverli.ch/datenschutz | ${t.terms}: https://www.cleverli.ch/agb`;
  return {
    from: CANCELLATION_FROM, replyTo: CANCELLATION_REPLY_TO, to: recipient,
    subject: t.subject,
    text: `${lines.join("\n\n")}\n\n${t.account}: https://www.cleverli.ch/account\n\n${footer}\n${t.service}`,
    html: `<!doctype html><html lang="${locale}"><body style="margin:0;background:#f0fdf4;font-family:Arial,sans-serif;color:#173b2a"><main style="max-width:560px;margin:24px auto;padding:28px;background:white;border-radius:20px"><h1 style="font-size:23px">${escape(t.subject)}</h1>${lines.map(line => `<p style="line-height:1.6">${escape(line)}</p>`).join("")}<p><a href="https://www.cleverli.ch/account" style="color:#15803d">${escape(t.account)}</a></p><footer style="font-size:12px;color:#64746b;line-height:1.6">Cleverli · <a href="mailto:hello@cleverli.ch">hello@cleverli.ch</a><br><a href="https://www.cleverli.ch/datenschutz">${t.privacy}</a> · <a href="https://www.cleverli.ch/agb">${t.terms}</a><p>${escape(t.service)}</p></footer></main></body></html>`,
  };
}

export interface CancellationMailIO {
  claim(id: string): Promise<CancellationMailRow | null>;
  eligible(row: CancellationMailRow): Promise<boolean>;
  send(payload: CancellationPayload, key: string): Promise<string>;
  finish(row: CancellationMailRow, outcome: "accepted" | "suppressed" | "pending", providerId?: string, retrySeconds?: number): Promise<void>;
}
export class CancellationRetry extends Error {
  constructor(public seconds = 600) { super("cancellation_mail_retry"); }
}
export async function deliverCancellation(io: CancellationMailIO, id: string) {
  const row = await io.claim(id);
  if (!row) return "not_claimed";
  try {
    if (!await io.eligible(row)) { await io.finish(row, "suppressed"); return "suppressed"; }
    if (row.payload.from !== CANCELLATION_FROM || row.payload.replyTo !== CANCELLATION_REPLY_TO) throw Error("sender_not_allowed");
    if (!row.lease_until || Date.parse(row.lease_until) <= Date.now() || !row.first_attempt_at || Date.parse(row.first_attempt_at) <= Date.now() - 23 * 3600000) throw new CancellationRetry();
    const providerId = await io.send(row.payload, `cleverli-cancellation-v1-${row.id}`);
    if (!providerId) throw Error("provider_receipt_missing");
    await io.finish(row, "accepted", providerId);
    return "accepted"; // Provider acceptance is NOT delivery.
  } catch (error) {
    // Same frozen payload/key only. SQL stops retries before provider dedupe expiry.
    await io.finish(row, "pending", undefined, error instanceof CancellationRetry ? error.seconds : 600);
    return "pending";
  }
}
