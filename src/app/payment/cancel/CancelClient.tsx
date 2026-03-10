"use client";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { useLang } from "@/lib/LangContext";

export default function PaymentCancelPage() {
  const { session, loaded } = useSession();
  const { lang } = useLang();
  const uid = session?.userId ?? "";

  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  const checkoutUrl = (plan: "monthly" | "yearly") =>
    `/api/checkout?plan=${plan}${uid ? `&uid=${uid}` : ""}`;

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 py-16">
        <div className="text-6xl">😕</div>
        <h1 className="text-2xl font-bold text-gray-800">
          {t("Zahlung abgebrochen", "Paiement annulé", "Pagamento annullato", "Payment cancelled")}
        </h1>
        <p className="text-gray-500">
          {t(
            "Kein Problem — du kannst jederzeit ein Abonnement starten.",
            "Pas de problème — tu peux démarrer un abonnement à tout moment.",
            "Nessun problema — puoi avviare un abbonamento in qualsiasi momento.",
            "No problem — you can start a subscription at any time."
          )}
        </p>
        {loaded && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={checkoutUrl("monthly")}
              className="bg-green-700 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all">
              CHF 9.90{t("/Monat", "/mois", "/mese", "/month")}
            </Link>
            <Link href={checkoutUrl("yearly")}
              className="bg-green-700 text-white px-6 py-3 rounded-full font-bold hover:bg-green-800 active:scale-95 transition-all">
              CHF 99{t("/Jahr", "/an", "/anno", "/year")}
            </Link>
          </div>
        )}
        <Link href="/dashboard" className="block text-sm text-gray-400 hover:text-gray-600 underline">
          {t("Zurück zum Dashboard", "Retour au tableau de bord", "Torna alla dashboard", "Back to dashboard")}
        </Link>
      </div>
    </main>
  );
}
