"use client";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { useLang } from "@/lib/LangContext";

export default function UpgradePageClient() {
  const { session, loaded } = useSession();
  const { lang } = useLang();
  const uid = session?.userId ?? "";
  // Don't disable buttons while session is loading — they go to /upgrade if no uid
  const buttonsReady = loaded;

  const checkoutUrl = (plan: "monthly" | "yearly") =>
    `/api/checkout?plan=${plan}${uid ? `&uid=${uid}` : ""}`;

  const t = {
    de: {
      headline: "Alle Aufgaben. Unbegrenzt.",
      sub: "Schalte alle 50 Aufgaben pro Thema frei — Leicht, Mittel und Schwer.",
      monthly: "Monatlich",
      yearly: "Jährlich",
      monthlyPrice: "CHF 9.90",
      yearlyPrice: "CHF 99",
      monthlyPer: "/Monat",
      yearlyPer: "/Jahr",
      yearlySave: "2 Monate gratis",
      cta: "Jetzt starten",
      cancel: "Jederzeit kündbar",
      features: [
        "✅ Alle 50 Aufgaben pro Thema",
        "✅ 3 Stufen: Leicht · Mittel · Schwer",
        "✅ Alle Fächer (Mathe, Deutsch, NMG)",
        "✅ Alle Klassen 1–6",
        "✅ Fortschritt & Trophäen",
        "✅ Elternbereich mit Statistiken",
        "✅ TWINT, Visa & Mastercard",
      ],
      alreadyPremium: "Du hast bereits Premium! 🎉",
      dashboard: "Zum Dashboard",
      note: "Sicher bezahlen mit",
      noLogin: "Erstelle zuerst ein kostenloses Konto, dann abonnieren.",
      signup: "Konto erstellen",
    },
    fr: {
      headline: "Tous les exercices. Sans limite.",
      sub: "Débloquez les 50 exercices par thème — Facile, Moyen et Difficile.",
      monthly: "Mensuel", yearly: "Annuel",
      monthlyPrice: "CHF 9.90", yearlyPrice: "CHF 99",
      monthlyPer: "/mois", yearlyPer: "/an",
      yearlySave: "2 mois gratuits", cta: "Commencer",
      cancel: "Résiliable à tout moment",
      features: ["✅ 50 exercices par thème","✅ 3 niveaux","✅ Toutes les matières","✅ Années 1–3","✅ Trophées & progrès","✅ Espace parents","✅ TWINT, Visa & Mastercard"],
      alreadyPremium: "Vous avez déjà Premium ! 🎉",
      dashboard: "Tableau de bord",
      note: "Paiement sécurisé avec",
      noLogin: "Créez un compte gratuit pour vous abonner.",
      signup: "Créer un compte",
    },
    it: {
      headline: "Tutti gli esercizi. Illimitati.",
      sub: "Sblocca tutti i 50 esercizi per argomento — Facile, Medio e Difficile.",
      monthly: "Mensile", yearly: "Annuale",
      monthlyPrice: "CHF 9.90", yearlyPrice: "CHF 99",
      monthlyPer: "/mese", yearlyPer: "/anno",
      yearlySave: "2 mesi gratis", cta: "Inizia ora",
      cancel: "Annullabile in qualsiasi momento",
      features: ["✅ 50 esercizi per argomento","✅ 3 livelli","✅ Tutte le materie","✅ Classi 1–3","✅ Trofei e progressi","✅ Area genitori","✅ TWINT, Visa & Mastercard"],
      alreadyPremium: "Hai già Premium! 🎉",
      dashboard: "Dashboard",
      note: "Pagamento sicuro con",
      noLogin: "Crea prima un account gratuito.",
      signup: "Crea account",
    },
    en: {
      headline: "All exercises. Unlimited.",
      sub: "Unlock all 50 exercises per topic — Easy, Medium and Hard.",
      monthly: "Monthly", yearly: "Yearly",
      monthlyPrice: "CHF 9.90", yearlyPrice: "CHF 99",
      monthlyPer: "/month", yearlyPer: "/year",
      yearlySave: "2 months free", cta: "Get started",
      cancel: "Cancel anytime",
      features: ["✅ All 50 exercises per topic","✅ 3 difficulty levels","✅ All subjects","✅ Grades 1–3","✅ Trophies & progress","✅ Parent dashboard","✅ TWINT, Visa & Mastercard"],
      alreadyPremium: "You already have Premium! 🎉",
      dashboard: "Go to Dashboard",
      note: "Pay securely with",
      noLogin: "Create a free account first, then subscribe.",
      signup: "Create account",
    },
  };

  const rewardFeature = {
    de: {
      label: "Nur bei Premium",
      title: "Eltern setzen Ziele — Kinder arbeiten darauf hin 🎁",
      desc: "Du bestimmst die Belohnung. Dein Kind sieht das Ziel und bleibt motiviert.",
      examples: ["🦁 Ausflug in den Zoo", "🍦 Glace essen gehen", "🎮 Extra Spielzeit", "✏️ Eigene Belohnung"],
      goal: "Ziel: 20 Aufgaben lösen",
      progress: "12 / 20",
      notification: "🎉 Lena hat ihr Ziel erreicht!",
    },
    fr: {
      label: "Premium uniquement",
      title: "Les parents fixent les objectifs — les enfants y travaillent 🎁",
      desc: "Tu choisis la récompense. Ton enfant voit l'objectif et reste motivé.",
      examples: ["🦁 Sortie au zoo", "🍦 Manger une glace", "🎮 Temps de jeu en plus", "✏️ Récompense personnelle"],
      goal: "Objectif : résoudre 20 exercices",
      progress: "12 / 20",
      notification: "🎉 Léa a atteint son objectif !",
    },
    it: {
      label: "Solo Premium",
      title: "I genitori fissano gli obiettivi — i bambini ci lavorano 🎁",
      desc: "Tu scegli il premio. Il tuo bambino vede l'obiettivo e rimane motivato.",
      examples: ["🦁 Gita allo zoo", "🍦 Gelato insieme", "🎮 Tempo di gioco extra", "✏️ Premio personalizzato"],
      goal: "Obiettivo: risolvere 20 esercizi",
      progress: "12 / 20",
      notification: "🎉 Lena ha raggiunto il suo obiettivo!",
    },
    en: {
      label: "Premium only",
      title: "Parents set goals — kids work toward them 🎁",
      desc: "You pick the reward. Your child sees the goal and stays motivated.",
      examples: ["🦁 Trip to the zoo", "🍦 Ice cream outing", "🎮 Extra screen time", "✏️ Custom reward"],
      goal: "Goal: solve 20 exercises",
      progress: "12 / 20",
      notification: "🎉 Lena reached her goal!",
    },
  };
  const rx = rewardFeature[lang as keyof typeof rewardFeature] ?? rewardFeature.de;

  const tx = t[lang as keyof typeof t] ?? t.de;

  if (session?.premium) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="text-6xl">⭐</div>
          <h2 className="text-2xl font-bold text-gray-800">{tx.alreadyPremium}</h2>
          <Link href="/dashboard" className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-all">
            {tx.dashboard}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-5xl">🚀</div>
        <h1 className="text-3xl font-black text-gray-800">{tx.headline}</h1>
        <p className="text-gray-500">{tx.sub}</p>
      </div>

      {/* Features */}
      <div className="bg-green-50 rounded-2xl p-5 space-y-2">
        {tx.features.map((f, i) => (
          <div key={i} className="text-sm text-green-800">{f}</div>
        ))}
      </div>

      {/* Parent rewards highlight */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🎯</div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-0.5">{rx.label}</div>
            <h2 className="text-base font-bold text-gray-800">{rx.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{rx.desc}</p>
          </div>
        </div>

        {/* Mock UI preview */}
        <div className="bg-white rounded-xl p-4 border border-amber-100 space-y-3">
          {/* Reward examples row */}
          <div className="flex flex-wrap gap-2">
            {rx.examples.map((ex, i) => (
              <span key={i} className={`text-xs px-2.5 py-1 rounded-full font-medium ${i === 0 ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-600"}`}>
                {ex}
              </span>
            ))}
          </div>
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{rx.goal}</span>
              <span className="font-bold text-amber-600">{rx.progress}</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: "60%" }} />
            </div>
          </div>
          {/* Notification mock */}
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <span className="text-lg">🔔</span>
            <span className="text-xs font-medium text-green-800">{rx.notification}</span>
          </div>
        </div>
      </div>

      {/* No account nudge */}
      {!uid && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-2">
          <p className="text-sm text-amber-800">{tx.noLogin}</p>
          <Link href="/signup" className="inline-block bg-amber-500 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-amber-600 transition-all">
            {tx.signup}
          </Link>
        </div>
      )}

      {/* Plans */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Monthly */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 space-y-4 hover:border-green-300 transition-all">
          <div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{tx.monthly}</div>
            <div className="text-4xl font-black text-gray-800 mt-1">{tx.monthlyPrice}<span className="text-lg font-medium text-gray-400">{tx.monthlyPer}</span></div>
          </div>
          <Link href={checkoutUrl("monthly")}
            className="block text-center py-3 rounded-xl font-bold text-base transition-all active:scale-95 bg-green-600 text-white hover:bg-green-700">
            {tx.cta} →
          </Link>
          <p className="text-xs text-gray-400 text-center">{tx.cancel}</p>
        </div>

        {/* Yearly — highlighted */}
        <div className="bg-green-600 rounded-2xl p-6 space-y-4 relative shadow-lg shadow-green-200">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-black px-3 py-1 rounded-full">
            {tx.yearlySave}
          </div>
          <div>
            <div className="text-sm font-semibold text-green-200 uppercase tracking-wide">{tx.yearly}</div>
            <div className="text-4xl font-black text-white mt-1">{tx.yearlyPrice}<span className="text-lg font-medium text-green-300">{tx.yearlyPer}</span></div>
          </div>
          <Link href={checkoutUrl("yearly")}
            className="block text-center py-3 rounded-xl font-bold text-base transition-all active:scale-95 bg-white text-green-700 hover:bg-green-50">
            {tx.cta} →
          </Link>
          <p className="text-xs text-green-300 text-center">{tx.cancel}</p>
        </div>
      </div>

      {/* Payment methods */}
      <div className="text-center space-y-2">
        <p className="text-xs text-gray-400">{tx.note}</p>
        <div className="flex items-center justify-center gap-3 text-2xl">
          <span title="TWINT">🇨🇭</span>
          <span className="text-sm font-bold text-gray-600">TWINT</span>
          <span className="text-gray-300">·</span>
          <span className="text-sm font-bold text-gray-600">Visa</span>
          <span className="text-gray-300">·</span>
          <span className="text-sm font-bold text-gray-600">Mastercard</span>
        </div>
        <p className="text-xs text-gray-400">Powered by Payrexx · SSL verschlüsselt</p>
      </div>
    </div>
  );
}
