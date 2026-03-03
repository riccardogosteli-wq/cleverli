import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zahlung erfolgreich – Cleverli",
  robots: { index: false },
};

const LANG_DETECT = `
(function(){
  var l = navigator.language || navigator.userLanguage || '';
  l = l.toLowerCase();
  if (l.startsWith('fr')) return document.querySelectorAll('[data-lang]').forEach(function(el){
    if (el.dataset.lang === 'fr') el.style.display='';
    if (el.dataset.lang !== 'fr') el.style.display='none';
  });
  if (l.startsWith('it')) return document.querySelectorAll('[data-lang]').forEach(function(el){
    if (el.dataset.lang === 'it') el.style.display='';
    if (el.dataset.lang !== 'it') el.style.display='none';
  });
})();
`;

export default function PaymentSuccessPage() {
  const texts = {
    de: {
      title: "Willkommen bei Cleverli Premium! 🎉",
      sub: "Dein Abonnement ist aktiv. Du hast jetzt unbegrenzten Zugang zu allen Aufgaben.",
      f1: "Alle 50 Aufgaben pro Thema freigeschaltet",
      f2: "Alle Stufen: Leicht · Mittel · Schwer",
      f3: "Detaillierte Lernfortschritte",
      f4: "Elternbereich mit Statistiken",
      cta: "Jetzt lernen! 🚀",
      note: "Du erhältst eine Bestätigungs-E-Mail von Payrexx.",
    },
    fr: {
      title: "Bienvenue dans Cleverli Premium ! 🎉",
      sub: "Ton abonnement est actif. Tu as maintenant accès illimité à tous les exercices.",
      f1: "Tous les 50 exercices par thème débloqués",
      f2: "Tous les niveaux : Facile · Moyen · Difficile",
      f3: "Suivi détaillé des progrès",
      f4: "Espace parents avec statistiques",
      cta: "Commencer à apprendre ! 🚀",
      note: "Tu recevras un e-mail de confirmation de Payrexx.",
    },
    it: {
      title: "Benvenuto in Cleverli Premium! 🎉",
      sub: "Il tuo abbonamento è attivo. Ora hai accesso illimitato a tutti gli esercizi.",
      f1: "Tutti i 50 esercizi per argomento sbloccati",
      f2: "Tutti i livelli: Facile · Medio · Difficile",
      f3: "Progressi di apprendimento dettagliati",
      f4: "Area genitori con statistiche",
      cta: "Inizia ad imparare! 🚀",
      note: "Riceverai un'e-mail di conferma da Payrexx.",
    },
    en: {
      title: "Welcome to Cleverli Premium! 🎉",
      sub: "Your subscription is active. You now have unlimited access to all exercises.",
      f1: "All 50 exercises per topic unlocked",
      f2: "All difficulty tiers: Easy · Medium · Hard",
      f3: "Detailed learning progress tracking",
      f4: "Parent area with statistics",
      cta: "Start learning! 🚀",
      note: "You will receive a confirmation email from Payrexx.",
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 py-16">
        <div className="text-7xl">🎉</div>
        {Object.entries(texts).map(([lang, t]) => (
          <div key={lang} data-lang={lang} style={{ display: lang === "de" ? undefined : "none" }}>
            <h1 className="text-3xl font-black text-gray-800 mb-3">{t.title}</h1>
            <p className="text-gray-500 text-lg mb-4">{t.sub}</p>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-left space-y-2 text-sm text-green-800">
              <div>✅ {t.f1}</div>
              <div>✅ {t.f2}</div>
              <div>✅ {t.f3}</div>
              <div>✅ {t.f4}</div>
            </div>
            <p className="text-xs text-gray-400 mt-4">{t.note}</p>
          </div>
        ))}
        <Link
          href="/dashboard"
          className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 active:scale-95 transition-all shadow-md mt-2"
        >
          <span data-lang="de">Jetzt lernen! 🚀</span>
          <span data-lang="fr" style={{display:"none"}}>Commencer ! 🚀</span>
          <span data-lang="it" style={{display:"none"}}>Inizia ! 🚀</span>
          <span data-lang="en" style={{display:"none"}}>Start learning! 🚀</span>
        </Link>
        <script dangerouslySetInnerHTML={{ __html: LANG_DETECT }} />
      </div>
    </main>
  );
}
