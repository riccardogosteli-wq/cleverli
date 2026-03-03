"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import { useSession } from "@/hooks/useSession";

const MAX_POLLS = 12;  // 12 × 2.5s = 30s max wait
const POLL_INTERVAL = 2500;

export default function SuccessClient() {
  const { lang } = useLang();
  const { session, loaded, isPremium } = useSession();
  const [pollCount, setPollCount] = useState(0);
  const [activated, setActivated] = useState(false);

  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  // Poll Supabase until premium is set (webhook fires within ~2-5s usually)
  useEffect(() => {
    if (isPremium) { setActivated(true); return; }
    if (!loaded) return;
    if (pollCount >= MAX_POLLS) { setActivated(true); return; } // give up, show CTA anyway

    const timer = setTimeout(async () => {
      // Force refresh the session from Supabase
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        if (session?.userId) {
          const { data } = await supabase
            .from("parent_profiles")
            .select("premium")
            .eq("id", session.userId)
            .single();
          if (data?.premium) {
            setActivated(true);
            return;
          }
        }
      } catch { /* ignore */ }
      setPollCount(c => c + 1);
    }, POLL_INTERVAL);

    return () => clearTimeout(timer);
  }, [isPremium, pollCount, loaded, session]);

  const features = [
    t("Alle 50 Aufgaben pro Thema freigeschaltet", "Tous les 50 exercices par thème débloqués", "Tutti i 50 esercizi per argomento sbloccati", "All 50 exercises per topic unlocked"),
    t("Alle Stufen: Leicht · Mittel · Schwer", "Tous les niveaux : Facile · Moyen · Difficile", "Tutti i livelli: Facile · Medio · Difficile", "All difficulty tiers: Easy · Medium · Hard"),
    t("Detaillierte Lernfortschritte", "Suivi détaillé des progrès", "Progressi di apprendimento dettagliati", "Detailed learning progress"),
    t("Elternbereich mit Statistiken", "Espace parents avec statistiques", "Area genitori con statistiche", "Parent area with statistics"),
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 py-16">
        <div className="text-7xl">🎉</div>
        <h1 className="text-3xl font-black text-gray-800">
          {t("Willkommen bei Cleverli Premium!", "Bienvenue dans Cleverli Premium !", "Benvenuto in Cleverli Premium!", "Welcome to Cleverli Premium!")}
        </h1>
        <p className="text-gray-500 text-lg">
          {t("Dein Abonnement ist aktiv. Du hast jetzt unbegrenzten Zugang zu allen Aufgaben.",
             "Ton abonnement est actif. Tu as maintenant accès illimité à tous les exercices.",
             "Il tuo abbonamento è attivo. Ora hai accesso illimitato a tutti gli esercizi.",
             "Your subscription is active. You now have unlimited access to all exercises.")}
        </p>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-left space-y-2 text-sm text-green-800">
          {features.map(f => <div key={f}>✅ {f}</div>)}
        </div>

        {/* Activation status */}
        {!activated ? (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 space-y-2">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-amber-700">
                {t("Premium wird aktiviert…", "Activation du Premium…", "Attivazione Premium…", "Activating Premium…")}
              </span>
            </div>
            <p className="text-xs text-amber-500">
              {t("Das dauert normalerweise 5–10 Sekunden.",
                 "Cela prend généralement 5 à 10 secondes.",
                 "Di solito ci vogliono 5-10 secondi.",
                 "This usually takes 5–10 seconds.")}
            </p>
          </div>
        ) : (
          <div className="bg-green-100 border border-green-300 rounded-2xl px-5 py-3">
            <span className="text-green-800 font-bold">✅ {t("Premium ist aktiv!", "Premium est actif !", "Premium è attivo!", "Premium is active!")}</span>
          </div>
        )}

        <Link href="/dashboard"
          className={`inline-block px-8 py-4 rounded-full font-bold text-lg active:scale-95 transition-all shadow-md ${
            activated
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {t("Jetzt lernen! 🚀", "Commencer à apprendre ! 🚀", "Inizia a imparare! 🚀", "Start learning! 🚀")}
        </Link>
        <p className="text-xs text-gray-400">
          {t("Du erhältst eine Bestätigungs-E-Mail von Payrexx.",
             "Tu recevras un e-mail de confirmation de Payrexx.",
             "Riceverai un'e-mail di conferma da Payrexx.",
             "You will receive a confirmation email from Payrexx.")}
        </p>
      </div>
    </main>
  );
}
