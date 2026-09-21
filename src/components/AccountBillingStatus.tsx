import type { AccountBilling } from "@/lib/accountBilling";

type Lang = "de" | "fr" | "it" | "en";
const copy = {
  de: {
    active: "Premium aktiv", scheduled: "Kündigung zu einem späteren Termin", scheduledInfo: "Bis zu diesem Termin sind weitere automatische Verlängerungen möglich.", trial: "Premium in der Testphase", cancelled: "Abonnement gekündigt", ended: "Abonnement beendet", lifetime: "Lebenslanger Zugang freigeschaltet", free: "Gratis-Konto", attention: "Zahlungsstatus prüfen",
    until: "Premium nutzbar bis", periodEnd: "Laufzeitende", endedAt: "Zugang beendet am", trialUntil: "Testphase bis", renewAt: "Nächste Verlängerung am",
    noRenew: "Keine automatische Verlängerung.", balance: "Bereits offene Rechnungen bleiben davon unberührt.", unknown: "Das genaue Enddatum ist derzeit nicht verfügbar. Bitte kontaktiere hello@cleverli.ch.",
    noAccess: "Premium ist derzeit nicht aktiv.", lifetimeInfo: "Alle Klassen 1–6, für bis zu 3 Kinderprofile. Dieser Zugang verlängert sich nicht automatisch.",
    checking: "Abonnementstatus wird geprüft …", unavailable: "Der Abonnementstatus konnte nicht bestätigt werden. Bitte versuche es erneut oder kontaktiere hello@cleverli.ch.",
  },
  fr: {
    active: "Premium actif", scheduled: "Résiliation prévue à une date ultérieure", scheduledInfo: "Des renouvellements automatiques restent possibles avant cette date.", trial: "Premium en période d’essai", cancelled: "Abonnement résilié", ended: "Abonnement terminé", lifetime: "Accès à vie débloqué", free: "Compte gratuit", attention: "Vérifier le paiement",
    until: "Premium utilisable jusqu’au", periodEnd: "Fin de période", endedAt: "Accès terminé le", trialUntil: "Période d’essai jusqu’au", renewAt: "Prochain renouvellement le",
    noRenew: "Aucun renouvellement automatique.", balance: "Les factures déjà ouvertes restent dues.", unknown: "La date de fin exacte n’est pas disponible actuellement. Contacte hello@cleverli.ch.",
    noAccess: "Premium n’est pas actif actuellement.", lifetimeInfo: "Toutes les années 1–6, pour jusqu’à 3 profils enfants. Cet accès ne se renouvelle pas automatiquement.",
    checking: "Vérification de l’abonnement …", unavailable: "Le statut de l’abonnement n’a pas pu être confirmé. Réessaie ou contacte hello@cleverli.ch.",
  },
  it: {
    active: "Premium attivo", scheduled: "Annullamento previsto in una data successiva", scheduledInfo: "Prima di questa data sono ancora possibili rinnovi automatici.", trial: "Premium nel periodo di prova", cancelled: "Abbonamento annullato", ended: "Abbonamento terminato", lifetime: "Accesso a vita sbloccato", free: "Account gratuito", attention: "Verifica il pagamento",
    until: "Premium utilizzabile fino al", periodEnd: "Fine del periodo", endedAt: "Accesso terminato il", trialUntil: "Periodo di prova fino al", renewAt: "Prossimo rinnovo il",
    noRenew: "Nessun rinnovo automatico.", balance: "Le fatture già aperte restano dovute.", unknown: "La data di fine esatta non è al momento disponibile. Contatta hello@cleverli.ch.",
    noAccess: "Premium non è attualmente attivo.", lifetimeInfo: "Tutte le classi 1–6, fino a 3 profili bambino. Questo accesso non si rinnova automaticamente.",
    checking: "Verifica dell’abbonamento …", unavailable: "Non è stato possibile confermare lo stato dell’abbonamento. Riprova o contatta hello@cleverli.ch.",
  },
  en: {
    active: "Premium active", scheduled: "Cancellation scheduled for a later date", scheduledInfo: "Further automatic renewals may occur before this date.", trial: "Premium trial", cancelled: "Subscription cancelled", ended: "Subscription ended", lifetime: "Lifetime access unlocked", free: "Free account", attention: "Check payment status",
    until: "Premium usable until", periodEnd: "Period ends on", endedAt: "Access ended on", trialUntil: "Trial until", renewAt: "Next renewal on",
    noRenew: "No automatic renewal.", balance: "Any outstanding invoices remain payable.", unknown: "The exact end date is currently unavailable. Please contact hello@cleverli.ch.",
    noAccess: "Premium is not currently active.", lifetimeInfo: "All grades 1–6, for up to 3 child profiles. This access does not renew automatically.",
    checking: "Checking subscription status …", unavailable: "The subscription status could not be confirmed. Please retry or contact hello@cleverli.ch.",
  },
};
export default function AccountBillingStatus({ billing, lang, loading = false }: { billing: AccountBilling | null; lang: Lang; loading?: boolean }) {
  const t = copy[lang];
  const stopped = billing && ["cancelled", "ended"].includes(billing.state);
  const date = billing?.endAt && Number.isFinite(Date.parse(billing.endAt)) ? new Date(billing.endAt) : null;
  return <section aria-live="polite" data-testid="account-billing-status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 space-y-2">
    <h2 className="font-bold">{billing ? t[billing.state] : loading ? t.checking : t.unavailable}</h2>
    {billing && <>
      {billing.state === "lifetime" ? <p>{t.lifetimeInfo}</p> : billing.state !== "free" && <>
        {date ? <p>{billing.state === "ended" ? t.endedAt : stopped && billing.accessActive ? t.until : billing.state === "trial" ? t.trialUntil : billing.state === "active" ? t.renewAt : t.periodEnd}{" "}
          <time dateTime={billing.endAt!}>{new Intl.DateTimeFormat(`${lang}-CH`, { dateStyle: "long", timeStyle: "long", timeZone: "Europe/Zurich" }).format(date)}</time>{" (Europe/Zurich)"}
        </p> : <p>{t.unknown}</p>}
        {!billing.accessActive && billing.state !== "ended" && <p>{t.noAccess}</p>}
      </>}
      {billing.state === "scheduled" && <p className="font-semibold">{t.scheduledInfo}</p>}
      {stopped && <><p className="font-semibold">{t.noRenew}</p><p className="text-xs">{t.balance}</p></>}
    </>}
  </section>;
}
