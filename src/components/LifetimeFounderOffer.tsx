"use client";

import { trackAdsLpCtaClick } from "@/lib/analytics";
import { startCheckout } from "@/lib/checkoutClient";
import { useLang } from "@/lib/LangContext";
import { isSchooltimeOfferActive } from "@/lib/schooltimeOffer";

type LifetimeFounderOfferProps = {
  uid?: string;
  checkoutSource: string;
  pageKey?: string;
  pagePath?: string;
  className?: string;
};

export default function LifetimeFounderOffer({
  uid = "",
  checkoutSource,
  pageKey,
  pagePath,
  className = "",
}: LifetimeFounderOfferProps) {
  const { lang } = useLang();
  const tr = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  if (!isSchooltimeOfferActive()) return null;

  const startLifetimeCheckout = async () => {
    if (pageKey || pagePath) {
      await trackAdsLpCtaClick(
        "paid",
        "pricing",
        "/api/checkout?plan=schooltime",
        "schooltime",
        { page: pageKey, page_path: pagePath }
      );
    }
    startCheckout("schooltime", checkoutSource, uid);
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-green-50 p-6 shadow-lg shadow-amber-100 ${className}`}>
      <div className="absolute right-0 top-0 rounded-bl-2xl bg-amber-400 px-4 py-2 text-xs font-black uppercase tracking-wide text-amber-950">
        {tr("Nur für kurze Zeit", "Pour une durée limitée", "Solo per poco tempo", "For a limited time")}
      </div>
      <div className="max-w-md space-y-3 pt-6 sm:pt-0">
        <div className="text-sm font-black uppercase tracking-widest text-green-700">
          {tr("Gründeraktion", "Offre de lancement", "Offerta lancio", "Founder offer")}
        </div>
        <h2 className="text-2xl font-black text-gray-900">
          {tr("Lebenslanger Zugang zu Cleverli", "Accès à vie à Cleverli", "Accesso a vita a Cleverli", "Lifetime access to Cleverli")}
        </h2>
        <p className="text-sm leading-relaxed text-gray-600">
          {tr(
            "Einmal bezahlen, lebenslang nutzen: alle Klassen 1–6 und bis zu 3 Kinderprofile.",
            "Payez une seule fois, utilisez Cleverli à vie : toutes les années 1–6 et jusqu’à 3 profils enfants.",
            "Paga una sola volta, usa Cleverli a vita: tutte le classi 1–6 e fino a 3 profili bambino.",
            "Pay once, use Cleverli for life: all grades 1–6 and up to 3 child profiles."
          )}
        </p>
      </div>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-green-800">CHF 249</span>
            <span className="text-sm font-semibold text-gray-500">{tr("einmalig", "une fois", "una tantum", "one-time")}</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {tr("Lebenslanger Zugang. Keine Verlängerung. Keine weiteren Abbuchungen.", "Accès à vie. Sans renouvellement ni autre prélèvement.", "Accesso a vita. Nessun rinnovo o ulteriore addebito.", "Lifetime access. No renewal. No further charges.")}
          </p>
        </div>
        <button
          type="button"
          onClick={startLifetimeCheckout}
          className="min-h-12 rounded-xl bg-amber-400 px-6 py-3 font-black text-amber-950 transition-all hover:bg-amber-300 active:scale-95"
        >
          {tr("Einmalig sichern →", "Profiter de l’offre →", "Ottieni l’offerta →", "Get the offer →")}
        </button>
      </div>
      <p className="mt-4 text-xs text-gray-400">
        {tr("Vergleich: 6 Jahre × CHF 99/Jahr.", "Comparaison : 6 ans × CHF 99/an.", "Confronto: 6 anni × CHF 99/anno.", "Comparison: 6 years × CHF 99/year.")}
      </p>
    </div>
  );
}
